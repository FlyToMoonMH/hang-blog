import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  getAllNotes,
  getFeaturedNotes,
  getNoteSectionSummaries,
  getRecentlyUpdatedNotes,
} from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "笔记",
  description: "按主题整理的学习笔记与长期知识库",
};

export default function NotesPage() {
  const allNotes = getAllNotes();
  const featuredNotes = getFeaturedNotes(3);
  const recentNotes = getRecentlyUpdatedNotes(6);
  const sections = getNoteSectionSummaries();
  const writingGuide =
    allNotes.find((note) => note.sourcePath === "how-to-write-a-note.md") ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section className="rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6 py-8 shadow-sm dark:border-gray-800/70 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/50 dark:text-blue-300">
          Docs Workbench
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          笔记知识库
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400">
          这里不再只是按时间堆叠文章，而是按主题组织知识。你可以从左侧知识树进入，也可以从这里按主题、起步入口和最近更新来浏览。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="rounded-full bg-white px-3 py-1 dark:bg-gray-900">
            {sections.length} 个主题分区
          </span>
          <span className="rounded-full bg-white px-3 py-1 dark:bg-gray-900">
            {recentNotes.length} 篇最近更新
          </span>
          <span className="rounded-full bg-white px-3 py-1 dark:bg-gray-900">
            `⌘K` / `Ctrl+K` 快速搜索
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200/70 p-6 dark:border-gray-800/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Start Here
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                先从这几篇入口笔记开始，比较适合第一次进入这个知识库时浏览。
              </p>
            </div>
            {writingGuide && (
              <Link
                href={writingGuide.route}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                写作约定
              </Link>
            )}
          </div>

          <div className="mt-5 space-y-4">
            {featuredNotes.map((note) => (
              <Link
                key={note.slug}
                href={note.route}
                className="block rounded-2xl border border-gray-200/70 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800/70 dark:hover:border-gray-700 dark:hover:bg-gray-900/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      {note.frontmatter.section}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                      {note.frontmatter.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {note.frontmatter.summary ?? note.frontmatter.description}
                    </p>
                  </div>
                  {note.frontmatter.access === "protected" && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      加密
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/70 p-6 dark:border-gray-800/70">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recently Updated
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            更适合回访时快速看最近补充了什么。
          </p>

          <div className="mt-5 space-y-3">
            {recentNotes.map((note) => (
              <Link
                key={note.slug}
                href={note.route}
                className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {note.frontmatter.nav_title ?? note.frontmatter.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {note.frontmatter.section}
                    {note.frontmatter.subsection
                      ? ` / ${note.frontmatter.subsection}`
                      : ""}
                  </p>
                </div>
                <time
                  dateTime={note.frontmatter.updated ?? note.frontmatter.date}
                  className="shrink-0 text-xs text-gray-400"
                >
                  {format(
                    new Date(note.frontmatter.updated ?? note.frontmatter.date),
                    "MM.dd",
                    { locale: zhCN }
                  )}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Sections
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              像文档站一样，按主题进入，而不是只靠时间线翻找。
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.slug}
              className="rounded-2xl border border-gray-200/70 p-5 dark:border-gray-800/70"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={section.route}
                  className="text-base font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                >
                  {section.name}
                </Link>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {section.count} 篇
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
              <div className="mt-4 space-y-2">
                {section.posts.slice(0, 3).map((note) => (
                  <Link
                    key={note.slug}
                    href={note.route}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900/60 dark:hover:text-gray-100"
                  >
                    {note.navTitle}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                最近更新于{" "}
                {format(new Date(section.updated), "yyyy年MM月dd日", {
                  locale: zhCN,
                })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
