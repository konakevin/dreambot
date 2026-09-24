/* global __dirname */
/**
 * faebot / enchanted-vista / foreground_anchor — the closest tactile element framing the scene,
 * softly out-of-focus; about half the originals open with "Painted".
 * Recipe: scripts/gen-faebot-pool.js `faebot_enchanted_vista_foreground_anchor`. Pool 2026-09-23: 200
 * entries over ~10 kinds ("Painted hanging vine draping…" ×13, "Painted lacy fern-fronds…" ×11 …).
 * Same idea = kind + position.
 */
const path = require('path');
const { faeAnchorPool } = require('../lib/faeAnchorPool');

module.exports = faeAnchorPool({
  name: 'faebot/enchanted_vista/foreground_anchor',
  poolFile: path.join(__dirname, '../../bots/faebot/seeds/faebot_enchanted_vista_foreground_anchor.json'),
  subject: 'the scene',
  painted: 'mixed',
  outOfFocus: true,
  framing: 'softly out-of-focus painted framing anchor',
});
