# Changelog

All notable changes to `codex-uplift-kit` will be recorded here.

This project uses prerelease alpha checkpoints while the setup/posture assistant
surface hardens. The current package version remains `0.1.0` until the manual
release gate approves a version bump.

## 0.2.0-alpha.0 - Recommended, Unreleased

Recommended prerelease version after manual approval: `0.2.0-alpha.0`.

### Added

- Expanded `codex-uplift-init` into a non-destructive setup/posture assistant
  command surface: `inspect`, install modes, `status`, manifest-based
  `uninstall`, `config doctor`, `config candidate`, project candidate seams,
  hooks/rules/compact candidate seams, `rtk evaluate --plan-only`, and `verify`.
- Release quality gates through `npm run verify`, `npm run pack:dry-run`,
  `npm run release:check`, and GitHub Actions CI on Node 18, 20, and 22.
- Release payload compaction prompt templates plus `compact candidate` and
  `compaction-prompts` component generation of inactive prompt/config
  candidates.
- Public repository hygiene files: MIT license, security policy, changelog,
  editor config, and CI workflow.
- Expanded test coverage for parser failures, component selection, config
  doctor, candidate-only seams, compact generation, manifest hashes, package
  allowlisting, and template validity.
- Documentation for implemented alpha command surface, candidate-only safety
  posture, manual release gates, and residual live-Codex verification gaps.

### Safety

- Package version is intentionally still `0.1.0` until an explicit manual
  version-bump gate runs.
- Hooks, rules, full-access profile activation, RTK integration, telemetry,
  npm publish, git tags, remote push, and real user-home mutation remain manual
  gates.

## 0.1.0 - Bootstrap Baseline

- Initial bootstrap bundle with user-level `AGENTS.md`, reusable skills, custom
  agent templates, optional hook samples, config fragments, plugin scaffolding,
  and conservative installer behavior.
