/**
 * BloomBot — shared blocks, rewrite from scratch 2026-05-06.
 *
 * Scene-centric bot: flowers are the hero. Compositional architecture —
 * each render = palette + region + lighting + per-path scene. Every block
 * here is short and load-bearing. Resist accumulation.
 */

// 2026-06-02 cruft-audit micro-strip — dropped `magazine-cover` (travel-
// magazine register, pulls toward Condé-Nast prior).
const PROMPT_PREFIX =
  'breathtaking LUSH flower scene, abundant blooms filling the entire frame edge-to-edge as the unmistakable hero, a monumental bloom-form or dense overflowing bloom-mass dominating the composition, every petal jewel-saturated, gallery-quality composition, any setting is only a backdrop to the flowers';

// 2026-06-02 cruft-audit strip — was 469ch with redundancy against
// PROMPT_PREFIX + bloom_hyperreal_cgi flux (same "tack-sharp + saturated
// + jewel-tone + clear background" claims appeared in all 3 layers).
// Also held a parenthetical negation `(no hues outside it)` that the
// positive "STRICTLY within the scene's chosen color theme" already
// covers. Dropped tech-spec "hyper-detailed" (AI-photo tell). Kept the
// unique enforcement points: species-color faithfulness + receding-
// layer depth + sky clean. "no text/words/watermarks" stays — standard
// overlay suppression that doesn't leak scene content.
const PROMPT_SUFFIX =
  "render every named species as that exact species in its named color, color STRICTLY within the scene's chosen theme, depth built from receding layers of more blooms and clearly-rendered scenery, the sky clean and clear, every layer crisply rendered, no text, no words, no watermarks, gallery quality";

// gpt-image-2 medium directive (routed via mediumByModel in index.js).
// GPT-Image-2 reads the bot's heavy "monumental bloom-form / dominating
// the composition / every petal jewel-saturated" prefix + the bot's
// regular flower-painting mediums as "go full abstract botanical plate"
// and loses petal/species clarity. Positive-only directive — mirrors
// mystical-mermaid b0776fb9.
//
// NO palette anchor (`jewel-tone`, `jewel-saturated`, etc.) — many
// BloomBot seeds carry their own scene-specific color palette (white +
// gold, soft pastels, monochrome rose, etc.). The medium's palette
// would clash; let the scene's own color call land.
const GPT_CLEAN =
  'Cinematic floral illustration, clean editorial-poster render with clearly readable blooms and recognizable petal detail, lush layered composition with atmospheric depth, abundant garden register';

// BLOOM_NEUTRAL — the "Medium Looks" neutral medium fragment (2026-06-09).
// Overrides the DB bloom_hyperreal_cgi.flux_fragment (which baked a fixed
// "hyperreal painterly CGI" finish) so the bot-wide look-register axis can
// set the rendering MEDIUM per render instead. Locks ONLY content (lush
// flowers fill the frame as the hero, color stays within the scene's
// palette) — NO rendering-medium / finish tokens. The rolled look that
// LEADS the Sonnet output carries the medium. The old painterly-CGI finish
// is preserved as look #1 in bloom_look_register.json, so nothing is lost.
const BLOOM_NEUTRAL =
  "lush abundant blooms filling the frame as the unmistakable hero, every petal crisp and color-saturated strictly within the scene's chosen palette; the rendering medium, finish, surface and palette treatment are set by the look-register tokens that OPEN the prompt";

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE — NON-NEGOTIABLE ━━━
No humans, no faces, no figures, no silhouettes, no shadows of people anywhere in the frame. Wildlife (hummingbird, bee, butterfly, dragonfly, small lizard) is allowed only as peripheral accent — never the subject.`;

const DENSITY_BLOCK = `━━━ DENSITY — NON-NEGOTIABLE ━━━
Frame is FILLED edge-to-edge with blooms. Foreground, midground, background — every plane dense. No bare ground, no empty sky pockets, no negative-space rest. Petals overlap in thick carpets, vines cascade, climbing flowers consume vertical surfaces. Mix tiny microflowers with oversized statement blooms in the same frame for scale variety. Every entry must satisfy this rule, no matter the per-path scene.`;

const ARRANGEMENT_BLOCK = `━━━ ARRANGEMENT — CURATED, NOT RANDOM ━━━
3-4 species, repeated and MASSED into thick clusters. Patchwork clumps of contrasting species, not uniform fields, not random salad. The selection is INTENTIONAL — picture a high-end florist's masterpiece blown up to landscape scale. The 4-5 colors of the palette are balanced across the frame so no single color dominates more than its share.`;

const ANTI_DRIFT_BLOCK = `━━━ DEFAULTS TO RESIST ━━━
- Do NOT default to orange/marigold/amber/coral/copper as the dominant warm palette. BALANCE warm with EQUAL cool — blues, purples, violets, indigos, whites carry equal weight across the frame. Orange is one accent among many, never the scene's overall mood. (EXCEPTION: a sunset or desert scene is legitimately warm — let those stay warm; everywhere else, balance.)
- Do NOT default to pink/rose/blush/coral as the dominant palette unless the palette explicitly names it. Pink is one accent color among many, never the scene's overall mood.
- Do NOT default to roses, peonies, hydrangeas, or lavender unless they appear in the species roster for this render's region. Use the exact species named in the roster.
- Do NOT default to "soft pastels", "cottagecore", "feminine", "cottage garden", "english garden" descriptors.
- Do NOT make the scene minimalist — density rules above are absolute.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  GPT_CLEAN,
  BLOOM_NEUTRAL,
  NO_PEOPLE_BLOCK,
  DENSITY_BLOCK,
  ARRANGEMENT_BLOCK,
  ANTI_DRIFT_BLOCK,
};
