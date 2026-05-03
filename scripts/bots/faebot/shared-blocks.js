/**
 * ForestBot — shared prose blocks.
 *
 * Hardcoded BANDE-DESSINÉE PAINTED GRAPHIC-NOVEL aesthetic — Hugo Pratt
 * (Corto Maltese) + Sergio Toppi + Mike Mignola + Eyvind Earle lineage.
 * Bold black ink outlines + hard-edged painted color planes + heavy
 * chiaroscuro + deep saturated forest greens with navy shadows. Peaceful
 * forest fairy / nymph / sprite scenes — but rendered MOODY and PAINTED,
 * not soft modern children's-book.
 */

// PROMPT_PREFIX deliberately empty — the creature description must open
// the prompt for Flux to land on the figure as subject. Frontloading
// medium descriptors hijacked every render to "fantasy-book-cover"
// trained-cliche (small cloaked figure in vast landscape).
const PROMPT_PREFIX = '';

// Style descriptors live ONLY in the suffix (where Flux weighs less).
const PROMPT_SUFFIX =
  'painted fantasy concept art, soft brushwork, atmospheric forest illustration, dreamy dappled light, Brian Froud + Mononoke + Magic-the-Gathering green-mana lineage, no text, no watermarks';

// MEDIUM override is now a minimal tag — small enough that it does not
// hijack the early-token weight. The creature description from the path
// builder gets to lead.
const PAINTED_FANTASY_NOVEL_MEDIUM = 'enchanted-forest fantasy concept art, painterly';

const PAINT_TECHNIQUE_BLOCK = `━━━ THE PAINTED LOOK (NON-NEGOTIABLE) ━━━

Render as a HAND-PAINTED fantasy book cover. VISIBLE THICK BRUSH STROKES on every surface. The texture of the PAINT MARK itself shows on bark, foliage, rocks, water, fabric, skin. Oil-paint and gouache mixed-media feel. Edges between forms are PAINTED (one color stops, another begins, with a soft painted seam) — NEVER black ink outlines, NEVER vector borders, NEVER animation-cel contour. Color is laid down with brush authority — confident strokes, painted dabs, palette-knife scrapes for highlights. Think the painted covers of Earthsea / The Hobbit / Lloyd Alexander / Folio Society fantasy editions. Greg Manchess + Donato Giancola + Paul Bonner painted-fantasy tradition.`;

const COMPOSITIONAL_LINEAGE_BLOCK = `━━━ COMPOSITIONAL LINEAGE ━━━

Greg Manchess (painterly fantasy-novel covers — confident brush strokes, dramatic painted lighting) + Donato Giancola (fantasy oil paint — glowing color, painted gravitas) + Paul Bonner (D&D / Lord-of-the-Rings painted illustration — geometric stylization with paint texture) + NC Wyeth (golden-age book illustration — heroic painted compositions) + Frank Frazetta (saturated fantasy oil — painterly atmosphere) + Eyvind Earle (Sleeping Beauty layered tree planes, geometric leaf clusters — but rendered with paint not vectors). Foliage is geometric-stylized BUT every leaf-cluster carries visible brushwork. Lighting is dramatic golden-hour or moonlit-cool, with painted atmospheric haze.`;

const FOREST_PALETTE_BLOCK = `━━━ THE PALETTE ━━━

Saturated deep forest greens (moss, fern, deep canopy emerald — painted with brush authority), warm umber and sienna for bark and ochre soil, muted blue-grey atmospheric distance, deep navy painted shadows in the canopy, occasional saturated red-orange or pearl-cream accents in fairy clothing or light-shaft, golden warm-hour light cutting through canopy. Romantic painted atmosphere — saturated but never garish, deep-shadowed but never flat.`;

const PEACEFUL_FAIRY_BLOCK = `━━━ THE MOOD: PEACEFUL FOREST MAGIC ━━━

The fairy / nymph / sprite / dryad / forest-spirit is calm and wondrous, at home in the wild. Mid-action moments are GENTLE — sipping dewdrops, dancing barefoot through ferns, whispering to a deer, weaving flower-crowns, perched on a mossy stump playing a tiny flute. NEVER violent, NEVER scared, NEVER edgy. But the SCENE itself carries graphic-novel weight — dramatic lighting, deep shadows, atmospheric depth. The PEACE is rendered with moody painted gravitas, not pastel cuteness.`;

const NO_TEXT_BLOCK = `━━━ NEVER ADD ━━━

NO text, NO floating words, NO captions, NO watermarks, NO signatures, NO labels, NO comic-panel borders or gutters. A single painted page-illustration, not a multi-panel comic.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  PAINTED_FANTASY_NOVEL_MEDIUM,
  PAINT_TECHNIQUE_BLOCK,
  COMPOSITIONAL_LINEAGE_BLOCK,
  FOREST_PALETTE_BLOCK,
  PEACEFUL_FAIRY_BLOCK,
  NO_TEXT_BLOCK,
};
