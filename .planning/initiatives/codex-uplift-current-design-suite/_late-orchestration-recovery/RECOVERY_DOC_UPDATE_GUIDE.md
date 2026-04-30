# RECOVERY_DOC_UPDATE_GUIDE.md

Date: 2026-04-30

Subject: Which existing docs to update after adding the missing orchestration docs

## 0. Principle

Do not turn every document into a giant mega-document. Update only the files that need to route, index, or reflect state.

The parent planning suite should have a stable topology:

- `START_HERE.md` — human-friendly entrypoint.
- `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` — canonical orchestrator entrypoint for normal future work.
- `CODEX_UPLIFT_STATE.md` — living current state.
- `CODEX_UPLIFT_ROADMAP.md` — living product roadmap across versions.
- `.codex-uplift/*.md` — repo-local implementation/run artifacts.
- `CODEX_UPLIFT_*_ADDENDUM.md` and specialized docs — references loaded when relevant.

## 1. `MANIFEST.md`

Regenerate or update the manifest so it lists every file now present in the parent suite, including copied orchestration/worktree docs and `delegation-templates/README.md`.

Use actual byte sizes from the local checkout after copy/merge. Do not preserve stale sizes.

## 2. `CODEX_UPLIFT_DOC_SUITE_INDEX.md`

Add a section:

```markdown
## Late orchestration recovery and delegation

- `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md`
- `CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md`
- `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md`
- `CODEX_UPLIFT_DELEGATION_TEMPLATES.md`
- `CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md`
- `CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md`
- `CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md`
- `CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md`
- `CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md`
```

Also state which are first-read documents and which are supporting references.

## 3. `START_HERE.md`

`START_HERE.md` should remain the human-facing entrypoint.

Add a short current-state note:

```markdown
## Current exceptional state

If `_late-orchestration-recovery/` is present, read `_late-orchestration-recovery/START_HERE_RECOVERY.md` first. That folder is a temporary late-recovery organizer. After recovery is applied, normal orchestrator onboarding begins at `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md`.
```

After recovery is complete, either retain a small note saying recovery was applied, or move the full details to `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md`.

## 4. `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md`

This file should be the normal orchestrator entrypoint.

Add to its source-of-truth reading order:

```text
CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md
CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md
```

Add a rule:

```text
If implementation already advanced before these docs were present, do not restart. Create the retrospective `.codex-uplift/` artifacts and run targeted hardening reviews before release approval.
```

## 5. `CODEX_UPLIFT_STATE.md`

`STATE` is an active living state document. Update it when meaningful initiative state changes.

For this recovery pass, add or update:

```markdown
## Late orchestration recovery status

Status: pending | applied | superseded

Reason: orchestration/delegation/worktree docs were missing from the planning suite during the first v0.2 implementation pass.

Required follow-up: copy/index docs, create retrospective orchestration artifacts, run config/posture semantic review, update release checkpoint.
```

Do not update `STATE` for every small edit. Update it at gates:

- recovery package applied;
- hardening review complete;
- release candidate revised;
- release decision made;
- transition to v0.3 begins.

## 6. `CODEX_UPLIFT_ROADMAP.md`

The roadmap should remain the cross-version plan. It should include v0.1, active v0.2 status, and v0.3+ horizon.

Add a v0.2 gate:

```markdown
### Late orchestration recovery gate

Before v0.2 release approval, ensure missing orchestration/worktree docs are added and indexed, retrospective `.codex-uplift/` artifacts are created, config/posture semantic tests are run or explicitly deferred, and release docs reflect the current CLI state.
```

When v0.2 is finished, do not replace the roadmap with only v0.3. Update it so:

- v0.2 is marked shipped/held/revised;
- v0.3 becomes the active initiative;
- concrete v0.3 plan is created separately under `.codex-uplift/v0.3-implementation-plan.md` or equivalent.

## 7. `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md`

Add new deferrals only if the recovery pass discovers vision-relevant work that will not be done before v0.2 release.

Each deferral must include:

- target horizon;
- preserved seam;
- what v0.2 must not do;
- acceptance criteria for revival;
- revisit trigger.

## 8. `CODEX_UPLIFT_RELEASE_CHECKPOINT.md`

Add release checks:

```text
- late orchestration recovery applied or explicitly declined;
- retrospective `.codex-uplift/` orchestration artifacts created;
- config/posture semantic review complete;
- golden/content tests for profile candidates added or explicitly deferred;
- README/release docs no longer contain stale v0.1/v0.2 command-state claims;
- verification rerun after recovery patches.
```

## 9. `.codex-uplift/` artifacts

Create the retrospective artifacts listed in `START_HERE_RECOVERY.md`.

Do not replace existing implementation artifacts. Append or create new artifacts so future maintainers can see that the orchestration docs arrived late.

## 10. Root `README.md` and package docs

Patch stale public docs if they still say v0.2 commands are not present while the CLI now implements them.

Public docs should distinguish:

- implemented in current CLI;
- candidate-only seam;
- deferred future behavior;
- manual release gate.

## 11. What not to update

Do not churn `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md` solely to mention this recovery package.

Only update the operational spec if a substantive spec/implementation mismatch is found, such as posture profile semantics.
