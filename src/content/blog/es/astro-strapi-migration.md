---
title: "De archivos MDX a un CMS headless: migrando un sitio Astro a Strapi"
description: "Cómo moví el contenido de blog y proyectos de archivos MDX locales a Strapi 5, manteniendo soporte bilingüe y agregando auto-rebuild al publicar."
publishDate: "2026-03-26T06:00:00.000Z"
updated: "2026-03-26T06:00:00.000Z"
tags: ["astro", "strapi", "cms", "headless"]
author: "Ariel Molina"
readingTime: 5
image: "cover.webp"
draft: false
---
# De archivos MDX a un CMS headless: migrando un sitio Astro a Strapi

Cuando construí este sitio, el contenido vivía como archivos MDX dentro del repositorio. Publicar un nuevo post significaba escribir el archivo, hacer commit y esperar el deploy en Vercel. Funcionaba, pero no era sostenible. Cada vez que quería escribir algo, el primer paso era abrir un editor de código. Esa fricción es suficiente para matar el hábito.

Aquí explico cómo migré de las content collections locales de Astro a Strapi 5 como CMS headless, manteniendo la estructura bilingüe (español e inglés), el build estático y el pipeline de deploy en Vercel sin romper nada.

## Por qué MDX eventualmente se convierte en un problema

Las content collections de Astro son una solución genuinamente buena. Validación de esquemas con Zod, frontmatter tipado, contenido co-localizado — es limpio y amigable para desarrolladores. El problema no es la tecnología, es el flujo de trabajo que crea.

Cuando el contenido y el código viven en el mismo repositorio, cada post es un commit. Eso significa:

- Necesitas un entorno de desarrollo para publicar
- Los colaboradores no técnicos quedan efectivamente excluidos
- Cada corrección de typo dispara un deploy completo

Para un sitio personal mantenido por un solo desarrollador es manejable. Pero no escala editorialmente, y no se siente correcto acoplar el ritmo de publicación a la infraestructura de deployment.

## Por qué Strapi

Evalué algunas opciones. Los requisitos eran: soporte nativo de i18n, una API REST que funcione bien con el modelo de build estático de Astro, y de preferencia gratuito mientras el sitio es pequeño.

Strapi 5 cumplió todos los requisitos:

- Plugin i18n nativo con endpoints por locale
- API REST diseñada exactamente para este tipo de fetch en build time
- Strapi Cloud Free — $0, sin infraestructura que gestionar, PostgreSQL incluido
- Soporte de webhooks para disparar deploys externos al publicar

La alternativa que consideré seriamente fue Payload CMS, que tiene una mejor experiencia de desarrollo orientada a TypeScript. Pero el free tier hosteado de Strapi llevó el overhead operacional a cero, y eso ganó.

## Modelando los content types

El schema de Strapi espeja casi exactamente el frontmatter de MDX. Ambos content types, `BlogPost` y `Project`, tienen i18n habilitado, lo que significa que cada entrada tiene versiones independientes por locale accesibles via `?locale=en` o `?locale=es`.

Campos del blog post: `title`, `description`, `body`, `slug`, `publishDate`, `updated`, `tags`, `author`, `readingTime`, `image`, `draft`.

Campos del proyecto: `title`, `description`, `body`, `slug`, `publishDate`, `technologies`, `tags`, `role`, `company`, `status`, `image`, `imageProjectPrefix`, `showInAbout`.

Una decisión importante: `slug` está localizado en BlogPost (cada locale puede tener su propio slug) pero es compartido entre locales en Project. Los proyectos se identifican con un único slug independientemente del idioma.

## El script de migración

Escribí un script Node.js idempotente que lee los archivos MDX existentes, parsea el frontmatter con `gray-matter` y crea entradas en Strapi vía la API REST. Idempotente significa que ejecutarlo dos veces produce el mismo resultado — verifica la existencia de entradas por slug antes de crearlas.

```bash
STRAPI_URL=https://your-project.strapiapp.com \
STRAPI_API_TOKEN=<token-full-access> \
CONTENT_PATH=/ruta/a/src/content \
node scripts/migrate.mjs
```

El script procesa primero los archivos en inglés (EN es el locale por defecto de Strapi), luego agrega la localización en español vía `PUT /:contentType/:documentId?locale=es`. Este es el patrón de la API de Strapi 5 para agregar una localización a un documento existente — distinto al patrón de v4 con `PUT /:documentId/localizations`.

El body de MDX requirió limpieza antes de almacenarse en Strapi. Los archivos originales tenían sentencias `import` de JSX y etiquetas `<img>` que referenciaban constantes del CDN. El script elimina los imports, convierte las imágenes JSX del CDN a sintaxis de imagen markdown estándar y convierte las etiquetas JSX `<a>` a links markdown.

Seis blog posts y cuatro proyectos migrados en una sola ejecución sin ningún fallo.

## Conectando Astro con Strapi

El lado de Astro es un cliente tipado en `src/lib/strapi.ts` con cuatro funciones:

```typescript
fetchBlogPosts(locale, options)
fetchBlogPost(locale, slug)
fetchProjects(locale, options)
fetchProject(locale, slug)
```

Cada función llama a la API REST de Strapi con un token de solo lectura en build time. Los datos están tipados con interfaces que coinciden exactamente con el schema de Strapi.

Un detalle que me costó tiempo: Strapi 5 requiere `?status=published` en el query string para filtrar solo entradas publicadas. Sin él, la API devuelve tanto borradores como publicados. En un sitio público eso es un problema — el contenido en borrador aparecería en builds de producción.

Otro detalle importante: por defecto, la API REST de Strapi no devuelve campos de relación o media. Hay que solicitarlos explícitamente con `&populate=fieldName`. Esto se vuelve relevante al migrar los campos de imagen de tipo string al tipo media nativo.

## Manejando fallos de build: el problema del 503

Strapi Cloud Free pone las instancias a dormir después de inactividad. Durante un build de Vercel, si Strapi está arrancando en frío, la primera petición puede devolver un 503 Service Unavailable y fallar todo el build.

La solución es lógica de reintentos con backoff progresivo en el cliente HTTP:

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

Tres reintentos con esperas de 2s, 4s y 6s. En la práctica es suficiente para que la instancia despierte.

## El ciclo del webhook

La automatización del rebuild es una configuración en dos partes.

En Vercel: Settings → Git → Deploy Hooks → crea un hook llamado `strapi-publish` en la rama `main`. Copia la URL.

En el admin de Strapi: Settings → Webhooks → nuevo webhook → pega la URL de Vercel → selecciona los eventos de Entry.

La parte importante es qué eventos incluir. Mi configuración inicial incluía Create y Update, lo que significaba que cada guardado de borrador disparaba un rebuild. En el plan Hobby de Vercel hay un límite diario de deploys, y quemarlo guardando borradores es un desperdicio.

La configuración correcta para un sitio estático: solo **Publish** y **Unpublish**. Esto significa:

- Guardar un borrador → sin rebuild
- Publicar → rebuild disparado, el sitio se actualiza en ~2 minutos
- Despublicar → rebuild disparado, la entrada desaparece del output estático

El tradeoff: actualizar un post publicado requiere despublicar y volver a publicar para disparar el rebuild. Es un flujo aceptable para un blog personal.

## Publicar múltiples locales

Un detalle de UX importante: hacer click en el botón Publish en Strapi solo publica el locale actual. Para publicar todos los locales a la vez, usa el dropdown junto al botón Publish → **Publish multiple locales**. Este es el flujo correcto para contenido bilingüe.

Alternativamente, la feature de Releases permite agrupar múltiples entradas (incluyendo diferentes locales de la misma entrada) y publicarlas todas con una sola acción. Útil para coordinar el lanzamiento de un post en ambos idiomas.

## Qué sigue

El campo `image` actualmente almacena un filename del CDN Vercel Blob, y los componentes construyen la URL completa en el frontend. La solución más limpia es migrar `image` al tipo `media` nativo de Strapi — para que las imágenes se suban y gestionen directamente desde el admin. Esa migración está en progreso y también agregará un campo `gallery` a BlogPost y Project, habilitando galerías de imágenes en el cuerpo de los posts sin depender de un CDN externo.

