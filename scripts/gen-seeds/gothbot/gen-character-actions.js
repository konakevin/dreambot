#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/character_actions.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CONFIDENT PREDATORY ACTION descriptions for GothBot's character paths — specific mid-action verbs/stances that pair with a character seed to give the render unmistakable MENACE + DANGER + PREDATORY CONFIDENCE. Entries 10-18 words. NOT elegant-floating-pretty.

━━━ THE NORTH STAR ━━━
Vampirella-comic cover pose. Van-Helsing movie poster. Castlevania-boss portrait. Hellboy-Mignola panel. Bloodborne hunter. Bram Stoker's Dracula operatic stance. Characters are BEAUTIFUL, DANGEROUS, ALIVE — ground-planted predatory confidence, not YA-fantasy levitating-in-white-dress.

━━━ HARD BAN — DO NOT WRITE THESE ACTIONS ━━━
- NO "floating", "levitating", "hovering", "drifting gracefully", "rising ethereally"
- NO "hands-raised power-pose", "arms-outstretched summoning", "palms-up blessing"
- NO "standing with cloak-billowing" (too YA-fantasy-cover)
- NO "gazing serenely", "looking peaceful", "elegantly posed"
- NO pentagram-casting, satanic-ritual, devil-horn-hand-gestures, baphomet summoning (save for creature path, and even there kept to void-rift/shadow-tendril)
- NO generic "reading grimoire", "holding goblet" (too passive)

━━━ WHAT TO WRITE — CONFIDENT PREDATORY ACTIONS ━━━
The action must be GROUND-PLANTED or LEAPING or CROUCHED or STRIDING — something ALIVE and KINETIC. The viewer reads the action in 1 second: she is HUNTING / ATTACKING / REVEALING / COMMANDING / STALKING.

━━━ HARD DISTRIBUTION ACROSS 200 POOL (enforce) ━━━

PREDATORY STRIDE / GROUND-PLANTED (min 40):
- mid-stride through graveyard mist with blade lowered
- mid-step over cobblestone with silver crossbow aimed
- mid-walk toward viewer with hungry smirk and visible fangs
- striding past toppled gravestones with scythe at shoulder
- mid-approach with thighs grounded and wet-red blade trailing
- walking through fog with silver chain whip loose at her side
- mid-pace across cathedral rooftop with dagger twirling at fingers

CROUCHED / POISED-TO-LUNGE (min 25):
- crouched on gargoyle ledge with claws digging into stone, eyes locked on viewer
- perched on cathedral spire with bat-wings folded, about to spring
- mid-crouch over cobblestone with dagger drawn back to strike
- balanced on toppled coffin lid with blade pressed to her lips
- coiled in shadow with crossbow raised at cathedral window

MID-LUNGE / MID-POUNCE / MID-ATTACK (min 25):
- mid-pounce from cathedral buttress toward viewer, fangs bared
- mid-leap across street gap with silver blades flashing
- mid-swing with scythe carving arc through fog
- mid-strike with silver whip cracking
- mid-spring from altar with claws outstretched

DRAINING / FANGS-REVEALED (min 25):
- mid-drain with fangs sunk into victim's throat, pulling back to meet viewer's eye
- mid-bite with fangs latched, crimson spilling down her chin — implied not splattered
- just pulled away from victim's neck, lips stained crimson
- holding victim's wrist to lips, fang-pierced tendon showing
- mid-tear of fabric at collar, fangs flashing over pale throat

TRANSFORM / REVEAL (min 25):
- mid-unfurl of bat-wings exploding from spine, silk ribbons tearing
- mid-transform with fangs elongating and pupils slitting vertically
- mid-extension of claws from manicured fingers
- mid-emergence from shadow, body coalescing from black smoke
- mid-rise from velvet coffin with eyes snapping open, glowing

COMMAND / HUNT-SUMMON (min 25) — NO pentagrams, NO overt satanic symbols:
- mid-command of shadow-tendrils rising from floor flagstones
- mid-whisper to bat-familiar landing on outstretched arm
- mid-gesture summoning black smoke from cracked tombstones
- mid-command of crow-swarm overhead
- mid-cast with fel-green sparks leaping between fingertips (NO circle at her feet)
- mid-raise of silver-tipped staff, crimson mist curling up the shaft

REVEALING / OVER-SHOULDER / MID-TURN (min 20):
- mid-turn over shoulder with smirk and fangs visible
- mid-pivot with cloak flaring to show corset and weapon-belt
- mid-glance back from cathedral doorway, eyes glowing
- mid-tilt of head revealing ear-pierced fangs
- mid-step with backward glance toward viewer, silk-cape trailing

MONSTER-HUNTRESS ACTIONS (min 15) — Van-Helsing energy:
- mid-reload of silver crossbow with bolt clenched in teeth
- mid-swing of wooden stake behind her hip
- mid-snap of leather holster over vial of holy-water
- mid-draw of twin thin-blades from thigh sheaths
- mid-aim of flintlock with silver-bullet chambered

━━━ RULES ━━━
- Every action is CONCRETE + SPECIFIC + KINETIC — not vague
- Ground-planted or mid-leap preferred over floating/hovering
- Pair with any character archetype (vampire queen, succubus, blood-huntress, witch-queen, corrupted priestess, fel-sorceress, occult seductress, banshee, vampire lord, fallen paladin, shadow warlock, high cardinal)
- NO pentagrams, NO inverted crosses, NO satanic iconography, NO devil-horn-hand, NO 666
- NO "RED RED RED" monochrome — imply blood sparingly (lips, weapon-trail, single moon)
- Each entry distinctive — no two actions the same

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
