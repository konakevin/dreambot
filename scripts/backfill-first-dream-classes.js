#!/usr/bin/env node
/**
 * Backfill location_cards.location_class and object_cards.object_class.
 *
 * Run AFTER migration 140_first_dream_engine_schema.sql is applied.
 * Mappings are hand-curated based on each card's iconic visual identity,
 * not just tag soup. Tropical islands → coastal (beach iconic). Castles
 * → architectural (structure iconic). And so on.
 *
 * Usage:
 *   node scripts/backfill-first-dream-classes.js              # dry run
 *   node scripts/backfill-first-dream-classes.js --execute    # write
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--execute');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || envFile.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

// ── Hand-curated location classifications ─────────────────────────────
// Iconic visual identity wins over tag overlap. Santorini is coastal
// because the cliffs + white buildings are sea-defined. NYC is urban
// because the skyline is the icon, not the harbor.

const LOCATION_CLASS = {
  // urban
  'ancient rome': 'urban',
  barcelona: 'urban',
  'cyberpunk megacity': 'urban',
  dubai: 'urban',
  'hong kong': 'urban',
  'las vegas': 'urban',
  london: 'urban',
  'los angeles': 'urban',
  miami: 'urban',
  'new york city': 'urban',
  'noir cityscape': 'urban',
  paris: 'urban',
  'paris cafe': 'urban',
  'parisian cafe': 'urban',
  'rio de janeiro': 'urban',
  rome: 'urban',
  'salt lake city': 'urban',
  'san francisco': 'urban',
  seoul: 'urban',
  tokyo: 'urban',
  venice: 'urban',
  'victorian london': 'urban',

  // coastal
  bali: 'coastal',
  'big sur cliffs': 'coastal',
  'bora bora tahiti': 'coastal',
  'caribbean island': 'coastal',
  'costa rica': 'coastal',
  'greek isles': 'coastal',
  hawaii: 'coastal',
  maldives: 'coastal',
  'norwegian fjords': 'coastal',
  'pirate ship': 'coastal',
  santorini: 'coastal',
  tahiti: 'coastal',

  // forest
  'amazon rainforest': 'forest',
  'ancient elven city': 'forest',
  'enchanted forest': 'forest',
  'redwood forest': 'forest',

  // mountain
  'arctic wilderness': 'mountain',
  'canadian rockies': 'mountain',
  'cozy mountain cabin': 'mountain',
  iceland: 'mountain',
  'machu picchu': 'mountain',
  'new zealand': 'mountain',
  patagonia: 'mountain',
  'swiss alps': 'mountain',
  yosemite: 'mountain',

  // desert
  'african safari': 'desert',
  'ancient egypt': 'desert',
  'arches national park': 'desert',
  'grand canyon': 'desert',
  'moab arches': 'desert',
  'moab utah': 'desert',
  petra: 'desert',
  'sahara desert': 'desert',
  'zion national park': 'desert',
  'zions national park': 'desert',

  // interior
  'fairy cottage': 'interior',
  'tuscan villa': 'interior',
  'wizard academy': 'interior',

  // architectural (sacred/monumental/castles/temples)
  'angkor wat': 'architectural',
  'cherry blossom temple': 'architectural',
  disneyland: 'architectural',
  'dragons keep': 'architectural',
  'dwarven fortress': 'architectural',
  'fairy tale kingdom': 'architectural',
  'gothic cathedral': 'architectural',
  'great wall of china': 'architectural',
  'haunted castle': 'architectural',
  'haunted cathedral': 'architectural',
  hogwarts: 'architectural',
  'princess garden castle': 'architectural',
  'roman colosseum': 'architectural',
  'rose garden palace': 'architectural',
  'rose palace': 'architectural',
  'taj mahal': 'architectural',
  transylvania: 'architectural',

  // garden
  'cherry blossoms': 'garden',
  'japanese garden': 'garden',

  // aquatic
  aquarium: 'aquatic',
  'mermaid lagoon': 'aquatic',
  'sea world': 'aquatic',
  'underwater city': 'aquatic',
  'underwater city atlantis': 'aquatic',

  // sky_cosmic
  'alien planet': 'sky_cosmic',
  'cloud kingdom': 'sky_cosmic',
  'crystal caverns': 'sky_cosmic',
  'floating sky islands': 'sky_cosmic',
  'mars colony': 'sky_cosmic',
  'space station': 'sky_cosmic',
};

// ── Hand-curated object classifications ───────────────────────────────
// Object class controls whether the object fits a given persona/cell.
// Companion = living creature. Magical = artifact-with-glow. Personal =
// keepsake/instrument/intimate item. Tech = device. Vehicle = transport.
// Natural = flora/element. Food = consumables.

const OBJECT_CLASS = {
  // companion (creatures)
  cat: 'companion',
  'butterfly swarm': 'companion',
  dragon: 'companion',
  fox: 'companion',
  horse: 'companion',
  owl: 'companion',
  phoenix: 'companion',
  wolf: 'companion',

  // vehicle
  bicycle: 'vehicle',
  helicopter: 'vehicle',
  'hot air balloon': 'vehicle',
  motorcycle: 'vehicle',
  'muscle car': 'vehicle',
  sailboat: 'vehicle',
  speedboat: 'vehicle',
  spaceship: 'vehicle',
  drone: 'vehicle',

  // magical (glow + ritual artifacts)
  'ancient book': 'magical',
  'crystal orb': 'magical',
  crystals: 'magical',
  'enchanted key': 'magical',
  'floating lanterns': 'magical',
  hourglass: 'magical',
  'magic mirror': 'magical',
  'portal gate': 'magical',
  'rune stone': 'magical',
  wand: 'magical',
  'crystal chandelier': 'magical',
  'energy blade': 'magical',
  lightsaber: 'magical',

  // tech
  camera: 'tech',
  compass: 'tech',
  'data tablet': 'tech',
  lantern: 'tech',
  robot: 'tech',
  telescope: 'tech',

  // natural (flora/elements)
  'bonsai tree': 'natural',
  campfire: 'natural',
  'giant flower': 'natural',
  'rose bouquet': 'natural',
  seashell: 'natural',
  'paper cranes': 'natural',
  balloons: 'natural',
  kite: 'natural',
  'glass terrarium': 'natural',

  // personal (keepsakes, intimate, instruments, accessories)
  backpack: 'personal',
  bookshelf: 'personal',
  'bow and arrow': 'personal',
  'candle lantern': 'personal',
  dagger: 'personal',
  drums: 'personal',
  guitar: 'personal',
  'jeweled hand fan': 'personal',
  'jewelry box': 'personal',
  katana: 'personal',
  'music box': 'personal',
  'music locket': 'personal',
  'ornate hand mirror': 'personal',
  'painting easel': 'personal',
  parasol: 'personal',
  'perfume bottle': 'personal',
  piano: 'personal',
  shield: 'personal',
  'silk fan': 'personal',
  skateboard: 'personal',
  'snow globe': 'personal',
  snowboard: 'personal',
  spear: 'personal',
  surfboard: 'personal',
  sword: 'personal',
  'tea set': 'personal',
  'teddy bear': 'personal',
  'treasure chest': 'personal',
  trident: 'personal',
  'vanity table': 'personal',
  violin: 'personal',
  'war hammer': 'personal',
};

async function main() {
  console.log('━━━ backfill-first-dream-classes ━━━');
  console.log(`  DRY_RUN: ${DRY_RUN}`);
  console.log('');

  // ── Locations ──
  const { data: locs, error: lErr } = await sb.from('location_cards').select('id,name');
  if (lErr) {
    console.error('Failed to fetch location_cards:', lErr.message);
    process.exit(1);
  }
  let unmapped = [];
  let mapped = 0;
  for (const r of locs) {
    const cls = LOCATION_CLASS[r.name.toLowerCase().trim()];
    if (!cls) {
      unmapped.push(r.name);
      continue;
    }
    if (!DRY_RUN) {
      const { error } = await sb.from('location_cards').update({ location_class: cls }).eq('id', r.id);
      if (error) console.error(`  ✗ ${r.name}: ${error.message}`);
    }
    mapped++;
  }
  console.log(`Locations: ${mapped}/${locs.length} mapped`);
  if (unmapped.length) {
    console.log('  UNMAPPED (need manual classification):');
    for (const n of unmapped) console.log('    ', n);
  }

  // ── Objects ──
  const { data: objs, error: oErr } = await sb.from('object_cards').select('id,name');
  if (oErr) {
    console.error('Failed to fetch object_cards:', oErr.message);
    process.exit(1);
  }
  unmapped = [];
  mapped = 0;
  for (const r of objs) {
    const cls = OBJECT_CLASS[r.name.toLowerCase().trim()];
    if (!cls) {
      unmapped.push(r.name);
      continue;
    }
    if (!DRY_RUN) {
      const { error } = await sb.from('object_cards').update({ object_class: cls }).eq('id', r.id);
      if (error) console.error(`  ✗ ${r.name}: ${error.message}`);
    }
    mapped++;
  }
  console.log(`Objects: ${mapped}/${objs.length} mapped`);
  if (unmapped.length) {
    console.log('  UNMAPPED (need manual classification):');
    for (const n of unmapped) console.log('    ', n);
  }

  if (DRY_RUN) console.log('\n(Re-run with --execute to actually write.)');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
