# Código Obsidiana

A bilingual personal website and technical blog built with Astro, Tailwind CSS, and DaisyUI.

![Código Obsidiana](public/assets/logo.svg)

## 📝 Project Description

**Código Obsidiana** is a personal website that serves as:

- A technical blog sharing in-depth frontend development content, tutorials, and project insights
- A lightweight but elegant personal portfolio
- A fully bilingual (English & Spanish) platform for knowledge sharing

The site focuses on content related to React, 3D development, education, architecture, and frontend tooling.

## 🚀 Project Structure

Inside this project, you'll see the following directory structure:

```text
/
├── public/
│   └── assets/            # Static assets for the site
├── src/
│   ├── assets/            # Project assets processed during build
│   ├── components/        # Reusable UI components
│   │   ├── react/         # React-specific interactive components
│   │   ├── home/          # Homepage specific components
│   │   ├── about/         # About page components
│   │   ├── prose/         # Text content styling components
│   │   ├── Navigation/    # Site navigation components
│   │   ├── ThemeSwitcher/ # Theme toggle components
│   │   └── LanguageSwitcher/ # Language selection components
│   ├── constants/         # Shared constant values
│   ├── content/           # Content collections
│   │   ├── blog/          # Blog posts organized by language
│   │   │   ├── en/        # English blog content
│   │   │   └── es/        # Spanish blog content
│   │   └── projects/      # Project showcases and descriptions
│   ├── i18n/              # Internationalization configuration
│   ├── layouts/           # Page layouts and templates
│   ├── pages/             # Page components and routes
│   └── styles/            # Global styles and Tailwind configuration
└── package.json           # Project dependencies and scripts
```

## 🛠️ Technologies

- **[Astro](https://astro.build/) v5.8.0**: Core framework for building the site
- **[Tailwind CSS](https://tailwindcss.com/) v4**: Utility-first CSS framework
- **[DaisyUI](https://daisyui.com/) v5**: Component library for Tailwind CSS
- **[React](https://reactjs.org/) v19**: For interactive components
- **[Three.js](https://threejs.org/) v0.176.0**: For 3D visualizations
- **Content Collections**: For organizing and managing blog posts and other content
- **Multilingual Support**: Full English and Spanish language support

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                        | Action                                           |
| :----------------------------- | :----------------------------------------------- |
| `yarn install`                 | Installs dependencies                            |
| `yarn dev`                     | Starts local dev server at `localhost:4321`      |
| `yarn build`                   | Build your production site to `./dist/`          |
| `yarn preview`                 | Preview your build locally, before deploying     |
| `yarn astro ...`               | Run CLI commands like `astro add`, `astro check` |
| `yarn prepare-release:patch`   | Prepare a patch release                          |
| `yarn prepare-release:minor`   | Prepare a minor release                          |
| `yarn prepare-release:major`   | Prepare a major release                          |

## 🎨 Brand Identity

The visual identity of Código Obsidiana is characterized by:

- **Dark, minimal, editorial aesthetic**
- **Color palette**: 
  - Base backgrounds: `#0f1923` and `#2c3844`
  - Action elements: Cool blues (`#4CA5FF`, `#5FBCFF`)
  - Signature accent: Obsidian-orange (`#FF8357`)
- **Typography**:
  - Headlines: `Playfair Display` - elegant serif
  - Body: `Inter` - clean, technical sans-serif

## 👀 Want to Learn More?

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/docs)
