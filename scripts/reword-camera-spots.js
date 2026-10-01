#!/usr/bin/env node
/**
 * reword-camera-spots.js — phase 4 step 3 of NIGHTLY_POOL_CLEANUP_PLAN.md: location spots written as a CAMERA DIRECTION
 * ("Low angle up at the arena's tiers", "Wide pull-back across a steaming tidal flat") are reworded into PLACE phrasing,
 * keeping their content and their pool slot (Kevin 2026-09-30: reword, don't deactivate). The camera words fight the
 * engine's own framing (the look fragment owns framing, and flux ignores camera-distance words anyway).
 *
 * Writes <out>/reworded.json for review and, with --sql, guarded UPDATEs (only rows whose text is still the reviewed
 * original). A line the rewriter returns unchanged (it was already a place, "Overhead gantry walkway ...") is skipped.
 *
 *   node scripts/reword-camera-spots.js --out <dir> [--sql <file>] [--skip ids.json]
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { ask } = require('./lib/poolJudge');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const OUT = arg('out', '.');
const SQL = arg('sql', null);
const SKIP = new Set(
  arg('skip', null) ? JSON.parse(fs.readFileSync(arg('skip', null), 'utf8')) : []
);
const CHUNK = 40;

// "View from ...", "Low angle up at ...", "Macro close-up of ..." (the phase 4 measure, 206 lines) ...
const OPENER =
  /^(?:[\w-]+\s){0,2}(?:shot|view|angle|vantage|macro|close-up|closeup)\s+(?:from|through|down|across|past|of|into|toward|towards|along|looking|up|over|on|beneath)\b/i;
// ... and the camera moves it missed ("Wide pull-back across ...", "Slow tilt up from ...", "aerial perspective of ...").
const MOVE =
  /^(?:(?:wide|low|high|slow|extreme|ultra-wide|tight|sweeping|cinematic|steep)\s+){0,2}(?:aerial|tilt|dolly|pan|panning|tracking|crane|drone|overhead|bird's-eye|worm's-eye|lens|camera|pull-back|push-in)\b/i;

const SYSTEM = `Each line is a backdrop spot for a location in a dream app, written as a camera direction. Rewrite each as the PLACE itself.
- Keep every named place, feature, material, scale and detail; add nothing new (no time of day, weather, people or extra features).
- Drop the camera words: shot, angle, view, vantage, aerial, perspective, pull-back, push-in, tilt, pan, overhead, looking, lens, macro, close-up, framing, revealing.
- Carry the scale in place words: a wide aerial becomes the place spreading to the horizon; a low angle becomes the place towering above; a close-up becomes the small or enclosed place itself.
- No longer than the original, one line, no full stop at the end.
- If a line already names a place and only borrows a camera word as part of it ("Overhead gantry walkway above the deck"), return it unchanged.
Reply ONLY a JSON array with one entry per line, in order: [{"n": <n>, "spot": "..."}]`;

async function loadRows() {
  let rows = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await sb
      .from('location_iconic_spots')
      .select('id, location_key, spot_text, spot_kind')
      .eq('is_active', true)
      .or('pure_scene_eligible.eq.true,character_eligible.eq.true')
      .order('id')
      .range(f, f + 999);
    if (error) throw new Error(error.message);
    rows = rows.concat(data);
    if (data.length < 1000) break;
  }
  return rows.filter(
    (r) => !SKIP.has(r.id) && (OPENER.test(r.spot_text) || MOVE.test(r.spot_text))
  );
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = await loadRows();
  console.log(`${rows.length} camera-direction spots`);
  const out = [];
  for (let off = 0; off < rows.length; off += CHUNK) {
    const chunk = rows.slice(off, off + CHUNK);
    const res = await ask(SYSTEM, chunk.map((r, i) => `${i + 1}. ${r.spot_text}`).join('\n'), 6000);
    for (const x of res) {
      if (!x || !Number.isInteger(x.n) || x.n < 1 || x.n > chunk.length) continue;
      const r = chunk[x.n - 1];
      const spot = String(x.spot || '')
        .trim()
        .replace(/[.\s]+$/, '');
      if (!spot || spot === r.spot_text.trim()) continue;
      out.push({ id: r.id, card: r.location_key, scale: r.spot_kind, from: r.spot_text, to: spot });
    }
    console.log(`  ${Math.min(off + CHUNK, rows.length)}/${rows.length}`);
  }
  fs.writeFileSync(path.join(OUT, 'reworded.json'), JSON.stringify(out, null, 1));
  console.log(`${out.length} reworded, ${rows.length - out.length} unchanged or skipped`);
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const lines = out.map(
      (r) =>
        // (location_key, spot_text) is UNIQUE: skip a rewording that matches another row of the same card.
        `UPDATE public.location_iconic_spots s SET spot_text = ${q(r.to)} WHERE s.id = ${q(r.id)} AND s.spot_text = ${q(r.from)}\n  AND NOT EXISTS (SELECT 1 FROM public.location_iconic_spots o WHERE o.location_key = s.location_key AND o.spot_text = ${q(r.to)});`
    );
    fs.writeFileSync(SQL, lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} updates)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
