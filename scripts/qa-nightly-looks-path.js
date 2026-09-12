#!/usr/bin/env node
/**
 * qa-nightly-looks-path.js — nightly renders on Kevin's account through the LOOKS PATH (force_looks_path), with
 * NATURAL scenes (his own profile, Sonnet live) and the contract rolling model + look + vibe. Checks every render
 * for honesty: the look fragment and the vibe fragment are in the prompt, the persisted model is the contract's,
 * no photography prior, no style_contract_violation stamp. Persists to his private Dreams album with caption
 * `✨ LOOKS PATH <surface> #<n> [<model> · <look> · <vibe>]`.
 *
 *   node scripts/qa-nightly-looks-path.js --round=verify                    # couple + solo + scene, 1 each
 *   node scripts/qa-nightly-looks-path.js --round=qa1 --count=4             # 4 per surface
 *   node scripts/qa-nightly-looks-path.js --round=x --surfaces=couple --model=google/gemini-2-image --look=nightly_chromolithograph --vibe=aurora__bold
 *   node scripts/qa-nightly-looks-path.js --round=qa1 --html-only
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

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
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const NIGHTLY_URL = 'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams';
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
const ROUND = String(ARGS.round || 'verify');
const COUNT = Number(ARGS.count || 1);
const SURFACES = ARGS.surfaces ? String(ARGS.surfaces).split(',') : ['couple', 'solo', 'scene'];
const OUT_DIR = `/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/looks/path-${ROUND}`;
fs.mkdirSync(OUT_DIR, { recursive: true });
const REPORT = path.join(OUT_DIR, 'report.json');
const DESKTOP_HTML = path.join(os.homedir(), 'Desktop', `nightly-looks-path-${ROUND}.html`);

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
      .on('error', (e) => {
        fs.unlink(dest, () => reject(e));
      });
  });
}
const stampVal = (stamps, prefix) => {
  const s = stamps.find((x) => x.startsWith(prefix));
  return s ? s.slice(prefix.length) : null;
};

async function renderOne(surface, n) {
  const body = {
    user_id: KEVIN,
    persist: true,
    force_looks_path: true,
    ...(surface === 'scene'
      ? { force_cast_role: null, force_pure_scene: true }
      : {
          force_cast_role: surface === 'couple' ? 'dual' : 'self',
          force_face_swap_eligible: true,
        }),
    ...(ARGS.rich ? { force_rich_brief: true } : {}),
    ...(ARGS.model ? { force_model: String(ARGS.model) } : {}),
    ...(ARGS.look ? { force_look: String(ARGS.look) } : {}),
    ...(ARGS.vibe ? { force_vibe: String(ARGS.vibe) } : {}),
  };
  const start = Date.now();
  let res;
  try {
    res = await fetch(NIGHTLY_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${WORKER_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return {
      surface,
      n,
      ok: false,
      error: `fetch failed: ${e && e.message ? e.message : e}`,
      elapsed_s: Math.round((Date.now() - start) / 1000),
    };
  }
  const elapsed = Math.round((Date.now() - start) / 1000);
  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = { error: await res.text() };
  }
  if (!res.ok || !payload.image_url) {
    return {
      surface,
      n,
      ok: false,
      status: res.status,
      elapsed_s: elapsed,
      error: payload.error ?? `no image_url (${res.status})`,
      payload: JSON.stringify(payload).slice(0, 400),
    };
  }
  let log = null;
  for (let i = 0; i < 6 && !log; i++) {
    const { data } = await sb
      .from('ai_generation_log')
      .select('id,fallback_reasons,enhanced_prompt,model_used,rolled_axes,sonnet_brief')
      .eq('upload_id', payload.upload_id)
      .limit(1);
    log = data && data[0];
    if (!log) await new Promise((r) => setTimeout(r, 2000));
  }
  const stamps = (log && log.fallback_reasons) || [];
  const prompt = (log && log.enhanced_prompt) || '';
  const lookKey = stampVal(stamps, 'look:');
  const vibeKey = stampVal(stamps, 'vibe:');
  const modelUsed = log && log.model_used;
  // fragments of record
  let lookFrag = null;
  let vibeFrag = null;
  if (lookKey) {
    const { data } = await sb
      .from('dream_mediums')
      .select('flux_fragment,face_swap_flux_fragment')
      .eq('key', lookKey)
      .single();
    if (data)
      lookFrag =
        surface === 'scene'
          ? data.flux_fragment
          : data.face_swap_flux_fragment || data.flux_fragment;
  }
  if (vibeKey) {
    const { data } = await sb
      .from('dream_vibes')
      .select('flux_fragment,fragment_position')
      .eq('key', vibeKey)
      .single();
    if (data) vibeFrag = data.flux_fragment;
  }
  const sims = stamps.flatMap((s) => {
    const dual = /identity_sim:L([0-9.]+)\/R([0-9.]+)/.exec(s);
    if (dual) return [Number(dual[1]), Number(dual[2])];
    const solo = /identity_sim_solo:([0-9.]+)/.exec(s);
    return solo ? [Number(solo[1])] : [];
  });
  const checks = {
    looks_path_on: stamps.includes('looks_path:on'),
    look_fragment_in_prompt: lookFrag ? prompt.includes(lookFrag.slice(0, 50)) : null,
    vibe_fragment_in_prompt: vibeFrag ? prompt.includes(vibeFrag.slice(0, 40)) : null,
    no_photo_prior: !prompt.includes('editorial photograph'),
    no_violation: !stamps.some((s) => s.startsWith('style_contract_violation')),
    model_matches:
      modelUsed && stampVal(stamps, 'policy:')
        ? stampVal(stamps, 'policy:').endsWith(modelUsed.replace(/^.*\//, '')) ||
          stamps.some((s) => s.includes(modelUsed.replace(/^.*\//, '')))
        : null,
  };
  const brief = /SET DRESSER/.test((log && log.sonnet_brief) || '') ? 'set-dresser' : 'legacy';
  const composer = /candid cinematic photograph|editorial cinematic photograph/.test(prompt)
    ? 'legacy-priors'
    : 'look-neutral';
  const degraded = stamps.some((s) =>
    /dual_degrade|no_dual_split|solo_rebuild|faceless|swap_failed|degrade_single|SHIPPED_FACELESS/.test(
      s
    )
  );
  const caption = `✨ LOOKS PATH ${surface} #${n} [${(modelUsed || '').replace(/^.*\//, '')} · ${(lookKey || '').replace(/^nightly_/, '')} · ${vibeKey || 'no vibe'}]`;
  if (payload.upload_id) await sb.from('uploads').update({ caption }).eq('id', payload.upload_id);
  const local = path.join(OUT_DIR, `${surface}-${n}.jpg`);
  try {
    await download(payload.image_url, local);
  } catch (e) {
    console.warn(`  ! download failed: ${e.message}`);
  }
  return {
    surface,
    n,
    ok: true,
    elapsed_s: elapsed,
    upload_id: payload.upload_id,
    image_url: payload.image_url,
    local,
    caption,
    model_used: modelUsed,
    look: lookKey,
    look_family: stampVal(stamps, 'look_family:'),
    vibe: vibeKey,
    vibe_family: stampVal(stamps, 'vibe_family:'),
    vibe_version: stampVal(stamps, 'vibe_version:'),
    identity_sims: sims,
    degraded,
    checks,
    stamps,
    prompt,
    composer,
    brief,
    face_swap_result: log && log.rolled_axes && log.rolled_axes.faceSwapResult,
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
    .sort((a, b) => (a.surface > b.surface ? 1 : a.surface < b.surface ? -1 : a.n - b.n))
    .map((r) => {
      if (!r.ok)
        return `<section class="card"><h2>${esc(r.surface)} #${r.n}</h2><div class="bad">failed: ${esc(r.error)}</div></section>`;
      const c = r.checks;
      const badge = (ok, label) =>
        ok === null
          ? `<span class="na">${label}: n/a</span>`
          : ok
            ? `<span class="ok">${label} ✓</span>`
            : `<b class="bad">${label} ✗</b>`;
      const sim = r.identity_sims.map((x) => x.toFixed(2)).join('/') || '—';
      return `<section class="card"><header><h2>${esc(r.surface)} #${r.n}</h2><code>${esc((r.model_used || '').replace(/^.*\//, ''))} · ${esc(r.look)} (${esc(r.look_family)}) · ${esc(r.vibe)} (${esc(r.vibe_family)}${r.vibe_version ? ' · ' + esc(r.vibe_version) : ''})</code></header>
<a href="${esc(r.image_url)}" target="_blank"><img src="${esc(r.image_url)}" loading="lazy"></a>
<div class="meta">${r.composer === 'legacy-priors' ? '<b class="bad">composer: legacy photo priors</b>' : '<span class="ok">composer: look-neutral</span>'} · ${r.brief === 'set-dresser' ? '<span class="ok">brief: set dresser</span>' : '<b class="bad">brief: legacy</b>'} · id ${sim} · ${r.degraded ? '<b class="bad">degraded</b>' : '<span class="ok">clean</span>'} · ${esc(r.face_swap_result || '')} · ${r.elapsed_s}s</div>
<div class="checks">${badge(c.looks_path_on, 'looks path')} ${badge(c.look_fragment_in_prompt, 'look fragment')} ${badge(c.vibe_fragment_in_prompt, 'vibe fragment')} ${badge(c.no_photo_prior, 'no photo prior')} ${badge(c.no_violation, 'honest')}</div>
<details><summary>stamps</summary><p>${esc(r.stamps.join(' · '))}</p></details><details><summary>prompt</summary><p>${esc(r.prompt)}</p></details></section>`;
    })
    .join('\n');
  return `<!doctype html><meta charset="utf-8"><title>Nightly Looks Path QA</title>
<style>body{margin:0;background:#12100e;color:#f1e9dc;font:14px/1.4 -apple-system,system-ui,sans-serif}header.top{padding:18px 24px;border-bottom:1px solid #2b2620}h1{margin:0 0 4px;font-size:20px}header.top p{margin:0;color:#b8ab99;max-width:110ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;padding:16px 24px}.card{background:#1a1613;border:1px solid #2b2620;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}
.card h2{margin:0;font-size:16px}.card header code{color:#9c8f7c;font-size:11px}.card img{width:100%;height:auto;border-radius:6px;display:block}.meta,.checks{font-size:11px;color:#b8ab99}.ok{color:#9fe3b7}.bad{color:#ffb3ad}.na{color:#6f6558}
details{font-size:11px;color:#9c8f7c}details p{margin:4px 0 0;color:#c9bca8;line-height:1.35}</style>
<header class="top"><h1>Nightly Looks Path QA — round ${esc(ROUND)} — ${report.renders.filter((r) => r.ok).length} renders</h1>
<p>Natural nightly renders on Kevin's account through the looks path: the contract rolled the model (50/25/25), a look approved for that model and surface (family first), and a vibe version (family first). Checks: the look fragment and vibe fragment are in the prompt, no photography prior, no honesty violation. Generated ${new Date().toISOString()}.</p></header><div class="grid">${cards}</div>`;
}
async function main() {
  const report = loadReport();
  if (ARGS['html-only']) {
    fs.writeFileSync(DESKTOP_HTML, buildHtml(report));
    console.log(`page: ${DESKTOP_HTML}`);
    return;
  }
  for (const surface of SURFACES)
    for (let n = 1; n <= COUNT; n++) {
      if (report.renders.find((r) => r.ok && r.surface === surface && r.n === n)) {
        console.log(`skip ${surface} #${n}`);
        continue;
      }
      await waitForHeadroom({ min: 25, label: `looks-path:${surface}#${n}` });
      process.stdout.write(`${surface} #${n} … `);
      const r = await renderOne(surface, n);
      report.renders = report.renders.filter((x) => !(x.surface === surface && x.n === n));
      report.renders.push(r);
      fs.writeFileSync(REPORT, JSON.stringify(report, null, 1));
      if (r.ok) {
        const c = r.checks;
        console.log(
          `ok ${r.elapsed_s}s · ${(r.model_used || '').replace(/^.*\//, '')} · ${r.look} · ${r.vibe} · id ${r.identity_sims.map((v) => v.toFixed(2)).join('/') || '—'} · ${r.degraded ? 'DEGRADED' : 'clean'} · looks ${c.looks_path_on ? '✓' : '✗'} lookfrag ${c.look_fragment_in_prompt} vibefrag ${c.vibe_fragment_in_prompt} nophoto ${c.no_photo_prior} honest ${c.no_violation}`
        );
      } else console.log(`FAILED ${r.status ?? ''} ${r.error}`);
    }
  fs.writeFileSync(DESKTOP_HTML, buildHtml(report));
  console.log(`page: ${DESKTOP_HTML}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
