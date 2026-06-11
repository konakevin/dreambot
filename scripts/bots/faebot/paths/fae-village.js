/**
 * FaeBot fae-village path.
 *
 * Three-axis layered prompt:
 *   1. DWELLING — picked from FAE_VILLAGES (architecture, materials, layout)
 *   2. LIGHTING + WEATHER — picked from VILLAGE_LIGHTING (atmospheric treatment)
 *   3. WILDLIFE / LIVED-IN — picked from VILLAGE_WILDLIFE (small life signs)
 *
 * Sonnet writes the unified Flux prompt, weaving all three layers together
 * into a painted-fantasy fae-village scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, vibeKey, picker }) => {
  const dwelling = picker.pickWithRecency(pools.FAE_VILLAGES, 'fae_village');
  const lighting = picker.pickWithRecency(pools.VILLAGE_LIGHTING, 'village_lighting');
  const wildlife = picker.pickWithRecency(pools.VILLAGE_WILDLIFE, 'village_wildlife');
  const forestDetail = picker.pickWithRecency(pools.VILLAGE_FOREST_DETAIL, 'village_forest_detail');

  return `You are writing ONE Flux prompt for an enchanted fae-village painting. Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting/lighting/anything else.

1. THE DWELLING IS THE SUBJECT. The fae cottage / village is the eye's first landing place. The architecture fills 40-55% of the frame. NEVER write a "wide landscape with tiny structure". NEVER write "small house in distance".

2. The dwelling description below is THE dwelling — render it with its specific architectural features, materials, and natural integration (grown into tree / cliff / stump / brambles / roots / etc.). Do NOT substitute a different dwelling type.

3. Open your prompt with the dwelling description in this format:
"[dwelling unified description], [lighting + weather + atmosphere], [wildlife and lived-in details], [painted-fantasy lineage closing phrase]."

The dwelling opens. Lighting + weather wraps it. Wildlife animates it. Painted lineage closes it.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE DWELLING (this is the subject — render it exactly this way) ━━━
${dwelling}

This unified description is THE dwelling. Preserve every architectural feature, every material, every natural-feature integration mentioned. The dwelling is GROWN from the forest (bark walls, mossy thatch, vine-bound timber, woven willow, hewn-stone steps) — never modern construction.

━━━ 2. TIME OF DAY + LIGHTING + WEATHER (render exactly this) ━━━
${lighting}

This rolled TIME OF DAY leads and sets the sky, light and color of the whole scene — commit fully to it. Most are warm lovely daytime; but if it rolls sunset/twilight/night/rain, the sky genuinely changes (a fiery sunset, a deep dark night lit by glowing windows + lanterns + fireflies, a grey rainy day) — do NOT default to bright day or force daytime god-rays. Weave it in with sparkling magical motes, painted brushwork and multi-layer atmospheric depth.

━━━ 3. LUSH PAINTED FOREST DETAIL (NON-NEGOTIABLE LUSHNESS) ━━━
${forestDetail}

Weave this rich forest texture into the scene. EXPLOSIVE FOREGROUND wildflowers, OVERHANGING BRANCHES drooping from frame edges, dense painted midground, atmospheric haze background — the forest must feel PACKED with painted detail at every distance.

━━━ 4. WILDLIFE + LIVED-IN (NON-NEGOTIABLE — render the SCENE BUZZING WITH LIFE) ━━━
${wildlife}

This wildlife description is NON-NEGOTIABLE. The village is BUZZING WITH VISIBLE CRITTER ACTIVITY — hummingbirds darting at flowers, butterflies clustered on blossoms, squirrels balancing on railings, chipmunks scampering on paths, baby rabbits in clover, songbirds on beams, fireflies drifting. Every critter and action mentioned above MUST appear in your final prompt — DO NOT compress, summarize, or drop critters. Preserve the specific counts, species, and actions exactly. The scene must FEEL ALIVE — Studio Ghibli forest density, Cinderella's woodland helpers, Snow White's animal companions.

━━━ 4. PAINTED-FANTASY LINEAGE (NON-NEGOTIABLE CLOSING) ━━━
Greg Manchess + Donato Giancola + Paul Bonner + NC Wyeth + Brian Froud + Eyvind Earle painted-fantasy lineage. VISIBLE THICK BRUSH STROKES on every surface — bark, foliage, rocks, water, dwelling walls, thatched roofs. Edges PAINTED (one color stops, another begins, with a soft painted seam). NEVER black ink outlines, NEVER vector borders, NEVER animation-cel contour, NEVER 3D-CGI plastic look. Saturated deep forest greens, warm umber bark-tones, mossy roof greens, glowing amber window-light, muted blue-grey atmospheric distance. Painted brushwork.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ HARD BANS ━━━
NO bare chest, NO nipples, NO topless.

Output ONLY the raw 70-95 word painted-prompt. Comma-separated phrases. NO preamble, NO titles, NO ━━━ markers, NO **bold labels**. The prompt should weave the dwelling + lighting + wildlife + painted-lineage closing into ONE flowing description.`;
};
