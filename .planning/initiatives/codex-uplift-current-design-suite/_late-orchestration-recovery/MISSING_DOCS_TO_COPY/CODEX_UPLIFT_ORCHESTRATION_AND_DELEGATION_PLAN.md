# CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md

Date: 2026-04-30

Subject: Main-orchestrator and subagent delegation plan for `codex-uplift-kit` v0.2

## 0. Purpose

This file answers the questions:

- Is the main Codex agent expected to act as an orchestrator?
- When should the orchestrator delegate?
- Which v0.2 work should be delegated to subagents or custom agents?
- What artifacts must delegated work produce?
- What remains owned by the orchestrator and must not be delegated away?

Answer: **Yes, the main Codex agent is the orchestrator.** It owns scope, state, worktree coordination, integration, decisions, verification, release-candidate preparation, and user-facing checkpoints. It may delegate bounded work when that improves quality, parallelism, or context hygiene, but delegated work must be artifact-first and dispositioned before integration.

This document is authoritative for v0.2 orchestration unless a more local repo-specific `AGENTS.md` or explicit user instruction narrows it.

## 1. Platform premise

Codex can run subagent workflows by spawning specialized agents, running them in parallel, and collecting results in one response. Codex only spawns subagents when the user explicitly asks for subagents or parallel agent work; subagent workflows consume additional tokens because each subagent performs its own model/tool work.

For this initiative, the user has explicitly authorized bounded subagents when a workflow contract in this suite requires them. This authorization is limited to the bounded subagent calls defined here or in `CODEX_UPLIFT_DELEGATION_TEMPLATES.md`.

Subagents inherit the current sandbox policy and approval posture unless an individual custom-agent configuration explicitly overrides them. Therefore, every delegated task must state the expected sandbox/approval posture and whether inherited posture is acceptable.

## 2. Orchestrator responsibilities

The main Codex agent is responsible for:

- reading the source-of-truth docs in `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` order;
- creating and maintaining `.codex-uplift/` state artifacts;
- deciding the v0.2 slice boundaries;
- maintaining `CODEX_UPLIFT_STATE.md`, `CODEX_UPLIFT_ROADMAP.md`, and deferral artifacts when implementation reality changes;
- inspecting dirty worktree state before edits;
- assigning bounded work to subagents only when beneficial;
- preventing overlapping write-heavy delegated edits without a conflict plan;
- reviewing all delegated artifacts;
- dispositioning delegated outputs as `accept`, `revise`, `park`, or `reject`;
- integrating accepted work;
- running or coordinating verification;
- preparing release-candidate artifacts;
- stopping before npm publish, git tag/push, GitHub release, live config activation, destructive operations, or v0.3 implementation.

The orchestrator must not outsource final product judgment, release decisions, or user-approval gates.

## 3. Delegation principles

Use delegation for:

- read-heavy exploration;
- config/platform-source inspection;
- independent test or fixture design;
- documentation consistency review;
- package hygiene review;
- release-candidate checklist review;
- adversarial review of plans, diffs, or generated candidates;
- work whose output can be written to a durable artifact and summarized compactly.

Avoid delegation for:

- final scope decisions;
- final release/publication decisions;
- live user config activation;
- destructive operations;
- ambiguous architecture decisions without an orchestrator-owned decision record;
- overlapping code edits in the same files;
- noisy log-dumping tasks whose output will not be artifact-backed;
- delegation merely to appear thorough after the main work is already complete.

## 4. Required delegation artifacts

Before spawning subagents for v0.2, the orchestrator should create:

```text
.codex-uplift/delegation-plan.md
.codex-uplift/delegation-ledger.md
.codex-uplift/delegation-dispositions.md
```

Suggested per-agent artifact directory:

```text
.codex-uplift/delegated/
```

Each delegated task should write a durable artifact such as:

```text
.codex-uplift/delegated/2026-04-30-evidence-explorer-package-inventory.md
.codex-uplift/delegated/2026-04-30-config-doctor-review.md
.codex-uplift/delegated/2026-04-30-test-plan-review.md
.codex-uplift/delegated/2026-04-30-package-hygiene-review.md
.codex-uplift/delegated/2026-04-30-release-gate-review.md
```

The orchestrator should keep the main chat/context focused on:

- the current objective;
- paths to delegated artifacts;
- concise delegated summaries;
- disposition decisions;
- integration status;
- verification outcomes;
- unresolved risks.

## 5. Delegation ledger schema

`delegation-ledger.md` should record one entry per delegated task:

```markdown
## <task id> — <short title>

- Status: planned | spawned | returned | reviewed | accepted | revise | parked | rejected
- Agent/custom role:
- Spawn time:
- Completion time:
- Task boundary:
- Allowed write scope:
- Expected artifact path:
- Actual artifact path:
- Expected return shape:
- Sandbox/approval expectation:
- Verification requested:
- Summary received:
- Orchestrator disposition:
- Integration action:
- Follow-up:
```

## 6. Delegation disposition schema

`delegation-dispositions.md` should separate findings from decisions:

```markdown
## <task id> — <artifact path>

### Subagent claim summary

- Observation:
- Inference:
- Recommendation:
- Open question:

### Orchestrator review

- Disposition: accept | revise | park | reject
- Reason:
- Evidence checked by orchestrator:
- Integration action:
- Verification needed after integration:
- Boundary / deferral, if any:
```

## 7. v0.2 phase-by-phase delegation plan

### Phase A — Onboard and inspect

Recommended delegation:

| Task | Suggested role | Write scope | Artifact | Return summary |
|---|---|---|---|---|
| Package file inventory | `evidence_explorer` | `.codex-uplift/delegated/*` only | package inventory artifact | observed files, commands, uncertainties |
| Existing instruction/config surfaces | `evidence_explorer` or `config_doctor` | `.codex-uplift/delegated/*` only | config/instruction inventory | observed config, collisions, unknowns |
| Review planning suite for source-of-truth conflicts | `artifact_reviewer` | `.codex-uplift/delegated/*` only | doc consistency review | conflicts, missing docs, source-of-truth issues |

Orchestrator-owned outputs:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.1-verification.md
.codex-uplift/context-pack.md
```

### Phase B — Plan v0.2

Recommended delegation:

| Task | Suggested role | Write scope | Artifact | Return summary |
|---|---|---|---|---|
| Review proposed v0.2 scope map | `artifact_reviewer` | `.codex-uplift/delegated/*` only | scope-map review | missing required items, overreach, deferrals |
| Review deferral/non-foreclosure coverage | `artifact_reviewer` | `.codex-uplift/delegated/*` only | deferral review | untracked deferrals, closed seams |

Orchestrator-owned outputs:

```text
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
```

The orchestrator owns the final plan. Subagents may critique it, but they do not settle scope.

### Phase C — Implement v0.2

Recommended delegation:

| Work item | Delegate? | Suggested role | Notes |
|---|---:|---|---|
| CLI parser / command surface | Maybe | implementation worker only if file scope is isolated | Orchestrator should own integration. |
| `inspect` / inventory | Yes | implementation worker or evidence/config agent | Good bounded slice if files are isolated. |
| `config doctor` | Yes | config_doctor + implementation worker | Config agent can review semantics; implementation must be integrated carefully. |
| config/profile candidates | Yes | config_doctor / artifact_writer | Good candidate-generation slice. |
| install modes/components | Maybe | implementation worker | Avoid overlap with manifest/status if same files. |
| manifest/status/uninstall | Maybe | implementation worker | Good bounded slice if owned module is clear. |
| plugin path / duplicate skills | Yes | package_hygiene_reviewer | Review before integration. |
| project setup candidates | Yes | artifact_writer | Candidate-only artifacts are safe to delegate. |
| hooks/rules candidates | Yes | config_doctor or artifact_writer | Must remain candidate-only. |
| compaction prompt candidates | Yes | artifact_writer/reviewer | Must avoid unsupported performance claims. |
| RTK evaluation-only scaffold | Yes | evidence_explorer/artifact_writer | Must not install or activate RTK. |
| tests | Yes | test_harness_reviewer or implementation worker | Bounded tests can be delegated by module/feature. |

For write-heavy implementation delegation, the orchestrator must specify:

- exact files or directories the subagent may edit;
- files it must not touch;
- how to handle conflicts;
- test(s) expected for the slice;
- artifact path for implementation notes;
- concise return shape.

If file ownership cannot be made explicit, the orchestrator should not delegate that implementation slice.

### Phase D — Verify

Recommended delegation:

| Task | Suggested role | Write scope | Artifact | Return summary |
|---|---|---|---|---|
| Test result triage | `test_harness_reviewer` | `.codex-uplift/delegated/*` only unless asked to patch | test triage artifact | failures, likely causes, next command |
| Package contents review | `package_hygiene_reviewer` | `.codex-uplift/delegated/*` only | package contents artifact | suspicious files, missing files, release risk |
| Candidate behavior review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | candidate behavior review | overwrite risks, live activation risks |
| Documentation consistency review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | docs consistency artifact | stale references, unsupported claims |

The orchestrator owns final verification logging in `.codex-uplift/validation-log.md`.

### Phase E — Release-candidate preparation

Recommended delegation:

| Task | Suggested role | Write scope | Artifact | Return summary |
|---|---|---|---|---|
| Release checklist adversarial review | `release_gate_reviewer` | `.codex-uplift/delegated/*` only | release-gate review | blockers, must-fix items, deferrals |
| v0.3 seam review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | v0.3 seam review | foreclosed seams, missing handoff |

Orchestrator-owned outputs:

```text
.codex-uplift/release-candidate-summary.md
.codex-uplift/package-contents-report.md
.codex-uplift/npm-pack-verification.md
.codex-uplift/git-release-plan-v0.2.md
.codex-uplift/release-decision-needed.md
.codex-uplift/v0.3-handoff.md
```

The orchestrator must stop at the release checkpoint.

## 8. Suggested custom agents for v0.2

The package may install or define these agent templates, but the orchestrator can also use built-in `explorer`, `worker`, and default agents when custom roles are unavailable.

| Role | Default posture | Use for | Avoid |
|---|---|---|---|
| `evidence_explorer` | read-only preferred | file/source inventory, repo exploration, source baseline checks | editing implementation |
| `config_doctor` | read-only preferred | Codex config/profile/rules/hooks review | live config activation |
| `artifact_writer` | bounded write scope | candidate docs, plans, generated templates | broad implementation |
| `artifact_reviewer` | read-only preferred | review docs, plans, deferrals, candidates | making final decisions |
| `test_harness_reviewer` | read-only or bounded test writes | test design, failure triage, fixture coverage | patching unrelated implementation |
| `package_hygiene_reviewer` | read-only preferred | npm pack contents, `.DS_Store`, marketplace paths, duplicate skills | publishing |
| `release_gate_reviewer` | read-only preferred | release-candidate checklist, blocker review | release approval |
| `subagent_disposition_reviewer` | read-only preferred | classify delegated artifacts for disposition | replacing orchestrator judgment |

## 9. Minimum delegation policy for v0.2

Delegation is not mandatory for every run, but for a serious v0.2 implementation the orchestrator should use at least one independent review pass before the release checkpoint, preferably:

- `package_hygiene_reviewer` for package contents and plugin/skill issues;
- `artifact_reviewer` for deferrals/non-foreclosure;
- `release_gate_reviewer` for final release-candidate readiness.

If the orchestrator chooses not to delegate, it must say why in `.codex-uplift/delegation-plan.md`, for example:

```text
No subagents used in this slice because the implementation repo lacks spawn-agent capability in the current client, or because the work is too small to justify token cost. The orchestrator performed the required review passes directly and recorded them in validation-log.md.
```

## 10. Token/context discipline for delegation

Subagents should not return raw logs or full artifacts into the main thread when a durable artifact exists.

Preferred return shape:

```yaml
status: complete | blocked | partial
artifact_path: .codex-uplift/delegated/<file>.md
summary:
  - <3-7 concise bullets>
observations:
  - <only load-bearing observations>
inferences:
  - <clearly labeled inferences>
open_questions:
  - <questions the orchestrator must resolve>
verification:
  - <commands or checks performed>
risks:
  - <integration or correctness risks>
requested_disposition: accept | revise | park | reject
```

The orchestrator should preserve the artifact path and disposition in `.codex-uplift/context-pack.md` and use the `delegation-heavy` compaction prompt when a session becomes subagent-heavy.

## 11. Failure modes this plan is meant to prevent

- Subagents return chat-only findings that cannot be audited later.
- The orchestrator writes a subagent's summary into an artifact after the fact, losing provenance.
- Multiple agents edit overlapping files and create unreviewable conflicts.
- Delegation is used performatively after the main work is already complete.
- A reviewer subagent's recommendation is treated as a stakeholder decision.
- Delegated output is accepted without review or disposition.
- Token-heavy intermediate logs pollute the main conversation.
- High-autonomy subagents inherit unsafe posture without acknowledgment.

## 12. Relationship to project-level examples

Production project `AGENTS.md` files often encode concrete commands, protected seams, and ask-first/never boundaries. That is the right pattern for project-specific guidance. This delegation plan keeps the home/package-level guidance generic: it defines orchestration posture and artifact contracts, while the implementation repo's own `AGENTS.md` or generated candidates should define exact commands, file scopes, and verification stacks.
