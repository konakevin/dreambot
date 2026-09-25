#!/usr/bin/env node
/**
 * copy-profile-headers.js — make sure every profile header is the member's OWN
 * copy (migration 554a), not a link to the post it came from.
 *
 * The set-profile-header edge function always stores a copy. This script repairs
 * any header that still points at a source post's file (the 18 bot headers seeded
 * by migration 554 were links), by copying the file to
 * <user_id>/profile-header-<ts>.<ext> in the same bucket and updating header_url.
 * Idempotent: headers that are already copies are skipped.
 *
 *   node scripts/copy-profile-headers.js --dry-run
 *   node scripts/copy-profile-headers.js
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const DRY = process.argv.includes('--dry-run');
const STORAGE_MARK = '/storage/v1/object/public/';
const COPY_MARK = '/profile-header-';

function storageRef(url) {
  const i = url.indexOf(STORAGE_MARK);
  if (i < 0) return null;
  const rest = url.slice(i + STORAGE_MARK.length).split('?')[0];
  const slash = rest.indexOf('/');
  if (slash <= 0) return null;
  return { bucket: rest.slice(0, slash), path: decodeURIComponent(rest.slice(slash + 1)) };
}

(async () => {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: rows, error } = await sb
    .from('users')
    .select('id, username, header_url')
    .not('header_url', 'is', null);
  if (error) throw error;

  const todo = rows.filter((r) => !r.header_url.includes(COPY_MARK));
  console.log(
    `${rows.length} headers, ${todo.length} still linked to a post${DRY ? ' (dry run)' : ''}`
  );

  let copied = 0;
  for (const r of todo) {
    const src = storageRef(r.header_url);
    if (!src) {
      console.warn(`  skip ${r.username}: not a Storage URL`);
      continue;
    }
    const ext = (src.path.match(/\.(jpe?g|png|webp)$/i) || ['.jpg'])[0].toLowerCase();
    const dest = `${r.id}/profile-header-${Date.now()}${ext}`;
    if (DRY) {
      console.log(`  would copy ${r.username}: ${src.bucket}/${src.path} → ${dest}`);
      continue;
    }
    const { error: copyErr } = await sb.storage.from(src.bucket).copy(src.path, dest);
    if (copyErr) {
      console.error(`  FAIL ${r.username}: copy ${copyErr.message}`);
      process.exitCode = 1;
      continue;
    }
    const url = sb.storage.from(src.bucket).getPublicUrl(dest).data.publicUrl;
    const { error: upErr } = await sb.from('users').update({ header_url: url }).eq('id', r.id);
    if (upErr) {
      console.error(`  FAIL ${r.username}: save ${upErr.message}`);
      await sb.storage.from(src.bucket).remove([dest]);
      process.exitCode = 1;
      continue;
    }
    copied++;
    console.log(`  copied ${r.username}`);
  }
  if (!DRY) console.log(`done: ${copied} copied`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
