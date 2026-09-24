/* global __dirname */
/**
 * faebot / forest-fairy-scene / foreground_anchor — the closest tactile element framing her.
 * Recipe: scripts/gen-faebot-pool.js `faebot_forest_fairy_scene_foreground_anchor` (type + position +
 * tactile detail, 20-40 words, frames her without blocking; no creature / biome / weather / modern).
 * Pool 2026-09-23: 260 entries over ~20 kinds ("Cluster of red-and-white spotted…" ×9, "Drifting
 * cherry-blossom petal-cluster…" ×9, "Weeping willow branches…" ×8 …). Same idea = kind + position.
 */
const path = require('path');
const { faeAnchorPool } = require('../lib/faeAnchorPool');

module.exports = faeAnchorPool({
  name: 'faebot/forest_fairy_scene/foreground_anchor',
  poolFile: path.join(__dirname, '../../bots/faebot/seeds/faebot_forest_fairy_scene_foreground_anchor.json'),
  subject: 'her',
  painted: 'none',
  outOfFocus: false,
  framing: 'framing her without blocking',
});
