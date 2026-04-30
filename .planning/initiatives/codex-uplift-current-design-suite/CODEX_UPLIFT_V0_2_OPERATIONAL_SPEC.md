# CODEX_UPLIFT_V0_2_OPERATIONAL_SPEC.md

Date: 2026-04-30

Subject: Operational design for a flexible, auditable Codex setup kit

## 0. Executive position

`codex-uplift-kit` should evolve from a static bootstrap bundle into a small **Codex setup assistant**.

This is not a product-category change imposed by the review. The user's framing already implied a broader setup/onboarding system: user-level posture, project-level initialization, reusable skills, custom agents, optional hooks/rules, config profiles, permissions/sandboxing guidance, and high-autonomy modes with compensating controls. v0.1 was a conservative bootstrap slice of that larger direction. The review is useful because it makes the mismatch explicit and identifies the maturity gaps that must be closed for v0.2.

The follow-up discussion adds a stronger requirement: users need selectable **autonomy postures**, including a high-autonomy posture that still uses every available mitigation layer.

The product should not frame the problem as:

```text
safe but annoying sandbox vs unsafe but autonomous full access
```

The better frame is:

```text
bounded autonomy first, full-access escape hatch second, empirical local probes always.
```

That means v0.2 should provide:

- install modes;
- component selection;
- config inspection and candidate generation;
- project-specific config determination;
- explicit autonomy profiles;
- optional hook and rule candidates;
- local behavior probes;
- manifests for status, upgrade, and uninstall;
- clear documentation of what each layer can and cannot enforce.

### 0.1 Output status note

This document is part of a suite. It should not carry every design concern inline. Deferrals belong in `CODEX_UPLIFT_ROADMAP_DEFERRAL_REGISTER.md`; future seams belong in `CODEX_UPLIFT_ARCHITECTURE_SEAMS.md`; token/context policy belongs in `CODEX_UPLIFT_CONTEXT_EFFICIENCY_STRATEGY.md`; compaction prompt details belong in `CODEX_UPLIFT_COMPACTION_PROMPT_STRATEGY.md`; RTK belongs in `CODEX_UPLIFT_RTK_EVALUATION_PROTOCOL.md` until it passes evaluation.


---

## 1. Separate the different kinds of review/pushback points

The review should not be treated as a flat list of bugs. Different points belong to different categories and require different remedies.

| Category | Meaning | Examples | Correct response |
|---|---|---|---|
| Implementation defect | Concrete package behavior likely to break | plugin marketplace path, duplicate skill names, `.DS_Store` copied | fix in code and tests |
| Safety-contract gap | Installer avoids overwrites but does not explain current state enough | no inventory of existing config, hooks, skills, agents, plugins | add `inspect`, `doctor`, manifest, candidate reports |
| Product-contract gap | User-facing modes are underspecified | classic vs plugin vs hybrid; which hooks/agents/skills to install | add install modes and component flags |
| Autonomy-design gap | Package lacks a serious model for high autonomy | no `autonomous-audited`; no install-window; no full-access escape profile | add posture candidates and risk docs |
| Platform-modeling correction | A claim must be aligned with current Codex docs | hooks are Codex-native but limited; `--full-auto` is not danger-full-access; auto-review is not sandboxing | correct the model and cite docs |
| Documentation calibration | Wording could imply false enforcement | “hooks protect you” or “full access with auto-review is safe” | rewrite with capability boundaries |
| Empirical unknown | Exact local behavior depends on installed app/CLI/config | what prompts under `danger-full-access + auto_review` | add local non-destructive probes |
| Reviewer-missed gap | Important issue not fully surfaced in the review | per-project config determiner, project phase postures, uninstall/upgrade, rules, default permissions | add to v0.2 roadmap |

This taxonomy prevents overcorrection. The v0.1 package was a conservative bootstrap scaffold. The v0.2 package should become a setup assistant.

---

## 2. The core safety/autonomy model

### 2.1 Layers

The package should explain Codex control surfaces as layers:

| Layer | Good for | Not good for |
|---|---|---|
| Home `AGENTS.md` | portable behavior posture | hard enforcement |
| Project `AGENTS.md` | repo-specific instructions, commands, failure modes | global doctrine |
| Skills | reusable workflows with progressive disclosure | always-on constraints |
| Custom agents | specialized subagent roles | guaranteed quality without review |
| Config profiles | sandbox, approvals, reviewer, network, model, permissions posture | project-specific doctrine |
| `default_permissions` | named filesystem/network permissions for sandboxed tool calls | replacing sandbox/approval policy |
| Rules | command policy for commands Codex wants to run outside the sandbox | general host isolation or semantic reasoning |
| Hooks | lifecycle guardrails and deterministic checks | complete security boundary |
| Tests/CI | executable verification | replacing judgment |
| Artifacts | audit trail and reviewability | private chain-of-thought dump |
| Git checkpoints | rewindability and review slices | protection from all destructive host actions |

### 2.2 Answer to the full-access + auto-review question

The user is right about one important thing: **permissions and sandboxing are not mutually exclusive.** A command can be outside a sandbox boundary and still be affected by approval policy, rules, hooks, app/MCP tool annotations, or managed policy.

But there is also a real boundary difference:

- `sandbox_mode = "workspace-write"` creates a filesystem/network boundary. Crossing that boundary can trigger an approval path.
- `sandbox_mode = "danger-full-access"` removes that filesystem/network boundary.
- `approvals_reviewer = "auto_review"` changes who reviews eligible approval prompts. It does not recreate the sandbox boundary, and it does not review actions that are already allowed by the active configuration.

Therefore:

```text
Full access + auto-review can mitigate risks that become approval prompts.
It is not equivalent to sandboxed autonomy.
```

The right product stance is:

1. make `workspace-write + auto_review` less annoying through named permissions, writable roots, network profiles, rules, and hooks;
2. provide `danger-full-access + auto_review` as an explicit escape hatch;
3. require local probes before making confident claims about what will prompt, auto-review, block, or execute silently.

---

## 3. Install modes

The package should support multiple install contracts.

### 3.1 `classic`

Default mode.

Installs or writes candidates for:

- `~/.codex/AGENTS.md`;
- standalone user skills under `~/.agents/skills`;
- custom agent templates under `~/.codex/agents`;
- hook scripts and `hooks.json.sample`;
- rule samples under `~/.codex/rules/*.rules.sample`;
- config candidates;
- install manifest.

Does not install plugin skills.

### 3.2 `plugin`

Installs or writes candidates for:

- `~/.codex/AGENTS.md`;
- custom agent templates;
- hook/rule samples;
- config candidates;
- plugin tree;
- plugin marketplace candidate;
- manifest.

Skips standalone skills by default to avoid duplicate discovery.

### 3.3 `hybrid`

Installs both standalone skills and plugin skills only with explicit opt-in:

```bash
codex-uplift-init install --mode hybrid --allow-duplicate-skills
```

The installer must print duplicate skill names and the likely ambiguity.

### 3.4 `minimal`

Installs only:

- home `AGENTS.md` candidate;
- config candidate docs;
- manifest.

No skills, agents, hooks, rules, or plugins.

### 3.5 `doctor-only`

Writes no setup files by default. Inspects current user and project setup and produces a report.

---

## 4. Component selection

Users should be able to decide which surfaces to install.

Recommended CLI:

```bash
codex-uplift-init install --mode classic
codex-uplift-init install --mode plugin
codex-uplift-init install --mode minimal
codex-uplift-init install --components home-agents,skills,agents,hook-samples,rule-samples,config-candidates
codex-uplift-init install --only config-candidates
codex-uplift-init install --skip hooks,rules,agents
codex-uplift-init install --hooks samples
codex-uplift-init install --hooks none
codex-uplift-init install --skills standalone
codex-uplift-init install --agents core
```

Component matrix:

| Component | Default | Notes |
|---|---:|---|
| `home-agents` | yes | candidate-first if existing file exists |
| `skills` | yes in classic | skipped in plugin mode |
| `plugin` | no unless plugin mode | avoid accidental duplicate skills |
| `agents` | yes | allow `none`, `core`, `all` |
| `hook-samples` | yes | inactive scripts and sample config |
| `active-hooks` | no | explicit opt-in only |
| `rule-samples` | yes | inactive samples |
| `active-rules` | no | explicit opt-in only |
| `config-candidates` | yes | write candidate TOML, do not merge silently |
| `project-candidates` | no | only under project commands |
| `manifest` | yes | required for status, upgrade, uninstall |

---

## 5. Inspect, doctor, manifest, status, upgrade, uninstall

### 5.1 `inspect`

Read-only inventory:

```bash
codex-uplift-init inspect
```

Should report:

- resolved `CODEX_HOME`;
- whether `~/.codex/AGENTS.md` or `AGENTS.override.md` exists;
- `~/.codex/config.toml` presence and important keys;
- configured profiles;
- `approval_policy`, `approvals_reviewer`, `sandbox_mode`;
- `sandbox_workspace_write.network_access` and writable roots;
- `default_permissions` and named permissions profiles;
- hooks and whether hooks are feature-enabled;
- rules files;
- custom agents;
- user skills;
- plugin marketplace entries;
- project trust entries if visible;
- package manifest status.

### 5.2 `config doctor`

```bash
codex-uplift-init config doctor
```

Should report observed state and likely concerns, not pretend to compute the entire effective config unless it truly implements Codex precedence.

Examples:

```text
Observed:
- sandbox_mode = danger-full-access
- approvals_reviewer = auto_review
- approval_policy = on-request
- hooks feature disabled
- no rules files found

Interpretation:
- auto_review can review eligible prompts.
- danger-full-access removes filesystem/network sandbox boundaries.
- there are no local rules/hook guardrails to catch obvious destructive commands.

Suggested candidate:
- generate autonomous-audited for default work;
- generate full-access-reviewed as escape hatch;
- generate destructive-command rule sample;
- run local prompt-behavior probe.
```

### 5.3 Manifest

The installer should record:

```json
{
  "package": "codex-uplift-kit",
  "version": "0.2.0",
  "installed_at": "2026-04-30T00:00:00Z",
  "files": [
    { "path": "~/.codex/AGENTS.md", "status": "installed", "sha256": "..." },
    { "path": "~/.codex/hooks/pretool-protect-git.mjs", "status": "installed", "sha256": "..." }
  ]
}
```

Then support:

```bash
codex-uplift-init status
codex-uplift-init diff --against latest
codex-uplift-init upgrade --candidate-only
codex-uplift-init uninstall --dry-run
```

Uninstall must not delete user-modified files silently.

---

## 6. Config posture candidates

The package should not only offer “permission presets.” It should offer **posture candidates**: named bundles of sandbox, approval policy, reviewer mode, default permissions, network posture, hooks/rules recommendations, and intended use.

### 6.1 Posture family

| Posture | Intended use | Sandbox | Approval | Reviewer | Network | Stance |
|---|---|---|---|---|---|---|
| `review-only` | unknown repo audit | `read-only` | `on-request` | user or auto | off/cached | safest review |
| `safe-interactive` | normal work | `workspace-write` | `on-request` | user | off | baseline |
| `autonomous-audited` | trusted repo implementation | `workspace-write` | `on-request` or granular | `auto_review` | off by default | recommended high-autonomy default |
| `install-window` | package installs/bootstrap | `workspace-write` | `on-request` or granular | `auto_review` | on / limited | temporary widened mode |
| `net-limited` | network work with scoped domains | `workspace-write` | granular | `auto_review` | limited proxy | candidate-only |
| `full-access-reviewed` | tasks that cannot run sandboxed | `danger-full-access` | `untrusted`, `on-request`, or granular | `auto_review` | host/full | escape hatch |
| `ci-noninteractive` | isolated automation | `workspace-write` or `read-only` | `never` | none | off/limited | warning-heavy |
| `yolo` | bypass approvals and sandbox | bypass | none | none | host/full | do not package as normal preset |

### 6.2 Recommended high-autonomy default: `autonomous-audited`

This is the package’s answer to “I want autonomy, but I do not want YOLO.”

```toml
# Candidate only. Review before merging.
# Intended for trusted, version-controlled repositories.

[profiles.autonomous-audited]
sandbox_mode = "workspace-write"
approval_policy = "on-request"
approvals_reviewer = "auto_review"
default_permissions = "uplift_autonomous"
allow_login_shell = false
web_search = "cached"

[profiles.autonomous-audited.sandbox_workspace_write]
network_access = false

[permissions.uplift_autonomous.filesystem]
glob_scan_max_depth = 4

[permissions.uplift_autonomous.filesystem.":project_roots"]
"." = "write"
"**/.env" = "none"
"**/.env.*" = "none"
"**/*.pem" = "none"
"**/*secret*" = "none"
"**/*token*" = "none"

[permissions.uplift_autonomous.network]
enabled = false
```

Important caveat: `default_permissions` applies to sandboxed tool calls. It should not be sold as a substitute for sandboxing.

### 6.3 Temporary dependency/bootstrap mode: `install-window`

Many tasks that feel like they “need full access” actually need network access and a few cache/toolchain writable roots.

```toml
# Candidate only. Replace USER with the actual home directory.

[profiles.install-window]
sandbox_mode = "workspace-write"
approval_policy = "on-request"
approvals_reviewer = "auto_review"
default_permissions = "uplift_install"
allow_login_shell = false
web_search = "cached"

[profiles.install-window.sandbox_workspace_write]
network_access = true
writable_roots = [
  "/Users/USER/.cache",
  "/Users/USER/.npm",
  "/Users/USER/.cargo",
  "/Users/USER/.local",
  "/Users/USER/Library/Caches"
]

[permissions.uplift_install.filesystem]
glob_scan_max_depth = 4

[permissions.uplift_install.filesystem.":project_roots"]
"." = "write"
"**/.env" = "none"
"**/.env.*" = "none"
"**/*secret*" = "none"

[permissions.uplift_install.network]
enabled = true
mode = "limited"
```

This is probably the right answer to much approval fatigue: widen the workspace sandbox where the task actually needs widening, rather than moving directly to full access.

### 6.4 Full-access escape hatch: `full-access-reviewed`

```toml
# ESCAPE HATCH CANDIDATE ONLY.
# This removes filesystem/network sandbox boundaries.
# auto_review reviews eligible approval prompts; it does not recreate sandbox containment.

[profiles.full-access-reviewed]
sandbox_mode = "danger-full-access"
approval_policy = "untrusted"
approvals_reviewer = "auto_review"
allow_login_shell = false
web_search = "cached"
```

This should be paired with:

- rules that prompt/forbid destructive commands;
- active or sample hooks for destructive shell/Git patterns;
- a clean version-controlled branch;
- a checkpoint commit before risky work;
- an outer isolation boundary when feasible: devcontainer, disposable worktree, VM, or CI runner;
- a local prompt-behavior probe.

### 6.5 Granular approval candidate

A future profile could use granular approval policy instead of `on-request` or `untrusted`:

```toml
[profiles.autonomous-granular]
sandbox_mode = "workspace-write"
approvals_reviewer = "auto_review"
approval_policy = { granular = {
  sandbox_approval = true,
  rules = true,
  mcp_elicitations = true,
  request_permissions = true,
  skill_approval = true
} }
```

The package should generate this as a candidate, not a default, because granular policy semantics should be tested against the user’s installed Codex build and actual workflow.

---

## 7. App vs CLI handling

The package must support both the Codex app and the CLI.

### 7.1 App

The Codex app exposes product-facing permission choices such as:

- default permissions;
- auto-review permissions;
- full access;
- custom configuration loaded from config.

The package should provide app-facing docs:

```text
Use Custom/config-backed mode to use named profiles from ~/.codex/config.toml.
Treat the app's Full access mode as the full-access escape posture.
Treat Auto-review as reviewer selection for eligible prompts, not as a sandbox substitute.
```

### 7.2 CLI

The CLI has explicit flags and profiles:

```bash
codex --profile autonomous-audited
codex --profile install-window
codex --profile full-access-reviewed
codex --sandbox workspace-write --ask-for-approval on-request
codex --sandbox danger-full-access --ask-for-approval untrusted -c approvals_reviewer='"auto_review"'
codex --full-auto
codex --dangerously-bypass-approvals-and-sandbox
```

Important distinction:

```text
--full-auto = workspace-write + on-request.
It is not danger-full-access.
```

### 7.3 CLI wrapper option

The package can offer:

```bash
codex-uplift run --posture autonomous-audited
codex-uplift run --phase install
codex-uplift run --phase implementation --print-command
```

This wrapper should print the exact `codex` command it will run, unless `--quiet` is explicitly requested. It should not silently choose `danger-full-access`.

---

## 8. Project-specific config determiner

The package should have a project config determiner analogous to the project `AGENTS.md` initialization skill.

### 8.1 Command surface

```bash
codex-uplift-init project inspect
codex-uplift-init project agents draft
codex-uplift-init project config determine --phase implementation
codex-uplift-init project config candidate --phase implementation
codex-uplift-init project hooks candidate --preset baseline-guardrails
codex-uplift-init project rules candidate --preset destructive-guard
codex-uplift-init project doctor
```

### 8.2 Generated artifacts

Candidate project setup should write artifacts before changing config:

```text
.codex-uplift/project-config/observations.md
.codex-uplift/project-config/proposal.md
.codex/config.toml.candidate.<timestamp>
.codex/hooks.json.sample
.codex/rules/uplift.rules.sample
```

### 8.3 Inputs to inspect

The determiner should inspect:

- version control presence and cleanliness;
- existing root and nested `AGENTS.md` files;
- existing `.codex/` config, hooks, rules;
- package manager files and cache needs;
- test/build commands;
- Docker/devcontainer/toolchain hints;
- secret-bearing files and environment patterns;
- generated-output paths;
- remote/push/release conventions;
- project maturity: prototype vs mature org repo;
- existing project trust status when visible.

### 8.4 Phase-specific postures

| Phase | Suggested posture | Why |
|---|---|---|
| discovery/review | `review-only` | avoid accidental writes in unknown repo |
| planning | `safe-interactive` | allow planning artifacts, not broad execution |
| implementation | `autonomous-audited` | bounded high-autonomy default |
| dependency/bootstrap | `install-window` | package installs, caches, network |
| release/PR | `safe-interactive` with stronger rules | remote/push/rebase boundaries |
| emergency/escape | `full-access-reviewed` | only when sandbox blocks necessary work |
| CI | `ci-noninteractive` | only in isolated automation |

### 8.5 Project config precedence caveat

Project `.codex/config.toml` can override user config when the project is trusted. Project config is loaded from project root toward the working directory, with closer files winning on key conflicts. If the project is untrusted, project `.codex/` config, hooks, and rules are ignored; user/system layers still load.

Therefore the determiner should write candidates and ask the user to trust/review before assuming project-local settings will be active.

---

## 9. Auto-mechanism design

The user asked whether we can implement an auto-mechanism like auto-routing for permission requests, but for sandboxing / posture selection.

The answer is: **yes, but not as a magic mid-turn sandbox switcher.**

### 9.1 What is feasible and robust

#### A. Pre-session posture router

A CLI wrapper can inspect the repo/task and choose a profile before starting Codex:

```bash
codex-uplift route --phase implementation --explain
codex-uplift route --phase install --print-command
codex-uplift run --auto-posture
```

It can classify:

- clean vs dirty worktree;
- unknown vs trusted repo;
- write scope;
- network/dependency need;
- release/remote operations;
- secrets present;
- generated output / contract surfaces;
- project maturity.

Then it can recommend or launch:

```text
review-only -> safe-interactive -> autonomous-audited -> install-window -> full-access-reviewed
```

This is the most robust mechanism because sandbox/config posture is normally selected at session start.

#### B. Project config determiner

For repeated work in a repo, generate `.codex/config.toml` candidates and project-local rules/hooks. This lets a trusted repo carry its own posture.

#### C. In-session guardrails

During a session, rules/hooks can react to concrete commands or approval events:

- rules can allow/prompt/forbid commands outside the sandbox;
- `PreToolUse` hooks can block some tool calls before execution;
- `PermissionRequest` hooks can shape/deny/annotate approval requests;
- `Stop` hooks can enforce final-response/audit-shape requirements.

#### D. Agent workflow gates

Skills can require reflection/checkpoint gates:

- create/update plan artifact before implementation;
- create checkpoint commit before high-risk changes;
- pause before schema/API/security/release changes;
- run verification before final;
- disposition subagent artifacts before integration.

### 9.2 What is less robust

#### Dynamic sandbox switching mid-task

The package should not promise to automatically change sandbox mode mid-task unless Codex exposes a supported mechanism for doing that. The app/CLI may let the user switch permissions interactively, but a package should not rely on an undocumented ability to mutate a running session’s sandbox posture.

A safer design is:

```text
choose the narrowest viable profile up front;
use scoped writable roots/network for known needs;
use rules/hooks for concrete risky operations;
escalate to a new full-access-reviewed session only when necessary.
```

### 9.3 Decision algorithm

A router can use a conservative decision tree:

```text
If repo is unknown or not version-controlled:
  review-only.

If task is planning/docs only:
  safe-interactive.

If task is ordinary implementation in trusted clean repo:
  autonomous-audited.

If task requires package installs, dependency resolution, toolchain caches, or network:
  install-window.

If task requires writes outside repo that can be represented as writable_roots:
  generate a workspace-write candidate with those roots.

If task requires broad host access that cannot be scoped:
  full-access-reviewed, with warning, probe, and checkpoint.

Never automatically choose yolo.
```

### 9.4 Evidence artifact

The router should produce:

```text
.codex-uplift/posture/2026-04-30-recommendation.md
```

Containing:

- observed signals;
- inferred task phase;
- recommended profile;
- alternatives considered;
- risks;
- required rules/hooks/checkpoints;
- exact CLI/app instructions.

---

## 10. Hooks and rules strategy

### 10.1 Hooks

Install hook **samples** by default, not active hooks.

Recommended hook presets:

```bash
codex-uplift-init hooks candidate --preset passive-audit
codex-uplift-init hooks candidate --preset destructive-guard
codex-uplift-init hooks candidate --preset permission-review
codex-uplift-init hooks enable --preset destructive-guard --write-active-hooks
```

Sample hooks:

- `session-start-posture-summary`: prints current profile and project setup notes;
- `userprompt-secret-scan`: warns when prompt appears to contain secrets;
- `pretool-protect-git`: blocks obvious destructive shell/Git commands;
- `permissionrequest-risk-note`: adds structured risk context or denial for high-risk approvals;
- `posttool-artifact-reminder`: reminds when durable artifact is expected but missing;
- `stop-audit-shape`: optional final response shape check.

Caveat: hooks are lifecycle guardrails. They are not a complete enforcement boundary.

### 10.2 Rules

Rules are useful for commands Codex wants to run outside the sandbox. They should be generated as candidates and tested with `codex execpolicy check`.

Recommended sample rules:

```python
prefix_rule(
    pattern = ["git", "push", "--force"],
    decision = "forbidden",
    justification = "Force-push requires explicit user instruction outside the uplift default."
)

prefix_rule(
    pattern = ["git", "reset", "--hard"],
    decision = "prompt",
    justification = "Destructive reset must be reviewed."
)

prefix_rule(
    pattern = ["rm", "-rf", "/"],
    decision = "forbidden",
    justification = "Root deletion is never part of normal development work."
)

prefix_rule(
    pattern = ["npm", "install"],
    decision = "prompt",
    justification = "Dependency installation changes network/package state."
)
```

The package should include `match` and `not_match` examples in actual rules files so Codex validates them at load time.

---

## 11. Local prompt-behavior probe

The safest response to questions like “does full-access + auto-review actually mitigate risk?” is a local probe.

### 11.1 Command surface

```bash
codex-uplift-init config probe --profile autonomous-audited
codex-uplift-init config probe --profile full-access-reviewed
codex-uplift-init project probe --phase implementation
```

### 11.2 Probe output

The probe should create an artifact:

```text
.codex-uplift/probes/2026-04-30-full-access-reviewed.md
```

Classifying controlled actions as:

- denied by sandbox;
- blocked by rule;
- blocked by hook;
- routed to user approval;
- routed to auto-review;
- executed without approval;
- impossible to classify.

### 11.3 Probe cases

Use non-destructive cases:

- read file inside project;
- write temp file inside project;
- attempt to write a temp file outside project;
- attempt network call to a benign endpoint;
- trigger a sample rule command like `git reset --hard --dry-run` or a harmless synthetic command if possible;
- try reading a fake `.env.test` in a throwaway project;
- run `codex execpolicy check` against rule samples.

### 11.4 Important limitation

Some prompt behavior can only be observed from inside an actual Codex app/CLI session, because an external installer cannot fully simulate the agentic approval path. The package should be honest: it can generate probe plans and rule checks; the user or orchestrator may need to run them inside Codex to capture real behavior.

---

## 12. Skills and custom agents

### 12.1 Skills

Recommended v0.2 skills:

- `codex-project-agents-init`: derive project `AGENTS.md` from evidence;
- `codex-audit-artifacts`: create plan/spec, rationale, verification, decision, and handoff artifacts;
- `codex-delegation-contract`: produce artifact-first subagent contracts;
- `codex-retrospective-update`: decide whether a repeated failure belongs in home `AGENTS.md`, project `AGENTS.md`, skill, hook, rule, config, test, or CI;
- `codex-config-posture`: inspect and propose user/project config profiles;
- `codex-local-probe`: guide local sandbox/approval/auto-review probes;
- `codex-checkpoint`: create safe git checkpoint/branch/commit plans before high-risk work.

### 12.2 Custom agents

Recommended custom agents:

- `evidence_explorer`: read-only repo/document explorer;
- `artifact_writer`: bounded artifact writer;
- `artifact_reviewer`: read-only reviewer for drafts/diffs/artifacts;
- `config_doctor`: read-only Codex config reviewer;
- `permission_probe_reviewer`: summarizes local probe results;
- `subagent_disposition_reviewer`: helps classify delegated work as accept/revise/park/reject.

### 12.3 Delegation rule to preserve

```text
When a user invokes a workflow, skill, or contract whose contract requires subagents,
that invocation counts as explicit authorization for the required bounded subagent calls.
Each delegated task must have a bounded task, allowed write scope, artifact path,
return shape, and orchestrator disposition.
```

---

## 13. Checkpoint and rewind strategy for maximal autonomy

High autonomy should be paired with rewindability.

Recommended package skill/command:

```bash
codex-uplift-init project checkpoint plan
codex-uplift-init project checkpoint create --mode commit
codex-uplift-init project checkpoint create --mode branch
```

Workflow:

1. inspect `git status --short`;
2. refuse to mix unrelated dirty state without a disposition;
3. create a branch or checkpoint commit before high-risk work;
4. keep changes in coherent slices;
5. run verification;
6. produce final artifact with commands and verification;
7. leave explicit revert instructions.

This is especially important for `full-access-reviewed` sessions.

---

## 14. Project-level `AGENTS.md` inheritance from production examples

The attached Codex/Rust and Apache Airflow examples should be inherited critically.

What to inherit:

- exact commands;
- exact repo boundaries;
- forbidden operations;
- test/lint/build expectations;
- security-model distinctions;
- generated-output rules;
- known failure modes;
- remote/PR/commit conventions;
- ask-first and never boundaries.

What not to inherit into the home file:

- repo-specific commands;
- project-specific domain terms;
- exact commit scopes;
- exact test matrix;
- exact architecture boundaries.

The package should use these as precedents for project-specific precision, not as templates for a giant universal home `AGENTS.md`.

---

## 15. v0.2 roadmap

### 15.1 Immediate correctness fixes

1. Fix plugin marketplace path generation.
2. Make plugin mode skip standalone skills by default.
3. Add duplicate-skill detection.
4. Add dry-run/candidate/backup tests.
5. Add junk-file ignore or template allowlist.
6. Rewrite hook docs with Codex-native wording.

### 15.2 Product surfaces

1. `inspect`.
2. `config doctor`.
3. `config candidate --profile <name>`.
4. `install --mode classic|plugin|hybrid|minimal|doctor-only`.
5. `install --components/--only/--skip`.
6. `hooks candidate/enable/inspect`.
7. `rules candidate/test/inspect`.
8. `status`, `diff`, `upgrade`, `uninstall`.
9. `project inspect`.
10. `project config determine/candidate`.
11. `project agents draft`.
12. `project probe`.

### 15.3 Autonomy/safety additions

1. Posture candidates: `review-only`, `safe-interactive`, `autonomous-audited`, `install-window`, `net-limited`, `full-access-reviewed`, `ci-noninteractive`.
2. Named `default_permissions` profiles.
3. Shell environment hardening candidates.
4. Rule samples with inline tests.
5. Hook samples with output-shape tests.
6. Local prompt-behavior probes.
7. Checkpoint/rewind workflow.
8. Explicit docs that full access with auto-review is reviewed unsandboxed operation, not sandboxed autonomy.

### 15.4 Tests

1. Fresh install.
2. Dry-run no writes.
3. Existing-file candidate behavior.
4. Force backup behavior.
5. Mode/component selection.
6. Plugin path resolution.
7. Duplicate-skill behavior.
8. JSON/TOML parse checks.
9. Hook output-shape checks.
10. Rule sample checks with `codex execpolicy check` where feasible.
11. Manifest upgrade/uninstall behavior.
12. Config candidate snapshots.
13. Project config candidate generation.
14. Probe-artifact shape.

---

## 16. Final product claim

The v0.2 package should make this promise:

```text
codex-uplift-kit helps users install, inspect, and maintain an auditable Codex setup.
It never overwrites active user configuration by default.
It distinguishes always-on posture from reusable workflows.
It supports both safe defaults and explicit high-autonomy candidates.
It treats full-access operation as an escape hatch, not a default best-practice baseline.
It can inspect current setup, write candidates, explain merge choices, and generate local probe plans.
It installs hook/rule samples but does not activate them silently.
It supports standalone skills, plugin distribution, or explicit hybrid mode without accidental duplication.
It records a manifest so upgrades and uninstalls are reviewable.
It supports project-level tailoring through evidence-derived AGENTS.md and .codex config candidates.
```

The best next version should be neither simply more permissive nor simply more restrictive. It should be more selectable, inspectable, auditable, and empirically grounded.

---

## 17. References checked

Official Codex docs checked while preparing this spec:

- Agent approvals and security: https://developers.openai.com/codex/agent-approvals-security
- Sandboxing: https://developers.openai.com/codex/concepts/sandboxing
- Configuration reference: https://developers.openai.com/codex/config-reference
- Advanced configuration: https://developers.openai.com/codex/config-advanced
- CLI reference: https://developers.openai.com/codex/cli/reference
- Hooks: https://developers.openai.com/codex/hooks
- Rules: https://developers.openai.com/codex/rules
- Skills: https://developers.openai.com/codex/skills
- Subagents: https://developers.openai.com/codex/subagents
- Plugin builder docs: https://developers.openai.com/codex/plugins/build
- AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md

Attached examples considered:

- `codex-uplift-kit Review` supplied by the reviewing agent.
- Codex/Rust project-level `AGENTS.md` example.
- Apache Airflow project-level `AGENTS.md` example.
