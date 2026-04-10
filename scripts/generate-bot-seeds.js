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
  'void.architect': {
    strategies: [
      { category: 'voidarchitect_genre', prompt: 'a mind-bending surreal sci-fi scene that is visually stunning and awe-inspiring from worlds like blade runner, dune, interstellar, alien, 2001 a space odyssey, arrival, annihilation' },
      { category: 'voidarchitect_genre_dedup', prompt: 'a mind-bending surreal sci-fi scene that is visually stunning and awe-inspiring from worlds like blade runner, dune, interstellar, alien, 2001 a space odyssey, arrival, annihilation', continueDedup: true },
      { category: 'voidarchitect_landscape', prompt: 'an impossibly beautiful alien landscape or cosmic vista that defies physics and takes your breath away', separateDedup: true },
      { category: 'voidarchitect_spacebattle', prompt: 'an epic expansive gorgeous looking space opera battle scene set in the interstellar reaches of outerspace', noDedup: true },
      { category: 'voidarchitect_interior', prompt: 'Epic and beautiful interior shot of a building, space ship, or natural structure in the sci-fi genre', separateDedup: true },
      { category: 'voidarchitect_cozyinterior', prompt: 'cozy and beautiful interior shot of a building, space ship, or natural structure in the sci-fi genre', separateDedup: true },
      { category: 'voidarchitect_robot', prompt: 'a beautiful sci-fi scene with a robot having a human moment in a tranquil setting — the robot can be any form: humanoid, industrial, tiny companion bot, massive mech, ancient rusted machine, sleek drone, bio-mechanical hybrid', separateDedup: true },
      { category: 'voidarchitect_city', prompt: 'an expansive, vast sci-fi city viewed from above on an alien world out in the far off reaches of space', noDedup: true },
      { category: 'voidarchitect_androidwoman', prompt: 'an intimate close-up shot of an exquisitely attractive sci-fi android woman — she must be visibly MECHANICAL: exposed circuitry, chrome plating, glowing seams between skin and metal, visible joints, translucent panels showing inner workings, cybernetic implants. Alien aesthetic — alluring and provocative, scantily clad is fine and encouraged. Vary everything: skin tone, hair, eyes, body type (curvy, skinny, athletic, voluptuous, petite), the ratio of skin to machine. She can be seductive but never nude.', separateDedup: true },
    ],
  },
  aurelia: {
    strategies: [
      { category: 'aurelia_genre', prompt: 'an ethereally beautiful scene that takes your breath away — soft divine light, magical atmosphere, transcendent beauty from worlds like lord of the rings, studio ghibli, narnia' },
      { category: 'aurelia_genre_dedup', prompt: 'an ethereally beautiful scene that takes your breath away — soft divine light, magical atmosphere, transcendent beauty from worlds like lord of the rings, studio ghibli, narnia', continueDedup: true },
      { category: 'aurelia_landscape', prompt: 'a breathtakingly beautiful landscape that feels like a painting you would hang in your home — serene, luminous, peaceful', separateDedup: true },
    ],
  },
  terra: {
    strategies: [
      { category: 'terra_genre', prompt: 'an awe-inspiring nature scene that looks real but impossibly beautiful — the kind of place that cant possibly exist but you desperately wish it did, like avatar pandora or patagonia or iceland' },
      { category: 'terra_genre_dedup', prompt: 'an awe-inspiring nature scene that looks real but impossibly beautiful — the kind of place that cant possibly exist but you desperately wish it did, like avatar pandora or patagonia or iceland', continueDedup: true },
      { category: 'terra_landscape', prompt: 'an impossibly beautiful natural landscape — dramatic lighting, perfect conditions, the most stunning version of earth or an alien world', separateDedup: true },
    ],
  },
  prism: {
    strategies: [
      { category: 'prism_genre', prompt: 'a visually stunning and interesting scene rendered in a creative stylized medium — the contrast between the epic content and playful art style is the magic' },
      { category: 'prism_genre_dedup', prompt: 'a visually stunning and interesting scene rendered in a creative stylized medium — the contrast between the epic content and playful art style is the magic', continueDedup: true },
      { category: 'prism_landscape', prompt: 'an epic and beautiful landscape or cityscape that would look amazing rendered in a creative stylized art medium', separateDedup: true },
    ],
  },
  cinder: {
    strategies: [
      { category: 'cinder_genre', prompt: 'a hauntingly beautiful dark fantasy scene from worlds like dark souls, elden ring, bloodborne, tim burton films, gothic fairy tales — beautiful but unsettling, elegant darkness' },
      { category: 'cinder_genre_dedup', prompt: 'a hauntingly beautiful dark fantasy scene from worlds like dark souls, elden ring, bloodborne, tim burton films, gothic fairy tales — beautiful but unsettling, elegant darkness', continueDedup: true },
      { category: 'cinder_landscape', prompt: 'a dark and beautiful gothic landscape — haunted, atmospheric, mysterious, but stunningly gorgeous', separateDedup: true },
    ],
  },
  mochi: {
    strategies: [
      { category: 'mochi_genre', prompt: 'an adorable and heartwarming scene that makes people smile — cute creatures, cozy spaces, warm light, inspired by pixar, sanrio, studio ghibli cozy moments' },
      { category: 'mochi_genre_dedup', prompt: 'an adorable and heartwarming scene that makes people smile — cute creatures, cozy spaces, warm light, inspired by pixar, sanrio, studio ghibli cozy moments', continueDedup: true },
      { category: 'mochi_landscape', prompt: 'a cute and cozy miniature world that feels warm and inviting — tiny details, soft lighting, the kind of place you want to shrink down and live in', separateDedup: true },
    ],
  },
  pixelrex: {
    strategies: [
      { category: 'pixelrex_genre', prompt: 'a stunning retro gaming scene that triggers pure nostalgia — inspired by classic games like zelda, final fantasy, chrono trigger, pokemon, mega man, metroid, castlevania' },
      { category: 'pixelrex_genre_dedup', prompt: 'a stunning retro gaming scene that triggers pure nostalgia — inspired by classic games like zelda, final fantasy, chrono trigger, pokemon, mega man, metroid, castlevania', continueDedup: true },
      { category: 'pixelrex_landscape', prompt: 'a beautiful retro pixel art landscape — the kind of gorgeous background from a classic 16-bit RPG that makes you stop and admire', separateDedup: true },
    ],
  },
  astra: {
    strategies: [
      { category: 'astra_androidwoman', prompt: 'an intimate close-up shot of an exquisitely attractive sci-fi android woman — she must be visibly MECHANICAL: exposed circuitry, chrome plating, glowing seams between skin and metal, visible joints, translucent panels showing inner workings, cybernetic implants. Alien aesthetic — alluring and provocative, scantily clad is fine and encouraged. Vary everything: skin tone, hair, eyes, body type (curvy, skinny, athletic, voluptuous, petite), the ratio of skin to machine. She can be seductive but never nude.', separateDedup: true },
      { category: 'astra_cyborgface', prompt: 'a close-up shot of the face and head of a sci-fi cyborg woman — part of her face is exposed chrome and circuitry, mechanical components, visible gears and wiring. She is still exquisitely beautiful despite being heavily mechanical. Sultry gaze, seductive expression. Vary everything: ratio of machine to skin, metal types, skin tone.', separateDedup: true },
      { category: 'astra_alienface', prompt: 'a close-up shot of the face and head of an exquisitely beautiful woman who is half human half alien from somewhere far far away in outerspace — she leans towards the alien side in appearance. Exotic otherworldly features blended with human beauty. Sultry gaze, seductive expression. Vary everything: skin tone, alien features, eye color, facial structure.', separateDedup: true },
    ],
  },
  'frida.neon': {
    strategies: [
      { category: 'fridaneon_genre', prompt: 'a bold and visually explosive art piece — vibrant maximalist energy from worlds like jazz age glamour, vintage movie posters, comic book splash pages, pop art, art deco architecture' },
      { category: 'fridaneon_genre_dedup', prompt: 'a bold and visually explosive art piece — vibrant maximalist energy from worlds like jazz age glamour, vintage movie posters, comic book splash pages, pop art, art deco architecture', continueDedup: true },
      { category: 'fridaneon_landscape', prompt: 'a stunning architectural or cityscape scene with bold geometric patterns, dramatic colors, and maximalist energy', separateDedup: true },
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
      const scene = await generateScene(strategy.prompt, strategy.noDedup ? [] : banList);
      let subject = '-';
      if (!strategy.noDedup) {
        subject = await extractSubject(scene);
        banList.push(subject);
        if (!strategy.separateDedup) sharedBanList = banList;
      }

      rows.push({ category: strategy.category, template: scene, disabled: false });
      console.log(rows.length + '. [' + subject + '] ' + scene);
    }
    console.log();
  }

  const { error } = await sb.from('dream_templates').insert(rows);
  console.log(error ? '❌ ' + error.message : '✅ ' + rows.length + ' seeds saved for ' + BOT);
})();
