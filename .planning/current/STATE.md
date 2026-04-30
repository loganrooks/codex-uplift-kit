# Current State

Status: current
Last updated: 2026-04-30

## Repository State

`codex-uplift-kit` is a public alpha npm package and a dogfooding ground for the
project-uplift system it is becoming.

The current shipped release is `0.2.0-alpha.0`.

Verified release facts:

- npm package: `codex-uplift-kit@0.2.0-alpha.0`
- GitHub Release: `v0.2.0-alpha.0`
- release commit/tag target:
  `82eacb30e26a9db42fff3ca39fbb10173fdc4a92`
- npm dist-tags observed after release: `alpha` and `latest` both pointed to
  `0.2.0-alpha.0` because no stable release exists yet
- trusted publishing is configured for future releases but was not exercised for
  `0.2.0-alpha.0`

## Product State

The package has moved beyond a bootstrap bundle. It is currently best described
as a Codex setup and posture assistant:

- installs a portable home `AGENTS.md` template;
- installs standalone or plugin-packaged skills;
- installs custom agent templates;
- installs inactive hook samples;
- installs compaction prompt files;
- writes inactive config/profile candidates;
- supports `classic`, `plugin`, `hybrid`, and `minimal` install modes;
- supports inspect, verify, status, uninstall, config candidate, compact
  candidate, and project candidate surfaces;
- preserves existing files by default and writes candidates/backups where
  appropriate.

Active `config.toml` mutation is not implemented. The package may install prompt
files and inactive config fragments, but selecting a compaction prompt or
merging config still requires explicit user action.

## Known Gaps

- Live Codex plugin discovery after restart has not been verified.
- Active config merge is intentionally deferred.
- Rules support remains under-modeled and should be verified against current
  Codex docs or local probes before productizing.
- The repo still has several historical planning surfaces; current docs now
  route future work, but broad archive cleanup is still deferred.
- Pack architecture, role contracts, and project complexity detection are
  design work for v0.3 and later, not implemented product behavior.

## Current Evidence Sources

- `.codex-uplift/v0.2-release-feedback.md`
- `.codex-uplift/local-install-artifact-investigation.md`
- `.codex-uplift/v0.3-handoff.md`
- `.planning/initiatives/codex-uplift-current-design-suite/`
- `.planning/work/_scratch/` until mined and removed
