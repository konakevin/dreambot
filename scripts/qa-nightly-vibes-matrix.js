#!/usr/bin/env node
/**
 * qa-nightly-vibes-matrix.js — the VIBE axis test for the nightly looks refactor (NIGHTLY_VIBES_AUDIT.md).
 *
 * Same fixed glasshouse scene, same cast (Kevin solo), same model + look; ONLY the vibe differs. Unlike the looks
 * matrix this runs the REAL vibe mechanism: the slot input is forced (place, action, wardrobe lock, blank
 * atmosphere axes so the vibe owns the light) but the slots are NOT forced — Sonnet reads the vibe directive and
 * writes scene_description / mood / props exactly as it does in production. One render per vibe; renders persist
 * to Kevin's private Dreams album with caption `✨ VIBE <key> #<n> [<look>]`.
 *
 *   node scripts/qa-nightly-vibes-matrix.js                      # every candidate vibe, 1 render each
 *   node scripts/qa-nightly-vibes-matrix.js --only=cozy,aurora   # subset
 *   node scripts/qa-nightly-vibes-matrix.js --round=b --count=2  # a second round into its own folder
 *   node scripts/qa-nightly-vibes-matrix.js --html-only          # rebuild the page from the saved report
 *
 * Grades: <out dir>/grades.json → { "<vibe>": { accent: 1-5, pretty: 1-5, verdict: "KEEP|PROMOTE|CUT|REWORK", note } }.
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
const ROUND = String(ARGS.round || 'a');
const COUNT = Number(ARGS.count || 1);
const ONLY = ARGS.only ? String(ARGS.only).split(',') : null;
/** --keys=a,b,c tests ARBITRARY vibe keys (any active row) instead of the CANDIDATES list, status 'create'. */
const KEYS = ARGS.keys ? String(ARGS.keys).split(',') : null;
const MODEL = String(ARGS.model || 'black-forest-labs/flux-1.1-pro');
const MODEL_SLUG = MODEL.replace(/^.*\//, '');
const LOOK_KEY = String(ARGS.look || 'nightly_digital_painting');
/** v1 = the legacy route (directive → Sonnet mood field only); v2 = NIGHTLY_VIBES_AUDIT.md §6: the vibe's
 *  flux_fragment placed after the scene + Sonnet told the vibe owns the light + look-neutral solo framing. */
const MECH = String(ARGS.mechanism || 'v1');
const OUT_DIR = `/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/looks/vibes-${ROUND}`;
fs.mkdirSync(OUT_DIR, { recursive: true });
const REPORT = path.join(OUT_DIR, 'report.json');
const HTML = path.join(OUT_DIR, 'nightly-vibes-matrix.html');
const DESKTOP_HTML = path.join(
  os.homedir(),
  'Desktop',
  `nightly-vibes-matrix${ROUND === 'a' ? '' : `-${ROUND}`}.html`
);

/** The candidate list, in page order. status: incumbent = in the nightly roll today; create = active Create-only
 *  vibe proposed for nightly; new = mig 503 proposal (nightly_only). */
const CANDIDATES = [
  ['cinematic', 'incumbent'],
  ['cozy', 'incumbent'],
  ['epic', 'incumbent'],
  ['nostalgic', 'incumbent'],
  ['peaceful', 'incumbent'],
  ['dark', 'create'],
  ['ethereal', 'create'],
  ['arcane', 'create'],
  ['enchanted', 'create'],
  ['nightshade', 'create'],
  ['golden_hour', 'new'],
  ['blue_hour', 'new'],
  ['moonlit', 'new'],
  ['stormlight', 'new'],
  ['festive', 'new'],
  ['after_rain', 'new'],
  ['sun_drenched', 'new'],
  ['spotlight', 'new'],
  ['aurora', 'new'],
  ['prism', 'new'],
];

// ── THE FIXED SCENE (same as the looks matrix) ──────────────────────────────────────────────────
const PLACE = 'the great glasshouse of a Victorian botanical garden';
const WARDROBE_SELF =
  'a deep forest-green velvet jacket over a cream linen shirt, a patterned silk pocket square';
const ACTION_SOLO =
  'standing on the mosaic path beside the koi pond, one hand resting on the wrought-iron railing, smiling toward the camera';

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

async function loadVibes() {
  const cands = KEYS ? KEYS.map((k) => [k, 'create']) : CANDIDATES;
  const keys = cands.map(([k]) => k);
  const { data, error } = await sb
    .from('dream_vibes')
    .select(
      'key,label,description,directive,face_swap_directive,flux_fragment,is_dream_eligible,nightly_only,is_active'
    )
    .in('key', keys);
  if (error) throw error;
  const byKey = new Map(data.map((v) => [v.key, v]));
  return cands
    .filter(([k]) => !ONLY || ONLY.includes(k))
    .map(([k, status]) => {
      const v = byKey.get(k);
      if (!v) throw new Error(`vibe ${k} not in dream_vibes`);
      return { ...v, status };
    });
}

async function loadLook() {
  const { data, error } = await sb
    .from('dream_mediums')
    .select('key,label,face_swap_flux_fragment')
    .eq('key', LOOK_KEY)
    .single();
  if (error) throw error;
  return data;
}

/** Seed: Kevin's latest logged couple slotInput (cast descriptions, avoid list), rebuilt as a SOLO at the fixed
 *  place. Atmosphere axes are BLANK so the vibe owns the light; the wardrobe is locked so only the atmosphere
 *  moves between renders. vibeDirective is set per render (the forced input REPLACES the engine's, so it must
 *  carry the vibe exactly as the engine would: face_swap_directive ?? directive). */
async function loadSeedInput() {
  const { data, error } = await sb
    .from('ai_generation_log')
    .select('rolled_axes')
    .eq('user_id', KEVIN)
    .eq('status', 'completed')
    .filter('rolled_axes->>dreamType', 'eq', 'face_swap_dual')
    .not('rolled_axes->observability->slotInput', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  const si = data && data[0] && data[0].rolled_axes.observability.slotInput;
  if (!si) throw new Error('no logged couple slotInput to seed from');
  const self = si.cast.find((c) => c.role === 'self');
  if (!self) throw new Error('seed slotInput lacks self');
  return {
    ...si,
    cast: [self],
    action: ACTION_SOLO,
    iconicAnchor: PLACE,
    userPlace: PLACE,
    setAtOverride: PLACE,
    timeAxis: '',
    weatherAxis: '',
    phenomenaAxis: '',
    wardrobeAnchor: null,
    costumeLock: [WARDROBE_SELF],
    authorAction: null,
    sceneRegister: 'romantic',
    dualStance: null,
    dualComposition: null,
    soloComposition: null,
    femaleHairVariationPct: 0,
    realWorldLocation: false,
    promptStyle: 'subject_first',
  };
}

async function renderOne(vibe, look, n, seed) {
  const slotInput = {
    ...seed,
    mediumFluxFragment: look.face_swap_flux_fragment,
    vibeDirective: vibe.face_swap_directive || vibe.directive,
    ...(MECH === 'v2' ? { vibeFragment: vibe.flux_fragment, lookNeutralFraming: true } : {}),
    ...(MECH === 'v3'
      ? {
          vibeFragment: vibe.flux_fragment,
          lookNeutralFraming: true,
          vibeFragmentPosition: 'early',
        }
      : {}),
  };
  const body = {
    user_id: KEVIN,
    persist: true,
    force_look: look.key,
    force_model: MODEL,
    force_vibe: vibe.key,
    force_cast_role: 'self',
    force_face_swap_eligible: true,
    force_prompt_style: 'subject_first',
    force_slot_input: slotInput,
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
    const code = e && e.code ? e.code : e && e.message ? e.message : String(e);
    return {
      vibe: vibe.key,
      n,
      elapsed_s: Math.round((Date.now() - start) / 1000),
      status: 0,
      ok: false,
      error: `fetch failed: ${code}`,
    };
  }
  const elapsed = Math.round((Date.now() - start) / 1000);
  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = { error: await res.text() };
  }
  const rec = { vibe: vibe.key, n, mechanism: MECH, elapsed_s: elapsed, status: res.status };
  if (!res.ok || !payload.image_url) {
    return {
      ...rec,
      ok: false,
      error: payload.error ?? `no image_url (${res.status})`,
      payload: JSON.stringify(payload).slice(0, 400),
    };
  }
  const caption = `✨ VIBE ${vibe.key} #${n} [${look.key.replace(/^nightly_/, '')}${MECH === 'v1' ? '' : ` ${MECH}`}]`;
  if (payload.upload_id) {
    const { error: capErr } = await sb
      .from('uploads')
      .update({ caption })
      .eq('id', payload.upload_id);
    if (capErr) console.warn(`  ! caption update failed: ${capErr.message}`);
  }
  let log = null;
  for (let i = 0; i < 6 && !log; i++) {
    const { data } = await sb
      .from('ai_generation_log')
      .select('id,fallback_reasons,enhanced_prompt,model_used,rolled_axes')
      .eq('upload_id', payload.upload_id)
      .limit(1);
    log = data && data[0];
    if (!log) await new Promise((r) => setTimeout(r, 2000));
  }
  const stamps = (log && log.fallback_reasons) || [];
  const prompt = (log && log.enhanced_prompt) || '';
  const sims = stamps.flatMap((s) => {
    const solo = /identity_sim_solo:([0-9.]+)/.exec(s);
    const dual = /identity_sim:L([0-9.]+)\/R([0-9.]+)/.exec(s);
    return solo ? [Number(solo[1])] : dual ? [Number(dual[1]), Number(dual[2])] : [];
  });
  const degraded = stamps.some((s) =>
    /dual_degrade|no_dual_split|solo_rebuild|faceless|swap_failed|degrade_single/.test(s)
  );
  // Sonnet's contribution = everything after the locked action clause (identity block, scene, framing, mood, props).
  const actIdx = prompt.indexOf(ACTION_SOLO);
  const sonnetPart = actIdx >= 0 ? prompt.slice(actIdx + ACTION_SOLO.length + 2) : prompt;
  const local = path.join(OUT_DIR, `${vibe.key}-${n}.jpg`);
  try {
    await download(payload.image_url, local);
  } catch (e) {
    console.warn(`  ! download failed: ${e.message}`);
  }
  return {
    ...rec,
    ok: true,
    upload_id: payload.upload_id,
    image_url: payload.image_url,
    local,
    caption,
    model_used: log && log.model_used,
    vibe_logged: log && log.rolled_axes && log.rolled_axes.vibe,
    look_stamp: stamps.find((s) => s.startsWith('look:')) || null,
    identity_sims: sims,
    degraded,
    stamps,
    prompt,
    sonnet_part: sonnetPart,
    fragment_in_prompt:
      MECH === 'v1' ? null : prompt.includes(String(vibe.flux_fragment || '').slice(0, 40)),
  };
}

function loadReport() {
  return fs.existsSync(REPORT) ? JSON.parse(fs.readFileSync(REPORT, 'utf8')) : { renders: [] };
}
function saveReport(r) {
  fs.writeFileSync(REPORT, JSON.stringify(r, null, 1));
}
function loadGrades() {
  const p = path.join(OUT_DIR, 'grades.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(report, vibes, look) {
  const grades = loadGrades();
  const cards = vibes
    .map((v) => {
      const rs = report.renders.filter((r) => r.vibe === v.key).sort((a, b) => a.n - b.n);
      const g = grades[v.key];
      const gradeHtml = g
        ? `<div class="verdict ${esc(String(g.verdict).toLowerCase())}">${esc(g.verdict)}</div><div class="scores">accent ${g.accent}/5 · pretty ${g.pretty}/5</div><p class="note">${esc(g.note)}</p>`
        : '<div class="verdict pending">ungraded</div>';
      const imgs = rs
        .map((r) => {
          if (!r.ok)
            return `<div class="shot failed">failed<br><small>${esc(r.error)}</small></div>`;
          const sim = r.identity_sims.map((x) => x.toFixed(2)).join('/') || '—';
          return `<figure class="shot"><a href="${esc(r.image_url)}" target="_blank"><img src="${esc(r.image_url)}" loading="lazy"></a><figcaption>#${r.n} · id ${sim} · ${r.degraded ? '<b class="bad">degraded</b>' : '<span class="ok">swap ok</span>'} · ${r.vibe_logged === v.key ? '<span class="ok">vibe logged ✓</span>' : `<b class="bad">logged ${esc(r.vibe_logged)}</b>`}${r.fragment_in_prompt == null ? '' : r.fragment_in_prompt ? ' · <span class="ok">fragment ✓</span>' : ' · <b class="bad">fragment ✗</b>'}</figcaption><details><summary>what Sonnet wrote</summary><p>${esc(r.sonnet_part)}</p></details></figure>`;
        })
        .join('');
      return `<section class="card"><header><span class="status ${v.status}">${v.status}</span><h2>${esc(v.label)}</h2><code>${esc(v.key)}</code><p class="blurb">${esc(v.description || '')}</p></header>${gradeHtml}<div class="shots">${imgs || '<div class="shot failed">not run</div>'}</div><details class="dir"><summary>directive</summary><p>${esc((v.face_swap_directive || v.directive).split('IMPORTANT:')[0])}</p></details></section>`;
    })
    .join('\n');
  return `<!doctype html><meta charset="utf-8"><title>Nightly Vibes Matrix</title>
<style>
body{margin:0;background:#12100e;color:#f1e9dc;font:14px/1.4 -apple-system,system-ui,sans-serif}
header.top{padding:18px 24px;border-bottom:1px solid #2b2620}h1{margin:0 0 4px;font-size:20px}header.top p{margin:0;color:#b8ab99;max-width:110ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;padding:16px 24px}
.card{background:#1a1613;border:1px solid #2b2620;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}
.card header h2{margin:2px 0 0;font-size:17px}.card header code{color:#9c8f7c;font-size:11px}.blurb{margin:2px 0 0;color:#d8cbb6;font-style:italic}
.status{display:inline-block;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.status.incumbent{background:#2c3f5a;color:#b9d4ff}.status.create{background:#4a3a1e;color:#ffe3a0}.status.new{background:#1f4d33;color:#9fe3b7}
.verdict{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.06em;align-self:flex-start}
.verdict.keep,.verdict.promote{background:#1f4d33;color:#9fe3b7}.verdict.cut{background:#5a2320;color:#ffb3ad}.verdict.rework{background:#5a4a1e;color:#ffe3a0}.verdict.pending{background:#3a332c;color:#d8cbb6}
.scores{font-size:11px;color:#9c8f7c}.note{margin:0;font-size:12px;color:#d8cbb6;line-height:1.35}
.shots{display:flex;flex-direction:column;gap:8px}.shot{margin:0}.shot img{width:100%;height:auto;border-radius:6px;display:block}.shot.failed{color:#ffb3ad;padding:20px;text-align:center;background:#221a18;border-radius:6px}
figcaption{font-size:11px;color:#b8ab99;margin-top:4px}.ok{color:#9fe3b7}.bad{color:#ffb3ad}
details{font-size:11px;color:#9c8f7c}details p{margin:4px 0 0;color:#c9bca8;line-height:1.35}
</style>
<header class="top"><h1>Nightly Vibes Matrix — round ${esc(ROUND)} (mechanism ${esc(MECH)}) — ${vibes.length} vibes</h1>
<p>One fixed scene (${esc(PLACE)}), Kevin solo at the railing in the locked velvet jacket, model ${esc(MODEL_SLUG)}, look <b>${esc(look.label)}</b>. Only the VIBE changes between cards, and it travels the real production route: Sonnet reads the vibe directive and writes the scene, mood and props itself (the atmosphere axes are blank so the vibe owns the light). Badges: <b>incumbent</b> = in tonight's nightly roll, <b>create</b> = an existing Create-only vibe proposed for nightly, <b>new</b> = a mig-503 proposal. Mechanism <b>v1</b> = today's route (the directive reaches Flux only as Sonnet's 1-3 mood phrases at the tail of the prompt); <b>v2</b> = the vibe's verbatim fragment placed right after the scene, Sonnet told the vibe owns the light, and the solo framing line stripped of its photography prior; <b>v3</b> = v2 but the fragment placed EARLY (right after the place line, before the person). Grades: <b>accent</b> = how clearly the vibe shows against the other cards, <b>pretty</b> = would Kevin want this dream. Generated ${new Date().toISOString()}.</p></header>
<div class="grid">
${cards}
</div>`;
}

function buildCompareHtml(rounds, vibes, look) {
  const data = rounds.map((r) => {
    const dir = OUT_DIR.replace(/vibes-[a-z0-9]+$/, `vibes-${r}`);
    const rep = fs.existsSync(path.join(dir, 'report.json'))
      ? JSON.parse(fs.readFileSync(path.join(dir, 'report.json'), 'utf8'))
      : { renders: [] };
    const gp = path.join(dir, 'grades.json');
    const grades = fs.existsSync(gp) ? JSON.parse(fs.readFileSync(gp, 'utf8')) : {};
    const mech = (rep.renders.find((x) => x.mechanism) || {}).mechanism || 'v1';
    return { round: r, rep, grades, mech };
  });
  const MECH_TEXT = {
    v1: "today's route: the directive reaches Flux only as Sonnet's 1-3 mood phrases at the tail of the prompt",
    v2: 'the vibe fragment placed right AFTER the scene + Sonnet told the vibe owns the light + look-neutral solo framing',
    v3: 'as v2 but the fragment placed EARLY, right after the place line and before the person',
  };
  const head = data
    .map(
      (d) =>
        `<th>round ${esc(d.round)} · ${esc(d.mech)}<div class="sub">${esc(MECH_TEXT[d.mech] || '')}</div></th>`
    )
    .join('');
  const rows = vibes
    .map((v) => {
      const cells = data
        .map((d) => {
          const r = d.rep.renders.find((x) => x.vibe === v.key && x.ok);
          const g = d.grades[v.key];
          const gradeHtml = g
            ? `<div class="verdict ${esc(String(g.verdict).toLowerCase())}">${esc(g.verdict)}</div><div class="scores">accent ${g.accent}/5 · pretty ${g.pretty}/5</div><p class="note">${esc(g.note)}</p>`
            : '';
          if (!r)
            return `<td class="cell"><div class="shot failed">not rendered</div>${gradeHtml}</td>`;
          const sim = r.identity_sims.map((x) => x.toFixed(2)).join('/') || '—';
          return `<td class="cell"><a href="${esc(r.image_url)}" target="_blank"><img src="${esc(r.image_url)}" loading="lazy"></a><div class="meta">id ${sim} · ${r.degraded ? '<b class="bad">degraded</b>' : '<span class="ok">swap ok</span>'}</div>${gradeHtml}<details><summary>what Sonnet wrote</summary><p>${esc(r.sonnet_part)}</p></details></td>`;
        })
        .join('');
      return `<tr><th class="vibe"><span class="status ${v.status}">${v.status}</span><div class="label">${esc(v.label)}</div><code>${esc(v.key)}</code><p class="blurb">${esc(v.description || '')}</p><details class="dir"><summary>fragment</summary><p>${esc(v.flux_fragment || '')}</p></details><details class="dir"><summary>directive</summary><p>${esc((v.face_swap_directive || v.directive).split('IMPORTANT:')[0])}</p></details></th>${cells}</tr>`;
    })
    .join('\n');
  return `<!doctype html><meta charset="utf-8"><title>Nightly Vibes Compare</title>
<style>
body{margin:0;background:#12100e;color:#f1e9dc;font:14px/1.4 -apple-system,system-ui,sans-serif}
header{padding:18px 24px;border-bottom:1px solid #2b2620}h1{margin:0 0 4px;font-size:20px}header p{margin:0;color:#b8ab99;max-width:120ch}
table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #2b2620;vertical-align:top;padding:8px}
thead th{position:sticky;top:0;background:#1a1613;text-align:left;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#b8ab99;z-index:1}
thead th .sub{text-transform:none;letter-spacing:0;font-size:11px;color:#9c8f7c;max-width:300px;margin-top:3px}
th.vibe{width:230px;text-align:left;background:#161310}th.vibe .label{font-size:16px;font-weight:600;margin-top:4px}th.vibe code{color:#9c8f7c;font-size:11px}
.blurb{margin:4px 0 0;color:#d8cbb6;font-style:italic;font-size:12px}
.status{display:inline-block;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.status.incumbent{background:#2c3f5a;color:#b9d4ff}.status.create{background:#4a3a1e;color:#ffe3a0}.status.new{background:#1f4d33;color:#9fe3b7}
.verdict{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.06em}
.verdict.keep,.verdict.promote{background:#1f4d33;color:#9fe3b7}.verdict.cut{background:#5a2320;color:#ffb3ad}.verdict.rework,.verdict.retry{background:#5a4a1e;color:#ffe3a0}
.scores{font-size:11px;color:#9c8f7c;margin-top:3px}.note{margin:4px 0 0;font-size:12px;color:#d8cbb6;line-height:1.35;max-width:300px}
td.cell{width:320px}td.cell img{width:300px;height:auto;border-radius:6px;display:block}.shot.failed{color:#ffb3ad;padding:30px;text-align:center;background:#221a18;border-radius:6px;width:240px}
.meta{font-size:11px;color:#b8ab99;margin-top:4px}.ok{color:#9fe3b7}.bad{color:#ffb3ad}
details{font-size:11px;color:#9c8f7c;margin-top:4px}details p{margin:4px 0 0;color:#c9bca8;line-height:1.35;max-width:300px}
</style>
<header><h1>Nightly Vibes Compare — ${vibes.length} vibes × ${rounds.length} mechanisms</h1>
<p>One fixed scene (${esc(PLACE)}), Kevin solo at the railing, model ${esc(MODEL_SLUG)}, look <b>${esc(look.label)}</b>. Each row is one vibe; each column is a different way of getting that vibe into the prompt. Badges: <b>incumbent</b> = in tonight's nightly roll, <b>create</b> = an existing Create-only vibe proposed for nightly, <b>new</b> = a proposal. Grades: <b>accent</b> = how clearly the vibe reads, <b>pretty</b> = would Kevin want this dream. Generated ${new Date().toISOString()}.</p></header>
<div style="overflow-x:auto"><table><thead><tr><th>Vibe</th>${head}</tr></thead><tbody>
${rows}
</tbody></table></div>`;
}

async function main() {
  const vibes = await loadVibes();
  const look = await loadLook();
  if (ARGS.compare) {
    const rounds = String(ARGS.compare).split(',');
    const html = buildCompareHtml(rounds, vibes, look);
    const out = path.join(
      os.homedir(),
      'Desktop',
      ARGS.out
        ? `${ARGS.out}.html`
        : KEYS
          ? 'nightly-vibes-compare-app.html'
          : 'nightly-vibes-compare.html'
    );
    fs.writeFileSync(path.join(OUT_DIR, 'nightly-vibes-compare.html'), html);
    fs.writeFileSync(out, html);
    console.log(`compare page: ${out}`);
    return;
  }
  if (ARGS['html-only']) {
    const html = buildHtml(loadReport(), vibes, look);
    fs.writeFileSync(HTML, html);
    fs.writeFileSync(DESKTOP_HTML, html);
    console.log(`page: ${HTML}\ncopy: ${DESKTOP_HTML}`);
    return;
  }
  const seed = await loadSeedInput();
  const report = loadReport();
  console.log(
    `vibes: ${vibes.length} · look ${look.key} · model ${MODEL_SLUG} · count ${COUNT} · out: ${OUT_DIR}`
  );
  for (const vibe of vibes)
    for (let n = 1; n <= COUNT; n++) {
      const done = report.renders.find((r) => r.ok && r.vibe === vibe.key && r.n === n);
      if (done) {
        console.log(`skip ${vibe.key} #${n} (done)`);
        continue;
      }
      await waitForHeadroom({ min: 25, label: `vibes:${vibe.key}#${n}` });
      process.stdout.write(`${vibe.key} #${n} … `);
      const r = await renderOne(vibe, look, n, seed);
      report.renders = report.renders.filter((x) => !(x.vibe === vibe.key && x.n === n));
      report.renders.push(r);
      saveReport(report);
      if (r.ok) {
        console.log(
          `ok ${r.elapsed_s}s · id ${r.identity_sims.map((v) => v.toFixed(2)).join('/') || '—'} · ${r.degraded ? 'DEGRADED' : 'swap ok'} · vibe ${r.vibe_logged} · ${r.look_stamp ?? 'NO look stamp'}`
        );
      } else {
        console.log(`FAILED ${r.status} ${r.error}`);
      }
    }
  const html = buildHtml(report, vibes, look);
  fs.writeFileSync(HTML, html);
  fs.writeFileSync(DESKTOP_HTML, html);
  console.log(
    `\ndone: ${report.renders.filter((r) => r.ok).length} ok / ${report.renders.length}\npage: ${HTML}\ncopy: ${DESKTOP_HTML}`
  );
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
