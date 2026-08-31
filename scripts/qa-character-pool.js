#!/usr/bin/env node
/**
 * Character pool QA — sets location_iconic_spots.character_eligible
 * for the engine's cast paths (character + epic_tiny).
 *
 * Runs in two passes:
 *
 *   PASS 1 — auto-flag (no Sonnet):
 *     • Phase 4 pure-landscape entries → character_eligible=false
 *       (identified by created today + quality_tier='S' + first
 *       char lowercase; those entries were authored explicitly
 *       "no humans, no figures" and fight cast injection).
 *     • Everything else → character_eligible=true as a starting
 *       baseline.
 *
 *   PASS 2 — Sonnet QA (cast-appropriate rubric):
 *     • Reconsider every entry still flagged true (~5,850 entries
 *       in live locations).
 *     • Rubric is MORE PERMISSIVE than pure_scene:
 *       - Named landmarks, streets, plazas, markets, building
 *         exteriors, scenes with built environment → KEEP
 *       - Dramatic landscapes that can host a figure → KEEP
 *       - Truly vague ("X views" plural), mundane-with-no-rescue
 *         (gym equipment, parking lot), biome confusion → DROP
 *     • Flips losers to character_eligible=false.
 *
 * Cost: PASS 1 free; PASS 2 ~$1.50 for ~5,850 entries.
 * Wall time: ~3 min total.
 *
 * Usage:
 *   node scripts/qa-character-pool.js [--dry-run] [--pass1-only]
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
const PASS1_ONLY = args.includes('--pass1-only');
// --only "a,b,c" → SCOPED mode: skip pass 1 entirely (its Phase-4 lowercase+cutoff
// heuristic misfires on freshly-generated spots) and run ONLY the Sonnet KEEP/DROP
// pass on the listed locations. Used to polish a backfilled subset without re-QAing
// (or damaging) the whole DB. No flag → unchanged global behavior.
const ONLY = (() => {
  const i = args.indexOf('--only');
  return i >= 0 && args[i + 1] ? args[i + 1].split(',').map((s) => s.trim()).filter(Boolean) : [];
})();
const BATCH_SIZE = 100;
const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const PHASE4_CUTOFF = '2026-06-04T01:00:00Z'; // anything created after Phase 3 finished today
// First-char-lowercase detection: Phase 4 wrote descriptive prose like
// "moss-covered fallen giant…" (lowercase start). Phase 3 wrote named
// POVs like "Stahl House Case Study 22…" (Capital start). Reliable
// separator without a tagging column.

const RUBRIC = (location, biome) => `You are reviewing cast-path BACKDROPS for: "${location}" (biome: ${biome || 'unknown'}).

Each anchor will be the BACKDROP of an AI image render where a face-swapped person is the foreground subject. Your job is to judge whether the backdrop is COHERENT for a person-in-frame composition.

The bar is permissive — a person in the frame carries the scene. Mundane backdrops that would fail standalone often work fine with a cast subject (a person at Muscle Beach gym equipment is a fine candid; the gym alone isn't a postcard).

For each anchor, output exactly ONE of:

  KEEP — coherent as a cast backdrop. Pass requires ANY of:
    1. NAMED LANDMARK — building, monument, plaza, market, street, bridge, etc. Person fits naturally.
    2. URBAN SCENE — streets, alleys, squares, waterfronts, harbors, transit stations. Person blends.
    3. INTERIOR / COURTYARD / ARCADE — enclosed or semi-enclosed space that hosts a figure naturally.
    4. CULTURAL / SOCIAL SETTING — markets, gardens, parks, viewing platforms, beaches with named context.
    5. DRAMATIC LANDSCAPE that supports a figure standing/walking in it — coast, ridge, valley, lookout. (Pure-landscape-with-no-anchor scenes fail this — see DROP below.)

  DROP — NOT a coherent cast backdrop. Reasons to drop:
    • PURE-LANDSCAPE entries with no compositional anchor — phrases like "endless rolling X to the horizon" / "vast Y stretching to Z" with no foreground a person could stand at. These were authored without a figure in mind and fight cast injection.
    • VAGUE entries — "X views" plural, "X area" with no named feature, "X-style architecture" with no specific anchor.
    • CONCRETE DITCH class — "X concrete channel", random pier pilings, parking lot, dumpster — bad even with a person.
    • BIOME CONFUSION — wrong-region features.
    • TOO POETIC / OVERSTUFFED — "the sky weeping silver tears across the shimmering basin of forgotten memory" — too dense to render coherently.

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
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed) || parsed.length !== spots.length) {
    throw new Error(`expected ${spots.length} verdicts, got ${parsed?.length}`);
  }
  return spots.map((s, i) => ({ id: s.id, keep: String(parsed[i].k).toUpperCase() === 'KEEP' }));
}

async function pass1() {
  console.log('=== PASS 1: auto-flag Phase 4 + default-true ===');
  // Phase 4 lowercase entries (created after Phase 3 finished today) → false
  const { data: phase4 } = await sb
    .from('location_iconic_spots')
    .select('id, spot_text')
    .eq('quality_tier', 'S')
    .gte('created_at', PHASE4_CUTOFF)
    .range(0, 9999);
  const phase4Ids = (phase4 || [])
    .filter((r) => r.spot_text.length > 0 && r.spot_text[0] === r.spot_text[0].toLowerCase())
    .map((r) => r.id);
  console.log(`  Phase 4 lowercase entries identified: ${phase4Ids.length}`);

  if (!DRY_RUN && phase4Ids.length > 0) {
    for (let i = 0; i < phase4Ids.length; i += 200) {
      const slice = phase4Ids.slice(i, i + 200);
      const { error } = await sb
        .from('location_iconic_spots')
        .update({ character_eligible: false })
        .in('id', slice);
      if (error) console.error('  upd err:', error.message);
    }
  }

  // Everything else with NULL → true
  if (!DRY_RUN) {
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ character_eligible: true })
      .is('character_eligible', null);
    if (error) console.error('  default-true err:', error.message);
  }
  console.log('  Pass 1 done.');
}

async function pass2() {
  console.log('\n=== PASS 2: Sonnet character QA on remaining true entries ===');
  let liveQ = sb
    .from('location_cards')
    .select('name, biome')
    .eq('is_approved', true)
    .not('picker_category', 'is', null);
  if (ONLY.length) liveQ = liveQ.in('name', ONLY); // scoped subset
  const { data: live } = await liveQ.order('name').range(0, 200);

  let totalEval = 0, totalKeep = 0, totalDrop = 0;
  for (const loc of live) {
    let pageFrom = 0;
    const spots = [];
    for (;;) {
      const { data } = await sb
        .from('location_iconic_spots')
        .select('id, spot_text')
        .eq('location_key', loc.name)
        .eq('is_active', true)
        .eq('character_eligible', true)
        .range(pageFrom, pageFrom + 999);
      if (!data || data.length === 0) break;
      spots.push(...data);
      if (data.length < 1000) break;
      pageFrom += 1000;
    }
    if (spots.length === 0) continue;

    const batches = [];
    for (let i = 0; i < spots.length; i += BATCH_SIZE) batches.push(spots.slice(i, i + BATCH_SIZE));
    const results = [];
    let batchFail = 0;
    const settled = await Promise.allSettled(batches.map((b) => classifyBatch(loc.name, loc.biome, b)));
    settled.forEach((r) => {
      if (r.status === 'fulfilled') results.push(...r.value);
      else { batchFail++; console.error(`  batch err ${loc.name}: ${r.reason.message}`); }
    });
    const keep = results.filter((r) => r.keep).length;
    const drop = results.length - keep;
    totalEval += results.length;
    totalKeep += keep;
    totalDrop += drop;

    if (!DRY_RUN) {
      const toDrop = results.filter((r) => !r.keep);
      for (let i = 0; i < toDrop.length; i += 200) {
        const slice = toDrop.slice(i, i + 200);
        const ids = slice.map((s) => s.id);
        const { error } = await sb
          .from('location_iconic_spots')
          .update({ character_eligible: false })
          .in('id', ids);
        if (error) console.error(`  upd err ${loc.name}: ${error.message}`);
      }
    }
    const pct = Math.round((100 * keep) / results.length);
    console.log(`  ${loc.name.padEnd(26)} eval=${String(results.length).padStart(3)} keep=${String(keep).padStart(3)} drop=${String(drop).padStart(3)} (${pct}% kept)${batchFail ? ' [' + batchFail + ' batch fail]' : ''}`);
  }
  console.log(`\nPass 2 summary: evaluated=${totalEval} keep=${totalKeep} (${Math.round(100*totalKeep/totalEval)}%) drop=${totalDrop}`);
}

(async () => {
  if (ONLY.length) {
    // Scoped polish: pass 2 (Sonnet KEEP/DROP) only, on the listed cards. Skip pass 1
    // — its Phase-4 heuristic would wrongly flag fresh backfilled spots.
    console.log(`=== SCOPED to ${ONLY.length} card(s): pass 2 only ===`);
    await pass2();
    return;
  }
  await pass1();
  if (PASS1_ONLY) return;
  await pass2();
})();
