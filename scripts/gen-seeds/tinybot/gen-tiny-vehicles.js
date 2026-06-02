#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_vehicles.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} TINY-VEHICLE descriptions for TinyBot — delicate single miniature vehicles built from REAL natural materials at hand-palm scale. The vehicle is the HERO. Walnut-shell sailboats with leaf sails, acorn-cap carriages drawn by snails, dandelion-seed parachutes, leaf hot-air balloons with twig baskets, mushroom-cap submarines, cricket-drawn chariots, beetle-elytra airships, twig-and-thread biplanes.

Each entry: 18-28 words. ONE specific tiny vehicle with material detail + environment for scale.

━━━ VEHICLE TYPES (mix broadly across all entries) ━━━

WATERCRAFT
- Walnut-shell sailboat (leaf sail on twig mast, thread-rigging)
- Acorn-cap rowboat (twig-oars, moss-cushion seat)
- Birchbark canoe (sewn with spider-silk, bone-handle paddle)
- Mushroom-cap submarine (porthole-window cap, brass-pebble propeller)
- Lily-pad raft (twig-fence railing, leaf-canopy)
- Pinecone-scale paddleboat (overlapping-scale hull, fern-frond paddle)
- Eggshell coracle (sewn-together half-shell with twig-frame)
- Reed-bundle catamaran (twin reed-hulls lashed with thread)

AIR
- Leaf hot-air balloon (broad-leaf canopy, twig-basket gondola, thread-ropes)
- Dandelion-seed parachute (bare-thread harness, single seed-puff above)
- Spider-silk paraglider (silk-stretched-on-twig wing, harness of ribbon)
- Twig-and-thread biplane (paper-wax-paper wings, acorn-cap propeller)
- Maple-key glider (helicopter-seed wing, tiny twig-fuselage)
- Beetle-elytra airship (iridescent-shell envelope, basket of woven moss)
- Paper-bird kite (folded-paper kite with thread-tail, twig-cross-spar)
- Feather-fletched dart-glider (feather wings on twig-shaft body)
- Hot-pepper-seed-pod rocket (chili-shell fuselage, seed-fins)

LAND
- Acorn-cap carriage (drawn by a snail, twig-axle wheels, walnut-shell cargo)
- Cricket-drawn chariot (yoked cricket, two thimble-wheels, leaf-canopy)
- Walnut-shell wagon (rolling on twig-spoke wheels, hay-cargo)
- Beetle-shell coach (carved-elytra body, six twig-legs, ant-team in harness)
- Pinecone-rolling cart (segmented pinecone-roof, oak-gall wheels)
- Spider-pulled sled (silken-thread harness, leaf-runner sled)
- Twig-and-bark velocipede (wooden-wheel single-pedal contraption)
- Mouse-drawn diligence (tiny coach behind a harnessed field-mouse)

UNDERGROUND / OTHER
- Mushroom-cap submersible-borer (rotating cap-bit, twig-conning-tower)
- Acorn-shell drill-tank (treaded leaf-tracks, walnut-shell turret)

━━━ NATURAL MATERIALS (every entry shows REAL CRAFT) ━━━
- Walnut shells, acorn caps, leaves (specific: oak, maple, fern, ivy)
- Twigs, bark, birchbark, pine-needles, pinecones, pinecone-scales
- Dandelion seeds, milkweed-fluff, milkweed-pods, maple-keys
- Mushroom caps (specific: bracket, amanita, chanterelle, puffball)
- Beetle elytra, butterfly wings, feathers, snail-shells, eggshells
- Spider-silk, ribbon-scrap, thread, twine
- Pebbles, sea-glass, polished bone, brass-bead, bottle-cap

━━━ FASTENING DETAIL (visible craftsmanship) ━━━
- Thread-stitching on a leaf-sail
- Twig-pegs in walnut-shell planks
- Acorn-cap rivets
- Spider-silk rigging
- Hot-glue-amber-bead joins
- Wax-pinecone-resin caulking
- Birchbark-strap lashings

━━━ ENVIRONMENT FOR SCALE (every entry shows where the vehicle SITS) ━━━
- A walnut-shell boat on a teacup of milk OR a real puddle on a moss-bed
- A leaf balloon over towering grass-blades or above a real garden
- An acorn carriage on a moss-path with toadstool-houses behind
- A spider-silk paraglider drifting between fern-fronds
- A beetle airship moored to a flower-stem mast

━━━ OPTIONAL TINY PILOT/PASSENGER ━━━
- Mouse, beetle, dragonfly, cricket, fairy, gnome — peripheral, not the hero
- The VEHICLE is the hero
- 0-1 pilot maximum

━━━ ABSOLUTELY BANNED ━━━
- NO modern vehicles (no actual cars, planes, motorcycles — these are natural-material miniature vehicles)
- NO IP characters (no Disney, no Studio Ghibli IP names — original designs only)
- NO weapons / military / violence
- NO identifiable humans
- NO grim / scary / horror

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: vehicle-type + material + environment. "Walnut-shell boat on a puddle" and "walnut-shell sailboat in water" are TOO SIMILAR. Vary the VEHICLE-CATEGORY + the SPECIFIC-MATERIAL + the ENVIRONMENT across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Walnut-shell sailboat with a sewn-oak-leaf sail on a twig-mast, spider-silk rigging, drifting on a teacup-of-milk lake at golden hour"
- "Leaf hot-air balloon — broad maple-leaf canopy stretched on twig-spars, woven-grass basket, thread-ropes, hovering above a foxglove garden at dusk"
- "Acorn-cap carriage drawn by a harnessed garden-snail, twig-spoke wheels, ribbon-reins, rolling along a moss-paved lane past mushroom cottages"
- "Beetle-elytra airship with iridescent-blue envelope, woven-moss gondola, mooring-rope tied to a daffodil-stem mast, sunset behind"
- "Twig-and-thread biplane — wax-paper wings, acorn-cap propeller, mouse-pilot in a thimble-cockpit, taxiing across a tabletop runway-handkerchief"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
