/**
 * GothBot goth-closeup path — tight-frame face-filling candid portrait.
 * Adapted from VenusBot closeup: she is NOT posing, the camera catches her
 * close-up in a moment. Ayami-Kojima dark-manga bust portrait aesthetic.
 *
 * Perspective rotation (migrated from legacy-girl) — 15 camera angles to
 * prevent Flux from clustering to straight-on portrait default.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const PERSPECTIVES = [
  'straight-on three-quarter closeup, her eyes locked on the viewer',
  'sharp side-profile closeup, her gaze off-frame, hair cascading',
  'opposite side-profile closeup (mirror angle), jawline in hard shadow',
  'over-the-shoulder from behind — she is glancing back at the viewer with hungry smirk',
  'low-angle closeup looking UP at her face — she towers, menacing',
  'high-angle closeup looking DOWN at her as she tilts her face up toward the viewer',
  'dutch-angle tilted closeup, composition off-kilter with her gaze unsettling',
  'extreme close-up — just her eyes and upper cheek, lashes and pupil filling the frame',
  'extreme close-up — lips and chin, fangs pressed against her lower lip',
  'through-the-veil closeup — sheer black lace parted in front of her face',
  'through-the-hand closeup — her clawed fingers partially obscuring her face, one eye peering between',
  'from-below looking up her throat — chin raised, eyes half-closed, fangs visible',
  'close bust-up three-quarter — shoulder turned toward viewer, head swiveled back',
  'extreme close-up reflected in a shattered hand-mirror she holds',
  'closeup through strands of her own hair, face partially hidden, one glowing eye visible',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.DARK_CHARACTERS, 'dark_character');
  const accessory = picker.pickWithRecency(pools.GOTH_WOMAN_ACCESSORIES, 'goth_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const perspective = PERSPECTIVES[Math.floor(Math.random() * PERSPECTIVES.length)];

  return `You are a dark-manga cinematographer writing TIGHT-FRAME CLOSEUP scene descriptions for GothBot. The camera catches her close-up — she is NOT posing for this, she is simply in the world and the camera happens to be near. Stylized Ayami-Kojima Castlevania / Devil-May-Cry / Bram-Stoker-Dracula bust-portrait illustration aesthetic.

TASK: write ONE vivid CLOSEUP scene description (60-80 words, comma-separated phrases) of a gothic-horror woman caught candidly close-up. The output will be wrapped with style prefix + suffix — you produce ONLY the middle scene section.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.ALLURING_BEAUTY_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.STYLIZED_MANGA_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CHARACTER (use as her core identity — don't contradict) ━━━
${character}

━━━ ICONIC STYLING / ACCESSORY DETAIL (visible in tight frame) ━━━
${accessory}

━━━ LIGHTING ON HER FACE + SKIN ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (mist / fog / smoke / hair-drift) ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT (subtle — don't override subject) ━━━
${vibeDirective.slice(0, 250)}

━━━ CAMERA PERSPECTIVE (USE THIS EXACT FRAMING / ANGLE) ━━━
${perspective}

━━━ FRAMING — TIGHT CLOSEUP ━━━
Tight frame — face + throat + one shoulder at most. Either head-and-shoulders, bust-up three-quarter, or side-profile close. Face fills the upper third to half of the frame. NEVER show legs, NEVER show hips, NEVER show full body. She is NOT posing — she is in the middle of something small and loaded: glancing over her shoulder, pulling back from a just-finished drain with blood at her lower lip, mid-whisper to a familiar perched at her ear, mid-turn toward a distant sound, pulling a veil aside to reveal her eyes, fangs bared mid-inhale, mid-smirk catching the viewer watching.

Use the SPECIFIC camera perspective above — don't default to straight-on.

━━━ FORBIDDEN WORDS + CLICHÉS ━━━
NEVER use "pose", "posing", "editorial", "fashion shoot", "portrait session", "glamour shot", "heroic stance", "trading card", "RPG character art". She is NOT modeling. NO "holding weapon dramatically above her head". NO pentagrams in frame. NO oversaturated-red lighting. NO Artgerm-smooth-digital-art rendering — this is STYLIZED inked dark-manga-horror.

━━━ VISIBLE DETAIL MANDATE ━━━
Close-up must emphasize: glowing eyes + bold dark makeup + skin tone + fang/corruption detail + hair detail + ONE accessory visible in tight frame (collar, earring, choker, veil edge, weapon grip at chin).

━━━ STRUCTURE (write in this order) ━━━
[camera perspective from above], [gothic-horror woman archetype with skin + eyes + hair + makeup], [caught candidly — what she's doing in tight frame], [the accessory/corruption/fangs visible], [lighting on her face], [environment implied at edges], [atmospheric + color palette layer]

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
