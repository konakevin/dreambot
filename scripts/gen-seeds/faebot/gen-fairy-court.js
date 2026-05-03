#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fairy_court.json',
  total: 25,
  batch: 25,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} unified scene descriptions of FAIRY COURT moments for FaeBot's fairy-court path — regal fae queens, forest royalty, processional sidhe, the Tylwyth Teg of Welsh myth caught in candid sacred-court moments. Painterly-realistic rendering matching FaeBot's same-world aesthetic (dryad-portrait + tiny-fae + forest-fairy-scene). Brian Froud + Charles Vess + fantasy-novel-cover painted-fae lineage. NEVER cartoon. Each entry feeds a Flux concept-art prompt-writer.

Each entry: 35-55 words, woven as ONE paragraph (not a field list).

━━━ THE WORLD (must match other FaeBot paths) ━━━
Same painterly enchanted-forest world as dryad-portrait. The dryads are wild forest-spirits; the fairy-court is the REGAL side — the noble fae, the queens of the wood, the processional sidhe in their sacred grove-throne moments. Same forest, different inhabitant register: ancient, regal, ceremonial.

━━━ SCALE + COMPOSITION ━━━
The COURT is the subject. Frame includes either:
- A FAE QUEEN as solitary regal focal figure (solo regal portrait energy at three-quarter-body or full-body scale), or
- A SMALL COURT (2-5 fae figures): queen + attendants, or processional cluster of noble sidhe, or queen-and-consort

The QUEEN if present fills 35-55% of frame; courtiers fan around her. Three-quarter body or full body framing — NOT tight portrait close-up (that's dryad-portrait's territory). NOT macro-fairy-scale (that's tiny-fae). This is THRONE-ROOM scale — full figures in a sacred grove.

━━━ STACK 4+ EXOTIC FEATURES PER ENTRY ━━━
A) PLANT-MERGED REGAL BODY (more covered than dryad — these are nobility):
"moss-tinted gold-olive skin", "skin like luminous pearl with subtle vine-pattern marks", "translucent skin with constellation-glow beneath", "porcelain-pale skin with bioluminescent freckles tracing collarbone"

B) ROYAL HAIR (longer, more elaborate than dryad):
"floor-length hair of living vines woven with hundreds of tiny flowers", "cascading silver hair threaded with gold-leaf and dewdrop-pearls", "long pearl-white hair with a coronet of tiny living butterflies", "elaborate braided hair of dark moss with violet wisteria flowing past her waist"

C) ROYAL GARMENT (regal, layered, more elaborate but still nature-spun):
"flowing gown of woven petals with a long trailing leaf-train", "layered robe of overlapping willow-leaves with vine-belted waist and floor-length skirt", "long elegant gown of moss and dew-spider-silk", "regal cloak of fern-fronds over a leaf-bodice and floor-sweeping skirt", "ceremonial robes of woven oak-leaves with embroidered vine-cord", "long gown of overlapping calla-lily petals with a trailing skirt"

D) ROYAL SIGNATURE (the regal tell):
"living antler-crown sprouting tiny leaves and gold-leaf", "diadem of woven vines with a single luminous pearl at her brow", "gold-leaf circlet of branching laurel", "tall sapphire-veined antler-crown", "ivy-and-thorn crown threaded through her hair", "translucent veil of woven dewdrop-silk falling from a circlet of flowers"

E) MAGIC SIGNATURE (regal scale):
"butterflies orbiting in slow circles around her crown", "soft amber halo emanating from her shoulders", "a luminous pollen-haze around her court", "tiny will-o-wisps drifting in formation behind her", "a floating crown of light above her brow", "wildflowers blooming where her trailing skirt brushes the moss"

F) COURT SETTING (sacred grove-throne):
"seated upon a moss-throne grown into the roots of an ancient oak", "standing in a moonlit clearing with her court arranged around her", "leading a slow procession through a wisteria-archway", "holding sacred audience in a fern-grotto with attendants kneeling", "presiding over a sacred-stone-circle at twilight"

G) CANDID NOBILITY MOMENT (regal but caught not posing):
"head turned in soft profile, looking down at a small offering held by a kneeling attendant", "seated on her throne with one hand resting on the moss-grown armrest, gaze lifted into the canopy", "walking slowly through her court, a lady-in-waiting holding the train of her gown", "extending one hand toward a small white stag knelt before her throne", "in quiet conversation with a single attendant, their faces turned toward each other in soft profile"

━━━ EXAMPLE OUTPUTS ━━━
"A fae queen seated on a moss-throne grown into the roots of an ancient oak, moss-tinted gold-olive skin and floor-length hair of living vines woven with hundreds of tiny yellow flowers, flowing gown of woven petals with a long trailing leaf-train, living antler-crown sprouting tiny leaves and gold-leaf, two attendant fae kneeling at her feet — head turned in soft profile gazing into the canopy, butterflies orbiting around her crown, sacred grove with dappled afternoon light."

"A processional of three Tylwyth Teg sidhe walking slowly through a moonlit wisteria-archway, the queen at center with cascading silver hair threaded with gold-leaf and a translucent dewdrop-silk veil, layered robe of overlapping willow-leaves, two attendant fae flanking her in simpler leaf-gowns — soft moonlit-blue light, drifting violet petals, regal stillness."

"The fae queen of the wood standing alone in a sacred-stone-circle at twilight, porcelain-pale skin with bioluminescent freckles, elaborate braided hair of dark moss with violet wisteria flowing past her waist, regal cloak of fern-fronds over a leaf-bodice and floor-sweeping skirt, ivy-and-thorn crown threaded through her hair, soft amber halo around her shoulders, ancient grove backing her."

"A queen on her moss-throne extending one luminous hand toward a small white stag knelt before her, translucent skin with constellation-glow beneath, long pearl-white hair with a coronet of tiny living butterflies, ceremonial robes of woven oak-leaves with embroidered vine-cord, tall sapphire-veined antler-crown, soft amber halo, two attendant fae standing in soft profile behind the throne."

━━━ AVOID ━━━
- CARTOON / chibi / Disney / fantasy-cartoon designs
- Photographic / digital / 3D / CGI descriptors
- Modern objects, realistic non-magical humans
- Violent / threatening / aggressive postures
- Single tiny-fae scale (that's tiny-fae path)
- Tight head-and-shoulders portrait framing (that's dryad-portrait path)
- Sexualized framing — focus is regal-otherworldly beauty
- Crowds beyond 5 figures (the court is a small intimate gathering)
- Throne rooms / castles / built architecture (the court is in a SACRED GROVE — the throne is grown moss/roots, the chamber is the trees)

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
