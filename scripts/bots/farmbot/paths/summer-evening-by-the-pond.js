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
  // Kevin (2026-09-09): not every render needs a human — a pure pond scene
  // (frogs, dragonflies, lily pads under a sunset) is just as on-brand, and
  // this path's pond-as-hero design already leans that way naturally. ~35%
  // of the time skip the character and boost wildlife odds instead.
  const includeCharacter = Math.random() < 0.6;

  const pond = picker.pickWithRecency(pools.POND_PLACE, 'pond_place');
  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'pond_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'pond_activity')
    : null;
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['summer', 'ANY']),
    'pond_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'pond_camera');
  const animalChance = includeCharacter ? 0.5 : 0.85;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'pond_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'pond',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'pond_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE POND (the hero of the shot) ━━━
${pond}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried summer-evening pond moment — the pond, the
character, and every detail rendered with equal loving richness, never a
bare or empty composition. Every face in the frame, human and animal alike,
stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
summer-evening pond moment carried entirely by the pond itself and
whatever wildlife shares it, every detail rendered with equal loving
richness, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
