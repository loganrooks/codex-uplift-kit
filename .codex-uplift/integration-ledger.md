---
artifact_id: codex-uplift-integration-ledger
artifact_type: integration-ledger
status: active
summary: Disposition ledger for implementation and recovery outputs.
---

# Integration Ledger

Date: 2026-04-30

## Pre-Recovery Implementation Dispositions

| Item | Source | Disposition | Rationale |
|---|---|---|---|
| v0.2 CLI baseline | Worker A, fix worker | accepted | implemented command seams, install modes, manifest/status/uninstall, plugin path behavior |
| Safety test suite | Worker B, fix worker | accepted | temp-home tests cover installer safety, manifest behavior, package hygiene |
| Docs/template updates | Worker C | accepted | corrected hooks/config/plugin/full-access wording |
| Custom Codex home plugin absolute path fallback | integration review | accepted with caveat | warning is explicit; live Codex acceptance deferred to v0.3 probe |

## Recovery Dispositions

| Item | Source | Disposition | Rationale |
|---|---|---|---|
| Late orchestration docs | recovery package | accepted | missing from parent suite; no target collisions |
| Recovery package location | orchestrator | revised | moved from repo root into parent suite path expected by runbook |
| Ignore hygiene | recovery runbook | accepted | `.gitignore` patched for archive and local-junk patterns; recovery folder remains trackable |
| Docs consistency findings | Euler explorer | accepted | README/REVIEW/test-log/release-candidate wording patched |
| Config/posture findings | Archimedes explorer | accepted | material correctness issue; release recommendation changed to `revise` pending patch |
| Config posture patch | Maxwell worker | accepted after review and verification | generator now emits profile-scoped candidates; tests assert content semantics |

## Parked Or Deferred

| Item | Disposition | Artifact |
|---|---|---|
| Live Codex plugin restart/install verification | deferred | `.codex-uplift/v0.3-handoff.md`, deferral D-012A |
| Exact effective config resolution across all clients | deferred | D-002 |
| Full project candidate generator | deferred | v0.3 handoff |
| Worktree provider / checkpoint provider productization | deferred | v0.3+ seams in worktree docs |

## Rejected

No recovery output was rejected. The earlier `ship-alpha` recommendation was revised temporarily because the config/posture issue was material, then restored after the generator patch and verification passed.
