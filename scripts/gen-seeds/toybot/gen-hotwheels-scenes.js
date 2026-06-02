#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/hotwheels_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `Write ${n} HOT-WHEELS / MICRO-MACHINES toy-car scenes for ToyBot's hotwheels-city path. ENSEMBLE energy on real-world household surfaces. Each entry 20-32 words.

━━━ HARD RULES ━━━
- 70%+ entries: MULTIPLE cars (3+) in race / chase / pile-up / parade / car-show / pit-crew / demolition-derby / starting-grid / finish-line.
- 70%+ settings: HOUSEHOLD or EVENT-DRIVEN — birthday-party / BBQ / Christmas / sleepover / garage-workshop / kitchen-breakfast / driveway / bedroom-rug / pool-deck / patio / family-room / Halloween-driveway / cul-de-sac.
- Desert/sandbox/canyon/lava combined: <15% of entries.
- LEGO / army-men / plush as spectators or pit-crew OK.

━━━ CARS ━━━
1:64-scale die-cast (~3-inch), chrome accents, oversized wheels, racing-stripes / flame-decals. Archetypes: muscle car, hot rod, monster truck, dragster, low-rider, off-roader, rally car, sports coupe, semi, ice-cream van, fire engine, police cruiser, ambulance, formula racer, drag funny-car, stunt-cycle. Non-IP.

━━━ EXAMPLE ARCHETYPES (rotate, vary) ━━━
- Backyard birthday-party rally — 6-car race-pack circling cake-table, balloon cluster, plush spectators
- Driveway demolition-derby — 5 monster-trucks crashing chalk-circle arena, LEGO refs at corners
- Garage drag-strip — twin Hot Wheels at black-tape start, 6 spectator-cars at edge
- Bedroom-rug pursuit — 4-car police-chase across geometric-rug city blocks
- Living-room highway pile-up — 6-car chain-collision on hardwood interstate
- Christmas-morning racing — 6 cars circling Christmas-tree base, gift-wrap billboards
- Pool-deck splash-race — 5 cars hydroplaning across pool-cover, life-jacket spectators
- Driveway car-show — 12 cars parked in display-row, awning-tents
- Cul-de-sac block-party — race-pack on chalk track, LEGO neighbors waving
- Sleepover megacourse — 10-car race weaving between couch-cushions
- Halloween-driveway haunted track — 4 cars dodging plastic-skeleton obstacles
- Bath-time regatta — 6 die-cast bath-toys floating, kid's bath-toy ducks as marshals

(Solo entries OK <30%, must have specific household/event context — never "single car on track" alone.)

━━━ MUST-HAVE per entry ━━━
- 1:64-scale / die-cast / chrome / oversized-wheel language
- Real-world household surface OR event setting
- Mid-action verb (mid-race / mid-drift / mid-collision / mid-launch / mid-pile-up)

━━━ BANNED ━━━
- IP-named brand models, real cars, real driving, CGI, illustration, human drivers, generic "track" with no context.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
