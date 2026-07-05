/**
 * Build 模式启动前的图片准备脚本
 * 将 public/images/posts 重建为指向 content/posts 的符号链接，
 * 避免 dev 模式留下的真实目录和 build 模式的符号链接互相打架。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const CONTENT_DIR = path.join(ROOT, "content", "posts");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images", "posts");
const PUBLIC_IMAGES_PARENT = path.dirname(PUBLIC_IMAGES_DIR);

if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.rmSync(PUBLIC_IMAGES_DIR, { recursive: true, force: true });
}

fs.mkdirSync(PUBLIC_IMAGES_PARENT, { recursive: true });
fs.symlinkSync(path.relative(PUBLIC_IMAGES_PARENT, CONTENT_DIR), PUBLIC_IMAGES_DIR, "dir");
