/**
 * BloomBot pools — small + load-bearing.
 *
 * Two hand-authored pools (palettes + lighting) plus one Sonnet-generated
 * sensory pool. Regional flora roster lives in species-roster.js as a JS
 * module rather than JSON because it's keyed lookup, not random pick.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

module.exports = {
  PALETTES: load('palettes'),
  LIGHTING: load('lighting'),
  SENSORY_POOLS: {
    scene: {
      lightcolor: load('sensory_lightcolor'),
    },
  },
};
