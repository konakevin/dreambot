#!/usr/bin/env node
/**
 * build-look-sort-sheet.js — lay every enabled nightly look out as a render so Kevin can group them BY EYE.
 *
 * Why by eye (2026-09-14): the first family grouping was done from fragment text and grouped by MATERIAL, which is
 * invisible in the output. It put colored_pencil with the pastels when it renders as fun illustration, and
 * digital_watercolor with the aquarelles when it renders as polished comic art. Families have to predict what the
 * user gets, so they have to be sorted from pictures.
 *
 * Click a tile to cycle its family. The panel at the top keeps the tally and a copyable result.
 *   node scripts/build-look-sort-sheet.js [--out ~/Desktop/look-sort.html]
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');
const ROOT = path.join(__dirname, '..');
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const s = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const FAMILIES = ['Comic', 'Drawn', 'Painted', 'Film', 'Poster', 'Watercolor'];
const outArg = process.argv.indexOf('--out');
const OUT = outArg > -1 ? process.argv[outArg + 1] : path.join(os.homedir(), 'Desktop', 'look-sort.html');
const esc = (x) => String(x == null ? '' : x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

(async () => {
  const { data: looks } = await s
    .from('dream_mediums')
    .select('key,label,nightly_family')
    .eq('nightly_look', true)
    .neq('nightly_enabled', false)
    .order('nightly_family')
    .order('key');
  const { data: ap } = await s.from('nightly_look_approvals').select('look_key,model,surface,approved');
  const grade = {};
  for (const a of ap || []) {
    grade[a.look_key] = grade[a.look_key] || { ok: new Set(), no: 0 };
    if (a.approved) grade[a.look_key].ok.add(a.model.split('/').pop().replace('-imagine-image', '').replace('-1.1-pro', '').replace('-2-image', ''));
    else grade[a.look_key].no++;
  }

  const tiles = [];
  for (const l of looks || []) {
    // Kevin's own renders first (one cast, so the LOOK is the only variable), newest first, then anyone's.
    let { data: up } = await s
      .from('uploads')
      .select('image_url,created_at')
      .eq('dream_medium', l.key)
      .eq('user_id', KEVIN)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);
    if (!up || up.length === 0) {
      const r = await s.from('uploads').select('image_url,created_at').eq('dream_medium', l.key)
        .not('image_url', 'is', null).order('created_at', { ascending: false }).limit(3);
      up = r.data || [];
    }
    tiles.push({ ...l, shots: (up || []).map((u) => u.image_url), grade: grade[l.key] });
    process.stdout.write('.');
  }
  console.log('');

  const byFamily = {};
  for (const t of tiles) (byFamily[t.nightly_family || 'unfiled'] = byFamily[t.nightly_family || 'unfiled'] || []).push(t);

  const tileHtml = (t) => `<figure class="t" data-key="${esc(t.key)}" data-start="${esc(t.nightly_family || '')}">
  <div class="shots">${t.shots.map((u, i) => `<img src="${esc(u)}" loading="lazy" class="${i ? 'alt' : ''}" alt="">`).join('')}</div>
  <figcaption>
    <b>${esc(t.label || t.key)}</b>
    <span class="assign">—</span>
    <div class="m">${esc(t.key.replace('nightly_', ''))}</div>
    <div class="m">${t.grade && t.grade.ok.size ? [...t.grade.ok].join(' · ') : '<i>no approvals</i>'}${t.grade && t.grade.no ? ` · ${t.grade.no} rejected` : ''}</div>
  </figcaption></figure>`;

  const html = `<!doctype html><meta charset="utf-8"><title>Look sort — 54 looks into 6 families</title>
<style>
 :root{--bg:#0f1012;--card:#17191d;--ink:#e9eaec;--dim:#9aa0a8;--line:#262a30}
 *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
 header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:16px 24px}
 h1{margin:0 0 6px;font-size:19px} .sub{color:var(--dim);max-width:80ch}
 .tally{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
 .pill{padding:4px 10px;border-radius:20px;border:1px solid var(--line);font-size:12.5px}
 button{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:#1d2025;color:var(--ink);cursor:pointer}
 h2{margin:24px 24px 4px;font-size:15px;color:var(--dim);font-weight:500}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;padding:8px 24px 20px}
 .t{margin:0;background:var(--card);border:2px solid var(--line);border-radius:9px;overflow:hidden;cursor:pointer;user-select:none}
 .shots{display:flex;gap:1px} .shots img{width:100%;display:block;aspect-ratio:3/4;object-fit:cover}
 .shots img.alt{display:none} .t.wide .shots img.alt{display:block}
 figcaption{padding:8px 9px 10px} .assign{float:right;font-weight:700;font-size:12px}
 .m{color:var(--dim);font-size:11px;margin-top:3px}
 .f-Comic{border-color:#e0724f} .f-Drawn{border-color:#c9a227} .f-Painted{border-color:#4ea672}
 .f-Film{border-color:#5b8dd6} .f-Poster{border-color:#b45ec6} .f-Watercolor{border-color:#4fb8c9}
 #out{width:calc(100% - 48px);margin:0 24px 30px;height:150px;background:#0b0c0e;color:#c3c7cc;border:1px solid var(--line);border-radius:8px;padding:10px;font:12px/1.5 ui-monospace,monospace}
</style>
<header>
 <h1>Sort 54 looks into 6 families</h1>
 <div class="sub">Click a tile to cycle: Comic → Drawn → Painted → Film → Poster → Watercolor → clear. Shift-click shows the other renders of that look. Sections below are the CURRENT grouping, which was done from fragment text and is what we are replacing.</div>
 <div class="tally" id="tally"></div>
 <div style="margin-top:10px"><button onclick="dump()">Write result below</button> <button onclick="navigator.clipboard.writeText(document.getElementById('out').value)">Copy</button> <button onclick="reset()">Clear all</button></div>
</header>
${Object.entries(byFamily).map(([f, ts]) => `<h2>currently ${esc(f)} — ${ts.length}</h2><div class="grid">${ts.map(tileHtml).join('')}</div>`).join('')}
<textarea id="out" placeholder="assignments appear here"></textarea>
<script>
const FAM = ${JSON.stringify(FAMILIES)};
const state = {};
document.querySelectorAll('.t').forEach((el) => {
  el.addEventListener('click', (e) => {
    if (e.shiftKey) { el.classList.toggle('wide'); return; }
    const k = el.dataset.key;
    const cur = state[k] ? FAM.indexOf(state[k]) : -1;
    const next = cur + 1 >= FAM.length ? null : FAM[cur + 1];
    FAM.forEach((f) => el.classList.remove('f-' + f));
    if (next) { state[k] = next; el.classList.add('f-' + next); } else delete state[k];
    el.querySelector('.assign').textContent = next || '—';
    tally();
  });
});
function tally() {
  const counts = {}; FAM.forEach((f) => (counts[f] = 0));
  Object.values(state).forEach((f) => counts[f]++);
  const done = Object.keys(state).length, total = document.querySelectorAll('.t').length;
  document.getElementById('tally').innerHTML =
    '<span class="pill">' + done + ' / ' + total + ' assigned</span>' +
    FAM.map((f) => '<span class="pill f-' + f + '" style="border-width:2px">' + f + ' ' + counts[f] + '</span>').join('');
}
function dump() {
  const lines = FAM.map((f) => f + ': ' + Object.entries(state).filter(([, v]) => v === f).map(([k]) => k.replace('nightly_','')).join(', '));
  const left = [...document.querySelectorAll('.t')].filter((el) => !state[el.dataset.key]).map((el) => el.dataset.key.replace('nightly_',''));
  document.getElementById('out').value = lines.join('\\n') + (left.length ? '\\n\\nUNASSIGNED: ' + left.join(', ') : '');
}
function reset(){ Object.keys(state).forEach(k=>delete state[k]); document.querySelectorAll('.t').forEach(el=>{FAM.forEach(f=>el.classList.remove('f-'+f)); el.querySelector('.assign').textContent='—';}); tally(); }
tally();
</script>`;
  fs.writeFileSync(OUT, html);
  console.log('wrote', OUT, '·', tiles.length, 'looks');
})();
