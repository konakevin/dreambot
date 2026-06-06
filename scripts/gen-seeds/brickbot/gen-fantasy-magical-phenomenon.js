#!/usr/bin/env node
/**
 * BRICKBOT_FANTASY_MAGICAL_PHENOMENON — built magical drama: dragon breath,
 * spell cast, summoning, undead rise, etc. Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_fantasy_magical_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} MAGICAL-PHENOMENON entries for BrickBot's fantasy path — ONE big built magical event in a castle / dungeon / battlefield / wizard-tower brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a magical/heroic event (dragon breath, spell cast, lightning blast, fireball, healing-aura, raised undead, portal-rift, scrying-orb glow, magic-shield-dome, sword-glow, etc.) AND shows how it's BUILT (trans-orange flame-elements, trans-yellow bolt-bars, modified plates, trans-cyan glow plates, etc.). The effect reads unmistakably BRICK — no photoreal magic.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 DRAGON / BEAST: dragon-breath blast, dragon-claw strike, basilisk gaze, hydra heads, griffin dive
- ~5 SPELL-CAST: mage lightning-bolt, fireball-cast, ice-shard-cast, healing-aura, polymorph-cast
- ~3 UNDEAD / NECRO: skeleton rising, lich summoning, wraith manifest, zombie-horde rise
- ~3 PORTAL / RIFT: dimensional portal, summoning circle, rift-tear opening, scrying-orb activate
- ~3 SIEGE-MAGIC: catapult-flame strike, trebuchet-stone impact, battering-ram breach with glow
- ~3 HOLY / DIVINE: holy-light beam, paladin-aura, angel-descent, blessed-spring glow
- ~3 SHADOW / DARK: dark-energy blast, shadow-tendrils, demon-summoning, void-rift
- ~2 NATURE / DRUID: vine-grasp, tree-awaken, earth-quake, druid-circle of stones-rising
- ~2 ELEMENTAL: fire-elemental manifest, ice-golem awaken, stone-titan rising
- ~1 RAINBOW PORTAL
- ~1 ENCHANTED-SWORD GLOW
- ~1 PHOENIX REBIRTH

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT the event is + HOW it's brick-built + WHERE in the diorama. Touchpoints:
"DRAGON-BREATH BLAST IMPACT — brick-built dragon head at frame-edge exhaling trans-orange + trans-red + trans-yellow flame-cone toward a stone-wall, scattered trans-yellow round-plate sparks bouncing off the impact-point."
"MAGE LIGHTNING-BOLT CAST — trans-yellow + trans-white jagged-bar lightning-element launching from an outstretched minifig-hand toward a distant target, trans-cyan secondary arcs branching mid-flight."
"SKELETON RISING FROM GROUND — skeleton-minifigs mid-emergence from cracked dark-tan earth-tiles, trans-purple unholy-glow seeping upward from each emergence-crack, the necromancer minifig overseeing."

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs ("magic flows")
- NO licensed franchise names (no Harry Potter / Gandalf verbatim)
- NO duplicating events already in pool

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
