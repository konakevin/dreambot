#!/usr/bin/env node
// ToyBot Stage O2 (SHADOW) — wooden-toy-land. A hand-carved heirloom WOODEN-toy
// world (Waldorf / Grimm's / Ostheimer aesthetic): carved-and-painted solid-wood
// toys in a warm wooden diorama. SCENE = the wooden setting/world; PIECES = the
// wooden toys mid-scene. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_wooden_toy_scenes.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} WOODEN-TOY-LAND scenes for ToyBot's wooden-toy-land path. Each is a warm handcrafted world built entirely from HEIRLOOM WOODEN TOYS — hand-carved and painted solid-wood pieces in the Waldorf / Grimm's / Ostheimer / Brio tradition. Cozy macro toy photography of a real wooden-toy diorama on a table, shallow depth of field. Each entry 20-32 words.

━━━ WHAT TO DESCRIBE ━━━
The wooden-toy SETTING/world + its carved terrain and buildings + a sense of gentle life. The specific wooden toys (the cast) are supplied separately — here build the WORLD from wood.

━━━ WOODEN-WORLD SETTINGS (spread across all ${n}) ━━━
- Wooden-train village (a Brio-style track winding past carved cottages, a little wooden station, painted-block houses, arched wooden bridge)
- Noah's-ark hillside (a carved wooden ark on a green-painted hill, pairs of carved wooden animals filing up a ramp, a rainbow arch)
- Wooden castle & knights (a stacked carved-block castle with a drawbridge, peg-knights on wooden horses, a carved wooden banner)
- Carved forest glade (turned-wood trees with felt canopies, wooden woodland animals, a peg-gnome cottage, a mushroom-ring of carved caps)
- Wooden farm (a red carved barn, a wooden tractor, painted farm animals, a fenced paddock of stacking-ring haystacks, an orchard of peg-trees)
- Building-block town (a town built from natural and painted wooden blocks, arch pieces as doorways, a block clock-tower, a wooden car on the street)
- Wooden harbor (a carved quay with a painted wooden boat, peg-fishermen figures, a lighthouse turned on a lathe, wooden-wave shapes)
- Stacking-ring & peg nursery-world (a whimsical world of rainbow stacking rings as hills, peg-people, a pull-along duck, a spinning-top tree)
- Wooden circus (a carved big-top of painted wood, a wooden ringmaster peg, carved circus animals on wheels, a striped block-tent)
- Wooden mountain railway (a lathe-turned mountain, a wooden funicular, carved pine trees, a tunnel arch, a tiny wooden chalet)
- Wooden marketplace (carved market stalls, wooden fruit and bread, peg-vendors, a cobble of painted wooden tiles, bunting of felt)
- Wooden windmill meadow (a turning carved windmill, a felt-and-wood meadow, wooden sheep, a peg-shepherd, a winding block path)

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is hand-carved painted solid wood — visible woodgrain, turned-lathe rounded forms, soft matte painted color, gently rounded child-safe edges, occasional natural unpainted beech/maple. Waldorf / Ostheimer / Grimm's / Brio heirloom-wooden-toy aesthetic. Warm natural wood tones, cozy hobby-table lighting, macro shallow DOF. NOT plastic, NOT CGI — real carved wooden toys.

━━━ RULES ━━━
NO humans (carved wooden peg-people/figures are fine — they are the cast, supplied separately). NO readable text. Keep each entry a distinct wooden-world setting + a specific carved detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_wooden_toy_pieces.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} WOODEN-TOY CAST snippets for ToyBot's wooden-toy-land path — carved wooden toys mid-scene, to be dropped into a wooden-toy world as its gentle life. Each 12-20 words. START WITH A WOODEN TOY + AN ACTIVE VERB.

━━━ WOODEN-TOY TYPES (spread across all ${n}) ━━━
Carved wooden animals (Ostheimer-style: deer, fox, rabbit, bear, horse, duck, sheep), peg-people (round-headed carved figures), a pull-along wooden duck or dog on wheels, a carved wooden train engine, a wooden car or truck, a spinning top, stacking rings, a wooden boat, carved knights/gnomes. All are REAL carved painted wood, never alive.

━━━ ACTIONS (spread across all ${n}) ━━━
- a carved wooden duck on wheels rolling down the block path, string trailing
- a peg-family gathered around a wooden table set with carved wooden bread
- a wooden train engine chuffing over the arched bridge, carved cars behind
- a carved wooden deer stepping between turned-wood trees
- a peg-knight raising a carved wooden sword before the block castle
- a spinning top whirling on the wooden town square
- a wooden boat gliding past the lathe-turned lighthouse
- a stack of rainbow stacking rings toppling in slow motion
- a carved wooden horse pulling a little wooden cart of felt hay
- a peg-shepherd guiding carved wooden sheep across the felt meadow
- a wooden tractor trundling past the red carved barn
- a carved gnome peeking from a turned-wood mushroom cap

━━━ RULES ━━━
The wooden toy is the small hero, mid-action. Everything is real carved painted wood with visible grain, never alive, never human (peg-figures are carved wood). NO text. Keep each a distinct wooden toy + verb.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
