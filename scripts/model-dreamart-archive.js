#!/usr/bin/env node
/**
 * model-dreamart-archive.js — portable, committable archive of the Dream Art
 * model×style render study (July 2026). Mirrors model-matrix-archive.js (the
 * real-face gallery): shrinks each render to a ~300px JPEG thumbnail, writes a
 * self-contained folder (index.html + img/*.jpg referenced by relative path), so
 * committing the binary thumbnails keeps the HTML tiny and dodges the secret
 * scanner. Each cell is marked PASS/FAIL by whether that model is in the style's
 * curated smart_dream_models set (the DreamSmart curation this study produced).
 *
 *   node scripts/model-dreamart-archive.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC = '/Users/kevinmchenry/dreambot-model-matrix';
const RENDERS = path.join(SRC, 'renders');
const OUT_DIR = path.join(__dirname, '..', 'docs', 'model-dreamart-matrix');
const IMG_DIR = path.join(OUT_DIR, 'img');
const THUMB = 300;
const QUALITY = 66;

// Column order + labels.
const MODELS = [
  { id: 'black-forest-labs/flux-dev', k: 'f1dev', label: 'Flux 1 Dev' },
  { id: 'black-forest-labs/flux-1.1-pro', k: 'f11pro', label: 'Flux 1.1 Pro' },
  { id: 'black-forest-labs/flux-1.1-pro-ultra', k: 'f11ultra', label: 'Flux 1.1 Pro Ultra' },
  { id: 'black-forest-labs/flux-2-dev', k: 'f2dev', label: 'Flux 2 Dev' },
  { id: 'black-forest-labs/flux-2-pro', k: 'f2pro', label: 'Flux 2 Pro' },
  { id: 'black-forest-labs/flux-2-flex', k: 'f2flex', label: 'Flux 2 Flex' },
  { id: 'black-forest-labs/flux-2-max', k: 'f2max', label: 'Flux 2 Max' },
  { id: 'openai/gpt-image-1', k: 'gpt1', label: 'GPT Image 1' },
  { id: 'openai/gpt-image-2', k: 'gpt2', label: 'GPT Image 2' },
  { id: 'google/gemini-2-image', k: 'nb', label: 'Nano Banana' },
  { id: 'google/gemini-3-image-preview', k: 'nbpro', label: 'Nano Banana Pro' },
];
const ALL = MODELS.map((m) => m.k);
const ROLES = [
  { key: 'self', label: 'Me (self)' },
  { key: 'plus_one', label: 'My +1' },
  { key: 'dual', label: 'Dual (both)' },
];
// The curated PASS set per style (== smart_dream_models written to the DB).
const SETS = {
  anime: ALL,
  claymation: ALL,
  animation: ['f11pro', 'f11ultra', 'f2flex', 'nbpro'],
  fairytale: ALL,
  storybook: ['f11pro', 'f2max', 'gpt2', 'nb', 'nbpro'],
  pixels: ['gpt1', 'gpt2', 'nb', 'nbpro'],
  handcrafted: ALL,
  kawaii: ALL,
};
const STYLE_ORDER = [
  'anime',
  'claymation',
  'animation',
  'fairytale',
  'storybook',
  'pixels',
  'handcrafted',
  'kawaii',
];
const STYLE_NOTE = {
  anime: 'Every model nails anime and keeps the beard — all pass.',
  claymation: 'Clay holds the likeness across the board — all pass.',
  animation:
    'MEDIUM PROMPT CLEANED (dropped Pixar/Disney/Dreamworks + the "cute-kid" language, added a keep-adult lock). Renders adults now; kept the models that clearly ANIMATE (the rest go semi-photoreal).',
  fairytale:
    'MEDIUM PROMPT CLEANED (dropped "Disney", added a gender+beard lock). Was princes/princesses/wrong-gender; now all models hold a bearded-you in the storybook style.',
  storybook: 'Excluded models skew too young / clean-shaven.',
  pixels: 'Only GPT + Gemini truly pixelate a person; Flux renders smooth illustration.',
  handcrafted:
    'MEDIUM PROMPT CLEANED (dropped "craft world/diorama", cast-count lock). Was a doll-crowd; now a single/dual hero doll, correct count, LBP/Sackboy look kept.',
  kawaii:
    'MEDIUM PROMPT CLEANED (dropped Sanrio/Pop-Mart, added a prominent-beard lock). Was beardless chibi; now every model keeps the bearded adult you.',
};

const slug = (id) => id.replace(/[^a-z0-9]/gi, '-');
const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const thumbCache = new Map();
function thumb(file) {
  if (thumbCache.has(file)) return thumbCache.get(file);
  const src = path.join(RENDERS, file);
  if (!fs.existsSync(src)) {
    thumbCache.set(file, null);
    return null;
  }
  const name = file.replace(/\.png$/i, '.jpg');
  execSync(
    `sips -Z ${THUMB} -s format jpeg -s formatOptions ${QUALITY} ${JSON.stringify(src)} --out ${JSON.stringify(path.join(IMG_DIR, name))}`,
    { stdio: 'ignore' }
  );
  const rel = `img/${name}`;
  thumbCache.set(file, rel);
  return rel;
}

function cell(style, model, role) {
  const pass = SETS[style].includes(model.k);
  const file = `${style}__${slug(model.id)}__${role}.png`;
  const rel = thumb(file);
  const cls = pass ? 'pass' : 'fail';
  const img = rel
    ? `<img loading="lazy" src="${rel}" onclick="zoom(this.src)">`
    : `<div class="failbox">no render</div>`;
  const badge = `<div class="verdict ${cls}">${pass ? 'PASS' : 'FAIL'}</div>`;
  return `<td class="${cls}">${img}${badge}</td>`;
}

const FINDINGS = `
<section class="findings">
  <h2>Key findings</h2>
  <p><b>Study:</b> every DreamBot model × every embodied Dream Art style × three cast
  configs (me / my +1 / both), one fixed scene per style. 264 renders.</p>
  <p><b>Bar:</b> a pass requires BOTH the style (anime looks anime, clay looks clay) AND a
  recognizable <i>look-alike</i> of the cast (bearded man / dark-haired woman), not just the style.</p>
  <ul>
    <li><span class="tag pass">ALL MODELS PASS</span> anime, claymation — the character carries the
      likeness on every model.</li>
    <li><span class="tag part">CURATED</span> animation, fairytale, storybook, pixels — the style's
      prior overrides the cast on some models (young-boy / clean-shaven-prince / smooth-not-pixel),
      so only the resembling models are kept.</li>
    <li><span class="tag weak">LOOSE LIKENESS</span> handcrafted (yarn dolls), kawaii (chibi) — the
      aesthetic erases adult-male features; passes are the best-quality, but resemblance is loose.</li>
  </ul>
  <p><b>Outcome:</b> each style stays a Dream Art style; its <code>smart_dream_models</code> is set to
  its passing models (the DreamSmart checkbox curates to those). Every medium keeps a non-empty set so
  the checkbox is always visible.</p>
</section>`;

const PAGE = (sections, ok) => `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DreamBot — Dream Art Model × Style Matrix</title>
<style>
  body{background:#0e0e12;color:#e8e8ea;font:14px -apple-system,system-ui,sans-serif;margin:0;padding:24px}
  h1{font-size:22px;margin:0 0 2px} h2{font-size:16px;text-transform:capitalize;margin:30px 0 2px;color:#c9b6ff}
  .sub{color:#8a8a92;margin-bottom:6px} .note{color:#8a8a92;font-size:12px;font-style:italic;margin-bottom:10px}
  .findings{background:#14141a;border:1px solid #23232b;border-radius:12px;padding:18px 20px;margin:18px 0 8px;max-width:920px}
  .findings h2{color:#c9b6ff;margin-top:0;text-transform:none} .findings p{line-height:1.5;color:#cfcfd6}
  .findings ul{margin:10px 0;padding-left:0;list-style:none} .findings li{margin:8px 0;line-height:1.5}
  .tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.5px;padding:2px 7px;border-radius:5px;margin-right:6px;vertical-align:middle}
  .tag.pass{background:rgba(60,200,120,.15);color:#5fd39a} .tag.part{background:rgba(120,160,255,.15);color:#8fb3ff} .tag.weak{background:rgba(240,180,70,.15);color:#ffc861}
  .scroll{overflow-x:auto;border:1px solid #23232b;border-radius:10px}
  table{border-collapse:collapse} th,td{border:1px solid #23232b;padding:6px;vertical-align:top;text-align:center}
  thead th{position:sticky;top:0;background:#16161c;font-size:11px;white-space:nowrap;padding:8px 6px;z-index:1}
  .rowh{position:sticky;left:0;background:#16161c;font-size:12px;white-space:nowrap;text-align:right;padding:6px 10px;z-index:2}
  img{width:150px;height:auto;display:block;border-radius:6px;cursor:zoom-in}
  td.pass{background:rgba(60,200,120,.08)} td.fail{background:rgba(240,90,90,.10)}
  .verdict{font-weight:700;font-size:11px;margin-top:4px} .verdict.pass{color:#5fd39a} .verdict.fail{color:#ff7676}
  .failbox{width:150px;height:120px;display:flex;align-items:center;justify-content:center;background:#1b1b22;color:#ff7676;font-size:11px;border-radius:6px}
  #lb{position:fixed;inset:0;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;cursor:zoom-out;z-index:99}
  #lb img{width:auto;max-width:92vw;max-height:92vh}
</style></head><body>
<h1>DreamBot — Dream Art model × style matrix</h1>
<div class="sub">Historical study, July 2026 · ${ok} renders · rows = cast (me / my +1 / both) · columns = model · green = kept in the style's DreamSmart set (style + resemblance) · red = excluded · click a render to enlarge.</div>
${FINDINGS}
${sections}
<div id="lb" onclick="this.style.display='none'"><img id="lbimg"></div>
<script>function zoom(s){document.getElementById('lbimg').src=s;document.getElementById('lb').style.display='flex'}</script>
</body></html>`;

// ── Build ────────────────────────────────────────────────────────────────────
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(IMG_DIR, { recursive: true });

let ok = 0;
let sections = '';
for (const style of STYLE_ORDER) {
  const heads = MODELS.map((m) => `<th>${esc(m.label)}<br><small style="color:#8a8a92">${SETS[style].includes(m.k) ? 'in set' : '—'}</small></th>`).join('');
  let rows = '';
  for (const role of ROLES) {
    let cells = '';
    for (const model of MODELS) {
      const file = `${style}__${slug(model.id)}__${role.key}.png`;
      if (fs.existsSync(path.join(RENDERS, file))) ok++;
      cells += cell(style, model, role.key);
    }
    rows += `<tr><th class="rowh">${role.label}</th>${cells}</tr>`;
  }
  const passCount = SETS[style].length;
  sections += `<section><h2>${esc(style)} <small style="color:#8a8a92;font-weight:400">(${passCount}/11 models kept)</small></h2>
    <div class="note">${esc(STYLE_NOTE[style] || '')}</div>
    <div class="scroll"><table><thead><tr><th class="rowh"></th>${heads}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), PAGE(sections, ok));
const imgMB = (fs.readdirSync(IMG_DIR).reduce((a, f) => a + fs.statSync(path.join(IMG_DIR, f)).size, 0) / 1024 / 1024).toFixed(1);
console.log(`Wrote ${OUT_DIR}/index.html + img/ — ${ok} thumbnails, ${imgMB} MB total`);
