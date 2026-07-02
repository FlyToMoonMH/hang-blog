export const siteConfig = {
  name: "航的笔记本",
  url: "https://mhang.cc",
  description: "航的技术博客，记录学习与思考",
  locale: "zh-CN",
  author: "航",
  giscus: {
    repo: "yourname/blog",
    repoId: "R_xxx",
    category: "Announcements",
    categoryId: "DIC_xxx",
    mapping: "pathname" as const,
  },
  nav: [
    { title: "首页", href: "/" },
    { title: "分类", href: "/categories" },
    { title: "标签", href: "/tags" },
  ],
};
