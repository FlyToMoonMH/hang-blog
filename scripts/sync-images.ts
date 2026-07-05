import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");

function walk(dir: string, callback: (dirPath: string) => void) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      const full = path.join(dir, entry.name);
      callback(full);
      walk(full, callback);
    }
  }
}

function syncImages() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log("  → content/posts/ 目录不存在，跳过图片同步");
    return;
  }

  // 确保目标目录存在并清空旧图片
  if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.rmSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }

  let synced = 0;

  walk(CONTENT_DIR, (dirPath) => {
    const imagesDir = path.join(dirPath, "images");
    if (!fs.existsSync(imagesDir)) return;

    // 同级目录下的 md/mdx 文件，slug = 文件名去掉扩展名
    const mdFiles = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".md") && !f.startsWith("._"));

    for (const mdFile of mdFiles) {
      const slug = mdFile.replace(/\.(md|mdx)$/, "");
      const destDir = path.join(PUBLIC_IMAGES_DIR, slug);

      const imageFiles = fs.readdirSync(imagesDir).filter((f) => !f.startsWith("."));
      if (imageFiles.length === 0) continue;

      fs.mkdirSync(destDir, { recursive: true });
      for (const img of imageFiles) {
        const fullSrc = path.join(imagesDir, img);
        if (fs.statSync(fullSrc).isDirectory()) continue;
        fs.copyFileSync(fullSrc, path.join(destDir, img));
        synced++;
        console.log(`  ✓ ${slug}/${img}`);
      }
    }
  });

  console.log(`  → 同步完成: ${synced} 张图片`);
}

syncImages();
