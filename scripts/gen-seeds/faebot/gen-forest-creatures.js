#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/forest_creatures.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} unified descriptions of EXOTIC FOREST CREATURES — fairies, dryads, nymphs, forest-spirits, leshy-lords, kodama. The kind of beings that, glimpsed in a clearing, make you stop and think "wow, that's stunningly beautiful." Each entry is a complete creature description for a downstream Flux fantasy-illustration prompt-writer.

Each entry: 35-55 words, woven as ONE paragraph (NOT a field list).

━━━ THE TARGET ━━━
Imagine a hidden trail-cam catching a real forest spirit on film — undeniably beautiful, exotic, unmistakably magical. Like the dryads of Princess Mononoke, the elves of Lothlorien, the spirits in a Brian Froud Faerie book, the green-mana creatures on Magic the Gathering cards. Mythic-creature beauty, not human-model beauty. Confident wildness — they belong to the forest and don't pose for cameras.

━━━ STACK 4+ EXOTIC FEATURES PER ENTRY ━━━
Pick at least 4 from these categories per creature:

A) PLANT-MERGED SKIN (skin partly fused with plant matter):
"moss-tinted gold-olive skin", "bark-textured shoulders fading to smooth skin", "skin with faint glowing vein-patterns", "lichen-detail on cheekbones", "mottled green-flecked skin like dappled forest light", "translucent skin showing tiny constellations beneath", "bioluminescent freckles tracing the collarbone"

B) ORGANIC HAIR (hair literally IS plant or magical matter):
"long hair of living vines woven with tiny yellow blossoms", "wisteria-petal hair cascading past the waist", "hair of moss tendrils with white asphodel buds", "fern-frond hair fanning behind", "hair of pale willow-fronds", "river-water hair flowing slowly", "hair of small living glowworms", "antler-crown sprouting tiny oak-leaves with hair of dark pine-needles"

C) NATURAL LIVING-PLANT GARMENT (modest, untamed, the forest's offering):
"leaf-petal bodice and moss-skirt of woven ferns", "cape of overlapping willow-leaves", "thin wrap of pale silk-petal across the chest with vine-skirt", "draped garland of ivy across the torso", "shoulder-strap of woven vine and skirt of overlapping calla-lily petals", "petal-shawl over a band of folded leaves", "loose tunic woven of birch-bark strips", "snug bodice of overlapping rose-petals fading to gauzy mist below the hip"
The creature lives wild — her garment is whatever the forest provides. Modest in spirit, never on display.

D) EXOTIC FACIAL / HEAD FEATURE (the otherworldly tell):
"small antlers branching with leaves", "tall pointed ears feathered with down", "softly glowing amber eyes with vertical-slit pupils", "luminous pearl-iris eyes radiating gentle light", "a third eye glowing softly on her forehead", "delicate gills along her neck", "a constellation of tiny fireflies orbiting her crown", "translucent dragonfly-wings folded against her shoulder-blades", "barely-visible fawn-spots dappling her temples"

E) MAGIC SIGNATURE (visible enchantment near her):
"softly glowing pollen-motes orbiting her shoulders", "tiny fireflies trailing her fingertips", "a luminescent will-o-wisp hovering at her ear", "a halo of slow-spinning butterflies", "her cupped palm cradling a glowing seed", "wildflowers blooming where she touches the ground", "translucent magic-veins pulsing softly under her skin", "a soft amber halo from her hands"

F) CANDID INTIMATE POSTURE (caught not posing):
"kneeling at moss-edge, palm cupped to a deer's nose", "half-turned profile, looking down at a glowing seed in her palm, oblivious to viewer", "perched on a moss-covered log, head tilted toward a fox-companion", "leaning against ancient bark with one shoulder merged into the trunk", "sitting cross-legged on a fern-cushion, hair falling forward across her face", "standing waist-deep in a pool, hands cupping moonlight, gaze lifted to the canopy", "crouched over a tiny mushroom-circle, planting one with her finger"

━━━ THE CREATURE CANON (rotate broadly) ━━━

PLANT-SPIRITS (lead category — dryad-nymph energy):
- Dryad (oak / willow / rowan / birch)
- Hamadryad (tree-bound, half-emerged from trunk)
- Naiad (freshwater pool / spring nymph)
- Meliae (ash-tree)
- Daphnaie (laurel)
- Vine-nymph
- Moss-maiden / bog-nymph
- Huldra / Skogsrå (Scandinavian forest-being with subtle inhuman tell — fox tail or bark on the back hint)

WINGED FAE (small-to-human-scale):
- Forest fairy (taller fae — willowy, dragonfly-winged)
- Pixie-queen
- Forest priestess / hedgewitch (more covered, magic-marked)
- Forest queen (regal antler-crown, vine-trained gown)
- Tylwyth Teg fae-lady (Welsh, processional grace)

ANIMAL-SPIRIT BEINGS:
- Stag-spirit (humanoid with branching antlers, fawn-spotted skin, deer eyes)
- Owl-spirit fairy (feathered cloak, large amber eyes)
- Fox-spirit / Kitsune (multi-tailed, vulpine ears, foxglove circlet)
- Raven-fae (corvid-feathered humanoid)
- Swan-maiden (feathered wrap, graceful long neck)

FOREST-LORDS (occasional masculine variety):
- Leshy (tall antlered bark-skinned forest lord)
- Green Man (face entirely woven of leaves)
- Cernunnos / Horned forest-god
- Faun / Satyr (half-goat, vine-crowned, panpipes)

GLOW + MOON CREATURES:
- Moonlight nymph (silvery skin, hair of stardust)
- Will-o-wisp spirit (humanoid form within floating light)
- Foxfire-spirit (bioluminescent fungal-glow being)
- Glow-moth fairy (luna-moth wings, pearlescent skin)

KODAMA / TREE-SPIRITS (occasional):
- Kodama (small white tree-spirit, oversized round head, simple painted features)
- Mossfolk small being

━━━ EXAMPLE OUTPUTS (calibrate to this voice) ━━━
"A willow-dryad with moss-tinted gold-olive skin and long hair of pale green willow-fronds woven with tiny white asphodel buds, draped garland of ivy across her torso and a low vine-skirt, softly glowing amber eyes lowered in calm focus, her cupped palm cradling a luminescent seed, kneeling at moss-edge of a forest stream, oblivious to the viewer."

"A Huldra forest-being with mottled green-flecked skin like dappled forest light and waist-long hair of dark pine-needles braided with single white moonflowers, a single-shoulder wrap of overlapping birch-bark strips, tall pointed ears feathered with down, eyes the luminous pearl of an oncoming dawn, a slow halo of fireflies orbiting her shoulders, half-turned profile leaning against an ancient oak with one palm merged into the bark."

"A Leshy lord of the wood — tall antlered figure with bark-textured shoulders fading to bare skin patterned with faint glowing vein-lines, vine-beard threaded with tiny acorns, hair of dark pine-fronds, draped cloak of overlapping oak-leaves, antler-crown sprouting living oak-leaves and tiny mistletoe-clusters — half-emerged from a moonlit grove, palm extended toward a small white stag, faint amber wisps drifting between them."

"A stag-spirit with bark-textured shoulders fading to smooth gold-olive skin dappled with faint fawn-spots, a small set of branching antlers sprouting tiny oak-leaves, hair of moss tendrils braided with white wildflowers, a thin wrap of pale silk-petal across the chest and vine-skirt, luminous deer-dark eyes, perched on a mossy log with a fox-companion at her ankle, soft pollen-motes drifting around her shoulders."

"A pixie-queen on the larger scale with translucent dragonfly-wings folded against her shoulder-blades, skin a pale luminescent pearl with bioluminescent freckles tracing her collarbone, hair of pale fern-fronds woven with violet wildflowers, a snug bodice of overlapping rose-petals fading to gauzy mist below the hip, sitting cross-legged on a giant mushroom cap, a halo of slow-spinning butterflies orbiting her crown."

━━━ AVOID ━━━
- Posed-for-camera energy / model poses / display energy
- Sexualized framing — focus is mythic-creature beauty, not human-attraction
- Costume-y "human dressed as fairy" — body must merge with plant matter authentically
- Photographic / digital / 3D / CGI / anime descriptors
- Modern objects (phones, glasses, electronics)
- Realistic non-magical humans
- Violent / scared / edgy moods
- Fewer than 4 stacked exotic features per entry
- Entries without a magic-signature element

━━━ HARD BANNED CREATURE TYPES (these break FaeBot DNA — NEVER generate) ━━━
- NO bat-fae / bat-wings / bat-spirits — bats are gothic / vampiric, not painterly-forest-fae
- NO vampire-fae / vampire-anything / fangs / blood-themed creatures
- NO demon-fae / devil-fae / horned-demon imagery
- NO membranous bat-style wings — wings are translucent dragonfly / damselfly / butterfly / moth / luna-moth / fairy-style only
- NO "perched upside-down" / "hanging upside-down" / "inverted perch" posture (bat behavior)
- NO clawed hands / talon-fingers (raptor-bird coded — replace with delicate / luminous / glowing fingers)
- NO fang-displays / vampire-fangs / pointed-fangs
- NO undead / wraith / banshee / ghost-fae — keep creatures alive and warm
- NO insect-warrior creatures (mantis-fae / wasp-fae / hornet-fae) — too aggressive for FaeBot's peaceful painterly DNA
- NO scorpion-fae / spider-warrior-fae — spider-fae is OK if web-themed and gentle, NOT predator-coded

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete creature description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
