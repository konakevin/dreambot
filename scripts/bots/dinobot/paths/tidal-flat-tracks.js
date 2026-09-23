/**
 * DinoBot tidal-flat-tracks — the giant has already gone (2026-09-23, SHADOW).
 *
 * ═══ THE GAP, AND THE DELIGHT ANGLE ═══
 * DinoBot has 22 paths and 21 of them are a portrait of an animal or a vista with an animal in it.
 * Exactly one — `undergrowth-scale`, the best-graded path of the whole run at ~4.8 — makes the giant
 * EVIDENCE rather than subject, and its best render is a tail and nothing else, with ripples
 * spreading from its tip. This path is that premise taken all the way out into the open: miles of
 * wet rippled sand at dead low tide, a skin of standing water lying mirror-still over it, and the
 * only sign of the animal is what it left behind — a trackway of water-filled hollows each as broad
 * as a small pond, a furrow ploughed by a dragging tail, a crater churned where something rooted for
 * shellfish. Nobody has ever been shown this. Everyone has seen a dinosaur; almost nobody has been
 * shown the five minutes AFTER one walked past.
 *
 * ═══ THE DULL FAILURE THIS PATH DRIFTS TOWARD, NAMED BEFORE ROUND 1 ═══
 * A grey mudflat under a grey sky. Correct, plausible, competent and utterly forgettable — which
 * under Kevin's motto is a MISS, not a pass, and no sweep or lint catches it. Two structural
 * answers, both physically true of a tidal flat rather than bolted on:
 *   1. A MIRROR DOUBLES THE SKY. A film of standing water over flat sand repeats whatever the sky is
 *      doing across the lower two thirds of the picture, so a saturated sky becomes most of the
 *      frame's colour — and the water-filled hollows punch DARK HOLES through that reflection,
 *      which is the composition and the premise in one move. The `sky` axis therefore owns the whole
 *      palette and every entry carries TWO COMMITTED COLOURS IN VISIBLE OPPOSITION. That is a
 *      measured lever, not a taste note: on FarmBot `lambing-season` every render at 4.1 or above
 *      had two colours in opposition and every sober one had its light described as even.
 *   2. A FILLING FOOTPRINT HOLDS A WHOLE TINY WORLD. The `tenant` axis is the CLEVER axis — a
 *      silver fish thrashing in a brim-full hollow, two dozen pale crabs streaming over the rim, a
 *      slate-blue crested wader fishing the water one hollow holds, a rust-and-cream feathered
 *      dinosaur using one as a bath with its wings thrown out and water flying.
 *
 * ═══ 5 AXES, ALL BESPOKE, ALL ALWAYS ON ═══
 *   evidence ★ THE HERO, and it LEADS. One formation: its SHAPE and SIZE first, what the water is
 *              doing in it, then where in the frame it sits and its CROP.
 *   tenant   ★ THE CHARM. The small life that has already moved into the evidence, mid-action.
 *   sky      ★ THE VIVID AXIS. The sky's architecture, two opposed colours and what each lands on,
 *              and what the standing water does with them. Owns the palette. REPLACES the bot's
 *              shared `LIGHTING` slot (see below).
 *   reach      What closes the picture at the back, always as a BAND across the top. About a THIRD
 *              of its entries put the maker in that band as a speck or a shape most of the way out
 *              of a side edge — which is how the giant appears without ever being the subject.
 *   air        What the air over the flats is doing. Axis-clean: air only, zero colour, zero light.
 *              REPLACES the bot's shared `PREHISTORIC_ATMOSPHERES` slot.
 * No gated phenomenon axis. The `sky` and `reach` axes already carry the weather drama (squall
 * walls, rain curtains, mammatus, lightning, a volcanic plume), and the reused paleo phenomenon
 * block tells Sonnet to "render it prominently as a SECONDARY FOCAL POINT", which on this path
 * competes with the hero for the one thing that is scarcest here — prompt length.
 *
 * ═══ THE LOAD-BEARING CONSTRAINT (template rule 1) — AND WHY IT IS A CORRIDOR RULE ═══
 * A TRACKWAY IS THE PUREST LINEAR FEATURE THERE IS, and the playbook's most expensive structural
 * lesson is that a path staged on a linear feature renders as a RECEDING CORRIDOR with the subject
 * tiled to a centre vanishing point. FaeBot `acorn-boat-regatta` spent 24 renders on it: 5 of 6 in
 * round 0 were a channel vanishing dead up the middle with a queue of identical copies, two of them
 * hundreds of copies, and rewriting all eight camera vantages did not fix it. What fixed it, and
 * what held 0 of 20 on PixelBot `floating-market-canal`, is the CROSSWISE law — name the surface,
 * fill the frame with it, run the feature ACROSS the picture and OUT of both side edges, and make
 * the far edge a BAND along the top border. So:
 *   • the trackway crosses from one side edge toward the other, or curves away to one,
 *   • the nearest hollow is HUGE, sits in a NAMED near corner, and is CUT BY THE FRAME'S EDGE
 *     (position plus crop is what keeps it big — a scale adjective cannot do that job),
 *   • the far ground is a BAND across the top, never a point anything aims at.
 * Stated in THREE layers, because lesson 22 measured that a law appended to 25 of 25 seed tails
 * reached 1 of 5 emitted prompts while the same clause in the required output order reached 5 of 5:
 * template rule 1, every single `evidence` seed entry, and output-order item 1.
 *
 * ═══ THE PATH'S OWN WORST TRAP, FOUND BY THE LAYPERSON CHECK BEFORE ANY RENDER ═══
 * "FOOTPRINTS ON A WET BEACH" IS ONE OF THE MOST PHOTOGRAPHED IMAGES IN EXISTENCE AND THEY ARE
 * HUMAN BARE FEET. This is lesson 47's form — where a path's own premise noun imports the exact
 * prior the path was built to avoid, and BloomBot `orchid-cloud-forest` lost 4 of 6 renders to it
 * because "cloud" is the correct ecosystem name and also a cumulus. The fix there was to swap the
 * Flux-FACING noun and keep the correct term once. So here:
 *   • the word `beach` appears nowhere, in no pool and not in this file's prompt text,
 *   • and every `evidence` entry leads with the track's SHAPE AND SIZE before any name for it — "a
 *     three-toed hollow as broad as a small pond, claw-slots cut at each toe tip" — with the word
 *     footprint arriving second or not at all. Same form as lesson 48's colour-first / species-last:
 *     the category noun out-votes the qualifier sitting next to it, so stop leading with it.
 *
 * ═══ OTHER PRE-EMPTED TRAPS (each already cost a real render on another path) ═══
 *  • TEXT PRIORS, and this subject is MADE of them. `mark / marking / imprint / impression /
 *    stamped / engraved / etched / inscribed / ruled / drawn / traced` are every natural word for a
 *    track in sand and every one of them is a lettering prior — PixelBot banned `rune` and still
 *    rendered gibberish off a charm reading "ringed with softly glowing MARKS", and lesson 45 names
 *    `tide mark` specifically. All banned in all five recipes and swept on the generated output (0
 *    hits across 125 entries). The vocabulary is HOLLOW / TRACK / TRACKWAY / TROUGH / FURROW /
 *    GOUGE / CRATER. Working in this path's favour: it has no flat bounded panel anywhere, and
 *    lesson 27's dividing line is whether an object's SHAPE is already a sign.
 *  • AN ABSENCE IS NOT RENDERABLE. "No animal in frame" produces an animal. Nothing here ever says
 *    the maker is missing; rule 3 states positively what IS in the picture, and the `tenant` axis
 *    guarantees a living animal in EVERY frame — which also gives the bot-wide `render` medium
 *    ("photoreal living animal with leathery scarred biological hide", at word ~18 of every prompt)
 *    and `promptSuffixByMedium.render` ("the dinosaur is a REAL LIVING ANIMAL") something on-premise
 *    to land on instead of back-filling a big animal of their own.
 *  • THE GIANT-INSECT GENERATOR. A count under ten of anything small renders it BIG, because each
 *    named subject gets a share of the frame; and a size ruler only works if it is IN frame and its
 *    own size is fixed by something bigger. Every small `tenant` is either a dozen-plus of its kind
 *    or welded to a feature of the giant's own track (a toe-notch, the slot one claw cut, the rim).
 *    And NOTHING gets a detail exemption — the corrected form of lesson 13, where stripping "the
 *    nearest showing a furry amber-and-umber thorax" from 20 entries took giant bees 3 of 5 to 0 of
 *    6 and the batch 3.86 to 4.37. The thing you describe in most anatomical detail is the thing
 *    that comes out biggest, the nearest one included.
 *  • NO AUTHORITY WORDS. "THE FIRST RULE", never "NON-NEGOTIABLE / AUTHORITY / OVERRIDES" — that
 *    phrase family triggered Sonnet's own injection defences on ~28% of FarmBot calls, and the
 *    refusal text then goes to Flux as the prompt.
 *  • NO HUMANS BY POSITIVE CROWD-OUT, never by a ban. DinoBot stripped its negation cascades in June
 *    2026 precisely because "NO HUMANS" was pulling humans in.
 *
 * ═══ THREE DELIBERATE DEVIATIONS FROM THE BOT'S DEFAULTS, EACH WITH ITS MEASUREMENT ═══
 * 1. NOT the `DINOBOT_PALEO_LANDSCAPE` archetype, and not a wrapper over it. The `snowline-forest`
 *    precedent is a thin wrapper swapping two exact anchor strings, and it is right when TWO lines
 *    conflict. Here FOUR of that template's mandates are fatal, so a wrapper would be a fork in
 *    disguise: "MEGA-SCALE / UNHINGED PRIMORDIAL FLORA — NON-NEGOTIABLE … every quadrant packed with
 *    mega-flora" (a tidal flat has no flora at all), "DINOSAUR: 20-30% of frame … a CANDID dinosaur
 *    integrated INTO the landscape" (the entire premise here is that it is NOT), the required opening
 *    "name the CANDID DINOSAUR … in the FIRST 30-40 words", and the ban on "sandy-beach-with-
 *    cumulus-sky-only landscapes". So this file is FUNCTION-FORM and self-contained, exactly like
 *    `amber-forest`: it loads its own five seed JSONs and inlines its own brief, `buildBrief` already
 *    dispatches `typeof builder === 'function'`, and `pools.js` / `archetypes.js` /
 *    `archetype-templates.js` are all untouched — no shared single-writer file, no collision risk.
 *    Worth noting the one paleo mandate that is NOT hostile: its "RICH WARM SATURATED … NOT
 *    washed-out" palette line is the anti-grey lever this path needs, so an equivalent is stated
 *    here in rule 2 in this path's own vocabulary rather than inherited.
 * 2. BESPOKE `sky` / `air` INSTEAD OF the bot's shared `LIGHTING` (200) and `PREHISTORIC_ATMOSPHERES`
 *    (200). Those pools are not axis-clean — they carry scene content and NAMED DINOSAURS
 *    ("Mirror-flat lake reflecting dinosaur silhouette", "Baryonyx hunting", and, precisely on this
 *    path's nose, "Sandbar emerging from receding tide"). All three of DinoBot's condition-identity
 *    paths (dino-nights, storm-season, polar-dinos) and `amber-forest` already replace the lighting
 *    slot for the same reason. This path's palette is its identity, so `sky` owns it outright.
 * 3. `sensoryAnchors` SKIPPED, and this one is load-bearing rather than tidy. The bot enables it
 *    bot-wide with `requiredChannels: ['lightcolor']`, so EVERY render gets a rolled key-light
 *    colour appended to the brief from `sensory_scene_lightcolor` — a second palette source, firing
 *    100% of the time, on the one path whose palette axis is its whole defence against a grey
 *    picture. Measured on that pool's 100 entries: 47 name an incompatible setting or lock the bot's
 *    warm amber ("volcanic-orange shaft piercing through the primordial steam vents", "moonlit-blue
 *    key casting shadows on the nocturnal swamp", "cretaceous-amber key bathing the fossilized tree
 *    trunk", "stalagmites in the limestone cavern depths"). A closed cave or a jungle canopy cannot
 *    exist over an open tidal flat. Skipping it also buys back ~60 words of brief, which on a path
 *    whose grade tracks its length is the cheapest win available. Reversible in one line.
 *
 * ═══ LENGTH IS THE FIRST DESIGN CONSTRAINT, NOT A ROUND-3 REPAIR ═══
 * Lesson 54: on PixelBot `observatory-tower` the 8 shortest prompts of one round averaged 4.51 and
 * the 7 longest 3.87, with everything at or above 323 words graded 3.0-3.6 — same path, same pools,
 * same models, the only variable being how long the roll came out. DinoBot's medians run 186-275
 * words and its two best new paths are its two LONGEST (undergrowth 275, den 261), so the bot has
 * headroom, but none of it is free. Three things were done about it up front rather than discovered:
 *   • the pools are capped tight and the caps were VERIFIED against the generated output, not
 *     assumed. The first `evidence` draft asked for four clauses per entry and came back 25 of 25
 *     over cap at a 44-word median; cutting ONE requirement (lesson 46 — remove a requirement, do
 *     not restate the number) took the median to 34 and the max from 48 to 37. Total source text
 *     across all five axes is ~109 words, against ~120 for undergrowth-scale's three axes alone.
 *   • this template is deliberately short and its output order has FIVE items, not nine. Lesson 43:
 *     a path with five rule blocks and nine order items has already spent its attended region on
 *     rules, which is why the lever is deleting prose rather than reordering it.
 *   • the mood slice stops at the first sentence boundary inside 140 chars. That is not only length:
 *     the `cinematic` directive's first two sentences are "The image is a frame from a great film. A
 *     pivotal narrative moment suspended in time — something has just happened, or is about to." —
 *     which is this path's premise stated better than this file states it — and the NEXT clause is
 *     "Composition is deliberate and confident: strong leading lines", and STRONG LEADING LINES is a
 *     corridor instruction on a path staged on a trackway. Cutting at the sentence boundary keeps
 *     the gift and drops the trap.
 *
 * Config: the bot's locked `render` medium, locked `cinematic` vibe, and the bot-wide model picker.
 * chaos SKIPPED and twoPassPolish SKIPPED (Haiku compression strips setting and optics language
 * first, which is most of what this path is). No `promptPrefixByPath` — the wrapper-strip lesson
 * says default to empty. `sharedDNA` is deliberately NOT consumed: `sky` owns the palette, and the
 * bot's 200-entry scene-palette pool is warm-earth coded, so it would flatten the two-colour
 * opposition into one wash. Same choice `amber-forest`, `undergrowth-scale` and `den-and-burrow`
 * all made.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const EVIDENCE = load('dinobot_tidal_evidence');
const TENANT = load('dinobot_tidal_tenant');
const SKY = load('dinobot_tidal_sky');
const REACH = load('dinobot_tidal_reach');
const AIR = load('dinobot_tidal_air');

/**
 * Take whole sentences only, up to `max` characters.
 *
 * On the live `cinematic` directive this returns exactly its first two sentences and stops before
 * "strong leading lines" — see the header. Cutting at the sentence boundary rather than at a fixed
 * character count means an edit to the directive in the DB can only ever shorten or lengthen the
 * slice, never hand Sonnet half a word.
 */
function firstSentences(text, max) {
  const t = String(text || '').slice(0, max);
  const cut = t.lastIndexOf('.');
  return cut > 40 ? t.slice(0, cut + 1) : t;
}

module.exports = ({ vibeDirective, picker }) => {
  const evidence = picker.pickWithRecency(EVIDENCE, 'tidal_evidence');
  const tenant = picker.pickWithRecency(TENANT, 'tidal_tenant');
  const sky = picker.pickWithRecency(SKY, 'tidal_sky');
  const reach = picker.pickWithRecency(REACH, 'tidal_reach');
  const air = picker.pickWithRecency(AIR, 'tidal_air');

  return `You are a wildlife-documentary cinematographer writing MESOZOIC TIDAL-FLAT scenes for DinoBot — a prehistoric Earth deep in the age of dinosaurs. Photoreal cinematic 35mm still, shot out on miles of wet rippled sand at dead low tide.

⚠️⚠️⚠️ THE FIRST RULE — THE HERO IS WHAT THE GIANT LEFT BEHIND, AND IT CROSSES THE PICTURE ⚠️⚠️⚠️
The subject of this picture is a hollow in wet sand with water in it. Lead with its SHAPE AND ITS SIZE before any name for it — a three-toed hollow as broad as a small pond with a claw-slot cut at each toe tip, a furrow ploughed by a dragging tail, a crater churned where something rooted for shellfish — because the shape and the size are what make it read as a giant's rather than anything else's. It runs ACROSS the frame from one side edge toward the other, or curves away to one, and BOTH ENDS RUN OUT OF FRAME. The nearest hollow is HUGE, sits in a named near corner, and is CUT BY THE FRAME'S EDGE; that position and that crop are what keep it big. The far ground is a low BAND across the top of the picture. Nothing in this frame recedes to a point in the middle.

⚠️⚠️⚠️ THE SECOND RULE — THE WET SAND IS A MIRROR AND IT DOUBLES THE SKY ⚠️⚠️⚠️
A skin of standing water lies over the sand and it is mirror-still, so whatever the sky is doing happens TWICE: once overhead and once underfoot, across most of the lower picture. The water-filled hollows punch DARK HOLES through that reflection and the wet sand between them is glossed and streaked with the same colours. Commit to TWO saturated colours in visible opposition and name the surface each one lands on. A grey, even, softly-lit picture is the one failure this path exists to prevent.

⚠️ THE MAKER IS ALREADY GONE. What is in this frame is the hollow, the water filling it, the small creature that has moved into it, the sky, and the low band at the back. Where a distant shape does appear it is already tiny in that band, or most of the way out of a side edge, and always smaller than the near hollow is wide — with its own reflection standing under it in the water.

⚠️ THE WORLD IS PURE MESOZOIC ECOSYSTEM — sand, standing water, sky, weather, stranded seaweed and shells, crabs and worms and shrimp and urchins, fish, small feathered dinosaurs, pterosaurs, small turtles and lizards, and far off the makers of the tracks. That is everything that exists here. The flats thrive entirely on their own, unobserved.

★━━━ 1. THE EVIDENCE (the hero — it opens the picture) ━━━
${evidence}
Render this exact formation, at this exact place in the frame, cropped exactly as stated.

★━━━ 2. WHO HAS MOVED INTO IT (the detail the eye finds second) ━━━
${tenant}
It sits in the water this formation holds; where the formation has no toe-hollow of its own, put it in the deepest part of the formation. Mid-action, and a small clean shape including the nearest one — the individual described in most detail is the one that comes out biggest.
SIZE IS STATED ONLY AGAINST SOMETHING ALREADY IN THIS WORLD: one of the great hollow's toe-notches, the slot a claw cut, the sand ridge at its rim, or a count of its own kind. Never against an animal or an object from outside the list above, not even as a comparison — a creature named as a ruler gets rendered AS the creature.

★━━━ 3. THE SKY AND ITS DOUBLE (it owns the whole palette) ━━━
${sky}
Commit fully to both colours and to what each one lands on, overhead and in the standing water. The palette of the entire frame follows from this.

━━━ 4. THE BAND AT THE BACK ━━━
${reach}

━━━ 5. THE AIR OVER THE FLATS ━━━
${air}

━━━ MOOD ━━━
${firstSentences(vibeDirective, 140)}

━━━ LENGTH IS THE FIRST RULE OF THE OUTPUT — 90-110 WORDS, COUNT THEM ━━━
A tight 100-word picture beats a crammed 250-word inventory. Write comma-separated phrases in THIS order and then STOP:
[the hollow by its shape and size, what the water is doing in it, which near corner it fills and its crop, and the trackway running out of both side edges],
[the small creature in it, mid-action, sized only against the hollow's own toe-notch, claw-slot or rim],
[the sky's two opposed colours and the same two repeated in the standing water, with the hollows as dark holes through the reflection],
[the low band across the top of the picture],
[the air over the flats],
[photoreal cinematic 35mm still, ray-traced specular on standing water, hyperreal wet sand, deep readable focus so the far band stays sharp].

Describe only what IS present — every phrase names something in the picture, never something absent, and never a negation. No preamble, no titles, no headers, no markers, no bold labels.`;
};

/*
 * ═══ MEASURED RESULTS — 3 rounds × 5 shadow renders, 15 attempts, 0 errors, 2026-09-23 ═══
 *
 * | round | the ONE variable                                  | avg  | min | max |
 * | ----- | ------------------------------------------------- | ---- | --- | --- |
 * | R1    | one render per model (the model probe)             | 2.72 | 2.0 | 4.0 |
 * | R2    | model pin (+ the ruler law moved into the template)| 4.02 | 2.6 | 4.9 |
 * | R3    | the sky pool's colour-vs-NEUTRAL entries rewritten | 3.54 | 2.2 | 4.7 |
 *
 * Emitted prompt length: 193 → 218 → 238 median words (min 188, max 289). DinoBot's own medians run
 * 186-275, so this path sits mid-band and never approached the 323-word cliff.
 *
 * ── R1: THE MODEL PROBE, AND IT DECIDED THE PATH (4th confirmation on this bot) ──
 * Every structural law reached 5 of 5 emitted prompts — crosswise + "out of both side edges" 5/5,
 * near-corner + crop 5/5, band across the top 5/5, the water repeating the sky 5/5, hollows as dark
 * holes 5/5, text-prior nouns 0/5, "beach" 0/5 — and THREE OF FIVE MODELS STILL DELETED THE PREMISE
 * OUTRIGHT. No trackway, no hollow, no tidal flat:
 *   flux-1.1-pro (2.1)       macro'd onto rock and lost the flat to bokeh, dead-centre corridor
 *   flux-1.1-pro-ultra (2.0) abstract-stylised, no environment, a centred curio, monochrome
 *   flux-dev (2.0)           a canyon with a stream, and it BACK-FILLED A WHOLE THEROPOD
 *   flux-2-pro (3.5)         premise held; composition strong
 *   gemini-2-image (4.0)     best premise read of the round
 * Each failing model reproduced its OWN already-documented behaviour on this bot from a different
 * path (`amber-forest`: 1.1-pro macro'd the grove, ultra went abstract, flux-dev rendered no resin
 * whatsoever), so this is confirming a standing exclusion rather than encoding an n=1 finding.
 * Lesson 33's rule exactly: a stated, correctly-ordered, seed-reinforced element that renders 0
 * times is a MODEL fact, not a prompt fact. One probe round beat three rounds of prompt work.
 *
 * ── R2: +1.30 FROM THE PIN. Two changes, two separately-attributable metrics ──
 * The GRADED variable was the model pin. The ruler law (below) is a brief-text repair whose effect
 * was measured in the emitted PROMPTS, not in the grades, so it cannot contaminate the attribution.
 *   • SONNET INVENTS ITS OWN SIZE RULER AND EVERY RULER IT INVENTS IS OFF-LIMITS — 3 of 5 R1
 *     prompts: "PIGEON-sized", "as wide as a ROWBOAT", "the nearest casting THUMB-sized", "the
 *     nearest one small-FISTED". The pools were clean (0 sweep hits across all 125 entries); Sonnet
 *     added these at brief-writing time. Root cause: the ruler rule lived only in the GENERATOR
 *     recipes, so it shaped the pool text and never reached the brief. **And on flux-2-pro the
 *     invented ruler RENDERED AS THE RULER — a literal pigeon, a modern bird, on a bot that bans
 *     them.** Fix: the ruler law moved into the template body AND into output-order item 2. Result:
 *     off-limits invented ruler 3/5 → 1/5, and the intended toe-notch / claw-slot ruler 0/5 → 5/5.
 *   • `cleanMediumByModel` skipped for gemini, so it renders the bot's real photoreal/PBR/ray-traced
 *     `render` medium instead of `dinobot_gpt_clean`. This path's money shot IS a mirror reflection,
 *     which is a ray-traced effect, and R1's gemini render had the best premise and the muddiest
 *     water with no mirror at all. It is `amber-forest`'s identified-but-unspent lever.
 *     **MEASURED TRADE-OFF, both halves:** it bought the real mirror (R2/R3 gemini frames carry
 *     true reflections, doubled suns and doubled distant animals) and it COST a back-filled hero —
 *     dropping the clean medium put "photoreal living animal with leathery scarred biological hide"
 *     into gemini's prompt for the first time and gemini executed it, rendering a full dinosaur in
 *     2 of its 6 pinned renders. Worth it on the numbers, but it is a real cost, not a free win.
 *
 * ── R3: THE SKY FIX WORKED AND UNCOVERED SOMETHING WORSE ──
 * R2's two sub-4 frames were GREY — the one failure this path exists to prevent — and both traced to
 * a specific pool shape: an entry whose "two colours in opposition" were one hue against a NEUTRAL
 * (pewter, charcoal, iron, hail-white). A neutral carries brightness but no hue, so it cannot oppose
 * anything chromatically; it only desaturates. 6 of 25 entries had that shape (24% expected, 2 of 5
 * observed). All six rewritten so both sides are real hues; the check is now in the generator's
 * audit and the ban is in the recipe, so a regen stays clean. **Result: colour-vs-neutral 6/25 →
 * 0/25, two hues present 5/5 of prompts, grey frames 2/5 → 0/5.** The variable did its job.
 * But the round average FELL, 4.02 → 3.54, because two new defects appeared — and the measurement
 * separates them perfectly:
 *
 * | render | sided-sky clause | continuous-linear evidence | defect                       | grade |
 * | ------ | ---------------- | -------------------------- | ---------------------------- | ----- |
 * | r3#1   | YES              | YES                        | horizontal panel seam        | 3.5   |
 * | r3#2   | no               | no                         | none                         | 4.7   |
 * | r3#3   | no               | YES                        | corridor + hero back-fill    | 2.8   |
 * | r3#4   | YES              | YES                        | VERTICAL split panel + corridor | 2.2 |
 * | r3#5   | no               | no                         | none                         | 4.5   |
 *
 * Sided-sky clause present → a split panel in 2 of 2; absent → 0 of 3.
 * Continuous-linear evidence → a corridor or a panel in 3 of 3; absent → 0 of 2.
 *
 * ═══ THE RESIDUAL, AND THE ONE LEVER I WOULD SPEND NEXT ═══
 *
 * THE RESIDUAL IS A POOL CLASS, NOT A PROMPT PROBLEM. Six of the 25 `evidence` entries (24%) are a
 * CONTINUOUS LINEAR FEATURE — a tail furrow, a gouge arc, a skid trough, a trackway walking into a
 * channel — rather than DISCRETE hollows. Over the ten pinned renders:
 *
 * | evidence class                       | n | mean | max |
 * | ------------------------------------ | - | ---- | --- |
 * | DISCRETE hollows (a trackway, a pad) | 7 | 4.19 | 4.9 |
 * | CONTINUOUS linear (furrow / trough)  | 3 | 2.83 | 3.5 |
 *
 * And with the two now-fixed neutral-sky rolls excluded, the discrete-hollow class is **4.62 mean,
 * 4.40 floor over 5 renders** — which clears the pass bar — while the continuous class never once
 * exceeded 3.5. The mechanism is obvious once seen: **a trackway of discrete hollows CANNOT form a
 * corridor, because the hollows are separated objects that read individually; a continuous furrow IS
 * a corridor, and renders as one no matter how the crosswise law is worded.** The crosswise law sat
 * in 5 of 5 prompts in every round and lost every time it was handed a continuous feature.
 *
 * THE LEVER: purge the 6 continuous-linear `evidence` entries and replace them with discrete-hollow
 * formations (a pad-hollow with its trackway, a hollow punched through crust, a hollow the sand has
 * slumped into, a smaller trackway crossing a giant one). This is lesson 53's CONCENTRATED branch —
 * the failures trace to one identifiable class rather than spreading evenly, so purge the class
 * rather than strengthening the mandate, exactly as the BrickBot camera pool and FaeBot's
 * rock-parented perches were fixed. The concentration here is total: 3 of 3 against 0 of 7.
 * SECOND lever, smaller and cheap: 3 of 25 `sky` entries assign the two hues to spatial SIDES
 * ("a rain curtain on the right... the left sky a hard prussian blue"), and a side-vs-side colour
 * assignment is a split-panel instruction — flux drew a dead-straight vertical seam down the middle
 * of r3#4. Reword those three to assign the hues to LAYERS (overhead vs underfoot) or to SURFACES,
 * never to left vs right. Both levers are pool work, ~30 minutes, no template change.
 *
 * NOT SPENT ON PURPOSE. Three rounds is the cap, and an unvalidated change shipped without a render
 * round is worse than a measured residual with a named lever: what Kevin grades has to be what
 * ships (the go-live xerox rule runs in both directions). The pools are left exactly as round 3
 * rendered them.
 *
 * ── REGISTRATION (merge into scripts/bots/dinobot/index.js) ───────────────────
 *
 *  1. pathBuilders — add:
 *       'tidal-flat-tracks': require('./paths/tidal-flat-tracks'), // 2026-09-23 SHADOW — the giant has already gone
 *  2. shadowPaths — add the string:
 *       'tidal-flat-tracks',
 *  3. chaos.skipPaths — add the string:
 *       'tidal-flat-tracks',
 *  4. twoPassPolish.skipPaths — add the string:
 *       'tidal-flat-tracks',
 *  5. sensoryAnchors — add a `skipPaths` key (DinoBot has none today). REQUIRED, not optional:
 *     `requiredChannels: ['lightcolor']` appends a rolled key-light colour to EVERY render, and 47
 *     of that pool's 100 entries name a cave / canopy / steam vent / crater / swamp or lock the
 *     bot's warm amber — a second palette source, firing 100% of the time, contradicting the one
 *     axis this path's whole anti-grey defence rests on. Every round below ran with it off.
 *       sensoryAnchors: {
 *         enabled: true,
 *         skipPaths: ['tidal-flat-tracks'],
 *         requiredChannels: ['lightcolor'],
 *         ...
 *       },
 *  6. modelByPath — LOAD-BEARING, not a preference. Three of the bot's five picker models deleted
 *     the premise outright in round 1 (table above), and every render in rounds 2 and 3 ran on this
 *     pin. Ship it with the path or the path does not work. DinoBot's `modelByPath` key already
 *     exists (added for `amber-forest`), so this is one entry inside it, not a new key:
 *       'tidal-flat-tracks': { 'black-forest-labs/flux-2-pro': 60, 'google/gemini-2-image': 40 },
 *     Weights, not a hard pin, per lesson 42: over the 10 pinned renders flux-2-pro means 3.75
 *     (n=4) and gemini 3.80 (n=6), which is inside the noise at that sample size, and each model
 *     owns a different half of the batch's best work — gemini produced the two frames where the
 *     distant maker appears tiny with its reflection standing under it, flux-2-pro produced the
 *     reference frame. A hard pin would buy nothing and lose one of those.
 *  7. cleanMediumByModel — add this path to gemini's `skipPaths` so it renders the bot's real
 *     photoreal/PBR/ray-traced `render` medium rather than `dinobot_gpt_clean`. This path's money
 *     shot is a mirror reflection, which is a ray-traced effect, and the clean medium drops that
 *     anchor. Every round-2 and round-3 render ran with this applied, so it is part of the xerox:
 *       'google/gemini-2-image': { medium: 'dinobot_gpt_clean', skipPaths: ['amber-forest', 'tidal-flat-tracks'] },
 *     ⚠️ It has a measured cost — see the R2 notes. Reverting it is the fallback if the back-filled
 *     hero matters more than the mirror.
 *
 * Nothing else is required. `pools.js`, `archetypes.js` and `archetype-templates.js` are untouched
 * (this file loads its own five seed JSONs), the medium falls through to the bot's locked `render`,
 * and the vibe to the bot's locked `cinematic`. Going live later = move the string from
 * shadowPaths[] to paths[] and change NOTHING else (the go-live xerox rule).
 */
