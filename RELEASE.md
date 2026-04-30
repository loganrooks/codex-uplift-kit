# Release Process

`codex-uplift-kit` publishes public alpha releases through GitHub Releases and
npm trusted publishing. CI remains separate from publishing.

## First-Time npm Setup

Trusted publishing requires the npm package to exist first. For the first
release only, perform the npm publish manually after the normal release checks:

```bash
npm run release:check
npm_config_cache=/tmp/codex-uplift-npm-cache npm publish --dry-run
npm publish --tag alpha
```

After the first publish, configure npm trusted publishing for this package:

- Publisher: GitHub Actions
- Owner/user: `loganrooks`
- Repository: `codex-uplift-kit`
- Workflow filename: `publish-npm.yml`
- Environment: leave empty unless GitHub environments are added later

The workflow uses OIDC trusted publishing and does not require `NPM_TOKEN`.

## Normal Alpha Release

Do not run these commands without an explicit release approval.

```bash
git status --short
npm run release:check
npm version 0.2.0-alpha.0 --no-git-tag-version
git add package.json CHANGELOG.md
git commit -m "chore(release): v0.2.0-alpha.0"
git tag v0.2.0-alpha.0
git push origin main
git push origin v0.2.0-alpha.0
gh release create v0.2.0-alpha.0 \
  --title "v0.2.0-alpha.0" \
  --notes-file CHANGELOG.md
```

Publishing the GitHub Release triggers `.github/workflows/publish-npm.yml`.
That workflow fails unless the release tag starts with `v`, the tag version
matches `package.json`, and the version is an alpha prerelease.

## Post-Release Verification

After the GitHub Release is published:

```bash
gh run list --workflow publish-npm.yml --limit 5
npm view codex-uplift-kit@0.2.0-alpha.0 version
npm dist-tag ls codex-uplift-kit
```

Expected npm dist-tag for alpha releases: `alpha`.

## Manual Gates

The following still require explicit approval:

- version bump;
- git tag;
- push;
- GitHub Release creation/publication;
- first manual npm publish;
- stable release publishing;
- real user-home install.
