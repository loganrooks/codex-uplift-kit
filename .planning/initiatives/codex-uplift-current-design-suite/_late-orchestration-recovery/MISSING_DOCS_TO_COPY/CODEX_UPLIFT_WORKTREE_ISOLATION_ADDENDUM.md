# Codex Uplift Worktree Isolation And Orchestration Addendum

Status: addendum to the v0.2 planning suite  
Audience: Codex orchestrator implementing `codex-uplift-kit` and future agents using the uplift  
Primary placement: `.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md`

## Purpose

This addendum makes worktree isolation a first-class orchestration concern.

The existing suite already contains worktree hygiene rules: inspect dirty state, avoid overlapping write-heavy delegation, preserve artifacts, and stop before publication. That is necessary but not sufficient. For a high-autonomy Codex setup, the orchestrator also needs an explicit policy for **execution topology**: whether work happens in the local checkout, a background/app worktree, one or more manually created Git worktrees, an external isolated environment, or read-only subagent passes.

This document applies in two directions:

1. **Development of `codex-uplift-kit` itself.** The orchestrator implementing v0.2 must choose a safe topology before parallel work or write-heavy delegation.
2. **The uplift product.** The package should help future users inspect, choose, and document their own topology rather than treating all Codex sessions as equivalent.

## Core principle

More autonomy should require more explicit isolation, checkpointing, and integration discipline.

Do not treat subagents, sandboxing, worktrees, branches, and commits as interchangeable. They solve different problems:

| Control | Helps with | Does not guarantee |
|---|---|---|
| Sandbox | limits filesystem/network access for commands | clean git integration or semantic correctness |
| Approval policy / auto-review | gates eligible risky actions | containment once full access is granted |
| Git branch | names and separates a line of development | separate working directory |
| Git worktree | separate working directory and branch checkout | automatic correctness or conflict-free merge |
| Subagent | parallel cognition / review / exploration | filesystem isolation unless its environment provides it |
| Hook/rule | lifecycle or command guardrail | complete security boundary |
| Commit/checkpoint | rollback point | prevention of a bad change |
| Artifact ledger | auditability | correctness by itself |

## Platform facts to preserve

- Codex app worktrees let Codex run multiple independent tasks in the same Git project without interfering with the local checkout. For Git repositories, automations can run on dedicated background worktrees; local mode can modify files the user is actively editing.
- Worktrees require a Git repository and use Git worktrees under the hood. A worktree is a second checkout with its own working files and branch state while sharing repository metadata.
- Codex subagents inherit the current sandbox policy. Parent runtime overrides such as approval and sandbox choices can be reapplied when spawning children. Therefore, a high-autonomy parent can create high-autonomy children unless the subagent/custom-agent contract explicitly narrows behavior.
- Sandboxing and approvals are different controls: the sandbox defines technical boundaries; approval policy controls when Codex must stop and ask before crossing them.

## Required v0.2 orchestrator posture

Before editing implementation code, the orchestrator must record the chosen topology in:

```text
.codex-uplift/orchestration-topology.md
```

Minimum fields:

```markdown
# Orchestration topology

## Observed git state
- repo root:
- current branch:
- HEAD:
- dirty state summary:
- existing worktrees:
- remotes, if relevant:

## Selected topology
One of:
- single-checkout
- single-checkout + read-only subagents
- single-checkout + disjoint write-scope subagents
- isolated-worktree-slices
- app-worktree
- external-isolated

## Reason
Why this topology is appropriate for the current slice.

## Write policy
- orchestrator-owned paths:
- delegated write paths:
- paths off-limits:
- generated/candidate-only paths:

## Checkpoint policy
- branch/checkpoint/stash/patch plan:
- commit policy:
- rollback plan:

## Integration policy
- how delegated outputs will be reviewed:
- how isolated worktree diffs will be integrated:
- conflict plan:

## Boundaries
- what is intentionally not delegated:
- what is intentionally not isolated:
- what follow-up remains:
```

## Topology selection rules

### Use `single-checkout` when

- the task is small or sequential;
- edits are all in one coherent file family;
- there is already a mixed/dirty worktree that needs careful human-aware handling;
- parallelism would create more coordination cost than benefit;
- the environment is not a Git repository.

In this mode, subagents may still be used for **read-only** evidence gathering, test review, release-candidate review, and artifact critique.

### Use `single-checkout + read-only subagents` when

- the orchestrator needs independent review without parallel writes;
- the main risk is epistemic quality, not implementation throughput;
- the worktree contains pre-existing dirty state.

This should be the default for v0.2 implementation if the package is small and the same few files are likely to be touched by most changes.

### Use `single-checkout + disjoint write-scope subagents` only when

- each delegated writer has a non-overlapping path set;
- the orchestrator has created a delegation ledger;
- each subagent writes a durable artifact or isolated path;
- no two agents edit the same package file, config file, README section, or generated artifact;
- the orchestrator reviews and dispositions each output before integration.

If write scopes overlap, use isolated worktrees or make the work sequential.

### Use `isolated-worktree-slices` when

- multiple substantial implementation slices can proceed independently;
- the base branch is clean or well-understood;
- each slice has a bounded branch, path set, and verification plan;
- there is a clear integration owner;
- the extra setup cost is justified by parallel throughput or risk isolation.

Recommended slices for v0.2 if worktree parallelism is used:

| Slice | Example branch | Typical paths |
|---|---|---|
| inspect/doctor | `codex-uplift/v0.2-inspect-doctor` | CLI, config parser, tests |
| install modes | `codex-uplift/v0.2-install-modes` | installer, plugin path, tests |
| posture candidates | `codex-uplift/v0.2-posture-profiles` | config templates, docs, tests |
| project candidates | `codex-uplift/v0.2-project-candidates` | project CLI, templates, docs |
| context efficiency | `codex-uplift/v0.2-context-efficiency` | compaction prompts, RTK evaluation-only path |
| release/docs | `codex-uplift/v0.2-release-docs` | README, release checkpoint, manifest docs |

Do not let two slices update the same central CLI dispatcher without an explicit integration plan. Shared dispatch changes are usually orchestrator-owned.

### Use `app-worktree` when

- running in the Codex app and the task can benefit from Codex-managed worktree setup;
- the user wants background work isolated from their local checkout;
- the worktree has or can run its own setup script and verification;
- the result can be handed off or integrated through the app workflow.

### Use `external-isolated` when

- the user intentionally runs high-autonomy/full-access work inside a devcontainer, VM, CI runner, or disposable machine;
- the external boundary, mounted secrets, network behavior, and rollback plan are documented.

Do not call this “safe” merely because it is isolated. The isolation boundary must be named.

## Pre-flight worktree inspection

Before implementation and before any write-heavy delegation, run and record the equivalent of:

```bash
git rev-parse --show-toplevel
git status --short --branch --untracked-files=all
git diff --name-only
git diff --cached --name-only
git worktree list --porcelain || true
git branch --show-current
git rev-parse HEAD
git remote -v || true
```

Classify dirty state into:

- `pre-existing-user`: existed before this task;
- `orchestrator-owned`: created by the current run;
- `delegated-owned`: created by a recorded subagent/slice;
- `generated-disposable`: safe generated byproduct;
- `unknown`: must not be overwritten or staged without review.

Record the classification in:

```text
.codex-uplift/worktree-state.md
```

## Worktree creation policy

When creating manual Git worktrees, prefer sibling directories rather than nesting worktrees inside the active repo unless the repo already has a convention and ignore rules for nested worktrees.

Candidate command shape:

```bash
# Example only. Confirm base branch and path before running.
git worktree add -b codex-uplift/v0.2-inspect-doctor ../codex-uplift-kit-wt-inspect-doctor HEAD
```

Every worktree must have:

- branch name;
- base commit;
- slice owner;
- allowed write paths;
- artifact path for notes;
- verification plan;
- integration/disposition status.

Record in:

```text
.codex-uplift/worktree-ledger.md
```

Suggested ledger shape:

```markdown
| Slice | Branch | Path | Base | Write scope | Status | Verification | Disposition |
|---|---|---|---|---|---|---|---|
```

## Integration policy for isolated slices

The orchestrator is the integration owner. A delegated worktree is not merged merely because it produced code.

For each slice:

1. inspect the diff;
2. inspect the artifact/handoff;
3. run the slice verification;
4. classify the result as `accept`, `revise`, `park`, or `reject`;
5. integrate through a controlled patch/merge/cherry-pick path;
6. run cross-slice verification after integration;
7. record disposition in `.codex-uplift/delegation-dispositions.md` or `.codex-uplift/worktree-ledger.md`.

Never integrate a slice that lacks a summary of:

- what changed;
- why it changed;
- verification performed;
- known risks;
- boundaries and deferred work.

## Conflict policy

If two slices edit the same file:

1. stop automatic integration;
2. identify whether the conflict is textual, semantic, or contract-level;
3. record the conflict in `.codex-uplift/integration-conflicts.md`;
4. choose one owner for the integration repair;
5. run targeted verification after repair.

Do not let two subagents independently repair the same conflict.

## Commit policy

For v0.2 implementation, commits are allowed only if the user or repo workflow has authorized committing.

If commits are authorized:

- commit per coherent slice;
- avoid one giant release commit;
- include `Why`, `Verification`, and `Boundary` body notes for substantive changes;
- do not push, tag, publish, or create remote releases without explicit user approval.

Possible commit buckets:

```text
docs(planning): add v0.2 orchestration and worktree policy
feat(cli): add inspect and config doctor commands
feat(config): add posture candidate generation
feat(install): add explicit install modes and manifests
test(installer): cover candidate and plugin path behavior
docs(release): add release-candidate checkpoint
```

## What to integrate into the uplift product

v0.2 should include worktree-awareness but does not need to implement full automated worktree orchestration.

### v0.2 deliverables

Add or preserve these product seams:

```text
codex-uplift-init project inspect
codex-uplift-init project candidate
codex-uplift-init project checkpoint candidate
codex-uplift-init orchestrate topology candidate
```

At minimum, `project inspect` should report:

- whether the target is a Git repo;
- current branch and HEAD;
- dirty-state summary;
- existing worktrees if visible;
- whether pre-existing dirty files overlap proposed output paths;
- whether project `.codex/config.toml`, hooks, rules, agents, or skills exist;
- recommended topology: single checkout, read-only fanout, isolated worktree slices, app worktree, or external isolated.

`checkpoint candidate` should generate commands or instructions, not execute destructive operations by default.

`orchestrate topology candidate` should produce a small Markdown plan with:

- selected topology;
- write scopes;
- delegation plan;
- checkpoint plan;
- verification plan;
- release/stop boundaries.

### v0.3 preserved seams

Do not foreclose future full worktree orchestration. Keep these seams open:

| Future capability | Seam to preserve now |
|---|---|
| automatic worktree creation | topology IDs and worktree ledger schema |
| per-slice subagent spawning | delegation contracts with write scope and artifact path |
| worktree merge assistant | integration disposition schema |
| conflict classifier | integration-conflicts artifact path |
| app-vs-CLI topology support | client capability field in project inspect output |
| CI/devcontainer external isolation | external boundary metadata field |
| context compaction per slice | compaction prompt ID in delegation/worktree ledger |

If v0.2 does not implement a future capability, it must say where it is deferred and how the seam is preserved.

## What to add to home-level AGENTS.md

The user-level AGENTS.md should include a concise version of this posture:

```markdown
## Orchestration and worktree hygiene

- Before write-heavy work, inspect and classify the worktree state.
- Do not overwrite, stage, or commit unknown pre-existing dirty changes.
- For parallel write-heavy work, prefer isolated Git worktrees or strictly disjoint write scopes.
- The main agent remains the orchestrator: it owns scope, integration, verification, and release boundaries.
- Delegated work must have an artifact path, write scope, expected return shape, and disposition.
- Use checkpoints, branches, or small scoped commits so high-autonomy work can be reviewed and reverted.
```

## What to add to project-level AGENTS.md generation

The project initialization skill should look for and recommend project-specific worktree/orchestration rules:

- existing branch conventions;
- existing worktree conventions;
- test environment tied to worktree path;
- commands that must run from a repo root or particular directory;
- generated files that must not be edited by hand;
- PR/release boundaries;
- remote naming conventions;
- dirty-worktree policy;
- whether agents may create branches or worktrees;
- where delegated artifacts should live.

For mature repos, project `AGENTS.md` should include exact commands and boundaries, not generic advice.

## Examples of inherited precedent

Production-level `AGENTS.md` files show why this belongs at the project level as well as globally:

- Apache Airflow explicitly installs a per-worktree Breeze shim so each worktree uses sources from that worktree, and it defines remote naming, PR, ask-first, and never boundaries.
- Codex's Rust guidance contains precise rules for sandbox-related env vars, exact test and snapshot workflows, dependency lockfile propagation, and module-boundary constraints.

The inheritance is not to copy those rules. The inheritance is that orchestration policy must be concrete enough to protect the actual development workflow.

## Orchestrator instruction patch

Add this to the v0.2 orchestrator prompt:

```text
Before implementation, read CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md.
Create .codex-uplift/worktree-state.md and .codex-uplift/orchestration-topology.md before write-heavy edits.
If using worktree-parallelism, create .codex-uplift/worktree-ledger.md and keep one integration owner.
Use read-only subagents freely for evidence/review. Use write-capable subagents only with disjoint write scopes or isolated worktrees. Do not integrate delegated work without explicit disposition.
Do not push branches, tags, releases, or npm packages without user approval.
```

## Acceptance criteria

The v0.2 release candidate should satisfy:

- [ ] implementation run records initial worktree state;
- [ ] implementation run records selected orchestration topology;
- [ ] any delegated write work has write scope and disposition;
- [ ] any isolated worktree use has ledger entries;
- [ ] release checkpoint includes clean/known dirty-state status;
- [ ] product docs explain topology selection;
- [ ] project inspect/candidate output preserves future worktree orchestration seams;
- [ ] no v0.3 worktree automation is silently foreclosed by v0.2 data shapes.

## References

- Codex app worktrees: https://developers.openai.com/codex/app/worktrees
- Codex app automations and worktrees: https://developers.openai.com/codex/app/automations
- Codex subagents: https://developers.openai.com/codex/subagents
- Codex sandboxing: https://developers.openai.com/codex/concepts/sandboxing
- Codex agent approvals and security: https://developers.openai.com/codex/agent-approvals-security
