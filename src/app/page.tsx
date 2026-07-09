"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Avatar + Name */}
      <div className="mb-8 flex items-center justify-center gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 sm:h-[4.5rem] sm:w-[4.5rem]">
          <Image
            src="/avatar.jpg"
            alt="MHang"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900 dark:text-gray-100 sm:text-[2.5rem]">
            MHang
          </h1>
        </div>
      </div>

      {/* Links */}
      <nav className="flex items-center justify-center gap-2.5">
        <a
          href="https://github.com/FlyToMoonMH"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 transition-colors hover:text-[#5887FC] dark:text-gray-300 dark:hover:text-[#0072ff]"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
        </a>

        <span className="select-none text-gray-300 opacity-70 dark:text-gray-600">/</span>

        <a
          href="/notes"
          className="text-gray-700 transition-colors hover:text-[#5887FC] dark:text-gray-300 dark:hover:text-[#0072ff]"
          title="笔记本"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7V5h2V4a2 2 0 0 1 2-2h6v7l2.5-1.5L18 9V2h1c1.05 0 2 .95 2 2v16c0 1.05-.95 2-2 2H7c-1.05 0-2-.95-2-2v-1H3v-2h2v-4H3v-2h2V7zm4 4H5v2h2zm0-4V5H5v2zm0 12v-2H5v2z"/></svg>
        </a>

        <span className="select-none text-gray-300 opacity-70 dark:text-gray-600">/</span>

        <a
          href="mailto:mahang23@mails.ucas.ac.cn"
          className="text-gray-700 transition-colors hover:text-[#5887FC] dark:text-gray-300 dark:hover:text-[#0072ff]"
          title="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15"/></svg>
        </a>

        <span className="select-none text-gray-300 opacity-70 dark:text-gray-600">/</span>

        <a
          href="/about"
          className="text-gray-700 transition-colors hover:text-[#5887FC] dark:text-gray-300 dark:hover:text-[#0072ff]"
          title="About Me"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1-19.995.324L2 12l.004-.28C2.152 6.327 6.57 2 12 2m0 9h-1l-.117.007a1 1 0 0 0 0 1.986L11 13v3l.007.117a1 1 0 0 0 .876.876L12 17h1l.117-.007a1 1 0 0 0 .876-.876L14 16l-.007-.117a1 1 0 0 0-.764-.857l-.112-.02L13 15v-3l-.007-.117a1 1 0 0 0-.876-.876zm.01-3l-.127.007a1 1 0 0 0 0 1.986L12 10l.127-.007a1 1 0 0 0 0-1.986z"/></svg>
        </a>
      </nav>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-sm text-gray-400 dark:text-gray-500">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <strong className="text-gray-600 dark:text-gray-300">MHang</strong>
        </p>
        <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">
          Built with Next.js &middot; Powered by ❤️
        </p>
        <a
          href={siteConfig.icp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-xs text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
        >
          {siteConfig.icp.text}
        </a>
      </footer>

      {/* Theme toggle — fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
