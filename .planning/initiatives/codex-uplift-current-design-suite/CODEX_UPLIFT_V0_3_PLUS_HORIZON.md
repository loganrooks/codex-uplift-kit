# CODEX_UPLIFT_V0_3_PLUS_HORIZON.md

Date: 2026-04-30

Subject: Future horizon map and v0.2 non-foreclosure implications

## 0. Executive position

v0.3+ planning matters now only where it changes v0.2 design. Future work should not bloat v0.2, but v0.2 should preserve the seams future work needs.

## 1. Horizon map

| Future capability | Likely version | v0.2 seam to preserve |
|---|---:|---|
| Config merge assistant | v0.3 | candidate metadata with source/target/conflict/rationale |
| Project maturity classifier | v0.3 | observations with evidence/confidence, not just final label |
| Context-pack automation | v0.3 | artifact IDs, summary headers, context-pack schema |
| Compaction eval automation | v0.3 | prompt registry, fixture IDs, scored outputs |
| RTK/tool-output adapter experiment | v0.3 if eval passes | adapter registry, eval-only status, raw-output recovery fields |
| Plugin publishing lifecycle | v0.3 | install modes, duplicate-skill policy, marketplace path validation |
| Automatic posture routing | v0.3/v0.4 | `PostureRecommendation` data model |
| Dynamic runtime posture switching | v0.4+ | `runtime_transition` field, platform-dependent deferral |
| Team policy packs | v0.4+ | policy catalog IDs and surfaces |
| Enterprise managed config | v0.4+ | managed/overridden category in doctor output |
| Telemetry/audit streams | v0.4+ | machine-readable manifest/probe/event schema |
| UI/TUI setup wizard | v0.3+ | JSON command outputs and noninteractive flags |

## 2. Current design impacts

### 2.1 Avoid prose-only state

Machine-readable metadata is required for future merge, UI, telemetry, and automation.

### 2.2 Avoid universal project doctrine

Project setup must use evidence first so future maturity classifiers can improve it.

### 2.3 Avoid core dependency on third-party tools

RTK and similar tools should remain adapters. v0.2 can evaluate them without binding the kit to them.

### 2.4 Avoid hard-coded client equivalence

App, CLI, IDE, and web can diverge. Store client IDs, versions, and unknowns.

### 2.5 Avoid safety overclaims

Autonomy profiles should include recovery and audit controls, not just less prompting.

## 3. v0.3 candidate slices

The best v0.3 slices, if v0.2 lands cleanly, are:

1. config merge assistant;
2. compaction/context eval automation;
3. project maturity-aware setup;
4. plugin marketplace lifecycle;
5. RTK evaluation decision and optional adapter if accepted;
6. local behavior probe execution;
7. retrospective-to-rule candidate loop.

## 4. v0.4+ candidate slices

Likely later:

- enterprise/managed config;
- team policy catalogs;
- UI/TUI setup wizard;
- telemetry/audit event stream;
- runtime posture switching if Codex supports it;
- richer app/MCP integrations.

## 5. Non-foreclosure checklist for v0.2 implementation

Before merging any v0.2 implementation slice, ask:

- Did we hard-code a future adapter as core?
- Did we make a manual workflow impossible to automate later?
- Did we use prose where a stable ID/schema is needed?
- Did we make app/CLI/IDE equivalence implicit?
- Did we make a high-autonomy path sound safer than it is?
- Did we omit a deferral ID for a not-now capability?
