#!/usr/bin/env node
/**
 * model-matrix-page.js — build a static HTML gallery from a model-matrix results
 * JSON so Kevin can eyeball how every model renders every real-face medium.
 *
 * Reads /Users/kevinmchenry/dreambot-model-matrix/results-*.json (or an arg) and
 * writes index.html next to it, referencing the local renders/ images. Open it
 * straight from disk in a browser.
 *
 *   node scripts/model-matrix-page.js [results-39.json]
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/Users/kevinmchenry/dreambot-model-matrix';

// Model display labels + family grouping (mirrors constants/imageModels.ts).
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

// Merge every results-*.json in the dir (pilot + full run + re-runs) keyed by
// medium|model|role — prefer a cell that has a render, then one with a verdict.
function readAllResults() {
  const files = fs.readdirSync(OUT_DIR).filter((f) => /^results-\d+\.json$/.test(f));
  if (!files.length) throw new Error('no results-*.json found in ' + OUT_DIR);
  const merged = new Map();
  const score = (x) => (x.file ? 2 : 0) + (x.verdict ? 1 : 0);
  for (const f of files) {
    let arr;
    try {
      arr = JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), 'utf8'));
    } catch {
      continue;
    }
    for (const r of arr) {
      const key = `${r.medium}|${r.model}|${r.role}`;
      const prev = merged.get(key);
      if (!prev || score(r) >= score(prev)) merged.set(key, r);
    }
  }
  return [...merged.values()];
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function cell(r) {
  if (!r) return `<td class="empty">—</td>`;
  const verdictClass =
    r.verdict === 'PASS' ? 'pass' : r.verdict === 'FAIL' ? 'fail' : r.verdict === 'WEAK' ? 'weak' : '';
  const img = r.file
    ? `<a href="renders/${esc(r.file)}" target="_blank"><img loading="lazy" src="renders/${esc(r.file)}"></a>`
    : `<div class="failbox">${esc(r.status || 'no render')}</div>`;
  const actual = r.actualModel && r.actualModel !== r.model
    ? `<div class="actual">→ ${esc(MODEL_LABEL[r.actualModel] || r.actualModel)}</div>`
    : '';
  const verdict = r.verdict ? `<div class="verdict ${verdictClass}">${esc(r.verdict)}</div>` : '';
  const note = r.note ? `<div class="note">${esc(r.note)}</div>` : '';
  return `<td class="${verdictClass}">${img}${verdict}${note}${actual}</td>`;
}

function build(results) {
  const byMedium = {};
  for (const r of results) (byMedium[r.medium] ||= []).push(r);
  const idx = (medium, model, role) =>
    (byMedium[medium] || []).find((r) => r.model === model && r.role === role);

  let sections = '';
  for (const medium of Object.keys(byMedium).sort()) {
    let rows = '';
    for (const role of ['self', 'plus_one', 'dual']) {
      let cells = '';
      for (const model of MODEL_ORDER) cells += cell(idx(medium, model, role));
      rows += `<tr><th class="rowh">${ROLE_LABEL[role]}</th>${cells}</tr>`;
    }
    const heads = MODEL_ORDER.map((m) => `<th>${esc(MODEL_LABEL[m])}</th>`).join('');
    const scene = (byMedium[medium].find((r) => r.scene) || {}).scene || '';
    sections += `<section><h2>${esc(medium)}</h2>${scene ? `<div class="scene">scene: ${esc(scene)}</div>` : ''}
      <div class="scroll"><table><thead><tr><th class="rowh"></th>${heads}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  const ok = results.filter((r) => r.file).length;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Model × Medium matrix</title>
<style>
  body{background:#0e0e12;color:#e8e8ea;font:14px -apple-system,system-ui,sans-serif;margin:0;padding:24px}
  h1{font-size:20px;margin:0 0 4px} .sub{color:#8a8a92;margin-bottom:20px}
  h2{font-size:16px;text-transform:capitalize;margin:28px 0 2px;color:#c9b6ff}
  .scene{color:#8a8a92;font-size:12px;font-style:italic;margin-bottom:10px}
  .scroll{overflow-x:auto;border:1px solid #23232b;border-radius:10px}
  table{border-collapse:collapse}
  th,td{border:1px solid #23232b;padding:6px;vertical-align:top;text-align:center}
  thead th{position:sticky;top:0;background:#16161c;font-size:11px;white-space:nowrap;padding:8px 6px}
  .rowh{position:sticky;left:0;background:#16161c;font-size:12px;white-space:nowrap;text-align:right;padding:6px 10px;z-index:2}
  img{width:150px;height:auto;display:block;border-radius:6px}
  td.pass{background:rgba(60,200,120,.08)} td.fail{background:rgba(240,90,90,.10)} td.weak{background:rgba(240,180,70,.10)}
  .verdict{font-weight:700;font-size:11px;margin-top:4px}
  .verdict.pass{color:#5fd39a} .verdict.fail{color:#ff7676} .verdict.weak{color:#ffc861}
  .note{font-size:10px;color:#b0b0b8;margin-top:2px;max-width:150px}
  .actual{font-size:10px;color:#ffcf6b;margin-top:2px}
  .failbox{width:150px;height:120px;display:flex;align-items:center;justify-content:center;background:#1b1b22;color:#ff7676;font-size:11px;border-radius:6px}
  .empty{color:#555}
</style></head><body>
<h1>Model × Medium render matrix</h1>
<div class="sub">${ok}/${results.length} renders · same scene ("coffee at a cafe") · rows = cast (self / +1 / dual) · columns = model. Green = medium honored, red = flattened. Click a render to enlarge.</div>
${sections}
</body></html>`;
}

const results = readAllResults();
const html = build(results);
const out = path.join(OUT_DIR, 'index.html');
fs.writeFileSync(out, html);
console.log(`Wrote ${out} (${results.length} cells merged from all results-*.json)`);
