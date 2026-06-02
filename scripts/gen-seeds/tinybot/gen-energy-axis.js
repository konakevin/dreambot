#!/usr/bin/env node
/**
 * ENERGY axis pool — 15 entries.
 *
 * Forces TinyBot to render with mood beyond its default "peaceful warm
 * twilight cozy". Pushes for tension, urgency, drama, eerie quiet, etc.
 *
 * Each entry: 8-15 words. One specific emotional/energetic state with
 * concrete VISUAL cue (since mood alone is invisible — we need pose,
 * compositional tension, action freeze, stillness signals).
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 15;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/tinybot/seeds/energy_axis.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 15),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENERGY/MOOD-OVERRIDE descriptions for TinyBot — distinct emotional registers that push renders beyond the default "peaceful warm twilight cozy".

Each entry: 8-15 words. The MOOD/ENERGY + the VISUAL EXECUTION CUE (what makes it readable in a still — pose, composition, motion, stillness).

━━━ CATEGORIES (span ALL — break the cozy default) ━━━
- PEACEFUL STILLNESS (everything paused, calm air, balanced symmetry, soft breath)
- GATHERING-STORM TENSION (charged stillness before chaos, pregnant pause, ominous calm)
- POST-STORM CALM (aftermath, water dripping, debris settled, fresh-washed quiet)
- HOPEFUL DAWN (rising energy, first light, awakening, beginning-of-day brightness)
- ANXIOUS TWILIGHT (uneasy in-between time, lengthening shadows, something-not-right)
- JOYFUL NOON (full bright energy, abundance, peak-celebration, motion and life)
- EERIE MIDNIGHT (uncanny stillness, single small light in vast dark, isolation)
- BUSTLING ACTIVITY (mid-motion freeze, multiple things happening, kinetic frame)
- CONTEMPLATIVE QUIET (one element in focus, vast space around, meditation)
- DRAMATIC URGENCY (mid-action, leaning-into-motion, something-about-to-happen)
- WHIMSICAL PLAYFUL (impossible fun composition, juxtaposition humor, delightful surprise)
- MELANCHOLIC NOSTALGIA (faded warmth, abandoned-but-gentle, memory-tinted)
- WONDER AWE (small subject overwhelmed by scale, looking-up perspective, sublime)
- INTIMATE COZY (two things close together, shared moment, gentle warmth — KEEP this option but don't dominate)
- SECRETIVE HIDDEN (subject tucked away, peeking-out composition, discovery)

━━━ FORMAT ━━━
"{MOOD/ENERGY}, {VISUAL EXECUTION CUE — composition / pose / motion / stillness signal}"

Examples:
- "Gathering-storm tension, all elements held still in charged silence, ominous low light suggesting something coming"
- "Eerie midnight isolation, vast dark space with single tiny light source as only focal point"
- "Bustling activity, mid-motion freeze of multiple subjects in different action states, kinetic energy"
- "Wonder awe, low-angle composition with tiny subject framed against towering element, looking-up perspective"
- "Post-storm calm, water still dripping, leaves settled, the quiet AFTER a chaotic event"
- "Dramatic urgency, subject leaning into forward motion, composition pulls eye in chase direction"

━━━ HARD RULES ━━━
- Each entry must have BOTH the mood AND a concrete visual cue (composition / pose / stillness signal).
- LIMIT "cozy / warm / intimate" to AT MOST 2 entries — the point is BREAKING that default.
- NEVER mention tilt-shift, miniature, scale, or warm-palette (those come from elsewhere).
- The energy OVERRIDES the scene's natural mood — a cottage village should still get "anxious twilight" or "dramatic urgency" if rolled.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
