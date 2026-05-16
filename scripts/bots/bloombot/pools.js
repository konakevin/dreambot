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

function loadIfExists(name) {
  try {
    return load(name);
  } catch {
    return [];
  }
}

module.exports = {
  PALETTES: load('palettes'),
  LIGHTING: load('lighting'),
  // ─── landscape path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_LANDSCAPE_LANDFORM: loadIfExists('bloombot_landscape_landform'),
  BLOOMBOT_LANDSCAPE_SCALE_PROVER: loadIfExists('bloombot_landscape_scale_prover'),
  BLOOMBOT_LANDSCAPE_SURPRISE_ELEMENT: loadIfExists('bloombot_landscape_surprise_element'),
  BLOOMBOT_LANDSCAPE_SKY: loadIfExists('bloombot_landscape_sky'),
  BLOOMBOT_LANDSCAPE_PHENOMENON: loadIfExists('bloombot_landscape_phenomenon'),
  // ─── closeup path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_CLOSEUP_BLOOM_WALL_TYPE: loadIfExists('bloombot_closeup_bloom_wall_type'),
  BLOOMBOT_CLOSEUP_GROWING_CONTEXT: loadIfExists('bloombot_closeup_growing_context'),
  BLOOMBOT_CLOSEUP_MACRO_PHENOMENON: loadIfExists('bloombot_closeup_macro_phenomenon'),
  SENSORY_POOLS: {
    scene: {
      lightcolor: load('sensory_lightcolor'),
    },
  },
};
