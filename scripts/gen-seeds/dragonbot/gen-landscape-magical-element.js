#!/usr/bin/env node
/**
 * LANDSCAPE_MAGICAL_ELEMENT — production scale-up to 200.
 *
 * Each entry names ONE specific VISIBLE-MAGIC detail in the landscape
 * frame that adds a "magic exists in this world" cue WITHOUT requiring
 * characters. Floating ruins / runes in the air / ley-line glow /
 * mana-stream / fey-light cluster / glowing waterfall / sky-tear.
 * Always a NAMED element with COLOR + SHAPE + PLACEMENT.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/landscape_magical_element.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MAGICAL-ELEMENT entries for DragonBot's landscape path — each entry names ONE specific VISIBLE-MAGIC detail woven into a high-fantasy landscape. Each entry is one sentence, 18-28 words.

━━━ EVERY ENTRY MUST CONTAIN ALL FOUR ━━━

1. NAMED MAGICAL ELEMENT — a SPECIFIC compound: hovering rune-circle / floating crystal-shards / ley-line glow / inverted waterfall / fey-light cluster / dimensional rift / glowing-leaf canopy / suspended bridge of silver light / mana-stream / etched-glowing glyphs / hovering stone-bridge / aurora-curtain / crystal-cluster eruption / sky-tear / glowing-fissure / wisp-tree / spiraling stones / spring-of-light / floating petals / pulsing root-vein / magical-wind / suspended geode-cluster / leyline-aurora / glowing reflective pool
2. CONCRETE COLOR — name the specific chromatic anchor ("amber" / "violet" / "luminous silver" / "aquamarine" / "rose-pink" / "blue-cyan" / "emerald-green" / "rose-gold" / "pale-gold")
3. SHAPE + MOTION — describe the FORM and ACTIVITY ("rotating slowly" / "suspended in midground formation" / "threading luminous veins" / "rising in a slow vertical helix" / "drifting in a slow spiral" / "pulsing rhythmically" / "hanging low overhead" / "branching outward from a central sigil")
4. PLACEMENT IN FRAME — where in the composition it sits ("above the mossy standing-stones" / "in the midground cliff face" / "through the valley floor" / "at the foreground clearing" / "at the horizon plateau" / "overhead at canopy height" / "across the cliff face" / "at the midground ravine")

━━━ VARIETY MANDATE (distribute roughly across these magic types) ━━━

- 4 RUNE / SIGIL / GLYPH (hovering rune-circle / etched-glowing glyphs / binding-sigil / spell-circle / chalk-rune scaled to landscape)
- 4 LEY-LINE / MANA-STREAM (ley-line glow threading valley / mana-stream pulsing through river / leyline-aurora rising / pulsing root-vein network)
- 4 FLOATING ARCHITECTURE / OBJECTS (hovering stone-bridge / floating crystal-shards / suspended geode-cluster / spiraling stones / floating ruins / inverted-tower / suspended islands at midground)
- 3 INVERTED / IMPOSSIBLE-PHYSICS (inverted waterfall / waterfall falling sideways / river running uphill / sky-pooling water / gravity-broken stream)
- 4 FEY-LIGHT / WISP / ORB (fey-light cluster / wisp-orbs in canopy / lantern-orb host / pixie-light drift / will-o-wisp marsh-cloud)
- 3 RIFT / SKY-TEAR / FISSURE (dimensional rift / sky-tear in cloud cover / glowing-fissure scar / world-crack / void-tear at horizon)
- 4 GLOWING-ORGANIC (glowing-leaf canopy / wisp-tree cluster / glowing reflective pool / luminous-moss patches / phosphorescent-roots exposed)
- 3 GLOWING-WATER / SPRING (spring-of-light / glowing waterfall / luminous river-current / mana-spring / radiant pool)
- 3 CRYSTAL-CLUSTER / GEM-OUTCROP (crystal-cluster eruption / suspended geode / quartz-spires emitting light / gemstone vein in cliff / shard-forest)
- 3 SPELL-RESIDUE / AFTERMATH (spell-residue shimmer / scorched-circle in ground / lingering-cantrip mist / aftermath-glow at clearing)
- 3 AURORA / SKY-RIBBON (aurora-curtain folding / leyline-aurora over plateau / sky-banner of ribbons / magical-wind visible streamers)
- 3 PETAL / SEED-DRIFT (floating petals in spiral / luminous pollen-drift / glowing seed-fall / ember-petal storm)

━━━ EXAMPLE PHRASINGS TO USE ━━━

Format: "A [named magical element] [verb-of-motion] [color/shape], [placement] [extending detail or second-clause descriptor]."

GOOD:
- "A hovering rune-circle rotating slowly above the mossy standing-stones, its carved glyphs pulsing amber against the pale morning sky."
- "An inverted waterfall rising in the midground cliff face, its ascending column glowing aquamarine as mist pools impossibly overhead."
- "A ley-line glow threading luminous silver veins through the valley floor, branching at stone outcroppings like a subterranean river made visible."

━━━ BANS ━━━

- NO characters performing the magic (no wizard casting / no figure summoning) — this is AMBIENT magic in the LAND, no figures
- NO weapons or combat-magic (no fireballs / no battle-spells / no enemy-magic)
- NO generic "magical aura" / "mystical glow" / "supernatural feeling" — must NAME the specific element and give it a COLOR + SHAPE
- NO mood-only entries ("a feeling of ancient magic") — must be VISIBLE in the frame
- NO photographer / film references / no tech-spec adjectives
- NO entries that repeat a previous named element — each entry hero a DIFFERENT magical detail

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
