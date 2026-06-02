#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_cozy_locations.json',
  total: 25,
  batch: 10,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY / SOCIAL / DOWNTIME location entries for StarBot's female-explorer and male-explorer paths. Each entry is a DENSE phrase (20-35 words) describing a SPECIFIC cozy / social / off-duty space-station-or-ship location where the explorer is CANDID at rest or socializing.

These are PLACES, not actions. The character will be IN this place, doing something peaceful. The location is the BACKDROP for relaxed downtime — they're off-duty.

CRITICAL AESTHETIC: Warm / inviting / fashionable / atmospheric / candid. Think cyberpunk nightclub but classy, ship-cabin bedroom with viewport showing a planet, station bar with neon and glowing alien-liquor-bottles, lounge with deep low couches, late-night ramen-bar in a station promenade, hot-tub-pod overlooking stars, candle-lit reading nook on a luxury liner. NOT puffy NASA-coded, NOT industrial.

Think Blade Runner 2049 noodle bar / Mass Effect Normandy lounge / Cyberpunk 2077 bar / Star Wars cantina (the cool kind) / Star Trek Ten-Forward / The Expanse cabin / Dune private quarters / Ad Astra moon-base bar.

━━━ LOCATION SPREAD (enforce variety across ${n}) ━━━

BEDROOM / PRIVATE QUARTERS (5-6):
- private ship-cabin bedroom with low platform bed, soft amber under-bed glow, viewport beside the bed showing a passing nebula, scattered datapads
- station-quarters with a window-bed alcove overlooking the planet below, plush throw-blankets, low-light lamps, art-pieces on the wall
- ship-cabin with a hammock-style sleeping pod, ambient soft-pink light, holographic plants, viewport showing twin moons
- luxury liner private-suite with king-sized bed under a glass-ceiling viewing the stars, plush rugs, dim chandelier-style ambient
- cozy small bunk-cabin with personal photos on a small shelf, soft glow-string lighting around the bunk, datapad propped on the pillow
- captain's-quarters lounge with a leather chesterfield couch, viewport showing a planet's rim, warm desk lamp, jazz-projection in the corner

BARS / CANTINAS (4-5):
- station bar with neon-glowing alien-liquor bottles behind the counter, dim warm lighting, mixed-species patrons in the booths blurred-distant
- noodle-bar inside a station promenade with steam rising from cooktops, neon-pink-and-cyan signage, fold-down counter seats — Blade Runner 2049 coded
- upscale cocktail-bar with chrome-and-leather stools, panoramic viewport behind the bar showing space, jazz-projection low in the corner
- dive-bar in the lower-decks with grime-aesthetic, neon-blue bar-glow, smoke-haze, mixed crew-and-spacers in the booths
- alien-cantina with curved booth-pods, bartender-droid behind the counter, multi-colored ambient lighting, alien-music-instrument live-projection

NIGHTCLUB / DANCE (3-4):
- cyberpunk nightclub with pulsing neon ceiling, dance floor lit from below, fog-haze with strobing light, distant DJ-station glow
- upscale lounge-club with low velvet seating around a central holo-projection of nebula clouds, ambient electronic-music vibration
- rooftop-club on a station with open-air dance floor, the planet huge and curving on the horizon, neon-piped seating around the perimeter
- alien rave-cavern in an underground station-level, glow-strip walls, crowd-glow blurred in distance, signature beat-pulse atmosphere

LOUNGE / REC (3-4):
- crew rec-lounge with deep low couches around a holo-projector, holographic film mid-play, popcorn bowl on the table, soft ambient
- ship's library lounge with floor-to-ceiling holo-shelves of books, leather reading chair beside a viewport, single warm reading lamp
- spa-pod chamber with steaming alien-mineral water, recessed viewport showing stars, soft instrumental ambient, towels draped on chrome rails
- meditation-deck with low pillows arranged around a central glow-stone, viewport with a planet rising, candle-style holographic flames

CAFE / FOOD (3-4):
- station cafe with floor-to-ceiling viewport showing the docking bay, latte-art on a holographic-ceramic cup, alien pastries in a glass display
- night-market food-stall in a station promenade with steaming dumplings, alien spice-jars, stools at the counter, neon-glow-signs above
- private dining-pod for two with curved viewport showing a passing comet-trail, candle-style holographic flame between the place settings
- breakfast-galley with sun-tube light coming in through a station window, fresh fruit-bowl on the counter, kettle steaming on the induction plate

━━━ RULES ━━━
- Each entry is a SPECIFIC cozy / social / downtime place — not a vague descriptor
- 20-35 words — paint the location vividly with mood and detail
- Warm / inviting / atmospheric / fashionable — NOT puffy NASA, NOT industrial
- Blade Runner 2049 / Mass Effect Normandy / Cyberpunk 2077 / Star Wars cantina / Ten-Forward / Expanse / Dune private quarters tones
- DEEP SPACE context — viewports, station-windows, planet-views, nebula-glimpses encouraged
- Suitable for both male and female explorers (gender-neutral)
- Variety across all 5 categories above mandatory

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
