---
artifact_id: codex-uplift-v0.2-release-candidate-review
artifact_type: release-checkpoint
status: draft
summary: Manual release checkpoint for the v0.2 setup/posture assistant baseline.
---

# Release Candidate Review

Date: 2026-04-30

## Proposed Version

Recommended alpha release version after manual approval: `0.2.0-alpha.0`.

Current `package.json` version: `0.1.0`.

Version bump is intentionally not performed here because `npm version <version>` is a manual release-gate step.

## Working Tree State

Working tree contains the v0.2 release-candidate implementation and release artifacts. Commit hash before final implementation commit: `3c5fd69`.

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
- No live GitHub Release-triggered publish workflow was run.
- No npm trusted publisher was configured yet; first manual npm publish is still
  required before trusted publishing can be enabled.

## Package Contents Summary

`npm run pack:dry-run` reported 34 files, package size about 26.5 kB, unpacked size about 94.1 kB. Contents include bin, templates, compaction prompt templates, README, RELEASE, CHANGELOG, SECURITY, LICENSE, and orchestrator prompts. `.DS_Store`, `.planning`, `.codex-uplift`, recovery-package files, archives, and temp files were not included in the tarball.

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

- Package version remains `0.1.0` until the manual release version bump.
- Public CI/release gate files were added for alpha hardening; CI execution on GitHub has not yet run in this local pass.
- npm trusted publishing workflow has been added, but it cannot be exercised
  until after first manual npm publish and npm-side trusted publisher setup.
- Candidate-only project/rules/hooks commands are minimal seam implementations;
  `compact candidate` now generates reviewable prompt candidates and an inactive
  config fragment.
- Custom Codex home outside user-home marketplace root uses an absolute local `source.path` fallback. This is explicit and warned, but should be probed in the live Codex client before documenting as fully portable.
- Exact effective config behavior across app/CLI/IDE/managed layers remains deferred.
- Profile candidates now use profile-scoped TOML and current documented network/reviewer keys, but local Codex runtime validation of every candidate key remains a v0.3 probe.

## Manual Gates Still Closed

Do not run the version bump to `0.2.0-alpha.0`, npm publish, npm trusted
publisher activation, git tag, remote push, GitHub release creation, real
user-home install, active hook/rule enablement, full-access profile activation,
telemetry enablement, RTK activation, or v0.3 implementation without explicit
user approval.

## Release Recommendation

Status: release candidate acceptable after patches.

Recommendation: `ship-alpha`.

Rationale: late orchestration recovery found and fixed material config/posture candidate mismatches. v0.2 now has the setup-assistant baseline, safety tests, profile-candidate content tests, manifest/status/uninstall, corrected plugin/duplicate behavior, release quality gates, trusted-publisher workflow preparation, and reconciled orchestration provenance. Keep alpha posture until a live Codex plugin install/restart check, GitHub CI observation, npm trusted publisher setup, and manual package version bump are approved.
