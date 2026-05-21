/**
 * PixelBot epic-vista path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT SIDE-SCROLLING PARALLAX-VISTA GAMEPLAY SCREENSHOTS — Final
 * Fantasy VI airship-flyover + Chrono Trigger world-map + Lufia II
 * overworld + Secret of Mana world-vistas + Terranigma overworld +
 * Castlevania IV background-vistas + Donkey Kong Country backgrounds
 * + Sonic 2/3 horizons + classic 16-bit side-scrolling-engine vistas.
 *
 * SCENE-AS-HERO — no character, the vista IS the photo. 4 parallax
 * depth layers (foreground + middle + distant + backdrop) with HARD
 * pixel-edges between them.
 *
 * Camera lock: HORIZONTAL SIDE-SCROLLING (reads left-to-right).
 *
 * Axes (3 path-bespoke + 40%-gated silhouette):
 *   - vista_subject (25): focal landform — rolling-hills / fjord /
 *     desert / volcanic / arctic / mountain / sea / floating-island
 *   - sky_or_backdrop (25): backdrop layer — sky / sunset / starfield
 *     / aurora / cloud-bank / planet-rising / nebula
 *   - lighting_atmosphere (25): time-of-day + atmospheric particles +
 *     palette + mood (sunset-amber / dawn-pink / starlit-cool / etc.)
 *   - parallax_silhouette (25, 40%-gated): tiny optional silhouette in
 *     the parallax — bird / airship / caravan / traveler / dragon
 */

module.exports = {
  archetype: 'PIXELBOT_EPIC_VISTA',
  pools: {
    vista_subject: 'PIXELBOT_EPIC_VISTA_SUBJECT',
    sky_or_backdrop: 'PIXELBOT_EPIC_VISTA_SKY_OR_BACKDROP',
    lighting_atmosphere: 'PIXELBOT_EPIC_VISTA_LIGHTING_ATMOSPHERE',
    parallax_silhouette: 'PIXELBOT_EPIC_VISTA_PARALLAX_SILHOUETTE',
  },
};
