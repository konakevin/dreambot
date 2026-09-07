#!/usr/bin/env node
// AlphaBot candidate "anime-halloween-cozy" — MVP-25 seed pools.
//
// Cloned identity target: MangaBot (hand-drawn anime illustration, Ghibli/
// Shinkai/Kyoto-Animation register, characters by role only — never named).
// Concept: a QUIET, INTIMATE indoor Halloween-at-home moment — one character
// (or two, sharing it) carving a pumpkin at the kitchen table, curled up
// under a blanket watching a scary movie, or sorting a trick-or-treat candy
// haul on the bedroom floor. Warm, cozy, playful — never real horror.
//
// 6 generated pools (this script). The optional Halloween-touch on outfit
// is baked into ~half the pool entries themselves (never mandatory) rather
// than a runtime conditional; the small decor-accessory list is likewise a
// full generated pool, not a fixed inline array, per Kevin's variety bar:
//   anime_halloween_cozy_character.json — who they are (ethnicity/age/hair/mood)
//   anime_halloween_cozy_outfit.json    — cozy loungewear (~50% w/ a tiny
//                                          Halloween print/accessory woven in,
//                                          ~50% plain autumn-cozy — never a
//                                          full costume either way)
//   anime_halloween_cozy_activity.json  — the specific cozy Halloween moment
//                                          (subject-free gerund phrasing so
//                                          it fits a solo character OR a duo)
//   anime_halloween_cozy_setting.json   — the small warm indoor nook
//   anime_halloween_cozy_decor.json     — one playful Halloween decor beat
//   anime_halloween_cozy_glow.json      — MONEY SHOT: the signature warm/cool
//                                          light interplay (jack-o-lantern or
//                                          candlelight vs. screen-flicker or
//                                          blue dusk through the window)
//
// Run: node scripts/gen-seeds/alphabot/gen-anime-halloween-cozy-pool.js
//
// 2026-09-07 — SCALED to production depth (approved candidate): total 25→120
// + append:true on all 6 pools (grow-to-N — keeps the tested MVP-25 entries,
// adds more with the SAME recipe/register, never overwrites them). Actual
// final size per pool settles wherever the semantic ceiling / dedup lands it.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // ── character ────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_halloween_cozy_character.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} CHARACTER entries for a quiet, cozy anime Halloween-at-home art bot. Each entry is ONE anime character by role/archetype only (NEVER a named specific anime character) — a teenager or young adult, described by ethnicity + hairstyle detail + one warm mood/expression cue. This is a slice-of-life anime register (Ghibli/Shinkai/KyoAni), not a fantasy or creature cast, so ordinary human ethnicity + age/gender words are correct here. Each entry 16-28 words.

━━━ FORMAT (match this exactly) ━━━
"Japanese teenage girl, soft messy twin-braids fraying loose over one shoulder, cheeks flushed pink and eyes warm with sleepy contentment"
"Korean college student, glasses fogged faintly at the edges, dark hair mussed under a loose beanie, an easy half-smile"
"mixed-heritage teenage boy, tousled curls falling over one eye, quiet unhurried calm in his posture"
"Filipino young woman, dark hair twisted up in a claw-clip with loose strands framing her face, a dimpled easy grin"

━━━ SPREAD ACROSS ALL ${n} — broad global diversity, majority Japanese/East-and-Southeast-Asian (this is an anime-register cast) with real range beyond it ━━━
Japanese (~35%), Korean, Chinese, Taiwanese, Filipino, Vietnamese, Thai, Indonesian, Indian, mixed-heritage (~15% total), plus a handful of Mexican, Brazilian, Nigerian, American, British, French, Italian entries for real global range. Mix genders roughly evenly. Age register stays teenage-through-mid-20s (high-schooler to college-age/young-adult) — the protagonist age of a slice-of-life anime.

━━━ RULES ━━━
Vary hairstyle (braids, buns, loose waves, short crops, ponytails, bedhead, beanie-mussed) and expression/mood (sleepy-content, quietly focused, giggly, drowsy-cozy, wide-eyed-suspense, dreamy) so no two entries read the same. No named characters, no franchises, no brand names, no text.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── outfit (~50% carry ONE small Halloween touch, never a full costume) ─
  await generatePool({
    outPath: DIR + 'anime_halloween_cozy_outfit.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} OUTFIT entries for a quiet, cozy anime Halloween-at-home art bot. Each entry is ONE cozy at-home loungewear look — soft sweaters, flannel pajama pants, oversized hoodies, knit socks — in warm autumn colors. Each entry 16-28 words.

━━━ FORMAT (match this exactly) ━━━
"an oversized cream cable-knit sweater with sleeves pulled past the fingertips, plaid flannel pajama pants, one fuzzy orange sock half-slipping off"
"a soft grey hoodie with a small embroidered black cat over the pocket, loose sweatpants, a knit beanie pushed back off the forehead"
"a chunky mustard-yellow cardigan over a plain white tee, cotton shorts, mismatched striped knee-socks"
"a black zip-hoodie printed with one friendly grinning jack-o-lantern face on the chest, plaid pajama pants, fuzzy bat-shaped slippers"

━━━ CRITICAL — MIX OF EXACTLY TWO KINDS, roughly HALF AND HALF ━━━
- ~50% PLAIN COZY: warm-toned everyday loungewear only (sweaters, flannel, hoodies, knit socks, cardigans) — NO Halloween print or accessory at all, just autumn-cozy colors and textures.
- ~50% ONE SMALL HALLOWEEN TOUCH: the SAME kind of cozy loungewear, but with exactly ONE small woven-in seasonal detail — a printed jack-o-lantern/black-cat/ghost graphic on a hoodie or sweater, pumpkin-print socks, bat-shaped slippers, a small cat-ear headband, a witch-hat-shaped hair clip. Never a full costume, never a cape, never a mask — just one charming accent on ordinary loungewear.
Do not let the Halloween touch dominate more than half the entries — variety is the point.

━━━ RULES ━━━
No text, no brand names, no full costumes (this is loungewear with at most one small accent, not dress-up).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── activity (subject-free — fits a solo character OR a duo) ───────────
  await generatePool({
    outPath: DIR + 'anime_halloween_cozy_activity.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} ACTIVITY entries for a quiet, cozy anime Halloween-at-home art bot. Each entry is ONE intimate, small-scale Halloween-at-home moment — a gerund-phrase action written WITHOUT naming the subject (no "she/he/they", no noun for the person) so it can be paired with either ONE character or TWO sharing the moment. Each entry 14-26 words, comma-separated phrasing, concrete sensory/tactile detail.

━━━ FORMAT (match this exactly — no subject noun, just the action + sensory detail) ━━━
"Carving a lopsided grinning face into a pumpkin at the kitchen table, tongue poking out in concentration, curls of orange peel piling on spread newspaper"
"Curled deep under a fleece blanket on the couch, knees hugged to chest, eyes wide at a flickering screen during the scary part"
"Cross-legged on the bedroom floor, sorting a trick-or-treat candy haul into piles by wrapper color, half-unwrapped chocolate already in hand"

━━━ SPREAD ACROSS ALL ${n} — vary the specific moment, don't repeat the same 3 named in the brief ━━━
- carving a jack-o-lantern face at the kitchen table, seeds and pulp scattered on newspaper
- curled under a blanket on the couch watching a scary movie, knees hugged to chest
- sorting a trick-or-treat candy haul into piles on the bedroom floor
- roasting the scooped pumpkin seeds in a pan, sticky fingers and all
- painting a small pumpkin with careful little brushstrokes at a low table
- stringing orange fairy-lights along a windowsill or shelf
- making mugs of cocoa with marshmallows melting on top
- trading candy with a pile split down the middle, negotiating over favorites
- doing a face-mask "mummy" skincare night while the movie plays in the background
- folding paper bats or ghosts to hang from a string
- painting nails black-and-orange, one hand still wet, waiting carefully
- toasting marshmallows over a stovetop burner or a small tabletop candle
- drawing a Halloween picture with orange and black crayons at a low table
- reading a spooky-but-friendly picture book under a blanket by lamp-light
- carving initials into a second smaller pumpkin as an afterthought
- half-watching a horror movie from behind a raised knee, peeking through fingers
- decorating cookies with orange icing and candy-eye sprinkles at the counter
- untangling a knot of string-lights before hanging them around a doorway
- listening to a spooky radio drama with the lights turned low
- wrapping leftover candy into little bags for tomorrow, tape and scissors nearby

━━━ RULES ━━━
Every activity stays PLAYFUL, cozy, and gentle — a "scary movie" or "ghost story" reads as fun tension, never real dread; nothing bloody, nothing genuinely frightening. No text, no brand names, no subject noun (start with the gerund/participle).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── setting ──────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_halloween_cozy_setting.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} SETTING entries for a quiet, cozy anime Halloween-at-home art bot. Each is ONE small, warm, INDOOR nook, lightly decked out for autumn/Halloween — the intimate stage for the moment. Draw on real anime-slice-of-life interiors (a kotatsu low table with its blanket skirt is a classic, welcome choice). Each entry 18-32 words, comma-separated phrasing, concrete cozy props.

━━━ FORMAT (match this exactly) ━━━
"A low kotatsu table with its quilted blanket skirt, a half-carved pumpkin and a bowl of scooped seeds on top, warm lamp glow against the dark window beyond"
"A living-room couch nook piled with cushions and a fleece throw, a TV glowing in the dim room, a bowl of candy corn within reach on the armrest"
"A bedroom floor beside an unmade bed, string-lights taped along the headboard, candy wrappers and a trick-or-treat pumpkin pail spilled across the rug"

━━━ SPREAD ACROSS ALL ${n} ━━━
- kotatsu low table with its blanket skirt, in a tatami-mat room
- living-room couch/blanket-nest facing a glowing TV
- bedroom floor beside an unmade bed
- kitchen table strewn with pumpkin-carving mess (seeds, pulp, small knives set aside)
- window seat with autumn leaves outside the glass, dusk light fading to blue
- study desk with a lamp, notebook pushed aside, Halloween movie playing on a laptop
- attic reading nook under a round window, a trunk of old decorations nearby
- apartment balcony just inside a sliding door, string-lights looped along the rail
- dorm-room floor with a mini fridge, fairy lights taped along the wall
- kitchen counter with a cocoa pot and mismatched mugs lined up
- blanket-fort interior built from couch cushions, a phone flashlight propped for light

━━━ RULES ━━━
Every setting is warm and lived-in, never a real haunted-house register (no cobwebs-as-decay, no dust-and-gloom) — this is a loved home decorated for fun, seen in the quiet hours of an autumn evening. No text, no people, no brand names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── decor (one playful Halloween decor beat) ────────────────────────
  await generatePool({
    outPath: DIR + 'anime_halloween_cozy_decor.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} short DECOR-DETAIL snippets for a quiet, cozy anime Halloween-at-home art bot — ONE playful, friendly Halloween decoration visible somewhere in the scene. Each entry 8-16 words, a single concrete object/detail, cute/warm never scary.

━━━ EXAMPLES ━━━
"a string of orange-and-purple fairy lights taped along the windowsill"
"a small grinning jack-o-lantern lantern glowing on the side table"
"a paper-bat garland taped in a gentle arc above the doorway"

━━━ SPREAD ACROSS ALL ${n} ━━━
paper-ghost garland strung along a shelf, a black-cat-shaped throw pillow, a witch-hat perched on a lamp shade, a bowl of candy corn on the coffee table, a carved pumpkin lantern glowing on a side table, a felt-bat bunting taped above a window, a stack of Halloween picture books on the floor, a small cauldron-shaped candy dish, a wreath of dried leaves and a plush ghost on the door, a string of orange fairy-lights looped along a headboard, a smiling pumpkin-shaped candle on the table, a row of mini carved pumpkins lined along a windowsill, a spider-web sticker decal on the window glass, a knit black-cat-ear headband hanging off a bedpost, a bowl of roasted pumpkin seeds cooling on a towel.

━━━ RULES ━━━
Every decor beat is PLAYFUL and friendly — smiling/grinning faces, warm colors, never decayed or menacing. No text, no brand names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── glow — MONEY-SHOT signature light interplay ─────────────────────
  await generatePool({
    outPath: DIR + 'anime_halloween_cozy_glow.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} GLOW-DETAIL snippets for a quiet, cozy anime Halloween-at-home art bot. This is the SIGNATURE money-shot detail of the whole path: the exact way warm light (candle, jack-o-lantern, string-lights, lamp) plays across the intimate scene — often set against a cooler second light source (a TV/laptop screen's flicker, blue dusk through a window) for a classic Makoto-Shinkai-style warm/cool contrast. Each entry 16-30 words, vivid and specific about light behavior (color, flicker, where it lands, what it contrasts with), never just "warm lighting."

━━━ FORMAT (match this exactly) ━━━
"A TV screen's cool blue-white flicker washes one side of the room while the jack-o-lantern's warm orange glow pools across the floor, the two lights trading dominance frame to frame"
"Candlelight catches in wide eyes as the flame gutters and flares, painting warm amber pulses across cheeks and the blanket pulled up close"
"Deep blue dusk presses against the window glass while a single string of fairy-lights washes the room in soft warm gold, the two temperatures splitting the scene cleanly"
"Warm lamp-light pools across an open textbook and a mug of cocoa, steam catching the glow and curling upward into the dim room beyond"

━━━ SPREAD ACROSS ALL ${n} — vary the light SOURCE-BEHAVIOR and what it plays against ━━━
jack-o-lantern candle-flicker vs. TV/laptop screen's cool glow, string-lights washing a room amber against blue dusk outside the window, a single candle's flame reflected in glasses or wide eyes, warm lamp-light on a mug of cocoa with steam catching the glow, a phone-flashlight's cool beam meeting a jack-o-lantern's warm glow inside a blanket-fort, firelight from a stovetop burner catching toasting marshmallows, moonlight-blue window contrasted with a warm-lit room, the pumpkin's carved grin projecting a jagged warm shape onto a nearby wall, warm kitchen light pooling over pumpkin-carving mess against a darkening window, a nightlight's soft glow mixing with flickering screen-light on a face mid-scary-scene reaction.

━━━ RULES ━━━
Always keep a warm light source as the dominant, hero light even when a cooler second source is present. No text, no brand names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
