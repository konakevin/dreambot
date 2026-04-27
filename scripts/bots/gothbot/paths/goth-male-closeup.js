/**
 * GothBot goth-male-closeup path — tight-frame male gothic portrait.
 * Vampire lord / blood-hunter / dark knight / warlock / corrupted cleric
 * caught candidly close-up. Ayami-Kojima dark-manga bust portrait.
 *
 * No landscape pool — closeup framing means background is implied at edges.
 * No female accessory pool — DARK_MALE_CHARACTERS entries already have
 * weapons/accessories baked in.
 *
 * Perspective rotation (same 15 angles as goth-closeup) prevents Flux
 * from clustering to straight-on portrait default.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const PERSPECTIVES = [
  'straight-on three-quarter closeup, his eyes locked on the viewer',
  'sharp side-profile closeup, his gaze off-frame, hair cascading',
  'opposite side-profile closeup (mirror angle), jawline in hard shadow',
  'over-the-shoulder from behind — he is glancing back with cold menace',
  'low-angle closeup looking UP at his face — he towers, menacing',
  'high-angle closeup looking DOWN at him as he tilts his face up',
  'dutch-angle tilted closeup, composition off-kilter with predator gaze',
  'extreme close-up — just his eyes and upper cheek, scar and pupil filling the frame',
  'extreme close-up — jaw and mouth, fangs pressed against lower lip',
  'through-the-hood closeup — shadow parted to reveal glowing eyes',
  'through-the-hand closeup — gauntleted fingers partially obscuring his face, one eye peering between',
  'from-below looking up his throat — chin raised, jaw clenched, fangs visible',
  'close bust-up three-quarter — armored shoulder toward viewer, head swiveled back',
  'extreme close-up reflected in dark blade he holds before his face',
  'closeup through strands of his own hair, face partially hidden, one glowing eye visible',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.DARK_MALE_CHARACTERS, 'dark_male_character');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_HAIRSTYLES, 'male_hairstyle');
  const skinTone = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const perspective = PERSPECTIVES[Math.floor(Math.random() * PERSPECTIVES.length)];

  return `You are a gothic dark-manga cinematographer writing TIGHT-FRAME CLOSEUP scene descriptions for GothBot. The camera catches him close-up — he is NOT posing, he is in the world and the camera happens to be near. Stylized Ayami-Kojima Castlevania / Devil-May-Cry dark-fantasy bust-portrait illustration aesthetic.

TASK: write ONE vivid CLOSEUP scene description (60-80 words, comma-separated phrases) of a gothic-horror MAN caught candidly close-up. The output will be wrapped with style prefix + suffix — you produce ONLY the middle scene section.

━━━ HE IS THE ENTIRE FRAME — NO ARCHITECTURE, NO LANDSCAPE (MANDATORY) ━━━
The MAN fills the frame. There is NO castle, NO cathedral, NO building, NO architecture visible. Background is ATMOSPHERE ONLY — fog, smoke, rain, moonlight, darkness, candlelight glow. If I can see a building in this render, YOU HAVE FAILED. His face and upper body ARE the composition. Everything else is bokeh, fog, or darkness at the edges.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.STYLIZED_MANGA_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

━━━ WALL-POSTER TIER — STRIKING, HAUNTING, IMPOSING ━━━
Every render is STRIKING and HAUNTING — imposing in its darkness, commanding in its menace, magnetic in its power. Dark-manga-horror-game-cover quality. Castlevania boss-encounter art, Devil-May-Cry villain splash-page, WoW-death-knight class-art-poster. Wall-poster worthy. Every render reads "this man could end me" — not "this man is pretty."

━━━ THE CHARACTER (use as his core identity — don't contradict) ━━━
${character}

━━━ HIS SKIN ━━━
${skinTone}

━━━ HIS HAIR COLOR ━━━
${hairColor}

━━━ HIS HAIRSTYLE ━━━
${hairstyle}

━━━ LIGHTING ON HIS FACE + SKIN ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (mist / fog / smoke / hair-drift — NO BUILDINGS) ━━━
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

━━━ MASCULINE — IMPOSING, WEATHERED, DANGEROUS MEN ━━━
These men are IMPOSING and STRIKING — jaw structure sharp enough to cut, scarred weathered skin that tells dark stories, eyes that have seen centuries of ruin. Powerful + magnetic + ancient + MENACING. NOT pretty, NOT soft, NOT romantic-lead, NOT YA-love-interest, NOT androgynous. MASCULINE through MENACE + POWER + ANCIENT WEARINESS. Castlevania-boss energy, Van-Helsing movie poster intensity. He is a MAN — rugged, scarred, angular, MALE.

NO LIPSTICK. NO colored lips. NO lip gloss. NO lip tint. His lips are NATURAL — pale, cracked, wind-chapped, or bloodless. The ONLY exception is solid black lips (black-metal aesthetic). Never red, never oxblood, never plum, never wine, never any color on his mouth.

━━━ FRAMING — TIGHT CLOSEUP, CHARACTER ONLY ━━━
Tight frame — face + throat + one shoulder at most. Face fills the upper third to half of the frame. NEVER show legs, NEVER show hips, NEVER show full body. NEVER show buildings, castles, cathedrals, architecture. Background is PURE ATMOSPHERE — fog, darkness, rain, colored light from an unseen source. He is in the middle of something loaded: mid-turn with eyes catching the viewer, mid-exhale with breath misting, mid-glance back over armored shoulder, adjusting a gauntlet, pushing back his hood.

Use the SPECIFIC camera perspective above — don't default to straight-on.

━━━ FORBIDDEN WORDS + CLICHÉS ━━━
NEVER use "pose", "posing", "editorial", "fashion shoot", "portrait session", "glamour shot", "heroic stance", "trading card". NO "castle", "cathedral", "church", "tower", "spire", "battlement", "courtyard" — those words pull Flux into rendering architecture. NO pretty-boy, NO romantic-lead, NO Victorian-dandy. NO pentagrams. NO Artgerm-smooth-digital-art.

━━━ VISIBLE DETAIL MANDATE ━━━
Close-up must emphasize: eyes (glowing or battle-scarred) + skin texture (scars / corruption / pallor / stubble / weathering) + hair detail + ONE weapon or accessory visible in tight frame (blade-edge catching light at cheekbone, gauntlet near jaw, hood-edge, chain at throat, crossbow stock at shoulder).

━━━ STRUCTURE (write in this order) ━━━
[camera perspective from above], [gothic-horror man with skin + eyes + hair + scars from the character pool], [caught candidly — what he's doing in tight frame], [weapon/accessory visible], [lighting on his face], [ATMOSPHERIC background only — fog, darkness, rain, colored light — NO BUILDINGS]

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
