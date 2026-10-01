#!/usr/bin/env node
/**
 * clean-location-pools.js — the nightly location spot pools, cleaned (NIGHTLY_POOL_CLEANUP_PLAN.md).
 *
 * Kevin 2026-09-30 agreed four steps, after a first version that auto-culled "weak" and "off-card" spots made wrong
 * calls (St. Vitus Cathedral "weak", the Wanaka lavender farms he added "off-card"):
 *   1. DUPLICATES are deactivated automatically, keeping the best of each group. The judge is reliable here.
 *   2. OBJECT spots (a macro texture, a single object, text) are a REVIEW list, never automatic: "let's be careful on
 *      this one, i don't want to just blindly deactivate all closeup seeds". Small and enclosed PLACES always stay.
 *   3. Drift is never auto-culled: each card gets an off-card share so flagrant ones (Gladiator Arena: mostly general
 *      Rome) are fixed case by case.
 *   4. BACKFILL only pools that end up under FLOOR spots.
 * Nothing is deleted: a culled spot is is_active = false, reversible.
 *
 * Only spots the engine can DRAW are considered (nightly + surprise scenes filter on pure_scene_eligible /
 * character_eligible). ~1,677 unnamed landscapes failed the 2026-08-23 "postcard of THIS place" re-audit and were never
 * in the cast pool, so they are retired in practice and would only inflate the counts.
 *
 *   --pass cull      Per card: duplicates (auto), object flags (review), off-card share (report).
 *                    Writes <out>/cards/<card>.cull.json and <out>/summary.json.
 *   --pass drift     Per card: off-concept flags against the card's sub_regions + must_include, for review (adds `drift`
 *                    to the cull file; with no cull file it starts from the pool as it stands).
 *   --pass drift-confirm  A second, keep-by-default read of each drift flag; only flags both reads call off stay.
 *   --pass backfill  Per card: kept = drawable − duplicates − the object flags not rescued in --keep <file> (a JSON array
 *                    of spot ids reviewed and KEPT). A pool under FLOOR (or its original size, if smaller) is refilled at
 *                    the scales it lost; every candidate must grade S/A against the card and pass a duplicate read.
 *                    A pool stays short rather than take a weak spot. Writes <card>.fill.json.
 *   --themed         (with --pass backfill) genre/era cards refill with kinds of places, not named landmarks.
 *   --sql <file>     (with --pass backfill) one migration: guarded deactivations + inserts, flags by the playbook rule
 *                    (cast = non-wide, scene-only = non-intimate). Nothing touches the database until it is applied.
 *
 *   node scripts/clean-location-pools.js --pass cull --cards "prague,yellowstone" --out <dir>
 *   node scripts/clean-location-pools.js --pass backfill --cards "prague,yellowstone" --out <dir> --keep <ids.json> --sql <file>
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { ask, judgeGroups, confirmPairs: confirmPairsWith } = require('./lib/poolJudge');
const { isSameIdea } = require('./lib/ideaSimilarity');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const PASS = arg('pass', '');
let CARDS = String(arg('cards', ''))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const ALL_PLACES = process.argv.includes('--all-places');
const RESUME = process.argv.includes('--resume'); // skip cards that already have this pass's file
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const OUT = arg('out', '.');
const SQL = arg('sql', null);
const KEEP_FILE = arg('keep', null);
// Repair runs (--pass drift cards) refill to this size instead of FLOOR (and regardless of the original size).
const TARGET = Number(arg('target', '0')) || null;
// Genre and era cards (a ranch, a chalet, a red carpet, the age of dinosaurs) refill with KINDS of places, not named
// landmarks: "a SPECIFIC NAMED real place" is how Cattle Ranch filled with named canyons and Prehistoric with Stone Age
// monuments (phase 4 drift review, 2026-09-30).
const THEMED = process.argv.includes('--themed');

const SCALES = ['wide', 'medium', 'intimate'];
const CAMERA_WORDS =
  /\b(view|views|viewed|seen|looking|aerial|vantage|panorama|panoramic|close-up|closeup|shot|angle)\b/i;
const FLOOR = 60; // a pool that ends up under 60 (or under its original size, if smaller) is refilled to it
const CHUNK = 60; // spots per flagging / grading call
const FILL_ROUNDS = Math.max(1, Number(arg('rounds', '2'))); // more rounds for a rebuilt pool
const IMAGINED_BIOMES = new Set(['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater']);

const BASIS_REAL =
  "Two spots are the SAME IDEA when a render of each would show the same place or feature as its main subject from the same kind of view, so a viewer would call the two pictures the same shot. Different features or viewpoints of one landmark are DIFFERENT ideas (a pagoda vs its garden pond vs the lantern avenue). Sharing the card's theme (blossoms, lavender, cypress) is never sameness on its own. Naming a different place does NOT make a different idea when the renders would look the same (the same garage bay at two circuits, the same arcade bay on two storeys of one building).";
const BASIS_IMAGINED =
  "Two spots are the SAME IDEA when their renders would show the same main subject arranged the same way, so a viewer would call them the same picture with small changes (a ringed planet low over a terrace vs a ringed planet low over a gazebo). Sharing the world's signature element is not sameness when the main subject or arrangement differs (a ringed planet over a meadow vs a glass observatory under a nebula).";

async function loadCard(name) {
  const { data: card, error } = await sb
    .from('location_cards')
    .select(
      'name, display_name, biome, biome_config, sub_regions, must_include, architecture, picker_tile'
    )
    .eq('name', name)
    .maybeSingle();
  if (error || !card) throw new Error(`${name}: ${error ? error.message : 'no such card'}`);
  const imagined =
    (card.biome_config && card.biome_config.imagined === true) || IMAGINED_BIOMES.has(card.biome);
  const label = card.display_name || name;
  const list = (v, n) => (Array.isArray(v) ? v.slice(0, n) : []);
  const subs = Array.isArray(card.sub_regions) ? card.sub_regions : [];
  const concept = [
    `"${label}"${imagined ? ', an imagined world' : ''}`,
    // EVERY sub-region: a 12-item cap hid Wanaka from Lavender Fields and its farms read as off-card.
    subs.length ? `sub-regions: ${subs.join('; ')}` : '',
    list(card.must_include, 8).length
      ? `must include: ${list(card.must_include, 8).join('; ')}`
      : '',
    // Examples of the look, NOT a boundary: an early test read Race Track Garage's interior-only list as its scope.
    list(card.architecture, 6).length
      ? `examples of its look (not a complete list): ${list(card.architecture, 6).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
  return { name, label, imagined, concept, romance: card.picker_tile === 'romance', subs };
}

async function drawablePool(name) {
  const { data, error } = await sb
    .from('location_iconic_spots')
    .select('id, spot_text, spot_kind, quality_tier')
    .eq('location_key', name)
    .eq('is_active', true)
    .or('pure_scene_eligible.eq.true,character_eligible.eq.true')
    .order('id')
    .limit(1000);
  if (error) throw new Error(error.message);
  return data.map((r) => ({ id: r.id, text: r.spot_text, scale: r.spot_kind }));
}

/** Step 2 + 3 flags. Returns Map(index → 'object' | 'off_card'); unflagged spots are absent. Deliberately narrow:
 *  only a thing or surface instead of a place is 'object', and when unsure the spot is kept. */
async function flag(ctx, texts) {
  const system = `You check backdrop spots for "${ctx.label}", a location in a dream app. Each spot is where a dream is set: a place the dreamer is pictured in, or a scene.
The location:
${ctx.concept}
Flag a spot "object" ONLY when its subject is a THING or a SURFACE rather than a place:
- a macro or texture close-up (crystals, frost on a puddle, moss on a rock, a microbial mat, bark, a parquet pattern)
- a single object shown on its own (a clock face, a crystal ball, a cabinet of trinkets, a carved relief panel, a statue detail)
- text as the subject (a plaque, an inscription, a sign, lettering)
Every PLACE stays, however small or enclosed: an alcove, a grotto, a walled garden, a nook, a cell, a corridor, a fireside corner, a grave or a row of tombstones. A place that contains an object is a place. A monument, statue, obelisk, column or sculpture that stands in a public place and is big enough to stand beside (Prague's Metronome, an obelisk in a piazza, a column in a forum) is a LANDMARK, not an object.
Separately, flag "off_card" when the spot is clearly a DIFFERENT destination or theme than a person who picked "${ctx.label}" wants: another city, country or region the location doesn't cover, or, for a themed location (an arena, a garage, a haunted house, a castle), a general sight of the surrounding city or region that isn't that theme (a Roman bath or a Tiber bridge for a gladiator arena). Neighbouring quarters and sights of a place, every listed sub-region, and every real example of a themed location are ON the card.
When unsure, do not flag. Most spots should not be flagged.
Reply ONLY a JSON array of the flagged spots (empty if none): [{"n": <n>, "f": "object"|"off_card"}]`;
  const out = new Map();
  for (let off = 0; off < texts.length; off += CHUNK) {
    const chunk = texts.slice(off, off + CHUNK);
    const res = await ask(system, chunk.map((t, i) => `${i + 1}. ${t}`).join('\n'), 3000);
    for (const r of res)
      if (r && Number.isInteger(r.n) && r.n >= 1 && r.n <= chunk.length)
        if (r.f === 'object' || r.f === 'off_card') out.set(off + r.n - 1, r.f);
  }
  return out;
}

/** Drift pass: spots that are off the card's concept, for review. Leans on the card's sub_regions + must_include (which
 *  a drifted card must have before this runs: mig 632 wrote them for the five drift cards). */
async function flagDrift(ctx, texts) {
  const system = `You check backdrop spots for "${ctx.label}", a location in a dream app. Each spot is where a dream is set.
The location, as defined by its creator:
${ctx.concept}
Flag a spot "off_card" when a person who picked "${ctx.label}" would NOT recognise it as this location: a different destination, a general sight of the surrounding region, bare scenery with nothing of the location's theme in it, a place from a film, game or book, or, for a period, era or battle location, a present-day memorial, cemetery, museum, monument park or visitor site standing in for the world as it was. Every listed sub-region and every real example of the theme is ON the card. When unsure, do not flag.
Reply ONLY a JSON array of the flagged spot numbers (empty if none): [<n>, ...]`;
  const out = new Set();
  for (let off = 0; off < texts.length; off += CHUNK) {
    const chunk = texts.slice(off, off + CHUNK);
    const res = await ask(system, chunk.map((t, i) => `${i + 1}. ${t}`).join('\n'), 2000);
    for (const n of res)
      if (Number.isInteger(n) && n >= 1 && n <= chunk.length) out.add(off + n - 1);
  }
  return out;
}

/** Second, keep-by-default read of each drift flag; only flags both reads agree on reach review. The single read
 *  over-flags against a narrow sub-region list (African Safari: Tsavo's elephants and Samburu flagged as off-card). */
async function confirmDrift(ctx, texts) {
  const system = `You double-check spots flagged as off-card for "${ctx.label}", a location in a dream app. Each spot is where a dream is set.
The location, as defined by its creator:
${ctx.concept}
The sub-regions are EXAMPLES, not a boundary: other real places, parks, towns, sights, wildlife and scenery of the same destination or theme are ON the card. A spot is OFF only when a person who picked "${ctx.label}" would clearly not see it as this location: a different destination, a different theme, a general sight of the wider region with nothing of the location in it, or, for a period, era or battle location, a present-day memorial, cemetery, museum or visitor site. When in doubt it is ON.
Reply ONLY a JSON array of the line numbers that are clearly OFF (empty if none): [<n>, ...]`;
  const out = new Set();
  for (let off = 0; off < texts.length; off += CHUNK) {
    const chunk = texts.slice(off, off + CHUNK);
    const res = await ask(system, chunk.map((t, i) => `${i + 1}. ${t}`).join('\n'), 2000);
    for (const n of res)
      if (Number.isInteger(n) && n >= 1 && n <= chunk.length) out.add(off + n - 1);
  }
  return out;
}

/** Backfill candidates only: 'S' | 'A' | 'off_card' | 'not_setting' | 'weak'. New spots must clear a strict bar; this
 *  grader is NOT used on existing spots (it over-calls "weak" on famous landmarks). */
async function gradeNew(ctx, texts) {
  const system = `You grade NEW backdrop spots for "${ctx.label}", a location in a dream app. Each spot is where a dream is set, rendered as one image, with the dreamer in it or as a scene.
The location:
${ctx.concept}
A spot FAILS for one of these reasons:
- "off_card": a different destination or theme than a person who picked "${ctx.label}" wants (another city, country or region the location doesn't cover, or outside its theme${ctx.imagined ? ' or world' : ' or period'}).
- "not_setting": a thing or surface rather than a place (a texture close-up, a single object, text). An enclosed or intimate place IS a setting.
- "weak": vague, garbled, not renderable from its words, or a camera direction instead of a place. For a natural landscape location its own characteristic scenery is not weak even unnamed; for a city, town, cultural or themed location an unnamed landscape that could be anywhere is weak. A kind of place true to a genre or era location's theme (a ranch's branding pens, a chalet's fireside lounge, a premiere's red carpet) is not weak unnamed.
Otherwise it PASSES: "S" when specific, vivid and memorable, "A" when good.
Reply ONLY a JSON array with one entry per spot, in order: [{"n": <n>, "g": "S"|"A"|"off_card"|"not_setting"|"weak"}]`;
  const out = new Array(texts.length).fill('weak'); // a skipped candidate is not used
  for (let off = 0; off < texts.length; off += CHUNK) {
    const chunk = texts.slice(off, off + CHUNK);
    const res = await ask(system, chunk.map((t, i) => `${i + 1}. ${t}`).join('\n'), 4000);
    for (const r of res)
      if (r && Number.isInteger(r.n) && r.n >= 1 && r.n <= chunk.length)
        if (['S', 'A', 'off_card', 'not_setting', 'weak'].includes(r.g)) out[off + r.n - 1] = r.g;
  }
  return out;
}

/** Groups of same-idea spots: [{keep, same:[...], why}] as indices into `texts`. */
async function judge(ctx, texts) {
  return judgeGroups(
    `You find duplicate ideas in the backdrop spots of "${ctx.label}", a dream location in a dream app.
${ctx.imagined ? BASIS_IMAGINED : BASIS_REAL}
Be conservative: group only spots a viewer would genuinely call the same picture. Most spots should be in no group.
For each group, "keep" is the strongest, most specific member; "same" lists the others.
Reply ONLY a JSON array (empty if none): [{"keep": <n>, "same": [<n>, ...], "why": "<5-12 words>"}]. Numbers are the list numbers; each number appears at most once in the whole reply.`,
    texts
  );
}

/** Second, pair-by-pair check of every duplicate the judge named; only pairs both checks call the same picture are
 *  culled. The group read alone was wrong about 1 in 10 (it paired the Arch of Constantine with the Arch of Janus). */
async function confirmPairs(ctx, pairs) {
  const system = `Each line pairs two backdrop spots of "${ctx.label}", a dream location in a dream app. A line is "same" only when a render of each would show the same place or feature from the same kind of view, so a viewer would call the two pictures the same. The same landmark from the same kind of view in different words IS the same (Old Faithful's eruption plume vs its eruption column; the Colosseum's outer arcade vs its arcaded facade). Two DIFFERENT monuments, buildings or features are never the same even when they look alike (the Arch of Constantine and the Arch of Janus), and genuinely different views of one landmark are different (St. Peter's dome from the river vs its nave interior).
Reply ONLY a JSON array of the line numbers that are the same (empty if none): [<n>, ...]`;
  return confirmPairsWith(system, pairs);
}

const byScale = (rows) =>
  Object.fromEntries(SCALES.map((k) => [k, rows.filter((r) => r.scale === k).length]));

async function cull(name) {
  const ctx = await loadCard(name);
  const pool = await drawablePool(name);
  const groups = await judge(
    ctx,
    pool.map((s) => s.text)
  );
  const pairs = groups.flatMap((g) => g.same.map((i) => ({ i, keep: g.keep })));
  const confirmed = await confirmPairs(
    ctx,
    pairs.map((p) => ({ a: pool[p.i].text, b: pool[p.keep].text }))
  );
  const dupIdx = new Set();
  const duplicates = [];
  const unconfirmed = [];
  pairs.forEach((p, k) => {
    if (confirmed.has(k)) {
      dupIdx.add(p.i);
      duplicates.push({ ...pool[p.i], of: pool[p.keep].text });
    } else unconfirmed.push({ text: pool[p.i].text, of: pool[p.keep].text });
  });
  const flags = await flag(
    ctx,
    pool.map((s) => s.text)
  );
  const review = [];
  const offCard = [];
  flags.forEach((f, i) => {
    if (f === 'object' && !dupIdx.has(i)) review.push(pool[i]);
    if (f === 'off_card') offCard.push(pool[i].text);
  });
  return {
    card: name,
    original: pool.length,
    originalByScale: byScale(pool),
    duplicates,
    unconfirmed, // the group read called these duplicates, the pair check didn't: kept
    review,
    offCardCount: offCard.length,
    offCardShare: pool.length ? Math.round((100 * offCard.length) / pool.length) : 0,
    offCardExamples: offCard.slice(0, 8),
  };
}

async function generate(ctx, pool, want) {
  const rules = ctx.imagined
    ? `- 4-10 words; the PLACE only: no people, no actions, no time of day, no weather
- the wonder is VISIBLE in the thing itself, named first; never size comparisons, motion or physics, sounds, written text`
    : THEMED
      ? `- a specific KIND of place inside this location as described${ctx.subs.length ? `, drawn from these areas: ${ctx.subs.join('; ')}` : ''}; name a real place only when the location itself is that place
- for a period or era location, its world as it was then: never today's ruins, parks, monuments, museums or visitor sites
- 4-12 words; the place only: no people, no actions, no time of day, no weather`
      : `- a SPECIFIC NAMED real place or feature, recognisable${ctx.subs.length ? `, within these sub-regions: ${ctx.subs.join('; ')}` : ''}
- 4-12 words; the place only: no people, no actions, no time of day, no weather
${ctx.romance ? '- keep the named place first, then one or two lush, romantic, classy details that genuinely belong there' : ''}`;
  const system = `You write NEW backdrop spots for "${ctx.label}", a location in a dream app. Each spot is where a dream is set, rendered as one image.
The location:
${ctx.concept}
Rules for every spot:
${rules}
- inside this location as described: never another town, city or region, never a general landmark of the wider area, never outside its theme
- a place a person could stand in and be pictured in: never a texture close-up, a single object or text
- written as the place itself, never as a view of it: no "view from", "seen through", "looking out", "panorama of"
- specific and vivid: a viewer can picture exactly this place
- spread across many different subjects: at most two new spots on any one landmark or building, and never one formula repeated with a different place name
Scales: wide (vast vista), medium (one feature fills much of the frame, with ground in front to stand on), intimate (close or enclosed, still a place to be in).
Each new spot must be a DIFFERENT IDEA from every spot in the pool (listed) and from each other: a new subject or a genuinely new view, not a synonym swap.
Reply ONLY [{"scale": "wide"|"medium"|"intimate", "spot": "..."}]`;
  const ask_ = SCALES.filter((k) => want[k] > 0)
    .map((k) => `${want[k]} ${k}`)
    .join(', ');
  const res = await ask(
    system,
    `Pool (do not repeat any of these ideas):\n${pool.map((s) => '- ' + s.text).join('\n')}\n\nWrite: ${ask_}.`,
    6000
  );
  if (process.env.POOL_DEBUG)
    console.log(
      `  [generate ${ctx.name}] want ${ask_} · ${res.length} raw: ${JSON.stringify(res).slice(0, 400)}`
    );
  return (
    res
      .filter((r) => r && typeof r.spot === 'string' && SCALES.includes(r.scale))
      .map((r) => ({ text: r.spot.trim(), scale: r.scale }))
      // A spot is the place, never a view of it (phase 4 step 3 reworded 222 camera lines; don't write new ones).
      .filter((r) => !CAMERA_WORDS.test(r.text))
      // The prompt asks for 4-12 words; 16 is the hard stop (a long-lined pool, Prehistoric's, made every reply 13-20
      // words and the refill silently added nothing).
      .filter((r) => r.text && r.text.split(/\s+/).length <= 16)
  );
}

/** The rows a card loses: every duplicate, plus every reviewed object flag not rescued in --keep. */
function culledRows(c, keepIds) {
  return [
    ...c.duplicates.map((s) => ({ ...s, reason: 'duplicate' })),
    ...c.review.filter((s) => !keepIds.has(s.id)).map((s) => ({ ...s, reason: 'object' })),
    // --pass drift flags, reviewed like the object flags (rescued ids go in --keep).
    ...(c.drift || []).filter((s) => !keepIds.has(s.id)).map((s) => ({ ...s, reason: 'off_card' })),
  ];
}

async function backfill(name, c, keepIds) {
  const ctx = await loadCard(name);
  const offIds = new Set(culledRows(c, keepIds).map((s) => s.id));
  const pool = (await drawablePool(name)).filter((s) => !offIds.has(s.id));
  const target = TARGET || Math.min(c.original, FLOOR);
  const result = {
    card: name,
    original: c.original,
    kept: pool.length,
    target,
    added: [],
    short: 0,
  };
  if (pool.length >= target) return result;
  // Refill the scales the pool lost, in the original pool's proportions (cast needs non-wide, scene-only non-intimate).
  const kept = byScale(pool);
  const need = {};
  for (const k of SCALES)
    need[k] = Math.max(
      0,
      Math.round((target * (c.originalByScale[k] || 0)) / Math.max(1, c.original)) - kept[k]
    );
  let deficit = target - pool.length;
  const sum = () => SCALES.reduce((a, k) => a + need[k], 0);
  while (sum() > deficit) need[SCALES.reduce((a, k) => (need[k] > need[a] ? k : a))]--;
  while (sum() < deficit)
    need[
      SCALES.reduce((a, k) => ((c.originalByScale[k] || 0) > (c.originalByScale[a] || 0) ? k : a))
    ]++;

  for (let round = 1; round <= FILL_ROUNDS && deficit > 0; round++) {
    const want = Object.fromEntries(
      SCALES.map((k) => [k, need[k] > 0 ? Math.ceil(need[k] * 1.5) : 0])
    );
    const all = () => [...pool, ...result.added];
    let cands = await generate(ctx, all(), want);
    // Free lexical prefilter first (charter §5b: the tripwire, not the judge), then the grade, then the judge.
    cands = cands.filter(
      (cd, i) =>
        !all().some(
          (o) => o.text.toLowerCase() === cd.text.toLowerCase() || isSameIdea(o.text, cd.text)
        ) && !cands.slice(0, i).some((o) => isSameIdea(o.text, cd.text))
    );
    const g = await gradeNew(
      ctx,
      cands.map((cd) => cd.text)
    );
    if (process.env.POOL_DEBUG)
      cands.forEach((cd, i) => console.log(`  [${name}] ${g[i]} ${cd.scale}: ${cd.text}`));
    cands = cands
      .map((cd, i) => ({ ...cd, tier: g[i] }))
      .filter((cd) => cd.tier === 'S' || cd.tier === 'A');
    const base = all();
    const groups = await judge(ctx, [...base.map((s) => s.text), ...cands.map((cd) => cd.text)]);
    const clash = new Set();
    for (const gr of groups) {
      const members = [gr.keep, ...gr.same];
      // A candidate that groups with anything is dropped: with the kept pool it's a duplicate, with another
      // candidate only the group's pick survives.
      members.forEach((m) => {
        if (m >= base.length && (members.some((o) => o < base.length) || m !== gr.keep))
          clash.add(m - base.length);
      });
    }
    cands = cands
      .filter((_, i) => !clash.has(i))
      .sort((a, b) => (a.tier === b.tier ? 0 : a.tier === 'S' ? -1 : 1));
    for (const cd of cands) {
      if (need[cd.scale] <= 0) continue;
      result.added.push(cd);
      need[cd.scale]--;
      deficit--;
    }
  }
  result.short = Math.max(0, deficit);
  return result;
}

(async () => {
  if (!['cull', 'backfill', 'drift', 'drift-confirm'].includes(PASS)) {
    console.error('--pass cull|drift|drift-confirm|backfill required');
    process.exit(1);
  }
  fs.mkdirSync(path.join(OUT, 'cards'), { recursive: true });
  if (ALL_PLACES) {
    const { data, error } = await sb
      .from('location_cards')
      .select('name')
      .eq('content_kind', 'place')
      .not('picker_tile', 'is', null)
      .not('picker_category', 'is', null)
      .order('name');
    if (error) throw new Error(error.message);
    CARDS = data.map((r) => r.name);
  }
  if (!CARDS.length) {
    console.error('--cards "<name>,<name>" or --all-places required');
    process.exit(1);
  }
  const keepIds = new Set(KEEP_FILE ? JSON.parse(fs.readFileSync(KEEP_FILE, 'utf8')) : []);
  const file = (name, kind) =>
    path.join(OUT, 'cards', `${name.replace(/[^a-z0-9]+/gi, '-')}.${kind}.json`);
  const kind =
    PASS === 'backfill'
      ? 'fill'
      : PASS === 'cull'
        ? 'cull'
        : PASS === 'drift'
          ? 'drift'
          : 'confirm';
  const queue = CARDS.filter((n) => !(RESUME && fs.existsSync(file(n, kind))));
  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const name = queue[next++];
      try {
        if (PASS === 'drift-confirm') {
          // Keeps only the drift flags a second read also calls off; the rest move to driftUnconfirmed (kept).
          const c = JSON.parse(fs.readFileSync(file(name, 'cull'), 'utf8'));
          const flagged = c.driftAll || c.drift || [];
          const ctx = await loadCard(name);
          const ok = await confirmDrift(
            ctx,
            flagged.map((s) => s.text)
          );
          c.driftAll = flagged;
          c.drift = flagged.filter((_, i) => ok.has(i));
          c.driftUnconfirmed = flagged.filter((_, i) => !ok.has(i));
          fs.writeFileSync(file(name, 'cull'), JSON.stringify(c, null, 1));
          fs.writeFileSync(
            file(name, 'confirm'),
            JSON.stringify({ card: name, confirmed: c.drift.length })
          );
          console.log(
            `${name}: ${flagged.length} flags · ${c.drift.length} confirmed off · ${c.driftUnconfirmed.length} kept by the second read`
          );
        } else if (PASS === 'drift') {
          // Adds `drift` (off-concept flags) to the card's cull file; the backfill then treats the unrescued ones as off.
          // Without a cull file the drift check runs on the pool as it stands (phase 4: the pools were already
          // deduplicated in mig 633).
          let c;
          if (fs.existsSync(file(name, 'cull')))
            c = JSON.parse(fs.readFileSync(file(name, 'cull'), 'utf8'));
          else {
            const now = await drawablePool(name);
            c = {
              card: name,
              original: now.length,
              originalByScale: byScale(now),
              duplicates: [],
              unconfirmed: [],
              review: [],
            };
          }
          const ctx = await loadCard(name);
          const gone = new Set(culledRows({ ...c, drift: [] }, keepIds).map((s) => s.id));
          const pool = (await drawablePool(name)).filter((s) => !gone.has(s.id));
          const flagged = await flagDrift(
            ctx,
            pool.map((s) => s.text)
          );
          c.drift = pool.filter((_, i) => flagged.has(i));
          fs.writeFileSync(file(name, 'cull'), JSON.stringify(c, null, 1));
          fs.writeFileSync(
            file(name, 'drift'),
            JSON.stringify({ card: name, flagged: c.drift.length })
          );
          console.log(
            `${name}: ${pool.length} after cleanup · ${c.drift.length} off-concept flags to review`
          );
        } else if (PASS === 'cull') {
          const r = await cull(name);
          fs.writeFileSync(file(name, 'cull'), JSON.stringify(r, null, 1));
          console.log(
            `${name}: ${r.original} drawable · ${r.duplicates.length} duplicates · ${r.review.length} object flags to review · off-card ${r.offCardShare}%`
          );
        } else {
          if (!fs.existsSync(file(name, 'cull')))
            throw new Error('no cull file; run --pass cull first');
          const c = JSON.parse(fs.readFileSync(file(name, 'cull'), 'utf8'));
          const r = await backfill(name, c, keepIds);
          fs.writeFileSync(file(name, 'fill'), JSON.stringify(r, null, 1));
          console.log(
            `${name}: ${r.kept} kept / floor ${r.target} · added ${r.added.length}${r.short ? ` · SHORT ${r.short}` : ''}`
          );
        }
      } catch (e) {
        console.warn(`${name}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  const culls = CARDS.filter((n) => fs.existsSync(file(n, 'cull'))).map((n) =>
    JSON.parse(fs.readFileSync(file(n, 'cull'), 'utf8'))
  );
  if (PASS === 'cull') {
    const tot = (k) => culls.reduce((a, c) => a + (Array.isArray(c[k]) ? c[k].length : c[k]), 0);
    const summary = {
      cards: culls.length,
      drawable: tot('original'),
      duplicates: tot('duplicates'),
      objectFlags: tot('review'),
      // Step 3: flagrant drift for a case-by-case look, never an automatic cull.
      driftCards: culls
        .filter((c) => c.offCardShare >= 40)
        .map((c) => ({ card: c.card, offCardShare: c.offCardShare, examples: c.offCardExamples })),
    };
    fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
    console.log(
      `\n${summary.cards} cards · ${summary.drawable} drawable · ${summary.duplicates} duplicates · ${summary.objectFlags} object flags · ${summary.driftCards.length} cards ≥40% off-card`
    );
  }

  if (PASS === 'backfill' && SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const done = culls.filter((c) => fs.existsSync(file(c.card, 'fill')));
    const fills = done.map((c) => JSON.parse(fs.readFileSync(file(c.card, 'fill'), 'utf8')));
    const offs = done.flatMap((c) => culledRows(c, keepIds).map((s) => ({ card: c.card, ...s })));
    const adds = fills.flatMap((f) => f.added.map((s) => ({ card: f.card, ...s })));
    const header = `-- ${path.basename(SQL, '.sql')}: location spot pool cleanup (NIGHTLY_POOL_CLEANUP_PLAN.md, scripts/clean-location-pools.js).
-- Kevin 2026-09-30, four steps: same-idea DUPLICATES deactivated automatically (best of each group kept); OBJECT spots
-- (a texture close-up, a single object, text) deactivated only after review ("let's be careful on this one"); drift is
-- never auto-culled; pools left under ${FLOOR} refilled with new spots that grade S/A and pass a duplicate read.
-- Deactivated = is_active false (reversible, nothing deleted). Flags: cast = non-wide, scene-only = non-intimate.
-- ${done.length} cards, ${offs.length} deactivated (${offs.filter((s) => s.reason === 'duplicate').length} duplicates, ${offs.filter((s) => s.reason === 'object').length} objects, ${offs.filter((s) => s.reason === 'off_card').length} off-concept), ${adds.length} added. Re-runnable.\n\n`;
    const upd = offs.map(
      (s) =>
        `UPDATE public.location_iconic_spots SET is_active = false WHERE id = ${q(s.id)} AND is_active;`
    );
    const ins = adds.length
      ? [
          `INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT v.location_key, v.spot_text, v.spot_kind, v.quality_tier, true, v.pure_scene_eligible, v.character_eligible
FROM (VALUES
${adds
  .map(
    (s) =>
      `  (${q(s.card)}, ${q(s.text)}, ${q(s.scale)}, ${q(s.tier)}, ${s.scale !== 'intimate'}, ${s.scale !== 'wide'})`
  )
  .join(',\n')}
) AS v(location_key, spot_text, spot_kind, quality_tier, pure_scene_eligible, character_eligible)
WHERE NOT EXISTS (
  SELECT 1 FROM public.location_iconic_spots s WHERE s.location_key = v.location_key AND s.spot_text = v.spot_text
);`,
        ]
      : [];
    fs.writeFileSync(SQL, header + [...upd, ...ins].join('\n') + '\n');
    console.log(`wrote ${SQL} (${offs.length} deactivations, ${adds.length} inserts)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
