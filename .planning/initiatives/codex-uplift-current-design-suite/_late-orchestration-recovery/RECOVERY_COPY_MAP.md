# RECOVERY_COPY_MAP.md

Date: 2026-04-30

Subject: Where the late orchestration recovery files belong

## 0. Destination root

Assume this package has been unpacked at:

```text
.planning/initiatives/codex-uplift-current-design-suite/_late-orchestration-recovery/
```

The destination parent is:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

## 1. Required files to copy into the parent suite root

Copy these files from `MISSING_DOCS_TO_COPY/` to the parent suite root:

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
```

These are no longer optional in the current situation because the implementation already advanced while these docs were absent.

## 2. Supporting files to copy into the parent suite root

Copy these too, but treat them as supporting references rather than mandatory first-read docs:

```text
CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md
```

They should be listed in the manifest and index, but the orchestrator does not need to reread them on every ordinary future task.

## 3. Delegation templates directory

Copy:

```text
MISSING_DOCS_TO_COPY/delegation-templates/README.md
```

to:

```text
.planning/initiatives/codex-uplift-current-design-suite/delegation-templates/README.md
```

If the destination directory already exists, merge rather than overwrite blindly.

## 4. Recovery package files

The following files may remain inside `_late-orchestration-recovery/` until the recovery pass is complete:

```text
START_HERE_RECOVERY.md
RECOVERY_CURRENT_STATE_ASSESSMENT.md
RECOVERY_COPY_MAP.md
RECOVERY_DOC_UPDATE_GUIDE.md
RECOVERY_ORCHESTRATOR_RESUME_DIRECTIVE.md
RECOVERY_EXIT_CRITERIA.md
PACKAGE_MANIFEST.md
```

After recovery is complete, either:

- keep the folder as an audit artifact, or
- move its key conclusions into `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md` and delete/archive the temporary folder in a separate, explicit cleanup commit.

Do not silently delete it during the same pass that applies the recovery.

## 5. Existing target handling

If a destination file already exists:

1. compare it against the incoming file;
2. keep the more recent/current content;
3. if both contain unique material, merge deliberately;
4. record the disposition in `.codex-uplift/post-implementation-orchestration-reconciliation.md`.

Never overwrite a more current local file just because the recovery package contains a file with the same name.
