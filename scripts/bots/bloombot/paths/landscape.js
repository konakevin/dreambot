/**
 * BloomBot landscape — vast epic floral landscape, the dramatic-scenery flagship.
 * The geographic feature is recognizable and grand; flowers carpet every plane.
 */
const compose = require('../compose');

const SCENE = `A vast EPIC FLORAL LANDSCAPE. Pick one specific dramatic landform: alpine meadow valley below jagged snow peaks, desert canyon split by a winding stream, coastal cliff above crashing ocean, rolling hills receding into distant blue mountains, ancient glacial valley, or volcanic plateau caldera. The landform is recognizable and grand — wide cinematic vista, deep recession into the distance.

Flowers BLANKET the entire foreground, midground, and background. The landform reads as recognizable terrain (not generic "field"); the flowers are the carpet on it. Layered scale: tiny microflowers in the immediate foreground, mid-size statement blooms in the middle, distant bloom-fields receding into atmospheric haze.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
