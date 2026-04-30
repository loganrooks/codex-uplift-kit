# CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md

Date: 2026-04-30

Subject: Token efficiency, context rot prevention, and long-horizon performance strategy

## 0. Executive position

Token efficiency is a correctness issue. Long-horizon agent work fails when context compaction or chat bloat loses decisions, artifact paths, verification state, delegated outputs, open questions, and deferrals.

The strategy is:

```text
Durable artifacts hold detail.
Compact summaries hold state.
Skills carry reusable workflows behind progressive disclosure.
Subagents return artifact paths and concise summaries.
Context packs preserve continuation-critical state.
Compaction prompts are candidate/evaluated, not blindly trusted.
Tool-output compression is evaluated before integration.
```

## 0.1 Context efficiency levers

v0.2 should treat context efficiency as a multi-layer problem rather than relying on any single mechanism:

1. **Instruction budget:** keep home `AGENTS.md` short and move workflows into skills.
2. **Tool-output budget:** prefer narrow commands, terse flags, redirected logs, and failure-focused output.
3. **Artifact budget:** preserve detail in durable artifacts with compact headers.
4. **Subagent return budget:** require artifact paths plus concise summaries instead of raw reports.
5. **Compaction budget:** provide candidate compaction prompts and evaluate continuation quality.
6. **Config budget:** expose `tool_output_token_limit`, `model_auto_compact_token_limit`, and `project_doc_max_bytes` candidates without forcing them.
7. **External filter budget:** evaluate RTK or other output filters only after correctness/provenance gates pass.

The goal is not merely fewer tokens. The goal is higher continuation fidelity per token.


## 1. Failure modes

| Failure mode | Symptom | v0.2 mitigation |
|---|---|---|
| Context rot | Agent forgets decisions/constraints. | context pack + compaction prompt candidate |
| Artifact amnesia | Agent forgets paths. | artifact index |
| Deferral loss | Future seams disappear. | deferral register in context pack |
| Token bloat | Always-loaded instructions too long. | skills + AGENTS size doctor |
| Subagent spam | Parent receives raw report. | artifact-first return contract |
| Verification drift | Agent forgets what was tested. | verification log |
| Rework loop | Agent repeats exploration. | “what not to redo” context field |
| Over-compression | Caveats lost. | eval rubric |
| Under-compression | Transcript restated. | summary budget |

## 2. v0.2 context artifacts

Generate templates for:

```text
.codex-uplift/context-pack.md
.codex-uplift/artifact-index.md
.codex-uplift/decision-register.md
.codex-uplift/verification-log.md
.codex-uplift/delegation-dispositions.md
.codex-uplift/deferrals.md
```

Each artifact should have a compact header with ID, status, summary, paths, and related deferrals.

## 3. Context pack required fields

```text
current_goal:
current_phase:
active_posture:
active_artifacts:
accepted_decisions:
open_questions:
explicit_deferrals:
verification_run:
verification_not_run:
delegated_work:
risks:
what_not_to_redo:
next_actions:
```

## 4. AGENTS and skill context budget

v0.2 should include a context doctor that reports:

- home `AGENTS.md` approximate length;
- project `AGENTS.md` approximate size and `project_doc_max_bytes` risk;
- installed skill count;
- duplicate skill names;
- long skill descriptions;
- workflows that should move from AGENTS to skills;
- large generated artifacts lacking summary headers.

## 5. Tool-output strategy

Before adding external tools, v0.2 should already encourage:

- targeted commands over broad scans;
- redirecting large logs to artifacts;
- reading failures-only output first;
- preserving full logs when summaries may omit details;
- using built-in command flags for JSON or terse output;
- recording command paths/results in verification artifacts.

## 6. RTK position

RTK is not a default component and not a candidate integration until evaluated. It is an evaluation subject because it claims command-output compression and token savings, but it may also lose load-bearing detail or interact with command policy in ways that must be tested.

The evaluation protocol lives in `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md`.

## 7. v0.3+ context possibilities

Deferred, but seams preserved:

- automatic context-pack refresh;
- compaction prompt eval automation;
- prompt routing by phase/profile;
- tool-output compression adapters;
- token-cost instrumentation;
- context-pack import/export for new sessions;
- team audit streams.
