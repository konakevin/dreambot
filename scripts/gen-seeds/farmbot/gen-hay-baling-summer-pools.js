#!/usr/bin/env node
/**
 * FarmBot — hay-baling-summer bespoke pools (5 Sonnet-seeded axes).
 *
 * The path's 6th axis (`hay_animal`, the gated farm-animal cameo) is
 * HAND-AUTHORED JSON — see the path file's header. Do not add it here.
 *
 * ━━━ THE PATH'S IDENTITY AND THE DULL FAILURE IT EXISTS TO AVOID ━━━
 * A hayfield is the most photographed rural cliche there is, so the dull
 * failure is precise and it is the single most likely way this path dies:
 * A TIDY GOLDEN FIELD WITH SOME BALES IN IT, seen from far enough away to be
 * a postcard. Clean, on-brief, defect-free and utterly forgettable. Every
 * pool below is written so that render is structurally impossible. What the
 * premise actually gives us, and what every recipe is aimed at:
 *   • A ROUND BALE IS AN ENORMOUS CYLINDER and a person beside one reads as
 *     tiny. Scale is this path's whole gift.
 *   • THE CUT/UNCUT LINE is a hard graphic edge laid straight across the
 *     frame — half the picture a pale bristled floor, half a standing green
 *     wall — which no other FarmBot path has.
 *   • BACKLIT HAY DUST in low sun is genuinely, straightforwardly beautiful.
 *   • A WAGON STACKED FAR TOO HIGH is inherently funny.
 *   • And the comedy of the objects themselves: a bale that has got away and
 *     is sitting in the hedge; a dog asleep in the one bale-shadow; a cat
 *     riding the top of the load; a bale being used as a sofa at the water
 *     break; a straw hat left on a bale end.
 *
 * ━━━ SCOPE FENCE (both directions) ━━━
 * The four nearest LIVE analogs are `harvest-festival` (hay bales as festival
 * FURNITURE — seating, a bale maze, decor), `picnic-in-the-meadow` (a leisure
 * blanket in tall grass), `flower-field-wandering` (a wandering stroll through
 * a wildflower field) and `evening-chores` / `orchard-afternoon`. So this path
 * is fenced against all of them: NO festival, NO bunting, NO fete, NO stalls,
 * NO games, NO picnic blanket, NO basket, NO wandering or strolling, NO
 * wildflower field as the subject, NO evening chores register. The word
 * MEADOW is banned outright — that noun belongs to `picnic-in-the-meadow`.
 * This is HOT, DUSTY, INDUSTRIOUS WORK in a field that has been cut.
 *
 * ━━━ THE LAWS BAKED IN AT THE SOURCE ━━━
 * Each is a documented, render-costing bug (BOT_SCENE_QUALITY_PLAYBOOK.md
 * cross-bot lessons 12/13/14/17/22/24/25/26/28/29/30/31/44/47/48/51/52/58/65/
 * 66/67). They live in the meta-prompt TEXT, not just the generated JSON, so a
 * future append run cannot reintroduce them.
 *
 *  1. 🌾 THE SUBTRACTIVE-SURFACE TRAP, AND IT IS THIS PATH'S VERSION OF THE
 *     SHORN SHEEP (lesson 58, measured on THIS BOT over three rounds).
 *     "Stubble" is a SUBTRACTIVE description of a field — grass with its
 *     height removed — which is exactly the shape that cost `sheep-shearing-
 *     day` two rounds: the additive half of one clause ("woolly cuffs still at
 *     the ankles") rendered 6 of 6 every round while the subtractive half ("no
 *     fluff on the body anywhere") rendered 1 of 6, same sentence, same
 *     position, same prompts. The model ADDS and does not SUBTRACT. So the cut
 *     ground is NEVER described as an absence and never chased with better
 *     adjectives for shortness. It is named as a POSITIVE OBJECT — a pale
 *     bristled floor of cut stalks with bare dry soil showing between them —
 *     and the cut is PROVEN BY THINGS THAT HAVE BEEN ADDED TO IT: wheel ruts
 *     pressed into it, long combed ridges of raked grass lying across it,
 *     broken stalks and loose seed heads littered over it, the bales
 *     themselves, and the tall uncut grass standing up as a WALL at the line.
 *     Those added objects are the hat and socks of this path.
 *  2. ↔️ THE CORRIDOR TRAP, AND A HAYFIELD IS THE PUREST CASE OF IT
 *     (lessons 17/24/29). A path staged on a linear feature renders as a
 *     receding corridor with the subject tiled to the vanishing point, and
 *     purging the camera entries is NOT enough — a hayfield hands the model
 *     THREE linear features at once (the cut line, the raked ridges, the wheel
 *     ruts) plus a rank of identical bales to tile. What breaks it is the
 *     CROSSWISE + CONCRETE-BUT-CROPPED form, stated in three layers that reach
 *     Flux: the cut line crosses from the LEFT EDGE to the RIGHT EDGE with
 *     both ends out of frame, the cut ground fills the near half and runs off
 *     both side edges, the tall uncut grass is a BAND across the upper part,
 *     and the nearest bale is a huge drum CROPPED by the edge of the picture.
 *     A receding corridor cannot exist in that frame. ⚠️ Lesson 29: run the
 *     corridor sweep on the HERO pool too, not just the setting pool — a
 *     vanishing point authored into the bales axis is where this breaks.
 *  3. ⚖️ THE RULER HAS EXACTLY ONE OWNER, AND IT IS THE TEMPLATE (lessons 61 +
 *     67, which together make one complete rule). A rule written into a
 *     GENERATOR recipe reaches the POOL, not the PROMPT — DinoBot's ruler law
 *     lived in its recipes, audited 0 sweep hits across 125 entries, and
 *     Sonnet then invented its own rulers in 3 of 5 prompts at a 100%
 *     off-limits hit rate. And the other half: naming a ruler OBJECT in the
 *     hero recipe made 24 of 25 hero entries name it, so a second one appeared
 *     in frame. So on this path the ruler law lives ONLY in the path
 *     template's required output order, it is expressed as a RELATIVE POSITION
 *     AND A UNIT rather than a second physical object ("its top higher than
 *     the head of everything else in the frame", "a bale-width", "two bales
 *     high", "the crew reach only to the top of a bale"), and EVERY POOL BELOW
 *     IS BANNED FROM WRITING ANY SIZE COMPARISON AT ALL.
 *  4. ⚖️ NO SUBJECT GETS A DETAIL EXEMPTION (lesson 13's 2026-09-23
 *     correction, measured on this bot's own apiary path). "Cap the detail at
 *     the nearest one or two" IS ITSELF THE INFLATOR and it undoes a correct
 *     ruler: 20 of 30 apiary entries welded a correct ruler and then added a
 *     close anatomy clause for the nearest subject, and the anatomy beat the
 *     ruler every time; stripping it took giant bees 3 of 5 to 0 of 6 and the
 *     path 3.86 to 4.37. So no bale, animal or person gets a close-up detail
 *     clause. THE ONE YOU DESCRIBE MOST IS THE ONE THAT COMES OUT BIGGEST.
 *  5. 📝 THE TEXT LAW, three different lessons that have to compose.
 *     (a) DELETE, don't describe (lesson 12): a text-SHAPED surface cannot be
 *         worded safely, only removed. On a haymaking field that list is long
 *         and specific — a machine's badge and decals, a dashboard DIAL or
 *         GAUGE (lesson 12's own named family), printed or stencilled feed
 *         sacks, white plastic bale wrap, net wrap, a tarpaulin, a gate sign,
 *         a notice board. All deleted from every layer, along with the whole
 *         synonym family. This is also why NO MOTORISED MACHINERY appears
 *         anywhere in these pools (see law 6).
 *     (b) FILL WHAT THE DELETION EMPTIED, and make the filling carry the
 *         interest (lessons 14/26/27): an ABSENCE gets backfilled and "plain"
 *         and "blank" are negations CLIP cannot use, so every flat panel in
 *         frame — the wagon's plank side, the field gate, a tool handle — is
 *         named as CARRYING a real object (a coiled rope over a rail, a
 *         pitchfork stood against it, a straw hat hooked on a post, a stone
 *         jar of water in the shade underneath, a jacket thrown over the
 *         gate). Done right this is a set-dressing WIN: on the path where it
 *         was measured the batch average went UP.
 *     (c) SHRINK THE AREA (lessons 51/52): filling one surface only MIGRATES
 *         the lettering to the nearest unfilled strip, so the win condition is
 *         leaving no unfilled strip — which means a CROP. A receding rank of
 *         eight wagons and gates shows eight flat panels; one cropped near
 *         bale and a band of grass shows none. The framing law is doing double
 *         duty as the text fix.
 *     ✅ Worth knowing: a round bale's END IS A CIRCLE, and plank sides,
 *     cloth and tool handles are all safe substrates (lesson 27's dividing
 *     line is whether the object's SHAPE is already a sign). This path's only
 *     genuine sign-shaped surfaces are the ones deleted in (a).
 *  6. 🚜 NO MOTORISED MACHINERY, AND IT IS NOT A COMPROMISE. Three reasons
 *     that all point the same way. (i) A tractor or baler is a dense cluster
 *     of text-shaped surfaces — badge, decals, model plate, dashboard dials
 *     and gauges — i.e. lesson 12's worst family, in the one place a crop
 *     cannot remove it. (ii) The MODERN-PRIOR NOUN trap (measured on FaeBot):
 *     an object whose most famous image is a modern machine beats every
 *     qualifier around it, and it would fight this bot's own identity
 *     fragment, which states in every prompt that "every tool, structure and
 *     object is charming, old-fashioned and personal in scale". (iii) The
 *     path does not need one: the SCALE comes from the bales and the field,
 *     and a heaped wagon, hand rakes and pitchforks carry the LABOUR. So the
 *     haulage is a WAGON, drawn by a horse or pushed and pulled by hand.
 *  7. 🩸 NO RUST AND NO DARK-RED FAMILY (lesson 31, measured on THIS BOT). On
 *     `lambing-season` round 2, "rust-orange hinges showing at the post"
 *     rendered two bright wet orange-red runs down the post and down the crook
 *     beside it. This path has blades, bare forearms and hot sun in it, so the
 *     family is banned outright and worn steel is "worn silver-bright".
 *  8. 🗣️ HAYMAKING'S OWN VOCABULARY IS A CONFIDENT WRONG PRIOR (lesson 28,
 *     and lesson 47 for the premise noun). A layperson pictures a different
 *     object for nearly every term this work uses. Fully banned with plain
 *     replacements written out below. ⚠️ AND THE PREMISE WORD IN THE PATH'S
 *     OWN NAME, which is lesson 47's most expensive form: "BALING" IS A
 *     HOMOPHONE OF "BAILING" (bailing out a boat, bail bonds) and "STUBBLE"
 *     IS FACIAL HAIR — on a path that puts human faces in frame, that is a
 *     beard generator as well as a subtraction. The Flux-facing words are
 *     HAYMAKING, THE HAY HARVEST and BALES OF HAY; the path's own name never
 *     reaches a prompt.
 *  9. 🎭 A NAMED ACTION WITH NO NAMED ACTOR RENDERS THE BODY PART ALONE
 *     (lesson 25, measured twice in the 2026-09 run: a cup "held out from the
 *     next deck" drew a giant floating hand and forearm at two scales). Every
 *     moment entry leads with the person or the animal DOING it as the
 *     grammatical subject.
 * 10. 🚫 PER-OBJECT AGENCY ON A CLUSTER PERSONIFIES IT (the lakeside
 *     river-stones bug on this bot). A field of bales IS a cluster. Describe
 *     the mass holistically, with one member set apart — never as a list of
 *     individual actions, and never in a row or a line.
 *
 * ━━━ AXIS-CLEAN DISCIPLINE ━━━
 * `hay_light` owns time of day, weather, season and the colour of light. NO
 * other pool may name any of the four (EarthBot LESSON 4 / the 2nd
 * look-register amendment). The ONE allowance, stated in each recipe: an entry
 * may say hay dust is up in the air and may say the ground is dry, because
 * those are the literal subject of those shots — never when, in what weather,
 * or in what colour.
 *
 * ━━━ LESSON 44 ━━━
 * A law omitted from ONE axis is the axis that breaks it, and satellite axes
 * inherit vocabulary from the recipe's own EXAMPLES. So the CROSSWISE law and
 * the POSITIVE-SURFACE law ride on every pool that can name the ground or the
 * bales (bales, field, moment, crew, light), not just the field pool that owns
 * them, and every example below anchors on GENERIC nouns ("the cut floor",
 * "the standing grass") rather than on a specific prop one axis would then
 * import into another.
 *
 * Run:  node scripts/gen-seeds/farmbot/gen-hay-baling-summer-pools.js
 *       node scripts/gen-seeds/farmbot/gen-hay-baling-summer-pools.js field light
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

// Shared ban block — appended to every recipe so one edit fixes all five and
// no recipe can silently drift off the law list in the header above.
const BANS = `🚫 STRICT BANS (every one is a documented, render-costing failure on this bot or its siblings):

- NO READABLE TEXT of any kind and NONE of its synonyms: no label, no lettering, no writing, no words, no numbers or numerals, no mark/marks/marking, no glyph, no sigil, no stamp or stamped or stencil or stencilled, no printed sack, no branded sack, no engraving, no etching, no inscription, no script, no plaque, no sign or signage or signpost, no notice board, no chalk board, no chalkboard, no tally, no clipboard, no notebook, no ledger, no written record, no brand, no badge, no decal, no logo, no maker's plate. Instead, every flat surface — the wagon's plank side, the field gate, a tool handle, a bucket side, a bench end — is described POSITIVELY as one of: bare weathered timber silvered by the sun; painted one flat single colour; or CARRYING a real object (a coiled rope over a rail, a wooden hay rake leaning against it, a pitchfork stood up in the ground, a straw hat hooked on the post, a stone jar of water in the shade underneath, a jacket thrown over the top bar, a tin cup upside down on a post, a dog's chipped enamel bowl, a hank of twine on a nail).

- ⛔ NO "PUT THERE BY A HAND" LANGUAGE FOR THE CUT LINE OR ANY OTHER HARD EDGE. This is its own measured text-prior family: a recipe that sanctioned "as if ruled", "so straight it looks drawn" and "like a tide mark" had all three echoed straight back into renders. So none of these appears: "ruled", "a ruled mark", "mark", "drawn", "traced", "written", "inked", "pencilled", "scored", "tide mark", "like a fold in paper", "like a line on a page", "as if measured". A hard straight edge is HARD, CLEAN, ABRUPT, SHEER or UNBROKEN — never something drawn, marked or ruled.

- ⛔ NO DIALS, GAUGES, CLOCKS, DASHBOARDS, METERS OR SCREENS. Measured across bots: a surface whose SHAPE is already a text surface cannot be described safely — "every dial is a blank white enamel face with one slim brass needle" is, to the model, a description of a clock face, and the clock prior ships numerals however the clause is worded. The only fix is to delete the noun, so none of these words appears anywhere.

- ⛔ NO MOTORISED MACHINERY AT ALL, and this is absolute: no tractor, no baler, no combine, no harvester, no mower, no engine, no motor, no cab, no bonnet, no exhaust, no diesel, no hydraulics, no machine or machinery of any kind, no truck, no pickup, no trailer, no quad bike. Three reasons: such a machine is a dense cluster of the text-shaped surfaces banned above (badge, decals, plate, dials); a modern-machine noun beats every old-fashioned qualifier around it; and this bot's own identity rule states in every single render that every tool, structure and object is charming, old-fashioned and personal in scale. THE HAULAGE IS A WOODEN WAGON — flat-bedded or high-sided, drawn by a horse in harness or pushed and pulled by hand — and the tools are hand tools: a wooden hay rake, a two-pronged pitchfork, a long-handled fork, a scythe stood against a bale.

- ⛔ NO WHITE PLASTIC BALE WRAP, no net wrap, no plastic sheet, no tarpaulin, no tarp, no polythene, no nylon, no polyester. Plastic wrap is both a printed surface and the ugliest thing in a real hayfield. Bales are BARE DRY HAY, bound round with plain twine, their cut ends showing the packed spiral of stalks.

- ⛔ NO RUST AND NO DARK-RED FAMILY ANYWHERE, on metal, timber, skin or hay. Measured on this bot's lambing path: "rust-orange hinges showing at the post" rendered two bright wet orange-red runs streaking down the post and down the crook beside it, which on a path with blades and bare forearms reads unmistakably as blood. Banned outright: rust, rusted, rust-orange, rusty, corroded, crimson, scarlet, maroon, dark red, deep red, blood-red, oxblood, ruddy, brick-red, ochre-red, blood. Worn iron is "worn silver-bright" or "gone chalky grey". Painted timber uses flat sky-blue, buttermilk, mint-green, dove-grey, faded rose or ochre-yellow.

- ⛔ NO INJURY OR DISTRESS REGISTER. There are blades and hot sun here: no cut, no nick, no graze, no scrape, no wound, no sore, no blister, no sunburn, no heatstroke, no collapse, no exhaustion, no grim endurance, no bandage. The work is HARD AND HOT AND THIS FIELD IS IN A GOOD HUMOUR — sleeves rolled, faces bright, water passed round, somebody flat on their back in the one patch of shade entirely on purpose.

- ⛔ BANNED TRADE JARGON — every one makes a layperson (and the model) picture a different object, which then renders CONFIDENTLY wrong. Use the plain replacement: "baling" and "bail" (a homophone of bailing out a boat — say HAYMAKING or THE HAY HARVEST); "stubble" (it is facial hair, and it is a subtraction — say THE CUT FLOOR or THE PALE BRISTLED FLOOR OF CUT STALKS); "swath" or "swathe" (a swathe of cloth); "windrow" (say A LONG COMBED RIDGE OF RAKED GRASS); "tedder" or "tedding"; "mow", "mown", "mowed", "mower", "lawn" (a mown field is a suburban lawn — say CUT); "crop" (a haircut, and a photo crop — say THE STANDING GRASS or THE TALL UNCUT GRASS); "silage"; "haylage"; "sward"; "ley"; "aftermath" (it is a real haymaking word and it means something else entirely to everyone else); "rick"; "header"; "pickup"; "elevator"; "loader"; "conditioner"; "chaff" (say DRIFTING HAY DUST or LOOSE SEED HEADS); "board" as a surface; "stack" of paper. And "HAYMAKER" is banned too, which is the least obvious one on the list: to everybody outside farming a haymaker is a BIG SWINGING PUNCH, and this is a path full of people swinging things — say THE FARMER, THE FARMERS or THE CREW. MEADOW is banned outright as well, because a separate live path on this bot owns that noun.

- ⛔ THE NEIGHBOUR FENCE. Four separate live paths on this bot own registers this one must never touch: NO harvest festival, NO fete, NO fair, NO bunting, NO stalls, NO games, NO prizes, NO decorated bales, NO bale maze, NO scarecrow; NO picnic blanket, NO picnic basket, NO hamper, NO laid-out spread; NO wandering, NO strolling, NO ambling, NO daydreaming through flowers; NO wildflower field as the subject of the frame. A few poppies or ox-eye daisies surviving along the field EDGE are welcome — a field of flowers is not. This is WORK.

- NO metaphorical object-noun standing in for light ("coins of light", "ribbons of gold", "curtain of diamonds", "scattered gems", "confetti of light") — figurative light language renders as the literal object.

- LIGHT IS NEVER A SOLID OBJECT. Measured across three bots: light called a "column", "pillar", "shaft", "beam", "ray", "bar", "wall", "blade", "finger" or "curtain", or a "sunbeam" or "god ray", renders as a literal solid standing in the frame. NAME THE LIT SURFACE FIRST and let the light be what is ON it: "the cut floor is laid over with a hot apricot band", not "a shaft of apricot light falls on the floor". A flat BAND of brightness across a named surface is the one safe shape.

- NEVER pair "dark"/"darkness"/"shadow" with a light word ("glint", "sparkle", "shimmer", "luminous", "glow") describing the SAME thing in the same phrase. Describe a shaded patch plainly, with no light word attached in the same breath.

- NEVER put a glow, an ember, a coal or a light INSIDE or WITHIN a small dark opening — not in a gap, a slot, a crack, a hollow or a hole. Measured on this bot: the model transplants that glow onto the nearest dark aperture and paints a fire burning inside it.

- ↔️ NO CORRIDOR, NO VANISHING POINT, NO RECEDING RANK. This is the single biggest structural risk on this path and it must be banned on EVERY axis, because a vanishing point authored into the hero pool beats a correct crosswise ground rule every time. Banned outright: "receding", "recede", "recedes", "vanishing point", "converging", "converge", "toward the horizon", "into the distance", "off into the distance", "stretching away", "marching away", "dwindling", "diminishing", "one behind another", "row after row", "rows of", "neat rows", "in a line toward", "lined up", "single file", "evenly spaced", "each smaller than the last", "perspective lines", "tramlines", "avenue", "corridor", "a track leading", "a lane running", "a single point", "an apex", "a meeting point". WRITE IT CROSSWISE INSTEAD, and say so explicitly in the entry: the cut ground fills the near half of the picture and runs off BOTH SIDE EDGES; the tall uncut grass is a BAND across the upper part; the line between them crosses from the LEFT EDGE to the RIGHT EDGE with both ends out of frame; a scatter of further bales sits away across the cut ground, spread wide and uneven rather than ranked. Long shadows RAKE ACROSS the picture from one side; they never run away from the camera toward a point.

- ⛔ NO SIZE COMPARISON OF ANY KIND IN ANY ENTRY, and this is a deliberate single-owner rule rather than an oversight. The path's TEMPLATE owns the scale ruler and states it on every single render; a second ruler written here would contradict it and would drag an extra object into frame (measured: a hero recipe that named its ruler object made 24 of 25 entries name it, so a second one appeared in the picture). So NONE of these appears anywhere: "as tall as", "as wide as", "as big as", "as high as", "the size of", "the height of", "the width of", "taller than", "wider than", "bigger than", "twice as", "half as", "a hand's width", "a hand's breadth", "hand-sized", "the size of a thumb", "a finger-width", "knee-high", "waist-high", "chest-high", "shoulder-high", "head-high", "man-sized", "car-sized", "the size of a barrel", "the size of a house". Convey the hay's presence with a real COUNT and with what is happening to it, never with a comparison.

- ⛔ NO DETAIL EXEMPTION FOR ANYTHING. Do NOT write "the nearest one showing its...", "detail on the closest bale", "the near bale rendered in close detail". Measured on this bot's apiary path over 30 entries: a close-detail clause for the nearest subject beat a correct ruler every single time and produced oversized subjects at exactly the rate the clause appeared; stripping it took the defect from 3 of 5 renders to 0 of 6. Every bale, animal and person is a clean, correctly-proportioned shape, INCLUDING the nearest. THE ONE YOU DESCRIBE MOST IS THE ONE THAT COMES OUT BIGGEST.

- NO FORMATION, ROW OR MIRROR WORDING FOR OBJECTS OR ANIMALS. Measured across three bots: "in a single line", "in a row", "evenly spaced", "one on each side", "one on either side", "flanking", "symmetrical" all render as a mirrored composition or as the subject tiled to a vanishing point. Write a group as a LOOSE UNEVEN SCATTER across the frame with one member set apart from it.

- NO FACE OR EXPRESSION DRAWN ONTO an object — not onto a bale, a wagon, a bucket, a gate or the sun. Every animal keeps its own true-to-life animal head, muzzle and eyes. No object acts of its own accord and no bale is given a personality; describe a group of bales holistically, never as a list of individual doings.

- NO negation phrasing inside an entry ("no grass left", "not a cloud", "nothing but"). Describe only what IS present.

- NO commercial or industrial scale: no eight hundred bales, no contractor, no fleet, no gang of twelve in a line, no acres, no hectares, no factory. A small, personal, hand-worked field and one or two people at most.

- NO MODERN DRESS OR MODERN OBJECTS: no t-shirt, no jeans, no denim, no shorts, no sneakers, no trainers, no baseball cap, no sunglasses, no phone, no radio, no hi-vis, no plastic bottle. The hats are straw, the shirts are linen or cotton with the sleeves rolled, the water comes in a stone jar or a tin can.

- NO brand names, NO camera or photographer names, NO named grass or cereal cultivars — plain descriptive language only ("dry meadow-grass hay", "pale green-gold hay", "hay gone silvery at the tips").`;

// The positive-surface law — this path's version of the shorn sheep, and it
// rides on every pool that can name the ground (lesson 44).
const SURFACE_LAW = `🌾 THE POSITIVE-SURFACE LAW (required in every entry that names the ground — this is the single most expensive failure available on this path, and it has already been measured on this exact bot):

A cut field is the same shape of problem as a shorn sheep, and here is the measurement that proves it. On this bot's \`sheep-shearing-day\` path one authored clause carried an additive half and a subtractive half, in the SAME sentence, at the SAME position, in the SAME prompts: "woolly cuffs still at the ankles" rendered in 6 OF 6, every round; "no fluff on the body anywhere" rendered in 1 OF 6. THE MODEL ADDS AND IT DOES NOT SUBTRACT. Three rounds of better adjectives for the absence moved it from 0 to 1 of 6; naming a positive object took it to 5 of 6.

"Stubble" is a subtractive description of a field — grass with its height removed — so it is banned, and so is every attempt to describe shortness better. Instead:

  ✅ NAME THE CUT GROUND AS A POSITIVE OBJECT, leading with its SURFACE: "a pale bristled floor of cut stalks with bare dry soil showing between them"; "a close, dense, pale-gold bristle underfoot, dusty and dry, the soil showing through in patches"; "a cut floor gone almost white in the heat, littered with broken stalks and loose seed heads".
  ✅ PROVE THE CUT WITH THINGS THAT HAVE BEEN ADDED TO IT, never with height removed — this is the hat-and-socks move: two pale wheel ruts pressed into the bristle; a long combed ridge of raked grass lying across the picture, loose and open and ready; a scatter of loose hay dragged off a load; broken stalks and empty seed heads littered about; a few tall stalks still standing here and there where the blade missed them; a thistle head or two left standing untouched; the bales themselves.
  ✅ NAME THE TALL UNCUT GRASS AS A WALL, not as a height: "the tall uncut grass stands up like a solid green-gold wall along the line, dense and close, its seed heads nodding out over the edge of the cut". The wall is what makes the cut legible, exactly as the woolly majority is what makes a bare sheep legible.
  ✅ THE ODD-ONE-OUT FRAMING, which is the third thing that carried the sheep: the contrast between the cut half and the standing half is the money shot, so name BOTH in the same entry wherever the entry names the ground at all.`;

// The motto — the grading lens, restated for every recipe, because a clean
// sober render is a MISS on this app and a tidy field is the obvious one.
const MOTTO = `⭐ THE BAR (this outranks "no defects", and a clean but SOBER entry is a MISS, not a pass):

This app exists to add whimsy and delight. Every entry has to be playful, adventurous, VIVID, beautiful and CLEVER — it either shows people something they have never looked at closely, or takes something familiar and redresses it as far more interesting. A TIDY GOLDEN FIELD WITH SOME BALES IN IT IS THE FAILURE, and it is the most photographed rural cliche there is, so it is also the easiest thing to write by accident. Sober documentary competence is the enemy.

What the premise actually gives you, and what to spend every entry on:
  • A ROUND BALE IS AN ENORMOUS CYLINDER of packed hay, its cut end a tight spiral of stalks, bound round with twine, and a person or a dog beside one reads as tiny.
  • THE CUT/UNCUT LINE is a hard graphic edge straight across the picture — half pale bristled floor, half standing green-gold wall.
  • HAY DUST IN LOW SUN is straightforwardly gorgeous: the air packed with drifting motes, every speck of it lit.
  • A WAGON STACKED FAR TOO HIGH is funny all by itself — leaning, overhanging, hay avalanching off the back end, somebody riding the top of it.
  • AND THE JOKES OF THE OBJECTS THEMSELVES, which is where the charm lives: a bale that has got away down the slope and is sitting square in the hedge; a dog flat out and fully committed in the one patch of bale-shadow; a cat riding the top of the load like it owns it; a bale tipped on its side being used as a sofa by three people at the water break; a straw hat left behind on a bale end; boots off and socks drying on the twine; sparrows working the cut floor right behind the rake; a hare sitting up small at the edge of the standing grass, entirely unbothered.

ONE CHARM DETAIL PER ENTRY — a small clever specific the eye finds on second look, and it must make it THAT moment and no other.`;

// ⚠️ THE GROUND BELONGS TO EXACTLY ONE AXIS, and this block is here because the
// FIRST generation of these pools got it wrong in a way worth recording.
//
// Round 0 handed the full CROSSWISE law to three recipes (bales, field, moment)
// on the reasonable reading of lesson 44 ("a law belongs on every axis that can
// name the banned thing"). Measured on the generated output: the crosswise
// boilerplate landed in 17 of 25 bales entries, 23 of 25 field entries and 13
// of 25 moment entries — so a composed brief carried the SAME 35-word clause
// three or four times over, plus the framing block, plus the output order. On a
// bot whose shared fragment already spends words 4-277 of every prompt, that is
// the path's own attended region spent on repeating itself.
//
// AND IT BLEW THE WORD COUNTS, which is lesson 55 firing on the author: Sonnet
// anchors length on the EXAMPLES, not on the stated number, and the examples I
// wrote for those three pools were 55-70 words because I had stuffed the law
// into them. Measured across the same run:
//     pool    ask      median returned
//     bales   22-34    73   (2.5x over)
//     field   26-38    79   (2.3x over)
//     moment  28-40    62   (1.8x over)
//     crew    14-24    26   (1.1x over)  ← the ONE pool whose examples were short
//     light   24-34    45   (1.5x over)
// The crew pool is the within-build control: same generator, same model, same
// run, short examples, near-spec output.
//
// So: lesson 44 is about BANS (a banned noun must be banned everywhere), and
// lesson 24 is about a POSITIVE geometric law, which needs three places that
// reach Flux — not six. The three here are the FRAMING block, the FIELD pool
// (the axis that owns the ground) and the required OUTPUT ORDER. Every other
// pool is told the ground is not its job and spends its words on content.
const GROUND_NOT_YOURS = `⛔ THE GROUND IS NOT THIS AXIS'S JOB — DO NOT DESCRIBE IT. A separate axis owns the field's geometry completely and states it on every single render, and the path's template states it twice more. So this pool must NOT say any of: "fills the near half", "runs off both side edges", "a band across the upper part", "the line crossing from the left edge to the right edge", "both ends out of frame", "the tall uncut grass stands as a wall". Repeating it here spends this axis's whole word budget on a clause that is already in the prompt three times, and on this bot that budget is the scarcest thing there is. You MAY name the surface something sits ON in two or three words ("on the pale bristled cut floor", "in the hedge at the foot of the slope") — nothing more. Spend every other word on the hay, the count, the action and the charm.`;

const AXIS_CLEAN = `AXIS-CLEAN — CRITICAL: this pool must contain ZERO time-of-day words, ZERO weather words, ZERO season-naming words and ZERO colours of light (no "golden", "afternoon", "morning", "dawn", "sunset", "dusk", "evening", "night", "midday", "misty", "rainy", "overcast", "stormy", "warm light", "cool light", "summer", "July", "August"). A separate axis owns all four and a time-of-day word here directly contradicts whatever that axis rolled. You MAY say hay dust is up in the air and you MAY say the ground is dry, because those are the literal subject of those shots — but never say when, in what weather, or in what colour of light.`;

const RECIPES = [
  // ───────────────────────────────────────────────────────────────
  // 1. ★ THE HERO — the hay itself, and the path's whole sense of scale
  // ───────────────────────────────────────────────────────────────
  {
    key: 'bales',
    outPath: path.join(SEEDS_DIR, 'farmbot_hay_bales.json'),
    total: 25,
    batch: 40,
    // append:false ON PURPOSE — the first generation of this pool restated the
    // crosswise ground law in 17 of its 25 entries and came back at a 73-word
    // median against a 22-34 ask (see GROUND_NOT_YOURS above). Nothing in that
    // set was worth keeping. Flip back to append:true before any top-up run.
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of THE HAY IN THE FRAME for a cozy
countryside anime bot's new high-summer haymaking path. This is the path's HERO axis: the round bales,
the stack, the heaped wagon and the loose hay, and how they are massed in the picture.

Each entry answers: HOW MANY, WHERE THEY SIT, WHAT HAS BEEN DONE TO THEM OR IS BEING DONE TO THEM, and
ONE CHARM DETAIL. A round bale is an enormous cylinder of packed dry hay lying on its side, its cut end
a tight spiral of stalks, bound round and round with plain twine.

⚠️ LENGTH IS A HARD RULE AND IT IS COUNTED: 22-34 WORDS PER ENTRY. Not 40, not 60. One sentence, or
two short ones. Every example below obeys it — match the EXAMPLES, not just the number. An entry over
34 words will be rejected.

NAME A REAL COUNT in every entry ("five", "eight", "a dozen", "three close and a loose scatter beyond")
— never just "bales". A count is what fixes how big each one reads.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~6 STANDING IN THE CUT: a loose uneven scatter of five or eight great drums of hay sitting about on
  the pale bristled floor, spread wide across the frame, each throwing its own long shadow raking
  across the cut ground from one side.
- ~4 THE STACK: six or eight bales built up two and three deep against the field gate or the hedge, one
  set slightly out of true and leaning on its neighbour, the twine on the top one gone furry and pale.
- ~4 THE HEAPED WAGON, and it should be funny: a wooden flat-bed wagon piled far too high with loose
  hay, overhanging its own sides, leaning, hay avalanching off the back end in a slow slither, a
  wooden rake laid flat across the top of the load to hold it down.
- ~3 THE LOOSE HAY: a long combed ridge of raked grass lying across the picture, open and dry and
  ready; a soft heap of loose hay tumbled off a load, with a two-pronged pitchfork stood upright in it.
- ~3 THE ONE THAT GOT AWAY (the comedy): a single great drum of hay sitting square in the hedge at the
  bottom of the slope where it rolled, with the flattened pale track it made still showing behind it;
  one bale tipped on its flat end and standing up like a drum on a floor, entirely out of place.
- ~3 WHAT LIVES ON THEM: a chipped stone jar of water wedged into the shade underneath one; two boots
  and two socks drying over the twine; a linen jacket thrown over the top bar of the gate beside the
  stack; a hollowed-out gap between two bales worn smooth from being sat in.
  ⛔ NO STRAW HAT in this pool — a separate axis owns the hat entirely, and two hats in one frame is
  exactly the duplicate-object failure that a single-owner rule exists to prevent.
- ~2 THE SURFACE OF THE HAY ITSELF: the cut end of a bale a tight packed spiral of pale stalks with
  seed heads poking out all over it, the whole drum furred with loose ends and bleached silver on top.

${GROUND_NOT_YOURS}

${MOTTO}

${AXIS_CLEAN}

Output ONLY a JSON array of ${n} plain strings (no objects, no tags). 22-34 words each — match the
length of these examples exactly. No preamble, no numbering.

Examples:
["Five great drums of hay sit in a loose uneven scatter on the pale bristled cut floor, each throwing a long shadow raking across it from one side. The twine on the nearest has gone furry and pale.",
"A wooden flat-bed wagon piled far too high with loose hay leans and overhangs its own plank sides, hay slithering slowly off the back end. A wooden rake lies flat across the top to hold it down.",
"One great drum of hay sits square in the hedge at the foot of the slope where it rolled, the flattened pale track it pressed still showing behind it. Eight more sit scattered wide and uneven beyond.",
"The cut end of one drum is a tight packed spiral of pale stalks with seed heads poking out all over it, the whole cylinder furred with loose ends and bleached silver along the top."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 2. THE STAGE — the cut/uncut geometry and the ground surface
  // ───────────────────────────────────────────────────────────────
  {
    key: 'field',
    outPath: path.join(SEEDS_DIR, 'farmbot_hay_field.json'),
    total: 25,
    batch: 40,
    // append:false ON PURPOSE — the first generation spent ~60% of every
    // entry's words restating the full crosswise law (79-word median against a
    // 26-38 ask), leaving almost no room for the VARIETY this axis exists to
    // supply, and two of its entries reached for "like a ruled mark" and "as
    // sharp as a fold in paper" — both text priors. Regenerated with a compact
    // one-clause form of the law. Flip back to append:true before a top-up.
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of THE HALF-CUT FIELD for a cozy
countryside anime bot's new high-summer haymaking path. This axis owns THE STAGE: the hard graphic
boundary between the cut half and the standing half, the surface of the cut ground underfoot, and
what closes the frame at the far side.

This is the path's differentiator and no other path on this bot has it, so every entry must carry the
CUT/UNCUT LINE explicitly. The line itself is the picture's strongest graphic element: on one side a
pale bristled floor you can see the soil between, on the other a solid standing wall of green-gold
grass with its seed heads nodding out over the edge.

⚠️ LENGTH IS A HARD RULE AND IT IS COUNTED: 34-46 WORDS PER ENTRY. Match the EXAMPLES below, not just
the number — an entry over 46 words will be rejected. Two thirds of every entry must be CONTENT.

EVERY ENTRY MUST NAME, IN ITS OWN WORDS, ALL THREE OF:
  (a) the cut floor as a POSITIVE SURFACE — a pale bristled floor of cut stalks with bare dry soil
      showing between them, or a close dense pale-gold bristle, or a cut floor gone almost white;
  (b) at least one thing that has been ADDED to it (two pale wheel ruts, a long combed ridge of raked
      grass, a drift of loose hay off a load, broken stalks and empty seed heads, a few tall stalks
      the blade missed still upright, a thistle head left standing untouched);
  (c) THE GEOMETRY, and state it ONCE, COMPACTLY, in roughly these words and no more than these:
      "the cut floor running off both side edges, the tall uncut grass a dense wall banding the top".
      ⚠️ DO NOT expand that into three clauses. The path's template already states the full form twice
      on every single render ("fills the near half", "the line crossing from the left edge to the
      right edge", "both ends out of frame"), so writing it out again here buys nothing and costs this
      axis the whole word budget it needs for its actual job, which is VARIETY.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~6 THE LINE ITSELF as the hero: dead straight and hard-edged, the standing wall dense and close on
  one side of it and the pale bristle open on the other, seed heads nodding out over the cut.
- ~4 THE LAST STRIP: one narrow ribbon of tall grass still standing with cut floor on both sides of
  it, plainly the last of the field, a wooden rake propped where it will be finished.
- ~4 WHAT IS ON THE CUT FLOOR: two pale wheel ruts pressed into the bristle; a long combed ridge of
  raked grass lying across the picture; a drift of loose hay dragged off a load; broken stalks and
  empty seed heads littered all over it.
- ~4 WHAT CLOSES THE FAR SIDE (so the frame is never an empty open plain): a deep dark hedgerow thick
  with bramble; a dry-stone wall gone pale and furry with lichen; a leaning post-and-rail fence with
  a coiled rope over its top bar; a line of big old trees; a hedge with one gap and a gate in it.
- ~3 THE SURVIVORS (charm, and the ONE place flowers are welcome): a few poppies and ox-eye daisies
  surviving in the rough along the fence foot; a clump of thistle heads left standing untouched in the
  middle of the cut; a tall ring of grass left standing round something nobody could get the blade to.
- ~2 THE GROUND IN DETAIL: the cut floor gone almost white and dusty, the bare dry soil showing
  through it in patches, a fine haze of loose hay dust lying low over the whole surface.
- ~2 THE SLOPE: the cut half falling away gently so the pale bristled surface reads as one long
  continuous plane, the standing wall along the top of it.

${SURFACE_LAW}

⛔ AND ONE MORE CORRIDOR RULE, because this axis is the one that can break it: the ruts and the ridges
are the field's linear features and they are the model's favourite invitation to a vanishing point. So
a rut or a ridge ALWAYS lies ACROSS the picture from one side to the other, never away from the camera.
None of these appears anywhere: "receding", "vanishing point", "converging", "toward the horizon",
"into the distance", "stretching away", "rows of", "lined up", "perspective", "tramlines", "a lane
running", "a track leading".

${MOTTO}

${AXIS_CLEAN}

Output ONLY a JSON array of ${n} plain strings (no objects, no tags). 34-46 words each — match the
length of these examples exactly. No preamble, no numbering.

Examples:
["Two flattened wheel ruts are pressed right across a pale bristled floor of cut stalks with bare dry soil showing between them, the cut floor running off both side edges and the tall uncut grass a dense wall banding the top, its seed heads nodding out over the edge.",
"A long combed ridge of raked grass lies across a close pale bristle littered with broken stalks, the cut floor running off both side edges; a dark bramble hedge closes the far side and the tall uncut grass is a wall banding the top in front of it.",
"One narrow ribbon of tall grass is still standing with pale bristled floor open on both sides of it, a few stalks the blade missed left upright, a wooden rake propped where the work will finish; the cut floor runs off both side edges and the ribbon bands the top.",
"A clump of thistle heads stands untouched in the middle of a cut floor gone almost white and dusty, bare soil showing through in patches; the floor runs off both side edges, and a dry-stone wall furred with lichen closes the far side behind the standing wall of grass."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 3a. ★ THE MONEY SHOT — standalone (no person implied anywhere)
  // ───────────────────────────────────────────────────────────────
  // ⚠️ SEEDED AS ITS OWN RECIPE, and so is 3b, because a split asked for
  // inside ONE meta-prompt is not the split you get (lesson 59, measured on
  // this bot: two recipes asked for 15/10 and 16/9 and returned 25/0 and
  // 24/1). On a path whose no-character branch fires 40% of the time, a
  // tag-filtered pick from an empty slice is a hard CRASH, not a dull render.
  {
    key: 'moment-standalone',
    outPath: path.join(SEEDS_DIR, 'farmbot_hay_moment.json'),
    total: 16,
    batch: 26,
    // append:false ON PURPOSE — the first generation restated the crosswise
    // ground law in 13 of its 25 entries (62-word median against a 28-40 ask).
    // This is the FIRST of the two moment recipes, so it wipes the file and 3b
    // then appends onto it; 3b must stay append:true and must run after.
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HAYMAKING MOMENTS for a cozy countryside anime bot's
new high-summer path. Each entry is ONE beat happening RIGHT NOW in a half-cut hayfield, with
ABSOLUTELY NO PERSON IN IT AND NONE IMPLIED ANYWHERE IN THE SENTENCE.

⚠️ THIS IS THE NO-PEOPLE SET and the constraint is total: no person, no figure, no crew, no worker, no
farmer, no child, no hand, no arm, no shoulder, no boot on a foot, no "somebody", no "someone". An
object LEFT BEHIND by a person is fine and is in fact where most of the charm lives (a straw hat on a
bale end, a rake stood in the ground, a jacket over the gate) — but nobody is in the frame, no body
part appears, and the words "someone", "somebody" and "whoever" never appear either, because an
implied off-frame person is a person the model will invent and put in the picture. A named action with no named actor renders the body part alone on
this model: a cup "held out from the next deck" drew a giant floating hand and forearm, duplicated at
two scales. So every entry's grammatical SUBJECT is an object or an animal, named first, followed by
what it is caught mid-way through.

THESE ${n} ENTRIES MUST READ UNMISTAKABLY AS HAYMAKING ON THEIR OWN, with nobody there to explain it —
so the bales, the heaped wagon, the raked ridges, the ruts, the tools left standing and the cut line do
all the work.

⚠️ LENGTH IS A HARD RULE AND IT IS COUNTED: 26-38 WORDS PER ENTRY. Match the EXAMPLES below, not just
the number — an entry over 38 words will be rejected.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~3 THE ESCAPE (the comedy): a great drum of hay sitting square in the hedge at the bottom of the
  slope with its flattened track still showing behind it; a bale tipped up on its flat end standing
  like a drum on the bristled floor where nothing should stand.
- ~3 THE OVERLOADED WAGON: a wooden wagon piled far too high and leaning, a slow slither of loose hay
  avalanching off its back end onto the cut floor; a heaped wagon stood waiting at the gateway with a
  rake laid flat across the top of the load and a cat asleep on it.
- ~3 WHAT THE ANIMALS ARE DOING: a farm dog flat out and fully committed in the one patch of
  bale-shadow; a scatter of sparrows working the cut floor right behind a raked ridge, hopping and
  flicking stalks over; a hare sitting up small at the edge of the standing grass, entirely
  unbothered; swallows cutting low and fast across the open cut ground.
- ~3 THE AIR AND THE DUST (the beauty shot): the whole air over the cut floor packed with drifting hay
  dust and loose seed heads, every speck of it hanging and turning, thickest where a load has just
  gone past and thinning out over the standing wall.
- ~2 THE THINGS LEFT DOWN (charm, and this is the set-dressing win — and THIS pool is the single owner
  of the STRAW HAT, so it is welcome here and banned everywhere else): a straw hat sitting crown-down
  on a bale end with a stone jar of water wedged in the shade underneath; a straw hat hooked over the
  handle of a pitchfork planted upright in a heap of loose hay.
- ~2 THE WORK HALF-DONE: a wooden hay rake stood upright in a combed ridge exactly where it was let go
  of, the ridge finished on one side of it and still loose on the other; a two-pronged pitchfork
  planted in a soft heap of hay tumbled off a load.

${GROUND_NOT_YOURS}

${SURFACE_LAW}

${MOTTO}

${AXIS_CLEAN}

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["standalone"], "description": "..."}.
26-38 words per description — match the length of these examples exactly. No preamble, no numbering.

Examples:
[{"tags":["standalone"],"description":"A farm dog lies flat out and fully committed in the one patch of bale-shadow on the pale bristled cut floor, one ear turned inside out. A straw hat sits crown-down on the bale end above him."},
{"tags":["standalone"],"description":"A wooden wagon piled far too high with loose hay leans at the gateway, a slow slither of it avalanching off the back end; a wooden rake lies flat across the top of the load and a cat is asleep on the rake."},
{"tags":["standalone"],"description":"A wooden hay rake stands upright in a long combed ridge of raked grass exactly where it was let go of, the ridge combed smooth on one side of it and still loose and open on the other."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 3b. ★ THE MONEY SHOT — handled (the moment genuinely needs a person)
  // ───────────────────────────────────────────────────────────────
  {
    key: 'moment-handled',
    outPath: path.join(SEEDS_DIR, 'farmbot_hay_moment.json'),
    total: 25,
    batch: 18,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HAYMAKING MOMENTS for a cozy countryside anime bot's
new high-summer path. Each entry is ONE beat happening RIGHT NOW in a half-cut hayfield that GENUINELY
NEEDS A PERSON IN IT — the lift, the throw, the heave, the water break, the ride on top of the load.

⚠️ NAME THE WHOLE FIGURE, ALWAYS, AS THE GRAMMATICAL SUBJECT, AND NEVER A BODY PART ON ITS OWN. A named
action with no named actor renders the body part alone on this model: a cup "held out from the next
deck" drew a giant floating hand and forearm, duplicated at two scales. So write "a farmer swings a
forkful of hay up over their head onto the load", never "a forkful of hay is swung up onto the load",
and never "a hand lifting", "an arm reaching", "a boot on the rail".

Call them THE FARMER, THE FARMERS or THE CREW — always gender-neutral, because the path's template
names and dresses the person from a separate axis immediately above this line, and an entry that says
"a farm girl" contradicts it on every render where that axis rolled a man. One or two people at most.

⛔ AND NAME NO GARMENT AT ALL, not even a straw hat. This is measured: an axis that names a garment
dresses every render the same way and overrides the wardrobe axis entirely — on another bot, action
seeds reading "long captain's coat billowing" put a blue brass-buttoned naval coat on EVERY render
regardless of what the outfit pool rolled. So none of these appears: hat, cap, shirt, blouse, sleeve,
apron, dungarees, overalls, trousers, skirt, dress, coat, jacket, waistcoat, scarf, kerchief, glove,
boot, shoe, sock, braces, belt, pinafore, smock, brim. A hat lying ON A BALE is fine (it is a prop, not
a garment being worn); a hat ON A HEAD is not.

THE SCALE IS THE POINT: a person beside one of these enormous drums of hay reads as tiny, and that is
the shot. So put them right up against the hay, or on top of the load, or in its shadow.

⚠️ LENGTH IS A HARD RULE AND IT IS COUNTED: 26-38 WORDS PER ENTRY. Match the EXAMPLES below, not just
the number — an entry over 38 words will be rejected.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~5 THE LIFT AND THE THROW: a farmer swinging a full forkful of loose hay up over their own head onto
  a load already far too high, with the hay coming apart in the air and raining back down over them;
  one farmer on the ground pitching hay up to a second standing on top of the load, both leaning into
  it.
- ~5 UP ON THE LOAD: a farmer walking the top of a heaped wagon with both arms out for balance and the
  whole load shifting gently underneath; a farmer riding the top of a finished load through the
  gateway, flat on their back in the hay with both ankles crossed and one arm behind their head.
- ~4 THE WATER BREAK, which is where the charm is: three farmers sat along a bale tipped on its side,
  using it as a sofa, passing a chipped stone jar of water between them; a farmer tipping a stone jar
  of water straight over their own head and grinning about it; a farmer flat on their back in the one
  patch of bale-shadow, entirely on purpose, with a dog lying against them.
- ~4 MOVING THE HAY BY HAND: two farmers rolling a great drum of hay end over end with both palms flat
  on it and their shoulders right into it; a farmer hauling a bale upright against the stack with both
  arms round it, heels dug into the bristled floor.
- ~4 THE RAKE AND THE RIDGE: a farmer drawing a wooden hay rake along a combed ridge with the ridge
  building up ahead of the rake head; two farmers working towards each other along one ridge from
  opposite side edges of the picture, about to meet in the middle.
- ~3 THE BEAUTY SHOT: a farmer standing still in the middle of the cut with the whole air around them
  packed with drifting hay dust and loose seed heads, every speck of it hanging and turning; a
  farmer's shadow thrown enormously long right across the bristled floor from one side edge.

${GROUND_NOT_YOURS}

${SURFACE_LAW}

${MOTTO}

${AXIS_CLEAN}

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["handled"], "description": "..."}.
26-38 words per description — match the length of these examples exactly. No preamble, no numbering.

Examples:
[{"tags":["handled"],"description":"A farmer swings a full forkful of loose hay up over their own head onto a load already piled far too high, the forkful coming apart mid-arc and raining back down over them."},
{"tags":["handled"],"description":"Three farmers sit along a great drum of hay tipped on its side, using it as a sofa, passing a chipped stone jar of water between them while a dog sleeps against the twine."},
{"tags":["handled"],"description":"Two farmers roll a great drum of hay end over end across the pale bristled cut floor, both palms flat on the spiral face and their shoulders right into it, a wide flattened track behind them."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 4. THE CREW'S ACTION — gerund, implied subject, ZERO garment nouns
  // ───────────────────────────────────────────────────────────────
  {
    key: 'crew',
    outPath: path.join(SEEDS_DIR, 'farmbot_hay_crew.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HAYMAKING ACTIONS for a cozy countryside anime bot's new
high-summer path. Each entry is what the person in the frame is DOING right now, written as a GERUND
PHRASE with the subject left implied, because the path's template names the person separately
immediately above this line.

FORMAT: start with an -ing verb and nothing else. "Swinging a full forkful of hay...", "Leaning back
against a bale with...", "Walking the top of a heaped load with...". Never name the person, never use
a pronoun, never start with "A farmer" or "She" or "They".

⛔ ZERO GARMENT NOUNS, and this one is measured: an action axis that names a garment dresses every
render the same way and overrides the wardrobe axis entirely. On another bot, action seeds reading
"long captain's coat billowing" put a blue brass-buttoned naval coat on EVERY render regardless of
what the outfit pool rolled. So none of these words appears anywhere in this pool: hat, cap, shirt,
blouse, sleeve, apron, dungarees, overalls, trousers, skirt, dress, coat, jacket, waistcoat, scarf,
kerchief, neckerchief, glove, boot, shoe, sock, braces, belt, pinafore, smock, brim. A separate axis
owns the wardrobe completely. If you need the heat, say "forearms bare to the elbow" — never "sleeves
rolled", which names a sleeve.

⛔ AND NO REACTION-ONLY LANGUAGE. Measured on two bots: "gazing at", "watching", "looking out over",
"admiring", "surveying", "wide-eyed at", "standing nose-to-nose" all collapse into a static figurine
pose in the brief-writing pass. Every entry needs an ACTIVE VERB, a real OBJECT being acted on, and an
implied before-and-after — something is mid-happening and the body shows the effort or the ease of it.

THE WORK IS HARD AND HOT AND THIS FIELD IS IN A GOOD HUMOUR. Half the entries are effort and half are
the break — the water jar, the shade under a bale, sitting down hard, lying flat on a load. Nobody is
suffering and nobody is grim.

KEEP IT SHORT — 14-24 words each. These are single actions, not scenes.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~6 THE HEAVE: swinging a full forkful of loose hay up over the head onto a load already too high;
  pitching hay up to somebody standing on the load; hauling a great drum of hay upright against a
  stack with both arms round it; rolling a drum of hay end over end with both palms flat on it.
- ~5 THE RAKE: drawing a long wooden hay rake along a combed ridge with the ridge building ahead of
  the head; turning loose hay over with the back of a rake; sweeping the last of a ridge together
  with both hands; planting a two-pronged pitchfork upright in a soft heap and leaning on the handle.
- ~5 UP ON THE LOAD: walking the top of a heaped load with both arms out for balance; treading a load
  down flat with careful stamping steps; lying flat on the top of a finished load with both ankles
  crossed and the whole load shifting gently underneath; reaching down from the top of a load to take
  a forkful being passed up.
- ~5 THE BREAK (this is where the charm is): tipping a chipped stone jar of water straight over the
  head and laughing about it; drinking long from a tin can with the head tipped right back; sitting
  down hard on a bale tipped on its side and going nowhere; lying flat on the back in the one patch
  of bale-shadow, entirely on purpose; scratching a dog's ears without looking down at it.
- ~4 THE FIDDLY JOBS: knotting a length of twine round a bale and pulling it tight with a knee braced
  against the hay; picking loose hay out of the hair with both hands; tucking a stone jar of water
  into the shade underneath a bale where it will stay cool; shaking a fine haze of hay dust out of
  the hair with the head down.

${MOTTO}

${AXIS_CLEAN}

Output ONLY a JSON array of ${n} plain strings (no objects, no tags). 14-24 words each, each starting
with an -ing verb. No preamble, no numbering.

Examples:
["Swinging a full forkful of loose hay up over the head onto a load already piled far too high, the hay coming apart in the air",
"Tipping a chipped stone jar of water straight over the head and laughing about it, forearms bare to the elbow and streaked with hay dust",
"Drawing a long wooden hay rake steadily along a combed ridge with the ridge building up ahead of the rake head"]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 5. ★ THE LIGHT — the ONLY axis that owns time, weather and colour
  // ───────────────────────────────────────────────────────────────
  {
    key: 'light',
    outPath: path.join(SEEDS_DIR, 'farmbot_hay_light.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LIGHT AND AIR descriptions for a cozy countryside anime
bot's new HIGH SUMMER haymaking path. This is the ONLY axis on the path that owns the time of day, the
weather, the season and the colour of light — every other pool is deliberately silent on all four, so
these ${n} entries carry the whole palette of the path.

THE SEASON IS LOCKED: HIGH SUMMER, and it is HOT. Hay is only made in dry settled weather, so there is
no rain, no snow, no fog bank and no cold. What there IS: hard high sun, hazy heat, a low raking sun at
either end of the day, a big cool thunderhead stacked up on the far side of the field while the near
ground still burns, and the deep blue-violet shade down the far side of a bale.

⭐ TWO COMMITTED COLOURS IN VISIBLE OPPOSITION, IN EVERY SINGLE ENTRY, AND NAME WHAT EACH ONE IS ON.
This is measured on this bot: every render grading 4.1 or above had two committed opposed colours,
while the handful of entries that described light as EVEN produced every sober frame in the batch. So
"even", "evenly", "uniform", "diffuse", "flat light", "soft ambient", "ambient", "balanced",
"overcast", "dull" and "grey light" are BANNED AS DESCRIPTIONS OF LIGHT. Write instead: "a hot white
apricot laid right over the pale bristled cut floor, against the deep blue-violet shade down the far
side of the nearest bale". Roughly half the entries should pit a hot colour against a cool one; the
rest may oppose two hot colours of different temperature, or a saturated colour against a bleached one.

⭐ NAME THE LIT SURFACE FIRST. Light is never a solid object: called a shaft, beam, ray, column, pillar,
bar, wall, blade or curtain — or a sunbeam or a god ray — it renders as a literal solid standing in the
frame. A flat BAND of brightness laid across a NAMED SURFACE is the one safe shape. The named surfaces
available here are: the pale bristled cut floor, the standing wall of tall grass, the round flank of a
bale, the cut end of a bale, the plank side of a wagon, a combed ridge of raked grass, the hedge, the
dry-stone wall, the air itself.

⭐ THE BACKLIT HAY DUST IS THE PATH'S SIGNATURE IMAGE and roughly a third of the entries should carry
it: the whole air between the camera and a low sun packed with drifting hay dust and loose seed heads,
every speck of it lit hard, hanging and turning, thickest low down over the cut floor. Say the AIR IS
PACKED WITH LIT MOTES — never that light "streams" or "pours" or comes in "shafts".

⭐ LONG SHADOWS RAKE ACROSS THE PICTURE FROM ONE SIDE. They never run away from the camera toward a
point, because that is a vanishing-point instruction and this path's biggest structural risk is a
receding corridor. A bale's shadow is a long dark bar laid ACROSS the bristled floor toward one side
edge of the frame.

KEEP IT SHORT AND DENSE — 24-34 words each.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~6 THE LOW RAKING SUN with the air packed with lit hay dust (the signature shot) — hot honey and
  white-gold on the motes and the tops of the bales, against cool blue-violet or deep teal in the
  shade down their far sides and in the flattened grass.
- ~5 HARD HIGH HEAT: a bleached white-gold laid flat over the whole bristled floor, the shade under a
  bale a hard-edged pool of deep indigo, the standing grass a saturated green that has not given in
  yet, the air shimmering low over the cut.
- ~4 THE THUNDERHEAD (the drama, and it must stay committed, never overcast): a great cool
  blue-and-pewter stack piled up beyond the far hedge while the near cut floor still burns hot apricot
  and the bale flanks glow, the two colours meeting at the standing wall.
- ~4 THE LONG SHADOW: every bale laying a long dark bar of cool indigo right across the pale bristle
  toward one side edge, the lit strips between them hot amber, the whole surface striped and raking.
- ~3 THE FIRST AND LAST HOUR: a level rose-gold coming in low along the cut and catching the furred
  loose ends of every bale so they burn pale, against the cool grey-green depth still held inside the
  hedge and the standing grass.
- ~3 THE AIR ITSELF: a thick hazy heat sitting over the whole field so the far hedge goes soft lavender
  while the near bristle stays hard bright straw, hay dust hanging low in a fine bright veil.

Output ONLY a JSON array of ${n} plain strings (no objects, no tags). 24-34 words each. No preamble,
no numbering.

Examples:
["A low raking sun packs the whole air over the cut floor with drifting hay dust, every speck lit hard white-gold and turning; the far side of the nearest bale holds a deep blue-violet shade, and its shadow lies as a long cool bar right across the pale bristle toward the side edge.",
"A bleached hot white-gold lies flat over the bristled cut floor and the shade beneath a bale is a hard pool of deep indigo; the standing wall of tall grass keeps a saturated green, and the air shimmers low over the whole surface.",
"A great cool blue-and-pewter thunderhead stacks up beyond the far hedge while the near cut floor still burns hot apricot and the round flanks of the bales glow honey; the two colours meet along the standing wall of grass."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

(async () => {
  const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const selected = only.length
    ? RECIPES.filter((r) => only.some((o) => r.key.includes(o)))
    : RECIPES;
  if (!selected.length) {
    console.error(`No recipe matched ${JSON.stringify(only)}. Keys: ${RECIPES.map((r) => r.key).join(', ')}`);
    process.exit(1);
  }
  for (const recipe of selected) {
    console.log(`\n━━━ ${recipe.key} → ${path.basename(recipe.outPath)} ━━━`);
    await generatePool(recipe);
  }
  console.log('\n✓ done');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
