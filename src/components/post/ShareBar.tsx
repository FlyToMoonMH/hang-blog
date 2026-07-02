"use client";

import { useState } from "react";

interface ShareBarProps {
  title: string;
  url?: string;
}

export function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToWeibo = () => {
    window.open(
      `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        title="复制链接"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-500">已复制</span>
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>复制链接</span>
          </>
        )}
      </button>

      <button
        onClick={shareToTwitter}
        className="rounded-lg border border-gray-200 p-1.5 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        title="分享到 Twitter"
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        onClick={shareToWeibo}
        className="rounded-lg border border-gray-200 p-1.5 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        title="分享到微博"
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439v.004h-.002zm-.206-1.043v.002c2.691-.262 4.747-1.918 4.564-3.682-.184-1.762-2.49-3.002-5.182-2.736-2.689.262-4.747 1.918-4.564 3.682.187 1.766 2.49 3.002 5.182 2.734zm.418-1.728c-.42.139-.953.062-1.252-.152-.301-.111-.418-.494-.227-.816.201-.291.605-.495.953-.383.451.101.924.527.953.916-.061.33-.209.313-.427.435zm5.29-6.83c-.42-.139-.708-.561-.561-.898.139-.328.551-.529.871-.391.453.151.754.581.602.898-.158.318-.5.519-.912.391zm-6.487-2.59c-.247-.547.146-1.176.653-1.337.548-.187 1.287.063 1.586.572.31.489.03 1.055-.453 1.262-.546.231-1.25.063-1.434-.281-.034-.076-.034-.158-.034-.158h-.055c-.061-.029-.091-.039-.176-.058h-.087zm8.293-1.957c-1.082-.359-2.262-.207-3.247.332l-.027-.039c-1.137-.336-2.346-.238-3.449.178l-.03-.039c-1.237-.324-2.578-.14-3.672.494l-.027-.039c-1.31-.348-2.713-.14-3.864.546l-.027-.039c-1.395-.367-2.902-.14-4.133.595C.679 7.968.183 9.546.479 11.04c.034.154.071.291.118.43.213.614.548 1.179.985 1.649l.026.034c.034.039.062.078.095.117.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.071.082.142.166.213.246.034.039.071.078.106.117.246.27.522.512.821.723.3.211.622.387.969.516.346.129.71.215 1.082.256.371.041.75.039 1.121-.012l.039-.004c.371-.041.738-.117 1.098-.23.359-.113.711-.262 1.047-.438.336-.176.656-.387.953-.621.297-.234.574-.496.821-.781.247-.285.47-.598.657-.93.187-.332.339-.688.451-1.059.112-.371.187-.762.221-1.16.034-.398.029-.801-.014-1.199-.043-.398-.13-.793-.256-1.172-.126-.379-.291-.742-.491-1.082z" />
        </svg>
      </button>

      <button
        onClick={handleNativeShare}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        title="更多分享方式"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>分享</span>
      </button>
    </div>
  );
}
