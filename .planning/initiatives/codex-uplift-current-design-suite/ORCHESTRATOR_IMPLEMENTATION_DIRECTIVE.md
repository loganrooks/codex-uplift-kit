# ORCHESTRATOR_IMPLEMENTATION_DIRECTIVE.md

Date: 2026-04-30

Subject: Copy/paste directive for a Codex orchestrator implementing the post-review v0.2 initiatives

## Directive

You are implementing `codex-uplift-kit` v0.2 from the post-review design suite located at:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

This suite is not the npm package itself. It is the implementation brief, source-of-truth map, state/roadmap package, release governance, deferral register, seam map, token/context strategy, and handoff package for the next implementation slice.

Start with:

```text
CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
```

Then follow the reading order in that file.

## Product category

For v0.2, the product category is:

> A non-destructive Codex setup and posture assistant that can inspect existing setup, generate candidate configuration, install selectable reusable assets, initialize project-specific Codex surfaces from evidence, and preserve long-horizon audit/context seams.

## Automatic-run authorization

You may run automatically through v0.2 implementation and release-candidate preparation under:

```text
CODEX_UPLIFT_AUTORUN_CONTRACT.md
```

Do not:

- publish to npm;
- create or push git tags;
- push a remote branch;
- create a public GitHub release;
- enable hooks/rules/full-access profiles in a real user home config;
- move to v0.3 implementation;
- claim final release completion.

Those require explicit user approval at the release checkpoint.

## Required pre-implementation artifacts

Before editing package code, create:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
.codex-uplift/validation-log.md
```

## Implementation priority

Implement in this order unless repo inspection shows a safer order:

1. `inspect` / inventory.
2. `config doctor`.
3. `config candidate` and posture profiles.
4. install modes and component selection.
5. manifest/status/uninstall.
6. plugin path and duplicate-skill handling.
7. project setup candidates.
8. hooks/rules candidates.
9. compaction prompt candidates.
10. RTK evaluation-only command/path.
11. tests and package hygiene.
12. release-candidate review.

## Deferral rule

If you do not implement something vision-relevant in v0.2, record it in:

```text
.codex-uplift/v0.2-deferral-check.md
CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md
```

Include target horizon, preserved seam, non-foreclosure constraint, acceptance criteria, and revisit trigger.

## Release checkpoint

At the end, create:

```text
.codex-uplift/release-candidate-review.md
.codex-uplift/v0.3-handoff.md
```

Then stop for user approval.
