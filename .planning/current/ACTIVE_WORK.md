# Active Work

Status: current
Last updated: 2026-04-30

## Current Slice

Prepare v0.3 Slice 1, the deterministic artifact authority checker, after
establishing the planning control plane and workflow spine.

## Goal

Create an implementation-ready work package for `artifact check --json` so v0.3
starts with a deterministic universal kernel instead of broad governance prose.

## Write Set

Planned durable docs:

- `.planning/work/v0.3-slice-1-artifact-authority-check.md`
- `.planning/current/ACTIVE_WORK.md`

Scratch docs under `.planning/work/_scratch/` remain temporary inputs until
their useful content has been promoted, then they should be deleted or archived
intentionally.

## Non-Goals

- Do not implement v0.3 CLI features before the work package is reviewed.
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

- accept the v0.3 Slice 1 package as the next implementation scope;
- choose whether `artifact check --json` defaults to inferred level or `minimal`
  in v0.3 alpha;
- delete or archive the scratch docs;
- implement v0.3 Slice 1.
