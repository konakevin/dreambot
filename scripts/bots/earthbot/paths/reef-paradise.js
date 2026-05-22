/**
 * EarthBot reef-paradise path — declarative axis-system (2026-05-21 R2 PIVOT).
 *
 * R0/R1 problem: tried for underwater coral reef identity, but Kevin
 * hearted a half-and-half waterline shot of a dramatic ISLAND BAY (sun-
 * burst clouds + dramatic shoreline + crystal turquoise water). The
 * coral identity is dead.
 *
 * R2 PIVOT: pretty island-bay / coastal view. Half-and-half waterline
 * shots are the dominant compositional mode (~50%), with pure above-
 * water bay views (~35%) and underwater-looking-up at shore silhouettes
 * (~15%). NO coral cathedrals. NO fish density. NO reef interiors.
 *
 * 6 axes — 5 always-on + 1 conditional 30%-gated foreground_element:
 * - bay_setting (the bay geometry — type only, no place names)
 * - shoreline_drama (the dramatic above-water landscape)
 * - water_quality (the crystal water aesthetic + reflections + caustics)
 * - sky_drama (clouds + sun-rays + light)
 * - composition (half-and-half / above-water / underwater-up — 50/35/15)
 * - foreground_element (30%-gated — palm fronds / lava rocks / lagoon flowers)
 *
 * GENERIC MORPHOLOGICAL DESCRIPTIONS ONLY across all pools — NO named
 * places (no Bora Bora / Hanauma / Tahiti / Maui), per LESSON 7.
 *
 * Legacy implementation preserved at paths/legacy/reef-paradise.js.
 */

module.exports = {
  archetype: 'EARTHBOT_REEF_PARADISE',
  pools: {
    bay_setting: 'REEF_PARADISE_BAY_SETTING',
    shoreline_drama: 'REEF_PARADISE_SHORELINE_DRAMA',
    water_quality: 'REEF_PARADISE_WATER_QUALITY',
    sky_drama: 'REEF_PARADISE_SKY_DRAMA',
    composition: 'REEF_PARADISE_COMPOSITION',
    foreground_element: 'REEF_PARADISE_FOREGROUND_ELEMENT',
  },
};
