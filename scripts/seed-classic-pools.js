#!/usr/bin/env node
/**
 * Seed the CLASSIC pose pools + scene clusters into the DB — Steps 1-3 of
 * POSE_POOLS_DB_MIGRATION_PLAN.md. Content is parsed FROM THE CODE ARRAYS
 * (scripts/lib/poolParse.js), never retyped (invariant I2); every pose row is
 * classic-linted (proximity only, I5); refuses to double-seed without
 * --wipe-<target>; always finishes by running the parity check inline.
 *
 * Targets (ONE per run — one pool at a time, per the plan's sequencing):
 *   node scripts/seed-classic-pools.js clusters [--wipe-clusters]
 *   node scripts/seed-classic-pools.js solo     [--wipe-solo]
 *   node scripts/seed-classic-pools.js dual     [--wipe-dual]
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { parseStringArray, parseRecord } = require('./lib/poolParse');
const { lintClassicPoseEntry } = require('./lib/posePoolLint');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const D = 'supabase/functions/_shared/pools/';

const POSE_POOLS = {
  dual: [
    ['companion', 'dual_actions.ts', 'DUAL_ACTIONS_COMPANION'],
    ['partner', 'dual_actions.ts', 'DUAL_ACTIONS_PARTNER'],
    ['playful', 'dual_actions.ts', 'DUAL_ACTIONS_PLAYFUL'],
  ],
  solo: [
    ['candid', 'single_actions.ts', 'CANDID_ACTIONS'],
    ['portrait', 'single_actions.ts', 'PORTRAIT_ACTIONS'],
  ],
};

async function insertBatched(table, rows) {
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await sb.from(table).insert(rows.slice(i, i + 100));
    if (error) throw new Error(`${table} insert: ${error.message}`);
  }
}

(async () => {
  const target = process.argv[2];
  if (!['clusters', 'solo', 'dual'].includes(target)) {
    console.error('usage: seed-classic-pools.js clusters|solo|dual [--wipe-<target>]');
    process.exit(1);
  }
  const wipe = process.argv.includes(`--wipe-${target}`);

  if (target === 'clusters') {
    const spots = parseRecord(D + 'scene_clusters.ts', 'SCENE_CLUSTERS_SPOTS');
    const acts = parseRecord(D + 'scene_clusters.ts', 'SCENE_CLUSTERS_ACTIVITIES');
    const rows = [];
    for (const [key, arr] of Object.entries(spots))
      for (const text of arr) rows.push({ location_key: key, kind: 'spot', text });
    for (const [key, arr] of Object.entries(acts))
      for (const text of arr) rows.push({ location_key: key, kind: 'activity', text });
    const { count } = await sb.from('location_spots').select('*', { count: 'exact', head: true });
    if (count > 0 && !wipe) {
      console.error(`location_spots has ${count} rows — use --wipe-clusters to replace.`);
      process.exit(1);
    }
    if (wipe) await sb.from('location_spots').delete().gte('id', 0);
    await insertBatched('location_spots', rows);
    console.log(`✓ location_spots seeded: ${rows.length} rows`);
  } else {
    const pools = POSE_POOLS[target];
    let bad = 0;
    const rows = [];
    for (const [pool, file, name] of pools) {
      const arr = parseStringArray(D + file, name);
      for (const text of arr) {
        const p = lintClassicPoseEntry(text);
        if (p.length) {
          bad++;
          console.error(`✗ [${pool}] ${p.join('; ')}: ${text.slice(0, 80)}`);
        }
        rows.push({ cast_type: target, pool, text, biomes: null });
      }
      console.log(`  parsed ${pool}: ${arr.length}`);
    }
    if (bad) {
      console.error(`${bad} entries failed the classic lint — nothing inserted.`);
      process.exit(1);
    }
    const { count } = await sb
      .from('action_poses')
      .select('*', { count: 'exact', head: true })
      .eq('cast_type', target)
      .neq('pool', 'active');
    if (count > 0 && !wipe) {
      console.error(`classic ${target} pools already have ${count} rows — use --wipe-${target}.`);
      process.exit(1);
    }
    if (wipe) await sb.from('action_poses').delete().eq('cast_type', target).neq('pool', 'active');
    await insertBatched('action_poses', rows);
    console.log(`✓ classic ${target} pools seeded: ${rows.length} rows`);
  }

  // Always end with the parity check — the seed is not done until it's green.
  const { spawnSync } = require('child_process');
  const r = spawnSync('node', ['scripts/verify-pool-parity.js'], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
})();
