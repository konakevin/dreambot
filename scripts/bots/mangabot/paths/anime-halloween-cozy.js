/**
 * AlphaBot candidate — anime-halloween-cozy (destination: MangaBot).
 *
 * Cloned onto MangaBot's identity per ALPHABOT.md ("a path proven under the
 * wrong config proves nothing") but written FULLY SELF-CONTAINED (function-
 * form, no shared-registry edits, seed pools required directly as JSON) so it
 * never touches alphabot/index.js, alphabot/pools.js, or alphabot/
 * shared-blocks.js while another candidate is being built in parallel.
 * MangaBot's own hard identity — hand-drawn anime illustration (Ghibli /
 * Shinkai / Kyoto Animation register, cel-shaded linework, painterly
 * backgrounds, NEVER photoreal / 3D-CGI / Western cartoon / B&W manga panel)
 * and characters described by role only, NEVER a named specific anime
 * character — is re-stated inline below rather than imported (matches the
 * pattern set by the chibi-halloween-cozy candidate).
 *
 * CONCEPT: a QUIET, INTIMATE Halloween-at-home moment — one anime character
 * (or two, sharing it) carving a pumpkin at the kitchen table, curled up
 * under a blanket watching a scary movie, or sorting a trick-or-treat candy
 * haul on the bedroom floor. Small, private, warm-lit — the opposite of a
 * wide festival/street scene (MangaBot already owns that register via
 * `festival-nights`). Playful, wholesome Halloween only: a "scary movie" is
 * cozy tension, never real dread; nothing bloody or genuinely frightening.
 *
 * AXES (7 total):
 *   1. character_1  (always)             — the anime character (role/
 *                                           archetype only, never named;
 *                                           ordinary human ethnicity + age/
 *                                           gender words are CORRECT here —
 *                                           this is a slice-of-life human
 *                                           cast, not a fantasy/creature/toy
 *                                           cast, so the usual non-human-
 *                                           language ban does not apply)
 *   2. character_2  (~40% conditional)   — "one character or two sharing
 *                                           it"; solo is just as valid as a
 *                                           duo, so this is a coin-flip, not
 *                                           a default-to-pair. Drawn from the
 *                                           SAME character pool as #1 (no
 *                                           separate pool needed).
 *   3. outfit       (always)             — cozy at-home loungewear. ~50% of
 *                                           the POOL's own entries weave in
 *                                           ONE small Halloween touch (a
 *                                           printed jack-o-lantern hoodie,
 *                                           pumpkin socks, cat-ear headband);
 *                                           the other ~50% are plain autumn-
 *                                           cozy with no Halloween touch at
 *                                           all. Baked into the pool content
 *                                           itself (not a runtime roll) so
 *                                           the signature touch stays
 *                                           roughly-half, never mandatory,
 *                                           per the "never homogenize into
 *                                           the same one guy" rule.
 *   4. activity     (always)             — the specific cozy Halloween
 *                                           moment (pumpkin carving / scary-
 *                                           movie blanket-nest / candy-haul
 *                                           sorting / 17 more cozy variants),
 *                                           written subject-free so it fits
 *                                           either a solo character or a duo.
 *   5. setting      (always)             — the small warm indoor nook.
 *   6. decor        (always)             — one playful spooky-but-friendly
 *                                           decor beat.
 *   7. glow         (always) MONEY SHOT  — the exact warm-vs-cool light
 *                                           interplay (jack-o-lantern/candle
 *                                           glow vs. a screen's flicker or
 *                                           blue dusk through the window) —
 *                                           a Shinkai-style lighting signature
 *                                           that is this path's iconic detail.
 *                                           Always-on (not conditional) —
 *                                           variety comes from its own
 *                                           25-entry pool, not from being
 *                                           optional (mirrors the chibi-
 *                                           halloween-cozy glow design).
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: the entire scene renders as HAND-DRAWN
 * ANIME/MANGA ILLUSTRATION (Ghibli/Shinkai/Kyoto-Animation register) — never
 * photoreal, never 3D-CGI, never Western cartoon, never a black-and-white
 * manga panel — and every character is a role/archetype only, never a named
 * specific anime character or franchise. Stated up front in the NON-
 * NEGOTIABLE block below.
 *
 * Known failure modes deliberately designed around:
 *   - human age/gender/ethnicity words are INTENTIONALLY used (this is a
 *     human slice-of-life cast, matching MangaBot's own `slice-of-life` path
 *     convention) — the "no human-age-noun" ban in the brief is scoped to
 *     non-human/toy casts and does not apply to this path's human characters
 *   - the outfit pool's Halloween touch lives in ~half its own entries, never
 *     mandatory on every render — avoids homogenizing into "the same look"
 *   - positive register only ("PLAYFUL, cozy, fun-not-scary") — no bare
 *     negation as the only guardrail
 *   - no camera-framing axis added — the composition instruction explicitly
 *     keeps the whole character(s) + their lit nook in frame; never a macro
 *     on one prop that would dissolve the intimate scene
 *   - tight/intimate framing is the explicit COMPOSITION instruction (this
 *     path's identity is the opposite of MangaBot's wide `festival-nights`
 *     establishing shots)
 *
 * Medium note (for whoever wires this into mangabot/index.js at promotion —
 * NOT decided here): MangaBot routes most look-enabled paths to the
 * mangabot_anime_neutral "looks" medium via mediumByPath so the rolled
 * sharedDNA.lookRegister leads CLIP; this path's identity (ordinary anime
 * illustration, no fixed art-style lock) fits that rotation like any other
 * look-enabled path, but `slice-of-life` (this path's closest sibling) was
 * deliberately EXCLUDED and kept on the bot-wide 'anime' medium + fixed
 * PROMPT_PREFIX — whoever promotes this path should check with Kevin which
 * precedent to follow before deciding.
 */

const CHARACTERS = require('../seeds/anime_halloween_cozy_character.json');
const OUTFITS = require('../seeds/anime_halloween_cozy_outfit.json');
const ACTIVITIES = require('../seeds/anime_halloween_cozy_activity.json');
const SETTINGS = require('../seeds/anime_halloween_cozy_setting.json');
const DECOR = require('../seeds/anime_halloween_cozy_decor.json');
const GLOW = require('../seeds/anime_halloween_cozy_glow.json');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character1 = picker.pickWithRecency(CHARACTERS, 'anime_halloween_cozy_character');

  let character2 = null;
  if (Math.random() < 0.4) {
    const candidate = picker.pickWithRecency(CHARACTERS, 'anime_halloween_cozy_character');
    if (candidate !== character1) character2 = candidate;
  }
  const isPair = !!character2;

  const outfit1 = picker.pickWithRecency(OUTFITS, 'anime_halloween_cozy_outfit');
  const outfit2 = isPair ? picker.pickWithRecency(OUTFITS, 'anime_halloween_cozy_outfit') : null;

  const activity = picker.pickWithRecency(ACTIVITIES, 'anime_halloween_cozy_activity');
  const setting = picker.pickWithRecency(SETTINGS, 'anime_halloween_cozy_setting');
  const decor = picker.pickWithRecency(DECOR, 'anime_halloween_cozy_decor');
  // MONEY SHOT — the signature warm/cool glow interplay. Always rolled;
  // variety comes from a 25-entry pool, not from being conditional (see
  // header note above).
  const glow = picker.pickWithRecency(GLOW, 'anime_halloween_cozy_glow');

  const castLines = [`1. ${character1}, wearing ${outfit1}`];
  if (isPair) castLines.push(`2. ${character2}, wearing ${outfit2}`);

  const castBlock = isPair
    ? `THE TWO OF THEM, close together and sharing this quiet moment (both are ordinary anime characters by role only — never a named specific character, never a costume beyond the loungewear described):\n${castLines.join('\n')}`
    : `THE LONE CHARACTER, caught in this quiet moment (an ordinary anime character by role only — never a named specific character, never a costume beyond the loungewear described):\n${castLines.join('\n')}`;

  return `You are a hand-drawn-anime illustrator writing ONE quiet, intimate HALLOWEEN-AT-HOME moment for an anime art bot. A small, warm-lit indoor scene — one anime character (or two, sharing it) caught mid-moment on a cozy autumn evening: carving a pumpkin, curled up watching a scary movie, or sorting a trick-or-treat candy haul. Warm, wholesome, playful: a "scary movie" here is delightfully cozy tension, NEVER a real scare; nothing is bloody or genuinely frightening. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — READ FIRST ━━━
The entire scene renders as HAND-DRAWN ANIME/MANGA ILLUSTRATION — Studio Ghibli / Makoto Shinkai / Kyoto Animation register, cel-shaded clean linework with painterly atmospheric backgrounds. NEVER photoreal, NEVER 3D-render, NEVER Disney-Pixar CGI, NEVER Western cartoon, NEVER black-and-white manga panel (this is COLOR illustration). Every character is described by role/archetype only — NEVER a named specific anime character or franchise. This is PLAYFUL Halloween coziness, not horror.

━━━ THE CAST ━━━
${castBlock}

━━━ THE MOMENT (the activity they're caught doing) ━━━
${activity}

━━━ THE COZY SETTING ━━━
${setting}

━━━ ONE PLAYFUL DECOR TOUCH ━━━
${decor}

━━━ THE SIGNATURE GLOW — the money shot; honor this light exactly ━━━
${glow}
The light stays visibly CONTAINED inside its source at all times — glowing out through a pumpkin's carved face, cupped inside a candle holder, held behind a lamp shade or screen. Never describe or imply a bare loose flame sitting freely on a surface with no lantern, holder, or candle body around it — a fire needs its container in frame just as much as its glow.

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — INTIMATE, NOT A WIDE ESTABLISHING SHOT ━━━
Tight, close framing — the character(s) and their small warm-lit corner fill the frame; this is a private, quiet cozy moment, not a street or festival scene, so keep it small in scope. The signature glow above is the dominant light source in the whole frame: let it visibly shape shadows, catchlights in the eyes, and warm color temperature across skin, fabric, and walls alike. Whoever is present is genuinely engaged in the moment (mid-carve, mid-reach for candy, eyes locked on the screen) — a candid caught-in-the-act beat, not a posed portrait. Everything reads as safe, cozy, and quietly happy. Regardless of which setting or decor beat landed above, ALWAYS include one small glowing carved jack-o-lantern visible somewhere in the frame (on the table, a sill, a step, a counter corner) — it is the single unmistakable Halloween signal and the scene must never be left without one, even when the chosen setting/decor lines above didn't happen to mention one.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Start immediately with the scene content.`;
};
