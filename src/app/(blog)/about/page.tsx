import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - MHang",
  description: "关于 MHang - 个人简历",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-[3px] border-gray-200 shadow-lg dark:border-gray-700 sm:h-32 sm:w-32">
          <Image
            src="/avatar.jpg"
            alt="MHang"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            MHang
          </h1>
          <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
            航的笔记本
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
            <a href="mailto:hi@mhang.cc" className="flex items-center gap-1 transition-colors hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15"/></svg>
              hi@mhang.cc
            </a>
            <a href="https://github.com/FlyToMoonMH" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition-colors hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
              GitHub
            </a>
            <a href="https://mhang.cc" className="flex items-center gap-1 transition-colors hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7V5h2V4a2 2 0 0 1 2-2h6v7l2.5-1.5L18 9V2h1c1.05 0 2 .95 2 2v16c0 1.05-.95 2-2 2H7c-1.05 0-2-.95-2-2v-1H3v-2h2v-4H3v-2h2V7zm4 4H5v2h2zm0-4V5H5v2zm0 12v-2H5v2z"/></svg>
              mhang.cc
            </a>
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-5 rounded-full bg-blue-500"></span>
          关于我
        </h2>
        <div className="space-y-3 leading-relaxed text-gray-600 dark:text-gray-300">
          <p>你好，我是 MHang 👋</p>
          <p>
            热爱技术，喜欢探索和记录。这个网站是我的个人笔记本，记录学习笔记、技术心得和生活点滴。
          </p>
          <p>
            目前主要关注前端开发领域，使用 Next.js、TypeScript、Tailwind CSS 等技术栈构建项目。
          </p>
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-5 rounded-full bg-green-500"></span>
          教育背景
        </h2>
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-800/30">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">学校名称</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">专业 · 学位</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">时间范围</p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-5 rounded-full bg-purple-500"></span>
          技能
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "前端开发", skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML/CSS"] },
            { label: "后端 & 工具", skills: ["Node.js", "Python", "Git", "Vercel", "Linux"] },
            { label: "其他", skills: ["Markdown", "MDX", "KaTeX", "FlexSearch"] },
          ].map((group) => (
            <div key={group.label} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <h3 className="mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">{group.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-blue-100 bg-blue-50/80 px-2 py-0.5 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
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
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <span className="inline-block h-1 w-5 rounded-full bg-orange-500"></span>
          经历
        </h2>
        <div className="space-y-4">
          <div className="relative rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/20">
            <div className="absolute -left-3 top-6 h-6 w-6 rounded-full border-2 border-orange-400 bg-white dark:bg-gray-900" />
            <div className="ml-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">职位名称</h3>
                <span className="text-sm text-blue-600 dark:text-blue-400">公司/组织</span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">时间范围</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                在这里描述工作内容和成就...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="mt-8 flex gap-4">
        <a
          href="/notes/"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          ← 返回笔记本
        </a>
        <a
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
        >
          首页 →
        </a>
      </div>
    </div>
  );
}
