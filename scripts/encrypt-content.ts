/**
 * 构建时加密脚本
 * 扫描所有带 password 的文章，将渲染后的 HTML 用 AES 加密
 * 输出到 public/encrypted/[slug].json
 *
 * 加密格式（与 TonyCrane 兼容）:
 * { iv: base64, ciphertext: base64 }
 * 算法: AES-128-CBC, key = MD5(password), NoPadding
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CryptoJS from "crypto-js";
import { preparePostContent } from "../src/lib/posts";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUTPUT_DIR = path.join(process.cwd(), "public", "encrypted");

function findMarkdownFiles(dir: string, baseDir: string) {
  const results: { filePath: string; relativePath: string }[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
      results.push({ filePath: fullPath, relativePath });
    }
  }
  return results;
}

function pathToSlug(relativePath: string): string {
  const fileName = path.basename(relativePath);
  return fileName.replace(/\.(md|mdx)$/, "");
}

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    // 保留 Markdown 里的原生 HTML（例如 <img>），供加密文章解密后直接渲染。
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, {
      theme: { dark: "tokyo-night", light: "github-light" },
      keepBackground: false,
    })
    .use(rehypeKatex, { strict: false, throwOnError: false })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}

/**
 * 加密内容
 * AES-128-CBC, key = MD5(password), 随机 IV, PKCS7 填充
 */
function encryptContent(content: string, password: string) {
  const key = CryptoJS.MD5(password);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return {
    iv: CryptoJS.enc.Base64.stringify(iv),
    ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
  };
}

async function main() {
  console.log("🔐 扫描需要加密的文章...");

  const files = findMarkdownFiles(POSTS_DIR, POSTS_DIR);
  const encryptedPosts: string[] = [];

  // 确保输出目录存在
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 清空旧文件
  const oldFiles = fs.readdirSync(OUTPUT_DIR);
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(OUTPUT_DIR, f));
  }

  for (const { filePath, relativePath } of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as Record<string, unknown>;

    if (frontmatter.draft) continue;
    if (!frontmatter.password) continue;

    const slug = pathToSlug(relativePath);
    console.log(`  → 加密: ${slug}`);

    // 重写图片路径（相对路径 → 网站绝对路径）
    const rewrittenContent = preparePostContent(content, slug);

    // 渲染 markdown 为 HTML
    const html = await markdownToHtml(rewrittenContent);

    // 加密
    const encrypted = encryptContent(html, String(frontmatter.password));

    // 输出 JSON
    const outputPath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(
      outputPath,
      JSON.stringify({
        iv: encrypted.iv,
        ciphertext: encrypted.ciphertext,
        title: String(frontmatter.title || ""),
      })
    );

    encryptedPosts.push(slug);
  }

  // 输出加密文章列表（供构建时读取）
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "_index.json"),
    JSON.stringify(encryptedPosts)
  );

  console.log(`✅ 加密完成: ${encryptedPosts.length} 篇文章`);
}

main().catch((err) => {
  console.error("❌ 加密失败:", err);
  process.exit(1);
});
