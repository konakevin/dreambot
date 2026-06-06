#!/usr/bin/env node
/**
 * GOTHBOT_GOTHIC_ARCHITECTURE_INNER_LIGHT — glow source bleeding from
 * within the gothic structure (the exterior shot's "lights are on"
 * effect). Witch-fire green, sapphire necromantic blue, candle-amber
 * flooding arrow-slits, violet spell-light bleeding through cracks.
 * Castlevania / Bloodborne / Crimson-Peak / Berserk register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_gothic_architecture_inner_light.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} INNER-LIGHT entries for GothBot's gothic-architecture path — the colored glow leaking OUT of the gothic structure through windows / cracks / arrow-slits / portals (sister axis to castlevania-scene's inner_light but framed for an EXTERIOR shot). Each entry is one rich descriptive sentence (25-45 words) naming COLOR + IN-WORLD SOURCE + how it bleeds through the architecture's gaps.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific COLOR (witch-fire green, sapphire-necromantic blue, candle-amber, violet-spell, blood-crimson, sickly chartreuse, ghost-silver); (2) names ONE specific IN-WORLD SOURCE (altar fires, alchemy lamps, summoning circles, hundreds of interior candles, scrying orbs, ritual flames, spell-circles); (3) shows it BLEEDING OUT through architectural gaps (rose-window, arrow-slits, oculi, cracked mortar, lancet-windows, cathedral doors flung open). Painted Castlevania / Bloodborne / Crimson-Peak / Berserk register — gothic-EXTERIOR seen FROM OUTSIDE.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Witch-fire green bleeds through cracked cathedral stone, pooling in nave shadows where the altar breathes its cursed emerald pulse."
"Sapphire-necromantic blue seeps from the ossuary's mortared joints, each bone-fitted seam leaking cold cobalt onto the crypt floor below."
"Violet-spell glow pushes through warped chapel shutters, spilling lavender fingers across rain-slicked gargoyle faces in trembling, hungry ribbons."
"Candle-amber warmth floods a tower's arrow-slits from hundreds of interior flames, the whole spire bleeding gold into surrounding darkness."
"Alchemist-gold pours through a rose-window's cracked lead came, transmuting the transept floor into something resembling molten, breathing treasure."

━━━ VARIETY MANDATE (distribute across these color families) ━━━
- ~4 WITCH-FIRE / EMERALD / SICKLY GREEN (cursed altar-fire, alchemy-toxic green)
- ~3 SAPPHIRE / COBALT / NECROMANTIC BLUE (scrying-orb blue, lapis ritual)
- ~3 CANDLE-AMBER / GOLD / WARM-YELLOW (hundreds of candles, oil-lamp gold, sconce gold)
- ~3 VIOLET / AMETHYST / SPELL-PURPLE (summoning-circle violet, arcane plum, magical-circle amethyst)
- ~3 BLOOD-CRIMSON / RUBY-RED / WOUND-SCARLET (altar-fire crimson, blood-candle red, ritual fire scarlet)
- ~2 GHOST-SILVER / PALE-MOONLIGHT-INDOOR (cold silver lamp, moon-stone reflection)
- ~2 SICKLY YELLOW / JAUNDICED / FEVER-AMBER (jaundiced glow, poisonous yellow)
- ~1 BLACK-LIGHT / VOID-DARKNESS (anti-light, light-eating darkness leaking out)
- ~1 PRISMATIC / RAINBOW-FRACTURED (stained-glass refracting prismatic spectrum)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 25-45 words per entry.
- ONE specific color + source + bleed-pattern through architecture.
- Painted Castlevania / Bloodborne register — never modern photoreal night-cinematography.

━━━ BANS ━━━
- NO modern light sources (no LED, no neon, no electric).
- NO interior-only descriptions (this is exterior-shot light bleeding outward).
- NO photographic register ("backlit", "HDR", "tack-sharp").
- NO characters holding the light source — it's structural / ritual.
- NO Hammer-horror cheese.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
