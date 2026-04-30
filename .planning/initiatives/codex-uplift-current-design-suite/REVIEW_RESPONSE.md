# REVIEW_RESPONSE.md

Date: 2026-04-30
Subject: Response to `codex-uplift-kit` package review

## Executive response

The review is high-signal and mostly directionally correct. I accept the central product critique: if `codex-uplift-kit` is meant to become a credible public or team-distributable Codex onboarding package, it needs to become more than a conservative file copier. The next version should add configuration inspection, candidate generation, explicit install modes, plugin path validation, duplicate-skill handling, and installer tests.

I would not frame every finding as a defect in the original v0.1 scaffold, however. The original package was intentionally conservative: it installed durable user-level instructions, skills, custom-agent templates, and hook samples without mutating active Codex configuration. That caution was correct for a first pass that writes into `~/.codex` and `~/.agents`. The review is best interpreted as a roadmap for graduating the kit from a personal scaffold into a real setup assistant.

There is one important correction to preserve: the hook samples are Codex-native. The earlier critique that they looked like Claude Code hooks was not sound once checked against the official Codex hooks documentation. The final review mostly retracts that point, but some residual wording still says "experimental hooks." Current Codex docs describe lifecycle hooks as an extensibility framework behind a feature flag and list `features.codex_hooks` as a stable feature in config basics. The correct caution is not "unsupported" or "Claude-like"; it is that hooks are supported guardrails with documented limitations and are not a complete security boundary.

## Source posture

This response treats the attached review as a package/design review, not as authoritative doctrine. Its recommendations are evaluated against:

- the current package implementation in `codex-uplift-kit-0.1.0.tgz`;
- official Codex docs for config, hooks, skills, plugins, subagents, and `AGENTS.md` loading;
- the attached production-level `AGENTS.md` examples from Codex/Rust and Apache Airflow as precedents, not authorities.

Those production examples reinforce the original architectural split: global user setup should stay portable and posture-oriented, while project-level `AGENTS.md` files should carry exact commands, repository boundaries, known failure modes, and mature workflow constraints.

## Disposition summary

| Review point | Disposition | Response |
|---|---:|---|
| Conservative install model | Accept | Preserve candidate-file behavior as a core invariant. |
| Separation of global/project guidance | Accept | This is one of the package's strongest design choices. |
| Artifact-centered design | Accept | Keep and strengthen; this is the distinctive value of the kit. |
| Hooks optional by default | Accept | Keep hooks sample-only unless explicitly enabled by the user. |
| Config setup too minimal | Accept with context | True for a publishable setup assistant; acceptable for v0.1 scaffold. Add doctor/candidate commands. |
| Permission presets needed | Partially accept | Add non-destructive candidates, but avoid making dangerous modes first-class presets. |
| Existing install inventory/merge plan | Accept | Add `inspect`/`doctor` output before install. |
| Plugin marketplace path | Accept, with implementation nuance | Current path is likely wrong. Prefer documented relative path semantics over absolute paths. |
| Duplicate skills in plugin mode | Accept | Define classic/plugin/hybrid modes explicitly. |
| Smoke test too shallow | Accept | Add `node:test` coverage for safety-critical behavior. |
| `.DS_Store` copied | Accept | Ignore system junk or use an allowlist. |
| Hook boundary docs | Accept with wording correction | Document limitations, but do not call Codex hooks unsupported or Claude-derived. |
| Roadmap | Mostly accept | Reorder some items and distinguish v0.1 personal scaffold from public package readiness. |

## Point-by-point response

### 1. Conservative installation model

**Review claim:** Existing files are not overwritten unless `--force` is used. When a target exists, the installer writes a `.candidate.<timestamp>` file beside it. This is the correct default.

**Disposition:** Accepted.

This is a core invariant and should remain. Writing into `~/.codex` and `~/.agents` is sensitive because those locations may contain personal defaults, organization-managed policy, local hooks, custom agents, installed skills, plugin catalogs, and work-in-progress configuration. The candidate-file behavior is not just convenient; it is the package's basic safety contract.

**Action:** Preserve the behavior and add tests that prove:

- existing files are not overwritten by default;
- candidates are written with deterministic naming shape;
- `--force` writes a backup before overwriting;
- dry-run performs no writes.

### 2. Separation between global and project guidance

**Review claim:** The README and skills correctly avoid installing a universal project `AGENTS.md`; the project initializer skill asks the agent to inspect real repo evidence first.

**Disposition:** Accepted.

This is the right architecture. Codex loads global guidance from the Codex home directory and project guidance from the repository path, with closer project instructions appearing later in the instruction chain. Therefore, user-level `AGENTS.md` should establish portable operating posture, while project-level files should carry concrete commands, repo structure, architecture boundaries, and project-specific failure modes.

The attached Codex/Rust and Airflow examples demonstrate why this distinction matters. The Codex/Rust example includes exact crate conventions, Rust style rules, forbidden sandbox-env edits, dependency-lock workflows, snapshot-test requirements, module-size pressure around `codex-core`, and concrete commands. The Airflow example includes exact environment setup, command routing through Breeze/uv, architecture boundaries, security-model distinctions, Git remote conventions, PR workflow, and AI attribution rules. Those are excellent project-level precedents precisely because they are specific. They should not be copied into a home-level file as universal doctrine.

**Action:** Keep project initialization as a skill-driven workflow that produces:

1. a repo onboarding observations artifact;
2. a draft project `AGENTS.md`;
3. an unsupported-claim review;
4. a proposed write-set and verification plan.

### 3. Artifact-centered agent design

**Review claim:** The package pushes Codex toward durable plans, rationales, verification logs, handoffs, and delegated outputs.

**Disposition:** Accepted.

This is the package's most important non-obvious value. Many `AGENTS.md` examples tell agents what commands to run, but fewer address the agentic-workflow failure mode where decisions, assumptions, delegated findings, and verification state live only in chat. The package should make artifact-centered work its differentiator.

**Action:** Strengthen the artifact skills rather than moving all artifact doctrine into the always-loaded home `AGENTS.md`. The home file should require durable artifacts for substantive work; skills should implement reusable artifact workflows with progressive disclosure.

### 4. Hooks optional by default

**Review claim:** Installing `hooks.json.sample` without enabling hooks or editing `config.toml` is a good boundary.

**Disposition:** Accepted.

The package should continue to install hook samples without activating them. Hook activation changes runtime behavior, may interact with existing hooks, and can create confusing multi-hook behavior because matching hooks from multiple files all run. Enabling hooks should be an explicit user action or a generated candidate, not an installer side effect.

**Action:** Keep:

```text
~/.codex/hooks.json.sample
~/.codex/hooks/*.mjs
```

Do not install an active `~/.codex/hooks.json` unless the user passes an explicit flag such as `--enable-hooks-candidate` or manually promotes the sample.

### 5. Config setup is too minimal

**Review claim:** `templates/config/config.fragment.toml` only sets `[agents] max_threads` and `max_depth`, which is too shallow for a package whose goal is to uplift Codex.

**Disposition:** Accepted with context.

The critique is correct if the target is a polished onboarding package. It is less damning for the initial v0.1 scaffold, where the design intent was to avoid mutating active configuration and focus first on instructions, skills, custom agents, and sample hooks.

That said, the review identifies a real gap. Codex configuration is part of the harness. Approval policy, sandbox mode, network access, login-shell behavior, feature flags, hooks, project trust, skills, plugins, MCP, profiles, and managed constraints materially affect how the same `AGENTS.md` instructions will execute.

**Accepted next step:** Add a config onboarding subsystem, but make it read-first and candidate-based:

```text
codex-uplift-init inspect
codex-uplift-init config doctor
codex-uplift-init config candidate --preset safe-interactive
```

`config doctor` should report what it can observe, including:

- Codex home path and whether `CODEX_HOME` is active;
- presence of `AGENTS.md` and `AGENTS.override.md`;
- presence of `config.toml`;
- top-level `approval_policy`;
- top-level `sandbox_mode`;
- `sandbox_workspace_write.network_access`;
- `allow_login_shell`;
- `[features].codex_hooks` if explicitly set;
- `[features].multi_agent` if explicitly set;
- `[agents]` settings;
- configured profiles;
- project trust entries;
- existing hooks sources;
- existing custom agents;
- existing user skills;
- existing plugin marketplace;
- possible managed/system config files when visible.

**Boundary:** The tool should not claim it can compute the full effective configuration unless it actually implements Codex's precedence model. Safer wording: "observed local configuration," "candidate merge plan," and "possible conflicts." Managed constraints may not be visible or parseable from user space, so the doctor should report "not inspected" rather than guessing.

### 6. Permission presets

**Review claim:** The package should provide opinionated but non-destructive permission presets such as `safe-interactive`, `trusted-power`, `review-only`, `ci-noninteractive`, and `isolated-full`.

**Disposition:** Partially accepted.

I accept the principle: a setup kit should help users reason about approval and sandbox posture. I do not accept making every suggested mode a first-class preset with equal product weight. Some modes are safe defaults; others are exceptional escape hatches.

**Recommended preset taxonomy:**

```text
safe-interactive       recommended default candidate
review-only            read-only candidate for audit/review sessions
ci-noninteractive      explicit automation candidate with warnings
```

I would not expose `isolated-full` as a normal preset. `danger-full-access` can be documented as an exceptional mode for already-isolated environments, but making it a named preset risks normalizing it. Likewise, `trusted-power` should either be omitted initially or expressed as a candidate diff that changes only one explicit setting at a time, such as network access, with a warning.

**Suggested candidate:**

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

# Hook samples are not active unless installed as hooks.json or inline [hooks].
# Check your current Codex version and config before setting this explicitly.
# [features]
# codex_hooks = true
```

**Nuance on hooks feature flag:** Current Codex docs show hooks behind a feature flag, but also list `features.codex_hooks` as stable and default-on in config basics. The package should not blindly tell users that setting `codex_hooks = true` is required. It should say: check whether the feature is enabled, and remember that `hooks.json.sample` is not active until promoted to `hooks.json` or merged into config.

### 7. Existing install inventory and merge plan

**Review claim:** Existing installs need a richer inventory and merge strategy.

**Disposition:** Accepted.

The current installer protects existing files but does not help the user understand the active setup. That means it can be safe but still opaque. A real setup assistant should report collisions, duplicates, inactive samples, and likely merge points before writing.

**Action:** Add an `inspect` mode that produces structured output like:

```text
Codex home: /Users/alice/.codex
User home: /Users/alice

Existing Codex home:
- AGENTS.md: exists; installer would write AGENTS.md.candidate.<stamp>
- AGENTS.override.md: absent
- config.toml: exists; observed keys: approval_policy, sandbox_mode, features.codex_hooks, agents.max_threads
- hooks.json: exists; merge required; matching hooks may all run
- hooks/: exists; 2 scripts
- agents/: 2 existing custom agents; 3 proposed by kit; 1 name collision
- plugins/: codex-uplift-kit absent

Existing user skills:
- ~/.agents/skills/codex-project-agents-init: exists; candidate required
- ~/.agents/skills/codex-audit-artifacts: absent

Recommended action:
- run install without --force
- review candidate files
- do not enable hooks until hooks.json is merged intentionally
- choose classic OR plugin install mode to avoid duplicate skills
```

This should be available without writing files:

```bash
codex-uplift-init inspect
codex-uplift-init install --dry-run
```

### 8. Plugin marketplace path

**Review claim:** The marketplace entry may point to the wrong location because the installer copies the plugin to `<codexHome>/plugins/codex-uplift-kit` but writes a personal marketplace entry at `<userHome>/.agents/plugins/marketplace.json` with `"path": "./plugins/codex-uplift-kit"`.

**Disposition:** Accepted, with implementation nuance.

The current path is likely wrong or at least insufficiently verified. Official Codex plugin docs say personal marketplaces live at `~/.agents/plugins/marketplace.json`, personal plugins are commonly stored under `~/.codex/plugins/`, and `source.path` should be relative to the marketplace root, not relative to the `.agents/plugins/` folder. They also state that a common personal pattern is:

```json
"path": "./.codex/plugins/<plugin-name>"
```

Therefore, for the current install layout, the candidate marketplace entry should probably be:

```json
"path": "./.codex/plugins/codex-uplift-kit"
```

rather than:

```json
"path": "./plugins/codex-uplift-kit"
```

I would not choose an absolute path as the first fix unless Codex docs explicitly endorse that for local marketplace entries. The docs emphasize relative paths beginning with `./` and staying inside the marketplace root. The safer fix is to generate the documented relative path and test it.

**Action:**

- Generate marketplace metadata dynamically rather than copying a static JSON template.
- Verify the generated `source.path` resolves to the copied plugin directory under the documented marketplace-root semantics.
- Add a test that fails if the marketplace path does not resolve to the installed plugin.
- Consider using `codex plugin marketplace add ./local-marketplace-root` instructions for manual setup rather than pretending a copied JSON file is enough for every environment.

### 9. Plugin install mode can duplicate skill names

**Review claim:** `--install-plugin` currently also installs standalone skills, so the same skill names can appear under `~/.agents/skills` and inside the plugin.

**Disposition:** Accepted.

This is a real product-contract problem. Codex docs state that if two skills share the same `name`, Codex does not merge them and both can appear in selectors. The package should not create that ambiguity by default.

**Action:** Define explicit install modes:

```text
classic       install ~/.codex/AGENTS.md, ~/.agents/skills, ~/.codex/agents, hook samples
plugin        install ~/.codex/AGENTS.md, ~/.codex/agents, hook samples, plugin + marketplace candidate; skip standalone skills
hybrid        install both standalone skills and plugin skills, but only with explicit --mode hybrid and a duplicate-skill warning
```

Default should remain `classic` until plugin distribution is validated. If `--install-plugin` is retained as a flag, it should imply `--skip-skills` unless the user also passes an explicit `--also-install-standalone-skills` or `--mode hybrid`.

### 10. Smoke test does not assert safety-critical behavior

**Review claim:** The current `smoke` script only proves the CLI starts and can dry-run.

**Disposition:** Accepted.

A package that writes into user configuration must test its safety behavior. The current smoke test is too shallow for public distribution.

**Action:** Add `node:test` coverage for:

- fresh install into temp `--home` and `--user-home`;
- existing files create `.candidate.*` files and leave originals unchanged;
- `--force` creates `.backup.*` before overwrite;
- dry-run writes nothing;
- JSON templates parse;
- hook scripts emit documented output shapes;
- executable scripts retain executable mode after install;
- plugin install creates a valid plugin tree;
- plugin marketplace entry resolves to the copied plugin directory;
- duplicate-skill mode warns or skips as specified;
- system junk files are ignored;
- unknown CLI options fail with a non-zero exit code.

Suggested package scripts:

```json
{
  "scripts": {
    "test": "node --test test/*.test.mjs",
    "smoke": "node bin/codex-uplift-init.mjs --dry-run --home /tmp/codex-uplift-kit-smoke-home"
  }
}
```

### 11. Local plugin install copies `.DS_Store`

**Review claim:** `copyDirFiles` copies every regular file, including `.DS_Store`.

**Disposition:** Accepted.

This is a straightforward packaging hygiene issue.

**Action:** Add an ignore predicate or allowlist. Prefer allowlisting for templates that become user configuration.

Minimum ignore list:

```text
.DS_Store
Thumbs.db
desktop.ini
*.swp
*.swo
__MACOSX
```

Better: define allowed template roots and file extensions explicitly where possible.

### 12. Hook documentation and boundary

**Review claim:** Hooks are valid Codex hooks, but documentation should clarify that they are guardrails, not a complete enforcement boundary. The review suggests saying: "Hooks are experimental Codex guardrails."

**Disposition:** Accepted on the boundary, rejected on the blanket "experimental" wording.

The important correction is that the hook samples are Codex-native. The official hooks docs support:

- `hooks.json` and inline `[hooks]` config;
- `PreToolUse`;
- `PermissionRequest`;
- `PostToolUse`;
- `UserPromptSubmit`;
- `Stop`;
- `hookSpecificOutput.permissionDecision = "deny"` for `PreToolUse`;
- `decision: "block"` for `Stop` continuation behavior.

So the README should not imply that hooks are speculative, Claude-derived, or unsupported.

The official limitation is more precise: `PreToolUse` can intercept Bash, file edits through `apply_patch`, and MCP tool calls, but it is a guardrail rather than a complete enforcement boundary because equivalent work may happen through another supported tool path. `PostToolUse` also has incomplete interception for shell paths and cannot undo side effects that already happened. Multiple matching hooks from multiple files can all run.

**Recommended README wording:**

```text
Hooks are Codex lifecycle guardrails. They can reduce risk and improve audit shape, but they are not a complete security boundary. Keep sandbox and approval settings conservative even when hooks are enabled. The sample hooks are installed as inactive samples; promote them to hooks.json or inline [hooks] only after inspecting them and checking existing hooks.
```

**PermissionRequest sample:** Partially accept. A `PermissionRequest` sample is useful, but it should not be treated as a replacement for `PreToolUse`. They serve different points in the lifecycle:

- `PreToolUse` can block some commands before execution.
- `PermissionRequest` only runs when Codex is about to ask for approval, so it is aligned with approval-policy decisions but does not cover commands that do not need approval.

The package can include both samples, with clear docs about when each fires.

### 13. Recommended roadmap

**Review claim:** Highest priorities are config doctor/candidate, install modes, tests, hook docs, and packaging hygiene.

**Disposition:** Mostly accepted.

I would reorder the roadmap into two tracks: immediate correctness and product maturity.

#### Immediate correctness fixes

1. Fix plugin marketplace path generation.
2. Prevent plugin mode from installing duplicate standalone skills by default.
3. Add tests for candidate/backup behavior.
4. Add junk-file ignore or allowlist.
5. Update hook docs to use precise Codex-native wording.

#### Product maturity work

1. Add `inspect` and `config doctor`.
2. Add config candidate generation with safe presets.
3. Add install modes: `classic`, `plugin`, `hybrid`.
4. Add richer merge guidance for existing installs.
5. Add package docs for personal vs team usage.

This distinction matters because plugin path and duplicate-skill behavior can mislead users immediately, while config doctor is a broader product enhancement.

### 14. Suggested config candidate template

**Review claim:** Generate a candidate config rather than auto-merging; include `approval_policy`, `sandbox_mode`, `allow_login_shell`, `network_access`, `[agents]`, commented hooks feature, and optional profiles.

**Disposition:** Accepted with edits.

The template is directionally right. I would adjust it as follows:

```toml
# codex-uplift-kit candidate config.
# Review and merge manually into ~/.codex/config.toml.
# Do not apply blindly on managed machines or shared workstations.

approval_policy = "on-request"
sandbox_mode = "workspace-write"
allow_login_shell = false

[sandbox_workspace_write]
network_access = false

[agents]
max_threads = 6
max_depth = 1

# Hook samples are inactive until copied/merged as ~/.codex/hooks.json or inline [hooks].
# Current Codex releases may already enable codex_hooks by default; inspect before setting.
# [features]
# codex_hooks = true

[profiles.review-only]
sandbox_mode = "read-only"
approval_policy = "on-request"
model_reasoning_effort = "high"

# Use only in isolated automation where no approval prompts can be handled.
# Confirm sandboxing, network access, and write roots before use.
[profiles.ci-noninteractive]
approval_policy = "never"
sandbox_mode = "workspace-write"

[profiles.ci-noninteractive.sandbox_workspace_write]
network_access = false
```

I would omit any default `danger-full-access` profile. If documented at all, it belongs in a warning section, not in generated config.

## Meta-commentary on the review

### The review is best read as a maturity review, not a rejection

The review's final verdict says the kit is "well aimed and thoughtfully conservative." That is the right framing. The package already has a coherent thesis: turn agent behavior into inspectable, durable, user-owned configuration and artifacts. The review's main demand is to make that thesis operationally complete.

For a personal scaffold, the current package is useful. For an npm-distributed public package, it needs stronger install modes, diagnostics, tests, and plugin correctness. Those are different readiness bars.

### The review implicitly upgrades the product goal

The initial package was a bootstrap bundle. The review evaluates it as a setup assistant. That is a productive upgrade, but it should be named. A setup assistant has responsibilities a scaffold does not:

- inspect current state;
- identify collisions;
- explain merge choices;
- generate candidates;
- validate install surfaces;
- test safety behavior;
- avoid ambiguous plugin/skill duplication;
- account for managed configuration.

I accept that upgrade as the right direction, but it means the next version should have an explicit product contract rather than just more templates.

### Some hook skepticism was a harness-modeling error

The user noted that an earlier critique treated the hook approach as if it were not properly supported or as if it resembled Claude Code more than Codex. That critique was wrong once the official Codex hooks docs were checked. The final review retracts the direct version of that critique, but the phrase "experimental hooks" can still carry residue from the same mistake.

The corrected position is:

- Codex hooks are a documented Codex feature.
- The sample hook shapes are broadly aligned with current Codex hook docs.
- Hooks are still not a security boundary.
- Hook behavior has lifecycle-specific limitations.
- Hook activation must remain explicit and non-destructive.

This distinction matters because "unsupported" would argue against shipping hook samples at all, while "supported guardrail with limitations" argues for shipping samples with careful documentation.

### Official docs should arbitrate platform claims, but not product design

For platform facts, official Codex docs should win over intuition. That includes `AGENTS.md` discovery, skill locations, plugin marketplace semantics, subagent availability, custom-agent schema, hook events, and config precedence.

For product design, official docs are not enough. The package's distinctive product value comes from the user's higher-level goals: auditability, evidence discipline, bounded delegation, durable artifacts, and cross-project Codex workflow hygiene. Those are not reducible to any one Codex doc page.

### Production `AGENTS.md` examples support specificity, not cargo-culting

The attached Codex/Rust and Airflow examples should be inherited critically. They do not prove that a home-level `AGENTS.md` should be huge. They prove that mature project-level `AGENTS.md` files become valuable when they encode concrete commands, boundaries, known failure modes, and lifecycle-specific workflow rules.

The package should therefore keep doing two things at once:

1. install a compact user-level posture file;
2. provide a skill that helps derive project-level guidance from actual repo evidence.

### The package should avoid false enforcement claims

A recurring theme is the difference between guidance, guardrails, and enforcement:

- `AGENTS.md` is guidance and context.
- Skills are reusable workflow instructions.
- Custom agents are specialized spawned-session configurations.
- Hooks are deterministic lifecycle guardrails.
- Config controls sandbox and approval posture.
- Tests and CI are executable verification.

A credible uplift kit should not imply that any one layer solves everything. It should compose these layers and label the boundary of each.

## Revised next-version contract

For `codex-uplift-kit` v0.2, I would define the contract as:

```text
codex-uplift-kit helps a user install and maintain a conservative, auditable Codex setup.
It never overwrites active user configuration by default.
It distinguishes always-on posture from reusable workflows.
It can inspect the current setup, write candidates, and explain merge choices.
It installs hook samples but does not activate them automatically.
It supports either standalone-skill or plugin distribution without accidental duplication.
It tests safety-critical installer behavior.
```

## Concrete v0.2 implementation checklist

### CLI

- [ ] Add `inspect` command.
- [ ] Add `config doctor` command.
- [ ] Add `config candidate --preset safe-interactive` command.
- [ ] Add `--mode classic|plugin|hybrid`.
- [ ] Make plugin mode skip standalone skills by default.
- [ ] Add explicit duplicate-skill detection.
- [ ] Generate marketplace metadata dynamically.
- [ ] Fix personal marketplace `source.path` to documented relative semantics.
- [ ] Add system junk ignore or template allowlist.

### Tests

- [ ] Add `node:test` suite.
- [ ] Test dry-run writes nothing.
- [ ] Test fresh install.
- [ ] Test candidate-on-existing-file behavior.
- [ ] Test backup-on-force behavior.
- [ ] Test plugin path resolution.
- [ ] Test duplicate-skill mode behavior.
- [ ] Test hook output shapes.
- [ ] Test JSON templates parse.
- [ ] Test executable modes.
- [ ] Test ignored junk files.

### Docs

- [ ] Add install mode table.
- [ ] Add config doctor/candidate docs.
- [ ] Add hook boundary section with Codex-native wording.
- [ ] Add plugin-vs-standalone skill guidance.
- [ ] Add managed-config caveat.
- [ ] Add production examples section explaining critical inheritance rather than copying.

### Templates

- [ ] Expand `config.fragment.toml` into a candidate template.
- [ ] Add optional `review-only` profile.
- [ ] Add optional `ci-noninteractive` profile with warnings.
- [ ] Do not add a generated `danger-full-access` profile.
- [ ] Add a `PermissionRequest` hook sample only if documented with lifecycle boundaries.

## Final position

The review should be accepted as a strong roadmap with two corrections:

1. Do not overstate the hook concern. The hooks are Codex-supported lifecycle guardrails, not Claude Code artifacts and not unsupported experiments. The limitation is their boundary, not their legitimacy.
2. Do not treat minimal config mutation as a mistake in the v0.1 scaffold. It was a defensible safety posture. The next version should add config inspection and candidate generation, not silent config mutation.

With those corrections, the review is a useful guide for moving `codex-uplift-kit` from "useful personal scaffold" to "credible Codex onboarding kit."

## References checked

Official Codex docs consulted while preparing this response:

- [Codex config basics](https://developers.openai.com/codex/config-basic)
- [Codex advanced configuration](https://developers.openai.com/codex/config-advanced)
- [Codex configuration reference](https://developers.openai.com/codex/config-reference)
- [Codex hooks](https://developers.openai.com/codex/hooks)
- [Codex skills](https://developers.openai.com/codex/skills)
- [Codex subagents](https://developers.openai.com/codex/subagents)
- [Codex plugin builder docs](https://developers.openai.com/codex/plugins/build)
- [Codex custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

Attached examples considered:

- `codex-uplift-kit Review` supplied by the reviewing agent.
- Codex/Rust project-level `AGENTS.md` example.
- Apache Airflow project-level `AGENTS.md` example.
