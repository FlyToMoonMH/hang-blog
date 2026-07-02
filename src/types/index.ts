export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  draft?: boolean;
}

export interface Post {
  slug: string;
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

export interface Comment {
  id: string;
  slug: string;
  name: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  replies?: Comment[];
}

export interface LikeData {
  slug: string;
  count: number;
}

export interface SidebarItem {
  title: string;
  slug?: string;
  children?: SidebarItem[];
  isFolder: boolean;
}

export interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  content: string;
}
