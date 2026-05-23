#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_character_role.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} CHARACTER-ROLE entries for a MangaBot ANIME ISEKAI keyframe. Anime isekai archetypes by ROLE only, never named. Painterly cel-shaded anime characters.

Each entry: 12-22 words. ROLE + outfit + anime archetype.

ANIME-ISEKAI ROLE DISTRIBUTION:
- 18% MODERN PROTAGONIST IN FANTASY WORLD (SAO/Tate-no-Yuusha — school-uniform or hoodie or jersey character in fantasy setting)
- 14% ANIME ADVENTURER PARTY (3-4 characters together — hero + mage-girl + warrior + cleric)
- 12% ISEKAI HERO SOLO (Frieren-style heroic mage / Mushoku Tensei-style protagonist in fantasy garb)
- 10% MAGE GIRL (Konosuba-Megumin style explosion-mage in fantasy robes)
- 10% SWORD-GIRL / WARRIOR (anime sword-girl in fantasy armor)
- 8% CLERIC / PRIEST (anime healing-class character in robes)
- 6% DEMON-LORD / VILLAIN (Overlord-style anime villain in dark armor)
- 6% DRAGON-GIRL / BEAST-FOLK (Slime-style anime dragon-loli or beastperson)
- 6% MODERN PROTAGONIST WITH SLIME COMPANION (SAO-style hero with cute fantasy familiar)
- 4% ELF / HALF-ELF (Frieren-style anime long-lived mage in robes)
- 4% NPC ADVENTURER (mid-tier anime adventurer in basic-gear, guild-quest energy)
- 2% GODDESS / DIVINE BEING (anime ethereal goddess figure)

DO write:
- A modern-school-uniform protagonist in anime-cel-shaded SAO-style fantasy world, confused-newcomer expression
- An anime adventurer party of four — sword-girl in light armor, mage-girl with staff, cleric in white robes, and tank-warrior with shield
- A Frieren-style heroic anime mage with long hair and traveling cloak, painterly fantasy register
- A Konosuba-Megumin style anime explosion-mage in pointed fantasy hat and red robes
- An anime sword-girl in cel-shaded fantasy plate armor with longsword at hip
- An anime cleric in white-and-gold healing robes with prayer-staff
- An Overlord-style anime demon-lord in dark fantasy armor with floating magic-circles
- A Slime-style anime dragon-loli in cute fantasy outfit, scales and small horns visible
- A modern hoodie-protagonist with a smiling blue slime companion at the side, SAO-newcomer vibe
- A Frieren-style anime long-lived elf-mage in painterly fantasy robes, gentle expression

DO NOT write:
- Named characters (Kirito / Subaru / Kazuma specifically — describe archetypes)
- Western photoreal medieval characters (bearded Witcher-style gritty)
- Modern earth-civilian dress without fantasy context
- Multiple character groups per entry — ONE focal role

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
