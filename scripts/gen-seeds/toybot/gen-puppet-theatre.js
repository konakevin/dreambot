#!/usr/bin/env node
// ToyBot puppet-theatre (2026-09-22, SHADOW) — a toy theatre mid-performance.
//
// WHY THIS PATH. ToyBot has 23 live paths and every one of them photographs toys ON a surface: a
// shelf, a table, a diorama, a floor. A PROSCENIUM is a framing language the bot has never used —
// we sit in the audience, the arch crops the image, the footlights rake up from below, and painted
// flats recede behind the cast. That is a genuinely new kind of ToyBot picture, not a new subject.
//
// 3 pools x 25 (MVP): the PRODUCTION on stage, the PUPPET CAST mid-performance, and the STAGECRAFT
// detail that proves it is a real toy theatre rather than a scene.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_puppet_productions.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (n) => `Write ${n} PUPPET-THEATRE PRODUCTIONS for ToyBot's puppet-theatre path. Each describes the SCENE ON STAGE in a small toy theatre mid-performance — the story being played and the painted set it is played on. Photoreal cinematic macro photography of a real handmade toy theatre. Each entry 22-34 words.

━━━ WHAT TO DESCRIBE ━━━
The PRODUCTION: what story is on stage right now, and the painted cardboard/timber SET built for it. The puppets themselves are supplied separately — here build the play and the set dressing.

━━━ VARIETY MANDATE (spread across all ${n}) ━━━
- Fairy-tale forest scene, layered painted tree flats receding, a cottage cut-out at centre
- Storm at sea, painted wave-boards rocking in grooves, a ship cut-out pitching between them
- Throne room, painted arches and a tiny carpet, a paper throne on a riser
- Moonlit balcony, a cut-out tower with a paper moon hung on a wire behind
- Village square with painted shopfronts, bunting strung across the stage
- Dragon's cave, jagged painted rock flats, a treasure heap of foil and beads
- Snowy street, white-flocked flats, a paper lamppost, torn-tissue snow falling from the flies
- Garden with a painted trellis and cardboard hedges in tiered rows
- Circus ring, striped painted backcloth, a hoop on a stand
- Underwater scene, blue gauze layers, cut-out fish on wires at different depths
- Kitchen interior, a painted dresser flat, tiny props on a shelf
- Harvest field, painted corn-stook flats, a low golden backcloth
- Wizard's study, painted bookshelf flat, a cut-out window with stars
- Market fair, painted stall fronts, tiny paper lanterns overhead
- Riverbank, a painted bridge flat crossing the stage, rushes in the wings
- Desert with painted dune flats in overlapping layers, a paper sun low behind
- Toy-shop interior, painted shelves loaded with tinier toys
- Frozen palace, silver-painted flats, cellophane icicles catching the light
- Farmyard with a painted barn flat and a fence run across the boards
- Night sky scene, a dark backcloth pricked with pinholes lit from behind

━━━ EVERY ENTRY INCLUDES ━━━
- THE STORY MOMENT on stage (what is happening in the play)
- THE PAINTED SET as real handmade materials: painted cardboard flats, cut-outs, a backcloth, wave-boards, gauze layers, things hung on visible wires
- ONE DEPTH CUE — flats in overlapping LAYERS, or a cut-out in front of a backcloth, so the little stage has real recession

━━━ HARD RULES ━━━
- This is a REAL PHYSICAL TOY THEATRE photographed on a table. Every element is painted card, paper, timber, gauze, foil or tissue — visibly handmade, with honest edges and brush-marks.
- NO real humans anywhere. No audience faces, no puppeteer, no hands.
- NO readable text: a painted sign or playbill may be present but its lettering is worn, abstract or blank.
- NO digital or CGI look. NO glowing or magical light — the light is practical (footlights, a lamp, a candle, a bulb).
- Describe only what IS present. Never write a negation.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_puppet_cast.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (n) => `Write ${n} PUPPET CAST members for ToyBot's puppet-theatre path. Each is ONE puppet caught MID-PERFORMANCE on a small toy stage. Photoreal cinematic macro photography of a real handmade puppet. Each entry 18-30 words.

━━━ WHAT TO DESCRIBE ━━━
ONE puppet, its construction, and what it is DOING in the scene right now. The puppet is visibly a PUPPET — the mechanism is part of the charm and must be visible.

━━━ PUPPET TYPES (spread across all ${n}) ━━━
- Marionette on visible strings — carved wooden limbs, jointed knees, strings running up out of frame to a control bar
- Rod puppet — a slender rod reaching in from below or the side to a hand or arm
- Glove puppet — a soft cloth body with a modelled head, arms held wide
- Shadow puppet — a flat cut-out silhouette pressed against a lit screen, articulated at the joints with pins
- Paper-and-split-pin puppet — flat painted card, limbs pinned so they swing
- Sock or felt puppet — stitched seams, button eyes, felt tongue
- Carved wooden head on a cloth body, painted cheeks, chipped varnish

━━━ CHARACTER RANGE ━━━
Heroes, villains, kings and queens, animals, dragons and monsters, witches, knights, jesters, woodcutters, sailors, fairies, a chorus of small identical figures. Vary who they are as widely as how they are built.

━━━ EVERY ENTRY INCLUDES ━━━
- THE PUPPET TYPE and its visible mechanism (strings, rod, pins, the puppeteer's absent hand implied inside a glove body)
- ITS CONSTRUCTION as real materials — carved and painted wood, cloth, felt, painted card, papier-mache, wool hair, glass-bead eyes, chipped varnish, visible stitching
- WHAT IT IS DOING, as an active verb, mid-gesture: lunging, bowing, reaching, recoiling, pointing, cowering, brandishing, dancing, leaning over the footlights

━━━ HARD RULES ━━━
- It is always unmistakably a PUPPET, never a living being and never a real human. Faces are carved, painted, stitched or cut — honest handmade faces, charming rather than lifelike.
- NO real humans. NO puppeteer, NO human hands in frame.
- NO creepy, NO horror, NO uncanny-doll register. These are warm, characterful, well-loved toy-theatre puppets.
- NO glowing eyes, NO magic effects.
- Describe only what IS present. Never write a negation.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_puppet_stagecraft.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (n) => `Write ${n} STAGECRAFT DETAILS for ToyBot's puppet-theatre path. Each is ONE small piece of theatre machinery that proves this is a real toy theatre and not just a scene. Each entry 15-26 words.

━━━ WHY THIS AXIS EXISTS ━━━
The whole point of the path is the PROSCENIUM framing — the arch, the footlights raking up from below, the flats in their grooves, the strings going up into the dark. This axis supplies the one detail that sells it.

━━━ VARIETY MANDATE (spread across all ${n}) ━━━
- The proscenium arch itself — painted and gilded card, scrolled corners, a little painted crest at the top
- A scalloped valance or pelmet across the top of the opening
- Heavy curtains half-drawn, gathered and tied back with cord
- Footlights along the front edge — tiny bulbs or candle-stubs in a trough, raking light upward
- A control bar hanging above with strings running down out of the flies
- Flats standing in grooves cut into the stage floor, the grooves visible
- The wings — the narrow dark gap at the side with a prop waiting just out of sight
- A painted backcloth on a roller, one edge curling
- A cut-out on a wire slid halfway across the stage
- A trapdoor seam in the boards
- A tiny prompt-box at the front edge
- Sandbags or lead weights holding a flat upright
- Tissue snow or torn paper petals caught mid-fall from above
- Scuffed and scratched stage boards, chalk marks where a flat stands
- The lighting bar with a couple of small clip lamps aimed down
- The stage-front lip with a chipped painted edge
- A row of little seats or a single empty seat in the near foreground, out of focus
- Dust drifting in the beam of the footlights

━━━ EVERY ENTRY INCLUDES ━━━
- THE PIECE OF MACHINERY
- WHERE it sits in frame (across the top, along the front edge, in the wings, above in the flies, underfoot)
- ONE WEAR OR MATERIAL detail — chipped gilt, scuffed boards, frayed cord, curling paper, warm bulb-glow, fingerprints in the paint

━━━ HARD RULES ━━━
- Everything is handmade toy-theatre material: painted card, timber, cord, foil, tissue, tiny bulbs.
- NO real humans, NO puppeteer, NO hands.
- NO readable text.
- Describe only what IS present. Never write a negation.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
