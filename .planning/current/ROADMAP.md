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

Establish the base project-uplift kernel and dogfood it here. v0.3 should prove
that Codex Uplift can inspect a project, select the right enforcement layer, and
produce deterministic findings without imposing release-process bureaucracy on
non-release projects.

Required release outcome:

- `artifact check` validates the universal control-plane contract with stable
  machine-readable findings.
- `project inspect --json` reports observed project facts, inferred project
  posture, closure-target candidates, selected or recommended enforcement
  layers, and unknowns.
- `governance init --dry-run` shows the exact files it would create for a
  selected project level and closure target, without overwriting existing files.
- Tests cover npm-package, research-audit, minimal, partial-control-plane, and
  this-repo fixtures.

Explicit v0.3 non-goals:

- no active config merge;
- no live user-home mutation;
- no domain-pack ecosystem;
- no plugin distribution model for packs;
- no subjective roadmap or vision quality gate as a hard failure.

## Translating Roadmap To Slices

Every roadmap item should become a work slice with:

- closure target;
- user-visible outcome;
- write set;
- non-goals;
- evidence inputs;
- implementation tasks;
- verification gates;
- stop conditions;
- follow-up or deferral notes.

Do not use release as the default closure target. For example:

- `artifact check` closes with a deterministic CLI check and fixture-backed
  tests.
- `project inspect` closes with structured observations, confidence, unknowns,
  and no writes to active project files.
- `governance init` closes with generated reviewable docs and overwrite-safety
  tests.
- `pack manifest schema` closes with a documented schema, sample pack, and
  parser/validator tests.
- `research-audit` closes with a report, source map, evidence ledger, and
  recommendation review, not a package release.

## v0.3 Release Slices

### Slice 1: Artifact Authority Check

Closure target: deterministic CLI check.

Command:

```bash
codex-uplift-init artifact check --path <repo> --json
```

Outcome: the command validates the universal artifact authority contract and
selected control-plane level.

Acceptance criteria:

- emits JSON with `status`, `selectedLevel`, `findings`, and `summary`;
- uses stable finding fields: `id`, `layer`, `severity`, `target`, `evidence`,
  `remediation`;
- exits `0` when there are no hard failures;
- exits `1` when hard failures exist;
- exits `2` for invalid invocation or unreadable target;
- distinguishes `hard`, `warn`, and `advisory` findings;
- treats `.planning/work/_scratch/` as non-authoritative;
- does not require long-horizon docs for a project whose selected level is
  quick task, bounded research, or minimal software change;
- does require current state, active work, governance, and artifact lifecycle for
  long-horizon/product control-plane level.

Initial tasks:

- define selected levels: `none`, `minimal`, `research`, `software`,
  `product`, `platform`;
- implement authority classification for current, active work, scratch,
  evidence, and archive paths;
- implement checks for required files by selected level;
- add fixture tests for pass, warn-only, hard-fail, and invalid-target cases.

Verification:

- `npm test`
- `npm run smoke`
- fixture snapshots for JSON findings

### Slice 2: Structured Project Inspect

Closure target: structured project posture report.

Command:

```bash
codex-uplift-init project inspect --path <repo> --json
```

Outcome: the command reports what is observed, what is inferred, what remains
unknown, and which enforcement layers are candidates.

Acceptance criteria:

- output contains `observed`, `inferred`, `recommendations`, `unknowns`, and
  `evidence`;
- every inference references observed evidence ids;
- closure-target candidates include confidence and rationale;
- recommendations are advisory unless a selected gate makes them hard;
- command does not write files;
- command does not classify subjective quality as deterministic pass/fail.

Initial tasks:

- define output schema;
- inspect package metadata, repo layout, planning docs, tests, CI, and release
  surfaces;
- classify likely project complexity level with confidence;
- identify closure target candidates without deciding for the user;
- add fixture tests for npm package, research-only repo, game/prototype-shaped
  repo, and minimal repo.

Verification:

- schema fixture tests;
- temp-directory smoke checks.

### Slice 3: Governance Init

Closure target: safe generated planning skeleton.

Command:

```bash
codex-uplift-init governance init --path <repo> --level <level> --closure-target <target> --dry-run --json
```

Outcome: the command proposes the smallest artifact set for the selected level
and closure target.

Acceptance criteria:

- dry run lists every planned write with target path and reason;
- existing files produce candidate outputs or skip/remediation entries;
- generated artifact set differs by selected level and closure target;
- research/audit closure does not receive release docs by default;
- long-horizon product closure receives current state, vision, roadmap, active
  work, governance, and archive policy candidates;
- no files are written in `--dry-run`;
- write mode, when later added, preserves existing files by default.

Initial tasks:

- define base generated docs;
- preserve existing files by default;
- write `.candidate` outputs or plan output for conflicts;
- keep generated docs closure-target aware;
- add tests for empty repo, partial repo, and existing-doc conflicts.

Verification:

- `npm test`
- temp-home dry run.

### Slice 4: Base Pack Manifest

Closure target: deterministic schema contract.

Command:

```bash
codex-uplift-init pack validate --path <pack> --json
```

Outcome: the repo has a minimal pack manifest schema that can express artifacts,
roles, prompts, gates, and checks before any plugin packaging work.

Acceptance criteria:

- schema validates pack id, version, closure targets, artifacts, roles, gates,
  checks, and install surfaces;
- invalid manifests produce stable finding ids;
- pack gates explicitly mark each check as `hard`, `warn`, or `advisory`;
- plugin distribution is not required for pack validation;
- sample `base-control-plane` pack validates.

Initial tasks:

- define pack fields for artifacts, roles, workflows, prompts, gates, and
  prerequisites;
- create one sample pack for this repo's control plane;
- add validator tests;
- keep plugin distribution out of scope.

Verification:

- schema tests;
- package dry run excludes unreleased planning-only pack internals unless
  intentionally included.

### Slice 5: Dogfood Agent-Tooling Pack

Closure target: audited pack proposal, not implementation.

Outcome: identify the reusable subset of this repo's npm/open-source/agent
tooling process without turning it into a domain-pack explosion.

Acceptance criteria:

- proposal separates universal kernel, npm-package gates, open-source-alpha
  gates, and project-specific choices;
- every proposed hard gate has an automatable check or explicit manual approval
  gate;
- advisory gates are labeled advisory;
- proposal is reviewed against v0.2 release history and this repo's current
  needs;
- no pack installation or plugin distribution is implemented in this slice.

Initial tasks:

- map recurring roles and gates from v0.2;
- separate release closure from research/audit closure;
- define which assets are universal, pack-specific, or project-specific;
- produce a proposal before implementation.

Verification:

- artifact review against this repo's actual release history;
- explicit deferral list for domain packs.

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
