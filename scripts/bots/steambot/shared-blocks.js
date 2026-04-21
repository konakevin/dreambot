/**
 * SteamBot — shared prose blocks.
 *
 * Breathtaking steampunk worlds — brass + copper + clockwork + Victorian-
 * industrial. BioShock-Infinite / Mortal-Engines / Hugo / Howl's-Moving-Castle /
 * FFIX energy. Obsessive gear/rivet/steam-wisp detail.
 */

const PROMPT_PREFIX =
  'gorgeous steampunk illustration, brass and copper clockwork detail, BioShock-Infinite Mortal-Engines Howl aesthetic, Victorian-industrial impossibly-detailed, painterly production art, warm gaslit atmosphere';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const STEAMPUNK_OBSESSIVE_DETAIL_BLOCK = `━━━ OBSESSIVE STEAMPUNK DETAIL — NON-NEGOTIABLE ━━━

Every gear, rivet, pipe, valve, pressure-gauge, rivet-seam, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. NEVER sparse, NEVER minimal. Surface density is the signature.`;

const VICTORIAN_INDUSTRIAL_BLOCK = `━━━ VICTORIAN INDUSTRIAL (NOT MODERN / NOT FUTURISTIC) ━━━

Victorian elegance meets industrial revolution meets impossible machinery. Never modern-sleek. Never sci-fi-futuristic. Think 1890s industrial London + Jules Verne + H.G. Wells + early Edison/Tesla. Visible mechanisms, exposed gears, leather-and-brass, smoke-and-steam, gaslight, goggles-and-top-hats.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY ━━━

Describe by archetype: "goggled inventor", "corseted airship-captain", "brass-armed mechanic", "Victorian-explorer with pith helmet". NEVER named IP characters — no "Elizabeth", no "Sherlock", no "Howl", no "League of Extraordinary Gentlemen" names.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION (character paths) ━━━

When rendering a character: she/he stands ALONE. No second figure, no couple-pose, no stock-pair shots. Solo hero framing.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — STEAMPUNK EDITION ━━━

Book-cover / Mortal-Engines / BioShock-Infinite production-art quality. Wall-poster gorgeous. Obsessive mechanical detail AND painterly warmth at once.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — STEAMPUNK AMPLIFICATION ━━━

Steampunk is the canvas, not the ceiling. Stack: visible mechanism complexity + steam atmosphere + brass-and-copper saturation + gaslight drama + impossible mechanical invention + Victorian architectural ornament + smoke-and-soot weathering. BioShock × Mortal-Engines × Howl's-Moving-Castle × 10.`;

const CONTRAPTION_VARIETY_BLOCK = `━━━ CONTRAPTION VARIETY (contraption path only) ━━━

NOT clock-dominant. Draw from wide range: musical instruments (brass self-playing organ), automatons (mechanical butler, clockwork bird), alchemical devices (bubbling retorts with copper tubing), vehicles-in-miniature (tiny brass submarine model, airship prototype), living-hybrid (octopus-automaton, cat with brass prosthetic eye), communication (telegraph-with-gramophone-horn), weapons-tools (steam-rifle, chronocompass), domestic-impossible (self-pouring tea service, mechanical cat-sitter). Vary WIDELY across renders.`;

const STEAMPUNK_WOMAN_CANDID_BLOCK = `━━━ STEAMPUNK WOMAN CANDID (sexy-steampunk-woman path only) ━━━

Really-fucking-sexy steampunk woman, candid solo, doing a SPECIFIC steampunk-identity action — corseted airship-captain at helm, brass-prosthetic mechanic oiling gauntlets, Victorian-adventuress reloading steam-rifle, mad-scientist at workbench with cybernetic goggles. Capable + dangerous-magnetic + unmistakably-steampunk. Caught-in-the-moment voyeuristic framing. Solo — no men, no second figure.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  STEAMPUNK_OBSESSIVE_DETAIL_BLOCK,
  VICTORIAN_INDUSTRIAL_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  SOLO_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  CONTRAPTION_VARIETY_BLOCK,
  STEAMPUNK_WOMAN_CANDID_BLOCK,
};
