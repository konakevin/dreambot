/**
 * ToyBot toybox-chaos path — declarative axis-system (2026-05-19 rewrite).
 *
 * MIXED-MEDIUM TOY-MISCHIEF STORYTELLING — every render is a single-frame
 * comedy moment from a longer absurd toy-story. 4-6+ different toy mediums
 * coexist in one packed scene on a real-world surface.
 *
 * Axes:
 *   - Universal: camera_angle (bot.defaultPools)
 *   - Path-bespoke:
 *       scene — 6-slot DNA seed (real surface + story setup; protagonist +
 *               dramatic absurd action; 3-5 supporting cast across brand
 *               families; absurd visual gag; warm play light; overhead
 *               chaos element)
 *
 * Locked medium: toybox_chaos_mixed (multi-medium ensemble directive).
 * Template inlines all mandate content. Self-contained. Skips chaos /
 * twoPassPolish / sensoryAnchors — the 6-slot seed is the source of truth.
 */

module.exports = {
  archetype: 'TOYBOT_TOYBOX_STORYTELLING',
  pools: {
    scene: 'TOYBOT_TOYBOX_STORYTELLING_SCENES',
  },
};
