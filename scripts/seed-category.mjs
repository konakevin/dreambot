#!/usr/bin/env node
/**
 * Reusable per-category location seeder for Operation Expand Dreams.
 * Runs the full LOCATION_SEED_PLAYBOOK pipeline with every lesson baked in:
 *   - sets is_approved=true + picker_category + admin_only=true EARLY (before the
 *     global curation scripts, or they skip the new cards — the curation-gate bug)
 *   - biome + bespoke biome_config (axes) + wardrobe pool per location
 *   - imagined worlds get biome_config.imagined=true (painterly medium ban)
 *   - 100 iconic anchors/loc, scale-classified + graded
 *   - eligibility rules: character_eligible = active & NON-wide (cast skews
 *     medium/intimate, no tiny-cutout); pure_scene_eligible = active & NON-intimate
 *     recognizable scenes (drops ambiguous close-ups) via classify + intimate cut
 *
 * Recipes must already exist (run generate-full-location-card.js first).
 *
 * Usage:
 *   node scripts/seed-category.mjs <picker_category> <imagined:true|false> <sortStart> "loc=biome" ["loc=biome" ...]
 * Example:
 *   node scripts/seed-category.mjs through_time false 3 "victorian london=gothic_historic" "ancient rome=ancient_ruins"
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

const [category, imaginedArg, sortStartArg, ...pairs] = process.argv.slice(2);
if (!category || !pairs.length) {
  console.error('Usage: seed-category.mjs <picker_category> <imagined> <sortStart> "loc=biome" ...');
  process.exit(1);
}
const IMAGINED = imaginedArg === 'true';
const sortStart = Number(sortStartArg) || 0;
const LOCS = pairs.map((p) => {
  const i = p.lastIndexOf('=');
  return { name: p.slice(0, i).trim(), biome: p.slice(i + 1).trim() };
});
const run = (cmd) => {
  console.log(`  $ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
  } catch (e) {
    console.error(`  (command failed: ${cmd})`);
  }
};

// 1. Gate columns EARLY: biome + is_approved + picker_category + admin_only (dark)
let sort = sortStart;
for (const { name, biome } of LOCS) {
  const { error } = await sb
    .from('location_cards')
    .update({ biome, is_approved: true, picker_category: category, admin_only: true, picker_sort_order: sort++ })
    .eq('name', name);
  console.log(`${error ? 'ERR ' : 'gate '}${name} -> biome=${biome}, ${category} (dark)${error ? ': ' + error.message : ''}`);
}

// 2. biome_config (axes) + wardrobe, per location
for (const { name } of LOCS) {
  console.log(`=== biome_config: ${name} ===`);
  run(`node scripts/gen-location-biome.js --location "${name}"`);
}
if (IMAGINED) {
  for (const { name } of LOCS) {
    const { data } = await sb.from('location_cards').select('biome_config').eq('name', name).single();
    const bc = { ...(data?.biome_config || {}), imagined: true };
    await sb.from('location_cards').update({ biome_config: bc }).eq('name', name);
    console.log(`imagined=true -> ${name}`);
  }
}
for (const { name } of LOCS) {
  console.log(`=== wardrobe: ${name} ===`);
  run(`node scripts/gen-location-wardrobe.js --location "${name}"`);
}

// 3. iconic anchors — QA-SIZE (~25/loc, Kevin's "seed 25 to test" rule). Scale to
// full depth (100+) only after sign-off. Enough for a test batch; keeps prep lean.
for (const { name } of LOCS) {
  console.log(`=== iconic spots (QA 25): ${name} ===`);
  run(`node scripts/gen-iconic-spots-50.js --location "${name}" --count 25`);
}

// 4. scale-classify (global; only touches new unclassified) + grade (per loc)
console.log('=== classify scale ===');
run('node scripts/classify-iconic-spots.js');
for (const { name } of LOCS) {
  console.log(`=== grade: ${name} ===`);
  run(`node scripts/grade-iconic-spots.js --location "${name}"`);
}

// 5. pure-scene eligibility (S auto + A judged; new spots only)
console.log('=== pure-scene eligible ===');
run('node scripts/classify-pure-scene-eligible.js');

// 6. Apply eligibility RULES per location (the baked-in lessons) — self-healing
for (const { name } of LOCS) {
  // cast pool = active & NON-wide (skew medium/intimate; no tiny-cutout / statue-avenue).
  // Apply + verify + re-apply once (a single update occasionally no-ops → char_eligible null).
  for (let attempt = 0; attempt < 2; attempt++) {
    await sb.from('location_iconic_spots').update({ character_eligible: true }).eq('location_key', name).eq('is_active', true).in('spot_kind', ['medium', 'intimate']);
    await sb.from('location_iconic_spots').update({ character_eligible: false }).eq('location_key', name).eq('spot_kind', 'wide');
    const { data: chk } = await sb.from('location_iconic_spots').select('id').eq('location_key', name).eq('is_active', true).in('spot_kind', ['medium', 'intimate']).is('character_eligible', null);
    if (!chk || chk.length === 0) break;
  }
  // scene pool = recognizable wide/medium (drop ambiguous intimate close-ups)
  await sb.from('location_iconic_spots').update({ pure_scene_eligible: false }).eq('location_key', name).eq('is_active', true).eq('spot_kind', 'intimate');
  // scene FLOOR: interior/vista-thin locations can end with an empty scene pool
  // (strict classifier). If <8, seed pure_scene from active wide+medium exteriors.
  const { data: sc } = await sb.from('location_iconic_spots').select('id').eq('location_key', name).eq('is_active', true).eq('pure_scene_eligible', true);
  if ((sc || []).length < 8) {
    await sb.from('location_iconic_spots').update({ pure_scene_eligible: true }).eq('location_key', name).eq('is_active', true).in('spot_kind', ['wide', 'medium']);
    await sb.from('location_iconic_spots').update({ pure_scene_eligible: false }).eq('location_key', name).eq('is_active', true).eq('spot_kind', 'intimate');
  }
}

// 7. Verify
console.log('\n=== VERIFY ===');
for (const { name } of LOCS) {
  const { data } = await sb.from('location_iconic_spots').select('spot_kind,character_eligible,pure_scene_eligible,is_active').eq('location_key', name).eq('is_active', true);
  const cast = data.filter((x) => x.character_eligible);
  const scene = data.filter((x) => x.pure_scene_eligible);
  const ck = {}, sk = {};
  for (const s of cast) ck[s.spot_kind] = (ck[s.spot_kind] || 0) + 1;
  for (const s of scene) sk[s.spot_kind] = (sk[s.spot_kind] || 0) + 1;
  const { data: card } = await sb.from('location_cards').select('biome_config').eq('name', name).single();
  const bc = card?.biome_config || {};
  const valid = Array.isArray(bc.TIME) && Array.isArray(bc.BANS) && typeof bc.SUBJECT_RULE === 'string';
  console.log(`${name}: active=${data.length} | cast=${cast.length} ${JSON.stringify(ck)} | scene=${scene.length} ${JSON.stringify(sk)} | biome_config valid=${valid} WARDROBE=${bc.WARDROBE?.length || 0} imagined=${bc.imagined === true ? 'Y' : '-'}`);
  if (cast.length < 15) console.log(`  ⚠️ ${name} cast pool below depth floor (15)`);
  if (scene.length < 8) console.log(`  ⚠️ ${name} scene pool thin (<8)`);
}
console.log('\n=== seed-category complete ===');
