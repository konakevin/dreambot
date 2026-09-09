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
  // Kevin (2026-09-09): not every render needs a human — a pure porch
  // still-life (empty rocking chair, potted flowers, a cat curled on the
  // cushion) is just as on-brand. ~30% of the time skip the character;
  // boost the odds of an animal so the frame still feels lived-in.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure'], 'porch_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'porch_activity')
    : null;
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
  const animalChance = includeCharacter ? 0.4 : 0.6;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'porch_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'porch',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'porch_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${character ? `━━━ THE CHARACTER ━━━\n${character}\n\n` : ''}${activity ? `━━━ WHAT'S HAPPENING (quiet, unhurried — nowhere to be) ━━━\n${activity}\n\n` : ''}━━━ THE SETTING ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ A QUIET COMPANION ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a calm, contented porch moment — the character rendered warmly, the
porch and its surroundings just as lushly and richly detailed as the
character, never a bare or empty composition. Every face in the frame,
human and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a calm, contented porch
still-life moment. The porch and its surroundings carry the whole frame,
rendered with lush loving detail, never bare or empty.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
