# Workflow Gates

Status: current
Last updated: 2026-04-30

## Purpose

Workflow gates prevent agents from converting fuzzy intent into unauditable
edits, releases, or config changes. Gates should improve work quality without
making small tasks absurdly heavy.

## Enforcement Model

Codex Uplift uses layered enforcement.

### Universal Hard Gates

These apply to all substantive work and should become deterministic checks where
the CLI can observe them:

- closure target is declared for Gate 1+ work;
- artifact authority is classified before historical docs are used as current
  instruction;
- broad edits have a stated write scope;
- existing files are preserved unless overwrite is explicitly approved;
- live config, live user-home installs, release actions, publish, tag, and
  activation actions require explicit approval;
- completion claims include verification evidence matched to closure target;
- deterministic validators emit machine-readable findings and stable exit codes;
- platform claims are backed by official docs, source code, or local probes.

### Project Or Pack Gates

These are mandatory only when selected by project type, closure target, or pack.
They should not be imposed on unrelated projects.

| Selected context | Hard gates |
| --- | --- |
| npm package release | tests, package allowlist, pack dry run, changelog/release notes, CI status |
| research audit | source map, evidence ledger, fact/quote checks, uncertainty note, findings linked to evidence |
| code audit | scope, severity criteria, reproducible evidence, recommendations |
| prototype/demo | run instructions, smoke check, known limitations |
| pitch | supported claims, audience fit, risks, ask or next action |
| long-horizon product | current state, vision, roadmap, active work, governance, archive policy |
| Codex config/posture | official-doc or local-probe evidence, inactive candidates by default, activation approval |

### Advisory Heuristics

These may warn or recommend but should not fail a project unless a selected pack
promotes them to hard gates:

- roadmap quality;
- vision clarity;
- maturity or complexity inference;
- whether more artifacts would help;
- whether a role should be delegated;
- whether a pack recommendation should be accepted.

Senior review should be able to see which layer a finding belongs to:

- `hard`: must be fixed to pass the selected gate;
- `warn`: should be reviewed but does not block by default;
- `advisory`: recommendation or design critique.

## Gate Levels

### Gate 0: Mechanical Task

Use for typo fixes, obvious formatting, or tiny local edits.

Requirements:

- inspect relevant file;
- make scoped change;
- run `git diff --check` when practical;
- final response names the change and verification.

### Gate 1: Bounded Work Slice

Use for small code, docs, template, or planning changes.

Requirements:

- identify closure target;
- name write set;
- update current or work artifact only if project truth changes;
- run relevant local verification.

### Gate 2: Contract-Bearing Change

Use for behavior, installer, config, public docs, release, schema, workflow, or
governance changes.

Requirements:

- short plan or active work update;
- evidence inputs;
- decision record if a real decision is made;
- tests or deterministic checks where possible;
- residual risk note.

### Gate 3: Activation Or Release

Use for npm publish, GitHub Release, tag, push of release artifacts, live
user-home install, active config mutation, full-access posture, hooks/rules
activation, or trusted-publisher changes.

Requirements:

- explicit user approval;
- release or activation checklist;
- verification log;
- rollback or recovery note;
- no ambiguous "probably safe" claims.

## Cross-Cutting Gates

### Authority Gate

Before using an artifact as instruction, classify it:

- current;
- active work;
- scratch;
- evidence;
- archive.

Archive and evidence artifacts can inform work but do not override current docs.

### Closure Gate

Before planning work, state what completion means. Examples:

- release shipped;
- report accepted;
- audit findings delivered;
- decision memo complete;
- prototype demoable;
- migration verified;
- pitch coherent and evidence-supported.

### Scope Gate

Before broad edits, name:

- files or directories likely to change;
- non-goals;
- user approvals required;
- areas intentionally left untouched.

### Verification Gate

Map checks to closure target. Do not use package tests as proof of research
quality, and do not use prose review as proof of installer behavior.

### Decision Gate

Record durable decisions when they affect:

- public API or CLI semantics;
- config or security posture;
- release process;
- artifact authority;
- workflow contracts;
- product direction;
- pack/plugin architecture.

### Handoff Gate

When work pauses, preserve:

- current objective;
- newest user instruction;
- branch and commit state;
- changed files;
- decisions made;
- verification run;
- open risks;
- next actions.

## Minimum Verification By Closure Target

| Closure target | Minimum verification |
| --- | --- |
| Software change | Relevant tests or smoke check, plus `git diff --check` |
| Installer/package change | `npm test`, temp-home smoke, package dry run when relevant |
| Research report | Source map, fact/quote checks, uncertainty note |
| Audit | Scope, severity criteria, evidence, recommendations |
| Decision memo | Alternatives, rationale, consequences, owner |
| Prototype/demo | Run instructions, smoke test, known limitations |
| Pitch | Claim support, audience fit, risk disclosure |
| Workflow/governance doc | Cold-read pass, linked entry point, consistency check |

## Deterministic Finding Shape

Future CLI checks should emit findings with stable fields:

```json
{
  "id": "artifact.missing-current-state",
  "layer": "hard",
  "severity": "error",
  "target": ".planning/current/STATE.md",
  "evidence": "file not found",
  "remediation": "create STATE.md or lower the selected control-plane level"
}
```

Required fields:

- `id`: stable machine-readable identifier;
- `layer`: `hard`, `warn`, or `advisory`;
- `severity`: `error`, `warning`, or `info`;
- `target`: file, command, artifact, or config surface;
- `evidence`: observed reason;
- `remediation`: concrete next step.

Exit codes:

- `0`: no hard failures;
- `1`: hard failures;
- `2`: invalid invocation or unreadable target.
