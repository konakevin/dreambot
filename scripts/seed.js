#!/usr/bin/env node
'use strict';

/**
 * Seed script — creates 10 test users with 2 posts each and
 * votes designed to hit every rating tier.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed.js
 *
 * EXPO_PUBLIC_SUPABASE_URL is read from .env.local automatically.
 * The service role key is in your Supabase dashboard → Settings → API.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ── Load .env.local ───────────────────────────────────────────────────────────
const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing env vars.');
  console.error('    EXPO_PUBLIC_SUPABASE_URL  — read from .env.local');
  console.error('    SUPABASE_SERVICE_ROLE_KEY — pass on the command line');
  console.error('\n    Example:');
  console.error('    SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed.js\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Test users ────────────────────────────────────────────────────────────────

const PASSWORD = 'Testpass123!';

const USERS = Array.from({ length: 10 }, (_, i) => ({
  email:    `testuser${i + 1}@radorbad.dev`,
  password: PASSWORD,
  username: `testuser${i + 1}`,
}));

// ── Posts ─────────────────────────────────────────────────────────────────────
// picsum.photos gives a consistent image per seed string.
// rad/bad vote counts are set via direct UPDATE so we can simulate any volume.
// Scores are intentionally spread across the full range for realistic testing.
const img = (seed) => `https://picsum.photos/seed/${seed}/800/1000`;

const POSTS = [
  // People — 94%, 78%, 61%, 33%
  { userIdx: 0, category: 'people',  image: img('portrait1'),  caption: 'Golden hour portrait',   rad: 47, bad:  3 },
  { userIdx: 2, category: 'people',  image: img('portrait2'),  caption: 'Street candid',          rad: 39, bad: 11 },
  { userIdx: 5, category: 'people',  image: img('portrait3'),  caption: 'Quick selfie',           rad: 22, bad: 14 },
  { userIdx: 7, category: 'people',  image: img('portrait4'),  caption: 'Blue hour',              rad:  8, bad: 16 },

  // Animals — 97%, 85%, 52%, 28%
  { userIdx: 1, category: 'animals', image: img('goldenlab1'), caption: 'Best boy',               rad: 29, bad:  1 },
  { userIdx: 3, category: 'animals', image: img('chaoscat1'),  caption: 'Chaos goblin',           rad: 34, bad:  6 },
  { userIdx: 6, category: 'animals', image: img('zoomcat1'),   caption: 'Zoom zoom',              rad: 13, bad: 12 },
  { userIdx: 8, category: 'animals', image: img('derpdog1'),   caption: 'Derp mode',              rad:  7, bad: 18 },

  // Food — 91%, 74%, 58%, 41%
  { userIdx: 1, category: 'food',    image: img('brunch1'),    caption: 'Sunday brunch',          rad: 91, bad:  9 },
  { userIdx: 4, category: 'food',    image: img('tacos1'),     caption: 'Street tacos',           rad: 37, bad: 13 },
  { userIdx: 8, category: 'food',    image: img('datenight1'), caption: 'Date night',             rad: 29, bad: 21 },
  { userIdx: 9, category: 'food',    image: img('ramen1'),     caption: 'Homemade ramen',         rad:  9, bad: 13 },

  // Nature — 96%, 83%, 68%, 45%, 22%
  { userIdx: 0, category: 'nature',  image: img('grad-hot1'),  caption: 'Golden hour hits different', rad: 48, bad:  2 },
  { userIdx: 2, category: 'nature',  image: img('grad-hot2'),  caption: 'Pacific coast highway',      rad: 83, bad: 17 },
  { userIdx: 4, category: 'nature',  image: img('grad-hot3'),  caption: 'Morning fog rolling in',     rad: 34, bad: 16 },
  { userIdx: 6, category: 'nature',  image: img('grad-hot5'),  caption: 'Midday light',               rad:  9, bad: 11 },
  { userIdx: 9, category: 'nature',  image: img('beach1'),     caption: 'Low tide',                   rad: 11, bad: 39 },

  // Memes — 89%, 72%, 55%, 38%
  { userIdx: 3, category: 'memes',   image: img('meme1'),      caption: 'Too real',               rad: 89, bad: 11 },
  { userIdx: 5, category: 'memes',   image: img('meme2'),      caption: 'Every time',             rad: 36, bad: 14 },
  { userIdx: 7, category: 'memes',   image: img('meme3'),      caption: 'Send help',              rad: 11, bad:  9 },
  { userIdx: 9, category: 'memes',   image: img('meme4'),      caption: 'No notes',               rad: 19, bad: 31 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function log(msg)  { console.log(`  ${msg}`); }
function fail(msg) { console.error(`  ❌ ${msg}`); }

async function cleanup() {
  console.log('🧹 Cleaning up existing test users...');
  const usernames = USERS.map((u) => u.username);

  // Find by username — handles email domain changes across runs
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .in('username', usernames);

  let removed = 0;
  for (const { id } of existing ?? []) {
    await supabase.auth.admin.deleteUser(id);
    removed++;
  }
  // Also clean up any uploads owned by those users (catches caption changes across runs)
  if ((existing ?? []).length) {
    const ids = (existing ?? []).map((u) => u.id);
    await supabase.from('uploads').delete().in('user_id', ids);
  }
  log(removed ? `Removed ${removed} existing test user(s).` : 'Nothing to clean up.');
}

async function createUsers() {
  console.log('\n👤 Creating users...');
  const created = [];
  for (const u of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email:         u.email,
      password:      u.password,
      email_confirm: true,                    // skip confirmation email
      user_metadata: { username: u.username },
    });
    if (error) { fail(`${u.username}: ${error.message}`); continue; }
    created.push({ ...u, id: data.user.id });
    log(`✓ ${u.username}`);
  }
  return created;
}

async function createUploads(users) {
  console.log('\n📸 Creating uploads...');
  const created = [];
  for (const post of POSTS) {
    const user = users[post.userIdx];
    if (!user) { fail(`No user at index ${post.userIdx}`); continue; }

    const { data, error } = await supabase
      .from('uploads')
      .insert({
        user_id:   user.id,
        category:  post.category,
        image_url: post.image,
        caption:   post.caption,
      })
      .select('id')
      .single();

    if (error) { fail(`Upload "${post.caption}": ${error.message}`); continue; }

    // Set vote counts directly — triggers wilson_score recalc via DB trigger
    const total = post.rad + post.bad;
    const { error: ve } = await supabase
      .from('uploads')
      .update({ rad_votes: post.rad, bad_votes: post.bad, total_votes: total })
      .eq('id', data.id);

    if (ve) { fail(`Vote counts for "${post.caption}": ${ve.message}`); continue; }

    const pct = Math.round((post.rad / total) * 100);
    created.push({ ...post, id: data.id });
    log(`✓ @${user.username} → [${post.category}] "${post.caption}" — ${post.rad}/${total} = ${pct}%`);
  }
  return created;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Rad or Bad — Seed Script\n');

  await cleanup();

  const users = await createUsers();
  if (!users.length) {
    console.error('\n❌ No users created — aborting.');
    process.exit(1);
  }

  // Small delay to let the DB trigger create public.users rows
  await new Promise((r) => setTimeout(r, 1500));

  await createUploads(users);

  console.log(`
✅ Seed complete!

Login with any test account:
  Email:    testuser1@radorbad.dev … testuser10@radorbad.dev
  Password: ${PASSWORD}

Scores are spread across the full range per category:
  People:  94%, 78%, 61%, 33%
  Animals: 97%, 85%, 52%, 28%
  Food:    91%, 74%, 58%, 41%
  Nature:  96%, 83%, 68%, 45%, 22%
  Memes:   89%, 72%, 55%, 38%

Re-run this script at any time to reset all test data.
`);
}

main().catch((err) => { console.error('\n❌', err.message); process.exit(1); });
