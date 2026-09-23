/**
 * FarmBot — apiary-beekeeping (new path, 2026-09-23).
 *
 * THE GAP IT CLOSES. FarmBot's 34 active paths cover barn / coop / orchard /
 * crop fields / vegetable garden / flower field / flower shop / market /
 * village street / inn / bakery / artisan workshop / dock / pond / lakeside /
 * waterfall / woodland / meadow / porch / laundry / deliveries / evening
 * chores / 8 tropical paths / 9 dormant seasonal ones — and NOTHING about
 * bees. A full scan of every FarmBot seed JSON found honey only ever as FOOD
 * on a table (`FOOD_AND_BAKING`, honeycomb on a cheeseboard) and hives only
 * ever as a distant background prop (one line in `hero_animal_setting`, "a
 * wooden beehive visible in the distance"; two `deliveries` entries with hive
 * boxes as truck cargo). Zero apiary, zero keeper, zero comb, zero bees as a
 * subject. This path is FarmBot's first beekeeping register.
 *
 * ⭐ THE BAR (Kevin's motto, BOT_SCENE_QUALITY_PLAYBOOK.md) — playful,
 * adventurous, VIVID, beautiful, CLEVER; show people something they have never
 * seen, or something familiar redressed as something more interesting. On this
 * path the dull failure is precise and easy to fall into: A ROW OF WHITE BOXES
 * IN A GREEN FIELD. It is on-brief, defect-free and instantly forgettable —
 * the exact class of render the motto exists to fail. So the whole path is
 * built so that shot cannot happen, and the delight is in getting CLOSE to the
 * craft and the strangeness of bees: a drawn frame held to the light with its
 * capped comb reading amber-translucent and bees walking across it; the
 * smoker's slow white curl rolling over open top bars; a swarm hanging in a
 * plum tree like a living fruit being coaxed into a box; the uncapping knife
 * peeling a pale sheet of wax away; a jar of just-spun honey on the shed sill
 * with the light straight through it; hives painted in mismatched sky blue,
 * buttermilk and faded rose standing crooked along a hedge; a bee-beard
 * hanging over a landing board; orientation flights whirling off the front
 * panel.
 *
 * ━━━ THE LOAD-BEARING CONSTRAINT ━━━
 * CLOSE TO THE CRAFT. The hero object sits close at hand and fills the frame;
 * the hives are the NEAR setting immediately behind it; never a distant row of
 * boxes across a field. It is enforced in FOUR places, deliberately, because a
 * single placement has failed repeatedly on this bot:
 *   1. a short front-loaded FRAMING block (survives Sonnet's fixed
 *      `maxTokens: 400` even on a dense brief — the proven
 *      barn-animal-shelter-interior / papaya-guava-orchard / tropical-flower-
 *      garden pattern);
 *   2. item (1) of the explicit REQUIRED OUTPUT ORDER at the end (the FaeBot
 *      mushroom-apothecary law: a clause in a "rules" block never reaches
 *      Flux, because Sonnet writes only what the output order tells it to
 *      write — four paths in the 2026-09-22 run needed exactly this move);
 *   3. a HAND-AUTHORED camera pool (below) with no wide, aerial, plan-view or
 *      establishing entry anywhere in it;
 *   4. the closing reinforcement paragraph.
 *
 * ━━━ AXES (9 bespoke) ━━━
 * A SETTING is rolled FIRST — 30% the honey-room register, 70% out at the
 * hives — and every setting-sensitive pool is tagged indoor / outdoor / ANY so
 * the hero, the place, the bees, the camera and the animal cameo can never
 * disagree about where the shot is. A local dry-run of the composed brief (no
 * DB, no render) is what caught this: before the setting roll existed, the
 * extractor's brass tap (a honey-room hero) rolled against a hedgerow apiary,
 * and a water-saucer bee line rolled indoors. Compose-and-read the brief
 * locally before spending renders — those were both invisible in the code.
 *   • hive_moment   ★ THE SIGNATURE MONEY-SHOT AXIS — the craft caught close
 *                     and mid-way through. Tagged `handled` / `standalone`:
 *                     ten entries are written in the passive voice with an
 *                     implied pair of hands ("a frame IS lifted clear and
 *                     turned"), which is nonsense in a no-character render, so
 *                     the no-character branch draws only the 18 `standalone`
 *                     entries. Three of those were hand-authored on purpose —
 *                     a backlit comb PROPPED against the hive, RESTING in a
 *                     carrying rack, LEANING in an empty super — so a
 *                     no-character render never loses the path's signature
 *                     shot to the branch roll.
 *   • bee_presence    THE BEES, and on this path the bees ARE the animals, so
 *                     this block is UNCONDITIONAL in both branches — FarmBot's
 *                     documented animal-spotlight-parity rule
 *                     ([[feedback_farmbot_animal_spotlight_parity]]) means the
 *                     comb and the bees get as much frame as the keeper.
 *                     EVERY entry carries a concrete COUNT and a concrete SIZE
 *                     COMPARISON ("about a dozen… each no bigger than a
 *                     thumbnail"); verified on every entry by scan. Without both, Flux
 *                     renders either no bees at all or bees the size of birds.
 *                     Individual anatomy goes to the nearest two or three only
 *                     and the rest of the mass is described holistically (the
 *                     lakeside personified-river-stones law: never give a
 *                     per-object action to one piece inside a cluster, and a
 *                     bee mass is exactly such a cluster).
 *   • apiary_place    the stage immediately behind the hero. Mismatched
 *                     saturated paint on adjacent boxes in nearly every
 *                     outdoor entry (the VIVID lever, and the direct answer to
 *                     the white-box-row failure); 7 of 29 are honey-room
 *                     interiors and each carries the full three-part
 *                     CONTINUITY LAW (name the opening as part of the room →
 *                     name the outside seen through it, softer and smaller →
 *                     bring that light BACK IN onto something inside), which
 *                     is what beats the split-panel trap at pool level rather
 *                     than relying on the bot-wide fragment alone.
 *   • apiary_forage   the flowers or flowering trees in the SAME frame, so the
 *                     viewer sees at a glance WHY the hives stand there.
 *                     Colour-first and committed (chrome-yellow oilseed,
 *                     crimson field beans, slate-purple phacelia). Skipped on
 *                     an interior place pick — a honey room has no forage bank
 *                     in shot (the "tags describe topic, not physical-setting
 *                     compatibility" law).
 *   • keeper_craft    the human action, character branch only, gerund with an
 *                     implied subject. Contains ZERO garment nouns by recipe
 *                     mandate — the SteamBot "captain-coat lock": an action
 *                     axis that names a garment dresses every render the same
 *                     way and overrides the wardrobe axis entirely.
 *   • keeper_kit      HAND-AUTHORED (25). The beekeeping wardrobe layer, worn
 *                     OVER whatever farm clothes the archetype already
 *                     describes. Hand-authored rather than generated for one
 *                     specific reason: a bee veil covers the FACE, and FarmBot
 *                     has a hard "clearly legible, fully visible face" rule
 *                     (it is why the 11 over-the-shoulder camera entries were
 *                     purged fleet-wide). So the ratio has to be exact and
 *                     cannot be left to a roll: 15 of 25 entries are a veil
 *                     WORN with fine pale mesh explicitly sheer enough that
 *                     the whole face reads plainly through it (which also buys
 *                     the "veil catching light" money detail), and 10 of 25
 *                     have the veil off the face entirely — pushed back,
 *                     tipped behind the ears, down on the shoulders, held in
 *                     one hand.
 *   • apiary_air      the ONLY axis on this path that owns time of day,
 *                     weather and the colour of light. Every other pool is
 *                     deliberately silent on all three (EarthBot LESSON 4
 *                     axis-clean discipline + the 2nd look-register amendment:
 *                     a hero entry that says "golden afternoon" directly
 *                     contradicts whatever this axis rolled). Balance measured
 *                     after generation, because a self-carried atmosphere axis
 *                     is exactly what produced FarmBot's documented "always
 *                     sunny" tropical failure: 6 warm-dominant / 10
 *                     cool-dominant / 9 warm-against-cool contrast, every
 *                     entry naming two committed colours.
 *   • apiary_camera   HAND-AUTHORED (25) and audited as a SET, not filtered
 *                     from the shared pool. Two reasons. First, the shared
 *                     `farmbot_camera_composition.json` is confirmed
 *                     contaminated — the 2026-09-09 purge only removed the 11
 *                     over-the-shoulder entries, and tropical-flower-garden's
 *                     re-QA proved 51 of the remaining 109 still slip a
 *                     blacklist, including every "Wide establishing shot"
 *                     variant. Second, and decisive: on THIS path a single
 *                     aerial, plan-view or establishing entry IS the dull
 *                     render, and one such entry out-votes every other
 *                     mandate in the brief. So all 25 are close, medium or low
 *                     at comb height: 8 close on the hero, 7 medium with the
 *                     hive close, 5 low at landing-board/bench height, 5
 *                     framed past a near foreground element. Zero aerial, zero
 *                     plan view, zero establishing, zero over-the-shoulder,
 *                     zero dwarfing language. Tagged indoor / outdoor / ANY so
 *                     an interior camera can never land on a hedgerow place
 *                     (and vice versa). Every entry is also deliberately
 *                     OBJECT-AGNOSTIC — it describes distance, height and
 *                     orientation only, never a named hero. The first draft did
 *                     name them ("tight on the comb's surface", "close on the
 *                     swarm cluster") and the dry run promptly paired a comb
 *                     camera with a bee-beard hero, which has no comb in it. A
 *                     camera axis that names objects is carrying CONTENT, and
 *                     it will contradict the hero axis; axis-clean applies to
 *                     the camera pool too.
 *   • apiary_animal   HAND-AUTHORED (14, indoor/outdoor tagged) — the gated
 *                     farm-animal cameo. Bespoke rather than the shared
 *                     ANIMAL_COMPANIONS pool because that pool's entries carry
 *                     their own setting AND their own time of day: the dry run
 *                     produced "a drowsy calf curled in a nest of golden hay…
 *                     an afternoon nap" against a cart at a clover field under
 *                     a pearl-grey overcast — a barn scene and a second
 *                     time-of-day statement in one line. These 14 are all
 *                     apiary-placed (a cat along a hive roof, a hen dust-
 *                     bathing in front of the stands, a goat's head over the
 *                     fence) and carry no light or weather words at all.
 * Shared pools used: ONLY CHARACTER_ARCHETYPE + HAIRSTYLE / HAIR_COLOR /
 * EYE_COLOR / SKIN_TONE, via the local mirror of pickCharacter below.
 * Deliberately NOT pulled, each for a measured reason:
 *   - SEASON and WEATHER_ATMOSPHERE — `apiary_air` replaces both (same
 *     precedent as the tropical paths and artisan-workshop). Pulling either
 *     would put two competing time-of-day statements in one brief.
 *   - CAMERA_COMPOSITION — contaminated with wide/establishing/dwarfing
 *     entries a blacklist does not catch (see apiary_camera above).
 *   - ANIMAL_COMPANIONS — carries its own setting and time of day (see
 *     apiary_animal above).
 *   - GENTLE_MAGIC — dropped outright, not filtered. Only 39 of its 120
 *     entries survive a setting filter here, and essentially all of those are
 *     built on a LIGHT observation ("moonlight pooling…", "glows faintly amber
 *     in the low afternoon light"), which is precisely what `apiary_air` owns
 *     and would contradict. This path also does not need it: a swarm hanging
 *     in a plum tree like a living fruit and a bee-beard breathing on a hive
 *     front ARE the everyday wonder. Dropping it also shortens the brief,
 *     which helps the fixed maxTokens budget.
 *
 * ━━━ WHY pickCharacter IS MIRRORED LOCALLY AND NOT CALLED ━━━
 * `pools.pickCharacter(picker, tags, prefix)` filters CHARACTER_ARCHETYPE with
 * `byTags`, whose OR-match lets any entry tagged `"ANY"` through by design —
 * and 67 of the 116 archetypes carry `"ANY"`. Passing tags here is therefore a
 * no-op that leaks bakers, café owners, fishers, potters and market vendors
 * into an apiary; that exact bug produced "a baker with a dough-cutter in a
 * flower garden" on tropical-flower-garden. So this file does what
 * artisan-workshop.js and tropical-flower-garden.js already do on this bot:
 * manually content-filter the archetypes, then reproduce pickCharacter's
 * combining logic EXACTLY (archetype + gender-matched hairstyle + hair colour
 * + eye colour + skin tone) from pools.js's own exported pieces. The helper's
 * whole purpose — defeating the "same person every time" homogenisation trap
 * by atomising appearance and gender-matching the hairstyle — is preserved
 * verbatim; only the archetype source list is narrowed. `pools.js` is NOT
 * edited.
 *
 * ━━━ THE FOUR TRAPS THIS PATH WAS BUILT AGAINST ━━━
 *  1. READABLE TEXT. An apiary is a label magnet: honey jars mean labels, and
 *     a hive front, a crate end and a shed door are all flat undescribed
 *     panels — and "the surface you forget to describe is the one that gets
 *     lettering". Three levers: every gen recipe bans the whole text-prior
 *     SYNONYM family (label / lettering / number / mark / marking / glyph /
 *     sigil / stamped / engraved / etched / inscribed / script / plaque / sign
 *     / tally), not just the word "text"; the pools state the safe positive
 *     form instead (plain smooth unpainted timber, or one flat colour, or one
 *     small painted flower/leaf/bee shape and nothing else, or wax-sealed and
 *     twine-tied with a sprig); and the same clause sits at item (3) of the
 *     REQUIRED OUTPUT ORDER below, covering jars, hive fronts, crate ends and
 *     the shed door BY NAME and positively. Post-generation scan: 0 text-prior
 *     hits in any pool.
 *  2. INSECT RENDERING — see `bee_presence` above (count + size in every entry).
 *  3. ANTI-PERSONIFICATION. FarmBot's papaya-guava-orchard bug: with no human
 *     in frame, Sonnet generalised the look register's big-anime-eyes CHARACTER
 *     language onto the FRUIT and rendered every papaya with a drawn face.
 *     Bees are the highest-risk subject on this bot for that. Handled as a
 *     recipe-level ban (so no seed ever names a face) plus the positive true-
 *     insect-anatomy clause at item (2) of the output order — never by naming
 *     "face"/"eyes" inside pool text, which would put those tokens in front of
 *     Flux.
 *  4. SPLIT PANEL. The honey-room-plus-window shot. Beaten in the pool via the
 *     three-part CONTINUITY LAW on all 7 interior entries, on top of the
 *     bot-wide single-unified-frame sentence in FARMBOT_COZY_NEUTRAL.
 * Also swept clean at source: negation phrasing, the dark+light contradictory
 * pairing (a live risk here — backlit comb, mist, a glow in the spray),
 * metaphorical light-as-object, implied-person language, commercial scale, and
 * any menace/stinging register (FarmBot is cozy: the bees are calm and busy).
 *
 * Pools: scripts/bots/farmbot/seeds/farmbot_apiary_*.json — required DIRECTLY
 * here, never added to pools.js (shared file, concurrent agents).
 * Gen script for the 6 Sonnet-seeded axes:
 *   scripts/gen-seeds/farmbot/gen-apiary-beekeeping-pools.js
 * (`farmbot_apiary_camera.json`, `farmbot_apiary_keeper_kit.json` and
 * `farmbot_apiary_animal.json` are HAND-AUTHORED — do not regenerate them. The
 * 3 standalone backlit-comb entries at the end of hive_moment, the 5 indoor
 * entries at the end of bee_presence and the 4 honey-room entries at the end of
 * apiary_place are hand-authored too; an append run on the gen script keeps
 * them, a wipe-and-regen would lose them.)
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT registered in pools.js.
const HIVE_MOMENT = require('../seeds/farmbot_apiary_hive_moment.json');
const BEE_PRESENCE = require('../seeds/farmbot_apiary_bee_presence.json');
const APIARY_PLACE = require('../seeds/farmbot_apiary_place.json');
const APIARY_FORAGE = require('../seeds/farmbot_apiary_forage.json');
const KEEPER_CRAFT = require('../seeds/farmbot_apiary_keeper_craft.json');
const APIARY_AIR = require('../seeds/farmbot_apiary_air.json');
const APIARY_CAMERA = require('../seeds/farmbot_apiary_camera.json');
const KEEPER_KIT = require('../seeds/farmbot_apiary_keeper_kit.json');
const APIARY_ANIMAL = require('../seeds/farmbot_apiary_animal.json');

// Setting tag for the render, rolled FIRST — see the SETTING ROLL note in the
// header. Every setting-sensitive pool carries 'indoor' / 'outdoor' / 'ANY'
// tags so the hero, the place, the bees, the camera and the animal cameo can
// never disagree about where the shot is.
const SETTING_INDOOR_PCT = 0.3;

// Manual archetype filter — see the header note on why pickCharacter's tag
// filter is a no-op here. Drops archetypes carrying an occupation or a held
// prop that is a genuine physical mismatch at a hive: bakery/café serving
// props, a shopkeeper's ledger or measuring tape, a weaver's shuttle or loom,
// a potter's clay apron or kiln, a carpenter's saw or chisel, a fisher's net
// or lure, an innkeeper's tray or mug charm, a florist's bouquet. Keeps the
// farm girl/boy, gardener, herbalist, shepherd, orchard-hand and settled-
// traveler registers, every one of which reads naturally in an apiary.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|bakery|flour|dough|pastry|cocoa|cake|bread|oven|knead|caf[eé]|coffee|barista|teacup|dish towel|serving tray|\btray\b|shopkeeper|ledger|measuring tape|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|angler|\bnet\b|\blure\b|anchor charm|shell pendant|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm|florist|flower seller|bouquet)\b/i;
const APIARY_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'animal', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Reproduces pools.pickCharacter()'s combining logic exactly (archetype +
// gender-matched hairstyle + hair colour + eye colour + skin tone), sourcing
// the archetype from the filtered subset above. Uses only pools.js's exported
// pieces — no pools.js edit. See the header note.
function pickApiaryCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(APIARY_ARCHETYPES, `${axisPrefix}_archetype`);
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
  // THE SETTING ROLL, first — 30% the honey-room register (uncapping, the
  // spin, the jars, the wax, the bench), 70% out at the hives. Rolled before
  // anything else so every axis below draws from a physically compatible set.
  const setting = Math.random() < SETTING_INDOOR_PCT ? 'indoor' : 'outdoor';
  const indoors = setting === 'indoor';

  // FarmBot's standardized 60/40 character / pure-scene split (Kevin
  // 2026-09-09). A hive-and-comb-only shot is fully on-brand here — the bees
  // carry the frame on their own.
  const includeCharacter = Math.random() < 0.6;

  // ★ The money shot. The no-character branch draws only the `standalone`
  // entries — the `handled` ones are written with an implied pair of hands.
  const momentPool = forSetting(
    includeCharacter ? HIVE_MOMENT : HIVE_MOMENT.filter((e) => e.tags.includes('standalone')),
    setting
  );
  const moment = picker.pickWithRecency(momentPool, `apiary_hive_moment_${setting}`);

  // UNCONDITIONAL — the bees are this path's animals and get equal spotlight.
  const bees = picker.pickWithRecency(forSetting(BEE_PRESENCE, setting), `apiary_bee_presence_${setting}`);

  const place = picker.pickWithRecency(forSetting(APIARY_PLACE, setting), `apiary_place_${setting}`);
  // Does the rolled place actually have painted box hives? The straw-skep and
  // hollow-log entries do not, and telling Flux to paint a straw skep is a
  // contradiction — so the framing paint clause below is gated on this.
  const PAINTED_PLACE =
    /sky blue|cornflower|buttermilk|faded rose|mint green|brick red|dusty ochre|pale lilac|seafoam|painted/i;
  const paintedHives = PAINTED_PLACE.test(place);

  // A honey room has no forage bank in shot.
  const forage = indoors ? null : picker.pickWithRecency(APIARY_FORAGE, 'apiary_forage');

  const character = includeCharacter ? pickApiaryCharacter(picker, 'apiary_character') : null;
  const kit = includeCharacter ? picker.pickWithRecency(KEEPER_KIT, 'apiary_keeper_kit') : null;
  // Gerund actions with an implied human subject — character branch only.
  const craft = includeCharacter ? picker.pickWithRecency(KEEPER_CRAFT, 'apiary_keeper_craft') : null;

  const air = picker.pickWithRecency(APIARY_AIR, 'apiary_air');

  // Hand-authored SET — every entry close, medium or low, and object-agnostic
  // so it can never name a hero the moment axis did not roll.
  const camera = picker.pickWithRecency(forSetting(APIARY_CAMERA, setting), `apiary_camera_${setting}`);

  // A farm-animal cameo is a bonus here, not the life-guarantee: the bee block
  // above is unconditional, so a no-character render can never come back bare
  // and `pools.pickPureSceneLife` (whose whole job is that guarantee) would
  // only stack a second creature on top of the bees. Kept nullable, with the
  // odds raised when nobody is in frame.
  const animalPool = forSetting(APIARY_ANIMAL, setting);
  const animal =
    animalPool.length && Math.random() < (includeCharacter ? 0.3 : 0.5)
      ? picker.pickWithRecency(animalPool, `apiary_animal_${setting}`)
      : null;

  // Short, front-loaded framing block — the load-bearing constraint, placed
  // where it survives Sonnet's fixed maxTokens budget no matter how dense the
  // rest of the brief turns out (the proven barn-animal-shelter-interior /
  // papaya-guava-orchard / tropical-flower-garden pattern). It is repeated as
  // item (1) of the required output order at the end.
  const framing = `━━━ FRAMING (read first) ━━━
The camera stays right at the work, close enough to touch. The hero named next sits
close at hand and fills the frame; the ${
    indoors ? 'honey room closes in around it' : 'hives are the near setting'
  } an arm's length behind it${character ? ', the beekeeper large, close and unmistakably the focus' : ''}.${
    paintedHives
      ? `\nThe hive boxes are painted, each one a different flat saturated colour from its neighbours, in the exact colours named below.`
      : ''
  }

`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${framing}━━━ THE HIVE-SIDE MOMENT (the hero of the shot) ━━━
${moment}

━━━ THE BEES (required — they must actually appear, never just background mood) ━━━
${bees}
Tiny against everything around them, in true honeybee shape and colour; detail on the nearest one
or two only, every other bee a small clean shape. The charm comes from the warm linework, light and
colour, never from any added face or expression drawn onto a creature or an object.

━━━ ${indoors ? 'THE HONEY ROOM' : 'THE APIARY'} (the near setting, close behind the hero) ━━━
${place}${forage ? `\n${forage}` : ''}
${character ? `\n━━━ THE BEEKEEPER (close and prominent, never a distant figure) ━━━\n${kit}\n${character}\n` : ''}
${craft ? `━━━ WHAT'S HAPPENING ━━━\n${craft}\n\n` : ''}${animal ? `━━━ ANIMAL COMPANY ━━━\n${animal}\n\n` : ''}━━━ LIGHT & AIR ━━━
${air}

━━━ CAMERA ━━━
${camera}

WRITE THE PROMPT IN THIS ORDER: (1) the hero above, close at hand and filling the frame, the hives an arm's length behind; (2) the bees at exactly the count named and at the tiny in-frame size named, in true honeybee shape, detail on the nearest one or two only and every other bee a small clean shape; (3) ${
    paintedHives ? 'the hive boxes each painted a different flat saturated colour, and ' : ''
  }every jar, crate end and ${
    indoors ? 'shed door' : 'gate post'
  } plain smooth timber or carrying one small painted flower and nothing else; (4) the hives and ${
    indoors ? 'the crowded shelves' : 'the flowering growth'
  } around them; ${
    character ? '(5) the beekeeper, large and close, whole face visible; (6) light and air; (7) camera' : '(5) light and air; (6) camera'
  }. Describe only what IS present.

${
  character
    ? `render a warm, absorbed moment at the hive — comb, hives and beekeeper all given
equal loving richness, the bees tiny and true throughout. Every face in frame, human and
animal, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — a warm, absorbed hive-side still-life, the work
sitting exactly where it was set down, carried by the comb, the painted hives and the bees at
work on them, richly detailed, never bare or empty.`
}`;
};
