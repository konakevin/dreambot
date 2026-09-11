#!/usr/bin/env node
/**
 * Nightly LOOKS matrix — Phase A3 of NIGHTLY_LOOKS_REFACTOR_PLAN.md (Kevin, 2026-09-11).
 *
 * Renders every candidate look (dream_mediums rows with client_meta.nightly_look_candidate=true) on ONE
 * fixed scene, ONE fixed cast (Kevin + plus_one), ONE model (flux-1.1-pro), ONE vibe — as a COUPLE and as
 * a SOLO, N times each — so the grid compares looks apples to apples. Every render is honest by
 * construction: `force_look` pins the row (dream_medium = the key, `look:<key>` stamp, the 1.1-pro override
 * library exempted) and `force_slot_input` + `force_dual_slots` / `force_single_slots` make the prompt a
 * pure function of the fixed scene + the look's swap fragment (no Sonnet call). Renders persist to Kevin's
 * PRIVATE Dreams album with the caption `✨ LOOK <key> <couple|solo> #<n>`.
 *
 * Throttled: sequential, headroom-gated (CLAUDE.md hard rule). ~45-60 s per render.
 *
 *   node scripts/qa-nightly-looks-matrix.js --verify            # 1 couple + 1 solo of the first look, then stop
 *   node scripts/qa-nightly-looks-matrix.js                     # full matrix (default --count=2)
 *   node scripts/qa-nightly-looks-matrix.js --only=nightly_fresco,nightly_encaustic --count=1
 *   node scripts/qa-nightly-looks-matrix.js --html-only         # rebuild the page from the saved report
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
const MODEL = 'black-forest-labs/flux-1.1-pro';
const VIBE = 'cozy';
const OUT_DIR =
  process.env.LOOKS_OUT_DIR ||
  '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/looks/matrix';
fs.mkdirSync(OUT_DIR, { recursive: true });
const REPORT = path.join(OUT_DIR, 'report.json');
const HTML = path.join(OUT_DIR, 'nightly-looks-matrix.html');
const DESKTOP_HTML = path.join(os.homedir(), 'Desktop', 'nightly-looks-matrix.html');

const ARGS = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const COUNT = Number(ARGS.count || 2);
const ONLY = ARGS.only ? String(ARGS.only).split(',') : null;
const SURFACES = ARGS.surface ? String(ARGS.surface).split(',') : ['couple', 'solo'];

// ── THE FIXED SCENE (Kevin-approved 2026-09-11) ─────────────────────────────────────────────────
const PLACE = 'the great glasshouse of a Victorian botanical garden';
// The couple's SPOT leads the scene text (Flux weights the scene clause over the late action clause):
// they are on the mosaic path beside the koi pond; the tea table is set dressing BEHIND them.
const SCENE =
  'on a mosaic-tiled path beside a koi pond with lily pads, inside a vast Victorian glasshouse conservatory: a soaring ribbed iron-and-glass dome overhead, towering palms and tree ferns, hanging baskets of orchids and trailing fuchsias, brass lanterns on wrought-iron posts, condensation beading on the glass panes, banana leaves and monstera pressing against the glass, soft light filtering through the panes, and behind them a marble-topped tea table with a tiered stand of pastries and a silver tea service';
const WARDROBE_SELF =
  'a deep forest-green velvet jacket over a cream linen shirt, a patterned silk pocket square';
const WARDROBE_PLUS_ONE =
  'an emerald satin evening dress with a sweetheart neckline, a jeweled hair comb, pearl drop earrings';
const MOOD = 'lush, warm, romantic, richly layered';
const PROPS =
  'a brass lantern on a wrought-iron post, the silver tea service on the marble table behind them, koi gliding under the lily pads';
// Solo twins: a plural pronoun ("behind them") made Flux draw a second person on the solo verification
// render (probe: solo_multi_face faces=2 → re-render). Same scene, singular pronouns.
const SCENE_SOLO = SCENE.replace(
  'and behind them a marble-topped',
  'and behind him a marble-topped'
);
const PROPS_SOLO = PROPS.replace('behind them', 'behind him');
const ACTION_COUPLE =
  'mid-step in a slow dance on the mosaic path beside the koi pond, his hand at the small of her back and her hand resting on his shoulder, both turned toward the camera smiling, a clear gap between their heads';
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

async function loadLooks() {
  const { data, error } = await sb
    .from('dream_mediums')
    .select('key,label,face_swap_flux_fragment,flux_fragment,client_meta,sort_order,is_active')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  let looks = data.filter((m) => m.client_meta && m.client_meta.nightly_look_candidate === true);
  if (ONLY) looks = looks.filter((m) => ONLY.includes(m.key));
  return looks;
}

/** Seed slot input: Kevin's latest logged couple render (cast descriptions + axes), with every
 *  scene-bearing field replaced by the fixed scene. Only the look fragment varies per render. */
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
  const plusOne = si.cast.find((c) => c.role === 'plus_one');
  if (!self || !plusOne) throw new Error('seed slotInput lacks self + plus_one');
  const base = {
    ...si,
    iconicAnchor: PLACE,
    userPlace: PLACE,
    setAtOverride: PLACE,
    vibeDirective: `${VIBE} vibe`, // Sonnet is bypassed (forced slots); logged for the record only
    wardrobeAnchor: null,
    costumeLock: null,
    authorAction: null,
    sceneRegister: 'romantic',
    dualStance: { seated: false, heightContrast: false },
    dualComposition: null,
    soloComposition: null,
    femaleHairVariationPct: 0, // no per-render hair roll — identical prompts
    realWorldLocation: false,
    promptStyle: 'subject_first',
  };
  return {
    couple: { ...base, cast: [self, plusOne], action: ACTION_COUPLE }, // LEFT = self, RIGHT = plus_one
    solo: { ...base, cast: [self], action: ACTION_SOLO },
  };
}

const DUAL_SLOTS = {
  scene_description: SCENE,
  left_wardrobe: WARDROBE_SELF,
  right_wardrobe: WARDROBE_PLUS_ONE,
  mood: MOOD,
  props: PROPS,
  action: ACTION_COUPLE,
};
const SINGLE_SLOTS = {
  scene_description: SCENE_SOLO,
  wardrobe: WARDROBE_SELF,
  mood: MOOD,
  props: PROPS_SOLO,
  action: ACTION_SOLO,
};

async function renderOne(look, surface, n, seed) {
  const couple = surface === 'couple';
  const slotInput = {
    ...(couple ? seed.couple : seed.solo),
    mediumFluxFragment: look.face_swap_flux_fragment,
  };
  const body = {
    user_id: KEVIN,
    persist: true,
    force_look: look.key,
    force_model: MODEL,
    force_vibe: VIBE,
    force_cast_role: couple ? 'dual' : 'self',
    force_face_swap_eligible: true,
    force_prompt_style: 'subject_first',
    force_slot_input: slotInput,
    ...(couple ? { force_dual_slots: DUAL_SLOTS } : { force_single_slots: SINGLE_SLOTS }),
  };
  const start = Date.now();
  const res = await fetch(NIGHTLY_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WORKER_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const elapsed = Math.round((Date.now() - start) / 1000);
  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = { error: await res.text() };
  }
  const rec = {
    look: look.key,
    label: look.label,
    surface,
    n,
    elapsed_s: elapsed,
    status: res.status,
  };
  if (!res.ok || !payload.image_url) {
    return {
      ...rec,
      ok: false,
      error: payload.error ?? `no image_url (${res.status})`,
      payload: JSON.stringify(payload).slice(0, 400),
    };
  }
  const caption = `✨ LOOK ${look.key} ${surface} #${n}`;
  if (payload.upload_id) {
    const { error: capErr } = await sb
      .from('uploads')
      .update({ caption })
      .eq('id', payload.upload_id);
    if (capErr) console.warn(`  ! caption update failed: ${capErr.message}`);
  }
  // Forensics: the stamps + the exact prompt, straight from the log row (never guessed).
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
  const fragHead = look.face_swap_flux_fragment.slice(0, 60);
  const honest = prompt.includes(fragHead);
  // Stamps: dual = `identity_sim:L0.68/R0.69`, solo = `identity_sim_solo:0.73`.
  const sims = stamps.flatMap((s) => {
    const dual = /identity_sim:L([0-9.]+)\/R([0-9.]+)/.exec(s);
    if (dual) return [Number(dual[1]), Number(dual[2])];
    const solo = /identity_sim_solo:([0-9.]+)/.exec(s);
    return solo ? [Number(solo[1])] : [];
  });
  const degraded = stamps.some((s) =>
    /dual_degrade|no_dual_split|solo_rebuild|faceless|swap_failed|degrade_single/.test(s)
  );
  const local = path.join(OUT_DIR, `${look.key}-${surface}-${n}.jpg`);
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
    dream_medium: null, // filled below from uploads
    model_used: log && log.model_used,
    honest_fragment_in_prompt: honest,
    override_exempt: stamps.includes('look_override_library:exempt'),
    look_stamp: stamps.find((s) => s.startsWith('look:')) || null,
    identity_sims: sims,
    degraded,
    face_swap_result: log && log.rolled_axes && log.rolled_axes.faceSwapResult,
    dual_face_count: log && log.rolled_axes && log.rolled_axes.dualFaceCount,
    stamps,
    prompt,
  };
}

function loadReport() {
  return fs.existsSync(REPORT) ? JSON.parse(fs.readFileSync(REPORT, 'utf8')) : { renders: [] };
}
function saveReport(r) {
  fs.writeFileSync(REPORT, JSON.stringify(r, null, 1));
}

/** Gate per look, from stamps only: couples must land dual first-try (no degrade) on ≥ ceil(3/4 · n) of
 *  renders and the median identity across couple + solo renders must be ≥ 0.50. */
function gate(renders) {
  const couples = renders.filter((r) => r.ok && r.surface === 'couple');
  const solos = renders.filter((r) => r.ok && r.surface === 'solo');
  const cleanCouples = couples.filter(
    (r) => !r.degraded && (r.dual_face_count == null || r.dual_face_count >= 2)
  );
  const sims = renders.flatMap((r) => (r.ok ? r.identity_sims : [])).sort((a, b) => a - b);
  const median = sims.length ? sims[Math.floor(sims.length / 2)] : null;
  const need = couples.length ? Math.ceil(couples.length * 0.75) : 0;
  const pass =
    couples.length > 0 && cleanCouples.length >= need && (median == null || median >= 0.5);
  return {
    couples: couples.length,
    clean_couples: cleanCouples.length,
    solos: solos.length,
    median_identity: median,
    verdict: couples.length === 0 ? 'no-data' : pass ? 'PASS' : 'FAIL',
  };
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function loadGrades() {
  const p = path.join(OUT_DIR, 'grades.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}

function buildHtml(report, looks) {
  const grades = loadGrades();
  const byLook = new Map();
  for (const r of report.renders) {
    if (!byLook.has(r.look)) byLook.set(r.look, []);
    byLook.get(r.look).push(r);
  }
  const order = looks.map((l) => l.key).filter((k) => byLook.has(k));
  const cols = [];
  for (let n = 1; n <= COUNT; n++) cols.push(['couple', n]);
  for (let n = 1; n <= COUNT; n++) cols.push(['solo', n]);
  const rows = order
    .map((key) => {
      const rs = byLook.get(key);
      const look = looks.find((l) => l.key === key) || { label: key };
      const g = gate(rs);
      const cells = cols
        .map(([surface, n]) => {
          const r = rs.find((x) => x.surface === surface && x.n === n);
          if (!r) return '<td class="cell empty">—</td>';
          if (!r.ok) return `<td class="cell empty">failed<br><small>${esc(r.error)}</small></td>`;
          const sims = r.identity_sims.map((v) => v.toFixed(2)).join(' / ') || '—';
          const flags = [
            r.degraded ? '<b class="bad">degraded</b>' : '<span class="ok">swap ok</span>',
            r.honest_fragment_in_prompt
              ? '<span class="ok">fragment ✓</span>'
              : '<b class="bad">fragment ✗</b>',
          ].join(' · ');
          return `<td class="cell"><a href="${esc(r.image_url)}" target="_blank"><img src="${esc(r.image_url)}" loading="lazy"></a><div class="meta">id ${sims}<br>${flags}</div></td>`;
        })
        .join('');
      const verdictClass = g.verdict === 'PASS' ? 'pass' : g.verdict === 'FAIL' ? 'fail' : 'nodata';
      const mine = grades[key];
      const mineClass = mine
        ? mine.grade === 'PASS'
          ? 'pass'
          : mine.grade === 'FAIL'
            ? 'fail'
            : 'review'
        : 'nodata';
      const mineHtml = mine
        ? `<div class="gate ${mineClass}">Claude: ${esc(mine.grade)}</div><div class="gatemeta">face ${mine.face}/5 · look ${mine.look}/5</div><p class="note">${esc(mine.note)}</p>`
        : '';
      return `<tr><th class="look"><div class="label">${esc(look.label)}</div><code>${esc(key)}</code><div class="gate ${verdictClass}">stamps: ${g.verdict}</div><div class="gatemeta">clean couples ${g.clean_couples}/${g.couples} · median id ${g.median_identity == null ? '—' : g.median_identity.toFixed(2)}</div>${mineHtml}<details><summary>fragment</summary><p>${esc(look.face_swap_flux_fragment || '')}</p></details></th>${cells}</tr>`;
    })
    .join('\n');
  const head = cols.map(([s, n]) => `<th>${s} #${n}</th>`).join('');
  return `<!doctype html><meta charset="utf-8"><title>Nightly Looks Matrix</title>
<style>
body{margin:0;background:#12100e;color:#f1e9dc;font:14px/1.4 -apple-system,system-ui,sans-serif}
header{padding:18px 24px;border-bottom:1px solid #2b2620}h1{margin:0 0 4px;font-size:20px}header p{margin:0;color:#b8ab99;max-width:110ch}
table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #2b2620;vertical-align:top;padding:8px}
thead th{position:sticky;top:0;background:#1a1613;text-align:left;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#b8ab99}
th.look{width:230px;text-align:left;background:#161310}th.look .label{font-size:16px;font-weight:600}th.look code{color:#9c8f7c;font-size:11px}
.gate{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.06em}
.gate.pass{background:#1f4d33;color:#9fe3b7}.gate.fail{background:#5a2320;color:#ffb3ad}.gate.review{background:#5a4a1e;color:#ffe3a0}.gate.nodata{background:#3a332c;color:#d8cbb6}
.note{font-size:12px;color:#d8cbb6;margin:6px 0 0;max-width:215px;line-height:1.35}
.gatemeta{font-size:11px;color:#9c8f7c;margin-top:4px}details{margin-top:6px;font-size:11px;color:#9c8f7c}details p{margin:4px 0 0;max-width:210px}
td.cell{width:260px}td.cell img{width:250px;height:auto;border-radius:6px;display:block}td.empty{color:#6f6558}
.meta{font-size:11px;color:#b8ab99;margin-top:4px}.ok{color:#9fe3b7}.bad{color:#ffb3ad}
</style>
<header><h1>Nightly Looks Matrix — ${order.length} looks × ${cols.length} renders</h1>
<p>One fixed scene (${esc(PLACE)}), one cast (Kevin + plus_one), flux-1.1-pro, vibe ${VIBE}. Only the look fragment changes between rows. Two verdicts per look: <b>stamps</b> (clean dual swap on both couples, median identity ≥ 0.50) and <b>Claude</b> (a visual grade: does the swapped face blend, is the look distinct). Kevin's hearts in the album are the third. Click any image for full size. Generated ${new Date().toISOString()}.</p></header>
<div style="overflow-x:auto"><table><thead><tr><th>Look</th>${head}</tr></thead><tbody>
${rows}
</tbody></table></div>`;
}

async function main() {
  const looks = await loadLooks();
  if (ARGS['html-only']) {
    const report = loadReport();
    const html = buildHtml(report, looks);
    fs.writeFileSync(HTML, html);
    fs.writeFileSync(DESKTOP_HTML, html);
    console.log(`page: ${HTML}\ncopy: ${DESKTOP_HTML}`);
    return;
  }
  const seed = await loadSeedInput();
  const report = loadReport();
  const plan = [];
  const verify = !!ARGS.verify;
  const targets = verify ? looks.slice(0, 1) : looks;
  const count = verify ? 1 : COUNT;
  for (const look of targets)
    for (let n = 1; n <= count; n++) for (const surface of SURFACES) plan.push([look, surface, n]);
  console.log(`looks: ${targets.length} · renders planned: ${plan.length} · out: ${OUT_DIR}`);
  for (const [look, surface, n] of plan) {
    const done = report.renders.find(
      (r) => r.ok && r.look === look.key && r.surface === surface && r.n === n
    );
    if (done && !verify) {
      console.log(`skip ${look.key} ${surface} #${n} (done)`);
      continue;
    }
    await waitForHeadroom({ min: 25, label: `looks:${look.key}:${surface}#${n}` });
    process.stdout.write(`${look.key} ${surface} #${n} … `);
    const r = await renderOne(look, surface, n, seed);
    report.renders = report.renders.filter(
      (x) => !(x.look === look.key && x.surface === surface && x.n === n)
    );
    report.renders.push(r);
    saveReport(report);
    if (r.ok) {
      console.log(
        `ok ${r.elapsed_s}s · id ${r.identity_sims.map((v) => v.toFixed(2)).join('/') || '—'} · ${r.degraded ? 'DEGRADED' : 'swap ok'} · fragment ${r.honest_fragment_in_prompt ? '✓' : '✗'} · ${r.look_stamp ?? 'NO look stamp'} · exempt ${r.override_exempt}`
      );
    } else {
      console.log(`FAILED ${r.status} ${r.error}`);
    }
  }
  const html = buildHtml(report, looks);
  fs.writeFileSync(HTML, html);
  fs.writeFileSync(DESKTOP_HTML, html);
  const okN = report.renders.filter((r) => r.ok).length;
  console.log(
    `\ndone: ${okN} ok / ${report.renders.length} total\npage: ${HTML}\ncopy: ${DESKTOP_HTML}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
