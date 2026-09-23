#!/usr/bin/env node
/**
 * BloomBot coastal-cliff-bloom path pools (2026-09-23).
 *
 * THE GAP: BloomBot has 25 paths and every one is flowers. `landscape` already
 * ships SEA-CLIFF HEADLAND BLOOM-TURF and FAROE-STYLE BASALT TERRACE BLOOM —
 * 86 of its 200 landform entries are coastal — and every one of them is the
 * postcard: the cliff seen from OUTSIDE, bloom-turf sweeping to a sheer drop,
 * white surf far below, sea stacks on the horizon. `desert-bloom` owns the
 * other dry flowery slope. So "a flowery slope with scenery behind it" is
 * ALREADY THIS BOT and this path may not be that.
 *
 * Its differentiator is THE SEA AND THE WIND AS PHYSICAL FACTS ON THE PLANTS,
 * in the NEAR ground, seen by someone STANDING ON the cliff top:
 *   every plant cut flat and level across the top and leaning inland, because
 *   that is what constant wind does · the seaward half of a plant dried dead
 *   brown and the sheltered half still green, the line between them sharp ·
 *   the ground stopping DEAD in a hard line across the picture with open water
 *   far below it and the rock face hidden under the edge · white water bursting
 *   up past the edge and raining back onto the flowers · coastal species only
 *   (pink pompom clumps, white notched-petal sprays, egg-yolk-yellow pea
 *   flowers, fleshy blue-green crack plants), never garden ones · bright orange
 *   crusty lichen on the rock · seabirds gliding BELOW the level of the ground.
 *
 * SIX AXES (5 always-on + 1 gated at 0.6) — the same shape as the sibling
 * alpine-wildflower-meadow path, which passed at 4.67, so the wiring is
 * known-good:
 *   cliff_ground  HERO — the near ground AND the edge where it stops
 *   coast_cast    ★ named coastal species in their REAL prior colours, shaped
 *                 by wind and salt
 *   sea_below     ★ the one visible fact that proves the drop and the sea
 *   coast_light   ★ owns the palette; two named colours, warm against cool
 *   sea_life      (0.6 gate) ONE whole coastal animal, scale-welded
 *   charm         one clever detail the eye finds on second look
 *
 * ⭐ LESSON 35 IS THE BIGGEST RISK AND IT IS A FRAMING RISK, NOT A CONTENT ONE.
 * A high place under a big sky is the purest vista prior there is, a crop clause
 * does not beat it, and "a named cliff licenses the whole cliff system" — say
 * "a sea cliff" and you get an aerial postcard of a headland. What decides the
 * render is WHAT KIND OF THING the near ground is: a self-contained detachable
 * object renders as that whole object seen from outside; a FEATURE OF SOMETHING
 * TOO BIG TO FIT IN FRAME renders as a near surface. So every ground entry names
 * a FEATURE (a bank of wind-cut grass, a table of bare rock, a crack, a step, a
 * tilted slab, a hollow) and NEVER the cliff, the headland, the coast or the bay.
 * The whole class is banned in the recipe rather than argued with, per the
 * BrickBot camera-pool precedent: on a framing failure, delete the offending
 * class instead of adding words.
 *
 * ⭐ THE HEIGHT-EXCLUSIVE SURFACE (lesson 21). Camera words do not move a camera;
 * only a surface that CANNOT EXIST from the wrong height does. A sea cliff's two
 * standard vantages are from the air and from the sea, and both of them show the
 * ROCK FACE. So the load-bearing surface here is: the ground stops, and the rock
 * below the edge is out of shot — the next thing after the last few feet of
 * ground is open water, far down. Stated positively (lesson 26/27: an absence
 * gets backfilled) as "the last few feet of ground and then open water far
 * below". If the face is in frame, the camera left the cliff top.
 *
 * ⭐ THE JARGON TRAP (lesson 28, the BrickBot "envelope"). Coastal botany and
 * coastal geology BOTH collide with common objects, so both are banned even
 * where correct. `thrift` is a savings bank / a charity shop. `stack` is a stack
 * of paper. `arch` is architecture. `head` is a person's head. `shelf` is a
 * bookshelf. `lip` is a mouth. `spit` is spitting. `spume`, `machair`, `geo`,
 * `voe` and `stac` have no layperson prior at all. `kidney vetch` carries an
 * ORGAN, `bird's-foot trefoil` carries a BIRD'S FOOT, `sea holly` carries
 * CHRISTMAS HOLLY, `scurvygrass` carries a DISEASE, `sea carrot` carries a
 * CARROT, `razorbill` carries a RAZOR, and `sea lavender` drags a Provence
 * lavender field. All banned; each is described in plain words instead.
 * `salt burn` carries FIRE, and `wind-pruned` carries garden shears — both
 * replaced by what they physically look like.
 *
 * Species are drawn from a fixed roster whose Flux PRIOR COLOUR already matches
 * the colour wanted (BloomBot's flower×colour render-prior lesson: you cannot
 * recolour a named species with a word).
 *
 * Run: node scripts/gen-seeds/bloombot/gen-coastal-cliff-pools.js
 *      (SEED_TOTAL=25 for the MVP — the default. Scale only after sign-off.)
 *      SEED_POOL=<key> regenerates one pool.
 */
const { generatePool } = require('../../lib/seedGenHelper');

// ─── Shared law blocks, appended to every recipe ────────────────────────────

const LAYPERSON_LAW = `━━━ THE LAYPERSON-WORD LAW (this is the #1 rule — a correct coastal term can be a confidently WRONG picture) ━━━
For every word, ask what an ordinary person pictures when they read it. If that is a different object, the word is BANNED even though it is correct.
NEVER write any of these words: thrift, sea pink, stack, stac, sea stack, arch, archway, head, headland, promontory, cape, point, shelf, ledge, lip, spit, spume, machair, geo, voe, sound, firth, tombolo, cove, bay, inlet, strand, scarp, cushion, pincushion, mat, pad, rosette, crown, eye, spur, bract, umbel, calyx, kidney vetch, bird's-foot trefoil, birdsfoot, sea holly, scurvygrass, scurvy grass, sea carrot, wild carrot, razorbill, guillemot, kittiwake, chough, fulmar, gannet, shag, skua, petrel, sea lavender, samphire, glasswort, salt burn, salt-burnt, burnt, scorched, seared, pruned, wind-pruned, sheared, clipped, trimmed, topiary.
INSTEAD use plain words for the same thing:
 · a tall island of rock standing alone in the water, cut off from the land (never "stack")
 · a narrow flat step in the rock (never "ledge" or "shelf")
 · the edge where the ground stops (never "lip")
 · flying white water, blown foam, white spray (never "spume")
 · cut flat and level right across the top, as if something had run a blade over it (never "pruned" or "sheared")
 · the seaward half dried to dead brown and gone brittle, the sheltered half still green (never "salt burn")
 · clusters of small egg-yolk-yellow pea-shaped flowers in woolly grey-green heads (never "kidney vetch")
 · low sprawling patches of small yellow-and-orange pea flowers (never "bird's-foot trefoil")
 · thick fleshy bright-green segmented stems with flat heads of tiny yellow flowers (never "samphire")
 · small white four-petalled flowers over thick round dark-green leaves (never "scurvygrass")`;

const RULER_LAW = `━━━ NO OFF-CAMERA RULER, AND NEVER A BODY PART AS ONE ━━━
Every size comparison must be welded to something big and fixed that is ALREADY IN THE PICTURE — the bare rock it sits on, the boulder beside it, the width of the crack, a flower clump next to it. Keep the anchor GENERIC — never a named shape of ground (see the axis-clean law). NEVER a body part and NEVER anything off-camera: no hand's width, no finger-width, no thumb, no fingernail, no palm, no arm's length, no coin, no pencil, no dinner plate, no door, no book, no phone — and nothing man-made at all, since none of it is in the picture either. A body part is invisible to the camera, so it buys nothing, and on a bot that shows no people it also puts a stray human noun into the prompt.`;

const NO_GROUND_SHAPE_LAW = `━━━ AXIS-CLEAN: NEVER NAME A SPECIFIC SHAPE OF GROUND ━━━
A separate axis rolls the shape of the ground for every render, so naming one here contradicts it about 24 times out of 25. NEVER write: a table of bare rock, a tilted plate of rock, a tilted apron, a bank of scoured wiry grass, a shoulder of peaty ground, a broken rim of turf, a hollow floored with thin dark soil, a tumble of loose broken stone, a shallow step down in the stone, a crack in a slab, a bed of thin dark soil, or any other named ground formation.
Say instead: bare rock · the rock · the stone · a stone · the ground · the grass · the soil · a crack in the rock · a flower clump · the edge of the ground. These are true whatever ground the other axis rolled.`;

const NO_TEXT_LAW = `━━━ NOTHING SHAPED LIKE A SIGN, AND NO WORD THAT MEANS "PUT THERE BY A HAND" ━━━
Never name any of: sign, signpost, waymark, marker, plaque, label, board, tag, notice, flag, banner, map, chart, inscription, carving, marks, markings, lettering, writing, cross, memorial, bench, lighthouse, beacon, buoy, boat, ship, sail, hull, mast, net, rope, fence, gate, wall, stile, step cut in the rock, path, footpath, track, road, hut, cottage, ruin, tower, railing, post. These render as gibberish text or as human structures.
ALSO never use any word meaning a line was PUT there by a hand — no ruled, no drawn, no traced, no written, no inked, no pencilled, no scored, no tide mark, no mark of any kind, and never "as if ruled" or "so straight it looks drawn". A straight edge is described by what it physically IS: "a hard straight line", "straight for its whole length", "the two halves meeting in one sharp straight edge". ("ink-blue" as a colour word is fine.)
Also never write the verb "cross" — write "run right across" instead, because the noun sense puts a memorial cross on a clifftop, which is one of Flux's strongest clifftop priors.
Describe only living plants, rock, soil, water, foam, salt, light, air and animals.`;

const NO_PEOPLE_LAW = `━━━ NO PEOPLE AND NOTHING BUILT — FILL THE GROUND INSTEAD ━━━
Never a person, walker, hiker, climber, figure, silhouette, backpack, boot or footprint. Do not say they are absent either — instead fill the ground positively: the space between the flowers is always bare rock, bright orange crusty lichen, scoured wiry grass, thin dark soil or loose broken stone, right out to the edges of the picture, so there is nowhere a path could be.`;

const NEAR_SURFACE_LAW = `━━━ THE NEAR-SURFACE LAW — NAME A FEATURE, NEVER THE WHOLE CLIFF (this is the framing rule and it is load-bearing) ━━━
A high place under a big sky is the strongest "wide aerial postcard" prior there is, and naming the cliff itself hands Flux the whole cliff. So:
NEVER name or imply the whole landform or a view of it from outside: no cliff seen from across the water, no rock face, no wall of rock rising from the sea, no curve of coastline, no coast stretching away, no sweeping view, no panorama, no vista, no aerial view, no bird's-eye view, no looking down at the cliffs, no distant cliffs, no shoreline, no beach, no whole island.
ALWAYS name instead the small NEAR THING the camera is right on top of, a feature of something far too big to fit in the frame: a bank of scoured wiry grass · a table of bare rock · a crack in a slab · a shallow step down in the stone · a tilted plate of rock · a hollow floored with thin dark soil · a shoulder of peaty ground · a boulder sitting in grass · a broken rim of turf with the soil showing in section beneath it · a tumble of loose broken stone.
AND the picture always reads from ON TOP of the ground, never from the air and never from the water. What proves that is the one surface those wrong vantages cannot show: the last few feet of ground, and then open water a long way down. The ground STOPS in a hard line that runs ACROSS the picture from one side edge to the other with both of its ends out of frame, and what lies beyond that line is open water far below — the rock under the edge is never in the picture at all.`;

const NO_CORRIDOR_LAW = `━━━ NO CORRIDOR, NO VANISHING POINT ━━━
Never write converging, convergence, vanishing point, leading to a single point, apex, meeting point, receding rows, curving away into the distance, or a line of anything running away from the camera. Every feature — the edge of the ground, a band of flowers, a crack, the waterline — RUNS RIGHT ACROSS the picture from one side edge to the other, and its ends run out of frame. Write "runs right across"; never write the verb "cross".`;

const SCALE_LAW = `━━━ THE SCALE LAW ━━━
A low count is what makes a creature render giant — Flux gives each named subject a share of the frame. So insects are always stated as "a dozen or more" or "twenty or more", never one, two or three. Any size comparison must be welded to something big and fixed that is already IN the picture — the bare rock it stands on, the boulder beside it, a flower clump beside it, the width of the crack — never an off-camera ruler like a thumb, a fingernail or a coin, and never a free-floating object whose own size could inflate.
GRANT NO SUBJECT A DETAIL EXEMPTION. Never add a close anatomical clause for "the nearest one" — no "the nearest showing its orange feet / barred wings / amber eye". The one you describe most is the one that comes out biggest.`;

const SPECIES_ROSTER = `━━━ THE SPECIES ROSTER — draw only from this list, and keep each one its own real colour ━━━
Flux renders a named flower in its own fixed colour and a colour word cannot override it, so use these exact descriptions:
 · dense low domes of grass-like leaves topped with hundreds of small bright pink pompom flowers on short bare stems
 · loose sprays of white flowers with deeply notched petals, trailing over the rock on blue-green stems
 · clusters of small egg-yolk-yellow pea-shaped flowers in woolly grey-green heads
 · low sprawling patches of small yellow-and-orange pea flowers
 · stiff low patches of purple-flowered heather
 · gorse bushes solid with egg-yolk-yellow flowers over dark spines, cut flat and level across the top
 · thick fleshy bright-green segmented stems wedged in the rock cracks, with flat heads of tiny yellow flowers
 · small white four-petalled flowers over thick round dark-green leaves
 · flat purple-pink patches of tiny wild thyme flowers
 · tiny white star-shaped flowers over swollen red-tinged leaves lying flat on the rock
 · small violet daisy flowers with gold centres on fleshy stems
 · white daisy flowers with gold centres over feathery leaves
 · big white daisies with gold centres
 · dense heads of hot coral-pink flowers on tall arching stems (ONLY ever in the shelter of a rock or a hollow — nothing tall survives in the open here)
 · flat white lacy flower plates on hairy stems
 · pale yellow primrose flowers low in the grass
 · bluebells in a tight patch in the lee of a boulder
 · sea campion, written only as "white flowers with notched petals over a pale green swollen pod behind each one"
 · bright orange crusty lichen spreading over the rock in rings (not a flower, but it is the loudest colour on the cliff and it belongs in frame)
 · grey-green crusty lichen and black crusty lichen in bands down the rock`;

const WIND_AND_SALT_LAW = `━━━ WIND AND SALT ARE PHYSICAL FACTS, AND THEY ARE THE WHOLE POINT OF THIS PATH ━━━
The identity of this path is what constant wind and flying salt water DO to a plant, shown on the plants themselves:
 · every plant is cut flat and level right across the top, as if a blade had been run over the whole slope at one height
 · every stem and every flower head leans the same way, inland, away from the water — the whole slope combed one direction
 · the plants grow densest in the lee of a rock and thin out to nothing where the ground is exposed
 · nothing here is tall: the tallest thing growing is no higher than the boulder beside it
 · the half of a plant that faces the water is dried to dead brown and gone brittle, while the sheltered half of the SAME plant is still green, and the line between the two is sharp and straight
State at least one of these physically in every entry where it can apply. Never as an adjective — always as something visible.`;

const WHIMSY_BAR = `━━━ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER ━━━
A clean, correct, sober entry is a MISS, not a pass. Every entry must either show something nobody has been shown before or take the familiar and redress it as something more interesting. Ask of each one: is this the obvious version of this idea, or the surprising one? Ship the surprising one. Colour is LITERAL and committed — saturated, named, never muted, never washed-out, never tasteful-grey. No entry may read as a tasteful postcard of a flowery clifftop with the sea behind it — that picture already exists on this bot and this path exists to be the other thing.`;

const POOLS = {
  // ── 1. cliff_ground — the HERO axis. Leads with its defining mass. ────────
  bloombot_coastal_cliff_ground: {
    metaPrompt: (
      n
    ) => `You are writing ${n} GROUND descriptions for BloomBot's "coastal-cliff-bloom" path — flowers growing on the top of a sea cliff, seen by someone standing right on it, a few feet back from where the ground stops. This axis is the STAGE and the HERO of the picture: the near and middle ground, which is ALWAYS flowers AND the bare rock, orange lichen, scoured wiry grass, thin dark soil or loose broken stone around them, PLUS the hard line where that ground stops.

THE TWO THINGS EVERY ENTRY MUST DO:
(1) OPEN by naming the small NEAR feature the camera is standing on — a bank of scoured wiry grass, a table of bare rock, a crack in a slab, a shallow step down in the stone, a tilted plate of rock, a hollow of thin dark soil, a shoulder of peaty ground, a boulder sitting in grass, a broken rim of turf with the soil showing in section beneath it, a tumble of loose broken stone. This near feature FILLS the near half of the picture and individual flower heads in it are close enough to see one at a time.
(2) SAY WHERE THE GROUND STOPS — a hard line running ACROSS the picture from one side edge to the other with both ends out of frame, and beyond that line nothing but open water a long way down.

LENGTH IS A HARD RULE: each entry is ONE sentence of 22-38 words. COUNT THE WORDS BEFORE YOU WRITE THE NEXT ENTRY. Any entry over 38 words is rejected — this pool is the hero axis and a long entry crowds every other axis out of the picture. Name the shape and material of the near ground, then what is scattered through it (bare rock, bright orange crusty lichen, loose stone, thin dark soil), then how the flowers sit in what is left, then where the ground stops. Do NOT name flower species or colours (a separate axis supplies those). Do NOT describe the light or the sky (a separate axis owns them). Do NOT describe the water itself beyond saying it is far below (a separate axis owns it).

VARIETY MANDATE — ~25 DISTINCT grounds: a bank of wiry grass cut flat and level, ending in a hard line with nothing past it; a table of bare rock ringed with bright orange crusty lichen and flowers crammed into every seam in it; a single wide crack in a slab packed solid with flowers while the stone either side of it is bare; a shallow step down in the stone with flowers banked along the sheltered underside of the higher part; a tilted plate of rock leaning toward the camera, flowers only in its low corner where soil has collected; a hollow floored with thin dark soil, flowers deep in it and nothing at all on the scoured rock around its rim; a shoulder of peaty black ground split open showing the roots in section; one big boulder sitting in grass with flowers heaped thick on its inland side and bare ground on its water side; a tumble of loose broken stone with flowers in the settled gaps and the fresh stone bare; turf broken off short at the edge showing a clean band of soil and root beneath it; a stripe of dense flowers following a wet seep straight across bare stone; a low rock wall of natural stone ribs running across the picture with flowers banked behind each rib; a rabbit-cropped lawn of grass so short it is almost bare, flowers only where they are out of reach in the cracks; a hollow in the rock holding a shallow pool of standing seawater with flowers to its edge; ground so scoured that flowers survive only in the lee stripe behind every stone. Vary the rock type, the tilt, how much soil there is, and how much of the frame the flowers get.

${NEAR_SURFACE_LAW}

${NO_CORRIDOR_LAW}

${WIND_AND_SALT_LAW}

${RULER_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 2. coast_cast — ★ the species, real colours, wind-and-salt habit ──────
  bloombot_coastal_cliff_cast: {
    metaPrompt: (
      n
    ) => `You are writing ${n} FLOWER-CAST descriptions for BloomBot's "coastal-cliff-bloom" path — which actual sea-cliff species are in flower, in their real colours, growing the way constant wind and flying salt water make them grow.

LENGTH IS A HARD RULE: each entry is ONE sentence of 20-34 words. COUNT THE WORDS BEFORE YOU WRITE THE NEXT ENTRY. Any entry over 34 words is rejected. Name TWO or THREE species from the roster below with their real colours, and say HOW they sit here — cut flat and level across the top, every head leaning inland, jammed into a crack, banked thick in the lee of a rock, thinning to nothing where the ground is exposed. Then, in AT LEAST 15 OF THE 25 ENTRIES (count them as you go), put the SALT DAMAGE on a named plant: the half of it facing the water dried to dead brown and gone brittle while the sheltered half of the same plant is still green, and the line between the two sharp and straight. That single fact is what makes this path this path.

${SPECIES_ROSTER}

VARIETY MANDATE — ~25 DISTINCT casts. Spread the roster widely: hot-pink pompom domes alone across a whole slab so the colour reads almost unreal; pink pompoms with white notched-petal sprays trailing between them; egg-yolk-yellow pea flowers in woolly grey heads against bright orange crusty lichen; purple heather and yellow gorse cut flat at exactly the same height so the two colours read as one level surface; fleshy bright-green segmented crack plants with flat yellow heads wedged into wet stone; a single clump of hot coral-pink flowers on tall arching stems standing in the shelter of one boulder while everything in the open is ankle-high; white daisies with gold centres leaning so far inland their stems are bent permanently; flat purple-pink thyme patches spread over warm bare rock; tiny white star flowers over swollen red-tinged leaves lying dead flat on the stone; bluebells in one tight patch behind a boulder with nothing on the water side of it; pale primroses low in grass that has been cropped to almost nothing. Never the same pairing twice.

${WIND_AND_SALT_LAW}

RULES — no species outside the roster; every species keeps its roster colour and description; no light, no weather, no sky, no animals, no water (separate axes own those); never a garden flower, never a rose, never a tulip, never a hydrangea, never a tropical bloom, never a hedge.

${NEAR_SURFACE_LAW}

${RULER_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 3. sea_below — ★ the one thing that proves the drop and the sea ───────
  bloombot_coastal_cliff_sea_below: {
    metaPrompt: (
      n
    ) => `You are writing ${n} SEA-BELOW descriptions for BloomBot's "coastal-cliff-bloom" path. Each entry is the ONE visible fact that proves the ground the flowers are on stops dead and drops a long way to open water. Without it the render is a flowery bank with a blue stripe behind it, which is exactly what this path must never be.

LENGTH IS A HARD RULE: each entry is ONE sentence of 16-28 words. COUNT THE WORDS BEFORE YOU WRITE THE NEXT ENTRY. One specific, visible, physically real fact about the WATER and the DROP. It must be a thing in the picture, not a mood and not an adjective. The water is always FAR BELOW and always a BAND ACROSS the picture, never a view of a coastline and never seen from the air.

VARIETY MANDATE — ~25 DISTINCT facts, spread across these kinds:
THE DISTANCE DOWN — open water so far below that the whole moving sea reads as small white threads on dark blue; a broad band of water across the upper picture with the waves too small to make out one at a time; white rings of foam round submerged rocks directly below, tiny with distance.
WATER COMING UP — a burst of flying white water climbing straight up past the edge of the ground and raining back down onto the near flowers, every petal beaded; blown foam drifting up over the edge in white shreds and catching in the grass; the whole near slope wet and shining while the sky is dry; a plume of white water thrown up so high it stands above the far horizon.
THE HORIZON — the far edge of the water a flat hard line straight across the picture, high up, with the sky above it a different colour entirely; a bank of low cloud sitting on the water so the horizon reads as two stacked bands.
THE SEA'S OWN COLOUR — the water slate and white and furious under a lit slope; the water flat turquoise over pale sand far below and near-black where it is deep, the two colours meeting in a hard curve; long smooth swells crossing the whole band in parallel lines from side edge to side edge.
ONE THING IN THE WATER — a tall island of rock standing alone in the water beyond the edge, its own flat top green with flowers and nothing reaching it; a submerged reef showing as a pale patch in the dark water; a slick of floating brown weed lifting and falling in one place.
THE WEATHER OUT THERE — a squall standing far out over the water dragging its own dark column of rain, the near flowers still dry; a line of white where the wind is tearing the tops off the waves.

${NO_GROUND_SHAPE_LAW}

RULES — this axis is WATER and the DROP only. Never describe flower species, rock shapes, animals, or the light's colour on the land (separate axes own those). Never a beach, never a shoreline, never a coast, never a harbour, never a boat.

${NEAR_SURFACE_LAW}

${NO_CORRIDOR_LAW}

${RULER_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 4. coast_light — ★ owns the whole palette. Commit hard. ───────────────
  bloombot_coastal_cliff_light: {
    metaPrompt: (
      n
    ) => `You are writing ${n} LIGHT descriptions for BloomBot's "coastal-cliff-bloom" path. This axis owns the entire palette of the render, and light on an exposed sea cliff is its own thing: it comes in off open water with nothing to soften it, it changes in minutes, and there is almost always weather somewhere in the frame.

Each entry: 16-28 words. COMMIT FULLY to one light condition. Name TWO colours explicitly, and in at least half the entries set one WARM colour against one COOL one — a single warm accent against all that cold grey-blue is the whole trick. Always name the SURFACE the light lands on (the flowers, the wet rock, the orange lichen, the grass, the water, the flying foam) — light is a patch, a streak, a rim or a pool on a real thing, never a general glow.

VARIETY MANDATE — ~25 DISTINCT light conditions: low sun turning the flying white water to gold while the rock stays black; a black storm wall standing far out over the water with the near flowers blazing lit in front of it; hard clear sun straight overhead, shadows cut razor-sharp on the stone and the water gone deep ink-blue; one break in the cloud dropping a single bright patch onto one bank of flowers while the rest of the slope is slate; backlight coming low through the petals so they read as lit coloured glass with the wet rock behind them almost black; the last gold light leaving the flowers and climbing the rock behind them; sun after a shower with every surface mirror-bright and the orange lichen burning; a rainbow standing against the retreating rain out over the water; grey sea fog pouring in over the edge so the far water is gone and only the near flowers remain in colour; cold blue dusk with the white foam still bright below; a hail shower leaving white stones bright among the pink flowers; moonlight silvering the wet rock with the water below all black and white; the sky shading from pale at the horizon to deep near-violet at the top of the frame; sun so low it comes in almost level and lights only the undersides of the leaves.

RULES — this axis is LIGHT and COLOUR only. Never describe rock shapes, flower species, animals or where the ground stops (separate axes own those). Never muted, washed-out, hazy-grey or tasteful — the colour is saturated and committed.

${NEAR_SURFACE_LAW}

${RULER_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 5. sea_life — 0.6 gate. ONE whole animal, scale-welded, no exemption. ─
  bloombot_coastal_cliff_life: {
    metaPrompt: (
      n
    ) => `You are writing ${n} ANIMAL descriptions for BloomBot's "coastal-cliff-bloom" path — a 60%-gated axis putting ONE creature of the sea cliffs into the picture. These are animals that actually live on an exposed sea cliff, never garden or farm ones.

LENGTH IS A HARD RULE: each entry is ONE sentence of 14-26 words. COUNT THE WORDS BEFORE YOU WRITE THE NEXT ENTRY. Any entry over 26 words is rejected. ONE whole recognisable animal, head and body both visible, small in the frame and never centred. Its size must be pinned by something big and fixed that is already in the picture — the slab it stands on, the boulder beside it, the width of the crack, the bank of grass.

THE ALLOWED CAST, each written in plain words so an ordinary person pictures the right bird:
 · a puffin, small and upright with a big bright orange-and-yellow striped beak and orange feet, standing in the grass
 · a big white-and-grey gull with a yellow beak
 · a big white seabird with black wingtips and a pale yellow head, wings straight and stiff
 · a glossy black crow with a curved bright red beak and red legs
 · a raven, all black and heavy-beaked
 · a falcon, grey-backed and dark-hooded
 · grey seals hauled out on flat rock in the water far below, small and slug-shaped with distance
 · a rabbit, sitting up in cropped grass
 · a stoat or weasel, long and low, half out of a gap between two stones
 · a small brown bird singing from the very top of a gorse bush
 · a dozen or more small butterflies working one clump of flowers
 · a dozen or more bumblebees low over the flowers, blown sideways
 · a line of white seabirds gliding past BELOW the level of the ground, seen from above their backs

VARIETY MANDATE — ~25 DISTINCT beats, and favour the ones with a story in them: a puffin standing bolt upright in the flowers at the edge of the grass looking entirely unbothered; three puffins in a row on the same slab, all facing the same way the wind is going; a gull standing into the wind on one flat rock with its feathers blown flat against it; a line of white seabirds gliding past below the level of the ground so the picture looks down onto their backs; a white seabird hanging dead still in the wind at the edge of the ground, not moving forward at all; a glossy black crow with a red beak walking through the pink flowers turning stones over; a falcon standing on a slab with the wind combing its back feathers up the wrong way; grey seals hauled out on flat rock in the water far below, small with distance; a rabbit sitting up in grass it has cropped to almost nothing, flowers surviving only out of its reach; a stoat half out of a gap between two stones; a small brown bird singing from the very top of a gorse bush while the bush is bent inland under it; twenty or more small butterflies working one clump of pink flowers with flying foam beading the petals beside them; a dozen or more bumblebees being blown sideways off the flowers and coming back; a raven on the ground with the wind lifting its throat feathers.

${SCALE_LAW}

${NO_GROUND_SHAPE_LAW}

RULES — one animal (or one stated mass of insects) per entry; always one from the cast above; the flowers stay the hero and the animal stays small; never a hummingbird, never a bird of paradise, never a garden songbird beyond the small brown one named, never a cat, dog, cow, sheep, sheepdog or horse; never a fantasy creature; never a whale or dolphin.

${NEAR_SURFACE_LAW}

${RULER_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 6. charm — one clever detail the eye finds on second look ─────────────
  bloombot_coastal_cliff_charm: {
    metaPrompt: (
      n
    ) => `You are writing ${n} CHARM DETAILS for BloomBot's "coastal-cliff-bloom" path. Each is ONE small clever detail that makes it THAT cliff top and no other — the thing a viewer finds on second look and smiles at. This axis is where the delight lives.

Each entry: 12-24 words. One detail only, small, physically true, and visible in the picture. It must be a thing, not a feeling.

VARIETY MANDATE — ~25 DISTINCT charms, all of them the surprising version rather than the obvious one: one plant with the half facing the water dried dead brown and the sheltered half still bright green, the line between them dead straight; a whole slope of flower heads all leaning exactly the same way as though a comb had been pulled through it; one clump of flowers in full bloom out of a crack right at the edge with nothing at all underneath it; the tops of every plant cut level at exactly one height so the slope reads as a flat green table with the rock poking through it; bright orange crusty lichen on the rock so loud it out-colours the flowers next to it; a single bead of salt water sitting in the centre of a flower like a lens; a hollow in the rock holding a small pool of standing seawater with petals floating on it; a ring of taller greener flowers in the exact wind-shadow of one boulder and nothing on its other side; last year's dry stems bleached bone-white by salt standing among this year's hot pink; a flower growing out of a crack in a slab that has already parted from the rest of the ground; one flower head turned inland while every other head on the slope faces the same different way; grass growing in the split of a rock in one line so straight it has no bend in it anywhere; a scatter of tiny white barnacle shells and shell grit carried up by the wind and lying in the flowers; a plant rooted in a crack packed with old white shell fragments instead of soil; a patch of flowers growing in a dip that is greener than everything round it because the fog drains into it; the wind holding a single stem bent right over so its flower touches the rock; a bumblebee-sized tuft of white down caught on a spine; one white daisy still with a pinch of hail sitting on it; a straight brown band of dead dried leaf across every plant at exactly one height, the green starting again sharply above it.

━━━ NO LIVING CREATURES IN THIS AXIS (axis-clean) ━━━
A separate axis owns the animal, so a charm here is never a creature. Never name a beetle, spider, bee, butterfly, moth, ant, bird, seal, rabbit or any animal — a creature in this axis doubles the animal in one render. Empty shells, shell grit and a tuft of down are fine because they are objects, not animals. Never a bone, a skull or anything dead. A charm is rock, lichen, soil, water, foam, salt, light or a plant behaving surprisingly.

${NO_GROUND_SHAPE_LAW}

${NEAR_SURFACE_LAW}

${RULER_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
};

(async () => {
  const total = parseInt(process.env.SEED_TOTAL || '25', 10);
  const only = process.env.SEED_POOL || null;
  for (const [key, cfg] of Object.entries(POOLS)) {
    if (only && key !== only) continue;
    await generatePool({
      outPath: `scripts/bots/bloombot/seeds/${key}.json`,
      total,
      batch: 25,
      metaPrompt: cfg.metaPrompt,
    });
  }
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
