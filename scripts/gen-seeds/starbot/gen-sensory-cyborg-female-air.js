#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sensory_cyborg-female_air.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts['cyborg-female'].air,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
