---
title: "De 175 assets dispersos a 76 en CDN: consolidación, optimización y versionado de marca"
description: "Teníamos 175 assets de marca esparcidos en 4 repositorios. Un cambio de branding requería 4 deploys. Lo resolvimos con un repositorio dedicado, S3 + CloudFront, y una sola variable de entorno."
publishDate: "2026-05-29T06:00:00.000Z"
updated: null
tags: ["Frontend", "Infrastructure", "Design System", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 8
image: "cdn-assets.webp"
draft: false
---
Antes de este trabajo, cambiar el logo de la plataforma significaba abrir cuatro repositorios, crear cuatro pull requests, y coordinar cuatro deploys. A veces el logo nuevo aparecía en producción en un repo antes de que los otros hubieran mergeado. Durante horas, la misma plataforma mostraba el logo viejo en la pantalla de login y el nuevo en el dashboard.

El objetivo era simple de enunciar: que un cambio de marca sea un cambio de una línea. Una variable de entorno. Cero deploys de aplicación.

Este post documenta cómo llegamos ahí.

---

## El problema: assets acoplados al ciclo de deploy

Los assets de marca —logos, banners, estados de error, ilustraciones de onboarding— vivían dentro de cada repositorio que los necesitaba. En `frontend-platform/src/assets/images/`. En `client-account-app/src/assets/`. En `product-ecosystem/public/`. En `ui-libraries/packages/components/src/`.

El resultado práctico era predecible:

**Drift de versiones.** Cada repo tenía su propia copia, y esas copias divergían. Un fix de accesibilidad en un SVG requería aplicarlo en cada repo por separado. La mayoría de las veces, solo se aplicaba en uno.

**Coupling con el ciclo de deploy.** Los assets eran parte del bundle. Si el diseño actualizaba un logo, ese logo no llegaba a producción hasta el próximo deploy de la app. Si había un feature freeze, el logo esperaba.

**Invisible para el equipo de diseño.** No había una fuente de verdad. Para saber qué versión de un asset estaba en producción, había que buscar en cuatro repos distintos.

Contando archivos antes de la migración llegué a ~175 assets de marca distribuidos entre esos repositorios. No todos duplicados exactamente —algunos repos tenían variantes que otros no—, lo que hacía la situación peor: la inconsistencia no era uniforme.

---

## La decisión: un repositorio dedicado como fuente de verdad

La solución obvia sería "subir los assets a S3". Pero la decisión más importante no fue la infraestructura —fue el modelo de gestión.

Un bucket de S3 sin estructura es un cajón. Cualquiera puede subir cualquier cosa, sin convención de nombres, sin historia de cambios, sin revisión. En seis meses tienes `logo-final-v3-REAL.svg` y `logo-nuevo-2.png` conviviendo.

La decisión fue: el repositorio de Git _es_ la fuente de verdad. S3 es un espejo del repo. La estructura del repo determina la estructura del bucket. El historial de commits es el historial de cambios de los assets. Un PR es la forma de agregar o modificar un asset.

```
assets-repo/
├── README.md
├── MANIFEST.md
├── CONVENTIONS.md
├── .svgo.config.mjs
├── .github/
│   └── workflows/
│       └── deploy.yml
└── v2/
    ├── platform/
    │   ├── logos/
    │   ├── banners/
    │   ├── icons/
    │   ├── states/
    │   ├── onboarding/
    │   ├── password-reset/
    │   ├── timer/
    │   └── emails/
    └── partners/
        ├── partner-a.svg
        └── partner-b.svg
```

La carpeta `v2/` mapea 1:1 al prefijo en el bucket de S3. Lo que está en el repo, está en el CDN. Nada más.

---

## De 175 a 76: qué eliminamos y qué optimizamos

La reducción más grande no vino de optimizar —vino de eliminar.

Entre los assets originales había un SVG de 2.8 MB. Una ilustración compleja, con gradientes, filtros y centenares de paths. Técnicamente era un SVG, pero en la práctica se comportaba como una imagen rasterizada: no escalaba visualmente mejor que un WebP, tardaba más en parsear, y bloqueaba el render. La decisión fue no migrarlo. Eliminado, no reemplazado.

Esa decisión sola fue el mayor impacto en peso total del conjunto.

Para el resto, la estrategia fue dual-format:

**SVG para logos e iconos.** Son vectoriales por naturaleza, escalan sin pérdida, y una vez comprimidos con gzip en CloudFront son muy pequeños. `sidebar.svg` pesa 0.5 KB. Su equivalente `sidebar.webp` pesa 1.6 KB —el SVG es más liviano aquí. Y para emails y casos donde SVG no renderiza, tenemos el WebP como fallback.

**WebP para fotos e imágenes complejas.** `login.webp`, el banner de pantalla completa de la página de login, pesa 2.1 MB. Es el asset más pesado del repositorio —intencionalmente, porque es una imagen fotográfica a pantalla completa y WebP es el formato correcto para ese caso.

El resultado final: **76 archivos** — 37 SVG + 38 WebP + 1 PNG (el PNG es `fragment-bg.png`, mantenido como original en el repo pero excluido del deploy al CDN, que usa su versión WebP).

### Optimización de SVG

El config de svgo que usamos:

```js
// .svgo.config.mjs
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,  // crítico: sin viewBox el SVG no escala en <img>
          cleanupIds: false,     // preservar IDs que otros elementos referencian internamente
        },
      },
    },
  ],
};
```

Dos overrides que importan:

`removeViewBox: false` — la optimización por defecto de svgo elimina el atributo `viewBox` cuando puede derivarlo de `width`/`height`. El problema es que un `<img src="logo.svg">` con dimensiones `width: 100%` necesita `viewBox` para saber el aspect ratio y escalar correctamente. Sin él, el SVG colapsa o se renderiza con dimensiones incorrectas.

`cleanupIds: false` — algunos SVGs usan IDs internamente para referencias entre elementos (`<use href="#icon-path"/>`). Limpiar esos IDs rompe el SVG silenciosamente.

Para optimizar antes de commit:

```bash
npx svgo --config=.svgo.config.mjs "v2/platform/**/*.svg"
```

---

## Arquitectura CDN: S3, CloudFront y versionado por folder

### La estrategia de caché

```
Cache-Control: public, max-age=31536000, immutable
```

Un año de caché, `immutable`. El browser no vuelve a pedir el asset mientras esté en caché. CloudFront lo sirve desde el edge más cercano al usuario.

La implicación: **los assets son inmutables una vez publicados**. Si el contenido de `sidebar.svg` cambia, la URL tiene que cambiar. La forma de manejar esto en este sistema es la misma convención de versionado que usamos para todo.

### Versionado por folder, no por filename

La alternativa clásica al versionado de assets es el hash en el filename: `sidebar.a3f8c2.svg`. Funciona bien cuando los assets los genera un build tool que actualiza las referencias automáticamente. No funciona bien cuando hay cuatro repos distintos que necesitan saber la nueva URL.

La decisión fue versionar por folder: `/v2/` es la versión actual. Cuando llegue un rebranding mayor, vivirá en `/v3/` —sin tocar `/v2/`. Los repos que aún no migraron siguen apuntando a `/v2/` sin romperse. Los que sí migraron usan `/v3/`. La transición es incremental.

```
cdn.platform.com/v2/platform/logos/sidebar.svg  ← versión actual
cdn.platform.com/v3/platform/logos/sidebar.svg  ← futura versión, cuando exista
```

Esto hace que la URL sea predecible y human-readable. Un desarrollador puede construir la URL de memoria. No necesita consultar un manifest para saber dónde está `login.webp`.

### Tres ambientes, un repo

```
                         ┌─────────────────────────────────────────┐
                         │           assets-repo (repo Git)        │
                         │   branch: develop / staging / main      │
                         └────────────┬────────────────────────────┘
                                      │ push → GitHub Actions
                    ┌─────────────────┼──────────────────────┐
                    ▼                 ▼                       ▼
          S3 (dev)           S3 (stg)                 S3 (prd)
          │                  │                         │
          ▼                  ▼                         ▼
   CloudFront (dev)   CloudFront (stg)          CloudFront (prd)
          │                  │                         │
          ▼                  ▼                         ▼
cdn.dev.platform.com  cdn.stg.platform.com   cdn.platform.com
```

Cada merge a la rama correspondiente dispara el deploy a ese ambiente. El flujo de promoción es branch-driven: `develop` → `staging` → release tag → `prd`.

---

## El pipeline de CI/CD

El workflow de GitHub Actions delega en un template reutilizable (manejado por DevOps). Lo que controla este repo es qué se sube y a dónde:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main
    paths:
      - 'v2/**'           # solo se dispara si cambia algo en v2/
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: false
        type: choice
        default: dev
        options:
          - dev
          - stg
          - prd

jobs:
  deploy:
    uses: org/static-files-pipeline-template/.github/workflows/deploy.yml@main
    with:
      aws_dev_account_id: ${{ vars.AWS_DEV_ACCOUNT_ID }}
      aws_stg_account_id: ${{ vars.AWS_STG_ACCOUNT_ID }}
      aws_prd_account_id: ${{ vars.AWS_PRD_ACCOUNT_ID }}
      aws_iam_role_name: ${{ vars.AWS_IAM_ROLE_NAME_FOR_S3_CLOUDFRONT_DEPLOYER }}
      environment: ${{ inputs.environment || 'dev' }}
      s3_bucket_dev: assets-dev
      s3_bucket_stg: assets-stg
      s3_bucket_prd: assets-prd
      s3_prefix: v2
      cloudfront_invalidation_paths: /v2/*
      skip_build: true
      build_output_dir: v2
```

Puntos clave:

`paths: - 'v2/**'` — el workflow no se dispara si solo cambia un README. Solo los cambios en assets reales activan el deploy.

`skip_build: true` — no hay paso de build. Lo que está en el repo es lo que va al CDN. El "build" es la optimización que se hace antes de commitear.

`cloudfront_invalidation_paths: /v2/*` — invalida todo el prefijo `/v2/` en CloudFront después del sync. Necesario porque el header es `immutable` y CloudFront no invalida automáticamente al actualizar S3.

El template reutilizable ejecuta internamente el equivalente de:

```bash
aws s3 sync ./v2/ s3://assets-<env>/v2/ \
  --cache-control "public, max-age=31536000, immutable" \
  --delete

aws cloudfront create-invalidation \
  --distribution-id <dist-id> \
  --paths "/v2/*"
```

---

## Lo que ve el consumidor: una variable de entorno

El contrato con los repos consumidores es minimalista. Una variable de entorno. Eso es todo.

```bash
# .env.development
VITE_CDN_URL=https://cdn.dev.platform.com

# .env.staging
VITE_CDN_URL=https://cdn.stg.platform.com

# .env.production
VITE_CDN_URL=https://cdn.platform.com
```

El consumer no sabe nada de S3, CloudFront, ni de la estructura interna del repo de assets. Construye URLs a partir de esa variable.

### Acceso directo (sin librería)

```tsx
const CDN = import.meta.env.VITE_CDN_URL;

function LoginPage() {
  return (
    <img
      src={`${CDN}/v2/platform/banners/login.webp`}
      alt="Login illustration"
    />
  );
}
```

### Acceso tipado con `@org-scope/assets`

Para los consumers dentro del ecosistema, publicamos un paquete que encapsula el manifest y resuelve todas las URLs con tipado completo:

```ts
// src/configs/assets.ts
import { createAssets } from '@org-scope/assets';

export const assets = createAssets({
  cdnUrl: import.meta.env.VITE_CDN_URL,
});

export type AppAssets = typeof assets;
```

```tsx
// Cualquier componente
import { assets } from '@configs/assets';

function ErrorState() {
  return (
    <img
      src={assets.states.error.svg}
      alt="Error"
    />
  );
}

function OnboardingBanner() {
  return (
    <img
      src={assets.onboarding.hand.webp}
      alt="Onboarding"
    />
  );
}
```

`createAssets` valida en runtime que `cdnUrl` no esté vacío. TypeScript da autocompletado sobre el manifest entero. No hay strings mágicos.

### El cambio de CDN

Cuando el CDN de producción cambia de dominio, o cuando llega una versión `/v3/` con nuevos assets, el cambio es:

```bash
# Cambiar en CI/CD (o en .env.production):
VITE_CDN_URL=https://cdn-nuevo.platform.com
```

Sin redeploy de la aplicación. Sin tocar código. Solo la variable de entorno, y en el próximo build (o en el próximo request si es un env var dinámica), todos los assets apuntan al nuevo origen.

---

## Lo que aprendí

**El repositorio como fuente de verdad, no como paso intermedio.** La decisión de tratar el repo de Git como el artefacto definitivo —no como un lugar donde se guarda código que después genera el artefacto— cambió cómo todo el equipo razona sobre los assets. PR = revisión de un cambio. Merge = deploy (mediado por CI). El historial de Git es el historial de cambios del CDN.

**Eliminar antes de optimizar.** El SVG de 2.8 MB que eliminamos valió más que todas las optimizaciones de svgo sobre el resto. Antes de mejorar algo, preguntar si debe existir. El inventario de 175 assets incluía assets que nadie usaba, duplicados entre repos, y variantes que el diseño había descartado hace meses. La consolidación fue también un proceso de limpieza.

**El versionado de folder es un contrato de comunicación, no solo técnico.** `/v2/` le dice a cualquiera que lo lea: "estos assets son para la versión 2 del design system". Cuando llegue `/v3/`, la coexistencia de ambas versiones en el mismo CDN hace la migración incremental sin coordinación forzada entre repos. No es solo una solución técnica —es una convención que reduce la coordinación necesaria entre equipos.

**`immutable` + invalidación explícita es el contrato correcto.** La caché de un año con `immutable` es agresiva. El browser ni siquiera verifica si cambió. Eso es exactamente lo que queremos para assets estáticos. La condición es que las URLs sean efectivamente inmutables: si el contenido cambia, la URL debe cambiar. La disciplina de versionado hace que eso sea sostenible.

---

## Conclusión

La arquitectura que quedó es deliberadamente simple: un repo Git como fuente de verdad, un pipeline que lo sincroniza con S3, CloudFront como capa de distribución, y una variable de entorno como contrato con los consumidores.

La reducción de 175 archivos a 76 no fue el objetivo principal —fue la consecuencia de tomar decisiones explícitas sobre qué debía existir y en qué formato. El número que importa no es cuántos assets hay, sino desde cuántos lugares los gestiona el equipo. La respuesta pasó de cuatro a uno.

El siguiente post de la serie da un paso atrás de la infraestructura para ver la coordinación: cómo se orquestó el release de breaking changes a través de 4 repositorios y 4 paquetes simultáneamente, qué secuencia de versiones se siguió para que ningún consumer quedara roto durante la transición, y qué decisiones técnicas en el versionado semántico hacen esa coordinación manejable.

