# CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md

Date: 2026-04-30

Subject: Explicit orchestration and delegation addendum for `codex-uplift-kit` v0.2 implementation

## 0. How to use this addendum

Place this file in:

```text
.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md
```

Read it immediately after:

```text
CODEX_UPLIFT_AUTORUN_CONTRACT.md
```

and before:

```text
CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md
CODEX_UPLIFT_DELEGATION_TEMPLATES.md
```

This addendum does not replace those two documents. It makes their intended operational posture explicit and gives the orchestrator a minimum delegation plan for v0.2.

If this addendum conflicts with an explicit user instruction, follow the user instruction. If it conflicts with a project-level `AGENTS.md`, prefer the stricter instruction unless doing so would silently block a v0.2 requirement; in that case, record the conflict in `.codex-uplift/validation-log.md` and surface it.

## 1. Executive answer

Yes: the main Codex agent is expected to act as the **orchestrator**.

The orchestrator owns:

- reading and applying the planning suite;
- creating repo-local state artifacts;
- maintaining scope and roadmap discipline;
- deciding which tasks to delegate;
- assigning bounded work to subagents;
- preventing overlapping edits;
- reviewing delegated artifacts;
- dispositioning delegated outputs as `accept`, `revise`, `park`, or `reject`;
- integrating accepted work;
- running or coordinating verification;
- preparing the v0.2 release-candidate checkpoint;
- stopping before publication, remote pushes, live config activation, or v0.3 work.

Subagents are helpers, not product owners. They may produce evidence, artifacts, reviews, bounded implementation slices, and test work. They do not settle final scope, release decisions, live user-home configuration, or product posture decisions.

## 2. Authorization to delegate

For this initiative, the user has authorized bounded subagent work when it is required or recommended by this addendum, `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md`, `CODEX_UPLIFT_DELEGATION_TEMPLATES.md`, the v0.2 roadmap, or a repo-local plan created from them.

This authorization is limited to:

- bounded v0.2 planning, review, implementation, and verification tasks;
- artifact-backed outputs;
- explicit file/write scopes;
- explicit sandbox/approval expectations;
- tasks recorded in `.codex-uplift/delegation-ledger.md`.

This authorization does **not** permit:

- npm publish;
- git tag or remote push;
- GitHub release;
- destructive git operations;
- live user-home config mutation;
- enabling hooks/rules/full-access profiles in the user's actual home config;
- v0.3 implementation;
- broad overlapping write-heavy subagent work without a conflict plan.

## 3. Minimum v0.2 delegation requirement

If subagents are available, v0.2 should use at least these independent delegated passes.

### Required before implementation

1. **Evidence inventory pass**
   - Goal: inspect the actual package/repo state before implementation begins.
   - Output artifact: `.codex-uplift/delegated/A1-evidence-inventory.md`
   - Role: read-only evidence explorer.
   - Disposition required before coding.

2. **Scope/deferral review pass**
   - Goal: review `.codex-uplift/v0.2-scope-map.md`, `.codex-uplift/v0.2-implementation-plan.md`, and `.codex-uplift/v0.2-deferral-check.md` for missing requirements, silent deferrals, and closed seams.
   - Output artifact: `.codex-uplift/delegated/B1-scope-deferral-review.md`
   - Role: artifact reviewer.
   - Disposition required before broad implementation.

### Required before release-candidate checkpoint

3. **Installer/config safety test review**
   - Goal: verify that safety-critical tests cover non-overwrite behavior, candidate files, backups, install modes, plugin path resolution, duplicate skills, manifest/status/uninstall, hook output shapes, and package hygiene.
   - Output artifact: `.codex-uplift/delegated/D1-installer-config-test-review.md`
   - Role: test harness reviewer or installer safety reviewer.
   - Disposition required before release-candidate review.

4. **Release-candidate independent review**
   - Goal: inspect the final diff/artifacts against v0.2 acceptance criteria and release checkpoint requirements.
   - Output artifact: `.codex-uplift/delegated/E1-release-candidate-review.md`
   - Role: release candidate reviewer.
   - Disposition required before the orchestrator asks the user for a release decision.

If subagents are unavailable, the orchestrator must create the same artifacts serially and record in `.codex-uplift/delegation-ledger.md`:

```text
Subagents unavailable or unusable in this session. Required delegated passes were performed serially by the orchestrator; no independent subagent review occurred.
```

This fallback is allowed, but it must not pretend independent review happened.

## 4. Recommended additional delegation by v0.2 workstream

The required passes above are the floor. Use these additional delegations when the implementation scope is non-trivial.

| Workstream | Delegate? | Suggested role | Artifact | Notes |
|---|---:|---|---|---|
| v0.1 baseline verification | Recommended | evidence explorer | `.codex-uplift/delegated/A2-v0.1-baseline.md` | Inventory current CLI, templates, tests, package files. |
| Config platform assumptions | Recommended | config/platform reviewer | `.codex-uplift/delegated/A3-config-platform-baseline.md` | Validate assumptions against local docs/source baseline; flag unknowns. |
| CLI command surface | Optional | implementation worker | `.codex-uplift/delegated/C1-cli-command-slice.md` | Only if exact file ownership is clear. |
| `inspect` / inventory implementation | Recommended | implementation worker | `.codex-uplift/delegated/C2-inspect-slice.md` | Good bounded implementation slice. |
| `config doctor` | Recommended | config doctor + implementation worker | `.codex-uplift/delegated/C3-config-doctor-slice.md` | Keep live config mutation forbidden. |
| `config candidate` / profiles | Recommended | config posture reviewer | `.codex-uplift/delegated/C4-profile-candidate-review.md` | Candidate-only; no live application. |
| Install modes classic/plugin/hybrid | Recommended | package hygiene reviewer | `.codex-uplift/delegated/C5-install-modes-review.md` | Watch duplicate skill names and marketplace paths. |
| Manifest/status/uninstall | Optional | implementation worker | `.codex-uplift/delegated/C6-manifest-uninstall-slice.md` | Bounded if files are modularized. |
| Project candidate generation | Recommended | artifact writer/reviewer | `.codex-uplift/delegated/C7-project-candidate-review.md` | Candidate-only; no real project config overwrite. |
| Hooks/rules candidates | Recommended | safety reviewer | `.codex-uplift/delegated/C8-hooks-rules-review.md` | Guardrail semantics, not complete security boundary. |
| Compaction prompt candidates | Recommended | context-efficiency reviewer | `.codex-uplift/delegated/C9-compaction-review.md` | Do not claim performance without eval. |
| RTK evaluation-only scaffold | Recommended | evidence explorer/reviewer | `.codex-uplift/delegated/C10-rtk-eval-only-review.md` | Do not install or activate RTK. |
| Safety-critical tests | Recommended | test implementation worker + reviewer | `.codex-uplift/delegated/D2-test-implementation-notes.md` | One worker may implement; another reviews if available. |
| Documentation consistency | Recommended | artifact reviewer | `.codex-uplift/delegated/D3-doc-consistency-review.md` | Check README, roadmap, state, acceptance matrix. |

## 5. Orchestrator-owned artifacts before delegation

Before spawning subagents, create or update:

```text
.codex-uplift/delegation-plan.md
.codex-uplift/delegation-ledger.md
.codex-uplift/delegation-dispositions.md
.codex-uplift/validation-log.md
```

`delegation-plan.md` should include:

```markdown
# Delegation Plan

## Availability
- Subagents available: yes/no/unknown
- Custom agents available: <list or unknown>
- Current sandbox/approval posture:
- Whether inherited posture is acceptable:

## Planned delegated tasks
| Task ID | Role | Phase | Objective | Allowed write scope | Artifact | Sandbox/approval expectation | Required before |
|---|---|---|---|---|---|---|---|

## Non-delegated tasks
| Task | Reason not delegated | Risk mitigation |
|---|---|---|
```

`delegation-ledger.md` should record one entry per spawned task:

```markdown
## <Task ID> — <Short title>

- Status: planned | spawned | returned | reviewed | accepted | revise | parked | rejected
- Agent/custom role:
- Spawn time:
- Completion time:
- Objective:
- Task boundary:
- Allowed write scope:
- Forbidden scope:
- Expected artifact path:
- Actual artifact path:
- Expected return shape:
- Sandbox/approval expectation:
- Verification requested:
- Summary received:
- Orchestrator disposition:
- Integration action:
- Follow-up / deferral:
```

`delegation-dispositions.md` should separate subagent claims from orchestrator judgment:

```markdown
## <Task ID> — <Artifact path>

### Subagent summary
- Observations:
- Inferences:
- Recommendations:
- Open questions:

### Orchestrator review
- Disposition: accept | revise | park | reject
- Reason:
- Evidence checked by orchestrator:
- Integration action:
- Verification needed:
- Boundary / deferral:
```

## 6. General subagent contract

Every substantive subagent task must include all of the following:

```text
Task ID:
Role:
Objective:
Planning suite path:
Relevant source-of-truth docs:
Task boundary:
Allowed write scope:
Forbidden scope:
Expected artifact path:
Expected artifact shape:
Expected immediate return shape:
Sandbox/approval expectation:
Verification requested:
Stop condition:
```

Default return shape:

```text
status: success | partial | blocked | failed
artifact_path:
key_findings:
files_changed_or_inspected:
verification_performed:
open_questions:
risks_or_conflicts:
requested_disposition: accept | revise | park | reject
```

Default stop condition:

```text
If you need to exceed the allowed write scope, activate live user config, perform a destructive operation, publish, push remotely, or decide a product/release question, stop and report instead of proceeding.
```

## 7. Copy-paste delegation prompts

### 7.1 Evidence inventory pass

```text
Spawn one read-only evidence explorer subagent.

Task ID: A1-evidence-inventory
Objective: Inspect the actual codex-uplift-kit repo/package state before v0.2 implementation.

Context:
- Planning suite: .planning/initiatives/codex-uplift-current-design-suite/
- Treat CODEX_UPLIFT_STATE.md and CODEX_UPLIFT_ROADMAP.md as planning state, not implementation evidence.

Task boundary:
- Inspect package files, CLI entry points, templates, tests, package scripts, README/docs, plugin/skill/hook/config assets.
- Separate observed facts from inferences and recommendations.
- Do not edit implementation code.

Allowed write scope:
- .codex-uplift/delegated/A1-evidence-inventory.md only.

Artifact must include:
- observed files and directories;
- current CLI commands and flags;
- current installer behavior visible from code;
- current tests/smoke checks;
- current template surfaces;
- missing or ambiguous implementation evidence;
- likely v0.1 completion status;
- risks that affect v0.2 planning.

Immediate return:
- status
- artifact_path
- top 5 observed blockers or risks
- top 5 implementation-ready surfaces
- open questions
- requested_disposition
```

### 7.2 Scope and deferral review pass

```text
Spawn one artifact reviewer subagent.

Task ID: B1-scope-deferral-review
Objective: Review the v0.2 scope map, implementation plan, and deferral check before implementation.

Inputs:
- .codex-uplift/v0.2-scope-map.md
- .codex-uplift/v0.2-implementation-plan.md
- .codex-uplift/v0.2-deferral-check.md
- .planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP.md
- .planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_V0_2_ACCEPTANCE_MATRIX.md
- .planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md
- .planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md

Task boundary:
- Review for missing required v0.2 capabilities, silent deferrals, unpreserved seams, overreach into v0.3, and ambiguous release criteria.
- Do not edit implementation code.

Allowed write scope:
- .codex-uplift/delegated/B1-scope-deferral-review.md only.

Artifact must include:
- required changes before implementation;
- acceptable deferrals;
- unacceptable silent deferrals;
- seams that must remain open;
- v0.3 leakage, if any;
- recommendation to proceed/revise/park.

Immediate return:
- status
- artifact_path
- proceed_or_revise
- blockers
- non_blocker_recommendations
- requested_disposition
```

### 7.3 Bounded implementation slice

```text
Spawn one implementation worker subagent.

Task ID: <C#-slice-name>
Objective: Implement <specific v0.2 capability> only.

Owned files/directories:
- <exact paths>

Forbidden files/directories:
- <exact paths>
- ~/.codex or real user-home config
- npm publish / git tag / remote push surfaces

Acceptance criteria:
- <specific behavior>
- <specific tests>
- <specific docs/candidates>

Allowed write scope:
- Owned files/directories above
- .codex-uplift/delegated/<Task ID>-implementation-notes.md

Artifact must include:
- files changed;
- why each change was needed;
- tests added/updated;
- verification run;
- known limitations;
- any deviations or scope pressure.

Immediate return:
- status
- artifact_path
- files_changed
- tests_run_and_results
- risks_or_conflicts
- requested_disposition

Stop condition:
- If the slice requires touching unowned files, changing live user config, or changing release policy, stop and report instead of expanding scope.
```

### 7.4 Installer/config safety test review

```text
Spawn one installer safety reviewer subagent.

Task ID: D1-installer-config-test-review
Objective: Review whether v0.2 tests cover the safety-critical installer, config, profile, plugin, and manifest behavior required for release-candidate status.

Inputs:
- package test files
- package scripts
- CLI implementation
- CODEX_UPLIFT_V0_2_ACCEPTANCE_MATRIX.md
- CODEX_UPLIFT_RELEASE_CHECKPOINT.md

Task boundary:
- Inspect tests and test scripts.
- Identify missing blocker and non-blocker tests.
- Do not edit implementation code unless separately assigned.

Allowed write scope:
- .codex-uplift/delegated/D1-installer-config-test-review.md only.

Artifact must check coverage for:
- dry-run behavior;
- no overwrite without force;
- candidate-on-conflict;
- backup-on-force;
- install modes classic/plugin/hybrid;
- component selection;
- plugin marketplace path resolution;
- duplicate-skill detection;
- JSON/TOML template parse checks;
- hook output shape checks;
- manifest/status/uninstall;
- system file ignore/package hygiene;
- temp-home install tests;
- config candidate non-destructiveness.

Immediate return:
- status
- artifact_path
- blocker_missing_tests
- non_blocker_missing_tests
- commands_run
- requested_disposition
```

### 7.5 Release-candidate independent review

```text
Spawn one release-candidate reviewer subagent.

Task ID: E1-release-candidate-review
Objective: Independently review whether the current repo state is ready for the user's v0.2 release decision.

Inputs:
- current git diff/status
- .codex-uplift/implementation-observations.md
- .codex-uplift/v0.2-scope-map.md
- .codex-uplift/v0.2-implementation-plan.md
- .codex-uplift/v0.2-deferral-check.md
- .codex-uplift/validation-log.md
- .codex-uplift/delegation-ledger.md
- .codex-uplift/delegation-dispositions.md
- CODEX_UPLIFT_RELEASE_CHECKPOINT.md
- CODEX_UPLIFT_V0_2_ACCEPTANCE_MATRIX.md

Task boundary:
- Review readiness only.
- Do not publish, tag, push, or edit live config.
- Do not silently waive release blockers.

Allowed write scope:
- .codex-uplift/delegated/E1-release-candidate-review.md only.

Artifact must include:
- release blocker list;
- non-blocker risk list;
- verification summary;
- unverified assumptions;
- deferrals and whether each has preserved seams;
- package/version/readme/npm readiness observations;
- recommendation: ship alpha, ship stable, hold, or revise.

Immediate return:
- status
- artifact_path
- release_recommendation
- blockers
- non_blocker_risks
- requested_disposition
```

## 8. Orchestrator integration rule

The orchestrator must review each delegated artifact before integrating it.

Do not treat a subagent's answer as automatically correct. For each returned artifact, the orchestrator must record:

```text
Disposition: accept | revise | park | reject
Reason:
Evidence checked:
Integration action:
Follow-up or deferral:
```

If the orchestrator rejects or parks a delegated artifact, it must preserve the artifact and explain why it was not integrated.

## 9. Token-efficiency and context-rot rule

Delegation should reduce context rot, not multiply it.

Therefore:

- subagents should write full results to artifacts, not paste long raw findings into chat;
- immediate returns should be compact and structured;
- raw command output should be summarized unless the exact output is load-bearing;
- load-bearing exact output should be preserved in an artifact or log with a path;
- the orchestrator should maintain `.codex-uplift/context-pack.md` or equivalent when the session gets long;
- each compaction/handoff should preserve current scope, accepted decisions, active deferrals, verification status, and delegated artifact dispositions.

Do not use subagents for noisy exploratory dumping unless their output is filtered, structured, and artifact-backed.

## 10. Worktree and conflict discipline

Before spawning write-capable subagents, the orchestrator must:

1. inspect `git status`;
2. identify existing dirty state;
3. record whether dirty files are owned by the current task;
4. avoid delegating overlapping edits into the same file set;
5. define allowed write scope exactly;
6. require the subagent to stop if scope expansion is needed.

If multiple implementation subagents are used, assign non-overlapping file ownership. Prefer sequential integration for shared CLI files, package manifests, and README/release docs.

## 11. Release and publication boundary

Delegation may support release-candidate preparation, but no subagent may publish or release.

The orchestrator must stop before:

```text
npm publish
git tag
git push
gh release create
changing real ~/.codex/config.toml
enabling hooks/rules/full-access profiles in live user config
```

At the stop point, create:

```text
.codex-uplift/release-candidate-review.md
.codex-uplift/v0.3-handoff.md
```

and ask the user for the release decision.

## 12. Addendum prompt to give the orchestrator

You can give the orchestrator this exact instruction:

```text
In addition to the existing planning suite, follow CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md.

You are the main orchestrator. Use subagents as bounded helpers, not as product owners. Before implementation, create the required .codex-uplift state and delegation artifacts. If subagents are available, perform at least the required evidence-inventory, scope/deferral review, installer/config safety test review, and release-candidate review passes. Each delegated task must have an artifact path, allowed write scope, expected return shape, sandbox/approval expectation, and a recorded disposition.

Do not publish, tag, push, mutate live user-home config, enable live hooks/rules/full-access profiles, or start v0.3 without explicit user approval. Run automatically only through v0.2 release-candidate preparation.
```
