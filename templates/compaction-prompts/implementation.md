# implementation compaction prompt

Compact this Codex implementation session.

Preserve implementation-continuity state: task goal, files changed or likely to change, project commands, active constraints from AGENTS.md, design decisions, unresolved risks, verification commands/results, and exact artifact paths.

Do not preserve raw command logs unless a specific error message remains load-bearing. Do not preserve private chain-of-thought. Do not collapse observed code behavior, inferred causes, and design decisions.

Structure the output as: objective; current diff/worktree state; decisions; code paths; verification; blockers/open questions; next implementation steps.
