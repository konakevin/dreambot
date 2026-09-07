#!/usr/bin/env node
// AlphaBot candidate — anime-haunted-school (destination: MangaBot).
// The classic anime "gakkou no kaidan" (school ghost-story) trope: an empty,
// moonlit Japanese school at night, flickering lights, a lone student
// exploring room to room. PLAYFUL-SPOOKY delighted-nervous adventure energy,
// never genuine horror. 5 bespoke pools, scaled to production depth (target
// 120, grow-to-N via append: true — keeps the tested MVP-25 entries) (CAST +
// CAMERA_FRAMING are short fixed lists inlined directly in the path file, no
// pool needed).
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // ─── LOCATION — the specific after-hours school spot (always present) ───
  await generatePool({
    outPath: DIR + 'anime_haunted_school_location.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} EMPTY MOONLIT SCHOOL AT NIGHT staging scenes for an anime school-ghost-story bot. Each is ONE specific spot inside or just outside a Japanese school building after dark — a hallway, stairwell, pool, library, art room, music room, science lab, rooftop door, gymnasium, courtyard shrine, clubroom, cafeteria, etc. The location is the hero: a lived-in, richly detailed world with foreground / midground / background depth layers, NOT an empty box. Moonlight and shadow set the general mood here — the ONE specific eerie light source is a separate axis, so keep the light general/ambient in this pool (moonlight, dark, shadow) rather than naming one dramatic light effect. Each entry 30-45 words, dense and specific. Do NOT mention any student/person (the cast is a separate axis).

━━━ SPAN ACROSS ALL ${n} (don't cluster on one sub-concept) ━━━
- a long straight hallway lined with grey lockers, moonlight pooling on the floor
- a stairwell landing with a tall arched window
- the school's indoor swimming pool at night, water black and still
- the library's towering dim stacks
- the art room with rows of covered easels and a plaster bust
- the music room with a lone grand piano
- the science lab with rows of specimen jars on shelves
- the rooftop access door, chained but slightly ajar
- a shoe-locker genkan entrance hall
- the gymnasium, vast and empty, moonlight through high windows
- the nurse's office with curtained beds
- an outdoor covered walkway (watari-rouka) connecting two school buildings
- a small shrine and torii gate tucked in a corner of the school grounds
- the cafeteria with chairs stacked on tables
- the auditorium stage, curtains half-drawn
- a cluttered clubroom full of equipment
- a courtyard with a stone well or fountain
- the school's clocktower stairwell
- an ordinary classroom with desks and an old chalkboard
- the basement boiler/furnace room
- a rooftop garden or planter boxes near the access door
- a computer lab with rows of dark monitors
- a home-economics room with sewing machines and hanging aprons
- the school infirmary hallway with a vending machine humming

━━━ EXAMPLES (match this format/length/density) ━━━
"A long straight hallway stretches into darkness, rows of grey lockers lining both walls, moonlight pooling in cold silver bars across the linoleum, a single classroom door standing ajar at the far end, dust motes drifting through the quiet."
"The school's indoor swimming pool lies black and glassy beneath a wall of tall windows, faint moonlight rippling across the still surface, diving blocks lined up at the near edge, the ceiling's exposed beams fading into shadow above."
"Towering library stacks rise on either side of a narrow aisle, spines catching stray moonlight through a high skylight, a single reading lamp left glowing at a far table, dust drifting lazily through the hush."

━━━ RULES ━━━
No brand/real-school names, no readable text, no student/person mentioned. Cozy-eerie architecture only — no genuine horror, no blood, no gore.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── ACTION — the student's cautious-but-curious exploring action ───
  await generatePool({
    outPath: DIR + 'anime_haunted_school_action.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} CAUTIOUS-BUT-CURIOUS exploring actions for a lone student in an anime school-ghost-story scene. Each entry describes body language / motion only (no location, no light, no folklore — those are separate axes) — the student is thrilled and nervous, NEVER genuinely terrified. Each entry 15-25 words, written as a participial/descriptive phrase (fits after either "a schoolgirl in a uniform, ___" OR "a schoolboy in a uniform, ___" — the SAME pool serves both, picked at random per render).

⚠️⚠️ NEVER use a gendered pronoun ("her"/"she"/"his"/"he") anywhere — the entry must read equally naturally for a schoolgirl OR a schoolboy. Use "their," name the body part with no possessive ("a hand," "the chest," "one shoulder"), or restructure the sentence to avoid needing a pronoun at all.

━━━ SPAN ACROSS ALL ${n} (vary the body language, don't repeat) ━━━
- gripping a flashlight with both hands, beam trembling slightly ahead
- peering slowly around a corner, one eye first
- pressed flat against the lockers, listening hard
- tiptoeing past a row of closed classroom doors
- crouched low, peeking through a gap under a door
- backing away slowly, eyes wide, not looking away from the dark
- reaching a hesitant hand toward a half-open door
- frozen mid-step, one foot still raised, listening
- glancing back over one shoulder while hurrying forward
- cupping a candle against a draft with one hand
- easing a heavy door open inch by inch
- standing on tiptoe to peer through a high window
- hugging a textbook to the chest for comfort, edging forward
- pausing at a fork in the hallway, unsure which way to go
- caught mid-step as a gust catches hair and uniform hem
- kneeling to examine strange chalk marks on the floor
- climbing the stairs two at a time, flashlight beam swinging wildly
- leaning into a doorway, silhouette caught in a beam of light
- covering a nervous, excited grin with one hand
- creeping forward with exaggerated, careful tiptoe steps
- spinning around at a sudden sound, flashlight raised like a weapon
- pressing an ear to a closed door, breath held

━━━ EXAMPLES (match this format/length — note: zero gendered pronouns) ━━━
"gripping a flashlight in both trembling hands, beam sweeping the dark hallway ahead, weight shifted onto the balls of both feet, ready to bolt or dash forward"
"pressed flat against a row of lockers, one eye peeking around the corner, breath held, listening hard for the sound that started this whole thing"
"tiptoeing past a line of closed classroom doors, flashlight beam low and careful, shoulders hunched with the thrill of being somewhere they shouldn't be"

━━━ RULES ━━━
Thrilled-and-nervous energy only, never genuine terror or panic. No blood, no gore, no violence. No mention of location or light source (separate axes). NEVER a gendered pronoun (her/she/his/he) — this pool must work for either a schoolgirl or a schoolboy.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── EERIE_LIGHT — the MONEY SHOT (~60% of renders) ───
  await generatePool({
    outPath: DIR + 'anime_haunted_school_eerie_light.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} "money shot" EERIE LIGHT compositions for an anime school-ghost-story bot — the ONE glowing/flickering light detail that makes a render instantly iconic and recognizable as THIS path. Each entry is a SPECIFIC, vivid light-source composition (never a character, never a folklore creature — just light and its effect on the space). Each entry 15-25 words.

━━━ SPAN ACROSS ALL ${n} (vary the light source — fluorescent, moonlight, exit sign, flashlight, candle, screen-glow...) ━━━
- a lone fluorescent tube at the hallway's far end, flickering and buzzing between darkness and cold white light
- a stark moonbeam slicing through a tall window, laying a cold silver bar across the floor
- a corridor's EXIT sign glowing a lone sickly green in the pitch-black hall
- a bare bulb swinging gently in a supply closet, throwing shifting shadows across the walls
- candlelight flickering warm from behind a cracked-open classroom door
- a single lit window glowing at the far end of an otherwise pitch-black hallway
- moonlight pouring straight down through a skylight in one perfect cold column
- a vending machine's cold blue-white glow humming alone in an empty corridor
- a flashlight beam cutting a narrow trembling cone through total darkness
- a row of emergency lights blinking on one by one down the length of the hall
- a chalky moonbeam falling across an otherwise empty chalkboard
- the pale ghostly glow of a computer-lab monitor left on in the dark
- a distant flash of lightning briefly illuminating the hall through tall windows
- a paper lantern left glowing from a leftover culture-festival display
- the pool's underwater lights glowing an eerie pale blue beneath still black water
- a single classroom light left on, spilling gold across an otherwise dark courtyard below
- a string of fairy lights left glowing, half-buried under a pile of festival decorations
- moonlight catching the glass of a trophy case, throwing faint reflections down the hall

━━━ EXAMPLES (match this format/length) ━━━
"A lone fluorescent tube at the hallway's far end flickers and buzzes, stuttering the corridor between total darkness and cold white light."
"A stark moonbeam slices through a tall window, laying a cold silver bar clean across the dark classroom floor."
"The corridor's EXIT sign glows a lone sickly green in the pitch-black hall, the only color in a world of shadow."

━━━ RULES ━━━
Every entry is about ONE specific light source and its visible effect on the space — no characters, no folklore creatures, no brand names, no readable text beyond a generic "EXIT" sign. Eerie-but-cozy, never genuinely menacing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── PRESENCE — optional playful folklore hint (~45% of renders) ───
  await generatePool({
    outPath: DIR + 'anime_haunted_school_presence.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} PLAYFUL JAPANESE-FOLKLORE HINTS for an anime school-ghost-story bot — a small supernatural detail glimpsed in an empty school at night. Each entry must be MISCHIEVOUS and CURIOUS in register, never a genuine jump-scare or threat — the tone is "the school's fun local legend turned out to be a little bit real," not horror. Use REAL, respectfully-drawn Japanese folklore vocabulary where relevant (kitsune fox-spirits have multiple tails, ofuda are paper talismans, yokai are specific named types) — no generic "demon" or Western-horror imagery, and NEVER a named real horror-movie ghost (no Sadako, no Ring, no Ju-on, no Grudge). Each entry 15-25 words.

━━━ SPAN ACROSS ALL ${n} (vary the folklore beat, don't repeat) ━━━
- a kitsune's twin fox-tails vanishing around a corner ahead, quick and playful
- a paper talisman (ofuda) peeling itself off a door, drifting lazily to the floor
- chalk squeaking on its own, finishing a doodle on the blackboard
- a classroom's anatomical skeleton model slowly turning its head to watch
- the courtyard shrine's stone fox statue turned slightly from how it stood yesterday
- a faint second reflection blinking in an otherwise empty dark window
- a small round drifting light bobbing near the ceiling, curious rather than menacing
- the music room's piano sounding one soft, unplayed note
- an art-room mannequin now posed differently than it was left
- footsteps echoing softly from a room that's provably empty
- a cold draft carrying a faint trace of incense from nowhere
- a shadow slipping past a doorway with one tail too many
- a basketball rolling by itself across the gym floor, slow and deliberate
- a small hand-shaped smudge appearing on a fogged-up window
- a phantom bell tolling once from the empty clocktower
- a potted plant's tendril curling unnaturally fast around a windowsill overnight
- the shrine's fox-statue eyes seeming to catch the light and wink
- a chorus of faint, giggling whispers drifting up an empty stairwell
- a locker door swinging open on its own, then gently shut again
- a paper crane on a desk unfolding itself, one careful fold at a time

━━━ EXAMPLES (match this format/length) ━━━
"A kitsune's twin fox-tails vanish around the corner ahead, quick and playful, gone before a proper look can catch them."
"A paper talisman peels itself from the door frame, drifting lazily to the floor as if bored of waiting."
"The art room's anatomical model has turned to face the door, posed exactly as it wasn't a moment ago."

━━━ RULES ━━━
Mischievous and curious ONLY, never a genuine scare or threat. Real, respectful Japanese folklore vocabulary (kitsune/ofuda/yokai) where used — no generic Western-horror imagery, no named real horror-movie ghosts, no blood, no gore. NO readable text/writing appearing in the scene (no quoted signs, no spelled-out words, no specific kanji/characters being written or shown) — describe chalk "finishing a doodle" or a talisman drifting, never a legible written message.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── DETAIL — small culture-festival/Halloween decor micro-detail (always) ───
  await generatePool({
    outPath: DIR + 'anime_haunted_school_detail.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} small SEASONAL DECOR micro-details for an anime school-ghost-story bot — a leftover Halloween / autumn-culture-festival touch found somewhere in the empty school at night, keeping the tone playful even in the dark. Each entry 12-20 words, ONE specific small detail.

━━━ SPAN ACROSS ALL ${n} ━━━
- a grinning jack-o-lantern left forgotten on a windowsill, candle guttering low
- paper-cutout bats dangling from a hallway ceiling, leftover from the festival
- a half-carved pumpkin abandoned on a classroom desk, a small knife resting beside it
- orange fairy-lights strung along a bulletin board, still glowing softly
- a hand-drawn ghost poster taped crooked to a locker
- cobweb streamers looped over a doorway from the school's autumn festival
- a paper black-cat cutout taped to a windowpane
- a bowl of leftover candy sitting on the teacher's desk
- a stack of festival lanterns waiting in a corner to be hung
- a chalkboard corner doodled with a cartoon ghost and a grinning pumpkin
- a scarecrow mascot propped just inside the school entrance
- orange-and-black paper bunting sagging gently over a doorway
- a cart of handmade Halloween decorations left in a hallway, waiting to be put up
- a witch-hat-shaped paper lantern hanging from a ceiling hook
- a trail of candy-wrapper confetti near an abandoned festival game booth
- a pumpkin-shaped wreath hung slightly crooked on a classroom door
- a row of student-drawn ghost illustrations pinned along a corridor wall
- a paper spider dangling from a thread taped to a doorframe
- a leftover candy-corn garland looped along a stairwell railing
- an autumn-leaf and gourd centerpiece left on the reception desk

━━━ EXAMPLES (match this format/length) ━━━
"A grinning jack-o-lantern sits forgotten on a windowsill, its candle guttering low but still lit."
"Paper-cutout bats dangle from the ceiling in a loose string, leftover decorations from the school's autumn festival."
"A half-carved pumpkin waits abandoned on a classroom desk, a small knife left resting beside it."

━━━ RULES ━━━
Playful and cheerful only — no scary carved faces, no blood, no gore. No brand names, NO readable text (no quoted signs, no spelled-out words or messages) — a "doodle" may be a cartoon drawing but never legible writing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
