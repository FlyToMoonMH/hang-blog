---
title: "欢迎来到航的笔记本"
description: "这是一个使用 Next.js 搭建的个人技术博客，记录学习与思考"
summary: "这个站点的定位、技术栈，以及接下来会如何组织成一个更清晰的知识库。"
date: "2026-07-03"
updated: "2026-07-06"
category: "随笔"
section: "开始使用"
nav_title: "欢迎"
order: 1
featured: true
tags: ["博客", "nextjs", "react"]
---

## 关于这个博客

你好，欢迎来到「航的笔记本」。

这里是我记录技术学习、思考和生活感悟的地方。我会在这里分享关于前端开发、React 生态、以及各种有趣技术的内容。

## 博客特性

这个博客使用以下技术栈构建：

- **Next.js 16** — React 全栈框架
- **TypeScript** — 类型安全的开发体验
- **MDX** — 在 Markdown 中使用 React 组件
- **Tailwind CSS** — 原子化 CSS 框架
- **Giscus** — 基于 GitHub Discussions 的评论系统

## 代码高亮示例

博客支持优美的代码高亮，包括明暗双主题：

```typescript
interface Post {
  title: string;
  date: string;
  tags: string[];
}

function getLatestPost(posts: Post[]): Post | null {
  if (posts.length === 0) return null;
  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}
```

也支持行高亮：

```typescript {3}
function greet(name: string) {
  const message = `Hello, ${name}!`; // 高亮这一行
  return message;
}
```

## 表格支持

| 特性 | 状态 | 说明 |
|------|------|------|
| 文章展示 | ✅ | MDX 渲染 + 代码高亮 |
| 分类管理 | ✅ | 分类 + 标签系统 |
| 评论功能 | ✅ | Giscus 集成 |
| 暗色模式 | ✅ | 无闪烁切换 |
| SEO | ✅ | sitemap + RSS + OG 图 |

## 接下来

我会持续在这里更新内容，感谢你的访问。如果你有任何想法，欢迎在评论区留言。
