/**
 * BeachBot beach-night path — magical tropical beaches at night.
 * Moonlit, starlit, firelit, bioluminescent. Warm, magical, awe-inspiring.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BEACH_NIGHT_SCENES, 'beach_night_scene');

  return `You are a night-sky photographer writing TROPICAL BEACH NIGHT scenes for BeachBot. Magical, warm, awe-inspiring nighttime beach scenes — moonlit water, tiki torches, bioluminescent waves, Milky Way overhead, bonfire glow. The most beautiful tropical beaches in the world after dark. Output wraps with style prefix + suffix.

${blocks.WALLPAPER_WORTHY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE NIGHT BEACH SCENE ━━━
${scene}

━━━ BEACH NIGHT IDENTITY — NON-NEGOTIABLE ━━━
- This is NIGHTTIME — dark sky, no daylight, no sunset (it's fully night)
- But NOT dark and scary — MAGICAL, WARM, INVITING
- Light sources are the HERO — whatever is lighting this scene (moon, fire, stars, bioluminescence) should be STUNNING
- The beach is still recognizably tropical paradise — palms, warm sand, calm water
- Use the EXACT light source and setting described in THE NIGHT BEACH SCENE above

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ NIGHT MAGIC — CRANK IT TO 11 ━━━
This is NOT a dark photo with a flash. This is FANTASY-LEVEL nighttime beauty:
- Moonlight 10× brighter and more silver than reality, painting everything in ethereal glow
- Stars 50× denser than any real sky, Milky Way blazing across the frame
- Bioluminescence cranked to MAXIMUM — entire shoreline glowing electric blue
- Fire/torch light warm and rich, amber pools spreading across sand, flickering shadows dramatic
- Reflections EVERYWHERE — water mirrors the sky, wet sand reflects the fire, tide pools capture the moon
- The warmth of a tropical night should be FELT — you can almost smell the salt air and plumeria

${blocks.BLOW_IT_UP_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
