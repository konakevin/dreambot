/**
 * FarmBot — flower-field-wandering (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the wide-open wildflower field is
 * the hero, always named first) — a pure "wandering" leisure moment, not
 * tied to any specific structure. Uses the path-bespoke FLOWER_FIELD_PLACE
 * pool (required directly from its JSON — this pool is NOT added to
 * pools.js, see gen-flower-field-place-pool.js) as the setting anchor, same
 * pattern as summer-evening-by-the-pond.js uses POND_PLACE and
 * harvest-festival.js uses HARVEST_FESTIVAL_PLACE.
 *
 * No season lock — the wildflower field itself already carries the seasonal
 * signal loosely (spring/summer bloom), so this path rolls SEASON from the
 * shared pool for extra variety instead of hard-locking it.
 *
 * ANIMAL-SPOTLIGHT-PARITY FIX (2026-09-09, cross-path audit): this path
 * originally put ANIMAL COMPANY dead last in the template (after SEASON &
 * ATMOSPHERE, right before CAMERA) with THE CHARACTER placed 2nd, right
 * after the place block. Confirmed via a real production `ai_prompt` this
 * was actively truncating the animal content: a with-character render's
 * Sonnet output cut off mid-word ("fireflies blink as tiny soft amber
 * glowing,") right where the animal beat should have continued, then jumped
 * straight to the closing sentence — the same `maxTokens: 400`
 * brief-writing-budget mechanism documented on `barn-animal-shelter-
 * interior.js` and `rainy-farmhouse-morning.js` (content positioned late in
 * a dense template gets thinned/dropped first, independent of whether the
 * hard cap is literally hit). Fixed to mirror `woodland-walk.js`'s proven
 * pattern exactly: ANIMAL COMPANY now comes right after the place block and
 * BEFORE THE CHARACTER, with the same "required, concrete, clearly-visible
 * detail, not just background mood" qualifier on its header. Also added an
 * explicit animal-richness reinforcement clause to the WITH-CHARACTER
 * closing paragraph (the no-character branch already had one) so the animal
 * gets comparable descriptive weight to the character, not a single short
 * clause tacked on. Re-verified via 5 shadow-post test renders: animal
 * content (when rolled) now appears with real, comparable detail, described
 * before the character in the prompt, and the character branch still comes
 * through complete and untruncated.
 *
 * ROUND 2 (same day, same audit): the round-1 reorder introduced the flip-
 * side risk it was explicitly meant to be checked for. Real `ai_prompt` on
 * 4 of 5 round-1 with-character+animal renders showed the ANIMAL COMPANY
 * block ballooning into 3-5 invented sentences (well beyond the picked pool
 * entry's own single sentence), burning enough of Sonnet's `maxTokens: 400`
 * output budget that THE CHARACTER — even though it's the very next block —
 * got cut off mid-description, dropping skin tone and/or eye color entirely
 * in most samples (e.g. one render ended "She w," right before "wears...").
 * Fixed with two small, positive-primary template directives (no reorder
 * needed this time): the ANIMAL COMPANY header now asks for "vivid but
 * efficient, a compact couple of sentences" ONLY when a character is also
 * present (no cap in the no-character branch, where the animal IS the
 * subject), and THE CHARACTER header now explicitly names hair/eye/skin as
 * "essential identifying details ... state all three explicitly and
 * completely." Re-verified via 5 more shadow-post renders (round 2): animal
 * stayed concise-but-vivid and un-truncated in every with-character sample,
 * and every with-character render's `ai_prompt` carried complete hair + eye
 * + skin tone through to a clean sentence ending.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents are editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-flower-field-place-pool.js
const FLOWER_FIELD_PLACE = require('../seeds/farmbot_flower_field_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — this path in particular
  // is a natural fit for a gorgeous pure-scene/butterfly-and-bee render, so
  // lean a bit further toward no-human than the pond path's 65%.
  const includeCharacter = Math.random() < 0.6;

  const field = picker.pickWithRecency(FLOWER_FIELD_PLACE, 'flower_field_place');
  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'flower_field_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'flower_field_activity')
    : null;
  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['spring', 'summer', 'ANY']),
    'flower_field_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['spring', 'summer', 'ANY']),
    'flower_field_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'flower_field_camera');
  const animalChance = includeCharacter ? 0.45 : 0.8;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'flower_field_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'flower_field',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'flower_field_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FLOWER FIELD (the hero of the shot) ━━━
${field}
${animal ? `\n━━━ ANIMAL COMPANY (present in this render — a required, concrete, clearly-visible detail, not just background mood${character ? '; describe it vividly but efficiently in a compact couple of sentences, keeping room for the character below to receive full, complete attention' : ''}) ━━━\n${animal}\n` : ''}
${character ? `\n━━━ THE CHARACTER (lead with their hair color, eye color, AND skin tone, stated explicitly and completely, before any clothing, pose, or activity detail — these three traits are essential and must not be dropped for space) ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ SEASON & ATMOSPHERE ━━━
${season}
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried flower-field wandering moment — the field, the
character, and every bloom and butterfly rendered with equal loving
richness, never a bare or empty composition.${animal ? ' The animal sharing the field with the character is rendered with just as much loving detail and presence as the character, never a small background accent.' : ''} Every face in the frame,
human and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
flower-field wandering moment carried entirely by the wide-open field itself
and whatever wildlife shares it, every bloom and butterfly rendered with
equal loving richness, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
