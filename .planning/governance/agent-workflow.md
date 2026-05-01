# Agent Workflow

Status: current
Last updated: 2026-04-30

## Purpose

This document defines the default workflow for agents working in this repo and
for the project-uplift system this repo is dogfooding. It should help agents
produce auditable work without forcing every project through the same release
process.

## Workflow Summary

Every substantive work session should move through these stages:

1. orient;
2. classify closure target;
3. choose artifact set;
4. define or update the active work slice;
5. execute within role and write boundaries;
6. verify against the closure target;
7. record decisions, evidence, and handoff state.

Tiny mechanical tasks may collapse these stages, but should not violate their
safety boundaries.

## Stage 1: Orient

Read the current surfaces before historical evidence:

1. `.planning/README.md`
2. `.planning/current/STATE.md`
3. `.planning/current/ACTIVE_WORK.md`
4. `.planning/current/ROADMAP.md`
5. `.planning/governance/README.md`

Then inspect the worktree and relevant source files.

Required output before broad edits:

- current branch and dirty state;
- relevant instruction surfaces read;
- expected write set;
- verification plan.

This can be a short note in chat for small work or a durable artifact for larger
work.

## Stage 2: Classify Closure Target

Do not assume the target is a release.

Common closure targets:

- research report;
- audit findings;
- decision memo;
- prototype;
- pitch or stakeholder narrative;
- migration;
- experiment result;
- playtest build;
- shipped release;
- internal workflow hardening.

If the closure target is unclear, record the ambiguity. For high-impact work,
pause for a user decision or write a short decision proposal.

## Stage 3: Choose Artifact Set

Use the smallest artifact set that makes the work auditable.

### Quick Task

Use when the change is small, local, and low risk.

Artifacts:

- final response with files changed and verification;
- commit message if committing.

### Bounded Research Or Audit

Use when the closure target is a report, recommendation, or audit.

Artifacts:

- source map;
- evidence ledger;
- findings or recommendations;
- uncertainty and open questions;
- verification/review note.

### Software Slice

Use when code, templates, installer behavior, CI, or package behavior changes.

Artifacts:

- active work slice;
- implementation notes when behavior changes;
- tests or verification log;
- decision record for public API, safety, config, release, or workflow changes.

### Product Or Long-Horizon Slice

Use when roadmap, vision, pack architecture, governance, or product direction
changes.

Artifacts:

- current docs update;
- decision record;
- active work update;
- roadmap or release update if scope/order changes.

## Stage 4: Define Active Work

For meaningful work, the active work slice should include:

- closure target;
- user-visible outcome;
- write set;
- non-goals;
- evidence inputs;
- tasks;
- verification gates;
- stop conditions.

The slice can live in `.planning/current/ACTIVE_WORK.md` for one current slice or
under `.planning/work/` for larger work packages.

## Stage 5: Execute Within Boundaries

Agents must stay inside the stated write set unless new evidence requires a
change. If scope changes, update the active work artifact before broadening
edits.

Subagents may be used only when explicitly authorized by the user or by a
repo-defined workflow the user has invoked. Delegated work needs a bounded
contract and a durable output path when it matters for auditability.

## Stage 6: Verify Against Closure Target

Verification must fit the work:

- software: tests, lint, type checks, build checks, smoke checks, package dry
  runs, or manual reproduction;
- research: source coverage, quote/fact checks, competing evidence review, and
  uncertainty accounting;
- audit: scoped evidence, severity criteria, reproducible examples, and
  recommendation review;
- prototype/demo: run instructions, smoke checks, screenshots where useful, and
  limitations;
- pitch: claim support, audience fit, risk disclosure, and narrative coherence;
- workflow docs: cold-read pass, discoverability, and consistency with current
  governance.

If verification is not possible, record exactly what was not run and why.

## Stage 7: Record And Handoff

Before finishing substantive work:

- update current docs if project truth changed;
- update or add decision records when decisions were made;
- record verification in the relevant artifact or final response;
- note open questions and deferred work;
- keep scratch docs temporary and intentionally delete or archive them later.
