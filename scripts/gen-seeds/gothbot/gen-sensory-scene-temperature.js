#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/sensory_scene_temperature.json',
  total: 50,
  batch: 25,
  metaPrompt: metaPrompts.scene.temperature,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
