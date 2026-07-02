import type { Post } from "@/types";
import { PostCard } from "@/components/post/PostCard";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500 dark:text-gray-400">
        暂无文章
      </p>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
