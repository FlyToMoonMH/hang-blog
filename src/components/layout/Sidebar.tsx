"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "@/types";

function normalizePathname(pathname: string) {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

function SidebarNode({
  item,
  level,
  activeRoute,
  expandedSet,
  toggleFolder,
}: {
  item: SidebarItem;
  level: number;
  activeRoute: string;
  expandedSet: Set<string>;
  toggleFolder: (id: string) => void;
}) {
  const paddingLeft = `${12 + level * 16}px`;

  const containsActiveRoute = (node: SidebarItem): boolean => {
    if (!activeRoute) return false;

    if (node.route && (activeRoute === node.route || activeRoute.startsWith(`${node.route}/`))) {
      return true;
    }

    return node.children?.some((child) => containsActiveRoute(child)) ?? false;
  };

  if (item.isFolder) {
    const isExpanded = expandedSet.has(item.id);
    const isActive = containsActiveRoute(item);

    return (
      <div>
        <div className="flex items-center" style={{ paddingLeft }}>
          <button
            type="button"
            onClick={() => toggleFolder(item.id)}
            aria-label={isExpanded ? `收起 ${item.title}` : `展开 ${item.title}`}
            className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
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
          </button>

          {item.route ? (
            <Link
              href={item.route}
              className={`min-w-0 flex-1 py-1.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              }`}
            >
              {item.title}
            </Link>
          ) : (
            <span
              className={`min-w-0 flex-1 py-1.5 text-left text-sm font-medium ${
                isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.title}
            </span>
          )}
        </div>

        {isExpanded && item.children && (
          <div>
            {item.children.map((child) => (
              <SidebarNode
                key={child.id}
                item={child}
                level={level + 1}
                activeRoute={activeRoute}
                expandedSet={expandedSet}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = item.route === activeRoute;

  return (
    <Link
      href={item.route ?? "#"}
      className={`block py-1.5 text-sm transition-colors ${
        isActive
          ? "font-semibold text-blue-600 dark:text-blue-400"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
      style={{ paddingLeft: `calc(${paddingLeft} + 30px)` }}
    >
      {item.title}
    </Link>
  );
}

export function Sidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const normalizedPath = normalizePathname(pathname);
  const isFunctionalPage =
    normalizedPath === "/" ||
    normalizedPath === "/notes" ||
    normalizedPath.startsWith("/categories") ||
    normalizedPath.startsWith("/tags") ||
    normalizedPath.startsWith("/about");
  const activeRoute =
    isFunctionalPage || !normalizedPath.startsWith("/notes/") ? "" : normalizedPath;

  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleFolder = (id: string) => {
    setHasInteracted(true);
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const initialExpanded = new Set<string>();
  const findActive = (nodes: SidebarItem[], parents: string[]) => {
    for (const item of nodes) {
      if (item.isFolder) {
        const matchesSelf =
          item.route &&
          (activeRoute === item.route || activeRoute.startsWith(`${item.route}/`));

        if (matchesSelf) {
          parents.forEach((parentId) => initialExpanded.add(parentId));
          initialExpanded.add(item.id);
        }

        if (item.children && findActive(item.children, [...parents, item.id])) {
          initialExpanded.add(item.id);
          return true;
        }

        if (matchesSelf) {
          return true;
        }
      } else if (item.route === activeRoute) {
        parents.forEach((parentId) => initialExpanded.add(parentId));
        return true;
      }
    }

    return false;
  };

  findActive(items, []);

  const effectiveExpanded =
    !hasInteracted && activeRoute ? initialExpanded : expandedSet;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200/60 px-3 py-4 dark:border-gray-800/60 lg:block">
      <nav className="space-y-0.5">
        {items.map((item) => (
          <SidebarNode
            key={item.id}
            item={item}
            level={0}
            activeRoute={activeRoute}
            expandedSet={effectiveExpanded}
            toggleFolder={toggleFolder}
          />
        ))}
      </nav>
    </aside>
  );
}
