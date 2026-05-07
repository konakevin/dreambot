/**
 * BloomBot garden-walk — walkable bloom-tunnel/archway/path inviting the viewer in.
 * The viewer is at the entrance about to walk through.
 */
const compose = require('../compose');

const SCENE = `A WALKABLE FLORAL PASSAGE inviting the viewer in. Pick one architectural framing: stone gothic archway smothered in climbing blooms, gnarled wisteria pergola tunnel with hanging racemes, ivy-and-rose covered stone gateway, weathered iron arbor in an overgrown garden, mossy forest path framed by flowering branches, ancient temple ruin with vine-curtained doorway.

The PATH itself is visible — flagstone, mossy steps, packed earth, a carpet of fallen petals, a stream stepping-stones — and leads INTO the frame, drawing the eye through. Beyond the archway is more bloom-field receding into atmospheric depth — never just a blank backdrop.

Composition is symmetric portrait — the archway centered, frame divided into a foreground bloom-mass on each side and a glowing depth-of-field at the path's far end. Light streams through the opening like a doorway to somewhere magical.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
