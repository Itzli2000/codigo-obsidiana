---
title: "From MDX Files to a Headless CMS: Migrating an Astro Site to Strapi"
description: "How I moved blog and project content from local MDX files to Strapi 5, keeping bilingual support and adding auto-rebuild on publish."
publishDate: "2026-03-26T06:00:00.000Z"
updated: "2026-03-26T06:00:00.000Z"
tags: ["astro", "strapi", "cms", "headless"]
author: "Ariel Molina"
readingTime: 5
image: "cover.webp"
draft: false
---
# From MDX Files to a Headless CMS: Migrating an Astro Site to Strapi

When I built this site, content lived as MDX files inside the repo. Publishing a new post meant writing the file, committing it, and waiting for a Vercel deploy. It worked, but it wasn't sustainable. Every time I wanted to write something, the first step was opening a code editor. That friction is enough to kill the habit.

This is a breakdown of how I migrated from local MDX content collections to Strapi 5 as a headless CMS — keeping the bilingual structure (Spanish and English), the static build, and the Vercel deploy pipeline intact.

## Why MDX Eventually Becomes a Problem

Astro's content collections are a genuinely good solution. Zod schema validation, type-safe frontmatter, co-located content — it's clean and developer-friendly. The problem isn't the technology, it's the workflow it creates.

When content and code live in the same repo, every post is a commit. That means:

- You need a development environment to publish
- Non-developer contributors are effectively locked out
- Every typo fix triggers a full deploy

For a personal site maintained by one developer it's manageable. But it doesn't scale editorially, and it doesn't feel right to couple publishing cadence to deployment infrastructure.

## Choosing Strapi

I evaluated a few options. The requirements were: native i18n support, a REST API that works well with Astro's static build model, and ideally free to host while the site is small.

Strapi 5 hit every requirement:

- Native i18n plugin with per-locale API endpoints
- REST API designed for exactly this kind of build-time fetch
- Strapi Cloud Free tier — $0, no infrastructure to manage, PostgreSQL included
- Webhook support for triggering external deploys on publish

The alternative I seriously considered was Payload CMS, which has a better TypeScript-first developer experience. But Strapi's hosted free tier made the operational overhead zero, which won.

## Modeling the Content Types

The Strapi schema mirrors the MDX frontmatter almost 1:1. Both `BlogPost` and `Project` content types have i18n enabled, meaning each entry has independent locale versions accessible via `?locale=en` or `?locale=es`.

Blog post fields: `title`, `description`, `body` (richtext), `slug`, `publishDate`, `updated`, `tags`, `author`, `readingTime`, `image`, `draft`.

Project fields: `title`, `description`, `body`, `slug`, `publishDate`, `technologies`, `tags`, `role`, `company`, `status`, `image`, `imageProjectPrefix`, `showInAbout`.

One important decision: `slug` is localized on BlogPost (each locale can have its own slug) but shared across locales on Project. Projects are identified by a single slug regardless of language.

## The Migration Script

I wrote an idempotent Node.js script that reads the existing MDX files, parses frontmatter with `gray-matter`, and creates entries in Strapi via the REST API. Idempotent means running it twice produces the same result — it checks for existing entries by slug before creating.

```bash
STRAPI_URL=https://your-project.strapiapp.com \
STRAPI_API_TOKEN=<full-access-token> \
CONTENT_PATH=/path/to/src/content \
node scripts/migrate.mjs
```

The script processes English files first (EN is Strapi's default locale), then adds the Spanish localization via `PUT /:contentType/:documentId?locale=es`. This is the Strapi 5 API for adding a localization to an existing document — not the v4 pattern of `PUT /:documentId/localizations`.

The MDX body required some cleaning before storing in Strapi. The original files had JSX import statements and `<img>` tags that referenced CDN constants. The script strips the imports, converts CDN JSX images to standard markdown image syntax, and converts JSX `<a>` tags to markdown links.

Six blog posts and four projects migrated in a single run with zero failures.

## Connecting Astro to Strapi

The Astro side is a typed client in `src/lib/strapi.ts` with four functions:

```typescript
fetchBlogPosts(locale, options)
fetchBlogPost(locale, slug)
fetchProjects(locale, options)
fetchProject(locale, slug)
```

Each function hits the Strapi REST API with a read-only token at build time. The data is typed with interfaces that match the Strapi schema exactly.

One detail that cost me time: Strapi 5 requires `?status=published` in the query string to filter published entries. Without it, the API returns both drafts and published entries. In a public site that's a problem — draft content would appear in production builds.

Another detail worth noting: by default, Strapi's REST API does not return relation or media fields. You have to explicitly request them with `&populate=fieldName`. This becomes relevant when migrating image fields from string to the media type.

## Handling Build Failures: The 503 Problem

Strapi Cloud Free puts instances to sleep after inactivity. During a Vercel build, if Strapi is cold-starting, the first request can return a 503 Service Unavailable and fail the entire build.

The fix is retry logic with progressive backoff in the HTTP client:

```typescript
async function strapiGet(path, attempt = 1) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) {
    if (res.status >= 500 && attempt < 4) {
      await new Promise(r => setTimeout(r, attempt * 2000));
      return strapiGet(path, attempt + 1);
    }
    throw new Error(`Strapi GET ${path} → ${res.status}`);
  }
  return res.json();
}
```

Three retries with 2s, 4s, and 6s delays. In practice this is enough for the instance to wake up.

## The Webhook Loop

The rebuild automation is a two-part setup.

In Vercel: Settings → Git → Deploy Hooks → create a hook named `strapi-publish` on the `main` branch. Copy the URL.

In Strapi admin: Settings → Webhooks → new webhook → paste the Vercel URL → select Entry events.

The important part is which events to include. My initial configuration included Create and Update, which meant every draft save triggered a rebuild. On Vercel's Hobby plan there's a daily deploy limit, and burning it on draft saves is wasteful.

The correct setup for a static site: only **Publish** and **Unpublish**. This means:

- Saving a draft → no rebuild
- Publishing → rebuild triggered, site updates in ~2 minutes
- Unpublishing → rebuild triggered, entry removed from the static output

The tradeoff: updating a published post requires unpublishing and republishing to trigger a rebuild. That's an acceptable workflow for a personal blog.

## Publishing Multiple Locales

One UX detail worth knowing: clicking the Publish button in Strapi only publishes the current locale. To publish all locales at once, use the dropdown next to the Publish button → **Publish multiple locales**. This is the correct flow for bilingual content.

Alternatively, the Releases feature lets you group multiple entries (including different locales of the same entry) and publish them all with a single action. Useful when coordinating a post launch across languages.

## What's Next

The image field currently stores a filename from the Vercel Blob CDN, and components construct the full URL on the frontend. The cleaner solution is migrating `image` to Strapi's native `media` field type — so images are uploaded and managed directly from the admin. That migration is in progress and will also add a `gallery` field to both BlogPost and Project, enabling image galleries in post bodies without relying on an external CDN.
