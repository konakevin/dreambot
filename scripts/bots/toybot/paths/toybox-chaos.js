/**
 * ToyBot toybox-chaos path — bucket + pickN refactor (2026-05-24).
 *
 * Replaces the old 6-slot baked-scene pool (combinatorial ceiling) with a
 * decomposed axis system: a big de-branded TOY BUCKET, pickN:4 (set in the
 * archetype), composited by the template into ONE INTERACTING chaos vignette
 * on a real surface. Adding a toy is now a one-line append to TOYBOX_TOY_BUCKET
 * that instantly appears across millions of combos.
 *
 * See TOYBOX_CHAOS_BUCKET_REFACTOR.md. The interaction mandate lives in the
 * TOYBOT_TOYBOX_CHAOS template — that's the load-bearing piece.
 *
 * Axes: toy_cast (TOYBOX_TOY_BUCKET, pickN:4) + surface + scenario +
 * universal camera/lighting/atmosphere + 40%-gated surprise.
 *
 * Locked medium: toybox_chaos_mixed (each toy in its own native material).
 * camera_angle reuses the bespoke WIDE ensemble pool (the bot default leans
 * macro / single-hero and crops the multi-toy cast). Skips chaos / polish /
 * sensory (the composited brief is the source of truth).
 */

module.exports = {
  archetype: 'TOYBOT_TOYBOX_CHAOS',
  pools: {
    // Wide ensemble framing — NOT the macro-leaning bot default.
    camera_angle: 'TOYBOT_TOYBOX_STORYTELLING_CAMERAS',
    // The de-branded toy bucket — pickN:4 per render (archetype sets pickN).
    toy_cast: 'TOYBOX_TOY_BUCKET',
    surface: 'TOYBOX_SURFACE',
    scenario: 'TOYBOX_SCENARIO',
    // story_beat (2026-06-06) — legacy 6-slot baked DNA, 200 entries of
    // complete multi-medium narrative scenes. Forces a story EVENT into
    // every render instead of letting Sonnet drift to a static lineup.
    story_beat: 'TOYBOT_TOYBOX_STORYTELLING_SCENES',
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
    // conditional (40% gate)
    surprise: 'TOYBOX_SURPRISE',
  },
};
