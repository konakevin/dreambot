#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_female_moments.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CANDID MOMENT descriptions for GothBot's goth-closeup and goth-full-body female paths. Each entry is a SHORT phrase (8-15 words) describing what she was caught doing RIGHT NOW. These are micro-actions — the camera snapped at this exact instant.

She is SEXY, SULTRY, DANGEROUS, FEISTY — caught in a loaded candid moment. Not posing. Not modeling. Caught mid-something by a camera that shouldn't be this close.

━━━ VARIETY SPREAD ━━━
- OCCULT ACTIONS (5-6) — tracing a sigil in candle soot on her own collarbone, whispering an incantation with her eyes half-closed, cupping a glowing orb between her palms, drawing a tarot card and smirking at what she sees, blowing out a ritual candle with smoke curling past her face
- PREDATORY / CHARGED (5-6) — glancing over her shoulder with a knowing smirk, tilting her chin down and looking up through her lashes, running her tongue slowly across her lower lip, narrowing her eyes at something just out of frame, catching the viewer watching and not looking away
- ATMOSPHERIC (5-6) — pushing open a heavy iron door with one hand, letting rain stream down her face with her eyes closed, standing in a doorway backlit by candlelight, adjusting a ring on her finger with deliberate slowness, pulling a hood back from her face letting hair spill free
- INTIMATE / LOADED (4-5) — pressing her palm flat against a cold stone wall, exhaling smoke or mist into cold air, touching the hollow of her own throat with two fingers, leaning against a column with her head tilted back eyes closed, tucking a dark flower behind her ear

━━━ RULES ━━━
- Dynamic freeze-frame moments — no sitting, no lying down, no reading, no meditating
- Each is a SPECIFIC micro-action with body language
- Use "her" pronouns throughout
- CHARGED with intent — every moment should feel like something is about to happen
- No gore, no blood, no feeding, no violence
- No "posing", "modeling", "editorial" language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
