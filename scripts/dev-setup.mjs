/**
 * Dev 模式启动前的图片同步脚本
 * Turbopack 不跟随 public/ 下的符号链接，所以 dev 模式需要实际拷贝图片。
 * build/deploy 用 webpack，符号链接正常工作，不需要此脚本。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const CONTENT_DIR = path.join(ROOT, "content", "posts");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images", "posts");

/**
 * 遍历所有子目录，对每个目录执行回调（包括自身）
 */
function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      callback(full);
      walk(full, callback);
    }
  }
}

let synced = 0;

// 如果存在符号链接（来自 build），先删除，换成真实目录供 Turbopack 使用
if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
  const stat = fs.lstatSync(PUBLIC_IMAGES_DIR);
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(PUBLIC_IMAGES_DIR);
  }
}
fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

walk(CONTENT_DIR, (dirPath) => {
  const imagesDir = path.join(dirPath, "images");
  if (!fs.existsSync(imagesDir)) return;

  const mdFiles = fs.readdirSync(dirPath).filter(
    (f) => (f.endsWith(".md") || f.endsWith(".mdx")) && !f.startsWith("_")
  );

  for (const mdFile of mdFiles) {
    const slug = mdFile.replace(/\.(md|mdx)$/, "");
    const destDir = path.join(PUBLIC_IMAGES_DIR, slug, "images");

    const imageFiles = fs.readdirSync(imagesDir).filter((f) => !f.startsWith("."));
    if (imageFiles.length === 0) continue;

    fs.mkdirSync(destDir, { recursive: true });
    for (const img of imageFiles) {
      const src = path.join(imagesDir, img);
      if (fs.statSync(src).isDirectory()) continue;

      const dst = path.join(destDir, img);
      if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs) {
        fs.copyFileSync(src, dst);
        synced++;
      }
    }
  }
});

if (synced > 0) console.log(`  📸 Dev 图片同步: ${synced} 张`);
