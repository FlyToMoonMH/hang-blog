"use client";

import { ShareBar } from "./ShareBar";

interface PostActionsProps {
  title: string;
}

export function PostActions({ title }: PostActionsProps) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
      <span className="text-sm text-gray-500">觉得有用？分享给更多人</span>
      <ShareBar title={title} />
    </div>
  );
}
