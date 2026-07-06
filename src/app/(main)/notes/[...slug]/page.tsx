import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllNotes,
  getBreadcrumbItemsForSection,
  getBreadcrumbItemsForSubsection,
  getNotesBySubsection,
  getPostByRouteSegments,
  getSectionBySlug,
  getSectionManifestEntries,
  getSubsectionBySlug,
} from "@/lib/posts";
import { decodeRouteSegments } from "@/lib/route-params";
import { siteConfig } from "@/lib/site";
import { NoteDetailPage } from "@/components/post/NoteDetailPage";
import { NotesSectionPage } from "@/components/post/NotesSectionPage";

export function generateStaticParams() {
  const noteParams = getAllNotes().map((post) => ({ slug: post.routeSegments }));
  const sectionParams = getSectionManifestEntries().flatMap((section) => [
    { slug: [section.slug] },
    ...section.subsections.map((subsection) => ({
      slug: [section.slug, subsection.slug],
    })),
  ]);

  return [...noteParams, ...sectionParams];
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const decodedSegments = decodeRouteSegments(slug);
    const post = getPostByRouteSegments(decodedSegments);

    if (post) {
      return {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        openGraph: {
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          url: `${siteConfig.url}${post.route}`,
          type: "article",
          publishedTime: post.frontmatter.date,
          tags: post.frontmatter.tags,
        },
      };
    }

    if (decodedSegments.length === 1) {
      const section = getSectionBySlug(decodedSegments[0]);
      if (!section) return {};

      return {
        title: section.name,
        description: section.description,
      };
    }

    if (decodedSegments.length === 2) {
      const subsection = getSubsectionBySlug(decodedSegments[0], decodedSegments[1]);
      if (!subsection) return {};

      return {
        title: `${subsection.sectionName} / ${subsection.name}`,
        description: subsection.description,
      };
    }

    return {};
  })();
}

export default async function NotesDynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const decodedSegments = decodeRouteSegments(slug);
  const post = getPostByRouteSegments(decodedSegments);

  if (post) {
    return <NoteDetailPage post={post} />;
  }

  if (decodedSegments.length === 1) {
    const section = getSectionBySlug(decodedSegments[0]);
    if (!section) {
      notFound();
    }

    return (
      <NotesSectionPage
        variant="section"
        title={section.name}
        description={section.description}
        breadcrumbs={getBreadcrumbItemsForSection(section)}
        subsections={section.subsections}
        notes={section.directPosts}
        highlightedNotes={section.featuredPosts}
      />
    );
  }

  if (decodedSegments.length === 2) {
    const subsection = getSubsectionBySlug(decodedSegments[0], decodedSegments[1]);
    if (!subsection) {
      notFound();
    }

    const posts = getNotesBySubsection(decodedSegments[0], decodedSegments[1]);
    const manifestNotes = subsection.posts.filter((entry) =>
      posts.some((postItem) => postItem.route === entry.route)
    );

    return (
      <NotesSectionPage
        variant="subsection"
        title={subsection.name}
        description={subsection.description}
        breadcrumbs={getBreadcrumbItemsForSubsection(subsection)}
        subsections={[]}
        notes={manifestNotes}
      />
    );
  }

  notFound();
}
