# Decision Records

Status: current
Last updated: 2026-04-30

## Purpose

Decision records preserve why the project chose one path instead of another.
They are for decisions with future cost, not for every small edit.

## When To Record A Decision

Create or update a decision record when work changes:

- product direction;
- roadmap ordering;
- pack or plugin architecture;
- public CLI semantics;
- artifact authority;
- workflow contracts;
- release policy;
- config, hooks, rules, sandbox, or approval posture;
- security, licensing, privacy, or governance boundaries.

Do not disguise an agent recommendation as a decision. Record who made the
decision or mark it as proposed.

## Location

Use `.planning/decisions/` for durable decisions.

Suggested filename:

```text
YYYY-MM-DD-short-slug.md
```

## Status Values

- proposed;
- accepted;
- superseded;
- rejected;
- deferred.

## Template

```markdown
# Decision: <short title>

Status: proposed
Date: YYYY-MM-DD
Owner: <user, maintainer, or role>

## Context

What situation forced the decision?

## Decision

What is being decided?

## Rationale

Why this option now?

## Alternatives Considered

- Option A: why not now.
- Option B: why not now.

## Consequences

What gets easier, harder, safer, or riskier?

## Verification Or Review

What evidence supports this decision, or how will it be reviewed?

## Follow-Up

What remains open?
```

## Promotion Rule

If a decision changes current state, roadmap, release policy, or governance,
update the relevant current doc after creating the decision record.
