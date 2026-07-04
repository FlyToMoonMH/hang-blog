import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ReadingProgress } from "@/components/post/ReadingProgress";
import { BackToTop } from "@/components/post/BackToTop";
import { SearchDialog } from "@/components/search/SearchDialog";
import { siteConfig } from "@/lib/site";

/**
 * 防闪烁内联脚本：在 React 水合前根据偏好设置正确的 dark class。
 *
 * - "light" / "dark"：直接设置
 * - "auto"：用简单时间启发式（6:30~18:30 = 白天）估算，避免闪烁。
 *   React 水合后 useThemeMode 会用 suncalc 精确计算并纠正。
 *
 * 脚本放在 <head> 中，先于 next-themes 的 <body> 内联脚本执行，
 * 同时将结果写入 "theme" key，让 next-themes 读到正确值。
 */
const themeInitScript = `(function(){try{var m=localStorage.getItem('theme-mode')||'auto';var d=false;if(m==='dark')d=true;else if(m==='auto'){var n=new Date();var t=n.getHours()*60+n.getMinutes();d=t<390||t>=1110}var r=document.documentElement;if(d)r.classList.add('dark');else r.classList.remove('dark');localStorage.setItem('theme',d?'dark':'light')}catch(e){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.2.5/index.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ReadingProgress />
          <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100">
            {children}
          </div>
          <BackToTop />
          <SearchDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
