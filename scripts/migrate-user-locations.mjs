#!/usr/bin/env node
/**
 * migrate-user-locations.mjs — migrate saved user location selections to the new
 * tile = WHOLE-SECTION picker paradigm (2026-08 location overhaul).
 *
 * Selections live in `user_recipes.recipe.dream_seeds.places` as location NAMES.
 * The old picker let users choose a SUBSET of a category; the new picker's tile is a
 * whole SECTION (all-or-nothing). A carried-over partial selection would render a
 * tile as half-selected — a state the new UI no longer allows.
 *
 * Kevin's rule: if a user has ANY child place selected within a section, auto-select
 * the ENTIRE section for them. This rounds every touched section up to full, so no
 * tile is ever partial. Along the way it drops:
 *   • legacy FREEFORM orphans (no matching card, e.g. "a tropical beach at sunset")
 *   • cards pulled from the picker (picker_category = null, e.g. robot city)
 * because neither maps to a section.
 *
 * Sections mirror SECTION_META in components/onboarding/LocationPickerStep.tsx — keep
 * in sync if the picker grouping changes.
 *
 * TIMING: the round-up includes a section's DARK cards (so nothing is lost and the
 * tile is full). Running it BEFORE those cards go live would surface them in existing
 * users' nightly dreams early. Recommended: run (with --write) right AFTER flipping a
 * batch of categories live. Idempotent — safe to re-run.
 *
 * Usage:
 *   node scripts/migrate-user-locations.mjs           # DRY RUN (default)
 *   node scripts/migrate-user-locations.mjs --write   # apply
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

// Mirrors SECTION_META (LocationPickerStep.tsx): section id → picker_category list.
const SECTIONS = {
  around_the_world: ['iconic_cities', 'countries_cultures', 'landmarks_wonders', 'coastal_escapes'],
  tropical_escapes: ['tropical'],
  beach_towns: ['beach_towns'],
  nature: ['epic_nature'],
  through_time: ['through_time'],
  high_life: ['high_life'],
  fantasy: ['high_fantasy'],
  gothic: ['gothic_haunted'],
  whimsical: ['whimsical_fun'],
  scifi: ['scifi_space'],
  wild_west: ['wild_west'],
  heroes: ['heroes_adventure'],
};
const CAT_TO_SECTION = {};
for (const [sec, cats] of Object.entries(SECTIONS)) for (const c of cats) CAT_TO_SECTION[c] = sec;

const arrEq = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');

(async () => {
  // All cards with a picker_category (dark or live). name → category.
  const nameToCat = {};
  for (let from = 0; ; from += 1000) {
    const { data } = await sb.from('location_cards').select('name, picker_category').not('picker_category', 'is', null).range(from, from + 999);
    if (!data || !data.length) break;
    for (const c of data) nameToCat[c.name] = c.picker_category;
    if (data.length < 1000) break;
  }
  // section → all card names in it.
  const sectionCards = {};
  for (const [name, cat] of Object.entries(nameToCat)) {
    const sec = CAT_TO_SECTION[cat];
    if (sec) (sectionCards[sec] ||= []).push(name);
  }

  const { data: recipes } = await sb.from('user_recipes').select('user_id, recipe');
  let changed = 0, expanded = 0, droppedRefs = 0;

  for (const r of recipes || []) {
    const recipe = r.recipe;
    const places = recipe && recipe.dream_seeds && recipe.dream_seeds.places;
    if (!Array.isArray(places) || !places.length) continue;

    const touched = new Set();
    let dropped = 0;
    for (const p of places) {
      const sec = CAT_TO_SECTION[nameToCat[p]]; // undefined for orphans / picker_category=null
      if (sec) touched.add(sec);
      else dropped++;
    }
    const next = [...new Set([...touched].flatMap((s) => sectionCards[s] || []))];

    if (arrEq(next, places)) continue; // already full + no orphans
    changed++;
    expanded += Math.max(0, next.length - (places.length - dropped));
    droppedRefs += dropped;
    console.log(`  user ${r.user_id.slice(0, 8)}: ${places.length} → ${next.length} places | sections=[${[...touched].join(',')}]${dropped ? ` dropped ${dropped}` : ''}`);
    if (WRITE) {
      const updated = { ...recipe, dream_seeds: { ...recipe.dream_seeds, places: next } };
      const { error } = await sb.from('user_recipes').update({ recipe: updated }).eq('user_id', r.user_id);
      if (error) console.error(`    ✗ ${r.user_id}: ${error.message}`);
    }
  }

  console.log(`\n${WRITE ? 'APPLIED' : 'DRY RUN'} — users migrated: ${changed}, orphan/removed refs dropped: ${droppedRefs}`);
  if (!WRITE) console.log('(re-run with --write to apply — ideally right after go-live)');
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
