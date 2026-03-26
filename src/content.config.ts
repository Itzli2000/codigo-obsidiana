// Content collections have been migrated to Strapi CMS.
// Blog posts and projects are now fetched via src/lib/strapi.ts.
// These empty collection definitions suppress Astro's auto-generation warning
// for the legacy MDX files kept as backup in src/content/.
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const legacySchema = z.object({}).passthrough();

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog/en" }),
    schema: legacySchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects/en" }),
    schema: legacySchema,
  }),
};
