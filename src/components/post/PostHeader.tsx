import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import Link from "next/link";
import type { BreadcrumbItem, Post } from "@/types";
import { slugify } from "@/lib/posts";
import { BreadcrumbNav } from "./BreadcrumbNav";

export function PostHeader({
  post,
  breadcrumbs,
}: {
  post: Post;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const { frontmatter, readingTime } = post;

  return (
    <header className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && <BreadcrumbNav items={breadcrumbs} />}

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

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {frontmatter.title}
      </h1>

      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
        {frontmatter.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
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
    </header>
  );
}
