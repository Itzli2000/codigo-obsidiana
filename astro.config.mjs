// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon({
    iconDir: "src/assets/icons",
  }), react(), mdx(), sitemap()],
  output: "static",
  trailingSlash: "never",
  site: "https://www.codigo-obsidiana.dev",
});