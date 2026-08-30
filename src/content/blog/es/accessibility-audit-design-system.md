---
title: "El audit de accesibilidad que cambió la arquitectura: 67.6% de fallos como argumento para Tier 2"
description: "Auditamos 105 historias de Storybook con axe-core y encontramos que el 67.6% fallaba WCAG AA. La causa raíz no eran los componentes — eran dos valores de token."
publishDate: "2026-05-23T06:00:00.000Z"
updated: null
tags: ["Frontend", "Accessibility", "Design System", "Architecture", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 8
image: "audit.webp"
draft: false
---
La accesibilidad es uno de esos temas que los equipos de frontend aplazan con buenas intenciones. "Lo revisamos antes del lanzamiento", "lo dejamos para cuando tengamos más cobertura de componentes", "ahora mismo no es prioritario". Lo escuché muchas veces. Lo dije yo mismo.

Cuando empezamos el proceso de rebrand de nuestro design system, la accesibilidad estaba catalogada mentalmente como un ítem de refinamiento — algo que se haría después de migrar los tokens, después de actualizar el tema de MUI, después del trabajo "real". Lo que encontré al hacer el audit formal me obligó a revisar esa jerarquía. No porque los números fueran malos (aunque lo eran), sino porque los números apuntaban a algo más profundo: el problema no estaba en los componentes, estaba en la arquitectura de tokens.

Ese giro — de "tenemos componentes con problemas de contraste" a "tenemos una capa semántica faltante que causa el 80% de los fallos" — terminó siendo uno de los argumentos más sólidos para incluir el Tier 2 en el roadmap de la Fase 1, no como un nice-to-have sino como infraestructura necesaria.

---

## La metodología

El audit se ejecutó sobre Storybook v8.6, que ya estaba configurado con `@storybook/react-vite` y `addon-essentials`. Lo que no estaba instalado — y fue parte del trabajo de este audit — era `@storybook/addon-a11y`. Lo instalé, lo configuré para que corriera automáticamente en cada historia, y luego usé `axe-playwright` para ejecutar un pase automatizado sobre las 105 historias del componente.

El estándar de referencia fue WCAG 2.1 AA. No es el estándar más estricto que existe (AAA requiere ratios de contraste de 7:1 para texto normal), pero es el que la mayoría de los contextos legales y regulatorios toman como mínimo aceptable, y el que aplica directamente a una plataforma fintech.

Lo que axe-core detecta en este contexto son violaciones de reglas específicas. No evalúa "qué tan accesible se siente la interfaz" — ese juicio requiere usuarios reales con tecnologías asistivas. Lo que sí hace es marcar violaciones objetivas: elementos con contraste insuficiente, imágenes sin texto alternativo, controles interactivos sin nombre accesible. Son el piso mínimo, no el techo.

El flujo fue simple:

1. Instalar `@storybook/addon-a11y` + `axe-playwright`
2. Ejecutar `npx nx test-storybook components` con los tags de WCAG 2.1 AA
3. Exportar el reporte de violaciones por componente
4. Clasificar por rule ID, impact level, y componentes afectados

---

## Los resultados

El número que me detuvo fue este: **71 de 105 historias fallaron WCAG AA**. Eso es el 67.6%. Menos de un tercio del componente library pasaba el audit.

| Componente | Historias | Resultado | Violaciones |
|---|---|---|---|
| Alert | 4 | **FAIL** | `color-contrast` (serious) |
| Autocomplete | 10 | **FAIL** | `color-contrast` (serious) |
| Avatar | 6 | **FAIL** | `color-contrast` (serious), `image-alt` (critical) |
| Button | 7 | **FAIL** | `color-contrast` (serious — story CustomButton) |
| Dialog | 4 | **PASS** | — |
| LanguageSelector | 3 | **FAIL** | `aria-input-field-name` (serious) |
| LogoController | 4 | **PASS** | — |
| PhoneInput | 5 | **FAIL** | `aria-input-field-name` (serious), `color-contrast` (serious) |
| ProgressBar | 4 | **FAIL** | `aria-progressbar-name` (serious), `color-contrast` (serious) |
| RadioGroup | 7 | **FAIL** | `color-contrast` (serious), `aria-prohibited-attr` (serious) |
| Select | 8 | **FAIL** | `aria-input-field-name` (serious), `color-contrast` (serious) |
| StatusComponent | 4 | **FAIL** | `color-contrast` (serious), `button-name` (critical) |
| Stepper | 7 | **FAIL** | `color-contrast` (serious) |
| TextField | 8 | **FAIL** | `color-contrast` (serious) |
| Tooltip | 3 | **PASS** | — |

12 de 15 componentes con violaciones. Solo Dialog, Tooltip y LogoController salieron limpios.

Dentro de las violaciones, el catálogo completo quedó así:

| Rule ID | Impacto | Criterio WCAG | Componentes afectados |
|---|---|---|---|
| `color-contrast` | Serious | 1.4.3 AA | 11 componentes |
| `aria-input-field-name` | Serious | 4.1.2 AA | LanguageSelector, PhoneInput, Select |
| `aria-progressbar-name` | Serious | 4.1.2 AA | ProgressBar |
| `aria-prohibited-attr` | Serious | 4.1.2 AA | RadioGroup |
| `image-alt` | **Critical** | 1.1.1 AA | Avatar |
| `button-name` | **Critical** | 4.1.2 AA | StatusComponent |

Las violaciones críticas son las más urgentes por definición: un `<img>` sin `alt` en Avatar significa que un usuario con lector de pantalla no recibe ninguna información sobre esa imagen. Un botón de ícono sin `aria-label` en StatusComponent es directamente inoperable para quienes navegan con teclado o AT. Esos dos se marcaron como P0 para corrección inmediata independientemente del plan mayor.

Pero la categoría que manda el volumen es `color-contrast`. Presente en 11 de 12 componentes que fallaron. Para entender por qué, había que ir a los tokens.

---

## La causa raíz

Cuando tienes la misma violación en 11 componentes distintos, lo primero que descartás es que sea un problema de cada componente por separado. La probabilidad de que 11 equipos hayan tomado la misma decisión incorrecta de forma independiente es baja. Mucho más probable: todos están usando el mismo valor de origen.

Así fue. El análisis de los pares foreground/background que axe marcaba como insuficientes apuntaba siempre a los mismos tokens:

```
neutral.400  →  #9F9F9F  sobre blanco #FFFFFF  →  ratio 2.85:1
primary.750  →  #677897  sobre blanco #FFFFFF  →  ratio 3.80:1
```

El mínimo WCAG AA para texto de tamaño normal es 4.5:1. Ambos valores están significativamente por debajo.

¿Dónde se usaban? En todos los roles visuales "secundarios" del sistema de inputs: etiquetas flotantes en estado de reposo, placeholders, helper text, texto deshabilitado. El patrón visual de Material Design separa el texto "activo" del texto "de apoyo" usando colores más suaves — y en nuestro tema, esa suavidad visual se implementó con tokens que nunca pasaron por un validador de contraste.

```css
/* Lo que existía — Tier 1 primitivos sin intención semántica */
--neutral-400: #9F9F9F;   /* ratio 2.85:1 vs blanco — FAIL */
--primary-750: #677897;   /* ratio 3.80:1 vs blanco — FAIL */

/* Dónde se aplicaban en el tema MUI */
MuiInputLabel: {
  styleOverrides: {
    root: {
      color: palette.primary[750],  /* etiqueta flotante en reposo */
    }
  }
}
MuiInputBase: {
  styleOverrides: {
    input: {
      '&::placeholder': {
        color: palette.neutral[400],  /* placeholder */
      }
    }
  }
}
```

Había un factor adicional que contribuyó aunque de forma menos directa: el cambio de tipografía. En el sistema anterior se usaba Montserrat, y la transición hacia DM Sans + Inter como parte del rebrand alteró el contraste percibido en algunos contextos. Montserrat tiene un peso visual mayor en ciertas variantes que hacía que ciertos grises "parecieran" más legibles sin serlo técnicamente. DM Sans, siendo una fuente más moderna y geométrica, expone esa debilidad con más claridad. No es una causa de violación en sí misma, pero es un factor que hace que la corrección se vuelva más urgente al cambiar de fuente.

Otros pares también fallaron, pero son contextuales y menos sistémicos:

```
error.900   (#F33954)  sobre  error.500  (#FFE9ED)  →  3.1:1   — FAIL
success.900 (#6BC25C)  sobre  success.500 (#EFFCEE)  →  2.2:1   — FAIL
blanco      (#FFFFFF)  sobre  success.900 (#6BC25C)  →  4.4:1   — FAIL (marginal)
```

Estos afectan casos específicos de Alert y Button con variante `success`. Son correcciones puntuales que no implican arquitectura. Los de `neutral.400` y `primary.750`, en cambio, sí.

---

## Por qué parchar componentes era la respuesta equivocada

La respuesta operativa más obvia cuando tenés 11 componentes fallando el mismo test es abrir 11 tickets y corregir cada componente. Es lo que haría un equipo que trata la accesibilidad como una lista de bugs.

El problema con ese enfoque es que no corrige nada — lo esconde.

Si arreglás el `color` en el override de MUI para `TextField`, vas a hardcodear un valor que pase el ratio: `#767676`, que es el gris más claro que supera 4.5:1 sobre blanco. Eso resuelve TextField. Pero PhoneInput sigue usando `neutral.400`. Y ProgressBar. Y Stepper. Y cuando alguien agrega un nuevo componente el mes que viene, ¿cómo sabe que no puede usar `neutral.400` para texto de ayuda? No hay ningún mecanismo que lo prevenga.

El sistema tiene 95 tokens Tier 1 — valores primitivos sin intención semántica. Son el equivalente de tener una paleta de colores sin roles: sabés que `neutral.400` existe y cómo se ve, pero no sabés para qué sirve ni qué garantías de contraste provee.

Lo que falta es una capa semántica. Tokens que no describen un color sino una función:

```css
/* Tier 2 — tokens semánticos (no existen todavía) */
--color-text-placeholder: #767676;  /* mínimo 4.5:1 vs blanco — garantía de contraste */
--color-text-label:       #595959;  /* ídem */
--color-text-disabled:    #767676;  /* ídem */
--color-text-helper:      #595959;  /* ídem */
```

Con esos tokens en la capa semántica, el tema MUI deja de referenciar primitivos directamente:

```css
/* Antes: Tier 1 directo */
MuiInputLabel { color: var(--primary-750); }       /* 3.8:1 — FAIL */
MuiInputBase  { ::placeholder color: var(--neutral-400); } /* 2.85:1 — FAIL */

/* Después: Tier 2 semántico */
MuiInputLabel { color: var(--color-text-label); }       /* 4.5:1 mínimo — PASS */
MuiInputBase  { ::placeholder color: var(--color-text-placeholder); } /* 4.5:1 mínimo — PASS */
```

El cambio no es solo de valores — es de contrato. Cuando el tema referencia `color-text-placeholder`, el sistema garantiza que ese token cumple contraste AA. Si el valor del token cambia en el futuro (por un rebrand, por un modo oscuro, por lo que sea), el contrato sigue vigente. Si referenciás `neutral.400` directamente, no hay garantía de nada: el valor primitivo puede cambiar sin que nadie recuerde que estaba siendo usado como texto de interfaz.

La diferencia es la misma que entre hardcodear `#677897` en un componente y referenciar una variable semántica: en el primer caso el bug existe sin ser visible, en el segundo el bug no puede existir sin romper el contrato de la variable.

Ese argumento — que el fix correcto requiere infraestructura que no existe todavía — fue lo que cambió la conversación sobre el roadmap.

---

## La decisión y sus implicaciones en el roadmap

El plan original del rebrand tenía la remediación de accesibilidad en la Fase 3, después de la migración de tokens y del restyling de componentes. La lógica era secuencial: primero migrás la base, después corriges lo que está encima.

Los datos del audit forzaron una revisión de esa secuencia.

Si la Fase 1 migraba tokens pero solo movía los Tier 1 primitivos sin agregar una capa semántica, estaríamos repitiendo el mismo error con valores nuevos. Los tokens de la nueva paleta tendrían nombres distintos, pero si el tema MUI seguía referenciando primitivos directamente, la siguiente persona que ejecutara el audit iba a encontrar exactamente el mismo patrón de fallos — o peor, si el rebrand usaba la identidad primaria de la marca (negro #111111 como primario, amarillo #FFB40A como secundario), algunos valores que hoy pasan marginalmente podrían fallar con las nuevas combinaciones.

La decisión fue esta: los tokens semánticos para texto (`color.text.placeholder`, `color.text.label`, `color.text.disabled`) se incluyen en la Fase 1 de la migración de tokens, no en la Fase 3. La remediación específica de los componentes — los ARIA, el Avatar, el ProgressBar — sigue en la Fase 3 cuando se haga el restyling completo de la librería. Pero la infraestructura que previene el problema de raíz va antes.

Esta distinción importa. El audit no aceleró la remediación de los componentes — eso requiere tiempo de desarrollo componente a componente y es razonable hacerlo en el contexto de un restyling mayor. Lo que sí aceleró fue el reconocimiento de que construir nueva arquitectura de tokens sin una capa semántica era tecnología deuda desde el primer día.

La conversación pasó de "cuando tengamos tiempo arreglamos los componentes" a "si no ponemos los tokens semánticos ahora, el problema va a ser estructural". Eso es lo que cambió.

---

## Lo que aprendí

**Los datos de accesibilidad son argumentos arquitectónicos.** No lo pensaba así antes. Pensaba en los resultados de axe como una lista de bugs por corregir. El audit me mostró que cuando una violación se repite en el 80% de los componentes, el dato interesante no es la violación — es la causa común. Y esa causa puede ser una decisión de arquitectura que todavía no tomaste.

**Parchar síntomas es técnicamente correcto y estratégicamente incorrecto.** Podría haber cerrado los tickets de `color-contrast` cambiando valores en 11 overrides de MUI. Hubiera pasado el audit. Y hubiera enterrado el problema real bajo una capa de correcciones que no se comunican entre sí y que el próximo desarrollador va a ignorar porque no hay ningún mecanismo que las haga visibles. Los sistemas que funcionan son los que hacen que el error correcto sea difícil de cometer, no los que corrigen el error después de que ocurrió.

**El baseline importa antes de construir encima.** Teníamos 15 componentes sin ningún audit formal de accesibilidad. Habíamos estado construyendo nuevas features — más historias, más variantes, más complejidad — sobre un piso que no sabíamos si era sólido. El audit no fue un ejercicio de compliance; fue descubrir cuál era el estado real del sistema antes de migrar todo a una arquitectura nueva. Sin ese dato, hubiéramos migrado los problemas junto con los tokens.

**Tres componentes pasaron limpiamente: Dialog, Tooltip y LogoController.** Lo que tienen en común vale la pena analizar: Dialog usa colores de texto de alta densidad sin excepciones, Tooltip no tiene texto secundario que dependa de los tokens problemáticos, y LogoController no renderiza texto de interfaz en absoluto. La lección no es "estos componentes son mejores" — es que el problema de contraste está específicamente ligado a los roles de texto secundario (label, placeholder, helper), no a los textos principales. Eso confirma que los tokens semánticos necesarios son exactamente los que se identificaron: `color.text.placeholder`, `color.text.label`, `color.text.disabled`.

---

## Conclusión

Un 67.6% de fallos en WCAG AA suena a desastre. En cierto modo lo es. Pero lo más valioso del audit no fue el número — fue lo que el número señalaba: dos valores de token usados en roles de texto secundario, sin ninguna capa semántica que los abstraiga ni ningún mecanismo que garantice contraste. El fix correcto no era parchar 11 componentes sino introducir la infraestructura que debería haber existido desde el principio.

Eso convirtió un audit de accesibilidad en un argumento de arquitectura, y ese argumento movió los tokens semánticos de la Fase 3 a la Fase 1 del roadmap.

El siguiente post de la serie documenta la migración técnica concreta de esa Fase 1: cómo se estructuró el paquete de tokens con Style Dictionary v4, qué decisiones se tomaron sobre la nomenclatura de los tiers, y qué implicó mover 95 tokens primitivos a una nueva paleta de marca mientras se introducía la capa semántica que este audit justificó.

