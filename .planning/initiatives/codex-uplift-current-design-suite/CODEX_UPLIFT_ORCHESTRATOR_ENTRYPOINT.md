# CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md

Date: 2026-04-30

Subject: Entry point and first-task contract for a Codex orchestrator implementing `codex-uplift-kit` v0.2

## 0. Start here

This is the implementation handoff file. Give this file to the Codex orchestrator first.

The package should now be treated as a **Codex setup and posture assistant**, not merely a static bootstrap bundle. v0.1 was a conservative bootstrap slice. v0.2 should be the first implementation slice that makes the assistant real while preserving seams for v0.3+.

The product category is settled for v0.2:

> Build a non-destructive Codex setup/posture assistant that can inspect existing setup, generate candidate configuration, install selectable reusable assets, initialize project-specific Codex surfaces from evidence, and preserve long-horizon audit/context seams.

## 1. Source-of-truth order

Read the docs in this order:

1. `CODEX_UPLIFT_DOC_SUITE_INDEX.md` — map and precedence.
2. `CODEX_UPLIFT_STATE.md` — current state and v0.1/v0.2 handoff.
3. `CODEX_UPLIFT_ROADMAP.md` — concrete v0.1/v0.2/v0.3 roadmap.
4. `CODEX_UPLIFT_SOURCE_BASELINE.md` — auditable platform/source baseline.
5. `CODEX_UPLIFT_RELEASE_GOVERNANCE.md` — release slicing, deferral discipline, and acceptance gates.
6. `CODEX_UPLIFT_AUTORUN_CONTRACT.md` — what may run automatically and what requires approval.
7. `CODEX_UPLIFT_RELEASE_CHECKPOINT.md` — manual release checkpoint.
8. `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md` — v0.2 build contract.
9. `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md` — named deferrals; no silent out-of-scope claims.
10. `CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md` — what v0.2 must not close off.
11. `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md` — extension seams and anti-closure constraints.
12. `CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md` — sandbox/approval/permission posture semantics.
13. `CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md` — token/context strategy.
14. `CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md` and `CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md` — compaction prompt candidates and evaluation.
15. `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md` — RTK evaluation-only posture.
16. `CODEX_UPLIFT_V0_3_PLUS_HORIZON.md` — future-aware design implications.
17. `CODEX_UPLIFT_STATUS_AND_HANDOFF.md` — short handoff summary.

`REVIEW_RESPONSE.md` and `REVIEW_RESPONSE_V0_2_ADDENDUM.md` are review-history artifacts. They explain why the suite moved in this direction, but they are not the implementation source of truth.

## 2. First orchestrator task

Before writing implementation code, create these repo-local artifacts:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
.codex-uplift/validation-log.md
```

Minimum contents:

### `implementation-observations.md`

Separate:

- directly observed files and commands in the current package;
- current CLI entry points;
- existing tests and smoke checks;
- current install behavior;
- current config/hook/plugin/skill behavior;
- unsupported or unverified assumptions.

### `v0.2-scope-map.md`

Map every required v0.2 capability to one of:

- implement in this slice;
- candidate-only in this slice;
- test-only/probe-only in this slice;
- explicitly deferred with deferral-register entry;
- blocked by missing source/empirical result.

### `v0.2-implementation-plan.md`

Include:

- proposed command surface;
- component selection model;
- install modes;
- config doctor/candidate behavior;
- posture profile candidate behavior;
- project setup candidate behavior;
- rules/hooks candidate behavior;
- manifest/status/uninstall behavior;
- expected write set;
- test plan;
- rollback plan.

### `v0.2-deferral-check.md`

For every relevant not-now capability, record:

```text
Capability:
Target horizon:
Deferred-to artifact:
Preserved seam:
What v0.2 must not do:
Acceptance criteria for revival:
Revisit trigger:
```

Do not use unsupported phrases like “future work” or “out of scope” without this structure.

### `validation-log.md`

Record commands run, files inspected, assumptions verified, and assumptions not yet verified.

## 3. Automatic implementation boundary

The orchestrator may run automatically through implementation and release-candidate preparation under `CODEX_UPLIFT_AUTORUN_CONTRACT.md`.

It must stop before:

- npm publish;
- git tag or remote push;
- GitHub release;
- applying real user-home config changes;
- enabling hooks/rules/full-access profiles in a live user config;
- moving to v0.3.

## 4. v0.2 acceptance criteria

v0.2 is not done until:

- required commands are implemented or explicitly deferred with seams preserved;
- install modes are explicit;
- config/profile candidates are non-destructive;
- project setup candidates are non-destructive;
- hook/rule/compaction/RTK surfaces remain candidate/evaluation-only unless explicitly enabled;
- package-owned files are tracked in a manifest;
- status/uninstall behavior is safe;
- safety-critical tests exist and pass or failures are documented;
- package dry-run and temp install checks pass;
- `CODEX_UPLIFT_STATE.md` and `CODEX_UPLIFT_ROADMAP.md` are updated;
- `.codex-uplift/release-candidate-review.md` exists.

## 5. Exact prompt to give the orchestrator

```text
You are implementing v0.2 of codex-uplift-kit.

The planning suite lives at .planning/initiatives/codex-uplift-current-design-suite/.
Start with CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md and follow the source-of-truth order.

You may run automatically through v0.2 implementation and release-candidate preparation under CODEX_UPLIFT_AUTORUN_CONTRACT.md. Do not publish to npm, create/push git tags, push a remote branch, enable real user-home hooks/rules/full-access profiles, or move to v0.3 without my explicit approval.

Before editing implementation code, create:
- .codex-uplift/implementation-observations.md
- .codex-uplift/v0.2-scope-map.md
- .codex-uplift/v0.2-implementation-plan.md
- .codex-uplift/v0.2-deferral-check.md
- .codex-uplift/validation-log.md

Then implement the smallest coherent v0.2 slice in roadmap order. Keep STATE and ROADMAP current. Stop at a release-candidate checkpoint.
```
