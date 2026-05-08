#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/combat_moment.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} COMBAT MOMENT descriptions for GothBot's vampire-assassin-combat path. Each entry is 18-30 words. This is the SPECIFIC moment of action — what the assassin and foe are doing in the frozen instant of the frame.

CONTEXT: Castlevania-boss-fight / Bloodborne-beast-fight / Devil-May-Cry-combat / Van-Helsing-confrontation. Cinematic FROZEN-INSTANT combat — the single beat of action that captures the fight. Not after, not before, the EXACT instant.

Categories (rotate widely):
- Crossbow shot (bolt mid-flight from her crossbow toward the foe / crossbow drawn-and-aimed mid-step / crossbow-firing recoil mid-action)
- Pistol shot (muzzle-flash mid-fire / pistol-aimed-arm-extended / both pistols crossed mid-fire)
- Blade clash (her blade meeting the foe's claws / sword-mid-arc / blade-crossed-with-foe's-strike / parrying claws with blade catching moonlight)
- Stake thrust (stake mid-thrust toward the vampire's chest / stake mid-arc / stake-and-cross combined mid-thrust)
- Leap-strike (assassin mid-leap toward the foe / mid-air mid-blade-swing / mid-pounce)
- Parry (assassin mid-parry of incoming claws / blade-deflecting-strike / shield-or-bracer mid-block)
- Whip-strike (whip mid-crack toward the foe / whip-coiled-around-creature's-arm)
- Holy-water throw (vial mid-flight toward the foe / smashed vial mid-shatter on the foe's flesh)
- Stand-off (drawn weapons facing each other across a frozen distance, assassin mid-motion forward, foe mid-motion back or up)
- Dodge-and-counter (assassin mid-roll under a claw-swipe / mid-duck with weapon coming around / mid-twist evading)
- Cathedral-fall (assassin mid-fall through stained-glass / both mid-air after a window-crash)
- Mid-throw (silver-throwing-knives mid-flight from her hand / fan of blades mid-arc)

EVERY entry must include:
- WHO is doing what (assassin doing X / foe doing Y — both characters in motion)
- The CONNECTING ACTION between them (her bolt about to hit / his fangs about to reach her)
- Frozen-instant language (mid-strike, mid-leap, mid-air, mid-fire, mid-arc, mid-shatter, mid-clash)

ABSOLUTELY BANNED:
- NO blood-spatter, NO blood-mist, NO open-wound visible
- NO dismemberment, NO entrails, NO gore
- NO already-dead-foe (this is mid-fight, both characters alive and active)
- NO gun-firing-with-realistic-recoil for sci-fi guns (only flintlocks)
- NO assassin-being-attacked (she's always on offense or in agile defense, never victim)
- NO mid-bite (no vampire actively biting her — she's the active aggressor)

Examples (write fresh):
- "Her silver crossbow-bolt mid-flight halfway between them, the vampire-lord mid-leap toward her with cape billowing, both bodies twisted at the moment of impact"
- "Her blade meeting the werewolf's claws mid-arc, sparks flying where silver crosses talon, her body twisted and forward, beast mid-snarl above her"
- "Stake mid-thrust toward the vampire's chest, her body twisted into the strike, his hand reaching out to deflect, frozen at the moment before contact"
- "Mid-leap from a cathedral parapet, blade extended downward toward the gargoyle below mid-uncoil, her body coiled in mid-air freefall"
- "Whip mid-crack uncoiling toward the demon's wrist, silver-tipped barbed length slicing through fog, demon mid-recoil with claws raised"

Output ONLY a valid JSON array of ${n} strings (18-30 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
