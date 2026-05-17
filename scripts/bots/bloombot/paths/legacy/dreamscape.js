/**
 * BloomBot dreamscape — surreal, impossible, gravity-defying floral scene.
 * Earth-bound species, but composed in physically impossible arrangements.
 */
const compose = require('../../compose');

const SCENE = `A SURREAL FLORAL DREAMSCAPE — physically impossible composition rendered with hyperreal precision. Pick one impossible-arrangement type: blooms suspended in mid-air at multiple altitudes like a constellation, flowers growing OUT from a floating sphere of stone or water, a river flowing UPWARD through the air carrying blooms with it, gravity-flipped flowers rooted in the sky raining down, a spiral helical bloom-staircase ascending into nothing, a Magritte-style window opening onto a bloom-storm, a lake reflecting a different bloom-scene than the one above it, a single oversized bloom inside which a smaller bloom-world exists.

Earth-bound species (real flowers) but the COMPOSITION breaks physics. The render technique is hyperreal/photoreal — the impossibility is in the LAYOUT, not in any "alien flower" detail. Treat it like a fine-art painting that happens to be impossible.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
