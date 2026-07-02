import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Post } from "@/types";
import { slugify } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, slug, readingTime } = post;

  return (
    <article className="group border-b border-gray-200/60 py-6 last:border-0 dark:border-gray-800/60">
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={frontmatter.date}>
          {format(new Date(frontmatter.date), "yyyy年MM月dd日", {
            locale: zhCN,
          })}
        </time>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <Link
          href={`/categories/${slugify(frontmatter.category)}`}
          className="transition-colors hover:text-accent"
        >
          {frontmatter.category}
        </Link>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <span>{readingTime}</span>
      </div>

      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        <Link
          href={`/posts/${slug}`}
          className="text-gray-900 transition-colors hover:text-accent dark:text-gray-100 dark:hover:text-blue-400"
        >
          {frontmatter.title}
        </Link>
      </h2>

      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {frontmatter.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {frontmatter.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${slugify(tag)}`}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
