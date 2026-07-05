---
title: "如何写一篇笔记"
description: "从创建文件到部署上线的完整流程指南"
date: "2026-07-05"
category: "指南"
tags: ["教程", "博客"]
---

## 整体流程

写一篇笔记只需要 **4 步**：

1. 在 `content/posts/` 下创建 `.md` 文件
2. 写好 frontmatter 和正文
3. `npm run dev` 本地预览效果
4. `./deploy.sh` 部署到服务器

---

## 第 1 步：创建文件

在项目的 `content/posts/` 目录下创建一个新文件：

```bash
# 文件名就是 URL 路径名
# 例如 my-first-note.md → 网址是 /notes/my-first-note
content/posts/my-first-note.md
```

### 文件格式

所有笔记统一使用 `.md` 格式，支持完整的 Markdown 语法和 `<NoteImage>` 组件。

### 子文件夹

你可以在 `content/posts/` 下创建子文件夹来分类管理，**文件夹名不会出现在 URL 中**：

```text
content/posts/
├── welcome.md               → /notes/welcome
├── 前端/
│   ├── react-hooks.md       → /notes/react-hooks
│   └── nextjs-tips.md       → /notes/nextjs-tips
└── 随笔/
    └── daily.md             → /notes/daily
```

> 文件名不要重复，否则会冲突。文件夹仅用于本地整理。

---

## 第 2 步：写 frontmatter

每个笔记文件**必须**以 YAML frontmatter 开头（`---` 包裹）：

```yaml
---
title: "我的第一篇笔记"
description: "这是一篇关于 XX 的笔记"
date: "2026-07-04"
category: "随笔"
tags: ["标签1", "标签2"]
---
```

### 字段说明

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `title` | ✅ | 字符串 | 文章标题，显示在页面和列表中 |
| `description` | ✅ | 字符串 | 一句话描述，用于 SEO 和列表预览 |
| `date` | ✅ | 字符串 | 发布日期，格式 `YYYY-MM-DD`，决定排序 |
| `category` | ✅ | 字符串 | 分类名（如"随笔"、"前端"、"工具"） |
| `tags` | ✅ | 数组 | 标签数组，如 `["React", "CSS"]` |
| `draft` | ❌ | 布尔值 | `true` 时不显示在网站上，默认 `false` |
| `password` | ❌ | 字符串 | 设置后文章会被加密，访问需输入密码 |

### 加密文章示例

```yaml
---
title: "私密笔记"
description: "需要密码才能查看"
date: "2026-07-04"
category: "私密"
tags: ["私密"]
password: "my-secret-password"
---
```

> 加密文章的正文会在构建时被 AES 加密，每次访问都需要输入密码。

---

## 第 3 步：写正文

frontmatter 下面的部分就是正文，完全使用 Markdown 语法。支持的功能：

### 基础语法

```markdown
**粗体**  *斜体*  ~~删除线~  `行内代码`

[链接文字](https://example.com)

> 引用块

- 无序列表
- 第二项

1. 有序列表
2. 第二项
```

### 代码高亮

支持 200+ 种语言，可标注文件名和行高亮：

````markdown
```typescript {3}
function greet(name: string) {
  const message = `Hello, ${name}!`; // 这一行会被高亮
  return message;
}
```
````

### 数学公式

```markdown
行内公式 $E = mc^2$

块级公式：
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
```

### 图片

**第 1 步**：在笔记同级目录下创建 `images/` 文件夹，把图片放进去：

```text
content/posts/CS50x/
├── C-basics.md
└── images/                  ← 图片文件夹（和 .md 文件同级）
    ├── screenshot.png
    └── diagram.svg
```

**第 2 步**：在 Markdown 中用**相对路径**引用：

```markdown
![图片描述](images/screenshot.png)
```

> **为什么用相对路径？** 这样 VS Code 的 Markdown 预览能正常显示；网站渲染时会自动把它解析到当前文章对应的图片目录。

#### 图片排版

使用 `<NoteImage>` 组件控制对齐和大小。**路径也用相对路径**（和标准 Markdown 图片一样）：

**居中**（默认）：

```jsx
<NoteImage src="images/photo.jpg" alt="描述" width="400" />
```

> `<NoteImage>` 的图片路径和 `![]()` 一样用相对路径 `images/xxx.png`，渲染时会自动解析。
> 纯 Markdown 预览器通常不会执行 `<NoteImage>` 这类组件；要看它的最终排版，需要用 `npm run dev` 在浏览器里预览。

**居右**：

```jsx
<NoteImage src="images/photo.jpg" alt="描述" width="400" align="right" />
```

**居左**：

```jsx
<NoteImage src="images/photo.jpg" alt="描述" width="400" align="left" />
```

**百分比宽度**：

```jsx
<NoteImage src="images/photo.jpg" alt="描述" width="50%" />
```

**带说明文字**：

```jsx
<NoteImage src="images/photo.jpg" alt="描述" width="400" caption="这是说明文字" />
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | 字符串 | 必填 | 图片路径，写相对路径如 `images/photo.jpg` |
| `alt` | 字符串 | 空 | 图片描述 |
| `width` | 字符串 | 无 | `"400"`（像素）或 `"50%"`（百分比），都用引号 |
| `align` | 字符串 | `"center"` | `"center"` / `"left"` / `"right"` |
| `caption` | 字符串 | 无 | 图片下方的说明文字 |

> ⚠️ `<NoteImage>` 组件在 `.md` 文件中即可使用，无需 `.mdx` 格式。

---

## 第 4 步：本地预览

写完笔记后，先本地看看效果：

```bash
npm run dev
# 浏览器打开 http://localhost:3000/notes/你的文件名
```

> ✅ 这个模式支持**热更新**：修改 `.md` 文件内容、替换图片后浏览器会自动刷新，无需手动刷新页面。

---

## 第 5 步：部署上线

确认没问题后，一条命令部署：

```bash
./deploy.sh
```

这个脚本会自动完成：
1. 同步图片 → `npm run build` 构建静态站点
2. 打包 `out/` 目录
3. `scp` 上传到服务器（120.26.254.10）
4. 在服务器上解压到 `/var/www/mhang-blog/`
5. `nginx -s reload` 刷新

部署完成后，访问 `http://120.26.254.10/notes/你的文件名` 即可看到新笔记。

---

## 快速复用模板

项目已内置模板文件 `content/posts/_template.md`（以 `_` 开头不会显示在网站上）。

**最快的方式**：

```bash
cp content/posts/_template.md content/posts/my-note.md
# 然后编辑 my-note.md，修改 title / date / 正文
# 最后 ./deploy.sh
```

---

## 常见问题

### 文件名有什么规则？

- 用英文、数字、连字符：`my-first-note.md`
- 不要用空格和中文（URL 会变成编码）
- 文件名 = URL 路径名：`react-hooks.md` → `/notes/react-hooks`

### date 日期怎么填？

格式 `YYYY-MM-DD`，如 `2026-07-04`。日期决定笔记在列表中的排序（新的在前）。

### 怎么让文章暂时不显示？

在 frontmatter 中加 `draft: true`：

```yaml
draft: true
```

### 图片支持哪些格式？

`.png`、`.jpg`、`.jpeg`、`.gif`、`.svg`、`.webp` 都可以。推荐 `.webp`（体积小）或 `.svg`（矢量图）。

### 写完忘了部署怎么办？

部署前可以先本地预览：

```bash
npm run dev
```

确认没问题再 `./deploy.sh`。
