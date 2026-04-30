# Release State

Status: current
Last updated: 2026-04-30

## Shipped Release

`0.2.0-alpha.0` has shipped.

Release facts:

- GitHub Release: `v0.2.0-alpha.0`
- release URL:
  `https://github.com/loganrooks/codex-uplift-kit/releases/tag/v0.2.0-alpha.0`
- release commit/tag target:
  `82eacb30e26a9db42fff3ca39fbb10173fdc4a92`
- npm package: `codex-uplift-kit@0.2.0-alpha.0`
- npm dist-tags observed after publication: `alpha` and `latest` both pointed
  to `0.2.0-alpha.0` because there is no stable release yet
- trusted publishing is configured for future releases and was not exercised
  for this already-published version

## Current Release Boundary

No new release is in progress.

Manual approval is required before:

- version bump;
- npm publish;
- git tag;
- push of release artifacts;
- GitHub Release creation or publication;
- live user-home install;
- active `config.toml` mutation.

## Required Gates Before Next Release

- `npm run release:check`
- package allowlist verification through dry-run pack output
- temp-home install/smoke paths
- `npm publish --dry-run --tag alpha` for prereleases
- CI green on `main`
- release docs and changelog agree on version, tag, and scope

For future trusted-publisher releases, publish should be triggered by a
published GitHub Release only after the package version and tag match.

## Current Release Inputs

- `.codex-uplift/v0.2-release-feedback.md`
- `.codex-uplift/local-install-artifact-investigation.md`
- `.codex-uplift/v0.3-handoff.md`
