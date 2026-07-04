import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";

const remarkPlugins: PluggableList = [remarkGfm, remarkMath];

const rehypePlugins: PluggableList = [
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
];

export const mdxOptions = {
  remarkPlugins,
  rehypePlugins,
};
