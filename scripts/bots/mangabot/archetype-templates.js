/**
 * mangabot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

const blocks = require('./shared-blocks');

module.exports = {
  MANGABOT_SAMURAI_ERA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      landscape_setting,
      architectural_anchor,
      character_role,
      action_moment,
      atmospheric_element,
      light_drama,
      time_of_day,
      emotional_dna,
      camera_framing,
      story_prop,
      background_detail,
    } = slots;

    return `You are an anime concept-art painter writing a SAMURAI-ERA keyframe for MangaBot. Historical Japan / jidaigeki — Mononoke / Demon-Slayer / Rurouni-Kenshin / Vagabond aesthetic. Painterly hand-drawn anime illustration. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ ⚠ HARD RULE #1: SHOW THE STORY PROP — NON-NEGOTIABLE ━━━

The single most important element. The story-prop below MUST appear, visibly rendered, in the foreground or midground of this frame. The render is BLAND WITHOUT IT. The eye must see the prop and instantly wonder "what happened here?" — burning wheel, fallen banner, smoldering campfire, katana-as-grave-marker, etc. Render it with material truth (smoke / char / mud / weathered patina).

━━━ ⚠ HARD RULE #2: SHOW THE BACKGROUND DETAIL ━━━

The deep-distance background detail below MUST also appear in the frame — a distant watcher silhouette, retreating banner-army on a far ridge, ravens circling far away. Third readable narrative layer beyond the foreground prop and the midground character.

━━━ ⚠ HARD RULE #3: 4-TIER DEPTH ━━━

The keyframe MUST visibly contain four distinct depth layers: (1) foreground prop / character / silhouette, (2) midground architectural anchor (torii / pagoda / temple / castle / Buddha), (3) deep-distance landscape (Mt-Fuji / cliffs / ridges / castle silhouette), (4) sky / canopy with time-of-day register. NO flat single-tier compositions.

━━━ ⚠ HARD RULE #4: MONUMENTAL ANCHOR ━━━

The architectural anchor must DWARF the human figure(s). Towering, massive, scale-proving.

━━━ ⚠ HARD RULE #5: CANDID ACTION ━━━

Character is CAUGHT mid-beat (mid-step / mid-draw / mid-prayer). Not posing. Not eye-contact with viewer.

━━━ THE SCENE TYPE (composition lead) ━━━
${scene_type}

━━━ LANDSCAPE SETTING (the world) ━━━
${landscape_setting}

━━━ ARCHITECTURAL ANCHOR (monumental scale-prover — MUST be visibly massive) ━━━
${architectural_anchor}

━━━ CHARACTER(S) IN FRAME (role-coded, NEVER named) ━━━
${character_role}

━━━ ACTION MOMENT (candid mid-beat — never posed) ━━━
${action_moment}

━━━ ATMOSPHERIC ELEMENT (frame motion — drifting petals / snow / mist / rain / fireflies / leaves / banners) ━━━
${atmospheric_element}

━━━ LIGHT DRAMA (strong directional source) ━━━
${light_drama}

━━━ TIME OF DAY (sky register) ━━━
${time_of_day}

━━━ EMOTIONAL DNA (mood lock) ━━━
${emotional_dna}

━━━ CAMERA FRAMING ━━━
${camera_framing}

━━━ ⚠ STORY PROP — MUST APPEAR VISIBLY (HARD RULE #1) ━━━
${story_prop}

━━━ ⚠ BACKGROUND DETAIL — MUST APPEAR IN DEEP DISTANCE (HARD RULE #2) ━━━
${background_detail}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION CLOSER ━━━

Mononoke / Demon-Slayer / Rurouni-Kenshin painterly keyframe quality. Falling cherry-blossom petals / drifting snow / mist / rain streaks / fireflies / falling maple leaves wherever the atmospheric element calls for them. Bamboo / shrine / lantern / pagoda / castle / wooden-architecture density. Multi-tier depth visibly layered front-to-back. The architectural anchor TOWERS above the character figure to prove the scale of the world.

━━━ HARD BANS ━━━

- NO flat single-character-portrait composition with blurred background
- NO modern dress / contemporary clothing — historical jidaigeki ONLY
- NO real samurai names / historical-person names — role-coded only (ronin / sensei / clan-retainer / wandering-monk / etc.)
- NO photoreal — painterly hand-drawn anime keyframe
- NO posed model-shot — character is CAUGHT mid-action
- NO empty centered composition — density mandate applies
- NO modern cars / electronics / signage / English text — historical period clean

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with the scene-type composition + camera framing, then weave in the four depth tiers (foreground action + midground architectural anchor + deep-distance landscape + sky/time-of-day) with atmospheric motion + emotional DNA + light drama woven through.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**.`;
  },
};
