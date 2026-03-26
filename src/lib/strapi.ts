/**
 * Strapi CMS API client for codigo-obsidiana.
 *
 * Requires env vars:
 *   STRAPI_URL        — base URL, e.g. https://your-project.strapiapp.com
 *   STRAPI_API_TOKEN  — read-only API token
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StrapiPost {
  documentId: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  publishDate: string;
  updated: string | null;
  tags: string[];
  author: string;
  readingTime: number | null;
  image: string;
  draft: boolean;
  locale: string;
}

export interface StrapiProject {
  documentId: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  publishDate: string;
  technologies: string[];
  tags: string[];
  role: string;
  company: string;
  status: string;
  image: string;
  imageProjectPrefix: string;
  showInAbout: boolean;
  locale: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getStrapiURL(): string {
  const url = import.meta.env.STRAPI_URL;
  if (!url) throw new Error('STRAPI_URL env var is not set');
  return url.replace(/\/$/, '');
}

function getToken(): string {
  const token = import.meta.env.STRAPI_API_TOKEN;
  if (!token) throw new Error('STRAPI_API_TOKEN env var is not set');
  return token;
}

async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${getStrapiURL()}/api${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    throw new Error(`Strapi GET ${path} → ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { total: number } };
}

interface StrapiSingleResponse<T> {
  data: T | null;
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

function mapPost(raw: Record<string, unknown>): StrapiPost {
  return {
    documentId: raw.documentId as string,
    slug: raw.slug as string,
    title: raw.title as string,
    description: raw.description as string,
    body: (raw.body as string) ?? '',
    publishDate: raw.publishDate as string,
    updated: (raw.updated as string | null) ?? null,
    tags: (raw.tags as string[]) ?? [],
    author: raw.author as string,
    readingTime: (raw.readingTime as number | null) ?? null,
    image: raw.image as string,
    draft: (raw.draft as boolean) ?? false,
    locale: raw.locale as string,
  };
}

export async function fetchBlogPosts(
  locale: string,
  options: { excludeDrafts?: boolean } = {}
): Promise<StrapiPost[]> {
  const draftFilter = options.excludeDrafts !== false ? '&filters[draft][$eq]=false' : '';
  const qs = `?locale=${locale}&pagination[pageSize]=100&sort=publishDate:desc${draftFilter}&status=published`;
  const res = await strapiGet<StrapiListResponse<Record<string, unknown>>>(`/blog-posts${qs}`);
  return res.data.map(mapPost);
}

export async function fetchBlogPost(
  locale: string,
  slug: string
): Promise<StrapiPost | null> {
  const qs = `?locale=${locale}&filters[slug][$eq]=${encodeURIComponent(slug)}&status=published`;
  const res = await strapiGet<StrapiListResponse<Record<string, unknown>>>(`/blog-posts${qs}`);
  const raw = res.data[0];
  return raw ? mapPost(raw) : null;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function mapProject(raw: Record<string, unknown>): StrapiProject {
  return {
    documentId: raw.documentId as string,
    slug: raw.slug as string,
    title: raw.title as string,
    description: raw.description as string,
    body: (raw.body as string) ?? '',
    publishDate: raw.publishDate as string,
    technologies: (raw.technologies as string[]) ?? [],
    tags: (raw.tags as string[]) ?? [],
    role: (raw.role as string) ?? '',
    company: (raw.company as string) ?? '',
    status: (raw.status as string) ?? '',
    image: raw.image as string,
    imageProjectPrefix: (raw.imageProjectPrefix as string) ?? '',
    showInAbout: (raw.showInAbout as boolean) ?? true,
    locale: raw.locale as string,
  };
}

export async function fetchProjects(
  locale: string,
  options: { showInAboutOnly?: boolean } = {}
): Promise<StrapiProject[]> {
  const filter = options.showInAboutOnly ? '&filters[showInAbout][$eq]=true' : '';
  const qs = `?locale=${locale}&pagination[pageSize]=100&sort=publishDate:desc${filter}&status=published`;
  const res = await strapiGet<StrapiListResponse<Record<string, unknown>>>(`/projects${qs}`);
  return res.data.map(mapProject);
}

export async function fetchProject(
  locale: string,
  slug: string
): Promise<StrapiProject | null> {
  const qs = `?locale=${locale}&filters[slug][$eq]=${encodeURIComponent(slug)}&status=published`;
  const res = await strapiGet<StrapiListResponse<Record<string, unknown>>>(`/projects${qs}`);
  const raw = res.data[0];
  return raw ? mapProject(raw) : null;
}
