#!/usr/bin/env node
import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf8');
let event = {};
try { event = input.trim() ? JSON.parse(input) : {}; } catch { event = {}; }

// This hook is intentionally passive unless enabled via env var.
// Set CODEX_UPLIFT_ENFORCE_STOP_AUDIT=1 if you want it to ask Codex to continue
// when a substantive final response lacks basic audit fields.
if (process.env.CODEX_UPLIFT_ENFORCE_STOP_AUDIT !== '1') {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const msg = String(event?.last_assistant_message ?? '');
const looksSubstantive = /changed|created|updated|implemented|installed|wrote|modified|deleted|verified/i.test(msg);
const hasVerification = /verification|tests? run|not run|checked/i.test(msg);
const hasArtifacts = /artifact|files? (created|updated|changed)|path/i.test(msg);

if (looksSubstantive && (!hasVerification || !hasArtifacts)) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'Before finalizing, add a concise audit summary: artifacts/files changed, verification run or not run, and any boundaries or open risks.'
  }));
  process.exit(0);
}

console.log(JSON.stringify({ continue: true }));
