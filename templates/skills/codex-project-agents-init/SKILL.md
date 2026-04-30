---
name: codex-project-agents-init
description: Initialize or revise project-level AGENTS.md files from an existing codebase, seed specs, or repo docs. Use when asked to create AGENTS.md, onboard Codex to a repo, turn seed artifacts into agent instructions, or audit project guidance.
---

# Project AGENTS.md initialization skill

Use this skill to create or revise project-level `AGENTS.md` files in a way that is evidence-backed and reviewable.

## Core rule

Do not copy a universal project template into a repository. Derive project guidance from actual project evidence, explicit user goals, and existing docs. Separate observed facts from inference and proposed doctrine.

## Workflow

### 1. Locate instruction surfaces

Inspect, as available:

- root `AGENTS.md`, nested `AGENTS.md`, `CLAUDE.md`, `.github/instructions/*`, contributor docs, ADRs, planning docs;
- setup/build/test/lint scripts;
- package manifests and lockfiles;
- CI config;
- repo-specific tools and generated-output contracts;
- existing artifact directories such as `docs/`, `.research/`, `.handoffs/`, `.codex/`, `.agents/`, `audit/`, `plans/`, or project-specific equivalents.

### 2. Create an onboarding observations artifact

Create a durable artifact before drafting new doctrine. Preferred locations:

1. repo-established onboarding/audit location, if one exists;
2. `docs/agent-onboarding/observations.md` if `docs/` exists;
3. `.agent-artifacts/onboarding/observations.md` otherwise.

The artifact must contain:

- observed repo facts with file paths;
- inferred conventions, labeled `[inference]`;
- open questions;
- likely setup and verification commands;
- likely protected seams and contract-carrying surfaces;
- candidate artifact locations;
- risks or contradictions.

### 3. Draft project AGENTS.md as a proposal

If `AGENTS.md` already exists, draft a patch or candidate file rather than overwriting. If it does not exist, draft a root `AGENTS.md` candidate.

Every project-specific instruction should be one of:

- directly supported by observed files or commands;
- an explicit user instruction;
- labeled as `[proposal]` or `[inference]`.

Use this structure unless the repo suggests a better one:

```markdown
# AGENTS.md

## Project mission
## Source-of-truth map
## Setup and commands
## Working rules
## Architecture and protected seams
## Decision boundaries
## Auditability and artifacts
## Delegation rules
## Commit hygiene
## Known failure modes
## Verification
## References
```

### 4. Decide whether nested AGENTS.md files are needed

Create nested `AGENTS.md` candidates only when a subdirectory has genuinely distinct rules, such as a different language/runtime, generated-output contract, security boundary, or release process.

Do not fragment guidance merely for neatness.

### 5. Review before integration

Before writing or updating the actual project `AGENTS.md`, run a review pass:

- unsupported claims;
- vague rules;
- rules that belong in a skill instead;
- project-specific rules accidentally phrased as universal;
- missing verification commands;
- missing decision boundaries;
- duplicated or conflicting instructions;
- likely context bloat.

Surface the write set and ask for approval when the change is broad, doctrine-bearing, or overwrites an existing instruction file.

## Delegation option

If the user explicitly asks for delegation, or invokes a workflow whose contract requires subagents, split bounded read-heavy tasks across subagents. Useful tasks:

- one subagent maps setup/build/test commands;
- one maps architecture and protected seams;
- one maps docs/ADRs/planning artifacts;
- one reviews the draft for unsupported claims.

Require each subagent to write its full result to an artifact path and return only status, artifact path, key findings, verification performed, and open questions.

## Final response shape

Return:

- observations artifact path;
- draft/candidate path or patch summary;
- recommended write set;
- verification performed;
- questions needing user or maintainer decision;
- whether nested `AGENTS.md` files are recommended.
