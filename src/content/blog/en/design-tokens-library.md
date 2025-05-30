---
title: "CoDesignSystem – A Scalable Design Tokens Architecture"
description: "A multi-format design tokens library powering the visual foundation of Código Obsidiana’s frontend ecosystem."
publishDate: 2025-05-29
lang: "en"
slug: "design-tokens-library"
tags:
  [
    "Style Dictionary",
    "TypeScript",
    "Nx",
    "OKLCH",
    "PNPM",
    "Jest",
    "ESLint",
    "Prettier",
  ]
author: "Ariel Molina"
readingTime: 4
image: "https://vpvt9bhoj9p6mo3d.public.blob.vercel-storage.com/design-tokens-FOOwcBPj2V40jdePcxtKnn4c0A8CGB.webp"
---

# CoDesignSystem – A Scalable Design Tokens Architecture

![CoDesignSystem – A Scalable Design Tokens Architecture](https://vpvt9bhoj9p6mo3d.public.blob.vercel-storage.com/design-tokens-FOOwcBPj2V40jdePcxtKnn4c0A8CGB.webp)

## Description

CoDesignSystem is a professional-grade design tokens library built to serve as the foundation for UI consistency across all products under the _Código Obsidiana_ ecosystem. Designed for scalability, maintainability, and precision, it provides a single source of truth for theming in web applications, component libraries, and embedded interfaces.

It outputs tokens in multiple formats (CSS variables, JavaScript objects, and TypeScript typings), and supports advanced theming with OKLCH color space. This system is ready to scale into multi-brand and multi-tenant scenarios with strong developer tooling support.

---

## Challenges

- Designing a token system flexible enough to support light/dark modes and brand variants
- Ensuring compatibility across different frameworks and tools (React, Astro, Tailwind/DaisyUI)
- Maintaining color consistency across devices using perceptually accurate values
- Generating safe, type-checked tokens for consumption in component libraries
- Automating builds, tests, and versioning in a scalable monorepo structure

---

## Solutions

- ✅ **OKLCH-based Color System**: Tokens use OKLCH instead of HSL/RGB to ensure perceptual uniformity. Semantic tokens (`primary`, `accent`, `info`, `neutral`, etc.) are structured into multiple variants (e.g., `100`, `200`, `content`) for clarity and accessibility.

- ✅ **Multi-Format Output** via **Style Dictionary**:

  - `_variables.css` for CSS custom properties
  - `index.js` as a JavaScript ES6 module
  - `index.d.ts` for full TypeScript typings

- ✅ **Testable & Type-Safe Architecture**:

  - Token definitions are automatically tested with Jest to prevent regressions
  - TypeScript typings ensure safe consumption in UI libraries and apps

- ✅ **Built with Nx + PNPM Workspaces**:
  - Organized in a modular monorepo
  - Fast incremental builds and isolated package targets
  - Git hooks via Husky for code quality control

---

## Project Structure

```bash
co-design-system/
├── packages/
│   └── libs/
│       └── design-tokens/
│           ├── dist/
│           │   ├── css/_variables.css     # CSS custom properties
│           │   ├── index.js               # JavaScript token exports
│           │   └── index.d.ts             # TypeScript definitions
│           ├── src/tokens/
│           │   ├── color.tokens.json      # Semantic color tokens
│           │   ├── design.tokens.json     # Size, radius, border, effects
│           │   ├── color.tokens.spec.ts   # Color unit tests
│           │   └── design.tokens.spec.ts  # Design unit tests
│           ├── config.json                # Style Dictionary config
│           └── README.md
```

---

## Token Taxonomy

We follow a **semantic-first token strategy** with clear categorization:

### 🎨 Colors

- Semantic tokens: <span class="badge badge-primary">primary</span>, <span class="badge badge-secondary">secondary</span>, <span class="badge badge-accent">accent</span>, <span class="badge badge-neutral">neutral</span>, <span class="badge badge-info">info</span>, <span class="badge badge-success">success</span>, <span class="badge badge-warning">warning</span>, <span class="badge badge-error">error</span>
- Variants: <span class="badge badge-outline">100</span>, <span class="badge badge-outline">200</span>, <span class="badge badge-outline">content</span> for each color to handle base, emphasis, and contrast
- Dual themes: <span class="badge badge-obsidiana-light">obsidiana-light</span> and <span class="badge badge-obsidiana-dark">obsidiana-dark</span> using CSS media queries

### 📐 Design Tokens

- `radius`: small, medium, large for border radius
- `size`: spacing and dimensions for layout
- `border`: thickness and style for UI elements
- `effects`: shadows, noise, and visual depth (future-ready for Neumorphism)

---

## Usage Scenarios

- Theming system for **multi-tenant React platforms**
- Component libraries built with **MUI**, **shadcn/ui**, or **DaisyUI**
- Design documentation tools and Storybook previews
- Theme-driven landing pages built with **Astro**
- Prototyping tools needing design token integration

---

## Competitive Advantages

| Feature              | CoDesignSystem                           | Typical Token Systems         |
| -------------------- | ---------------------------------------- | ----------------------------- |
| Color Model          | OKLCH – perceptual and accessible        | RGB / HSL – device-bound      |
| Output Formats       | CSS, JS, TS                              | Often just CSS or JS          |
| Type Safety          | ✅ Full TypeScript support               | ❌ Missing or manual typings  |
| Architecture         | Nx monorepo with testable modules        | Flat folder with no structure |
| Developer Experience | Husky, ESLint, Prettier, Jest            | Minimal tooling               |
| Future-Ready         | Multi-theme and multi-brand architecture | Single-brand only             |

---

## Results

- 💎 **Visual consistency** across all apps using a centralized source of truth
- 🧪 **Testing pipeline** catches unintended changes in design foundation
- ⚡️ **Improved DX** with autocomplete and safe token access across projects
- 🧩 **Integration-ready** with any frontend framework via multiple formats
- 🧱 **Scalable** for future white-label product expansions

---

## Visuals

![CoDesignSystem – A Scalable Design Tokens Architecture](https://vpvt9bhoj9p6mo3d.public.blob.vercel-storage.com/design-tokens-FOOwcBPj2V40jdePcxtKnn4c0A8CGB.webp)

---

## Links

- [Live docs (coming soon)](https://codigo-obsidiana.dev/design-tokens)
- [Repository](https://github.com/codigo-obsidiana/co-design-system)
