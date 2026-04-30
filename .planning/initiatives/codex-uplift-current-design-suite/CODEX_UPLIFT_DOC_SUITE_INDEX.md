# CODEX_UPLIFT_DOC_SUITE_INDEX.md

Date: 2026-04-30

Subject: Source-of-truth map for the post-review `codex-uplift-kit` planning suite

## 0. Canonical location

When installed in the implementation repository, this suite should live at:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

The suite is planning/governance material for `codex-uplift-kit`; it is not the npm package payload itself.

## 1. Precedence

Use documents in this order when they conflict:

1. Explicit user instruction in the current task.
2. `CODEX_UPLIFT_STATE.md` — current state, known gaps, and active handoff.
3. `CODEX_UPLIFT_ROADMAP.md` — versioned roadmap and release gates.
4. `CODEX_UPLIFT_RELEASE_GOVERNANCE.md` — release slicing, deferral discipline, and manual gates.
5. `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md` — v0.2 implementation contract.
6. `CODEX_UPLIFT_AUTORUN_CONTRACT.md` — what the orchestrator may do automatically.
7. `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md` — explicit deferrals and revisit triggers.
8. `CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md` and `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md` — seams that v0.2 must preserve.
9. Context/token docs, posture docs, RTK evaluation, and source baseline.
10. Review-response artifacts, which are historical background only.

If a later artifact appears to change a source-backed platform claim, re-check the current Codex docs and record the result in `CODEX_UPLIFT_SOURCE_BASELINE.md` before relying on it.

## 2. Entry points

- `START_HERE.md` — human-facing suite entry point.
- `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` — orchestrator handoff.
- `ORCHESTRATOR_IMPLEMENTATION_DIRECTIVE.md` — copy/paste directive for the implementation orchestrator.

## 3. Late orchestration recovery and delegation

First-read documents when reconciling the late recovery package:

- `CODEX_UPLIFT_ORCHESTRATION_DOCS_RECONCILIATION.md` — explains why the orchestration documents were added late and how to treat the correction.
- `CODEX_UPLIFT_PARTIAL_IMPLEMENTATION_RETROFIT_HANDOFF.md` — retrofit flow for a repo where v0.2 implementation already advanced.
- `CODEX_UPLIFT_ORCHESTRATION_AND_DELEGATION_PLAN.md` — canonical orchestrator/delegation plan.
- `CODEX_UPLIFT_ORCHESTRATOR_DELEGATION_ADDENDUM.md` — delegation expectations, artifact contracts, and release-review pass guidance.
- `CODEX_UPLIFT_WORKTREE_ORCHESTRATION_ADDENDUM.md` — worktree, checkpoint, ownership, and integration protocol.

Supporting references:

- `CODEX_UPLIFT_DELEGATION_TEMPLATES.md` — prompt and artifact templates for delegated work.
- `CODEX_UPLIFT_CURRENT_REPO_RECONCILIATION_NOTE.md` — reconciliation note for the current repo state.
- `CODEX_UPLIFT_POST_IMPLEMENTATION_ORCHESTRATION_NOTE.md` — post-implementation orchestration note.
- `CODEX_UPLIFT_LATE_ORCHESTRATION_PATCH_NOTE.md` — late patch note and provenance.
- `CODEX_UPLIFT_ORCHESTRATION_ADDENDUM.md` — extended orchestration reference.
- `CODEX_UPLIFT_WORKTREE_ISOLATION_ADDENDUM.md` — extended worktree isolation reference.
- `delegation-templates/README.md` — reusable delegation template index.

## 4. Current-state and planning docs

- `CODEX_UPLIFT_STATE.md` — current status, what v0.1 means, and what must be observed in the actual repo.
- `CODEX_UPLIFT_ROADMAP.md` — concrete v0.1/v0.2/v0.3 roadmap.
- `CODEX_UPLIFT_STATUS_AND_HANDOFF.md` — short handoff summary and next actions.
- `CODEX_UPLIFT_AUTORUN_CONTRACT.md` — automatic execution boundaries and manual gates.
- `CODEX_UPLIFT_RELEASE_CHECKPOINT.md` — v0.2 release-candidate checklist.

## 5. Build contract docs

- `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md` — v0.2 feature contract.
- `CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md` — sandbox/approval/profile semantics and candidate profiles.
- `CODEX_UPLIFT_RELEASE_GOVERNANCE.md` — release slicing, commit/release discipline, and deferral rules.

## 6. Long-horizon docs

- `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md` — named deferrals, acceptance criteria, and revisit triggers.
- `CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md` — future capabilities and seams v0.2 must preserve.
- `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md` — extension points and anti-closure constraints.
- `CODEX_UPLIFT_V0_3_PLUS_HORIZON.md` — v0.3+ implications for v0.2 design.

## 7. Context/token-efficiency docs

- `CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md` — artifact-first, compact-active-context strategy.
- `CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md` — user/project compaction prompt candidates and cautions.
- `CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md` — how to evaluate compaction prompts.
- `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md` — RTK/tool-output-filter evaluation-only track.

## 8. Source/evidence docs

- `CODEX_UPLIFT_SOURCE_BASELINE.md` — source-backed platform assumptions and re-check anchors.
- `REVIEW_RESPONSE.md` — response to external review, historical.
- `REVIEW_RESPONSE_V0_2_ADDENDUM.md` — framing addendum, historical bridge.

## 9. Rule for missing docs

If any entry point references a missing file, the orchestrator must stop implementation and either:

1. create the missing planning artifact from the suite's existing materials, or
2. record the missing artifact as a blocking observation in `.codex-uplift/implementation-observations.md` and ask for user direction.

For the current suite, the expected documents are those listed in `MANIFEST.md`.
