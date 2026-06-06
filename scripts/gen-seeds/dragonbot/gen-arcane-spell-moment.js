#!/usr/bin/env node
/**
 * ARCANE_SPELL_MOMENT — Peak magic effects pool for DragonBot's arcane-halls.
 *
 * The LOADED INSTANT of a major spell — the magic SATURATES THE FRAME,
 * the caster is INSIDE / WRAPPED BY / ENVELOPED IN the spell. NOT a
 * small effect at the hands — full 60%+ frame-fill room-consuming
 * magic. Doctor Strange portal / Wanda chaos-magic / Saruman storm /
 * Gandalf at Khazad-dûm energy.
 *
 * Mirrors existing 30-entry register:
 *   "<CASTER> — <EFFECT-NAME-CAPS>: <body describing the room-filling
 *   spell, the caster's body inside it, and the chamber's reaction>."
 *
 * 50-90 words. Frazetta / Brom painted-cover register but in service of
 * room-filling magical climax.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/arcane_spell_moment.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PEAK-MAGIC SPELL-MOMENT descriptions for DragonBot's arcane-halls path — a single spellcaster's spell at its LOADED INSTANT, the magic SATURATING THE FRAME (60%+ visual coverage). The caster is INSIDE the magic, wrapped by it, enveloped by it. NOT a small effect at the hands. Doctor Strange portal-opening / Wanda's chaos-magic / Saruman's storm / Gandalf at Khazad-dûm energy. LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring lineage.

Each entry: 50-90 words. Format EXACTLY:
\`<CASTER TYPE TITLECASE> — <EFFECT NAME CAPS>: <body describing the spell filling the room + the caster's body configured inside the magic + the chamber's reaction>.\`

━━━ THE FRAME — MAGIC FILLS 60%+ ━━━

Every entry must describe magic that DOMINATES THE FRAME, not a polite small effect. Examples of correct intensity:
- vortex of swirling fire filling the entire upper half of the frame, embers raining throughout the room
- storm of lightning with dozens of forks cracking floor-to-ceiling through the whole room
- vast portal blooming to fill 70% of the frame, the caster a silhouette before its swirling depths
- fel-energy tendrils wrapping the entire room in violet light
- spell-circle ten meters across blazing on the floor with magical-light pillars rising from every rune
- cascading holy-light pouring from above and below at once, overlapping light-columns

NOT a wisp. NOT a bolt. NOT a small flame-orb. FULL ROOM-FILLING SATURATION.

━━━ THE CASTER'S BODY IS INSIDE THE MAGIC ━━━

Every entry must describe the caster's body INSIDE the spell:
- robes whipping / shredding at the edges in the magical wind
- hair lifted / streaming / suspended upward by the magical current
- face illuminated from within by the spell's light
- body silhouetted at the eye / center / heart of the effect
- arms outstretched / palms raised / weapon raised at the spell's anchor
- the caster's form barely visible inside the overwhelming magical bloom

━━━ THE CHAMBER REACTS ━━━

Every entry should mention how the GRAND INTERIOR reacts to the magic:
- every column branded with reflected rune-glow
- the vaulted ceiling drips with cascading light
- every wall fractures with refracted multi-color magical light
- the hall's stone floor glows warm beneath
- the air thick with drifting magical motes
- arc-lightning crackling between conduit-pillars

━━━ VARIETY MANDATE — 10 spell-effect categories (~20 per category) ━━━

1. SPELL-CIRCLE BLOOM (geometric circles igniting across the floor, light-pillars rising from rune-points)
2. RUNIC STORM / GLYPH CASCADE (hundreds of floating script erupting outward, cascading streams of arcane symbols)
3. ARCANE VORTEX (churning chaos-energy spinning, eye-of-storm center)
4. ELEMENTAL ERUPTION (flame-cone / lightning-storm / frost-blast / shadow-tendrils filling the room)
5. SUMMONING-CIRCLE (massive ritual pattern igniting, soul-light / fel-light / spirit-light columns)
6. PORTAL / RIFT BLOOM (massive plane-tear opening, otherworldly light pouring through)
7. AURA / PULSE WRAP (room-flooding single-color aura, every surface saturated)
8. ARTIFACT ORBITAL (dozens of tomes / orbs / scrolls erupting upward into orbiting constellation)
9. LIGHT CASCADE (overlapping holy-light columns crashing from ceiling and floor, converging)
10. CHAOS-RIBBONS / PRISMATIC SWIRL (wild multi-color ribbons looping unpredictably, every wall reflecting)

━━━ VARIETY MANDATE — 12 caster archetypes (rotate, no repeats within 5) ━━━

archmage / sorcerer / sorceress / mage / cleric / warlock / necromancer / hedgewitch / runic-scribe / battle-mage / druid / shadow-mage / blood-mage / chronomancer / fey-witch / storm-caller

━━━ THE LANGUAGE PATTERN — mirror these existing entries' register ━━━

GOOD examples already in the pool (vary strongly from them):
  • "Archmage — RUNIC STORM: Hundreds of blazing blue-and-silver runes erupt outward from the archmage's outstretched arms, spiraling into a colossal vortex that swallows the entire hall. His robes whip violently in the magical wind, hair streaming upward, face illuminated from within by cascading runic light. Every stone column pulses with reflected rune-glow."
  • "Cleric — SPELL-CIRCLE BLOOM: A vast radiant golden spell-circle blazes across the entire floor, its geometric segments igniting in sequence beneath the cleric's feet. White-gold light-pillars surge from each rune-point to the vaulted ceiling. The cleric stands wreathed in the convergence, robes billowing outward, face upturned and saturated in pure golden-white magical luminescence."
  • "Hedgewitch — PURE-AURA WRAP: Forest-green mystical aura floods the chamber in a single overwhelming pulse, saturating every surface with soft emerald magical-light. The hedgewitch is completely wreathed at the center, her layered robes lifted and twisting in the aura-wind, rune-leaf shapes drifting through the green luminescence in slow spiraling patterns while the hall's stone floor glows warm jade beneath her."

Notice: 3 sentences. Sentence 1 = the spell filling the room. Sentence 2 = the caster's body inside the magic. Sentence 3 = the chamber's reaction.

━━━ BANS ━━━

- NO small effect at the hands — must fill 60%+ of the frame
- NO posing / looking at viewer / camera-aware caster
- NO sci-fi / cyberpunk / neon-modern / techno / lasers / orbital
- NO real-world ethnic-coded magic (no Forbidden-City sorcery, no Persian jinn, no Aztec — fantasy worldbuilding only)
- NO named IPs (no Doctor Strange, no Gandalf, no Saruman, no Wanda — use them for INSPIRATION but don't NAME them)
- NO multiple casters — solo spellcaster always
- NO "epic / awesome / breathtaking / stunning / majestic" filler — SHOW the saturation with specific description

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, no markdown. Each entry follows the \`<CASTER TYPE> — <EFFECT NAME CAPS>: <body>\` format with three sentences (spell / body / chamber).`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
