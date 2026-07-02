import { getSearchIndex } from "../src/lib/posts";
import fs from "fs";
import path from "path";

const index = getSearchIndex();
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(
  path.join(publicDir, "search-index.json"),
  JSON.stringify(index)
);
console.log(`Search index generated: ${index.length} posts at public/search-index.json`);
