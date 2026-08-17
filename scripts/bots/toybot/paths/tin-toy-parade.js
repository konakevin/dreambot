/**
 * ToyBot tin-toy-parade path (Stage O3, SHADOW) — function-form.
 *
 * A nostalgic procession of vintage 1950s-60s LITHO-PRINTED TIN WIND-UP TOYS
 * (Masudaya / Yonezawa register): pressed-tin robots, cars, marching bands and
 * animals parading through a retro toy-town. SCENE = the parade-world; PIECES =
 * 1-2 tin-toy cast mid-march.
 *
 * Medium: tin_toy_diorama. Model: flux-1.1-pro/ultra. Self-contained.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TOYBOT_TIN_TOY_SCENES, 'tin_toy_scene');

  const pieces = [picker.pickWithRecency(pools.TOYBOT_TIN_TOY_PIECES, 'tin_toy_piece')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(pools.TOYBOT_TIN_TOY_PIECES, 'tin_toy_piece');
    if (second !== pieces[0]) pieces.push(second);
  }

  return `You are a macro collectible photographer shooting a parade of vintage LITHO-PRINTED TIN WIND-UP TOYS for ToyBot. A real vintage tin-toy diorama on a table, photographed warm and nostalgic. 1950s-60s tin-toy tradition (Masudaya / Yonezawa register). Photoreal cinematic macro, shallow depth of field.

━━━ THE PARADE-WORLD ━━━
${scene}

━━━ THE TIN TOYS — the clockwork stars of the parade (real pressed litho-tin, wind-up, mid-march) ━━━
${pieces.map((p, i) => `${i + 1}. ${p}`).join('\n')}
The parade is in motion — toys rolling, marching, a key half-wound. Keep everything as REAL pressed litho-tin with printed detail and wind-up keys, never alive, never human (tin soldiers/robots are metal toys).

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is vintage LITHOGRAPHED PRESSED TIN: colorful printed-on detail (rivets, faces, dials, clothes all printed on the metal), pressed-tin body panels with tab-and-slot seams, clockwork wind-up keys, slight patina, tiny scratches, a warm enamel sheen. Warm nostalgic studio lighting, tilt-shift macro, tactile tin texture and reflection in every highlight. NOT plastic, NOT CGI — real vintage tin toys.

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
Frame the parade with depth: a foreground tin toy mid-march, the procession and printed-tin toy-town receding behind, a sense of clockwork motion.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
