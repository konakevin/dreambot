/**
 * ToyBot puppet-theatre (2026-09-22, SHADOW) — function-form, mirroring tin-toy-parade's shape.
 *
 * WHY THIS PATH. ToyBot has 23 live paths and every one photographs toys ON a surface — a shelf, a
 * table, a diorama, a floor. A PROSCENIUM is a framing language the bot has never used: we sit in
 * the audience, the arch crops the picture, the footlights rake up from below, and painted flats
 * recede in layers behind the cast. That is a new KIND of ToyBot image rather than a new subject,
 * which is exactly why it earned a path instead of a bucket.
 *
 * Axes: PRODUCTION (the play + its painted set, the hero) + CAST (1-2 puppets mid-gesture, with
 * the mechanism visible) + STAGECRAFT (the one piece of theatre machinery that sells the illusion).
 *
 * The load-bearing mandate is the framing itself, stated as the first rule: shot from the AUDIENCE,
 * through the arch, with the footlights raking upward. Without that this collapses into "toys in a
 * diorama", which the bot already has 23 ways to do.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const production = picker.pickWithRecency(pools.TOYBOT_PUPPET_PRODUCTIONS, 'puppet_production');
  const stagecraft = picker.pickWithRecency(pools.TOYBOT_PUPPET_STAGECRAFT, 'puppet_stagecraft');

  // 1-2 puppets. A single puppet mid-gesture reads as a portrait; two reads as a SCENE, which is
  // the whole point of a stage. Second one at 60% — higher than tin-toy-parade's 45% because a
  // two-hander is the thing a theatre is FOR.
  const cast = [picker.pickWithRecency(pools.TOYBOT_PUPPET_CAST, 'puppet_cast')];
  if (Math.random() < 0.6) {
    const second = picker.pickWithRecency(pools.TOYBOT_PUPPET_CAST, 'puppet_cast');
    if (second !== cast[0]) cast.push(second);
  }

  return `You are a macro collectible photographer shooting a handmade TOY PUPPET THEATRE mid-performance for ToyBot. A real little stage built of painted card and timber, standing on a table, photographed warm and theatrical. Photoreal cinematic macro, shallow depth of field.

⚠️⚠️⚠️ THE FRAMING IS THE WHOLE POINT — SHOT FROM THE AUDIENCE, THROUGH THE PROSCENIUM ⚠️⚠️⚠️
The camera sits out in the house, low, at the level of the stage. The PROSCENIUM ARCH frames the picture — its painted edge crops the top and both sides of the image, so we are looking INTO a lit box. The FOOTLIGHTS run along the front edge below the cast and rake their light UPWARD, throwing the puppets' shadows up onto the flats behind them. Beyond the opening the stage recedes in layers of painted flats.

If the image reads as toys sitting on a table or in an open diorama, the render has FAILED. It must read as a STAGE, seen from the audience, with the arch around it and the light coming from below.

━━━ THE PRODUCTION ON STAGE ━━━
${production}

━━━ THE PUPPET CAST — mid-performance, and visibly PUPPETS ━━━
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}
${cast.length > 1 ? 'The two of them are playing the scene AT each other — facing, reacting, one gesturing and one responding. Not two figures standing in separate spots.' : 'The puppet is mid-gesture, playing to the house.'}
Keep every mechanism visible and charming: strings running up out of frame to a control bar, a rod reaching in from the side, pinned card joints, honest stitching. These are well-loved handmade puppets, warm and characterful, never lifelike and never creepy.

━━━ THE STAGECRAFT DETAIL ━━━
${stagecraft}

━━━ WHAT THE PAINTED SURFACES CARRY ━━━
Every flat, backcloth and cut-out is painted edge to edge with PICTORIAL SCENERY — trees, arches, waves, rooftops, hills, clouds, a moon, a doorway — so no panel is left as a bare surface. Where the play would want a notice or a crest, the painter has given it a painted emblem instead: a sun, a crescent, a star, a flower, a heraldic beast, a curl of gilt scrollwork.

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is handmade toy-theatre material: painted cardboard flats with visible brush-marks and honest cut edges, timber battens, cord, foil, tissue, gauze, tiny warm bulbs. Chipped gilt on the arch, scuffed stage boards, fingerprints in the paint. Warm practical light only — the footlights, a clip lamp, a candle-stub. Real photographed objects with real texture, never CGI, never a digital illustration.

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
Compose for DEPTH inside the little box: the foreground stage lip and footlights, the cast on the boards, the painted flats in overlapping layers, the backcloth last. Let the arch vignette the edges naturally.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ FAILURE CONDITIONS ━━━
• Reads as toys on a table or an open diorama rather than a stage seen from the audience → FAILED
• No proscenium arch framing the image → FAILED
• Light comes from above rather than raking up from the footlights → FAILED
• Any real human, puppeteer or human hand in frame → FAILED
• Puppets read as living creatures or as creepy dolls → FAILED

Describe only what IS present in the scene — never write a negation into the prompt.

Output ONLY the raw 85-115 word scene description. Comma-separated phrases. No preamble, no titles, no headers, no markers, no bold labels, no "render as" suffixes.`;
};
