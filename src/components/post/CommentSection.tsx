"use client";

import { useCallback, useEffect, useState } from "react";
import type { Comment } from "@/types";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

const STORAGE_PREFIX = "blog:";

function loadComments(slug: string): Comment[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}comments:${slug}`);
    if (!raw) return [];
    const all: Comment[] = JSON.parse(raw);
    const roots = all.filter((c) => !c.parentId);
    const replyMap: Record<string, Comment[]> = {};
    all.filter((c) => c.parentId).forEach((c) => {
      if (!replyMap[c.parentId!]) replyMap[c.parentId!] = [];
      replyMap[c.parentId!].push(c);
    });
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    roots.forEach((r) => {
      r.replies = (replyMap[r.id] || []).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
    return roots;
  } catch {
    return [];
  }
}

function saveComment(slug: string, comment: Comment) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}comments:${slug}`);
    const existing: Comment[] = raw ? JSON.parse(raw) : [];
    existing.push(comment);
    localStorage.setItem(`${STORAGE_PREFIX}comments:${slug}`, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const refresh = useCallback(() => {
    setComments(loadComments(slug));
  }, [slug]);

  useEffect(() => {
    refresh();
    setLikeCount(loadLikes(slug));
    setHasLiked(localStorage.getItem(`${STORAGE_PREFIX}liked:${slug}`) === "1");
    setLoading(false);
  }, [slug, refresh]);

  const handleSubmit = (name: string, content: string, parentId?: string | null) => {
    const comment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      slug,
      name: name.slice(0, 50) || "匿名",
      content: content.slice(0, 2000),
      createdAt: new Date().toISOString(),
      parentId: parentId || null,
    };
    saveComment(slug, comment);
    refresh();
    setReplyTo(null);
  };

  const handleLike = () => {
    if (hasLiked) return;
    setHasLiked(true);
    localStorage.setItem(`${STORAGE_PREFIX}liked:${slug}`, "1");
    setLikeCount(saveLike(slug));
  };

  const commentCount = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          评论 {commentCount > 0 && <span className="text-gray-500">({commentCount})</span>}
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
          <svg className="h-4 w-4" fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>

      <div className="mb-4 rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
        评论保存在本地浏览器中。部署后可接入 Giscus 实现跨设备评论同步。
      </div>

      <CommentForm onSubmit={(name, content) => handleSubmit(name, content)} />

      <div className="mt-8 space-y-6">
        {loading ? (
          <p className="text-sm text-gray-500">加载评论中...</p>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            还没有评论，来说两句吧
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              onReply={(name, content, parentId) => handleSubmit(name, content, parentId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
