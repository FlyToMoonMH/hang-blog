import Link from "next/link";
import type { BreadcrumbItem } from "@/types";

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-300 dark:text-gray-700">/</span>}
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-gray-900 dark:hover:text-gray-200"
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current={item.current ? "page" : undefined}
              className={item.current ? "font-medium text-gray-900 dark:text-gray-100" : undefined}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
