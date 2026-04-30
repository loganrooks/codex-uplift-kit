# CODEX_UPLIFT_ROADMAP.md

Date: 2026-04-30

Subject: Concrete v0.1, v0.2, and v0.3 roadmap for `codex-uplift-kit`

## 0. Roadmap rule

This roadmap is a living artifact. Every implemented slice must update:

```text
CODEX_UPLIFT_STATE.md
CODEX_UPLIFT_ROADMAP.md
CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md
.codex-uplift/validation-log.md
```

If a capability is relevant to the vision but not implemented in the current release, record:

- target horizon;
- deferral artifact;
- preserved seam;
- what the current version must not do;
- acceptance criteria for revival;
- revisit trigger.

No silent “future work.”

## 1. Version posture summary

| Version | Product posture | Release character |
|---|---|---|
| v0.1 | Bootstrap bundle prototype | Useful scaffold; release only if package hygiene and safety tests pass |
| v0.2 | Setup/posture assistant baseline | First credible npm release candidate if acceptance gates pass |
| v0.3 | Adaptive project/context/posture assistant | Extends v0.2 with probes, phase routing, project tailoring, and evaluated context tools |
| v0.4+ | Team/org/platform-integrated assistant | Managed config, observability, marketplace distribution, enterprise constraints |

## 2. v0.1 — bootstrap bundle prototype

### Goal

Provide a conservative first package that installs starter assets without overwriting user configuration.

### Expected implemented surfaces

- `package.json` with `codex-uplift-init` bin entry.
- `bin/codex-uplift-init.mjs` with dry-run/install behavior.
- `templates/home/AGENTS.md`.
- `templates/skills/*/SKILL.md`.
- `templates/agents/*.toml`.
- `templates/hooks/*.mjs` and `hooks.json.sample`.
- `templates/config/config.fragment.toml`.
- `templates/plugin/**` and plugin marketplace metadata.
- README and smoke command.

### v0.1 completion gates

v0.1 is only “complete” if the implementation repo demonstrates:

- dry-run succeeds;
- install into temporary homes succeeds;
- existing files are preserved and candidates are written;
- forced overwrite backs up previous files;
- JSON/TOML templates parse;
- hook scripts have valid output shape;
- npm package dry-run excludes accidental files;
- README accurately describes actual behavior.

### v0.1 known limitations

- No full config doctor.
- No rich posture profiles.
- No install modes.
- No project-level config determiner.
- No manifest/status/uninstall system.
- No real context-compaction evaluation.
- No RTK adoption.

### v0.1 release stance

If v0.1 has not already been released, prefer not to publish it broadly. Use it as the baseline for v0.2 unless the user explicitly wants an alpha package.

## 3. v0.2 — setup/posture assistant baseline

### Goal

Turn the package from a bootstrap bundle into a non-destructive Codex setup/posture assistant.

### Required command surface

```text
codex-uplift-init inspect
codex-uplift-init install --mode classic|plugin|hybrid --components <list>
codex-uplift-init status
codex-uplift-init uninstall --manifest <path>
codex-uplift-init config doctor
codex-uplift-init config candidate --profile <profile>
codex-uplift-init project inspect
codex-uplift-init project candidate --include <surfaces>
codex-uplift-init rules candidate --profile <profile>
codex-uplift-init hooks candidate --profile <profile>
codex-uplift-init compact candidate --profile <profile>
codex-uplift-init rtk evaluate --plan-only
codex-uplift-init verify
```

Implementation may ship a subset only if the unimplemented command is explicitly deferred with its command seam preserved.

### Required v0.2 capabilities

#### 3.1 Inspect and doctor

- Inventory `~/.codex`, `~/.agents`, existing skills, agents, hooks, plugins, config, and collisions.
- Summarize observed setup and uncertainties.
- Distinguish user config, project config, managed/admin constraints, and unknown effective behavior.

#### 3.2 Non-destructive config candidates

- Generate candidate TOML fragments; never silently overwrite `config.toml`.
- Include posture profiles and warnings.
- Include comments explaining conflicts and merge boundaries.

#### 3.3 Explicit install modes

- `classic`: standalone user skills.
- `plugin`: plugin install only.
- `hybrid`: explicit opt-in with duplicate warnings.

#### 3.4 Component selection

Selectable components:

```text
home-agents, skills, agents, config, hooks, rules, plugin, project-skeleton, compaction-prompts
```

Hooks, rules, full-access profile candidates, telemetry, and RTK remain opt-in/candidate surfaces.

#### 3.5 Manifest, status, uninstall

- Write a manifest of package-owned files.
- Support `status` to compare manifest against filesystem state.
- Support uninstall of package-owned files only.
- Never delete user-modified or unowned files silently.

#### 3.6 Posture profiles

Generate candidates for:

- `review-only`;
- `safe-interactive`;
- `autonomous-audited`;
- `install-window`;
- `net-limited`;
- `full-access-reviewed`;
- `ci-noninteractive`;
- `external-isolated` / `yolo` warning-only.

#### 3.7 Project setup candidates

Produce project-local candidates, not silent writes:

```text
.codex-uplift/observations.md
.codex-uplift/project-setup-plan.md
AGENTS.md.candidate
.codex/config.toml.candidate
.codex/hooks.json.candidate
.codex/rules/*.candidate
```

#### 3.8 Context efficiency

- Generate compaction prompt candidates.
- Generate context-efficiency recommendations.
- Preserve task/phase prompt IDs.
- Do not claim package prompts beat defaults without evaluation.

#### 3.9 RTK/tool-output-filter seam

- Provide evaluation protocol and `--plan-only` command.
- Do not install RTK.
- Do not generate active RTK integration unless future evaluation passes.

#### 3.10 Tests

Minimum tests:

- dry-run behavior;
- fresh install;
- existing-file candidate behavior;
- force creates backup;
- manifest/status/uninstall safety;
- JSON/TOML parse checks;
- plugin path resolution;
- duplicate skill detection;
- hook script output shapes;
- package hygiene;
- config candidate generation snapshots or golden files.

### v0.2 release gates

A v0.2 release candidate requires:

- `npm test` passing;
- smoke tests passing;
- `npm pack --dry-run` inspected;
- temp-home install test passing;
- package contents reviewed;
- generated candidates reviewed;
- docs updated;
- `CODEX_UPLIFT_STATE.md` updated;
- `CODEX_UPLIFT_ROADMAP.md` updated;
- `.codex-uplift/release-candidate-review.md` created;
- manual approval before npm publish, git tag, GitHub release, or remote push.

### Late orchestration recovery gate

Before v0.2 release approval, ensure missing orchestration/worktree docs are added and indexed, retrospective `.codex-uplift/` artifacts are created, config/posture semantic tests are run or explicitly deferred, and release docs reflect the current CLI state.

### v0.2 implementation status on 2026-04-30

Status: release-candidate implementation prepared after late orchestration recovery; manual release decision pending.

Implemented in the local package:

- `inspect`;
- `install --mode classic|plugin|hybrid|minimal`;
- component selection and legacy skip aliases;
- `status`;
- `uninstall --manifest <path>`;
- `config doctor`;
- `config candidate --profile <profile>`;
- candidate-only seams for project/hooks/rules/compact/RTK;
- `verify`;
- plugin path generation and validation for default personal installs;
- duplicate skill avoidance by default and hybrid duplicate warning;
- manifest merge preservation;
- safe uninstall of unmodified package-owned files only;
- safety-critical `node:test` suite.

Release gates passed locally:

- `npm test`;
- `npm run smoke`;
- `npm pack --dry-run`;
- `npm publish --dry-run`;
- temp-home inspect/install/config/status/uninstall checks;
- docs updated;
- `.codex-uplift/release-candidate-review.md` created;
- `.codex-uplift/v0.3-handoff.md` created.

Recovery gate status:

- late orchestration/delegation/worktree docs copied into the parent planning suite;
- retrospective orchestration artifacts created;
- config/posture semantic review found profile-candidate mismatches, now patched with generated-content tests;
- public docs consistency pass complete;
- verification rerun after recovery patches.

Manual gates still pending:

- package version bump from `0.1.0` to the approved v0.2 release version;
- npm publish;
- git tag;
- remote push;
- live Codex plugin restart/install verification if desired before stable
  release.

Residual caveat:

- custom Codex homes outside the user-home marketplace root use an explicit
  absolute local `source.path` fallback with warning. Probe live Codex behavior
  before documenting this case as fully portable.

## 4. v0.3 — adaptive project/context/posture assistant

### Goal

Make the assistant adaptive enough to recommend per-project and per-phase Codex posture without overclaiming enforcement or silently escalating autonomy.

### Candidate v0.3 capabilities

- `project doctor` that reads existing project Codex surfaces and recommends setup changes.
- `project profile candidate` that creates phase-aware `.codex/config.toml` candidates.
- `config probe` / `project probe` for actual CLI/app behavior where observable.
- Adaptive phase posture suggestions: inspection, planning, implementation, bootstrap/install, release, audit, CI.
- Compaction prompt evaluation harness.
- Optional project-specific compaction prompt selection.
- Tool-output-filter evaluation harness, including RTK if still relevant.
- Better app-vs-CLI compatibility reporting.
- Optional telemetry/observability candidate for team deployments.
- Skill/plugin namespace management and discovery-budget analysis.
- Subagent sandbox/approval inheritance checks.

### v0.3 non-foreclosure constraints imposed on v0.2

v0.2 must:

- keep config generation modular;
- store profile IDs and phase IDs separately;
- avoid hard-coding one default high-autonomy profile as universal;
- make hooks/rules candidates separate from profile candidates;
- keep tool-output filtering generic rather than RTK-specific;
- keep compaction prompt candidates separate from global config application;
- write machine-readable install manifests;
- preserve project-local candidate generation paths.

## 5. v0.4+ horizon

Possible future directions:

- team/org setup with managed configuration awareness;
- curated plugin distribution and marketplace support;
- enterprise audit/telemetry profiles;
- devcontainer/VM hardening templates;
- multi-agent review orchestration;
- CI-integrated setup verification;
- policy-as-code for Codex posture.

These are not v0.2 commitments. v0.2 must not foreclose them.

## 6. Commit strategy across the roadmap

When commits are requested or authorized, prefer scoped commits:

1. planning docs / state / roadmap updates;
2. CLI command surface and parser;
3. inspect/doctor implementation;
4. config/profile candidate generation;
5. install modes and component selection;
6. manifest/status/uninstall;
7. project candidates;
8. hooks/rules/compaction/RTK candidate surfaces;
9. tests;
10. docs/release notes.

Use Conventional Commit subjects where no repo convention conflicts. For substantive commits include body notes:

```text
Why:
Verification:
Boundary:
```

Do not publish, push tags, force-push, or create public releases without explicit user approval.
