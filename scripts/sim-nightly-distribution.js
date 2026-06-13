#!/usr/bin/env node
/**
 * sim-nightly-distribution.js — Monte-Carlo the nightly dream-type RNG.
 *
 * Pulls the LIVE engine_config distribution knobs + the REAL non-bot user
 * cohort mix (dream_cast self/+1 presence + chaos slider) from the DB, then
 * simulates many nights to show the scene-only vs character/face-swap split.
 *
 * Two readouts:
 *   1. REAL population  — each actual eligible user × N nights (skipped if the
 *                         population is too small to be meaningful).
 *   2. SYNTHETIC scenarios — projected distributions under assumed cast-adoption
 *                         mixes (the dominant lever), for pre-launch planning.
 *
 *   node scripts/sim-nightly-distribution.js [--nights 30] [--pop 20000]
 *
 * ── ROLL LOGIC MIRROR ────────────────────────────────────────────────────
 * rollNightlyDreamType below MIRRORS supabase/functions/_shared/chaosTier.ts
 * (the production source of truth). It's duplicated here because that module
 * is a Deno/TS URL-import file that node can't import directly. If you change
 * the roll in chaosTier.ts, update this mirror too (and __tests__/lib/
 * chaosTier.test.ts is the canonical guard on the TS side). The isFirstDream
 * showcase branch is intentionally omitted — this models STEADY-STATE nightly.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://jimftynwrinwenonjrlj.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── args ──
const argv = process.argv.slice(2);
const argVal = (flag, def) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : def;
};
const NIGHTS = argVal('--nights', 30);
const SYN_POP = argVal('--pop', 20000);
const REAL_MIN = 20; // skip the real-population sim below this many users

// ── config (mirrors chaosTier.ts DEFAULT_CONFIG) ──
const DEFAULT_CONFIG = {
  low: 0.4,
  high: 0.7,
  embodied_low: 0,
  embodied_mid: 0.333,
  embodied_high: 0.5,
  face_swap_share: 0.7,
  face_swap_share_with_plus_one: 0.9,
  face_swap_dual_rate: 0.6,
  face_swap_self_rate: 0.2,
};

async function fetchConfig(sb) {
  const { data, error } = await sb
    .from('engine_config')
    .select(
      'chaos_low_threshold, chaos_high_threshold, scene_embodied_rate_low, scene_embodied_rate_mid, scene_embodied_rate_high, face_swap_share, face_swap_share_with_plus_one, face_swap_dual_rate, face_swap_self_rate'
    )
    .eq('id', 1)
    .single();
  if (error || !data) {
    console.warn('[sim] engine_config read failed — using code defaults:', error && error.message);
    return { ...DEFAULT_CONFIG, _source: 'defaults' };
  }
  const n = (v, d) => (v == null ? d : Number(v));
  return {
    low: n(data.chaos_low_threshold, DEFAULT_CONFIG.low),
    high: n(data.chaos_high_threshold, DEFAULT_CONFIG.high),
    embodied_low: n(data.scene_embodied_rate_low, DEFAULT_CONFIG.embodied_low),
    embodied_mid: n(data.scene_embodied_rate_mid, DEFAULT_CONFIG.embodied_mid),
    embodied_high: n(data.scene_embodied_rate_high, DEFAULT_CONFIG.embodied_high),
    face_swap_share: n(data.face_swap_share, DEFAULT_CONFIG.face_swap_share),
    face_swap_share_with_plus_one: n(
      data.face_swap_share_with_plus_one,
      DEFAULT_CONFIG.face_swap_share_with_plus_one
    ),
    face_swap_dual_rate: n(data.face_swap_dual_rate, DEFAULT_CONFIG.face_swap_dual_rate),
    face_swap_self_rate: n(data.face_swap_self_rate, DEFAULT_CONFIG.face_swap_self_rate),
    _source: 'engine_config',
  };
}

// ── roll logic mirror ──
function chaosTierOf(v, cfg) {
  const x = typeof v === 'number' && !Number.isNaN(v) ? v : 0.5;
  if (x < cfg.low) return 'low';
  if (x >= cfg.high) return 'high';
  return 'mid';
}
function embodiedRate(tier, cfg) {
  if (tier === 'low') return cfg.embodied_low;
  if (tier === 'high') return cfg.embodied_high;
  return cfg.embodied_mid;
}
function rollNightlyDreamType({ hasSelf, hasPlusOne, tier, cfg }) {
  if (!hasSelf) {
    return Math.random() < embodiedRate(tier, cfg) ? 'embodied' : 'pure_scene';
  }
  const share = hasPlusOne ? cfg.face_swap_share_with_plus_one : cfg.face_swap_share;
  if (Math.random() < share) {
    if (!hasPlusOne) return 'face_swap_self';
    const r = Math.random();
    if (r < cfg.face_swap_dual_rate) return 'face_swap_dual';
    if (r < cfg.face_swap_dual_rate + cfg.face_swap_self_rate) return 'face_swap_self';
    return 'face_swap_plus_one';
  }
  if (Math.random() < embodiedRate(tier, cfg)) return 'embodied';
  return Math.random() < 0.5 ? 'pure_scene' : 'epic_tiny';
}

// ── chaos slider sampler (clamped normal centered 0.5, Box-Muller) ──
function sampleChaos() {
  const u1 = Math.random() || 1e-9;
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.min(1, Math.max(0, 0.5 + 0.2 * z));
}

// ── aggregate + print ──
function tally() {
  return {
    face_swap_dual: 0,
    face_swap_self: 0,
    face_swap_plus_one: 0,
    pure_scene: 0,
    epic_tiny: 0,
    embodied: 0,
    _total: 0,
  };
}
function record(c, t) {
  c[t]++;
  c._total++;
}
function report(label, c) {
  const T = c._total || 1;
  const pct = (n) => `${((100 * n) / T).toFixed(1)}%`.padStart(6);
  const fs = c.face_swap_dual + c.face_swap_self + c.face_swap_plus_one;
  const userAppears = fs + c.epic_tiny;
  const sceneOnly = c.pure_scene + c.embodied;
  console.log(`\n  ${label}  (${T.toLocaleString()} dreams)`);
  console.log(
    `    FACE-SWAP   ${pct(fs)}   ↳ dual ${pct(c.face_swap_dual)}  self ${pct(
      c.face_swap_self
    )}  +1 ${pct(c.face_swap_plus_one)}`
  );
  console.log(
    `    SCENE       ${pct(sceneOnly + c.epic_tiny)}   ↳ pure ${pct(c.pure_scene)}  embodied ${pct(
      c.embodied
    )}  epic_tiny ${pct(c.epic_tiny)}`
  );
  console.log(`    → USER APPEARS ${pct(userAppears)}   |   SCENE-ONLY ${pct(sceneOnly)}`);
}

function cohortOf(recipe) {
  const cast = Array.isArray(recipe && recipe.dream_cast) ? recipe.dream_cast : [];
  const described = cast.filter(
    (m) => m && m.description && typeof m.thumb_url === 'string' && m.thumb_url.startsWith('http')
  );
  return {
    hasSelf: described.some((m) => m.role === 'self'),
    hasPlusOne: described.some((m) => m.role === 'plus_one'),
    chaos:
      typeof (recipe && recipe.moods && recipe.moods.peaceful_chaotic) === 'number'
        ? recipe.moods.peaceful_chaotic
        : 0.5,
  };
}

async function main() {
  if (!SERVICE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  const cfg = await fetchConfig(sb);

  console.log('═══ Nightly dream distribution simulation ═══');
  console.log(`config source: ${cfg._source} | nights/user: ${NIGHTS}`);
  console.log(
    `knobs: face_swap_share=${cfg.face_swap_share} with_plus_one=${cfg.face_swap_share_with_plus_one} ` +
      `dual=${cfg.face_swap_dual_rate} self=${cfg.face_swap_self_rate} ` +
      `embodied[low/mid/high]=${cfg.embodied_low}/${cfg.embodied_mid}/${cfg.embodied_high}`
  );

  // ── pull real non-bot population ──
  const rows = [];
  let from = 0;
  const page = 1000;
  while (true) {
    const { data, error } = await sb
      .from('user_recipes')
      .select('user_id, recipe, users!inner(is_bot)')
      .eq('users.is_bot', false)
      .range(from, from + page - 1);
    if (error) {
      console.error('user_recipes read failed:', error.message);
      break;
    }
    rows.push(...data);
    if (data.length < page) break;
    from += page;
  }

  const users = rows.map((r) => cohortOf(r.recipe));
  const cohortMix = { noCast: 0, selfOnly: 0, selfPlusOne: 0, plusOneOnly: 0 };
  const tierMix = { low: 0, mid: 0, high: 0 };
  for (const u of users) {
    if (u.hasSelf && u.hasPlusOne) cohortMix.selfPlusOne++;
    else if (u.hasSelf) cohortMix.selfOnly++;
    else if (u.hasPlusOne) cohortMix.plusOneOnly++;
    else cohortMix.noCast++;
    tierMix[chaosTierOf(u.chaos, cfg)]++;
  }
  console.log(`\n── REAL population (${users.length} non-bot users) ──`);
  console.log(`  cohort: ${JSON.stringify(cohortMix)}`);
  console.log(`  chaos tier: ${JSON.stringify(tierMix)}`);

  if (users.length >= REAL_MIN) {
    const c = tally();
    for (const u of users) {
      const tier = chaosTierOf(u.chaos, cfg);
      for (let n = 0; n < NIGHTS; n++)
        record(
          c,
          rollNightlyDreamType({ hasSelf: u.hasSelf, hasPlusOne: u.hasPlusOne, tier, cfg })
        );
    }
    report('REAL population', c);
  } else {
    console.log(
      `  (only ${users.length} users — below ${REAL_MIN}, skipping real sim; see synthetic scenarios)`
    );
  }

  // ── synthetic projection scenarios (cast-adoption mix is the dominant lever) ──
  const scenarios = [
    { label: 'A Expected  (15/35/50)', mix: { noCast: 0.15, selfOnly: 0.35, selfPlusOne: 0.5 } },
    { label: 'B High +1   (10/25/65)', mix: { noCast: 0.1, selfOnly: 0.25, selfPlusOne: 0.65 } },
    { label: 'C Low adopt (30/40/30)', mix: { noCast: 0.3, selfOnly: 0.4, selfPlusOne: 0.3 } },
    { label: 'D All self+1 (0/0/100)', mix: { noCast: 0, selfOnly: 0, selfPlusOne: 1 } },
  ];
  console.log(
    `\n── SYNTHETIC projections (${SYN_POP.toLocaleString()} users × ${NIGHTS} nights) ──`
  );
  for (const s of scenarios) {
    const c = tally();
    for (let u = 0; u < SYN_POP; u++) {
      const r = Math.random();
      const hasSelf = r >= s.mix.noCast;
      const hasPlusOne = r >= s.mix.noCast + s.mix.selfOnly;
      const tier = chaosTierOf(sampleChaos(), cfg);
      for (let n = 0; n < NIGHTS; n++)
        record(c, rollNightlyDreamType({ hasSelf, hasPlusOne, tier, cfg }));
    }
    report(s.label, c);
  }
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
