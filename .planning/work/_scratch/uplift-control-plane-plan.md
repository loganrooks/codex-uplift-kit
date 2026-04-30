# Temporary Plan: Uplift Control Plane

Status: scratch
Authority: working note only
Lifecycle: delete or replace after current control-plane docs exist
Created: 2026-04-30

## Purpose

Preserve planning continuity across compactions while `codex-uplift-kit` is reorganized to dogfood the project-uplift system it is becoming.

This file is not a durable source of truth. When `.planning/current/ACTIVE_WORK.md`, `.planning/current/ROADMAP.md`, and governance docs exist, migrate any still-useful content there and delete this scratch file.

## Goal

Uplift this repo so it becomes the first real example of the product vision: a Codex project-uplift system that helps solo developers plus AI agents manage projects from small audits through long-horizon products.

The repo should support:

- initialization and onboarding for new projects;
- installation of useful Codex assets without confusing staging paths;
- active development workflows with clear roles, artifacts, and gates;
- progressive complexity for projects that grow from quick tasks to larger products;
- dogfooding before productizing CLI behavior.

## Non-Goals

- Do not design or implement every future domain pack now.
- Do not make plugins the core abstraction yet.
- Do not silently mutate live user config.
- Do not turn this into a heavy planning framework for every small task.
- Do not archive or move large doc sets before current docs can route future agents.

## Phase 0: Codex Operating Environment Baseline

Goal: ensure the agent environment itself is strong before using it to reorganize the project.

Check and improve:

1. User-level `AGENTS.md`
   - Portable working agreements across repos.
   - Should include precedence, epistemic discipline, no destructive/revert behavior, verification, commit hygiene, delegation contracts, and concise final response expectations.
   - Should not include codex-uplift-specific roadmap or stale project facts.

2. Project-level `AGENTS.md`
   - Repo-specific boot path and safety rules.
   - Should route agents to `.planning/README.md`, current state, active work, and governance.
   - Should include local commands, safety invariants, and release/manual gates.
   - Should not duplicate the entire user-level working agreement.

3. Auto-compaction prompt
   - Auto-compaction itself is Codex behavior.
   - This project needs a custom prompt for preserving current objective, newest user instruction, branch/commit state, active work, changed files, verification, decisions, open questions, delegated work, safety gates, and next actions.
   - The prompt should avoid raw logs, superseded plans, stale alternatives, hidden chain-of-thought, and treating archive docs as current.
   - Installing prompt files is safe; selecting one in active config is a separate explicit user-approved action.

## Phase 1: Establish Current Truth

Create the small read-first surface:

```text
.planning/
  README.md
  current/
    STATE.md
    VISION.md
    ROADMAP.md
    ACTIVE_WORK.md
    RELEASE.md
```

Purpose:

- `STATE.md`: what is true now.
- `VISION.md`: long-term product thesis.
- `ROADMAP.md`: next versions and longer horizon.
- `ACTIVE_WORK.md`: current slice only.
- `RELEASE.md`: next release gates and manual boundaries.

First make current truth obvious. Do not archive or move old docs yet.

## Phase 2: Split Governance

Create focused governance docs:

```text
.planning/governance/
  README.md
  artifact-lifecycle.md
  agent-workflow.md
  decision-records.md
  role-contracts.md
  workflow-gates.md
  release-policy.md
  dogfooding-policy.md
```

Core rules to encode:

- current docs are authoritative;
- work docs are temporary unless promoted;
- release evidence freezes after shipment;
- old plans are archive evidence, not active instruction;
- active config, live installs, publish, tag, and push require explicit approval unless already requested;
- every role has reads, writes, forbidden decisions, output shape, and gates.

## Phase 3: Define Progressive Complexity

Projects should gain process only when they need it.

Draft levels:

```text
Level 0: quick task
Level 1: bounded audit/research
Level 2: small software change
Level 3: MVP/product slice
Level 4: long-horizon product
Level 5: ecosystem/platform
```

The base system should require a closure target, not always a roadmap. Closure targets may include release, report, demo, prototype, pitch, migration, audit, or decision memo.

## Phase 4: Define Packs, Not Plugins Yet

Use `pack` as the internal abstraction. Treat plugin packaging as a later distribution format.

Initial pack candidates:

```text
base-control-plane
agent-tooling
npm-package
open-source-alpha
research-audit
```

Dogfood this repo with:

```text
base-control-plane
agent-tooling
npm-package
open-source-alpha
```

Fully specify `base-control-plane` first. Keep domain packs as roadmap stubs until the kernel works.

## Phase 5: Archive Carefully

After current docs exist, move old material into archive buckets:

```text
.planning/archive/
  releases/v0.2.0-alpha.0/
  initiatives/codex-uplift-current-design-suite/
  investigations/
  recovery/
```

Do not rewrite history. Add archive README files that explain:

- what the archive contains;
- what superseded it;
- whether anything remains relevant.

Keep `.codex-uplift/` as active evidence temporarily or migrate it deliberately under `.planning/work/` and `.planning/archive/` after current docs can route future agents.

## Phase 6: Update Agent Entry Points

Root/project `AGENTS.md` should route, not become a policy dump.

Substantive work boot path should become:

1. Read `.planning/README.md`.
2. Read `.planning/current/STATE.md`.
3. Read `.planning/current/ACTIVE_WORK.md`.
4. Follow `.planning/governance/agent-workflow.md`.
5. Treat archive as evidence, not current instruction.

## Phase 7: Productize After Dogfooding

Once the repo structure works manually, implement the smallest CLI checks:

```bash
codex-uplift-init governance init
codex-uplift-init artifact check
codex-uplift-init project inspect
codex-uplift-init archive sweep --dry-run
```

Do not implement the full pack ecosystem yet. Make the base control plane reproducible and checkable first.

## First Implementation Slice

Recommended first durable slice:

1. Create `.planning/README.md`.
2. Create `.planning/current/{STATE,VISION,ROADMAP,ACTIVE_WORK,RELEASE}.md`.
3. Create `.planning/governance/README.md` and `.planning/governance/artifact-lifecycle.md`.
4. Update project `AGENTS.md` routing.
5. Do not archive or move old docs yet.
6. Run `git diff --check`.
7. Commit as `docs(planning): establish uplift control plane`.

## Pushbacks To Preserve

- Do not build domain packs before the base operating model is clean.
- Do not make plugin packaging the product model.
- Do not silently modify active config.
- Do not use `candidate` as a vague bucket for every generated thing.
- Do not make every project use a roadmap.
- Do not overfit the product to GSD.
- Do not ship a large role taxonomy before role contracts.
- Do not treat docs organization as cosmetic.
