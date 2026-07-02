"use client";

import { useCallback, useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

const STORAGE_PREFIX = "blog:";

function loadLikes(slug: string): number {
  try {
    return parseInt(localStorage.getItem(`${STORAGE_PREFIX}likes:${slug}`) || "0", 10);
  } catch {
    return 0;
  }
}

function saveLike(slug: string): number {
  const count = loadLikes(slug) + 1;
  localStorage.setItem(`${STORAGE_PREFIX}likes:${slug}`, String(count));
  return count;
}

export function CommentSection({ slug }: { slug: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLikeCount(loadLikes(slug));
    setHasLiked(localStorage.getItem(`${STORAGE_PREFIX}liked:${slug}`) === "1");
  }, [slug]);

  const handleLike = useCallback(() => {
    setHasLiked(true);
    localStorage.setItem(`${STORAGE_PREFIX}liked:${slug}`, "1");
    setLikeCount(saveLike(slug));
  }, [slug]);

  const giscusTheme = resolvedTheme === "dark" ? "dark_dimmed" : "light";

  return (
    <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          评论
        </h2>
        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            hasLiked
              ? "cursor-default bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
              : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={hasLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>

      {mounted && (
        <Giscus
          repo="FlyToMoonMH/hang-blog"
          repoId="R_kgDOTL0k-A"
          category="Announcements"
          categoryId="DIC_kwDOTL0k-M4DAYbQ"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={giscusTheme}
          lang="zh-CN"
          loading="lazy"
        />
      )}
    </div>
  );
}
