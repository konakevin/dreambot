#!/usr/bin/env node
/**
 * qa-nightly-exact.js — BIT-FOR-BIT nightly renders for the parity QA loop (Kevin 2026-09-12: "it is crucial that
 * the thing you are testing is bit for bit the same as what will drive users' nightly dreams").
 *
 * Each render is a real `dream_queue` job exactly as scripts/nightly-dreams.js enqueues it (source 'nightly',
 * payload {}, a per-user dedup_key) drained by the real dream-queue-worker (x-worker-sync, one job at a time)
 * into the real nightly-dreams render. No QA flags: the model, cast role, scene type, seeds, look, vibe, framing
 * and every retry are the engine's own rolls. The ONLY differences from a user's nightly: the user is on
 * engine_config.nightly_looks_allowlist (mig 515, the staged-rollout switch production will use) and
 * payload.qa_silent suppresses the dreamer notification so Kevin's phone is not pushed 14 times a round.
 *
 * Output matches scripts/qa-nightly-looks-path.js (report.json per round + the same Desktop page) so the round
 * tooling (round-stats.js, benchmark-page.js) reads it unchanged.
 *
 * Usage: node scripts/qa-nightly-exact.js --round=r1 --count=14
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [
      l.slice(0, l.indexOf('=')).trim(),
      l
        .slice(l.indexOf('=') + 1)
        .trim()
        .replace(/^"|"$/g, ''),
    ])
);
const SUPABASE_URL = env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const WORKER_TOKEN = env.DREAM_QUEUE_WORKER_TOKEN;
if (!WORKER_TOKEN) {
  console.error('DREAM_QUEUE_WORKER_TOKEN missing from .env.local');
  process.exit(1);
}
const ARGS = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const ROUND = String(ARGS.round || 'exact');
const COUNT = Number(ARGS.count || 1);
const USER = String(ARGS.user || KEVIN);
const OUT_DIR = `/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/looks/path-${ROUND}`;
fs.mkdirSync(OUT_DIR, { recursive: true });
const REPORT = path.join(OUT_DIR, 'report.json');
const DESKTOP_HTML = path.join(os.homedir(), 'Desktop', `nightly-looks-path-${ROUND}.html`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (e) => fs.unlink(dest, () => reject(e)));
  });
}
const stampVal = (stamps, prefix) => {
  const s = stamps.find((x) => x.startsWith(prefix));
  return s ? s.slice(prefix.length) : null;
};

/** Drain the queue synchronously with the real worker (held connection, one tick ≤ 150 s). */
async function kickWorkerSync() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/dream-queue-worker`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WORKER_TOKEN}`,
      'Content-Type': 'application/json',
      'x-worker-sync': '1',
    },
    body: '{}',
  });
  const text = await res.text();
  return { status: res.status, text: text.slice(0, 200) };
}

async function renderOne(n) {
  const dedup = `nightly:${USER}:qa-${ROUND}-${n}`;
  const start = Date.now();
  // 1. Enqueue EXACTLY like the cron (source, user_id, status, payload, dedup_key; weight/model by the DB).
  const { data: row, error } = await sb
    .from('dream_queue')
    .insert({
      source: 'nightly',
      user_id: USER,
      status: 'queued',
      payload: { qa_silent: true },
      dedup_key: dedup,
    })
    .select('id')
    .single();
  if (error) return { n, ok: false, error: `enqueue: ${error.message}` };
  const jobId = row.id;
  // 2. Drain with the real worker; poll the row until terminal (the worker's tick may hand back before persist).
  let job = null;
  const deadline = Date.now() + 6 * 60_000;
  let kicks = 0;
  while (Date.now() < deadline) {
    const { data } = await sb.from('dream_queue').select('*').eq('id', jobId).single();
    job = data;
    if (job && ['completed', 'failed', 'dead_letter', 'dead'].includes(job.status)) break;
    if (job && job.status === 'queued' && kicks < 3) {
      kicks++;
      const k = await kickWorkerSync();
      if (k.status !== 200) console.warn(`  worker kick ${k.status}: ${k.text}`);
      continue;
    }
    await sleep(5000);
  }
  const elapsed = Math.round((Date.now() - start) / 1000);
  if (!job || job.status !== 'completed' || !job.upload_id) {
    return {
      n,
      ok: false,
      elapsed_s: elapsed,
      status: job ? job.status : 'missing',
      error: job
        ? job.last_error || `status ${job.status} stage ${job.current_stage}`
        : 'queue row missing',
      queue_id: jobId,
    };
  }
  // 3. The upload + its engine log (same fields as the looks-path runner).
  const { data: up } = await sb
    .from('uploads')
    .select('id,image_url,caption,face_swap_mode,dream_medium,dream_vibe,model')
    .eq('id', job.upload_id)
    .single();
  let log = null;
  for (let i = 0; i < 8 && !log; i++) {
    const { data } = await sb
      .from('ai_generation_log')
      .select('model_used,fallback_reasons,rolled_axes,enhanced_prompt,sonnet_brief')
      .eq('upload_id', job.upload_id)
      .limit(1);
    log = data && data[0];
    if (!log) await sleep(3000);
  }
  const stamps = (log && log.fallback_reasons) || [];
  const prompt = (log && log.enhanced_prompt) || '';
  const modelUsed = (log && log.model_used) || up.model || null;
  const lookKey = stampVal(stamps, 'look:') || up.dream_medium;
  const vibeKey = stampVal(stamps, 'vibe:') || up.dream_vibe;
  const dreamType = log && log.rolled_axes && log.rolled_axes.dreamType;
  const surface =
    dreamType === 'face_swap_dual'
      ? 'couple'
      : dreamType && /face_swap/.test(dreamType)
        ? 'solo'
        : up.face_swap_mode === 'dual'
          ? 'couple'
          : up.face_swap_mode === 'single'
            ? 'solo'
            : 'scene';
  const sims = stamps.flatMap((s) => {
    const dual = /identity_sim:L([0-9.]+)\/R([0-9.]+)/.exec(s);
    if (dual) return [Number(dual[1]), Number(dual[2])];
    const solo = /identity_sim_solo:([0-9.]+)/.exec(s);
    return solo ? [Number(solo[1])] : [];
  });
  const fsr = (log && log.rolled_axes && log.rolled_axes.faceSwapResult) || '';
  const degraded =
    surface === 'couple'
      ? fsr !== 'dual-success'
      : surface === 'solo'
        ? stamps.some((s) => /solo_rebuild|faceless|swap_failed|SHIPPED_FACELESS/.test(s)) ||
          fsr === 'failed'
        : false;
  const caption = `✨ EXACT ${ROUND} #${n} [${(modelUsed || '').replace(/^.*\//, '')} · ${(lookKey || '').replace(/^nightly_/, '')} · ${vibeKey || 'no vibe'}]`;
  await sb.from('uploads').update({ caption }).eq('id', up.id);
  const local = path.join(OUT_DIR, `${surface}-${n}.jpg`);
  try {
    await download(up.image_url, local);
  } catch (e) {
    console.warn(`  ! download failed: ${e.message}`);
  }
  const checks = {
    looks_path_on: stamps.includes('looks_path:on'),
    allowlist: stamps.includes('looks_path:allowlist'),
    no_violation: !stamps.some((s) => s.startsWith('style_contract_violation')),
  };
  return {
    surface,
    n,
    ok: true,
    elapsed_s: elapsed,
    queue_id: jobId,
    upload_id: up.id,
    image_url: up.image_url,
    local,
    caption,
    model_used: modelUsed,
    look: lookKey,
    look_family: stampVal(stamps, 'look_family:'),
    vibe: vibeKey,
    vibe_family: stampVal(stamps, 'vibe_family:'),
    vibe_version: stampVal(stamps, 'vibe_version:'),
    frame: stampVal(stamps, 'frame:'),
    framing: stampVal(stamps, 'framing:'),
    geometry: stamps.includes('swap_geometry:natural') ? 'natural' : 'strict',
    stance: stampVal(stamps, 'dual_stance:'),
    dual_attempts: Number(stampVal(stamps, 'dual_attempts:') || 0) || null,
    strict_retry: stamps.some((s) => s.startsWith('swap_geometry_retry:strict')),
    action_fallback: stampVal(stamps, 'scene_action_fallback:'),
    identity_sims: sims,
    degraded,
    checks,
    stamps,
    prompt,
    brief: /SET DRESSER/.test((log && log.sonnet_brief) || '') ? 'set-dresser' : 'legacy',
    composer: /candid cinematic photograph|editorial cinematic photograph/.test(prompt)
      ? 'legacy-priors'
      : 'look-neutral',
    face_swap_result: fsr,
    dream_type: dreamType,
  };
}

function loadReport() {
  return fs.existsSync(REPORT) ? JSON.parse(fs.readFileSync(REPORT, 'utf8')) : { renders: [] };
}
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}
function buildHtml(report) {
  const cards = report.renders
    .sort((a, b) => a.n - b.n)
    .map((r) => {
      if (!r.ok)
        return `<section class="card"><h2>#${r.n}</h2><div class="bad">failed: ${esc(r.error)} (${esc(r.status)})</div></section>`;
      const sim = r.identity_sims.map((x) => x.toFixed(2)).join('/') || '—';
      const pose = r.stamps.includes('scene_action')
        ? 'scene-first beat'
        : r.stamps.includes('location_action')
          ? 'Option B beat'
          : r.stamps.some((s) => /active_scenario/.test(s))
            ? 'active row'
            : r.stamps.some((s) => s.startsWith('bespoke_pose'))
              ? 'bespoke pool pose'
              : 'pool pose';
      return `<section class="card ${r.degraded ? 'deg' : ''}"><header><h2>${esc(r.surface)} #${r.n}</h2><code>${esc((r.model_used || '').replace(/^.*\//, ''))} · ${esc(r.look)} (${esc(r.look_family)}) · ${esc(r.vibe)} (${esc(r.vibe_family)}${r.vibe_version ? ' · ' + esc(r.vibe_version) : ''})</code></header>
<a href="${esc(r.image_url)}" target="_blank"><img src="${esc(r.image_url)}" loading="lazy"></a>
<div class="meta">pose: ${esc(pose)}${r.stance ? ` (${esc(r.stance)})` : ''} · ${r.frame ? `frame ${esc(r.frame)} · ` : ''}framing ${esc((r.framing || 'none').replace(/:forced$/, ''))} · id ${sim} · ${r.degraded ? '<b class="bad">degraded</b>' : '<span class="ok">clean</span>'} · ${esc(r.face_swap_result || '')} · ${r.elapsed_s}s${r.dual_attempts ? ` · attempts ${r.dual_attempts}` : ''}${r.action_fallback ? ` · <b class="bad">beat dropped: ${esc(r.action_fallback)}</b>` : ''}</div>
<div class="checks">${r.checks.looks_path_on ? '<span class="ok">looks path ✓</span>' : '<b class="bad">looks path ✗</b>'} ${r.checks.allowlist ? '<span class="ok">allowlist ✓</span>' : ''} ${r.checks.no_violation ? '<span class="ok">honest ✓</span>' : '<b class="bad">honest ✗</b>'}</div>
<details><summary>stamps</summary><p>${esc(r.stamps.join(' · '))}</p></details><details><summary>prompt</summary><p>${esc(r.prompt)}</p></details></section>`;
    })
    .join('\n');
  return `<!doctype html><meta charset="utf-8"><title>Nightly exact QA</title>
<style>body{margin:0;background:#12100e;color:#f1e9dc;font:14px/1.4 -apple-system,system-ui,sans-serif}header.top{padding:18px 24px;border-bottom:1px solid #2b2620}h1{margin:0 0 4px;font-size:20px}header.top p{margin:0;color:#b8ab99;max-width:110ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;padding:16px 24px}.card{background:#1a1613;border:1px solid #2b2620;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}.card.deg{border-color:#7a3b36}
.card h2{margin:0;font-size:16px}.card header code{color:#9c8f7c;font-size:11px}.card img{width:100%;height:auto;border-radius:6px;display:block}.meta,.checks{font-size:11px;color:#b8ab99}.ok{color:#9fe3b7}.bad{color:#ffb3ad}
details{font-size:11px;color:#9c8f7c}details p{margin:4px 0 0;color:#c9bca8;line-height:1.35}</style>
<header class="top"><h1>Nightly EXACT QA — round ${esc(ROUND)} — ${report.renders.filter((r) => r.ok).length} renders</h1>
<p>Real dream_queue jobs drained by the real worker into the real nightly render. No QA flags: model, cast role, scene type, seeds, look, vibe and framing are the engine's own rolls; the user is on the looks-path allowlist (mig 515). Generated ${new Date().toISOString()}.</p></header><div class="grid">${cards}</div>`;
}

async function main() {
  const report = loadReport();
  if (ARGS['html-only']) {
    fs.writeFileSync(DESKTOP_HTML, buildHtml(report));
    console.log(`page: ${DESKTOP_HTML}`);
    return;
  }
  for (let n = 1; n <= COUNT; n++) {
    if (report.renders.find((r) => r.ok && r.n === n)) {
      console.log(`skip #${n}`);
      continue;
    }
    await waitForHeadroom({ min: 25, label: `exact:${ROUND}#${n}` });
    process.stdout.write(`#${n} … `);
    const r = await renderOne(n);
    report.renders = report.renders.filter((x) => x.n !== n);
    report.renders.push(r);
    fs.writeFileSync(REPORT, JSON.stringify(report, null, 1));
    if (r.ok) {
      console.log(
        `ok ${r.elapsed_s}s · ${r.surface} · ${(r.model_used || '').replace(/^.*\//, '')} · ${r.look} · ${r.vibe} · id ${r.identity_sims.map((v) => v.toFixed(2)).join('/') || '—'} · ${r.degraded ? 'DEGRADED' : 'clean'} · framing ${(r.framing || 'none').replace(/:forced$/, '')} · looks ${r.checks.looks_path_on ? '✓' : '✗'} allowlist ${r.checks.allowlist ? '✓' : '✗'}`
      );
    } else console.log(`FAILED ${r.status ?? ''} ${r.error}`);
  }
  fs.writeFileSync(DESKTOP_HTML, buildHtml(report));
  const ok = report.renders.filter((r) => r.ok);
  const hist = (key) =>
    ok.reduce((m, r) => ((m[r[key] || '?'] = (m[r[key] || '?'] || 0) + 1), m), {});
  console.log(
    `surfaces: ${JSON.stringify(hist('surface'))} · models: ${JSON.stringify(hist('model_used'))} · look families: ${JSON.stringify(hist('look_family'))}`
  );
  console.log(`page: ${DESKTOP_HTML}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
