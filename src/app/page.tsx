import { getAllPosts } from "@/lib/posts";
import { PostList } from "@/components/post/PostList";
import { Hero } from "@/components/home/Hero";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          最新文章
        </h2>
        <PostList posts={posts} />
      </div>
    </>
  );
}
