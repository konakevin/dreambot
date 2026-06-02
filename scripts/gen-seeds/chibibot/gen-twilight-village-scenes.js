#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} TWILIGHT-VILLAGE SCENE descriptions for CuddleBot's twilight-village path. Cozy night / twilight / lantern-lit / firefly-meadow / moonlit VILLAGES + COTTAGES + HAMLETS that the viewer wants to move into. The ARCHITECTURE and ATMOSPHERE are the hero — not the creatures. Pixar / Sanrio / Studio Ghibli / Beatrix-Potter / Owl-Who-Was-Afraid-of-the-Dark aesthetic. NEVER photoreal, NEVER documentary, NEVER scary.

Each entry: 18-28 words. ONE specific twilight-village scene with COZY ARCHITECTURE detail. The scene must READ as twilight / night (deep indigo + violet + warm-amber lantern-pop) — never just "dark".

━━━ CRITTER RULE — NON-NEGOTIABLE ━━━
EVERY entry MUST include at least one cute critter in the scene — hedgehog lighting a lantern, fox kit peeking from a window, owl perched on a chimney, bunny walking home with a glow-jar, mouse sitting on a porch swing. The CRITTER + the COZY VILLAGE together = the cute. Architecture alone is not cute — the critter adds the soul. Critter is peripheral (small in frame, not center) but ALWAYS PRESENT.

━━━ VILLAGE TYPES (mix broadly across all entries) ━━━
- Warm-window cottage row under stars — row of cottages with WARM-amber windows under a starry sky, cobblestone path, lantern-poles
- Lantern-lit village square at dusk — village square with paper-lantern-garlands strung overhead, fountain in center, cottages around
- Fairy-light-strung village — entire village wrapped in fairy-light strands, soft-glow on cobblestones, magical
- Firefly-meadow cottage cluster — cottages in a meadow filled with drifting fireflies, lantern-flowers along the path
- Moonlit lakeside hamlet — hamlet on a calm lake-edge, moon-reflection on water, cottages with warm-window-glow
- Glow-mushroom village — village lit by giant glowing mushroom-streetlamps, soft amber + bioluminescent-glow on cobblestones
- Observatory-treehouse village — telescope-treehouses cluster, vine-string-lights, star-charts, milky-way overhead
- Lantern-festival village — paper-lanterns drifting upward into the night sky from every cottage, soft glow
- Riverside-firefly village — village along a gentle river reflecting fireflies + moon, fern-curtain doorways, lantern-arches
- Sunset-fading-to-stars village — village at the transition twilight, last sun-pink at horizon, first stars visible, warm windows beginning to glow
- Constellation-pool village — village around a still reflecting-pool that mirrors the constellations overhead
- Autumn-twilight village — autumn-leaf-strewn village paths at twilight, warm-amber windows, jack-o-lantern-glow at every door
- Lantern-bridge village — village connected by lantern-strung wooden bridges over a moonlit stream
- Glow-jar-meadow village — meadow of cottages with jam-jar fireflies on every porch, warm pulsing glow
- Cottage-under-aurora — single hamlet under aurora-ribbons, warm windows, cool aurora-light on snow OR meadow
- Sleepy-village before bedtime — village winding down for the night, warm window-glow, smoke-from-chimneys, last lantern being lit
- Star-strewn-night cottage cluster — cluster of cottages under a milky-way sky, soft warm-window-glow, telescope on a porch
- Crescent-moon village — small hamlet under a giant crescent moon, lantern-paths, soft silvery moonlight
- Owl-and-acorn village — woodland village of acorn-house cottages at twilight, owl-figures perched on rooftops, lantern-glow
- Bedtime-story village — village with quilted-blankets on doorsteps, warm windows, candle-glow inside, soft-falling petals or snow

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Architecture rendered with obsessive cozy detail: cottages with WARM-amber window-glow against deep-indigo + violet sky, paper-lantern-garlands strung between rooflines, jam-jar firefly-lanterns on every porch, glow-worm streetlamps, smoke-curling-from-chimneys catching star-glow, fairy-light strands woven across plazas, moon-reflection in puddles or village ponds
- Twilight palette: deep indigo + violet sky + WARM-amber window-glow + lantern-pop + aqua-firefly-glow + milky-silver moon
- Stars + galaxy-bands + soft moon visible — always READ as twilight/night, never gray/dark
- The village feels LIVED IN — quilted-blanket on a doorstep, lantern hung in a window, telescope poked from a tree-fort balcony, baked-pie cooling on a windowsill
- Optional small peripheral creature (hedgehog, fox kit, owl, bunny, mouse, raccoon) doing something cute in the village
- Wonder + safety + warmth — twilight is COZY here, never scary or eerie

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary night / NO horror / NO menace
- NO eerie shadows / NO predator-eyes-glowing / NO creepy-forest
- NO storm-night / NO thunder-lightning-fear
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village-type + key-architectural-feature + creature-vs-empty + light-source. Vary VILLAGE-TYPE + LIGHT-FEATURE + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Warm-window cottage row under stars, cobblestone path, lantern-poles, smoke-curling-chimneys, deep-indigo sky with milky-way overhead, peaceful and empty"
- "Hedgehog lighting a porch lantern at twilight, cottage row behind with warm windows, paper-lantern garlands strung overhead, soft violet horizon"
- "Lantern-lit village square at dusk, fountain in center, paper-lantern-garlands strung overhead, cobblestone with warm-amber-glow, no creatures"
- "Fox kit walking home with a glow-jar down a firefly-meadow village street, drifting fireflies, lantern-flowers along the path, deep indigo sky"
- "Observatory-treehouse village at midnight, telescope-treehouses cluster, vine-string-lights, milky-way overhead, star-charts on plank walls"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
