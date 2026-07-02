import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

const remarkPlugins: PluggableList = [remarkGfm];

const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
  [
    rehypePrettyCode,
    {
      theme: { dark: "github-dark", light: "github-light" },
      keepBackground: false,
    },
  ],
];

export const mdxOptions = {
  remarkPlugins,
  rehypePlugins,
};
