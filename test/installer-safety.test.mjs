import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const cliPath = path.join(repoRoot, 'bin', 'codex-uplift-init.mjs');
const packageJsonPath = path.join(repoRoot, 'package.json');
const templatesDir = path.join(repoRoot, 'templates');
const junkFileNames = new Set([
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
]);

function makeTempHomes(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-uplift-test-'));
  const codexHome = path.join(root, 'codex-home');
  const userHome = path.join(root, 'user-home');
  fs.mkdirSync(codexHome, { recursive: true });
  fs.mkdirSync(userHome, { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, codexHome, userHome };
}

function runCli(args, options = {}) {
  const env = {
    ...process.env,
    HOME: options.userHome ?? path.join(os.tmpdir(), 'codex-uplift-unused-home'),
    ...options.env,
  };
  if (options.omitCodexHomeEnv) {
    delete env.CODEX_HOME;
  } else {
    env.CODEX_HOME = options.codexHome ?? path.join(os.tmpdir(), 'codex-uplift-unused-codex-home');
  }
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    input: options.input,
    env,
  });
}

function runCliWithHomes(args, homes, options = {}) {
  return runCli([
    ...args,
    '--home',
    homes.codexHome,
    '--user-home',
    homes.userHome,
  ], {
    ...options,
    codexHome: homes.codexHome,
    userHome: homes.userHome,
  });
}

function assertSuccess(result, label) {
  assert.equal(
    result.status,
    0,
    `${label} should exit successfully\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
}

function assertOutputIncludes(result, pattern, label) {
  const output = `${result.stdout}\n${result.stderr}`;
  assert.match(output, pattern, `${label}\noutput:\n${output}`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile()) out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

function listRelativeFiles(dir) {
  return listFilesRecursive(dir).map((file) => path.relative(dir, file)).sort();
}

function packageVersion() {
  return readJson(packageJsonPath).version;
}

function expectedStandaloneSkillNames() {
  return fs
    .readdirSync(path.join(templatesDir, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function expectedPluginSkillNames() {
  return fs
    .readdirSync(path.join(templatesDir, 'plugin', 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function manifestPath(codexHome) {
  return path.join(codexHome, 'codex-uplift-kit', 'manifest.json');
}

function readManifest(codexHome) {
  return readJson(manifestPath(codexHome));
}

function manifestEntries(manifest) {
  if (Array.isArray(manifest.entries)) return manifest.entries;
  if (Array.isArray(manifest.files)) return manifest.files;
  return [];
}

function assertManifestHasEntries(codexHome, mode) {
  const manifest = readManifest(codexHome);
  const entries = manifestEntries(manifest);
  const topLevelPackageName = typeof manifest.package === 'string'
    ? manifest.package
    : manifest.package?.name;
  assert.equal(topLevelPackageName ?? manifest.packageName ?? manifest.name, 'codex-uplift-kit');
  assert.equal(manifest.package?.version ?? manifest.packageVersion ?? manifest.version, packageVersion());
  assert.ok(entries.length > 0, 'manifest should contain installed file entries');
  assert.ok(entries.every((entry) => (entry.package?.name ?? entry.package) === 'codex-uplift-kit'), 'manifest entries should record package name');
  assert.ok(entries.every((entry) => (entry.package?.version ?? entry.version) === packageVersion()), 'manifest entries should record package version');
  assert.ok(entries.every((entry) => entry.installMode === mode || entry.mode === mode), `manifest entries should record ${mode} mode`);
  assert.ok(entries.every((entry) => entry.componentId ?? entry.component), 'manifest entries should record component IDs');
  assert.ok(entries.every((entry) => entry.kind), 'manifest entries should record kind');
  assert.ok(
    entries.every((entry) => entry.kind === 'candidate' || (entry.sourcePath ?? entry.source)),
    'manifest copied-file entries should record source paths',
  );
  assert.ok(entries.every((entry) => entry.targetPath ?? entry.target), 'manifest entries should record target paths');
  assert.ok(entries.every((entry) => entry.actionType ?? entry.action), 'manifest entries should record action type');
  assert.ok(entries.every((entry) => entry.sha256), 'manifest entries should record sha256 for written content');
  assert.ok(entries.every((entry) => entry.timestamp), 'manifest entries should record timestamps');
  return { manifest, entries };
}

function findCandidateFiles(root) {
  return listFilesRecursive(root).filter((file) => /\.candidate\.[^/]+$/.test(file));
}

function findBackupFiles(root) {
  return listFilesRecursive(root).filter((file) => /\.backup\.[^/]+$/.test(file));
}

function assertNoJunkFiles(dir) {
  const junk = listFilesRecursive(dir).filter((file) => junkFileNames.has(path.basename(file)));
  assert.deepEqual(
    junk.map((file) => path.relative(dir, file)),
    [],
    'installed plugin copy should exclude platform/editor junk files',
  );
}

test('--help exits successfully', () => {
  const result = runCli(['--help']);
  assertSuccess(result, '--help');
  assertOutputIncludes(result, /Usage:/i, 'help output should include usage');
});

test('install --mode classic writes standalone skills and a manifest in temp homes', (t) => {
  const homes = makeTempHomes(t);
  const result = runCliWithHomes(['install', '--mode', 'classic'], homes);
  assertSuccess(result, 'classic install');

  const skillRoot = path.join(homes.userHome, '.agents', 'skills');
  assert.deepEqual(
    fs.readdirSync(skillRoot).sort(),
    expectedStandaloneSkillNames(),
    'classic install should copy standalone skills under the isolated user home',
  );
  assert.ok(fs.existsSync(path.join(homes.codexHome, 'AGENTS.md')), 'classic install should write home AGENTS.md');
  assert.ok(fs.existsSync(manifestPath(homes.codexHome)), 'classic install should write manifest under the isolated Codex home');
  assertManifestHasEntries(homes.codexHome, 'classic');
});

test('install --mode plugin skips standalone skills and writes resolvable marketplace metadata', (t) => {
  const homes = makeTempHomes(t);
  const result = runCliWithHomes(['install', '--mode', 'plugin'], homes);
  assertSuccess(result, 'plugin install');

  assert.equal(
    fs.existsSync(path.join(homes.userHome, '.agents', 'skills')),
    false,
    'plugin mode should skip standalone skills by default',
  );

  const pluginRoot = path.join(homes.codexHome, 'plugins', 'codex-uplift-kit');
  assert.ok(fs.existsSync(path.join(pluginRoot, '.codex-plugin', 'plugin.json')), 'plugin install should copy plugin metadata');
  assert.deepEqual(
    fs.readdirSync(path.join(pluginRoot, 'skills')).sort(),
    expectedPluginSkillNames(),
    'plugin install should copy plugin-packaged skills',
  );
  assertNoJunkFiles(pluginRoot);

  const marketplacePath = path.join(homes.userHome, '.agents', 'plugins', 'marketplace.json');
  const marketplace = readJson(marketplacePath);
  const entry = marketplace.plugins.find((plugin) => plugin.name === 'codex-uplift-kit');
  assert.ok(entry, 'marketplace metadata should include codex-uplift-kit plugin entry');
  assert.equal(entry.source?.source, 'local', 'marketplace entry should use a local source');
  assert.ok(entry.source?.path, 'marketplace entry should include source.path');

  const documentedMarketplaceRoot = homes.userHome;
  const resolvedPluginRoot = path.resolve(documentedMarketplaceRoot, entry.source.path);
  assert.equal(
    path.normalize(resolvedPluginRoot),
    path.normalize(pluginRoot),
    'marketplace source.path should resolve from the marketplace root to the copied plugin',
  );
  assert.ok(
    fs.existsSync(path.join(resolvedPluginRoot, '.codex-plugin', 'plugin.json')),
    'resolved marketplace plugin path should contain .codex-plugin/plugin.json',
  );
  assertManifestHasEntries(homes.codexHome, 'plugin');
});

test('default personal plugin marketplace source.path resolves from user home to default Codex plugin', (t) => {
  const { root, userHome } = makeTempHomes(t);
  const defaultCodexHome = path.join(userHome, '.codex');

  const result = runCli(['install', '--mode', 'plugin', '--user-home', userHome], {
    userHome,
    omitCodexHomeEnv: true,
  });
  assertSuccess(result, 'default personal plugin install');

  const marketplacePath = path.join(userHome, '.agents', 'plugins', 'marketplace.json');
  const marketplace = readJson(marketplacePath);
  const entry = marketplace.plugins.find((plugin) => plugin.name === 'codex-uplift-kit');
  assert.ok(entry, 'marketplace metadata should include codex-uplift-kit plugin entry');
  assert.equal(entry.source?.path, './.codex/plugins/codex-uplift-kit');

  const resolvedPluginRoot = path.resolve(userHome, entry.source.path);
  assert.equal(
    path.normalize(resolvedPluginRoot),
    path.normalize(path.join(defaultCodexHome, 'plugins', 'codex-uplift-kit')),
    'personal marketplace source.path should resolve from user home to the default Codex plugin copy',
  );
  assert.ok(
    fs.existsSync(path.join(resolvedPluginRoot, '.codex-plugin', 'plugin.json')),
    'resolved default personal plugin path should contain .codex-plugin/plugin.json',
  );
  assert.equal(
    listRelativeFiles(root).some((file) => file.includes('unused-codex-home')),
    false,
    'default personal install should not use fallback CODEX_HOME when only --user-home is provided',
  );
});

test('custom Codex home outside user home uses absolute marketplace path fallback with warning', (t) => {
  const homes = makeTempHomes(t);
  const externalCodexHome = path.join(homes.root, 'external-codex-home');

  const result = runCli(['install', '--mode', 'plugin', '--home', externalCodexHome, '--user-home', homes.userHome], {
    codexHome: externalCodexHome,
    userHome: homes.userHome,
  });
  assertSuccess(result, 'external Codex home plugin install');
  assertOutputIncludes(result, /outside user-home marketplace root|absolute marketplace source\.path/i, 'external Codex home should be explicit');

  const marketplace = readJson(path.join(homes.userHome, '.agents', 'plugins', 'marketplace.json'));
  const entry = marketplace.plugins.find((plugin) => plugin.name === 'codex-uplift-kit');
  assert.ok(path.isAbsolute(entry.source?.path), 'external Codex home should use an absolute marketplace source.path fallback');
  assert.equal(
    path.normalize(entry.source.path),
    path.normalize(path.join(externalCodexHome, 'plugins', 'codex-uplift-kit')),
    'absolute fallback should point to the copied plugin',
  );
});

test('install --mode hybrid is explicit and surfaces duplicate skill behavior', (t) => {
  const homes = makeTempHomes(t);
  const result = runCliWithHomes(['install', '--mode', 'hybrid'], homes);
  assertSuccess(result, 'hybrid install');

  assert.ok(
    fs.existsSync(path.join(homes.userHome, '.agents', 'skills')),
    'hybrid mode should install standalone skills explicitly',
  );
  assert.ok(
    fs.existsSync(path.join(homes.codexHome, 'plugins', 'codex-uplift-kit', 'skills')),
    'hybrid mode should also install plugin skills explicitly',
  );
  assertOutputIncludes(
    result,
    /duplicate|collision|same skill|hybrid/i,
    'hybrid install should surface duplicate skill names or duplicate-warning behavior',
  );
  assertManifestHasEntries(homes.codexHome, 'hybrid');
});

test('second install with fewer components preserves prior manifest entries', (t) => {
  const homes = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--mode', 'classic'], homes), 'initial classic install');
  const firstManifest = readManifest(homes.codexHome);
  const firstEntries = manifestEntries(firstManifest);
  const skillEntries = firstEntries.filter((entry) => entry.componentId === 'skills');
  assert.ok(skillEntries.length > 0, 'initial manifest should include standalone skill entries');

  assertSuccess(runCliWithHomes(['install', '--mode', 'minimal'], homes), 'second minimal install');
  const secondManifest = readManifest(homes.codexHome);
  const secondEntries = manifestEntries(secondManifest);
  const secondTargets = new Set(secondEntries.map((entry) => entry.targetPath));

  for (const entry of skillEntries) {
    assert.ok(
      secondTargets.has(entry.targetPath),
      `minimal reinstall should preserve prior managed skill entry for ${entry.targetPath}`,
    );
  }
  assert.ok(
    secondEntries.some((entry) => entry.action === 'candidate' && entry.componentId === 'home-agents'),
    'minimal reinstall should add candidate entries for existing files without dropping previous entries',
  );
});

test('existing target files create candidates without overwriting', (t) => {
  const homes = makeTempHomes(t);
  const target = path.join(homes.codexHome, 'AGENTS.md');
  fs.writeFileSync(target, 'user-owned AGENTS content\n');

  const result = runCliWithHomes(['install', '--mode', 'classic'], homes);
  assertSuccess(result, 'candidate install');

  assert.equal(fs.readFileSync(target, 'utf8'), 'user-owned AGENTS content\n', 'existing file should not be overwritten');
  const candidates = findCandidateFiles(homes.codexHome);
  assert.ok(
    candidates.some((file) => file.startsWith(`${target}.candidate.`)),
    'installer should write a timestamped candidate beside the existing target',
  );
});

test('--force creates backups before overwrite', (t) => {
  const homes = makeTempHomes(t);
  const target = path.join(homes.codexHome, 'AGENTS.md');
  fs.writeFileSync(target, 'user-owned AGENTS content\n');

  const result = runCliWithHomes(['install', '--mode', 'classic', '--force'], homes);
  assertSuccess(result, 'forced install');

  assert.notEqual(fs.readFileSync(target, 'utf8'), 'user-owned AGENTS content\n', 'force should overwrite the target');
  const backups = findBackupFiles(homes.codexHome);
  const backup = backups.find((file) => file.startsWith(`${target}.backup.`));
  assert.ok(backup, 'force should write a timestamped backup beside the overwritten target');
  assert.equal(fs.readFileSync(backup, 'utf8'), 'user-owned AGENTS content\n', 'backup should preserve original content');
});

test('status classifies manifest-owned installed, missing, modified, and candidate files', (t) => {
  const homes = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--mode', 'classic'], homes), 'classic install for status');

  const { entries } = assertManifestHasEntries(homes.codexHome, 'classic');
  const targets = entries.map((entry) => entry.targetPath ?? entry.target).filter(Boolean);
  assert.ok(targets.length >= 3, 'status fixture needs several manifest-owned files');
  fs.appendFileSync(targets[0], '\nuser modification\n');
  fs.rmSync(targets[1], { force: true });
  fs.writeFileSync(`${targets[2]}.candidate.test`, 'candidate content\n');

  const result = runCliWithHomes(['status'], homes);
  assertSuccess(result, 'status');
  assertOutputIncludes(result, /installed|present/i, 'status should classify installed or present files');
  assertOutputIncludes(result, /missing/i, 'status should classify missing files');
  assertOutputIncludes(result, /modified/i, 'status should classify modified files');
  assertOutputIncludes(result, /candidate/i, 'status should classify candidate files');
});

test('uninstall --dry-run preserves files and uninstall leaves modified files', (t) => {
  const homes = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--mode', 'classic'], homes), 'classic install for uninstall');

  const { entries } = assertManifestHasEntries(homes.codexHome, 'classic');
  const targets = entries.map((entry) => entry.targetPath ?? entry.target).filter(Boolean);
  assert.ok(targets.length >= 2, 'uninstall fixture needs at least two manifest-owned files');
  const cleanTarget = targets[0];
  const modifiedTarget = targets[1];
  fs.appendFileSync(modifiedTarget, '\nuser modification\n');

  const dryRun = runCliWithHomes(['uninstall', '--dry-run'], homes);
  assertSuccess(dryRun, 'uninstall dry-run');
  assert.ok(fs.existsSync(cleanTarget), 'dry-run uninstall should not remove unmodified files');
  assert.ok(fs.existsSync(modifiedTarget), 'dry-run uninstall should not remove modified files');

  const uninstall = runCliWithHomes(['uninstall'], homes);
  assertSuccess(uninstall, 'uninstall');
  assert.equal(fs.existsSync(cleanTarget), false, 'uninstall should remove unmodified manifest-owned files');
  assert.ok(fs.existsSync(modifiedTarget), 'uninstall should leave modified manifest-owned files in place');
  assertOutputIncludes(uninstall, /modified|left|preserv/i, 'uninstall should report modified files left in place');
});

test('dry-run candidate and project inspect commands do not write files', (t) => {
  const homes = makeTempHomes(t);
  const projectRoot = path.join(homes.root, 'project-root');
  fs.mkdirSync(projectRoot, { recursive: true });
  const projectReportDir = path.join(projectRoot, '.codex-uplift', 'project');

  for (const args of [
    ['config', 'candidate', '--profile', 'safe-interactive'],
    ['project', 'candidate'],
    ['rules', 'candidate'],
    ['hooks', 'candidate'],
    ['compact', 'candidate'],
    ['project', 'inspect'],
  ]) {
    const result = runCliWithHomes([...args, '--dry-run'], homes, { cwd: projectRoot });
    assertSuccess(result, `${args.join(' ')} dry-run`);
    assertOutputIncludes(result, /would write/i, `${args.join(' ')} should report intended writes`);
  }

  assert.equal(fs.existsSync(path.join(homes.codexHome, 'config.candidate')), false, 'dry-run config candidate should not create config candidate directory');
  assert.equal(fs.existsSync(path.join(homes.codexHome, 'project.candidate')), false, 'dry-run project candidate should not create project candidate directory');
  assert.equal(fs.existsSync(path.join(homes.codexHome, 'rules.candidate')), false, 'dry-run rules candidate should not create rules candidate directory');
  assert.equal(fs.existsSync(path.join(homes.codexHome, 'hooks.candidate')), false, 'dry-run hooks candidate should not create hooks candidate directory');
  assert.equal(fs.existsSync(path.join(homes.codexHome, 'compact.candidate')), false, 'dry-run compact candidate should not create compact candidate directory');
  assert.equal(fs.existsSync(projectReportDir), false, 'dry-run project inspect should not create repo-local project report directory');
});

test('JSON templates parse and hook samples return valid deny/stop output shapes', () => {
  for (const file of [
    path.join(templatesDir, 'hooks', 'hooks.json.sample'),
    path.join(templatesDir, 'plugin', '.codex-plugin', 'plugin.json'),
    path.join(templatesDir, 'plugin-marketplace', 'marketplace.json'),
    packageJsonPath,
  ]) {
    assert.doesNotThrow(() => readJson(file), `${file} should parse as JSON`);
  }

  const preTool = spawnSync(process.execPath, [path.join(templatesDir, 'hooks', 'pretool-protect-git.mjs')], {
    cwd: repoRoot,
    encoding: 'utf8',
    input: JSON.stringify({ tool_input: { command: 'git reset --hard HEAD' } }),
  });
  assertSuccess(preTool, 'destructive git hook sample');
  const preToolOutput = JSON.parse(preTool.stdout);
  assert.equal(preToolOutput.hookSpecificOutput?.hookEventName, 'PreToolUse');
  assert.equal(preToolOutput.hookSpecificOutput?.permissionDecision, 'deny');
  assert.match(preToolOutput.hookSpecificOutput?.permissionDecisionReason, /destructive|Blocked/i);

  const stopHook = spawnSync(process.execPath, [path.join(templatesDir, 'hooks', 'stop-audit-shape.mjs')], {
    cwd: repoRoot,
    encoding: 'utf8',
    input: JSON.stringify({ last_assistant_message: 'I changed the installer.' }),
    env: { ...process.env, CODEX_UPLIFT_ENFORCE_STOP_AUDIT: '1' },
  });
  assertSuccess(stopHook, 'stop audit hook sample');
  const stopOutput = JSON.parse(stopHook.stdout);
  assert.equal(stopOutput.decision, 'block');
  assert.match(stopOutput.reason, /audit summary|verification/i);
});

test('package hygiene templates and installed plugin copy exclude platform junk', (t) => {
  const homes = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--mode', 'plugin'], homes), 'plugin install for hygiene');
  assertNoJunkFiles(path.join(homes.codexHome, 'plugins', 'codex-uplift-kit'));
});
