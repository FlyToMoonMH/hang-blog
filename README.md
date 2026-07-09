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

## 同步飞书云文档

项目内置飞书 Wiki/云文档同步脚本，会把飞书文档读取为 Markdown，写入 `content/posts/Feishu/`，并把文档图片下载到文章目录的 `images/` 中，再沿用现有博客构建流程生成静态网页。

1. 在飞书开放平台创建企业自建应用，并开通云文档/Wiki 只读权限。
2. 把应用凭证写入 `.env.local`：

```bash
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
FEISHU_WIKI_URL=https://my.feishu.cn/wiki/xxx
```

3. 同步指定 Wiki 链接：

```bash
npm run sync:feishu -- --url "https://my.feishu.cn/wiki/NWcwwHBRCitpJVkNW8FcTxmCnNf?from=from_copylink"
```

也可以自定义分类和标签：

```bash
npm run sync:feishu -- --url "https://my.feishu.cn/wiki/xxx" --section "飞书" --category "随笔" --tags "feishu,同步"
```

同步完成后运行 `npm run dev` 预览，或运行 `npm run build && bash deploy.sh` 部署。

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
