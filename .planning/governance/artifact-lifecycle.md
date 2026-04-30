# Artifact Lifecycle

Status: current
Last updated: 2026-04-30

## Purpose

This repo has accumulated useful but overlapping planning artifacts. This
document defines how to tell what is current, what is evidence, and what should
be removed or archived.

## Lifecycle States

### Current

Current artifacts define present truth and should be read first.

Examples:

- `.planning/README.md`
- `.planning/current/*`
- `.planning/governance/*`
- project `AGENTS.md`

Update current artifacts when project truth changes. Do not leave known-stale
claims in current docs.

### Active Work

Active work artifacts support the current slice. They may be detailed and
temporary, but they should not contradict current docs.

Examples:

- `.planning/current/ACTIVE_WORK.md`
- future work packages under `.planning/work/`

When the slice ends, promote durable decisions/results to current docs or archive
the work package.

### Scratch

Scratch artifacts preserve continuity during exploration, compaction, or
temporary planning. They are not authority.

Examples:

- `.planning/work/_scratch/*`

Scratch docs should have a lifecycle note. Delete them once their useful content
has been promoted, or archive them if they remain useful as deliberation
evidence.

### Evidence

Evidence artifacts record what was tested, observed, reviewed, or decided at a
point in time. They may remain valuable without being current instruction.

Examples:

- `.codex-uplift/*`
- release feedback
- validation logs
- local install investigations

Current docs may cite evidence artifacts, but evidence artifacts should not
silently override current docs.

### Archive

Archive artifacts are historical. They may explain why the project got here, but
they are not default instructions.

Examples:

- old initiative suites;
- completed release plans;
- recovery packages;
- superseded deliberation bundles.

Archive moves should preserve context with a short README or note explaining
what superseded the archived material.

## Promotion Rules

Promote scratch or evidence into current docs when it changes:

- product direction;
- roadmap order;
- release gates;
- safety boundaries;
- workflow contracts;
- artifact authority;
- installer behavior or user-facing semantics.

Do not promote raw chat summaries, stale alternatives, or unverified platform
claims as current truth.

## Cleanup Rules

Before deleting or archiving an artifact, check whether it contains:

- an unresolved decision;
- a release fact;
- a verified test result;
- a platform unknown;
- a user preference;
- a product pushback that guards against scope drift.

If yes, promote the durable point first. Then delete or archive the original
artifact intentionally.

## Current Cleanup Boundary

The first control-plane slice does not move historical planning material. Broad
archive cleanup should happen only after the current docs prove useful and the
project `AGENTS.md` routes agents through them.
