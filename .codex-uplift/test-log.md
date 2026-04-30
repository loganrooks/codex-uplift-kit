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
- `npm pack --dry-run`
- `npm publish --dry-run`
- `node bin/codex-uplift-init.mjs --help`
- `node bin/codex-uplift-init.mjs verify`
- temp-home `inspect`
- temp-home `install --dry-run`
- temp-home `install --mode plugin`
- temp-home `config candidate --profile safe-interactive`
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

## Notes

- `npm pack --dry-run` and `npm publish --dry-run` use `/private/tmp/codex-uplift-npm-cache` because the default npm cache had ownership issues in this environment.
- The package version remains `0.1.0`; `npm version <version>` is a manual release-gate command in the release checkpoint.
- Late recovery did not run a real user-home install, live hook/rule enablement, git tag, remote push, or npm publish.
