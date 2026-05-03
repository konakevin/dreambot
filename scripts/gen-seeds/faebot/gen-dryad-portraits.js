#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/dryad_portraits.json',
  total: 25,
  batch: 25,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} unified descriptions of ADULT-SCALE FEMININE PLANT-SPIRITS for FaeBot's dryad-portrait path — single dryads, nymphs, forest-priestesses, huldras, hamadryads. The "caught a real dryad on a hidden trail-cam" energy: gorgeous mythic-creature beauty, body partly-plant, intimate candid moments. Each entry feeds a Flux concept-art prompt-writer.

Each entry: 35-55 words, woven as ONE paragraph (not a field list).

━━━ SCALE + FOCUS ━━━
ADULT-SCALE — human-sized or near-human. NOT palm-sized fairies, NOT tiny sprites, NOT giants. SINGLE creature only (one focal figure, optional small animal companion). Feminine archetypes only for this path.

━━━ STACK 4+ EXOTIC FEATURES PER ENTRY ━━━
A) PLANT-MERGED SKIN: "moss-tinted gold-olive skin", "bark-textured shoulders fading to smooth skin", "skin with faint glowing vein-patterns", "lichen-detail on cheekbones", "mottled green-flecked skin like dappled forest light", "translucent skin showing tiny constellations beneath", "bioluminescent freckles tracing the collarbone"

B) ORGANIC HAIR: "long hair of living vines woven with tiny yellow blossoms", "wisteria-petal hair cascading past the waist", "hair of moss tendrils with white asphodel buds", "fern-frond hair fanning behind", "hair of pale willow-fronds", "river-water hair flowing slowly", "antler-crown sprouting tiny oak-leaves with hair of dark pine-needles"

C) NATURAL LIVING-PLANT GARMENT (modest, untamed, the forest's offering):
"leaf-petal bodice and moss-skirt of woven ferns", "cape of overlapping willow-leaves baring one shoulder", "thin wrap of pale silk-petal across the chest with vine-skirt", "draped garland of ivy across the torso", "shoulder-strap of woven vine and skirt of overlapping calla-lily petals", "petal-shawl over a band of folded leaves", "loose tunic woven of birch-bark strips", "snug bodice of overlapping rose-petals fading to gauzy mist below the hip"
She lives wild — her garment is whatever the forest provides. Modest in spirit, never on display.

D) EXOTIC FACIAL / HEAD FEATURE: "small antlers branching with leaves", "tall pointed ears feathered with down", "softly glowing amber eyes with vertical-slit pupils", "luminous pearl-iris eyes radiating gentle light", "a third eye glowing softly on her forehead", "delicate gills along her neck", "barely-visible fawn-spots dappling her temples"

E) MAGIC SIGNATURE: "softly glowing pollen-motes orbiting her shoulders", "tiny fireflies trailing her fingertips", "her cupped palm cradling a glowing seed", "wildflowers blooming where she touches the ground", "translucent magic-veins pulsing softly under her skin", "a soft amber halo from her hands"

F) PORTRAIT-SCALE HEAD/FACE/SHOULDER MOMENT (NO FULL-BODY POSES — this path is HEAD-AND-SHOULDERS / BUST framing only):
"head turned in soft 3/4 profile, eyes lowered in calm focus", "face tilted up to catch a single shaft of dappled light through the canopy", "head bowed as she looks down at something in cupped hands held just below her chin", "cheek pressed gently against ancient bark, eyes half-closed", "head turned away from viewer, only profile of cheek and ear-tip visible, hair flowing forward over her shoulder", "side-profile bust, eyes closed, lips slightly parted as if mid-whisper", "head tilted as a tiny firefly hovers near her ear", "looking down with gentle amusement at a small wildflower opening on her shoulder", "head turned toward something off-frame, expression curious, hair-vines cascading", "eyes lowered, a single tear-shaped dewdrop at the corner of her lashes", "she breathes out softly, a faint shimmer of pollen drifting past her lips", "her hand barely visible at the bottom of frame, fingertips just rising to brush a strand of hair from her cheek"

Every posture in this pool must be a PORTRAIT-SCALE moment — head, face, shoulders, neck, collarbone, optionally one hand near the face. NEVER a kneeling/sitting/standing/walking full-body action. Imagine the ENTIRE entry being rendered as a tight head-and-shoulders portrait painting — the posture must work at that scale.

━━━ THE CREATURE CANON FOR THIS PATH ━━━
Dryad (oak / willow / rowan / birch), Hamadryad (tree-bound, half-emerged from trunk), Naiad (freshwater pool / spring nymph), Meliae (ash-tree), Daphnaie (laurel), Vine-nymph, Moss-maiden / bog-nymph, Huldra / Skogsrå (Scandinavian forest-being with subtle inhuman tell), Forest priestess / hedgewitch (more covered, magic-marked), Tylwyth Teg fae-lady (Welsh).

━━━ EXAMPLE OUTPUTS (PORTRAIT-SCALE — head/bust only) ━━━
"A willow-dryad with moss-tinted gold-olive skin and long hair of pale green willow-fronds woven with tiny white asphodel buds, a thin wrap of pale silk-petal across the collarbone, softly glowing amber eyes lowered in calm focus, head turned in soft 3/4 profile as a single dewdrop catches her lashes, faint pollen-shimmer at her parted lips."

"A Huldra forest-being with mottled green-flecked skin like dappled forest light and waist-long hair of dark pine-needles braided with single white moonflowers, a single-shoulder wrap of overlapping birch-bark strips, tall pointed ears feathered with down, side-profile bust with cheek pressed gently against ancient bark, eyes half-closed, a slow halo of fireflies orbiting her shoulder."

"An oak-dryad with bark-textured shoulders fading to smooth moss-tinted skin, hair of living vines woven with tiny yellow blossoms cascading past her shoulder, leaf-petal bodice with small antlers branching with oak-leaves above, head turned away from viewer revealing only profile of cheek and ear-tip, pollen-motes drifting around her shoulders."

"A naiad with translucent skin showing tiny constellations beneath and hair of slowly-flowing river-water threaded with silver asphodel, draped garland of ivy across her shoulder, delicate gills along her neck visible at this close framing, head tilted up as a single shaft of moonlight catches her parted lips, faint magic-shimmer rising from her breath."

━━━ AVOID ━━━
- Posed-for-camera energy / model poses / display energy
- Sexualized framing — focus is mythic-creature beauty
- Costume-y "human dressed as fairy" — body must merge with plant matter
- Photographic / digital / 3D / CGI / anime descriptors
- Modern objects
- Realistic non-magical humans
- Violent / scared / edgy moods
- Fewer than 4 stacked exotic features per entry
- Tiny-fairy or palm-sized scale (those belong to the tiny-fae path)
- Masculine creatures (Leshy / Green Man / Cernunnos belong to the forest-lord path)
- Multiple-figure scenes (those belong to fairy-court)
- FULL-BODY POSTURES (kneeling, sitting, standing, walking, perched-on-log, half-emerged-from-trunk) — this path is HEAD/BUST framing only; postures must work at face-and-shoulders scale
- Animal companions in the pose (a deer's nose, fox at her feet, etc.) — those imply full-body framing
- Hands holding objects in front of her body — too many props pull the framing back to medium-shot

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete creature description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
