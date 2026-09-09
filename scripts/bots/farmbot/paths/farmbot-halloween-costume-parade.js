/**
 * FarmBot — farmbot-halloween-costume-parade (SEASONAL path, Halloween).
 *
 * Registers into `bot.seasonalPaths.halloween` (scripts/lib/botSeasonal.js),
 * NOT the normal `bot.paths[]` rotation — drawn only during the calendar
 * Halloween window at engine_config.bots_seasonal_pct, entirely separate
 * from FarmBot's 30 evergreen paths. See index.js for the exact lines to
 * register (this file's own header comment does not self-register —
 * shared-file collision risk across concurrent agents, per FARMBOT_PATH_
 * BUILD_STATE.md's Phase-4 coordination note).
 *
 * CONCEPT — a cheerful costume PARADE / SHOWCASE moment on the farm or
 * through the village: one or more characters and/or farm animals dressed
 * in cute, simple Halloween costumes (pumpkin, ghost bedsheet w/ cutout
 * eyes, witch hat, scarecrow, black cat, and more), walking together or
 * posed together showing off their costumes, along an outdoor path lined
 * with autumn Halloween decor (small carved pumpkins, string lights, hay
 * bales). Playful family-friendly Halloween ONLY — costumes stay simple,
 * cute, and instantly recognizable, NEVER elaborate, realistic, or scary.
 *
 * DISTINCT FROM TWO SIBLING SEASONAL PATHS (built concurrently by other
 * agents, same Halloween window):
 *   - farmbot-halloween-barn-party — INDOOR, barn-decorated PARTY scale.
 *     This path is OUTDOOR and is never a party venue (no dance floor, no
 *     snack table, no barn interior at all).
 *   - farmbot-halloween-trick-or-treating — door-to-door TREAT-COLLECTING
 *     narrative. This path never depicts a doorstep, knocking, or a treat
 *     bag — it's about the ACT of parading/showing off costumes itself.
 * The differentiator this path leans into is MOTION and SHOW-OFF energy: a
 * little procession, a walk together, a "look at us" pose — see the
 * bespoke ACTION pool below.
 *
 * ARCHITECTURE — 4 bespoke axes (own JSON + gen script, not shared, per
 * FARMBOT_PATH_BUILD_STATE.md's path-bespoke-pool convention), all at full
 * 120-entry depth (Kevin: match ChibiBot's real Halloween-pool precedent,
 * not FarmBot's normal MVP-25-then-scale convention):
 *   COSTUME     (119) — wearer-agnostic costume description, no subject
 *                noun at all, so the same entry drops onto a human OR an
 *                animal cast slot ("wearing: <entry>").
 *   ACTION      (118) — the parade/showing-off motion+pose, also subject-
 *                elided, with an explicit CAMERA-SAFETY rule baked into
 *                every entry: face/eyes always turned toward or angled at
 *                the viewer, NEVER receding/back-turned/facing away.
 *   SETTING     (119) — the outdoor walking path/lane itself, autumn
 *                Halloween decor (small carved pumpkins, string lights, hay
 *                bales) baked directly into the same sentence so decor never
 *                gets assigned to a setting it doesn't physically fit.
 *   ATMOSPHERE  (113, semantic ceiling — a narrow sky/light-mood axis has
 *                real limits, same accepted stopping condition as the
 *                5-entry look register) — late-afternoon-through-dusk
 *                sky/light mood only, layered on top of SETTING.
 *
 * CHARACTER SYSTEM — deliberately does NOT use pools.pickCharacter() /
 * CHARACTER_ARCHETYPE. An archetype entry's whole point is a role+outfit
 * description ("a cheerful farm girl in a soft linen dress... a straw
 * basket"), which would directly CONTRADICT a costume pick ("wearing a
 * pumpkin costume") — two competing full-outfit descriptions on one figure.
 * Instead this path builds a minimal costumed-human straight from the
 * atomic appearance axes already in pools.js (HAIRSTYLE/HAIR_COLOR/
 * EYE_COLOR/SKIN_TONE, gender-matched) + this path's own COSTUME/ACTION
 * picks — see pickCostumedHuman() below. SKIN_TONE stays the standing
 * full-natural-range, zero-ethnic-label pool (hard refusal, do not add
 * ethnic/national/regional labels here or anywhere on this bot).
 *
 * HEADCOUNT — this is a "0/1/2/3 costumed figures" roll (like autumn-
 * village-market/harvest-festival), adapted per Kevin's brief: a costume
 * parade with NOBODY in costume doesn't serve the concept, so the roll can
 * never produce a literal empty scene. ~60% of renders include 1-3 costumed
 * HUMAN figures (biased toward 2, "a parade reads better with a little
 * group"), each optionally joined by a bonus costumed animal. The other
 * ~40% skip humans entirely but GUARANTEE 1-2 costumed farm ANIMALS instead
 * of falling through to generic ambient life — a costumed-animal-only
 * parade is exactly as on-concept as a costumed-human one (Kevin's own
 * framing in the brief). Total cast is capped at 3 figures. A defensive
 * one-line fallback (belt-and-suspenders, should be unreachable given the
 * roll math) guarantees at least 1 costumed animal if the roll somehow
 * yields zero figures at all.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-halloween-costume-parade-*-pool.js
const COSTUME = require('../seeds/farmbot_halloween_costume_parade_costume.json');
const ACTION = require('../seeds/farmbot_halloween_costume_parade_action.json');
const SETTING = require('../seeds/farmbot_halloween_costume_parade_setting.json');
const ATMOSPHERE = require('../seeds/farmbot_halloween_costume_parade_atmosphere.json');

// Small path-local list (not a generated pool — plain farm-animal species
// nouns, no costume/action content, same "small path-local anchor set"
// pattern as spring-planting-day.js's PLANTING_ANCHOR). Kept deliberately
// short and simple; the COSTUME/ACTION picks carry all the real variety.
const FARM_ANIMAL_SPECIES = [
  'a fluffy little lamb',
  'a plump speckled hen',
  'a waddling white duckling',
  'a small spotted goat kid',
  'a round pink piglet',
  'a fuzzy brown bunny',
  'a friendly floppy-eared farm dog',
  'a sleek striped barn cat',
  'a woolly grey sheep',
  'a gentle little calf',
  'a curious pony foal',
  'a bright-eyed barnyard donkey foal',
];

// Manual filter on the untagged, bot-wide CAMERA_COMPOSITION pool (see
// FARMBOT_PATH_BUILD_STATE.md — "even the untagged CAMERA_COMPOSITION pool
// carries physical-setting/scale assumptions" + the dwarfing-language
// re-pollution watch-item). This is the single highest camera-safety-risk
// path in the whole roster (a "parade/procession" concept practically
// invites a naive "walking away down the path" framing) so this filter
// drops BOTH classes of risk explicitly: any residual back-turned/rear-view
// wording AND any scale-dissolving "tiny/dwarfed" framing that would make
// costumes unreadable at a glance (the whole point of a showcase moment is
// that every costume reads clearly).
const CAMERA_SAFE = pools.CAMERA_COMPOSITION.filter(
  (e) =>
    !/tiny|dwarf|small within|sweeping.*(landscape|hills|fields|vista|countryside)|rolling (fields|hills|landscape)|rooftops|distant pane|falling away|silhouette|over-?the-?shoulder|rear view|facing away|walking away|back turned|from behind/i.test(
      e
    )
);

/**
 * Build one costumed HUMAN cast entry — gender-matched appearance axes
 * (skips CHARACTER_ARCHETYPE entirely, see header note) + this path's own
 * COSTUME/ACTION picks. Shared axis keys ('parade_costume'/'parade_action')
 * across all cast members in a render so picker.pickWithRecency's built-in
 * within-render dedup (see botEngine.js createPicker) keeps every figure's
 * costume and action distinct from the others in the same shot.
 */
function pickCostumedHuman(picker, index) {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const genderNoun = gender === 'female' ? 'girl' : 'boy';
  const hairstyle = picker.pickWithRecency(
    pools.byTags(pools.HAIRSTYLE, [gender]),
    `parade_hairstyle_${gender}`
  );
  const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), 'parade_hair_color');
  const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), 'parade_eye_color');
  const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), 'parade_skin_tone');
  const costume = picker.pickWithRecency(COSTUME, 'parade_costume');
  const action = picker.pickWithRecency(ACTION, 'parade_action');
  return `${index}. A cheerful young ${genderNoun} in the costume parade.
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}
Wearing: ${costume}
Doing: ${action}`;
}

/** Build one costumed farm-ANIMAL cast entry — same shared-axis dedup. */
function pickCostumedAnimal(picker, index) {
  const species = picker.pickWithRecency(FARM_ANIMAL_SPECIES, 'parade_species');
  const costume = picker.pickWithRecency(COSTUME, 'parade_costume');
  const action = picker.pickWithRecency(ACTION, 'parade_action');
  return `${index}. ${species.charAt(0).toUpperCase()}${species.slice(1)}, a costumed farm-animal parade member.
Wearing: ${costume}
Doing: ${action}`;
}

module.exports = ({ sharedDNA, picker }) => {
  // ── HEADCOUNT ROLL — see header note. Never a literal figure-free parade.
  //
  // HUMAN CAP = 2, NOT 3 (round-1 QA finding, 2026-09-09): a 3-human cast
  // packs 3 full paragraphs (appearance + costume + action, each already a
  // full sentence) into one brief, and Sonnet's fixed maxTokens:400 output
  // budget on the shared botEngine.js callClaude() call truncated mid-
  // sentence before finishing figure 3 — the rendered image showed only the
  // FIRST figure actually wearing its costume, the other two in plain
  // clothes (the same cross-cutting "content late in a dense brief gets
  // thinned/dropped" mechanism documented in FARMBOT_PATH_BUILD_STATE.md,
  // here triggered by density rather than ordering — THE CAST is already
  // first). autumn-village-market's proven-safe precedent caps at 2 full
  // character picks; this path adds a THIRD per-figure content line
  // (costume+action vs. just archetype+hair/eye/skin) on top of that, so
  // capping at 2 humans (with an optional bonus animal for "little group"
  // energy — a short entry, not a full appearance block) keeps every cast
  // still within budget while keeping the group feel the brief asked for.
  const includeHuman = Math.random() < 0.6;
  let humanCount = 0;
  if (includeHuman) {
    humanCount = Math.random() < 0.45 ? 1 : 2;
  }
  let animalCount;
  if (includeHuman) {
    // Optional bonus critter joining the human parade — parade energy, not
    // guaranteed. Short entry (species+costume+action, no appearance block)
    // so it doesn't reintroduce the density problem above.
    animalCount = Math.random() < 0.35 ? 1 : 0;
  } else {
    // No-human branch: GUARANTEE 1-2 costumed animals — this path's own
    // valid, charming "no human" variant (per the brief), never a fallback
    // to generic ambient life.
    animalCount = Math.random() < 0.5 ? 1 : 2;
  }
  // Cap total cast at 3 figures — trim the bonus animal first, humans are
  // the primary content when present.
  if (humanCount + animalCount > 3) animalCount = Math.max(0, 3 - humanCount);
  // Defensive fallback (should be unreachable given the roll math above,
  // belt-and-suspenders per FARMBOT_PATH_BUILD_STATE.md's "guarantee
  // ambient life in the fully-empty branch" rule) — this path's own
  // equivalent guarantee is a costumed animal, not generic ambient life.
  if (humanCount === 0 && animalCount === 0) animalCount = 1;

  const castLines = [];
  let n = 1;
  for (let i = 0; i < humanCount; i++) castLines.push(pickCostumedHuman(picker, n++));
  for (let i = 0; i < animalCount; i++) castLines.push(pickCostumedAnimal(picker, n++));

  const totalFigures = castLines.length;
  const noHuman = humanCount === 0;

  const setting = picker.pickWithRecency(SETTING, 'parade_setting');
  const atmosphere = picker.pickWithRecency(ATMOSPHERE, 'parade_atmosphere');
  const camera = picker.pickWithRecency(CAMERA_SAFE, 'parade_camera');
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'parade_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE COSTUME PARADE — ${totalFigures} costumed figure${totalFigures > 1 ? 's' : ''} showing off together (the hero of the shot, establish this first, before the setting) ━━━
Every figure below is caught mid-parade or posed together for a proud
"look at us" moment, each costume simple, cute, and instantly recognizable
— never elaborate, realistic, or scary. Every costumed face is clearly
turned toward or angled at the viewer, fully visible and legible — NEVER
walking away from the camera, NEVER back-turned, NEVER shown from behind.
Each figure's named costume below is REQUIRED and must actually be
rendered on that figure's body — this is not optional decoration, every
single figure listed is unmistakably wearing its own named costume, never
shown in plain everyday clothes.
${castLines.join('\n')}

━━━ THE PARADE PATH (the outdoor route the parade moves along) ━━━
${setting}

━━━ SKY & LIGHT MOOD ━━━
${atmosphere}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  noHuman
    ? `render a joyful, proud little costume-parade moment — no human figure
anywhere in the frame, the costumed farm animal${totalFigures > 1 ? 's are' : ' is'} the entire show,
each one large enough to read clearly at a glance, its costume and
delighted expression fully visible and facing the viewer, never a distant
or tiny speck lost in the path around it. The decorated path is rendered
just as richly and lovingly as the animal${totalFigures > 1 ? 's' : ''}, never a bare or empty
backdrop.`
    : `render a joyful, proud little costume-parade moment — every costumed
figure named above appears clearly and individually visible in the frame,
large enough to read at a glance, never cropped out, shrunk to an
unreadable smudge, or merely gestured at, AND every single one of them is
actually wearing its own named Halloween costume — not one figure in this
parade is ever left in plain, ordinary, non-costumed everyday clothes,
that is the entire point of the scene. The decorated path is rendered
just as richly and lovingly as the costumed cast, never a bare backdrop.
Every face in the frame, human and animal alike, stays clearly separate
and fully legible, each keeping its own open pocket of air around it so
every expression and every costume detail reads clean and unambiguous.`
} no text, no words, no watermarks, gallery quality`;
};
