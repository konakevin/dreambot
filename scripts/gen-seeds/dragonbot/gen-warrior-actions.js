#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DYNAMIC ACTION descriptions for fantasy characters. These are candid adventurer moments — things a warrior/ranger/mage does between battles. 8-15 words each.

━━━ BODY POSITION RULES (CRITICAL) ━━━
At LEAST 70% of actions must be UPRIGHT — standing, striding, walking, climbing, reaching, turning. The character looks POWERFUL and TALL in frame.

BANNED body positions (max 3 total across all ${n}):
- Kneeling
- Crouching
- Sitting
- Lying down
- Bending over
- Leaning against things

GOOD body positions:
- Striding with purpose through terrain
- Climbing up/over something
- Standing at an edge surveying
- Turning to look over shoulder
- Reaching up to grab something
- Pushing through obstacles
- Walking into wind/rain/storm
- Pulling weapon from back/sheath mid-stride
- Emerging from doorway/cave/water
- Ascending stairs/hillside

━━━ WHAT THESE ARE ━━━
Candid, natural moments caught mid-action. NOT posing, NOT fighting. The character is mid-motion doing something that shows off their full body and gear:
- Striding through rain-soaked ruins, cloak billowing
- Climbing ancient stone steps, hand on wall for balance
- Pushing through dense forest, blade clearing vines ahead
- Walking along cliff edge, wind whipping hair and cloak
- Emerging from cave mouth into blinding daylight
- Ascending a winding tower staircase, torch in hand
- Wading through waist-deep river, gear held high
- Turning sharply at a sound, hand flying to weapon

━━━ DEDUP ━━━
No two entries should have the same primary verb or body position. Every action produces a visually DISTINCT silhouette.

━━━ RULES ━━━
- NO combat, NO fighting, NO battle
- NO sitting still, NO standing still, NO posing
- NO looking at the camera
- Gender-neutral — works for any character
- These are ACTIVE moments — the character is mid-motion
- MOST actions should show the character UPRIGHT and MOVING

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
