/**
 * One-off: apply the Dream Off pool RESEEDS. For each reseed pool it (1) backs up
 * EVERY current dream_off_topics row to a timestamped JSON snapshot, (2) deletes
 * the pool's seeds SCOPED by (pack, category) — never unscoped, (3) inserts the
 * curated final_<id>.txt survivors. Count-first + full backup = reversible.
 *
 *   node scripts/apply-dreamoff-reseed.js            # dry-run (counts only)
 *   node scripts/apply-dreamoff-reseed.js --apply    # actually mutate
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const sb = createClient(url, key);

const SCRATCH =
  '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/06480181-826c-4534-a0dc-c2d781ca93fa/scratchpad';

// pool id "<pack>__<category>" ; pack names use single _, separator is __
const RESEED = [
  'chaotic__scene', 'glam__scene', 'halloween_funny__scene', 'halloween_scary__scene',
  'roast__cast', 'christmas_funny__cast', 'new_years_funny__cast', 'st_patricks_funny__cast',
  'july_4th_funny__cast', 'new_years_cute__cast', 'christmas_spicy__cast',
];
const MIN = { // safety floor — refuse to reseed a pool if the final file is thinner
  chaotic__scene: 80, glam__scene: 70, halloween_funny__scene: 60, halloween_scary__scene: 60,
  roast__cast: 65, christmas_funny__cast: 60, new_years_funny__cast: 44,
  st_patricks_funny__cast: 42, july_4th_funny__cast: 44, new_years_cute__cast: 44,
  christmas_spicy__cast: 44,
};

const APPLY = process.argv.includes('--apply');

function readFinal(id) {
  const f = `${SCRATCH}/final_${id}.txt`;
  if (!fs.existsSync(f)) return null;
  return fs
    .readFileSync(f, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 4);
}

(async () => {
  // 1. Full backup snapshot of ALL topics (reversible). PAGINATE — PostgREST
  // silently caps a single read at 1000 rows, and a truncated backup is worse
  // than none.
  const allRows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('dream_off_topics')
      .select('pack,category,topic_text,is_active')
      .order('pack')
      .order('category')
      .order('topic_text')
      .range(from, from + 999);
    if (error) throw error;
    allRows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  const stamp = process.argv.find((a) => a.startsWith('--stamp='))?.split('=')[1] || 'manual';
  const backup = `${SCRATCH}/backup_dream_off_topics_${stamp}.json`;
  if (APPLY) fs.writeFileSync(backup, JSON.stringify(allRows, null, 0));
  console.log(`backup: ${allRows.length} rows -> ${APPLY ? backup : '(dry-run, not written)'}\n`);

  let ok = 0;
  for (const id of RESEED) {
    const sep = id.lastIndexOf('__');
    const pack = id.slice(0, sep);
    const category = id.slice(sep + 2);
    const seeds = readFinal(id);
    const { count: before } = await sb
      .from('dream_off_topics')
      .select('*', { count: 'exact', head: true })
      .eq('pack', pack)
      .eq('category', category);
    if (!seeds) {
      console.log(`SKIP ${id.padEnd(28)} final file missing (have ${before} live)`);
      continue;
    }
    if (seeds.length < (MIN[id] || 40)) {
      console.log(`SKIP ${id.padEnd(28)} only ${seeds.length} seeds (< min ${MIN[id]})`);
      continue;
    }
    console.log(`${APPLY ? 'RESEED' : 'plan  '} ${id.padEnd(28)} ${before} -> ${seeds.length}`);
    if (APPLY) {
      const del = await sb.from('dream_off_topics').delete().eq('pack', pack).eq('category', category);
      if (del.error) { console.log(`  DELETE ERR: ${del.error.message}`); continue; }
      const rows = seeds.map((t) => ({ pack, category, topic_text: t, is_active: true }));
      // chunk inserts
      for (let i = 0; i < rows.length; i += 200) {
        const ins = await sb.from('dream_off_topics').insert(rows.slice(i, i + 200));
        if (ins.error) { console.log(`  INSERT ERR: ${ins.error.message}`); break; }
      }
      const { count: after } = await sb
        .from('dream_off_topics')
        .select('*', { count: 'exact', head: true })
        .eq('pack', pack)
        .eq('category', category);
      console.log(`  done -> ${after} live`);
      ok++;
    }
  }
  console.log(`\n${APPLY ? `reseeded ${ok}/${RESEED.length} pools` : 'DRY RUN — pass --apply to mutate'}`);
})();
