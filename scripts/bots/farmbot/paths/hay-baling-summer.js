/**
 * FarmBot — hay-baling-summer (new path, 2026-09-23).
 *
 * ━━━ THE GAP IT CLOSES (verified against the code, not against a brief) ━━━
 * FarmBot has 48 entries in `pathBuilders` — 34 live in `paths[]`, 9 calendar-
 * gated seasonal, 2 deactivated (first-snowfall, sugarcane-field) and 3 in
 * `shadowPaths[]`. A scan of every seed JSON a LIVE path actually requires
 * found that hay exists on this bot only as FURNITURE, never as WORK:
 *   • `hay bale` / `bale` appear 152 times and almost every one is a seat, a
 *     decoration or a prop — 42 in `farm_fair_festival_scenes`, 25 in
 *     `halloween_barn_party_decor`, 19 in `halloween_barn_party_activity`,
 *     14 in `harvest_festival_place`, 13 in `fall_campfire_evening_detail`.
 *   • `hay wagon` appears 117 times, 103 of them in `fall_hayride_wagon` —
 *     i.e. a wagon you RIDE ON, at a calendar-gated autumn path.
 *   • `round bales` = 3 hits total, all incidental barn/corn-maze dressing.
 *     `windrow` = 1. `baled` = 1. `haymaking` = 0. `hay harvest` = 0.
 *     `chaff` = 10, all in other paths' air.
 * So there is no HAYMAKING register on this bot at all: nothing about the hay
 * being cut, raked, rolled, hauled or stacked, and nothing that uses a round
 * bale as a piece of ENORMOUS GEOMETRY rather than as a bench. That is a real
 * gap on a farm bot, because haymaking is the loudest, hottest, dustiest week
 * of the farming year and it produces the one shape in agriculture that is
 * genuinely monumental at human scale.
 * NOT REDUNDANT — checked all four nearest live analogs:
 *   • `harvest-festival` is DECORATED FESTIVAL GROUNDS (a bale maze, bunting,
 *     scarecrows, squash in a wheelbarrow). Its own meta-prompt bans
 *     market-stall phrasing; this path bans its whole register right back.
 *   • `picnic-in-the-meadow` is a leisure blanket in tall grass, with the
 *     blanket/basket/wildflowers as a FIXED anchor block.
 *   • `flower-field-wandering` is a wandering stroll through a wildflower field.
 *   • `evening-chores` / `orchard-afternoon` are dusk chores and fruit picking.
 * SCOPE FENCE, RETURNED: nothing here touches any of those — no festival, no
 * fete, no bunting, no stalls, no games, no bale maze, no scarecrow, no picnic
 * blanket, no basket, no hamper, no wandering or strolling, no wildflower field
 * as the subject. The word MEADOW is banned outright: that noun belongs to
 * `picnic-in-the-meadow`. Enforced as a ban in every gen recipe and verified at
 * zero hits by post-generation sweep.
 *
 * ━━━ ⭐ THE BAR (Kevin's motto) ━━━
 * Playful, adventurous, VIVID, beautiful, CLEVER; show people something they
 * have never seen, or something familiar redressed as more interesting. The
 * dull failure here is precise, and it is the most likely way this path dies,
 * because a hayfield is the most photographed rural cliche there is: A TIDY
 * GOLDEN FIELD WITH SOME BALES IN IT, seen from far enough away to be a
 * postcard. On-brief, defect-free, sober, forgettable. So the whole path is
 * built so that shot cannot happen. What it aims at instead: one round bale so
 * close and so big that the frame cannot hold it, with the crew's shoulders
 * only reaching its top; a wooden wagon loaded to an almost architectural
 * height, leaning, with hay slithering off the back end and somebody walking
 * the top of it with their arms out; the whole air between the camera and a low
 * sun packed with drifting hay dust, every single speck of it lit; one bale
 * that has got away down the slope and is sitting square in the hedge with the
 * flattened track it pressed still showing behind it; three people using a bale
 * tipped on its side as a sofa and passing a stone jar of water between them; a
 * dog flat out and fully committed in the one patch of bale-shadow with one ear
 * turned inside out; a cat sitting at the very peak of a heaped load, composed,
 * self-satisfied, not holding on; a tall ring of grass left standing round a
 * lone hawthorn stump the blade could never get to; a straw hat hooked over the
 * handle of a pitchfork planted upright in a heap of loose hay.
 *
 * ━━━ THE LOAD-BEARING CONSTRAINT ━━━
 * CROSSWISE AND CROPPED — the cut ground filling the near half and running off
 * BOTH SIDE EDGES, the tall uncut grass a BAND across the upper part, and the
 * nearest bale an enormous drum CROPPED by the edge of the picture. Placed in
 * three layers that reach Flux, deliberately:
 *   1. a short front-loaded FRAMING block. This is the path's single most
 *      important placement decision and it is `sheep-shearing-day`'s named next
 *      lever, used here from round 0 rather than discovered in round 3: the
 *      framing block is the ONE place a FarmBot path reaches early. FarmBot's
 *      shared `FARMBOT_COZY_NEUTRAL` fragment is 273 words starting at word 4
 *      of every prompt, so Sonnet's scene does not begin until word ~277 of
 *      ~460 (58% in) — and the attention curve measured by POSITION says
 *      content at 5-10% of a prompt renders 6 of 6 while content past ~30%
 *      renders 0 of 6 until it is moved. That fragment is a shared file and
 *      Kevin's call; the framing block is the lever a path actually owns.
 *   2. the FIELD axis, which owns the ground and states it in 24 of its 25
 *      entries.
 *   3. items (2) and (3) of the required OUTPUT ORDER at the end (a law
 *      appended to a seed tail reaches ~20% of prompts; the same law in the
 *      output order reaches 100% — measured 1 of 5 → 5 of 5).
 * It does double duty as the path's TEXT fix: a framing law IS a text lever,
 * because a receding rank of eight wagons and gates shows eight flat panels
 * while one cropped near bale and a band of grass shows none — and filling
 * text-shaped surfaces one at a time only MIGRATES the lettering to the nearest
 * unfilled strip, so the win condition is shrinking the text-bearing AREA.
 *
 * ━━━ WHY THIS PATH HAS NO CAMERA AXIS ━━━
 * Same two measured reasons as `lambing-season` and `sheep-shearing-day`, and
 * it matters more here than on either. First, the shared
 * `farmbot_camera_composition.json` is confirmed contaminated: the 2026-09-09
 * purge removed 11 over-the-shoulder entries and tropical-flower-garden's
 * re-QA then proved 51 of the remaining 109 still slip a keyword blacklist,
 * including every "Wide establishing shot" variant — and on THIS path a single
 * wide/aerial/establishing entry IS the postcard, i.e. the exact render the
 * path exists to prevent. Second, the cross-bot finding is that purging the bad
 * camera entries beats strengthening the mandate, and purging the whole axis is
 * the strongest form of that. It also buys back one output-order slot and ~25
 * words of brief on a path whose headline constraint is the attended region.
 * The framing block carries the one camera rule needed, and it carries it as a
 * CROP and a SURFACE rather than as a camera word — because camera words lose
 * to a linear feature's own prior every time (measured over 24 renders on one
 * path, where rewriting all eight vantages to look ACROSS the feature left the
 * corridor in 6 of 6).
 *
 * ━━━ WHY THERE IS NO SETTING ROLL, UNLIKE ITS TWO SIBLINGS ━━━
 * `apiary-beekeeping` rolls indoor/outdoor and `sheep-shearing-day` rolls
 * shed/yard, both with every setting-sensitive pool tagged so no two axes can
 * disagree about where the shot is. This path deliberately has ONE setting: the
 * half-cut field. Three reasons. (a) The differentiator IS the field — the
 * cut/uncut line and the bale geometry are the whole point, and a second
 * setting (the stackyard, the barn end) would spend rolls on renders that do
 * not carry it, and would drift toward `deliveries` and `harvest-festival`.
 * (b) It removes the crash risk entirely: a tag split asked for inside one
 * meta-prompt is not the split you get (measured on this bot — two recipes
 * asked for 15/10 and 16/9 and returned 25/0 and 24/1), and on a 30% branch
 * that is an EMPTY ARRAY handed to the picker, which is a hard break rather
 * than a dull render. (c) It shortens the brief, which on this bot is the
 * scarcest resource there is. The one tag split that remains (moment
 * standalone/handled) was seeded as TWO SEPARATE RECIPES and the tags were
 * COUNTED before a render was spent: 16 standalone / 9 handled, exactly.
 *
 * ━━━ AXES (6 bespoke) ━━━
 *   • hay_bales       ★ THE HERO — the hay itself: round bales standing in the
 *                       cut, the stack, the heaped wagon, the loose ridge, the
 *                       one that got away. Every entry names a real COUNT,
 *                       because SIZE TRACKS THE COUNT and a low count is the
 *                       giant-object generator (the model hands each named
 *                       subject a share of the frame). It names NO size
 *                       comparison at all — see THE RULER below.
 *   • hay_field       ★ THE STAGE and the path's differentiator — the hard
 *                       graphic cut/uncut boundary, the surface of the cut
 *                       ground, and what closes the far side so the frame is
 *                       never an empty open plain. This axis OWNS the ground
 *                       geometry; every other pool is explicitly forbidden from
 *                       describing it (see THE GROUND HAS ONE OWNER below).
 *   • hay_moment      ★ THE SIGNATURE MONEY-SHOT AXIS — the beat happening now,
 *                       at output-order position 4. Tagged `standalone` (16) /
 *                       `handled` (9): the 16 standalone entries carry NO person
 *                       and none implied, and were required to read as
 *                       haymaking ON THEIR OWN, so a no-character roll can never
 *                       lose the path's identity to the branch. The 9 handled
 *                       entries name THE FARMER or THE FARMERS as a whole
 *                       grammatical subject, because a named action with no
 *                       named actor renders the body part alone (measured twice:
 *                       a cup "held out from the next deck" drew a giant
 *                       floating hand and forearm at two scales). This pool is
 *                       also the SINGLE OWNER of the straw hat.
 *   • hay_crew          the human action, character branch only, gerund with an
 *                       implied subject. ZERO garment nouns by recipe mandate —
 *                       an action axis that names a garment dresses every render
 *                       the same way and overrides the wardrobe axis entirely
 *                       (measured on another bot: action seeds naming a
 *                       captain's coat put a naval coat on every render
 *                       regardless of the outfit pool). Half effort, half the
 *                       water break, because the work is hard and hot and this
 *                       field is in a good humour.
 *   • hay_light       ★ the ONLY axis on this path that owns time of day,
 *                       weather, season and the colour of light. Every other
 *                       pool is deliberately silent on all four. It is therefore
 *                       the PALETTE axis and it commits — see THE LIGHT LAW.
 *   • hay_animal        HAND-AUTHORED (14) — the gated farm-animal cameo. It is
 *                       bespoke rather than the shared ANIMAL_COMPANIONS pool
 *                       for the same measured reason as its two siblings: that
 *                       pool's entries carry their own setting AND their own
 *                       time of day (a drowsy calf "in golden hay… an afternoon
 *                       nap"), which would put a second time-of-day statement in
 *                       the brief and contradict `hay_light`. These 14 name no
 *                       light and no weather at all, and every one carries a
 *                       SIZE OR POSITION word ("small at the far side of the
 *                       cut", "small on the very top of the heaped load"),
 *                       because a life-pool entry with no size or distance word
 *                       renders at HERO SCALE.
 *
 * Shared pools used: ONLY CHARACTER_ARCHETYPE + HAIRSTYLE / HAIR_COLOR /
 * EYE_COLOR / SKIN_TONE, via the local mirror of pickCharacter below.
 * Deliberately NOT pulled, each for a measured reason:
 *   - SEASON — its entries are landscape-hero spring meadows and autumn
 *     hedgerows, which would both compete with the field axis for the stage and
 *     put a second season statement in a brief where `hay_light` has already
 *     locked HIGH SUMMER.
 *   - WEATHER_ATMOSPHERE — `hay_light` replaces it (the same precedent as
 *     artisan-workshop, lambing-season, sheep-shearing-day and all 8 tropical
 *     paths). Pulling both puts two competing time-of-day statements in one
 *     brief. It also skews 14/25 warm-dominant, which on a path already locked
 *     to hot summer light would flatten the palette rather than vary it.
 *   - CAMERA_COMPOSITION — see the no-camera-axis note above.
 *   - ACTIVITY — its chore+farm entries are laundry lines, dough and strawberry
 *     picking; nothing haymaking-shaped. `hay_crew` is bespoke.
 *   - ANIMAL_COMPANIONS — carries its own setting and time of day.
 *   - WORLD_DETAIL_PROPS — the set dressing here has to be the WORK's own props
 *     (the rake, the fork, the twine, the stone jar, the wagon bench) and those
 *     are already carried positively by the bales, moment and field axes as the
 *     text-backfill fix. A generic prop axis would add a second unrelated object
 *     to a frame whose whole subject is scale.
 *   - GENTLE_MAGIC — dropped outright, not filtered. Its entries are almost all
 *     built on a LIGHT observation ("moonlight pooling…"), which is what
 *     `hay_light` owns and would contradict. And this path does not need it: an
 *     enormous cylinder of hay with a person's shoulders at its top, and a whole
 *     field of air lit speck by speck, ARE the everyday wonder. Dropping it also
 *     shortens the brief.
 *
 * ━━━ WHY pickCharacter IS MIRRORED LOCALLY AND NOT CALLED ━━━
 * `pools.pickCharacter(picker, tags, prefix)` filters CHARACTER_ARCHETYPE with
 * `byTags`, whose OR-match lets any entry tagged `"ANY"` through BY DESIGN —
 * and 67 of the 116 archetypes carry `"ANY"`. Passing tags is therefore a no-op
 * that leaks bakers, café owners, potters and market vendors into a hayfield;
 * that exact bug produced "a baker with a dough-cutter in a flower garden" on
 * tropical-flower-garden. So this file does what artisan-workshop.js,
 * tropical-flower-garden.js, apiary-beekeeping.js, lambing-season.js and
 * sheep-shearing-day.js already do on this bot: manually content-filter the
 * archetypes, then reproduce pickCharacter's combining logic EXACTLY (archetype
 * + gender-matched hairstyle + hair colour + eye colour + skin tone) from
 * pools.js's own exported pieces. The helper's whole purpose — defeating the
 * "same person every time" homogenisation trap by atomising appearance and
 * gender-matching the hairstyle — is preserved verbatim; only the archetype
 * source list is narrowed. `pools.js` is NOT edited. The incompatible-archetype
 * regex is byte-identical to the two sibling paths on purpose: it is proven, and
 * diverging it would be an unmeasured second variable.
 *
 * ━━━ THE LAWS THIS PATH WAS BUILT AGAINST ━━━
 *  1. 🌾 THE SUBTRACTIVE-SURFACE TRAP, AND IT IS THIS PATH'S VERSION OF THE
 *     SHORN SHEEP. The single most expensive failure available here, and it is
 *     measured on this exact bot: on `sheep-shearing-day` one authored clause
 *     carried an additive half and a subtractive half in the SAME sentence, at
 *     the SAME position, in the SAME prompts — "woolly cuffs still at the
 *     ankles" rendered 6 OF 6 every round, "no fluff on the body anywhere"
 *     rendered 1 OF 6. THE MODEL ADDS AND IT DOES NOT SUBTRACT. "Stubble" is a
 *     subtractive description of a field — grass with its height removed —
 *     exactly the shorn-sheep shape, and it is ALSO a facial-hair collision on
 *     a path that puts human faces in frame, so it is banned outright in both
 *     directions. The cut ground is never described as an absence and never
 *     chased with better adjectives for shortness. It is named as a POSITIVE
 *     OBJECT (a pale bristled floor of cut stalks with bare dry soil showing
 *     between them) and the cut is PROVEN BY THINGS THAT HAVE BEEN ADDED TO IT:
 *     wheel ruts pressed into it, long combed ridges of raked grass lying across
 *     it, broken stalks and empty seed heads littered over it, a few tall stalks
 *     the blade missed still upright, a thistle head left standing, the bales
 *     themselves, and the tall uncut grass standing up as a WALL at the line.
 *     Those added objects are the hat and socks of this path, and the standing
 *     wall is its woolly majority — the odd-one-out framing that made the bare
 *     sheep legible is what makes the cut legible here.
 *  2. ↔️ THE CORRIDOR TRAP, AND A HAYFIELD IS THE PUREST CASE OF IT. A path
 *     staged on a linear feature renders as a receding corridor with its subject
 *     tiled to the vanishing point, and rewriting the camera does not fix it.
 *     A hayfield hands the model THREE linear features at once (the cut line,
 *     the raked ridges, the wheel ruts) plus a rank of identical bales to tile
 *     away to the horizon — and this bot's own `fall_hayride_field` pool shows
 *     the failure already written down, entry #1: "pale amber stubble rows, each
 *     row running in a neat line toward a low split-rail fence at the far edge".
 *     What breaks it is the CROSSWISE + CONCRETE-BUT-CROPPED form in the framing
 *     block, the field axis and the output order. ⚠️ And the corridor sweep was
 *     run on the HERO pool as well as the setting pool, because a vanishing
 *     point authored into the hero axis beats a correct crosswise ground rule
 *     every time: 0 hits across all 139 entries.
 *  3. ⚖️ THE RULER HAS EXACTLY ONE OWNER AND IT IS THIS TEMPLATE. Two lessons
 *     that together make one complete rule. A rule written into a GENERATOR
 *     recipe reaches the POOL, not the PROMPT: DinoBot's ruler law lived in its
 *     recipes, audited 0 sweep hits across 125 entries, and Sonnet then invented
 *     its own rulers in 3 of 5 prompts at a 100% off-limits hit rate — every
 *     invented ruler a banned modern object or a body part. And the other half:
 *     naming a ruler OBJECT in the hero recipe made 24 of 25 hero entries name
 *     it, so a second one turned up in frame. So here the ruler law lives ONLY
 *     in the required output order (which reaches 100% of prompts), every pool
 *     is banned from writing any size comparison at all (verified: 0 real hits
 *     across 139 entries, against 7 independent re-derivations of "a hand's
 *     width" on the sibling path), and it is expressed as a RELATIVE POSITION
 *     and a UNIT rather than as a second physical object:
 *       (a) both branches — the nearest bale CROPPED by the frame edge with its
 *           top ABOVE THE HEAD OF EVERYTHING ELSE IN FRAME;
 *       (b) both branches — the tall uncut grass at the line comes only about a
 *           third of the way up a bale's end (an in-frame ruler welded to a
 *           continuous feature that is present on every single render);
 *       (c) character branch — the crew's shoulders reach only the top of a
 *           bale;
 *       (d) the stack measured in BALES ("two bales high"), a unit, not an
 *           object.
 *  4. ⚖️ NO SUBJECT GETS A DETAIL EXEMPTION, and the reason is stated in the
 *     output order so it survives editing. "Cap the detail at the nearest one or
 *     two" IS ITSELF THE INFLATOR and it undoes a correct ruler: 20 of 30 apiary
 *     entries on this bot welded a correct ruler and then added a close anatomy
 *     clause for the nearest subject, and the anatomy beat the ruler every time,
 *     producing hand-sized bees at exactly the rate the clause appeared;
 *     stripping it took giant bees 3 of 5 → 0 of 6 and that path 3.86 → 4.37.
 *     THE ONE YOU DESCRIBE MOST IS THE ONE THAT COMES OUT BIGGEST.
 *     ⚠️ NO PARITY CLAUSE anywhere in this template, even though Kevin's
 *     standing FarmBot rule is that animals share equal spotlight with humans —
 *     because DETAIL AND SIZE ARE THE SAME DIAL and an animal-parity clause
 *     ("the bees rendered as carefully as the person") ENLARGED them. The rule is
 *     honoured the way the measurement says it must be: by buying the non-human
 *     subjects FRAME SHARE (the hay leads the output order, the bales and the
 *     field are unconditional in both branches, and the hay takes the larger part
 *     of the frame) rather than by asking for equal per-subject detail.
 *  5. 🗺️ THE GROUND HAS ONE OWNER, and this is the one genuinely new structural
 *     finding of this build — see the gen script's GROUND_NOT_YOURS block for
 *     the numbers. The first generation handed the full crosswise law to three
 *     recipes on the reasonable reading that a law belongs on every axis that can
 *     name the thing. Measured on the output: the boilerplate landed in 17 of 25
 *     bales entries, 23 of 25 field entries and 13 of 25 moment entries, so a
 *     composed brief carried the same 35-word clause three or four times over,
 *     plus the framing block, plus the output order. It also blew every word
 *     count, because Sonnet anchors length on the EXAMPLES and the examples
 *     carried the law. Fixed by giving the ground to the FIELD axis alone: bales
 *     73 → 39 median words, moment 62 → 36, duplication 17/25 and 13/25 → 0/25,
 *     ~60 words of brief bought back for content on a bot where the attended
 *     region is the scarcest thing there is.
 *  6. 📝 THE TEXT LAW, three lessons that have to compose. (a) DELETE, don't
 *     describe: a text-SHAPED surface cannot be worded safely, only removed — so
 *     the printed sack, the gate sign, the notice board, the white plastic bale
 *     wrap, the net wrap and the tarpaulin are deleted from every layer, along
 *     with the whole synonym family AND the whole "put there by a hand" family
 *     (`ruled`, `drawn`, `traced`, `mark`, `scored`, `like a fold in paper`),
 *     which the first generation reached for twice unprompted and which my own
 *     first sweep regex missed. It is also why NO MOTORISED MACHINERY appears
 *     anywhere: a tractor or baler is a dense cluster of exactly those surfaces
 *     — badge, decals, plate, and the DIAL/GAUGE family, which is the one family
 *     that cannot be worded safely at all — sitting in the one place a crop
 *     cannot remove it. (b) FILL WHAT THE DELETION EMPTIED, and make the filling
 *     carry the interest: an ABSENCE gets backfilled and "plain" and "blank" are
 *     negations CLIP cannot use, so every flat panel in frame is named as
 *     CARRYING a real object, in the output order and in the pools both. On the
 *     path where this was measured the batch average went UP — it is a
 *     set-dressing win, not a tax. (c) SHRINK THE AREA: filling one surface only
 *     MIGRATES the lettering to the nearest unfilled strip, so the win condition
 *     is a CROP, which the framing block already is.
 *     ✅ Worth knowing for anyone tuning this path: a round bale's END IS A
 *     CIRCLE, and plank sides, cloth and tool handles are all safe substrates —
 *     the dividing line is whether the object's SHAPE is already a sign. This
 *     path's only genuine sign-shaped surfaces are the ones deleted in (a).
 *  7. 🚜 NO MOTORISED MACHINERY, AND IT IS NOT A COMPROMISE. Besides the text
 *     reason in law 6: an object whose most famous image is a modern machine
 *     beats every old-fashioned qualifier around it (the modern-prior noun trap,
 *     measured on FaeBot, where "a tiny wedding" rendered a full-size modern
 *     bride and groom with the fairies as decoration), and it would fight this
 *     bot's own identity fragment, which states in EVERY prompt that "every
 *     tool, structure, and object is charming, old-fashioned, and personal in
 *     scale". The path does not need one: the SCALE comes from the bales and the
 *     field, and a heaped wagon, hand rakes and pitchforks carry the LABOUR.
 *  8. 💡 THE LIGHT LAW. This is an exterior path so the in-the-room source rule
 *     does not apply, but the two measurements that came with it do. On
 *     `lambing-season` the ~4 entries describing light as EVEN produced every
 *     sober frame in the batch, and every render grading 4.1 or above had TWO
 *     COMMITTED COLOURS IN VISIBLE OPPOSITION. So `even|evenly|uniform|diffuse|
 *     flat light|soft ambient|ambient|balanced|overcast|dull` are banned AS
 *     DESCRIPTIONS OF LIGHT (sweep: 0 hits) and every entry names two opposed
 *     colours and what each one is ON. And light is never a solid object:
 *     `shaft|beam|ray|column|pillar|curtain` of light renders as a literal
 *     solid, so the LIT SURFACE is named first and a flat BAND across a named
 *     surface is the one safe shape. That is also what carries the path's
 *     signature image — the whole air between the camera and a low sun packed
 *     with drifting hay dust, every speck of it lit, stated as THE AIR IS PACKED
 *     WITH LIT MOTES and never as light streaming or pouring.
 *     ⚠️ And one corridor rule lives in the light axis too, because that is the
 *     axis that can break it: long shadows RAKE ACROSS the picture from one
 *     side. A shadow running away from the camera toward a point is a
 *     vanishing-point instruction wearing a lighting costume.
 *  9. 🗣️ THE JARGON TRAP, and haymaking's vocabulary is one of the worst
 *     minefields in farming because a layperson pictures a different object for
 *     nearly every term. Banned as words with plain replacements written into
 *     the recipe: swath/swathe (a swathe of cloth), windrow (→ A LONG COMBED
 *     RIDGE OF RAKED GRASS), tedder/tedding, mow/mown/mowed/mower/lawn (a mown
 *     field is a suburban lawn → CUT), crop (a haircut, and a photo crop → THE
 *     STANDING GRASS), silage, haylage, sward, ley, aftermath (a real haymaking
 *     word that means something else entirely to everyone else), rick, header,
 *     pickup (a truck), elevator (a lift), loader, conditioner, chaff (→
 *     DRIFTING HAY DUST), board.
 *     ⚠️ AND TWO PREMISE WORDS, which is the more expensive half, because the
 *     offender is the path's own NAME:
 *       • "BALING" IS A HOMOPHONE OF "BAILING" — bailing out a boat, bail
 *         bonds. The Flux-facing words are HAYMAKING, THE HAY HARVEST and BALES
 *         OF HAY. The path's own name never reaches a prompt.
 *       • "STUBBLE" IS FACIAL HAIR to everyone outside farming, on a path that
 *         puts human faces in frame — so it is a beard generator as well as the
 *         subtraction in law 1. Doubly banned.
 *       • And one found the same way, worth keeping because it is the least
 *         obvious on the list: "HAYMAKER" IS A BIG SWINGING PUNCH to everybody
 *         outside farming, on a path full of people swinging things. The people
 *         are THE FARMER, THE FARMERS or THE CREW.
 * Also swept clean at source: negation phrasing; the implied off-frame person
 * ("someone left it", "nobody has straightened it") which is a person the model
 * will invent and put in the picture; a PERSON in the bales pool, which is
 * rolled in the no-character branch too (the `evening-chores` uninvited-figure
 * bug's entry point on this bot); per-object anatomy on a cluster (a bale
 * "resting on its neighbour's shoulder" — the lakeside personified river-stones
 * bug); the dark+light contradictory pairing; metaphorical light-as-object;
 * formation, row and mirror wording; reaction-only verbs, which collapse to a
 * static figurine pose; `expression`/`face of` tokens, which are the
 * papaya-guava-orchard drawn-face bug's entry point; commercial scale; modern
 * dress; and the rust/dark-red family, which on this bot rendered two bright wet
 * orange-red runs down a gate post and reads as blood on any path with blades.
 *
 * Pools: scripts/bots/farmbot/seeds/farmbot_hay_*.json — required DIRECTLY
 * here, never added to pools.js (shared file, concurrent agents).
 * Gen script for the 5 Sonnet-seeded axes:
 *   scripts/gen-seeds/farmbot/gen-hay-baling-summer-pools.js
 * (`farmbot_hay_animal.json` is HAND-AUTHORED — do not regenerate it. Three of
 * the five generated recipes are currently `append: false` because their first
 * generation was discarded wholesale, and the moment axis is TWO recipes that
 * must run in order — 3a wipes the file, 3b appends onto it. Read the gen
 * script's own notes before any top-up run, and flip those three back to
 * `append: true` first or you will lose the 14 hand-patched entries the
 * post-generation sweep produced.)
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT registered in pools.js.
const HAY_BALES = require('../seeds/farmbot_hay_bales.json');
const HAY_FIELD = require('../seeds/farmbot_hay_field.json');
const HAY_MOMENT = require('../seeds/farmbot_hay_moment.json');
const HAY_CREW = require('../seeds/farmbot_hay_crew.json');
const HAY_LIGHT = require('../seeds/farmbot_hay_light.json');
const HAY_ANIMAL = require('../seeds/farmbot_hay_animal.json');

// Manual archetype filter — see the header note on why pickCharacter's tag
// filter is a no-op here. BYTE-IDENTICAL to lambing-season.js,
// apiary-beekeeping.js and sheep-shearing-day.js on purpose: it is proven, and
// diverging it would be an unmeasured second variable. Drops archetypes
// carrying an occupation or a held prop that is a genuine physical mismatch in
// a hayfield: bakery/café serving props, a shopkeeper's ledger or measuring
// tape, a weaver's shuttle or loom, a potter's clay apron or kiln, a
// carpenter's saw or chisel, a fisher's net or lure, an innkeeper's tray or mug
// charm, a florist's bouquet. Keeps the farm girl/boy, shepherd, gardener,
// herbalist, orchard-hand and settled-traveler registers, every one of which
// reads naturally out in a field at haymaking.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|bakery|flour|dough|pastry|cocoa|cake|bread|oven|knead|caf[eé]|coffee|barista|teacup|dish towel|serving tray|\btray\b|shopkeeper|ledger|measuring tape|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|angler|\bnet\b|\blure\b|anchor charm|shell pendant|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm|florist|flower seller|bouquet)\b/i;
const HAY_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'animal'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Reproduces pools.pickCharacter()'s combining logic exactly (archetype +
// gender-matched hairstyle + hair colour + eye colour + skin tone), sourcing
// the archetype from the filtered subset above. Uses only pools.js's exported
// pieces — no pools.js edit. See the header note.
function pickHayCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(HAY_ARCHETYPES, `${axisPrefix}_archetype`);
  const gender = pools.genderOf(archetype) || 'ANY';
  const hairstyle = picker.pickWithRecency(pools.byTags(pools.HAIRSTYLE, [gender]), `${axisPrefix}_hairstyle`);
  const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), `${axisPrefix}_hair_color`);
  const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), `${axisPrefix}_eye_color`);
  const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), `${axisPrefix}_skin_tone`);
  return `${archetype.description}
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}`;
}

module.exports = ({ sharedDNA, picker }) => {
  // FarmBot's standardized character / pure-scene split (Kevin 2026-09-09,
  // applied bot-wide at 0.6), nudged up to 0.65 for the same shape of reason
  // sheep-shearing-day nudged it: on this path a person IS the scale ruler —
  // the crew's shoulders reaching only the top of a bale is what makes an
  // enormous cylinder read as enormous — and LABOUR is the path's whole
  // differentiator against three neighbouring leisure paths. A hay-only shot is
  // still fully on-brand: the 16 `standalone` moment entries were written to
  // read as haymaking on their own, with the wagon, the ruts, the raked ridges
  // and the tools left standing doing all the work.
  const includeCharacter = Math.random() < 0.65;

  // ★ THE HERO. Unconditional in both branches — the hay is the subject.
  const bales = picker.pickWithRecency(HAY_BALES, 'hay_bales');

  // ★ THE STAGE and the differentiator. Unconditional: the cut/uncut line is
  // the path's identity and it can never be dropped by a branch.
  const field = picker.pickWithRecency(HAY_FIELD, 'hay_field');

  // ★ The money shot. The no-character branch draws only the `standalone`
  // entries — the 9 `handled` ones name the farmer as a whole figure.
  const momentPool = (includeCharacter ? HAY_MOMENT : HAY_MOMENT.filter((e) => e.tags.includes('standalone'))).map(
    (e) => e.description
  );
  const moment = picker.pickWithRecency(momentPool, 'hay_moment');

  const character = includeCharacter ? pickHayCharacter(picker, 'hay_character') : null;
  // Gerund actions with an implied human subject — character branch only.
  const crew = includeCharacter ? picker.pickWithRecency(HAY_CREW, 'hay_crew') : null;

  const light = picker.pickWithRecency(HAY_LIGHT, 'hay_light');

  // A farm-animal cameo is a bonus here, not the life-guarantee: the bales and
  // the field are unconditional and the standalone moment set already carries
  // an animal family, so a no-character render can never come back bare and
  // `pools.pickPureSceneLife` (whose whole job is that guarantee) would only
  // stack a second creature on top. Gated low so it stays an occasional delight
  // and so the brief stays short; odds raised a little when nobody is in frame.
  const animal =
    HAY_ANIMAL.length && Math.random() < (includeCharacter ? 0.25 : 0.4)
      ? picker.pickWithRecency(HAY_ANIMAL, 'hay_animal')
      : null;

  // Short, front-loaded FRAMING block — the load-bearing constraint, placed in
  // the one part of a FarmBot brief that reaches the attended region (see the
  // header). It carries three things and nothing else: the OCCASION named
  // explicitly (a path whose identity is an EVENT rather than a subject must
  // state that event in the emitted prompt; an axis that merely implies it is
  // not enough), the CROP that fixes the scale, and the CROSSWISE geometry that
  // is this path's anti-corridor fix and, at the same time, its text fix.
  const framing = `━━━ FRAMING (read first) ━━━
High summer, haymaking, this field half cut. The nearest round bale is an enormous drum of dry hay
right at the camera, CROPPED by the edge of the picture, its top above the head of everything else in
frame. The pale cut floor fills the near half and runs off both side edges; the tall uncut grass is a
BAND across the upper part, the hard line between them crossing from the left edge to the right edge,
both ends out of frame.${character ? ' The farmer is right in among the hay, large and close — one or two people at most, and they are the only people in the whole field.' : ''}

`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${framing}━━━ THE HAY (the hero) ━━━
${bales}

━━━ WHAT IS HAPPENING NOW ━━━
${moment}

━━━ THE FIELD ━━━
${field}
${character ? `\n━━━ THE FARMER (close, never distant) ━━━\n${character}\n` : ''}${
    crew ? `\n━━━ DOING ━━━\n${crew}\n` : ''
  }${animal ? `\n━━━ ALSO IN FRAME ━━━\n${animal}\n` : ''}
━━━ LIGHT & AIR ━━━
${light}

WRITE IN THIS ORDER: (1) the art-style words from the top of this brief, first, word for word; (2) high summer haymaking, the nearest round bale ENORMOUS and CROPPED by the picture's edge, then the rest of the hay exactly as the hay block names it, scattered wide across the cut ground and none of it shrinking toward a point — the tall uncut grass at the line comes only a third of the way up a bale's end, and any stack is two bales high; every bale a clean correctly-sized drum, none singled out for close detail, because the one you describe most comes out biggest; (3) the cut ground a pale bristled floor of cut stalks with bare soil showing between them, running off both side edges, the tall uncut grass a dense wall banding the top, and THE HARD LINE WHERE CUT MEETS STANDING CROSSING THE WHOLE PICTURE FROM THE LEFT EDGE CLEAN OUT OF THE RIGHT, both of its ends out of frame; (4) what is happening now, naming the person or the animal doing it; (5) any wagon side, field gate, bench or tool handle that IS in the frame, bare weathered timber, each carrying a real object — a coiled rope, a leaning rake, a stone jar in the shade underneath; ${
    character
      ? "(6) the farmer, close and large, whole face visible, mid-action, shoulders reaching only the top of a bale, one or two people at most and the only people in the field; (7) light, naming the lit surface first, every shadow raking ACROSS the picture from one side"
      : '(6) light, naming the lit surface first, every shadow raking ACROSS the picture from one side'
  }. Describe only what IS present.

LENGTH IS THE LAST RULE: ONE paragraph, 100-130 words, counted. A tight 115-word scene beats a crammed 300-word one — name the hero, work the order, STOP.

${
  character
    ? `The hay takes the larger part of the frame, the farmer right in among it.
Every face, human and animal, stays separate and legible. The charm is the warm linework, light and
colour, never a face drawn onto an object.`
    : `No human figure anywhere in the frame — the hay and the cut field carry the whole scene, richly
detailed and close at hand. The charm is the warm linework, light and colour, never a face drawn
onto an object.`
}`;
};
