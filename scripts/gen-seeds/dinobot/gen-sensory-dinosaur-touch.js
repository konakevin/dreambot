#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/sensory_dinosaur_touch.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts.dinosaur.touch,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
