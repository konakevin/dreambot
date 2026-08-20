#!/usr/bin/env node
/**
 * promote-shadow-path.js — the "historical blend" promotion of dark-launched
 * (shadow) bot renders.
 *
 * A shadow render posts HIDDEN (shadow=true, is_public=false, is_posted=false)
 * so a new bot path can be QA'd in isolation without spamming the public feed
 * (see BOT_DARK_LAUNCH_PLAN.md + migration 376). Once Kevin has graded the
 * contact sheet and approved the keepers, this script threads them into the
 * bot's PAST feed at a natural cadence — so a freshly-launched path doesn't all
 * surface at once "at the beginning," but reads as though it was always there.
 *
 * It flips shadow=false / is_public=true / is_posted=true and BACKDATES both
 * created_at AND posted_at (the feed's time anchor is posted_at with a
 * created_at fallback, and get_feed requires posted_at IS NOT NULL — migration
 * 390). Timestamps are spread across a window and nudged off any real existing
 * post so the blend is believable.
 *
 * ANTI-GAMING (hard rule): this NEVER fabricates engagement. It touches only the
 * 5 visibility/time columns. No likes, hearts, views, or impressions are seeded
 * on a backdated post — a historical post with zero engagement is honest; a
 * historical post with faked hearts is feed-gaming.
 *
 * Usage:
 *   node scripts/promote-shadow-path.js --bot faebot --path goblin-market --dry-run
 *   node scripts/promote-shadow-path.js --bot faebot --path goblin-market --weeks 8
 *   node scripts/promote-shadow-path.js --bot faebot --ids <id1>,<id2>,<id3>
 *
 * Options:
 *   --bot <name>      (required) bot username.
 *   --path <path>     restrict to shadow renders whose recipe.path == <path>.
 *   --ids <a,b,c>     restrict to these exact upload IDs (Kevin's approved keepers
 *                     from the graded sheet). Combine with --bot for safety.
 *   --weeks <N>       spread across the last N weeks (default 8).
 *   --end-days <D>    leave the most-recent D days clear so the blend doesn't
 *                     bunch up against "now" (default 2).
 *   --gap-min <M>     min minutes between a promoted post and any other post,
 *                     real or promoted (default 90).
 *   --dry-run         print the planned schedule, write nothing.
 *
 * Exit 0 on success.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// ── args ────────────────────────────────────────────────────────────────
function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return fallback;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const BOT = arg('bot');
const PATH = arg('path', null);
const IDS = arg('ids', null);
const WEEKS = parseInt(arg('weeks', '8'), 10);
const END_DAYS = parseFloat(arg('end-days', '2'));
const GAP_MIN = parseInt(arg('gap-min', '90'), 10);
const DRY = arg('dry-run', false) === true;

if (!BOT || typeof BOT !== 'string') {
  console.error(
    'Usage: node scripts/promote-shadow-path.js --bot <name> [--path P | --ids a,b,c] [--weeks 8] [--dry-run]'
  );
  process.exit(2);
}
if (!PATH && !IDS) {
  console.error(
    'Refusing to promote: pass --path <path> or --ids <a,b,c> to scope which shadow renders to promote.'
  );
  process.exit(2);
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

const MS_MIN = 60 * 1000;
const MS_DAY = 24 * 60 * MS_MIN;

async function lookupBotUserId(username) {
  const { data, error } = await sb
    .from('users')
    .select('id,username')
    .ilike('username', username)
    .maybeSingle();
  if (error) throw new Error(`users lookup failed: ${error.message}`);
  if (!data) throw new Error(`Bot account not found: ${username}`);
  return data.id;
}

// Fetch the shadow renders to promote (paginated, PostgREST 1000-row cap).
async function fetchShadowRenders(userId) {
  const PAGE = 1000;
  const out = [];
  for (let from = 0; ; from += PAGE) {
    let q = sb
      .from('uploads')
      .select('id, created_at, recipe, dream_medium, caption')
      .eq('user_id', userId)
      .eq('shadow', true)
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (PATH) q = q.filter('recipe->>path', 'eq', PATH);
    const { data, error } = await q;
    if (error) throw new Error(`shadow fetch failed: ${error.message}`);
    out.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  if (IDS) {
    const want = new Set(
      IDS.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    return out.filter((r) => want.has(r.id));
  }
  return out;
}

// Existing REAL (visible) posts in the window, so we can interleave without
// landing a promoted post on top of one.
async function fetchExistingTimes(userId, windowStartMs) {
  const PAGE = 1000;
  const times = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from('uploads')
      .select('posted_at')
      .eq('user_id', userId)
      .eq('is_posted', true)
      .not('posted_at', 'is', null)
      .gte('posted_at', new Date(windowStartMs).toISOString())
      .order('posted_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`existing-times fetch failed: ${error.message}`);
    for (const r of data || []) times.push(new Date(r.posted_at).getTime());
    if (!data || data.length < PAGE) break;
  }
  return times.sort((a, b) => a - b);
}

// Build a believable backdated schedule: evenly spaced across the window with
// jitter, each slot nudged forward until it clears GAP_MIN from every other
// post (real + already-placed). Daytime-biased hours so it reads natural.
function buildSchedule(count, windowStartMs, windowEndMs, existing) {
  const gapMs = GAP_MIN * MS_MIN;
  const placed = [...existing];
  const clashes = (t) => placed.some((p) => Math.abs(p - t) < gapMs);

  const span = windowEndMs - windowStartMs;
  const step = span / (count + 1);
  const schedule = [];

  // Deterministic-ish jitter without needing a seed lib; Math.random is fine in
  // a one-shot node script (not a Workflow sandbox).
  for (let i = 1; i <= count; i++) {
    let base = windowStartMs + step * i;
    // jitter ±35% of a step
    base += (Math.random() - 0.5) * step * 0.7;
    // bias the time-of-day toward 13:00–23:00 UTC (daytime across US/EU)
    const d = new Date(base);
    d.setUTCHours(13 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
    let t = d.getTime();
    // clamp back inside the window
    if (t < windowStartMs) t = windowStartMs + gapMs;
    if (t > windowEndMs) t = windowEndMs - gapMs;
    // nudge off collisions (forward, then backward if we run into the edge)
    let guard = 0;
    while (clashes(t) && guard++ < 500) t += gapMs;
    guard = 0;
    while (clashes(t) && guard++ < 500) t -= gapMs;
    placed.push(t);
    schedule.push(t);
  }
  return schedule.sort((a, b) => a - b);
}

(async () => {
  console.log(
    `\n▸ promote-shadow-path  bot=${BOT}${PATH ? `  path=${PATH}` : ''}${IDS ? `  ids=${IDS}` : ''}`
  );
  console.log(
    `  window=${WEEKS}w  end-buffer=${END_DAYS}d  gap=${GAP_MIN}min  ${DRY ? 'DRY-RUN' : 'LIVE'}`
  );

  const userId = await lookupBotUserId(BOT);
  const renders = await fetchShadowRenders(userId);
  if (renders.length === 0) {
    console.log('\nNo matching shadow renders found — nothing to promote.');
    process.exit(0);
  }
  console.log(`\nFound ${renders.length} shadow render(s) to promote.`);

  const now = Date.now();
  const windowEndMs = now - END_DAYS * MS_DAY;
  const windowStartMs = now - WEEKS * 7 * MS_DAY;
  const existing = await fetchExistingTimes(userId, windowStartMs);
  console.log(`  ${existing.length} existing real post(s) in the window to interleave around.`);

  const schedule = buildSchedule(renders.length, windowStartMs, windowEndMs, existing);

  console.log('\nPlanned schedule (oldest → newest):');
  const plan = renders.map((r, i) => ({
    id: r.id,
    medium: r.dream_medium,
    when: new Date(schedule[i]).toISOString(),
  }));
  for (const p of plan) console.log(`  ${p.when}   ${p.id}   ${p.medium || ''}`);

  if (DRY) {
    console.log('\nDRY-RUN — no rows written. Re-run without --dry-run to apply.');
    process.exit(0);
  }

  console.log('\nApplying…');
  let ok = 0;
  for (const p of plan) {
    const iso = p.when;
    const { error } = await sb
      .from('uploads')
      .update({
        shadow: false,
        is_public: true,
        is_posted: true,
        created_at: iso,
        posted_at: iso,
      })
      .eq('id', p.id)
      .eq('user_id', userId)
      .eq('shadow', true); // guard: only ever promote a still-shadowed row
    if (error) {
      console.error(`  ✗ ${p.id}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${p.id} → ${iso}`);
    }
  }
  console.log(
    `\nPromoted ${ok}/${plan.length} render(s) into ${BOT}'s history. No engagement fabricated.`
  );
  process.exit(ok === plan.length ? 0 : 1);
})().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
