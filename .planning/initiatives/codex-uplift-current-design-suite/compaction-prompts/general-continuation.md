# general-continuation compaction prompt

Compact this Codex session for reliable continuation.

Preserve only state needed to continue the task accurately and auditably. Do not preserve hidden chain-of-thought, raw logs, repetitive chat, or stale alternatives that are no longer relevant.

Return a concise structured continuation note with these sections:

1. Current objective and scope.
2. Active user instructions, project instructions, and constraints that still matter.
3. Current working posture: sandbox/approval/profile assumptions if known, and any autonomy or safety boundaries.
4. Durable artifacts created or updated, with paths and purposes.
5. Decisions: decided, provisional, open, and deferred. For each meaningful decision, preserve the basis and remaining uncertainty.
6. Evidence and verification: commands run, sources checked, results, and what remains unverified.
7. Delegated work: subagent tasks, artifact paths, and disposition status.
8. Current repo/worktree state if known: changed files, dirty state, branch/checkpoint status.
9. Next actions: the smallest useful continuation steps.
10. Context exclusions: large logs, files, or side topics intentionally not carried forward.

Prefer artifact paths and compact summaries over full content. Preserve distinctions between observation, inference, recommendation, and stakeholder decision.
