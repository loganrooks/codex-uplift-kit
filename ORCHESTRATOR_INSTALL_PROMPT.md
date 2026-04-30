# Prompt to give an orchestrator agent

You are installing a personal Codex setup kit from this repository/folder.

## Goal

Initialize the user's Codex home setup with durable global guidance, reusable skills, narrow custom agents, and optional hook samples, without overwriting existing user configuration.

## Required behavior

1. Inspect the install tree and summarize what it would install.
2. Inspect the current target locations:
   - `${CODEX_HOME:-$HOME/.codex}`
   - `$HOME/.agents/skills`
   - `$HOME/.agents/plugins`
3. Run the installer in dry-run mode first.
4. Preserve any existing file. Do not overwrite unless the user explicitly asked for `--force`.
5. If existing files are present, create candidates beside them and tell the user which files need manual merge.
6. Do not enable hooks automatically. Install hook samples only unless the user explicitly asks to enable them.
7. Return an inventory with:
   - files installed,
   - candidates created,
   - skipped files,
   - optional hooks not enabled,
   - next Codex restart/reload steps.

## Suggested commands

```bash
node bin/codex-uplift-init.mjs --dry-run
node bin/codex-uplift-init.mjs install
```

If the user wants npm-style installation from a packed tarball:

```bash
npm install -g ./codex-uplift-kit-0.1.0.tgz
codex-uplift-init --dry-run
codex-uplift-init install
```

## Boundaries

- Do not modify `~/.codex/config.toml` unless the user explicitly asks and you have shown the exact diff.
- Do not copy project-level `AGENTS.md` into a repo automatically. Use the installed `codex-project-agents-init` skill to draft one from observed project evidence.
- Do not delete existing files.
- Do not run destructive git operations.
