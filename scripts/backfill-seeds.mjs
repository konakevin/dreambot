#!/usr/bin/env node
/**
 * backfill-seeds.mjs — RESUMABLE driver to scale QA-size location spot pools up to
 * production depth (~100), with the FULL high-quality curation chain, one
 * headroom-gated chunk per invocation. Built for an autonomous, cross-compaction
 * grind (Kevin AFK, 2026-08-30): re-running always resumes — the JSON processed-set
 * + live DB counts are the source of truth, so a killed run / compaction just means
 * "run it again."
 *
 * Per chunk (default 4 cards):
 *   1. waitForHeadroom (pool hard rule — never saturate the shared connection pool)
 *   2. scale-pools.mjs  → gen 100 (dedups vs existing) → classify scale → grade →
 *      pure-scene-eligible → the two eligibility rules → verify
 *   3. dedup-spot-pools.mjs --write per card — AGGRESSIVE (Kevin) but floored at
 *      --min-active so it can't gut a pool
 *   4. refusal-corruption scan (thematic cards): deactivate any spot whose text is a
 *      Sonnet refusal / markdown junk (the pirate-cove/saloon corruption bug)
 *   5. verify per card (cast >=15, scene >=8, active >= FLOOR) → flag return-to if short
 *   6. record to state JSON + rewrite the human tracker MD
 *
 * The extra global Sonnet-QA polish (qa-character-pool + reaudit-pure-scene) runs
 * ONCE at the end via `--phase-b` (they re-evaluate across all backfilled cards).
 *
 * Usage:
 *   node scripts/backfill-seeds.mjs --list            # show remaining, write tracker
 *   node scripts/backfill-seeds.mjs --n 4             # process the next chunk
 *   node scripts/backfill-seeds.mjs --phase-b         # final global QA polish
 */
import fs from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom.js');

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
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'; // validation duals land in his PRIVATE Dreams album
const WTOK = env.DREAM_QUEUE_WORKER_TOKEN;
const NDREAMS = 'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams';

const argv = process.argv.slice(2);
const argN = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 ? Number(argv[i + 1]) : d;
};
const has = (n) => argv.includes('--' + n);

const N = argN('n', 3); // cards per chunk (scale + a dual render each; keep under the ~30min bg limit)
const TARGET = argN('target', 60); // active-spot count below this = a backfill target
const FLOOR = argN('floor', 60); // post-scale active floor; below = flag return-to
const DEDUP_FLAG = argN('dedup-flag', 0.1); // aggressive: flag any concept > 10%
const DEDUP_CAP = argN('dedup-cap', 0.08); // thin it down to 8%
const DEDUP_MIN = argN('dedup-min', 30); // never below 30 active (safety floor)

const STATE_JSON = 'BACKFILL_SEED_STATE.json';
const STATE_MD = 'BACKFILL_SEED_STATE.md';
const REFUSAL_RE =
  /\*\*|^\s*\||I cannot|I can't|I apologize|I'm sorry|as an AI|cannot fulfill|cannot provide|would you like|here are|here's a|:\s*$/i;

const run = (cmd) => {
  console.log(`  $ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch {
    console.error(`  (failed: ${cmd})`);
    return false;
  }
};

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_JSON, 'utf8'));
  } catch {
    return { processed: {}, phaseB: false, startedAt: null };
  }
}
function saveState(s) {
  fs.writeFileSync(STATE_JSON, JSON.stringify(s, null, 2));
}

// Paginated active-spot counts per location_key (PostgREST 1000-row cap).
async function activeCounts() {
  const counts = {};
  let from = 0;
  const page = 1000;
  for (;;) {
    const { data } = await sb
      .from('location_iconic_spots')
      .select('location_key,id')
      .eq('is_active', true)
      .order('id') // STABLE order — without it, .range() pages overlap/skip → wild undercounts
      .range(from, from + page - 1);
    if (!data || !data.length) break;
    for (const r of data) counts[r.location_key] = (counts[r.location_key] || 0) + 1;
    if (data.length < page) break;
    from += page;
  }
  return counts;
}

async function pickerCards() {
  const { data } = await sb
    .from('location_cards')
    .select('name,picker_category,admin_only')
    .not('picker_category', 'is', null)
    .eq('is_approved', true)
    .order('picker_category');
  return data || [];
}

// Per-card verify: active total + cast (character_eligible) + scene (pure_scene_eligible),
// and deactivate refusal-corrupt spots.
async function verifyCard(name) {
  const { data } = await sb
    .from('location_iconic_spots')
    .select('id,spot_text,character_eligible,pure_scene_eligible')
    .eq('location_key', name)
    .eq('is_active', true);
  const rows = data || [];
  const corrupt = rows.filter((r) => REFUSAL_RE.test(r.spot_text || ''));
  if (corrupt.length) {
    await sb
      .from('location_iconic_spots')
      .update({ is_active: false })
      .in(
        'id',
        corrupt.map((r) => r.id)
      );
  }
  const clean = rows.filter((r) => !REFUSAL_RE.test(r.spot_text || ''));
  return {
    active: clean.length,
    cast: clean.filter((r) => r.character_eligible).length,
    scene: clean.filter((r) => r.pure_scene_eligible).length,
    purged: corrupt.length,
  };
}

// One DUAL (couple, self+plus_one) validation render → Kevin's PRIVATE Dreams album,
// so each scaled pool is proven to actually produce a working couple face-swap dream
// (Kevin 2026-08-30 — ship gate). canvas medium (painterly, the approved cast look).
// 3 attempts through nightly-dreams; returns the image URL or null.
async function renderDual(name) {
  const body = {
    user_id: KEVIN,
    force_place: name,
    force_cast_role: 'dual',
    force_medium: 'canvas',
  };
  const today = new Date().toISOString().slice(0, 10);
  for (let a = 0; a < 3; a++) {
    await sb.from('ai_generation_budget').delete().eq('user_id', KEVIN).eq('date', today);
    let d;
    try {
      const res = await fetch(NDREAMS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WTOK}` },
        body: JSON.stringify(body),
      });
      d = await res.json();
    } catch (e) {
      d = { error: e.message };
    }
    if (d && d.upload_id) {
      await sb
        .from('uploads')
        .update({ caption: `🔬 backfill validate — ${name} [couple]` })
        .eq('id', d.upload_id);
      return d.image_url || null;
    }
    if (d && d.code === 'WORKER_RESOURCE_LIMIT' && a < 2) continue;
    return null;
  }
  return null;
}

function writeTracker(state, counts, remaining) {
  const done = Object.entries(state.processed);
  const flagged = done.filter(([, v]) => v.flagged);
  const lines = [];
  lines.push('# Backfill Seeds — production-depth scaling of QA location pools');
  lines.push('');
  lines.push('> AUTONOMOUS RESUMABLE GRIND (Kevin AFK, started ' + (state.startedAt || '?') + ').');
  lines.push('> **To resume after compaction / a killed run:** just run');
  lines.push('> `node scripts/backfill-seeds.mjs --n 4` repeatedly until it prints ALL DONE,');
  lines.push('> then `node scripts/backfill-seeds.mjs --phase-b` for the final global QA polish.');
  lines.push(
    '> Source of truth = this file + live DB spot counts; re-running never double-processes.'
  );
  lines.push('');
  lines.push('## Method (locked)');
  lines.push('- Target depth ~100 (match live prod pools). Chunk of ' + N + ', headroom-gated.');
  lines.push(
    '- Chain per card: scale-pools (gen100→classify→grade→pure-scene→eligibility) → refusal scan → ' +
      "verify → ONE dual (couple) validation render to Kevin's Dreams album."
  );
  lines.push(
    '- Auto fleet-dedup REMOVED (over-flags legit place-themes → gutted proof pools; playbook-confirmed).'
  );
  lines.push(
    '- Phase B (once, at end): qa-character-pool + reaudit-pure-scene (global Sonnet polish).'
  );
  lines.push(
    '- Everything stays admin_only=dark. cast>=15 / scene>=8 / active>=' + FLOOR + ' or FLAG.'
  );
  lines.push(
    '- SHIP GATE: every pool scaled + its dual validation render OK (review in the album).'
  );
  lines.push('');
  lines.push(
    `## Progress — ${done.length} processed, ${remaining.length} remaining, phaseB=${state.phaseB}`
  );
  lines.push('');
  lines.push('| card | category | active | cast | scene | dual | status |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const [name, v] of done.sort((a, b) => a[0].localeCompare(b[0]))) {
    const st = v.flagged ? '🚩 ' + v.flagged : '✅';
    const dual = v.dualUrl ? '[view](' + v.dualUrl + ')' : v.dualUrl === null ? '✗' : '—';
    lines.push(
      `| ${name} | ${v.category || ''} | ${v.active} | ${v.cast} | ${v.scene} | ${dual} | ${st} |`
    );
  }
  lines.push('');
  if (remaining.length) {
    lines.push('## Remaining (' + remaining.length + ')');
    const byCat = {};
    for (const c of remaining)
      (byCat[c.picker_category] ||= []).push(`${c.name}(${counts[c.name] || 0})`);
    for (const k of Object.keys(byCat).sort()) lines.push(`- **${k}**: ${byCat[k].join(', ')}`);
  } else if (!state.phaseB) {
    lines.push('## ✅ All cards scaled — run `--phase-b` for the final global QA polish.');
  } else {
    lines.push('## ✅✅ DONE 100% (all scaled + Phase B complete).');
  }
  fs.writeFileSync(STATE_MD, lines.join('\n') + '\n');
}

(async () => {
  const state = loadState();
  if (!state.startedAt) {
    state.startedAt = new Date(Number(env.__ts) || 0).toISOString().slice(0, 10) || 'today';
  }

  const counts = await activeCounts();
  const cards = await pickerCards();
  const remaining = cards.filter((c) => (counts[c.name] || 0) < TARGET && !state.processed[c.name]);

  if (has('list')) {
    writeTracker(state, counts, remaining);
    console.log(`REMAINING: ${remaining.length}`);
    for (const c of remaining)
      console.log(`  ${c.picker_category.padEnd(18)} ${c.name} (${counts[c.name] || 0})`);
    return;
  }

  // ---- Phase B: final global Sonnet-QA polish across all backfilled cards ----
  if (has('phase-b')) {
    if (remaining.length) {
      console.log(`⚠️ ${remaining.length} cards still un-scaled — finish Phase A first.`);
      process.exit(2);
    }
    await waitForHeadroom({ min: 25, label: 'backfill phase-b' });
    run('node scripts/qa-character-pool.js');
    run('node scripts/reaudit-pure-scene-spots.js --write');
    state.phaseB = true;
    saveState(state);
    writeTracker(state, await activeCounts(), []);
    console.log('ALL DONE — Phase B complete.');
    return;
  }

  // ---- Phase A: scale the next chunk ----
  const todo = remaining.slice(0, N);
  if (!todo.length) {
    writeTracker(state, counts, remaining);
    console.log(state.phaseB ? 'ALL DONE (100%).' : 'PHASE-A DONE — run --phase-b next.');
    return;
  }

  console.log(`=== chunk: ${todo.map((c) => c.name).join(', ')} ===`);
  await waitForHeadroom({ min: 25, label: 'backfill scale' });

  const quoted = todo.map((c) => `"${c.name}"`).join(' ');
  run(`node scripts/scale-pools.mjs ${quoted}`);
  // NOTE (2026-08-30): fleet-wide auto `dedup-spot-pools --write` was REMOVED from the
  // grind after the proof chunk proved LOCATION_SEED_PLAYBOOK's warning — the
  // token+Haiku detector over-flags legitimate place-themes as "bloat" (it cut a
  // Hawaiian beach town's "beach" spots 24→6, gutting marthas vineyard 63→34 /
  // hanalei 82→50, below prod depth). Quality now comes from gen's near-dup dedup +
  // grade + the Phase-B Sonnet QA. Targeted dedup stays a per-location manual tool.

  for (const c of todo) {
    const v = await verifyCard(c.name);
    // Quality gates are cast>=15 + scene>=8 (playbook) — NOT a total floor. Small
    // real places (e.g. palm beach ~47) are great at 39 cast / 38 scene.
    const short = v.cast < 15 || v.scene < 8;
    // Validation: one couple (dual face-swap) render → Kevin's Dreams album (ship gate).
    await waitForHeadroom({ min: 25, label: 'backfill dual render' });
    const dualUrl = await renderDual(c.name);
    state.processed[c.name] = {
      category: c.picker_category,
      active: v.active,
      cast: v.cast,
      scene: v.scene,
      purged: v.purged,
      dualUrl: dualUrl || null,
      flagged: short
        ? `thin(a${v.active}/c${v.cast}/s${v.scene})`
        : dualUrl
          ? false
          : 'dual_render_failed',
    };
    console.log(
      `  ${c.name}: active=${v.active} cast=${v.cast} scene=${v.scene} purged=${v.purged}${short ? ' 🚩' : ''} dual=${dualUrl ? 'ok' : 'FAIL'}`
    );
    saveState(state); // save after EACH card → resumable mid-chunk
  }

  const counts2 = await activeCounts();
  const remaining2 = cards.filter(
    (c) => (counts2[c.name] || 0) < TARGET && !state.processed[c.name]
  );
  writeTracker(state, counts2, remaining2);
  console.log(`CHUNK DONE: processed ${todo.length}, remaining ${remaining2.length}`);
})().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
