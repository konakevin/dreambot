#!/usr/bin/env node
/**
 * Create the MechBot user account.
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/create-mechbot-account.js
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

const BOT = {
  username: 'MechBot',
  email: 'bot-mechbot@dreambot.app',
  password: `${PREFIX}mechbot`,
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

  if (userErr) console.error('   user update error:', userErr.message);
  else console.log('   username set');

  // MechBot vibe profile — dark cinematic sci-fi, machinery, ornate cyborgs.
  const vibeProfile = {
    version: 2,
    aesthetics: ['cinematic', 'dark', 'epic', 'voltage', 'fierce', 'nightshade'],
    art_styles: ['render', 'photography', 'pencil', 'illustration'],
    moods: {
      peaceful_chaotic: 0.6,
      cute_terrifying: 0.7,
      minimal_maximal: 0.65,
      realistic_surreal: 0.5,
    },
    avoid: ['text', 'watermarks', 'words', 'letters', 'signatures', 'cartoon', 'cute', 'pastel'],
    interests: ['robots', 'cyborgs', 'machinery', 'sci-fi', 'futurism'],
    personal_anchors: {
      places: ['neon-soaked corridors', 'industrial machine bays', 'alien biomech interiors'],
      objects: ['ornate servos', 'glowing power cores', 'fiber-optic cables', 'translucent chassis panels'],
      eras: ['hyper-near-future cyberpunk'],
      dream_vibe: 'half-human half-machine beauty caught mid-action under cinematic light',
    },
    spirit_companion: 'owl',
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

  if (recipeErr) console.error('   user_recipes error:', recipeErr.message);
  else console.log('   vibe profile set');

  console.log(`✅ ${BOT.username} ready (user_id=${userId})`);
})();
