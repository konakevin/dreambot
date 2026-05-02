#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/harbor_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ANCIENT HARBOR / PORT scene descriptions for AncientBot. Each entry is 15-25 words describing a bustling ancient harbor, port, or maritime trade scene. Pre-1000 AD ancient global civilizations.

Harbors are where civilizations MEET — goods, languages, ideas flowing between cultures. These scenes should feel ALIVE with commerce and connection.

━━━ SCENE TYPES (mix across all) ━━━
- Phoenician harbors (cedar-wood loading, purple-dye workshops, merchant galleys, stone breakwaters)
- Egyptian riverports (papyrus barges, grain ships, obelisk transport barges, reed fishing boats)
- Minoan port towns (painted buildings, dolphin frescoes, wide harbor basins, octopus-ware pottery)
- Indus Valley dockyards (Lothal's engineered dock, standardized weights, bead-trading ships)
- Dilmun/Bahrain (trade crossroads, pearl-diving boats, Mesopotamian-to-Indus cargo transfer)
- Byblos harbor (ancient cedar trade to Egypt, stone quays, Pharaoh's ships)
- Coastal Phoenician colonies (early Carthage, trading posts along Mediterranean)
- Nile delta ports (ship-building yards, rope-making, sail-cloth weaving)

━━━ GEOGRAPHIC DISTRIBUTION — COASTAL / HARBOR CIVILIZATIONS ONLY ━━━
This pool is climate-locked to coastal port civilizations. Distribute across:
- ~25% Phoenician + Carthaginian (Tyre, Sidon, Byblos, Carthage cothon harbors)
- ~20% Greco-Roman (Piraeus, Ostia, Alexandria, Roman Empire ports)
- ~15% East Asian coastal (Tang/Song Quanzhou + Guangzhou, Heian Japan ports, Goryeo Korea)
- ~15% Southeast Asian (Khmer Tonle Sap port-cities, Srivijaya Palembang, Champa coastal temples)
- ~10% Egyptian / Mesopotamian river-mouth (Nile delta ports, Indus Valley Lothal dockyard, Eridu)
- ~10% East African (Aksum Adulis, Swahili coast pre-1000)
- ~5% Norse / Viking (Hedeby, Birka, longship-harbors)

━━━ RULES ━━━
- Each entry is ONE vivid harbor/port scene
- Include SHIPS and WATER prominently
- Show the bustle of trade — loading, unloading, merchants haggling, goods piled on docks
- Vary the civilizations and port types
- 15-25 words
- NO medieval ships, NO Greek/Roman galleys, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
