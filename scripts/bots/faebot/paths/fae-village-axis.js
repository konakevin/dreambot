/**
 * FaeBot fae-village path — declarative axis-system form (2026-05-21).
 *
 * THE SOUL OF THE PATH:
 *   One of FaeBot's most popular paths. Enchanted fae dwellings GROWN from
 *   the forest (acorn / eggshell / mushroom / treehouse / hollow-trunk /
 *   bramble-nest / stone-ruin-overgrown / cliff-ledge / spider-silk-hammock
 *   / etc.) shown as the primary subject (40-55% of frame). Amber-glowing
 *   windows + chimney smoke + lanterns + lush wildflower carpet + critters
 *   bring the village to life.
 *
 * VARIETY MANDATE — village can be:
 *   - SINGLE solitary cottage
 *   - PAIR of sister-dwellings
 *   - CLUSTER (3-6 dwellings grouped on ground)
 *   - CANOPY-NETWORK (multiple cottages across trees connected by rope bridges)
 *   - VERTICAL-STACK (multiple in one tall tree at different heights)
 *   - OVER-WATER (cottages on stream/river banks, bridges crossing)
 *   - CLIFF-LEDGE (different cliff ledges connected by stone paths)
 *   - FAIRY-RING-COURTYARD (circular arrangement around courtyard)
 *   - HANGING / INVERTED (suspended cottages)
 *
 * 12 AXES (11 always-on + 1 gated water_or_feature):
 *   - dwelling_type: architecture/material (LOAD-BEARING)
 *   - village_layout: how the dwellings are arranged (LOAD-BEARING — covers
 *     all 9 legacy layout types via Sonnet composition with dwelling_type)
 *   - lived_in_signs: amber-windows + chimney smoke + lanterns + chairs +
 *     cooking-fire (load-bearing "feels inhabited")
 *   - approach_pathway: stone-path / plank-bridge / spiral-stair / etc.
 *   - dwelling_garden: wisteria + climbing-roses + herb-garden + moss-roof
 *   - forest_setting: surrounding biome
 *   - lighting: time-of-day + register
 *   - atmospheric_depth: god-rays / mist / dust-motes
 *   - wildlife_lived_in: 3-5 critters animating the village
 *   - floral_carpet: lush wildflower carpet at foreground
 *   - foreground_anchor: closest tactile element
 *   - water_or_feature (40%-gated): pond / well / fountain / mushroom-circle /
 *     standing-stone-circle (skipped when village_layout is OVER-WATER)
 */

module.exports = {
  archetype: 'FAEBOT_FAE_VILLAGE_AXIS',
  pools: {
    dwelling_type: 'FAEBOT_FAE_VILLAGE_DWELLING_TYPE',
    village_layout: 'FAEBOT_FAE_VILLAGE_LAYOUT',
    lived_in_signs: 'FAEBOT_FAE_VILLAGE_LIVED_IN_SIGNS',
    approach_pathway: 'FAEBOT_FAE_VILLAGE_APPROACH_PATHWAY',
    dwelling_garden: 'FAEBOT_FAE_VILLAGE_DWELLING_GARDEN',
    forest_setting: 'FAEBOT_FAE_VILLAGE_FOREST_SETTING',
    lighting: 'FAEBOT_FAE_VILLAGE_LIGHTING',
    atmospheric_depth: 'FAEBOT_FAE_VILLAGE_ATMOSPHERIC_DEPTH',
    wildlife_lived_in: 'FAEBOT_FAE_VILLAGE_WILDLIFE_LIVED_IN',
    floral_carpet: 'FAEBOT_FAE_VILLAGE_FLORAL_CARPET',
    foreground_anchor: 'FAEBOT_FAE_VILLAGE_FOREGROUND_ANCHOR',
    water_or_feature: 'FAEBOT_FAE_VILLAGE_WATER_OR_FEATURE',
  },
};
