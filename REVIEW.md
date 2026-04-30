# codex-uplift-kit Review

Date: 2026-04-30

Amendment: later Worker C docs updates keep this as a review artifact but supersede stale wording that described Codex hooks as experimental-only, required users to enable `features.codex_hooks` in all cases, or preferred absolute plugin marketplace paths before verifying current plugin path semantics. Treat those points below as historical review notes unless repeated in the amendment sections.

## Scope

This review covers the current `codex-uplift-kit` package as an npm-distributable setup kit for improving local Codex usage through:

- user-level `AGENTS.md` working agreements;
- reusable skills for project onboarding, audit artifacts, delegation contracts, and retrospective updates;
- custom subagent role templates;
- optional Codex hook samples;
- optional plugin skeleton and marketplace metadata;
- installer behavior for existing user configuration.

There is no Git repository metadata in this folder, so this is a package/design review rather than a staged-diff review.

## Sources Checked

Local package files:

- `README.md`
- `package.json`
- `bin/codex-uplift-init.mjs`
- `templates/home/AGENTS.md`
- `templates/config/config.fragment.toml`
- `templates/hooks/*`
- `templates/skills/*/SKILL.md`
- `templates/agents/*.toml`
- `templates/plugin/**`
- `templates/plugin-marketplace/marketplace.json`

Official Codex docs:

- [Config basics](https://developers.openai.com/codex/config-basic)
- [Advanced configuration](https://developers.openai.com/codex/config-advanced)
- [Configuration reference](https://developers.openai.com/codex/config-reference)
- [Hooks](https://developers.openai.com/codex/hooks)

Verification commands run:

```bash
npm run smoke
npm pack --dry-run
node -e "const fs=require('fs'); for (const f of ['templates/hooks/hooks.json.sample','templates/plugin/.codex-plugin/plugin.json','templates/plugin-marketplace/marketplace.json','package.json']) { JSON.parse(fs.readFileSync(f,'utf8')); console.log('json ok', f); }"
node bin/codex-uplift-init.mjs install --user-home "$tmp_user" --home "$tmp_codex" --install-plugin
```

## Overall Assessment

The package has a good core concept and a sane safety posture for a v0.1 setup kit. It understands the most important product constraint: writing into `~/.codex` and `~/.agents` is sensitive, so existing user configuration should be preserved by default. The candidate-file behavior is the strongest part of the design.

The installed guidance is also directionally strong. It pushes Codex toward evidence-backed project onboarding, bounded delegation, durable artifacts, and explicit verification. Those are exactly the right levers for improving agentic software work.

The main gaps are not in the basic installer mechanics. They are in the surrounding product contract:

- config setup is too shallow for a package whose goal is to uplift Codex;
- existing installs need a richer inventory/merge strategy;
- plugin install behavior may create duplicate skills or broken marketplace paths;
- the test suite does not yet assert the safety-critical installer behavior;
- hooks are valid Codex lifecycle guardrails, but the package should document their incomplete enforcement boundary.

## Strengths

### Conservative Installation Model

Existing files are not overwritten unless `--force` is used. When a target exists, the installer writes a `.candidate.<timestamp>` file beside it. This is the correct default for durable user configuration.

### Clear Separation Between Global and Project Guidance

The README and skills correctly avoid installing a universal project `AGENTS.md`. The `codex-project-agents-init` skill asks the agent to inspect real repository evidence, create an onboarding artifact, and draft project guidance as a proposal.

### Good Artifact-Centered Agent Design

The package emphasizes durable plans, rationales, verification logs, handoffs, and delegated outputs. This directly addresses common failure modes in agent workflows where key state disappears into chat.

### Hooks Are Optional By Default

The package installs `hooks.json.sample` and does not promote it to an active hook layer or edit `config.toml` automatically. That is a good boundary because sample hooks should be inspected before use.

## Findings

### [MEDIUM] Config Setup Is Too Minimal For The Package Goal

File: `templates/config/config.fragment.toml`

The config fragment only sets:

```toml
[agents]
max_threads = 6
max_depth = 1
```

That is safe, but incomplete. The official Codex config docs identify user config, project config, profiles, approval policies, sandbox settings, hooks, MCP, and managed constraints as important parts of the configuration model. A setup package aimed at making Codex safer and more effective should guide users through those choices instead of leaving them implicit.

Why it matters:

- users may keep risky local defaults without realizing it;
- hooks may be copied but not enabled;
- network, sandbox, and approval behavior may be misaligned with the intended workflow;
- existing enterprise or system-managed constraints may conflict with proposed settings;
- users with an existing `~/.codex/config.toml` do not get help understanding what should be merged.

Recommendation:

Add explicit config onboarding commands:

```text
codex-uplift-init config doctor
codex-uplift-init config candidate
codex-uplift-init config preset safe-interactive
```

`config doctor` should read current config and report the effective setup it can observe: `approval_policy`, `sandbox_mode`, `sandbox_workspace_write.network_access`, `allow_login_shell`, `[features].codex_hooks`, `[agents]`, profile usage, project trust entries, skill/plugin paths, and managed/system constraints if visible.

`config candidate` should write a timestamped candidate file, never overwrite `config.toml`, and explain conflicts in comments.

### [MEDIUM] Package Needs Opinionated But Non-Destructive Permission Presets

File: `templates/config/config.fragment.toml`

The package currently avoids permissions setup altogether. That caution is understandable, but it misses one of the best opportunities for an uplift kit: helping users choose a sane baseline.

Recommended presets:

```toml
# safe-interactive
approval_policy = "on-request"
sandbox_mode = "workspace-write"
allow_login_shell = false

[sandbox_workspace_write]
network_access = false
```

This should be presented as a recommended baseline, not forced.

Additional optional presets:

- `trusted-power`: still `workspace-write`, but may enable selected network access or granular approvals for trusted local development.
- `review-only`: `read-only` sandbox for code review sessions.
- `ci-noninteractive`: `approval_policy = "never"` only with explicit warnings and a tightly controlled sandbox.
- `isolated-full`: `danger-full-access` only for isolated environments where the user understands the risk.

The package should avoid silently switching users to `approval_policy = "never"` or `sandbox_mode = "danger-full-access"`.

### [MEDIUM] Existing Install Handling Needs An Inventory And Merge Plan

File: `bin/codex-uplift-init.mjs`

The installer preserves existing files, but it does not inspect or summarize existing setup state beyond candidate file creation.

Why it matters:

Users who already have Codex configured need to know whether the package is additive, duplicative, conflicting, or inert. For example:

- existing `~/.codex/AGENTS.md` may already contain overlapping global rules;
- existing `~/.codex/config.toml` may already set `[agents]`, `[features]`, profiles, sandboxing, or approval behavior;
- existing `~/.codex/hooks.json` may already define hooks, and the docs warn that multiple matching hooks can all run;
- existing skills with the same names may create ambiguity;
- plugin install mode may duplicate standalone skills.

Recommendation:

Add an `inspect` or `doctor` mode that produces a structured report:

```text
Existing Codex home:
- AGENTS.md: exists, candidate required
- config.toml: exists, contains [agents], [features], approval_policy
- hooks.json: exists, merge required
- agents/: 2 existing roles, 3 proposed roles
- skills/: 1 name collision
- plugins/: marketplace exists

Recommended action:
- write candidates only
- do not enable hooks automatically
- review duplicate skill names before plugin install
```

### [MEDIUM] Plugin Marketplace Path Is Not Verified Against Install Location

Amendment: do not treat “generate an absolute local path” as the preferred fix until current plugin marketplace path semantics are verified against official Codex docs or a non-destructive probe. The safer v0.2 requirement is to generate metadata from the actual chosen install location and verify that Codex resolves it to the copied plugin directory.

File: `bin/codex-uplift-init.mjs` lines 156-160  
Related file: `templates/plugin-marketplace/marketplace.json`

The installer copies the plugin to:

```text
<codexHome>/plugins/codex-uplift-kit
```

but writes marketplace metadata under:

```text
<userHome>/.agents/plugins/marketplace.json
```

with this relative path:

```json
"path": "./plugins/codex-uplift-kit"
```

Unless the plugin manager resolves that relative path from the Codex home, the marketplace entry may point at the wrong location.

Recommendation:

- generate marketplace metadata from the selected install location;
- verify the entry resolves to the copied plugin directory in temp homes;
- only switch to absolute paths if the current official plugin path semantics require it.

### [MEDIUM] Plugin Install Mode Can Duplicate Skill Names

File: `bin/codex-uplift-init.mjs` lines 142-160

With `--install-plugin`, the installer still installs standalone skills under:

```text
<userHome>/.agents/skills
```

and then installs the same skill names inside:

```text
<codexHome>/plugins/codex-uplift-kit/skills
```

Depending on Codex skill discovery precedence, this may create duplicate or ambiguous skill entries.

Recommendation:

Pick one of these product contracts:

- plugin install mode skips standalone skill install by default;
- plugin skills are namespaced differently;
- standalone and plugin installs are explicitly documented as mutually exclusive modes;
- the installer detects duplicate skill names and prints a warning with the expected precedence.

### [MEDIUM] Smoke Test Does Not Assert Safety-Critical Behavior

File: `package.json`

The `smoke` script currently runs a dry run:

```json
"smoke": "node bin/codex-uplift-init.mjs --dry-run --home /tmp/codex-uplift-kit-smoke-home"
```

This checks that the CLI starts, but it does not verify the behaviors that matter most.

Recommendation:

Add `node:test` coverage for:

- fresh install into temp `--home` and `--user-home`;
- existing file creates `.candidate.*` without overwriting;
- `--force` creates `.backup.*` before overwrite;
- `--install-plugin` creates a valid plugin tree;
- plugin marketplace path resolves to the installed plugin;
- JSON templates parse;
- hook scripts return documented output shapes;
- executable template files retain executable mode;
- `.DS_Store` and other system files are not copied.

### [LOW] Local Plugin Install Copies `.DS_Store`

File: `bin/codex-uplift-init.mjs` lines 124-132

`copyDirFiles` copies every regular file. In a temp install with `--install-plugin`, `.DS_Store` files were copied into the installed plugin tree.

Recommendation:

Ignore known system files during recursive copy, or use a template allowlist.

### [LOW] Hooks Are Valid, But Documentation Should Clarify Their Boundary

Amendment: the stale wording below says hooks are experimental and always require `[features] codex_hooks = true`. Current docs/template wording should avoid that blanket instruction. The retained finding is the boundary claim: hook samples are inactive until promoted, and hooks are guardrails rather than a complete security boundary.

Files:

- `templates/hooks/hooks.json.sample`
- `templates/hooks/pretool-protect-git.mjs`
- `templates/hooks/stop-audit-shape.mjs`
- `README.md`

The earlier concern that these hooks were not Codex-ready should be withdrawn. The current OpenAI docs and local templates should be checked for:

- Codex looks for `hooks.json` next to active config layers;
- `PreToolUse` supports the `hookSpecificOutput.permissionDecision = "deny"` shape used by `pretool-protect-git.mjs`;
- `Stop` can block/continue a turn.

The package should still document the key limitation: `PreToolUse` is a guardrail, not a complete enforcement boundary. It does not intercept every possible risk path, and multiple matching hooks can run.

Recommendation:

Update the README hook section to say:

```text
Hooks are Codex lifecycle guardrails. They can reduce risk, but they are not a complete security boundary. Keep sandbox and approval settings conservative even when hooks are enabled.
```

Also consider adding a `PermissionRequest` hook sample because that event is better aligned with approval policy control than trying to catch everything in `PreToolUse`.

## Recommended Roadmap

### 1. Add Config Doctor And Candidate Generation

This is the highest-leverage improvement. It turns the package from a file copier into a real Codex setup assistant.

Deliverables:

- `codex-uplift-init inspect`
- `codex-uplift-init config doctor`
- `codex-uplift-init config candidate --preset safe-interactive`
- docs explaining config precedence, trust boundaries, and managed config caveats.

### 2. Define Installation Modes

Clarify the package’s install modes:

- classic mode: standalone user skills in `~/.agents/skills`;
- plugin mode: plugin install only;
- hybrid mode: explicit, with duplicate warning.

The current implicit hybrid mode is the riskiest because it may surprise users.

### 3. Add Installer Tests

Use `node:test` and temp directories. The package has no runtime dependencies, so a small test suite would be cheap and valuable.

Suggested scripts:

```json
{
  "scripts": {
    "test": "node --test test/*.test.mjs",
    "smoke": "node bin/codex-uplift-init.mjs --dry-run --home /tmp/codex-uplift-kit-smoke-home"
  }
}
```

### 4. Harden Hook Documentation

Keep hooks optional and sample-only, but link directly to the official hooks docs and explain:

- whether the local Codex version requires any feature flag;
- where hooks load from;
- multiple hooks can run;
- `PreToolUse` is incomplete as an enforcement boundary;
- sandbox and approval policies remain the primary safety layer.

### 5. Clean Packaging Hygiene

Add a `.npmignore` or package allowlist improvements if needed, and prevent `.DS_Store` from being copied during local installs.

## Suggested Config Candidate Template

This should be generated as a candidate, not automatically merged:

```toml
# codex-uplift-kit candidate config.
# Review and merge manually into ~/.codex/config.toml.

approval_policy = "on-request"
sandbox_mode = "workspace-write"
allow_login_shell = false

[sandbox_workspace_write]
network_access = false

[agents]
max_threads = 6
max_depth = 1

# Hook samples are inactive until promoted or merged into an active hooks layer.
# Hooks are guardrails, not a complete security boundary.
# [features]
# codex_hooks = true
```

Optional review profile:

```toml
[profiles.review-only]
sandbox_mode = "read-only"
approval_policy = "on-request"
model_reasoning_effort = "high"
```

Optional non-interactive profile, with strong warning:

```toml
# Use only in isolated automation where no approval prompts can be handled.
[profiles.ci-noninteractive]
approval_policy = "never"
sandbox_mode = "workspace-write"

[profiles.ci-noninteractive.sandbox_workspace_write]
network_access = false
```

## Final Verdict

`codex-uplift-kit` is well aimed and thoughtfully conservative. Its strongest idea is not any individual template; it is the model of turning agent behavior into inspectable, durable, user-owned configuration and artifacts.

Before treating it as a polished npm package, I would prioritize:

1. config doctor/candidate workflow;
2. explicit permission presets;
3. plugin install path and duplicate-skill resolution;
4. real installer tests;
5. hook documentation that reflects sample promotion and guardrail boundaries.

After those changes, this would move from “useful personal scaffold” to “credible Codex onboarding kit.”
