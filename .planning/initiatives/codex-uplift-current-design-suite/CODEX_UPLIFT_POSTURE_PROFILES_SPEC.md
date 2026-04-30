# CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md

Date: 2026-04-30

Subject: Candidate posture profiles for `codex-uplift-kit`

## 0. Purpose

This file defines the posture vocabulary v0.2 should expose through candidate config generation. A posture is not just a sandbox setting; it is a combination of sandbox, approval policy, reviewer, network, writable roots, rules/hooks posture, and recovery expectations.

## 1. Core distinction

Sandboxing and approvals are separate controls:

- sandboxing defines what Codex can technically do without crossing an environment boundary;
- approval policy defines when Codex must stop and ask before crossing a boundary or performing an action that needs review;
- auto-review changes who reviews eligible prompts; it does not recreate the sandbox boundary.

Therefore, `danger-full-access + auto_review` should be described as **reviewed unsandboxed operation**, not as sandboxed safety.

## 2. Candidate profiles

v0.2 should generate candidate profiles only. It must not silently make any profile the user's default.

### 2.1 `review-only`

Use for code review, repo exploration, research, and planning.

Expected shape:

```toml
[profiles.review-only]
sandbox_mode = "read-only"
approval_policy = "on-request"
approvals_reviewer = "user"
model_reasoning_effort = "high"
```

### 2.2 `safe-interactive`

Use for normal assisted development with explicit user review.

```toml
[profiles.safe-interactive]
sandbox_mode = "workspace-write"
approval_policy = "on-request"
approvals_reviewer = "user"
allow_login_shell = false

[profiles.safe-interactive.sandbox_workspace_write]
network_access = false
```

### 2.3 `autonomous-audited`

Recommended high-autonomy default candidate.

```toml
[profiles.autonomous-audited]
sandbox_mode = "workspace-write"
approval_policy = "on-request"
approvals_reviewer = "auto_review"
allow_login_shell = false
default_permissions = "codex-uplift-autonomous"

[profiles.autonomous-audited.sandbox_workspace_write]
network_access = false
```

Compensating controls:

- inspect worktree first;
- write plan/validation artifacts;
- use rules for destructive commands;
- keep commits atomic when commits are authorized;
- prepare rollback/checkpoint notes.

### 2.4 `install-window`

Use for dependency/bootstrap work that needs network or cache writes.

Candidate behavior:

- workspace-write;
- auto-review or user-review depending on user preference;
- network enabled only for the window;
- explicit writable roots for package caches if needed;
- generated rollback/cleanup note.

This profile should be suggested before jumping to full access when the issue is package-manager or cache access.

### 2.5 `net-limited`

Use for network-heavy research or tool setup where network is needed but filesystem writes should stay scoped.

Candidate behavior:

- workspace-write or read-only depending on task;
- network enabled;
- rules/hooks around package managers and curl-like commands;
- explicit note that web/source content is untrusted.

### 2.6 `full-access-reviewed`

Use only as an escape hatch for trusted repos, trusted machines, or externally isolated environments.

```toml
[profiles.full-access-reviewed]
sandbox_mode = "danger-full-access"
approval_policy = "on-request"
approvals_reviewer = "auto_review"
allow_login_shell = false
```

Required warning:

```text
This is reviewed unsandboxed operation. It may still route eligible approval prompts to auto-review, rules, hooks, or app/tool policy, but it does not provide sandbox containment. Use only with clean worktree checks, recovery checkpoints, and explicit release/manual gates.
```

### 2.7 `external-isolated`

Use when an outer VM/container/devcontainer is the primary safety boundary.

Candidate behavior:

- may use full access inside the isolated environment;
- must record what isolation boundary exists;
- must record what secrets/network mounts are exposed;
- must not claim safety if the container has sensitive credentials mounted.

### 2.8 `ci-noninteractive`

Use for scripted `codex exec`-style runs where no human approval is possible.

Candidate behavior:

- `approval_policy = "never"` only with strong warning;
- sandbox constrained;
- network off unless CI job requires it;
- output captured to artifacts;
- no release/publish actions without separate CI release gate.

### 2.9 `yolo` / bypass mode

Not a best-practice profile.

The package may document this as a platform capability, but should not recommend it except inside a dedicated externally hardened environment. It should never be silently selected by a candidate generator.

## 3. Phase routing

Profiles should be connected to phases:

| Phase | Preferred posture |
|---|---|
| Unknown repo | `review-only` |
| Planning / AGENTS drafting | `safe-interactive` |
| Normal implementation | `autonomous-audited` |
| Dependency/bootstrap | `install-window` |
| Research/network | `net-limited` |
| Release / remote operations | `safe-interactive` plus manual gates |
| Sandbox-blocked emergency | `full-access-reviewed` |
| Disposable VM/container | `external-isolated` |
| CI | `ci-noninteractive` |

## 4. v0.2 implementation rule

v0.2 must generate candidates and explanations. It must not silently switch the user's active profile or assume the app, CLI, and IDE expose identical UI controls.

## 5. v0.3 seam

v0.2 should keep the posture profile model data-driven so v0.3 can add adaptive recommendation, probes, and per-project phase routing without rewriting the CLI.
