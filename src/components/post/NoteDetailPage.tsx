import { extractToc } from "@/lib/toc";
import { getAdjacentPosts, getBreadcrumbItemsForPost } from "@/lib/posts";
import type { Post } from "@/types";
import { PostHeader } from "./PostHeader";
import { PostBody } from "./PostBody";
import { MDXContent } from "./MDXContent";
import { PostTableOfContents } from "./PostTableOfContents";
import { PostNav } from "./PostNav";
import { CommentSection } from "./CommentSection";
import { PostActions } from "./PostActions";
import { PasswordGate } from "./PasswordGate";
import { POST_TOC_ASIDE_CLASSNAME } from "./post-layout";

export function NoteDetailPage({ post }: { post: Post }) {
  const toc = extractToc(post.content);
  const { prev, next } = getAdjacentPosts(post.route);
  const isEncrypted = !!post.frontmatter.password;
  const breadcrumbs = getBreadcrumbItemsForPost(post);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 max-w-3xl flex-1">
        <PostHeader post={post} breadcrumbs={breadcrumbs} />
        {isEncrypted ? (
          <PasswordGate
            encryptedPath={post.encryptedPath}
            postAssetBasePath={post.assetBasePath}
            slug={post.slug}
            title={post.frontmatter.title}
          />
        ) : (
          <PostBody>
            <MDXContent
              source={post.content}
              postAssetBasePath={post.assetBasePath}
            />
          </PostBody>
        )}
        <PostActions title={post.frontmatter.title} />
        <PostNav prev={prev} next={next} />
        <CommentSection identifier={post.routePath} />
      </article>
      {toc.length > 0 && (
        <aside className={POST_TOC_ASIDE_CLASSNAME}>
          <PostTableOfContents
            items={toc}
            unlockSlug={isEncrypted ? post.slug : undefined}
          />
        </aside>
      )}
    </div>
  );
}
