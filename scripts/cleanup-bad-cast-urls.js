#!/usr/bin/env node
/**
 * cleanup-bad-cast-urls — purge dream_cast members with non-http thumb_urls.
 *
 * Background: a bug in DreamCastStep.tsx (catch block at line 305) silently
 * persisted local file:// / content:// / ph:// URIs as thumb_url when ANY
 * downstream call (describe-photo, etc.) failed after a successful storage
 * upload. The Edge Functions silently skip cast members with non-http
 * URLs, so affected users get demoted personas (e.g., a duo profile
 * renders as solo or no_cast) without ever seeing an error.
 *
 * This script:
 *   1. Audits all user_recipes for non-http cast thumb_urls
 *   2. Removes those cast members entirely (cleaner than half-broken state
 *      — the user will see no plus_one in their profile and can re-upload)
 *   3. Logs each change for audit
 *
 * Usage:
 *   node scripts/cleanup-bad-cast-urls.js --dry-run    # see what would change
 *   node scripts/cleanup-bad-cast-urls.js              # apply changes
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Page through a full-set read — PostgREST silently caps an un-ranged select at
// 1000 rows, which would leave users 1001+ with corrupt cast records silently
// ignored (Architect audit A4, 2026-07-10). Mirrors scripts/nightly-dreams.js.
async function fetchAllPages(buildQuery, pageSize = 1000) {
  const all = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await buildQuery().range(from, from + pageSize - 1);
    if (error) return { data: null, error };
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
  }
  return { data: all, error: null };
}

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const dryRun = process.argv.includes('--dry-run');

function isFetchable(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return lower.startsWith('http://') || lower.startsWith('https://');
}

(async () => {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: rows, error } = await fetchAllPages(() =>
    sb.from('user_recipes').select('user_id, recipe')
  );
  if (error) {
    console.error('Failed to fetch recipes:', error.message);
    process.exit(1);
  }

  let usersAffected = 0;
  let castRemoved = 0;
  const summary = [];

  for (const row of rows || []) {
    const cast = row.recipe?.dream_cast || [];
    if (cast.length === 0) continue;

    const goodCast = cast.filter((c) => isFetchable(c.thumb_url));
    if (goodCast.length === cast.length) continue; // nothing to clean

    usersAffected++;
    const removed = cast.filter((c) => !isFetchable(c.thumb_url));
    castRemoved += removed.length;

    summary.push({
      user_id: row.user_id,
      removed: removed.map((c) => ({ role: c.role, url: (c.thumb_url || '').slice(0, 60) })),
      kept: goodCast.map((c) => c.role),
    });

    if (!dryRun) {
      const newRecipe = { ...row.recipe, dream_cast: goodCast };
      const { error: updErr } = await sb
        .from('user_recipes')
        .update({ recipe: newRecipe })
        .eq('user_id', row.user_id);
      if (updErr) {
        console.error(`✗ Failed to update ${row.user_id.slice(0, 8)}: ${updErr.message}`);
      }
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(dryRun ? 'DRY RUN — no changes applied' : 'CHANGES APPLIED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Users affected:  ${usersAffected}`);
  console.log(`Cast removed:    ${castRemoved}`);
  console.log();
  for (const s of summary) {
    console.log(`User ${s.user_id.slice(0, 8)}:`);
    for (const r of s.removed) console.log(`  ✗ ${r.role}: ${r.url}`);
    if (s.kept.length > 0) console.log(`  ✓ kept: ${s.kept.join(', ')}`);
    console.log();
  }
})();
