#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/travelbot/earth/seeds/sensory_scene_temperature.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts.scene.temperature,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
