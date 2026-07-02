import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata = {
  title: "标签",
  description: "浏览所有文章标签",
};

export default function TagsPage() {
  const tags = getAllTags();
  const maxCount = Math.max(...tags.map((t) => t.count), 1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        标签
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        共 {tags.length} 个标签
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {tags.map((tag) => {
          const ratio = tag.count / maxCount;
          const sizeClass =
            ratio > 0.75
              ? "text-xl"
              : ratio > 0.5
                ? "text-lg"
                : ratio > 0.25
                  ? "text-base"
                  : "text-sm";

          return (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className={`group inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-900 ${sizeClass}`}
            >
              {tag.name}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {tag.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
