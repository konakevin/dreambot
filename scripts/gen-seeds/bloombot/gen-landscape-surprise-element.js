#!/usr/bin/env node
/**
 * BLOOMBOT_LANDSCAPE_SURPRISE_ELEMENT — small jewel-scale unexpected
 * details adding magic to a wide bloom-landscape. Amber-winged dragonfly,
 * orb-web with morning beads, three speckled eggs in a cup-nest, single
 * petal mid-air, golden pollen-cloud drifting, jewel-green tree-frog,
 * sun-bleached antler, dewdrop refracting full spectrum.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_landscape_surprise_element.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE ELEMENT entries for BloomBot's landscape path — small jewel-scale UNEXPECTED details that reward closer inspection of a wide bloom-landscape. Each entry is one descriptive line, 30-50 words, starting with a CAPS NAME, em-dash, then body describing the small detail, its lighting, and its placement in the frame.

━━━ THE BAR ━━━
Every entry names a SPECIFIC tiny detail-hero — usually foreground, usually a small living or natural object, that adds narrative magic and "wow look at that" reward. Dragonfly backlit. Orb-web with dew. Speckled eggs in a nest. Single petal mid-fall. Pollen-cloud caught in side-light. Tree-frog underside. Antler on bloom. Dewdrop with refraction-spectrum. The kind of detail a careful viewer notices on a second pass.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"AMBER-WINGED DRAGONFLY BACK-LIT — solitary dragonfly perched on a foreground bloom-stem, low sun passing through the wings and abdomen, turning both tissues translucent amber-gold, a living stained-glass"
"ORB-WEB WITH MORNING BEADS — perfect circular spider-web strung between two foreground bloom-stalks, every silk thread jewelled with dew-beads catching the early light, a geometry lesson hidden in the meadow"
"THREE SPECKLED EGGS IN CUP-NEST — tiny woven-grass nest tucked low in foreground brush, three rust-speckled blue eggs cradled inside, scale-perfect, a secret the bloom-carpet nearly swallows"
"SINGLE PETAL MID-AIR — one detached bloom-petal suspended mid-fall in raking side-light, frozen between stem and carpet, casting a faint shadow on the blooms below, transient and perfect"
"GOLDEN POLLEN-CLOUD DRIFTING — visible breath of golden pollen-dust dispersing horizontally from a foreground bloom-cluster, caught in side-light, dissolving at its edges into the bright air"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 SMALL INSECT JEWEL (dragonfly backlit, butterfly wing-detail, beetle iridescent, ladybird on petal, damselfly perched, hover-fly suspended)
- ~3 WEB / SILK DETAIL (orb-web with dew, single dew-bead on silk, broken silk-thread bridging stems, lacewing egg-thread)
- ~3 NEST / EGG (speckled eggs in nest, hummingbird-nest in fork, woven hanging nest, ground-nest with eggs)
- ~3 SUSPENDED MATTER (single petal mid-air, pollen-cloud drifting, seed-down floating, dandelion-clock pieces lifting)
- ~3 SMALL FROG / REPTILE (tree-frog underside, glass-frog translucent, smooth-snake coil hidden, lizard sunning on rock)
- ~3 BONE / RELIC (sun-bleached antler, single rib-bone in grass, skull half-hidden, weathered hoof-print, broken talon)
- ~3 DEW / DROP (dewdrop with refraction, single bead on petal, dew-bead on stem-tip, water-bead on insect)
- ~3 SMALL MAMMAL FOREGROUND (vole peering, harvest-mouse on stem, baby-rabbit nestled, chipmunk paused, weasel half-hidden)
- ~3 FOUND OBJECT (lost feather, single shell, single arrowhead, fallen blossom-cluster, broken bird-egg, dropped key half-buried)
- ~3 LICHEN / MOSS DETAIL (lichen-circle on stone, moss-cushion on log, fungus-fan on dead branch, lichen-ringed boulder)
- ~3 BIRD-CLOSE (hummingbird in foreground hover, ground-bird crouched, wren on stem-top, finch on seed-head)
- ~3 SMALL FRUIT / SEED (single ripe berry-cluster, milkweed pod splitting, lotus-pod with seeds, single seed-pod cracked open)
- ~3 LIGHT-ARTIFACT (single sun-flare through bloom-gap, lens-flare across single petal, dappled light-circle on petal-back, halo around insect)
- ~3 SHELL / EXOSKELETON (snail-shell on bloom, butterfly-chrysalis on stem, broken beetle-shell, cicada-husk on stalk)

━━━ BANS ━━━
- NO photographer-name drops.
- NO bare "small insect" — name the SPECIFIC species or specific lighting condition.
- NO sci-fi / no neon / no hologram.
- NO crowds — each entry names ONE small detail-hero.
- NO action chaos — the surprise is STILL or barely-moving.

━━━ FORMAT ━━━
Each entry: 30-50 words. Format: "NAME CAPS — body text naming the specific small detail + lighting condition + foreground placement".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
