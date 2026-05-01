#!/usr/bin/env node
/**
 * remap-legacy-mediums.js — UPDATE uploads.dream_medium for legacy keys
 * that have been normalized in migration 137.
 *
 * Two classes of remap:
 *
 * 1. Model-prefix variants (flux1-*, flux1-dev-*, flux1-pro-*, flux2-dev-*,
 *    flux2-pro-*, sdxl-*, batch-*) → strip the prefix to the modern key.
 *    These are pure noise from a previous era when the model name was part
 *    of the medium key. ~600 rows.
 *
 * 2. Direct synonyms / typos / kebab→snake renames:
 *    - oil_painting → canvas
 *    - photograph → photography
 *    - cinematic → render
 *    - real-astro → photography
 *    - gothic-realistic → gothic_realistic
 *    - gothic-whimsy → gothic_whimsy
 *    - vampire-portrait → vampire_portrait
 *    - gothic-painted → gothic_painted
 *    - gothic-architecture → gothic_architecture
 *    - gothic-oil-garden → gothic_oil_garden
 *    - ancient-epic → ancient_epic
 *    - star-oil-cosmos → star_oil_cosmos
 *    - maritime-oil-classic → maritime_oil_classic
 *    - maritime-oil-legend → maritime_oil_legend
 *    - maritime-oil-romantic → maritime_oil_romantic
 *    - bloom-conservatory → bloom_conservatory
 *    - bloom-steampunk-flora → bloom_steampunk_flora
 *    - gi-joe-figures → gi_joe_figures
 *    - shortcake-figures → shortcake_figures
 *    - action-hero-figures → action_hero_figures
 *    - barbie-figures → barbie_figures
 *    - calico-figures → calico_figures
 *    - tabletop-minis → tabletop_minis
 *    - burton-puppet → burton_puppet
 *    - action-figure → action_figure
 *    - army-men → army_men
 *
 * Pre-req: migration 137 must have run first (creates the destination
 * snake_case rows in dream_mediums for the bot-only legacy mediums).
 *
 * Usage:
 *   node scripts/remap-legacy-mediums.js              # dry-run preview
 *   node scripts/remap-legacy-mediums.js --execute    # actually update
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

// ── The mapping ────────────────────────────────────────────────────────

// Modern medium keys that legacy variants map to. Built dynamically below.
const SUFFIX_MEDIUMS = [
  'anime', 'watercolor', 'photography', 'canvas', 'render', 'pencil',
  'illustration', 'animation', 'comics', 'claymation', 'lego', 'vinyl',
  'handcrafted', 'pixels', 'fairytale', 'storybook', 'vaporwave', 'neon',
  'coquette', 'gothic', 'surreal', 'shimmer', 'twilight', 'aura',
];
const PREFIXES = [
  'flux1', 'flux1-dev', 'flux1-pro', 'flux2-dev', 'flux2-pro',
  'sdxl', 'batch',
];

const MAPPING = {};
// Model-prefix variants
for (const prefix of PREFIXES) {
  for (const suffix of SUFFIX_MEDIUMS) {
    MAPPING[`${prefix}-${suffix}`] = suffix;
  }
}
// sdxl-animation maps to animation specifically
MAPPING['sdxl-animation'] = 'animation';

// Direct synonyms / typos
MAPPING['oil_painting'] = 'canvas';
MAPPING['photograph'] = 'photography';
MAPPING['cinematic'] = 'render';
MAPPING['real-astro'] = 'photography';

// Kebab → snake_case (gothic family + scene-painterly + ToyBot figure family)
const KEBAB_TO_SNAKE = [
  'gothic-realistic', 'gothic-whimsy',
  'vampire-portrait', 'gothic-painted', 'gothic-architecture', 'gothic-oil-garden',
  'ancient-epic',
  'star-oil-cosmos',
  'maritime-oil-classic', 'maritime-oil-legend', 'maritime-oil-romantic',
  'bloom-conservatory', 'bloom-steampunk-flora',
  'gi-joe-figures', 'shortcake-figures', 'action-hero-figures',
  'barbie-figures', 'calico-figures', 'tabletop-minis',
  'burton-puppet', 'action-figure', 'army-men',
];
for (const k of KEBAB_TO_SNAKE) {
  MAPPING[k] = k.replace(/-/g, '_');
}

async function main() {
  console.log('━━━ remap-legacy-mediums ━━━');
  console.log(`  DRY_RUN: ${DRY_RUN}`);
  console.log(`  ${Object.keys(MAPPING).length} legacy keys defined in mapping`);
  console.log('');

  // Verify destination keys all exist in dream_mediums (skip for dry-run if you want)
  const { data: validMediums } = await sb.from('dream_mediums').select('key');
  const validKeys = new Set((validMediums || []).map((m) => m.key));
  const targets = new Set(Object.values(MAPPING));
  const missingTargets = [...targets].filter((t) => !validKeys.has(t));
  if (missingTargets.length > 0) {
    console.error('Mapping targets MISSING from dream_mediums (run migration 137 first):');
    missingTargets.forEach((t) => console.error(`  ${t}`));
    process.exit(1);
  }
  console.log(`✓ All ${targets.size} mapping targets exist in dream_mediums.`);
  console.log('');

  let totalRemapped = 0;
  let totalSkipped = 0;

  // Process each legacy key one at a time so we can report per-key stats.
  for (const [legacyKey, modernKey] of Object.entries(MAPPING)) {
    // Count how many uploads have this legacy key
    const { count } = await sb
      .from('uploads')
      .select('id', { count: 'exact', head: true })
      .eq('dream_medium', legacyKey);

    if (!count || count === 0) {
      totalSkipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [dry-run] ${legacyKey.padEnd(35)} → ${modernKey.padEnd(20)} (${count} rows)`);
      totalRemapped += count;
      continue;
    }

    const { error } = await sb
      .from('uploads')
      .update({ dream_medium: modernKey })
      .eq('dream_medium', legacyKey);
    if (error) {
      console.error(`  ✗ ${legacyKey} → ${modernKey} FAILED: ${error.message}`);
      continue;
    }
    console.log(`  ✓ ${legacyKey.padEnd(35)} → ${modernKey.padEnd(20)} (${count} rows)`);
    totalRemapped += count;
  }

  console.log('');
  console.log('━━━ DONE ━━━');
  console.log(`  Mapping rules:    ${Object.keys(MAPPING).length}`);
  console.log(`  Rules with rows:  ${Object.keys(MAPPING).length - totalSkipped}`);
  console.log(`  Total rows ${DRY_RUN ? 'would be' : ''} remapped: ${totalRemapped}`);
  if (DRY_RUN) console.log('\n(Re-run with --execute to actually write.)');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
