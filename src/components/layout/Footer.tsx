import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/60 dark:border-gray-800/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400 sm:items-start">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <a
            href={siteConfig.icp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            {siteConfig.icp.text}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/rss.xml"
            className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            RSS
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
