#!/usr/bin/env node
/**
 * replay-nightly-seed.js — render-test a seed rewrite BEFORE any pool row changes (NIGHTLY_POOL_PLAYBOOK.md, "Render
 * test"). Replays one of KEVIN's logged nightlies through the real nightly-dreams with its exact slot input
 * (force_slot_input), same model and cast role, with the seed text swapped in. Run the original text as arm "orig" and
 * the rewrite as arm "new" on the same template, and only the seed differs.
 *
 *   node scripts/replay-nightly-seed.js <items.json> <outdir>
 *   items: [{ "id": "<upload_id of a Kevin nightly>", "arm": "orig"|"new", "rep": 1, "seed": "<seed text>",
 *             "place": "<location_key, location spot tests only>", "test": "<label>" }]
 *
 * Writes <outdir>/rows.json in the composition audit's row format; tag it with
 *   node scripts/audit-nightly-composition.js tag --out <outdir>
 * Re-running skips rows already in rows.json (key: template + arm + rep + test). One stream renders serially; run at
 * most 3 streams at once (CLAUDE.md pool-headroom rule; every render waits for headroom first).
 *
 * TEMPLATE HYGIENE (2026-10-02): the template's slot input carries ITS OWN look text and action into every render.
 * A template from before the 2026-09-18 restore point can carry a look that is now switched off (Technicolor came out
 * as a generic photograph) or an action that turns the couple toward each other ("mid-laugh at something between
 * them"). Pick recent templates whose look is still nightly_enabled; this script warns when it is not.
 * Renders land in Kevin's account as QA (captioned "QA audit replay ..."). Never point it at another user.
 */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const [itemsArg, outArg] = process.argv.slice(2);
if (!itemsArg || !outArg) {
  console.error('usage: node scripts/replay-nightly-seed.js <items.json> <outdir>');
  process.exit(1);
}
// Resolve the paths BEFORE moving to the repo root (relative paths broke once: the harness chdirs).
const itemsFile = path.resolve(itemsArg);
const outDir = path.resolve(outArg);
process.chdir(ROOT);
require('dotenv').config({ path: path.join(ROOT, '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const sb = createClient(SB_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const WORKER = process.env.DREAM_QUEUE_WORKER_TOKEN;
fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// settingClauseOf (_shared/sceneHook.ts): first sentence, first comma-clause, 12 words.
const settingClauseOf = (s) =>
  ((String(s).split(/[;.]/)[0] || '').split(',')[0] || '')
    .trim()
    .split(/\s+/)
    .slice(0, 12)
    .join(' ')
    .trim();

async function logOf(uploadId) {
  for (let i = 0; i < 10; i++) {
    const { data } = await sb
      .from('ai_generation_log')
      .select('model_used,fallback_reasons,rolled_axes,enhanced_prompt,user_id,created_at')
      .eq('upload_id', uploadId)
      .limit(1);
    if (data && data[0]) return data[0];
    await sleep(3000);
  }
  return null;
}

const warned = new Set();
async function warnTemplate(id, src) {
  if (warned.has(id)) return;
  warned.add(id);
  const look = src.rolled_axes && src.rolled_axes.medium;
  if (look) {
    const { data } = await sb
      .from('dream_mediums')
      .select('nightly_enabled')
      .eq('key', look)
      .limit(1);
    if (data && data[0] && data[0].nightly_enabled === false)
      console.log(
        `⚠ template ${id}: its look ${look} is switched off for nightly; renders will not look like production`
      );
  }
  if (src.created_at && src.created_at < '2026-09-18')
    console.log(
      `⚠ template ${id}: made ${src.created_at.slice(0, 10)}, before the 2026-09-18 restore point`
    );
}

(async () => {
  const items = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));
  const file = path.join(outDir, 'rows.json');
  const rows = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  for (const it of items) {
    const done = rows.some(
      (r) =>
        r.src === it.id &&
        r.arm === it.arm &&
        r.rep === (it.rep || 0) &&
        (r.test || null) === (it.test || null)
    );
    if (done) continue;
    const src = await logOf(it.id);
    if (!src || src.user_id !== KEVIN) {
      console.log(`✗ ${it.id}: not a Kevin render`);
      continue;
    }
    const ax = src.rolled_axes || {};
    const si = ax.observability && ax.observability.slotInput;
    if (!si) {
      console.log(`✗ ${it.id}: no slotInput`);
      continue;
    }
    await warnTemplate(it.id, src);
    const seed = ax.seedSource || {};
    const slotInput = { ...si };
    if (it.seed) {
      slotInput.iconicAnchor = it.seed;
      if (si.setAtOverride) slotInput.setAtOverride = settingClauseOf(it.seed);
    }
    // A location spot test also moves the place card the spot belongs to.
    if (it.place) slotInput.userPlace = it.place;
    const roles = ax.castRoles || [];
    const castRole = roles.length === 2 ? 'dual' : roles[0] || 'self';
    const holiday = seed.kind && seed.kind.startsWith('holiday:') ? seed.kind.slice(8) : null;
    const body = {
      user_id: KEVIN,
      force_slot_input: slotInput,
      force_model: src.model_used,
      force_cast_role: castRole,
      ...(holiday
        ? { force_holiday_scene: holiday, force_holiday_sub_theme: seed.subTheme }
        : { force_no_holiday: true }),
    };
    await waitForHeadroom({ min: 25, label: `replay:${it.arm}` });
    const today = new Date().toISOString().slice(0, 10);
    await sb.from('ai_generation_budget').delete().eq('user_id', KEVIN).eq('date', today);
    const t0 = Date.now();
    let data;
    try {
      const res = await fetch(`${SB_URL}/functions/v1/nightly-dreams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WORKER}` },
        body: JSON.stringify(body),
      });
      data = JSON.parse(await res.text());
      if (!res.ok) throw new Error(data.error || `http ${res.status}`);
    } catch (e) {
      console.log(`✗ ${it.arm} ${it.id}: ${e.message}`);
      continue;
    }
    const log = await logOf(data.upload_id);
    await sb
      .from('uploads')
      .update({ caption: `QA audit replay ${it.arm}: ${seed.subTheme || seed.kind}` })
      .eq('id', data.upload_id);
    const fr = (log && log.fallback_reasons) || [];
    const lax = (log && log.rolled_axes) || {};
    const row = {
      id: data.upload_id,
      url: data.image_url,
      src: it.id,
      arm: it.arm,
      rep: it.rep || 0,
      who: 'kevin',
      cast: roles.length === 2 ? 'couple' : 'solo',
      kind: seed.kind,
      sub: seed.subTheme,
      scene: it.seed || si.iconicAnchor,
      test: it.test || null,
      model: ((log && log.model_used) || '').replace(/^.*\//, ''),
      swap: lax.faceSwapResult,
      // the seed actually reached the prompt (a forced input that silently falls back proves nothing)
      carried: !!(
        log &&
        log.enhanced_prompt &&
        log.enhanced_prompt.includes(settingClauseOf(slotInput.iconicAnchor).slice(0, 30))
      ),
      stamps: fr.filter((s) =>
        /qa:force_slot_input|looks_minimal|solo_action_early|dual|degrade|rebuilt|swap|identity|couple_engine/.test(
          s
        )
      ),
      secs: Math.round((Date.now() - t0) / 1000),
    };
    rows.push(row);
    fs.writeFileSync(file, JSON.stringify(rows, null, 1));
    console.log(
      `✅ ${it.arm} ${seed.subTheme || seed.kind} (${row.secs}s) ${row.model} swap=${row.swap} carried=${row.carried} | ${row.stamps.join(' ')}`
    );
  }
})().catch((e) => {
  console.error('Fatal', e.message);
  process.exit(1);
});
