#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/sensory_robot_smell.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts['robot'].smell,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
