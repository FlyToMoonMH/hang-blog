"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { SearchIndexEntry } from "@/types";

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indexData, setIndexData] = useState<SearchIndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index on first open
  useEffect(() => {
    if (!indexData && isOpen) {
      fetch("/search-index.json")
        .then((res) => res.json())
        .then((data) => setIndexData(data))
        .catch(() => {});
    }
  }, [isOpen, indexData]);

  // Listen for open event
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-search", handler);

    // Keyboard shortcut
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("open-search", handler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search function
  const doSearch = useCallback(
    (q: string) => {
      if (!q.trim() || !indexData) {
        setResults([]);
        return;
      }

      const lower = q.toLowerCase();
      const matched = indexData
        .filter((entry) => {
          return (
            entry.title.toLowerCase().includes(lower) ||
            entry.description.toLowerCase().includes(lower) ||
            entry.category.toLowerCase().includes(lower) ||
            entry.tags.some((t) => t.toLowerCase().includes(lower)) ||
            entry.content.toLowerCase().includes(lower)
          );
        })
        .slice(0, 20)
        .map((entry) => ({
          slug: entry.slug,
          title: entry.title,
          description: entry.description,
          category: entry.category,
          tags: entry.tags,
          date: entry.date,
        }));

      setResults(matched);
      setSelectedIndex(0);
    },
    [indexData]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 150);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      window.location.href = `/posts/${results[selectedIndex].slug}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="mt-[10vh] w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800">
          <svg
            className="ml-4 h-5 w-5 shrink-0 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索文章..."
            className="w-full bg-transparent px-3 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="mr-3 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <p className="py-8 text-center text-sm text-gray-400">
              输入关键词搜索文章
            </p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              没有找到相关文章
            </p>
          ) : (
            results.map((result, i) => (
              <Link
                key={result.slug}
                href={`/posts/${result.slug}`}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2.5 transition-colors ${
                  i === selectedIndex
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {result.title}
                  </h3>
                  <span className="ml-2 shrink-0 text-xs text-gray-400">
                    {result.category}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {result.description}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
