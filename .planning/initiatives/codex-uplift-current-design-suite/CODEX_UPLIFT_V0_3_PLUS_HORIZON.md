# CODEX_UPLIFT_V0_3_PLUS_HORIZON.md

Date: 2026-04-30

Subject: v0.3+ horizon and non-foreclosure implications for v0.2

## 0. Purpose

This document does not expand v0.2. It identifies future capabilities that are relevant enough that v0.2 must preserve seams for them.

If v0.2 defers one of these, it must record the deferral and avoid designs that make the future capability hard to add.

## 1. v0.3 thesis

v0.3 should move from static setup assistance to adaptive setup assistance:

> Inspect the user/project state, classify phase and risk, generate or recommend posture/config/artifact workflows, and evaluate context-efficiency mechanisms with local evidence.

## 2. Candidate v0.3 capabilities

### 2.1 Project posture determiner

A project-local workflow that inspects:

- repo maturity;
- existing AGENTS/config/hooks/rules/skills;
- trust state;
- test/build commands;
- package manager behavior;
- remote/release surfaces;
- sensitive file patterns;
- desired autonomy phase.

Output:

```text
.codex-uplift/project-posture-report.md
.codex-uplift/project-config-candidates/
.codex-uplift/project-agents-candidates/
```

v0.2 must preserve a project candidate command seam.

### 2.2 Config probes

Local probes that classify whether controlled actions are:

- denied by sandbox;
- routed to user approval;
- routed to auto-review;
- governed by rule;
- governed by hook;
- executed without prompt;
- not externally observable.

v0.2 must avoid overclaiming effective behavior and preserve a `probe` command namespace.

### 2.3 Adaptive phase routing

Recommend posture based on phase:

- inspect;
- plan;
- implement;
- install/bootstrap;
- network research;
- audit;
- release;
- CI.

v0.2 must store phase IDs separately from profile IDs.

### 2.4 Compaction prompt evaluation and switching

v0.3 may evaluate multiple compaction prompt candidates and allow project/phase-specific selection.

v0.2 must:

- store prompts as candidates;
- keep prompt IDs and phase metadata;
- avoid silently replacing user or project compaction prompts;
- provide an eval plan.

### 2.5 Tool-output filter evaluation

RTK or another tool-output filter may be useful, but adoption requires Codex-specific proof.

v0.2 must:

- preserve generic tool-output-filter seams;
- keep RTK evaluation-only;
- avoid hard-coding RTK into the architecture.

### 2.6 Team/org deployment

Future team use may require:

- managed config awareness;
- policy summaries;
- telemetry/observability candidates;
- plugin marketplace publishing;
- organization-specific AGENTS/skills.

v0.2 must:

- keep install manifests machine-readable;
- keep candidate generation non-destructive;
- distinguish user/project/managed config.

### 2.7 Subagent orchestration maturity

Future versions may add richer orchestrator/subagent workflows.

v0.2 must preserve:

- explicit subagent output contracts;
- artifact path requirements;
- disposition states;
- inherited sandbox/approval expectation fields.

## 3. v0.2 anti-foreclosure checklist

During v0.2 implementation, do not:

- collapse all profiles into one hard-coded default;
- combine hooks, rules, profiles, and config into one inseparable template;
- make plugin install and standalone skills inseparable;
- make RTK-specific command names the only output-filter seam;
- store install state only as human prose;
- require project-level setup to overwrite files;
- assume app/CLI/IDE behavior is identical;
- hide deferrals in README prose;
- claim high autonomy is safe without specifying controls and boundaries.

## 4. v0.3 entry condition

Do not start v0.3 implementation until v0.2 has:

- release-candidate review;
- user decision on release or hold;
- updated state and roadmap;
- v0.3 handoff artifact;
- explicit first v0.3 slice.
