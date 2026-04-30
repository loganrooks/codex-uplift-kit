#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const templates = path.join(packageRoot, 'templates');
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const packageName = packageJson.name || 'codex-uplift-kit';
const packageVersion = packageJson.version || '0.0.0';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const junkNames = new Set(['.DS_Store', 'Thumbs.db']);
const junkPatterns = [/^\.#/, /~$/, /\.sw[opx]$/];

const componentIds = [
  'home-agents',
  'skills',
  'agents',
  'config-candidates',
  'hook-samples',
  'rule-samples',
  'plugin',
  'project-skeleton',
  'compaction-prompts',
  'manifest',
];

const modeComponents = {
  classic: ['home-agents', 'skills', 'agents', 'config-candidates', 'hook-samples', 'rule-samples', 'manifest'],
  plugin: ['home-agents', 'agents', 'config-candidates', 'hook-samples', 'rule-samples', 'plugin', 'manifest'],
  hybrid: ['home-agents', 'skills', 'agents', 'config-candidates', 'hook-samples', 'rule-samples', 'plugin', 'manifest'],
  minimal: ['home-agents', 'config-candidates', 'manifest'],
};

const configProfiles = {
  'review-only': {
    warning: 'Review-only profile keeps writes and risky autonomy behind approval.',
    toml: [
      '[profiles.review-only]',
      'sandbox_mode = "read-only"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "user"',
      'model_reasoning_effort = "high"',
    ],
  },
  'safe-interactive': {
    warning: 'Safe interactive profile favors normal local development with review for escalations.',
    toml: [
      '[profiles.safe-interactive]',
      'sandbox_mode = "workspace-write"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "user"',
      'allow_login_shell = false',
      '',
      '[profiles.safe-interactive.sandbox_workspace_write]',
      'network_access = false',
    ],
  },
  'autonomous-audited': {
    warning: 'Autonomous audited profile still keeps sandboxing and audit/recovery expectations explicit.',
    toml: [
      '[profiles.autonomous-audited]',
      'sandbox_mode = "workspace-write"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "auto_review"',
      'allow_login_shell = false',
      'default_permissions = "codex-uplift-autonomous"',
      '',
      '[profiles.autonomous-audited.sandbox_workspace_write]',
      'network_access = false',
    ],
  },
  'install-window': {
    warning: 'Install-window profile is for short setup sessions; review before making it active.',
    toml: [
      '[profiles.install-window]',
      'sandbox_mode = "workspace-write"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "auto_review"',
      'allow_login_shell = false',
      '',
      '[profiles.install-window.sandbox_workspace_write]',
      'network_access = true',
    ],
  },
  'net-limited': {
    warning: 'Network access is proposed narrowly; validate against current Codex docs before activation.',
    toml: [
      '[profiles.net-limited]',
      'sandbox_mode = "workspace-write"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "auto_review"',
      'allow_login_shell = false',
      '',
      '[profiles.net-limited.sandbox_workspace_write]',
      'network_access = true',
    ],
  },
  'full-access-reviewed': {
    warning: 'WARNING: full access is reviewed unsandboxed operation, not sandboxed safety. Keep recovery controls in place.',
    toml: [
      '[profiles.full-access-reviewed]',
      'sandbox_mode = "danger-full-access"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "auto_review"',
      'allow_login_shell = false',
    ],
  },
  'external-isolated': {
    warning: 'External isolated profile is a candidate for disposable/external repos, not trusted local config.',
    toml: [
      '[profiles.external-isolated]',
      'sandbox_mode = "workspace-write"',
      'approval_policy = "on-request"',
      'approvals_reviewer = "auto_review"',
      'allow_login_shell = false',
      '',
      '[profiles.external-isolated.sandbox_workspace_write]',
      'network_access = false',
    ],
  },
  'ci-noninteractive': {
    warning: 'WARNING: CI noninteractive settings can suppress prompts. Use only in disposable, scoped CI homes.',
    toml: [
      '[profiles.ci-noninteractive]',
      'sandbox_mode = "workspace-write"',
      'approval_policy = "never"',
      'approvals_reviewer = "auto_review"',
      'allow_login_shell = false',
      '',
      '[profiles.ci-noninteractive.sandbox_workspace_write]',
      'network_access = false',
    ],
  },
};

function usage() {
  console.log(`codex-uplift-init

Usage:
  codex-uplift-init [install] [options]
  codex-uplift-init inspect [options]
  codex-uplift-init status [--manifest <path>]
  codex-uplift-init uninstall --manifest <path> [--dry-run]
  codex-uplift-init config doctor [options]
  codex-uplift-init config candidate --profile <profile> [options]
  codex-uplift-init project inspect
  codex-uplift-init project candidate
  codex-uplift-init rules candidate
  codex-uplift-init hooks candidate
  codex-uplift-init compact candidate
  codex-uplift-init rtk evaluate --plan-only
  codex-uplift-init verify

Install options:
  --mode <mode>            classic, plugin, hybrid, or minimal. Default: classic.
  --components <ids>       Start from mode defaults plus these comma-separated component IDs.
  --only <ids>             Install only these comma-separated component IDs.
  --skip <ids>             Skip these comma-separated component IDs.
  --dry-run                Show what would be written.
  --force                  Overwrite existing files after timestamped backups.
  --home <path>            Override Codex home. Defaults to CODEX_HOME or ~/.codex.
  --user-home <path>       Override OS user home. Defaults to HOME.
  --manifest <path>        Override manifest path.
  --install-plugin         Legacy alias for --components plugin.
  --skip-home-agents       Legacy alias for --skip home-agents.
  --skip-skills            Legacy alias for --skip skills.
  --skip-agents            Legacy alias for --skip agents.
  --skip-hooks             Legacy alias for --skip hook-samples.

Component IDs:
  ${componentIds.join(', ')}

Config profiles:
  ${Object.keys(configProfiles).join(', ')}

Safety:
  Existing files are skipped and a .candidate.<timestamp> file is written unless --force is used.
  Plugin mode skips standalone skills by default. Hybrid mode installs both and reports duplicate skill names.
  Hooks, rules, full-access config, and RTK enablement remain candidates only by default.
`);
}

function expandHome(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function parseArgs(argv) {
  const positionals = [];
  const options = {
    dryRun: false,
    force: false,
    mode: 'classic',
    components: [],
    only: null,
    skip: [],
    profile: null,
    planOnly: false,
    home: null,
    userHome: os.homedir(),
    codexHomeExplicit: Boolean(process.env.CODEX_HOME),
    manifest: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') options.help = true;
    else if (a === '--dry-run') options.dryRun = true;
    else if (a === '--force') options.force = true;
    else if (a === '--plan-only') options.planOnly = true;
    else if (a === '--mode') options.mode = requireValue(argv, ++i, '--mode');
    else if (a === '--components') options.components.push(...parseList(requireValue(argv, ++i, '--components')));
    else if (a === '--only') options.only = parseList(requireValue(argv, ++i, '--only'));
    else if (a === '--skip') options.skip.push(...parseList(requireValue(argv, ++i, '--skip')));
    else if (a === '--profile') options.profile = requireValue(argv, ++i, '--profile');
    else if (a === '--home') {
      options.home = expandHome(requireValue(argv, ++i, '--home'));
      options.codexHomeExplicit = true;
    } else if (a === '--user-home') {
      options.userHome = expandHome(requireValue(argv, ++i, '--user-home'));
    } else if (a === '--manifest') {
      options.manifest = expandHome(requireValue(argv, ++i, '--manifest'));
    } else if (a === '--install-plugin') {
      options.components.push('plugin');
    } else if (a === '--skip-home-agents') {
      options.skip.push('home-agents');
    } else if (a === '--skip-skills') {
      options.skip.push('skills');
    } else if (a === '--skip-agents') {
      options.skip.push('agents');
    } else if (a === '--skip-hooks') {
      options.skip.push('hook-samples');
    } else if (a.startsWith('--')) {
      throw new Error(`Unknown option: ${a}`);
    } else {
      positionals.push(a);
    }
  }

  options.userHome = path.resolve(options.userHome);
  options.codexHome = options.home
    ? path.resolve(options.home)
    : path.resolve(options.codexHomeExplicit ? process.env.CODEX_HOME : path.join(options.userHome, '.codex'));
  options.manifestPath = options.manifest
    ? path.resolve(options.manifest)
    : path.join(options.codexHome, packageName, 'manifest.json');
  return { positionals, options };
}

function requireValue(argv, index, flag) {
  if (!argv[index]) throw new Error(`${flag} requires a value`);
  return argv[index];
}

function parseList(value) {
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

function validateComponents(ids) {
  const unknown = ids.filter((id) => !componentIds.includes(id));
  if (unknown.length) throw new Error(`Unknown component ID(s): ${unknown.join(', ')}`);
}

function selectedComponents(options) {
  if (!Object.hasOwn(modeComponents, options.mode)) {
    throw new Error(`Unknown install mode: ${options.mode}`);
  }
  validateComponents(options.components);
  validateComponents(options.skip);
  if (options.only) validateComponents(options.only);

  const selected = new Set(options.only || modeComponents[options.mode]);
  for (const id of options.components) selected.add(id);
  for (const id of options.skip) selected.delete(id);
  return selected;
}

function isJunk(name) {
  return junkNames.has(name) || junkPatterns.some((pattern) => pattern.test(name));
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function ensureDir(dir, state) {
  state.actions.push({ type: 'mkdir', path: dir });
  if (!state.options.dryRun) fs.mkdirSync(dir, { recursive: true });
}

function writeTextFile(dst, content, componentId, state, opts = {}) {
  const dstDir = path.dirname(dst);
  if (!fs.existsSync(dstDir)) ensureDir(dstDir, state);
  let target = dst;
  let action = 'write';
  let previousSha256 = null;

  if (fs.existsSync(dst)) {
    if (state.options.force) {
      const backup = `${dst}.backup.${stamp}`;
      previousSha256 = sha256File(dst);
      state.actions.push({ type: 'backup', from: dst, to: backup });
      if (!state.options.dryRun) fs.copyFileSync(dst, backup);
      action = 'overwrite';
    } else {
      target = `${dst}.candidate.${stamp}`;
      action = 'candidate';
    }
  }

  state.actions.push({ type: action, to: target, componentId });
  if (!state.options.dryRun) {
    fs.writeFileSync(target, content);
    if (opts.mode) fs.chmodSync(target, opts.mode);
  }
  recordEntry(state, {
    componentId,
    kind: opts.kind || 'file',
    sourcePath: opts.sourcePath || null,
    targetPath: target,
    intendedTargetPath: dst,
    action,
    sha256: sha256Text(content),
    previousSha256,
  });
  return target;
}

function copyFile(src, dst, componentId, state, opts = {}) {
  const content = fs.readFileSync(src);
  const dstDir = path.dirname(dst);
  if (!fs.existsSync(dstDir)) ensureDir(dstDir, state);
  let target = dst;
  let action = 'write';
  let previousSha256 = null;

  if (fs.existsSync(dst)) {
    if (state.options.force) {
      const backup = `${dst}.backup.${stamp}`;
      previousSha256 = sha256File(dst);
      state.actions.push({ type: 'backup', from: dst, to: backup });
      if (!state.options.dryRun) fs.copyFileSync(dst, backup);
      action = 'overwrite';
    } else {
      target = `${dst}.candidate.${stamp}`;
      action = 'candidate';
    }
  }

  state.actions.push({ type: action, from: src, to: target, componentId });
  if (!state.options.dryRun) {
    fs.copyFileSync(src, target);
    if (opts.mode) fs.chmodSync(target, opts.mode);
  }
  recordEntry(state, {
    componentId,
    kind: opts.kind || 'file',
    sourcePath: path.relative(packageRoot, src),
    targetPath: target,
    intendedTargetPath: dst,
    action,
    sha256: crypto.createHash('sha256').update(content).digest('hex'),
    previousSha256,
  });
  return target;
}

function copyDirFiles(srcDir, dstDir, componentId, state) {
  for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (isJunk(ent.name)) {
      state.actions.push({ type: 'skip-junk', path: path.join(srcDir, ent.name) });
      continue;
    }
    const src = path.join(srcDir, ent.name);
    const dst = path.join(dstDir, ent.name);
    if (ent.isDirectory()) copyDirFiles(src, dst, componentId, state);
    else if (ent.isFile()) {
      const st = fs.statSync(src);
      const executable = (st.mode & 0o111) !== 0;
      copyFile(src, dst, componentId, state, executable ? { mode: 0o755 } : {});
    }
  }
}

function recordEntry(state, entry) {
  state.manifestEntries.push({
    package: packageName,
    version: packageVersion,
    componentId: entry.componentId,
    kind: entry.kind,
    sourcePath: entry.sourcePath,
    targetPath: entry.targetPath,
    intendedTargetPath: entry.intendedTargetPath || entry.targetPath,
    action: entry.action,
    sha256: entry.sha256,
    previousSha256: entry.previousSha256 || null,
    installMode: state.options.mode,
    timestamp: new Date().toISOString(),
  });
}

function writeManifest(state, components) {
  if (!components.has('manifest') || state.options.dryRun) return;
  const existingManifest = readExistingManifest(state.options.manifestPath);
  const entriesByTarget = new Map();
  for (const entry of existingManifest?.entries || []) {
    const key = entry.targetPath || entry.target;
    if (key) entriesByTarget.set(key, entry);
  }
  for (const entry of state.manifestEntries) {
    entriesByTarget.set(entry.targetPath, entry);
  }
  const manifest = {
    package: packageName,
    version: packageVersion,
    installMode: state.options.mode,
    generatedAt: new Date().toISOString(),
    codexHome: state.options.codexHome,
    userHome: state.options.userHome,
    components: [...components],
    entries: [...entriesByTarget.values()],
  };
  const content = `${JSON.stringify(manifest, null, 2)}\n`;
  const dst = state.options.manifestPath;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, content);
  state.actions.push({ type: 'manifest', to: dst });
}

function readExistingManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    throw new Error(`Existing manifest is not valid JSON: ${manifestPath}: ${err.message}`);
  }
}

function marketplaceRelativePath(options, warnings) {
  const pluginDst = path.join(options.codexHome, 'plugins', packageName);
  const rel = path.relative(options.userHome, pluginDst);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    warnings.push(`unknown: Codex home is outside user-home marketplace root; using absolute marketplace source.path fallback (${pluginDst}).`);
    return null;
  }
  return rel.startsWith('./') ? rel : `./${rel}`;
}

function marketplaceJson(options, warnings) {
  const rel = marketplaceRelativePath(options, warnings);
  const sourcePath = rel || path.join(options.codexHome, 'plugins', packageName);
  const entry = JSON.parse(fs.readFileSync(path.join(templates, 'plugin-marketplace', 'marketplace.json'), 'utf8'));
  entry.plugins[0].source.path = sourcePath;
  const resolved = path.resolve(options.userHome, sourcePath);
  const expected = path.join(options.codexHome, 'plugins', packageName);
  if (path.normalize(resolved) !== path.normalize(expected)) {
    warnings.push(`unknown: marketplace source.path resolves to ${resolved}, expected ${expected}.`);
  }
  return `${JSON.stringify(entry, null, 2)}\n`;
}

function duplicateSkillNames() {
  const standalone = skillNames(path.join(templates, 'skills'));
  const plugin = skillNames(path.join(templates, 'plugin', 'skills'));
  return standalone.filter((name) => plugin.includes(name));
}

function skillNames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((ent) => ent.isDirectory() && !isJunk(ent.name))
    .map((ent) => ent.name)
    .sort();
}

function runInstall(options) {
  const components = selectedComponents(options);
  const warnings = [];
  const state = { options, actions: [], manifestEntries: [] };

  if (components.has('skills') && components.has('plugin')) {
    const dupes = duplicateSkillNames();
    if (dupes.length) warnings.push(`install includes both standalone and plugin skill copies; duplicate skill names: ${dupes.join(', ')}`);
  }

  if (components.has('home-agents')) {
    copyFile(path.join(templates, 'home', 'AGENTS.md'), path.join(options.codexHome, 'AGENTS.md'), 'home-agents', state);
  }
  if (components.has('skills')) {
    copyDirFiles(path.join(templates, 'skills'), path.join(options.userHome, '.agents', 'skills'), 'skills', state);
  }
  if (components.has('agents')) {
    copyDirFiles(path.join(templates, 'agents'), path.join(options.codexHome, 'agents'), 'agents', state);
  }
  if (components.has('config-candidates')) {
    copyFile(
      path.join(templates, 'config', 'config.fragment.toml'),
      path.join(options.codexHome, 'config.fragment.codex-uplift-kit.toml'),
      'config-candidates',
      state,
    );
  }
  if (components.has('hook-samples')) {
    copyFile(path.join(templates, 'hooks', 'hooks.json.sample'), path.join(options.codexHome, 'hooks.json.sample'), 'hook-samples', state);
    copyFile(path.join(templates, 'hooks', 'pretool-protect-git.mjs'), path.join(options.codexHome, 'hooks', 'pretool-protect-git.mjs'), 'hook-samples', state, { mode: 0o755 });
    copyFile(path.join(templates, 'hooks', 'stop-audit-shape.mjs'), path.join(options.codexHome, 'hooks', 'stop-audit-shape.mjs'), 'hook-samples', state, { mode: 0o755 });
  }
  if (components.has('rule-samples')) {
    writeTextFile(
      path.join(options.codexHome, 'rules.codex-uplift-kit.candidate.md'),
      '# Codex Uplift Rule Candidates\n\nRules are candidate notes only. Review current Codex docs before enabling command permission rules.\n',
      'rule-samples',
      state,
      { kind: 'candidate' },
    );
  }
  if (components.has('compaction-prompts')) {
    const sourceDir = path.join(templates, 'compaction-prompts');
    const promptFiles = fs.readdirSync(sourceDir, { withFileTypes: true })
      .filter((ent) => ent.isFile() && ent.name.endsWith('.md') && !isJunk(ent.name))
      .map((ent) => ent.name)
      .sort();
    for (const name of promptFiles) {
      copyFile(
        path.join(sourceDir, name),
        path.join(options.codexHome, 'compact.candidate', 'prompts', name),
        'compaction-prompts',
        state,
        { kind: 'candidate' },
      );
    }
    writeTextFile(
      path.join(options.codexHome, 'compact.candidate', 'README.md'),
      compactCandidateReadme(promptFiles),
      'compaction-prompts',
      state,
      { kind: 'candidate' },
    );
    writeTextFile(
      path.join(options.codexHome, 'compact.candidate', 'config.fragment.toml'),
      compactCandidateConfigFragment(),
      'compaction-prompts',
      state,
      { kind: 'candidate' },
    );
  }
  if (components.has('plugin')) {
    copyDirFiles(path.join(templates, 'plugin'), path.join(options.codexHome, 'plugins', packageName), 'plugin', state);
    writeTextFile(
      path.join(options.userHome, '.agents', 'plugins', 'marketplace.json'),
      marketplaceJson(options, warnings),
      'plugin',
      state,
      { kind: 'marketplace', sourcePath: 'templates/plugin-marketplace/marketplace.json' },
    );
  }

  writeManifest(state, components);
  printInstallSummary(options, state.actions, warnings, components);
}

function printInstallSummary(options, actions, warnings, components) {
  console.log(`${options.dryRun ? 'Dry run' : 'Install'} summary for ${packageName}`);
  console.log(`Mode: ${options.mode}`);
  console.log(`Components: ${[...components].join(', ') || '(none)'}`);
  console.log(`Codex home: ${options.codexHome}`);
  console.log(`User home: ${options.userHome}`);
  console.log(`Manifest: ${options.manifestPath}`);
  console.log('');
  for (const action of actions) {
    if (action.type === 'mkdir') console.log(`mkdir      ${action.path}`);
    if (action.type === 'write') console.log(`write      ${action.to}`);
    if (action.type === 'overwrite') console.log(`overwrite  ${action.to}`);
    if (action.type === 'backup') console.log(`backup     ${action.from} -> ${action.to}`);
    if (action.type === 'candidate') console.log(`candidate  ${action.to}`);
    if (action.type === 'manifest') console.log(`manifest   ${action.to}`);
    if (action.type === 'skip-junk') console.log(`skip junk  ${action.path}`);
  }
  console.log('');
  console.log('Notes:');
  console.log('- Existing files are preserved unless --force was used. Review any .candidate.* files and merge manually.');
  console.log('- Hooks, rules, full-access config, and RTK enablement remain inactive candidates by default.');
  console.log('- Restart Codex if new skills or custom agents do not appear immediately.');
  for (const warning of warnings) console.log(`- ${warning}`);
}

function inspect(options) {
  const observations = [
    ['observed', 'codexHome', options.codexHome, fs.existsSync(options.codexHome)],
    ['observed', 'userSkills', path.join(options.userHome, '.agents', 'skills'), fs.existsSync(path.join(options.userHome, '.agents', 'skills'))],
    ['observed', 'pluginsRoot', path.join(options.codexHome, 'plugins'), fs.existsSync(path.join(options.codexHome, 'plugins'))],
    ['observed', 'manifest', options.manifestPath, fs.existsSync(options.manifestPath)],
    ['inferred', 'defaultManifest', options.manifestPath, true],
    ['proposed', 'safeInstallModes', 'classic, plugin, hybrid, minimal', true],
  ];
  console.log(`${packageName} inspect`);
  for (const [category, key, value, present] of observations) {
    console.log(`${category.padEnd(9)} ${key.padEnd(18)} ${present ? 'present' : 'missing'} ${value}`);
  }
  console.log('unknown   effectiveConfig    requires Codex runtime/managed config probe');
}

function readManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) throw new Error(`Manifest not found: ${manifestPath}`);
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function classifyEntry(entry) {
  if (entry.action === 'candidate') return fs.existsSync(entry.targetPath) ? 'candidate' : 'missing';
  if (!entry.sha256) return fs.existsSync(entry.targetPath) ? 'unknown' : 'missing';
  if (!fs.existsSync(entry.targetPath)) return 'missing';
  return sha256File(entry.targetPath) === entry.sha256 ? 'present' : 'modified';
}

function status(options) {
  const manifest = readManifest(options.manifestPath);
  console.log(`${packageName} status`);
  console.log(`Manifest: ${options.manifestPath}`);
  for (const entry of manifest.entries || []) {
    console.log(`${classifyEntry(entry).padEnd(9)} ${entry.componentId.padEnd(18)} ${entry.targetPath}`);
  }
}

function uninstall(options) {
  const manifest = readManifest(options.manifestPath);
  console.log(`${packageName} uninstall ${options.dryRun ? '(dry run)' : ''}`);
  console.log(`Manifest: ${options.manifestPath}`);
  for (const entry of manifest.entries || []) {
    const classification = classifyEntry(entry);
    if (!['present', 'candidate'].includes(classification)) {
      console.log(`keep       ${classification.padEnd(9)} ${entry.targetPath}`);
      continue;
    }
    if (!entry.sha256 || !fs.existsSync(entry.targetPath) || sha256File(entry.targetPath) !== entry.sha256) {
      console.log(`keep       protected ${entry.targetPath}`);
      continue;
    }
    console.log(`${options.dryRun ? 'would rm' : 'removed '}  ${entry.targetPath}`);
    if (!options.dryRun) fs.unlinkSync(entry.targetPath);
  }
}

function configCandidate(options) {
  const profile = options.profile || 'safe-interactive';
  const spec = configProfiles[profile];
  if (!spec) throw new Error(`Unknown config profile: ${profile}`);
  const body = [
    `# ${packageName} config candidate`,
    `# Profile: ${profile}`,
    `# ${spec.warning}`,
    '# This is not active config. Review and merge manually if appropriate.',
    '',
    ...spec.toml,
    '',
  ].join('\n');
  const out = path.join(options.codexHome, 'config.candidate', `${profile}.config.toml.candidate.${stamp}`);
  if (options.dryRun) {
    console.log(`would write ${out}`);
    console.log(`summary    ${body.split(/\r?\n/).find((line) => line.startsWith('# Profile:'))}`);
  } else {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, body);
    console.log(`candidate  ${out}`);
  }
  console.log(spec.warning);
}

function parseTomlishConfig(file) {
  const result = {};
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('[')) continue;
    const match = /^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/.exec(trimmed);
    if (match) result[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return result;
}

function configDoctor(options) {
  const configPath = path.join(options.codexHome, 'config.toml');
  console.log(`${packageName} config doctor`);
  if (fs.existsSync(configPath)) {
    console.log(`observed  config.toml present ${configPath}`);
    try {
      const parsed = parseTomlishConfig(configPath);
      for (const key of ['profile', 'sandbox_mode', 'approval_policy', 'approvals_reviewer']) {
        if (parsed[key] !== undefined) console.log(`observed  ${key} = ${parsed[key]}`);
      }
    } catch (err) {
      console.log(`unknown   parse failed: ${err.message}`);
    }
  } else {
    console.log(`observed  config.toml missing ${configPath}`);
  }
  console.log('inferred  CODEX_HOME ' + (process.env.CODEX_HOME ? `set to ${process.env.CODEX_HOME}` : 'not set; defaulting under user home'));
  console.log('proposed  run config candidate --profile safe-interactive for a review-only artifact');
  console.log('unknown   effective config may include app, IDE, managed, and trust-gated project layers');
  console.log('requires_probe runtime behavior should be checked non-destructively before documenting as guaranteed');
}

function candidateCommand(name, options) {
  const root = path.join(options.codexHome, `${name}.candidate`);
  const file = path.join(root, `README.md.candidate.${stamp}`);
  const text = `# ${packageName} ${name} candidate\n\nThis command seam is candidate-only in v0.2. It does not actively enable hooks, rules, compaction, project trust, full access, or RTK behavior.\n`;
  if (options.dryRun) {
    console.log(`would write ${file}`);
    console.log(`summary    ${text.split(/\r?\n/)[0]}`);
  } else {
    fs.mkdirSync(root, { recursive: true });
    fs.writeFileSync(file, text);
    console.log(`candidate  ${file}`);
  }
}

function candidateFileTarget(dst, options) {
  if (!fs.existsSync(dst)) return { target: dst, action: 'write' };
  if (options.force) return { target: dst, action: 'overwrite', backup: `${dst}.backup.${stamp}` };
  return { target: `${dst}.candidate.${stamp}`, action: 'candidate' };
}

function writeStandaloneCandidate(dst, content, options) {
  const { target, action, backup } = candidateFileTarget(dst, options);
  if (options.dryRun) {
    if (backup) console.log(`would backup ${dst} -> ${backup}`);
    console.log(`would ${action === 'overwrite' ? 'overwrite' : 'write'} ${target}`);
    return target;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (backup) fs.copyFileSync(dst, backup);
  fs.writeFileSync(target, content);
  if (backup) console.log(`backup     ${dst} -> ${backup}`);
  console.log(`${action === 'candidate' ? 'candidate' : action.padEnd(9)} ${target}`);
  return target;
}

function copyStandaloneCandidate(src, dst, options) {
  return writeStandaloneCandidate(dst, fs.readFileSync(src, 'utf8'), options);
}

function compactCandidateReadme(promptNames) {
  return [
    `# ${packageName} compaction prompt candidates`,
    '',
    'These files are candidate-only compaction prompts. They are copied under `compact.candidate/` so they can be reviewed without changing active Codex configuration.',
    '',
    'This command does not create or modify `config.toml`, does not enable compaction settings, and does not activate `compact_prompt` or `experimental_compact_prompt_file`.',
    '',
    'Prompt candidates:',
    ...promptNames.map((name) => `- prompts/${name}`),
    '',
    'Review current Codex documentation and your effective config before manually adopting any prompt.',
    '',
  ].join('\n');
}

function compactCandidateConfigFragment() {
  return [
    '# Candidate-only compaction config fragment',
    '# This file is not active config. The installer did not write config.toml.',
    '# Keep these examples commented unless you intentionally review and merge them.',
    '# Verify current Codex support before using either setting name.',
    '',
    '# compact_prompt = "<paste reviewed prompt text here>"',
    '# experimental_compact_prompt_file = "~/.codex/compact.candidate/prompts/general-continuation.md"',
    '',
  ].join('\n');
}

function compactCandidate(options) {
  const sourceDir = path.join(templates, 'compaction-prompts');
  if (!fs.existsSync(sourceDir)) throw new Error(`Compaction prompt templates not found: ${sourceDir}`);

  const root = path.join(options.codexHome, 'compact.candidate');
  const promptsRoot = path.join(root, 'prompts');
  const promptFiles = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((ent) => ent.isFile() && ent.name.endsWith('.md') && !isJunk(ent.name))
    .map((ent) => ent.name)
    .sort();
  if (!promptFiles.length) throw new Error(`No compaction prompt templates found: ${sourceDir}`);

  console.log(`${options.dryRun ? 'Dry run' : 'Candidate'} compaction prompts for ${packageName}`);
  console.log(`Codex home: ${options.codexHome}`);
  console.log('');
  for (const name of promptFiles) {
    copyStandaloneCandidate(path.join(sourceDir, name), path.join(promptsRoot, name), options);
  }
  writeStandaloneCandidate(path.join(root, 'README.md'), compactCandidateReadme(promptFiles), options);
  writeStandaloneCandidate(path.join(root, 'config.fragment.toml'), compactCandidateConfigFragment(), options);
  console.log('');
  console.log('Notes:');
  console.log('- Candidate-only: no active config.toml was created or modified.');
  console.log('- No compact_prompt or experimental_compact_prompt_file setting was activated.');
  console.log('- Review prompts and current Codex docs before manually adopting any compaction setting.');
}

function projectInspect(options) {
  const outDir = path.join(process.cwd(), '.codex-uplift', 'project');
  const out = path.join(outDir, 'observations.md');
  const observations = [
    `# ${packageName} Project Observations`,
    '',
    `- cwd: ${process.cwd()}`,
    `- AGENTS.md: ${fs.existsSync(path.join(process.cwd(), 'AGENTS.md')) ? 'present' : 'missing'}`,
    `- .codex/: ${fs.existsSync(path.join(process.cwd(), '.codex')) ? 'present' : 'missing'}`,
    '- unknown: project trust and effective project config require runtime confirmation.',
    '',
  ].join('\n');
  if (options.dryRun) {
    console.log(`would write ${out}`);
    console.log(`summary    ${observations.split(/\r?\n/)[0]}`);
  } else {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(out, observations);
    console.log(`report     ${out}`);
  }
}

function rtkEvaluate(options) {
  if (!options.planOnly) throw new Error('rtk evaluate currently requires --plan-only');
  console.log('plan-only  RTK evaluation is not actively enabled.');
  console.log('proposed   inventory recovery, audit, rollback, and test gates before any active RTK wiring.');
}

function verify(options) {
  const checks = [];
  const required = [
    path.join(templates, 'home', 'AGENTS.md'),
    path.join(templates, 'skills'),
    path.join(templates, 'agents'),
    path.join(templates, 'compaction-prompts'),
    path.join(templates, 'plugin', '.codex-plugin', 'plugin.json'),
    path.join(templates, 'plugin-marketplace', 'marketplace.json'),
  ];
  for (const target of required) checks.push([fs.existsSync(target), `exists ${path.relative(packageRoot, target)}`]);
  const compactionPromptDir = path.join(templates, 'compaction-prompts');
  const compactionPrompts = fs.existsSync(compactionPromptDir)
    ? fs.readdirSync(compactionPromptDir, { withFileTypes: true })
      .filter((ent) => ent.isFile() && ent.name.endsWith('.md') && !isJunk(ent.name))
      .map((ent) => ent.name)
      .sort()
    : [];
  checks.push([compactionPrompts.length >= 6, 'compaction prompt release templates are present']);
  const marketplace = JSON.parse(fs.readFileSync(path.join(templates, 'plugin-marketplace', 'marketplace.json'), 'utf8'));
  checks.push([marketplace.plugins?.[0]?.source?.path === './.codex/plugins/codex-uplift-kit', 'marketplace template uses default personal plugin path']);
  checks.push([isJunk('.DS_Store') && isJunk('Thumbs.db') && isJunk('notes.swp'), 'copy walker recognizes common junk file names']);
  const failed = checks.filter(([ok]) => !ok);
  for (const [ok, message] of checks) console.log(`${ok ? 'ok' : 'fail'} ${message}`);
  if (failed.length) process.exitCode = 1;
  else console.log(`verify ok for ${packageName}`);
  if (options) void options;
}

function main() {
  try {
    const { positionals, options } = parseArgs(process.argv.slice(2));
    if (options.help) {
      usage();
      return;
    }

    const command = positionals[0] || 'install';
    if (command === 'install') return runInstall(options);
    if (command === 'inspect') return inspect(options);
    if (command === 'status') return status(options);
    if (command === 'uninstall') return uninstall(options);
    if (command === 'verify') return verify(options);
    if (command === 'config' && positionals[1] === 'doctor') return configDoctor(options);
    if (command === 'config' && positionals[1] === 'candidate') return configCandidate(options);
    if (command === 'project' && positionals[1] === 'inspect') return projectInspect(options);
    if (command === 'project' && positionals[1] === 'candidate') return candidateCommand('project', options);
    if (command === 'rules' && positionals[1] === 'candidate') return candidateCommand('rules', options);
    if (command === 'hooks' && positionals[1] === 'candidate') return candidateCommand('hooks', options);
    if (command === 'compact' && positionals[1] === 'candidate') return compactCandidate(options);
    if (command === 'rtk' && positionals[1] === 'evaluate') return rtkEvaluate(options);
    throw new Error(`Unknown command: ${positionals.join(' ')}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    console.error('');
    usage();
    process.exit(2);
  }
}

main();
