# CODEX_UPLIFT_POSTURE_PROFILES_SPEC.md

Date: 2026-04-30

Subject: Sandbox, approval, permissions, and autonomy profile candidates

## 0. Executive position

Autonomy and safety are not one knob. v0.2 should offer posture profiles that combine sandboxing, approval policy, auto-review, default permissions, rules, hooks, recovery checkpoints, and audit artifacts.

Profiles are generated as **candidates**, not silently applied.

## 1. Controls matrix

| Layer | Helps with | Cannot guarantee |
|---|---|---|
| Sandbox | Filesystem/network containment during command execution. | Decision quality or auditability. |
| Approval policy | Pause points before selected actions. | Containment after approval. |
| Auto-review | Review of eligible approval prompts. | Reviewing actions that do not prompt. |
| Default permissions | Named filesystem/network profile for sandboxed tool calls. | Safety outside its scope. |
| Rules | Command policy outside sandbox. | All semantic risk or every shell wrapper. |
| Hooks | Lifecycle guardrails and context injection. | Complete enforcement boundary. |
| Git checkpoints | Reversibility. | Prevention. |
| Artifacts | Auditability. | Correctness by themselves. |

## 2. Profile catalog

### 2.1 `review-only`

Use for unknown repos, read-only investigation, code review, or planning.

```toml
[profiles.review-only]
approval_policy = "on-request"
approvals_reviewer = "user"
sandbox_mode = "read-only"
model_reasoning_effort = "high"
```

### 2.2 `safe-interactive`

Conservative default for normal development.

```toml
[profiles.safe-interactive]
approval_policy = "on-request"
approvals_reviewer = "user"
sandbox_mode = "workspace-write"
allow_login_shell = false

[profiles.safe-interactive.sandbox_workspace_write]
network_access = false
```

### 2.3 `autonomous-audited`

Recommended high-autonomy default.

```toml
[profiles.autonomous-audited]
approval_policy = "on-request"
approvals_reviewer = "auto_review"
sandbox_mode = "workspace-write"
allow_login_shell = false
default_permissions = "codex-uplift-autonomous"

[profiles.autonomous-audited.sandbox_workspace_write]
network_access = false
```

Compensating controls:

- clean/known worktree gate;
- bounded plan or task contract;
- rules for destructive commands;
- optional hooks for lifecycle checks;
- artifact-first subagent contracts;
- verification log;
- checkpoint branch/stash where appropriate.

### 2.4 `install-window`

Temporary profile for dependency/bootstrap tasks that need network or cache writes.

```toml
[profiles.install-window]
approval_policy = "on-request"
approvals_reviewer = "auto_review"
sandbox_mode = "workspace-write"
allow_login_shell = false

[profiles.install-window.sandbox_workspace_write]
network_access = true
# Add explicit writable roots as needed instead of jumping to danger-full-access.
```

Use this before `full-access-reviewed` when the issue is package-manager/network friction.

### 2.5 `net-limited`

For research or docs-fetching tasks where network is needed but writes should stay bounded.

```toml
[profiles.net-limited]
approval_policy = "on-request"
approvals_reviewer = "auto_review"
sandbox_mode = "workspace-write"
allow_login_shell = false

[profiles.net-limited.sandbox_workspace_write]
network_access = true
```

### 2.6 `full-access-reviewed`

Escape hatch for trusted environments when workspace-write is too restrictive.

```toml
[profiles.full-access-reviewed]
approval_policy = "on-request"
approvals_reviewer = "auto_review"
sandbox_mode = "danger-full-access"
allow_login_shell = false
```

Required warning:

> This is reviewed unsandboxed operation, not sandboxed safety. Auto-review reviews eligible approval prompts; it does not recreate filesystem/network containment. Pair with rules, hooks, checkpoints, clean worktree, and explicit recovery plans.

### 2.7 `external-isolated`

For disposable devcontainers/VMs where the outer environment is the boundary.

```toml
[profiles.external-isolated]
approval_policy = "on-request"
approvals_reviewer = "auto_review"
sandbox_mode = "danger-full-access"
allow_login_shell = false
```

Requires an explicit note naming the external boundary, mounted secrets, network constraints, and rollback method.

### 2.8 `ci-noninteractive`

For automation where prompts cannot be answered.

```toml
[profiles.ci-noninteractive]
approval_policy = "never"
sandbox_mode = "workspace-write"
allow_login_shell = false

[profiles.ci-noninteractive.sandbox_workspace_write]
network_access = false
```

Use only in tightly controlled automation. Do not combine with broad write/network access without explicit policy.

## 3. Named permission candidate

Candidate only:

```toml
[permissions.codex-uplift-autonomous.filesystem.":project_roots"]
"." = "write"
"**/.env" = "none"
"**/.env.*" = "none"
"**/secrets/**" = "none"
"**/.ssh/**" = "none"

[permissions.codex-uplift-autonomous.network]
enabled = false
```

## 4. Shell environment hardening candidate

Candidate only:

```toml
[shell_environment_policy]
inherit = "core"
exclude = ["*TOKEN*", "*SECRET*", "*KEY*", "*PASSWORD*", "*_CREDENTIALS"]
```

Do not force this globally without user review; some toolchains need selected environment variables.

## 5. Phase-to-profile mapping

| Phase | Suggested posture |
|---|---|
| Unknown repo | `review-only` |
| Planning / project AGENTS drafting | `safe-interactive` |
| Normal implementation | `autonomous-audited` |
| Dependency/bootstrap | `install-window` |
| Network-heavy research | `net-limited` |
| Release/remote operations | `safe-interactive` plus stricter rules |
| Sandbox-blocked trusted task | `full-access-reviewed` |
| Disposable VM/container | `external-isolated` |
| CI/noninteractive | `ci-noninteractive` |

## 6. Probe requirements

Before making strong claims about a client/profile combination, record:

- client: CLI/app/IDE;
- version if visible;
- active profile;
- sandbox mode;
- approval mode;
- auto-review setting;
- relevant rules/hooks;
- test action;
- observed outcome.

Do not infer effective safety from config text alone.
