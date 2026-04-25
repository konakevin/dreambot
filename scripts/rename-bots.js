#!/usr/bin/env node
/**
 * Rename all bot accounts to the new ___Bot naming convention.
 * Also creates 10 new bot accounts and merges pixelrex into arcadebot.
 *
 * Run: node scripts/rename-bots.js
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

// ── Rename mapping: old username → new username ──
const RENAMES = [
  { old: 'solaris', oldVariants: ['Solaris'], newName: 'dragonbot', oldPrefix: 'solaris_', newPrefix: 'dragonbot_' },
  { old: 'yuuki', oldVariants: ['Yuuki'], newName: 'mangabot', oldPrefix: 'yuuki_', newPrefix: 'mangabot_' },
  { old: 'void.architect', oldVariants: [], newName: 'starbot', oldPrefix: 'voidarchitect_', newPrefix: 'starbot_' },
  { old: 'ember', oldVariants: ['Ember'], newName: 'sirenbot', oldPrefix: 'ember_', newPrefix: 'sirenbot_' },
  { old: 'cinder', oldVariants: [], newName: 'gothbot', oldPrefix: 'cinder_', newPrefix: 'gothbot_' },
  { old: 'aurelia', oldVariants: [], newName: 'glowbot', oldPrefix: 'aurelia_', newPrefix: 'glowbot_' },
  { old: 'terra', oldVariants: [], newName: 'earthbot', oldPrefix: 'terra_', newPrefix: 'earthbot_' },
  { old: 'prism', oldVariants: [], newName: 'arcadebot', oldPrefix: 'prism_', newPrefix: 'arcadebot_' },
  { old: 'mochi', oldVariants: [], newName: 'cuddlebot', oldPrefix: 'mochi_', newPrefix: 'cuddlebot_' },
];

// pixelrex merges into arcadebot — rename its templates too
const MERGE_PIXELREX = { old: 'pixelrex', newName: 'arcadebot', oldPrefix: 'pixelrex_', newPrefix: 'arcadebot_' };

// astra gets renamed but has no auth user — handle specially
const ASTRA_RENAME = { old: 'astra', newName: 'venusbot', oldPrefix: 'astra_', newPrefix: 'venusbot_' };

// ── New bot accounts ──
const NEW_BOTS = [
  {
    username: 'coquettebot',
    persona: 'Coquette feminine aesthetic. Pink, bows, lace, pearls, princesses, ballet, roses, soft glam.',
    art_styles: ['watercolor', 'canvas', 'ghibli', 'disney'],
    aesthetics: ['dreamy', 'ethereal', 'cozy'],
    moods: { peaceful_chaotic: 0.1, cute_terrifying: 0.0, minimal_maximal: 0.6, realistic_surreal: 0.5 },
  },
  {
    username: 'safaribot',
    persona: 'Beautiful animals in stunning settings. Wildlife photography meets fine art.',
    art_styles: ['photography', 'canvas', 'watercolor'],
    aesthetics: ['cinematic', 'ethereal', 'dreamy'],
    moods: { peaceful_chaotic: 0.3, cute_terrifying: 0.2, minimal_maximal: 0.7, realistic_surreal: 0.3 },
  },
  {
    username: 'steambot',
    persona: 'Steampunk Victorian sci-fi. Brass clockwork, airships, goggles, impossible steam-powered machines.',
    art_styles: ['steampunk', 'canvas', 'fantasy'],
    aesthetics: ['cinematic', 'dark', 'ethereal'],
    moods: { peaceful_chaotic: 0.6, cute_terrifying: 0.4, minimal_maximal: 0.9, realistic_surreal: 0.6 },
  },
  {
    username: 'tinybot',
    persona: 'Miniatures and dioramas. Tilt-shift tiny worlds, macro lens, everything looks like a model.',
    art_styles: ['photography', 'animation', 'claymation'],
    aesthetics: ['cozy', 'whimsical', 'dreamy'],
    moods: { peaceful_chaotic: 0.2, cute_terrifying: 0.1, minimal_maximal: 0.7, realistic_surreal: 0.5 },
  },
  {
    username: 'hauntbot',
    persona: 'Horror and the unsettling. Eerie, creepy-beautiful, things that make you look twice.',
    art_styles: ['photography', 'canvas', 'coquette'],
    aesthetics: ['dark', 'cinematic', 'ethereal'],
    moods: { peaceful_chaotic: 0.8, cute_terrifying: 1.0, minimal_maximal: 0.6, realistic_surreal: 0.8 },
  },
  {
    username: 'bloombot',
    persona: 'Floral and botanical beauty. Flower arrangements, gardens, botanical art, blooming landscapes.',
    art_styles: ['watercolor', 'canvas', 'photography'],
    aesthetics: ['dreamy', 'ethereal', 'cozy'],
    moods: { peaceful_chaotic: 0.1, cute_terrifying: 0.0, minimal_maximal: 0.5, realistic_surreal: 0.4 },
  },
  {
    username: 'tripbot',
    persona: 'Psychedelic visuals. DMT fractals, kaleidoscope patterns, melting reality, cosmic consciousness.',
    art_styles: ['coquette', 'canvas', 'comics'],
    aesthetics: ['psychedelic', 'cinematic', 'ethereal'],
    moods: { peaceful_chaotic: 1.0, cute_terrifying: 0.5, minimal_maximal: 1.0, realistic_surreal: 1.0 },
  },
  {
    username: 'titanbot',
    persona: 'Mythology and legends. Greek gods, Norse warriors, Egyptian temples, legendary creatures.',
    art_styles: ['canvas', 'fantasy', 'photography'],
    aesthetics: ['cinematic', 'dark', 'ethereal'],
    moods: { peaceful_chaotic: 0.7, cute_terrifying: 0.6, minimal_maximal: 0.9, realistic_surreal: 0.5 },
  },
];

async function renameBot(oldUsername, oldVariants, newUsername, oldPrefix, newPrefix) {
  // Find user by username (try variants too)
  let userId;
  const allNames = [oldUsername, ...oldVariants];
  for (const name of allNames) {
    const { data } = await sb.from('users').select('id').eq('username', name);
    if (data && data.length > 0) {
      userId = data[0].id;
      break;
    }
  }

  if (!userId) {
    console.log(`   ⚠️ No public.users entry for ${oldUsername}, skipping`);
    return;
  }

  // Update username in public.users
  await sb.from('users').update({ username: newUsername }).eq('id', userId);
  console.log(`   ✅ Username: ${oldUsername} → ${newUsername}`);

  // Update auth email
  const oldEmail = `bot-${oldUsername.replace('.', '-')}@dreambot.app`;
  const newEmail = `bot-${newUsername}@dreambot.app`;
  const newPassword = PREFIX + newUsername;
  try {
    await sb.auth.admin.updateUserById(userId, { email: newEmail, password: newPassword });
    console.log(`   ✅ Auth: ${oldEmail} → ${newEmail}`);
  } catch (e) {
    console.log(`   ⚠️ Auth update failed: ${e.message}`);
  }

  // Rename bot_seeds categories
  const { data: templates } = await sb
    .from('bot_seeds')
    .select('id, category')
    .like('category', oldPrefix + '%');

  if (templates && templates.length > 0) {
    let renamed = 0;
    for (const t of templates) {
      const newCategory = t.category.replace(oldPrefix, newPrefix);
      await sb.from('bot_seeds').update({ category: newCategory }).eq('id', t.id);
      renamed++;
    }
    console.log(`   ✅ Templates: ${renamed} categories renamed (${oldPrefix}* → ${newPrefix}*)`);
  } else {
    console.log(`   ℹ️ No templates with prefix ${oldPrefix}`);
  }
}

async function createNewBot(bot) {
  const email = `bot-${bot.username}@dreambot.app`;
  const password = PREFIX + bot.username;

  // Create auth user
  const { data: authData, error: authErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username: bot.username },
  });

  if (authErr) {
    if (authErr.message.includes('already')) {
      console.log(`   ⚠️ Auth user already exists`);
      return;
    }
    console.error(`   ❌ Auth error: ${authErr.message}`);
    return;
  }

  const userId = authData.user.id;

  // Update username (trigger may set default)
  await sb.from('users').update({ username: bot.username }).eq('id', userId);

  // Create vibe profile
  const vibeProfile = {
    version: 2,
    aesthetics: bot.aesthetics,
    art_styles: bot.art_styles,
    moods: bot.moods,
    avoid: ['text', 'watermarks', 'words', 'letters', 'signatures'],
    dream_cast: [],
    dream_seeds: { characters: [], places: [], things: [] },
  };

  await sb.from('user_recipes').upsert(
    { user_id: userId, recipe: vibeProfile, onboarding_completed: true, ai_enabled: true },
    { onConflict: 'user_id' }
  );

  // Mark active
  await sb.from('users').update({ last_active_at: new Date().toISOString() }).eq('id', userId);

  console.log(`   ✅ Created: ${bot.username} (${userId.slice(0, 8)}...)`);
}

(async () => {
  console.log('=== RENAMING EXISTING BOTS ===\n');

  for (const r of RENAMES) {
    console.log(`🔄 ${r.old} → ${r.newName}`);
    await renameBot(r.old, r.oldVariants || [], r.newName, r.oldPrefix, r.newPrefix);
  }

  // Handle astra specially (no auth user)
  console.log(`\n🔄 ${ASTRA_RENAME.old} → ${ASTRA_RENAME.newName} (creating auth user)`);
  const { data: astraUser } = await sb.from('users').select('id').eq('username', 'astra');
  if (astraUser && astraUser.length > 0) {
    const astraId = astraUser[0].id;
    await sb.from('users').update({ username: ASTRA_RENAME.newName }).eq('id', astraId);
    console.log(`   ✅ Username: astra → ${ASTRA_RENAME.newName}`);

    // Create auth user for astra/venusbot
    const { error: authErr } = await sb.auth.admin.createUser({
      id: astraId,
      email: `bot-${ASTRA_RENAME.newName}@dreambot.app`,
      password: PREFIX + ASTRA_RENAME.newName,
      email_confirm: true,
      user_metadata: { username: ASTRA_RENAME.newName },
    });
    if (authErr) {
      console.log(`   ⚠️ Auth: ${authErr.message}`);
    } else {
      console.log(`   ✅ Auth user created for venusbot`);
    }

    // Rename templates
    const { data: templates } = await sb
      .from('bot_seeds')
      .select('id, category')
      .like('category', ASTRA_RENAME.oldPrefix + '%');
    if (templates && templates.length > 0) {
      for (const t of templates) {
        const newCat = t.category.replace(ASTRA_RENAME.oldPrefix, ASTRA_RENAME.newPrefix);
        await sb.from('bot_seeds').update({ category: newCat }).eq('id', t.id);
      }
      console.log(`   ✅ Templates: ${templates.length} renamed`);
    }
  } else {
    console.log(`   ⚠️ No astra user found in public.users`);
  }

  // Merge pixelrex into arcadebot
  console.log(`\n🔀 Merging pixelrex → arcadebot`);
  const { data: pxTemplates } = await sb
    .from('bot_seeds')
    .select('id, category')
    .like('category', MERGE_PIXELREX.oldPrefix + '%');
  if (pxTemplates && pxTemplates.length > 0) {
    for (const t of pxTemplates) {
      const newCat = t.category.replace(MERGE_PIXELREX.oldPrefix, MERGE_PIXELREX.newPrefix);
      await sb.from('bot_seeds').update({ category: newCat }).eq('id', t.id);
    }
    console.log(`   ✅ ${pxTemplates.length} templates renamed`);
  }
  // Disable pixelrex user (don't delete)
  const { data: pxUser } = await sb.from('users').select('id').eq('username', 'pixelrex');
  if (pxUser && pxUser.length > 0) {
    await sb.from('users').update({ username: 'pixelrex_retired' }).eq('id', pxUser[0].id);
    console.log(`   ✅ pixelrex user marked as retired`);
  }

  // Delete nyx (old unused bot)
  console.log(`\n🗑️ Retiring nyx`);
  const { data: nyxUser } = await sb.from('users').select('id').eq('username', 'nyx');
  if (nyxUser && nyxUser.length > 0) {
    await sb.from('users').update({ username: 'nyx_retired' }).eq('id', nyxUser[0].id);
    console.log(`   ✅ nyx marked as retired`);
  }

  console.log('\n=== CREATING NEW BOTS ===\n');

  for (const bot of NEW_BOTS) {
    console.log(`🤖 ${bot.username}`);
    await createNewBot(bot);
  }

  // Final summary
  console.log('\n=== SUMMARY ===');
  const { data: allBots } = await sb
    .from('users')
    .select('username')
    .like('username', '%bot%')
    .order('username');
  if (allBots) {
    console.log(`\n${allBots.length} bot accounts:`);
    allBots.forEach(b => console.log(`  - ${b.username}`));
  }

  console.log('\n✅ Done!');
})();
