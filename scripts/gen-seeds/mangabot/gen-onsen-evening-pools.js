#!/usr/bin/env node
/**
 * MangaBot onsen-evening — bespoke axis pools (2026-09-22, SHADOW).
 *
 * An EVENING at an OUTDOOR hot-spring inn (rotenburo), in anime. Steam is the
 * hero material; the ryokan behind is a lit lantern-box of warm windows; the
 * bath itself sits somewhere worth travelling to. Register anchors (for the
 * recipe only, never written into output): Ghibli's Spirited Away bath-house
 * warmth, Laid-Back Camp's winter-onsen trips, Mushishi's mountain quiet.
 *
 * 7 Sonnet-generated pools at MVP-25. The 8th axis — `camera` — is
 * HAND-AUTHORED (scripts/bots/mangabot/seeds/onsen_evening_camera.json) per
 * the playbook law "treat the camera pool as hand-written, not generated":
 * Sonnet-generated camera entries leak time-of-day, weather, hero type and
 * posture verbs, and a single axial/plan-view entry is a hard-fail generator
 * that out-votes every mandate in the template.
 *
 * AXIS-CLEAN CONTRACT (EarthBot L4) — each pool owns exactly one lane:
 *   bath         = the pool's mass + where it sits. SEASON-NEUTRAL, no light,
 *                  no steam behaviour, no animals, no figures, no signage.
 *   steam_light  = ★ money shot. What the steam does + what lights it + the
 *                  palette. PLACE-AGNOSTIC (detail kind, never a place noun).
 *   inn          = the ryokan behind, as part of ONE continuous outdoor shot,
 *                  and the PLAIN-SURFACE LAW on every text-prone panel.
 *   charm        = props only. No animals, no figures, no light.
 *   air          = the season + what the air is doing. No light, no palette.
 *   wildlife     = the ONLY axis that may contain an animal (0.45 gate).
 *   bather       = the ONLY axis that may contain a figure (0.55 gate).
 *
 * Run: node scripts/gen-seeds/mangabot/gen-onsen-evening-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

// Repeated in every recipe — the traps this path is built against.
const COMMON_BANS = `HARD BANS (every entry):
- NO readable text anywhere and NO text-prone surfaces left undescribed. Never a written name, kanji, letter, label, menu, price, notice, plaque, weathervane, compass or coat-of-arms.
- NO simile and NO metaphor. Never "like a", never "shaped like", and never borrow an adjective from another object (a "feathered" streak renders a literal feather).
- NO light described as a solid: never a column, pillar, wall, tower, bar, ribbon or sheet of light or of steam. Light is a glow, a patch, a pool, a soft shaft landing on a real surface, or a path of glitter. Steam is a bank, a drift, a veil, a roll, a curl, a low haze or a slow climb.
- NO named anime, studio, film or character in the output.
- NO even counts of like things (never two lanterns, four rocks, six stones) — use an odd count and set one member apart.
- NO photoreal, NO 3D, NO Western cartoon wording. This is 2D anime art.`;

(async () => {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. bath — THE HERO. Leads with the pool's own mass, then where it sits.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_bath.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} HERO-BATH descriptions for MangaBot's onsen-evening path — an OPEN-AIR Japanese hot-spring bath (rotenburo) at a mountain or coastal inn, drawn as anime. This is the HERO axis: the steaming pool itself and the extraordinary place it sits in.

Each entry: 26-38 words, ONE sentence or two short ones.

THE FORMAT IS LOAD-BEARING — every entry MUST OPEN with the pool itself and its own material mass, then place it. Example openings: "A wide steaming pool rimmed in rounded dark boulders, set on...", "A long steaming bath walled in pale cypress planks, built out over...", "A small steaming pool cut into one huge river boulder, sitting in...". If an entry opens with anything other than the pool, it is wrong — the first-named noun becomes the hero and the bath would vanish.

THE BAR — this is the whole point. The obvious version of this idea is a plain steaming pool at dusk: pretty, generic, indistinguishable from a thousand anime backgrounds. That is a FAILURE. Every entry must be a place a viewer would sell a kidney to soak in — either somewhere they have never seen, or the familiar redressed as something far more interesting. Aim for adventurous and vivid.

VARIETY MANDATE — one distinct setting per entry, spread across all of these:
- a pool on a cliff shelf with a sea of cloud filling the whole valley below it
- a rooftop bath on the top storey of a tall wooden inn, the lit town far below
- a pool among a dense stand of bamboo, the canes leaning right over the water
- a bath cut into a single vast river boulder mid-stream, the current sliding past
- a pool fed by a small waterfall pouring straight into its far end
- terraced pools stepping down a steep hillside, each spilling into the next
- a pool on a ledge in a narrow gorge with an old rope bridge crossing high above
- a bath on a sea-cliff shelf with surf breaking on black rock far beneath
- a pool set in a field of black volcanic rock with steam venting from cracks around it
- a bath at the edge of a frozen lake, the ice starting a step from its rim
- a pool in a moss garden with a narrow stone channel of cold water running beside it
- a bath under one enormous ancient leaning pine whose lowest branch reaches over the water
- a deck-built bath standing on tall wooden posts out over a fast river
- a pool inside a ring of standing rocks with a small red-railed footbridge at its gap
- a terrace bath facing a distant volcano cone across a whole valley
- a bath under a tunnel of arching maple branches meeting overhead
- a pool in a fern gorge with a tall thin waterfall dropping behind it
- a bath in an open snowfield with one weathered torii standing at its far rim
- a pool cut into a tidal rock shelf, the sea filling and draining the rocks beyond
- a bath under a great hanging curtain of wisteria vine on a timber frame
- a pool in a walled garden with a raked-gravel apron and one crooked stepping stone
- a bath on a hillside shelf with the whole lit inn-town strung out below
- a pool in the floor of an old caldera with the open sea beyond its far lip
- a long bath running beside a stand of tall grasses on a river flat
- a pool built against the base of a sheer cliff face that closes off one side

ONE CHARM DETAIL PER ENTRY — a clever small thing the eye finds on second look, belonging to the bath or its setting: a crooked stepping stone set apart from the rest, a hollowed log carrying water in, one rim stone worn to a smooth dish, a narrow overflow notch, a small stone step down into the water, a gnarled root grown around a rim boulder, a mossy scoop cut into the lip, a single flat rock standing proud in the middle of the pool.

STONE VOCABULARY — describe rock POSITIVELY and geologically, never as masonry. Rounded, rain-worn, bands that sag and vary, edges softened, cracks at angles, a rim of boulders settled unevenly. NEVER stacked, courses, cut blocks, dressed faces, keystone or brickwork — masonry vocabulary renders a brick wall and brick walls attract carved gibberish lettering.

AXIS DISCIPLINE — this axis owns the POOL and its SETTING ONLY:
- The word "steaming" on the pool is required. Say NOTHING else about what the steam is doing and NOTHING about what lights it — a separate axis owns all of that.
- NO season and NO weather. No snow, no blossom, no petals, no autumn colour, no rain, no fog. A separate axis owns the season, and naming one here contradicts it. Trees are named by kind and shape only (pine, bamboo, maple, cedar, wisteria vine, tall grasses), never by what is on them.
- NO time of day, NO colour palette, NO lighting words.
- NO animals of any kind. NO people, NO figures, NO bathers, NO hands.
- NO buildings with windows, NO inn, NO lanterns, NO curtains, NO boards, NO signs — separate axes own the inn and the props.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. steam_light — ★ THE MONEY SHOT. Place-agnostic by construction.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_steam_light.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} STEAM-AND-LIGHT descriptions for MangaBot's onsen-evening path. This is the MONEY-SHOT axis and the single most important pool on the path: what the STEAM is doing, what LIGHTS it, and the COLOUR the whole frame takes from that. It is always evening or night.

Each entry: 24-34 words.

STEAM IS THE HERO MATERIAL. Not a wisp, not a hint — thick, sculptural, lit, and doing something. It rolls over the rim and runs downhill across the stones. It stands in a low bank over the water. It climbs in slow coils and thins out overhead. It is pushed flat and sideways. It veils the far side of the pool so the far rim only half reads. It catches every light source it passes through.

THE VIVID LAW — every entry names TWO colours, and at least half the entries pit a WARM colour against a COOL one (amber against deep blue, orange against blue-green, gold against violet, rose against slate, cream against teal). Saturated and committed. A muted or single-hue entry is a failure.

VARIETY MANDATE — spread the light sources across all of these:
- small lanterns sunk under the water so the pool glows from beneath and lights the steam from inside
- a stone lantern with a real flame in its window, close enough to throw its light across the steam
- a line of round paper lanterns strung above the water, each one a warm blur inside the steam
- the inn's warm windows behind, their light reaching across the water and picking out the rolling steam
- a huge low moon just clear of the ridge, cold and enormous, with the steam silver in front of it
- the very last band of sunset behind the mountains, orange under a deep blue sky already showing stars
- a brazier or an open fire beside the pool throwing orange up into the drifting steam
- a scatter of small warm bulbs on a wire along the fence
- one candle burning in a stone niche at the rim
- a lit walkway lamp on a post, its cone of light full of moving steam
- starlight and snow-light only, the steam pale grey-blue and the water almost black
- a hand-lantern set down on a rim stone, its light low and close
- distant town lights far below, tiny and warm, with the steam lit from the near side only

PLACE-AGNOSTIC — this axis rolls against two dozen totally different settings, so it must NEVER name a place. Never a cliff, a gorge, a forest, a rooftop, a river, the sea, bamboo, a town, a garden. When you need something for the light to land on, describe the KIND of detail instead: "whatever stands closest", "the nearest rim stones", "the water's surface", "the wet stone underfoot", "every wet edge", "the timber nearest the water". That is what makes these entries work everywhere.

AXIS DISCIPLINE — steam, light and colour ONLY:
- NO season and NO weather (no snow, no rain, no petals, no leaves, no wind as weather). A separate axis owns the season.
- NO animals. NO people, NO figures, NO bathers, NO faces, NO skin.
- NO props, NO buildings described beyond "the windows behind" as a light source, NO camera or framing language.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. inn — the lit lantern-box behind + THE PLAIN-SURFACE LAW.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_inn.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} INN descriptions for MangaBot's onsen-evening path — the traditional wooden hot-spring inn standing BEHIND or BESIDE the open-air bath, seen from outside across the water as part of ONE continuous open-air shot. Warm lit windows are its whole charm: a lantern-box of glowing paper screens in the blue evening.

Each entry: 26-38 words.

EVERY ENTRY HAS FOUR PARTS, in this order:
1. WHERE IT SITS relative to the bath — behind and above, set back across the water, off to one side, stacked up the slope behind, close on the near side with its eave reaching out. It is always further away and SMALLER in the frame than the bath.
2. ITS MASSING, TURNED — dark timber and white plaster, deep tiled or shingled eaves, a wraparound balcony, storeys stepping up a hillside, a covered walkway on posts, a low cedar bath-house with one deep eave, a two-storey wing with a rail. ALWAYS include an angle so one flank recedes into the picture: "turned three-quarters to us so one wing runs back", "seen obliquely so its long side falls away". A building faced square-on renders a dead mirrored facade.
3. ITS LIT WINDOWS — warm paper screens glowing, a grid of soft amber rectangles, one upstairs screen brighter than the rest, a lit lattice, a glowing gap where a screen stands part-open.
4. ONE PLAIN SURFACE, NAMED — this part is mandatory and it is what keeps gibberish lettering out of the render. Every entry must positively describe at least ONE of the inn's flat panels as plain, or as carrying a single small painted PICTURE and nothing else:
   - "its short entry curtain a plain deep indigo with one small painted pine sprig and nothing else"
   - "its round lanterns plain warm cream, each face a single unbroken wash of colour"
   - "a smooth bare cedar plank beside the doorway carrying one painted circle and nothing more"
   - "the hanging cloth at the doorway one flat colour end to end"
   - "its eave boards plain dark timber, smooth and unmarked"
   - "a wooden tag hanging by the step, blank and pale"
Rotate which surface each entry names, and cover the entry curtain, the lantern faces, the plank beside the doorway and the eave boards across the set. Small painted pictures may only be a sprig, a leaf, a circle, a wave, a moon, a mountain outline, a pine, a crane or a spiral.

VARIETY MANDATE — spread across: a large multi-storey inn stacked up the slope; a single low bath-house with one enormous eave; a long wing with a wraparound balcony; a covered walkway on posts leading down to the bath; a small changing shed with a deep overhang; a half-roofed shelter reaching over one end of the pool; a cluster of separate little cabins with lit screens; an old main hall with a steep shingled roof; a tall narrow inn with lit balconies on three floors; a modest family inn with one warm window and a lit doorway.

AXIS DISCIPLINE — the building ONLY:
- NO interior. We never go inside and we never describe a room. The building is seen from outside, in the same unbroken frame as the bath.
- NO season, NO weather, NO time-of-day words, NO colour palette beyond the windows being warm.
- NO steam behaviour and NO other light source.
- NO animals. NO people, NO figures, NO bathers.
- NO description of the pool.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. charm — the props. Picked TWICE per render for density.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_charm.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} CHARM-PROP descriptions for MangaBot's onsen-evening path — the small hand-made objects around an open-air hot-spring bath that make the picture feel lived-in and loved. Two of these are picked per render, so each one must stand alone and must be a genuinely charming little discovery, never filler.

Each entry: 16-26 words. ONE object or one tight little arrangement.

THE CHARM LAW — every entry carries one clever detail the eye finds on second look: something slightly out of place, mid-use, worn smooth, mended, or wedged where it will not drift.

VARIETY MANDATE — spread across all of these families:
- a small wooden raft floating on the water carrying a flask and three little cups, one cup set apart
- yellow yuzu fruit bobbing on the surface, a few nudged together against the rim
- a folded white cloth balanced on top of the rim, its corners neat
- a cotton robe hanging on a peg under the eave, its sash looped over the same peg
- a pair of wooden clogs set on a flat stone at the step, one turned slightly out of line
- a bamboo pipe pouring a thin steady stream of water into the pool, the rock beneath it worn to a dish
- a stone lantern with a real flame small in its window
- a wooden bucket floating low with a scoop hooked over its lip
- a basket of glass bottles sunk in the cold channel to keep, one leaning out
- a narrow wooden shelf pegged to the rim holding a cup and a folded fan
- a long-handled dipper resting across the rim stones
- a low three-legged stool on the wet stone, one leg shorter than the others
- a stack of folded towels under a little roofed shelf, the top one unfolded
- a small iron brazier with a kettle sitting on it, the lid slightly askew
- a lidded lacquered box set on a dry stone
- a tray of black and white pebbles set out mid-game on a flat rock
- a tangerine half-peeled on a stone with its peel curled beside it
- a paper lantern leaning against a boulder where someone set it down
- a bundle of cut cedar branches steeping in the water, tied with cord
- a woven straw mat rolled and stood against the fence
- a hand-broom and a pail left by the stepping stones
- a small cracked cup mended with a fine gold seam
- a bamboo rail with a towel slung over it, one end trailing to the stone
- a wooden ladle wedged upright between two rim stones so it will not drift
- a small hollowed gourd floating with a cord tied to the rim

AXIS DISCIPLINE — objects ONLY:
- NO animals of any kind (a separate axis owns those, and two axes that can both supply an animal will render two animals).
- NO people, NO figures, NO bathers, NO hands, NO faces. Folded clothes and empty clogs are welcome; a person wearing them is not.
- NO season, NO weather, NO lighting, NO colour palette, NO steam behaviour, NO buildings, NO camera language.
- Every flat surface you name must be plain, smooth and unmarked, or carry one small painted picture (a sprig, a leaf, a circle, a wave, a moon, a pine) and nothing else.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. air — the season + what the air is doing. Place-agnostic, axis-clean.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_air.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} AIR-AND-SEASON descriptions for MangaBot's onsen-evening path — what the air around an open-air hot-spring bath is DOING, and the season it brings with it. This axis owns the season for the whole render.

Each entry: 16-26 words.

PLACE-AGNOSTIC — this rolls against two dozen totally different settings (cliffs, gorges, rooftops, snowfields, sea shelves, bamboo stands), so NEVER name a place and NEVER name a tree species. When you need something for the weather to land on, say "whatever stands over the water", "every rim and ledge", "the stones beyond the steam", "the wet timber", "the far edge". That is what makes an entry work everywhere.

VARIETY MANDATE — cover all four seasons, spread across:
WINTER: fat slow flakes coming down and settling white on every rim and ledge, each one gone the instant it touches the water; a fine dry snow already piled in soft rounded caps on everything just outside the steam's reach; a still, hard-frozen air with breath showing; the first tentative flakes of a first snow; frost standing on every surface a step beyond the water's warmth.
SPRING: pale petals coming down steadily and collecting in a slow drift against the far rim, more of them turning slowly on the surface; a soft damp air after rain with the wet stone dark; a warm gusty evening air full of loose petals.
SUMMER: a thick still warmth with the sound of insects everywhere; fireflies drifting low and unhurried over the water; a sudden warm rain hissing where it lands on the hot surface; a heavy air after a hot day with the stone still warm.
AUTUMN: small dark leaves floating and gathering along one edge; a sharp clear air with the sky already dark; a dry rustling air moving through whatever stands over the water; a thin cold drizzle dimpling the whole surface.
ANY: a low mist lying over the ground beyond the bath so the far things only half read; a steady side wind pushing everything flat and sideways; a dead-still air with not one thing moving.

MOTION VOCABULARY — snow and petals DRIFT, SETTLE, FALL, COME DOWN, GATHER and COLLECT. They never sweep, rush, swirl, race or whirl — motion nouns render as white streak objects across the frame.

AXIS DISCIPLINE — the air and the season ONLY:
- NO light, NO lanterns, NO windows, NO moon, NO sunset, NO glow, NO colour palette. A separate axis owns every light source and the whole palette, and naming light here contradicts it.
- NO steam behaviour (a separate axis owns the steam) — you may say what the weather does WHEN IT MEETS the hot water, which is the best thing about this path.
- NO animals except insects as a sound or as fireflies. NO people, NO figures, NO bathers.
- NO props, NO buildings, NO camera language.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. wildlife — the ONLY axis allowed to contain an animal. 0.45 gate.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_wildlife.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} WILDLIFE descriptions for MangaBot's onsen-evening path — an animal at or in an open-air Japanese hot-spring bath, with comic timing. This is the path's laugh, so every entry must be genuinely funny, charming or unexpected; a plain animal standing still is a failure.

Each entry: 16-26 words.

SIZE IS MANDATORY IN EVERY ENTRY. The bath and its steam are the hero, so every single entry must contain an explicit size or distance word: "small at the far end", "tiny on the far rim", "a small shape at mid-distance", "low at the near edge and no bigger than a rim stone". An entry with no size word renders the animal at hero scale and ruins the frame.

VARIETY MANDATE — spread across:
- three snow monkeys sunk to their chins at the far end, the smallest one with its eyes shut and a wet leaf stuck flat to the top of its head
- a single small macaque sitting on the rim with a folded cloth balanced on its head, entirely serious about it
- a small monkey crouched at the lip about to drop in, the older ones ignoring it completely
- a young deer standing small on the far rim with its nose almost touching the water
- a cat curled asleep on a warm flat stone at the near edge, one paw over its own face
- a small cat sitting upright on the eave above, watching the water with total suspicion
- a crowd of orange and white carp jammed into the cold channel at the side, tails overlapping
- one fat pale carp small at the far edge, nosing at something floating
- a raccoon-dog looking down from the top of the bank, small and caught mid-decision
- a heron standing tiny and perfectly still on the far rim, one leg up
- three sparrows lined along a bamboo rail at mid-distance, one facing the wrong way
- a small fox sitting at the very edge of the light with its tail curled round its feet
- a hare small on the snow beyond the rim, ears up, mid-freeze
- a tiny frog sitting on a floating wooden lid, going nowhere
- a small monkey leaning over the rim trying to reach a floating fruit, one arm fully extended
- a pair of ducks small at the far end, one asleep, one paddling in a slow circle
- a squirrel small on a branch above with both cheeks visibly full
- a cat small at the step, one paw in the water, reconsidering everything
- an owl small and round on a post at the edge of the frame
- a little group of monkeys at the far rim grooming each other, one with a towel it has stolen

EVERY ANIMAL IS A REAL, WHOLE, RECOGNISABLE ANIMAL — full head and body, correct anatomy, a real animal's face. NEVER part-human, NEVER upright and talking, NEVER a hybrid, NEVER wearing clothes. A towel on a monkey's head is real behaviour and is welcome; a monkey in a robe is not.

AXIS DISCIPLINE — the animal ONLY:
- NO people, NO figures, NO bathers, NO hands.
- NO season, NO weather, NO lighting, NO colour palette, NO steam behaviour, NO buildings.
- Do NOT re-describe the bath beyond a rim, a lip, a step, a channel, a rail, a branch or an eave to place the animal on.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 7. bather — the ONLY axis allowed to contain a figure. 0.55 gate.
  //    THE TASTE LINE LIVES HERE. Modest, wholesome, covered, small, funny.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'onsen_evening_bather.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (n) => `You are writing ${n} GUEST descriptions for MangaBot's onsen-evening path — a small, modestly-covered figure at an open-air hot-spring bath, doing something quiet and often funny. Handle it exactly the way wholesome family anime handles a hot spring: cosy, warm and completely innocent.

Each entry: 16-28 words.

THE COVERING RULE IS ABSOLUTE AND EVERY ENTRY MUST STATE IT. Each entry uses exactly ONE of these three, named in the entry itself:
  (a) sunk in the water to the shoulders, with only head and shoulders above the surface;
  (b) wrapped in a white cotton towel;
  (c) fully dressed in a cotton robe with a sash, at the rim, on the step, on the deck or on the walkway.
ONE covering per entry. Never two garments, never one garment over another, never "over" anything — layered phrasing makes the renderer invent an inner garment. Never describe a body, never describe skin, and never describe what the water or the steam does or does not hide.

SIZE IS MANDATORY IN EVERY ENTRY. The bath, its steam and the inn are the hero. Every entry contains an explicit small-size or distance word: "small at the far end of the pool", "a small figure at the rim at mid-distance", "small on the deck across the water", "occupying a small part of the frame". An entry with no size word renders a hero portrait and ruins the picture.

ROLE ONLY, NEVER NAMED, AND A MIXED CAST — spread widely across ages and kinds of people. This variety is what keeps the register wholesome.
- an old man sunk to the shoulders at the far end with a folded cloth squared neatly on top of his head
- a grandmother and a small grandchild sunk to the shoulders side by side at the far rim, the child counting out loud on its fingers
- two friends sunk to the shoulders at mid-distance playing a hand-clapping game just above the water
- a young woman sunk to the shoulders small at the far end with a paperback propped open on a dry rim stone
- a small boy sunk to the shoulders with his cheeks puffed out, holding his breath on purpose
- a father in a white cotton towel small on the stone, hauling a wooden bucket with both hands
- a teenager sunk to the shoulders tipping a wooden dipper of water over one shoulder, eyes shut
- an old woman sunk to the shoulders at the far end with a small cup held up clear of the water
- three guests in cotton robes small on the deck across the water, one pouring for the other two
- a guest in a cotton robe and sash small on the walkway, sweeping snow off the stepping stones
- a small child in a white cotton towel at the step, one toe in the water, having second thoughts
- a guest in a cotton robe at the rail at mid-distance, head tipped back at the moon
- two old men sunk to the shoulders at opposite ends of the pool, both pretending not to be racing
- a young man sunk to the shoulders small at the far edge, arms folded on the rim stone, half asleep
- a mother in a cotton robe small at the rim, drying a child's hair with a folded cloth
- a guest in a white cotton towel small on the stone, reaching for clogs with one foot
- a pair of friends in cotton robes small on the step, toasting each other with tiny cups
- a small girl sunk to the shoulders at the far rim, blowing at a floating fruit to move it along
- an old man in a cotton robe small under the eave, fanning himself and going nowhere
- a guest sunk to the shoulders at mid-distance with a towel over the eyes, entirely done with the world

HARD BANS — every one of these is a hard failure:
- NEVER bare, nude, undressed, exposed, unclothed, topless, or any word for skin, chest, thigh, curve or figure.
- NEVER sultry, alluring, sensual, seductive, coy, glistening, dewy, flushed-with-heat, or wet-skinned.
- NEVER a swimsuit, bikini or bathing suit of any kind.
- NEVER a close-up, NEVER a portrait, NEVER a face filling the frame, NEVER a back-to-camera silhouette as the subject.
- NEVER crying, NEVER grief, NEVER peril.
- NEVER a named character and NEVER a named anime.
- NEVER an animal (a separate axis owns those).

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  console.log('\n✅ 7 onsen-evening pools generated (camera is hand-authored).');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
