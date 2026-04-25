#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_characters.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CYBORG WOMAN visual descriptions for StarBot. Each describes a specific half-human half-machine being — what she LOOKS LIKE mechanically. NOT mood or archetype — PHYSICAL MECHANICAL DETAIL that Flux can render.

Each entry: 50-70 words. Describe which body parts are chrome/metal, which are translucent showing internal workings, where the glow comes from, what her organic face looks like, what textures and materials are visible. This is a BUILD SHEET for a visual, not a character bio.

━━━ WHAT EACH ENTRY MUST DESCRIBE ━━━
- Her FACE: organic, beautiful, specific ethnicity or alien-skin (the only fully human part)
- Which LIMBS are mechanical: chrome arms with visible servo joints, articulated fingers, hydraulic pistons
- TRANSLUCENT SECTIONS: where you can see INTO her body — clear polymer torso panels, transparent skull section, acrylic forearms showing internal structure
- POWER CORE: a glowing reactor/energy source visible THROUGH a translucent body section
- SURFACE TEXTURES: engravings, patina, filigree, circuit etchings, brushed metal, carbon fiber weave — NOT smooth sealed armor
- EXPOSED INTERNALS: gears, wires, fiber-optic cables, hydraulic lines, spinning gyroscopes visible through gaps and panels

━━━ MATERIAL VARIETY (spread across entries) ━━━
Chrome, brushed titanium, polished brass, copper, rose-gold, matte carbon fiber, obsidian glass, ceramic, jade-green biotech, translucent acrylic, frosted polymer, iridescent holographic, corroded steel, blackened bronze, pearlescent white. MIX 2-3 materials per entry.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: dominant material combo + which body regions are mechanical vs organic + translucent section placement + face ethnicity

━━━ RULES ━━━
- She is NOT wearing a suit or armor — her body IS the machine. Visible joints, seams, panels, exposed hydraulics
- NOT a woman in a jumpsuit. You should see BARE MECHANICAL STRUCTURE — chrome bones, piston joints, cable bundles
- Every entry must have at least one TRANSLUCENT section showing internal workings
- Vary face ethnicity widely (dark skin, Asian, freckled pale, alien green/lavender/obsidian)
- Sexy through silhouette and curves, not through nudity. Rated R not X
- Include personality/threat energy in the last line (predator, oracle, assassin, etc.)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
