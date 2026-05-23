#!/usr/bin/env node
/**
 * sweep-orphan-storage.js — one-shot cleanup for storage files that are
 * no longer referenced by any DB row.
 *
 * Why: until the 2026-05-22 storage-leak fixes (migration 179 + useDeletePost
 * HQ cleanup + DreamCastStep replacement cleanup + settings/index.tsx avatar
 * deletion cleanup), several delete paths leaked files in the `uploads`
 * and `avatars` buckets:
 *   - account deletion left every upload + avatar + cast photo orphaned
 *   - Pro user post deletion left the HQ JPEG orphaned
 *   - dream_cast photo replacement orphaned the prior photo
 *   - "Delete Photo" left the avatar JPEG orphaned
 *
 * This script lists every file in both buckets, builds the set of paths
 * still referenced anywhere in the DB, and reports (or deletes) the diff.
 *
 * Usage:
 *   node scripts/sweep-orphan-storage.js                # dry-run, report only
 *   node scripts/sweep-orphan-storage.js --delete       # actually delete
 *   node scripts/sweep-orphan-storage.js --bucket=uploads --delete
 *   node scripts/sweep-orphan-storage.js --sample=20    # show 20 sample orphans
 *
 * Safety:
 *   - DEFAULT IS DRY-RUN. Must pass --delete to actually remove anything.
 *   - Treats anything younger than 24h as "in-flight" and skips it.
 *     Protects mid-render face-swap temp uploads from getting nuked while
 *     their owning render is still being persisted.
 *   - Batches storage.remove() at 100 paths to stay under API limits.
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach((l) => {
  const i = l.indexOf('=');
  if (i > 0) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
});

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  env.SUPABASE_SERVICE_ROLE_KEY,
);

const args = process.argv.slice(2);
const DELETE = args.includes('--delete');
const SAMPLE_N = parseInt((args.find((a) => a.startsWith('--sample=')) || '--sample=10').slice(9), 10);
const BUCKET_FILTER = (args.find((a) => a.startsWith('--bucket=')) || '').slice(9) || null;
const MIN_AGE_MS = 24 * 60 * 60 * 1000; // skip files younger than 24h

const BUCKETS = ['uploads', 'avatars'].filter((b) => !BUCKET_FILTER || b === BUCKET_FILTER);

// ─────────────────────────────────────────────────────────────────────────
// 1. List every file in a bucket. Buckets are organized as <userId>/<file>.
//    We list top-level "folders" (user_id dirs) then files within each.
async function listAllFiles(bucket) {
  const all = []; // Array<{ path: string, created_at: string }>
  // List root — returns folders only (one per user_id)
  let offset = 0;
  const PAGE = 1000;
  const folders = [];
  for (;;) {
    const { data, error } = await sb.storage.from(bucket).list('', {
      limit: PAGE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(`list root ${bucket}: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const item of data) folders.push(item.name);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  console.log(`  [${bucket}] root entries: ${folders.length}`);
  // For each folder, list files within
  let folderIdx = 0;
  for (const folder of folders) {
    folderIdx++;
    if (folderIdx % 100 === 0) process.stdout.write(`\r  [${bucket}] scanning folder ${folderIdx}/${folders.length}`);
    let inner = 0;
    for (;;) {
      const { data, error } = await sb.storage.from(bucket).list(folder, {
        limit: PAGE,
        offset: inner,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (error) {
        console.error(`\n  [${bucket}] list ${folder}: ${error.message}`);
        break;
      }
      if (!data || data.length === 0) break;
      for (const item of data) {
        if (!item.name) continue;
        all.push({ path: `${folder}/${item.name}`, created_at: item.created_at });
        inner++;
      }
      if (data.length < PAGE) break;
    }
  }
  process.stdout.write(`\r  [${bucket}] scanned ${folders.length} folders → ${all.length} files\n`);
  return all;
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Build the set of paths referenced anywhere in the DB.
//    uploads bucket: uploads.image_url + uploads.image_url_hq
//    avatars bucket: users.avatar_url + user_recipes.recipe -> dream_cast[].thumb_url
function pathFromUrl(url, bucket) {
  if (!url) return null;
  const m = url.match(new RegExp(`/${bucket}/(.+?)(\\?|$)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function loadReferencedPaths() {
  const uploads = new Set();
  const avatars = new Set();

  // uploads.image_url + image_url_hq — paginate through all rows
  console.log('  loading uploads.image_url references...');
  let from = 0;
  const STEP = 1000;
  for (;;) {
    const { data, error } = await sb
      .from('uploads')
      .select('image_url, image_url_hq')
      .range(from, from + STEP - 1);
    if (error) throw new Error(`uploads query: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const r of data) {
      const p1 = pathFromUrl(r.image_url, 'uploads');
      if (p1) uploads.add(p1);
      const p2 = pathFromUrl(r.image_url_hq, 'uploads');
      if (p2) uploads.add(p2);
    }
    if (data.length < STEP) break;
    from += STEP;
  }
  console.log(`    referenced upload paths: ${uploads.size}`);

  // users.avatar_url
  console.log('  loading users.avatar_url references...');
  from = 0;
  for (;;) {
    const { data, error } = await sb.from('users').select('avatar_url').range(from, from + STEP - 1);
    if (error) throw new Error(`users query: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const r of data) {
      const p = pathFromUrl(r.avatar_url, 'avatars');
      if (p) avatars.add(p);
    }
    if (data.length < STEP) break;
    from += STEP;
  }

  // user_recipes.recipe -> dream_cast[].thumb_url
  console.log('  loading user_recipes.dream_cast thumb_url references...');
  from = 0;
  for (;;) {
    const { data, error } = await sb.from('user_recipes').select('recipe').range(from, from + STEP - 1);
    if (error) throw new Error(`user_recipes query: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const r of data) {
      const cast = r.recipe?.dream_cast;
      if (!Array.isArray(cast)) continue;
      for (const m of cast) {
        const p = pathFromUrl(m?.thumb_url, 'avatars');
        if (p) avatars.add(p);
      }
    }
    if (data.length < STEP) break;
    from += STEP;
  }
  console.log(`    referenced avatar paths: ${avatars.size}`);

  return { uploads, avatars };
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Main.
(async () => {
  console.log(`Mode: ${DELETE ? 'DELETE' : 'DRY-RUN (pass --delete to actually remove)'}`);
  console.log(`Buckets: ${BUCKETS.join(', ')}`);
  console.log(`Min-age guard: ${MIN_AGE_MS / 3600000}h (younger files skipped as in-flight)\n`);

  console.log('Loading DB references...');
  const referenced = await loadReferencedPaths();

  console.log('\nListing storage buckets...');
  const cutoff = Date.now() - MIN_AGE_MS;
  let totalOrphans = 0;
  let totalDeleted = 0;
  let totalErrors = 0;

  for (const bucket of BUCKETS) {
    const files = await listAllFiles(bucket);
    const refSet = referenced[bucket];
    const orphans = files.filter((f) => {
      if (refSet.has(f.path)) return false;
      if (f.created_at && new Date(f.created_at).getTime() > cutoff) return false;
      return true;
    });
    const totalBytes = '?'; // we'd need .info() per file for size — skip for now
    console.log(`\n[${bucket}] orphans: ${orphans.length} / ${files.length} files`);
    if (orphans.length === 0) continue;

    console.log(`  sample (${Math.min(SAMPLE_N, orphans.length)} of ${orphans.length}):`);
    for (const o of orphans.slice(0, SAMPLE_N)) {
      console.log(`    ${o.path}  (created ${o.created_at || '?'})`);
    }

    totalOrphans += orphans.length;

    if (DELETE) {
      console.log(`  deleting ${orphans.length}...`);
      for (let i = 0; i < orphans.length; i += 100) {
        const batch = orphans.slice(i, i + 100).map((o) => o.path);
        const { data, error } = await sb.storage.from(bucket).remove(batch);
        if (error) {
          console.error(`    batch ${i}: ERR ${error.message}`);
          totalErrors += batch.length;
        } else {
          totalDeleted += (data || []).length;
        }
      }
      console.log(`  [${bucket}] deleted ${totalDeleted}, errors ${totalErrors}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Total orphans found: ${totalOrphans}`);
  if (DELETE) {
    console.log(`Total deleted:       ${totalDeleted}`);
    console.log(`Total errors:        ${totalErrors}`);
  } else {
    console.log(`(dry-run — pass --delete to actually nuke them)`);
  }
})().catch((e) => {
  console.error('CRASH:', e.stack || e.message);
  process.exit(1);
});