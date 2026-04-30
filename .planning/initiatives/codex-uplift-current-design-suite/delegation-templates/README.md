# delegation-templates/README.md

Date: 2026-04-30

These templates are for the main Codex orchestrator implementing `codex-uplift-kit` v0.2.

They should be copied into a subagent prompt and filled with concrete paths before launch. Do not use a template with placeholders unresolved.

## Required conventions

Every delegated task must specify:

- task boundary;
- allowed read scope;
- allowed write scope;
- required artifact path;
- expected return shape;
- verification expectation;
- disposition owner, which is always the orchestrator.

The subagent writes the full result to the artifact path and returns only a concise summary.

## Available templates

- `evidence-explorer.md` — read-only package/repo inspection.
- `config-doctor-review.md` — read-only config/platform/posture review.
- `test-audit.md` — test coverage, safety-critical behavior, and package verification review.
- `artifact-review.md` — adversarial review of a specific artifact/diff/doc.
- `implementation-slice.md` — narrow write-scoped implementation task.
- `release-candidate-review.md` — final adversarial release-candidate review.

## Orchestrator disposition

After every return, update:

```text
.codex-uplift/delegation-ledger.md
```

Disposition must be one of:

```text
accept | revise | park | reject
```
