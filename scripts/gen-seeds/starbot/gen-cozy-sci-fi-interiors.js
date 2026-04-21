#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cozy_sci_fi_interiors.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY SCI-FI INTERIOR descriptions for StarBot's cozy-sci-fi-interior path — the ONE warm path. Cozy sci-fi pockets. Personal quarters + plants + nebula view. Space-station cafe. Captain's study with holo-star-map. Greenhouse module with starfield view.

Each entry: 15-30 words. One specific cozy sci-fi interior.

━━━ CATEGORIES ━━━
- Personal quarters with plants + nebula view (bed, jade plants, window to nebula)
- Space-station cafe (warm booths, steaming drinks, starfield window)
- Captain's study (desk with holo-star-map, leather chair, warm lamp)
- Greenhouse module with starfield view (plants + space visible through dome)
- Sleep-pod pre-jump (cozy private pod with view)
- Observation-lounge (soft chairs, panoramic window onto planet)
- Tea-service nook in ship (small warm corner with kettle + books)
- Lab observatory (telescope + rug + rocking chair + cosmic view)
- Bunk-with-stars (crew bunk with personal porthole to space)
- Ship galley cozy (small kitchen with plants, warm lights)
- Reading-nook with earth-plant (curled reader-chair with actual earth-plant)
- Quiet cafeteria after-shift (warm orange glow, few occupants)
- Orbital-hot-tub (hot-tub room with planet-view window)
- Private-pod library (pod with personal book-collection + tea)
- Space-cabin log-burner (wood-stove in space-cabin — cozy juxtaposition)
- Crew-lounge movie-night (warm pit-seating with screen showing Earth)
- Holographic-garden (illusion-garden you can step into while in space)
- Retro-console gaming-nook (warm arcade cabinets in space-station rec)
- Vintage-phonograph listening-room (analog records in futuristic space)
- Sunroom-pod (solar-focused room with sun-warmth in ship)
- Shared-dining warm-table (multi-crew meal with warm lighting)
- Knitting-circle-in-zero-g (chairs + yarn + stars visible)
- Bonsai-tree pod (carefully tended tiny tree in corner)
- Pet-dog-in-space nook (actual dog in crew quarters — warm)
- Ship-bakery (warm yeasty kitchen producing bread in space)
- Mail-call nook (physical letters from Earth, warm sentiment)
- Painting-studio-in-space (easel with view of nebula being painted)
- Tea-ceremony chamber (Japanese-inspired cozy warm space)
- Chess-table cozy (two cozy chairs with chess by window)
- Fireplace-in-spacestation (fake fire-plasma-sim + cozy rug)

━━━ RULES ━━━
- WARM + cozy — the only warm path
- Personal / intimate / cozy-juxtapose-with-space
- Plants + wood + tea + books + soft light in sci-fi setting

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
