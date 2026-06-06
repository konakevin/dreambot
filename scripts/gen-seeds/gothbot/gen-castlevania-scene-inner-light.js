#!/usr/bin/env node
/**
 * GOTHBOT_CASTLEVANIA_SCENE_INNER_LIGHT — inner-glow sources for
 * GothBot's castlevania-scene path. STRICT Konami-Castlevania canon —
 * Symphony-of-the-Night / Bloodlines / Lords-of-Shadow / Order-of-Ecclesia
 * vibes. Sapphire stained-glass, emerald alchemy-lamps, crimson altar-fire,
 * candle-amber chandeliers, violet spell-light pouring through gothic
 * windows. STRUCTURE-AS-HERO path — this axis fills the structure FROM
 * WITHIN. Color-saturated, painterly, Ayami-Kojima register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_castlevania_scene_inner_light.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} INNER-LIGHT entries for GothBot's castlevania-scene path — the glow SOURCE inside the gothic structure that fills it from within. Each entry is one rich descriptive sentence (25-45 words) naming the LIGHT COLOR + the IN-WORLD LIGHT SOURCE + the way it BLEEDS through the architecture, in STRICT Konami-Castlevania painted-concept-art register.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific COLOR of inner-glow (sapphire / emerald / crimson / amber / violet / cobalt / verdigris / gold-leaf / blood-red / lapis / amethyst — never generic "warm"); (2) names ONE specific IN-WORLD SOURCE (chandeliers / stained-glass / altar-candles / spell-circles / alchemy lamps / scrying orbs / ritual fires / candelabra / arrow-slits flooded with light / tower oil lamps); (3) shows the glow BLEEDING through architectural detail (cracked stone / rose-window tracery / leaded glass / oak doors / arrow-slits / mullions / crenellations). Painted Castlevania-Ayami-Kojima concept-art register. BOLD + LUSH + FULL-COLOR-SATURATED.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Chandelier-amber candlelight pools across vaulted stone, dozens of dripping tapers igniting the nave in molten gold, each flame trembling behind leaded glass like a caged heartbeat within the living cathedral."
"Sapphire stained-glass rose-window filters cold moonlight into cobalt scripture, saints rendered in deep lapis fractured across marble floors, the cathedral transept breathing occult blue through every leaded seam."
"Crimson altar-light bleeds upward from blood-candles arranged in ritual formation, the chapel apse glowing red as a wound, scarlet pooling through iron-latticed windows into the corridor beyond like slow venous flow."
"Emerald alchemy-lamp suspended in the laboratory alcove casts viridian shadow across bubbling retorts, the green radiance seeping beneath the oak door and painting the hallway floor in toxic phosphorescent ribbons."
"Violet spell-light erupts from a summoning circle carved into library flagstones, the arcane glow pulsing through rose-window tracery above, amethyst geometry thrown across bookshelves in rhythmic magical breaths."

━━━ VARIETY MANDATE (distribute across these color families) ━━━
- ~5 AMBER / GOLD (chandelier candlelight, sconces, oil-lamp gold, gold-leaf reflection, harvest-amber fires)
- ~4 SAPPHIRE / COBALT (stained-glass blue, moonlight through cobalt windows, scrying-orb azure, lapis spell-light, twilight pouring through cathedral glass)
- ~4 CRIMSON / BLOOD-RED (altar-fire, blood-candles, ritual flame, ruby-stained windows, scarlet apse glow)
- ~4 EMERALD / VERDIGRIS (alchemy-lamps, witch-fire green, jade glass, copper-verdigris flame, viridian potion light)
- ~3 VIOLET / AMETHYST (spell-circles, necromantic glow, amethyst spell-light, plum-magical fire)
- ~3 SAPPHIRE-GREEN HYBRIDS / TEAL (stained-glass teal, witch-fire turquoise)
- ~2 GOLD-LEAF / METALLIC (rose-window gold-leaf saturation, brass-mirror reflections)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 25-45 words per entry.
- One rich descriptive sentence — no labels, no lists, no bullet points.
- MUST name (a) specific color of light, (b) specific in-world source, (c) how it bleeds through the architecture.
- BOLD saturated color words ONLY — no "warm white" / "soft glow" / "gentle light".

━━━ BANS ━━━
- NO modern light sources (no neon, no LED, no fluorescent, no spotlight).
- NO photographic register ("backlit", "HDR", "tack-sharp").
- NO Bloodborne-coded grit (Castlevania is PAINTED + jewel-saturated, not grimy).
- NO Hammer-horror cheese (no obvious "haunted house" cliches).
- NO characters — this is the STRUCTURE'S inner light, not a candle held by anyone.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
