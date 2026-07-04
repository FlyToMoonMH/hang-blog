"use client";

import Image from "next/image";
import { useThemeMode } from "@/components/ui/ThemeProvider";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { mode, setMode } = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle: light → dark → auto → light
  const cycleTheme = () => {
    if (mode === "light") setMode("dark");
    else if (mode === "dark") setMode("auto");
    else setMode("light");
  };

  const label = mode === "light" ? "浅色" : mode === "dark" ? "深色" : "自动";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Avatar + Name — 横向排列，模仿 TonyCrane */}
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

      {/* Links — 纯图标，无文字，模仿 TonyCrane */}
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
          href="/notes/"
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
      </footer>

      {/* Color mode toggle — 右下角固定，三态切换 */}
      {mounted && (
        <button
          onClick={cycleTheme}
          className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-[#5887FC] dark:text-gray-300 dark:hover:text-[#0072ff]"
          aria-label={`切换主题（当前：${label}）`}
          title={`主题：${label}`}
        >
          {mode === "light" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0-7l2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm.02 10l1.76-3.77a7.13 7.13 0 0 0 2.38 4.14zM20.65 7l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15zm-.01 10l-4.14.36c.59-.51 1.12-1.14 1.54-1.86c.42-.73.69-1.5.83-2.29zM12 22l-2.41-3.44c.74.27 1.55.44 2.41.44c.82 0 1.63-.17 2.37-.44z"/></svg>
          )}
          {mode === "dark" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m17.75 4.09-2.53 1.94.91 3.06-2.63-1.81-2.63 1.81.91-3.06-2.53-1.94L12.44 4l1.06-3 1.06 3zm3.5 6.91-1.64 1.25.59 1.98-1.7-1.17-1.7 1.17.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95zm-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14.4-.4.82-.76 1.27-1.08.75-.53 1.93.36 1.85 1.19-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82-2.81 3.14-2.7 7.96.31 10.98 3.02 3.01 7.84 3.12 10.98.31"/></svg>
          )}
          {mode === "auto" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              {/* Sun rays */}
              <path d="M12 2l2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm.02 10l1.76-3.77a7.13 7.13 0 0 0 2.38 4.14zM20.65 7l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15zm-.01 10l-4.14.36c.59-.51 1.12-1.14 1.54-1.86c.42-.73.69-1.5.83-2.29zM12 22l-2.41-3.44c.74.27 1.55.44 2.41.44c.82 0 1.63-.17 2.37-.44z"/>
              {/* Left half: sun ring */}
              <path d="M12 7A5 5 0 0 0 12 17L12 15A3 3 0 0 0 12 9Z"/>
              {/* Right half: crescent moon */}
              <path d="M12 7A5 5 0 0 1 12 17Q15 12 12 7Z"/>
              {/* Star */}
              <path d="M17 1.5L17.75 3.25L19.5 4L17.75 4.75L17 6.5L16.25 4.75L14.5 4L16.25 3.25Z"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
