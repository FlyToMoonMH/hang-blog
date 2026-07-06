/**
 * Build 模式启动前的图片准备脚本
 * 按文章层级路由将文章同级的 images 目录同步到
 * public/images/posts/{routePath}/images。
 * 这样 build 和 dev 的图片目录结构保持一致，避免子目录文章在线上丢图。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import GithubSlugger from "github-slugger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const CONTENT_DIR = path.join(ROOT, "content", "posts");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images", "posts");

function slugify(value) {
  return new GithubSlugger().slug(value);
}

function normalizeRoutePath(relativePath, rawFrontmatter) {
  const dir = path.dirname(relativePath);
  const dirParts = dir === "." ? [] : dir.split(path.sep);
  const fileName = path.basename(relativePath).replace(/\.(md|mdx)$/, "");
  const section = rawFrontmatter.section || dirParts[0] || rawFrontmatter.category || "未分类";
  const subsection = rawFrontmatter.subsection || (dirParts.length > 1 ? dirParts[1] : undefined);

  return [slugify(String(section)), ...(subsection ? [slugify(String(subsection))] : []), slugify(fileName)].join("/");
}

function walk(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(full, ...walk(full));
    }
  }

  return results;
}

if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.rmSync(PUBLIC_IMAGES_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

let synced = 0;

for (const dirPath of walk(CONTENT_DIR)) {
  const imagesDir = path.join(dirPath, "images");
  if (!fs.existsSync(imagesDir)) continue;

  const mdFiles = fs.readdirSync(dirPath).filter(
    (f) => (f.endsWith(".md") || f.endsWith(".mdx")) && !f.startsWith("_")
  );

  for (const mdFile of mdFiles) {
    const relativeFilePath = path.relative(CONTENT_DIR, path.join(dirPath, mdFile));
    const raw = fs.readFileSync(path.join(dirPath, mdFile), "utf-8");
    const { data } = matter(raw);
    const routePath = normalizeRoutePath(relativeFilePath, data);
    const destDir = path.join(PUBLIC_IMAGES_DIR, routePath, "images");
    const imageFiles = fs.readdirSync(imagesDir).filter((f) => !f.startsWith("."));
    if (imageFiles.length === 0) continue;

    fs.mkdirSync(destDir, { recursive: true });

    for (const imageFile of imageFiles) {
      const src = path.join(imagesDir, imageFile);
      if (fs.statSync(src).isDirectory()) continue;

      fs.copyFileSync(src, path.join(destDir, imageFile));
      synced++;
    }
  }
}

if (synced > 0) console.log(`  📸 Build 图片同步: ${synced} 张`);
