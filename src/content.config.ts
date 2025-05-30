import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Schema for blog posts frontmatter
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  lang: z.enum(["en", "es"]),
  slug: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  readingTime: z.number(),
  image: z.string().url(),
});

// Schema for project posts frontmatter
const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  technologies: z.array(z.string()),
  tags: z.array(z.string()),
  role: z.string(),
  company: z.string(),
  status: z.string(),
  lang: z.enum(["en", "es"]),
  imageName: z.string(),
});

const blogEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog/en" }),
  schema: blogSchema,
});

const blogEs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog/es" }),
  schema: blogSchema,
});

const projectsEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects/en" }),
  schema: projectSchema,
});

const projectsEs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects/es" }),
  schema: projectSchema,
});

export const collections = {
  blogEn,
  blogEs,
  projectsEn,
  projectsEs,
};