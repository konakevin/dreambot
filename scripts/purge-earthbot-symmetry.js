#!/usr/bin/env node
/**
 * purge-earthbot-symmetry.js — surgical cleanup of the "planted-avenue / cathedral-nave"
 * AI-slop vocabulary that crept into EarthBot seed pools over time.
 *
 * THE BUG (root-caused 2026-06-30 via a Kevin-hearted deep-forest render):
 *   Words like "cathedral", "colonnade", "dense column formation", "cathedral spacing",
 *   "ranked trunks", "in formation", "nave/aisle", "avenue", "symmetrical rows" make Flux
 *   render an ARTIFICIAL, dead-symmetrical scene: two mirror-image rows of identical,
 *   perfectly-straight, evenly-spaced telephone-pole trunks with a central aisle vanishing
 *   to a point. Real old-growth forest is the OPPOSITE — irregular girth + irregular
 *   spacing + leaning/curving trunks + no central aisle + an off-center hero trunk.
 *   Bavarian-beech / bamboo training data (real planted avenues) compounds it.
 *
 * This script rewrites ONLY the flagged entries in a pool via Sonnet, preserving
 * species/biome/region/understory/light + the (good) low-angle looking-up POV, and
 * replacing the architectural-symmetry framing with natural irregular old-growth.
 * Unflagged entries are passed through verbatim. Tags are preserved.
 *
 * Usage:
 *   node scripts/purge-earthbot-symmetry.js <seed_basename> [--apply] [--limit N]
 *   node scripts/purge-earthbot-symmetry.js deep_forest_subject --apply
 *   (without --apply it dry-runs: reports what WOULD change, writes nothing)
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');
const { loadEnv } = require('./lib/seedGenHelper');

const SEED_DIR = path.join(__dirname, 'bots/earthbot/seeds');

// Strip false-positive substrings before testing so we never flag GOOD vocabulary:
//   - "asymmetric*" is the desirable opposite
//   - "columnar basalt" / "basalt column*" are REAL geology (Giant's Causeway etc.)
//   - "ranks of hoodoos/spires" is accurate hoodoo geology
function neutralize(s) {
  return s
    .replace(/asymmetr\w*/gi, ' ')
    .replace(/unevenly[- ]spaced/gi, ' ') // GOOD — the desirable opposite
    .replace(/columnar basalt|basalt column\w*|column of basalt/gi, ' ')
    .replace(/ranks of (hoodoo|spire)\w*/gi, ' ');
}

// The planted-avenue / cathedral-nave poison. "evenly spaced" only counts in a
// TREE context (clouds / satellite trains genuinely are evenly spaced — not slop).
const POISON =
  /cathedral|colonnade|column formation|dense column|in column|cathedral spacing|cathedral-tall|ranked formation|trunks? in formation|ranks of (trunk|tree|fir|beech|cedar|pillar)|\bnave\b|central aisle|center aisle|tree tunnel|tunnel of trees|planted avenue|\bavenue of\b|parallel rows|straight rows|orderly rows|evenly[- ]spaced (trunk|tree|fir|beech|cedar|pillar|stalk)|(trunk|tree|fir|beech|cedar|pillar|stalk)\w* (that are |are |standing )?evenly[- ]spaced|regimented|symmetrical (column|trunk|row|tree|spacing)|mirror-image/i;

function isFlagged(desc) {
  return POISON.test(neutralize(desc));
}

const META = (
  entries
) => `You are cleaning EarthBot nature-photography seed pool entries. EarthBot posts clean, true-to-life photographs of real Earth at its most magnificent.

A rendering bug must be purged. These words/compositions make the image generator render an ARTIFICIAL, dead-symmetrical scene — two mirror-image rows of identical, perfectly-straight, evenly-spaced telephone-pole trunks with a central aisle vanishing to a point (a "planted avenue" / "cathedral nave"). That reads as obvious AI slop:
  cathedral, colonnade, column formation, dense column formation, cathedral spacing, cathedral-tall, ranked trunks, trunks in formation, nave, aisle, avenue, parallel/straight/orderly rows, evenly-spaced, regimented, symmetrical trunks/rows/spacing, mirror-image.

Real old-growth forest is the OPPOSITE and is what we want: trunks of WILDLY uneven girth at IRREGULAR, random, uneven spacing; some leaning, some curving, a fallen mossy giant; NO central aisle; an off-center dominant trunk; the eye wandering through organic, jumbled, asymmetric chaos. Tropical/jungle scenes: tangled, layered, riotous, no order.

Rewrite EACH entry below to PURGE the architectural-symmetry vocabulary and the planted-avenue/nave composition, replacing it with natural, irregular, asymmetric old-growth character.

PRESERVE in every rewrite:
  - the species / biome / region (e.g. Douglas fir, Bavarian beech, Yakushima cedar, Arashiyama bamboo)
  - the understory / floor / canopy detail, the light, the weather
  - the low-angle "looking straight up" / "forest-floor POV" / "hero stance" framing — that part is GOOD, keep it
  - the comma-separated descriptive-phrase style and roughly the same length

NEVER add: humans, paths, trails, footbridges, stone steps, or any man-made feature. NEVER add magical / glowing / bioluminescent / sci-fi / fairytale content. Stay a believable photograph.

SPECIAL CASE — cliff/rock scenes that use "cathedral-vertical" or "cathedral-straight" purely as a SCALE adjective (no repeated columns): just replace with "sheer vertical" / "towering sheer". Leave the rest of those entries intact.

SPECIAL CASE — an entry describing an "Avenue of [trees]" / a "colonnade ... on both sides" / trees "lined up on both sides" is a planted symmetric avenue (the worst version of this bug, and a tourist-stock cliche). Re-render it as the SAME species SCATTERED naturally at irregular spacing across the terrain (keep the place's mood + the red-laterite/grassland/etc. ground), with one or two dominant ancients off-center — NEVER lined up on both sides, NEVER an avenue/colonnade, NEVER "straight ... on both sides".

Return a JSON array of objects, SAME ORDER and SAME COUNT as the input, each: {"i": <original index>, "description": "<rewritten>"}. Output ONLY the JSON array, no preamble.

INPUT (${entries.length} entries to rewrite):
${JSON.stringify(entries, null, 2)}`;

async function callSonnet(body, key) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      if (i < delays.length) {
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      throw err;
    }
    if (res.ok) return res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

async function rewriteBatch(batch, key) {
  // batch: [{ i, description }]
  // Per-entry validation with straggler retries: a stubborn sibling never
  // reverts the whole batch. Accumulate clean rewrites across up to 3 attempts,
  // re-prompting only on the entries still missing.
  const accepted = new Map();
  let pending = batch.slice();
  for (let attempt = 0; attempt < 3 && pending.length; attempt++) {
    const data = await callSonnet(
      { model: SONNET, max_tokens: 8000, messages: [{ role: 'user', content: META(pending) }] },
      key
    );
    const raw = (data.content[0]?.text || '').trim();
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) continue;
    let parsed;
    try {
      parsed = JSON.parse(m[0]);
    } catch (_) {
      continue;
    }
    const byIdx = new Map(parsed.map((p) => [p.i, p.description]));
    for (const b of pending) {
      const d = byIdx.get(b.i);
      if (typeof d === 'string' && d.length > 15 && !isFlagged(d)) accepted.set(b.i, d);
    }
    pending = pending.filter((b) => !accepted.has(b.i));
  }
  return accepted; // may be partial; caller keeps originals for any misses
}

(async () => {
  const base = process.argv[2];
  const apply = process.argv.includes('--apply');
  const limArg = process.argv.indexOf('--limit');
  const limit = limArg > -1 ? parseInt(process.argv[limArg + 1], 10) : Infinity;
  if (!base) {
    console.error(
      'Usage: node scripts/purge-earthbot-symmetry.js <seed_basename> [--apply] [--limit N]'
    );
    process.exit(1);
  }
  const file = path.join(SEED_DIR, `${base}.json`);
  const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
  const getDesc = (e) => (typeof e === 'string' ? e : e.description || '');

  const flaggedIdx = [];
  arr.forEach((e, i) => {
    if (isFlagged(getDesc(e))) flaggedIdx.push(i);
  });
  const targetIdx = flaggedIdx.slice(0, limit);
  console.log(
    `\n${base}: ${arr.length} entries, ${flaggedIdx.length} flagged${limit < Infinity ? `, processing ${targetIdx.length}` : ''}`
  );
  if (!targetIdx.length) {
    console.log('Nothing to purge. ✓');
    return;
  }

  const ENV = loadEnv();
  const key = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');

  const BATCH = 12;
  let changed = 0;
  for (let s = 0; s < targetIdx.length; s += BATCH) {
    const slice = targetIdx.slice(s, s + BATCH);
    const batch = slice.map((i) => ({ i, description: getDesc(arr[i]) }));
    const byIdx = await rewriteBatch(batch, key);
    let missed = 0;
    for (const i of slice) {
      const d = byIdx.get(i);
      if (!d) {
        missed++;
        continue; // keep original for entries that wouldn't validate
      }
      if (typeof arr[i] === 'string') arr[i] = d;
      else arr[i].description = d;
      changed++;
    }
    console.log(
      `  ✓ rewrote ${Math.min(s + slice.length, targetIdx.length)}/${targetIdx.length}${missed ? ` (${missed} left unchanged)` : ''}`
    );
  }

  // show a few before/after
  console.log('\n=== SAMPLE REWRITES ===');
  targetIdx.slice(0, 3).forEach((i) => {
    console.log(`\n#${i} AFTER: ${getDesc(arr[i]).slice(0, 220)}`);
  });

  // verify residual
  const residual = arr.filter((e) => isFlagged(getDesc(e))).length;
  console.log(`\nResidual flagged after pass: ${residual}`);

  if (apply) {
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
    console.log(`\n✅ Wrote ${changed} rewrites to ${file}`);
  } else {
    console.log(`\n(dry-run — no file written. add --apply to save. ${changed} would change)`);
  }
})();
