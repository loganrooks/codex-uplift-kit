# Governance

Status: current
Last updated: 2026-04-30

## Purpose

Governance docs define how agents and maintainers use the planning control
plane. They are workflow contracts, not product marketing and not historical
summaries.

## Current Governance Surface

- `artifact-lifecycle.md`: how artifacts gain, keep, lose, or never receive
  authority.

Future docs should be added only when the repo needs them. Likely next docs:

- `agent-workflow.md`
- `decision-records.md`
- `role-contracts.md`
- `workflow-gates.md`
- `release-policy.md`
- `dogfooding-policy.md`

## Operating Rules

- Read current docs before historical evidence.
- Treat archive and initiative docs as evidence unless current docs promote
  them.
- Keep scratch docs temporary and delete or archive them intentionally.
- Record decisions that affect product direction, safety boundaries, public API,
  release process, or workflow contracts.
- Keep active config, live installs, publish, tag, and release operations behind
  explicit user approval.
- Prefer deterministic checks for structure and release gates.

## Role Discipline

Do not create a broad role taxonomy before role contracts exist.

Every future role should specify:

- when to use it;
- required inputs;
- allowed reads;
- allowed writes;
- forbidden decisions;
- output artifact path;
- return shape;
- verification responsibility;
- review or disposition gate.
