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

const YUMBOT_FOOD_MEDIUM =
  'hyper-detailed 3D CGI render with painterly illustration fusion, Octane / Redshift quality, Pop Mart / Be@rbrick designer-vinyl glossy-pearlescent finish applied to FOOD AND DRINK ITEMS (the food IS the character), kawaii smiling faces ON the food/drink itself (boba cups, sundaes, cereal bowls, donuts, taiyaki, mochi, cupcakes, teapots — each has its own kawaii face with dimpled-cheek blush, closed-arc eyes, tiny printed mouth), AND any WATER / STREAMS / PONDS / POOLS in the scene rendered in the SAME glossy pearlescent vinyl-icing-glaze material as the foods — pastel-glaze liquid with sheen reflections, NOT photoreal water — sharing the confectionary surface quality with the food-creatures, while grass / trees / mountains / flowers stay as a soft kawaii pastel meadow landscape (lush green grass, cherry-blossom trees, pastel-haze mountains in distance), ABSOLUTELY NO human characters, NO chibi-figures, NO creature-mascots HOLDING or EATING the food — the food/drink is the entire cast (though companion mini-food-friends — smiling fruits, mochi-balls, stars — may pile near or on top of the hero food), glossy dewy material treatment with subsurface scattering on every glazed surface, pastel-rainbow palette (blush pink, lavender, mint, peach, cream, baby-blue) with cherry-blossom or pastel-floral accents, dreamy kawaii pop-mart aesthetic with painterly illustration fusion — wallpaper-poster composition. NOT painted-flat NOT 2D NOT Pixar-soft NOT photoreal NOT plasticky NOT generic-cartoon NOT photoreal-water. NOT a character holding food. NOT a creature eating food. ONLY the food/drink AS the smiling character.';

const PROMPT_PREFIX =
  'hyper-detailed 3D CGI render with painterly illustration polish, designer collectible Pop-Mart quality, glossy dewy pearlescent surfaces with subsurface scattering, frame-worthy magical wallpaper composition, pastel palette';

const PROMPT_SUFFIX =
  'designer-vinyl glossy-pearlescent finish, painterly illustration fusion, dreamy bokeh, soft pastel kawaii palette, NOT painted-flat NOT 2D NOT photoreal NOT generic-cartoon';

module.exports = {
  YUMBOT_FOOD_MEDIUM,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
};
