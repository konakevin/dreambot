#!/usr/bin/env node
/**
 * Backfill location_cards.biome (Phase 1 of NIGHTLY_DREAM_ARCHITECTURE.md).
 *
 * 93/105 location cards had biome=null → getBiomeConfig(null) defaulted them ALL
 * to tropical_coastal (beach atmosphere on deserts/arctic/cities/interiors). This
 * sets each card's biome from its tags using the SAME priority heuristic as
 * `_shared/biomeAxes.ts:resolveBiomeFromTags` (mirrored here — this is a one-off
 * Node tool and can't import the Deno module), plus explicit OVERRIDES for the
 * handful the heuristic gets wrong (iconic monuments → ancient_ruins, etc.).
 *
 * Dry-run by default (prints the proposed mapping grouped by biome). Pass --apply
 * to write. Only fills NULL biomes unless --all is passed.
 *
 *   node scripts/backfill-location-biomes.js            # dry-run
 *   node scripts/backfill-location-biomes.js --apply    # write null biomes
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = Object.fromEntries(
  fs
    .readFileSync(`${__dirname}/../.env.local`, 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

// Mirror of biomeAxes.ts normalizeTags + resolveBiomeFromTags. Keep in sync.
function normalize(tags) {
  const out = new Set();
  for (const raw of tags || []) {
    if (typeof raw !== 'string') continue;
    const t = raw.includes(':') ? raw.slice(raw.indexOf(':') + 1) : raw;
    const clean = t.trim().toLowerCase();
    if (clean) out.add(clean);
  }
  return out;
}
function resolveBiomeFromTags(tags) {
  const t = normalize(tags);
  const has = (x) => t.has(x);
  if (has('space') || has('cyberpunk')) return 'scifi_cosmic';
  if (has('underwater') || has('aquatic')) return 'aquatic_underwater';
  if (has('gothic')) return 'gothic_historic';
  if (has('fantasy') || has('surreal')) return 'fantasy_imagined';
  if (has('ruins') || has('ancient')) return 'ancient_ruins';
  if (has('interior') && !has('epic')) return 'interior_intimate';
  if (has('desert')) return 'desert_arid';
  if (has('mountain')) return 'alpine_mountain';
  if (has('snow')) return 'arctic_polar';
  if (has('tropical') && (has('forest') || has('jungle'))) return 'wetland_jungle';
  if (has('jungle')) return 'wetland_jungle';
  if (has('tropical') || has('coastal')) return 'tropical_coastal';
  if (has('forest')) return 'temperate_forest';
  if (has('urban')) return 'urban_city';
  if (has('savanna') || has('grassland')) return 'grassland_savanna';
  if (has('nature')) return 'temperate_forest';
  return null;
}

// Explicit overrides — locations the tag heuristic resolves wrong. Iconic
// monuments read best on the ancient_ruins biome (monument-as-hero subject)
// rather than their generic terrain; a few coastal/terrain edge cases too.
const OVERRIDES = {
  // Iconic monuments → monument-as-hero biome (not their generic terrain)
  'ancient egypt': 'ancient_ruins',
  petra: 'ancient_ruins',
  'angkor wat': 'ancient_ruins',
  'machu picchu': 'ancient_ruins',
  'ancient rome': 'ancient_ruins',
  rome: 'ancient_ruins',
  'roman colosseum': 'ancient_ruins',
  'great wall of china': 'ancient_ruins',
  'taj mahal': 'ancient_ruins',
  // Iconic CITIES whose coastal tag wrongly pulled them to tropical_coastal
  'new york city': 'urban_city',
  'san francisco': 'urban_city',
  barcelona: 'urban_city',
  dubai: 'urban_city',
  // Tropical islands/coasts whose mountain/underwater tag pulled them off-biome
  'bora bora tahiti': 'tropical_coastal',
  maldives: 'tropical_coastal',
  tahiti: 'tropical_coastal',
  'costa rica': 'wetland_jungle',
  'new zealand': 'alpine_mountain', // real dramatic landscape, not fantasy-glow
  'african safari': 'grassland_savanna',
  'tuscan villa': 'interior_intimate', // cozy villa, not alpine peaks
  // Cities with an `interior` tag the heuristic wrongly read as cozy-interiors —
  // they're outdoor cityscapes (the interior tag just means interior scenes exist).
  seoul: 'urban_city',
  venice: 'urban_city',
  // Empty-tag cards (would fall to neutral default otherwise)
  amsterdam: 'urban_city',
  australia: 'tropical_coastal', // beaches/reef read more dream-worthy than outback desert
  china: 'urban_city',
  india: 'urban_city',
  mexico: 'tropical_coastal',
  morocco: 'desert_arid',
  prague: 'gothic_historic',
  singapore: 'urban_city',
  thailand: 'tropical_coastal',
  turkey: 'urban_city',
  // Bespoke biomes (2026-05-29) — clusters that deserve a dedicated, well-fit
  // biome rather than being flattened into a generic class. See biomeAxes.ts.
  'grand canyon': 'red_rock_canyon',
  'zion national park': 'red_rock_canyon',
  'zions national park': 'red_rock_canyon',
  'moab arches': 'red_rock_canyon',
  'moab utah': 'red_rock_canyon',
  'arches national park': 'red_rock_canyon',
  iceland: 'volcanic_geothermal',
  yellowstone: 'volcanic_geothermal',
  'norwegian fjords': 'fjord_coastal',
  santorini: 'mediterranean_coastal',
  'greek isles': 'mediterranean_coastal',
  'big sur cliffs': 'temperate_coastal',
  'japanese garden': 'zen_garden',
  'rose garden palace': 'fantasy_imagined', // romantic/magical, not gothic-dark
  'rose palace': 'fantasy_imagined',
  paris: 'urban_city', // bright iconic Paris (gothic-Paris niche; paris cafe covers cozy)
};

(async () => {
  const apply = process.argv.includes('--apply');
  const all = process.argv.includes('--all');
  const { data: cards, error } = await sb
    .from('location_cards')
    .select('name,tags,biome')
    .order('name');
  if (error) throw error;

  const byBiome = {};
  const unmapped = [];
  const plan = [];
  for (const c of cards) {
    if (c.biome && !all) continue; // already set
    const heuristic = resolveBiomeFromTags(c.tags);
    const override = OVERRIDES[c.name];
    const biome = override || heuristic;
    if (!biome) {
      unmapped.push(c);
      continue;
    }
    (byBiome[biome] = byBiome[biome] || []).push(
      `${c.name}${override ? ' [override]' : ''}  (${JSON.stringify(c.tags)})`
    );
    plan.push({ name: c.name, biome });
  }

  console.log(`\n=== PROPOSED BIOME MAPPING (${plan.length} cards) ===`);
  for (const b of Object.keys(byBiome).sort()) {
    console.log(`\n${b} (${byBiome[b].length}):`);
    for (const line of byBiome[b].sort()) console.log('  ', line);
  }
  if (unmapped.length) {
    console.log(
      `\n⚠️  UNMAPPED (${unmapped.length}) — will stay null, runtime uses neutral default:`
    );
    for (const c of unmapped) console.log('  ', c.name, JSON.stringify(c.tags));
  }

  if (!apply) {
    console.log('\n(dry-run — pass --apply to write)');
    return;
  }
  let ok = 0;
  for (const p of plan) {
    const { error: uerr } = await sb
      .from('location_cards')
      .update({ biome: p.biome })
      .eq('name', p.name);
    if (uerr) console.error('FAILED', p.name, uerr.message);
    else ok++;
  }
  console.log(`\n✅ Applied biome to ${ok}/${plan.length} cards.`);
})();
