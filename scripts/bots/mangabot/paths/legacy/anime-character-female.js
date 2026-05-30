/**
 * MangaBot anime-character-female path — anime girl out and about in a
 * richly-rendered anime setting. Wall-poster slice-of-life keyframe.
 *
 * Two-tier scenery (setting + vista), character ~25-40% of frame, mid-
 * action body-pose, NO posing. Now using the shared keyframe + density
 * + story-moment framework.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.ANIME_ARCHETYPE_FEMALE, 'acf_archetype');
  const outfit = picker.pickWithRecency(pools.ANIME_OUTFITS_FEMALE, 'acf_outfit');
  const skin = picker.pickWithRecency(pools.ANIME_SKIN, 'acf_skin');
  const eyes = picker.pickWithRecency(pools.ANIME_EYES, 'acf_eyes');
  const hairColor = picker.pickWithRecency(pools.ANIME_HAIR_COLOR, 'acf_hair_color');
  const hairstyle = picker.pickWithRecency(pools.ANIME_HAIRSTYLES_FEMALE, 'acf_hairstyle');
  const accessory = picker.pickWithRecency(pools.ANIME_ACCESSORIES_FEMALE, 'acf_accessory');
  const setting = picker.pickWithRecency(pools.ANIME_SETTING, 'acf_setting');
  const vista = picker.pickWithRecency(pools.ANIME_VISTA, 'acf_vista');
  const activity = picker.pickWithRecency(pools.ANIME_ACTIVITY, 'acf_activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing a CHARACTER-FOCUSED keyframe for MangaBot. An anime woman caught in a candid slice-of-anime-life moment, with the rich anime world as costar. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ THE CHARACTER (full identity — render exactly) ━━━
${archetype}

━━━ HER OUTFIT (silhouette is the hero) ━━━
${outfit}

━━━ HER PHYSICAL DNA ━━━
- Skin: ${skin}
- Eyes: ${eyes}
- Hair color: ${hairColor}
- Hairstyle: ${hairstyle}

━━━ HER SIGNATURE OBJECT ━━━
${accessory}

━━━ THE SETTING (the immediate place — costar) ━━━
${setting}

━━━ THE VISTA (scale-anchor backdrop) ━━━
${vista}

━━━ HER BODY ACTIVITY ━━━
${activity}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION CLOSER ━━━
WIDE cinematic shot — character occupies 25-40% of frame, scenery 60-75%. Camera 3/4-rear or 3/4-front, never head-on. She is mid-step / mid-sip / mid-laugh / mid-reach, eyes never locked on camera. Setting + vista frame her with poster-worthy density.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
