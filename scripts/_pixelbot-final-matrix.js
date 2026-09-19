#!/usr/bin/env node
/**
 * PixelBot scene-path REVIEW MATRIX (Kevin, 2026-09-19: "make a test matrix of
 * each path's final render batch and we'll judge what stays or needs more work").
 *
 * One row per scene path = that path's FINAL batch of five shadow renders
 * (the last five hidden posts for the path, which is exactly its last QA round).
 * Writes a self-contained HTML page; images are the public storage URLs.
 *
 *   node scripts/_pixelbot-final-matrix.js [--out /tmp/pixelbot-final-matrix.html]
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; })
);
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const PIXELBOT = '87b57ebe-30b0-44d9-9f74-a1e65a066caf';
const argv = process.argv.slice(2);
const arg = (n, fb) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : fb; };
const OUT = arg('out', '/tmp/pixelbot-final-matrix.html');
const VERDICTS = JSON.parse(fs.readFileSync(arg('verdicts', 'scripts/bots/pixelbot/_matrix-verdicts.json'), 'utf8'));

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// The shared painting prefix ends with "room to breathe"; Sonnet's text starts with the rolled LOOK.
const lookOf = (p) => {
  const s = String(p || ''); const i = s.indexOf('room to breathe');
  const body = i >= 0 ? s.slice(i + 16).trim() : s;
  const head = body.split(/[,:]/)[0].trim();
  return head.length > 46 ? head.slice(0, 46) + '…' : head;
};
const sceneOf = (p) => {
  const s = String(p || ''); const i = s.indexOf('room to breathe');
  const body = (i >= 0 ? s.slice(i + 16) : s).replace(/,?\s*no text, no watermarks.*$/i, '').trim();
  return body.length > 300 ? body.slice(0, 300) + '…' : body;
};

(async () => {
  const rows = [];
  for (const v of VERDICTS) {
    const { data, error } = await sb.from('uploads')
      .select('id, model, dream_vibe, ai_prompt, image_url, image_url_display, created_at')
      .eq('user_id', PIXELBOT).eq('shadow', true).ilike('caption', `[${v.path}]%`)
      .order('created_at', { ascending: false }).limit(5);
    if (error) throw error;
    rows.push({ ...v, renders: (data || []).reverse() });
    console.log(`${v.path.padEnd(22)} ${data.length} renders  ${v.verdict}`);
  }
  const cards = (r) => r.renders.map((u, i) => `
      <figure>
        <a href="${esc(u.image_url)}" target="_blank" rel="noreferrer"><img loading="lazy" src="${esc(u.image_url_display || u.image_url)}" alt=""></a>
        <figcaption><b>#${i + 1}</b> ${esc(String(u.model).split('/')[1] || u.model)} · ${esc(u.dream_vibe)}<br><span class="look">${esc(lookOf(u.ai_prompt))}</span><br><span class="scene">${esc(sceneOf(u.ai_prompt))}</span></figcaption>
      </figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><title>PixelBot scene paths — final batches</title>
<style>
  :root{color-scheme:dark}
  body{margin:0;padding:28px;background:#0d0b14;color:#e9e6f2;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  h1{font-size:22px;margin:0 0 4px}
  .sub{color:#9c96b4;margin:0 0 26px}
  section{margin:0 0 34px;border-top:1px solid #241f36;padding-top:16px}
  h2{font-size:17px;margin:0 0 2px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
  .pill{font-size:11px;font-weight:700;letter-spacing:.04em;padding:3px 9px;border-radius:999px;text-transform:uppercase}
  .pass{background:#123d24;color:#69e096}
  .resid{background:#4a3410;color:#f0b45e}
  .meta{color:#9c96b4;margin:2px 0 12px;font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
  @media(max-width:1100px){.grid{grid-template-columns:repeat(2,1fr)}}
  figure{margin:0;background:#161327;border-radius:10px;overflow:hidden}
  img{width:100%;display:block;aspect-ratio:9/16;object-fit:cover;background:#221d38}
  figcaption{padding:8px 10px 11px;font-size:11px;color:#b9b2d0;line-height:1.45}
  .look{color:#8fd8ff}.scene{color:#7d7694;display:block;margin-top:4px}
</style>
<h1>PixelBot scene paths — final render batch per path</h1>
<p class="sub">Every image is a hidden shadow post on PixelBot's profile. Click any frame for full size. Generated ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC.</p>
${rows.map((r) => `<section>
  <h2>${esc(r.path)} <span class="pill ${r.verdict.startsWith('PASS') ? 'pass' : 'resid'}">${esc(r.verdict)}</span></h2>
  <p class="meta">${esc(r.note || '')}</p>
  <div class="grid">${cards(r)}</div>
</section>`).join('\n')}
`;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html);
  console.log('\nwrote ' + OUT);
})().catch((e) => { console.error(e); process.exit(1); });
