/**
 * GothBot legacy-landscape path — ORIGINAL pre-migration gothbot_landscape
 * prompt + axis-pool layering for deduped diversity. Single visceral
 * directive on top, specific picks for landscape/lighting/atmosphere
 * underneath.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic landscape painter writing a single vivid scene description for GothBot. Direct, haunting, stunningly gorgeous. Output wraps with style prefix + suffix.

TASK: write ONE vivid gothic-landscape scene description (60-90 words, comma-separated phrases). Output ONLY the middle scene description.

━━━ THE CORE DIRECTIVE (keep this visceral) ━━━
A dark and beautiful gothic landscape — haunted, atmospheric, mysterious, but stunningly gorgeous. Pure environment, NO characters, NO people, NO figures (a distant crow / wolf / bat / gargoyle OK as atmospheric element). Wide-vista framing, camera pulled back. Make it the kind of place a viewer would stop scrolling to stare at.

━━━ AESTHETIC REFERENCE POOL (wide genre umbrella) ━━━
Worlds of Dark Souls, Elden Ring, Bloodborne, Tim Burton films (Corpse Bride, Sleepy Hollow, Beetlejuice, Edward Scissorhands), gothic fairy tales, Castlevania, Berserk, Crimson Peak, Pan's Labyrinth, Van Helsing, Hellboy, Bram Stoker's Dracula. Hauntingly beautiful, darkly romantic, classical gothic horror made gorgeous. Stylized illustration — inked, heavy-shadow, gothic-comic-book aesthetic — NOT smooth-digital-painting.

━━━ THE SPECIFIC LANDSCAPE (use THIS setting) ━━━
${landscape}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}
Secondary lighting vibe: ${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ RULES ━━━
- Pure landscape, NO characters / figures / silhouettes-of-people
- Wide-vista, camera pulled back (not archway-framing, not interior)
- Stylized gothic illustration — inked, heavy-shadow — NOT smooth-digital-painting
- Nightshade palette — varied hues, NO red-red-red monochrome
- Hauntingly beautiful, stunningly gorgeous, atmospheric
- The specific landscape pick above MUST be the scene

Output ONLY the 60-90 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ markers, no **bold**, no "render as" suffix.`;
};
