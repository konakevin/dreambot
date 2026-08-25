#!/usr/bin/env node
/**
 * Phase B — scale QA-25 location spot pools UP to production size (~100) and
 * re-curate. Run after Kevin signs off on a category's QA renders. Recipe /
 * biome_config / wardrobe are already seeded (seed-category.mjs) — this ONLY
 * grows + re-curates the iconic-spot pool.
 *
 * Per location: gen 100 iconic anchors (dedups against existing 25) → classify
 * scale → grade → eligibility rules (cast=active&non-wide, scene=active&non-
 * intimate recognizable, with the scene floor). Same rules as seed-category.mjs.
 *
 * Usage: node scripts/scale-pools.mjs "loc a" "loc b" ...
 */
import fs from 'fs';
import { execSync } from 'child_process';
const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('=');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const LOCS = process.argv.slice(2);
if (!LOCS.length) { console.error('Usage: scale-pools.mjs "loc" ...'); process.exit(1); }
const run = (cmd) => { console.log(`  $ ${cmd}`); try { execSync(cmd, { stdio: 'inherit' }); } catch { console.error(`  (failed: ${cmd})`); } };

// 1. Top up to production depth (~100). gen-iconic-spots-50 dedups against existing.
for (const name of LOCS) {
  console.log(`=== scale spots -> 100: ${name} ===`);
  run(`node scripts/gen-iconic-spots-50.js --location "${name}" --count 100`);
}
// 2. classify scale (global; only new/unclassified) + grade (per loc)
console.log('=== classify scale ===');
run('node scripts/classify-iconic-spots.js');
for (const name of LOCS) { console.log(`=== grade: ${name} ===`); run(`node scripts/grade-iconic-spots.js --location "${name}"`); }
// 3. pure-scene eligibility (global; new S/A spots)
console.log('=== pure-scene eligible ==='); run('node scripts/classify-pure-scene-eligible.js');
// 4. eligibility rules per loc (self-healing) — same as seed-category.mjs
for (const name of LOCS) {
  for (let a = 0; a < 2; a++) {
    await sb.from('location_iconic_spots').update({ character_eligible: true }).eq('location_key', name).eq('is_active', true).in('spot_kind', ['medium', 'intimate']);
    await sb.from('location_iconic_spots').update({ character_eligible: false }).eq('location_key', name).eq('spot_kind', 'wide');
    const { data: chk } = await sb.from('location_iconic_spots').select('id').eq('location_key', name).eq('is_active', true).in('spot_kind', ['medium', 'intimate']).is('character_eligible', null);
    if (!chk || chk.length === 0) break;
  }
  await sb.from('location_iconic_spots').update({ pure_scene_eligible: false }).eq('location_key', name).eq('is_active', true).eq('spot_kind', 'intimate');
  const { data: sc } = await sb.from('location_iconic_spots').select('id').eq('location_key', name).eq('is_active', true).eq('pure_scene_eligible', true);
  if ((sc || []).length < 8) {
    await sb.from('location_iconic_spots').update({ pure_scene_eligible: true }).eq('location_key', name).eq('is_active', true).in('spot_kind', ['wide', 'medium']);
    await sb.from('location_iconic_spots').update({ pure_scene_eligible: false }).eq('location_key', name).eq('is_active', true).eq('spot_kind', 'intimate');
  }
}
// 5. verify
console.log('\n=== VERIFY (production depth) ===');
for (const name of LOCS) {
  const { data } = await sb.from('location_iconic_spots').select('character_eligible,pure_scene_eligible,is_active').eq('location_key', name).eq('is_active', true);
  const cast = data.filter((x) => x.character_eligible).length, scene = data.filter((x) => x.pure_scene_eligible).length;
  console.log(`${name}: active=${data.length} cast=${cast} scene=${scene}${cast < 15 ? ' ⚠️CAST' : ''}${scene < 8 ? ' ⚠️SCENE' : ''}`);
}
console.log('=== scale-pools complete ===');
