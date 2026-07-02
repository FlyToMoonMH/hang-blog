import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import type { Post, Frontmatter, CategoryInfo, TagInfo } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function slugify(str: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(str);
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as Frontmatter;

      if (frontmatter.draft) return null;

      const slug = filename.replace(/\.mdx$/, "");
      const stats = readingTime(content);
      const minutes = Math.max(1, Math.ceil(stats.minutes));

      return {
        slug,
        frontmatter,
        content,
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

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;
  const stats = readingTime(content);
  const minutes = Math.max(1, Math.ceil(stats.minutes));

  return {
    slug,
    frontmatter,
    content,
    readingTime: `${minutes} 分钟阅读`,
  };
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
