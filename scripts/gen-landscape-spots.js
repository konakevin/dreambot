#!/usr/bin/env node
/**
 * Phase 4 generator — for each of the 48 live locations, ask Sonnet to
 * write 50 GENERIC PRETTY-LANDSCAPE anchors that match the location's
 * biome. No specific landmark names; no human references. Inserts them
 * into location_iconic_spots with pure_scene_eligible=true,
 * quality_tier='S'.
 *
 * Phase 3 was named-landmark POSTCARDS (Hollywood Sign, Bradbury
 * Building, etc.). Phase 4 is generic biome-matched landscape beauty
 * (palm-lined sandy beach at golden hour, moss-covered lava field
 * stretching to volcanic peaks, alpine meadow with wildflowers).
 * Together they give pure_scene rolls a healthy mix of "famous
 * postcard moment" and "pretty pure landscape" without ever rolling
 * a "random building" or "concrete ditch" type anchor.
 *
 * Each generated anchor:
 *   • NO specific named landmarks. NO place names other than the
 *     biome's typical features.
 *   • NO humans / figures / actors.
 *   • Match the location's BIOME (Iceland → volcanic_geothermal,
 *     LA → tropical_coastal, etc.) so a Norwegian-fjord roll never
 *     produces a Caribbean palm scene.
 *   • Visually compelling as a single still with NO subject other
 *     than the landscape itself.
 *   • Mix of scales (~50% wide, ~30% medium, ~20% intimate).
 *
 * Idempotent: insert-time spot_text dedup against existing rows
 * (no tag column on the table — see gen-postcard-spots.js notes).
 *
 * Cost: ~48 Sonnet calls × ~$0.002 ≈ $0.10 total.
 * Wall time: ~5 min.
 *
 * Usage:
 *   node scripts/gen-landscape-spots.js [--limit-locations N] [--dry-run]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC_KEY || !SB_KEY) {
  console.error('Missing ANTHROPIC_API_KEY or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT_LOC = (() => {
  const i = args.indexOf('--limit-locations');
  return i >= 0 ? parseInt(args[i + 1], 10) : Infinity;
})();
const PER_LOCATION = 50;

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const RUBRIC = (location, biome, atmosphereSamples) => `You are a landscape photographer scouting GENERIC PRETTY-LANDSCAPE pure_scene anchors for: "${location}"

Biome class: ${biome || 'unknown'}
Atmosphere keywords from the location's profile:
${atmosphereSamples.map((s) => `  • ${s}`).join('\n')}

Author EXACTLY ${PER_LOCATION} pretty-landscape scene anchors for this location's biome.

HARD RULES — read carefully:
  1. NO specific named landmarks. NO place names other than the biome's typical natural features.
     BAD examples: "Hollywood Sign from Lake Hollywood Park", "Eiffel Tower at golden hour", "Mount Fuji"
     GOOD examples: "wildflower-strewn coastal bluff above crashing surf", "moss-covered lava field stretching to volcanic peaks"
  2. NO humans, people, figures, tourists, hikers. Animals OK only if biome-typical and small/distant (lone bird, distant grazing deer); never describe their action.
  3. NO buildings, streets, structures, vehicles, signs, lights, urban elements. Pure NATURE / PURE LANDSCAPE only.
     (Urban-biome locations still get nature-side scenes — for an "urban_city" biome, write about its parks, rivers, surrounding hills, coastline, harbor — never buildings.)
  4. Each anchor is a SCENE/MOOD/TYPE-OF-VIEW, not a place.
     GOOD: "alpine meadow with wildflowers and distant snow-capped peaks at dawn"
     BAD: "Yosemite Valley meadow"
  5. Match the biome — for ${biome || 'this location'}, only include features that are AUTHENTIC to this biome. NO Caribbean palms in Iceland; no glaciers in Hawaii; no Saharan dunes in Norway.
  6. Visually compelling as a single still frame with NO human subject. The landscape IS the subject.

SCALE MIX — aim for:
  ~50% WIDE      — vistas, expanses, ranges, panoramas (e.g. "ridge after ridge of misty pine peaks rolling to the horizon")
  ~30% MEDIUM    — defined view with depth (e.g. "single weather-beaten coastal pine on rocky promontory above sea fog")
  ~20% INTIMATE  — close-detail nature (e.g. "ancient bristlecone tap roots wrapped over weathered granite")

VARIATION DIMENSIONS to use (don't just repeat the same shape with different colors):
  • Time of day: golden hour, blue hour, dawn mist, midday, sunset, starlit, moonlit
  • Weather: clear, stormy, foggy, after-rain, snowfall, heat-haze, frost
  • Season: spring bloom, summer haze, autumn color, winter snow, monsoon
  • Composition: layered ridges, single-subject silhouette, reflective surface, tunnel-of-trees, leading-line shore
  • Tone: serene/calm, dramatic/stormy, ethereal/misty, vibrant/saturated, monochrome/desaturated

Output STRICTLY as JSON array of exactly ${PER_LOCATION} strings. No markdown, no commentary, JSON only:
["scene 1", "scene 2", …]`;

function classifyScale(text) {
  const t = text.toLowerCase();
  if (
    /(expanse|range|panorama|skyline|fjord|plain|coast(?!al)|vista|ridge|valley|river system|delta|savanna|prairie|tundra|island chain|aerial|from above|from the air|across the bay|across the harbor|overlook|to the horizon|stretching|sweeping|rolling|endless)/i.test(
      t,
    )
  )
    return 'wide';
  if (
    /(interior|cafe|café|tea\s?house|under(\s|-)canopy|garden parterre|alleyway|courtyard|grotto|tide pool|reading room|chapel|under the canopy|inside|close-up|macro|moss\s+covered|leaf litter|tap root|fern frond|texture)/i.test(
      t,
    )
  )
    return 'intimate';
  return 'medium';
}

async function generateOne(location, biome, atmosphereSamples) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4500,
    messages: [{ role: 'user', content: RUBRIC(location, biome, atmosphereSamples) }],
  });
  let text = resp.content[0].text.trim();
  text = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
  const arr = JSON.parse(text);
  if (!Array.isArray(arr) || arr.length !== PER_LOCATION) {
    throw new Error(`expected ${PER_LOCATION} entries, got ${arr?.length}`);
  }
  return arr.map((spot_text) => ({
    location_key: location,
    spot_text: String(spot_text).trim(),
    spot_kind: classifyScale(spot_text),
    quality_tier: 'S',
    is_active: true,
    pure_scene_eligible: true,
  }));
}

(async () => {
  // Live locations + biome
  const { data: live } = await sb
    .from('location_cards')
    .select('name, biome, atmosphere')
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .order('name')
    .range(0, 200);
  const locs = live.slice(0, LIMIT_LOC);
  console.log(`Live locations to seed: ${locs.length}`);

  if (DRY_RUN) {
    console.log('(dry run — exiting without Sonnet calls or DB writes)');
    return;
  }

  // Run in parallel batches (avoid hammering Sonnet)
  const POOL = 4;
  let totalInserted = 0;
  for (let i = 0; i < locs.length; i += POOL) {
    const slice = locs.slice(i, i + POOL);
    const settled = await Promise.allSettled(
      slice.map((l) => generateOne(l.name, l.biome, (l.atmosphere || []).slice(0, 4))),
    );
    for (let j = 0; j < settled.length; j++) {
      const r = settled[j];
      const loc = slice[j].name;
      if (r.status === 'rejected') {
        console.error(`  ✗ ${loc}: ${r.reason.message}`);
        continue;
      }
      const rows = r.value;
      // Dedup against existing pool
      const { data: existing } = await sb
        .from('location_iconic_spots')
        .select('spot_text')
        .eq('location_key', loc);
      const existingNorm = new Set(
        (existing || []).map((r) => String(r.spot_text).toLowerCase().trim()),
      );
      const fresh = rows.filter(
        (r) => !existingNorm.has(String(r.spot_text).toLowerCase().trim()),
      );
      if (fresh.length === 0) {
        console.log(`  • ${loc} (+0, all 50 were dupes)`);
        continue;
      }
      const { error, data } = await sb.from('location_iconic_spots').insert(fresh).select('id');
      if (error) {
        console.error(`  ✗ ${loc}: insert err: ${error.message}`);
      } else {
        totalInserted += data?.length || fresh.length;
        const dupes = rows.length - fresh.length;
        console.log(
          `  ✓ ${loc} (+${fresh.length}${dupes > 0 ? ` of ${PER_LOCATION}; ${dupes} dupes` : ''})`,
        );
      }
    }
  }
  console.log(
    `\nDONE: ${totalInserted} fresh landscape anchors inserted across ${locs.length} locations.`,
  );
})();
