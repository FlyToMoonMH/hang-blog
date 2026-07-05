import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { extractToc } from "@/lib/toc";
import { siteConfig } from "@/lib/site";
import { PostHeader } from "@/components/post/PostHeader";
import { PostBody } from "@/components/post/PostBody";
import { MDXContent } from "@/components/post/MDXContent";
import { TableOfContents } from "@/components/post/TableOfContents";
import { PostNav } from "@/components/post/PostNav";
import { CommentSection } from "@/components/post/CommentSection";
import { PostActions } from "@/components/post/PostActions";
import { PasswordGate } from "@/components/post/PasswordGate";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};

    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        url: `${siteConfig.url}/notes/${post.slug}`,
        type: "article",
        publishedTime: post.frontmatter.date,
        tags: post.frontmatter.tags,
      },
    };
  })();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const toc = extractToc(post.content);
  const { prev, next } = getAdjacentPosts(slug);
  const isEncrypted = !!post.frontmatter.password;

  return (
    <div className="flex gap-8">
      <article className="min-w-0 max-w-3xl flex-1">
        <PostHeader post={post} />
        {isEncrypted ? (
          <PasswordGate slug={post.slug} title={post.frontmatter.title} />
        ) : (
          <PostBody>
            <MDXContent source={post.content} postSlug={post.slug} />
          </PostBody>
        )}
        <PostActions title={post.frontmatter.title} />
        <PostNav prev={prev} next={next} />
        <CommentSection slug={post.slug} />
      </article>
      {!isEncrypted && (
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 xl:block">
          <TableOfContents items={toc} />
        </aside>
      )}
    </div>
  );
}
