/**
 * FaeBot enchanted-vista path — declarative axis-system form (2026-05-21).
 *
 * THE SOUL OF THE PATH:
 *   Pure SCENE — the lush enchanted forest itself as the subject. NO
 *   figures, NO creatures as focal subjects. The MAGICAL LAND where all
 *   the other FaeBot creatures live and thrive — rendered so that the
 *   viewer steps into a sacred place. Multi-layer painterly richness:
 *   canopy + hero feature + floor + water + magic + light + depth + air.
 *
 *   Migrated from legacy function-form 2026-05-21. Kevin: "we want a
 *   super pretty, lush forest scene — the lands where all these
 *   enchanted, pretty things live and thrive."
 *
 * DISTINCT from sibling paths:
 *   - queen-of-the-forest / dryad-portrait / forest-fairy-scene: FIGURES
 *   - tiny-fae: macro creature
 *   - flower-fairy: flower-merged creature
 *   - fae-village: fae dwellings
 *   - enchanted-vista: PURE FOREST LANDSCAPE (no figures)
 *
 * 11 AXES (10 always-on + 1 gated wildlife_distant):
 *   - biome: overall biome + canopy character
 *   - hero_feature: central WOW landmark (hero-tree / waterfall / arch / etc.)
 *   - floor_carpet: floor texture + wildflower density
 *   - water_element: stream / pond / waterfall / mist-pool
 *   - magical_ambient: fairy magic particles + small magical accents
 *   - composition: framing technique
 *   - lighting: time-of-day + palette
 *   - atmospheric_depth: depth technique (god-rays / mist-layers / dappled patches)
 *   - weather: air conditions + drifting accents
 *   - foreground_anchor: closest tactile element
 *   - wildlife_distant (40%-gated): far ambient critter hint
 */

module.exports = {
  archetype: 'FAEBOT_ENCHANTED_VISTA',
  pools: {
    biome: 'FAEBOT_ENCHANTED_VISTA_BIOME',
    hero_feature: 'FAEBOT_ENCHANTED_VISTA_HERO_FEATURE',
    floor_carpet: 'FAEBOT_ENCHANTED_VISTA_FLOOR_CARPET',
    water_element: 'FAEBOT_ENCHANTED_VISTA_WATER_ELEMENT',
    magical_ambient: 'FAEBOT_ENCHANTED_VISTA_MAGICAL_AMBIENT',
    composition: 'FAEBOT_ENCHANTED_VISTA_COMPOSITION',
    lighting: 'FAEBOT_ENCHANTED_VISTA_LIGHTING',
    atmospheric_depth: 'FAEBOT_ENCHANTED_VISTA_ATMOSPHERIC_DEPTH',
    weather: 'FAEBOT_ENCHANTED_VISTA_WEATHER',
    foreground_anchor: 'FAEBOT_ENCHANTED_VISTA_FOREGROUND_ANCHOR',
    wildlife_distant: 'FAEBOT_ENCHANTED_VISTA_WILDLIFE_DISTANT',
  },
};
