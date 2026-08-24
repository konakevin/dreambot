#!/usr/bin/env node
/**
 * URBAN pure-scene anchor RE-AUDIT (2026-08-24) — a stricter, city-specific pass
 * on top of Part I (reaudit-pure-scene-spots.js).
 *
 * WHY: Part I demoted placeless/generic + obscure-drab anchors but KEPT any
 * "recognizable named landmark". In CITY pools that let a flood of minor
 * building/church/museum FACADES survive — Amsterdam's pure-scene pool was ~half
 * static architecture (Scheepvaarthuis office building, minor kerks, Munttoren,
 * Waag, NEMO, EYE) vs the canal/bridge/skyline views people actually dream of.
 * The uniform picker then rolls "a random ornate building" ~1-in-N city nights
 * (surfaced 2026-08-24: an Amsterdam winter scene rendered the Scheepvaarthuis,
 * which reads as a church nobody recognizes).
 *
 * WHAT: re-judge every currently-eligible active spot for URBAN-biome locations
 * (urban_city + gothic_historic) with a rubric that KEEPS atmospheric cityscape
 * views + globally-iconic landmarks and DEMOTES minor single-building facades.
 * Reversible flag flip (pure_scene_eligible=false), never a delete. Floor-guarded.
 *
 * Usage:
 *   node scripts/reaudit-urban-scene-spots.js --dry-run --sample   # marquee cities, no writes
 *   node scripts/reaudit-urban-scene-spots.js --dry-run            # all urban locations, no writes
 *   node scripts/reaudit-urban-scene-spots.js --write              # apply
 *   node scripts/reaudit-urban-scene-spots.js --apply-from urban-scene-audit-results.json
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

const path = require('path');
const fsp = require('fs');
const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const SAMPLE = args.includes('--sample');
const APPLY_FROM = args.includes('--apply-from') ? args[args.indexOf('--apply-from') + 1] : null;
const DRY_RUN = !WRITE && !APPLY_FROM;
const BATCH_SIZE = 50;
const POOL = 5;
const FLOOR = 20; // never drop a location below this many eligible spots (anchorless-fallback guard)
const URBAN_BIOMES = ['urban_city', 'gothic_historic'];
const OUT_FILE = path.join(process.cwd(), 'urban-scene-audit-results.json');
const SAMPLE_LOCATIONS = ['amsterdam', 'paris', 'venice', 'london', 'tokyo'];

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

function rubric(location) {
  return `You are refining dream-scene anchors for the city/region "${location}". Each anchor becomes a
nightly render with NO person in it — just a scene of the place. Your ONLY job: cut the anchors that render
as "a random, anonymous building" nobody recognizes, while KEEPING everything a traveler would actually
enjoy seeing.

Cut ONLY anonymous modern/office/utilitarian buildings and drab minor structures. When unsure, KEEP.

  ALWAYS KEEP (these are NEVER "anonymous buildings", no exceptions):
    • any GARDEN, park, cemetery-with-cherry-trees, or green space
    • any CANAL, bridge, waterfront, harbor, river, quay, or water view
    • any SKYLINE, rooftop panorama, plaza/square, characterful street, market lane, or view over the city
    • any TEMPLE, shrine, cathedral, historic church, mosque, palace, palazzo, castle, or fort
    • any famous museum with notable architecture, historic tower, or monument a traveler would recognize
    (KEEP examples: Panthéon, Opéra Garnier, Sainte-Chapelle, Versailles gardens, Tower of London, British
    Museum, Natural History Museum, Hampton Court, Ca' d'Oro & other Grand Canal palazzos, San Giorgio
    Maggiore, Sensō-ji, Kanda Myōjin, Tsukiji Honganji, Nihonbashi Bridge, Tokyo Station, Kiyosumi Gardens.)

  no (DEMOTE) — ONLY a building that is anonymous to a traveler, one of:
    • a modern OFFICE / COMMERCIAL / CORPORATE building or glass/steel skyscraper with no landmark status
      (e.g. "The Gherkin glass bullet", "Shiodome Caretta glass canyon", a generic bank or HQ tower)
    • an OBSCURE office / commercial / guild / exchange / shipping / insurance / administrative building —
      EVEN IF ornate or historic — one that housed business rather than being a monument or place of worship,
      and that a traveler would not recognize or seek out (e.g. "Scheepvaarthuis shipping-company building
      corner tower"). (A famous palace, cathedral, temple, or museum is NOT this — keep those.)
    • a plain or generic MODERN MUSEUM BOX — a nondescript glass/concrete/brick cube (e.g. NEMO Science
      Museum green box, EYE Film Museum white wedge, a plain featureless museum facade)
    • a UTILITARIAN structure: a station concourse/terminal/mall/airport interior, a parking structure, a
      plain functional overpass
    • the bare INTERIOR of a minor building

If it is a garden, water view, street, skyline, temple/shrine/church/palace, or a named historic landmark —
KEEP it, even if modest. Only cut anonymous modern/office/utilitarian architecture. When unsure, KEEP.

CRITICAL OUTPUT FORMAT: respond with ONLY a JSON array, nothing else — no preamble, no explanation, no
markdown fences. Exactly:
[{"i":1,"ok":true},{"i":2,"ok":false},...]`;
}

function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) throw new Error('no JSON array in response');
  return JSON.parse(text.slice(start, end + 1));
}

async function classifyBatch(location, spots, attempt = 1) {
  const numbered = spots.map((s, i) => `${i + 1}. ${s.spot_text}`).join('\n');
  const userMsg = `${rubric(location)}\n\nAnchors for ${location}:\n${numbered}`;
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: userMsg }],
  });
  try {
    const parsed = extractJsonArray(resp.content[0].text.trim());
    if (!Array.isArray(parsed) || parsed.length !== spots.length) {
      throw new Error(`got ${parsed?.length}, expected ${spots.length}`);
    }
    return spots.map((s, i) => ({ ...s, ok: !!parsed[i].ok }));
  } catch (e) {
    if (attempt < 2) return classifyBatch(location, spots, attempt + 1);
    throw new Error(`${location}: ${e.message}`);
  }
}

async function applyDemotions(ids) {
  for (let i = 0; i < ids.length; i += 200) {
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ pure_scene_eligible: false })
      .in('id', ids.slice(i, i + 200));
    if (error) console.error('  upd err:', error.message);
  }
}

(async () => {
  if (APPLY_FROM) {
    const saved = JSON.parse(fsp.readFileSync(APPLY_FROM, 'utf8'));
    const ids = saved.demotions.map((d) => d.id);
    console.log(
      `Applying ${ids.length} urban demotions from ${APPLY_FROM} (audited ${saved.generatedAt}). ` +
        `${saved.flooredLocations?.length || 0} locations floor-protected.`,
    );
    const snap = path.join(process.cwd(), 'urban-scene-audit-rollback.json');
    fsp.writeFileSync(snap, JSON.stringify({ restoredEligibleIds: ids, at: saved.generatedAt }, null, 2));
    await applyDemotions(ids);
    console.log(`Done. Demoted ${ids.length}. Rollback: set pure_scene_eligible=true for ids in ${snap}.`);
    return;
  }

  // Urban-biome locations that are live in the picker
  const { data: cards } = await sb
    .from('location_cards')
    .select('name, biome')
    .in('biome', URBAN_BIOMES)
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .range(0, 500);
  let urbanSet = new Set(cards.map((c) => c.name));
  if (SAMPLE) urbanSet = new Set([...urbanSet].filter((n) => SAMPLE_LOCATIONS.includes(n)));

  // Every currently-eligible active spot in those locations (paginate past 1000)
  let all = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await sb
      .from('location_iconic_spots')
      .select('id, location_key, spot_text, quality_tier, spot_kind')
      .eq('is_active', true)
      .eq('pure_scene_eligible', true)
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
  }
  const spots = all.filter((s) => urbanSet.has(s.location_key));

  const byLoc = {};
  for (const s of spots) (byLoc[s.location_key] ||= []).push(s);
  const locations = Object.keys(byLoc).sort();
  console.log(
    `Urban re-audit: ${spots.length} eligible spots across ${locations.length} locations` +
      `${SAMPLE ? ' (SAMPLE)' : ''}${DRY_RUN ? ' — DRY RUN (no writes)' : ' — WRITING'}\n`,
  );

  const batches = [];
  for (const loc of locations) {
    const arr = byLoc[loc];
    for (let i = 0; i < arr.length; i += BATCH_SIZE)
      batches.push({ loc, spots: arr.slice(i, i + BATCH_SIZE) });
  }

  const demotions = [];
  let judged = 0;
  for (let i = 0; i < batches.length; i += POOL) {
    const slice = batches.slice(i, i + POOL);
    const settled = await Promise.allSettled(slice.map((b) => classifyBatch(b.loc, b.spots)));
    settled.forEach((r, j) => {
      const b = slice[j];
      if (r.status === 'fulfilled') {
        for (const row of r.value) {
          judged++;
          if (!row.ok) demotions.push(row);
        }
      } else {
        console.error(`  ✗ ${b.loc} batch failed:`, r.reason.message);
      }
    });
    process.stdout.write(`  judged ${judged}/${spots.length}\r`);
  }

  // Starvation floor
  const demoteByLoc = {};
  for (const d of demotions) (demoteByLoc[d.location_key] ||= []).push(d);
  const flooredLocations = [];
  let finalDemotions = [];
  for (const loc of locations) {
    const total = byLoc[loc].length;
    const dem = demoteByLoc[loc] || [];
    if (total - dem.length < FLOOR) flooredLocations.push({ location: loc, total, wouldDemote: dem.length });
    else finalDemotions = finalDemotions.concat(dem);
  }

  console.log(
    `\n\nJudged ${judged}: KEEP ${judged - finalDemotions.length}, ` +
      `DEMOTE ${finalDemotions.length} (${((100 * finalDemotions.length) / judged).toFixed(0)}%)` +
      `${flooredLocations.length ? ` — ${flooredLocations.length} loc(s) floor-protected` : ''}\n`,
  );
  console.log('  location                     demote/total   kept');
  for (const loc of locations) {
    const total = byLoc[loc].length;
    const floored = flooredLocations.find((f) => f.location === loc);
    const dem = floored ? 0 : (demoteByLoc[loc] || []).length;
    const keptN = total - dem;
    const flag = floored ? '  ⚠ FLOOR-PROTECTED (kept whole)' : keptN < FLOOR + 10 ? '  ← thin' : '';
    console.log(
      `  ${loc.padEnd(28)} ${String(dem).padStart(3)}/${String(total).padEnd(4)}     ${String(keptN).padStart(4)}${flag}`,
    );
  }

  fsp.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString().slice(0, 19),
        judged,
        demoteCount: finalDemotions.length,
        flooredLocations,
        demotions: finalDemotions.map((d) => ({
          id: d.id,
          location_key: d.location_key,
          spot_text: d.spot_text,
        })),
      },
      null,
      2,
    ),
  );
  console.log(`\nSaved results → ${OUT_FILE}  (apply with: --apply-from ${path.basename(OUT_FILE)})`);

  if (DRY_RUN) {
    console.log('(dry run — no DB writes.)');
    return;
  }
  console.log('\nApplying demotions (pure_scene_eligible = false)...');
  await applyDemotions(finalDemotions.map((d) => d.id));
  console.log(`Done. Demoted ${finalDemotions.length}. (Reversible: set pure_scene_eligible=true.)`);
})();
