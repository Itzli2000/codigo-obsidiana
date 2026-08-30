---
title: "Migrating 95 tokens in a rebrand: what Style Dictionary v4 does well (and when Tier 2 can wait)"
description: "We executed the full token migration of a design system with 8 categories of breaking changes, 43 consuming files, and a deliberate decision not to do the architecturally correct thing — yet."
publishDate: "2026-05-23T06:00:00.000Z"
updated: null
tags: ["TypeScript", "Design System", "Architecture", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 8
image: "tokens-migration.webp"
draft: false
---
The design team's brief was direct: change the colors. Primary blue to black, secondary purple to yellow, Montserrat to DM Sans and Inter. It looked like a one-day task — edit a few JSON files, rebuild the outputs.

What I found when I opened the tokens package was different: 95 tokens distributed across 6 categories, 43 consuming files across 3 packages that imported primitive values directly, and 8 categories of breaking changes that turned "change the colors" into a major version migration with platform-wide impact.

There's another post in this series about the architectural evolution of a token system: from the monobrand model to a multibrand architecture with semantic Tier 2. That post is about theory and system design decisions. This one is different. This one documents what happens when you execute a visual identity migration under real time constraints, with production code that can't break and a deliberate decision — not from lack of judgment — not to implement what would be architecturally correct.

---

## The state before the migration

The tokens package had a Tier 1 structure exclusively: primitives with no semantic layer on top.

```
design-tokens/src/tokens/
├── colors.json      # 29 tokens
├── dimensions.json  # 22 tokens
├── spacing.json     # 11 tokens
├── radius.json      # 6 tokens
├── shadows.json     # 3 tokens
└── text.json        # 24 tokens
                     # Total: 95 tokens
```

Style Dictionary v4.1.3 took those JSONs and generated 9 output formats:

| Format | Output | Main consumer |
|---------|--------|----------------------|
| JavaScript ES6 | `build/js/tokens.js` | React components (Emotion) |
| TypeScript declarations | `build/js/index.d.ts` | Typing |
| Nested JSON | `build/json/tokens.json` | MUI theme |
| CSS custom properties | `build/css/_variables.css` | Global CSS |
| SCSS variables | `build/scss/tokens.scss` | SCSS theming |
| Android XML | `build/android/` | Android apps |
| Kotlin Compose | `build/compose/` | Jetpack Compose |
| iOS Objective-C | `build/ios/` | iOS native |
| iOS Swift | `build/ios-swift/` | iOS Swift |

Nine outputs from a single source of truth is exactly what Style Dictionary was designed for. The configuration was clean:

```json
{
  "source": ["src/tokens/**/*.json"],
  "platforms": {
    "js": {
      "transformGroup": "js",
      "buildPath": "build/js/",
      "files": [
        { "destination": "tokens.js", "format": "javascript/es6" },
        { "destination": "index.d.ts", "format": "typescript/es6-declarations" }
      ]
    },
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        { "destination": "_variables.css", "format": "css/variables" }
      ]
    }
  }
}
```

The problem wasn't in Style Dictionary. It was in how the 43 consuming files used that output:

```typescript
// Pattern used in the components package
import {
  ColorsPrimary500,
  ColorsNeutral150,
  ColorsError900,
  Spacings3,
  Radius2
} from '@org/design-tokens/build/js/tokens.js';

const Button = styled('button')`
  background-color: ${ColorsPrimary500};  // literal: #006BF8
  border-radius: ${Radius2};              // literal: 12px
  padding: ${Spacings3};                  // literal: 16px
`;
```

Direct primitive imports. No semantic indirection. The token's value and its conceptual usage were fused into a single line of code.

This worked perfectly — until the rebrand arrived.

---

## The migration map: what changed and why

The migration wasn't "change hex codes." It was a full reclassification of the palette, plus structural changes in five additional categories.

### Colors: the most visible change

| Category | Before | After |
|-----------|-------|---------|
| Primary | 11 blue shades (`#F3F8FF` → `#010D25`) | Black/neutral scale (`#111111` base) |
| Secondary | — (`colors.extra.900` = `#6442F2` purple) | `#FFB40A` yellow as its own category |
| Neutral | 6 shades (`#FFFFFF` → `#7F7F7F`) | 9 shades + white |
| Success | `success.500/900/950` | Renamed to `Green` |
| Warning | `warning.500/900/950` | Renamed to `Yellow` (+ `#FFB40A` as warning base) |
| Error | `error.500/900` | Renamed to `Red` (`#EF4444`) |
| Extra/Accent | `extra.500/900` (purple) | Renamed to `Tertiary` |
| Info | Did not exist | New: informational blue |
| Alpha | Did not exist | New: 5 rgba overlays |

The primary color wasn't just a hex value change — it was moving from a blue-based scale to a black-based scale. The 11 blue shades (`primary.100` to `primary.950`) were replaced by a gray/black scale where `primary.500` = `#111111`.

The two new groups deserve attention because they required modifying the Style Dictionary configuration:

```json
// src/tokens/colors.json — new categories
{
  "colors": {
    "alpha": {
      "black-5":  { "$value": "rgba(0, 0, 0, 0.05)", "$type": "color" },
      "black-10": { "$value": "rgba(0, 0, 0, 0.10)", "$type": "color" },
      "black-20": { "$value": "rgba(0, 0, 0, 0.20)", "$type": "color" },
      "black-40": { "$value": "rgba(0, 0, 0, 0.40)", "$type": "color" },
      "black-60": { "$value": "rgba(0, 0, 0, 0.60)", "$type": "color" }
    }
  }
}
```

```json
// src/tokens/stroke.json — new file
{
  "stroke": {
    "1": { "$value": "1px", "$type": "dimension" },
    "2": { "$value": "2px", "$type": "dimension" },
    "4": { "$value": "4px", "$type": "dimension" },
    "6": { "$value": "6px", "$type": "dimension" }
  }
}
```

### The other 7 breaking-change categories

| Category | Change | Impact |
|-----------|--------|---------|
| **Typography** | Montserrat → DM Sans (headings/buttons) + Inter (body) + JetBrains Mono (code) | Automatic via MUI theme |
| **Font weights** | 8 weights (100-900) → 4 weights (400, 500, 600, 700). `weights.regular`: 300 → 400 | Manual: components using thin/light/extra-bold |
| **Dimensions** | 22 → 11 tokens. Removed: 28px, 36px, 44px, 52px, 60-80px | Manual: pick nearest value |
| **Spacing** | Removed `spacings.9` (64px) and `spacings.10` (80px) | Manual: cap at 56px |
| **Radius** | 6 → 9 tokens. Removed `radius.4` (24px). New granular scale: 0, 2, 4, 6, 8, 10, 12, 16, 999 | Manual: use 16px or 999px |
| **Shadows** | 3 complex tokens → 1 simple `shadow-sm` | Automatic: MUI theme centralizes elevation |
| **Status naming** | `success/warning/error/extra` → `Green/Yellow/Red/Tertiary` | Manual: update import names |

Eight categories. Most weren't additive — they were removals and renames that broke existing imports by definition.

---

## Style Dictionary v4 in practice

Style Dictionary v4 didn't require structural changes in the configuration to support the new categories. The `source` glob system already handled new files automatically:

```json
{
  "source": ["src/tokens/**/*.json"],
  "platforms": {
    "js": {
      "transformGroup": "js",
      "buildPath": "build/js/",
      "files": [
        { "destination": "tokens.js", "format": "javascript/es6" },
        { "destination": "index.d.ts", "format": "typescript/es6-declarations" }
      ]
    },
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "_variables.css",
          "format": "css/variables",
          "options": { "outputReferences": true }
        }
      ]
    },
    "json": {
      "transformGroup": "js",
      "buildPath": "build/json/",
      "files": [
        { "destination": "tokens.json", "format": "json/nested" }
      ]
    },
    "android": {
      "transformGroup": "android",
      "buildPath": "build/android/",
      "files": [
        {
          "destination": "tokens.xml",
          "format": "android/colors",
          "filter": { "attributes": { "category": "color" } }
        }
      ]
    },
    "ios-swift": {
      "transformGroup": "ios-swift",
      "buildPath": "build/ios-swift/",
      "files": [
        { "destination": "StyleDictionary.swift", "format": "ios-swift/class.swift" }
      ]
    }
  }
}
```

The `stroke.json` file showed up in the output of every format without touching the configuration. Style Dictionary resolved cross-file references (`{dimensions.1}` in `spacing.json` referencing values from `dimensions.json`) the same way as before.

Where there was work was in the rgba type transform for the Alpha tokens. SD v4 handles colors as strings by default, but `rgba(0, 0, 0, 0.05)` tokens needed to arrive on Android as `@color/alpha_black_5` in ARGB format. The custom transform was resolved with SD v4's transformation API:

```typescript
// config.ts (TypeScript config — natively supported by SD v4)
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'color/android-rgba',
  type: 'value',
  filter: (token) =>
    token.$type === 'color' && token.$value.startsWith('rgba'),
  transform: (token) => {
    const match = token.$value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (!match) return token.$value;
    const [, r, g, b, a] = match;
    const alpha = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0');
    const toHex = (n: string) => parseInt(n).toString(16).padStart(2, '0');
    return `#${alpha}${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  },
});
```

The 9 formats rebuilt after the migration with no other infrastructure changes. That's what Style Dictionary v4 does well: the build pipeline is declarative and changes in source tokens propagate to every target automatically.

---

## The decision we did NOT make: deferring Tier 2

During the audit prior to this migration, the architectural analysis was clear: the root of the problem was the absence of semantic tokens. Without Tier 2, every component referenced primitives directly:

```typescript
// What exists
color: ColorsPrimary500;  // #006BF8 → now #111111

// What should exist
color: ColorTextPrimary;  // → {colors.primary.500} → resolved at build time
```

With semantic Tier 2, changing the visual identity would have meant modifying only the semantic tokens — not touching any consuming file. The correct architecture was documented, the ADR was written, Style Dictionary v4 supported it natively.

I decided not to implement it in this phase.

The reason wasn't laziness or ignorance of the pattern. The reason was compound risk: in this phase, the task already included replacing all primitive values, adding two new categories, removing existing tokens, and coordinating updates across 43 consuming files in 3 packages simultaneously. Adding on top a reorganization of the token directory structure, the creation of the semantic tier, and the migration of 43 consumers to new semantic imports would have tripled the surface of change.

If something broke in production, the problem search space would have been enormous: did a primitive value fail? A semantic reference? A consumer import? A SD transform?

The rule I applied was simple: **don't mix structural migrations with value migrations in the same release.** This phase was a value migration. The structural migration to Tier 2 is work for the next phase.

The out-of-scope documented in the PRD says it directly:

> Semantic tier (Tier 2 tokens) — Deferred to Phase 1. P0 is a value swap; semantic architecture needs design alignment.

"Needs design alignment" was also real: semantic Tier 2 requires the design team to define usage intents — what is `color.text.primary`, what is `color.background.interactive`, what are the states — before it can be coded. Doing that in parallel with the rebrand wasn't feasible inside the 4-week schedule.

Deferring Tier 2 was the right call. The major version bump communicates the broken contract; the migration guide documents the changes. The 43 consumers get migrated once with a bounded search-and-replace. In the next phase, when Tier 2 is ready, the migration to semantic imports can be done incrementally per package.

---

## Migrating the 43 consuming files

With the new `build/js/tokens.js` generated, the next step was updating every import that referenced a renamed or removed token.

The consumer inventory was known from the audit:

| Package | Import pattern | Tokens used |
|---------|-----------------|----------------|
| Components | `build/js/tokens.js` (named imports) | Colors, Spacing, Radius, Shadows |
| Table UI | `build/js/tokens.js` (named imports) | Colors, Spacing |
| MUI Theme | `build/json/tokens.json` (JSON object) | Colors, Typography, Radius, Shadows |

The MUI theme package was the simplest: it consumed the full nested JSON, so value changes propagated automatically once rebuilt. The checks were that `palette.primary.main` = `#111111` and `palette.secondary.main` = `#FFB40A` in the output.

Packages using ES6 named imports required manual updates in each file. The most common cases:

```typescript
// Before
import {
  ColorsPrimary500,   // → removed (blue)
  ColorsExtra900,     // → renamed
  ShadowsSwitch,      // → removed
  ShadowsSwitch2,     // → removed
  Spacings9,          // → removed (64px)
  Dimensions13,       // → removed (52px)
  Radius4,            // → removed (24px)
} from '@org/design-tokens/build/js/tokens.js';

// After
import {
  ColorsPrimary500,       // now = #111111 (same name, new value)
  ColorsTertiary900,      // extra → tertiary
  ShadowsSm,              // consolidated shadows
  Spacings8,              // spacings.9 removed, use spacings.8 (56px)
  Dimensions12,           // dimensions.13 removed, use dimensions.12 (48px)
  Radius3,                // radius.4 removed, use radius.3 (16px)
} from '@org/design-tokens/build/js/tokens.js';
```

The first pass was automatable: grep all imports of removed tokens and list the affected files. The second pass required manual review — deciding which substitute value was correct in each usage context isn't something a script can infer without making semantic mistakes.

The most common gotcha: `weights.regular` went from 300 to 400. In the old identity, "regular" was a visually light weight (300). In the new typography with Inter as the body font, 400 is the standard base weight. Components using `TextWeightsRegular` for secondary text or captions ended up visually "heavier" after the migration. The fix wasn't technical — it was deciding whether the previous weight was a mistake in the original identity or an intentional style that needed to be preserved with a different token.

The status renaming category (`success` → `Green`, `warning` → `Yellow`, `error` → `Red`) was the most mechanical migration and also the most prone to omission errors. A global search script for the patterns `ColorsSuccess`, `ColorsWarning`, `ColorsError`, `ColorsExtra` identified every site; each one required visual verification that the correct substitute token was used.

---

## What I learned

**Breaking changes are communication, not failures.** The major version bump from v1.1.6 to v2.0.0 isn't a formality — it's the most important signal the package can emit. Any external consumer trying to update will immediately see they need to read the migration guide before changing the version. Using a minor or patch would have been technically incorrect and operationally dangerous.

**Style Dictionary v4 does exactly one thing well: generating multiple formats from a single source.** It does not solve the architectural problem of how consumers use the tokens. The 9 outputs regenerate perfectly with a single `npx nx build design-tokens`. The problem of the 43 files was a problem of the package's API design — primitives exposed directly — and no build tool fixes that.

**Scope control in token migrations isn't optional.** When the change surface includes multiple simultaneous categories, the discipline of not adding structural work to a value-change PR is what lets you diagnose problems afterward. The correct architecture (semantic Tier 2) exists, is documented, and will be implemented. But at a different moment, with a different scope.

**The prior audit was the right investment.** The inventory of the 43 consumers, the map of output formats, the list of tokens per category — all of that was information that accelerated execution. Without the audit, the migration would have been reactive: discovering consumers as they broke in CI instead of planning the full change from the start.

**Removed tokens are harder than renamed ones.** A renamed token is an immediate compile error: TypeScript catches it in the IDE before it reaches CI. A removed token whose substitute has different semantics (like `Dimensions13` → `Dimensions12`, from 52px to 48px) requires visual validation — the code compiling isn't enough.

---

## Conclusion

We migrated 95 tokens to a new palette, added two categories that didn't exist (Alpha and Stroke), removed 14 tokens across five categories, renamed the status groups, and updated the 43 consuming files across 3 packages. All packaged as v2.0.0 with a major version bump that communicates the broken contract.

Style Dictionary v4 generated the 9 output formats from the same base configuration. That part worked exactly as it should.

The most important decision wasn't technical: it was deciding what not to do. Semantic Tier 2 would have been the architecturally correct thing. It wasn't what the time constraint and the acceptable risk level allowed in this phase. Documenting that decision in the PRD — "P0 is a value swap; semantic architecture waits" — was as important as the code.

The next post in the series documents the other side of the rebrand: how we consolidated 175 assets spread across 4 repositories into a CDN architecture with brand versioning, removed 4 MB from the frontend bundle, and built the CI/CD pipeline that makes future brand swaps not require application redeploys.

