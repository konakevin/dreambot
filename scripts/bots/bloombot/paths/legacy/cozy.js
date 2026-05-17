/**
 * BloomBot cozy — interior space that has been overgrown by flowers.
 * Window/sill/sunroom/breakfast nook with climbing florals everywhere.
 */
const compose = require('../../compose');

const SCENE = `A COZY INTERIOR overgrown by flowers. Pick one specific architectural setting: a tall arched window with stone sill, a sunroom with white wicker chair, a breakfast nook with checkered tablecloth, a stairwell landing with carved wooden banister, a writing desk under a leaded-glass window, an attic dormer with brass hooks.

Flowers cascade from the ceiling, climb the walls, drape across furniture, fill every vase + jug + bowl. Vines in profusion across every horizontal and vertical surface. The interior architecture is visible and recognizable but the flowers are CLEARLY the dominant subject — half the frame is bloom, the architecture is the framework holding it up.

Light pours in through the window at a dramatic angle, chosen to match the lighting block.

Cozy = warm humble domestic space. NOT formal, NOT grand, NOT a palace, NOT a ballroom. Think: someone's beloved home that the garden has consumed.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
