#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_sci_fi_action_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} 16-BIT SCI-FI ACTION GAMEPLAY SCREENSHOT scene descriptions for PixelBot's pixel-sci-fi-action path. Genre lineage: Contra III: The Alien Wars + Mega Man X + Super Metroid + Blaster Master + Turrican II + Gradius + R-Type + Salamander + Gunstar Heroes + Axelay + Cybernator + Star Soldier + Star Fox pixel-tribute.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM A 16-BIT SCI-FI ACTION GAME LEVEL — run-and-gun marines on alien-jungle platforms, mech-pilots blasting through robot factories, starfighters in asteroid-field dogfights, lone-wanderers blasting drones in post-apocalyptic ruins. Classic arcade-era sci-fi action gameplay. NOT cyberpunk-noir. NOT modern indie-illustrated. CLASSIC retro-action.

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST INCLUDE:
1. CAMERA — side-view run-and-gun / side-scrolling space-shooter / top-down vertical / 3/4 iso (one explicitly stated)
2. SCI-FI SETTING (alien jungle / robot factory / space-station / asteroid-field / mech-bay / post-apoc ruins / etc.)
3. SCI-FI ENEMY mid-action (alien creature / robot soldier / mech-walker / alien queen / drone swarm / plasma-turret / etc.)
4. HERO SPRITE small on the action floor (or piloting spaceship) — mid-action (firing / leaping / strafing / rolling / piloting)
5. SCI-FI PROPS (pulsing consoles / reactor cores / cables / catwalks / energy-arcs / ribbon-tubes / blast-doors / etc.)

━━━ SETTING TYPES — ROTATE BROADLY ━━━

- Alien jungle planet with vine-overgrown stone temples
- Robot factory interior with conveyor-belt platforms
- Space-station corridor with sliding blast-doors
- Asteroid-field starfighter dogfight
- Mech-bay with towering walker-mechs being repaired
- Post-apocalyptic ruined-city with mech-skeletons
- Lunar surface with crashed colony-ship wreckage
- Hostile-planet surface with toxic-gas geysers
- Starfighter cockpit cutaway with planet visible
- Alien hive with biomechanical pillars
- Cybernetic fortress with energy-shield walls
- Underwater alien temple with bubble-streams
- Volcanic alien planet with lava-rivers
- Orbital ring station with curving corridors
- Wreckage of crashed colony ship hull-interior
- Cybernetic jungle with neon-glowing alien plants
- Frozen alien tundra with ice-crystal pillars
- Industrial-zone with smoke-stack platforms
- Sub-orbital arcology with glass-domed chambers
- Alien throne room with bioluminescent flooring
- Crystal-cave on alien planet with refracting prisms
- Plasma-reactor core chamber pulsing with energy
- Sand-planet surface with dust-storm parallax
- Floating-island ruin in cosmic void

━━━ ENEMY TYPES — ROTATE BROADLY ━━━

Xenomorph alien with claws, robot soldier with pulse-rifle, mech-walker stomping, alien queen rearing, biomechanical horror, plasma-cannon turret rotating, drone swarm, alien plant strangling, cyborg general charging, segmented alien worm, mech-tank rolling, gun-pod hovering, kamikaze drone diving, energy-wraith floating, bipedal-mech stomping, eight-legged xenobeast, plasma-tentacle monstrosity, alien-imp lunging, robotic spider scuttling, alien-fighter ship strafing.

━━━ HERO SPRITE TYPES — ROTATE BROADLY ━━━

Armored space-marine with pulse-rifle, jetpack-soldier mid-thrust, mech-pilot in cockpit, lone-wanderer with plasma-rifle, cybernetic warrior with energy-blade, pilot-in-spaceship-cockpit silhouette, female bounty-hunter in power-armor, scout-marine with sniper-rifle, kamikaze-rookie with grenade-belt, technician-mech-pilot, dual-pistol mercenary, tank-pilot in cockpit-cutaway.

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Side-view 16-bit run-and-gun level, alien jungle planet, foreground stone-temple platform with vine-overgrown edges and hero space-marine sprite mid-strafe firing pulse-rifle, alien-xenomorph lunging from the right, glowing alien runes pulsing on temple walls, parallax jungle canopy with neon flora behind."
- "Horizontal side-scrolling space-shooter, hero starfighter sprite on the left mid-flight firing twin lasers, robot-fighter squadron attacking from the right with plasma-bolt trails, asteroid-field parallax with cratered rocks, distant nebula in pink-and-violet cosmic backdrop, drifting metallic debris."
- "3/4 isometric mech-bay chamber, towering walker-mechs flanking the corridor, hero mech-pilot sprite small on the foreground catwalk mid-stride toward an active mech, glowing reactor-core in the back wall pulsing electric-blue, hanging cables, sparks from welding rigs."
- "Top-down vertical scroller, hero space-marine sprite at bottom firing upward, three drone-pods diving from the top with plasma-trails, ruined-city below with mech-skeletons, smoke and rubble drifting, neon-orange explosions in middle-distance."
- "Side-view run-and-gun level, robot factory interior with conveyor-belt platforms, foreground steel-grate floor with hero jetpack-soldier sprite mid-thrust firing rifle, robot-soldier with pulse-rifle on raised platform, sparks from welding arcs, electric-blue energy-arcs between junction-boxes."
- "Horizontal side-scrolling space-shooter through asteroid-field, hero spaceship on left mid-barrel-roll firing missiles, biomechanical-fighter swarm from right, asteroid-cluster parallax, distant ringed-gas-giant planet in cosmic backdrop, drifting space-debris."
- "Top-down lunar surface, hero space-marine sprite at center firing in three directions, alien-imp swarm closing from all sides, crashed colony-ship wreckage, lit lunar-base structures in middle-distance, drifting moon-dust particles, deep blue-black sky with starfield."
- "Side-view run-and-gun cybernetic fortress, foreground tile-floor with hero female bounty-hunter sprite mid-leap firing dual pistols, plasma-cannon turret rotating mid-frame, energy-shield walls flanking, glowing reactor-pillars, parallax neon-grid backdrop."

━━━ HARD RULES ━━━

- ALWAYS specify camera (side-view run-and-gun / space-shooter / top-down / 3/4 iso)
- ALWAYS show a hero-sprite mid-action AND a sci-fi enemy in the scene
- 16-BIT chunky pixel-grid aesthetic — NOT modern HD-2D smooth, NOT painterly
- Saturated retro sci-fi palette — electric-blue / hot-magenta plasma / acid-green / metallic-orange / blue-black space
- Animated-feel particles (plasma-bolts / muzzle-flashes / explosion-shrapnel / energy-arcs / sparks / floating debris / smoke-trails)
- NO UI / health bars / damage numbers / dialogue boxes
- NO cyberpunk-noir trappings (NEVER "neon-rain wet-pavement" / "holographic billboards" / "neo-Tokyo corporate ads") — that's a different aesthetic we explicitly killed
- NEVER vertical-portrait compositions or static vistas without action
- Specific named IPs (Contra, Mega Man, Metroid by name) — never mentioned, just lineage in your head

━━━ AVOID ━━━

- Cyberpunk noir (rain-streets, neon-billboards, megacorp-noir) — DIFFERENT path, we killed it
- Concept-art portraits or vista paintings without action
- Smooth modern indie-pixel rendering
- Sterile static interiors without enemies and a hero

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
