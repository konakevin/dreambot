#!/usr/bin/env node
/**
 * Sanity-check location pools BEFORE go-live: verify each location is structurally
 * intact + set up EXACTLY like an existing working pool, so it plugs into the
 * nightly engine correctly. Compares against a reference live location (default
 * "tokyo"). Exits non-zero if any location has a blocking problem.
 *
 * Usage: node scripts/sanity-check-pools.mjs "loc a" "loc b" ...
 *        node scripts/sanity-check-pools.mjs --ref hawaii "loc a" ...
 */
import fs from 'fs';
const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('=');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
let args = process.argv.slice(2);
let ref = 'tokyo';
const ri = args.indexOf('--ref');
if (ri >= 0) { ref = args[ri + 1]; args = args.filter((_, i) => i !== ri && i !== ri + 1); }
const LOCS = args;

const isValidBiomeConfig = (bc) =>
  bc && Array.isArray(bc.TIME) && Array.isArray(bc.WEATHER) && Array.isArray(bc.CAMERA) &&
  Array.isArray(bc.PHENOMENA) && Array.isArray(bc.BANS) && typeof bc.SUBJECT_RULE === 'string';

async function inspect(name) {
  const { data: c } = await sb.from('location_cards').select('*').eq('name', name).maybeSingle();
  if (!c) return { name, fatal: ['card MISSING'] };
  const { data: spots } = await sb.from('location_iconic_spots').select('spot_kind,quality_tier,is_active,character_eligible,pure_scene_eligible').eq('location_key', name);
  const active = (spots || []).filter((s) => s.is_active);
  const kinds = {}; for (const s of active) kinds[s.spot_kind] = (kinds[s.spot_kind] || 0) + 1;
  const bc = c.biome_config || {};
  return {
    name,
    biome: c.biome,
    biomeValid: isValidBiomeConfig(bc),
    wardrobe: Array.isArray(bc.WARDROBE) ? bc.WARDROBE.length : 0,
    imagined: bc.imagined === true,
    picker: c.picker_category,
    approved: c.is_approved === true,
    adminOnly: c.admin_only === true,
    recipe: {
      visual_palette: (c.visual_palette || []).length,
      atmosphere: (c.atmosphere || []).length,
      cinematic_phrases: (c.cinematic_phrases || []).length,
    },
    totalSpots: (spots || []).length,
    active: active.length,
    kinds,
    vistaStuck: active.filter((s) => s.spot_kind === 'vista' || s.spot_kind == null).length,
    ungraded: active.filter((s) => !s.quality_tier).length,
    cast: active.filter((s) => s.character_eligible === true).length,
    scene: active.filter((s) => s.pure_scene_eligible === true).length,
  };
}

const R = await inspect(ref);
console.log(`REFERENCE (${ref}): biomeValid=${R.biomeValid} wardrobe=${R.wardrobe} active=${R.active} cast=${R.cast} scene=${R.scene} recipe.visuals=${R.recipe.visual_palette} kinds=${JSON.stringify(R.kinds)}\n`);

let anyFatal = false;
for (const name of LOCS) {
  const x = await inspect(name);
  if (x.fatal) { console.log(`❌ ${name}: ${x.fatal.join(', ')}`); anyFatal = true; continue; }
  const problems = [], warns = [];
  if (!x.biome) problems.push('biome NULL');
  if (!x.biomeValid) problems.push('biome_config INVALID (nightly wardrobe/axes will fall back)');
  if (x.wardrobe < 6) problems.push(`WARDROBE ${x.wardrobe}<6`);
  if (x.vistaStuck > 0) problems.push(`${x.vistaStuck} spots stuck at vista/null (not scale-classified → framing breaks)`);
  if (x.ungraded > 0) warns.push(`${x.ungraded} ungraded`);
  if (x.cast < 15) warns.push(`cast ${x.cast}<15`);
  if (x.scene < 8) warns.push(`scene ${x.scene}<8`);
  if (x.recipe.visual_palette < 5) warns.push(`recipe.visuals ${x.recipe.visual_palette}<5`);
  if (!x.picker) problems.push('picker_category NULL (invisible)');
  if (!x.approved) problems.push('is_approved false (curation/engine gates skip it)');
  const status = problems.length ? '❌' : (warns.length ? '⚠️ ' : '✅');
  if (problems.length) anyFatal = true;
  console.log(`${status} ${name}: active=${x.active} cast=${x.cast} scene=${x.scene} kinds=${JSON.stringify(x.kinds)} biomeValid=${x.biomeValid} WARDROBE=${x.wardrobe} imagined=${x.imagined ? 'Y' : '-'} dark=${x.adminOnly ? 'Y' : '-'}`);
  if (problems.length) console.log(`      BLOCKERS: ${problems.join(' | ')}`);
  if (warns.length) console.log(`      warn: ${warns.join(' | ')}`);
}
console.log(anyFatal ? '\n❌ BLOCKERS present — do NOT go live until resolved.' : '\n✅ All pools sane + production-ready.');
process.exit(anyFatal ? 1 : 0);
