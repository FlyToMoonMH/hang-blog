# 航的笔记本

一个使用 Next.js 搭建的个人技术博客。

## 技术栈

- **Next.js 16** + App Router
- **TypeScript**
- **Tailwind CSS v3** + @tailwindcss/typography
- **MDX** (next-mdx-remote)
- **rehype-pretty-code** (Shiki 代码高亮)
- **next-themes** (暗色模式)
- **Giscus** (评论系统)

## 功能

- 文章展示：MDX 渲染、代码高亮、目录导航、阅读时长
- 分类管理：分类页 + 标签云
- 评论：Giscus 集成
- SEO：sitemap、RSS、动态 OG 图
- 暗色/亮色模式

## 开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 添加文章

在 `content/posts/` 目录下创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
description: "文章描述"
date: "2026-07-03"
category: "分类名"
tags: ["标签1", "标签2"]
---

正文内容...
```

## 部署

推送到 GitHub 后在 Vercel 导入即可。

## 评论配置

1. 在 GitHub 仓库开启 Discussions
2. 安装 giscus app: https://github.com/apps/giscus
3. 在 https://giscus.app 获取 repo-id 和 category-id
4. 填入 `src/lib/site.ts` 中的 `giscus` 配置
