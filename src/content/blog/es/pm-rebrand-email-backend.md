---
title: "PM sin manual: coordinando el rebrand de email en 3 equipos de backend sin ser su PM"
description: "Cuando el frontend estrenó la nueva identidad visual, los correos transaccionales seguían con la marca anterior. Esta es la historia de cómo coordiné el rebrand del backend — sin ser su PM, sin documentación previa, y con tres equipos autónomos."
publishDate: "2026-06-17T06:00:00.000Z"
updated: null
tags: ["PM", "Cross-team", "Design System", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 8
image: "pm-no-manual.webp"
draft: false
---
El frontend había quedado listo. Los tokens migrados, el tema actualizado, los componentes rebrandeados, el CDN en producción. Semanas de trabajo técnico que podría resumirse con un screenshot: la plataforma ya se veía como la nueva marca.

Entonces alguien abrió su bandeja de entrada.

El correo de confirmación de pago que acababa de recibir tenía el logo viejo. Los colores viejos. La tipografía vieja. Toda la identidad visual que habíamos reemplazado seguía intacta en cada correo transaccional que el sistema enviaba a los usuarios.

Nadie lo había planeado. Tampoco nadie lo había bloqueado explícitamente. Simplemente era un punto ciego en el scope del rebrand: el frontend como producto visible había consumido toda la atención. Las comunicaciones que el backend generaba de forma autónoma, en sus propios servicios, con sus propias plantillas embebidas en el monolito, habían quedado fuera del radar.

---

## El rebrand que nadie había planeado

Cuando haces un rebrand de design system hay una tentación muy natural de pensar en términos de interfaz: lo que el usuario ve en pantalla. Los tokens de color, la tipografía, los componentes. Todo eso vive en el frontend y el frontend lo controla.

Lo que no vive en el frontend son los correos transaccionales. Ni los estados de cuenta. Ni los documentos que el sistema genera y envía. Esas piezas son responsabilidad del backend y, en nuestra arquitectura, estaban distribuidas entre varios servicios con lógicas propias.

El resultado concreto era este: la plataforma nueva convivía con comunicaciones de la marca anterior. Un usuario que completaba un pago veía la interfaz en la identidad nueva y recibía el comprobante con la identidad vieja. La incoherencia no era pequeña ni técnica — era visible y la notaban los usuarios.

En Confluence no había ninguna página sobre esto. En el backlog no había ningún ticket abierto. Nadie tenía el ownership formal de resolver el problema.

Yo era el lead de Platform en frontend. El rebrand de correos no era mi responsabilidad. Decidí asumirla igual.

---

## La situación: tres equipos, ningún manual

Antes de moverme, necesitaba entender el terreno. Lo que encontré fue más fragmentado de lo que esperaba.

Los correos transaccionales estaban distribuidos entre tres equipos de backend, cada uno operando en su propio dominio de producto. Un equipo manejaba todo lo relacionado con pagos y transferencias. Otro era responsable del flujo de activación y onboarding de cuentas. El tercero controlaba los procesos de tesorería y estados de cuenta.

Cada equipo tenía sus propias plantillas, sus propios triggers, su propia lógica de envío. No había un repositorio centralizado de templates ni un estándar compartido. Las plantillas vivían embebidas en el código de sus respectivos servicios, mezcladas con lógica de negocio.

El stack era SendGrid para la entrega, Lambdas y microservicios para los triggers, y plantillas HTML escritas directamente en el código de cada servicio. Sin abstracción de presentación. Sin separación entre lógica y template.

El número final de templates, una vez que los inventariamos, fue de 72 archivos entre correos transaccionales y documentos. En tres categorías principales: autenticación, pagos y wallets. Muchos con versión en inglés y en español.

No tenía autoridad sobre ninguno de los tres equipos. No era su PM. No estaba en su cadena de reporting. La única razón por la que iban a escucharme era si lo que yo traía les hacía el trabajo más fácil, no más complicado.

---

## Cómo coordiné sin autoridad formal

La primera decisión fue no intentar imponer un proceso.

Cuando no tienes autoridad, el proceso burocrático es el peor camino: genera resistencia, hace que la gente se sienta auditada, y generalmente produce el resultado opuesto al que buscas. En cambio, lo que funciona es reducir la fricción hasta que colaborar sea la opción más fácil disponible.

Lo primero que hice fue hacer el trabajo de investigación que a ellos les habría costado tiempo. Audité todas las plantillas existentes, documenté qué servicio mandaba qué correo, qué datos variables usaba cada template, cuál era el flujo de activación en SendGrid. Les llegué con un inventario, no con una solicitud de información.

Segundo, hice demos en lugar de escribir specs. Una spec técnica de "así debería verse el nuevo template" requiere que quien la lee se la imagine. Un demo en el servidor de preview de React Email es inmediato. Organicé sesiones cortas con cada equipo donde mostraba el template renderizado, explicaba las variables, y respondía preguntas en tiempo real. Tres reuniones de 45 minutos reemplazaron lo que habrían sido semanas de tickets de ida y vuelta.

Tercero, hice que la implementación fuera la parte más fácil. El repositorio de templates tenía estructura clara, documentación, scripts de build y un pipeline de CI/CD que subía automáticamente a SendGrid. El trabajo de cada equipo de backend se reducía a: cambiar el template ID que llamaban en su servicio. Nada más. La complejidad técnica quedaba encapsulada del lado del repositorio de templates, que era mi responsabilidad.

Cuarto, mantuve el estado visible para todos. Un documento compartido con la lista de templates, su estado (pendiente / en review / en producción) y el equipo responsable de cada uno. Sin herramienta especial, sin proceso formal. Solo un tracker que actualizaba después de cada conversación.

Lo que no hice fue escalar. Nunca fui a un director o a un VP a decir "los equipos de backend no están cooperando". En parte porque sería injusto — cooperaron bien. En parte porque escalar habría creado una dinámica de presión que habría dañado la relación de trabajo para los próximos meses.

---

## La decisión arquitectural que apareció en el camino

El scope original era: actualizar las plantillas existentes para que reflejaran la nueva identidad visual.

A medida que investigaba las plantillas embebidas en los servicios del monolito, quedó claro que actualizar el HTML inline disperso en varios repos era técnicamente costoso y operativamente frágil. Cada cambio futuro requeriría tocar múltiples repos. No había forma de hacer preview antes de deploy. Las versiones entre servicios iban a desincronizarse eventualmente.

La pregunta dejó de ser "¿cómo rebrandeamos los templates?" y se convirtió en "¿dónde deberían vivir los templates?".

La respuesta obvia era: en un repositorio dedicado, separado del monolito, con React Email como capa de authoring, versionado propio y un pipeline que subiera los HTML compilados a SendGrid. Los servicios de backend dejan de contener HTML y pasan a invocar un template ID. La presentación se desacopla de la lógica.

Eso no estaba en el scope original del rebrand.

Lo propuse de todas formas porque el esfuerzo incremental era pequeño en ese momento — estábamos reescribiendo todos los templates de cualquier forma — y el costo de no hacerlo era alto: íbamos a heredar el mismo problema de fragmentación en la próxima iteración.

La propuesta se aprobó. El repositorio existió. Las 72 plantillas terminaron ahí.

Un template en el repositorio nuevo se veía así:

```tsx
import { Html, Head, Body, Container, Text } from "@react-email/components";
import { Header } from "../../shared/components/header";
import { Footer } from "../../shared/components/footer";

interface PaymentConfirmationEmailProps {
  recipientName: string;
  amount: string;
  currency: string;
  transactionId: string;
}

export default function PaymentConfirmationEmail({
  recipientName,
  amount,
  currency,
  transactionId,
}: PaymentConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Header />
          <Text>Hola {recipientName}, tu pago fue procesado.</Text>
          <Text>{amount} {currency} — Ref: {transactionId}</Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
```

Versus el estado anterior: HTML inline con estilos hardcodeados en strings dentro de código de negocio, sin tipado, sin preview, sin testeo.

La diferencia no es solo visual. Es de mantenibilidad, de ownership y de capacidad de iterar.

---

## Lo que funcionó y lo que no

**Lo que funcionó:**

Los demos en lugar de docs fueron la decisión más acertada del proceso. Cuando mostraba el template renderizado en el preview server, la conversación se volvía inmediata y concreta. No había ambigüedad sobre "cómo va a quedar". Eso redujo los ciclos de revisión a casi nada.

Hacer el inventario primero fue lo que abrió las puertas. Llegar con información en lugar de preguntas cambia el tono de la conversación desde el primer momento. Los equipos de backend no tuvieron que pararme a explicarme el contexto — yo ya lo traía.

Reducir el trabajo de integración al mínimo fue clave para que los tres equipos pudieran moverse en paralelo sin depender de mí para cada paso. Cuando el camino está despejado, la gente avanza.

**Lo que no funcionó:**

Subestimé el tiempo de activación en SendGrid. El proceso de aprobar y activar un nuevo template ID en la plataforma tenía pasos manuales y tiempos de espera que no había contemplado. Eso generó bloqueos en el lado del backend que no dependían del código sino de un proceso externo.

Asumí que todos los equipos tenían el mismo nivel de urgencia que yo. No era así. Para los equipos de backend, esto era una tarea más entre muchas en su backlog. Tuve que aprender a ajustar mis expectativas y a no interpretar los tiempos lentos como falta de interés.

La coordinación async funcionó bien para el progreso, pero fue insuficiente para las decisiones ambiguas. Hubo al menos tres casos donde una conversación de 15 minutos habría resuelto algo que estuvo abierto en un documento por días. Aprendí a identificar más rápido cuándo una discusión necesita sincronía.

---

## Lo que aprendí

**"Sin documentación" es un problema diferente a "con mala documentación."** Cuando hay documentación mala, al menos hay un punto de partida para refutar, corregir o completar. Cuando no hay ninguna, el primer trabajo es crear el contexto desde cero — y eso toma tiempo y credibilidad que debes construir antes de poder avanzar. La ausencia de docs no es vacío neutral. Es deuda que alguien tiene que pagar con tiempo propio.

**Coordinar sin autoridad requiere que el costo de cooperar sea menor que el costo de no cooperar.** No es carisma. No es persuasión. Es diseño del proceso: si yo puedo hacer que tu trabajo sea más fácil colaborando conmigo que ignorándome, vas a colaborar. Eso significa absorber la complejidad del lado que controlo para reducirla del lado que no controlo.

**Los cambios arquitecturales dentro de proyectos de brand no son scope creep si resuelven el problema de raíz.** El scope original era rebrandear los templates. La decisión de mover los templates a un repo dedicado no diluyó ese objetivo — lo hizo sostenible. Un rebrand que deja la deuda técnica intacta es un rebrand que se va a necesitar repetir.

**El trabajo invisible tiene costo real.** Nadie me asignó este proyecto. No estaba en mi descripción de puesto. Lo asumí porque era el problema correcto a resolver en ese momento y yo tenía el contexto para liderarlo. Eso funcionó. Pero también significó semanas de trabajo que no estaban en ningún plan, que no generaron visibilidad hacia arriba, y que se sumaron a todo lo demás. La próxima vez, negociaré el scope antes de asumir el trabajo.

---

## Para cerrar

Este es el post de la serie con menos código. No hay configuraciones de Vite, no hay diffs de tokens, no hay diagramas de arquitectura. Lo hice así a propósito.

Un rebrand de design system no es solo un proyecto técnico. Es un proyecto de coordinación, de decisiones bajo incertidumbre, de trabajo que nadie documentó porque nadie lo había hecho antes. La parte técnica — los tokens, el tema, los componentes — fue difícil pero predecible. Esta parte, la de mover 72 templates dispersos entre tres equipos sin ningún mandato formal, fue la que me enseñó más.

Si hiciste un rebrand y crees que está completo, revisa tu bandeja de entrada. Revisa los correos que tus usuarios reciben. Revisa los documentos que tu sistema genera. Probablemente haya algo que todavía no actualizaste.

---

El siguiente y último post de la serie intenta responder la pregunta que subyace a todos los anteriores: ¿qué significa hacer el trabajo de tres roles al mismo tiempo con asistencia intensiva de AI — y qué aprendí sobre cuándo eso funciona y cuándo no?

