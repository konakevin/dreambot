#!/usr/bin/env node
/**
 * Create the RetroBot user account.
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/create-retrobot-account.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BOT = {
  username: 'RetroBot',
  email: 'bot-retrobot@dreambot.app',
  password: 'BotAccount2026!!retrobot',
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
      last_active_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (userErr) {
    console.error('   user update error:', userErr.message);
  } else {
    console.log('   username set');
  }

  const vibeProfile = {
    version: 2,
    aesthetics: ['cinematic', 'nostalgic', 'cozy', 'dreamy'],
    art_styles: ['photography', 'canvas', 'watercolor', 'illustration', 'pencil'],
    moods: {
      peaceful_chaotic: 0.3,
      cute_terrifying: 0.1,
      minimal_maximal: 0.7,
      realistic_surreal: 0.3,
    },
    avoid: ['text', 'watermarks', 'words', 'letters', 'signatures', 'people', 'faces', 'hands'],
    dream_cast: [],
    dream_seeds: { characters: [], places: [], things: [] },
  };

  const { error: recipeErr } = await sb.from('user_recipes').upsert(
    {
      user_id: userId,
      recipe: vibeProfile,
      onboarding_completed: true,
      ai_enabled: true,
    },
    { onConflict: 'user_id' }
  );

  if (recipeErr) {
    console.error('   recipe error:', recipeErr.message);
  } else {
    console.log('   vibe profile saved');
  }

  console.log(`\ndone. retrobot user id: ${userId}`);
})();
