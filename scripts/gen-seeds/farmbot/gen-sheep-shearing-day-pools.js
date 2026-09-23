#!/usr/bin/env node
/**
 * FarmBot — sheep-shearing-day bespoke pools (5 Sonnet-seeded axes).
 *
 * The path's 6th axis (`shearing_animal`, the gated farm-animal cameo) is
 * HAND-AUTHORED JSON — see the path file's header. Do not add it here.
 *
 * ━━━ THE PATH'S IDENTITY AND THE DULL FAILURE IT EXISTS TO AVOID ━━━
 * The obvious shearing render is A MAN BENT OVER A SHEEP IN A DIM SHED — a
 * documentary photograph, sober, brown, competent, forgettable. Every pool
 * below is written so that render is structurally impossible. The delight here
 * is that A NEWLY-BARE SHEEP IS INHERENTLY FUNNY and that almost nobody has
 * ever stood inside a shed on the day: the whole wool coat peeling off in one
 * unbroken blanket with a hand lifting its edge clear; a just-shorn sheep
 * standing beside an unshorn one at visibly half the width and plainly
 * outraged about it; a heap of wool higher than the shoulder of the person
 * forking at it; a dozen woolly ones packed in the holding pen all facing the
 * same way, next in line and knowing it; the shorn ones going flat out back
 * into the field like school has let out; a barn cat asleep deep in a half-
 * full bundle of wool, deeply committed; a sheep standing on the bale stack it
 * should not be on; a mug forgotten on a rail with wool stuck to it.
 *
 * ━━━ SCOPE FENCE (both directions) ━━━
 * `lambing-season` is a separate LIVE path on this bot and it was already
 * fenced against this one (no shears, no clippers, no wool being rolled, no
 * wool sack, no shorn sheep anywhere in its six pools). So this path returns
 * the favour and is fenced against IT: NO lambs, NO newborns, NO heat lamps,
 * NO lambing pens, NO crates, NO bottle feeding, NO udders or nursing, NO
 * birth register of any kind. Every sheep in these pools is a grown sheep.
 *
 * ━━━ THE SEVEN LAWS BAKED IN AT THE SOURCE ━━━
 * Each is a documented, render-costing bug (BOT_SCENE_QUALITY_PLAYBOOK.md
 * cross-bot lessons 13/14/15/22/26/28/30/31/43/44). They live in the
 * meta-prompt TEXT, not just the generated JSON, so a future append run cannot
 * reintroduce them.
 *
 *  1. ⛔ BLADES NEAR AN ANIMAL + ANY RED-BROWN WORD = BLOOD (lesson 31,
 *     measured on THIS BOT). On `lambing-season` round 2, "a faded blue gate
 *     on a rope hinge, rust-orange hinges showing at the post" rendered two
 *     bright wet orange-red runs streaking down the gate post AND down the
 *     crook beside it. On a path that has hand shears, a wrestled animal and
 *     freshly-bared skin, that is far worse than on a lambing path. So the
 *     whole red-brown family is banned outright at the recipe, worn steel is
 *     "worn silver-bright", and the injury register is banned as a register:
 *     no nick, no cut skin, no graze, no wound, no sore, no raw patch, no
 *     blood, no red mark on any animal. Shearing is stated POSITIVELY as a
 *     HAIRCUT throughout: the bared skin is clean, pale and even, like a new
 *     haircut, and everybody in the shed is in a good humour about it.
 *  2. ⚖️ SCALE TRACKS THE COUNT, AND NO SUBJECT GETS A DETAIL EXEMPTION
 *     (lesson 13 AND its 2026-09-23 correction, both measured on this bot's
 *     own apiary path). A low count is the giant-animal generator. And the
 *     correction is the sharper half: "detail on the nearest one or two only"
 *     IS ITSELF THE INFLATOR — 20 of 30 apiary entries welded a correct ruler
 *     and then added a close anatomy clause for the nearest one, and the
 *     anatomy beat the ruler every time; stripping the exemption took giant
 *     bees 3 of 5 to 0 of 6 and that path 3.86 to 4.37. So: every entry names
 *     a real COUNT, rules the sheep against something IN FRAME welded to a
 *     larger structure, and gives NO sheep a close-up anatomy clause — not
 *     even the nearest. The one you describe most is the one that comes out
 *     biggest.
 *  3. 💡 AN INTERIOR'S LIGHT SOURCE MUST EXIST INSIDE THE ROOM (lesson 30,
 *     measured on THIS BOT). `lambing-season`'s three flattest, palest renders
 *     were all shed interiors that had rolled an OUTDOOR light entry ("hard
 *     midday sun", "a cold clear dawn") — which a shed cannot show, so Flux
 *     rendered flat ambient daylight and the palette went pale. Retagging them
 *     and adding in-frame sources moved shed renders 3.60 to 3.98 in one
 *     round. This path is ~70% shed, so the rule is absolute: every `shed`
 *     light entry names a source the shed itself contains and says what its
 *     light LANDS ON. And the second half of that measurement: the ~4 entries
 *     describing light as EVEN produced every sober frame, while every render
 *     at 4.1 or above had TWO COMMITTED COLOURS IN VISIBLE OPPOSITION. So
 *     "even", "uniform", "diffuse", "flat" and "soft ambient" are banned AS
 *     DESCRIPTIONS OF LIGHT and two opposed colours are required per entry.
 *  4. 📝 WOOL IS A TEXT TRAP, AND FILLING ONE SURFACE MIGRATES THE LETTERING
 *     (lessons 12/26/27 + lesson 51, measured on MangaBot today). Wool sacks
 *     carry stencilled brands and a shearing shed's real prop list includes a
 *     chalk tally board — both are TEXT-SHAPED, and a text-shaped surface
 *     cannot be described safely, only removed (lesson 12). But deleting is
 *     not enough, because an ABSENCE gets backfilled (lesson 27), and filling
 *     one surface just migrates the lettering to the nearest remaining
 *     unfilled strip (lesson 51) — so on a subject with several such surfaces
 *     you must shrink the total text-bearing AREA in frame. Three levers, all
 *     needed: (a) DELETED from every layer — tally board, chalk board, pen
 *     board, stencilled sack, printed sack, label, sign, clipboard, notebook;
 *     (b) the positive replacement CARRIES THE INTEREST (lesson 14/26) — wool
 *     is stored as loose bound bundles tied with twine and as an open heap,
 *     and every flat panel names a real object hanging on it; (c) the framing
 *     block CROPS (lesson 52 — a framing law is a text fix, because a cropped
 *     near wall shows two flat panels where a receding shed shows twelve).
 *  5. 🗣️ SHEARING'S OWN JARGON IS A CONFIDENT WRONG PRIOR (lesson 28, and
 *     lesson 47 for the premise noun). A layperson pictures a different object
 *     for nearly every term this trade uses, and `board` and `comb` are
 *     already documented offenders on other bots. Banned as words with plain
 *     replacements written out: board (the shearing floor sense), comb,
 *     cutter, down-tube, crutch, crutching, belly wool, catching pen, wether,
 *     hogget, dag, dags, skirting (a skirting board!), classing, blow, long
 *     blow, roustabout, presser, bale press, wool table, cast. And the premise
 *     noun itself: FLEECE READS AS A POLYESTER FLEECE JACKET — this bot's own
 *     seeds already contain "a short brown fleece back-panel vest" and "a
 *     striped fuzzy fleece body-wrap". So the Flux-facing noun is WOOL
 *     throughout (lesson 47's cloud-to-mist move); "fleece" is allowed only in
 *     the form "one whole fleece of wool", never bare.
 *  6. 🚫 PER-OBJECT AGENCY ON A CLUSTER PERSONIFIES IT (the lakeside
 *     river-stones bug on this bot). A pen of sheep IS a cluster. Describe the
 *     mass holistically — a loose uneven mob, one member set apart — never as
 *     a list of individual actions and never in a row or a line.
 *  7. 🎭 A NAMED ACTION WITH NO NAMED ACTOR RENDERS THE BODY PART ALONE
 *     (lesson 25, measured twice in the 2026-09 run). Every moment entry leads
 *     with the animal or the shearer DOING it as the grammatical subject.
 *
 * ━━━ AXIS-CLEAN DISCIPLINE ━━━
 * `shearing_light` owns time of day, weather, season and the colour of light.
 * NO other pool may name any of the four (EarthBot LESSON 4 / the 2nd
 * look-register amendment). The ONE allowance, stated in the hero recipe: an
 * entry may say wool motes or chaff are up in the air, and may say the grass
 * is wet, because those are the literal subject of those shots — never when,
 * in what weather, or in what colour.
 *
 * ━━━ LESSON 44 ━━━
 * A law omitted from ONE axis is the axis that breaks it, and satellite axes
 * inherit vocabulary from the recipe's own EXAMPLES. So the SCALE law rides on
 * every pool that can name a sheep (moment, crowd, dressing, craft, light),
 * not just the crowd pool that owns it, and every example below anchors its
 * ruler on a GENERIC structure ("the hurdle rail", "the shed doorway") rather
 * than on a specific prop one axis would then import into another.
 *
 * Run:  node scripts/gen-seeds/farmbot/gen-sheep-shearing-day-pools.js
 *       node scripts/gen-seeds/farmbot/gen-sheep-shearing-day-pools.js moment light
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

// Shared ban block — appended to every recipe so one edit fixes all five and
// no recipe can silently drift off the law list in the header above.
const BANS = `🚫 STRICT BANS (every one is a documented, render-costing failure on this bot or its siblings):

- NO READABLE TEXT of any kind and NONE of its synonyms: no label, no lettering, no writing, no words, no numbers or numerals, no mark/marks/marking, no glyph, no sigil, no stamp or stamped or stencil or stencilled, no printed sack, no branded sack, no engraving, no etching, no inscription, no script, no plaque, no sign or signage, no chalk board, no chalkboard, no tally, no tally board, no pen board, no notched record, no ear tag or tag of any kind, no clipboard, no notebook, no ledger, no written record, no price, no weight written anywhere. Instead, every flat surface — a hurdle rail, a bale end, the shed door, the yard gate, a bucket side, a wall panel — is described POSITIVELY as one of: plain smooth weathered timber silvered by age; painted one flat single colour; or CARRYING a real object (a coiled rope on a nail, hand shears hanging by their bow, a galvanised bucket on its handle, a halter looped over the rail, a besom broom stood in the corner, a leaning stack of spare hurdles, a hank of twine, a kettle and two enamel mugs on a shelf, a coat over the back of a chair, a heap of loose wool).

- WOOL IS NEVER STORED IN A PRINTED OR STENCILLED SACK. A sack is text-shaped and any description of it is a summons, so the storage forms are: a loose open HEAP of wool; a BOUND BUNDLE of wool tied round with twine; a plain open-topped wooden crate with wool spilling over the rim; wool piled straight onto a swept plank floor.

- ⛔ NO RUST AND NO RED-FAMILY COLOUR ANYWHERE, ON METAL, TIMBER, SKIN OR WOOL. Measured on this bot's lambing path: "rust-orange hinges showing at the post" rendered two bright wet orange-red runs streaking down the post and down the crook beside it, which on an animal path reads unmistakably as blood. Banned outright: rust, rusted, rust-orange, rusty, corroded, crimson, scarlet, maroon, dark red, deep red, blood-red, oxblood, ruddy, ochre-red. Worn iron is "worn silver-bright" or "gone chalky grey".

- ⛔ NO INJURY REGISTER AT ALL. This is a path with blades on it, so this ban is absolute: no blood, no nick, no nicked, no cut skin, no graze, no scrape, no wound, no sore, no raw patch, no red patch, no pink patch of skin, no bandage, no ointment, no flinch of pain, no struggle, no distress, no panic, no fear, no restraint, no pinning down, no medical or veterinary register of any kind. SHEARING IS A HAIRCUT AND THIS SHED IS IN A GOOD HUMOUR. Stated positively and required wherever bared skin appears: the newly-bared coat is CLEAN, PALE CREAM, CLOSE AND EVEN, exactly like a fresh haircut, with the face and the lower legs left woolly so the animal looks like it is wearing socks.

- ⛔ BANNED TRADE JARGON — every one of these makes a layperson (and the model) picture a different object, which renders CONFIDENTLY wrong. Use the plain replacement: "board" for the shearing floor (say THE SWEPT PLANK FLOOR); "comb"; "cutter"; "down-tube"; "crutch" or "crutching"; "belly wool"; "catching pen" (say THE HOLDING PEN); "wether"; "hogget"; "dag" or "dags" (say A MUDDY TUFT); "skirting"; "classing"; "blow" or "long blow"; "roustabout"; "presser"; "bale press"; "wool table"; "cast" (of a sheep). ("Wall boards" and "boarding" as the shed's CONSTRUCTION are fine and encouraged — it is only "the board" as the floor that is banned.)

- ⛔ THE WORD "FLEECE" IS NEVER USED BARE. It reads as a polyester fleece jacket — this bot's own costume pools already contain "a short brown fleece back-panel vest". Write WOOL, or THE WOOL COAT, or THE WHOLE WOOL COAT COMING OFF IN ONE BLANKET. The only legal form containing the word is "one whole fleece of wool".

- ⛔ THE LAMBING FENCE. A separate live path on this bot owns the birth register entirely, and it was already fenced against this one. So: NO lamb, NO lambs, NO lambing, NO newborn, NO heat lamp, NO lambing pen, NO crate of young, NO bottle feeding, NO udder, NO nursing or suckling, NO birth, NO twins, NO ewe-and-young pairing. Every sheep in these pools is a GROWN sheep.

- NO metaphorical object-noun standing in for light ("coins of light", "ribbons of gold", "curtain of diamonds", "scattered gems", "confetti of light") — figurative light language renders as the literal object.

- LIGHT IS NEVER A SOLID OBJECT. Measured across three bots: light called a "column", "pillar", "shaft", "beam", "ray", "bar", "wall" or "curtain" renders as a literal solid column or spotlight cone standing in the room. NAME THE LIT SURFACE FIRST and let the light be what is ON it: "the swept floor is laid over with a hot apricot band", not "a shaft of apricot light falls on the floor". A flat BAND of brightness across a named surface is the one safe shape.

- NEVER pair "dark"/"darkness"/"shadow" with a light word ("glint", "sparkle", "shimmer", "luminous", "glow") describing the SAME thing in the same phrase. Describe a shaded patch plainly, with no light word attached in the same breath.

- NEVER put a glow, an ember, a coal or a light INSIDE or WITHIN a small dark opening — not in a gap between boards, a slot, a crack, a vent, a doorway or a hole. Measured on this bot: the model transplants that glow onto the nearest dark aperture and paints a furnace burning inside it. A lamp is named as a LAMP hanging in plain sight and its light is always described as LANDING ON a named surface.

- NO named or implied people: no figures, crowd, visitors, onlookers, bystanders, children, kids, laughter, voices, faces, hands, footprints. (The ONE exception is the shearer-craft pool, which is explicitly written as an action with an implied subject, and the "handled" hero entries, which must name THE SHEARER as a whole figure.)

- NO negation phrasing inside an entry ("no wool left", "not a single..."). Describe only what IS present.

- NO commercial or industrial scale: no shed of eight hundred sheep, no gang of eight shearers in a line, no pallets, no forklift, no conveyor, no machinery hall. A small, personal, hand-tended flock and one or two people at most.

- NO GIANT OR OVERSIZED SHEEP, no sheep standing upright on two legs, no sheep holding or carrying an object, NO FACE OR EXPRESSION DRAWN ONTO a sheep, a bucket, a bale or any other object. Every animal keeps its own true-to-life animal head, muzzle and eyes. A sheep may look comically indignant only through its POSTURE and its EARS, never through a drawn cartoon face.

- NO LONE SINGLE SHEEP as the whole subject of an entry. A single named animal with nothing to compare it to renders at giant scale on this model. Every entry names at least TWO sheep, or states one sheep's height against a named piece of the pen or the shed.

- NO OFF-CAMERA SIZE COMPARISON. A size comparison must name something actually IN THE FRAME and welded to a larger structure: a hurdle's bottom or second rail, the top of a straw bale, the height of the shed doorway, the top of the yard gate, the swept plank floor the animal stands on. ⚠️ THE HAND IS A REPEAT OFFENDER AND IS BANNED IN EVERY FORM IT KEEPS COMING BACK IN — it was banned in this block from the first run and was still independently re-derived SEVEN times across two generations of these pools, which is why it is now spelled out: no "a hand below", no "by a hand's width", no "with a hand to spare", no "a hand's breadth", no "hand-sized", no "the width of a hand", no "the size of a thumb", no "a finger-width". There is no hand in most of these frames, so it measures nothing — and on a bot that bans uninvited people it also drops a stray human noun into an animal pool. Also banned for the same reason: "the size of a dog", "the size of a cat", "knee-high" and "chest-high" with no knee or chest in frame. Say "well below", "just clearing", "level with" or "a clear margin below" and name the RAIL.

- NO FORMATION OR ROW WORDING FOR ANIMALS OR OBJECTS. Measured across three bots: "in a single line", "single file", "in a column", "in a row", "evenly spaced", "each progressively smaller", "one on each side", "one on either side" all render as a mirrored composition or as the subject tiled to a vanishing point. Write a group of animals as a LOOSE UNEVEN MOB spread across the frame with one member set apart from it, never as a symmetrical arrangement. ⚠️ THIS BAN DOES NOT APPLY TO THE SHED'S OWN ENCLOSING SURFACES: "the shed's own walls close the frame down both sides and its roof closes it overhead" is the REQUIRED enclosure law (an interior whose enclosing surfaces are described only by adjective renders as a diorama in a void, and camera words do not fix it), and a sweep hit on "both sides" in a dressing entry is that law working as designed — do not purge it.

- NO brand names, NO camera or photographer names, NO obscure named sheep breeds — plain descriptive language only ("a blocky black-faced sheep", "a broad cream-woolled sheep", "a speckle-nosed sheep").`;

// The scale law — rides on EVERY pool that can name a sheep (lesson 44), and
// carries the 2026-09-23 correction: NO detail exemption for anybody.
const SCALE_LAW = `⚖️ THE SCALE LAW (non-optional in every entry that names a sheep — this is the single most expensive failure on animal paths on this bot):
A sheep is a modest, chest-high animal, and on this model SIZE TRACKS THE COUNT, not any size word you write. A low count is the giant-animal generator, because the model hands each named subject a share of the frame. So every entry that names sheep must do BOTH of these:
  (a) NAME A REAL COUNT — "two", "three", "a pen of eight", "a dozen", "twenty or so packed shoulder to shoulder" — and never a lone single sheep as the entry's whole subject.
  (b) RULE THEM against something IN FRAME that is welded to a larger structure — a hurdle's bottom or second rail, the top of a straw bale, the height of the shed doorway, the top of the yard gate, the swept plank floor underfoot. For example: "their backs come level with the second hurdle rail", "the pen of them together fills less of the shed than the doorway is wide", "the shorn one's back sits a hand below the top rail its woolly neighbour's shoulder clears".
⛔ AND THE CORRECTION THAT MATTERS MOST, measured on this bot's own apiary path over 30 entries and two rounds: GIVE NO SHEEP A DETAIL EXEMPTION. Do NOT write "the nearest one showing its..." or "detail on the closest animal". Twenty of thirty entries there welded a correct ruler and then added a close anatomical clause for the nearest subject — and the anatomy beat the ruler every single time, producing hand-sized bees at exactly the rate the clause appeared. Stripping the exemption took the defect from 3 of 5 renders to 0 of 6 and lifted the whole path from 3.86 to 4.37. So every sheep in every entry is a clean, correctly-sized shape, INCLUDING the nearest one. THE ONE YOU DESCRIBE MOST IS THE ONE THAT COMES OUT BIGGEST.
✅ The ONE thing that is deliberately allowed to be BIG is the WOOL HEAP, because a mountain of wool is one of this path's best shots — but it too must be RULED so that big reads as big rather than as confusing: "a heap of wool higher than the shoulder of the person forking at it", "a heap spilling past the bale it is piled against and out over the plank floor".`;

// The bare-body law — this path's comedy engine, and the ROUND 2 REWRITE.
//
// ⚠️ WHY THIS LAW WAS REWRITTEN AFTER ROUND 1, AND IT IS THE PATH'S BIGGEST
// MEASUREMENT. Round 1 shipped a shorn-sheep law worded as "just-shorn sheep,
// pale cream and close-cropped, narrow and knock-kneed, at half the width of
// the woolly ones". It was present in 6 of 6 EMITTED PROMPTS, in three
// separate layers including the required output order, and it rendered in
// 0 OF 6 — every animal in every render came back in full wool. The path's
// entire premise and its only joke were absent from the whole batch.
//
// The diagnosis is cross-bot lesson 48, NOT lesson 33's model fact (and a
// model probe was not available anyway: FarmBot is locked to flux-2-flex and
// widening `allowedModels` needs Kevin's sign-off). Lesson 48 measured that a
// SPECIES NAME DOES NOT CARRY ITS MODIFIER AND AN ADJACENT MODIFIER DOES NOT
// SAVE IT — cream stanhopea rendered pink, green cymbidium rendered pink,
// egg-yellow maxillaria rendered pink, because the genus token out-voted the
// colour word sitting right next to it every single time. Here the token is
// `sheep`, whose wool prior is about as strong as a prior gets, and — this is
// the part that made the round-1 wording worthless — EVERY ADJECTIVE IT USED
// IS ALSO TRUE OF A WOOLLY SHEEP. A woolly sheep is pale cream. A woolly sheep
// can be called narrow. "Close-cropped" reads as hair length on an animal
// already covered in it. Not one of those words is INCOMPATIBLE with wool, so
// none of them could beat the prior.
//
// So the rewrite follows lesson 48's prescription — SURFACE AND SHAPE FIRST,
// SPECIES LAST — and adds the thing round 1 lacked: vocabulary that a woolly
// animal CANNOT satisfy. "Stubble" is a haircut word and is incompatible with
// fluff. "Slim and leggy as a young goat" borrows the SHAPE PRIOR OF AN ANIMAL
// THAT HAS NO WOOL, which is a far stronger lever than any adjective. "No
// wider than its own head" is a ruler that forces narrowness instead of
// asserting it. And the woolly cap and cuffs are kept because they are both
// the funniest detail and a positive statement of where wool IS, which is how
// you say "bare everywhere else" without a negation CLIP cannot use.
// NOTE the deliberate colour restraint: the bared body is CREAM or IVORY and
// never PINK, because pink on bare skin beside blades is the blood trap in
// trap 1 wearing a different hat.
const SHORN_LAW = `🐑 THE BARE-BODY LAW (this path's comedy engine, and its single most important sentence):
A newly-bare sheep is inherently funny, and that is the whole reason this path exists. But it is also the hardest thing on the path to actually render, and here is the measurement: a first round described them as "just-shorn sheep, pale cream and close-cropped, narrow, at half the width of the woolly ones", that wording reached 6 of 6 emitted prompts, and it rendered in 0 OF 6 — every animal came back in full wool. The reason is that EVERY ONE OF THOSE WORDS IS ALSO TRUE OF A WOOLLY SHEEP. A woolly sheep is pale cream. A woolly sheep can be narrow. "Close-cropped" just reads as hair length. None of them is INCOMPATIBLE with wool, so none of them could beat the model's overwhelming woolly-sheep prior.
⭐ AND THE ROUND-3 FINDING, WHICH IS THE ONE THAT ACTUALLY SOLVED IT — measured 0 of 6 (round 1) → 1 of 6 (round 2) → 5 of 6 (round 3), one variable per round. Round 2's "clipped right down to smooth cream stubble with NO FLUFF ON THE BODY ANYWHERE" only reached 1 of 6, and the reason is visible in what DID land: the ADDITIVE half of that same clause — "woolly cuffs still at the ankles" — rendered in 6 OF 6, every round, unmistakably. The model will happily ADD wool to a named place and will not SUBTRACT it, because every phrasing of "bare" is a subtraction from the prior and CLIP does not subtract. So stop describing an absence and NAME A POSITIVE OBJECT: the bared one is AN ENTIRELY DIFFERENT ANIMAL — "a smooth cream body SHAPED LIKE A GREYHOUND, narrow as its own head, up on long bare legs, WEARING a thick woolly HAT and four thick woolly SOCKS". Three things carry it, and all three are additive: a borrowed SHAPE prior from an animal that has no wool; a HAT and SOCKS the model can happily put ON something; and the ODD-ONE-OUT framing (one or two of them, set against a named majority of barrel-round woolly ones), which both renders that worked in round 2 also had. "Hat" and "socks" beat "cap" and "cuffs" — plainer, funnier, and more visually distinct.
⚠️ The one cost of the greyhound anchor, so you know what you are buying: it occasionally pulls a little GOAT anatomy with it (one round-3 render gave two background animals curled horns, which rams do have, so it is not a hard fail). If that ever becomes a problem the lever is to swap the shape anchor to a non-horned one, not to weaken it.

Write the bare ones SURFACE AND SHAPE FIRST, using only words a woolly animal CANNOT satisfy:
  • THE BARE ONES: the body CLIPPED RIGHT DOWN TO SMOOTH CREAM STUBBLE with no fluff on it anywhere, SLIM AND LEGGY AS A YOUNG GOAT, no wider than its own head, with a THICK WOOLLY CAP still on the head and THICK WOOLLY CUFFS still at the ankles so it looks like it is wearing a hat and socks — and its ears out sideways in an attitude of total personal outrage.
    Use "clipped bare", "clipped down to stubble", "smooth-bodied", "bald-bodied", "stubbly", "velvet-smooth" freely. The SHAPE comparison to a goat or a greyhound is the strongest single lever available, because it borrows the shape prior of an animal that has no wool — use one in most entries. The bared body is CREAM or IVORY and NEVER pink or red.
  • THE WOOLLY ONES: the coat grown out deep and dense and dusty at the tips, parting down the spine, so thick the legs look improbably short, ROUND AS A BARREL, reading as a solid rounded block with a head on it.
  • THE CONTRAST is the money shot: a clipped-bare one standing right beside a full-woolled one, TWICE its width, both apparently aware of the difference.
At least eight entries in this pool must put a clipped-bare animal and a woolly animal IN THE SAME FRAME, because the joke does not exist without both, and each of those must state the width difference as a comparison between the two bodies in frame. And the indignation is always carried by POSTURE and EARS — never by a drawn cartoon face on an animal.`;

const RECIPES = [
  // ───────────────────────────────────────────────────────────────
  // 1. ★ THE SIGNATURE MONEY-SHOT AXIS — the beat happening NOW
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_moment.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SHEARING-DAY MOMENTS for a cozy countryside anime
bot's new path. Each entry is ONE beat happening RIGHT NOW — either inside a small working shearing
shed in full swing, or out in the yard and pens just outside it — with the ANIMAL OR THE SHEARER
THAT IS DOING IT NAMED FIRST as the grammatical subject, immediately followed by the action it is
caught mid-way through.

THE BAR: this has to be playful, adventurous, vivid, beautiful and CLEVER — something people have
never looked at closely, or something familiar redressed as far more interesting. A man bent over a
sheep in a dim brown shed is the FAILURE: sober, competent, documentary, forgettable. Every entry
must be a moment you would stop scrolling for and want to tell somebody about.

NAME THE ACTOR. An action with no named actor renders as a disembodied body part on this model (a
cup "held out from the next deck" drew a giant floating hand and forearm, duplicated at two scales).
So never write "a wool coat being lifted clear" — write "a sheep's whole wool coat peels away in one
unbroken blanket as the shearer lifts its edge clear".

LEAD WITH AN ACTIVE VERB AND A SHARED OBJECT, AND BAN REACTION-ONLY LANGUAGE. Measured on two bots:
"gazing at", "watching", "looking at each other", "wide-eyed at", "standing nose-to-nose" all
collapse into a static figurine pose in the brief-writing pass. Every entry must carry four things:
an active verb, an implied before-and-after, a body-language reaction, and a real object or event
the animals are responding to.

ONE CHARM DETAIL PER ENTRY — a small clever specific the eye finds on second look, and it must make
it THAT moment and no other: an enamel mug forgotten on the top rail with wool stuck all round its
base; a besom broom left standing in a drift of loose wool; a scrap of twine looped round a hurdle
post gone furry from being chewed; a wisp of wool caught on every nail head down the wall; one sheep
with a single ragged tuft still left on its rump; a swept plank floor polished pale by years of
feet; a hank of twine hanging off a nail with one end pulled out and trailing; a bucket mended at
the handle with wire; a sheep that has got its whole head through a hurdle and cannot work out how
it happened.

VARIETY MANDATE — distribute the ${n} entries across these families. TAG each entry with its
setting, "shed" or "yard":
- ~4 THE WHOLE COAT COMES OFF IN ONE PIECE (shed): a sheep's entire wool coat peeling back off it in
  one unbroken blanket, still joined along the spine, the shearer's free hand lifting its edge clear
  of the plank floor; two more sheep waiting behind the hurdle watching it happen.
- ~4 THE OUTRAGE (shed or yard): one clipped right down to smooth cream stubble, goat-slim and no
  wider than its own head, standing beside a barrel-round woolly neighbour twice its width with its
  ears out sideways in total personal outrage; three stubbly ones stood together plainly comparing
  notes; a stubbly one turning to inspect its own narrow flank and finding less of itself than
  expected.
- ~3 THE WRESTLE (shed): a sheep and the shearer both plainly losing at once, the sheep sat up on
  its haunches against the shearer's knees with all four feet off the floor and an expression of
  dignified resignation, two others craning over the hurdle to watch.
- ~3 THE WOOL MOUNTAIN (shed): a heap of wool higher than the shoulder of the shearer forking at it,
  spilling past the bale it is piled against and out across the swept plank floor; a whole wool coat
  thrown out flat over the heap and settling like a dropped blanket.
- ~3 THE RELEASE (yard): a loose uneven mob of a dozen clipped-bare stubbly goat-slim ones going
  flat out back into the field like school has let out, spread wide and bunching as they wheel at
  the wall, one already peeled off sideways on its own.
- ~3 THE QUEUE (shed or yard): twenty or so woolly sheep packed shoulder to shoulder in the holding
  pen, every one facing the same way, watching the one on the plank floor with the air of animals
  who know exactly what is coming and in what order.
- ~2 THE ONE THAT ESCAPED (shed or yard): a sheep standing square on top of the bale stack it should
  not be on, surveying the whole shed; a sheep standing in the open heap of wool up to its knees,
  entirely satisfied with itself.
- ~2 THE INTERRUPTION (shed): a barn cat asleep deep in a half-full bound bundle of wool, only its
  ears showing, deeply committed; a hen that has walked in and is standing in the drift of loose
  wool turning it over.
- ~1 THE PARTING SHOT (yard): one clipped-bare and goat-slim stopping dead in the yard gateway to
  look back at its own wool coat lying on the plank floor behind it, with the rest of the mob piling
  into its back end.

ALSO TAG each entry "handled" or "standalone":
- "standalone" — the animals and the wool do everything; no person is implied anywhere in the
  sentence. AT LEAST ${Math.round(n * 0.68)} of the ${n} entries must be "standalone", and the
  standalone set must ON ITS OWN still read unmistakably as shearing day: the wool heap, the shorn
  pen, the coat lying where it came off, the queue, the release, the escape.
- "handled" — the moment genuinely needs a person in it (the coat lifted clear, the wrestle, the
  forking). When you write one of these, NAME THE WHOLE FIGURE as "the shearer" — never a bare hand,
  arm, boot, knee or lap on its own, which renders as a floating body part.

${SCALE_LAW}

${SHORN_LAW}

AXIS-CLEAN — CRITICAL: this pool must contain ZERO time-of-day words, ZERO weather words, ZERO
season-naming words and ZERO colours of light (no "golden", "afternoon", "morning", "dawn",
"sunset", "dusk", "night", "misty", "rainy", "overcast", "warm light", "cool light"). A separate
axis owns all of that and a time-of-day word here directly contradicts it. You MAY say wool motes or
chaff are up in the air, and you MAY say the grass is wet, because those are the literal subject of
those shots — but never say when, in what weather, or in what colour.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"yard", "standalone"|"handled"], "description": "..."}.
30-42 words per description. No preamble, no numbering.

Examples:
[{"tags":["shed","handled"],"description":"A sheep's whole wool coat peels back in one unbroken blanket as the shearer lifts its edge clear of the swept plank floor, while two woolly ones crane over the hurdle to watch, their backs level with its second rail."},
{"tags":["yard","standalone"],"description":"Three clipped right down to smooth cream stubble, slim and leggy as young goats, stand beside two barrel-round woolly ones twice their width, ears out sideways in total outrage, woolly caps still on their heads and woolly cuffs at their ankles; a mug sits forgotten on the top rail, wool stuck round its base."},
{"tags":["shed","standalone"],"description":"A heap of wool spills past the bale it is piled against and out over the plank floor, higher than the hurdle gate beside it, one whole coat thrown flat across the top of it and still settling."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 2. THE FLOCK — the co-lead, the comedy, and the SIZE RULER
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_flock.json'),
    total: 25,
    batch: 40,
    // ⚠️ append:false ON PURPOSE — this is the ONE pool regenerated from
    // scratch in round 2, because every one of its 25 round-1 entries carried
    // the wool-compatible wording measured at 0 of 6 renders (see THE
    // BARE-BODY LAW above). Nothing in the round-1 set was worth keeping.
    // Flip back to append:true before any future top-up run.
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FLOCK descriptions for a cozy countryside anime bot's
sheep-shearing path. Each entry is THE CROWD OF SHEEP in the frame — how many, how woolly or how
bare, how they are massed, and what their collective attitude is. On this path the sheep are
CO-LEADS with the person, not props, and this axis is also the in-frame RULER that fixes how big a
sheep actually is.

THIS POOL DOES THREE JOBS AT ONCE AND ALL THREE ARE REQUIRED IN EVERY ENTRY:
  1. THE CO-LEAD. They get real collective character: placid, nosy, deeply suspicious, resigned,
     packed in and shoving, all turning to face the same way at once, chewing steadily through the
     entire performance, unbothered by anything.
  2. THE COMEDY. A newly-bare sheep is inherently funny and the contrast with a woolly one is this
     path's best shot. At least EIGHT entries must put shorn and woolly animals in the SAME frame.
  3. THE RULER. A real COUNT plus a height ruled against a named piece of the pen or the shed.

KEEP IT SHORT AND DENSE — 18-28 words each, not paragraphs. Every word earns its place.

VARIETY MANDATE across the ${n} entries:
- ~7 THE CLIPPED-BARE ONES: a pen of eight or ten clipped right down to smooth cream stubble with no
  fluff on them anywhere, slim and leggy as young goats, none wider than its own head, each with a
  thick woolly cap still on the head and thick woolly cuffs still at the ankles.
- ~5 THE WOOLLY ONES: a dozen or twenty still in full coat, grown out deep and dense and dusty at
  the tips, parting down the spine, round as barrels, so thick their legs look improbably short —
  solid rounded blocks with heads on them.
- ~9 THE CONTRAST (the money shot): clipped-bare and full-woolled standing together, the bare ones
  stubbly and goat-slim beside barrel-round woolly ones TWICE their width, both sides apparently
  aware of it. Every one of these must state the width difference as a comparison between the two
  bodies actually in frame.
- ~4 THE COLLECTIVE ATTITUDE: the whole pen swinging round to face one way at once; a mob packed
  shoulder to shoulder and shoving gently; one animal set well apart from the mob with its head
  through a hurdle; a pen of them all chewing in unison and watching.
- Vary their COLOURING in plain descriptive language: black-faced above a cream stubbled body;
  speckle-nosed; soot-grey about the muzzle; clean white faces with dark rings round the eyes;
  tan-cheeked; a broad oatmeal-coloured coat; a natural pale patch over one eye.
- Vary the MASS: packed tight; loose and scattered across the frame; three close and the rest a soft
  uneven mob behind them.

${SCALE_LAW}

${SHORN_LAW}

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-naming words, ZERO
colours of light. A separate axis owns all of that. No "golden", "morning", "dusk", "misty",
"overcast", "warm light".

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["ANY"|"shed"|"yard"], "description": "..."}.
Most should be "ANY" (a flock works in either place). Tag "shed" only if the entry names the plank
floor or the shed itself, "yard" only if it names grass, a wall or the open air. 18-28 words per
description.

Examples:
[{"tags":["ANY"],"description":"Eight clipped right down to smooth cream stubble, slim and leggy as young goats and none wider than its own head, thick woolly caps still on their heads and woolly cuffs at their ankles, backs level with the second hurdle rail."},
{"tags":["ANY"],"description":"Four stubbly goat-slim bodies stand among a dozen barrel-round woolly ones fully twice their width, both sides chewing steadily and apparently aware of it, no back clearing the top rail."},
{"tags":["shed"],"description":"Twenty in full coat packed shoulder to shoulder in the holding pen, dusty-tipped and parting down the spine, round as barrels, all swinging round to face the plank floor at once."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 3. THE SET DRESSING — and the text backfill's replacement
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_dressing.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SET-DRESSING descriptions for a cozy countryside anime
bot's sheep-shearing path — the place immediately around the animals, close behind them. About two
thirds are the inside of a small working shearing shed in full swing; about one third is the yard
and pens just outside it.

THIS POOL HAS A SECOND, HIDDEN JOB, AND IT IS THE REASON IT EXISTS. On this model, a flat surface
that nothing describes GROWS PSEUDO-LETTERING out of nowhere — and "plain" or "blank" is a negation
the model cannot process, so writing "a blank board" summons a written one. Worse, on a subject with
several flat panels, filling ONE surface just MIGRATES the lettering to the nearest remaining
unfilled strip (measured on another bot today across three rounds). So the cure is two-part: name
what the surfaces actually CARRY, and keep the number of flat panels in frame SMALL by keeping
everything CLOSE. EVERY entry must name at least one REAL OBJECT sitting on, hanging from or leaning
against a flat surface. That is where the charm of this pool comes from — it is a set-dressing win,
not a tax.

The legal object vocabulary (use it freely, mix it, add more of the same kind): a coiled rope on a
nail; hand shears hanging by their bow on a nail; the clippers hanging on their cord from a beam; a
galvanised bucket hanging by its handle; a halter looped over a rail; a leaning stack of spare
hurdles; straw bales stacked up into the rafters; a besom broom stood in a drift of loose wool; a
bound bundle of wool tied round with twine; an open-topped wooden crate with wool spilling over the
rim; a heap of loose wool on the swept plank floor; a kettle and two enamel mugs on a shelf; an
enamel mug forgotten on a rail with wool stuck round its base; a wooden chair with a coat over the
back of it; a hank of twine on a nail with one end trailing; a pitchfork stood against the wall
boards; a water trough brimming at one corner; a yard gate on a rope hinge; a gap in a stone wall
shut with a single hurdle; a wisp of wool caught on every nail head down the wall.

TWO FURTHER REQUIREMENTS, EACH FIXING A MEASURED FAILURE:

⚑ EVERY "shed" ENTRY MUST NAME WHAT THE SHED IS BUILT OF, AND MUST SAY ITS OWN SURFACES CLOSE THE
FRAME. Measured on two other bots: an interior whose enclosing surfaces are described only by
adjective renders as a diorama floating in a void or under open sky, and camera words do not fix it
— NAMING THE ENCLOSING SURFACES AND WHAT THEY ARE MADE OF does. So say the construction plainly:
whitewashed stone gone patchy; tarred feather-edge wall boards; corrugated tin on a timber frame
with the rafters showing; breeze-block to waist height and wall boards above; a beam ceiling with
bales stacked up into it. And say that the shed's own walls close the frame down both sides and its
roof closes it overhead. Name the floor as A SWEPT PLANK FLOOR, polished pale by years of feet.

⚑ EVERY "yard" ENTRY MUST NAME ONE STRUCTURAL CUE OF AN EARLY-SUMMER WORKING YARD — a STRUCTURAL
FACT OF THE PLACE, not a statement about the weather or the hour (that is another axis's job
entirely): grass worn to bare packed earth in the gateway where the whole flock has come through; a
dry stone wall with moss thick on its north side; a hawthorn hedge grown out thick and shaggy; a
race of hurdles funnelling to the shed door; a water trough brimming at one corner; nettles tall
along the foot of the wall; a lane worn pale along the wall line. Name one, plainly, and nothing
about the hour or the weather.

VARIETY MANDATE:
- ~16 tagged "shed": the inside of a small working shearing shed — a swept plank floor polished pale
  underfoot, pens made of hurdles tied with twine, a drift of loose wool along one side, bales up
  into the rafters, the clippers hanging on their cord from a beam, wall boards with bright bands of
  light coming between them — with the construction named per the rule above.
- ~9 tagged "yard": the small working yard just outside — a race of hurdles to the shed door, a
  stone wall or thick hedge, a yard gate, a trough, packed bare earth in the gateway — with a
  structural cue named per the rule above.
- AT LEAST 5 of the "shed" entries must ALSO carry the CONTINUITY LAW in full, because a shed
  interior with something visible through its door or its open end otherwise renders as a
  hard-divided two-panel image on this model. Written as three linked parts in one sentence: (a)
  name the opening as part of the room itself — its own jamb, its sill, the hurdle propped across
  it, the wall boards round it; (b) name the yard or field seen THROUGH it, softer and hazier and
  much smaller in the frame; and (c) bring that outside light BACK IN onto a named thing inside —
  the swept plank floor by the door, the nearest hurdle rail, the heap of wool, a sheep's bare back.
  That returning light is what stitches it into one frame. Never write "split", "panel", "divided"
  or "two halves" — naming them seeds them.

VIVID — this bot's palette must be richly saturated, never washed out. Name real committed colours
for the OBJECTS and SURFACES (a galvanised bucket gone chalky, a yard gate painted a faded blue, a
green enamel kettle, bright blue and orange twine at every hurdle joint, moss on the north side of
the wall, whitewash gone butter-yellow with age, iron strap hinges worn silver-bright, the wool heap
reading warm oatmeal and dusty cream). Colours of LIGHT belong to another axis.

KEEP IT SHORT — 24-34 words each.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-NAMING words
("summer", "June", "spring" are banned AS WORDS even though the structural cues above are required),
ZERO colours of light. "Bright bands of light between the wall boards" is allowed because it is a
structural fact of the shed; "golden morning light between the boards" is not.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"yard"], "description": "..."}.

Examples:
[{"tags":["shed"],"description":"Whitewashed stone gone patchy closes both sides and a beam roof with bales stacked into it closes overhead; a swept plank floor polished pale underfoot, hand shears hanging by their bow on a nail."},
{"tags":["shed"],"description":"Tarred feather-edge wall boards down both sides under corrugated tin, the doorway's own timber jamb framing the yard small and hazy beyond, that light coming back in across the plank floor and the heap of wool."},
{"tags":["yard"],"description":"A dry stone wall with moss thick on its north side, nettles tall along its foot, a race of hurdles tied with bright blue twine funnelling to the shed door, one trough brimming."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 4. THE SHEARER'S CRAFT — character branch only
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_craft.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct SHEARER ACTIONS for a cozy countryside anime bot's
sheep-shearing path. Each entry is ONE thing a person is doing, caught MID-ACTION, written as a
gerund phrase with an IMPLIED subject (the template supplies the character separately).

FORMAT: start with the verb. "Running the clippers up the length of a sheep sat back against both
knees, the wool folding away ahead of them in one sheet." "Forking a whole armload of wool up onto a
heap already higher than one shoulder." Never start with "she" or "he" or "the farmer" — the
template already names who it is.

⛔ ZERO GARMENT NOUNS. This is measured and load-bearing: an action axis that names a garment dresses
EVERY render the same way and completely overrides the separate wardrobe axis (a coat named in an
action pool put the same blue coat on every single render of another bot's path). So no coat, jacket,
overall, boiler suit, smock, apron, glove, hat, cap, scarf, boot, wellington, sleeve, cuff, pocket,
singlet, vest. Name the ACTION and the OBJECT ACTED ON, never what the person is wearing.

MID-ACTION, NEVER PARKED. "Standing by the pen" is a miss. "Straightening up with both hands pressed
into the small of the back and looking at the twelve still to go" is a hit.

⛔ AND IT IS A HAIRCUT, NOT A PROCEDURE. Every action reads as competent, calm, warm and slightly
comic. No pinning, no restraining, no forcing, no struggling, no wrestling an animal into
submission. A sheep sat up on its haunches against the knees is COMFORTABLE and resigned and both
parties know the routine.

THE BAR: playful, adventurous, CLEVER. Show the real craft of this — the specific, funny, competent
things that almost nobody has ever seen. Aim there, not at "shearing a sheep".

VARIETY MANDATE across the ${n} entries — tag each "shed", "yard" or "ANY":
- ~6 THE SHEARING ITSELF (shed): running the clippers up the length of a sheep sat back against both
  knees with the wool folding away ahead of them in one sheet; peeling the last of a wool coat clear
  with a free hand and letting it drop whole onto the plank floor; working round the shoulder with
  hand shears, the coat opening like a seam.
- ~5 THE WOOL WORK (shed): forking an armload of wool up onto a heap already higher than one
  shoulder; treading a bundle of wool down and getting twine round it; throwing a whole wool coat
  out flat over the heap and watching it settle; picking a muddy tuft out of the edge of a coat
  spread on the floor; sweeping a drift of loose wool together with a besom.
- ~5 THE HANDLING (ANY): walking a sheep backwards out of the holding pen by the chin with it
  stepping along quite willingly; lifting a hurdle out of the way with one knee and a shoulder;
  shaking a bucket once so the whole pen swings round at the sound; steadying a shorn sheep with one
  flat hand while it works out that it is narrower than it was.
- ~4 THE BETWEEN-SHEEP (shed): straightening up with both hands pressed into the small of the back
  and eyeing the twelve still to go; drinking from an enamel mug and finding wool in it; picking
  wool off both forearms by the handful; leaning right over the top rail with both elbows to count
  the pen twice because the answer came out different the first time.
- ~3 THE YARD (yard): swinging the yard gate wide and standing well back out of the rush as the
  shorn mob goes; crouching on the packed earth to watch them go past; walking the wall line slowly
  counting.
- ~2 THE COLLIE PARTNERSHIP (ANY): pointing once at the holding pen and then leaving the whole thing
  entirely to the collie; standing aside with folded arms while the collie brings the next four up
  the race.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-naming words, ZERO
colours of light.

KEEP IT SHORT — 16-26 words each.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"yard"|"ANY"], "description": "..."}.

Examples:
[{"tags":["shed"],"description":"Running the clippers up the length of a sheep sat back against both knees, the wool folding away ahead of them in one unbroken sheet."},
{"tags":["shed"],"description":"Forking an armload of wool up onto a heap already higher than one shoulder, with another whole coat waiting flat on the plank floor."},
{"tags":["yard"],"description":"Swinging the yard gate wide and stepping well back out of the rush, one hand still on the top bar as the shorn mob pours past."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 5. ★ LIGHT & AIR — the ONLY axis that owns time, weather, palette
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_light.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LIGHT-AND-AIR descriptions for a cozy countryside anime
bot's sheep-shearing path (a small working shearing shed in full swing, and the yard just outside
it). THIS IS THE ONLY AXIS ON THE PATH THAT OWNS TIME OF DAY, WEATHER AND THE COLOUR OF LIGHT —
every other pool is deliberately silent on all three, so this axis alone sets the palette of the
render. That makes it the path's palette axis, and it has to COMMIT.

⭐ VIVID IS LITERAL AND IT IS THE BAR. Saturated, committed colour and real light drama. A muted
grey-brown frame is a MISS on this bot even when it is technically competent.

⛔ TWO MEASURED REQUIREMENTS, BOTH FROM THE SAME 24-RENDER BATCH ON THIS BOT'S SIBLING PATH:
  (a) EVERY ENTRY NAMES TWO COMMITTED COLOURS IN VISIBLE OPPOSITION and says what each one is ON.
      Every render in that batch that graded 4.1 or above had exactly this; every sober frame did
      not.
  (b) THE WORD "EVEN" AND ITS FAMILY ARE BANNED AS DESCRIPTIONS OF LIGHT. The four entries there
      that described light as EVEN produced every single sober frame in the batch. So: no "even",
      "evenly", "uniform", "uniformly", "diffuse", "diffused", "flat light", "soft ambient",
      "ambient", "balanced", "gentle overall". Light on this path always comes from somewhere
      specific and always lands somewhere specific.

⚠️ THE ONE HARD TRAP ON THIS AXIS, MEASURED ON THIS BOT: A GLOW WORD PLUS A SMALL DARK OPENING
RELOCATES THE GLOW — the model transplants it onto the nearest dark aperture and paints a furnace
burning inside it. So a lamp is named as A LAMP HANGING IN PLAIN SIGHT, and its light is ALWAYS
described as LANDING ON a named surface (the swept plank floor, the heap of wool, a sheep's bare
back, the nearest hurdle rail, a bale end). NEVER a glow inside, within, deep in or behind anything.

⚑ TAG each entry "shed" or "yard", AND THE SHED TAG HAS A HARD ENTRY REQUIREMENT. Measured on this
bot's lambing path in round 1: the three flattest, palest renders of the batch were all shed
interiors, and each one had rolled a light entry describing an outdoor SKY or an outdoor SUN ("hard
midday sun", "a butter-yellow low sun in a clear pale-blue sky", "a cold clear dawn") — which a shed
interior physically cannot show, so the model had nothing to anchor the light to and rendered flat
ambient daylight, taking the whole palette pale. Retagging those and adding in-frame sources moved
the shed renders from 3.60 to 3.98 in a single round. So: EVERY "shed" ENTRY MUST NAME AN IN-FRAME
LIGHT SOURCE THE SHED ITSELF CONTAINS — a work lamp hanging on its flex over the plank floor, a
hurricane lantern set down on a bale, the wide open end of the shed, the open doorway, the gaps
between the wall boards, the one translucent sheet set into the tin roof — and MUST say what its
light LANDS ON. An outdoor sky or sun belongs on a "yard" entry only. Do NOT use an "ANY" tag on
this pool at all: light here is inherently setting-specific. Roughly 15 "shed" and 10 "yard", and do
not open more than about a third of the shed entries with the word "lamp" — vary the source.

⭐ THE PATH'S SIGNATURE LIGHT, and it wants writing several different ways: WOOL MOTES IN THE AIR. A
shed in full swing is full of floating wool and chaff, and it is the most beautiful thing in the
building. The safe form names the LIT SURFACE first and the motes second: "the gaps between the wall
boards lay bright bands across the swept plank floor, every band packed with drifting wool motes".
Put this, or a variant of it, in about four of the shed entries.

BALANCE MANDATE — count these out deliberately, because a self-carried atmosphere axis is exactly
what produced this bot's documented "always sunny" failure on another path family:
- ~6 WARM-DOMINANT: a work lamp laying a hot apricot pool across the swept plank floor against the
  deep umber of the wall boards; low copper sun right down the length of the open shed against the
  cool grey of the stone; a butter-yellow band across whitewash gone chalk-white.
- ~7 COOL-DOMINANT: flat pearl-grey overcast with the yard grass gone deep saturated green under it
  and the wool reading near-white against it; a hard blue pre-dawn outside the open end with the
  plank floor lit sodium-orange from the one lamp; thin silver drizzle and the wall stone gone
  near-black with wet against the bright cream of the shorn backs.
- ~12 WARM AGAINST COOL (the strongest family — make these genuinely dramatic, and this is the one
  that earns the grade): a work lamp's hot apricot pool on the plank floor against the cold slate
  blue coming in the open doorway; a bright hard band of gold between two wall boards landing on a
  sheep's bare cream back while the rest of the shed stays deep cool blue-grey; a low gold sun under
  a bruise-purple cloud with the yard grass lit acid green against it; sun breaking through right as
  a shower goes over, the air full of bright white grains and floating wool.

ALSO: vary the AIR ITSELF — wool motes and chaff up in every band of light, breath showing, steam
lifting off a bare back, a warm dusty haze, fine drizzle, still air with nothing moving in it, a
wind pushing the grass all one way and rolling loose wool across the yard.

KEEP IT SHORT — 18-28 words each.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"yard"], "description": "..."}.

Examples:
[{"tags":["shed"],"description":"A work lamp hangs low on its flex and lays a hot apricot pool right across the swept plank floor, while cold slate blue comes in at the open doorway behind it."},
{"tags":["shed"],"description":"The gaps between the wall boards lay bright hard bands of gold across the plank floor and one sheep's bare cream back, every band packed with drifting wool motes, the rest of the shed deep blue-grey."},
{"tags":["yard"],"description":"A low copper sun under a bruise-purple cloud, the yard grass lit acid green against it and loose wool rolling pale across the packed earth."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },
  // ───────────────────────────────────────────────────────────────
  // 5b + 3b. THE YARD TOP-UPS — a second pass on the two setting-tagged
  // pools, because the first pass came back almost entirely "shed".
  //
  // WHY THESE EXIST AND WHY THEY ARE SEPARATE RECIPES. The local dry-run
  // caught it before any render was spent: recipes 3 and 5 each asked for a
  // shed/yard SPLIT inside one meta-prompt (~15 shed / ~10 yard for light,
  // ~16 / ~9 for dressing) and Sonnet returned 25 shed / 0 yard for light and
  // 24 shed / 1 yard for dressing. On a path that rolls the yard setting 30%
  // of the time that is not a variety problem, it is a CRASH: `forSetting`
  // would have handed the picker an EMPTY array for light on every yard
  // render. The general lesson, and it is the same shape as the
  // format-drift scan in the playbook's production-seeding section: A
  // DISTRIBUTION ASKED FOR INSIDE ONE META-PROMPT IS NOT A DISTRIBUTION YOU
  // GET — if a tag split is load-bearing, seed each side as its own recipe
  // with its own total, and COUNT THE TAGS before rendering. These two run in
  // append mode on the same JSON files, so they top the pools up to 35
  // without touching the 25 shed entries already generated and hand-patched.
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_light.json'),
    total: 35,
    batch: 20,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LIGHT-AND-AIR descriptions for a cozy countryside
anime bot's sheep-shearing path, and EVERY SINGLE ONE IS SET OUTSIDE IN THE WORKING YARD AND PENS —
not one of them is a shed interior. (The shed half of this pool is already written; this pass is the
yard half only.) THIS IS THE ONLY AXIS ON THE PATH THAT OWNS TIME OF DAY, WEATHER AND THE COLOUR OF
LIGHT, so it alone sets the palette of the render and it has to COMMIT.

⭐ VIVID IS LITERAL AND IT IS THE BAR. Saturated, committed colour and real light drama. A muted
grey-brown frame is a MISS on this bot even when it is technically competent.

⛔ TWO MEASURED REQUIREMENTS, from a 24-render batch on this bot's sibling path:
  (a) EVERY ENTRY NAMES TWO COMMITTED COLOURS IN VISIBLE OPPOSITION and says what each one is ON.
      Every render in that batch that graded 4.1 or above had exactly this; every sober frame did
      not. The bare cream of a just-shorn back and the pale oatmeal of loose wool are both excellent
      things to put a colour against.
  (b) "EVEN" AND ITS FAMILY ARE BANNED AS DESCRIPTIONS OF LIGHT — the four entries there that
      described light as EVEN produced every single sober frame in the batch. No "even", "evenly",
      "uniform", "diffuse", "flat light", "soft ambient", "ambient", "balanced", "gentle overall".

BALANCE across the ${n} entries — about a third warm-dominant, about a third cool-dominant, and
about a third WARM AGAINST COOL (the strongest family, and the one that earns the grade): a low gold
sun under a bruise-purple cloud with the yard grass lit acid green against it; the last copper light
down the race of hurdles while the packed earth underfoot stays cold blue-violet; sun breaking
through right as a shower goes over, the air full of bright white grains and floating wool.

VARY THE AIR: loose wool rolling pale across the packed earth on the wind; wool motes and chaff
riding up off the flock; breath showing; steam lifting off bare cream backs in cold air; a warm
dusty haze over the pens; fine silver drizzle with the wall stone gone near-black with wet; still
air with nothing moving in it.

KEEP IT SHORT — 18-28 words each.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["yard"], "description": "..."}.
EVERY entry must carry the tag "yard" and nothing else.

Examples:
[{"tags":["yard"],"description":"A low copper sun under a bruise-purple cloud, the yard grass lit acid green against it and loose wool rolling pale across the packed earth."},
{"tags":["yard"],"description":"Flat pearl-grey overcast with the yard grass gone deep saturated green beneath it, the bare cream backs in the pen reading almost white against the wet near-black wall."},
{"tags":["yard"],"description":"Sun breaks through as a shower goes over, the air full of bright white grains and floating wool, the packed earth gone cold blue-violet underfoot."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_shearing_dressing.json'),
    total: 35,
    batch: 20,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SET-DRESSING descriptions for a cozy countryside anime
bot's sheep-shearing path, and EVERY SINGLE ONE IS SET OUTSIDE IN THE WORKING YARD AND PENS just
outside the shearing shed — not one of them is a shed interior. (The shed half of this pool is
already written; this pass is the yard half only.)

THIS POOL HAS A SECOND, HIDDEN JOB, AND IT IS THE REASON IT EXISTS. On this model a flat surface
that nothing describes GROWS PSEUDO-LETTERING out of nowhere, and "plain" or "blank" is a negation
the model cannot process, so writing "a blank board" summons a written one. The cure is to name what
the surfaces actually CARRY. EVERY entry must name at least one REAL OBJECT sitting on, hanging from
or leaning against a flat surface. That is where the charm of this pool comes from — it is a
set-dressing win, not a tax.

The legal object vocabulary (use it freely, mix it, add more of the same kind): a coiled rope on a
gatepost; a galvanised bucket hanging by its handle on the gate; a halter looped over a rail; a
leaning stack of spare hurdles; a besom broom stood against the wall; a bound bundle of wool tied
round with twine sitting out on the flags; an open-topped wooden crate with wool spilling over the
rim; a heap of loose wool caught against the bottom of a gate; an enamel mug forgotten on a gatepost
with wool stuck round its base; a hank of twine on a nail with one end trailing; a pitchfork stood
against the wall; a water trough brimming at one corner; a yard gate on a rope hinge; a gap in a
stone wall shut with a single hurdle; a wisp of wool caught along the whole top wire of a fence.

⚑ EVERY ENTRY MUST NAME ONE STRUCTURAL CUE OF AN EARLY-SUMMER WORKING YARD — a STRUCTURAL FACT OF
THE PLACE, never a statement about the weather or the hour (that is another axis's job entirely):
grass worn to bare packed earth in the gateway where the whole flock has come through; a dry stone
wall with moss thick on its north side; a hawthorn hedge grown out thick and shaggy; a race of
hurdles funnelling to the shed door; nettles tall along the foot of the wall; a lane worn pale along
the wall line; flagstones sunk and uneven by the trough; a stone step hollowed in the middle.

⚑ AND EVERY ENTRY MUST CLOSE THE FRAME BEHIND THE ANIMALS. A yard is an outdoor space and this
path's whole constraint is CLOSE — so name the wall, the hedge, the hurdle race or the shed's own
outside gable standing close behind the pens, never an open horizon, never a distant view, never a
field stretching away. (Do not write "no horizon" — name what IS close behind instead.)

VIVID — this bot's palette must be richly saturated, never washed out. Name real committed colours
for the OBJECTS and SURFACES (a galvanised bucket gone chalky, a yard gate painted a faded blue, a
green enamel kettle, bright blue and orange twine at every hurdle joint, moss deep on the north side
of the wall, limewash gone butter-yellow on the gable, iron strap hinges worn silver-bright, the
wool heap reading warm oatmeal and dusty cream). Colours of LIGHT belong to another axis.

KEEP IT SHORT — 24-34 words each.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-NAMING words
("summer", "June", "spring" are banned AS WORDS even though the structural cues above are required),
ZERO colours of light.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["yard"], "description": "..."}.
EVERY entry must carry the tag "yard" and nothing else.

Examples:
[{"tags":["yard"],"description":"A dry stone wall with moss thick on its north side closes in close behind the pens, nettles tall along its foot, a race of hurdles tied with bright blue twine funnelling to the shed door."},
{"tags":["yard"],"description":"Grass worn to bare packed earth right through the gateway, a faded blue gate on a rope hinge with a chalky galvanised bucket hanging off it, the shaggy hawthorn hedge standing close behind."},
{"tags":["yard"],"description":"The shed's own limewashed gable gone butter-yellow closes the frame behind the pens, a besom broom against it, a bound bundle of wool tied with orange twine out on sunk uneven flags."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  for (const r of RECIPES) {
    const name = path.basename(r.outPath);
    if (only.length && !only.some((o) => name.includes(o))) continue;
    console.log(`\n=== ${name} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
