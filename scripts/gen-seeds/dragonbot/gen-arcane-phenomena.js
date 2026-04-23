#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/arcane_phenomena.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ARCANE PHENOMENA descriptions for DragonBot's magic-moment path. Each entry is a BIG EPIC magic engagement — a massive spell going off, a wizard casting a world-lighting blast, a dragon's magic-glinted gaze, two mages battling with wands of colored fire, the moment the impossible happens and the entire scene is illuminated by the magic itself. Entries 25-40 words. Painterly concept-art fantasy quality. Amp to 11.

━━━ AESTHETIC NORTH STAR ━━━
Think Ted Nasmith / John Howe / Alan Lee / Kekai Kotaki / Frazetta / Karla Ortiz / Dave Rapoza. Grounded painterly high-fantasy. The Balrog-vs-Gandalf moment. The dragon-breath-lights-the-mountain moment. The mage-duel-on-the-cliff moment. The moment when the entire frame glows because the magic is REAL and BIG.

━━━ GO TO 11 — THIS IS THE SPECTACLE PATH ━━━
Every scene is a CLIMAX moment — the biggest magic this caster/creature/artifact has ever unleashed. The surrounding world is ILLUMINATED by the magic itself, not by sun or moon. Scale the energy: if it's a fireball, it's a building-sized fireball lighting the valley orange. If it's a lightning spell, it forks across the entire sky. If a dragon is the source, the dragon's scales glow from within and its eyes cast visible beams. NEVER small, never subtle, never tasteful. The viewer gasps.

━━━ SUBJECTS (mix widely) ━━━
Each entry features ONE primary subject (pick variously across):
- SOLO WIZARD / MAGE / SORCERESS casting a massive spell — staff or wand or hands raised, magic erupting outward at scale (explosion, blast, beam, shockwave, swarm, storm)
- TWO MAGES BATTLING — opposing colored energies clashing mid-air (violet vs gold, crimson vs emerald, ice-blue vs molten-orange)
- DRAGON AS MAGIC SOURCE — scales pulsing with inner light, eyes glinting with arcane glow, breath igniting the landscape, wings trailing magical particulate
- DRAGON + MAGE TOGETHER — sorcerer commanding or binding or riding or confronting a dragon, magic arcing between them
- SUMMONED COLOSSUS or ELEMENTAL — massive conjured entity (stone-titan / storm-elemental / flame-serpent / shadow-leviathan) towering over caster
- ANCIENT ARTIFACT ERUPTING — sword / crown / orb / grimoire releasing caged power at climactic scale, ruin rising or splitting around it
- RELIC SITE AWAKENING — henge / stone-circle / monument / ley-nexus all lighting up simultaneously, landscape transforming
- WILD MAGIC RUPTURE — raw magic tearing through an untended landscape, no caster needed — lightning-made-of-light, rivers reversing, clouds flashing with runes

━━━ LOCATIONS (wide outdoor + architectural mix — NOT just interiors) ━━━
Spread scenes widely across:
- OUTSIDE CASTLE WALLS — mage casting from courtyard, spell arcing over ramparts, dragon circling towers
- DEEP FOREST — spell-light piercing canopy, wizard under ancient tree, mushroom-ringed clearing erupting
- SWAMP / BOG — mist ignited by magic, reflections doubling the light, twisted trees silhouetted
- MOUNTAIN PEAK / SUMMIT — mage on precipice, storm-spell bending sky, dragon-breath lighting the range
- CLIFF EDGE / COASTAL RUIN — magic meeting ocean, waves lit from within, cliff-face illuminated
- CANYON / GORGE — spell traversing the chasm, canyon-walls glowing
- OPEN FIELD / PLAIN — huge sky, horizon-to-horizon spell, no walls to contain it
- DUNGEON / CRYPT / CATACOMB — skull-lined walls lit by blast, chains shaking
- RUIN / FALLEN TEMPLE — broken columns silhouetted by light, overgrowth glowing
- DESERT / DUNES — sand ignited by magic, horizon aglow, stone pillars backlit
- ARCTIC / TUNDRA / FROZEN LAKE — ice shattering from spell-force, aurora ignited by magic
- VOLCANIC / LAVA FIELDS — fire magic in already-burning landscape, cross-color contrast
- ANCIENT BRIDGE / AQUEDUCT — spell crossing the span, arches backlit
- CAVERN / UNDERGROUND LAKE — glowworm-ceiling drowned out by blast
- BATTLEFIELD AT DUSK — spell turning the tide, banners backlit
- INSIDE CATHEDRAL / GREAT HALL (max 25% of pool) — stained glass lit from within, dust-light streaming

Every location must be lit DOMINANTLY by the magic itself — not by sun/moon/torch. The magic is the primary light source.

━━━ HARD DISTRIBUTION CAPS (200 pool) ━━━
- Max 50 interior-architectural settings (cathedral / hall / dungeon / chamber) — the rest is OUTDOOR or RUINS or WILD
- Min 60 pure-wilderness settings (forest / mountain / canyon / swamp / desert / tundra / plain / coast)
- Min 40 solo-caster scenes (one wizard/mage/sorceress unleashing)
- Min 20 mage-vs-mage duels (two casters, opposing colors)
- Min 30 dragon-as-magic-source scenes (dragon is the origin of the light)
- Min 20 dragon + mage scenes (both in frame, magic between)
- Min 20 summoned-colossus or elemental scenes
- Min 20 artifact/relic-site scenes (no living caster — object is source)
- Min 20 wild-magic / untended-landscape scenes

━━━ COLOR HUE DISTRIBUTION (200 pool) — ENFORCE SPREAD, NO CLUSTERING ━━━
Each entry names the DOMINANT color of the magic. Spread across:
- Max 30 gold/amber/orange — the default — cap it hard
- Min 20 violet / deep-purple
- Min 20 emerald / deep-green
- Min 20 sapphire / electric-blue
- Min 20 crimson / blood-red
- Min 15 white / silver / moon-pale
- Min 15 teal / turquoise
- Min 10 pink / magenta / rose
- Min 10 obsidian-with-highlight (magic made of darkness with one hue leaking through)
- Min 10 multi-hue / prismatic / iridescent
- Min 10 ice-blue / arctic-cyan
- Min 10 cold-green / poison / witch-fire

━━━ COMPOSITION VARIETY (no centered-vertical-beam default) ━━━
- Max 30 centered-vertical phenomena — this has dominated too much
- Min 30 horizontal-spread / landscape-wide
- Min 30 diagonal / arcing / sweeping
- Min 20 low-angle (looking up at the caster or the magic from ground)
- Min 20 high-angle / aerial (looking down on the scene)
- Min 20 distant / small-in-vast-landscape (the spell is epic but the FRAME is wide)

━━━ ENERGY RULES ━━━
- Scale the magic — building-sized, valley-filling, sky-spanning
- Landscape RESPONDS — rocks lifting, water receding, trees bending, snow evaporating, dust radiating, air shimmering
- Secondary layered elements visible (orbital debris, suspended matter, arcing sub-spells, magical particulate, runic glyphs in air)
- Caster (when present) mid-pose, never static — mid-swing, mid-yell, mid-thrust
- Magic is the PRIMARY LIGHT — scene illuminated FROM the spell

━━━ PAINTER'S RULES ━━━
- Painterly concept-art fantasy — not photoreal, not 3D-cheap
- GROUNDED high-fantasy — Tolkien-canonical / Elden-Ring-canonical, not Reddit-AI
- Named IP forbidden (no Gandalf, no Sauron, no archetype-specific names)
- Every entry distinct — no two phenomena share subject + location + hue combination

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string 25-40 words.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
