/**
 * FarmBot — farmbot-halloween-pumpkin-carving (SEASONAL path, 2026-09-09).
 *
 * Lives in `bot.seasonalPaths.halloween` (see scripts/lib/botSeasonal.js) —
 * NOT the normal bot.paths[] rotation. Drawn only during the Halloween
 * calendar window via the seasonal gate, entirely excluded from the
 * fleet-wide shuffle-bag the rest of FarmBot's paths cycle through.
 *
 * CONCEPT: an INTIMATE, small, personal pumpkin-carving moment — 1-2
 * characters (or nobody at all) carving a jack-o'-lantern on their own
 * porch step or garden table, guts and seeds scattered nearby, a carving
 * tool resting close at hand, a warm candle/lantern/string-light glow, and
 * maybe a mug of cider or a knit blanket close by. Playful, family-friendly
 * Halloween only — the carved face is always cheerful, grinning, silly,
 * described positively — never sinister, never scary.
 *
 * ⭐ CRITICAL identity distinction from the EXISTING normal-rotation
 * seasonal-festival.js's "pumpkin-festival" concept (a carving CONTEST
 * table, ring-toss booth, orange-and-black bunting, a "biggest pumpkin"
 * display — crowd/public-festival SCALE): this path is the opposite —
 * exactly one pumpkin, one small personal corner, close intimate framing,
 * nobody else anywhere in view. Baked in at every layer: the bespoke
 * MOMENT pool describes exactly one pumpkin (never a table/row of many),
 * the SETTING pool is explicitly one home's own quiet nook (never a public
 * gathering space, no bunting/booths/contest language), the closing
 * reinforcement paragraph states outright "not a public festival or crowd
 * scene," and CAMERA_COMPOSITION is filtered down to only medium/intimate-
 * close/cozy-interior/foreground-framing entries (no wide establishing
 * shots, no village/rooftop framings).
 *
 * AXES (4 bespoke pools, 120 entries each — MVP-25 scaled straight to full
 * depth per Kevin's direction to match ChibiBot's own Halloween-pool
 * precedent, which seeded at full depth directly rather than MVP-then-scale):
 *   1. MOMENT   (always, HERO — read first) — the pumpkin itself, mid
 *                carving-project: lid off / one eye cut / pulp+seeds
 *                scooped / finished and lit. PLACE/OBJECT-only phrasing (no
 *                implied person) so the same entry reads naturally with or
 *                without a character present. The carved face is always an
 *                explicit, concrete, cheerful GEOMETRIC SHAPE only (e.g.
 *                "two triangle eyes and a jagged toothy grin") — never
 *                implies letters/numbers/readable marks of any kind.
 *   2. SETTING  (always) — the small personal porch-step/garden-table nook.
 *   3. GLOW     (always, MONEY SHOT) — the exact candle/lantern/string-light
 *                glow washing the scene, mirrors chibi-halloween-cozy's own
 *                dedicated glow axis. Dark+light contradictory-pairing ban
 *                and literal-not-metaphorical light language baked in at
 *                the seed-gen level (fishing-dock lesson).
 *   4. COZY_DETAIL (~50% conditional) — one small warm touch (cider, a
 *                blanket, roasted seeds, mittens) — deliberately NOT on
 *                every render, mirrors chibi-halloween-cozy's optional
 *                accessory axis (a mandatory prop on every render
 *                homogenizes the scene).
 * Plus a short hand-authored CARVING_ACTIONS list (not a generated pool —
 * tightly scoped, same pattern as chibi-halloween-cozy's ACCESSORIES and
 * seasonal-festival's CONCEPT_ACTIVITY) for the specific carving gesture
 * when a character is present.
 *
 * "Sometimes no human" rule (bot-wide 60/40 split): includeCharacter =
 * Math.random() < 0.6. On the no-character roll this does NOT force an
 * awkward empty version of an inherently social activity — it reads as a
 * quiet "moment just finished" still-life (the freshly carved pumpkin
 * sitting alone, the tool set down beside it), with guaranteed ambient life
 * via pools.pickPureSceneLife (never a bare/lifeless render). Per the
 * papaya-guava-orchard maxTokens lesson, the CAST-determining sentence for
 * the no-character branch — including the guaranteed ambient-life pick's
 * concrete description — is stated in full up front (not just referenced),
 * and repeated again in the closing paragraph for redundancy.
 *
 * Standing bot-wide bans respected here: zero ethnic/national/regional
 * skin-tone labels (via pools.pickCharacter → SKIN_TONE, pure visual range
 * only), no over-the-shoulder/rear-view/back-turned camera framings, no
 * dwarfing/scale-dissolution framings, positive-only carved-face framing.
 *
 * ⭐ Rounds 2-5 QA finding — MITIGATED, NOT fully eliminated (documented
 * residual risk, see the characterB roll below for full detail): a
 * two-character draw's SECOND person was silently dropped from the actual
 * RENDERED IMAGE on 3/3 real test draws checked, even after three layered
 * fixes (early CAST placement, dropping cozyDetail/animal/magic when
 * characterB is present, shortening characterB to just its archetype
 * line). Sonnet's fixed-maxTokens brief-writing call reliably outruns two
 * full character descriptions plus a full scene. Every failure still
 * produced a clean, fully on-brand SOLO render (never broken/empty) — a
 * content-completeness gap, not a correctness bug. Rate lowered to 15% as
 * a final mitigation; flagged for whoever next revisits this path, same
 * "flag, don't over-grind on stochastic variance" posture the bot's own
 * QA policy calls for. The SEPARATE no-character guaranteed-companion path
 * (pools.pickPureSceneLife) was ALSO found failing early on (round 3-4)
 * and IS considered fixed — verified clean/vivid across 3 later renders
 * (piglets, twice) after moving its content to a dedicated early section
 * and freeing the same budget.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-halloween-pumpkin-carving-*-pool.js
const MOMENT = require('../seeds/farmbot_halloween_pumpkin_carving_moment.json');
const SETTING = require('../seeds/farmbot_halloween_pumpkin_carving_setting.json');
const GLOW = require('../seeds/farmbot_halloween_pumpkin_carving_glow.json');
const COZY_DETAIL = require('../seeds/farmbot_halloween_pumpkin_carving_cozy_detail.json');

// Small fixed list (not a generated pool — tightly scoped to this one
// path's specific carving gesture) — the with-character branch's specific
// mid-action gesture, layered on top of the MOMENT pool's object-state
// description. Deliberately no letters/numbers/readable content anywhere.
const CARVING_ACTIONS = [
  "leans in close over the pumpkin, carefully guiding a small knife along the last curve of one triangle eye",
  'scoops a handful of stringy pale pulp and seeds into a bowl, sleeves pushed up past the elbows',
  "holds the finished jack-o'-lantern up at arm's length, admiring its grin with a delighted smile",
  'presses the tip of the knife gently into the rind, starting the first careful line of the mouth',
  "brushes a few loose seeds off the pumpkin's side with the back of one hand before making the next cut",
  'tilts their head, comparing the two carved eyes to make sure they match before starting the smile',
  'sets the finished lantern gently down on the step, then reaches to light the candle tucked inside',
  'wipes a little sticky pumpkin juice from their fingers with a cloth, pausing to admire the work so far',
  "traces a fingertip lightly along the freshly carved edge, checking it's smooth before setting the knife down",
  "lifts the carved lid free and peers inside, checking there's room enough for the candle to fit",
];

// CAMERA_COMPOSITION carries latent physical-setting assumptions even though
// the pool is untagged (fishing-dock lesson), and this path's identity is
// explicitly INTIMATE/close-scale — filter down to only the categories that
// fit a small personal moment (medium framing / intimate close-up / cozy
// interior / soft foreground framing), and defensively re-exclude any
// over-the-shoulder/rear-view/dwarfing entry even though those were already
// removed from the shared pool at the source (2026-09-09 fix).
const CAMERA_SAFE = pools.CAMERA_COMPOSITION.filter((e) => {
  const t = (typeof e === 'string' ? e : e.description).toLowerCase();
  const banned =
    /shoulder|rear|behind|facing away|back turned|dwarf|tiny within|tiny against|rendered tiny|small within|set small|wide establishing|village|barn doorway|farmhouse window|high[- ]angle|high, sweeping|rooftops/;
  const allowed = /medium framing|intimate close-up|close intimate framing|cozy interior|cosy interior|soft foreground foliage/;
  return allowed.test(t) && !banned.test(t);
});

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule, bot-wide 60/40 split.
  const includeCharacter = Math.random() < 0.6;

  const characterA = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'pumpkin_carving_character_a')
    : null;
  // ~15% of with-character renders carve together as a pair — intimate
  // 1-2-figure moment, never more.
  // ⭐ Round 2/4/5 QA finding (mitigated, NOT fully eliminated — documented
  // residual risk, see file-header note): characterB has been observed
  // silently dropped from the final RENDER on every one of 3 real
  // two-character test draws checked (verified via both the raw ai_prompt
  // cutting off mid-description AND the rendered image showing only one
  // person), despite three layered mitigations: casting the CAST block
  // early, freeing budget by dropping cozyDetail/animal/magic whenever
  // characterB is present, and shortening characterB to just its archetype
  // line (dropping Hair/Eyes/Skin). Two full pools.pickCharacter() blocks
  // plus a full scene (MOMENT+SETTING+GLOW) simply outruns Sonnet's fixed
  // output budget too reliably for ordering/trimming alone to guarantee.
  // Rate lowered 25%→15% as a final mitigation to reduce real-world
  // exposure; every observed failure still produced a fully clean, on-brand
  // SOLO render (never a broken/empty image) — this is a content-
  // completeness risk, not a hard-rule violation. Matches the exact
  // "flagged, not fully fixed, low-rate stochastic noise" pattern already
  // accepted elsewhere in this bot (see FARMBOT_PATH_BUILD_STATE.md's
  // SKIN_TONE-welding watch-item).
  const characterBFull =
    includeCharacter && Math.random() < 0.15
      ? pools.pickCharacter(picker, ['farm', 'leisure'], 'pumpkin_carving_character_b')
      : null;
  const characterB = characterBFull ? characterBFull.split('\n')[0] : null;

  const carvingAction = includeCharacter
    ? CARVING_ACTIONS[Math.floor(Math.random() * CARVING_ACTIONS.length)]
    : null;

  const moment = picker.pickWithRecency(MOMENT, 'pumpkin_carving_moment');
  const setting = picker.pickWithRecency(SETTING, 'pumpkin_carving_setting');
  // MONEY SHOT — always rolled, never conditional (see file header).
  const glow = picker.pickWithRecency(GLOW, 'pumpkin_carving_glow');
  // ⭐ Round-2/3 QA finding: EVERY render's Sonnet output (checked across 9
  // real posted renders, with-character, two-character, and no-character
  // alike) hit the fixed maxTokens brief-writing ceiling and got cut off
  // near the end — confirmed via the raw ai_prompt text ending mid-word.
  // Two concrete real-world failures traced to this: (1) a two-character
  // draw's SECOND character silently vanished from the render entirely
  // (characterB's description was mid-sentence when the output ended), and
  // (2) a no-character render's GUARANTEED ambient-life pick
  // (pools.pickPureSceneLife, never supposed to be null) never clearly
  // reached the final image — the render showed only ambiguous sky wisps,
  // and the ai_prompt cut off exactly as Sonnet started describing
  // something "at the meadow edge." Same root mechanism as the documented
  // rainy-farmhouse-morning / barn-animal-shelter-interior / papaya-guava-
  // orchard maxTokens bugs, just hitting a wider set of branches here than
  // first suspected. Fix: COZY_DETAIL — the least essential, purely
  // decorative axis — is now RESTRICTED to the single lowest-content
  // branch (one character, no companion animal competing for room),
  // freeing headroom everywhere else for essential content (a second
  // character, or the guaranteed ambient-life pick) to survive intact.
  const cozyDetail =
    includeCharacter && !characterB && Math.random() < 0.5
      ? picker.pickWithRecency(COZY_DETAIL, 'pumpkin_carving_cozy_detail')
      : null;
  const camera = picker.pickWithRecency(
    CAMERA_SAFE.map((e) => (typeof e === 'string' ? e : e.description)),
    'pumpkin_carving_camera'
  );

  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animalChance = includeCharacter ? 0.35 : 0.8;
  const animal = characterB
    ? null // same budget-headroom fix as cozyDetail above
    : includeCharacter
      ? Math.random() < animalChance
        ? picker.pickWithRecency(animalPool, 'pumpkin_carving_animal')
        : null
      : pools.pickPureSceneLife(picker, {
          animalPool,
          animalChance,
          ambientTags: ['outdoor'],
          axisPrefix: 'pumpkin_carving',
        });

  // Same budget-headroom fix as cozyDetail above — restricted to the
  // single-character branch only (round-4 finding: the no-character
  // branch's guaranteed companion pick needs all the spare budget it can
  // get too, not just the characterB branch).
  const magic =
    includeCharacter && !characterB && Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'pumpkin_carving_magic')
      : null;

  // ⭐ maxTokens lesson (FARMBOT_PATH_BUILD_STATE.md), STRENGTHENED after the
  // round-2/3 finding above: essential content (a second character, or the
  // no-character branch's GUARANTEED ambient-life pick) gets its own SHORT,
  // DEDICATED, EARLY section — right after the cast, well before setting/
  // glow/camera — rather than trusting a single inline mention or a
  // far-away closing-paragraph restatement (proven, on 9/9 real renders, to
  // never survive Sonnet's fixed-budget output at all). The no-character
  // branch's animal is NOT optional — it is stated twice, close together,
  // near the very top.
  const castBlock = includeCharacter
    ? `━━━ THE CARVER${characterB ? 'S' : ''} (essential — read first) ━━━
${characterA}${characterB ? `\n${characterB}` : ''}
${characterB ? 'The two of them are' : 'They are'} caught mid-moment: ${carvingAction}. A clear, prominent, unmistakable presence in the frame, never distant or incidental.`
    : `━━━ THE CAST (essential — read first) ━━━
No human figure anywhere in the frame — this is a quiet moment that has just finished. The carving
tool has been set down, and the pumpkin now sits alone in its own small pool of light.`;

  // Guaranteed-content companion block — ALWAYS present for the no-character
  // branch (never optional), placed immediately after the cast so it is
  // among the very first things Sonnet reads, not competing with setting/
  // glow/camera content for the tail end of its output budget.
  const companionBlock = !includeCharacter
    ? `\n━━━ A REQUIRED SMALL PRESENCE (essential — read first) ━━━
This is a concrete, clearly-visible presence, not just background mood — it must actually appear,
plainly and recognizably, in the render: ${animal}.\n`
    : includeCharacter && animal
      ? `\n━━━ A SMALL COMPANION ━━━\n${animal}\n`
      : '';

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CARVED PUMPKIN (the hero of the shot — read first) ━━━
${moment}

${castBlock}
${companionBlock}
━━━ THE COZY SETTING ━━━
${setting}

━━━ THE GLOW — the money shot; honor this light exactly ━━━
${glow}
${cozyDetail ? `\n━━━ ONE COZY TOUCH ━━━\n${cozyDetail}\n` : ''}
━━━ CAMERA — INTIMATE, NOT A WIDE OR FESTIVAL-SCALE SHOT ━━━
${camera}
This is a small, personal, close-up moment — never a wide village or festival-scale shot, and
nobody else appears anywhere in the frame or background. The glow above is the dominant light
source in the whole frame: let it visibly shape shadows, catchlights, and warm color temperature
across everything nearby.
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  includeCharacter
    ? `render a warm, quiet, intimate Halloween pumpkin-carving moment — small and personal, close
range, never a public festival or crowd scene. The carved face is cheerful, grinning, silly, and
playful, never sinister or scary. Every face in the frame stays clearly separate and fully legible,
each with a visible gap of air between it and any other face.`
    : `no human figure anywhere in the frame — this is a quiet, cozy Halloween moment that has just
finished: the freshly carved pumpkin sits alone and cheerful in its own warm glow, the carving tool
set down beside it, nobody in sight. This is NOT a public festival or crowd scene — just one small
personal corner glowing softly in the evening. ${animal} appears as a real, naturally distinct
small presence living happily in this cozy corner — it is not optional background mood, it must
actually appear in the render.`
} no text, no words, no letters, no numbers carved or written anywhere, no watermarks, gallery quality`;
};
