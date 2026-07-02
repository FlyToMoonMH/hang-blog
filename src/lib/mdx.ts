import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import { tonycraneDark, tonycraneLight } from "./shiki-themes";

const remarkPlugins: PluggableList = [remarkGfm, remarkMath];

const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
  [
    rehypePrettyCode,
    {
      theme: { dark: tonycraneDark, light: tonycraneLight },
      keepBackground: false,
    },
  ],
  [rehypeKatex, { strict: false, throwOnError: false }],
];

export const mdxOptions = {
  remarkPlugins,
  rehypePlugins,
};
