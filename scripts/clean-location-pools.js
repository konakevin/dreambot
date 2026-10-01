#!/usr/bin/env node
/**
 * clean-location-pools.js — the nightly location spot pools, cleaned in two passes (NIGHTLY_POOL_CLEANUP_PLAN.md).
 * Kevin 2026-09-30: "scan originals first, deactivate dupes in packed pools, but also we should backfill any pools that
 * are severely culled ... first deactivate, 2nd analyze pool size and quality and backfill as necessary", and "do not
 * let weak seeds or drift".
 *
 *   --pass cull      Grade every active spot against the CARD's own concept (name, sub-regions, architecture, palette),
 *                    not against its pool, which can have drifted itself (Gladiator Arena's was mostly general Rome).
 *                    Off-card, non-setting and weak spots fail; then an LLM reads the survivors for duplicates
 *                    (SEED_DIVERSITY_CHARTER.md §5b: judged, never by word overlap) and every member of a group but its
 *                    best fails too. Failures are DEACTIVATED (is_active = false: reversible, nothing deleted).
 *                    Writes <out>/cards/<card>.cull.json.
 *   --pass backfill  Reads the cull files. Where a pool fell below its target (TARGET_SHARE of the original's on-card part, at least
 *                    FLOOR, never above the original) it writes new spots at the scales the pool lost, then puts every
 *                    candidate through the same grade and a duplicate read against the kept pool. Only S and A
 *                    survivors are used: a pool stays short rather than take a weak spot. Writes <card>.fill.json.
 *   --sql <file>     (with --pass backfill) one migration from both passes: guarded deactivations + inserts, flags by
 *                    the playbook rule (cast = non-wide, scene-only = non-intimate). Nothing touches the database
 *                    until that file is applied, so the live pools never sit culled without their backfill.
 *
 *   node scripts/clean-location-pools.js --pass cull --cards "gladiator arena,monte carlo" --out <dir>
 *   node scripts/clean-location-pools.js --pass backfill --cards "gladiator arena,monte carlo" --out <dir> --sql <file>
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { callClaude } = require('./lib/anthropic');
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

const SCALES = ['wide', 'medium', 'intimate'];
const TARGET_SHARE = 0.7; // a culled pool is refilled to 70% of its original size...
const FLOOR = 60; // ...and never left under 60 (or under its original, if it started smaller)
const GRADE_CHUNK = 60; // spots per grading call
const FILL_ROUNDS = 2;
const IMAGINED_BIOMES = new Set(['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater']);

const BASIS_REAL =
  "Two spots are the SAME IDEA when a render of each would show the same place or feature as its main subject from the same kind of view, so a viewer would call the two pictures the same shot. Different features or viewpoints of one landmark are DIFFERENT ideas (a pagoda vs its garden pond vs the lantern avenue). Sharing the card's theme (blossoms, lavender, cypress) is never sameness on its own. Naming a different place does NOT make a different idea when the renders would look the same (the same garage bay at two circuits, the same arcade bay on two storeys of one building).";
const BASIS_IMAGINED =
  "Two spots are the SAME IDEA when their renders would show the same main subject arranged the same way, so a viewer would call them the same picture with small changes (a ringed planet low over a terrace vs a ringed planet low over a gazebo). Sharing the world's signature element is not sameness when the main subject or arrangement differs (a ringed planet over a meadow vs a glass observatory under a nebula).";

/** Index of the bracket closing the array that opens at `start`, or -1. */
function arrayEnd(raw, start) {
  let depth = 0;
  let inStr = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return i;
  }
  return -1;
}
/** The first balanced JSON array in a reply that parses. A model sometimes adds a note after the array or a bracket in
 *  prose before it (both broke the first audit), so every '[' is tried in turn. */
function parse(raw) {
  for (let start = raw.indexOf('['); start >= 0; start = raw.indexOf('[', start + 1)) {
    const end = arrayEnd(raw, start);
    if (end < 0) continue;
    try {
      const v = JSON.parse(raw.slice(start, end + 1));
      if (Array.isArray(v)) return v;
    } catch {
      // not the array; try the next bracket
    }
  }
  throw new Error('no parseable JSON array in reply');
}
async function ask(system, content, maxTokens = 6000) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await callClaude({
        job: 'reseed',
        system,
        content,
        maxTokens,
        retryDelaysMs: [2000, 8000, 20000],
        timeoutMs: 180000,
      });
      return parse(r.raw);
    } catch (e) {
      if (a === 2) throw e;
    }
  }
  return [];
}

async function loadCard(name) {
  const { data: card, error } = await sb
    .from('location_cards')
    .select(
      'name, display_name, biome, biome_config, sub_regions, must_include, architecture, visual_palette, picker_tile'
    )
    .eq('name', name)
    .maybeSingle();
  if (error || !card) throw new Error(`${name}: ${error ? error.message : 'no such card'}`);
  const imagined =
    (card.biome_config && card.biome_config.imagined === true) || IMAGINED_BIOMES.has(card.biome);
  const label = card.display_name || name;
  const list = (v, n) => (Array.isArray(v) ? v.slice(0, n) : []);
  const concept = [
    `"${label}"${imagined ? ', an imagined world' : ''}`,
    list(card.sub_regions, 12).length
      ? `sub-regions: ${list(card.sub_regions, 12).join('; ')}`
      : '',
    list(card.must_include, 8).length
      ? `must include: ${list(card.must_include, 8).join('; ')}`
      : '',
    // Examples of the look, NOT a boundary: the first cull test read Race Track Garage's interior-only architecture
    // list as the scope and culled every named circuit's garage.
    list(card.architecture, 6).length
      ? `examples of its look (not a complete list): ${list(card.architecture, 6).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
  return {
    name,
    label,
    imagined,
    concept,
    romance: card.picker_tile === 'romance',
    subs: card.sub_regions || [],
  };
}

async function activePool(name) {
  const { data, error } = await sb
    .from('location_iconic_spots')
    .select('id, spot_text, spot_kind, quality_tier')
    .eq('location_key', name)
    .eq('is_active', true)
    .order('id')
    .limit(1000);
  if (error) throw new Error(error.message);
  return data.map((r) => ({
    id: r.id,
    text: r.spot_text,
    scale: r.spot_kind,
    tier: r.quality_tier,
  }));
}

/** Grade spots against the card's concept. Returns one grade per spot: 'S' | 'A' | 'off_card' | 'not_setting' |
 *  'weak'. A spot the reply skips counts as a pass (the grader is told to be fair; a miss must not cull). */
async function grade(ctx, texts) {
  const system = `You grade backdrop spots for "${ctx.label}", a location in a dream app. Each spot is where a dream is set, rendered as one image, with the dreamer in it or as a scene.
The location:
${ctx.concept}
A spot FAILS for one of these reasons:
- "off_card": clearly a DIFFERENT destination or theme than a person who picked "${ctx.label}" wants: another city, country or region the location doesn't cover, a general landmark of the wider area that isn't this place, or something outside the location's theme${ctx.imagined ? ' or world' : ' or period'}. Judge scope the way that traveller would, not by the literal name: the neighbouring quarters and sights of the same place are ON the card, and for a themed location every real example of the theme is on it (any circuit's garage for a race track garage, any Roman amphitheatre for a gladiator arena).
- "not_setting": not a place a person could stand in and be pictured: a close-up of an object, carving, relief, capital, plaque or inscription, or a spot whose subject is text, a sign or lettering. An enclosed or intimate place (an alcove, a grotto, a walled garden) IS a setting.
- "weak": vague or generic (it could be almost anywhere), garbled, not renderable from its words, or a camera direction or shot description instead of a place.
Otherwise it PASSES: "S" when it is specific, vivid and memorable, "A" when it is good.
Be fair: most spots in a well-made pool pass.
Reply ONLY a JSON array with one entry per spot, in order: [{"n": <n>, "g": "S"|"A"|"off_card"|"not_setting"|"weak"}]`;
  const out = new Array(texts.length).fill('A');
  for (let off = 0; off < texts.length; off += GRADE_CHUNK) {
    const chunk = texts.slice(off, off + GRADE_CHUNK);
    const res = await ask(system, chunk.map((t, i) => `${i + 1}. ${t}`).join('\n'), 4000);
    for (const r of res) {
      if (!r || !Number.isInteger(r.n) || r.n < 1 || r.n > chunk.length) continue;
      if (['S', 'A', 'off_card', 'not_setting', 'weak'].includes(r.g)) out[off + r.n - 1] = r.g;
    }
  }
  return out;
}
const passes = (g) => g === 'S' || g === 'A';

/** Groups of same-idea spots: [{keep, same:[...], why}] as indices into `texts`. */
async function judge(ctx, texts) {
  if (texts.length < 2) return [];
  const system = `You find duplicate ideas in the backdrop spots of "${ctx.label}", a dream location in a dream app.
${ctx.imagined ? BASIS_IMAGINED : BASIS_REAL}
Be conservative: group only spots a viewer would genuinely call the same picture. Most spots should be in no group.
For each group, "keep" is the strongest, most specific member; "same" lists the others.
Reply ONLY a JSON array (empty if none): [{"keep": <n>, "same": [<n>, ...], "why": "<5-12 words>"}]. Numbers are the list numbers; each number appears at most once in the whole reply.`;
  const groups = await ask(system, texts.map((t, i) => `${i + 1}. ${t}`).join('\n'), 4000);
  const seen = new Set();
  const out = [];
  for (const g of groups) {
    const members = [g && g.keep, ...(g && Array.isArray(g.same) ? g.same : [])].filter(
      (n) => Number.isInteger(n) && n >= 1 && n <= texts.length
    );
    if (members.length < 2 || members.some((n) => seen.has(n))) continue;
    members.forEach((n) => seen.add(n));
    out.push({
      keep: members[0] - 1,
      same: members.slice(1).map((n) => n - 1),
      why: String(g.why || ''),
    });
  }
  return out;
}

async function cull(name) {
  const ctx = await loadCard(name);
  const pool = await activePool(name);
  const grades = await grade(
    ctx,
    pool.map((s) => s.text)
  );
  const culled = [];
  const survivors = [];
  pool.forEach((s, i) =>
    passes(grades[i]) ? survivors.push(s) : culled.push({ ...s, reason: grades[i] })
  );
  const groups = await judge(
    ctx,
    survivors.map((s) => s.text)
  );
  const dupIdx = new Set();
  for (const g of groups)
    for (const i of g.same) {
      dupIdx.add(i);
      culled.push({ ...survivors[i], reason: 'duplicate', of: survivors[g.keep].text });
    }
  const kept = survivors.filter((_, i) => !dupIdx.has(i));
  const byScale = (rows) =>
    Object.fromEntries(SCALES.map((k) => [k, rows.filter((r) => r.scale === k).length]));
  const reasons = {};
  for (const c of culled) reasons[c.reason] = (reasons[c.reason] || 0) + 1;
  return {
    card: name,
    original: pool.length,
    originalByScale: byScale(pool),
    culledCount: culled.length,
    reasons,
    culled,
    kept,
    keptByScale: byScale(kept),
  };
}

async function generate(ctx, pool, want) {
  const rules = ctx.imagined
    ? `- 4-10 words; the PLACE only: no people, no actions, no time of day, no weather
- the wonder is VISIBLE in the thing itself, named first; never size comparisons, motion or physics, sounds, written text`
    : `- a SPECIFIC NAMED real place or feature, recognisable${ctx.subs.length ? `, within these sub-regions: ${ctx.subs.join('; ')}` : ''}
- 4-12 words; the place only: no people, no actions, no time of day, no weather
${ctx.romance ? '- keep the named place first, then one or two lush, romantic, classy details that genuinely belong there' : ''}`;
  const system = `You write NEW backdrop spots for "${ctx.label}", a location in a dream app. Each spot is where a dream is set, rendered as one image.
The location:
${ctx.concept}
Rules for every spot:
${rules}
- inside this location as described: never another town, city or region, never a general landmark of the wider area, never outside its theme
- a whole setting a person could stand in and be pictured in: never a close-up of an object, carving, plaque or inscription, never text, signs or lettering
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
  return res
    .filter((r) => r && typeof r.spot === 'string' && SCALES.includes(r.scale))
    .map((r) => ({ text: r.spot.trim(), scale: r.scale }))
    .filter((r) => r.text && r.text.split(/\s+/).length <= 12);
}

async function backfill(name, c) {
  const ctx = await loadCard(name);
  // Sized from the ON-CARD part of the original pool: a pool that had drifted (Gladiator Arena was mostly general Rome)
  // is refilled to a healthy size, not to its inflated count, which would only buy weak spots.
  const onCard = c.original - (c.reasons.off_card || 0);
  const target = Math.min(c.original, Math.max(FLOOR, Math.ceil(onCard * TARGET_SHARE)));
  const result = {
    card: name,
    original: c.original,
    kept: c.kept.length,
    target,
    added: [],
    short: 0,
  };
  // Only a SEVERELY culled pool is refilled (Kevin: "backfill any pools that are severely culled"): under FLOOR, or under
  // half of its on-card size. A packed pool that lost its repeats is already healthy, and topping it up only buys
  // near-copies (the first test gave Race Track Garage 28 "single open garage bay" lines at different circuits).
  if (c.kept.length >= target || (c.kept.length >= FLOOR && c.kept.length >= onCard / 2))
    return result;
  // Refill the scales the pool lost, in the original pool's proportions (cast needs non-wide, scene-only non-intimate).
  const need = {};
  for (const k of SCALES)
    need[k] = Math.max(
      0,
      Math.round((target * (c.originalByScale[k] || 0)) / Math.max(1, c.original)) -
        (c.keptByScale[k] || 0)
    );
  let deficit = target - c.kept.length;
  const sum = () => SCALES.reduce((a, k) => a + need[k], 0);
  while (sum() > deficit) need[SCALES.reduce((a, k) => (need[k] > need[a] ? k : a))]--;
  while (sum() < deficit)
    need[
      SCALES.reduce((a, k) => ((c.originalByScale[k] || 0) > (c.originalByScale[a] || 0) ? k : a))
    ]++;

  const pool = c.kept.map((s) => ({ text: s.text, scale: s.scale }));
  for (let round = 1; round <= FILL_ROUNDS && deficit > 0; round++) {
    const want = Object.fromEntries(
      SCALES.map((k) => [k, need[k] > 0 ? Math.ceil(need[k] * 1.5) : 0])
    );
    let cands = await generate(ctx, [...pool, ...result.added], want);
    // Free lexical prefilter first (charter §5b: the tripwire, not the judge), then the grade, then the judge.
    const all = () => [...pool, ...result.added];
    cands = cands.filter(
      (cd, i) =>
        !all().some(
          (o) => o.text.toLowerCase() === cd.text.toLowerCase() || isSameIdea(o.text, cd.text)
        ) && !cands.slice(0, i).some((o) => isSameIdea(o.text, cd.text))
    );
    const g = await grade(
      ctx,
      cands.map((cd) => cd.text)
    );
    cands = cands.map((cd, i) => ({ ...cd, tier: g[i] })).filter((cd) => passes(cd.tier));
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
  if (PASS !== 'cull' && PASS !== 'backfill') {
    console.error('--pass cull|backfill required');
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
  const file = (name, kind) =>
    path.join(OUT, 'cards', `${name.replace(/[^a-z0-9]+/gi, '-')}.${kind}.json`);
  const kind = PASS === 'cull' ? 'cull' : 'fill';
  const queue = CARDS.filter((n) => !(RESUME && fs.existsSync(file(n, kind))));
  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const name = queue[next++];
      try {
        if (PASS === 'cull') {
          const r = await cull(name);
          fs.writeFileSync(file(name, 'cull'), JSON.stringify(r, null, 1));
          const why = Object.entries(r.reasons)
            .map(([k, v]) => `${k} ${v}`)
            .join(', ');
          console.log(
            `${name}: ${r.original} → ${r.kept.length} kept · culled ${r.culledCount}${why ? ` (${why})` : ''}`
          );
        } else {
          if (!fs.existsSync(file(name, 'cull')))
            throw new Error('no cull file; run --pass cull first');
          const c = JSON.parse(fs.readFileSync(file(name, 'cull'), 'utf8'));
          const r = await backfill(name, c);
          fs.writeFileSync(file(name, 'fill'), JSON.stringify(r, null, 1));
          console.log(
            `${name}: kept ${r.kept} / target ${r.target} · added ${r.added.length}${r.short ? ` · SHORT ${r.short}` : ''}`
          );
        }
      } catch (e) {
        console.warn(`${name}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  if (PASS === 'backfill' && SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const done = CARDS.filter(
      (n) => fs.existsSync(file(n, 'cull')) && fs.existsSync(file(n, 'fill'))
    );
    const culls = done.map((n) => JSON.parse(fs.readFileSync(file(n, 'cull'), 'utf8')));
    const fills = done.map((n) => JSON.parse(fs.readFileSync(file(n, 'fill'), 'utf8')));
    const offs = culls.flatMap((c) => c.culled.map((s) => ({ card: c.card, ...s })));
    const adds = fills.flatMap((f) => f.added.map((s) => ({ card: f.card, ...s })));
    const header = `-- ${path.basename(SQL, '.sql')}: location spot pool cleanup (NIGHTLY_POOL_CLEANUP_PLAN.md, scripts/clean-location-pools.js).
-- Kevin 2026-09-30: "scan originals first, deactivate dupes ... backfill any pools that are severely culled", "do not let
-- weak seeds or drift". Pass 1 graded every active spot against its card's concept (off-card, not a setting, weak) and
-- judged the survivors for same-idea duplicates; those rows are DEACTIVATED (reversible, nothing deleted). Pass 2
-- refilled pools that fell under ${Math.round(TARGET_SHARE * 100)}% of their size (at least ${FLOOR}) with new spots that passed the same grade (S/A) and
-- a duplicate read. Flags: cast = non-wide, scene-only = non-intimate. ${done.length} cards, ${offs.length} deactivated, ${adds.length} added. Re-runnable.\n\n`;
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
