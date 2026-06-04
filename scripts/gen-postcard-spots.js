#!/usr/bin/env node
/**
 * Phase 3 generator — for each of the 48 live locations, ask Sonnet to
 * write 20 fresh "POSTCARD-grade" pure_scene anchors and insert them
 * into location_iconic_spots with pure_scene_eligible=true,
 * quality_tier='S' (Sonnet-curated, postcard by construction).
 *
 * Why on top of Phase 2 (which classifies the existing pool):
 *   • Existing pool is curated for "real recognizable landmark" — which
 *     skews toward niche/historical entries. Postcard pool needs to skew
 *     toward beautiful-scene-no-human-needed.
 *   • Augments rather than replaces — Phase 2 keeps the eligible
 *     subset of the existing pool; Phase 3 adds 20 hand-curated
 *     postcards on top per location.
 *
 * Each generated anchor:
 *   • Specific named POV (e.g. "Hollywood Sign from Lake Hollywood
 *     Park reservoir" not just "Hollywood Sign")
 *   • Reads INSTANTLY as the location to anyone who's been there
 *     or seen a postcard from there
 *   • Compositionally interesting from a single still frame
 *     (skyline, vista, landmark+context, color/light moment)
 *
 * Idempotent: re-runs only generate for locations that have < 20
 * Phase-3-tagged rows (notes = 'pure_scene_phase3'). Use --regenerate
 * to force-regenerate every location.
 *
 * Cost: ~48 Sonnet calls × ~$0.001 ≈ $0.05 total.
 * Wall time: ~3 min.
 *
 * Usage:
 *   node scripts/gen-postcard-spots.js [--limit-locations N] [--dry-run] [--regenerate]
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
const REGENERATE = args.includes('--regenerate');
const LIMIT_LOC = (() => {
  const i = args.indexOf('--limit-locations');
  return i >= 0 ? parseInt(args[i + 1], 10) : Infinity;
})();
const PER_LOCATION = 20;
const NOTE_TAG = 'pure_scene_phase3'; // stored in `notes` column for idempotency

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const RUBRIC = (location, existingSamples) => `You are a postcard curator for the location: "${location}".

Author EXACTLY ${PER_LOCATION} fresh pure_scene anchors — beautiful, recognizable, postcard-worthy POVs that could be the locked subject of a no-human image render. Each anchor will be combined later with rolled axes (time of day, weather, light, camera) so the SPECIFIC postcard moment varies; your job is to nail the SUBJECT.

Each anchor MUST:
  • Name a specific POV at the location (e.g. "Hollywood Sign from Lake Hollywood Park reservoir" not just "Hollywood Sign"; "Mount Fuji reflecting in Lake Kawaguchi" not just "Mount Fuji").
  • Read INSTANTLY as the location — anyone who has been there or seen postcards from there should recognize it.
  • Be visually compelling as a SINGLE STILL FRAME with NO HUMAN in it (the landscape/cityscape IS the subject). Skyline, vista, named landmark with its context, dramatic-color-light moment.
  • Mix scales: ~40% wide vistas (skylines, ranges, expanses), ~40% medium landmarks-with-context (single named structure framed against its setting), ~20% intimate close-detail (interior, under-canopy, garden, narrow alley with character).
  • Avoid: "X street", "X market" (too generic), "X with people" (no humans), generic beaches/forests without a named anchor.

CRITICAL — DO NOT duplicate any of these existing anchors already in the pool for ${location}:
${existingSamples.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

Output STRICTLY as a JSON array of exactly ${PER_LOCATION} strings. No markdown, no commentary, JSON only:
["anchor 1 text", "anchor 2 text", …]`;

function classifyScale(text) {
  // Mirror the wide/medium/intimate classifier rubric — quick regex inference
  // so we don't waste a second Sonnet pass on freshly-authored spots.
  const t = text.toLowerCase();
  if (/(expanse|range|panorama|skyline|fjord|plain|coast(?!al)|vista|ridge|valley|river system|delta|savanna|prairie|tundra|island chain|aerial|from above|from the air|across the bay|across the harbor|overlook)/i.test(t)) return 'wide';
  if (/(interior|cafe|café|tea\s?house|under(\s|-)canopy|garden parterre|alleyway|courtyard|grotto|tide pool|reading room|chapel|under the canopy|inside)/i.test(t)) return 'intimate';
  return 'medium';
}

async function generateOne(location) {
  // Sample 12 existing spots so Sonnet can avoid duplicates (full 50-200 list
  // would eat context — 12 covers the major ones).
  const { data: existing } = await sb
    .from('location_iconic_spots')
    .select('spot_text')
    .eq('location_key', location)
    .eq('is_active', true)
    .order('quality_tier', { ascending: true }) // S first
    .limit(12);
  const samples = (existing || []).map((r) => r.spot_text);

  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 2000,
    messages: [{ role: 'user', content: RUBRIC(location, samples) }],
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
    notes: NOTE_TAG,
  }));
}

(async () => {
  // Live locations
  const { data: live } = await sb
    .from('location_cards')
    .select('name')
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .order('name')
    .range(0, 200);
  const locs = live.map((c) => c.name).slice(0, LIMIT_LOC);
  console.log(`Live locations to seed: ${locs.length}`);

  // Which ones already have Phase 3 rows (idempotency)
  const skipSet = new Set();
  if (!REGENERATE) {
    const { data: existing } = await sb
      .from('location_iconic_spots')
      .select('location_key')
      .eq('notes', NOTE_TAG)
      .range(0, 5000);
    const counts = {};
    (existing || []).forEach((r) => (counts[r.location_key] = (counts[r.location_key] || 0) + 1));
    for (const [k, v] of Object.entries(counts)) {
      if (v >= PER_LOCATION) skipSet.add(k);
    }
    console.log(`Skipping ${skipSet.size} locations that already have ${PER_LOCATION}+ phase3 rows.`);
  }
  const todo = locs.filter((l) => !skipSet.has(l));
  console.log(`To generate: ${todo.length}\n`);

  if (DRY_RUN) {
    console.log('(dry run — exiting)');
    return;
  }

  // Run in parallel batches (avoid hammering Sonnet)
  const POOL = 4;
  let totalInserted = 0;
  for (let i = 0; i < todo.length; i += POOL) {
    const slice = todo.slice(i, i + POOL);
    const settled = await Promise.allSettled(slice.map((l) => generateOne(l)));
    for (let j = 0; j < settled.length; j++) {
      const r = settled[j];
      const loc = slice[j];
      if (r.status === 'rejected') {
        console.error(`  ✗ ${loc}: ${r.reason.message}`);
        continue;
      }
      const rows = r.value;
      const { error, data } = await sb.from('location_iconic_spots').insert(rows).select('id');
      if (error) {
        console.error(`  ✗ ${loc}: insert err: ${error.message}`);
      } else {
        totalInserted += data?.length || rows.length;
        console.log(`  ✓ ${loc} (+${rows.length})`);
      }
    }
  }
  console.log(`\nDONE: ${totalInserted} fresh postcard anchors inserted across ${todo.length} locations.`);
})();
