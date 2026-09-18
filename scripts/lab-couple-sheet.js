/** FLUX COUPLE LAB report page: every round's 10 renders with held / failure labels and face sizes, summary table first. */
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const SP = '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad';
const out = process.argv[2] || path.join(SP, 'flux-couple-lab.html');
const rounds = fs.readdirSync(path.join(SP, 'lab')).filter((f) => /^R\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))).map((f) => JSON.parse(fs.readFileSync(path.join(SP, 'lab', f), 'utf8')));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  const rows = []; const sections = [];
  for (const r of rounds) {
    const ok = r.results.filter((x) => x.upload_id); const held = ok.filter((x) => x.held); const hf = held.map((x) => x.face).filter((x) => typeof x === 'number').sort((a, b) => a - b);
    const med = hf.length ? Math.round(hf[Math.floor(hf.length / 2)] * 100) + '%' : '–'; const why = {}; for (const x of ok) if (x.firstFail) why[x.firstFail.replace(/\(faces=\d\)/g, '')] = (why[x.firstFail.replace(/\(faces=\d\)/g, '')] || 0) + 1;
    rows.push(`<tr><td>${esc(r.round)}</td><td>${esc(r.variant)}</td><td>${esc(r.model.split('/').pop())}${r.big ? ` · big ${r.big}` : ''}${r.gate ? ` · gate ${r.gate}` : ''}</td><td class="n">${held.length}/${ok.length}</td><td class="n">${med}</td><td>${esc(Object.entries(why).map(([k, v]) => `${k} ${v}`).join(', ') || '–')}</td></tr>`);
    const cards = [];
    for (const x of r.results) { if (!x.upload_id) { cards.push(`<figure class="fail"><div class="ph">render failed</div><figcaption>#${x.n} · ${esc(x.error || '')}</figcaption></figure>`); continue; }
      const file = path.join(SP, 'lab', r.round, `${x.n}.jpg`); let img = '';
      try { const b = await sharp(file).resize({ width: 200 }).jpeg({ quality: 68 }).toBuffer(); img = `<img src="data:image/jpeg;base64,${b.toString('base64')}" alt="">`; } catch (_) { img = '<div class="ph">no image</div>'; }
      const label = x.held ? 'HELD' : x.rerendered ? `re-rendered → ${x.degraded ? 'degraded' : esc(x.model)}` : 'degraded';
      cards.push(`<figure class="${x.held ? 'held' : 'miss'}">${img}<figcaption><b>#${x.n} ${label}</b><br>${typeof x.face === 'number' ? Math.round(x.face * 100) + '% face' : ''} · id ${esc((x.sims || []).join(' '))}${x.firstFail ? `<br><span class="why">${esc(x.firstFail)}</span>` : ''}</figcaption></figure>`); }
    sections.push(`<section><h2>${esc(r.round)} <span class="v">${esc(r.variant)}</span> <span class="m">${esc(r.model.split('/').pop())}</span><span class="tally">${held.length}/${ok.length} held · median face ${med}</span></h2><div class="row">${cards.join('')}</div></section>`);
  }
  const html = `<title>Flux Couple Lab</title>
<style>:root{--bg:#f7f5f0;--ink:#1c1a15;--mute:#6c655a;--card:#fffdf8;--line:#dcd5c8;--ok:#1f7a4d;--bad:#a63a2a;--acc:#7a4a12}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#16140f;--ink:#efe8dc;--mute:#a59d90;--card:#1f1c16;--line:#3a3529;--ok:#5ec48f;--bad:#f08a78;--acc:#e0a45a}}:root[data-theme="dark"]{--bg:#16140f;--ink:#efe8dc;--mute:#a59d90;--card:#1f1c16;--line:#3a3529;--ok:#5ec48f;--bad:#f08a78;--acc:#e0a45a}
body{background:var(--bg);color:var(--ink);font:15px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;margin:0;padding:24px}h1{font-size:22px;margin:0 0 4px}p.lede{color:var(--mute);margin:0 0 18px;max-width:78ch}
table{border-collapse:collapse;margin:0 0 22px;font-variant-numeric:tabular-nums}th,td{text-align:left;padding:6px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--mute);font-weight:600;font-size:13px}td.n{text-align:right}
section{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin:0 0 14px}h2{font-size:15px;margin:0 0 8px;display:flex;gap:12px;align-items:baseline}h2 .v{color:var(--acc)}h2 .m{color:var(--mute);font-weight:400}h2 .tally{margin-left:auto;color:var(--mute);font-weight:400;font-variant-numeric:tabular-nums}
.row{display:flex;gap:10px;overflow-x:auto}figure{margin:0;flex:0 0 auto;width:200px}img{display:block;width:200px;border-radius:4px}.ph{width:200px;height:355px;border-radius:4px;background:var(--line);display:flex;align-items:center;justify-content:center;color:var(--mute);font-size:12px}figcaption{font-size:12px;color:var(--mute);margin-top:4px;font-variant-numeric:tabular-nums}figure.held figcaption b{color:var(--ok)}figure.miss figcaption b,figure.fail figcaption b{color:var(--bad)}.why{color:var(--bad)}</style>
<h1>Flux Couple Lab</h1><p class="lede">Ten forced flux couples per round through the live nightly on the experimental couple engine, one variable per round. "Held" = the dual swap landed on the first render (no re-render, no degrade). Face size = tallest detected face as a fraction of frame height, same detector as the nightly gate. Baseline: the album era held 70% with faces at 9 to 24%; the subject-first prompt of 09-18 held 44% at 21 to 39%.</p>
<table><tr><th>round</th><th>variable</th><th>model</th><th>held</th><th>held faces (median)</th><th>first-try failures</th></tr>${rows.join('')}</table>
${sections.join('\n')}`;
  fs.writeFileSync(out, html); console.log('wrote', out, Math.round(html.length / 1024), 'KB', rounds.length, 'rounds');
})();
