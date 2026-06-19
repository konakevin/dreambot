#!/usr/bin/env node
/**
 * cutover-cast-photos.js — FINAL step of the cast-photos privacy migration.
 *
 * Run AFTER migrate-cast-photos.js (which copied live files into the private
 * cast-photos bucket + set storage_path while keeping the public thumb_url).
 *
 * Two steps:
 *   1. Clear the legacy public `thumb_url` on every recipe member that now has a
 *      storage_path → renders switch to the PRIVATE signed-URL path. (Recompute
 *      after, so step 2 knows what's still referenced.)
 *   2. Delete every `cast-*` file in the PUBLIC `avatars` bucket that NO recipe
 *      references — the now-orphaned migrated originals + all the old test junk.
 *      SCOPED to `cast-*` only: profile + bot `avatar.jpg` are never touched.
 *
 * Usage:
 *   node scripts/cutover-cast-photos.js              # DRY-RUN (default)
 *   node scripts/cutover-cast-photos.js --execute    # apply
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const EXECUTE = process.argv.includes('--execute');
const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function avatarsPath(url) {
  if (typeof url !== 'string') return null;
  const m = url.match(/\/avatars\/(.+?)(\?|$)/);
  return m && m[1] ? decodeURIComponent(m[1]) : null;
}

(async () => {
  console.log(EXECUTE ? '=== EXECUTE ===\n' : '=== DRY-RUN (pass --execute) ===\n');

  // ── Step 1: clear legacy thumb_url where storage_path exists ──────────────
  const { data: recipes, error } = await sb.from('user_recipes').select('user_id, recipe');
  if (error) { console.error(error); process.exit(1); }

  let cleared = 0;
  for (const r of recipes || []) {
    const recipe = r.recipe;
    const cast = (recipe && recipe.dream_cast) || [];
    let dirty = false;
    for (const m of cast) {
      if (m.storage_path && m.thumb_url) {
        console.log(`  step1 clear thumb_url: ${r.user_id.slice(0, 8)}… ${m.role}`);
        if (EXECUTE) {
          delete m.thumb_url;
          dirty = true;
        }
        cleared++;
      }
    }
    if (EXECUTE && dirty) {
      const { error: upErr } = await sb
        .from('user_recipes')
        .update({ recipe })
        .eq('user_id', r.user_id);
      if (upErr) console.log(`  ⚠️  recipe update failed ${r.user_id.slice(0, 8)}…: ${upErr.message}`);
    }
  }
  console.log(`\nstep 1: ${EXECUTE ? 'cleared' : 'would clear'} ${cleared} legacy thumb_url(s)\n`);

  // ── Recompute referenced avatars cast paths (should be ~0 after step 1) ───
  const { data: recipes2 } = await sb.from('user_recipes').select('recipe');
  const referenced = new Set();
  for (const r of recipes2 || []) {
    for (const m of (r.recipe && r.recipe.dream_cast) || []) {
      const p = avatarsPath(m.thumb_url);
      if (p) referenced.add(p);
    }
  }
  console.log(`avatars cast paths STILL referenced by a recipe: ${referenced.size}`);

  // ── Step 2: delete unreferenced cast-* from the public avatars bucket ─────
  const { data: roots } = await sb.storage.from('avatars').list('', { limit: 2000 });
  const folders = (roots || []).filter((x) => x.id === null);
  const toDelete = [];
  for (const f of folders) {
    const { data: files } = await sb.storage.from('avatars').list(f.name, { limit: 2000 });
    for (const x of files || []) {
      if (!x.name.startsWith('cast-')) continue; // SCOPE: cast-* only
      const path = `${f.name}/${x.name}`;
      if (referenced.has(path)) continue; // protect anything still referenced
      toDelete.push(path);
    }
  }
  console.log(`step 2: ${EXECUTE ? 'deleting' : 'would delete'} ${toDelete.length} unreferenced cast-* file(s) from avatars`);
  toDelete.slice(0, 5).forEach((p) => console.log(`   e.g. ${p}`));
  if (toDelete.length > 5) console.log(`   …and ${toDelete.length - 5} more`);

  if (EXECUTE && toDelete.length) {
    for (let i = 0; i < toDelete.length; i += 100) {
      const batch = toDelete.slice(i, i + 100);
      const { error: rmErr } = await sb.storage.from('avatars').remove(batch);
      if (rmErr) console.log(`  ⚠️  delete batch failed: ${rmErr.message}`);
    }
    console.log('   ✅ deleted.');
  }

  console.log(`\n${EXECUTE ? '✅ cutover complete' : '(dry-run — nothing changed)'}`);
})();
