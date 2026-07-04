"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme,
} from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { resolveAutoTheme, getNextSwitchTime } from "@/lib/sun-time";

type ThemeMode = "light" | "dark" | "auto";

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark" | undefined;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
}

function ThemeModeResolver({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored =
      (localStorage.getItem("theme-mode") as ThemeMode | null) || "auto";
    setModeState(stored);
  }, []);

  // Apply theme when mode changes
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("theme-mode", mode);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (mode === "auto") {
      // Apply current resolved theme immediately
      const resolved = resolveAutoTheme();
      setTheme(resolved);

      // Schedule next switch precisely at sunrise/sunset
      const scheduleNext = () => {
        const nextSwitch = getNextSwitchTime();
        if (nextSwitch) {
          const delay = nextSwitch.getTime() - Date.now() + 3000; // 3s buffer
          timerRef.current = setTimeout(() => {
            setTheme(resolveAutoTheme());
            scheduleNext();
          }, Math.max(delay, 60000));
        } else {
          // Fallback: check every 10 minutes
          timerRef.current = setTimeout(() => {
            setTheme(resolveAutoTheme());
            scheduleNext();
          }, 600000);
        }
      };
      scheduleNext();
    } else {
      setTheme(mode);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [mode, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  return (
    <ThemeModeContext.Provider
      value={{
        mode,
        setMode,
        resolvedTheme: resolvedTheme as "light" | "dark" | undefined,
      }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <ThemeModeResolver>{children}</ThemeModeResolver>
    </NextThemesProvider>
  );
}
