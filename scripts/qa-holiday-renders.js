#!/usr/bin/env node
/**
 * qa-holiday-renders.js — QA the WHOLE holiday nightly loop on Kevin's real account, under the live
 * "1.2.0 with looks" engine (HOLIDAY_DREAMS_PLAN.md + HOLIDAY_DAY_OF_PLAN.md).
 *
 * Two modes, because the engine treats them completely differently:
 *   --mode=window   force_holiday_scene=<season>  → an IN-WINDOW holiday dream. The look and vibe still come from
 *                   the looks catalogue; only the scene/attire/sub-theme come from the holiday pools. No overlay
 *                   (engine_config.holiday_postcard_scope = 'day_of').
 *   --mode=day-of   force_day_of=<season>         → the DAY-OF takeover. Scenes draw 100% from the reserved
 *                   <key>_day_of pool, the look is PINNED from holidays.day_of_look_keys, the model is re-fitted
 *                   to that look's own allowed_models, and the postcard overlay is composited.
 *
 * Three surfaces per season: dual-cast (Path 1 dual), solo-cast (Path 1 solo), scene-only (Path 2).
 *
 *   node scripts/qa-holiday-renders.js --mode day-of --season halloween --per 2
 *   node scripts/qa-holiday-renders.js --mode window --season both --per 1
 *
 * Renders are REAL dreams on Kevin's account (review them in the app). Serial, and gated on Postgres connection
 * headroom before every render — a direct nightly-dreams call holds a connection for 20-150 s (CLAUDE.md).
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'; // Kevin
const WORKER = process.env.DREAM_QUEUE_WORKER_TOKEN;
const sb = createClient(SB_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const has = (n) => process.argv.includes('--' + n);
const PER = parseInt(arg('per', '1'), 10);
const SEASON = arg('season', 'both');
const MODE = arg('mode', 'window');
const TAG = arg('tag', MODE);
const DAY_OF_LOOK = arg('day-of-look', null);
const seasons = SEASON === 'both' ? ['halloween', 'fall'] : SEASON.split(',');
const ALL_SURFACES = [
  { label: 'dual-cast', cast: 'dual' },
  { label: 'solo-cast', cast: 'self' },
  { label: 'scene-only', cast: null },
];
const SURFACES = arg('surfaces', null)
  ? ALL_SURFACES.filter((s) => String(arg('surfaces', '')).split(',').includes(s.label))
  : ALL_SURFACES;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** Stamps worth pulling out of fallback_reasons — the ones that prove each fix is live. */
const WATCH = [
  'looks_minimal:',
  'day_of_look',
  'day_of_model_ban',
  'pin_model_fit',
  'look_medium_ban',
  'model_restrict',
  'scene_medium',
  'postcard:',
  'holiday_day_of_empty',
  'look_source:',
  'look_family:',
  'policy:',
  'model_roll:',
  'vibe:',
  'holiday',
];

async function logFor(uploadId) {
  for (let i = 0; i < 8; i++) {
    const { data } = await sb
      .from('ai_generation_log')
      .select('model_used,fallback_reasons,rolled_axes')
      .eq('upload_id', uploadId)
      .limit(1);
    if (data && data[0]) return data[0];
    await sleep(3000);
  }
  return null;
}

(async () => {
  if (!WORKER) {
    console.error('Missing DREAM_QUEUE_WORKER_TOKEN (.env.local)');
    process.exit(2);
  }
  if (!['window', 'day-of'].includes(MODE)) {
    console.error(`--mode must be window | day-of (got "${MODE}")`);
    process.exit(2);
  }
  const results = [];
  for (const season of seasons) {
    for (const surf of SURFACES) {
      for (let i = 0; i < PER; i++) {
        const label = `${season}/${surf.label}#${i + 1}`;
        await waitForHeadroom({ min: 25, label: `holiday:${label}` });
        const today = new Date().toISOString().slice(0, 10);
        await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);

        // force_day_of ignores date + is_active and turns the day-of takeover on; force_holiday_scene puts the
        // season in-window at 100% with NO day-of pin. Scene-only uses force_pure_scene (Path 2).
        const seasonFlag =
          MODE === 'day-of' ? { force_day_of: season } : { force_holiday_scene: season };
        const body = {
          user_id: USER_ID,
          ...seasonFlag,
          // NEVER force_face_swap_eligible here: firstDreamMediumMode() reads it as "this is a first dream"
          // and restricts the medium pool to the 7 curated first-dream styles, which silently defeats the
          // day-of look pin (the look resolves to canvas). force_cast_role alone picks the surface.
          ...(surf.cast === null ? { force_pure_scene: true } : { force_cast_role: surf.cast }),
          // --day-of-look=<key>: pin ONE of the holiday's curated looks instead of rolling among them, so a
          // specific look (e.g. halloween_digital_painting, the only one that excludes flux-1.1-pro) can be tested.
          ...(DAY_OF_LOOK ? { force_day_of_look: DAY_OF_LOOK } : {}),
        };
        const t0 = Date.now();
        let data;
        try {
          const res = await fetch(`${SB_URL}/functions/v1/nightly-dreams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WORKER}` },
            body: JSON.stringify(body),
          });
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch {
            console.log(`  ✗ ${label}: non-JSON ${res.status}: ${text.slice(0, 140)}`);
            results.push({ season, surface: surf.label, ok: false, error: `http ${res.status}` });
            continue;
          }
          if (!res.ok) {
            console.log(`  ✗ ${label}: ${data.error || res.status}`);
            results.push({
              season,
              surface: surf.label,
              ok: false,
              error: String(data.error || res.status),
            });
            continue;
          }
        } catch (e) {
          console.log(`  ✗ ${label}: ${e.message}`);
          results.push({ season, surface: surf.label, ok: false, error: e.message });
          continue;
        }
        const secs = ((Date.now() - t0) / 1000).toFixed(0);
        const log = data.upload_id ? await logFor(data.upload_id) : null;
        const stamps = (log && log.fallback_reasons) || [];
        const watched = stamps.filter((s) => WATCH.some((w) => String(s).startsWith(w)));
        let up = null;
        if (data.upload_id) {
          await sb
            .from('uploads')
            .update({ caption: `QA ${TAG}: ${season} ${surf.label}` })
            .eq('id', data.upload_id);
          const { data: u } = await sb
            .from('uploads')
            .select('id,image_url,dream_medium,dream_vibe,model,face_swap_mode,postcard_pending')
            .eq('id', data.upload_id)
            .single();
          up = u;
        }
        const postcard = stamps.find((s) => String(s).startsWith('postcard:')) || null;
        console.log(
          `  ✅ ${label} (${secs}s) | look=${(up && up.dream_medium) || data.resolved_medium || '?'} | vibe=${(up && up.dream_vibe) || '?'} | model=${((log && log.model_used) || '?').split('/').pop()} | swap=${(up && up.face_swap_mode) || '-'} | holiday=${data.holiday || '-'} | postcard=${postcard || '-'}`
        );
        if (watched.length) console.log(`     stamps: ${watched.join(' · ')}`);
        console.log(`     ${data.image_url}`);
        results.push({
          season,
          surface: surf.label,
          mode: MODE,
          ok: true,
          secs: Number(secs),
          url: data.image_url,
          upload_id: data.upload_id,
          look: (up && up.dream_medium) || data.resolved_medium || null,
          vibe: (up && up.dream_vibe) || null,
          model: (log && log.model_used) || null,
          face_swap_mode: (up && up.face_swap_mode) || null,
          postcard,
          postcard_pending: up ? up.postcard_pending : null,
          holiday: data.holiday || null,
          stamps: watched,
        });
      }
    }
  }
  const okRows = results.filter((r) => r.ok);
  const outDir = path.join(os.homedir(), 'Desktop');
  const page = path.join(outDir, `holiday-qa-${TAG}.html`);
  const card = (r) => `
    <div class="c">
      <img src="${r.url}" loading="lazy">
      <div class="m"><b>${r.season} · ${r.surface}</b> · ${r.secs}s
        <div>look <code>${r.look || '?'}</code></div>
        <div>vibe <code>${r.vibe || '?'}</code></div>
        <div>model <code>${(r.model || '?').split('/').pop()}</code> · swap <code>${r.face_swap_mode || '-'}</code></div>
        <div>postcard <code>${r.postcard || '-'}</code>${r.postcard_pending ? ' <b style="color:#b00">PENDING</b>' : ''}</div>
        <div class="s">${(r.stamps || []).join(' · ')}</div>
      </div>
    </div>`;
  fs.writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8"><title>Holiday QA ${TAG}</title>
<style>body{font:13px -apple-system,sans-serif;background:#111;color:#eee;margin:16px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.c{background:#1c1c1c;border-radius:10px;overflow:hidden}img{width:100%;display:block}
.m{padding:8px 10px;line-height:1.5}code{color:#9cf}.s{color:#888;font-size:11px;margin-top:6px;word-break:break-word}
h1{font-size:16px}</style>
<h1>Holiday QA — ${TAG} (${okRows.length}/${results.length} rendered)</h1>
<div class="g">${okRows.map(card).join('')}</div>`
  );
  const jsonOut = path.join(outDir, `holiday-qa-${TAG}.json`);
  fs.writeFileSync(jsonOut, JSON.stringify(results, null, 2));
  console.log(`\n━━━ ${okRows.length}/${results.length} holiday QA renders (${MODE}) ━━━`);
  console.log(`page: ${page}`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
