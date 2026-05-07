#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_forest_detail.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} FOREST DETAIL descriptions for FaeBot's fae-village path. Each entry is 30-50 words describing the lush painterly forest texture that surrounds and frames a fae-village scene. Layered into the prompt to make the scene feel ALIVE with painted lushness.

The fae-village dwelling is the subject — but the FOREST AROUND IT must be packed with rich painterly detail at every distance. This axis provides that.

━━━ THE TARGET — FOREST RECLAIMING THE ARCHITECTURE ━━━

The forest is WINNING. The dwellings are DISAPPEARING under vegetation. This is NOT Hobbiton (clean tidy English cottages with decorative ivy). This is FAE WILD-OVERGROWN — Princess Mononoke's spirit forest × Brian Froud's overgrown fae dwellings × Studio Ghibli's nature-reclaimed houses. The forest ENFOLDS, ENGULFS, RECLAIMS.

━━━ EVERY ENTRY MUST INCLUDE ALL OF THESE ━━━

NATURE-RECLAIMING-ARCHITECTURE (NON-NEGOTIABLE — push HARD):
- HANGING PLANTS DRAPING FROM EVERY architectural element — porches, eaves, balconies, bridges, walkways, lantern-poles. Trailing tendrils, dangling vines, cascading moss-curtains EVERYWHERE.
- THICK CLIMBING IVY / CLIMBING ROSES / FLOWERING CREEPERS COMPLETELY ENGULFING walls and roofs. The architecture is half-disappeared under green takeover. Not a few decorative sprigs — TOTAL coverage.
- ROOTS GROWING OVER AND THROUGH the structure — bursting through walls, wrapping doorways, integrated INTO the foundation. The dwelling and the tree-root system are inseparable.
- DRAPING VINES HANGING LIKE CURTAINS from upper branches and from the roof edges — falling several meters down across the front of the dwelling.
- MOSS INCHES THICK on every surface — walls, roofs, steps, railings, bridges. Rich emerald moss carpeting EVERYTHING.
- FLOWERS BURSTING from every crack, crevice, windowsill, doorframe.
- FERNS SPROUTING from gutters, between roof tiles, at doorsteps, on every ledge.
- MUSHROOMS RINGING the base, climbing up trunks, dotting roofs.
- DANGLING SPANISH MOSS from any overhanging branch.

EXPLOSIVE FOREGROUND — wildflowers in mixed colors (pink, purple, blue, white, yellow), ferns, moss, mossy stones, mushrooms, leaf-litter PACKED at the bottom of frame.

OVERHANGING FRAMING — gnarled branches HEAVILY draped in vines and Spanish moss DROOPING from above and side edges deep into the frame.

DENSE PAINTED MIDGROUND — mossy boulders, ancient tree trunks WRAPPED in vines, hanging mosses cascading, glowing fungi clusters, twisted roots, fern groves at every scale.

ATMOSPHERIC LAYERED BACKGROUND — painted depth receding into pearlescent haze, distant trunks fading to soft blue/violet.

PAINTED BRUSHWORK detail — Manchess + Brian Froud + Eyvind Earle + Princess Mononoke spirit-forest painted lushness.

━━━ FLORAL VARIETY (rotate broadly) ━━━
- Bluebells, wildflowers in mixed colors
- Pink and white cherry petals
- Purple violets, indigo asters
- Yellow buttercups, daisies
- Pink wisteria, hanging blossoms
- Foxgloves, lupines, columbines
- Glowing magical flowers (pulsing soft amber, violet, cyan)
- Lily-pads with white flowers
- Fern fronds at every scale (tiny ground ferns to mega tree-ferns)
- Mossy stones with painted-pebble paths

━━━ EXAMPLES (write fresh, do not copy) ━━━
- "The dwelling almost disappears under thick climbing ivy completely engulfing the walls, draping vines cascading meters down from the roof edges like curtains, hanging Spanish moss from every overhanging branch, roots bursting through the foundation, foreground exploding with bluebells, pink violets, white daisies through deep moss, gnarled overhanging boughs heavily draped with vines, ancient trunks fading to pearlescent haze."
- "Cascading flowering vines and climbing roses TOTALLY ENGULFING the cottage walls leaving only doorway and windows visible, draping vines hanging from porch eaves like curtains, foxgloves and lupines bursting from cracks in the foundation, mushrooms ringing the base, dense moss inches thick on the roof, ferns sprouting from windowsills, overhanging mossy branches drooping deep into the frame, layered painted forest haze."
- "The forest reclaiming the dwelling — ivy completely covering the walls, draping flowering creepers cascading from balcony rails, ancient roots growing OVER the doorway and through the foundation, foreground packed with cherry petals and mixed wildflowers, hanging mosses dripping from gnarled overhanging boughs deep into upper frame, mushrooms climbing the bark, painted dreamy layered haze."
- "Climbing roses and trailing wisteria CASCADING from every architectural surface, draping curtains of green hanging vines from upper branches, the cottage walls completely overtaken by emerald moss and ivy, ferns sprouting from gutters, foreground bursting with violets and forget-me-nots, twisting roots wrapping the dwelling's base, gnarled mossy boughs heavily draped with Spanish moss framing the sides, painted lush depth."
- "Dwelling engulfed by thick climbing ivy and flowering creepers, draping vines hanging like curtains from porch eaves, branches growing THROUGH the structure, roots wrapping the foundation, hanging Spanish moss draping from every overhead branch, foreground packed with foxgloves, glowing magical flowers, mushroom clusters, ferns at multiple scales, layered painted haze fading deep."

━━━ AVOID ━━━
- Sparse / empty descriptions — every entry must FEEL packed
- Modern garden language (manicured, lawn, hedge)
- Single-flower descriptions — always mixed-floral abundance

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete forest-detail description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
