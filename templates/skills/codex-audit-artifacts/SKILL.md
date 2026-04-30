---
name: codex-audit-artifacts
description: Create durable plan, rationale, verification, handoff, or decision artifacts for complex Codex work. Use when work must be auditable, reviewable, delegated, or preserved outside chat.
---

# Audit artifact skill

Use this skill when a task needs durable artifacts rather than chat-only reasoning.

## Artifact families

Prefer separate artifacts when the work is complex enough that mixing them would blur review boundaries:

- **Plan/spec** — what will be done.
- **Rationale** — why these choices were made, including alternatives.
- **Evidence/verification log** — what was checked, commands run, source paths, and outcomes.
- **Decision record** — what was decided, by whom/what authority, and what remains open.
- **Handoff** — current state, risks, next steps, and integration status.

## Minimal templates

### Plan/spec

```markdown
# Plan: <title>

## Goal
## Non-goals
## Current observed state
## Proposed work
## Expected write set
## Verification plan
## Risks / open questions
## Status
```

### Rationale

```markdown
# Rationale: <title>

## Decision or design pressure
## Options considered
## Chosen path
## Why now
## Evidence and constraints
## Rejected/deferred alternatives
## Remaining uncertainty
```

### Verification log

```markdown
# Verification: <title>

## Commands run
| Command | Scope | Result | Notes |
|---|---|---|---|

## Source checks
## Runtime/materialized checks
## Not run / not verified
## Follow-up needed
```

### Handoff

```markdown
# Handoff: <title>

## Summary
## Files changed or artifacts created
## Decisions made or surfaced
## Verification status
## Known risks
## Next steps
```

## Rules

- Use repo-established artifact locations when available.
- Do not put audit-relevant artifacts only in `/tmp`.
- Keep private chain-of-thought out of artifacts. Record concise evidence, tradeoffs, and uncertainty instead.
- Label observations, inferences, proposals, and decisions distinctly.
- If something is intentionally not verified or not propagated, record that boundary.
