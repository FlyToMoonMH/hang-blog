import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "航的技术博客，记录学习与思考",
};

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
        笔记
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
