# Temporary Vision Notes: Codex Uplift Long Horizon

Status: scratch
Authority: working note only
Lifecycle: mine for `.planning/current/VISION.md`, `.planning/current/ROADMAP.md`, pack specs, and governance docs; then delete or archive intentionally
Created: 2026-04-30

## Purpose

Preserve the product-level deliberation behind `codex-uplift-kit` before compaction. This is not a polished vision document. It is a seed bank for the durable control-plane artifacts we still need to write.

Use this when drafting:

- current product vision;
- medium-term and long-term roadmap;
- base control-plane pack;
- agent workflow and role-contract governance;
- pack/plugin architecture;
- project classifier and progressive-complexity model.

## Working Vision

`codex-uplift-kit` should become a Codex project-uplift system: a way for solo developers plus AI agents to initialize, understand, organize, and evolve projects with a disciplined operating model.

It should not merely install files. It should help create a project environment where agents can:

- understand what the project is and what it is trying to become;
- distinguish current truth from historical evidence;
- select an appropriate workflow for the project type and maturity;
- use bounded roles and durable artifacts instead of improvised context;
- keep safety, verification, release, and handoff gates explicit;
- scale process only when the project complexity requires it.

The product should support both small, bounded work and long-horizon product development. A quick research audit should not inherit a heavyweight roadmap. A complex investor-MVP or game/product vision should be able to start lean and gain structure as it matures.

## Product Thesis

The universal part of uplift is not the domain answer. It is the development operating system around the project.

Universal or quasi-universal:

- project orientation;
- current state;
- active work;
- artifact lifecycle;
- decision records;
- role contracts;
- verification gates;
- handoff;
- closure targets;
- archive policy;
- safe install and config boundaries.

Project-specific and adaptive:

- domain model;
- product vision;
- target user;
- business model;
- MVP definition;
- research method;
- game loop;
- monetization;
- release strategy;
- evaluation criteria;
- what “good” means for this project.

The CLI should make deterministic structure reproducible. Agents should interpret evidence and draft project-specific candidates. The user should make product and risk decisions.

## Mission vs Vision

`mission` sounds like an operating commitment. `vision` better fits this repo’s long-horizon product direction.

Candidate phrasing:

> Codex Uplift helps a solo developer and AI agents work like a coherent, disciplined project team by installing useful Codex assets, organizing current project truth, selecting right-sized workflows, and enforcing artifact-driven guardrails from first audit through long-horizon product development.

Keep future durable docs clear about the distinction:

- `VISION.md`: where the product is going and why it matters.
- `ROADMAP.md`: staged path toward that vision.
- `ACTIVE_WORK.md`: current slice only.
- `governance/*`: how agents behave and how artifacts gain or lose authority.

## Progressive Complexity Model

Projects should not all receive the same weight of process.

Draft levels:

```text
Level 0: quick task
  Minimal context, no durable control plane unless risk demands it.

Level 1: bounded audit/research
  Objective, source map, evidence ledger, findings, recommendation audit, closure report.

Level 2: small software change
  Current state, active work, write set, verification gate, handoff if unfinished.

Level 3: MVP/product slice
  Vision excerpt, roadmap slice, acceptance criteria, product risks, release/demo closure.

Level 4: long-horizon product
  Durable vision, roadmap, governance, active work packages, archive, release policy, role contracts.

Level 5: ecosystem/platform
  Multiple packs/plugins, compatibility policy, contributor governance, package/release automation, domain-specific playbooks.
```

Important principle: require a closure target, not always a roadmap.

Possible closure targets:

- release;
- report;
- demo;
- prototype;
- pitch;
- migration;
- audit;
- decision memo;
- playtest build;
- investor MVP.

## Kernel, Packs, Plugins

Do not start with plugins as the core abstraction.

Better model:

```text
kernel
  base project control plane and deterministic checks

pack
  local bundle of roles, workflows, artifacts, prompts, and gates

plugin
  later distribution mechanism for stable packs
```

The product model should be control plane + packs + checks + agent workflows. Plugins can distribute packs later, but should not drive the architecture prematurely.

## Base Control Plane

The base kernel should provide the structure that almost every serious project benefits from:

```text
.planning/
  README.md
  current/
    STATE.md
    VISION.md
    ROADMAP.md
    ACTIVE_WORK.md
    RELEASE.md
  governance/
    README.md
    artifact-lifecycle.md
    agent-workflow.md
    decision-records.md
    role-contracts.md
    workflow-gates.md
    release-policy.md
    dogfooding-policy.md
  work/
  archive/
```

But this full surface should be scaled to project complexity. The base pack can install a minimal surface first, then recommend more structure when the project matures.

## Initial Pack Candidates

First-class near-term:

```text
base-control-plane
agent-tooling
npm-package
open-source-alpha
research-audit
```

Later:

```text
mcp-server
saas
game
social-app
investor-mvp
research-platform
```

For this repo, dogfood:

```text
base-control-plane
agent-tooling
npm-package
open-source-alpha
```

Do not implement all of these in v0.3. Define the base model first. Use `agent-tooling` as the first dogfooded specialization. Keep `research-audit` as the second proving ground because it tests a non-release closure target.

## Role Model

Do not ship a large role taxonomy before role contracts.

Base roles should be few and well-defined:

- evidence explorer;
- artifact writer;
- artifact reviewer;
- decision recorder;
- verification checker;
- handoff keeper.

Planning roles:

- roadmapper;
- planner;
- slicer;
- risk mapper;
- scope critic.

Closure roles should be project-type specific:

- software release checker;
- evidence/report checker;
- demo-readiness checker;
- playtest/build checker;
- pitch-readiness checker.

Universal concept: closure checker.

Specialized implementations depend on project type and closure target.

## Role Contracts

Every role should eventually specify:

- when to use it;
- required inputs;
- allowed reads;
- allowed writes;
- forbidden decisions;
- output artifact path;
- return shape;
- verification responsibility;
- review/disposition gate.

Example distinction:

- `evidence-explorer` may observe and report, but not decide product direction.
- `roadmapper` may propose milestones, but not start implementation.
- `planner` may define a slice, but must include scope, write set, verification, and stop conditions.
- `implementer` may edit assigned files only and must run named checks.
- `closure-checker` validates that the closure target is met.

## Workflow Graph

The operating model should be a role/workflow/artifact/gate graph.

Primitives:

```text
Role
  bounded agent/persona with a job

Workflow
  repeatable sequence using one or more roles

Artifact
  durable output with lifecycle status

Gate
  condition that must pass before moving forward
```

Generic lifecycle:

```text
Orientation
  evidence-explorer -> STATE.md

Direction
  roadmapper -> ROADMAP.md

Slice
  planner/slicer -> ACTIVE_WORK.md

Execution
  implementer/researcher/designer -> changed assets

Review
  artifact-reviewer/code-reviewer/claim-verifier -> REVIEW.md

Closure
  release-checker/evidence-package-reviewer/demo-checker -> closure report

Handoff
  handoff-keeper -> HANDOFF.md or updated STATE.md

Archive
  archive-sweep -> completed work archived with summary
```

Project type swaps the middle and closure roles.

Research audit example:

```text
evidence-explorer -> source-mapper -> claim-verifier -> findings-synthesizer -> evidence-package-reviewer
```

Game prototype example:

```text
game-loop-designer -> prototype-slicer -> implementer -> playtest-planner -> feel-reviewer -> playable-build-checker
```

SaaS example:

```text
workflow-mapper -> planner -> implementer -> permissions-reviewer -> ops-readiness-checker -> release-checker
```

## Domain Examples To Preserve

Audit-only research project:

- Needs objective, source map, evidence ledger, findings, recommendations, open questions.
- Does not necessarily need a product roadmap or release plan.
- Closure target is a report/evidence package.

MCP server:

- Needs protocol contract, tool schemas, auth boundaries, integration fixtures, SDK docs, release checks.
- Closure target may be package release or integration readiness.

Game:

- Needs game loop, feel, playable prototype, playtest gates, performance, clipability/viral hook.
- Closure target may be playable build or viral prototype, not stable software release.

SaaS:

- Needs workflows, permissions, onboarding, billing, ops readiness, support, metrics.
- Closure target is product release or customer workflow readiness.

Social app:

- Needs network effects, moderation, privacy, abuse cases, growth loops, monetization.
- Closure target may be MVP wedge or controlled beta.

Research/PDF platform:

- Needs ingestion architecture, retrieval evals, note taxonomy, knowledge graph strategy, investor-demo MVP.
- Closure target may be credible demo/pitch, not full platform.

Complex long-term game or product with immediate viral goal:

- Must split dream vision from immediate shareable slice.
- Needs a transition plan from viral MVP to maturing product.

## CLI Role

CLI should own deterministic checks and repeatable materialization:

```bash
codex-uplift-init governance init
codex-uplift-init project inspect
codex-uplift-init project classify
codex-uplift-init artifact check
codex-uplift-init gate check
codex-uplift-init phase start --dry-run
codex-uplift-init archive sweep --dry-run
codex-uplift-init pack list
codex-uplift-init pack recommend
```

Agents should own interpretation:

- classify project type from evidence;
- draft vision/roadmap candidates;
- synthesize findings;
- recommend packs;
- judge whether a plan matches the user goal.

User owns decisions:

- product direction;
- risk acceptance;
- live config changes;
- publishing;
- tags;
- release approval;
- which pack recommendations to accept.

## Dogfooding Path

This repo should become the first proof.

Sequence:

```text
manual pattern -> dogfood -> stabilize convention -> implement CLI -> test
```

Do not implement CLI behavior before manually proving the workflow in this repo.

First durable foundation:

1. Establish current docs.
2. Establish governance docs.
3. Update project `AGENTS.md` routing.
4. Preserve or install a good user-level `AGENTS.md`.
5. Install/select a good auto-compaction prompt only with explicit approval for active config.
6. Keep old docs available but demote them from current authority.
7. Then implement checks that validate the structure.

## Medium Horizon

After initial project uplift:

- implement `artifact check`;
- implement `governance init`;
- implement `project inspect` with structured observations;
- implement `pack` manifest schema;
- implement `pack recommend --dry-run`;
- define base-control-plane pack;
- dogfood agent-tooling pack;
- cleanly archive v0.2 planning sprawl;
- create v0.3 release plan.

## Long Horizon

Longer-term product:

- adaptive project classifier;
- progressive complexity recommendations;
- pack ecosystem;
- stable role contracts;
- workflow graph validation;
- project-specific generated candidates;
- config merge assistant;
- live Codex plugin/config probes;
- compaction prompt evaluation harness;
- research-audit pack;
- MCP-server pack;
- SaaS/game/research-platform/investor-MVP packs;
- optional plugin distribution for stable packs.

The long-term ambition is not to make one giant universal template. It is to make Codex able to help a solo developer assemble the right project operating system for the work in front of them.

## Pushbacks To Preserve

- Do not build domain packs before the base operating model is clean.
- Do not make plugin packaging the product model.
- Do not silently modify active config.
- Do not use `candidate` as a vague bucket for every generated thing.
- Do not make every project use a roadmap.
- Do not overfit this to GSD.
- Do not ship role taxonomy before role contracts.
- Do not treat docs cleanup as cosmetic.
- Do not rush another release until product language is corrected.
