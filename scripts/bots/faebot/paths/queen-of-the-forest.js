/**
 * FaeBot queen-of-the-forest path — declarative axis-system form (2026-05-21).
 *
 * THE SOUL OF THE PATH:
 *   ONE ornate magic fae queen, POSED beautifully in a stunning natural
 *   forest setting (gnarled-root throne in clearing / posed on tree-branch
 *   above stream / standing in wildflower meadow / sitting on mossy boulder
 *   by waterfall / framed in tree-archway / wading in forest stream).
 *
 *   She is the Queen of the Forest — woodland critters FLOCK to her and
 *   pay respects (foxes at her feet, robins on her shoulder, fawns
 *   approaching, butterflies orbiting her crown). Sometimes lesser fae
 *   also gather (60%-gated — small sprites kneeling, pixies offering
 *   blooms).
 *
 *   Pivoted from fairy-court 2026-05-21 — Kevin: "the scenes don't make
 *   sense to me, what even is a fairy court?" Replaces formal-court framing
 *   with Queen-of-the-Forest + creatures-pay-respects vision.
 *
 * DISTINCT from sibling paths:
 *   - forest-fairy-scene: candid creature in action, not posed royalty
 *   - flower-fairy: flower-merged, smaller scale
 *   - tiny-fae: palm-sized
 *   - dryad-portrait: tight close-up
 *   - queen-of-the-forest: REGAL POSED queen in natural setting + critters pay respects
 *
 * 11 AXES (10 always-on + 1 gated lesser_fae):
 *   - queen_features: atomic ornate fae queen stack (one woman, 5+ features)
 *   - posed_setting: LOAD-BEARING — the specific natural forest spot + her pose
 *   - forest_biome: type of forest around her
 *   - regalia: crown / scepter / accessories
 *   - forest_critters: ALWAYS — 3-8 critters flocking to her, paying respects
 *   - lighting: warm-golden / dappled / soft-mist / twilight
 *   - weather: drifting petals / floating pollen / mist / falling leaves
 *   - magical_flavor: her aura
 *   - ambient_detail: wildflowers / lush forest texture / dewdrops / hanging moss
 *   - foreground_anchor: closest depth element
 *   - lesser_fae (60%-gated): 1-3 smaller fae paying respects
 */

module.exports = {
  archetype: 'FAEBOT_QUEEN_OF_THE_FOREST',
  pools: {
    queen_features: 'FAEBOT_QUEEN_OF_FOREST_FEATURES',
    posed_setting: 'FAEBOT_QUEEN_OF_FOREST_POSED_SETTING',
    forest_biome: 'FAEBOT_QUEEN_OF_FOREST_BIOME',
    regalia: 'FAEBOT_QUEEN_OF_FOREST_REGALIA',
    forest_critters: 'FAEBOT_QUEEN_OF_FOREST_CRITTERS',
    lighting: 'FAEBOT_QUEEN_OF_FOREST_LIGHTING',
    weather: 'FAEBOT_QUEEN_OF_FOREST_WEATHER',
    magical_flavor: 'FAEBOT_QUEEN_OF_FOREST_MAGICAL_FLAVOR',
    ambient_detail: 'FAEBOT_QUEEN_OF_FOREST_AMBIENT_DETAIL',
    foreground_anchor: 'FAEBOT_QUEEN_OF_FOREST_FOREGROUND_ANCHOR',
    lesser_fae: 'FAEBOT_QUEEN_OF_FOREST_LESSER_FAE',
  },
};
