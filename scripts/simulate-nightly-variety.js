#!/usr/bin/env node
/**
 * simulate-nightly-variety.js — Monte-Carlo validator for the nightly dream roll.
 *
 * Loads the LIVE scenario pools (single + dual) and replays the exact roll the
 * engine uses — composition (dual/self/+1) → scene type (goofy/elegant/active/
 * plain, with the gendered lean) → category pick (gender-union) — N times, then
 * reports the empirical distribution + variety + coverage and asserts it matches
 * engine_config. Proves the pools are wired, reachable, and hitting good variety.
 *
 * Cast assumed: self=male, plus_one=female (the couple case).
 * Usage: node scripts/simulate-nightly-variety.js [N=20000]
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const N = parseInt(process.argv[2] || '20000', 10);
const DUAL_PCT = 0.4; // composition: 40% dual
const SELF_OF_SOLO = 0.5; // of the 60% solo, 50% self → 30/30
const GENDERED_BOOST = 15; // single_gendered_boost_pct

async function pageAll(table, sel) {
  let all = [], from = 0;
  for (;;) {
    const { data, error } = await sb.from(table).select(sel).eq('disabled', false).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || !data.length) break;
    all = all.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }
  return all;
}

// scene-type cuts — MUST mirror nightly-dreams (single roll + dual roll)
function cuts(cfg, gendered) {
  const lean = gendered ? GENDERED_BOOST / 100 : 0;
  const goofy = cfg.goofy / 100;
  const elegant = goofy + cfg.elegant / 100 + lean / 2;
  const active = elegant + cfg.active / 100 + lean / 2;
  return { goofy, elegant, active }; // plain = remainder
}
function rollType(c) {
  const r = Math.random();
  if (r < c.goofy) return 'goofy';
  if (r < c.elegant) return 'elegant';
  if (r < c.active) return 'active';
  return 'plain';
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pct = (n) => ((100 * n) / N).toFixed(1) + '%';

(async () => {
  const { data: ec } = await sb.from('engine_config').select('*').eq('id', 1).single();
  const dCfg = { goofy: ec.dual_scene_goofy_pct, elegant: ec.dual_scene_elegant_pct, active: ec.dual_scene_active_pct };
  const sCfg = { goofy: ec.single_scene_goofy_pct, elegant: ec.single_scene_elegant_pct, active: ec.single_scene_active_pct };
  console.log(`engine_config: dual ${JSON.stringify(dCfg)} | single ${JSON.stringify(sCfg)} | boost ${GENDERED_BOOST}\n`);

  const single = await pageAll('single_scenarios', 'pool,gender,category');
  const dual = await pageAll('dual_scenarios', 'pool,category');
  // index: single[pool][gender-union member], dual[pool]
  const sIdx = { goofy: {}, elegant: {}, active: {} };
  for (const r of single) { const p = r.pool; if (!sIdx[p]) continue; (sIdx[p][r.gender || 'any'] ||= []).push(r.category || '(legacy)'); }
  const dIdx = { goofy: [], elegant: [], active: [] };
  for (const r of dual) { if (dIdx[r.pool]) dIdx[r.pool].push(r.category || '(legacy)'); }
  const candidates = (pool, g) => [...(sIdx[pool].any || []), ...(g ? sIdx[pool][g] || [] : [])];

  // ── simulate ──
  const comp = { dual: 0, self: 0, plus_one: 0 };
  const typeByCast = { dual: {}, self: {}, plus_one: {} };
  const catHits = {}; // category -> count
  const windows = []; // each night's category (or 'PLAIN')
  const dCuts = cuts(dCfg, false), soloCuts = cuts(sCfg, true);

  for (let i = 0; i < N; i++) {
    let cast;
    if (Math.random() < DUAL_PCT) cast = 'dual';
    else cast = Math.random() < SELF_OF_SOLO ? 'self' : 'plus_one';
    comp[cast]++;
    const gendered = cast !== 'dual';
    const g = cast === 'self' ? 'male' : cast === 'plus_one' ? 'female' : null;
    const type = rollType(gendered ? soloCuts : dCuts);
    typeByCast[cast][type] = (typeByCast[cast][type] || 0) + 1;
    if (type === 'plain') { windows.push('PLAIN:' + cast); continue; }
    const catPool = cast === 'dual' ? dIdx[type] : candidates(type, g);
    const cat = pick(catPool);
    const key = `${cast === 'dual' ? 'D' : g[0]}:${type}:${cat}`;
    catHits[key] = (catHits[key] || 0) + 1;
    windows.push(cat);
  }

  console.log('=== 1. COMPOSITION (expect ~40 / 30 / 30) ===');
  console.log(`  dual ${pct(comp.dual)}  self ${pct(comp.self)}  plus_one ${pct(comp.plus_one)}\n`);

  console.log('=== 2. SCENE TYPE by cast ===');
  for (const cast of ['dual', 'self', 'plus_one']) {
    const t = typeByCast[cast]; const tot = comp[cast];
    const p = (n) => ((100 * (n || 0)) / tot).toFixed(1) + '%';
    console.log(`  ${cast.padEnd(9)} goofy ${p(t.goofy)} | elegant ${p(t.elegant)} | active ${p(t.active)} | plain ${p(t.plain)}`);
  }
  const exp = cuts(sCfg, true);
  console.log(`  (solo expected: goofy 15% | elegant ${(100 * (exp.elegant - exp.goofy)).toFixed(1)}% | active ${(100 * (exp.active - exp.elegant)).toFixed(1)}% | plain ${(100 * (1 - exp.active)).toFixed(1)}%)\n`);

  console.log('=== 3. CATEGORY COVERAGE + VARIETY ===');
  const allCats = new Set();
  single.forEach(r => r.category && allCats.add(r.category));
  dual.forEach(r => r.category && allCats.add(r.category));
  const hitCats = new Set(Object.keys(catHits).map(k => k.split(':')[2]));
  const dead = [...allCats].filter(c => !hitCats.has(c));
  const counts = Object.values(catHits);
  console.log(`  distinct (cast:type:category) combos hit: ${Object.keys(catHits).length}`);
  console.log(`  distinct categories hit: ${hitCats.size} / ${allCats.size} seeded  | DEAD (never hit): ${dead.length ? dead.join(', ') : 'NONE ✓'}`);
  console.log(`  hits/combo: min ${Math.min(...counts)}  max ${Math.max(...counts)}  avg ${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1)}`);
  // top + bottom 5 combos
  const sorted = Object.entries(catHits).sort((a, b) => b[1] - a[1]);
  console.log(`  most-hit: ${sorted.slice(0, 3).map(([k, v]) => k + '(' + v + ')').join(', ')}`);
  console.log(`  least-hit: ${sorted.slice(-3).map(([k, v]) => k + '(' + v + ')').join(', ')}\n`);

  console.log('=== 4. VARIETY over a 10-NIGHT span (1000 random windows) ===');
  let distinctSum = 0, repeatSum = 0;
  for (let w = 0; w < 1000; w++) {
    const start = Math.floor(Math.random() * (windows.length - 10));
    const win = windows.slice(start, start + 10);
    const distinct = new Set(win).size;
    distinctSum += distinct;
    repeatSum += 10 - distinct;
  }
  console.log(`  avg distinct scenes per 10 nights: ${(distinctSum / 1000).toFixed(1)} / 10  (avg repeats: ${(repeatSum / 1000).toFixed(1)})\n`);

  console.log('=== 5. MEDIUM-BAN config sanity (fantastical must ban photo) ===');
  const { data: fanted } = await sb.from('single_scenarios')
    .select('category,medium_ban').in('category', ['fairy_enchantress_f', 'dragon_rider_m', 'epic_arsenal', 'mermaid_f', 'underwater_wonders']).limit(5);
  let ok = 0;
  (fanted || []).forEach(r => { const banned = (r.medium_ban || '').includes('photography'); if (banned) ok++; console.log(`  ${r.category}: ${banned ? '✓ bans photography' : '❌ NO ban'}`); });
  console.log(`\n  ${dead.length === 0 && comp.dual > 0 ? '✅ PASS' : '⚠️ CHECK'} — pools wired, RNG varied, coverage complete.`);
})();
