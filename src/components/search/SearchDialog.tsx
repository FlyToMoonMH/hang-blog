"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { SearchIndexEntry } from "@/types";

interface SearchResult extends SearchIndexEntry {
  score: number;
}

function scoreEntry(entry: SearchIndexEntry, query: string): number {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return 0;

  const title = entry.title.toLowerCase();
  const navTitle = entry.navTitle.toLowerCase();
  const description = entry.description.toLowerCase();
  const summary = entry.summary.toLowerCase();
  const section = entry.section.toLowerCase();
  const subsection = entry.subsection?.toLowerCase() ?? "";
  const content = entry.content.toLowerCase();
  const tags = entry.tags.map((tag) => tag.toLowerCase());

  let score = 0;

  for (const token of tokens) {
    if (title === token || navTitle === token) score += 140;
    if (title.startsWith(token) || navTitle.startsWith(token)) score += 90;
    if (title.includes(token) || navTitle.includes(token)) score += 70;
    if (tags.some((tag) => tag === token)) score += 50;
    if (tags.some((tag) => tag.includes(token))) score += 36;
    if (section.includes(token)) score += 24;
    if (subsection.includes(token)) score += 20;
    if (summary.includes(token)) score += 18;
    if (description.includes(token)) score += 12;
    if (content.includes(token)) score += 6;
  }

  return score;
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indexData, setIndexData] = useState<SearchIndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!indexData && isOpen) {
      fetch("/search-index.json")
        .then((res) => res.json())
        .then((data) => setIndexData(data))
        .catch(() => {});
    }
  }, [isOpen, indexData]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-search", handler);

    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const doSearch = useCallback(
    (value: string) => {
      if (!value.trim() || !indexData) {
        setResults([]);
        return;
      }

      const matched = indexData
        .map((entry) => ({
          ...entry,
          score: scoreEntry(entry, value),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        })
        .slice(0, 20);

      setResults(matched);
      setSelectedIndex(0);
    },
    [indexData]
  );

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 120);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      window.location.href = results[selectedIndex].route;
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
            placeholder="搜索笔记、主题、标签..."
            className="w-full bg-transparent px-3 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="mr-3 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>输入标题、主题、标签或正文关键词</p>
              <p className="mt-2 text-xs text-gray-400">
                加密笔记只会公开标题、摘要与结构信息，不会公开全文索引。
              </p>
            </div>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              没有找到相关笔记
            </p>
          ) : (
            results.map((result, index) => (
              <Link
                key={result.slug}
                href={result.route}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-3 transition-colors ${
                  index === selectedIndex
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.navTitle}
                      </h3>
                      {result.access === "protected" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          加密
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {result.section}
                      {result.subsection ? ` / ${result.subsection}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {result.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {result.summary || result.description}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
