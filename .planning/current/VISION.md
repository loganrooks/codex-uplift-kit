# Vision

Status: current
Last updated: 2026-04-30

## Long-Horizon Direction

Codex Uplift should help a solo developer and AI agents work like a coherent,
disciplined project team. It should install useful Codex assets, organize
current project truth, select right-sized workflows, and enforce artifact-driven
guardrails from a first audit through long-horizon product development.

The product should not merely copy templates. It should help create a project
environment where agents can:

- understand what the project is and what it is trying to become;
- distinguish current truth from historical evidence;
- choose a workflow that fits the project type, maturity, and closure target;
- use bounded roles and durable artifacts instead of improvised context;
- keep safety, verification, release, and handoff gates explicit;
- scale process only when project complexity requires it.

## Product Thesis

The universal part of uplift is the development operating system around the
project, not the project-specific domain answer.

Quasi-universal surfaces:

- project orientation;
- current state;
- active work;
- artifact lifecycle;
- decision records;
- role contracts;
- verification gates;
- handoff;
- closure targets;
- archive policy;
- safe install and config boundaries.

Project-specific surfaces:

- domain model;
- target user;
- business model;
- MVP definition;
- research method;
- game loop;
- monetization strategy;
- release or report strategy;
- evaluation criteria;
- the local definition of good work.

The CLI should make deterministic structure reproducible. Agents should
interpret evidence and draft project-specific candidates. The user should make
product, risk, and activation decisions.

## Complexity Model

Projects should gain process only when they need it.

- Level 0: quick task.
- Level 1: bounded audit or research.
- Level 2: small software change.
- Level 3: MVP or product slice.
- Level 4: long-horizon product.
- Level 5: ecosystem or platform.

The base system should require a closure target, not always a roadmap. Closure
targets may include a release, report, demo, prototype, pitch, migration, audit,
decision memo, playtest build, or investor MVP.

## Architecture Direction

Use this conceptual split:

- kernel: base project control plane and deterministic checks;
- pack: local bundle of roles, workflows, artifacts, prompts, and gates;
- plugin: later distribution mechanism for stable packs.

Do not let plugin packaging become the product model. The product model is the
control plane, packs, checks, and agent workflows.

## Pushbacks Preserved

- Do not build domain packs before the base operating model is clean.
- Do not silently modify active config.
- Do not use `candidate` as a vague bucket for every generated artifact.
- Do not make every project use a roadmap.
- Do not overfit this product to GSD.
- Do not ship a large role taxonomy before role contracts.
- Do not treat docs organization as cosmetic.
