#!/usr/bin/env node
// AlphaBot — toy-graveyard-diorama candidate path (prototyped for eventual
// promotion to ToyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// A tabletop toy-graveyard diorama sibling to the proven tin-toy-parade
// path: vintage litho-printed TIN WIND-UP skeleton/monster toys posed among
// miniature tombstones, moonlit cinematic macro lighting, an optional
// dry-ice fog effect as the money shot. MVP-25, four generated pools:
//   - scene   : the graveyard-diorama world (tombstones, fence, mausoleum)
//   - monster : the clockwork Halloween cast (1-2 picked per render)
//   - fog     : MONEY-SHOT dry-ice fog vignettes (rolled ~55%, optional)
//   - prop    : secondary spooky-cute physical prop accents (rolled ~50%)
//
// Run: node scripts/gen-seeds/toybot/gen-toy-graveyard-diorama-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/toybot/seeds/';

const STRICT_BANS =
  '🚫 STRICT BANS: NO humans, human silhouettes, or human age/gender words (man/woman/boy/girl/person/etc), NO real skeletons/bones/gore, NO genuine horror or real scares, NO IP-named characters or brands, NO readable/legible text, NO photographer/camera-brand names, NO negation phrasing ("not scary", "no blood" etc — just write the playful positive register directly). Every creature is affirmatively a MANUFACTURED TIN WIND-UP TOY, never alive, never human.';

(async () => {
  await generatePool({
    outPath: DIR + 'toy_graveyard_scene.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a macro collectible photographer writing TOY-GRAVEYARD-DIORAMA world entries for ToyBot's tin-toy register (Masudaya / Yonezawa litho-tin tradition). Each entry describes ONE tabletop Halloween graveyard layout — a spooky-cute toy-scale world built from miniature tombstones, fences, and dead trees, never a real graveyard. Write ${n} entries, one flowing sentence each, ~25-45 words, comma-separated phrases ending in a period.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A crooked row of tin-toy tombstones leans at odd angles along a gravel path, a wrought-iron toy fence bent at one rusted corner, a bare skeletal toy tree reaching over the nearest stone."
"A miniature tin mausoleum door hangs ajar at the diorama's center, a punny carved epitaph catching the light on the stone beside it, a picket gate swinging open on one loose hinge."
"A tumbled tin-toy obelisk monument sits moss-patinaed near a wishing-well prop repurposed as a grave marker, a gravel path curling past a cluster of leaning stones toward a distant archway."

━━━ GRAVEYARD LAYOUT VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. Crooked row of tin tombstones with a punny carved epitaph
2. Wrought-iron toy fence bent and rusted at one corner
3. A miniature mausoleum or crypt door slightly ajar
4. A bare skeletal toy tree with dead branches reaching over a stone
5. A low stone wall ringed with a dry gravel border
6. A crooked toy signpost with a punny Halloween place-name
7. A pumpkin-patch corner with a few carved jack-o-lanterns
8. A toy wishing-well repurposed as a grave marker, a toy spider perched on the rim
9. A tumbled tin obelisk monument with moss-tin patina
10. A picket-fence gate hanging open on one loose hinge
11. A gravel path winding between the stones toward a distant archway
12. A cluster of leaning tombstones like dominoes about to topple
13. A stone bench beside a grave with a small tin lantern balanced on the armrest
14. A raised burial-mound shape with a carved marker on top
15. A bare toy tree draped in thin cobweb strands
16. A broken toy lamppost flickering beside the gravel path
17. A small footbridge over a dry ditch at the graveyard's edge
18. A cluster of small toy crossbones grave-markers (clearly toy props, not real bones)
19. A rusted toy gate arch with a tin bat perched on top
20. A raised dais or altar-stone at the diorama's center

Every entry must be readable as a WHOLE tabletop layout (not a single isolated object) and read as toy-scale (matchbox / thumb-sized / tabletop props), not full-size.

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'toy_graveyard_monster.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the CLOCKWORK HALLOWEEN CAST for ToyBot's toy-graveyard-diorama path — vintage LITHO-PRINTED TIN WIND-UP TOYS (Masudaya / Yonezawa register) mid-action in the graveyard. Each entry is ONE tin wind-up Halloween-monster toy, affirmatively a MANUFACTURED CLOCKWORK TOY (never a real skeleton, never alive, never a costumed human) with a painted FRIENDLY grin. Write ${n} entries, ~15-30 words each, one sentence, comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A tin wind-up skeleton toy dances a jaunty jig, clockwork rib-cage clacking, painted grin wide, key spinning at its back."
"A tin wind-up mummy toy shuffles forward, a printed bandage-reel arm spooling loose tin ribbon, button eyes gleaming."
"A tin wind-up black-cat toy arches its spring-loaded tail, printed fur stripes gleaming, clockwork motor humming beneath its base."

━━━ MONSTER-ARCHETYPE VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. Tin wind-up skeleton toy — clockwork rib-cage, dancing or marching
2. Tin wind-up mummy toy — spinning bandage-reel arm
3. Tin wind-up bolt-necked patchwork-monster toy — stiff-legged shuffle walk
4. Tin wind-up vampire-bat toy — clacking wings
5. Tin wind-up witch toy on a broom-wheel base — rolling cackle mechanism
6. Tin wind-up ghost toy — wobbling on a hidden spring
7. Tin wind-up black-cat toy — arched back, spring-loaded tail
8. Tin wind-up pumpkin-headed scarecrow toy — nodding grin mechanism
9. Tin wind-up werewolf toy — howling head-tilt mechanism
10. Tin wind-up spider toy — articulated legs skittering
11. Tin wind-up gargoyle toy — perched wing-flap mechanism
12. Tin wind-up jack-o-lantern-man toy — painted glowing grin
13. Tin wind-up owl toy — spinning head
14. Tin wind-up zombie toy — shambling gait, one loose bolt sparking
15. Tin wind-up dragon-bat toy — small wings flapping
16. Tin wind-up candy-corn-golem toy — comedic wobble walk
17. Tin wind-up skeleton-dog toy — tail-wag mechanism
18. Tin wind-up cauldron-imp toy — popping-lid mechanism
19. Tin wind-up bat-winged imp toy — hopping mid-air mechanism

Every entry must explicitly read as a TIN TOY (printed tin, painted/molded features, a key, a clockwork mechanism) — never as an alive creature or a human in costume.

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'toy_graveyard_fog.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT dry-ice fog axis for ToyBot's toy-graveyard-diorama path — the single detail that makes the shot iconic. Each entry describes ONE specific real dry-ice fog effect interacting with the tabletop graveyard diorama at macro toy scale. Write ${n} entries, ~20-35 words each, one sentence, comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"Low ground fog pools and curls around the base of a leaning tin tombstone, spilling slowly across the gravel toward the fence line."
"A moonbeam cuts a sharp cool-white shaft straight through drifting dry-ice fog, lighting the fog's slow roll like smoke in a spotlight."
"Fog curls up from a small toy cauldron prop set among the graves, thickening into a low bank that swallows the nearest stone's base."

━━━ FOG-MOMENT VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. Low ground fog pooling and curling around the base of a leaning tombstone
2. Fog spilling down the steps of a miniature mausoleum
3. A thin fog bank drifting between two tombstones, swallowing their bases
4. Fog curling up from a toy cauldron prop set among the graves
5. A moonbeam cutting a sharp shaft through drifting fog
6. Fog pooling in a low patch, lit from beneath by a hidden warm glow
7. Wisps of fog snagging on the wrought-iron fence pickets
8. A thick fog bank rolling low across the gravel path toward the viewer
9. Fog curling around a clockwork toy's base as it moves
10. A fog layer sitting exactly waist-high on the toy figures, their heads clear above it
11. Fog drifting through a broken toy gate arch
12. A fog patch swirling as if just disturbed by a passing toy
13. Fog pooling thick around the base of a bare dead toy tree
14. A soft fog haze softening the far tombstones into silhouette
15. Fog curling out from beneath a raised burial-mound marker
16. A fog bank lit warm orange from a nearby jack-o-lantern glow, fading to cold blue at its edges
17. Fog snaking along the ground between the stones like a slow river
18. Thin fog ribbons rising straight up past a flickering toy lamppost

Every entry describes the FOG EFFECT ITSELF interacting with the toy-scale diorama — not the whole scene, not the cast.

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'toy_graveyard_prop.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing secondary SPOOKY-CUTE PROP ACCENTS for ToyBot's toy-graveyard-diorama path — small physical toy details that add charm to the tabletop scene, distinct from any fog/atmosphere effect. Each entry describes ONE specific physical prop or detail placed in the diorama. Write ${n} entries, ~15-30 words each, one sentence, comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A small tin jack-o-lantern candy-pail prop sits tipped over on the gravel path, a few painted-tin candies spilled beside it."
"A second, smaller wind-up black-cat toy peeks out from behind a leaning tombstone, printed eyes catching the moonlight."
"A thin silver-thread cobweb stretches between two tombstones, a tiny tin spider dangling at its center."

━━━ PROP VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. A tin jack-o-lantern candy-pail prop tipped over on the path
2. A second, smaller wind-up black-cat toy peeking from behind a stone
3. A string of tin bat-shaped charms strung along the fence
4. A silver-thread cobweb stretched between two tombstones
5. A tiny tin candy-corn dish tipped over near the cast
6. A carved toy jack-o-lantern glowing warm beside the mausoleum
7. A tin toy raven perched atop a leaning tombstone
8. A miniature toy broomstick leaned against the fence
9. A scattering of tiny tin candy-wrapper props glinting near the path
10. A tin lantern hanging from a bent iron post, a warm flame-flicker painted inside
11. A cobweb strand with a small tin spider dangling from it
12. A pumpkin-shaped tin bucket overturned, spilling a few painted-tin candies
13. A tiny tin witch's-hat prop resting on a tombstone corner
14. A string of miniature paper-bat bunting sagging between fence posts
15. A tin skeleton-key prop hanging from the mausoleum door
16. A small pile of tin-toy autumn-leaf props swept against a stone
17. A tin owl figurine perched on the bare dead tree's branch

Every entry must be a PHYSICAL PROP OR OBJECT (not an atmospheric effect like fog/mist) and must read as toy-scale, manufactured, and clearly artificial.

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
