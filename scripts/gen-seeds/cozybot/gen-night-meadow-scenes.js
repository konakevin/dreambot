#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cozybot/seeds/night_meadow_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} NIGHT-MEADOW SCENE descriptions for CuddleBot's night-meadow path. Adorable twilight / nighttime / starlit / firefly / glow-worm / moonlit settings — meadow, forest clearing, glade, hill-top, garden, lily-pond at dusk. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Beatrix-Potter-twilight aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 15-25 words. ONE specific night-meadow scene with HABITAT details + cute interaction hint. The scene must READ as twilight / night (deep indigo + violet + warm-amber lantern-pop) — never just "dark".

━━━ HABITAT TYPES (mix broadly across all entries) ━━━
- Wildflower-meadow at twilight (dewdrop-grass, wildflowers as silhouette, fireflies above)
- Moonlit forest clearing (open clearing rimmed with trees, moonbeam down-light, soft mist)
- Starlit hill-top (gentle hill summit with starry sky stretching huge above, soft grass)
- Firefly garden at dusk (drifting firefly cloud, lantern-flowers, soft purple-pink twilight)
- Lily-pond moonlit (lily-pads on still water reflecting moon + stars, lotus-blossom umbrellas)
- Mushroom-cap tea party at night (giant mushroom-cap as table, glow-worm string lights, tiny lanterns)
- Backyard hammock-under-stars (slung hammock between two trees, milky way overhead, soft fairy-lights)
- Cottage-window starlit (cute cottage with warm window-glow, garden in front under starry sky)
- Hot-air-balloon at sunset (cute balloon ascending into pink-violet sky as stars appear)
- Comet-watching boulder (smooth boulder under sky with comet-streaks, cuddly creatures perched)
- Glow-worm-cave entrance (cave-mouth lit by glow-worm clusters like a galaxy on the ceiling)
- Birthday-cake under stars (tiny picnic with frosted cake, candle-glow, starry backdrop)
- Bedtime story log (cozy fallen log with quilt-blanket, lantern, big star-sky)
- Aurora meadow (rare meadow under aurora ribbons, cuddly creature pair gazing)
- Lantern-festival meadow (paper-lanterns drifting upward into night sky, soft glow on grass)
- Riverside fireflies (gentle stream reflecting fireflies + moon, fern-curtains)
- Tree-fort observatory (cute treehouse with telescope poking out, kids-style star-map nailed to wall)
- Sunset-fading-to-stars meadow (transition twilight, last sun-pink at horizon, first stars visible)
- Dragonfly-lantern meadow (dragonflies carrying tiny lanterns above tall grass)
- Constellation-pool reflection (still pool reflecting a clear constellation overhead)

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Twilight palette: deep indigo + violet + sky-pink-fade + warm-amber lantern + aqua-firefly-glow + milky-silver moon
- Stars + galaxy-bands + soft moon visible — always READ as twilight/night, never gray/dark
- Lantern / firefly / glow-worm / candle-flame as warm-amber point-light — accents and warms the cool sky
- Optional cute habitat-details (paper-lanterns, jam-jar fireflies, knitted blanket, twinkle-string-lights, mushroom-stools)
- The scene ANTICIPATES creatures — leave room for cute pair to do something cute (stargaze, share-cocoa, peek-from-blanket, paw-at-fireflies)
- Wonder + safety + warmth — twilight is COZY here, never scary or eerie

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary night / NO horror / NO menace
- NO eerie shadows / NO predator-eyes-glowing / NO creepy-forest
- NO storm-night / NO thunder-lightning-fear
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: habitat-type + key-feature + light-source. "Firefly meadow" and "meadow with fireflies" are TOO SIMILAR. Vary HABITAT + LIGHT-FEATURE + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Wildflower meadow at twilight, dewdrop-grass silhouettes, fireflies drifting like floating stars, soft violet-pink horizon, big moon rising"
- "Moonlit forest clearing, soft moon-down-beam through canopy gap, knitted-blanket on the moss, jam-jar firefly-lantern, milky-way overhead"
- "Mushroom-cap tea party at night, giant amanita-cap as round table, glow-worm string-lights, tiny lanterns, starry sky framing the scene"
- "Lily-pond moonlit, lily-pads reflecting moon + scattered stars, lotus-blossom umbrellas, soft mist over still water, distant fireflies"
- "Comet-watching boulder, smooth granite under sky with comet-streaks + galaxy-band, soft alpine grass, twinkle-string lantern between"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
