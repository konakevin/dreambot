#!/usr/bin/env node
/**
 * scan-bucket-eligibility.js — will every bucket in the fleet actually roll?
 *
 * A bucket is a named sub-theme tagged inside one pool. Some pools are read whole (tags are
 * bookkeeping); others are tag-filtered per path, and there a bucket whose tag is missing from the
 * path's allowed list is SILENTLY DROPPED: no error, zero renders, healthy-looking seed file.
 *
 * Logic lives in lib/bucketEligibility.js and is locked by
 * __tests__/lib/bucketEligibility.test.ts. This is the fleet runner; it exits 1 on any error-level
 * finding so it can gate a commit.
 *
 * Usage:
 *   node scripts/scan-bucket-eligibility.js
 *   node scripts/scan-bucket-eligibility.js --bot yumbot -v
 *   node scripts/scan-bucket-eligibility.js --wired /tmp/wiring.json      # also flag unwired pools
 *   node scripts/scan-bucket-eligibility.js --will-roll yumbot:YUMBOT_PLACES_SCENES:night-market
 */
const fs = require('fs');
const path = require('path');
const { auditBot, willBucketRoll, tagVocabulary, filterSites } = require('./lib/bucketEligibility');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const WILL_ROLL = flag('--will-roll');
const VERBOSE = argv.includes('-v') || argv.includes('--verbose');
const BASELINE = argv.includes('--baseline');

/**
 * Pools whose unreachable buckets are KNOWN, accepted legacy debt, exempted under --baseline.
 *
 * All three are YumBot shared catalogues built when several paths were meant to draw from one
 * creature/decor/landscape list (COTTAGECORE / FESTIVAL / CAFE / MAMMAL / BIRD ...). YumBot later
 * moved to per-path `yumbot_<path>_companions` pools and only candy-fantasy and rainbow-dreamscape
 * still wire these, so about half of tiny_companions (97 of 200 entries) can never roll. The
 * reachable half serves both live paths correctly, so this is dead weight rather than a bug.
 *
 * The same list is asserted by __tests__/lib/bucketEligibility.test.ts, which is the actual commit
 * gate (it runs inside `npm run test`). Adding a pool here without fixing it needs a reason.
 */
const KNOWN_DEBT = new Set(['yumbot/decor_items', 'yumbot/tiny_companions', 'yumbot/landscape_features']);

/** Every .js in a bot module, concatenated — the search space for filter call sites. */
function allSrcOf(dir) {
  let out = '';
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'seeds') walk(p);
      } else if (e.name.endsWith('.js')) out += fs.readFileSync(p, 'utf8') + '\n';
    }
  };
  walk(dir);
  return out;
}

/** pool SYMBOL -> seed file basename, from pools.js load()/loadOptional()/require() forms. */
function symbolMapOf(dir) {
  const f = path.join(dir, 'pools.js');
  const map = new Map();
  if (!fs.existsSync(f)) return map;
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/([A-Z][A-Z0-9_]*)\s*[:=]\s*load(?:Optional)?\(\s*'([^']+)'/g)) {
    map.set(m[1], m[2]);
  }
  for (const m of src.matchAll(/([A-Z][A-Z0-9_]*)\s*[:=]\s*require\(\s*'[^']*seeds\/([^']+)\.json'/g)) {
    map.set(m[1], m[2]);
  }
  return map;
}

const bots = (ONLY ? [ONLY] : fs.readdirSync(ROOT)).filter((b) =>
  fs.existsSync(path.join(ROOT, b, 'pools.js'))
);

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

// ── one-off pre-flight ────────────────────────────────────────────────────────
if (WILL_ROLL) {
  const [bot, symbol, tag] = WILL_ROLL.split(':');
  if (!bot || !symbol || !tag) {
    console.error('Usage: --will-roll <bot>:<POOL_SYMBOL>:<tag>');
    process.exit(2);
  }
  const r = willBucketRoll({ symbol, tag, allSrc: allSrcOf(path.join(ROOT, bot)) });
  const mark = r.ok === true ? 'YES' : r.ok === false ? 'NO' : 'UNKNOWN';
  console.log(`Will bucket '${tag}' roll in ${bot}/${symbol}?  ${mark}\n  ${r.reason}`);
  if (r.action) console.log(`  action: ${r.action}`);
  process.exit(r.ok === false ? 1 : 0);
}

// ── fleet scan ────────────────────────────────────────────────────────────────
const all = [];
let bucketedPools = 0;
let buckets = 0;
for (const bot of bots.sort()) {
  const dir = path.join(ROOT, bot);
  const symbolToFile = symbolMapOf(dir);
  const seedDir = path.join(dir, 'seeds');
  const readPool = (file) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(seedDir, `${file}.json`), 'utf8'));
    } catch {
      return null;
    }
  };
  for (const [, file] of symbolToFile) {
    const v = tagVocabulary(readPool(file) || []);
    if (v.tagged) {
      bucketedPools++;
      buckets += v.tags.size;
    }
  }
  all.push(
    ...auditBot({
      bot,
      allSrc: allSrcOf(dir),
      symbolToFile,
      readPool,
      wiredPools: wiredIndex ? wiredIndex.get(bot) : null,
    })
  );
}

const isDebt = (f) => BASELINE && f.kind === 'UNREACHABLE_TAG' && KNOWN_DEBT.has(`${f.bot}/${f.pool}`);
const errors = all.filter((f) => f.severity === 'error' && !isDebt(f));
const warnings = all.filter((f) => f.severity === 'warning');
const exempted = all.filter(isDebt).length;

console.log(
  `Bucketed pools scanned: ${bucketedPools} across ${bots.length} bots (${buckets} buckets total)\n`
);

const KIND_ORDER = ['UNREACHABLE_TAG', 'EMPTY_FILTER', 'SHAPE_MIX', 'UNWIRED_POOL', 'STARVED_BUCKET'];
for (const kind of KIND_ORDER) {
  const rows = all.filter((f) => f.kind === kind);
  if (!rows.length) continue;
  const sev = rows[0].severity === 'error' ? 'ERROR' : 'warn';
  console.log(`── ${kind} (${rows.length}) [${sev}] ──`);
  for (const r of rows.slice(0, VERBOSE ? 200 : 15)) {
    console.log(`  ${r.bot}/${r.pool}${r.tag ? ` [${r.tag}]` : ''}\n      ${r.detail}`);
  }
  if (rows.length > (VERBOSE ? 200 : 15)) console.log(`  … +${rows.length - (VERBOSE ? 200 : 15)} more (-v)`);
  console.log('');
}

if (BASELINE && exempted) {
  console.log(`(${exempted} known-legacy findings exempted by --baseline: ${[...KNOWN_DEBT].join(', ')})\n`);
}
if (!errors.length) {
  console.log(`OK: every bucket in the fleet is eligible to roll.${warnings.length ? ` (${warnings.length} warnings)` : ''}`);
  process.exit(0);
}
console.log(`FAIL: ${errors.length} error-level finding(s) — those buckets would never appear in a render.`);
process.exit(1);
