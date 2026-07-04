import Link from "next/link";
import type { Post } from "@/types";

export function PostNav({
  prev,
  next,
}: {
  prev: Post | null;
  next: Post | null;
}) {
  return (
    <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-gray-200/60 pt-8 dark:border-gray-800/60 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/${prev.slug}`}
          className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ← 上一篇
          </span>
          <p className="mt-1 font-medium text-gray-900 transition-colors group-hover:text-accent dark:text-gray-100">
            {prev.frontmatter.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/${next.slug}`}
          className="group rounded-lg border border-gray-200 p-4 text-right transition-colors hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">
            下一篇 →
          </span>
          <p className="mt-1 font-medium text-gray-900 transition-colors group-hover:text-accent dark:text-gray-100">
            {next.frontmatter.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
