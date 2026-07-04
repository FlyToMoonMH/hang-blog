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
        // Moon icon
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
      {mode === "auto" && (
        // Contrast icon — half light, half dark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M12 2 A10 10 0 0 1 12 22 Z" fill="currentColor" stroke="none" />
        </svg>
      )}
    </button>
  );
}
