# CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md

Date: 2026-04-30

Subject: User-level and project-level compaction prompt strategy

## 0. Executive position

Compaction prompt configuration is useful enough to include in v0.2 as candidate support, even if some aspects are experimental or client-dependent.

The package should generate prompts and config candidates, but it should not claim superiority over Codex defaults without evaluation.

## 0.1 Current Codex config facts to preserve

As of 2026-04-30, the Codex config reference documents:

- `compact_prompt`: inline override for the history compaction prompt;
- `experimental_compact_prompt_file`: file-based compaction prompt override;
- `model_auto_compact_token_limit`: token threshold that triggers automatic history compaction;
- `model_context_window`: context-window token metadata for the active model;
- `tool_output_token_limit`: token budget for storing individual tool/function outputs in history;
- profile-scoped overrides for supported configuration keys;
- project `.codex/config.toml` overrides that load only when the project is trusted, with closer project configs winning when keys conflict.

The default built-in compaction prompt text is not documented in the checked public config reference. Therefore v0.2 should not claim that a package prompt is globally better than the default. It should provide prompt candidates and evaluation fixtures.


## 1. Known configuration surfaces

v0.2 should account for:

- inline `compact_prompt`;
- `experimental_compact_prompt_file` path;
- `model_auto_compact_token_limit`;
- `tool_output_token_limit`;
- project `.codex/config.toml` candidates;
- profile-scoped behavior only if documented or probed.

## 2. Prompt registry

Prompts should be represented as registry entries:

```json
{
  "prompt_id": "general-continuity",
  "version": "0.2.0",
  "path": "prompts/general-continuity.md",
  "scope": "user|project|profile|phase",
  "status": "candidate",
  "eval_status": "untested",
  "intended_phases": ["general"]
}
```

## 3. v0.2 prompt candidates

### `general-continuity`

Preserve current goal, active artifacts, decisions, deferrals, verification, risks, next steps, and what not to redo.

### `research-audit`

Emphasize sources checked, source-backed observations, inferences, unsupported claims, open questions, and decision boundaries.

### `implementation`

Emphasize changed files, tests, current failures, remaining edits, verification state, and rollback boundary.

### `delegation-heavy`

Emphasize subagent tasks, artifact paths, dispositions, conflicts, and orchestrator decisions.

### `high-autonomy`

Emphasize posture, gates passed, checkpoints, risky operations, recovery artifacts, approval/rule/hook outcomes, and next guardrail.

## 4. Candidate config behavior

v0.2 should generate, not apply:

```toml
# Candidate only: review before merging.
compact_prompt = "<inline prompt>"
# or
experimental_compact_prompt_file = "/path/to/prompt.md"
model_auto_compact_token_limit = 120000
tool_output_token_limit = 20000
```

Do not set thresholds by default without user review; models and client behavior can change.

## 5. Project-level behavior

Project prompt candidates should be generated only after project inspection. They should reference project artifact locations and domain-specific failure modes.

Do not assume project config is loaded unless the project `.codex/` layer is trusted.

## 6. Automatic switching

Automatic prompt switching is not v0.2. It is D-015.

v0.2 must preserve the seam by storing prompt IDs, intended phases, profile hints, and candidate config snippets separately.

## 7. Evaluation requirement

Do not claim a package prompt is better than the Codex default unless it passes the eval plan in `CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md`.

## 8. Source anchors to re-check during implementation

These claims are platform-sensitive and must be re-checked before implementation:

- Codex prompting docs state that Codex may automatically compact long-running tasks by summarizing relevant information and discarding less relevant details: https://developers.openai.com/codex/prompting
- Codex config reference documents `compact_prompt` as an inline override for the history compaction prompt and `experimental_compact_prompt_file` as an experimental file-based override: https://developers.openai.com/codex/config-reference
- Codex config reference documents `model_auto_compact_token_limit` as the token threshold for automatic history compaction and `tool_output_token_limit` as the token budget for individual tool/function outputs stored in history: https://developers.openai.com/codex/config-reference
- A public OpenAI/codex issue discusses the then-current default compaction prompt and the specific failure mode of repeated compactions losing prior context; treat that issue as useful field evidence, not as authoritative platform documentation: https://github.com/openai/codex/issues/14347

Implementation rule: generate candidate prompts and candidate config only. Do not silently replace a user's compaction prompt or assert that a package prompt is superior without running the eval plan.
