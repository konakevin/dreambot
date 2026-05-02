#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/mech_toy_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MECH-TOY-RAMPAGE scene descriptions for ToyBot's mech-toy-rampage path. Articulated transforming-mech / Gundam-model-kit / Zoids-style robot-toys mid-battle on epic toy-photography sets. Saturday-morning-mecha-anime-toy-line cinematic energy. Non-IP — archetype only.

Each entry: 18-28 words. ONE specific scene with mech-toy(s) mid-action on a handcrafted set.

━━━ THE MECHS ━━━
1/144-scale to 1/100-scale articulated robot-toys / Gundam-model-kits / transforming-mech-toys. Visible ball-joint articulation, chrome paneling, transformation seams (line-cuts), cockpit-canopy with glowing tinted plastic, hand-painted weathering, snap-on weapons (energy-sword, plasma-rifle, shield, shoulder-cannon, missile-pod, beam-cannon, rifle, war-hammer). Archetypes: humanoid-mecha (Gundam DNA), transforming-car-mecha (Transformers DNA — non-IP), beast-form mecha (lion / tiger / wolf / dragon / eagle / scorpion mech — Zoids DNA), powered-armor-exosuit (Iron-Man-style heavy-armor, non-IP), kaiju-mech (giant kaiju vs giant mecha), megazord-style combiner (multiple mechs joined). NEVER named-IP characters (no Optimus, no Megatron, no specific Gundam designations).

━━━ THE WORLDS (handcrafted sets) ━━━
City skyline rooftop, kaiju ocean, space hangar, alien desert, volcano lab, orbital station, megacity grid, mountain training-ground, arctic outpost, tropical island fortress, asteroid field, space-elevator base, cyberpunk neon-alley, ruined city, dam-power-station, jungle canopy, snowy military-base, undersea trench-base, mecha-graveyard, military-parade-ground.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Two humanoid-mechs mid-energy-sword-clash on rooftop — sparks frozen between blades, sunset-cityscape behind
- Transforming-car-mech mid-flight on jet-thrusters over megacity grid — exhaust-trail glowing chrome reflections
- Beast-form lion-mech mid-leap onto kaiju back — claws extended, kaiju-roar-haze, ocean far below
- Powered-armor exosuit blasting plasma-cannon at terror-mech — muzzle-flash washing scene white
- Megazord-combiner mid-formation in space hangar — five mechs joining sequence frozen mid-snap, hangar lights flashing
- Wolf-mech vs scorpion-mech in alien desert — mid-dust-clash, twin-suns sky, mech-cockpit-glow visible
- Humanoid-mech mid-heroic-pose on volcano-lab catwalk — cockpit-glow, lava-glow rim, energy-rifle held
- Beast-form dragon-mech breathing plasma-flame at orbital station — chrome scales reflecting blast
- Two transforming-mechs mid-transformation in city street — caught between car-form and robot-form, motion-blur
- Powered-armor exosuit guarding research-lab door — heavy-cannon at ready, weathered paint, alarm-light flashing
- Mecha-graveyard scavenger-mech crouching beside fallen mecha — pulling weapon from wreckage, sunset
- Eagle-mech vs hawk-mech mid-air combat — locked talons mid-spin, missile-trails crossing
- Humanoid-mech mid-shield-block from beam-blast — shield deflecting energy back, sparks raining
- Combiner-mech full-form smashing through cyberpunk neon-tower — neon-shards exploding outward
- Tiger-mech stalking through ruined city — cockpit-glow lighting rubble, distant smoke
- Two humanoid-mechs back-to-back firing rifles in 360 — beam-streaks crossing in all directions
- Heavy-armor exosuit mid-jetpack-launch from arctic-outpost roof — snow-spray, blue-hour sky
- Megazord mid-final-strike with combined-sword — energy-overcharge frozen at apex, kaiju below
- Transforming-car-mech mid-drive through space-hangar — chrome paint reflecting docking-lights
- Wolf-mech howling on mountain training-ground peak — chrome jaw open, comm-array signal-burst
- Humanoid-mech kneeling for repair in space-hangar — cockpit-canopy open, technician-mech (smaller) attaching part
- Beast-form scorpion-mech burrowing out of alien-desert — chrome claws clawing surface, sand-spray
- Two mechs mid-grapple on dam-spillway — water cascading around them, sparks shorting electronics
- Powered-armor exosuit firing missile-pod at swarm of small drone-mechs — missile-trails arcing
- Humanoid-mech mid-leap from jungle-canopy onto enemy-mech — energy-sword raised overhead
- Megazord stabilizing on rooftop after combine-sequence — chrome plates locking with audible click
- Beast-form lion-mech vs heavy-armor exosuit on jungle-canopy — mid-pounce, leaves shaking
- Two transforming-car-mechs mid-collision on highway — chrome shedding off, car-mode partial transformation
- Humanoid-mech catching falling civilian-mech (smaller transport-bot) — protective-stance, distant explosion behind
- Snow-camo arctic-mech firing harpoon-cannon at terror-mech — harpoon-cable spooling out
- Megazord-finger-blast at kaiju on rooftop — single chrome-finger glowing as energy-channel
- Transforming-jet-mech mid-aerial-roll over megacity — chrome wings catching sunset
- Heavy-armor exosuit mid-power-up — chrome plates unfolding outward, energy-glow building in chest-reactor
- Humanoid-mech with one missing arm mid-swing of remaining sword — battle-damaged paint, scratched panels
- Two beast-form mechs (lion + tiger) team-pouncing on giant-kaiju — claws sinking into chrome scales
- Combiner mid-disassembly as separate mechs eject upward — chrome panels separating in mid-air
- Powered-armor exosuit grappling chain-mech around throat — both mid-stagger, sparks bursting
- Transforming-car-mech with surfboard-blade mid-grind on tower-edge — chrome scraping concrete sparks
- Mecha-vs-kaiju coastal battle — mech mid-haymaker on kaiju jaw, ocean spray, distant city
- Humanoid-mech mid-Mexican-standoff with three terror-mechs — beam-rifles all aimed at center, neon alley
- Beast-form dragon-mech defensive-curl around chrome-egg — wings folded protectively, fire-aura rim-light
- Megazord on knee mid-power-down — steam venting from chrome panels, cockpit-glow dimming
- Transforming-mech mid-vehicle-transform with rotor-blades extending — chrome rotors blurring
- Two humanoid-mechs mid-rappel down city tower — chrome cables anchored, weapons drawn
- Heavy-armor exosuit on military-parade-ground saluting — chrome arm raised, missile-pods shoulder-mounted
- Beast-form wolf-mech protecting downed humanoid-mech — snarling stance, chrome teeth bared
- Megazord finishing-move overhead-strike with combined-sword — energy-aura expanding outward
- Humanoid-mech mid-aerial-spin firing dual-pistols — beam-trails spiraling around mech, neon city BG
- Transforming-jet-mech mid-mid-air-collision with terror-jet-mech — chrome confetti and explosion-bloom
- Powered-armor exosuit blocking laser-blast with raised forearm-shield — chrome-shield glowing white-hot

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference ARTICULATED / GUNDAM / TRANSFORMING / MECH / ROBOT-TOY / CHROME / MODEL-KIT / 1/144-SCALE language
- Specific mech archetype (humanoid-mecha / transforming-car-mech / beast-form-mech / powered-armor-exosuit / megazord)
- Mid-action verb (mid-clash / mid-leap / mid-transformation / mid-strike / mid-fire / mid-pounce)
- Snap-on weapon detail (energy-sword / plasma-rifle / shield / shoulder-cannon / missile-pod / beam-cannon)
- Cinematic-mecha-toy-line setting (city / space / alien-desert / volcano / orbital-station / etc.)

━━━ BANNED ━━━
- NO IP-named characters (Optimus / Megatron / Gundam Wing / Zoids specific names) — archetype only
- NO real robots / real military
- NO CGI / illustration / digital-render language
- NO human pilots visible (mechs are autonomous in frame)
- NO passive standing — all mechs in active poses

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
