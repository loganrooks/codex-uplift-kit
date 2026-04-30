# CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md

Date: 2026-04-30

Subject: Worktree isolation, orchestration discipline, and integration protocol for `codex-uplift-kit` v0.2+

## 0. Purpose

This addendum closes a gap in the existing post-review suite: the suite already says that the main Codex agent is the orchestrator and that write-heavy delegation must avoid conflicts, but it does not yet make worktree isolation and integration discipline explicit enough.

This document should be read after:

```text
CODEX_UPLIFT_AUTORUN_CONTRACT.md
CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
```

and before implementation begins.

The goal is to ensure that v0.2 implementation of `codex-uplift-kit` uses the same orchestration practices that the kit itself should later teach users: bounded autonomy, clean state, explicit ownership, isolated work where appropriate, reviewable integration, and reversible checkpoints.

## 1. Platform baseline

### 1.1 Codex worktrees

Codex app worktrees use Git worktrees under the hood. They let Codex run independent tasks in the same project without disturbing the user’s local checkout. In Git repositories, Codex automations run on dedicated background worktrees; in non-version-controlled projects, automations run directly in the project directory.

Important practical details:

- Worktrees require a Git repository.
- A worktree is a second checkout that shares Git metadata with the original repository.
- Codex-managed worktrees are often detached HEADs until the user creates a branch.
- Git does not allow the same branch to be checked out in more than one worktree at the same time.
- Handoff moves work safely between Local and Worktree, but ignored files do not move with the thread.
- Worktrees can consume significant disk space because dependencies and build caches may be duplicated.

### 1.2 Subagents and write conflicts

Subagents are useful for context hygiene and parallelism, especially read-heavy exploration, tests, triage, and summarization. They are riskier for write-heavy parallel workflows because concurrent edits can create conflicts and coordination overhead.

Therefore, the default orchestration stance for this initiative is:

```text
Read-heavy delegation: encouraged when useful.
Write-heavy delegation: only with explicit file ownership, worktree/branch isolation, or sequential integration.
Shared-file changes: orchestrator-owned unless explicitly isolated and reviewed.
```

### 1.3 Sandbox and approval posture do not replace worktree isolation

Sandboxing, approvals, rules, hooks, and worktrees address different risks.

- Sandbox/permissions constrain what commands can touch.
- Approval policy controls when Codex must pause before acting.
- Rules/hooks can add lifecycle guardrails.
- Worktrees isolate file changes and make integration/review easier.
- Git checkpoints and commits provide recovery points.

A permissive posture such as `full-access-reviewed` may still be useful for trusted or externally isolated situations, but it does not make parallel write work safe. Worktree isolation and clean integration discipline are still required.

## 2. Orchestrator-owned integration model

The main Codex agent is the integration owner.

It must own:

- the canonical implementation plan;
- state and roadmap updates;
- worktree/workspace selection;
- branch/checkpoint policy;
- delegated task boundaries;
- file ownership map;
- review and disposition of delegated artifacts;
- final integration;
- release-candidate checkpoint;
- final user-facing summary.

No subagent owns the product, the release decision, or final integration.

## 3. Required worktree artifacts

Before substantive v0.2 implementation, create these repo-local artifacts:

```text
.codex-uplift/worktree-state.md
.codex-uplift/worktree-plan.md
.codex-uplift/file-ownership-map.md
.codex-uplift/integration-ledger.md
.codex-uplift/checkpoint-ledger.md
```

These may be separate files or sections inside the existing implementation artifacts if the orchestrator determines that separate files would be unnecessary ceremony. If they are collapsed, the orchestrator must state where each required surface lives.

### 3.1 `worktree-state.md`

Record:

```markdown
# Worktree State

- Current directory:
- Git repo detected: yes/no
- Current branch:
- HEAD commit:
- Detached HEAD: yes/no
- Existing worktrees: output of `git worktree list --porcelain` if available
- Dirty state: clean/dirty
- Dirty files:
- Untracked files:
- Stashes:
- Current task owns existing dirty state: yes/no/partial
- Remote state inspected: yes/no
- Notes:
```

### 3.2 `worktree-plan.md`

Record:

```markdown
# Worktree Plan

- Implementation mode: single-worktree | manual-git-worktrees | Codex-app-worktrees | external-isolated | mixed
- Rationale:
- Base branch / commit:
- Checkpoint strategy:
- Delegated worktree strategy:
- Integration order:
- Verification order:
- Cleanup policy:
- Known limitations:
```

### 3.3 `file-ownership-map.md`

Record one row per slice:

```markdown
| Slice | Owner | Worktree/branch | Allowed paths | Shared paths | Forbidden paths | Integration mode |
|---|---|---|---|---|---|---|
```

Shared paths include files such as:

```text
package.json
README.md
bin/codex-uplift-init.mjs
templates/config/*
templates/plugin-marketplace/*
```

These are orchestrator-owned by default unless the plan explicitly assigns them.

### 3.4 `integration-ledger.md`

Record:

```markdown
## <slice id>

- Source: local | subagent artifact | worktree branch | patch file | commit SHA
- Status: pending | reviewed | accepted | integrated | revised | parked | rejected
- Reviewed by:
- Files changed:
- Verification before integration:
- Integration action:
- Verification after integration:
- Conflicts:
- Notes:
```

### 3.5 `checkpoint-ledger.md`

Record:

```markdown
## <checkpoint id>

- Type: branch | stash | commit | tag | patch | external backup
- Command used:
- Created at:
- Scope:
- Restore instructions:
- Cleanup policy:
```

## 4. Worktree selection policy

### 4.1 Default for v0.2 implementation

Default to a single integration worktree controlled by the orchestrator for the first v0.2 slice, with read-only or artifact-only subagents.

Rationale:

- v0.2 changes likely touch shared CLI, templates, docs, tests, and package metadata.
- Many of those files are high-coordination surfaces.
- A single orchestrator-owned integration path reduces conflict overhead.

Use parallel subagents initially for:

- evidence inventory;
- test plan review;
- config/platform review;
- docs consistency review;
- release-candidate review;
- package hygiene review;
- artifact-only writing in assigned paths.

### 4.2 When to use separate worktrees

Use separate Git/Codex worktrees when at least one of these is true:

- a subagent will make code edits in a non-overlapping subsystem;
- there are multiple experimental implementation approaches;
- the task may require high-risk commands or dependency installation;
- the task needs a different sandbox/posture profile;
- the user wants background work without disturbing local state;
- the working tree is dirty with unrelated human/user work;
- the task is useful but may be parked if it does not integrate cleanly.

### 4.3 When not to use separate worktrees

Do not introduce separate worktrees when:

- the task is a small single-file edit;
- the likely integration overhead exceeds the benefit;
- edits are mostly to the same CLI entrypoint or manifest files;
- the repository is not under Git;
- local ignored/generated files are required and would not transfer cleanly;
- the user’s environment cannot cheaply install dependencies in the new checkout.

### 4.4 Non-Git projects

If the implementation repo is not a Git repository:

- do not pretend worktree isolation exists;
- create filesystem backup/checkpoint artifacts before edits;
- avoid parallel write delegation;
- preserve generated patches/diffs if possible;
- recommend initializing Git before high-autonomy implementation when appropriate.

## 5. Dirty worktree discipline

Before editing or delegating write-capable work, run and record:

```bash
git status --short
git branch --show-current
git rev-parse --show-toplevel
git rev-parse HEAD
git worktree list --porcelain
```

If dirty files exist:

1. classify each dirty file as:
   - pre-existing user work;
   - current-task-owned work;
   - generated by verification;
   - disposable byproduct;
   - unknown;
2. do not edit files containing pre-existing user work unless explicitly owned by the current task;
3. do not stash, reset, clean, or delete dirty files without explicit user approval;
4. prefer a new worktree from a clean base if current checkout has unrelated dirty state;
5. record the boundary in `.codex-uplift/worktree-state.md`.

## 6. Checkpoint policy

### 6.1 Before high-risk edits

Create a checkpoint before:

- broad CLI refactors;
- installer behavior rewrites;
- config/profile generation changes;
- hook/rule behavior changes;
- mass file moves;
- dependency changes;
- package metadata/release changes;
- any work under `full-access-reviewed` or external-isolated posture.

### 6.2 Preferred checkpoint hierarchy

Use the least intrusive checkpoint that preserves reversibility:

1. clean branch from current HEAD;
2. local checkpoint branch pointing to current HEAD;
3. patch file for dirty current-task changes;
4. local commit, only if commits are authorized;
5. stash only when explicitly appropriate and recorded;
6. backup copy only for non-Git workspaces.

### 6.3 Commit checkpoints

If the user has authorized commits, prefer atomic local commits over large mixed WIP commits.

Commit body for substantive checkpoints:

```text
Why:
Verification:
Boundary:
```

Do not push, tag, or publish as part of autorun.

## 7. Delegation patterns

### 7.1 Read-only evidence pass

Use same checkout or read-only subagent.

Allowed:

- read files;
- inspect package metadata;
- inspect tests;
- inspect docs;
- write only to assigned artifact path if write access is needed.

Forbidden:

- code edits;
- config activation;
- dependency installation unless explicitly requested;
- destructive Git operations.

### 7.2 Artifact-only writer

Use when a subagent creates a plan, review, matrix, or generated doc.

Allowed:

- write exactly the assigned artifact path;
- cite sources/files;
- summarize assumptions.

Forbidden:

- edit package implementation;
- edit shared planning docs outside assigned path;
- silently expand scope.

### 7.3 Isolated implementation subagent

Use a separate worktree or branch.

Required contract:

```text
Task:
Worktree path / branch:
Base commit:
Allowed write paths:
Forbidden paths:
Expected artifact or patch path:
Expected return shape:
Verification required:
Stop conditions:
```

Expected immediate return:

```text
status
worktree_path
branch_or_commit
artifact_or_patch_path
files_changed
summary
verification_performed
risks/open_questions
integration_notes
```

### 7.4 Reviewer subagent

Use read-only posture.

Input:

- diff or patch path;
- implementation plan;
- relevant acceptance matrix;
- verification log;
- project-specific instructions.

Output:

- findings grouped by severity;
- false-positive caveats;
- missing tests;
- release blockers;
- suggested disposition.

## 8. Integration protocol

The orchestrator integrates sequentially.

Recommended order for v0.2:

1. docs/state/roadmap alignment;
2. inspect/status/manifest surfaces;
3. config doctor/candidate surfaces;
4. install modes/component selection;
5. profile/rules/hooks candidates;
6. project setup candidates;
7. context-efficiency/compaction/RTK evaluation-only surfaces;
8. tests;
9. release docs/checkpoint artifacts.

For each integration:

1. review the source artifact/diff/commit;
2. verify it matches the file-ownership map;
3. check for unrelated changes;
4. apply/cherry-pick/patch manually or via Git;
5. resolve conflicts only in orchestrator context;
6. run relevant focused tests;
7. update integration ledger;
8. update validation log;
9. update roadmap/state if scope changes.

If a delegated result is useful but not integration-ready, park it rather than silently rewriting it into the main work.

## 9. Manual Git worktree recipe for CLI environments

Use this only when appropriate and after recording `worktree-state.md`.

Example pattern:

```bash
# from repo root
mkdir -p ../codex-uplift-worktrees
BASE_BRANCH=$(git branch --show-current)
BASE_COMMIT=$(git rev-parse HEAD)

# choose a unique branch name per slice
git worktree add ../codex-uplift-worktrees/v0.2-config-doctor "$BASE_COMMIT"
cd ../codex-uplift-worktrees/v0.2-config-doctor
git switch -c codex-uplift/v0.2-config-doctor
```

Do not check out the same branch in two worktrees at once. If integration into Local is needed, either use a patch/format-patch/cherry-pick flow or hand off using the Codex app when using app-managed worktrees.

Potential integration commands after review:

```bash
# from integration worktree
git diff --check
# optionally, apply a patch generated from the isolated worktree
git apply --check path/to/patch.diff
git apply path/to/patch.diff
```

or, if commits are authorized and the isolated worktree produced a reviewed commit:

```bash
git cherry-pick <commit-sha>
```

Do not force-remove worktrees or delete branches without confirming they contain no unintegrated work.

## 10. App worktree/local-environment implications

When using the Codex app:

- prefer app-managed Worktree mode for background implementation or risky experiments;
- use Local when the user wants foreground IDE inspection or a single dev server;
- define or propose local environment setup scripts for projects whose worktrees need dependency install/build steps;
- remember ignored files do not move during Handoff;
- record whether the thread stayed on Worktree or was handed off to Local.

For `codex-uplift-kit`, v0.2 should add project-candidate support for documenting worktree setup needs, but should not silently create app-local environment configuration without user review.

## 11. Hooks/rules for worktree and Git safety

v0.2 should include candidate hooks/rules that protect worktree and Git operations, especially under high-autonomy profiles.

Candidate prompt/deny surfaces:

```text
git reset --hard
git clean -f / git clean -fd
git checkout -f
git switch -f
git branch -D
git worktree remove --force
git worktree prune
git push --force
git commit --amend
rm -rf .git
```

These should be candidates or samples, not silently enabled defaults.

## 12. How this integrates into `codex-uplift-kit` itself

### 12.1 v0.2 implementation requirement

For v0.2 development, the orchestrator must use this addendum to create the worktree/state artifacts listed in §3 before broad code edits.

### 12.2 v0.2 product surfaces

Add or preserve the following package surfaces:

```text
codex-uplift-init project worktree inspect
codex-uplift-init project worktree plan
codex-uplift-init project checkpoint candidate
codex-uplift-init rules candidate --profile <profile>
codex-uplift-init hooks candidate --profile <profile>
```

If v0.2 cannot implement these as working commands, it must:

- generate project guidance/templates that preserve the command namespace;
- record the deferral in the deferral register;
- preserve machine-readable seams for v0.3;
- avoid designing the CLI so that these commands become hard to add later.

### 12.3 Home `AGENTS.md` guidance

The home-level `AGENTS.md` should include portable guidance:

```markdown
## Worktree and orchestration discipline

- The main agent owns integration and final disposition.
- Use read-only or artifact-only subagents by default.
- Before write-capable delegation, inspect git status and define allowed write paths.
- Avoid parallel writes to overlapping files.
- Prefer worktree/branch isolation for independent implementation slices, risky experiments, or dirty local checkouts.
- Preserve checkpoint and integration notes for substantive work.
```

### 12.4 Project `AGENTS.md` initialization skill

The project-init skill should inspect and record:

- whether the repo supports Git worktrees;
- how dependencies are installed in new checkouts;
- whether ignored/generated files are required for tests;
- whether local environment setup scripts exist or should be proposed;
- branch/remote conventions;
- destructive Git boundaries;
- test/build commands that can run in worktrees;
- which files are shared high-coordination surfaces.

### 12.5 Custom agents

Default custom agents should be narrow:

- evidence explorer: read-only;
- reviewer: read-only;
- artifact writer: write only to assigned artifact path;
- implementation worker: opt-in and worktree/branch scoped.

Avoid making a general-purpose write-capable subagent the default.

## 13. v0.3+ non-foreclosure seams

If v0.2 defers deeper automation, preserve these seams:

```text
WorktreeProvider interface: local | codex-app | manual-git | devcontainer | ci
IsolationPlan model: posture + worktree + branch + allowed paths + checkpoints
IntegrationSource model: artifact | patch | commit | branch | worktree
CheckpointProvider model: branch | commit | stash | patch | backup
DelegationTask model: role + scope + artifact + write policy + sandbox expectation
```

Do not hard-code v0.2 around a single local filesystem assumption if it would make app worktrees, CLI git worktrees, devcontainers, or CI runners awkward in v0.3.

## 14. Acceptance checks for this addendum

At the end of v0.2 release-candidate preparation, the orchestrator should be able to answer:

1. Was the implementation performed in Local, a worktree, or mixed mode?
2. What was the initial dirty state?
3. Which files were owned by which slice/agent?
4. Which delegated outputs were accepted, revised, parked, or rejected?
5. Were any write-capable subagents used?
6. If yes, what isolation and integration protocol was used?
7. What checkpoints exist and how would we roll back?
8. Were destructive Git/worktree operations avoided or explicitly approved?
9. Does the product now teach users comparable orchestration discipline?
10. Which worktree/orchestration features were deferred to v0.3, and what seams remain open?

## 15. Copy-paste instruction for the orchestrator

```text
In addition to the existing planning suite, follow CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md.

You are the integration owner. Before broad implementation, inspect git/worktree state and create the required .codex-uplift worktree artifacts. Default to read-only or artifact-only subagents unless a write-capable task has explicit file ownership and worktree/branch isolation. Do not delegate overlapping writes into shared files. Use checkpoints before high-risk edits. Review and disposition every delegated artifact before integration. Preserve v0.3 seams for worktree providers, checkpoint providers, integration sources, and delegation task models. Stop before publish/tag/push/live config activation as already required by the autorun contract.
```
