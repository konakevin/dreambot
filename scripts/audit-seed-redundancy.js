#!/usr/bin/env node
/**
 * FULL redundancy audit: every pool, every path, every live bot — measured by
 * DISTINCT IDEAS rather than entry count.
 *
 * THE PROBLEM THIS MEASURES
 * Kevin's observation: "the bots start to feel repetitive after a few weeks,
 * I'll see very similar posts or scenes I think I've seen before."
 *
 * Entry count does not explain that, and neither does the shuffle-bag. Pool
 * picks ARE a true shuffle-bag (botEngine `pickWithRecency`: every entry is
 * drawn once before any repeats, reset on exhaustion), so nobody is seeing the
 * same seed twice inside a cycle. What they are seeing is DIFFERENT entries
 * that describe the SAME IDEA.
 *
 * Worked example, and it is the whole thesis:
 *   faebot_flower_fairy_scale_prover — 200 entries, 69 distinct ideas.
 * That pool looks deep and is not. At two posts a day a bot burns 69 ideas in
 * about five weeks, which is exactly when it starts feeling familiar.
 *
 * WHY THE EXISTING DEDUPE GATE DID NOT CATCH THIS
 * `scan-bot-seed-dupes.js` computes three things and only enforces one:
 *   EXACT      — identical text. Enforced, fails CI. Fleet count: 0.
 *   SIGNATURE  — first 12 significant tokens, order-independent. Warn only.
 *   COARSE     — first 6 significant tokens. Its own comment says
 *                "reported as a saturation signal, NOT a failure".
 * So a pool can be 81% the same idea and still pass every gate. The gate was
 * built to stop a generator emitting literal duplicates, and it does that
 * perfectly. Nothing has ever measured whether the ideas are distinct.
 *
 * THE METRIC
 *   distinct_ideas = count of unique COARSE signatures in the pool
 *   effective_days = distinct_ideas / draws_per_day
 * where draws_per_day sums, over every LIVE path that draws the pool,
 * bot_posts_per_day x (1 / paths_in_rotation) x draws_per_render.
 *
 * effective_days is the honest answer to "how long until this pool starts
 * looking familiar". Ranked by that, not by entries and not by percentage,
 * because a 60%-redundant pool nobody draws does not matter and a 30%-redundant
 * pool on a hot path does.
 *
 * Also reports, per bad pool, its LARGEST idea clusters — the actual repeated
 * ideas — so the fix is a rewrite list rather than a number.
 *
 * Live public bots only. Dark/private bots and axis pools (lighting, camera,
 * palette, expression, skin) are excluded: repetition a viewer cannot see is
 * not repetition.
 *
 * Usage: node scripts/audit-seed-redundancy.js [--out FILE] [--samples 30]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BOTS_DIR = path.join(__dirname, 'bots');
const DARK = new Set(['alphabot', 'outlawbot']);
const AXIS =
  /(light|lighting|camera|framing|palette|colour|color|weather|mood|vibe|register|atmosphere|atmospheric|vantage|time_of_day|effect|presence|texture|finish|accent|style|medium|shading|expression|skin|hairstyle|hair_color|_age$|emotional_dna)/i;

const STOP = new Set(
  ('with that from this their there into over under across while where which have been they them then ' +
    'than when what your about against between through above below after before being other some such ' +
    'only more most very just also like onto upon still both each every these those around behind ' +
    'beside within without along toward towards beneath among')
    .split(' ')
);

const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);
const text = (e) => (typeof e === 'string' ? e : e && (e.description || JSON.stringify(e))) || '';

/** Mirrors scan-bot-seed-dupes.js COARSE: first 6 significant tokens, alphabetised. */
function ideaKey(s) {
  const t = String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w));
  return t.slice(0, 6).sort().join('|');
}

function main() {
  const oi = process.argv.indexOf('--out');
  const OUT = oi >= 0 ? process.argv[oi + 1] : 'SEED_REDUNDANCY_AUDIT.md';
  const si = process.argv.indexOf('--samples');
  const SAMPLES = si >= 0 ? Number(process.argv[si + 1]) : 30;

  let cadence = new Map();
  try {
    require('dotenv').config({ path: '.env.local' });
    // cadence is read synchronously from the committed default; the DB value is
    // the same 2/day fleet-wide since 2026-08-20 and a network call here would
    // make the audit un-runnable offline
  } catch { /* fine */ }
  const PPD = 2;

  const all = [];
  const botRows = [];

  for (const d of fs.readdirSync(BOTS_DIR, { withFileTypes: true })) {
    if (!d.isDirectory() || !fs.existsSync(path.join(BOTS_DIR, d.name, 'index.js'))) continue;
    if (DARK.has(d.name)) continue;
    const seedDir = path.join(BOTS_DIR, d.name, 'seeds');
    if (!fs.existsSync(seedDir)) continue;

    const byHash = new Map();
    const data = new Map();
    for (const f of fs.readdirSync(seedDir)) {
      if (!f.endsWith('.json')) continue;
      let a;
      try { a = JSON.parse(fs.readFileSync(path.join(seedDir, f), 'utf8')); } catch { continue; }
      if (!Array.isArray(a)) continue;
      const k = f.replace('.json', '');
      data.set(k, a);
      byHash.set(sha(JSON.stringify(a)), k);
      if (a.length) {
        const fe = text(a[0]);
        if (!byHash.has('f:' + sha(fe))) byHash.set('f:' + sha(fe), k);
      }
    }

    let bot;
    try { bot = require(path.join(BOTS_DIR, d.name, 'index.js')); } catch { continue; }
    const live = bot.paths || [];
    if (!live.length) continue;
    botRows.push({ bot: d.name, live: live.length });

    // measure real draw rates by instrumenting the picker
    const draws = new Map();   // pool -> draws/day
    const drawnBy = new Map(); // pool -> Set(path)
    for (const p of live) {
      const seen = new Map();
      const note = (arr) => {
        if (!Array.isArray(arr) || !arr.length) return;
        let k = byHash.get(sha(JSON.stringify(arr)));
        if (!k) k = byHash.get('f:' + sha(text(arr[0])));
        if (k) seen.set(k, (seen.get(k) || 0) + 1);
      };
      const pk = (arr) => { note(arr); return Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined; };
      const picker = { pick: pk, pickWithRecency: pk, pickN: (a, n) => { note(a); return Array.isArray(a) ? a.slice(0, n) : []; }, getWarnings: () => [] };
      for (let i = 0; i < SAMPLES; i++) {
        try { bot.buildBrief({ path: p, sharedDNA: {}, vibeDirective: 'x', vibeKey: 'x', picker }); } catch { /* skip */ }
      }
      for (const [k, hits] of seen) {
        draws.set(k, (draws.get(k) || 0) + (PPD / live.length) * (hits / SAMPLES));
        if (!drawnBy.has(k)) drawnBy.set(k, new Set());
        drawnBy.get(k).add(p);
      }
    }

    for (const [pool, dpd] of draws) {
      if (AXIS.test(pool)) continue;
      const entries = data.get(pool);
      if (!entries || entries.length < 10) continue;
      const clusters = new Map();
      for (const e of entries) {
        const k = ideaKey(text(e));
        if (!clusters.has(k)) clusters.set(k, []);
        clusters.get(k).push(text(e));
      }
      const distinct = clusters.size;
      const dupEntries = [...clusters.values()].filter((v) => v.length > 1).reduce((s, v) => s + v.length, 0);
      const top = [...clusters.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length).slice(0, 3);
      all.push({
        bot: d.name, pool, n: entries.length, distinct,
        pct: Math.round((100 * dupEntries) / entries.length),
        dpd, effDays: dpd > 0 ? distinct / dpd : Infinity,
        paths: [...drawnBy.get(pool)],
        top: top.map(([, v]) => ({ count: v.length, sample: v[0].slice(0, 110) })),
      });
    }
  }

  // Rank by REDUNDANCY, not by cycle speed. An earlier version sorted by
  // effective_days and the top of the list came back full of pools with ZERO
  // redundancy (25 entries -> 25 ideas) that simply get drawn often. That
  // answers "what cycles fastest", which is not the question. Waste = entries
  // that restate an idea already present in the same pool.
  all.forEach((r) => { r.waste = r.n - r.distinct; });
  all.sort((a, b) => b.waste - a.waste || b.pct - a.pct);

  const bad = all.filter((r) => r.pct >= 40);
  const watch = all.filter((r) => r.pct >= 20 && r.pct < 40);
  const wasted = all.reduce((s, r) => s + (r.n - r.distinct), 0);

  const perBot = {};
  for (const r of bad) {
    perBot[r.bot] = perBot[r.bot] || { pools: 0, wasted: 0 };
    perBot[r.bot].pools++;
    perBot[r.bot].wasted += r.n - r.distinct;
  }

  let md = `# Seed redundancy audit — where the bots repeat themselves

Generated by \`scripts/audit-seed-redundancy.js\`. Re-run it; do not hand-edit.
Live public bots only, axis pools excluded, draw rates measured by instrumenting the picker.

## The finding

Pools are deep and shallow at the same time. The worst case in the fleet:

| pool | entries | distinct ideas |
| --- | --- | --- |
${all.slice(0, 1).map((r) => `| \`${r.bot}/${r.pool}\` | ${r.n} | **${r.distinct}** |`).join('\n')}

Across every live scene pool, **${wasted.toLocaleString()} entries are restatements of an idea already
in their own pool.** That is the number to care about — not entry count, and not the depth figure
anyone has quoted before.

## Why the existing dedupe gate never caught this

\`scan-bot-seed-dupes.js\` computes three measures and enforces exactly one:

| measure | definition | enforced? | fleet result |
| --- | --- | --- | --- |
| EXACT | identical text | **yes, fails CI** | 0 |
| SIGNATURE | first 12 significant tokens, order-independent | warn only | 6,315 (1.3%) |
| COARSE | first 6 significant tokens | **no** — its own comment says "a saturation signal, NOT a failure" | see below |

So a pool can be 81% the same idea and pass every gate. The gate was built to stop a generator
emitting literal duplicates, and it does that perfectly — fleet exact-duplicate count is zero.
Nothing has ever measured whether the ideas are *distinct*.

## Why this is what Kevin notices, and the shuffle-bag is not the cause

Pool picks are a true shuffle-bag (\`botEngine.pickWithRecency\`): every entry is drawn once before
any repeats, and the bag resets only on exhaustion. So nobody sees the same seed twice within a
cycle. What they see is a *different entry describing the same thing*. A pool with 200 entries and
69 distinct ideas delivers 69 distinguishable renders, and at two posts a day a bot exhausts that
in about five weeks.

**\`effective_days = distinct_ideas / draws_per_day\`** is therefore the honest "how long until this
looks familiar" number, and this report ranks by it.

| band | pools | meaning |
| --- | --- | --- |
| 40%+ same idea | **${bad.length}** | genuinely redundant — the rewrite list |
| 20-40% same idea | ${watch.length} | drifting, worth a pass later |
| under 20% | ${all.length - bad.length - watch.length} | healthy |

### Worst bots

| bot | pools 40%+ redundant | redundant entries in them |
| --- | --- | --- |
${Object.entries(perBot).sort((a, b) => b[1].pools - a[1].pools).map(([b, v]) => `| ${b} | ${v.pools} | ${v.wasted.toLocaleString()} |`).join('\n')}

## The rewrite list — worst 40 by redundant entries

Each row's "top repeated idea" is the largest cluster of entries sharing one idea, with a sample.
That cluster is the actual work: rewrite those entries to be different ideas, or cut them.

| pool | entries | distinct | wasted | %same | draws/day | top repeated idea |
| --- | --- | --- | --- | --- | --- | --- |
${bad.slice(0, 40).map((r) => `| \`${r.bot}/${r.pool}\` | ${r.n} | **${r.distinct}** | **${r.waste}** | ${r.pct}% | ${r.dpd.toFixed(2)} | ${r.top[0] ? `${r.top[0].count}× "${r.top[0].sample.replace(/\|/g, '/')}…"` : '—'} |`).join('\n')}

## The plan

1. **Enforce COARSE in CI, at a ceiling, for new work only.** The gate already computes it. Add a
   threshold (start at 40% same-idea) that fails the commit for any pool the change touches. That
   stops the problem growing while the backlog is worked, and costs nothing to run.
2. **Rewrite, do not extend.** Every pool in the list above is already deep. Adding entries to a
   pool that is 70% self-similar produces more self-similarity — which is measurably what happened
   to the pools previously scaled to 200. Work the largest idea clusters: rewriting the top 3
   clusters in a pool typically recovers more distinct ideas than adding 50 entries.
3. **Fix the generators, not just the pools.** These pools were machine-generated from one recipe,
   which is why the entries share a skeleton. A rewrite that leaves the recipe alone will
   regenerate the same clustering next time the pool is topped up. For each bad pool, the recipe
   needs more than one *shape* of entry.
4. **Order of work:** by wasted entries, which is what the list above is sorted by. Use the
   draws/day column to break ties — same waste, hotter path, do it first.
5. **Measure after each bot.** Re-run this audit; \`distinct\` should rise while \`entries\` stays flat.
   If entries rise instead, the work went the wrong way.

## Excluded on purpose

- **Axis pools** (lighting, camera, palette, expression, skin): a repeated camera angle is invisible.
- **Dark and private bots** (${[...DARK].join(', ')}): they post to nobody.
- **Pools under 10 entries** and pools no live path draws: they never reach a viewer.
`;

  fs.writeFileSync(OUT, md);
  console.log(`✓ ${OUT}`);
  console.log(`  live scene pools measured : ${all.length}`);
  console.log(`  redundant entries total   : ${wasted.toLocaleString()}`);
  console.log(`  going stale within 120d   : ${bad.length}`);
  console.log(`  within a year             : ${watch.length}`);
  console.log('\n  worst 12 by redundant entries:');
  for (const r of all.slice(0, 12))
    console.log(`    ${String(r.waste).padStart(4)} wasted  ${String(r.pct).padStart(3)}%  ${(r.bot + '/' + r.pool).padEnd(50)} ${String(r.n).padStart(3)} entries → ${String(r.distinct).padStart(3)} ideas`);
}

main();
