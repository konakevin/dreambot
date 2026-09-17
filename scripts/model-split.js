#!/usr/bin/env node
/**
 * model-split.js — see and change which models render nightly dreams, and in what proportion.
 *
 *   node scripts/model-split.js                        # show every surface
 *   node scripts/model-split.js --surface solo \
 *        --set "flux-1.1-pro=70,gemini-2-image=15,seedream-4.5=15"
 *   node scripts/model-split.js --surface couple --set "flux-1.1-pro=75,gemini-2-image=25"
 *
 * WHY IT EXISTS. The split lived in a TypeScript constant (PRIMARY_DIRECT_SHARE), so changing any model's
 * share meant an edit and a deploy — done three times in one evening. Meanwhile
 * `nightly_model_policy.primary_weights` sat in the database, already set deliberately, and the live path
 * IGNORED it: couple read 51/49 in the dashboard while rendering 75/25. The control surface lied.
 *
 * As of 2026-09-17 the roll is weighted on those DB weights, so the number you set here IS the share that
 * renders — locked by __tests__/lib/modelWeightDeterminism.test.ts, which drives the real roll over 60k
 * samples and asserts the observed distribution matches. No deploy, no code change.
 *
 * Weights are RATIOS, not percentages — 3/1 and 75/25 are the same split. A weight of 0 benches a model
 * without removing it from the row, which is the safe way to pull something that is misbehaving.
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const argv = process.argv.slice(2);
const flag = (n) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null;
};
const SURFACE = flag('surface');
const SET = flag('set');

const short = (m) => String(m).replace(/^.*\//, '');
const bar = (pct) => '█'.repeat(Math.round(pct / 2.5)).padEnd(40);

/** What the engine will actually roll, given a row. Mirrors weightedList: a missing/short/all-zero weights
 *  array means equal weights, which is why an unconfigured row is an even split rather than a silent skew. */
function shares(models, weights) {
  const usable =
    Array.isArray(weights) &&
    weights.length >= models.length &&
    weights.some((w) => Number.isFinite(w) && w > 0);
  const w = models.map((_, i) => (usable ? Math.max(0, Number(weights[i]) || 0) : 1));
  const total = w.reduce((a, b) => a + b, 0);
  return models.map((m, i) => ({
    model: m,
    weight: w[i],
    pct: total > 0 ? (w[i] / total) * 100 : 100 / models.length,
    configured: usable,
  }));
}

async function show() {
  const { data, error } = await sb
    .from('nightly_model_policy')
    .select('surface, primary_models, primary_weights, fallback_models')
    .order('surface');
  if (error) {
    console.error('could not read nightly_model_policy:', error.message);
    process.exit(1);
  }
  console.log('\nNIGHTLY MODEL SPLIT — what renders, and how often\n');
  for (const row of data || []) {
    const s = shares(row.primary_models || [], row.primary_weights);
    const note = s.length && !s[0].configured ? '  (no weights set → even split)' : '';
    console.log(`  ${row.surface}${note}`);
    for (const x of s) {
      console.log(
        `    ${short(x.model).padEnd(22)} ${x.pct.toFixed(1).padStart(5)}%  ${bar(x.pct)} w=${x.weight}`
      );
    }
    if ((row.fallback_models || []).length) {
      console.log(`    fallback: ${(row.fallback_models || []).map(short).join(', ')}`);
    }
    console.log('');
  }
  console.log('  Weights are RATIOS. Change one with:');
  console.log(
    '    node scripts/model-split.js --surface solo --set "flux-1.1-pro=70,gemini-2-image=15,seedream-4.5=15"\n'
  );
  console.log('  A weight of 0 benches a model without removing it from the row.\n');
}

async function apply() {
  const { data: rows } = await sb
    .from('nightly_model_policy')
    .select('surface, primary_models, primary_weights')
    .eq('surface', SURFACE);
  const row = rows && rows[0];
  if (!row) {
    console.error(`no policy row for surface "${SURFACE}"`);
    process.exit(1);
  }

  // "name=weight,name=weight" — names may be short (flux-1.1-pro) or fully qualified.
  const wanted = new Map();
  for (const part of SET.split(',')) {
    const [name, w] = part.split('=').map((x) => x.trim());
    if (!name || w === undefined || !Number.isFinite(Number(w))) {
      console.error(`could not parse "${part}" — expected name=weight`);
      process.exit(1);
    }
    wanted.set(name, Number(w));
  }

  // Resolve each name against the row's models, so a typo FAILS rather than silently doing nothing.
  const models = [...row.primary_models];
  const weights = [];
  const unmatched = new Set(wanted.keys());
  for (const m of models) {
    let hit;
    for (const [name] of wanted) {
      if (m === name || short(m) === name || short(m) === short(name)) {
        hit = name;
        break;
      }
    }
    if (hit === undefined) {
      console.error(`\n✗ "${short(m)}" is in the ${SURFACE} row but got no weight.`);
      console.error('  Give every model a weight (use 0 to bench one), so the split is never implicit.\n');
      process.exit(1);
    }
    weights.push(wanted.get(hit));
    unmatched.delete(hit);
  }
  if (unmatched.size) {
    console.error(`\n✗ not in the ${SURFACE} row: ${[...unmatched].join(', ')}`);
    console.error(`  row has: ${models.map(short).join(', ')}`);
    console.error('  To ADD a model, add it to primary_models first — this tool only re-weights.\n');
    process.exit(1);
  }
  if (weights.every((w) => w === 0)) {
    console.error('\n✗ every weight is 0 — that would leave nothing to render.\n');
    process.exit(1);
  }

  const before = shares(models, row.primary_weights);
  const after = shares(models, weights);
  console.log(`\n${SURFACE}:\n`);
  models.forEach((m, i) => {
    console.log(
      `  ${short(m).padEnd(22)} ${before[i].pct.toFixed(1).padStart(5)}%  →  ${after[i].pct.toFixed(1).padStart(5)}%`
    );
  });

  const { error } = await sb
    .from('nightly_model_policy')
    .update({ primary_weights: weights })
    .eq('surface', SURFACE);
  if (error) {
    console.error('\nupdate failed:', error.message);
    process.exit(1);
  }
  console.log('\n✓ applied. Takes effect on the next render — no deploy needed.\n');
}

(SET && SURFACE ? apply() : show()).catch((e) => {
  console.error('model-split crashed:', e.message);
  process.exit(1);
});
