#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cozy_sci_fi_interiors.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY SCI-FI INTERIOR descriptions for StarBot's cozy-sci-fi-interior path — the ONE warm path. Cozy pockets inside sci-fi settings. WIDE VARIETY of locations — NOT just "room with a window to space."

Each entry: 15-30 words. One specific cozy sci-fi interior.

━━━ CATEGORIES (spread evenly across ALL of these) ━━━
NATURE-IN-SPACE (~25%):
- Ship greenhouse with exotic alien planters, vines climbing bulkheads
- Flower garden inside rotating habitat ring, artificial sunlight, butterflies
- Hydroponics bay with strawberry rows, warm grow-lights, soil smell
- Terrarium collection — miniature ecosystems in glass spheres, bioluminescent moss
- Arboretum dome with actual trees, park bench, birds imported from Earth
- Zen rock garden in meditation module, raked gravel, bonsai

FUNCTIONAL SPACES MADE COZY (~25%):
- Ship's bridge at ease — dim running lights, captain's coffee mug, quiet hum
- Science lab after-hours — microscope left on, tea cooling, specimen jars glowing softly
- Engineering bay — warm tool-bench with brass instruments, oil lamp, blueprints spread
- Navigation room — holo-star-charts floating, leather chair, whiskey decanter
- Medical bay at night — single reading lamp, sleeping patient, warm blankets
- Communications room — radio static crackling softly, operator's half-eaten sandwich

LIVING QUARTERS (~25%):
- Personal cabin with plants + nebula view through porthole
- Space-station cafe — wooden booths, steaming drinks, starfield window
- Captain's study — desk with holo-star-map, leather chair, warm lamp
- Crew lounge movie-night — pit-seating, projected Earth nature film
- Ship galley — small kitchen with hanging herbs, warm Edison bulbs
- Observation lounge — deep cushions, panoramic window onto ringed planet

UNEXPECTED COZY (~25%):
- Cargo bay corner claimed as reading nook — crates as shelves, hammock, fairy lights
- Spacesuit locker room — steamy after EVA, towels, warm coffee waiting
- Docking bay at dawn shift — first light through hangar doors, morning routines
- Abandoned section reclaimed as garden — vines growing through old circuitry
- Zero-g aquarium — tropical fish in floating water-sphere, warm blue light
- Rooftop of space station — artificial sky dome, park bench, simulated sunset

━━━ RULES ━━━
- WARM + cozy — the only warm path
- VARIETY IS CRITICAL — spread across ALL categories above, not 80% window-views
- Window/porthole scenes are great but should be ~20% of pool, not dominant
- Plants + wood + tea + books + soft light in sci-fi setting

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
