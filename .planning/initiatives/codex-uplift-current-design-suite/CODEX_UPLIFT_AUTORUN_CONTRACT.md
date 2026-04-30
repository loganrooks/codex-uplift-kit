# CODEX_UPLIFT_AUTORUN_CONTRACT.md

Date: 2026-04-30

Subject: Automatic execution contract for a Codex orchestrator implementing `codex-uplift-kit`

## 0. Purpose

This file answers: “Can the Codex orchestrator run automatically and produce the v0.2 work?”

Answer: **Yes, for implementation and release-candidate preparation, within the boundaries below. No, for final publication or irreversible user-environment changes.**

## 1. Allowed automatic work

The orchestrator may automatically:

- inspect the repo and planning suite;
- create `.codex-uplift/` planning and validation artifacts;
- modify package source files;
- modify package templates;
- add tests;
- run local verification commands;
- generate candidate config/hook/rule/profile files;
- run temp-home install tests;
- create package-local manifests;
- update suite docs when implementation reality changes;
- prepare release-candidate review artifacts;
- create local commits if the user has explicitly authorized commits for this run.

## 2. Manual approval gates

The orchestrator must stop and ask before:

- publishing to npm;
- creating or pushing a git tag;
- creating a public GitHub release;
- pushing to a remote branch;
- enabling hooks, rules, full-access profiles, or telemetry in a real user home config;
- editing real `~/.codex/config.toml` outside a candidate/backup workflow;
- deleting existing user config or package-unowned files;
- using destructive git commands;
- moving from v0.2 implementation to v0.3 implementation;
- claiming a release is final.

## 3. Default implementation posture

Recommended default for the orchestrator:

```text
autonomous-audited implementation inside the package repo
```

Meaning:

- bounded write scope to the repo;
- inspect first;
- preserve dirty worktree state;
- write durable artifacts;
- run tests;
- make changes in reviewable slices;
- do not publish or mutate real user config;
- record all deferrals.

If the user runs Codex with `danger-full-access + auto_review`, treat that as **reviewed unsandboxed operation**, not sandboxed safety. Use additional compensating controls: clean worktree checks, explicit write set, tests, release gates, and no real-home config mutation unless explicitly requested.

## 4. Required pre-implementation gate

Before editing implementation code, produce:

```text
.codex-uplift/implementation-observations.md
.codex-uplift/v0.2-scope-map.md
.codex-uplift/v0.2-implementation-plan.md
.codex-uplift/v0.2-deferral-check.md
.codex-uplift/validation-log.md
```

These artifacts are not optional ceremony. They prevent long-horizon context loss and make the orchestrator’s work auditable after compaction.

## 5. Automatic v0.2 completion definition

The orchestrator may say “v0.2 release candidate prepared” only after:

- all v0.2 required capabilities are implemented or explicitly deferred;
- all deferrals have target horizons and preserved seams;
- tests pass or failures are recorded with reason and impact;
- package dry-run is inspected;
- temp install is verified;
- `CODEX_UPLIFT_STATE.md` and `CODEX_UPLIFT_ROADMAP.md` are updated;
- `.codex-uplift/release-candidate-review.md` exists;
- release commands are staged as instructions, not executed.

## 6. What “automatic through v0.2” does not mean

It does not mean:

- publish automatically;
- trust every generated profile;
- enable hooks/rules by default;
- install RTK;
- switch compaction prompts silently;
- mutate a user’s live Codex setup;
- skip review because tests passed;
- collapse v0.3 into v0.2.

## 7. v0.3 handoff behavior

At the end of v0.2, the orchestrator should produce:

```text
.codex-uplift/v0.3-handoff.md
```

Minimum contents:

- v0.3 candidate capabilities;
- v0.2 seams preserved;
- unresolved empirical questions;
- recommended first v0.3 slice;
- release feedback to gather before v0.3;
- whether v0.3 should wait for user/npm adoption data.

The orchestrator must not begin v0.3 implementation unless the user explicitly authorizes it after reviewing the v0.2 release-candidate checkpoint.

## 8. Token/context efficiency requirements during autorun

The orchestrator must reduce context rot by:

- keeping durable state in files, not only chat;
- writing concise validation logs after each verification batch;
- using artifact paths rather than raw log dumps in final summaries;
- keeping subagent returns short and artifact-backed;
- periodically updating `.codex-uplift/current-focus.md` if the session becomes long;
- avoiding repeated full-file dumps when a diff or path summary is sufficient;
- preserving decisions and deferrals in durable docs before relying on compaction.

## 9. Subagent authorization

This suite authorizes bounded subagents when a workflow contract requires them. Each delegated task must specify:

- task boundary;
- allowed write scope;
- artifact path;
- expected return shape;
- verification performed;
- disposition by orchestrator: `accept`, `revise`, `park`, or `reject`.

The orchestrator should use subagents for read-only evidence gathering, test review, or artifact review when it improves quality. It should not delegate overlapping write-heavy edits into an unresolved mixed worktree.

## 10. Auto-run prompt

A user may use this prompt:

```text
You may run automatically through the v0.2 implementation and release-candidate preparation under CODEX_UPLIFT_AUTORUN_CONTRACT.md.

Do not publish to npm, create/push git tags, push a remote branch, enable real user-home hooks/rules/full-access profiles, or move to v0.3 without my explicit approval.

Start by creating the required .codex-uplift planning artifacts. Keep STATE and ROADMAP updated. Use candidate files for config, hooks, rules, profiles, project setup, compaction prompts, and RTK evaluation. Prepare a release-candidate review at the end.
```
