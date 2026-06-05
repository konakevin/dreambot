#!/usr/bin/env node
/**
 * Create the OceanBot user account + bot_schedules row.
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/create-oceanbot-account.js
 *
 * Ships inactive — iter-bot + run-bot can still target it for manual
 * posts, but the dispatcher won't auto-pick it up until Kevin flips
 * active=true.
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
  username: 'OceanBot',
  email: 'bot-oceanbot@dreambot.app',
  password: `${PREFIX}oceanbot`,
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
    .update({ username: BOT.username, last_active_at: new Date().toISOString() })
    .eq('id', userId);
  if (userErr) console.error('   user update error:', userErr.message);
  else console.log('   username set');

  const vibeProfile = {
    version: 2,
    aesthetics: [
      'cinematic', 'dark', 'peaceful', 'epic', 'nostalgic',
      'ethereal', 'ancient', 'enchanted', 'voltage', 'nightshade',
    ],
    art_styles: ['photography', 'canvas', 'watercolor', 'illustration'],
    moods: {
      peaceful_chaotic: 0.6,
      cute_terrifying: 0.6,
      minimal_maximal: 0.85,
      realistic_surreal: 0.55,
    },
    avoid: ['text', 'watermarks', 'words', 'letters', 'modern hulls', 'mermaids'],
    interests: ['ocean', 'maritime myth', 'shipwrecks', 'painted seascape'],
    personal_anchors: {
      places: ['shipwreck reefs', 'abyssal deeps', 'kelp cathedrals', 'sunken cities', 'polar seas'],
      objects: ['galleon wrecks', 'sea-fans', 'kelp forests', 'ship lanterns', 'phosphorescent plankton'],
      eras: ['age of sail', 'mythic timeless'],
      dream_vibe: 'NatGeo wreck-discovery crossed with age-of-sail maritime tradition',
    },
    spirit_companion: 'whale',
  };

  const { error: recipeErr } = await sb.from('user_recipes').upsert(
    { user_id: userId, recipe: vibeProfile, onboarding_completed: true, ai_enabled: true },
    { onConflict: 'user_id' }
  );
  if (recipeErr) console.error('   user_recipes error:', recipeErr.message);
  else console.log('   vibe profile set');

  const phaseSeed = Math.floor(Math.random() * 2000);
  const { error: schedErr } = await sb.from('bot_schedules').upsert(
    { bot_name: 'oceanbot', posts_per_day: 4, active: false, phase_seed: phaseSeed },
    { onConflict: 'bot_name' }
  );
  if (schedErr) console.error('   bot_schedules error:', schedErr.message);
  else console.log('   bot_schedules row created (active=false)');

  console.log(`✅ ${BOT.username} ready (user_id=${userId})`);
  console.log(`   To activate cron-driven posting later:`);
  console.log(`     UPDATE bot_schedules SET active=true WHERE bot_name='oceanbot';`);
})();
