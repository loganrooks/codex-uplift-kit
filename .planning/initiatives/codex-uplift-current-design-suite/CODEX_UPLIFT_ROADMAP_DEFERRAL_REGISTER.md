# CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md

Date: 2026-04-30

Subject: Version ladder, explicit deferrals, and non-foreclosure rules for `codex-uplift-kit`

## 0. Principle

If a vision-relevant capability is not implemented in v0.2, it must be explicitly deferred or rejected. Deferrals exist to prevent silent foreclosure, not to expand v0.2 scope.

## 1. Deferral template

```text
ID:
Capability:
Disposition: deferred | platform-dependent | candidate-after-eval | parked | rejected
Target:
Why not now:
Deferred-to artifact:
Open seam to preserve:
Do-not-foreclose constraints:
Acceptance criteria when revived:
Revisit trigger:
```

## 2. Version ladder

### v0.1 — bootstrap slice

Conservative installer for home `AGENTS.md`, skills, agents, hook samples, plugin skeleton, and config fragment.

### v0.2 — setup/posture assistant baseline

Build the first credible assistant: inspect, doctor, candidates, install modes, posture profiles, project setup candidates, context/compaction scaffolding, rules/hooks candidates, tests, manifest/uninstall.

### v0.3 — adaptive project and long-horizon support

Likely focus: project maturity classifier, context-pack automation, config merge assistant, compaction eval harness, plugin lifecycle, stronger probes, RTK evaluation results, first optional tool-output adapter experiments if evaluation passes.

### v0.4+ — organization/team and platform-integrated automation

Likely focus: enterprise managed-policy handling, telemetry/audit streams, UI/TUI setup wizard, central catalogs, runtime posture switching if supported by Codex, organizational policy packs.

## 3. Active deferral register

### D-001 — Dynamic mid-session sandbox/posture switching

**Disposition:** platform-dependent.  
**Target:** v0.4+ or earlier only with documented Codex support.  
**Why not now:** v0.2 can recommend launch profiles and project config candidates; it should not rely on undocumented runtime mutation.  
**Deferred-to artifact:** `CODEX_UPLIFT_V0_3_PLUS_HORIZON.md`.  
**Open seam:** `PostureRecommendation` must include `launch_command`, `config_candidate`, `manual_app_steps`, and future `runtime_transition`.  
**Do-not-foreclose:** Do not make posture routing only a CLI string generator.  
**Acceptance:** supported runtime transition API/event or verified client behavior.  
**Trigger:** Codex docs/client expose stable runtime posture transition.

### D-002 — Exact effective config resolution across every client

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** effective behavior depends on CLI/app/IDE state, project trust, managed settings, profiles, and overrides.  
**Open seam:** doctor reports `observed`, `inferred`, `proposed`, `unknown`, and `managed_or_overridden`.  
**Do-not-foreclose:** Do not present a merged TOML as guaranteed effective state.  
**Acceptance:** doctor reports effective or explicitly unknown values across supported clients with version/trust annotations.  
**Trigger:** reliable introspection/probe path appears.

### D-003 — Enterprise / managed configuration support

**Disposition:** deferred.  
**Target:** v0.4+.  
**Why not now:** v0.2 is local/personal-first.  
**Open seam:** config doctor must keep managed/system constraints as a distinct layer.  
**Do-not-foreclose:** Do not treat local config as supreme.  
**Acceptance:** managed requirements parsed/reported and team rollout artifacts generated separately.  
**Trigger:** team or enterprise deployment request.

### D-004 — Telemetry / OpenTelemetry audit stream

**Disposition:** deferred.  
**Target:** v0.3 local audit schema; v0.4+ enterprise telemetry.  
**Why not now:** privacy and governance implications.  
**Open seam:** manifests/probes should have machine-readable schemas.  
**Do-not-foreclose:** Do not make markdown-only audit output the only representation.  
**Acceptance:** opt-in telemetry profile, schema, redaction policy.  
**Trigger:** multi-machine/team audit need.

### D-005 — Rich UI/TUI setup wizard

**Disposition:** deferred.  
**Target:** v0.3+.  
**Why not now:** core CLI model should stabilize first.  
**Open seam:** commands expose JSON and noninteractive flags.  
**Do-not-foreclose:** Do not print only unstructured prose.  
**Acceptance:** wizard drives existing command API without duplicating logic.  
**Trigger:** repeated user confusion selecting profiles/components.

### D-006 — Full plugin publishing / marketplace lifecycle

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** v0.2 should first fix local plugin path/mode correctness.  
**Open seam:** plugin install mode separated from standalone skills.  
**Do-not-foreclose:** Do not make hybrid default.  
**Acceptance:** local marketplace validated, duplicate policy enforced, update workflow documented.  
**Trigger:** distribution beyond one local machine.

### D-007 — MCP / app integrations

**Disposition:** deferred.  
**Target:** v0.3+.  
**Why not now:** identity, network, permission, and audit implications.  
**Open seam:** typed component registry supports MCP/app assets.  
**Do-not-foreclose:** Do not treat skills as the only installable asset type.  
**Acceptance:** explicit enablement, identity, permission, and audit posture.  
**Trigger:** docs connector, GitHub/org integration, or audit sink need.

### D-008 — Advanced config merge engine

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** candidate generation is safer for v0.2.  
**Open seam:** config candidates include structured merge metadata.  
**Do-not-foreclose:** Do not make manual copy/paste the only path.  
**Acceptance:** merge engine preserves unrelated settings and passes fixtures.  
**Trigger:** users repeatedly need large manual merges.

### D-009 — Project maturity classifier

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** v0.2 can record signals but should not over-trust classification.  
**Open seam:** project observations record signals/confidence.  
**Do-not-foreclose:** Do not generate one universal project `AGENTS.md` style.  
**Acceptance:** classifier outputs evidence, confidence, and guidance style.  
**Trigger:** project candidates feel too generic or too heavy.

### D-010 — Long-horizon context-pack automation

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** v0.2 should define shapes and candidate workflows first.  
**Open seam:** stable artifact IDs, paths, and summary sections.  
**Do-not-foreclose:** Do not leave chat as the only task state.  
**Acceptance:** command/skill can generate and refresh context packs.  
**Trigger:** multi-session work or repeated context rot.

### D-011 — Automatic retrospective-to-rule update loop

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** doctrine mutation is risky.  
**Open seam:** retrospective artifacts classify failure and proposed destination surface.  
**Do-not-foreclose:** Do not dump all lessons into home `AGENTS.md`.  
**Acceptance:** candidate diffs with source failure, rationale, and rollback.  
**Trigger:** same failure appears twice.

### D-012 — Cross-platform path and permission support

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** v0.2 can avoid obvious Unix-only assumptions but deep support needs matrix tests.  
**Open seam:** centralized path/platform layer.  
**Do-not-foreclose:** Do not scatter `~/.codex`, `/tmp`, or Bash assumptions.  
**Acceptance:** macOS/Linux/Windows fixture and smoke tests.  
**Trigger:** Windows user or CI matrix expansion.

### D-013 — Stronger security policy pack

**Disposition:** deferred.  
**Target:** v0.3/v0.4.  
**Why not now:** needs calibration to avoid false positives and overclaiming.  
**Open seam:** rules/hooks/default_permissions generated from policy catalog.  
**Do-not-foreclose:** Do not make hooks the sole safety layer.  
**Acceptance:** threat model, tests, false-positive handling.  
**Trigger:** repeated high-autonomy/full-access usage.

### D-014 — Task-cost and token-cost instrumentation

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** v0.2 may not observe token accounting across clients.  
**Open seam:** artifacts include optional `context_cost_notes` and output-size fields.  
**Do-not-foreclose:** Do not require raw logs in parent context.  
**Acceptance:** setup assistant reports context-cost risk signals.  
**Trigger:** long-horizon or subagent-heavy cost/rot issues.

### D-015 — Automatic compaction prompt switching

**Disposition:** platform-dependent.  
**Target:** v0.3/v0.4.  
**Why not now:** v0.2 can install prompt registry/candidates; dynamic switching needs documented or locally probed mechanics.  
**Open seam:** prompt IDs, phase labels, profile metadata, registry.  
**Do-not-foreclose:** Do not hard-code one prompt path.  
**Acceptance:** documented or probed prompt switching/application mechanism.  
**Trigger:** evidence one prompt harms another workflow type.

### D-016 — Built-in default compaction prompt evaluation

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** package lacks a documented copy of default behavior and eval harness.  
**Open seam:** prompt IDs, versions, fixture outputs.  
**Do-not-foreclose:** Do not claim package prompt is better than default without evidence.  
**Acceptance:** controlled comparisons on continuation quality.  
**Trigger:** poor continuation after compaction or recommendation-by-default pressure.

### D-017 — Profile-scoped compaction prompt variants

**Disposition:** platform-dependent.  
**Target:** v0.3.  
**Why not now:** profile-scoped behavior for compaction prompt keys should be probed before relied on.  
**Open seam:** prompt registry independent of application mechanism.  
**Do-not-foreclose:** Do not encode variants only as profile fields.  
**Acceptance:** documented or probed profile-scoped prompt behavior.  
**Trigger:** user wants one profile for research vs implementation sessions.

### D-018 — RTK evaluation as a token-efficiency subject

**Disposition:** evaluation-only; optional candidate only after evaluation gates pass.  
**Target:** v0.2 evaluation protocol; v0.3 decision.  
**Why not now:** RTK claims token savings and Codex support, but integration impact on correctness, auditability, raw-output recovery, command policy, telemetry, and client behavior must be evaluated before inclusion.  
**Deferred-to artifact:** `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md`.  
**Open seam:** tool-output compression adapter interface with `adapter_id`, `command_scope`, `raw_output_path`, `filtered_output`, `loss_risk`, and `recovery_path`.  
**Do-not-foreclose:** Do not install RTK, run `rtk init`, add RTK instructions, or assume transparent Codex command rewriting.  
**Acceptance:** evaluation shows material token savings without losing load-bearing details, with raw-output recovery and no unsafe command-policy bypass.  
**Trigger:** user explicitly requests RTK evaluation or context-budget doctor flags shell-output bloat.

### D-019 — RTK integration after evaluation

**Disposition:** deferred pending D-018.  
**Target:** v0.3 only if D-018 passes.  
**Why not now:** integration is not yet accepted.  
**Open seam:** adapter catalog supports third-party output compressors independent of core setup.  
**Do-not-foreclose:** Do not make RTK a first-class core dependency.  
**Acceptance:** optional opt-in component with uninstall, telemetry policy, command allow/exclude list, and per-project control.  
**Trigger:** D-018 passes and user wants opt-in integration.

### D-020 — Automatic posture routing

**Disposition:** deferred.  
**Target:** v0.3 for pre-session routing; v0.4+ for runtime routing.  
**Why not now:** v0.2 can recommend profiles by phase, not safely auto-switch all behavior.  
**Open seam:** `PostureRecommendation` model and phase labels.  
**Do-not-foreclose:** Do not bind posture only to a static default profile.  
**Acceptance:** reliable project/phase classifier plus client application path.  
**Trigger:** repeated manual posture switching.

### D-021 — Team/organization policy packs

**Disposition:** deferred.  
**Target:** v0.4+.  
**Why not now:** personal setup first.  
**Open seam:** policy packs use IDs and schemas, not copied prose.  
**Do-not-foreclose:** Do not make home-level defaults unshareable or unversioned.  
**Acceptance:** team marketplace/catalog and managed config handling.  
**Trigger:** multi-user rollout.

### D-022 — Full context/continuation evaluation automation

**Disposition:** deferred.  
**Target:** v0.3.  
**Why not now:** v0.2 should ship fixtures and manual rubric first.  
**Open seam:** eval fixture IDs, prompt IDs, scored outputs.  
**Do-not-foreclose:** Do not store compaction outputs without metadata.  
**Acceptance:** automated eval compares prompts on preservation and token budget.  
**Trigger:** prompt candidates become defaults or multiple variants appear.
## 4. v0.2 non-deferrable items

These must not be deferred if v0.2 is to be credible:

- `inspect` / `doctor` basics;
- non-destructive config candidates;
- install modes and component selection;
- plugin path validation and duplicate-skill handling;
- manifest/status/uninstall basics;
- safety-critical tests;
- posture candidate generation;
- project inspect/candidate basics;
- hooks/rules candidates with boundary docs;
- context templates and compaction prompt candidates;
- RTK evaluation protocol only, not RTK integration;
- deferral register validation.

## 5. Deferral review checkpoint

At the end of every implementation slice, answer:

1. Did this slice leave any vision-relevant capability unimplemented?
2. Is it already in this register?
3. Did this slice make any future target harder?
4. Did this slice add a new seam or close an old one?
5. Is the deferral visible where a future maintainer will look?
