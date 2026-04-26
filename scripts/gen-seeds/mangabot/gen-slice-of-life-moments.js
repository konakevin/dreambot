#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SLICE-OF-LIFE MOMENT descriptions for MangaBot's slice-of-life path — quiet daily anime. Mundane-beautiful moments rendered with anime-melancholy-warmth. Shinkai Makoto / Sunrise / 5 Centimeters per Second energy.

Each entry: 15-30 words. One specific quiet daily anime moment.

━━━ CATEGORIES ━━━
- Schoolgirl at classroom window (empty room, afternoon light, summer heat)
- Kotatsu tea-warmth (girl under blanket-table, cat on top, snowy window outside)
- Balcony stargazing (teen on rooftop with drink, Tokyo distant, stars overhead)
- 2am convenience store (worker + customer under fluorescent, rain outside)
- Train commute at dawn (lone commuter, soft pink sunrise through windows)
- Bicycle ride through paddy-field road (schoolgirl, satchel, afternoon light)
- Rain-drenched walk home from school (umbrella, puddles, twilight sky)
- Summer festival aftermath (empty street with dropped flower, lantern still lit)
- Apartment-balcony laundry (hanging sheets, distant city, blue hour)
- Noodle shop late-night (steam rising from ramen, lone customer at counter)
- Train-station goodbye (two figures on platform, one boarding)
- School rooftop lunch (schoolgirl eating bento alone, clouds overhead)
- Public-bath anime interior (steam, wooden floors, no people front-facing)
- Temple-step sitting (schoolgirl reading manga on ancient stone)
- Vending-machine alley at 3am (warm light, someone making choice)
- Arcade at closing time (empty machines, neon, janitor sweeping)
- Bookshop quiet afternoon (customer browsing, warm wood, dust-motes)
- Apartment-interior rain (girl on floor reading, rain on window)
- Park-bench watching clouds (alone, afternoon light)
- Morning-commute-crowd silhouettes through subway
- Elevator interior alone (fluorescent + reflection)
- Cafe-window sketching (customer drawing, coffee, light through window)
- Waiting-for-train empty platform (snow falling, late winter)
- Old neighborhood quiet-street (cat on wall, evening light)
- Bathhouse outside-looking-in scene
- Hanami picnic quiet (lone person under sakura)

━━━ RULES ━━━
- Shinkai / slice-of-life anime aesthetic
- Mundane-beautiful / melancholy-warm / wistful
- Often single character by role
- Include specific environmental detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
