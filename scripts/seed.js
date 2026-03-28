#!/usr/bin/env node
'use strict';

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

if (!SUPABASE_URL || !SERVICE_KEY) { console.error('❌  Missing env vars.'); process.exit(1); }
if (!PEXELS_KEY) { console.error('❌  Missing PEXELS_API_KEY.'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Config ────────────────────────────────────────────────────────────────────
const NUM_USERS = 100;
const PASSWORD  = 'Testpass123!';
const VIDEO_RATE = 0.4;
const FOLLOWS_MIN = 20;
const FOLLOWS_MAX = 60;

// ── Archetypes — drive character class + alignment diversity ──────────────────
// postRadPct: rad% on individual posts (determines wilson/TASTE and CHAOS/EDGE)
// votesPerPost: total votes received per post (determines CLOUT)
// votesCast: total votes the user casts (determines CRITIC/JUDGE)
// alignRadPct: rad% of votes the user gives (determines alignment)
// numCats: distinct categories posted in (determines VARIETY)
const ARCHETYPES = [
  {
    name: 'main_character', count: 12,
    postRange: [4, 6],    numCats: 3,
    postRadPct:    [0.76, 0.90],      // high wilson → TASTE 16+, low edge
    votesPerPost:  [8000, 80000],     // → CLOUT 18-20
    votesCast:     [200, 1000],       // → CRITIC 10-15
    alignRadPct:   [0.55, 0.68],
  },
  {
    name: 'crowd_pleaser', count: 10,
    postRange: [4, 6],    numCats: 3,
    postRadPct:    [0.72, 0.88],
    votesPerPost:  [5000, 60000],     // → CLOUT 17-20
    votesCast:     [1000, 6000],      // → CRITIC 15-18
    alignRadPct:   [0.60, 0.72],
  },
  {
    name: 'provocateur', count: 12,
    postRange: [5, 8],    numCats: 3,
    postRadPct:    [0.44, 0.56],      // ~50/50 → CHAOS 17-20, low TASTE
    votesPerPost:  [2000, 30000],
    votesCast:     [1000, 6000],      // → CRITIC 15-18
    alignRadPct:   [0.30, 0.70],      // varies — sub-alignment determines label
  },
  {
    name: 'wanderer', count: 10,
    postRange: [5, 7],    numCats: 8, // all categories → VARIETY 20
    postRadPct:    [0.62, 0.80],
    votesPerPost:  [1000, 15000],
    votesCast:     [300, 2000],
    alignRadPct:   [0.45, 0.65],
  },
  {
    name: 'chaos_agent', count: 10,
    postRange: [3, 5],    numCats: 4,
    postRadPct:    [0.18, 0.40],      // low rad% → low wilson → TASTE 3-8
    votesPerPost:  [10000, 150000],   // → CLOUT 19-20
    votesCast:     [200, 2000],
    alignRadPct:   [0.35, 0.55],
  },
  {
    name: 'grinder', count: 10,
    postRange: [12, 18],  numCats: 3, // many posts → GRIND 13-15
    postRadPct:    [0.55, 0.75],
    votesPerPost:  [500, 8000],
    votesCast:     [300, 2000],
    alignRadPct:   [0.45, 0.65],
  },
  {
    name: 'one_hit_wonder', count: 8,
    postRange: [1, 1],    numCats: 1, // 1 post → GRIND ≈ 2 (rank 6)
    postRadPct:    [0.60, 0.80],
    votesPerPost:  [300000, 2000000], // → CLOUT 20 (rank 1)
    votesCast:     [10, 60],          // barely votes → CRITIC rank 5+
    alignRadPct:   [0.38, 0.65],
  },
  {
    name: 'hidden_gem', count: 8,
    postRange: [2, 3],    numCats: 2,
    postRadPct:    [0.86, 0.97],      // excellent → TASTE 18-20 (rank 1)
    votesPerPost:  [5, 35],           // tiny → CLOUT ≈ 4-8 (rank 5+)
    votesCast:     [15, 80],
    alignRadPct:   [0.50, 0.72],
  },
  {
    name: 'lurker', count: 8,
    postRange: [1, 2],    numCats: 1, // barely posts → GRIND rank 5+
    postRadPct:    [0.55, 0.75],
    votesPerPost:  [50, 500],
    votesCast:     [5000, 15000],     // heavy voter → CRITIC 18-20 (rank 1)
    alignRadPct:   [0.40, 0.60],      // true neutral
  },
  {
    name: 'harsh_critic', count: 6,
    postRange: [1, 2],    numCats: 1,
    postRadPct:    [0.55, 0.75],
    votesPerPost:  [50, 500],
    votesCast:     [5000, 15000],     // → CRITIC rank 1
    alignRadPct:   [0.08, 0.28],      // mostly bad → chaotic-bad alignment
  },
  {
    name: 'hype_machine', count: 6,
    postRange: [1, 2],    numCats: 1,
    postRadPct:    [0.55, 0.75],
    votesPerPost:  [50, 500],
    votesCast:     [5000, 15000],     // → CRITIC rank 1
    alignRadPct:   [0.72, 0.92],      // mostly rad → lawful-rad alignment
  },
];

// ── Assign archetypes to users ────────────────────────────────────────────────
function buildUserList() {
  const users = [];
  let i = 1;
  for (const archetype of ARCHETYPES) {
    for (let a = 0; a < archetype.count; a++, i++) {
      users.push({
        email:     `testuser${i}@radorbad.dev`,
        password:  PASSWORD,
        username:  `testuser${i}`,
        archetype,
      });
    }
  }
  return users;
}

const USERS = buildUserList();

// ── Pexels ────────────────────────────────────────────────────────────────────
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

const MAX_VIDEO_DURATION = 10;

async function fetchPexelsImages(keyword, count = 40) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=${count}&orientation=portrait`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
  const data = await res.json();
  return (data.photos ?? []).map((p) => ({ url: p.src.large2x, width: p.width, height: p.height }));
}

async function fetchPexelsVideos(keyword, count = 40) {
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=80&orientation=portrait&max_duration=${MAX_VIDEO_DURATION}`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
  const data = await res.json();
  return (data.videos ?? [])
    .filter((v) => v.duration <= MAX_VIDEO_DURATION)
    .slice(0, count)
    .map((v) => {
      const files = v.video_files ?? [];
      const file = files.find((f) => f.quality === 'hd' && f.height >= f.width)
        ?? files.find((f) => f.quality === 'hd') ?? files[0];
      if (!file?.link) return null;
      return { url: file.link, width: file.width ?? 1080, height: file.height ?? 1920, thumbnail_url: v.image ?? null };
    }).filter(Boolean);
}

async function fetchAllCategoryImages() {
  console.log('\n📷 Fetching Pexels images per category...');
  const images = {};
  for (const [cat, keyword] of Object.entries(PEXELS_KEYWORDS)) {
    try {
      const results = await fetchPexelsImages(keyword, 40);
      images[cat] = shuffle(results);
      process.stdout.write(`  ✓ ${cat} (${results.length} images)\n`);
    } catch (err) { fail(`Pexels image fetch for ${cat}: ${err.message}`); images[cat] = []; }
  }
  return images;
}

async function fetchAllCategoryVideos() {
  console.log('\n🎬 Fetching Pexels videos per category...');
  const videos = {};
  for (const [cat, keyword] of Object.entries(PEXELS_KEYWORDS)) {
    try {
      const results = await fetchPexelsVideos(keyword, 40);
      videos[cat] = shuffle(results);
      process.stdout.write(`  ✓ ${cat} (${results.length} videos)\n`);
    } catch (err) { fail(`Pexels video fetch for ${cat}: ${err.message}`); videos[cat] = []; }
  }
  return videos;
}

// ── Post content ──────────────────────────────────────────────────────────────
const CONTENT = {
  people:  { captions: ['Golden hour just hit different today','Caught this one mid-laugh on the street','Quick selfie','Blue hour was insane last night','The lighting in this alley was too good to pass up','Candid on the subway, came out perfect','Self portrait after a long week','Rooftop at sunset — this one goes in the hall of fame','Studio lighting session finally paid off','Street style spotted downtown'], videoCaptions: ['shot this on my way to work, couldn\'t not post it','vibe check: passed','caught in 4k','this lighting was too good to waste','city streets doing what they do'] },
  animals: { captions: ['Best boy ever, no notes','Chaos goblin discovered the Christmas tree','Zoom zoom','Caught him mid-derp','She found the one sunny spot in the apartment','He learned to open the fridge last Tuesday','First time seeing snow','This cat has 8am meeting energy','Rescued him three weeks ago','The audacity of this dog'], videoCaptions: ['this goober has no idea how cute he is','chaos mode activated','main character behavior','rent free in my heart forever','she knew exactly what she was doing'] },
  food:    { captions: ['Sunday brunch spread — gone in eleven minutes','Street tacos at 2am after the show','Date night','Homemade ramen took six hours and was worth every second','This farmer\'s market haul goes hard','Carbonara that actually emulsified on the first try','Birthday cake attempt number three — nailed it','Dumpling folding party','The charcuterie board I assembled alone','Cast iron pizza hits different'], videoCaptions: ['the pour was perfect and i caught it','this is what Sunday looks like','restaurant secrets they don\'t want you to see','made this in 20 minutes, ate it in 2'] },
  nature:  { captions: ['Golden hour after a four mile hike','PCH on a Tuesday — no traffic, windows down','Morning fog rolling in','Midday light just doing its thing','Low tide at 5am','The mountains don\'t care about your schedule','Wildflower season is peaking','Found this trail completely by accident','Storm rolling in — had three minutes to get the shot','Desert at sunrise'], videoCaptions: ['nature said you\'re welcome','stayed out here for two hours','found this spot and couldn\'t leave','the real thing looks even better','made me forget about everything for a second','touch grass, as they say'] },
  funny:   { captions: ['Sent this to my entire family and now nobody texts me back','Every time without fail','Send help','No notes','This is the most accurate thing I\'ve ever seen','My therapist said we need to talk about this','This person has been inside my head','My group chat: silence for six hours then seventeen crying emojis','Cannot stop thinking about this one','Perfectly describes every Sunday evening'], videoCaptions: ['said what we were all thinking','too accurate to handle','the timing on this is everything','living in my head rent free','scientists couldn\'t have predicted this'] },
  music:   { captions: ['First row and the setlist hit different','This vinyl find was not leaving the store without me','Home studio finally came together','Caught this one mid-solo','The crowd knew every word','Found this record at a garage sale for two dollars','Open mic turned into something else entirely','Practice session that actually went well','Sound check hours before anyone else arrived','New speakers and I have not moved in four hours'], videoCaptions: ['the drop at 0:47 broke something in me','caught this busker and could not walk away','she played this completely unplugged','session musicians doing what they do','this bassline is embarrassingly good'] },
  art:     { captions: ['Found this piece at a tiny gallery and couldn\'t stop staring','Studio day — paint everywhere, no regrets','This one took three weeks and I\'m still not sure it\'s done','Street mural that stopped me in my tracks','Picked this up at the open market for forty dollars','The colors in person are completely different from the photo','Ceramics class is now the best part of my week','Caught this sculptor mid-session','This exhibit had zero people in it which meant it was mine','Commission came out better than the brief'], videoCaptions: ['time lapse of a piece that took six hours','the brush work on this is unreal','open studio and the energy was everything','watched this street artist work for an hour straight','the reveal at the end got me'] },
  sports:  { captions: ['Last second and we were already screaming','Morning run before the city woke up','The grind does not care what day it is','First game of the season and they delivered','This gym has been my second home for three years','Post-game energy is unmatched','The training montage that actually happened','Packed stadium and the atmosphere was unreal','Recovery day but the view made it worth it','Caught this right before the whistle'], videoCaptions: ['the highlight reel wrote itself','nobody in that stadium was sitting down','he made that look too easy','the comeback nobody saw coming','this play is going to live in my head forever'] },
};

const ALL_CATEGORIES = Object.keys(CONTENT);

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(msg)  { console.log(`  ${msg}`); }
function fail(msg) { console.error(`  ❌ ${msg}`); }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function pick(arr, n) { return shuffle(arr).slice(0, n); }
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randBetween(min, max) { return min + Math.random() * (max - min); }
function randIntBetween(min, max) { return Math.floor(randBetween(min, max + 1)); }

function wilsonScore(rad, total) {
  if (total === 0) return 0;
  const p = rad / total, z = 1.96, n = total;
  const num = p + (z*z)/(2*n) - z * Math.sqrt((p*(1-p) + (z*z)/(4*n))/n);
  return Math.max(0, Math.min(1, num / (1 + (z*z)/n)));
}

// ── Archetype-aware vote generation ──────────────────────────────────────────
function archetypeVotes(archetype) {
  const votesPerPost = randIntBetween(...archetype.votesPerPost);
  const postRadPct   = randBetween(...archetype.postRadPct);
  const rad   = Math.round(votesPerPost * postRadPct);
  const bad   = votesPerPost - rad;
  return { rad, bad, total: votesPerPost, wilson: wilsonScore(rad, votesPerPost), postRadPct };
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
async function cleanup() {
  console.log('🧹 Wiping all data...');

  // Clear dependent tables first (FK order)
  for (const { table, col } of [
    { table: 'votes',   col: 'voter_id'    },
    { table: 'follows', col: 'follower_id' },
    { table: 'uploads', col: 'user_id'     },
  ]) {
    const { error } = await supabase.from(table).delete().not(col, 'is', null);
    if (error) fail(`Clear ${table}: ${error.message}`);
    else log(`Cleared ${table}`);
  }

  // Delete every auth user (cascades to public.users)
  let deleted = 0;
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      await supabase.auth.admin.deleteUser(u.id);
      deleted++;
      process.stdout.write('.');
    }
    if (data.users.length < 1000) break;
    page++;
  }
  if (deleted) console.log(`\n  ✓ Removed ${deleted} auth user(s)`);
  else log('No auth users found.');
}

// ── Create users ──────────────────────────────────────────────────────────────
async function createUsers() {
  console.log(`\n👤 Creating ${NUM_USERS} users...`);
  const created = [];
  for (const u of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email, password: u.password, email_confirm: true,
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
  const imgCounters = {};
  const vidCounters = {};
  let imageTotal = 0, videoTotal = 0;

  for (const user of users) {
    const arch = user.archetype;
    const numPosts = randIntBetween(...arch.postRange);

    // Pick which categories this user will post in
    const userCats = pick(ALL_CATEGORIES, Math.min(arch.numCats, ALL_CATEGORIES.length));

    for (let pi = 0; pi < numPosts; pi++) {
      // Cycle through the user's assigned categories
      const cat  = userCats[pi % userCats.length];
      const pool = CONTENT[cat];
      const { rad, bad, total, wilson } = archetypeVotes(arch);
      const isVideo = Math.random() < VIDEO_RATE;

      // Pick secondary category 30% of the time — never exceed 2 (matches upload constraint)
      const others = ALL_CATEGORIES.filter((c) => c !== cat);
      const categories = (Math.random() < 0.3 ? [cat, rand(others)] : [cat]).slice(0, 2);

      let media_type, image_url, thumbnail_url, width, height, caption;

      if (isVideo) {
        const vidPool = pexelsVideos[cat] ?? [];
        if (vidPool.length > 0) {
          const idx = vidCounters[cat] = (vidCounters[cat] ?? 0);
          vidCounters[cat]++;
          const vid = vidPool[idx % vidPool.length];
          media_type = 'video'; image_url = vid.url; thumbnail_url = vid.thumbnail_url;
          width = vid.width; height = vid.height;
          caption = pool.videoCaptions[idx % pool.videoCaptions.length];
          videoTotal++;
        } else {
          isVideo = false; // fallthrough to image
        }
      }

      if (!isVideo || media_type !== 'video') {
        const imgPool = pexelsImages[cat] ?? [];
        const idx = imgCounters[cat] = (imgCounters[cat] ?? 0);
        imgCounters[cat]++;
        const img = imgPool[idx % (imgPool.length || 1)];
        media_type = 'image'; image_url = img?.url ?? `https://picsum.photos/seed/${cat}${idx}/400/870`;
        thumbnail_url = null; width = img?.width ?? 400; height = img?.height ?? 870;
        caption = pool.captions[idx % pool.captions.length];
        imageTotal++;
      }

      const { error } = await supabase.from('uploads').insert({
        user_id: user.id, categories, image_url, media_type, thumbnail_url,
        width, height, caption, rad_votes: rad, bad_votes: bad, total_votes: total,
        wilson_score: wilson, is_approved: true,
      });
      if (error) { fail(`Upload for @${user.username}: ${error.message}`); }
      process.stdout.write(media_type === 'video' ? 'v' : '.');
    }
  }
  console.log(`\n  ✓ Created posts (${imageTotal} images, ${videoTotal} videos)`);
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
      if (!seen.has(key)) { seen.add(key); pairs.push({ follower_id: user.id, following_id: targetId }); }
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

// ── Backfill user ranks ────────────────────────────────────────────────────────
async function backfillUserRanks(users) {
  console.log('\n🏅 Backfilling user ranks...');
  const LOG_CAP = Math.log(1 + 2_000_000);
  let ranked = 0;

  for (const user of users) {
    const { data: posts } = await supabase
      .from('uploads')
      .select('wilson_score, total_votes')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .gte('total_votes', 5)
      .not('wilson_score', 'is', null);

    if (!posts || posts.length < 3) continue;

    const totalVotes = posts.reduce((s, p) => s + p.total_votes, 0);
    const wilson     = posts.reduce((s, p) => s + p.wilson_score * p.total_votes, 0) / totalVotes;
    const engagement = Math.log(1 + totalVotes) / LOG_CAP;
    const score      = wilson * 0.80 + engagement * 0.20;

    const rank =
      score >= 0.82 ? 'LEGENDARY' :
      score >= 0.70 ? 'RAD'       :
      score >= 0.60 ? 'SOLID'     :
      score >= 0.50 ? 'MID'       :
      score >= 0.38 ? 'BAD'       : 'CURSED';

    await supabase
      .from('users')
      .update({ rad_score: score, user_rank: rank })
      .eq('id', user.id);

    ranked++;
    process.stdout.write('.');
  }
  console.log(`\n  ✓ Ranked ${ranked} users`);
  await supabase.rpc('refresh_rank_thresholds');
  console.log('  ✓ Percentile thresholds refreshed');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Rad or Bad — Seed Script\n');
  console.log('Archetypes:');
  for (const a of ARCHETYPES) console.log(`  ${a.name.padEnd(18)} × ${a.count}`);
  console.log();

  await cleanup();

  const users = await createUsers();
  if (!users.length) { console.error('\n❌ No users created — aborting.'); process.exit(1); }

  const [pexelsImages, pexelsVideos] = await Promise.all([
    fetchAllCategoryImages(),
    fetchAllCategoryVideos(),
  ]);

  console.log('\n⏳ Waiting for DB trigger...');
  await new Promise((r) => setTimeout(r, 2000));

  await createUploads(users, pexelsImages, pexelsVideos);
  await createFollows(users);
  await backfillUserRanks(users);

  console.log(`
✅ Seed complete!

  ${NUM_USERS} users across ${ARCHETYPES.length} archetypes

Login with any test account:
  Email:    testuser1@radorbad.dev … testuser${NUM_USERS}@radorbad.dev
  Password: ${PASSWORD}
`);
}

main().catch((err) => { console.error('\n❌', err.message); process.exit(1); });
