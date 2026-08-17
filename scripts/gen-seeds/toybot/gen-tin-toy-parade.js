#!/usr/bin/env node
// ToyBot Stage O3 (SHADOW) — tin-toy-parade. Vintage 1950s litho-printed TIN
// wind-up toys on parade: pressed-tin robots/cars/bands/animals with clockwork
// wind-up keys, in a nostalgic procession. SCENE = the parade/procession world;
// PIECES = the tin toys mid-march. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_tin_toy_scenes.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} TIN-TOY-PARADE scenes for ToyBot's tin-toy-parade path. Each is a nostalgic procession of vintage 1950s-60s LITHO-PRINTED TIN WIND-UP TOYS — pressed-tin robots, cars, marching bands and animals parading through a retro toy-town. Cinematic macro toy photography of a real vintage tin-toy diorama, shallow depth of field. Each entry 20-32 words.

━━━ WHAT TO DESCRIBE ━━━
The PARADE/procession + its retro toy-town setting + a sense of clockwork motion and celebration. The specific tin toys (the cast) are supplied separately — here build the PARADE-WORLD and its route.

━━━ PARADE SETTINGS (spread across all ${n}) ━━━
- Tin-robot march down toy-town main street (rows of litho-tin robots rolling in formation past printed-tin shopfronts, bunting overhead)
- Wind-up marching band procession (tin drummer, trumpeter and cymbal toys leading a parade down a lithographed street)
- Tin-car motorcade (a line of colorful pressed-tin cars and a fire-engine rolling past a tin filling-station and printed billboards)
- Circus parade of tin animals (tin elephants, monkeys and a ringmaster winding down a street toward a striped tin big-top)
- Tin-toy carnival midway (a litho-tin Ferris wheel and carousel turning, tin toys queued along a printed-tin fairway)
- Retro-rocket & space-toy parade (tin rockets, ray-gun robots and a flying-saucer toy rolling under a starry printed backdrop)
- Tin train & station procession (a litho-tin locomotive and cars pulling into a printed-tin station, tin porters and signals)
- Seaside tin-toy promenade (tin boats, a lighthouse and wind-up crabs parading along a printed-tin boardwalk and pier)
- Tin farm parade (a tin tractor, hen-and-chick pecking toys and a wind-up cow trundling past a lithographed red barn)
- Tin-toy holiday parade (tin toy-soldiers, a wind-up drummer and a sleigh toy marching under printed-tin snowy rooftops)
- Tin airfield procession (litho-tin biplanes and a zeppelin toy taxiing past a printed-tin hangar and control tower)
- Tin-town festival square (tin toys gathered around a wind-up bandstand, printed-tin fountains, streamers and pennants)

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is vintage LITHOGRAPHED PRESSED TIN — colorful printed-on detail (rivets, faces, dials, clothes all printed on the metal), pressed-tin body panels with tab-and-slot seams, clockwork WIND-UP KEYS in backs, slight patina, tiny scratches and a warm enamel sheen. 1950s-60s Japanese/German tin-toy aesthetic (Masudaya / Yonezawa register). Warm nostalgic studio lighting, macro collectible photography, shallow DOF. NOT plastic, NOT CGI — real vintage tin toys.

━━━ RULES ━━━
NO humans (tin figures/robots/soldiers are fine — they are the cast, supplied separately). NO readable text (litho printing reads as decorative marks only). Keep each entry a distinct parade theme + a specific tin detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_tin_toy_pieces.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} TIN-TOY CAST snippets for ToyBot's tin-toy-parade path — vintage wind-up tin toys mid-parade, to be dropped into a tin-toy procession as its clockwork stars. Each 12-20 words. START WITH A TIN TOY + AN ACTIVE VERB.

━━━ TIN-TOY TYPES (spread across all ${n}) ━━━
Litho-tin robots (boxy, dial-chested, antenna), tin wind-up cars and fire-engines, a tin drummer/trumpeter/cymbal-monkey, tin animals (elephant, hen, cat, ladybug), a tin toy-soldier, a tin biplane or rocket or flying-saucer, a tin clown, a tin train engine. All are REAL pressed-tin wind-up toys with printed detail and a wind-up key, never alive.

━━━ ACTIONS (spread across all ${n}) ━━━
- a boxy litho-tin robot rolling forward, chest-dials lit and key half-wound
- a wind-up tin drummer monkey clashing its cymbals mid-march
- a bright pressed-tin fire-engine leading the motorcade, ladder raised
- a tin ray-gun robot sparking at the head of the space parade
- a tin toy-soldier marching stiffly, printed rifle on its shoulder
- a wind-up tin elephant lumbering along, trunk curled up
- a litho-tin biplane taxiing down the printed runway, propeller a blur
- a tin clown pedaling a little tin unicycle down the street
- a pressed-tin locomotive puffing a cotton-wisp of smoke as it rolls
- a wind-up tin hen pecking along, tin chicks trailing behind
- a tin rocket toy rolling upright toward the starry backdrop
- a tin bandmaster raising its baton before the wind-up band

━━━ RULES ━━━
The tin toy is the small hero, mid-action, key winding. Everything is real pressed litho-tin with printed detail, never alive, never human (tin soldiers/robots are metal toys). NO text. Keep each a distinct tin toy + verb.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
