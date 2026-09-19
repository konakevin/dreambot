#!/usr/bin/env node
/**
 * PixelBot pixel-cozy-farm — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.7): FarmBot's world
 * (FARMBOT_CREATIVE_DIRECTION.md, the spec of record) rendered as chunky-cute pixel art.
 * Cute > cozy > whimsical > beautiful > realistic. Animals and villagers share the spotlight.
 * The hero is a named VIGNETTE; serendipity adds two unexpected cute details. 8 pools.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-cozy-farm-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const TONE = `TONE LAW: cute over cozy over whimsical over beautiful over realistic, always in that order. Everything is cheerful, sweet, a little silly, gently magical. Farm life here is charming little moments, hand-tended plots and wooden tools, a storybook countryside where everything is friendly. Signs, crates, and jars are blank or carry a simple pictorial symbol.`;

const POOLS = {
  vignette: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} VIGNETTE descriptions for PixelBot's pixel-cozy-farm path: the HERO of a chunky-cute pixel-art painting of a cozy countryside world. Each entry is ONE named cute moment, 25 to 45 words, in which ANIMALS and (often) one warm villager share the spotlight EQUALLY. The animal is doing something with personality; the villager, if present, is INTERACTING with the animal or with food, never standing beside it.

${TONE}
VARIETY MANDATE, distribute the ${n}: 6 ANIMAL ANTICS (ducklings in a line, goats on a roof, a piglet in a puddle, a kitten in a basket, chicks in a boot), 4 BAKING AND FOOD (warm loaves, a pie on the sill, jam jars, a picnic, hot cocoa), 3 MARKET AND VILLAGE (a stall of berries, a delivery basket, the flower shop), 4 CHORES GONE CUTE (laundry with a lamb tangled in it, watering flowers with a duck helping, gathering eggs from a hen who follows), 3 LEISURE AND NOTHING HAPPENING (napping in hay with puppies, tea on the porch with a cat, feeding ducks by the pond), 3 SEASONAL MOMENTS (blossom petals, pumpkins, first snow, but the season word stays light), 2 WEATHER AS A FEELING (sheltering from rain under one umbrella with a goose, sun after rain).
Villagers are warm cute archetypes named by ROLE (farm girl, farm boy, baker, shepherd, herbalist, flower seller, innkeeper, potter, fisher, grandma, grandpa). Baby animals are favoured (ducklings, chicks, lambs, kids, piglets, calves, foals, puppies, kittens, bunnies). An animal is always the OBJECT of care, never a compound noun in front of a person.
AXIS-CLEAN: the entry names the moment and its cast only. The stage, the season and weather, the camera, and the palette belong to other axes.
${CLEAN}
Examples: "DUCKLINGS CROSSING THE YARD: a line of five ducklings waddles across the farmyard while the baker, arms full of warm loaves, waits with a big grin for them to pass"; "KITTEN IN THE STRAWBERRY BASKET: a kitten fast asleep in a half-full basket of strawberries on the garden path, a curious hen peering in over the rim"; "GOATS ON THE BAKERY ROOF: two baby goats standing proudly on the bakery's grassy sod roof while the baker looks up from the doorway laughing"; "TEA WITH THE SHEEP: the shepherd sips tea on a fence rail while three fluffy sheep line up beside her as if waiting for their own cups".
${FMT}` },

  farm_place: { mvp: 25, scale: 120, prompt: (n) => `You are writing ${n} FARM-PLACE descriptions for PixelBot's pixel-cozy-farm path: the STAGE for a cute pixel-art countryside vignette, in the Hay Day spirit. Each entry is ONE cozy spot, 20 to 40 words, densely dressed with charming little details: flower-covered fences, baskets, barrels, lanterns, garden paths, birdhouses, hay bales, flower boxes, a little bridge, a windmill.

${TONE}
VARIETY MANDATE: 3 farmyard with a red barn, 3 orchard, 3 pond edge with a tiny dock, 3 bakery or café front, 2 market square, 2 greenhouse, 3 farmhouse porch, 2 strawberry or pumpkin patch, 2 flower field, 2 village lane.
AXIS-CLEAN: the place and its props only. Season, weather, time, light, animals, and people belong to other axes and are absent here.
${CLEAN}
Examples: "FARMYARD BY THE RED BARN: a little red barn with white trim, a flower-covered picket fence, stacked hay bales, a water trough, a birdhouse on a post, a wooden cart of pumpkins by the open door"; "POND EDGE WITH A TINY DOCK: a small round pond ringed with reeds and lily pads, a three-plank dock with a lantern post, a rowboat no bigger than a bathtub, a willow leaning over".
${FMT}` },

  season_weather: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SEASON-WEATHER descriptions for PixelBot's pixel-cozy-farm path: ONE entry stacks SEASON + WEATHER + TIME OF DAY + the LIGHT, 15 to 30 words, always gentle and cheerful. Weather is a feeling here: soft rain is cozy, snow is sparkly, sun is warm.

${TONE}
VARIETY MANDATE: 7 SPRING (blossom morning with soft rain, fresh green noon, a rainbow after a shower), 6 SUMMER (sunflower noon, golden evening, firefly dusk, lakeside afternoon), 7 AUTUMN (golden afternoon with falling leaves, misty morning, harvest sunset), 5 WINTER (sparkling snowfall at dusk with lantern glow, bright snowy morning, cocoa-hour twilight).
AXIS-CLEAN: season, weather, time, light only. Place nouns, animals, and people are absent.
${CLEAN}
Examples: "BLOSSOM MORNING, SOFT RAIN: spring, a gentle warm drizzle, pale pink petals drifting, silvery morning light, everything freshly washed and glowing"; "SNOWFALL AT LANTERN DUSK: winter, fat sparkly snowflakes falling slowly, deep blue dusk, warm amber lantern light pooling on fresh snow".
${FMT}` },

  animal_cast: { mvp: 25, scale: 120, prompt: (n) => `You are writing ${n} ANIMAL-CAST descriptions for PixelBot's pixel-cozy-farm path: ONE to THREE cute animals with PERSONALITY and a BEHAVIOR, 15 to 30 words, drawn as chunky-cute pixel sprites (round bodies, big heads, dot eyes). Baby animals are favoured.

${TONE}
VARIETY MANDATE: 5 ducklings or chicks, 4 lambs or baby goats, 4 piglets or calves, 3 bunnies, 5 kittens or puppies, 2 ponies or foals, 2 geese or a rooster. Personalities: curious, playful, sleepy, mischievous, affectionate, shy, hungry, excited, gentle. Behaviours: following, nuzzling, sleeping in hay, peeking through a window, chasing a butterfly, wandering the garden, gathering for feeding, playing together, being held.
AXIS-CLEAN: animals only. People, places, season, and weather belong to other axes and are absent here.
${CLEAN}
Examples: "THREE SLEEPY DUCKLINGS: three yellow ducklings dozing in a heap, one with its bill tucked under a sibling, all round and fluffy"; "MISCHIEVOUS BABY GOAT: a tiny black-and-white kid mid-hop with all four hooves off the ground, ears flying, eyes delighted".
${FMT}` },

  villager: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} VILLAGER descriptions for PixelBot's pixel-cozy-farm path: ONE warm, cute, approachable villager as a chunky-cute pixel sprite (big head, small round body, simple friendly face), 15 to 30 words: their ROLE, their wholesome outfit, and a friendly ACTION that involves an animal or food. Warm expression, relaxed pose, playful body language.

${TONE}
VARIETY MANDATE: farm girl 3, farm boy 3, baker 3, shepherd 2, herbalist 2, flower seller 2, innkeeper 2, potter or weaver 2, fisher 2, grandma 2, grandpa 2. Wholesome clothing: aprons, straw hats, overalls, cardigans, rain boots, headscarves, knitted scarves. Age is shown by warmth (rosy cheeks, a white braid), never by a number.
The animal is the OBJECT of care ("feeding a lamb", "brushing a pony"), never a word placed in front of the person.
AXIS-CLEAN: the villager only. Place, season, weather, and other animals belong to other axes.
${CLEAN}
Examples: "CHEERFUL BAKER: a round-cheeked baker in a flour-dusted apron and a puffy white cap, holding out a warm bun to a hopeful puppy"; "COZY FARM GIRL: a farm girl in denim overalls, a straw hat, and red rain boots, crouched to bottle-feed a lamb with a big smile".
${FMT}` },

  serendipity: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} SERENDIPITY descriptions for PixelBot's pixel-cozy-farm path: ONE small unexpected cute detail that makes a viewer smile, 10 to 22 words, the kind of thing you notice second.

${TONE}
Distribute across: a small creature in a surprising spot (a snail on the watering can, a butterfly on a piglet's snout, a bunny in the bread basket, a cat asleep on a sheep's back), a charming object (a teacup on a fence post, a tiny scarf on a scarecrow, a paper boat in the trough), animals imitating people (a duck under a leaf umbrella, a hen sitting in a chair), food moments (a pie cooling with a bite missing, jam jars catching light), tiny magic (a glowing mushroom by the step, one floating dandelion seed lit gold).
${CLEAN}
Examples: "SNAIL ON THE WATERING CAN: a tiny snail riding the spout of a green watering can, a dewdrop on its shell"; "BUNNY IN THE BREAD BASKET: a small brown bunny sitting upright among the loaves as if it belonged there".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-cozy-farm path: cozy storybook framings for a pixel-art painting of a countryside vignette, 10 to 22 words: the camera position plus what dominates the frame. Animals and villager read clearly at mid-frame, the place around them.

VARIETY MANDATE: 8 three-quarter view from slightly above (the cozy-sim view), 6 eye level from the lane or path, 4 from the porch step, 4 across the pond or garden, 3 from inside a barn door or shop door looking out. Framings are medium-wide; the cast stays whole and readable with the place around it. Map views, side-scrolling views, and close-up portraits are absent.
${CLEAN}
Examples: "COZY-SIM THREE-QUARTER: from slightly above at a gentle angle, the yard spread out below, the cast mid-frame with the barn behind"; "EYE LEVEL FROM THE LANE: standing on the lane looking in, the cast in the middle distance, flower fence in the foreground".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-cozy-farm path: a named cheerful harmony of 3 to 5 colours for a bright, sweet limited-palette pixel-art painting, 10 to 20 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends with one colour named "only in the brightest highlights".

VARIETY MANDATE: 7 candy pastels, 6 sunny yellows with grass greens, 4 strawberry red with cream, 4 lavender with honey, 4 sky blue with peach.
${CLEAN}
Examples: "STRAWBERRY CREAM: strawberry red, warm cream, leaf green, soft pink, white only in the brightest highlights"; "SUNNY MEADOW: buttercup yellow, grass green, sky blue, warm tan, pale gold only in the brightest highlights".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_cozy_farm_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt, banHumanLanguage: false });
  }
})().catch((e) => { console.error(e); process.exit(1); });
