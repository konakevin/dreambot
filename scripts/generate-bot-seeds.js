#!/usr/bin/env node
/**
 * Generate seed prompts for bot accounts.
 * Uses the iterative dedup passback technique to produce unique seeds.
 *
 * Usage:
 *   node scripts/generate-bot-seeds.js --bot solaris
 *   node scripts/generate-bot-seeds.js --bot yuuki
 *   node scripts/generate-bot-seeds.js --bot solaris --count 20  (per strategy, default 15)
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);

const args = process.argv.slice(2);
const botIdx = args.indexOf('--bot');
const countIdx = args.indexOf('--count');
const BOT = botIdx >= 0 ? args[botIdx + 1] : null;
const PER_STRATEGY = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 15;

if (!BOT) {
  console.error('Usage: node scripts/generate-bot-seeds.js --bot <username>');
  process.exit(1);
}

// ── Bot seed configurations ──
// Each bot has 3-4 strategies with prompt formulas.
// Characters in scenes are described by role/action only — never named,
// never specific appearance details (hair color, etc.) — let the AI choose.

const BOT_SEEDS = {
  solaris: {
    strategies: [
      {
        category: 'solaris_genre',
        prompt: 'an epic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter',
      },
      {
        category: 'solaris_genre_dedup',
        prompt: 'an epic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter',
        continueDedup: true, // continues ban list from previous strategy
      },
      {
        category: 'solaris_landscape',
        prompt: 'an epic fantasy landscape that is exotic and mind blowingly beautiful and interesting to look at',
        separateDedup: true, // uses its own ban list
      },
    ],
  },
  yuuki: {
    strategies: [
      {
        category: 'yuuki_genre',
        prompt: 'an extremely interesting and visually appealing anime scene inspired by worlds like studio ghibli, makoto shinkai, demon slayer, spirited away, evangelion, princess mononoke — characters can naturally exist in the scene described only by their role (a warrior, a girl, a spirit, a creature) never by name or specific appearance. Include creatures, architecture, magical elements as fits.',
      },
      {
        category: 'yuuki_genre_dedup',
        prompt: 'an extremely interesting and visually appealing anime scene inspired by worlds like studio ghibli, makoto shinkai, demon slayer, spirited away, evangelion, princess mononoke — characters can naturally exist in the scene described only by their role (a warrior, a girl, a spirit, a creature) never by name or specific appearance. Include creatures, architecture, magical elements as fits.',
        continueDedup: true,
      },
      {
        category: 'yuuki_landscape',
        prompt: 'a beautiful Japanese anime world that is visually stunning, warm and inviting, interesting to explore. Pure environment, no characters.',
        separateDedup: true,
      },
      {
        category: 'yuuki_cute',
        prompt: 'an adorable heartwarming anime scene inspired by the feeling of totoro, ponyo, kiki — characters exist naturally described only by role (a girl, a spirit, a cat, a creature) never by name or appearance details. Big expressive eyes, warm cozy atmosphere.',
        separateDedup: true,
      },
    ],
  },
};

async function generateScene(basePrompt, banList) {
  const ban = banList.length > 0 ? ' DO NOT include: ' + banList.join(', ') : '';
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 60,
    messages: [
      {
        role: 'user',
        content:
          'Given: "' +
          basePrompt +
          ban +
          '"\nWrite ONE specific scene in 15-25 words. Characters described by role only, never named. Output ONLY the scene.',
      },
    ],
  });
  return (msg.content[0].text || '').replace(/^["]+|["]+$/g, '').trim();
}

async function extractSubject(scene) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'One word for main element? ' + scene + '\nONE word.' }],
  });
  return (msg.content[0].text || '').trim().toLowerCase();
}

(async () => {
  const config = BOT_SEEDS[BOT];
  if (!config) {
    console.error('No seed config for bot: ' + BOT);
    console.error('Available:', Object.keys(BOT_SEEDS).join(', '));
    process.exit(1);
  }

  // Clear existing seeds for this bot
  const prefix = BOT.replace('.', '') + '_';
  await sb.from('dream_templates').delete().like('category', prefix + '%');
  console.log(`Cleared existing ${prefix}* templates\n`);

  const rows = [];
  let sharedBanList = [];

  for (const strategy of config.strategies) {
    const banList = strategy.separateDedup ? [] : sharedBanList;
    console.log(`--- ${PER_STRATEGY} ${strategy.category} ---`);

    for (let i = 0; i < PER_STRATEGY; i++) {
      const scene = await generateScene(strategy.prompt, banList);
      const subject = await extractSubject(scene);
      banList.push(subject);
      if (!strategy.separateDedup) sharedBanList = banList;

      rows.push({ category: strategy.category, template: scene, disabled: false });
      console.log(rows.length + '. [' + subject + '] ' + scene);
    }
    console.log();
  }

  const { error } = await sb.from('dream_templates').insert(rows);
  console.log(error ? '❌ ' + error.message : '✅ ' + rows.length + ' seeds saved for ' + BOT);
})();
