# CODEX_UPLIFT_RELEASE_CHECKPOINT.md

Date: 2026-04-30

Subject: Manual release checkpoint for `codex-uplift-kit` v0.2

## 0. Purpose

This checklist defines what the orchestrator must produce before the user decides whether to publish a v0.2 release.

The orchestrator may prepare this checkpoint automatically. It must not publish, tag, or push a release without explicit user approval.

## 1. Required release-candidate artifact

Create:

```text
.codex-uplift/release-candidate-review.md
```

It must include:

- version proposed;
- commit hash or working tree state;
- files changed;
- features implemented;
- candidate-only surfaces;
- explicit deferrals;
- tests run;
- tests not run and why;
- package contents summary;
- install/uninstall verification;
- known risks;
- release recommendation: `ship`, `ship-alpha`, `hold`, or `revise`.

## 2. Pre-release commands

Run or record why not run:

```bash
npm test
npm run smoke
npm run verify
npm run pack:dry-run
npm run release:check
npm pack --dry-run
npm publish --dry-run
git diff --check
node bin/codex-uplift-init.mjs --help
node bin/codex-uplift-init.mjs inspect --home "$TMP_CODEX" --user-home "$TMP_USER"
node bin/codex-uplift-init.mjs install --dry-run --home "$TMP_CODEX" --user-home "$TMP_USER"
node bin/codex-uplift-init.mjs config candidate --profile safe-interactive --home "$TMP_CODEX" --user-home "$TMP_USER"
```

Adapt exact temp variables to the implementation. Do not use the real user home for destructive tests.

## 3. Package inspection

Inspect:

```bash
npm pack --dry-run
```

Confirm:

- no `.DS_Store`;
- no `.tmp` files;
- no private planning artifacts accidentally packaged unless intentionally included;
- executable bin file has expected mode;
- templates are included;
- tests are included or excluded intentionally;
- package size is reasonable;
- package.json version and files are correct.

## 4. Install verification

Verify in temporary homes:

- fresh install writes expected files;
- existing file creates `.candidate.*` without overwriting;
- `--force` creates backups before overwrite;
- plugin mode does not duplicate standalone skills unless hybrid explicitly requested;
- plugin marketplace path resolves;
- manifest is written;
- status reports installed files;
- uninstall removes only package-owned unmodified files.

Manual live-client verification remains separate from automation:

- local plugin mode appears after a Codex restart;
- generated profile candidates can be manually reviewed before merge;
- real user-home install remains optional and explicitly user-approved.

## 5. Safety verification

Confirm:

- hooks are not enabled by default;
- rules are not enabled by default;
- `danger-full-access` profiles are candidate/warning-only;
- RTK is evaluation-only;
- compaction prompt changes are candidate-only;
- telemetry is off unless explicitly requested;
- user config is never overwritten by default.

## 6. Documentation verification

Confirm docs explain:

- home vs project `AGENTS.md`;
- skills vs plugins vs hooks vs rules vs config;
- config profiles and posture candidates;
- app vs CLI caveats;
- sandbox and approval are distinct controls;
- hooks are guardrails, not complete enforcement;
- rules are experimental command-policy surfaces;
- release and manual gates;
- how to uninstall.
- npm trusted publishing setup and GitHub Release-triggered alpha publishing.

## 7. Late orchestration recovery checks

Confirm before release approval:

- late orchestration recovery applied or explicitly declined;
- retrospective `.codex-uplift/` orchestration artifacts created;
- config/posture semantic review complete;
- generated profile candidates use profile-scoped TOML and do not activate a default profile;
- golden/content tests for profile candidates added or explicitly deferred;
- README/release docs no longer contain stale v0.1/v0.2 command-state claims;
- public repository hygiene files exist: `LICENSE`, `CHANGELOG.md`, `SECURITY.md`, `.editorconfig`, and `.github/workflows/ci.yml`;
- CI runs on push and pull_request to `main` with low permissions and Node 18/20/22 matrix;
- recovery folder disposition is recorded as applied, copied into parent
  planning artifacts, captured in `.codex-uplift/`, and removed after capture;
- verification rerun after recovery patches.

## 8. Commit guidance

If commits are authorized, make scoped commits. Suggested order:

1. `docs(planning): add v0.2 state and roadmap`
2. `feat(cli): add inspect and status commands`
3. `feat(config): generate posture config candidates`
4. `feat(install): add install modes and component selection`
5. `feat(manifest): track package-owned files and uninstall safely`
6. `feat(project): generate project setup candidates`
7. `feat(policy): add hooks rules and compaction candidates`
8. `test(installer): cover safety-critical install behavior`
9. `docs(release): document v0.2 release checkpoint`

For substantive commits, include:

```text
Why:
Verification:
Boundary:
```

## 9. Release commands — manual only

Do not run these unless the user approves at the checkpoint:

```bash
git status --short
git log --oneline -5
npm version <version> --no-git-tag-version
npm publish --dry-run
npm publish
git tag v<version>
git push origin <branch>
git push origin v<version>
```

If GitHub release automation is desired, prepare a draft release note first and ask the user to review.

## 9.1 Trusted publishing workflow

After the first manual npm publish creates the package on npm, configure npm
trusted publishing with:

- Publisher: GitHub Actions
- Owner/user: `loganrooks`
- Repository: `codex-uplift-kit`
- Workflow filename: `publish-npm.yml`

The workflow publishes only from GitHub Release `published` events, requires
OIDC `id-token: write`, rejects non-`v` tags, rejects package/tag version
mismatches, and rejects stable releases until that gate is explicitly revised.

## 10. User release decision

The release checkpoint should end with one of these options:

- `ship v0.2.0` — publish stable.
- `ship v0.2.0-alpha.N` — publish prerelease. Current recommended alpha is `0.2.0-alpha.0`.
- `hold` — do not publish; list blockers.
- `revise` — continue implementation; list next slice.

The orchestrator must not choose the release decision alone.
