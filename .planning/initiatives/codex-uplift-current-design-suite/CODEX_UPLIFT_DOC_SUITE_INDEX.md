# CODEX_UPLIFT_DOC_SUITE_INDEX.md

Date: 2026-04-30

Subject: Source-of-truth map for the `codex-uplift-kit` design suite

## 0. Executive position

This suite treats `codex-uplift-kit` as a **Codex setup and posture assistant**, not merely a file-copy bootstrap bundle.

v0.1 was a valid bootstrap slice. v0.2 should become the first credible setup-assistant slice: inspect existing setup, generate non-destructive candidates, expose install modes, support posture profiles, initialize project-specific Codex surfaces from repo evidence, and preserve long-horizon context/audit state.

The suite also treats v0.3+ as design-relevant now. Future capabilities do not need to be implemented in v0.2, but v0.2 must not accidentally close the seams needed for them.

## 1. Document roles

| Document | Role | Source-of-truth boundary |
|---|---|---|
| `CODEX_UPLIFT_RELEASE_GOVERNANCE.md` | Governs release slicing, deferral discipline, non-foreclosure, and acceptance gates. | Highest-level process/source of truth. |
| `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md` | Buildable v0.2 product contract: commands, components, profiles, candidates, tests. | Source of truth for what v0.2 must implement. |
| `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md` | Tracks vision-relevant not-now capabilities and how v0.2 preserves them. | Source of truth for explicit deferrals. |
| `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md` | Names extension seams and anti-closure constraints. | Source of truth for how future capability remains possible. |
| `CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md` | Defines sandbox/approval/permission/autonomy profile candidates. | Source of truth for posture semantics. |
| `CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md` | Defines token efficiency and long-horizon anti-context-rot strategy. | Source of truth for context architecture. |
| `CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md` | Defines user/project compaction prompt candidates and prompt registry. | Source of truth for compaction prompt handling. |
| `CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md` | Defines evaluation fixtures and rubrics for continuation quality. | Source of truth for prompt/context evaluation. |
| `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md` | Evaluates RTK as a possible future tool-output compression integration. | Source of truth for RTK posture: evaluate first, do not auto-include. |
| `CODEX_UPLIFT_V0_3_PLUS_HORIZON.md` | Maps future capabilities to v0.2 design implications. | Source of truth for future-aware non-foreclosure. |
| `REVIEW_RESPONSE.md` | Formal response to external package review. | Historical/review artifact, not implementation spec. |
| `REVIEW_RESPONSE_V0_2_ADDENDUM.md` | Framing correction and bridge from review to v0.2. | Historical/transition artifact. |

## 2. No-silent-deferral rule

If v0.2 decides not to implement capability `X`, and `X` is still relevant to the product vision, the relevant document must state:

```text
Capability X:
- target horizon or parking status;
- deferred-to artifact;
- preserved seam;
- v0.2 implementation choices that would foreclose it;
- required non-foreclosure constraint;
- acceptance criteria for revival;
- revisit trigger.
```

A phrase such as “future work,” “out of scope,” “later,” or “not now” is invalid unless paired with the fields above.

## 3. v0.2 source-of-truth precedence

When docs conflict:

1. `CODEX_UPLIFT_RELEASE_GOVERNANCE.md` controls release/deferral process.
2. `CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md` controls v0.2 implementation scope.
3. `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md` controls named deferrals.
4. `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md` controls non-foreclosure design constraints.
5. Specialty docs control their domain: posture, context, compaction, RTK evaluation.

Review-response docs are lower precedence than the suite source-of-truth docs.

## 4. v0.2 acceptance summary

v0.2 is not complete unless it provides:

- `inspect` and `doctor` surfaces for existing Codex setup;
- non-destructive candidate generation for user and project config;
- explicit install modes and component selection;
- duplicate-skill and plugin-path handling;
- manifest/status/uninstall support;
- posture profile candidates with warnings and client notes;
- project-specific setup candidates based on repo evidence;
- rules/hooks candidates with documented boundaries;
- context efficiency and compaction prompt candidates;
- safety-critical installer tests;
- a living deferral register and seam map.

## 5. Explicit non-goals for v0.2

v0.2 should not claim:

- that it is a security boundary;
- that `danger-full-access + auto_review` is safe;
- that hooks fully enforce policy;
- that RTK should be installed or enabled by default;
- that compaction prompts improve performance without evaluation;
- that app, CLI, IDE, and project config expose identical behavior;
- that it can compute exact effective runtime behavior without probes and client/version annotations.

These are not dismissed. They are handled through deferrals, probes, and preserved seams.


## 7. Governance rule: output-filter adoption requires evaluation

External output-filter tools such as RTK must not be installed, recommended as defaults, or treated as v0.2 adoption candidates merely because they promise token savings. v0.2 should preserve a generic output-filter seam and document evaluation gates. Adoption requires Codex-client compatibility, correctness checks, information-retention checks, safety/privacy review, raw-output recovery, reversibility, and local token-savings measurements.
