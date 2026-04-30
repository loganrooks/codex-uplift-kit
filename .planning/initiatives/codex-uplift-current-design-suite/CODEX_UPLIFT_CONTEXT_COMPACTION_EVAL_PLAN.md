# CODEX_UPLIFT_CONTEXT_COMPACTION_EVAL_PLAN.md

Date: 2026-04-30

Subject: Evaluation plan for context packs and compaction prompt quality

## 0. Executive position

The package should evaluate continuation quality, not only token count. A shorter summary that loses decisions or deferrals is a failure.

## 1. v0.2 eval surfaces

v0.2 should ship at minimum:

- synthetic fixture files;
- prompt catalog metadata;
- manual scoring rubric;
- context pack template;
- artifact index template;
- deferral-register template.

Optional command:

```text
codex-uplift-init compaction eval --fixture <fixture-id> --prompt <prompt-id>
```

## 2. Synthetic fixture contents

A fixture should contain:

- current goal;
- completed steps;
- durable artifacts and paths;
- one observation;
- one inference;
- one stakeholder decision;
- one explicit deferral with seam;
- verification run;
- verification not run;
- one subagent artifact with disposition;
- one stale assumption not to carry forward;
- next action;
- thing not to redo.

## 3. Scoring rubric

Score 0-2 per item:

| Item | 0 | 1 | 2 |
|---|---|---|---|
| Objective/status | missing | vague | clear |
| Artifact paths | missing | partial | complete |
| Decisions | missing | unlabeled | labeled + rationale/status |
| Deferrals/seams | missing | partial | target + seam |
| Verification | missing | partial | run/not-run with reasons |
| Delegation | missing | summary only | artifact + disposition |
| Next actions | missing | vague | concrete |
| What not to redo | missing | implicit | explicit |
| Epistemic labels | conflated | partial | distinct |
| Token discipline | transcript-like | useful but long | concise/artifact-linked |

Minimum acceptable v0.2 score for a general prompt candidate: 16/20.

## 4. Default-vs-candidate comparison

If the built-in default prompt can be observed safely, compare it against package candidates on the same fixture. If not, label default behavior as unknown and avoid superiority claims.

## 5. Long-horizon follow-up

v0.3 should automate scoring and store eval outputs with prompt IDs, versions, fixture IDs, and continuation outcome notes.
