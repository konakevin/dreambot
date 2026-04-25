#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/sky_phenomena.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SKY-AS-SUBJECT descriptions for EarthBot — the sky itself is the entire composition, not just a backdrop. Celestial and atmospheric spectacles viewed from Earth.

Each entry: 15-25 words. One specific sky phenomenon with a minimal ground anchor. No people.

━━━ CATEGORIES (mix across all) ━━━
- Mammatus clouds (bulging cloud pouches underlit by sunset, purple-orange mammatus fields)
- Milky Way arcs (galactic core over desert, star river reflected in alpine lake, Milky Way over ocean)
- Noctilucent clouds (electric blue ice clouds at polar twilight, rippled noctilucent sheets)
- Sun pillars (vertical light columns in ice crystal air, dawn pillars over frozen tundra)
- Zodiacal light (pyramid of light along ecliptic after sunset, false dawn in desert sky)
- Meteor showers (Perseid streaks over mountain silhouette, Geminid fireballs, Leonid storm)
- Crepuscular rays (god-rays fanning through broken cumulus, anti-crepuscular convergence)
- Iridescent clouds (nacreous mother-of-pearl clouds, corona around cumulus, cloud iridescence)
- Star trails (concentric circles around Polaris, equatorial star trails, moonlit star arcs)
- Twilight gradients (Earth shadow rising as belt of Venus, deep blue-to-orange horizon bands)
- Cloud formations (anvil thunderheads at sunset, shelf clouds, undulatus asperitas waves)
- Planetary conjunctions (Venus and Jupiter close together, crescent moon with earthshine)

━━━ RULES ━━━
- SKY fills 70-90% of the composition — ground is minimal silhouette or reflection
- Real astronomical and atmospheric phenomena only — no fantasy
- Mix dark sky, twilight, dawn, and daylight phenomena across entries
- No two entries should describe the same phenomenon from the same vantage
- 15-25 words each — expansive, awe-struck, precise language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
