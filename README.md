# codex-uplift-kit

Personal Codex setup kit for making agentic software work more auditable, delegated work more artifact-centered, and project onboarding more repeatable.

This is not an official OpenAI package. It is a scaffold you can inspect, adapt, and install locally.

## v0.2 direction

`codex-uplift-kit` is moving from a bootstrap bundle toward a Codex setup and posture assistant. The v0.2 CLI should inspect first, write candidates second, and leave active user configuration under user control.

The intended v0.2 shape is:

- inspect existing `~/.codex` and `~/.agents` assets before recommending changes;
- support explicit install modes: classic standalone skills, plugin, hybrid, and minimal;
- generate candidate config/profile fragments for review-only, safe-interactive, autonomous-audited, trusted-power, full-access-reviewed, external-isolated, and CI postures;
- keep higher-autonomy postures paired with recovery, audit, rollback, and status controls;
- maintain a manifest so status and uninstall flows can distinguish kit-managed files from user-owned files;
- surface project-level candidates for `AGENTS.md`, `.codex/config.toml`, rules, hooks, policy notes, compaction posture, RTK candidates, and eval-only checks without silently promoting them into active project policy.

Some of those commands are not present in the current v0.1-style CLI yet. Until the v0.2 implementation lands, treat those items as product direction and inspect generated files manually.

## What it installs

By default, the installer writes or proposes:

- `~/.codex/AGENTS.md` — user-level working agreements.
- `~/.agents/skills/codex-project-agents-init/` — skill for turning an existing codebase or seed docs into project-level `AGENTS.md` files.
- `~/.agents/skills/codex-audit-artifacts/` — skill for plan/rationale/verification/handoff artifacts.
- `~/.agents/skills/codex-delegation-contract/` — skill for bounded subagent delegation with durable artifacts.
- `~/.agents/skills/codex-retrospective-update/` — skill for updating guidance after repeated failures.
- `~/.codex/agents/*.toml` — narrow custom agents for exploration, artifact writing, and review.
- `~/.codex/hooks.json.sample` and `~/.codex/hooks/*.mjs` — optional hook samples. Samples are inactive until you promote or merge them into an active hooks layer such as `~/.codex/hooks.json` or trusted project `.codex` config.

The installer is intentionally conservative. Existing files are not overwritten unless `--force` is used. When a target file exists, the installer writes a `.candidate.<timestamp>` file beside it so you can diff and merge manually.

## Local use without publishing to npm

```bash
cd codex-uplift-kit
node bin/codex-uplift-init.mjs --dry-run
node bin/codex-uplift-init.mjs install
```

## Use as a local npm package

```bash
cd codex-uplift-kit
npm pack
npm install -g ./codex-uplift-kit-0.1.0.tgz
codex-uplift-init --dry-run
codex-uplift-init install
```

## Use after publishing or hosting

Once you publish this package or host it in a Git repository, the same CLI can be run with `npx` or installed globally. Example after npm publication:

```bash
npx codex-uplift-kit install --dry-run
npx codex-uplift-kit install
```

For private teams, a Git-backed package or internal registry is usually better than public npm.

## Recommended operational model

Use four layers:

1. **Home `~/.codex/AGENTS.md`** for personal defaults: epistemic discipline, auditability, delegation posture, worktree hygiene, and final-response expectations.
2. **User-level skills** for reusable workflows that should load only when needed: project initialization, audit artifacts, delegation contracts, retrospectives.
3. **Custom agents** for narrow subagent personas: explorer, artifact writer, reviewer.
4. **Hooks** only for deterministic lifecycle guardrails: blocking destructive shell patterns, adding session context, or stop-time checks. Hooks can reduce common mistakes, but they are not a complete security boundary and should not replace conservative sandbox and approval settings.

Project-level `AGENTS.md` files should still be generated per repository. Use the `codex-project-agents-init` skill to create an evidence-backed draft rather than copying a universal template into every repo.

Project `.codex/` config is trust-gated by Codex. Treat project-local config, rules, and hooks as repository policy candidates that need review before trust or promotion.

## Config and posture notes

The config fragment in this package is candidate-only guidance. Do not paste it blindly over an existing `~/.codex/config.toml`.

Profiles are a CLI-focused, experimental convenience for switching posture. A future v0.2 config candidate command should generate profiles as reviewable TOML candidates, not silently activate them.

Be precise about high-autonomy modes:

- `danger-full-access` means unsandboxed local operation.
- `approvals_reviewer = "auto_review"` adds a review gate to approval requests; it does not recreate filesystem or network sandboxing.
- `danger-full-access` plus `auto_review` is reviewed unsandboxed operation, not sandboxed safety.
- `approval_policy = "never"` belongs only in carefully isolated automation where interactive approval is impossible and other controls are already in place.

Official Codex references: [configuration basics](https://developers.openai.com/codex/config-basic), [advanced configuration](https://developers.openai.com/codex/config-advanced), [configuration reference](https://developers.openai.com/codex/config-reference), and [hooks](https://developers.openai.com/codex/hooks).

## Suggested first prompt after install

```text
Use $codex-project-agents-init on this repository. First create an onboarding observations artifact from actual files and commands. Then draft AGENTS.md as a proposal. Do not overwrite an existing AGENTS.md without showing the diff and asking for approval.
```

## Safety notes

- Do not blindly overwrite an existing home `AGENTS.md`; merge it.
- Keep hook samples inactive until you inspect the scripts and merge only the guardrails you want.
- Keep custom subagents narrow. Avoid recursive delegation unless you understand the token and conflict risks.
- Do not use this kit as a substitute for repo-specific verification commands, architecture docs, or team review.
