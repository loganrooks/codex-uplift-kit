# CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md

Date: 2026-04-30

Subject: Current-repo reconciliation note after late orchestration/worktree docs were discovered missing

## 0. Purpose

This note is for the Codex orchestrator that has already begun implementing `codex-uplift-kit` v0.2 while the planning suite in the repository was missing several orchestration, delegation, and worktree documents.

Do **not** restart v0.2 from scratch. Do **not** discard the implementation already produced. Instead, perform a bounded reconciliation pass:

1. add the missing planning documents;
2. confirm whether current implementation work already satisfies their requirements;
3. create any missing orchestration/worktree/delegation artifacts;
4. patch only the gaps that materially affect v0.2 release-candidate quality;
5. preserve v0.3 seams explicitly.

## 1. Observed current state

The checked-in planning suite currently used by the orchestrator appears to have started from `START_HERE.md`. That is acceptable. `START_HERE.md` explicitly points to `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md`, which contains the actual source-of-truth reading order and first-task contract.

The gap is not that `START_HERE.md` is the wrong entry point. The gap is that later orchestration/delegation/worktree documents were absent from the checked-in suite, so the orchestrator could not read documents that were not present.

The current repo state indicates that substantial v0.2 work has already happened:

- `package.json` now has `test = node --test` in addition to smoke/pack scripts.
- `bin/codex-uplift-init.mjs` now exposes v0.2-like commands and profiles including `inspect`, `status`, `uninstall`, `config doctor`, `config candidate`, `project inspect`, `rules candidate`, `hooks candidate`, `compact candidate`, `rtk evaluate --plan-only`, install modes, component IDs, manifest handling, and posture candidates.
- `.codex-uplift/implementation-observations.md`, `.codex-uplift/v0.2-scope-map.md`, `.codex-uplift/v0.2-implementation-plan.md`, and `.codex-uplift/validation-log.md` exist and show that the orchestrator followed the entrypoint contract to a meaningful degree.
- `test/installer-safety.test.mjs` exists and covers many review-driven safety behaviors: plugin mode, marketplace path resolution, duplicate-skill warning behavior, manifest/status/uninstall, candidate behavior, forced backup behavior, dry-run behavior, hook output shapes, and package hygiene.

Therefore, the missing orchestration docs should be treated as a **late hardening patch**, not as a reason to invalidate the current implementation.

## 2. Files that were missing from the checked-in planning suite

Add these files to:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

Required missing files:

| File | Bytes | SHA-256 |
|---|---:|---|
| `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md` | 14898 | `2eb2e6c45a295f8aabce1ea90e5db8167820a61b029ef410b3af7c456408c77f` |
| `CODEX_UPLIFT_DELEGATION_TEMPLATES.md` | 12898 | `7577de52f8a5ade114e6224947599c77b33da6d50e4bccdd3e10804daf9ab904` |
| `CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md` | 19769 | `32c8fb2074c258c04b5a6f5f1e32f4844e0d266fe9f25300acbb54e757b3122d` |
| `CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md` | 19103 | `881df62c47dada694d4bc611a952275ea5deff7fcad2885a0cf06a1c6f3f0dcb` |
| `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md` | 5468 | `df6c8e4545e1ffa0a76901ac9d4fc796d92f82fa1404861310f924c4bfbff364` |

Recommended supporting files:

| File | Bytes | SHA-256 |
|---|---:|---|
| `CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md` | 16351 | `f6555cdbf9f1b1992365d6b049ee5c99852a6fcff7271515aa92016d0485eccd` |
| `CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md` | 16645 | `a5ea62146bda5b76f6234233501b5cb2a142a67b2094e2a922377321a62e41db` |
| `delegation-templates/README.md` | 1309 | `7e12508f9333545b798b658373ec67632f038b773b46866c3a346d570adafcfe` |

Post-implementation notes to add as late reconciliation artifacts:

| File | Bytes | SHA-256 |
|---|---:|---|
| `CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md` | 9360 | `f963d07b47e466c5d758c71db8ac251a81b0833107f7f289db9d88ca462a97cd` |
| `CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md` | 6136 | `598e1fb57311a1c27d6891380f2c04fd5b4d204c5ed5945ec1e8f342d40ee178` |
| `CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md` | this file | recompute after copy |

## 3. Immediate orchestrator instruction

After adding the missing files, the orchestrator should run this reconciliation sequence:

```text
1. Read CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md.
2. Read CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md.
3. Read CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md.
4. Read CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md.
5. Read CODEX_UPLIFT_DELEGATION_TEMPLATES.md.
6. Read CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md.
7. Read CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md.
8. Compare current .codex-uplift artifacts and implementation against these docs.
9. Create a repo-local reconciliation artifact.
10. Patch only material gaps.
```

The repo-local artifact should be:

```text
.codex-uplift/orchestration-reconciliation.md
```

Minimum contents:

```text
# Orchestration Reconciliation

Observed implementation state:
- ...

Late-added planning docs:
- ...

Already satisfied:
- ...

Material gaps to patch before v0.2 release candidate:
- ...

Non-material gaps deferred:
- Capability:
  Target horizon:
  Preserved seam:
  What v0.2 must not do:
  Revisit trigger:

Worktree/delegation state:
- ...

Verification run:
- ...
```

## 4. What to check against the current implementation

### 4.1 Entry point impact

Do **not** treat use of `START_HERE.md` as a major defect. Check only:

- Did the orchestrator actually read or follow `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md`?
- Were the required `.codex-uplift` artifacts created?
- Were `STATE`, `ROADMAP`, and deferral artifacts updated after implementation reality changed?
- Was there a release-candidate stop before publish/tag/push/live config mutation?

If yes, starting from `START_HERE.md` was not materially harmful.

### 4.2 Orchestration/delegation gap

Check whether the current repo has:

```text
.codex-uplift/delegation-plan.md
.codex-uplift/delegation-ledger.md
.codex-uplift/delegation-dispositions.md
```

If missing, create a concise retrospective version rather than pretending it existed before implementation. Mark it as retrospective:

```text
Status: retrospective reconstruction after late planning-doc patch
```

Capture:

- which delegate-like passes were actually run;
- which were not run;
- which current implementation areas need independent review now;
- which remaining review passes should be run before release candidate.

### 4.3 Worktree/isolation gap

Check whether the current repo has:

```text
.codex-uplift/worktree-state.md
.codex-uplift/worktree-plan.md
.codex-uplift/file-ownership-map.md
.codex-uplift/integration-ledger.md
.codex-uplift/checkpoint-ledger.md
```

If missing, create concise retrospective versions.

The worktree-state artifact should record:

- current branch;
- `git status --short` output;
- whether implementation happened in local checkout, app worktree, or other worktree;
- any uncommitted changes;
- whether there are generated artifacts or temp files;
- checkpoint/commit state.

### 4.4 Implementation-specific review passes now needed

Because orchestration/worktree docs arrived late, run at least these post-hoc reviews before release candidate:

1. **CLI/config semantics review**
   - Check that generated config candidate keys match current Codex docs.
   - Verify `review-only`, `safe-interactive`, `autonomous-audited`, `install-window`, `net-limited`, `full-access-reviewed`, `external-isolated`, and `ci-noninteractive` labels do not overclaim safety.
   - Confirm `full-access-reviewed` is described as reviewed unsandboxed operation, not sandboxed safety.

2. **Installer safety review**
   - Confirm existing files are preserved by default.
   - Confirm `--force` backs up before overwrite.
   - Confirm manifest/status/uninstall never deletes modified or unowned files.
   - Confirm plugin mode does not silently duplicate standalone skills.
   - Confirm marketplace paths resolve from the documented marketplace root.

3. **Candidate-only surface review**
   - Confirm hooks, rules, compaction prompts, project config, full-access profiles, and RTK remain candidate/evaluation-only unless explicitly enabled.
   - Confirm no live user-home config mutation happens during tests.

4. **Planning-doc consistency review**
   - Update `MANIFEST.md`, `CODEX_UPLIFT_DOC_SUITE_INDEX.md`, `CODEX_UPLIFT_STATE.md`, and `CODEX_UPLIFT_ROADMAP.md` to include the late orchestration/worktree documents.
   - Make sure `START_HERE.md` and `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` both mention the late reconciliation note if they are updated.

5. **Release-candidate review**
   - Review the full diff.
   - Run `npm test`, `npm run smoke`, and `npm pack --dry-run`.
   - Create or update `.codex-uplift/release-candidate-review.md`.
   - Stop before npm publish, git tag, remote push, GitHub release, or live user config activation.

## 5. What not to do

Do not:

- restart the implementation solely because the late docs were missing;
- rewrite working code just to conform to document phrasing;
- manufacture fake delegation history;
- claim subagents were used if they were not;
- enable hooks, rules, full-access profiles, telemetry, RTK, or live config changes to compensate for missing planning docs;
- publish/tag/push before the release checkpoint.

## 6. Patch priority

The priority order is:

1. Add missing planning documents and update manifest/index/state/roadmap references.
2. Create `.codex-uplift/orchestration-reconciliation.md`.
3. Create retrospective delegation/worktree artifacts if missing.
4. Run post-hoc independent review passes.
5. Patch material implementation/doc/test gaps.
6. Re-run verification.
7. Stop at release-candidate checkpoint.

## 7. Release decision

After reconciliation, the orchestrator may prepare a release candidate, but the user must decide whether to:

```text
ship v0.2.0
ship v0.2.0-alpha.N
hold for additional review
revise implementation
start a separate v0.3 planning pass
```

The late orchestration docs should improve the release candidate. They should not become an excuse to blur release gates or silently move v0.3 work into v0.2.
