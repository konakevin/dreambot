#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/sensory_female_air.json',
  total: 100, append: true, batch: 25,
  metaPrompt: metaPrompts.female.air,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
