# 航的笔记本

一个使用 Next.js 搭建的个人技术博客。

## 技术栈

- **Next.js 16** + App Router
- **TypeScript**
- **Tailwind CSS v3** + @tailwindcss/typography
- **MDX** (next-mdx-remote)
- **rehype-pretty-code** (Shiki 代码高亮)
- **next-themes** (暗色/亮色/自动模式)
- **Giscus** (评论系统)

## 功能

- 文章展示：Markdown 渲染、代码高亮、目录导航、阅读时长
- 分类管理：分类页 + 标签云
- 评论：Giscus 集成
- SEO：sitemap、RSS、动态 OG 图
- 主题：浅色/深色/自动（日出日落感知）
- 加密笔记：AES-128-CBC 客户端解密
- 搜索：全文搜索（Cmd/Ctrl+K）

## 开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 添加文章

在 `content/posts/` 目录下创建 `.md` 文件，参考 `content/posts/_template.md` 模板：

```markdown
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

```bash
bash deploy.sh
```

部署到阿里云服务器，自动构建 + 上传 + 重载 Nginx。

## 评论配置

1. 在 GitHub 仓库开启 Discussions
2. 安装 giscus app: https://github.com/apps/giscus
3. 在 https://giscus.app 获取 repo-id 和 category-id
4. 填入 `src/lib/site.ts` 中的 `giscus` 配置
