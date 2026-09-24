#!/usr/bin/env node
/**
 * Build a single-column review sheet from ONE forced-render directory (Track B grow runs render
 * new entries only, so there is no before/after pair to lay out):
 *
 *   node scripts/reseed/sheet-page.js <renderDir> <out.html> --title "…"
 *
 * Reads <renderDir>/render-results.json + <renderDir>/img/*, inlines the images as data URIs and
 * prints each render's forced entry, whether it reached the prompt, and whether it is an original
 * (index ≤ the --originals count, default 25) or a new entry.
 */
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const [dir, out] = argv;
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
if (!dir || !out) {
  console.error('usage: node scripts/reseed/sheet-page.js <renderDir> <out.html> [--title T] [--originals 25]');
  process.exit(1);
}
const title = flag('--title') || 'Render sheet';
const originals = Number(flag('--originals') || 25);
const results = JSON.parse(fs.readFileSync(path.join(dir, 'render-results.json'), 'utf8'));
const imgs = fs.existsSync(path.join(dir, 'img')) ? fs.readdirSync(path.join(dir, 'img')).sort() : [];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const dataUri = (file) => {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(path.join(dir, 'img', file)).toString('base64')}`;
};

const cards = results
  .map((r, i) => {
    const slot = Object.keys(r.entries || {})[0];
    const idx = r.forced ? r.forced[slot] : null;
    const carried = r.carried ? r.carried[slot] : null;
    const img = imgs.find((f) => f.startsWith(String(i + 1).padStart(2, '0') + '-'));
    const kind = idx != null && idx <= originals ? 'original' : 'new';
    return `<section class="card">
  <div class="meta"><span class="idx">#${idx ?? '?'}</span> <span class="kind ${kind}">${kind}</span> <span class="carried ${carried ? 'ok' : 'no'}">${carried ? 'reached the prompt' : carried === false ? 'DROPPED before the prompt' : ''}</span>${r.ok ? '' : ' <span class="fail">render failed</span>'}</div>
  ${img ? `<img src="${dataUri(img)}" alt="render ${i + 1}">` : '<div class="noimg">no image</div>'}
  <p class="entry">${esc(r.entries ? r.entries[slot] : '')}</p>
</section>`;
  })
  .join('\n');

const html = `<title>${esc(title)}</title>
<style>
:root{--bg:#f6f4ef;--ink:#1d1b17;--muted:#6b665c;--card:#fffdf8;--line:#e2ddd2;--ok:#1f7a4d;--no:#b3261e;--new:#2b4f9e;--orig:#7a5d1f}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#17161a;--ink:#ece8e0;--muted:#a19b90;--card:#201f24;--line:#34323a;--ok:#5fcf93;--no:#ff6b61;--new:#8fb0ff;--orig:#e0b45a;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#17161a;--ink:#ece8e0;--muted:#a19b90;--card:#201f24;--line:#34323a;--ok:#5fcf93;--no:#ff6b61;--new:#8fb0ff;--orig:#e0b45a;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.5 "IBM Plex Sans",system-ui,sans-serif;padding-block:0 48px;padding-inline:16px;max-width:820px;margin:0 auto}
h1{font-size:1.4rem;margin:24px 0 4px;text-wrap:balance}
.sub{color:var(--muted);margin:0 0 20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;margin:0 0 20px}
.meta{display:flex;gap:10px;align-items:center;font-size:.85rem;margin-bottom:8px}
.idx{font-weight:600}
.kind{padding:1px 8px;border-radius:999px;border:1px solid var(--line)}
.kind.new{color:var(--new)} .kind.original{color:var(--orig)}
.carried.ok{color:var(--ok)} .carried.no{color:var(--no);font-weight:600} .fail{color:var(--no)}
img{width:100%;height:auto;border-radius:6px;display:block}
.entry{margin:10px 0 0;color:var(--ink);font-size:.92rem}
.noimg{padding:40px;text-align:center;color:var(--muted)}
</style>
<h1>${esc(title)}</h1>
<p class="sub">${results.length} forced renders from ${esc(path.basename(dir))}; entries numbered by pool index, originals are 1–${originals}.</p>
${cards}`;
fs.writeFileSync(out, html);
console.log(`wrote ${out} ${Math.round(html.length / 1024)} KB`);
