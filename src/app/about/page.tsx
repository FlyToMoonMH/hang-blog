import Image from "next/image";
import type { Metadata } from "next";
import { aboutData } from "@/data/about";

export const metadata: Metadata = {
  title: `关于 - ${aboutData.name}`,
  description: `${aboutData.name} 个人简介`,
};

const socialIcons: Record<string, React.ReactNode> = {
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15"/></svg>
  ),
  link: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5a5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8m9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1c0 1.71-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5a5 5 0 0 0-5-5"/></svg>
  ),
};

const sectionColors: Record<string, string> = {
  education: "bg-blue-500",
  skills: "bg-green-500",
  experience: "bg-orange-500",
  projects: "bg-purple-500",
};

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
      <span className={`inline-block h-1 w-4 rounded-full ${color}`}></span>
      {title}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-10 flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 sm:h-20 sm:w-20">
          <Image
            src={aboutData.avatar}
            alt={aboutData.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {aboutData.name}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            {aboutData.socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target={social.type === "email" ? undefined : "_blank"}
                rel={social.type === "email" ? undefined : "noopener noreferrer"}
                className="text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400"
                title={social.label || social.type}
              >
                {socialIcons[social.type]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Education */}
      {aboutData.education.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="教育背景" color={sectionColors.education} />
          <div className="space-y-3">
            {aboutData.education.map((edu, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{edu.school}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{edu.major}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {aboutData.skills.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="技能" color={sectionColors.skills} />
          <div className="grid gap-3 sm:grid-cols-2">
            {aboutData.skills.map((group) => (
              <div key={group.label} className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
                <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{group.label}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
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
      )}

      {/* Experience */}
      {aboutData.experience.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="经历" color={sectionColors.experience} />
          <div className="space-y-3">
            {aboutData.experience.map((exp, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/20">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{exp.role}</h3>
                  <span className="text-sm text-blue-600 dark:text-blue-400">{exp.org}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{exp.period}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {aboutData.projects.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="项目" color={sectionColors.projects} />
          <div className="space-y-3">
            {aboutData.projects.map((proj, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/20">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{proj.name}</h3>
                  {proj.url && (
                    <a href={proj.url} className="text-sm text-blue-600 transition-colors hover:text-blue-400 dark:text-blue-400">
                      {proj.url.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back */}
      <div className="mt-8">
        <a
          href="/"
          className="text-sm text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400"
        >
          ← 返回首页
        </a>
      </div>
    </div>
  );
}
