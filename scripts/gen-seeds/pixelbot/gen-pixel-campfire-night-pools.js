#!/usr/bin/env node
/**
 * PixelBot pixel-campfire-night — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.9).
 * Night scenes lit by ONE small warm source under a big dark sky. The sky_field
 * is the money-shot; fire_light is what the warm source reveals; the night stays
 * VISIBLY LIT (lit nocturne, never a black cutout). 8 pools, axis-clean,
 * positive-only. MVP 25 each; --scale appends to production size.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-campfire-night-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const LIGHTWORDS = `LIGHT IS LIGHT, and it always has a SHAPE that spreads: a glow, a warm pool, a patch, a soft fan, a wash, a halo, a scatter of flecks, a dithered spill across a surface. Light words that name a solid object (a column, a pillar, a bar, a beam, a wedge, a ribbon, a shaft, a blade, a cone) render as a solid object, so light is always a glow or a soft fan instead.`;

const POOLS = {
  place: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} NIGHT-PLACE descriptions for PixelBot's pixel-campfire-night path: a whimsical, charming, slightly magical little place at night that holds ONE small warm source of light, the hero of an old-school pixel-art painting (think the night scenes classic 16-bit adventure games painted for their title and loading screens: chunky, rounded, storybook, instantly lovable). Each entry describes the PLACE and the warm SOURCE as an object sitting in it (the ring of stones with a fire in it, the little tent beside it, the paper lanterns on their poles, the lamp room at the top of the tower), plus one charm detail. 30 to 50 words.

THE BAR: charming over cozy over realistic, and never dull. Rounded exaggerated storybook shapes: a fat little dome tent with a crooked pole, a ring of mossy boulders, a driftwood pile stacked like a wigwam, a stubby stone hut with a hat-shaped roof, a tubby wooden rowboat with a lantern hook, a bowed plank walkway, a round-shouldered lighthouse leaning slightly, bulbous paper lanterns strung on bamboo, a little arched bridge. ONE CHARM DETAIL per entry, always a hung or carved OBJECT, wordless: a copper kettle on a hook, a carved wooden owl on a post, a rope of beads, a pair of boots by the tent flap, a woven basket, a tin cup on a flat stone, a carved bear on the bow, a carved wooden fish on a post, a hanging bundle of dried herbs. Weathervanes, compass roses, sundials, crests, and emblems are absent: their priors supply lettering. A LITTLE MAGIC is welcome as a small detail (glowing moss between the stones, a scatter of oversized toadstools at the tree line, a garden of huge night flowers by the path).

MASSING: every entry names its shape and its ground so no two read alike (a hollow ringed by boulders / a long crescent of black sand / a slow river between reed banks / a knuckle of rock on a ridge / a flat shelf of grass above a lake / a narrow stepped lane between old timber houses / a jetty on pilings / a headland of bare stone). Towers appear at most twice.

VARIETY MANDATE, distribute the ${n} across: 6 CAMPFIRE CLEARING (a stone ring and a fat dome tent in a hollow of pines, a fire pit on a rocky bluff with a slung tarp, a stacked driftwood fire in a birch clearing, a fire between two boulders with bedrolls and a leaning kettle tripod), 4 LANTERN-FESTIVAL RIVER (paper lanterns floating on a slow river, a low arched bridge strung with bulbous lanterns, a reed bank with lanterns set adrift from a plank landing, a river of lanterns curving past a little shrine hut), 3 FIREFLY MEADOW (a tall-grass meadow with a crooked fence and one lantern on a post, a hollow of wildflowers with a hung lantern, a marsh boardwalk with a lamp at its end), 3 BEACH BONFIRE (a driftwood bonfire on black sand with a dune of grass behind, a bonfire in a cove ringed by stacked rock, a fire by an overturned rowboat on a pebble beach), 3 MOUNTAIN HUT (a stubby stone hut on a ridge with an iron brazier by the door, a timber refuge with a fire in a pit outside, a shepherd's hut under a rock face with a lamp on a hook), 2 LAKE BOAT LANTERN (a tubby fishing boat with a lantern hung from a bow hook on still water, a flat punt with a lamp at its prow among reeds), 2 LANTERN LANE (a narrow stepped lane between old timber houses hung with round paper lanterns, a stone alley with lanterns on brackets and a little arched gate), 2 LIGHTHOUSE (a round-shouldered lighthouse on a headland with its lamp room lit, a stubby harbour light at the end of a bowed plank jetty).

AXIS-CLEAN: the entry names the PLACE and the SOURCE OBJECT only. What the light DOES, the sky, stars, the moon, mist, smoke, weather, palette colours, and people belong to other axes and are absent here. The fire, the lantern, or the lamp is named plainly as the object it is, sitting where it sits.
SURFACES: every paper lantern, cloth, hull, and shutter is plain, or carries one simple painted shape such as a circle, a leaf, or a fish.
NAMES: describe the place; famous regions, landmarks, franchises, and characters are absent.
${CLEAN}
Examples: "STONE RING IN THE PINE HOLLOW: a hollow ringed by mossy boulders, a fat little dome tent with a crooked pole, a ring of flat stones holding a stacked fire, a kettle hanging from a leaning iron tripod, tall pines closing the hollow behind"; "LANTERN BRIDGE OVER THE SLOW RIVER: a low arched plank bridge over a wide slow river, bulbous paper lanterns strung along both rails on bamboo poles, more lanterns set adrift on the water, reed banks and a little shrine hut on the far side"; "DRIFTWOOD FIRE ON THE BLACK SAND: a long crescent of black sand, a driftwood pile stacked like a wigwam with a fire inside it, an overturned tubby rowboat, a carved wooden gull on its keel, dune grass ridging the beach behind".
${FMT}` },

  fire_light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} FIRE-LIGHT descriptions for PixelBot's pixel-campfire-night path: what the ONE small warm source DOES to the night around it. 15 to 30 words. This is the light axis, and it is the reason the picture works.

PLACE-AGNOSTIC, the most important rule here: this light rolls independently against eight very different places (a campfire clearing, a lantern-hung river, a firefly meadow, a beach bonfire, a mountain hut, a boat's lantern on a lake, a stepped lantern lane, a lighthouse headland). So each entry describes the CHARACTER of the light and what it does to WHATEVER IS NEAREST IT, in words that fit any of those places: "the nearest surfaces", "everything within its reach", "whatever stands closest to it", "the ground beneath it", "the surfaces it touches". Named place-specific things (a hull, a tent, canvas, reeds, sand, planking, steps, fog banks, lap joints, bedrolls) belong to the place axis and are absent here.

THE LIT-NOCTURNE LAW, in every entry: the night stays VISIBLY LIT. The warm light REVEALS what is near it, and the entry says WHAT KIND OF DETAIL comes up in the light: grain, moss, weave, wet shine, cracked texture, ridged edges, the colour under the dust, small shadows behind small things. Something is always readable in the warm light, and the ground under it always shows its texture and colour. Everything beyond fades to soft dim blues and greys that still hold their shapes.
${LIGHTWORDS}

VARIETY MANDATE, distribute the ${n} across, by the CHARACTER of the light: 5 a hot low bed of embers throwing a wide shallow pool of deep orange, 4 a tall bright flame throwing a high wide amber glow with restless edges, 4 one hung lantern casting a small steady halo with warmth falling away quickly beyond it, 3 warm light scattered across water in a spread of bright flecks, 3 a soft warm fan of light from a lamp high above spreading slowly outward and thinning, 3 a string of small lights each holding its own separate halo with cooler ground between them, 3 a fire against a wall or an overhang that throws its warmth back and pulls long soft shadows out behind whatever stands near it.
AXIS-CLEAN: the warm source's light only. The sky, stars, the moon, aurora, smoke, mist, weather, palette names, animals, and the named place belong to other axes and are absent here.
ANTI-DULL: every entry names at least TWO kinds of DETAIL that come up in the light (grain, moss, weave, wet shine, cracked texture, a bright rim on every edge, small soft shadows). A flat, even, featureless wash is not an entry.
${CLEAN}
Examples: "EMBER POOL: a hot orange bed of embers throwing a low wide pool of warmth, every surface it reaches showing its grain and its moss in deep amber, small shadows pooling behind each one"; "HUNG LANTERN HALO: one lantern holding a small steady halo, whatever stands closest lit gold along its edges with its texture clear, the warmth falling away quickly into dim blue".
${FMT}` },

  sky_field: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} NIGHT-SKY descriptions for PixelBot's pixel-campfire-night path: the MONEY SHOT. The sky fills the top half of an old-school pixel-art night painting and it is the most beautiful thing up there. 12 to 25 words, overhead only.

EVERY ENTRY CARRIES A FEATURE. The sky is pixel art's signature axis: a dense dithered star field, a pale arc of the Milky Way, a huge soft moon dithered in cream, a thin bright crescent low, ordered bands of dithered colour stepping from horizon to crown, green and violet aurora curtains, a sprinkle of four-point stars with three brighter ones, soft cloud puffs rim-lit by moonlight, a single clean meteor streak, a faint halo ring around the moon. An empty, even, featureless dome is not an entry.

VARIETY MANDATE, distribute the ${n} across: 6 star fields of different characters (dense edge to edge, sparse with three big four-point stars, a pale Milky Way arc, stars showing between thin cloud, a star field with one bright planet, tiny stars dusting a banded crown), 5 moons (a huge soft cream moon low and round, a high small bright moon with a halo ring, a thin crescent with the dark disc faintly drawn, a gibbous moon behind feathered cloud, a big moon with soft grey seas dithered into it), 4 aurora (green curtains rippling overhead, a green and violet double curtain, a faint green wash high with stars through it, an aurora arch spanning the crown), 4 dithered colour bands (deep indigo stepping to violet, teal stepping to ink, plum to navy, a last thin warm band far down under a starred crown), 3 clouds with character (soft moonlit puffs with bright rims, a long feathered veil across the stars, a low bank along the horizon under a clear starred top), 3 one clean meteor or a small sprinkle of them crossing a starred sky.
AXIS-CLEAN: the sky only. The ground, the fire, lanterns, people, mist at ground level, and palette names belong to other axes and are absent here. There is one moon at most in any entry.
${CLEAN}
Examples: "MILKY WAY ARC: a pale dithered band of the Milky Way arcing from horizon to crown across a dense field of tiny sharp stars"; "HUGE CREAM MOON: a big round moon low in the sky, dithered pale cream with soft grey seas, a thin halo band around it, a few bright stars beyond".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-campfire-night path: what the AIR itself is doing on a night lit by one small warm source. 12 to 25 words.

VARIETY MANDATE, distribute the ${n} across: 6 wood smoke (a thin blue thread rising straight up, a low smoke layer lying flat across the hollow, a resin haze drifting sideways, smoke curling off the near stones, a soft smoke veil between the near and far trees, smoke thinning to clear air above), 5 mist (knee-high ground mist over the meadow, mist lying on the water in flat sheets, a thin valley haze softening the far trees, sea fog rolling in slow and soft, mist thinning to clear above), 5 clear cold (still and sharp and dry, so clear the far ridge reads crisp, cold air with a faint sparkle of frost motes, dead calm and glassy, a light cold breeze moving the grass), 4 drizzle or rain (a soft fine drizzle, steady quiet rain, rain easing off with everything left wet and shining, a warm damp air after rain), 3 dry haze or dust for warm places, 2 a light breeze carrying loose sand or seed fluff low across the ground.
AXIS-CLEAN: air only. The fire, lanterns, light, the sky, stars, the moon, the place, animals, and palette names belong to other axes and are absent here.
MOTION: air drifts, hangs, lies, settles, thins, rolls slowly. Motion described as a rush, a swirl, or a sweep renders as a streak-shaped object, so the air always moves slowly and softly instead.
${CLEAN}
Examples: "THIN BLUE THREAD: a thin blue thread of wood smoke rising straight up through still air and fraying softly high above"; "GROUND MIST ON THE MEADOW: a knee-high white mist lying flat across the grass, thinning to clear sharp air above it".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-campfire-night path: a small living presence near a warm night light, never the hero. 10 to 22 words. Everything is small in the frame, and people are always seen from behind, turned toward the fire or the lanterns.

VARIETY MANDATE, distribute the ${n} across: 5 one small bundled figure sitting on a log or a stone with their back to us, turned toward the fire, 4 two small figures side by side with their backs to us, turned toward the fire or the water, a clear gap between them, 4 a dog curled by the fire or sitting alert at the edge of the warm ground, 3 a deer standing at the tree line watching, 3 an owl on a post, a branch, or a rail, 2 a cat sitting on a stone at the edge of the light, 2 a fox crossing the far grass, 2 a small figure in a boat with their back to us, tending the lantern.
EVERY ENTRY says small, tiny, or far, and every person is seen from behind. Faces, close figures, groups of three or more, and crowds are absent.
${CLEAN}
Examples: "ONE FIGURE ON THE LOG: a small bundled figure sitting on a log with their back to us, shoulders hunched, turned toward the fire"; "DEER AT THE TREE LINE: a small deer standing still at the far tree line, ears up, watching the warm light from the dark".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-campfire-night path: a small event happening in the scene right now. 10 to 22 words.

VARIETY MANDATE, distribute the ${n} across: 5 sparks drifting up from the fire in a slow loose scatter, 4 one clean meteor streak crossing the sky, 4 paper lanterns rising slowly one after another, 3 a log settling and collapsing into the embers, 3 the lamp room's warm fan of light swinging slowly past and lighting the fog it crosses, 3 a lantern being lit and its halo coming up, 3 mist parting slowly to open the far shore.
MOTION: sparks DRIFT upward, lanterns RISE slowly, a meteor is one clean streak, smoke curls, light swings slowly. Motion written as a rush, a swirl, or a sweep renders as a literal streak-shaped object, so everything moves slowly and simply instead.
Everything is fire, light, smoke, water, or air in motion.
${CLEAN}
Examples: "SPARKS DRIFTING UP: a loose scatter of orange sparks drifting slowly up from the fire and fading out in the dark air"; "LANTERNS RISING: two paper lanterns lifting slowly off the water, each carrying its own small warm halo upward".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-campfire-night path: painterly framings that keep ONE small warm light as the hero with a big night sky filling the top half of the frame. 10 to 22 words: where the CAMERA sits, plus what dominates the frame. Refer to the light source only as "the warm light" so the framing fits any of them.

VARIETY MANDATE, distribute the ${n} across: 6 from beyond the warm light at ground level with the sky opening tall above it, 4 camera set low near the ground so the warm light sits against the sky, 4 from across the water with the warm light small on the far side, 4 from the hillside above looking down onto the warm light with the horizon high, 3 down the length of the lane with the warm lights receding, 2 from the tree line looking in across open ground, 2 slightly elevated from a bank or a rock with the ground falling away.
Framings are medium-wide or wide, and the sky fills roughly the top half. Close-ups, interiors, overhead map views, and first-person views are absent.
POSTURE: every entry names where the CAMERA sits (camera set low at the grass line, from the bank above, from beyond the fire ring). A viewer's posture such as lying, kneeling, crouching, perched, or standing renders as a person in that posture, so the camera's position is named as a position instead.
${CLEAN}
Examples: "FROM BEYOND THE FIRE: ground level on the far side of the warm light, the hollow around it in the lower third, the sky opening tall above"; "ACROSS THE WATER: a wide view over still water, the warm light small and bright on the far side, the sky filling the top half".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-campfire-night path: a named harmony of 3 to 5 colours for a limited-palette pixel-art NIGHT painting, where the night is cool and the fire or lantern is the single warm note. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends by attaching the warm note to the fire light, in this shape: "..., warm amber only in the firelight".

VARIETY MANDATE, distribute the ${n} across: 8 deep-night harmonies (ink, navy, slate, cold silver, blue-black), 6 starry-indigo harmonies (indigo, violet, dusty blue, pale star-white), 4 aurora harmonies (near-black, deep teal, soft green, pale violet), 4 moonlit harmonies (cool silver, pale blue-grey, dove, deep blue shadow), 3 last-afterglow harmonies (a low plum and rose band fading up into deep blue). The warm note may vary in wording: warm amber only in the firelight, ember orange only in the firelight, lantern gold only in the lantern light, candle yellow only in the lamp light.
${CLEAN}
Examples: "INK AND EMBER: deep ink blue, slate, cold silver, blue-black, warm amber only in the firelight"; "AURORA NIGHT: near-black, deep teal, soft green, pale violet, lantern gold only in the lantern light".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_campfire_night_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
