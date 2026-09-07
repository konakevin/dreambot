#!/usr/bin/env node
// Live-DB parity for _shared/actionRegisters.ts: every ENABLED non-active scenario category (dual + single),
// every Halloween + Fall pool and every location biome must resolve to a genre register. Exit 1 on a gap.
// Run after seeding a new category/pool. (Fast-jest covers the code-side lists; this covers the DB.)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const src = fs.readFileSync(
  require('path').join(__dirname, '..', 'supabase/functions/_shared/actionRegisters.ts'),
  'utf8'
);
const keys = new Set([...src.matchAll(/^  ([a-z_0-9]+): R\(/gm)].map((m) => m[1]));
const aliases = Object.fromEntries(
  [...src.matchAll(/^  ([a-z_0-9]+): '([a-z_0-9]+)',$/gm)].map((m) => [m[1], m[2]])
);
const resolves = (k) => keys.has(aliases[k] ?? k);
(async () => {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const missing = [];
  for (const t of ['dual_scenarios', 'single_scenarios']) {
    let from = 0;
    const cats = new Set();
    for (;;) {
      const { data, error } = await sb
        .from(t)
        .select('pool,category')
        .eq('disabled', false)
        .neq('pool', 'holiday')
        .neq('pool', 'active')
        .order('id')
        .range(from, from + 999);
      if (error) throw error;
      for (const r of data) if (r.category) cats.add(r.category);
      if (data.length < 1000) break;
      from += 1000;
    }
    for (const c of cats) if (!resolves(c)) missing.push(`${t}:${c}`);
  }
  const { POOLS } = require('./lib/halloweenPools');
  for (const p of Object.keys(POOLS)) if (!resolves(p)) missing.push(`halloween:${p}`);
  const { POOLS: FALL } = require('./lib/fallPools');
  for (const p of Object.keys(FALL)) if (!resolves(p)) missing.push(`fall:${p}`);
  const { data: biomes } = await sb.from('location_cards').select('biome').not('biome', 'is', null);
  for (const b of new Set((biomes || []).map((r) => r.biome)))
    if (!resolves(b)) missing.push(`biome:${b}`);
  if (missing.length) {
    console.error('✗ action registers missing for:', missing.join(', '));
    process.exit(1);
  }
  console.log(
    `✓ action registers: every enabled scenario category, Halloween pool and card biome resolves (${keys.size} registers, ${Object.keys(aliases).length} aliases).`
  );
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
