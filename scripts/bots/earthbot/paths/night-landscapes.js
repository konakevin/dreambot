/**
 * EarthBot night-landscapes path — declarative axis-system (2026-06-24).
 *
 * A pretty, detailed, VISIBLE real-Earth landscape (the hero) beneath a
 * beautiful night sky (the backdrop). Brought back from an old experimental
 * throwaway "night-skies" path that Kevin liked the SKIES of but found the
 * LANDS too minimalistic ("sky sovereign, land silent" — flat marshes, barren
 * lakebeds, black silhouettes). This flips the emphasis: the landscape is the
 * pretty subject, clearly LIT and detailed; the night sky is the gorgeous
 * backdrop, rotating across the full variety (moonlight / Milky-Way spiral /
 * bright starry / shades of twilight / a-few-faint-stars / aurora).
 *
 * Clean true-to-life nightscape astrophotography — NEVER neon / hyperreal /
 * fantasy (playbook 2026-06-15: amplification IS the sci-fi driver). Natural
 * light only; the light always REVEALS the land. NO humans, NO human-built
 * features (night scenes tempt Flux toward a glowing tent / lit cabin window).
 *
 * 4 axes — 3 always-on + 1 conditional 30%-gated:
 * - landscape       (the pretty visible hero — dramatic real geology)
 * - night_sky       (the backdrop + the light that reveals the land — carries
 *                    the time-of-night variety; each entry physically coherent)
 * - sky_air         (atmosphere — transparency / thin cloud / mist)
 * - celestial_accent (30%-gated — meteor / planet / zodiacal light)
 */

module.exports = {
  archetype: 'EARTHBOT_NIGHT_LANDSCAPES',
  pools: {
    landscape: 'NIGHT_LANDSCAPES_LANDSCAPE',
    night_sky: 'NIGHT_LANDSCAPES_NIGHT_SKY',
    sky_air: 'NIGHT_LANDSCAPES_SKY_AIR',
    celestial_accent: 'NIGHT_LANDSCAPES_CELESTIAL_ACCENT',
  },
};
