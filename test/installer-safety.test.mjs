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

function readGeneratedConfigCandidate(t, profile) {
  const homes = makeTempHomes(t);
  const result = runCliWithHomes(['config', 'candidate', '--profile', profile], homes);
  assertSuccess(result, `config candidate ${profile}`);
  const candidateDir = path.join(homes.codexHome, 'config.candidate');
  const candidates = fs.readdirSync(candidateDir)
    .filter((file) => file.startsWith(`${profile}.config.toml.candidate.`));
  assert.equal(candidates.length, 1, `${profile} should create one config candidate`);
  return fs.readFileSync(path.join(candidateDir, candidates[0]), 'utf8');
}

function assertProfileCandidateShape(body, profile) {
  const escapedProfile = profile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(body, new RegExp(`^\\[profiles\\.${escapedProfile}\\]$`, 'm'), `${profile} should use a profile-scoped table`);
  assert.doesNotMatch(body, /^\s*profile\s*=/m, `${profile} should not activate a top-level default profile`);
  assert.doesNotMatch(body, /^\s*\[features\]\s*\r?\n\s*network_access\s*=/m, `${profile} should not use legacy feature-scoped network access`);
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

function expectedCompactionPromptNames() {
  return fs
    .readdirSync(path.join(templatesDir, 'compaction-prompts'), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
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
  assert.ok(entries.every((entry) => /^[a-f0-9]{64}$/.test(entry.sha256)), 'manifest sha256 values should be hex digests');
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

function assertLightweightTomlSyntax(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let inMultilineString = false;
  for (const [index, raw] of lines.entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const tripleQuoteCount = (line.match(/"""/g) || []).length;
    if (inMultilineString) {
      if (tripleQuoteCount > 0) inMultilineString = false;
      continue;
    }
    if (/^\[[A-Za-z0-9_.-]+\]$/.test(line)) continue;
    if (/^[A-Za-z0-9_.-]+\s*=/.test(line)) {
      if (tripleQuoteCount % 2 === 1) inMultilineString = true;
      continue;
    }
    assert.fail(`${file}:${index + 1} is not a recognized lightweight TOML line: ${raw}`);
  }
  assert.equal(inMultilineString, false, `${file} should close multiline strings`);
}

function npmPackDryRunFiles(t) {
  const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-uplift-npm-cache-'));
  t.after(() => fs.rmSync(cacheDir, { recursive: true, force: true }));
  const result = spawnSync('npm', ['pack', '--json', '--dry-run'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: cacheDir,
    },
  });
  assertSuccess(result, 'npm pack --json --dry-run');
  const stdout = result.stdout.trim();
  const jsonStart = stdout.indexOf('[');
  assert.notEqual(jsonStart, -1, `pack output should include JSON array\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  const pack = JSON.parse(stdout.slice(jsonStart))[0];
  assert.ok(pack, 'pack output should describe one package');
  return pack.files.map((file) => file.path).sort();
}

test('--help exits successfully', () => {
  const result = runCli(['--help']);
  assertSuccess(result, '--help');
  assertOutputIncludes(result, /Usage:/i, 'help output should include usage');
});

test('parser rejects invalid commands, modes, components, profiles, and missing values', (t) => {
  const homes = makeTempHomes(t);

  const invalidCommand = runCli(['wat']);
  assert.equal(invalidCommand.status, 2);
  assertOutputIncludes(invalidCommand, /Unknown command: wat/, 'invalid command should be rejected');

  const invalidMode = runCliWithHomes(['install', '--mode', 'chaos'], homes);
  assert.equal(invalidMode.status, 2);
  assertOutputIncludes(invalidMode, /Unknown install mode: chaos/, 'invalid install mode should be rejected');

  const invalidComponent = runCliWithHomes(['install', '--only', 'not-a-component'], homes);
  assert.equal(invalidComponent.status, 2);
  assertOutputIncludes(invalidComponent, /Unknown component ID\(s\): not-a-component/, 'invalid component should be rejected');

  const invalidProfile = runCliWithHomes(['config', 'candidate', '--profile', 'not-a-profile'], homes);
  assert.equal(invalidProfile.status, 2);
  assertOutputIncludes(invalidProfile, /Unknown config profile: not-a-profile/, 'invalid config profile should be rejected');

  const missingValue = runCli(['install', '--mode']);
  assert.equal(missingValue.status, 2);
  assertOutputIncludes(missingValue, /--mode requires a value/, 'missing flag value should be rejected');
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
  assert.ok(fs.existsSync(path.join(homes.codexHome, 'compaction-prompts', 'general-continuation.md')), 'classic install should write compaction prompt assets');
  assert.ok(fs.existsSync(manifestPath(homes.codexHome)), 'classic install should write manifest under the isolated Codex home');
  assertManifestHasEntries(homes.codexHome, 'classic');
});

test('component selection supports minimal, only, skip, components, and legacy aliases', (t) => {
  const minimal = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--mode', 'minimal'], minimal), 'minimal install');
  assert.ok(fs.existsSync(path.join(minimal.codexHome, 'AGENTS.md')), 'minimal should still install home AGENTS.md');
  assert.ok(fs.existsSync(path.join(minimal.codexHome, 'config.fragment.codex-uplift-kit.toml')), 'minimal should install config candidate fragment');
  assert.ok(fs.existsSync(manifestPath(minimal.codexHome)), 'minimal should write manifest');
  assert.equal(fs.existsSync(path.join(minimal.userHome, '.agents', 'skills')), false, 'minimal should skip standalone skills');
  assert.equal(fs.existsSync(path.join(minimal.codexHome, 'agents')), false, 'minimal should skip custom agents');
  assert.equal(fs.existsSync(path.join(minimal.codexHome, 'hooks.json.sample')), false, 'minimal should skip hook samples');
  assert.equal(fs.existsSync(path.join(minimal.codexHome, 'rules.codex-uplift-kit.candidate.md')), false, 'minimal should skip rule samples');
  assertManifestHasEntries(minimal.codexHome, 'minimal');

  const onlyPlugin = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--only', 'plugin'], onlyPlugin), '--only plugin install');
  assert.ok(fs.existsSync(path.join(onlyPlugin.codexHome, 'plugins', 'codex-uplift-kit')), '--only plugin should install plugin payload');
  assert.ok(fs.existsSync(path.join(onlyPlugin.userHome, '.agents', 'plugins', 'marketplace.json')), '--only plugin should write marketplace metadata');
  assert.equal(fs.existsSync(path.join(onlyPlugin.codexHome, 'AGENTS.md')), false, '--only plugin should not install home AGENTS.md');
  assert.equal(fs.existsSync(path.join(onlyPlugin.userHome, '.agents', 'skills')), false, '--only plugin should not install standalone skills');
  assert.equal(fs.existsSync(manifestPath(onlyPlugin.codexHome)), false, '--only plugin should not write manifest unless manifest is selected');

  const onlyCompaction = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--only', 'compaction-prompts,manifest'], onlyCompaction), '--only compaction-prompts install');
  assert.deepEqual(
    fs.readdirSync(path.join(onlyCompaction.codexHome, 'compaction-prompts')).filter((name) => name.endsWith('.md') && name !== 'README.md').sort(),
    expectedCompactionPromptNames(),
    '--only compaction-prompts should install prompt assets',
  );
  assert.equal(fs.existsSync(path.join(onlyCompaction.codexHome, 'config.toml')), false, '--only compaction-prompts should not create active config.toml');
  assert.ok(
    manifestEntries(readManifest(onlyCompaction.codexHome)).every((entry) => ['compaction-prompts'].includes(entry.componentId)),
    '--only compaction-prompts manifest entries should stay scoped to that component',
  );

  const skipped = makeTempHomes(t);
  assertSuccess(runCliWithHomes(['install', '--skip', 'skills,hook-samples'], skipped), '--skip install');
  assert.equal(fs.existsSync(path.join(skipped.userHome, '.agents', 'skills')), false, '--skip skills should omit standalone skills');
  assert.equal(fs.existsSync(path.join(skipped.codexHome, 'hooks.json.sample')), false, '--skip hook-samples should omit hook sample');
  assert.ok(fs.existsSync(path.join(skipped.codexHome, 'AGENTS.md')), '--skip should retain other classic components');

  const addedPlugin = makeTempHomes(t);
  const addedPluginResult = runCliWithHomes(['install', '--components', 'plugin'], addedPlugin);
  assertSuccess(addedPluginResult, '--components plugin install');
  assert.ok(fs.existsSync(path.join(addedPlugin.userHome, '.agents', 'skills')), '--components plugin should keep classic standalone skills');
  assert.ok(fs.existsSync(path.join(addedPlugin.codexHome, 'plugins', 'codex-uplift-kit', 'skills')), '--components plugin should add plugin skills');
  assertOutputIncludes(addedPluginResult, /duplicate skill names/i, '--components plugin should warn about duplicate skill names');

  const legacy = makeTempHomes(t);
  const legacyResult = runCliWithHomes(['install', '--install-plugin', '--skip-hooks', '--skip-agents'], legacy);
  assertSuccess(legacyResult, 'legacy alias install');
  assert.ok(fs.existsSync(path.join(legacy.codexHome, 'plugins', 'codex-uplift-kit')), '--install-plugin should add plugin component');
  assert.equal(fs.existsSync(path.join(legacy.codexHome, 'hooks.json.sample')), false, '--skip-hooks should skip hook samples');
  assert.equal(fs.existsSync(path.join(legacy.codexHome, 'agents')), false, '--skip-agents should skip custom agents');
  assertOutputIncludes(legacyResult, /duplicate skill names/i, '--install-plugin should warn when standalone and plugin skills both install');
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
  assert.ok(fs.existsSync(path.join(homes.codexHome, 'compaction-prompts', 'general-continuation.md')), 'plugin install should write compaction prompt assets');
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
  assert.equal(fs.existsSync(path.join(homes.codexHome, 'compaction-prompts')), false, 'dry-run compact candidate should not create compaction prompts directory');
  assert.equal(fs.existsSync(projectReportDir), false, 'dry-run project inspect should not create repo-local project report directory');
});

test('config doctor reports observed fixture config without mutating it', (t) => {
  const homes = makeTempHomes(t);
  const configPath = path.join(homes.codexHome, 'config.toml');
  fs.writeFileSync(configPath, [
    'profile = "safe-interactive"',
    'sandbox_mode = "workspace-write"',
    'approval_policy = "on-request"',
    'approvals_reviewer = "auto_review"',
    '',
  ].join('\n'));

  const before = fs.readFileSync(configPath, 'utf8');
  const result = runCliWithHomes(['config', 'doctor'], homes);
  assertSuccess(result, 'config doctor');
  assertOutputIncludes(result, /observed\s+config\.toml present/, 'config doctor should observe fixture config');
  assertOutputIncludes(result, /observed\s+profile = safe-interactive/, 'config doctor should report profile');
  assertOutputIncludes(result, /observed\s+sandbox_mode = workspace-write/, 'config doctor should report sandbox mode');
  assertOutputIncludes(result, /observed\s+approval_policy = on-request/, 'config doctor should report approval policy');
  assertOutputIncludes(result, /observed\s+approvals_reviewer = auto_review/, 'config doctor should report approvals reviewer');
  assert.equal(fs.readFileSync(configPath, 'utf8'), before, 'config doctor should not mutate config.toml');
});

test('candidate seams write inactive candidates and RTK remains plan-only', (t) => {
  for (const [command, candidateRoot] of [
    [['project', 'candidate'], 'project.candidate'],
    [['rules', 'candidate'], 'rules.candidate'],
    [['hooks', 'candidate'], 'hooks.candidate'],
  ]) {
    const homes = makeTempHomes(t);
    const result = runCliWithHomes(command, homes);
    assertSuccess(result, `${command.join(' ')} candidate`);
    const root = path.join(homes.codexHome, candidateRoot);
    assert.ok(fs.existsSync(root), `${command.join(' ')} should create candidate root`);
    assert.ok(
      fs.readdirSync(root).some((file) => file.startsWith('README.md.candidate.')),
      `${command.join(' ')} should write a timestamped README candidate`,
    );
    assert.equal(fs.existsSync(path.join(homes.codexHome, 'config.toml')), false, `${command.join(' ')} should not create active config.toml`);
    assert.equal(fs.existsSync(path.join(homes.codexHome, 'hooks.json')), false, `${command.join(' ')} should not create active hooks.json`);
  }

  const rtkHomes = makeTempHomes(t);
  const rtkPlan = runCliWithHomes(['rtk', 'evaluate', '--plan-only'], rtkHomes);
  assertSuccess(rtkPlan, 'rtk evaluate --plan-only');
  assertOutputIncludes(rtkPlan, /plan-only/i, 'RTK plan-only command should announce inactive plan-only behavior');
  assert.deepEqual(listRelativeFiles(rtkHomes.codexHome), [], 'RTK plan-only should not write files');

  const rtkActive = runCliWithHomes(['rtk', 'evaluate'], makeTempHomes(t));
  assert.equal(rtkActive.status, 2);
  assertOutputIncludes(rtkActive, /requires --plan-only/, 'RTK evaluate should reject active operation');
});

test('compact candidate generates all prompt candidates without active config mutation', (t) => {
  const homes = makeTempHomes(t);
  const result = runCliWithHomes(['compact', 'candidate'], homes);
  assertSuccess(result, 'compact candidate');

  const root = path.join(homes.codexHome, 'compaction-prompts');
  assert.deepEqual(
    fs.readdirSync(root).filter((name) => name.endsWith('.md') && name !== 'README.md').sort(),
    expectedCompactionPromptNames(),
    'compact candidate should copy every release prompt template',
  );
  assert.ok(fs.existsSync(path.join(root, 'README.md')), 'compact candidate should write review README');
  assert.ok(fs.existsSync(path.join(root, 'config.fragment.toml')), 'compact candidate should write inactive config fragment');
  assert.equal(fs.existsSync(path.join(homes.codexHome, 'config.toml')), false, 'compact candidate should not create active config.toml');

  const fragment = fs.readFileSync(path.join(root, 'config.fragment.toml'), 'utf8');
  assert.match(fragment, /^# compact_prompt =/m, 'compact config fragment should include commented compact_prompt example');
  assert.match(fragment, /^# experimental_compact_prompt_file =/m, 'compact config fragment should include commented file example');
  assert.match(fragment, /~\/\.codex\/compaction-prompts\/general-continuation\.md/, 'compact config fragment should point at installed prompt path');
  assert.doesNotMatch(fragment, /^\s*compact_prompt\s*=/m, 'compact candidate should not activate compact_prompt');
  assert.doesNotMatch(fragment, /^\s*experimental_compact_prompt_file\s*=/m, 'compact candidate should not activate experimental compact prompt file');
});

test('config candidates generate profile-scoped posture content', (t) => {
  const reviewOnly = readGeneratedConfigCandidate(t, 'review-only');
  assertProfileCandidateShape(reviewOnly, 'review-only');
  assert.match(reviewOnly, /^sandbox_mode = "read-only"$/m);
  assert.match(reviewOnly, /^approval_policy = "on-request"$/m);
  assert.match(reviewOnly, /^approvals_reviewer = "user"$/m);
  assert.match(reviewOnly, /^model_reasoning_effort = "high"$/m);
  assert.doesNotMatch(reviewOnly, /workspace-write/);
  assert.doesNotMatch(reviewOnly, /auto_review/);
  assert.doesNotMatch(reviewOnly, /sandbox_workspace_write/);

  const safeInteractive = readGeneratedConfigCandidate(t, 'safe-interactive');
  assertProfileCandidateShape(safeInteractive, 'safe-interactive');
  assert.match(safeInteractive, /^sandbox_mode = "workspace-write"$/m);
  assert.match(safeInteractive, /^approval_policy = "on-request"$/m);
  assert.match(safeInteractive, /^approvals_reviewer = "user"$/m);
  assert.match(safeInteractive, /^allow_login_shell = false$/m);
  assert.match(safeInteractive, /^\[profiles\.safe-interactive\.sandbox_workspace_write\]$/m);
  assert.match(safeInteractive, /^network_access = false$/m);

  const autonomousAudited = readGeneratedConfigCandidate(t, 'autonomous-audited');
  assertProfileCandidateShape(autonomousAudited, 'autonomous-audited');
  assert.match(autonomousAudited, /^sandbox_mode = "workspace-write"$/m);
  assert.match(autonomousAudited, /^approval_policy = "on-request"$/m);
  assert.match(autonomousAudited, /^approvals_reviewer = "auto_review"$/m);
  assert.match(autonomousAudited, /^allow_login_shell = false$/m);
  assert.match(autonomousAudited, /^default_permissions = "codex-uplift-autonomous"$/m);
  assert.match(autonomousAudited, /^\[profiles\.autonomous-audited\.sandbox_workspace_write\]$/m);
  assert.match(autonomousAudited, /^network_access = false$/m);

  const fullAccessReviewed = readGeneratedConfigCandidate(t, 'full-access-reviewed');
  assertProfileCandidateShape(fullAccessReviewed, 'full-access-reviewed');
  assert.match(fullAccessReviewed, /reviewed unsandboxed operation/);
  assert.match(fullAccessReviewed, /^sandbox_mode = "danger-full-access"$/m);
  assert.match(fullAccessReviewed, /^approval_policy = "on-request"$/m);
  assert.match(fullAccessReviewed, /^approvals_reviewer = "auto_review"$/m);
  assert.match(fullAccessReviewed, /^allow_login_shell = false$/m);
});

test('all config candidates avoid active profile activation and legacy network features', (t) => {
  const expectations = {
    'review-only': [/^sandbox_mode = "read-only"$/m, /^approvals_reviewer = "user"$/m],
    'safe-interactive': [/^network_access = false$/m],
    'autonomous-audited': [/^default_permissions = "codex-uplift-autonomous"$/m],
    'install-window': [/^network_access = true$/m],
    'net-limited': [/^network_access = true$/m],
    'full-access-reviewed': [/^sandbox_mode = "danger-full-access"$/m],
    'external-isolated': [/^network_access = false$/m],
    'ci-noninteractive': [/^approval_policy = "never"$/m, /^network_access = false$/m],
  };
  for (const [profile, patterns] of Object.entries(expectations)) {
    const body = readGeneratedConfigCandidate(t, profile);
    assertProfileCandidateShape(body, profile);
    for (const pattern of patterns) assert.match(body, pattern, `${profile} should include ${pattern}`);
  }
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
  assert.equal(
    readJson(path.join(templatesDir, 'plugin', '.codex-plugin', 'plugin.json')).version,
    packageVersion(),
    'plugin metadata version should match package version',
  );

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

test('package dry-run contains only expected release payload', (t) => {
  const files = npmPackDryRunFiles(t);
  const allowedRootFiles = new Set([
    'CHANGELOG.md',
    'LICENSE',
    'ORCHESTRATOR_AGENTS_FRAGMENT.md',
    'ORCHESTRATOR_INSTALL_PROMPT.md',
    'README.md',
    'RELEASE.md',
    'SECURITY.md',
    'package.json',
  ]);
  for (const file of files) {
    assert.ok(
      allowedRootFiles.has(file) || file.startsWith('bin/') || file.startsWith('templates/'),
      `${file} should be part of the explicit release payload`,
    );
    assert.equal(file.startsWith('.planning/'), false, `${file} should not include planning provenance`);
    assert.equal(file.startsWith('.codex-uplift/'), false, `${file} should not include local release artifacts`);
    assert.equal(file.includes('_late-orchestration-recovery'), false, `${file} should not include recovery package files`);
    assert.equal(file.includes('.DS_Store'), false, `${file} should not include OS junk`);
    assert.equal(file.endsWith('.tgz'), false, `${file} should not include package archives`);
    assert.equal(file.startsWith('tmp/'), false, `${file} should not include temp files`);
  }
  assert.ok(files.includes('bin/codex-uplift-init.mjs'), 'package should include CLI bin');
  assert.ok(files.includes('templates/compaction-prompts/general-continuation.md'), 'package should include compaction prompt release templates');
  assert.ok(files.includes('README.md'), 'package should include README');
  assert.ok(files.includes('LICENSE'), 'package should include LICENSE');
  assert.ok(files.includes('CHANGELOG.md'), 'package should include CHANGELOG');
  assert.ok(files.includes('SECURITY.md'), 'package should include SECURITY');
});

test('template JSON, hooks, TOML fragments, and compaction prompts are valid enough for alpha payload', () => {
  for (const file of [
    path.join(templatesDir, 'config', 'config.fragment.toml'),
    ...listFilesRecursive(path.join(templatesDir, 'agents')).filter((candidate) => candidate.endsWith('.toml')),
  ]) {
    assertLightweightTomlSyntax(file);
  }

  for (const prompt of expectedCompactionPromptNames()) {
    const body = fs.readFileSync(path.join(templatesDir, 'compaction-prompts', prompt), 'utf8');
    assert.match(body, /^#\s+\S/m, `${prompt} should have a Markdown heading`);
    assert.doesNotMatch(body, /^\s*compact_prompt\s*=/m, `${prompt} should not include active config`);
  }
});
