# codex-uplift-kit Project Instructions

This is a temporary project-level operating contract for `codex-uplift-kit`.
Keep it until the v0.2 setup-assistant design is implemented and the durable
project guidance can be regenerated from the finalized docs.

## Project Aim

`codex-uplift-kit` is a Codex setup and posture assistant. It installs and
maintains reusable Codex assets for auditable agentic development:

- user-level operating guidance;
- reusable skills;
- custom agent templates;
- optional hook samples;
- optional plugin packaging;
- config/profile candidates;
- project-level onboarding candidates.

The package is not an official OpenAI package. Treat platform behavior as a
thing to verify against official Codex docs or local probes, not memory.

## Current Direction

v0.1 is a conservative bootstrap bundle. v0.2 should become the first credible
setup-assistant release:

- inspect existing `~/.codex` and `~/.agents` state before proposing changes;
- generate candidates instead of silently mutating active config;
- support install modes such as classic, plugin, and hybrid;
- avoid duplicate skill installs unless explicitly requested;
- validate plugin marketplace paths against documented Codex semantics;
- provide safe config/profile candidates for different autonomy postures;
- keep high-autonomy profiles paired with recovery, audit, and rollback guidance;
- add installer tests for safety-critical behavior.

## Safety Invariants

- Never write to a real user `~/.codex` or `~/.agents` path while testing unless
  the user explicitly asks for that exact operation.
- Use temp `--home` and `--user-home` directories for installer verification.
- Preserve the non-destructive install contract: existing files produce
  `.candidate.<timestamp>` outputs by default; `--force` must create backups.
- Do not silently enable hooks, rules, plugins, network access, full access, or
  `approval_policy = "never"`.
- Do not present `danger-full-access` plus `auto_review` as sandboxed safety.
- Treat hooks as Codex lifecycle guardrails with documented limitations, not as
  a complete security boundary.

## Platform Claims

For Codex mechanics, check official OpenAI docs before making claims about:

- config precedence and profiles;
- sandbox and approval behavior;
- `approvals_reviewer`;
- `default_permissions` and rules;
- hooks and hook event shapes;
- skills and duplicate skill names;
- plugin marketplace path semantics;
- project trust and project-local `.codex` loading.

When docs do not settle behavior, write the claim as an empirical question and
add a local non-destructive probe.

## Implementation Rules

- Keep changes narrowly scoped and commit them atomically.
- Use `apply_patch` for manual file edits.
- Prefer Node standard-library code unless a dependency clearly earns its cost.
- Keep installer behavior deterministic and testable with temp directories.
- Add or update `node:test` coverage when touching installer behavior.
- Avoid copying local system files such as `.DS_Store` into installed templates.
- Do not refactor unrelated templates while fixing installer logic.

## Documentation Rules

- Write for a fresh reader who has not seen the chat history.
- Separate implementation defects, product requirements, platform corrections,
  and empirical unknowns.
- Keep user-facing docs candidate-first and explicit about tradeoffs.
- Do not cargo-cult project `AGENTS.md` examples into home-level guidance.
- Link or cite official Codex docs for platform facts when the claim is
  non-obvious or recently corrected.

## Verification

Run the light checks after changes that affect packaging or installation:

```bash
npm run smoke
npm pack --dry-run
```

For installer changes, add focused `node:test` coverage and run:

```bash
npm test
```

If `npm test` does not exist yet, either add it with the tests or state that the
test suite is not yet present.

## Git Workflow

- The initial baseline commit is the current package state.
- Commit project guidance, review revisions, implementation changes, and tests
  as separate logical commits.
- Check `git status --short` before and after edits.
- Never revert user changes unless explicitly asked.
