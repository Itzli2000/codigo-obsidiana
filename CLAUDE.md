# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Start local development server at `localhost:4321` |
| `yarn build` | Build production site to `./dist/` directory |
| `yarn preview` | Preview the built site locally |
| `yarn prepare-release:patch ISSUE_ID` | Prepare patch release with automated changelog and git workflow |
| `yarn prepare-release:minor ISSUE_ID` | Prepare minor release with automated changelog and git workflow |
| `yarn prepare-release:major ISSUE_ID` | Prepare major release with automated changelog and git workflow |

**Important**: Always run `yarn build` before committing - the pre-commit hook enforces this automatically.

## Architecture Overview

This is a **bilingual Astro static site** (English/Spanish) with the following key architectural patterns:

### Content Architecture
- **Bilingual Content Collections**: `/src/content/blog/{en,es}/` and `/src/content/projects/{en,es}/`
- **I18n Structure**: Language-specific routing (`/pages/en/`, `/pages/es/`) with centralized translations in `/src/i18n/languages/`
- **Content Types**: Blog posts and projects use MDX with Zod schema validation

### Component Organization
- **Feature-based Components**: Organized by purpose (`/components/home/`, `/components/about/`, `/components/Navigation/`)
- **Framework Split**: Astro components for static content, React components in `/components/react/` for interactivity
- **3D Components**: Three.js/React Three Fiber components for avatar and 3D visualizations

### Design System Integration
- **Custom Tokens**: Uses `@codigo-obsidiana/design-tokens` package (private GitHub registry)
- **Theme System**: DaisyUI themes (`obsidiana-light`, `obsidiana-dark`) with CSS custom properties
- **Brand Colors**: Obsidian orange `#FF8357`, cool blues `#4CA5FF`/`#5FBCFF`, dark bases `#0f1923`/`#2c3844`
- **Typography**: Playfair Display (headlines), Inter (body)

### Technical Stack
- **Astro 5.8.0**: Static site generator with React integration
- **Tailwind CSS 4**: Utility-first styling with DaisyUI components
- **React 19**: Interactive components with selective hydration
- **Three.js 0.176.0**: 3D graphics and animations
- **TypeScript**: Strict configuration throughout

## Development Patterns

### Adding Content
- Blog posts: Create MDX files in `/src/content/blog/{lang}/`
- Projects: Create MDX files in `/src/content/projects/{lang}/`
- Always include both English and Spanish versions
- Use frontmatter schema defined in `/src/content.config.ts`

### Component Development
- Follow existing component structure and naming conventions
- Use Astro components for static content, React for interactivity
- Leverage existing design tokens and theme system
- Components requiring 3D should use React Three Fiber patterns from existing avatar components

### Internationalization
- Add translations to `/src/i18n/languages/{lang}.json`
- Use the existing i18n utilities from `/src/i18n/`
- Follow language-specific routing patterns in `/pages/`

### Release Management
- Use automated release scripts instead of manual version bumping
- Scripts handle changelog generation, git branching, and version updates
- Always provide an ISSUE_ID when preparing releases

## Package Management
- Uses Yarn with private GitHub registry for `@codigo-obsidiana` scope
- GitHub token required for accessing private design tokens package
- Dependencies are locked to specific versions for stability