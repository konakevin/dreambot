/**
 * BrickBot pools — shared camera-axis + per-path triplets (scenes, lighting,
 * palette).
 *
 * 13 paths × 3 pools each = 39 path-specific JSON pools, plus 1 shared
 * camera_axis pool. Flat naming: {path}_{kind}.json.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Kebab-case path identifiers (used in code + captions).
// Pool filenames convert to snake_case via toFile().
const PATHS = [
  'macro-display',
  'girly',
  'lego-masters',
  'western',
  'fantasy',
  'space',
  'aquatic',
  'winter',
  'pirates',
  'mech',
  'theme-park',
  'forest',
  'landscape',
];

const toFile = (p) => p.replace(/-/g, '_');

const PER_PATH = {};
for (const p of PATHS) {
  const f = toFile(p);
  PER_PATH[p] = {
    scenes: load(`${f}_scenes`),
    lighting: load(`${f}_lighting`),
    palette: load(`${f}_palette`),
  };
}

module.exports = {
  CAMERA_AXIS: load('camera_axis'),
  PER_PATH,
  PATHS,
};
