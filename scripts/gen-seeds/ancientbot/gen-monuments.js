#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/monuments.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MONUMENTAL STRUCTURE descriptions for AncientBot. Each entry is 15-25 words describing a single colossal ancient structure or megalithic site — the kind that makes humans feel small. Pre-600 BC ONLY.

The monument should DOMINATE the frame. Everything else is context for its scale.

━━━ MONUMENT TYPES (mix across all) ━━━
- Pyramids (Great Pyramid under construction with ramps, Step Pyramid at Saqqara, Nubian steep pyramids at Meroe)
- Ziggurats (Ziggurat of Ur, Etemenanki/Tower of Babel, Chogha Zanbil)
- Colossal statuary (Great Sphinx with original painted face, Ramesses II colossi at Abu Simbel, Assyrian lamassu gate figures)
- Obelisks (quarry to erection, Hatshepsut's needle at Karnak, unfinished obelisk at Aswan)
- Megalithic sites (Gobekli Tepe T-pillars, Stonehenge trilithons, Carnac stone rows, Newgrange passage tomb, Malta temples, Easter Island moai precursors)
- City walls and gates (Walls of Babylon, Ishtar Gate, Hattusa lion gates, Mycenae lion gate)
- Dam and canal engineering (Marib Dam in Yemen, Sumerian canal headworks)

━━━ RULES ━━━
- Each entry describes ONE specific monument or megalithic site
- Include a sense of SCALE — mention tiny human figures, surrounding landscape, sky
- Some should show monuments being BUILT (construction ramps, workers, scaffolding)
- Others shown COMPLETE at their peak (painted, gilded, with ceremonial activity)
- Vary across all civilizations, not just Egypt
- 15-25 words
- NO medieval, NO Greek/Roman Parthenon/Colosseum, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
