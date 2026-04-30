# CODEX_UPLIFT_NON_FORECLOSURE_MATRIX.md

Date: 2026-04-30

Subject: v0.2 implementation choices that preserve v0.3+ futures

## 0. Purpose

This matrix turns the no-silent-deferral rule into implementation pressure.

For each important v0.2 design choice, it names:

- the future capability being preserved;
- the v0.2 choice that keeps it possible;
- the anti-choice that would foreclose or make the future harder;
- the owning seam or deferral record.

Use this document during implementation review. If a code change violates one of these constraints, either change the code or update the deferral/seam docs with a deliberate rationale.

## 1. Matrix

| Area | v0.2 choice | Future preserved | Do not foreclose by... | Owner |
|---|---|---|---|---|
| Install operations | Represent writes as manifest entries with kind/source/target/mode/rollback | upgrade assistant, uninstall, UI wizard, team rollout | copying files without recording ownership/version | `ARCHITECTURE_SEAMS` installer operation seam |
| Config inspection | Classify values as observed/inferred/candidate/unknown/managed | exact effective config resolver | claiming a merged TOML is guaranteed effective behavior | D-002 |
| Client support | Use a `ClientAdapter` concept with `cli|app|ide|unknown` | app/CLI/IDE compatibility matrix | encoding app UI names as CLI flags or vice versa | D-012 |
| Profiles | Emit named profile candidates, not silent active defaults | phase-based posture routing | making one global profile the only path | D-001 |
| Full access | Name it `full-access-reviewed`, not safe/full-auto | external isolation generator and risk-aware profiles | treating `danger-full-access + auto_review` as sandboxed safety | D-009, posture seam |
| Install/bootstrap | Add `install-window` profile before full access | lower-risk dependency phases | using full access whenever cache/network access is needed | posture profiles spec |
| Rules/hooks | Generate policy candidates with `policy_id` and mode | policy packs and enterprise guardrails | relying on one `PreToolUse` hook as a security boundary | D-013 |
| Permission prompts | Include `PermissionRequest` hook surface and auto-review caveats | richer approval telemetry/routing | assuming all risk happens in shell command text | hooks/rules policy seam |
| Skills | Keep reusable workflows as skills; report duplicates | plugin publishing and project skill generation | stuffing workflows into home/project `AGENTS.md` | D-006, D-019 |
| Plugin mode | Separate classic/plugin/hybrid modes | publishable plugin lifecycle | defaulting to implicit hybrid duplicate skills | D-006 |
| Project setup | Produce observations before project candidates | maturity classifier and repo-specific setup | universal project `AGENTS.md` from generic doctrine | D-008 |
| Project artifacts | Put generated setup artifacts under `.codex-uplift/` with IDs | context pack automation, upgrade/merge | scattering unindexed files | D-010 |
| Context packs | Define a schema now even if refresh automation is deferred | automated long-horizon continuity | prose-only summaries without IDs/status | D-010, D-017 |
| Compaction prompts | Use prompt catalog IDs and candidate config | prompt switching and prompt evals | hard-coding one prompt path/string forever | D-015, D-016 |
| Compaction quality | Ship checklist/fixture before claiming superiority | prompt eval harness | asserting custom prompt is better without comparison | D-016 |
| Token cost | Add context doctor and summary headers | token-cost instrumentation | making auditability mean always-loaded verbosity | D-014 |
| Output filters | Preserve an evaluation-only `OutputFilterProvider` seam | RTK or other command-output filters after eval | installing or activating RTK before correctness/privacy/Codex-client gates pass | D-018 |
| Subagents | Require artifact path + compact return + inherited posture note | delegation audits and cost accounting | allowing unbounded child writes or chat-only outputs | delegation seam |
| Retrospectives | Keep failure-to-rule updates candidate-first | automated retrospective update loop | editing doctrine automatically after one incident | D-011 |
| Enterprise | Annotate managed/unknown constraints | team policy packs | treating local user config as supreme | D-003, D-020 |
| Telemetry | Use local machine-readable event/report shapes | optional telemetry/observability | making Markdown-only logs the sole audit substrate | D-004 |
| Devcontainers | Require external boundary metadata | secure VM/devcontainer generator | equating full access with external isolation | D-009 |
| Probes | Represent probes as data with expected/observed/client | richer local behavior verification | using destructive probes or unaudited claims | probe/evaluation seam |

## 2. Review checklist

Before accepting a v0.2 change, ask:

1. Did this implementation hard-code a temporary assumption?
2. Is there a stable ID for future diff/update/removal?
3. Is there a Markdown summary and a machine-readable shape where future automation may need it?
4. Is this active by default or candidate-first?
5. Does this affect sandbox, approvals, auto-review, rules, hooks, network, or secrets?
6. Does this increase always-loaded context weight?
7. Did the implementation leave a relevant capability unresolved?
8. Is that unresolved capability in the deferral register?

## 3. Rejection path

Not every future should remain open. If a capability would make the package deceptive, unsafe, or unauditable, record it as rejected rather than deferred.

A rejection must say:

```text
Capability:
Rejected because:
What safer/clearer alternative remains:
Where this rejection is recorded:
```

Examples likely to be rejected rather than deferred:

- persisting hidden chain-of-thought as an audit artifact;
- silently enabling `danger-full-access` as a “safe” default;
- silently overwriting user or project config;
- making repo-local untrusted hooks/rules active without trust/inspection;
- describing hooks as a complete enforcement boundary.

## 4. Source posture

This matrix is implementation guidance, not platform law. When a Codex platform fact is load-bearing, v0.2 should verify it against the current docs and, where behavior is client-specific or unobservable from files, prefer local probes and explicit unknowns over confident claims.
