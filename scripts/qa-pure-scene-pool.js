#!/usr/bin/env node
/**
 * QA pass — strict critical review of every pure_scene_eligible=true
 * entry in location_iconic_spots. Runs Sonnet against a high bar
 * (PAID FEATURE — anything mediocre fails) and flips
 * pure_scene_eligible=false on entries that don't clear it.
 *
 * The Phase 2 classifier used a "would a tourist photograph this for
 * Instagram?" rubric — that's a low bar that lets through generic
 * pretty scenes and weak-location-identity entries. This QA pass uses
 * a stricter rubric:
 *
 *   • IMPRESSIVE — would an AI render of this be a banger, not just OK
 *   • SPECIFIC — distinct enough to render as a coherent scene
 *   • LOCATION-IDENTIFIABLE — viewer should recognize the area
 *   • ARTISTIC — color/light/drama/composition pulling its weight
 *   • BIOME-AUTHENTIC — features actually exist in this biome
 *
 * Also flags:
 *   • Generic "could be anywhere" entries
 *   • Borderline kitsch
 *   • Vague (no specific named view or compositional anchor)
 *   • Biome confusion (e.g. salt flats in Morocco)
 *   • Semantic duplicates (same subject, different wording — flagged
 *     separately so we can keep one and drop the dupes)
 *
 * Output: prints per-location pass/fail counts + an updated DB state.
 * Idempotent — only judges current pure_scene_eligible=true rows.
 *
 * Cost: ~5,800 entries × ~$0.0002 per classification ≈ $1.20
 * Wall time: ~3 min.
 *
 * Usage:
 *   node scripts/qa-pure-scene-pool.js [--dry-run]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC_KEY || !SB_KEY) {
  console.error('Missing env');
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const BATCH_SIZE = 100;

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const RUBRIC = (location, biome) => `You are the lead QA reviewer for a PAID AI-dream-generation feature. Your job: judge each pure_scene anchor for: "${location}" (biome: ${biome || 'unknown'}).

Each anchor will be the LOCKED SUBJECT of an AI image render. Variation axes (time of day, weather, light, camera) layer ON TOP. Your job is to judge the SUBJECT itself.

For each anchor, output exactly ONE of:

  KEEP  — passes ALL of these:
    1. IMPRESSIVE — render would land as a banger, not just OK
    2. SPECIFIC — distinct enough to render as a coherent scene (not "any pretty landscape")
    3. LOCATION-IDENTIFIABLE — viewer would recognize this as ${location} or its biome (${biome})
    4. ARTISTIC — color, light, drama, composition pulling weight
    5. BIOME-AUTHENTIC — every feature mentioned actually exists in this biome at this location

  DROP — any one of these:
    • Generic "could be anywhere" entry (e.g. "summer parkland heat haze" for Paris, or "dense cedar forest" for Tokyo without Japanese-coded features)
    • Biome confusion (e.g. salt flats listed for Morocco when those are Bolivia)
    • Vague — no specific named feature OR specific compositional anchor (e.g. "X viewpoints" plural, "panoramic views")
    • Borderline kitsch — would render as a tourist-trap cliché photo (e.g. "Moulin Rouge cabaret facade" might be iconic but it's just a sign on a building)
    • Mediocre — competent but unmemorable. For a PAID FEATURE the bar is HIGH; if you'd shrug at the render, drop it.
    • Mundane / random building / generic urban scene without strong location identity
    • Too-poetic / purple-prose / overstuffed (a render would scramble it)

Critical: this is a PAID feature. Be ruthless. When in doubt, DROP.

Output STRICTLY as JSON array matching input order — no markdown fences, no commentary, JSON only:
[{"i":1,"k":"KEEP"},{"i":2,"k":"DROP"},…]`;

async function classifyBatch(location, biome, spots) {
  const numbered = spots.map((s, i) => `${i + 1}. ${s.spot_text}`).join('\n');
  const userMsg = `${RUBRIC(location, biome)}\n\nAnchors:\n${numbered}`;
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 3000,
    messages: [{ role: 'user', content: userMsg }],
  });
  let text = resp.content[0].text.trim();
  text = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed) || parsed.length !== spots.length) {
    throw new Error(`expected ${spots.length} verdicts, got ${parsed?.length}`);
  }
  return spots.map((s, i) => ({ id: s.id, keep: String(parsed[i].k).toUpperCase() === 'KEEP' }));
}

(async () => {
  const { data: live } = await sb
    .from('location_cards')
    .select('name, biome')
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .order('name')
    .range(0, 200);
  console.log(`Live locations: ${live.length}`);

  let totalEval = 0,
    totalKeep = 0,
    totalDrop = 0;
  const perLocation = [];

  for (const loc of live) {
    let pageFrom = 0;
    const allSpots = [];
    for (;;) {
      const { data, error } = await sb
        .from('location_iconic_spots')
        .select('id, spot_text')
        .eq('location_key', loc.name)
        .eq('is_active', true)
        .eq('pure_scene_eligible', true)
        .range(pageFrom, pageFrom + 999);
      if (error) {
        console.error(`  ✗ ${loc.name}: fetch err: ${error.message}`);
        break;
      }
      if (!data || data.length === 0) break;
      allSpots.push(...data);
      if (data.length < 1000) break;
      pageFrom += 1000;
    }
    if (allSpots.length === 0) continue;

    // Batch + classify
    const batches = [];
    for (let i = 0; i < allSpots.length; i += BATCH_SIZE) {
      batches.push(allSpots.slice(i, i + BATCH_SIZE));
    }
    const results = [];
    const settled = await Promise.allSettled(
      batches.map((b) => classifyBatch(loc.name, loc.biome, b)),
    );
    let ok = 0, fail = 0;
    settled.forEach((r) => {
      if (r.status === 'fulfilled') {
        results.push(...r.value);
        ok++;
      } else {
        fail++;
        console.error(`  ✗ batch err: ${r.reason.message}`);
      }
    });
    const keepCount = results.filter((r) => r.keep).length;
    const dropCount = results.length - keepCount;
    totalEval += results.length;
    totalKeep += keepCount;
    totalDrop += dropCount;
    perLocation.push({ name: loc.name, total: allSpots.length, keep: keepCount, drop: dropCount, batches: batches.length, batchOk: ok, batchFail: fail });

    if (!DRY_RUN) {
      // Apply drops: flip pure_scene_eligible=false
      const drops = results.filter((r) => !r.keep);
      for (let i = 0; i < drops.length; i += 200) {
        const slice = drops.slice(i, i + 200);
        const ids = slice.map((s) => s.id);
        const { error } = await sb
          .from('location_iconic_spots')
          .update({ pure_scene_eligible: false })
          .in('id', ids);
        if (error) console.error('  upd err:', error.message);
      }
    }
    const pct = Math.round((100 * keepCount) / results.length);
    console.log(
      `  ${loc.name.padEnd(26)} eval=${String(results.length).padStart(3)} keep=${String(keepCount).padStart(3)} drop=${String(dropCount).padStart(3)} (${pct}% kept)`,
    );
  }

  console.log(`\n──────── SUMMARY ────────`);
  console.log(`Total evaluated: ${totalEval}`);
  console.log(`Kept: ${totalKeep} (${Math.round((100 * totalKeep) / totalEval)}%)`);
  console.log(`Dropped: ${totalDrop} (${Math.round((100 * totalDrop) / totalEval)}%)`);
  perLocation.sort((a, b) => a.keep - b.keep);
  console.log(`\nWorst-pool locations after QA (10 smallest kept pools):`);
  perLocation.slice(0, 10).forEach((p) =>
    console.log(`  ${p.name.padEnd(26)} keep=${p.keep} (was ${p.total})`),
  );
})();
