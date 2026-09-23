#!/usr/bin/env node
/**
 * BloomBot orchid-cloud-forest path pools (2026-09-23).
 *
 * THE GAP, audited before a line was written: BloomBot has 24 live paths and
 * every one is flowers. THREE of them already own tropical ground:
 *   `tropical-paradise` — dense jungle floral scene, ground beds + canopy
 *      shafts, "the sky clean and clear"; 56 of its 200 setting entries already
 *      carry moss / mist / bromeliad / epiphyte words, and ONE entry is
 *      literally "cloud-forest WATERFALL WITH HANGING ORCHIDS".
 *   `tropical-grove`   — giant Dr-Seuss tropical mega-blooms, volcanic /
 *      lagoon / beach, whimsy-gated.
 *   `conservatory`     — glass-and-iron interior, fully overgrown.
 * So "tropical flowers under palms with mist about" is ALREADY THIS BOT, three
 * times over, and this path would not have earned a slot on that.
 *
 * ITS DIFFERENTIATOR IS VERTICALITY AND THINGS GROWING ON WOOD:
 *   every flower in the picture is rooted in MOSS ON BARK — on a limb, on a
 *   trunk, on the flank of a fallen trunk — and not one of them is planted in
 *   the ground · moss-furred bark, water beaded on every surface, everything
 *   dripping · THE CLOUD STANDS IN THE AIR BETWEEN THE TRUNKS AT THE CAMERA'S
 *   OWN HEIGHT, thick enough to swallow the third tree back — mist you are
 *   inside, never a fog lying on a floor · the background is a wall of wet
 *   green going up out of the top of the frame, never open sky, the canopy
 *   never visible · tree ferns, filmy ferns, hanging moss curtains.
 * If a render could be mistaken for tropical-paradise, it failed.
 *
 * SIX AXES (5 always-on + 1 gated at 0.55):
 *   perch        HERO — the wet woody near surface the orchids ride on
 *   orchid_cast  ★ which species, in their REAL prior colours, and how they grip
 *   cloud_state  ★ the money-shot: what the mist is DOING in the frame
 *   forest_light ★ owns the palette; two named colours, source renderable HERE
 *   cloud_life   (0.55 gate) ONE whole animal, ruler welded to the branch
 *   charm        one clever detail the eye finds on second look
 *
 * ── THE SIX TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented) ──
 *
 * 1. THE JARGON TRAP (lesson 28, the BrickBot "envelope"). ORCHID BOTANY IS THE
 *    WORST MINEFIELD IN THE FLEET and almost every term is a confident wrong
 *    picture: `lip` and `throat` render a MOUTH on the flower, `eye` renders an
 *    EYEBALL, `column` an architectural column, `spur` a cowboy spur, `spike` a
 *    metal spike, `slipper` a shoe, `sheath` a knife sheath, `crown` a king's
 *    crown, `tank` (bromeliad) a military tank, `rosette` a prize ribbon,
 *    `beard` (lichen) a human beard, `fan` an electric fan, and `keiki`,
 *    `pseudobulb`, `bract`, `raceme`, `panicle`, `velamen` have no layperson
 *    prior at all. Common NAMES are worse: "moth orchid" renders a moth,
 *    "dancing lady" a lady, "spider orchid" a spider, "tulip orchid" a tulip,
 *    "Dracula orchid" a vampire, "eyelash viper" an eyelash, "GLASS frog"
 *    actual glass, "staghorn fern" antlers, "fiddlehead" a violin. All banned
 *    even though every one is correct. `epiphyte` is banned for the opposite
 *    reason — no layperson prior, so it buys nothing; the entries say "rooted
 *    in moss on the bark" instead, which is the picture we actually want.
 *
 * 2. THE JUNGLE FLOOR — the collision itself. Per lessons 26/27 an absence gets
 *    backfilled, so the rule is never "no soil": the bottom of the frame is
 *    POSITIVELY filled with more wet bark, hanging moss and standing mist, so
 *    there is nowhere a flower bed could be.
 *
 * 3. OPEN SKY. Flux's tropical prior ships blue sky and palms, and BloomBot's
 *    own bot-wide suffix literally asks for "the sky clean and clear" (dropped
 *    for this path via promptSuffixByPath). Positive fill again: the background
 *    IS mist plus a wall of wet green running up out of the top of the frame.
 *
 * 4. THE CORRIDOR (lessons 17 / 24 / 29). A limb, a fallen trunk and a slope
 *    are all linear features. Every one runs ACROSS the picture with its ends
 *    out of frame; `converging`, `vanishing point`, `apex`, `tunnel`, `avenue`
 *    and `single point` are banned from EVERY pool, the hero one included
 *    (lesson 29: a vanishing point can be authored into a hero entry where the
 *    ground rule cannot reach it).
 *
 * 5. THE PERCH CLASS LAW (lesson 35, measured on FaeBot star-charting). A
 *    self-contained DETACHABLE object renders as that whole object seen from
 *    OUTSIDE, shrinking everything on it; a FEATURE OF SOMETHING TOO BIG TO FIT
 *    IN FRAME renders as a near surface. And the parent must be WOODY — a
 *    rock-parented perch renders the whole landscape. So "a fallen log" is
 *    banned as such and written as "the flank of a fallen trunk too thick to
 *    see over, its length out of frame both sides".
 *
 * 6. TASTEFUL GREY-GREEN. A cloud forest's own prior is a muted misty
 *    monochrome, which the motto calls a MISS. The VIVID LAW is in every recipe:
 *    the picture is wet near-black green and grey and ONE saturated colour is
 *    LOUD in it. Species are drawn from a roster whose Flux prior colour is
 *    already the colour we want (BloomBot's flower x colour render-prior
 *    lesson: a colour word cannot recolour a named species).
 *
 * Run: node scripts/gen-seeds/bloombot/gen-orchid-cloud-forest-pools.js
 *      SEED_TOTAL=25 is the default MVP. Scale only after sign-off.
 *      SEED_POOL=<key> regenerates one pool.
 */
const { generatePool } = require('../../lib/seedGenHelper');

// ─── Shared law blocks, appended to every recipe ────────────────────────────

const LAYPERSON_LAW = `━━━ THE LAYPERSON-WORD LAW (this is the #1 rule — a correct botanical term is usually a confidently WRONG picture) ━━━
For every word, ask what an ordinary person pictures when they read it. If that is a different object, the word is BANNED even though it is botanically correct.
NEVER write any of these: lip, throat, mouth, tongue, eye, column, spur, spike, slipper, sheath, crown, tank, rosette, beard, whiskers, fan, keiki, pseudobulb, bract, raceme, panicle, umbel, inflorescence, whorl, calyx, velamen, node, epiphyte, air plant, crozier, fiddlehead, elfin.
NEVER write any of these common names: moth orchid, dancing lady orchid, spider orchid, tulip orchid, slipper orchid, lady's slipper, Dracula orchid, monkey-face orchid, bucket orchid, staghorn fern, old man's beard, eyelash viper, glass frog, snowball.
INSTEAD describe shape and attachment with VERBS and plain words: "its pale roots spread flat over the bare bark and clamped down on it", "wedged into a pad of soaking moss on the limb", "hanging straight down off the underside of the branch", "a spray of dozens of small flowers arching out over the drop", "packed close along the top of the branch", "one wide flat flower turned outward toward the camera", "a stiff ring of strappy leaves holding standing water in the middle".`;

const NO_TEXT_LAW = `━━━ NOTHING SHAPED LIKE A SIGN, AND NOTHING SHAPED LIKE A PLANT LABEL ━━━
A cloud forest is a botanical-garden and eco-trail prior, so Flux wants to add tags on the plants and boards along the way, and those render as gibberish text. Never name any of: label, tag, name tag, marker, stake, sign, signpost, signboard, board, plaque, placard, panel, plate, flag, banner, map, chart, inscription, carving, lettering, writing, marks, markings, glyph, number, pot, planter, basket, wire, twine tag, cross.
Instead: the only flat surfaces anywhere in the picture are LEAVES and flower faces. Every plant sits directly on living bark, on soaking moss or on a living branch, and holds itself there with its own roots.`;

const NO_PEOPLE_LAW = `━━━ NO PEOPLE AND NOTHING BUILT — FILL THE FRAME INSTEAD ━━━
Never a person, hiker, walker, guide, figure, silhouette, hand, backpack, boot, camera or tent. Never a boardwalk, walkway, canopy bridge, suspension bridge, rope bridge, handrail, railing, ladder, cut steps, platform, hide, lodge, cabin, shelter, bench, zipline, cable, path, trail or footpath. Do NOT say they are absent either — instead fill the space positively: every surface in this picture is living plant, wet bark, soaking moss, running water, standing mist or animal, right out to all four edges, so there is nowhere a walkway could be.`;

const NO_SOIL_LAW = `━━━ EVERYTHING GROWS ON WOOD — AND THE BOTTOM OF THE FRAME IS ALREADY FULL ━━━
This is the whole identity of the path: every flower in the picture is rooted in a pad of soaking moss ON BARK — on a limb, on a trunk, on the flank of a fallen trunk — and holds on with its own pale roots. Nothing is planted in the ground and no flower bed, border, lawn, meadow, carpet or field of flowers appears anywhere. Do not mention soil, earth, ground or dirt at all, not even to exclude them: instead the bottom of the frame is positively FULL of more wet bark, hanging moss, dripping fern and standing mist, so there is nowhere a flower bed could be. The forest floor is simply not in this picture.`;

const NO_CORRIDOR_LAW = `━━━ ACROSS THE PICTURE, NEVER INTO IT ━━━
Never write converging, convergence, vanishing point, leading to a single point, a single shared point, apex, meeting point, receding rows, tunnel, avenue, corridor, archway, or a line of anything running away into the distance. Every long thing — a limb, a fallen trunk, a moss curtain, a slope, a stream — runs ACROSS the picture from one side edge to the other, and both of its ends run out of frame.`;

const PERCH_CLASS_LAW = `━━━ THE NEAR SURFACE IS ALWAYS PART OF SOMETHING TOO BIG TO FIT IN THE FRAME, AND IT IS ALWAYS WOOD ━━━
A whole detachable object — a log lying in a clearing, a single small tree, a stump, a branch cut off at both ends, a boulder — renders as that whole object photographed from a distance, which shrinks the flowers to specks and turns the picture into a vista. So every entry names a FEATURE of something far too big to fit in frame, cropped by the frame edges: the flank of a trunk, the top of a limb, the fork where two limbs part, a swollen knot on a limb, the underside of a leaning trunk, the flared base of a trunk, the flank of a fallen trunk too thick to see over. Say explicitly that it runs out of frame. And the parent is ALWAYS A TREE — never a rock, never a cliff, never a wall, because naming stone licenses the whole mountain and the picture becomes a landscape.`;

const SCALE_LAW = `━━━ THE SCALE LAW ━━━
A low count is what makes a creature render giant — Flux gives each named subject a share of the frame — so small flying things are always stated as "a dozen or more" or "twenty or more", never one, two or three. Any size comparison must be welded to something BIG and FIXED that is already in the picture and whose own size is set by the tree it belongs to: the thickness of the limb it sits on, the width of the trunk behind it, the length of the moss pad, one orchid flower already named on that same branch. Never an off-camera ruler (a thumb, a fingernail, a coin) and never a free-floating object whose own size could inflate with it.
GRANT NO SUBJECT A DETAIL EXEMPTION. Never add a close anatomical clause for the nearest one — no "the nearest showing its iridescent throat, its barred wings, its amber eyes". The one you describe most is the one that comes out biggest, and a pigeon-sized hummingbird ruins the frame.`;

const ORCHID_ROSTER = `━━━ THE COLOUR-FIRST LAW — MEASURED OVER 12 RENDERS, A GENUS NAME DOES NOT CARRY A COLOUR ━━━
This is the single most important rule in this pool, and it is measured, not theoretical. Rounds 1 and 2 named the species first and trusted it to bring its colour: "Stanhopea orchid, heavy waxy cream flowers" rendered PINK, "Coelogyne orchid, hanging chains of white flowers" rendered coral, "cymbidium orchid, waxy green flowers with red middles" rendered PINK, "Maxillaria, small egg-yellow flowers" rendered PINK. Species-colour fidelity was 1.5 of 6. Flux has no reliable picture for a specialist orchid genus, so the name collapses to its generic "orchid" centroid, which is a pink cattleya — and it does that EVEN WHEN the colour word sits right beside it.
So EVERY entry must OPEN WITH THE PLAIN COLOUR AND THE PLAIN SHAPE, in ordinary words, and mention the genus only afterwards as a trailing qualifier, or not at all. Write "a dozen small bright egg-yellow orchid flowers packed close along the bark, each one a flat five-pointed star (maxillaria)". NEVER write "Maxillaria orchid, small bright egg-yellow flowers".

━━━ THE SHAPES AND COLOURS TO DRAW FROM — colour and shape lead, the name trails ━━━
Pick TWO or THREE per entry and write each one colour-first:
· deep blue-violet flat wide flowers with a fine chequered pattern, the size of an open palm (vanda) — Flux holds this one reliably, so use it whenever a cool loud colour is wanted
· pure white wide flat flowers with a small gold middle, nodding in a row along one arching stem (phalaenopsis)
· small white flowers tipped purple, in arching sprays (dendrobium)
· dozens of tiny bright egg-yellow flowers on one long arching spray, each a flat little star (oncidium)
· small bright egg-yellow flowers packed close along the bark (maxillaria)
· big waxy lemon-yellow triangular flowers, one to a stem (lycaste)
· hot scarlet-orange triangular flowers, small and sharp-pointed, in dozens (masdevallia)
· tight round clusters of small orange-red flowers on thin wiry stems (epidendrum)
· heavy waxy ivory-cream flowers freckled deep maroon, hanging straight DOWN out of the bottom of the plant (stanhopea)
· hanging chains of pure white flowers, each with a gold-brown middle (coelogyne)
· big ruffled deep magenta-purple flowers (cattleya) — use this SPARINGLY, at most one entry in five, because it is Flux's default orchid and it will take over the frame
· big soft rose-purple flowers open for one morning only (sobralia) — also sparing, same reason
· cream-white flowers heavily blotched chestnut-red (odontoglossum)
· long arching sprays of waxy apple-green flowers with red middles (cymbidium)

COLOUR BALANCE ACROSS THE POOL — this path's round-2 batch came back pink in 5 of 6 frames, which makes a monotone feed. So across the 25 entries: about 7 lead with YELLOW or ORANGE, about 6 with WHITE or CREAM, about 5 with BLUE-VIOLET, about 4 with SCARLET or ORANGE-RED, and NO MORE THAN 3 with magenta, pink or rose-purple.

━━━ THE SUPPORTING PLANTS, no flowers of their own needed ━━━
bromeliads (stiff strappy leaves banded red and green in a tight ring holding standing water in the middle, some with a hot-pink or scarlet centre) · tillandsia tufts (wiry grey-green) · anthurium (glossy scarlet heart-shaped leaves) · begonias with silver-spotted leaves · filmy ferns in thin translucent sheets · tree ferns · hanging moss curtains · pale grey-green lichen · liverworts flat on the bark.`;

const VIVID_LAW = `━━━ THE VIVID LAW — A cloud forest'S OWN PRIOR IS A TASTEFUL GREY MONOCHROME, AND THAT IS A FAILURE ━━━
Colour here is LITERAL and committed, never muted, washed-out, tasteful-grey or sepia. The picture is wet near-black green, soaked brown bark and pale standing mist — and against all of that ONE saturated colour is LOUD: magenta, scarlet, blue-violet, egg-yellow, orange. Name that colour plainly. A render where everything is the same soft green-grey is a miss even when it is clean.`;

const WHIMSY_BAR = `━━━ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER ━━━
A clean, correct, SOBER entry is a MISS, not a pass. Every entry must either show something nobody has been shown before or take something familiar and redress it as something more interesting. Ask of each one: is this the obvious version of this idea, or the surprising one? Ship the surprising one. No entry may read as a tasteful postcard of a misty jungle.`;

const POOLS = {
  // ── 1. perch — the HERO axis. The wet woody near surface. ─────────────────
  bloombot_orchid_cloud_forest_perch: {
    metaPrompt: (
      n
    ) => `You are writing ${n} NEAR-SURFACE descriptions for BloomBot's "orchid-cloud-forest" path — a soaking-wet tropical mountain forest standing inside the mist, where every flower grows on the trees rather than in the ground. This axis is the STAGE and the HERO of the picture: the big wet WOODY surface that fills the near frame and that everything else in the render is growing on.

THE ONE THING EVERY ENTRY MUST DO: name a piece of WET MOSSY TREE, close to the camera, big enough to fill the near half of the frame, and running out of frame. Then say what its bark is like under the moss, and where on it there is room for plants to sit. Every entry is soaking wet — moss sodden and near-black at its base, bark dark with water, water standing in every dip.

Each entry: 22-38 words. Do NOT name flower species or colours (a separate axis supplies those). Do NOT describe the light or the mist (separate axes own those).

${PERCH_CLASS_LAW}

VARIETY MANDATE — ~25 DISTINCT near surfaces, every one a feature of a tree too big to fit in frame: the top of a near-horizontal limb thick enough to be a tree in its own right, moss-furred along its whole length, running out of frame at both side edges; the fork where two great limbs part, filled with a deep wet wad of moss and rotted leaf; the flank of a standing trunk filling the whole left of the frame, its bark broken into overlapping slabs and every slab holding moss; a swollen knot on a limb grown into a shaggy green ball twice the limb's own thickness; the underside of a limb leaning out over a drop, everything on it hanging downward; the flank of a fallen trunk too thick to see over, lying across the whole frame with both ends gone out of it; the flared base of a huge trunk where the wood splays out into tall thin standing folds; a trunk with a long strip of bark peeled away and the bare wood beneath it soaked black and slippery; a limb so heavily loaded it has bent down and the whole load has tipped sideways; a limb with a broad shelf of grey funnel-shaped fungus and a moss pad above it; the stub where a limb broke off years ago, now a wet green hollow; a stretch of trunk quilted flat with liverwort in one smooth green sheet; a leaning trunk crossed by the long thin hanging roots of another tree coming down past it; a limb whose top is a single unbroken sheet of soaking moss deeper than the bark it covers; the shaded underside of a tree fern right over the camera, all its wet fronds arching out of frame. Vary which way the wood runs, how thick the moss is, and whether the surface is a top, a flank or an underside.

${NO_CORRIDOR_LAW}

${NO_SOIL_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 2. orchid_cast — ★ the species, real colours, how they hold on ────────
  bloombot_orchid_cloud_forest_orchid_cast: {
    metaPrompt: (
      n
    ) => `You are writing ${n} FLOWER-CAST descriptions for BloomBot's "orchid-cloud-forest" path — which orchids and which supporting plants are in flower on the wet branches, in their real colours, and exactly HOW they are holding on to the wood.

Each entry: 20-34 words, and it must OPEN WITH A COLOUR WORD. Pick TWO or THREE plants from the list below and write each one COLOUR FIRST, THEN SHAPE, THEN the genus name trailing or omitted. Then say HOW IT GRIPS THE WOOD — pale roots spread flat over the bare bark and clamped down on it, wedged into a pad of soaking moss, clamped over the top of the limb, hanging straight down off the underside. Then say where it sits relative to the near wood: crowded along the top of the limb, spilling out of the fork, ranked up the flank of the trunk, arching out over open air. At least one plant in every entry is an orchid in flower.

${ORCHID_ROSTER}

VARIETY MANDATE — ~25 DISTINCT casts, every one written COLOUR FIRST, and spread across the colour balance above: one hot colour alone against the wet dark wood (scarlet-orange sharp little triangular flowers in dozens at the near end of the limb and nothing else in flower); dozens of tiny bright egg-yellow stars on one long spray arching out over open air off a bare-bark grip; heavy waxy ivory-cream flowers freckled maroon hanging straight DOWN out of the underside of a moss pad; a row of pure white wide flat flowers with gold middles all turned the same way toward the camera; deep blue-violet chequered flowers the size of an open palm beside a red-and-green banded bromeliad; bright egg-yellow flowers packed so close along a whole limb that the limb reads as one solid band of yellow; a hanging chain of pure white gold-centred flowers dropping down a trunk; big waxy lemon-yellow triangular flowers wedged into a bark crack with liverwort quilted flat all round them; tight round clusters of small orange-red flowers on thin wiry stems leaning across a bromeliad's standing water; cream-white flowers heavily blotched chestnut-red among silver-spotted begonia leaves; waxy apple-green flowers with red middles over glossy scarlet heart-shaped leaves; small white purple-tipped flowers in arching sprays above a tree fern; blue-violet flowers ranked all the way up a trunk flank with a grey-green wiry tuft between each one; a limb carrying four different orchids at once and only the yellow one in flower; one big ruffled magenta-purple flower and nothing else, the single pink entry in its part of the pool. Never the same pairing twice.

${VIVID_LAW}

RULES — no plant outside the roster; every species keeps its roster colour; no light, no mist, no animals (separate axes own those); never a rose, tulip, hydrangea, peony, wisteria, sunflower or any garden border flower; never a palm tree; never a flower planted in the ground.

${NO_SOIL_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 3. cloud_state — ★ the money-shot axis. Mist as a VOLUME in frame. ───
  bloombot_orchid_cloud_forest_cloud_state: {
    metaPrompt: (
      n
    ) => `You are writing ${n} CLOUD descriptions for BloomBot's "orchid-cloud-forest" path. This is the signature axis of the path: the mist is IN the picture as a thick visible volume of air, standing at the camera's own height between the tree trunks — mist you are standing INSIDE, not a fog lying along a floor and not a sky seen overhead.

THE ONE THING EVERY ENTRY MUST DO: put the mist BETWEEN THINGS in the frame at eye level, and say what it does to whatever is behind it — the second trunk back goes soft, the third one is a grey ghost, the fourth is gone entirely. The mist is what the background of this picture is MADE OF. It is also what closes the frame: above the mist there is only more wet green going up out of the top of the picture, and no open sky is ever visible anywhere.

Each entry: 18-30 words. Do NOT name flower species (a separate axis supplies those). Do NOT own the palette — the light axis does that — but you may say how thick, how bright or how moving the mist is.

VARIETY MANDATE — ~25 DISTINCT mist states: mist so thick that the limb in the foreground is razor sharp and the next trunk back is already a soft grey shape; mist pouring sideways through the gap between two trunks fast enough to see it move; a clean-edged shaft of sun cutting down through the mist and lighting a column of the wet air itself; the mist thinning for a moment so a whole wall of green appears behind the near limb and then goes again; mist packed so tight it reads almost white and the wet flowers in front of it look cut out of it; mist lit from behind so every hanging strand of moss in front of it is a black line on white; a hole torn in the mist with more forest visible through it and the hole already closing; the mist snagged and shredding on the top of a tree fern; mist standing dead still with not one strand of moss moving in it; rain starting so hard the whole mist lights up pale and every leaf is pinging; the underside of the mist pressing down between the trunks so the air below it is clear and dark and the air above is white; mist rising up off the slope from below and streaming up past the limb; a bank of mist with one green trunk-top standing out of the top of it; the mist so full of water that it is visibly beading out onto the moss; mist that has gone gold in one strip and stayed slate everywhere else. Vary how thick it is, which way it is moving, and where in the frame it sits.

RULES — the mist is always at the camera's own height and always between things in frame; it is never a bank of mist seen from above, never a valley of mist seen from a lookout, never a flat layer beneath the viewer, and never a sky. No open sky, no blue sky, no sun disc, no horizon, no distant peak, no valley floor and no view out. Never write the words fog bank, lookout, overlook, viewpoint, panorama or vista.

${MIST_WORD_LAW}

${NO_CORRIDOR_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 4. forest_light — ★ owns the whole palette. Source renderable HERE. ───
  bloombot_orchid_cloud_forest_light: {
    metaPrompt: (
      n
    ) => `You are writing ${n} LIGHT descriptions for BloomBot's "orchid-cloud-forest" path. This axis owns the entire palette of the render.

THE HARD CONSTRAINT: this is a dim, enclosed, soaking place inside a mist, under a canopy that is never visible. A light source that CANNOT EXIST HERE renders as flat pale daylight and takes the whole picture grey. So every entry names a source that is physically possible in this exact place — the mist itself glowing as one big soft source, a break in the mist, a gap between two trunks, sun through one thin translucent leaf, light bouncing up off wet bark, a shaft coming down through a hole in the canopy — AND names the SURFACE it lands on: the wet bark, the standing water in a bromeliad's middle, one orchid's face, a moss curtain, the beaded water on a leaf. Light is a patch, a rim, a streak or a pool on a real wet thing, never a general glow.

Each entry: 16-28 words. Name TWO colours explicitly, and in at least half the entries set one WARM colour against one COOL one — a single warm accent against all that cold wet green is the whole trick.

VARIETY MANDATE — ~25 DISTINCT light conditions: one hard-edged shaft of warm sun down through a gap, blazing on a single magenta flower while everything around it stays blue-black; the mist glowing evenly so the light comes from every direction at once and the only shadows are under the leaves; low late sun coming in sideways under the mist, turning the wet bark bronze against grey-green moss; rain-light, the whole frame going flat silver with every beaded drop a white point; sun through one thin translucent fern leaf so the leaf reads as lit right through and the bark behind it stays near-black; light bouncing up off a wet limb and filling the shadows underneath the flowers with a soft green; a slot of brilliant white mist between two black trunks with everything in front of it in silhouette; the last gold light climbing the trunk and leaving the flowers below it in blue shade; a sudden brightening as the mist thins, the wet leaves flaring to hot green for a second; a warm shaft picking out the standing water in a bromeliad's middle so that one small patch of standing water is the brightest thing in all that dark; blue-grey dusk with one strip of white mist still lit behind the trunks; storm-dark with the flowers still holding their own colour hard; a dawn so cold the mist is violet and the first sun on the bark is orange; heavy overcast with the wet surfaces mirror-bright and near-black. Vary the time, the hardness and the direction.

RULES — this axis is LIGHT and COLOUR only. Never describe bark shapes, flower species, animals or the mist's motion (separate axes own those). Never name an open sky, a clear blue sky, a sun disc, a horizon, a distant peak or a sunset sky — none of those can be seen from inside this forest. Never muted, washed-out, hazy-grey or tasteful.

${VIVID_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 5. cloud_life — 0.55 gate. ONE whole animal, ruler welded, no exemption ─
  bloombot_orchid_cloud_forest_cloud_life: {
    metaPrompt: (
      n
    ) => `You are writing ${n} ANIMAL descriptions for BloomBot's "orchid-cloud-forest" path — a 55%-gated axis putting ONE creature of the tropical mountain forest into the frame. These are animals that actually live in a cloud forest, never garden or farm animals.

Each entry: 14-26 words. ONE whole recognisable animal, head and body both visible, SMALL in the frame and never centred. Its size must be pinned by something big and fixed that is already in the picture — the thickness of the limb, the width of the trunk, the length of the moss pad, one orchid flower on the same branch.

THE ALLOWED CAST: a hummingbird, hovering or perched · a quetzal, deep green with a crimson breast and two very long green tail feathers hanging down · a toucanet, green with a pale beak · a small tanager in blue and green · a small translucent green tree frog you can almost see through · a tiny frog in bright red and black · a bright yellow snake coiled in a neat flat spiral on the moss · a small green lizard flat on the bark · butterflies (always a dozen or more) · a huge blue morpho butterfly, wings wide open · a beetle with a hard green metallic shell · a small mossy-looking gecko.

VARIETY MANDATE — ~25 DISTINCT beats, and favour the ones with a story in them: a hummingbird hanging dead still at one white orchid flower with the whole background dissolved to mist behind it; a small translucent green tree frog sitting in the standing water in a bromeliad's middle, up to its chin in it; a quetzal half-hidden behind a moss curtain with only its two long green tail feathers showing, hanging down past the orchids; a bright yellow snake coiled in a flat spiral on a moss pad, no longer than the limb is thick; a tiny bright red-and-black frog on the flat of a wet leaf with the water still beaded round it; a blue morpho butterfly with its wings wide open, one of the only two bright things in the frame; twenty or more small butterflies working one orchid spray in the wet air; a green lizard pressed flat along the top of a limb, exactly the colour of the moss it is on; a toucanet leaning right out to take a berry, gripping with one foot; a hummingbird perched for once, on a stem thinner than the flower beside it; a small blue-and-green tanager shaking the water off itself so a burst of drops hangs in the air; a green metallic beetle walking across a single wet leaf; a gecko so mossy-looking that you only find it on the second look; a small brown wren working along the underside of a limb, upside down. Never a person watching, never a nest of babies, never a kill.

${SCALE_LAW}

RULES — one animal (or one stated mass of butterflies) per entry; always a real recognisable species from the cast; the flowers and the wet wood stay the hero and the animal stays small; never a parrot on a shoulder, never a monkey, never a sloth, never a jaguar, never a big cat, never a snake striking, never a cat, dog, cow, chicken or horse; never a fantasy creature; never an insect swarm big enough to fill the frame.

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 6. charm — one clever detail the eye finds on second look ─────────────
  bloombot_orchid_cloud_forest_charm: {
    metaPrompt: (
      n
    ) => `You are writing ${n} CHARM DETAILS for BloomBot's "orchid-cloud-forest" path. Each is ONE small clever detail that makes it THAT branch in THAT forest and no other — the thing a viewer finds on second look and smiles at. This axis is where the delight lives, and it is also where the WATER lives: this place is soaking, and half the entries should be about what the water is doing.

Each entry: 12-24 words. One detail only, small, physically true, and visible in the picture. It must be a thing, not a feeling.

VARIETY MANDATE — ~25 DISTINCT charms, all of them the surprising version rather than the obvious one: a single drop hanging off the tip of one leaf, so heavy and so still that the whole mist behind it is curved and reversed inside it; a moss curtain with water running steadily down its whole face, lit from behind so the sheet of water reads as white; one orchid flowering out of a crack in the bark too narrow to see into, with nothing else growing anywhere near it; the same orchid at three sizes at once — one huge and wet in the near frame, a spray of them mid-way back, and specks of the same colour far off in the mist; standing water in a bromeliad's middle so still it holds a perfect reversed picture of the branches above; a line of drops along the whole underside of a limb, each one hanging at exactly the same length; a flower still bent in the shape of the leaf that was lying on it until this morning; pale flat roots reaching right out across bare bark and clamped down on it, bare wood showing between them; a strip of bark that has peeled and curled and caught a whole pool of water in the curl; a spent flower lying face-up on the moss below the plant that dropped it, still perfectly coloured; one dead limb with more growing on it than any living one in the frame; a small stream of water running along the top of a limb in its own shallow channel, and orchids drinking from it the whole way along; a fern leaf so thin that the shape of the leaf behind it shows straight through it; a hanging moss strand grown so long it has reached the limb below and started growing there too; one orchid whose flowers have all turned to face the one gap in the mist; a ring of paler moss on the bark where something used to sit.

━━━ NO LIVING CREATURES IN THIS AXIS (axis-clean) ━━━
A separate axis owns the animal, so a charm here is never a creature. Never name a frog, bird, hummingbird, snake, lizard, beetle, spider, bee, butterfly, moth, ant, worm or any animal — a creature here doubles the animal in a single render. Never a bone, a skull, a nest, an egg or anything dead of the animal kind. A charm is wood, moss, water, light or a plant behaving surprisingly.

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
