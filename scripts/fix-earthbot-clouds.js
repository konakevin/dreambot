#!/usr/bin/env node
/**
 * fix-earthbot-clouds.js — de-saucer the lenticular/cloud vocabulary in EarthBot seeds.
 *
 * THE BUG (root-caused 2026-07-02 via a Kevin-hearted epic-vista render):
 *   Lenticular-cloud entries written as "smooth matte silver-grey DISC HOVERING
 *   MOTIONLESS above the summit" / "stack-of-three lenticular DISCS tiered like
 *   ceramic PLATES" / "perfect SAUCER formation" read to CLIP as a FLYING SAUCER,
 *   not weather — Flux renders a metallic-rimmed UFO mothership parked over the
 *   mountain ("the cloud looks fake as fuck"). The wow-medium's "almost too
 *   beautiful to be real" amplifier scales it up. Same vocabulary-literalization
 *   law as StarBot's grab-rail→ship-deck and OceanBot's photophore→literal-gems.
 *
 *   Real lenticulars are soft-edged, layered, visibly made of moist cloud, draped
 *   on or just above a summit. The words "disc / saucer / plate / hovering /
 *   suspended / motionless / matte silver" are rigid-object language and are what
 *   flips Flux from meteorology to UFO.
 *
 * This script rewrites ONLY the flagged entries via Sonnet, preserving the
 * phenomenon + peak/region + light, replacing the saucer-coding with weather-true
 * cloud language. Unflagged entries pass through verbatim. Tags preserved.
 *
 * Usage:
 *   node scripts/fix-earthbot-clouds.js <seed_basename> [--apply]
 *   node scripts/fix-earthbot-clouds.js --all [--apply]      # sweep every seed file
 *   (without --apply it dry-runs: reports what WOULD change, writes nothing)
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');
const { loadEnv } = require('./lib/seedGenHelper');

const SEED_DIR = path.join(__dirname, 'bots/earthbot/seeds');

// Strip false positives before testing:
//   - "saucer magnolia" is a real flowering tree (seasonal pools)
//   - the SUN's disc ("solar disc", "disc clears the ridge", "copper disc") is
//     legit sunrise/sunset language — only CLOUD discs are poison
//   - "plateau" contains "plate" but \b guards it; "pile d'assiettes" never used
function neutralize(s) {
  return s
    .replace(/saucer magnolia/gi, ' ')
    .replace(/(solar|sun'?s?|copper|blood|blood-crimson|crimson|amber|moon'?s?) dis[ck]\b/gi, ' ')
    .replace(/dis[ck][- ](rise|edge|shaped shadow\w*)/gi, ' ')
    .replace(/\bdis[ck]\b (?=(clears?|clips?|drops?|burns?|shines?|disappear))/gi, ' ');
}

// Saucer-coded CLOUD language. Two shapes:
//   1. a lenticular/lens/wave/cap-cloud phrase near rigid-object vocabulary
//      (disc, saucer, plate, hovering, suspended, motionless, fixed, tiered)
//   2. explicit "saucer formation" / "ceramic plates" anywhere
const LENS = '(lenticular\\w*|lens-shaped|wave-cloud|cap[- ]cloud)';
const RIGID =
  '(dis[ck]s?\\b|saucers?\\b|\\bplates?\\b|hover\\w*|suspended|motionless|perfectly still|sitting fixed|frozen in place|tier\\w*|matte silver\\w*|metallic)';
const POISON = new RegExp(
  `${LENS}[^.]{0,90}?${RIGID}|${RIGID}[^.]{0,90}?${LENS}|saucer formation|ceramic plates?|stack-of-three lenticular`,
  'i'
);

function isFlagged(desc) {
  return POISON.test(neutralize(desc));
}

const META = (
  entries
) => `You are cleaning EarthBot nature-photography seed pool entries. EarthBot posts clean, true-to-life photographs of real Earth at its most magnificent.

A rendering bug must be purged. Lenticular-cloud entries written with RIGID-OBJECT language — "smooth matte silver-grey DISC hovering MOTIONLESS", "stack-of-three lenticular DISCS tiered like ceramic PLATES", "perfect SAUCER formation", "suspended perfectly still" — make the image generator render a literal metallic FLYING SAUCER / UFO mothership over the mountain instead of a cloud. Banned words for clouds: disc, disk, saucer, plate, metallic, matte silver, hovering, suspended, motionless, perfectly still, sitting fixed, tiered precisely.

A REAL lenticular cloud (what we want): a smooth lens-shaped or almond-shaped CLOUD CAP draped over or just above the summit, soft feathered edges, visibly made of layered moist cloud with subtle banding, often warm-lit at its rim. A stacked lenticular is "several smooth layered bands of wave-cloud, one above the other, each softly feathered at the edges". Movement language: "draped over", "capping", "clinging to", "forming in the lee wave", "streaming into ice-haze downwind" — never "hovering/suspended" (those read as a rigid object).

Rewrite EACH entry below to PURGE the saucer-coding and describe the SAME cloud phenomenon as believable weather.

PRESERVE in every rewrite:
  - the phenomenon itself (lenticular / wave-cloud / cap-cloud — keep the word "lenticular" where present, it's the rigid-object words around it that are poison)
  - the named peak / region / place (Fitz Roy, Aconcagua, Snæfellsjökull, Shiprock, Torres del Paine…)
  - the light, time of day, palette, and everything else in the entry not about the cloud's shape
  - the comma-separated descriptive-phrase style and roughly the same length

KEEP THE CLOUD SUBORDINATE: it caps or crowns the peak — never spans the whole sky, never dwarfs the mountain. NEVER add: sci-fi, glow, anything "impossible", humans, structures. Stay a believable photograph a nature photographer could take.

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
  return accepted;
}

async function processFile(base, apply, key) {
  const file = path.join(SEED_DIR, `${base}.json`);
  const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
  const getDesc = (e) => (typeof e === 'string' ? e : e.description || '');

  const flaggedIdx = [];
  arr.forEach((e, i) => {
    if (isFlagged(getDesc(e))) flaggedIdx.push(i);
  });
  if (!flaggedIdx.length) return { base, total: arr.length, flagged: 0, changed: 0 };

  console.log(`\n${base}: ${arr.length} entries, ${flaggedIdx.length} flagged`);
  if (!apply) {
    for (const i of flaggedIdx.slice(0, 4)) console.log(`  ✗ ${getDesc(arr[i]).slice(0, 110)}`);
    if (flaggedIdx.length > 4) console.log(`  … +${flaggedIdx.length - 4} more`);
    return { base, total: arr.length, flagged: flaggedIdx.length, changed: 0 };
  }

  const BATCH = 12;
  let changed = 0;
  for (let s = 0; s < flaggedIdx.length; s += BATCH) {
    const slice = flaggedIdx.slice(s, s + BATCH);
    const batch = slice.map((i) => ({ i, description: getDesc(arr[i]) }));
    const byIdx = await rewriteBatch(batch, key);
    for (const i of slice) {
      const d = byIdx.get(i);
      if (!d) continue;
      if (typeof arr[i] === 'string') arr[i] = d;
      else arr[i].description = d;
      changed++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(arr, null, 2) + '\n');
  console.log(`  ✓ rewrote ${changed}/${flaggedIdx.length}`);
  // sample
  for (const i of flaggedIdx.slice(0, 2)) console.log(`  → ${getDesc(arr[i]).slice(0, 130)}`);
  return { base, total: arr.length, flagged: flaggedIdx.length, changed };
}

(async () => {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const all = args.includes('--all');
  const base = args.find((a) => !a.startsWith('--'));

  const ENV = loadEnv();
  const key = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
  if (apply && !key) throw new Error('ANTHROPIC_API_KEY missing');

  const bases = all
    ? fs
        .readdirSync(SEED_DIR)
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace(/\.json$/, ''))
    : [base];
  if (!bases[0]) {
    console.error('Usage: node scripts/fix-earthbot-clouds.js <seed_basename>|--all [--apply]');
    process.exit(1);
  }

  const results = [];
  for (const b of bases) results.push(await processFile(b, apply, key));
  const touched = results.filter((r) => r.flagged > 0);
  console.log(`\n=== SUMMARY (${apply ? 'APPLIED' : 'DRY-RUN'}) ===`);
  for (const r of touched) console.log(`${r.base}: flagged ${r.flagged}, rewrote ${r.changed}`);
  console.log(
    `${touched.length} files with flags, ${touched.reduce((a, r) => a + r.flagged, 0)} entries total`
  );
})();
