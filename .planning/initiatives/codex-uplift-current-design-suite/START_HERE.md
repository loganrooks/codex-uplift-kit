# START_HERE.md

Date: 2026-04-30

Subject: Entry point for onboarding a Codex orchestrator to the post-review `codex-uplift-kit` initiatives

## 0. What this suite is

This directory is the **post-review design/governance suite** for `codex-uplift-kit`.
It is not the v0.1 npm package itself. It is the handoff package that tells a Codex orchestrator how to turn the existing v0.1 bootstrap scaffold into a v0.2 Codex setup/posture assistant while preserving seams for v0.3+.

Expected location inside the implementation repo:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

## 1. Entry point

Start with:

```text
CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
```

That file contains the source-of-truth reading order, first-task contract, required pre-implementation artifacts, and v0.2 acceptance criteria.

## 2. Must-read supporting files

Read immediately after the entrypoint:

```text
CODEX_UPLIFT_DOC_SUITE_INDEX.md
CODEX_UPLIFT_STATE.md
CODEX_UPLIFT_ROADMAP.md
CODEX_UPLIFT_AUTORUN_CONTRACT.md
CODEX_UPLIFT_RELEASE_CHECKPOINT.md
CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md
```

`REVIEW_RESPONSE.md` and `REVIEW_RESPONSE_V0_2_ADDENDUM.md` are review-history artifacts. They explain why the suite moved in this direction, but they are not the implementation source of truth.

## 3. The one-sentence directive

```text
Use CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md to onboard, then implement the smallest coherent v0.2 slice of codex-uplift-kit as a non-destructive Codex setup/posture assistant: inspect first, generate candidates before mutating config, keep deferrals explicit, preserve future seams, record validation, and stop at a manual release checkpoint.
```

## 4. Minimal handoff prompt

```text
You are the Codex orchestrator for codex-uplift-kit v0.2.

The planning suite lives at .planning/initiatives/codex-uplift-current-design-suite/.
Start with CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md. Follow its source-of-truth reading order. Treat REVIEW_RESPONSE.md and REVIEW_RESPONSE_V0_2_ADDENDUM.md as review history, not as the implementation spec.

You may run automatically through v0.2 implementation and release-candidate preparation under CODEX_UPLIFT_AUTORUN_CONTRACT.md. Do not publish to npm, create/push git tags, push a remote branch, enable real user-home hooks/rules/full-access profiles, or move to v0.3 without my explicit approval.

Before editing implementation code, create the required .codex-uplift planning artifacts listed in the entrypoint. Do not silently drop vision-relevant capabilities. If anything relevant is not implemented in this slice, record the target horizon, preserved seam, non-foreclosure constraint, acceptance criteria, and revisit trigger.
```

## 5. Runtime package entry point

The implementation package should keep:

```text
package.json -> bin.codex-uplift-init -> bin/codex-uplift-init.mjs
```

v0.2 should expand `codex-uplift-init` into the subcommand surface described in `CODEX_UPLIFT_ROADMAP.md` and `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md`.
