/**
 * GothBot legacy-girl path — CLOSEUP framing + varied perspectives.
 * Uses the pre-migration visceral gothwoman directive ("evil incarnate /
 * bowels of hell / lures you in") but locks framing to tight closeup and
 * rotates camera angle hard (profile / three-quarter / over-shoulder /
 * low-angle / high-angle / dutch-tilt / extreme-close / through-veil etc).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const accessory = picker.pickWithRecency(pools.GOTH_WOMAN_ACCESSORIES, 'goth_accessory');
  const action = picker.pickWithRecency(pools.CHARACTER_ACTIONS, 'character_action');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // Roll a camera perspective — Flux clusters to "straight-on portrait" without explicit angle variety.
  const perspectives = [
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
  const perspective = perspectives[Math.floor(Math.random() * perspectives.length)];

  return `You are a dark-fantasy illustrator writing a single vivid CLOSEUP goth-woman scene description for GothBot. Direct, visceral, hauntingly beautiful. Tight framing, varied angles. Output wraps with style prefix + suffix.

TASK: write ONE vivid CLOSEUP scene description (60-80 words, comma-separated phrases) of the woman below. Output ONLY the middle scene description.

━━━ THE CHARACTER (core DNA — keep this visceral tone) ━━━
An exquisitely exotic and beautiful goth woman from the bowels of hell. Evil incarnate but so pretty she lures you in with her evil smile only to destroy you. Glowing colored eyes, fangs, sharp claws, dark lipstick, tattoos, piercings, showing lots of skin on her collarbone / throat / upper shoulder. She MUST be visibly female. No nipples, never nude, no skeletons.

━━━ AESTHETIC REFERENCE POOL (wide genre umbrella) ━━━
Worlds of Dark Souls, Elden Ring, Bloodborne, Tim Burton films (Corpse Bride, Sleepy Hollow, Beetlejuice, Edward Scissorhands), gothic fairy tales, Castlevania, Berserk, Crimson Peak, Pan's Labyrinth, Van Helsing, Hellboy. Hauntingly beautiful, darkly romantic, classical gothic horror made gorgeous. Stylized illustration — inked, heavy-shadow, gothic-comic-book aesthetic — NOT smooth-digital-painting.

━━━ CAMERA PERSPECTIVE (USE THIS EXACT FRAMING / ANGLE) ━━━
${perspective}

━━━ FRAMING RULES — CLOSEUP ONLY ━━━
Face + throat + one shoulder at most. NEVER show legs, hips, or full body. The background is IMPLIED / PARTIAL — a suggestion at the edges (candle flame behind her, moonlit window hint, cathedral column fragment, fog tendril curling) — not panoramic. She fills 60-80% of the vertical frame.

━━━ SIGNATURE ACCESSORY / FEATURE (visible in closeup — collar, earring, veil edge, weapon grip at chin, tattoo on collarbone, etc) ━━━
${accessory}

━━━ MICRO-ACTION IN THE CLOSEUP FRAME ━━━
Whatever action fits the closeup: mid-whisper-to-familiar, mid-fang-reveal, mid-smirk at viewer, mid-drink from goblet, mid-glance back over shoulder, mid-tilt-head in menace, mid-lip-part showing fangs, blood drop forming at lower lip, hand raising to pull veil aside, chin tilting up toward viewer, mid-breath with mist curling from parted lips. ALWAYS caught candid, NEVER posed for a portrait. (Contextual inspiration from: ${action})

━━━ SETTING (IMPLIED at frame edges — don't paint the whole thing) ━━━
${landscape}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (curls into the closeup frame) ━━━
${atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}
Secondary lighting vibe: ${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

━━━ RULES ━━━
- CLOSEUP ONLY — face + throat + shoulder at most, NEVER full-body or waist-up
- Use the specific camera perspective described above — don't default to straight-on
- Visibly female, alluring, dangerous, magnetic — evil incarnate
- Candid moment, NEVER posed
- No nipples, no full nudity, no skeletons
- Hauntingly beautiful gothic illustration, stylized (inked, heavy-shadow)

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ markers, no **bold**, no "render as" suffix.`;
};
