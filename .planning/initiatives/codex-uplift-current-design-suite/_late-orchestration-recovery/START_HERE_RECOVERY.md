# START_HERE_RECOVERY.md

Date: 2026-04-30

Status: active one-time recovery entrypoint

You are resuming `codex-uplift-kit` after a late planning-suite correction.
Read this file first and treat it as the operational entrypoint for the recovery pass.
You do not need a separate copy-paste prompt.

Do not restart v0.2. The repository already has a v0.2 release-candidate implementation path. Your job is to reconcile the late orchestration, delegation, and worktree materials with the current implementation state, harden the release candidate, and stop at the manual release checkpoint.

## 0. Entry rule

Use this file as the only active recovery runbook.

`RECOVERY_ORCHESTRATOR_RESUME_DIRECTIVE.md` is not a second directive. It is retained only as a compatibility pointer for older references. If you open it, it should point back here.

Normal routing after this recovery is complete:

```text
.planning/initiatives/codex-uplift-current-design-suite/START_HERE.md
  -> CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
```

Temporary routing while this recovery is pending:

```text
.planning/initiatives/codex-uplift-current-design-suite/_late-orchestration-recovery/START_HERE_RECOVERY.md
```

## 1. Why this recovery exists

The planning suite originally available in the repo did not include the orchestration, delegation, and worktree-isolation documents that should have been present before v0.2 implementation began.

This created a process/audit gap. It does not by itself invalidate the implementation. Preserve existing implementation artifacts unless a concrete defect is found.

Treat this recovery as:

```text
late process reconciliation + release-candidate hardening
```

not:

```text
restart v0.2 from scratch
```

## 2. Immediate constraints

Do not perform any of these actions during recovery:

- do not publish to npm;
- do not bump the package version;
- do not create or push git tags;
- do not push a remote branch;
- do not create a GitHub release;
- do not mutate real user-home Codex configuration;
- do not enable active hooks, rules, full-access profiles, telemetry, or RTK;
- do not start v0.3 implementation;
- do not rewrite the v0.2 implementation unless a concrete defect is found.

You may edit repository files, planning docs, tests, and package code as needed to complete this recovery and hardening pass.

## 3. Repository hygiene for this recovery package

Do not `.gitignore` this recovery folder while recovery is pending.

Track this folder as an active initiative artifact:

```text
.planning/initiatives/codex-uplift-current-design-suite/_late-orchestration-recovery/
```

Do not track local archive or scratch byproducts:

```text
*.zip
*.tar
*.tar.gz
*.tgz
.DS_Store
Thumbs.db
desktop.ini
tmp/
.tmp/
```

This recovery folder is temporary but audit-relevant. After recovery is applied, choose one explicit disposition:

1. Archive it as provenance by adding a `RECOVERY_APPLIED.md` note and leaving the folder tracked; or
2. Remove it deliberately after the copied docs, parent-suite updates, and `.codex-uplift/post-implementation-orchestration-reconciliation.md` capture what happened.

Do not use `.gitignore` as the cleanup mechanism for this folder. If the folder should no longer exist, delete it in a deliberate cleanup commit after the outcome has been recorded.

Also verify repo-level ignore hygiene. At minimum, `.DS_Store`, local archives, and temporary extraction directories should be ignored or removed if already present. Do not remove tracked audit artifacts as “cleanup.”

## 4. Support files in this recovery package

Read these files as needed while executing this recovery:

```text
RECOVERY_CURRENT_STATE_ASSESSMENT.md
  Current repo state observed before this recovery package was created.

RECOVERY_COPY_MAP.md
  Missing documents to copy or merge into the parent planning suite.

RECOVERY_DOC_UPDATE_GUIDE.md
  How to update parent-suite docs without rewriting them wholesale.

RECOVERY_EXIT_CRITERIA.md
  Conditions that must be true before the recovery pass is complete.

PACKAGE_MANIFEST.md
  Inventory of this recovery package.
```

The files above are supporting references. This file remains the controlling recovery runbook.

## 5. First checks

Before editing, record the current repo state.

Create or update:

```text
.codex-uplift/worktree-state.md
```

Include:

- current branch;
- latest commit;
- `git status --short`;
- whether the worktree is clean or dirty;
- whether there are untracked recovery files;
- whether existing `.codex-uplift/` artifacts are present;
- whether the planning suite already contains any of the late orchestration docs;
- whether `.gitignore` already excludes archives, `.DS_Store`, and temporary extraction directories.

If the worktree is dirty, do not overwrite or normalize unrelated changes. Record the dirty state and keep recovery changes scoped.

## 6. Copy or merge missing parent-suite documents

Use `RECOVERY_COPY_MAP.md` as the source of truth for file placement.

Copy or merge the missing orchestration, delegation, and worktree documents into:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

If a target file already exists, do not blindly overwrite it. Compare the files, preserve the better/current version, and record the decision in:

```text
.codex-uplift/post-implementation-orchestration-reconciliation.md
```

Expected missing-document family:

```text
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
CODEX_UPLIFT_DELEGATION_TEMPLATES.md
CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md
CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md
CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md
CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md
CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md
CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md
CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md
delegation-templates/README.md
```

## 7. Update parent-suite routing and index docs

Use `RECOVERY_DOC_UPDATE_GUIDE.md` for update style.

Update only what is necessary. Do not rewrite the suite wholesale.

At minimum, check and update:

```text
.planning/initiatives/codex-uplift-current-design-suite/MANIFEST.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_DOC_SUITE_INDEX.md
.planning/initiatives/codex-uplift-current-design-suite/START_HERE.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_STATE.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_RELEASE_CHECKPOINT.md
```

Required updates:

- list the newly added orchestration/delegation/worktree docs in `MANIFEST.md`;
- add them to the suite index with clear roles;
- make parent `START_HERE.md` say that `_late-orchestration-recovery/START_HERE_RECOVERY.md` takes precedence only while recovery is pending;
- make `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` reference the recovery package only as an exceptional state, not as the normal entrypoint;
- update `STATE` to record whether recovery is pending, in progress, or applied;
- update `ROADMAP` only if recovery changes release status, v0.2 gates, or v0.3 seams;
- update the deferral register only if recovery exposes a new explicit deferral;
- update the release checkpoint if recovery changes what must be reviewed before shipping.

## 8. Create retrospective orchestration artifacts

Because the orchestration docs arrived late, create the missing process artifacts retrospectively.

Create or update:

```text
.codex-uplift/post-implementation-orchestration-reconciliation.md
.codex-uplift/delegation-retrospective.md
.codex-uplift/file-ownership-map.md
.codex-uplift/integration-ledger.md
.codex-uplift/checkpoint-ledger.md
```

Minimum content:

- what implementation work was already completed;
- which delegate-like work happened before the missing docs were present;
- which files were owned by which implementation slice;
- which changes were accepted, revised, parked, or rejected;
- which checkpoints existed before implementation and release-candidate preparation;
- which process gaps remain material to release confidence;
- the chosen disposition of `_late-orchestration-recovery/` after recovery is applied.

Do not invent precise subagent events if the record does not support them. If the evidence is incomplete, label the item as `unknown` or `inferred`.

## 9. Run hardening reviews before release

Run these focused reviews from the current repo state.

### 9.1 Config/posture semantic review

Compare generated `config candidate --profile <profile>` output against:

```text
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md
```

Check especially:

- `review-only` should not be accidentally write-capable if the spec says read-only;
- `safe-interactive` should not silently become auto-review if the spec says user-reviewed;
- `autonomous-audited` should match the intended approval/sandbox/network posture;
- `full-access-reviewed` must be described as reviewed unsandboxed operation, not sandboxed safety;
- network settings must use documented/current config shapes or be clearly labeled candidate/unknown.

Patch material mismatches and add tests for generated candidate content.

### 9.2 README and release-doc consistency review

Check whether public docs still say v0.2 commands are not implemented even though they now exist.

Patch stale wording in:

```text
README.md
REVIEW.md
.codex-uplift/release-candidate-review.md
```

if the current implementation contradicts the docs.

### 9.3 Manifest and index consistency review

Verify that the planning-suite `MANIFEST.md` and doc index include the newly added orchestration/worktree docs.

Verify that package install manifests are not confused with planning-suite manifests.

### 9.4 Delegation/worktree release-confidence review

Use the newly added orchestration/worktree docs to decide whether the current release candidate has a material process risk.

If the risk is only historical/process provenance, record it and continue. If the risk affects code correctness, config safety, install safety, or release readiness, patch it before release checkpoint.

## 10. Verification

After recovery edits and any hardening patches, run the relevant verification stack.

At minimum:

```bash
npm test
npm run smoke
node bin/codex-uplift-init.mjs --help
node bin/codex-uplift-init.mjs verify
npm pack --dry-run
git diff --check
```

Also run targeted temp-home commands if related code changed:

```bash
node bin/codex-uplift-init.mjs inspect --home <tmp-codex-home> --user-home <tmp-user-home>
node bin/codex-uplift-init.mjs install --dry-run --home <tmp-codex-home> --user-home <tmp-user-home>
node bin/codex-uplift-init.mjs install --mode plugin --home <tmp-codex-home> --user-home <tmp-user-home>
node bin/codex-uplift-init.mjs config candidate --profile safe-interactive --home <tmp-codex-home> --user-home <tmp-user-home>
node bin/codex-uplift-init.mjs status --home <tmp-codex-home> --user-home <tmp-user-home>
node bin/codex-uplift-init.mjs uninstall --dry-run --home <tmp-codex-home> --user-home <tmp-user-home>
```

Record commands and results in:

```text
.codex-uplift/test-log.md
.codex-uplift/validation-log.md
```

## 11. End state

When recovery is complete, update:

```text
.codex-uplift/release-candidate-review.md
```

State one of:

```text
release candidate remains acceptable
release candidate acceptable after patches
release candidate held for specific defects
```

Also update or create:

```text
.codex-uplift/post-implementation-orchestration-reconciliation.md
```

and record whether `_late-orchestration-recovery/` is being archived as provenance or scheduled for deliberate cleanup after its contents and outcome are captured.

Then stop.

Do not publish, version-bump, tag, push, create a release, mutate real user-home config, or begin v0.3 without explicit user approval.
