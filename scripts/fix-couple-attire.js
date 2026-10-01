#!/usr/bin/env node
/**
 * fix-couple-attire.js — holiday COUPLE rows whose outfit line does not say who wears what. The engine hands a couple
 * row's attire to the brief as "dress them in this" and expects "She in …, he in …" (nightly-dreams: "Couple rows are
 * written 'She in …, he in …'"), so "Both in diaphanous white-grey gowns" or "Fitted gowns crafted from rose petals"
 * put the man in a gown (2026-10-01, found in the fall/Halloween audit right after the card-wardrobe gender fix).
 *
 * One read per chunk of rows not already written "She in …, he in …": a row either person can wear as written is left
 * alone; a row that names a gendered garment without saying who wears it is rewritten as "She in …, he in …", keeping
 * the costume idea, colours, materials and props, the man in the menswear version. Writes <out>/couple-attire.json for
 * review and, with --sql, UPDATEs guarded on the old text.
 *
 *   node scripts/fix-couple-attire.js --holidays fall,halloween --out <dir> [--skip <ids.json>] [--sql <file>]
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
const SKIP = arg('skip', null);
const HOLIDAYS = String(arg('holidays', 'fall,halloween'))
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const CHUNK = 40;

// Already says who wears what: "She in …, he in …" (either order, "she wears" too).
const SPLIT = (a) =>
  /\bshe\b[^,;.]*\b(in|wears|wearing)\b/i.test(a) && /\bhe\b[^,;.]*\b(in|wears|wearing)\b/i.test(a);

const SYSTEM = `Each line is the outfit line for a COUPLE (a woman and a man) in a holiday dream scene. The line is given to an artist as "dress them in this".
Decide for each line:
- leave it: a man and a woman can both wear it as written (coats, sweaters, lab coats, uniforms, robes, capes, armour, a costume with no gendered garment), so nothing to change.
- fix it: it names a garment that reads as one gender's (a gown, a dress, a skirt, a bodice, a corset, a blouse, heels, a tiara, a bridal veil; or a tuxedo, a beard) WITHOUT saying which person wears it, so the man could end up in a gown. This includes "both in gowns" and an unlabelled pair like "a ballgown, a tailcoat".
For each line to fix, rewrite it as "She in …, he in …": keep the costume idea, the colours, the materials and every prop; give her the women's version and him the men's version of the SAME costume (a petal gown → a petal-trimmed frock coat; lace blouses → a lace-cuffed shirt with a high collar). Both outfits daring and striking, never plain. Never add a mask, face paint, a veil over the face, or goggles or glasses over the eyes. About the same length as the original.
Reply ONLY a JSON array of the lines to fix (empty if none): [{"n": <n>, "attire": "She in …, he in …"}]`;

async function loadRows() {
  let rows = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await sb
      .from('dual_scenarios')
      .select('id, category, sub_theme, attire')
      .eq('pool', 'holiday')
      .in('category', HOLIDAYS)
      .eq('disabled', false)
      .order('id')
      .range(f, f + 999);
    if (error) throw new Error(error.message);
    rows = rows.concat(data);
    if (data.length < 1000) break;
  }
  const skip = new Set(SKIP ? JSON.parse(fs.readFileSync(SKIP, 'utf8')) : []);
  return rows.filter((r) => !skip.has(r.id) && r.attire && r.attire.trim() && !SPLIT(r.attire));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = await loadRows();
  console.log(`${rows.length} couple rows not written "She in …, he in …"`);
  const chunks = [];
  for (let off = 0; off < rows.length; off += CHUNK) chunks.push(rows.slice(off, off + CHUNK));
  const fixes = new Map();
  let next = 0;
  async function worker() {
    while (next < chunks.length) {
      const chunk = chunks[next++];
      try {
        const res = await ask(
          SYSTEM,
          chunk.map((r, i) => `${i + 1}. ${r.attire}`).join('\n'),
          4000
        );
        for (const x of res)
          if (
            x &&
            Number.isInteger(x.n) &&
            x.n >= 1 &&
            x.n <= chunk.length &&
            typeof x.attire === 'string' &&
            SPLIT(x.attire)
          )
            fixes.set(chunk[x.n - 1].id, x.attire.trim());
      } catch (e) {
        console.warn(`chunk FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const out = rows
    .filter((r) => fixes.has(r.id))
    .map((r) => ({
      id: r.id,
      category: r.category,
      sub_theme: r.sub_theme,
      old: r.attire,
      attire: fixes.get(r.id),
    }));
  fs.writeFileSync(path.join(OUT, 'couple-attire.json'), JSON.stringify(out, null, 1));
  console.log(`${out.length} to rewrite`);
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const lines = out.map(
      (r) =>
        `UPDATE public.dual_scenarios SET attire = ${q(r.attire)} WHERE id = ${q(r.id)} AND attire = ${q(r.old)};`
    );
    fs.writeFileSync(SQL, lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} updates)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
