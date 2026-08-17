#!/usr/bin/env node
// TinyBot Stage N1 (SHADOW) — tiny-winter-village. A snowy miniature village
// diorama: snow-laden roofs, frozen pond, string lights, a little winter
// market. SCENE pool = the layered constructed world; CAST pool = cute critters
// mid-action giving the village life. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tiny_winter_village.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} MINIATURE WINTER VILLAGE scene descriptions for TinyBot — a dollhouse-scale snowy village photographed with a tilt-shift macro lens. Think a hand-built model winter wonderland: matchbox cottages under thick snow, a frozen pond, string lights, a tiny winter market, glowing windows in the blue dusk. EXTERIOR views only, looking at the village like a model railway layout.

Each entry: 18-28 words. ONE specific snowy-village scene that is a MULTI-ELEMENT constructed world with clear DEPTH LAYERS (a near detail, the village midground, a fading far distance) — never a single object on a bare surface.

━━━ CATEGORIES (spread across all ${n}) ━━━
- Snow-laden cottage lane (thumb-sized chimneys puffing incense-smoke, warm window-glow, tiny footprints in fresh powder, string lights strung between eaves)
- Frozen village pond turned skating rink (glassy resin ice, a bonfire brazier the size of a bead, snow-dusted benches, lantern posts)
- Tiny winter market square (striped stalls under snow, wreaths and garlands, a bead-sized bonfire, crates of miniature oranges and pinecones, bunting)
- Sledding hill above the rooftops (a winding packed-snow run, tiny toboggans, pine trees like bottle-brushes, the village lights glowing below)
- Snowy stone bridge over a half-frozen stream (icicles like glass slivers, mossy snow-capped stones, a lantern reflected in dark water)
- Alpine cottage cluster (snow-heavy timber roofs, woodpiles, a water-wheel iced mid-turn, smoke rising into a lilac dusk)
- Village at blue hour (every matchbox window glowing amber, lanterns down the lane, deep-blue snow shadows, a single warm doorway open)
- Tiny snow-covered church and green (a stone steeple with a frosted bell, a lychgate under snow, candle-glow through arched windows)
- Frost-morning village (hoarfrost furring every twig, pale gold low sun, breath-mist, long blue shadows across untouched snow)
- Snowfall in progress (fat flakes caught in the light, softened rooflines, warm interiors glimpsed, a lamplighter's lantern haloed)
- Icicle-hung harbor village (tiny fishing boats iced at the dock, snow on the pilings, a frosted lighthouse, a lantern on the quay)
- Winter garden allotments (greenhouses glowing, snow-capped beehives, a robin on a frosted fence, cloches like glass thimbles)

━━━ SCALE RULE ━━━
Every scene reads MINIATURE / DOLLHOUSE / DIORAMA. Use scale cues: thumb-sized chimneys, matchbox cottages, bead-sized bonfires, thimble planters, sugar-cube stone walls, thread-thin string lights, tilt-shift shallow-focus language.

━━━ LIFE + WARMTH ━━━
Bake in signs of life and cozy warmth: warm window-glow, chimney smoke, a single open doorway spilling light, lanterns, wreaths, footprints. Cold blue snow against warm amber light is the signature contrast. Keep it enchanting and cozy, never bleak.

━━━ EXTERIOR ONLY ━━━
All scenes are OUTDOOR views — rooftops, lanes, the pond, the market, gardens. NEVER interior rooms. Camera is above or beside the village. NO humans (peripheral distant silhouettes at most). NO proper nouns, NO brand names, NO text on signs.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: winter-village setting + time-of-day/weather + a specific signature detail. Vary the hero element every entry.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tiny_winter_village_cast.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} CUTE CRITTER-CAST snippets for TinyBot's tiny-winter-village path — tiny woodland animals bringing a snowy miniature village to life. Each is a small SUPPORTING character caught MID-ACTION (not the hero of the frame), to be dropped into a snowy-village scene.

Each entry: 10-18 words. START WITH THE CRITTER + AN ACTIVE VERB. Wintery, wholesome, storybook-adorable.

━━━ ALLOWED CRITTERS ONLY (cute register — hard rule) ━━━
mice, hedgehogs, bunnies/rabbits, red foxes, fawns/deer, red squirrels, dormice, ducklings, robins and other little songbirds, snails. For "bugs" ONLY these cute ones are allowed: ladybug, butterfly, bumblebee, snail, firefly. NEVER beetle, spider, cricket, moth, ant, wasp, mantis, centipede, or any other insect. When in doubt, use a mouse or a hedgehog.

━━━ WINTER ACTIONS (spread across all ${n}) ━━━
- a mouse lacing up tiny skates at the edge of the frozen pond
- a family of mice gliding across the ice in woolly scarves
- a hedgehog turning roasting chestnuts over a bead-sized brazier
- two bunnies hauling a toboggan up the snowy lane
- a red fox lighting the lanterns down the village street at dusk
- a red squirrel hanging a wreath on a tiny cottage door
- a dormouse peeking from a snow-capped mailbox
- a robin puffed up on a frosted fence post
- a mouse sweeping snow from a doorstep with a twig-broom
- a hedgehog pulling a cart of tiny firewood through the drifts
- a fawn nosing at a stall of miniature winter oranges
- a bunny in earmuffs selling paper lanterns at the market
- mice building a thumb-sized snowman with a pebble smile
- a fox mother and kit watching snow fall from a lit doorway
- a mouse carolling on the church steps with a tiny songbook (no readable text)

━━━ RULES ━━━
The critter is SMALL in the frame — a warm detail, not the subject. Woolly hats, scarves, mittens welcome. NO humans. NO text/lettering. Keep every action gentle, cozy, and clearly readable.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
