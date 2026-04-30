# codex-uplift-kit Project Instructions

This file is the project-specific layer for developing `codex-uplift-kit`.
The portable working agreement belongs in the home Codex `AGENTS.md`; this file
adds repository facts, product direction, and local verification expectations.

## Project Aim

`codex-uplift-kit` is evolving from a conservative bootstrap bundle into a
Codex setup and posture assistant. It should help users install and maintain
auditable Codex assets without silently taking over their local setup.

The package should support:

- user-level working agreements;
- reusable skills;
- custom agent templates;
- optional hook samples;
- optional plugin packaging;
- config/profile candidates;
- project-level onboarding candidates;
- inspection, doctor, status, upgrade, and uninstall flows.

This is not an official OpenAI package. Verify platform behavior against
official Codex docs or local probes before encoding it in docs or code.

## Product Direction

v0.1 is the baseline bootstrap bundle. v0.2 should become the first credible
setup-assistant release:

- inspect existing `~/.codex` and `~/.agents` state before proposing writes;
- generate candidates rather than silently mutating active config;
- support component selection and install modes: classic, plugin, hybrid, and
  minimal;
- make plugin mode skip standalone skills by default;
- detect duplicate skill names before creating ambiguous installs;
- generate and verify plugin marketplace metadata from the chosen install
  location;
- provide config/profile candidates for review-only, safe-interactive,
  autonomous-audited, trusted-power, full-access-reviewed, external-isolated,
  and CI use cases;
- pair higher autonomy with explicit recovery, audit, and rollback controls;
- support project-level `AGENTS.md`, `.codex/config.toml`, rules, and hook
  candidates derived from repo evidence.

## Safety Invariants

- Do not write to a real user `~/.codex` or `~/.agents` path during tests unless
  the user explicitly requests that exact operation.
- Use temp `--home` and `--user-home` directories for installer verification.
- Preserve the installer safety contract: existing files produce
  `.candidate.<timestamp>` outputs by default; `--force` creates backups before
  overwriting.
- Do not silently enable hooks, rules, plugins, network access, full access, or
  `approval_policy = "never"`.
- Do not present `danger-full-access` plus `auto_review` as sandboxed safety.
- Treat hooks as Codex lifecycle guardrails with documented limitations, not as
  a complete security boundary.
- Treat project `.codex/` config as trust-gated; surface that boundary in docs
  and generated candidates.

## Platform Claims

Use official OpenAI Codex docs as the source of truth for:

- `AGENTS.md` discovery and precedence;
- config precedence, profiles, project trust, and managed config;
- sandbox, approval, reviewer, rules, and permission behavior;
- hooks, hook event shapes, and hook loading;
- skills and duplicate skill behavior;
- plugin marketplace path semantics;
- custom agent schema and subagent availability.

If docs do not settle behavior, label it as an empirical unknown and add a
non-destructive probe instead of asserting it from memory.

## Repository Surfaces

- `bin/codex-uplift-init.mjs` is the installer CLI.
- `templates/home/AGENTS.md` is the portable home working agreement.
- `templates/skills/` contains standalone skill installs.
- `templates/plugin/skills/` mirrors plugin-packaged skills.
- `templates/agents/` contains custom agent templates.
- `templates/hooks/` contains inactive hook samples.
- `.planning/README.md` is the read-first planning control plane.
- `.planning/current/` contains current state, vision, roadmap, active work, and
  release boundaries.
- `.planning/governance/` contains workflow and artifact authority rules.
- `.planning/initiatives/codex-uplift-current-design-suite/` contains the v0.2
  design suite and review responses. Treat it as historical evidence unless a
  current doc promotes a specific item.

Keep the home template portable. Put repo-specific commands, failure modes, and
implementation constraints in this project file or planning artifacts.

## Implementation Rules

- Use `apply_patch` for manual file edits.
- Prefer Node standard-library code unless a dependency clearly earns its cost.
- Keep installer behavior deterministic and testable with temp directories.
- Keep file writes candidate-first unless the user explicitly asks for active
  installation.
- Do not refactor unrelated templates while fixing installer logic.
- Avoid copying system junk such as `.DS_Store`, `Thumbs.db`, or editor swap
  files into installed templates.
- When adding installer behavior, add focused `node:test` coverage.

## Verification

Run these light checks after packaging or installer-adjacent changes:

```bash
npm run smoke
npm pack --dry-run
```

For installer behavior changes, add or update tests and run:

```bash
npm test
```

If `npm test` does not exist yet, either add it with the tests or explicitly
state that the test suite is not present.

## Planning And Artifacts

- Read `~/.gsd/knowledge/index.md` before starting substantive work.
- For substantive project work, read `.planning/README.md`, then
  `.planning/current/STATE.md`, `.planning/current/ACTIVE_WORK.md`, and
  `.planning/governance/README.md`.
- Preserve design decisions and review responses under `.planning/`.
- Separate implementation defects, setup-assistant requirements,
  platform-modeling corrections, and empirical unknowns.
- Treat `.planning/work/_scratch/` as temporary continuity material, not current
  authority.
- For substantial changes, record verification and boundaries in the relevant
  planning artifact or commit message.

## Git Workflow

- Work on `main` unless the user asks for a branch.
- Keep commits atomic and scoped to one coherent change.
- Check `git status --short` before and after edits.
- Never revert user changes unless explicitly asked.
- Use concise commit messages; include body notes for substantive changes when
  they clarify why, verification, or boundaries.
