#!/usr/bin/env node
/**
 * Create the FarmBot user account — a SECRET bot in development, visible
 * ONLY to the supreme admin (Kevin) until it's ready to go live.
 *
 * FarmBot is is_public=false: the uploads RLS (migration 116) makes a private
 * account's posts readable ONLY by its followers, and get_feed only surfaces
 * them to followers. The ONLY follower is the supreme admin, seeded here.
 * Do NOT flip is_public=true and do NOT add follows rows for anyone else
 * until FarmBot is ready to actually launch (see the generalized "secret bot"
 * recipe in BOT_SCENE_QUALITY_PLAYBOOK.md for the full go-live checklist).
 *
 * No bot_schedules row on purpose: the dispatcher never selects a bot with no
 * schedule row, so it can never auto-post while secret (and the
 * never-posted-6h auto-deactivation guard can't touch it either). FarmBot
 * renders only via iter-bot/run-bot with explicit --bot farmbot.
 *
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/create-farmbot-account.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PREFIX = process.env.BOT_PASSWORD_PREFIX;
if (!PREFIX) {
  console.error('ERROR: BOT_PASSWORD_PREFIX missing from .env.local');
  process.exit(1);
}

// lib/superAdmin.ts SUPREME_ADMIN_USER_ID — the one and only follower while secret.
const SUPREME_ADMIN_USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const BOT = {
  username: 'FarmBot',
  email: 'bot-farmbot@dreambot.app',
  password: `${PREFIX}farmbot`,
  bio: 'Cozy farm life, one dream at a time.',
};

(async () => {
  console.log(`Creating ${BOT.username}...`);

  let userId;
  const { data: authData, error: authErr } = await sb.auth.admin.createUser({
    email: BOT.email,
    password: BOT.password,
    email_confirm: true,
    user_metadata: { username: BOT.username },
  });

  if (authErr) {
    if (authErr.message.includes('already')) {
      console.log('   auth user exists, looking up...');
      const { data: existing } = await sb.auth.admin.listUsers();
      const found = existing.users.find((u) => u.email === BOT.email);
      if (!found) {
        console.error('   cannot find existing user:', authErr.message);
        process.exit(1);
      }
      userId = found.id;
    } else {
      console.error('   auth error:', authErr.message);
      process.exit(1);
    }
  } else {
    userId = authData.user.id;
  }
  console.log(`   auth user: ${userId}`);

  const { error: userErr } = await sb
    .from('users')
    .update({
      username: BOT.username,
      is_bot: true,
      is_public: false, // THE privacy flag — followers-only via RLS. Flip only at go-live.
      bio: BOT.bio,
      last_active_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (userErr) console.error('   user update error:', userErr.message);
  else console.log('   users row set (is_bot=true, is_public=FALSE)');

  const { error: recipeErr } = await sb.from('user_recipes').upsert(
    {
      user_id: userId,
      recipe: {
        version: 2,
        aesthetics: ['cozy', 'whimsical', 'nostalgic', 'peaceful'],
        art_styles: ['illustration', 'storybook', '3D render', 'anime'],
        moods: {
          peaceful_chaotic: 0.1,
          cute_terrifying: 0.02,
          minimal_maximal: 0.5,
          realistic_surreal: 0.3,
        },
        avoid: ['text', 'watermarks', 'words', 'letters', 'humans', 'scary', 'gritty'],
        interests: ['farm life', 'cozy countryside', 'harvest season'],
        personal_anchors: {
          places: ['the farm stand', 'the red barn', 'the duck pond'],
          objects: ['woven baskets', 'watering cans', 'hand-painted signs'],
          eras: ['timeless countryside'],
          dream_vibe: 'cozy farm-life illustration, chibi and kawaii and anime looks mixed',
        },
        spirit_companion: 'goat',
      },
      onboarding_completed: true,
      ai_enabled: true,
    },
    { onConflict: 'user_id' }
  );

  if (recipeErr) console.error('   user_recipes error:', recipeErr.message);
  else console.log('   vibe profile set');

  // The single follow that grants visibility while FarmBot is secret.
  const { error: followErr } = await sb
    .from('follows')
    .upsert(
      { follower_id: SUPREME_ADMIN_USER_ID, following_id: userId },
      { onConflict: 'follower_id,following_id' }
    );

  if (followErr) console.error('   follow seed error:', followErr.message);
  else console.log('   supreme admin now follows FarmBot');

  console.log(`✅ ${BOT.username} ready (user_id=${userId})`);
})();
