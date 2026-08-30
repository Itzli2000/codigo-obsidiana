---
title: "PM + PO + dev al mismo tiempo: lo que aprendí haciendo un rebrand de 4 semanas con asistencia intensiva de AI"
description: "4 semanas, 3 roles simultáneos, 1 dev + AI. Este es el post que cierra la serie del rebrand del design system: una retrospectiva honesta sobre cuándo el AI eleva el trabajo y cuándo simplemente no puede."
publishDate: "2026-06-17T06:00:00.000Z"
updated: null
tags: ["AI", "Architecture", "Methodology", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 10
image: "multi-rol-ai.webp"
draft: false
---
"Asistencia intensiva de AI" es una frase que puede significar cualquier cosa. Puede querer decir que alguien usó ChatGPT para autocompletar comentarios en el código. Puede querer decir que un equipo de diez personas delegó la documentación al asistente. En este caso significa algo más específico: una persona, cuatro semanas, tres roles simultáneos, y un sistema de AI como interlocutor constante para análisis, redacción, arquitectura, y código.

Este post cierra la serie. No es un resumen de los seis anteriores — es la retrospectiva sobre el método en sí. Qué funcionó, qué no funcionó, y qué aprendí sobre cómo se trabaja cuando el AI es parte estructural del proceso y no un accesorio.

La conclusión honesta: el AI amplificó la capacidad de trabajo en algunas dimensiones de forma significativa. En otras, no sirvió de nada. La diferencia entre esas dimensiones es la parte interesante.

---

## Los tres roles y cómo coexistieron

El rebrand de la Fase 0 requirió tres modos de trabajo que normalmente viven en personas distintas.

**Como desarrollador frontend:** implementé la migración de tokens, actualicé el tema completo de MUI, configuré la infraestructura CDN con 76 assets, restilé la librería de componentes, y coordiné la migración de cuatro repositorios a los paquetes v2.0.0. El resultado en números: 3 paquetes publicados en versión mayor, 274 commits en el repositorio principal del frontend, y un pipeline de CDN corriendo en producción.

**Como PM/PO de frontend ad hoc:** consolidé los resultados de seis audits en un único roadmap de implementación, redacté el PRD de la Fase 0, planifiqué los breaking changes entre versiones, y coordiné el release de los tres paquetes de forma sincronizada a través de cuatro repositorios.

**Como PM/PO de backend de facto:** sin mandato formal y sin documentación previa, coordiné el rebrand de emails transaccionales y documentos del producto con tres equipos de backend. No tenía autoridad directa sobre ninguno. Tampoco tenía tiempo para construirla de forma ordinaria.

El problema de tener tres roles simultáneos no es el volumen de trabajo — es el cambio de modo cognitivo. El desarrollador necesita foco, contexto técnico preciso, y tiempo sin interrupciones. El PM necesita mantener el mapa completo del proyecto, anticipar bloqueos, y gestionar dependencias. El PO coordinando entre equipos necesita leer la sala, adaptar el mensaje, y operar en tiempo real. Cada modo tiene su propio ritmo y sus propias demandas atencionales.

El AI ayudó a crear esa separación de una forma que no esperaba.

---

## Dónde el AI sí funcionó

### Análisis y síntesis de auditorías

El audit de accesibilidad produjo datos crudos: 71 historias de Storybook fallando WCAG AA, distribuidas en reglas específicas de axe-core. Transformar eso en un argumento estructurado para incluir el Tier 2 en el roadmap — con severidad, causa raíz, y recomendación arquitectural — fue un proceso que el AI facilitó de forma directa.

No porque "escribiera el reporte" de forma autónoma. Sino porque actúa bien como interlocutor analítico: toma datos desestructurados, identifica patrones, y produce síntesis que tienen la estructura correcta para un documento técnico. Con el audit de tokens (95 primitivos sin capa semántica), con el gap map de componentes, con el mapa de migración — en todos los casos el ciclo fue el mismo: yo traía los hallazgos crudos, el AI ayudaba a estructurarlos en documentos que otros equipos pudieran leer y actuar.

El resultado son los cinco documentos de audit, el ADR arquitectural, y el PRD de la Fase 0. Todos existen antes de haber escrito una sola línea de código de implementación. Eso no es accidental — es la disciplina que el AI hizo sostenible.

### Generación de código en tareas bien acotadas

La configuración de Style Dictionary v4 para generar los tokens en múltiples formatos (CSS custom properties, TypeScript, JSON) es un ejemplo concreto. El problema estaba bien definido: 61 tokens nuevos, tres plataformas de salida, compatibilidad con el esquema de importación existente.

```ts
// Fragmento del transform personalizado — generado con AI, revisado y ajustado
export const camelCaseTransform: Transform = {
  name: 'name/camelCase',
  type: 'name',
  transform: (token) => {
    return token.path
      .map((segment, i) =>
        i === 0
          ? segment.toLowerCase()
          : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
      )
      .join('');
  },
};
```

El AI generó la estructura base. Yo identifiqué que el comportamiento del segmento no era correcto para paths con más de tres niveles, y lo corregí. Ese ciclo — generación rápida más revisión con contexto de dominio — es donde la colaboración funciona.

Lo mismo aplica para los scripts de migración: transformaciones de importaciones en TypeScript, búsquedas de referencias en cuatro repositorios, actualizaciones de configuración de Vite. Tareas con patrones claros, entradas y salidas bien definidas.

### Exploración de opciones arquitecturales

Para la decisión de multi-brand (cómo soportar personalización de marca en el futuro), el AI fue útil para generar los candidatos del ADR antes de empezar a evaluarlos. No porque sus propuestas fueran las correctas — algunas no lo eran — sino porque producir un conjunto amplio de opciones con trade-offs preliminares aceleró la fase de análisis.

```
Opciones evaluadas en el ADR:
A. CSS custom properties en Tier 2 (runtime override)  ← elegida
B. Temas MUI paralelos (compile-time)
C. Contexto React por marca (runtime, sin CSS)
D. Build-time token compilation por brand
```

La decisión final requirió juicio sobre la realidad del proyecto: complejidad de build, capacidad del equipo, y qué tan pronto llegaría el caso de uso multi-brand real. Eso no viene del AI. Pero llegar a esa decisión más rápido porque ya había un análisis estructurado de las opciones — eso sí.

### Mantener el hilo en contextos complejos

Cuatro semanas con múltiples roles y múltiples repositorios generan mucho contexto disperso. Tener un interlocutor que puede sostener el mapa del proyecto — recordar qué decisión se tomó en el audit de tokens y por qué, cuál era el constraint del Tier 1 para la Fase 0, qué dependencias tenía el release de los paquetes — redujo la carga cognitiva de mantener todo eso en la cabeza.

Funciona mejor cuando hay sistemas de memoria explícitos. En este proyecto, eso significó documentos de referencia que se pasaban al contexto en cada sesión relevante. Sin esa disciplina, el AI reinicia sin información previa y la ventaja desaparece.

---

## Dónde el AI no funcionó

### Leer la sala con equipos externos

La coordinación con los tres equipos de backend fue el trabajo más difícil del proyecto. No por complejidad técnica — el rebrand de emails y documentos no era un problema de ingeniería de sistemas. Era un problema de adopción, priorización, y relaciones.

Un equipo necesitaba un demo antes de comprometerse a cualquier cambio. Otro equipo tenía un deadline propio que hacía que cualquier solicitud de cambio antes de esa fecha fuera un no implícito. El tercero necesitaba que la solicitud llegara por el canal correcto, desde la persona correcta, con el nivel de formalidad correcto.

Ninguna de esas cosas se puede inferir de un análisis de texto. El AI puede ayudar a redactar el mensaje una vez que sabes qué necesitas decir y a quién. No puede decirte cuál de los tres equipos desbloquear primero cuando la respuesta depende de quién está en buena disposición esta semana.

### Decisiones de priorización bajo presión política

"¿Qué hacemos primero: bloquear el release del frontend hasta que los emails estén actualizados, o lanzar con inconsistencia de marca temporal?" No es una pregunta técnica. Es una pregunta sobre apetito de riesgo, sobre quién tiene la autoridad para decidir, sobre qué promesas se hicieron y a quién.

El AI produce análisis excelentes de trade-offs cuando los criterios están definidos. Cuando los criterios son implícitos y están cargados de contexto organizacional, el análisis pierde relevancia. No porque el razonamiento sea malo — es formalmente correcto. Sino porque los factores que realmente importan no están en el prompt.

### Decisiones de diseño que requieren criterio de marca

Los valores de los nuevos tokens de tipografía no son únicamente una decisión técnica. `font-size: 14px` vs `font-size: 13px` para el texto de cuerpo secundario parece una diferencia trivial. En el contexto de una identidad de marca nueva, con un sistema de grilla específico y una familia tipográfica con características particulares de espaciado, es una decisión que requiere ver el resultado en pantalla, en contexto, con densidad real de información.

El AI puede generar una escala tipográfica técnicamente correcta. No puede decirte si se siente bien. Esa parte requería iteración visual con la herramienta de diseño, y ningún prompt lo reemplaza.

### Contexto largo con múltiples archivos

Este fue el límite técnico más claro del proceso. En los refactors que involucraban cambios coordinados en múltiples archivos del repositorio de la librería de componentes — actualizando imports, renombrando tokens, ajustando props de tema — la calidad de las respuestas degradaba después de cierto número de turnos.

El patrón era predecible: el AI hacía un supuesto incorrecto en el turno 8 (por ejemplo, asumir que un token se llamaba de una forma cuando en el contexto del turno 3 se había establecido que el nombre era diferente). Ese supuesto viajaba silenciosamente a los turnos 9, 10, 11. El código resultante era sintácticamente válido y pasaba el type-checker, pero tenía inconsistencias semánticas que solo aparecían en runtime.

La solución fue dividir los refactors grandes en sesiones más cortas con contexto explícito al inicio de cada una. Funcionó, pero requirió más overhead de orquestación que un refactor bien planeado con dos desarrolladores humanos.

---

## La pregunta del T-shirt sizing con AI

Antes de empezar el proyecto, los estimados asumían capacidad de un desarrollador. La pregunta que surge después es inevitable: ¿el modelo "1 dev + AI" equivale a "2 devs"?

La respuesta corta es no. La respuesta completa es más útil.

El AI incrementó el throughput de forma real en tres categorías específicas:

- **Documentación:** los cinco audits, el ADR, el PRD, y el roadmap consolidado probablemente habrían tomado el doble de tiempo sin asistencia de AI. Eso no es especulación — puedo comparar contra mi velocidad histórica en documentos similares.
- **Generación de código con patrones claros:** los scripts de migración, la configuración de Style Dictionary, la estructura inicial de los tests. La proporción fue aproximadamente 60% generado + 40% revisado/ajustado.
- **Análisis de opciones:** la velocidad para llegar a una decisión arquitectural razonada fue significativamente mayor cuando había un interlocutor que podía desplegar el espacio de opciones rápidamente.

Pero un segundo desarrollador humano hace cosas que el AI no hace:

Un segundo desarrollador detecta cuando una decisión no cuadra con el modelo de negocio. Dice "esto técnicamente funciona pero el equipo de pagos no va a aceptarlo por razón X". Eso requiere contexto organizacional que no vive en ningún documento.

Un segundo desarrollador mantiene contexto entre sesiones sin necesidad de sistemas explícitos de memoria. La continuidad del pensamiento sobre el proyecto no requiere re-establecerse cada vez.

Un segundo desarrollador te frena cuando vas por mal camino. No porque genere un análisis de por qué es un mal camino — sino porque tiene la experiencia de haber visto ese mismo camino terminar mal en otro proyecto.

El AI compila los errores en silencio y te los entrega envueltos en código limpio. Esa es la diferencia más importante.

Para sizing futuro, mi estimado aproximado es: "1 dev + AI intensivo" en documentación/análisis/código con patrones equivale a algo entre 1.4 y 1.6 devs en esas categorías específicas. En coordinación con equipos, decisiones políticas, y trabajo de diseño con criterio de marca: el multiplicador es 1.0. El AI no suma ahí.

---

## La serie como evidencia: los 7 posts no existirían sin la disciplina de documentar

Hay algo concreto que quiero señalar sobre esta serie.

Los seis posts anteriores — el audit de tokens, el audit de accesibilidad, el análisis de multi-brand, la estrategia CDN, la migración de breaking changes, y la coordinación del rebrand de email backend — existen porque durante el proyecto hubo una disciplina de producir documentos estructurados como entregables intermedios, no solo como artefactos internos.

Esa disciplina fue posible en parte porque el AI redujo la fricción de escribir un documento bien estructurado hasta el punto donde producirlo durante el proyecto no requería restar tiempo a la implementación. El audit de accesibilidad se documentó mientras se hacía el audit. El ADR se redactó mientras se tomaba la decisión. El roadmap se escribió mientras se analizaban los resultados.

Cuando llegó el momento de escribir estos posts, el trabajo no era recordar qué pasó. Era editar y recontextualizar lo que ya estaba documentado. Esa es la otra cara del modelo de AI intensiva: si el AI te ayuda a documentar mientras trabajas, el costo de producir la retrospectiva después colapsa.

Los posts no habrían existido si el proyecto hubiera sido solo código y commits. Existen porque la documentación fue parte estructural del proceso desde el principio.

---

## Lo que haría diferente

**Establecería los sistemas de memoria antes de empezar.** En este proyecto, la gestión del contexto entre sesiones fue improvisada. Funcionó, pero con overhead. Un conjunto de documentos de referencia bien definidos al inicio — qué decisiones se tomaron, cuáles son los constraints no negociables, cuál es el estado actual de cada área — reduce significativamente la energía que se gasta reestableciendo contexto.

**Separaría más explícitamente las sesiones de "PM" y "dev".** El modo de trabajo más efectivo fue cuando había bloques de tiempo dedicados a un solo rol. Cuando los modos se mezclaban — "vamos a implementar esto y de paso tomamos la decisión de arquitectura" — la calidad de ambas cosas bajaba. El AI puede sostener el contexto de cada rol, pero no lo puede hacer simultáneamente de forma limpia.

**Definiría los límites del AI antes de cada tarea, no después.** En varias ocasiones pasé más tiempo corrigiendo código generado con el contexto equivocado que si hubiera escrito la implementación directamente. La causa era predecible en retrospectiva: tareas donde los requisitos eran implícitos o dependían de decisiones de negocio que no estaban en el contexto. Antes de delegar una tarea de implementación al AI, ahora me pregunto: ¿están todos los requisitos explícitos y verificables en el prompt? Si la respuesta es no, escribo el código directamente.

**Trataría la coordinación con equipos externos como un bloque de trabajo independiente.** No porque el AI no pueda ayudar con los artefactos (un email bien redactado, una presentación con los puntos correctos) — sí puede. Sino porque esa coordinación requiere presencia real y capacidad de respuesta en tiempo real. Es el trabajo que más sufre cuando se comparte el tiempo con otras dos funciones.

---

## Conclusión

Cuatro semanas. Tres roles. Un dev y un sistema de AI que funcionó como interlocutor de análisis, co-autor de documentos, y generador de código dentro de alcances bien definidos.

Lo que funcionó: audits, síntesis, documentación estructurada, código con patrones claros, exploración de opciones arquitecturales. Lo que no funcionó: leer la sala, decisiones bajo presión política, criterio de diseño con marca, y refactors largos con múltiples archivos.

El modelo no es escalable de forma ciega. Requiere saber qué tareas se amplifican con AI y cuáles requieren presencia humana sin sustituto. Saber esa diferencia — y organizarse alrededor de ella — es la habilidad que aprendí en estas cuatro semanas.

Lo que viene ahora es la Fase 1: implementar el Tier 2 semántico, construir la capa de multi-brand sobre CSS custom properties, y establecer la separación correcta entre tokens primitivos, semánticos, y de componente. Es el trabajo que esta serie de audits y decisiones hizo posible.

Si seguiste los siete posts desde el primero: gracias. Esta fue una serie larga sobre un proyecto que tuvo más complejidad de la esperada, y documentarla de forma honesta fue parte del proceso. La Fase 1 tendrá su propia serie cuando llegue el momento.

---

*Esta es la última entrega de la serie sobre el rebrand del design system de 2026. Los seis posts anteriores cubren los audits, las decisiones arquitecturales, la estrategia CDN, y la coordinación técnica del rebrand completo.*

