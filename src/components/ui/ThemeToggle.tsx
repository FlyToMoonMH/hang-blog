"use client";

import { useThemeMode } from "@/components/ui/ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  // Cycle: light → dark → auto → light
  const cycle = () => {
    if (mode === "light") setMode("dark");
    else if (mode === "dark") setMode("auto");
    else setMode("light");
  };

  const label = mode === "light" ? "浅色" : mode === "dark" ? "深色" : "自动";

  return (
    <button
      onClick={cycle}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      aria-label={`切换主题（当前：${label}）`}
      title={`主题：${label}`}
    >
      {mode === "light" && (
        // Sun icon
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
      )}
      {mode === "dark" && (
        // Moon with stars — Material Design weather-night
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="m17.75 4.09-2.53 1.94.91 3.06-2.63-1.81-2.63 1.81.91-3.06-2.53-1.94L12.44 4l1.06-3 1.06 3zm3.5 6.91-1.64 1.25.59 1.98-1.7-1.17-1.7 1.17.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95zm-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14.4-.4.82-.76 1.27-1.08.75-.53 1.93.36 1.85 1.19-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82-2.81 3.14-2.7 7.96.31 10.98 3.02 3.01 7.84 3.12 10.98.31" />
        </svg>
      )}
      {mode === "auto" && (
        // Combined sun + moon: left half sun ring, right half crescent moon + star
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Sun rays (from weather-sunny) */}
          <path d="M12 2l2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm.02 10l1.76-3.77a7.13 7.13 0 0 0 2.38 4.14zM20.65 7l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15zm-.01 10l-4.14.36c.59-.51 1.12-1.14 1.54-1.86c.42-.73.69-1.5.83-2.29zM12 22l-2.41-3.44c.74.27 1.55.44 2.41.44c.82 0 1.63-.17 2.37-.44z" />
          {/* Left half: sun ring (outer arc + inner arc) */}
          <path d="M12 7A5 5 0 0 0 12 17L12 15A3 3 0 0 0 12 9Z" />
          {/* Right half: crescent moon */}
          <path d="M12 7A5 5 0 0 1 12 17Q15 12 12 7Z" />
          {/* Star (from weather-night, representing night) */}
          <path d="M17 1.5L17.75 3.25L19.5 4L17.75 4.75L17 6.5L16.25 4.75L14.5 4L16.25 3.25Z" />
        </svg>
      )}
    </button>
  );
}
