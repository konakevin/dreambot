/**
 * BloomBot city-flowers — urban architecture overgrown by flowers.
 * Mediterranean alley / Parisian balcony / Tokyo back-street / Lisbon staircase.
 */
const compose = require('../../compose');

const SCENE = `URBAN ARCHITECTURE OVERGROWN BY FLOWERS. Pick one specific city setting: a Mediterranean alleyway between pastel-painted plaster walls, a Parisian Haussmann balcony tier with iron railings, a Tokyo back-street with sliding wooden doors, a Lisbon staircase climbing between tile-fronted houses, a Marrakech blue-painted courtyard, a Venetian canal-side palazzo, a Cinque Terre cliff-side village stairway, a Cuban old-town colonial street.

Flowers CASCADE off every balcony, climb every wall, spill from every window-box, drape across every iron grille, fill every planter. The architecture (the city's specific style) is unmistakable but it's been HALF-CONSUMED by floral overgrowth.

Wide street-photography composition showing depth into the city. Pedestrian-level POV, leading-lines into the distance (alley vanishing point, staircase rising, canal receding). The architecture's signature details (shutters, tiles, ironwork, signage) read clearly through the bloom curtain.`;

module.exports = ({ sharedDNA, vibeDirective, picker }) =>
  compose({ scene: SCENE, sharedDNA, vibeDirective, picker });
