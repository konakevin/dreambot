#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_action_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL ACTION MOMENT descriptions for PixelBot's pixel-action path — dynamic action-moments.

Each entry: 15-30 words. One specific pixel action moment.

━━━ CATEGORIES ━━━
- Dragon-breath engulfing knight mid-dodge
- Warrior mid-leap across chasm with sword raised
- Spaceship dogfight mid-laser-exchange
- Monster standoff between hero and boss
- Wizard casting spell mid-gesture with glyphs
- Sword clash between two knights
- Archer firing arrow mid-flight
- Rogue leaping from rooftop
- Dragon-rider dive-bombing
- Necromancer summoning skeletons
- Mage shielding party from dragon-breath
- Paladin smiting undead
- Berserker mid-rampage
- Ninja mid-throw shuriken
- Pirate boarding ship mid-swing
- Astronaut escaping exploding ship
- Robot mech in city battle
- Witch on broom diving
- Valkyrie descending to battle
- Centaur mid-charge
- Wolf-pack hunt sprint
- Dragon battling giant bird
- Phoenix rising from ashes
- Knight-tournament lance-strike
- Magical duel energy collision
- Warrior running from avalanche
- Spaceship crash-landing
- Surfer riding massive wave
- Mountain-climber slipping on cliff
- Skier mid-jump off cliff
- Race-car mid-drift
- Motorcycle jump across gap
- Hang-glider soaring past mountain
- Parachute-trooper mid-drop
- Boxer mid-knockout
- Wrestler mid-slam
- Warrior parrying blow
- Archer defending wall
- Wizard opening portal
- Dragon crashing into tower
- Hero slaying boss
- Thief sneaking past guards (mid-move)
- Knight charging into battle
- Mecha mid-transformation
- Airship mid-battle over city
- Hero leaping off cliff

━━━ RULES ━━━
- Frozen peak-action moment
- Pixel-art renderable
- Dynamic composition

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
