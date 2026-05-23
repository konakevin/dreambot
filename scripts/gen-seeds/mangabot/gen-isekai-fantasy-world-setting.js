#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_fantasy_world_setting.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} FANTASY-WORLD-SETTING entries for a MangaBot ANIME ISEKAI keyframe. Anime-isekai locations only — Sword Art Online / Re:Zero / Konosuba / Overlord / Frieren / Mushoku Tensei canon. NOT Western Witcher/Skyrim.

Each entry: 12-22 words. ONE anime-isekai location with painterly anime detail.

ANIME ISEKAI LOCATIONS:
- Frieren-style cobblestone fantasy town (anime painterly mountain village)
- Adventurer's guild quarter (banner-strung kanji-mixed signage on guild buildings)
- Konosuba-style Axel-town market square (vibrant anime market with fantasy NPCs)
- Magic academy grounds (anime-school courtyard with mage students)
- Floating-island sky-village (anime sky-realm on a chunk of land)
- Restaurant of Another World (anime cozy fantasy diner)
- Forest of magical creatures (anime painterly enchanted woods)
- Dungeon entrance / cave-mouth (anime stylized dungeon, glowing-rune entrance)
- Royal castle courtyard (anime painterly castle with banner-pennants)
- Demon-realm landscape (anime dark-fantasy plain with floating debris)
- Floating mage-tower interior (anime spiral-staircase wizard tower)
- Frieren-style mountain pass (party walking journey through painterly mountains)
- Slime meadow / monster-encounter zone (anime grassland with cute fantasy creatures)
- Riverside fantasy village (anime water-mill town)
- Snow-covered fantasy town (anime winter market with cozy stalls)
- Underground crystal cavern (anime glowing-crystal dungeon)
- Goddess shrine / temple (anime ethereal prayer-shrine with goddess statue)
- Demon-lord throne hall (Overlord-style dark anime throne room)
- Dragon-mountain peak (anime dragon's lair atop snowy peak)
- Magic forest with glowing mushrooms (anime fantasy mushroom-meadow)

DO write:
- Frieren-style cobblestone fantasy town in painterly mountain valley, anime sunset register
- Adventurer's guild quarter with kanji-mixed banner-signage on stone buildings, anime energy
- Konosuba-style Axel-town vibrant market square with fantasy NPCs and Restaurant-of-Another-World vibe
- Magic academy grounds with anime-students in robes crossing courtyard, painterly castle architecture
- Floating-island sky-village on a chunk of grass-covered land, anime sky-realm with airships
- Restaurant of Another World cozy fantasy diner with steam rising from kitchen, anime warm light
- Painterly enchanted forest with magical creatures, dappled anime-style sun-shafts
- Anime stylized dungeon-entrance cave-mouth with glowing-rune circle on the floor
- Royal castle courtyard with banner-pennants whipping in anime saturated sunset light
- Demon-realm landscape with floating dark-debris in deep crimson-purple sky, Overlord anime register

DO NOT write:
- Western photoreal medieval / Witcher village / Skyrim hold
- Gritty desaturated fantasy settings
- Multiple settings per entry
- Generic "fantasy world" without anime-isekai reference

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
