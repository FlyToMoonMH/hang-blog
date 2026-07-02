"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="fixed right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:border-gray-300 hover:bg-white hover:shadow dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-900"
          aria-label="切换主题"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      )}

      {/* Avatar - 居中大圆形 */}
      <div className="mb-8">
        <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border-[3px] border-gray-200 shadow-lg dark:border-gray-700 sm:h-44 sm:w-44">
          <Image
            src="/avatar.jpg"
            alt="MHang"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Name + Subtitle */}
      <div className="mb-10 text-center">
        <h1 className="font-bold tracking-tight text-gray-900 text-3xl dark:text-gray-100">
          MHang
        </h1>
        <p className="mt-2 font-light text-gray-500 dark:text-gray-400 text-base">
          航的笔记本
        </p>
      </div>

      {/* Links with icons */}
      <nav className="mb-16 flex flex-wrap items-center justify-center gap-1 text-base">
        <a
          href="https://github.com/FlyToMoonMH"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
          <span>GitHub</span>
        </a>

        <span className="select-none text-gray-300 dark:text-gray-600">/</span>

        <a
          href="/notes/"
          className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
          title="笔记本"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7V5h2V4a2 2 0 0 1 2-2h6v7l2.5-1.5L18 9V2h1c1.05 0 2 .95 2 2v16c0 1.05-.95 2-2 2H7c-1.05 0-2-.95-2-2v-1H3v-2h2v-4H3v-2h2V7zm4 4H5v2h2zm0-4V5H5v2zm0 12v-2H5v2z"/></svg>
          <span>笔记本</span>
        </a>

        <span className="select-none text-gray-300 dark:text-gray-600">/</span>

        <a
          href="mailto:hi@mhang.cc"
          className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
          title="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15"/></svg>
          <span>Email</span>
        </a>

        <span className="select-none text-gray-300 dark:text-gray-600">/</span>

        <a
          href="/about"
          className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
          title="About Me"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2C14.59 2 15.49 2.89 15.5 4L17 4C18.1 4 19 4.89 19 6V20C19 21.11 18.1 22 17 22H7C5.9 22 5 21.11 5 20V6C5 4.89 5.9 4 7 4H8.5C8.51 2.89 9.41 2 10.5 2M13.5 4H10.5C10.22 4 10 4.22 10 4.5V5H14V4.5C14 4.22 13.78 4 13.5 4M7 6V20H17V6H7M12 9C14.21 9 16 10.79 16 13S14.21 17 12 17 8 15.21 8 13 9.79 9 12 9M12 11C10.9 11 10 11.9 10 13S10.9 15 12 15 14 14.1 14 13 13.1 11 12 11Z"/></svg>
          <span>About</span>
        </a>
      </nav>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-sm text-gray-400 dark:text-gray-500">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <strong className="text-gray-600 dark:text-gray-300">MHang</strong>
        </p>
        <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">
          Built with Next.js &middot; Hosted on Vercel &middot; Powered by ❤️
        </p>
      </footer>
    </div>
  );
}
