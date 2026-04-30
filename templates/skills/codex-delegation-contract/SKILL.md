---
name: codex-delegation-contract
description: Design and run bounded Codex subagent delegation with explicit artifact paths, return shapes, and orchestrator review. Use when tasks should be split across subagents or when a workflow requires spawn_agent.
---

# Delegation contract skill

Use this skill to delegate work without losing auditability or wasting context.

## Authorization rule

When the user invokes a command, skill, workflow, agent contract, reference procedure, or other instruction surface whose contract requires launching subagents, that counts as explicit authorization for the required bounded subagent calls. Do not infer broad permission for unrelated delegation.

## Before spawning subagents

Define:

- task boundary;
- owned files or artifact surface;
- allowed write scope;
- required context or sources;
- expected artifact path;
- expected return shape;
- review/disposition criteria;
- conflict plan if any subagent may write files.

## Preferred subagent prompt shape

```text
Task: <bounded task>

Context:
- <files/docs/workflow>

Write scope:
- You may write only: <artifact path or file set>
- Do not edit: <protected files>

Required artifact:
- Write the full result to: <path>
- The artifact must include: observations, inferences, verification, open questions, and risks.

Immediate return shape:
Return only:
- status: success | partial | blocked
- artifact_path: <path>
- key_findings: 3-8 bullets
- verification_performed: commands/files checked
- open_questions: bullets
- risks_or_conflicts: bullets

Do not return the full artifact body in chat unless explicitly requested.
```

## Orchestrator review

After each delegated task returns, disposition it before integration:

- `accept` — artifact is complete and can be used;
- `revise` — send back bounded changes;
- `park` — preserve but do not integrate;
- `reject` — do not use, with reason.

Record the disposition in the relevant handoff, verification log, review note, or final response.

## Anti-patterns

- Delegating after the critical work is already complete just to satisfy a process.
- Asking subagents to return long reports in chat when they should write artifacts.
- Allowing multiple agents to write overlapping files without a conflict plan.
- Letting subagents make stakeholder decisions instead of surfacing options.
- Integrating delegated work without review.
