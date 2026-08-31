#!/usr/bin/env node
/**
 * Pure-scene anchor RE-AUDIT (2026-08-23) — recalibrate location_iconic_spots
 * .pure_scene_eligible against a STRICT "recognizable, beautiful postcard of THIS
 * specific location" bar.
 *
 * WHY: the original classify-pure-scene-eligible.js AUTO-MARKED every S-tier spot
 * `true` WITHOUT Sonnet judgment. That let ~2,658 tier-S rows through unjudged —
 * incl. ~893 generic unnamed "essence-card" nature scenes ("frozen puddle ice
 * pattern", "storm-lit sea panorama") that read as a random pretty photo ANYWHERE,
 * plus obscure micro-landmarks (Amsterdam "Oudemanhuispoort book-market arcade")
 * a traveler would never recognize as the place. The pure-scene picker samples
 * eligible spots UNIFORMLY, so ~1-in-4 pure-scene nightlies rolled an anchor that
 * didn't evoke the user's saved location (the sunnysteph investigation).
 *
 * WHAT: re-judge EVERY currently-eligible (pure_scene_eligible = true) active spot
 * from a live location, WITH the location name in context, and flip the failures
 * to pure_scene_eligible = false. Reversible flag flip, never a delete.
 *
 * Usage:
 *   node scripts/reaudit-pure-scene-spots.js --dry-run --sample   # validate on marquee locations, no writes
 *   node scripts/reaudit-pure-scene-spots.js --dry-run            # dry-run ALL live locations
 *   node scripts/reaudit-pure-scene-spots.js --write              # apply demotions to the DB
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
// --only "a,b,c" → restrict the re-audit to these locations (scoped polish of a
// backfilled subset). No flag → all live locations, unchanged.
const ONLY = (() => {
  const i = args.indexOf('--only');
  return i >= 0 && args[i + 1] ? args[i + 1].split(',').map((s) => s.trim()).filter(Boolean) : [];
})();
const APPLY_FROM = args.includes('--apply-from') ? args[args.indexOf('--apply-from') + 1] : null;
const DRY_RUN = !WRITE && !APPLY_FROM; // default safe: dry-run unless --write/--apply-from is explicit
const BATCH_SIZE = 50;
const POOL = 5;
// Per-location floor: never demote a location below this many eligible spots — an
// empty/thin pool makes the render fall back to an ANCHORLESS generic scene (worse
// than a mediocre anchor). If a location would drop below the floor, keep ALL its
// spots and flag it for manual review.
const FLOOR = 20;
const OUT_FILE = path.join(process.cwd(), 'pure-scene-audit-results.json');

// Marquee locations for the validation sample (mix of city + nature + island).
const SAMPLE_LOCATIONS = [
  'amsterdam',
  'paris',
  'tokyo',
  'santorini',
  'hawaii',
  'new york city',
  'rome',
  'swiss alps',
];

const sb = createClient(SB_URL, SB_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

function rubric(location) {
  return `You are curating dream-scene anchors for "${location}". Each anchor becomes a nightly "dream"
render with NO person in it — just a beautiful scene of the place. The goal: a user who saved "${location}"
as a dream destination gets a gorgeous scene that feels like ${location} and makes them happy.

Be GENEROUS — keep anything recognizable and beautiful; only cut the genuinely bad.

  yes (KEEP) if EITHER:
    (a) a recognizable named place in/around ${location} a traveler would enjoy as a beautiful scene —
        NOT just the #1 landmark. Charming neighborhoods, squares, bridges, canals, gardens, viewpoints,
        villages, coastlines, valleys, and lesser-known-but-lovely NAMED spots all COUNT (e.g. Paris:
        Montmartre streets, Île Saint-Louis quays, Versailles Orangerie, a Seine bridge — KEEP; Swiss Alps:
        a named valley/pass/peak/lake — KEEP; Santorini: a named village/lighthouse/caldera view — KEEP);
        OR
    (b) a beautiful natural/scenic view that clearly evokes ${location}'s character even if unnamed,
        ESPECIALLY for nature destinations (Hawaii/Alps/Maldives/Yosemite/Bora Bora/Big Sur): a turquoise
        sea arch, a lush waterfall cliff, a jagged snow peak, a tropical lagoon — KEEP for their places.

  no (DEMOTE) ONLY if clearly one of:
    • PLACELESS / GENERIC: a pretty but nameless nature/weather scene that could be almost ANYWHERE and
      does NOT evoke ${location} — the tell is a lowercase descriptive opener with no proper place name:
      "frozen puddle ice pattern", "wide storm-lit sea panorama", "foggy forest canopy", "close-up of a
      single blossom", "misty riverbank at dawn", "frost-silvered wild grass", "wide polder meadow". Reads
      as a random stock nature photo. (For a nature destination, demote these ONLY if they truly could be
      anywhere — a generic "wide meadow" is nowhere; a "turquoise volcanic sea arch" is Hawaii, KEEP.)
    • OBSCURE + DRAB: a niche micro-spot with no scenic draw a tourist would never seek out — a covered
      book-market arcade, a minor office/administrative building, a ferry terminal, a plain museum facade,
      a utilitarian structure.

When unsure, KEEP (yes). We only remove the clearly-placeless and the clearly-drab.

CRITICAL OUTPUT FORMAT: respond with ONLY a JSON array, nothing else — no preamble, no "I'll evaluate",
no explanation, no markdown fences. Exactly:
[{"i":1,"ok":true},{"i":2,"ok":false},...]`;
}

function extractJsonArray(text) {
  // Sonnet sometimes prepends prose ("I'll evaluate...") — pull the first [ ... ] block.
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
  // ── Apply mode: write the EXACT reviewed classifications, no re-classify ──
  if (APPLY_FROM) {
    const saved = JSON.parse(fsp.readFileSync(APPLY_FROM, 'utf8'));
    const ids = saved.demotions.map((d) => d.id);
    console.log(
      `Applying ${ids.length} demotions from ${APPLY_FROM} (audited ${saved.generatedAt}). ` +
        `${saved.flooredLocations?.length || 0} locations were floor-protected (kept whole).`,
    );
    // Snapshot the pre-write eligible state of exactly these IDs for 1:1 rollback.
    const snap = path.join(process.cwd(), 'pure-scene-audit-rollback.json');
    fsp.writeFileSync(snap, JSON.stringify({ restoredEligibleIds: ids, at: saved.generatedAt }, null, 2));
    await applyDemotions(ids);
    console.log(`Done. Demoted ${ids.length}. Rollback: set pure_scene_eligible=true for ids in ${snap}.`);
    return;
  }

  // Live locations (approved + surfaced in the picker)
  const { data: live } = await sb
    .from('location_cards')
    .select('name')
    .eq('is_approved', true)
    .not('picker_category', 'is', null)
    .range(0, 200);
  const liveSet = new Set(live.map((c) => c.name));

  // Every currently-eligible active spot (paginate past the 1000 cap)
  let all = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await sb
      .from('location_iconic_spots')
      .select('id, location_key, spot_text, quality_tier')
      .eq('is_active', true)
      .eq('pure_scene_eligible', true)
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
  }
  let spots = all.filter((s) => liveSet.has(s.location_key));
  if (SAMPLE) spots = spots.filter((s) => SAMPLE_LOCATIONS.includes(s.location_key));
  if (ONLY.length) spots = spots.filter((s) => ONLY.includes(s.location_key)); // scoped subset

  // Group by location so Sonnet judges with the place in context
  const byLoc = {};
  for (const s of spots) (byLoc[s.location_key] ||= []).push(s);
  const locations = Object.keys(byLoc).sort();
  console.log(
    `Re-auditing ${spots.length} eligible spots across ${locations.length} locations` +
      `${SAMPLE ? ' (SAMPLE)' : ''}${DRY_RUN ? ' — DRY RUN (no writes)' : ' — WRITING'}\n`,
  );

  const batches = [];
  for (const loc of locations) {
    const arr = byLoc[loc];
    for (let i = 0; i < arr.length; i += BATCH_SIZE) batches.push({ loc, spots: arr.slice(i, i + BATCH_SIZE) });
  }

  const demotions = [];
  let judged = 0;
  let kept = 0;
  for (let i = 0; i < batches.length; i += POOL) {
    const slice = batches.slice(i, i + POOL);
    const settled = await Promise.allSettled(slice.map((b) => classifyBatch(b.loc, b.spots)));
    settled.forEach((r, j) => {
      const b = slice[j];
      if (r.status === 'fulfilled') {
        for (const row of r.value) {
          judged++;
          if (row.ok) kept++;
          else demotions.push(row);
        }
      } else {
        console.error(`  ✗ ${b.loc} batch failed:`, r.reason.message);
      }
    });
    process.stdout.write(`  judged ${judged}/${spots.length}\r`);
  }
  // ── Starvation floor: cancel demotions for any location that would drop below FLOOR ──
  const demoteByLoc = {};
  for (const d of demotions) (demoteByLoc[d.location_key] ||= []).push(d);
  const flooredLocations = [];
  let finalDemotions = [];
  for (const loc of locations) {
    const total = byLoc[loc].length;
    const dem = demoteByLoc[loc] || [];
    if (total - dem.length < FLOOR) {
      flooredLocations.push({ location: loc, total, wouldDemote: dem.length });
      // keep ALL of this location's spots (cancel its demotions)
    } else {
      finalDemotions = finalDemotions.concat(dem);
    }
  }

  console.log(
    `\n\nJudged ${judged}: KEEP ${judged - finalDemotions.length}, ` +
      `DEMOTE ${finalDemotions.length} (${((100 * finalDemotions.length) / judged).toFixed(0)}%)` +
      `${flooredLocations.length ? ` — ${flooredLocations.length} loc(s) floor-protected` : ''}\n`,
  );

  // Full per-location table: demote / total → kept (flag floored + near-floor)
  console.log('  location                     demote/total   kept');
  for (const loc of locations) {
    const total = byLoc[loc].length;
    const floored = flooredLocations.find((f) => f.location === loc);
    const dem = floored ? 0 : (demoteByLoc[loc] || []).length;
    const keptN = total - dem;
    const flag = floored ? '  ⚠ FLOOR-PROTECTED (kept whole)' : keptN < FLOOR + 10 ? '  ← thin' : '';
    console.log(`  ${loc.padEnd(28)} ${String(dem).padStart(3)}/${String(total).padEnd(4)}     ${String(keptN).padStart(4)}${flag}`);
  }

  // Save the full result set so --write/--apply-from uses EXACTLY what was reviewed (no re-pay).
  fsp.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString().slice(0, 19),
        judged,
        demoteCount: finalDemotions.length,
        flooredLocations,
        demotions: finalDemotions.map((d) => ({ id: d.id, location_key: d.location_key, spot_text: d.spot_text })),
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
  console.log(`Done. Demoted ${finalDemotions.length}. (Reversible: set pure_scene_eligible=true to restore.)`);
})();
