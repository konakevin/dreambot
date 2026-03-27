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
const PEXELS_KEY   = process.env.PEXELS_API_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing env vars.');
  process.exit(1);
}
if (!PEXELS_KEY) {
  console.error('❌  Missing PEXELS_API_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Config ────────────────────────────────────────────────────────────────────
const NUM_USERS      = 100;
const PASSWORD       = 'Testpass123!';
const POSTS_PER_USER = 4;
const VIDEO_RATE     = 0.4; // 40% of posts are videos

const FOLLOWS_MIN = 20;
const FOLLOWS_MAX = 60;

// ── Users ─────────────────────────────────────────────────────────────────────
const USERS = Array.from({ length: NUM_USERS }, (_, i) => ({
  email:    `testuser${i + 1}@radorbad.dev`,
  password: PASSWORD,
  username: `testuser${i + 1}`,
}));

// ── Pexels image fetching ─────────────────────────────────────────────────────
async function fetchPexelsImages(keyword, count = 20) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=${count}&orientation=portrait`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
  const data = await res.json();
  return (data.photos ?? []).map((p) => ({
    url: p.src.large2x,
    width: p.width,
    height: p.height,
  }));
}

async function fetchAllCategoryImages() {
  console.log('\n📷 Fetching Pexels images per category...');
  const images = {};
  for (const [cat, keyword] of Object.entries(PEXELS_KEYWORDS)) {
    try {
      const results = await fetchPexelsImages(keyword, 40);
      images[cat] = shuffle(results);
      process.stdout.write(`  ✓ ${cat} (${results.length} images)\n`);
    } catch (err) {
      fail(`Pexels image fetch for ${cat}: ${err.message}`);
      images[cat] = [];
    }
  }
  return images;
}

// ── Pexels video fetching ─────────────────────────────────────────────────────
const PEXELS_KEYWORDS = {
  people:  'aesthetic lifestyle portrait golden hour',
  animals: 'baby animals cute puppy kitten',
  food:    'colorful food aesthetic gourmet',
  nature:  'waterfall mountains dramatic landscape sunset',
  funny:   'funny dog cat derp',
  music:   'music festival concert crowd lights',
  sports:  'surfing skateboard extreme sports action',
  art:     'colorful mural street art vibrant',
};

const MAX_VIDEO_DURATION = 10; // seconds — matches app upload limit

async function fetchPexelsVideos(keyword, count = 20) {
  // Fetch extra to account for filtering by duration
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=80&orientation=portrait&max_duration=${MAX_VIDEO_DURATION}`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
  const data = await res.json();
  const results = (data.videos ?? [])
    .filter((v) => v.duration <= MAX_VIDEO_DURATION)
    .slice(0, count)
    .map((v) => {
      const files = v.video_files ?? [];
      // Prefer HD portrait, fallback to any
      const file = files.find((f) => f.quality === 'hd' && f.height >= f.width)
        ?? files.find((f) => f.quality === 'hd')
        ?? files[0];
      if (!file?.link) return null;
      return {
        url: file.link,
        width: file.width ?? 1080,
        height: file.height ?? 1920,
        thumbnail_url: v.image ?? null,
      };
    }).filter(Boolean);
  return results;
}

async function fetchAllCategoryVideos() {
  console.log('\n🎬 Fetching Pexels videos per category...');
  const videos = {};
  for (const [cat, keyword] of Object.entries(PEXELS_KEYWORDS)) {
    try {
      const results = await fetchPexelsVideos(keyword, 40);
      videos[cat] = shuffle(results);
      process.stdout.write(`  ✓ ${cat} (${results.length} videos)\n`);
    } catch (err) {
      fail(`Pexels fetch for ${cat}: ${err.message}`);
      videos[cat] = [];
    }
  }
  return videos;
}

// ── Post content pools (captions only — images/videos come from Pexels) ───────
const CONTENT = {
  people: {
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
async function createUploads(users, pexelsImages, pexelsVideos) {
  console.log('\n📸 Creating posts...');

  const imageCategoryCounters = {};
  const videoCategoryCounters = {};
  let videoPostTotal = 0;
  let imagePostTotal = 0;

  const posts = users.flatMap((user, ui) => {
    return Array.from({ length: POSTS_PER_USER }, (_, pi) => {
      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const pool = CONTENT[cat];
      const isVideo = Math.random() < VIDEO_RATE;

      if (isVideo) {
        const vidPool = pexelsVideos[cat] ?? [];
        if (vidPool.length === 0) {
          // Fallback to image if no videos available for this category
          const imgPool = pexelsImages[cat] ?? [];
          const idx = imageCategoryCounters[cat] = (imageCategoryCounters[cat] ?? 0);
          imageCategoryCounters[cat]++;
          const img = imgPool[idx % (imgPool.length || 1)];
          imagePostTotal++;
          return {
            user,
            categories: pickCategories(cat, CATEGORIES),
            media_type: 'image',
            image_url: img?.url ?? `https://picsum.photos/seed/${cat}${idx}/400/870`,
            thumbnail_url: null,
            width: img?.width ?? 400,
            height: img?.height ?? 870,
            caption: pool.captions[idx % pool.captions.length],
            ...randomVotes(),
          };
        }
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
        const imgPool = pexelsImages[cat] ?? [];
        const idx = imageCategoryCounters[cat] = (imageCategoryCounters[cat] ?? 0);
        imageCategoryCounters[cat]++;
        const img = imgPool[idx % (imgPool.length || 1)];
        imagePostTotal++;
        return {
          user,
          categories: pickCategories(cat, CATEGORIES),
          media_type: 'image',
          image_url: img?.url ?? `https://picsum.photos/seed/${cat}${idx}/400/870`,
          thumbnail_url: null,
          width: img?.width ?? 400,
          height: img?.height ?? 870,
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

  const [pexelsImages, pexelsVideos] = await Promise.all([
    fetchAllCategoryImages(),
    fetchAllCategoryVideos(),
  ]);

  console.log('\n⏳ Waiting for DB trigger...');
  await new Promise((r) => setTimeout(r, 2000));

  await createUploads(users, pexelsImages, pexelsVideos);
  await createFollows(users);

  const totalPosts = NUM_USERS * POSTS_PER_USER;
  const videoPosts = Math.round(totalPosts * VIDEO_RATE);

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
