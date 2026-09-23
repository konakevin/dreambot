#!/usr/bin/env node
/**
 * rewrite-object-led.js — rewrite a PLACE pool from adjective-led to object-led.
 *
 * THE FINDING THIS EXISTS TO FIX (2026-09-22, Kevin asked why two new DinoBot buckets looked so
 * much better than the rest of the bot's content).
 *
 * Measured on `dinobot_paleo_landscape_biome`, comparing 50 newly-written entries against the
 * original 200 IN THE SAME POOL ON THE SAME PATH — a clean natural experiment:
 *
 *                              new 50    original 200
 *   atmosphere adjectives         1.7             5.6
 *   countable physical objects    3.9             1.6
 *   object-to-adjective ratio    2.29            0.31
 *
 * And the vocabulary is the real damage: in the original pool "amber" appears in 90% of entries,
 * "haze" in 86%, "golden" in 75%, "atmospheric" 60%, "rust" 54%. So all 200 entries are a
 * golden-amber-hazy-rust scene. The pool varies the LANDFORM and FIXES the atmosphere — and
 * atmosphere is what the eye reads first, so 200 entries deliver one look.
 *
 *   THE RULE: an atmosphere adjective is a shared CONSTANT; a physical object is a VARIABLE.
 *   Adjectives make every render look the same. Objects make each render a different place.
 *
 * Fleet context (253 place-naming pools scanned, sky/light/palette axes excluded because being
 * adjective-heavy is correct there): median ratio 2.06. This pool sat at 0.31, ~7x below median —
 * a DinoBot-specific outlier, not a fleet-wide disease. And it is read by 10 of DinoBot's 16 live
 * paths, so it shapes 63% of that bot's roster from one file.
 *
 * SAFETY. This writes a CANDIDATE file and never touches the live pool. The candidate is A/B'd via
 * `iter-bot --pool-override`, which swaps the array in memory only, so the 10 live paths that read
 * this pool keep rendering from the committed file until a human approves the swap.
 *
 * Usage:
 *   node scripts/rewrite-object-led.js --bot dinobot --pool dinobot_paleo_landscape_biome --dry-run
 *   node scripts/rewrite-object-led.js --bot dinobot --pool dinobot_paleo_landscape_biome --apply
 *   # then A/B, and only on approval:
 *   node scripts/rewrite-object-led.js --bot dinobot --pool <pool> --promote
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const BOT = flag('--bot');
const POOL = flag('--pool');
const APPLY = argv.includes('--apply');
const PROMOTE = argv.includes('--promote');
const BATCH = parseInt(flag('--batch', '10'), 10);
const KEY = process.env.ANTHROPIC_API_KEY;

if (!BOT || !POOL) {
  console.error('Usage: --bot <bot> --pool <pool> [--dry-run|--apply|--promote]');
  process.exit(2);
}

const live = path.join(__dirname, 'bots', BOT, 'seeds', `${POOL}.json`);
const cand = path.join(__dirname, 'bots', BOT, 'seeds', `${POOL}.candidate.json`);

/** The two measures the whole rewrite is judged on. Kept identical to the diagnostic scan. */
const ATMO =
  /\b(misted|misty|hazy|haze|golden|amber|ochre|rust|deep|lush|verdant|saturated|vivid|dramatic|epic|towering|massive|ancient|primordial|alien|ethereal|glowing|luminous|moody|atmospheric|sweeping|breathtaking|majestic|pristine)\b/gi;
const OBJ =
  /\b(trunk|log|boulder|rock|plate|slab|stone|scrub|cycad|fern|bone|shell|track|print|pool|puddle|gravel|scree|crust|ripple|dune|ridge|pan|stream|branch|needle|frond|root|crack|fissure|vent|snow|rime|icicle|drift|bank|shelf|ledge|stump|wall|step|post|mudflat|sandbar|outcrop|talus|hoodoo|butte|terrace|channel|delta|caldera|geyser|spring|reed|horsetail|ginkgo|araucaria|palm|moss|lichen|silt|clay|ash|pumice|basalt|limestone)\b/gi;

const count = (t, re) => (String(t).match(re) || []).length;
const ratio = (t) => count(t, OBJ) / (count(t, ATMO) || 0.5);
const poolStats = (arr) => {
  const a = arr.reduce((s, t) => s + count(t, ATMO), 0) / arr.length;
  const o = arr.reduce((s, t) => s + count(t, OBJ), 0) / arr.length;
  return { adj: +a.toFixed(2), obj: +o.toFixed(2), ratio: +(o / (a || 0.1)).toFixed(2) };
};
/** Share of entries containing the single most-repeated atmosphere word. */
const topWordShare = (arr) => {
  const m = new Map();
  for (const t of arr) for (const w of new Set((String(t).match(ATMO) || []).map((x) => x.toLowerCase()))) m.set(w, (m.get(w) || 0) + 1);
  const top = [...m].sort((a, b) => b[1] - a[1])[0] || ['', 0];
  return { word: top[0], pct: Math.round((top[1] / arr.length) * 100) };
};

if (PROMOTE) {
  if (!fs.existsSync(cand)) {
    console.error(`no candidate at ${cand} — run --apply first`);
    process.exit(2);
  }
  const c = JSON.parse(fs.readFileSync(cand, 'utf8'));
  const l = JSON.parse(fs.readFileSync(live, 'utf8'));
  if (c.length !== l.length) {
    console.error(`REFUSING: candidate has ${c.length} entries, live has ${l.length}. A promote must be 1:1.`);
    process.exit(2);
  }
  fs.writeFileSync(`${live}.pre-object-led.bak`, JSON.stringify(l, null, 2) + '\n');
  fs.writeFileSync(live, JSON.stringify(c, null, 2) + '\n');
  fs.unlinkSync(cand);
  console.log(`promoted ${c.length} entries into ${POOL}; previous version saved as ${POOL}.json.pre-object-led.bak`);
  process.exit(0);
}

const entries = JSON.parse(fs.readFileSync(live, 'utf8')).map(String);
const before = poolStats(entries);
const tw = topWordShare(entries);
console.log(
  `${BOT}/${POOL}: ${entries.length} entries\n` +
    `  BEFORE  adj/entry ${before.adj}  obj/entry ${before.obj}  ratio ${before.ratio}\n` +
    `  most-repeated atmosphere word: "${tw.word}" in ${tw.pct}% of entries\n`
);
const worst = entries.map((t, i) => ({ i, r: +ratio(t).toFixed(2), t })).sort((a, b) => a.r - b.r);
if (!APPLY) {
  console.log('the 5 most adjective-led entries (these are what a render looks like):');
  for (const e of worst.slice(0, 5)) console.log(`  [${e.i}] ratio ${e.r}  ${e.t.slice(0, 150)}`);
  console.log(`\nDRY RUN — nothing written. Re-run with --apply to write ${POOL}.candidate.json.`);
  process.exit(0);
}
if (!KEY) {
  console.error('ANTHROPIC_API_KEY missing from .env.local');
  process.exit(2);
}

async function callSonnet(body) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      if (i < delays.length) { await new Promise((r) => setTimeout(r, delays[i])); continue; }
      throw err;
    }
    if (res.ok) return res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      await new Promise((r) => setTimeout(r, delays[i])); continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

const INSTRUCTION = `You are rewriting seed entries for DinoBot's prehistoric-landscape pool. Each entry describes ONE Mesozoic place, and a render is built from it.

THE PROBLEM WITH THE CURRENT ENTRIES, measured across the whole pool: they average 5.6 atmosphere adjectives and only 1.6 countable physical objects each, and the SAME adjectives recur — "amber" in 90% of entries, "haze" in 86%, "golden" in 75%. So every render comes back as the same golden-amber-hazy scene no matter which landform was rolled. An atmosphere adjective is a shared CONSTANT across the pool; a physical object is a VARIABLE. Adjectives make every render look alike; objects make each render a different place.

YOUR JOB for each entry: keep its LANDFORM and its specific identity exactly — if it is a canyon it stays that canyon — but rebuild the description so the place is made of THINGS rather than of adjectives.

RULES, all of them load-bearing:
1. Name at least FOUR countable physical things, and be specific about them: a petrified trunk, plates of cracked clay, a talus fan of broken scree, horsetails standing in the shallows, a boulder split clean in two, bleached bone in the gravel, ripple-marks printed across a flank, a fallen araucaria bridging a gully, lichen mapping a rock face, ash drifted into a hollow.
2. Mention LIGHT or ATMOSPHERE exactly ONCE, in a short clause, and make it specific rather than generic — "late light raking sideways across the ripples" beats "golden atmospheric haze". Never use more than one atmosphere word in the whole entry.
3. BAN these words entirely, because the pool has worn them out: amber, haze, hazy, misted, misty, golden, atmospheric, primordial, ancient, epic, sweeping, majestic, breathtaking, pristine, lush, verdant. Find a different and more specific way to say what you mean.
4. Name the GROUND underfoot in every entry — what a foot would land on: packed grit, wet shingle, cracked clay plates, deep leaf litter, ash crust, mud with standing water in the prints, loose scree.
5. Keep ONE vivid detail that makes it that place and no other. Something the eye finds: a spring welling up through gravel, a whole tree fossilised upright, steam venting from a fissure, a mirror of standing water, an odd-coloured band through the strata.
6. Mega-flora is welcome and makes it unmistakably Mesozoic: tree ferns, cycads, horsetails, ginkgo, araucaria, club-mosses. Name the species, not "mega-flora".
7. Keep it to 35-50 words, comma-separated phrases, the same register as the original. No humans, no structures, no modern anything. Describe only what IS present — never a negation.

Return a JSON array of the rewritten strings, in the SAME ORDER as the input, one rewrite per input. No commentary.`;

/** An entry passes only if it actually moved on the measure the whole exercise is about. */
function accepts(t) {
  return count(t, OBJ) >= 3 && count(t, ATMO) <= 2 && ratio(t) >= 1.5 && t.split(/\s+/).length >= 25;
}

(async () => {
  const out = [...entries];
  let rewritten = 0, kept = 0;
  const targets = entries.map((t, i) => ({ i, t })).filter((e) => ratio(e.t) < 1.5);
  console.log(`rewriting ${targets.length} of ${entries.length} entries (ratio < 1.5)\n`);

  for (let b = 0; b < targets.length; b += BATCH) {
    const slice = targets.slice(b, b + BATCH);
    for (let attempt = 0; attempt < 2; attempt++) {
      let arr;
      try {
        const data = await callSonnet({
          model: 'claude-sonnet-5',
          // 32000, not 8000. Sonnet spends most of its output budget on EXTENDED
          // THINKING before it writes the array — measured 6,254 thinking tokens
          // out of 7,244 on a 10-entry batch, leaving under 1,000 for the answer
          // itself. At 8000 the thinking fit but the JSON got cut off mid-array on
          // most batches, and because a truncated array has no closing `]`,
          // `lastIndexOf(']')` returned -1 and the slice silently became '' —
          // surfacing only as "Unexpected end of JSON input". That quietly left
          // 76 of 200 entries un-rewritten and stalled the pool's object ratio at
          // 1.11 against a 1.5 target. You pay only for tokens generated.
          max_tokens: 32000,
          messages: [
            { role: 'user', content: `${INSTRUCTION}\n\nRewrite these ${slice.length} entries:\n${JSON.stringify(slice.map((s) => s.t), null, 1)}` },
          ],
        });
        const txt = (data.content || []).map((c) => c.text || '').join('');
        if (data.stop_reason === 'max_tokens') {
          throw new Error(
            `response hit max_tokens (thinking ${data.usage?.output_tokens_details?.thinking_tokens ?? '?'} ` +
              `of ${data.usage?.output_tokens ?? '?'} output tokens) — raise max_tokens`
          );
        }
        const open = txt.indexOf('[');
        const close = txt.lastIndexOf(']');
        if (open === -1 || close < open) {
          throw new Error(`no JSON array in response (len ${txt.length}): ${txt.slice(0, 120)}`);
        }
        arr = JSON.parse(txt.slice(open, close + 1));
      } catch (e) {
        console.log(`  batch ${b / BATCH + 1} attempt ${attempt + 1} failed: ${String(e.message).slice(0, 90)}`);
        continue;
      }
      let ok = 0;
      arr.forEach((nt, k) => {
        if (slice[k] && typeof nt === 'string' && accepts(nt)) { out[slice[k].i] = nt; ok++; }
      });
      rewritten += ok;
      console.log(`  batch ${b / BATCH + 1}: ${ok}/${slice.length} accepted`);
      if (ok === slice.length) break;
    }
  }
  kept = entries.length - rewritten;

  const after = poolStats(out);
  const twAfter = topWordShare(out);
  fs.writeFileSync(cand, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `\nwrote ${cand}\n` +
      `  rewritten ${rewritten}, left as-is ${kept}\n` +
      `  BEFORE  adj ${before.adj}  obj ${before.obj}  ratio ${before.ratio}   top word "${tw.word}" ${tw.pct}%\n` +
      `  AFTER   adj ${after.adj}  obj ${after.obj}  ratio ${after.ratio}   top word "${twAfter.word}" ${twAfter.pct}%\n` +
      `\nThe LIVE pool is untouched. A/B it with:\n` +
      `  node scripts/iter-bot.js --bot ${BOT} --mode paleo-landscape --count 6 --post --shadow \\\n` +
      `    --label objled --pool-override ${POOL}=${cand}\n` +
      `Then, only on approval: node scripts/rewrite-object-led.js --bot ${BOT} --pool ${POOL} --promote`
  );
})();
