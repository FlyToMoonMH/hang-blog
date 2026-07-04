// ============================================================
//  About 页面内容配置
//  只需修改这个文件，页面会自动渲染
// ============================================================

export const aboutData = {
  // --- 基本信息 ---
  name: "MHang",
  avatar: "/avatar.jpg",

  // --- 社交链接 ---
  // type 可选: "github" | "email" | "link"
  socials: [
    { type: "github", url: "https://github.com/FlyToMoonMH" },
    { type: "email", url: "mailto:mahang23@mails.ucas.ac.cn" },
    { type: "link", url: "https://mhang.cc", label: "mhang.cc" },
  ],

  // --- 教育背景 ---
  education: [
    {
      school: "学校名称",
      major: "专业 · 学位",
      period: "20XX.09 - 20XX.06",
    },
  ],

  // --- 技能 ---
  skills: [
    {
      label: "前端开发",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML/CSS"],
    },
    {
      label: "后端 & 工具",
      items: ["Node.js", "Python", "Git", "Vercel", "Linux"],
    },
  ],

  // --- 经历 ---
  experience: [
    {
      role: "职位名称",
      org: "公司/组织",
      period: "20XX.XX - 至今",
      desc: "工作内容和成就描述...",
    },
  ],

  // --- 项目 ---
  projects: [
    {
      name: "航的笔记本",
      url: "https://mhang.cc",
      desc: "基于 Next.js + TypeScript + Tailwind CSS 的个人笔记系统，支持 MDX、代码高亮、KaTeX 数学公式、全文搜索、Giscus 评论。",
    },
  ],
};
