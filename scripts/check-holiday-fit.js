#!/usr/bin/env node
/**
 * check-holiday-fit.js — phase 5 of NIGHTLY_POOL_CLEANUP_PLAN.md: holiday rows that drifted off their holiday or their
 * sub-theme, for review. Never automatic (Kevin's rule for drift): a first read flags per sub-theme, a keep-by-default
 * second read confirms, and only rows both reads call off reach the review file.
 *
 *   node scripts/check-holiday-fit.js --holidays fall,halloween --out <dir>
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
const HOLIDAYS = String(arg('holidays', 'fall,halloween'))
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const CHUNK = 60;

// What each holiday IS, so "off" has a definition (the sub-theme names the rest).
const DEFINITION = {
  fall: 'autumn: foliage, harvest, orchards, cozy rain and firesides, golden light, crisp mountain air. An early dusting of snow on high peaks or a first-snow meadow is still autumn.',
  halloween:
    'Halloween: spooky, eerie or whimsical Halloween (costumes, jack-o-lanterns, haunted places, witches, monsters, trick-or-treating) and Día de Muertos (ofrendas, marigolds, calaveras).',
};
const OFF_BY_HOLIDAY = {
  fall: 'deep winter (skiing, blizzards, a snowbound landscape), Christmas or another holiday, summer beach, spring blossom, or nothing autumnal at all',
  halloween:
    'Christmas or another holiday, a snowy winter scene, or a scene with nothing of Halloween or Día de Muertos in it',
};

async function loadRows() {
  const out = [];
  const page = async (table, build, map) => {
    for (let f = 0; ; f += 1000) {
      const { data, error } = await build(sb.from(table))
        .order('id')
        .range(f, f + 999);
      if (error) throw new Error(`${table}: ${error.message}`);
      out.push(...data.map(map));
      if (data.length < 1000) break;
    }
  };
  for (const table of ['dual_scenarios', 'single_scenarios'])
    await page(
      table,
      (q) =>
        q
          .select('id, category, sub_theme, scene')
          .eq('pool', 'holiday')
          .eq('disabled', false)
          .in('category', HOLIDAYS),
      (r) => ({
        table,
        id: r.id,
        holiday: r.category,
        theme: r.sub_theme || 'unsorted',
        scene: r.scene,
      })
    );
  await page(
    'holiday_scenes',
    (q) => q.select('id, holiday, sub_theme, scene').eq('disabled', false).in('holiday', HOLIDAYS),
    (r) => ({
      table: 'holiday_scenes',
      id: r.id,
      holiday: r.holiday,
      theme: r.sub_theme || 'unsorted',
      scene: r.scene,
    })
  );
  return out;
}

async function readFlags(system, rows) {
  const out = new Set();
  for (let off = 0; off < rows.length; off += CHUNK) {
    const chunk = rows.slice(off, off + CHUNK);
    const res = await ask(system, chunk.map((r, i) => `${i + 1}. ${r.scene}`).join('\n'), 2000);
    for (const n of res)
      if (Number.isInteger(n) && n >= 1 && n <= chunk.length) out.add(off + n - 1);
  }
  return out;
}

async function checkGroup(g) {
  const first = `You check scenes in a holiday pool of a dream app: each line is a scene a dreamer is placed in for ${g.holiday}, sub-theme "${g.theme}".
${g.holiday} here means ${DEFINITION[g.holiday] || g.holiday}.
Flag a scene when it is: ${OFF_BY_HOLIDAY[g.holiday] || 'another holiday or season'}; or a scene that has nothing to do with the sub-theme "${g.theme}"; or not a scene at all (a single object, a texture close-up, a camera direction).
When unsure, do not flag. Most scenes should not be flagged.
Reply ONLY a JSON array of the flagged line numbers (empty if none): [<n>, ...]`;
  const flagged = await readFlags(first, g.rows);
  const list = [...flagged].map((i) => g.rows[i]);
  if (!list.length) return { ...g, rows: undefined, size: g.rows.length, confirmed: [], kept: [] };
  const second = `You double-check scenes flagged as off for a ${g.holiday} pool in a dream app, sub-theme "${g.theme}". ${g.holiday} here means ${DEFINITION[g.holiday] || g.holiday}
A scene is OFF only when it is clearly ${OFF_BY_HOLIDAY[g.holiday] || 'another holiday or season'}, clearly unrelated to the sub-theme "${g.theme}", or not a scene at all. A loose or creative take on the sub-theme is ON. When in doubt it is ON.
Reply ONLY a JSON array of the line numbers that are clearly OFF (empty if none): [<n>, ...]`;
  const ok = await readFlags(second, list);
  return {
    table: g.table,
    holiday: g.holiday,
    theme: g.theme,
    size: g.rows.length,
    confirmed: list.filter((_, i) => ok.has(i)).map((r) => ({ id: r.id, scene: r.scene })),
    kept: list.filter((_, i) => !ok.has(i)).map((r) => ({ id: r.id, scene: r.scene })),
  };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = await loadRows();
  const byGroup = new Map();
  for (const r of rows) {
    const k = `${r.table}|${r.holiday}|${r.theme}`;
    if (!byGroup.has(k))
      byGroup.set(k, { table: r.table, holiday: r.holiday, theme: r.theme, rows: [] });
    byGroup.get(k).rows.push(r);
  }
  const groups = [...byGroup.values()];
  console.log(`${rows.length} rows in ${groups.length} groups`);
  const results = [];
  let next = 0;
  async function worker() {
    while (next < groups.length) {
      const g = groups[next++];
      try {
        const r = await checkGroup(g);
        results.push(r);
        if (r.confirmed.length || r.kept.length)
          console.log(
            `${g.table} ${g.holiday}/${g.theme}: ${r.confirmed.length} off · ${r.kept.length} kept`
          );
      } catch (e) {
        console.warn(`${g.table} ${g.holiday}/${g.theme}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  fs.writeFileSync(path.join(OUT, 'fit.json'), JSON.stringify(results, null, 1));
  const n = results.reduce((a, r) => a + r.confirmed.length, 0);
  console.log(`\n${results.length} groups · ${n} confirmed off (for review)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
