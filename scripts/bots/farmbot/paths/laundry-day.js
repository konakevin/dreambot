/**
 * FarmBot — laundry-day (built 2026-09-08, wired via AlphaBot proving ground
 * 2026-09-09; see FARMBOT_PATH_BUILD_STATE.md / ALPHABOT.md).
 *
 * Always a pure still-life — no character mechanism exists on this path at
 * all (the 121-entry SCENES pool never names a person; each entry already
 * carries its own guaranteed small live detail — a butterfly, ladybug, or
 * spider's web — baked directly into the text).
 *
 * ⭐ TWO REAL BUGS found via round-1 AlphaBot QA (5 renders), root-caused
 * against the actual stored `ai_prompt`, not guessed from the image:
 *
 * 1. UNINVITED HUMAN CHARACTER (1/5 renders) — the original template never
 *    stated "no human figure anywhere in the frame." FARMBOT_COZY_NEUTRAL's
 *    own "any character in the frame is drawn just as cute..." language
 *    primed Flux to insert two uninvited chibi children into a render whose
 *    `ai_prompt` never mentioned a person at all. Same class as the
 *    documented papaya-guava-orchard.js cast-determination bug.
 * 2. PER-OBJECT PERSONIFICATION (2/5 renders) — Sonnet independently
 *    invented "round adorable anime-style sunflower faces" (not present in
 *    the SCENES pool text) on two separate renders, and Flux rendered every
 *    background sunflower with a drawn-on cartoon smiling face. Same class
 *    as the documented papaya-guava-orchard.js / lakeside-riverside-moment.js
 *    per-object-personification bug — character-eye language from the shared
 *    look register bleeding onto non-character scene elements with no human
 *    present to anchor it.
 *
 * FIXED the same proven way as papaya-guava-orchard.js: a short front-loaded
 * CAST block, stated FIRST (ahead of the scene description) so it can't be
 * truncated away, stating both the no-human fact and a positive-only
 * anti-personification guard — plus a closing reinforcement repeating the
 * no-human fact (guaranteed picks/instructions don't always survive Sonnet's
 * own paraphrase — repetition helps, see FARMBOT_PATH_BUILD_STATE.md).
 */

const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_laundry_day_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_laundry_day_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CAST (essential — read first): NO human figure appears anywhere in this scene ━━━
This is a quiet laundry-day still life, carried entirely by the hanging
fabric, the clothesline, and the garden around it — never a bare or lifeless
one. Every hanging item of laundry, every flower and leaf, and any small
creature present keeps its own true-to-life shape, color, and texture — the
scene's charm comes entirely from its warm linework, light, and color, never
from any added face or expression drawn onto an object.

━━━ LAUNDRY DAY (the hero of the shot) ━━━
${scene}

Reinforcing once more: no human figure anywhere in the frame. If a small
creature (a butterfly, ladybug, or similar) is named above, it keeps its own
natural, true-to-life face with its own clearly legible expression — never
an added cartoon face drawn onto any flower, leaf, or piece of fabric.

render every detail named above crisply, gallery quality`;
};
