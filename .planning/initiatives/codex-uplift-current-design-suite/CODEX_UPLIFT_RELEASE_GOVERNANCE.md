# CODEX_UPLIFT_RELEASE_GOVERNANCE.md

Date: 2026-04-30

Subject: Release governance, deferral discipline, and non-foreclosure rules for `codex-uplift-kit`

## 0. Executive rule

Every release must explicitly state:

1. **What this release resolves.**
2. **What this release intentionally does not resolve.**
3. **Which seams keep unresolved but vision-relevant work possible.**

A feature is not allowed to be merely “out of scope” if it still matters to the product vision. It must have a deferral record, a target horizon or parking status, a preserved seam, and a revival condition.

This rule exists so small releases can ship without accidentally closing future possibilities.

## 1. Product vision anchor

`codex-uplift-kit` is a Codex setup and posture assistant that should eventually help users:

- install and maintain user-level Codex working agreements;
- initialize project-level `AGENTS.md` and `.codex/` surfaces from evidence;
- choose sandbox, approval, auto-review, permissions, rules, hooks, profile, and client posture;
- support high-autonomy operation with compensating controls;
- package repeatable workflows as skills/plugins;
- use custom subagents with artifact-first output contracts;
- reduce context rot through context packs, artifact indexes, compact returns, and compaction prompts;
- preserve auditability across long-running work;
- adapt as Codex clients, configuration semantics, and platform capabilities evolve.

Therefore v0.2 should not implement every future capability, but it must preserve extension seams for the ones that remain relevant.

## 2. Release-layer distinction

| Layer | Question | Artifact |
|---|---|---|
| Vision | What future must remain possible? | this document + v0.3+ horizon |
| Roadmap | Where does each deferred capability go? | deferral register |
| Architecture | Which seam preserves the future? | architecture seams |
| Version spec | What exactly is buildable now? | v0.2 operational spec |
| Implementation | What files, commands, tests are changed? | package source + test plan |
| Continuity | What must survive compaction/session handoff? | context pack + artifact index |

Do not make the v0.2 spec absorb every future idea. The spec should name deferrals and point to the register and seam docs.

## 3. The no-silent-deferral protocol

When deciding not to implement `X` in v0.2, record:

```text
Capability X:
- Is X still relevant to the vision? yes/no
- If yes, where is it deferred? v0.3 / v0.4+ / platform-dependent / explicitly parked
- Why is it not implemented now?
- What artifact tracks the deferral?
- What seam keeps X possible?
- What v0.2 implementation choice could foreclose X?
- What must v0.2 do instead?
- What acceptance criteria would close X later?
- What signal should cause X to be revisited?
```

A deferral is invalid if it says only “future work,” “out of scope,” “not now,” “maybe later,” or “needs more research.” Those phrases may appear only if followed by a target, seam, non-foreclosure constraint, and revisit trigger.

## 4. Not-now disposition taxonomy

Use these terms consistently:

| Disposition | Meaning | Required tracking |
|---|---|---|
| `deferred` | Vision-relevant and expected later. | Deferral register entry. |
| `platform-dependent` | Vision-relevant but blocked on Codex/client support or proof. | Deferral entry + probe criteria. |
| `candidate-after-eval` | Potentially useful but not accepted until evaluation passes. | Evaluation protocol + acceptance criteria. |
| `parked` | Possibly useful, intentionally not prioritized. | Parking entry with revival trigger. |
| `rejected` | Not part of the vision. | Rejection rationale; no seam required unless reversal is plausible. |
| `not-applicable` | Outside the problem domain. | Brief note only. |

RTK currently falls under `evaluation-only`; optional candidate integration is deferred until the evaluation gates pass. It is not a v0.2 candidate install.

## 5. Future-relevance test

A not-now item is vision-relevant if any of these are true:

- implementing v0.2 one way would make it harder later;
- the user has explicitly asked for it as part of the product direction;
- it changes how files, schemas, profiles, hooks, rules, skills, plugins, agents, prompts, or artifacts should be named now;
- it affects context compaction, token efficiency, session handoff, or long-horizon continuity;
- it affects autonomy/safety posture;
- it affects client compatibility across CLI, app, IDE, web, or future clients;
- it affects team/enterprise rollout even if v0.2 is personal/local;
- it affects upgrade/uninstall/manifest behavior;
- it affects how future automation will discover or mutate generated artifacts.

If one of these is true, the item needs a deferral record or an explicit rejection.

## 6. Non-foreclosure design rules

### 6.1 Use registries, IDs, and data models

Prefer stable identifiers over prose-only state:

- `component_id` for installable assets;
- `profile_id` for posture profiles;
- `prompt_id` for compaction prompts;
- `skill_id` for reusable skills;
- `agent_id` for custom agents;
- `policy_id` for hooks/rules/permission bundles;
- `artifact_id` for generated artifacts;
- `deferral_id` for deferred work;
- `client_id` for CLI/app/IDE compatibility;
- `adapter_id` for tool-output compression adapters such as a possible RTK integration.

Stable IDs make future update, diff, enable/disable, UI, telemetry, and automation possible.

### 6.2 Generate candidates before mutation

For sensitive surfaces, v0.2 should generate candidates instead of silently mutating:

- `~/.codex/config.toml`;
- `.codex/config.toml`;
- active hooks/rules;
- project `AGENTS.md`;
- plugin marketplace metadata;
- high-autonomy profiles;
- compaction prompt config;
- any third-party tool integration such as RTK.

Candidate-first behavior keeps v0.3 merge assistants and v0.4 UI wizards possible.

### 6.3 Separate observed, inferred, proposed, and unknown

Every doctor/probe/setup report should distinguish:

- observed file/config state;
- inferred effective behavior;
- proposed changes;
- unknown behavior requiring probe or user confirmation;
- managed or overridden constraints.

Do not collapse these categories into a single confident answer.

### 6.4 Keep adapters separate from core posture

Do not embed third-party tools, client-specific launch wrappers, or experimental platform mechanisms directly into the core model. Represent them as adapters attached to typed seams.

This is especially important for:

- RTK or any command-output compression proxy;
- client-specific app/CLI/IDE launch instructions;
- dynamic posture switching;
- profile-scoped compaction prompt behavior;
- enterprise policy/telemetry.

## 7. Release acceptance gates

Before calling a release complete, answer:

1. What new capabilities are resolved?
2. What remains vision-relevant but not resolved?
3. Does every not-now item have a deferral disposition?
4. Does every deferral have an open seam and non-foreclosure constraint?
5. Did any implementation choice hard-code a future-hostile representation?
6. Can a future maintainer find the decision without this chat?
7. Are there tests or probes for any platform claims that are not directly documented?
8. Are high-autonomy claims paired with recovery/audit controls?

## 8. v0.2-specific completion rule

v0.2 cannot be considered complete unless:

- the deferral register has no duplicate IDs;
- every section of the operational spec that says “deferred” links to a deferral ID;
- RTK is listed only as an evaluation subject unless the evaluation passes;
- compaction prompt overrides are candidate-only unless validated locally;
- profile/scenario recommendations include app-vs-CLI caveats;
- `danger-full-access + auto_review` is described as reviewed unsandboxed operation, not safety.
