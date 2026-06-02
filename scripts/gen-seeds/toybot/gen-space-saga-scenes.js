#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/space_saga_scenes.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} authentic STAR WARS vintage Kenner 3.75-inch CHAOS-LEVEL-11 BATTLE scene descriptions. Each entry must be a CINEMATIC CHAOS FREEZE-FRAME — multiple things exploding / clashing / firing / falling SIMULTANEOUSLY. Think the Battle of Hoth, Endor speeder chase, Trench Run climax, Cantina shootout — the most ICONIC ACTION FRAMES in Star Wars cinema. Each entry 22-36 words.

━━━ CHAOS-LEVEL-11 RULE — NON-NEGOTIABLE ━━━
EVERY entry must contain MINIMUM 3 simultaneous things happening — multi-event chaos:
- 3+ characters mid-action (not standing) — firing / leaping / falling / dueling / charging
- VEHICLE in frame mid-action (TIE Fighter exploding / X-wing strafing / AT-ST falling / Sail Barge listing / speeder-bike crashing)
- VISIBLE PYROTECHNICS — explosion-bloom + blaster-bolts streaking + debris-shrapnel + smoke-pillar + sparks-cascade
- ENVIRONMENTAL DESTRUCTION — wall mid-shatter / floor mid-collapse / panel mid-explode / tree mid-snap / ice-wall mid-fracture

━━━ STAR WARS CINEMATIC CHAOS PEAK MOMENTS (rotate, vary) ━━━
- Battle of Hoth: 3 AT-ATs mid-stride firing twin-cannons, snowspeeders mid-strafing-run snowy pyrotechnics, Wedge mid-zipline-swing around AT-AT legs, Echo Base hangar mid-blast in BG, ice-shards mid-air, snow-bloom from impacts
- Battle of Endor: AT-ST mid-toppling crushed by log-pendulum, Ewoks swinging on vines, Han firing at retreating Scout Troopers, shield-bunker exploding behind, smoke-pillar against jungle canopy, Imperial-shuttle mid-takeoff
- Death Star Trench Run: 4 X-wings mid-trench-strafing-run, TIE Fighters mid-pursuit firing back, Vader's TIE Advanced mid-flame-spin, proton-torpedo mid-exhaust-port-impact, explosion-glow on metal corridor walls, Wedge mid-pull-up
- Mos Eisley Cantina Shootout: Han mid-blaster-fire at Greedo under table (table-edge splintering), Stormtroopers mid-burst-through-doorway, Walrus Man mid-arm-amputation by Obi-Wan's lightsaber, Cantina Band mid-stage-stampede, smoke-pillar
- Sarlacc Pit Battle: Boba Fett mid-jetpack-ignite over pit, Han mid-pole-swing knocking Skiff Guards backward, Luke mid-force-jump catching lightsaber from R2-D2, Sail Barge mid-explosion behind, Sarlacc mid-tentacle-grab on Imperial Guard
- Cloud City Carbonite Chamber: Han mid-fall into freezing-pit (steam-vapor rising), Vader's red lightsaber mid-strike-block by Luke's blue blade, Boba Fett mid-EE-3-fire, Leia and Lando mid-zipline-swing, sparks raining
- Naboo Hangar Battle: Anakin's N-1 mid-takeoff exhaust-bloom, Battle Droids mid-decapitation-by Qui-Gon's lightsaber sweep, Padmé mid-blaster-volley, droid-heads flying, hangar-doors mid-close
- Mustafar Lava Platform: Obi-Wan mid-force-jump-flip catching collapsing platform, Anakin mid-lightsaber-overhead-strike, lava-river mid-eruption pouring through floor-grate, mining-droid mid-explosion behind, heat-shimmer warping
- Geonosis Arena: 200+ Battle Droids mid-blaster-fire at Jedi cluster, Mace Windu mid-purple-lightsaber-deflect, Acklay mid-rear stabbed by Padmé, Anakin mid-Reek-mount, Jango Fett mid-jetpack-ignite, dust-cloud
- Mace Windu vs Sidious: Mace mid-Vaapad-lightsaber-arc, Sidious mid-force-lightning-arc-deflected backward, window mid-shatter Senate-skyline, Anakin mid-step-forward (Mustafar premonition), guards mid-fall outside
- AT-AT Takedown: Snowspeeder mid-harpoon-cable-wrap around AT-AT legs (cable taut), AT-AT mid-stumble forward face-down, Snowtroopers mid-fall from cockpit-tilt, Hoth-snow-bloom under impact, Wedge mid-cockpit-grin
- Boarding the Tantive IV: Stormtroopers mid-burst-through smoking blast-door, Rebel Troopers mid-blaster-volley return-fire, walls mid-shatter, smoke-haze, blaster-bolts streaking, Princess Leia mid-corner-peek with hold-out blaster
- Ewok Catapult Volley: 6 Ewoks mid-pull-back catapult-stones, AT-ST mid-impact rocks shattering on cockpit, Stormtroopers mid-defenestration as turrets explode, jungle-canopy mid-flame-spread, sparks raining
- Falcon Mid-Asteroid-Field: Falcon mid-banking-spin between asteroids (debris bouncing off hull), TIE Fighter mid-asteroid-collision exploding, Han at controls mid-shout, Leia mid-blaster-fire from gunner-turret
- Yoda vs Dooku: Yoda mid-back-flip-saber-spin, Dooku mid-force-lightning-arc, Geonosis hangar mid-collapse pillar mid-fall, Obi-Wan mid-collapse on floor, Anakin mid-rise from rubble, sparks cascade
- Slave I Carbon Bay: Boba Fett mid-EE-3-fire defending frozen-Han (carbonite-block on conveyor), Luke mid-force-jump up-into-rafters, Leia mid-vest-ungag near vent, exhaust-mist filling chamber, Falcon hovering outside
- Krayt Dragon Skeleton chase: 3 speeder-bikes mid-chase across Dune Sea, Tusken Raiders mid-fire-from-banthas, sand-explosion from blaster-impact, krayt-dragon-skull mid-crumble in BG, twin-suns flare
- Death Star II Explosion: Lando's Falcon mid-banking-out of crumbling reactor superstructure, Wedge's X-wing mid-strafing-run firing missiles, scaffolding mid-collapse around ship, Death-Star-explosion-bloom-prelude, debris-rain
- Jabba's Sail Barge final: Luke mid-force-jump-grab-handhold off Skiff, Boba Fett mid-pole-swing fall toward Sarlacc, Lando mid-blaster-take-down Klatuu Skiff Guard, Salacious B. Crumb mid-screech, Sail Barge mid-explosion-bloom, deck mid-tilt
- Coruscant Speeder Chase: Anakin's yellow speeder mid-loop-de-loop weaving traffic, Obi-Wan mid-leap onto Zam Wesell's speeder, blaster-fire crossing skyline, advertising-hologram mid-flicker, building-window mid-shatter

━━━ CHAOS RULES (recap, enforced) ━━━
- 3+ simultaneous mid-actions per entry (not just one)
- Vehicle present (X-wing / TIE / Falcon / AT-AT / AT-ST / Speeder / Sail Barge / etc.)
- Explosion / pyrotechnic visible
- Environmental destruction
- Named Star Wars characters performing the actions (Luke / Leia / Han / Vader / Boba / Yoda / Obi-Wan / Mace / Anakin / Padmé / Chewbacca / Lando / Wedge / Wicket / Stormtroopers / Battle Droids / etc.)

━━━ FORMAT ━━━
Each entry: 22-36 words, comma-separated phrases. Multi-event chaos:
- "3 AT-ATs mid-stride firing twin-cannons, snowspeeders mid-strafing harpoon-cable-spin, Wedge mid-zipline-around-legs, Echo Base hangar mid-blast BG, snow-bloom on ice-shards"
- "Han mid-blaster-fire at Greedo under cantina-table (edge splintering), Stormtroopers mid-burst doorway, Walrus Man mid-arm-amputation Obi-Wan saber, smoke-pillar"
- "Boba Fett mid-jetpack-ignite over Sarlacc, Han mid-pole-swing Skiff Guards backward, Luke mid-force-jump catching saber R2 throws, Sail Barge mid-explosion BG"

━━━ BANNED ━━━
- Single-character standing-around / posing / portrait-mode
- Static tableau / reception / discussion / planning
- Disney sequel-trilogy
- "Mid-stride" alone (must have 2+ other simultaneous events)
- CGI / illustration

━━━ DEDUP RULE ━━━
- No two entries share the same PEAK-MOMENT exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
