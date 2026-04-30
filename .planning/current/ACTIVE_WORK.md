# Active Work

Status: current
Last updated: 2026-04-30

## Current Slice

Establish the first durable planning control plane for `codex-uplift-kit`.

## Goal

Create a small read-first surface that lets future agents understand current
state, vision, roadmap, release boundaries, and artifact lifecycle before
continuing v0.3 planning or implementation.

## Write Set

Planned durable docs:

- `.planning/README.md`
- `.planning/current/STATE.md`
- `.planning/current/VISION.md`
- `.planning/current/ROADMAP.md`
- `.planning/current/ACTIVE_WORK.md`
- `.planning/current/RELEASE.md`
- `.planning/governance/README.md`
- `.planning/governance/artifact-lifecycle.md`
- project `AGENTS.md`

Scratch docs under `.planning/work/_scratch/` remain temporary inputs until
their useful content has been promoted, then they should be deleted or archived
intentionally.

## Non-Goals

- Do not implement v0.3 CLI features in this slice.
- Do not move or archive old planning suites yet.
- Do not mutate live user `~/.codex`, `~/.agents`, or active config.
- Do not bump versions, tag, publish, push release artifacts, or start a new
  release.

## Verification

Minimum checks for this documentation-only slice:

- `git diff --check`
- `git status --short --branch`

Run broader package gates only if source, templates, installer behavior, or
release docs change.

## Next Decision

After this slice, decide whether to:

- commit the control-plane docs;
- delete or archive the scratch docs;
- audit user-level and project-level `AGENTS.md`;
- draft the formal v0.3 roadmap from these current docs.
