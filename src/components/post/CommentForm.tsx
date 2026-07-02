"use client";

import { useState } from "react";

interface CommentFormProps {
  onSubmit: (name: string, content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
}

export function CommentForm({
  onSubmit,
  placeholder = "写下你的评论...",
  autoFocus = false,
  compact = false,
}: CommentFormProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("评论内容不能为空");
      return;
    }
    onSubmit(name.trim(), content.trim());
    setContent("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "rounded-lg border border-gray-200 p-4 dark:border-gray-800"}>
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="昵称（可选）"
            className="mb-2 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:placeholder:text-gray-500"
            maxLength={50}
          />
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={compact ? 2 : 3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:placeholder:text-gray-500"
            maxLength={2000}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">{content.length}/2000</span>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              disabled={!content.trim()}
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
