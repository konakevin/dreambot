#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/arcade_rink.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARCADE & ROLLER-RINK scene descriptions for RetroBot — the neon-lit places a kid spent tokens and allowance, 1975-1995. No people visible. Pure scene/environment. This is RetroBot's DARK + NEON register — NOT golden hour.

Each entry: 10-20 words. One specific arcade or roller-rink scene or detail.

━━━ CATEGORIES ━━━
- Row of arcade cabinets glowing in the dark (CRT screens in attract mode, joysticks, coin slots, marquee art)
- Skee-ball lanes (worn wooden ramp, ball return, ticket dispenser spitting tickets)
- Pinball machine (lit backglass, flippers, plunger, tilt)
- Air hockey table (red puck, blower humming, scuffed white surface, neon scoreboard)
- Prize redemption counter (shelves of plush + cheap trinkets, ticket-counting wheel, glass case)
- Claw/crane machine (glass case, plush prizes, joystick, dollar slot)
- Token + change machine (dollar-bill slot, token cup, plastic token pile)
- Roller-rink floor (waxed maple wood, mirror disco ball overhead, neon "RINK" sign reflecting on the floor)
- Rental skate cubbies (rows of brown-and-orange quad skates, size numbers, worn carpet)
- Rink snack bar (nacho-cheese pump, ICEE machine, neon menu board, sticky linoleum)
- DJ booth at the rink (request slips, light board, vinyl crate, rope light)
- Carpeted walls in Memphis-style neon geometric pattern (zigzags, blacklight glow)
- Pizza-and-games hall in the dark (skee-ball + empty animatronic stage, party tables, NO characters)
- Foosball / table-hockey in a dim corner
- "HIGH SCORE" / GAME OVER glowing on a single cabinet screen in the dark
- Lockers + a wall of taped flyers and high-score lists

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes, no skaters
- 1975-1995 — no modern flat-screens, no LED, no smartphones
- DARK interior lit by NEON, CRT phosphor glow, blacklight, rope light, disco ball — never daylight, never golden hour
- Warm analog film-grain feel even in the dark
- Gender-neutral — boys and girls both lived this

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
