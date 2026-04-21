#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/tranquil_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TRANQUIL MOMENT descriptions for StarBot's robot-moment path — human-moment activities a robot does in a peaceful setting. Meditating, reading, watching-sunrise, sleeping, gazing, tinkering.

Each entry: 10-20 words. One specific tranquil activity with setting hint.

━━━ CATEGORIES ━━━
- Meditating on a cliff overlooking alien sunset
- Reading a paper book in a quiet sunny nook
- Watching binary-sun-sunrise from rooftop
- Sleeping standing at charging station
- Gazing at starfield through observation window
- Tinkering with a mechanical puzzle on workbench
- Painting at an easel in sunlit room
- Playing chess by itself in garden
- Stargazing with telescope on hilltop
- Writing in a journal by lamp
- Fishing in quiet lake of alien world
- Tending plants in greenhouse
- Drinking tea in cozy quarters (simulated)
- Observing butterflies in meadow
- Sitting on bench watching rain
- Walking on beach at sunrise
- Playing guitar by campfire
- Sketching landscape in park
- Watching snow fall
- Napping against tree
- Carving wood thoughtfully
- Watching children play distant (robot observes from afar — no interaction)
- Listening to music through speakers
- Tending a zen-rock-garden
- Feeding ducks at pond
- Watching astronaut training distant
- Reading poetry aloud to empty room
- Examining petrified leaves
- Watching weather from window
- Birdwatching with binoculars
- Solo picnicking with sandwich
- Walking meditation along path
- Observing goldfish in pond
- Contemplating sculpture in gallery
- Holding flower carefully
- Observing night sky from rooftop
- Playing with cat peripherally

━━━ RULES ━━━
- HUMAN moments — things we recognize as human activities
- Robot is alone doing these (poignant juxtaposition)
- Peaceful + contemplative
- Include setting hint

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
