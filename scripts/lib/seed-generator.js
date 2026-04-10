/**
 * Shared seed generation logic.
 * Used by both generate-bot-seeds.js (standalone CLI) and
 * generate-bot-dreams.js (inline regen when pool exhausted).
 */

const Anthropic = require('@anthropic-ai/sdk');

// ── Bot seed configurations ──
// Each bot has 3+ strategies with prompt formulas.
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
        continueDedup: true,
      },
      {
        category: 'solaris_landscape',
        prompt: 'an epic fantasy landscape that is exotic and mind blowingly beautiful and interesting to look at',
        separateDedup: true,
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
      { category: 'voidarchitect_androidwoman', prompt: 'an intimate close-up shot of an exquisitely attractive sci-fi android woman — she must be visibly MECHANICAL: exposed circuitry, chrome plating, glowing seams between skin and metal, visible joints, translucent panels showing inner workings, cybernetic implants. Alien aesthetic — alluring and provocative, scantily clad is fine and encouraged. Vary everything: skin tone, hair, eyes, body type (curvy, skinny, athletic, voluptuous, petite), the ratio of skin to machine. She can be seductive but never nude.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the pose, and the unique mechanical feature. Comma separated. Example: bronze, reclining, glowing chest panel' },
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
      { category: 'cinder_genre', prompt: 'a hauntingly beautiful dark fantasy scene from worlds like dark souls, elden ring, bloodborne, tim burton films, gothic fairy tales, castlevania, berserk, sleepy hollow, crimson peak, pan\'s labyrinth — beautiful but unsettling, elegant darkness', extractPrompt: 'From this scene give THREE words: the setting, the character role, and the key prop. Comma separated. Example: ballroom, knight, roses' },
      { category: 'cinder_genre_dedup', prompt: 'a hauntingly beautiful dark fantasy scene from worlds like dark souls, elden ring, bloodborne, tim burton films, gothic fairy tales, castlevania, berserk, sleepy hollow, crimson peak, pan\'s labyrinth — beautiful but unsettling, elegant darkness', continueDedup: true, extractPrompt: 'From this scene give THREE words: the setting, the character role, and the key prop. Comma separated. Example: ballroom, knight, roses' },
      { category: 'cinder_landscape', prompt: 'a dark and beautiful gothic landscape — haunted, atmospheric, mysterious, but stunningly gorgeous. Pure environment, no characters, no people, no figures.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the structure type, the weather, and the light source. Comma separated. Example: bridge, fog, moonlight' },
      { category: 'cinder_horror', prompt: 'Pick ONE: werewolf, vampire, demon, succubus, goblin, banshee, wraith, ghoul, lich, hellhound, wendigo, gargoyle, revenant, specter, chimera, basilisk, manticore, kraken, shade, phantom. Then describe a never-before-seen reimagining of that creature — powerful, terrifying, radiating malice. No blood, no gore, no clowns. Pure darkness and dread. Vary the action: stalking, lunging, perched, crawling, hovering, emerging from shadows, mid-howl, watching from above.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the creature type, the action, and the setting. Comma separated. Example: wendigo, stalking, forest' },
      {
        category: 'cinder_gothwoman', count: 30, separateDedup: true,
        prompt: 'an exquisitely exotic and beautiful goth woman from the bowels of hell. Evil incarnate but so pretty she lures you in with her evil smile only to destroy you. Glowing colored eyes, fangs, sharp claws, dark lipstick, tattoos, piercings, showing lots of skin. Include a unique dark accessory or feature (horns, crown, chains, wings, veil, thorns, serpents, third eye, antlers, halo). She MUST be visibly female. No nipples, never nude, no skeletons. Dynamic pose.',
        extractPrompt: 'From this scene give THREE words: the pose, the eye color, and the unique accessory. Comma separated. Example: lounging, crimson, horns',
      },
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
      { category: 'astra_androidwoman', prompt: 'an intimate close-up shot of an exquisitely attractive sci-fi android woman — she must be visibly MECHANICAL: exposed circuitry, chrome plating, glowing seams between skin and metal, visible joints, translucent panels showing inner workings, cybernetic implants. Alien aesthetic — alluring and provocative, scantily clad is fine and encouraged. Vary everything: skin tone, hair, eyes, body type (curvy, skinny, athletic, voluptuous, petite), the ratio of skin to machine. She can be seductive but never nude.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the pose, and the unique mechanical feature. Comma separated. Example: bronze, reclining, glowing chest panel' },
      { category: 'astra_cyborgface', prompt: 'a close-up shot of the face and head of a sci-fi cyborg woman — part of her face is exposed chrome and circuitry, mechanical components, visible gears and wiring. She is still exquisitely beautiful despite being heavily mechanical. Sultry gaze, seductive expression. Vary everything: ratio of machine to skin, metal types, skin tone.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the eye color, and the unique mechanical feature. Comma separated. Example: pale, neon-blue, exposed jawline gears' },
      { category: 'astra_alienface', prompt: 'a close-up shot of the face and head of an exquisitely beautiful woman who is half human half alien from somewhere far far away in outerspace — she leans towards the alien side in appearance. Exotic otherworldly features blended with human beauty. Sultry gaze, seductive expression. Vary everything: skin tone, alien features, eye color, facial structure.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the eye color, and the unique alien feature. Comma separated. Example: lavender, gold, bioluminescent tendrils' },
    ],
  },
  ember: {
    strategies: [
      { category: 'ember_femalebody', prompt: 'a shot of an exquisitely beautiful and dangerous high fantasy woman — scantily clad is fine and encouraged. Fierce and seductive, dont-fuck-with-me energy. ALWAYS covered enough to avoid nudity but showing skin is great. Vary the race wildly: elf, half-dragon, gnome, dwarf, orc, tiefling, drow, fairy, nymph, centaur, harpy, lamia, succubus, half-giant, goblin princess, merfolk. Ornate flashy details: enchanted armor, magical tattoos, glowing runes, jeweled accessories. Sexy but never nude, never topless.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the pose, and the unique accessory. Comma separated. Example: tiefling, crouching, enchanted gauntlets' },
      { category: 'ember_femaleaction', prompt: 'a shot of an exquisitely beautiful and dangerous high fantasy woman in the heat of action — casting a devastating spell, swinging an enchanted blade, commanding an army, riding a dragon, leaping through battle. Never floating in place, never hovering — always in dynamic motion. Fierce and seductive, scantily clad is fine and encouraged. Ornate flashy details. Vary the race wildly. Sexy but never nude, never topless.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the action, and the weapon/spell. Comma separated. Example: drow, leaping, fire spell' },
      { category: 'ember_femaleface', prompt: 'a close-up shot of the face and head of an exquisitely beautiful high fantasy woman — exotic magical features, glowing eyes, enchanted markings, pointed ears, horns, scales, or ethereal glow. Fierce and seductive expression. Vary everything: race, features, skin tone, magical details.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the eye color, and the unique facial feature. Comma separated. Example: elf, violet, glowing runes' },
      { category: 'ember_malebody', prompt: 'a shot of a powerful and menacing high fantasy warrior — fierce, dangerous, alpha male energy. Battle-scarred, muscular, intimidating. Warlords, dark knights, barbarian kings, demon hunters, dragon slayers, shadow assassins. Ornate flashy details: enchanted weapons, runic war paint, battle armor, glowing eyes. Vary the race wildly: orc, half-dragon, dwarf, tiefling, elf, human, goliath, minotaur, undead knight.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the pose, and the weapon. Comma separated. Example: orc, kneeling, war hammer' },
      { category: 'ember_maleface', prompt: 'a close-up shot of the face and head of a powerful and menacing high fantasy male warrior — battle-scarred, fierce eyes, war paint, enchanted markings, horns, tusks, or glowing runes. Dangerous and intimidating. Vary everything: race, features, skin tone, scars, war paint, facial accessories.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the eye color, and the unique facial feature. Comma separated. Example: minotaur, amber, runic scars' },
      { category: 'ember_maleaction', prompt: 'a shot of a powerful and menacing high fantasy male warrior in the heat of action — always in dynamic motion, never floating. Battle-scarred, muscular, intimidating. Ornate flashy details. Vary the race wildly.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the action, and the weapon. Comma separated. Example: goliath, charging, twin axes' },
      { category: 'ember_seductive', prompt: 'an exquisitely beautiful sexy FEMALE high fantasy woman in a sizzling, provocative pose in an exotic fantasy setting. She is feminine, gorgeous, seductive, mysterious and dangerous. Showing skin, scantily clad. No nipples showing. Fantasy art style makes it feel like mythic fine art. Vary race wildly. No nudity.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the pose, and the setting. Comma separated. Example: nymph, reclining, moonlit pool' },
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

async function generateScene(anthropic, basePrompt, banList) {
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

async function extractSubject(anthropic, scene, extractPrompt) {
  if (extractPrompt) {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 20,
      messages: [{ role: 'user', content: extractPrompt + '\n\n' + scene }],
    });
    return (msg.content[0].text || '').trim().toLowerCase().split(',').map(s => s.trim());
  }
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'One word for main element? ' + scene + '\nONE word.' }],
  });
  return (msg.content[0].text || '').trim().toLowerCase();
}

/**
 * Generate seeds for a bot. Returns rows without touching DB.
 * @param {string} botUsername
 * @param {object} opts - { anthropicApiKey, perStrategy? }
 * @returns {{ rows: Array<{category: string, template: string}> }}
 */
async function generateSeedsForBot(botUsername, { anthropicApiKey, perStrategy = 15 }) {
  const config = BOT_SEEDS[botUsername];
  if (!config) {
    throw new Error('No seed config for bot: ' + botUsername);
  }

  const anthropic = new Anthropic({ apiKey: anthropicApiKey });
  const rows = [];
  let sharedBanList = [];

  for (const strategy of config.strategies) {
    const banList = strategy.separateDedup ? [] : sharedBanList;
    const stratCount = strategy.count || perStrategy;
    console.log(`--- ${stratCount} ${strategy.category} ---`);

    for (let i = 0; i < stratCount; i++) {
      const scene = await generateScene(anthropic, strategy.prompt, strategy.noDedup ? [] : banList);
      let subject = '-';
      if (!strategy.noDedup) {
        const extracted = await extractSubject(anthropic, scene, strategy.extractPrompt);
        if (Array.isArray(extracted)) {
          subject = extracted.join(', ');
          banList.push(...extracted);
        } else {
          subject = extracted;
          banList.push(extracted);
        }
        if (!strategy.separateDedup) sharedBanList = banList;
      }

      rows.push({ category: strategy.category, template: scene });
      console.log(rows.length + '. [' + subject + '] ' + scene);
    }
    console.log();
  }

  return { rows };
}

module.exports = { BOT_SEEDS, generateScene, extractSubject, generateSeedsForBot };
