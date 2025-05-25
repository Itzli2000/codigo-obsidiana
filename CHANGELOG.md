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

