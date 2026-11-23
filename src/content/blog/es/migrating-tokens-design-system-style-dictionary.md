---
title: "Migrando 95 tokens en un rebrand: lo que Style Dictionary v4 hace bien (y cuándo Tier 2 puede esperar)"
description: "Ejecutamos la migración completa de tokens de un design system con 8 categorías de breaking changes, 43 archivos consumidores y una decisión deliberada de no hacer lo arquitecturalmente correcto — todavía."
publishDate: "2026-05-23T06:00:00.000Z"
updated: null
tags: ["TypeScript", "Design System", "Architecture", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 8
image: "tokens-migration.webp"
draft: false
---
El brief del equipo de diseño era directo: cambiar los colores. Azul primario por negro, morado secundario por amarillo, Montserrat por DM Sans e Inter. Parecía una tarea de un día — editar unos JSON, reconstruir los outputs.

Lo que encontré al abrir el paquete de tokens fue diferente: 95 tokens distribuidos en 6 categorías, 43 archivos consumidores en 3 paquetes que importaban valores primitivos directamente, y 8 categorías de breaking changes que convertían "cambiar los colores" en una migración de versión mayor con impacto en toda la plataforma.

Hay otro post en esta serie que habla sobre la evolución arquitectónica de un sistema de tokens: del modelo monobrand hacia una arquitectura multibrand con Tier 2 semántico. Ese post trata de teoría y decisiones de diseño de sistemas. Este es diferente. Este documenta qué pasa cuando ejecutas una migración de identidad visual bajo restricciones de tiempo reales, con código de producción que no puede romperse y una decisión deliberada — no por falta de criterio — de no implementar lo que sería arquitecturalmente correcto.

---

## El estado antes de la migración

El paquete de tokens tenía una estructura Tier 1 exclusivamente: primitivos sin ninguna capa semántica encima.

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

Style Dictionary v4.1.3 tomaba esos JSON y generaba 9 formatos de salida:

| Formato | Output | Consumidor principal |
|---------|--------|----------------------|
| JavaScript ES6 | `build/js/tokens.js` | React components (Emotion) |
| TypeScript declarations | `build/js/index.d.ts` | Tipado |
| Nested JSON | `build/json/tokens.json` | MUI theme |
| CSS custom properties | `build/css/_variables.css` | CSS global |
| SCSS variables | `build/scss/tokens.scss` | SCSS theming |
| Android XML | `build/android/` | Android apps |
| Kotlin Compose | `build/compose/` | Jetpack Compose |
| iOS Objective-C | `build/ios/` | iOS native |
| iOS Swift | `build/ios-swift/` | iOS Swift |

Nueve outputs a partir de una sola fuente de verdad es exactamente para lo que fue diseñado Style Dictionary. La configuración era limpia:

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

El problema no estaba en Style Dictionary. Estaba en cómo los 43 archivos consumidores usaban ese output:

```typescript
// Patrón vigente en el paquete de componentes
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

Importaciones directas de primitivos. Sin indirección semántica. El valor del token y su uso conceptual estaban fusionados en una sola línea de código.

Esto funcionaba perfectamente — hasta que llegó el rebrand.

---

## El mapa de migración: qué cambió y por qué

La migración no fue "cambiar hex codes". Fue una reclasificación de la paleta completa, más cambios estructurales en cinco categorías adicionales.

### Colores: el cambio más visible

| Categoría | Antes | Después |
|-----------|-------|---------|
| Primario | 11 shades de azul (`#F3F8FF` → `#010D25`) | Escala de negro/neutral (`#111111` base) |
| Secundario | — (`colors.extra.900` = `#6442F2` morado) | `#FFB40A` amarillo como categoría propia |
| Neutral | 6 shades (`#FFFFFF` → `#7F7F7F`) | 9 shades + white |
| Success | `success.500/900/950` | Renombrado a `Green` |
| Warning | `warning.500/900/950` | Renombrado a `Yellow` (+ `#FFB40A` como warning base) |
| Error | `error.500/900` | Renombrado a `Red` (`#EF4444`) |
| Extra/Accent | `extra.500/900` (morado) | Renombrado a `Tertiary` |
| Info | No existía | Nuevo: azul informativo |
| Alpha | No existía | Nuevo: 5 rgba overlays |

El color primario no era solo un cambio de valor hexadecimal — era pasar de una escala basada en azul a una escala basada en negro. Los 11 shades del azul (`primary.100` a `primary.950`) se reemplazaron por una escala de gris/negro donde `primary.500` = `#111111`.

Los dos nuevos grupos merecen atención porque implicaron modificar la configuración de Style Dictionary:

```json
// src/tokens/colors.json — nuevas categorías
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
// src/tokens/stroke.json — archivo nuevo
{
  "stroke": {
    "1": { "$value": "1px", "$type": "dimension" },
    "2": { "$value": "2px", "$type": "dimension" },
    "4": { "$value": "4px", "$type": "dimension" },
    "6": { "$value": "6px", "$type": "dimension" }
  }
}
```

### Las otras 7 categorías de breaking changes

| Categoría | Cambio | Impacto |
|-----------|--------|---------|
| **Tipografía** | Montserrat → DM Sans (headings/botones) + Inter (body) + JetBrains Mono (código) | Automático via tema MUI |
| **Font weights** | 8 pesos (100-900) → 4 pesos (400, 500, 600, 700). `weights.regular`: 300 → 400 | Manual: componentes usando thin/light/extra-bold |
| **Dimensions** | 22 → 11 tokens. Eliminados: 28px, 36px, 44px, 52px, 60-80px | Manual: pick nearest value |
| **Spacing** | Eliminados `spacings.9` (64px) y `spacings.10` (80px) | Manual: cap en 56px |
| **Radius** | 6 → 9 tokens. Eliminado `radius.4` (24px). Nueva escala granular: 0, 2, 4, 6, 8, 10, 12, 16, 999 | Manual: usar 16px o 999px |
| **Shadows** | 3 tokens complejos → 1 `shadow-sm` simple | Automático: tema MUI centraliza elevation |
| **Status naming** | `success/warning/error/extra` → `Green/Yellow/Red/Tertiary` | Manual: update import names |

Ocho categorías. La mayoría no eran additive — eran eliminaciones y renombramientos que rompían imports existentes por definición.

---

## Style Dictionary v4 en la práctica

Style Dictionary v4 no requirió cambios estructurales en la configuración para soportar las nuevas categorías. El sistema de `source` glob ya manejaba archivos nuevos automáticamente:

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

El archivo `stroke.json` apareció en el output de todos los formatos sin tocar la configuración. Style Dictionary resolvió referencias entre archivos (`{dimensions.1}` en `spacing.json` referenciando valores de `dimensions.json`) de la misma manera que antes.

Donde sí hubo trabajo fue en el transform de tipos rgba para los tokens Alpha. SD v4 maneja colores como strings por defecto, pero los tokens `rgba(0, 0, 0, 0.05)` necesitaban llegar a Android como `@color/alpha_black_5` en formato ARGB. El transform personalizado se resolvió con la API de transformación de SD v4:

```typescript
// config.ts (TypeScript config — SD v4 lo soporta nativamente)
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

Los 9 formatos reconstruidos tras la migración sin otros cambios de infraestructura. Eso es lo que hace bien Style Dictionary v4: el build pipeline es declarativo y los cambios en tokens fuente se propagan a todos los targets automáticamente.

---

## La decisión que NO tomamos: deferir el Tier 2

Durante la auditoría previa a esta migración, el análisis arquitectónico fue claro: la raíz del problema era la ausencia de tokens semánticos. Sin Tier 2, cada componente referenciaba primitivos directamente:

```typescript
// Lo que existe
color: ColorsPrimary500;  // #006BF8 → ahora #111111

// Lo que debería existir
color: ColorTextPrimary;  // → {colors.primary.500} → resuelta en build time
```

Con Tier 2 semántico, cambiar la identidad visual hubiera implicado modificar únicamente los tokens semánticos — no tocar ningún archivo consumidor. La arquitectura correcta estaba documentada, el ADR estaba escrito, Style Dictionary v4 la soportaba de forma nativa.

Decidí no implementarla en esta fase.

La razón no fue pereza ni ignorancia del patrón. La razón fue riesgo compuesto: en esta fase, la tarea ya incluía reemplazar todos los valores primitivos, agregar dos categorías nuevas, eliminar tokens existentes y coordinar actualizaciones en 43 archivos consumidores en 3 paquetes simultáneamente. Agregar encima una reorganización de la estructura del directorio de tokens, la creación del tier semántico, y la migración de los 43 consumidores a nuevos imports semánticos hubiera triplicado la superficie de cambio.

Si algo se rompía en producción, el espacio de búsqueda del problema habría sido enorme: ¿falló un valor primitivo? ¿una referencia semántica? ¿un import del consumidor? ¿un transform de SD?

La regla que apliqué fue simple: **no mezclar migraciones estructurales con migraciones de valor en el mismo release.** Esta fase era una migración de valor. La migración estructural hacia Tier 2 es trabajo de la siguiente fase.

El out-of-scope documentado en el PRD lo dice directamente:

> Semantic tier (Tier 2 tokens) — Deferred to Phase 1. P0 is a value swap; semantic architecture needs design alignment.

"Necesita alineación de diseño" también era real: el Tier 2 semántico requiere que el equipo de diseño defina las intenciones de uso — qué es `color.text.primary`, qué es `color.background.interactive`, cuáles son los estados — antes de que se pueda codificar. Hacer eso en paralelo con el rebrand no era factible en el calendario de 4 semanas.

Deferir Tier 2 fue la decisión correcta. El major version bump comunica el contrato roto; la guía de migración documenta los cambios. Los 43 consumidores se migran una vez con un search-and-replace acotado. En la siguiente fase, cuando el Tier 2 esté listo, la migración a imports semánticos se puede hacer incrementalmente por paquete.

---

## La migración de los 43 archivos consumidores

Con el nuevo `build/js/tokens.js` generado, el paso siguiente era actualizar cada importación que referenciaba un token renombrado o eliminado.

El inventario de consumidores era conocido desde la auditoría:

| Paquete | Patrón de import | Tokens usados |
|---------|-----------------|----------------|
| Componentes | `build/js/tokens.js` (named imports) | Colors, Spacing, Radius, Shadows |
| Table UI | `build/js/tokens.js` (named imports) | Colors, Spacing |
| MUI Theme | `build/json/tokens.json` (objeto JSON) | Colors, Typography, Radius, Shadows |

El paquete de MUI theme era el más sencillo: consumía el JSON nested completo, así que los cambios de valor se propagaban automáticamente una vez reconstruido. Las verificaciones eran que `palette.primary.main` = `#111111` y `palette.secondary.main` = `#FFB40A` en el output.

Los paquetes que usaban named imports de ES6 requerían actualización manual en cada archivo. Los casos más comunes:

```typescript
// Antes
import {
  ColorsPrimary500,   // → eliminado (azul)
  ColorsExtra900,     // → renombrado
  ShadowsSwitch,      // → eliminado
  ShadowsSwitch2,     // → eliminado
  Spacings9,          // → eliminado (64px)
  Dimensions13,       // → eliminado (52px)
  Radius4,            // → eliminado (24px)
} from '@org/design-tokens/build/js/tokens.js';

// Después
import {
  ColorsPrimary500,       // ahora = #111111 (mismo nombre, nuevo valor)
  ColorsTertiary900,      // extra → tertiary
  ShadowsSm,              // shadows consolidadas
  Spacings8,              // spacings.9 eliminado, usar spacings.8 (56px)
  Dimensions12,           // dimensions.13 eliminado, usar dimensions.12 (48px)
  Radius3,                // radius.4 eliminado, usar radius.3 (16px)
} from '@org/design-tokens/build/js/tokens.js';
```

El primer pase fue automatizable: buscar todos los imports de tokens eliminados con un grep y listar los archivos afectados. El segundo pase requirió revisión manual — decidir qué valor sustituto era correcto en cada contexto de uso no es algo que un script pueda inferir sin cometer errores semánticos.

El gotcha más común: `weights.regular` pasó de 300 a 400. En la identidad anterior, "regular" era un peso visualmente ligero (300). En la nueva tipografía con Inter como fuente body, 400 es el peso base estándar. Los componentes que usaban `TextWeightsRegular` para texto secundario o captions quedaban más "pesados" visualmente después de la migración. La solución no era técnica — era decidir si el peso previo era un error de la identidad original o un estilo intencional que debía preservarse con un token diferente.

La categoría de renombrado de estados (`success` → `Green`, `warning` → `Yellow`, `error` → `Red`) fue la migración más mecánica y también la más proclive a errores de omisión. Un script de búsqueda global por los patrones `ColorsSuccess`, `ColorsWarning`, `ColorsError`, `ColorsExtra` identificó todos los sitios; cada uno requería verificación visual de que el token sustituto correcto se usara.

---

## Lo que aprendí

**Las breaking changes son comunicación, no fallos.** El major version bump de v1.1.6 a v2.0.0 no es una formalidad — es la señal más importante que el paquete puede emitir. Cualquier consumidor externo que intente actualizar verá inmediatamente que debe leer el migration guide antes de cambiar la versión. Usar una minor o patch hubiera sido técnicamente incorrecto y operativamente peligroso.

**Style Dictionary v4 hace bien exactamente una cosa: la generación de múltiples formatos desde una fuente.** No resuelve el problema arquitectónico de cómo los consumidores usan los tokens. Los 9 outputs se regeneran perfectamente con un solo `npx nx build design-tokens`. El problema de los 43 archivos era un problema de diseño de la API del paquete — primitivos expuestos directamente — y eso no lo arregla ninguna herramienta de build.

**El control de scope en migraciones de tokens no es opcional.** Cuando la superficie de cambio incluye múltiples categorías simultáneas, la disciplina de no agregar trabajo estructural a un PR de cambio de valor es lo que permite diagnosticar problemas después. La arquitectura correcta (Tier 2 semántico) existe, está documentada, y se implementará. Pero en un momento diferente, con un scope diferente.

**La auditoría previa fue la inversión correcta.** El inventario de los 43 consumidores, el mapa de formatos de output, la lista de tokens por categoría — todo eso era información que aceleró la ejecución. Sin la auditoría, la migración hubiera sido reactiva: descubrir consumidores a medida que rompían en CI en lugar de planificar el cambio completo desde el principio.

**Los tokens eliminados son más difíciles que los renombrados.** Un token renombrado es un error de compilación inmediato: TypeScript lo detecta en el IDE antes de que llegue a CI. Un token eliminado cuyo sustituto tiene semántica diferente (como el caso de `Dimensions13` → `Dimensions12`, de 52px a 48px) requiere validación visual — no alcanza con que el código compile.

---

## Conclusión

Migramos 95 tokens a una nueva paleta, agregamos dos categorías que no existían (Alpha y Stroke), eliminamos 14 tokens a través de cinco categorías, renombramos los grupos de estados, y actualizamos los 43 archivos consumidores en 3 paquetes. Todo empaquetado como v2.0.0 con un major version bump que comunica el contrato roto.

Style Dictionary v4 generó los 9 formatos de output a partir de la misma configuración base. Esa parte funcionó exactamente como debía.

La decisión más importante no fue técnica: fue decidir qué no hacer. El Tier 2 semántico hubiera sido lo arquitecturalmente correcto. No era lo que la restricción de tiempo y el nivel de riesgo aceptable permitían en esta fase. Documentar esa decisión en el PRD — "P0 es un value swap; la arquitectura semántica espera" — fue tan importante como el código.

El siguiente post de la serie documenta la otra cara del rebrand: cómo consolidamos 175 assets dispersos en 4 repositorios a una arquitectura CDN con versionado de marca, eliminamos peso del bundle del frontend, y construimos el pipeline de CI/CD que hace que futuros brand swaps no requieran redeploys de aplicaciones.

