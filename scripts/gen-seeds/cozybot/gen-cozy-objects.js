#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/cozybot/seeds/cozy_objects.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COZY OBJECT descriptions for CozyBot — specific, evocative cozy items that get scattered into interior scenes to make them feel lived-in. 8-18 words each. Two of these are picked per render and injected into the scene.

━━━ THE FORMULA ━━━
Each entry names a SPECIFIC physical cozy object, with material/texture/condition detail. Multi-element entries are encouraged ("steaming ceramic mug beside dog-eared paperback open to page 84").

━━━ CATEGORIES (distribute) ━━━
- Hot drinks: steaming ceramic mug / cast-iron teapot with strainer / chipped enamel cocoa / espresso cup / vintage thermos / brass samovar / iron tetsubin
- Books / paper: dog-eared paperback / leather-bound journal / open atlas / sheet music / hand-stitched zine / library card slipped into a novel
- Textiles: knit wool throw rumpled / patchwork quilt / sheepskin draped on chair / hand-loomed Persian rug / embroidered pillow / linen napkin / handknit socks
- Plants: trailing pothos in cracked pot / fern bursting from brass planter / single eucalyptus stem in vase / herbs hanging upside-down / monstera in worn ceramic
- Lights / candles: brass-stem candlestick with hand-dripped wax / oil lamp with sooted glass / hurricane lantern / string-lights wrapped on shelf / clay lamp
- Food remnants: half-eaten croissant / wedge of cheese on wooden board / bowl of clementines / honey jar with stuck spoon / pomegranate split open
- Music / sound: vinyl spinning on turntable / acoustic guitar leaning on wall / ukulele on cushion / sheet music on piano stand / radio playing soft
- Tools / making: knitting needles in skein / open watercolor palette / fountain pen on letter paper / wood-carving and shavings / pottery wheel with clay
- Animals (distant detail only, not subject): cat curled on stack of books / sleeping dog on rug / songbird at feeder outside / owl on rafter / hedgehog by hearth
- Accumulated detail: stack of letters tied with twine / framed photographs on mantel / dried flowers in jar / brass-rim glasses on open book / pocket-watch on table

━━━ HARD RULES ━━━
- 8-18 words, dense
- ONE specific object per entry (or 2-3 if naturally clustered, like "mug beside open book")
- Material / texture / age / wear named
- NO people, NO body parts, NO hands holding things
- NO surreal: no glowing books, no floating mugs
- NO modern bland items (Apple device, generic IKEA mug) — antique, hand-made, worn-in

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Steaming hand-thrown ceramic mug, glaze cracked along the rim, beside dog-eared paperback open to page 84"
EX-2: "Hand-knit wool throw in oatmeal-and-rust, rumpled on the arm of a leather Chesterfield, single thread loose"
EX-3: "Brass candlestick with hand-dripped wax stalactite, fresh flame, wax pool flickering on the wood beside it"
EX-4: "Trailing pothos vine spilling from a cracked terracotta pot on the highest shelf, leaves catching warm lamp light"
EX-5: "Sleeping ginger cat curled on a stack of leather-bound books, paws tucked, slow rise and fall of breathing"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
