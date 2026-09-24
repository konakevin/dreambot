#!/usr/bin/env node
/**
 * audit-bot-pool-wiring.js — which seed pools are actually REACHABLE from a live bot path.
 *
 * Why this exists (BOT_POOL_EXPANSION_STATE.md step 0): growing a pool that no live path reads
 * is pure waste, and the playbook's "wiring audit checklist" says to run it BEFORE any pool
 * expansion batch. A raw `seeds/*.json` count over-states the work by ~10-25% because every axis
 * migration left its pre-axis "one big scene pool" on disk, still `load()`ed but never picked.
 *
 * Reachability = bot.paths[] (+ seasonalPaths) -> paths/<path>.js -> pool SYMBOL -> pools.js
 * load('<file>') -> seeds/<file>.json. Shadow paths are reported separately: they are dev-only
 * and never in the public rotation.
 *
 * Text-parsed on purpose (no require of a bot module), so a bot with missing seed files still
 * audits. Two non-standard loaders are resolved explicitly:
 *   - pixelbot scene paths: scene.loadScenePools('<prefix>', SLOTS) -> pixelbot_<prefix>_<slot>
 *   - brickbot legacy triplets: PER_PATH[p] = load(`${toFile(p)}_{scenes,lighting,palette}`)
 *
 * Usage:
 *   node scripts/audit-bot-pool-wiring.js                 # fleet summary
 *   node scripts/audit-bot-pool-wiring.js --bot starbot   # one bot, verbose
 *   node scripts/audit-bot-pool-wiring.js --json out.json # machine-readable
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY = flag('--bot');
const JSON_OUT = flag('--json');

// Bots that are dark or broken; audited but flagged, never expansion targets.
const DARK = new Set(['outlawbot']);
const PRIVATE = new Set(['alphabot']);

/** Strip // and /* *\/ comments without touching string/template contents. */
function stripComments(src) {
  let out = '';
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const c = src[i];
    const c2 = src[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') {
        out += c2 || '';
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c;
      out += c;
      i++;
      continue;
    }
    if (c === '/' && c2 === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && c2 === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Body of the bracketed literal starting at src[open]. */
function bracketBody(src, open, oc = '[', cc = ']') {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === oc) depth++;
    else if (src[i] === cc) {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return '';
}

const strings = (text) =>
  [...text.matchAll(/'([^'\n]+)'|"([^"\n]+)"/g)].map((m) => m[1] || m[2]);

/** Resolve an array body to a flat string list, following ...SPREADS across sources. */
function resolveBody(body, srcs, seen) {
  const out = strings(body);
  for (const m of body.matchAll(/\.\.\.([A-Za-z_$][\w$]*)/g)) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    out.push(...resolveNamed(m[1], srcs, seen));
  }
  return out;
}

/** Resolve `const NAME = [...]` or `NAME: [...]` from any of srcs. */
function resolveNamed(name, srcs, seen = new Set()) {
  for (const src of srcs) {
    for (const re of [
      new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*(?:new\\s+Set\\(\\s*)?\\[`),
      new RegExp(`\\b${name}\\s*:\\s*(?:new\\s+Set\\(\\s*)?\\[`),
    ]) {
      const m = src.match(re);
      if (m) return resolveBody(bracketBody(src, src.indexOf('[', m.index)), srcs, seen);
    }
  }
  return [];
}

/** Live path list from index.js (`paths:` may be a literal, an identifier, or pools.X). */
function livePaths(idx, poolsSrc) {
  const srcs = [idx, poolsSrc];
  const m = idx.match(/\n\s*paths\s*:\s*(\[|[A-Za-z_$][\w$.]*)/);
  if (!m) return [];
  if (m[1] === '[') return resolveBody(bracketBody(idx, idx.indexOf('[', m.index)), srcs, new Set());
  const name = m[1].split('.').pop();
  return resolveNamed(name, srcs, new Set());
}

/** All strings inside a `key: { ... }` object block. */
function objectStrings(src, key) {
  const m = src.match(new RegExp(`\\b${key}\\s*:\\s*\\{`));
  if (!m) return [];
  return strings(bracketBody(src, src.indexOf('{', m.index), '{', '}'));
}

/** symbol -> seed file, from pools.js load()/loadOptional()/require() forms. */
function symbolMap(poolsSrc) {
  const map = new Map();
  const pats = [
    /([A-Z][A-Z0-9_]*)\s*:\s*loadOptional\(\s*['"]([^'"]+)['"]/g,
    /([A-Z][A-Z0-9_]*)\s*:\s*load\(\s*['"]([^'"]+)['"]/g,
    /(?:const|let|var)\s+([A-Z][A-Z0-9_]*)\s*=\s*loadOptional\(\s*['"]([^'"]+)['"]/g,
    /(?:const|let|var)\s+([A-Z][A-Z0-9_]*)\s*=\s*load\(\s*['"]([^'"]+)['"]/g,
    /([A-Z][A-Z0-9_]*)\s*:\s*require\(\s*['"][^'"]*seeds\/([^'"]+)\.json['"]/g,
  ];
  for (const re of pats) {
    for (const m of poolsSrc.matchAll(re)) if (!map.has(m[1])) map.set(m[1], m[2]);
  }
  return map;
}

function auditBot(bot) {
  const dir = path.join(ROOT, bot);
  const seedDir = path.join(dir, 'seeds');
  if (!fs.existsSync(seedDir)) return null;
  const read = (p) => (fs.existsSync(p) ? stripComments(fs.readFileSync(p, 'utf8')) : '');
  const idx = read(path.join(dir, 'index.js'));
  const poolsSrc = read(path.join(dir, 'pools.js'));
  const symbols = symbolMap(poolsSrc);

  const live = [...new Set(livePaths(idx, poolsSrc))];
  const seasonal = [...new Set(objectStrings(idx, 'seasonalPaths'))];
  const shadowM = idx.match(/\n\s*shadowPaths\s*:\s*(\[|[A-Za-z_$][\w$.]*)/);
  let shadow = [];
  if (shadowM) {
    shadow =
      shadowM[1] === '['
        ? resolveBody(bracketBody(idx, idx.indexOf('[', shadowM.index)), [idx, poolsSrc], new Set())
        : resolveNamed(shadowM[1].split('.').pop(), [idx, poolsSrc], new Set());
  }

  const onDisk = fs
    .readdirSync(seedDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));

  const reachable = new Set();
  const missing = new Set();
  const unresolvedPaths = [];
  const foreignPaths = [];

  const addFile = (file) => {
    if (!file) return;
    if (onDisk.includes(file)) reachable.add(file);
    else missing.add(file);
  };
  const addSymbol = (sym) => {
    if (symbols.has(sym)) addFile(symbols.get(sym));
    else if (onDisk.includes(sym.toLowerCase())) reachable.add(sym.toLowerCase());
  };

  for (const p of [...live, ...seasonal]) {
    // A path's builder is normally ./paths/<p>.js, but a bot may require another bot's builder
    // (alphabot hosts 7 farmbot paths), so fall back to the pathBuilders require target.
    let pf = [path.join(dir, 'paths', `${p}.js`), path.join(dir, 'paths', 'legacy', `${p}.js`)].find(
      fs.existsSync
    );
    if (!pf) {
      const req = idx.match(new RegExp(`['"]${p}['"]\\s*:\\s*require\\(\\s*['"]([^'"]+)['"]`));
      if (req) {
        const cand = path.resolve(dir, req[1].endsWith('.js') ? req[1] : `${req[1]}.js`);
        if (fs.existsSync(cand)) pf = cand;
      }
    }
    if (!pf) {
      unresolvedPaths.push(p);
      continue;
    }
    // A builder borrowed from another bot reads THAT bot's seeds; they are counted there.
    if (!pf.startsWith(dir)) {
      foreignPaths.push(p);
      continue;
    }
    const src = stripComments(fs.readFileSync(pf, 'utf8'));

    // declarative `pools: { axis: 'SYMBOL' }` + `{ name: 'SYMBOL', tags: [...] }`
    for (const s of objectStrings(src, 'pools')) addSymbol(s);
    for (const m of src.matchAll(/\bname\s*:\s*['"]([A-Z][A-Z0-9_]*)['"]/g)) addSymbol(m[1]);
    // direct `pools.SYMBOL` / poolByName('SYMBOL')
    for (const m of src.matchAll(/\bpools\.([A-Z][A-Z0-9_]*)/g)) addSymbol(m[1]);
    for (const m of src.matchAll(/poolByName\(\s*['"]([A-Z][A-Z0-9_]*)['"]/g)) addSymbol(m[1]);
    // direct seed requires (seasonal + farmbot place pools)
    for (const m of src.matchAll(/require\(\s*['"][^'"]*seeds\/([^'"]+)\.json['"]/g)) addFile(m[1]);
    // pixelbot templated scene loader
    for (const m of src.matchAll(/loadScenePools\(\s*['"]([^'"]+)['"]\s*,\s*([A-Za-z_$][\w$]*)/g)) {
      for (const slot of resolveNamed(m[2], [src], new Set())) addFile(`pixelbot_${m[1]}_${slot}`);
    }
  }

  // bot-level pools referenced from index.js itself (rollSharedDNA, defaultPools, look registers)
  for (const m of idx.matchAll(/\bpools\.([A-Z][A-Z0-9_]*)/g)) addSymbol(m[1]);
  for (const key of ['defaultPools']) for (const s of objectStrings(idx, key)) addSymbol(s);

  // brickbot legacy per-path triplets, generated in pools.js from PATHS
  if (bot === 'brickbot') {
    const skip = new Set(resolveNamed('SKIP_LEGACY_PER_PATH', [poolsSrc], new Set()));
    for (const p of live) {
      if (skip.has(p)) continue;
      const f = p.replace(/-/g, '_');
      for (const s of ['scenes', 'lighting', 'palette']) addFile(`${f}_${s}`);
    }
  }

  // Three tiers. WIRED: reachable from a live/seasonal path. DORMANT: the file is still referenced
  // somewhere in the module (pools.js load(), a parked path, an archetype file) but no live path
  // picks it, so growing it changes nothing. ORPHAN: no literal reference anywhere, safe to delete.
  let allSrc = '';
  const walkJs = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'seeds') walkJs(p);
      } else if (e.name.endsWith('.js')) allSrc += fs.readFileSync(p, 'utf8');
    }
  };
  walkJs(dir);
  const litRefs = new Set(
    [...allSrc.matchAll(/['"`]([A-Za-z0-9_]{3,})['"`]/g)].map((m) => m[1].toLowerCase())
  );
  // A pool required by FULL PATH — `require('../seeds/farmbot_red_barn_scenes.json')`, how every
  // FarmBot place path loads its bespoke pool — is not a bare quoted token, so the scan above
  // misses it entirely and the file lands in ORPHAN ("safe to delete"). It is DORMANT: a parked
  // path still requires it. Harvesting these was the difference between 84 orphans and 63, and
  // deleting the 21 FarmBot files would have broken every one of those paths on re-activation.
  for (const m of allSrc.matchAll(/seeds\/([A-Za-z0-9_.-]+)\.json/g)) litRefs.add(m[1].toLowerCase());
  const notLive = onDisk.filter((f) => !reachable.has(f));
  const dormant = notLive.filter((f) => litRefs.has(f.toLowerCase()));
  const dormantSet = new Set(dormant);
  const orphans = notLive.filter((f) => !dormantSet.has(f));
  const count = (f) => {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(seedDir, `${f}.json`), 'utf8'));
      return Array.isArray(d) ? d.length : 0;
    } catch {
      return 0;
    }
  };
  const sum = (arr) => arr.reduce((s, f) => s + count(f), 0);

  return {
    bot,
    dark: DARK.has(bot),
    private: PRIVATE.has(bot),
    livePaths: live.length,
    seasonalPaths: seasonal.length,
    shadowPaths: shadow.length,
    unresolvedPaths,
    foreignPaths,
    filesOnDisk: onDisk.length,
    reachable: [...reachable].sort(),
    reachableEntries: sum([...reachable]),
    dormant: dormant.sort(),
    dormantEntries: sum(dormant),
    orphans: orphans.sort(),
    orphanEntries: sum(orphans),
    missing: [...missing].sort(),
  };
}

const bots = (ONLY ? [ONLY] : fs.readdirSync(ROOT)).filter((b) =>
  fs.existsSync(path.join(ROOT, b, 'seeds'))
);
const results = bots.map(auditBot).filter(Boolean);

const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);
console.log(
  pad('bot', 12) +
    num('paths', 6) +
    num('files', 6) +
    num('wired', 6) +
    num('w_entries', 11) +
    num('dormant', 9) +
    num('d_entries', 11) +
    num('orphan', 8) +
    num('missing', 9)
);
for (const r of results) {
  console.log(
    pad(r.bot + (r.dark ? '*' : r.private ? '~' : ''), 12) +
      num(r.livePaths + r.seasonalPaths, 6) +
      num(r.filesOnDisk, 6) +
      num(r.reachable.length, 6) +
      num(r.reachableEntries.toLocaleString(), 11) +
      num(r.dormant.length, 9) +
      num(r.dormantEntries.toLocaleString(), 11) +
      num(r.orphans.length, 8) +
      num(r.missing.length, 9)
  );
}
const T = (k) => results.reduce((s, r) => s + (Array.isArray(r[k]) ? r[k].length : r[k]), 0);
const liveOnly = results.filter((r) => !r.dark && !r.private);
console.log('\n* dark/broken bot   ~ private proving ground');
console.log(
  `FLEET: ${T("filesOnDisk")} files, ${T("reachable")} wired, ${T("orphans")} orphaned (${results
    .reduce((s, r) => s + r.orphanEntries, 0)
    .toLocaleString()} entries), ${T('missing')} referenced-but-absent`
);
console.log(
  `LIVE PUBLIC BOTS ONLY: ${liveOnly.reduce((s, r) => s + r.reachable.length, 0)} wired pools, ` +
    `${liveOnly.reduce((s, r) => s + r.reachableEntries, 0).toLocaleString()} entries`
);
for (const r of results) {
  if (r.unresolvedPaths.length) console.log(`  ! ${r.bot}: no path file for ${r.unresolvedPaths.join(', ')}`);
  if (r.missing.length) console.log(`  ! ${r.bot}: ${r.missing.length} missing seed files (${r.missing.slice(0, 4).join(', ')}${r.missing.length > 4 ? ', …' : ''})`);
}

if (ONLY) {
  const r = results[0];
  console.log(`\n--- ${ONLY} orphans (${r.orphans.length}) ---`);
  for (const f of r.orphans) console.log(`  ${f}`);
}
if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(results, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}
