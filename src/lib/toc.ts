import GithubSlugger from "github-slugger";
import type { TocItem } from "@/types";

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const items: TocItem[] = [];

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.*)/.exec(line);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*`]/g, "").trim();
      items.push({ text, slug: slugger.slug(text), level });
    }
  }

  return items;
}
