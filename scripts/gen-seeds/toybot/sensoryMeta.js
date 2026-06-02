/**
 * Meta-prompt registry for ToyBot sensory channel pools.
 * 2 contexts (figure / scene) × 7 channels = 14 pools.
 * CRITICAL: figure context uses TOY MATERIAL anchors, NOT human anatomy.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- Comma-separated phrases when needed
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- Aesthetic register: practical-toy-photography / diorama / commercial-toy-aisle / Saturday-morning-cartoon
- ABSOLUTELY NEVER reference human anatomy (hands/lips/hair/skin/her/his/she/he)
  Toy figures use TOY MATERIAL: mold-seam, ball-joint, paint-chip, ABS-plastic, articulation,
  felt-stitching, vinyl-gloss, plasticine-thumb-print, painted-pewter, cast-in-plastic

━━━ AESTHETIC ANCHORS ━━━
- toy materials: ABS plastic, vinyl, plasticine clay, sackcloth burlap, felt, flocked velvet,
  pewter, polished brass, hand-painted lacquer, mold-seam ridge, paint-chip, ball-joint pin,
  rubber-band tension, rotocast hollow body, weighted base, oval miniature base, articulation joint
- toy types: LEGO minifig, plasticine puppet, vinyl designer toy, action figure, Sackboy, calico critter,
  Strawberry Shortcake doll, Barbie doll, Warhammer mini, GI-Joe commando, green-army-man, action-hero figure
- diorama / set-piece: cotton-ball smoke, foam-rock, static-grass, lichen-tree, matchstick-fence,
  tilt-shift macro, practical-set, toy diorama, cardboard backdrop, dollhouse, foam terrain,
  sand-base, painted miniature display, scale 1/12, scale 1/24, scale 1/72`;

function ch(opts) {
  return (
    n
  ) => `You are writing ${n} distinct ${opts.name.toUpperCase()} anchors for ToyBot's ${opts.context} context.

${opts.desc}

EXAMPLES (DO NOT REUSE):
${opts.examples.map((e) => '- "' + e + '"').join('\n')}

${SHARED_RULES}
${opts.absoluteRule || ''}

━━━ DEDUP — too similar if both ${opts.dedup}. Vary one.
━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`;
}

const TOY_FIGURE_RULE = `━━━ ABSOLUTE TOY-MATERIAL RULE ━━━
This is a TOY, not a human. NEVER use her/his/she/he. NEVER reference human anatomy
(hands, lips, hair, skin, fingers). The figure is plastic / vinyl / clay / cloth /
pewter / sackcloth — its body parts are mold-seams, ball-joints, paint-chips,
felt-stitching, plasticine-thumbprints. Use "the figure" or "the toy" or "the minifig".`;

const figure = {
  smell: ch({
    name: 'smell',
    context: 'FIGURE (toy figure as subject)',
    desc: 'Toy-material smells — fresh ABS plastic, plasticine clay, vinyl-aerosol, sackcloth fabric softener.',
    examples: [
      'fresh-from-the-box ABS plastic on the action figure',
      "plasticine clay still soft from the sculptor's thumb",
      'vinyl-gloss aerosol curing on the designer toy',
      "fabric-softener clinging to the Sackboy's burlap body",
      'spray-paint primer on the painted miniature',
    ],
    dedup: 'TOY MATERIAL and TOY TYPE',
    absoluteRule: TOY_FIGURE_RULE,
  }),
  sound: ch({
    name: 'sound',
    context: 'FIGURE',
    desc: 'Toy mechanical sounds — ball-joint clicks, plastic snaps, felt-stitch tears.',
    examples: [
      "ball-joint clicking as the figure's arm articulates",
      'plastic snap as the LEGO minifig clips into the studs',
      'rubber-band tension creak in the GI-Joe waist swivel',
      'felt-stitch tear sound as the Sackboy is repositioned',
      'metal pewter base thud as the tabletop miniature is set down',
    ],
    dedup: 'TOY-PART and SOUND VERB',
    absoluteRule: TOY_FIGURE_RULE,
  }),
  touch: ch({
    name: 'touch',
    context: 'FIGURE',
    desc: 'Toy surface textures — mold-seams, paint-chips, stud-tops, plasticine.',
    examples: [
      "mold-seam ridge running down the figure's leg",
      "paint-chip exposing primer on the action figure's pauldron",
      "stud-tops gripping the LEGO minifig's torso",
      'thumbprint indentation in the plasticine clay arm',
      "static-grass scratch on the tabletop miniature's base",
    ],
    dedup: 'TOY MATERIAL and SURFACE/PART',
    absoluteRule: TOY_FIGURE_RULE,
  }),
  temperature: ch({
    name: 'temperature',
    context: 'FIGURE',
    desc: 'Studio-light heat / display-cabinet cool / set-light warmth on the toy.',
    examples: [
      "studio-spotlight heat warming the vinyl figure's surface",
      'cool-display-cabinet glass against the painted miniature',
      'warm-from-the-box ABS plastic still soft to touch',
      'fluorescent practical-light glow warming the diorama set',
      'cold air on the cooling clay puppet between takes',
    ],
    dedup: 'THERMAL SOURCE and TOY MATERIAL',
    absoluteRule: TOY_FIGURE_RULE,
  }),
  weight: ch({
    name: 'weight',
    context: 'FIGURE',
    desc: 'Toy weight on its base / body proportions.',
    examples: [
      'weighted hollow-body of the 1/12 action figure',
      'metal-pewter heft of the painted tabletop miniature',
      'molded-plastic single-piece army-man perfectly balanced on its oval base',
      "vinyl figure's oversized head pulling slightly forward",
      'felt Sackboy slumping when un-posed',
    ],
    dedup: 'TOY PART and WEIGHT VERB',
    absoluteRule: TOY_FIGURE_RULE,
  }),
  air: ch({
    name: 'air',
    context: 'FIGURE',
    desc: 'Practical-set atmosphere — cotton-ball smoke, talc-powder, glitter, spray-mist.',
    examples: [
      'cotton-ball smoke drifting around the action figure',
      'powder-fluff dust around the painted miniature',
      'static cling lifting fabric scraps from the dollhouse floor',
      'spray-bottle mist hanging in the macro toy-photography setup',
      'scrap-paper confetti raining around the LEGO scene',
    ],
    dedup: 'PARTICLE and TOY LOCATION',
    absoluteRule: TOY_FIGURE_RULE,
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for ToyBot's FIGURE context. Studio / cabinet / commercial-toy-aisle lighting on the toy figure.

EXAMPLES (DO NOT REUSE):
- "studio-strobe blue-white flash-bulb across the action figure"
- "Saturday-morning-cartoon saturated red key on the cape-and-cowl"
- "Barbie-Dreamhouse pink wash flooding the doll's face"
- "cabinet-LED amber rim along the painted miniature"
- "macro-spotlight cyan side-light on the vinyl figure"

━━━ COLOR FAMILIES ━━━
STUDIO-STROBE BLUE-WHITE (8-10), SATURDAY-MORNING SATURATED-RED (8-10), BARBIE-DREAMHOUSE PINK (8-10), CABINET-LED AMBER (10-12), MACRO-SPOTLIGHT CYAN (8-10), MUZZLE-FLASH ORANGE (4-6), TOY-AISLE FLUORESCENT-PINK-YELLOW-GREEN (4-6), CHRISTMAS-VILLAGE RED-GREEN-TWINKLE (4-6), HALLOWEEN-ORANGE SPOTLIGHT (4-6), FAIRY-LIGHT CYAN (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), rim (12-14), backlight (8-10), side-light (10-12), strobe (6-8), wash (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (toy figure body — head, chest plate, base, articulated limb, painted detail).
${TOY_FIGURE_RULE}
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: ch({
    name: 'smell',
    context: 'SCENE (toy diorama / LEGO epic / toy landscape)',
    desc: 'Practical-set / diorama / toy-photography studio smells.',
    examples: [
      'fresh-glue evaporation across the diorama foam-rocks',
      'hot-plastic ABS lingering over the LEGO-mold press',
      'spray-paint primer drying on the foam-rock terrain',
      'static-grass adhesive curing on the tabletop terrain',
      'PVA glue setting in the matchstick fence',
    ],
    dedup: 'SCENT NOUN and DIORAMA LOCATION',
  }),
  sound: ch({
    name: 'sound',
    context: 'SCENE',
    desc: 'Studio / set-piece sounds.',
    examples: [
      'scrap-pieces rattling in the macro toy box',
      'studio-fan whirring above the toy diorama set',
      'tape rolling across the diorama backboard',
      'pieces clinking as the LEGO scene is built',
      'felt-fabric stretching across the diorama hill',
    ],
    dedup: 'SOURCE and QUALITY',
  }),
  touch: ch({
    name: 'touch',
    context: 'SCENE',
    desc: 'Diorama textures — static-grass, lichen-tree, foam-rock, matchstick-fence, paper-craft.',
    examples: [
      'static-grass fuzz creeping over the diorama hillside',
      'lichen-tree gripping the foam-rock outcrop',
      "cobblestone-foam cool under the LEGO minifig's stud",
      "matchstick-fence rough at the toy meadow's edge",
      'felt-mushroom stem pliable in the diorama forest',
    ],
    dedup: 'TEXTURE and DIORAMA SURFACE',
  }),
  temperature: ch({
    name: 'temperature',
    context: 'SCENE',
    desc: 'Studio / cabinet / spotlight thermal cues across the diorama.',
    examples: [
      'studio-spotlight warmth radiating across the toy landscape',
      'fluorescent-light cool above the diorama',
      'warm practical-bulb amber glowing through the toy windows',
      'macro-shutter cool air pulled across the toy set',
      'spotlight-LED-heat above the LEGO-epic build',
    ],
    dedup: 'THERMAL SOURCE and LOCATION',
  }),
  weight: ch({
    name: 'weight',
    context: 'SCENE',
    desc: 'Diorama mass / baseplate / terrain weight.',
    examples: [
      'century-heavy LEGO baseplate anchoring the build',
      'tabletop-terrain foam-rock pressing the wooden display',
      'diorama hillside sagging under the felt-meadow weight',
      'toy-landscape backboard leaning against the studio wall',
      'miniature-bridge of matchsticks bowed under the painted soldier',
    ],
    dedup: 'OBJECT and WEIGHT VERB',
  }),
  air: ch({
    name: 'air',
    context: 'SCENE',
    desc: 'Cotton-ball smoke / spray-mist / talc-powder / glitter / scrap-fluff in the toy set.',
    examples: [
      'cotton-ball smoke billowing across the army-men battlefield',
      'spray-bottle mist haloing the toy landscape',
      'scrap-glitter raining over the Barbie set',
      'talc-powder snowfall settling on the LEGO village',
      'PVA-glue drips suspended in the diorama waterfall',
    ],
    dedup: 'PARTICLE and LOCATION',
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for ToyBot's SCENE context (toy diorama / LEGO epic / toy landscape). Studio + commercial-toy-photography lighting.

EXAMPLES (DO NOT REUSE):
- "studio-spotlight warm-amber glow flooding the LEGO street"
- "Saturday-morning-cartoon saturated red key from the diorama edge"
- "fluorescent-cool blue-white above the macro set"
- "muzzle-flash orange burst across the army-men trench"
- "cabinet-LED amber spotlight on the tabletop miniature"

━━━ COLOR FAMILIES ━━━ Same as figure: STUDIO-STROBE BLUE-WHITE (8-10), SATURDAY-MORNING SATURATED-RED (8-10), BARBIE-DREAMHOUSE PINK (6-8), CABINET-LED AMBER (10-12), MACRO-SPOTLIGHT CYAN (6-8), MUZZLE-FLASH ORANGE (8-10), TOY-AISLE FLUORESCENT (6-8), CHRISTMAS-VILLAGE RED-GREEN-TWINKLE (4-6), TILT-SHIFT-HONEY-AMBER (4-6), HALLOWEEN-ORANGE (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), wash (10-12), shaft (10-12), rim (8-10), strobe (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (toy diorama feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { figure, scene };
module.exports = { metaPrompts };
