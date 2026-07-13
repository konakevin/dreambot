#!/usr/bin/env node
/**
 * model-matrix-archive.js — build a portable, committable archive of the
 * model×style render study (July 2026), for historical reference.
 *
 * Reads the local renders + results-*.json from ~/dreambot-model-matrix, shrinks
 * each render to a ~300px JPEG thumbnail (macOS `sips`), and writes a folder:
 *   docs/model-medium-matrix/index.html   — the gallery + findings summary
 *   docs/model-medium-matrix/img/*.jpg    — the optimized thumbnails
 * The HTML references the images by relative path. Committing the thumbnails as
 * BINARY blobs (not inline base64) keeps the HTML tiny and avoids the secret
 * scanner false-positiving on base64 that resembles an AWS key.
 *
 *   node scripts/model-matrix-archive.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC = '/Users/kevinmchenry/dreambot-model-matrix';
const RENDERS = path.join(SRC, 'renders');
const OUT_DIR = path.join(__dirname, '..', 'docs', 'model-medium-matrix');
const IMG_DIR = path.join(OUT_DIR, 'img');
const THUMB = 300; // px, longest side
const QUALITY = 66;

const MODEL_LABEL = {
  'black-forest-labs/flux-schnell': 'Flux 1 Schnell',
  'black-forest-labs/flux-krea-dev': 'Flux Krea',
  'black-forest-labs/flux-dev': 'Flux 1 Dev',
  'black-forest-labs/flux-1.1-pro': 'Flux 1.1 Pro',
  'black-forest-labs/flux-1.1-pro-ultra': 'Flux 1.1 Pro Ultra',
  'black-forest-labs/flux-2-dev': 'Flux 2 Dev',
  'black-forest-labs/flux-2-pro': 'Flux 2 Pro',
  'black-forest-labs/flux-2-flex': 'Flux 2 Flex',
  'black-forest-labs/flux-2-max': 'Flux 2 Max',
  'openai/gpt-image-1': 'GPT Image 1',
  'openai/gpt-image-2': 'GPT Image 2',
  'google/gemini-2-image': 'Nano Banana',
  'google/gemini-3-image-preview': 'Nano Banana Pro',
};
const MODEL_ORDER = Object.keys(MODEL_LABEL);
const ROLE_LABEL = { self: 'Me (self)', plus_one: 'My +1', dual: 'Dual (both)' };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function readAllResults() {
  const merged = new Map();
  const score = (x) => (x.file ? 2 : 0) + (x.verdict ? 1 : 0);
  for (const f of fs.readdirSync(SRC).filter((x) => /^results-\d+\.json$/.test(x))) {
    let arr;
    try { arr = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8')); } catch { continue; }
    for (const r of arr) {
      const k = `${r.medium}|${r.model}|${r.role}`;
      const p = merged.get(k);
      if (!p || score(r) >= score(p)) merged.set(k, r);
    }
  }
  return [...merged.values()];
}

const thumbCache = new Map();
function thumb(file) {
  if (!file) return null;
  if (thumbCache.has(file)) return thumbCache.get(file);
  const src = path.join(RENDERS, file);
  if (!fs.existsSync(src)) { thumbCache.set(file, null); return null; }
  const name = file.replace(/\.png$/i, '.jpg');
  execSync(`sips -Z ${THUMB} -s format jpeg -s formatOptions ${QUALITY} ${JSON.stringify(src)} --out ${JSON.stringify(path.join(IMG_DIR, name))}`, { stdio: 'ignore' });
  const rel = `img/${name}`;
  thumbCache.set(file, rel);
  return rel;
}

function cell(r) {
  if (!r) return '<td class="empty">—</td>';
  const vc = r.verdict === 'PASS' ? 'pass' : r.verdict === 'FAIL' ? 'fail' : r.verdict === 'WEAK' ? 'weak' : '';
  const rel = thumb(r.file);
  const img = rel
    ? `<img loading="lazy" src="${rel}" onclick="zoom(this.src)">`
    : `<div class="failbox">${esc(r.status || 'no render')}</div>`;
  const v = r.verdict ? `<div class="verdict ${vc}">${esc(r.verdict)}</div>` : '';
  const n = r.note ? `<div class="note">${esc(r.note)}</div>` : '';
  return `<td class="${vc}">${img}${v}${n}</td>`;
}

const FINDINGS = `
<section class="findings">
  <h2>Key findings</h2>
  <p><b>Study:</b> every model the app offers × every real-face style × three face-swap
  configurations (me / my +1 / both), one fixed scene per style, neutral vibe. 252 renders.</p>
  <p><b>Verdict — style fidelity is model-driven, not prompt-driven.</b> The prompt always carried the
  correct style; whether the render honored it came down to the model.</p>
  <ul>
    <li><span class="tag pass">HONORS STYLE</span> Flux 2 (Max / Flex / Pro / Dev), GPT Image 1 &amp; 2,
      Nano Banana, Nano Banana Pro — render watercolor as watercolor, pop-art as pop-art, etc.</li>
    <li><span class="tag fail">DRIFTS PHOTOREAL</span> Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 1 Dev —
      flatten stylized styles into photos. <b>Correct only for photography.</b></li>
    <li><span class="tag weak">EXCLUDED</span> Flux 1 Schnell (crude + weak face swaps), Flux Krea (timed out).</li>
  </ul>
  <p><b>Style nuance:</b> painterly styles (watercolor, pencil, canvas-oil) expose the photoreal drift
  worst; graphic styles (pop-art, comics, illustration) are more forgiving. Photography is the control —
  every model passes there, and the Flux-1 family is actually the best choice.</p>
  <p><b>Outcome:</b> this study drove <b>DreamSmart</b> — per-style curation of the model list, offering
  only models proven to hold the chosen style.</p>
</section>`;

const PAGE = (sections, ok) => `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DreamBot — Model × Style Render Matrix</title>
<style>
  body{background:#0e0e12;color:#e8e8ea;font:14px -apple-system,system-ui,sans-serif;margin:0;padding:24px}
  h1{font-size:22px;margin:0 0 2px}
  h2{font-size:16px;text-transform:capitalize;margin:30px 0 2px;color:#c9b6ff}
  .sub{color:#8a8a92;margin-bottom:6px}
  .scene{color:#8a8a92;font-size:12px;font-style:italic;margin-bottom:10px}
  .findings{background:#14141a;border:1px solid #23232b;border-radius:12px;padding:18px 20px;margin:18px 0 8px;max-width:900px}
  .findings h2{color:#c9b6ff;margin-top:0;text-transform:none}
  .findings p{line-height:1.5;color:#cfcfd6} .findings ul{margin:10px 0;padding-left:0;list-style:none}
  .findings li{margin:8px 0;line-height:1.5}
  .tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.5px;padding:2px 7px;border-radius:5px;margin-right:6px;vertical-align:middle}
  .tag.pass{background:rgba(60,200,120,.15);color:#5fd39a} .tag.fail{background:rgba(240,90,90,.15);color:#ff7676} .tag.weak{background:rgba(240,180,70,.15);color:#ffc861}
  .scroll{overflow-x:auto;border:1px solid #23232b;border-radius:10px}
  table{border-collapse:collapse}
  th,td{border:1px solid #23232b;padding:6px;vertical-align:top;text-align:center}
  thead th{position:sticky;top:0;background:#16161c;font-size:11px;white-space:nowrap;padding:8px 6px;z-index:1}
  .rowh{position:sticky;left:0;background:#16161c;font-size:12px;white-space:nowrap;text-align:right;padding:6px 10px;z-index:2}
  img{width:150px;height:auto;display:block;border-radius:6px;cursor:zoom-in}
  td.pass{background:rgba(60,200,120,.08)} td.fail{background:rgba(240,90,90,.10)} td.weak{background:rgba(240,180,70,.10)}
  .verdict{font-weight:700;font-size:11px;margin-top:4px}
  .verdict.pass{color:#5fd39a} .verdict.fail{color:#ff7676} .verdict.weak{color:#ffc861}
  .note{font-size:10px;color:#b0b0b8;margin-top:2px;max-width:150px}
  .failbox{width:150px;height:120px;display:flex;align-items:center;justify-content:center;background:#1b1b22;color:#ff7676;font-size:11px;border-radius:6px}
  .empty{color:#555}
  #lb{position:fixed;inset:0;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;cursor:zoom-out;z-index:99}
  #lb img{width:auto;max-width:92vw;max-height:92vh}
</style></head><body>
<h1>DreamBot — Model × Style render matrix</h1>
<div class="sub">Historical study, July 2026 · ${ok} renders · same scene per style · rows = cast (me / my +1 / both) · columns = model · green = honored the style, red = flattened to photo · click a render to enlarge.</div>
${FINDINGS}
${sections}
<div id="lb" onclick="this.style.display='none'"><img id="lbimg"></div>
<script>function zoom(s){document.getElementById('lbimg').src=s;document.getElementById('lb').style.display='flex'}</script>
</body></html>`;

// ── Build ────────────────────────────────────────────────────────────────────
// Fresh output dir (also removes the old inline-base64 single HTML if present).
fs.rmSync(path.join(__dirname, '..', 'docs', 'model-medium-matrix.html'), { force: true });
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(IMG_DIR, { recursive: true });

const results = readAllResults();
const byMedium = {};
for (const r of results) (byMedium[r.medium] ||= []).push(r);
const idx = (m, model, role) => (byMedium[m] || []).find((r) => r.model === model && r.role === role);
const order = Object.keys(byMedium).sort((a, b) => (a === 'photography' ? -1 : b === 'photography' ? 1 : a.localeCompare(b)));
let ok = 0;
let sections = '';
for (const medium of order) {
  let rows = '';
  for (const role of ['self', 'plus_one', 'dual']) {
    let cells = '';
    for (const model of MODEL_ORDER) { const r = idx(medium, model, role); if (r && r.file) ok++; cells += cell(r); }
    rows += `<tr><th class="rowh">${ROLE_LABEL[role]}</th>${cells}</tr>`;
  }
  const heads = MODEL_ORDER.map((m) => `<th>${esc(MODEL_LABEL[m])}</th>`).join('');
  const scene = (byMedium[medium].find((r) => r.scene) || {}).scene || '';
  sections += `<section><h2>${esc(medium)}</h2>${scene ? `<div class="scene">scene: ${esc(scene)}</div>` : ''}
    <div class="scroll"><table><thead><tr><th class="rowh"></th>${heads}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), PAGE(sections, ok));
const imgMB = (fs.readdirSync(IMG_DIR).reduce((a, f) => a + fs.statSync(path.join(IMG_DIR, f)).size, 0) / 1024 / 1024).toFixed(1);
console.log(`Wrote ${OUT_DIR}/index.html + img/ — ${ok} thumbnails, ${imgMB} MB total`);
