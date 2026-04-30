# Roadmap

Status: current
Last updated: 2026-04-30

## Current Priority

Use this repo to dogfood the control-plane model before productizing more CLI
behavior. The immediate goal is a clear project operating surface that future
agents can read, follow, and improve without relying on chat history.

## Near Term

### 0.2.1-alpha.0 Candidate

Possible patch release if the user chooses to ship the already-implemented
post-alpha fixes:

- compaction prompts install directly under the Codex home prompt directory;
- default classic/plugin/hybrid installs include compaction prompt files;
- plugin metadata version matches package version;
- README release wording reflects the shipped alpha.

Manual release approval is required before any version bump, tag, publish, push
of release artifacts, or GitHub Release.

### v0.3 Theme

Establish the base project-uplift kernel and dogfood it here.

Candidate workstreams:

- `artifact check`: validate planning/current/governance structure and detect
  missing or stale authority surfaces.
- Structured `project inspect`: separate observed facts, inferences,
  recommendations, and unknowns.
- `governance init`: materialize current-doc and governance skeletons without
  overwriting existing work.
- Pack manifest schema: define `base-control-plane` before domain packs.
- `pack recommend --dry-run`: recommend packs from repo evidence with explicit
  confidence and no automatic install.
- Dogfood `agent-tooling`: capture npm/open-source/release concerns without
  generalizing too early.

## Medium Horizon

- Define the base pack model: roles, workflows, artifacts, prompts, gates, and
  prerequisites.
- Add role contracts before a broad role taxonomy.
- Add closure checker variants for release, report, demo, playtest, pitch, and
  audit outcomes.
- Verify Codex runtime behavior for config, hooks, rules, plugins, and
  compaction prompt selection with current official docs or non-destructive
  probes.
- Improve installer language around installed assets, candidate assets, and
  active config activation.

## Longer Horizon

Potential packs after the base kernel proves useful:

- research-audit;
- MCP server;
- SaaS;
- game;
- social app;
- investor MVP;
- research platform.

These should be developed from real dogfooding cases, not abstract taxonomy
work.

## Explicit Deferrals

- Full domain-pack ecosystem.
- Plugin marketplace ecosystem for packs.
- Active config merge into live `config.toml`.
- Live user-home install mutation without explicit approval.
- Automatic role routing without artifact and gate checks.
- RTK/tool-output filtering beyond evaluation.
- Broad archive reshuffling before the current docs and governance docs are
  stable.
