/**
 * FaeBot tiny-fae path — declarative axis-system form (2026-05-21).
 *
 * THE SOUL OF THE PATH:
 *   PALM-SIZED winged fae (3-8 inches tall) at MACRO perspective in
 *   the enchanted forest. The defining mandate: every render INCLUDES
 *   a normal-sized forest creature (fox / robin / hedgehog / squirrel
 *   / fawn / beetle / hummingbird) that DWARFS her — the scale-proof
 *   companion is what makes "tiny" read. Without it, Flux defaults to
 *   regular-sized fairy.
 *
 * PAINTERLY-REAL REGISTER:
 *   Brian Froud + Charles Vess + painted-fantasy-novel-cover lineage.
 *   NEVER chibi, NEVER anime, NEVER Disney, NEVER Tinkerbell, NEVER
 *   mascot. Slender beautiful elegant proportions.
 *
 * WORLD-AT-HER-SCALE:
 *   The forest is rendered FROM her perspective — dewdrop = her cup,
 *   moss = her cushion, fern-frond = giant overhead, mushroom-cap =
 *   her throne, acorn = her stool, robin = her mount.
 *
 * 10 AXES (9 always-on + 1 gated botanical_accent):
 *   - creature (palm-sized fae, stacked exotic features + wings)
 *   - scale_anchor_companion (THE PATH IDENTITY — normal-sized
 *     forest creature that dwarfs her)
 *   - macro_perch (what she's on/in/riding)
 *   - forest_micro_biome (macro-perspective forest setting)
 *   - lighting (time + light drama)
 *   - weather (air + drifting accents)
 *   - fae_action (captured moment + composition at her scale)
 *   - magical_flavor (pollen / fireflies / glowing-seed at her scale)
 *   - foreground_anchor (closest macro depth element)
 *   - botanical_accent (40%-gated) — secondary bloom species cluster
 */

module.exports = {
  archetype: 'FAEBOT_TINY_FAE',
  pools: {
    creature: 'FAEBOT_TINY_FAE_CREATURE',
    scale_anchor_companion: 'FAEBOT_TINY_FAE_SCALE_ANCHOR_COMPANION',
    macro_perch: 'FAEBOT_TINY_FAE_MACRO_PERCH',
    forest_micro_biome: 'FAEBOT_TINY_FAE_FOREST_MICRO_BIOME',
    lighting: 'FAEBOT_TINY_FAE_LIGHTING',
    weather: 'FAEBOT_TINY_FAE_WEATHER',
    fae_action: 'FAEBOT_TINY_FAE_ACTION',
    magical_flavor: 'FAEBOT_TINY_FAE_MAGICAL_FLAVOR',
    foreground_anchor: 'FAEBOT_TINY_FAE_FOREGROUND_ANCHOR',
    botanical_accent: 'FAEBOT_TINY_FAE_BOTANICAL_ACCENT',
  },
};
