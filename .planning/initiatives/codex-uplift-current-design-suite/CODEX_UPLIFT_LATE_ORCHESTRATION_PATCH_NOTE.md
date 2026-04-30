# CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md

Date: 2026-04-30

Subject: Late integration note for missing orchestration/delegation/worktree planning docs

## 0. Situation

The `codex-uplift-current-design-suite` directory that was placed in the repo did not include the later orchestration/delegation/worktree documents. The orchestrator appears to have already implemented a substantial v0.2 slice, including CLI command seams, install modes, manifest/status/uninstall, config candidate generation, candidate-only project/hooks/rules/compact/RTK seams, safety tests, and release-candidate artifacts.

Therefore this note is **not** an instruction to restart v0.2 or rewrite the current implementation. It is a late patch to restore missing planning doctrine and to perform a bounded retrofit review.

## 1. Why this happened

The prior suite artifact and manifest were stale relative to later generated planning docs. The missing docs were referred to in conversation before they were actually present in the repo copy. Treat this as a planning-suite packaging/provenance mismatch, not as evidence that the implementation work is invalid.

## 2. Files to add to the planning suite

Add the following files under:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

Required missing files:

```text
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
CODEX_UPLIFT_DELEGATION_TEMPLATES.md
CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md
CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md
```

Supporting files, if not already present:

```text
CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md
delegation-templates/README.md
```

## 3. Expected file versions

Use the versions identified by these byte sizes and SHA-256 digests:

| File | Bytes | SHA-256 |
|---|---:|---|
| `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md` | 14898 | `2eb2e6c45a295f8aabce1ea90e5db8167820a61b029ef410b3af7c456408c77f` |
| `CODEX_UPLIFT_DELEGATION_TEMPLATES.md` | 12898 | `7577de52f8a5ade114e6224947599c77b33da6d50e4bccdd3e10804daf9ab904` |
| `CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md` | 19769 | `32c8fb2074c258c04b5a6f5f1e32f4844e0d266fe9f25300acbb54e757b3122d` |
| `CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md` | 19103 | `881df62c47dada694d4bc611a952275ea5deff7fcad2885a0cf06a1c6f3f0dcb` |
| `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md` | 5468 | `df6c8e4545e1ffa0a76901ac9d4fc796d92f82fa1404861310f924c4bfbff364` |
| `CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md` | 16351 | `f6555cdbf9f1b1992365d6b049ee5c99852a6fcff7271515aa92016d0485eccd` |
| `CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md` | 16645 | `a5ea62146bda5b76f6234233501b5cb2a142a67b2094e2a922377321a62e41db` |
| `delegation-templates/README.md` | 1309 | `7e12508f9333545b798b658373ec67632f038b773b46866c3a346d570adafcfe` |

## 4. How to handle the fact that implementation already happened

Do not retroactively pretend that delegation/worktree planning happened before the v0.2 work. Instead:

1. Add the missing planning docs.
2. Update the suite manifest and index so the docs are discoverable.
3. Create a repo-local retrospective artifact:

   ```text
   .codex-uplift/late-orchestration-patch-review.md
   ```

4. In that artifact, answer:
   - What v0.2 work was already implemented before these docs were added?
   - Which orchestration/delegation/worktree practices were effectively followed anyway?
   - Which practices were not followed or are not evidenced?
   - Does any implemented code need follow-up because of missing worktree/delegation discipline?
   - Are any v0.2 release-candidate claims weakened by the missing docs?
   - What should be deferred to v0.3 rather than forced into v0.2 now?

5. If subagents are available, run at least one bounded read-only review after adding these docs:

   ```text
   Review the current v0.2 implementation and release-candidate artifacts against
   CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md and
   CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md.

   Do not edit files. Write findings to:
   .codex-uplift/orchestration-retrofit-review.md

   Return only:
   - status
   - artifact path
   - top findings
   - release-blocking concerns, if any
   - recommended v0.2 vs v0.3 disposition
   ```

6. Disposition that review explicitly as `accept`, `revise`, `park`, or `reject` before release.

## 5. START_HERE vs orchestrator entrypoint

Starting at `START_HERE.md` instead of `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` is not fatal. `START_HERE.md` itself points to the orchestrator entrypoint and frames the suite correctly. The risk is narrower: because the orchestration/delegation/worktree docs were absent, the orchestrator could not have followed those missing surfaces. Treat that as a late-process gap to review and document, not as automatic invalidation of the implementation.

## 6. Current implementation should be treated as a candidate, not discarded

The current implementation appears to have already addressed many v0.2 roadmap items. The correct next step is not to redo the work, but to reconcile the late docs with the current state:

- preserve working implementation unless a concrete defect is found;
- add the missing planning docs;
- update the planning-suite manifest/index;
- run or re-run lightweight verification;
- perform an orchestration/worktree/delegation retrofit review;
- update the release-candidate review with the retrofit disposition.

## 7. Verification after applying this note

At minimum run:

```bash
git status --short
git diff --check
npm test
npm run smoke
node bin/codex-uplift-init.mjs verify
```

If only planning docs changed and the implementation was not touched, `git diff --check` plus a documentation-readability check may be sufficient, but because the package is near a release checkpoint, rerunning the lightweight package checks is recommended.

## 8. Release boundary

Do not publish to npm, bump the package version, create or push tags, push release branches, or create a GitHub release until the user explicitly approves the release checkpoint.
