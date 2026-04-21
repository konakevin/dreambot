#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/arcane_phenomena.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ARCANE PHENOMENA descriptions for DragonBot's magic-moment path — LAYERED multi-element magical scenes. Object + phenomenon + atmospheric response + architectural context. NEVER simple-object-on-altar. Always 4-5 magical elements stacked. Scene RESPONDS to the magic.

Each entry: 20-40 words. One specific layered arcane scene.

━━━ CATEGORIES ━━━
- Galaxy-staff magic (staff topped with living miniature galaxy, orbital planets, ritual circle below with stars materializing overhead, dust suspended in air)
- Self-lifting grimoire (ancient book open mid-air, pages turning themselves, runes floating around, chamber-walls pulsing with glow)
- Reality-tearing portals (vertical portal with world-edges visible, screaming-light bleeding through, observer's hair flying, time-distortion ripples)
- Ritual circles (multi-layered glowing circle with rising elements, candles flickering impossibly, floor-stones levitating, incense-smoke swirling up)
- Materializing constellations (starlit chamber with stars coalescing into figures, ritual-mage below, symbols carved into floor glowing)
- Lightning-contained-in-sphere (storm trapped in glass, crackling inside, mage's hands suspended, room-air charged)
- Living-water spells (water elementally animating, forming shapes, spell-book open, chamber-pillars dripping magical water)
- Frozen-time bubble (objects suspended mid-fall, dust-motes frozen, spell-caster mid-gesture)
- Molten-iron spell-forge (liquid metal writhing into weapon-shape, runes glowing in heat)
- Mage-duel strike (two opposing spells colliding mid-air with energy-arcs, floor-flagstones cracking)
- Spirit-summoning (translucent figures rising from circle with fog, altar-offerings burning)
- Dimension-walking (mage stepping into light-seam, crystalline shards floating)
- Runic-resonance (carved-wall runes glowing in sequence, floor-pattern rotating)
- Binding-chains of light (prisoner-bound by light-ribbons, air-charged)
- Summoning-pyramid (layered stone pyramid with levitating capstone, energy-beam rising)
- Mirror-gateway (full-length mirror showing impossible landscape, observer's reflection moving independently)
- Time-sphere (spinning chronomantic ring around mage with clock-face emerging)
- Elemental-council (four elementals manifesting around central summoner)
- Lich-phylactery resurrection scene (skeletal hand emerging from smoke, artifacts orbiting)
- Blood-magic circle with hovering drops (crimson orbs mid-air, altar-stones cracking)
- Tree-of-life arcane scene (glowing tree with fruit-orbs, mage-circle below)
- Clock-tower unstuck-time scene (gears floating, time-shards in air)
- Psychic-link mage duo (two casters connected by light-strand, shared aura)
- Necromancer raising-the-dead (ground-cracking, shapes-rising, mage commanding)
- Drowned-temple arcane shrine (underwater floating orb, fish unaffected)
- Dragon-essence-contained orb (miniature dragon circling inside crystal sphere)
- Light-well (beam from sky into circle, power gathering at center)
- Shadow-consuming spell (darkness spiraling into hand of caster)
- Elemental-binding ritual (four elements converging at center of multi-circle)
- Storm-summoning from tower-top (clouds obeying raised staff)

━━━ RULES ━━━
- LAYERED — 4-5 magical elements per entry
- Scene RESPONDS to magic (dust, stones, walls, fabric react)
- Never static — always mid-moment, mid-cast
- Object + phenomenon + atmospheric reaction + architectural context

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
