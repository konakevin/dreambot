/**
 * FarmBot — summer-evening-by-the-pond (Phase 1, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Place-led (the pond is the hero, always
 * named first) — season LOCKED to summer since it's in the path name.
 * Uses the path-bespoke POND_PLACE pool (already lush by its own recipe)
 * as the setting anchor; character + activity + animal layer warmly on top.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  const pond = picker.pickWithRecency(pools.POND_PLACE, 'pond_place');
  const character = pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'pond_character');
  const activity = picker.pickWithRecency(
    pools.byTags(pools.ACTIVITY, ['leisure']),
    'pond_activity'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['summer', 'ANY']),
    'pond_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'pond_camera');
  const animal =
    Math.random() < 0.5
      ? picker.pickWithRecency(pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']), 'pond_animal')
      : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'pond_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE POND (the hero of the shot) ━━━
${pond}

━━━ THE CHARACTER ━━━
${character}

━━━ WHAT'S HAPPENING ━━━
${activity}

━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
render a warm, unhurried summer-evening pond moment — the pond, the
character, and every detail rendered with equal loving richness, never a
bare or empty composition. Every face in the frame, human and animal alike,
stays clearly separate and fully legible. no text, no words, no
watermarks, gallery quality`;
};
