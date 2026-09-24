#!/usr/bin/env node
/**
 * review-page.js — the before/after review page Kevin approves a proposal from (the `reseed` skill,
 * step 4). Reads a dry run's report.json and writes one HTML file (publish it as an artifact).
 *
 *   node scripts/reseed/review-page.js <report.json> <out.html>
 */
const fs = require('fs');

const [reportFile, out] = process.argv.slice(2);
if (!reportFile || !out) {
  console.error('usage: node scripts/reseed/review-page.js <report.json> <out.html>');
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const split = (e) => {
  if (!e) return ['', ''];
  const i = e.indexOf(' — ');
  return i < 0 ? [e, ''] : [e.slice(0, i), e.slice(i + 3)];
};
const b = report.before;
const a = report.after;
const statKeys = Object.keys(b).filter((k) => typeof b[k] === 'number');
const tagSet = [...new Set(report.changes.flatMap((c) => c.tags || []))];
const rows = report.changes
  .map((c) => {
    const [ot, ob] = split(c.old);
    const [nt, nb] = split(c.new);
    return `<article class="pair" data-tags=" ${(c.tags || []).join(' ')} ">
  <header><span class="idx">#${c.index}</span>${(c.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}${c.judgeNote ? '<span class="chip note" title="' + esc(c.judgeNote) + '">reader note</span>' : ''}</header>
  ${c.old ? `<div class="old"><span class="lbl">was</span><div><span class="title">${esc(ot)}</span> ${esc(ob)}</div></div>` : ''}
  <div class="new"><span class="lbl">${c.old ? 'now' : 'new'}</span><div><span class="title">${esc(nt)}</span> ${esc(nb)}</div></div>
</article>`;
  })
  .join('\n');
const html = `<title>${esc(report.pool.split('/').slice(-2).join(' '))} review</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--bg:#F6F7F4;--ink:#1E2321;--muted:#6B7370;--line:#D9DED8;--card:#FFFFFF;--accent:#3F6B4A;--old:#F1EFEA;--new:#EEF4EE;color-scheme:light}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#171A18;--ink:#E6E9E4;--muted:#9AA39D;--line:#2E3430;--card:#1F2421;--accent:#8FC49B;--old:#242826;--new:#1E2B22;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171A18;--ink:#E6E9E4;--muted:#9AA39D;--line:#2E3430;--card:#1F2421;--accent:#8FC49B;--old:#242826;--new:#1E2B22;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.5 "IBM Plex Sans",system-ui,sans-serif;padding-block:0 48px;padding-inline:16px;max-width:980px;margin:0 auto}
h1{font-size:1.4rem;font-weight:600;margin:20px 0 4px;text-wrap:balance}
.sub{color:var(--muted);margin:0 0 14px;max-width:75ch}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:0 0 14px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:10px 12px}
.stat .k{display:block;color:var(--muted);font-size:.72rem;letter-spacing:.04em;text-transform:uppercase}
.stat .v{font-size:1.15rem;font-weight:600;font-variant-numeric:tabular-nums}
.filters{position:sticky;top:env(safe-area-inset-top,0px);background:var(--bg);padding:8px 0;display:flex;flex-wrap:wrap;gap:6px;border-bottom:1px solid var(--line);margin-bottom:12px;z-index:2}
.filters button{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:3px 10px;font:inherit;font-size:.82rem;cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.count{color:var(--muted);font-size:.85rem;align-self:center;margin-left:auto}
.pair{background:var(--card);border:1px solid var(--line);border-radius:6px;margin:0 0 10px;overflow:hidden}
.pair header{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid var(--line)}
.idx{font-family:"IBM Plex Mono",monospace;color:var(--muted);font-size:.85rem}
.chip{font-size:.72rem;letter-spacing:.03em;text-transform:uppercase;border-radius:3px;padding:1px 6px;color:#fff;background:var(--accent)}
.chip.note{background:var(--muted)}
.old,.new{display:grid;grid-template-columns:44px 1fr;gap:8px;padding:10px 12px;font-family:"IBM Plex Mono",monospace;font-size:.78rem;line-height:1.55}
.old{background:var(--old);color:var(--muted)}.new{background:var(--new)}
.lbl{font-family:"IBM Plex Sans",system-ui,sans-serif;font-size:.7rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding-top:2px}
.title{font-weight:500;display:block;margin-bottom:2px}
.old .title{text-decoration:line-through}
.unfilled{color:var(--muted);font-size:.9rem}
</style>
<h1>${esc(report.pool)}</h1>
<p class="sub">Proposed state, nothing written yet. ${report.rewritten} entries ${report.changes.some((c) => c.old) ? 'rewritten in place' : 'added'}${report.unfilled.length ? `, ${report.unfilled.length} left as they were` : ''}. Basis for "the same": ${esc(report.basis)}.</p>
<div class="stats">${statKeys.map((k) => `<div class="stat"><span class="k">${esc(k)}</span><span class="v">${b[k]} → ${a[k]}</span></div>`).join('')}</div>
${report.unfilled.length ? `<p class="unfilled">Not rewritten (kept as they were): ${report.unfilled.map((u) => '#' + u.index).join(', ')}.</p>` : ''}
<div class="filters" role="group" aria-label="Filter">
  <button data-f="all" aria-pressed="true">All ${report.changes.length}</button>
  ${tagSet.map((t) => `<button data-f="${esc(t)}" aria-pressed="false">${esc(t)} ${report.changes.filter((c) => (c.tags || []).includes(t)).length}</button>`).join('')}
  <span class="count" id="count"></span>
</div>
<section>
${rows}
</section>
<script>
(function(){
  var btns=document.querySelectorAll('.filters button'),pairs=document.querySelectorAll('.pair'),count=document.getElementById('count');
  function apply(f){var n=0;pairs.forEach(function(p){var show=f==='all'||p.dataset.tags.indexOf(' '+f+' ')>=0;p.hidden=!show;if(show)n++;});count.textContent=n+' shown';btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.f===f));});}
  btns.forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.f);});});
  apply('all');
})();
</script>`;
fs.writeFileSync(out, html);
console.log('wrote', out, Math.round(html.length / 1024), 'KB');
