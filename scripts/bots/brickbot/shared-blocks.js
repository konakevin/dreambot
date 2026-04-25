/**
 * BrickBot — shared prose blocks.
 *
 * Everything is built from LEGO bricks. Studs visible, plastic shine,
 * minifig scale, toy photography lighting. Museum-quality MOC showcase.
 */

const PROMPT_PREFIX =
  'highly detailed LEGO diorama scene, built entirely from real LEGO bricks, studs clearly visible, authentic LEGO plastic texture, molded seams and connection points, realistic brick geometry, accurate minifigure scale, intricate brick-built details using slopes tiles plates and transparent pieces, realistic toy photography style, studio-quality macro lens, shallow depth of field, tilt-shift miniature look, subtle reflections on glossy plastic surfaces, soft diffused lighting with cinematic rim light, professional LEGO MOC showcase photography';

const PROMPT_SUFFIX = 'no cartoon render, no minecraft, no voxel art, no claymation, no painted textures, no smooth surfaces, no melted plastic, no deformed studs, no text, no watermark, ultra detailed, sharp detail, cinematic composition';

const EVERYTHING_IS_BRICK_BLOCK = `━━━ EVERYTHING IS BRICK (NON-NEGOTIABLE) ━━━

EVERY element in the scene is built from LEGO bricks — buildings, vehicles, terrain, water, fire, smoke, trees, rocks, sky elements. Nothing is "real" — it's all plastic bricks on a tabletop. Studs must be visible on surfaces. Minifigures have yellow skin, C-shaped hands, and printed faces. The scene looks like a real physical build photographed with a macro lens.`;

const TOY_PHOTOGRAPHY_BLOCK = `━━━ TOY PHOTOGRAPHY QUALITY ━━━

Shot like a professional LEGO photographer — shallow depth of field, tilt-shift miniature look, studio lighting with soft diffusion and rim light. Realistic shadows on the tabletop. Bokeh in the background. The build looks like it could win a LEGO fan convention award. Museum-quality display piece.`;

const BRICK_DETAIL_BLOCK = `━━━ BRICK DETAIL ━━━

Specify brick types in the scene: transparent pieces for water/fire/glass, slope bricks for curves, tiles for smooth surfaces, plates for thin layers, technic beams for mechanical parts, minifig accessories for tiny details. The more specific the brick construction, the more realistic the build looks.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — BRICK AMPLIFICATION ━━━

Push the build complexity to maximum. More detail, more brick variety, more micro-scale elements. Layer lighting for drama. If the diorama looks simple — add more builds in the background, more minifig-scale details, more environmental storytelling. Every frame should make a LEGO fan say "how many pieces is that?"`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  EVERYTHING_IS_BRICK_BLOCK,
  TOY_PHOTOGRAPHY_BLOCK,
  BRICK_DETAIL_BLOCK,
  BLOW_IT_UP_BLOCK,
};
