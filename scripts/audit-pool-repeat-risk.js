#!/usr/bin/env node
/**
 * Finds the seed pools that TRULY need deepening, by measuring how soon a viewer
 * sees a repeat from each one.
 *
 * WHY RAW DEPTH IS THE WRONG METRIC — and why every previous count misled.
 * "Pools under 120 entries" returns ~1,560 files, which is useless as a work
 * list: it counts pools wired to nothing, pools on dark bots, and axis pools
 * (camera, light, palette) that are SUPPOSED to be small because nobody notices
 * a repeated camera angle. Sorting by depth puts a dormant 12-entry pool above a
 * 90-entry pool that every path on a 2-posts-per-day bot draws from.
 *
 * THE METRIC THAT MATTERS. Bot path cycling is a persisted shuffle-bag
 * (migration 283), so a pool of N entries is drawn N times before any entry
 * repeats. Therefore:
 *
 *     days_to_repeat  =  N  /  draws_per_day
 *
 * and draws_per_day for a pool is, summed over every path that draws it:
 *
 *     bot_posts_per_day  x  (1 / paths_in_that_bot's_rotation)  x  draws_per_render
 *
 * That single formula explains the whole picture. A 25-entry pool used by ONE
 * path on a 28-path bot posting twice a day is drawn 0.07 times a day and takes
 * ~350 days to repeat: completely fine, and topping it up would be wasted money.
 * The same 25-entry pool SHARED by every path on that bot is drawn twice a day
 * and repeats in under two weeks: that is a real, visible problem.
 *
 * So the output is ranked by days_to_repeat, not by depth.
 *
 * HOW THE DRAW MAP IS BUILT. Not by parsing. Requiring a path file transitively
 * loads the bot's shared pools.js, so static analysis over-reports wildly (one
 * ToyBot path appears to "use" 120 pools including every shared one). Instead
 * this instruments the PICKER: it builds each path's brief many times with a
 * recording picker, hashes each pool array it is handed, and matches that hash
 * back to the seed file it came from. That measures what is actually drawn,
 * including pools behind random gates, which is why each path is sampled
 * repeatedly rather than once.
 *
 * Writes POOL_BACKFILL_AUDIT.md — a ranked, explained work list, because the
 * previous tracker recorded a bare count with no reasoning and it could not be
 * acted on later.
 *
 * Usage: node scripts/audit-pool-repeat-risk.js [--samples 24] [--out FILE]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BOTS_DIR = path.join(__dirname, 'bots');
const DEFAULT_SAMPLES = 24;

/** Axis pools whose repetition is invisible to a viewer, so depth barely matters. */
const AXIS_HINT = /(camera|framing|vantage|light|lighting|palette|colour|color|weather|mood|vibe|look_register|medium|style)/i;

function sha(s) { return crypto.createHash('sha1').update(s).digest('hex').slice(0, 16); }

/** hash of a pool's content -> its seed file, so a picked array can be identified */
function indexSeedFiles() {
  const byHash = new Map();
  const depth = new Map();
  for (const d of fs.readdirSync(BOTS_DIR, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const seeds = path.join(BOTS_DIR, d.name, 'seeds');
    if (!fs.existsSync(seeds)) continue;
    for (const f of fs.readdirSync(seeds)) {
      if (!f.endsWith('.json')) continue;
      let arr;
      try { arr = JSON.parse(fs.readFileSync(path.join(seeds, f), 'utf8')); } catch { continue; }
      if (!Array.isArray(arr)) continue;
      const key = `${d.name}/${f.replace('.json', '')}`;
      depth.set(key, arr.length);
      // index by the whole array AND by the first entry: a path often receives a
      // tag-filtered SLICE of a shared pool, which hashes differently
      byHash.set(sha(JSON.stringify(arr)), key);
      if (arr.length) {
        const first = typeof arr[0] === 'string' ? arr[0] : JSON.stringify(arr[0]);
        if (!byHash.has('first:' + sha(first))) byHash.set('first:' + sha(first), key);
      }
    }
  }
  return { byHash, depth };
}

/** A picker that records every pool it is handed, then behaves randomly. */
function recordingPicker(seen, byHash) {
  const note = (arr) => {
    if (!Array.isArray(arr) || !arr.length) return;
    let key = byHash.get(sha(JSON.stringify(arr)));
    if (!key) {
      const first = typeof arr[0] === 'string' ? arr[0] : JSON.stringify(arr[0]);
      key = byHash.get('first:' + sha(first));
    }
    if (key) seen.set(key, (seen.get(key) || 0) + 1);
  };
  const pick = (arr) => { note(arr); return Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined; };
  return {
    pick,
    pickWithRecency: (arr) => pick(arr),
    pickN: (arr, n) => { note(arr); return Array.isArray(arr) ? arr.slice(0, n) : []; },
    getWarnings: () => [],
  };
}

async function postsPerDay() {
  // bot_schedules is the source of truth for cadence; fall back to 2 if unreachable
  const map = new Map();
  try {
    require('dotenv').config({ path: '.env.local' });
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await sb.from('bot_schedules').select('bot_name, posts_per_day');
    if (!error) for (const r of data || []) map.set(String(r.bot_name).toLowerCase(), Number(r.posts_per_day) || 2);
  } catch { /* offline: defaults apply */ }
  return map;
}

async function main() {
  const si = process.argv.indexOf('--samples');
  const SAMPLES = si >= 0 ? Number(process.argv[si + 1]) : DEFAULT_SAMPLES;
  const oi = process.argv.indexOf('--out');
  const OUT = oi >= 0 ? process.argv[oi + 1] : 'POOL_BACKFILL_AUDIT.md';

  const { byHash, depth } = indexSeedFiles();
  const cadence = await postsPerDay();

  // Dark and private bots post to nobody, so their pools cannot cause a visible
  // repeat. Without this filter outlawbot (3 live paths, dark) dominates the
  // urgent list with pools no user will ever see.
  const excluded = new Set();
  try {
    const w = JSON.parse(fs.readFileSync('/tmp/wiring.json', 'utf8'));
    for (const k of Object.keys(w)) {
      const e = w[k];
      if (e && (e.dark || e.private)) excluded.add(String(e.bot));
    }
  } catch { /* no wiring file: nothing excluded, and the report says so */ }
  if (excluded.size) console.log('excluding dark/private bots: ' + [...excluded].join(', '));

  const drawsPerDay = new Map();   // pool key -> draws/day across the fleet
  const drawnBy = new Map();       // pool key -> Set of "bot/path"
  const botInfo = [];

  for (const d of fs.readdirSync(BOTS_DIR, { withFileTypes: true })) {
    if (!d.isDirectory() || !fs.existsSync(path.join(BOTS_DIR, d.name, 'index.js'))) continue;
    let bot;
    try { bot = require(path.join(BOTS_DIR, d.name, 'index.js')); } catch { continue; }
    const live = bot.paths || [];
    if (!live.length) continue;
    if (excluded.has(d.name)) continue;
    const ppd = cadence.get(String(bot.username || d.name).toLowerCase()) ?? 2;
    const perPathPerDay = ppd / live.length; // flat rotation across the bot's paths
    botInfo.push({ bot: d.name, live: live.length, ppd });

    for (const p of live) {
      const seen = new Map();
      for (let i = 0; i < SAMPLES; i++) {
        try {
          bot.buildBrief({ path: p, sharedDNA: {}, vibeDirective: 'x', vibeKey: 'x', picker: recordingPicker(seen, byHash) });
        } catch { /* a path that throws on stub input contributes nothing */ }
      }
      for (const [key, hits] of seen) {
        const drawsPerRender = hits / SAMPLES; // < 1 means the pool sits behind a gate
        drawsPerDay.set(key, (drawsPerDay.get(key) || 0) + perPathPerDay * drawsPerRender);
        if (!drawnBy.has(key)) drawnBy.set(key, new Set());
        drawnBy.get(key).add(`${d.name}/${p}`);
      }
    }
  }

  const rows = [];
  for (const [key, dpd] of drawsPerDay) {
    const n = depth.get(key) || 0;
    if (!n || dpd <= 0) continue;
    const days = n / dpd;
    rows.push({
      key, n, dpd, days,
      paths: drawnBy.get(key).size,
      axis: AXIS_HINT.test(key.split('/')[1] || ''),
    });
  }
  rows.sort((a, b) => a.days - b.days);

  const content = rows.filter((r) => !r.axis);
  const urgent = content.filter((r) => r.days < 90);
  const soon = content.filter((r) => r.days >= 90 && r.days < 365);
  const fine = content.filter((r) => r.days >= 365);
  const axisRows = rows.filter((r) => r.axis);

  const fmt = (r) => `| \`${r.key}\` | ${r.n} | ${r.dpd.toFixed(2)} | **${Math.round(r.days)}** | ${r.paths} |`;
  const topUpTo = (r) => Math.max(0, Math.ceil(r.dpd * 365) - r.n);
  const cost = urgent.reduce((s, r) => s + topUpTo(r), 0);

  let md = `# Pool backfill audit — which pools TRULY need deepening

Generated by \`scripts/audit-pool-repeat-risk.js\` (re-run it; do not hand-edit).
Sampled each live path ${SAMPLES}× with an instrumented picker, so these are MEASURED
draw rates, not static guesses.

## Why this replaces "pools under 120 entries"

That count returns ~1,560 files and cannot be acted on. It includes pools wired to
nothing, pools on dark bots, and axis pools (camera, light, palette) that are
supposed to be small because **nobody notices a repeated camera angle**. It also
ranks a dormant 12-entry pool above a 90-entry pool that every path on a busy bot
draws from.

Path cycling is a persisted shuffle-bag (migration 283), so a pool of N entries is
drawn N times before anything repeats:

    days_to_repeat = N / draws_per_day
    draws_per_day  = bot_posts_per_day x (1 / paths_in_rotation) x draws_per_render

A 25-entry pool on ONE path of 28, on a bot posting twice a day, is drawn 0.07×/day
and repeats in ~350 days — fine, and topping it up would be wasted money. The same
pool SHARED across every path on that bot is drawn 2×/day and repeats in under two
weeks. That is the difference this audit measures and the old count could not see.

**Target: 365 days to repeat.** A viewer should not see the same seed twice in a year.

| band | content pools | meaning |
| --- | --- | --- |
| under 90 days | **${urgent.length}** | repeats within a season — fix these |
| 90-365 days | ${soon.length} | repeats within a year — worth topping up |
| over 365 days | ${fine.length} | already fine, leave alone |
| axis pools (any depth) | ${axisRows.length} | repetition invisible, excluded on purpose |

**Entries needed to bring every under-90-day pool to a full year: ${cost.toLocaleString()}.**

## Fix these first — repeats within 90 days

| pool | entries | draws/day | days to repeat | paths drawing it |
| --- | --- | --- | --- | --- |
${urgent.slice(0, 60).map(fmt).join('\n') || '| _none_ | | | | |'}
${urgent.length > 60 ? `\n_...and ${urgent.length - 60} more._\n` : ''}
## Worth topping up — repeats within a year

| pool | entries | draws/day | days to repeat | paths drawing it |
| --- | --- | --- | --- | --- |
${soon.slice(0, 40).map(fmt).join('\n') || '| _none_ | | | | |'}
${soon.length > 40 ? `\n_...and ${soon.length - 40} more._\n` : ''}
## Excluded on purpose

- **Axis pools** (camera, framing, light, palette, vibe, look register, medium): repetition is
  invisible to a viewer, so depth barely matters. ${axisRows.length} of them.
- **Dark and private bots** (${[...excluded].join(', ') || 'none detected'}): they post to nobody, so a
  repeat there cannot be seen. Without this filter a dark bot's 25-entry pools dominate the list.
- **Dormant and orphan pools**: not drawn by any live path, so they never reach a render at all. This
  audit only sees pools the picker was actually handed.

## Cadence used

| bot | live paths | posts/day | per-path draws/day |
| --- | --- | --- | --- |
${botInfo.sort((a, b) => a.bot.localeCompare(b.bot)).map((b) => `| ${b.bot} | ${b.live} | ${b.ppd} | ${(b.ppd / b.live).toFixed(3)} |`).join('\n')}
`;

  fs.writeFileSync(OUT, md);
  console.log(`✓ ${OUT}`);
  console.log(`  measured ${rows.length} drawn pools across ${botInfo.length} live bots`);
  console.log(`  content pools repeating within 90 days : ${urgent.length}`);
  console.log(`  within a year                          : ${soon.length}`);
  console.log(`  already fine (>1 year)                 : ${fine.length}`);
  console.log(`  axis pools excluded                    : ${axisRows.length}`);
  console.log(`  entries to bring the urgent set to 365 days: ${cost.toLocaleString()}`);
  console.log('\n  worst 12:');
  for (const r of urgent.slice(0, 12))
    console.log(`    ${String(Math.round(r.days)).padStart(4)}d  ${r.key.padEnd(52)} n=${String(r.n).padStart(4)}  ${r.paths} path(s)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
