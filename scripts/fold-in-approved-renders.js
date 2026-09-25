#!/usr/bin/env node
/**
 * Folds the APPROVED shadow test renders into each bot's public history, so they
 * read as organic past posts rather than a dump at one timestamp.
 *
 * For each approved path it promotes only the FINAL GRADED BATCH — the renders
 * Kevin actually signed off — and leaves every earlier QA round as shadow. That
 * matters: the earlier batches contain known-bad work (acorn-boat-regatta's first
 * 24 renders are the naked-cherub frames that scored 3.07; snowline-forest's
 * first 8 are the warm-palette archetype bug), and publishing those would put
 * failed QA on public profiles.
 *
 * SAFETY DESIGN, same shape as the deletion script:
 *   - hard-coded approved allowlist, with the CUT list as a tripwire
 *   - only touches rows that are currently is_public=false AND is_posted=false,
 *     so an existing real post can never be rewritten
 *   - only bot-owned rows
 *   - resolves an explicit id list and updates BY PRIMARY KEY
 *   - writes a before-state backup, so this is fully reversible (unlike a delete)
 *   - DRY RUN BY DEFAULT; --execute required
 *
 * `posted_at` is what the profile grid sorts on (hooks/usePublicProfilePosts.ts,
 * useUserPosts.ts — both `.order('posted_at', {ascending:false})`), so scattering
 * that column is what actually interleaves them into the bot's history. created_at
 * is backdated to match (the promote-shadow-path.js convention) and `shadow` is
 * cleared — the 2026-09-23 run left both alone and the rows kept their admin badge.
 *
 * Usage:
 *   node scripts/fold-in-approved-renders.js            # dry run
 *   node scripts/fold-in-approved-renders.js --execute
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

/** Tripwire: these were deleted. None may appear here. */
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
 * acorn-boat-regatta is PINNED to round 4's exact six renders rather than inferred.
 * Round 5 was launched, produced two renders with a mangled garment clause, and was
 * killed — batch inference would sweep those two in as "the final batch". These are
 * the six from /tmp/regatta-r4.log, the batch Kevin approved ("this last batch is
 * vERY GOOD").
 */
const PINNED_BATCH = {
  'acorn-boat-regatta': [
    '1790194984278-faebot-k4o652.jpg',
    '1790195005069-faebot-qnuu0z.jpg',
    '1790195026162-faebot-o2jjgo.jpg',
    '1790195047213-faebot-yweu3p.jpg',
    '1790195070122-faebot-f2q045.jpg',
    '1790195088360-faebot-rl5zti.jpg',
  ],
};

/**
 * HELD BACK from the fold-in, with the reason. snow-globe-world is approved but
 * Kevin is moving it from ToyBot to TinyBot, and these renders were made BY ToyBot
 * (user_id = ToyBot), so folding them in would publish posts on the bot that is
 * about to lose the path. They stay shadow until the move is done and the look is
 * re-validated on TinyBot.
 */
const HOLD_PATHS = ['snow-globe-world'];

const GAP_MIN = 2;
const MIN_BATCH = 3;

function die(msg) {
  console.error(`\n❌ ABORTED — nothing was changed.\n   ${msg}\n`);
  process.exit(1);
}

function preflight() {
  const overlap = APPROVED_PATHS.filter((p) => CUT_PATHS.includes(p));
  if (overlap.length) die(`TRIPWIRE: cut path(s) in the approved list: ${overlap.join(', ')}`);
  if (APPROVED_PATHS.length !== 18)
    die(`APPROVED_PATHS has ${APPROVED_PATHS.length}, expected 18.`);
  if (new Set(APPROVED_PATHS).size !== 18) die('APPROVED_PATHS contains a duplicate.');
  console.log('✓ preflight: 18 approved, zero overlap with the 18 deleted paths');
}

/** Final batch with >= MIN_BATCH renders, so a trailing retry is not mistaken for a round. */
function finalBatch(rows) {
  const sorted = rows.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
  const batches = [];
  let cur = [],
    prev = null;
  for (const r of sorted) {
    const t = new Date(r.created_at).getTime();
    if (prev !== null && t - prev > GAP_MIN * 60000) {
      batches.push(cur);
      cur = [];
    }
    cur.push(r);
    prev = t;
  }
  if (cur.length) batches.push(cur);
  const substantial = batches.filter((b) => b.length >= MIN_BATCH);
  return substantial.length
    ? substantial[substantial.length - 1]
    : batches[batches.length - 1] || [];
}

async function main() {
  const execute = process.argv.includes('--execute');
  preflight();

  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: botRows, error: botErr } = await sb
    .from('users')
    .select('id, username')
    .eq('is_bot', true);
  if (botErr) die(`could not load bot users: ${botErr.message}`);
  const botName = new Map((botRows || []).map((b) => [b.id, b.username]));
  if (botName.size < 15) die(`only ${botName.size} bot users found.`);

  // each bot's existing public history span — the window to scatter into
  const span = new Map();
  for (const [id, name] of botName) {
    const { data: first } = await sb
      .from('uploads')
      .select('posted_at')
      .eq('user_id', id)
      .eq('is_public', true)
      .not('posted_at', 'is', null)
      .order('posted_at', { ascending: true })
      .limit(1);
    const { data: last } = await sb
      .from('uploads')
      .select('posted_at')
      .eq('user_id', id)
      .eq('is_public', true)
      .not('posted_at', 'is', null)
      .order('posted_at', { ascending: false })
      .limit(1);
    if (first && first.length && last && last.length)
      span.set(id, [new Date(first[0].posted_at).getTime(), new Date(last[0].posted_at).getTime()]);
    void name;
  }

  const plan = [];
  for (const p of APPROVED_PATHS) {
    if (HOLD_PATHS.includes(p)) {
      console.log(`   ⏸  ${p}: HELD (pending the move to TinyBot)`);
      continue;
    }
    const rows = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb
        .from('uploads')
        .select('id, image_url, created_at, is_public, is_posted, posted_at, user_id, recipe')
        .eq('recipe->>path', p)
        .order('created_at', { ascending: true })
        .range(from, from + 999);
      if (error) die(`query failed for ${p}: ${error.message}`);
      rows.push(...data);
      if (data.length < 1000) break;
    }
    if (!rows.length) {
      console.log(`   ⚠️ ${p}: no renders found, skipping`);
      continue;
    }

    let chosen;
    if (PINNED_BATCH[p]) {
      const want = new Set(PINNED_BATCH[p]);
      chosen = rows.filter((r) => want.has((r.image_url || '').split('/').pop()));
      if (chosen.length !== PINNED_BATCH[p].length)
        die(
          `${p}: pinned batch expects ${PINNED_BATCH[p].length} renders, matched ${chosen.length}`
        );
    } else {
      chosen = finalBatch(rows);
    }

    for (const r of chosen) {
      const rp = (r.recipe || {}).path;
      if (rp !== p) die(`row ${r.id} recipe.path="${rp}" but came from the "${p}" query`);
      if (CUT_PATHS.includes(rp)) die(`TRIPWIRE: row ${r.id} belongs to deleted path "${rp}"`);
      if (!APPROVED_PATHS.includes(rp)) die(`row ${r.id} path "${rp}" not approved`);
      if (!botName.has(r.user_id)) die(`row ${r.id} not owned by a bot`);
      if (r.is_public || r.is_posted) continue; // already live; never rewrite a real post
      const s = span.get(r.user_id);
      if (!s) {
        console.log(
          `   ⚠️ ${botName.get(r.user_id)} has no public history to scatter into; skipping ${r.id}`
        );
        continue;
      }
      const when = new Date(s[0] + Math.random() * (s[1] - s[0])).toISOString();
      plan.push({ id: r.id, path: p, bot: botName.get(r.user_id), when, wasPostedAt: r.posted_at });
    }
  }

  const byBot = {};
  for (const x of plan) (byBot[x.bot] = byBot[x.bot] || []).push(x);
  console.log('\nto fold in (final approved batch only):');
  for (const b of Object.keys(byBot).sort())
    console.log(`   ${b.padEnd(12)}${String(byBot[b].length).padStart(3)} renders`);
  console.log(`   ${'TOTAL'.padEnd(12)}${String(plan.length).padStart(3)}`);

  if (!execute) {
    console.log('\n── DRY RUN — nothing changed. Re-run with --execute to apply. ──');
    console.log('   each will get is_posted=true, is_public=true, and a posted_at');
    console.log("   scattered inside that bot's own existing public history");
    for (const x of plan.slice(0, 4))
      console.log(`     e.g. ${x.bot}/${x.path} → ${x.when.slice(0, 10)}`);
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(process.env.HOME, `dreambot-foldin-backup-${stamp}.json`);
  fs.writeFileSync(backup, JSON.stringify({ when: stamp, plan }, null, 1));
  console.log(`\n✓ before-state backup written: ${backup}`);

  let n = 0;
  for (const x of plan) {
    // shadow=false + created_at=posted_at were MISSING from the 2026-09-23 run: the rows went
    // public but kept their SHADOW badge in the app (fixed after the fact by
    // scripts/reconcile-shadow-renders.js). Any future run must clear both.
    const { error } = await sb
      .from('uploads')
      .update({
        is_posted: true,
        is_public: true,
        shadow: false,
        posted_at: x.when,
        created_at: x.when,
      })
      .eq('id', x.id) // primary key only
      .eq('is_public', false) // and re-assert the guard at write time
      .eq('is_posted', false);
    if (error) die(`update failed on ${x.id} (${n} already folded in): ${error.message}`);
    n++;
    process.stdout.write(`\r   folded in: ${n}/${plan.length}`);
  }
  console.log(`\n\n✓ done. ${n} renders folded into ${Object.keys(byBot).length} bots' histories.`);
}

main().catch((e) => die(e.message));
