#!/usr/bin/env node
/**
 * BLOOMBOT_LANDSCAPE_SCALE_PROVER — small specific objects/creatures
 * that PROVE the scale of a wide bloom-landscape. Lone bristlecone pine,
 * distant waterfall ribbon, single bumblebee, grazing elk herd, golden
 * eagle thermal, glacial erratic boulder, distant mesa silhouette, worn
 * bloom-path winding away.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_landscape_scale_prover.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SCALE PROVER entries for BloomBot's landscape path — small specific objects, creatures, or features that PROVE the vast scale of a wide bloom-meadow landscape. Each entry is one descriptive line, 30-50 words, starting with a CAPS NAME, em-dash, then body describing the element, its size, its placement in the frame, and how it sets scale.

━━━ THE BAR ━━━
Every entry names a SPECIFIC SCALE-PROVING element — a lone tree, a distant waterfall, a single bee, a herd of grazing elk, a circling eagle, a glacial erratic, a winding bloom-path, a distant mesa, a single hiker, a small cabin, a lone wagon. The element is comma-mark small against the meadow OR foreground intimate against vast background. Specify EXACTLY where in the frame (foreground bloom, midground meadow, deep background ridge) and how it sets scale.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"LONE BRISTLECONE PINE ON BLOOM-KNOLL — single ancient bristlecone pine, trunk twisted by centuries of wind, standing alone on a bloom-carpeted ridge, its gnarled silhouette anchoring the vast slope receding behind it"
"DISTANT WATERFALL RIBBON — white thread of meltwater falling from a high dark cliff-face in the deep background, barely a hairline against the rock-wall, scale-prover for the entire bloom-valley below"
"SINGLE BUMBLEBEE ON FOREGROUND BLOOM — fat bumblebee landed on a specific foreground lupine spike, amber-banded thorax visible, its domestic intimacy throwing the vast bloom-carpet behind it into sudden monumental scale"
"GRAZING ELK HERD MIDGROUND — loose scatter of elk dotted across the bloom-meadow at middle-distance, each animal reduced to a dark comma-mark, antlers catching low amber light"
"GOLDEN EAGLE THERMAL — single golden eagle riding an invisible thermal in the upper sky, wings fully outstretched and motionless, a dark cross against the cloud-volume"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 SINGLE TREE (bristlecone pine, lone oak, weathered juniper, ponderosa pine, cottonwood, ancient ginkgo, weather-bent spruce)
- ~5 SMALL FOREGROUND CREATURE (bumblebee on bloom, single butterfly perched, dragonfly poised, ladybird on petal, beetle on stem)
- ~4 MIDGROUND HERD (grazing elk herd, distant bison cluster, sheep flock dotting slope, mountain-goat band, wild-horse loose scatter, deer family)
- ~4 SKY-BORNE (golden eagle, single hawk circling, vulture spiral, swift squadron pass, swallow flock, snow-goose V-formation)
- ~4 DISTANT WATER (distant waterfall ribbon, river-thread, oxbow gleam, mirror-tarn glint, sea-glint at horizon, lake-reflection patch)
- ~3 GLACIAL / GEOLOGIC FEATURE (glacial erratic boulder, single moraine ridge, isolated drumlin, lone hoodoo, single rock-pillar)
- ~4 HUMAN-MADE TRACE (worn bloom-path winding, distant stone cottage, single shepherd's hut, lone wooden cabin, distant cairn, hiking-trail switchback)
- ~3 SINGLE HUMAN FIGURE (lone hiker on ridge, single shepherd far below, painter at easel midground, photographer with tripod, hiker silhouette on horizon)
- ~3 DISTANT HORIZON ANCHOR (distant mesa silhouette, snow-capped peak background, lone volcano cone, distant sea-stack, single island on horizon)
- ~3 ANIMAL TRACK / SIGN (single deer-trail through bloom, line of elk-tracks, freshly-broken bloom-stem path, distant pony-graze ring)
- ~3 STRUCTURE-IN-LANDSCAPE (lone wooden bridge, single windmill, isolated chapel on hilltop, lone lighthouse, lone fence-line)
- ~3 OBJECT-IN-LANDSCAPE (lone weathered fence-post, single wagon-wheel half-buried, single drift-log on meadow, isolated standing stone)
- ~3 RIVER / WATER-EDGE (single canoe drawn up on bank, lone boat anchored offshore, single fishing-skiff, lone stand-up paddler distant)
- ~3 SMALL WILDLIFE (rabbit on foreground stem, fox crossing midground, marmot on rock, ground-squirrel sentinel, pika on talus)

━━━ BANS ━━━
- NO crowds or human groups — single figures or small herds at distance.
- NO photographer-name drops.
- NO sci-fi / no neon / no hologram.
- NO bare "small object" — name the SPECIFIC scale-prover + its placement + how it anchors scale.
- NO action chaos — the scale-prover is at REST or in slow motion.

━━━ FORMAT ━━━
Each entry: 30-50 words. Format: "NAME CAPS — body text naming the specific scale-prover + placement (foreground / midground / background) + how it proves scale".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
