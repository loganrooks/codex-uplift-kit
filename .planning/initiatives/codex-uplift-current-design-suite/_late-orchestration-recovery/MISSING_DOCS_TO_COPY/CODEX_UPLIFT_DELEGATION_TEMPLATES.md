# CODEX_UPLIFT_DELEGATION_TEMPLATES.md

Date: 2026-04-30

Subject: Copy-paste subagent and custom-agent delegation templates for `codex-uplift-kit` v0.2

## 0. Purpose

Use these templates when the Codex orchestrator delegates bounded work during v0.2 implementation. The templates are designed to keep delegated work auditable, token-efficient, artifact-backed, and reviewable.

The orchestrator should adapt paths and task boundaries to the actual implementation repo. Do not ask a subagent to perform broad ambiguous work without an output artifact and return-shape contract.

## 1. Generic subagent prompt template

```text
Spawn one bounded subagent for the task below. Use a suitable custom agent if available; otherwise use the closest built-in role.

Task ID: <ID>
Role: <agent role>
Objective: <one-sentence objective>

Context:
- Implementation repo: <repo path or current repo>
- Planning suite: .planning/initiatives/codex-uplift-current-design-suite/
- Relevant source-of-truth docs: <doc list>
- Current phase: <inspect | plan | implement | verify | release-candidate>

Task boundary:
- Do:
  - <specific actions>
- Do not:
  - <explicit non-actions>

Allowed write scope:
- <artifact path or file list>
- Do not edit outside this scope.

Required artifact:
- Write the full result to: <artifact path>

Artifact must include:
- observed facts with paths or command outputs;
- inferences clearly labeled;
- recommendations clearly labeled;
- open questions;
- verification performed;
- risks or conflicts;
- proposed orchestrator disposition if applicable.

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

## 2. Evidence explorer — package inventory

Use during Phase A.

```text
Spawn a read-only evidence explorer subagent.

Task ID: A1-package-inventory
Objective: Inspect the implementation package and produce an evidence-backed inventory of current v0.1 surfaces.

Context:
- Planning suite: .planning/initiatives/codex-uplift-current-design-suite/
- Start from CODEX_UPLIFT_STATE.md and CODEX_UPLIFT_ROADMAP.md.

Task boundary:
- Inspect package files, package scripts, CLI entrypoint, templates, tests, README, and existing generated artifacts.
- Separate observed files/commands from inferences.
- Identify current v0.1 surfaces and likely gaps against CODEX_UPLIFT_ROADMAP.md.
- Do not edit implementation code.

Allowed write scope:
- .codex-uplift/delegated/A1-package-inventory.md only.

Required artifact:
- .codex-uplift/delegated/A1-package-inventory.md

Immediate return:
- status
- artifact_path
- top observed surfaces
- top gaps/unknowns
- verification performed
- requested_disposition
```

## 3. Config doctor reviewer — posture/config semantics

Use during Phase A, C, or D.

```text
Spawn a config_doctor subagent.

Task ID: <ID>-config-doctor-review
Objective: Review Codex config/profile/sandbox/approval/hook/rule handling for correctness and non-destructive behavior.

Task boundary:
- Review current implementation or planned implementation of inspect/config doctor/config candidate/profile candidates.
- Check that user config is not overwritten silently.
- Check that full-access-reviewed is described as reviewed unsandboxed operation, not safe sandboxing.
- Check that hooks/rules are candidate/optional by default.
- Check that unknown effective behavior is labeled unknown.
- Do not apply live ~/.codex or project .codex config.

Allowed write scope:
- .codex-uplift/delegated/<ID>-config-doctor-review.md only.

Required artifact sections:
- observed implementation behavior;
- candidate/config merge risks;
- sandbox/approval/rules/hooks distinctions;
- unsupported claims;
- required fixes before release;
- optional improvements.

Immediate return:
- status
- artifact_path
- blocker list
- non-blocker list
- verification performed
- requested_disposition
```

## 4. Implementation worker — bounded code slice

Use only when file ownership is explicit and conflicts are unlikely.

```text
Spawn one implementation worker subagent for this bounded code slice.

Task ID: <ID>
Objective: Implement <specific feature> only.

Owned files/directories:
- <exact files or dirs the worker may edit>

Forbidden files/directories:
- <files/dirs it must not edit>

Required behavior:
- <specific acceptance criteria>

Required tests:
- <test files to add/update>
- <commands to run, if allowed>

Required artifact:
- .codex-uplift/delegated/<ID>-implementation-notes.md

Artifact must include:
- files changed;
- why each change was needed;
- verification run;
- known limitations;
- any deviations from the requested scope.

Return only:
- status
- artifact_path
- files changed
- tests run/results
- risks/conflicts
- requested_disposition

Do not edit outside the owned file set. If the task requires touching forbidden or unowned files, stop and report instead of expanding scope.
```

## 5. Test harness reviewer — safety-critical tests

Use during Phase D or before release-candidate preparation.

```text
Spawn a test_harness_reviewer subagent.

Task ID: D1-test-harness-review
Objective: Review whether v0.2 safety-critical installer/config tests cover the required behavior.

Task boundary:
- Inspect test files and package scripts.
- Compare against CODEX_UPLIFT_V0_2_ACCEPTANCE_MATRIX.md sections 9-10.
- Identify missing tests for dry-run, candidate-on-conflict, backup-on-force, install modes, component selection, duplicate skills, plugin path resolution, hook output shapes, manifest/status/uninstall, and package hygiene.
- Do not modify implementation unless explicitly assigned a separate bounded implementation task.

Allowed write scope:
- .codex-uplift/delegated/D1-test-harness-review.md only.

Immediate return:
- status
- artifact_path
- missing blocker tests
- missing non-blocker tests
- commands run
- requested_disposition
```

## 6. Package hygiene reviewer — npm/plugin/skill packaging

Use during Phase D or release-candidate preparation.

```text
Spawn a package_hygiene_reviewer subagent.

Task ID: D2-package-hygiene-review
Objective: Review package contents, npm pack behavior, plugin marketplace path, duplicate-skill risk, and unwanted files.

Task boundary:
- Inspect package config, package allowlist/ignore behavior, generated package dry-run output if available, plugin metadata, skill locations, and installer path logic.
- Check for `.DS_Store`, temp files, planning suite accidental inclusion, broken marketplace paths, duplicate skill names, missing executable modes, and stale docs.
- Do not publish, tag, push, or mutate live user config.

Allowed write scope:
- .codex-uplift/delegated/D2-package-hygiene-review.md only.

Immediate return:
- status
- artifact_path
- blockers
- warnings
- commands run
- requested_disposition
```

## 7. Artifact reviewer — deferrals and non-foreclosure

Use after planning and before release-candidate preparation.

```text
Spawn an artifact_reviewer subagent.

Task ID: <ID>-deferral-nonforeclosure-review
Objective: Review whether v0.2 deferrals are explicit and v0.3+ seams remain open.

Task boundary:
- Review .codex-uplift/v0.2-deferral-check.md, CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md, CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md, and CODEX_UPLIFT_ARCHITECTURE_SEAMS.md.
- Identify any vision-relevant capability omitted without target horizon, preserved seam, non-foreclosure constraint, acceptance criteria, and revisit trigger.
- Identify any v0.2 implementation decision that forecloses v0.3 capabilities.
- Do not settle product decisions; surface them.

Allowed write scope:
- .codex-uplift/delegated/<ID>-deferral-nonforeclosure-review.md only.

Immediate return:
- status
- artifact_path
- missing deferrals
- possible seam closures
- recommended fixes
- requested_disposition
```

## 8. Release gate reviewer — release-candidate readiness

Use in Phase E.

```text
Spawn a release_gate_reviewer subagent.

Task ID: E1-release-gate-review
Objective: Adversarially review whether the v0.2 release candidate is ready for the user's manual release decision.

Task boundary:
- Review .codex-uplift/release-candidate-summary.md, validation-log.md, npm-pack-verification.md, package-contents-report.md, git-release-plan-v0.2.md, release-decision-needed.md, CODEX_UPLIFT_RELEASE_CHECKPOINT.md, and CODEX_UPLIFT_V0_2_ACCEPTANCE_MATRIX.md.
- Classify each gate as pass, partial, candidate-only, deferred, blocked, or not checked.
- Identify blockers to npm publication or git release.
- Do not publish, tag, push, or create a release.

Allowed write scope:
- .codex-uplift/delegated/E1-release-gate-review.md only.

Immediate return:
- status
- artifact_path
- release blockers
- release warnings
- missing verification
- recommended release decision: ship | hold | revise | alpha only
- requested_disposition
```

## 9. RTK/tool-output filter evaluator — evaluation only

Use only for evaluation planning, not adoption.

```text
Spawn an evidence_explorer or artifact_reviewer subagent.

Task ID: <ID>-rtk-evaluation-review
Objective: Review whether the RTK/tool-output-filter evaluation protocol remains evaluation-only and does not imply adoption.

Task boundary:
- Review CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md and any implementation of `rtk evaluate --plan-only`.
- Confirm no active RTK install/init/config is performed by default.
- Confirm generic tool-output-filter seams remain generic and not RTK-specific.
- Identify any unsupported token-savings or performance claims.

Allowed write scope:
- .codex-uplift/delegated/<ID>-rtk-evaluation-review.md only.

Immediate return:
- status
- artifact_path
- adoption-risk findings
- unsupported claims
- verification performed
- requested_disposition
```

## 10. Compaction/context reviewer

Use during context-efficiency implementation or before release.

```text
Spawn an artifact_reviewer subagent.

Task ID: <ID>-compaction-context-review
Objective: Review context-efficiency and compaction prompt candidates for usefulness, non-overclaiming, and non-foreclosure.

Task boundary:
- Review CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md, CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md, CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md, and compaction-prompts/*.
- Confirm custom prompts are candidates, not claimed defaults.
- Confirm no unsupported claim that prompts outperform Codex defaults.
- Confirm phase/task prompt IDs remain separable for v0.3 auto-switching evaluation.

Allowed write scope:
- .codex-uplift/delegated/<ID>-compaction-context-review.md only.

Immediate return:
- status
- artifact_path
- blockers
- warnings
- suggested improvements
- requested_disposition
```

## 11. Orchestrator disposition prompt

Use after a subagent returns:

```text
Review delegated artifact <path>.

Separate:
- subagent observations;
- subagent inferences;
- subagent recommendations;
- orchestrator-verified facts;
- orchestrator decisions;
- open questions.

Disposition: accept | revise | park | reject.

Record the disposition in:
- .codex-uplift/delegation-dispositions.md
- .codex-uplift/context-pack.md, if this affects current state
- .codex-uplift/validation-log.md, if commands or verification were involved

If accepted, integrate only the accepted parts and record any boundary or deferral.
```

## 12. Delegation plan template

The orchestrator may create `.codex-uplift/delegation-plan.md` from this template:

```markdown
# Delegation plan

Date:
Current phase:
Current posture:
Worktree state:

## Delegation intent

Why delegation is useful for this slice:

## Planned delegated tasks

| Task ID | Role | Purpose | Artifact path | Write scope | Risk | Status |
|---|---|---|---|---|---|---|
| A1 | evidence_explorer | package inventory | .codex-uplift/delegated/A1-package-inventory.md | artifact only | low | planned |

## Non-delegated work

Tasks the orchestrator will keep because they involve integration, scope, release, or conflict risk:

## Conflict plan

How overlapping writes will be avoided:

## Stop conditions

When delegation should stop and return to orchestrator/user review:
```

## 13. Minimum viable delegation set for v0.2

For a serious v0.2 release-candidate run, use at least:

1. one evidence/config review before implementation or after initial inspection;
2. one package/test hygiene review before release-candidate preparation;
3. one release-gate review before asking the user to publish.

If subagents are unavailable in the current client, the orchestrator should run the same reviews directly and record that limitation in `.codex-uplift/delegation-plan.md`.
