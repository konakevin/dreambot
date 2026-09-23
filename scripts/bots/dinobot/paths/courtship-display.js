/**
 * DinoBot courtship-display — DISPLAY BEHAVIOUR as the hero (2026-09-22).
 *
 * WHY THIS PATH EXISTS. DinoBot had 16 live paths and every one of them was a landscape, a herd, a
 * fight, a family, a portrait or a weather event. Nothing showed an animal DISPLAYING — the single
 * most photogenic behaviour in the whole wildlife-documentary genre, and the shot a Prehistoric
 * Planet crew waits a week in a hide to get.
 *
 * Axis design (3 path-bespoke + the reused stage, per the nesting-ground/herd-migration shape):
 *   display_act      the hero behaviour, mid-motion, body plan named so Flux renders a dinosaur
 *   display_feature  the MONEY-SHOT axis — the anatomy actually doing the displaying, described so
 *                    the light passing through it is part of the entry. Per the playbook, every
 *                    path gets one signature axis for the detail that makes the shot iconic; for a
 *                    display that is the crest / fan / sac / sail itself, backlit.
 *   audience         who it is FOR. A display aimed at nothing reads as a random pose, so this axis
 *                    supplies the watching mate, the assessing rival, the bored grazer, the lek, or
 *                    the scraped arena as evidence. Small (3-10% of frame) on purpose.
 *
 * Reuses DINOBOT_PALEO_LANDSCAPE_BIOME as the arena and the 80%-gated
 * DINOBOT_PALEO_LANDSCAPE_PHENOMENON, plus universal lighting + atmosphere.
 *
 * The two load-bearing template mandates: the display IS the shot (never a standing animal), and
 * display/ritual ONLY — no mating, no contact, no combat. Both are stated as the first rules
 * because the path's whole identity rests on them.
 */

module.exports = {
  archetype: 'DINOBOT_COURTSHIP_DISPLAY',
  pools: {
    // ROUND 4 (2026-09-22): swapped off the REUSED landscape biome for a bespoke ARENA pool.
    // The reused pool is written landscape-first, and its wide-desert rolls produced the run's
    // clearest miss against Kevin's motto — a lone animal standing in flat monochrome sand, clean
    // and completely forgettable. An arena has a floor, an enclosing edge, room for a gathering,
    // and one vivid charm detail per entry.
    biome: 'DINOBOT_COURTSHIP_ARENA',
    display_act: 'DINOBOT_COURTSHIP_ACT',
    display_feature: 'DINOBOT_COURTSHIP_FEATURE',
    audience: 'DINOBOT_COURTSHIP_AUDIENCE',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
