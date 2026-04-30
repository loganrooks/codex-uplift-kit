# CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md

Date: 2026-04-30

Subject: Retrofit handoff after v0.2 implementation began before orchestration/worktree documents were present

## 0. Purpose

This note is for the Codex orchestrator now operating in a repo where substantial `codex-uplift-kit` v0.2 work has already been implemented, but several orchestration, delegation, and worktree guidance documents were not present in the planning suite when the work began.

This is **not** a restart instruction. It is a bounded retrofit plan.

The orchestrator should:

1. add the missing planning-suite documents;
2. reconcile them against the current implementation state;
3. create retrospective orchestration/worktree/delegation artifacts where absent;
4. run targeted post-hoc review passes;
5. patch only material release-candidate gaps;
6. stop at the manual release checkpoint.

## 1. Current repo state observed

The current repo appears to have moved well past the original v0.1 bootstrap prototype.

Observed implemented or present surfaces:

- `package.json` still declares version `0.1.0`, but now includes `test = node --test` and keeps `codex-uplift-init` mapped to `bin/codex-uplift-init.mjs`.
- `bin/codex-uplift-init.mjs` now exposes many v0.2 command surfaces: `inspect`, install modes, component selection, `status`, `uninstall`, `config doctor`, `config candidate`, candidate seams for project/rules/hooks/compact/RTK, `verify`, manifest handling, and posture candidate generation.
- `.codex-uplift/implementation-observations.md`, `.codex-uplift/v0.2-scope-map.md`, `.codex-uplift/v0.2-implementation-plan.md`, `.codex-uplift/v0.2-deferral-check.md`, `.codex-uplift/validation-log.md`, `.codex-uplift/change-log.md`, `.codex-uplift/test-log.md`, `.codex-uplift/release-candidate-review.md`, and `.codex-uplift/v0.3-handoff.md` exist.
- `test/installer-safety.test.mjs` exists and covers many safety-critical installer behaviors.
- `.codex-uplift/release-candidate-review.md` recommends `ship-alpha`, not stable release, and explicitly leaves version bump / npm publish / git tag as manual gates.

Interpretation:

```text
Current state = substantial v0.2 release-candidate implementation exists.
Correct next move = reconciliation and targeted patching.
Incorrect next move = restart implementation from scratch.
```

## 2. Was using `START_HERE.md` as entry point damaging?

Probably not materially.

`START_HERE.md` is a valid human-facing entry point and explicitly points to `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` as the orchestrator source-of-truth entry point. The likely issue is not that the wrong entry point was used. The issue is that the checked-in planning suite did not include the later orchestration/delegation/worktree documents, so the orchestrator could not follow guidance that was absent.

Therefore:

- Do not invalidate completed work merely because the session began at `START_HERE.md`.
- Do not fabricate that the missing docs were read earlier.
- Do perform a post-hoc reconciliation pass and document what the missing docs would have changed.

## 3. Missing documents to add

Add these files under:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

### 3.1 Required missing planning docs

| File | Bytes | SHA-256 |
|---|---:|---|
| `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md` | 14898 | `2eb2e6c45a295f8aabce1ea90e5db8167820a61b029ef410b3af7c456408c77f` |
| `CODEX_UPLIFT_DELEGATION_TEMPLATES.md` | 12898 | `7577de52f8a5ade114e6224947599c77b33da6d50e4bccdd3e10804daf9ab904` |
| `CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md` | 19769 | `32c8fb2074c258c04b5a6f5f1e32f4844e0d266fe9f25300acbb54e757b3122d` |
| `CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md` | 19103 | `881df62c47dada694d4bc611a952275ea5deff7fcad2885a0cf06a1c6f3f0dcb` |
| `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md` | 5468 | `df6c8e4545e1ffa0a76901ac9d4fc796d92f82fa1404861310f924c4bfbff364` |

### 3.2 Recommended supporting docs

| File | Bytes | SHA-256 |
|---|---:|---|
| `CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md` | 16351 | `f6555cdbf9f1b1992365d6b049ee5c99852a6fcff7271515aa92016d0485eccd` |
| `CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md` | 16645 | `a5ea62146bda5b76f6234233501b5cb2a142a67b2094e2a922377321a62e41db` |
| `delegation-templates/README.md` | 1309 | `7e12508f9333545b798b658373ec67632f038b773b46866c3a346d570adafcfe` |

### 3.3 Late retrofit notes

Also add these notes:

| File | Purpose |
|---|---|
| `CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md` | Explains the packaging/provenance mismatch and bounded reconciliation posture. |
| `CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md` | Gives post-implementation orchestration hardening instructions. |
| `CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md` | Gives a concise orchestrator patch note for the late docs. |
| `CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md` | This file; current-state-aware retrofit plan. |

## 4. Already satisfied or mostly satisfied

Do not spend time redoing these unless the verification pass contradicts them.

### 4.1 Entrypoint / state discipline

The repo has the expected `.codex-uplift` planning artifacts. This means the orchestrator appears to have followed the entrypoint contract to a meaningful degree even though the later orchestration docs were missing.

### 4.2 v0.2 CLI surface baseline

The CLI already has the broad v0.2 command surface. The next work should inspect correctness and semantics rather than re-adding the same command names.

### 4.3 Installer safety baseline

The test suite already covers many review-driven safety behaviors:

- temp-home install;
- plugin mode;
- marketplace path resolution;
- duplicate skill behavior;
- manifest/status/uninstall;
- candidate behavior;
- forced backup behavior;
- dry-run behavior;
- hook output shapes;
- junk-file exclusion.

The post-hoc review should verify these tests still pass and identify missing assertions, not start with an assumption that no safety work exists.

### 4.4 Release gate boundary

The current release-candidate review does not publish. It recommends alpha and keeps version bump / npm publish / tag / push as manual gates. Preserve that boundary.

## 5. Material gaps exposed by the missing orchestration/worktree docs

The missing docs do not necessarily invalidate the implementation, but they leave some review gaps.

### 5.1 No explicit delegation/worktree artifacts

The current implementation plan includes high-level delegation rules, including disjoint write scopes and delegate return requirements. But the repo does not appear to have the concrete artifacts that the late docs would require, such as:

```text
.codex-uplift/delegation-plan.md
.codex-uplift/delegation-ledger.md
.codex-uplift/delegation-dispositions.md
.codex-uplift/worktree-state.md
.codex-uplift/worktree-plan.md
.codex-uplift/file-ownership-map.md
.codex-uplift/integration-ledger.md
.codex-uplift/checkpoint-ledger.md
```

Action:

Create retrospective versions. Do **not** pretend they existed before implementation. Mark them clearly:

```text
Status: retrospective reconstruction after late orchestration-doc patch
```

The goal is to recover auditability and release confidence, not to falsify process history.

### 5.2 Config/posture semantics need a dedicated review

This is the most important implementation-specific gap found in the current partial state.

The planning-suite posture spec defines candidate profiles with specific expected shapes: for example, `review-only` should be read-only with user review and high reasoning; `safe-interactive` should be workspace-write, user-reviewed, network off, and login shell disabled; `autonomous-audited` should remain workspace-write with `auto_review`, network off, and compensating controls; `full-access-reviewed` should use `danger-full-access` with `auto_review` and strong reviewed-unsandboxed warnings.

The current CLI has profile candidate generation, but the generated candidate values should be reconciled against that posture spec and current Codex docs before release. In particular, review whether:

- `config candidate --profile review-only` incorrectly grants workspace write or auto-review when the spec expects read-only/user-reviewed review posture;
- `safe-interactive` should default to user review rather than auto-review;
- `autonomous-audited` should use `on-request` rather than `on-failure`, and whether `default_permissions` / network-off candidates should be included or explicitly deferred;
- `net-limited` uses the correct config key/path for network access rather than a guessed `[features] network_access` shape;
- `full-access-reviewed` should use `auto_review` if it is meant to represent the user's preferred reviewed full-access posture, or be renamed if it is actually human-reviewed;
- `external-isolated` records the external boundary instead of implying workspace-write alone captures isolation;
- `ci-noninteractive` should omit or caveat `auto_review` when `approval_policy = "never"` means there may be no prompts to auto-review.

Action:

Add golden/content tests for `config candidate --profile <profile>` outputs. The existing test suite appears to verify candidate command dry-run behavior but not profile content correctness. A release candidate should not rely on command existence alone for posture semantics.

### 5.3 README and public docs may be stale relative to implementation

The current README says some intended v0.2 commands are not present in the current v0.1-style CLI. That appears stale if the current CLI now implements the v0.2 command surface. Patch the README so it does not understate or misstate the actual command surface.

Action:

Update README and any release notes so they distinguish:

```text
implemented commands
candidate-only minimal seams
explicit deferrals
manual release gates
```

### 5.4 Candidate-only seams should not be overclaimed

The release-candidate review correctly calls project/hooks/rules/compact/RTK surfaces candidate-only. The README/product docs should mirror this. Do not describe `project candidate`, `hooks candidate`, `rules candidate`, `compact candidate`, or `rtk evaluate` as fully mature if the current commands only write generic candidate artifacts or plan-only output.

Action:

Document them as v0.2 seams, not full v0.3 implementations.

### 5.5 Design-suite manifest/index are stale

The repo planning-suite `MANIFEST.md` does not include the late orchestration/worktree docs. After adding the files, update:

```text
.planning/initiatives/codex-uplift-current-design-suite/MANIFEST.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_DOC_SUITE_INDEX.md
.planning/initiatives/codex-uplift-current-design-suite/START_HERE.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_STATE.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP.md
```

The entrypoint files should say that the late orchestration/worktree docs are now part of the source-of-truth reading order, but that the current repo may already contain a v0.2 release-candidate implementation and therefore should use the retrofit flow.

## 6. Required repo-local retrofit artifacts

Create these before further implementation patches:

```text
.codex-uplift/post-implementation-orchestration-reconciliation.md
.codex-uplift/delegation-retrospective.md
.codex-uplift/worktree-state.md
.codex-uplift/file-ownership-map.md
.codex-uplift/integration-ledger.md
.codex-uplift/checkpoint-ledger.md
```

Minimum required contents:

### 6.1 `post-implementation-orchestration-reconciliation.md`

```text
- planning docs absent when implementation began
- planning docs now added
- current implementation surfaces observed
- what the late docs would have required
- what is already satisfied
- what must be patched before release
- what is parked for v0.3+
- final disposition: accept | revise | park | reject
```

### 6.2 `delegation-retrospective.md`

```text
- delegate-like passes actually performed
- evidence from change-log / validation-log
- passes not performed because docs were absent
- post-hoc review passes still required
- whether any process gap creates release risk
```

### 6.3 `worktree-state.md`

```text
- current branch
- git status --short
- current HEAD
- whether edits are committed or uncommitted
- whether implementation happened in a dedicated worktree or main checkout
- checkpoint state before further edits
- risk assessment for continuing
```

### 6.4 `file-ownership-map.md`

```text
- orchestrator-owned shared files
- docs/planning files
- CLI files
- test files
- templates
- files safe for parallel review only
- files not to edit before release gate
```

### 6.5 `integration-ledger.md`

```text
- implementation chunks accepted
- review/fix passes accepted
- material findings patched
- parked findings and deferral IDs
```

### 6.6 `checkpoint-ledger.md`

```text
- commits/checkpoints before retrofit
- commits/checkpoints after adding missing docs
- commits/checkpoints after patching any material issues
- rollback guidance
```

## 7. Required post-hoc review passes

Run these before final release recommendation.

### 7.1 Config/posture semantic review — highest priority

Scope:

```text
bin/codex-uplift-init.mjs
templates/config/config.fragment.toml
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md
test/installer-safety.test.mjs
README.md
.codex-uplift/release-candidate-review.md
```

Expected artifact:

```text
.codex-uplift/reviews/config-posture-semantic-review.md
```

Expected output:

```text
status:
artifact_path:
profile_mismatches:
platform_doc_unknowns:
recommended_code_patches:
recommended_test_patches:
release_impact: accept | revise-before-alpha | park-for-v0.3
```

### 7.2 Worktree/orchestration hygiene review

Scope:

```text
.codex-uplift/*
.planning/initiatives/codex-uplift-current-design-suite/*
AGENTS.md
```

Expected artifact:

```text
.codex-uplift/reviews/worktree-orchestration-hygiene-review.md
```

### 7.3 Design-suite consistency review

Scope:

```text
.planning/initiatives/codex-uplift-current-design-suite/START_HERE.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_DOC_SUITE_INDEX.md
.planning/initiatives/codex-uplift-current-design-suite/MANIFEST.md
.planning/initiatives/codex-uplift-current-design-suite/*.md
```

Expected artifact:

```text
.codex-uplift/reviews/design-suite-consistency-review.md
```

### 7.4 Release-candidate independent review

Scope:

```text
full v0.2 diff / current repo state relevant to v0.2
```

Expected artifact:

```text
.codex-uplift/reviews/release-candidate-independent-review.md
```

This review should answer:

```text
ship-alpha now?
revise before alpha?
hold for stable?
```

## 8. Patch priority from current state

Priority order:

1. Add missing docs and update suite manifest/index/source-order docs.
2. Create retrospective orchestration/worktree artifacts.
3. Run config/posture semantic review.
4. Patch profile candidate generation and tests if mismatches are confirmed.
5. Patch stale README/release docs.
6. Re-run tests and package checks.
7. Update release-candidate review.
8. Stop for user release decision.

Do not expand v0.2 into v0.3 project determiner, adaptive posture routing, compaction prompt switching, RTK integration, telemetry, or live config merge.

## 9. Verification after retrofit

Run at minimum:

```bash
git status --short
npm test
npm run smoke
node bin/codex-uplift-init.mjs --help
node bin/codex-uplift-init.mjs verify
npm pack --dry-run
git diff --check
```

If profile output is patched, also run or add tests that check each profile's generated candidate content.

If package publishing is considered, run:

```bash
npm publish --dry-run
```

Use a temp npm cache if the local environment has cache ownership issues. Do not publish without explicit user approval.

## 10. Copy-paste directive for the orchestrator

```text
The v0.2 implementation has already advanced substantially. Do not restart.

A late planning-suite patch is being added because orchestration, delegation, and worktree docs were missing when implementation began. Treat this as a retrofit review and hardening pass.

First, add/read:
- CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md
- CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md
- CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md
- CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md
- CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
- CODEX_UPLIFT_DELEGATION_TEMPLATES.md
- CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
- CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md
- CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md

Then create/update:
- .codex-uplift/post-implementation-orchestration-reconciliation.md
- .codex-uplift/delegation-retrospective.md
- .codex-uplift/worktree-state.md
- .codex-uplift/file-ownership-map.md
- .codex-uplift/integration-ledger.md
- .codex-uplift/checkpoint-ledger.md

Run targeted post-hoc reviews, starting with config/posture semantic review. Patch material mismatches before release-candidate approval. Update README/release artifacts if they are stale relative to the current CLI.

Do not publish to npm, bump version, tag, push, create a GitHub release, mutate live user-home config, enable active hooks/rules/full-access profiles, or start v0.3 without explicit user approval.
```
