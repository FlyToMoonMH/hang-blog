import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import type { Post, Frontmatter, CategoryInfo, TagInfo, SidebarItem, SearchIndexEntry } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function slugify(str: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(str);
}

/**
 * 递归扫描目录，找出所有 .md 和 .mdx 文件
 * 以 _ 或 . 开头的文件/文件夹会被跳过（如 _template.md、_drafts/、.obsidian/）
 */
function findMarkdownFiles(
  dir: string,
  baseDir: string
): { filePath: string; relativePath: string }[] {
  const results: { filePath: string; relativePath: string }[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // 跳过以 _ 或 . 开头的文件/文件夹
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
    ) {
      results.push({ filePath: fullPath, relativePath });
    }
  }

  return results;
}

/**
 * 从文件相对路径提取 slug（只用文件名，不含文件夹路径）
 * 例: "笔记/daily.md"    → "daily"
 *     "前端/react.mdx"   → "react"
 *     "welcome.mdx"      → "welcome"
 * 文件夹仅用于本地整理，不出现在 URL 中
 */
function pathToSlug(relativePath: string): string {
  const fileName = path.basename(relativePath);
  return fileName.replace(/\.(md|mdx)$/, "");
}

export function getAllPosts(): Post[] {
  const files = findMarkdownFiles(POSTS_DIR, POSTS_DIR);

  const posts = files
    .map(({ filePath, relativePath }) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as Frontmatter;

      if (frontmatter.draft) return null;

      const slug = pathToSlug(relativePath);
      const stats = readingTime(content);
      const minutes = Math.max(1, Math.ceil(stats.minutes));

      return {
        slug,
        frontmatter,
        content: rewriteImagePaths(content, slug),
        readingTime: `${minutes} 分钟阅读`,
      } as Post;
    })
    .filter((p): p is Post => p !== null);

  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return posts;
}

/**
 * 将 MDX 中的相对图片路径重写为构建后的绝对路径
 * images/xxx.png → /images/posts/{slug}/xxx.png
 * 这样 VS Code 预览用相对路径，网站用绝对路径，两边都能正常显示
 */
function rewriteImagePaths(content: string, slug: string): string {
  return content.replace(
    /\]\(images\/([^)]+)\)/g,
    `](/images/posts/${slug}/$1)`
  );
}

export function getPostBySlug(slug: string): Post | null {
  // slug 是文件名（不含扩展名），文件可能在子文件夹中
  // 遍历所有文章文件查找匹配的 slug
  const files = findMarkdownFiles(POSTS_DIR, POSTS_DIR);

  for (const { filePath, relativePath } of files) {
    if (pathToSlug(relativePath) === slug) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as Frontmatter;
      const stats = readingTime(content);
      const minutes = Math.max(1, Math.ceil(stats.minutes));

      return {
        slug,
        frontmatter,
        content: rewriteImagePaths(content, slug),
        readingTime: `${minutes} 分钟阅读`,
      };
    }
  }

  return null;
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((post) => {
    return slugify(post.frontmatter.category) === categorySlug;
  });
}

export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter((post) => {
    return post.frontmatter.tags.some((tag) => slugify(tag) === tagSlug);
  });
}

export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts();
  const map = new Map<string, CategoryInfo>();

  posts.forEach((post) => {
    const name = post.frontmatter.category;
    const slug = slugify(name);
    const existing = map.get(slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(slug, { name, slug, count: 1 });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getAllTags(): TagInfo[] {
  const posts = getAllPosts();
  const map = new Map<string, TagInfo>();

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((name) => {
      const slug = slugify(name);
      const existing = map.get(slug);
      if (existing) {
        existing.count++;
      } else {
        map.set(slug, { name, slug, count: 1 });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getAdjacentPosts(slug: string): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export { slugify };

/**
 * 构建侧边栏树结构
 * 根据 content/posts/ 的文件夹层级自动生成
 */
export function getSidebarTree(): SidebarItem[] {
  const files = findMarkdownFiles(POSTS_DIR, POSTS_DIR);
  const tree: SidebarItem[] = [];

  for (const { filePath, relativePath } of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const frontmatter = data as Frontmatter;
    if (frontmatter.draft) continue;

    const slug = pathToSlug(relativePath);
    const title = frontmatter.title || slug;
    const dir = path.dirname(relativePath);

    if (dir === ".") {
      // 根目录文件
      tree.push({ title, slug, isFolder: false });
    } else {
      // 子文件夹中的文件
      const parts = dir.split(path.sep);
      let currentLevel = tree;

      for (const part of parts) {
        let existing = currentLevel.find(
          (item) => item.isFolder && item.title === part
        );
        if (!existing) {
          existing = { title: part, isFolder: true, children: [] };
          currentLevel.push(existing);
        }
        if (!existing.children) existing.children = [];
        currentLevel = existing.children;
      }

      currentLevel.push({ title, slug, isFolder: false });
    }
  }

  // 排序：文件夹在前，文件在后；文件夹按名称排序，文件按日期倒序
  function sortItems(items: SidebarItem[]) {
    items.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      if (a.isFolder && b.isFolder) {
        return a.title.localeCompare(b.title, "zh-CN");
      }
      return 0;
    });
    items.forEach((item) => {
      if (item.children) sortItems(item.children);
    });
  }
  sortItems(tree);

  return tree;
}

/**
 * 生成搜索索引（用于客户端全文搜索）
 */
export function getSearchIndex(): SearchIndexEntry[] {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    category: post.frontmatter.category,
    tags: post.frontmatter.tags,
    date: post.frontmatter.date,
    content: post.content.slice(0, 2000),
  }));
}
