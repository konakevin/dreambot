#!/usr/bin/env node
/**
 * Stage 8b — identity-threshold calibration (FACE_SWAP_UPGRADE_PLAN.md).
 *
 * Runs the Fly /verify endpoint (YuNet + ArcFace MobileFaceNet) over the
 * action-depth-QA corpus (~/Desktop/action-depth-qa): every owner-judged PASS
 * cell plus the unswapped reject targets as known-negatives. Produces a grid
 * SORTED BY MIN SIMILARITY with the numbers under each image, so the owner can
 * point at where the "not me" line sits — the enforcement threshold is picked
 * from HIS verdicts, not a paper value.
 *
 * Caveat baked into the header of the grid: inswapper optimizes an
 * ArcFace-family embedding, so sims can read higher than human perception —
 * the calibration exists exactly to absorb that bias.
 *
 * Usage: node scripts/bench-identity-verify.js
 * Output: ~/Desktop/identity-calibration/index.html + sims.json  (~$0)
 */

require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const FLY_TOKEN = fs
  .readFileSync(
    '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/6fd5ca87-8c10-41e3-be85-6598fe6433e3/scratchpad/fly-token.txt',
    'utf8'
  )
  .trim();

const SRC = path.join(os.homedir(), 'Desktop', 'action-depth-qa');
const OUT = path.join(os.homedir(), 'Desktop', 'identity-calibration');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const { data: rec } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN)
    .single();
  const refs = [];
  for (const role of ['self', 'plus_one']) {
    const m = (rec.recipe.dream_cast ?? []).find((x) => x.role === role);
    const { data } = await sb.storage.from('cast-photos').createSignedUrl(m.storage_path, 21600);
    refs.push(data.signedUrl);
  }

  async function verify(localFile) {
    const bytes = fs.readFileSync(localFile);
    const p = `temp/${KEVIN}/calib-${path.basename(localFile)}-${Date.now()}.jpg`;
    await sb.storage.from('uploads').upload(p, bytes, { contentType: 'image/jpeg', upsert: true });
    const { data: pub } = sb.storage.from('uploads').getPublicUrl(p);
    try {
      const r = await fetch('https://dreambot-face-swap-dual.fly.dev/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${FLY_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: pub.publicUrl, refs }),
        signal: AbortSignal.timeout(60_000),
      });
      return await r.json();
    } finally {
      sb.storage
        .from('uploads')
        .remove([p])
        .then(
          () => {},
          () => {}
        );
    }
  }

  const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jpg'));
  const rows = [];
  for (const f of files) {
    const isTarget = f.includes('-target'); // unswapped reject = known negative
    try {
      const j = await verify(path.join(SRC, f));
      if (!j.faces) throw new Error(JSON.stringify(j).slice(0, 80));
      // Left face ↔ Kevin (refs[0]), right face ↔ Steph (refs[1]) — the swap's
      // side assignment. For targets we still record (they're negatives).
      const byX = [...j.faces].sort((a, b) => a.x - b.x);
      const left = byX[0]?.sims?.[0] ?? null;
      const right = byX[1]?.sims?.[1] ?? null;
      const vals = [left, right].filter((v) => v !== null);
      const min = vals.length ? Math.min(...vals) : null;
      rows.push({ f, isTarget, left, right, min, faces: j.faces.length });
      console.log(
        `${f.padEnd(28)} L=${left ?? '—'} R=${right ?? '—'} faces=${j.faces.length}${isTarget ? '  [unswapped target]' : ''}`
      );
    } catch (e) {
      rows.push({ f, isTarget, left: null, right: null, min: null, error: e.message.slice(0, 60) });
      console.log(`${f.padEnd(28)} ERROR ${e.message.slice(0, 60)}`);
    }
  }

  fs.writeFileSync(path.join(OUT, 'sims.json'), JSON.stringify(rows, null, 2));

  const sorted = [...rows].filter((r) => !r.error).sort((a, b) => (a.min ?? -1) - (b.min ?? -1));
  const html = `<!doctype html><meta charset="utf-8"><title>Identity calibration</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}
.grid{display:flex;flex-wrap:wrap;gap:10px}
.cell{width:190px}
.cell img{width:190px;border-radius:8px;display:block}
.cell .lbl{font-size:11px;margin:3px 0;color:#aaa}
.cell .sim{font-size:13px;font-weight:700}
.low .sim{color:#f66}.mid .sim{color:#fc6}.high .sim{color:#6f6}
.tgt{outline:2px dashed #a66;outline-offset:-2px}
</style>
<h1>Identity calibration — sorted by MIN cosine sim (Kevin=left face, Steph=right) · ${new Date().toISOString().slice(0, 10)}</h1>
<p>Find the row where images stop being "really us" going up — that number is the enforcement threshold. Dashed cells are UNSWAPPED reject targets (known negatives). Note: inswapper optimizes this same embedding family, so sims read generous; your eye sets the line.</p>
<div class="grid">
${sorted
  .map((r) => {
    const cls = r.min === null ? 'low' : r.min < 0.35 ? 'low' : r.min < 0.5 ? 'mid' : 'high';
    return `<div class="cell ${cls} ${r.isTarget ? 'tgt' : ''}"><a href="${path.join(SRC, r.f)}" target="_blank"><img src="${path.join(SRC, r.f)}" loading="lazy"></a><div class="sim">min ${r.min ?? '—'} (L ${r.left ?? '—'} / R ${r.right ?? '—'})</div><div class="lbl">${r.f}${r.isTarget ? ' — unswapped' : ''}</div></div>`;
  })
  .join('\n')}
</div>`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\n✅ grid: ${path.join(OUT, 'index.html')}`);
})();
