#!/usr/bin/env node
/**
 * Hard-delete a bot account and ALL associated content.
 *
 * Order (to satisfy FK constraints):
 *   1. likes / favorites / comments / shares targeting the bot's uploads
 *   2. uploads (the bot's posts)
 *   3. bot_seeds rows for this bot
 *   4. follows / friendships involving the bot
 *   5. notifications where the bot is actor or recipient
 *   6. user_recipes row
 *   7. public.users row
 *   8. auth.users row (via admin API)
 *
 * Usage:
 *   node scripts/delete-bot.js --bot nyx --dry-run     # preview only
 *   node scripts/delete-bot.js --bot nyx               # actually delete
 *   node scripts/delete-bot.js --bots nyx,pixelrex     # multiple at once
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_ROLE) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const botArg = args[args.indexOf('--bot') + 1];
const botsArg = args[args.indexOf('--bots') + 1];

let targets = [];
if (botArg && args.indexOf('--bot') >= 0) targets.push(botArg);
if (botsArg && args.indexOf('--bots') >= 0) {
  targets.push(...botsArg.split(',').map((s) => s.trim()).filter(Boolean));
}
if (targets.length === 0) {
  console.error('Usage: --bot <username> | --bots <a,b,c>  [--dry-run]');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

async function findBot(username) {
  const { data: rows, error } = await sb
    .from('users')
    .select('id, username')
    .ilike('username', username);
  if (error) throw error;
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

async function countTable(table, column, userId) {
  const { count } = await sb
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq(column, userId);
  return count ?? 0;
}

async function deleteByColumn(table, column, value, label) {
  if (DRY_RUN) {
    console.log(`    [dry] would delete from ${table} where ${column}=${value}`);
    return 0;
  }
  const { error, count } = await sb.from(table).delete({ count: 'exact' }).eq(column, value);
  if (error) {
    console.log(`    ✗ ${label}: ${error.message}`);
    return -1;
  }
  console.log(`    ✓ ${label}: ${count ?? 0} rows`);
  return count ?? 0;
}

async function deleteUploadsAndChildren(userId) {
  const { data: uploads } = await sb.from('uploads').select('id').eq('user_id', userId);
  const ids = (uploads || []).map((u) => u.id);
  console.log(`    found ${ids.length} uploads`);
  if (ids.length === 0) return;

  const childTables = [
    'likes',
    'favorites',
    'comments',
    'post_shares',
    'impressions',
    'notifications',
  ];
  for (const t of childTables) {
    if (DRY_RUN) {
      console.log(`    [dry] would delete from ${t} where post_id in [${ids.length} ids]`);
      continue;
    }
    const { error, count } = await sb
      .from(t)
      .delete({ count: 'exact' })
      .in('post_id', ids);
    if (error && !/column .* does not exist/i.test(error.message)) {
      console.log(`    ✗ ${t} (post_id): ${error.message}`);
    } else {
      console.log(`    ✓ ${t} (post_id): ${count ?? 0} rows`);
    }
  }

  if (DRY_RUN) {
    console.log(`    [dry] would delete from uploads where user_id=${userId}`);
  } else {
    const { error, count } = await sb
      .from('uploads')
      .delete({ count: 'exact' })
      .eq('user_id', userId);
    if (error) console.log(`    ✗ uploads: ${error.message}`);
    else console.log(`    ✓ uploads: ${count ?? 0} rows`);
  }
}

async function deleteBot(username) {
  console.log(`\n━━━ ${username} ━━━`);
  const bot = await findBot(username);
  if (!bot) {
    console.log(`  ⚠️  no public.users row for "${username}". Looking up auth.users by email...`);
    const email = `bot-${username}@dreambot.app`;
    const { data: page } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = (page?.users || []).find((u) => u.email === email);
    if (!found) {
      console.log('  no match anywhere. skipping.');
      return;
    }
    if (DRY_RUN) {
      console.log(`  [dry] would delete auth.users id=${found.id}`);
    } else {
      const { error } = await sb.auth.admin.deleteUser(found.id);
      console.log(`  auth.users: ${error ? '✗ ' + error.message : '✓ deleted'}`);
    }
    return;
  }

  console.log(`  user_id: ${bot.id}`);
  const counts = {
    uploads: await countTable('uploads', 'user_id', bot.id),
    bot_seeds: 0,
    follows_actor: await countTable('follows', 'follower_id', bot.id),
    follows_target: await countTable('follows', 'following_id', bot.id),
    friendships_a: await countTable('friendships', 'user1_id', bot.id),
    friendships_b: await countTable('friendships', 'user2_id', bot.id),
    notifications_actor: await countTable('notifications', 'actor_id', bot.id),
    notifications_recipient: await countTable('notifications', 'recipient_id', bot.id),
  };
  // bot_seeds is keyed by category prefix, not user_id
  const { count: seedCount } = await sb
    .from('bot_seeds')
    .select('*', { count: 'exact', head: true })
    .like('category', `${username.toLowerCase()}_%`);
  counts.bot_seeds = seedCount ?? 0;

  console.log('  preview:', counts);

  console.log('  deleting uploads + child rows...');
  await deleteUploadsAndChildren(bot.id);

  console.log('  deleting peripheral...');
  if (DRY_RUN) {
    console.log(`    [dry] would delete bot_seeds where category like '${username.toLowerCase()}_%'`);
  } else {
    const { error, count } = await sb
      .from('bot_seeds')
      .delete({ count: 'exact' })
      .like('category', `${username.toLowerCase()}_%`);
    console.log(`    ${error ? '✗' : '✓'} bot_seeds: ${count ?? 0}${error ? ' ' + error.message : ''}`);
  }

  await deleteByColumn('follows', 'follower_id', bot.id, 'follows (as follower)');
  await deleteByColumn('follows', 'following_id', bot.id, 'follows (as target)');
  await deleteByColumn('friendships', 'user1_id', bot.id, 'friendships (a)');
  await deleteByColumn('friendships', 'user2_id', bot.id, 'friendships (b)');
  await deleteByColumn('notifications', 'actor_id', bot.id, 'notifications (actor)');
  await deleteByColumn('notifications', 'recipient_id', bot.id, 'notifications (recipient)');
  await deleteByColumn('user_recipes', 'user_id', bot.id, 'user_recipes');

  console.log('  deleting public.users...');
  if (DRY_RUN) {
    console.log(`    [dry] would delete users where id=${bot.id}`);
  } else {
    const { error } = await sb.from('users').delete().eq('id', bot.id);
    console.log(`    ${error ? '✗ ' + error.message : '✓ users'}`);
  }

  console.log('  deleting auth.users...');
  if (DRY_RUN) {
    console.log(`    [dry] would delete auth.users id=${bot.id}`);
  } else {
    const { error } = await sb.auth.admin.deleteUser(bot.id);
    console.log(`    ${error ? '✗ ' + error.message : '✓ auth.users'}`);
  }
}

(async () => {
  console.log(`mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`targets: ${targets.join(', ')}`);
  for (const t of targets) {
    try {
      await deleteBot(t);
    } catch (e) {
      console.log(`  ✗ ${t}: ${e.message}`);
    }
  }
  console.log('\ndone.');
})();
