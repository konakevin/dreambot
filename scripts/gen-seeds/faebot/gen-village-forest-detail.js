#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_forest_detail.json',
  total: 200,
  batch: 40,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} FOREST DETAIL descriptions for FaeBot's fae-village path. Each entry is 35-55 words describing the lush painterly forest texture that surrounds and frames a fae-village scene — INCLUDING magical-flora elements that make the forest feel enchanted (koi ponds with glowing fish, living mushrooms, singing flowers, glowing fungi). Layered into the prompt to make every scene feel ALIVE with painted lushness and forest-magic.

The dwelling is the subject — but the FOREST AROUND IT must be packed with rich painterly detail at every distance, including occasional magical-flora touches.

━━━ THE TARGET — FOREST RECLAIMING + ENCHANTED FLORA ━━━

The forest is WINNING. The dwellings are DISAPPEARING under vegetation. NOT Hobbiton (clean tidy English cottages with decorative ivy). This is FAE WILD-OVERGROWN — Princess Mononoke's spirit forest × Brian Froud's overgrown fae dwellings × Studio Ghibli's nature-reclaimed houses. The forest ENFOLDS, ENGULFS, RECLAIMS — and SOMETIMES SINGS / GLOWS / PULSES with magic.

━━━ EVERY ENTRY MUST INCLUDE ALL OF THESE ━━━

NATURE-RECLAIMING-ARCHITECTURE (NON-NEGOTIABLE — push HARD):
- HANGING PLANTS DRAPING FROM EVERY architectural element — porches, eaves, balconies. Trailing tendrils, dangling vines, cascading moss-curtains EVERYWHERE.
- THICK CLIMBING IVY / CLIMBING ROSES / FLOWERING CREEPERS COMPLETELY ENGULFING walls and roofs.
- ROOTS GROWING OVER AND THROUGH the structure.
- DRAPING VINES HANGING LIKE CURTAINS from upper branches.
- MOSS INCHES THICK on every surface.
- FLOWERS BURSTING from every crack, crevice, windowsill.
- FERNS SPROUTING from gutters, between roof tiles.
- DANGLING SPANISH MOSS from any overhanging branch.

EXPLOSIVE FOREGROUND — wildflowers in mixed colors (pink, purple, blue, white, yellow), ferns, moss, mossy stones, mushrooms, leaf-litter PACKED at the bottom of frame.

OVERHANGING FRAMING — gnarled branches HEAVILY draped in vines and Spanish moss DROOPING from above and side edges deep into the frame.

DENSE PAINTED MIDGROUND — mossy boulders, ancient tree trunks WRAPPED in vines, hanging mosses cascading, glowing fungi clusters, twisted roots, fern groves at every scale.

ATMOSPHERIC LAYERED BACKGROUND — painted depth receding into pearlescent / blue-violet / amber haze.

PAINTED BRUSHWORK detail — Manchess + Brian Froud + Eyvind Earle + Princess Mononoke spirit-forest painted lushness.

━━━ MAGICAL FLORA ELEMENTS (~40% of entries include ONE — distribute across pool) ━━━

The forest is enchanted. Not every scene has overt magic, but ~40% of entries should weave in ONE of these magical-flora touches as a small but visible element:

- **MAGICAL KOI POND** — small reflecting pool nestled in the foreground or middle-distance with luminous glowing-orange koi fish drifting beneath the surface, lily-pads with white flowers, painted shimmering reflections
- **LIVING MUSHROOMS** — clusters of large fae-mushrooms that pulse softly with glowing pale-green or warm-amber inner light, like living lanterns at the village's edge
- **SINGING FLOWERS** — open-bell flowers (foxgloves / trumpet-flowers / bluebells) with tiny visible musical-note motes drifting upward from their throats, cluster of these in foreground or near the dwelling
- **GLOWING MAGICAL FUNGI** — clusters of bracket-fungi or fairy-cup fungi on tree trunks emitting soft pale-cyan or warm-violet light, climbing up bark
- **CRYSTAL-FLOWERED VINES** — flowering creepers whose blossoms are translucent gem-like crystals catching light, draped across a wall or branch
- **MOON-MOSS** — patches of moss that emit faint silver-blue luminescence, particularly on rocks or root systems
- **WHISPERING REEDS** — tall reeds at the water's edge whose tips glow softly amber as if lit from within

━━━ FLORAL VARIETY (rotate broadly across all entries) ━━━

- Bluebells, foxgloves, lupines, columbines, wisteria, cherry petals, violets, asters, buttercups, daisies, forget-me-nots, primroses, hydrangeas, indigo asters, snowdrops, peonies, lily-pads with white flowers, fern fronds at every scale (tiny ground ferns to mega tree-ferns), mossy stones with painted-pebble paths

━━━ EXAMPLES (write fresh — do not copy) ━━━

WITH MAGICAL FLORA:
- "The dwelling almost disappears under thick climbing ivy completely engulfing the walls, draping vines cascading from the roof edges like curtains, hanging Spanish moss from overhanging branches, foreground exploding with bluebells and pink violets through deep moss, a small magical koi pond nestled in middle-distance with luminous orange koi drifting beneath lily-pads, painted pearlescent haze receding."
- "Cascading flowering vines and climbing roses TOTALLY ENGULFING the cottage walls, draping vines hanging from porch eaves, foxgloves and lupines bursting from cracks in the foundation, clusters of LIVING MUSHROOMS pulsing softly with glowing pale-green inner light at the dwelling's edge, mushrooms ringing the base, dense moss on the roof, painted depth."
- "The forest reclaiming the dwelling — ivy completely covering the walls, draping flowering creepers from balcony rails, ancient roots growing OVER the doorway, foreground packed with cherry petals and SINGING FLOWERS — open-bell foxgloves with tiny musical-note motes drifting upward from their throats, hanging mosses on overhanging boughs, painted dreamy haze."
- "Climbing roses and trailing wisteria CASCADING from every architectural surface, draping curtains of green hanging vines from upper branches, the cottage walls completely overtaken by emerald moss, GLOWING MAGICAL FUNGI clustering up the ancient tree trunks emitting soft pale-cyan light, ferns sprouting from gutters, foreground bursting with violets, painted lush depth."
- "Dwelling engulfed by thick climbing ivy and flowering creepers, draping vines hanging like curtains from porch eaves, branches growing through the structure, MOON-MOSS patches on the foundation rocks emitting faint silver-blue luminescence, hanging Spanish moss from overhead branches, foreground packed with foxgloves and ferns, painted layered haze."
- "The forest swallowing the dwelling — climbing ivy and creepers everywhere, foreground packed with mushroom clusters and CRYSTAL-FLOWERED VINES draped across the moss-covered wall with translucent gem-like blossoms catching the light, hanging mosses from gnarled overhead boughs, painted depth."

WITHOUT MAGICAL FLORA (pure-natural-lushness):
- "The dwelling almost disappears under thick climbing ivy engulfing the walls, draping vines cascading from the roof edges like curtains, hanging Spanish moss from overhanging branches, foreground exploding with bluebells, pink violets and white daisies through deep moss, gnarled overhanging boughs heavily draped, ancient trunks fading to pearlescent haze."
- "Cascading flowering vines and climbing roses TOTALLY ENGULFING the cottage walls leaving only doorway visible, draping vines hanging from porch eaves, foxgloves and lupines bursting from cracks, mushrooms ringing the base, dense moss on the roof, ferns sprouting from windowsills, layered painted forest haze."

━━━ AVOID ━━━

- Sparse / empty descriptions — every entry must FEEL packed
- Modern garden language (manicured, lawn, hedge)
- Single-flower descriptions — always mixed-floral abundance
- Forcing magical flora into EVERY entry — only ~40%, rest are pure natural lushness

━━━ STRUCTURAL VARIETY (NON-NEGOTIABLE — pool will be 200 entries) ━━━

When prior batches are shown as "ALREADY GENERATED" — actively diverge. Vary the dominant reclaiming-element, floral palette, foreground texture, midground texture, magical-flora element, and opening structure. Do NOT cluster repeats.

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete forest-detail description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
