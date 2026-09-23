/**
 * FaeBot autumn-seed-gathering path (2026-09-23) — FaeBot's FIRST path about
 * MOTION AND PHYSICS, its first AUTUMN register, and its first picture where
 * the cargo fights back by simply LEAVING.
 *
 * THE SOUL OF THE PATH:
 *   The end of the year, and everything in the woodland is letting go at once.
 *   A dry stalk thicker than a fae's wrist fills one side of the picture and
 *   runs out of frame, its rattling heads out overhead like lamps on their own
 *   stems, more ribbed stalks and split shells crowding in behind. Two hundred
 *   white tufts stream past all one way on a shove of air, each crown about as
 *   big across as the fae's own head. Papery blade-seeds as long as her arm spin
 *   flat and fast through the frame at head height. A pod taller than she is has
 *   split along one seam, its halves curled right back like a boat hull, a slow
 *   column of white silk lifting out of it faster than anybody can bag it. ONE
 *   grown fae is painted large and near, dressed by somebody who knew the job —
 *   oiled leaf-cloth a hook cannot grip, a hood drawn tight, cuffs strapped
 *   shut — and she is hanging off a sailing tuft by both hands with her boots
 *   kicked right up, going wherever it goes. Further along the stem a goldfinch
 *   hangs upside down off a head, eating the exact crop she came for. The light
 *   comes from behind and every crown of down burns as a ring of white fire
 *   against deep emerald shade.
 *
 * WHY IT EXISTS — and this gap needed MEASURING, not assuming, because the
 *   naive audit says the path already exists. FaeBot has written the word "seed"
 *   into 1,013 pool entries and "autumn" into 627. Then read them:
 *     • "dandelion" 109 hits — 95 are AMBIENT GARNISH and always in the same
 *       register: "drifting dandelion-seeds floating lazily through the mid-tier
 *       air", "one dandelion seed drifting across the whole still pool". The
 *       rest are a DWELLING (a seed-pod house shaped like a dandelion puff) or a
 *       creature name.
 *     • "thistledown" 55 hits — 100% ambient weather, every one windless:
 *       "drifting soft thistledown floating through still air in slow soft
 *       descent".
 *     • "samara" 11 hits — every one a HOUSE built inside a giant winged seed,
 *       or a garland worn on the shoulders.
 *     • "milkweed" 18 hits — 16 are "spun milkweed floss" as a GARMENT FABRIC
 *       (6 in honey_harvester, 4 in starchart_astronomer).
 *     • "burr" 4 hits — 2 are chestnut-burr BARK TEXTURE, 1 an animal grooming.
 *   So FaeBot has shown seeds a thousand times as HOUSES, CLOTH and WALLPAPER
 *   and has never once shown one LET GO. Nothing in this world has ever moved
 *   fast, and nobody has ever chased anything.
 *
 * ⚠️ THE COLLISION TABLE, because this was flagged as the highest-collision
 *   path left in the run, against three live siblings:
 *     • `acorn-boat-regatta` OWNS ACORNS, and is the bot's worst path at 3.07.
 *       ACORNS ARE BANNED HERE as a hero and nothing is borrowed from it except
 *       its measured FAILURES (see the naked-putto note below).
 *     • `honey-harvest` is already "fae doing seasonal gathering work", so the
 *       separation has to be more than subject. It is: honey-harvest is a HEIST
 *       with an opponent that fights back, staged on a static wall of wax that
 *       stays exactly where it is. This path's cargo does not fight — IT LEAVES.
 *       The register is a RODEO, not a robbery, and the whole picture is in
 *       motion. Its wardrobe is also deliberately disjoint (below).
 *     • `goblin-market` covers trade in goods; `flower-fairy` and `tiny-fae`
 *       cover small fae among plants — all three are static and all three are
 *       green-season.
 *   THE DIFFERENTIATOR, and it must be visible in every render: SEED DISPERSAL
 *   PHYSICS. Four mechanisms, each one moving differently, and no other FaeBot
 *   path can show any of them — THE SAILORS (down-crowned seeds that go up and
 *   away, not down), THE SPINNERS (arm-length papery blade-seeds spinning flat), THE
 *   BOLTERS (pods that go off and fling), THE CLINGERS (hooked balls that hitch
 *   a ride and come off only with somebody's whole weight behind the pull).
 *   AUTUMN separates it further: the roster is green spring/summer plus one
 *   winter court.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the mushroom-apothecary / regatta /
 *   star-charting / honey-harvest pattern): this file loads its own seven seed
 *   JSONs and inlines its whole brief. It touches no shared bot file — no
 *   pools.js entry, no archetypes.js entry, no archetype-templates.js entry.
 *   Registration is the block at the bottom of this file.
 *
 * 7 AXES (6 always-on + 1 gated bystander at 0.5) — deliberately the same shape
 *   as honey-harvest, which is the bot's most recent and most successful build:
 *   - stand        the STAGE: the near structure that runs out of frame, the
 *                  footing, the crop. Leads, because the KIND of thing it is
 *                  decides the frame. Every entry is a MIXED autumn stand,
 *                  which is what lets every other pool compose with it.
 *   - source     ★ the MECHANISM up close: the pod or head and HOW IT LETS GO.
 *                  The material money shot, and where the ADDITIVE LAW lives.
 *   - flight     ★ THE DIFFERENTIATOR: the air full of seeds under way. Carries
 *                  the count law (the scale defence) AND the wind.
 *   - work       ★ the beat happening NOW, naming its ACTOR. Merged with the
 *                  fae into ONE action-first order item (see the round log).
 *   - gatherer     the ONE large near fae: adult body plan, real costume, ears,
 *                  hair, wings. Appearance and costume ONLY.
 *   - light      ★ owns the palette: a committed DIRECTION (usually from
 *                  behind), what the light passes THROUGH, two named colours.
 *   - bystander    (0.5 gate) the second little story. Comedy, and the animals
 *                  are RIVALS for the same cargo rather than spectators.
 *
 *   There is NO separate `wind` or `air` axis, and that is structural rather
 *   than an omission: you cannot render wind, you render what it does to
 *   things. So the wind lives inside `flight` and costs no output-order item —
 *   the same reasoning that retired star-charting's `air` axis on
 *   honey-harvest. `charm` is likewise a LAW inside all six content pools
 *   rather than a slot (mushroom-apothecary proved the law beats the slot, and
 *   playbook 43 says the lever on a full attended region is deleting order
 *   ITEMS). And the nets, sacks, hoops and pails are deliberately NOT an axis —
 *   see the model note, they are the one thing this model discards.
 *
 * ⭐ THE SCALE LADDER, and it is PHYSICALLY HONEST, which is what makes the
 *   picture both monumental and true. These fae are the size of a MOUSE
 *   (~70mm), so real autumn seed measurements scale straight up:
 *     the fae = the size of a mouse, painted LARGE and NEAR · one tuft with its
 *     crown of down = as big across as her own HEAD · one papery blade-seed
 *     (a maple seed, ~35mm) = as long as her ARM · one hooked seed-ball = as big as her HEAD ·
 *     one pod (~100mm) = TALLER THAN SHE IS · one whole dandelion head (~40mm)
 *     = as wide across as she is TALL · the stalk it stands on = THICKER THAN
 *     HER WRIST, running out of frame.
 *   These are people wrangling cargo their own size. That is not a giant-prop
 *   defect, it is the premise, so nobody should "fix" it downward. The three
 *   parts of the mechanism that DO transfer from the FarmBot bee measurement:
 *     (a) SIZE TRACKS THE COUNT, NOT ANY SIZE WORD. "Three bees, each no bigger
 *         than a fingernail" gave BIRD-SIZED bees; "about a dozen" and "eighty
 *         or more" gave correct ones. Pool floor: THIRTY, and A HUNDRED for the
 *         small white tufts. Verified in the pool: 25 of 25 flight entries state
 *         a count of thirty-plus and ZERO carry a low-count phrasing.
 *     (b) NO LONE SEED. A single subject has nothing to compete with and
 *         expands to fill its attention share, so a hero seed is always ONE
 *         PICKED OUT OF a stated mass.
 *     (c) THE RULER IS WELDED to the fae's own body — her head, her arm, her
 *         cupped hands. An off-camera ruler buys nothing and a free-floating
 *         in-frame one inflates too. 16 of 25 flight entries carry one, which
 *         is fine: honey-harvest measured the welded ruler reaching only 2 of 6
 *         emitted prompts while scale stayed correct 6 of 6, because the STATED
 *         COUNT is the load-bearing half and the ruler is the belt to its
 *         braces.
 *     The "every seed the same size" clause is NOT pushed into 25 pool entries
 *     (it reached only 4 of 25 there). It sits in template law 3 and in
 *     output-order item 4, because playbook 22 measured a law appended to 25 of
 *     25 seed tails reaching 1 of 5 prompts while the same clause in the output
 *     order reached 5 of 5.
 *
 * THE FIVE TRAPS THIS PATH IS BUILT AGAINST:
 *   1. THE NAKED-PUTTO PRIOR, which has already cost this bot a whole path.
 *      acorn-boat-regatta got 5 of 6 final-round renders back as UNCLOTHED,
 *      WINGLESS, FACELESS CHERUB DOLLS against a prompt that named petal-silk
 *      tunics, pointed ears and iridescent wings in every single one. "Tiny"
 *      and "palm-sized" on a humanoid ARE the prior, and at 1-2% of frame there
 *      is no resolution for cloth. star-charting beat it 0 of 26 and
 *      honey-harvest 6 of 6 FIRST TRY with exactly the fix reused here: ONE fae
 *      LARGE and NEAR, ADULT proportions stated as BODY PLAN and never as an
 *      age word, a real layered costume, ears and wings named, and tiny /
 *      little / palm-sized / doll / child / bare banned from the figure. It
 *      sits in the PROMPT PREFIX, in template law 1, and at output-order
 *      position 2 — and playbook 34 is why it is never demoted to buy room:
 *      a measured round that did exactly that lost wings in 4 of 6, ears in 5
 *      of 6 and the costume in 3 of 6.
 *   2. ⚠️⚠️ AN OPEN WINDY PLACE WITH SEEDS IN THE AIR IS THE MOST-PHOTOGRAPHED
 *      IMAGE IN THIS ENTIRE SUBJECT, and it is a WIDE GOLDEN FIELD AT SUNSET
 *      WITH SOFT FLOATING SPECKS. This is the path's `orchid-cloud-forest`
 *      moment (playbook 47): the premise itself imports the exact frame it must
 *      avoid, and the crop clause alone does NOT beat a vista prior — measured
 *      on star-charting, where the crop law reached 6 of 6 prompts every round
 *      and rendered in roughly 6 of 22. What decides it is WHAT KIND OF THING
 *      the near structure is (playbook 35): a thing whose whole outline could be
 *      drawn renders as that object with the figures shrunk to passengers, while
 *      a thing that is PART OF A LARGER BODY renders as a near surface. THE
 *      PATH-SPECIFIC BITE: "a dandelion", "a thistle", "a whole plant" are all
 *      the BAD CLASS — "a dandelion" renders a botanical photograph. So the near
 *      structure is ALWAYS a stalk, stem-thicket, bough or root bank that fills
 *      one side and RUNS OUT OF FRAME, a head is only ever named as something
 *      growing ON it at hand's reach, and the distance is ONE THIN BAND along a
 *      border. Stated in three places that reach Flux (the prefix, law 2,
 *      output-order item 1) — the form that took corridors to 0 of 20 on
 *      PixelBot floating-market-canal. Every meadow / field / vista / horizon /
 *      sunset / golden-hour word is banned from every pool and the sweep
 *      confirms 0 hits across all 175 entries.
 *   3. ⭐⭐ THE ADDITIVE LAW — THE MODEL ADDS BUT IT DOES NOT SUBTRACT, and this
 *      path is MADE of absences, which is why it gets its own block in every
 *      recipe. Measured on FarmBot 2026-09-23 with a true in-sentence control:
 *      one clause, both halves in the same sentence at the same position in the
 *      same prompt. The ADDITIVE half ("woolly cuffs still at the ankles")
 *      rendered 6 of 6 every round; the SUBTRACTIVE half ("no fluff on the body
 *      anywhere") rendered 1. Half of what happens on this path is a thing
 *      having LET GO, so "a bare seed head", "an empty pod", "a stripped stalk"
 *      and "leafless stems" would every one render FULL. The fix encoded in all
 *      seven recipes is to name a POSITIVE OBJECT THAT HAPPENS TO LACK THE
 *      FEATURE: "a seed head down to a bare woody knob with three last tufts
 *      still stuck to one side", "a pod split along one seam with its two halves
 *      curled right back like a boat hull", "a head gone to a pale pitted ring
 *      of sockets with one tuft still caught in it", "stalks tipped with a hard
 *      knuckle where a head came off".
 *   4. THE BOT'S OWN VOCABULARY IS THE ENEMY. The audit above found FaeBot's
 *      existing seed register is "drifting / floating / lazily / gently / slow
 *      soft descent / still air" — so if the recipes reach for the natural
 *      words, this path becomes `enchanted_vista_weather` with a fae standing in
 *      front of it, which is the sober-render failure the motto forbids. Hence
 *      the MOTION LAW in every recipe: that whole vocabulary is banned outright
 *      and every verb is wind-driven (bolting, sailing, streaming, spinning,
 *      tearing past, skidding, springing, escaping, clinging, snagging). The
 *      sweep's 6 surviving "drift" hits are all the NOUN sense (a drift of
 *      caught down heaped in bark cracks), which is good content and was read
 *      and kept.
 *   5. READABLE TEXT — low risk, handled by DELETION. The one live risk is that
 *      the most available image for "gathered seeds" is A PAPER SEED PACKET
 *      WITH PRINTED WORDS ON IT, and a surface whose SHAPE is a writing surface
 *      cannot be made safe by describing it (playbook 12: "blank" subtracts
 *      nothing, naming the noun adds). The whole packet / envelope / sachet /
 *      label / jar class is deleted from every layer — BrickBot measured
 *      "envelope" rendering a carpet of literal paper mail envelopes in 2 of 5
 *      renders — and seeds are carried only in fae vessels, which on this path
 *      are LIDDED, NETTED or WEIGHTED, because storing something that wants to
 *      fly away is the comedy of the job. Per playbook 26 every flat surface
 *      positively CARRIES something: a sack side carries its coarse weave and a
 *      bulge of down pushing out through it, a basket lid carries a river
 *      pebble. The sweep's 6 "beetle-shell panels" hits were reworded to
 *      "plates lapped curved-side-out" on playbook 57 (a curved surface is a
 *      safe substrate where a flat panel is not).
 *
 * ⭐ THE JARGON AUDIT (playbook 28 + 47 — run on the path's own TITLE first,
 *   because that word rides every prompt). Every result is banned in the
 *   recipes and swept out of the pools:
 *     "harvest" → a wheat field or a white-suited human · "gathering" → A SOCIAL
 *     CROWD, and this bot's own fairy-swarm path is built on a `gathering_event`
 *     pool, so the collision is live in FaeBot's vocabulary and it renders fae
 *     standing about, the exact static failure this path exists to avoid ·
 *     "samara" → NO LAYPERSON PRIOR AT ALL, so it collapses to a nearest
 *     centroid (the KODAMA trap) · "maple key" → a door key · "helicopter" → AN
 *     AIRCRAFT, and "spinning down like a helicopter" is the single most
 *     tempting sentence available on this path · "parachute" → a literal
 *     canopy and a person in a harness, the second most tempting · "clock" →
 *     a dandelion "clock" is the correct English name and a dial arrives
 *     carrying numerals no matter how it is worded (playbook 12) · "floss" →
 *     dental floss · "packet"/"envelope" → a printed paper rectangle ·
 *     "pappus"/"achene"/"dehiscence"/"dispersal" → no picture at all ·
 *     "catkin" → a cat. The Flux-facing nouns are: seed · seed head · pod ·
 *     dandelion head · thistledown · white down · white silk · a papery
 *     blade-seed · a hooked seed-ball · a rattling dry head.
 *
 * CROSS-AXIS DESIGN (playbook 16 — a prose compatibility clause loses to a pool
 *   pick, so make it structural. There are ZERO tag filters on this path, so
 *   every pool must compose with every other BY CONSTRUCTION, and that is also
 *   why no tag split had to be requested from a meta-prompt):
 *     • `stand` entries are all MIXED autumn stands (a dominant stalk or bough
 *       plus other dry stems of several kinds crowding in), which is what a
 *       hedge-bank at the end of the year actually is. That dissolves every
 *       species contradiction: any source and any flight compose with any stand.
 *     • `source` is written STAND-NEUTRAL — only the pod or head itself, its own
 *       stem, the seeds in or on it, and a pair of hands.
 *     • `work` is written SITE-NEUTRAL — only the fae's own bodies, the seeds
 *       and down and pods as unnamed-species things, the wind, the stem
 *       underfoot, its rim, the drop beyond it, and a generically-named vessel.
 *   Verified by the pool sweep and by a local dry-run over 40 composed briefs
 *   with no API call and no render, not by prose.
 *
 * GENDER: the template is deliberately PRONOUN-FREE ("the fae"), and each
 *   gatherer entry carries its own gender through its pronoun, build, face and
 *   hair. The gender-lock lesson only bites when a hard-gendered TEMPLATE fights
 *   mixed seeds, so this needs no separate male path.
 *
 * ⚠️ THE MODEL FACT THIS PATH IS DESIGNED AROUND, stated so nobody undoes it.
 *   flux-1.1-pro is the only shippable model on FaeBot (23 of 23 delivered,
 *   zero Replicate E005, zero signatures), and the whole flux-2 family hits a
 *   content-filter wall on this bot's close-adult-fae content — star-charting
 *   delivered 3 of 13, honey-harvest's flux-2-pro probe needed 20 safety
 *   retries for 4 deliveries and SIGNED 4 of 4, and flux-2-flex hard-failed 1
 *   in 2 on the same content. flux-1.1-pro-ultra is excluded because it signs
 *   its work (3 of 15 apothecary renders, 1 of 3 regatta) and a signature is
 *   readable text.
 *   AND flux-1.1-pro has ONE measured weakness: IT DISCARDS SMALL HAND-HELD
 *   OBJECTS. star-charting's reading instrument — the entire reason that path
 *   exists — rendered 0 of 22 on it, and honey-harvest's six-sided wax cups
 *   reached 6 of 6 prompts and rendered 2 of 6. So this path is deliberately
 *   built with NOTHING LOAD-BEARING THAT IS SMALL: every premise element is
 *   large by construction (an arm-length blade-seed, a head-sized tuft, a pod
 *   taller than the fae, a whole body committed to an action), and the nets,
 *   hoops, sacks and pails are kept in the wardrobe menu and the world's-own-
 *   words block rather than promoted to an axis. DO NOT "fix" a weak render by
 *   making a tool the hero — that is the one move this model is measured to
 *   ignore.
 *
 * ⭐⭐⭐ ROUND LOG (3 rounds × 6 shadow renders, graded on the 5-lens rubric
 *   against Kevin's motto). Delivery was 18 of 18 on flux-1.1-pro, zero E005,
 *   zero signatures, zero readable text, zero putto, and emitted prompts held
 *   flat at a 329-336 word median all three rounds.
 *
 *     round | the ONE variable                                  | avg  | min | max
 *     ------+---------------------------------------------------+------+-----+-----
 *       R1  | baseline                                          | 2.27 | 1.7 | 3.0
 *       R2  | a PATH-OWN CODE-ONLY MEDIUM (playbook 37)         | 3.33 | 2.9 | 3.9
 *       R3  | one token: seed "winged" → "papery blade"          | 4.15 | 3.4 | 4.6
 *
 *   R1 avg 2.27 — six clean, pretty, SOBER FAIRY PINUPS, which is star-charting's
 *     documented flux-1.1-pro failure on this bot word for word. The costume
 *     rendered 0 of 6 (every fae in a gauzy torn barefoot dress, 2 of them
 *     near-topless), the palette was pale monochrome sage in 6 of 6, the action
 *     beat rendered ~1 of 6, and the stand ~1.5 of 6.
 *     ⭐ THE DIAGNOSIS, and it was NOT the model. Reading the stored prompts
 *     rather than the images showed every law PRESENT and correctly placed —
 *     action at 1%, costume 8%, stand 11%, adult 1%, wings 8%, all 6 of 6. By
 *     playbook 33 a correctly-ordered element that renders 0 times is a MODEL
 *     fact, and I was one step from probing flux-2 (which honey-harvest had
 *     already proven unshippable). What the prompt actually showed was
 *     **35 words of FaeBot's bot-wide medium register sitting between the path
 *     prefix and Sonnet's scene, at 18-25% of the emitted prompt, in 6 of 6:**
 *     "soft ethereal painterly … dreamy atmospheric painted glow". Those words
 *     are the literal opposite of a wind rodeo, and all six renders were exactly
 *     what they describe — soft, dreamy, weightless, one-hue. This is playbook
 *     37 (the shared medium fragment is the highest-leverage layer in the fleet
 *     and the one nobody looks at, because it is not in the path file), and
 *     mushroom-apothecary's residual 7 had already named this exact string.
 *   R2 avg 3.33, +1.06 — ONE VARIABLE: `mediumByPath` to a path-own code-only
 *     medium, CONTENT swapped and LENGTH held (30 words → 33, 5 → 6), the painted
 *     lineage anchors preserved verbatim so the bot's look is unchanged. What one
 *     line bought, measured: designed costume 0 of 6 → 4 of 6 (a real hood, a
 *     feathered collar, laced boots), saturated autumn palette 0 of 6 → 6 of 6,
 *     near-nudity 2 of 6 → 0 of 6, action ~1 → ~3, stand ~1.5 → ~3. The bot-wide
 *     fragment had been suppressing the costume, the palette AND the action.
 *   R3 avg 4.15, +0.82 — ONE VARIABLE, and it is a single token. The pools used
 *     "wing" for a SEED 34 times and for the FAE 33 times across 175 entries, and
 *     every emitted prompt carried 3-5 of them mixed between the two referents.
 *     Flux cannot bind "winged" to the seed rather than to the flying humanoid,
 *     so the airborne seeds rendered as MOTHS AND BIRDS. Deleting the token from
 *     every seed reference and naming the SHAPE instead ("a papery tan blade with
 *     a fat nut bead at one end"), keeping "wings" exclusively for the fae:
 *     prompts naming a winged seed 5 of 6 → 3 of 6 → **0 of 6**, blade-seeds 0 →
 *     5 of 6, clear bird-shaped seeds in the render ~3 of 6 → 1 of 6, median
 *     prompt length unchanged. R3 draws: a fae hanging off a colossal split pod
 *     at full stretch with the air solid white behind her; a fae flying at a
 *     purple thistle head with a vermilion sash streaming, the stalk running out
 *     of frame top and bottom; a fae leaping off a bough with one hand on a seed
 *     head and the other flung wide over saturated maple red.
 *
 *   ⭐ THE REUSABLE LESSON: **BEFORE CONCLUDING "MODEL FACT", PRINT THE WHOLE
 *   EMITTED PROMPT AND LOOK AT WHAT SITS BETWEEN YOUR PREFIX AND SONNET'S TEXT.**
 *   Playbook 33 is right that a correctly-placed element rendering 0 times is a
 *   model fact — but "correctly placed" must be established against the ASSEMBLED
 *   prompt, not against the path file. My laws were at 1-11% and a register
 *   MANDATE was at 18-25%, and the mandate won. A per-law position audit finds
 *   this in one query; a model probe would have cost a round and confirmed a
 *   false conclusion, because flux-1.1-pro could render all of it — it was being
 *   told not to.
 *
 * RESIDUAL (one defect, one named lever, and the lever is NOT another rewrite).
 *   Everything the POOLS contribute still lands in playbook 43's dead zone while
 *   everything in the PREFIX lands in the attended region, and the correlation is
 *   exact across all three rounds:
 *     | clause                        | present | avg position | rendered |
 *     | prefix: action / costume / stand / adult / wings | 6 of 6 | 1-11% | 4-6 of 6 |
 *     | pool: pod split seam + curled halves            | 4 of 6 | 56%   | ~2 of 6 |
 *     | pool: two saturated colours                     | 5 of 6 | 52%   | ~4 of 6 |
 *     | pool: backlit ring of white fire                | 3 of 6 | 74%   | ~1 of 6 |
 *     | pool: welded ruler / every seed the same size   | 1-2/6  | 71-75%| n/a     |
 *   So the two named elements that a fourth round should rescue are THE POD
 *   MECHANISM (56%) and THE BACKLIT HALO (74%) — the path's two material money
 *   shots, and in the renders the pods are mostly closed heads rather than split
 *   shells and the halo appears about once per six. Per playbook 43 the lever is
 *   DELETING AN OUTPUT-ORDER ITEM, not reordering (34: reordering moves the
 *   failure onto whatever you demote) and not lengthening the prefix (it already
 *   carries four solved laws at 62 words). The specific cut: **delete output-order
 *   item 4 (the air / stated count), because the prefix already carries "two
 *   hundred white seed tufts sailing past her on the wind" and the count reached
 *   6 of 6 prompts from the prefix alone** — which promotes the pod and the light
 *   into the attended half at zero cost to a law that is already landing.
 *   Second, smaller: ~1 of 6 airborne seeds still read as birds with ZERO
 *   winged-seed tokens in the prompt, so the token was A cause and not the only
 *   one; small pale shapes scattered in an open sky is a bird composition
 *   regardless of the noun, and the fix would be structural (more of the frame
 *   filled by the stand, fewer seeds against bare sky).
 *
 * Config: FaeBot's default medium (painted_fantasy_novel — a 5-word shared
 *   fragment, so playbook 37's shared-fragment trap does not apply on this bot).
 *   chaos + sensoryAnchors are off bot-wide. twoPassPolish MUST skip this path:
 *   the one-large-fae law, the count law and the framing law are all
 *   load-bearing and Haiku compression strips them. nudityCheck MUST include
 *   this path — it is the trap-1 backstop and it fired on the regatta.
 *   sharedDNA.colorPalette is deliberately unused: `light` owns the palette and
 *   a fixed vibe colour-cast would override the rolled light, which matters more
 *   here than on its siblings because this is the bot's only AUTUMN path and
 *   FaeBot's bot-wide suffix pushes green ("green-mana lineage", "dreamy dappled
 *   light"). That green is kept deliberately — deep canopy emerald is the
 *   COMPLEMENT of this path's russet and gold, so it makes the autumn pop rather
 *   than fighting it, and `light` carries the autumn palette itself into the
 *   prompt where it is measured to work. If a round comes back green-cast or
 *   brown-on-brown, a path-scoped `promptSuffixByPath` is the named lever (the
 *   star-charting precedent) — not a pool edit.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const STAND = load('faebot_seedfall_stand');
const SOURCE = load('faebot_seedfall_source');
const FLIGHT = load('faebot_seedfall_flight');
const WORK = load('faebot_seedfall_work');
const GATHERER = load('faebot_seedfall_gatherer');
const LIGHT = load('faebot_seedfall_light');
const BYSTANDER = load('faebot_seedfall_bystander');

const BYSTANDER_GATE = 0.5;

module.exports = ({ vibeDirective, picker }) => {
  const stand = picker.pickWithRecency(STAND, 'seedfall_stand');
  const source = picker.pickWithRecency(SOURCE, 'seedfall_source');
  const flight = picker.pickWithRecency(FLIGHT, 'seedfall_flight');
  const work = picker.pickWithRecency(WORK, 'seedfall_work');
  const gatherer = picker.pickWithRecency(GATHERER, 'seedfall_gatherer');
  const light = picker.pickWithRecency(LIGHT, 'seedfall_light');
  const bystander =
    Math.random() < BYSTANDER_GATE ? picker.pickWithRecency(BYSTANDER, 'seedfall_bystander') : null;

  const bystanderSection = bystander
    ? `
━━━ THE OTHERS (smaller and further back — the near fae stays the hero) ━━━
${bystander}
`
    : `
━━━ THE OTHERS ━━━
This stand is hers alone: her own net, her own sack wedged in a fork, and the whole air coming past her at once.
`;

  return `You are a fantasy concept-art painter writing ONE short Flux prompt for a grown fae working the autumn seed fall in a great forest, in FaeBot's soft painted-fantasy register (Manchess + Giancola + Bonner + Froud painted-fantasy lineage). A timeless fae world where everything in frame was made by hand from what the woodland gave.

━━━ THE FIVE LAWS OF THIS PICTURE ━━━
1. ONE FAE, LARGE AND NEAR, AND SHE IS IN THE MIDDLE OF DOING SOMETHING. Close in the foreground, painted BIG at a third of the picture's height: a grown adult's long limbs and real face, hair, pointed ears, open wings, a layered fae-craft coat or hood covering her — and her whole body committed to the action, never standing and looking. The action and the costume are ONE phrase, action first.
2. THE STAND IS PART OF SOMETHING TOO BIG TO FIT. A dry stalk thicker than the fae's wrist, a low bough or a bank of tangled stems fills one side and runs out of frame, heads and split pods at her own height, other dry stems crowding close behind. The distance beyond is ONE THIN BAND along a border.
3. THE AIR IS FULL OF SEEDS UNDER WAY, ALL ONE SIZE. A stated count — a hundred white tufts, thirty spinning blade-seeds — every one the same shape and size INCLUDING the nearest, because the one you describe most is the one that comes out biggest. Each tuft is about as big across as the fae's own head, each papery blade-seed as long as her arm. Say which way the wind is taking them.
4. THE LIGHT COMES FROM BEHIND AND STRAIGHT THROUGH THE DOWN. A crown of down lit from behind burns as a ring of white fire, a column of silk lights through like smoke, a papery blade-seed glows tan with its veins dark through it. One committed direction, TWO named saturated colours in hard opposition.
5. THE WIND IS WINNING. Effort, haste, nerve, comedy — more of it escaping than caught — plus one clever thing the eye finds on second look.

Everything below is NOTES, longer than your prompt. Take from each only what fits.

━━━ WHERE IT IS (the stage — its stems run out of frame) ━━━
${stand}

★━━━ WHAT IS HAPPENING RIGHT NOW (goes in your SECOND phrase, before the costume) ━━━
${work}

━━━ THE FAE DOING IT (painted large and near) ━━━
${gatherer}

★━━━ THE POD OR HEAD UP CLOSE, AND HOW IT LETS GO ━━━
${source}

★━━━ THE AIR (a stated count, one welded ruler, every seed the same size) ━━━
${flight}

★━━━ THE LIGHT (the money shot — it owns the whole palette) ━━━
${light}
${bystanderSection}
━━━ THIS WORLD'S OWN WORDS ━━━
A dandelion head as wide across as the fae is tall, a crown of fine white down on a thin stalk, thistledown coming off in handfuls, a papery tan blade-seed as long as her arm with a fat bead of a nut at one end, spinning flat as it comes down, a hooked seed-ball bristling all over and stuck fast, a net of woven grass on a bent hazel hoop, a woven-grass sack pulled shut on a cord, a river pebble laid on a pail's lid to hold it down.

━━━ WRITE THE SHAPE THAT IS THERE ━━━
Where something has let go, name the object that is LEFT, never what has gone: a woody knob with three last tufts stuck to it, a pale pitted ring of sockets, a pair of curled papery shells. A described absence renders as the full thing.

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 90) : ''} — colour the feeling only; the fae stays large, the air stays full and the light stays committed.

━━━ LENGTH IS THE FIRST RULE — 110-140 WORDS, COUNT THEM ━━━
Your whole prompt is SHORTER than any one section above. Name each thing in three or four words and move on. Write comma-separated phrases in THIS order and then STOP:
[name it plainly, with the dry autumn stalk or bough filling one side and running out of frame, its heads and split pods at the fae's own height, and one thin band of far autumn canopy below],
[ONE grown fae close and LARGE in the foreground, CAUGHT MID-ACTION — say what her whole body is doing right now FIRST, then the layered fae-craft coat or hood and its colours, her hair, pointed ears and open wings, all in this one phrase],
[the pod or head up close: its split seam and curled-back halves, or its packed crown of tufts, and how it is letting go],
[the air: a stated count of a hundred tufts or thirty papery blade-seeds, each tuft as big across as the fae's head, every one the same size, and which way the wind is taking them],
[what the light is doing coming THROUGH the down and the papery blade-seeds, and its two saturated colours],${bystander ? '\n[the others, smaller and further back],' : ''}
[one thin band of far autumn canopy below, soft painted-fantasy oil-brushwork].

If it will not all fit, the large near fae MID-ACTION, the stems running out of frame, and the air full of seeds are the ones that must survive. Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/faebot/index.js) ───────────────────
 *
 *  1. pathBuilders:
 *       'autumn-seed-gathering': require('./paths/autumn-seed-gathering'),
 *  2. shadowPaths — add:
 *       'autumn-seed-gathering',
 *  3. twoPassPolish.skipPaths — add:
 *       'autumn-seed-gathering',
 *  4. nudityCheck.paths — add:
 *       'autumn-seed-gathering',
 *  5. promptPrefixByPath — add. The first tokens CLIP reads, and the order is
 *     MEASURED, not stylistic.
 *     ⚠️⚠️ THE FIRST EIGHT WORDS ARE INHERITED FROM honey-harvest AND THEY ARE
 *     THE PATH. That build measured it cleanly: with the prefix opening on a
 *     STATIC portrait ("one slender grown fae close in the foreground, painted
 *     large, in a layered coat...") the action beat rendered 0 of 12 across two
 *     rounds while sitting in 12 of 12 emitted prompts. Putting a VERB in front
 *     of it, ADDITIVELY, with every anti-putto token preserved, took it to 6 of
 *     6 with nothing lost. A prefix that describes a POSE gets you a pose; the
 *     same prefix with a verb in front gets you the verb. Do not tidy it out.
 *     Then the STAND as the near frame (the anti-vista crop), then the pod and
 *     the air, still inside the first third where CLIP's attention budget lives.
 *     ⚠️ DO NOT DEMOTE THE FAE CLAUSE to buy room for anything else — playbook
 *     34 measured exactly that trade on the sibling path and it lost wings in 4
 *     of 6, pointed ears in 5 of 6 and the costume in 3 of 6.
 *       'autumn-seed-gathering':
 *         'one slender grown fae hard at work, caught mid-movement with her whole body committed, painted large and close in the foreground, in a layered fae-craft coat with open wings, on a great dry autumn stalk that fills one side of the picture and runs out of frame, a split seed pod at her shoulder taller than she is, and two hundred white seed tufts sailing past her on the wind',
 *  6. modelByPath — add. flux-1.1-pro ONLY, AND THIS PIN IS REQUIRED, not a
 *     preference: FaeBot's `allowedModels` is flux-1.1-pro + flux-1.1-pro-ultra
 *     and its picker rolled ULTRA on 15 of 15 mushroom-apothecary renders, so
 *     without a pin this path would render on the model that SIGNS its work
 *     (3 of 15 apothecary, 1 of 3 regatta) and a painted signature is readable
 *     text, a hard fail on the rubric.
 *       'autumn-seed-gathering': { 'black-forest-labs/flux-1.1-pro': 1 },
 *     • flux-1.1-pro is 23 of 23 delivered on FaeBot with zero Replicate E005.
 *     • THE WHOLE flux-2 FAMILY IS EXCLUDED and this is measured, so nobody
 *       re-runs it: star-charting delivered 3 of 13 (77% E005), honey-harvest's
 *       flux-2-pro probe needed 20 safety retries for 4 deliveries and signed 4
 *       of 4, and flux-2-flex hard-failed 1 in 2 on the same content. What the
 *       failing paths share, and the twelve clean flux-2 paths do not, is a
 *       CLOSE ADULT FAE BODY. This path has one.
 *     • And see the MODEL FACT block in the header before "fixing" any weak
 *       render by promoting a small hand tool — this model discards those.
 *  7. ⭐⭐ THE MEDIUM — THIS IS THE SINGLE MOST IMPORTANT REGISTRATION ITEM AND
 *     IT IS WORTH +1.06 ON THE ROUND AVERAGE. Three keys, all path-scoped, no
 *     other FaeBot path touched, no DB row and no migration (playbook 37's
 *     measured fix: a code-only medium overrides the DB flux_fragment).
 *     WHY: FaeBot's bot-wide register — `promptPrefixByMedium.painted_fantasy_novel`
 *     (30 words) + `mediumStyles.painted_fantasy_novel` (5 words) — is assembled
 *     as `pathPrefix + prefix + mediumStyle + middle + suffix`, so it lands
 *     BETWEEN this path's prefix and Sonnet's scene, at 18-25% of the emitted
 *     prompt, inside the attended region, on every render. It reads "soft
 *     ethereal painterly … dreamy atmospheric painted glow", which is the literal
 *     opposite of this path, and in R1 all six renders were exactly that: soft,
 *     dreamy, weightless, one-hue, costume 0 of 6, saturated palette 0 of 6.
 *     The swap changes CONTENT ONLY and holds LENGTH (30→33 words, 5→6), and the
 *     painted lineage anchors are preserved verbatim so the bot's look is
 *     unchanged. Measured result: costume 0→4 of 6, saturated autumn palette 0→6
 *     of 6, near-nudity 2→0 of 6.
 *     ⚠️ The `modelByPath` pin in item 6 is REQUIRED for this to work at all —
 *     it is what stops `pickModel` reading the absent `dream_mediums` row for a
 *     code-only medium key. Registering the medium without the pin breaks the path.
 *     FaeBot already proves the pattern: `faebot_gpt_clean` is a second code-only
 *     medium key with its own (empty) promptPrefixByMedium entry.
 *       mediumByPath: {
 *         'autumn-seed-gathering': 'faebot_seedfall',
 *       },
 *       mediumStyles — add:
 *         faebot_seedfall: 'autumn seedfall fantasy concept art, painterly',
 *       promptPrefixByMedium — add:
 *         faebot_seedfall:
 *           'painted fantasy concept art, visible oil-brushwork, Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy lineage, saturated autumn colour, hard directional light, everything in the frame moving on a strong wind',
 *     NOTE FaeBot has no `mediumByPath` key at all today (the comment at the top
 *     of index.js says it is "omitted — flower-fairy falls through to
 *     defaultMedium"), so this ADDS the key. Rollback = delete these three
 *     entries and the path falls back to `painted_fantasy_novel`, i.e. to R1.
 *  8. promptSuffixByPath — deliberately NOT added, unlike star-charting. The
 *     bot-wide suffix's "green-mana lineage" and "dreamy dappled light" are the
 *     COMPLEMENT of this path's russet-and-gold, so the green makes the autumn
 *     pop; and honey-harvest kept the bot-wide suffix and took zero readable
 *     text in 12 renders. If a round comes back green-cast, brown-on-brown, or
 *     carrying a watermark (acorn-boat-regatta measured the suffix's "no text,
 *     no watermarks" negation rendering an actual stock-photo URL in 2 of 24
 *     renders on this exact bot), a path-scoped suffix is the named lever.
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), chaos + sensoryAnchors are disabled bot-wide, and the medium falls
 * through to defaultMedium `painted_fantasy_novel`. Going live later = move the
 * string from shadowPaths[] into paths[].
 */
