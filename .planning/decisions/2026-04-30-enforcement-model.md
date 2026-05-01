# Decision: Layered Enforcement Model

Status: accepted
Date: 2026-04-30
Owner: user

## Context

Codex Uplift needs artifacts and workflows that improve agent work quality, but
forcing every project to use every artifact would make the system brittle and
annoying. A research audit, game prototype, SaaS MVP, npm package release, and
decision memo have different closure targets and evidence needs.

The project needs a clear decision about what is deterministic and universal,
what is deterministic only when a project selects a pack or closure target, and
what remains advisory.

## Decision

Use a layered enforcement model:

1. Universal kernel gates apply to all substantive work.
2. Project or pack gates apply only when selected by project type, closure
   target, or explicit pack/config.
3. Advisory heuristics may recommend structure, but must not fail work unless a
   selected gate makes them mandatory.
4. Human or reviewer judgment remains required for qualitative claims such as
   product quality, research sufficiency, roadmap usefulness, and narrative fit.

## Universal Kernel Gates

These are the default hard boundaries:

- classify the closure target for substantive work;
- classify artifact authority before using old docs as instruction;
- state write scope before broad edits;
- preserve existing files unless overwrite is explicitly approved;
- keep live config, live user-home install, publish, tag, release, and
  activation actions behind explicit approval;
- produce verification evidence matched to the closure target before claiming
  completion;
- emit machine-readable check output for deterministic CLI validators;
- avoid unsupported platform claims.

## Project Or Pack Gates

These become mandatory only when a project selects the relevant closure target or
pack.

Examples:

- npm package release: tests, package allowlist, dry-run pack, CI, changelog,
  release checklist.
- research audit: source map, evidence ledger, fact/quote checks, uncertainty
  accounting, findings linked to evidence.
- prototype or demo: run instructions, smoke check, known limitations.
- pitch: supported claims, audience fit, risk disclosure.
- long-horizon product: current state, vision, roadmap, active work, governance,
  archive policy.
- Codex config/posture work: official-doc or local-probe evidence, inactive
  candidates by default, activation approval gate.

## Advisory Heuristics

These may generate warnings or recommendations but should not hard-fail a
project by default:

- whether the roadmap is strategically strong;
- whether a vision is compelling;
- whether more artifacts would help;
- whether the project maturity inference is correct;
- whether a pack recommendation should be accepted;
- whether a role should be delegated.

## Alternatives Considered

- Enforce all artifacts everywhere: rejected because it would make small
  projects and research work heavy and artificial.
- Keep everything advisory: rejected because it would fail to improve agent
  reliability and auditability.
- Make release workflow the default: rejected because many legitimate projects
  close with reports, audits, prototypes, demos, or decisions.

## Consequences

This model requires v0.3 to implement check selection explicitly. Validators
must know whether they are checking the universal kernel, a selected pack, or an
advisory heuristic.

Roadmaps must translate into concrete slices with acceptance criteria and tests,
not just name future docs.

## Verification Or Review

This decision should be reflected in:

- `.planning/governance/workflow-gates.md`
- `.planning/current/ROADMAP.md`
- future v0.3 CLI schemas and fixtures

## Follow-Up

- Define the v0.3 artifact checker around universal gates first.
- Add pack-specific gates only after the base check model is deterministic.
