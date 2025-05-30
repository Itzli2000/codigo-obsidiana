---
title: "CoDesignSystem – Una arquitectura escalable de design tokens"
description: "Una librería de design tokens multi-formato que impulsa la base visual del ecosistema frontend de Código Obsidiana."
publishDate: 2025-05-29
lang: "es"
slug: "design-tokens-library"
tags: ["Style Dictionary", "TypeScript", "Nx", "OKLCH", "PNPM", "Jest", "ESLint", "Prettier"]
author: "Ariel Molina"
readingTime: 4
image: "design-tokens.png"
---

# CoDesignSystem – Una arquitectura escalable de design tokens

![CoDesignSystem – Una arquitectura escalable de design tokens](/assets/blog/design-tokens.png)

## Descripción

**CoDesignSystem** es una librería de design tokens de nivel profesional, creada para ser la base de la consistencia visual en todos los productos del ecosistema *Código Obsidiana*. Diseñada con escalabilidad, mantenibilidad y precisión en mente, funciona como fuente de verdad única para la gestión de temas visuales en aplicaciones web, librerías de componentes e interfaces embebidas.

Genera tokens en múltiples formatos (variables CSS, objetos JavaScript y definiciones TypeScript), y soporta un sistema avanzado de colores basado en el espacio perceptual **OKLCH**. Esta arquitectura está preparada para crecer hacia escenarios multi-marca y multi-tenant, con una experiencia de desarrollo cuidadosamente optimizada.

---

## Retos

- Diseñar un sistema de tokens flexible para soportar modos claro/oscuro y variantes de marca
- Asegurar compatibilidad con múltiples frameworks y herramientas (React, Astro, DaisyUI)
- Mantener coherencia de color entre dispositivos utilizando un modelo perceptual preciso
- Generar tokens seguros y tipados para consumo en librerías de UI
- Automatizar builds, pruebas y versionado dentro de una arquitectura de monorepo

---

## Soluciones

- ✅ **Sistema de color basado en OKLCH**: Los tokens utilizan OKLCH en lugar de HSL/RGB, lo que mejora la uniformidad perceptual. Los colores semánticos (`primary`, `accent`, `info`, `neutral`, etc.) están organizados en variantes (`100`, `200`, `content`) que cubren jerarquías y contrastes.

- ✅ **Salida multi-formato** con **Style Dictionary**:
  - `_variables.css` para propiedades personalizadas en CSS
  - `index.js` como módulo JavaScript ES6
  - `index.d.ts` con typings completos para TypeScript

- ✅ **Arquitectura testeable y tipada**:
  - Pruebas unitarias con Jest aseguran la validez de cada token
  - Definiciones `.d.ts` garantizan integración segura en componentes y apps

- ✅ **Desarrollado con Nx + PNPM Workspaces**:
  - Monorepo modular y escalable
  - Builds incrementales y targets independientes por paquete
  - Hooks automáticos con Husky para asegurar calidad de código

---

## Estructura del Proyecto

```bash
co-design-system/
├── packages/
│   └── libs/
│       └── design-tokens/
│           ├── dist/
│           │   ├── css/_variables.css     # Variables personalizadas en CSS
│           │   ├── index.js               # Exportaciones JS de tokens
│           │   └── index.d.ts             # Tipados TypeScript
│           ├── src/tokens/
│           │   ├── color.tokens.json      # Tokens semánticos de color
│           │   ├── design.tokens.json     # Spacing, radius, border, effects
│           │   ├── color.tokens.spec.ts   # Pruebas unitarias para colores
│           │   └── design.tokens.spec.ts  # Pruebas para diseño
│           ├── config.json                # Configuración Style Dictionary
│           └── README.md
```

---

## Taxonomía de Tokens

Seguimos una estrategia semántica clara con categorías bien definidas:

### 🎨 Colores
- Tokens semánticos: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`
- Variantes: `100`, `200`, `content` para cada color (base, énfasis, contraste)
- Temas duales: `obsidiana-light` y `obsidiana-dark` usando media queries

### 📐 Tokens de Diseño
- `radius`: bordes redondeados (pequeño, medio, grande)
- `size`: espaciado y dimensiones para layout
- `border`: grosor y estilo de bordes
- `effects`: sombras, ruido, profundidad (preparado para Neumorfismo)

---

## Escenarios de Uso

- Sistemas de theming para plataformas multi-tenant en React
- Librerías de componentes con **MUI**, **shadcn/ui** o **DaisyUI**
- Documentación de diseño y vistas previas en Storybook
- Sitios construidos con **Astro** y temas consistentes
- Herramientas de prototipado con integración de tokens

---

## Ventajas Competitivas

| Característica            | CoDesignSystem                             | Sistemas de tokens comunes        |
|---------------------------|---------------------------------------------|------------------------------------|
| Modelo de color           | OKLCH – perceptual y accesible              | RGB / HSL – dependiente de dispositivo |
| Formatos de salida        | CSS, JS, TS                                 | Solo CSS o JS                      |
| Tipado                    | ✅ Soporte completo para TypeScript          | ❌ Sin typings o hechos a mano     |
| Arquitectura              | Monorepo Nx testeable y modular             | Carpetas planas y desorganizadas   |
| Developer Experience      | Husky, ESLint, Prettier, Jest               | Tooling básico o nulo              |
| Preparado para el futuro  | Multi-brand y multi-tema desde el diseño    | Pensado solo para un producto      |

---

## Resultados

- 💎 **Consistencia visual** en todos los productos gracias a una fuente de verdad centralizada
- 🧪 **Pipeline de pruebas** que detecta cambios involuntarios en el diseño base
- ⚡️ **Mejor experiencia de desarrollo** con typings y autocomplete
- 🧩 **Integración sencilla** en cualquier frontend gracias a múltiples formatos
- 🧱 **Preparado para escalar** en productos white-label o marcas paralelas

---

## Visuales

![CoDesignSystem – A Scalable Design Tokens Architecture](/assets/blog/design-tokens.png)

---

## Enlaces

- [Documentación en vivo (próximamente)](https://codigo-obsidiana.dev/design-tokens)
- [Repositorio](https://github.com/codigo-obsidiana/co-design-system)