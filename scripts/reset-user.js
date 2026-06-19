#!/usr/bin/env node
/**
 * reset-user.js — remotely reset a user back to "new" so they re-onboard.
 *
 * Admin/support tool (service-role). Use when an account gets messed up and you
 * want a clean slate, or to re-test onboarding + the free first dream yourself.
 *
 * What it clears (mirrors the in-app "Reset Profile" PLUS the piece that one
 * misses — the first-dream claim, which otherwise traps a re-onboarding user in
 * the "We couldn't finish your first dream / Try again" loop):
 *   1. users.has_ai_recipe = false        → app routes them to /(onboarding)
 *   2. user_recipes (delete)              → wipes the vibe profile / recipe
 *   3. dream_queue source='first_dream'   → releases the one-free-first-dream
 *      (+ matching dream_jobs)               claim so they get a fresh one
 *   4. user_first_run (delete)            → first-run tutorials re-show
 *   5. cast photos (delete from storage)  → both the PRIVATE `cast-photos` bucket
 *      and any legacy `avatars` cast-* files, so the reset-and-re-onboard loop
 *      doesn't leak orphaned face photos (it used to — 100+ piled up from testing)
 *
 * Leaves alone: their existing dreams/likes/feed history, sparkles, Pro status.
 *
 * Usage:
 *   node scripts/reset-user.js <userId>                # reset by uuid
 *   node scripts/reset-user.js --username sunnysteph   # resolve by username
 *   node scripts/reset-user.js --email a@b.com         # resolve by email
 *   node scripts/reset-user.js <userId> --dry-run      # preview, change nothing
 *
 * Reads SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, KEY);

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return undefined;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DRY = arg('dry-run') === true;

// Cast face photos live in the user's own folder in the PRIVATE `cast-photos`
// bucket (new) and possibly the `avatars` bucket (legacy). List the user's
// folder in each and return every `cast-*` object path.
async function listCastPaths(userId) {
  const paths = [];
  for (const bucket of ['cast-photos', 'avatars']) {
    const { data: files } = await sb.storage.from(bucket).list(userId, { limit: 1000 });
    for (const f of files || []) {
      if (f.name.startsWith('cast-')) paths.push({ bucket, path: `${userId}/${f.name}` });
    }
  }
  return paths;
}

async function purgeCastPhotos(castPaths) {
  const byBucket = {};
  for (const { bucket, path } of castPaths) (byBucket[bucket] ||= []).push(path);
  let removed = 0;
  for (const [bucket, paths] of Object.entries(byBucket)) {
    const { error } = await sb.storage.from(bucket).remove(paths);
    if (error) console.warn(`  ⚠️  cast purge (${bucket}) failed: ${error.message}`);
    else removed += paths.length;
  }
  return removed;
}

async function resolveUserId() {
  const positional = process.argv.slice(2).find((a) => UUID_RE.test(a));
  if (positional) return positional;
  const username = arg('username');
  if (typeof username === 'string') {
    const { data } = await sb.from('users').select('id').ilike('username', username).single();
    return data && data.id;
  }
  const email = arg('email');
  if (typeof email === 'string') {
    const { data } = await sb.from('users').select('id').eq('email', email).single();
    return data && data.id;
  }
  return null;
}

(async () => {
  const userId = await resolveUserId();
  if (!userId) {
    console.error('No user resolved. Pass a <userId> uuid, or --username X, or --email X.');
    process.exit(2);
  }

  const { data: u } = await sb
    .from('users')
    .select('id, username, has_ai_recipe')
    .eq('id', userId)
    .single();
  if (!u) {
    console.error(`User ${userId} not found.`);
    process.exit(2);
  }

  // Count what's there so the operator sees the impact before/after.
  const countOf = async (table, filters) => {
    let q = sb.from(table).select('*', { count: 'exact', head: true });
    for (const [col, val] of Object.entries(filters)) q = q.eq(col, val);
    const { count } = await q;
    return count ?? 0;
  };
  const recipes = await countOf('user_recipes', { user_id: userId });
  const firstDreams = await countOf('dream_queue', { user_id: userId, source: 'first_dream' });
  const firstRun = await countOf('user_first_run', { user_id: userId });
  const castPaths = await listCastPaths(userId);

  console.log(
    `\n${DRY ? '🔎 DRY RUN — would reset' : '♻️  Resetting'} user @${u.username || '?'} (${userId})`
  );
  console.log(`   has_ai_recipe:        ${u.has_ai_recipe}  → false`);
  console.log(`   user_recipes:         ${recipes} row(s) → delete`);
  console.log(`   first_dream queue:    ${firstDreams} row(s) → delete (+ matching dream_jobs)`);
  console.log(`   user_first_run flags: ${firstRun} row(s) → delete`);
  console.log(`   cast photos:          ${castPaths.length} file(s) → delete from storage`);

  if (DRY) {
    console.log('\n(dry run — nothing changed)\n');
    return;
  }

  // 1. flip the onboarding gate
  await sb.from('users').update({ has_ai_recipe: false }).eq('id', userId);
  // 2. wipe the recipe / vibe profile
  await sb.from('user_recipes').delete().eq('user_id', userId);
  // 3. release the first-dream claim — delete the matching dream_jobs first, then
  //    the queue rows the guard checks
  const { data: fdRows } = await sb
    .from('dream_queue')
    .select('id')
    .eq('user_id', userId)
    .eq('source', 'first_dream');
  const fdIds = (fdRows || []).map((r) => r.id);
  if (fdIds.length) {
    await sb.from('dream_jobs').delete().in('id', fdIds);
    await sb.from('dream_queue').delete().in('id', fdIds);
  }
  // 4. clear first-run tutorial flags
  await sb.from('user_first_run').delete().eq('user_id', userId);
  // 5. purge cast photos from storage (both buckets) so the reset-and-re-onboard
  //    loop doesn't leak orphaned face photos
  const removed = castPaths.length ? await purgeCastPhotos(castPaths) : 0;

  console.log(
    `\n✅ Reset complete. @${u.username || userId} will re-onboard on next app open and can claim a fresh free first dream.`
  );
  console.log(`   (purged ${removed} cast photo file(s) from storage)\n`);
})().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
