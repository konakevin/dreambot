#!/usr/bin/env node
/**
 * tag-scenario-gender.js — solo scenario rows marked gender 'any' whose outfit only reads as one gender's, so a man was
 * served "a summer dress, wedge sandals" or "a shredded ivory wedding dress" (2026-10-01, found during the holiday pool
 * cleanup right after Kevin's "why are we getting fruity outfits like this for men?"). The engine already draws a solo
 * from 'any' + the dreamer's own gender (holidaySingleCandidates / the everyday picker), so the fix is the tag.
 *
 * Reads each 'any' row's attire and asks who can wear it AS WRITTEN: women only (a gown, a dress, a skirt, a bodice,
 * heels), men only (a tuxedo, a beard), or either. Writes <out>/gender.json for review and, with --sql, guarded UPDATEs
 * (only rows still 'any').
 *
 *   node scripts/tag-scenario-gender.js --out <dir> [--sql <file>]
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
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const CHUNK = 60;

const SYSTEM = `Each line is the outfit a single person wears in a dream scene. Decide who can wear it AS WRITTEN without it reading as cross-dressing:
- "W": it names a garment or item that reads as women's wear (a gown, a dress, a skirt, a bodice, a corset, a blouse, heels, a tiara, a bridal veil).
- "M": it names a garment or item that reads as men's wear (a tuxedo, a beard, a codpiece).
- "E": either a man or a woman can wear it as written (a coat, a sweater, trousers, boots, a cape, armour, a costume without a gendered garment).
"Dress shirt", "dress shoes", "dress boots", "lace-up boots" and "tie-dye" are E. Judge only the outfit words.
Reply ONLY a JSON array with one entry per line, in order: [{"n": <n>, "g": "W"|"M"|"E"}]`;

async function loadAny() {
  let rows = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await sb
      .from('single_scenarios')
      .select('id, pool, category, attire')
      .eq('gender', 'any')
      .eq('disabled', false)
      .order('id')
      .range(f, f + 999);
    if (error) throw new Error(error.message);
    rows = rows.concat(data);
    if (data.length < 1000) break;
  }
  return rows.filter((r) => r.attire && r.attire.trim());
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = await loadAny();
  console.log(`${rows.length} solo rows marked 'any'`);
  const chunks = [];
  for (let off = 0; off < rows.length; off += CHUNK) chunks.push(rows.slice(off, off + CHUNK));
  const verdict = new Map();
  let next = 0;
  async function worker() {
    while (next < chunks.length) {
      const chunk = chunks[next++];
      try {
        const res = await ask(
          SYSTEM,
          chunk.map((r, i) => `${i + 1}. ${r.attire}`).join('\n'),
          3000
        );
        for (const x of res)
          if (
            x &&
            Number.isInteger(x.n) &&
            x.n >= 1 &&
            x.n <= chunk.length &&
            ['W', 'M', 'E'].includes(x.g)
          )
            verdict.set(chunk[x.n - 1].id, x.g);
      } catch (e) {
        console.warn(`chunk FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const out = rows.map((r) => ({ ...r, g: verdict.get(r.id) || null }));
  fs.writeFileSync(path.join(OUT, 'gender.json'), JSON.stringify(out, null, 1));
  const count = (g) => out.filter((r) => r.g === g).length;
  console.log(`W ${count('W')} · M ${count('M')} · E ${count('E')} · unread ${count(null)}`);
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const lines = out
      .filter((r) => r.g === 'W' || r.g === 'M')
      .map(
        (r) =>
          `UPDATE public.single_scenarios SET gender = ${q(r.g === 'W' ? 'female' : 'male')} WHERE id = ${q(r.id)} AND gender = 'any';`
      );
    fs.writeFileSync(SQL, lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} updates)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
