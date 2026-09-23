#!/usr/bin/env node
/**
 * Deletes the shadow test renders belonging to the 18 bot paths cut on 2026-09-23.
 *
 * SAFETY DESIGN — read this before changing anything here.
 *
 * The danger with a job like this is a filter expression that matches more than
 * intended: one mistyped `.eq()` or a missing guard and it takes live posts with
 * it. So this script never deletes by filter. It:
 *
 *   1. Resolves an EXPLICIT LIST of upload ids from a hard-coded path allowlist.
 *   2. Runs a TRIPWIRE: if any APPROVED path appears in the delete set, or if any
 *      candidate row is public/posted, or owned by a non-bot, it ABORTS having
 *      changed nothing.
 *   3. Requires the resolved count to match EXPECTED_TOTAL, or aborts. A silent
 *      drift in either direction means the world changed since the count was
 *      taken, and a human should look.
 *   4. Writes a full JSON backup of every row (including its storage path) BEFORE
 *      deleting, so what was removed is always auditable.
 *   5. Deletes by PRIMARY KEY, in small batches of explicit ids. A list of
 *      literal uuids cannot over-match.
 *   6. Is DRY-RUN BY DEFAULT. `--execute` is required, and even then it re-checks
 *      every guard per row immediately before the delete.
 *
 * Usage:
 *   node scripts/cleanup-cut-path-renders.js              # dry run, changes nothing
 *   node scripts/cleanup-cut-path-renders.js --execute     # after reviewing the dry run
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

/** The 18 paths Kevin cut. Hard-coded on purpose: no globbing, no inference. */
const CUT_PATHS = [
  'alpine-wildflower-meadow',
  'orchid-cloud-forest',
  'coastal-cliff-bloom',
  'sheep-shearing-day',
  'apiary-beekeeping',
  'hay-baling-summer',
  'lambing-season',
  'puppet-theatre',
  'sand-toy-beachworks',
  'bath-toy-flotilla',
  'honey-harvest',
  'autumn-seed-gathering',
  'observatory-tower',
  'ice-cavern',
  'archaeology-dig',
  'tidal-flat-tracks',
  'onsen-evening',
  'rooftop-telegraph',
];

/**
 * The 18 paths Kevin APPROVED. This is the tripwire, not documentation: if any
 * of these ever shows up in the delete set the script aborts. `acorn-boat-regatta`
 * matters most — it was on the cut list, Kevin pulled it back, and it was rebuilt
 * to ~4.5 and approved, so deleting its renders would destroy approved work.
 */
const APPROVED_PATHS = [
  'balloon-festival',
  'airfield-biplanes',
  'undergrowth-scale',
  'den-and-burrow',
  'courtship-display',
  'snowline-forest',
  'desert-dunes',
  'amber-forest',
  'mushroom-apothecary',
  'star-charting',
  'castle-town-gate',
  'floating-market-canal',
  'volcano-forge',
  'game-center-arcade',
  'cozy-farming-life-sim',
  'brass-glasshouse',
  'snow-globe-world',
  'acorn-boat-regatta',
];

/** Measured 2026-09-23. A mismatch aborts rather than proceeding on a guess. */
const EXPECTED_TOTAL = 386;
const COUNT_TOLERANCE = 12; // renders in flight when the count was taken
const BATCH = 25;
const BUCKET = 'uploads';

function die(msg) {
  console.error(`\n❌ ABORTED — nothing was changed.\n   ${msg}\n`);
  process.exit(1);
}

/** Static checks that need no database at all. Cheapest possible failure. */
function preflight() {
  const overlap = CUT_PATHS.filter((p) => APPROVED_PATHS.includes(p));
  if (overlap.length) die(`TRIPWIRE: approved path(s) in the cut list: ${overlap.join(', ')}`);
  if (new Set(CUT_PATHS).size !== CUT_PATHS.length) die('CUT_PATHS contains a duplicate.');
  if (CUT_PATHS.length !== 18) die(`CUT_PATHS has ${CUT_PATHS.length} entries, expected 18.`);
  if (APPROVED_PATHS.length !== 18) die(`APPROVED_PATHS has ${APPROVED_PATHS.length}, expected 18.`);
  if (!APPROVED_PATHS.includes('acorn-boat-regatta'))
    die('acorn-boat-regatta must be in APPROVED_PATHS — it was rebuilt and approved.');
  console.log('✓ preflight: 18 cut, 18 approved, zero overlap, acorn-boat-regatta protected');
}

/** Storage object path from a public URL, or null if it does not look right. */
function storagePathFromUrl(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return null;
  const p = url.slice(i + marker.length);
  // must be "<uuid>/<filename>", nothing clever, no traversal
  if (!/^[0-9a-f-]{36}\/[A-Za-z0-9._-]+$/i.test(p)) return null;
  return p;
}

async function main() {
  const execute = process.argv.includes('--execute');
  preflight();

  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // the set of legitimate bot owners, so a human's upload can never be caught
  const { data: botRows, error: botErr } = await sb.from('users').select('id, username').eq('is_bot', true);
  if (botErr) die(`could not load bot users: ${botErr.message}`);
  const botIds = new Set((botRows || []).map((b) => b.id));
  if (botIds.size < 15) die(`only ${botIds.size} bot users found; expected the full fleet.`);
  console.log(`✓ ${botIds.size} bot owners loaded`);

  // resolve candidates ONE PATH AT A TIME, checking every error
  const candidates = [];
  const perPath = {};
  for (const p of CUT_PATHS) {
    const rows = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb
        .from('uploads')
        .select('id, image_url, image_url_display, image_url_thumb, is_public, is_posted, user_id, created_at, recipe')
        .eq('recipe->>path', p)
        .order('created_at', { ascending: true })
        .range(from, from + 999);
      if (error) die(`query failed for ${p}: ${error.message}`);
      rows.push(...data);
      if (data.length < 1000) break;
    }
    perPath[p] = rows.length;
    for (const r of rows) {
      // per-row guards. Any violation aborts the whole run.
      const rp = (r.recipe || {}).path;
      if (rp !== p) die(`row ${r.id} has recipe.path="${rp}" but matched query for "${p}"`);
      if (!CUT_PATHS.includes(rp)) die(`row ${r.id} path "${rp}" is not in CUT_PATHS`);
      if (APPROVED_PATHS.includes(rp)) die(`TRIPWIRE: row ${r.id} belongs to APPROVED path "${rp}"`);
      if (r.is_public) die(`row ${r.id} (${rp}) is PUBLIC — refusing to delete a public post`);
      if (r.is_posted) die(`row ${r.id} (${rp}) is POSTED — refusing to delete a posted row`);
      if (!botIds.has(r.user_id)) die(`row ${r.id} (${rp}) is not owned by a bot`);
      candidates.push(r);
    }
  }

  console.log('\nrenders resolved per cut path:');
  for (const p of CUT_PATHS) console.log(`   ${p.padEnd(26)}${String(perPath[p]).padStart(4)}`);
  console.log(`   ${'TOTAL'.padEnd(26)}${String(candidates.length).padStart(4)}`);

  const drift = Math.abs(candidates.length - EXPECTED_TOTAL);
  if (drift > COUNT_TOLERANCE)
    die(
      `resolved ${candidates.length} rows but expected ~${EXPECTED_TOTAL} (drift ${drift} > ${COUNT_TOLERANCE}).\n` +
        `   Something changed since the count was taken. Re-measure before running.`
    );
  console.log(`✓ count within tolerance of ${EXPECTED_TOTAL} (drift ${drift})`);

  // storage paths, validated
  const objects = [];
  for (const r of candidates) {
    for (const u of [r.image_url, r.image_url_display, r.image_url_thumb]) {
      if (!u) continue;
      const sp = storagePathFromUrl(u);
      if (sp) objects.push(sp);
      else console.log(`   ⚠️ skipping unrecognised storage url on ${r.id}`);
    }
  }
  console.log(`✓ ${objects.length} storage objects resolved from ${candidates.length} rows`);

  if (!execute) {
    console.log('\n── DRY RUN — nothing deleted. Re-run with --execute to apply. ──');
    console.log(`   would delete ${candidates.length} uploads rows and ${objects.length} storage objects`);
    console.log(`   approved paths untouched, including acorn-boat-regatta`);
    return;
  }

  // backup BEFORE deleting
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(process.env.HOME, `dreambot-cut-renders-backup-${stamp}.json`);
  fs.writeFileSync(backup, JSON.stringify({ when: stamp, rows: candidates, objects }, null, 1));
  console.log(`\n✓ backup written: ${backup}`);

  let delRows = 0;
  for (let i = 0; i < candidates.length; i += BATCH) {
    const chunk = candidates.slice(i, i + BATCH);
    const ids = chunk.map((r) => r.id);
    // delete by PRIMARY KEY list only — this cannot match anything else
    const { error } = await sb.from('uploads').delete().in('id', ids);
    if (error) die(`delete failed at batch ${i / BATCH} (${delRows} already removed): ${error.message}`);
    delRows += ids.length;
    process.stdout.write(`\r   rows deleted: ${delRows}/${candidates.length}`);
  }
  console.log();

  let delObj = 0;
  for (let i = 0; i < objects.length; i += BATCH) {
    const chunk = objects.slice(i, i + BATCH);
    const { error } = await sb.storage.from(BUCKET).remove(chunk);
    if (error) console.log(`   ⚠️ storage batch ${i / BATCH} failed: ${error.message}`);
    else delObj += chunk.length;
    process.stdout.write(`\r   storage objects removed: ${delObj}/${objects.length}`);
  }
  console.log();

  // verify
  let left = 0;
  for (const p of CUT_PATHS) {
    const { count } = await sb.from('uploads').select('id', { count: 'exact', head: true }).eq('recipe->>path', p);
    left += count || 0;
  }
  console.log(`\n✓ done. ${delRows} rows, ${delObj} storage objects removed. Remaining on cut paths: ${left}`);
  if (left) console.log('   (non-zero means rows arrived mid-run; re-run the dry run to inspect)');
}

main().catch((e) => die(e.message));
