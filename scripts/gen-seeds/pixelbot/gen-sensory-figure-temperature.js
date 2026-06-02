#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/sensory_figure_temperature.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts.figure.temperature,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
