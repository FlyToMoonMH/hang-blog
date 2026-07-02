import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"LXGW WenKai Screen"', '"LXGW WenKai"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.gray.700"),
            "--tw-prose-headings": theme("colors.gray.900"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-bold": theme("colors.gray.900"),
            "--tw-prose-code": theme("colors.gray.900"),
            "--tw-prose-quotes": theme("colors.gray.700"),
            "--tw-prose-quote-borders": theme("colors.gray.300"),
            "--tw-prose-pre-bg": theme("colors.gray.900"),
            maxWidth: "none",
            a: {
              textDecoration: "none",
              fontWeight: "500",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              padding: "1rem 1.25rem",
              borderRadius: "0.5rem",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": theme("colors.gray.300"),
            "--tw-prose-headings": theme("colors.gray.100"),
            "--tw-prose-links": theme("colors.blue.400"),
            "--tw-prose-bold": theme("colors.gray.100"),
            "--tw-prose-code": theme("colors.gray.100"),
            "--tw-prose-quotes": theme("colors.gray.300"),
            "--tw-prose-quote-borders": theme("colors.gray.700"),
            "--tw-prose-pre-bg": theme("colors.gray.800"),
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
