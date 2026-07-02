import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - MHang",
  description: "关于 MHang",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
          <Image
            src="/avatar.jpg"
            alt="MHang"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            MHang
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            航的笔记本
          </p>
        </div>

        {/* Bio */}
        <div className="mt-4 space-y-4 leading-relaxed text-gray-600 dark:text-gray-300">
          <p>你好，我是 MHang 👋</p>
          <p>
            这是我的个人主页和笔记本。我在这里记录技术笔记、学习心得和生活点滴。
          </p>
          <p>
            技术上主要关注前端开发，使用 Next.js、TypeScript、Tailwind CSS 等工具构建项目。
            这个博客/笔记本系统也是我自己搭建的。
          </p>
        </div>

        {/* Tech stack */}
        <div className="mt-8 w-full rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "TypeScript", "React", "Tailwind CSS", "MDX", "Shiki", "Vercel", "Giscus"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 flex gap-4">
          <a
            href="/posts/"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            ← 返回笔记本
          </a>
          <a
            href="https://github.com/FlyToMoonMH"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
          >
            GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
