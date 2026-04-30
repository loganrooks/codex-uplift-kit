# CODEX_UPLIFT_STATUS_AND_HANDOFF.md

Date: 2026-04-30

Subject: Current handoff summary for `codex-uplift-kit` post-review implementation

## 0. Current status

The planning suite is ready to hand to a Codex orchestrator as a post-review implementation brief.

The implementation package should be treated as a v0.1 bootstrap prototype until the orchestrator inspects the actual repo and records evidence.

## 1. Canonical suite path in the implementation repo

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

## 2. Orchestrator start command

Give the orchestrator this instruction:

```text
Start with .planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md.

You may run automatically through v0.2 implementation and release-candidate preparation under CODEX_UPLIFT_AUTORUN_CONTRACT.md. Do not publish to npm, create/push git tags, push a remote branch, enable real user-home hooks/rules/full-access profiles, or move to v0.3 without explicit approval.
```

## 3. First required output from orchestrator

Before code edits:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
.codex-uplift/validation-log.md
```

## 4. Active implementation target

```text
v0.2 setup/posture assistant baseline
```

## 5. Manual checkpoint at end

At end of v0.2, require:

```text
.codex-uplift/release-candidate-review.md
.codex-uplift/v0.3-handoff.md
```

Then the user decides:

- publish stable;
- publish alpha;
- hold;
- revise;
- begin v0.3.

## 6. Current known priorities

1. Inspect actual v0.1 package state.
2. Add `inspect` / `config doctor` / `config candidate`.
3. Add install modes and component selection.
4. Fix plugin path and duplicate-skill behavior.
5. Add manifest/status/uninstall safety.
6. Add posture profile candidates.
7. Add project setup candidates.
8. Add hooks/rules candidates.
9. Add compaction prompt candidates and eval plan surfaces.
10. Keep RTK evaluation-only.
11. Add safety-critical tests.
12. Prepare release checkpoint.

## 7. Handoff boundary

The orchestrator should not treat this suite as executable code. It is planning and governance input. The implementation source of truth is the package repo after inspection.
