/**
 * AlphaBot candidate — chibi-pumpkin-patch (Halloween, destination: ChibiBot).
 *
 * A chibi-critter PUMPKIN-PATCH DERBY at golden hour: a band of adorable chibi
 * critters running a harvest farm entirely by themselves — hollowed-pumpkin
 * wagons, pumpkin-half soap-box derbies, hay-wagon hauls — raced and worked
 * across a warm autumn field while the light goes gold. Function-form,
 * fully self-contained (own 6 bespoke pools, no shared registry/archetype
 * wiring) so it can render standalone on AlphaBot before promotion.
 *
 * Cloned identity: ChibiBot's own CUTE_CUDDLY_COZY / STYLIZED_NOT_PHOTOREAL /
 * NO_PEOPLE / NO_DARK_NO_INTENSE / IMPOSSIBLE_BEAUTY / BLOW_IT_UP blocks
 * (required verbatim from alphabot/shared-blocks.js, the same byte-identical
 * copy chibibot's own paths use) — see ALPHABOT.md "a path proven under the
 * wrong config proves nothing." Prose structure mirrors chibibot's own
 * CHIBIBOT_CREATURE_OUTING archetype (the "band of friends out doing
 * something fun" register) since this is that same family of scene, just
 * function-form + Halloween-flavored.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: every figure in frame is an affirmatively
 * named CREATURE (real animal or cute fantasy critter) at chibi proportions —
 * NEVER a human, NEVER a human silhouette in a costume, NEVER a "trick or
 * treating kid." The patch is worked entirely by critters — no farmer, no
 * human hands on any rein.
 *
 * MONEY-SHOT axis = `vehicle` (ALWAYS present, never optional) — the specific
 * pumpkin-wagon / derby-cart / harvest-hoist moment that makes the render
 * instantly iconic. Everything else (setting, crew, harvest clutter, costume
 * flourish, surprise element) supports that one hero moment.
 *
 * Axes (8): patch_setting (pool, always) · money-shot vehicle (pool, always)
 * · jack_o_lantern (pool, always — a single carved, glowing jack-o-lantern
 * pinned to the NEAR foreground; added round 2 after QA found the prior
 * jack-o-lantern mention — buried at the very end of a long, action-packed
 * prompt as a passive "tucked among the vines" background aside — never
 * actually rendered by Flux across a run, so every render read as generic
 * autumn harvest rather than Halloween; this axis is deliberately its own
 * early, high-salience section right after the money shot) · crew_cast
 * (pool, 1 always + ~45% a 2nd) · costume_flourish (pool, ~50% gate,
 * applied as a note on one crew member — never mandatory, so critters
 * don't homogenize into "the one in the hat") · harvest_detail (pool, ~60%
 * gate) · surprise_element (pool, ~45% gate) · golden_hour_light (inline
 * fixed array — always golden hour by concept, so no generated pool needed,
 * just picked for variety in exactly how the light reads).
 *
 * Tone: PLAYFUL Halloween only — grinning jack-o-lanterns, a friendly
 * cartoonish ghost at most, never genuine horror/gore/scares (positive
 * register throughout; the "no dark" rule is stated as what TO be, not just
 * what not to be).
 *
 * ROUND 4 FIX: QA found the assembled prompt blowing 2x past its own stated
 * word budget (measured 227-253 words vs. the 90-120 the template asked
 * for) — Sonnet was quoting each axis's raw pool text near-verbatim plus
 * its own added embellishment rather than compressing. One render's output
 * was visibly cut off mid-sentence by this overrun, and across all three
 * renders the specific, distinctive props (the derby cart/ribbon/confetti,
 * the jack-o-lantern's carved face and candle glow, the catamaran/
 * corn-shock-teepees/owl/windmill) were the ones Flux dropped — the model
 * kept only the hero creature + generic pumpkins-and-golden-light ambiance,
 * reading as pretty-but-generic autumn wallpaper instead of the bold, prop-
 * specific derby concept. Fix: the closing instruction now sets a hard
 * 130-word cap, explicitly tells Sonnet to compress each section to its
 * sharpest few words instead of quoting it whole, and names a cut order
 * (harvest → surprise → setting) that protects the money-shot vehicle and
 * the jack-o-lantern — the two lines that actually make the scene read as
 * THIS derby and THIS holiday — from ever being the ones sacrificed.
 *
 * ROUND 4 RE-QA FIX #2 (word cap alone wasn't enough): even within budget, a
 * render with 2 crew rolled (45% chance) PLUS the surprise_element roll (its
 * own 45%, independent) PLUS harvest_detail could stack 3+ distinct named
 * characters into one frame on top of the vehicle + jack-o-lantern. Re-QA
 * render #2 (duckling + piglet crew, "comic crows lined up on a fence rail"
 * surprise, busy dock/pond setting) rendered the piglet as an unrecognizable
 * blob shoved into the extreme frame edge while Flux kept only the easier,
 * more "default-cute" duckling — a genuine Flux hero-loss failure, not just
 * a style miss. Fix: surprise_element is now skipped whenever 2 crew already
 * rolled, so a 2-crew frame never also competes with a 3rd surprise
 * character (harvest_detail is untouched — it's background set-dressing,
 * not a competing character).
 */

const blocks = require('../shared-blocks');

const PATCH_SETTINGS = require('../seeds/chibi_pumpkin_patch_scene.json');
const VEHICLES = require('../seeds/chibi_pumpkin_patch_vehicle.json');
const CREW = require('../seeds/chibi_pumpkin_patch_crew.json');
const HARVEST_DETAILS = require('../seeds/chibi_pumpkin_patch_harvest.json');
const JACKOLANTERNS = require('../seeds/chibi_pumpkin_patch_jackolantern.json');
const COSTUME_FLOURISHES = require('../seeds/chibi_pumpkin_patch_costume.json');
const SURPRISE_ELEMENTS = require('../seeds/chibi_pumpkin_patch_surprise.json');

// Short fixed list — always golden hour by concept, so this doesn't need a
// generated pool; picked for variety in exactly how the light reads.
const GOLDEN_HOUR_LIGHT = [
  'low golden sun raking long amber light across the vines',
  'warm honey-gold dusk deepening to soft violet at the treeline',
  'a candy-corn sunset streaked in pink, orange, and gold',
  'the sun sinking behind the barn roofline, every edge rimmed in fire-gold light',
  'a harvest-gold late afternoon, long blue shadows stretching between the rows',
  'a hazy amber sunset with dust and chaff glowing in the low light',
  'the last warm light of day pooling gold across the whole field',
  'a rose-gold dusk with the first star just appearing over the barn roof',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(PATCH_SETTINGS, 'chibi_pumpkin_patch_scene');
  const vehicle = picker.pickWithRecency(VEHICLES, 'chibi_pumpkin_patch_vehicle');
  const jackolantern = picker.pickWithRecency(JACKOLANTERNS, 'chibi_pumpkin_patch_jackolantern');
  const light = picker.pick(GOLDEN_HOUR_LIGHT);

  const crew = [picker.pickWithRecency(CREW, 'chibi_pumpkin_patch_crew')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(CREW, 'chibi_pumpkin_patch_crew');
    if (second !== crew[0]) crew.push(second);
  }
  // Costume flourish is OPTIONAL (~50%) and never on every entry — a
  // signature accessory forced onto every render homogenizes the cast into
  // "the one in the hat." When it rolls, it dresses ONE crew member, not a
  // separate character.
  const costume =
    Math.random() < 0.5
      ? picker.pickWithRecency(COSTUME_FLOURISHES, 'chibi_pumpkin_patch_costume')
      : null;
  const crewLines = crew.map((c, i) => `${i + 1}. ${c}`);
  if (costume) crewLines[0] += ` — ALSO wearing: ${costume}`;

  const harvest =
    Math.random() < 0.6
      ? picker.pickWithRecency(HARVEST_DETAILS, 'chibi_pumpkin_patch_harvest')
      : null;
  // ROUND 4 FIX #2: surprise_element is itself an ADDITIONAL small creature or
  // character more often than not (crows, a ghost, a barn owl, chipmunk
  // cheeks, a hedgehog) — stacking it on top of a already-rolled 2nd crew
  // member pushes the frame to 3+ distinct named characters plus the vehicle
  // and jack-o-lantern, which is exactly the crowding QA traced a hero-loss
  // failure to: round-4 render #2 (duckling + piglet crew, "comic crows lined
  // up on a fence rail" surprise, plus a busy dock/pond setting) rendered the
  // piglet as an unrecognizable, nearly-off-frame blob while Flux kept only
  // the easier, more "default-cute" duckling — a real Flux failure artifact,
  // not just a stylistic miss. Skip the surprise roll whenever 2 crew already
  // rolled, so the extra character budget goes to making THOSE two read
  // clearly instead of competing with a third.
  const surprise =
    crew.length < 2 && Math.random() < 0.45
      ? picker.pickWithRecency(SURPRISE_ELEMENTS, 'chibi_pumpkin_patch_surprise')
      : null;

  return `You are writing a PLAYFUL HALLOWEEN chibi-critter PUMPKIN-PATCH DERBY scene for a cute-critter dream bot — a little band of adorable chibi critters who run the whole harvest farm themselves, caught mid-moment at golden hour. Viewer reaction: "look at these little critters go!" Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE: CRITTERS ONLY ━━━
Every figure in frame is an affirmatively-named CREATURE — a real animal or a cute fantasy critter — at chibi proportions (oversized round head, big glossy multi-catchlight eyes, soft stubby body). NEVER a human, NEVER a human silhouette, NEVER a costumed human, NEVER a "trick-or-treating kid." This patch is worked entirely BY critters — no farmer anywhere, no human hands on any rein or handle.

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}
PLAYFUL Halloween only: grinning jack-o-lanterns, a friendly cartoonish ghost at most (soft-rounded, cheerful, never eerie). This is a harvest-festival celebration, not a haunt.

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MONEY SHOT — the signature moment, must read instantly ━━━
${vehicle}

━━━ HALLOWEEN SIGNATURE PROP — non-negotiable, must be clearly visible near the FRONT of the frame ━━━
${jackolantern}
This is what makes the scene read as HALLOWEEN, not a generic autumn harvest — it must be a real, close, glowing object the eye lands on, never a distant speck lost in the background clutter.

━━━ THE CREW (1-2 critters mid-action, working the money shot above) ━━━
${crewLines.join('\n')}

━━━ THE PATCH (the place — keep its layered foreground/midground/background) ━━━
${setting}
${harvest ? `\n━━━ HARVEST DETAIL (background set-dressing) ━━━\n${harvest}` : ''}
${surprise ? `\n━━━ SURPRISE ELEMENT (small tucked-away touch) ━━━\n${surprise}` : ''}

${blocks.BLOW_IT_UP_BLOCK}

━━━ GOLDEN-HOUR LIGHT ━━━
${light}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION — A CANDID ACTION MOMENT, NOT A LINEUP ━━━
Wide-ish, three-quarter or off-center framing that keeps the WHOLE money-shot moment and the crew readable together — never a tight macro that loses the vehicle or the place. Depth in three layers: a close foreground detail, the money-shot action in the midground, the patch built out behind. Something is clearly IN MOTION (rolling, racing, hauling, towing) — never a static posed lineup.

Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, HARD CAP 130 words — count as you go. The sections above are RAW MATERIAL to compress, not text to quote in full: boil each one down to its sharpest 3-6 word phrase rather than copying whole sentences, and never pad a phrase with extra adjectives of your own on top of what's given — a stuffed, padded prompt makes Flux drop the props that matter and paint a generic pumpkin patch instead. If you still can't fit everything, cut in this order — harvest detail first, then surprise element, then setting down to one layer — but the money-shot vehicle and the jack-o-lantern are NEVER shortened or dropped; they are the two lines this whole scene has to sell. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Start immediately with the scene content.`;
};
