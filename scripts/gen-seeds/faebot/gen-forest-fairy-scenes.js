#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/forest_fairy_scenes.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENCHANTED FOREST CREATURE scene descriptions for ForestBot. Each scene is a CANDID GLIMPSE into a magical forest — caught a moment with a forest spirit, dryad, fairy, leshy, kodama, etc. The vibe is HIGHLY organic, HIGHLY enchanted, HIGHLY magical. Every render is a tiny sacred moment.

Each entry: 22-35 words. ONE specific creature in ONE specific forest setting in ONE intimate / contemplative / candid moment.

━━━ NON-NEGOTIABLE — ORGANIC + MAGICAL IN EVERY ENTRY ━━━
Every entry MUST include at least ONE of each:

A) PLANT-ORGANIC BODY — the creature is PART OF THE FOREST. Use this language:
   - "moss-tinted skin" / "gold-olive skin"
   - "vines and ivy growing from skin"
   - "tree-bark patches on shoulders / arms"
   - "small sprouting leaves emerging from collarbone / cheek / hairline"
   - "mossy growth on back / shoulders"
   - "tiny roots emerging at fingertips / from feet"
   - "lichen detail on skin"
   - "translucent dragonfly wings veined with sap"
   - "antlers sprouting tiny leaves"
   - "wisteria-petal hair"
   - "hair WOVEN with vines + tiny flowers"
   - "fern-frond shoulders"
   The body itself is forest matter — not a costume.

B) FLORAL INTEGRATION — flowers and growing things on/around the creature:
   - "tiny wildflowers blooming where she touches"
   - "dewdrop pearls on petal-crown"
   - "blossoms crowning her head"
   - "lily-of-the-valley vines spiraling up an arm"
   - "violet sprig in the hair"
   - "moss-roses opening at her feet"
   - "honeysuckle drape on shoulders"
   - "bluebell-cluster ringing her ankles"

C) MAGICAL ENCHANTMENT — sparkle / glow / pollen / will-o-wisp / fairy-dust visible:
   - "softly glowing pollen motes drifting around her"
   - "tiny golden sparkles trailing her fingertips"
   - "will-o-wisps floating nearby"
   - "luminescent moss glow"
   - "phosphorescent fungus light"
   - "pearlescent dewdrop shimmer"
   - "soft halo of magical pollen"
   - "iridescent shimmer on dragonfly wings"
   - "violet-twilight magic glow from cupped hands"
   - "fairy-dust sparkle trail"
   - "tiny glowing seeds rising from her palm"
   - "candle-soft witch-light orb floating beside her"

D) CANDID INTIMATE MOMENT — caught not posing:
   - "kneeling at moss-edge, palm cupped to a deer's nose"
   - "half-turned profile, looking down at glowing seed in her palm"
   - "perched on root, head tilted toward fox-companion"
   - "drinking from a cupped leaf, eyes closed"
   - "sitting cross-legged on stump, vine-hair falling over face"
   - "leaning against tree-trunk merged with bark"
   - "crouched over a tiny mushroom-circle, planting it with one finger"
   - The creature is NOT looking at viewer, NOT posing, NOT centered.

━━━ THE CREATURE CANON (rotate broadly — don't cluster on dryads) ━━━

WOOD-NYMPH / DRYAD FAMILY (plant-merged feminine spirits):
- Dryad (oak / general)
- Hamadryad (tree-bound, half-emerged from trunk)
- Meliae (ash-tree)
- Daphnaie (laurel)
- Epimeliad (apple-blossom)
- Caryatid (walnut)
- Naiad (freshwater pond/stream nymph — plant-coded, not water-monster)
- Alseid (grove)
- Limoniad (meadow)
- Auloniad (valley)
- Vine-nymph / Ivy-nymph

FOREST-LORD ARCHETYPES (mature, antlered, gravitas):
- Leshy (Slavic — tall, antlered, bark-skin, vine-beard, lord of the wood)
- Green Man (face entirely composed of leaves, foliage as beard)
- Cernunnos / Horned Forest God (antler-crowned, stag-eyed)
- Faun / Satyr (half-goat, panpipes, vine-crowned)
- Pan-spirit (half-goat, gentle pipes-player)

JAPANESE FOREST SPIRITS:
- Kodama (small white tree-spirit, oversized round head, simple painted features, bobbing politely)
- Kitsune (multi-tailed fox-spirit, vine-collared, glowing-eyed)
- Tanuki (raccoon-dog spirit with leaf-cap)

ROYAL FAE:
- Forest Queen (antler-crowned, vine-trained gown, regal stillness)
- Forest King (mossy-bearded, antler-crowned, staff of living wood)
- Tylwyth Teg (Welsh fae — taller, processional)

WINGED FAIRY-FOLK (small-scale, sparkles natural here):
- Fairy with translucent dragonfly wings + flower-crown
- Pixie-sprite (palm-sized, glowing, bare leaf-tunic)
- Glow-moth fairy (luna-moth wings, pearlescent skin)
- Petal-fairy (flower-petal dress, dewdrop crown)
- Hummingbird-fairy (iridescent wings, tiny)
- Acorn-cap fairy (acorn hat, oak-leaf cloak)
- Butterfly-girl (monarch wings, pollen-dusted)
- Will-o-wisp sprite (luminescent floating ball with wispy arms)

FULL-PLANT-BODIED BEINGS:
- Treant / Ent (walking tree, mossy bark, lantern-eyes among the leaves)
- Sentient willow (face emerging from weeping branches)
- Mushroom-folk / Myconids (fungal-bodied small beings, glowing caps)

ANIMAL-SPIRIT BEINGS:
- Stag-spirit (humanoid with stag head, glowing antler-tips)
- Owl-spirit fairy (feathered cloak, large amber eyes, owl-head)
- Raven-fey (corvid-feathered humanoid messenger)
- Fox-spirit nymph (vulpine ears + tail, foxglove circlet)
- White Stag (sacred glowing animal — pure stag form, no humanoid)

GLOW + GENTLE SHIMMER CREATURES:
- Foxfire-spirit (bioluminescent fungal-glow being)
- Moonlight nymph (silvery skin, hair of stardust)
- Wisp-orb spirit (just a floating light + soft wispy form)

GENTLE MAGICAL HUMANS-IN-FOREST:
- Druid in living-vine robes with leaf-crown
- Wild-elf / wood-elf with bark-armor and glowing-marked skin
- Forest priestess in moss-wrap, hair-woven-with-flowers

━━━ SETTINGS (rotate, don't cluster) ━━━
Mossy boulder-strewn forest stream / ancient oak grove with twisted roots / birch-tree clearing carpeted in bluebells / mushroom ring fairy-circle / hollow stump opening into miniature fairy hall / pond at twilight with lily-pads and fireflies / riverbank under willow's leaf-curtain / hilltop misty valley with distant glow / forest path between giant ferns / fern-grotto with trickling waterfall / sun-dappled meadow at forest edge / mossy log bridge over brook / acorn-strewn forest floor under giant oaks / wisteria archway over stone path / glowworm cave entrance behind waterfall / hollow-tree house with tiny glowing window / apple-blossom orchard at dawn / frosted winter forest with low warm light / twilight wood with floating glowing pollen / bluebell carpet under tall pines / babbling spring beside moss-covered standing stone / ancient gnarled tree with face emerging from bark

━━━ ACTIONS (intimate, candid, magical) ━━━
sipping dewdrops from cupped leaf / whispering blessing over a sprouting seedling / cupping a glowing seed in palm / weaving flower-crown / drinking from moonlit stream / playing tiny flute on mossy stump / pressing palm to ancient bark to wake the tree / releasing fireflies from cupped hands / brushing a fawn's nose / planting a tiny mushroom with one finger / tucking a glowworm into moss-bed / catching a falling petal / feeding berries to hedgehog / lighting a will-o-wisp lantern / painting a leaf with dewdrops / climbing a vine to spy on the moon / kneeling among ferns to listen / floating downstream on a leaf-boat / combing a unicorn's mane / greeting the dawn from a fern-tip / singing softly to a tiny owl-companion / cradling a moth in cupped hands

━━━ FORMAT EXAMPLE (every entry should hit this energy) ━━━
✅ "Dryad with moss-tinted gold-olive skin and vine-hair woven with tiny yellow blossoms, half-turned profile, sitting cross-legged on moss-covered rock by a forest stream, palm cupped around a softly glowing seed, dappled green light filtering through canopy, sparkles of pollen-magic drifting around her shoulders, tiny ferns sprouting from her collarbone."
✅ "Leshy lord of the wood — tall figure with bark-skin, vine-beard, and antler-crown sprouting tiny leaves — half-emerged from a moonlit oak grove, palm raised toward a small white stag, faint amber wisps glowing between them, mossy roots spreading from his bare feet."
✅ "Tiny pixie-sprite with translucent dragonfly wings and bluebell-petal dress, perched on the brim of a phosphorescent mushroom in a fairy-ring, dewdrop crown shimmering, fairy-dust trail behind her, soft golden glow lighting the ferns around her."
✅ "Kodama — small white tree-spirit with round head and simple painted face — peeking shyly from a hollow oak's burl, surrounded by floating glowing pollen-motes, soft pearl-light haloing the moss-circle around the trunk."

━━━ BANNED ━━━
- NO violent / scared / edgy moods
- NO posed-for-camera centered-portrait energy
- NO modern objects (phones, cars, glasses, electronics)
- NO real humans / no realistic non-magical people
- NO multi-creature crowds beyond the focal creature + ONE animal companion
- NO entry without plant-organic body language
- NO entry without floral element
- NO entry without magical glow / sparkle / pollen / wisp element

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
