#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { metaPrompts } = require('./sensoryMeta');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/sensory_female_lightcolor.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: metaPrompts.female.lightcolor,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
