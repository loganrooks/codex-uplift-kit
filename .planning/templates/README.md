# Artifact Templates

Status: current
Last updated: 2026-04-30

## Purpose

These templates give agents concrete artifact shapes for auditable work. Copy a
template into the appropriate current, work, decision, or evidence location and
delete sections that do not apply.

Use the smallest artifact that preserves the work.

## Templates

- `work-slice.md`: default shape for a bounded implementation, research, audit,
  prototype, or workflow slice.
- `evidence-ledger.md`: source and fact tracking for research, audit, and
  high-impact decisions.
- `verification-note.md`: verification results matched to closure target.
- `decision-record.md`: durable product, workflow, release, config, or
  architecture decisions.
- `handoff.md`: continuation state across compaction, interruption, or sessions.

## Placement

- Current project truth belongs under `.planning/current/`.
- Active multi-step work belongs under `.planning/work/`.
- Durable decisions belong under `.planning/decisions/`.
- Historical or superseded work belongs under `.planning/archive/`.

Scratch notes may live under `.planning/work/_scratch/`, but they are not
authority.
