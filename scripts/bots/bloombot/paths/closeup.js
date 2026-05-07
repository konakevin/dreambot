/**
 * BloomBot closeup — macro view INTO a dense bloom wall in its natural environment.
 *
 * CRITICAL: this path's failure mode in the prior version was Sonnet drifting
 * to "studio bouquet on a dark background" or "florist arrangement on a wooden
 * plate". Anti-bouquet language is FRONT-LOADED in the scene.
 */
const compose = require('../compose');

const SCENE = `A MACRO CLOSEUP looking INTO a dense bloom wall in its NATURAL OUTDOOR ENVIRONMENT. The viewer is standing close enough to count the petals on the front-most blooms; the focal plane is shallow but the wall of flowers fills the entire frame and recedes into a softly-blurred bloom mass behind.

ABSOLUTELY FORBIDDEN — do NOT write any of these:
  • cut flowers, bouquet, arrangement, vase, basket, plate, bowl, tray, shelf
  • dark studio backdrop, neutral backdrop, "on a wooden surface", "against dark wall"
  • still-life, florist composition, table-top, gift-shop scene
  • picked flowers, gathered stems, harvested blooms

REQUIRED: this is a macro view into LIVING flowers GROWING IN PLACE — on a vine, on a bush, in a wild meadow, in a cottage garden, climbing a wall, blanketing a hillside, lining a path. The background is the rest of the bloom field receding into shallow-DOF blur, NOT a dark photo studio.

Pick one growing context: hedgerow wall of climbing blooms, wildflower meadow at petal-level, garden border with hovering bee, cottage path with cascading vines, jungle understory carpet, pond's edge with water-flower mass.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
