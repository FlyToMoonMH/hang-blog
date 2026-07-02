"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/types";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
        目录
      </h3>
      <ul className="space-y-2 border-l border-gray-200 dark:border-gray-800">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={`toc-link -ml-px block border-l-2 py-0.5 text-sm transition-colors ${
                item.level === 3 ? "pl-6" : "pl-4"
              } ${
                activeSlug === item.slug
                  ? "toc-link-active border-blue-500 dark:border-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
