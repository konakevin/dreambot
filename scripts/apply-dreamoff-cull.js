/**
 * One-off: apply the Dream Off targeted CULLS from the strict audit. Reads the
 * per-group cull_*.json cut-lists, takes a fresh full backup, then bulk-deletes
 * the flagged seeds SCOPED per (pack, category) via an exact topic_text match.
 * Reports matched-vs-requested per pool so text mismatches surface (a miss is a
 * no-op, never a wrong delete). Skips any pool that was fully reseeded.
 *
 *   node scripts/apply-dreamoff-cull.js            # dry-run
 *   node scripts/apply-dreamoff-cull.js --apply    # mutate
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const sb = createClient(url, key);

const SCRATCH =
  '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/06480181-826c-4534-a0dc-c2d781ca93fa/scratchpad';
const APPLY = process.argv.includes('--apply');

const RESEEDED = new Set([
  'chaotic|scene', 'glam|scene', 'halloween_funny|scene', 'halloween_scary|scene',
  'roast|cast', 'christmas_funny|cast', 'new_years_funny|cast', 'st_patricks_funny|cast',
  'july_4th_funny|cast', 'new_years_cute|cast', 'christmas_spicy|cast',
]);

(async () => {
  // gather cuts
  const cuts = [];
  for (let g = 0; g < 6; g++) {
    const f = `${SCRATCH}/cull_group_${g}.json`;
    if (!fs.existsSync(f)) { console.log(`(missing ${f})`); continue; }
    const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const c of arr) {
      if (!c || !c.pack || !c.category || !c.text) continue;
      const k = `${c.pack}|${c.category}`;
      if (RESEEDED.has(k)) continue; // safety — reseeded pools are already replaced
      cuts.push({ pack: c.pack, category: c.category, text: c.text.trim() });
    }
  }
  // group by pool
  const byPool = new Map();
  for (const c of cuts) {
    const k = `${c.pack}|${c.category}`;
    if (!byPool.has(k)) byPool.set(k, new Set());
    byPool.get(k).add(c.text);
  }
  console.log(`${cuts.length} cuts across ${byPool.size} pools\n`);

  if (APPLY) {
    // fresh backup (paginated — PostgREST 1000 cap)
    const all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb
        .from('dream_off_topics').select('pack,category,topic_text,is_active')
        .order('pack').order('category').order('topic_text').range(from, from + 999);
      if (error) throw error;
      all.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    fs.writeFileSync(`${SCRATCH}/backup_dream_off_topics_precull.json`, JSON.stringify(all));
    console.log(`backup: ${all.length} rows -> backup_dream_off_topics_precull.json\n`);
  }

  let totalReq = 0, totalDel = 0;
  for (const [k, texts] of [...byPool].sort()) {
    const [pack, category] = k.split('|');
    const arr = [...texts];
    totalReq += arr.length;
    if (!APPLY) { console.log(`plan  ${k.padEnd(34)} cut ${arr.length}`); continue; }
    let del = 0;
    for (let i = 0; i < arr.length; i += 100) {
      const { data, error } = await sb
        .from('dream_off_topics').delete()
        .eq('pack', pack).eq('category', category).in('topic_text', arr.slice(i, i + 100))
        .select('id');
      if (error) { console.log(`  ${k} ERR: ${error.message}`); break; }
      del += (data || []).length;
    }
    totalDel += del;
    const flag = del < arr.length ? `  <-- ${arr.length - del} unmatched (text drift)` : '';
    console.log(`cull  ${k.padEnd(34)} ${del}/${arr.length}${flag}`);
  }
  console.log(`\n${APPLY ? `deleted ${totalDel}/${totalReq}` : `DRY RUN — ${totalReq} planned; pass --apply`}`);
})();
