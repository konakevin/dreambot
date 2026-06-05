/**
 * OceanBot pirates — axis-system declarative path.
 *
 * Pirates-of-the-Caribbean cinema (Golden Age of Piracy, 1650-1730).
 * EXCEPTION to OceanBot's "no people" convention — pirates ARE visible
 * subjects in this path. But the SETTING (ocean / harbor / island /
 * deck / cove) still does as much visual work as the figures.
 *
 * Wires the OCEANBOT_PIRATES archetype slots to per-axis pool names
 * that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 *
 * EVEN LEANER than shipwreck-kingdom + lost-cities — just 2 path-
 * bespoke pools (hero scene + camera framing). The pirate_scene
 * entries encode setting + characters + action + atmosphere in one
 * rich 18-22 word phrase, so the supporting axes can do less. See
 * archetypes.js header for the full axis-count calibration.
 */

module.exports = {
  archetype: 'OCEANBOT_PIRATES',
  pools: {
    pirate_scene: 'PIRATE_SCENES',
    camera_framing: 'PIRATE_CAMERA_FRAMING',
  },
};
