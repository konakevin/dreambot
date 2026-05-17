/**
 * BloomBot reclaim — abandoned ruins reclaimed by flowers.
 * Post-civilization mood: nature has won, in beauty.
 */
const compose = require('../../compose');

const SCENE = `ABANDONED HUMAN STRUCTURES being reclaimed by flowers. Pick one specific ruin: a marble Greek temple half-collapsed, a stone Mayan pyramid cracked open, a rusted abandoned greenhouse with broken panes, a half-sunken cathedral with open roof, a derelict lighthouse on a cliff, a forgotten library with collapsed walls, an abandoned amusement-park carousel, a wrecked ocean liner on a beach, an ancient Roman aqueduct, a moss-covered castle ruin.

The structure is in deep disrepair — cracked, mossy, half-fallen, vine-strangled, time-worn — but it's still RECOGNIZABLE as the specific kind of place it was. Flowers have CONSUMED the ruin: climbing vines wrap every column, blooms blanket every fallen stone, root systems crack the masonry from inside, petals carpet the floor, vines drape from broken arches.

The mood is awe + melancholy + triumphant nature, not horror. The composition is wide cinematic — the ruin centered or framed, the bloom-overgrowth its co-star. Sun-shafts pour through the broken roof / wall / window in the lighting-specified style.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
