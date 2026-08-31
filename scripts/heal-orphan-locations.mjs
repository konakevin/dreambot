#!/usr/bin/env node
/**
 * heal-orphan-locations.mjs — one-time self-heal for saved user locations.
 *
 * Users' saved selections live in `user_recipes.recipe.dream_seeds.places` as an
 * array of location NAMES. The 2026-08 location overhaul scaled the spot pools and
 * regrouped the picker sections but KEPT the card names, so saved selections carry
 * over automatically — EXCEPT a handful of legacy FREEFORM strings from before the
 * app went curated-only (e.g. "Paris at night", "a tropical beach at sunset") that
 * match no `location_card` at all. Those are dead refs (nightly can't load them).
 *
 * This drops ONLY names that match no card. It KEEPS dark-but-real cards (admin_only
 * = true) — those light up when their category goes live, so they are NOT orphans.
 * Curated-only selection means no NEW orphans can be created, so this is a one-time run.
 *
 * Usage:
 *   node scripts/heal-orphan-locations.mjs            # DRY RUN (default) — shows what would change
 *   node scripts/heal-orphan-locations.mjs --write    # apply
 */
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const WRITE = process.argv.includes('--write');

(async () => {
  // Every card name that exists (dark or live) — paginated past the 1000-row cap.
  const cardNames = new Set();
  for (let from = 0; ; from += 1000) {
    const { data } = await sb.from('location_cards').select('name').range(from, from + 999);
    if (!data || !data.length) break;
    for (const c of data) cardNames.add(c.name);
    if (data.length < 1000) break;
  }

  const { data: recipes } = await sb.from('user_recipes').select('user_id, recipe');
  let usersChanged = 0, refsDropped = 0;
  const droppedFreq = {};

  for (const r of recipes || []) {
    const recipe = r.recipe;
    const places = recipe && recipe.dream_seeds && recipe.dream_seeds.places;
    if (!Array.isArray(places) || !places.length) continue;
    const kept = places.filter((p) => cardNames.has(p));
    if (kept.length === places.length) continue; // nothing orphaned
    const dropped = places.filter((p) => !cardNames.has(p));
    dropped.forEach((p) => (droppedFreq[p] = (droppedFreq[p] || 0) + 1));
    refsDropped += dropped.length;
    usersChanged++;
    console.log(`  user ${r.user_id.slice(0, 8)}: drop ${JSON.stringify(dropped)} (keeps ${kept.length})`);
    if (WRITE) {
      const next = { ...recipe, dream_seeds: { ...recipe.dream_seeds, places: kept } };
      const { error } = await sb.from('user_recipes').update({ recipe: next }).eq('user_id', r.user_id);
      if (error) console.error(`    ✗ ${r.user_id}: ${error.message}`);
    }
  }

  console.log(`\n${WRITE ? 'APPLIED' : 'DRY RUN'} — users changed: ${usersChanged}, orphan refs dropped: ${refsDropped}`);
  console.log('dropped names:', JSON.stringify(droppedFreq));
  if (!WRITE) console.log('(re-run with --write to apply)');
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
