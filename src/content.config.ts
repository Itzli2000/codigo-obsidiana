import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const idFromPath = ({ entry }: { entry: string }) => entry.replace(/\.md$/, "");

const blog = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/blog", generateId: idFromPath }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    updated: z.string().nullable().default(null),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    readingTime: z.number().nullable().default(null),
    image: z.string(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/projects", generateId: idFromPath }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    technologies: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    role: z.string().default(""),
    company: z.string().default(""),
    status: z.string().default(""),
    image: z.string(),
    imageProjectPrefix: z.string().default(""),
    showInAbout: z.boolean().default(true),
  }),
});

export const collections = { blog, projects };
