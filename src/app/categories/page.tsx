import Link from "next/link";
import { getAllCategories } from "@/lib/posts";

export const metadata = {
  title: "分类",
  description: "浏览所有文章分类",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        分类
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        共 {categories.length} 个分类
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900"
          >
            <span className="font-medium text-gray-900 transition-colors group-hover:text-accent dark:text-gray-100">
              {cat.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {cat.count} 篇
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
