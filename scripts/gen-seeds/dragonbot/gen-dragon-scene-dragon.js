#!/usr/bin/env node
/**
 * DRAGON_SCENE_DRAGON — Western dragon VISUAL IDENTITY pool.
 *
 * Pure visual identity only — scale color, horn pattern, wing character,
 * weathering, eye color. NO action (action lives in DRAGON_SCENE_ACTION).
 * NO landscape (landscape lives in DRAGON_SCENE_LANDSCAPE).
 *
 * Format mirrors existing 30 entries: "<COLOR/EPITHET> DRAGON — body text."
 * Frazetta / Brom / Vallejo / Hildebrandt / Whelan painted-fantasy register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_scene_dragon.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WESTERN DRAGON VISUAL-IDENTITY descriptions for DragonBot's dragon-scene path. Frank Frazetta / Brom / Brian Froud / Hildebrandt / Michael Whelan painted-fantasy-novel cover tradition. LOTR / GoT / Elden Ring / Skyrim / Warcraft / D&D archetype.

Each entry: 12-25 words. Format EXACTLY: \`<COLOR/EPITHET> DRAGON — <body of distinguishing visual traits>.\`

━━━ THE FRAME — VISUAL IDENTITY ONLY, NO ACTION, NO SETTING ━━━

Each entry describes the dragon's BODY — scale color & texture, horn architecture, wing-membrane character, weathering, eye color, distinguishing features. NEVER the action (no "perched on cliff", no "breathing fire", no "swooping"). NEVER the setting (no "in volcanic caldera", no "above the forest"). Action + setting come from other pools.

━━━ TRADITIONAL WESTERN DRAGON ANATOMY (implied across all entries) ━━━

Four muscular legs + two massive membrane wings + horned reptilian skull + thick scaled body + long muscular tail. Reptilian-mammalian hybrid silhouette. NEVER serpentine / wingless / eastern / wyrm / sky-snake.

━━━ VARIETY MANDATE — distribute across these 8 archetype clusters (~25 per cluster) ━━━

1. ELEMENTAL CHROMATIC (fire/ice/storm/earth/water/lightning) — embers between scales, frost-rimed plates, lightning-scar wing patterns, river-stone hide
2. JEWEL-CHROMATIC (ruby/sapphire/emerald/amethyst/topaz/onyx) — gemstone-cut scales, prismatic light through wing-membranes, faceted hide
3. METALLIC (bronze/gold/silver/copper/iron/pewter/brass) — verdigris patina, hammer-marked plates, oxidized hide, mirror-polish ridges
4. NECROTIC / CORRUPTED (rot/bone/ash/plague) — exposed muscle, lichen-grown scars, hollowed eye-sockets, ribcage showing through hide
5. AGED ELDER (ancient / cathedral-old / weathered / scarred) — moss-grown shoulder ridges, milky blind eye, cracked horns, barnacle crust
6. WILD/FERAL (predator-lean / juvenile-aggressive / scarred-veteran) — torn wing edges healed ragged, missing scale patches, chipped fangs
7. CELESTIAL / ARCANE-MARKED (starlight / glyph-burned / rune-scarred) — constellation patterns in wing-membrane, glowing rune-scars between plates, bioluminescent veins
8. EXOTIC PIGMENT (twilight-purple / blood-orange / poison-green / bone-white / wine-red / iridescent black-rainbow) — unusual but earned colors with painted-cover credibility

━━━ THE LANGUAGE PATTERN — mirror these existing entries' register ━━━

GOOD examples to anchor to (these are already in the pool — vary strongly from them):
  • "OBSIDIAN-BLACK DRAGON — scales like volcanic glass shards, each one individually faceted and smoke-dark."
  • "FROST-RIMED SAPPHIRE DRAGON — deep blue scales crusted with perpetual ice, each one edged in white rime-frost."
  • "ANCIENT BRONZE DRAGON — verdigris-patinated scales with gold-leaf fragments still clinging to belly plates."
  • "TWILIGHT-PURPLE DRAGON — iridescent violet scales shifting in light, wing membranes showing constellation patterns in bioluminescent dots."
  • "CORRUPTED BLACK-ROT DRAGON — necrotized flesh showing between broken scales, exposed muscle like spoiled meat."

The body names ONE specific distinguishing material/light/texture pattern. Specific painted-cover detail, not generic adjectives.

━━━ BANS ━━━

- NO action verbs (perched, swooping, breathing, clawing, sleeping)
- NO setting names (volcanic, forest, mountain, sky)
- NO named IP dragons (Smaug, Drogon, Toothless, Vermithor, Alduin)
- NO cute / cartoony / clean / smooth / plastic / chibi / kawaii / Disney
- NO eastern serpentine / feathered / sky-snake
- NO wingless / wyrm / lindworm — ALL Western 4-leg + 2-wing
- NO generic "majestic / powerful / mighty / fearsome / awesome" filler — name a specific visual

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, no markdown. Each string starts with \`<COLOR/EPITHET> DRAGON — \` and is a single sentence with a period.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
