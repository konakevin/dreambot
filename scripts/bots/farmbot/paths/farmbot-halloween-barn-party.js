/**
 * FarmBot — farmbot-halloween-barn-party (SEASONAL path, 2026-09-09).
 *
 * SEASONAL, not a normal-rotation path — lives ONLY in bot.seasonalPaths.halloween
 * (see scripts/lib/botSeasonal.js), NEVER mixed into bot.paths[]. See that
 * module's header for why: the production path picker is a shuffle-bag that
 * fires every entry in bot.paths once per cycle, so a holiday path sitting
 * there would fire in July too. This file is registered in pathBuilders
 * (required by botEngine's dispatch) but the orchestrator adds the
 * seasonalPaths.halloween array entry separately — see the report for the
 * exact lines.
 *
 * CONCEPT: a cheerful Halloween party INSIDE a decorated barn — string
 * lights, carved jack-o-lanterns, hay-bale seating, a few farm animals
 * wearing small playful costume touches, maybe a character or two enjoying
 * the party. Matches every other bot's Halloween content in the fleet
 * (ChibiBot precedent, chibi-halloween-cozy.js / chibi-halloween-village.js):
 * "Playful family-friendly Halloween only: grinning jack-o-lanterns,
 * fun-not-scary... never real horror, gore, or genuine scares." FarmBot's
 * own hard identity (FARMBOT_COZY_NEUTRAL, "never dark, gritty, harsh, or
 * realistic") already covers this — Halloween content here is 100%
 * cheerful/cozy/costume-fun, zero spooky/eerie/dark atmosphere. "Kids'
 * Halloween party," never "haunted barn."
 *
 * GENUINELY DISTINCT from barn-animal-shelter-interior.js (checked first,
 * per FARMBOT_PATH_BUILD_STATE.md's "verify against the actual code"
 * lesson): that path's bespoke BARN_INTERIOR_PLACE pool is plain barn
 * ARCHITECTURE (hay loft, stalls, tools on pegs) with zero decoration or
 * costuming concept, and its ANIMAL_COMPANIONS picks are ordinary resting/
 * grazing animals, not costumed ones. This path's two bespoke hero pools —
 * HALLOWEEN_BARN_PARTY_DECOR (string lights, jack-o-lanterns, hay-bale party
 * seating, bunting, a treats table, an apple-bobbing tub) and
 * COSTUMED_ANIMALS (a goat in a witch hat, a chicken in a pumpkin-print
 * collar) — are the actual hero content, never reused from the plain-barn
 * pool.
 *
 * FOUR BESPOKE AXES (own gen scripts, own seed files, own pools — full-
 * bespoke, not shared, per the fleet-wide "never share pools/axes across
 * paths" rule):
 *   1. HALLOWEEN_BARN_PARTY_DECOR (120) — the decorated barn interior itself
 *      (string lights, hay-bale seating, jack-o-lanterns, bunting, corn
 *      stalks, a treats table, an apple-bobbing tub). Hero of the shot,
 *      always present.
 *   2. HALLOWEEN_BARN_PARTY_GLOW (119) — the MONEY SHOT: exactly how warm
 *      string-light + jack-o-lantern candlelight fills and washes the barn.
 *      Written with "dark"/"darkness"/"shadow"/"dusk"/"night"/"dim"/"gloom"
 *      banned from its own vocabulary at the SOURCE (see the gen script's
 *      header) — the highest-risk pool in this path for the documented
 *      dark+light-word contradictory-pairing bug (CLAUDE.md hard rule,
 *      root-caused on fishing-dock's "a dark glint of water" → literal
 *      glowing-beam split-frame artifact). ~65% roll (see ROUND-1 FIX note
 *      in the function body — trimmed from always-on to cut total bulk).
 *   3. HALLOWEEN_BARN_PARTY_COSTUMED_ANIMALS (120) — THE signature hero
 *      content per the brief. 1-2 real farm animals wearing exactly ONE
 *      small, simple, playful costume accessory each (a witch hat, a
 *      pumpkin-print bandana, a felt bat collar) — never a full costume,
 *      never human clothing. ALWAYS present, character or not — this is
 *      what guarantees a non-bare no-character render (see "sometimes no
 *      human" note below; a separate pools.pickPureSceneLife() fallback is
 *      unnecessary here because this pool already IS the guaranteed living
 *      presence, and it's the path's own signature content, not incidental
 *      ambient life). Placed FIRST in the template, ahead of even decor, and
 *      marked "required" (see ROUND-2 FIX note) — round-2 QA found the
 *      animal sometimes surviving in Sonnet's own output text but rendering
 *      invisible/under-weighted when the decor pick was unusually rich.
 *   4. HALLOWEEN_BARN_PARTY_ACTIVITY (117) — party actions (apple-bobbing,
 *      sipping cider, costuming an animal, carving a pumpkin), verb-first
 *      implied-subject phrasing matching the shared ACTIVITY pool's own
 *      convention. Only meaningful — and only picked — when a character is
 *      present.
 *
 * "SOMETHING NO HUMAN" RULE — HEADCOUNT ROLL, not a boolean (per the brief's
 * own suggestion: "given it's inherently a group/party scene, consider a
 * headcount-roll"). Started as autumn-village-market.js's exact split (44%
 * two / 16% one / 40% none) but REBALANCED in the round-1 maxTokens fix (see
 * function body) to 12% two / 48% one / 40% none — two full character blocks
 * is the single most expensive thing this template can draw, so it's now
 * rare rather than the most common outcome, while the bot-wide 60%
 * "has-a-character" rate stays intact. The animals+decor carry the "party"
 * feeling even at headcount 0 — a lively decorated barn full of costumed
 * animals, no human needed to read as a celebration.
 *
 * CHARACTER_ARCHETYPE byTags GOTCHA (documented, FARMBOT_PATH_BUILD_STATE.md):
 * checked directly — filterByTags(['farm','leisure']) is a total NO-OP on
 * this pool (67/116 entries are tagged 'ANY', which always passes regardless
 * of requested tags, so the "filtered" set is literally the full 116-entry
 * pool). Several bakery/market archetypes describe a fixed work-station prop
 * (leaning on a shop counter, carrying a serving tray, a shopkeeper's coin
 * purse/measuring tape) that's a physical-setting mismatch for a barn party
 * — same occupational-prop-mismatch risk flagged in the brief. Fixed with a
 * manual content filter (ARCHETYPE_INCOMPATIBLE, reused verbatim from
 * tropical-stream-crossing.js's proven filter — a barn party is exactly as
 * setting-general as a stream crossing, no reason to write a new one).
 *
 * CAMERA_COMPOSITION carries TWO separate risks for this path specifically,
 * both checked directly against the actual JSON: (1) the documented
 * tiny/dwarfed/sweeping/rolling-landscape dwarfing bug, and (2) 10 "barn
 * doorway" framing entries that literally contain "dark"/"shadow" in their
 * own text ("the bright world beyond contained within deep shadow") — if
 * picked, these would inject exactly the word class the glow pool works so
 * hard to avoid, right back in through the camera axis. Both filtered out
 * below (CAMERA_SAFE).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
//   scripts/gen-seeds/farmbot/gen-halloween-barn-party-decor-pool.js
//   scripts/gen-seeds/farmbot/gen-halloween-barn-party-glow-pool.js
//   scripts/gen-seeds/farmbot/gen-halloween-barn-party-costumed-animals-pool.js
//   scripts/gen-seeds/farmbot/gen-halloween-barn-party-activity-pool.js
const DECOR = require('../seeds/farmbot_halloween_barn_party_decor.json');
const GLOW = require('../seeds/farmbot_halloween_barn_party_glow.json');
const COSTUMED_ANIMALS = require('../seeds/farmbot_halloween_barn_party_costumed_animals.json');
const PARTY_ACTIVITY = require('../seeds/farmbot_halloween_barn_party_activity.json');

// Manual archetype filter (byTags is a no-op on this pool — see header note
// above). Reused verbatim from tropical-stream-crossing.js's proven filter:
// excludes occupation archetypes carrying a fixed work-station prop
// physically incompatible with a barn party (a shop counter, a serving
// tray, a potter's kiln, a carpenter's tool belt, an innkeeper's tavern
// props).
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|café|cafe|coffee|dish towel|teacup|tray|shopkeeper|measuring tape|ledger|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm)\b/i;
const PARTY_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered PARTY_ARCHETYPES above instead of the raw
// pool — see header note. Uses only pools.js's exported pieces, no pools.js
// edit.
function pickPartyCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(PARTY_ARCHETYPES, `${axisPrefix}_archetype`);
  const gender = pools.genderOf(archetype) || 'ANY';
  const hairstyle = picker.pickWithRecency(pools.byTags(pools.HAIRSTYLE, [gender]), `${axisPrefix}_hairstyle`);
  const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), `${axisPrefix}_hair_color`);
  const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), `${axisPrefix}_eye_color`);
  const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), `${axisPrefix}_skin_tone`);
  return `${archetype.description}
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}`;
}

// CAMERA_COMPOSITION is untagged and carries two setting-incompatible risks
// for this indoor party scene — see header note. Filtered broadly (not just
// one keyword, per the documented pool-scale-up re-pollution lesson).
const CAMERA_INCOMPATIBLE =
  /\b(tiny|dwarfed|sky dominating|sweeping|rolling|farmhouse|village|rooftops?|dark|darkness|shadow|shadows|dusk|night|dim|gloom)\b/i;
const CAMERA_SAFE = pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e));

module.exports = ({ sharedDNA, picker }) => {
  // ⭐ ROUND-1 FIX (maxTokens): the original template stacked FOUR bespoke
  // hero blocks (decor + glow + 1-2 animals) PLUS up to 2 full character
  // blocks PLUS activity, and put the tone/cast-grounding sentence LAST.
  // All 5 round-1 test renders came back with Sonnet's own output cut off
  // MID-WORD (confirmed via ai_prompt) — 2/5 lost the costumed animal
  // entirely, and 1/5 lost the grounding sentence entirely, which let Flux
  // default to a moody OUTDOOR NIGHT scene instead of a cheerful lit barn
  // interior. Fixed two ways, matching the documented cross-cutting lesson
  // (FARMBOT_PATH_BUILD_STATE.md): (1) a short THE MOMENT block, stating the
  // cheerful/interior/cast-correct tone, now goes FIRST — ahead of even the
  // decor — so it survives any truncation regardless of how the rest of the
  // brief gets thinned; (2) total bulk cut hard: GLOW is now a 65% roll (was
  // always-on), a second animal is now a 35% roll (was 50%), ACTIVITY is
  // skipped on the rare 2-character draw, and the verbose closing paragraph
  // (which duplicated content THE MOMENT already covers, plus a redundant
  // "no text/no words" line the engine's own promptSuffixByMedium already
  // appends mechanically) was removed outright rather than shortened.
  const roll = Math.random();
  // Rebalanced from autumn-village-market.js's 44/16/40: two full character
  // blocks is the single most expensive thing this template can draw, so
  // it's now rare (12%) rather than the most common outcome, while keeping
  // the bot-wide 60% "has at least one character" rate intact (12+48=60).
  const headcount = roll < 0.12 ? 2 : roll < 0.6 ? 1 : 0;

  const decor = picker.pickWithRecency(DECOR, 'barn_party_decor');
  const glow =
    Math.random() < 0.65 ? picker.pickWithRecency(GLOW, 'barn_party_glow') : null;

  // COSTUMED ANIMALS — always present (party's own signature hero content,
  // guarantees a non-bare no-character render on its own; see header note on
  // why pools.pickPureSceneLife() is unnecessary here). Animal 1 always
  // picked; ~35% chance of a second, distinct animal (trimmed from 50% —
  // see maxTokens fix note above).
  const animal1 = picker.pickWithRecency(COSTUMED_ANIMALS, 'barn_party_animal');
  let animal2 = null;
  if (Math.random() < 0.35) {
    const candidate = picker.pickWithRecency(COSTUMED_ANIMALS, 'barn_party_animal');
    if (candidate !== animal1) animal2 = candidate;
  }
  const animalsBlock = animal2 ? `${animal1}\n${animal2}` : animal1;

  const characterA = headcount >= 1 ? pickPartyCharacter(picker, 'barn_party_character_a') : null;
  const characterB = headcount >= 2 ? pickPartyCharacter(picker, 'barn_party_character_b') : null;

  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when at least one character is present. Skipped on the
  // 2-character draw specifically to keep that already-dense case leaner.
  const activity =
    headcount === 1 ? picker.pickWithRecency(PARTY_ACTIVITY, 'barn_party_activity') : null;

  const camera = picker.pickWithRecency(CAMERA_SAFE, 'barn_party_camera');

  // ⭐ ROUND-2 FIX: round-1-post-fix QA (5 renders) showed the truncation
  // crisis was solved (grounding tone/cast now survives every render), but
  // 2 residual issues, traced via ai_prompt: (1) one no-character render's
  // costumed animal WAS in Sonnet's own text but appeared only in 2 short
  // sentences tacked on at the very end, after an unusually rich decor pick
  // had already spent most of the budget, and the animal never rendered
  // visibly; (2) one render's DECOR pick happened to mention a
  // "jack-o-lanterns on the windowsill" detail, and FARMBOT_COZY_NEUTRAL's
  // own "glimpsed through a window" clause combined with it to produce a
  // literal window showing a dark starry night sky — contradicting this
  // path's cheerful/bright identity. Fixed by (1) moving THE COSTUMED ANIMAL
  // section ahead of THE DECORATED BARN below and marking it "required...
  // never a small background detail" (the same forceful-language fix that
  // solved papaya-guava-orchard.js's identical guaranteed-content-silently-
  // dropped bug), and (2) adding an explicit positive daylight-window
  // sentence to THE MOMENT block.
  const castLine = characterA
    ? `${characterB ? 'Two clearly visible celebrants are' : 'One clearly visible celebrant is'} enjoying the party, each face kept clearly separate with open air around it.`
    : 'No human figure anywhere in the frame — the costumed animal(s) and the decorated barn carry the whole festive moment.';

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE MOMENT (essential — read first) ━━━
A cheerful, family-friendly Halloween party fills the INTERIOR of a warmly decorated barn — playful and
fun, never scary, always warmly and brightly lit, one single continuous interior scene (not glimpsed
through a doorway or window from outside). If any window appears, it shows soft warm daylight beyond,
never a dark or starry night sky. Every jack-o-lantern grins cheerfully. ${castLine}

━━━ THE COSTUMED ANIMAL${animal2 ? 'S' : ''} (required — a clearly visible, prominent presence in the frame, never a small background detail) ━━━
${animalsBlock}

━━━ THE DECORATED BARN (hero) ━━━
${decor}${glow ? `\n${glow}` : ''}
${characterA ? `\n━━━ THE CELEBRANT${characterB ? 'S' : ''} ━━━\n${characterA}\n${characterB || ''}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}`;
};
