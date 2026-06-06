#!/usr/bin/env node
/**
 * COZY_ARCANE_HEARTH_WARMTH_SOURCE — scale-up 25 → 100.
 *
 * Each entry is ONE specific WARMTH/LIGHT SOURCE for the sanctum,
 * named with: source-noun + position + color-of-light-it-throws + what
 * the light touches. 22-35 words. This axis OWNS the room's primary
 * illumination — the clutter is what the light falls on, the magical
 * signature is what light it doesn't explain.
 *
 * Voice: cinematographer's light-meter prose. Every entry tells the
 * renderer EXACTLY which warm color to bathe the scene in.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_hearth_warmth_source.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HEARTH-WARMTH-SOURCE descriptions for DragonBot's cozy-arcane path. Each entry names ONE primary light source in the wizard's sanctum and the warmth color it throws across the scene. 22-35 words. Third-person, lit-by prose.

━━━ THE SHAPE OF EVERY ENTRY ━━━

"A/An [adjective] [SOURCE-NOUN] [where it sits], [color-of-light verb] [direction] [what it touches and how]."

Four required ingredients in each entry:
1. SOURCE — what's casting the warmth (candelabra / hearth / oil-lantern / candle-tree / brass brazier / dragon-fire / magic-stone / sky-lantern / pipe-ember / chandelier / stove)
2. POSITION — where it sits in the room (on the mantle / above the reading chair / in the hearth alcove / on the side-table / above the central table)
3. COLOR/QUALITY — the SPECIFIC light color (honey-gold / firelight-orange / amber / wisp-blue / candle-yellow / cold-warm turquoise / ruby / cobalt-blue / pearl-white)
4. WHAT IT TOUCHES — what the light falls on (the worn armrests / scattered spell-scrolls / the knotted rug / a fur lap-blanket / cracked spines of the nearest shelf row)

━━━ VARIETY MANDATE — distribute the ${n} entries across these source families ━━━

- ~20% CANDELABRAS / MULTI-ARM CANDLE-OBJECTS (dragon-shaped bronze / wrought-iron 9-arm / silver three-arm / cascading-wax centerpiece / 12-tier candle-tree)
- ~15% HEARTHS / FIREPLACES (open brick hearth with embers / cavernous stone hearth / dragon-fire teal-flame hearth / hearth alcove with glowing coals / iron stove glowing through grate)
- ~10% OIL LANTERNS / HANGING LAMPS (brass oil-lantern with amber flame / hanging chandelier of small oil lamps / ceramic floor-lamp with rune-shade / hanging copper-filigree sky-lantern)
- ~10% MAGIC-STONES / MAGIC LIGHT-SOURCES (pulsing magic-stone in iron cradle / wisp-orbs orbiting near ceiling / blue magical flame in tabletop lantern / glowing rune-cluster mounted on wall)
- ~10% BRAZIERS / COAL VESSELS (bronze brazier with herb-steam / iron brazier with glowing coals / portable brass brazier on tripod / coal-cauldron with magical embers)
- ~10% INDIVIDUAL CANDLES / DESK-LAMPS (small brass desk-lamp / silver three-arm candelabra on corner desk / floating candle-flames at eye-height / single tall taper on the manuscript)
- ~10% WINDOW-LIGHT (slanted afternoon sun through stained-glass / amber dusk through round leaded-glass / moonlight through frost-pale window / morning gold through deep-set arrow-slit / storm-blue light through tall arched window)
- ~10% MISC MAGICAL / EXOTIC (dragon-fire mantel-flame / floating candle-flames in midair / pulsing magic-stone on mantelpiece / dragon-fang lit-tip torch / glowing-coral-fungus sconce mounted on a beam)
- ~5% UNUSUAL EMBERS (smoldering pipe on a carved stand throwing firelight-orange thread of haze / hookah-coal at the side-table / smoldering incense-tray coal with herb-haze rising)

━━━ COLOR LANGUAGE — what good looks like ━━━

GOOD color phrasings (mirror these — concrete + warm OR cool with named hue):
  • "honey-gold candlelight downward onto scattered spell-scrolls"
  • "firelight-orange warmth across the hearthrug"
  • "amber flame suspended above the reading chair, gilding the worn armrests"
  • "wisp-blue light that catches the silver rims of stacked potion vials"
  • "amber-stenciled warmth across the knotted rug"
  • "cold-warm turquoise shimmer" (dragon-fire)
  • "honey-gold and ruby panels of light" (stained-glass)
  • "candle-yellow rings onto open star-charts"
  • "amber-orange heat that warms the soot-darkened brickwork"
  • "honey-gold lattice-shadow patterns across the cluttered desk-surface"

AVOID: "warm glow" / "soft light" / "ambient warmth" — name the HEX-color-equivalent in words.

━━━ BANS ━━━

- NO cold-only light source as the SOLE warmth source (the path is COZY ARCANE — even magic-stones must read warm-arcane, not surgical-blue cold).
- NO outside-the-room light source (no street lamps / no campfires in the field). This is INTERIOR sanctum warmth only.
- NO modern fixture (no electric bulb / no LED / no neon / no fluorescent). Magical-fantasy light sources only.
- NO inhabitant in the description (no "the wizard's hand silhouetted in the firelight"). The PERSON belongs to other axes. This axis is the LIGHT only.
- NO cathedral-scale source ("vast cathedral chandelier above the great hall"). INTIMATE scale — small room, single primary source.
- NO vague magical language ("a magical light pervades the room"). Name the source-object.
- NO duplicates of the existing 25 entries (helper auto-dedups; just bring fresh sources).

━━━ MOOD ━━━

Every entry should make the renderer think: "okay, the scene is bathed in [specific warm color] coming from [specific point]." Cinematographer's clarity. The cozy arcane warmth ALWAYS reads as inviting, not surgical.

━━━ OUTPUT ━━━

JSON array of ${n} strings, 22-35 words each. No preamble. No numbering. Each starts with "A [adjective] [source]..." or "An [adjective] [source]..." or "Slanted/Amber/Moonlight [light-type]..." for window sources.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
