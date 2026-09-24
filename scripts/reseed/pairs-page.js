#!/usr/bin/env node
/**
 * pairs-page.js — the paired before/after render page (the `reseed` skill, step 6): the same forced
 * entry positions rendered before and after a pool repair + path fix, side by side, images inlined as
 * data URIs (the artifact CSP blocks remote images). Publish the output as an artifact.
 *
 *   node scripts/reseed/pairs-page.js <before-dir> <after-dir> <out.html> [--title "Words"]
 *
 * <dir> = an --out dir of render-forced-entries.js (render-results.json + img/). Pairs are matched
 * by position k. Images are downscaled with `sips` (macOS) when available, else embedded as they are.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const argv = process.argv.slice(2);
const [beforeDir, afterDir, out] = argv;
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
if (!beforeDir || !afterDir || !out) {
  console.error(
    'usage: node scripts/reseed/pairs-page.js <before-dir> <after-dir> <out.html> [--title "Words"]'
  );
  process.exit(1);
}
const title = flag('--title') || 'Before and after';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const load = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'render-results.json'), 'utf8'));
const before = load(beforeDir);
const after = load(afterDir);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pairs-'));
function imageFor(dir, k) {
  const imgDir = path.join(dir, 'img');
  if (!fs.existsSync(imgDir)) return '';
  const files = fs
    .readdirSync(imgDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
  const f = files[k];
  if (!f) return '';
  let src = path.join(imgDir, f);
  const small = path.join(tmp, `${path.basename(dir)}-${k}.jpg`);
  const r = spawnSync('sips', ['-Z', '900', src, '--out', small], { stdio: 'ignore' });
  if (r.status === 0 && fs.existsSync(small)) src = small;
  const mime = /\.png$/i.test(src) ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(src).toString('base64')}`;
}
const look = (p) =>
  (p || '')
    .replace(/^.*?OPEN the prompt, /, '')
    .split(',')[0]
    .trim()
    .slice(0, 60);
const entryText = (e) => (typeof e === 'string' ? e : e && (e.description || e.text)) || '';

const rows = before
  .map((b, k) => {
    const a = after[k] || {};
    const forced = Object.entries(b.forced || {})
      .map(([slot, i]) => `${slot} #${i}`)
      .join(' · ');
    const entriesA = Object.entries(a.entries || {})
      .map(
        ([slot, e]) =>
          `<p class="entry"><b>${esc(slot)}:</b> ${esc(entryText(e).split(' — ')[0])}</p>`
      )
      .join('');
    const entriesB = Object.entries(b.entries || {})
      .map(
        ([slot, e]) =>
          `<p class="entry"><b>${esc(slot)}:</b> ${esc(entryText(e).split(' — ')[0])}</p>`
      )
      .join('');
    return `<article class="pair">
  <header><span class="idx">${k + 1}</span><span class="forced">${esc(forced)}</span></header>
  <div class="two">
    <figure><img src="${imageFor(beforeDir, k)}" alt="before"><figcaption><b>before</b> · ${esc(look(b.finalPrompt))}${entriesB}</figcaption></figure>
    <figure><img src="${imageFor(afterDir, k)}" alt="after"><figcaption><b>after</b> · ${esc(look(a.finalPrompt))}${entriesA}</figcaption></figure>
  </div>
</article>`;
  })
  .join('\n');

const html = `<title>${esc(title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--bg:#F6F7F4;--ink:#1E2321;--muted:#6B7370;--line:#D9DED8;--card:#FFFFFF;--accent:#3F6B4A;color-scheme:light}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#171A18;--ink:#E6E9E4;--muted:#9AA39D;--line:#2E3430;--card:#1F2421;--accent:#8FC49B;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171A18;--ink:#E6E9E4;--muted:#9AA39D;--line:#2E3430;--card:#1F2421;--accent:#8FC49B;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.5 "IBM Plex Sans",system-ui,sans-serif;padding-block:0 48px;padding-inline:16px;max-width:1100px;margin:0 auto}
h1{font-size:1.4rem;font-weight:600;margin:20px 0 4px;text-wrap:balance}
.sub{color:var(--muted);margin:0 0 18px;max-width:75ch}
.pair{background:var(--card);border:1px solid var(--line);border-radius:6px;margin:0 0 14px;padding:12px}
.pair header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:8px}
.idx{font-family:"IBM Plex Mono",monospace;color:var(--muted)}
.forced{font-family:"IBM Plex Mono",monospace;font-size:.8rem;color:var(--muted)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
figure{margin:0}img{width:100%;max-width:100%;border-radius:4px;display:block;aspect-ratio:9/16;object-fit:cover;background:var(--line)}
figcaption{font-size:.8rem;color:var(--muted);margin-top:6px}
figcaption b{color:var(--ink)}
.entry{margin:2px 0;font-family:"IBM Plex Mono",monospace;font-size:.72rem}
</style>
<h1>${esc(title)}</h1>
<p class="sub">The same forced entry positions rendered before (old entries, old path) and after (rewritten entries, fixed path). The rolled look differs between columns; judge whether each render shows its own entries and whether the set varies.</p>
${rows}`;
fs.writeFileSync(out, html);
console.log('wrote', out, Math.round(html.length / 1024), 'KB');
