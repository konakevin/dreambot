#!/usr/bin/env node
/**
 * Walks node_modules and produces lib/acknowledgements.json — a deduped
 * sorted list of every package that ships in the JS bundle along with its
 * version, license type, and the full license text. Required for OSS
 * attribution compliance (MIT/BSD/Apache/ISC all require it).
 *
 * Run after dependency changes:
 *   node scripts/generate-acknowledgements.js
 *
 * Output: lib/acknowledgements.json (committed to repo, displayed by
 * Settings → Acknowledgements screen).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NODE_MODULES = path.join(ROOT, 'node_modules');
const OUT = path.join(ROOT, 'lib', 'acknowledgements.json');

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
      // Scoped namespace — recurse one level
      walk(subDir, found);
      continue;
    }
    if (entry.name === '.bin' || entry.name === '.cache') continue;
    const pkgPath = path.join(subDir, 'package.json');
    const pkg = readJsonSafe(pkgPath);
    if (!pkg || !pkg.name) continue;
    const key = `${pkg.name}@${pkg.version}`;
    if (found.has(key)) continue;
    found.set(key, {
      name: pkg.name,
      version: pkg.version || 'unknown',
      license: normalizeLicense(pkg.license || pkg.licenses),
      homepage: pkg.homepage || null,
      author:
        typeof pkg.author === 'string'
          ? pkg.author
          : pkg.author?.name || null,
      licenseText: readLicenseText(subDir),
    });
    // Recurse into nested node_modules (npm allows this for resolution)
    const nested = path.join(subDir, 'node_modules');
    if (fs.existsSync(nested)) walk(nested, found);
  }
}

const found = new Map();
walk(NODE_MODULES, found);

// Filter to only packages that ship in the app bundle. Heuristic: any
// dependency declared anywhere in the tree (not just devDependencies of the
// root). license-checker tools do similar. We include everything we found
// and let the user judge — for a JS app, all of node_modules potentially
// ends up in the bundle via Metro transitive imports.
const list = Array.from(found.values())
  .filter((p) => !p.name.startsWith('@types/')) // type-only packages don't ship runtime code
  .sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(list, null, 2));

const withText = list.filter((p) => p.licenseText).length;
const withoutText = list.length - withText;
console.log(`✓ Wrote ${list.length} packages to ${path.relative(ROOT, OUT)}`);
console.log(`  ${withText} with license text, ${withoutText} without`);
console.log(`  Top licenses:`);
const counts = {};
list.forEach((p) => (counts[p.license] = (counts[p.license] || 0) + 1));
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .forEach(([lic, n]) => console.log(`    ${lic}: ${n}`));
