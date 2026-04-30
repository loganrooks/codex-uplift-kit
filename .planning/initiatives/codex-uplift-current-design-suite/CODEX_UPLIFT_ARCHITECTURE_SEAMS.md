# CODEX_UPLIFT_ARCHITECTURE_SEAMS.md

Date: 2026-04-30

Subject: Extension seams v0.2 must preserve for v0.3+ evolution

## 0. Principle

v0.2 should implement enough to be useful while preserving seams for future capability. A seam is a deliberate interface, data model, file boundary, or artifact convention that lets later work attach without rewriting the product.

## 1. Component registry seam

Represent installable assets as typed components:

```json
{
  "component_id": "skills:codex-project-agents-init",
  "type": "home-agents|skill|agent|config|hook|rule|plugin|project|context|prompt|adapter",
  "scope": "user|project|repo|team",
  "install_mode": ["classic"],
  "default_state": "install|candidate|disabled|eval-only",
  "source_path": "...",
  "target_path": "...",
  "dependencies": [],
  "conflicts": []
}
```

Do not foreclose: adding MCP/app integrations, policy packs, RTK adapters, prompt packs, or team catalogs later.

## 2. Config observation seam

Config doctor must return structured categories:

```json
{
  "observed": [],
  "inferred": [],
  "proposed": [],
  "unknown": [],
  "managed_or_overridden": [],
  "requires_probe": []
}
```

Do not foreclose: exact effective config resolution across app/CLI/IDE or managed environments.

## 3. Posture recommendation seam

Represent posture recommendations as data independent of application mechanism:

```json
{
  "profile_id": "autonomous-audited",
  "phase": "implementation",
  "client": "cli|app|ide|unknown",
  "launch_command": null,
  "config_candidate": null,
  "manual_app_steps": [],
  "rules_candidate": [],
  "hooks_candidate": [],
  "runtime_transition": null,
  "warnings": []
}
```

Do not foreclose: future automatic routing or client-specific application.

## 4. Policy-pack seam

Rules, hooks, permissions, shell environment, network, and approval behavior should be generated from a policy catalog, not separate ad hoc scripts.

```json
{
  "policy_id": "destructive-git-guard",
  "surfaces": ["rules", "hooks", "agents", "docs"],
  "risk_class": "remote-history-rewrite",
  "default_decision": "prompt",
  "false_positive_notes": []
}
```

Do not foreclose: stronger security packs or team policy packs.

## 5. Project setup seam

Project initialization should use a two-stage model:

1. observations artifact;
2. candidate generation.

The observations artifact must record evidence, inferences, open questions, maturity signals, protected seams, and verification commands.

Do not foreclose: project maturity classifier, richer project determiner, or open-source vs prototype vs mature-org setup variants.

## 6. Artifact and context seam

Durable artifacts should have stable IDs and compact headers:

```markdown
---
artifact_id: plan-2026-04-30-001
artifact_type: plan|rationale|verification|handoff|decision|probe|deferral|context-pack
status: draft|active|accepted|parked|superseded
related_deferrals: []
summary: ...
---
```

Do not foreclose: context-pack automation, compaction evaluation, audit streams, or artifact indexing.

## 7. Compaction prompt seam

Prompts should live in a registry:

```json
{
  "prompt_id": "general-continuity",
  "version": "0.2.0",
  "scope": "user|project|profile|phase",
  "path": "prompts/general-continuity.md",
  "status": "candidate|active|deprecated",
  "eval_status": "untested|tested|rejected",
  "intended_phases": ["general"]
}
```

Do not foreclose: multiple prompt variants, profile/phase routing, or default-vs-candidate evaluation.

## 8. Tool-output compression adapter seam

Third-party compression tools such as RTK must attach through an adapter interface, not the core posture model.

```json
{
  "adapter_id": "rtk",
  "status": "eval-only|candidate|installed|disabled",
  "command_scope": ["git", "tests", "lint"],
  "integration_mode": "explicit-command|hook|instruction-only|unknown",
  "raw_output_path": null,
  "filtered_output_path": null,
  "loss_risk": "unknown|low|medium|high",
  "recovery_path": null,
  "telemetry_policy": "unknown|disabled|opt-in|enabled"
}
```

Do not foreclose: RTK evaluation/integration later, or alternative compression tools. Do not install RTK by default.

## 9. Probe seam

Platform claims must be probed where docs or config inspection are insufficient.

```json
{
  "probe_id": "full-access-reviewed-rm-root-simulation",
  "client": "cli|app|ide",
  "profile_id": "full-access-reviewed",
  "command": "...",
  "expected": "prompt|deny|execute|unknown",
  "actual": null,
  "safe": true,
  "notes": []
}
```

Do not foreclose: local behavior evidence and client-version-specific reports.

## 10. Review/deferral seam

Every deferred capability should point to:

- a deferral ID;
- a preserved seam;
- a future target;
- a non-foreclosure constraint.

Do not foreclose: future maintainers understanding why v0.2 did not implement something.
