---
title: "文章标题"
description: "一句话描述这篇文章的内容"
date: "2026-07-04"
category: "随笔"
tags: ["标签1", "标签2"]
draft: false
---

正文从这里开始，完全使用 Markdown 语法书写。

## 二级标题

普通段落，支持 **粗体**、*斜体*、`行内代码`、[链接](https://example.com)、~~删除线~~。

### 列表

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

### 代码块

```typescript
const greeting = "Hello, World!";
console.log(greeting);
```

### 引用

> 这是一段引用文字。

### 表格

| 特性 | 状态 |
|------|------|
| 文章展示 | ✅ |
| 代码高亮 | ✅ |

### 图片

默认居左：
![描述文字](/images/your-image.png)

居中：
<div className="note-img-center">
  <img src="/images/your-image.png" alt="描述" width={400} />
</div>

### 数学公式

行内公式 $E = mc^2$，块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### 加密文章（可选）

在 frontmatter 中添加 `password` 字段即可：
```yaml
password: "your-password"
```
