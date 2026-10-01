#!/usr/bin/env node
/**
 * fill-holiday-themes.js — phase 5 of NIGHTLY_POOL_CLEANUP_PLAN.md: holiday sub-themes the duplicate pass left thin get
 * new rows that are genuinely different takes on the theme (a theme is drawn as often whatever its size, so a gutted
 * theme serves the same few prompts every time it comes up).
 *
 * Reads the duplicate pass's group files (clean-scenario-pools.js --holidays ...), and for every (table, holiday, theme)
 * left under --floor rows writes enough new ones to reach --target, in the theme's own format, then drops any that a
 * duplicate read groups with an existing row. Writes <out>/fill.json for review and, with --sql, the inserts.
 *
 *   node scripts/fill-holiday-themes.js --groups <dir>/groups --out <dir> [--floor 8] [--target 10] [--only <theme>] [--sql <file>]
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { ask, judgeGroups } = require('./lib/poolJudge');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const GROUPS = arg('groups', null);
const OUT = arg('out', '.');
const SQL = arg('sql', null);
const FLOOR = Number(arg('floor', '8'));
const TARGET = Number(arg('target', '10'));
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const ONLY = arg('only', null); // one theme name, to redo a single theme

const DEFINITION = {
  fall: 'autumn: foliage, harvest, orchards, cozy rain and firesides, golden light, crisp mountain air',
  halloween:
    'Halloween: spooky, eerie or whimsical Halloween (costumes, jack-o-lanterns, haunted places, witches, monsters) or Día de Muertos',
};
const SWAP_SAFE =
  'Outfits are clothing, headwear and props only: never a mask, face paint, a veil or hood over the face, sunglasses or goggles over the eyes, and never a hair colour. A man always wears menswear (coats, suits, tunics, trousers, armour), a woman womenswear; both daring and striking, never plain everyday basics.';

async function liveRows(table, holiday, theme, dropIds) {
  const base =
    table === 'holiday_scenes'
      ? sb.from(table).select('id, scene').eq('holiday', holiday)
      : sb
          .from(table)
          .select('id, scene, attire' + (table === 'single_scenarios' ? ', gender' : ''))
          .eq('pool', 'holiday')
          .eq('category', holiday);
  // The duplicate pass files rows with no sub-theme under 'unsorted'.
  const q = theme === 'unsorted' ? base.is('sub_theme', null) : base.eq('sub_theme', theme);
  const { data, error } = await q.eq('disabled', false);
  if (error) throw new Error(error.message);
  return data.filter((r) => !dropIds.has(r.id));
}

function format(table) {
  if (table === 'dual_scenarios')
    return {
      shape: '{"scene": "...", "attire": "She in ..., he in ..."}',
      rules: `"scene" is the PLACE and its atmosphere only, 20-40 words, comma-separated details like the examples, no people. "attire" names both outfits, "She in ..., he in ...". ${SWAP_SAFE}`,
    };
  if (table === 'single_scenarios')
    return {
      shape: '{"scene": "...", "attire": "...", "gender": "female"|"male"}',
      rules: `"scene" is the PLACE and its atmosphere only, 20-40 words, comma-separated details like the examples, no people. "attire" is one person's outfit for that gender. Write half for "female" and half for "male". ${SWAP_SAFE}`,
    };
  return {
    shape: '{"scene": "..."}',
    rules:
      '"scene" is a scene-only dream with no people in it, 50-80 words of vivid prose in the voice of the examples.',
  };
}

async function fillTheme(t) {
  const rows = await liveRows(t.table, t.holiday, t.theme, t.dropIds);
  const need = TARGET - rows.length;
  if (rows.length >= FLOOR) return { ...t, kept: rows.length, added: [] };
  const f = format(t.table);
  const seen = [...rows.map((r) => r.scene), ...t.dupScenes];
  const system = `You write NEW rows for a ${t.holiday} pool of a dream app, sub-theme "${t.theme}". ${t.holiday} here means ${DEFINITION[t.holiday] || t.holiday}.
Each row is a dream a person is placed in. Every new row is a GENUINELY DIFFERENT take on the sub-theme: a different place, view, moment or twist, never a reworded version of an existing row (listed).
Every row keeps EVERY element the sub-theme name promises (harvest_moonrise_foliage_lake = a harvest moon rising over a lake ringed by autumn foliage, every time), varied by the place, the view and the moment.
Stay inside "${t.theme}": never bring in another sub-theme or tradition the holiday also covers (no Día de Muertos marigolds or charro suits on a haunted-house theme), and never a real culture's traditional dress.
${f.rules}
Examples of this pool's voice (do not repeat any of these ideas):
${rows
  .slice(0, 6)
  .map((r) => `- ${r.scene}${r.attire ? ` | ${r.attire}` : ''}`)
  .join('\n')}
Reply ONLY a JSON array of ${need + 3} rows: [${f.shape}, ...]`;
  const res = await ask(
    system,
    `Existing rows (all of them, do not repeat):\n${seen.map((s) => '- ' + s).join('\n')}`,
    4000
  );
  let cands = res.filter(
    (r) =>
      r &&
      typeof r.scene === 'string' &&
      r.scene.trim() &&
      (t.table === 'holiday_scenes' || (typeof r.attire === 'string' && r.attire.trim())) &&
      (t.table !== 'single_scenarios' || r.gender === 'female' || r.gender === 'male')
  );
  // A candidate that groups with an existing row or another candidate is dropped (only a group's pick survives).
  const base = seen;
  const groups = await judgeGroups(
    `You find duplicate ideas among dream scenes for the "${t.theme}" sub-theme of a ${t.holiday} pool. Two scenes are the SAME IDEA only when they would render as the same picture. Sharing the sub-theme is never sameness on its own. Be conservative.
Reply ONLY a JSON array (empty if none): [{"keep": <n>, "same": [<n>, ...], "why": "<5-12 words>"}]`,
    [...base, ...cands.map((c) => c.scene)]
  );
  const clash = new Set();
  for (const g of groups) {
    const members = [g.keep, ...g.same];
    members.forEach((m) => {
      if (m >= base.length && (members.some((o) => o < base.length) || m !== g.keep))
        clash.add(m - base.length);
    });
  }
  cands = cands.filter((_, i) => !clash.has(i)).slice(0, need);
  return { ...t, kept: rows.length, added: cands };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(GROUPS).filter((f) => f.endsWith('.json'));
  const extraOff = new Set(
    fs.existsSync(path.join(OUT, 'off-ids.json'))
      ? JSON.parse(fs.readFileSync(path.join(OUT, 'off-ids.json'), 'utf8'))
      : []
  );
  const themes = files
    .map((f) => JSON.parse(fs.readFileSync(path.join(GROUPS, f), 'utf8')))
    .map((g) => ({
      table: g.table,
      holiday: g.category,
      theme: g.bucket,
      dropIds: new Set([...g.duplicates.map((d) => d.id), ...extraOff]),
      dupScenes: g.duplicates.map((d) => d.scene),
      left: g.size - g.duplicates.length,
    }))
    // A few more than the floor too: rows switched off outside the duplicate pass (off-ids.json) can take a theme
    // under it, and fillTheme counts the live rows before writing anything.
    // 'unsorted' (rows with no sub-theme) is not a theme the engine draws as one, so it is never refilled.
    .filter((t) => t.theme !== 'unsorted' && t.left < FLOOR + 3 && (!ONLY || t.theme === ONLY));
  console.log(`${themes.length} themes near or under ${FLOOR}`);
  const results = [];
  let next = 0;
  async function worker() {
    while (next < themes.length) {
      const t = themes[next++];
      try {
        const r = await fillTheme(t);
        results.push(r);
        if (r.added.length)
          console.log(`${t.table} ${t.holiday}/${t.theme}: ${r.kept} kept + ${r.added.length}`);
      } catch (e) {
        console.warn(`${t.table} ${t.holiday}/${t.theme}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const plain = results.map((r) => ({
    table: r.table,
    holiday: r.holiday,
    theme: r.theme,
    kept: r.kept,
    added: r.added,
  }));
  fs.writeFileSync(path.join(OUT, 'fill.json'), JSON.stringify(plain, null, 1));
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const lines = [];
    for (const r of plain)
      for (const a of r.added) {
        if (r.table === 'holiday_scenes')
          lines.push(
            `INSERT INTO public.holiday_scenes (holiday, sub_theme, scene, disabled, day_of) VALUES (${q(r.holiday)}, ${q(r.theme)}, ${q(a.scene)}, false, false);`
          );
        else if (r.table === 'dual_scenarios')
          lines.push(
            `INSERT INTO public.dual_scenarios (pool, category, sub_theme, scene, attire, disabled, day_of, relationship_scope) VALUES ('holiday', ${q(r.holiday)}, ${q(r.theme)}, ${q(a.scene)}, ${q(a.attire)}, false, false, 'any');`
          );
        else
          lines.push(
            `INSERT INTO public.single_scenarios (pool, category, sub_theme, scene, attire, gender, disabled, day_of, relationship_scope) VALUES ('holiday', ${q(r.holiday)}, ${q(r.theme)}, ${q(a.scene)}, ${q(a.attire)}, ${q(a.gender)}, false, false, 'any');`
          );
      }
    fs.writeFileSync(SQL, lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} inserts)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
