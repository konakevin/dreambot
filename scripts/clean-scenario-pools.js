#!/usr/bin/env node
/**
 * clean-scenario-pools.js — phase 3 of NIGHTLY_POOL_CLEANUP_PLAN.md: the shared scene pools (dual_scenarios,
 * single_scenarios; goofy / elegant / active), deduplicated the way the location spots were (mig 633).
 *
 * Kevin 2026-09-30 agreed the method on the location pools: DUPLICATES go automatically, judged by an LLM on the whole
 * group and then confirmed pair by pair (the group read alone was wrong ~1 in 10), keeping the best of each group.
 * Nothing is deleted: a duplicate is `disabled = true`, reversible. Holiday rows (pool 'holiday') are phase 5, after
 * the Fall / Halloween window, and are never touched here.
 *
 * Groups: table × pool × category. A category over MAX_GROUP rows is split by its first location key, the card a
 * dreamer draws it through (with the scope on, a dreamer only ever draws from their own cards' rows), so the judge
 * reads a list it can hold in one pass. The judge reads the SCENE text: two scenes in different attire are still the
 * same dream.
 *
 *   node scripts/clean-scenario-pools.js --out <dir> [--tables dual,single] [--pools goofy,elegant,active] [--resume]
 *   node scripts/clean-scenario-pools.js --out <dir> --sql <file>   # write the migration from the group files
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { judgeGroups, confirmPairs } = require('./lib/poolJudge');

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
const TABLES = String(arg('tables', 'dual,single'))
  .split(',')
  .map((t) => `${t.trim()}_scenarios`);
const POOLS = String(arg('pools', 'goofy,elegant,active'))
  .split(',')
  .map((p) => p.trim())
  .filter((p) => p && p !== 'holiday');
const RESUME = process.argv.includes('--resume');
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const MAX_GROUP = 250;

const judgePrompt = (
  g
) => `You find duplicate scenarios in a pool of dream scenes for a dream app: each line is a scene a dreamer is placed in (the "${g.pool}" pool, category "${g.category}"${g.bucket ? `, drawn through "${g.bucket}"` : ''}).
Two scenarios are the SAME IDEA when renders of each would show the same situation: the same kind of place with the same activity, moment or joke, so a viewer would call the two dreams the same. A different place, a different activity, or a genuinely different twist is a different idea, even when the wording is close. Sharing the category's theme is never sameness on its own.
Be conservative: group only scenes a viewer would genuinely call the same dream. Most scenes should be in no group.
For each group, "keep" is the strongest, most specific, most vivid member; "same" lists the others.
Reply ONLY a JSON array (empty if none): [{"keep": <n>, "same": [<n>, ...], "why": "<5-12 words>"}]. Numbers are the list numbers; each number appears at most once in the whole reply.`;

const pairPrompt = `Each line pairs two dream scenarios from a dream app. A line is "same" only when renders of each would show the same situation: the same kind of place with the same activity, moment or joke, so a viewer would call the two dreams the same. The same situation in different words IS the same. A different place, a different activity, or a different twist on the moment is never the same, even when the setting matches (a picnic in a meadow vs a kite flown over the same meadow).
Reply ONLY a JSON array of the line numbers that are the same (empty if none): [<n>, ...]`;

async function loadRows(table) {
  let rows = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await sb
      .from(table)
      .select('id, pool, category, scene, location_keys')
      .eq('disabled', false)
      .in('pool', POOLS)
      .order('id')
      .range(f, f + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows = rows.concat(data);
    if (data.length < 1000) break;
  }
  return rows;
}

function groupsOf(table, rows) {
  const byCat = new Map();
  for (const r of rows) {
    const k = `${r.pool}|${r.category || 'none'}`;
    if (!byCat.has(k)) byCat.set(k, []);
    byCat.get(k).push(r);
  }
  const groups = [];
  for (const [k, list] of byCat) {
    const [pool, category] = k.split('|');
    if (list.length <= MAX_GROUP) {
      groups.push({ table, pool, category, bucket: null, rows: list });
      continue;
    }
    const byKey = new Map();
    for (const r of list) {
      const key =
        Array.isArray(r.location_keys) && r.location_keys.length
          ? [...r.location_keys].sort()[0]
          : 'unscoped';
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(r);
    }
    for (const [key, sub] of byKey)
      for (let off = 0; off < sub.length; off += MAX_GROUP)
        groups.push({ table, pool, category, bucket: key, rows: sub.slice(off, off + MAX_GROUP) });
  }
  return groups;
}

const fileOf = (g, i) =>
  path.join(
    OUT,
    'groups',
    `${g.table}-${g.pool}-${g.category}${g.bucket ? '-' + g.bucket : ''}-${i}`.replace(
      /[^a-z0-9-]+/gi,
      '_'
    ) + '.json'
  );

async function cleanGroup(g) {
  const texts = g.rows.map((r) => r.scene);
  const groups = await judgeGroups(judgePrompt(g), texts);
  const pairs = groups.flatMap((gr) => gr.same.map((i) => ({ i, keep: gr.keep })));
  const ok = await confirmPairs(
    pairPrompt,
    pairs.map((p) => ({ a: texts[p.i], b: texts[p.keep] }))
  );
  const duplicates = [];
  const unconfirmed = [];
  pairs.forEach((p, k) =>
    (ok.has(k) ? duplicates : unconfirmed).push({
      id: g.rows[p.i].id,
      scene: texts[p.i],
      of: texts[p.keep],
    })
  );
  return {
    table: g.table,
    pool: g.pool,
    category: g.category,
    bucket: g.bucket,
    size: g.rows.length,
    duplicates,
    unconfirmed,
  };
}

(async () => {
  fs.mkdirSync(path.join(OUT, 'groups'), { recursive: true });
  if (!SQL) {
    const groups = [];
    for (const t of TABLES) groups.push(...groupsOf(t, await loadRows(t)));
    console.log(`${groups.length} groups to judge`);
    const queue = groups
      .map((g, i) => ({ g, i }))
      .filter(({ g, i }) => !(RESUME && fs.existsSync(fileOf(g, i))));
    let next = 0;
    async function worker() {
      while (next < queue.length) {
        const { g, i } = queue[next++];
        try {
          const r = await cleanGroup(g);
          fs.writeFileSync(fileOf(g, i), JSON.stringify(r, null, 1));
          console.log(
            `${g.table} ${g.pool}/${g.category}${g.bucket ? ` (${g.bucket})` : ''}: ${r.size} · ${r.duplicates.length} duplicates · ${r.unconfirmed.length} kept by the pair check`
          );
        } catch (e) {
          console.warn(`${g.table} ${g.pool}/${g.category}: FAILED ${e.message}`);
        }
      }
    }
    await Promise.all(Array.from({ length: CONC }, worker));
  }
  const files = fs.readdirSync(path.join(OUT, 'groups')).filter((f) => f.endsWith('.json'));
  const results = files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(OUT, 'groups', f), 'utf8'))
  );
  const tot = (k) => results.reduce((a, r) => a + (Array.isArray(r[k]) ? r[k].length : r[k]), 0);
  console.log(
    `\n${results.length} groups · ${tot('size')} scenarios · ${tot('duplicates')} confirmed duplicates · ${tot('unconfirmed')} kept by the pair check`
  );
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const lines = results.flatMap((r) =>
      r.duplicates.map(
        (d) =>
          `UPDATE public.${r.table} SET disabled = true WHERE id = ${q(d.id)} AND NOT disabled;`
      )
    );
    const header = `-- ${path.basename(SQL, '.sql')}: shared scene pools deduplicated (NIGHTLY_POOL_CLEANUP_PLAN.md phase 3,
-- scripts/clean-scenario-pools.js). Same method as the location spots (mig 633): an LLM grouped same-idea scenes per
-- table / pool / category (big categories split by their card), and only pairs a second pair-by-pair check confirmed are
-- disabled, keeping the best of each group. Holiday rows are untouched (phase 5). ${lines.length} rows disabled
-- (reversible: disabled = false). Re-runnable.\n\n`;
    fs.writeFileSync(SQL, header + lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} updates)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
