#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_light_quality.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHT-QUALITY entries for a MangaBot ANIME ISEKAI keyframe. Anime fantasy palette — saturated cel-shaded register. NOT Western photoreal medieval.

Each entry: 10-20 words. ONE anime-isekai light source with direction + color + warmth.

ANIME ISEKAI LIGHT VARIETY:
- SATURATED ANIME SUNSET (Konosuba-Frieren amber-orange dramatic sky)
- COZY TAVERN AMBER (warm-tungsten anime tavern hearth-glow)
- DAWN-RIM PINK-GOLD (anime dawn horizontal warm-light)
- MAGIC-CIRCLE GLOW (cyan/purple/gold magical light from spell-circle)
- DUNGEON TORCHLIGHT (anime dungeon-torch warm-flicker)
- DRAGON-FIRE WARM (anime dragon-breath dramatic warm light)
- HEALING-MAGIC GREEN (anime green-gold cleric heal-glow)
- FROST-MAGIC COOL-BLUE (anime ice-magic cool-cyan)
- DEMON-LORD PURPLE (anime villain dark-purple cast)
- FAIRY-MOTE GOLD (anime gold-sparkle ambient)
- SPIRIT-WORLD ETHEREAL (anime ghost-world soft-white glow)
- MAGIC-TOWER INTERIOR (warm anime library candlelight)
- STAR-STRUCK FANTASY (anime stars-burst light)
- THUNDER-MAGIC FLASH (anime electric-spell white-flash)
- SKY-CASTLE BACKLIGHT (anime sky-realm sun-shaft)
- COZY-INN HEARTH (warm anime inn-fire ambient)
- GODDESS-SHRINE HOLY-GOLD (anime divine gold-rays)
- TWILIGHT BLUE-VIOLET (anime twilight cool-warm dusk)
- AKIRA-STYLE EXPLOSION FLASH (catastrophic anime burst)
- MOONLIT FANTASY-NIGHT (anime moonlight cool-silver wash)

DO write:
- Saturated anime sunset, Konosuba-Frieren amber-orange dramatic sky with painterly cloud-brushwork
- Warm-tungsten anime tavern hearth-glow casting cozy amber on faces and beams
- Anime dawn-rim pink-and-gold horizontal warm-light raking across the fantasy landscape
- Magic-circle cyan-and-purple glow from spell-cast, ambient mana-light on the scene
- Anime dungeon-torchlight warm-flicker with deep shadows pooling on stone walls
- Anime dragon-fire warm dramatic light from the creature's mid-breath
- Anime green-and-gold healing-magic glow surrounding the cleric, warm divine wash
- Anime cool-cyan frost-magic light with ice-crystal reflections
- Anime dark-purple demon-villain cast, ominous up-light register
- Anime gold-sparkle ambient from fairy-motes drifting through scene

DO NOT write:
- Western photoreal lighting tech
- Multiple lights per entry — ONE dominant
- Cyberpunk neon dominant palette
- Muted military / gritty palette

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
