import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { BreadcrumbItem, NoteManifestEntry, SubsectionManifestEntry } from "@/types";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { PostList } from "./PostList";
import { getAllNotes } from "@/lib/posts";

function manifestEntriesToPosts(entries: NoteManifestEntry[]) {
  const allNotes = getAllNotes();
  const postByRoute = new Map(allNotes.map((post) => [post.route, post]));

  return entries
    .map((entry) => postByRoute.get(entry.route))
    .filter((post): post is NonNullable<typeof post> => Boolean(post));
}

export function NotesSectionPage({
  variant,
  title,
  description,
  breadcrumbs,
  subsections,
  notes,
  highlightedNotes = [],
}: {
  variant: "section" | "subsection";
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  subsections: SubsectionManifestEntry[];
  notes: NoteManifestEntry[];
  highlightedNotes?: NoteManifestEntry[];
}) {
  const posts = manifestEntriesToPosts(notes);
  const featuredPosts = manifestEntriesToPosts(highlightedNotes);
  const nestedCount = subsections.reduce((sum, subsection) => sum + subsection.count, 0);
  const totalNoteCount = notes.length + nestedCount;
  const quickLinks = (featuredPosts.length > 0 ? featuredPosts : posts).slice(0, 4);
  const overviewLabel = variant === "section" ? "主题总览" : "子分区总览";
  const primaryCountLabel = variant === "section" ? "子分区" : "笔记";
  const primaryCountValue = variant === "section" ? subsections.length : notes.length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="overflow-hidden rounded-[28px] border border-gray-200/70 bg-white shadow-sm dark:border-gray-800/70 dark:bg-gray-950">
        <div className="border-b border-gray-200/70 bg-[linear-gradient(135deg,rgba(37,99,235,0.10),rgba(255,255,255,0)_55%),linear-gradient(180deg,#ffffff,#f8fafc)] px-6 py-6 dark:border-gray-800/70 dark:bg-[linear-gradient(135deg,rgba(96,165,250,0.12),rgba(2,6,23,0)_55%),linear-gradient(180deg,#0b1120,#020617)]">
          <BreadcrumbNav items={breadcrumbs} />
          <div className="mt-3 grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
            <div>
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300">
                {overviewLabel}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400">
                {description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 dark:border-gray-800 dark:bg-gray-900">
                  共 {totalNoteCount} 篇笔记
                </span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 dark:border-gray-800 dark:bg-gray-900">
                  {primaryCountLabel} {primaryCountValue} 个
                </span>
                {featuredPosts.length > 0 && (
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1 dark:border-gray-800 dark:bg-gray-900">
                    精选 {featuredPosts.length} 篇
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-5 backdrop-blur dark:border-gray-800/80 dark:bg-gray-950/80">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                快速入口
              </h2>
              {quickLinks.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {quickLinks.map((post) => (
                    <Link
                      key={post.route}
                      href={post.route}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-gray-200/70 px-3 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50/60 dark:border-gray-800/70 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/20"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {post.frontmatter.nav_title ?? post.frontmatter.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {post.frontmatter.subsection
                            ? `${post.frontmatter.section} / ${post.frontmatter.subsection}`
                            : post.frontmatter.section}
                        </p>
                      </div>
                      <span className="pt-0.5 text-xs text-gray-400 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  这个分区下的内容会在这里显示成快速入口。
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-4 dark:border-gray-800/70 dark:bg-gray-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              路由层级
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {variant === "section"
                ? "这个页面对应一个 section，会聚合该主题下的 subsection 与直属笔记。"
                : "这个页面对应一个 subsection，会收拢同一条学习路径下的笔记。"}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-4 dark:border-gray-800/70 dark:bg-gray-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              写作约定
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              URL、breadcrumb、左侧导航，都由 frontmatter 里的 section / subsection 共同决定。
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-4 dark:border-gray-800/70 dark:bg-gray-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              最近更新
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {format(
                new Date(
                  [...subsections.map((subsection) => subsection.updated), ...notes.map((note) => note.updated)]
                    .sort()
                    .at(-1) ?? new Date().toISOString()
                ),
                "yyyy年MM月dd日",
                { locale: zhCN }
              )}
            </p>
          </div>
        </div>
      </header>

      {subsections.length > 0 && (
        <section className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800/70 dark:bg-gray-950">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                深入路径
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                像文档站目录一样，先进入子分区，再继续往下读具体笔记。
              </p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {subsections.length} 个子分区
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {subsections.map((subsection) => (
              <Link
                key={subsection.route}
                href={subsection.route}
                className="group rounded-2xl border border-gray-200/70 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-800/70 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {subsection.name}
                  </h3>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {subsection.count} 篇
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {subsection.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">
                    最近更新于{" "}
                    {format(new Date(subsection.updated), "yyyy年MM月dd日", {
                      locale: zhCN,
                    })}
                  </p>
                  <span className="text-xs font-medium text-blue-600 transition-transform group-hover:translate-x-0.5 dark:text-blue-400">
                    进入分区 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featuredPosts.length > 0 && (
        <section className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800/70 dark:bg-gray-950">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              精选笔记
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              精选 {featuredPosts.length} 篇
            </span>
          </div>
          <div className="mt-4">
            <PostList posts={featuredPosts} />
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800/70 dark:bg-gray-950">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                笔记列表
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                适合顺序阅读，也适合当作这一分区的索引页来回查找。
              </p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">共 {notes.length} 篇</span>
          </div>
          <div className="mt-4">
            <PostList posts={posts} />
          </div>
        </section>
      )}
    </div>
  );
}
