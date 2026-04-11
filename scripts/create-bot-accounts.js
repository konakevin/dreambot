#!/usr/bin/env node
/**
 * Create 10 bot accounts with vibe profiles tuned to their personas.
 * Each bot gets: auth user → public.users (via trigger) → username update → vibe profile
 *
 * Run: node scripts/create-bot-accounts.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BOTS = [
  // ── Art Accounts (stunning content) ──
  {
    username: 'solaris',
    email: 'bot-solaris@dreambot.app',
    persona: 'Epic fantasy painter. Book covers, throne rooms, dragon riders, warrior queens.',
    art_styles: ['canvas', 'fantasy', 'photography'],
    aesthetics: ['cinematic', 'dark', 'ethereal'],
    moods: { peaceful_chaotic: 0.7, cute_terrifying: 0.6, minimal_maximal: 0.9, realistic_surreal: 0.4 },
  },
  {
    username: 'void.architect',
    email: 'bot-void-architect@dreambot.app',
    persona: 'Surreal sci-fi visionary. Impossible worlds, alien cathedrals, fractal dimensions.',
    art_styles: ['coquette', '3d_render', 'neon'],
    aesthetics: ['dark', 'cinematic', 'psychedelic'],
    moods: { peaceful_chaotic: 0.8, cute_terrifying: 0.7, minimal_maximal: 1.0, realistic_surreal: 1.0 },
  },
  {
    username: 'aurelia',
    email: 'bot-aurelia@dreambot.app',
    persona: 'Ethereal beauty. Paintings you want to hang on your wall. Bioluminescent gardens, glass lakes, golden hour.',
    art_styles: ['watercolor', 'canvas', 'ghibli'],
    aesthetics: ['dreamy', 'ethereal', 'cozy'],
    moods: { peaceful_chaotic: 0.2, cute_terrifying: 0.2, minimal_maximal: 0.5, realistic_surreal: 0.6 },
  },
  {
    username: 'terra',
    email: 'bot-terra@dreambot.app',
    persona: 'Earth photographer from another dimension. Impossible nature that looks real. Waterfalls, auroras, ice caves, lavender fields.',
    art_styles: ['photography', 'canvas', 'coquette'],
    aesthetics: ['cinematic', 'ethereal', 'dreamy'],
    moods: { peaceful_chaotic: 0.3, cute_terrifying: 0.1, minimal_maximal: 0.7, realistic_surreal: 0.3 },
  },

  // ── Culture & Style Accounts ──
  {
    username: 'yuuki',
    email: 'bot-yuuki@dreambot.app',
    persona: 'Anime obsessed, K-pop stan, Akihabara energy. Magical girls, mecha battles, idol stages, cherry blossom rooftops.',
    art_styles: ['anime', 'ghibli', 'neon'],
    aesthetics: ['cinematic', 'dreamy', 'dark'],
    moods: { peaceful_chaotic: 0.6, cute_terrifying: 0.4, minimal_maximal: 0.8, realistic_surreal: 0.7 },
  },
  {
    username: 'prism',
    email: 'bot-prism@dreambot.app',
    persona: 'Medium explorer. Stunning scenes in every stylized medium — LEGO, pixel art, claymation, paper cutout, embroidery, Tim Burton, retro poster, etc.',
    art_styles: ['lego', 'pixels', 'claymation', 'animation', 'gothic', 'paper_cutout', 'embroidery', 'retro_poster', 'art_deco', 'steampunk', 'vaporwave', '8bit', 'minecraft', 'claymation', 'vinyl', 'disney', 'comics', '3d_render', 'storybook'],
    aesthetics: ['cinematic', 'whimsical', 'dreamy', 'dark', 'cozy'],
    moods: { peaceful_chaotic: 0.5, cute_terrifying: 0.5, minimal_maximal: 0.8, realistic_surreal: 0.7 },
  },
  {
    username: 'cinder',
    email: 'bot-cinder@dreambot.app',
    persona: 'Gothic dark fantasy. Haunted castles, cursed forests, candlelit crypts, dark anime, Tim Burton worlds.',
    art_styles: ['gothic', 'fantasy', 'steampunk', 'anime'],
    aesthetics: ['dark', 'cinematic', 'ethereal'],
    moods: { peaceful_chaotic: 0.7, cute_terrifying: 0.9, minimal_maximal: 0.7, realistic_surreal: 0.8 },
  },
  {
    username: 'mochi',
    email: 'bot-mochi@dreambot.app',
    persona: 'Kawaii cozy maximalist. Tiny bakeries, blanket forts, animal cafes, rainy windows, cute creatures.',
    art_styles: ['animation', 'claymation', 'disney', 'storybook'],
    aesthetics: ['cozy', 'whimsical', 'dreamy'],
    moods: { peaceful_chaotic: 0.1, cute_terrifying: 0.0, minimal_maximal: 0.6, realistic_surreal: 0.5 },
  },
  {
    username: 'pixelrex',
    email: 'bot-pixelrex@dreambot.app',
    persona: 'Retro gamer, arcade kid. Boss battles, neon arcades, glitched worlds, 90s nostalgia.',
    art_styles: ['pixels', '8bit', 'vaporwave'],
    aesthetics: ['retro', 'cinematic', 'dark'],
    moods: { peaceful_chaotic: 0.8, cute_terrifying: 0.5, minimal_maximal: 0.9, realistic_surreal: 0.6 },
  },
  {
    username: 'frida.neon',
    email: 'bot-frida-neon@dreambot.app',
    persona: 'Bold maximalist artist. Explosive color, jazz age glamour, street murals, protest art.',
    art_styles: ['comics', 'retro_poster', 'art_deco'],
    aesthetics: ['psychedelic', 'cinematic', 'dark'],
    moods: { peaceful_chaotic: 0.9, cute_terrifying: 0.5, minimal_maximal: 1.0, realistic_surreal: 0.7 },
  },
];

(async () => {
  const results = [];

  for (const bot of BOTS) {
    console.log(`\n🤖 Creating ${bot.username}...`);

    // 1. Create auth user
    const { data: authData, error: authErr } = await sb.auth.admin.createUser({
      email: bot.email,
      password: 'BotAccount2026!!' + bot.username,
      email_confirm: true,
      user_metadata: { username: bot.username },
    });

    if (authErr) {
      // Might already exist
      if (authErr.message.includes('already')) {
        console.log(`   ⚠️  Auth user exists, looking up...`);
        const { data: existing } = await sb.auth.admin.listUsers();
        const found = existing.users.find((u) => u.email === bot.email);
        if (found) {
          authData = { user: found };
        } else {
          console.error(`   ❌ Can't find existing user:`, authErr.message);
          continue;
        }
      } else {
        console.error(`   ❌ Auth error:`, authErr.message);
        continue;
      }
    }

    const userId = authData.user.id;
    console.log(`   ✅ Auth user: ${userId}`);

    // 2. Update username (trigger may have set a default)
    await sb.from('users').update({ username: bot.username }).eq('id', userId);
    console.log(`   ✅ Username: ${bot.username}`);

    // 3. Create vibe profile
    const vibeProfile = {
      version: 2,
      aesthetics: bot.aesthetics,
      art_styles: bot.art_styles,
      moods: bot.moods,
      avoid: ['text', 'watermarks', 'words', 'letters', 'signatures'],
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
      console.error(`   ❌ Recipe error:`, recipeErr.message);
    } else {
      console.log(`   ✅ Vibe profile saved`);
    }

    // 4. Mark as active for nightly dreams
    await sb
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId);

    results.push({ username: bot.username, userId, email: bot.email, persona: bot.persona });
  }

  console.log('\n\n=== BOT ACCOUNTS CREATED ===\n');
  console.log('| Username | User ID | Persona |');
  console.log('|----------|---------|---------|');
  results.forEach((r) => {
    console.log(`| ${r.username} | ${r.userId.slice(0, 8)}... | ${r.persona.slice(0, 50)} |`);
  });

  console.log('\n✅ Done! All bot accounts ready.');
  console.log('\nNext: run scripts/generate-bot-dreams.js to start generating content.');
})();
