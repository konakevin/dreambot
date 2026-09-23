/**
 * FarmBot — sheep-shearing-day (new path, 2026-09-23).
 *
 * ━━━ THE GAP IT CLOSES (verified against the code, not against a brief) ━━━
 * FarmBot has 64 path FILES but 47 in `pathBuilders` — 34 active in `paths[]`,
 * 9 calendar-gated seasonal, 2 deactivated (first-snowfall, sugarcane-field)
 * and 2 in `shadowPaths[]`. A scan of every seed JSON that a LIVE path
 * actually requires found:
 *   • `shear` appears 63 times and EVERY ONE is a pair of GARDEN or PRUNING
 *     shears sitting on a flower-shop counter or leaning against a banana
 *     trunk. Not one is a sheep shear.
 *   • `wool` and `fleece` appear 236 times between them and every single one
 *     is either (a) a GARMENT — woolen socks, a wool blanket, a plaid wool
 *     shawl, a "short brown fleece back-panel vest", a "striped fuzzy fleece
 *     body-wrap" Halloween costume — or (b) an UNSHORN sheep's coat being
 *     described as thick and fluffy while it grazes.
 *   • `shorn` = ZERO. `clipper` = ZERO. `shearing shed` = ZERO. A wool bale,
 *     a wool sack, a wool heap, a shearing floor = ZERO.
 * So FarmBot has no SHEARING register, no WOOL-AS-A-HARVEST register and no
 * shed-in-full-swing register at all. That is a real gap on a farm bot: wool
 * is the entire economic reason sheep exist, shearing day is the loudest,
 * busiest, funniest day of the flock's year, and a newly-bare sheep is one of
 * the genuinely funny sights in farming that almost nobody has ever seen.
 * NOT REDUNDANT — checked both nearest live analogs:
 *   • `barn-animal-shelter-interior` is a CALM, RESTING, daytime barn whose
 *     bespoke pool is architecture-only and whose animals come from a 7-entry
 *     filter of the shared farmyard pool. No work is happening in it.
 *   • `lambing-season` (the sibling built this run) is a late-winter WORKING
 *     shed, so the stage rhymes — but its premise is birth and new life, its
 *     hero is a newborn, and it was already explicitly fenced against this
 *     path (no shears, no clippers, no wool being rolled, no wool sack, no
 *     shorn sheep anywhere in its six pools). Different season, different
 *     subject, different joke.
 * SCOPE FENCE, RETURNED: nothing here touches the lambing register — no
 * lambs, no newborns, no heat lamps, no lambing pens, no crates of young, no
 * bottle feeding, no udders, no birth. Enforced as a ban in every gen recipe
 * and verified at zero hits by post-generation sweep.
 *
 * ━━━ ⭐ THE BAR (Kevin's motto) ━━━
 * Playful, adventurous, VIVID, beautiful, CLEVER; show people something they
 * have never seen, or something familiar redressed as more interesting. The
 * dull failure here is precise: A MAN BENT OVER A SHEEP IN A DIM BROWN SHED.
 * It is on-brief, defect-free, documentary and instantly forgettable, and it
 * is what every photograph of shearing already looks like. So the whole path
 * is built so that shot cannot happen. What it aims at instead: a whole wool
 * coat peeling off in ONE unbroken blanket with a hand lifting its edge clear
 * of the floor; three just-shorn sheep standing beside two woolly ones at
 * barely half the width with their ears out sideways in total personal
 * outrage, faces and lower legs still woolly so they look like they are
 * wearing socks and a hat; a heap of wool higher than the shoulder of the
 * person forking at it; twenty woolly ones packed in the holding pen all
 * facing the same way, next in line and knowing it; the shorn mob going flat
 * out back into the field like school has let out; wall-board gaps laying
 * bright hard bands of gold across the swept plank floor with every band
 * packed with drifting wool motes; a barn cat asleep deep inside a half-full
 * bundle of wool, fully committed; a sheep standing square on top of the bale
 * stack it should not be on, with the calm authority of something that got
 * there by accident and has decided it was the plan; an enamel mug forgotten
 * on the top rail with wool stuck all round its base.
 *
 * ━━━ THE LOAD-BEARING CONSTRAINT ━━━
 * CLOSE IN AMONG THEM, DOWN AT SHEEP HEIGHT — never a wide shed with small
 * animals in it. Placed in THREE layers, deliberately:
 *   1. a short front-loaded FRAMING block (the proven
 *      barn-animal-shelter-interior / lambing-season pattern);
 *   2. item (2) of the required OUTPUT ORDER at the end (cross-bot lesson 22:
 *      a law appended to a seed tail reaches ~20% of prompts, the same law in
 *      the output order reaches 100% — measured 1-of-5 → 5-of-5);
 *   3. NO CAMERA AXIS AT ALL (see below).
 * It does double duty as the path's TEXT fix. Cross-bot lesson 52: a framing
 * law IS a text lever, because a receding rank of eight hurdle gates and bale
 * ends shows eight flat panels while a cropped near wall shows two — and
 * lesson 51 says that on a subject with several text-shaped surfaces, filling
 * them one at a time only MIGRATES the lettering to the nearest unfilled
 * strip, so the win condition is shrinking the text-bearing AREA in frame.
 *
 * ━━━ WHY THIS PATH HAS NO CAMERA AXIS ━━━
 * Same two measured reasons as lambing-season, and it is a deliberate
 * subtraction. First, the shared `farmbot_camera_composition.json` is
 * confirmed contaminated: the 2026-09-09 purge removed 11 over-the-shoulder
 * entries and tropical-flower-garden's re-QA then proved 51 of the remaining
 * 109 still slip a keyword blacklist, including every "Wide establishing
 * shot" variant — and on THIS path a single wide/aerial/establishing entry IS
 * the dull documentary render. Second, the cross-bot finding is that purging
 * the bad camera entries beats strengthening the mandate (BrickBot: every
 * hard fail across four batches traced to 3 of 25 camera entries against a
 * template that already carried an explicit rule and lost). Purging the whole
 * axis is the strongest form of that fix, and — the reason it is affordable
 * here — it buys back one output-order slot and ~25 words of brief on a path
 * whose headline constraint is LENGTH. The framing block carries the one
 * camera rule needed.
 *
 * ━━━ WHY THIS TEMPLATE IS SHORT, WHICH IS UNUSUAL FOR THIS BOT ━━━
 * Measured across 2,645 live bot renders on 2026-09-22: the fleet medians 250
 * emitted prompt words and most bots sit at 210-300, while FARMBOT MEDIANS
 * 562 WITH A 1,080 MAXIMUM AND ALL 399 OF ITS RENDERS OVER 350. Worse, the
 * shared `FARMBOT_COZY_NEUTRAL` fragment is 273 words starting at word 4 of
 * every prompt (cross-bot lesson 37), so Sonnet's scene does not begin until
 * word ~277 — and cross-bot lesson 43 measured the attention curve by
 * POSITION: content at 5-10% of the prompt renders 6 of 6, content past ~30%
 * renders 0 of 6 until it is moved. So most of a FarmBot path's own content
 * sits outside the attended region no matter what it says. That fragment is a
 * shared file and Kevin's call; what a new path CAN do is be short. So: 6
 * axes not 9, SEVEN output-order items not twelve, no camera axis, no SEASON
 * pull, no WEATHER pull, no GENTLE_MAGIC pull, and the word count as the loud
 * LAST rule. Benchmark to beat: `lambing-season` emitted a median of 158
 * Sonnet-written words, the shortest path on this bot and the only one under
 * 200. Note that a word cap only RE-ORDERS the output once one exists
 * (measured twice); what actually SHORTENS it is deleting template PROSE and
 * output-order ITEMS, which is what this template does.
 *
 * ━━━ AXES (6 bespoke + one setting roll) ━━━
 * A SETTING is rolled FIRST — 70% the shearing shed in full swing, 30% the
 * yard and pens just outside — and every setting-sensitive pool is tagged
 * shed / yard / ANY so the hero, the flock, the dressing, the craft, the light
 * and the animal cameo can never disagree about where the shot is. This is the
 * apiary pattern, and it exists because a prose compatibility clause loses to
 * a pool pick every single time (measured on DinoBot amber-forest and again on
 * ToyBot snow-globe-world, where "if the moment names a place the world does
 * not have, adapt or drop it" did NOT hold and a harbour rowboat turned up in
 * a desert). A LOCAL DRY-RUN of the composed brief is what proved the tagging
 * actually holds here, and it also caught the one genuine build bug — see the
 * gen script's recipes 5b/3b: both setting-tagged pools came back 25-shed /
 * 0-yard and 24-shed / 1-yard from a meta-prompt that ASKED for a split, which
 * on the 30% yard branch is not a variety problem but an EMPTY ARRAY handed to
 * the picker. Seeded each side as its own recipe and counted the tags.
 *   • shearing_moment   ★ THE SIGNATURE MONEY-SHOT AXIS — the beat happening
 *                         now, at output-order position 3. Every entry LEADS
 *                         WITH THE ANIMAL OR THE SHEARER DOING IT, because a
 *                         named action with no named actor renders the body
 *                         part alone (cross-bot lesson 25: a cup "held out
 *                         from the next deck" drew a giant floating hand and
 *                         forearm, duplicated at two scales — measured twice
 *                         again in the 2026-09 run). Tagged `handled` /
 *                         `standalone`: 7 entries genuinely need a person and
 *                         name "the shearer" as a whole figure, so the
 *                         no-character branch draws only the 18 `standalone`
 *                         ones — and those 18 were required to read as
 *                         shearing day ON THEIR OWN (the wool heap, the shorn
 *                         pen, the coat lying where it came off, the queue,
 *                         the release, the escape), so a no-character roll can
 *                         never lose the path's identity to the branch.
 *   • shearing_flock      the crowd, CO-LEAD, the path's COMEDY ENGINE and its
 *                         SIZE RULER. 14 of its 25 entries put a shorn animal
 *                         and a woolly animal in the SAME frame, because the
 *                         joke does not exist without both. See THE SCALE LAW
 *                         below — this axis is where it lives.
 *   • shearing_dressing   the set dressing, tagged shed / yard (25 + 10). Does
 *                         three jobs at once: (a) names what the shed is BUILT
 *                         OF and that its own walls close the frame down both
 *                         sides and its roof closes it overhead, because an
 *                         interior whose enclosing surfaces are described only
 *                         by adjective renders as a diorama in a void and
 *                         camera words do not fix it (cross-bot lesson 3);
 *                         (b) names one STRUCTURAL CUE of a working yard on
 *                         every yard entry AND closes the frame behind the
 *                         pens with a wall, a hedge, the hurdle race or the
 *                         shed's own gable, because an open yard is an
 *                         invitation to the wide establishing shot this path
 *                         exists to avoid; (c) blocks the text backfill — see
 *                         THE TEXT LAW below. 5 of its shed entries carry the
 *                         three-part CONTINUITY LAW in full.
 *   • shearing_craft      the human action, character branch only, gerund with
 *                         an implied subject. ZERO garment nouns by recipe
 *                         mandate — the SteamBot "captain-coat lock": an
 *                         action axis that names a garment dresses every
 *                         render the same way and overrides the wardrobe axis
 *                         entirely. Also written as a HAIRCUT, not a
 *                         procedure: no pinning, restraining, forcing or
 *                         wrestling into submission anywhere in the pool.
 *   • shearing_light    ★ the ONLY axis on this path that owns time of day,
 *                         weather, season and the colour of light. Every other
 *                         pool is deliberately silent on all four. It is
 *                         therefore the PALETTE axis and it commits — every
 *                         entry names TWO COMMITTED COLOURS IN VISIBLE
 *                         OPPOSITION and what each one is ON, and the word
 *                         "even" and its family are banned outright as
 *                         descriptions of light. See THE LIGHT LAW below.
 *                         25 shed + 10 yard.
 *   • shearing_animal     HAND-AUTHORED (16, shed/yard tagged) — the gated
 *                         farm-animal cameo, and the reason it is bespoke
 *                         rather than the shared ANIMAL_COMPANIONS pool is
 *                         that that pool's entries carry their own setting AND
 *                         their own time of day (a drowsy calf "in golden
 *                         hay… an afternoon nap"), which would put a second
 *                         time-of-day statement in the brief. These 16 name no
 *                         light and no weather at all, and every one carries a
 *                         SIZE OR POSITION word ("small at the far end",
 *                         "small on the top rail"), because a life-pool entry
 *                         with no size or distance word renders at HERO SCALE.
 *
 * Shared pools used: ONLY CHARACTER_ARCHETYPE + HAIRSTYLE / HAIR_COLOR /
 * EYE_COLOR / SKIN_TONE, via the local mirror of pickCharacter below.
 * Deliberately NOT pulled, each for a measured reason:
 *   - SEASON — its entries are landscape-hero spring meadows and autumn
 *     hedgerows, which would compete with the dressing axis for the stage and
 *     would put a second season statement in the brief.
 *   - WEATHER_ATMOSPHERE — `shearing_light` replaces it (the same precedent as
 *     artisan-workshop, lambing-season and all 8 tropical paths). Pulling both
 *     puts two competing time-of-day statements in one brief.
 *   - CAMERA_COMPOSITION — see the no-camera-axis note above.
 *   - ACTIVITY — its chore+farm entries are laundry lines, dough and
 *     strawberry picking; nothing shearing-shaped. `shearing_craft` is
 *     bespoke.
 *   - ANIMAL_COMPANIONS — carries its own setting and time of day, and its
 *     sheep entries are all GRAZING woolly sheep in a meadow, which is the
 *     exact generic image this path exists to avoid.
 *   - GENTLE_MAGIC — dropped outright, not filtered. Its entries are almost
 *     all built on a LIGHT observation ("moonlight pooling…"), which is what
 *     `shearing_light` owns and would contradict. And this path does not need
 *     it: a shed full of floating wool motes in hard bands of light, and a
 *     sheep discovering it is half the width it used to be, ARE the everyday
 *     wonder. Dropping it also shortens the brief.
 *
 * ━━━ WHY pickCharacter IS MIRRORED LOCALLY AND NOT CALLED ━━━
 * `pools.pickCharacter(picker, tags, prefix)` filters CHARACTER_ARCHETYPE with
 * `byTags`, whose OR-match lets any entry tagged `"ANY"` through BY DESIGN —
 * and 67 of the 116 archetypes carry `"ANY"`. Passing tags is therefore a
 * no-op that leaks bakers, café owners, potters and market vendors into a
 * shearing shed; that exact bug produced "a baker with a dough-cutter in a
 * flower garden" on tropical-flower-garden. So this file does what
 * artisan-workshop.js, tropical-flower-garden.js, apiary-beekeeping.js and
 * lambing-season.js already do on this bot: manually content-filter the
 * archetypes, then reproduce pickCharacter's combining logic EXACTLY
 * (archetype + gender-matched hairstyle + hair colour + eye colour + skin
 * tone) from pools.js's own exported pieces. The helper's whole purpose —
 * defeating the "same person every time" homogenisation trap by atomising
 * appearance and gender-matching the hairstyle — is preserved verbatim; only
 * the archetype source list is narrowed. `pools.js` is NOT edited.
 *
 * ━━━ THE FIVE TRAPS THIS PATH WAS BUILT AGAINST ━━━
 *  1. 🩸 THE BLOOD TRAP, and it is the one that makes this path harder than
 *     its sibling. Cross-bot lesson 31, measured on THIS BOT: on
 *     `lambing-season` round 2, "a faded blue gate on a rope hinge,
 *     rust-orange hinges showing at the post" rendered two bright wet
 *     orange-red runs streaking down the gate post AND down the crook leaning
 *     beside it. A rust word on a wet farm path is a blood generator, and no
 *     text, scale, negation or personification sweep is looking for it. On a
 *     path that has BLADES, a WRESTLED ANIMAL and FRESHLY-BARED SKIN it is far
 *     worse. So the whole red-brown family is banned at the recipe
 *     (`rust|rusted|rust-orange|rusty|corroded|crimson|scarlet|maroon|
 *     dark red|deep red|blood-red|oxblood|ruddy|ochre-red|red`), worn steel is
 *     "worn silver-bright", and the entire INJURY REGISTER is banned as a
 *     register: no blood, nick, cut skin, graze, scrape, wound, sore, raw
 *     patch, bandage, ointment, flinch, struggle, distress, panic, restraint
 *     or pinning down. It is crowded out POSITIVELY as well as banned, which
 *     is the only half CLIP can actually use: SHEARING IS A HAIRCUT AND THIS
 *     SHED IS IN A GOOD HUMOUR — the newly-bared coat is stated everywhere as
 *     CLEAN, PALE CREAM, CLOSE AND EVEN, exactly like a fresh haircut, with
 *     the face and lower legs left woolly so the animal looks like it is
 *     wearing socks and a hat. Post-generation sweep: 0 hits on either family
 *     in any of the six pools.
 *  2. ⚖️ THE SCALE LAW, AND ITS CORRECTION. Cross-bot lesson 13 measured on
 *     THIS BOT's own apiary path over 18 renders: THE SIZE OF AN ANIMAL TRACKS
 *     ITS COUNT, NOT ANY SIZE WORD YOU WRITE, because the model hands each
 *     named subject a share of the frame — a low count IS the giant-animal
 *     generator. So every entry names a real COUNT and rules the sheep against
 *     something IN FRAME welded to a larger structure (a hurdle's bottom or
 *     second rail, the top of a bale, the shed doorway's height, the top of
 *     the yard gate, the swept plank floor). A free-floating ruler inflates
 *     too ("no bigger than a single clover floret" produced a fist-sized
 *     clover) and off-camera rulers buy nothing, so both are banned — and the
 *     sweep caught three entries that had independently reached for "a hand's
 *     width" and "a hand below the top rail" anyway, which is cross-bot lesson
 *     44 exactly (satellite axes reach for the banned ruler when the law rides
 *     on only one axis; all three were reworded).
 *     ⚠️ AND THE CORRECTION, measured on this bot on 2026-09-23 and the reason
 *     apiary went 3.86 → 4.37: "CAP THE DETAIL AT THE NEAREST ONE OR TWO" IS
 *     ITSELF THE INFLATOR AND IT UNDOES A CORRECT RULER. 20 of 30 apiary
 *     entries welded a correct ruler and then added a close anatomy clause for
 *     the nearest subject, and the anatomy beat the ruler every single time,
 *     producing hand-sized bees at exactly the rate the clause appeared;
 *     stripping it took giant bees 3 of 5 → 0 of 6. So NO SHEEP HERE GETS A
 *     DETAIL EXEMPTION, not even the nearest, and the reason is stated in the
 *     template so it survives editing: THE ONE YOU DESCRIBE MOST IS THE ONE
 *     THAT COMES OUT BIGGEST. (Note that this path's sibling
 *     `apiary-beekeeping` still carries "detail on the nearest one or two
 *     only" in its own required OUTPUT ORDER — i.e. in the one layer that
 *     reaches 100% of prompts — which looks like the fix having been applied
 *     to the pools and the template prose but not to the order. Flagged for
 *     Kevin, not touched from here.)
 *     The ONE thing deliberately allowed to be BIG is the WOOL HEAP, because a
 *     mountain of wool is one of this path's best shots — but it is ruled too,
 *     so that big reads as big rather than as confusing.
 *     ⚠️ NO PARITY CLAUSE anywhere in this template, even though Kevin's
 *     standing FarmBot rule is that animals share equal spotlight with humans
 *     ([[feedback_farmbot_animal_spotlight_parity]]) — because DETAIL AND SIZE
 *     ARE THE SAME DIAL and an animal-parity clause ("the bees rendered as
 *     carefully as the person") ENLARGED them. The rule is honoured the way
 *     the measurement says it must be: by buying the animals FRAME SHARE (they
 *     lead the output order, they are unconditional in both branches, and they
 *     take the larger part of the frame) rather than by asking for equal
 *     per-subject detail.
 *  3. 💡 THE LIGHT LAW, and this path is ~70% interior so it is load-bearing.
 *     Cross-bot lesson 30, measured on THIS BOT: `lambing-season`'s three
 *     flattest, palest renders were all shed interiors that had rolled an
 *     OUTDOOR light entry ("hard midday sun", "a butter-yellow low sun in a
 *     clear pale-blue sky", "a cold clear dawn") — which a shed physically
 *     cannot show, so Flux had nothing to anchor the light to, rendered flat
 *     ambient daylight, and took the whole palette pale. Retagging those and
 *     adding in-frame sources moved shed renders 3.60 → 3.98 in one round. So
 *     every `shed` light entry names a source the shed ITSELF contains (a work
 *     lamp on its flex, a hurricane lantern on a bale, the wide open end, the
 *     open doorway, the gaps between the wall boards, the one translucent
 *     sheet in the tin roof) and says what its light LANDS ON; an outdoor sky
 *     or sun is tagged `yard` only, and this pool has NO `ANY` tag at all.
 *     Two further measurements from that same batch are baked in: the ~4
 *     entries describing light as EVEN produced every sober frame in it (so
 *     `even|evenly|uniform|diffuse|flat light|soft ambient|ambient|balanced`
 *     are banned AS DESCRIPTIONS OF LIGHT — sweep: 0 hits), and every render
 *     grading 4.1 or above had TWO COMMITTED COLOURS IN VISIBLE OPPOSITION (so
 *     every entry is required to name two and say what each is on, with the
 *     warm-against-cool family the largest of the three at 12 of 25). The
 *     aperture sibling is handled too: a small dark opening plus a glow word
 *     RELOCATES THE GLOW (lesson 15, measured on this bot — "the smoker's fuel
 *     door propped open" + "the faintest ember glow within" painted a FURNACE
 *     MOUTH BURNING INSIDE A BEEHIVE), so no glow, ember or coal may sit
 *     inside, within or behind any opening. And light is never a solid object:
 *     `shaft|beam|ray|column|pillar|curtain` of light renders as a literal
 *     solid, so the LIT SURFACE is named first and a flat BAND across a named
 *     surface is the one safe shape. That is also what carries the path's
 *     signature image — the wall-board gaps laying bright bands across the
 *     swept floor with every band packed with drifting wool motes.
 *  4. 📝 THE TEXT LAW, and wool makes this the hardest text subject on the
 *     bot. Three levers, all needed, and they are three DIFFERENT cross-bot
 *     lessons that have to compose:
 *     (a) DELETE, don't describe (lesson 12): a wool sack carries a stencilled
 *         brand and a shearing shed's real prop list includes a CHALK TALLY
 *         BOARD — both are TEXT-SHAPED, and any description of a text-shaped
 *         surface is a summons ("every dial is a blank white enamel face" is,
 *         to Flux, a description of a clock face, and Flux's clock prior ships
 *         numerals no matter how the clause is worded). So the tally board,
 *         the chalk board, the pen board, the stencilled sack, the printed
 *         sack, the label, the sign, the clipboard and the notebook are
 *         deleted from every layer, along with the whole synonym family
 *         (label/lettering/writing/words/numbers/mark/marking/glyph/sigil/
 *         stamped/stencilled/engraved/etched/inscribed/script/plaque/sign/
 *         signage/chalkboard/tally/clipboard/notebook/ledger).
 *     (b) FILL WHAT THE DELETION EMPTIED, and make the filling carry the
 *         interest (lessons 26/27/14): an ABSENCE gets backfilled, and "plain"
 *         and "blank" are negations CLIP cannot use, so wool is stored only as
 *         a loose open HEAP, a BOUND BUNDLE tied round with twine, or an
 *         open-topped crate with wool spilling over the rim — and every flat
 *         panel in every dressing entry is named as CARRYING a real object (a
 *         coiled rope on a nail, hand shears hanging by their bow, a bucket on
 *         its handle, a besom broom in a drift of loose wool, an enamel mug
 *         forgotten on a rail with wool stuck round its base). Done right this
 *         is a set-dressing WIN, not a tax — on the path where it was measured
 *         the batch average went UP.
 *     (c) SHRINK THE AREA, because filling alone is not enough (lesson 51,
 *         measured on MangaBot today): filling one surface MIGRATES the
 *         lettering to the nearest remaining unfilled strip, and the rate
 *         barely moves while only the prominence falls. On a subject with
 *         several text-shaped surfaces the win condition is leaving no
 *         unfilled strip at all, which usually means a CROP (lesson 52 — a
 *         framing law is a text lever, because a receding rank of eight hurdle
 *         gates shows eight flat panels where a cropped near wall shows two).
 *         That is a second job the FRAMING block is doing.
 *     The same clause also sits at item (5) of the REQUIRED OUTPUT ORDER,
 *     covering the rails, the bale ends and the door or gate BY NAME and
 *     positively, because a rule that must appear on every render goes in the
 *     order and not in a rules block (lesson 22). Post-generation sweep: 0
 *     text-prior hits in any of the six pools.
 *  5. 🗣️ THE JARGON TRAP. Cross-bot lesson 28, and shearing's own vocabulary
 *     is one of the worst minefields in farming because a layperson pictures a
 *     different object for nearly every term: `comb` and `board` are already
 *     documented offenders on other bots, `skirting` is a skirting board,
 *     `crutch` is a crutch, `belly` and `cast` and `class` and `blow` are all
 *     something else entirely. Banned as words with plain replacements written
 *     into the recipe: board (the shearing floor → THE SWEPT PLANK FLOOR),
 *     comb, cutter, down-tube, crutch, crutching, belly wool, catching pen (→
 *     THE HOLDING PEN), wether, hogget, dag, dags, skirting, classing, blow,
 *     long blow, roustabout, presser, bale press, wool table, cast. ("Wall
 *     boards" and "boarding" as the shed's CONSTRUCTION stay — it is only "the
 *     board" as the floor that is banned, and the sweep's 5 hits on "wall
 *     boards" are the enclosure law working as designed.)
 *     ⚠️ AND THE PREMISE NOUN ITSELF, which is lesson 47's form and the more
 *     expensive half: FLEECE READS AS A POLYESTER FLEECE JACKET. This is not
 *     speculative on this bot — its own live seed pools already contain "a
 *     short brown fleece back-panel vest" and "a black-and-yellow striped
 *     fuzzy fleece body-wrap". So the Flux-facing noun is WOOL throughout,
 *     exactly the cloud→mist move that took BloomBot's hard-vista rate 3/6 →
 *     0/6; "fleece" is legal only in the form "one whole fleece of wool", and
 *     the sweep found the word appears ZERO times in all six pools.
 * Also swept clean at source: negation phrasing; the dark+light contradictory
 * pairing (the fishing-dock bug, a live risk here with steam, bare backs and a
 * work lamp); metaphorical light-as-object; implied-person language outside the
 * craft pool and the `handled` heroes; per-object agency on a cluster (a pen of
 * sheep IS a cluster — the lakeside personified river-stones bug); formation
 * and row wording (a corridor/mirror generator); vanishing-point wording on the
 * HERO pool as well as the setting pool (lesson 29); reaction-only verbs (they
 * collapse to a static figurine pose); animal `expression`/`look of` tokens,
 * which the sweep caught twice and which are the papaya-guava-orchard
 * drawn-face bug's entry point on this bot; commercial scale; and named obscure
 * breeds.
 *
 * ━━━ ⭐ QA HISTORY — 3 rounds × 6 shadow renders, ONE VARIABLE PER ROUND ━━━
 * 18 renders, 18 successes, ZERO Replicate content-filter failures (worth
 * noting: the two sibling close-range farm-animal paths on this bot trip that
 * filter at 12-17%, and this path has blades and hands among animals, so a
 * clean 18 for 18 was not a given).
 *
 * The entire QA arc was ONE defect, and it is the path's premise: THE BARE
 * SHEEP. Every other trap this file was built against held from round 1 and
 * never moved — 0 readable text in 18 of 18, 0 blood or red on any animal in
 * 18 of 18, 0 lambing-fence violations, 0 giant animals, 0 diorama-in-a-void
 * sheds, 0 split panels, correct scale throughout.
 *
 * | round | the ONE variable changed | bare body renders |
 * | --- | --- | --- |
 * | 1 | (baseline) "just-shorn, pale cream and close-cropped, at half the width" | **0 of 6** |
 * | 2 | reworded per lesson 48: "clipped right down to smooth cream stubble, slim and leggy as young goats, no fluff on the body anywhere" | **1 of 6** (+1 partial) |
 * | 3 | reframed as a POSITIVE OBJECT: "an ENTIRELY DIFFERENT ANIMAL — a smooth cream body shaped like a GREYHOUND, WEARING a woolly HAT and four woolly SOCKS", one or two set against a named woolly majority | **5 of 6** |
 *
 * Round 3 changed ONLY the output-order clause — the six pools are byte-
 * identical between rounds 2 and 3 — so the movement is attributable to that
 * wording alone. Round-3 grades against the motto: 4.7 / 4.6 / 4.6 / 4.5 /
 * 4.2 / 4.0, average ~4.4.
 *
 * ⭐ THE REUSABLE LESSON, and it is the most valuable thing this build
 * produced: THE MODEL ADDS BUT DOES NOT SUBTRACT, AND THE PROOF WAS SITTING
 * INSIDE THE SAME SENTENCE THE WHOLE TIME. Round 2's clause had an additive
 * half and a subtractive half. The additive half — "woolly cuffs still at the
 * ankles" — rendered in 6 OF 6, every single round, unmistakably. The
 * subtractive half — "no fluff on the body anywhere" — rendered in 1. Same
 * sentence, same position, same prompt. This is the negation-leak law in a new
 * costume and a sharper one: it is not only that naming a banned noun renders
 * it, it is that REMOVING AN EXPECTED FEATURE FROM A STRONG PRIOR CANNOT BE
 * DONE BY DESCRIPTION AT ALL. The fix is never a better adjective for the
 * absence; it is to name a POSITIVE OBJECT that happens not to have the
 * feature — here a borrowed SHAPE prior from an animal that has no wool, plus
 * a hat and socks the model can put ON something, plus odd-one-out framing.
 * Portable to any "bare / empty / shaved / stripped / cleared / melted /
 * drained / leafless" subject on any bot. And the cheap diagnostic that found
 * it: when a two-part clause half-lands, check whether the half that landed is
 * the additive one before touching position, length or model.
 *
 * Pools: scripts/bots/farmbot/seeds/farmbot_shearing_*.json — required DIRECTLY
 * here, never added to pools.js (shared file, concurrent agents).
 * Gen script for the 5 Sonnet-seeded axes:
 *   scripts/gen-seeds/farmbot/gen-sheep-shearing-day-pools.js
 * (`farmbot_shearing_animal.json` is HAND-AUTHORED — do not regenerate it. The
 * five generated pools run in append mode, so a re-run tops up rather than
 * wiping; a wipe-and-regen would lose the 9 hand-patched entries listed in the
 * sweep notes above. The dressing and light pools each carry a SECOND recipe
 * that seeds their `yard` half separately — see the gen script's recipes
 * 5b/3b for why a split asked for inside one meta-prompt is not a split you
 * get.)
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT registered in pools.js.
const SHEARING_MOMENT = require('../seeds/farmbot_shearing_moment.json');
const SHEARING_FLOCK = require('../seeds/farmbot_shearing_flock.json');
const SHEARING_DRESSING = require('../seeds/farmbot_shearing_dressing.json');
const SHEARING_CRAFT = require('../seeds/farmbot_shearing_craft.json');
const SHEARING_LIGHT = require('../seeds/farmbot_shearing_light.json');
const SHEARING_ANIMAL = require('../seeds/farmbot_shearing_animal.json');

// The setting is rolled FIRST — see the SETTING note in the header. 70% the
// shearing shed in full swing, 30% the yard and pens just outside it.
const SETTING_SHED_PCT = 0.7;

// Manual archetype filter — see the header note on why pickCharacter's tag
// filter is a no-op here. Drops archetypes carrying an occupation or a held
// prop that is a genuine physical mismatch in a shearing shed: bakery/café
// serving props, a shopkeeper's ledger or measuring tape, a weaver's shuttle
// or loom, a potter's clay apron or kiln, a carpenter's saw or chisel, a
// fisher's net or lure, an innkeeper's tray or mug charm, a florist's bouquet.
// Keeps the farm girl/boy, shepherd, gardener, herbalist, orchard-hand and
// settled-traveler registers, every one of which reads naturally here.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|bakery|flour|dough|pastry|cocoa|cake|bread|oven|knead|caf[eé]|coffee|barista|teacup|dish towel|serving tray|\btray\b|shopkeeper|ledger|measuring tape|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|angler|\bnet\b|\blure\b|anchor charm|shell pendant|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm|florist|flower seller|bouquet)\b/i;
const SHEARING_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'animal'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Reproduces pools.pickCharacter()'s combining logic exactly (archetype +
// gender-matched hairstyle + hair colour + eye colour + skin tone), sourcing
// the archetype from the filtered subset above. Uses only pools.js's exported
// pieces — no pools.js edit. See the header note.
function pickShearingCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(SHEARING_ARCHETYPES, `${axisPrefix}_archetype`);
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

/** Entries tagged for this render's setting ('ANY' always passes), as strings. */
function forSetting(pool, setting) {
  return pool.filter((e) => e.tags.includes('ANY') || e.tags.includes(setting)).map((e) => e.description);
}

module.exports = ({ sharedDNA, picker }) => {
  // THE SETTING ROLL, first — rolled before anything else so every axis below
  // draws from a physically compatible set.
  const setting = Math.random() < SETTING_SHED_PCT ? 'shed' : 'yard';
  const inShed = setting === 'shed';

  // FarmBot's standardized character / pure-scene split (Kevin 2026-09-09,
  // applied bot-wide), nudged up from 0.6 because a shorn sheep is the hero
  // here and the craft axis is where half the charm lives. A flock-only shot
  // is still fully on-brand: the 18 `standalone` hero entries were written to
  // read as shearing day on their own.
  const includeCharacter = Math.random() < 0.65;

  // ★ The money shot. The no-character branch draws only the `standalone`
  // entries — the 7 `handled` ones name "the shearer" as a whole figure.
  const momentPool = forSetting(
    includeCharacter ? SHEARING_MOMENT : SHEARING_MOMENT.filter((e) => e.tags.includes('standalone')),
    setting
  );
  const moment = picker.pickWithRecency(momentPool, `shearing_moment_${setting}`);

  // UNCONDITIONAL — the flock is the co-lead AND the path's size ruler, so it
  // is never dropped in either branch.
  const flock = picker.pickWithRecency(forSetting(SHEARING_FLOCK, setting), `shearing_flock_${setting}`);

  const dressing = picker.pickWithRecency(forSetting(SHEARING_DRESSING, setting), `shearing_dressing_${setting}`);

  const character = includeCharacter ? pickShearingCharacter(picker, 'shearing_character') : null;
  // Gerund actions with an implied human subject — character branch only.
  const craft = includeCharacter
    ? picker.pickWithRecency(forSetting(SHEARING_CRAFT, setting), `shearing_craft_${setting}`)
    : null;

  const light = picker.pickWithRecency(forSetting(SHEARING_LIGHT, setting), `shearing_light_${setting}`);

  // A farm-animal cameo is a bonus here, not the life-guarantee: the flock is
  // unconditional, so a no-character render can never come back bare and
  // `pools.pickPureSceneLife` (whose whole job is that guarantee) would only
  // stack a second creature on top of them. Gated low so it stays an
  // occasional delight and so the brief stays short; odds raised a little when
  // nobody is in frame.
  const animalPool = forSetting(SHEARING_ANIMAL, setting);
  const animal =
    animalPool.length && Math.random() < (includeCharacter ? 0.25 : 0.4)
      ? picker.pickWithRecency(animalPool, `shearing_animal_${setting}`)
      : null;

  // Short, front-loaded framing block — the load-bearing constraint, plus the
  // OCCASION named explicitly (a path whose identity is an EVENT rather than a
  // subject must state that event in the emitted prompt; an axis that merely
  // implies it is not enough) and, on the shed branch, the enclosure (naming
  // the enclosing surfaces is what stops a diorama in a void; camera words do
  // not). It is also the path's crop, which is a text lever — see (c) in THE
  // TEXT LAW.
  const framing = `━━━ FRAMING (read first) ━━━
Shearing day, and the camera is in close among the sheep at their own height. The flock is close at
hand and owns the frame.${
    inShed
      ? ' The shed is small and working: its own walls close the frame down both sides and its roof closes it overhead.'
      : ' The yard is small and working, its wall or hedge close behind the pens.'
  }${character ? ' The shearer is right in among them, large and close.' : ''}

`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${framing}━━━ THE FLOCK (the hero) ━━━
${flock}

━━━ WHAT IS HAPPENING NOW ━━━
${moment}

━━━ THE ${inShed ? 'SHED' : 'YARD'} ━━━
${dressing}
${character ? `\n━━━ THE SHEARER (close, never distant) ━━━\n${character}\n` : ''}${
    craft ? `\n━━━ DOING ━━━\n${craft}\n` : ''
  }${animal ? `\n━━━ ALSO IN FRAME ━━━\n${animal}\n` : ''}
━━━ LIGHT & AIR ━━━
${light}

WRITE IN THIS ORDER: (1) the art-style words from the top of this brief, first, word for word; (2) shearing day, the sheep close at hand filling the frame at the count and the height named — and ONE OR TWO of them have already been done and now look like an ENTIRELY DIFFERENT ANIMAL: a smooth cream body shaped like a GREYHOUND, narrow as its own head, up on long bare legs, wearing a thick WOOLLY HAT on its head and four thick WOOLLY SOCKS on its ankles, standing right beside a barrel-round woolly one fully twice as wide; every animal a clean correctly-sized shape and none singled out for close anatomy, because the one you describe most is the one that comes out biggest; (3) what is happening now, naming the animal or the shearer doing it; (4) the hurdle rails, bale ends and ${
    inShed ? 'shed door' : 'yard gate'
  } plain weathered timber, each carrying the object named, every animal with its own real animal head; (5) the ${
    inShed ? "shed's walls closing both sides, its roof overhead" : 'wall or hedge close behind the pens'
  }; ${character ? '(6) the shearer, close and large, whole face visible, mid-action; (7) light' : '(6) light'}. Describe only what IS present.

LENGTH IS THE LAST RULE: ONE paragraph, 95-125 words, counted. A tight 110-word scene beats a crammed 300-word one — name the hero, work the order, STOP.

${
  character
    ? `The sheep take the larger part of the frame, the shearer right in among them.
Every face, human and animal, stays separate and legible. The charm is the warm linework, light and
colour, never a face drawn onto an object.`
    : `No human figure anywhere in the frame — the sheep and the wool carry the whole scene, richly
detailed and close at hand. The charm is the warm linework, light and colour, never a face drawn
onto an object.`
}`;
};
