/**
 * BloomBot conservatory — Victorian glass-and-iron greenhouse interior overgrown.
 * The architecture (glass panes + iron framework) is visible but the flowers
 * have consumed every surface.
 */
const compose = require('../../compose');

const SCENE = `A VICTORIAN GLASS-AND-IRON CONSERVATORY interior fully overgrown. The architecture is visible: arched glass dome above, white-painted or rust-patinaed iron framework, wrought-iron columns, geometric leaded-glass panes, a tile or flagstone floor, perhaps a central fountain or pond.

But the conservatory is OVERGROWN — flowers have climbed every iron column, draped every arch, hung from every rafter, blanketed every flagstone, filled every planter to overflowing. Vines spill from upper rafters in cascading curtains. The interior looks half-architectural / half-jungle.

Wide-angle interior shot showing the conservatory's depth — viewer stands inside looking down the central axis or up at the dome. Diagonal sun-shafts pour through the glass at the lighting-block-specified angle, hitting the bloom-clouds in volumetric god-rays.

Pick one specific structural element to anchor: a curving iron staircase, a circular reflecting pool with lily pads, a stone bench under the dome, a tall sundial, an ornate bird cage suspended from the ceiling.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
