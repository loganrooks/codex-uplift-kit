# Codex Uplift Planning Control Plane

Status: current
Audience: Codex agents and project maintainers
Last updated: 2026-04-30

## Purpose

This directory is the read-first control plane for `codex-uplift-kit`.
It separates current project truth from historical evidence so future work can
start without spelunking through the v0.2 design suite or old recovery notes.

## Boot Path

For substantive work in this repo, read these files in order:

1. `current/STATE.md`
2. `current/ACTIVE_WORK.md`
3. `current/ROADMAP.md`
4. `governance/README.md`

Then open only the archived or work-specific artifacts needed for the task.

## Current Docs

- `current/STATE.md` records what is true now.
- `current/VISION.md` records the long-horizon product thesis.
- `current/ROADMAP.md` records the staged path from the current alpha toward
  the next product shape.
- `current/ACTIVE_WORK.md` records the current slice only.
- `current/RELEASE.md` records release state, gates, and manual boundaries.

## Governance Docs

- `governance/README.md` explains the repo's operating rules.
- `governance/artifact-lifecycle.md` defines when artifacts are current,
  scratch, work evidence, release evidence, or archive evidence.

Additional governance docs should be added only when a real workflow needs them.

## Artifact Authority

Current docs are authoritative for present work. Work docs and `.codex-uplift`
artifacts are evidence. Initiative docs under `initiatives/` are historical
source material unless a current doc explicitly promotes them.

Scratch docs under `work/_scratch/` are temporary continuity notes. Mine them,
then delete or archive them intentionally once their useful content has been
promoted.
