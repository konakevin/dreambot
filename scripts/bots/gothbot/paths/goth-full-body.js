/**
 * GothBot goth-full-body path — THREE-QUARTER / MID-SHOT framing (not full
 * pulled-back panorama — that creates cheesy trading-card-art poses). She is
 * waist-up to thigh-up, caught mid-action, background partial. A step wider
 * than goth-closeup, NOT a pulled-back full-silhouette.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.DARK_CHARACTERS, 'dark_character');
  const action = picker.pickWithRecency(pools.CHARACTER_ACTIONS, 'character_action');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-manga cinematographer writing THREE-QUARTER / MID-SHOT scene descriptions for GothBot — gothic-horror woman caught candidly in the middle of something, framed from WAIST-UP to THIGH-UP (NOT pulled-back full-silhouette). Van-Helsing film-still / Castlevania cutscene / Hellboy splash-panel aesthetic. Ayami-Kojima dark-manga inked stylization.

TASK: write ONE vivid THREE-QUARTER scene description (60-80 words, comma-separated phrases) of her MID-MOMENT framed from waist-up to thigh-up. She is NOT posing. She is doing something real and the camera catches her in a mid-shot. Output wraps with style prefix + suffix — you produce ONLY the middle scene section.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.ALLURING_BEAUTY_BLOCK}

${blocks.DYNAMIC_POSE_BLOCK}

${blocks.EXTERIOR_PREFERRED_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.STYLIZED_MANGA_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CHARACTER (use as her core identity — don't contradict) ━━━
${character}

━━━ THE CONFIDENT PREDATORY ACTION — SHE IS DOING THIS (not posing, not holding weapon aloft) ━━━
${action}

This is a LOADED moment — she is mid-something, charged with intent. Something just happened, or is about to. Film-still-caught-mid-cut, NEVER heroic-poster-pose, NEVER "standing with weapon held above head", NEVER "arms outstretched summoning". The camera is close — waist-up to thigh-up — catching her mid-verb without pulling back to panorama.

━━━ SETTING — EXTERIOR PREFERRED ━━━
${landscape}

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
Frame her from WAIST-UP to THIGH-UP at most. NEVER pull back to full silhouette. NEVER show her full legs or feet. The background is IMPLIED / PARTIAL — a suggestion of environment at the edges (gargoyle ledge behind her, cathedral stone wall, misted forest edge, graveyard marker half-visible) — not a panoramic landscape. She FILLS 60-75% of the vertical frame.

Why mid-shot: pulled-back full-body framing creates cheesy trading-card-art poses (Maleficent stance, weapon-held-overhead, elegant-gown-flowing). Three-quarter framing keeps the viewer IN THE MOMENT with her, sees her wardrobe detail, sees her action — without the cheese.

━━━ FORBIDDEN WORDS + CLICHÉS ━━━
NEVER use "pose", "posing", "editorial", "fashion shoot", "runway", "heroic stance", "holding weapon aloft", "trading card", "RPG character art", "power pose", "full body", "full silhouette". NO elegant-floating-in-white-dress. NO levitating-with-arms-out. NO pentagrams in frame. NO oversaturated-red lighting. NO Artgerm-smooth-digital-art. NO centered-character-weapon-overhead. NO landscape-dominating-background. Stylized inked dark-manga-horror, Van-Helsing-film-still grit.

━━━ STRUCTURE (write in this order) ━━━
[gothic-horror woman archetype, body + skin + eyes + hair + makeup visible from waist-up], [caught MID the action described above — specific kinetic verb], [her wardrobe / bodice / weapon at her belt detail], [partial environment at frame edges — gothic detail hinted not panoramic], [lighting illuminating her upper body], [atmospheric + color-palette layer]

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
