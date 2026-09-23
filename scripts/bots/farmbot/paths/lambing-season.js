/**
 * FarmBot — lambing-season (new path, 2026-09-23).
 *
 * ━━━ THE GAP IT CLOSES (verified against the code, not against a brief) ━━━
 * FarmBot has 64 path FILES but 35 ACTIVE ones (the rest are pre-rebuild
 * corpses still on disk). A scan of every seed JSON that an ACTIVE path
 * actually requires found:
 *   • `lamb` appears in exactly two live pools, both as an INCIDENTAL: one
 *     item inside a gathering-of-seven list in the shared ANIMAL_COMPANIONS
 *     pool ("two lambs, four piglets, a kitten riding the lamb…"), and a
 *     wobbly lamb standing in a wildflower meadow in ~14 SEASON entries.
 *   • `newborn` appears 3 times in the whole bot, all of them that same
 *     spring-meadow SEASON line.
 *   • `ewe` appears 12 times, all inside those same two pools.
 *   • ZERO lambing shed. ZERO pens. ZERO heat lamp. ZERO first turnout.
 * So FarmBot has no BIRTH register, no NEW-LIFE register and no
 * shed-at-night register at all — which is a real gap on a farm bot, because
 * lambing is the one week of the farming year that everybody has heard of and
 * almost nobody has seen.
 *
 * The closest live analog is `barn-animal-shelter-interior`, and the
 * difference is load-bearing, not cosmetic: that path is a CALM, RESTING,
 * daytime barn whose bespoke pool is architecture-only and whose animals come
 * from a 7-entry filter of the shared farmyard pool. This path is a WORKING
 * shed mid-event — newborns, hurdle pens, a lamp over a crate, a ewe with
 * twins — plus a SECOND setting that path does not have at all (the first
 * turnout into the field). Neither the premise nor the second stage overlaps.
 *
 * SCOPE FENCE: `sheep-shearing-day` is a separate queued path. Nothing here
 * touches shearing — no shears, no clippers, no fleece, no wool sack, no
 * shorn sheep. Enforced as a ban in every gen recipe.
 *
 * ━━━ ⭐ THE BAR (Kevin's motto) ━━━
 * Playful, adventurous, VIVID, beautiful, CLEVER; show people something they
 * have never seen, or something familiar redressed as more interesting. The
 * dull failure here is precise: A CUTE WHITE LAMB STANDING IN A GREEN FIELD.
 * It is on-brief, defect-free and instantly forgettable, and it is also the
 * single most-rendered image of a lamb on earth. So the whole path is built so
 * that shot cannot happen. What it aims at instead: a ewe with twins, one
 * already up and nursing while the other is still folded flat and damp on the
 * straw; two newborns in a crate under a lamp with only their heads and their
 * enormous ears showing; a lamb driving into the bottle with its whole body,
 * both front feet off the ground; fifteen lambs going flat out across wet
 * grass for no reason at all; a lamb standing square on its sleeping mother's
 * back because the ground is wet and she is not; a ewe working along her own
 * lambs nose-first to count them while the third slips out behind her; two
 * lambs standing in the one bright band across the straw with steam curling
 * off them; a collie flat in the doorway with its chin on its paws, on duty,
 * ignoring the entire racket.
 *
 * ━━━ THE LOAD-BEARING CONSTRAINT ━━━
 * DOWN AT LAMB HEIGHT, CLOSE ENOUGH TO TOUCH — never a wide field with small
 * animals in it. It is placed in THREE layers, deliberately:
 *   1. a short front-loaded FRAMING block (the proven
 *      barn-animal-shelter-interior / papaya-guava-orchard pattern);
 *   2. item (1) of the required OUTPUT ORDER at the end (cross-bot lesson 22:
 *      a law appended to a seed tail reaches ~20% of prompts, the same law in
 *      the output order reaches 100% — measured 1-of-5 → 5-of-5);
 *   3. NO CAMERA AXIS AT ALL (see below).
 *
 * ━━━ WHY THIS PATH HAS NO CAMERA AXIS ━━━
 * Two measured reasons, and this is a deliberate subtraction rather than an
 * omission. First, the shared `farmbot_camera_composition.json` is confirmed
 * contaminated: the 2026-09-09 purge removed 11 over-the-shoulder entries, and
 * tropical-flower-garden's re-QA then proved 51 of the remaining 109 still
 * slip a keyword blacklist, including every "Wide establishing shot" variant —
 * and on THIS path a single wide/aerial/establishing entry IS the dull render.
 * Second, the cross-bot finding is that purging the bad camera entries is the
 * fix, not strengthening the mandate (BrickBot: every hard fail across four
 * batches traced to 3 of 25 camera entries, and the template already carried
 * an explicit asymmetry rule that lost). Purging the whole axis is the
 * strongest form of that fix, it removes the path's biggest hard-fail
 * generator outright, and — the reason it is affordable here — it buys back
 * one output-order slot and ~25 words of brief on a path whose headline
 * constraint is LENGTH. The framing block carries the one camera rule needed.
 *
 * ━━━ WHY THIS TEMPLATE IS SHORT, WHICH IS UNUSUAL FOR THIS BOT ━━━
 * Measured across 2,645 live bot renders on 2026-09-22: the fleet medians 250
 * emitted prompt words and most bots sit at 210-300, while FARMBOT MEDIANS 562
 * WITH A 1,080 MAXIMUM AND ALL 399 OF ITS RENDERS OVER 350. Combined with
 * cross-bot lesson 18 (a ~600-word prompt renders only its FIRST THIRD, and
 * the dropped content is still IN the prompt so a content sweep looks clean),
 * the back two thirds of every existing FarmBot prompt is decorative. Trimming
 * the other 64 paths is Kevin's call and touches live content — but a NEW path
 * gets the win for free. So: 6 axes not 9, SIX output-order items not twelve,
 * no camera axis, no SEASON pull, no GENTLE_MAGIC pull, pool entries written
 * short by recipe, and the word count stated as the loud LAST rule. Note that
 * a word cap only RE-ORDERS the output (measured twice, on FaeBot
 * mushroom-apothecary and again on acorn-boat-regatta); what actually shortens
 * it is deleting template PROSE and output-order ITEMS, which is what this
 * template does.
 *
 * ━━━ AXES (6 bespoke + one setting roll) ━━━
 * A SETTING is rolled FIRST — 60% the lambing shed, 40% the first turnout out
 * in the field — and every setting-sensitive pool is tagged shed / field / ANY
 * so the hero, the mother, the dressing, the craft, the light and the animal
 * cameo can never disagree about where the shot is. This is the apiary
 * pattern, and it exists because a prose compatibility clause loses to a pool
 * pick every single time (measured on DinoBot amber-forest and again on ToyBot
 * snow-globe-world, where "if the moment names a place the world does not
 * have, adapt or drop it" did NOT hold and a harbour rowboat turned up in a
 * desert).
 *   • lambing_moment  ★ THE SIGNATURE MONEY-SHOT AXIS — the beat happening
 *                       now, at output-order position 2. Every entry LEADS
 *                       WITH THE ANIMAL DOING IT, because a named action with
 *                       no named actor renders the body part alone (a cup
 *                       "held out from the next deck" drew a giant floating
 *                       hand). Tagged `handled` / `standalone`: 3 entries
 *                       genuinely need a person in them and name "the
 *                       shepherd" as a whole figure, so the no-character
 *                       branch draws only the 22 `standalone` entries.
 *   • lambing_ewe       the mother, CO-LEAD, and the path's SIZE RULER. See
 *                       THE SCALE LAW below — this axis is where it lives.
 *   • lambing_dressing  the set dressing, tagged shed / field. Does three jobs
 *                       at once: (a) names what the shed is BUILT OF and that
 *                       its own walls close the frame down both sides and its
 *                       roof closes it overhead, because an interior whose
 *                       enclosing surfaces are described only by adjective
 *                       renders as a diorama in a void and camera words do not
 *                       fix it; (b) names one LATE-WINTER STRUCTURAL CUE on
 *                       every field entry (bare thorn hedge, last year's grass
 *                       still bleached fawn, dead bracken along the wall, a
 *                       mud-slick gateway), because a season-neutral outdoor
 *                       entry lets the render drift to full summer or to snow;
 *                       (c) blocks the text backfill — see THE TEXT LAW below.
 *                       5 of its 13 shed entries carry the three-part
 *                       CONTINUITY LAW in full.
 *   • lambing_craft     the human action, character branch only, gerund with
 *                       an implied subject. ZERO garment nouns by recipe
 *                       mandate — the SteamBot "captain-coat lock": an action
 *                       axis that names a garment dresses every render the same
 *                       way and overrides the wardrobe axis entirely.
 *   • lambing_light   ★ the ONLY axis on this path that owns time of day,
 *                       weather, season and the colour of light. Every other
 *                       pool is deliberately silent on all four. It is
 *                       therefore the PALETTE axis and it commits: measured
 *                       after generation at 5 warm-dominant / 7 cool-dominant
 *                       / 13 warm-against-cool, every entry naming two real
 *                       colours and what each one is ON.
 *   • lambing_animal    HAND-AUTHORED (16, shed/field tagged) — the gated
 *                       farm-animal cameo, and the reason it is bespoke rather
 *                       than the shared ANIMAL_COMPANIONS pool is that that
 *                       pool's entries carry their own setting AND their own
 *                       time of day (a drowsy calf "in golden hay… an
 *                       afternoon nap"), which would put a second time-of-day
 *                       statement in the brief. These 16 name no light and no
 *                       weather at all, and every one carries a SIZE OR
 *                       POSITION word ("small at the far end", "small on the
 *                       top rail"), because a life-pool entry with no size or
 *                       distance word renders at HERO SCALE.
 *
 * Shared pools used: ONLY CHARACTER_ARCHETYPE + HAIRSTYLE / HAIR_COLOR /
 * EYE_COLOR / SKIN_TONE, via the local mirror of pickCharacter below.
 * Deliberately NOT pulled, each for a measured reason:
 *   - SEASON — its entries are landscape-hero spring meadows, which is exactly
 *     the generic image this path exists to avoid, and it would compete with
 *     the dressing axis for the stage.
 *   - WEATHER_ATMOSPHERE — `lambing_light` replaces it (the same precedent as
 *     artisan-workshop and all 8 tropical paths). Pulling both puts two
 *     competing time-of-day statements in one brief.
 *   - CAMERA_COMPOSITION — see the no-camera-axis note above.
 *   - ACTIVITY — its chore+farm entries are laundry lines, dough and
 *     strawberry picking; nothing lambing-shaped. `lambing_craft` is bespoke.
 *   - ANIMAL_COMPANIONS — carries its own setting and time of day.
 *   - GENTLE_MAGIC — dropped outright, not filtered. Its entries are almost
 *     all built on a LIGHT observation ("moonlight pooling…"), which is what
 *     `lambing_light` owns and would contradict. And this path does not need
 *     it: a wet newborn steaming under a lamp and fifteen lambs sprinting for
 *     no reason ARE the everyday wonder. Dropping it also shortens the brief.
 *
 * ━━━ WHY pickCharacter IS MIRRORED LOCALLY AND NOT CALLED ━━━
 * `pools.pickCharacter(picker, tags, prefix)` filters CHARACTER_ARCHETYPE with
 * `byTags`, whose OR-match lets any entry tagged `"ANY"` through BY DESIGN —
 * and 67 of the 116 archetypes carry `"ANY"`. Passing tags is therefore a
 * no-op that leaks bakers, café owners, potters and market vendors into a
 * lambing shed; that exact bug produced "a baker with a dough-cutter in a
 * flower garden" on tropical-flower-garden. So this file does what
 * artisan-workshop.js, tropical-flower-garden.js and apiary-beekeeping.js
 * already do on this bot: manually content-filter the archetypes, then
 * reproduce pickCharacter's combining logic EXACTLY (archetype +
 * gender-matched hairstyle + hair colour + eye colour + skin tone) from
 * pools.js's own exported pieces. The helper's whole purpose — defeating the
 * "same person every time" homogenisation trap by atomising appearance and
 * gender-matching the hairstyle — is preserved verbatim; only the archetype
 * source list is narrowed. `pools.js` is NOT edited.
 *
 * ━━━ THE FOUR TRAPS THIS PATH WAS BUILT AGAINST ━━━
 *  1. ⚖️ THE SCALE LAW. Cross-bot lesson 13, measured on THIS BOT's own apiary
 *     path over 18 renders: THE SIZE OF A SMALL ANIMAL TRACKS ITS COUNT, NOT
 *     ANY SIZE WORD YOU WRITE. "Three bees, each no bigger than a fingernail"
 *     gave BIRD-SIZED bees; "about a dozen" and "eighty or more" gave correct
 *     ones. A LOW COUNT IS THE GIANT-ANIMAL GENERATOR, because the model gives
 *     each named subject a share of frame. So no pool entry may name a lone
 *     single lamb as its whole subject; every one names at least two, and the
 *     lambs are RULED against something in frame that is welded to a larger
 *     structure — the ewe's own knee, chest, back, flank or second rib, a
 *     hurdle's bottom or second rail, the top of a bale, the shed doorway, the
 *     field gate. A free-floating ruler inflates too ("no bigger than a single
 *     clover floret" produced a fist-sized clover), and off-camera rulers
 *     ("the size of a cat") buy nothing, so both are banned at the recipe.
 *     ⚠️ AND THE COROLLARY THAT SHAPES THE CLOSING LINE: DETAIL AND SIZE ARE
 *     THE SAME DIAL. An animal-parity clause ("the bees rendered as carefully
 *     as the person") ENLARGED them. So this template contains NO PARITY
 *     CLAUSE anywhere, even though Kevin's standing FarmBot rule is that
 *     animals share equal spotlight with humans
 *     ([[feedback_farmbot_animal_spotlight_parity]]) — the rule is honoured
 *     the way the measurement says it must be, by buying the animals FRAME
 *     SHARE (they lead the output order and take the larger part of the frame)
 *     rather than by asking for equal per-subject detail.
 *  2. 🐑 THE NEWBORN LAW. "A cute lamb" renders a clean symmetrical
 *     greetings-card lamb on a plain background, and a ban cannot be used
 *     against it (CLIP cannot negate). It is crowded out POSITIVELY instead,
 *     at the recipe: a just-born lamb is WET, its wool in dark damp curls
 *     stuck flat and yellow-stained at the tips, ears outsized and folded over
 *     at the point, legs plainly too long for it, still down on the straw; a
 *     day-old lamb is dry, fluffed into tight curls and bouncing. At least a
 *     third of the hero entries name a wet or half-dry stage. That specificity
 *     is what makes it real AND what makes it charming.
 *  3. 📝 THE TEXT LAW. A lambing shed has no obvious lettering magnet, but a
 *     hurdle rail, a pen board, a bale end, the shed door and a bucket side
 *     are all flat undescribed panels — and the surface you forget to describe
 *     is the one that gets lettering, while "plain" and "blank" are negations
 *     CLIP cannot use. Three levers, all needed: (a) two genuine props of this
 *     trade ARE text-shaped and are DELETED from every layer rather than
 *     described, because any description of a text-shaped surface is a summons
 *     — A NUMBERED EAR TAG and A CHALK TALLY BOARD, plus the whole synonym
 *     family (label/lettering/number/mark/marking/glyph/sigil/stamped/
 *     engraved/etched/inscribed/script/plaque/sign/signage/chalkboard/tally/
 *     clipboard/notebook/ledger); (b) the positive replacement is in every
 *     dressing entry, and it CARRIES THE INTEREST rather than being a tax —
 *     each flat panel is named as holding a real object (a coiled rope on a
 *     nail, a bucket hanging by its handle, a lamp on a hooked flex, a halter
 *     over the rail, a leaning stack of spare hurdles, a kettle and two mugs
 *     on a shelf, a chair with a coat over its back); and (c) the same clause
 *     sits at item (3) of the REQUIRED OUTPUT ORDER, covering the rails, the
 *     bale ends and the door or gate BY NAME and positively. Post-generation
 *     scan: 0 text-prior hits in any of the six pools.
 *  4. 💡 THE APERTURE LAW. Cross-bot lesson 15, measured on THIS BOT: a small
 *     dark aperture plus a glow word RELOCATES THE GLOW. "The smoker's fuel
 *     door propped open" + "the faintest ember glow within" painted a FURNACE
 *     MOUTH BURNING INSIDE A BEEHIVE. A lambing shed has heat lamps and
 *     sometimes a stove, so this is the live risk on this path. Handled at the
 *     recipe in both directions: a lamp is named as a LAMP HANGING IN PLAIN
 *     SIGHT and its light is always stated as LANDING ON a named surface, and
 *     no glow, ember or coal may ever be placed inside, within or behind any
 *     opening. Its sibling is also banned: light called a shaft, beam, ray,
 *     column, pillar or curtain renders as a literal solid object, so the lit
 *     SURFACE is named first and a flat BAND across a named surface is the one
 *     safe shape.
 * Also swept clean at source: negation phrasing; the dark+light contradictory
 * pairing (the fishing-dock bug, a live risk here with steam, wet backs and a
 * lamp); metaphorical light-as-object; implied-person language; per-object
 * agency on a cluster (a pen of lambs IS a cluster — the lakeside personified
 * river-stones bug); formation and row wording (a corridor/mirror generator);
 * reaction-only verbs (they collapse to a static figurine pose); any
 * veterinary, medical or distress register — THE BIRTH ITSELF IS NEVER
 * DEPICTED, every entry begins after the lamb is already on the straw;
 * commercial scale; and the greetings-card register.
 *
 * ━━━ ONE MORE THING DELIBERATELY NOT COPIED ━━━
 * `barn-animal-shelter-interior.js` puts its ANIMALS block first with a long
 * justification. That ordering is a WORKAROUND for `botEngine.callClaude`'s
 * old hardcoded `maxTokens: 400`, which silently truncated 21.4% of FarmBot
 * prompts mid-word. That cap was raised to a shared `BRIEF_MAX_TOKENS = 1200`
 * on 2026-09-22 and the workaround is no longer necessary. The lambs lead this
 * template anyway, but for a different and better reason: when a path fuses
 * two registers, the bot's own wrapper is already voting for one of them, so
 * you lead with the other — and FarmBot's wrapper plus its 34 farm paths are
 * already voting hard for the human/farm half.
 *
 * Pools: scripts/bots/farmbot/seeds/farmbot_lambing_*.json — required DIRECTLY
 * here, never added to pools.js (shared file, concurrent agents).
 * Gen script for the 5 Sonnet-seeded axes:
 *   scripts/gen-seeds/farmbot/gen-lambing-season-pools.js
 * (`farmbot_lambing_animal.json` is HAND-AUTHORED — do not regenerate it. The
 * five generated pools run in append mode, so a re-run tops up rather than
 * wiping; a wipe-and-regen would lose the hand-patched entries noted in the
 * gen script's own history.)
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT registered in pools.js.
const LAMBING_MOMENT = require('../seeds/farmbot_lambing_moment.json');
const LAMBING_EWE = require('../seeds/farmbot_lambing_ewe.json');
const LAMBING_DRESSING = require('../seeds/farmbot_lambing_dressing.json');
const LAMBING_CRAFT = require('../seeds/farmbot_lambing_craft.json');
const LAMBING_LIGHT = require('../seeds/farmbot_lambing_light.json');
const LAMBING_ANIMAL = require('../seeds/farmbot_lambing_animal.json');

// The setting is rolled FIRST — see the SETTING note in the header. 60% the
// lambing shed, 40% the first turnout out in the field.
const SETTING_SHED_PCT = 0.6;

// Manual archetype filter — see the header note on why pickCharacter's tag
// filter is a no-op here. Drops archetypes carrying an occupation or a held
// prop that is a genuine physical mismatch in a lambing shed: bakery/café
// serving props, a shopkeeper's ledger or measuring tape, a weaver's shuttle
// or loom, a potter's clay apron or kiln, a carpenter's saw or chisel, a
// fisher's net or lure, an innkeeper's tray or mug charm, a florist's bouquet.
// Keeps the farm girl/boy, shepherd, gardener, herbalist, orchard-hand and
// settled-traveler registers, every one of which reads naturally here.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|bakery|flour|dough|pastry|cocoa|cake|bread|oven|knead|caf[eé]|coffee|barista|teacup|dish towel|serving tray|\btray\b|shopkeeper|ledger|measuring tape|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|angler|\bnet\b|\blure\b|anchor charm|shell pendant|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm|florist|flower seller|bouquet)\b/i;
const LAMBING_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'animal'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Reproduces pools.pickCharacter()'s combining logic exactly (archetype +
// gender-matched hairstyle + hair colour + eye colour + skin tone), sourcing
// the archetype from the filtered subset above. Uses only pools.js's exported
// pieces — no pools.js edit. See the header note.
function pickLambingCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(LAMBING_ARCHETYPES, `${axisPrefix}_archetype`);
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
  const setting = Math.random() < SETTING_SHED_PCT ? 'shed' : 'field';
  const inShed = setting === 'shed';

  // FarmBot's standardized 60/40 character / pure-scene split (Kevin
  // 2026-09-09, applied bot-wide). A ewe-and-lambs-only shot is fully
  // on-brand here — they carry the frame on their own, and this path's
  // premise is the animals.
  const includeCharacter = Math.random() < 0.6;

  // ★ The money shot. The no-character branch draws only the `standalone`
  // entries — the 3 `handled` ones name "the shepherd" as the actor.
  const momentPool = forSetting(
    includeCharacter ? LAMBING_MOMENT : LAMBING_MOMENT.filter((e) => e.tags.includes('standalone')),
    setting
  );
  const moment = picker.pickWithRecency(momentPool, `lambing_moment_${setting}`);

  // UNCONDITIONAL — the mother is the co-lead AND the path's size ruler, so
  // she is never dropped in either branch.
  const ewe = picker.pickWithRecency(forSetting(LAMBING_EWE, setting), `lambing_ewe_${setting}`);

  const dressing = picker.pickWithRecency(forSetting(LAMBING_DRESSING, setting), `lambing_dressing_${setting}`);

  const character = includeCharacter ? pickLambingCharacter(picker, 'lambing_character') : null;
  // Gerund actions with an implied human subject — character branch only.
  const craft = includeCharacter
    ? picker.pickWithRecency(forSetting(LAMBING_CRAFT, setting), `lambing_craft_${setting}`)
    : null;

  const light = picker.pickWithRecency(forSetting(LAMBING_LIGHT, setting), `lambing_light_${setting}`);

  // A farm-animal cameo is a bonus here, not the life-guarantee: the lambs and
  // the ewe are unconditional, so a no-character render can never come back
  // bare and `pools.pickPureSceneLife` (whose whole job is that guarantee)
  // would only stack a second creature on top of them. Gated low so it stays
  // an occasional delight and so the brief stays short; odds raised a little
  // when nobody is in frame.
  const animalPool = forSetting(LAMBING_ANIMAL, setting);
  const animal =
    animalPool.length && Math.random() < (includeCharacter ? 0.25 : 0.4)
      ? picker.pickWithRecency(animalPool, `lambing_animal_${setting}`)
      : null;

  // Short, front-loaded framing block — the load-bearing constraint, plus the
  // CONDITION named explicitly (a path whose identity is a condition rather
  // than a subject must state that condition in the emitted prompt; an axis
  // that merely implies it is not enough) and, on the shed branch, the
  // enclosure (naming the enclosing surfaces is what stops a diorama in a
  // void; camera words do not).
  const framing = `━━━ FRAMING (read first) ━━━
A late-winter lambing scene, and the camera is down at lamb height, close enough to touch. The ewe
and her lambs are close at hand and own the frame.${
    inShed
      ? ' The shed is small and working: its own walls close the frame down both sides and its roof closes it overhead.'
      : ' The field is small and hand-tended, its wall or hedge close behind them.'
  }${character ? ' The shepherd is right in among them, large and close.' : ''}

`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${framing}━━━ THE LAMBS (the hero) ━━━
${moment}

━━━ THEIR MOTHER ━━━
${ewe}

━━━ THE ${inShed ? 'SHED' : 'FIELD'} ━━━
${dressing}
${character ? `\n━━━ THE SHEPHERD (close, never distant) ━━━\n${character}\n` : ''}${
    craft ? `\n━━━ DOING ━━━\n${craft}\n` : ''
  }${animal ? `\n━━━ ALSO IN FRAME ━━━\n${animal}\n` : ''}
━━━ LIGHT & AIR ━━━
${light}

WRITE IN THIS ORDER: (1) the art-style words from the top of this brief, first, word for word; (2) late winter, the ewe and her lambs close at hand filling the frame, at the count and the height named; (3) what the lambs are doing, naming the animal doing it; (4) the hurdle rails, bale ends and ${
    inShed ? 'shed door' : 'field gate'
  } plain weathered timber, each carrying the object named, every animal with its own real animal head; (5) the ${
    inShed ? "shed's walls closing both sides, its roof overhead" : 'wall or hedge close behind'
  }; ${character ? '(6) the shepherd, close and large, whole face visible, mid-action; (7) light' : '(6) light'}. Describe only what IS present.

LENGTH IS THE LAST RULE: ONE paragraph, 95-130 words, counted. A tight 110-word scene beats a crammed 300-word one — name the hero, work the order, STOP.

${
  character
    ? `The lambs and their mother take the larger part of the frame, the shepherd right in among them.
Every face, human and animal, stays separate and legible. The charm is the warm linework, light and
colour, never a face drawn onto an object.`
    : `No human figure anywhere in the frame — the lambs and their mother carry the whole scene, richly
detailed and close at hand. The charm is the warm linework, light and colour, never a face drawn
onto an object.`
}`;
};
