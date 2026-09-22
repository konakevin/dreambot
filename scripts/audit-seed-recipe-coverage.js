#!/usr/bin/env node
/**
 * audit-seed-recipe-coverage.js — can we actually GROW this pool, and with what?
 *
 * Step 1b of BOT_POOL_EXPANSION_STATE.md tops ~178 thin pools up toward 200. That plan silently
 * assumes every target still has a working generator. It might not: a pool can be hand-authored,
 * or its gen script can have been deleted in a refactor, and you only find out when you try to
 * spend money on it. This answers it statically, for free.
 *
 * Two live pipelines, so two places to look:
 *   MONO   scripts/gen-<bot>-pool.js — a POOL_RECIPES key per pool. Grow with:
 *          node scripts/gen-<bot>-pool.js --pool <name> --count 100   (means exactly +100)
 *   HELPER scripts/gen-seeds/<bot>/gen-*.js — a tiny script per pool calling seedGenHelper's
 *          generatePool({ outPath }). Grow with: SEED_TOTAL=<current+100> node <that script>
 *          (only safe where the script passes append:true — reported per pool)
 *   NONE   no generator found. Hand-authored, or the script was deleted. These need a recipe
 *          written before they can be grown, which is real work, not a batch.
 *
 * Usage:
 *   node scripts/audit-seed-recipe-coverage.js --wired /tmp/wiring.json
 *   node scripts/audit-seed-recipe-coverage.js --wired /tmp/wiring.json --max 120   # only thin pools
 *   node scripts/audit-seed-recipe-coverage.js --bot starbot --json out.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'bots');
const GEN_SEEDS = path.join(__dirname, 'gen-seeds');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const JSON_OUT = flag('--json');
const MAX = parseInt(flag('--max') || '0', 10);

// Structural / atomic axes we never expand: padding them manufactures near-duplicates, and several
// have documented ceilings well under 200 (race 50, class 36-50, hairstyle 44-50, accessory 49-98).
const STRUCTURAL =
  /(palette|colour|color|lighting|light|atmosphere|weather|sky|air|camera|framing|composition|vibe|look_register|time_of|skin|eyes|hair|face|facial|register|scale|anchor|prover|emotional|sensory|material|makeup|outfit|wardrobe|accessor|hairstyle|drama|phenomen|surprise|prop|detail|decor|amenity|moment|gag|augment)/i;
const CEILING = /(_class|_age|_race|_species|_lineage)$/i;

/** Index every monolithic generator's POOL_RECIPES keys. */
function monoIndex() {
  const idx = new Map(); // bot -> Set(poolName)
  for (const f of fs.readdirSync(__dirname)) {
    const m = f.match(/^gen-([a-z]+)-pool\.js$/);
    if (!m) continue;
    const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const keys = new Set();
    // recipe keys look like `  pool_name: {` or `  'pool-name': {`
    for (const k of src.matchAll(/^\s{2}'?([a-z0-9_]{4,})'?\s*:\s*\{/gm)) keys.add(k[1]);
    idx.set(m[1], keys);
  }
  return idx;
}

/** Index every per-pool gen-seeds script by the seed file it writes. */
function helperIndex() {
  const idx = new Map(); // "bot/pool" -> { script, append }
  if (!fs.existsSync(GEN_SEEDS)) return idx;
  for (const bot of fs.readdirSync(GEN_SEEDS)) {
    const dir = path.join(GEN_SEEDS, bot);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.js')) continue;
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      // generateBucketScenes (lib/yumbotBucketGen.js) passes append:true internally and is
      // idempotent, so a script that uses it is safe even without its own append key.
      const append = /append\s*:\s*true/.test(src) || /generateBucketScenes/.test(src);
      // outPath usually ends in seeds/<pool>.json
      for (const m of src.matchAll(/seeds['"`/,\s]*[,)]?\s*['"`]?([a-z0-9_]+)\.json/gi)) {
        idx.set(`${bot}/${m[1]}`, { script: `gen-seeds/${bot}/${f}`, append });
      }
      for (const m of src.matchAll(/['"`]([a-z0-9_]{4,})\.json['"`]/gi)) {
        const k = `${bot}/${m[1]}`;
        if (!idx.has(k)) idx.set(k, { script: `gen-seeds/${bot}/${f}`, append });
      }
    }
  }
  return idx;
}

const mono = monoIndex();
const helper = helperIndex();

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

const rows = [];
for (const bot of (ONLY ? [ONLY] : fs.readdirSync(ROOT)).sort()) {
  const seedDir = path.join(ROOT, bot, 'seeds');
  if (!fs.existsSync(seedDir)) continue;
  for (const f of fs.readdirSync(seedDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const pool = f.replace(/\.json$/, '');
    if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(pool)) continue;
    if (STRUCTURAL.test(pool) || CEILING.test(pool)) continue;
    let n = 0;
    try {
      const d = JSON.parse(fs.readFileSync(path.join(seedDir, f), 'utf8'));
      n = Array.isArray(d) ? d.length : 0;
    } catch {
      continue;
    }
    if (MAX && n >= MAX) continue;
    const hasMono = (mono.get(bot) || new Set()).has(pool);
    const h = helper.get(`${bot}/${pool}`);
    rows.push({
      bot,
      pool,
      n,
      how: hasMono ? 'MONO' : h ? 'HELPER' : 'NONE',
      script: hasMono ? `gen-${bot}-pool.js --pool ${pool} --count 100` : h ? h.script : '',
      append: h ? h.append : hasMono ? true : false,
    });
  }
}

const by = (k) => rows.filter((r) => r.how === k);
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log(`CONTENT pools examined: ${rows.length}${MAX ? ` (under ${MAX} entries)` : ''}\n`);
console.log(`  MONO   (gen-<bot>-pool.js --pool X --count 100): ${by('MONO').length}`);
console.log(`  HELPER (gen-seeds script, SEED_TOTAL=<n>):       ${by('HELPER').length}  of which append:true ${by('HELPER').filter((r) => r.append).length}`);
console.log(`  NONE   (needs a recipe written first):           ${by('NONE').length}`);

const byBot = new Map();
for (const r of rows) {
  const b = byBot.get(r.bot) || { MONO: 0, HELPER: 0, NONE: 0 };
  b[r.how]++;
  byBot.set(r.bot, b);
}
console.log('\n' + pad('bot', 12) + num('MONO', 6) + num('HELPER', 8) + num('NONE', 6));
for (const [bot, b] of [...byBot].sort((a, b) => b[1].NONE - a[1].NONE)) {
  console.log(pad(bot, 12) + num(b.MONO, 6) + num(b.HELPER, 8) + num(b.NONE, 6));
}

if (by('NONE').length) {
  console.log('\nNO GENERATOR — these cannot be batch-grown as planned:');
  for (const r of by('NONE').slice(0, 40)) console.log(`  ${r.bot}/${r.pool} (${r.n})`);
  if (by('NONE').length > 40) console.log(`  … +${by('NONE').length - 40} more`);
}

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(rows, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}
