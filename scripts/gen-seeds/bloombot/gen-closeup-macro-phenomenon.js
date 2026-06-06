#!/usr/bin/env node
/**
 * BLOOMBOT_CLOSEUP_MACRO_PHENOMENON — extreme-macro single-detail
 * phenomenon at the petal/stamen/pollen scale. Hummingbird at one bloom,
 * pollen-bead on silk, bumblebee thorax detail, translucent petal
 * backlit, bud splitting open.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_closeup_macro_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MACRO PHENOMENON entries for BloomBot's closeup path — extreme-macro single-detail phenomenon at the bloom / petal / stamen / pollen-grain / dew-bead scale. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body describing the macro-hero detail + its lighting + its surface materiality.

━━━ THE BAR ━━━
Every entry names a SPECIFIC macro-scale phenomenon: a hummingbird at one foreground bloom, a pollen-bead on a silk-thread, dense pollen on a bumblebee's hind corbicula, a translucent petal lit through from behind, a bud mid-split, a dew-bead refracting full spectrum, a stamen mid-pollen-release, a stigma collecting pollen. Jewel-scale, raking light, intimate, surface-detailed.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"HUMMINGBIRD AT ONE BLOOM — solitary jewel-throated hummingbird hovering at a single foreground floret, wings a transparent blur, iridescent gorget catching side-light, beak tip just grazing the corolla"
"POLLEN-BEAD ON SILK — single heavy pollen-laden dew-bead hanging from an orb-web silk thread crossing the foreground frame, amber-gold under raking morning light, jewel-scale perfect"
"BUMBLEBEE THORAX DETAIL — solitary bumblebee gripping one foreground stamen cluster, dense golden pollen packed on both hind corbiculae, individual fur-filaments on thorax crisp at macro scale"
"TRANSLUCENT PETAL BACKLIT — single foreground petal struck by direct sun from behind, venation network glowing amber-green like stained glass, halo-rim burning bright at the petal edge"
"BUD SPLITTING OPEN — solitary tight bud in foreground mid-burst, the sepal-tips curling back revealing the first crinkled inner petals just catching morning light, anticipation frozen"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~4 POLLINATOR-MACRO (hummingbird at single bloom, bee on stamen, hover-fly suspended, butterfly proboscis at corolla, moth at night-bloom)
- ~3 POLLEN DETAIL (pollen-laden bee leg, pollen-bead on silk-thread, pollen-cloud from single stamen, pollen on stigma)
- ~3 PETAL-LIGHT (translucent petal backlit, raking side-light on petal, dew on petal, color-gradient on single petal)
- ~3 BUD / MOTION (bud splitting open, stamen mid-pollen-release, sepal mid-curl, ovary swelling, tendril mid-twist)
- ~3 STAMEN / STIGMA (stamen tipped with pollen-grain, stigma collecting pollen-cap, anther mid-dehiscence, filament curving)
- ~3 DEW / WATER-DROP (dewdrop refracting spectrum, single bead on petal tip, single drop on stigma, water-bead chain on petal-edge)
- ~3 INSECT-WING-MACRO (butterfly-wing scale detail, dragonfly-wing iridescence, beetle-elytra closeup, lacewing-wing veins)
- ~3 SPIDER-WEB / SILK (orb-web with dew-beads, single silk-thread with bead, hammock-web on foreground bloom, web-veil over petal)
- ~3 LEAF / VEIN MACRO (leaf-venation detail, water-bead on leaf, leaf-edge fine teeth, leaf-curling mid-open, fresh-leaf glow)
- ~3 SEED / FRUIT MACRO (single seed in pod, milkweed-pod splitting, single fruit-clinging berry, lotus-pod seeds, single-acorn detail)
- ~3 STAMEN-FOREST (forest of stamens looking down at one, anther-tip cluster, filament-jungle macro, pollen-fall in side-light)
- ~3 SINGLE INSECT-SCALE-DETAIL (single butterfly-scale, single beetle-foot grip, single mandible at stem, single fly-eye reflection)
- ~3 INSECT-DRINKING (proboscis uncoiling, bee-tongue lapping nectar, butterfly-proboscis at corolla, hover-fly at honey)
- ~3 RAIN / DROPLET-MACRO (single raindrop suspended on petal tip, water-bead chain on petal edge, single droplet on stigma-tip, dew-line along petal-vein)

━━━ BANS ━━━
- NO photographer-name drops.
- NO wide scenes — every entry is JEWEL-SCALE, macro, single-detail.
- NO crowds / no people.
- NO sci-fi / no neon / no hologram.
- NO bare "macro flower" — name the SPECIFIC detail + lighting condition.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text naming the specific macro detail + lighting + surface materiality".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
