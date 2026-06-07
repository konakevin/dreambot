#!/usr/bin/env node
/**
 * Extract wide pure_scene_eligible spots from location_iconic_spots into
 * the BrickBot lego-landscapes seed file. Reuses the same pool the nightly
 * engine pulls from for LEGO scene renders — those wide vistas are exactly
 * what BrickBot's lego-landscapes path renders as LEGO landscape dioramas.
 *
 * Re-run whenever location_iconic_spots grows. Output overwrites
 * brickbot_lego_landscapes_locations.json.
 *
 * Usage:
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
 *   node scripts/bots/brickbot/seeds/extract-lego-landscapes-locations.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = fs
  .readFileSync(path.join(__dirname, '..', '..', '..', '..', '.env.local'), 'utf8')
  .split('\n')
  .reduce((a, l) => {
    const m = l.match(/^([^=]+)=(.*)$/);
    if (m) a[m[1]] = m[2];
    return a;
  }, {});

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const PAGE = 1000;
  let from = 0;
  const all = [];
  // Paginate to defeat the PostgREST 1000-row cap.
  while (true) {
    const { data, error } = await sb
      .from('location_iconic_spots')
      .select('location_key, spot_text, quality_tier')
      .eq('is_active', true)
      .eq('pure_scene_eligible', true)
      .eq('spot_kind', 'wide')
      .order('location_key')
      .range(from, from + PAGE - 1);
    if (error) {
      console.error('Query failed:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  const pool = all
    .filter((r) => r.spot_text && r.location_key)
    .map((r) => ({
      location: r.location_key,
      scene: r.spot_text.trim(),
      tier: r.quality_tier,
    }));

  const byLoc = {};
  for (const r of pool) byLoc[r.location] = (byLoc[r.location] || 0) + 1;

  // Write to BrickBot's seed dir (canonical), then mirror to any other bot
  // that consumes the same pool. Update OUT_PATHS when adding a new bot.
  const OUT_PATHS = [
    path.join(__dirname, 'brickbot_lego_landscapes_locations.json'),
    path.join(
      __dirname,
      '..',
      '..',
      'pixelbot',
      'seeds',
      'pixelbot_pixel_landscapes_locations.json'
    ),
    path.join(
      __dirname,
      '..',
      '..',
      'toybot',
      'seeds',
      'toybot_toy_landscapes_locations.json'
    ),
  ];
  const json = JSON.stringify(pool, null, 2);
  for (const outPath of OUT_PATHS) fs.writeFileSync(outPath, json);

  console.log(`✅ wrote ${pool.length} entries across ${Object.keys(byLoc).length} locations`);
  for (const outPath of OUT_PATHS) console.log(`   -> ${outPath}`);
  console.log('');
  console.log('Top 10 locations by entry count:');
  Object.entries(byLoc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([k, n]) => console.log(`   ${k.padEnd(30)} ${n}`));
})();
