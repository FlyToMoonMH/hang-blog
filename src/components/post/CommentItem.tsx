"use client";

import { useState } from "react";
import type { Comment } from "@/types";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  onReply: (name: string, content: string, parentId: string) => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

function avatarColor(name: string): string {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-blue-500",
    "from-teal-500 to-green-500",
  ];
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function CommentItem({ comment, replyTo, setReplyTo, onReply }: CommentItemProps) {
  const isReplying = replyTo === comment.id;

  return (
    <div className="flex gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarColor(comment.name)}`}>
        {comment.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {comment.name}
            </span>
            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
        </div>

        <button
          onClick={() => setReplyTo(isReplying ? null : comment.id)}
          className="mt-1.5 ml-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-500"
        >
          {isReplying ? "取消回复" : "回复"}
        </button>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              onSubmit={(name, content) => {
                onReply(name, content, comment.id);
                setReplyTo(null);
              }}
              placeholder={`回复 ${comment.name}...`}
              compact
              autoFocus
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-100 pl-4 dark:border-gray-800">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${avatarColor(reply.name)}`}>
                  {reply.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {reply.name}
                      </span>
                      <span className="text-xs text-gray-400">{formatTime(reply.createdAt)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
