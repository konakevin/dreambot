#!/usr/bin/env node
/**
 * render-forced-entries.js — forced SHADOW renders of chosen subject-pool entries on one bot path.
 *
 * Why: the picker is a shuffle-bag, so an unforced batch mostly draws OLD entries (the pilot drew
 * 1 new entry in 6). A repaired pool is judged by FORCING the path to render the entries you name,
 * one at a time, posted as shadow so Kevin reviews them in the app. See the `reseed` skill and
 * RESEED_STATUS.md.
 *
 *   node scripts/reseed/render-forced-entries.js --bot bloombot --path flower-friends \
 *        --slot flower_focal_cluster --indices 27,22,30 [--pool <seed .json>] [--out <dir>] [--no-post]
 *
 * --indices  1-based positions in the pool (the numbering the repair report + review page use).
 * --pool     the seed file, only needed for a legacy (function-form) path; declarative paths resolve
 *            it from the path's `pools[slot]` constant via the bot's pools.js.
 * --out      where the images + render-results.json go (default: a scratch dir under os.tmpdir()).
 *
 * One render at a time, gated on DB pool headroom (Hard Rule: never more than 3 concurrent renders).
 * Writes <out>/render-results.json = [{ i, tag, entry, ok, url, model, finalPrompt, err }].
 */
/* global __dirname */
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
const BOT = flag('--bot');
const PATH = flag('--path');
const SLOT = flag('--slot');
const INDICES = (flag('--indices') || '')
  .split(',')
  .map((s) => Number(s.trim()))
  .filter((n) => Number.isInteger(n) && n > 0);
const POST = !argv.includes('--no-post');
const OUT = flag('--out') || path.join(os.tmpdir(), `reseed-${BOT}-${PATH}-${Date.now()}`);

if (!BOT || !PATH || !SLOT || !INDICES.length) {
  console.error(
    'usage: --bot <bot> --path <path> --slot <subject slot> --indices 1,2,3 [--pool <json>] [--out <dir>] [--no-post]'
  );
  process.exit(1);
}

const bot = require(path.join(ROOT, 'scripts', 'bots', BOT));

function loadPool() {
  if (flag('--pool')) return JSON.parse(fs.readFileSync(flag('--pool'), 'utf8'));
  const pathConfig = bot.pathBuilders ? bot.pathBuilders[PATH] : null;
  const config =
    pathConfig ||
    (() => {
      try {
        return require(path.join(ROOT, 'scripts', 'bots', BOT, 'paths', PATH));
      } catch {
        return null;
      }
    })();
  if (!config || !config.pools || !config.pools[SLOT]) {
    throw new Error(
      `cannot resolve the seed pool for ${BOT}/${PATH} slot "${SLOT}" (legacy path?) — pass --pool <seed json>`
    );
  }
  const pools = require(path.join(ROOT, 'scripts', 'bots', BOT, 'pools'));
  const arr = pools[config.pools[SLOT]];
  if (!Array.isArray(arr)) throw new Error(`pools.js has no array for ${config.pools[SLOT]}`);
  return arr;
}

const pool = loadPool();
const textOf = (e) => (typeof e === 'string' ? e : e.description || e.text || JSON.stringify(e));

// Force the subject slot: wrap buildBrief so the picker hands the path our entry for that slot and
// behaves normally for every other slot. brief-composer passes the slot name straight through to
// picker.pickWithRecency(pool, slot), which is what makes this work (verified on the pilot).
let forced = null;
const original = bot.buildBrief;
bot.buildBrief = function (opts) {
  if (opts.path !== PATH || forced === null || !opts.picker) return original.call(bot, opts);
  const real = opts.picker;
  const proxy = {
    ...real,
    pickWithRecency: (p, axis) => (axis === SLOT ? forced : real.pickWithRecency(p, axis)),
  };
  return original.call(bot, { ...opts, picker: proxy });
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const results = [];
  for (const i of INDICES) {
    const entry = pool[i - 1];
    if (entry === undefined) {
      console.log(`[${String(i).padStart(3)}] no such entry (pool has ${pool.length})`);
      results.push({ i, ok: false, err: 'no such entry' });
      continue;
    }
    const tag = textOf(entry).slice(0, 60);
    await waitForHeadroom({ min: 25, label: `reseed-${PATH}-${i}` });
    forced = entry;
    try {
      const r = await runBot({
        bot,
        path: PATH,
        vibe: 'random',
        dryRun: false,
        outDir: path.join(OUT, 'img'),
        label: `reseed-${PATH}-${i}`,
        idx: i,
        post: POST,
        shadow: true,
        source: 'iter-bot',
      });
      console.log(
        `[${String(i).padStart(3)}] ${r.ok ? 'OK ' + (r.imageUrl || '') : 'FAIL ' + r.errorStage + ' ' + r.error} | ${tag}`
      );
      results.push({
        i,
        tag,
        entry,
        ok: r.ok,
        url: r.imageUrl || null,
        model: r.recipe && r.recipe.model,
        finalPrompt: r.finalPrompt || null,
        err: r.ok ? null : `${r.errorStage} ${r.error}`,
      });
    } catch (e) {
      console.log(`[${String(i).padStart(3)}] THREW ${e.message.slice(0, 120)}`);
      results.push({ i, tag, entry, ok: false, err: e.message });
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
