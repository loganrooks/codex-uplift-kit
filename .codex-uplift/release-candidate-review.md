---
artifact_id: codex-uplift-v0.2-release-candidate-review
artifact_type: release-checkpoint
status: shipped
summary: Closed release checkpoint for the shipped v0.2 setup/posture assistant alpha.
---

# Release Candidate Review

Date: 2026-04-30

## Released Version

Released alpha version: `0.2.0-alpha.0`.

Release commit/tag target: `82eacb30e26a9db42fff3ca39fbb10173fdc4a92`.

GitHub Release: <https://github.com/loganrooks/codex-uplift-kit/releases/tag/v0.2.0-alpha.0>.

npm package: `codex-uplift-kit@0.2.0-alpha.0`.

npm dist-tags observed after publish:

- `alpha: 0.2.0-alpha.0`
- `latest: 0.2.0-alpha.0`

`latest` points to the alpha because no stable release exists yet. Trusted
publishing is configured for future GitHub Release-triggered publishes, but it
was not exercised for this already-published manual alpha.

## Working Tree State

The release was shipped from commit `82eacb3` and tag
`v0.2.0-alpha.0`, both resolving to
`82eacb30e26a9db42fff3ca39fbb10173fdc4a92`. `main` was clean and synced with
`origin/main` before closeout documentation began.

## Files Changed

- `bin/codex-uplift-init.mjs`
- `package.json`
- `README.md`
- `REVIEW.md`
- `templates/config/config.fragment.toml`
- `templates/hooks/hooks.json.sample`
- `templates/plugin-marketplace/marketplace.json`
- `test/installer-safety.test.mjs`
- `.codex-uplift/change-log.md`
- `.codex-uplift/test-log.md`
- `.codex-uplift/release-candidate-review.md`
- `.codex-uplift/v0.3-handoff.md`
- `.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_STATE.md`
- `.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP.md`
- `.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md`

## Features Implemented

- v0.2 CLI command seams:
  - `inspect`
  - `install --mode classic|plugin|hybrid|minimal`
  - `status`
  - `uninstall --manifest <path>`
  - `config doctor`
  - `config candidate --profile <profile>`
  - `project inspect`
  - `project candidate`
  - `rules candidate`
  - `hooks candidate`
  - `compact candidate`
  - `rtk evaluate --plan-only`
  - `verify`
- Install modes and component selection.
- Plugin mode skips standalone skills by default.
- Hybrid mode explicitly installs both standalone and plugin skills and reports duplicate skill names.
- Legacy/component selections that install both standalone and plugin skills also
  report duplicate skill names.
- Personal plugin marketplace path defaults to `./.codex/plugins/codex-uplift-kit` under user-home marketplace-root semantics.
- Custom Codex home outside user home uses an explicit absolute-path fallback with warning.
- Manifest writes with package-owned file hashes.
- Manifest merges preserve previous entries across narrower later installs.
- `status` reports present/missing/modified/candidate entries.
- `uninstall` removes only unmodified manifest-owned files.
- Config candidate generation for posture profiles.
- Config doctor reports observed/inferred/proposed/unknown categories.
- Candidate-only project/hooks/rules/compact/RTK command seams.
- Junk-file skipping for installed template copies.
- Safety-critical `node:test` suite.
- README/template/review wording updated for current Codex hooks/config/plugin posture.

## Candidate-Only Surfaces

- Active user config merge.
- Active hooks.
- Active rules.
- Full-access posture application.
- Project config application.
- Compaction prompt application.
- RTK installation or integration.

## Explicit Deferrals

- D-001 dynamic mid-session posture switching.
- D-002 exact effective config resolution.
- D-006 full plugin publishing/marketplace lifecycle.
- D-008 advanced config merge engine.
- D-009 project maturity classifier.
- D-015 automatic compaction prompt switching.
- D-018 RTK evaluation as token-efficiency subject.
- D-019 RTK integration after evaluation.
- D-020 automatic posture routing.

## Tests Run

- PASS `npm view codex-uplift-kit@0.2.0-alpha.0 version` —
  `0.2.0-alpha.0`.
- PASS `npm dist-tag ls codex-uplift-kit` — `alpha` and `latest` both point to
  `0.2.0-alpha.0`.
- PASS `npx --yes --package codex-uplift-kit@alpha codex-uplift-init --help`.
- PASS published-package temp-home `inspect`.
- PASS published-package temp-home `install --dry-run`.
- PASS published-package temp-home `install --mode plugin`.
- PASS published-package temp-home `config candidate --profile safe-interactive`.
- PASS published-package temp-home `compact candidate`.
- PASS published-package temp-home `status`.
- PASS published-package temp-home `uninstall --dry-run`.
- PASS `npm test` — 23 tests.
- PASS `npm run smoke`.
- PASS `node bin/codex-uplift-init.mjs --help`.
- PASS `node bin/codex-uplift-init.mjs verify`.
- PASS `npm run verify`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm pack --dry-run`.
- PASS `npm run pack:dry-run`.
- PASS `npm run release:check`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm publish --dry-run`.
- PASS `git diff --check`.
- PASS temp-home `inspect`.
- PASS temp-home `install --dry-run`.
- PASS temp-home `install --mode plugin`.
- PASS temp-home `config candidate --profile safe-interactive`.
- PASS temp-home `compact candidate`.
- PASS temp-home no active `config.toml` after compact candidate.
- PASS manifest `status`.
- PASS manifest `uninstall --dry-run`.
- PASS release workflow YAML parse/inspection for `.github/workflows/publish-npm.yml`.

## Tests Not Run

- No live Codex app/CLI plugin reload test was run.
- No real user-home install was run.
- No live hooks/rules enablement was run.
- No RTK install/evaluation was run.
- No cross-platform Windows/Linux matrix was run.
- No live GitHub Release-triggered publish workflow was run for
  `0.2.0-alpha.0` because that version was already manually published.
- Trusted publishing has been configured, but remains unexercised until a
  future release.

## Package Contents Summary

`npm run pack:dry-run` reported 34 files, package size about 26.5 kB, unpacked size about 94.3 kB after closeout docs. Contents include bin, templates, compaction prompt templates, README, RELEASE, CHANGELOG, SECURITY, LICENSE, and orchestrator prompts. `.DS_Store`, `.planning`, `.codex-uplift`, recovery-package files, archives, and temp files were not included in the tarball.

## Install And Uninstall Verification

- Fresh classic install covered by tests.
- Fresh plugin install covered by tests.
- Existing-file candidate behavior covered by tests.
- Force backup behavior covered by tests.
- Plugin marketplace path resolution covered by tests.
- Duplicate skill behavior covered by tests.
- Manifest status covered by tests.
- Dry-run and real uninstall safety covered by tests.
- Modified files are preserved by uninstall.

## Manual Live-Client Checklist

- Optional: install into a temporary or explicitly approved real user home, then
  restart Codex and confirm local plugin mode appears.
- Manually review generated config/profile candidates before merging anything
  into active `config.toml`.
- Keep real user-home install optional and explicitly user-approved.

## Known Risks

- `latest` points to `0.2.0-alpha.0` because npm assigns `latest` when there is
  no stable version yet; this is acceptable for the first alpha but should be
  revisited before any broader stable messaging.
- GitHub CI passed on `main`; the release-triggered npm publish workflow has
  not yet been exercised.
- npm trusted publishing workflow has been added and npm-side trusted publisher
  setup is configured, but it will first run on a future published GitHub
  Release.
- Candidate-only project/rules/hooks commands are minimal seam implementations;
  `compact candidate` now generates reviewable prompt candidates and an inactive
  config fragment.
- Custom Codex home outside user-home marketplace root uses an absolute local `source.path` fallback. This is explicit and warned, but should be probed in the live Codex client before documenting as fully portable.
- Exact effective config behavior across app/CLI/IDE/managed layers remains deferred.
- Profile candidates now use profile-scoped TOML and current documented network/reviewer keys, but local Codex runtime validation of every candidate key remains a v0.3 probe.

## Manual Gates Still Closed

Do not run another version bump, npm publish, git tag, remote push, GitHub
release creation, real user-home install, active hook/rule enablement,
full-access profile activation, telemetry enablement, RTK activation, or v0.3
implementation without explicit user approval.

## Release Recommendation

Status: shipped alpha closed.

Recommendation: `shipped-alpha`.

Rationale: late orchestration recovery found and fixed material config/posture
candidate mismatches. v0.2 shipped with the setup-assistant baseline, safety
tests, profile-candidate content tests, manifest/status/uninstall, corrected
plugin/duplicate behavior, release quality gates, trusted-publisher workflow
preparation, reconciled orchestration provenance, a prerelease GitHub Release,
and a published npm alpha. Keep alpha posture until live Codex plugin
install/restart checks and future trusted-publishing release automation are
exercised.
