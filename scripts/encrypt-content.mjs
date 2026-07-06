/**
 * 构建时加密脚本
 * 扫描所有带 password 的文章，将预处理后的 Markdown 走同一套 MDX 编译管线，
 * 再把编译结果序列化后加密，输出到 public/encrypted/{routePath}.json。
 */

process.env.NODE_ENV = "production";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CryptoJS from "crypto-js";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import GithubSlugger from "github-slugger";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const POSTS_DIR = path.join(ROOT, "content", "posts");
const OUTPUT_DIR = path.join(ROOT, "public", "encrypted");

const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypePrettyCode,
      {
        theme: { dark: "tokyo-night", light: "github-light" },
        keepBackground: false,
      },
    ],
    [rehypeKatex, { strict: false, throwOnError: false }],
  ],
};

function findMarkdownFiles(dir, baseDir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
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

function pathToSlug(relativePath) {
  const fileName = path.basename(relativePath);
  return fileName.replace(/\.(md|mdx)$/, "");
}

function slugify(value) {
  return new GithubSlugger().slug(value);
}

function pathToRoutePath(relativePath, rawFrontmatter) {
  const dir = path.dirname(relativePath);
  const dirParts = dir === "." ? [] : dir.split(path.sep);
  const fileName = path.basename(relativePath).replace(/\.(md|mdx)$/, "");
  const section = rawFrontmatter.section || dirParts[0] || rawFrontmatter.category || "未分类";
  const subsection = rawFrontmatter.subsection || (dirParts.length > 1 ? dirParts[1] : undefined);

  return [slugify(String(section)), ...(subsection ? [slugify(String(subsection))] : []), slugify(fileName)].join("/");
}

function rewriteImagePaths(content, routePath) {
  let result = content.replace(
    /\]\(images\/([^)]+)\)/g,
    `](/images/posts/${routePath}/images/$1)`
  );

  result = result.replace(
    /(<NoteImage\s[^>]*\bsrc=)"images\/([^"]+)"/g,
    `$1"/images/posts/${routePath}/images/$2"`
  );
  result = result.replace(
    /(<NoteImage\s[^>]*\bsrc=)'images\/([^']+)'/g,
    `$1'/images/posts/${routePath}/images/$2'`
  );
  result = result.replace(
    /(<img\s[^>]*\bsrc=)"images\/([^"]+)"/g,
    `$1"/images/posts/${routePath}/images/$2"`
  );
  result = result.replace(
    /(<img\s[^>]*\bsrc=)'images\/([^']+)'/g,
    `$1'/images/posts/${routePath}/images/$2'`
  );

  return result;
}

function encryptContent(content, password) {
  const key = CryptoJS.MD5(password);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv,
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
  const encryptedPosts = [];

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { filePath, relativePath } of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (data.draft) continue;
    if (!data.password) continue;

    const slug = pathToSlug(relativePath);
    const routePath = pathToRoutePath(relativePath, data);
    console.log(`  → 加密: ${slug}`);

    const preparedMarkdown = rewriteImagePaths(content, routePath);
    const serializedSource = await serialize(preparedMarkdown, { mdxOptions });
    const encrypted = encryptContent(
      JSON.stringify(serializedSource),
      String(data.password)
    );

    const outputPath = path.join(OUTPUT_DIR, `${routePath}.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(
      outputPath,
      JSON.stringify({
        iv: encrypted.iv,
        ciphertext: encrypted.ciphertext,
        title: String(data.title || ""),
        format: "mdx-serialized",
        version: 2,
      })
    );

    encryptedPosts.push(routePath);
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "_index.json"),
    JSON.stringify(encryptedPosts)
  );

  console.log(`✅ 加密完成: ${encryptedPosts.length} 篇文章`);
}

main().catch((error) => {
  console.error("❌ 加密失败:", error);
  process.exit(1);
});
