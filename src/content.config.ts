import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog/en" })
});

const blogEs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog/es" })
});

export const collections = {
  blogEn,
  blogEs,
};