# RECOVERY_CURRENT_STATE_ASSESSMENT.md

Date: 2026-04-30

Subject: Current repo state assessment for late orchestration recovery

## 0. Summary

The current repository state should be treated as:

```text
v0.2 release-candidate implementation exists; release decision pending; orchestration/worktree docs missing from planning suite; recovery/hardening pass required before release.
```

Do not restart v0.2 from scratch.

## 1. Observed implementation state

Observed from the current `main` branch:

- `package.json` still declares version `0.1.0` and exposes `codex-uplift-init` through `bin/codex-uplift-init.mjs`.
- The CLI now contains a broad v0.2 command surface: install modes, component IDs, manifest/status/uninstall, `inspect`, `config doctor`, `config candidate`, project/rules/hooks/compact candidate seams, `rtk evaluate --plan-only`, and `verify`.
- `.codex-uplift/release-candidate-review.md` records a v0.2 release-candidate checkpoint and recommends `ship-alpha`, while leaving package version bump, npm publish, git tag, remote push, and live user-home operations as manual gates.
- `.codex-uplift/change-log.md` records delegated/worker-style implementation slices and an integration review.
- `.codex-uplift/test-log.md` records `npm test`, smoke, pack dry-run, publish dry-run, temp-home commands, and `git diff --check` passing.

## 2. Observed planning-suite gap

The planning-suite `MANIFEST.md` currently lists the original suite files but not the late orchestration/delegation/worktree docs. Therefore, the orchestrator that implemented v0.2 could not have ingested those documents if it started from the suite as committed.

This is a process/release-confidence gap, not proof that the implementation is bad.

## 3. START_HERE impact

Starting from `START_HERE.md` was probably not catastrophic because `START_HERE.md` points the orchestrator to `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md`.

The stronger issue is that the orchestration/delegation/worktree documents were missing, so the orchestrator lacked more concrete instructions for:

- when to delegate;
- how to define subagent artifact contracts;
- how to manage file ownership;
- how to use worktrees/branches/checkpoints;
- how to record integration dispositions.

The recovery pass should therefore add retrospective process artifacts and targeted reviews, not restart implementation.

## 4. Current `.codex-uplift/` assessment

The `.codex-uplift/` folder is mostly set up correctly as the repo-local runtime/audit state for the implementation initiative. It contains:

```text
implementation-observations.md
v0.2-scope-map.md
v0.2-implementation-plan.md
v0.2-deferral-check.md
validation-log.md
change-log.md
test-log.md
release-candidate-review.md
v0.3-handoff.md
```

Because orchestration/worktree docs arrived late, add these retrospective artifacts:

```text
post-implementation-orchestration-reconciliation.md
delegation-retrospective.md
worktree-state.md
file-ownership-map.md
integration-ledger.md
checkpoint-ledger.md
```

Do not rename or move the existing `.codex-uplift/` artifacts unless there is a concrete reason.

## 5. Highest-priority technical hardening review

The highest-priority technical review is config/posture semantics.

The posture spec says, for example:

- `review-only` should be read-only and user-reviewed;
- `safe-interactive` should be workspace-write, normally user-reviewed, and network-off;
- `autonomous-audited` should use workspace-write plus auto-review with compensating controls;
- `full-access-reviewed` should be explicitly described as reviewed unsandboxed operation, not sandboxed safety.

The current CLI-generated candidate profile values should be reviewed against this spec and covered by golden/content tests. Do not release until generated config candidates match the documented posture vocabulary or the spec is deliberately revised.

## 6. Documentation consistency risk

Review the root `README.md`, `REVIEW.md`, release-candidate review, and suite state/roadmap for stale language.

One likely stale pattern is wording that says v0.2 commands are not present even after the CLI implemented many of them.

Patch docs to distinguish:

```text
implemented command
candidate-only seam
deferred capability
manual release gate
```

## 7. Recommended next state

After the recovery pass, the repository should say:

```text
v0.2 alpha candidate prepared after late orchestration recovery; release decision pending.
```

The release checkpoint should require:

- missing docs copied and indexed;
- retrospective `.codex-uplift/` artifacts created;
- config/posture semantic audit complete;
- golden config-candidate tests added or intentionally deferred with rationale;
- docs consistency pass complete;
- verification rerun;
- no publish/tag/push/version bump without explicit user approval.
