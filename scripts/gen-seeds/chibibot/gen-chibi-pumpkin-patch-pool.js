#!/usr/bin/env node
// AlphaBot — chibi-pumpkin-patch Halloween candidate (destination: ChibiBot).
// A chibi-critter pumpkin-patch DERBY at golden hour: hollowed-pumpkin
// wagons, pumpkin-half soap-box derbies, hay-wagon hauls, worked entirely by
// critters. 7 bespoke pools, scaled prod-depth (target 120, append:true —
// grows the tested MVP-25 entries, never overwrites them). The jackolantern
// pool block was reconstructed here (2026-09-07 prod-depth pass) to match
// the register of its 12 already-tested entries — no original generator was
// checked in for it. See scripts/bots/alphabot/paths/chibi-pumpkin-patch.js
// for the axis design.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // ─── patch_setting — the PLACE (composition/backdrop, always present) ───
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_scene.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} PUMPKIN-PATCH SETTING scenes for a playful Halloween chibi-critter dream bot. Each is the COMPOSITION of a pumpkin patch/farm at GOLDEN HOUR — the backdrop the derby/harvest action happens IN. The place is fully built and layered (a near foreground detail, a readable midground, a receding background), never a flat empty field. Each entry 20-32 words.

━━━ SETTINGS TO SPAN (draw from across all ${n}, don't cluster) ━━━
- neat rows of round orange pumpkins receding toward a weathered red barn
- a hay-bale maze with a little lookout platform
- a split-rail wooden fence strung with mini gourds and dried corn
- a rustic covered wooden bridge over a dry creek bed at the field's edge
- an old windmill turning slow against the sunset
- a row of tied corn-shock teepees rustling at the field's border
- a barn with open doors, string-lights, and hay spilling out
- a gravel farm lane lined with stacked hay bales
- an apple-orchard border where the pumpkin rows give way to red-gold trees
- a scarecrow-dotted rise overlooking the whole patch
- a wagon-wheel gate at the patch entrance
- a small farm pond with a weathered wooden dock at the patch's edge
- a stand of tall trees turning red-gold along the field boundary
- a tractor-path worn through the vines
- a straw-bale amphitheater of stacked seating around a dirt track
- a vine-covered stone wall marking the old property line
- a row of grinning carved jack-o-lanterns lit along a fence rail
- a cider-press shed with barrels stacked outside

━━━ RULES ━━━
Always GOLDEN HOUR / late-afternoon autumn light (don't restate the exact light — a later axis owns that; just build the PLACE). NO readable text or signage. NO people, NO farmer, NO human silhouette anywhere — this patch is tended entirely by critters (a distant critter shape is fine). Layered depth every time: something close, something in the middle, something far. Cozy harvest wonder, never spooky or abandoned-looking.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── money_shot_vehicle — THE signature axis, ALWAYS present ───
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_vehicle.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} PUMPKIN-DERBY MONEY-SHOT entries for a playful Halloween chibi-critter dream bot. This is THE SIGNATURE DETAIL of the whole scene — a specific, unmistakable pumpkin-patch VEHICLE or DERBY MOMENT that makes the shot instantly iconic. Each entry 14-24 words, ONE concrete vehicle/moment, concrete enough an artist could draw it from this line alone.

━━━ SPAN ACROSS ALL ${n} (don't repeat the same vehicle twice) ━━━
- a hollowed giant pumpkin carved into a wagon, towed along by a harnessed little team
- a hay wagon heaped with pumpkins, rolling down a dirt lane behind a sturdy team
- pumpkin-half soap-box-derby carts racing wheel-to-wheel down a straw-lined track
- a wheelbarrow race, overloaded wheelbarrows tipping precariously as they round a hay-bale corner
- a giant prize pumpkin rolled up a wooden ramp onto an old iron scale
- a hollowed pumpkin-shell boat drifting across the farm pond, trailing a leaf-wake
- a vintage flatbed farm truck bed heaped high with pumpkins, tailgate down
- a rope-and-pulley hoist swinging a giant pumpkin up onto a waiting cart
- a mini pumpkin-cart pulled by a tandem team in tiny harnesses, ribbons streaming
- a straw-bale chute sending a cascade of small pumpkins tumbling into a pile below
- a bicycle-built-for-critters towing a carved-pumpkin sidecar down the lane
- a lantern-cart parade float strung with glowing jack-o-lanterns
- a giant pumpkin bowling lane, one big pumpkin rolling toward a row of gourd pins
- two pumpkin-carts locked in a friendly tug-of-war across a chalked line
- a rickety hayloft slide sending pumpkins tumbling down into an open cart below
- a pumpkin regatta of little carved-gourd boats racing down a narrow irrigation ditch
- a pumpkin-cart finish line, a checkered ribbon stretched taut and about to snap
- a hay wagon pulled by two sturdy goats instead of horses, bells jingling on their harness
- a rickshaw-style pumpkin cart pulled by one determined critter, wheels bouncing on the ruts
- a zipline lowering small pumpkins one by one from the hayloft into a waiting basket-cart

━━━ RULES ━━━
Every entry MUST feature the vehicle/moment mid-ACTION (racing, rolling, towing, sliding — never parked and posed). NO weapons, NO anything that could read as a launcher or projectile aimed at anyone. NO people, NO human hands on any rein or handle — critters do the pulling/pushing/steering (a separate axis names them; here just describe the vehicle/moment). Playful county-fair energy, never dangerous or scary.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── jack_o_lantern — HALLOWEEN SIGNATURE PROP, ALWAYS present, pinned to
  // the NEAR foreground (added round 2 — see chibi-pumpkin-patch.js header:
  // without its own early, high-salience section this got buried at the end
  // of a long prompt and never actually rendered). NOTE: this pool predates
  // this gen script (no original generator was checked in) — reconstructed
  // here from the 12 hand/round-2-tested entries already in the JSON file,
  // matching their exact register (single glowing jack-o-lantern, close
  // enough to touch, no trailing period) so append:true grows the SAME
  // format rather than drifting to the broader multi-composition style used
  // by other paths' jack-o-lantern axes (e.g. chibi-halloween-village's,
  // which spans street/canal/bridge compositions — wrong register here,
  // this axis is specifically ONE prop pinned to the near foreground).
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_jackolantern.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} JACK-O-LANTERN foreground-prop entries for a playful Halloween chibi-critter pumpkin-patch derby scene. This is the single non-negotiable HALLOWEEN SIGNATURE PROP pinned to the NEAR foreground of every render — a real, close, glowing carved pumpkin the eye lands on immediately, never a distant speck. Each entry 18-26 words, ONE sentence, NO trailing period (match the exact format of the examples below).

━━━ MATCH THIS EXACT FORMAT (existing tested entries — do not repeat, but match structure/length/tone) ━━━
"A big grinning jack-o-lantern glows warmly in the close foreground, candlelight flickering behind its crooked triangle eyes"
"A perfectly round jack-o-lantern with a wide gap-toothed grin sits lit up front and center on the nearest hay bale"
"A carved jack-o-lantern with a lopsided happy grin perches on the fence post closest to camera, its glow spilling onto the dirt"
"Two grinning jack-o-lanterns of different sizes flank the near foreground, both glowing amber from within"
"A jack-o-lantern with a huge toothy smile sits balanced on the cart's front board, candlelight flickering as the wheels roll past it"
"A cheerful jack-o-lantern with a crooked smile glows softly atop the nearest hay bale, close enough to almost touch"

━━━ STRUCTURE TO FOLLOW ━━━
Open with "A [descriptor] jack-o-lantern..." (occasionally "Two jack-o-lanterns..." or "A row of small jack-o-lanterns..." for variety, but keep those rare — most entries are ONE hero jack-o-lantern). Name its grin (crooked / gap-toothed / lopsided / toothy / delighted / wide happy / cheerful / plump / gap-grinned / lopsided-happy). Give it an active verb (glows / sits / perches / lights up / grins) and a SPECIFIC near-foreground perch (a hay bale, a fence post, an overturned crate, the cart's front board, a low stump, a pumpkin pile, a fence rail, a wagon wheel, a low fence gate). Close with a candle-glow/flicker detail that sells it as lit from within.

━━━ SPAN ACROSS ALL ${n} (vary the perch + grin shape, don't cluster on hay bale every time) ━━━
- perched on a low stone step at the very front of the frame
- balanced on the wagon's front wheel hub, glow catching the spokes
- sitting on a stack of empty crates right beside the crew
- nestled in the crook of a fence gate, candlelight spilling through the slats
- perched on a tipped-over bushel basket at the frame's nearest edge
- glowing from a low tree stump right beside the action
- lit up on the seat of an empty wheelbarrow parked closest to camera
- sitting on the very first pumpkin in the nearest row
- perched on a hay bale corner, close enough to cast light on the dirt below
- glowing on a fence rail post nearest the viewer

━━━ RULES ━━━
Every entry is about a CARVED, GLOWING, GRINNING/friendly jack-o-lantern specifically — never a scary carved face, never unlit. Always anchored in the CLOSE/NEAR foreground (say so explicitly — "close foreground," "nearest," "right beside," "front of the frame," "closest to camera," or similar). NO people. NO readable text.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── crew_cast — 1-2 critters mid-action working the money shot ───
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_crew.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} CREW-CRITTER entries for a playful Halloween chibi-critter pumpkin-patch derby scene. Each is ONE adorable chibi critter caught mid-ACTION working the harvest or the derby — the supporting cast that gives the money-shot vehicle its energy. Each entry 10-18 words. OPEN WITH THE CRITTER, then an ACTIVE VERB naming exactly what they're doing right now.

━━━ THE CAST (cute critters ONLY, vary species across the ${n}) ━━━
Red fox, raccoon, hedgehog, corgi pup, bunny, barn owl, chipmunk, goat kid, piglet, duckling, squirrel, opossum, lamb, otter, badger, field mouse.

━━━ THE ACTION (a specific verb-led moment, vary across the ${n}) ━━━
- gripping a cart's reins with both paws, leaning hard into a turn
- hauling a pumpkin twice their size with a triumphant grin
- high-fiving a teammate at the derby finish line
- waving a little checkered flag overhead
- cheering from atop a hay bale, both paws in the air
- carefully painting a grinning face onto a jack-o-lantern with a stubby brush
- stacking a wobbly pyramid of mini pumpkins
- straining forward in a tiny harness, pulling a cart
- tossing a bale of hay onto a growing stack
- riding piggyback on a rolling pumpkin, arms thrown wide
- polishing a giant prize pumpkin with a burlap rag
- pushing an overloaded wheelbarrow uphill, tongue out with effort
- popping up from between the vines holding a pumpkin overhead in triumph
- steering a pumpkin-cart around a hay-bale corner, ears streaming back

━━━ EXAMPLES (DO NOT REUSE VERBATIM) ━━━
- "a corgi pup gripping the reins with both paws, leaning hard into the turn"
- "a raccoon hauling a pumpkin twice its size, grinning with the effort"
- "a barn owl waving a tiny checkered flag from atop a fence post"

━━━ ABSOLUTELY BANNED ━━━
NO humans/people of any age. NO creepy bugs (no spider, beetle, cricket, mantis, moth, wasp). NO scary/menacing critters. Everything stays cute, jolly, and full of harvest-day joy.

━━━ DEDUP DIMENSIONS ━━━
Vary the SPECIES + the JOB + the ACTION — don't repeat the same critter doing the same thing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── harvest_detail — OPTIONAL background set-dressing (~60% gate) ───
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_harvest.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} HARVEST-DETAIL entries for a playful Halloween chibi-critter pumpkin-patch scene — a piece of lived-in background set-dressing that fills out the frame (NOT the hero vehicle, NOT a critter — just harvest clutter/props). Each entry 10-18 words, ONE concrete detail.

━━━ SPAN ACROSS ALL ${n} ━━━
- piled pumpkins of every size and shape stacked by a fence post
- corn-shock bundles tied with twine, rustling in the breeze
- apple crates stacked three-high beside a fence rail
- a cider barrel with a tin dipper hooked on its rim
- hay bales stacked into a lopsided golden pyramid
- strings of little jack-o-lantern lanterns glowing along a fence line
- a wheelbarrow overflowing with warty gourds and mini pumpkins
- burlap sacks slouched open, spilling harvest squash
- a wooden ladder leaned against a leaning haystack
- bundles of dried cornstalks tied to a fence post
- a row of grinning carved jack-o-lanterns lined along a rail
- a basket overflowing with mini pumpkins and knobby gourds
- a rusty old scale weighted down with one enormous pumpkin
- a stack of empty wooden crates waiting for the next haul
- twine-tied bundles of dried wheat leaning against a post
- a pyramid of striped gourds beside a hand-cranked cider press
- a row of carved pumpkins with candle-glow flickering inside

━━━ RULES ━━━
NO readable text/signage. NO people. Warm, cozy, lived-in harvest texture — never messy or abandoned-looking.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── costume_flourish — OPTIONAL accessory on ONE crew critter (~50% gate) ───
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_costume.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} COSTUME-FLOURISH entries for a playful Halloween chibi-critter dream bot — a small seasonal accessory worn by ONE critter in a pumpkin-patch scene (adds Halloween flair without being a whole costume). Each entry 6-12 words, ONE wearable detail.

━━━ SPAN ACROSS ALL ${n} ━━━
- a tiny knit acorn-shaped cap pulled snug over the ears
- little overalls with a patched pocket, one strap unclipped
- a candy-corn-striped bandana knotted at the neck
- a leaf-shaped cape fluttering out behind
- a miniature witch hat tipped at a rakish angle
- a chunky scarf knit in autumn-stripe colors
- a harness threaded through with tiny fall leaves
- a jack-o-lantern-shaped basket worn backpack-style
- tiny round spectacles perched on the nose
- a straw hat with a sunflower tucked into the band
- a felt pumpkin-stem hat with a curled green tip
- a cluster of dried wheat tucked behind one ear
- mismatched striped socks pulled up to the knee
- a tiny cape made from a single oversized maple leaf
- a beaded acorn-cap necklace

━━━ RULES ━━━
Playful and charming, never a full costume that hides the critter's identity — an accent only. NO masks, NO anything covering the face or eyes. NO humans/people.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── surprise_element — OPTIONAL tucked-away whimsy (~45% gate) ───
  await generatePool({
    outPath: DIR + 'chibi_pumpkin_patch_surprise.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Write ${n} SURPRISE-ELEMENT entries for a playful Halloween chibi-critter pumpkin-patch scene — a small tucked-away whimsical/atmospheric touch in the background (not the hero, not a main critter). Each entry 8-16 words.

━━━ SPAN ACROSS ALL ${n} ━━━
- fluttering monarch butterflies drifting low over the pumpkin vines
- a friendly translucent ghost peeking playfully from behind a hay bale
- a row of jack-o-lanterns flickering warmly to life all at once
- a comic gaggle of crows lined up on a fence rail, watching intently
- a drift of maple-leaf confetti swirling on the breeze
- fireflies blinking on one by one as the gold light fades
- a faint rainbow arching over the barn after an afternoon shower
- a flock of geese honking overhead in a loose V
- a scatter of dandelion-seed puffs catching the low golden light
- a curious barn cat silhouette watching from a fence post
- a friendly scarecrow's patched sleeve flapping gently in the wind
- a swirl of golden leaves spiraling up in a sudden gust
- a plump orange harvest moon just rising past the treeline
- a soft swirl of golden pollen motes drifting through a low sunbeam
- a trail of tiny glowing will-o'-wisp lights hovering above the vines

━━━ RULES ━━━
Whimsical and gentle, NEVER frightening. If referencing a ghost, it must read as friendly/cartoonish (soft rounded shape, cheerful expression), never eerie. NO people. NO actual spiders/insects as the subject.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
