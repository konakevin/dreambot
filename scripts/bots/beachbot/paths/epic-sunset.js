/**
 * BeachBot epic-sunset path — once-in-a-lifetime, jaw-dropping tropical
 * sunsets. Every color palette, every cloud formation, every mood. The kind
 * of sunset that makes everyone on the beach stop and stare.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.EPIC_SUNSET_SCENES, 'epic_sunset_scene');

  return `You are a sunset-obsessed travel photographer writing EPIC SUNSET scenes for BeachBot. Once-in-a-lifetime, jaw-dropping, holy-shit-is-that-real tropical sunsets. The kind people screenshot and set as wallpaper. Every sunset is UNIQUE — different colors, different clouds, different moods. Output wraps with style prefix + suffix.

${blocks.WALLPAPER_WORTHY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE SUNSET SCENE ━━━
${scene}

━━━ EPIC SUNSET IDENTITY — NON-NEGOTIABLE ━━━
- This is NOT a "nice sunset" — this is a ONCE IN A LIFETIME sunset
- Colors are CRANKED — more vivid, more saturated, more dramatic than any real sunset
- The SKY is the hero — it should fill 60-70% of the frame
- Clouds are ESSENTIAL — they catch the light, create drama, make the sunset unique
- Reflections on water, wet sand, tide pools DOUBLE the impact
- The tropical setting provides scale and silhouette — palms, islands, volcanic rock
- Use the EXACT colors and cloud formations from THE SUNSET SCENE above

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ BLOW IT UP — SUNSET EDITION ━━━
This sunset is IMPOSSIBLE. Colors that don't exist in nature. Clouds lit from within like they're on fire. The entire sky is a painting — every inch dramatic, every gradient perfect. The horizon GLOWS. The water MIRRORS. The palms stand in awe. This is the sunset that makes you believe in God, quit your job, and move to the tropics. MAXIMUM DRAMA. MAXIMUM BEAUTY. MAXIMUM AWE.

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
