#!/usr/bin/env node
/**
 * audit-seed-dream-test.js — NIGHTLY_NO_PLAIN_RENDERS_PLAN.md §7 L1.
 * Judges every ENABLED scenario seed (and optionally every picker location card) against Kevin's dream test,
 * applied to the SEED TEXT: a seed passes if the setting is a dreamscape OR the attire is a persona; it is
 * PLAIN when the setting is ordinary/blank AND the attire is everyday AND nothing happens.
 *
 *   node scripts/audit-seed-dream-test.js --table dual_scenarios [--pool goofy] [--out <dir>]
 *   node scripts/audit-seed-dream-test.js --table single_scenarios --pool elegant,goofy
 *   node scripts/audit-seed-dream-test.js --cards
 *   node scripts/audit-seed-dream-test.js --disable <verdicts.json>   → scoped disables + ledger (after Kevin's review)
 *
 * Read-only unless --disable. Sonnet text judge, 25 rows per call, JSON verdicts. Paginates (PostgREST 1000 cap).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const OUT = arg('out', process.env.SCRATCH || '/tmp');
const CONC = 3;

const RUBRIC = `You judge SEED TEXT for an AI "dream" image in which a real person's face is later swapped in. Kevin's rule: a nightly dream must whisk the person into an actual dream. A seed PASSES (DREAM) if EITHER (a) the SETTING is a dreamscape — a real or imagined place with wonder: atmosphere, spectacle, scale, striking light or weather, story (a moonlit lane of jack-o-lanterns, a glacier at dawn, a gothic ballroom, a pirate ship, a canyon at twilight) — OR (b) the ATTIRE/PERSONA is the dream — a transformation: costume, era, role (medieval warrior, 1920s flapper, astronaut, vampire, pirate, ballgown). A seed is PLAIN only when ALL hold: the setting is ordinary or blank (studio backdrop, office, waiting room, plain wall, hotel lobby, generic street, mall, atrium, plain room, ordinary park/zoo railing) AND the attire is everyday clothes (or "normal clothes") AND nothing dreamlike happens — a small gag or a single prop does NOT rescue it. Do not over-flag: an ordinary outfit at a spectacular place is DREAM; a costume in a plain corridor is DREAM.
Return ONLY a JSON array, one object per input id, in input order: [{"id":"…","verdict":"DREAM"|"PLAIN","why":"<= 10 words"}]`;

async function judgeBatch(rows) {
  const payload = rows.map((r) => ({ id: r.id, scene: r.scene, attire: r.attire ?? r.essence ?? '' }));
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content: `${RUBRIC}\n\nINPUT:\n${JSON.stringify(payload)}` }] }),
  });
  const j = await res.json();
  const text = (j.content && j.content[0] && j.content[0].text) || '';
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('no JSON in judge response: ' + text.slice(0, 120));
  return JSON.parse(m[0]);
}

async function fetchAll(table, pools) {
  const rows = [];
  for (const pool of pools) {
    let from = 0;
    for (;;) {
      const { data, error } = await sb.from(table).select('id,pool,category,sub_theme,scene,attire').eq('disabled', false).eq('pool', pool).order('id').range(from, from + 999);
      if (error) throw error;
      rows.push(...data);
      if (data.length < 1000) break;
      from += 1000;
    }
  }
  return rows;
}

async function run(label, rows) {
  const verdicts = [];
  const batches = [];
  for (let i = 0; i < rows.length; i += 25) batches.push(rows.slice(i, i + 25));
  let done = 0;
  const worker = async () => {
    while (batches.length) {
      const b = batches.shift();
      try {
        const vs = await judgeBatch(b);
        for (const v of vs) { const r = b.find((x) => x.id === v.id); if (r) verdicts.push({ ...r, verdict: v.verdict, why: v.why }); }
      } catch (e) { console.error('  batch failed:', e.message.slice(0, 100)); }
      done += b.length;
      if (done % 500 < 25) process.stdout.write(`  ${done}/${rows.length}\r`);
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));
  const out = path.join(OUT, `seeds-${label}.json`);
  fs.writeFileSync(out, JSON.stringify(verdicts, null, 1));
  const byCat = {};
  for (const v of verdicts) { const k = `${v.pool}/${v.category ?? v.sub_theme ?? '?'}`; byCat[k] = byCat[k] || { n: 0, plain: 0 }; byCat[k].n++; if (v.verdict === 'PLAIN') byCat[k].plain++; }
  const plain = verdicts.filter((v) => v.verdict === 'PLAIN').length;
  console.log(`\n${label}: ${plain} PLAIN / ${verdicts.length} judged (${Math.round((100 * plain) / Math.max(1, verdicts.length))}%) → ${out}`);
  for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1].plain / b[1].n - a[1].plain / a[1].n)) if (v.plain) console.log(`  ${k.padEnd(36)} ${String(v.plain).padStart(3)} / ${v.n}`);
  return verdicts;
}

(async () => {
  if (process.argv.includes('--disable')) {
    const file = arg('disable'); const verdicts = JSON.parse(fs.readFileSync(file, 'utf8')).filter((v) => v.verdict === 'PLAIN');
    const table = arg('table'); if (!table) throw new Error('--table required with --disable');
    const ledger = { at: new Date().toISOString(), table, source: file, ids: verdicts.map((v) => v.id) };
    const { error } = await sb.from(table).update({ disabled: true }).in('id', ledger.ids); if (error) throw error;
    const lp = path.join(OUT, `disable-plain-${table}-${Date.now()}.json`); fs.writeFileSync(lp, JSON.stringify(ledger, null, 1));
    console.log(`disabled ${ledger.ids.length} PLAIN rows in ${table}; ledger ${lp}`); return;
  }
  if (process.argv.includes('--cards')) {
    const { data } = await sb.from('location_cards').select('id,name,biome,atmosphere,cinematic_phrases').not('picker_category', 'is', null);
    const rows = data.map((c) => ({ id: c.id, pool: 'card', category: c.biome, scene: `${c.name}. ${c.atmosphere ?? ''} ${(c.cinematic_phrases || []).slice(0, 4).join('; ')}`, attire: 'contemporary travel clothes' }));
    await run('location_cards', rows); return;
  }
  const table = arg('table', 'dual_scenarios');
  const pools = (arg('pool', 'goofy,elegant,active,holiday')).split(',');
  const rows = await fetchAll(table, pools);
  console.log(`${table} [${pools.join(',')}]: ${rows.length} enabled rows → judging in batches of 25 (conc ${CONC})`);
  await run(`${table}-${pools.join('_')}`, rows);
})().catch((e) => { console.error(e.message); process.exit(1); });
