---
title: "Audit antes que arquitectura: cómo 6 investigaciones paralelas modelaron un roadmap de 10 meses"
description: "Antes de escribir una sola línea de código en el rebrand de nuestro design system, pasamos semanas investigando. Así es como seis audits paralelos cambiaron radicalmente lo que íbamos a construir."
publishDate: "2026-05-22T06:00:00.000Z"
updated: null
tags: ["Architecture", "Design System", "Methodology", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 7
image: "audit.webp"
draft: false
---
## El instinto equivocado

Cuando llegó la instrucción — "necesitamos un rebrand completo del design system" — el primer impulso fue claro: abrir el editor, cambiar los colores, actualizar los tokens, hacer commit. Una semana de trabajo, tal vez dos.

No lo hice.

En lugar de eso, dediqué las siguientes cuatro semanas a investigar. Seis audits paralelos antes de escribir una sola línea de código de implementación. Este post documenta lo que encontramos, por qué eso cambió radicalmente lo que íbamos a construir, y la lección principal que me llevo: auditar antes que diseñar, diseñar antes que implementar.

---

## El contexto

Teníamos un design system funcional con tres paquetes publicados: un paquete de design tokens, un tema MUI, y una librería de componentes. También teníamos un roadmap en marcha para expandir la librería de 22 a ~80 componentes.

El nuevo brief llegó con especificaciones claras: nueva paleta de colores, nueva tipografía (tres fuentes en lugar de una), nuevos assets de marca. Todo el frontend de la plataforma y todas las comunicaciones del producto debían adoptar la nueva identidad.

La pregunta que nadie había formulado explícitamente era: **¿qué tan profundo tenemos que ir?** ¿Es esto un swap de variables CSS, o hay problemas estructurales subyacentes que el rebrand va a exponer?

---

## Seis investigaciones, cuatro semanas, una decisión

Para responder esa pregunta de manera fundamentada, definí seis áreas de investigación que se ejecutaron en paralelo:

| Investigación | Pregunta central | Entregable |
|---|---|---|
| Arquitectura de tokens | ¿Nuestra estructura actual soporta el rebrand? | Inventario + gaps + ADR |
| Brecha de componentes | ¿Qué tenemos vs. qué requiere el nuevo diseño? | Gap map + priorización |
| Accesibilidad | ¿Nuestros componentes pasan WCAG AA? | Reporte de violations + severidad |
| Multi-brand | ¿Cómo soportamos personalización de marca en el futuro? | ADR arquitectural |
| Assets estáticos y CDN | ¿Cómo viven los assets hoy y cuál es el path de migración? | Estrategia CDN |
| Mapa de migración de tokens | ¿Cuál es el mapping exacto de token viejo a token nuevo? | Tabla de migración completa |

**Por qué en paralelo:** cada investigación tenía dependencias cruzadas, pero podían avanzar independientemente hacia sus conclusiones. Esperar a que terminara la primera para empezar la segunda habría sido más lento *y* habría sesgado los hallazgos — quería que cada audit llegara a sus conclusiones de forma independiente antes de sintetizar.

---

## Lo que encontramos

### 1. Tokens: 95 primitivos, cero capas semánticas

El paquete de tokens tenía 95 tokens en seis categorías: colores, dimensiones, espaciado, radius, sombras y tipografía. Todos Tier 1 — primitivos puros, sin semántica.

```ts
// Lo que existía — primitivos directos
import { ColorsPrimary500 } from '@design-tokens'

// ColorsPrimary500 = "#006BF8" — valor de negocio hardcodeado

// Lo que no existía — capa semántica
// color.text.primary
// color.background.surface
// color.border.default
```

Los 43 archivos consumidores de tokens a través de los tres paquetes importaban primitivos directamente. Cambiar la paleta significaba buscar y reemplazar en 43 archivos. Y para capacidades futuras — dark mode, multi-brand B2B — era arquitecturalmente imposible sin un Tier 2 semántico que todavía no existía.

**La buena noticia:** Style Dictionary v4, la herramienta que ya usábamos, soporta nativamente la arquitectura de tres capas. El problema no era de tooling, era de decisión de diseño no tomada.

### 2. Componentes: 21% de cobertura MUI, y una sorpresa positiva

| Métrica | Valor |
|---|---|
| Componentes en la librería | 22 |
| Catálogo MUI total | ~105 |
| Cobertura actual | 21% |
| Target del roadmap | 75% (~79 componentes) |
| Componentes que son wrappers delgados de MUI | ~18/22 |

La sorpresa: **la mayoría de componentes delegaban todo el estilo al tema MUI**. En teoría, actualizar el tema debería restyle automáticamente la mayor parte de la librería. Confirmado en el audit: solo 6 componentes requerían cambios visuales más allá del tema. El rebrand no iba a ser 22 componentes reescritos — iba a ser 1 archivo de tema actualizado con 6 ajustes manuales adicionales.

La excepción notable: el componente `LogoController` embundleaba assets de marca directamente en el paquete. Eso tendría que cambiar cuando implementáramos la estrategia CDN.

### 3. Accesibilidad: 67.6% de fallos y la causa que no esperábamos

Este fue el hallazgo que más cambió nuestro plan.

| Métrica | Valor |
|---|---|
| Stories auditadas | 105 |
| Pasando WCAG 2.1 AA | 34 (32.4%) |
| Fallando WCAG 2.1 AA | 71 (67.6%) |
| Componentes afectados | 12 de 15 (80%) |
| Violación dominante | `color-contrast` |
| Componentes que pasan completamente | 3 (Dialog, Tooltip, LogoController) |

El 80% de las violaciones venía de una sola causa: dos valores de token. `neutral.400` (#9F9F9F, ratio 2.85:1) y `primary.750` (#677897, ratio 3.8:1) — ambos por debajo del mínimo de 4.5:1 de WCAG AA.

**La conclusión crítica:** no era un problema de componentes, era un problema de tokens. Parchear 12 componentes individualmente habría resuelto el síntoma. La solución correcta era agregar un Tier 2 semántico con valores que respetaran el contraste desde la raíz. Sin ese Tier 2, cualquier fix de accesibilidad sería frágil: el siguiente developer que cambiara un valor de token podría romper el contraste sin darse cuenta.

### 4. Multi-brand: el ADR que definió Phase 1

El brief incluía un requerimiento de negocio para el futuro: clientes B2B deben poder inyectar su propia marca en componentes embedidos via iframe, con scope limitado al contenedor, sin filtrarse al host.

Evaluamos cuatro enfoques técnicos. La decisión: **CSS custom properties en el Tier 2 semántico como superficie de override en runtime**.

```css
/* Tier 2 semántico — generado por Style Dictionary, emitido como CSS vars */
:root {
  --color-text-primary: #111111;
  --color-background-surface: #FFFFFF;
  --color-border-default: #E5E5E5;
}

/* Override de marca del cliente B2B — inyectado en runtime, sin redeploy */
[data-brand="acme-corp"] {
  --color-text-primary: #1A2B3C;
  --color-background-surface: #F8F9FA;
}
```

El problema: este Tier 2 **todavía no existía**. Existía el ADR y el diseño técnico, pero implementarlo durante el rebrand hubiera significado reescribir los 43 archivos consumidores de tokens *al mismo tiempo* que cambiábamos toda la paleta. Demasiado riesgo en una ventana de 4 semanas.

Decisión: el ADR queda firmado y documentado. Phase 0 hace el swap de Tier 1. Phase 1 construye el Tier 2.

### 5. Assets estáticos: una marca que requería redeploy

Todos los assets de marca — logos, banners, iconos, imágenes de estados — vivían embundleados en cuatro repositorios. Un cambio de marca requería commit + PR + deploy en cada uno.

El audit identificó ~175 archivos en total distribuidos entre los repos, con dos SVGs de tamaño crítico que consumían megabytes innecesarios. La recomendación: un repositorio dedicado de assets que espeja directamente a S3 + CloudFront, con paths versionados `/v1/` y `/v2/`. El cutover de marca pasaría a ser cambiar una variable de entorno. Sin redeploy.

Esta arquitectura también desacoplaba para siempre el ciclo de vida de los assets del ciclo de vida del código.

### 6. Mapa de migración de tokens: 95 → 61, más adiciones

El equipo de diseño entregó un mapa token-por-token de la migración. 61 tokens en la nueva paleta frente a 95 actuales. Los cambios más significativos:

| Categoría | Antes | Después | Tipo de cambio |
|---|---|---|---|
| Colores primarios | 11 tonos azul (#006BF8) | Escala neutros + negro (#111111) | Rewrite completo |
| Tipografía | Montserrat (1 fuente) | DM Sans + Inter + JetBrains Mono | 3 fuentes con roles distintos |
| Pesos tipográficos | 8 pesos (100–900) | 4 pesos (400–700) | 4 eliminados |
| Dimensiones | 22 valores | 11 valores | Escala simplificada |
| Status colors | success/warning/error/extra | Green/Yellow/Red/Tertiary | Renombradas |
| Alpha colors | — | 5 nuevos (rgba overlays) | Categoría nueva |
| Stroke | — | 4 nuevos (1–6px) | Categoría nueva |

Con el mapa entregado, la migración técnica era directa. La incertidumbre ya no era "¿cuánto cambia?" sino "¿en qué orden y con qué riesgo?".

---

## De hallazgos a roadmap

Con los seis audits completados, la síntesis reveló tres patrones que no eran obvios antes de investigar.

**Patrón 1: Todo converge en el Tier 2.** El audit de tokens identificó su ausencia como deuda técnica. El audit de accesibilidad la identificó como causa raíz de 71 violations. El ADR de multi-brand la necesitaba como superficie de override. Tres investigaciones independientes, misma conclusión. Cuando un patrón emerge desde múltiples ángulos sin coordinación, es difícil ignorarlo.

**Patrón 2: El roadmap existente era correcto, pero tenía una precondición no articulada.** El plan para expandir la librería de componentes era buena ingeniería. El problema: construir componentes sobre la paleta antigua significaba tener que rehacerlos cuando llegara el Tier 2. Necesitábamos la nueva fundación antes de construir encima. La solución no era tirar el roadmap — era agregarle un prerequisito.

**Patrón 3: El rebrand era más que colores y fuentes.** Incluía estrategia CDN, migración de assets, breaking changes en cuatro repositorios y la base para capacidades que todavía no existían. "Una semana o dos" era una estimación con una superficie de problema incorrecta.

### El roadmap resultante

```
Phase 0 — Rebrand visual (4 semanas, 1 dev + AI)
├── Semana 1: Tokens v2 + Tema MUI v2 + Fonts
├── Semana 2: CDN infra + Assets optimizados + CI/CD pipeline
├── Semana 3: Restyle de componentes + Migración de 4 repos
└── Semana 4: QA cross-repo + Release + CDN cutover

Phase 1 — Semantic tier + Multi-brand foundation (3–4 semanas)
└── Tier 2 tokens, CSS vars, brand-provider PoC

Phase 2 — Componentes net-new (~6 meses)
└── 57 componentes nuevos → 75% cobertura MUI

Phase 3 — Capacidades avanzadas (3–4 meses)
└── A11y remediation, visual regression, multi-brand runtime
```

**Total Phase 0–3: ~42 semanas de esfuerzo / ~10 meses con equipo completo.**

Lo más importante del diseño de fases: **todo lo que salió de P0 tenía una fase asignada**. No fue "esto no importa", fue "esto viene en Phase 1" o "esto viene en Phase 3". Decir cuándo es la diferencia entre un backlog y abandono.

---

## Cuatro semanas de planeación, cuatro de ejecución

Phase 0 aterrizó el 11 de mayo de 2026. 274 commits, 50+ PRs, cuatro repositorios actualizados, tres paquetes en v2.0.0 estable, y un repositorio nuevo dedicado a assets con 76 archivos en CDN.

El PRD original documentaba 9 patrones de breaking changes. La realidad fueron 26+ categorías. Eso no fue una falla de planeación — fue el resultado esperado de ejecutar un cambio de identidad completo en un sistema real con años de uso. Los audits habían calibrado el riesgo y la complejidad correctamente; la dimensión exacta del scope solo se vuelve visible al ejecutar.

Los siguientes posts de esta serie documentan la ejecución técnica: la migración de tokens, la arquitectura CDN, y la coordinación del release de breaking changes a través de cuatro repositorios.

---

## Lo que aprendí

**Auditar antes que diseñar, diseñar antes que implementar.** Cuatro semanas de investigación evitaron construir seis meses de componentes sobre la fundación equivocada. El costo de invertir el orden — construir primero, auditar después — habría sido rehacer trabajo ya hecho.

**Las audits paralelas revelan patrones que las secuenciales ocultan.** Si el audit de tokens hubiera terminado antes de empezar el de accesibilidad, habría concluido que "necesitamos Tier 2 por razones arquitecturales". Con ambos en paralelo, la conclusión fue "necesitamos Tier 2, y hay 71 violations de accesibilidad que lo confirman desde otro ángulo". Un argumento técnico más un argumento de usuario es significativamente más difícil de postergar que uno solo.

**"No ahora, pero en Phase 1" es mejor que incluir todo.** El Tier 2 semántico era necesario y correcto. Solo no en Phase 0. Tener fases bien definidas convierte el scope creep en decisiones de roadmap deliberadas. Cada cosa que entró al backlog de Phase 1 o Phase 3 fue una decisión explícita, no una omisión.

**Los roadmaps existentes tienen valor, incluso cuando hay que reorganizarlos.** El plan de componentes que teníamos era buena ingeniería. No lo tiramos — lo re-secuenciamos. La distinción entre "este roadmap está mal" y "este roadmap necesita una precondición" cambió completamente la conversación interna sobre prioridades.

---

## Conclusión

El rebrand de un design system es tentador de resolver con urgencia. Los cambios visuales son tangibles, el feedback es inmediato, hay presión de negocio para ver la nueva identidad en pantalla.

La disciplina de auditar primero no frena esa urgencia — la encauza. Cuatro semanas de investigación dieron claridad sobre qué era un swap superficial, qué era deuda técnica acumulada, y qué era infraestructura que todavía no existía. Sin esa claridad, habríamos construido sobre una base que sabíamos que íbamos a cambiar.

El siguiente post de la serie entra en el hallazgo que más me sorprendió: el audit de accesibilidad que reveló que el 67.6% de nuestros componentes fallaban WCAG AA — y cómo esos datos se convirtieron en el argumento más fuerte para una decisión arquitectural que ya llevaba meses postergándose.

