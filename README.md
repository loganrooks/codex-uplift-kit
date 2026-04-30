# codex-uplift-kit

`codex-uplift-kit` is a non-destructive Codex setup and posture assistant. It
helps inspect an existing local Codex setup, install reusable assets, generate
reviewable candidates, and keep release/audit decisions explicit.

This is not an official OpenAI package. Verify platform-sensitive behavior
against official Codex documentation or local probes before relying on it for
policy enforcement.

## Alpha Status

The repository contains a v0.2 alpha release-candidate implementation. The
recommended prerelease version is `0.2.0-alpha.0`, but `package.json` remains
`0.1.0` until the manual version-bump gate is approved.

Local alpha gates currently expected:

- `npm test`
- `npm run smoke`
- `npm run verify`
- `npm run pack:dry-run`
- `git diff --check`
- manual package contents review
- manual generated-candidate review
- manual decision before publish, tag, push, GitHub release, real user-home
  mutation, active hook/rule enablement, full-access profile activation,
  telemetry, RTK activation, or v0.3 implementation

GitHub Actions runs the automated gate subset on pushes and pull requests to
`main` across Node 18, 20, and 22.

## Implemented Command Surface

```text
codex-uplift-init [install] [options]
codex-uplift-init inspect [options]
codex-uplift-init status [--manifest <path>]
codex-uplift-init uninstall --manifest <path> [--dry-run]
codex-uplift-init config doctor [options]
codex-uplift-init config candidate --profile <profile> [options]
codex-uplift-init project inspect
codex-uplift-init project candidate
codex-uplift-init rules candidate
codex-uplift-init hooks candidate
codex-uplift-init compact candidate
codex-uplift-init rtk evaluate --plan-only
codex-uplift-init verify
```

Install modes:

- `classic` installs standalone home assets by default.
- `plugin` installs plugin assets and skips standalone skills by default.
- `hybrid` installs both plugin and standalone skills and reports duplicate
  skill names.
- `minimal` starts from the smallest manifest-oriented set.

Explicit component selections that combine `skills` and `plugin` also report
duplicate skill names.

Component IDs:

```text
home-agents, skills, agents, config-candidates, hook-samples, rule-samples,
plugin, project-skeleton, compaction-prompts, manifest
```

Config profile candidates:

```text
review-only, safe-interactive, autonomous-audited, install-window,
net-limited, full-access-reviewed, external-isolated, ci-noninteractive
```

## What It Installs Or Proposes

Depending on mode and component selection, the installer writes or proposes:

- `~/.codex/AGENTS.md` user-level working agreements;
- reusable skills under `~/.agents/skills/`;
- custom agent templates under `~/.codex/agents/`;
- inactive hook samples and hook config candidates;
- rules candidates;
- config/profile candidate TOML;
- plugin package files and marketplace metadata;
- project onboarding candidates;
- compaction prompt candidates;
- a manifest of package-owned files for `status` and safe `uninstall`.

Existing files are not overwritten by default. When a target exists, the
installer writes a `.candidate.<timestamp>` file beside it. `--force` creates a
backup before overwriting.

## Local Use Without Publishing

```bash
npm test
npm run smoke
npm run verify
npm run pack:dry-run

node bin/codex-uplift-init.mjs --dry-run
node bin/codex-uplift-init.mjs inspect
node bin/codex-uplift-init.mjs install --mode plugin --dry-run
node bin/codex-uplift-init.mjs config candidate --profile safe-interactive
```

Use temporary homes for installer verification:

```bash
node bin/codex-uplift-init.mjs install --dry-run \
  --home /tmp/codex-uplift-kit-home \
  --user-home /tmp/codex-uplift-kit-user-home
```

## Use As A Local npm Package

```bash
npm pack
npm install -g ./codex-uplift-kit-<version>.tgz
codex-uplift-init inspect
codex-uplift-init install --dry-run
```

Replace `<version>` with the tarball version printed by `npm pack`.

## Safety Notes

- Keep generated config, rules, hooks, compaction prompts, and project files as
  candidates until reviewed.
- Do not treat hooks or rules as complete security boundaries.
- `danger-full-access` means unsandboxed local operation.
- `approvals_reviewer = "auto_review"` adds a review gate to approval requests;
  it does not recreate filesystem or network sandboxing.
- `danger-full-access` plus `auto_review` is reviewed unsandboxed operation,
  not sandboxed safety.
- `approval_policy = "never"` belongs only in carefully isolated automation
  where interactive approval is impossible and other controls are in place.
- Project `.codex/` config is trust-gated by Codex. Treat generated project
  config as repository policy candidates, not automatic active policy.

Official Codex references: [configuration basics](https://developers.openai.com/codex/config-basic),
[advanced configuration](https://developers.openai.com/codex/config-advanced),
[configuration reference](https://developers.openai.com/codex/config-reference),
and [hooks](https://developers.openai.com/codex/hooks).

## Known Alpha Boundaries

- No live Codex app/CLI plugin restart/install probe has been run in this
  release-candidate pass.
- No real user-home install has been run as part of automated verification.
- Active hooks, rules, full-access profiles, telemetry, and RTK integration are
  not enabled by default.
- Candidate-only project/rules/hooks/RTK commands are intentionally minimal
  seams for alpha validation; `compact candidate` generates reviewable prompt
  candidates and an inactive config fragment.

## Suggested First Prompt After Install

```text
Use $codex-project-agents-init on this repository. First create an onboarding observations artifact from actual files and commands. Then draft AGENTS.md as a proposal. Do not overwrite an existing AGENTS.md without showing the diff and asking for approval.
```
