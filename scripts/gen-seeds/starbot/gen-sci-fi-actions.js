#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} dynamic BODY-SHAPING ACTIONS for sci-fi explorer characters in StarBot. Each describes what a character is physically doing RIGHT NOW — pose-first, caught mid-moment. 15-25 words each. Gender-neutral (used for both male and female).

━━━ WHAT THESE ARE ━━━
Freeze-frame moments of ACTION. The camera just clicked and caught this person mid-motion. The action shapes the body into a visually interesting SILHOUETTE that Flux can render clearly. Every action should create a DISTINCT body shape — arms in different positions, weight on different legs, torso at different angles.

━━━ POSE DISTRIBUTION (CRITICAL) ━━━
- 70%+ UPRIGHT — standing, striding, climbing, reaching, walking, scanning, aiming, leaning against something
- MAX 15% crouching/kneeling — and these MUST be dynamic (examining something, taking cover, repairing)
- MAX 10% athletic (vaulting, jumping ONTO something specific, sliding under)
- ZERO sitting, lying, watching, reading, meditating, resting — BANNED

━━━ ACTION CATEGORIES (spread EVENLY) ━━━
1. Tactical movement — striding with weapon ready, advancing through terrain, flanking
2. Scanning/observing — checking scanner, surveying from elevation, tracking something
3. Repair/technical — welding hull, adjusting equipment, calibrating device
4. Climbing/ascending — scaling rock face, climbing ladder, hauling up ledge
5. Combat ready — aiming weapon, taking cover, reloading while moving
6. Exploration — examining alien artifact, collecting sample, navigating terrain
7. Hauling/carrying — dragging salvage, shouldering heavy equipment, carrying wounded
8. Environmental response — bracing against wind, shielding eyes from light, steadying on unstable ground
9. Communication — gesturing to unseen team, checking wrist comm, signaling
10. Transition — holstering weapon while walking, removing helmet one-handed, switching tools mid-stride

━━━ DEDUP: VERB + BODY SHAPE ━━━
No two actions should create the same body silhouette:
- ARMS: one raised + one low, both gripping, reaching forward, bracing, carrying overhead, aiming two-handed, single-hand gesture, tool in one + weapon in other
- LEGS: wide stride, narrow climb-stance, single-knee-down, athletic lunge, balanced scan-stance, one-foot-on-elevation
- TORSO: leaning forward, twisted scanning, upright military, hunched technical, arched reaching
- WEIGHT: forward momentum, braced backward, centered balanced, one-sided load, climbing vertical

━━━ RULES ━━━
- BANNED positions: sitting, lying, watching passively, reading, meditating, sleeping, resting, floating, mid-air leaps with no surface contact
- Every action must be GROUNDED — feet on a surface, physically plausible
- Gender-neutral language — no "he" or "she"
- Describe the BODY POSITION and PHYSICAL ACTION, not the emotion or story
- 15-25 words per entry
- The action should be visually clear enough for Flux to render as a distinct pose

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
