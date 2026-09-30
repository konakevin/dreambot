#!/usr/bin/env node
/**
 * dedupe-location-spots.js — make a location card's spots actually distinct, the SEED_DIVERSITY_CHARTER.md §5b way
 * (Kevin 2026-09-30: "apply the same sort of deduping that we recently developed for bots to ensure actual uniqueness,
 * and not a weak regex checker").
 *
 *   1. JUDGE   an LLM reads the card's whole active pool and groups spots that are the same idea (a render of each
 *              would be the same picture). Pools are 50-150 entries, so one read covers every pair, including the
 *              adjective swaps the lexical measure (scripts/lib/ideaSimilarity.js) provably misses.
 *   2. REWRITE every duplicate after the first becomes a NEW idea in the card's own voice, same scale (so eligibility
 *              holds). Never delete (Kevin: "make them actually distinct in idea"). A rewrite that lexically matches
 *              any other entry is rejected (ideaSimilarity.isSameIdea: the free prefilter, not the judge).
 *   3. VERIFY  re-judge the rewritten pool; rewrites that land on another idea are rewritten again (2 rounds max).
 *
 * Offline: writes <out>/report.json and, with --sql, a migration that updates spot_text by id (guarded on the old
 * text). Read the clusters before applying: the judge can over-call on pools that share one format (charter #21).
 *
 *   node scripts/dedupe-location-spots.js --cards "celestial realm,overgrown wonders" --out /tmp/x --sql supabase/migrations/NNN_x.sql
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
let CARDS = String(arg('cards', ''))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const ALL_PLACES = process.argv.includes('--all-places'); // every picker place card
const AUDIT = process.argv.includes('--audit'); // judge once, change nothing
const RESUME = process.argv.includes('--resume'); // skip cards that already have a result file in --out
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const ROUNDS = 3;
const OUT = arg('out', '.');
const SQL = arg('sql', null);
const IMAGINED_BIOMES = new Set(['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater']);

const BASIS_REAL =
  "Two spots are the SAME IDEA when a render of each would show the same place or feature as its main subject from the same kind of view, so a viewer would call the two pictures the same shot. Different features or viewpoints of one landmark are DIFFERENT ideas (a pagoda vs its garden pond vs the lantern avenue). Sharing the card's theme (blossoms, lavender, cypress) is never sameness on its own.";
const BASIS_IMAGINED =
  "Two spots are the SAME IDEA when their renders would show the same main subject arranged the same way, so a viewer would call them the same picture with small changes (a ringed planet low over a terrace vs a ringed planet low over a gazebo). Sharing the world's signature element is not sameness when the main subject or arrangement differs (a ringed planet over a meadow vs a glass observatory under a nebula).";

/** The first balanced JSON array in a reply (a model sometimes adds a note after it, which broke Tahiti's audit). */
function parse(raw) {
  const start = raw.indexOf('[');
  if (start < 0) throw new Error('no JSON array in reply');
  let depth = 0;
  let inStr = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return JSON.parse(raw.slice(start, i + 1));
  }
  throw new Error('unbalanced JSON array in reply');
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
}

async function judge(card, basis, pool) {
  const system = `You find duplicate ideas in the backdrop spots of "${card}", a dream location in a dream app.
${basis}
Be conservative: group only spots a viewer would genuinely call the same picture. Most spots should be in no group.
For each group, "keep" is the strongest, most specific member; "same" lists the others.
Reply ONLY a JSON array (empty if none): [{"keep": <n>, "same": [<n>, ...], "why": "<5-12 words>"}]. Numbers are the list numbers; each number appears at most once in the whole reply.`;
  const content = pool.map((s, i) => `${i + 1}. ${s.text}`).join('\n');
  const groups = await ask(system, content, 4000);
  const seen = new Set();
  const out = [];
  for (const g of Array.isArray(groups) ? groups : []) {
    const members = [g.keep, ...(Array.isArray(g.same) ? g.same : [])].filter(
      (n) => Number.isInteger(n) && n >= 1 && n <= pool.length
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

async function rewrite(ctx, pool, slots) {
  const rules = ctx.imagined
    ? `- 4-10 words; the PLACE only: no people, no actions, no time of day, no weather
- the wonder is VISIBLE in the thing itself, named first; never size comparisons, motion or physics, sounds, written text
- beautiful and dreamlike, true to the concept: ${ctx.must.join('; ')}`
    : `- a SPECIFIC NAMED real place or feature, recognisable, within these sub-regions: ${ctx.subs.join('; ')}
- 4-12 words; the place only: no people, no actions, no time of day, no weather
${ctx.romance ? '- keep the named place first, then one or two lush, romantic, classy details that genuinely belong there\n' : ''}- concept: ${ctx.must.join('; ')}`;
  const system = `You write NEW backdrop spots for "${ctx.label}", a dream location in a dream app, to replace duplicates.
Rules for every spot:
${rules}
Each new spot must be a DIFFERENT IDEA from every spot already in the pool (listed) and from each other: a new subject or a genuinely new view, not a synonym swap. Keep the requested scale: wide (vast vista), medium (one feature fills much of the frame, with ground in front to stand on), intimate (close or enclosed).
Reply ONLY [{"slot": <n>, "spot": "..."}] for the slots given.`;
  const content = `Pool (do not repeat any of these ideas):\n${pool.map((s) => '- ' + s.text).join('\n')}\n\nSlots to fill:\n${slots.map((s) => `${s.slot}. scale ${s.scale} (replacing: ${s.old})`).join('\n')}`;
  const res = await ask(system, content, 6000);
  return new Map(
    (Array.isArray(res) ? res : [])
      .filter((r) => r && r.spot)
      .map((r) => [r.slot, String(r.spot).trim()])
  );
}

async function processCard(name) {
  const { data: card, error: e1 } = await sb
    .from('location_cards')
    .select('name, display_name, biome, biome_config, sub_regions, must_include, picker_tile')
    .eq('name', name)
    .maybeSingle();
  if (e1 || !card) throw new Error(`${name}: ${e1 ? e1.message : 'no such card'}`);
  const { data: rows, error: e2 } = await sb
    .from('location_iconic_spots')
    .select('id, spot_text, spot_kind')
    .eq('location_key', name)
    .eq('is_active', true)
    .order('id')
    .limit(1000);
  if (e2) throw new Error(e2.message);
  const imagined =
    (card.biome_config && card.biome_config.imagined === true) || IMAGINED_BIOMES.has(card.biome);
  const ctx = {
    label: card.display_name || name,
    imagined,
    romance: card.picker_tile === 'romance',
    subs: card.sub_regions || [],
    must: card.must_include || [],
  };
  const basis = imagined ? BASIS_IMAGINED : BASIS_REAL;
  const pool = rows.map((r) => ({
    id: r.id,
    text: r.spot_text,
    scale: r.spot_kind,
    orig: r.spot_text,
  }));
  const firstGroups = pool.length > 1 ? await judge(ctx.label, basis, pool) : [];
  const dupCount = firstGroups.reduce((a, g) => a + g.same.length, 0);
  const result = {
    card: name,
    pool: pool.length,
    groups: firstGroups.length,
    duplicates: dupCount,
    dupPct: pool.length ? Math.round((1000 * dupCount) / pool.length) / 10 : 0,
    firstGroups: firstGroups.map((g) => ({
      why: g.why,
      keep: rows[g.keep].spot_text,
      same: g.same.map((i) => rows[i].spot_text),
    })),
  };
  if (!AUDIT && dupCount) {
    // Rounds: rewrite every duplicate the judge names (original or earlier rewrite), re-judge, until a clean read.
    let groups = firstGroups;
    for (let round = 1; round <= ROUNDS && groups.length; round++) {
      const todo = groups.flatMap((g) => g.same);
      const got = await rewrite(
        ctx,
        pool,
        todo.map((i) => ({ slot: i + 1, scale: pool[i].scale, old: pool[i].text }))
      );
      for (const i of todo) {
        const t = got.get(i + 1);
        if (!t || t.split(/\s+/).length > 12) continue;
        if (
          pool.some(
            (o, j) => j !== i && (o.text.toLowerCase() === t.toLowerCase() || isSameIdea(o.text, t))
          )
        )
          continue;
        pool[i].text = t;
      }
      groups = await judge(ctx.label, basis, pool);
    }
    result.rewrites = pool
      .filter((p) => p.text !== p.orig)
      .map((p) => ({ id: p.id, scale: p.scale, old: p.orig, new: p.text }));
    result.remaining = groups.map((g) => ({
      why: g.why,
      members: [g.keep, ...g.same].map((i) => pool[i].text),
    }));
  }
  return result;
}

(async () => {
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
  const file = (name) => path.join(OUT, 'cards', name.replace(/[^a-z0-9]+/gi, '-') + '.json');
  const queue = CARDS.filter((n) => !(RESUME && fs.existsSync(file(n))));
  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const name = queue[next++];
      try {
        const r = await processCard(name);
        fs.writeFileSync(file(name), JSON.stringify(r, null, 1));
        console.log(
          `${name}: ${r.pool} spots · ${r.groups} groups · ${r.duplicates} duplicates (${r.dupPct}%)` +
            (r.rewrites ? ` · rewrote ${r.rewrites.length} · left ${r.remaining.length}` : '')
        );
      } catch (e) {
        console.warn(`${name}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const results = CARDS.filter((n) => fs.existsSync(file(n))).map((n) =>
    JSON.parse(fs.readFileSync(file(n), 'utf8'))
  );
  const tot = results.reduce((a, r) => ({ spots: a.spots + r.pool, dups: a.dups + r.duplicates }), {
    spots: 0,
    dups: 0,
  });
  fs.writeFileSync(
    path.join(OUT, 'summary.json'),
    JSON.stringify(
      {
        cards: results.length,
        ...tot,
        byCard: results
          .map((r) => ({ card: r.card, pool: r.pool, duplicates: r.duplicates, dupPct: r.dupPct }))
          .sort((a, b) => b.dupPct - a.dupPct),
      },
      null,
      1
    )
  );
  console.log(
    `\n${results.length} cards · ${tot.spots} spots · ${tot.dups} duplicates (${tot.spots ? ((100 * tot.dups) / tot.spots).toFixed(1) : 0}%)`
  );
  const changes = results.flatMap((r) => (r.rewrites || []).map((c) => ({ card: r.card, ...c })));
  if (SQL && changes.length) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const header = `-- ${path.basename(SQL, '.sql')}: same-idea dedupe of location spots (SEED_DIVERSITY_CHARTER.md §5b via scripts/dedupe-location-spots.js;\n-- Kevin 2026-09-30: "ensure actual uniqueness, and not a weak regex checker"). An LLM judged each card's whole pool for\n-- spots a render would show as the same picture; every duplicate after the first was REWRITTEN into a new idea at the\n-- same scale (eligibility unchanged), never deleted, and re-judged until a clean read (${ROUNDS} rounds max).\n-- ${changes.length} rewrites across ${new Set(changes.map((c) => c.card)).size} cards. Each update is guarded on the old text. Re-runnable.\n\n`;
    fs.writeFileSync(
      SQL,
      header +
        changes
          .map(
            (c) =>
              `UPDATE public.location_iconic_spots SET spot_text = ${q(c.new)} WHERE id = ${q(c.id)} AND spot_text = ${q(c.old)};`
          )
          .join('\n') +
        '\n'
    );
    console.log(`wrote ${SQL} (${changes.length} updates)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
