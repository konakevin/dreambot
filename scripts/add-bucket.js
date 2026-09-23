#!/usr/bin/env node
/**
 * add-bucket.js — append a new BUCKET (named sub-theme) to an existing pool, in that pool's own
 * shape and voice.
 *
 * A bucket is a new SUBJECT inside a path that already exists, so no path code changes: the path
 * picks from the pool it always picked from and the new entries are simply in it. See
 * BOT_POOL_EXPANSION_STATE.md §2e.
 *
 * WHY THIS IS ONE TOOL AND NOT 25 HAND-WRITTEN GENERATORS. Every bot's pools have a distinct house
 * voice, and a bucket written in the wrong voice is worse than no bucket:
 *   bloombot  "DARK LOTUS POND — a broad still pond of near-black water, glass-calm and ..."
 *   mangabot  "Konbini late-night with magazine-rack close foreground, fluorescent shelves ..."
 *   farmbot   "A potter's wheel crouches low at the center of the workshop, a thick lump of ..."
 * So the tool READS the destination pool, samples real entries as voice exemplars, detects whether
 * the pool holds plain strings or `{ tags, description }` objects, and asks for the same. It never
 * imposes a format of its own.
 *
 * SAFETY:
 *  - append:true always. generatePool defaults to OVERWRITE, and 51 scripts were silently in that
 *    state before they were fixed. This tool never overwrites.
 *  - refuses a bucket whose tag could never roll, by running the bucketEligibility pre-flight
 *    first (a tag-filtered pool whose path does not allow the new tag drops every entry silently).
 *  - --dry-run prints the plan, the detected shape, the exemplars and the cost, and writes nothing.
 *
 * Usage:
 *   node scripts/add-bucket.js --spec buckets.json --dry-run
 *   node scripts/add-bucket.js --spec buckets.json --apply
 *   node scripts/add-bucket.js --spec buckets.json --apply --only gothbot     # one bot
 *   node scripts/add-bucket.js --spec buckets.json --apply --count 25
 *
 * Spec entry:
 *   {
 *     "bot": "gothbot",
 *     "pool": "gothbot_sanctum_interior",   // seed file basename
 *     "symbol": "GOTHBOT_SANCTUM_INTERIOR", // pools.js symbol, for the eligibility pre-flight
 *     "bucket": "catacomb library",         // human name, also the tag if the pool is tagged
 *     "tag": "catacomb-library",            // optional explicit tag
 *     "brief": "shelves of mouldering tomes built into ossuary niches ..."
 *   }
 */
const fs = require('fs');
const path = require('path');
const { generatePool } = require('./lib/seedGenHelper');
const { tagVocabulary, willBucketRoll } = require('./lib/bucketEligibility');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const SPEC = flag('--spec');
const ONLY = flag('--only');
const COUNT = parseInt(flag('--count', '25'), 10);
const APPLY = argv.includes('--apply');
const CENTS_PER_ENTRY = 0.012;

if (!SPEC) {
  console.error('Usage: node scripts/add-bucket.js --spec <file.json> [--apply] [--only <bot>] [--count N]');
  process.exit(2);
}

const poolPathOf = (bot, pool) => path.join(ROOT, bot, 'seeds', `${pool}.json`);
const readPool = (bot, pool) => {
  try {
    return JSON.parse(fs.readFileSync(poolPathOf(bot, pool), 'utf8'));
  } catch {
    return null;
  }
};

/** Every .js in a bot module — the search space for tag-filter call sites. */
function allSrcOf(bot) {
  let out = '';
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'seeds') walk(p);
      } else if (e.name.endsWith('.js')) out += fs.readFileSync(p, 'utf8') + '\n';
    }
  };
  walk(path.join(ROOT, bot));
  return out;
}

/** Spread the exemplars across the pool rather than taking the first N, which are often one theme. */
function exemplars(entries, n = 4) {
  const step = Math.max(1, Math.floor(entries.length / n));
  const out = [];
  for (let i = 0; i < entries.length && out.length < n; i += step) out.push(entries[i]);
  return out;
}

const specs = JSON.parse(fs.readFileSync(SPEC, 'utf8')).filter((s) => !ONLY || s.bot === ONLY);

// ── plan + pre-flight ─────────────────────────────────────────────────────────
const plan = [];
const refused = [];
for (const s of specs) {
  const entries = readPool(s.bot, s.pool);
  if (!Array.isArray(entries)) {
    refused.push({ ...s, why: `pool file not found: ${poolPathOf(s.bot, s.pool)}` });
    continue;
  }
  const vocab = tagVocabulary(entries);
  const shape = vocab.tagged > vocab.untagged ? 'tagged' : 'string';
  const tag = s.tag || s.bucket.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // A tag-filtered pool whose paths do not allow this tag would drop every entry silently.
  if (shape === 'tagged' && s.symbol) {
    const r = willBucketRoll({ symbol: s.symbol, tag, allSrc: allSrcOf(s.bot) });
    if (r.ok === false) {
      refused.push({ ...s, why: `${r.reason} — ${r.action}` });
      continue;
    }
  }
  plan.push({ ...s, tag, shape, existing: entries.length, entries });
}

const total = plan.length * COUNT;
console.log(
  `Buckets to add: ${plan.length}${refused.length ? ` (${refused.length} REFUSED)` : ''}\n` +
    `  ${COUNT} entries each = ${total} entries, about $${(total * CENTS_PER_ENTRY).toFixed(2)}\n`
);
for (const p of plan) {
  console.log(`  ${p.bot}/${p.pool}  (${p.existing} entries, ${p.shape})  + "${p.bucket}"${p.shape === 'tagged' ? ` [${p.tag}]` : ''}`);
}
if (refused.length) {
  console.log('\nREFUSED — these would never roll:');
  for (const r of refused) console.log(`  ${r.bot}/${r.pool} "${r.bucket}"\n      ${r.why}`);
}

if (!APPLY) {
  if (plan[0]) {
    console.log(`\nvoice exemplars sampled from ${plan[0].bot}/${plan[0].pool}:`);
    for (const e of exemplars(plan[0].entries)) {
      console.log(`  · ${JSON.stringify(e).slice(0, 150)}`);
    }
  }
  console.log('\nDRY RUN — nothing written. Re-run with --apply.');
  process.exit(0);
}

// ── generate ──────────────────────────────────────────────────────────────────
function metaPromptFor(p) {
  const ex = exemplars(p.entries)
    .map((e) => `  ${JSON.stringify(e)}`)
    .join('\n');
  const shapeRule =
    p.shape === 'tagged'
      ? `━━━ ENTRY SHAPE — STRUCTURED OBJECT, NON-NEGOTIABLE ━━━\nEach entry is a JSON object with exactly two fields:\n  { "tags": ["${p.tag}"], "description": "<the entry>" }\nEvery entry carries the tag "${p.tag}" and nothing else in tags.`
      : `━━━ ENTRY SHAPE ━━━\nEach entry is a PLAIN STRING, matching the exemplars above exactly — same length, same punctuation habits, same opening convention (if they open with a CAPS title and a dash, yours do too; if they open mid-sentence, yours do too).`;

  return `You are writing ${'${n}'} new entries for an EXISTING pool in a live image-generation bot. Your entries will sit alongside the ones below and must be indistinguishable from them in voice, length and format.

━━━ THE POOL YOU ARE WRITING INTO ━━━
${p.bot} / ${p.pool} — ${p.existing} existing entries.

━━━ REAL ENTRIES FROM THIS POOL (match this voice EXACTLY — do not reuse their content) ━━━
${ex}

${shapeRule}

━━━ THE NEW SUBJECT — this is what every entry you write is about ━━━
${p.bucket.toUpperCase()}

${p.brief}

━━━ RULES ━━━
- Study the exemplars for LENGTH and register and match them. If they average 30 words, write 30, not 15 and not 60.
- Every entry is a DIFFERENT take on the new subject. Vary the specific objects, the vantage, the time of day, the mood, the detail you zoom in on.
- Stay inside this bot's world. You are adding a new subject to an existing show, not changing the show.
- Do NOT name camera angles, lighting quality or colour palettes unless the exemplars do — those are other axes in this bot and naming them here fights them.
- No text, no lettering, no readable signage, no watermarks, no brand names on surfaces.
- No humans unless the exemplars clearly have them.

━━━ DEDUP ━━━
Vary the concrete objects and the vantage across your ${'${n}'} entries. Two entries describing the same thing from the same angle is a failure.

━━━ OUTPUT ━━━
JSON array of ${'${n}'} ${p.shape === 'tagged' ? 'objects' : 'strings'}. No preamble, no numbering, no commentary.`;
}

(async () => {
  const results = [];
  let i = 0;
  const CONCURRENCY = 3; // throttle rule
  const workers = Array.from({ length: Math.min(CONCURRENCY, plan.length) }, async () => {
    while (i < plan.length) {
      const p = plan[i++];
      const before = (readPool(p.bot, p.pool) || []).length;
      const tmpl = metaPromptFor(p);
      try {
        await generatePool({
          outPath: path.relative(path.join(__dirname, '..'), poolPathOf(p.bot, p.pool)),
          total: before + COUNT,
          batch: COUNT,
          append: true, // never overwrite
          metaPrompt: (n) => tmpl.replace(/\$\{n\}/g, String(n)),
        });
      } catch (e) {
        results.push({ ...p, before, after: before, error: String(e.message).slice(0, 160) });
        console.log(`  XX ${p.bot}/${p.pool} "${p.bucket}": ${String(e.message).slice(0, 120)}`);
        continue;
      }
      const after = (readPool(p.bot, p.pool) || []).length;
      results.push({ ...p, before, after });
      console.log(`  ${after > before ? 'ok' : '!!'} ${p.bot}/${p.pool} "${p.bucket}": ${before} -> ${after}`);
    }
  });
  await Promise.all(workers);

  const grew = results.filter((r) => r.after > r.before);
  const gained = grew.reduce((s, r) => s + (r.after - r.before), 0);
  console.log(
    `\nDONE: ${grew.length}/${plan.length} buckets added, ${gained} entries (about $${(gained * CENTS_PER_ENTRY).toFixed(2)})`
  );
  const stalled = results.filter((r) => r.after <= r.before);
  for (const r of stalled) {
    console.log(`  NO GROWTH  ${r.bot}/${r.pool} "${r.bucket}"${r.error ? `: ${r.error}` : ' — semantic ceiling or all-duplicate batch'}`);
  }
  console.log('\nNEXT: node scripts/scan-bot-seed-dupes.js && npm run scan:buckets');
})();
