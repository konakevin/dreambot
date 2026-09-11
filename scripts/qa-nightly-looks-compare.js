#!/usr/bin/env node
/**
 * Nightly LOOKS — cross-model comparison page (Phase A, round 2). Reads the per-model matrix reports written by
 * qa-nightly-looks-matrix.js (report.json + grades_by_surface.json per model dir) and lays every look out
 * side by side: for each surface, the renders from each model, with each model's per-surface verdict pill.
 * Also prints the FINAL APPROVAL MATRIX (look × model → approved surfaces) at the top.
 *
 *   node scripts/qa-nightly-looks-compare.js                     # default models: flux-1.1-pro, grok-imagine-image, gemini-2-image
 *   node scripts/qa-nightly-looks-compare.js --models=flux-1.1-pro,grok-imagine-image
 *   node scripts/qa-nightly-looks-compare.js --registry     # also rewrite the generated block in REAL_FACE_LOOKS_REGISTRY.md
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const BASE =
  process.env.LOOKS_BASE_DIR ||
  '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/looks';
const ARGS = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const MODELS = (
  ARGS.models ? String(ARGS.models) : 'flux-1.1-pro,grok-imagine-image,gemini-2-image'
).split(',');
const dirFor = (slug) => path.join(BASE, slug === 'flux-1.1-pro' ? 'matrix' : `matrix-${slug}`);
const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null);

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');

const data = MODELS.map((slug) => {
  const dir = dirFor(slug);
  const report = readJson(path.join(dir, 'report.json')) || { renders: [] };
  const grades = readJson(path.join(dir, 'grades_by_surface.json')) || {};
  return { slug, dir, renders: report.renders.filter((r) => r.ok), grades };
});
const labels = {};
const order = [];
for (const d of data)
  for (const r of d.renders) {
    labels[r.look] = r.label;
    if (!order.includes(r.look)) order.push(r.look);
  }
const COUNT = Math.max(2, ...data.flatMap((d) => d.renders.map((r) => r.n)));

function pill(v) {
  if (!v) return '<span class="pill nodata">not run</span>';
  const cls = v === 'PASS' ? 'pass' : 'fail';
  return `<span class="pill ${cls}">${esc(v)}</span>`;
}
function verdictFor(d, look, surface) {
  const g = d.grades[look];
  if (!g) return { v: null, why: '' };
  return { v: g[surface] || null, why: g[`${surface}_reason`] || '' };
}
function cells(d, look, surface) {
  let out = '';
  for (let n = 1; n <= COUNT; n++) {
    const r = d.renders.find((x) => x.look === look && x.surface === surface && x.n === n);
    out += r
      ? `<td class="cell"><a href="${esc(r.image_url)}" target="_blank"><img src="${esc(r.image_url)}" loading="lazy"></a><div class="meta">id ${(r.identity_sims || []).map((v) => v.toFixed(2)).join('/') || '—'}${r.degraded ? ' · <b class="bad">degraded</b>' : ''}</div></td>`
      : '<td class="cell empty">—</td>';
  }
  return out;
}

// Final approval matrix: look × model → approved surfaces (from each model's grades; missing = not graded yet)
const approvalRows = order
  .map((look) => {
    const tds = data
      .map((d) => {
        const g = d.grades[look];
        if (!g) return '<td class="nodata">—</td>';
        const s = ['couple', 'solo'].filter((k) => g[k] === 'PASS');
        return `<td class="${s.length === 2 ? 'both' : s.length === 1 ? 'one' : 'none'}">${s.length ? s.join(' + ') : 'none'}</td>`;
      })
      .join('');
    return `<tr><th>${esc(labels[look])}<br><code>${esc(look)}</code></th>${tds}</tr>`;
  })
  .join('\n');

const surfaceRows = order
  .map((look) => {
    return ['couple', 'solo']
      .map((surface, i) => {
        const head =
          i === 0
            ? `<th class="look" rowspan="2"><div class="label">${esc(labels[look])}</div><code>${esc(look)}</code></th>`
            : '';
        const modelCells = data
          .map((d) => {
            const { v, why } = verdictFor(d, look, surface);
            return `<td class="verdict">${pill(v)}${why ? `<p>${esc(why)}</p>` : ''}</td>${cells(d, look, surface)}`;
          })
          .join('');
        return `<tr class="${surface}">${head}<td class="surface">${surface}</td>${modelCells}</tr>`;
      })
      .join('\n');
  })
  .join('\n');

const modelHead = data.map((d) => `<th colspan="${1 + COUNT}">${esc(d.slug)}</th>`).join('');
const subHead = data
  .map(
    () =>
      `<th>verdict</th>${Array.from({ length: COUNT }, (_, i) => `<th>#${i + 1}</th>`).join('')}`
  )
  .join('');

const page = `<!doctype html><meta charset="utf-8"><title>Nightly Looks Model Comparison</title>
<style>
body{margin:0;background:#12100e;color:#f1e9dc;font:14px/1.45 -apple-system,system-ui,sans-serif}
header{padding:18px 24px;border-bottom:1px solid #2b2620}h1{margin:0 0 6px;font-size:20px}h2{font-size:16px;margin:18px 24px 8px}
header p{margin:4px 0;color:#b8ab99;max-width:120ch}
table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #2b2620;vertical-align:top;padding:7px}
thead th{position:sticky;top:0;background:#1a1613;text-align:left;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#b8ab99;z-index:1}
th.look{width:150px;text-align:left;background:#161310}th.look .label{font-size:15px;font-weight:600}th.look code{color:#9c8f7c;font-size:11px}
td.surface{width:60px;color:#b8ab99;font-size:12px;text-transform:uppercase;letter-spacing:.06em;background:#151210}
td.verdict{width:170px;background:#151210}td.verdict p{margin:5px 0 0;font-size:11px;color:#d8cbb6;line-height:1.3}
.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.06em}
.pill.pass{background:#1f4d33;color:#9fe3b7}.pill.fail{background:#5a2320;color:#ffb3ad}.pill.nodata{background:#3a332c;color:#d8cbb6}
td.cell{width:150px}td.cell img{width:140px;height:auto;border-radius:5px;display:block}td.empty{color:#6f6558}
.meta{font-size:10px;color:#9c8f7c;margin-top:3px}.bad{color:#ffb3ad}
table.approval{width:auto;margin:0 24px 12px}table.approval th{text-align:left}table.approval td{text-align:center;padding:6px 14px;font-weight:600}
table.approval td.both{color:#9fe3b7}table.approval td.one{color:#ffe3a0}table.approval td.none{color:#ffb3ad}table.approval td.nodata{color:#6f6558}
</style>
<header><h1>Nightly Looks — model comparison</h1>
<p>Same fixed scene, same cast, same forced slots; only the model (and the look) changes. Verdicts are Claude's per-surface visual grades; Kevin's hearts in the album decide.</p></header>
<h2>Final approval matrix (look × model → approved surfaces)</h2>
<table class="approval"><thead><tr><th>Look</th>${data.map((d) => `<th>${esc(d.slug)}</th>`).join('')}</tr></thead><tbody>
${approvalRows}
</tbody></table>
<h2>Side by side</h2>
<div style="overflow-x:auto"><table><thead><tr><th rowspan="2">Look</th><th rowspan="2">Surface</th>${modelHead}</tr><tr>${subHead}</tr></thead><tbody>
${surfaceRows}
</tbody></table></div>`;
// --registry: rewrite the generated approval-matrix block in REAL_FACE_LOOKS_REGISTRY.md (the live doc).
if (ARGS.registry) {
  const reg = path.join(process.cwd(), 'REAL_FACE_LOOKS_REGISTRY.md');
  const md = fs.readFileSync(reg, 'utf8');
  const start = '<!-- approval-matrix:start -->';
  const end = '<!-- approval-matrix:end -->';
  const head = `| Look | key | ${data.map((d) => d.slug).join(' | ')} |\n|---|---|${data.map(() => '---').join('|')}|`;
  const lines = order.map((look) => {
    const cellsMd = data
      .map((d) => {
        const g = d.grades[look];
        if (!g) return '—';
        const s = ['couple', 'solo'].filter((k) => g[k] === 'PASS');
        return s.length === 2 ? '**couple + solo**' : s.length === 1 ? s[0] : 'none';
      })
      .join(' | ');
    return `| ${labels[look]} | \`${look}\` | ${cellsMd} |`;
  });
  const block = `${start}\n_Generated ${new Date().toISOString().slice(0, 10)} from ${data
    .map((d) => `${d.slug} (${d.renders.length} renders, ${Object.keys(d.grades).length} graded)`)
    .join(
      ', '
    )}. Verdicts by eye per surface; reasons in each model's grades_by_surface.json and the Desktop pages._\n\n${head}\n${lines.join('\n')}\n${end}`;
  const i = md.indexOf(start);
  const j = md.indexOf(end);
  if (i < 0 || j < 0) throw new Error('registry markers missing');
  fs.writeFileSync(reg, md.slice(0, i) + block + md.slice(j + end.length));
  console.log(
    `registry: ${reg} (approval matrix regenerated, ${order.length} looks × ${data.length} models)`
  );
}

const out = path.join(BASE, 'nightly-looks-compare.html');
fs.writeFileSync(out, page);
const desk = path.join(os.homedir(), 'Desktop', 'nightly-looks-compare.html');
fs.writeFileSync(desk, page);
console.log(
  `models: ${data.map((d) => `${d.slug} (${d.renders.length} renders, ${Object.keys(d.grades).length} graded)`).join(' · ')}\npage: ${out}\ncopy: ${desk}`
);
