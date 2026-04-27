#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/architectural_details.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} PERIOD-ACCURATE ARCHITECTURAL DETAIL descriptions for AncientBot. Each entry is 10-20 words describing a specific decorative or structural detail from ancient architecture. Pre-600 BC ONLY.

These compose with separate scene/location pools — describe ONLY the architectural detail, not the building or location.

━━━ DETAIL TYPES (mix across all) ━━━
- Carved reliefs (hunting scenes, god-figures, winged bulls, procession friezes, battle narratives)
- Painted surfaces (vivid mineral pigments on plaster — Egyptian blue, ochre-yellow, malachite-green, hematite-red)
- Inlay work (lapis lazuli, carnelian, mother-of-pearl, gold leaf on carved surfaces)
- Column details (papyrus-bundle columns, palm-capital columns, lotus-bud capitals, carved wooden pillars)
- Gate features (bronze-banded cedar doors, lion/bull guardian statues, carved lintels, glazed-brick arches)
- Floor/wall treatments (glazed brick in geometric patterns, alabaster floor slabs, mosaic cone walls)
- Roof/ceiling (cedar beam ceilings, star-painted vault ceilings, clerestory light slits)
- Water features (lustral basins, ritual pools, carved stone channels, fountain spouts)

━━━ RULES ━━━
- Each entry is ONE specific architectural detail
- Materials must be period-accurate (bronze, NOT iron; mud-brick, NOT concrete; limestone, NOT marble)
- Include the MATERIAL and TECHNIQUE, not just the visual
- Vary across civilizations (Egyptian, Mesopotamian, Indus, Minoan, Hittite, etc.)
- 10-20 words
- NO medieval details, NO Greek/Roman orders, NO fantasy

━━�� OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
