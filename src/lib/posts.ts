import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import type {
  BreadcrumbItem,
  CategoryInfo,
  Frontmatter,
  NoteManifestEntry,
  NoteSectionSummary,
  Post,
  SearchIndexEntry,
  SectionManifestEntry,
  SidebarItem,
  SubsectionManifestEntry,
  TagInfo,
} from "@/types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

type MarkdownFile = {
  filePath: string;
  relativePath: string;
};

type RawFrontmatter = Partial<Frontmatter> & Record<string, unknown>;

type RouteInfo = {
  sectionName: string;
  sectionSlug: string;
  subsectionName?: string;
  subsectionSlug?: string;
  slugSegment: string;
  routeSegments: string[];
  routePath: string;
  route: string;
  assetBasePath: string;
  encryptedPath: string;
};

function slugify(str: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(str);
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "")
    : [];
}

function getDirectoryParts(relativePath: string): string[] {
  const dir = path.dirname(relativePath);
  return dir === "." ? [] : dir.split(path.sep);
}

function pathToSlug(relativePath: string): string {
  const fileName = path.basename(relativePath);
  return fileName.replace(/\.(md|mdx)$/, "");
}

function parseDate(value: string): number {
  return new Date(value).getTime();
}

function compareByOrderAndTitle(
  a: { order?: number; title: string },
  b: { order?: number; title: string }
): number {
  const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.title.localeCompare(b.title, "zh-CN");
}

function normalizeFrontmatter(
  data: RawFrontmatter,
  relativePath: string,
  slug: string
): Frontmatter {
  const dirParts = getDirectoryParts(relativePath);
  const title = toOptionalString(data.title) ?? slug;
  const section =
    toOptionalString(data.section) ??
    dirParts[0] ??
    toOptionalString(data.category) ??
    "未分类";
  const subsection =
    toOptionalString(data.subsection) ?? (dirParts.length > 1 ? dirParts[1] : undefined);
  const description =
    toOptionalString(data.description) ??
    toOptionalString(data.summary) ??
    `${title} 的笔记`;
  const date = toOptionalString(data.date) ?? new Date().toISOString().slice(0, 10);
  const updated = toOptionalString(data.updated) ?? date;
  const tags = toStringArray(data.tags);
  const access =
    toOptionalString(data.access) === "protected" || toOptionalString(data.password)
      ? "protected"
      : "public";
  const category = toOptionalString(data.category) ?? section;

  return {
    title,
    nav_title: toOptionalString(data.nav_title) ?? title,
    description,
    summary: toOptionalString(data.summary) ?? description,
    date,
    updated,
    category,
    section,
    subsection,
    order: toOptionalNumber(data.order),
    kind: toOptionalString(data.kind) === "post" ? "post" : "note",
    status:
      toOptionalString(data.status) === "draft" ||
      toOptionalString(data.status) === "growing"
        ? (toOptionalString(data.status) as "draft" | "growing")
        : "evergreen",
    access,
    featured: toOptionalBoolean(data.featured) ?? false,
    tags,
    toc: toOptionalBoolean(data.toc) ?? true,
    toc_max_depth: toOptionalNumber(data.toc_max_depth) ?? 3,
    draft: toOptionalBoolean(data.draft) ?? false,
    password: toOptionalString(data.password),
  };
}

function buildRouteInfo(frontmatter: Frontmatter, slug: string): RouteInfo {
  const sectionName = frontmatter.section ?? frontmatter.category;
  const sectionSlug = slugify(sectionName);
  const subsectionName = frontmatter.subsection;
  const subsectionSlug = subsectionName ? slugify(subsectionName) : undefined;
  const slugSegment = slugify(slug);
  const routeSegments = [sectionSlug, ...(subsectionSlug ? [subsectionSlug] : []), slugSegment];
  const routePath = routeSegments.join("/");

  return {
    sectionName,
    sectionSlug,
    subsectionName,
    subsectionSlug,
    slugSegment,
    routeSegments,
    routePath,
    route: `/notes/${routePath}`,
    assetBasePath: `/images/posts/${routePath}`,
    encryptedPath: `/encrypted/${routePath}.json`,
  };
}

function prepareReadingTime(content: string): string {
  const stats = readingTime(content);
  const minutes = Math.max(1, Math.ceil(stats.minutes));
  return `${minutes} 分钟阅读`;
}

function buildPostFromFile({ filePath, relativePath }: MarkdownFile): Post | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const slug = pathToSlug(relativePath);
  const frontmatter = normalizeFrontmatter(data as RawFrontmatter, relativePath, slug);

  if (frontmatter.draft) return null;

  const routeInfo = buildRouteInfo(frontmatter, slug);

  return {
    slug,
    route: routeInfo.route,
    routePath: routeInfo.routePath,
    routeSegments: routeInfo.routeSegments,
    assetBasePath: routeInfo.assetBasePath,
    encryptedPath: routeInfo.encryptedPath,
    sourcePath: relativePath,
    frontmatter,
    content: preparePostContent(content, routeInfo.routePath),
    readingTime: prepareReadingTime(content),
  };
}

function collectPosts(): Post[] {
  return findMarkdownFiles(POSTS_DIR, POSTS_DIR)
    .map(buildPostFromFile)
    .filter((post): post is Post => post !== null);
}

function validateNaturalHierarchy(manifest: NoteManifestEntry[]) {
  const noteRoutes = new Map<string, NoteManifestEntry>();
  const sectionSlugToName = new Map<string, string>();
  const subsectionSlugToName = new Map<string, string>();

  for (const note of manifest) {
    const existingNote = noteRoutes.get(note.routePath);
    if (existingNote) {
      throw new Error(
        `笔记路由冲突: "${existingNote.sourcePath}" 和 "${note.sourcePath}" 同时映射到 /notes/${note.routePath}`
      );
    }
    noteRoutes.set(note.routePath, note);

    const existingSectionName = sectionSlugToName.get(note.sectionSlug);
    if (existingSectionName && existingSectionName !== note.section) {
      throw new Error(
        `Section slug 冲突: "${existingSectionName}" 与 "${note.section}" 都映射到 "${note.sectionSlug}"`
      );
    }
    sectionSlugToName.set(note.sectionSlug, note.section);

    if (note.subsectionSlug) {
      const subsectionKey = `${note.sectionSlug}/${note.subsectionSlug}`;
      const existingSubsectionName = subsectionSlugToName.get(subsectionKey);
      if (existingSubsectionName && existingSubsectionName !== note.subsection) {
        throw new Error(
          `Subsection slug 冲突: "${existingSubsectionName}" 与 "${note.subsection}" 都映射到 "${subsectionKey}"`
        );
      }
      subsectionSlugToName.set(subsectionKey, note.subsection ?? "");
    }
  }

  const reservedRoutes = new Map<string, string>();

  for (const note of manifest) {
    if (!reservedRoutes.has(note.sectionSlug)) {
      reservedRoutes.set(note.sectionSlug, `section "${note.section}"`);
    }

    if (note.subsectionSlug) {
      const subsectionRoute = `${note.sectionSlug}/${note.subsectionSlug}`;
      if (!reservedRoutes.has(subsectionRoute)) {
        reservedRoutes.set(
          subsectionRoute,
          `subsection "${note.section} / ${note.subsection}"`
        );
      }
    }
  }

  for (const [routePath, source] of reservedRoutes) {
    const conflictingNote = noteRoutes.get(routePath);
    if (conflictingNote) {
      throw new Error(
        `保留分区路由冲突: ${source} 占用了 /notes/${routePath}，但笔记 "${conflictingNote.sourcePath}" 也映射到了这个地址`
      );
    }
  }
}

function buildNotesManifest(posts: Post[]): NoteManifestEntry[] {
  const manifest = posts.map((post) => {
    const routeInfo = buildRouteInfo(post.frontmatter, post.slug);

    return {
      slug: post.slug,
      route: post.route,
      routePath: post.routePath,
      routeSegments: post.routeSegments,
      sourcePath: post.sourcePath,
      sectionSlug: routeInfo.sectionSlug,
      subsectionSlug: routeInfo.subsectionSlug,
      title: post.frontmatter.title,
      navTitle: post.frontmatter.nav_title ?? post.frontmatter.title,
      description: post.frontmatter.description,
      summary: post.frontmatter.summary ?? post.frontmatter.description,
      date: post.frontmatter.date,
      updated: post.frontmatter.updated ?? post.frontmatter.date,
      section: routeInfo.sectionName,
      subsection: routeInfo.subsectionName,
      category: post.frontmatter.category,
      tags: post.frontmatter.tags,
      access: post.frontmatter.access ?? "public",
      order: post.frontmatter.order,
      featured: post.frontmatter.featured ?? false,
    };
  });

  validateNaturalHierarchy(manifest);
  return manifest;
}

/**
 * 递归扫描目录，找出所有 .md 和 .mdx 文件
 * 以 _ 或 . 开头的文件/文件夹会被跳过（如 _template.md、_drafts/、.obsidian/）
 */
function findMarkdownFiles(dir: string, baseDir: string): MarkdownFile[] {
  const results: MarkdownFile[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
    ) {
      results.push({ filePath: fullPath, relativePath });
    }
  }

  return results;
}

function buildSectionEntries(manifest: NoteManifestEntry[]): SectionManifestEntry[] {
  const sections = new Map<string, SectionManifestEntry>();

  for (const note of manifest) {
    let section = sections.get(note.sectionSlug);
    if (!section) {
      section = {
        name: note.section,
        slug: note.sectionSlug,
        route: `/notes/${note.sectionSlug}`,
        description: `围绕 ${note.section} 主题整理的笔记与长期知识库。`,
        count: 0,
        updated: note.updated,
        posts: [],
        directPosts: [],
        subsections: [],
        featuredPosts: [],
      };
      sections.set(note.sectionSlug, section);
    }

    section.posts.push(note);
    section.count += 1;
    if (parseDate(note.updated) > parseDate(section.updated)) {
      section.updated = note.updated;
    }
    if (note.featured && note.access === "public") {
      section.featuredPosts.push(note);
    }

    if (!note.subsectionSlug || !note.subsection) {
      section.directPosts.push(note);
      continue;
    }

    let subsection = section.subsections.find((item) => item.slug === note.subsectionSlug);
    if (!subsection) {
      subsection = {
        name: note.subsection,
        slug: note.subsectionSlug,
        route: `/notes/${note.sectionSlug}/${note.subsectionSlug}`,
        description: `围绕 ${note.section} / ${note.subsection} 整理的专题笔记。`,
        count: 0,
        updated: note.updated,
        sectionName: note.section,
        sectionSlug: note.sectionSlug,
        posts: [],
      };
      section.subsections.push(subsection);
    }

    subsection.posts.push(note);
    subsection.count += 1;
    if (parseDate(note.updated) > parseDate(subsection.updated)) {
      subsection.updated = note.updated;
    }
  }

  return Array.from(sections.values())
    .map((section) => ({
      ...section,
      posts: [...section.posts].sort((a, b) =>
        compareByOrderAndTitle(
          { order: a.order, title: a.navTitle },
          { order: b.order, title: b.navTitle }
        )
      ),
      directPosts: [...section.directPosts].sort((a, b) =>
        compareByOrderAndTitle(
          { order: a.order, title: a.navTitle },
          { order: b.order, title: b.navTitle }
        )
      ),
      subsections: [...section.subsections]
        .map((subsection) => ({
          ...subsection,
          posts: [...subsection.posts].sort((a, b) =>
            compareByOrderAndTitle(
              { order: a.order, title: a.navTitle },
              { order: b.order, title: b.navTitle }
            )
          ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "zh-CN")),
      featuredPosts: [...section.featuredPosts].sort((a, b) =>
        parseDate(b.updated) - parseDate(a.updated)
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

export function getAllPosts(): Post[] {
  return collectPosts().sort(
    (a, b) => parseDate(b.frontmatter.date) - parseDate(a.frontmatter.date)
  );
}

export function getAllNotes(): Post[] {
  return collectPosts()
    .filter((post) => post.frontmatter.kind !== "post")
    .sort((a, b) => {
      const sectionCompare = (a.frontmatter.section ?? "").localeCompare(
        b.frontmatter.section ?? "",
        "zh-CN"
      );

      if (sectionCompare !== 0) return sectionCompare;

      const subsectionCompare = (a.frontmatter.subsection ?? "").localeCompare(
        b.frontmatter.subsection ?? "",
        "zh-CN"
      );

      if (subsectionCompare !== 0) return subsectionCompare;

      return compareByOrderAndTitle(
        {
          order: a.frontmatter.order,
          title: a.frontmatter.nav_title ?? a.frontmatter.title,
        },
        {
          order: b.frontmatter.order,
          title: b.frontmatter.nav_title ?? b.frontmatter.title,
        }
      );
    });
}

export function getNotesManifest(): NoteManifestEntry[] {
  return buildNotesManifest(getAllNotes());
}

export function getSectionManifestEntries(): SectionManifestEntry[] {
  return buildSectionEntries(getNotesManifest());
}

export function getNoteSectionSummaries(): NoteSectionSummary[] {
  return getSectionManifestEntries().map((section) => ({
    name: section.name,
    slug: section.slug,
    route: section.route,
    description: section.description,
    count: section.count,
    updated: section.updated,
    posts: section.posts,
  }));
}

export function getSectionBySlug(sectionSlug: string): SectionManifestEntry | null {
  return getSectionManifestEntries().find((section) => section.slug === sectionSlug) ?? null;
}

export function getSubsectionBySlug(
  sectionSlug: string,
  subsectionSlug: string
): SubsectionManifestEntry | null {
  const section = getSectionBySlug(sectionSlug);
  if (!section) return null;

  return section.subsections.find((subsection) => subsection.slug === subsectionSlug) ?? null;
}

export function getNotesBySection(sectionSlug: string): Post[] {
  return getAllNotes().filter(
    (post) => buildRouteInfo(post.frontmatter, post.slug).sectionSlug === sectionSlug
  );
}

export function getNotesBySubsection(
  sectionSlug: string,
  subsectionSlug: string
): Post[] {
  return getAllNotes().filter((post) => {
    const routeInfo = buildRouteInfo(post.frontmatter, post.slug);
    return (
      routeInfo.sectionSlug === sectionSlug &&
      routeInfo.subsectionSlug === subsectionSlug
    );
  });
}

export function getBreadcrumbItemsForPost(post: Post): BreadcrumbItem[] {
  const routeInfo = buildRouteInfo(post.frontmatter, post.slug);
  const items: BreadcrumbItem[] = [
    { label: "笔记", href: "/notes" },
    {
      label: routeInfo.sectionName,
      href: `/notes/${routeInfo.sectionSlug}`,
    },
  ];

  if (routeInfo.subsectionName && routeInfo.subsectionSlug) {
    items.push({
      label: routeInfo.subsectionName,
      href: `/notes/${routeInfo.sectionSlug}/${routeInfo.subsectionSlug}`,
    });
  }

  items.push({
    label: post.frontmatter.nav_title ?? post.frontmatter.title,
    current: true,
  });

  return items;
}

export function getBreadcrumbItemsForSection(
  section: SectionManifestEntry
): BreadcrumbItem[] {
  return [
    { label: "笔记", href: "/notes" },
    { label: section.name, current: true },
  ];
}

export function getBreadcrumbItemsForSubsection(
  subsection: SubsectionManifestEntry
): BreadcrumbItem[] {
  return [
    { label: "笔记", href: "/notes" },
    {
      label: subsection.sectionName,
      href: `/notes/${subsection.sectionSlug}`,
    },
    { label: subsection.name, current: true },
  ];
}

export function getFeaturedNotes(limit = 3): Post[] {
  const notes = getAllNotes();
  const featured = notes.filter(
    (post) =>
      post.frontmatter.featured && (post.frontmatter.access ?? "public") === "public"
  );

  if (featured.length > 0) {
    return featured.slice(0, limit);
  }

  return notes
    .filter((post) => (post.frontmatter.access ?? "public") === "public")
    .sort(
      (a, b) =>
        parseDate(b.frontmatter.updated ?? b.frontmatter.date) -
        parseDate(a.frontmatter.updated ?? a.frontmatter.date)
    )
    .slice(0, limit);
}

export function getRecentlyUpdatedNotes(limit = 6): Post[] {
  return getAllNotes()
    .sort(
      (a, b) =>
        parseDate(b.frontmatter.updated ?? b.frontmatter.date) -
        parseDate(a.frontmatter.updated ?? a.frontmatter.date)
    )
    .slice(0, limit);
}

/**
 * 将文章内容中的相对图片路径重写为网站绝对路径。
 *
 * 普通文章和加密文章都共用这一层预处理，
 * 这样作者始终只需要写一种内容语法。
 */
export function rewriteImagePaths(content: string, routePath: string): string {
  let result = content.replace(
    /\]\(images\/([^)]+)\)/g,
    `](/images/posts/${routePath}/images/$1)`
  );

  result = result.replace(
    /(<NoteImage\s[^>]*\bsrc=)"images\/([^"]+)"/g,
    `$1"/images/posts/${routePath}/images/$2"`
  );
  result = result.replace(
    /(<NoteImage\s[^>]*\bsrc=)'images\/([^']+)'/g,
    `$1'/images/posts/${routePath}/images/$2'`
  );
  result = result.replace(
    /(<img\s[^>]*\bsrc=)"images\/([^"]+)"/g,
    `$1"/images/posts/${routePath}/images/$2"`
  );
  result = result.replace(
    /(<img\s[^>]*\bsrc=)'images\/([^']+)'/g,
    `$1'/images/posts/${routePath}/images/$2'`
  );

  return result;
}

export function preparePostContent(content: string, routePath: string): string {
  return rewriteImagePaths(content, routePath);
}

export function getPostByRouteSegments(routeSegments: string[]): Post | null {
  const joined = routeSegments.join("/");
  return getAllNotes().find((post) => post.routePath === joined) ?? null;
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter(
    (post) => slugify(post.frontmatter.category) === categorySlug
  );
}

export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter((post) =>
    post.frontmatter.tags.some((tag) => slugify(tag) === tagSlug)
  );
}

export function getAllCategories(): CategoryInfo[] {
  const map = new Map<string, CategoryInfo>();

  for (const post of getAllPosts()) {
    const name = post.frontmatter.category;
    const slug = slugify(name);
    const existing = map.get(slug);

    if (existing) {
      existing.count++;
    } else {
      map.set(slug, { name, slug, count: 1 });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getAllTags(): TagInfo[] {
  const map = new Map<string, TagInfo>();

  for (const post of getAllPosts()) {
    for (const name of post.frontmatter.tags) {
      const slug = slugify(name);
      const existing = map.get(slug);
      if (existing) {
        existing.count++;
      } else {
        map.set(slug, { name, slug, count: 1 });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getAdjacentPosts(route: string): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = getAllNotes();
  const index = posts.findIndex((post) => post.route === route);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export { slugify };

export function getSidebarTree(): SidebarItem[] {
  return getSectionManifestEntries().map((section) => ({
    id: `section:${section.slug}`,
    title: section.name,
    route: section.route,
    isFolder: true,
    order: section.posts[0]?.order,
    children: [
      ...section.subsections.map((subsection) => ({
        id: `section:${section.slug}/subsection:${subsection.slug}`,
        title: subsection.name,
        route: subsection.route,
        isFolder: true,
        order: subsection.posts[0]?.order,
        children: subsection.posts.map((note) => ({
          id: `note:${note.routePath}`,
          title: note.navTitle,
          slug: note.slug,
          route: note.route,
          isFolder: false,
          order: note.order,
          description: note.summary,
        })),
      })),
      ...section.directPosts.map((note) => ({
        id: `note:${note.routePath}`,
        title: note.navTitle,
        slug: note.slug,
        route: note.route,
        isFolder: false,
        order: note.order,
        description: note.summary,
      })),
    ],
  }));
}

export function getSearchIndex(): SearchIndexEntry[] {
  return getAllNotes().map((post) => {
    const routeInfo = buildRouteInfo(post.frontmatter, post.slug);

    return {
      slug: post.slug,
      route: post.route,
      title: post.frontmatter.title,
      navTitle: post.frontmatter.nav_title ?? post.frontmatter.title,
      description: post.frontmatter.description,
      summary: post.frontmatter.summary ?? post.frontmatter.description,
      section: routeInfo.sectionName,
      subsection: routeInfo.subsectionName,
      category: post.frontmatter.category,
      tags: post.frontmatter.tags,
      date: post.frontmatter.date,
      updated: post.frontmatter.updated ?? post.frontmatter.date,
      access: post.frontmatter.access ?? "public",
      content:
        (post.frontmatter.access ?? "public") === "protected"
          ? ""
          : post.content.slice(0, 2500),
    };
  });
}
