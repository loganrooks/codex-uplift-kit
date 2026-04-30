# Temporary Sketch: Post-Uplift Roadmap

Status: scratch
Authority: working note only
Lifecycle: use after the control-plane uplift to seed formal `ROADMAP.md`, `ACTIVE_WORK.md`, and release planning; then delete or replace
Created: 2026-04-30

## Purpose

Preserve the immediate roadmap shape for after this repo has been slightly uplifted. This keeps the next product-development sequence separate from the work of reorganizing the repo itself.

This is not the formal v0.3 roadmap. Draft the formal roadmap only after the current control-plane and governance docs exist.

## Immediate Sequence After Control-Plane Uplift

1. Confirm the repo boot path works.
   - Future agents can read `.planning/README.md`, current state, active work, and governance without spelunking the old v0.2 design suite.
   - Archive docs are clearly evidence, not current instruction.

2. Audit operating environment surfaces.
   - User-level `AGENTS.md` is portable and high quality.
   - Project-level `AGENTS.md` routes to current planning/governance docs and local verification commands.
   - Auto-compaction prompt is installed as a prompt file, and any active config selection is explicit and user-approved.

3. Draft formal v0.3 roadmap using the new control-plane docs.
   - Use the scratch vision and plan as inputs, not as authority.
   - Capture v0.3 as the base project-uplift kernel, not a domain-pack explosion.

4. Create a formal v0.3 active work package.
   - Define scope, write set, verification gates, stop conditions, and release boundaries.
   - Keep any old v0.2 documents referenced only as archive evidence.

## Likely v0.3 Theme

Establish the base project-uplift kernel and dogfood it in this repo.

v0.3 should make the project control plane reproducible and checkable. It should not try to solve every domain or ship a full plugin ecosystem.

## Candidate v0.3 Workstreams

1. `artifact check`
   - Validate planning/current/governance structure.
   - Detect missing current docs.
   - Detect archived docs being referenced as current.
   - Check artifact lifecycle metadata where required.

2. Structured `project inspect`
   - Replace loose observations with structured output.
   - Separate observed facts, inferences, recommendations, and unknowns.
   - Support project complexity and closure-target detection.

3. `governance init`
   - Materialize base governance docs and current-doc skeletons.
   - Keep generated docs reviewable and safe.
   - Avoid overwriting existing project docs.

4. Pack manifest schema
   - Define `base-control-plane` first.
   - Express roles, workflows, artifacts, gates, prompts, and prerequisites.
   - Keep plugins as future distribution, not the initial abstraction.

5. `pack recommend --dry-run`
   - Recommend packs from observed repo evidence.
   - Explain confidence and evidence.
   - Do not install automatically without user approval.

6. Dogfood `agent-tooling`
   - Use this repo as the first specialized pack.
   - Capture npm/open-source/package/release concerns without generalizing too early.

## Explicit Deferrals

Do not start these until the base kernel is working:

- full domain packs for game, SaaS, social app, MCP server, research platform, investor MVP;
- plugin marketplace ecosystem for packs;
- active config merge into live `config.toml`;
- live user-home install mutation without explicit approval;
- automatic role routing without artifact/gate checks;
- RTK/tool-output filtering integration beyond evaluation;
- broad archive reshuffling before current docs and governance are live.

## Suggested Version Shape

Possible sequence:

```text
0.2.1-alpha.0
  terminology/path fixes, compaction prompt install path, README/plugin metadata cleanup

0.3.0-alpha.0
  base project-uplift kernel: current docs, governance init, artifact check, structured project inspect

0.3.1-alpha.0
  pack manifest schema and base-control-plane pack

0.4.0-alpha.0
  first non-software-delivery proving pack, likely research-audit

0.5+
  MCP/server, SaaS, game, investor-MVP, and other domain packs after base patterns hold
```

## Release Boundaries

Before any next release:

- run `npm run release:check`;
- verify package allowlist;
- run temp-home install/smoke paths;
- run published-package smoke only after publication;
- do not tag, publish, push a release, or mutate live user config without explicit user approval.

## Inputs For Formal Roadmap

Use these scratch docs as inputs:

- `uplift-control-plane-plan.md`
- `uplift-long-term-vision.md`
- this file

Also use:

- current `STATE.md` once created;
- v0.2 release feedback;
- local-install artifact investigation;
- deferral register from archived v0.2 suite;
- any live Codex plugin/config feedback gathered later.
