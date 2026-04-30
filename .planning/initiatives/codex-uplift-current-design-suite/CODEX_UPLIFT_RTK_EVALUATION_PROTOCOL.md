# CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md

Date: 2026-04-30

Subject: Evaluation plan for RTK / external tool-output filtering in `codex-uplift-kit`

## 0. Disposition

RTK should **not** be installed, recommended as a default, or treated as a v0.2 adoption candidate until it is evaluated against Codex-specific mechanics.

The correct v0.2 posture is:

```text
Preserve a generic tool-output-filter seam.
Document an RTK evaluation track.
Do not install RTK.
Do not generate active RTK hook/config integration.
Do not claim RTK improves Codex until local Codex-specific probes pass.
```

This is not anti-RTK. RTK is plausibly valuable because command output is one of the biggest context-rot drivers in agentic development. But the package's standard for adoption should be higher than "promising tool exists." The adoption standard should be: **Codex-compatible, reversible, measurable, safety-reviewed, and audit-preserving.**

## 0.1 Source basis and current verification notes

Verified sources as of 2026-04-30:

- RTK's public README describes RTK as filtering/compressing command output before it reaches the LLM context and claims 60-90% token savings across common developer commands.
- The same README lists many explicit `rtk ...` command wrappers, including `rtk git status`, `rtk git diff`, `rtk pytest`, `rtk cargo test`, `rtk ruff check`, `rtk docker ps`, and related commands.
- RTK's supported-tools table lists Codex setup as `rtk init -g --codex` using `AGENTS.md + RTK.md instructions`, while transparent hook rewriting is listed for other tools such as Claude Code, Copilot, Cursor, Gemini CLI, and OpenCode. Therefore transparent command rewrite for Codex should be treated as unverified unless a local Codex/client probe proves it.
- RTK documents tee recovery for failed commands and says telemetry is disabled by default and requires opt-in. These are promising, but they must still be verified locally before adoption.
- The upstream materials contain at least one license/metadata inconsistency in web-rendered surfaces: some rendered text says MIT while GitHub metadata reports Apache-2.0. v0.2 must verify license/provenance from the repository `LICENSE` file before packaging or recommending RTK.

This source basis strengthens, rather than weakens, the evaluation-only posture: RTK is plausibly valuable, but Codex-specific integration behavior, raw-output recovery, privacy, and correctness must be tested before inclusion.


## 1. What RTK appears to be

RTK describes itself as a CLI proxy that filters and compresses command outputs before those outputs reach the LLM context. Its README claims 60-90% token savings across common developer commands, with support for commands such as `git`, `cargo`, `pytest`, `ruff`, `docker`, `kubectl`, `aws`, and others. The README also describes strategies such as smart filtering, grouping, truncation, and deduplication.

RTK also provides a `tee` recovery mechanism: when a command fails, full unfiltered output can be saved so the model can inspect it without rerunning the command.

These are attractive ideas for `codex-uplift-kit`, but they are not sufficient to justify automatic adoption.

## 2. Why this could matter for Codex uplift

Long-horizon Codex work suffers when the active conversation accumulates:

- full test logs;
- repeated `git status` / `git diff` output;
- large directory listings;
- full linter reports;
- noisy package-manager output;
- verbose build logs;
- subagent returns that include raw logs instead of artifact paths.

A good output-filter layer could reduce context rot while preserving correctness if it provides:

- compact summaries;
- exit-code fidelity;
- failure-focused output;
- access to full raw output when needed;
- stable artifact/log paths;
- explicit marking that output was filtered;
- evaluation proving the filter does not hide load-bearing facts.

This aligns with the package's broader pattern: durable artifact + compact active-context summary.

## 3. Codex-specific feasibility assessment

### 3.1 Explicit RTK command use

Status: **feasible to evaluate.**

Example:

```bash
rtk git status
rtk git diff
rtk pytest path/to/test.py
rtk cargo test -p crate
```

This is the safest initial mode because Codex intentionally invokes RTK rather than relying on transparent rewriting. It is also easy to disable: stop using the `rtk` prefix.

Limitations:

- the agent may forget to use RTK;
- project `AGENTS.md` can encourage it, but instructions are not enforcement;
- information-loss risk remains and must be measured;
- full raw output recovery must be verified per command type.

### 3.2 RTK's advertised Codex integration

Status: **instructional, not proven transparent rewrite.**

RTK's README lists `rtk init -g --codex` and describes the Codex method as `AGENTS.md + RTK.md instructions`, while its auto-rewrite hook mode is described for other tools such as Claude Code and Cursor. Therefore, for Codex, the current advertised integration appears to rely on instructions rather than a Codex-native transparent command rewrite.

Implication: `codex-uplift-kit` should not describe RTK as providing automatic Codex command rewriting unless that behavior is independently verified in the target Codex client/version.

Codex-specific ambiguity to preserve: upstream quick-start prose around automatic rewriting is broad, but the supported-tools table gives Codex a different integration method from true hook-based rewrite. v0.2 should therefore record both observations and resolve the conflict with a local probe, not by optimistic interpretation.


### 3.3 Codex `PreToolUse` hook rewrite

Status: **not currently a reliable transparent rewrite mechanism.**

Codex `PreToolUse` hooks can inspect supported tool calls and block a Bash command, and they can surface `systemMessage`. However, the documented `updatedInput` path is parsed but not supported yet, and unsupported fields fail open. This means a Codex hook cannot currently be assumed to rewrite `git status` into `rtk git status` in the same way RTK describes for Claude Code.

A Codex hook could potentially deny a raw command and tell the agent to rerun with `rtk`, but that is not the same as transparent rewrite. It increases friction, can create loops, and is not suitable as a default without careful testing.

### 3.4 Codex `PermissionRequest` hook

Status: **not a general RTK adoption mechanism.**

`PermissionRequest` hooks run when Codex is about to ask for approval. They do not run for commands that do not need approval. Therefore they are useful for safety policy, but not for broad output filtering.

### 3.5 Codex rules

Status: **useful for command policy, not output filtering.**

Rules control which commands Codex can run outside the sandbox. They can `allow`, `prompt`, or `forbidden` command prefixes and are valuable for high-autonomy safety. They do not transform command output and should not be treated as an RTK substitute.

### 3.6 PATH wrappers / shell aliases

Status: **possible but not recommended for v0.2.**

One could imagine wrapper scripts that shadow `git`, `cargo`, `pytest`, etc. and route through RTK. That is risky as a default because it changes command semantics globally or per-session, may confuse humans, may break scripts, and can hide the fact that output was filtered.

This should be rejected for v0.2 unless an explicit, isolated evaluation environment is created.

### 3.7 MCP or future tool-wrapper integration

Status: **future seam.**

A more elegant future may be a tool wrapper or MCP layer that runs commands, stores raw output, returns compact summaries, and exposes raw-output reads on demand. That should be represented as a generic `OutputFilterProvider`, not as hard-coded RTK adoption.

## 4. Evaluation gates

RTK may move from "evaluation track" to "optional integration candidate" only if these gates pass.

### Gate A — Installation and provenance

- Verify installed RTK binary and version.
- Verify installation source and update mechanism.
- Confirm uninstall path.
- Confirm no name-collision with a different `rtk` package.
- Record where RTK config, history, tee logs, and telemetry settings live.

### Gate B — Codex client compatibility

Evaluate separately for:

- Codex CLI;
- Codex desktop/app;
- Codex IDE extension if relevant;
- WSL/native Windows if relevant.

For each client, record whether RTK can be used through:

- explicit command prefix;
- instruction-only `AGENTS.md`/`RTK.md` guidance;
- deny-with-suggestion hook;
- transparent rewrite; or
- not supported.

### Gate C — Correctness and information retention

For each representative command, compare raw output vs RTK output:

- `git status`;
- `git diff --stat` and a targeted diff;
- a failing unit test;
- a passing unit test;
- a linter with multiple errors;
- a build failure;
- a directory listing;
- a search command;
- a command with non-zero exit code.

The evaluation should answer:

- Was the exit code preserved?
- Were all failing tests or errors named?
- Were file paths and line numbers preserved where needed?
- Was the failure cause recoverable?
- Was a raw-output path available?
- Did the filtered output hide any load-bearing fact?

### Gate D — Safety and privacy

Evaluate:

- whether telemetry is disabled by default and how to verify/disable it;
- what local tracking database is written;
- what raw output is saved by tee and where;
- whether tee logs can contain secrets;
- whether file permissions on saved logs are acceptable;
- whether `rtk env`, `rtk aws`, `rtk curl`, or similar commands can expose sensitive output;
- how to purge local RTK data;
- whether RTK rewrites or summarizes remote/destructive commands in ways that could hide risk.

### Gate E — Token savings measurement

Do not rely only on upstream claimed savings.

Measure on local representative tasks:

- approximate raw-output tokens;
- approximate filtered-output tokens;
- number of commands where RTK was helpful;
- number of commands where RTK hid too much;
- cases where the agent had to request raw output anyway;
- net context savings after recovery reads.

### Gate F — Auditability

Filtered output must not break audit trails. Every filtered command in an auditable workflow should record:

- command run;
- exit code;
- whether output was filtered;
- raw output path when available;
- summary returned to the model;
- whether raw output was inspected before making a load-bearing claim.

## 5. Provisional conclusion

RTK is worth evaluating, especially for verbose shell-command output. It is **not yet appropriate to include as a default v0.2 component**.

The strongest near-term use is manual/explicit:

```text
When RTK is installed and the task is output-heavy, the agent may use explicit `rtk ...` commands after confirming that filtered output will be enough, and must inspect raw output before relying on omitted details.
```

The weakest near-term use is transparent Codex rewriting. Codex hooks do not currently document supported input rewriting, and RTK's own Codex integration appears instruction-based rather than hook-based. The package should not pretend otherwise.

## 6. v0.2 implications

v0.2 should include:

- a generic `OutputFilterProvider` seam;
- this RTK evaluation document;
- optional evaluation-only checks if easy to implement;
- no RTK installation;
- no active RTK hook;
- no RTK permission/profile default;
- no claim that RTK is recommended for Codex until gates pass.

Possible v0.2 CLI shape, if implemented as evaluation-only:

```bash
codex-uplift-init output-filter inspect
codex-uplift-init output-filter evaluate rtk --no-install
codex-uplift-init output-filter report
```

These commands must not install or enable RTK. They should only detect an already-installed binary, run controlled local comparisons, and write a report.

## 7. v0.3+ possibilities

If the evaluation passes, v0.3 could add an optional integration:

```bash
codex-uplift-init output-filter candidate rtk --mode explicit
```

Potential modes:

| Mode | Status | Notes |
|---|---|---|
| `explicit` | plausible | Encourage explicit `rtk` command prefixes in skills/workflows. |
| `instructional` | plausible | Add RTK usage guidance to project/user docs when installed. |
| `deny-suggest` | risky | Hook blocks raw verbose commands and asks agent to rerun with RTK. Needs loop controls. |
| `transparent-rewrite` | not currently supported | Do not claim until Codex supports input rewriting or another safe mechanism exists. |
| `mcp-wrapper` | future | Could return compact summaries and raw-output resources. |
| `path-wrapper` | discouraged | Too implicit and semantically risky for a setup assistant default. |

## 8. Non-foreclosure constraints

To keep RTK or a better future alternative possible, v0.2 should:

- keep a generic output-filter seam rather than hard-coding RTK;
- store filtered-output metadata in command/probe artifacts;
- keep raw-output path fields in verification logs;
- avoid designing context strategy around either always-raw or always-filtered output;
- avoid making hook-based rewrite the only integration path;
- keep command policy and output filtering separate;
- preserve room for an MCP/tool-wrapper architecture;
- avoid adding global shell wrappers or aliases that would be hard to undo.

## 9. Rejection triggers

RTK should be rejected or parked if evaluation shows:

- filtered output repeatedly hides failure causes;
- raw output cannot be recovered reliably;
- exit codes are not preserved;
- use in Codex depends only on fragile instructions that agents ignore;
- telemetry/local tracking cannot be made acceptable;
- tee logs create unacceptable secret-retention risk;
- explicit RTK commands add more friction than they save;
- Codex hooks cannot support the desired adoption mode without loops or false confidence.

## 10. Acceptance trigger for optional integration

Move RTK to optional integration only when:

1. at least one Codex client has a validated, reversible usage mode;
2. local evals show material token savings without loss of load-bearing detail;
3. raw-output recovery is reliable;
4. safety/privacy concerns are documented and manageable;
5. the integration can be disabled cleanly;
6. the package can mark filtered output explicitly in artifacts.

## 11. Source anchors to re-check during implementation

Re-check these at implementation time because both RTK and Codex are moving targets:

- RTK README: `https://github.com/rtk-ai/rtk` and `https://raw.githubusercontent.com/rtk-ai/rtk/master/README.md`
- RTK architecture/security/telemetry docs in the same repository.
- Codex hooks docs: `https://developers.openai.com/codex/hooks`
- Codex rules docs: `https://developers.openai.com/codex/rules`
- Codex config reference and advanced config docs: `https://developers.openai.com/codex/config-reference`, `https://developers.openai.com/codex/config-advanced`

Do not rely on stale local notes for a load-bearing platform claim. If a later Codex release supports safe command input rewriting, that may change the RTK feasibility assessment; until then, keep RTK evaluation-only.

## 12. Verification note added after source re-check

After re-checking current public sources, the evaluation-only posture still holds:

- RTK's GitHub README describes an auto-rewrite hook as the most effective use mode and says the hook transparently intercepts Bash commands for some supported tools, but the same support table lists Codex as `AGENTS.md + RTK.md instructions`, not a Codex-native transparent rewrite hook.
- The README also describes `tee` behavior that saves full unfiltered output on failure, which is promising for auditability but creates privacy/secret-retention questions that must be evaluated locally.
- Codex hook docs currently say `PreToolUse` can block Bash/file-edit/MCP calls, but input rewriting fields such as `updatedInput` are parsed and not supported yet; therefore RTK-style transparent rewrite should not be claimed for Codex without new evidence.
- Codex hook docs also say `PermissionRequest` only runs when Codex is about to ask for approval, so it cannot be a broad output-filter adoption mechanism.

This means v0.2 should preserve the generic `OutputFilterProvider` seam and the RTK eval protocol, but should not install RTK, enable RTK, or recommend RTK by default.
