#!/usr/bin/env node
/**
 * audit-seed-variety.js — which "same-idea" pools are actually broken, and which are fine.
 *
 * scan-bot-seed-dupes.js reports 301 pools at >=20% same-idea. That number alone is NOT a defect
 * list, and acting on it blindly would gut good pools: this repo already built a fleet-wide
 * auto-thinner (dedup-spot-pools.mjs) and deliberately demoted it to a flagger, because raw token
 * frequency called Hawaii's beaches and Bora Bora's lagoons "bloat".
 *
 * Three classes, and the split matters because acting on the wrong one destroys good content:
 *
 *   REVIEW        under 0.35 distinct ideas per entry. A SHORTLIST for a human to look at, not a
 *                 verdict. faebot_flower_fairy_weather is 200 entries of drifting petals: a WEATHER
 *                 axis with no mist, rain, wind or fog in it.
 *   FRAME_REPEAT  real variety underneath an identical sentence template. Cosmetic, low priority.
 *   PROBABLY_FINE high word overlap but many distinct ideas, because the pool's whole subject
 *                 shares vocabulary. earthbot/andes_patagonia_subject is Torres del Paine, Fitz Roy
 *                 and Cerro Torre: different landmarks, and Patagonia really is granite spires.
 *
 * The fix for a shortlisted pool is NOT to empty and regenerate: it is to trim the over-represented
 * idea back to a reasonable share and backfill the MISSING registers with a recipe that names them.
 *
 * DIAGNOSTIC ONLY. Writes nothing.
 *
 * Usage:
 *   node scripts/audit-seed-variety.js --wired /tmp/wiring.json
 *   node scripts/audit-seed-variety.js --wired /tmp/wiring.json --class REVIEW -v
 *   node scripts/audit-seed-variety.js --bot faebot -v --json out.json
 */
const fs = require('fs');
const path = require('path');
const { textOf, signature, STOPWORDS } = require('./lib/seedDupeLint');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const CLASS = flag('--class');
const JSON_OUT = flag('--json');
const VERBOSE = argv.includes('-v') || argv.includes('--verbose');
const MIN = parseInt(flag('--min') || '50', 10);

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

/** Significant tokens, sharing the lint's stopword list so the numbers line up. */
const tokens = (t) =>
  String(t)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w));

/** The first few words, to detect an identical sentence template. */
const frameOf = (t) =>
  String(t)
    .replace(/^[A-Z0-9'’\- ]{3,40}(?:—|--|\/)/, '') // drop a CAPS title prefix
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 4)
    .join(' ');

const rows = [];
for (const bot of (ONLY ? [ONLY] : fs.readdirSync(ROOT)).sort()) {
  const seedDir = path.join(ROOT, bot, 'seeds');
  if (!fs.existsSync(seedDir)) continue;
  for (const f of fs.readdirSync(seedDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const pool = f.replace(/\.json$/, '');
    if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(pool)) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(seedDir, f), 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(data)) continue;
    const texts = data.map(textOf).filter((t) => t && t.trim());
    if (texts.length < MIN) continue;

    // cluster by coarse signature (the "same idea" key)
    const clusters = new Map();
    for (const t of texts) {
      const k = signature(t, 6);
      if (!clusters.has(k)) clusters.set(k, []);
      clusters.get(k).push(t);
    }
    const sorted = [...clusters.values()].sort((a, b) => b.length - a.length);
    const topCluster = sorted[0] || [];
    const clusterShare = Math.round((topCluster.length / texts.length) * 100);
    const ideaDup = Math.round((1 - clusters.size / texts.length) * 100);
    if (ideaDup < 20) continue;

    // dominant single token
    const freq = new Map();
    for (const t of texts) for (const w of new Set(tokens(t))) freq.set(w, (freq.get(w) || 0) + 1);
    const [topToken, topTokenN] = [...freq].sort((a, b) => b[1] - a[1])[0] || ['', 0];
    const tokenShare = Math.round((topTokenN / texts.length) * 100);

    // identical opening frame
    const frames = new Map();
    for (const t of texts) frames.set(frameOf(t), (frames.get(frameOf(t)) || 0) + 1);
    const [topFrame, topFrameN] = [...frames].sort((a, b) => b[1] - a[1])[0] || ['', 0];
    const frameShare = Math.round((topFrameN / texts.length) * 100);

    // DISTINCTNESS is the signal that actually separates these, and it took a calibration pass to
    // find. Top-token share is useless here: it is dominated by frame words every entry shares by
    // construction ("painted" 100% on faebot's weather pool, "foreground" 100% on earthbot's
    // Patagonia pool). Top-cluster share only catches verbatim idea repeats, not thematic
    // monoculture. Distinct ideas per entry does separate them, checked against pools verified by
    // hand:
    //   faebot_flower_fairy_weather  53 ideas / 200 = 0.27  BROKEN (200 entries of drifting petals)
    //   yumbot_kawaii_night_augment  68 ideas / 200 = 0.34  BROKEN
    //   earthbot_andes_patagonia     90 ideas / 200 = 0.45  FINE (real landmarks, shared vocabulary)
    // This is a SHORTLIST FOR HUMAN REVIEW, never a verdict. The repo already proved that both raw
    // token frequency and a Haiku judge over-call "bloat" and would gut good pools.
    const distinctness = clusters.size / texts.length;
    let klass;
    if (distinctness < 0.35) klass = 'REVIEW';
    else if (frameShare >= 40) klass = 'FRAME_REPEAT';
    else klass = 'PROBABLY_FINE';

    rows.push({
      bot,
      pool,
      n: texts.length,
      ideaDup,
      clusterShare,
      distinctIdeas: clusters.size,
      distinctness: Math.round(distinctness * 100) / 100,
      topToken,
      tokenShare,
      topFrame,
      frameShare,
      klass,
      sample: topCluster.slice(0, 2).map((t) => t.slice(0, 110)),
    });
  }
}

const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);
const byClass = (k) => rows.filter((r) => r.klass === k);

console.log(`Pools at >=20% same-idea with >=${MIN} entries: ${rows.length}\n`);
console.log(`  REVIEW        (<0.35 distinct ideas per entry — SHORTLIST):  ${byClass('REVIEW').length}`);
console.log(`  FRAME_REPEAT  (same sentence template, real variety under):  ${byClass('FRAME_REPEAT').length}`);
console.log(`  PROBABLY_FINE (shared vocabulary, many distinct ideas):      ${byClass('PROBABLY_FINE').length}`);

for (const k of CLASS ? [CLASS] : ['REVIEW', 'FRAME_REPEAT', 'PROBABLY_FINE']) {
  const list = byClass(k).sort((a, b) => a.distinctness - b.distinctness);
  if (!list.length) continue;
  console.log(`\n── ${k} ──`);
  console.log(pad('bot/pool', 52) + num('n', 5) + num('dist', 6) + num('ideas', 7) + '  dominant token');
  for (const r of list.slice(0, VERBOSE ? 60 : 12)) {
    console.log(
      pad(`${r.bot}/${r.pool}`, 52) +
        num(r.n, 5) +
        num(r.distinctness, 6) +
        num(r.distinctIdeas, 7) +
        `  ${r.topToken} ${r.tokenShare}%`
    );
    if (VERBOSE && r.sample[0]) console.log(`      "${r.sample[0]}…"`);
  }
  if (list.length > (VERBOSE ? 60 : 12)) console.log(`  … +${list.length - (VERBOSE ? 60 : 12)} more`);
}

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(rows, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}
