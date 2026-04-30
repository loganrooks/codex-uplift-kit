---
artifact_id: codex-uplift-v0.2-implementation-observations
artifact_type: observation
status: draft
summary: Current observed state of the codex-uplift-kit package before v0.2 implementation.
---

# Implementation Observations

Date: 2026-04-30

## Directly Observed Files And Commands

- `package.json` identifies the package as `codex-uplift-kit` version `0.1.0`, with bin `codex-uplift-init` mapped to `bin/codex-uplift-init.mjs`.
- `package.json` currently exposes `npm run smoke`, which runs `node bin/codex-uplift-init.mjs --dry-run --home /tmp/codex-uplift-kit-smoke-home`.
- `package.json` has no `npm test` script yet.
- `README.md` describes a conservative personal setup kit and documents only default install and plugin-lite behavior, not v0.2 setup-assistant commands.
- `bin/codex-uplift-init.mjs` is a single-file installer with option parsing, candidate-on-existing behavior, and optional plugin copying.
- Template surfaces currently include:
  - `templates/home/AGENTS.md`
  - `templates/config/config.fragment.toml`
  - `templates/skills/*/SKILL.md`
  - `templates/plugin/skills/*/SKILL.md`
  - `templates/agents/*.toml`
  - `templates/hooks/hooks.json.sample`
  - `templates/hooks/*.mjs`
  - `templates/plugin-marketplace/marketplace.json`
  - `templates/project/AGENTS.md.skeleton`

## Current CLI Entry Points

Observed v0.1 command shape:

```text
codex-uplift-init [install] [options]
```

Observed options:

- `--dry-run`
- `--force`
- `--home <path>`
- `--user-home <path>`
- `--skip-home-agents`
- `--skip-skills`
- `--skip-agents`
- `--skip-hooks`
- `--install-plugin`
- `--help`

Missing v0.2 command seams at observation time:

- `inspect`
- `status`
- `uninstall`
- `verify`
- `config doctor`
- `config candidate`
- `project inspect`
- `project candidate`
- `rules candidate`
- `hooks candidate`
- `compact candidate`
- `rtk evaluate --plan-only`

## Existing Tests And Smoke Checks

- `npm run smoke` exists and exercises installer dry-run behavior.
- No dedicated test suite is present yet.
- No observed tests yet cover:
  - existing-file candidate behavior;
  - `--force` backup behavior;
  - plugin marketplace path resolution;
  - plugin-mode duplicate skill behavior;
  - manifest/status/uninstall safety;
  - config candidate generation;
  - hook output shapes;
  - package hygiene.

## Current Install Behavior

Observed from `bin/codex-uplift-init.mjs`:

- Existing targets produce `.candidate.<timestamp>` files unless `--force` is used.
- `--force` creates timestamped backups before overwriting.
- `--home` controls Codex home; `--user-home` controls the OS home used for `.agents`.
- By default, installer writes home `AGENTS.md`, config fragment, standalone skills, custom agents, and hook samples.
- Hooks are installed as samples only; the installer does not edit active `config.toml`.
- `copyDirFiles` recursively copies regular files and currently has no junk-file ignore policy.

## Current Config, Hook, Plugin, And Skill Behavior

- Config support is currently a static `config.fragment.codex-uplift-kit.toml` copied into Codex home, not a profile-aware candidate generator.
- Hooks are sample scripts and a sample hooks JSON; they are not made active automatically. Current official docs treat `codex_hooks` as stable and default-on, so the active/inactive boundary is primarily whether a hook config is promoted or merged into an active config layer, plus whether a user has disabled `features.codex_hooks`.
- Plugin support is controlled by `--install-plugin`.
- `--install-plugin` currently still leaves standalone skill installation enabled by default, so plugin and standalone skill names can duplicate.
- `templates/plugin-marketplace/marketplace.json` currently uses `source.path = "./plugins/codex-uplift-kit"`.
- The installer copies the plugin to `<codexHome>/plugins/codex-uplift-kit` but writes marketplace metadata under `<userHome>/.agents/plugins/marketplace.json`.
- Official Codex plugin docs say personal marketplace `source.path` is resolved relative to the marketplace root, commonly `./.codex/plugins/<plugin-name>` for personal installs, and should start with `./` and stay inside that root.
- Official Codex skills docs indicate duplicate skill names are not merged; both can appear. The package should avoid creating duplicate names by default rather than relying on discovery precedence.

## Unsupported Or Unverified Assumptions

- Exact effective config resolution across CLI, app, IDE, trusted project config, managed config, and one-off overrides is not implemented and should remain labeled unknown or inferred.
- Plugin installation cache behavior should not be simulated as a direct load from the source path; official docs say Codex installs local plugins into a cache and loads that copy.
- Duplicate skill discovery precedence is not verified. v0.2 should avoid duplicates by default rather than depending on precedence.
- Profile support is documented as experimental and CLI-oriented; IDE support is not currently available per official docs.
- Hooks are documented Codex lifecycle guardrails, but `PreToolUse` is incomplete and not a complete enforcement boundary.
- Rules are documented as experimental and should be candidate/test surfaces by default.
- RTK integration remains evaluation-only and should not be installed or enabled in v0.2.

## Delegate Checks

- Package baseline explorer completed. It confirmed v0.1 package state, plugin marketplace path risk, duplicate skill risk, lack of tests, and local `.DS_Store` copy risk.
- Planning-slice explorer completed. It confirmed the smallest coherent v0.2 slice: implement inspect/config/status/install-mode/manifest basics now; keep project/policy/compaction/RTK candidate-only or deferred where appropriate.
- Docs-wording explorer completed. It confirmed stale hook wording in `README.md`, `REVIEW.md`, and `templates/config/config.fragment.toml`, plus the documented plugin marketplace path correction.
