#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/human_activity.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} BACKGROUND HUMAN ACTIVITY descriptions for AncientBot. Each entry is 10-18 words describing what tiny background figures are DOING in an ancient civilization scene. These people are TEXTURE, not subjects.

These compose with separate architecture/location pools — describe ONLY the human activity, not the setting.

━��━ ACTIVITY TYPES (mix across all) ━━━
- Commerce (merchants weighing goods on balance scales, donkey caravans arriving, potters selling wares)
- Construction (laborers hauling stone blocks on sledges, mud-brick layers, rope-and-ramp teams)
- Agriculture (farmers with bronze sickles, irrigation channel tenders, grain threshers, ox-drawn plows)
- Craft (bronze-smiths at crucibles, weavers at looms, potters at kick-wheels, bead-makers drilling carnelian)
- Religious (priests carrying offering trays, incense bearers, temple sweepers, sacred animal handlers)
- Military (guards at gates with bronze spears, chariot teams drilling, archers on walls)
- Daily life (women carrying water jars on heads, children chasing geese, fishermen mending nets, scribes with clay tablets)
- River/water (boatmen poling reed craft, washerwomen at river steps, water carriers with yoked buckets)

━━━ RULES ━━━
- Each entry describes ONE specific group activity
- These are TINY BACKGROUND FIGURES — describe what they're doing, not who they are
- Period-accurate tools and materials (bronze, not iron; clay tablets, not paper; linen, not wool)
- Dynamic actions — people DOING things, not standing around
- 10-18 words
- NO modern activities, NO medieval activities

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
