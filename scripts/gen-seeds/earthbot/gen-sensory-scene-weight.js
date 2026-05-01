#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/sensory_scene_weight.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts.scene.weight,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
