# CODEX_UPLIFT_STATE.md

Date: 2026-04-30

Subject: Current state and implementation handoff for `codex-uplift-kit`

## 0. Executive state

`codex-uplift-kit` currently has two distinct artifacts:

1. **The implementation package** — the npm-style package / source tree that should expose `codex-uplift-init`.
2. **This planning suite** — the post-review initiative package now expected to live at:

```text
.planning/initiatives/codex-uplift-current-design-suite/
```

Do not confuse the planning suite with the package payload.

## 1. What v0.1 means

v0.1 should be treated as a **bootstrap-slice prototype**, not as a polished npm release unless the implementation repo proves otherwise.

Known v0.1 intent:

- install a user-level `~/.codex/AGENTS.md` candidate/template;
- install reusable user skills;
- install narrow custom-agent templates;
- provide optional hook samples;
- provide a config fragment;
- provide a plugin skeleton;
- expose a conservative installer that avoids overwriting existing files by default.

Known v0.1 strengths from review history:

- candidate-file behavior preserves existing user files;
- global vs project guidance is separated;
- durable artifact discipline and bounded delegation are strong design ideas;
- hooks are optional by default.

Known v0.1 gaps:

- config onboarding is too shallow;
- install inventory and merge guidance are incomplete;
- plugin install path and skill duplication need correction;
- safety-critical installer behavior needs tests;
- package hygiene needs hardening;
- hooks/rules boundaries need sharper docs;
- posture profiles, context compaction, and project setup are not yet productized.

## 2. Is v0.1 already implemented?

Answer: **partially, as a prototype package.**

Before claiming v0.1 is complete or releasable, the orchestrator must inspect the actual implementation repo and record observed evidence in:

```text
.codex-uplift/implementation-observations.md
```

At minimum, observe:

- `package.json` version, scripts, `bin`, and package files;
- `bin/codex-uplift-init.mjs` command behavior;
- installed templates under `templates/`;
- existing tests and smoke commands;
- whether `npm pack --dry-run` succeeds;
- whether install into temp homes is non-destructive;
- whether plugin paths resolve;
- whether duplicate skills can be produced;
- whether package contents include unwanted files.

If these checks are not yet performed, state `v0.1 implementation observed: incomplete/unverified`, not `v0.1 complete`.

## 3. Current product direction

The product category for v0.2 is settled:

> A non-destructive Codex setup and posture assistant that can inspect existing setup, generate candidate configuration, install selectable reusable assets, initialize project-specific Codex surfaces from evidence, and preserve long-horizon audit/context seams.

This does not mean v0.2 implements all future capabilities. It means v0.2 must expose the right command seams, data model seams, profile vocabulary, and deferral discipline so v0.3+ is not foreclosed.

## 4. Current active initiative

Active initiative:

```text
v0.2 setup/posture assistant baseline
```

Primary implementation target:

```text
codex-uplift-init
```

Primary planning sources:

```text
CODEX_UPLIFT_ROADMAP.md
CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md
CODEX_UPLIFT_AUTORUN_CONTRACT.md
CODEX_UPLIFT_RELEASE_CHECKPOINT.md
```

## 5. Required repo-local state artifacts

Before implementation, create or update:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
.codex-uplift/validation-log.md
```

During implementation, keep these current:

```text
.codex-uplift/change-log.md
.codex-uplift/test-log.md
.codex-uplift/release-candidate-review.md
```

If any of these are intentionally not created, record why in `.codex-uplift/v0.2-deferral-check.md`.

## 6. Manual checkpoint requirement

The orchestrator may implement toward a v0.2 release candidate automatically under `CODEX_UPLIFT_AUTORUN_CONTRACT.md`.

The orchestrator must not automatically:

- publish to npm;
- create a public GitHub release;
- push tags to a remote;
- enable hooks/rules/full-access profiles in a user's real home config;
- delete existing user config;
- claim v0.2 is released.

At the end of v0.2 implementation, produce:

```text
.codex-uplift/release-candidate-review.md
```

Then wait for explicit user approval before npm publish, git release, remote push, or moving to v0.3 implementation.

## 7. Context-efficiency state

Token/context efficiency is a first-class product concern, not a side topic.

Current stance:

- use artifact-first workflows;
- keep active context compact;
- have subagents write durable artifacts and return concise summaries;
- use compaction prompts as candidate/evaluation surfaces;
- treat RTK/tool-output filtering as evaluation-only until proven;
- preserve seams for v0.3 adaptive context routing.

## 8. Open questions for the orchestrator to resolve empirically

Resolve through repo inspection, local tests, or candidate artifacts:

- Does the current implementation package match the v0.1 description?
- Which files are package-owned and eligible for manifest/uninstall?
- Which v0.2 commands can be implemented without dependencies?
- Should config parsing use a dependency or a lightweight parser/serializer?
- How should plugin install paths be represented to satisfy Codex plugin resolution?
- How should duplicate skill detection report conflicts?
- Which posture candidates should be generated by default versus opt-in?
- Which client behaviors differ across CLI/app/IDE and require compatibility notes?

Unresolved answers must be recorded; they must not be guessed into code silently.
