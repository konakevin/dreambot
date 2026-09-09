#!/usr/bin/env node
/**
 * FarmBot — seasonal_festival_place bespoke pool ("Seasonal Festival" path,
 * Phase 3, the LAST of the 22-path roster, 2026-09-09).
 *
 * ONE bespoke pool covering EIGHT distinct festival concepts, 2 per season,
 * all in a single output file (`farmbot_seasonal_festival_place.json`),
 * each entry tagged `[season, concept-key]` so the path file can filter to
 * exactly the concept it rolled. Runs 8 separate Sonnet recipes (one per
 * concept, own bespoke meta-prompt + hero imagery) into scratch files, then
 * merges + tags them into the final combined pool — same
 * generatePool()/banHumanLanguage machinery as every other bespoke pool,
 * just orchestrated 8x instead of once. See gen-harvest-festival-place-pool.js
 * (this script's direct template) and FARMBOT_PATH_BUILD_STATE.md.
 *
 * Deliberate overlap avoidance (Kevin's brief):
 *   - harvest-festival already owns hay bales / corn mazes / apple-orchard
 *     harvest imagery — the autumn concepts here (pumpkin-festival,
 *     lantern-festival) ban that vocabulary and lean into festival GAMES,
 *     DECORATIONS, and a carving CONTEST instead.
 *   - autumn-village-market already owns market-stall-goods-for-sale imagery
 *     — every concept here (including winter-market) bans "for sale" /
 *     price-tag / goods-laid-out-to-buy framing and leans into CELEBRATION
 *     (games, decorations, treats being enjoyed, performances) instead.
 *   - picnic-in-the-meadow already owns the generic picnic-blanket-in-a-
 *     meadow scene — cherry-blossom-picnic bans generic-picnic framing and
 *     anchors hard on the blossoming cherry trees / drifting petals as the
 *     hero visual, with the picnic blanket only ever a small secondary detail.
 *
 * Lessons baked in from today's push (all 4 bans below apply to every
 * concept, not just the ones that triggered the original bug):
 *   - implied-crowd language (figures/crowd/riders/children/faces/hands/etc)
 *     is NOT caught by `banHumanLanguage` (regex only catches explicit age/
 *     gender words) — needs its own explicit ban per meta-prompt.
 *   - metaphorical light-as-object language ("coins of light") reliably
 *     renders as the literal object — banned, describe light literally.
 *   - per-object personification (each lantern/pumpkin/stone given its own
 *     action verb) risks Flux rendering faces on inanimate objects under
 *     this bot's cheerful tone lock — banned, describe clusters holistically.
 *   - any object-CONCEPT implying a label/marker/sign (not just literal
 *     "sign"/"banner" nouns) invites hallucinated readable text — banned
 *     outright, omit labels/signage entirely rather than describing a
 *     "blank" one.
 */
const fs = require('fs');
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');
const SCRATCH_DIR = path.join(SEEDS_DIR, '_scratch_seasonal_festival');
const FINAL_OUT = path.join(SEEDS_DIR, 'farmbot_seasonal_festival_place.json');

// Shared ban block, appended to every concept's own meta-prompt.
const SHARED_BANS = `
CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, or any other word implying a person is present or was
recently present. Describe only the setting, objects, decorations, light, and weather — a
fully-dressed, ready-for-celebration place with nobody in the frame yet.

CRITICAL — describe light and glow LITERALLY (warm, soft, golden, glowing, pooling, spilling,
flickering) — NEVER as a metaphorical object standing in for light (no "coins of light," no
light described AS jewels/confetti/stars/petals unless those exact objects are literally
present in the scene).

CRITICAL — when describing a cluster of similar small objects (lanterns, pumpkins, jars,
petals, stalls, ornaments), describe the GROUP holistically as one collective detail (a string
of lanterns glowing warmly, a row of pumpkins lined up along the path) — never give each
individual object its own personifying action verb (no "each lantern peeking out," no "every
pumpkin watching," no per-object "faces" or "eyes").

CRITICAL — never mention any readable text, label, sign, banner, price tag, plant marker,
chalkboard, or any object implying lettering/numbers/menu of any kind — even a "blank" one
invites hallucinated text. Omit labels and signage entirely rather than describing them as
blank or empty.

CRITICAL — this is a CELEBRATION scene, not a shopping scene: never describe goods "for sale,"
price tags, or a market-stall display of produce/wares laid out to be purchased. Treats and
decorations are there to be enjoyed as part of the festival, not sold.

Output ONLY a JSON array of strings, no preamble, no numbering. 25-40 words each.

🚫 STRICT BANS: NO named people/characters, NO implied people, NO readable text/banners/
signage/price tags, NO brand names, NO photographer/camera-brand names, NO bare/empty setting
lacking festival detail, NO goods-for-sale market-stall framing.

Output ONLY the JSON array, no preamble, no numbering.`;

const CONCEPTS = [
  // ─────────────────────────── SPRING ───────────────────────────
  {
    key: 'flower-festival',
    season: 'spring',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct SPRING FLOWER FESTIVAL scene descriptions for a
cozy countryside bot — a joyful outdoor flower-celebration PLACE, decorated and ready, rendered
entirely through its physical objects and decorations. The festival scene itself is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — lean into FLOWER-FESTIVAL-SPECIFIC hero imagery, distinct from a plain open flower
field: garlands of fresh blossoms strung overhead between wooden posts, a small flower-wrapped
bandstand or archway gate, a petal-strewn path underfoot, tables set up for flower-crown-making
piled with loose blossoms and ribbon, a ring of potted flowering trees, woven flower wreaths
hung along a fence, a pastel bunting fluttering above rows of blooming flowerbeds. Vary which
flower (tulips, peonies, wisteria, poppies, daisies, roses) leads each entry, vary time of day
within spring (soft morning light through golden late-afternoon), and vary angle.
${SHARED_BANS}

Examples:
["A flower-wrapped wooden archway gate stands at the festival entrance, garlands of fresh peonies and ribbon looping between the posts, a petal-strewn path leading beneath it into the soft spring morning light.", "Rows of potted tulips in every color line a small bandstand wrapped floor to roof in wisteria vines, pastel bunting strung overhead catching the late-afternoon breeze above a carpet of scattered petals."]`,
  },
  {
    key: 'cherry-blossom-picnic',
    season: 'spring',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct CHERRY BLOSSOM PICNIC scene descriptions for a
cozy countryside bot — the setting is ALWAYS a grove or avenue of full-bloom cherry blossom
trees, which is the HERO of the shot, with a small picnic detail as a secondary accent only. The
blossom canopy itself is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — this must read as unmistakably CHERRY-BLOSSOM-LED, never a generic picnic-in-a-meadow
scene (that belongs to a different scene). Every entry leads with the blossoming trees
themselves: a full canopy of pale pink blossoms overhead, branches heavy with bloom arching low,
a drift of fallen petals blanketing the ground or floating on a light breeze, a tunnel of
blossoming trees forming a natural arch over a path. ONLY after establishing the blossom canopy
may an entry add ONE small picnic detail (a spread blanket, a woven basket, a stack of small
cushions) resting beneath the trees — never let the picnic detail outweigh or lead the blossoms.
Vary which specific blossom framing leads (canopy overhead / avenue of trees / petal-drift /
low-arching branches), vary time of day (soft morning through golden late-afternoon), vary angle.
${SHARED_BANS}

Examples:
["A full canopy of pale pink cherry blossoms arches overhead in an unbroken tunnel, fallen petals drifting slow through the warm spring air to blanket a small picnic blanket and woven basket spread beneath the lowest branches.", "An avenue of blossoming cherry trees stretches into the soft distance, their heavy pink boughs nearly meeting overhead, a thin scatter of petals settling across a folded quilt and stacked cushions resting at the base of the nearest trunk."]`,
  },
  // ─────────────────────────── SUMMER ───────────────────────────
  {
    key: 'strawberry-festival',
    season: 'summer',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct SUMMER STRAWBERRY FESTIVAL scene descriptions for
a cozy countryside bot — a joyful outdoor strawberry-celebration PLACE, decorated and ready,
rendered entirely through its physical objects and decorations. The festival scene itself is
ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — lean into STRAWBERRY-FESTIVAL-SPECIFIC hero imagery, celebratory not shopping: a
red-and-white gingham bunting strung between posts, a small game booth with a strawberry-shaped
ring-toss target, tiered dessert stands piled with strawberry shortcake and glazed strawberry
skewers set out to be enjoyed, oversized painted strawberry decorations flanking an entrance
gate, a cluster of red balloons shaped like berries tied to a post, a long table dressed for a
strawberry-tasting gathering, a strawberry-topped cake stand as a centerpiece. Vary which
element leads, vary time of day (bright midday through warm early-evening), vary angle.
${SHARED_BANS}

Examples:
["An oversized painted strawberry archway marks the festival entrance, red-and-white gingham bunting strung in wide loops overhead and a cluster of berry-shaped red balloons bobbing gently against the bright midsummer sky.", "A long dessert table dressed in gingham cloth holds tiered stands of strawberry shortcake and glazed berry skewers set out for the celebration, a ring-toss game booth with a giant strawberry target waiting just behind it."]`,
  },
  {
    key: 'firefly-evening',
    season: 'summer',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct SUMMER FIREFLY EVENING scene descriptions for a
cozy countryside bot — a magical dusk gathering PLACE where fireflies glow through a warm summer
meadow or garden, decorated and ready, rendered entirely through its physical objects, insects,
and light. The setting itself is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — lean into FIREFLY-SPECIFIC hero imagery: dozens of real fireflies glowing soft
yellow-green as dusk deepens to warm indigo, tall grass or a garden clearing scattered with
their drifting lights, a low wooden bench or a spread blanket tucked at the meadow's edge, a
scatter of empty glass jars with punched lids resting nearby ready for catching fireflies, a
line of small string lights looped along a fence to match the fireflies' glow, silhouettes of
trees against the last warm band of sunset. Describe the fireflies as real glowing insects,
never as a metaphor for something else. Vary which element leads, vary how deep dusk has
settled, vary angle.
${SHARED_BANS}

Examples:
["Dozens of fireflies drift low through a stretch of tall summer grass, their soft yellow-green glow rising against a deepening indigo dusk, a scatter of empty glass catching-jars with punched lids resting in a neat row on a nearby wooden bench.", "A garden clearing fills with slow-blinking fireflies as the last warm band of sunset fades behind silhouetted trees, a spread quilt at the meadow's edge and a short line of string lights looped along the fence glowing to match."]`,
  },
  // ─────────────────────────── AUTUMN ───────────────────────────
  {
    key: 'pumpkin-festival',
    season: 'autumn',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN PUMPKIN FESTIVAL scene descriptions for a
cozy countryside bot — a joyful outdoor pumpkin-celebration PLACE, decorated and ready, rendered
entirely through its physical objects and decorations. The festival scene itself is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — this is a GAMES-AND-DECORATIONS festival scene, deliberately DIFFERENT from a plain
harvest field: a long pumpkin-carving contest table lined with several jack-o'-lanterns already
lit and glowing mid-carving, an orange-and-black bunting strung between posts, a ring-toss game
booth with small pumpkins as the targets, a "biggest pumpkin" display raised on a low wooden
pedestal wrapped in ribbon, a row of carved lanterns lining a festival path, a bobbing-for-apples
barrel set up as a game station, a cluster of pumpkin-shaped paper decorations hung overhead.
${'\n'}🚫 ADDITIONAL BAN specific to this concept: NO hay bales, NO hay-bale maze, NO corn maze,
NO corn-stalk archway, NO wheelbarrow of squash, NO scarecrow, NO hay wagon (that vocabulary
belongs to a different, already-built scene) — this scene is about festival GAMES and CARVING,
not raw harvest imagery. Vary which game/decoration leads, vary time of day (golden afternoon
through soft dusk), vary angle.
${SHARED_BANS}

Examples:
["A long pumpkin-carving contest table stretches beneath strings of orange-and-black bunting, half a dozen jack-o'-lanterns already lit and glowing mid-carving with curls of pumpkin flesh scattered beside them in the golden afternoon light.", "A ring-toss game booth stands ready with a dozen small pumpkins lined up as targets, a raised wooden pedestal wrapped in ribbon nearby proudly displaying one enormous prize pumpkin against the deepening dusk sky."]`,
  },
  {
    key: 'lantern-festival',
    season: 'autumn',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN LANTERN FESTIVAL scene descriptions for a
cozy countryside bot — a joyful outdoor paper-lantern-celebration PLACE at dusk, decorated and
ready, rendered entirely through its physical objects and warm light. The festival scene itself
is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — lean into LANTERN-SPECIFIC hero imagery: long strings of round paper lanterns hung in
overlapping rows overhead, forming a warm glowing canopy above a courtyard or garden path, a
cluster of lanterns tied along a low fence or archway, a small table set up for lantern-making
piled with folded paper and ribbon, a lantern-lit path curving off into the autumn dusk, warm
amber and soft red lantern light pooling on the ground below. Lanterns may be plain colored
paper or simple patterned paper (florals, leaves) — never with any lettering, symbols, or
readable characters painted on them.
${'\n'}🚫 ADDITIONAL BAN specific to this concept: NO hay bales, NO corn stalks/maze, NO
scarecrow, NO wheelbarrow of squash, NO market-stall produce display (that vocabulary belongs to
different, already-built scenes) — this scene is carried entirely by the LANTERNS and dusk
light. Vary which lantern arrangement leads, vary how deep dusk has settled, vary angle.
${SHARED_BANS}

Examples:
["Long strings of round paper lanterns hang in overlapping rows overhead, forming a warm amber canopy above a quiet courtyard path as the autumn dusk deepens to soft violet behind them.", "A cluster of red and gold paper lanterns is tied along a low garden fence, their warm glow pooling on the ground below where a small table sits piled with folded paper and spools of ribbon, ready for more lanterns to be made."]`,
  },
  // ─────────────────────────── WINTER ───────────────────────────
  {
    key: 'winter-market',
    season: 'winter',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct WINTER MARKET FESTIVAL scene descriptions for a
cozy countryside bot — a joyful, snow-dusted outdoor winter-celebration PLACE, decorated and
ready, rendered entirely through its physical objects, lights, and snow. The scene itself is
ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — this is a CELEBRATION/ATMOSPHERE scene, not a goods-for-sale market: zigzagging
strings of warm white lights overhead against a snowy dusk sky, snow-dusted striped market-stall
roofs (canopy/roofline only — never describe items or produce laid out for sale beneath them), a
small ice-skating rink glowing under lantern light, evergreen wreaths and pine garlands looped
along railings, a steaming barrel bonfire ringed with log seats for warming hands, a hot-cocoa
stand with steam curling from a giant kettle, fresh snow blanketing every rooftop and railing.
Vary which element leads, vary how deep dusk/evening has settled, vary angle.
${SHARED_BANS}

Examples:
["Zigzagging strings of warm white lights stretch overhead between snow-dusted striped stall roofs, fresh snow blanketing every railing and rooftop as a small ice-skating rink glows softly under lantern light just beyond.", "A steaming barrel bonfire is ringed with log seats dusted in fresh snow, evergreen wreaths and pine garlands looped along a nearby railing, steam curling from a giant kettle at a hot-cocoa stand under a string of warm lights."]`,
  },
  {
    key: 'gingerbread-snowman',
    season: 'winter',
    total: 15,
    metaPrompt: (n) => `Generate ${n} distinct WINTER GINGERBREAD-BAKING-AND-SNOWMAN-BUILDING
scene descriptions for a cozy countryside bot — split roughly evenly between two settings: (A) a
warm indoor kitchen or table mid-gingerbread-house-building, and (B) a snowy outdoor yard
mid-snowman-building. Each PLACE is decorated and ready, rendered entirely through its physical
objects. The scene itself is ALWAYS the grammatical subject named FIRST in the sentence.

For (A) gingerbread scenes: a half-built gingerbread house on a table with walls already
iced and pressed with candy decorations, bowls of colorful candy and piped icing waiting nearby,
a warm kitchen window frosted at the edges, string lights looped along a shelf, a rolling pin
and cookie cutters set beside a tray of fresh gingerbread pieces cooling.

For (B) snowman scenes: a half-built snowman standing in a snowy yard with a carrot nose,
twig arms, and a striped scarf already wrapped on, a small wooden sled parked nearby, fresh
snow piled and packed into rounded stacked forms, a trail of small footprints leading up to it,
soft snow still falling, warm farmhouse windows glowing gold in the background.

Vary which of the two settings leads across the batch (roughly half and half), vary how far
along the build is, vary time of day/evening, vary angle.
${SHARED_BANS}

Examples:
["A half-built gingerbread house sits on a flour-dusted table, one iced wall already pressed with a mosaic of colorful candy, bowls of piped icing and gumdrops waiting beside it as string lights glow warm along a nearby shelf.", "A half-built snowman stands in a fresh snowy yard, a carrot nose and a striped scarf already in place while twig arms wait propped nearby, a small wooden sled resting beside a trail of footprints leading up to it under softly falling snow."]`,
  },
];

async function main() {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  // Scale-to-120 pass (2026-09-08): preserve each concept's EXISTING entries
  // from the already-shipped combined pool by seeding the scratch file with
  // them before calling generatePool in append mode — otherwise a fresh
  // append:false run would silently discard the 57 hard-won, QA'd entries
  // and regenerate all-new content per concept from zero.
  let existingCombined = [];
  try {
    existingCombined = JSON.parse(fs.readFileSync(FINAL_OUT, 'utf8'));
  } catch (_) {}
  const combined = [];
  for (const c of CONCEPTS) {
    const scratchPath = path.join(SCRATCH_DIR, `${c.key}.json`);
    const priorForConcept = existingCombined
      .filter((e) => Array.isArray(e.tags) && e.tags[1] === c.key && e.description)
      .map((e) => e.description);
    fs.writeFileSync(scratchPath, JSON.stringify(priorForConcept, null, 2));
    console.log(`\n=== ${c.key} (${c.season}) — ${priorForConcept.length} existing, target ${c.total} ===`);
    const entries = await generatePool({
      outPath: scratchPath,
      total: c.total,
      append: true,
      banHumanLanguage: true,
      metaPrompt: c.metaPrompt,
    });
    for (const e of entries) {
      const description = typeof e === 'string' ? e : e.description;
      combined.push({ tags: [c.season, c.key], description });
    }
  }
  fs.writeFileSync(FINAL_OUT, JSON.stringify(combined, null, 2));
  console.log(`\n✅ Saved ${combined.length} total entries across ${CONCEPTS.length} concepts to ${FINAL_OUT}`);
  const counts = {};
  for (const e of combined) counts[e.tags[1]] = (counts[e.tags[1]] || 0) + 1;
  console.log(JSON.stringify(counts, null, 2));
  fs.rmSync(SCRATCH_DIR, { recursive: true, force: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
