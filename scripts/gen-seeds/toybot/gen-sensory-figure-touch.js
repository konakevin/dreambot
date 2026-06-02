#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/sensory_figure_touch.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts.figure.touch,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
