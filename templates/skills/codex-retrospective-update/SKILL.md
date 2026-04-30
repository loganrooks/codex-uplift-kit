---
name: codex-retrospective-update
description: Decide where to encode a repeated Codex failure as durable guidance: home AGENTS.md, project AGENTS.md, nested AGENTS.md, skill, hook, config, test, or CI check.
---

# Retrospective update skill

Use this skill when Codex or another agent repeats a mistake, violates workflow expectations, or creates avoidable review friction.

## Retrospective questions

1. What happened?
2. What was the expected behavior?
3. What existing instruction, if any, should have prevented it?
4. Was the failure caused by missing context, ambiguous instruction, absent verification, tool limitation, or judgment error?
5. Is the fix universal, project-specific, subsystem-specific, workflow-specific, or deterministic?
6. Where should the fix live?

## Placement guide

- Home `~/.codex/AGENTS.md`: durable personal default across repos.
- Project `AGENTS.md`: shared repo standard, command, convention, protected seam, artifact path.
- Nested `AGENTS.md`: local subsystem rule.
- Skill: reusable workflow that should load only when needed.
- Hook: deterministic guardrail or lifecycle check.
- Config: sandbox, approval, model, MCP, agents, feature flags.
- Test/CI/lint: enforceable project behavior.

## Output

Produce a concise recommendation:

```markdown
# Retrospective: <failure>

## Failure observed
## Root cause hypothesis
## Proposed durable fix
## Target surface
## Exact text or patch
## Why this surface
## Alternatives considered
## Verification / future check
```

Do not update instruction files automatically if the change is doctrine-bearing or could affect many projects. Surface the proposed patch first.
