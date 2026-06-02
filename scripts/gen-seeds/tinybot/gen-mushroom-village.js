#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/mushroom_village.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} MUSHROOM-VILLAGE scene descriptions for TinyBot — fungal civilization at miniature diorama scale. Toadstool houses with carved doors and warm windows, acorn-cap roofs, lantern-mushrooms lighting moss paths, lichen carpets, fern canopies overhead, beetle-shell carts. Smurfs / Brambly Hedge / Beatrix Potter / Studio Ghibli energy at tilt-shift miniature scale. The mushrooms ARE the architecture.

Each entry: 18-28 words. ONE specific mushroom-village scene with fungal architecture + forest-floor environment.

━━━ MUSHROOM TYPES AS ARCHITECTURE (mix broadly) ━━━
- Red-and-white amanita house — domed roof, white-spotted crown, carved oak door
- Brown porcini tower — stout pillar with windows climbing the stalk
- Golden chanterelle terraced cottage — frilled cap with stepped balconies
- Pale puffball dome — round earth-house with chimney
- Inky-cap belltower — slender spire with a hanging acorn-bell
- Honey-mushroom apartment cluster — many small caps growing as a complex
- Bracket-shelf-mushroom balcony — horizontal cap as a hanging porch
- Lantern-mushroom streetlamp — bioluminescent cap glowing on a stalk
- Morel honeycomb wall — pitted cap as a textured tower facade
- Trumpet-mushroom horn-tower — flared cap as a watchtower
- Lion's-mane shaggy guesthouse — fuzzy cap as a thatched roof
- Bluebell-mushroom chapel cluster — pale-blue caps gathered around a clearing

━━━ VILLAGE STRUCTURES TO MIX IN ━━━
- Twig bridges over moss-streams
- Acorn-cup chimneys with smoke
- Snail-shell mailboxes
- Beetle-elytra weather vanes
- Pebble-paved village squares
- Spider-silk washing lines
- Leaf-canopy market stalls
- Stick-and-bark fences
- Mossy benches around fern fountains
- Birchbark scrolls hanging from notice boards

━━━ FOREST-FLOOR ENVIRONMENT (always grounded) ━━━
- Moss carpets, fallen leaves as plazas, pebbles as paving
- Fern canopies overhead filtering dappled sun
- Tree-roots as bridges, fallen-log boulevards
- Babbling streams with mushroom-cap-mills
- Glow-worm string-lights, firefly lanterns at dusk

━━━ TIME-OF-DAY / SEASON SPREAD ━━━
- Dappled-sunlight afternoon (warm gold filtering through ferns)
- Foggy morning (mist between toadstools, dew on caps)
- Lantern-lit dusk (warm window glow, glow-worm strings)
- Rainy day (raindrops on caps, puddles in moss)
- Snowy winter (snow-dusted toadstool roofs, smoke from chimneys)
- Autumn (leaf-strewn paths, jewel-toned fern canopy)
- Spring bloom (wildflowers between caps, fresh moss)

━━━ ABSOLUTELY BANNED ━━━
- NO identifiable humans (this is fungal civilization, not Smurf-cosplay-humans)
- NO cartoon eyes/mouths on the mushrooms — mushrooms are ARCHITECTURE not characters
- NO modern items (no cars, smartphones, neon signs)
- NO grim / scary mushrooms (no death-cap horror, no decay) — keep it cozy + magical
- NO sexualized characters
- NO IP characters (no Smurfs, no Mario)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: mushroom-type + village-feature + season/time. "Red toadstool house in moss" and "amanita cottage on a moss path" are TOO SIMILAR. Vary the FUNGUS + the STRUCTURE + the SEASON across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Cluster of red-and-white amanita cottages along a moss-paved lane, twig-bridges over a fern-stream, acorn-cup chimneys puffing dusk-smoke"
- "Tall brown porcini tower with three glowing windows, snail-shell mailbox at the carved oak door, mushroom-cap streetlamps on a pebble path"
- "Lantern-mushroom plaza at dusk with bioluminescent caps lighting a beetle-shell market, spider-silk washing lines strung between toadstools"
- "Snow-dusted bracket-mushroom balconies on a hillside cluster, smoke from acorn-cup chimneys, glow-worm lanterns at every door"
- "Foggy morning in a chanterelle terrace village, dewdrops on golden frills, leaf-canopy umbrellas folded by mossy benches"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
