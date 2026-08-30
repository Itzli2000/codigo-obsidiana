---
title: "PM + PO + dev at the same time: what I learned doing a 4-week rebrand with intensive AI assistance"
description: "4 weeks, 3 simultaneous roles, 1 dev + AI. This is the post that closes the design system rebrand series: an honest retrospective on when AI elevates the work and when it simply can't."
publishDate: "2026-06-17T06:00:00.000Z"
updated: null
tags: ["AI", "Architecture", "Methodology", "Rebrand 2026"]
author: "Ariel Molina"
readingTime: 10
image: "multi-rol-ai.webp"
draft: false
---
"Intensive AI assistance" is a phrase that can mean anything. It can mean someone used ChatGPT to autocomplete comments in the code. It can mean a team of ten people delegated documentation to the assistant. In this case it means something more specific: one person, four weeks, three simultaneous roles, and an AI system as a constant interlocutor for analysis, writing, architecture, and code.

This post closes the series. It's not a recap of the previous six — it's a retrospective on the method itself. What worked, what didn't, and what I learned about how the work happens when AI is a structural part of the process and not an accessory.

The honest conclusion: AI amplified work capacity along some dimensions significantly. Along others, it was no help at all. The difference between those dimensions is the interesting part.

---

## The three roles and how they coexisted

The Phase 0 rebrand required three modes of work that normally live in different people.

**As a frontend developer:** I implemented the token migration (documented in "Migrating 95 tokens in a rebrand"), updated the full MUI theme, set up the CDN infrastructure with 76 assets, restyled the component library, and coordinated the migration of four repositories to the v2.0.0 packages. The result in numbers: 3 packages published in major version, 274 commits in the main frontend repo, and a CDN pipeline running in production.

**As ad hoc frontend PM/PO:** I consolidated the results of six audits into a single implementation roadmap (see "Audit before architecture: how 6 parallel investigations shaped a 10-month roadmap"), wrote the Phase 0 PRD, planned the breaking changes across versions, and coordinated the release of the three packages synchronously across four repositories.

**As de facto backend PM/PO:** without a formal mandate and without prior documentation, I coordinated the rebrand of transactional emails and product documents with three backend teams. I had no direct authority over any of them. I also didn't have time to build it the usual way.

The problem with having three simultaneous roles isn't the volume of work — it's the cognitive mode switch. The developer needs focus, precise technical context, and uninterrupted time. The PM needs to keep the full map of the project, anticipate blockers, and manage dependencies. The PO coordinating across teams needs to read the room, adapt the message, and operate in real time. Each mode has its own rhythm and its own attentional demands.

AI helped create that separation in a way I didn't expect.

---

## Where AI did work

### Analysis and synthesis of audits

The accessibility audit (see "The accessibility audit that changed the architecture: 67.6% failures as the argument for Tier 2") produced raw data: 71 Storybook stories failing WCAG AA, distributed across specific axe-core rules. Turning that into a structured argument for including Tier 2 in the roadmap — with severity, root cause, and architectural recommendation — was a process AI facilitated directly.

Not because it "wrote the report" autonomously. But because it works well as an analytical interlocutor: it takes unstructured data, identifies patterns, and produces synthesis with the right structure for a technical document. With the token audit (95 primitives without a semantic layer), with the component gap map, with the migration map — in every case the cycle was the same: I brought the raw findings, AI helped structure them into documents other teams could read and act on.

The result is the five audit documents, the architectural ADR, and the Phase 0 PRD. All of them exist before a single line of implementation code was written. That isn't accidental — it's the discipline AI made sustainable.

### Code generation in well-bounded tasks

The Style Dictionary v4 configuration to generate tokens in multiple formats (CSS custom properties, TypeScript, JSON) is a concrete example. The problem was well-defined: 61 new tokens, three output platforms, compatibility with the existing import schema.

```ts
// Fragment of the custom transform — generated with AI, reviewed and adjusted
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

The AI generated the base structure. I identified that the segment behavior wasn't correct for paths with more than three levels and fixed it. That cycle — rapid generation plus review with domain context — is where the collaboration works.

The same applies to migration scripts: TypeScript import transformations, reference searches across four repositories, Vite configuration updates. Tasks with clear patterns, well-defined inputs and outputs.

### Exploration of architectural options

For the multi-brand decision (how to support brand personalization in the future), AI was useful for generating the ADR candidates before starting to evaluate them. Not because its proposals were the right ones — some weren't — but because producing a wide set of options with preliminary trade-offs accelerated the analysis phase.

```
Options evaluated in the ADR:
A. CSS custom properties on Tier 2 (runtime override)  ← chosen
B. Parallel MUI themes (compile-time)
C. React context per brand (runtime, no CSS)
D. Build-time token compilation per brand
```

The final decision required judgment about the reality of the project: build complexity, team capacity, and how soon the real multi-brand use case would arrive. That doesn't come from AI. But reaching that decision faster because there was already a structured analysis of the options — that does.

### Keeping the thread in complex contexts

Four weeks with multiple roles and multiple repositories generate a lot of dispersed context. Having an interlocutor that can hold the project map — remember what decision was made in the token audit and why, what the Tier 1 constraint was for Phase 0, what dependencies the package release had — reduced the cognitive load of keeping all of that in my head.

It works better when there are explicit memory systems. In this project, that meant reference documents passed into the context at every relevant session. Without that discipline, AI restarts without prior information and the advantage disappears.

---

## Where AI didn't work

### Reading the room with external teams

Coordination with the three backend teams was the hardest work of the project. Not for technical complexity — the rebrand of emails and documents wasn't a systems engineering problem. It was a problem of adoption, prioritization, and relationships.

One team needed a demo before committing to any change. Another team had its own deadline that made any change request before that date an implicit no. The third needed the request to come through the right channel, from the right person, with the right level of formality.

None of that can be inferred from text analysis. AI can help draft the message once you know what you need to say and to whom. It can't tell you which of the three teams to unblock first when the answer depends on who's in good disposition this week.

### Prioritization decisions under political pressure

"What do we do first: block the frontend release until the emails are updated, or launch with temporary brand inconsistency?" It's not a technical question. It's a question about risk appetite, about who has the authority to decide, about what promises were made and to whom.

AI produces excellent trade-off analyses when the criteria are defined. When the criteria are implicit and loaded with organizational context, the analysis loses relevance. Not because the reasoning is bad — it's formally correct. But because the factors that actually matter aren't in the prompt.

### Design decisions that require brand judgment

The values of the new typography tokens aren't only a technical decision. `font-size: 14px` vs `font-size: 13px` for the secondary body text looks like a trivial difference. In the context of a new brand identity, with a specific grid system and a typography family with particular spacing characteristics, it's a decision that requires seeing the result on screen, in context, with real information density.

AI can generate a technically correct type scale. It can't tell you whether it feels right. That part required visual iteration with the design tool, and no prompt replaces it.

### Long context with multiple files

This was the clearest technical limit of the process. In refactors that involved coordinated changes across multiple files of the component library repo — updating imports, renaming tokens, adjusting theme props — the quality of the responses degraded after a certain number of turns.

The pattern was predictable: AI made an incorrect assumption at turn 8 (for example, assuming a token was named one way when in the turn 3 context it had been established the name was different). That assumption silently traveled to turns 9, 10, 11. The resulting code was syntactically valid and passed the type-checker, but had semantic inconsistencies that only showed up at runtime.

The fix was to split big refactors into shorter sessions with explicit context at the start of each one. It worked, but it required more orchestration overhead than a well-planned refactor with two human developers.

---

## The T-shirt sizing question with AI

Before starting the project, the estimates assumed one developer's capacity. The question that follows is inevitable: does the "1 dev + AI" model equal "2 devs"?

The short answer is no. The full answer is more useful.

AI increased throughput in real terms in three specific categories:

- **Documentation:** the five audits, the ADR, the PRD, and the consolidated roadmap probably would have taken twice as long without AI assistance. That's not speculation — I can compare against my historical speed on similar documents.
- **Code generation with clear patterns:** the migration scripts, the Style Dictionary configuration, the initial test structure. The proportion was roughly 60% generated + 40% reviewed/adjusted.
- **Option analysis:** the speed of reaching a reasoned architectural decision was significantly higher when there was an interlocutor that could lay out the option space quickly.

But a second human developer does things AI doesn't:

A second developer detects when a decision doesn't fit the business model. They say "this technically works but the payments team won't accept it because of X." That requires organizational context that doesn't live in any document.

A second developer maintains context across sessions without needing explicit memory systems. The continuity of thought about the project doesn't have to be re-established every time.

A second developer stops you when you're going down a wrong path. Not because they generate an analysis of why it's a wrong path — but because they have the experience of having seen that same path end badly in another project.

AI compiles errors silently and hands them to you wrapped in clean code. That's the most important difference.

For future sizing, my rough estimate is: "1 dev + intensive AI" in documentation/analysis/code with patterns equals something between 1.4 and 1.6 devs in those specific categories. In coordination with teams, political decisions, and design work with brand judgment: the multiplier is 1.0. AI doesn't add there.

---

## The series as evidence: the 7 posts wouldn't exist without the discipline of documenting

There's something concrete I want to point out about this series.

The six previous posts — the token audit, the accessibility audit (see "The accessibility audit that changed the architecture"), the multi-brand analysis, the CDN strategy, the breaking-change migration (see "274 commits, 50+ PRs: coordinating breaking changes across four repositories"), and the architectural analysis of the rebrand — exist because during the project there was a discipline of producing structured documents as intermediate deliverables, not just as internal artifacts.

That discipline was possible in part because AI reduced the friction of writing a well-structured document to the point where producing it during the project didn't require taking time away from implementation. The accessibility audit was documented while the audit was happening. The ADR was written while the decision was being made. The roadmap was written while the results were being analyzed.

When it came time to write these posts, the work wasn't to remember what happened. It was to edit and recontextualize what was already documented. That's the other side of the intensive AI model: if AI helps you document while you work, the cost of producing the retrospective afterwards collapses.

The posts wouldn't have existed if the project had been only code and commits. They exist because documentation was a structural part of the process from the beginning.

---

## What I would do differently

**I would set up the memory systems before starting.** In this project, managing context across sessions was improvised. It worked, but with overhead. A well-defined set of reference documents at the start — what decisions have been made, what the non-negotiable constraints are, what the current state of each area is — significantly reduces the energy spent re-establishing context.

**I would separate "PM" and "dev" sessions more explicitly.** The most effective working mode was when there were time blocks dedicated to a single role. When the modes blended — "let's implement this and along the way make the architecture decision" — the quality of both dropped. AI can hold the context for each role, but it can't do so simultaneously in a clean way.

**I would define the AI's limits before each task, not after.** On several occasions I spent more time fixing code generated with the wrong context than if I had written the implementation directly. The cause was predictable in retrospect: tasks where the requirements were implicit or depended on business decisions that weren't in the context. Before delegating an implementation task to AI, I now ask myself: are all the requirements explicit and verifiable in the prompt? If the answer is no, I write the code directly.

**I would treat coordination with external teams as an independent work block.** Not because AI can't help with the artifacts (a well-written email, a deck with the right points) — it can. But because that coordination requires real presence and the ability to respond in real time. It's the work that suffers most when time is shared with two other functions.

---

## Conclusion

Four weeks. Three roles. One dev and an AI system that worked as an analysis interlocutor, document co-author, and code generator within well-defined scopes.

What worked: audits, synthesis, structured documentation, code with clear patterns, exploration of architectural options. What didn't work: reading the room, decisions under political pressure, brand design judgment, and long refactors with multiple files.

The model isn't blindly scalable. It requires knowing which tasks AI amplifies and which require human presence with no substitute. Knowing that difference — and organizing around it — is the skill I learned in these four weeks.

What comes next is Phase 1: implementing semantic Tier 2, building the multi-brand layer on top of CSS custom properties, and establishing the correct separation between primitive, semantic, and component tokens. It's the work that this series of audits and decisions made possible.

If you followed the seven posts from the first one: thank you. This was a long series about a project that had more complexity than expected, and documenting it honestly was part of the process. Phase 1 will have its own series when the time comes.

---

*This is the last installment of the "rebrand-design-system-2026" series. The six previous posts cover the audits, the architectural decisions, the CDN strategy, and the technical coordination of the full rebrand.*

