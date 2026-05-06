/**
 * FaeBot fae-village path.
 *
 * Architectural counterpart to forest-fairy-scene. The DWELLING is the
 * subject — fae homes / villages / halls grown from the forest itself.
 * Same painted-fantasy-novel lineage. Same stacked-exotic-detail DNA.
 * Dwellings blend INTO the forest, made entirely of living organic
 * materials (bark, mushroom-caps, vines, moss, dewdrops, glow-fungi).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'medium-wide painted shot, the dwelling off-center via rule-of-thirds, structure fills 40-55% of frame, surrounding forest receding into atmospheric depth on both sides',
  'three-quarter angle, the dwelling visible from front-and-side, painted depth showing both the entrance and one flanking wall, forest framing past the corners',
  'low-angle painted shot looking up at the dwelling rooted in a tree or hill, dwelling 45-60% of frame, canopy cathedral above, mossy ground in lower foreground',
  'high-angle painted shot looking gently down on a village cluster, multiple dwellings visible, forest paths threading between them, canopy gaps revealing the layout',
  'ground-level painted shot through fern-fronds, dwelling 50-65% of frame partly framed by foreground foliage at the edges, golden-hour light raking across the structure',
  'side-on painted shot of the dwelling, painted profile of architectural detail, hanging moss curtains and vine-curtains drifting in golden light',
  'painted establishing shot of a small village in a clearing, multiple dwellings clustered around a central element (glow-fungus lamp, mossy stone, ancient stump), painted depth fading to canopy',
  'painted detail-medium shot, dwelling occupying right or left third of frame, forest pathway leading toward it through ferns, dappled light cast across the path',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const dwelling = picker.pickWithRecency(pools.FAE_VILLAGES, 'fae_village');
  const composition = COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];

  return `You are writing ONE Flux prompt for an enchanted fae-dwelling painting. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting/lighting/anything else.

1. THE DWELLING IS THE SUBJECT. The fae home / village / hall is the eye's first landing place. The dwelling fills 40-55% of the frame. NEVER write a "wide landscape with tiny structure". NEVER write "small house in distance".

2. ORGANIC ONLY — the dwelling is GROWN, not built. Made entirely of LIVING FOREST MATERIALS (bark, mushroom-caps, vines, moss, leaves, hollowed roots/trunks, spider-silk, dewdrops, glow-fungi, honeycomb-wax, naturally-shed antlers/petals/seeds). It blends INTO the forest as if it grew there.

3. ABSOLUTE BANS: NO stone, NO brick, NO masonry, NO milled lumber, NO metal hardware, NO glass windows, NO modern construction. Use organic equivalents only (dewdrop / honeycomb-wax / petal-membrane for windows; vine-woven / bark-arch for doors).

4. The dwelling description below is THE dwelling — render it with EVERY exotic feature listed (the bark-arch entrance, the mushroom-cap roof, the dewdrop chandelier, the firefly-cloud, the glow-fungus sconces, the honeycomb-wax windows). 5+ stacked exotic features must visibly land in the painting.

5. Open your prompt with the dwelling description in this format:
"[dwelling unified description], [composition framing], [forest setting wrapping around it], [magical lighting + atmosphere], [palette]."

The dwelling opens. Everything else is its FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE DWELLING (this is the subject — render it exactly this way) ━━━
${dwelling}

This unified description is the FACE of the painting. Preserve every exotic feature: the materials (bark, mushroom-cap, vine, moss, dewdrop, glow-fungus, honeycomb-wax), the architectural details, the magical signature (firefly-cloud, glowworm-string, dewdrop-chandelier, pollen-haze), the lit windows, the surrounding context. The dwelling is a living, magical, lived-in place.

━━━ 2. COMPOSITION (the dwelling is the focal point) ━━━
${composition}.

The forest WRAPS AROUND the dwelling like a frame — vines hanging in foreground, mossy rocks beside it, dappled canopy behind. But IT is what the eye lands on first. Painted-fantasy-novel composition — confident brushwork, atmospheric depth, dramatic painted lighting.

━━━ 3. THE FOREST SETTING (its natural backdrop — wraps around it) ━━━
The dwelling sits within a deeply enchanted forest. Mossy boulders, towering ferns, ancient tree trunks, hanging vines, soft pollen-mist. The forest feels ALIVE and MAGICAL — every surface kissed with moss or fungi, dappled light cutting through canopy, atmospheric haze receding into deeper greens.

━━━ 4. THE MAGICAL ATMOSPHERE ━━━
Firefly-clouds, glow-fungi sconces, dewdrop chandeliers, pollen-dust drifting in light shafts. The dwelling glows softly from within (honeycomb-wax windows, glowworm porches, magical hearth-light through bark-arch doorways). The whole scene whispers "ancient magic, peaceful inhabitants."

━━━ 5. LIGHTING ${vibeKeyToLightHint(sharedDNA)} ━━━
${sharedDNA.colorPalette}

Painted golden-hour or magical-twilight light, with atmospheric haze and dappled-canopy specular accents. Light is laid down with brush authority — confident strokes, painted dabs.

━━━ 6. MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ THE PAINTED LOOK (NON-NEGOTIABLE) ━━━
Greg Manchess + Donato Giancola + Paul Bonner + NC Wyeth + Frank Frazetta + Eyvind Earle painted-fantasy lineage. VISIBLE THICK BRUSH STROKES on every surface — bark, foliage, rocks, water, dwelling walls. Edges PAINTED (one color stops, another begins, with a soft painted seam). NEVER black ink outlines, NEVER vector borders, NEVER animation-cel contour. Saturated deep forest greens, warm umber bark-tones, muted blue-grey atmospheric distance, glowing amber dwelling-light.

Output ONLY the raw 70-95 word painted-prompt. Comma-separated phrases. NO preamble, NO titles, NO ━━━ markers, NO **bold labels**. Just the phrases.`;
};

function vibeKeyToLightHint(_sharedDNA) {
  return '';
}
