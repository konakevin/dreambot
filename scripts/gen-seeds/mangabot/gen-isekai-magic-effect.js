#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_magic_effect.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGIC-EFFECT entries for a MangaBot ANIME ISEKAI keyframe. SIGNATURE anime isekai visual magic — runes, status-windows, mana-glow, summon-circles, level-up effects. RPG-game-coded.

Each entry: 10-22 words. ONE specific anime-isekai magic visual.

ANIME ISEKAI MAGIC VARIETY:
- FLOATING RUNE-CIRCLE (anime magic-circle hovering mid-air with glowing runes)
- STATUS WINDOW UI (Sword Art Online-style floating game-status display with kanji + level numbers)
- MANA-GLOW HAND (character's hand emanating colored mana energy)
- SUMMON-CIRCLE GROUND (large pentagram glowing on floor with anime magic energy)
- LEVEL-UP BURST (anime particle-effect burst with golden light + status-text)
- ENERGY-SWORD GLOW (anime sword with glowing magic-blade)
- FAIRY-LIGHT MOTES (small magical lights floating around character)
- HEALING-CIRCLE WARM (anime cleric's warm green/gold healing-glow)
- EXPLOSION SPELL (Konosuba-Megumin red-and-yellow explosion effect)
- FROST-MAGIC EFFECT (anime ice-shards floating around mage)
- WIND-MAGIC SWIRL (anime wind-swirl with leaves and motion-lines)
- THUNDER-BOLT (anime lightning-strike with cel-shaded electric arcs)
- TIME-MAGIC RIPPLE (anime time-dilation shimmer effect)
- SHIELD-MAGIC BARRIER (anime translucent magic-shield)
- DRAGON-BREATH (anime dragon mid-breath with energy-stream)
- TELEPORT-PORTAL (anime swirling portal-vortex)
- DEMON-MAGIC PURPLE (anime dark-purple villain spell)
- HOLY-MAGIC GOLD (anime divine gold light beams)
- ARROW-OF-LIGHT (anime energy-arrow mid-flight)
- ENCHANTED-BOOK GLOW (anime spellbook with floating runes rising)

DO write:
- Floating anime magic-circle hovering mid-air with glowing kanji-runes and concentric rings
- Sword Art Online-style floating game-status window with kanji labels + HP/MP bars
- Anime mana-glow streaming from character's outstretched palm, cyan-purple energy
- Large anime pentagram summon-circle glowing on the floor with arcane symbols
- Anime level-up particle-burst with golden light and floating LEVEL UP! kanji text
- Anime energy-sword with bright glowing magic-blade trailing motion-blur
- Small fairy-light motes drifting around the character in anime-style sparkle
- Anime warm-green healing-circle glowing around an injured ally
- Konosuba-Megumin style massive red-and-yellow explosion spell with shockwave
- Anime frost-magic ice-shards orbiting the mage in a slow rotation

DO NOT write:
- Western photoreal spell effects (Skyrim / D&D illustration style)
- Multiple effects per entry — ONE focal magic
- Generic "magic" without specifying anime-isekai signature

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
