/**
 * FarmBot — rainy-farmhouse-morning (Phase 1 remainder, 2026-09-08).
 *
 * Section 16 example archetype. Leisure/mood-led, indoor-only — the cozy
 * farmhouse-interior counterpart to quiet-sunset-on-the-porch. Built
 * ENTIRELY from existing shared pools, no bespoke pool file needed:
 *
 *  - WEATHER_ATMOSPHERE has no "rain" tag, but already carries gentle-rain
 *    entries ("Pale pink petals drifting loose on a gentle rain..." /
 *    "Gentle rain tapping quietly on the roof..." and others). This file
 *    filters on the description text itself for those rather than pulling
 *    the whole spring-tagged set (which also has non-rain misty-morning
 *    entries) — see WEATHER below.
 *  - WORLD_DETAIL_PROPS already carries 15 `indoor`-tagged entries (a
 *    kettle steaming on a cast-iron stove, a quilt-draped rocking chair
 *    beside a rain-streaked window, a cozy reading nook with a book left
 *    face-down, jam jars, dried herbs, teacups) that do the brief's "warm
 *    kitchen light... someone reading" work directly.
 *  - SEASON is locked to spring so it never narratively contradicts the
 *    only rain entries FarmBot has (both spring-tagged).
 *
 * HARD LESSON (2026-09-08, traced via ai_prompt DB reads across 2 QA
 * rounds): when a CHARACTER is present, Sonnet's brief→Flux-prompt
 * compression reliably drops content that appears LATE in the raw scene
 * text — not because it's "atmospheric" vs "concrete" (a rewrite from
 * mood-language to a hard concrete-object mandate made zero difference
 * placed mid-SETTING), but because of ORDER/budget: the character
 * description alone is long, and everything after it competes for a
 * shrinking remainder. 4/4 character-present test renders across 2 rounds
 * produced ZERO mentions of "rain" in the final ai_prompt despite an
 * explicit concrete mandate sentence AND a closing-paragraph reinforcement
 * — both silently vanished. The 2 no-character renders (nothing competing
 * for budget) preserved rain 2/2. Fixed by moving the rain-window mandate
 * to the very FIRST line of the template, before THE CHARACTER section —
 * content positioned early survives; content positioned late does not.
 * If a future path needs a "must always be visible" element alongside a
 * character, lead with it, don't trust the closing paragraph to carry it.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): not every render needs a human — a farmhouse
  // interior still-life (a kettle steaming alone, a cat curled on the
  // windowsill, rain streaking the glass) is just as on-brand. ~30% of the
  // time skip the character; boost the odds of a cat so the frame still
  // feels lived-in.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure', 'bakery'], 'rainy_farmhouse_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present. Restricted to the TRUE
  // intersection of chore+bakery tags (dough-kneading) — the only ACTIVITY
  // entries that read as an indoor kitchen chore rather than an outdoor
  // farm task that would contradict "sheltering indoors while it rains."
  // NOTE: pools.byTags() is an OR-match on the allowed-tags whitelist, not
  // an AND/intersection — byTags(ACTIVITY, ['chore','bakery']) would return
  // every 'chore'-tagged entry (farm chores included) PLUS every 'leisure'
  // entry (they all separately carry the always-pass 'ANY' tag), i.e. the
  // entire 25-entry pool. Filtering on both tags directly here instead.
  const activity = includeCharacter
    ? picker.pickWithRecency(
        pools.ACTIVITY.filter((e) => e.tags.includes('chore') && e.tags.includes('bakery')).map(
          (e) => e.description
        ),
        'rainy_farmhouse_activity'
      )
    : null;
  // Strictly `indoor` — deliberately NOT also `farmhouse`, which would pull
  // in this pool's many OUTDOOR farmhouse-tagged entries (hay bales by a
  // fence, window boxes on an exterior cottage wall) via byTags()'s
  // OR-match on tags.
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['indoor']),
    'rainy_farmhouse_props'
  );
  // Locked to spring — the only season FarmBot's existing rain entries are
  // tagged with, so season and weather never contradict each other.
  const season = picker.pickWithRecency(pools.byTags(pools.SEASON, ['spring']), 'rainy_farmhouse_season');
  // WEATHER_ATMOSPHERE has no "rain" tag — filter directly on the
  // description text for the pool's existing gentle-rain entries (picks up
  // any future additions to the shared pool automatically, too).
  const rainEntries = pools.WEATHER_ATMOSPHERE.filter((e) => /\brain\b/i.test(e.description)).map(
    (e) => e.description
  );
  const weather = picker.pickWithRecency(rainEntries, 'rainy_farmhouse_weather');
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'rainy_farmhouse_camera');
  // A curled-up cat is exactly the "cozy companion" this path's brief calls
  // for — filtered dynamically off ANIMAL_COMPANIONS' own cat/kitten
  // entries (the windowsill tabby with kittens on the curtain hem is a
  // near-perfect match) rather than the bare density tags, which would
  // otherwise just as easily surface an outdoor barnyard animal that has no
  // business inside a farmhouse kitchen. `chaos`-tagged entries are
  // excluded — a twelve-animal pileup fights this path's quiet mood.
  const catEntries = pools.ANIMAL_COMPANIONS.filter(
    (e) => /\b(cat|kitten)s?\b/i.test(e.description) && !e.tags.includes('chaos')
  ).map((e) => e.description);
  const animalChance = includeCharacter ? 0.4 : 0.65;
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(catEntries, 'rainy_farmhouse_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool: catEntries,
        animalChance,
        ambientTags: ['indoor'],
        axisPrefix: 'rainy_farmhouse',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'rainy_farmhouse_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE RAIN (present in every render — establish this first, before anything else in the frame) ━━━
A window, its glass clearly streaked with lines of gentle falling rain,
the green world outside softly blurred through the drops. This
rain-streaked window is a required, concrete object in the frame, not
just a mood — an actual window pane with actual visible rain-streaks
running down it.

${character ? `━━━ THE CHARACTER ━━━\n${character}\n\n` : ''}${activity ? `━━━ WHAT'S HAPPENING (a quiet indoor chore, unhurried while the rain falls outside) ━━━\n${activity}\n\n` : ''}━━━ THE SETTING (warm farmhouse interior) ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ A QUIET COMPANION ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried farmhouse-morning moment, entirely indoors — the
character rendered just as lovingly as the room around them, the interior
rich with cozy, lived-in detail, never bare or plain, the rain-streaked
window from the very top of this brief clearly visible. Every face in the
frame, human and animal alike, stays clearly separate and fully legible,
each with its own open pocket of air around it.`
    : `no human figure anywhere in the frame — this is a warm, contented
farmhouse-interior still-life moment, entirely indoors. The room itself
carries the whole frame, rendered with rich, lived-in, lovingly detailed
warmth, the rain-streaked window from the very top of this brief clearly
visible.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
