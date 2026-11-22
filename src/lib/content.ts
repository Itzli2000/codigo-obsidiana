import { getCollection, type CollectionEntry } from "astro:content";

/** A blog post from the `blog` content collection, flattened with its locale and slug. */
export interface Post {
  slug: string;
  locale: string;
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
}

/** A project from the `projects` content collection, flattened with its locale and slug. */
export interface Project {
  slug: string;
  locale: string;
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
}

function splitId(id: string): { locale: string; slug: string } {
  const [locale, ...rest] = id.split("/");
  return { locale, slug: rest.join("/") };
}

function byPublishDateDesc(
  a: { publishDate: string; slug: string },
  b: { publishDate: string; slug: string }
): number {
  const byDate = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  return byDate !== 0 ? byDate : b.slug.localeCompare(a.slug);
}

function toPost(entry: CollectionEntry<"blog">): Post {
  return { ...splitId(entry.id), ...entry.data, body: entry.body ?? "" };
}

function toProject(entry: CollectionEntry<"projects">): Project {
  return { ...splitId(entry.id), ...entry.data, body: entry.body ?? "" };
}

export async function getBlogPosts(
  locale: string,
  options: { excludeDrafts?: boolean } = {}
): Promise<Post[]> {
  const excludeDrafts = options.excludeDrafts !== false;
  const entries = await getCollection("blog");
  return entries
    .map(toPost)
    .filter((p) => p.locale === locale && (!excludeDrafts || !p.draft))
    .sort(byPublishDateDesc);
}

export async function getBlogPost(locale: string, slug: string): Promise<Post | null> {
  const posts = await getBlogPosts(locale, { excludeDrafts: false });
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getProjects(
  locale: string,
  options: { showInAboutOnly?: boolean } = {}
): Promise<Project[]> {
  const entries = await getCollection("projects");
  return entries
    .map(toProject)
    .filter((p) => p.locale === locale && (!options.showInAboutOnly || p.showInAbout))
    .sort(byPublishDateDesc);
}

export async function getProject(locale: string, slug: string): Promise<Project | null> {
  const projects = await getProjects(locale);
  return projects.find((p) => p.slug === slug) ?? null;
}
