#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_types.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} DRAGON SCENE descriptions for DragonBot. Each entry is a complete fantasy-gallery-wall dragon scene — a specific dragon in a specific pose in a specific setting. Entries 20-40 words. Painterly concept-art fantasy gallery quality.

━━━ AESTHETIC NORTH STAR ━━━
Think Ted Nasmith / John Howe / Alan Lee / Frank Frazetta / Iain McCaig. The painterly tradition of Smaug-in-Erebor, the Nazgûl-on-Fell-beast, the dragon-over-Minas-Tirith, the ice-dragon above Skyrim's tundra. Grounded high-fantasy. The dragon is a MYTHIC ANIMAL — ancient, powerful, gnarly, weighty — in a believable natural environment with real physics. Concept-art-book-page quality.

━━━ GROUNDED HIGH-FANTASY — BANNED TROPES ━━━
NO surreal AI-looking weirdness:
- NO floating-crystal halos orbiting the dragon
- NO bioluminescent-glowing-everything
- NO rainbow-energy-blasts / neon-lightning-from-everywhere
- NO multiple-moons / aurora-explosion skies (unless specifically Arctic setting)
- NO physics-defying architecture surrounding the dragon
- NO crystalline-armor on dragons (scales only)
- NO overly-symmetric decorative arrangements

BANNED COMPOSITION CLICHÉ:
- NO "dragon with tail coiled/wrapped around a tower or building" — do NOT describe this ever

━━━ WHAT TO STACK (painter's recipe) ━━━
Each entry weaves together:
- Specific dragon species/variant (describe anatomy, scale-color, horn/wing/eye distinctive features)
- One primary pose (flying / diving / perched / sleeping / drinking / roaring / mid-breath / emerging / basking / patrolling / coiled-on-hoard / standing-ground / wing-drying / swimming / hunting / preening — vary widely)
- One natural setting (mountain / cave / cliff / forest / lake / tundra / volcanic-crater / coast / valley / canyon / fjord / waterfall — minimize architecture)
- Lighting moment (dawn / dusk / golden hour / storm-break / moonlit / misty-morning / backlit / firelight-from-within-cave)
- Atmospheric cue (mist, falling snow, drifting ash, breath-fog, storm-clouds, rain-break)
- Scale cue (tiny distant forest / tiny distant tower / mountain-range for scale / visible wing-beat wake)

━━━ HARD DIVERSITY CAPS (200 pool) ━━━
- Every entry distinct in species + pose + setting combination — no duplicates
- Max 20 dragons with castle/tower/architecture in scene (architecture is peripheral)
- Min 40 dragons in pure-wilderness settings (no architecture anywhere)
- Min 30 dragons in rest/sleep/quiet moments (not all action)
- Min 30 dragons in mid-flight or airborne compositions
- Min 20 dragons in subterranean/cave settings
- Min 20 dragons near water (lake/river/sea/waterfall)
- Spread species across the full mythology spectrum (western wyrm / eastern serpentine / wyvern / sea / ice / fire / shadow / ancient / young / skeletal / feathered / multi-headed / elemental / etc.)
- Cover day + night / summer + winter / desert + arctic / sky + underground

━━━ RULES ━━━
- NO humans, NO named IP dragons (no Smaug, Drogon, Toothless — archetypes only)
- NO "tail-wrapped-around-tower" composition
- Dragon is MYTHIC ANIMAL not magical-energy-beast
- Painterly concept-art — never photoreal, never 3D-cheap
- GROUNDED high-fantasy, Tolkien-canonical not Reddit-AI-fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
