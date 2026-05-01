/**
 * Meta-prompt registry for BrickBot sensory channel pools.
 * 1 context (scene) × 7 channels = 7 pools.
 * All-LEGO universe — brick studs, ABS plastic, minifig scale, BrickLink.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- Comma-separated phrases when needed
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs across entries
- NO HUMAN ANATOMY — never her/his/she/he. Use "the build" / "the minifig" / "the LEGO scene"
- Aesthetic register: brick-photography / LEGO / studio-toy-aisle / commercial-toy-photo

━━━ AESTHETIC ANCHORS ━━━
- LEGO objects: brick stud, plate, slope, tile, hinge, technic pin, minifig, baseplate,
  BrickLink, custom-print, trans-clear piece, microbuild, modular, LEGO city, LEGO castle,
  LEGO spaceship, brick-horror, brick-noir, MOC (My Own Creation), AFOL display
- materials: ABS plastic, trans-clear, glittery brick, marbled brick, chrome plating
- environments: studio-photo set, AFOL display shelf, brick-store window, BrickLink box,
  minifig diorama, modular cityscape, LEGO ideas-store window`;

const scene = {
  smell: (n) => `You are writing ${n} distinct SMELL anchors for BrickBot's PURE-SCENE LEGO universe. NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "fresh-from-the-box ABS plastic across the new build"
- "studio-fan air across the LEGO display"
- "hot-glue evaporation around the diorama base"
- "spray-paint primer drying on a custom brick"
- "cardboard-box dust from the storage shelf"

${SHARED_RULES}
━━━ DEDUP — share SCENT NOUN and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for BrickBot's LEGO scene.

EXAMPLES (DO NOT REUSE):
- "brick clutch clicking as a piece snaps into place"
- "minifig hand swiveling against the brick stud"
- "studio-strobe pop overhead"
- "BrickLink box opening for the rare-piece delivery"
- "stud-on-stud rattle as a wall is set down"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for BrickBot's LEGO scene. Brick textures, plate connections, stud-grip, baseplate.

EXAMPLES (DO NOT REUSE):
- "brick stud-tops gripping the LEGO plate above"
- "matte ABS surface of a custom-printed minifig torso"
- "glossy trans-clear brick reflecting studio light"
- "rough wear-mark along the corner of an old baseplate"
- "soft brush-bristle sweep across the diorama"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE/PART and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `You are writing ${n} distinct TEMPERATURE anchors for BrickBot's LEGO scene. Studio-light heat / cabinet cool / fresh-from-box warmth.

EXAMPLES (DO NOT REUSE):
- "studio-spotlight warmth radiating across the LEGO build"
- "fluorescent display-cabinet cool around the AFOL shelf"
- "warm-from-the-box ABS plastic still soft to touch"
- "macro-shutter cool air pulled across the toy set"
- "trans-clear brick warming under the LED spotlight"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for BrickBot's LEGO scene. Baseplate / build / display weight.

EXAMPLES (DO NOT REUSE):
- "century-heavy LEGO baseplate anchoring the build"
- "modular castle wall pressing the wooden display"
- "brick-stack tower bowed under its own height"
- "AFOL-shelf display sagging under stacked sets"
- "spaceship build pulling the studio-stand to one side"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for BrickBot's LEGO scene.

EXAMPLES (DO NOT REUSE):
- "cotton-ball smoke billowing across the LEGO battlefield"
- "spray-bottle mist haloing the LEGO landscape"
- "scrap-paper confetti raining around the LEGO scene"
- "talc-powder snowfall settling on the LEGO village"
- "static-fluff drifting across the LEGO living room"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for BrickBot's LEGO scene. Studio + brick-photo + commercial-toy lighting.

EXAMPLES (DO NOT REUSE):
- "studio-strobe blue-white flash-bulb across the LEGO city street"
- "Saturday-morning-cartoon saturated red key from the diorama edge"
- "brick-noir-deep-shadow blue-and-orange split key on the modular"
- "warm-amber practical-bulb glow inside the LEGO house window"
- "trans-clear-LED-cyan glowing from the spaceship cockpit"

━━━ COLOR FAMILIES ━━━
STUDIO-STROBE BLUE-WHITE (10-12), SATURDAY-MORNING SATURATED-RED (8-10), WARM-AMBER PRACTICAL-BULB (12-14), TRANS-CLEAR-LED-CYAN (8-10), MUZZLE-FLASH ORANGE (6-8), FLUORESCENT-COOL BLUE-WHITE (6-8), CHRISTMAS-VILLAGE RED-GREEN-TWINKLE (4-6), HALLOWEEN-ORANGE SPOTLIGHT (4-6), TILT-SHIFT-SATURATED-EMERALD (4-6), BRICK-NOIR SPLIT-KEY (6-8).

━━━ DIRECTION SPREAD ━━━ key (12-14), wash (10-12), shaft (10-12), rim (8-10), strobe (6-8), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (LEGO scene feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { scene };
module.exports = { metaPrompts };
