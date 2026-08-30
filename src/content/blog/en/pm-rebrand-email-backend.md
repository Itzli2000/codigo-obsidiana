---
title: "PM without a manual: coordinating an email rebrand across 3 backend teams without being their PM"
description: "When the frontend rolled out the new visual identity, the transactional emails still carried the old brand. This is the story of how I coordinated the backend rebrand — without being its PM, without prior documentation, and with three autonomous teams."
publishDate: "2026-06-17T06:00:00.000Z"
updated: null
tags: ["PM", "Cross-team", "Design System", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 8
image: "pm-no-manual.webp"
draft: false
---
The frontend was done. Tokens migrated, theme updated, components rebranded, CDN in production. Weeks of technical work that could be summarized in a screenshot: the platform now looked like the new brand.

Then someone opened their inbox.

The payment confirmation email they had just received had the old logo. The old colors. The old typography. The entire visual identity we had replaced was still intact in every transactional email the system sent to users.

Nobody had planned for this. Nobody had explicitly blocked it either. It was simply a blind spot in the rebrand scope: the frontend as visible product had consumed all the attention. The communications that the backend generated autonomously, in its own services, with its own templates embedded in the monolith, had stayed off the radar.

---

## The rebrand nobody had planned

When you do a design system rebrand there's a very natural temptation to think in interface terms: what the user sees on screen. Color tokens, typography, components. All of that lives in the frontend and the frontend controls it.

What doesn't live in the frontend are transactional emails. Or account statements. Or documents the system generates and sends. Those pieces are the backend's responsibility and, in our architecture, they were distributed across several services with their own logic.

The concrete result was this: the new platform coexisted with old-brand communications. A user completing a payment saw the interface in the new identity and received the receipt in the old identity. The inconsistency wasn't small or technical — it was visible and users noticed it.

There was no page about this in Confluence. There was no open ticket in the backlog. Nobody held formal ownership of the problem.

I was the Platform lead on frontend. The email rebrand wasn't my responsibility. I decided to take it on anyway.

---

## The situation: three teams, no manual

Before moving, I needed to understand the terrain. What I found was more fragmented than I expected.

The transactional emails were distributed across three backend teams, each operating in its own product domain. One team handled everything related to payments and transfers. Another was responsible for account activation and onboarding. The third controlled treasury processes and account statements.

Each team had its own templates, its own triggers, its own send logic. There was no centralized template repository and no shared standard. The templates lived embedded in the code of their respective services, mixed in with business logic.

The stack was SendGrid for delivery, Lambdas and microservices for triggers, and HTML templates written directly into each service's code. No presentation abstraction. No separation between logic and template.

The final template count, once we inventoried them, was 72 files across transactional emails and documents. In three main categories: authentication, payments, and wallets. Many with English and Spanish versions.

I had no authority over any of the three teams. I wasn't their PM. I wasn't in their reporting chain. The only reason they were going to listen to me was if what I brought made their work easier, not harder.

---

## How I coordinated without formal authority

The first decision was not to try to impose a process.

When you don't have authority, the bureaucratic process is the worst path: it generates resistance, makes people feel audited, and generally produces the opposite result of what you're looking for. What works instead is reducing friction until collaborating is the easiest option available.

The first thing I did was the investigation work that would have cost them time. I audited every existing template, documented which service sent which email, what variables each template used, what the activation flow in SendGrid looked like. I arrived with an inventory, not with a request for information.

Second, I did demos instead of writing specs. A technical spec for "this is how the new template should look" requires the reader to imagine it. A demo on the React Email preview server is immediate. I organized short sessions with each team where I showed the rendered template, explained the variables, and answered questions in real time. Three 45-minute meetings replaced what would have been weeks of back-and-forth tickets.

Third, I made the implementation the easiest part. The templates repository had a clear structure, documentation, build scripts, and a CI/CD pipeline that uploaded automatically to SendGrid. Each backend team's work was reduced to: change the template ID they called in their service. Nothing else. The technical complexity stayed encapsulated on the side of the templates repo, which was my responsibility.

Fourth, I kept the state visible to everyone. A shared document with the list of templates, their status (pending / in review / in production), and the team responsible for each one. No special tool, no formal process. Just a tracker I updated after every conversation.

What I didn't do was escalate. I never went to a director or VP to say "the backend teams aren't cooperating." Partly because it would have been unfair — they cooperated well. Partly because escalating would have created a pressure dynamic that would have damaged the working relationship for the months to come.

---

## The architectural decision that emerged along the way

The original scope was: update existing templates to reflect the new visual identity.

As I investigated the templates embedded in the monolith's services, it became clear that updating inline HTML scattered across several repos was technically expensive and operationally fragile. Every future change would require touching multiple repos. There was no way to preview before deploy. Versions across services would eventually drift.

The question stopped being "how do we rebrand the templates?" and became "where should the templates live?"

The obvious answer was: in a dedicated repository, separated from the monolith, with React Email as the authoring layer, its own versioning, and a pipeline that uploaded compiled HTML to SendGrid. Backend services stop containing HTML and start invoking a template ID. Presentation decouples from logic.

That wasn't in the original rebrand scope.

I proposed it anyway because the incremental effort was small at that moment — we were rewriting all the templates anyway — and the cost of not doing it was high: we were going to inherit the same fragmentation problem in the next iteration.

The proposal was approved. The repository existed. The 72 templates ended up there.

A template in the new repository looked like this:

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
          <Text>Hi {recipientName}, your payment was processed.</Text>
          <Text>{amount} {currency} — Ref: {transactionId}</Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
```

Versus the previous state: inline HTML with hardcoded styles in strings inside business code, no typing, no preview, no testing.

The difference isn't just visual. It's about maintainability, ownership, and the ability to iterate.

---

## What worked and what didn't

**What worked:**

The demos instead of docs were the most correct decision of the process. When I showed the rendered template on the preview server, the conversation became immediate and concrete. There was no ambiguity about "how it's going to look." That reduced review cycles to almost nothing.

Doing the inventory first was what opened the doors. Arriving with information instead of questions changes the tone of the conversation from the first moment. The backend teams didn't have to stop and explain the context to me — I already brought it with me.

Reducing the integration work to the minimum was key for the three teams to be able to move in parallel without depending on me for every step. When the path is clear, people advance.

**What didn't work:**

I underestimated the activation time in SendGrid. The process of approving and activating a new template ID in the platform had manual steps and waiting periods I hadn't considered. That generated blockers on the backend side that didn't depend on the code but on an external process.

I assumed all teams had the same level of urgency as me. They didn't. For the backend teams, this was one task among many in their backlog. I had to learn to adjust my expectations and not interpret slow turnarounds as a lack of interest.

Async coordination worked well for progress, but it was insufficient for ambiguous decisions. There were at least three cases where a 15-minute conversation would have resolved something that stayed open in a document for days. I learned to identify more quickly when a discussion needs to be synchronous.

---

## What I learned

**"No documentation" is a different problem from "bad documentation."** When there's bad documentation, at least there's a starting point to refute, correct, or complete. When there's none, the first job is to create the context from scratch — and that takes time and credibility you have to build before you can advance. The absence of docs isn't neutral emptiness. It's debt that somebody has to pay with their own time.

**Coordinating without authority requires the cost of cooperating to be lower than the cost of not cooperating.** It's not charisma. It's not persuasion. It's process design: if I can make your work easier by collaborating with me than by ignoring me, you're going to collaborate. That means absorbing the complexity on the side I control to reduce it on the side I don't control.

**Architectural changes inside brand projects aren't scope creep if they solve the problem at the root.** The original scope was to rebrand the templates. The decision to move the templates to a dedicated repo didn't dilute that goal — it made it sustainable. A rebrand that leaves the tech debt intact is a rebrand you're going to need to repeat.

**Invisible work has real cost.** Nobody assigned me this project. It wasn't in my job description. I took it on because it was the right problem to solve at that moment and I had the context to lead it. That worked. But it also meant weeks of work that weren't in any plan, that didn't generate upward visibility, and that piled on top of everything else. Next time, I'll negotiate the scope before taking on the work.

---

## To close

This is the post in the series with the least code. There are no Vite configurations, no token diffs, no architecture diagrams. I did that on purpose.

A design system rebrand isn't just a technical project. It's a project of coordination, of decisions under uncertainty, of work nobody documented because nobody had done it before. The technical part — the tokens, the theme, the components — was difficult but predictable. This part, moving 72 templates scattered across three teams with no formal mandate, was the one that taught me the most.

If you did a rebrand and think it's complete, check your inbox. Check the emails your users receive. Check the documents your system generates. There's probably something you haven't updated yet.

---

The next and last post in the series tries to answer the question that underlies all the previous ones: what does it mean to do the work of three roles at the same time with intensive AI assistance — and what did I learn about when that works and when it doesn't?

