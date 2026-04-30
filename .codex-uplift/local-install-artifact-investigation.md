# Published alpha local install artifact investigation

Date: 2026-04-30
Package tested: `codex-uplift-kit@0.2.0-alpha.0`
Scope: temp-home install only. No live `~/.codex` or `~/.agents` paths were modified.

## Purpose

Check what the published alpha actually materializes when installed locally, and identify artifact gaps before v0.3 planning.

## Commands

Published package fetch/install:

```bash
npm_config_cache=/private/tmp/codex-uplift-live-install.F3V95d/npm-cache \
  npx --yes --package codex-uplift-kit@alpha codex-uplift-init install \
  --mode plugin \
  --home /private/tmp/codex-uplift-live-install.F3V95d/codex-home \
  --user-home /private/tmp/codex-uplift-live-install.F3V95d/user-home
```

Default personal-home plugin layout:

```bash
/private/tmp/codex-uplift-live-install.F3V95d/npm-cache/_npx/245877c7913a3eaa/node_modules/.bin/codex-uplift-init install \
  --mode plugin \
  --user-home /private/tmp/codex-uplift-default-install.wCjawG/user-home
```

Follow-up inspection commands:

```bash
codex-uplift-init inspect --home <temp-user-home>/.codex --user-home <temp-user-home>
codex-uplift-init status --home <temp-codex-home> --user-home <temp-user-home>
codex-uplift-init uninstall --dry-run --home <temp-codex-home> --user-home <temp-user-home>
codex-uplift-init config candidate --profile safe-interactive --home <temp-user-home>/.codex --user-home <temp-user-home>
codex-uplift-init compact candidate --home <temp-user-home>/.codex --user-home <temp-user-home>
```

Hook samples were probed directly with Node using representative JSON input.

## Observed artifacts

Plugin-mode install materialized:

- home working agreement: `AGENTS.md`
- custom agents: `artifact-reviewer.toml`, `artifact-writer.toml`, `evidence-explorer.toml`
- inactive config fragment: `config.fragment.codex-uplift-kit.toml`
- inactive hook sample layer: `hooks.json.sample`
- hook scripts: `pretool-protect-git.mjs`, `stop-audit-shape.mjs`
- inactive rules candidate: `rules.codex-uplift-kit.candidate.md`
- local plugin payload under `.codex/plugins/codex-uplift-kit`
- marketplace metadata under `.agents/plugins/marketplace.json`
- install manifest under `.codex/codex-uplift-kit/manifest.json`

Plugin mode did not install standalone `user-home/.agents/skills`, which matches the intended duplicate-skill avoidance behavior.

## Verification results

- `inspect` correctly reported present Codex home, missing standalone user skills, present plugins root, present manifest, available safe install modes, and unknown effective config.
- `status` classified all manifest entries as present.
- `uninstall --dry-run` listed every manifest-owned file for removal without mutating the temp install.
- `config candidate --profile safe-interactive` wrote a profile-scoped candidate and did not modify active config.
- `compact candidate` wrote all six prompt candidates plus an inactive config fragment and did not create or modify active `config.toml`.
- `pretool-protect-git.mjs` emitted a valid deny shape for `git reset --hard HEAD`.
- `pretool-protect-git.mjs` exited quietly for `git status --short`.
- `stop-audit-shape.mjs` returned `{"continue":true}` for empty input.

## Marketplace path behavior

Two path layouts were checked:

- When `--home` was outside `--user-home`, marketplace metadata used an absolute `source.path` and emitted the expected unknown/fallback note.
- When only `--user-home` was supplied, default Codex home resolved to `<user-home>/.codex` and marketplace metadata used `./.codex/plugins/codex-uplift-kit`.

The normal personal-home temp layout therefore matches the intended marketplace template. The external Codex-home case remains an empirical Codex-client compatibility question for v0.3.

## Findings

1. The installed plugin metadata still reports `"version": "0.1.0"` while the npm package, install manifest, and release state are `0.2.0-alpha.0`. This is confusing for plugin discovery/debugging and should be fixed in the next patch or v0.3 slice.
2. `README.md` still contains stale pre-release wording that says the recommended prerelease is `0.2.0-alpha.0` but `package.json` remains `0.1.0`. The published package now has `package.json` version `0.2.0-alpha.0`, so README should be updated.
3. Repeated `npx --package codex-uplift-kit@alpha codex-uplift-init ...` invocations hung in this local environment after the first install. Running the cached package binary directly completed immediately. This looks like npm exec/cache behavior rather than a CLI bug, but it is worth noting for docs and smoke-test ergonomics.
4. The rules candidate is extremely sparse. It is safe because it is inactive, but it may not provide enough practical guidance for users evaluating rules in v0.3.

## Recommendations

- Fix plugin metadata versioning so the plugin artifact and package version cannot drift.
- Refresh README release wording now that `0.2.0-alpha.0` is shipped.
- Add a v0.3 work item for direct plugin-client discovery testing after a real Codex restart.
- Consider documenting an `npm exec`/`npx` fallback: if repeated `npx` invocations hang, install once or run the resolved binary during local smoke work.
- Expand rule candidates in v0.3 only after current Codex rule behavior is verified against official docs or local probes.

## Follow-up patch status

The next local patch after this investigation changed the installer so compaction prompt assets install under `~/.codex/compaction-prompts/` instead of `compact.candidate/`, includes those assets in normal classic/plugin/hybrid installs, updates the inactive config fragment path, aligns plugin metadata version with `package.json`, and refreshes stale README release wording. Active `config.toml` mutation remains intentionally unimplemented.
