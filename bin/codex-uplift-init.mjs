#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const templates = path.join(packageRoot, 'templates');

function usage() {
  console.log(`codex-uplift-init

Usage:
  codex-uplift-init [install] [options]

Options:
  --dry-run           Show what would be written.
  --force             Overwrite existing files after writing timestamped backups.
  --home <path>       Override Codex home. Defaults to CODEX_HOME or ~/.codex.
  --user-home <path>  Override OS user home. Defaults to HOME.
  --skip-home-agents  Do not install ~/.codex/AGENTS.md.
  --skip-skills       Do not install user skills.
  --skip-agents       Do not install custom agents.
  --skip-hooks        Do not install hook samples.
  --install-plugin    Also copy the plugin skeleton under ~/.codex/plugins/codex-uplift-kit
                      and write/update a personal marketplace candidate under ~/.agents/plugins.
  --help              Show this help.

Safety:
  Existing files are skipped and a .candidate.<timestamp> file is written unless --force is used.
  Hooks are installed as samples only; this command does not edit ~/.codex/config.toml.
`);
}

const args = process.argv.slice(2);
let dryRun = false;
let force = false;
let installHomeAgents = true;
let installSkills = true;
let installAgents = true;
let installHooks = true;
let installPlugin = false;
let userHome = os.homedir();
let codexHome = process.env.CODEX_HOME || path.join(userHome, '.codex');
let codexHomeExplicit = Boolean(process.env.CODEX_HOME);

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === 'install') continue;
  if (a === '--dry-run') dryRun = true;
  else if (a === '--force') force = true;
  else if (a === '--skip-home-agents') installHomeAgents = false;
  else if (a === '--skip-skills') installSkills = false;
  else if (a === '--skip-agents') installAgents = false;
  else if (a === '--skip-hooks') installHooks = false;
  else if (a === '--install-plugin') installPlugin = true;
  else if (a === '--home') {
    if (!args[i + 1]) throw new Error('--home requires a path');
    codexHome = expandHome(args[++i]);
    codexHomeExplicit = true;
  } else if (a === '--user-home') {
    if (!args[i + 1]) throw new Error('--user-home requires a path');
    userHome = expandHome(args[++i]);
    if (!codexHomeExplicit) codexHome = path.join(userHome, '.codex');
  } else if (a === '--help' || a === '-h') {
    usage();
    process.exit(0);
  } else {
    console.error(`Unknown option: ${a}`);
    usage();
    process.exit(2);
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const actions = [];

function expandHome(p) {
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function exists(p) { return fs.existsSync(p); }

function mkdirp(dir) {
  actions.push({ type: 'mkdir', path: dir });
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dst, opts = {}) {
  const mode = opts.mode;
  const dstDir = path.dirname(dst);
  if (!exists(dstDir)) mkdirp(dstDir);

  if (exists(dst)) {
    if (force) {
      const backup = `${dst}.backup.${stamp}`;
      actions.push({ type: 'backup', from: dst, to: backup });
      actions.push({ type: 'write', from: src, to: dst, mode, overwrite: true });
      if (!dryRun) {
        fs.copyFileSync(dst, backup);
        fs.copyFileSync(src, dst);
        if (mode) fs.chmodSync(dst, mode);
      }
    } else {
      const candidate = `${dst}.candidate.${stamp}`;
      actions.push({ type: 'candidate', from: src, to: candidate, reason: 'target exists' });
      if (!dryRun) {
        fs.copyFileSync(src, candidate);
        if (mode) fs.chmodSync(candidate, mode);
      }
    }
  } else {
    actions.push({ type: 'write', from: src, to: dst, mode });
    if (!dryRun) {
      fs.copyFileSync(src, dst);
      if (mode) fs.chmodSync(dst, mode);
    }
  }
}

function copyDirFiles(srcDir, dstDir) {
  for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, ent.name);
    const dst = path.join(dstDir, ent.name);
    if (ent.isDirectory()) copyDirFiles(src, dst);
    else if (ent.isFile()) {
      const st = fs.statSync(src);
      const executable = (st.mode & 0o111) !== 0;
      copyFile(src, dst, executable ? { mode: 0o755 } : {});
    }
  }
}

if (installHomeAgents) {
  copyFile(path.join(templates, 'home', 'AGENTS.md'), path.join(codexHome, 'AGENTS.md'));
  copyFile(path.join(templates, 'config', 'config.fragment.toml'), path.join(codexHome, 'config.fragment.codex-uplift-kit.toml'));
}

if (installSkills) {
  copyDirFiles(path.join(templates, 'skills'), path.join(userHome, '.agents', 'skills'));
}

if (installAgents) {
  copyDirFiles(path.join(templates, 'agents'), path.join(codexHome, 'agents'));
}

if (installHooks) {
  copyFile(path.join(templates, 'hooks', 'hooks.json.sample'), path.join(codexHome, 'hooks.json.sample'));
  copyFile(path.join(templates, 'hooks', 'pretool-protect-git.mjs'), path.join(codexHome, 'hooks', 'pretool-protect-git.mjs'), { mode: 0o755 });
  copyFile(path.join(templates, 'hooks', 'stop-audit-shape.mjs'), path.join(codexHome, 'hooks', 'stop-audit-shape.mjs'), { mode: 0o755 });
}

if (installPlugin) {
  const pluginDst = path.join(codexHome, 'plugins', 'codex-uplift-kit');
  copyDirFiles(path.join(templates, 'plugin'), pluginDst);
  const marketplaceRoot = path.join(userHome, '.agents', 'plugins');
  copyFile(path.join(templates, 'plugin-marketplace', 'marketplace.json'), path.join(marketplaceRoot, 'marketplace.json'));
}

console.log(`${dryRun ? 'Dry run' : 'Install'} summary for codex-uplift-kit`);
console.log(`Codex home: ${codexHome}`);
console.log(`User skills: ${path.join(userHome, '.agents', 'skills')}`);
console.log('');

for (const action of actions) {
  if (action.type === 'mkdir') console.log(`mkdir      ${action.path}`);
  if (action.type === 'write') console.log(`${action.overwrite ? 'overwrite ' : 'write     '} ${action.to}`);
  if (action.type === 'backup') console.log(`backup     ${action.from} -> ${action.to}`);
  if (action.type === 'candidate') console.log(`candidate  ${action.to} (${action.reason})`);
}

console.log('');
console.log('Notes:');
console.log('- Existing files are preserved unless --force was used. Review any .candidate.* files and merge manually.');
console.log('- Hooks are samples only. To enable, inspect hooks.json.sample, copy it to hooks.json, and enable codex_hooks in config.toml.');
console.log('- Restart Codex if new skills or custom agents do not appear immediately.');
