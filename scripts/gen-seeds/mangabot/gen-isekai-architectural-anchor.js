#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_architectural_anchor.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} ARCHITECTURAL-ANCHOR entries for a MangaBot ANIME ISEKAI keyframe. Anime-isekai fantasy structures only. NOT Western photoreal medieval.

Each entry: 12-22 words. ONE anime-isekai fantasy structure with painterly detail.

ANIME-ISEKAI STRUCTURE VARIETY:
- Adventurer's guild hall (anime banner-strung wooden building with kanji signage)
- Magic tower (anime spiral fantasy tower with floating runes)
- Royal castle (anime stylized castle with painterly tile-roofs)
- Tavern / inn (anime cozy tavern with warm-amber windows)
- Restaurant of Another World (cozy anime diner with mysterious door)
- Floating sky-castle (anime sky-realm castle on floating island)
- Magic academy building (anime school with bell-tower)
- Demon-lord throne hall (Overlord-style dark anime hall)
- Goddess shrine (anime ethereal stone shrine with floating motes)
- Mage's enchanted shop (anime potion-shop with glowing wares)
- Dragon-perch ruins (ancient anime ruins on cliff)
- Crystal cavern entrance (anime glowing-rune cave-mouth)
- Riverside water-mill (anime painterly mill on stream)
- Wooden adventurer-inn (anime medieval-style inn with banner-pennants)
- Anime-pagoda tower (fantasy version of Japanese pagoda)
- Crystal palace (anime sparkling fantasy palace)
- Forest tree-village (anime elf-village in giant tree branches)
- Underground dwarven workshop (anime dwarf-forge with mana-furnace)
- Floating-bridge village (anime sky-bridge connecting floating islands)
- Library tower (anime infinite-library wizard tower)

DO write:
- Anime adventurer's guild hall with banner-strung wooden building and kanji-mixed signage
- Anime spiral magic tower with floating runes orbiting around its spire
- Anime stylized royal castle with painterly blue tile-roofs and pennant banners
- Anime cozy fantasy tavern with warm-amber windows and tankards-clinking energy
- Restaurant-of-Another-World style cozy diner with a mysterious wooden door, modern signage
- Anime floating sky-castle on a chunk of grass-covered land, waterfalls dripping off the edge
- Anime magic academy with bell-tower and cherry-blossom courtyard
- Overlord-style dark demon-lord throne hall with vaulted ceilings and floating magic-circles
- Anime ethereal stone shrine to a goddess with floating-motes and prayer-flags
- Anime potion-shop with glowing wares in colored bottles, painterly cozy

DO NOT write:
- Western photoreal castle (Witcher / Skyrim / GoT)
- Multiple structures per entry — ONE focal anchor
- Modern earth-civilian buildings
- Gritty desaturated register

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
