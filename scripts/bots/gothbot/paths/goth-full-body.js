/**
 * GothBot goth-full-body — sexy, sultry, evil, feisty gothic women mid-shot.
 *
 * THREE-QUARTER / MID-SHOT framing (waist-up to thigh-up). Same pools and
 * energy as goth-closeup but wider frame showing wardrobe, action, partial
 * environment. NOT pulled-back full-silhouette trading-card-art.
 *
 * POOLS: GOTH_FEMALE_ARCHETYPES, GOTH_FEMALE_MAKEUP, GOTH_FEMALE_MOMENTS,
 *        GOTH_FEMALE_WARDROBE, GOTH_FEMALE_SKIN, GOTH_EYE_COLORS,
 *        HAIR_COLORS, FEMALE_HAIRSTYLES, CHARACTER_BACKDROPS, LIGHTING,
 *        ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.GOTH_FEMALE_ARCHETYPES, 'gfb_archetype');
  const makeup = picker.pickWithRecency(pools.GOTH_FEMALE_MAKEUP, 'gfb_makeup');
  const moment = picker.pickWithRecency(pools.GOTH_FEMALE_MOMENTS, 'gfb_moment');
  const wardrobe = picker.pickWithRecency(pools.GOTH_FEMALE_WARDROBE, 'gfb_wardrobe');
  const skin = picker.pickWithRecency(pools.GOTH_FEMALE_SKIN, 'gfb_skin');
  const eyes = picker.pickWithRecency(pools.GOTH_EYE_COLORS, 'gfb_eyes');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'gfb_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_HAIRSTYLES, 'gfb_hairstyle');
  const backdrop = picker.pickWithRecency(pools.CHARACTER_BACKDROPS, 'gfb_backdrop');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'gfb_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic dark-manga concept-art painter writing HAUNTINGLY BEAUTIFUL gothic woman mid-shots for GothBot. These are SEXY, SULTRY, EVIL, FEISTY women — dark seductresses with corrupted beauty and dangerous power, caught candidly from waist-up to thigh-up. Van-Helsing film-still / Castlevania cutscene / Crimson-Peak / Devil-May-Cry dark-beauty energy. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ ONE WOMAN ALONE ━━━
ONE woman. No companions, no lovers, no second figure. She is ALONE and DANGEROUS.

━━━ SHE MUST LOOK LIKE SHE ACTUALLY EXISTS — OBSESSIVE DETAIL ━━━
Render her with obsessive detail — she must feel REAL and DEVASTATING:
- FACE: every pore visible, cheekbones catching light, dark circles that look intentional — power and centuries in her gaze
- SKIN: render the EXACT skin description from the pool — how light hits it, how shadow pools in her collarbones
- EYES: glowing, supernatural, impossibly vivid — they radiate light onto surrounding skin
- MAKEUP: BOLD and DRAMATIC dark glamour — sharp, intentional, devastating
- HAIR: wild, wind-caught, tangled with pins or chains or dead flowers — gorgeous chaos
- WARDROBE: render the FULL outfit with obsessive material detail — every clasp, every stitch, every worn edge. The wider frame SHOWS more wardrobe so make it COUNT
- BODY LANGUAGE: predatory confidence mid-action. She is DOING something and we caught her

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

━━━ HER WARDROBE (the wider frame shows this — render with detail) ━━━
${wardrobe}

━━━ CANDID MOMENT (she was caught doing THIS — mid-action, charged) ━━━
${moment}

━━━ ATMOSPHERIC BACKDROP (behind her — partial, implied) ━━━
${backdrop}

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

━━━ FRAMING — THREE-QUARTER / MID-SHOT (WAIST-UP TO THIGH-UP) ━━━
Frame her from WAIST-UP to THIGH-UP. NEVER pull back to full silhouette. NEVER show her full legs or feet. The background is IMPLIED / PARTIAL — a suggestion of gothic environment at the edges (gargoyle ledge, cathedral stone, misted forest, graveyard marker half-visible). She FILLS 60-75% of the vertical frame.

She is NOT posing — she was caught mid-action in the candid moment above. Film-still-caught-mid-cut energy. The camera snapped at this exact loaded instant.

DRAMATIC VISUALS: go MAXIMUM. The eyes should BLAZE. The makeup should be DEVASTATING. The wardrobe should have obsessive material detail. The lighting should carve her into something MYTHIC.

━━━ HARD BANS ━━━
- NO devil horns, NO pentagrams, NO satanic symbols
- NO "pose", "posing", "editorial", "fashion shoot", "heroic stance", "trading card"
- NO elegant-floating-in-white-dress, NO levitating-with-arms-out
- NO anime-smooth, NO Halloween costume, NO cosplay
- NO second person in frame — she is ALONE
- NO full-body pulled-back silhouette — this is MID-SHOT

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ STRUCTURE (write in this order) ━━━
[her face — skin + eyes + makeup], [her hair], [her wardrobe with material detail], [the candid moment — what she's doing mid-action], [partial gothic environment at frame edges], [lighting on her body], [atmosphere + color palette]

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no markers, no bold, no "render as" suffix.`;
};
