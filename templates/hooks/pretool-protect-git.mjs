#!/usr/bin/env node
import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf8');
let event = {};
try { event = input.trim() ? JSON.parse(input) : {}; } catch { event = {}; }
const command = String(event?.tool_input?.command ?? '');

const destructivePatterns = [
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+clean\s+[^\n;|&]*-f/,
  /\bgit\s+push\b[^\n;|&]*--force(?:-with-lease)?\b/,
  /\bgit\s+commit\b[^\n;|&]*--amend\b/,
  /\brm\s+-rf\s+(?:\/|~|\.\.)(?:\s|$)/
];

const matched = destructivePatterns.find((pattern) => pattern.test(command));
if (matched) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `Blocked potentially destructive command by codex-uplift-kit hook: ${matched}`
    }
  }));
  process.exit(0);
}

process.exit(0);
