#!/usr/bin/env node
'use strict';

/**
 * Seed script for testing the friendship system.
 *
 * Creates 5 friend users + 3 poster users.
 * Makes friend users accepted friends with Kevin (+ auto-follows).
 * Creates posts by posters and friends.
 * Friends vote on posts so Streak feed + avatar bubbles work.
 * Runs refresh_vote_streaks() to compute streaks.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('Missing env vars.'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = 'Testpass123!';
const KEVIN_EMAIL = 'konakevin@gmail.com';

const FRIEND_USERS = [
  { email: 'frienduser1@radorbad.dev', username: 'frienduser1' },
  { email: 'frienduser2@radorbad.dev', username: 'frienduser2' },
  { email: 'frienduser3@radorbad.dev', username: 'frienduser3' },
  { email: 'frienduser4@radorbad.dev', username: 'frienduser4' },
  { email: 'frienduser5@radorbad.dev', username: 'frienduser5' },
];

const POSTER_USERS = [
  { email: 'poster1@radorbad.dev', username: 'poster1' },
  { email: 'poster2@radorbad.dev', username: 'poster2' },
  { email: 'poster3@radorbad.dev', username: 'poster3' },
];

const PLACEHOLDER_IMAGES = Array.from({ length: 50 }, (_, i) =>
  `https://picsum.photos/seed/friend${i + 1}/600/800`
);

function log(msg) { console.log(`  ${msg}`); }

async function cleanup() {
  console.log('Cleaning up test users...');
  let deleted = 0;
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      if (u.email === KEVIN_EMAIL) continue;
      if (u.email && u.email.endsWith('@radorbad.dev')) {
        await supabase.auth.admin.deleteUser(u.id);
        deleted++;
        process.stdout.write('.');
      }
    }
    if (data.users.length < 1000) break;
    page++;
  }
  if (deleted) console.log(`\n  Removed ${deleted} test user(s)`);

  await supabase.from('vote_streaks').delete().not('user_a', 'is', null);
  await supabase.from('friendships').delete().not('user_a', 'is', null);
  await supabase.from('streak_cron_state').update({ last_processed_at: '2000-01-01T00:00:00Z' }).eq('id', 1);
  log('Cleared streaks, friendships, reset watermark');
}

async function createUser(email, username) {
  const { data, error } = await supabase.auth.admin.createUser({
    email, password: PASSWORD, email_confirm: true,
    user_metadata: { username },
  });
  if (error) { console.error(`  Failed ${username}: ${error.message}`); return null; }
  return { id: data.user.id, email, username };
}

async function main() {
  console.log('=== Friendship Seed Script ===\n');

  await cleanup();

  const { data: kevin } = await supabase.from('users').select('id').eq('email', KEVIN_EMAIL).single();
  if (!kevin) { console.error('Kevin not found!'); process.exit(1); }
  console.log(`\nKevin ID: ${kevin.id}`);

  // Create users
  console.log('\nCreating friend users...');
  const friends = [];
  for (const f of FRIEND_USERS) {
    const user = await createUser(f.email, f.username);
    if (user) friends.push(user);
    process.stdout.write('.');
  }
  console.log(`\n  Created ${friends.length} friends`);

  console.log('\nCreating poster users...');
  const posters = [];
  for (const p of POSTER_USERS) {
    const user = await createUser(p.email, p.username);
    if (user) posters.push(user);
    process.stdout.write('.');
  }
  console.log(`\n  Created ${posters.length} posters`);

  // Create accepted friendships between Kevin and all friend users
  console.log('\nCreating friendships with Kevin...');
  for (const f of friends) {
    const userA = kevin.id < f.id ? kevin.id : f.id;
    const userB = kevin.id < f.id ? f.id : kevin.id;
    await supabase.from('friendships').upsert({
      user_a: userA,
      user_b: userB,
      status: 'accepted',
      requester: f.id,
    }, { onConflict: 'user_a,user_b' });
  }
  log(`Created ${friends.length} accepted friendships`);

  // Auto-follow both ways (friendship acceptance does this normally)
  console.log('\nCreating mutual follows...');
  for (const f of friends) {
    await supabase.from('follows').upsert([
      { follower_id: kevin.id, following_id: f.id },
      { follower_id: f.id, following_id: kevin.id },
    ], { onConflict: 'follower_id,following_id' });
  }
  log('Mutual follows created');

  // Also create friendships between some friends (for testing friend lists on other profiles)
  console.log('\nCreating inter-friend friendships...');
  for (let i = 0; i < friends.length - 1; i++) {
    const a = friends[i].id < friends[i + 1].id ? friends[i].id : friends[i + 1].id;
    const b = friends[i].id < friends[i + 1].id ? friends[i + 1].id : friends[i].id;
    await supabase.from('friendships').upsert({
      user_a: a, user_b: b, status: 'accepted', requester: a,
    }, { onConflict: 'user_a,user_b' });
    await supabase.from('follows').upsert([
      { follower_id: friends[i].id, following_id: friends[i + 1].id },
      { follower_id: friends[i + 1].id, following_id: friends[i].id },
    ], { onConflict: 'follower_id,following_id' });
  }
  log('Inter-friend friendships created');

  // Create one pending request TO Kevin (from a poster, not a friend)
  console.log('\nCreating a pending friend request to Kevin...');
  const pendingUser = await createUser('pendinguser@radorbad.dev', 'pendinguser');
  if (pendingUser) {
    const a = kevin.id < pendingUser.id ? kevin.id : pendingUser.id;
    const b = kevin.id < pendingUser.id ? pendingUser.id : kevin.id;
    await supabase.from('friendships').upsert({
      user_a: a, user_b: b, status: 'pending', requester: pendingUser.id,
    }, { onConflict: 'user_a,user_b' });
    log(`Pending request from @${pendingUser.username}`);
  }

  // Create posts
  console.log('\nCreating stranger posts (Everyone feed)...');
  const strangerPosts = [];
  for (let i = 0; i < 20; i++) {
    const poster = posters[i % posters.length];
    const { data, error } = await supabase.from('uploads').insert({
      user_id: poster.id,
      categories: ['funny', 'people'],
      image_url: PLACEHOLDER_IMAGES[i],
      media_type: 'image',
      width: 600, height: 800,
      caption: `Everyone feed post ${i + 1}`,
      is_approved: true,
    }).select('id, user_id').single();
    if (!error) strangerPosts.push(data);
  }
  log(`Created ${strangerPosts.length} stranger posts`);

  console.log('\nCreating friend posts (Following feed)...');
  const friendPosts = [];
  for (let i = 0; i < 20; i++) {
    const friend = friends[i % friends.length];
    const { data, error } = await supabase.from('uploads').insert({
      user_id: friend.id,
      categories: ['animals', 'nature'],
      image_url: PLACEHOLDER_IMAGES[20 + i],
      media_type: 'image',
      width: 600, height: 800,
      caption: `${friend.username}'s post ${Math.floor(i / friends.length) + 1}`,
      is_approved: true,
    }).select('id, user_id').single();
    if (!error) friendPosts.push(data);
  }
  log(`Created ${friendPosts.length} friend posts`);

  // Friends vote on posts
  console.log('\nFriends voting on posts...');
  let voteCount = 0;

  for (const post of strangerPosts) {
    for (let i = 0; i < friends.length; i++) {
      const vote = i < 3 ? 'rad' : 'bad';
      const { error } = await supabase.from('votes').upsert({
        voter_id: friends[i].id, upload_id: post.id, vote,
      }, { onConflict: 'voter_id,upload_id' });
      if (!error) voteCount++;
    }
  }

  for (const post of friendPosts) {
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].id === post.user_id) continue;
      const vote = i < 3 ? 'rad' : 'bad';
      const { error } = await supabase.from('votes').upsert({
        voter_id: friends[i].id, upload_id: post.id, vote,
      }, { onConflict: 'voter_id,upload_id' });
      if (!error) voteCount++;
    }
  }
  log(`Created ${voteCount} votes`);

  // Update vote counts
  console.log('\nUpdating vote counts...');
  const allPosts = [...strangerPosts, ...friendPosts];
  for (const post of allPosts) {
    const { data: votes } = await supabase.from('votes').select('vote').eq('upload_id', post.id);
    if (!votes) continue;
    const rad = votes.filter(v => v.vote === 'rad').length;
    const bad = votes.filter(v => v.vote === 'bad').length;
    await supabase.from('uploads').update({
      total_votes: rad + bad, rad_votes: rad, bad_votes: bad,
    }).eq('id', post.id);
  }
  log('Vote counts updated');

  // Refresh streaks
  console.log('\nRefreshing streaks...');
  const { error: streakErr } = await supabase.rpc('refresh_vote_streaks');
  if (streakErr) console.error('  Streak error:', streakErr.message);
  else log('Streaks computed');

  // Verify
  console.log('\nVerifying...');
  const { data: mainFeed } = await supabase.rpc('get_feed', { p_user_id: kevin.id, p_limit: 50 });
  log(`Everyone feed: ${mainFeed?.length ?? 0} posts`);
  const { data: followFeed } = await supabase.rpc('get_following_feed', { p_user_id: kevin.id, p_limit: 50 });
  log(`Following feed: ${followFeed?.length ?? 0} posts`);
  const { data: streakFeed } = await supabase.rpc('get_friends_feed', { p_user_id: kevin.id, p_limit: 50 });
  log(`Streak feed: ${streakFeed?.length ?? 0} posts`);

  const { data: friendCount } = await supabase.rpc('get_friend_count', { p_user_id: kevin.id });
  log(`Kevin's friend count: ${friendCount}`);

  const { data: pending } = await supabase.rpc('get_pending_requests', { p_user_id: kevin.id });
  log(`Pending requests: ${pending?.length ?? 0}`);

  console.log('\n=== Done! ===');
  console.log('\nHow to test:');
  console.log('  1. Open app → Profile → Friends tab should show 5 friends + 1 pending request');
  console.log('  2. Accept/decline the pending request from @pendinguser');
  console.log('  3. View a friend profile → "Friends ✓" button should show');
  console.log('  4. Streak feed should show posts friends voted on');
  console.log('  5. Following feed should show friends\' posts');
  console.log('  6. Vote RAD → avatar bubbles flip green (frienduser1-3) and red (frienduser4-5)');
}

main().catch((err) => { console.error(err); process.exit(1); });
