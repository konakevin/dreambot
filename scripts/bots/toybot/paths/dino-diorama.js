/**
 * ToyBot dino-diorama — declarative composer form.
 *
 * REAL plastic/vinyl TOY DINOSAURS staged in a handmade stop-motion
 * CLAYMATION prehistoric WORLD (clay-sculpted volcano, terrain, foliage,
 * rivers — Aardman/Laika miniature-set craft). The dinosaurs are real
 * toys; the world around them is sculpted clay. Mixed-media charm.
 *
 * Fun, creative, story-driven prehistoric scenes with a 55%-gated SURPRISE
 * (a stray other-toy / unexpected whimsy crashing the prehistoric world).
 *
 * RICH multi-axis design (playbook: monumental anchor + multi-tier depth +
 * scale provers + material truth as dedicated axes):
 *   cast      — the real toy dinosaurs (SHARED with dino-mischief)
 *   scenario  — the prehistoric drama + what the dinos are DOING
 *   biome     — the clay prehistoric terrain type
 *   anchor    — the ONE monumental clay hero element (volcano/meteor/etc.)
 *   craft     — handmade claymation texture + diorama charm details
 *   critters  — secondary prehistoric life / scale-provers
 *   surprise  — gated (55%) other-toy / unexpected whimsy
 *   + universal camera_angle / lighting / atmosphere
 */

module.exports = {
  archetype: 'TOYBOT_DINO_DIORAMA',
  pools: {
    camera_angle: 'DINO_DIORAMA_CAMERA',
    cast: 'DINO_TOY_CAST',
    scenario: 'DINO_DIORAMA_SCENARIO',
    biome: 'DINO_DIORAMA_BIOME',
    flora: 'DINO_DIORAMA_FLORA',
    anchor: 'DINO_DIORAMA_ANCHOR',
    craft: 'DINO_DIORAMA_CRAFT',
    critters: 'DINO_DIORAMA_CRITTERS',
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
    // conditional (55% gate)
    surprise: 'DINO_DIORAMA_SURPRISE',
  },
};
