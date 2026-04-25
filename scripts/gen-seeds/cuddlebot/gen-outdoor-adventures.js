#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/outdoor_adventures.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} OUTDOOR ADVENTURE descriptions for CuddleBot's outdoor-adventure path — fun outdoor activities a cute creature is actively doing. Species-agnostic (creature placed later).

Each entry: 15-25 words. One specific outdoor activity with location details.

━━━ CATEGORIES ━━━
- Carnival / fair (riding tiny ferris wheel, winning oversized stuffed prize, cotton candy bigger than head, carousel ride)
- Camping (roasting marshmallow over campfire, setting up tiny tent, telling stories by firelight, sleeping bag under stars)
- Beach (building elaborate sandcastle, surfing tiny wave, collecting seashells in bucket, beach umbrella picnic, tide pool exploring)
- Lake / river (paddling tiny canoe, fishing with stick-and-string rod, skipping stones, floating on inner tube, feeding ducks)
- Stargazing (lying on blanket pointing at constellations, telescope on hilltop, catching fireflies in jar, naming stars)
- Picnic (spreading checkered blanket in meadow, unpacking oversized basket, chasing butterflies between bites)
- Hiking / exploring (tiny backpack and walking stick on forest trail, crossing log bridge, discovering hidden waterfall)
- Garden / farm (picking strawberries, riding in tiny wheelbarrow, watering sunflowers taller than self, apple picking with ladder)
- Festival / market (browsing tiny market stalls, carrying balloons, face-painting booth, flower crown making)
- Winter outdoor (ice skating on frozen pond, building snowman, sledding down tiny hill, catching snowflakes on tongue)
- Flying / floating (riding hot air balloon, dandelion-seed parachute, leaf-boat sailing, kite flying on windy hill)
- Playground (swinging on rope swing, sliding down mushroom slide, seesawing with friend, spinning on daisy merry-go-round)

━━━ RULES ━━━
- Creature must be ACTIVELY DOING the activity, not just standing nearby
- Every activity is FUN and JOYFUL — best day ever energy
- NO danger, NO scary situations, NO water deeper than wading
- Describe the activity and setting, not the creature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
