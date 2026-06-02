#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/tiny_fae.json',
  total: 25,
  batch: 25,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} unified descriptions of TINY WINGED FAE for FaeBot's tiny-fae path — palm-sized fairies, sprites, pixie-folk caught in candid intimate moments. Painterly-realistic rendering matching FaeBot's same-world aesthetic (dryad-portrait + forest-fairy-scene). NOT cartoon Tinkerbell. NOT Disney-cute. NOT chibi-anime. Each entry feeds a Flux concept-art prompt-writer.

Each entry: 35-55 words, woven as ONE paragraph (not a field list).

━━━ THE WORLD (must match other FaeBot paths) ━━━
This is the SAME painterly enchanted-forest world as dryad-portrait. Brian Froud + Charles Vess + fantasy-novel-cover painted-fae lineage. Beautiful. Mythic. NEVER cartoon. The tiny-fae are the smaller cousins of the dryads — same forest, different scale.

━━━ SCALE + FRAMING — NON-NEGOTIABLE ━━━
Palm-sized to hand-sized fae (3-8 inches tall). The render must UNAMBIGUOUSLY ESTABLISH her tiny scale via a normal-sized real forest animal in the same frame that DWARFS her. Flux otherwise renders fairies at human scale by default, so EVERY entry MUST include one explicit scale-anchor.

REQUIRED SCALE-ANCHOR PER ENTRY (pick at least one):
- "standing on the back of a robin / sparrow / wren / chickadee — she's only as tall as the bird's chest"
- "perched on the snout of a sleeping fox-cub — her whole body fits between its ears"
- "balanced on a hedgehog's quills — only as tall as the hedgehog's nose"
- "sitting on the curve of a sleeping squirrel's tail — she's smaller than its ear"
- "walking along the back of a stag-beetle — the beetle dwarfs her"
- "standing on a dewdrop the size of her head"
- "perched on the open palm of a sleeping fawn's hoof"
- "riding on the back of a hummingbird mid-flight, gripping its feathers"
- "balanced atop a grown forest mushroom — the mushroom-cap is wider than she is tall"
- "stepping out of the open bell of a foxglove — the flower is twice her height"
- "her whole body curled inside the curl of a young fern-frond"

The scale-anchor is the SCALE PROOF. Without it Flux just renders a regular-sized fairy with wings.

SINGLE focal fae per render. The scale-anchor creature is companion/perch, not a second character.

━━━ STACK 4+ EXOTIC FEATURES PER ENTRY ━━━
A) BODY (slender, beautiful, painterly-real — NOT chibi):
"slender willowy proportions", "elegant graceful body", "delicate athletic build", "softly curved feminine form" (or masculine equivalent), "painterly-realistic anatomy at miniature scale"

B) WINGS (the signature — translucent, painterly):
"translucent dragonfly wings veined with sap-gold", "luna-moth wings with iridescent silver veining", "monarch butterfly wings folded against her back", "gossamer fairy wings catching golden light", "iridescent hummingbird-fast wings blurred mid-flutter", "twin damselfly wings shimmering pale blue", "lacy translucent wings like spun glass"

C) HAIR (organic, vine-threaded — same vocabulary as larger fae):
"long flowing hair of pale silk threaded with tiny dewdrop-pearls", "wisteria-petal hair", "fern-frond hair fanning behind her", "river-water hair flowing slowly", "hair of dark green leaves cascading", "wild moss-green hair woven with tiny wildflowers"

D) GARMENT (natural living-plant — same as dryad-portrait language):
"thin wrap of pale silk-petal across the chest with vine-skirt", "leaf-petal bodice and moss-skirt of woven ferns", "draped garland of ivy across the torso", "shoulder-strap of woven vine and skirt of overlapping calla-lily petals", "petal-shawl over a band of folded leaves", "loose tunic woven of single-leaf strips", "snug bodice of overlapping rose-petals fading to gauzy mist below the hip"

E) SKIN / FACE / EYES (painterly, alluring):
"luminescent pearl skin", "moss-tinted gold-olive skin at miniature scale", "softly glowing amber eyes", "luminous violet eyes radiating gentle light", "bioluminescent freckles tracing her collarbone", "translucent skin showing tiny constellations beneath", "delicate features painterly-rendered"

F) CANDID INTIMATE MOMENT WITH SCALE-ANCHOR (combine pose + the scale-anchor creature):
"perched on the back of a sleeping fox-cub, hand resting gently on its fur, only as tall as the cub's ear", "standing on the chest of a wren that's tilted its head curiously toward her, the bird three times her size", "kneeling on the snout of a hedgehog, leaning forward to whisper to it, smaller than the hedgehog's nose", "riding a hummingbird mid-flight, hair streaming, her body length matching one of the bird's wings", "sitting on the dewdrop-laden back of a sleeping squirrel, the tail curled around her like a couch", "balanced atop a stag-beetle's shell, holding a single-leaf shield, her whole body shorter than the beetle's antennae", "stepping out of the open bell of a foxglove, the flower towering twice her height beside her", "asleep curled inside a closed rose-petal, only her foot and a wing-tip visible against a normal-sized sleeping ladybug nestled at the petal's base"

G) MAGIC SIGNATURE:
"trail of glowing pollen behind her wings", "tiny fireflies orbiting her at her scale", "her cupped palm cradling a glowing seed", "soft halo of sparkles", "wildflowers blooming where she touches the leaf"

━━━ EXAMPLE OUTPUTS (every entry has a SCALE-ANCHOR proving she's tiny) ━━━
"A palm-sized willow-fae with slender willowy proportions and translucent dragonfly wings veined with sap-gold, hair of pale silk threaded with dewdrop-pearls, leaf-petal bodice and moss-skirt of woven ferns, softly glowing amber eyes lowered, perched on the snout of a sleeping fox-cub — her whole body fits between the cub's ears — trail of golden pollen drifting behind her wings."

"A tiny moss-fae with luminescent pearl skin and luna-moth wings, hair of moss-green leaves woven with tiny wildflowers, draped garland of ivy across her torso, riding on the back of a robin mid-perch on a thick branch, gripping the bird's feathers — her body length only the height of the robin's chest — soft halo of sparkles around her shoulders."

"A hand-sized petal-fairy with elegant graceful body, monarch butterfly wings folded against her back, hair of wisteria-petals, snug rose-petal bodice fading to gauzy mist below the hip, softly glowing amber eyes, kneeling on the curve of a sleeping squirrel's tail — smaller than the squirrel's ear — fireflies orbiting at her scale."

"A small dragonfly-fae with bioluminescent freckles and translucent skin showing tiny constellations beneath, gossamer fairy wings catching golden light, river-water hair, thin wrap of pale silk-petal across the chest, balanced atop a stag-beetle's shell at twilight — her body shorter than the beetle's antennae — hair streaming behind her."

"A tiny luna-fae with luminescent pearl skin and translucent damselfly wings, hair of pale willow-fronds, leaf-petal bodice, stepping out of the open bell of a foxglove blossom — the flower twice her height beside her — fireflies orbiting at her scale, dewdrops on the petals scaled large beside her."

━━━ AVOID ━━━
- CHIBI / ANIME / DISNEY / TINKERBELL / cartoon designs
- Oversized-head / mascot proportions (PAINTERLY-REAL anatomy at miniature scale)
- Photographic / digital / 3D / CGI descriptors
- Modern objects, realistic non-magical humans
- Violent / scared / edgy moods
- Multiple-fae crowds (single focal fae + ONE small creature companion at most)
- "Cute" cartoon language

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete fae description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
