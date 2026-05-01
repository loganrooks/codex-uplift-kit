# Role Contracts

Status: current
Last updated: 2026-04-30

## Purpose

Roles help agents specialize without turning every task into a heavyweight
process. A role is a bounded responsibility with explicit inputs, outputs,
forbidden decisions, and gates.

Do not create a large taxonomy before the contracts are clear. Add roles when
they remove ambiguity or improve quality.

## Base Contract Shape

Every durable role should define:

- when to use it;
- required inputs;
- allowed reads;
- allowed writes;
- forbidden decisions;
- output artifact path;
- return shape;
- verification responsibility;
- review or disposition gate.

## Universal Roles

### Evidence Explorer

Use when facts must be gathered before planning or decisions.

Allowed work:

- inspect source files, docs, logs, package metadata, CI state, and official
  docs when needed;
- produce observed facts, inferences, unknowns, and recommended probes.

Forbidden decisions:

- product direction;
- release approval;
- active config mutation;
- deleting or archiving artifacts.

Output:

- evidence note, source map, or structured inspect result.

Gate:

- findings must separate observed facts from inference.

### Artifact Writer

Use when a planning, governance, release, or handoff artifact must be drafted.

Allowed work:

- write or update assigned docs;
- integrate accepted decisions and verified evidence.

Forbidden decisions:

- making unresolved product, safety, or release decisions silently;
- promoting historical evidence to current truth without rationale.

Output:

- assigned artifact paths and a summary of changes.

Gate:

- cold-read pass for discoverability and actionability.

### Artifact Reviewer

Use when an artifact needs quality control.

Allowed work:

- review for authority, consistency, stale claims, missing verification,
  unclear closure target, and unauditable decisions.

Forbidden decisions:

- rewriting the artifact without a requested fix scope;
- approving release or live config activation.

Output:

- findings ordered by severity or a clear no-findings result.

Gate:

- findings need file/path evidence and a concrete remediation.

### Decision Recorder

Use when a product, workflow, release, safety, schema, public API, or governance
decision is made.

Allowed work:

- create or update decision records;
- link evidence and alternatives.

Forbidden decisions:

- deciding the issue being recorded unless explicitly asked.

Output:

- decision record with status, context, decision, rationale, alternatives,
  consequences, and follow-up.

Gate:

- must distinguish decision owner from agent recommendation.

### Verification Checker

Use when a closure target must be validated.

Allowed work:

- run or inspect verification gates;
- compare outputs to the closure target;
- identify residual risk.

Forbidden decisions:

- lowering gates without recording a decision;
- claiming manual verification that was not performed.

Output:

- verification note with commands, results, not-run items, and residual risks.

Gate:

- must state exactly what evidence supports completion.

### Handoff Keeper

Use when work will continue across compaction, interruption, or sessions.

Allowed work:

- summarize newest user instruction, current objective, branch/commit state,
  changed files, decisions, verification, open questions, and next actions.

Forbidden decisions:

- replacing current docs with chat summaries;
- treating stale alternatives as active plans.

Output:

- handoff artifact or updated active work note.

Gate:

- next agent can resume without relying on hidden chat context.

## Specialized Role Families

Add specialized roles only after a base workflow proves the need.

Candidate families:

- planner or slicer;
- risk mapper;
- closure checker;
- release checker;
- research report checker;
- demo readiness checker;
- playtest checker;
- pitch readiness checker.

Each specialized role still needs the base contract shape.
