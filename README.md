# codex-uplift-kit

Personal Codex setup kit for making agentic software work more auditable, delegated work more artifact-centered, and project onboarding more repeatable.

This is not an official OpenAI package. It is a scaffold you can inspect, adapt, and install locally.

## What it installs

By default, the installer writes or proposes:

- `~/.codex/AGENTS.md` — user-level working agreements.
- `~/.agents/skills/codex-project-agents-init/` — skill for turning an existing codebase or seed docs into project-level `AGENTS.md` files.
- `~/.agents/skills/codex-audit-artifacts/` — skill for plan/rationale/verification/handoff artifacts.
- `~/.agents/skills/codex-delegation-contract/` — skill for bounded subagent delegation with durable artifacts.
- `~/.agents/skills/codex-retrospective-update/` — skill for updating guidance after repeated failures.
- `~/.codex/agents/*.toml` — narrow custom agents for exploration, artifact writing, and review.
- `~/.codex/hooks.json.sample` and `~/.codex/hooks/*.mjs` — optional hooks. These are samples by default and are not enabled unless you copy/rename the sample and enable Codex hooks in config.

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
4. **Hooks** only for deterministic guardrails: blocking destructive shell patterns, adding session context, or stop-time checks. Keep hooks opt-in because hooks can alter runtime behavior and can be noisy if overused.

Project-level `AGENTS.md` files should still be generated per repository. Use the `codex-project-agents-init` skill to create an evidence-backed draft rather than copying a universal template into every repo.

## Suggested first prompt after install

```text
Use $codex-project-agents-init on this repository. First create an onboarding observations artifact from actual files and commands. Then draft AGENTS.md as a proposal. Do not overwrite an existing AGENTS.md without showing the diff and asking for approval.
```

## Safety notes

- Do not blindly overwrite an existing home `AGENTS.md`; merge it.
- Keep hooks disabled until you inspect them.
- Keep custom subagents narrow. Avoid recursive delegation unless you understand the token and conflict risks.
- Do not use this kit as a substitute for repo-specific verification commands, architecture docs, or team review.
