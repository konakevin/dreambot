/**
 * OutlawBot — shared prose blocks.
 *
 * The American Old West, made VIVID and EXCITING — a painted picture-book of the
 * frontier. Red Dead Redemption / Tombstone / Sergio Leone / Frederic Remington /
 * N.C. Wyeth / classic Western-art lineage. Cowboys, frontier towns, saloons,
 * desert vistas, homesteads, streams, cabins — cinematic, heightened, romantic,
 * a little dangerous. Never a dull documentary photo; always a frame worth framing.
 *
 * Looks system: every look-enabled path routes to the code-only `outlawbot_neutral`
 * medium and rolls a per-render WESTERN-ART LOOK (Remington oil / Bierstadt luminist /
 * Leone technicolor / dime-novel pulp / sepia tintype / game-cinematic …) that leads
 * the prompt and sets the render style.
 */

// Bot-wide prefix — CONTENT-only, no render-style tokens, so the rolled LOOK leads
// CLIP (look-enabled paths override this via promptPrefixByMedium[outlawbot_neutral]
// anyway; this is the fallback for any non-look path).
const PROMPT_PREFIX = 'Vivid cinematic Old-West frontier scene, the American frontier at its most beautiful and alive';

const PROMPT_SUFFIX = 'no text no words no watermarks, frame-worthy western art';

// ── Looks system ────────────────────────────────────────────────────────────
// Neutral medium for look-enabled paths: locks the WESTERN frontier IDENTITY but
// defers the render style / medium / finish / palette to the rolled LOOK.
const OUTLAWBOT_NEUTRAL =
  'the American Old West frontier — cinematic, vivid, characterful and alive. The render style, medium, finish and palette are set entirely by the LOOK tokens that lead the prompt; render the whole scene in THAT look.';

// Short IDENTITY-only anchor for the neutral medium (no render-style words) so the
// rolled LOOK owns the style, not a bot-wide style prefix.
const OUTLAWBOT_NEUTRAL_PREFIX = 'Old West frontier scene';

const OUTLAWBOT_NEUTRAL_SUFFIX = 'frame-worthy western art, no text no words no watermarks';

// STYLE-AUTHORITY override header, prepended to look-enabled briefs. Strong wording
// (per the MangaBot looks lesson) so the rolled look beats any baked style language
// in the path template; content / composition / hard-rules stay intact.
const OUTLAWBOT_LOOK_OVERRIDE = (sharedDNA) =>
  sharedDNA && sharedDNA.lookRegister
    ? `━━━ LOOK — RENDER STYLE AUTHORITY (NON-NEGOTIABLE — open your Flux prompt with this) ━━━
${sharedDNA.lookRegister}

This is the AUTHORITY on rendering STYLE for THIS render. It OVERRIDES any other art-style / medium / finish / linework wording anywhere below (e.g. "oil painting", "film still", "illustration", "photograph", "concept art"). Keep the SCENE content, the subject, the composition, and EVERY rule below exactly as written — but render ALL of it in THIS look. Open your Flux prompt with these look tokens.

`
    : '';

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  OUTLAWBOT_NEUTRAL,
  OUTLAWBOT_NEUTRAL_PREFIX,
  OUTLAWBOT_NEUTRAL_SUFFIX,
  OUTLAWBOT_LOOK_OVERRIDE,
};
