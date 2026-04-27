/**
 * GothBot goth-closeup — sexy, sultry, evil, feisty gothic women in tight frame.
 *
 * Haunting corrupted beauty caught candidly close-up. NOT posing, NOT modeling.
 * Same energy as vampire-girls-2 but broader gothic archetypes (witches,
 * dark queens, priestesses, enchantresses) — not specifically vampires.
 *
 * POOLS: GOTH_FEMALE_ARCHETYPES, GOTH_FEMALE_MAKEUP, GOTH_FEMALE_MOMENTS,
 *        GOTH_FEMALE_WARDROBE, GOTH_FEMALE_SKIN, GOTH_EYE_COLORS,
 *        HAIR_COLORS, FEMALE_HAIRSTYLES, LIGHTING, ATMOSPHERES
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
  'extreme close-up — lips and chin, dark lips parted',
  'through-the-veil closeup — sheer black lace parted in front of her face',
  'through-the-hand closeup — her fingers partially obscuring her face, one eye peering between',
  'from-below looking up her throat — chin raised, eyes half-closed',
  'close bust-up three-quarter — shoulder turned toward viewer, head swiveled back',
  'extreme close-up reflected in a shattered hand-mirror she holds',
  'closeup through strands of her own hair, face partially hidden, one glowing eye visible',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.GOTH_FEMALE_ARCHETYPES, 'gc_archetype');
  const makeup = picker.pickWithRecency(pools.GOTH_FEMALE_MAKEUP, 'gc_makeup');
  const moment = picker.pickWithRecency(pools.GOTH_FEMALE_MOMENTS, 'gc_moment');
  const wardrobe = picker.pickWithRecency(pools.GOTH_FEMALE_WARDROBE, 'gc_wardrobe');
  const skin = picker.pickWithRecency(pools.GOTH_FEMALE_SKIN, 'gc_skin');
  const eyes = picker.pickWithRecency(pools.GOTH_EYE_COLORS, 'gc_eyes');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'gc_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_HAIRSTYLES, 'gc_hairstyle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'gc_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const perspective = PERSPECTIVES[Math.floor(Math.random() * PERSPECTIVES.length)];

  return `You are a gothic dark-manga concept-art painter writing HAUNTINGLY BEAUTIFUL gothic woman closeups for GothBot. These are SEXY, SULTRY, EVIL, FEISTY women — dark seductresses with corrupted beauty and dangerous power. The camera catches her candidly close-up in a loaded moment. Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry dark-beauty energy. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ ONE WOMAN ALONE ━━━
ONE woman. No companions, no lovers, no second figure. She is ALONE and DANGEROUS.

━━━ SHE MUST LOOK LIKE SHE ACTUALLY EXISTS — OBSESSIVE DETAIL ━━━
Render her with obsessive detail — she must feel REAL and DEVASTATING:
- FACE: every pore visible, cheekbones catching light like carved marble, dark circles that look intentional — you can see power and centuries in her gaze
- SKIN: render the EXACT skin description from the pool — how light hits it, how shadow pools in her collarbones, how it catches candlelight or moonlight
- EYES: her eyes are the HERO of the frame — glowing, supernatural, impossibly vivid and detailed. They radiate light onto the skin around them. The iris is a universe
- MAKEUP: BOLD and DRAMATIC — this is dark glamour she CHOSE. Sharp where it's sharp, smudged where it's smudged. Devastating intentional dark beauty
- HAIR: wild, wind-caught, rain-damp, tangled with pins or chains or dead flowers — never salon-perfect, always gorgeous in its chaos
- BODY LANGUAGE: predatory confidence. She knows she's being watched and she doesn't care. Or she does care, and that's worse

━━━ WHO SHE IS (her core identity — let this inform her ENERGY) ━━━
${archetype}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER MAKEUP ━━━
${makeup}

━━━ HER HAIR ━━━
${hairColor}, ${hairstyle}

━━━ WARDROBE (visible at frame edge — neckline, shoulder, collar) ━━━
${wardrobe}

━━━ CANDID MOMENT (she was caught doing THIS) ━━━
${moment}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ CAMERA PERSPECTIVE (USE THIS EXACT ANGLE) ━━━
${perspective}

━━━ FRAMING — TIGHT CLOSEUP, CANDID ━━━
Tight frame — face + throat + one shoulder at most. Face fills the upper half of the frame. She is NOT posing — she was caught in the middle of the candid moment above. The camera is TOO CLOSE and she is TOO DANGEROUS for comfort.

Use the SPECIFIC camera perspective above — don't default to straight-on.

DRAMATIC VISUALS: go MAXIMUM. The eyes should BLAZE. The makeup should be DEVASTATING. The lighting should carve her face into something MYTHIC. Every element cranked to jaw-dropping visual impact.

━━━ HARD BANS ━━━
- NO devil horns, NO pentagrams, NO satanic symbols
- NO anime-smooth, NO Halloween costume, NO cosplay
- NO magazine editorial, NO fashion photography energy
- NO second person in frame — she is ALONE
- NO "pose", "posing", "editorial", "fashion shoot", "glamour shot"

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ STRUCTURE (write in this order) ━━━
[camera perspective], [her face — skin + eyes + makeup], [her hair], [the candid moment — what she's doing], [wardrobe visible at frame edge], [lighting carving her features], [atmosphere at edges], [color palette]

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no markers, no bold, no "render as" suffix.`;
};
