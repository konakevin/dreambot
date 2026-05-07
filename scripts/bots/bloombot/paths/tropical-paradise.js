/**
 * BloomBot tropical-paradise — dense rainforest/jungle understory or canopy.
 * Locked to the TROPICAL species roster.
 */
const compose = require('../compose');

const SCENE = `A TROPICAL JUNGLE FLORAL SCENE — dense rainforest understory or canopy. Pick one specific setting: rainforest understory with shafts of light cutting through the canopy, jungle pool surrounded by hanging vines and giant leaves, volcanic-island cliff above turquoise lagoon, banyan tree clearing with strangler-fig roots, mangrove tidal swamp with floating blooms, cloud-forest waterfall with mossy boulders, banana-grove path with broad green leaves arching overhead.

The setting is identifiably tropical — palms, banana leaves, philodendron, banyan roots, ferns, moss, humid atmospheric haze. The flowers are MASSIVE and SHOWY — torch ginger, heliconia, plumeria, jade vine cascades, cattleya orchids — at jungle scale.

Wide cinematic shot showing depth — humid atmospheric perspective receding into hazy green distance, foreground saturated and crisp, middle and far layers progressively misted.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker, regionKey: 'tropical' });
