import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "笔记本",
  description: "所有笔记文章列表",
};

export default function NotesPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
        笔记本
      </h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
