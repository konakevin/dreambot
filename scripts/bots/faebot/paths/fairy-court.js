/**
 * FaeBot fairy-court path — declarative axis-system form (2026-05-21).
 *
 * THE SOUL OF THE PATH:
 *   Regal noble fae court — solo queen OR small group (1-5 figures) caught
 *   in candid ceremonial moments. Three-quarter to full-body framing.
 *   Sacred-grove THRONE (moss-and-root, NEVER built architecture). Royal
 *   register: ancient, ceremonial, regal-still. Same painterly enchanted
 *   forest as dryad-portrait + forest-fairy-scene.
 *
 * DISTINCT from sibling paths:
 *   - forest-fairy-scene: individual creature in action, not royalty
 *   - flower-fairy: flower-merged, smaller scale
 *   - tiny-fae: palm-sized
 *   - dryad-portrait: tight close-up
 *   - fairy-court: ROYAL + larger scale + multi-figure option + ceremonial
 *
 * 10 AXES (9 always-on + 1 gated sacred_companion):
 *   - court_subject: queen + attendants (1-5 figures)
 *   - ceremonial_moment: what's happening
 *   - composition: 3/4 body / full-figure / processional / queen+attendant
 *   - regalia: crown / accessories / staff
 *   - forest_backdrop: sacred grove behind
 *   - lighting: court-light register
 *   - weather: drifting accents
 *   - magical_flavor: royal magic (butterflies orbiting crown / pollen-halo)
 *   - foreground_anchor: closest depth element
 *   - sacred_companion (40%-gated): white stag / raven / owl / fox attending
 */

module.exports = {
  archetype: 'FAEBOT_FAIRY_COURT',
  pools: {
    court_subject: 'FAEBOT_FAIRY_COURT_SUBJECT',
    ceremonial_moment: 'FAEBOT_FAIRY_COURT_CEREMONIAL_MOMENT',
    composition: 'FAEBOT_FAIRY_COURT_COMPOSITION',
    regalia: 'FAEBOT_FAIRY_COURT_REGALIA',
    forest_backdrop: 'FAEBOT_FAIRY_COURT_FOREST_BACKDROP',
    lighting: 'FAEBOT_FAIRY_COURT_LIGHTING',
    weather: 'FAEBOT_FAIRY_COURT_WEATHER',
    magical_flavor: 'FAEBOT_FAIRY_COURT_MAGICAL_FLAVOR',
    foreground_anchor: 'FAEBOT_FAIRY_COURT_FOREGROUND_ANCHOR',
    sacred_companion: 'FAEBOT_FAIRY_COURT_SACRED_COMPANION',
  },
};
