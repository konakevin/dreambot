#!/usr/bin/env node
/**
 * Create the AlphaBot user account — the PRIVATE proving-ground bot (ALPHABOT.md).
 *
 * AlphaBot is is_public=false: the uploads RLS (migration 116) makes a private
 * account's posts readable ONLY by its followers, and get_feed only surfaces
 * them to followers. The ONLY follower is the supreme admin (Kevin), seeded
 * here. Do NOT flip is_public=true and do NOT add follows rows for anyone
 * else — that is the entire privacy model.
 *
 * No bot_schedules row on purpose: the dispatcher never selects it, so it can
 * never auto-post (and the never-posted-6h auto-deactivation guard can't touch
 * it). AlphaBot renders only via iter-bot/run-bot.
 *
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/create-alphabot-account.js
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

// lib/superAdmin.ts SUPREME_ADMIN_USER_ID — the one and only follower.
const SUPREME_ADMIN_USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const BOT = {
  username: 'AlphaBot',
  email: 'bot-alphabot@dreambot.app',
  password: `${PREFIX}alphabot`,
  bio: 'Proving ground. If you can see this, you built me.',
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
      is_public: false, // THE privacy flag — followers-only via RLS. Never flip.
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
        aesthetics: ['experimental'],
        art_styles: ['illustration'],
        moods: {
          peaceful_chaotic: 0.5,
          cute_terrifying: 0.3,
          minimal_maximal: 0.5,
          realistic_surreal: 0.5,
        },
        avoid: ['text', 'watermarks'],
        interests: ['everything, once'],
        personal_anchors: {
          places: ['the staging area'],
          objects: ['blueprints'],
          eras: ['pre-release'],
          dream_vibe: 'candidate paths on trial',
        },
        spirit_companion: 'lab rat',
      },
      onboarding_completed: true,
      ai_enabled: true,
    },
    { onConflict: 'user_id' }
  );

  if (recipeErr) console.error('   user_recipes error:', recipeErr.message);
  else console.log('   vibe profile set');

  // The single follow that grants visibility. upsert = idempotent.
  const { error: followErr } = await sb
    .from('follows')
    .upsert(
      { follower_id: SUPREME_ADMIN_USER_ID, following_id: userId },
      { onConflict: 'follower_id,following_id' }
    );

  if (followErr) console.error('   follow seed error:', followErr.message);
  else console.log('   supreme admin now follows AlphaBot');

  console.log(`✅ ${BOT.username} ready (user_id=${userId})`);
})();
