#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/emotional_tones.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} EMOTIONAL TONE descriptors for GlowBot — each is a specific feeling the render must evoke. Explicit emotional target per render. Every entry is a relaxed/awe-inspired/at-peace emotion.

Each entry: 8-16 words. Name the specific emotional tone.

━━━ CATEGORIES ━━━
- Hushed reverence (sacred quiet, temple-like reverent, breath-held wonder)
- Gentle awe (soft-awed, wonder-struck, breathless-calm)
- Golden calm (warm peace, serene golden, gentle glowing stillness)
- Sacred quiet (silent sacred, hallowed hush)
- Dawn wonder (first-light wakefulness, gentle new-morning awe)
- Twilight serenity (dusk peace, fading-day calm)
- Starlit contemplation (under-stars reflection, cosmic-quiet)
- Celestial joy (heavenly bright peacefulness)
- Deep stillness (glass-calm, motionless wonder)
- Protected warmth (nestled-safe, cradled-light)
- Crystal clarity (sharp-clean peaceful)
- Drifting dream (half-sleep wonder, dream-logic peace)
- Soft communion (sacred-connection, felt-presence)
- Ancient patience (old-sacred, time-stopped reverence)
- Fresh renewal (washed-clean peacefulness)
- Drowsy afternoon (lazy-golden contentment)
- Magic-hour bliss (golden-minute stillness)
- Cradle-safe (nursery-warm, protected peaceful)
- Floating meditation (weightless-awareness, expansive-still)
- Moonlit reverie (silver-lit contemplation)

━━━ RULES ━━━
- All tones = relaxed / awe-inspired / at peace
- Specific emotional word-pairing
- Never intense, never dramatic-hard

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
