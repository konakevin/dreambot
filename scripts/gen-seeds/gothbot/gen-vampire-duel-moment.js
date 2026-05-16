#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_duel_moment.json',
  total: 30,
  batch: 30,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-VS-VAMPIRE DUEL MOMENT descriptions for GothBot's vampire-assassin-combat path. Each entry is 25-40 words. The moment is the FROZEN INSTANT of a humanoid-vs-humanoid vampire-duel — both combatants in mid-strike, weapons or claws or magic CONNECTING them physically in the frame.

CRITICAL: This is HUMANOID-VS-HUMANOID combat. Two vampire-combatants (the vampire-assassin AND a vampire-foe), both human-shaped, both armed, locked in a frozen instant of fight engagement. NOT a beast-fight. NOT a creature-attack. A DUEL between two upright humanoid figures.

EVERY entry describes a SPECIFIC connection moment between weapon-and-foe (or claw-and-blade, or magic-and-shield): blade-tip meets blade, dagger pinning cloak to wall, crossbow-bolt embedded in vampire's chest, whip-coil wrapping vampire's throat, pistol-muzzle flashing point-blank at vampire's face, fist clashing fang-baring face, hand-grip on vampire's throat mid-throw.

VARY action types across the pool:
- Sword-vs-sword clash (blades meeting mid-air, sparks flying)
- Sword-vs-claw parry (assassin's blade catching vampire's bare clawed hand)
- Dagger lunge connecting (silver dagger embedded in vampire's shoulder, vampire's hand grabbing wrist)
- Crossbow point-blank (bolt embedded or mid-flight inches from vampire's chest)
- Pistol point-blank (flintlock-muzzle flashing at vampire's face)
- Whip-crack (silver-tipped whip wrapping vampire's throat or wrist)
- Stake mid-thrust (assassin's wooden stake mid-plunge toward vampire's heart, vampire's hand catching wrist)
- Holy-water mid-splash (glass-vial shattering against vampire's face, consecrated liquid spreading)
- Throwing-knife (knife mid-flight toward vampire, vampire mid-counter raising arm)
- Mid-leap aerial strike (assassin descending from rafters with daggers extended toward vampire below)
- Mid-air kick (one combatant pivoting off the other mid-spin)
- Throat-grip throw (one grabbing the other by the throat mid-throw)
- Sword-flat-block (assassin blocking vampire's claw with the flat of the blade)
- Magic-vs-blade (vampire-foe casting blood-magic blast, assassin's silver-shield deflecting)
- Chain-whip wrapping rapier (the assassin's chain-whip coiling the foe's drawn rapier)
- Double-blade lock (rapiers crossed at hilt, both combatants close, fang-baring face-off)
- Mid-pirouette dodge (assassin spinning behind the vampire mid-attack, blade trailing)
- Wrist-lock counter (vampire grabbing the assassin's pistol wrist mid-fire)
- Cape-flare misdirection (one combatant using cape to mask a strike, blade emerging from beneath)

EVERY entry must include:
- THE EXACT physical contact-point (where weapon/claw/hand touches the other body)
- BOTH combatants visible in motion (one mid-strike, the other mid-counter or mid-react)
- Specific weapon named (silver rapier, flintlock pistol, crossbow, silver dagger, etc.) — period-accurate
- ONE atmospheric detail (sparks / muzzle-flash / blood-magic-glow / moonlight catching the blade / cathedral shadow / cape-mid-flare)
- READS as a single frozen instant of combat — like a Bloodborne fight-still or Castlevania boss-clash key-art

ABSOLUTELY BANNED:
- NO beasts / werewolves / claws-on-monster (this is HUMANOID DUEL only)
- NO gore-spatter / NO blood-mist / NO entrails / NO dismemberment
- NO already-defeated vampire (the foe is ACTIVELY counter-attacking)
- NO modern weapons (no semi-auto / no scopes / no compound-crossbow / no carbon-fiber)
- NO satanic-imagery
- NO stationary "facing each other" — must be PHYSICAL CONTACT
- NO description of just the assassin alone or just the foe alone — BOTH are in the moment

Examples (write fresh):
- "Silver rapier-tip meeting vampire's blocking blade mid-clash, sparks erupting where steel crosses steel, both combatants frozen mid-pivot, cape-flare and coat-tail caught in motion, moonlight catching the edge"
- "Crossbow-bolt embedded mid-flight in vampire-lord's chest at point-blank, his clawed hand frozen mid-rise to deflect, assassin's other hand reaching for a second pistol at her hip, bolt-fletching still vibrating"
- "Silver-tipped whip-coil wrapping vampiress's throat mid-pull, her hands clutching at the chain, assassin's boots planted and body braced, the vampire-foe mid-stagger, cathedral candles flickering in the disturbance"
- "Stake mid-thrust toward vampire-elder's heart, his bone-pale hand grabbing the assassin's wrist inches before contact, both bodies leaned-in, fang-baring snarls inches apart, blood-moon framing them in silhouette"
- "Pistol-muzzle flashing point-blank at vampire-foe's face, the foe's head jerked back mid-snarl, smoke trailing from the barrel, the assassin's free hand already drawing a silver dagger, frozen mid-firing"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
