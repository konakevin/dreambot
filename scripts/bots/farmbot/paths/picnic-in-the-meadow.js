/**
 * FarmBot — picnic-in-the-meadow (Phase 1 remainder, 2026-09-09).
 *
 * Section 16 example archetype. Leisure + food combo — an open-air meadow
 * picnic (checkered blanket, woven basket, wildflowers, open sky). The
 * blanket/basket/wildflowers/sky are written as a FIXED anchor block (not
 * pool-randomized) so the picnic itself is guaranteed every render; food,
 * activity, props, season, weather, and animal are layered on top from
 * shared pools. No bespoke pool needed — everything the brief calls for
 * already exists in pools.js.
 *
 * SAFETY FILTERS beyond the usual byTags() (see the byTags/"ANY"-tag gotcha
 * in FARMBOT_PATH_BUILD_STATE.md — an "ANY"-tagged entry always passes
 * byTags() regardless of requested tags, which can silently leak in content
 * that contradicts a path's premise). This path additionally has a FIXED
 * hero anchor (the picnic blanket itself) that a pool entry naming a
 * competing specific place can silently override — round 1/2 QA caught two
 * concrete cases of this, both fixed by content filtering below:
 *  1. FOOD_AND_BAKING has several entries explicitly staged indoors ("...on
 *     a flour-dusted wooden counter," "...through a lace-curtained window,"
 *     "...simmering on a cast-iron stove") — dropped into an open-meadow
 *     picnic scene these directly contradict the "open sky" anchor, the
 *     same interior/exterior-collision failure mode that caused the
 *     split-diptych bug (see FARMBOT_COZY_NEUTRAL's "SINGLE UNIFIED FRAME"
 *     note). Round 1 QA (via the DB ai_prompt) additionally showed this
 *     class of pool ALSO losing the anime signal entirely on a no-character
 *     render (the "Soft painterly cute anime illustration" look entry
 *     anchors 100% of its own anime-reinforcement to character/face
 *     vocabulary — with no character to anchor to, Sonnet's brief drifted
 *     to pure fine-art/photography words: "impasto," "oil," "bokeh," never
 *     repeating "anime" once). Filtered out by keyword instead of relying
 *     on tags (the pool has no indoor/outdoor tag axis at all); the
 *     no-human closing line below also got a positive object-level
 *     anime-illustration reinforcement as a backstop for whichever look
 *     entry rolls (round 2 confirmed both fixes hold).
 *  2. WORLD_DETAIL_PROPS's "indoor" entries carry "ANY" alongside "indoor"
 *     (copper pots, dried herbs, an iron rail, a brick hearth) — byTags()
 *     would leak all four of these into an outdoor picnic. Filtered with a
 *     strict manual `.tags.includes('outdoor')` check instead of byTags().
 *  3. Round 2 QA found ACTIVITY's leisure-tagged pool includes entries that
 *     name a DIFFERENT specific place ("beside a shallow stream," "on a
 *     porch step," a hayloft's "rafters above") — one such render (traced
 *     via DB ai_prompt) fully relocated the scene to a village stream with
 *     the picnic blanket demoted to "nearby" set-dressing and never
 *     actually rendered by Flux. Filtered to the 4 leisure entries that are
 *     genuinely picnic-blanket-compatible (open hay, a fence line, a
 *     blanket in grass/dark) instead of the full leisure tag.
 *
 * ANIMAL-SPOTLIGHT-PARITY FIX (2026-09-09) — audit found CHARACTER was
 * placed before the animal section on 8/10 sampled FarmBot paths, and this
 * one's baseline DB ai_prompt confirmed the maxTokens-400 late-content-drop
 * bug hit the ANIMAL VISITOR section specifically (it sat dead last, after
 * props/season/weather, and was silently dropped from every sampled
 * render). Reordered to ANIMAL COMPANY (relabeled from the diminishing "AN
 * ANIMAL VISITOR") right after the fixed picnic anchor, BEFORE THE
 * CHARACTER — mirrors barn-animal-shelter-interior.js/woodland-walk.js.
 * Round 1 re-verification then found a NEW regression this reorder
 * introduced: `${food}` used to sit directly in the picnic anchor block
 * (before character), and one food pool entry is a 4-item enumerated list
 * that ate enough budget to truncate CHARACTER down to a single clause.
 * Fixed by moving `${food}` out of the anchor block into THE SPREAD &
 * SETTING section (after character/activity) — food is a nice-to-have
 * layer, not cast-determining, so it's the right thing to deprioritize.
 * Round 2 also caught a "rendered tiny against the wide meadow" dwarfing
 * artifact on a with-character render (Sonnet's own compression, not a
 * pool bug) — added an explicit "clear, present figure... not a distant
 * tiny speck" guard to the closing reinforcement (same fix pattern as
 * woodland-walk.js). Round 2 also found the no-character branch's
 * `pickPureSceneLife()`-guaranteed animal pick can still silently fail to
 * survive Sonnet's own paraphrase (papaya-guava-orchard's documented
 * residual risk) — strengthened the wrapper to "not optional, must
 * actually appear" and now repeat the animal content a second time
 * verbatim in the no-character closing paragraph. Verified via 15 shadow
 * renders across 3 rounds: 0/10 character-thinning or dwarfing recurrences
 * in rounds 2-3; animal survives with rich, comparable detail in the large
 * majority of renders where it's rolled (residual non-determinism on the
 * no-character guarantee is a known bot-wide risk, not unique to this
 * path — see the papaya-guava-orchard lesson in
 * BOT_SCENE_QUALITY_PLAYBOOK.md).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// FOOD_AND_BAKING entries with no indoor-anchoring words — safe to place on
// an open-air picnic blanket without contradicting the meadow setting.
const INDOOR_ANCHOR_WORDS = /kitchen|window|counter|curtain|hearth|doorstep|stove|shelf|cottage|\broom\b|\bsill\b|\broof\b/i;
const PICNIC_SAFE_FOOD = pools.FOOD_AND_BAKING.filter((e) => !INDOOR_ANCHOR_WORDS.test(e.description)).map(
  (e) => e.description
);
const PICNIC_SAFE_WEATHER = pools.WEATHER_ATMOSPHERE.filter((e) => !INDOOR_ANCHOR_WORDS.test(e.description)).map(
  (e) => e.description
);
// Strict outdoor-only subset of WORLD_DETAIL_PROPS — manual filter, not
// byTags(), so the four indoor+"ANY" entries can't leak in.
const OUTDOOR_PROPS = pools.WORLD_DETAIL_PROPS.filter((e) => e.tags.includes('outdoor')).map(
  (e) => e.description
);
// Leisure-tagged ACTIVITY entries that don't name a competing specific
// place (a stream, a porch, a hayloft's rafters) — the rest are perfectly
// fine ACTIVITY entries on their own, just incompatible with THIS path's
// fixed picnic-blanket anchor.
const COMPETING_PLACE_WORDS = /porch|stream|rafters/i;
const PICNIC_SAFE_ACTIVITY = pools
  .byTags(pools.ACTIVITY, ['leisure'])
  .filter((desc) => !COMPETING_PLACE_WORDS.test(desc));

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" — a picnic blanket laid out
  // and waiting, or the charming aftermath of one, is its own still-life.
  // ~30% of the time skip the character; boost the animal-visitor chance
  // (a rabbit nosing at the basket, a butterfly over the blanket) so the
  // frame still feels alive rather than empty.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['leisure', 'ANY'], 'picnic_meadow_character')
    : null;
  const food = picker.pickWithRecency(PICNIC_SAFE_FOOD, 'picnic_meadow_food');
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(PICNIC_SAFE_ACTIVITY, 'picnic_meadow_activity')
    : null;
  const props = picker.pickWithRecency(OUTDOOR_PROPS, 'picnic_meadow_props');
  const season = picker.pickWithRecency(pools.SEASON.map((e) => e.description), 'picnic_meadow_season');
  const weather = picker.pickWithRecency(PICNIC_SAFE_WEATHER, 'picnic_meadow_weather');
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'picnic_meadow_camera');
  const animalChance = includeCharacter ? 0.35 : 0.65;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'picnic_meadow_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'picnic_meadow',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'picnic_meadow_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE PICNIC ━━━
A checkered picnic blanket spread flat across open meadow grass, a woven
wicker basket sitting open near its center with a striped cloth lining
spilling gently over the rim. Loose wildflowers are scattered across the
blanket's weave, a few more tucked into the basket's handle, and the wide
open sky stretches pale and unbroken above the meadow with nothing but soft
drifting clouds overhead.
${animal ? `\n━━━ ANIMAL COMPANY (present in this render — a required, concrete, clearly-visible presence, not just background mood; it is not optional, it must actually appear in the render, given the same rich, specific, loving detail as everything else in the frame) ━━━\n${animal}\n` : ''}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING (unhurried, out in the open air) ━━━\n${activity}\n\n` : ''}━━━ THE SPREAD & SETTING ━━━
${food}
${props}
${season}
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried meadow-picnic moment — the character${animal ? ', the animal,' : ''} the picnic
spread, and the open meadow all rendered with equal loving detail, never a
backdrop${animal ? ' — the animal given just as much rich, specific detail as the character, never reduced to a small tacked-on mention' : ''}, the character a clear, present figure at the heart of the picnic, close
at hand, not a distant tiny speck lost against the meadow beyond. Every face
in the frame, human and animal alike, stays clearly separate and fully
legible, each face keeping its own open space with a visible gap of air
between it and any other face, so every expression reads clean and
unambiguous.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
meadow-picnic still-life, the blanket freshly laid and waiting. The picnic
spread and the open meadow carry the whole frame, rendered with rich loving
detail, never plain or empty. Every object in view — the blanket's woven
texture, the basket, the food, the scattered wildflowers, the meadow grass
itself — is drawn with the same charming anime-style linework, flat cel
highlights, and illustrated color treatment as the rest of this bot's
world.${animal ? ` The animal company named above must clearly and visibly appear in the render — ${animal} It reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.` : ''}`
} no text, no words, no watermarks, gallery quality`;
};
