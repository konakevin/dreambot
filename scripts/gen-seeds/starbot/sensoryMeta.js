/**
 * Meta-prompt registry for StarBot sensory channel pools.
 *
 * 6 contexts × 7 channels = 42 pools. Per design doc
 * memory/sensory_rollout/starbot.md.
 *
 * Mind-bending sci-fi — Blade Runner / Dune / Interstellar / Moebius DNA.
 * Distinct contexts:
 *   - cyborg-female / cyborg-male: chrome / fiber-optic / power-core anatomy
 *   - explorer-female / explorer-male: organic body in EVA suit, no implants
 *   - robot: purely mechanical, no organic anything
 *   - scene: cosmic vistas / megastructures / alien landscapes / sci-fi interiors
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry — not a mood, not a list
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- Aesthetic register: hard-sci-fi / Blade Runner / Dune / Interstellar / cyberpunk / Moebius

━━━ AESTHETIC ANCHORS (use freely) ━━━
- objects: power core, reactor, fiber-optic conduit, servo, hydraulic line, coolant pump,
  EVA pack, helmet visor, thermal undersuit, exo-rig, gauntlet, plasma rifle, ion battery,
  carbon-fiber, hull plating, deck plate, airlock, cargo bay, bridge console, HUD glass,
  bandolier, magnetic boots, magazine, tether, oxygen line, plasma vent, bulkhead
- materials: chrome, brushed-titanium, brushed-aluminum, carbon-fiber, ceramic plate,
  obsidian-black, bone-white, organic-and-machine seam, sintered-metal
- environments: cargo bay, bridge, reactor chamber, airlock, alien biome, exoplanet dune,
  ringworld, Dyson sphere, megastructure, nebula, accretion disk, hyperspace, alien city,
  Moebius dunes, Bonestell painted-Mars, abandoned spaceship, deep-space corridor`;

const ABSOLUTE_NO_HUMANS = `━━━ ABSOLUTE RULE ━━━
NEVER reference humans (her/his/she/he, hands, faces, organic skin). Use "it" / "its".
Anchors reference machine anatomy or environment only.`;

// ─────────────────────────────────────────────────────────────
// Helper to build channel meta-prompts that share structure
// ─────────────────────────────────────────────────────────────

function buildChannel({
  contextLabel,
  contextNote,
  examples,
  channelName,
  channelDesc,
  dedupRule,
  absoluteRule = '',
}) {
  return (
    n
  ) => `You are writing ${n} distinct ${channelName.toUpperCase()} anchors for StarBot's ${contextLabel} context. ${contextNote}

${channelDesc}

EXAMPLES (DO NOT REUSE):
${examples.map((e) => '- "' + e + '"').join('\n')}

${SHARED_RULES}
${absoluteRule}

━━━ DEDUP — two entries are too similar if they share ━━━
${dedupRule}

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`;
}

const CYBORG_NOTE =
  'Densely cyborg-anatomical — chrome, fiber-optic, power-core, reactor, servo, organic-meets-machine seams. Anchors reference implants/panels/ports as body parts.';
const EXPLORER_NOTE =
  'Fully organic in EVA/spacesuit — NO implants, NO machine-anatomy. Anchors reference organic body interacting with spacesuit + alien environment.';
const ROBOT_NOTE =
  'Purely mechanical figure — no skin, no breath. Servo whine + hydraulic hiss + coolant warm + magnetic boots. Use "it" / "its".';

// ─────────────────────────────────────────────────────────────
// CYBORG-FEMALE — cyborg-woman path
// ─────────────────────────────────────────────────────────────

const cyborg_female = {
  smell: buildChannel({
    contextLabel: 'CYBORG-FEMALE',
    contextNote: CYBORG_NOTE,
    channelName: 'smell',
    channelDesc: 'Smells on her cyborg body / implants / seams.',
    examples: [
      'ozone clinging to her freshly-charged ion battery',
      'sterile recycled air on her recovering skin around the implant seam',
      'burnt insulation curling from her shoulder vent',
      'coolant leaking faintly from her chrome forearm seam',
      'metallic ozone hanging around her exposed power core',
    ],
    dedupRule: 'Both the SCENT NOUN AND the IMPLANT/BODY-PART. Vary one.',
  }),
  sound: buildChannel({
    contextLabel: 'CYBORG-FEMALE',
    contextNote: CYBORG_NOTE,
    channelName: 'sound',
    channelDesc: 'Mechanical sounds from her implants + her organic-and-machine breathing.',
    examples: [
      'her power core humming at the base of her sternum',
      'fiber-optic conduits pulsing in time with her breath',
      'servo whine modulating as she turns her head',
      'her chrome shoulder-plate clicking as she flexes',
      'a low coolant pump cycling beneath her ribcage',
    ],
    dedupRule: 'Both the SOURCE AND the QUALITY. Vary one.',
  }),
  touch: buildChannel({
    contextLabel: 'CYBORG-FEMALE',
    contextNote: CYBORG_NOTE,
    channelName: 'touch',
    channelDesc:
      'Cyborg-woman tactile cues — chrome on organic skin, circuit-vein under temple, panel-warm.',
    examples: [
      'chrome jaw plate cool against her organic cheek',
      'translucent skin-panel warming faintly over the reactor in her chest',
      'her exposed circuit-vein faintly humming under her temple',
      'her organic palm meeting the chrome of her prosthetic forearm',
      'fiber-optic light tracing the seam where her organic neck meets chrome',
    ],
    dedupRule: 'Both the BODY/IMPLANT PART AND the SENSATION VERB. Vary one.',
  }),
  temperature: buildChannel({
    contextLabel: 'CYBORG-FEMALE',
    contextNote: CYBORG_NOTE,
    channelName: 'temperature',
    channelDesc: 'Thermal cues at the cyborg-woman/machine boundary.',
    examples: [
      'reactor-warm pulse radiating from her sternum outward',
      'frostbite blooming where her organic skin meets her chrome plating',
      'her dermal heat dropping where the circuit panel takes over',
      'vacuum-cold pressing through her thermal undersuit',
      'her power core thawing the frost forming on her chrome shoulder',
    ],
    dedupRule: 'Both the THERMAL SOURCE AND the BODY PART. Vary one.',
  }),
  weight: buildChannel({
    contextLabel: 'CYBORG-FEMALE',
    contextNote: CYBORG_NOTE,
    channelName: 'weight',
    channelDesc: 'Heaviness of cyborg gear / battery pack / augmented limbs.',
    examples: [
      'augmented exo-arm dragging her shoulder forward',
      'her cybernetic spine making her stance unnaturally rigid',
      'battery pack across her lower back pulling her hips',
      'tactical harness biting into her hips',
      'a heavy plasma-pistol holstered against her thigh',
    ],
    dedupRule: 'Both the OBJECT AND the BODY PART. Vary one.',
  }),
  air: buildChannel({
    contextLabel: 'CYBORG-FEMALE',
    contextNote: CYBORG_NOTE,
    channelName: 'air',
    channelDesc: 'Atmospheric cues around the cyborg-woman.',
    examples: [
      'vapor-trail of breath crystallizing as it leaves her organic mouth',
      'atmospheric haze bending the cyan glow of her circuit-veins',
      'particulate from a dust storm clinging to her power-core seams',
      'steam venting past her shoulder from her cooling-system release',
      'plasma-flicker drifting around her drawn ion-rifle',
    ],
    dedupRule: 'Both the PARTICLE/MEDIUM AND the MOTION VERB. Vary one.',
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for StarBot's CYBORG-FEMALE context. Each entry forces Flux to render a SPECIFIC sci-fi lighting palette on her cyborg body.

Each entry must include: COLOR + DIRECTION + IMPACT POINT (her chrome plating / sternum reactor / fiber-optic vein / organic-and-machine profile).

EXAMPLES (DO NOT REUSE):
- "cyan reactor underlight blooming through her sternum panel"
- "Mars-amber backlight rim along her chrome shoulder line"
- "plasma-violet sidelight tracing her organic-and-chrome profile"
- "fel-green HUD reflection cast across the chrome of her cheek"
- "ion-blue strobe pulsing across her augmented exo-arm"

━━━ COLOR FAMILIES ━━━
PLASMA-CYAN (12-14), MARS-AMBER (10-12), FEL-VIOLET (10-12), VOID-PURPLE (8-10), ION-BLUE (8-10), JWST teal-magenta (4-6), Bonestell sun-amber (4-6), reactor-orange (4-6), ozone-green (4-6), interstellar-white (4-6).

━━━ DIRECTION SPREAD ━━━
key (10-12), rim (12-14), underlight (12-14 — her glowing implants), sidelight (8-10), backlight (4-6), strobe (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (cyborg body part)
- Aesthetic: cinematic sci-fi / cyberpunk / cyborg

━━━ DEDUP ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// CYBORG-MALE — cyborg-man path
// ─────────────────────────────────────────────────────────────

const cyborg_male = {
  smell: buildChannel({
    contextLabel: 'CYBORG-MALE',
    contextNote: CYBORG_NOTE,
    channelName: 'smell',
    channelDesc: 'Smells on his cyborg body / implants / seams.',
    examples: [
      'burnt circuit grease on his calloused fingertips',
      'ionized ozone in his beard from the recharge port',
      'coolant leaking faintly from his shoulder vent',
      'old leather and gun-oil under his exo-armor',
      'metallic-ozone in his beard from the recharge port',
    ],
    dedupRule: 'Both the SCENT NOUN AND the IMPLANT/BODY-PART. Vary one.',
  }),
  sound: buildChannel({
    contextLabel: 'CYBORG-MALE',
    contextNote: CYBORG_NOTE,
    channelName: 'sound',
    channelDesc: 'Mechanical sounds from his implants + his organic-and-machine breathing.',
    examples: [
      'hydraulic hiss venting from his shoulder rig',
      'his power core thrumming low against his ribcage',
      'the servo in his neck whirring as he turns his head',
      'his magnetic boot clamping to the deck plate',
      'a faint coolant pump cycling under his chest plate',
    ],
    dedupRule: 'Both the SOURCE AND the QUALITY. Vary one.',
  }),
  touch: buildChannel({
    contextLabel: 'CYBORG-MALE',
    contextNote: CYBORG_NOTE,
    channelName: 'touch',
    channelDesc: 'Cyborg-man tactile cues — chrome on organic, circuit-vein, prosthetic-grip.',
    examples: [
      'chrome forearm plating cool against his bare chest',
      'circuit-vein pulsing faintly under his temple',
      'his organic palm meeting the chrome of his prosthetic forearm',
      'rifle stock warming in his calloused palm from the discharge',
      'cold steel of his augmented spine pressing through his undershirt',
    ],
    dedupRule: 'Both the BODY/IMPLANT PART AND the SENSATION VERB. Vary one.',
  }),
  temperature: buildChannel({
    contextLabel: 'CYBORG-MALE',
    contextNote: CYBORG_NOTE,
    channelName: 'temperature',
    channelDesc: 'Thermal cues at the cyborg-man/machine boundary.',
    examples: [
      'reactor-warmth radiating from his sternum panel',
      'frost forming where his organic shoulder meets the chrome plating',
      'his dermal heat dropping along the circuit-panel boundary',
      'vacuum-frost forming on his visor near his jaw',
      'engine-bay heat pressing against his back through his thermal undersuit',
    ],
    dedupRule: 'Both the THERMAL SOURCE AND the BODY PART. Vary one.',
  }),
  weight: buildChannel({
    contextLabel: 'CYBORG-MALE',
    contextNote: CYBORG_NOTE,
    channelName: 'weight',
    channelDesc: 'Heaviness of cyborg gear / battery pack / augmented limbs.',
    examples: [
      'augmented servo-arm dragging his shoulder lower',
      'battery pack across his lower back pulling him forward',
      'his cybernetic spine making his stance rigid',
      'exo-rifle slung heavy across his back',
      'ammunition bandolier dragging at his chest plate',
    ],
    dedupRule: 'Both the OBJECT AND the BODY PART. Vary one.',
  }),
  air: buildChannel({
    contextLabel: 'CYBORG-MALE',
    contextNote: CYBORG_NOTE,
    channelName: 'air',
    channelDesc: 'Atmospheric cues around the cyborg-man.',
    examples: [
      'his breath crystallizing as it leaves his organic mouth',
      'smoke from a discharged plasma vent curling past his chrome shoulder',
      'atmospheric haze bending the cyan glow of his circuit-veins',
      'steam venting past his ribcage from his cooling-system release',
      'alien-spore drift past his outstretched chrome hand',
    ],
    dedupRule: 'Both the PARTICLE/MEDIUM AND the MOTION VERB. Vary one.',
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for StarBot's CYBORG-MALE context. Lighting on his cyborg body.

EXAMPLES (DO NOT REUSE):
- "cyan reactor underlight blooming through his sternum panel"
- "Mars-amber backlight rim along his chrome shoulder line"
- "fel-green HUD reflection across the chrome of his cheek"
- "plasma-violet sidelight tracing his organic-and-chrome profile"
- "ion-blue strobe pulsing across his augmented exo-arm"

━━━ COLOR FAMILIES + SPREAD ━━━
Same as cyborg-female: PLASMA-CYAN (12-14), MARS-AMBER (10-12), FEL-VIOLET (10-12), VOID-PURPLE (8-10), ION-BLUE (8-10), JWST teal-magenta (4-6), Bonestell sun-amber (4-6), reactor-orange (4-6), ozone-green (4-6), interstellar-white (4-6).

━━━ DIRECTION SPREAD ━━━
key (10-12), rim (12-14), underlight (12-14), sidelight (8-10), backlight (4-6), strobe (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (his cyborg body part)
- Aesthetic: cinematic sci-fi / cyberpunk / cyborg

━━━ DEDUP ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// EXPLORER-FEMALE — female-explorer path (organic woman in EVA)
// ─────────────────────────────────────────────────────────────

const explorer_female = {
  smell: buildChannel({
    contextLabel: 'EXPLORER-FEMALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'smell',
    channelDesc: 'Smells inside her helmet / on her suit / from the alien environment.',
    examples: [
      'sterile recycled oxygen filling her helmet',
      'alien dust caked into the knee joint of her EVA suit',
      'her own sweat in the closed loop of her undersuit collar',
      'leather-and-canvas of her glove against her face plate',
      'bio-spore on the visor she just wiped with her gloved hand',
    ],
    dedupRule: 'Both the SCENT NOUN AND the LOCATION (helmet / suit / glove / visor). Vary one.',
  }),
  sound: buildChannel({
    contextLabel: 'EXPLORER-FEMALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'sound',
    channelDesc: 'Suit-mechanism sounds + her organic body sounds inside the helmet.',
    examples: [
      'her suit-pump cycling rhythmically against her back',
      'her radio static crackling against her cheek',
      'her boot-mag clamping to the airlock floor',
      'her breath fogging her own helmet mic',
      'her tether cable creaking taut as she leans',
    ],
    dedupRule: 'Both the SOURCE AND the QUALITY. Vary one.',
  }),
  touch: buildChannel({
    contextLabel: 'EXPLORER-FEMALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'touch',
    channelDesc:
      'Her organic skin + her gloved hands in contact with EVA suit + alien environment.',
    examples: [
      'thermal undersuit warm against her skin',
      'her gloved palm pressed flat to the alien rock face',
      'the inside of her visor fogging where her chin meets the seal',
      'her oxygen-line tug at her shoulder',
      'cold metal of her tether-clip against her hip',
    ],
    dedupRule: 'Both the BODY PART AND the SENSATION VERB. Vary one.',
  }),
  temperature: buildChannel({
    contextLabel: 'EXPLORER-FEMALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'temperature',
    channelDesc: 'Thermal cues — vacuum-cold, twin-sun heat, helmet-warm.',
    examples: [
      "vacuum-cold pressing through her suit's thinning insulation",
      'exo-planet sun heating one shoulder of her suit',
      'her breath warming her cheeks inside the helmet',
      'frostbite-cold biting at the knuckle of her glove',
      'engine-bay heat pressing the back of her suit',
    ],
    dedupRule: 'Both the THERMAL SOURCE AND the SUIT-PART/BODY-PART. Vary one.',
  }),
  weight: buildChannel({
    contextLabel: 'EXPLORER-FEMALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'weight',
    channelDesc: 'Suit / gear / tools weighing on her body. Low-G occasionally.',
    examples: [
      'EVA pack pulling her shoulders backward',
      'tool-bandolier dragging at her hip',
      'low-gravity making her tether feel weightless on her thigh',
      'her plasma-rifle slung heavy across her back',
      'magnetic boots clamped to the deck plate at her feet',
    ],
    dedupRule: 'Both the OBJECT AND the BODY PART. Vary one.',
  }),
  air: buildChannel({
    contextLabel: 'EXPLORER-FEMALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'air',
    channelDesc: 'Atmospheric cues — breath cloud / spore / plasma vent / alien dust.',
    examples: [
      'her breath cloud fogging her visor',
      'exo-spore particulate drifting past her shoulder',
      'alien-pollen settling on her gloves',
      'plasma exhaust drifting past her airlock',
      'rocket-exhaust haze drifting past her shoulder',
    ],
    dedupRule: 'Both the PARTICLE/MEDIUM AND the MOTION VERB. Vary one.',
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for StarBot's EXPLORER-FEMALE context. Lighting on her organic-in-EVA body.

EXAMPLES (DO NOT REUSE):
- "Mars-amber sun-glow on her helmet visor"
- "twin-star backlight rim along her suited shoulder"
- "alien aurora cyan-and-magenta lighting her face through the visor"
- "Bonestell sun-amber across her crouched silhouette"
- "JWST false-color teal-magenta wash across her EVA pack"

━━━ COLOR FAMILIES + SPREAD ━━━
PLASMA-CYAN (8-10), MARS-AMBER (12-14), FEL-VIOLET (8-10), Bonestell sun-amber (10-12), JWST teal-magenta (8-10), interstellar-white (8-10), polar-aurora green-magenta (6-8), ion-blue (4-6).

━━━ DIRECTION SPREAD ━━━
key (12-14), rim (12-14), shaft (10-12), backlight (8-10), sidelight (6-8).

━━━ HARD RULES ━━━
- 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (her suited body or visor)
- Aesthetic: NASA-cinematic / Bonestell / Interstellar / hard-sci-fi exploration

━━━ DEDUP ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// EXPLORER-MALE — male-explorer path (organic man in EVA)
// ─────────────────────────────────────────────────────────────

const explorer_male = {
  smell: buildChannel({
    contextLabel: 'EXPLORER-MALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'smell',
    channelDesc: 'Smells inside his helmet / on his suit / from the alien environment.',
    examples: [
      'old leather faintly under his EVA suit collar',
      'rocket fuel residue clinging to his gloves',
      'alien dust packed into the treads of his boots',
      'his own sweat in his closed-loop undersuit',
      'oxygen-line plastic tang against his cheek',
    ],
    dedupRule: 'Both the SCENT NOUN AND the LOCATION (helmet / suit / glove / visor). Vary one.',
  }),
  sound: buildChannel({
    contextLabel: 'EXPLORER-MALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'sound',
    channelDesc: 'Suit-mechanism sounds + his organic body sounds inside the helmet.',
    examples: [
      'his suit-pump cycling rhythmically at his back',
      'the deep bell-tone of his airlock release',
      'his breathing rasping against the helmet mic',
      'his magnetic boots clamping to the deck',
      'his radio chirp through the cabin static',
    ],
    dedupRule: 'Both the SOURCE AND the QUALITY. Vary one.',
  }),
  touch: buildChannel({
    contextLabel: 'EXPLORER-MALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'touch',
    channelDesc:
      'His organic skin + his gloved hands in contact with EVA suit + alien environment.',
    examples: [
      'alien rock cool against his suited palm',
      'thermal undersuit warm at his ribs',
      'his rifle stock heavy in his glove',
      'his oxygen tube tugging at his collar',
      'frost forming on the inside of his visor near his beard',
    ],
    dedupRule: 'Both the BODY PART AND the SENSATION VERB. Vary one.',
  }),
  temperature: buildChannel({
    contextLabel: 'EXPLORER-MALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'temperature',
    channelDesc: 'Thermal cues — vacuum-cold, twin-sun heat, helmet-warm.',
    examples: [
      'vacuum-cold biting through his suit at the wrist seam',
      'engine-room heat pressing the back of his suit',
      'twin-sun warmth cooking one side of his helmet',
      'his breath warming the helmet around his beard',
      'frost climbing his glove from the handhold',
    ],
    dedupRule: 'Both the THERMAL SOURCE AND the SUIT-PART/BODY-PART. Vary one.',
  }),
  weight: buildChannel({
    contextLabel: 'EXPLORER-MALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'weight',
    channelDesc: 'Suit / gear / tools weighing on his body. Low-G occasionally.',
    examples: [
      'EVA pack pulling at his shoulder rig',
      'his rifle slung heavy across his suited back',
      'low-G making his tool-belt feel weightless at his hip',
      'his oxygen tank dragging at his lower back',
      'magnetic boots clamping his stance to the deck',
    ],
    dedupRule: 'Both the OBJECT AND the BODY PART. Vary one.',
  }),
  air: buildChannel({
    contextLabel: 'EXPLORER-MALE',
    contextNote: EXPLORER_NOTE,
    channelName: 'air',
    channelDesc: 'Atmospheric cues — breath cloud / spore / plasma vent / alien dust.',
    examples: [
      'his breath fogging his visor in zero-G',
      'rocket-exhaust haze drifting past his shoulder',
      'alien-spore drift past his outstretched glove',
      'plasma vent steam past his side',
      'sand-storm particulate clinging to his suit seams',
    ],
    dedupRule: 'Both the PARTICLE/MEDIUM AND the MOTION VERB. Vary one.',
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for StarBot's EXPLORER-MALE context.

EXAMPLES (DO NOT REUSE):
- "Mars-amber sun-glow on his helmet visor"
- "plasma-cyan key cutting across his suited torso"
- "Bonestell sun-amber lighting his crouched figure"
- "void-violet rim sculpting his EVA pack"
- "JWST teal-magenta wash through his visor reflection"

━━━ COLOR FAMILIES + SPREAD ━━━
Same as explorer-female: PLASMA-CYAN (8-10), MARS-AMBER (12-14), FEL-VIOLET (8-10), Bonestell sun-amber (10-12), JWST teal-magenta (8-10), interstellar-white (8-10), polar-aurora green-magenta (6-8), ion-blue (4-6).

━━━ DIRECTION SPREAD ━━━
key (12-14), rim (12-14), shaft (10-12), backlight (8-10), sidelight (6-8).

━━━ HARD RULES ━━━
- 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (his suited body or visor)
- Aesthetic: NASA-cinematic / Bonestell / Interstellar / hard-sci-fi exploration

━━━ DEDUP ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// ROBOT — robot-moment path (purely mechanical, NO ORGANIC)
// ─────────────────────────────────────────────────────────────

const robot = {
  smell: buildChannel({
    contextLabel: 'ROBOT',
    contextNote: ROBOT_NOTE,
    channelName: 'smell',
    channelDesc: 'Mechanical smells — coolant, ozone, hydraulic fluid.',
    examples: [
      'fresh hydraulic fluid weeping from a chest-plate seam',
      'burnt coolant from an overheated processor stack',
      'ozone curling around an exposed power conduit',
      'machine-oil clinging to a freshly-replaced servo joint',
      'plasma-discharge ozone drifting from its weapon barrel',
    ],
    dedupRule: 'Both the SCENT NOUN AND the MECHANICAL LOCATION. Vary one.',
    absoluteRule: ABSOLUTE_NO_HUMANS,
  }),
  sound: buildChannel({
    contextLabel: 'ROBOT',
    contextNote: ROBOT_NOTE,
    channelName: 'sound',
    channelDesc: 'Servo / hydraulic / coolant / magnetic-boot sounds. Pure mechanical.',
    examples: [
      'servo whine descending an octave as it powers down',
      'magnetic boots clamping to the deck',
      'low coolant pump cycling beneath the chest plate',
      'hydraulic hiss venting from its shoulder rig',
      'a low gear-grind in its rotating torso',
    ],
    dedupRule: 'Both the SOURCE AND the QUALITY. Vary one.',
    absoluteRule: ABSOLUTE_NO_HUMANS,
  }),
  touch: buildChannel({
    contextLabel: 'ROBOT',
    contextNote: ROBOT_NOTE,
    channelName: 'touch',
    channelDesc:
      'Robot exterior in contact with environment — chrome, carbon-fiber, ceramic plate.',
    examples: [
      'carbon-fiber gauntlet scraping the bulkhead',
      'magnetic grip plate latching onto a steel rail',
      'exposed wiring brushing the inside of an open chest hatch',
      'its chrome forearm grinding past a doorway',
      'cooling-vent grille catching a falling spark',
    ],
    dedupRule: 'Both the MATERIAL AND the SURFACE/SENSATION. Vary one.',
    absoluteRule: ABSOLUTE_NO_HUMANS,
  }),
  temperature: buildChannel({
    contextLabel: 'ROBOT',
    contextNote: ROBOT_NOTE,
    channelName: 'temperature',
    channelDesc: 'Thermal cues from its reactor / cooling / chassis.',
    examples: [
      'reactor radiating engine-room heat into the corridor',
      'frost climbing the chassis from a hull breach',
      'cooling fans pushing icy air through the torso vent',
      'overheated processor stack glowing dull red',
      'its chest-plate cool to the touch in standby',
    ],
    dedupRule: 'Both the THERMAL SOURCE AND the LOCATION. Vary one.',
    absoluteRule: ABSOLUTE_NO_HUMANS,
  }),
  weight: buildChannel({
    contextLabel: 'ROBOT',
    contextNote: ROBOT_NOTE,
    channelName: 'weight',
    channelDesc: 'Heavy mechanical body weight on the deck / surfaces / cable.',
    examples: [
      'armored frame settling onto a reinforced deck plate',
      'battery pack pulling its torso forward as it walks',
      'shoulder-mounted rotary cannon dragging its frame to one side',
      'its weight cracking the floor tiles beneath its boots',
      'a mooring cable straining as it leans forward',
    ],
    dedupRule: 'Both the OBJECT/PART AND the SURFACE/MOTION. Vary one.',
    absoluteRule: ABSOLUTE_NO_HUMANS,
  }),
  air: buildChannel({
    contextLabel: 'ROBOT',
    contextNote: ROBOT_NOTE,
    channelName: 'air',
    channelDesc: 'Steam / sparks / exhaust / ionized particles around the robot.',
    examples: [
      'steam venting from neck pistons as it turns',
      'ionized particles dancing around its damaged power core',
      'engine exhaust fogging the corridor behind its boots',
      'sparks raining from its shoulder weld',
      'plasma-flicker drifting around its drawn rifle',
    ],
    dedupRule: 'Both the PARTICLE/MEDIUM AND the MOTION/LOCATION. Vary one.',
    absoluteRule: ABSOLUTE_NO_HUMANS,
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for StarBot's ROBOT context. Lighting on the purely-mechanical robot body.

EXAMPLES (DO NOT REUSE):
- "amber emergency strobe flashing across its chassis"
- "cyan reactor underlight glowing through its torso vents"
- "plasma-violet rim along its servo-armored back"
- "fel-green LED array pulsing at its temple"
- "Mars-red emergency wash flooding its frame"

━━━ COLOR FAMILIES + SPREAD ━━━
PLASMA-CYAN (10-12), MARS-AMBER (10-12), FEL-VIOLET (10-12), VOID-PURPLE (8-10), ION-BLUE (8-10), reactor-orange (8-10), ozone-green (6-8), interstellar-white (4-6), Mars-red strobe (4-6), JWST teal-magenta (4-6).

━━━ DIRECTION SPREAD ━━━
key (8-10), rim (10-12), underlight (14-16 — its glowing reactor / vents / LED), strobe (8-10), backlight (4-6), shaft (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (chassis / vent / armor plate / LED)
- Aesthetic: cyberpunk / industrial sci-fi / mech
- ${ABSOLUTE_NO_HUMANS}

━━━ DEDUP ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// SCENE — cosmic-vista / alien-landscape / megastructure / etc. (9 paths)
// ─────────────────────────────────────────────────────────────

const scene = {
  smell: buildChannel({
    contextLabel: 'SCENE',
    contextNote: 'Pure environment, no figures.',
    channelName: 'smell',
    channelDesc:
      'Smells in the empty sci-fi environment — corridor air, megastructure ozone, alien biome.',
    examples: [
      "ionized hydrogen lingering in the corridor's recycled air",
      'ozone from a freshly powered-up megastructure conduit',
      'alien moss releasing its volatile bloom-scent',
      'metallic tang of decommissioned hull plating',
      'acidic spore-cloud drifting from the alien jungle',
    ],
    dedupRule: 'Both the SCENT NOUN AND the LOCATION. Vary one.',
  }),
  sound: buildChannel({
    contextLabel: 'SCENE',
    contextNote: 'Pure environment.',
    channelName: 'sound',
    channelDesc: 'Environmental sounds — ship hum, alien wind, megastructure rotation.',
    examples: [
      'deep magnetic hum of a Dyson swarm rotating overhead',
      'wind howling across the open canyon of an alien biome',
      'atmospheric pressure venting in the abandoned cargo bay',
      'reactor hum carrying through the empty corridors',
      'a distant comm-buoy chirping in the vacuum',
    ],
    dedupRule: 'Both the SOURCE AND the QUALITY. Vary one.',
  }),
  touch: buildChannel({
    contextLabel: 'SCENE',
    contextNote: 'Pure environment.',
    channelName: 'touch',
    channelDesc: 'Environmental texture — ice on hull, dust on deck, vines on reactor.',
    examples: [
      'rain of microscopic ice crystals tapping the hull',
      'vines of carbon-fiber creeping over an old reactor casing',
      'static electricity raising the dust along the deck plate',
      'frost crystallizing along the airlock seal',
      'lichen-equivalent creeping across an abandoned hull',
    ],
    dedupRule: 'Both the TEXTURE/MEDIUM AND the SURFACE. Vary one.',
  }),
  temperature: buildChannel({
    contextLabel: 'SCENE',
    contextNote: 'Pure environment.',
    channelName: 'temperature',
    channelDesc: 'Thermal cues in the environment — reactor / vacuum / twin-sun.',
    examples: [
      'engine-room heat radiating into the empty bridge',
      'absolute-zero shadow pooling on the dark side of the ringworld',
      'thermal updraft from a volcanic exoplanet face',
      'hot-spring steam fogging the alien biome ridge',
      'cold of vacuum pressing against the dome glass',
    ],
    dedupRule: 'Both the THERMAL SOURCE AND the LOCATION. Vary one.',
  }),
  weight: buildChannel({
    contextLabel: 'SCENE',
    contextNote: 'Pure environment.',
    channelName: 'weight',
    channelDesc:
      'Massive sci-fi structures implying weight — hull plating, freighter, observation tower.',
    examples: [
      'kilometer-thick hull plating casting deep shadow',
      'abandoned freighter sagging in low orbit',
      'century-old observation tower leaning in alien gravity',
      'megastructure spoke groaning under its own rotation',
      'fallen Dyson panel half-buried in alien dust',
    ],
    dedupRule: 'Both the STRUCTURE/OBJECT AND the WEIGHT VERB. Vary one.',
  }),
  air: buildChannel({
    contextLabel: 'SCENE',
    contextNote: 'Pure environment.',
    channelName: 'air',
    channelDesc: 'Atmospheric cues — nebula gas, atmospheric haze, plasma vapor.',
    examples: [
      "nebula gas curling slow between the megastructure's spokes",
      'atmospheric haze refracting twin-sun light across the dunes',
      'vapor steam ghosting across the plasma-coil rig',
      'space-dust drifting through the broken viewport',
      'alien-spore cloud swirling past the cargo door',
    ],
    dedupRule: 'Both the PARTICLE/MEDIUM AND the LOCATION. Vary one.',
  }),
  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for StarBot's SCENE context (cosmic vista / alien landscape / megastructure / sci-fi interior).

EXAMPLES (DO NOT REUSE):
- "plasma-cyan beam slicing across the cargo-bay floor"
- "twin-star amber wash flooding the reactor chamber"
- "fel-violet aurora shifting across the alien horizon"
- "Mars-red emergency wash bathing the bridge"
- "Bonestell sun-amber backlight cutting through cosmic dust"

━━━ COLOR FAMILIES + SPREAD ━━━
PLASMA-CYAN (10-12), MARS-AMBER (10-12), FEL-VIOLET (10-12), VOID-PURPLE (8-10), Bonestell sun-amber (8-10), JWST teal-magenta (8-10), interstellar-white (4-6), polar-aurora green-magenta (4-6), reactor-orange (6-8), blade-runner neon-pink (4-6), ion-blue strobe (4-6), ozone-green (4-6).

━━━ DIRECTION SPREAD ━━━
key (10-12), rim (10-12), shaft (12-14), wash (12-14), aurora-flicker (4-6), backlight (4-6), pool (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (sci-fi environmental feature)
- Aesthetic: Blade Runner / Dune / Interstellar / Moebius / megastructure-scale

━━━ DEDUP ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = {
  'cyborg-female': cyborg_female,
  'cyborg-male': cyborg_male,
  'explorer-female': explorer_female,
  'explorer-male': explorer_male,
  robot,
  scene,
};

module.exports = { metaPrompts };
