---
title: "深入理解 Next.js App Router"
description: "从零开始理解 Next.js App Router 的路由系统、服务端组件和布局模式"
date: "2026-07-02"
category: "Next.js"
tags: ["nextjs", "react", "app-router", "ssr"]
---

## 什么是 App Router

Next.js 13 引入了全新的 App Router，它基于 React Server Components 构建，提供了一种更强大、更灵活的路由方式。

### 文件系统路由

App Router 使用文件夹来定义路由。每个文件夹代表一个路由段：

```text
app/
├── page.tsx          → /
├── blog/
│   ├── page.tsx      → /blog
│   └── [slug]/
│       └── page.tsx  → /blog/:slug
└── about/
    └── page.tsx      → /about
```

## Server Components 与 Client Components

App Router 中，组件默认是 Server Components：

```typescript
// Server Component — 默认
export default function Page() {
  return <h1>Hello, World!</h1>;
}
```

如果需要客户端交互，添加 `"use client"` 指令：

```typescript
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

## 布局与模板

使用 `layout.tsx` 定义共享布局，它会在路由切换时保持不变：

```typescript
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
```

## 动态路由与静态生成

```typescript
// 生成所有静态路径
export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 动态生成元数据
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.description,
  };
}
```

## 总结

App Router 带来了更强大的路由系统，结合 Server Components 可以实现更好的性能和开发体验。虽然迁移成本存在，但长期来看是值得的。
