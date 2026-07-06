import { Feed } from "feed";
import { getAllPosts } from "../src/lib/posts";
import { siteConfig } from "../src/lib/site";
import fs from "fs";
import path from "path";

const feed = new Feed({
  title: siteConfig.name,
  description: siteConfig.description,
  id: siteConfig.url,
  link: siteConfig.url,
  language: "zh-CN",
  image: `${siteConfig.url}/favicon.ico`,
  copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.name}`,
  feedLinks: {
    rss: `${siteConfig.url}/rss.xml`,
  },
});

const posts = getAllPosts();
posts.forEach((post) => {
  feed.addItem({
    title: post.frontmatter.title,
    id: `${siteConfig.url}${post.route}`,
    link: `${siteConfig.url}${post.route}`,
    description: post.frontmatter.description,
    date: new Date(post.frontmatter.date),
    category: post.frontmatter.tags.map((tag) => ({ name: tag })),
  });
});

const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, "rss.xml"), feed.rss2());
console.log("RSS feed generated at public/rss.xml");
