"use client";

import { useState, useRef, useEffect } from "react";
import CryptoJS from "crypto-js";

interface PasswordGateProps {
  slug: string;
  title: string;
}

/**
 * 客户端解密内容
 * AES-128-CBC, key = MD5(password), PKCS7 填充
 */
function decryptContent(
  password: string,
  ivBase64: string,
  ciphertextBase64: string
): string | false {
  try {
    const key = CryptoJS.MD5(password);
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext } as any,
      key,
      {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    );

    const text = decrypted.toString(CryptoJS.enc.Utf8);
    if (!text) return false;

    return text;
  } catch {
    return false;
  }
}

export function PasswordGate({ slug, title }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [decryptedHtml, setDecryptedHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [slug]);

  // 自动尝试解密
  async function tryDecrypt(pw: string) {
    setLoading(true);
    setError(false);

    try {
      const resp = await fetch(`/encrypted/${slug}.json`);
      if (!resp.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const data = await resp.json();
      const html = decryptContent(pw, data.iv, data.ciphertext);
      if (html) {
        setDecryptedHtml(html);
      } else {
        setError(true);
        localStorage.removeItem(`encrypt_${slug}`);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    tryDecrypt(password);
  }

  // 解密成功后渲染 HTML
  useEffect(() => {
    if (decryptedHtml && contentRef.current) {
      contentRef.current.innerHTML = decryptedHtml;
    }
  }, [decryptedHtml]);

  if (notFound) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          加密内容未找到，请重新构建后再试。
        </p>
      </div>
    );
  }

  if (decryptedHtml) {
    return (
      <div
        ref={contentRef}
        className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-pre:rounded-lg prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700"
      />
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        {/* 锁图标 */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500 dark:text-gray-400"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-center text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          此内容已加密，请输入密码查看
        </p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="输入密码..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            autoComplete="off"
          />

          {error && (
            <p className="mt-3 text-center text-sm text-red-500">
              密码错误，请重试
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            {loading ? "解密中..." : "解锁"}
          </button>
        </form>
      </div>
    </div>
  );
}
