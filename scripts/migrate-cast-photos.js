#!/usr/bin/env node
/**
 * migrate-cast-photos.js — move existing cast face photos from the PUBLIC
 * `avatars` bucket into the PRIVATE `cast-photos` bucket (migration 292).
 *
 * COPY, DON'T DELETE: each file is copied to cast-photos and the recipe member
 * gets a `storage_path`, but its legacy public `thumb_url` is KEPT and the public
 * original is LEFT IN PLACE. Renders are therefore unchanged after this step
 * (hydration prefers an http thumb_url, so these users keep rendering via the
 * public URL) — zero risk. The final cutover (a separate step) clears thumb_url
 * (→ render via signed URL) and deletes the public originals.
 *
 * Usage:
 *   node scripts/migrate-cast-photos.js              # DRY-RUN (default) — report only
 *   node scripts/migrate-cast-photos.js --execute    # actually copy + update recipes
 *
 * Idempotent: members that already have a storage_path are skipped.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const EXECUTE = process.argv.includes('--execute');
const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Pull the `<userId>/cast-*.jpg` object path out of a public avatars URL.
function avatarsPath(url) {
  if (typeof url !== 'string') return null;
  const m = url.match(/\/avatars\/(.+?)(\?|$)/);
  return m && m[1] ? decodeURIComponent(m[1]) : null;
}

async function copyFile(path) {
  // Download from avatars, upload to cast-photos at the SAME path (keeps the
  // owner-folder = userId so the bucket's owner-RLS stays valid).
  const { data: blob, error: dlErr } = await sb.storage.from('avatars').download(path);
  if (dlErr || !blob) throw new Error(`download failed: ${dlErr ? dlErr.message : 'no blob'}`);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const { error: upErr } = await sb.storage
    .from('cast-photos')
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: true, cacheControl: '2592000' });
  if (upErr) throw new Error(`upload failed: ${upErr.message}`);
  return bytes.length;
}

async function verify(path) {
  const { data, error } = await sb.storage.from('cast-photos').createSignedUrl(path, 60);
  if (error || !data?.signedUrl) return `unsignable: ${error?.message || 'no url'}`;
  const res = await fetch(data.signedUrl);
  return res.ok ? 'OK' : `fetch ${res.status}`;
}

(async () => {
  console.log(EXECUTE ? '=== EXECUTE ===' : '=== DRY-RUN (pass --execute to apply) ===\n');
  const { data: recipes, error } = await sb.from('user_recipes').select('user_id, recipe');
  if (error) { console.error(error); process.exit(1); }

  let migrated = 0;
  let skipped = 0;
  for (const r of recipes || []) {
    const recipe = r.recipe;
    const cast = (recipe && recipe.dream_cast) || [];
    let dirty = false;
    for (const m of cast) {
      if (m.storage_path) { skipped++; continue; } // already private
      const path = avatarsPath(m.thumb_url);
      if (!path) continue; // no legacy public file
      const tag = `${r.user_id.slice(0, 8)}… ${m.role}  ${path.split('/').pop()}`;
      if (!EXECUTE) {
        console.log(`  would migrate: ${tag}`);
        migrated++;
        continue;
      }
      try {
        const size = await copyFile(path);
        m.storage_path = path; // keep m.thumb_url as the rollback fallback
        dirty = true;
        const v = await verify(path);
        console.log(`  ✅ ${tag}  (${(size / 1024).toFixed(0)}KB)  verify=${v}`);
        migrated++;
      } catch (e) {
        console.log(`  ❌ ${tag}  ${e.message}`);
      }
    }
    if (EXECUTE && dirty) {
      const { error: upErr } = await sb
        .from('user_recipes')
        .update({ recipe })
        .eq('user_id', r.user_id);
      if (upErr) console.log(`  ⚠️  recipe update failed for ${r.user_id.slice(0, 8)}…: ${upErr.message}`);
    }
  }
  console.log(`\n${EXECUTE ? 'migrated' : 'would migrate'}: ${migrated} | already-private skipped: ${skipped}`);
  if (!EXECUTE) console.log('Public originals are LEFT IN PLACE (rollback net) — nothing deleted.');
})();
