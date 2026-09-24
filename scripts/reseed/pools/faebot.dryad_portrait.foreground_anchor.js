/* global __dirname */
/**
 * faebot / dryad-portrait / foreground_anchor (40%-gated) — the closest tactile element framing her
 * face, softly out-of-focus, every entry in the "Painted …" register.
 * Recipe: scripts/gen-faebot-pool.js `faebot_dryad_portrait_foreground_anchor`. Pool 2026-09-23: 200
 * entries over ~20 kinds ("Painted hanging moss-curtain…" ×9, "Painted weeping willow…" ×8 …).
 * Same idea = kind + position.
 */
const path = require('path');
const { faeAnchorPool } = require('../lib/faeAnchorPool');

module.exports = faeAnchorPool({
  name: 'faebot/dryad_portrait/foreground_anchor',
  poolFile: path.join(__dirname, '../../bots/faebot/seeds/faebot_dryad_portrait_foreground_anchor.json'),
  subject: 'her',
  painted: 'all',
  outOfFocus: true,
  framing: 'painted intimate framing without obscuring her face',
});
