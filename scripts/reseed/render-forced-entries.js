#!/usr/bin/env node
/* global __dirname */
/**
 * render-forced-entries.js — forced SHADOW renders of chosen subject-pool entries on one bot path.
 *
 * Why: the picker is a shuffle-bag, so an unforced batch mostly draws OLD entries (the pilot drew
 * 1 new entry in 6). A repaired pool is judged by FORCING the path to render the entries you name,
 * one at a time, posted as shadow so Kevin reviews them in the app. See the `reseed` skill and
 * RESEED_STATUS.md.
 *
 *   # one subject slot
 *   node scripts/reseed/render-forced-entries.js --bot bloombot --path flower-friends \
 *        --slot flower_focal_cluster --indices 27,22,30 [--out <dir>] [--no-post]
 *
 *   # several slots at once (a path with two subject pools): lists are aligned, render k forces
 *   # every slot to its k-th index
 *   node scripts/reseed/render-forced-entries.js --bot bloombot --path flower-humming-birds \
 *        --force hummingbird_cast=12,40,7 --force flower_focal_cluster=3,61,9
 *
 * Indices are 1-based positions in the pool (the numbering the repair report + review page use).
 * --pool <slot>=<seed .json> overrides where a slot's pool is read from (legacy function-form
 * paths); declarative paths resolve it from the path's `pools[slot]` constant via the bot's pools.js.
 * --out where the images + render-results.json go (default: a scratch dir under os.tmpdir()).
 *
 * One render at a time, gated on DB pool headroom (Hard Rule: never more than 3 concurrent renders).
 * Writes <out>/render-results.json = [{ k, forced:{slot:index}, tag, ok, url, model, finalPrompt, err }].
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
process.chdir(ROOT);
require('dotenv').config({ path: path.join(ROOT, '.env.local') });
const { runBot } = require('../lib/botEngine');
const { waitForHeadroom } = require('../lib/poolHeadroom');

const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const flags = (n) => argv.map((a, i) => (a === n ? argv[i + 1] : null)).filter(Boolean);
const BOT = flag('--bot');
const PATH = flag('--path');
const POST = !argv.includes('--no-post');
const OUT = flag('--out') || path.join(os.tmpdir(), `reseed-${BOT}-${PATH}-${Date.now()}`);

const parseList = (s) =>
  String(s || '')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);

// { slot: [i1, i2, ...] } — from --slot/--indices or repeated --force slot=i,i,i
const FORCED = {};
if (flag('--slot')) FORCED[flag('--slot')] = parseList(flag('--indices'));
for (const f of flags('--force')) {
  const [slot, list] = f.split('=');
  if (slot && list) FORCED[slot] = parseList(list);
}
const SLOTS = Object.keys(FORCED);
const N = SLOTS.length ? FORCED[SLOTS[0]].length : 0;
if (!BOT || !PATH || !SLOTS.length || !N || SLOTS.some((s) => FORCED[s].length !== N)) {
  console.error(
    'usage: --bot <bot> --path <path> (--slot <slot> --indices 1,2,3 | --force <slot>=1,2,3 [--force <slot2>=4,5,6]) [--pool <slot>=<json>] [--out <dir>] [--no-post]\n(all forced lists must have the same length)'
  );
  process.exit(1);
}
const POOL_OVERRIDE = {};
for (const f of flags('--pool')) {
  const [slot, file] = f.split('=');
  if (slot && file) POOL_OVERRIDE[slot] = file;
}

const bot = require(path.join(ROOT, 'scripts', 'bots', BOT));

function loadPool(slot) {
  if (POOL_OVERRIDE[slot]) return JSON.parse(fs.readFileSync(POOL_OVERRIDE[slot], 'utf8'));
  let config = bot.pathBuilders ? bot.pathBuilders[PATH] : null;
  if (!config) {
    try {
      config = require(path.join(ROOT, 'scripts', 'bots', BOT, 'paths', PATH));
    } catch {
      config = null;
    }
  }
  if (!config || !config.pools || !config.pools[slot]) {
    throw new Error(
      `cannot resolve the seed pool for ${BOT}/${PATH} slot "${slot}" (legacy path?) — pass --pool ${slot}=<seed json>`
    );
  }
  const pools = require(path.join(ROOT, 'scripts', 'bots', BOT, 'pools'));
  const arr = pools[config.pools[slot]];
  if (!Array.isArray(arr)) throw new Error(`pools.js has no array for ${config.pools[slot]}`);
  return arr;
}

const POOLS = Object.fromEntries(SLOTS.map((s) => [s, loadPool(s)]));
const textOf = (e) => (typeof e === 'string' ? e : e.description || e.text || JSON.stringify(e));

// Force the subject slot(s): wrap buildBrief so the picker hands the path our entry for a forced slot
// and behaves normally for every other slot. brief-composer passes the slot name straight through to
// picker.pickWithRecency(pool, slot), which is what makes this work (verified on the pilot).
let forced = null; // { slot: entry }
const original = bot.buildBrief;
bot.buildBrief = function (opts) {
  if (opts.path !== PATH || forced === null || !opts.picker) return original.call(bot, opts);
  const real = opts.picker;
  const proxy = {
    ...real,
    pickWithRecency: (p, axis) => (axis in forced ? forced[axis] : real.pickWithRecency(p, axis)),
  };
  return original.call(bot, { ...opts, picker: proxy });
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const results = [];
  for (let k = 0; k < N; k++) {
    const want = Object.fromEntries(SLOTS.map((s) => [s, FORCED[s][k]]));
    const entries = {};
    let missing = null;
    for (const s of SLOTS) {
      const e = POOLS[s][want[s] - 1];
      if (e === undefined) missing = `${s}#${want[s]} (pool has ${POOLS[s].length})`;
      entries[s] = e;
    }
    const label = SLOTS.map((s) => `${s.slice(0, 12)}${want[s]}`).join('+');
    if (missing) {
      console.log(`[${label}] no such entry: ${missing}`);
      results.push({ k, forced: want, ok: false, err: 'no such entry ' + missing });
      continue;
    }
    const tag = SLOTS.map((s) => textOf(entries[s]).slice(0, 40)).join(' || ');
    await waitForHeadroom({ min: 25, label: `reseed-${PATH}-${k + 1}` });
    forced = entries;
    try {
      const r = await runBot({
        bot,
        path: PATH,
        vibe: 'random',
        dryRun: false,
        outDir: path.join(OUT, 'img'),
        label: `reseed-${PATH}-${label}`,
        idx: k + 1,
        post: POST,
        shadow: true,
        source: 'iter-bot',
      });
      console.log(
        `[${label}] ${r.ok ? 'OK ' + (r.imageUrl || '') : 'FAIL ' + r.errorStage + ' ' + r.error} | ${tag}`
      );
      results.push({
        k,
        forced: want,
        tag,
        entries,
        ok: r.ok,
        url: r.imageUrl || null,
        model: r.recipe && r.recipe.model,
        finalPrompt: r.finalPrompt || null,
        err: r.ok ? null : `${r.errorStage} ${r.error}`,
      });
    } catch (e) {
      console.log(`[${label}] THREW ${e.message.slice(0, 120)}`);
      results.push({ k, forced: want, tag, entries, ok: false, err: e.message });
    } finally {
      forced = null;
    }
  }
  fs.writeFileSync(path.join(OUT, 'render-results.json'), JSON.stringify(results, null, 1));
  console.log(`${results.filter((r) => r.ok).length}/${results.length} rendered → ${OUT}`);
})().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
