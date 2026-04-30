# Orchestrator setup fragment

Use this fragment in a setup-orchestrator `AGENTS.md` or task note.

## Codex user setup installation contract

When asked to initialize or update a user's Codex setup:

- Treat `~/.codex/AGENTS.md`, `~/.codex/config.toml`, `~/.codex/agents/`, `~/.codex/hooks*`, and `~/.agents/skills/` as durable user configuration.
- Inspect before writing.
- Run the setup kit in `--dry-run` mode first.
- Never overwrite existing user configuration without explicit approval.
- Prefer writing `.candidate.<timestamp>` files when a target exists.
- Install hooks as samples only unless the user explicitly asks to enable hooks.
- Return a final inventory of installed, skipped, candidate, and sample files.
- After installation, suggest restarting Codex if newly installed skills or custom agents are not visible.

## Project initialization contract

Do not install a universal project `AGENTS.md`. Instead, invoke the `codex-project-agents-init` skill in each repository. It must:

- inspect real repo files, commands, and docs;
- separate observed facts, inferences, and proposals;
- create an onboarding artifact;
- draft project-level `AGENTS.md` as a reviewable proposal;
- avoid overwriting an existing project `AGENTS.md` without diff and approval.
