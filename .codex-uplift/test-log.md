---
artifact_id: codex-uplift-v0.2-test-log
artifact_type: validation
status: active
summary: Test and verification log for v0.2 implementation.
---

# Test Log

Date: 2026-04-30

## Release-Candidate Verification Checklist

Planned release-candidate verification:

- `npm test`
- `npm run smoke`
- `npm run verify`
- `npm run pack:dry-run`
- `npm run release:check`
- `git diff --check`
- `npm pack --dry-run`
- `npm publish --dry-run`
- `node bin/codex-uplift-init.mjs --help`
- `node bin/codex-uplift-init.mjs verify`
- temp-home `inspect`
- temp-home `install --dry-run`
- temp-home `install --mode plugin`
- temp-home `config candidate --profile safe-interactive`
- temp-home `compact candidate`
- manifest `status`
- manifest `uninstall --dry-run`

## Results

2026-04-30 integration fix pass:

- PASS `npm test` — 14 tests passed.
- PASS `npm run smoke` — dry-run with temp `--home` and temp `--user-home`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm pack --dry-run`.

2026-04-30 orchestrator verification:

- PASS `npm test` — 14 tests passed.
- PASS `npm run smoke` — dry-run reports only temp home paths.
- PASS `node bin/codex-uplift-init.mjs --help`.
- PASS `node bin/codex-uplift-init.mjs verify`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm pack --dry-run`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm publish --dry-run`.
- PASS `git diff --check`.
- PASS temp-home `inspect`.
- PASS temp-home `install --dry-run`.
- PASS temp-home `install --mode plugin`.
- PASS temp-home `config candidate --profile safe-interactive`.
- PASS manifest `status`.
- PASS manifest `uninstall --dry-run`.

2026-04-30 late orchestration recovery hardening:

- PASS `npm test` — 16 tests passed, including generated-content posture candidate checks.
- PASS `npm run smoke` — dry-run reports only temp home paths.
- PASS `node bin/codex-uplift-init.mjs --help`.
- PASS `node bin/codex-uplift-init.mjs verify`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm pack --dry-run`.
- PASS `npm_config_cache=/private/tmp/codex-uplift-npm-cache npm publish --dry-run`.
- PASS `git diff --check`.
- PASS temp-home `inspect`.
- PASS temp-home `install --dry-run`.
- PASS temp-home `install --mode plugin`.
- PASS temp-home `config candidate --profile safe-interactive`.
- PASS manifest `status`.
- PASS manifest `uninstall --dry-run`.

2026-04-30 release quality gate hardening:

- Added `verify`, `pack:dry-run`, and `release:check` npm scripts.
- Added GitHub Actions CI gate for push/pull_request to `main` on Node 18, 20, and 22.
- CI gate runs `npm test`, `npm run smoke`, `npm run verify`, `npm run pack:dry-run`, and `git diff --check`.
- PASS `npm run release:check` — 16 tests, smoke, verify, pack dry run, and `git diff --check` passed.
- Recommended alpha release version documented as `0.2.0-alpha.0`; that
  version has now shipped.
- GitHub-hosted CI has not yet run in this local worker pass.

2026-04-30 release hardening final integration:

- Expanded `npm test` from 16 to 23 tests covering parser errors, component
  selection, config doctor, inactive candidate seams, compaction candidates,
  manifest hash shape, package allowlist, and template validity.
- Updated `pack:dry-run` to use `npm pack --json --dry-run` for machine-readable
  package allowlist checks.
- PASS `npm test` — 23 tests passed.
- PASS `npm run pack:dry-run` — 33 package entries, package size about 25.4 kB,
  unpacked size about 91.6 kB.
- PASS `npm run release:check` — 23 tests, smoke, verify, pack dry run, and
  `git diff --check` passed.
- PASS `npm_config_cache=/tmp/codex-uplift-npm-cache npm publish --dry-run`.
- PASS temp-home `inspect`.
- PASS temp-home `install --dry-run`.
- PASS temp-home `install --mode plugin`.
- PASS temp-home `config candidate --profile safe-interactive`.
- PASS temp-home `compact candidate`.
- PASS temp-home no active `config.toml` after compact candidate.
- PASS temp-home `status`.
- PASS temp-home `uninstall --dry-run`.
- PASS release workflow YAML parse/inspection for `.github/workflows/publish-npm.yml`.
- PASS `npm_config_cache=/tmp/codex-uplift-npm-cache npm publish --dry-run`
  after trusted-publishing workflow docs; package payload is 34 files, package
  size about 26.5 kB, unpacked size about 94.1 kB.
- Removed local `.DS_Store` byproducts and deleted the applied
  `_late-orchestration-recovery/` organizer after capture.
- Regenerated planning `MANIFEST.md` after prompt restoration and recovery
  cleanup.

2026-04-30 published alpha closeout:

- PASS `npm view codex-uplift-kit@0.2.0-alpha.0 version` —
  `0.2.0-alpha.0`.
- PASS `npm dist-tag ls codex-uplift-kit` — `alpha` and `latest` both point to
  `0.2.0-alpha.0` because no stable release exists yet.
- PASS `npx --yes --package codex-uplift-kit@alpha codex-uplift-init --help`.
- PASS published-package temp-home `inspect`.
- PASS published-package temp-home `install --dry-run`.
- PASS published-package temp-home `install --mode plugin`.
- PASS published-package temp-home `config candidate --profile safe-interactive`.
- PASS published-package temp-home `compact candidate`.
- PASS published-package temp-home `status`.
- PASS published-package temp-home `uninstall --dry-run`.
- PASS `npm run release:check` after closeout docs — 23 tests, smoke, verify,
  pack dry-run, and `git diff --check`; package payload remains 34 files,
  package size about 26.5 kB, unpacked size about 94.3 kB.
- Closeout note: trusted publishing has been configured for future releases but
  was not exercised for `0.2.0-alpha.0`, which was already manually published.

## Notes

- `npm run pack:dry-run` uses `/tmp/codex-uplift-npm-cache` and
  `npm pack --json --dry-run` so the temp npm cache works locally and on Linux
  CI while tests can parse the package file list. Earlier manual `npm pack
  --dry-run` and `npm publish --dry-run` checks used
  `/private/tmp/codex-uplift-npm-cache` because the default npm cache had
  ownership issues in this environment.
- The package version is now `0.2.0-alpha.0`; future version bumps remain
  manual release-gate commands.
- Late recovery did not run a real user-home install, live hook/rule enablement, git tag, remote push, or npm publish.
- Trusted publishing workflow execution was not run for `0.2.0-alpha.0`; it is
  configured for a future published GitHub Release.
- The recovery package has been applied, captured in parent planning and
  repo-local `.codex-uplift/` artifacts, and removed after capture.
