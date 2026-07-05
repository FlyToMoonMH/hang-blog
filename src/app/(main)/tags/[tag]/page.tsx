import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { decodeRouteParam } from "@/lib/route-params";
import { PostList } from "@/components/post/PostList";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<{ title: string; description: string }> {
  return (async () => {
    const { tag } = await params;
    const decodedTag = decodeRouteParam(tag);
    const tags = getAllTags();
    const t = tags.find((t) => t.slug === decodedTag);

    if (!t) return { title: "标签", description: "" };

    return {
      title: `#${t.name}`,
      description: `标签 ${t.name} 下的所有文章`,
    };
  })();
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeRouteParam(tag);
  const tags = getAllTags();
  const t = tags.find((t) => t.slug === decodedTag);

  if (!t) {
    notFound();
  }

  const posts = getPostsByTag(decodedTag);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        #{t.name}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        共 {posts.length} 篇文章
      </p>
      <div className="mt-6">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
