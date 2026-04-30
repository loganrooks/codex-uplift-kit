# Codex Uplift Orchestration Docs Reconciliation

Date: 2026-04-30

## Purpose

This note reconciles a packaging/documentation mismatch in the Codex Uplift design suite.

A previous response referred to orchestration and delegation documents as if they were already present in the user-visible packaged suite. That was inaccurate for the ZIP archive that had been handed off. The files existed in the working design directory after later addenda were created, but the ZIP archive was stale and did not include the newer orchestration/delegation files.

## Correction

If the checked-in planning suite under:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

does not contain the files listed below, the orchestrator should treat them as missing post-review handoff material, not as user deletion or intentional omission.

Required orchestration/delegation files:

```text
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
CODEX_UPLIFT_DELEGATION_TEMPLATES.md
CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md
```

Recommended supporting files, if present:

```text
CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md
CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md
delegation-templates/README.md
```

## What each file is for

### `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md`

Canonical v0.2 orchestration plan. It states that the main Codex agent is the orchestrator and owns scope, state, worktree coordination, integration, verification, release-candidate preparation, and user-facing checkpoints. It defines when to delegate and what remains orchestrator-owned.

### `CODEX_UPLIFT_DELEGATION_TEMPLATES.md`

Copy-paste delegation prompts and return-shape contracts. It provides the generic subagent prompt shape and role-specific templates for evidence inventory, config/platform review, tests, release-candidate review, and related bounded passes.

### `CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md`

A sharper operational addendum requiring the orchestrator to actually use bounded subagents when available for evidence inventory, scope/deferral review, installer/config safety review, and release-candidate review. It also requires a delegation plan, delegation ledger, and disposition records.

### `CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md`

Worktree/isolation protocol. It makes worktree state, file ownership, checkpoints, integration ledgers, and write-scope boundaries first-class. It is meant to prevent parallel delegated work from creating conflicts or audit loss.

## Orchestrator instruction if these files are missing

If the orchestration/delegation files are missing from the checked-in planning suite, the orchestrator should not proceed as if orchestration guidance is absent. Instead:

1. Record the absence in `.codex-uplift/implementation-observations.md`.
2. Ask the user to provide the missing files, or reconstruct the minimal required guidance from this reconciliation note and the existing autorun/roadmap/release docs.
3. Do not start broad v0.2 implementation until an orchestration/delegation plan and worktree plan exist.
4. Create the following repo-local runtime artifacts before broad implementation:

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

## Minimal delegation doctrine to apply until the full docs are installed

- The main Codex agent is the orchestrator and integration owner.
- Subagents are bounded helpers, not product owners.
- Read-heavy and artifact-only delegation is encouraged.
- Write-heavy delegation requires explicit file ownership and either sequential integration or worktree/branch isolation.
- Shared files are orchestrator-owned by default.
- Every delegated task must have:
  - task boundary,
  - allowed write scope,
  - required artifact path,
  - expected return shape,
  - sandbox/approval expectation,
  - verification expectation,
  - orchestrator disposition.
- Delegated outputs must be dispositioned as `accept`, `revise`, `park`, or `reject` before integration.
- Do not delegate release publication, npm publishing, git tagging/pushing, live user-home config activation, or final product judgment.

## Minimal required delegated passes for v0.2, if subagents are available

```text
A1 evidence inventory pass
B1 scope/deferral review pass
D1 installer/config safety test review
E1 release-candidate independent review
```

Each pass should write its full result under:

```text
.codex-uplift/delegated/
```

and return only status, artifact path, concise summary, verification performed, open questions, and risks/conflicts.

## Packaging lesson

Future design-suite packaging must verify archive contents against `MANIFEST.md` before handoff. The validation step should run something equivalent to:

```bash
unzip -l codex-uplift-current-design-suite.zip | sort > /tmp/archive-files.txt
find codex-uplift-current-design-suite -type f | sort > /tmp/source-files.txt
# Then compare expected manifest entries against archive contents.
```

The package should not claim that a document is available to the orchestrator unless it is either:

1. checked into the planning-suite directory in the repo, or
2. directly attached/provided to the orchestrator as a separate artifact.

