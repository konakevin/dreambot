#!/usr/bin/env node
/**
 * Produces lib/acknowledgements.json — OSS attribution data for the
 * Settings → Acknowledgements screen. Required for MIT/BSD/Apache/ISC
 * attribution compliance (all require reproducing the copyright + license).
 *
 * Two things keep the file small while staying fully compliant:
 *   1. Scoped to the PRODUCTION dependency tree (`npm ls --omit=dev`) — dev /
 *      build-time tooling (babel, eslint, jest, metro, typescript…) never ships
 *      in the binary, so it isn't attributed.
 *   2. License text is DEDUPED. The same MIT/ISC/BSD body is repeated for
 *      hundreds of packages, differing only in the copyright line — so we factor
 *      the copyright line out (stored per-package) and keep ONE shared body per
 *      unique text, with a placeholder where the copyright goes. The screen
 *      reconstructs the exact original text at render time. This cuts the file
 *      ~5x without dropping any attribution.
 *
 * Output shape:
 *   {
 *     packages: [{ name, version, license, homepage, author, copyright, textHash }],
 *     texts: { "<hash>": "<license body with __ACK_COPYRIGHT__ placeholder>" }
 *   }
 *
 * Run after dependency changes:  node scripts/generate-acknowledgements.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const NODE_MODULES = path.join(ROOT, 'node_modules');
const OUT = path.join(ROOT, 'lib', 'acknowledgements.json');
const COPYRIGHT_PLACEHOLDER = '__ACK_COPYRIGHT__';

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {
    return null;
  }
}

function readLicenseText(pkgDir) {
  const candidates = [
    'LICENSE',
    'LICENSE.md',
    'LICENSE.txt',
    'license',
    'license.md',
    'License',
    'License.md',
    'COPYING',
  ];
  for (const name of candidates) {
    const p = path.join(pkgDir, name);
    try {
      const txt = fs.readFileSync(p, 'utf8').trim();
      if (txt.length > 0) return txt;
    } catch (_) {
      // continue
    }
  }
  return null;
}

function normalizeLicense(license) {
  if (!license) return 'UNLICENSED';
  if (typeof license === 'string') return license;
  if (license.type) return license.type;
  if (Array.isArray(license)) return license.map((l) => l.type || l).join(' / ');
  return 'UNKNOWN';
}

/**
 * Factor the copyright line(s) out of a license body so the remaining template
 * dedupes across packages. Returns { template, copyright, hash }. Only
 * templatizes a single contiguous copyright block (covers MIT/ISC/BSD); if
 * factoring wouldn't reconstruct the original EXACTLY, falls back to the full
 * text with an empty copyright (still correct, just not deduped).
 */
function templatize(text) {
  const lines = text.split('\n');
  const cIdx = [];
  for (let i = 0; i < lines.length; i++) {
    // A copyright NOTICE line — one that starts with "Copyright" or "(c)/©".
    // Critically NOT the MIT permission clause ("The above copyright notice…"),
    // which merely mentions the word and would break contiguous detection.
    if (/^\s*(copyright\b|\(c\)|©)/i.test(lines[i])) cIdx.push(i);
  }
  let template = text;
  let copyright = '';
  const contiguous = cIdx.length > 0 && cIdx[cIdx.length - 1] - cIdx[0] === cIdx.length - 1;
  if (contiguous && !text.includes(COPYRIGHT_PLACEHOLDER)) {
    const start = cIdx[0];
    const end = cIdx[cIdx.length - 1];
    const block = lines.slice(start, end + 1).join('\n');
    const candidate = lines
      .slice(0, start)
      .concat([COPYRIGHT_PLACEHOLDER], lines.slice(end + 1))
      .join('\n');
    // Only accept if it reconstructs the original byte-for-byte.
    if (candidate.replace(COPYRIGHT_PLACEHOLDER, block) === text) {
      template = candidate;
      copyright = block;
    }
  }
  const hash = crypto.createHash('sha1').update(template).digest('hex').slice(0, 12);
  return { template, copyright, hash };
}

function walk(dir, found) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const subDir = path.join(dir, entry.name);
    if (entry.name.startsWith('@')) {
      walk(subDir, found); // scoped namespace — recurse one level
      continue;
    }
    if (entry.name === '.bin' || entry.name === '.cache') continue;
    const pkg = readJsonSafe(path.join(subDir, 'package.json'));
    if (!pkg || !pkg.name) continue;
    const key = `${pkg.name}@${pkg.version}`;
    if (found.has(key)) continue;
    found.set(key, {
      name: pkg.name,
      version: pkg.version || 'unknown',
      license: normalizeLicense(pkg.license || pkg.licenses),
      homepage: pkg.homepage || null,
      author: typeof pkg.author === 'string' ? pkg.author : pkg.author?.name || null,
      licenseText: readLicenseText(subDir),
    });
    const nested = path.join(subDir, 'node_modules');
    if (fs.existsSync(nested)) walk(nested, found);
  }
}

/** Set of package names in the PRODUCTION tree (excludes devDependencies). */
function prodPackageNames() {
  let out = '';
  try {
    out = execSync('npm ls --omit=dev --all --parseable', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      maxBuffer: 128 * 1024 * 1024,
    });
  } catch (e) {
    // npm ls exits non-zero on peer/extraneous warnings but still prints the
    // tree to stdout — recover it from the thrown error.
    out = e && e.stdout ? e.stdout.toString() : '';
  }
  const names = new Set();
  const marker = '/node_modules/';
  for (const line of out.split('\n')) {
    const idx = line.lastIndexOf(marker);
    if (idx !== -1) names.add(line.slice(idx + marker.length));
  }
  if (names.size === 0) {
    throw new Error('npm ls --omit=dev produced no output — cannot scope to production deps');
  }
  return names;
}

const found = new Map();
walk(NODE_MODULES, found);

const prod = prodPackageNames();
const raw = Array.from(found.values())
  .filter((p) => !p.name.startsWith('@types/')) // type-only packages ship no runtime
  .filter((p) => prod.has(p.name)) // production tree only
  .sort((a, b) => a.name.localeCompare(b.name));

const texts = {};
const packages = raw.map((p) => {
  let copyright = '';
  let textHash = null;
  if (p.licenseText) {
    const t = templatize(p.licenseText);
    texts[t.hash] = t.template;
    copyright = t.copyright;
    textHash = t.hash;
  }
  return {
    name: p.name,
    version: p.version,
    license: p.license,
    homepage: p.homepage,
    author: p.author,
    copyright,
    textHash,
  };
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ packages, texts }, null, 2));

const sizeMb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
const withText = packages.filter((p) => p.textHash).length;
console.log(`✓ Wrote ${packages.length} production packages to ${path.relative(ROOT, OUT)} (${sizeMb} MB)`);
console.log(`  ${withText} with license text · ${Object.keys(texts).length} unique license bodies`);
const counts = {};
packages.forEach((p) => (counts[p.license] = (counts[p.license] || 0) + 1));
console.log('  Top licenses:');
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .forEach(([lic, n]) => console.log(`    ${lic}: ${n}`));
