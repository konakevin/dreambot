#!/usr/bin/env node
/**
 * Second-opinion pass on pure_scene_eligible=false entries that the
 * strict QA pass (scripts/qa-pure-scene-pool.js) over-aggressively
 * dropped. Restores entries that are LEGITIMATELY iconic / location-
 * coded but got mis-flagged as "random building" or "generic landscape".
 *
 * Calibration notes informing this rubric:
 *   • The strict pass treated "any building" as "random building",
 *     even when the building IS the landmark (Capitol Records,
 *     The Broad, Queen Mary, EYE Film Museum cantilevered exterior).
 *     Strict pure-landscape rules don't apply to urban locations.
 *   • The strict pass treated biome-coded landscapes as "generic"
 *     when the biome features are objectively distinctive — aurora
 *     over an Icelandic geothermal pool reads as "any aurora" to a
 *     critical eye, but it IS uniquely Iceland.
 *
 * RECOVER bar (softer than strict QA):
 *   • Iconic-architecture buildings = KEEP for their city (the
 *     building IS the landmark)
 *   • Biome-coded landscape with named regional flora/geology = KEEP
 *     (aurora + basalt + moss = Iceland regardless of camera framing)
 *   • Vague entries ("X views", "X area") = STILL DROP
 *   • Generic-anywhere scenes ("any park", "any beach", "any river") = STILL DROP
 *   • Borderline kitsch = STILL DROP
 *
 * Scope: only re-evaluates pure_scene_eligible=false entries from LIVE
 * locations that AREN'T quality_tier='B'. B-tier was the original
 * Phase 2 auto-drop of confirmed mundane / random-building entries
 * (Los Angeles River concrete channel, Muscle Beach gym, etc.) — we
 * trust those drops and don't re-evaluate.
 *
 * Cost: ~$0.80 for ~3,900 entries.
 *
 * Usage:
 *   node scripts/qa-recover-drops.js [--dry-run]
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

const RUBRIC = (location, biome) => `You are reconsidering a previously-DROPPED pure_scene anchor for: "${location}" (biome: ${biome || 'unknown'}).

A previous strict review flagged these for removal. Your job is to RECOVER any that were dropped too harshly — entries that are legitimately iconic or distinctly biome-coded.

For each anchor, output exactly ONE of:

  RECOVER — restore this anchor as eligible. Pass requires ANY of:
    1. ICONIC ARCHITECTURE for an URBAN location. If the entry names a famous building, monument, structure, or landmark of a city (Capitol Records, The Broad, Queen Mary, EYE Film Museum, Hotel de Ville, Place Vendôme column, Asahi Beer Hall, etc.), KEEP IT. The building IS the landmark for an urban location.
    2. BIOME-AUTHENTIC distinctive LANDSCAPE with regional features. If the entry uses named regional flora/geology/atmospheric features that pin it to ${location}'s biome (Icelandic basalt + aurora + geothermal pool; Hawaiian pahoehoe lava + hibiscus; SoCal chaparral + coast live oak + marine layer; Patagonian lenga beech + glacial flour), KEEP IT — even if the camera framing reads as "any pretty landscape".
    3. NAMED SPECIFIC NATURAL FEATURE. If the entry names a specific natural landmark (Geysir, Diamond Beach, Pongo de Manseriche, La Brea, Pololu Valley), KEEP IT even without a long descriptive clause.
    4. CULTURAL ICON. World-famous people-photographed spots that read as the location to anyone (Shibuya Crossing, etc.) — KEEP these.

  STAY_DROPPED — keep dropped. Reasons to leave dropped:
    • Vague / no specific anchor — "X views", "X area", "X viewpoint" plural, "X-style architecture" with no specific named structure
    • Generic-anywhere scene that doesn't use ${location}-biome-specific features ("any wooded hillside", "any river valley", "any park meadow")
    • Mundane / borderline kitsch
    • Random building with no specific name AND no compositional anchor

Critical: this is RECOVERY, not RE-JUDGMENT. The bar is lower than the strict pass. If the entry has a NAMED LANDMARK or BIOME-SPECIFIC FEATURE, lean RECOVER.

Output STRICTLY as JSON array matching input order — no markdown fences, no commentary, JSON only:
[{"i":1,"k":"RECOVER"},{"i":2,"k":"STAY_DROPPED"},…]`;

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
  return spots.map((s, i) => ({ id: s.id, recover: String(parsed[i].k).toUpperCase() === 'RECOVER' }));
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

  let totalEval = 0, totalRecover = 0, totalStay = 0;
  const perLocation = [];

  for (const loc of live) {
    let pageFrom = 0;
    const drops = [];
    for (;;) {
      const { data, error } = await sb
        .from('location_iconic_spots')
        .select('id, spot_text')
        .eq('location_key', loc.name)
        .eq('is_active', true)
        .eq('pure_scene_eligible', false)
        .neq('quality_tier', 'B') // trust the original B-tier auto-drops
        .range(pageFrom, pageFrom + 999);
      if (error) { console.error(`  fetch err ${loc.name}: ${error.message}`); break; }
      if (!data || data.length === 0) break;
      drops.push(...data);
      if (data.length < 1000) break;
      pageFrom += 1000;
    }
    if (drops.length === 0) {
      console.log(`  ${loc.name.padEnd(26)} no non-B drops to reconsider`);
      continue;
    }

    const batches = [];
    for (let i = 0; i < drops.length; i += BATCH_SIZE) {
      batches.push(drops.slice(i, i + BATCH_SIZE));
    }
    const results = [];
    let batchOk = 0, batchFail = 0;
    const settled = await Promise.allSettled(batches.map((b) => classifyBatch(loc.name, loc.biome, b)));
    settled.forEach((r) => {
      if (r.status === 'fulfilled') { results.push(...r.value); batchOk++; }
      else { batchFail++; console.error(`  batch err ${loc.name}: ${r.reason.message}`); }
    });
    const recoverCount = results.filter((r) => r.recover).length;
    const stayCount = results.length - recoverCount;
    totalEval += results.length;
    totalRecover += recoverCount;
    totalStay += stayCount;
    perLocation.push({ name: loc.name, evald: results.length, recover: recoverCount, stay: stayCount });

    if (!DRY_RUN) {
      const toRecover = results.filter((r) => r.recover);
      for (let i = 0; i < toRecover.length; i += 200) {
        const slice = toRecover.slice(i, i + 200);
        const ids = slice.map((s) => s.id);
        const { error } = await sb
          .from('location_iconic_spots')
          .update({ pure_scene_eligible: true })
          .in('id', ids);
        if (error) console.error(`  upd err ${loc.name}: ${error.message}`);
      }
    }
    const pct = Math.round((100 * recoverCount) / results.length);
    console.log(`  ${loc.name.padEnd(26)} eval=${String(results.length).padStart(3)} recover=${String(recoverCount).padStart(3)} stay=${String(stayCount).padStart(3)} (${pct}% recovered)${batchFail ? ' [' + batchFail + ' batch fails]' : ''}`);
  }

  console.log(`\n──────── SUMMARY ────────`);
  console.log(`Total non-B drops re-evaluated: ${totalEval}`);
  console.log(`Recovered: ${totalRecover} (${Math.round((100 * totalRecover) / totalEval)}%)`);
  console.log(`Stay dropped: ${totalStay} (${Math.round((100 * totalStay) / totalEval)}%)`);
})();
