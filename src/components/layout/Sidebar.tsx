"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "@/types";

function SidebarNode({
  item,
  level,
  activeSlug,
  expandedSet,
  toggleFolder,
}: {
  item: SidebarItem;
  level: number;
  activeSlug: string;
  expandedSet: Set<string>;
  toggleFolder: (title: string) => void;
}) {
  const paddingLeft = `${12 + level * 16}px`;

  if (item.isFolder) {
    const isExpanded = expandedSet.has(item.title);
    const hasActiveChild = item.children?.some(
      (child) => !child.isFolder && child.slug === activeSlug
    );

    return (
      <div>
        <button
          onClick={() => toggleFolder(item.title)}
          className="flex w-full items-center gap-1 py-1.5 text-left text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          style={{ paddingLeft }}
        >
          <svg
            className={`h-3 w-3 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span className={hasActiveChild ? "font-semibold text-gray-900 dark:text-gray-100" : ""}>
            {item.title}
          </span>
        </button>
        {isExpanded && item.children && (
          <div>
            {item.children.map((child) => (
              <SidebarNode
                key={child.title + (child.slug || "")}
                item={child}
                level={level + 1}
                activeSlug={activeSlug}
                expandedSet={expandedSet}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = item.slug === activeSlug;

  return (
    <Link
      href={item.slug ? `/${item.slug}` : "#"}
      className={`block py-1.5 text-sm transition-colors ${
        isActive
          ? "font-semibold text-blue-600 dark:text-blue-400"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
      style={{ paddingLeft: `calc(${paddingLeft} + 16px)` }}
    >
      {item.title}
    </Link>
  );
}

export function Sidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  // 排除功能页，只在笔记详情页高亮
  const isFunctionalPage =
    pathname === "/" ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/tags") ||
    pathname.startsWith("/about");
  const activeSlug = isFunctionalPage
    ? ""
    : pathname.replace(/^\//, "").replace(/\/$/, "");

  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set());

  const toggleFolder = (title: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  // 自动展开包含活跃文章的文件夹
  const initialExpanded = new Set<string>();
  const findActive = (items: SidebarItem[], parents: string[]) => {
    for (const item of items) {
      if (!item.isFolder && item.slug === activeSlug) {
        parents.forEach((p) => initialExpanded.add(p));
        return true;
      }
      if (item.isFolder && item.children) {
        if (findActive(item.children, [...parents, item.title])) {
          return true;
        }
      }
    }
    return false;
  };
  findActive(items, []);

  const effectiveExpanded =
    expandedSet.size === 0 && activeSlug ? initialExpanded : expandedSet;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200/60 px-3 py-4 dark:border-gray-800/60 lg:block">
      <nav className="space-y-0.5">
        {items.map((item) => (
          <SidebarNode
            key={item.title + (item.slug || "")}
            item={item}
            level={0}
            activeSlug={activeSlug}
            expandedSet={effectiveExpanded}
            toggleFolder={toggleFolder}
          />
        ))}
      </nav>
    </aside>
  );
}
