# CODEX_UPLIFT_SOURCE_BASELINE.md

Date: 2026-04-30

Subject: External and attached sources used to ground the Codex uplift design suite

## 0. Purpose

This document records the source baseline used while preparing the design suite. It is not itself an implementation spec. It exists so future maintainers can tell which platform assumptions were current as of the suite date and which assumptions should be re-checked before implementation.

## 1. Codex platform sources checked

### Configuration and precedence

- Config reference: <https://developers.openai.com/codex/config-reference>
  - User-level config lives in `~/.codex/config.toml`.
  - Project-scoped overrides can live in `.codex/config.toml`.
  - Project-scoped config files are loaded only for trusted projects.
  - Relevant keys include `approval_policy`, `sandbox_mode`, `sandbox_workspace_write.*`, `default_permissions`, `compact_prompt`, `experimental_compact_prompt_file`, `model_auto_compact_token_limit`, `tool_output_token_limit`, `[features].codex_hooks`, and named permissions.
- Advanced config: <https://developers.openai.com/codex/config-advanced>
  - Profiles are named sets of config values selected with `codex --profile <name>` in the CLI.
  - Profiles are documented as experimental.
  - Profiles are not currently supported in the IDE extension.
  - CLI one-off overrides can use dedicated flags or `-c` / `--config`.
- Config basics: <https://developers.openai.com/codex/config-basic>
  - User config and project config are distinct layers.
  - CLI and IDE share the same configuration layers.

### Sandbox, approval, and autonomy posture

- Agent approvals and security: <https://developers.openai.com/codex/agent-approvals-security>
  - Sandbox mode controls what Codex can technically do when executing model-generated commands.
  - Approval policy controls when Codex must ask before an action.
  - CLI/IDE sandboxing uses OS-level mechanisms.
  - The `Auto` preset / `--full-auto` is workspace-write plus on-request approvals, not full host access.
  - `--dangerously-bypass-approvals-and-sandbox` / `--yolo` is the dangerous mode that disables approvals and sandboxing.
  - Codex docs recommend version-control hygiene, reviewable diffs, targeted verification, and decision documentation as practical safety measures.
- CLI reference: <https://developers.openai.com/codex/cli/reference>
  - CLI flags and aliases should be checked before implementing wrappers or launch commands.

### Hooks, rules, skills, subagents, plugins

- Hooks: <https://developers.openai.com/codex/hooks>
  - Hooks are Codex lifecycle guardrails loaded from config/hook files when enabled.
  - `PreToolUse` can deny some tool calls but is explicitly not a complete enforcement boundary.
  - Multiple matching hooks may run.
- Rules: <https://developers.openai.com/codex/rules>
  - Rules are useful for command policy outside the sandbox and can allow, prompt, or forbid matching command prefixes.
  - Rules are documented as experimental and should be treated as candidate/tested surfaces.
- Skills: <https://developers.openai.com/codex/skills>
  - Skills are the right surface for reusable workflows and progressive disclosure.
  - Duplicate skill names and skill count/description budget are product risks for a setup assistant.
- Subagents: <https://developers.openai.com/codex/subagents>
  - Subagents are useful for bounded delegation, exploration, review, and artifact-writing roles.
  - Delegation should be bounded, artifact-first, and dispositioned by the orchestrator.
- Plugins: <https://developers.openai.com/codex/plugins/build>
  - Plugins are the right distribution seam for reusable skills/assets when sharing beyond one local setup.

### Long-horizon context and compaction

- Codex best practices: <https://developers.openai.com/codex/learn/best-practices>
  - Personal defaults belong in user config; repo-specific behavior belongs in project config.
  - Approval mode and sandbox mode are distinct knobs.
  - Codex automatically compacts long conversations, and `/compact` is available for long threads.
- OpenAI API compaction guide: <https://developers.openai.com/api/docs/guides/compaction>
  - Compaction supports long-running interactions by reducing context size while preserving state needed for subsequent turns.
  - The suite applies this concept at the Codex setup level through candidate compaction prompts and context packs.
- Token counting guide: <https://developers.openai.com/api/docs/guides/token-counting>
  - Token counting can be used to understand prompt/context size and route requests by size.
- Prompt caching guide: <https://developers.openai.com/api/docs/guides/prompt-caching>
  - Prompt caching benefits exact-prefix stability; this supports keeping stable instructions and schema-like context early and moving volatile content later where applicable.

## 2. RTK sources checked

- RTK GitHub repository / README: <https://github.com/rtk-ai/rtk>
  - RTK describes itself as a CLI proxy that filters and compresses command outputs before they reach an LLM context.
  - README claims 60-90% token savings across common commands and describes smart filtering, grouping, truncation, and deduplication.
  - README states Codex support currently appears as `AGENTS.md + RTK.md instructions`, while hook-based transparent rewriting is described for some other tools.
  - README describes a tee recovery mode that can save full output on failure.
  - README says telemetry is disabled by default and opt-in, but this should be verified in the installed version before any adoption.
- RTK issue list: <https://github.com/rtk-ai/rtk/issues>
  - Recent open issues include filter-quality bugs where output can be truncated, misparsed, or incorrectly summarized. This supports the suite's evaluation-first stance.
- RTK install guide: <https://github.com/rtk-ai/rtk/blob/master/INSTALL.md>
  - There is a name-collision warning around projects named `rtk`.
  - Installation requires verifying the intended RTK by checking `rtk gain`.
- RTK disclaimer: <https://github.com/rtk-ai/rtk/blob/master/DISCLAIMER.md>
  - The project includes warranty/liability disclaimers and notes that it interacts with development environments, file systems, and external commands.

## 3. Attached local sources considered

- `codex-uplift-kit Review` supplied by the reviewing agent.
- Codex/Rust project-level `AGENTS.md` example.
- Apache Airflow project-level `AGENTS.md` example.

The attached Codex/Rust and Airflow examples are treated as production-level precedents for specificity, exact commands, architecture boundaries, testing expectations, and ask-first/never boundaries. They are not treated as authority for user-level home guidance.

## 4. Source freshness rule

Before implementing or publishing v0.2, re-check all Codex platform docs above. This is especially important for:

- config precedence and project trust mechanics;
- app vs CLI vs IDE support differences;
- profile support and profile-scoped keys;
- hooks/rules event shapes and maturity;
- compact prompt and compaction threshold keys;
- subagent inheritance semantics;
- plugin marketplace path requirements;
- full-access, auto-review, approval, and sandbox behavior.

If a source changes, update the operational spec and deferral register rather than silently relying on this baseline.
