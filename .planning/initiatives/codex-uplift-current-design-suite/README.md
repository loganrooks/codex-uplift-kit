# codex-uplift-kit current design suite

Date: 2026-04-30

This suite is the planning/governance package for turning `codex-uplift-kit` from a conservative v0.1 bootstrap bundle into a v0.2 Codex setup and posture assistant while preserving seams for v0.3+.

Expected path inside the implementation repo:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

## Start here

Human entry point:

```text
START_HERE.md
```

Orchestrator entry point:

```text
CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
```

Copy/paste directive:

```text
ORCHESTRATOR_IMPLEMENTATION_DIRECTIVE.md
```

## Core state and roadmap docs

```text
CODEX_UPLIFT_DOC_SUITE_INDEX.md
CODEX_UPLIFT_STATE.md
CODEX_UPLIFT_ROADMAP.md
CODEX_UPLIFT_AUTORUN_CONTRACT.md
CODEX_UPLIFT_RELEASE_CHECKPOINT.md
CODEX_UPLIFT_STATUS_AND_HANDOFF.md
```

The most important governing rule is: **no silent deferrals**. If a capability is still relevant to the vision but not implemented in v0.2, it must have a target horizon, preserved seam, non-foreclosure constraints, acceptance criteria, and revisit trigger.

## Recommended reading order

1. `CODEX_UPLIFT_DOC_SUITE_INDEX.md`
2. `CODEX_UPLIFT_STATE.md`
3. `CODEX_UPLIFT_ROADMAP.md`
4. `CODEX_UPLIFT_SOURCE_BASELINE.md`
5. `CODEX_UPLIFT_RELEASE_GOVERNANCE.md`
6. `CODEX_UPLIFT_AUTORUN_CONTRACT.md`
7. `CODEX_UPLIFT_RELEASE_CHECKPOINT.md`
8. `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md`
9. `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md`
10. `CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md`
11. `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md`
12. `CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md`
13. `CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md`
14. `CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md`
15. `CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md`
16. `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md`
17. `CODEX_UPLIFT_V0_3_PLUS_HORIZON.md`
18. `CODEX_UPLIFT_STATUS_AND_HANDOFF.md`

`REVIEW_RESPONSE.md` and `REVIEW_RESPONSE_V0_2_ADDENDUM.md` are included as review-history artifacts. They are not the source of truth for v0.2 implementation.

## Can an orchestrator run automatically?

Yes, through v0.2 implementation and release-candidate preparation, under `CODEX_UPLIFT_AUTORUN_CONTRACT.md`.

No, not through publication. npm publish, git tags, remote pushes, GitHub releases, and applying real user-home config changes require a manual checkpoint.

## Zip package

This suite is distributed as a ZIP for convenience. A tar archive is intentionally not required.
