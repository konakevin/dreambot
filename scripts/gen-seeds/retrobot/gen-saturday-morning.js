#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/saturday_morning.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} SATURDAY MORNING scene descriptions for RetroBot — the ritual of waking up early to watch cartoons, 1975-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific Saturday morning scene or setup.

━━━ CATEGORIES ━━━
- Living room TV setups (rabbit ears, wood-grain console TV, static between channels)
- Cereal bowls + spills on carpet (Cap'n Crunch, Froot Loops, Lucky Charms, milk rings)
- Blanket/pillow nests in front of TV
- Morning light through blinds onto carpet/wood floor
- TV trays with cereal + juice
- Remote controls (big clunky ones, UHF/VHF dials)
- Cartoon-themed items (lunchboxes, thermoses, PJs, slippers)
- Saturday morning newspapers/TV Guide on the couch
- Toy commercials on screen (action figures, board games, sugary cereal ads)
- VCR recording the shows (blinking 12:00)
- Couch cushion forts built for viewing
- Kitchen counter with Pop-Tarts box, Tang pitcher, orange juice carton

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 era only — no flat screens, no smartphones, no modern cereal brands
- Sensory: warm morning light, carpet texture, cereal crunch, TV static hum
- Gender-neutral — both boys and girls did this

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
