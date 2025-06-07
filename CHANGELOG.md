### 2.6.0 (2025-06-07)

##### Documentation Changes

*  update README to include DeepWiki badge (1f0b454e)

### 2.5.0 (2025-06-07)

##### New Features

* **blog:**  add design tokens evolution article in English and Spanish (ee8b9600)

##### Bug Fixes

* **blog:**  update image paths for design tokens evolution article (6f2c1f61)

##### Refactors

* **i18n:**  update contact section descriptions for clarity (7362645d)

### 2.4.0 (2025-06-02)

##### Chores

* **Education:**  remove EducationCard component and its references (9ed5f49f)

##### New Features

* **Contact:**
  *  enhance contact form with translations and new section (8271a48f)
  *  implement contact form with 3D avatar interaction (52fa4c2a)

##### Bug Fixes

* **blog:**  update repository links for design tokens (89c87055)

##### Refactors

* **Navigation:**
  *  improve type safety and code consistency (113c3abf)
  *  enhance section navigation logic and smooth scrolling (c5d83365)
* **i18n:**  replace hardcoded language types with Lang type (ffdfc163)

### 2.3.0 (2025-06-01)

##### Chores

* **vscode:**  update cSpell dictionary with additional words (82ed03e3)
* **Design Tokens:**  update design tokens and add yarn configuration (c8edd072)

##### New Features

* **ConnectSection:**  add client-side translations for email copy notifications (b94a9b9b)

##### Bug Fixes

* **Navigation:**  correct logo link format for home navigation (411d86c5)

### 2.2.0 (2025-05-31)

##### Refactors

* **Projects:**
  *  update link formatting for project entries (57f8495f)
  *  enhance project card structure and add icon (dfa8d5cc)
* **blog:**  improve blog index layout and formatting (a348583b)

### 2.1.0 (2025-05-31)

##### New Features

* **sitemap:**  integrate sitemap generation and update configuration (46ccec68)

## 2.0.0 (2025-05-31)

##### Chores

* **content:**  remove outdated image assets and update project references (90d6fcac)
* **blog:**  remove outdated image assets and update references (3fa0f200)
* **npm:**  add .npmrc for GitHub npm registry configuration (0b34238e)
* **vscode:**  add custom words to cSpell configuration (bc40a9aa)
* **yarnrc:**  add yarn configuration for GitHub npm registry (2f4e2709)
* **yarn.lock:**  update dependencies to latest versions (4701506c)

##### New Features

* **about:**  update resume link and enhance email copy functionality (4e79a14a)
* **content:**
  *  integrate MDX support and update content loaders (8a46084f)
  *  add schemas for blog and project posts frontmatter (bac6ca57)
* **blog:**  add design tokens library documentation in English and Spanish (6055dbc7)

##### Bug Fixes

* **home:**  correct image source path for featured posts (acf043f4)

##### Refactors

* **global.css:**
  *  integrate design tokens and update color variables (1e651b98)
  *  update theme transition styles for improved accessibility (315dd8a3)
* **ThemeSwitcher:**  update theme handling and improve system theme detection (eedb1d43)
* **About:**  standardize typography and layout across components (19bbf226)
* **ExperienceCard:**  update text size and enhance experience descriptions (dcb2fcff)

#### 1.0.2 (2025-05-26)

##### New Features

* **ThemeSwitcher:**  add theme switcher visibility based on system dark mode (545f5329)

##### Refactors

* **Navigation:**  streamline language handling across navigation components (c6451ce8)

#### 1.0.1 (2025-05-25)

##### Bug Fixes

* **Avatar:**  ensure greeting animation plays correctly with group reference (9f0de38d)

##### Refactors

* **About:**  standardize text sizes across education, experience, profile, and summary cards (9a0f77bd)

## 1.0.0 (2025-05-25)

##### Chores

*  prepare minor release for STRUCTURE (c0c97164)
*  prepare minor release for COLLECTIONS (bbd42990)
* **rules:**  remove outdated git conventional commit messages documentation (3b538ddb)
* **Project:**
  *  add project purpose documentation for Código Obsidiana (e4576017)
  *  integrate Tailwind CSS and update project structure guidelines (707b3ce8)
* **Dependencies:**  add husky for pre-commit hooks and mark package as private (d45c5777)
* **Release:**  add release preparation scripts and update package.json (0b27528b)

##### New Features

* **Blog:**
  *  add back navigation links to blog and project pages (8adad5a4)
  *  enhance blog layout with subtitle and dynamic content (7deb4509)
  *  add new blog post on frontend architecture and update featured posts section (915dde3e)
* **README:**
  *  update project structure and technology versions (9c0a86bc)
  *  update project description and structure for Código Obsidiana (fbc3e892)
* **Avatar:**  integrate 3D avatar model and canvas component (8e1d91e4)
* **Home:**  add new sections for hero, featured posts, about preview, and connect (53761f39)
* **Projects:**
  *  add Batch QR Generator project with bilingual support (19d7f0bd)
  *  add new bilingual project entries and enhance project display (c756af4f)
  *  add bilingual project showcase and update content configuration (68f08733)
* **Layout:**  replace Layout component with MainLayout for improved structure (e974c7b0)
* **Assets:**
  *  add Open Graph image for improved social sharing (1ccf43a3)
  *  update favicon SVG and link in layout for improved branding (49bbcfd6)
  *  integrate astro-icon for logo and replace deprecated SVG, add new logo asset (152cd0f1)
* **Navigation:**
  *  refactor navigation structure and add blog links (63a82e1e)
  *  implement responsive navigation component with language support and loading spinner (05290a3f)
* **About:**
  *  update ProfileCard and localization for enhanced personal branding and SEO (13af0800)
  *  add SectionNav component for improved navigation and integrate with ProfileCard (5f0b3609)
  *  enhance about section with new SummaryCard component and update existing cards for improved layout and styling (8df8046f)
  *  implement language switcher component and integrate with navigation (c8b60799)
  *  add Profile, Experience, Skills, and Education cards for about page (fcaa096b)
* **Content:**  implement blog collections and add demo posts in English and Spanish (965c364f)
* **Theme:**  add ThemeSwitcher component and integrate with navigation for theme toggling (10b43f6c)
* **SEO:**  add color-scheme meta tag for dark mode support (a8b3aa39)
* **i18n:**
  *  enhance language files with meta descriptions and footer rights (0aa1c700)
  *  implement multilingual support with language detection and translations (9ad191ab)

##### Bug Fixes

* **Projects:**  update image paths for project previews (de8a944c)
* **Navigation:**  update logo color to use primary light variable (4460b1b3)

##### Refactors

* **Home:**  simplify language handling in sections (062f5361)
* **Styles:**  remove inline styles for improved maintainability (c7aadeb4)
* **About:**
  *  streamline section navigation and enhance localization (bcfa911e)
  *  remove SkillsCard component and update localization (879990c4)
  *  update icon dependencies and improve ProfileCard layout (8fc0082d)
  *  introduce SectionTitle component for consistent headings (8c56a8d0)
  *  standardize heading sizes across About section components (b1125ac9)
  *  standardize heading styles and improve layout consistency (a650bfe0)
* **Navigation:**
  *  improve navigation styles and layout consistency (785c301b)
  *  update color variables for improved theme consistency (4042c149)
  *  simplify styles and adjust layout padding for consistency (3ea7a708)
  *  update ThemeSwitcher import path and adjust layout padding (05d9e141)
* **ThemeSwitcher:**  optimize theme handling logic and improve type safety (b203f690)
* **Rules:**  update content guidelines and structure for Astro components and branding (1839f9d6)

### 0.2.0 (2025-05-25)

##### Chores

*  prepare minor release for COLLECTIONS (bbd42990)
* **rules:**  remove outdated git conventional commit messages documentation (3b538ddb)
* **Project:**
  *  add project purpose documentation for Código Obsidiana (e4576017)
  *  integrate Tailwind CSS and update project structure guidelines (707b3ce8)
* **Dependencies:**  add husky for pre-commit hooks and mark package as private (d45c5777)
* **Release:**  add release preparation scripts and update package.json (0b27528b)

##### New Features

* **Home:**  add new sections for hero, featured posts, about preview, and connect (53761f39)
* **Projects:**
  *  add Batch QR Generator project with bilingual support (19d7f0bd)
  *  add new bilingual project entries and enhance project display (c756af4f)
  *  add bilingual project showcase and update content configuration (68f08733)
* **Layout:**  replace Layout component with MainLayout for improved structure (e974c7b0)
* **README:**  update project description and structure for Código Obsidiana (fbc3e892)
* **Assets:**
  *  add Open Graph image for improved social sharing (1ccf43a3)
  *  update favicon SVG and link in layout for improved branding (49bbcfd6)
  *  integrate astro-icon for logo and replace deprecated SVG, add new logo asset (152cd0f1)
* **Navigation:**
  *  refactor navigation structure and add blog links (63a82e1e)
  *  implement responsive navigation component with language support and loading spinner (05290a3f)
* **About:**
  *  update ProfileCard and localization for enhanced personal branding and SEO (13af0800)
  *  add SectionNav component for improved navigation and integrate with ProfileCard (5f0b3609)
  *  enhance about section with new SummaryCard component and update existing cards for improved layout and styling (8df8046f)
  *  implement language switcher component and integrate with navigation (c8b60799)
  *  add Profile, Experience, Skills, and Education cards for about page (fcaa096b)
* **Content:**  implement blog collections and add demo posts in English and Spanish (965c364f)
* **Theme:**  add ThemeSwitcher component and integrate with navigation for theme toggling (10b43f6c)
* **SEO:**  add color-scheme meta tag for dark mode support (a8b3aa39)
* **i18n:**
  *  enhance language files with meta descriptions and footer rights (0aa1c700)
  *  implement multilingual support with language detection and translations (9ad191ab)

##### Bug Fixes

* **Navigation:**  update logo color to use primary light variable (4460b1b3)

##### Refactors

* **Styles:**  remove inline styles for improved maintainability (c7aadeb4)
* **About:**
  *  streamline section navigation and enhance localization (bcfa911e)
  *  remove SkillsCard component and update localization (879990c4)
  *  update icon dependencies and improve ProfileCard layout (8fc0082d)
  *  introduce SectionTitle component for consistent headings (8c56a8d0)
  *  standardize heading sizes across About section components (b1125ac9)
  *  standardize heading styles and improve layout consistency (a650bfe0)
* **Navigation:**
  *  improve navigation styles and layout consistency (785c301b)
  *  update color variables for improved theme consistency (4042c149)
  *  simplify styles and adjust layout padding for consistency (3ea7a708)
  *  update ThemeSwitcher import path and adjust layout padding (05d9e141)
* **ThemeSwitcher:**  optimize theme handling logic and improve type safety (b203f690)
* **Rules:**  update content guidelines and structure for Astro components and branding (1839f9d6)

### 0.1.0 (2025-05-24)

##### Chores

* **rules:**  remove outdated git conventional commit messages documentation (3b538ddb)
* **Project:**
  *  add project purpose documentation for Código Obsidiana (e4576017)
  *  integrate Tailwind CSS and update project structure guidelines (707b3ce8)
* **Dependencies:**  add husky for pre-commit hooks and mark package as private (d45c5777)
* **Release:**  add release preparation scripts and update package.json (0b27528b)

##### New Features

* **Assets:**
  *  add Open Graph image for improved social sharing (1ccf43a3)
  *  update favicon SVG and link in layout for improved branding (49bbcfd6)
  *  integrate astro-icon for logo and replace deprecated SVG, add new logo asset (152cd0f1)
* **Navigation:**
  *  refactor navigation structure and add blog links (63a82e1e)
  *  implement responsive navigation component with language support and loading spinner (05290a3f)
* **About:**
  *  update ProfileCard and localization for enhanced personal branding and SEO (13af0800)
  *  add SectionNav component for improved navigation and integrate with ProfileCard (5f0b3609)
  *  enhance about section with new SummaryCard component and update existing cards for improved layout and styling (8df8046f)
  *  implement language switcher component and integrate with navigation (c8b60799)
  *  add Profile, Experience, Skills, and Education cards for about page (fcaa096b)
* **Content:**  implement blog collections and add demo posts in English and Spanish (965c364f)
* **Theme:**  add ThemeSwitcher component and integrate with navigation for theme toggling (10b43f6c)
* **SEO:**  add color-scheme meta tag for dark mode support (a8b3aa39)
* **i18n:**
  *  enhance language files with meta descriptions and footer rights (0aa1c700)
  *  implement multilingual support with language detection and translations (9ad191ab)

##### Bug Fixes

* **Navigation:**  update logo color to use primary light variable (4460b1b3)

##### Refactors

* **ThemeSwitcher:**  optimize theme handling logic and improve type safety (b203f690)
* **Rules:**  update content guidelines and structure for Astro components and branding (1839f9d6)
* **Navigation:**
  *  update color variables for improved theme consistency (4042c149)
  *  simplify styles and adjust layout padding for consistency (3ea7a708)
  *  update ThemeSwitcher import path and adjust layout padding (05d9e141)

