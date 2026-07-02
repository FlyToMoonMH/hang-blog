"use client";

export function SearchTrigger() {
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <button
      onClick={openSearch}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      aria-label="搜索"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span className="hidden sm:inline">搜索</span>
      <kbd className="hidden rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-700 sm:inline-block">
        ⌘K
      </kbd>
    </button>
  );
}
