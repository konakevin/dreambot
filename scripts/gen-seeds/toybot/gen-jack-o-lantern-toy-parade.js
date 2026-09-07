#!/usr/bin/env node
// AlphaBot candidate — jack-o-lantern-toy-parade (destination: ToyBot).
// A Halloween parade of vintage LITHO-PRINTED TIN WIND-UP TOYS shaped like
// grinning jack-o-lanterns: real pressed-tin wind-up toys, never a real
// carved pumpkin, never alive, always caught in motion. SCENE = the
// Halloween toy-town parade-world; PIECES = the wind-up jack-o-lantern-toy
// cast mid-action. MVP-25 each. Modeled on
// scripts/gen-seeds/toybot/gen-tin-toy-parade.js (the sibling ToyBot path).
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/jack_o_lantern_toy_parade_scenes.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} JACK-O-LANTERN-TOY-PARADE scenes for a Halloween candidate toy-bot path. Each is a whimsical, family-friendly parade of vintage LITHO-PRINTED TIN WIND-UP TOYS shaped like grinning jack-o-lanterns, processing through a Halloween toy-town. Cinematic macro toy photography of a real vintage tin-toy diorama, shallow depth of field. Each entry 20-32 words.

━━━ WHAT TO DESCRIBE ━━━
The PARADE/procession + its Halloween toy-town setting + a sense of clockwork motion and festive celebration. The specific jack-o-lantern tin toys (the cast) are supplied separately — here build the PARADE-WORLD and its route.

━━━ PARADE SETTINGS (spread across all ${n} — vary these, don't repeat the same setting twice) ━━━
- Front-porch-steps parade (toys rolling down a row of carved-stone porch steps past a printed-tin welcome mat and hanging paper bats)
- Pumpkin-patch procession (toys winding between rows of real vines and hay bales toward a printed-tin farm stand)
- Haunted toy-town main street (rows of jack-o-lantern toys marching past litho-tin shopfronts strung with cobweb bunting)
- Graveyard toy fairground (toys parading among small tin tombstones and a striped tin fortune-teller tent)
- Autumn-leaf-strewn sidewalk parade (toys rolling through drifts of real fallen leaves past a printed-tin picket fence)
- Candy-shop window display come to life (toys marching past jars of real candy corn and a printed-tin cash register)
- Attic toy-shelf Halloween diorama (toys parading along a dusty windowsill past a cobwebbed printed-tin trunk)
- Trick-or-treat toy-town street parade (toys rolling door to door past tin porch-lights and paper-lantern strings)
- Harvest-festival toy fairground (toys parading past a tin hay-wagon, a corn-maze entrance, and a bobbing-for-apples tin barrel)
- Spooky toy-town square with a bandstand (toys gathered around a wind-up bandstand strung with orange streamers)
- Cornfield-scarecrow procession (toys marching a dirt-path row between real cornstalks toward a printed-tin scarecrow)
- Toy-shop window Halloween display (toys parading past a printed-tin "Trick or Treat" banner and glowing shop lanterns)

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is vintage LITHOGRAPHED PRESSED TIN — colorful printed-on detail (grinning jack-o-lantern faces, rivets, seams, printed vine-stems, all printed on the metal, never carved), pressed-tin body panels with tab-and-slot seams, clockwork WIND-UP KEYS, slight patina, tiny scratches and a warm enamel sheen. 1950s-60s Japanese/German tin-toy aesthetic (Masudaya / Yonezawa register) reimagined for Halloween. Warm nostalgic studio or dusk lighting, macro collectible photography, shallow DOF. NOT plastic, NOT a real pumpkin, NOT CGI — real vintage tin toys.

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age (tin toys/figures are fine — they are the cast, supplied separately). NO readable text (litho printing reads as decorative marks only). PLAYFUL and FRIENDLY tone throughout — never genuine horror, gore, or real scares; this is family-friendly Halloween. Keep each entry a distinct parade setting + a specific tin detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/jack_o_lantern_toy_parade_pieces.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} JACK-O-LANTERN TIN-TOY CAST snippets for a Halloween candidate toy-bot path — vintage wind-up tin toys SHAPED LIKE jack-o-lanterns, mid-parade, to be dropped into a Halloween tin-toy procession as its clockwork stars. Each 12-20 words. START WITH THE TOY + AN ACTIVE VERB (it must always be caught IN MOTION, never standing still or posed).

━━━ WHAT EACH JACK-O-LANTERN TIN TOY IS ━━━
A real pressed litho-TIN wind-up toy shaped like a grinning jack-o-lantern — round tin body, a PRINTED-ON (never carved) face, a clockwork wind-up key, tab-and-slot tin seams. It is a TOY, never a real carved pumpkin, never CGI, never alive.

━━━ VARY ACROSS ALL ${n} (mix and match — don't repeat combinations) ━━━
- Printed face expression: gap-tooth grin, one-eyed wink, jagged zigzag mouth, sleepy crescent eyes, surprised round "o" mouth, lopsided smirk, triangle-nose toothy grin
- Locomotion / build: stubby tin legs waddling, small tin wheels rolling, a tin tread-track rumbling, a single tin foot hopping, tiny tin roller-skates gliding
- Topper / accessory (optional, vary — not on every entry): a curled tin vine-stem, a tiny printed witch hat, a black tin bowtie, a printed leaf topper, a tiny tin candy pail hooked on one arm
- Gesture: printed-tin arms waving, tipping its hat, holding up a small tin lantern, saluting, reaching toward another toy
- Mention the wind-up key explicitly on roughly HALF the entries only (half-wound in its back, a key mid-turn, a key glinting) — leave it implicit on the other half so no single detail is on every entry

━━━ EXAMPLES (format/length target) ━━━
- "a round litho-tin jack-o-lantern toy waddling forward on stubby tin feet, gap-tooth grin catching the light"
- "a one-eyed-wink jack-o-lantern tin toy rolling on small tin wheels, its curled vine-stem topper bobbing"
- "a jack-o-lantern tin toy in a tiny printed witch hat, key half-wound, tipping its hat mid-roll"

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age — every figure is a tin toy. Never "alive," never "real pumpkin," never CGI — always toy-medium language (printed, pressed, tin, wind-up, clockwork). NO readable text. PLAYFUL and FRIENDLY, never scary. Keep each entry a distinct toy + verb combination.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
