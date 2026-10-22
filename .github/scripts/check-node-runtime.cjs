// October 2026 security floor; no dependencies or untrusted compressed input.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const cp = require('node:child_process');
const zlib = require('node:zlib');
function supported(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return false;
  const [, major, minor, patch] = match.map(Number);
  const floor = {22: [23, 4], 24: [22, 1], 26: [12, 1]}[major];
  return !!floor && (minor > floor[0] || (minor === floor[0] && patch >= floor[1]));
}
module.exports = {supported};
if (require.main === module) {
  assert(supported(process.versions.node), `Unsupported/unpatched Node ${process.versions.node}`);
  const payload = Buffer.from('October 2026 benign Brotli roundtrip');
  assert.deepEqual(zlib.brotliDecompressSync(zlib.brotliCompressSync(payload)), payload);
  const paths = ['.github/workflows/*', '*Dockerfile*', '*Containerfile*', '*compose*.yml', '*compose*.yaml', '.nvmrc', '**/.nvmrc', '.node-version', '**/.node-version', 'package.json', '**/package.json', 'deploy/*.service', '.run/*.plist'];
  const files = cp.execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', ...paths], {encoding: 'utf8'}).split('\0').filter(Boolean);
  function check(version, file) {
    assert(supported(version), `Unsafe/floating Node pin in ${file}: ${version}`);
  }
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (/(^|\/)\.(?:nvmrc|node-version)$/.test(file)) check(source.trim(), file);
    if (/(^|\/)package\.json$/.test(file)) {
      const node = JSON.parse(source).volta?.node;
      if (node !== undefined) check(node, file);
    }
    if (/^\.github\/workflows\/.*\.ya?ml$/.test(file)) {
      for (const match of source.matchAll(/node-version:\s*["']?([^\s"'#]+)/g)) check(match[1], file);
    }
    if (/(^|\/)(?:Dockerfile|Containerfile)[^/]*$|\.(?:service|plist)$/.test(file)) {
      for (const match of source.matchAll(/^FROM\s+(?:--platform=\S+\s+)?node:([^\s@-]+)/gmi)) check(match[1], file);
      assert(!/nodesource\.com\/(?:setup_|node_)|ARG NODE_MAJOR/.test(source), `Unpinned Node installer in ${file}`);
      for (const match of source.matchAll(/nodejs\.org\/dist\/v([^/\s"']+)/g)) check(match[1], file);
      for (const match of source.matchAll(/node-versions\/v?([^/]+)\/installation\/bin\/node/g)) check(match[1], file);
      assert(!/(?:apt(?:-get)?|apk|yum|dnf)\s+(?:install|add)\b[^;&]*(?:\bnodejs\b|\bnpm\b)/.test(source), `Unversioned distro Node install in ${file}`);
      assert(!/\/Applications\/(?:Codex|Cursor)\.app\/[^\n<]*\/node(?:<|\s|$)/.test(source), `Unpinned vendor Node launcher in ${file}`);
    }
    if (/compose[^/]*\.ya?ml$/i.test(file)) {
      for (const match of source.matchAll(/^\s*image:\s*["']?node:([^\s"'@-]+)/gmi)) check(match[1], file);
    }
  }
  console.log(`Node ${process.versions.node}; Brotli ${process.versions.brotli}; floor, deployment pins and benign roundtrip OK`);
}
