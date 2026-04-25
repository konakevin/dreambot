#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_closeup_framings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CLOSEUP FRAMING descriptions for StarBot's cyborg-woman path. Each describes a tight camera shot focused on her face, neck, throat, shoulders, or upper chest — showcasing the intricate transition between organic beauty and ornate mechanical internals.

Each entry: 12-20 words. One specific tight framing that highlights ornate mechanical detail near her face.

━━━ WHAT THESE SHOTS SHOWCASE ━━━
The beauty is in the DETAIL — where organic skin meets chrome, where you can see tiny gears spinning beneath a translucent jaw panel, where fiber-optic cables emerge from behind her ear, where her segmented chrome neck connects to organic collarbone. These are the "look closer" shots.

━━━ FRAMING CATEGORIES (spread across all) ━━━
- Face filling frame, chrome jaw hinge visible, one eye mechanical iris aperture
- Side profile showing organic cheek transitioning to exposed chrome skull section
- Throat/neck shot — segmented chrome vertebrae with glowing cables between segments
- Over-shoulder showing exposed spinal column with glowing nodes
- Extreme closeup of her eye — mechanical iris shutters adjusting, targeting reticles
- Chin-up angle showing translucent throat panel with visible vocal mechanisms
- Back of neck showing where chrome spine meets organic hairline, cable bundles emerging
- Three-quarter view with transparent temple section showing neural processors
- Collarbone area where organic skin ends and chrome shoulder socket begins
- Hands near face — articulated servo fingers touching her own cheek panel
- Behind-ear detail — mechanical ear housing, brass resonance chambers, tiny LEDs
- Looking down at camera — underside of chin showing chrome jawline mechanics

━━━ RULES ━━━
- TIGHT SHOTS ONLY — face, throat, shoulders, upper chest maximum
- The point is ORNATE DETAIL — gears, wires, fiber-optics, circuits, translucent panels
- Her organic face is always visible and beautiful
- She is caught mid-expression or mid-glance, not posing

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
