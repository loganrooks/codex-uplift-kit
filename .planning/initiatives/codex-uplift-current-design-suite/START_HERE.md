# START_HERE.md

Date: 2026-04-30

Status: parent planning-suite entrypoint

You are entering the post-review design/governance suite for `codex-uplift-kit`.
This suite is not the npm package payload. It is the initiative documentation that guides development of the package from a v0.1 bootstrap scaffold toward a v0.2 Codex setup/posture assistant while preserving seams for v0.3+.

Expected location inside the implementation repo:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

## 1. Recovery override

Before normal onboarding, check whether this directory contains:

```text
_late-orchestration-recovery/START_HERE_RECOVERY.md
```

If that file exists and recovery has not been marked applied, read it before the normal orchestrator entrypoint.

The recovery folder is an active initiative artifact while recovery is pending. Do not `.gitignore` it during recovery. Track it until the recovery outcome is recorded, then either archive it as provenance or delete it in a deliberate cleanup commit.

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

## 2. Normal orchestrator entrypoint

If no recovery package is pending, start with:

```text
CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
```

That file contains the normal source-of-truth reading order, first-task contract, required repo-local artifacts, and v0.2 acceptance criteria.

## 3. Must-read supporting files for normal onboarding

Read immediately after the orchestrator entrypoint:

```text
CODEX_UPLIFT_DOC_SUITE_INDEX.md
CODEX_UPLIFT_STATE.md
CODEX_UPLIFT_ROADMAP.md
CODEX_UPLIFT_AUTORUN_CONTRACT.md
CODEX_UPLIFT_RELEASE_CHECKPOINT.md
CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md
```

`REVIEW_RESPONSE.md` and `REVIEW_RESPONSE_V0_2_ADDENDUM.md` are review-history artifacts. Use them to understand why the suite moved in this direction. Do not treat them as the current implementation source of truth when they conflict with `STATE`, `ROADMAP`, the operational spec, or repo-local `.codex-uplift/` artifacts.

## 4. Current product posture

The target v0.2 product category is:

```text
non-destructive Codex setup/posture assistant
```

The package should inspect first, generate candidates before mutating config, keep deferrals explicit, preserve future seams, record validation, and stop at a manual release checkpoint.

Do not treat v0.2 as a generic template copier. The package should support install modes, component selection, config/profile candidates, project setup candidates, manifest/status/uninstall safety, and candidate-only hooks/rules/compaction/RTK surfaces as described in the roadmap and operational spec.

## 5. Runtime package entrypoint

The implementation package should keep:

```text
package.json -> bin.codex-uplift-init -> bin/codex-uplift-init.mjs
```

v0.2 expands `codex-uplift-init` into the command surface described in:

```text
CODEX_UPLIFT_ROADMAP.md
CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md
```

## 6. Manual gates

Do not perform any of the following without explicit user approval:

- publish to npm;
- bump the package version for release;
- create or push git tags;
- push a remote branch;
- create a GitHub release;
- mutate real user-home Codex configuration;
- enable active hooks, rules, full-access profiles, telemetry, or RTK;
- begin v0.3 implementation.

## 7. Living state and roadmap

Use `CODEX_UPLIFT_STATE.md` for current initiative state.
Use `CODEX_UPLIFT_ROADMAP.md` for the cross-version roadmap.
Use `.codex-uplift/` for repo-local implementation state, validation logs, release-candidate review, and handoffs.

Update state and roadmap at meaningful gates, not after every tiny edit. Meaningful gates include recovery applied, hardening review complete, release candidate revised, release decision made, and v0.3 initiative opened.
