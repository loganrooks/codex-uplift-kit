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
- `agent-workflow.md`: default work loop from orientation through handoff.
- `role-contracts.md`: bounded roles and output contracts for agent work.
- `workflow-gates.md`: gate levels and verification by closure target.
- `decision-records.md`: when and how to record durable decisions.
- `../templates/`: reusable artifact shapes for work slices, evidence,
  verification, decisions, and handoffs.

Future docs should be added only when the repo needs them. Likely next docs:

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
- Match process weight to closure target. Research, audit, decision, prototype,
  pitch, migration, playtest, and release work need different evidence shapes.

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
