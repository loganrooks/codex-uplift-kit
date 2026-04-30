# RECOVERY_EXIT_CRITERIA.md

Date: 2026-04-30

Subject: Exit criteria for the late orchestration recovery pass

## Recovery is complete only when all of these are true

### Planning suite

- Required missing docs have been copied or merged into the parent initiative root.
- `delegation-templates/README.md` has been copied or merged.
- `MANIFEST.md` reflects the actual parent suite files and byte sizes.
- `CODEX_UPLIFT_DOC_SUITE_INDEX.md` includes the orchestration/delegation/worktree docs.
- `START_HERE.md` correctly describes the normal and recovery entrypoints.
- `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md` includes the late recovery and orchestration docs in its read order.
- `CODEX_UPLIFT_STATE.md` records recovery status.
- `CODEX_UPLIFT_ROADMAP.md` records the late orchestration recovery gate.
- `CODEX_UPLIFT_RELEASE_CHECKPOINT.md` includes the recovery/hardening release gates.

### Repo-local implementation artifacts

These exist and are current:

```text
.codex-uplift/post-implementation-orchestration-reconciliation.md
.codex-uplift/delegation-retrospective.md
.codex-uplift/worktree-state.md
.codex-uplift/file-ownership-map.md
.codex-uplift/integration-ledger.md
.codex-uplift/checkpoint-ledger.md
```

### Hardening reviews

- Config/posture semantic review completed.
- Generated profile candidates either match the posture spec or the mismatch is fixed/recorded.
- Golden/content tests for profile candidates are added or explicitly deferred with rationale.
- README/release docs reflect current CLI capabilities.
- Candidate-only vs implemented vs deferred surfaces are clearly distinguished.

### Verification

At minimum rerun:

```bash
npm test
npm run smoke
node bin/codex-uplift-init.mjs --help
node bin/codex-uplift-init.mjs verify
npm pack --dry-run
git diff --check
```

If package metadata changed, also run:

```bash
npm publish --dry-run
```

Use temp `--home` and `--user-home` for install tests. Do not run real user-home installs as part of recovery.

### Manual gates still closed

The recovery pass must stop before:

- npm publish;
- package version bump, unless explicitly approved as a release-prep action;
- git tag;
- remote push;
- GitHub release;
- live user-home config mutation;
- active hooks/rules/full-access profile enablement;
- v0.3 implementation.

## Recommended final state string

After recovery, `CODEX_UPLIFT_STATE.md` should be able to say:

```text
v0.2 alpha candidate prepared after late orchestration recovery; manual release decision pending.
```
