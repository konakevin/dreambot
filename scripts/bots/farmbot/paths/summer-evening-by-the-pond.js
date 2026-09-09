/**
 * FarmBot — summer-evening-by-the-pond (Phase 1, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Place-led (the pond is the hero, always
 * named first) — season LOCKED to summer since it's in the path name.
 * Uses the path-bespoke POND_PLACE pool (already lush by its own recipe)
 * as the setting anchor; character + activity + animal layer warmly on top.
 *
 * ANIMAL-SPOTLIGHT-PARITY FIX (2026-09-09): an audit found this path put
 * the CHARACTER block before the ANIMAL COMPANY block in the template — a
 * real defect against the maxTokens: 400 brief-writing lesson documented
 * fleet-wide in FARMBOT_PATH_BUILD_STATE.md (content positioned LATE in
 * the input brief reliably gets thinned/dropped by Sonnet, independent of
 * whether the hard token cap is hit). Confirmed via real DB `ai_prompt`
 * rows before this fix: one render's animal pick never appeared in the
 * final Flux prompt at all (and the trailing character description was
 * cut off mid-word), another had the character description itself
 * truncated mid-word after a verbose POND_PLACE pick ate the budget.
 * Reordered to mirror barn-animal-shelter-interior.js / woodland-walk.js:
 * ANIMAL COMPANY now comes right after THE POND, ahead of THE CHARACTER,
 * with the same "required, concrete, clearly-visible detail, not just
 * background mood" framing those precedent files use. Re-verified via
 * fresh shadow-post renders (see FARMBOT_PATH_BUILD_STATE.md) that this
 * does not thin the character block in with-character renders.
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
${animal ? `\n━━━ ANIMAL COMPANY (present in this render — a required, concrete, clearly-visible detail, not just background mood) ━━━\n${animal}\n` : ''}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}

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
