import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/post/ReadingProgress";
import { BackToTop } from "@/components/post/BackToTop";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchDialog } from "@/components/search/SearchDialog";
import { getSidebarTree } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

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
  const sidebarItems = getSidebarTree();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
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
            <Header />
            <div className="mx-auto flex w-full max-w-7xl flex-1">
              <Sidebar items={sidebarItems} />
              <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
            </div>
            <Footer />
          </div>
          <BackToTop />
          <SearchDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
