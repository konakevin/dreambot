#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_eye_colors.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SUPERNATURAL EYE COLOR descriptions for GothBot's female character paths. Each entry is a SHORT phrase (8-15 words) describing her eyes — color, glow, inner detail, the feeling they give. These compose with separate archetype/makeup/hair pools.

Her eyes are the most STRIKING thing in the frame. They should feel SUPERNATURAL — glowing, luminous, impossibly vivid. Not contact lenses, not color filters. Eyes that make you stop scrolling.

━━━ VARIETY SPREAD ━━━
- WARM GLOW (6-7) — molten amber irises with volcanic-orange fire in the inner ring, deep crimson with ember-glow like dying coals in darkness, burnished gold with dark-honey depth like candlelight trapped in glass, warm copper irises with rings of darker bronze
- COOL GLOW (6-7) — pale ice-blue with frost-white inner starburst, deep violet with silver-lightning veins through the iris, storm-grey with faint luminous green ring at the pupil edge, glacier-blue with cold white inner glow like starlight
- UNUSUAL / SUPERNATURAL (6-7) — one eye pale green one eye deep violet (heterochromia), mercury-silver irises that shift color in different light, pale lavender with rose-gold inner ring, absolute black sclera with one tiny point of amber light for an iris, venom-green with slit pupil like a serpent, opalescent white iris with faint rainbow shimmer
- DARK / INTENSE (4-5) — near-black irises with a faint ring of deep garnet at the edge, dark chocolate-brown with unexpected amber inner glow, obsidian-black with pinpoint crimson catchlight

━━━ RULES ━━━
- Each entry is a SPECIFIC eye description — color + luminance + inner detail
- SUPERNATURAL and VIVID — these eyes glow, they radiate, they're impossibly detailed
- Include how the eyes FEEL to look at — unsettling, magnetic, ancient, predatory
- No two entries should produce the same eye color
- Eyes should feel like they're the hero element of the portrait

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
