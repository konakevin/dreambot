#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROOFTOP-SURPRISE-ELEMENT entries — small Tokyo-rooftop secondary subjects at midground/background.

Each 10-18 words. Element + placement + rooftop-Tokyo implication.

VARIETY:
- 16% URBAN-DISTANT (skyline in deep distance with neon-glow / billboards in deep background / hovercar light-trail past horizon)
- 14% PET (cat curled at rooftop-edge / dog at her feet / bird-on-rail / mouse-peeking-from-vent)
- 12% PEOPLE-NEARBY (laundry-line with sheets / smoker in deep background / co-worker on phone at far edge)
- 10% TECHNOLOGY (vending-machine at rooftop / AC-unit at midground / antenna-array / TV-mast)
- 10% NATURE-ROOFTOP (potted-plant at midground / dandelion growing in crack / weed in concrete / rose-bush in pot)
- 8% TRAFFIC (delivery-bike-shadow in deep distance / car-headlights sweeping past in alley below / train-pulling-out at horizon)
- 6% FOOD-PROP (grill smoking at midground / sake-bottles on table / boba-cups on bench)
- 6% MUSIC (amp at midground with cable / harmonica on bench / music-stand with sheet)
- 6% PRINT/SIGNAGE (rooftop-signage in deep background / banner flapping at midground / poster-on-wall)
- 6% CELESTIAL (first-stars appearing / moon rising in deep distance / passing-jet contrail)
- 6% TEMPORAL (fading-firefly in deep dusk / dust-motes catching sunset / steam rising from vent)

DO write:
- Skyline in deep distance with neon-glow pulsing softly, blurred haze of city-light
- Black cat curled at rooftop-edge in deep midground, sunset-warm fur catching light
- Laundry-line with sheets flapping in midground, golden-hour catching white-cloth
- Vending-machine glowing pink-cyan at rooftop in midground, drink-bottles visible
- Potted plant at midground with leaves catching sunset shaft

DO NOT: anything foreground competing / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
