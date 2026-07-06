export type ContentKind = "note" | "post";

export type ContentAccess = "public" | "protected";

export type ContentStatus = "draft" | "growing" | "evergreen";

export interface Frontmatter {
  title: string;
  nav_title?: string;
  description: string;
  summary?: string;
  date: string;
  updated?: string;
  category: string;
  section?: string;
  subsection?: string;
  order?: number;
  kind?: ContentKind;
  status?: ContentStatus;
  access?: ContentAccess;
  featured?: boolean;
  tags: string[];
  toc?: boolean;
  toc_max_depth?: number;
  draft?: boolean;
  password?: string;
}

export interface Post {
  slug: string;
  route: string;
  routePath: string;
  routeSegments: string[];
  assetBasePath: string;
  encryptedPath: string;
  sourcePath: string;
  frontmatter: Frontmatter;
  content: string;
  readingTime: string;
}

export interface TocItem {
  text: string;
  slug: string;
  level: number;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}

export interface TagInfo {
  name: string;
  slug: string;
  count: number;
}

export interface SidebarItem {
  id: string;
  title: string;
  slug?: string;
  route?: string;
  children?: SidebarItem[];
  isFolder: boolean;
  order?: number;
  description?: string;
}

export interface SearchIndexEntry {
  slug: string;
  route: string;
  title: string;
  navTitle: string;
  description: string;
  summary: string;
  section: string;
  subsection?: string;
  category: string;
  tags: string[];
  date: string;
  updated: string;
  access: ContentAccess;
  content: string;
}

export interface NoteManifestEntry {
  slug: string;
  route: string;
  routePath: string;
  routeSegments: string[];
  sourcePath: string;
  sectionSlug: string;
  subsectionSlug?: string;
  title: string;
  navTitle: string;
  description: string;
  summary: string;
  date: string;
  updated: string;
  section: string;
  subsection?: string;
  category: string;
  tags: string[];
  access: ContentAccess;
  order?: number;
  featured: boolean;
}

export interface NoteSectionSummary {
  name: string;
  slug: string;
  route: string;
  description: string;
  count: number;
  updated: string;
  posts: NoteManifestEntry[];
}

export interface SubsectionManifestEntry {
  name: string;
  slug: string;
  route: string;
  description: string;
  count: number;
  updated: string;
  sectionName: string;
  sectionSlug: string;
  posts: NoteManifestEntry[];
}

export interface SectionManifestEntry {
  name: string;
  slug: string;
  route: string;
  description: string;
  count: number;
  updated: string;
  posts: NoteManifestEntry[];
  directPosts: NoteManifestEntry[];
  subsections: SubsectionManifestEntry[];
  featuredPosts: NoteManifestEntry[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
