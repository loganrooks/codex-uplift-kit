---
artifact_id: codex-uplift-file-ownership-map
artifact_type: ownership-map
status: active
summary: File ownership map for v0.2 implementation and late recovery hardening.
---

# File Ownership Map

Date: 2026-04-30

## Implementation Slice Ownership

| Slice | Primary files | Owner evidence | Status |
|---|---|---|---|
| CLI core and installer behavior | `bin/codex-uplift-init.mjs`, `templates/plugin-marketplace/marketplace.json` | `.codex-uplift/change-log.md` Worker A | accepted |
| Installer safety tests | `test/installer-safety.test.mjs`, `package.json` | `.codex-uplift/change-log.md` Worker B and fix worker | accepted |
| Public docs and template wording | `README.md`, `REVIEW.md`, `templates/config/config.fragment.toml`, `templates/hooks/hooks.json.sample` | `.codex-uplift/change-log.md` Worker C | accepted |
| Planning and release state | `.codex-uplift/*`, `.planning/initiatives/codex-uplift-current-design-suite/*` | orchestrator | accepted before recovery; now being reconciled |

## Recovery Slice Ownership

| Slice | Files | Owner | Notes |
|---|---|---|---|
| Recovery worktree state | `.codex-uplift/worktree-state.md` | orchestrator | first recovery edit |
| Late orchestration docs | `.planning/initiatives/codex-uplift-current-design-suite/CODEX_UPLIFT_*ORCHESTRATION*.md`, `*DELEGATION*.md`, `*WORKTREE*.md`, `delegation-templates/README.md` | orchestrator copy from recovery package | no existing target merge needed |
| Suite routing and release gates | `START_HERE.md`, `CODEX_UPLIFT_DOC_SUITE_INDEX.md`, `CODEX_UPLIFT_ORCHESTRATOR_ENTRYPOINT.md`, `CODEX_UPLIFT_STATE.md`, `CODEX_UPLIFT_ROADMAP.md`, `CODEX_UPLIFT_RELEASE_CHECKPOINT.md`, `MANIFEST.md` | orchestrator | minimal routing/state updates |
| Recovery retrospective artifacts | `.codex-uplift/post-implementation-orchestration-reconciliation.md`, `.codex-uplift/delegation-retrospective.md`, `.codex-uplift/file-ownership-map.md`, `.codex-uplift/integration-ledger.md`, `.codex-uplift/checkpoint-ledger.md` | orchestrator | retrospective, evidence-bounded |
| Docs consistency hardening | `README.md`, `REVIEW.md`, `.codex-uplift/test-log.md`, `.codex-uplift/release-candidate-review.md` | orchestrator from Euler review | accepted |
| Config posture hardening | `bin/codex-uplift-init.mjs`, `test/installer-safety.test.mjs` | Maxwell worker | accepted after orchestrator diff review and verification |

## Non-Overlapping Write Rule

During recovery, worker-owned writes were limited to the CLI and test files for the posture patch. The orchestrator avoided editing those files while the worker was active, then reviewed the resulting diff before integration.
