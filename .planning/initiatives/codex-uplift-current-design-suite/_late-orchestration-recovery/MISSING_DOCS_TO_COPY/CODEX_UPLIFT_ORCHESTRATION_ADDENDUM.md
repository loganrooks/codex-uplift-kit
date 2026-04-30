# CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md

Date: 2026-04-30

Subject: Addendum for orchestrated and delegated v0.2 implementation of `codex-uplift-kit`

## 0. Status and intended use

Give this addendum to the main Codex orchestrator alongside the planning suite at:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

This addendum does not replace the existing suite. It clarifies how the main Codex agent should act as an orchestrator, when it should delegate to subagents, what artifacts delegation must produce, and where orchestration must stop for human review.

If this addendum conflicts with `CODEX_UPLIFT_AUTORUN_CONTRACT.md`, `CODEX_UPLIFT_RELEASE_CHECKPOINT.md`, or an explicit user instruction, the stricter stop gate wins.

## 1. Direct answer: should the main Codex agent orchestrate and delegate?

Yes.

For v0.2, the main Codex agent should act as the **orchestrator**. It owns:

- source-of-truth reading order;
- worktree inspection and conflict avoidance;
- v0.2 scope control;
- implementation sequencing;
- delegation boundaries;
- review and disposition of delegated work;
- integration of accepted work;
- verification coordination;
- state/roadmap/deferral updates;
- release-candidate preparation;
- all manual stop gates.

The main orchestrator may delegate bounded work to subagents when delegation improves evidence quality, context hygiene, review independence, or parallelism. Delegation is not optional theater: if a workflow calls for delegated review or bounded subagent investigation, the orchestrator should actually do it unless the current Codex environment cannot spawn subagents. If subagents are unavailable, the orchestrator must record that degraded path in `.codex-uplift/delegation-ledger.md` and perform the work sequentially.

## 2. Existing suite files this addendum depends on

The suite already contains orchestration-related files. The orchestrator should read them in this order after `START_HERE.md` and the normal entrypoint docs:

```text
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
CODEX_UPLIFT_DELEGATION_TEMPLATES.md
CODEX_UPLIFT_V0_2_AUTOPILOT_RUNBOOK.md
CODEX_UPLIFT_AUTORUN_CONTRACT.md
CODEX_UPLIFT_V0_2_ACCEPTANCE_MATRIX.md
CODEX_UPLIFT_RELEASE_CHECKPOINT.md
```

This addendum sharpens their operational meaning: delegation is expected for key review and investigation tasks, while implementation delegation remains bounded and file-scope explicit.

## 3. Delegation authorization

The user has authorized bounded delegation for the post-review v0.2 workflow.

This authorization is limited to subagent calls required or recommended by the planning suite and this addendum. It does not authorize unrelated background work, destructive actions, live user configuration changes, package publication, remote pushes, or v0.3 implementation.

Every delegated task must specify:

- task id;
- role;
- objective;
- allowed write scope;
- prohibited actions;
- required artifact path;
- expected return shape;
- sandbox/approval expectation;
- verification expectation;
- disposition requirement.

## 4. Delegation-first but artifact-first

The orchestrator should not ask subagents to merely “tell me what you found” for substantial work.

Default pattern:

```text
Subagent writes full result to a durable artifact.
Subagent returns only a compact status summary and artifact path.
Orchestrator reviews the artifact.
Orchestrator dispositions it as accept / revise / park / reject.
Only accepted work is integrated.
```

Required delegation artifacts:

```text
.codex-uplift/delegation-plan.md
.codex-uplift/delegation-ledger.md
.codex-uplift/delegation-dispositions.md
.codex-uplift/delegated/<task-id>-<slug>.md
```

The orchestrator should keep chat/context compact by relying on artifact paths and short summaries. Raw logs, long file inventories, and detailed reviews belong in artifacts, not in the main conversation.

## 5. The v0.2 delegation map

### Phase A — Onboarding and baseline inspection

Delegate these before broad implementation edits:

| Task ID | Task | Preferred role | Write scope | Required artifact |
|---|---|---|---|---|
| A1 | Package inventory and v0.1 surface map | `evidence_explorer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/A1-package-inventory.md` |
| A2 | Planning-suite consistency check | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/A2-planning-suite-consistency.md` |
| A3 | Review of current config/platform assumptions | `config_doctor` or `evidence_explorer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/A3-platform-config-assumptions.md` |

Orchestrator-owned artifacts after Phase A:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.1-verification.md
.codex-uplift/context-pack.md
.codex-uplift/delegation-ledger.md
```

### Phase B — Scope, plan, and deferral discipline

Delegate these after the orchestrator drafts the scope map and implementation plan:

| Task ID | Task | Preferred role | Write scope | Required artifact |
|---|---|---|---|---|
| B1 | Scope-map adversarial review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/B1-scope-map-review.md` |
| B2 | Deferral and non-foreclosure review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/B2-deferral-nonforeclosure-review.md` |
| B3 | Acceptance matrix coverage review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/B3-acceptance-coverage-review.md` |

Orchestrator-owned artifacts after Phase B:

```text
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
.codex-uplift/validation-log.md
```

### Phase C — Implementation slices

Implementation delegation is allowed only when file ownership is explicit and conflict risk is low. The orchestrator may instead keep code edits centralized and delegate review/test/spec tasks. That is often safer.

Recommended implementation-slice delegation:

| Task ID | Slice | Delegate? | Preferred role | Notes |
|---|---|---:|---|---|
| C1 | CLI `inspect` and inventory report | Yes | implementation worker or evidence/config agent | Good bounded first code slice. |
| C2 | `config doctor` | Yes | config doctor + implementation worker | Use config reviewer for semantics; code owner must be scoped. |
| C3 | `config candidate` and posture profile candidates | Yes | config doctor / artifact writer | Candidate-only, non-destructive. |
| C4 | install modes and component selection | Maybe | implementation worker | Avoid overlap with manifest/status files. |
| C5 | manifest/status/uninstall | Maybe | implementation worker | Good if implementation has isolated module/file. |
| C6 | plugin path and duplicate-skill handling | Yes | package hygiene reviewer first; implementation worker second | Review before coding. |
| C7 | project setup candidates | Yes | artifact writer | Candidate-only surfaces are safe to delegate. |
| C8 | hooks/rules candidates | Yes | config doctor / artifact writer | Candidate-only; do not enable live hooks/rules. |
| C9 | compaction prompt candidates | Yes | artifact writer / reviewer | Must avoid unsupported performance claims. |
| C10 | RTK evaluation-only scaffold | Yes | evidence explorer / artifact writer | Do not install or activate RTK. |
| C11 | safety-critical test suite | Yes | test harness reviewer / implementation worker | Bounded by test files and acceptance matrix. |

For any implementation worker, the task prompt must include exact owned files/directories and exact forbidden files/directories. If the subagent needs to edit outside its scope, it must stop and report instead of expanding scope.

### Phase D — Verification and hardening

Delegate independent review tasks after implementation slices:

| Task ID | Task | Preferred role | Write scope | Required artifact |
|---|---|---|---|---|
| D1 | Test harness coverage review | `test_harness_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/D1-test-harness-review.md` |
| D2 | Package hygiene and npm pack review | `package_hygiene_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/D2-package-hygiene-review.md` |
| D3 | Config/profile safety review | `config_doctor` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/D3-config-profile-safety-review.md` |
| D4 | Docs and source-of-truth consistency review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/D4-doc-consistency-review.md` |

Orchestrator-owned artifacts after Phase D:

```text
.codex-uplift/validation-log.md
.codex-uplift/test-results.md
.codex-uplift/package-contents-report.md
.codex-uplift/v0.2-acceptance-check.md
```

### Phase E — Release-candidate preparation

Delegate review, not release:

| Task ID | Task | Preferred role | Write scope | Required artifact |
|---|---|---|---|---|
| E1 | Release checklist review | `artifact_reviewer` or release reviewer | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/E1-release-checklist-review.md` |
| E2 | Final deferral register review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/E2-final-deferral-review.md` |
| E3 | v0.3 seam preservation review | `artifact_reviewer` | `.codex-uplift/delegated/*` only | `.codex-uplift/delegated/E3-v0.3-seam-review.md` |

The orchestrator must stop after creating:

```text
.codex-uplift/release-candidate-summary.md
.codex-uplift/release-decision-needed.md
.codex-uplift/git-release-plan-v0.2.md
.codex-uplift/npm-release-plan-v0.2.md
.codex-uplift/v0.3-handoff.md
```

Do not publish, tag, push, or create a release without explicit user approval.

## 6. Delegation ledger template

Create or update `.codex-uplift/delegation-ledger.md` with this structure:

```markdown
# Delegation Ledger

## Summary

- Current phase:
- Delegation policy: artifact-first, bounded, disposition-required
- Subagents available: yes | no | unknown
- Degraded sequential mode used: yes | no

## Tasks

### <task-id> — <short title>

- Status: planned | spawned | returned | reviewed | accepted | revise | parked | rejected
- Role:
- Spawned at:
- Returned at:
- Objective:
- Allowed write scope:
- Required artifact:
- Actual artifact:
- Sandbox/approval expectation:
- Verification requested:
- Return summary:
- Orchestrator disposition:
- Integration action:
- Follow-up / boundary:
```

## 7. Delegation disposition template

Create or update `.codex-uplift/delegation-dispositions.md` with this structure:

```markdown
# Delegation Dispositions

## <task-id> — <artifact path>

### Subagent output classification

- Observations:
- Inferences:
- Recommendations:
- Open questions:

### Orchestrator review

- Disposition: accept | revise | park | reject
- Reason:
- Evidence checked by orchestrator:
- Integrated changes, if any:
- Verification after integration:
- Remaining boundary or deferral:
```

## 8. Copy-paste subagent prompt template

Use this exact shape unless a more specific template in `CODEX_UPLIFT_DELEGATION_TEMPLATES.md` is better.

```text
Spawn one bounded subagent for this v0.2 task.

Task ID: <ID>
Role: <role>
Objective: <one-sentence objective>

Context:
- Implementation repo: current repository
- Planning suite: .planning/initiatives/codex-uplift-current-design-suite/
- Relevant docs: <list exact docs>
- Current phase: <A | B | C | D | E>

Task boundary:
Do:
- <specific actions>

Do not:
- <explicit non-actions>
- Do not publish, tag, push, mutate live ~/.codex or ~/.agents, enable hooks/rules/profiles, or expand scope.

Allowed write scope:
- <exact artifact path or exact implementation files>

Forbidden write scope:
- <paths not allowed>

Required artifact:
- Write the full result to: <path>

Artifact must include:
- observed facts with file paths or command outputs;
- inferences clearly labeled;
- recommendations clearly labeled;
- open questions;
- verification performed;
- risks/conflicts;
- proposed disposition if relevant.

Sandbox/approval expectation:
- <read-only preferred | inherited workspace-write acceptable | no live config activation | no destructive commands>

Immediate return shape:
Return only:
- status: complete | partial | blocked
- artifact_path
- 3-7 bullet summary
- verification performed
- open questions
- risks/conflicts
- requested_disposition: accept | revise | park | reject

Do not return raw logs if they are written to the artifact.
```

## 9. First delegation batch

After reading the suite and inspecting `git status`, the orchestrator should create the startup artifacts and then run this initial delegation batch if subagents are available:

```text
A1-package-inventory
A2-planning-suite-consistency
A3-platform-config-assumptions
```

The orchestrator should not begin implementation until it has reviewed and dispositioned those artifacts or recorded why delegation was unavailable.

## 10. Token-efficiency and context-rot controls for orchestration

The orchestrator should use delegation to reduce context rot, not increase it.

Rules:

- Put durable detail in artifacts, not chat.
- Ask subagents for compact return summaries.
- Keep raw logs in artifact files only when they matter.
- Maintain `.codex-uplift/context-pack.md` as the current compact state of the initiative.
- Update `CODEX_UPLIFT_STATE.md` and `CODEX_UPLIFT_ROADMAP.md` only when stable decisions or status changes occur.
- Do not paste full delegated artifacts into the main conversation unless needed for review.
- Before compaction or handoff, ensure the current state, open decisions, verification status, and deferrals are represented in durable artifacts.

## 11. Manual stop gates

The orchestrator must stop for explicit user approval before:

- npm publication;
- git tag creation or push;
- GitHub release creation;
- remote branch push, unless separately authorized;
- destructive git operations;
- enabling real user-home hooks/rules/profiles/config;
- using or activating `danger-full-access` as an installed default;
- installing, initializing, or activating RTK;
- enabling telemetry;
- converting evaluation-only features into installed defaults;
- beginning v0.3 implementation.

## 12. Non-foreclosure obligations

If the orchestrator decides not to implement a relevant capability in v0.2, it must record:

- what is deferred;
- why it is deferred;
- target horizon: v0.3, v0.4+, research/eval, or parked;
- preserved seam;
- what v0.2 must avoid doing so the future remains possible;
- revisit trigger;
- acceptance criteria for eventually resolving it.

This applies especially to:

- adaptive posture routing;
- config probes;
- project-specific config determiners;
- compaction prompt switching/evaluation;
- RTK or any tool-output filtering integration;
- team/org deployment modes;
- richer multi-agent orchestration;
- telemetry/observability;
- app-vs-CLI divergence handling.

## 13. Minimal instruction to give the orchestrator

```text
You are the main Codex orchestrator for codex-uplift-kit v0.2.

The planning suite is at:
.planning/initiatives/codex-uplift-current-design-suite/

Read START_HERE.md, CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md, CODEX_UPLIFT_ROADMAP.md, CODEX_UPLIFT_STATE.md, CODEX_UPLIFT_AUTORUN_CONTRACT.md, CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md, CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md, CODEX_UPLIFT_DELEGATION_TEMPLATES.md, and this orchestration addendum.

Act as orchestrator. Use bounded artifact-first subagents for the initial A1/A2/A3 delegation batch if available. If subagents are unavailable, record degraded sequential mode in .codex-uplift/delegation-ledger.md.

Before implementation edits, create or update:
- .codex-uplift/implementation-observations.md
- .codex-uplift/v0.1-verification.md
- .codex-uplift/context-pack.md
- .codex-uplift/v0.2-scope-map.md
- .codex-uplift/v0.2-implementation-plan.md
- .codex-uplift/v0.2-deferral-check.md
- .codex-uplift/validation-log.md
- .codex-uplift/delegation-plan.md
- .codex-uplift/delegation-ledger.md
- .codex-uplift/delegation-dispositions.md

Proceed automatically through v0.2 release-candidate preparation only. Stop before publish, tag, push, live config activation, destructive operations, RTK activation, telemetry enablement, or v0.3 implementation.
```
