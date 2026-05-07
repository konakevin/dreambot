const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PIXEL_SCI_FI_ACTION_SCENES, 'pixel_sci_fi_action_scene');
  const lighting = picker.pickWithRecency(pools.PIXEL_SCI_FI_ACTION_LIGHTING, 'pixel_sci_fi_action_lighting');
  const atmosphere = picker.pickWithRecency(pools.PIXEL_SCI_FI_ACTION_ATMOSPHERE, 'pixel_sci_fi_action_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART SCI-FI ACTION GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a level from a Contra / Mega Man X / Metroid / Blaster Master / Turrican / Gradius / R-Type / Star Fox / Gunstar Heroes / Axelay-style classic-arcade-era sci-fi action game. Run-and-gun aliens, robot armies, mech-bays, space-shooters, post-apocalyptic ruins.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ THE NORTH STAR ━━━

The viewer should think: "this is a screenshot from a 16-bit sci-fi action game I'd play right now." Run-and-gun marine on alien-jungle platforms, mech-pilot in a robot factory, starfighter dodging asteroids, lone-wanderer in post-apocalyptic ruins blasting drones. Saturated retro-action energy. NOT cyberpunk-noir. NOT modern indie-illustrated. CLASSIC arcade sci-fi action.

Lineage: Contra III: The Alien Wars + Mega Man X + Super Metroid + Blaster Master + Turrican II + Gradius + R-Type + Salamander + Gunstar Heroes + Axelay + Cybernator + Star Soldier + Star Fox pixel-tribute.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

Pick ONE per render:
- **HORIZONTAL SIDE-VIEW run-and-gun** (Contra / Mega Man / Metroid / Turrican) — character sliced flat across the world, foreground platforming surface, parallax-depth alien/sci-fi backdrop, hero marine/mech-pilot on the platform mid-strafe firing rifle.
- **HORIZONTAL SIDE-SCROLLING SPACE-SHOOTER** (Gradius / R-Type / Salamander / Axelay) — hero spaceship on the left of the frame in horizontal flight, enemies attacking from right, asteroid-field / nebula / planet-surface parallax backdrop, plasma-bolts / lasers crossing the screen.
- **TOP-DOWN vertical scroller** (1942 / Star Soldier / Blaster Master overworld / Twin Cobra) — looking down at the playable space, hero ship/tank/marine at bottom, enemies coming from top, terrain or space backdrop scrolling beneath.
- **3/4 ISOMETRIC sci-fi interior** (Blaster Master interior chambers / station corridors) — mech-bay / starship-corridor / laboratory with hero-sprite mid-action.

NEVER first-person, NEVER vertical-portrait static-vista, NEVER cyberpunk-neon-streets, NEVER concept-art portrait composition.

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. **SCI-FI SETTING** — alien jungle planet / robot factory / space-station corridor / asteroid-field / mech-bay / post-apocalyptic ruins / lunar surface / hostile-planet surface / starfighter dogfight / alien hive / cybernetic fortress / underwater alien temple / volcanic alien planet / orbital ring / wreckage of crashed colony ship.
2. **SCI-FI ENEMY mid-action** — alien creature with claws lunging / robot-soldier firing pulse-rifle / mech-walker stomping / alien-queen rearing / biomechanical horror / plasma-cannon turret rotating / drone swarm / alien plant strangling / cyborg general charging / xenomorph-style xenobeast / segmented alien worm.
3. **HERO SPRITE small on the action floor** (or in the spaceship for space-shooter) — armored space-marine with rifle / jetpack-soldier / mech-pilot / lone-wanderer with pulse-rifle / cybernetic warrior / pilot-in-spaceship-cockpit silhouette. Tiny scale relative to the scene, mid-action (firing / leaping / strafing / rolling / grappling / piloting).
4. **SCI-FI FLAVOR PROPS** — pulsing console panels / lit reactor cores / hanging cables / metallic catwalks / energy-shield walls / flickering monitors / plasma-pillar weapons / neon energy-arcs / ribbon-tubes / sliding blast-doors / bubbling chemical-tanks / floating debris / shattered hull-plating / glowing alien runes / reactor pillars.

━━━ THE SCI-FI ACTION SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Visible chunky pixel grid on every surface. Hero + enemies are sprite-art forms. Floor/ground tiles clearly tiled. Dithered shading for volume. NEVER smooth gradients, NEVER painterly hybrid. Saturated retro sci-fi palette — electric-blue energy / hot-magenta plasma / acid-green toxic / metallic-orange explosions / blue-black space.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- Camera: side-view run-and-gun OR side-scrolling space-shooter OR top-down OR 3/4 iso (NEVER first-person / vertical-portrait / static-vista / cyberpunk-noir)
- Sci-fi setting (alien planet / robot factory / space-station / asteroid-field / mech-bay / etc.)
- Sci-fi enemy mid-action
- Hero sprite small on the action floor (or piloting spaceship)
- Sci-fi flavor props (pulsing consoles / reactor cores / cables / catwalks)
- Animated particles (plasma-bolt trails / muzzle-flashes / laser-beams / explosion-shrapnel / energy-arcs / sparks / floating debris)
- Chunky 16-bit pixel grid throughout

The viewer should think: "this is a screenshot from a Contra / Mega Man / Metroid / Blaster Master / Star Fox-style game I'd play right now."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
