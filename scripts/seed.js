#!/usr/bin/env node
'use strict';

/**
 * Seed script — creates 100 test users, ~400 posts across all categories
 * (including videos), random follow relationships, and vote counts spread
 * across the full score range.
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
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Config ────────────────────────────────────────────────────────────────────
const NUM_USERS  = 100;
const PASSWORD   = 'Testpass123!';
const POSTS_PER_USER = 4;

const FOLLOWS_MIN = 5;
const FOLLOWS_MAX = 25;

// ── Users ─────────────────────────────────────────────────────────────────────
const USERS = Array.from({ length: NUM_USERS }, (_, i) => ({
  email:    `testuser${i + 1}@radorbad.dev`,
  password: PASSWORD,
  username: `testuser${i + 1}`,
}));

// ── Image helpers ─────────────────────────────────────────────────────────────
// Portrait (400×870) — ratio 0.46, fills iPhone without triggering blur bg
const portrait = (seed) => ({ url: `https://picsum.photos/seed/${seed}/400/870`, width: 400, height: 870 });
// Landscape (1600×900) — ratio 1.78, triggers blurred background
const landscape = (seed) => ({ url: `https://picsum.photos/seed/${seed}/1600/900`, width: 1600, height: 900 });
// Thumbnail for video posts
const thumb = (seed) => `https://picsum.photos/seed/${seed}/400/870`;

// ── Video content ─────────────────────────────────────────────────────────────
// Mixkit free stock previews — short clips (5–15s), CDN-hosted, no auth needed
// Portrait videos: 1080×1920  |  Landscape videos: 1920×1080
// Google Cloud Storage public sample videos — reliable, no auth, correct content-type
// All are 1920×1080 landscape. Longer than 10s but fine for seed/testing purposes.
const GCS = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';
const vid = (file, thumbSeed) => ({
  url: `${GCS}/${file}`,
  width: 1920,
  height: 1080,
  thumbnail_url: thumb(thumbSeed),
});

const VIDEO_POOL = [
  vid('ForBiggerBlazes.mp4',     'vt1'),
  vid('ForBiggerEscapes.mp4',    'vt2'),
  vid('ForBiggerJoyrides.mp4',   'vt3'),
  vid('ForBiggerMeltdowns.mp4',  'vt4'),
  vid('ElephantsDream.mp4',      'vt5'),
  vid('SubaruOutbackOnStreetAndDirt.mp4', 'vt6'),
  vid('WeAreGoingOnBullrun.mp4', 'vt7'),
  vid('WhatCarCanYouGetForAGrand.mp4', 'vt8'),
];

// Distribute the shared pool across categories
const VIDEOS = {
  people:  [VIDEO_POOL[0], VIDEO_POOL[1], VIDEO_POOL[4]],
  animals: [VIDEO_POOL[2], VIDEO_POOL[3], VIDEO_POOL[5]],
  food:    [VIDEO_POOL[1], VIDEO_POOL[6], VIDEO_POOL[0]],
  nature:  [VIDEO_POOL[3], VIDEO_POOL[4], VIDEO_POOL[7], VIDEO_POOL[2]],
  funny:   [VIDEO_POOL[5], VIDEO_POOL[6], VIDEO_POOL[7]],
  music:   [VIDEO_POOL[0], VIDEO_POOL[3], VIDEO_POOL[7]],
  sports:  [VIDEO_POOL[1], VIDEO_POOL[2], VIDEO_POOL[6]],
  art:     [VIDEO_POOL[0], VIDEO_POOL[4], VIDEO_POOL[5]],
};

// ── Post content pools ────────────────────────────────────────────────────────
const CONTENT = {
  people: {
    images: [
      portrait('portrait1'), portrait('portrait2'), portrait('portrait3'),
      portrait('portrait4'), portrait('portrait5'), portrait('portrait6'),
      landscape('portrait7'), landscape('portrait8'),
    ],
    captions: [
      'Golden hour just hit different today',
      'Caught this one mid-laugh on the street',
      'Quick selfie',
      'Blue hour was insane last night',
      'The lighting in this alley was too good to pass up',
      'Candid on the subway, came out perfect',
      'Self portrait after a long week',
      'Rooftop at sunset — this one goes in the hall of fame',
      'Studio lighting session finally paid off',
      'Street style spotted downtown',
    ],
    videoCaptions: [
      'shot this on my way to work, couldn\'t not post it',
      'vibe check: passed',
      'caught in 4k',
      'this lighting was too good to waste',
      'city streets doing what they do',
    ],
  },
  animals: {
    images: [
      portrait('goldenlab1'), portrait('chaoscat1'), portrait('zoomcat1'),
      portrait('derpdog1'), portrait('animals2'), portrait('animals3'),
      landscape('animals4'), landscape('animals5'),
    ],
    captions: [
      'Best boy ever, no notes',
      'Chaos goblin discovered the Christmas tree',
      'Zoom zoom',
      'Caught him mid-derp',
      'She found the one sunny spot in the apartment',
      'He learned to open the fridge last Tuesday',
      'First time seeing snow',
      'This cat has 8am meeting energy',
      'Rescued him three weeks ago',
      'The audacity of this dog',
    ],
    videoCaptions: [
      'this goober has no idea how cute he is',
      'chaos mode activated',
      'main character behavior',
      'rent free in my heart forever',
      'she knew exactly what she was doing',
    ],
  },
  food: {
    images: [
      portrait('brunch1'), portrait('tacos1'), landscape('datenight1'),
      portrait('ramen1'), portrait('food2'), landscape('food3'),
      portrait('food4'), portrait('food5'),
    ],
    captions: [
      'Sunday brunch spread — gone in eleven minutes',
      'Street tacos at 2am after the show',
      'Date night',
      'Homemade ramen took six hours and was worth every second',
      'This farmer\'s market haul goes hard',
      'Carbonara that actually emulsified on the first try',
      'Birthday cake attempt number three — nailed it',
      'Dumpling folding party',
      'The charcuterie board I assembled alone',
      'Cast iron pizza hits different',
    ],
    videoCaptions: [
      'the pour was perfect and i caught it',
      'this is what Sunday looks like',
      'restaurant secrets they don\'t want you to see',
      'made this in 20 minutes, ate it in 2',
    ],
  },
  nature: {
    images: [
      portrait('grad-hot1'), landscape('grad-hot2'), portrait('grad-hot3'),
      landscape('grad-hot5'), portrait('beach1'), portrait('nature2'),
      landscape('nature3'), portrait('nature4'),
    ],
    captions: [
      'Golden hour after a four mile hike',
      'PCH on a Tuesday — no traffic, windows down',
      'Morning fog rolling in',
      'Midday light just doing its thing',
      'Low tide at 5am',
      'The mountains don\'t care about your schedule',
      'Wildflower season is peaking',
      'Found this trail completely by accident',
      'Storm rolling in — had three minutes to get the shot',
      'Desert at sunrise',
    ],
    videoCaptions: [
      'nature said you\'re welcome',
      'stayed out here for two hours',
      'found this spot and couldn\'t leave',
      'the real thing looks even better',
      'made me forget about everything for a second',
      'touch grass, as they say',
    ],
  },
  funny: {
    images: [
      portrait('meme1'), landscape('meme2'), portrait('meme3'),
      portrait('meme4'), landscape('meme5'), portrait('meme6'),
      portrait('meme7'), portrait('meme8'),
    ],
    captions: [
      'Sent this to my entire family and now nobody texts me back',
      'Every time without fail',
      'Send help',
      'No notes',
      'This is the most accurate thing I\'ve ever seen',
      'My therapist said we need to talk about this',
      'This person has been inside my head',
      'My group chat: silence for six hours then seventeen crying emojis',
      'Cannot stop thinking about this one',
      'Perfectly describes every Sunday evening',
    ],
    videoCaptions: [
      'said what we were all thinking',
      'too accurate to handle',
      'the timing on this is everything',
      'living in my head rent free',
      'scientists couldn\'t have predicted this',
    ],
  },
  music: {
    images: [
      portrait('music1'), portrait('music2'), landscape('music3'),
      portrait('music4'), landscape('music5'), portrait('music6'),
      portrait('music7'), portrait('music8'),
    ],
    captions: [
      'First row and the setlist hit different',
      'This vinyl find was not leaving the store without me',
      'Home studio finally came together',
      'Caught this one mid-solo',
      'The crowd knew every word',
      'Found this record at a garage sale for two dollars',
      'Open mic turned into something else entirely',
      'Practice session that actually went well',
      'Sound check hours before anyone else arrived',
      'New speakers and I have not moved in four hours',
    ],
    videoCaptions: [
      'the drop at 0:47 broke something in me',
      'caught this busker and could not walk away',
      'she played this completely unplugged',
      'session musicians doing what they do',
      'this bassline is embarrassingly good',
    ],
  },
  art: {
    images: [
      portrait('art1'), landscape('art2'), portrait('art3'),
      portrait('art4'), landscape('art5'), portrait('art6'),
      landscape('art7'), portrait('art8'),
    ],
    captions: [
      'Found this piece at a tiny gallery and couldn\'t stop staring',
      'Studio day — paint everywhere, no regrets',
      'This one took three weeks and I\'m still not sure it\'s done',
      'Street mural that stopped me in my tracks',
      'Picked this up at the open market for forty dollars',
      'The colors in person are completely different from the photo',
      'Ceramics class is now the best part of my week',
      'Caught this sculptor mid-session',
      'This exhibit had zero people in it which meant it was mine',
      'Commission came out better than the brief',
    ],
    videoCaptions: [
      'time lapse of a piece that took six hours',
      'the brush work on this is unreal',
      'open studio and the energy was everything',
      'watched this street artist work for an hour straight',
      'the reveal at the end got me',
    ],
  },
  sports: {
    images: [
      portrait('sports1'), landscape('sports2'), portrait('sports3'),
      landscape('sports4'), portrait('sports5'), portrait('sports6'),
      landscape('sports7'), portrait('sports8'),
    ],
    captions: [
      'Last second and we were already screaming',
      'Morning run before the city woke up',
      'The grind does not care what day it is',
      'First game of the season and they delivered',
      'This gym has been my second home for three years',
      'Post-game energy is unmatched',
      'The training montage that actually happened',
      'Packed stadium and the atmosphere was unreal',
      'Recovery day but the view made it worth it',
      'Caught this right before the whistle',
    ],
    videoCaptions: [
      'the highlight reel wrote itself',
      'nobody in that stadium was sitting down',
      'he made that look too easy',
      'the comeback nobody saw coming',
      'this play is going to live in my head forever',
    ],
  },
};

const CATEGORIES = Object.keys(CONTENT);

// ── Wilson score ──────────────────────────────────────────────────────────────
function wilsonScore(rad, total) {
  if (total === 0) return 0;
  const p   = rad / total;
  const z   = 1.96;
  const n   = total;
  const num = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  const den = 1 + (z * z) / n;
  return Math.max(0, Math.min(1, num / den));
}

// ── Vote counts ───────────────────────────────────────────────────────────────
function randomVotes() {
  const r = Math.random();
  let total, pct;
  if (r < 0.05) {
    total = Math.floor(500_000 + Math.random() * 1_500_000);
    pct   = 0.6 + Math.random() * 0.38;
  } else if (r < 0.15) {
    total = Math.floor(50_000 + Math.random() * 450_000);
    pct   = 0.4 + Math.random() * 0.55;
  } else if (r < 0.35) {
    total = Math.floor(5_000 + Math.random() * 45_000);
    pct   = 0.3 + Math.random() * 0.65;
  } else if (r < 0.55) {
    total = Math.floor(100 + Math.random() * 4_900);
    pct   = 0.2 + Math.random() * 0.75;
  } else {
    total = Math.floor(Math.random() * 100);
    if (total === 0) return { rad: 0, bad: 0, total: 0, wilson: 0 };
    pct = Math.random();
  }
  const rad = Math.round(total * pct);
  const bad = total - rad;
  return { rad, bad, total, wilson: wilsonScore(rad, total) };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(msg)  { console.log(`  ${msg}`); }
function fail(msg) { console.error(`  ❌ ${msg}`); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Assign 1–2 categories per post: primary is always the content pool key;
// 30% chance of a second category chosen at random from the others.
function pickCategories(primary, allCategories) {
  if (Math.random() < 0.3) {
    const others = allCategories.filter((c) => c !== primary);
    return [primary, rand(others)];
  }
  return [primary];
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
async function cleanup() {
  console.log('🧹 Cleaning up existing test users...');
  const usernames = USERS.map((u) => u.username);

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .in('username', usernames);

  let removed = 0;
  for (const { id } of existing ?? []) {
    await supabase.auth.admin.deleteUser(id);
    removed++;
  }
  if ((existing ?? []).length) {
    const ids = (existing ?? []).map((u) => u.id);
    await supabase.from('uploads').delete().in('user_id', ids);
  }
  log(removed ? `Removed ${removed} existing test user(s).` : 'Nothing to clean up.');
}

// ── Create users ──────────────────────────────────────────────────────────────
async function createUsers() {
  console.log(`\n👤 Creating ${NUM_USERS} users...`);
  const created = [];
  for (const u of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email:         u.email,
      password:      u.password,
      email_confirm: true,
      user_metadata: { username: u.username },
    });
    if (error) { fail(`${u.username}: ${error.message}`); continue; }
    created.push({ ...u, id: data.user.id });
    process.stdout.write('.');
  }
  console.log(`\n  ✓ Created ${created.length} users`);
  return created;
}

// ── Create uploads ────────────────────────────────────────────────────────────
async function createUploads(users) {
  console.log('\n📸 Creating posts...');

  const imageCategoryCounters = {};
  const videoCategoryCounters = {};
  let videoPostTotal = 0;
  let imagePostTotal = 0;

  const posts = users.flatMap((user, ui) => {
    return Array.from({ length: POSTS_PER_USER }, (_, pi) => {
      const cat = CATEGORIES[(ui * POSTS_PER_USER + pi) % CATEGORIES.length];
      const pool = CONTENT[cat];

      // Every 4th post is a video
      const isVideo = (ui + pi) % 4 === 0;

      if (isVideo) {
        const vidPool = VIDEOS[cat];
        const idx = videoCategoryCounters[cat] = (videoCategoryCounters[cat] ?? 0);
        videoCategoryCounters[cat]++;
        const vid = vidPool[idx % vidPool.length];
        videoPostTotal++;
        return {
          user,
          categories: pickCategories(cat, CATEGORIES),
          media_type: 'video',
          image_url: vid.url,
          thumbnail_url: vid.thumbnail_url,
          width: vid.width,
          height: vid.height,
          caption: pool.videoCaptions[idx % pool.videoCaptions.length],
          ...randomVotes(),
        };
      } else {
        const imgPool = pool.images;
        const idx = imageCategoryCounters[cat] = (imageCategoryCounters[cat] ?? 0);
        imageCategoryCounters[cat]++;
        const img = imgPool[idx % imgPool.length];
        imagePostTotal++;
        return {
          user,
          categories: pickCategories(cat, CATEGORIES),
          media_type: 'image',
          image_url: img.url,
          thumbnail_url: null,
          width: img.width,
          height: img.height,
          caption: pool.captions[idx % pool.captions.length],
          ...randomVotes(),
        };
      }
    });
  });

  let count = 0;
  for (const post of posts) {
    const { error } = await supabase
      .from('uploads')
      .insert({
        user_id:       post.user.id,
        categories:    post.categories,
        image_url:     post.image_url,
        media_type:    post.media_type,
        thumbnail_url: post.thumbnail_url,
        width:         post.width,
        height:        post.height,
        caption:       post.caption,
        rad_votes:     post.rad,
        bad_votes:     post.bad,
        total_votes:   post.total,
        wilson_score:  post.wilson,
        is_approved:   true,
      });

    if (error) { fail(`Upload for @${post.user.username}: ${error.message}`); continue; }
    count++;
    process.stdout.write(post.media_type === 'video' ? 'v' : '.');
  }
  console.log(`\n  ✓ Created ${count} posts (${imagePostTotal} images, ${videoPostTotal} videos)`);
}

// ── Create follows ────────────────────────────────────────────────────────────
async function createFollows(users) {
  console.log('\n👥 Creating follow relationships...');
  const ids = users.map((u) => u.id);
  const pairs = [];
  const seen  = new Set();

  for (const user of users) {
    const count   = FOLLOWS_MIN + Math.floor(Math.random() * (FOLLOWS_MAX - FOLLOWS_MIN + 1));
    const targets = pick(ids.filter((id) => id !== user.id), count);
    for (const targetId of targets) {
      const key = `${user.id}:${targetId}`;
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push({ follower_id: user.id, following_id: targetId });
      }
    }
  }

  const CHUNK = 100;
  let inserted = 0;
  for (let i = 0; i < pairs.length; i += CHUNK) {
    const chunk = pairs.slice(i, i + CHUNK);
    const { error } = await supabase.from('follows').insert(chunk);
    if (error) { fail(`Follow batch ${i / CHUNK}: ${error.message}`); continue; }
    inserted += chunk.length;
    process.stdout.write('.');
  }
  console.log(`\n  ✓ Created ${inserted} follow relationships`);
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

  console.log('\n⏳ Waiting for DB trigger...');
  await new Promise((r) => setTimeout(r, 2000));

  await createUploads(users);
  await createFollows(users);

  const totalPosts = NUM_USERS * POSTS_PER_USER;
  const videoPosts = Math.floor(totalPosts / 4);

  console.log(`
✅ Seed complete!

  ${NUM_USERS} users  |  ~${totalPosts} posts (~${videoPosts} videos)  |  ~${NUM_USERS * Math.round((FOLLOWS_MIN + FOLLOWS_MAX) / 2)} follows

Login with any test account:
  Email:    testuser1@radorbad.dev … testuser${NUM_USERS}@radorbad.dev
  Password: ${PASSWORD}

Re-run this script at any time to reset all test data.
`);
}

main().catch((err) => { console.error('\n❌', err.message); process.exit(1); });
