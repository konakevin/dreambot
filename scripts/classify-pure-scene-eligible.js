#!/usr/bin/env node
/**
 * Phase 2 classifier — fills location_iconic_spots.pure_scene_eligible
 * with a Sonnet-judged "is this a postcard-worthy beautiful scene that
 * could anchor a pure_scene render (no human subject, just the
 * landscape/cityscape)?" boolean.
 *
 * Backfill strategy:
 *   • S-tier → true   (known postcard-grade — auto-marked without Sonnet)
 *   • B-tier → false  (known mundane "concrete ditch" type — auto-marked)
 *   • A-tier → Sonnet  (mixed bag — Sunset Boulevard yes, Petersen no)
 *
 * Only classifies rows belonging to LIVE locations (is_approved=true +
 * picker_category NOT NULL on location_cards). Skips the ~800 spots
 * tied to hidden / fantasy / banned cards.
 *
 * Idempotent — only touches rows whose pure_scene_eligible IS NULL.
 *
 * Cost: ~30 Sonnet calls × ~$0.0005 ≈ $0.02 (only A-tier needs Sonnet).
 * Wall time: ~60s.
 *
 * Usage:
 *   node scripts/classify-pure-scene-eligible.js [--reclassify] [--dry-run]
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
const BATCH_SIZE = 100;

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const RUBRIC = `You are a postcard curator. For each location anchor below, output exactly ONE of:

  yes  — this anchor is a BEAUTIFUL POSTCARD scene that could be the subject of a no-human render (pure landscape/cityscape). Would a tourist photograph this for Instagram or save it as a desktop wallpaper? Does the name evoke a stunning recognizable view? Examples: "Sunset Boulevard palm-lined stretch", "Hollywood Sign on Mount Lee", "Mulholland Drive scenic overlook ridges", "Eiffel Tower from Trocadéro", "Mount Fuji from Lake Kawaguchi", "Skógafoss waterfall with moss-covered cliffs".

  no   — this anchor is a real landmark but reads as a "random building" / niche / mundane scene WITHOUT a human in the frame. Specialists or locals might find it interesting; it's not what a tourist would photograph as their postcard memory of the location. Examples: "Petersen Automotive Museum red ribbon facade" (real museum but reads as just a red building), "Pink's Hot Dogs vintage stand" (kitschy stand), "Muscle Beach outdoor gym equipment" (gym equipment), "Anne Frank House exterior on Prinsengracht canal" (somber niche landmark), "Paramount Pictures studio gate arch" (random gate), "Amoeba Music building exterior" (a record store).

Critical: judge "is this BEAUTIFUL & RECOGNIZABLE without a person in the frame?" — NOT "is this a real landmark?". Many real landmarks are not postcard scenes when nobody's in them.

Output STRICTLY as a JSON array matching input order — no markdown fences, no commentary, JSON only:
[{"i":1,"ok":true},{"i":2,"ok":false},{"i":3,"ok":true},…]`;

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
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed) || parsed.length !== spots.length) {
    throw new Error(`Sonnet returned ${parsed?.length} classifications, expected ${spots.length}`);
  }
  return spots.map((s, i) => ({ id: s.id, ok: !!parsed[i].ok }));
}

(async () => {
  // Live locations
  const { data: live } = await sb
    .from('location_cards')
    .select('name')
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .range(0, 200);
  const liveSet = new Set(live.map((c) => c.name));
  console.log(`Live locations: ${liveSet.size}`);

  // Pull all active spots from live locations
  let all = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await sb
      .from('location_iconic_spots')
      .select('id, location_key, spot_text, quality_tier, pure_scene_eligible')
      .eq('is_active', true)
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
  }
  const liveSpots = all.filter((s) => liveSet.has(s.location_key));
  console.log(`Total active spots in live locations: ${liveSpots.length}`);

  // Auto-mark S + B (no Sonnet needed)
  const sTier = liveSpots.filter(
    (s) => s.quality_tier === 'S' && (RECLASSIFY || s.pure_scene_eligible !== true),
  );
  const bTier = liveSpots.filter(
    (s) => s.quality_tier === 'B' && (RECLASSIFY || s.pure_scene_eligible !== false),
  );
  const aTier = liveSpots.filter(
    (s) => s.quality_tier === 'A' && (RECLASSIFY || s.pure_scene_eligible === null),
  );
  console.log(
    `Auto-mark: S=${sTier.length} → true, B=${bTier.length} → false. Sonnet pass: A=${aTier.length}.`,
  );

  if (DRY_RUN) {
    console.log('(dry run — no DB writes)');
    return;
  }

  // Bulk update S and B
  console.log('\nApplying S-tier → true...');
  for (let i = 0; i < sTier.length; i += 200) {
    const slice = sTier.slice(i, i + 200);
    const ids = slice.map((s) => s.id);
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ pure_scene_eligible: true })
      .in('id', ids);
    if (error) console.error('  err:', error.message);
  }
  console.log('Applying B-tier → false...');
  for (let i = 0; i < bTier.length; i += 200) {
    const slice = bTier.slice(i, i + 200);
    const ids = slice.map((s) => s.id);
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ pure_scene_eligible: false })
      .in('id', ids);
    if (error) console.error('  err:', error.message);
  }

  if (aTier.length === 0) {
    console.log('\nNo A-tier rows to classify. Done.');
    return;
  }

  // Sonnet pass on A-tier
  const batches = [];
  for (let i = 0; i < aTier.length; i += BATCH_SIZE) {
    batches.push(aTier.slice(i, i + BATCH_SIZE));
  }
  console.log(`\nClassifying A-tier in ${batches.length} parallel Sonnet batches of up to ${BATCH_SIZE}...`);
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

  // Apply results
  let ok = 0;
  let no = 0;
  for (const r of results) {
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ pure_scene_eligible: r.ok })
      .eq('id', r.id);
    if (error) console.error('  upd err:', error.message);
    else (r.ok ? ok++ : no++);
  }
  console.log(`\nA-tier classified: ${ok} kept (eligible), ${no} dropped (not postcard).`);
  console.log('Done.');
})();
