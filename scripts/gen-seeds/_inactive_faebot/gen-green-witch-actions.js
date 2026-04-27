#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/green_witch_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} GREEN WITCH ACTION descriptions for FaeBot's green-witch path. Each entry is what a hedge witch / herbalist is DOING — practical plant magic, potion brewing, garden tending, herbal craft. Cozy but with real magic. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific herbalist action.

━━━ CATEGORIES TO COVER ━━━
- Grinding dried herbs with a stone mortar and pestle, green dust swirling
- Stirring a bubbling cauldron with a wooden spoon, color changing with each pass
- Tying bundles of lavender and rosemary, hanging them from a beam to dry
- Whispering to a seedling in a pot, watching it sprout upward at her words
- Pouring a glowing tincture through a cheesecloth filter into a dark bottle
- Kneeling in her garden pulling weeds, dirt on her hands and knees
- Reading a handwritten recipe book by candlelight, finger tracing the instructions
- Tasting a brew from a wooden ladle, eyes closed, judging the balance
- Gathering wild mushrooms in a wicker basket at the forest edge
- Pressing flowers between the pages of a heavy leather-bound book
- Feeding a familiar cat scraps while a potion simmers behind her
- Stringing dried chili peppers and garlic into a charm for the doorframe

━━━ BANNED ━━━
- Sitting passively / idle without task
- "Posing", "modeling", looking at the camera
- Second human figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + tool/ingredient involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
