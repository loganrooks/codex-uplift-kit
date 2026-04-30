---
artifact_id: codex-uplift-v0.2-change-log
artifact_type: change-log
status: active
summary: Orchestrator-maintained log of v0.2 implementation changes and delegated work disposition.
---

# Change Log

Date: 2026-04-30

## Planning Gate

- Created required pre-implementation artifacts:
  - `.codex-uplift/implementation-observations.md`
  - `.codex-uplift/v0.2-scope-map.md`
  - `.codex-uplift/v0.2-implementation-plan.md`
  - `.codex-uplift/v0.2-deferral-check.md`
  - `.codex-uplift/validation-log.md`
- Committed planning gate as `3c5fd69 docs(planning): add v0.2 implementation artifacts`.

## Delegation

- Worker A / CLI core:
  - Scope: `bin/codex-uplift-init.mjs`, `templates/plugin-marketplace/marketplace.json`.
  - Status: completed and accepted after fix pass.
  - Output: subcommand router, install modes, plugin path fix, manifest/status/uninstall, config candidate/doctor basics.
- Worker B / tests:
  - Scope: `test/**`, `package.json`.
  - Status: completed and accepted after fix pass.
  - Output: `npm test` and safety-critical temp-home tests.
- Worker C / docs:
  - Scope: `README.md`, `REVIEW.md`, `templates/config/config.fragment.toml`, `templates/hooks/hooks.json.sample`.
  - Status: completed and accepted.
  - Output: corrected hooks/config/plugin/full-access wording and v0.2 framing.
- Integration review:
  - Scope: read-only review of combined diff.
  - Status: completed.
  - Findings fixed: manifest overwrite/orphan risk, marketplace-root test semantics, dry-run candidate writes, smoke real-home reporting.
- Fix worker:
  - Scope: `bin/codex-uplift-init.mjs`, `package.json`, `test/installer-safety.test.mjs`, `.codex-uplift/test-log.md`.
  - Status: completed and accepted.
  - Output: manifest merge preservation, personal marketplace-root tests, external-home warning/fallback, dry-run candidate tests, temp-home smoke.

## Integration Disposition

Accepted for release-candidate checkpoint with one remaining caveat: custom Codex homes outside the user-home marketplace root use an absolute `source.path` fallback with an explicit warning; exact Codex acceptance of absolute local marketplace paths should be probed before documenting as fully portable.
