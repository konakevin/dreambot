#!/usr/bin/env node
/**
 * model-matrix-regrade-page.js — focused HTML grading page for a MODEL REGRADE
 * (DREAMSMART_MODEL_VALIDATION.md §5). Rows = every style rendered, columns =
 * the model(s) under test, each cell = the self face-swap render PLUS that
 * style's CURRENT DreamSmart membership for the model (IN / OUT) so the delta a
 * grade would produce is obvious at a glance.
 *
 * Reads the latest ~/dreambot-model-matrix/results-<N>.json (the self renders),
 * queries dream_mediums.client_meta for current membership, writes regrade.html
 * next to the renders. Open it from disk.
 *
 *   node scripts/model-matrix-regrade-page.js [results-40.json]
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/Users/kevinmchenry/dreambot-model-matrix';
const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MODEL_LABEL = {
  'black-forest-labs/flux-1.1-pro': 'Flux 1.1 Pro',
  'black-forest-labs/flux-1.1-pro-ultra': 'Flux 1.1 Pro Ultra',
  'black-forest-labs/flux-2-pro': 'Flux 2 Pro',
  'black-forest-labs/flux-2-dev': 'Flux 2 Dev',
  'black-forest-labs/flux-2-flex': 'Flux 2 Flex',
  'black-forest-labs/flux-2-max': 'Flux 2 Max',
  'black-forest-labs/flux-dev': 'Flux 1 Dev',
  'black-forest-labs/flux-schnell': 'Flux 1 Schnell',
  'openai/gpt-image-1': 'GPT Image 1',
  'openai/gpt-image-2': 'GPT Image 2',
  'google/gemini-2-image': 'Nano Banana',
  'google/gemini-3-image-preview': 'Nano Banana Pro',
  'xai/grok-imagine-image': 'Grok Imagine',
};
const label = (m) => MODEL_LABEL[m] || m;

const esc = (s) =>
  String(s == null ? '' : s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );

function pickResultsFile() {
  const arg = process.argv[2];
  if (arg) return path.join(OUT_DIR, arg);
  // Newest by mtime (NOT highest N — a stale big run outranks a fresh small one).
  const files = fs
    .readdirSync(OUT_DIR)
    .filter((f) => /^results-\d+\.json$/.test(f))
    .map((f) => ({ f, mtime: fs.statSync(path.join(OUT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (!files.length) throw new Error('no results-*.json in ' + OUT_DIR);
  return path.join(OUT_DIR, files[0].f);
}

(async () => {
  const results = JSON.parse(fs.readFileSync(pickResultsFile(), 'utf8')).filter(
    (r) => r.role === 'self'
  );
  const models = [...new Set(results.map((r) => r.model))];
  const mediums = [...new Set(results.map((r) => r.medium))];

  // Current membership per style, for the models under test.
  const { data: rows } = await sb
    .from('dream_mediums')
    .select('key,label,sort_order,client_meta')
    .order('sort_order');
  const meta = new Map(rows.map((r) => [r.key, r]));
  const inSet = (medium, model) => {
    const set = meta.get(medium)?.client_meta?.smart_dream_models || [];
    return set.includes(model);
  };
  // Order rows by the style's sort_order so it reads like the UI picker.
  mediums.sort((a, b) => (meta.get(a)?.sort_order ?? 999) - (meta.get(b)?.sort_order ?? 999));

  const cell = (medium, model) => {
    const r = results.find((x) => x.medium === medium && x.model === model);
    const member = inSet(medium, model);
    const badge = `<span class="badge ${member ? 'in' : 'out'}">${member ? 'IN' : 'OUT'}</span>`;
    if (!r || !r.file) {
      return `<td><div class="failbox">${esc((r && r.status) || 'no render')}</div>${badge}</td>`;
    }
    const drift = (r.fallback || []).length
      ? `<div class="note">${esc(r.fallback.join(', '))}</div>`
      : '';
    return `<td><a href="renders/${esc(r.file)}" target="_blank"><img loading="lazy" src="renders/${esc(
      r.file
    )}"></a>${badge}${drift}</td>`;
  };

  let body = '';
  for (const medium of mediums) {
    const styleLabel = meta.get(medium)?.label || medium;
    const cells = models.map((m) => cell(medium, m)).join('');
    body += `<tr><th class="rowh"><div class="skey">${esc(styleLabel)}</div><div class="ssub">${esc(
      medium
    )}</div></th>${cells}</tr>`;
  }
  const heads = models.map((m) => `<th>${esc(label(m))}</th>`).join('');
  const ok = results.filter((r) => r.file).length;

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>DreamSmart regrade — ${models
    .map(label)
    .join(' + ')}</title>
<style>
  body{background:#0e0e12;color:#e8e8ea;font:14px -apple-system,system-ui,sans-serif;margin:0;padding:24px}
  h1{font-size:20px;margin:0 0 4px}
  .sub{color:#8a8a92;margin-bottom:18px;max-width:900px;line-height:1.5}
  .scroll{overflow-x:auto;border:1px solid #23232b;border-radius:10px}
  table{border-collapse:collapse}
  th,td{border:1px solid #23232b;padding:8px;vertical-align:top;text-align:center}
  thead th{position:sticky;top:0;background:#16161c;font-size:12px;white-space:nowrap;padding:10px}
  .rowh{position:sticky;left:0;background:#16161c;text-align:right;padding:8px 12px;z-index:2}
  .skey{font-weight:700;font-size:13px} .ssub{color:#8a8a92;font-size:11px}
  img{width:230px;height:auto;display:block;border-radius:6px}
  .badge{display:inline-block;margin-top:6px;font-size:10px;font-weight:800;letter-spacing:.5px;padding:2px 7px;border-radius:5px}
  .badge.in{background:rgba(60,200,120,.15);color:#5fd39a}
  .badge.out{background:rgba(240,90,90,.14);color:#ff8a8a}
  .note{font-size:10px;color:#ffcf6b;margin-top:4px;max-width:230px}
  .failbox{width:230px;height:150px;display:flex;align-items:center;justify-content:center;background:#1b1b22;color:#ff7676;font-size:11px;border-radius:6px}
</style></head><body>
<h1>DreamSmart regrade — ${models.map(label).join(' + ')}</h1>
<div class="sub">${ok}/${results.length} self face-swap renders across ${
    mediums.length
  } styles. Each cell shows the render + the style's <b>current</b> DreamSmart membership
  (<span class="badge in">IN</span> = already enabled, <span class="badge out">OUT</span> = currently excluded).
  Grade the FACE (integration + resemblance; ignore hair/clothing/bg) AND whether the STYLE shows through
  (photoreal drift = fail). PASS on both ⇒ the model should be IN that style. Click a render to enlarge.</div>
<div class="scroll"><table><thead><tr><th class="rowh">Style</th>${heads}</tr></thead><tbody>${body}</tbody></table></div>
</body></html>`;

  const out = path.join(OUT_DIR, 'regrade.html');
  fs.writeFileSync(out, html);
  console.log(`Wrote ${out} (${mediums.length} styles × ${models.length} models, ${ok}/${results.length} renders)`);
})();
