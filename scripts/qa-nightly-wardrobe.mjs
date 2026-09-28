#!/usr/bin/env node
/**
 * qa-nightly-wardrobe.mjs — does nightly dress people for the place? (CREATE_OUTFIT_PLAN.md phase 9)
 *
 * Text only: POSTs `dry_run: true` to the real nightly-dreams engine (roll → Sonnet brief → assembled prompt,
 * no image, nothing persisted) on PLAIN locations grouped by setting, with the garment roll forced on, and
 * scene fit off / on / one fix alone. Scores the wardrobe clauses of the final prompt the same way the Create
 * harness does (scripts/qa-outfit-text.ts): an out-of-place word per setting, and our trim vocabulary.
 *
 * Usage:
 *   node scripts/qa-nightly-wardrobe.mjs --fit=off --n=2
 *   node scripts/qa-nightly-wardrobe.mjs --fit=on  --n=2      (on | looks | brief | off)
 *
 * Kevin's account, concurrency 3, headroom-gated per wave, daily budget cleared like dryrun-locations.mjs.
 * Dry runs still write Kevin's pool_pick_history (a nightly side effect), nothing else.
 */
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { waitForHeadroom } = require('./lib/poolHeadroom');

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const { createClient } = await import('@supabase/supabase-js');
const SB = 'https://jimftynwrinwenonjrlj.supabase.co';
const W = env.DREAM_QUEUE_WORKER_TOKEN || env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SB, env.SUPABASE_SERVICE_ROLE_KEY);
const U = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};
const FIT = arg('fit', 'off');
const N = Number(arg('n', '2'));
const OUT = arg('out', '');
const CONC = 3;
const fitBody =
  FIT === 'on' ? true : FIT === 'looks' || FIT === 'brief' ? FIT : FIT === 'off' ? false : null;

// Plain locations, grouped by the setting their biome maps to (sceneSetting.ts BIOME_SETTING).
const GROUPS = {
  beach: ['tropical_coastal', 'mediterranean_coastal', 'temperate_coastal', 'tropical_island'],
  city: ['urban_city'],
  evening: ['luxury'],
  indoor: ['interior_intimate'],
  outdoors: ['temperate_forest', 'desert_arid', 'red_rock_canyon', 'alpine_mountain'],
  snow: ['alpine_snow', 'arctic_polar'],
};
const PER_GROUP = 3;

// What reads out of place per setting (mirrors qa-outfit-text.ts MISFIT), and our trim words.
const MISFIT = {
  beach:
    /\b(tux(edo)?s?|gowns?|blazers?|suits?|wool|velvet|sequin\w*|cravats?|gloves|boots|brocade|corset\w*|trench|coats?|tweed|berets?|platforms?|turtlenecks?)\b/i,
  outdoors:
    /\b(gowns?|sequin\w*|velvet|cravats?|tux(edo)?s?|brocade|corset\w*|heels?|stilettos?|platforms?|berets?)\b/i,
  indoor: /\b(gowns?|sequin\w*|cravats?|tux(edo)?s?|tailcoats?|corset\w*|brocade|capes?|berets?)\b/i,
  city: /\b(gowns?|cravats?|tailcoats?|corset\w*|brocade|capes?|sequin\w*)\b/i,
  evening: /\b(shorts|sneakers|trainers|hiking|swimsuits?|bikinis?|board shorts)\b/i,
  snow: /\b(sandals|shorts|sundress\w*|bikinis?|heels?)\b/i,
};
const TRIM =
  /\b(trim(s|med)?|piping|piped|cuffs?|cuffed|contrast(ing)?|panels?|edging|edged|binding|ribbon)\b/i;

/** The wardrobe clause(s) of an assembled nightly prompt: "wearing X;" / "wearing X," up to the next clause. */
function wardrobes(prompt) {
  const out = [];
  const re = /wearing ([^;]+?)(?:;|\. |, set at|, standing|, seated|, walking|$)/gi;
  let m;
  while ((m = re.exec(prompt))) out.push(m[1]);
  return out;
}

async function clearBudget() {
  await sb
    .from('ai_generation_budget')
    .delete()
    .eq('user_id', U)
    .eq('date', new Date().toISOString().slice(0, 10));
}

async function dryRun(place, role) {
  const body = {
    user_id: U,
    force_place: place,
    force_cast_role: role,
    force_plain_location: true,
    force_garment_roll: true,
    ...(fitBody !== null ? { force_outfit_scene_fit: fitBody } : {}),
    dry_run: true,
  };
  const res = await fetch(`${SB}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${W}` },
    body: JSON.stringify(body),
  });
  const d = await res.json().catch(() => ({}));
  if (res.status !== 200 || !d.dry_run) return { error: `HTTP${res.status}` };
  return { prompt: d.finalPrompt || '', fb: d.fallbackReasons || [] };
}

const { data: cards } = await sb
  .from('location_cards')
  .select('name,biome,biome_config')
  .eq('is_approved', true)
  .not('picker_category', 'is', null)
  .in('biome', Object.values(GROUPS).flat());
const tasks = [];
for (const [setting, biomes] of Object.entries(GROUPS)) {
  const pool = (cards || []).filter(
    (c) => biomes.includes(c.biome) && !(c.biome_config && c.biome_config.imagined === true)
  );
  const picked = pool.sort(() => Math.random() - 0.5).slice(0, PER_GROUP);
  for (const c of picked)
    for (let r = 0; r < N; r++)
      tasks.push({ setting, place: c.name, role: r % 2 === 0 ? 'dual' : 'self' });
}
console.log(`nightly wardrobe QA: fit=${FIT}, ${tasks.length} dry runs\n`);

await clearBudget();
const results = [];
let done = 0;
const queue = [...tasks];
// Waves of CONC*3, each gated on DB connection headroom (CLAUDE.md hard rule), at most CONC in flight.
while (queue.length) {
  await waitForHeadroom({ min: 25, label: 'qa-nightly-wardrobe' });
  const wave = queue.splice(0, CONC * 3);
  let i = 0;
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < wave.length) {
        const t = wave[i++];
        if (done % 30 === 0) await clearBudget();
        const r = await dryRun(t.place, t.role);
        results.push({ ...t, ...r });
        done++;
      }
    })
  );
  process.stderr.write(`  ...${done}/${tasks.length}\n`);
}

const by = {};
for (const r of results) {
  const row = (by[r.setting] = by[r.setting] || {
    people: 0,
    misfit: 0,
    trim: 0,
    words: [],
    errors: 0,
    looks: [],
  });
  if (r.error) {
    row.errors++;
    continue;
  }
  for (const w of wardrobes(r.prompt)) {
    row.people++;
    const m = MISFIT[r.setting] ? w.match(MISFIT[r.setting]) : null;
    if (m) {
      row.misfit++;
      row.words.push(m[0].toLowerCase());
    }
    if (TRIM.test(w)) row.trim++;
  }
  for (const f of r.fb) if (f.startsWith('garment_roll:')) row.looks.push(f.split(':').pop());
}
let P = 0,
  M = 0,
  T = 0;
for (const [k, v] of Object.entries(by)) {
  P += v.people;
  M += v.misfit;
  T += v.trim;
  console.log(
    `  ${k.padEnd(9)} people ${String(v.people).padStart(3)}  misfit ${v.misfit}/${v.people}  trim ${v.trim}/${v.people}  errors ${v.errors}  looks [${v.looks.join(',')}]  ${v.words.length ? 'misfit words [' + v.words.join(', ') + ']' : ''}`
  );
}
console.log(
  `  ALL       people ${P}  misfit ${M}/${P} (${P ? Math.round((100 * M) / P) : 0}%)  trim ${T}/${P} (${P ? Math.round((100 * T) / P) : 0}%)`
);
if (OUT) fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
