/**
 * BloomBot — shared blocks, rewrite from scratch 2026-05-06.
 *
 * Scene-centric bot: flowers are the hero. Compositional architecture —
 * each render = palette + region + lighting + per-path scene. Every block
 * here is short and load-bearing. Resist accumulation.
 */

const PROMPT_PREFIX =
  'breathtaking LUSH flower scene, abundant blooms filling the entire frame edge-to-edge as the unmistakable hero, a monumental bloom-form or dense overflowing bloom-mass dominating the composition, every petal jewel-saturated, magazine-cover composition, any setting is only a backdrop to the flowers';

const PROMPT_SUFFIX =
  "render every named species as that exact species in its named color, saturated color STRICTLY within the scene's chosen color theme (no hues outside it), the hero blooms and foreground rendered tack-sharp and jewel-saturated, the background staying clear and colored with depth built from receding layers of more blooms and clearly-rendered scenery, the sky clean and clear, every layer crisply rendered, no text, no words, no watermarks, hyper-detailed gallery quality";

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
  NO_PEOPLE_BLOCK,
  DENSITY_BLOCK,
  ARRANGEMENT_BLOCK,
  ANTI_DRIFT_BLOCK,
};
