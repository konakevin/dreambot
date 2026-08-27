#!/usr/bin/env node
/**
 * Parity verifier (invariant I2 + standing drift detector): for every
 * DB-loadable classic pool that has rows, assert the DB set EXACTLY equals
 * the code-array set (normalized). Pools with no rows are reported as
 * code-only (fine — not yet cut over). Exits non-zero on ANY diff.
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { parseStringArray, parseRecord, norm } = require('./lib/poolParse');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const D = 'supabase/functions/_shared/pools/';

/** A DB row is malformed if it's a delimiter fragment or too short (2026-08-27). */
function isMalformed(t) {
  if (typeof t !== 'string') return true;
  const s = t.trim();
  return s.length < 10 || s.includes('\n') || /",\s*"/.test(s) || /^["',\s]+$/.test(s);
}

function diffSets(codeArr, dbArr, label) {
  // (1) Malformed-row guard — set-comparison alone is blind to DUPLICATE garbage
  //     (N identical junk rows collapse to one set element). Check rows directly.
  const junk = dbArr.filter(isMalformed);
  if (junk.length) {
    console.error(`✗ ${label}: ${junk.length} MALFORMED DB rows (e.g. ${JSON.stringify(junk[0])})`);
    return false;
  }
  // (2) Count guard — multiplicity, not just membership.
  if (dbArr.length !== codeArr.length) {
    console.error(`✗ ${label}: DB has ${dbArr.length} rows, code has ${codeArr.length}`);
  }
  const code = new Set(codeArr.map(norm));
  const db = new Set(dbArr.map(norm));
  const missing = [...code].filter((x) => !db.has(x));
  const extra = [...db].filter((x) => !code.has(x));
  if (missing.length || extra.length || dbArr.length !== codeArr.length) {
    console.error(`✗ ${label}: ${missing.length} missing from DB, ${extra.length} extra in DB`);
    for (const m of missing.slice(0, 3)) console.error(`   missing: ${m.slice(0, 70)}`);
    for (const e of extra.slice(0, 3)) console.error(`   extra:   ${e.slice(0, 70)}`);
    return false;
  }
  console.log(`✓ ${label}: ${codeArr.length} entries, DB matches code exactly`);
  return true;
}

(async () => {
  let ok = true;
  const POOLS = [
    ['dual', 'companion', 'dual_actions.ts', 'DUAL_ACTIONS_COMPANION'],
    ['dual', 'partner', 'dual_actions.ts', 'DUAL_ACTIONS_PARTNER'],
    ['dual', 'playful', 'dual_actions.ts', 'DUAL_ACTIONS_PLAYFUL'],
    ['solo', 'candid', 'single_actions.ts', 'CANDID_ACTIONS'],
    ['solo', 'portrait', 'single_actions.ts', 'PORTRAIT_ACTIONS'],
  ];
  for (const [castType, pool, file, name] of POOLS) {
    const { data } = await sb
      .from('action_poses')
      .select('text')
      .eq('cast_type', castType)
      .eq('pool', pool)
      .eq('disabled', false)
      .limit(1000);
    if (!data || data.length === 0) {
      console.log(`— ${castType}/${pool}: no DB rows (code-only, not cut over)`);
      continue;
    }
    ok =
      diffSets(
        parseStringArray(D + file, name),
        data.map((r) => r.text),
        `${castType}/${pool}`
      ) && ok;
  }
  for (const [kind, name] of [
    ['spot', 'SCENE_CLUSTERS_SPOTS'],
    ['activity', 'SCENE_CLUSTERS_ACTIVITIES'],
  ]) {
    const { data } = await sb
      .from('location_spots')
      .select('location_key,text')
      .eq('kind', kind)
      .eq('disabled', false)
      .limit(2000);
    if (!data || data.length === 0) {
      console.log(`— clusters/${kind}: no DB rows (code-only, not cut over)`);
      continue;
    }
    const rec = parseRecord(D + 'scene_clusters.ts', name);
    const codeFlat = Object.entries(rec).flatMap(([k, arr]) => arr.map((t) => `${k}|${t}`));
    const dbFlat = data.map((r) => `${r.location_key}|${r.text}`);
    ok = diffSets(codeFlat, dbFlat, `clusters/${kind}`) && ok;
  }
  process.exit(ok ? 0 : 1);
})();
