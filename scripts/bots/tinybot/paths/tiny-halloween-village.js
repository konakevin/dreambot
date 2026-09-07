/**
 * AlphaBot candidate — tiny-halloween-village (destination: TinyBot).
 *
 * A miniature Halloween-village diorama, sibling to TinyBot's proven
 * tiny-winter-village path. A lantern-lit dollhouse-scale Halloween town
 * square dressed for the season: crooked matchbox cottages strung with
 * jack-o-lantern light, cobbled lanes, seasonal decor. SCENE pool = the
 * layered constructed world. CAST pool = MANDATORY tiny critter residents
 * (mice/hedgehogs/voles, biased ~70%, cameo chipmunks/squirrels/rabbits/moles
 * ~30%) caught mid Halloween activity — always at least one, ~35% a second
 * (mirrors the tiny-winter-village cast-density recipe). SCALE_PROVER pool =
 * the MONEY-SHOT axis: one true-to-life-scale everyday object (a real acorn,
 * leaf, coin, candy-corn kernel, spiderweb...) planted beside the village so
 * the miniature reads unmistakably tiny by comparison — this path's signature
 * identifying detail, the thing tiny-winter-village doesn't have.
 *
 * ━━━ PORTABILITY NOTE (read before wiring or promoting) ━━━
 * Per ALPHABOT.md's portability contract, this path CLONES TinyBot's identity
 * rather than importing tinybot/shared-blocks.js (keeps this file self-
 * contained under alphabot/, and keeps the eventual promotion diff to just
 * "move this file + its 3 seed JSONs + this gen script"). The 5 blocks below
 * marked "CLONED VERBATIM FROM TINYBOT" are byte-identical copies of
 * scripts/bots/tinybot/shared-blocks.js as of 2026-09-06 — if TinyBot's
 * blocks change before this path is promoted, re-sync them.
 *
 * When wiring this into a bot's index.js (AlphaBot CANDIDATES for iteration,
 * or TinyBot's pathBuilders on promotion), clone TinyBot's own per-path
 * config byte-identical (the portability contract — "a path proven under the
 * wrong config proves nothing"):
 *   - mediums: ['photography', 'claymation', 'render']  (bot-level, no
 *     per-path override needed — matches tiny-winter-village)
 *   - allowedModels: ['black-forest-labs/flux-1.1-pro',
 *     'black-forest-labs/flux-1.1-pro-ultra']  (bot-level, no override)
 *   - promptPrefix / promptSuffix: TinyBot's blocks.PROMPT_PREFIX /
 *     PROMPT_SUFFIX (bot-level — exported below as TINY_HALLOWEEN_PROMPT_
 *     PREFIX/SUFFIX for convenience, identical text)
 *   - vibes: TinyBot's vibes list (cinematic/cozy/nostalgic/peaceful/
 *     whimsical/ethereal/ancient/enchanted/shimmer)
 *   - twoPassPolish: enabled, conceptWords 150, polishedWords '65-90'
 *   - sensoryAnchors: enabled, requiredChannels ['lightcolor'],
 *     pathContext: 'scene'
 *   - chaos: enabled, add to allowSubjectChaosPaths (like the other village
 *     paths); do NOT add to skipPaths
 *   - Axis keys used here ('tiny_halloween_village_scene', '..._cast',
 *     '..._scale_prover') do not collide with any existing TinyBot or
 *     AlphaBot axis — verified 2026-09-06.
 *
 * NOT this task's job: wiring alphabot/index.js CANDIDATES or tinybot's
 * pathBuilders/paths[] — a later, separate step does that.
 */

const SCENES = require('../seeds/tiny_halloween_village_scene.json');
const CAST = require('../seeds/tiny_halloween_village_cast.json');
const SCALE_PROVERS = require('../seeds/tiny_halloween_village_scale_prover.json');

// ─────────────────────────────────────────────────────────────
// Bespoke axes 4-6 — short fixed lists, inlined per the playbook guidance
// (axes that don't need generated-pool depth). Plain JS arrays, no pool file.
// ─────────────────────────────────────────────────────────────

const ATMOSPHERE = [
  'a thin ground fog curls around the cobblestones, catching the lantern light in low amber drifts',
  'a light scatter of fallen leaves skitters across the square in a gentle breeze',
  'a distant crow calls once from a bare-branched tree silhouette at the village edge',
  'soft mist rolls in off the orchard, softening every lantern into a warm amber halo',
  'a paper-bat mobile turns and rattles gently overhead in the night breeze',
  'thin wisps of chimney-smoke braid upward and dissolve into the dusk',
  'cobweb strands catch the damp night air, beaded with dew that glints in lantern light',
  'a low fog pools at the pond\'s edge, mirroring the lantern glow in soft ripples',
  'the last few leaves of the season spiral down past a lit window',
  'a hush of distant owl-hoots drifts over the rooftops',
  'warm cider-steam curls up from the square and catches the amber light',
  'a gentle gust sets every hanging lantern swaying in loose unison',
];

const NIGHT_SKY = [
  'a huge low harvest moon glows tangerine just behind the clocktower',
  'a thin crescent moon hangs among a scatter of bright early stars',
  'a deep indigo sky holds the last amber band of sunset along the horizon',
  'a full silver moon is veiled by thin, slow-drifting cloud',
  'the moon is wreathed in wisps of cloud, a single bat silhouette crossing it',
  'a black, starry sky is strewn with countless pinprick stars',
  'a blood-orange moon hangs low and huge just over the rooftops',
  'a foggy sky reduces the moon to a soft diffused glow overhead',
  'a purple-indigo dusk sky holds the very first stars of the evening',
  'a passing cloud half-eclipses the moon, its rim glowing gold at the edge',
];

const DECOR_MOTIF = [
  'black-and-orange bunting zigzags from cottage to cottage across the lane',
  'a chain of small carved-pumpkin lanterns lights the length of the main street',
  'candy-corn-striped garlands loop along every window box',
  'small cloth-and-twine scarecrows stand guard at doorways along the lane',
  'a cauldron of spiced cider steams gently in the middle of the square',
  'raked leaf-piles are dotted through the square, each nested with a small carved pumpkin',
  'a silver spiderweb is strung between two chimneys, beaded with dew and catching lantern light',
  'a stack of hay bales is topped with a single grinning jack-o-lantern',
  'a string of paper-lantern ghosts sways gently over the village well',
  'a row of pumpkins along the porch rail are each carved with a different grinning face',
  'black-cat silhouette cutouts are pasted in several cottage windows',
  'a garland of dried autumn leaves and small paper bats is strung along the eaves',
];

function pickInline(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────
// CLONED VERBATIM FROM TINYBOT (scripts/bots/tinybot/shared-blocks.js,
// 2026-09-06) — TinyBot's own non-negotiable identity, reproduced here so
// this file has zero cross-bot require() dependency. Two blocks
// (NO_HUMANS, DNA/composition) are ADAPTED for this path — noted inline.
// ─────────────────────────────────────────────────────────────

const TINY_HALLOWEEN_PROMPT_PREFIX =
  'miniature diorama photography, tabletop model world, tilt-shift macro lens, extreme shallow depth of field, dollhouse-scale, handcrafted tiny props, miniature set dressing, realistic modelmaking textures, visible tiny imperfections';

const TINY_HALLOWEEN_PROMPT_SUFFIX =
  'miniature tabletop diorama model, tilt-shift shallow depth of field, macro lens close-up, tiny handcrafted props, visible miniature scale, no text, no words, no watermarks';

const TILT_SHIFT_MINIATURE_BLOCK = `━━━ TILT-SHIFT MINIATURE AESTHETIC (NON-NEGOTIABLE — THIS IS THE MOST IMPORTANT RULE) ━━━

This MUST look like a TABLETOP MODEL / DIORAMA photographed with a MACRO LENS. NOT a real full-scale scene. NEVER a normal photograph of a real place. The viewer must IMMEDIATELY know this is miniature — visible table edge or surface beneath, extreme shallow depth-of-field with foreground and background blur, tiny handcrafted imperfections (brush strokes, glue marks, visible seams, painted surfaces, miniature fabric fibers). Scale anchors required: props must look thumb-sized, furniture matchbox-scale, buildings palm-sized. If it could be mistaken for a real full-scale photo, you have FAILED. THE BLUR IS A GRADIENT, NEVER A TOTAL WIPE — this is a VILLAGE scene, not a solo-object macro shot: even at its softest the frame must still hold one identifiable row of village silhouette (a cottage roofline, a row of lantern-glow dots, a rooftop edge against the sky) behind the sharp critter, or the shot is just a generic close-up animal photo with no Halloween village in it at all (verified 2026-09-06: three straight renders honored "extreme shallow depth of field" so completely that the entire lantern-lit cottage lane dissolved to formless bokeh circles, leaving nothing recognizably Halloween or village-shaped on screen — that is a FAILED shot even with a perfect critter and prop).`;

const OBSESSIVE_MICRO_DETAIL_BLOCK = `━━━ OBSESSIVE MICRO DETAIL ━━━

Every tiny detail countable. Individual leaves, individual books on shelves, individual pastries in cases. Stare-for-5-minutes quality — viewer finds new tiny things every look. Surface density is the signature — never sparse.`;

const CLEVER_CUTE_WHOA_BLOCK = `━━━ CLEVER + CUTE + WHOA ━━━

Stop + lean in + smile + look twice. The render must produce ALL of: clever composition + cute subject + surprising scale-play + cozy-when-appropriate. Never just pretty-miniatures — always with a moment of "wait, what?" or "OH that's adorable."`;

// ADAPTED from TinyBot's NO_HUMANS_BLOCK — this path's OK-list is its own
// mandatory critter cast rather than terrarium/macro fauna.
const NO_HUMANS_BLOCK = `━━━ NO HUMANS (except peripheral distant silhouettes) ━━━

No identifiable humans in frame. The miniature VILLAGE is the subject. Tiny critter residents (mice, hedgehogs, voles, chipmunks, squirrels, rabbits, moles) are not just allowed but REQUIRED as the little cast — see below. NEVER human figures as subject, NEVER an upright anthropomorphic "creature-person" standing/posed like a human.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — MINIATURE EDITION ━━━

Snow-globe-world quality × 10. The kind of image you want to shrink down and live inside. Wall-poster gorgeous. Tilt-shift + macro + obsessive detail.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MINIATURE AMPLIFICATION ━━━

Miniature magic is the canvas, not the ceiling. Stack: obsessive micro-detail + tilt-shift-blur-gradient + countable elements + clever juxtaposition + surprising scale. If viewer doesn't want to shrink down and live in it, dial up.`;

// ─────────────────────────────────────────────────────────────
// Path builder
// ─────────────────────────────────────────────────────────────

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'tiny_halloween_village_scene');
  const scaleProver = picker.pickWithRecency(SCALE_PROVERS, 'tiny_halloween_village_scale_prover');
  const atmosphere = pickInline(ATMOSPHERE);
  const nightSky = pickInline(NIGHT_SKY);
  const decorMotif = pickInline(DECOR_MOTIF);

  // MANDATORY cast — the concept's non-negotiable: at least one tiny critter
  // resident, always. ~35% chance of a second (mirrors tiny-winter-village's
  // proven 75%-present/35%-second recipe, but the FIRST slot here is never
  // gated — this path's cast is mandatory, not optional).
  const cast = [picker.pickWithRecency(CAST, 'tiny_halloween_village_cast')];
  if (Math.random() < 0.35) {
    const second = picker.pickWithRecency(CAST, 'tiny_halloween_village_cast');
    if (second !== cast[0]) cast.push(second);
  }
  const castBlock = `\n━━━ THE LITTLE CAST (MANDATORY tiny critter residents — real animals, never human, never an anthropomorphic mascot) ━━━\n${cast.join('\n')}`;

  return `You are a master model-maker AND storyteller writing CUTE, cozy-spooky MINIATURE HALLOWEEN-VILLAGE scenes for TinyBot. A dollhouse-scale Halloween town caught alive at dusk — crooked matchbox cottages strung with jack-o-lantern light, a cobbled square dressed for the season, tiny critter residents going about a Halloween evening. The VILLAGE is the hero, a lived-in little world, not a single object posed on a bare surface. Storybook-adorable and PLAYFULLY spooky — grinning pumpkins and friendly ghosts, never genuine horror. NO humans (peripheral distant silhouettes at most). Output wraps with style prefix + suffix.

${TILT_SHIFT_MINIATURE_BLOCK}

${OBSESSIVE_MICRO_DETAIL_BLOCK}

${CLEVER_CUTE_WHOA_BLOCK}

${NO_HUMANS_BLOCK}

${IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NON-NEGOTIABLE TEMPLATE MANDATE — THIS PATH'S CORE IDENTITY ━━━

Every render MUST be BOTH inhabited AND scale-proven, or it has failed its brief:
1. INHABITED — at least one real tiny critter resident (mouse, hedgehog, vole, or similar small woodland animal, proportioned like an actual animal — button nose, whiskers, paws, fur or quills) caught mid a specific Halloween activity. NEVER a human. NEVER an upright, human-posed "mascot" creature.
2. SCALE-PROVEN — one true-to-life-scale everyday object (a real acorn, leaf, coin, candy-corn kernel, spiderweb, feather, etc.) placed beside or within the village at its ACTUAL size, so the miniature reads unmistakably tiny purely by comparison.
GUARD AGAINST THE PUMPKIN PRIOR — this scene is already thick with pumpkins and jack-o-lanterns, named repeatedly across the village, cast, and decor pools in the same prompt. Flux's dominant learned association here is "round orange thing = pumpkin," so a scale-prover object that is itself round and orange (a candy-corn kernel, an apple, a glinting coin) is reliably swallowed and re-rendered as just another tiny pumpkin, silencing the scale-joke entirely (verified 2026-09-06 — three straight test renders lost their scale-prover payoff exactly this way). Whenever the scale-prover object shares a round-orange silhouette with a pumpkin, name the ONE trait a pumpkin could never have in the very same phrase you first introduce it (candy corn's flat tricolor stripes and blunt cone tip, not a round body; a coin's flat ridged metal edge and engraved face, not stem or ridges) — never let it read as merely "another round orange shape" among all the pumpkins.
Keep the register PLAYFUL and cozy-spooky throughout — grinning jack-o-lanterns, friendly ghosts, warm lantern light. Never true horror, gore, or real scares.
CRITICAL ORDERING — this scene is already dense with cottages, lanterns, and decor, and Flux's attention is front-loaded: a critter or scale-prover object mentioned only near the END of your output is reliably DROPPED from the actual render. Name the critter (with its specific action) among the FIRST 2-3 phrases of your output, immediately after establishing the village setting, and name the scale-prover object no later than the halfway point. Never save either for the final clause.
CRITICAL CO-LOCATION — the scale-prover text below may name its own landmark (a market square, a garden corner, a well, a crossroads, a cottage door...). IGNORE that landmark and physically relocate the object to sit right beside the critter cast instead, on the very same cobblestones or step. This is a single tilt-shift macro shot with ONE sharp focal plane: a critter at one spot and a scale-prover object described at a DIFFERENT named spot elsewhere in the village will NOT both render — the second, physically-separate object is reliably dropped or reduced to unreadable background bokeh (verified 2026-09-06: a penny at "the market square" rendered perfectly beside a vole on a nearby gatepost when the polish tied them to "those same stones," but vanished entirely when paired with a squirrel at "the lane's mossy edge," and a burdock burr "at the garden corner" vanished paired with a chipmunk "by a cottage door"). Write the critter and the object as touching or immediately adjacent — e.g. "resting against the very step/post/paw the critter stands on" — never in two different corners of the village.
CRITICAL FOCAL PLANE — correct co-location is NOT enough on its own: this format's extreme shallow depth-of-field blurs everything outside the sharp plane into unreadable bokeh, and a scale-prover object that is merely placed "beside" or "against" the critter without being named INSIDE the sharp plane is reliably one of the things that blurs away or drops entirely, even when perfectly co-located (verified 2026-09-06: a garden-snail-shell hut and a burdock burr, both correctly written touching their critter, were completely absent from the rendered image — while a blue-jay feather rendered crisp and enormous specifically because the same output separately stated the blur gradient was "sharpest at the critters and feather"). You MUST explicitly state, in your own words and late enough to land (not buried before the critter is even introduced), that the sharp focal plane covers BOTH the critter AND the scale-prover object together as one in-focus pair — never sharp-critter-alone with the object only incidentally nearby. Everything else in the village may soften into the blur gradient, but keep at least one recognizable middle-distance layer (a lit window, a rooftop line, a lantern-lit lane) rather than dissolving the whole village to blank bokeh circles — the critter and object are the hero DETAIL, not the entire frame.
RETIRED 2026-09-06 (re-QA round 3): the garden-snail-shell and burdock-burr scale-prover entries failed this exact focal-plane test AGAIN on a second independent render even after the CRITICAL FOCAL PLANE guidance above was added — both objects are just weak/rare enough concepts for Flux that no amount of co-location or focal-plane phrasing rescues them. Removed outright from tiny_halloween_village_scale_prover.json rather than re-worded a third time; do not re-add either without a fresh render proving they can survive the focal plane.

━━━ THE MINIATURE HALLOWEEN VILLAGE (stage the scene here, keeping its foreground / midground / far-distance layers) ━━━
${scene}
${castBlock}

━━━ THE SCALE-PROVER (this path's signature money-shot detail — place this true-to-life-scale object beside or within the tiny village) ━━━
${scaleProver}

━━━ SEASONAL DECOR MOTIF (weave this specific flourish into the scene) ━━━
${decorMotif}

${sharedDNA.scenePalette ? `━━━ SCENE-WIDE COLOR PALETTE ━━━\n${sharedDNA.scenePalette}\n` : ''}
${sharedDNA.colorPalette ? `━━━ SECONDARY LIGHTING VIBE ━━━\n${sharedDNA.colorPalette}\n` : ''}
━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ NIGHT SKY / MOON ━━━
${nightSky}

${BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HALLOWEEN-VILLAGE DNA ━━━
This is a MODEL HALLOWEEN VILLAGE — every cottage fits in your palm. Render with master-modelmaker obsession: hand-laid stone walls the size of sugar cubes, crooked matchbox cottages with candlelit resin-drop windows glowing warm amber, thumb-sized carved-pumpkin lanterns, thread-thin cobweb bunting, bead-sized bonfires and cauldrons. The SIGNATURE is warm jack-o-lantern amber-orange glow against a deep indigo Halloween dusk or night — and the true-to-life scale-prover object sitting right beside the tiny buildings, so any viewer instantly reads just how small this world is. Lived-in at miniature scale: a half-carved pumpkin with shavings still on the step, a matchstick-thin broom leaning by a door, a thimble left out to cool. Tilt-shift shallow DOF makes the real feel dollhouse.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Wide or mid-wide elevated view looking down at the Halloween village like a model railway layout. Build MULTIPLE DEPTH LAYERS: a near detail (the scale-prover object, a lit doorway, the critter cast), the village midground of lantern-lit rooftops and decorated lanes, and a far distance fading into soft dusk haze. Keep the WHOLE scene readable — never zoom into a single prop or body-part macro that loses the village. Something quietly happening — a critter mid-task, smoke curling, lanterns glowing. Leave room to breathe; NOT a centered product shot, NOT one object on a bare surface. Palette dictated by the LIGHTING + NIGHT-SKY blocks above (respect them even over "warm cozy" if they call for a cooler or moodier cast).

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

module.exports.TINY_HALLOWEEN_PROMPT_PREFIX = TINY_HALLOWEEN_PROMPT_PREFIX;
module.exports.TINY_HALLOWEEN_PROMPT_SUFFIX = TINY_HALLOWEEN_PROMPT_SUFFIX;
