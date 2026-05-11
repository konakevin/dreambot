#!/usr/bin/env node
/**
 * Grading pass over an existing iconic-spots pool.
 *
 * For each location, sends all its pillars to Haiku and asks for an
 * S / A / B grade per pillar:
 *   S — banger, instantly recognizable, would make a clear postcard
 *   A — good, solid iconic landmark
 *   B — mediocre / generic / obscure / indoors-leaning / not visually distinct
 *
 * Updates location_iconic_spots:
 *   - quality_tier = 'S' | 'A' | 'B'
 *   - is_active = false for B-tier (runtime only picks active S+A)
 *
 * Usage:
 *   node scripts/grade-iconic-spots.js --location china     # one location
 *   node scripts/grade-iconic-spots.js --all                # all locations with pillars
 *   node scripts/grade-iconic-spots.js --location china --dry-run
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC || !KEY) {
  console.error('ANTHROPIC_API_KEY or SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const ALL = has('all');
const DRY = has('dry-run');
const ONLY = flag('location', null);
const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB_URL, KEY);

function gradePrompt(loc, pillars) {
  const numbered = pillars.map((p, i) => `${i + 1}. ${p.spot_text}`).join('\n');
  return `You are grading iconic-landmark pillar candidates for "${loc}" — an AI image generator uses these as scene anchors for POSTCARD-PHOTOABLE renders. The bar is HIGH. We want NO mundane pillars.

For EACH pillar below, decide: would a serious travel/architecture photographer DELIBERATELY SEEK THIS OUT to shoot for a postcard or coffee-table travel book?

S — POSTCARD BANGER. World-famous, instantly recognizable, fronts a travel-book cover. Example for Paris: "Eiffel Tower"; for NYC: "Brooklyn Bridge"; for Rome: "Colosseum"; for Hawaii: "Nā Pali Coast"; for China: "Great Wall at Mutianyu".

A — POSTCARD-WORTHY. A travel photographer would deliberately shoot this for a postcard / portfolio. Distinctive visual identity. Example for Paris: "Pont Alexandre III gilded statues"; for NYC: "Flatiron Building"; for Rome: "Trevi Fountain"; for China: "Yangshuo cormorant fishermen".

B — MUNDANE. Anything a travel photographer would NOT specifically seek for a postcard. Includes:
  - Generic squares, streets, parks WITHOUT a specific named distinctive feature
  - Government buildings (assemblies, courts, embassies, banks) — visually plain
  - Food halls, concert halls, libraries, museums where the OUTSIDE is unremarkable
  - Suburban districts, residential neighborhoods, residential canals
  - Zoos, aquariums, sports stadiums, sports complexes, racetracks
  - Cemeteries, prisons, hospitals (tonally off for travel posters)
  - Modern apartment complexes, condo towers without distinct architecture
  - Minor bridges that aren't visually striking
  - Generic waterfront promenades without a specific landmark anchor
  - Forest pathways, generic park lawns, generic riverbanks
  - "Marketplace" or "shopping street" without distinctive cultural color/architecture
  - "X memorial" or "Y monument" that's small-scale or somber

━━━ HARD RULES ━━━
- The litmus test: "Would a travel photographer DELIBERATELY seek this out for a postcard?" If no — B.
- Iconic, world-class, deliberately-photographed > merely "exists and has a name". Bar is HIGH.
- Outdoor architectural drama > indoor or interior-leaning entries. Indoor-leaning: B.
- A specific named feature is necessary but NOT sufficient. "Café-lined avenue" is mundane even with a name.
- Photogenic distinctive identity > completeness. We'd rather have 40 S+A bangers than 100 mixed.
- When in doubt: B. Lean strict.

━━━ OUTPUT FORMAT ━━━
Return EXACTLY ${pillars.length} lines, one per pillar, in INPUT ORDER. Each line is:
<number>. <S|A|B>

Examples:
1. S
2. A
3. B
4. A

No preamble, no explanation, no markdown. Just the numbered grades.

━━━ PILLARS TO GRADE ━━━
${numbered}`;
}

async function callHaiku(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Haiku ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

function parseGrades(text, expectedCount) {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(\d+)\.\s*([SAB])\b/i);
    if (m) {
      out.push({ idx: parseInt(m[1], 10) - 1, grade: m[2].toUpperCase() });
    }
  }
  return out;
}

async function gradeLocation(locKey) {
  const { data: pillars, error } = await sb
    .from('location_iconic_spots')
    .select('id, spot_text, quality_tier')
    .eq('location_key', locKey)
    .order('spot_text');
  if (error) {
    console.error(`  ${locKey} fetch error:`, error.message);
    return;
  }
  if (!pillars || pillars.length === 0) {
    console.log(`  ${locKey}: no pillars, skipping`);
    return;
  }

  console.log(`  Grading ${pillars.length} pillars for "${locKey}"...`);
  const t0 = Date.now();
  const text = await callHaiku(gradePrompt(locKey, pillars));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  const grades = parseGrades(text, pillars.length);
  if (grades.length !== pillars.length) {
    console.error(
      `  ${locKey} ⚠️ got ${grades.length}/${pillars.length} grades — Haiku output malformed`
    );
    console.error('  First 200 chars of Haiku response:', text.slice(0, 200));
    return;
  }

  // Tally
  const tally = { S: 0, A: 0, B: 0 };
  grades.forEach((g) => {
    tally[g.grade]++;
  });
  console.log(
    `  ${locKey}: ${tally.S} S, ${tally.A} A, ${tally.B} B (${elapsed}s)`
  );

  if (DRY) {
    console.log(`  Dry-run — sample B-tier:`);
    grades.filter((g) => g.grade === 'B').slice(0, 8).forEach((g) => {
      console.log(`    - ${pillars[g.idx].spot_text}`);
    });
    return;
  }

  // Bulk update — group by grade
  const sUpdate = grades.filter((g) => g.grade === 'S').map((g) => pillars[g.idx].id);
  const aUpdate = grades.filter((g) => g.grade === 'A').map((g) => pillars[g.idx].id);
  const bUpdate = grades.filter((g) => g.grade === 'B').map((g) => pillars[g.idx].id);

  if (sUpdate.length > 0) {
    await sb.from('location_iconic_spots').update({ quality_tier: 'S', is_active: true }).in('id', sUpdate);
  }
  if (aUpdate.length > 0) {
    await sb.from('location_iconic_spots').update({ quality_tier: 'A', is_active: true }).in('id', aUpdate);
  }
  if (bUpdate.length > 0) {
    await sb.from('location_iconic_spots').update({ quality_tier: 'B', is_active: false }).in('id', bUpdate);
  }
  console.log(`  ✓ Updated DB for "${locKey}"`);
}

(async () => {
  let locations = [];
  if (ONLY) {
    locations = [ONLY];
  } else if (ALL) {
    // Paginate location_iconic_spots in 1000-row chunks. The default supabase
    // limit silently caps at 1000 rows — without this loop we missed ~80% of
    // locations on the first attempt.
    const seen = new Set();
    let from = 0;
    const STEP = 1000;
    for (;;) {
      const { data, error } = await sb
        .from('location_iconic_spots')
        .select('location_key')
        .range(from, from + STEP - 1);
      if (error) {
        console.error('range query error:', error.message);
        break;
      }
      if (!data || data.length === 0) break;
      data.forEach((r) => seen.add(r.location_key));
      if (data.length < STEP) break;
      from += STEP;
    }
    locations = [...seen].sort();
  } else {
    console.log('Usage: --location <name> | --all  [--dry-run]');
    process.exit(1);
  }

  console.log(`Grading ${locations.length} location(s)${DRY ? ' (dry-run)' : ''}...`);
  for (const loc of locations) {
    await gradeLocation(loc);
  }
  console.log('Done.');
})();
