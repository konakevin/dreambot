/**
 * YumBot shared blocks — kawaii-food specialist bot.
 *
 * Modeled tightly on bex.ai's Pop-Mart / kawaii-fantasy aesthetic. Three
 * distinct path-looks observed in references:
 *   A) floral-garden-cup — vessel overflowing with magical flora
 *   B) rainbow-dreamscape — kawaii food-creatures sitting in a wider pastel
 *      meadow with rainbows pouring out / arching overhead
 *   C) checkered-tabletop — kawaii food on a pastel-gingham/plaid tablecloth
 *      with cluster of smiling mini food-friends piled around it
 */

// 2026-06-02 cruft-audit micro-strip — dropped `Hyper-detailed` tech-spec
// + embedded `NOT a creature holding food` + 3-noun `ABSOLUTELY NO human
// / chibi / creature mascots` negation. The "food IS the character /
// kawaii face ON the food itself / only cast is food and drink" positive
// anchors hold the all-food-no-mascots identity.
const YUMBOT_FOOD_MEDIUM =
  '3D CGI render with painterly illustration fusion, Pop-Mart designer-vinyl glossy-pearlescent finish — kawaii smiling faces baked INTO the food/drink itself (each food IS the character with dimpled-cheek blush, closed-arc eyes, tiny printed mouth ON the surface). Glossy dewy subsurface-scattered material treatment. Pastel-rainbow palette (blush pink, lavender, mint, peach, cream, baby-blue). The only cast in frame is food and drink — every face belongs to a food item.';

// 2026-06-02 cruft-audit micro-strip — dropped `hyper-detailed` (CGI/
// glossy already carry the work) and 4 stacked `NOT X` bans from the
// suffix (NOT painted-flat NOT 2D NOT photoreal NOT generic-cartoon)
// which leaked exactly those styles per [[feedback_negative_prompt_leak]].
const PROMPT_PREFIX =
  '3D CGI render with painterly illustration polish, designer collectible Pop-Mart quality, glossy dewy pearlescent surfaces with subsurface scattering, frame-worthy magical wallpaper composition, pastel palette';

const PROMPT_SUFFIX =
  'designer-vinyl glossy-pearlescent finish, painterly illustration fusion, dreamy bokeh, soft pastel kawaii palette';

module.exports = {
  YUMBOT_FOOD_MEDIUM,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
};
