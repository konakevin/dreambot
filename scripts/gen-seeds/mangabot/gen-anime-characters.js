#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_characters.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ANIME CHARACTER descriptions for MangaBot's anime-scene path — characters described BY ROLE only (never named). Mix of modern / traditional / mythic / futuristic. Full anime spectrum.

Each entry: 10-20 words. One specific character archetype with distinguishing visual detail.

━━━ CATEGORIES ━━━
- Modern anime (shoujo-tropes heroine with flowing hair, shounen-tropes young warrior with spiky hair, magical-girl in sailor-style uniform)
- Traditional Japan (ronin with worn katana and weathered haori, geisha in full formal kimono with oiran styling, samurai in lacquered armor, shrine maiden in red-and-white miko robes, Edo-era merchant in yukata)
- Mythological / spirit (kitsune in half-human form with fox ears, yokai with mask, oni warrior with horns and club, tengu with long-nosed mask and wings, yuki-onna spirit-woman in white)
- Futuristic / cyberpunk (cyberpunk street-kid with glowing tattoos, neon-hacker in rain-slick coat, mech pilot in sleek suit, android girl with visible joints)
- Everyday anime (schoolgirl in seifuku sailor uniform, cafe-worker in apron, train-commuter businessman)
- Ghibli-specific archetypes (windswept spirit-girl with short hair, robed forest-guardian youth, old herbalist-grandma with walking stick)
- Demon-Slayer-style hunters (demon-hunter in Taisho-era uniform with haori, sword-wielder in stance)
- Warrior roles (lone ronin in forest, priestess at shrine, monk in saffron robe)
- Shoujo cute (magical-girl in pastel sparkle-dress, school idol in concert outfit)
- Seinen mature (veteran detective in trench coat, weathered mercenary in worn armor)

━━━ RULES ━━━
- BY ROLE ONLY — never named IP characters
- No "Naruto", "Nezuko", "Chihiro", etc.
- Include specific visual detail (hair, clothing, weapon, accessory)
- Modern/traditional/mythic/futuristic mix — spread diversity

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
