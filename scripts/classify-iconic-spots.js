#!/usr/bin/env node
/**
 * Classify each location_iconic_spots row's composition scale via Sonnet.
 *
 * Writes 'wide' | 'medium' | 'intimate' to the existing `spot_kind` column
 * (every row currently holds the placeholder `"vista"` from earlier
 * scaffolding). Engine uses the value to choose framing language in the
 * nightly pure_scene brief — see nightly-dreams/index.ts.
 *
 * Only classifies spots belonging to currently-LIVE location_cards
 * (is_approved=true + picker_category NOT NULL). Skips the 822 spots
 * tied to hidden / fantasy / banned cards.
 *
 * Idempotent — re-running only classifies rows still holding "vista" or
 * NULL. Pass --reclassify to force-re-roll already-classified rows.
 *
 * Cost: ~50 Sonnet calls × ~$0.0005 ≈ $0.03 total. Wall time: ~60s.
 *
 * Usage:
 *   node scripts/classify-iconic-spots.js [--reclassify] [--dry-run] [--batch N]
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
const RECLASSIFY = args.includes('--reclassify');
const DRY_RUN = args.includes('--dry-run');
const BATCH_ARG = args.find((_, i, a) => a[i - 1] === '--batch');
const BATCH_SIZE = BATCH_ARG ? parseInt(BATCH_ARG, 10) : 100;

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const RUBRIC = `You are a cinematography classifier. For each location anchor below, output exactly ONE of:

  wide     — vast vistas, mountain ranges, expanses, panoramas, fjords, salt flats, plains, savannas, valleys, glaciers, oceans, skylines, canyon overlooks. The scene extends far in all directions; the landscape itself IS the subject.

  medium   — single named landmarks (buildings, bridges, monuments, temples, cathedrals, towers, plazas, market squares). The structure or named feature IS the subject, framed with its immediate setting. Includes single beaches with horizon, single waterfalls with their basin, single cliffs.

  intimate — interiors, cafes, doorways, tea houses, small gardens, tide pools, courtyards, balconies, market stalls, close architectural details, alleyways, single-room views. Close framing; the human-scale view.

Edge cases:
  • Single named building/structure seen at distance across open landscape (e.g. "Mount Fuji from Lake Kawaguchi", "Eiffel Tower from Trocadéro plaza") → WIDE.
  • Building's facade / exterior straight-on → MEDIUM.
  • Interior or close architectural detail → INTIMATE.
  • "X with Y" where Y is a vast natural feature (e.g. "Skógafoss waterfall with moss-covered cliffs") → MEDIUM (single named waterfall is the subject).
  • Pure expanse, range, district-wide nightscape, salt flat etc. → WIDE.

Output STRICTLY as a JSON array matching input order — no markdown fences, no commentary, JSON only:
[{"i":1,"scale":"wide"},{"i":2,"scale":"medium"},{"i":3,"scale":"intimate"},…]`;

async function classifyBatch(spots) {
  const numbered = spots.map((s, i) => `${i + 1}. ${s.spot_text}`).join('\n');
  const userMsg = `${RUBRIC}\n\nSpots:\n${numbered}`;
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: userMsg }],
  });
  let text = resp.content[0].text.trim();
  text = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error('Sonnet non-JSON response (first 500 chars):\n', text.slice(0, 500));
    throw err;
  }
  if (!Array.isArray(parsed)) throw new Error('Sonnet returned non-array');
  if (parsed.length !== spots.length) {
    throw new Error(`Sonnet returned ${parsed.length} classifications, expected ${spots.length}`);
  }
  // Map back to spot ids
  const results = [];
  for (let i = 0; i < spots.length; i++) {
    const c = parsed[i];
    const scale = String(c.scale || '').toLowerCase().trim();
    if (!['wide', 'medium', 'intimate'].includes(scale)) {
      throw new Error(`Bad scale "${c.scale}" for spot index ${i}: "${spots[i].spot_text}"`);
    }
    results.push({ id: spots[i].id, scale });
  }
  return results;
}

(async () => {
  // 1) Get the 48 live location names
  const { data: live } = await sb
    .from('location_cards')
    .select('name')
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .range(0, 200);
  const liveSet = new Set(live.map((c) => c.name));
  console.log(`Live locations: ${liveSet.size}`);

  // 2) Pull all spots for live locations, paginated
  let all = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await sb
      .from('location_iconic_spots')
      .select('id, location_key, spot_text, spot_kind')
      .eq('is_active', true)
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
  }
  const liveSpots = all.filter((s) => liveSet.has(s.location_key));
  console.log(`Total active spots in live locations: ${liveSpots.length}`);

  // 3) Filter to spots that need classification
  const NEEDS = ['vista', null, undefined, ''];
  const todo = RECLASSIFY
    ? liveSpots
    : liveSpots.filter((s) => NEEDS.includes(s.spot_kind));
  console.log(`To classify this run: ${todo.length} (${liveSpots.length - todo.length} already done)`);
  if (DRY_RUN) {
    console.log('(dry run — exiting without Sonnet calls or DB writes)');
    return;
  }
  if (todo.length === 0) return;

  // 4) Batch + classify
  const batches = [];
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    batches.push(todo.slice(i, i + BATCH_SIZE));
  }
  console.log(`Running ${batches.length} parallel Sonnet batches of up to ${BATCH_SIZE}...`);

  // Run batches with bounded parallelism (5 at a time)
  const POOL = 5;
  const results = [];
  for (let i = 0; i < batches.length; i += POOL) {
    const slice = batches.slice(i, i + POOL);
    const settled = await Promise.allSettled(slice.map((b) => classifyBatch(b)));
    settled.forEach((r, j) => {
      if (r.status === 'fulfilled') {
        results.push(...r.value);
        console.log(`  ✓ batch ${i + j + 1}/${batches.length} (+${r.value.length})`);
      } else {
        console.error(`  ✗ batch ${i + j + 1}/${batches.length} failed:`, r.reason.message);
      }
    });
  }
  console.log(`Total classifications received: ${results.length}`);

  // 5) Update DB in chunks (Supabase doesn't expose a clean bulk-by-id UPDATE
  //    so we run individual updates — ~5,000 round-trips is fine over a
  //    persistent client connection in this script (one-shot use).
  let ok = 0;
  let bad = 0;
  for (const r of results) {
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ spot_kind: r.scale })
      .eq('id', r.id);
    if (error) {
      bad++;
      console.error('update err id=' + r.id.slice(0, 8) + ':', error.message);
    } else {
      ok++;
    }
  }
  console.log(`DB updates: ${ok} ok / ${bad} failed`);

  // 6) Final distribution
  const dist = { wide: 0, medium: 0, intimate: 0 };
  results.forEach((r) => (dist[r.scale] = (dist[r.scale] || 0) + 1));
  console.log('Scale distribution:', dist);
})();
