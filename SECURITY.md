# Security Policy

## Supported Versions

`codex-uplift-kit` is pre-1.0 software. Security fixes are handled on the
current mainline and any active alpha release candidates.

| Version | Supported |
|---|---|
| `0.2.0-alpha.x` | Yes, once published |
| `0.1.0` | Best-effort until superseded |

## Reporting a Vulnerability

Please open a private security advisory if the repository hosting service
supports it. If not, report through the maintainer's preferred private contact
channel before filing a public issue.

Include:

- affected command or template;
- whether the issue can modify real `~/.codex` or `~/.agents` state;
- reproduction steps using temporary `--home` and `--user-home` paths when
  possible;
- expected impact and any known workaround.

## Safety Model

The installer is designed to be non-destructive by default:

- existing files should produce `.candidate.<timestamp>` outputs unless
  `--force` is used;
- tests and verification should use temporary homes;
- hooks, rules, full-access profiles, telemetry, and RTK integration remain
  inactive candidates unless a user explicitly promotes them.

Do not treat generated hooks or rules as a complete security boundary. They are
guardrails that must be paired with appropriate Codex sandbox and approval
settings.
