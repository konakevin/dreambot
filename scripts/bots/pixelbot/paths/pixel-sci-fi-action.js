/**
 * PixelBot pixel-sci-fi-action path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT SCI-FI ACTION GAMEPLAY SCREENSHOTS — Contra III + Mega Man X +
 * Super Metroid + Blaster Master + Turrican II + Gradius + R-Type +
 * Salamander + Gunstar Heroes + Axelay + Cybernator + Star Soldier +
 * Star Fox pixel.
 *
 * Solo run-and-gun marine / mech-pilot / starfighter-pilot is genre-
 * correct (Contra-style solo hero with maybe 1 sidekick).
 *
 * Camera flexibility: side-view (Contra) OR horizontal space-shooter
 * (Gradius) OR top-down vertical (1942) OR 3/4-iso (Blaster Master
 * interior) per setting.
 *
 * Axes (3 path-bespoke + 40%-gated props):
 *   - sci_fi_setting (25): alien jungle / robot factory / space-station
 *     corridor / asteroid-field / mech-bay / post-apoc ruins / etc.
 *   - sci_fi_enemy (25): alien creature / robot-soldier / mech-walker
 *     / drone-swarm / plasma-turret / xenobeast / etc. mid-action
 *   - hero_action (25): solo space-marine firing rifle / mech-pilot
 *     mid-step / starfighter dogfighting / jetpack-soldier leaping
 *   - sci_fi_props (25, 40%-gated): pulsing consoles / reactor cores
 *     / cables / catwalks / energy-shields / plasma-pillars / etc.
 */

module.exports = {
  archetype: 'PIXELBOT_PIXEL_SCI_FI_ACTION',
  pools: {
    sci_fi_setting: 'PIXELBOT_PIXEL_SCI_FI_ACTION_SETTING',
    sci_fi_enemy: 'PIXELBOT_PIXEL_SCI_FI_ACTION_ENEMY',
    hero_action: 'PIXELBOT_PIXEL_SCI_FI_ACTION_HERO_ACTION',
    sci_fi_props: 'PIXELBOT_PIXEL_SCI_FI_ACTION_PROPS',
  },
};
