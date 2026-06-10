/**
 * StarBot impossible-sky path — declarative form (2026-06-09, NEW).
 *
 * The wallpaper money-shot: a colossal ringed gas giant looming enormous
 * over an alien horizon, rings slicing the sky, moons + aurora, mirrored
 * in the land/sea below. Grounded foreground, but the SKY is the show.
 *
 * Scene-led — the SKY is the hero. Bot default starbot_hyperreal medium.
 *
 * See:
 *   - scripts/bots/starbot/archetypes.js          (IMPOSSIBLE_SKY slots)
 *   - scripts/bots/starbot/archetype-templates.js (IMPOSSIBLE_SKY template)
 *
 * Pools are MVP-25 (2026-06-09) — seed-test-then-scale per Kevin's mandate.
 */

module.exports = {
  archetype: 'IMPOSSIBLE_SKY',
  pools: {
    ringed_giant: 'IMPOSSIBLE_SKY_RINGED_GIANT',
    sky_companions: 'IMPOSSIBLE_SKY_COMPANIONS',
    foreground: 'IMPOSSIBLE_SKY_FOREGROUND',
    horizon_detail: 'IMPOSSIBLE_SKY_HORIZON',
    atmosphere: 'IMPOSSIBLE_SKY_ATMOSPHERE',
    // independent conditional layers
    sky_event: 'IMPOSSIBLE_SKY_EVENT', // 40% gate
    witness_figure: 'IMPOSSIBLE_SKY_WITNESS', // 40% gate — tiny figure gazing up
  },
};
