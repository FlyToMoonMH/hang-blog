"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              {item.title}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <SearchTrigger />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
