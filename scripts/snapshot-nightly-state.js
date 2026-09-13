#!/usr/bin/env node
/**
 * snapshot-nightly-state.js — freeze the ENTIRE nightly looks-path state (code switches + the DB rows that steer
 * it) into one named JSON file, so any state Kevin liked can be returned to exactly and verifiably.
 *
 * A nightly "state" is not just the code: it is the code switches PLUS engine_config PLUS the model policy PLUS
 * the look approvals. Git alone restores a third of it. This writes all three sides to nightly-states/<name>.json
 * together with the commit SHA.
 *
 *   node scripts/snapshot-nightly-state.js save <name> ["note"]
 *   node scripts/snapshot-nightly-state.js diff <name>      # what differs from that snapshot right now
 *   node scripts/snapshot-nightly-state.js list
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'nightly-states');
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const s = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// the engine_config fields that shape how a nightly looks; everything else is plumbing
const CFG_FIELDS = [
  'nightly_looks_mode', 'nightly_looks_allowlist', 'nightly_enabled', 'couple_prompt_style', 'model_policy_mode',
  'dual_side_check_mode', 'face_swap_dual_rate', 'face_swap_self_rate', 'face_swap_share',
  'face_swap_share_with_plus_one', 'dream_art_share', 'dual_scene_goofy_pct', 'dual_scene_elegant_pct',
  'dual_scene_active_pct', 'single_scene_goofy_pct', 'single_scene_elegant_pct', 'single_scene_active_pct',
  'dual_action_pose_pct', 'location_action_pct', 'dual_closer_pct', 'nightly_legacy_look_pct',
  'nightly_look_recency', 'pro_trial_days',
];

const codeSwitches = () => {
  const out = {};
  for (const f of ['nightlyLooksPath.ts', 'nightlyStyle.ts', 'nightlyVibes.ts']) {
    const src = fs.readFileSync(path.join(ROOT, 'supabase/functions/_shared', f), 'utf8');
    for (const m of src.matchAll(/export const ([A-Z][A-Z0-9_]+)(?::[^=]+)? = ([^;]+);/g)) {
      out[`${f}:${m[1]}`] = m[2].replace(/\s+/g, ' ').trim().slice(0, 300);
    }
  }
  return out;
};

(async () => {
  const [cmd, name, note] = process.argv.slice(2);
  fs.mkdirSync(DIR, { recursive: true });
  if (cmd === 'list') {
    for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
      const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
      console.log(`  ${f.replace('.json', '').padEnd(28)} ${j.saved_at.slice(0, 16)}  ${j.commit.slice(0, 8)}  ${j.note || ''}`);
    }
    return;
  }
  if (!name) return console.log('usage: snapshot-nightly-state.js save|diff <name> ["note"]');
  const [{ data: cfg }, { data: policy }, { data: appr }, { data: looks }] = await Promise.all([
    s.from('engine_config').select(CFG_FIELDS.join(',')).single(),
    s.from('nightly_model_policy').select('surface,primary_models,primary_weights,fallback_models').order('surface'),
    s.from('nightly_look_approvals').select('look_key,model,surface,approved').eq('approved', true).order('look_key'),
    s.from('dream_mediums').select('key,nightly_enabled').eq('nightly_look', true).order('key'),
  ]);
  const state = {
    name,
    note: note || '',
    saved_at: new Date().toISOString(),
    commit: execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(),
    code_switches: codeSwitches(),
    engine_config: cfg,
    model_policy: policy,
    approved_looks: (appr || []).map((a) => `${a.look_key}|${a.model}|${a.surface}`),
    catalog_enabled: (looks || []).filter((l) => l.nightly_enabled !== false).map((l) => l.key),
  };
  const file = path.join(DIR, `${name}.json`);
  if (cmd === 'save') {
    fs.writeFileSync(file, JSON.stringify(state, null, 2));
    console.log(`saved ${file}`);
    console.log(`  commit ${state.commit.slice(0, 8)} · ${Object.keys(state.code_switches).length} code switches · ${state.approved_looks.length} approved looks · ${state.catalog_enabled.length} enabled looks`);
    return;
  }
  if (cmd === 'diff') {
    if (!fs.existsSync(file)) return console.log(`no snapshot named ${name}`);
    const old = JSON.parse(fs.readFileSync(file, 'utf8'));
    let n = 0;
    const cmp = (label, a, b) => {
      const sa = JSON.stringify(a), sb = JSON.stringify(b);
      if (sa !== sb) { n++; console.log(`  ${label}\n      snapshot: ${sa}\n      now     : ${sb}`); }
    };
    console.log(`diff vs ${name} (saved ${old.saved_at.slice(0, 16)}, commit ${old.commit.slice(0, 8)}):`);
    if (old.commit !== state.commit) console.log(`  commit ${old.commit.slice(0, 8)} -> ${state.commit.slice(0, 8)}`);
    for (const k of new Set([...Object.keys(old.code_switches), ...Object.keys(state.code_switches)]))
      cmp(k, old.code_switches[k], state.code_switches[k]);
    for (const k of CFG_FIELDS) cmp(`engine_config.${k}`, old.engine_config[k], state.engine_config[k]);
    cmp('model_policy', old.model_policy, state.model_policy);
    const a = new Set(old.approved_looks), b = new Set(state.approved_looks);
    const gone = [...a].filter((x) => !b.has(x)), added = [...b].filter((x) => !a.has(x));
    if (gone.length || added.length) { n++; console.log(`  approvals: +${added.length} -${gone.length}`); }
    console.log(n ? `\n${n} difference(s).` : '\nidentical.');
  }
})();
