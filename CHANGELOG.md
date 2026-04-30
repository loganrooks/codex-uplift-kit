# Changelog

All notable changes to `codex-uplift-kit` will be recorded here.

This project uses prerelease alpha checkpoints while the setup/posture assistant
surface hardens. The current published package is `0.2.0-alpha.0`.

## 0.2.0-alpha.0 - 2026-04-30

Published prerelease alpha. GitHub Release:
<https://github.com/loganrooks/codex-uplift-kit/releases/tag/v0.2.0-alpha.0>.

### Added

- Expanded `codex-uplift-init` into a non-destructive setup/posture assistant
  command surface: `inspect`, install modes, `status`, manifest-based
  `uninstall`, `config doctor`, `config candidate`, project candidate seams,
  hooks/rules/compact candidate seams, `rtk evaluate --plan-only`, and `verify`.
- Release quality gates through `npm run verify`, `npm run pack:dry-run`,
  `npm run release:check`, and GitHub Actions CI on Node 18, 20, and 22.
- GitHub Release-triggered npm trusted publishing workflow for alpha releases,
  guarded by strict tag/package-version matching.
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

- npm dist-tags currently map both `alpha` and `latest` to
  `0.2.0-alpha.0` because no stable release exists yet.
- Trusted publishing is configured for future releases, but was not exercised
  for this already-published manual alpha.
- Hooks, rules, full-access profile activation, RTK integration, telemetry,
  future npm publishes, future git tags, remote pushes, and real user-home
  mutation remain manual gates.

## 0.1.0 - Bootstrap Baseline

- Initial bootstrap bundle with user-level `AGENTS.md`, reusable skills, custom
  agent templates, optional hook samples, config fragments, plugin scaffolding,
  and conservative installer behavior.
