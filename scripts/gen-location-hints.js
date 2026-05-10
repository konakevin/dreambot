#!/usr/bin/env node
/**
 * Stage 1 of the per-location pillar pipeline.
 *
 * Asks Sonnet to enumerate, for a given location:
 *   - sub_regions: distinct geographic / thematic sub-areas to cover
 *   - must_include: feature categories the iconic pool must include
 *
 * Persists to location_cards.sub_regions + location_cards.must_include.
 * Stage 2 (gen-iconic-spots-50.js) reads these and weaves them into
 * the pillar-generation meta-prompt.
 *
 * Biome-aware — fantasy locations get fictional canon, sci-fi gets
 * world-building lore, real-world gets actual geography.
 *
 * Usage:
 *   node scripts/gen-location-hints.js --location hawaii
 *   node scripts/gen-location-hints.js --location hogwarts --dry-run
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
const LOCATION = flag('location', 'hawaii');
const DRY = has('dry-run');
const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB_URL, KEY);

function buildPrompt(loc, biome) {
  const isFantasy = biome === 'fantasy_imagined';
  const isScifi = biome === 'scifi_cosmic';

  const sourceHint = isFantasy
    ? 'This is a FICTIONAL location from canon (book / film / game / mythology). Sub-regions are named areas WITHIN that canon. Feature categories are the kinds of iconic things that appear in that fictional world.'
    : isScifi
      ? 'This is a FICTIONAL sci-fi location. Sub-regions are named areas of the world-building. Feature categories are the kinds of iconic structures, terrain, and phenomena that define this setting.'
      : 'This is a REAL Earth location. Sub-regions are actual geographic / cultural / thematic areas the location is divided into (e.g., islands, neighborhoods, coastlines, valleys). Feature categories are the kinds of named landmarks tourists travel to see.';

  return `For the location "${loc}" (biome: ${biome}), generate two arrays of pool-generation hints used by an AI image generator's iconic-spot pillar generator.

${sourceHint}

━━━ OUTPUT FORMAT (JSON) ━━━
Return ONLY a JSON object with these two keys, no preamble, no commentary:

{
  "sub_regions": [
    "<5–12 entries>"
  ],
  "must_include": [
    "<8–15 entries>"
  ]
}

━━━ sub_regions ━━━
- 8–18 distinct named sub-areas of "${loc}" that a comprehensive pool should spread coverage across
- For LARGE / COMPLEX locations (multi-island archipelagos, large countries, big cities), AT LEAST 12 sub-regions. Hawaii must split each major island into 3-5 distinct coastal/regional zones (e.g., Oahu split into North Shore, South Shore / Waikiki, East Side / Windward, West Side / Leeward, Interior). Iceland splits into Reykjavík, Golden Circle, South Coast, East Fjords, Westfjords, Highlands, Snæfellsnes, etc. Tokyo splits into 6+ districts.
- For SMALLER/SINGULAR locations (a city, a single fictional castle), 5-8 sub-regions is fine.
- Each entry should be ~3–10 words, naming a real (or canonical) sub-area, ideally with 2-3 example landmarks in parens to anchor it
- Do NOT collapse multi-region locations into too few zones — over-split is better than under-split

━━━ must_include — UNIVERSAL CORE CATEGORIES ━━━
Every comprehensive location pool MUST include these standard categories (skip only if genuinely inapplicable to the location):
- named beaches / shoreline (specific named ones)
- iconic surf / aquatic spots (where applicable)
- snorkel reefs / underwater / sea-life spots (where applicable)
- waterfalls / natural water features
- iconic mountains / volcanic / canyon / valley features
- cliffs and dramatic coasts (where applicable)
- sea features — blowholes / arches / sea stacks / lava tubes (where applicable)
- iconic hikes / trails
- lookouts / scenic viewpoints
- botanical gardens / curated nature spaces
- iconic named towns / villages / historic districts
- temples / shrines / sacred sites (where applicable)
- iconic landmarks (architectural or geographic, location-specific)

━━━ must_include — LOCATION-SPECIFIC ADDITIONS ━━━
Additionally include any categories that are SIGNATURE for "${loc}" specifically (e.g., for Iceland: glacial / ice features, geothermal sites, aurora-viewing spots; for Tokyo: neon districts, bridges/rivers, modern landmarks).

Total must_include: 10-15 categories. Each entry is a category name + 2-4 example landmarks in parens.

━━━ RULES ━━━
- Be SPECIFIC — name actual sub-areas / features, not generic ones
- Only entries that produce postcard-worthy outdoor scenes (no pure-interior categories)
- For fictional locations, draw from established canon
- Output ONLY the JSON object`;
}

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

(async () => {
  // Look up biome
  const { data: locCard } = await sb
    .from('location_cards')
    .select('biome, sub_regions, must_include')
    .eq('name', LOCATION)
    .maybeSingle();
  if (!locCard) {
    console.error(`Location "${LOCATION}" not found in location_cards`);
    process.exit(1);
  }
  const biome = locCard.biome ?? 'tropical_coastal';
  console.log(`Generating hints for "${LOCATION}" (biome: ${biome})${DRY ? ' (dry-run)' : ''}...`);

  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(LOCATION, biome));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`✓ Sonnet replied in ${elapsed}s`);

  // Parse JSON — strip code-fence if present
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('No JSON object found in response:');
    console.error(text);
    process.exit(1);
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse JSON:', e.message);
    console.error(jsonMatch[0]);
    process.exit(1);
  }
  const subRegions = Array.isArray(parsed.sub_regions) ? parsed.sub_regions : [];
  const mustInclude = Array.isArray(parsed.must_include) ? parsed.must_include : [];

  console.log(`\nsub_regions (${subRegions.length}):`);
  subRegions.forEach((r, i) => console.log(`  ${(i + 1).toString().padStart(2)}. ${r}`));
  console.log(`\nmust_include (${mustInclude.length}):`);
  mustInclude.forEach((r, i) => console.log(`  ${(i + 1).toString().padStart(2)}. ${r}`));

  if (DRY) {
    console.log('\nDry-run: not persisting to DB.');
    return;
  }
  const { error } = await sb
    .from('location_cards')
    .update({ sub_regions: subRegions, must_include: mustInclude })
    .eq('name', LOCATION);
  if (error) {
    console.error('\nDB update failed:', error.message);
    return;
  }
  console.log(`\n✓ Persisted hints for "${LOCATION}".`);
})();
