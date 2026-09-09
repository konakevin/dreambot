/**
 * FarmBot — quiet-sunset-on-the-porch (Phase 1, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Pure leisure — "the joy of having nowhere
 * to be" (section 9). No food/market focus; light on animals. The path
 * most at risk of reading plain/bare, so props are pulled from BOTH
 * indoor and garden/outdoor tags and the footer explicitly mandates a
 * lush, richly-detailed porch, never a bare one.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  const character = pools.pickCharacter(picker, ['ANY', 'leisure'], 'porch_character');
  const activity = picker.pickWithRecency(
    pools.byTags(pools.ACTIVITY, ['leisure']),
    'porch_activity'
  );
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['garden', 'outdoor', 'indoor', 'farmhouse']),
    'porch_props'
  );
  const season = picker.pickWithRecency(pools.SEASON.map((e) => e.description), 'porch_season');
  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'porch_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'porch_camera');
  const animal =
    Math.random() < 0.4
      ? picker.pickWithRecency(pools.byTags(pools.ANIMAL_COMPANIONS, ['low']), 'porch_animal')
      : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'porch_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CHARACTER ━━━
${character}

━━━ WHAT'S HAPPENING (quiet, unhurried — nowhere to be) ━━━
${activity}

━━━ THE SETTING ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ A QUIET COMPANION ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
render a calm, contented porch moment — the character rendered warmly, the
porch and its surroundings just as lushly and richly detailed as the
character, never a bare or empty composition. Every face in the frame,
human and animal alike, stays clearly separate and fully legible. no text,
no words, no watermarks, gallery quality`;
};
