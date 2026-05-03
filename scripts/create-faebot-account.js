#!/usr/bin/env node
/**
 * Create the FaeBot user account.
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/create-faebot-account.js
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
  username: 'FaeBot',
  email: 'bot-faebot@dreambot.app',
  password: `${PREFIX}faebot`,
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

  const vibeProfile = {
    version: 2,
    aesthetics: ['peaceful', 'enchanted', 'ethereal', 'nostalgic', 'whimsical'],
    art_styles: ['illustration', 'watercolor', 'storybook', 'canvas'],
    moods: {
      peaceful_chaotic: 0.1,
      cute_terrifying: 0.05,
      minimal_maximal: 0.5,
      realistic_surreal: 0.6,
    },
    avoid: ['text', 'watermarks', 'words', 'letters', 'signatures', 'humans', 'modern objects'],
    interests: ['nature', 'fantasy', 'magic'],
    personal_anchors: {
      places: ['enchanted forests', 'mossy groves', 'twilit clearings'],
      objects: ['flower crowns', 'glowing pollen', 'dewdrops', 'mossy stones'],
      eras: ['timeless fairytale'],
      dream_vibe: 'peaceful gouache-painted fairy illustration',
    },
    spirit_companion: 'fox',
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
