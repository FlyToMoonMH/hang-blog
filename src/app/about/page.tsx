import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - MHang",
  description: "MHang 个人简历",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-10 flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 sm:h-20 sm:w-20">
          <Image
            src="/avatar.jpg"
            alt="MHang"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            MHang
          </h1>
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <a href="mailto:hi@mhang.cc" className="transition-colors hover:text-blue-500">
              hi@mhang.cc
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <a href="https://github.com/FlyToMoonMH" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-500">
              GitHub
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <a href="https://mhang.cc" className="transition-colors hover:text-blue-500">
              mhang.cc
            </a>
          </div>
        </div>
      </div>

      {/* Education */}
      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-4 rounded-full bg-blue-500"></span>
          教育背景
        </h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">学校名称</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">专业 · 学位</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">20XX.09 - 20XX.06</p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-4 rounded-full bg-green-500"></span>
          技能
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "前端开发", skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML/CSS"] },
            { label: "后端 & 工具", skills: ["Node.js", "Python", "Git", "Vercel", "Linux"] },
          ].map((group) => (
            <div key={group.label} className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{group.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-blue-100 bg-blue-50/80 px-2 py-0.5 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-4 rounded-full bg-orange-500"></span>
          经历
        </h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/20">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">职位名称</h3>
              <span className="text-sm text-blue-600 dark:text-blue-400">公司/组织</span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">20XX.XX - 至今</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              工作内容和成就描述...
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-4 rounded-full bg-purple-500"></span>
          项目
        </h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/20">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">航的笔记本</h3>
              <a href="https://mhang.cc" className="text-sm text-blue-600 transition-colors hover:text-blue-400 dark:text-blue-400">mhang.cc</a>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              基于 Next.js + TypeScript + Tailwind CSS 的个人笔记系统，支持 MDX、代码高亮、KaTeX 数学公式、全文搜索、Giscus 评论。
            </p>
          </div>
        </div>
      </section>

      {/* Back */}
      <div className="mt-8">
        <a
          href="/notes/"
          className="text-sm text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400"
        >
          ← 返回笔记本
        </a>
      </div>
    </div>
  );
}
