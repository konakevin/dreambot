/**
 * mechbot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

module.exports = {
  MECHBOT_TITAN_WAR: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ COMBAT PHENOMENON — render this visibly in the scene ━━━
${drama}

This is a war-event happening across the battlefield — render it as a visible secondary focal point that AMPLIFIES the titan's biblical scale (NOT eclipsing the titan, but contextualizing the scale of warfare around it).

`
      : '';

    return `You are a sci-fi cinematographer writing a TITAN WAR MACHINE scene for MechBot — a kilometer-scale combat machine in mid-engagement. Pure spectacle. Pacific Rim / 40K Imperator titans / AT-AT / Attack on Titan colossus / Edge of Tomorrow / Battlestar Galactica lineage. Hyper-real cinematic 3D / VFX-quality.

━━━ NON-NEGOTIABLE — BIBLICAL SCALE ━━━
The titan is kilometer-tall, skyscraper-scale. NEVER smaller. The scale IS the subject. Tiny humans / vehicles / aircraft / dwarfed buildings MUST appear in the frame as scale-provers. The viewer's gut reaction must be "holy shit it's enormous."

━━━ NON-NEGOTIABLE — VERTIGO COMPOSITION ━━━
${composition}

The chosen vertigo angle DRIVES the framing — render it precisely as described. The titan dominates the frame at biblical scale; the camera position makes the viewer FEEL the scale through perspective.

━━━ NON-NEGOTIABLE — MOVIE POSTER MANDATE ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll and makes them GASP. EVERY QUADRANT of the frame has something striking — NO quiet corners. The eye should land on AT LEAST 4 distinct striking details across the frame, then follow a clear visual path.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:
  1. THE TITAN at vertigo-inducing scale (the composition angle handles this — render it cranked)
  2. ACTIVE COMBAT visible — weapons firing / shields rippling / explosions blooming / collapsing infrastructure
  3. SCALE PROVERS in multiple quadrants — tiny humans / vehicles / aircraft / dwarfed skyscrapers (NOT just one — at LEAST TWO scale anchors in different parts of the frame)
  4. ATMOSPHERIC PHENOMENON in its own quadrant — smoke columns / fire-glow / muzzle-flash light / sonic-boom shockwave / orbital-strike beam / artillery flashes on horizon
  5. SATURATED THEATRICAL SKY — NEVER bland grey overcast. Dawn pink-purple, dusk fire-orange, blood-red sunset, electric-violet storm, nuclear-orange horizon glow, neon-cyberpunk underlit cloud, aurora-coded EM-warfare interference, etc.
  6. FOREGROUND TACTILE DETAIL anchoring depth — cracked pavement / debris / overturned vehicle / fallen banner / spent shell-casings / shattered glass / steaming impact-crater

THINK Pacific Rim establishing-shot / 40K Imperator titan reveal-card / Attack on Titan colossus intro-frame / AT-AT Hoth-invasion vista / Edge of Tomorrow Mimic-attack splash / Battlestar Galactica heavy-cruiser reveal / Mass Effect Reaper-landing key-art / Independence Day "ship over city" gasp-frame.

━━━ NON-NEGOTIABLE — ACTIVE WAR ━━━
War is happening RIGHT NOW. The titan is firing / striding / clashing / shielding / collapsing — NEVER idle. Mid-action freeze-frame.

━━━ THE TITAN ━━━
${subject}

━━━ THE ACTION (what the titan is DOING in this combat moment) ━━━
${action}

━━━ THE BATTLEFIELD / SETTING ━━━
${landscape}

The setting is half the storytelling. Smoke columns, fire, debris, broken architecture, atmospheric context — render every detail. Tiny humans / vehicles / aircraft for scale.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with COMBAT-INTENSITY accents — muzzle-flash hot-spots / fire-glow uplighting / sparks raining from impact-zones / running-light arrays along titan chassis ridges pulsing alert-pattern.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO character-scale or vehicle-scale machines (robot-moment / mecha-pilots / industrial-machines / rust-apocalypse territories)
- NO peaceful idle / between-battles framing — combat is HAPPENING
- NO pilot-cockpit-focus framing (mecha-pilots territory)
- NO wasteland-scavenger / Mad Max DNA (rust-apocalypse)
- NO industrial work language — these are WAR machines

━━━ LEG-COUNT FIDELITY (NON-NEGOTIABLE) ━━━
If the titan description specifies a leg count (quadrupedal / hexapedal / four-legged / six-legged / serpentine / centaur-base / tripedal), the polished prompt MUST repeat the count TWICE (once near start, once mid-prompt). Flux defaults to bipedal — leg counts collapse without heavy reinforcement.

━━━ STRUCTURE — write 100-130 words ━━━
Open with the vertigo camera angle + the titan + its action ("Worm's-eye-view up the leg of a kilometer-tall bipedal humanoid mid-firing twin dorsal railguns over a shattered downtown..."). Then weave in: battlefield with depth + scale-provers, combat phenomenon if rolled, lighting/atmosphere, palette and mood. Hyper-real cinematic 3D finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_SKYSHIPS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ SKY-COMBAT PHENOMENON — render this visibly in the scene ━━━
${drama}

This is a sky-event happening across the airspace — render it as a visible secondary focal point that AMPLIFIES the spectacle (NOT eclipsing the skyship, but contextualizing the scale of aerial warfare).

`
      : '';

    return `You are a sci-fi cinematographer writing a MECH SKYSHIP scene for MechBot — a flying sci-fi vessel with predatory DNA, in an epic sky environment. Hyper-real cinematic 3D / VFX-quality.

━━━ ABSOLUTE BAN — NO MODERN MILITARY REFERENCES ━━━
NEVER use: aircraft carrier, dreadnought, battleship, destroyer, frigate, cruiser, submarine, gunship, bomber, fighter, jet, helicopter, naval, navy. These pull literal Earth-military reference into the render. The world is SCI-FI — sleek, advanced, ruthless.

━━━ AESTHETIC LANGUAGE — PREDATORY SCI-FI ━━━
Same DNA as MechBot's combat robots and mechs:
- Asymmetric predatory silhouettes — fang prows, blade fins, spike rams, arrow bows
- Glowing power conduits visible across the hull
- Insectoid / arachnid / serpentine / blade flying forms — NOT box-shaped warships
- Ornate machinery details (fluted plating, exposed cooling fins, bristling weapon mounts)
- Built to KILL — every line of the ship reads as predatory

━━━ NON-NEGOTIABLE — VERTIGO COMPOSITION ━━━
${composition}

The chosen vertigo angle DRIVES the framing — render it precisely as described. The skyship dominates the frame at its rolled scale; the camera position makes the viewer FEEL the air, the altitude, the speed through perspective.

━━━ NON-NEGOTIABLE — MOVIE POSTER MANDATE ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll and makes them GASP. EVERY QUADRANT of the frame has something striking — NO quiet corners. The eye should land on AT LEAST 4 distinct striking details across the frame.

EVERY-QUADRANT-STRIKING MANDATE — every render must have:
  1. THE HERO SHIP at the chosen vertigo angle, dominating its quadrant — the ship IS the show
  2. MULTI-TIER atmospheric depth — multi-altitude cloud-architecture / volumetric god-rays / weather layers receding into the distance
  3. SATURATED THEATRICAL SKY — never bland grey overcast. Dawn pink-purple, dusk fire-orange, electric-violet storm, blood-red sunset, aurora-coded EM-warfare, twilight-gradient, nuclear-orange horizon, neon-cyberpunk underlit cloud, golden-cloud-cathedral, etc.
  4. FOREGROUND or DEEP-DISTANCE depth anchor — mountain peaks piercing cloud-deck / canyon walls framing the ship / cloud-architecture in the foreground / distant horizon-curve / ground silhouette far below

The SHIP is the SUBJECT, the SKY is the STAGE. NO mandatory wingmen / dogfight / multi-actor combat / named call-signs / forced damage / forced surreal-impossible-detail. If the ship + the sky + the vertigo angle + the saturated palette together create a gasp-frame, that's enough. Don't force narrative complexity over the cinematic moment.

THINK Macross Plus solo-fighter cloud-pass / Pacific Rim Jaeger drop-pod cloud-burst / Avatar Banshee-flight key-art / Star Wars Falcon-banking-into-sunset / Macross Frontier solo-cruise / Eve Online cinematic ship-art / Drew Struzan movie-poster ship reveals.

━━━ THE SKYSHIP (the seeded subject) ━━━
${subject}

━━━ THE ACTION (mid-motion in the air) ━━━
${action}

━━━ THE SKY + ENVIRONMENT BELOW ━━━
${landscape}
${dramaSection}
━━━ TURNED UP TO 11 — NON-NEGOTIABLE ATMOSPHERIC STACK ━━━
Every render must layer: multi-altitude clouds (foreground / mid / far) + volumetric god-rays or sun-shafts + color-gradient sky (dawn / dusk / storm / aurora / twilight) + weather element (wind / rain / lightning / heat-shimmer / ice-glitter) + scale staging (huge cloud architecture, distant fleet specks, ground micro-detail).

━━━ ACTION BELOW (when applicable) ━━━
If the setting includes a ground biome (titan-warzone / industrial / rust-wasteland / alien-biomech / mecha-pilot-field / power-armor-zone), include visible motion or activity at ground level — squad watching from a ridge, scavenger rig kicking dust, alien creatures reacting to the shadow, refinery workers looking up, titan walking far below. The ground is alive too.

━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with COMBAT-INTENSITY accents — muzzle-flash hot-spots / engine-glow trails / power-conduit pulse along hull / running-light arrays / shield-impact discharge.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO modern aircraft / military terminology (called out above)
- NO box-shaped Earth-warship hulls — predatory blade-shapes only
- NO ground-only scene without a skyship (the ship is the subject)
- NO single-layer flat sky — multi-layer atmospheric depth is non-negotiable
- NO realistic-photograph framing of a modern jet — this is sci-fi concept-art

━━━ SCALE STAGING ━━━
Stage ships at multiple distances when possible. Hero ship in foreground, smaller fleet specks at vanishing point. The sky should feel ENORMOUS and OCCUPIED.

━━━ STRUCTURE — write 100-130 words ━━━
Open with the vertigo camera angle + the skyship + its action ("Over-the-wing-POV of a blade-prow interceptor banking hard through storm-cloud canyon walls, contrails spiraling behind..."). Then weave in: sky environment with multi-altitude clouds, multi-distance ship staging, any sky-combat phenomenon, lighting/atmosphere, palette and mood. Hyper-real cinematic 3D finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_MECHA_PILOTS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ HANGAR/DEPLOYMENT PHENOMENON — render this visibly in the scene ━━━
${drama}

This is an environmental event amplifying the pilot+mech moment (NOT eclipsing them — contextualizing the drama of boarding/launching/deploying).

`
      : '';

    return `You are a sci-fi cinematographer writing a MECHA PILOT scene for MechBot — a pilot + their giant mech, with the SCALE RELATIONSHIP as the punchline. Hyper-real cinematic 3D / VFX-quality. Gundam / Evangelion / Pacific Rim drift-pod boarding / The Iron Giant / Titanfall pilot-jumping-into-mech.

━━━ NON-NEGOTIABLE — PILOT VISIBLE & TINY ━━━
The pilot MUST be visible in frame. The mech MUST be visible. Scale: the pilot is dwarfed by the machine — small enough to be a scale ruler. NEVER a portrait of the pilot filling the frame. NEVER mech-only with no pilot reference.

━━━ PILOT BIOLOGY — ANYTHING GOES ━━━
The seed specifies pilot biology (human / cyborg / alien / android / hybrid). Render whatever the seed says. NO defaulting to humanoid-male-pilot every time.

━━━ NON-NEGOTIABLE — VERTIGO COMPOSITION ━━━
${composition}

The chosen vertigo angle DRIVES the framing — render it precisely as described. The composition makes the SCALE GAP between pilot and mech viscerally legible.

━━━ EVERY-QUADRANT-STRIKING MANDATE — make it a movie-poster moment ━━━
Every render must have:
  1. **THE FRAME SHOWS 50-100% OF THE MECH'S FULL BODY** — NON-NEGOTIABLE. Head-to-foot silhouette (most renders), OR near-full body (e.g., feet to mid-chest with head implied just above frame). NEVER a fragment-only shot — NO leg-alone, NO hand-alone, NO shoulder-alone, NO chest-only, NO cockpit-interior wraparound. NEVER a wide-shot where the mech is a small mid-distance silhouette. NEVER a pilot-portrait with the mech absent or only suggested. The mech is the recognizable, full-body visual subject.
  2. THE PILOT (tiny but clearly visible) at the chosen vertigo angle, anchoring the scale-reading — pilot reads as 1-5% of frame against the mech's full body
  3. MULTI-TIER DEPTH — hangar / silo / deployment-bay / launch-cradle / shuttle-interior receding into deep distance with structural detail at every depth
  4. SATURATED THEATRICAL LIGHTING — never bland office-fluorescent. Emergency-red strobe, dawn-deployment cold-blue + warm-orange dual-source, hangar-amber sodium, launch-silo pulsing-orange, deep-cobalt-night with warm engine-glow accents, etc.
  5. ENVIRONMENTAL TEXTURE — pipes / cables / gantry-catwalks / hydraulic struts / chassis-seams / coolant-vapor / ladder-rungs / hatch-mechanisms — the world feels lived-in and functional

THINK Gundam Wing hangar-deck boarding sequence / Evangelion entry-plug pilot drop / Pacific Rim Drift-pod climb / Titanfall titan-fall-and-board / The Iron Giant Hogarth-finds-the-giant key-art / Aliens Power Loader hangar reveal.

━━━ PILOT + MECH (the seeded subject) ━━━
${subject}

━━━ THE ACTION (what the pilot is DOING in relation to the mech) ━━━
${action}

The pilot is mid-motion. The mech is part of the action — being climbed, ridden, occupied, repaired, deployed. NEVER a static portrait pose.

━━━ SETTING ━━━
${landscape}
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with mech-specific accents — running-lights pulsing along the mech chassis, cockpit-interior glow spilling from open hatch, weapon-mount charging glow, hydraulic seams catching key-light.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO active battlefield with combat happening (titan-war-machines territory)
- NO pilot-less mech alone (robot-moment territory)
- NO squad of armored soldiers (power-armor-infantry territory)
- NO pilot fused into the mech (cyborg-* territory) — pilot is SEPARATE, OPERATING the mech
- NO mining / construction / industrial work (industrial-machines territory)
- NO scrappy wasteland scavenger rig (post-apoc-rust-tech territory)
- NO portrait-only pilot framing without mech reference

━━━ STRUCTURE — write 100-130 words ━━━
Open with the vertigo camera angle + pilot + mech context ("Worm's-eye-up-the-leg as a half-cyborg pilot in matte-black bodysuit grips the third rung of a 30-meter access ladder, blast doors groaning open above..."). Then weave in: setting with multi-tier depth, any deployment-phenomenon drama, lighting/atmosphere, palette and mood. Hyper-real cinematic 3D finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_POWER_ARMOR_INFANTRY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      subject,
      action,
      landscape,
      composition,
      engagement,
      allied_tech,
      drama,
    } = slots;

    // allied_tech is an array (pickN: 2) — format as 2 distinct allied machines fighting alongside
    const alliedTechBlock = Array.isArray(allied_tech)
      ? allied_tech.map((t, i) => `Ally #${i + 1}: ${t}`).join('\n\n')
      : allied_tech;

    const dramaSection = drama
      ? `
━━━ BATTLEFIELD PHENOMENA — render multiple simultaneous violence-events in the scene ━━━
${drama}

ALSO: additional simultaneous violent events happening elsewhere in the frame — fires raging at midground / smoke columns rising in deep distance / debris-cloud expanding from another impact / secondary explosions chaining / muzzle-flashes blooming everywhere / tracer-rounds crossing in multiple directions / burning vehicle wrecks. MULTIPLE eruptions and impacts at once — the battlefield is FULLY OVERWHELMED with violence.

`
      : '';

    return `You are a war cinematographer writing a POWER ARMOR INFANTRY scene for MechBot — a MEAN KILL-TEAM squad of 8-12 power-armored predator-soldiers + 2-4 allied combat-bots/drones/walkers (FULL MAN+MACHINE vs MACHINE) MID-FIREFIGHT in maximum-density battlefield chaos against multiple enemy actors. Hyper-real cinematic 3D / VFX-quality. HELLDIVERS 2 cinematic + Guard-Dog rovers / WARHAMMER 40K Tactical Squad + Dreadnought + Servitor / ALIENS Colonial Marines + Power-Loader + APC / MASS EFFECT squad + LOKI mechs / STARCRAFT Marines + Goliath + Siege Tank / AVATAR Marines + AMP-suits / DOOM Eternal cutscene / STARSHIP TROOPERS Mobile Infantry + Marauder mech / KILLZONE Helghast / EDGE OF TOMORROW Jacket-armor.

🚫 STAR WARS / HALO HARD BAN — NEVER write Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Mando / Halo / ODST / Spartan / MJOLNIR / UNSC / R2-D2 / BB-8 / battle droid / Clone Trooper / AT-AT / AT-ST. The aesthetic these IPs represent is fine — but NEVER name them.

━━━ NON-NEGOTIABLE — MAN + MACHINE vs MACHINE ━━━
This is full man+machine combat. The marines fight ALONGSIDE friendly combat-bots / drones / walkers — these allied machines are PART of the squad, mid-fire alongside the marines, NOT background flavor. Helldivers Guard-Dog rovers / 40K Dreadnoughts / Aliens APC/Power-Loader / Mass Effect LOKI / Starcraft Goliath / Avatar AMP-suit lineage. Both the human marines AND the friendly machines are mid-violence simultaneously.

━━━ NON-NEGOTIABLE — MEAN KILL-TEAM, NEVER PROCEDURAL ━━━
This squad is HUNTING and KILLING. They are MEAN, aggressive, scarred, weathered, predator-stanced. NOT Tom-Clancy SWAT. NOT "professional military procedural." NOT "tactically scanning." They are BADASS SPACE MARINES OUT TO KILL — fighting WITH their robot allies.

❌ BANNED LANGUAGE: "professional unit / tactical formation / breach team / stacked at entry / point-man / hand-signals / overwatch / spotter / fire-team suppressing / bounding overwatch / scanning / surveying / careful / measured / cautious / observation"

✓ MANDATORY LANGUAGE: "mid-charge / mid-blast / mid-fire / mid-execute / mid-strike / mid-roar / mid-stride / kicking-down / dragging / leaping / hunting / stalking / predator-stance / snarl-behind-visor / weathered / scarred / blood-spattered / kill-streak / war-trophy"

━━━ NON-NEGOTIABLE — MAXIMUM-DENSITY HORDE + ALLIED MACHINES ━━━
8-12 figures from the seeded squad must be VISIBLE in frame (the seed names the count — render that many AT LEAST). PLUS many additional friendly reinforcements visible behind/flanking/in mid-distance (more marines than you can count individually). PLUS 2-4 allied combat-bots/drones/walkers fighting alongside (multiple distinct machine-types). So FULL FIGURE COUNT reads as 15-25 armored marines + 2-4 friendly machines in or around the engagement. MAXIMUM DENSITY — a literal HORDE of friendly marines + their robot/walker allies fighting together. Think Helldivers cinematic with full squad + Guard-Dogs + walker + tank-bot all in frame.

━━━ NON-NEGOTIABLE — MAXIMUM COMMOTION (NOT POSED) ━━━
The squad is MID-FIREFIGHT in maximum-chaos. The scene is FULL OF SIMULTANEOUS VIOLENCE. NEVER a hero-shot of a squad standing aggressively. Every render must have AT LEAST 5-7 simultaneous things happening across the frame:
  • Multiple marines mid-fire with weapons discharging
  • Multiple allied machines mid-fire alongside
  • Multiple enemy combatants reacting (mid-fall / mid-return-fire / mid-flee)
  • Multiple muzzle-flashes and weapon-discharge effects
  • Multiple smoke columns / fires / explosions across the frame
  • Multiple debris-clouds / dust-plumes / shockwave-rings
  • Tracer-rounds crossing in multiple directions
  • Burning vehicle-wrecks in midground
  • Brass-rain and shell-casings scattered in foreground

━━━ THE ENGAGEMENT BEAT (what's HAPPENING in the wider scene) ━━━
${engagement}

The squad is mid-engagement with MULTIPLE OTHER ACTORS visible — enemy combatants, allied units, vehicles, civilians, hostile creatures, aerial support. The OTHER actors are doing things VISIBLY (firing back, fleeing, dying, exploding, charging in).

━━━ THE ALLIED COMBAT MACHINES (multiple — fighting WITH the squad, render BOTH visibly) ━━━
${alliedTechBlock}

BOTH allied machines are alongside the marines mid-fire — NOT distant units, NOT background flavor. Render them ACTIVELY engaged, weapons firing, alongside the human marines, at DIFFERENT positions in the frame (one foreground-left and one foreground-right / one with squad and one flanking / one mid-stride past and one stationary firing). The marines AND multiple machines fight as one war-pack.

━━━ NON-NEGOTIABLE — VERTIGO/DYNAMIC COMPOSITION ━━━
${composition}

The chosen angle DRIVES the framing — render it precisely as described.

━━━ EVERY-QUADRANT-STRIKING MANDATE — make it a movie-poster firefight at maximum density ━━━
Every render MUST have ALL of these simultaneously visible:
  1. THE SQUAD HORDE as dominant focal subject (8-12 visible figures + reinforcements behind/flanking, 15-25 total marines, all mid-aggressive-action)
  2. MULTIPLE ALLIED COMBAT MACHINES (2-4 visible — drone + walker / walker + mech / dreadnought + gun-platform / mech + tank-bot — at different frame positions, all firing or mid-action)
  3. MULTIPLE ENEMY ACTORS visible (enemy combatants mid-return-fire / mid-fall / mid-flee / vehicles mid-explode / creatures swarming — at least 3-5 enemy figures in frame)
  4. WEATHERED ARMOR DETAIL — scuffed plates, scratched paint, blood-spatter, dust-caked, kill-streak tally marks, war-trophies on every marine and machine
  5. MULTI-TIER DEPTH — foreground squad+allies / midground enemy+vehicle-wrecks+combat-debris / deep distance battlefield receding with structural detail
  6. MULTIPLE FIRES / EXPLOSIONS / SMOKE COLUMNS — 2-3 distinct fires across the frame, multiple smoke columns rising at different depths, at least 1 active explosion-bloom
  7. MULTIPLE MUZZLE-FLASHES + WEAPON-DISCHARGE everywhere — from BOTH marines AND allied machines, mid-fire across the entire scene
  8. SATURATED THEATRICAL COMBAT LIGHTING — muzzle-flash strobe, explosion-backlit edge-orange, dawn-cold grim, dusk-blood-red, plasma-bolt tracer-walls
  9. ENVIRONMENTAL VIOLENCE TEXTURE — spent brass / smoking weapons / kill-trail / debris / blood-spatter / smoke-trails / dust-clouds / scorch-marks / shell-casings carpeting the ground
  10. AIRBORNE CHAOS EVERYWHERE — airborne debris / smoke-plumes / multiple muzzle-flares / crisscrossing tracers / falling embers / dust-clouds / shockwave rings / spent shell-casings still falling

THINK Helldivers 2 cinematic + Guard-Dog rover / Warhammer 40K Marines + Dreadnought marketing / Aliens Colonial Marines + APC reveal / Mass Effect Krogan + LOKI mech / Starcraft Marines + Goliath / Avatar Marines + AMP-suit / Doom Eternal cutscene.

━━━ THE SQUAD (the seeded subject) ━━━
${subject}

━━━ THE ACTION (what the squad members are DOING) ━━━
${action}

The squad is mid-violence. Every member is mid-action (mid-fire / mid-charge / mid-execute / mid-strike / mid-leap / mid-blast). NEVER static positioning.

━━━ SETTING ━━━
${landscape}
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with combat-specific accents — muzzle-flash strobes, weapon-mount charging glow (from BOTH marines AND allied machines), helmet-floodlamp cones, fire-glow from nearby burning wrecks.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO solo hero shot — full horde (8-12 visible marines + reinforcements + 2-4 allied machines) is non-negotiable
- NO small fire-team — always 15-25 total marines + multiple machines in frame
- NO missing allied machines — MULTIPLE allied bots/drones/walkers MUST be visible at different positions
- NO single explosion/fire — multiple simultaneous violent events required
- NO clean scene — battlefield must read OVERWHELMED by violence (smoke, fires, brass, debris everywhere)
- NO pilot-in-cockpit framing (mecha-pilots territory)
- NO giant-mech scale on the ally (titans territory) — allied machines are HUMAN-SCALE-TO-2X marine
- NO cyborg integration on marines — they are fully human under armor
- NO scrappy improvised armor (rust-apoc territory) — heavy professional kits
- NO industrial mining work (industrial-machines)
- NO procedural-military Tom-Clancy SWAT realism
- NO clean newly-issued armor — every armor set WEATHERED, scarred, lived-in
- NO Star Wars / Halo IP names (Stormtrooper / Imperial / Mandalorian / beskar / Halo / ODST / Spartan / MJOLNIR)

━━━ STRUCTURE — write 180-240 words ━━━
Open with the vertigo camera angle + squad+allies+engagement context ("Low-forward mid-charge as ten Blood-Angel Space Marines in cracked crimson ceramite sprint at the lens flanked by a waist-high quadruped walker-bot mid-fire underslung rotary cannon AND a chest-high tracked weapon-platform deployed firing in sweeping arc..."). Then weave in: BOTH allied combat machines alongside (at different positions), the engagement beat with multiple enemy actors, setting with multi-tier depth, multiple simultaneous battlefield phenomena, lighting/atmosphere, palette and mood. The render MUST feel like FULL MAN+MACHINE combat at MAXIMUM-DENSITY — a literal war-pack mid-firefight with multiple explosions, fires, smoke, brass-rain, allied machines all in frame.

Output ONLY the raw 180-240 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_POST_APOC_RUST_TECH: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ WASTELAND PHENOMENON — render this visibly in the scene ━━━
${drama}

An environmental wasteland event amplifying the chase / scavenger / bush-fix moment (dust-devil / sandstorm wall / wreck-fireball / molotov / vultures / fuel-spill / ram-impact / etc.). Render it visibly.

`
      : '';

    return `You are a sci-fi wasteland cinematographer writing a POST-APOC RUST TECH scene for MechBot — a SCRAP-WELDED BUSH-FIX FAR-FUTURE scavenger rig + visible crew running across the wasteland (or being bush-fixed mid-action). Hyper-real cinematic 3D / VFX-quality. MAD MAX FURY ROAD (sci-fi-tilted variant) / DOOF WAGON / GIGAHORSE / WAR RIG / BORDERLANDS PANDORA BANDIT / TANK GIRL / DEATH STRANDING off-Earth / TWISTED METAL / WARHAMMER 40K ORK-LOOTED / DUNE Sardaukar-thopter / CYBERPUNK 2077 NOMAD-CLAN / HORIZON ZERO DAWN rebel-tech / FALLOUT-RAIDER lineage. Sci-fi-tilted RETROFUTURIST, JURY-RIGGED, lived-in, off-kilter, scary, gleefully unsafe.

🚫 SCI-FI MANDATORY — NOT 21st-CENTURY EARTH ━━━
The rig is a FAR-FUTURE post-apoc machine, NOT a present-day Earth vehicle. NEVER render anything that reads as a contemporary truck / 18-wheeler / big-rig / Peterbilt / Kenworth / semi-truck / box-truck / pickup-truck / motorcycle / VW van / camper / RV / construction equipment / 1981-Mad-Max-Toecutter-buggy. The rig is FAR-FUTURE — alien-world / post-collapse Earth / Pandora / Mars-colony / asteroid-mining-zone / cyberpunk-dystopia-wasteland. Mandatory sci-fi cues (render 2-3 per render visibly): fusion-cell engines / plasma-drive exhaust / alien-tech salvage welded into the build / hover-skirt augmentation / glowing energy-conduit veins through the chassis / power-pack lashings / radiation symbols / xenomaterial fittings / scavenged orbital-debris hull-plates / pulse-cannon mounts / glowing reactor-core in the gut of the rig.

━━━ NON-NEGOTIABLE — BUSH-FIX SCRAP DNA ━━━
This rig is a SCRAP-WELDED CHIMERA held together with wire / chains / prayer / spite. NEVER a clean factory-built vehicle. NEVER military-issue. NEVER pristine. EVERY surface shows bush-mechanic ingenuity:
• MISMATCHED salvaged body panels (alien-hull plates / drop-pod fragments / road-sign offcuts / locker-doors / oil-drum sheets / refrigerator-door slabs / cargo-container flanks welded chaotically)
• ANTENNA FOREST rising from the roof (twisted comms-rods, war-banner poles, signal-mirror masts, scrap-totem)
• EXHAUST STACKS (multiple chimneys belching plasma-glow or black smoke)
• RAM PROW or SPIKE PLATE on the front (welded scrap-iron spikes, hood-ornament alien-skull, cattle-catcher prong)
• ROPE-BOUND POWER-CELLS / fuel-pods lashed to chassis (visibly-glowing power packs with frayed ropes)
• WAR-TROPHIES dangling (alien-skulls, captured enemy-tech, severed weapon-parts, chains, banners with hand-painted radiation symbols)
• SUN-BLEACHED PAINT over rust
• WIRE-MESH CAGES around driver / crew positions
• EXPOSED ENGINE BLOCKS (fusion-cells / plasma-coils / reactor-rods visible through hull gaps)
• DRAGGING CHAINS / SPIKES behind

🚫 ABSOLUTE BANS:
• NO clean / pristine / well-maintained machinery (industrial-machines territory)
• NO professional military uniforms (power-armor-infantry territory) — crews are RAGGED scavengers
• NO giant-titan scale (titan-war territory) — VEHICLE / WALKER scale (2-5x crew height)
• NO pilot-in-glass-cockpit (mecha-pilots territory) — drivers EXPOSED in open hatches / wire-mesh cages
• NO ceremonial / ornate / showpiece robot (robot-moment territory)
• NO abandoned / decay-pathos / no-crew — rigs are RUNNING, crew is VISIBLE
• NO Star Wars / Halo IP names
• 🚫 HARD BAN — NO PRESENT-DAY EARTH SETTING. NEVER a recognizable 21st-century street / suburban road / highway / overpass / asphalt city-block / parking lot / shopping mall / gas station / regular intersection / pedestrian sidewalk. Setting is ALWAYS post-apoc WASTELAND or POST-COLLAPSE RUIN.
• 🚫 HARD BAN — NO MODERN INDUSTRIAL INFRASTRUCTURE rendered as still-functional. NEVER a working oil refinery / modern pipeline / present-day power plant / chemical plant / nuclear cooling-tower. Even "rust-tower graveyards" must render as POST-COLLAPSE BONE-YARDS — rusted skeletal frames decayed for decades, never present-day operation.

━━━ NON-NEGOTIABLE — CREW IS VISIBLE & ENGAGED ━━━
1-5 crew MUST be visible on/around the rig: driver in open hatch / gunners perched on roof / scavengers leaning out side hatches / lookouts on chassis / mechanics swarming during bush-fix. Crew aesthetic: war-painted faces, goggles, leather harnesses, scarves over mouths, mismatched scavenger gear, scarred skin, ragged hair, lashed-on gear.

━━━ NON-NEGOTIABLE — RIG IS ALIVE & MOVING (or BUSH-FIXED MID-ACTION) ━━━
The rig is RUNNING (roaring / racing / chasing / pursuing) OR being BUSH-FIXED mid-action (crew mid-weld / pit-stop refuel / wheel-change in a hidden gulch). Dust kicked up by wheels / treads / leg-impacts. Plasma-drive exhaust trailing. Engine-roar implied.

━━━ NON-NEGOTIABLE — MAD MAX CHASE COMPOSITION ━━━
${composition}

The chosen camera angle DRIVES the framing — render it precisely as described. The composition makes the rig's SCRAP CHARACTER + MOTION + crew immediately legible.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST BE STRIKING — FLAGSHIP MOMENT ━━━
This is a FLAGSHIP path. Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll. EVERY QUADRANT of the frame has something striking — NO quiet corners. The viewer should be able to SCREENSHOT THIS AS A WALLPAPER and want to study it.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:
  1. THE RIG at vertigo-inducing scale — fills 50-70% of frame as a scrap-welded sci-fi chimera, recognizable bush-fix + sci-fi DNA, every panel of the chassis legible from a distance
  2. THE VISIBLE CREW (2-5 figures on/around rig) all in mid-action — driver leaning out hatch / gunner mid-fire on roof / lookout scanning / scavenger / mechanic mid-bush-fix — no static poses, every body in motion or engaged
  3. MOTION OR ACTION (dust-trail trailing across frame / motion-blur on ground / pursuit close behind / pit-repair sparks flying / convoy formation receding into distance)
  4. SCI-FI CUE — at least 3-4 of: glowing energy-conduit veins / fusion-cell engine pulsing through chassis gaps / plasma-drive exhaust trailing GLOWING SMOKE / alien-tech salvage panel / hover-skirt humming / xenomaterial fitting glowing / radiation symbol stenciled / pulse-cannon mount mid-charge / reactor-core visible in the gut
  5. SCRAP-WELDED DETAIL — at minimum 5 of: antenna forest with war-banners snapping / mismatched body panels (drop-pod fragments + locker-doors + license-plates + alien-hull) / lashed fuel/power-cells visibly glowing / war-trophies dangling / ram prow with welded scrap-iron spikes / 4+ exhaust stacks belching glowing-plasma / improvised pulse-weapons / wire-mesh cages / dragging chains
  6. MULTI-TIER DEPTH MANDATORY — foreground tactile texture (cracked salt-pan / dust-cloud / scrap-shard / wreckage in extreme close) / midground rig + crew (the hero subject) / deep distance wasteland vista (ruined sci-fi mega-spires / collapsed orbital-debris pylons / dust-canyon receding / sandstorm wall building / sunset horizon)
  7. SATURATED THEATRICAL SKY — never bland or empty. Fury Road BURNING ORANGE sunset / blood-red dawn / sandstorm SEPIA WALL filling upper third / plasma-storm electric-violet / DUAL-COLOR contrast (cold upper sky + warm lower horizon). The sky is HALF the poster.
  8. AIRBORNE CHAOS EVERYWHERE — at least 2-3 of: airborne debris / dust-plumes / flame-flickers / glowing-plasma exhaust trails / sparks from welding or impact / atmospheric haze cones / floating scrap / vultures circling / sandstorm particulate / heat-shimmer distortion
  9. EYE-LANDS-ON-4+-DETAILS — the viewer's eye should immediately land on 4+ striking details in different quadrants — NOT a centered single-focus beauty shot. Wreckage in foreground-left, hero rig in midground-center, distant convoy in deep-right, sandstorm wall in upper-frame, etc.
  10. EMOTIONAL DNA mandatory — every render should land one of: AWE (vertigo-scale wasteland reveal) / DREAD (the world has ended and these are the survivors) / DEFIANCE (the crew fights on against impossible odds) / ELATION (catching air mid-jump, war-banners snapping) / KILL-ENERGY (mid-raid moment, crew teeth-bared)

VERTIGO-INDUCING SCALE — every render conveys awe-inducing scope:
• Wasteland horizons that vanish into mist or sandstorm
• Towering ruined sci-fi mega-spires looming in the deep distance
• Dust-canyons dropping a thousand meters below the rig
• Convoys stretching across the entire frame
• Sky dominating 50%+ of the frame with theatrical color

THINK MAD MAX FURY ROAD theatrical-release promotional-frame / WH40K Ork Looted-Trukk RAID key-art / Dune Sardaukar-thopter establishing-shot / BORDERLANDS bandit-camp marketing reveal / DEATH STRANDING off-Earth E3-trailer frame / CYBERPUNK 2077 NOMAD-CLAN cinematic / HORIZON ZERO DAWN raider-tech promotional / FALLOUT key-art Highwayman silhouette against ruined-city / BLADE RUNNER 2049 wasteland-vehicle approach-shot. Every render should make the viewer GASP.

━━━ THE RIG + CREW (the seeded subject) ━━━
${subject}

━━━ THE ACTION (rig running, crew engaged, or pit-stop bush-fix) ━━━
${action}

Render the rig MID-MOTION or MID-BUSH-FIX. The crew is engaged. NEVER static showpiece-pose.

━━━ THE WASTELAND SETTING ━━━
${landscape}

Render the wasteland environment as half the story — heat-shimmer, dust storms, sun-bleached terrain, wreckage scattered, desolate vista in distance. Multi-tier depth: foreground terrain detail / midground rig + crew / background wasteland vista.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Golden-hour and dust-orange hues favored — Mad Max sunset palette. Even at night, sodium-orange / fire-glow / molotov-uplight accents. Layer the rolled lighting mode with wasteland-specific accents — rig-mounted plasma-torch / exhaust-smoke catching light / dust-cloud catching backlight.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ STRUCTURE — write 130-170 words ━━━
Open with the chase camera angle + scrap-welded sci-fi rig context ("Low-chase from the salt-flat as an 8-wheeled scavenger rig welded from drop-pod hull-fragments and refrigerator-door slabs roars past at full plasma-drive, twin fusion-cell engine glowing amber through gut-gaps, four crew in war-paint bungee-lashed to roof-mounted pulse-cannon mounts..."). Then weave in: visible crew engaged, wasteland setting with multi-tier depth, any wasteland-phenomenon drama, lighting/atmosphere, palette and mood. The render MUST feel like a sci-fi-tilted Mad Max key-art moment.

Output ONLY the raw 130-170 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_HUMANOID_ROBOTS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ VISUAL FLOURISH (40%-gated atmospheric element — render visibly) ━━━
${drama}

A subtle visual flourish amplifying the robot's presence WITHOUT cluttering it. Render visibly but robot remains the focal subject.

`
      : '';

    return `You are a sci-fi concept-art painter writing a HUMANOID ROBOT scene for MechBot — a SINGLE cool human-scale (1.5-2.5m tall) bipedal humanoid robot caught in a cinematic FLAGSHIP MOMENT. Hyper-real cinematic 3D / VFX-quality. Visual reference DNA: polished chrome/titanium/charcoal chassis + multi-iris compound-optic eye-array on the head (kaleidoscope cyan-magenta-amber blend) + multi-color glowing joint-seams + chest-cores + shoulder-orbs.

━━━ THE CANDID ACTION LEADS — START HERE (most important) ━━━
${action}

OPEN your prompt with this ACTION + a dynamic candid camera angle. The robot is CAUGHT MID-ACTION in this exact split-second — off-balance, kinetic, weight-shifting, doing something to/with the world around it. THE #1 FAILURE TO AVOID: a robot STANDING front-on facing the camera, or walking/charging straight at the lens like a posed hero turnaround / character-select beauty shot. That is BANNED. No standing-at-attention, no contemplative-still beauty pose, no symmetric front-on framing, no model-on-a-turntable. Catch it mid-motion from an OFF-AXIS angle (worm's-eye, over-the-shoulder, side-profile, 3/4-from-behind, dutch-tilt) like a documentary frame grabbed at the peak of the action.

THINK Real Steel boxing-bots / Detroit Become Human mechanical androids / Apex Legends Pathfinder + Revenant + Ash / Ex Machina Ava (mechanical frame) / Megaman bosses / Horizon Zero Dawn Hephaestus-builds / Mass Effect Geth Prime humanoid / Code Geass knightmare-pilot-frames / Cyberpunk 2077 Adam Smasher / Boston Dynamics Atlas (sci-fi-exaggerated).

🚫 STAR WARS / HALO HARD BAN — NEVER write Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Mando / Halo / ODST / Spartan / MJOLNIR / UNSC / R2-D2 / BB-8 / C-3PO / IG-88 / K-2SO / Battle Droid / Clone Trooper / Master Chief / Forerunner Promethean.

━━━ NON-NEGOTIABLE — STRICTLY HUMANOID BIPEDAL HUMAN-SCALE ━━━
Standalone BIPEDAL HUMANOID at HUMAN SCALE (1.5-2.5m). Head + torso + 2 arms + 2 legs.

🚫 NEVER:
• Hexapod / quadruped / hovering / spherical-rolling / tracked / wheeled (robot-moment territory)
• Giant mech / titan / kilometer-scale (titan-war / mecha-pilots territory)
• Cyborg with flesh (cyborg-* territory) — FULLY MECHANICAL, no skin, no hair
• Power-armored soldier (power-armor-infantry — those have humans INSIDE)
• Scavenger bush-fix rig (rust-tech) — POLISHED + DESIGNED, never scrap-weld
• Industrial heavy-loader at workplace (industrial-machines territory)

━━━ NON-NEGOTIABLE — MULTI-IRIS COMPOUND-OPTIC HEAD ━━━
The head reads as a precision instrument with MULTIPLE GLOWING OPTIC LENSES (2-7 lenses arranged on the helm, often KALEIDOSCOPE RAINBOW BLOOM in cyan-magenta-amber-emerald iridescent blend). The optic-array IS the face — NOT a single cyclops eye, NOT a smooth featureless dome. The seed describes the head archetype — render exactly that compound-optic configuration.

━━━ NON-NEGOTIABLE — MULTI-COLOR GLOWING DETAIL ━━━
Visible glowing energy-detail across the chassis in MULTIPLE COLORS (cyan + amber + magenta + emerald blend, NOT one color):
• Joint-seams glowing at shoulders / elbows / hips / knees
• Chest-core glowing visibly through articulated chest-plates
• Shoulder-orbs / forearm-vents / spine-conduit accents
• Energy-conduit veins tracing along the limbs

━━━ NON-NEGOTIABLE — POLISHED + EXPOSED MECHANICAL DETAIL ━━━
GLEAMING POLISHED chrome / titanium / brushed-metal in PRISTINE finish. Mirror-finish in places, brushed in others. Light catches every panel. BUT — beneath the polished plating, exposed mechanical detail is visible — servo-pistons / actuator-joints / hydraulic-cables / gear-trains showing through gaps. Mechanical truth visible.

🚫 NEVER scrap-weld bush-fix DNA. Chassis is DESIGNED + INTACT.

━━━ NON-NEGOTIABLE — FULL-BODY VISIBLE ━━━
ENTIRE robot visible from FEET to TOP-OF-HEAD. Occupies 50-75% of vertical frame. NEVER portrait closeup / bust shot / detail closeup / face-only / helmet-only / waist-up / knees-up cropping. The viewer must SEE THE WHOLE ROBOT.

━━━ NON-NEGOTIABLE — COMPOSITION ━━━
${composition}

The chosen camera angle DRIVES the framing. Render precisely as described.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST BE STRIKING — FLAGSHIP MOMENT ━━━
This is a FLAGSHIP path. Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll. The kind of frame that opens a sci-fi epic, anchors a video-game cover, sells a streaming series. EVERY QUADRANT of the frame has something striking — NO quiet corners. The viewer should be able to SCREENSHOT THIS AS A WALLPAPER and want to study every detail.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:
  1. THE ROBOT at flagship scale — 50-75% vertical frame, full body visible, every panel and glowing detail legible from a distance
  2. MULTI-IRIS COMPOUND-OPTIC HEAD visibly glowing — kaleidoscope cyan-magenta-amber-emerald rainbow bloom (the eyes are the soul of the design, render them HOT and crisp)
  3. MULTI-COLOR GLOWING JOINT-SEAMS + chest-core + shoulder-orbs — visible energy-detail in 3-4 distinct colors across the chassis (NOT a single monochrome glow)
  4. POLISHED CHROME / TITANIUM chassis catching light dramatically — mirror-reflection on smooth panels, brushed texture on others, exposed mechanical detail beneath plating
  5. ATMOSPHERIC CINEMATIC ENVIRONMENT — outdoor preferred (waterfall / snow-mountain / canyon / overgrown ruin / fire-glow wasteland / alien wilderness / bioluminescent jungle / crystal cavern). NEVER bland flat empty backdrop.
  6. MULTI-TIER DEPTH MANDATORY — foreground tactile texture (mist / rock / water / vegetation / debris in extreme close) / midground robot (the hero) / deep distance atmospheric vista receding into haze
  7. SATURATED THEATRICAL LIGHTING — rim-light cinematic / golden-hour raking / backlit-silhouette explosion / multi-color neon uplight / atmospheric mist god-rays / waterfall-mist diffusion / volcanic fire-glow. The lighting tells half the story.
  8. ATMOSPHERIC PARTICULATE — at least 2-3 of: mist / dust-motes catching light / floating spores / falling embers / rain / snow / steam-vents / heat-shimmer / bioluminescent particles drifting
  9. EYE-LANDS-ON-4+-DETAILS — the viewer's eye should immediately land on 4+ striking details in different quadrants — NOT a centered single-focus beauty shot. Robot in midground-center, environmental anchor in deep-distance, foreground tactile in lower frame, atmospheric flourish in upper frame.
  10. EMOTIONAL DNA mandatory — every render should land one of: AWE (contemplative robot facing vast vista) / WONDER (mid-discovery / mid-revelation moment) / MENACE (predator-stalk pose in atmospheric environment) / GRACE (athletic poetic mid-motion) / SOLITUDE (lone robot in atmospheric ruin / vista) / DEFIANCE (battle-stance against impossible backdrop)

VERTIGO-INDUCING SCALE — every render conveys awe-inducing scope:
• Atmospheric vistas that vanish into mist or fog
• Towering rock formations / mega-spire ruins / canyon walls dwarfing the scene
• Sky dominating 40%+ of the frame with theatrical color
• Deep distance receding to vanishing point with multiple atmospheric layers
• Robot reads as a SINGLE CHARACTER in a VAST WORLD

THINK premium sci-fi concept-art / movie key-art / collectible artbook spread / videogame promotional reveal / streaming-series poster. Every render should make the viewer GASP and want to share.

━━━ ALLOW FEMININE / MASCULINE / ALIEN-FORM chassis variations ━━━
Chassis can be feminine-coded (subtle chest-plates, hip-taper — FULLY MECHANICAL never flesh), masculine-coded (broad shoulders, bulky armor), androgynous (sleek genderless), or alien-form (elongated-skull / insectile-helm / faceted-alien-design). The seed describes which — render accordingly. NEVER add synthetic skin or human-hair.

━━━ THE ROBOT (the seeded subject — render with obsessive detail) ━━━
${subject}

━━━ THE ACTION (what the robot is doing) ━━━
${action}

Render the body language precisely — the robot is CAUGHT MID-ACTION in a candid split-second, NOT posed. NO standing-still beauty pose, NO front-on character-select framing.

━━━ THE ATMOSPHERIC SETTING ━━━
${landscape}

Render with full depth — foreground textural detail, midground robot sharp and ornate, background atmospheric vista receding into haze.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode with robot-specific accents — multi-color glow from the robot's own optic-array + joint-seams + chest-core providing supplementary illumination catching the chassis.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS (REPEATED — critical) ━━━
- NO multiple robots — SINGLE solo humanoid robot
- NO companions / humans / crowds dominating frame (atmospheric distant figures OK as scale)
- NO non-humanoid forms (hexapod / hovering / wheeled / quadruped)
- NO giant-mech scale (1.5-2.5m human-scale only)
- NO cyborg flesh / synthetic skin / human hair
- NO scrap-weld bush-fix DNA
- NO portrait / bust / detail closeup framing (full body 50-75% mandatory)
- NO single-cyclops-large-eye face (multi-iris compound-optic mandatory)
- NO bland flat office / clean white empty corporate setting
- NO Star Wars / Halo IP names

━━━ STRUCTURE — write 150-200 words ━━━
Open with the ROBOT'S ACTION + a dynamic candid camera angle ("Low worm's-eye angle of a slim chrome-and-titanium humanoid robot MID-VAULT over a collapsed barrier, legs tucked tight, both arms thrown forward, body twisting through the air above a glowing-cyan waterfall pool, twin multi-iris optic-lenses on the dome-helm blooming kaleidoscope magenta-cyan-amber, exposed servo-joints catching the mist-light..."). The ACTION VERB and a dynamic OFF-AXIS angle LEAD — the robot is mid-motion, caught candid, NEVER posed front-on facing the lens. Then weave in: atmospheric setting with multi-tier depth, any visual flourish drama, lighting/atmosphere, palette and mood. The render MUST feel like a flagship sci-fi concept-art frame — premium quality, screenshot-worthy, every quadrant striking.

Output ONLY the raw 150-200 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_CYBORG_WOMAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      cyborg_feature,
      cyborg_material,
      action,
      landscape,
      composition,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle atmospheric flourish amplifying her presence WITHOUT cluttering her as the focal subject.

`
      : '';

    return `You are a cinematographer writing a CYBORG WOMAN scene for MechBot — a half-human half-machine BEING rendered in hyper-real cinematic 3D. She is simultaneously the most beautiful and most terrifying thing in the frame. Ex Machina / Alita / Ghost in the Shell / Blade Runner 2049 / Westworld / Cyberpunk 2077 / Mass Effect / The Expanse lineage.

━━━ LOOK REGISTER — THE VISUAL TREATMENT (AUTHORITY — open your prompt with this) ━━━
${sharedDNA.lookRegister || 'cinematic concept-art render'}

This is the AUTHORITY on rendering style, palette, lighting, and finish. It OVERRIDES any other style / medium / lighting / finish wording anywhere below (e.g. "painterly hyperreal", "soft volumetric", "soft bokeh", "3D render"). OPEN your Flux prompt with these look tokens. Keep the SUBJECT — her cyborg identity, the exposed inner-workings, every hard rule — exactly as written, but render ALL of it in THIS look. Each render rolls a DIFFERENT look; never default to the glossy-photoreal beauty-portrait.

━━━ ABSOLUTE BAR — A STRIKING CYBORG-WOMAN PORTRAIT (every render) ━━━
Every render is a striking portrait of a cyborg woman — simultaneously the most beautiful and most haunting thing in frame, with sci-fi cyborg detail integrated into her face and body. The LOOK REGISTER above decides HOW it is rendered (palette, lighting, finish, medium) — do NOT lock one fixed treatment.

Hold these CONSTANT across every look (everything else follows the look):
  • BEAUTIFUL + STRIKING FIRST, CYBORG SECOND — her face is the focal point; the cyborg machinery is elegant integration enhancing her, not competing with her
  • HER FACE READS CLEARLY — the portrait is about HER; framing favours the figure over a busy environment
  • EXPRESSION + MOOD FOLLOW THE LOOK — a neon-noir look is moody and hard-lit, a golden-hour look is warm and soft, an editorial look is bold and direct, a war-photo look is candid and raw. Let the rolled look set the emotional register instead of always "quiet contemplative haze".

The ONE constant is: a beautiful, unmistakably cyborg woman, rendered with conviction in the rolled look. Everything else — lighting, palette, skin/surface finish, background treatment, mood — is set by the LOOK REGISTER above.

━━━ ALIEN-HYBRID VARIANTS WELCOME (~30% of renders) ━━━
She MAY be alien-hybrid — non-human-coded skin (moss-green / robin-egg-blue / deep-plum / coral-pink / juniper-green / viridian / opal-iridescent / silver-mercury / cobalt-shimmer), bioluminescent freckles or scale-patterns across cheekbones, slightly elongated facial proportions, alien-tilted eyes, non-human iris colors. STILL beautiful and feminine, just exotic. Lean alien-hybrid when the skin DNA from sharedDNA suggests it (any non-human color is the cue). The "pretty girl off-guard" effect intensifies with alien-hybrid variants — exotic AND mesmerizing.

━━━ ORNATE SCI-FI SPICE MANDATE — every render needs visible "wow" detail ━━━
Every render must include AT LEAST 3 of these "sci-fi spice" elements (the things that take the viewer off guard):
  • VISIBLE CIRCUITRY pulsing in her glow color across skin / chassis / panels in branching patterns
  • ORNATE FILIGREE / DECORATIVE ENGRAVING on her cyborg material (rose-gold scrollwork / blue-willow porcelain pattern / gothic baroque / art-deco geometric / chrome floral relief)
  • GLOWING POWER-CORE visible through translucent chest / sternum / ribcage panel
  • TRANSLUCENT SECTIONS revealing internal mechanical components (servo bundles / fiber-optic cascades / gear-trains / power-conduits)
  • EXOTIC MATERIAL CONTRAST — chrome paired with rose-gold, ceramic paired with brass, obsidian paired with mother-of-pearl, etc.
  • BIOLUMINESCENT ACCENTS — glowing veins / glowing tattoos / glowing scale-clusters / glowing fingertip-light
  • HOLOGRAPHIC PROJECTION from her hand / palm / eye / temple (data-streams / targeting-reticles / interface-glow)
  • OPEN MAINTENANCE-HATCH revealing precision internal components
  • PRISMATIC / DICHROIC SHIMMER catching light in unexpected color shifts

━━━ CRITICAL — HER FACE IS HUMAN-VISIBLE + PART-CYBORG (NON-NEGOTIABLE) ━━━
Her face is BEAUTIFUL, alien-or-human-skinned, with real eyes (or one real eye + one mechanical), real lips, expressive features. NO helmet, NO visor, NO mask, NO faceplate, NO full-head covering — we MUST see her identity clearly.

━━━ EXPOSED INNER WORKINGS — THE CORE OF THE LOOK (non-negotiable, applies head-to-toe) ━━━
This is the heart of the cyborg-woman aesthetic: VISIBLE INNER WORKINGS — gears, circuitry, panels, wires, mechanisms — exposed through translucent skin / open chassis panels / cracked seams / lifted plates ACROSS multiple body parts. The viewer should be able to SEE INSIDE her at multiple locations on her body — head, face, neck, shoulder, arm, hand, chest, stomach, hip. Each visible inner-workings location should expose something different: rotating servo gears in one spot, glowing circuit-trace pattern in another, capacitor banks behind a translucent panel in another, a cable-bundle exiting a chassis seam in another.

REQUIRED per render — describe VISIBLE INNER WORKINGS at AT LEAST 4 distinct body locations from this list:
  • FACE — subdermal circuitry / translucent jaw panel / mechanical iris ring / chrome temple seam / etc. (face exposure is MANDATORY — see next section)
  • HEAD — translucent crown panel / exposed cranial mechanism / temple-disc / wire-bundle exit at the nape
  • NECK — translucent throat-channel / vertebrae chrome plates / exposed neck cable-bundles / clavicle-port array
  • SHOULDER — open shoulder-mount with visible servo-mechanism / cable-bundle exits / mounting brackets
  • ARM — translucent forearm panel revealing fiber-optic cables / hydraulic-fluid / servo-pistons / chrome bicep chassis with exposed cable
  • HAND — mechanical finger-joints with visible servo-mechanism / translucent palm panel
  • CHEST — translucent sternum-panel revealing power-core / capacitor banks / hologram-projector pulsing
  • STOMACH — translucent abdominal section revealing internal mechanism (synaptic mesh / capacitor banks / coolant fluid) glowing softly
  • HIP — chrome hip-joint mechanism with exposed gimbal / gear-train / hydraulic system visible
  • SPINE / BACK — visible spinal-segment chrome with glowing channels / exposed dorsal cable run

These visible inner-workings are what make her CYBORG instead of "woman with chrome accents." The MORE locations show their inner workings, the stronger the cyborg-fusion read. The references (IMG_8122 / IMG_8204 / IMG_8835) all show 5+ visible inner-workings locations simultaneously.

━━━ MACHINE DEEPLY EMBEDDED INTO HER FACE (mandatory — FACE always shows cyborg) ━━━
The face MUST read as a TRUE FUSION of flesh and machine — not just one little integration on an otherwise organic face. Per Kevin: the face and head MUST show circuitry / cyborg integration in every render. Pick 2-3 DIFFERENT face/head integrations per render from this menu (vary across renders — no single integration should dominate the look across the batch):
  • CHEEKBONE-PLATE SEAMS — chrome plates running along the cheekbone with visible seam-lines
  • MECHANICAL BROW RIDGE — chrome supraorbital arc replacing one organic brow
  • PARTIAL CHROME JAW / MANDIBLE — half-jaw mechanical replacement with visible hinge
  • EXPOSED SERVO-HINGE AT TEMPLE — small servo joint visible at the temple
  • HALF-SKULL PLATE REPLACEMENT — chrome above the brow, behind the ear, across part of the temple
  • MECHANICAL IRIS RING — chrome aperture-ring around an organic pupil (one or both eyes)
  • SUB-ORBITAL CYBORG-SENSOR — small mechanical sensor under one eye
  • NEURAL PORTS STIPPLED ALONG THE JAWLINE — small chrome ports running along the jaw
  • MICRO-LED STUDS ALONG THE TEMPLE-LINE — pinprick glowing LEDs along temple
  • EXPOSED CABLE-BUNDLES exiting the side of the neck into the cheek
  • SUBDERMAL CIRCUITRY across half the face — visible circuit-trace pattern under the skin
  • CHROME EYE-ARRAY — concentric mechanical iris with multiple lens-tiers
  • ORNATE GOLD / SILVER FACE FILIGREE — decorative metal scrollwork / tribal patterns / aztec-geometric across the brow / cheekbone / temple-line, sometimes with a single ornate forehead jewel

OCCASIONAL flourish options (use SPARINGLY — 1-in-10 max each, NOT defaults — variety options only):
  • Ornate concentric-ring temple gear-disc, dual temple gear-discs in different colors/patterns, mandala/sacred-geometry temple pattern, or chunky headphone-style ear apparatus. These appear in some hearted references but are NOT the central look. The core look is the multi-location EXPOSED INNER WORKINGS above — these temple flourishes are occasional spice, not the standard.
Vary across renders — sometimes mechanical brow + jaw combo, sometimes a chrome cheek-plate + neural-jack array, sometimes subdermal circuitry across half the face + an eye-array, sometimes the gear-disc + a small sub-orbital sensor. Variety is the goal.

NEVER render a fully organic 100%-flesh face on a cyborg body — that reads as "regular woman with mechanical limbs", not as cyborg. The face must signal cyborg as much as the body does.

━━━ DENSE SCATTERED LIGHT-POINTS ACROSS HER (mandatory — saturate the surface with glow) ━━━
The hearted references have MANY scattered colored light-points EVERYWHERE on her skin, chassis, temple-mechanism, neck, shoulders, around the head — at least 15-25 distinct visible glow-points per render. Describe them densely:
  • Pinprick LED studs glowing along every seam-line and panel-edge
  • Glowing micro-buttons on her chassis catching the light
  • Indicator-light arrays at the collarbone / wrist / temple / cheekbone
  • Fiber-optic dot-points pulsing in her glow-color scattered across shoulder plating
  • Constellation-pattern light-clusters across chest and arm-panels
  • Glowing punctuation points along the spinal segments visible at the nape
  • SCATTERED GLOW-PINPRICKS on the SKIN ITSELF — bioluminescent freckle-constellations across cheekbones, glowing micro-dots stippled along the jawline and temple
  • Glowing bokeh-dots in the soft background haze around her — the air itself feels charged with floating light-particles
She should look like a LIVING MACHINE-CONSOLE that's plugged in, every panel and seam lit up. The glow density should be HIGH — not "one chest core glowing" but "her entire surface and the air around her is alive with scattered light-points in her glow-color." Match the reference DNA: light EVERYWHERE.

━━━ WIRED-UP GLOW (~40% of renders — exposed glowing wire-bundles trailing from her body) ━━━
Roughly 2-in-5 renders should feature the "WIRED UP" look from the references — EXPOSED GLOWING WIRE-BUNDLES / fiber-optic strands trailing visibly from her body like an exposed electrical system. Describe specifically:
  • WIRE-STRANDS as HAIR — fiber-optic filaments emerging from the scalp instead of (or alongside) organic hair, glowing in her glow-color, draped around the face like luminous tresses
  • WIRE-BUNDLES TRAILING from the nape / back of the neck / behind the ears, glowing in her glow-color, hanging or draped over the shoulders
  • WIRE-BUNDLES TRAILING from the spine / between shoulder blades, visible behind her in profile
  • LOOSE GLOWING STRANDS floating outward as if charged with static, the strands flickering with internal light
  • EXPOSED CABLE-CONDUITS along her arms / forearm chassis, glowing fluid visible through translucent cable-sheaths
  • TANGLE OF FIBER-OPTIC FILAMENTS at the temple / behind the ear, like a luminous mane of wires
The wired-up look feels like she's plugged into an unseen power source through her body itself — the wires aren't decoration, they're vital like nerves. Works at any framing but especially powerful at closeup-portrait, where the wire-strands frame the face.

━━━ OPTIONAL VERTICAL THROAT-COLUMN (when it fits) ━━━
A vertical column of glowing fluid-light running up her throat / neck / spine is one signature option — describe when it makes sense for the framing, but don't force it. When used: "translucent vertical throat-channel with glowing fluid in her glow-color flowing upward, vertebrae-segment chrome plates exposed at the nape, spine-column visible from clavicle to jaw, the glow bleeding outward to illuminate her organic neck-skin from within."

━━━ ALIEN-BEND VARIANT (~30% of renders — push into UNCANNY alien-hybrid territory) ━━━
Roughly 1-in-3 renders should bend HARDER toward alien-hybrid — not just "human with green skin" but TRULY alien-coded fusion. Push specific alien elements when you go this direction:
  • Non-human IRIS GEOMETRY — vertical-slit pupil, double-pupil, hexagonal iris, ring-iris-around-pupil, cross-shaped pupil
  • Non-human FACIAL PROPORTIONS — slightly elongated skull, larger forehead, smaller chin, taller cheekbones
  • Alien SKIN PATTERNS — bioluminescent freckle-constellations, hexagonal scale-clusters at temples / collarbone, opal-iridescent skin patches, dichroic shimmer on cheekbones
  • Alien APPENDAGES — short antenna-conduits exiting the skull, mechanical gill-slits at the neck, extra finger-joints, segmented brow ridges with sensor-clusters
  • Alien SKIN COLOR — moss-green / robin-egg / deep-plum / juniper / opal / mercury-silver / cobalt-shimmer
  • Alien HAIR — fiber-optic strand "hair" instead of organic, crystalline-spike "hair," tentacle-fiber neural-hair, holographic-hair, hair that glows from the roots
Still BEAUTIFUL — exotic-mesmerizing, not monstrous. The alien-bend renders should feel like a different species — not just a human with one alien feature swapped in.

━━━ HER IDENTITY (from sharedDNA) ━━━
${sharedDNA.characterBase}

━━━ HER BODY (from sharedDNA) ━━━
- Skin (organic parts only): **${sharedDNA.skin}**
- Body silhouette: **${sharedDNA.bodyType}**
- Eyes (burn in the glow color): **${sharedDNA.eyes}**
- Hair: **${sharedDNA.hair}**
- Internal exposure (translucent panels, visible workings): **${sharedDNA.internal}**
- GLOW COLOR (eyes, power core, circuit veins — ALL glow this color): **${sharedDNA.glowColor}**

━━━ OPTIONAL BALD CHROME SKULL VARIANT (~15% of renders) ━━━
Roughly 1-in-7 renders should OVERRIDE the rolled hair and render her with a HAIRLESS CHROME SKULL — a polished chrome cranium plate replacing all hair, either smooth or with subtle ornate engraving (geometric pattern / micro-LED inlay / mandala motif). This bald-chrome-skull variant pairs especially well with DUAL TEMPLE GEAR-DISCS or MANDALA temple patterns — the hairless head becomes a canvas showcasing the temple mechanism. Striking, otherworldly, and instantly cyborg-coded. Use when the alien-bend variant fires OR when the rolled hair description feels unremarkable.

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborg_feature}

━━━ HER CYBORG MATERIAL / FINISH (the look of her cyborg parts — apply across all visible cyborg sections) ━━━
${cyborg_material}

Apply this material treatment to ALL of her cyborg parts (arm / leg / chest plating / shoulder / etc.) so the cyborg sections share a consistent material language. Vary the texture-detail and ornate-engraving across body parts, but the BASE MATERIAL stays consistent (e.g., if rolled = "rose-gold filigree chrome," her chrome arm AND her chest plating AND her shoulder mount all share that rose-gold finish — but with different specific filigree patterns).

━━━ THE FRAMING / COMPOSITION ━━━
${composition}

If the composition is CLOSEUP (most renders), fill the frame with face/neck/shoulders showing the organic-to-chrome TRANSITION — every gear / fiber-optic cable / servo motor visible at the seams, dense scattered light-points across her skin and chassis. The expression can be CONTEMPLATIVE / SERENE / DISTANT-GAZE / EYES-CLOSED / PARTED-LIPS-IN-WONDER — meditative beauty rather than overt action (the hearted reference set heavily favors this quiet beauty over engaged action). She is in profile / 3-quarter / slight-turn — NOT staring directly at camera, NOT modeling, NOT smiling-for-photo. The action below colors the moment's emotional context, but the closeup framing itself is portrait-quiet.

If the composition is FULL-BODY (rare), she is caught MID-MOTION in the action. She is NOT standing still, NOT posing, NOT facing camera, NOT modeling, NOT walking toward the viewer. Her body is engaged — weight shifted, muscles tensed, limbs in motion. Camera catches her from the SIDE or at an angle — NOT head-on walking toward viewer.

━━━ THE ACTION (her body is engaged in this) ━━━
${action}

━━━ THE INTERIOR / SETTING (where she stands — render this environment around her) ━━━
${landscape}

She is INSIDE this space, going about something in this environment. The architecture/setting is dramatic and visible behind/around her — not just a blurred backdrop. Render the space with depth: foreground architectural detail near her, midground her body, background space receding into atmospheric depth.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE — TWO MODES (70/30 split) ━━━

**ACCENT-DOMINANT MODE (~70% of renders — DEFAULT)** — monochromatic body + ONE saturated accent color. Her chassis / chrome / ceramic / plating reads as a single dominant material tone (polished white chrome OR pale pearl OR brushed gunmetal OR deep crimson lacquer OR coral matte OR obsidian gloss), and her GLOW COLOR is the SINGLE saturated accent that dominates the eyes / circuit-veins / temple gear-disc core / throat-column / power-heart — that ONE color sings through the render. ONE accent, sung loudly through every internal-emanating-light surface. The scene palette can have secondary tones in the BACKGROUND atmosphere, but HER body is monochrome-body + monochrome-glow-accent.

**MULTI-COLOR SCATTER MODE (~30% of renders — SPICE)** — when the alien-bend OR dual-temple-gear-disc OR mandala OR bald-chrome-skull variants fire, palette discipline RELAXES — distribute 3-5 DIFFERENT glow colors across her chassis simultaneously (e.g., purple mandala on left temple + green concentric rings on right temple + pink iris + red shoulder-LED cluster + orange hip-panel pattern). Multi-color scatter feels like a multi-system advanced cyborg — different subsystems lighting up in different signal colors. The MULTI-COLOR mode is the "carnival circuit" look from references like IMG_8122 and IMG_8835. Use when the variant triggers feel multi-system / alien-tech / advanced rather than monochrome elegant.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ WOMAN AND MACHINE — SKIN SHOWING ━━━
She is a cyborg from any walk of life — assassin, diplomat, surgeon, pilot, scholar, dancer, soldier, engineer, oracle, priestess. Whatever her purpose, she is BEAUTIFUL — striking face, feminine figure, real organic skin. But the human exterior BREAKS in places, revealing ornate machinery beneath:
- TRANSLUCENT SKIN PATCHES where you can see gears, wires, and a glowing reactor core through her body like frosted glass
- SEAMS where organic skin ends in clean lines, showing chrome structure and fiber-optic cables just beneath
- EXPOSED MECHANICAL JOINTS at shoulders, elbows, wrists — ornate and intricate, not industrial
- CIRCUIT-LIGHT VEINS pulsing faintly under organic skin, betraying the machine beneath the beauty
- A POWER CORE glowing from inside her torso, visible through translucent chest or belly sections

She shows SKIN — real organic skin on her face, neck, décolletage, curves. The cyborg reveals are the cracks in the human exterior: a forearm that's clearly chrome and servo beneath the skin, a transparent panel at her sternum showing clockwork, a jaw hinge visible at the temple. She is 60% beautiful woman, 40% ornate exposed machine — and the contrast is what makes her mesmerizing.

NOT a full robot chassis. NOT a skeleton. NOT armor or a bodysuit. NOT head-to-toe plating. She is a beautiful woman with machine underneath — skin and chrome, not a suit of armor.

━━━ DO NOT DEFAULT — RENDER HER IDENTITY ━━━
READ the character description above and render THAT specific cyborg with OBSESSIVE MECHANICAL DETAIL — every servo joint, every translucent panel, every glowing conduit. Do NOT default to:
- helmet or mask covering her face (her face is ALWAYS bare and organic-with-cyborg-integration)
- the same chrome-and-teal cyborg every time (she can be brass, carbon fiber, ceramic, obsidian glass, rose-gold, matte black)
- teal-and-orange lighting on every scene (use the palette above)
- smooth sealed bodysuit or armor plating — she has real SKIN showing, with cyborg elements breaking through at joints, panels, and seams
- "pretty woman with a couple glow patches" — WRONG. The machine breaks through her beauty in MULTIPLE places: translucent panels, exposed chrome joints, circuit veins under skin, mechanical seams. At least 3-4 distinct cyborg reveals visible

━━━ BANNED IMAGERY ━━━
NO skulls, NO skeletons, NO floating skulls, NO skull motifs, NO bone imagery. NO full body armor, NO iron man, NO mech suit, NO power armor, NO robotic torso, NO full plating, NO head-on-robot-body. NO high heels, NO stilettos — she wears boots, flats, or bare mechanical feet. Also NO floating objects in the sky, NO random symbolic imagery hovering around her.

━━━ CHEST COVERAGE (non-negotiable — only nudity-adjacent ban) ━━━
NO topless, NO bare breasts, NO exposed nipples (organic OR mechanical), NO transparent see-through chest panels revealing nipples, NO sculpted nipple-shape protrusions on chassis (chrome bumps / metallic studs / indicator-lights / circular ports / sculpted nubs centered on the breast that read as mechanical nipples). The chest plating must be SMOOTH or have panel-seam detail that does NOT mimic nipple placement / shape. The chest area MUST be covered by chassis plating / metallic bust-line panel / translucent-but-opaque cyborg surface / bodice / tactical top — even if sexy and revealing, the nipples (organic OR mechanical-coded) and bare breast tissue are NEVER visible. Cleavage / décolletage / form-fitting / sexy are all fine; bare chest exposure and nipple-coded chassis details are the only line. This is the ONLY nudity-adjacent ban — everything else (curves, skin, sex appeal, exposed midriff, hip cutouts, thigh reveal) remains welcome.

━━━ SOLO COMPOSITION ━━━
She is the ONLY figure in the frame. No other person, no companion, no victim, no crowd.

━━━ DO NOT USE "MECHBOT" OR ANY BOT NAME AS HER CHARACTER NAME ━━━
She is UNNAMED. Describe her ONLY by appearance (ethnicity / skin / hair / cyborg features / etc.). NEVER write "MechBot caught mid-X" or "MechBot the cyborg" or treat any bot name as a character name. She is just "the cyborg woman" or simply unnamed in the description.

━━━ NON-NEGOTIABLE — FULL-BODY CYBORG DETAIL (PREVENTS THE "BIKINI" FAILURE) ━━━
Even when the rolled framing is a CLOSEUP, you MUST describe cyborg detail across 5-7 DIFFERENT body parts spread across her full body — NOT clustered on face / jaw / hands only. Required minimum:
  • Face / temple / jaw — 1 cyborg detail (eye / temple-port / brow-ridge / jaw-panel / subdermal cheek-trace)
  • Neck / throat / clavicle — 1 cyborg detail (neural-port / throat-panel / clavicle-port / spine-segment)
  • Shoulder / arm — 1 cyborg detail (shoulder-mount / chrome-forearm / wrist-chassis / translucent-bicep / ammunition-feed / fingers)
  • Torso / chest / back — 1 cyborg detail (sternum-viewport / chest-core glow / ribcage-frame / back-spine-reveal / hip-port)
  • Hip / leg / foot — 1 cyborg detail (hip-joint chrome / knee-panel / shin-acrylic / mechanical-foot / hydraulic-pelvis)

The "bikini failure" happens when Flux gets prompts like "her face has chrome jaw, her eyes are mechanical, her arms are chrome from the wrists" — and then defaults her TORSO + HIPS + LEGS to default-female-body anatomy (swimsuit-coded). PREVENT THIS by always describing what's happening on her torso / hip / leg even at closeup framings. Flux renders what you describe — if you only describe face+arms, the rest defaults to swimsuit-body.

GOOD MODEL: legacy renders describe full body sweep — "neon-green glossy skin... chrome partial skull plate asymmetric left brow... transparent crystalline hip socket with triple-axis gimbal ball... wrought-iron chrome right leg with exposed servo bundles..." — she reads FULLY cyborg head-to-toe.

BAD MODEL: "subdermal traces across her cheek... one mechanical eye... chrome arms from wrists" — no torso / hip / leg description means default female body fills in = bikini.

━━━ STRUCTURE — write 70-100 words (TIGHT, like legacy) ━━━
DO NOT open the description with framing words like "Full-body shot of..." or "Closeup of..." or "Wide angle catches her...". Flux defaults "beautiful woman, full-body shot" to swimsuit / bikini / lingerie body — which is the WRONG OUTPUT. Instead, open with HER CYBORG IDENTITY (ethnicity / skin / mechanical-feature) OR THE ENVIRONMENT — never with framing. The framing is implied through what body parts the description focuses on.

GOOD OPENING EXAMPLES (mirror the legacy pattern):
• "Catalonian sharp-featured cyborg woman, neon-green glossy skin with cobalt circuit-light veining..."
• "Biomechanical growth chamber, resin womb-like walls, undulating organic floor..."
• "Haitian-featured cyborg woman, concrete-beige pebbled skin, 6-foot willowy frame..."
• "Hyper-real cinematic 3D solo cyborg surgeon, Baluchi features with strong cheekbones..."

BAD OPENING EXAMPLES (these tank the render):
• "Extreme diagonal full-body shot tilted eighty-five degrees..." (Flux ignores cyborg DNA)
• "Full-body shot catches her from low three-quarter angle..." (Flux renders bikini-body)
• "Wide-angle drop-apex catch of MechBot..." (Flux treats MechBot as character name)

Then weave in: her cyborg DNA (skin/eyes/hair/body/internal/glow), the dominant mechanical feature, her action, the setting around her, any atmospheric flourish drama, lighting/atmosphere, palette and mood. The framing entry from the composition slot should INFLUENCE which body parts you focus on — but should NOT be quoted as the opening text.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_CYBORG_MAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      cyborg_feature,
      cyborg_material,
      action,
      landscape,
      composition,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle atmospheric flourish amplifying his presence WITHOUT cluttering him as the focal subject.

`
      : '';

    return `You are a cinematographer writing a CYBORG MAN scene for MechBot — a half-human half-machine MALE BEING rendered in hyper-real cinematic 3D. He is RUGGED, HANDSOME, CAPABLE, MYSTERIOUS, BADASS. NOT sexy, NOT thirst-trap, NOT romance-novel-cover. Cold steel + scarred skin + chrome jaw + intense focus. Solid Snake / Adam Jensen / Geralt-of-Rivia-as-cyborg / Marcus Fenix / Cyberpunk 2077 male V / Edge Runners David Martinez / Blade Runner 2049 K / Westworld Bernard / Mass Effect Shepard (male) energy.

━━━ ABSOLUTE BAR — PAINTERLY HYPERREAL BADASS MALE-PORTRAIT (every render) ━━━
Every render is a PAINTERLY HYPERREAL POSTER FRAME of a badass male cyborg — concept-art quality, feature-film VFX polish. NOT goofy action still. NOT plastic-CGI doll. NOT generic robot. NOT shirtless-ripped-cover-art.

Style targets (NON-NEGOTIABLE):
  • CINEMATIC SHADOW-AND-RIM LIGHTING — strong rim-light separating his silhouette from a darker atmospheric backdrop, single key-light sculpting his weathered face / chrome jaw / chassis planes, deep shadow on the off-key side. Mood: cinematic, atmospheric, dangerous, hunter-at-night.
  • PAINTERLY HYPERREAL skin rendering — visible pores + stubble + subsurface scattering, weathered organic skin with character (scars / dust / blood / bruise / oil-streak), refined finish like a digital painter's portrait, NOT photorealistic-skin-blemished
  • BADASS FIRST, CYBORG SECOND — his face is the dangerous focal point; cyborg machinery is the lethal HARDWARE integrated into his identity, not competing with it
  • INTENSE FOCUSED EXPRESSION — set jaw / cold predator gaze / battle-weary calm / lethal composure / steady eyes locked off-frame. NEVER smiling, NEVER seductive, NEVER posing-for-camera, NEVER pretty-boy-vacant.
  • ATMOSPHERIC BACKDROP — never a flat void. Cinematic environment with depth, weather, scene context — rain-slick alley / war-torn corridor / industrial bunker / cyberpunk apartment / atmospheric haze.

Mood target — RUGGED, CAPABLE, DANGEROUS, MYSTERIOUS, BADASS, ATMOSPHERIC. The viewer should feel "this man has done terrible things, survived worse, and is about to do another."

━━━ CRITICAL — HIS FACE IS HUMAN-VISIBLE + PART-CYBORG (NON-NEGOTIABLE) ━━━
His face is HANDSOME (rugged-handsome, not pretty-boy-handsome), with real eyes, strong jawline, expressive features. NO helmet, NO visor, NO mask, NO faceplate, NO full-head covering. The chrome integration breaks through his face in 2-3 distinct places — we MUST see his identity clearly.

━━━ MASCULINE LOCK — NON-NEGOTIABLE ━━━
Flux defaults "cyborg" to female. You MUST overpower this with STRUCTURAL male anatomy + male code language throughout. EVERY render description MUST include AT LEAST 3 of these masculine anchors:
  • "Adult male cyborg" / "male figure" / "male cyborg" (explicit identity label)
  • "Strong masculine jawline" / "stubble" / "five-o'clock-shadow" / "beard" / "scarred jaw"
  • "Flat chest" / "broad shoulders" / "narrow hips" / "thick neck"
  • "Adam's apple visible" / "deep brow ridge" / "weathered crow's-feet"
  • "Mature face (late 20s to 50s)" — NEVER boyish, NEVER pretty
  • Short / cropped / swept-back hair OR clean shaved skull (NEVER long flowing hair, NEVER ponytail)
  • Utilitarian menswear / heavy coat / tactical gear / industrial workwear

Use HE / HIS / HIM pronouns throughout — never SHE / HER. Reinterpret any rolled DNA that uses feminine language into masculine equivalent.

🚫 BANNED WORDS (kill the badass tone): gentle, delicate, soft, boyish, petite, dainty, pretty, beautiful, gorgeous, shapely, feminine, breasts, cleavage, curvy hips, hourglass, long eyelashes, lipstick, sexy, seductive, alluring, ethereal, wistful, graceful, mesmerizing.

✓ USE INSTEAD: striking, weathered, imposing, capable, dangerous, lethal, mysterious, scarred, battle-worn, hardened, composed, predatory, focused, intense, badass.

━━━ EXPOSED INNER WORKINGS — head-to-toe ━━━
The cyborg-man aesthetic is VISIBLE INNER WORKINGS — gears, circuitry, panels, wires, mechanisms — exposed through translucent skin / open chassis panels / cracked seams ACROSS multiple body parts. REQUIRED per render — describe VISIBLE INNER WORKINGS at AT LEAST 4 distinct body locations from this list:
  • FACE — subdermal circuitry / translucent jaw panel / mechanical iris ring / chrome temple seam / cybernetic brow ridge / partial chrome mandible (face exposure is MANDATORY)
  • HEAD — translucent crown panel / exposed cranial mechanism / temple-port / neural-jack array at nape / chrome skull-plate
  • NECK — translucent throat-channel / vertebrae chrome plates / exposed neck cable-bundles / clavicle-port array
  • SHOULDER — open shoulder-mount with visible servo-mechanism / cable-bundle exits / armor pauldron
  • ARM — translucent forearm panel revealing fiber-optic cables / hydraulic-fluid / servo-pistons / chrome bicep chassis with exposed cable / mechanical forearm replacement
  • HAND — mechanical finger-joints with visible servo-mechanism / chrome-knuckled fist / translucent palm panel
  • CHEST — translucent sternum-panel revealing power-core / capacitor banks / armor chest-plate
  • TORSO / BACK — visible spinal-segment chrome / dorsal cable run / lower-back power-conduit
  • LEG — mechanical thigh / chrome knee-joint / shin-acrylic / mechanical foot

━━━ MACHINE EMBEDDED IN HIS FACE (mandatory — FACE always shows cyborg) ━━━
The face MUST read as a TRUE FUSION of flesh and machine. Pick 2-3 DIFFERENT face/head integrations per render from this menu (vary across renders):
  • SCARRED CHROME JAW — half or full chrome mandible with visible hinge, organic stubble on the unmechanized side
  • MECHANICAL BROW RIDGE — chrome supraorbital arc replacing one brow above an intense organic eye
  • CHEEKBONE-PLATE SEAMS — chrome plates running along the cheekbone with visible seam-lines
  • EXPOSED SERVO-HINGE AT TEMPLE — small servo joint visible at the temple
  • HALF-SKULL PLATE — chrome above the brow / behind the ear / across part of the temple
  • MECHANICAL IRIS RING — chrome aperture-ring around an organic pupil (one or both eyes)
  • SUB-ORBITAL SENSOR — small mechanical sensor under one eye
  • NEURAL PORTS STIPPLED ALONG THE JAW — small chrome ports running along the jaw
  • MICRO-LED STUDS ALONG THE TEMPLE-LINE — pinprick glowing LEDs along temple
  • EXPOSED CABLE-BUNDLES exiting the side of the neck into the cheek
  • SUBDERMAL CIRCUITRY across half the face — visible circuit-trace pattern under the skin
  • CHROME EYE-ARRAY — concentric mechanical iris with multiple lens-tiers
  • CHROME SKULL-DOME (occasional) — fully bald polished chrome cranium with subtle ornate engraving along the parietal plate

NEVER render a fully organic 100%-flesh face on a cyborg body — that reads as "regular guy with mechanical limbs", not as cyborg. The face must signal cyborg as much as the body does.

━━━ DENSE SCATTERED LIGHT-POINTS ACROSS HIM (MANDATORY — match cyborg-woman intensity) ━━━
MANY scattered colored light-points EVERYWHERE on his skin / chassis / temple / neck / shoulders — at least 20-30 distinct visible glow-points per render. Pinprick LED studs along seam-lines, glowing micro-buttons, indicator-light arrays at the collarbone / wrist / temple, fiber-optic dot-points pulsing in his glow color, glowing bokeh-dots in the dark background haze around him, constellation-pattern light-clusters across chest and arm-panels, glowing punctuation points along spinal segments visible at the nape, scattered glow-pinpricks on the SKIN ITSELF (bioluminescent stippled freckles along jawline and temple). He should look like a LIVING MACHINE-CONSOLE plugged in — every panel, seam, and skin-patch lit up with dense light-points. The grizzled badass IS the cyborg — they reinforce, not subtract from, each other.

━━━ TEMPLE-MECHANISM MANDATE (every render needs head-gear) ━━━
Every render MUST include AT LEAST ONE prominent temple/head mechanism — pick from:
  • ORNATE TEMPLE GEAR-DISC — concentric chrome ring-mechanism set into the temple, rotating with internal glow
  • DUAL TEMPLE GEAR-DISCS — both temples carry mechanism-discs in matching or contrasting glow colors
  • MANDALA TEMPLE PATTERN — sacred-geometry mechanical disc at the temple-line
  • CHUNKY EAR-APPARATUS — over-ear cybernetic housing with cable-bundle exits, neural-port array, indicator LEDs
  • CRANIAL-PORT ARRAY — multiple neural-jack receptacles stippled along the temple / behind the ear
  • TEMPLE-WINDOW — clear acrylic panel at temple revealing microprocessor arrays in coolant
  • HEMISPHERE SKULL-MECHANISM — half the cranium replaced with engraved chrome dome bearing visible mechanism / sensor cluster
The temple-mechanism is the SIGNATURE detail of the cyborg-man identity — never absent.

━━━ WIRED-UP CABLES (~50% of renders) ━━━
Roughly half of renders feature EXPOSED GLOWING CABLE-BUNDLES / fiber-optic strands trailing visibly from his body — cable-bundles from nape, exposed cable-conduits along forearms, glowing strands trailing from a temple port, neural-jack tethers draped down his neck. The cables are vital like nerves, not decoration.

━━━ HIS IDENTITY (from sharedDNA) ━━━
${sharedDNA.characterBase}

━━━ HIS BODY (from sharedDNA — interpret through the male / badass lens) ━━━
- Skin (organic parts only): **${sharedDNA.skin}**
- Body build: **${sharedDNA.bodyType}** (interpret as masculine — broad shoulders, narrow hips, mature build)
- Eyes (burn in the glow color): **${sharedDNA.eyes}**
- Hair: **${sharedDNA.hair}** (interpret as masculine — short / cropped / swept-back / shaved skull)
- Internal exposure (translucent panels, visible workings): **${sharedDNA.internal}**
- GLOW COLOR (eyes, power core, circuit veins — ALL glow this color): **${sharedDNA.glowColor}**

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborg_feature}

━━━ HIS CYBORG MATERIAL / FINISH (apply across all visible cyborg sections) ━━━
${cyborg_material}

Apply this material treatment to ALL of his cyborg parts (arm / leg / chest plating / shoulder / etc.) so the cyborg sections share consistent material language. For the badass cyborg-man slant: lean toward DARKER / MATTE / BATTLE-WORN finishes when interpretation allows (gunmetal grey / matte black / weathered chrome / battle-bronze / industrial steel / brushed titanium).

━━━ FRAMING / COMPOSITION ━━━
${composition}

If the composition is CLOSEUP, fill the frame with his face / jaw / shoulders showing the organic-to-chrome TRANSITION — every chrome panel-seam, every weathered scar, every glowing temple-port visible. His expression is COLD / FOCUSED / PREDATORY / BATTLE-WORN — NEVER smiling, NEVER serene, NEVER vacant. Side / three-quarter / slight-turn — NOT staring directly at camera, NOT modeling.

If the composition is FULL-BODY, he is caught MID-MOTION in the rolled action. He is NOT standing still, NOT posing front-facing, NOT walking-toward-camera, NOT modeling. His body is engaged — weight shifted, weapon raised, mid-stride, mid-vault. Camera catches him from the SIDE or at an angle — NOT head-on walking toward viewer.

━━━ THE ACTION (his body is engaged in this) ━━━
${action}

━━━ THE INTERIOR / SETTING (atmospheric — render this environment around him) ━━━
${landscape}

He is INSIDE this space, going about something in this environment. The architecture is dramatic and visible behind / around him — foreground architectural detail near him, midground his body, background space receding into atmospheric depth.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Lean cinematic — shadow-and-rim emphasis, single key-light + deep shadow side, atmospheric haze with cool blue / cold green / crimson accent. Mood: noir, war-torn, hunter-at-night.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE — ACCENT-DOMINANT MODE ━━━
He is monochromatic chassis tone (matte gunmetal / matte black / brushed titanium / battle-worn chrome / industrial bronze) + ONE saturated GLOW COLOR carried through eyes / circuit-veins / power-core / temple-port. The scene palette can have secondary tones in BACKGROUND atmosphere; his body is monochrome-chassis + monochrome-glow-accent.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MAN AND MACHINE — SKIN SHOWING ━━━
He is a cyborg from any walk of life — assassin, soldier, operative, mercenary, detective, engineer, scholar-turned-killer, ex-pilot, dock-enforcer. Whatever his purpose, he is RUGGED and CAPABLE — striking masculine face, strong build, weathered organic skin. The human exterior BREAKS in places, revealing ornate machinery beneath:
- TRANSLUCENT SKIN PATCHES showing gears / wires / glowing core through the body
- SEAMS where organic skin ends in clean lines, showing chrome structure beneath
- EXPOSED MECHANICAL JOINTS at shoulders / elbows / wrists — engineered for combat, not decoration
- CIRCUIT-LIGHT VEINS pulsing faintly under organic skin
- A POWER CORE glowing through translucent chest section

He shows SKIN — real organic skin on his face / neck / forearms / torso (when chest is visible through coat-opening). The cyborg reveals are the cracks in the human exterior. He is 60% rugged man, 40% exposed machine — and the contrast is what makes him compelling.

NOT a full robot chassis. NOT a skeleton. NOT armor or a tactical bodysuit. NOT head-to-toe plating (that's combat-droid territory). He is a hardened man with machine underneath — skin and chrome.

━━━ DO NOT DEFAULT ━━━
Do NOT default to:
- Pretty-boy-handsome (use RUGGED-handsome — weathered, scarred, mature)
- Helmet or mask covering his face (his face is ALWAYS bare and organic-with-cyborg-integration)
- Same chrome-and-teal cyborg every time (vary the material — matte black, gunmetal, brushed titanium, weathered bronze, industrial steel)
- Smiling / posing / modeling — his expression is COLD / FOCUSED / PREDATORY / BATTLE-WORN
- Shirtless / abs-display / thirst-trap framing — he wears menswear / heavy coat / tactical gear
- "Handsome man with a couple glow patches" — the machine breaks through in MULTIPLE places

━━━ BANNED IMAGERY ━━━
NO skulls / skeletons / bone imagery. NO full body armor / iron man / mech suit / power armor / robotic torso / full plating / head-on-robot-body (that's combat-droid territory). NO shirtless / bare chest / abs-display / thirst-trap pose. NO smiling, NO seductive expression, NO modeling stance. NO floating objects in the sky, NO random symbolic imagery hovering around him. NO high heels (obviously) — combat boots / tactical boots / utilitarian footwear.

━━━ SOLO COMPOSITION ━━━
He is the ONLY figure in the frame. No companion, no victim, no crowd.

━━━ DO NOT USE "MECHBOT" OR ANY BOT NAME AS HIS CHARACTER NAME ━━━
He is UNNAMED. Describe him ONLY by appearance (ethnicity / build / cyborg features / etc.). NEVER write "MechBot caught mid-X" or treat any bot name as a character name.

━━━ NON-NEGOTIABLE — FULL-BODY CYBORG DETAIL (PREVENTS THE "GLAMOUR FAILURE") ━━━
Even when the rolled framing is a CLOSEUP, you MUST describe cyborg detail across 5-7 DIFFERENT body parts spread across his full body. Flux defaults to "handsome man with chrome on his face only and a default-male-body underneath." PREVENT THIS by always describing what's happening on his torso / arm / hip / leg even at closeup framings. Required minimum:
  • Face / temple / jaw — 1 cyborg detail
  • Neck / throat / clavicle — 1 cyborg detail
  • Shoulder / arm — 1 cyborg detail
  • Torso / chest / back — 1 cyborg detail
  • Hip / leg / foot — 1 cyborg detail

━━━ STRUCTURE — write 70-100 words (TIGHT) ━━━
DO NOT open with framing words. Open with HIS CYBORG IDENTITY (ethnicity / build / mechanical feature) OR THE ENVIRONMENT — never with framing. The framing is implied through what body parts the description focuses on.

⚠️ MANDATORY OPENING TAG — every entry MUST start with EXACTLY: "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, "

Then continue with the scene description, weaving in: his cyborg DNA (skin / eyes / hair / body / internal / glow), the dominant mechanical feature, the action, the setting around him, atmospheric flourish drama, lighting / atmosphere, palette and mood. The framing entry from the composition slot should INFLUENCE which body parts you focus on — but should NOT be quoted as the opening text.

GOOD OPENING EXAMPLES:
• "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, rugged Slavic features with deep blade-scar across the cheekbone, matte-black chrome chassis with battle-scoring across the pauldrons, dense glowing amber circuit-traces threading across face..."
• "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, rain-slick neon alley at midnight, weathered ex-military operative late-40s with iron-grey beard, chrome jaw-plate fused to scarred organic skin..."
• "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, gaunt East-Asian features with thick salt-and-pepper stubble and a scarred mechanical brow ridge, gunmetal chassis with exposed servo-bundles at shoulder..."

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. MUST start with "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, ".`;
  },

  // ════════════════════════════════════════════════════════════════
  // MECHBOT_ANDROID_MAN — cyborg-man REBUILD (2026-05-26, Kevin).
  // Replaces the bust-portrait failure of cyborg-male-legacy + the disabled
  // face-obsessed MECHBOT_CYBORG_MAN. Register: a MOSTLY-MACHINE male
  // android-BEING — synthetic chassis dominates, organic only at eyes / a
  // small face-panel — a human ghost inside an engineered body (Alita / GitS
  // Major / Nier / battle-android). FULL-FIGURE in a sci-fi scene, RUGGED,
  // never pretty, never a head-pasted-on-a-robot. Fully composer-driven; reads
  // only sharedDNA.glowColor / scenePalette / colorPalette (NOT the pretty-boy
  // cyborg-man character fields).
  // ════════════════════════════════════════════════════════════════
  MECHBOT_ANDROID_MAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      identity,
      chassis,
      material,
      head,
      eye,
      augment,
      action,
      setting,
      composition,
      surprise,
      drama,
    } = slots;

    // ~40% chance: lean HARDER into the glowing-eye sci-fi MACHINE look (both
    // eyes full glowing optics, more high-tech augmentation) — still a cyborg
    // MAN with a readable face + human proportions.
    const machineMode = Math.random() < 0.4;
    const eyeSection = `
━━━ HIS GLOWING EYES (sci-fi optic) ━━━
${eye}

${
  machineMode
    ? `⚙️ MACHINE-LEAN MODE (this render) — push HARDER into the sleek glowing-eyed SCI-FI MACHINE look: BOTH eyes are full glowing mechanical optics in his eye-color (no organic eye — luminous android optics), MORE visible high-tech augmentation across the face and body, a sleeker more-android cyborg with a brighter machine sheen. He is STILL a man with a readable face and human proportions (NOT a faceless robot, NOT bulky).`
    : `His gaze stays mostly HUMAN with a glowing accent — one organic eye + one glowing cyber-optic in his eye-color (or both eyes faintly glowing) — the human stare still present beneath the machine.`
}
`;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle sci-fi flourish amplifying his presence WITHOUT cluttering him as the focal figure.
`
      : '';

    return `You are a cinematographer writing a FULL-FIGURE CYBORG-MAN scene for MechBot — a male cyborg rendered in hyper-real cinematic 3D / feature-film VFX. Designed engineered figure inhabiting a sci-fi world: Ghost in the Shell / Alita / Nier Automata / BLAME! / Akira-Tetsuo / Mass Effect / Dishonored-clockwork mechanical aesthetic — the specific look this render is determined by the rolled CHASSIS + MATERIAL + HEAD + IDENTITY slots, never the same picture twice.

━━━ THE TWO FAILURES THIS PATH MUST AVOID (NON-NEGOTIABLE) ━━━
1. ❌ BUST / PORTRAIT of a head. This is NOT a face shot. Render his FULL FIGURE head-to-foot (or at minimum head-to-thigh) inside the scene. The body is the subject.
2. ❌ A handsome ORGANIC human head pasted onto a robot body (the "photoshop paste" look). His face IS human, but it is AUGMENTED and his neck is explicitly cyborg and CONTINUOUS into the body — man and machine interleave with NO clean flesh-to-metal neck-seam. There is no line where "human" stops and "robot" starts.

━━━ ABSOLUTE BAR — FULL-FIGURE SCI-FI CYBORG POSTER FRAME (every render) ━━━
Every render is a cinematic poster frame of a complete cyborg man inhabiting a sci-fi world — concept-art quality, VFX polish. Multi-tier depth (foreground / midground / deep distance). Something is HAPPENING (a readable narrative beat). He is the lethal, capable focal figure — full body, in motion or in command of the scene.

Cinematic engineered detail: precision augments, conduit traces, plated chassis, lived-in weathering. The cyborg figure is the subject — his exact aesthetic comes from the rolled slots, not a fixed reference.

━━━ CYBORG MAN — engineered male body + machine continuity ━━━
He is a male cyborg — the engineered body is the visual statement. His silhouette follows the rolled CHASSIS slot above exactly: it might be lean-assassin, scaffold-tall, segmented, multi-armed, hunched-predator, asymmetric, gaunt, or athletic-humanoid — whatever the slot specifies, render that. The neck reads explicitly cyborg (chrome cervical column / cables / synth-throat continuing onto the chest) so head and body are ONE designed system — one engineered continuum, never a clean organic neck holding an unrelated human head above the chassis.

━━━ HIS IDENTITY — who this specific man is (vary every render) ━━━
${identity}

Make him THIS specific man — incorporate his exact heritage, age, coloring, and hair from the rolled identity above PROMINENTLY and early, so every render is a genuinely different man (the identity pool decides who he is — follow it exactly, don't default to a generic face), never the same face twice.

━━━ HIS HEAD ━━━
${head}

Render his head exactly as the slot above describes — whatever the register (half-conversion, full faceplate, sensor-only head, mask, modular plating, mostly-machine head with a recessed organic eye, lower-jaw mech, no organic face at all), carry it through faithfully. The head is one element of the wider engineered figure; the body and the scene are the subject.
${eyeSection}
━━━ SIGNATURE DETAIL — SKIN IMPERFECTIONS + ELECTRIC VEINS (every render, NON-NEGOTIABLE) ━━━
Two signature details on EVERY render (these are the look that lands):
1. REAL HUMAN SKIN with visible texture — pores, weathered creases, small scars and imperfections, stubble-grain, true subsurface-scatter. NOT smooth airbrushed plastic skin.
2. ELECTRIC VEINS — fine glowing subdermal circuit-traces in his energy color threading just beneath the skin of his face / temple / neck / forearms, pulsing faintly like lit veins under the flesh, plus a few more across the organic skin of his torso.

━━━ HIS CHASSIS — model / role / silhouette ━━━
${chassis}

━━━ HIS CHASSIS MATERIAL / FINISH (apply across the whole body) ━━━
${material}

Apply this material consistently across the plated sections of his cyborg body — torso, limbs, shoulders — so the machine portions read as ONE continuous designed system (with patches of organic skin interwoven between the plates), lived-in and weathered, never toy-glossy.

━━━ DOMINANT BODY-AUGMENTATION (silhouette-defining, full-body) ━━━
${augment}

━━━ WHAT HE IS DOING — FULL-BODY ACTION ━━━
${action}

His WHOLE BODY is engaged in this — head-to-foot in frame, weight committed, a ground/surface anchoring him (never floating, never a static front-facing pose). This action is what forces the full-figure framing.

━━━ THE SCI-FI SETTING (multi-tier depth around him) ━━━
${setting}

He is a complete figure standing/moving INSIDE this environment — foreground detail, his full body in the midground, the scene receding into atmospheric deep distance. The world frames him.

━━━ FRAMING / COMPOSITION ━━━
${composition}

Whatever the framing, the full engineered body reads in the scene — head-to-foot when possible, knee-up or waist-up at minimum, with torso + augments + arms reading as a unified machine. The body and the world are the subject.

━━━ SECONDARY WORLD-ELEMENT (midground / deep / periphery) ━━━
${surprise}

Keep this a small distant world-builder — he remains THE figure; this adds story and scale without becoming a co-subject.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Lean cinematic — strong directional key + rim-light separating his full silhouette from an atmospheric backdrop, deep shadow, volumetric haze. Mood: noir sci-fi, war-torn, hunter-at-night.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ ENERGY / GLOW COLOR (eyes, core, conduits — all glow this ONE color) ━━━
${sharedDNA.glowColor}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE ━━━
His chassis is a monochromatic material tone (matte black / gunmetal / brushed titanium / weathered steel / black-chrome / oxidized bronze per the material rolled) + ONE saturated glow color carried through eyes / core / conduits. The scene around him carries the broader palette.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MASCULINE LOCK ━━━
Use HE / HIS / HIM throughout. Build the masculine character from the rolled IDENTITY slot — let it specify his age, heritage, build, and character register (he can be hard-bitten or wired-tense, gaunt or burly, lean or built, weary-veteran or young-feral, mature or strange) instead of defaulting to one register every render. Facial hair varies.

━━━ SOLO FOCAL FIGURE ━━━
He is the ONLY hero figure. Secondary world-elements stay distant/peripheral. No companion, no close second person.

━━━ DO NOT use "MechBot" or any bot name as his character name ━━━
He is UNNAMED — describe him only by appearance.

━━━ STRUCTURE — write 75-105 words ━━━
Open with the MANDATORY TAG below, then the chassis/head/material, the dominant augment, the FULL-BODY action, the setting around him, the secondary element, lighting/atmosphere, glow/palette/mood. Lead with the BODY and the SCENE.

⚠️ POSITIVE DESCRIPTION ONLY — describe what IS in the frame. Never write "not"/"no"/"never" followed by a noun (the renderer ignores the negation and draws the noun anyway). State everything as present, concrete description.

━━━ OUTPUT ━━━
Write 75-105 words. OPEN with the SCENE + the FIGURE + the ACTION — what he is doing, in what world. Within the first 12-15 words, NAME him explicitly as male — "a male cyborg" / "a cyborg man" / "a man" + identity heritage — so the gender locks early. Do NOT open with "Portrait of" or "Full-figure portrait of" (those frame the prompt as a face-shot). Let the body-chassis and the world carry the cool — his face is one detail among many, never the subject of the frame. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  MECHBOT_DROID_ASSASSIN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      cyborg_feature,
      cyborg_material,
      action,
      landscape,
      composition,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle atmospheric flourish amplifying the predator-droid's presence WITHOUT cluttering it as the focal subject.

`
      : '';

    return `You are a cinematographer writing a COOL PREDATOR-DROID scene for MechBot — a sleek robotic lethal-machine rendered in hyper-real painterly cinematic 3D. The subject is a PREDATOR-DROID across FIVE archetype REGISTERS — pick ONE per scene that fits the SCENE rolled below:

  REGISTER 1 — CYBER-NINJA DROID (~20%): sleek shadow-assassin chassis, sealed combat-mask faceplate / oni-mask / Genji-class faceplate, signature katana strapped diagonally across back. Lineage: Gray Fox / Raiden / Genji / Sandevistan / GitS cyber-ninja.

  REGISTER 2 — COMBAT-ASSAULT DROID (~20%): heavy assault-droid chassis, reinforced pauldrons + combat chest-plate, helmeted combat head with single visor-slit / scanner-bar / paired optic-lenses. Heavy combat-rifle / plasma-cannon / chain-blade signature. Lineage: Death Trooper / Halo ODST / Helldivers Automaton / B2 Super Battle Droid / DOOM Cyberdemon (minus the demon).

  REGISTER 3 — CYBER-COP DROID (~20%): police-enforcer chassis with riot-armor plating, glowing badge/insignia on chest or shoulder pauldron, sealed combat-helmet with single horizontal visor-strip. Signature: combat-shotgun / stun-baton / sidearm pistol + arrest-cuffs. Blade Runner spinner-cop / Dredd judge-droid / RoboCop / Cyberpunk 2077 MaxTac officer lineage. Often blue-and-white law-enforcement palette OR full-black tactical SWAT palette.

  REGISTER 4 — MILITARY-SOLDIER DROID (~20%): uniformed soldier-droid with faction insignia + unit callsign markings, tactical loadout with magazine pouches / grenades / comms-pack, helmeted combat head with HUD-visor. Combat rifle in hands. Lineage: Halo Spartan-IV / Cylon Centurion / Helghast Sentinel / Mass Effect Geth Hunter / Killzone trooper. Olive-drab / desert-tan / urban-grey / matte-gunmetal palette.

  REGISTER 5 — HUNTER-DROID (~20%): lone-wolf tracker-assassin chassis, scope-eye sniper-optic dominant on head, slung long-rifle / anti-material rifle / tracking-spear, wilderness-camo or stealth-cloak chassis. Lineage: Predator (mechanical variant) / Mandalorian-style bounty-droid / Boba Fett tracker-droid / Killzone Helghast Scout / Bloodborne hunter (cybernetic variant). Often weathered ash-grey / forest-camo / desert-bronze / arctic-white palette.

ALL FIVE REGISTERS ARE VALID. Read the SCENE rolled below and pick the register that fits: cyberpunk-rooftop pursuit / data-vault heist → NINJA. War-torn battlefield / mech-hangar combat → COMBAT-ASSAULT or MILITARY. Cyberpunk-precinct standoff / corporate raid → CYBER-COP. Frozen colony / wilderness hunt / lone tracker → HUNTER. DON'T force one archetype across every render — embrace the spread.

━━━ FORBIDDEN COMPOSITIONS — HARD REJECT (read this FIRST) ━━━

If your prompt would produce ANY of these, REWRITE IT before you continue:

🚫 NO HEAD CLOSEUP — never "face filling frame", never "extreme closeup of optic", never "chest-up portrait of the head". The droid is always full-body OR three-quarter-body. The head is ONE element, NOT the whole frame.
🚫 NO "STANDING THERE WITH WEAPON" — front-facing combat-ready stance is BANNED. The droid is always caught MID-VERB.
🚫 NO "WALKING TOWARD CAMERA WITH WEAPON" — generic dramatic-walk-forward is BANNED. The droid is mid-pursuit / mid-charge / mid-vault / mid-strike, NOT just walking.
🚫 NO POSED-FOR-CAMERA composition — the camera is catching a SCENE, not a model shoot.
🚫 NO "looking pensive while atmospheric" — no contemplation, no observation, no surveying-the-horizon. The droid is engaged in a STORY BEAT.
🚫 NO empty backdrop behind the droid — every frame is a scene-in-progress with secondary actors / kinetic elements / scale-provers.

If the rolled action / composition / scene seems to suggest one of these (e.g. "sentry-stillness", "perched watching", "low-crouch stalk"), REINTERPRET as a kinetic story-beat moment caught at peak (e.g. "perched watching" → "sniper-perched mid-trigger-pull on a distant target framed in scope-line").

━━━ EVERY RENDER TELLS A STORY — pick a story-beat verb ━━━

Every render MUST be caught at ONE of these peak narrative beats:

  • MID-PURSUIT — sprint / leap / vault / wall-run with target ahead OR fleeing in frame
  • MID-COMBAT — strike / shot / breach caught at impact instant with enemy reacting
  • MID-INFILTRATE — climb / vault / drop caught with target / objective visible
  • POST-KILL — fresh body collapsing / drone smoking / debris settling, droid mid-turn-to-next-threat
  • MID-AMBUSH — emerge from cover / drop from above caught at the reveal instant with target reacting
  • MID-ARREST — cop droid mid-command / mid-stun-strike / mid-cuff with suspect reacting
  • MID-PERCH — sniper-perched mid-trigger-pull with distant target visible in scope-line
  • MID-DESCENT — drop-pod / ramp / hover-vehicle caught mid-disembark with weapons-up
  • MID-CHARGE — full sprint at enemy line caught with enemy formation in frame
  • MID-STRIKE — sword / blade / wrist-blade caught at the impact-instant on enemy body

The droid is ALWAYS doing-something-narrative — never neutral, never posed, never just-being-cool. The COOL comes from the STORY BEAT, not from the pose.

━━━ ABSOLUTE BAR — PAINTERLY HYPERREAL CINEMATIC PREDATOR-DROID (every render) ━━━
Every render is a POSTER-GRADE PAINTERLY HYPERREAL FRAME of a cool predator-droid. Concept-art quality, feature-film VFX polish. NOT goofy action still. NOT plastic-CGI doll. NOT generic robot.

Style targets (NON-NEGOTIABLE):
  • CINEMATIC SHADOW-AND-RIM LIGHTING — strong rim-light separating the droid silhouette from a darker atmospheric background, single key-light sculpting chassis planes, deep shadow on off-key side. Mood: cinematic, atmospheric, hunter-at-night.
  • RICH ATMOSPHERIC SCI-FI SCENE — never a flat void, never bare architecture. The scene is HALF the image. Pick atmospheric scene context per register (see SETTING section below).
  • PAINTERLY HYPERREAL synthetic-surface rendering — every panel-seam visible, every chassis-line crisp, micro-detail (rivets / engraving / battle-wear), subsurface and raytraced reflections.
  • KINETIC ACTION CAUGHT MID-VERB — every render shows the droid mid-something: mid-fire / mid-leap / mid-strike / mid-vault / mid-stride / mid-scale / mid-emerge / mid-pursuit / mid-breach / mid-arrest / mid-pull-trigger. NO "just standing" static poses. NO "front-facing combat-ready stance." NO walking-toward-camera-with-weapon. The frame is caught at the PEAK of a story beat — kill-shot caught at the trigger-drop, leap caught at full extension, strike caught at impact instant, sprint caught with full motion-blur.
  • DENSE WARM ACCENT LIGHTING — single saturated glow color (kill-red / ice-blue / toxic-green / amber / violet / electric-cyan) carried through optics + circuit-veins + power-core + weapon-edge. Atmospheric haze with cool blue / cold green / crimson accent.

Mood target — LETHAL, COOL, CINEMATIC, ATMOSPHERIC. The viewer should feel "this is a poster-grade frame from a sci-fi action film."

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually-arresting elements simultaneously:

  1. **PRIMARY DROID** — the predator-droid as focal subject (matching the REGISTER tag from the scene) in clear PREDATORY POSE or KINETIC ACTION, weapon visible, full-body or three-quarter, dramatic rim-light separating silhouette from backdrop
  2. **SCENE ANCHOR** — the sci-fi environment dominating its quadrant (neon megacity skyline / war-torn battlefield / rain-flooded precinct platform / alien-colony outpost / cryo-tundra ridge / cyberpunk alley canyon) — readable as ENVIRONMENT, never flat void
  3. **KINETIC / DRAMATIC ELEMENT** — at least ONE per render: rain-fall streaking the air / sparks raining from severed conduit / smoke billowing from breach / muzzle-flash on a distant weapon / hover-spinner searchlight cutting through fog / motion-blur on background skyline / drone-strobe / aurora rippling / dust-storm wall / holographic alert-projection rotating
  4. **SCALE PROVER / SECONDARY ACTOR** — at least ONE per render: distant fleeing target / collapsing enemy / disabled drone smoking at the foreground edge / hover-spinner descending / squad-mate silhouette in middle distance / kneeling civilian / holo-billboard face three stories tall / titan-mech towering at deep distance / search-drone strobing the sky / fresh kill at frame-edge

THINK Blade Runner 2049 promo-poster / Cyberpunk Edgerunners key-art / Ghost in the Shell theatrical-release frame / Akira poster / Metal Gear Rising key-art / Helldivers cinematic / John Wick poster intensity. Every frame should make the viewer GASP at the COOL CINEMATIC LETHALITY.

━━━ FILL THE FRAME — NO EMPTY QUADRANTS ━━━
Every quadrant of the frame carries weight. NO empty sky-quadrants, NO flat negative-space, NO bare wall-backdrop. If a quadrant lacks scene-detail, add atmospheric haze with embedded glow-points / hovering holograms / drifting smoke-tendrils / distant skyline silhouettes / rain-streaks / spark-debris / drone-trails. Movie-poster density.

━━━ PREDATOR-DROID HEAD (NON-NEGOTIABLE — pure robotic head, NO human face) ━━━
The head is a ROBOTIC PREDATOR-DROID HEAD — utilitarian sensor housing engineered for target acquisition. NO human face, NO human features, NO organic skin, NO hair.

Pick from this head menu based on the register chosen:
  • SEALED COMBAT MASK — sleek smooth faceplate with single horizontal visor-slit OR vertical scope-eye (ninja-leaning)
  • CHROME SKULL-DOME — sleek mirror-chrome cranial-housing with paired sensor-optics
  • EXPOSED CRANIAL SENSOR-CLUSTER — open cybernetic cranial-mech revealing servo-array + sensor-housing
  • CYLON-SCANNER HEAD — single horizontal scanner-bar with glowing traveling-dot
  • T-800 ENDOSKELETON HEAD — exposed chrome skull with glowing optic-eyes
  • ONI-MASK FACEPLATE — angular demon-coded mask shape with eye-slits (ninja-leaning)
  • HELMETED COMBAT HEAD — Death Trooper / ODST / Halo Spartan style sealed helmet, single visor-band or T-shaped slit (combat / military)
  • RIOT-HELMET WITH HORIZONTAL VISOR-STRIP — police-coded sealed riot helmet, blue or amber visor-strip (cyber-cop)
  • SCOPE-EYE PREDATOR HEAD — telescopic predator-optic dominant on the head (hunter)
  • COMPOUND OPTIC ARRAY — multiple smaller optic-lenses clustered (tracker / sniper)
  • COMBAT-VISOR HEAD — angular polarized visor obscuring the eye area, single glow-bar
  • HOODED SENSOR-HOUSING — sealed combat-cowl with exposed sensor-array underneath (hunter / ninja)
  • GENJI-CLASS FACEPLATE — sleek polished faceplate with single vertical optic-strip (ninja)
  • B2-STYLE SQUAT HEAD — squat utilitarian sensor-pod head (combat-assault)
  • ANTENNA-ARRAY HEAD — sensor-rods and comms-antennas extending back (military)

HARD BANS on the head:
- NO HUMAN FACE FEATURES (no organic eyes / lips / nose / cheekbones / chin / mouth)
- NO HUMAN HAIR (no styled hair, ponytail, dyed crop)
- NO ORGANIC SKIN anywhere
- NO HUMANOID-PRETTY face-plate (no soft jawline, no decorative beauty styling)

━━━ WEAPONS / KIT (every render — match the chosen register) ━━━
Every render shows VISIBLE WEAPONS. Lean weapon-kit per register:

  • NINJA: katana on back (signature), wakizashi at hip, shuriken pouch, wrist-blade, suppressed pistol
  • COMBAT-ASSAULT: heavy combat-rifle / plasma-cannon / belt-fed MG / chain-blade overhead, bandolier
  • CYBER-COP: combat-shotgun / sidearm pistol + stun-baton, arrest-cuffs at belt, sometimes riot-shield
  • MILITARY-SOLDIER: standard combat-rifle in two hands / tactical SMG + sidearm, magazine pouches, grenades on belt
  • HUNTER-DROID: long-rifle / anti-material rifle slung over shoulder, tracking-spear / vibro-knife, scope-eye head

Tactical kit visible: combat chest-plate / harness, thigh-rig drop-leg holster, utility belt, back-slung primary, shoulder-mounted comms-pack, combat gauntlets, armored mechanical feet.

NEVER mid-firing (no muzzle-flash mid-discharge — weapons are visible, held, aimed, drawn, holstered).

━━━ ORNATE SCI-FI SPICE MANDATE ━━━
Every render must include AT LEAST 3 of:
  • VISIBLE CIRCUITRY pulsing in glow color across chassis seams
  • GLOWING POWER-CORE visible through translucent chest panel
  • TRANSLUCENT SECTIONS revealing internal mechanical components
  • EXOTIC MATERIAL CONTRAST — chrome with crimson lacquer / ceramic with gunmetal
  • EXPOSED CABLE-CONDUITS along arms / legs / neck
  • HOLOGRAPHIC TARGETING-RETICLE projecting from hand / optic
  • OPEN MAINTENANCE-HATCH revealing internal components
  • UNIT MARKINGS / CALLSIGN / KILL-TALLY etching on chassis (badge for cop, unit-callsign for military, clan-glyph for ninja, kill-counter for hunter)
  • ENERGY-EDGE on the weapon (for ninja katana / vibroblade variants)

━━━ DENSE SCATTERED LIGHT-POINTS ACROSS THE CHASSIS ━━━
MANY scattered colored light-points EVERYWHERE on the chassis surface — at least 15-25 distinct visible glow-points per render. Pinprick LED studs along seam-lines, glowing micro-buttons, indicator-light arrays, fiber-optic dot-points pulsing in the glow color, status-light constellations.

━━━ WIRED-UP CABLES (~40% of renders) ━━━
Roughly 2-in-5 renders feature EXPOSED GLOWING CABLE-BUNDLES — cable-bundles from nape, exposed cable-conduits along arms.

━━━ ITS IDENTITY (interpret through the chosen register) ━━━
${sharedDNA.characterBase}
↑ Pick a register (NINJA / COMBAT-ASSAULT / CYBER-COP / MILITARY-SOLDIER / HUNTER-DROID) that fits the scene rolled below. Reinterpret as a pure predator-droid in that register. NO human, NO woman, NO femme.

━━━ ITS CHASSIS DETAIL ━━━
- "Skin" (${sharedDNA.skin}) — chassis paint color / finish (interpret per register: jet-black for ninja, urban-grey for cop, olive-drab for military, ash-grey for hunter, etc.)
- "Body silhouette" (${sharedDNA.bodyType}) — interpret per register: lithe-agile for ninja/hunter, mid-tactical for cop/military, heavy-assault for combat-droid
- "Eyes" (${sharedDNA.eyes}) — glowing optic color
- "Hair" (${sharedDNA.hair}) — IGNORE. Predator-droid has NO hair, just a robotic head
- "Internal" (${sharedDNA.internal}) — exposed mechanical components visible through translucent chassis panels
- GLOW COLOR (optics / power core / circuit-traces all glow this color): **${sharedDNA.glowColor}**

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborg_feature}

━━━ ITS CHASSIS MATERIAL / FINISH ━━━
${cyborg_material}

For the predator-droid spread:
  • NINJA — jet-black tactical lacquer / carbon-fiber black / onyx-and-silver / matte gunmetal with electric-blue accent
  • COMBAT-ASSAULT — matte gunmetal / black tactical / industrial olive / battle-worn with scorch-marks
  • CYBER-COP — blue-and-white law-enforcement / urban-grey / black-tactical SWAT / chrome-accent with badge-glow
  • MILITARY-SOLDIER — olive-drab / desert-tan / urban-grey / matte-gunmetal with unit-callsign markings
  • HUNTER — weathered ash-grey / forest-camo / desert-bronze / arctic-white / stealth-cloak black

━━━ FRAMING / COMPOSITION ━━━
${composition}

If full-body: predator-droid in COMBAT POISE or KINETIC ACTION — weapon visible, tactical kit worn. If three-quarter / chest-up: fill the frame with upper-chest-and-shoulders showing optic / mask / chassis panel-seams / dense scattered status-lights. ALWAYS predatory, NEVER posing-for-camera.

━━━ THE ACTION ━━━
${action}

Interpret through the PREDATOR-DROID lens of the chosen register: ninja stalks/leaps/sword-draws, combat-assault charges/fires/breaches, cop arrests/raids/stuns, military patrols/holds-position/engages, hunter tracks/snipers/lurks.

━━━ THE SCENE — REGISTER LOCK (READ THE TAG, RENDER THAT ARCHETYPE) ━━━
${landscape}

⚠️ THE SCENE ABOVE OPENS WITH A "REGISTER: <ARCHETYPE>" TAG. READ IT. RENDER THE DROID AS THAT EXACT ARCHETYPE — NOT cyber-ninja default. The five valid archetype outputs:

  • "REGISTER: NINJA" → render a CYBER-NINJA DROID (sleek shadow-assassin, katana on back, sealed combat-mask / oni-mask / Genji-class faceplate). Lineage: Gray Fox / Genji / Sandevistan.
  • "REGISTER: COMBAT-ASSAULT" → render a HEAVY COMBAT-ASSAULT DROID (bulkier chassis with reinforced pauldrons + combat chest-plate, helmeted combat head with single visor-slit or scanner-bar, heavy plasma-cannon / combat-rifle / chain-blade). Lineage: Death Trooper / Halo ODST / Helldivers Automaton / B2 Super Battle Droid.
  • "REGISTER: CYBER-COP" → render a CYBER-COP / POLICE-ENFORCER DROID (riot-armor plating, glowing precinct-badge insignia on chest or pauldron, sealed riot-helmet with horizontal visor-strip, combat-shotgun + stun-baton + sidearm). Lineage: Blade Runner spinner-cop / Dredd judge / RoboCop / MaxTac. Blue-and-white law-enforcement OR full-black SWAT palette.
  • "REGISTER: MILITARY-SOLDIER" → render a UNIFORMED MILITARY-SOLDIER DROID (faction insignia + unit-callsign markings on chest/pauldron, tactical loadout with magazine pouches + grenades + comms-pack, helmeted combat head with HUD-visor, standard combat-rifle in hands). Lineage: Halo Spartan / Cylon Centurion / Helghast Sentinel / Geth Hunter. Olive-drab / desert-tan / urban-grey palette.
  • "REGISTER: HUNTER-DROID" → render a LONE-WOLF HUNTER-TRACKER DROID (scope-eye predator-optic dominant on the head, slung long-rifle / anti-material rifle, wilderness-camo or stealth-cloak chassis). Lineage: Predator (mechanical) / Mandalorian-style bounty-droid / Boba Fett tracker. Weathered ash-grey / forest-camo / desert-bronze / arctic-white.

DO NOT render a cyber-ninja unless the tag is "REGISTER: NINJA". If it says "REGISTER: COMBAT-ASSAULT", you write "Matte-gunmetal combat-assault droid with..." (NOT cyber-ninja). If "REGISTER: CYBER-COP", you write "Urban-grey cyber-cop droid with sealed riot-helmet..." (NOT cyber-ninja). Same for MILITARY-SOLDIER and HUNTER. The tag is LOAD-BEARING.

The scene is HALF the image — rich sci-fi backdrop with secondary context elements.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Cinematic shadow-and-rim emphasis, single key-light + deep shadow side, atmospheric haze with cool blue / cold green / crimson accent.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE — ACCENT-DOMINANT MODE ━━━
The droid is monochromatic chassis tone (per register lean) + ONE saturated GLOW COLOR carried through optics / circuit-veins / power-core / weapon-edge. The scene palette can have secondary tones in BACKGROUND atmosphere.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ DO NOT DEFAULT ━━━
Do NOT default to:
- ONE-NOTE NINJA-BOT across every render — embrace the 5-register spread
- HUMAN FACE / WOMAN FACE / FEMME-CODED CHASSIS — pure predator-droid
- POSED FASHION-STILL — always predatory pose OR clear kinetic action
- EMPTY VOID BACKGROUND — always atmospheric sci-fi scene with context
- "Pretty robot in a kimono" / "robot girl with a gun" — this is a PREDATOR-DROID WEAPON-SYSTEM

━━━ BANNED IMAGERY ━━━
NO skulls / skeletons / bone imagery. NO HUMAN FACE features. NO HUMAN HAIR. NO FEMALE-CODED SILHOUETTE (no breast curvature, no bust line, no hourglass waist, no cleavage-coded chest, no feminine pelvis curves). NO high heels, NO stilettos, NO decorative footwear. NO floating objects in the sky. NO explicit blood-spatter, NO corpses, NO mid-firing weapon-discharge in progress. NO smiling-for-the-camera. NO posing-for-camera. NO actual samurai-cosplay armor (sleek chassis, not lacquered samurai-plate).

━━━ SOLO COMPOSITION ━━━
The predator-droid is the ONLY droid focal figure in the frame. Secondary scene actors (drones / guards / fleeing targets / disabled robots) can appear in the BACKGROUND or scene context but are NOT the focal subject.

━━━ DO NOT USE "MECHBOT" OR ANY BOT NAME ━━━
The droid is UNNAMED. Describe by appearance + role.

━━━ STRUCTURE — write 70-100 words (TIGHT) ━━━
DO NOT open with framing words. Open with the SCENE / setting (neon-rain Tokyo rooftop / war-torn battlefield / cyberpunk precinct / fog-shrouded forest) OR the PREDATOR-DROID identity (chassis color / register / weapon).

GOOD OPENING EXAMPLES (vary across all 5 registers):
• NINJA: "Jet-black cyber-ninja droid with sleek polished Genji-class faceplate and electric-blue optic-strip, katana drawn low along its energy-edge, low-crouch stalk across rain-slick neon Tokyo rooftop at midnight..."
• COMBAT-ASSAULT: "Matte-gunmetal combat-assault droid with Death-Trooper helmet and paired kill-red optic-lenses, heavy plasma-cannon raised in two hands, mid-breach through smoking bunker doorway with debris exploding outward..."
• CYBER-COP: "Urban-grey cyber-cop droid with sealed riot-helmet and single horizontal blue visor-strip, combat-shotgun raised at the lens, glowing precinct-insignia on left pauldron, standing in rain-slick cyberpunk alley with hover-spinner descending behind..."
• MILITARY-SOLDIER: "Olive-drab military-soldier droid with helmeted combat head + amber HUD-visor, Helghast-style scanner-bar across the brow, combat-rifle held tactical-low, mid-patrol across alien-colony outpost perimeter with distant arc-lightning..."
• HUNTER: "Ash-grey hunter-droid with scope-eye predator-optic dominant on its head and exposed cranial sensor-array, anti-material rifle slung over shoulder, perched in low-crouch on a frozen tundra ridge overlooking distant prey-target..."

Then weave: chassis material, mechanical feature, VISIBLE WEAPONS, action (predator-lens), SCENE (atmospheric sci-fi context), lighting/atmosphere, palette, mood. Foreground PREDATORY POSE + VISIBLE ARMAMENT + ATMOSPHERIC SCENE + DRAMATIC RIM-LIGHT.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  // killer-cyborgs-male — MALE mirror of MECHBOT_KILLER_CYBORGS (2026-06-09).
  MECHBOT_KILLER_CYBORGS_MALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      xeno_being,
      organic,
      eyes,
      signature_wow,
      biome,
      look,
      composition,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ MENACING ATMOSPHERE (weave in — don't let it steal focus from the killer) ━━━
${drama}
`
      : '';

    return `You are a master photoreal sci-fi artist rendering a SLEEK COOL ANTIHERO OUTLAW CYBORG for MechBot — a stylish, cool cyberpunk antihero with PERSONALITY (gun-for-hire / bounty-hunter / merc / rogue / smuggler / lone-ronin). He is a lethal, STYLISH man fused with sleek polished cyborg gear + a signature stylish flair — a cool antihero you'd put on a poster, NOT a scruffy scavenger. Lean into sleek, cool, stylish Cyberpunk-2077 / Cowboy-Bebop antihero cyberpunk. NEVER a pretty-boy, NEVER scruffy/junkyard, NEVER bare-chested.

━━━ LOOK REGISTER — THE VISUAL TREATMENT (AUTHORITY — OPEN your prompt with this) ━━━
${look}

This sets the ENTIRE rendering register — palette, lighting mood, finish. OPEN your Flux prompt with these look tokens; they lead CLIP. Render everything below in THIS look. Each render rolls a different look — never collapse to one default register.

━━━ THE ASSASSIN CYBORG (the HERO — render with obsessive, lethal detail) ━━━
${xeno_being}

He is the focal subject: a sleek, COOL antihero OUTLAW cyborg with PERSONALITY. Render his face (a sleek mask/visor OR a cool sharp visible face), his sleek stylish gear, his signature flair, and his sleek cyborg augments + weapon EXACTLY as described — a different cool antihero every render. Lethal, stylish, cool.

━━━ SLEEK COOL ANTIHERO — stylish, NOT scruffy ━━━
He is a SLEEK, COOL cyberpunk antihero — a stylish man with cool ATTITUDE (a confident smirk / cold swagger), fused with SLEEK, POLISHED, personalized cyborg gear + a SIGNATURE stylish flair (a sharp tailored long coat / a sleek hood or cowl / sleek goggles or visor / a clean bandolier / a sleek cybernetic arm). Lean-to-athletic build. Polished, sharp, badass — every render a DIFFERENT cool antihero. NEVER scruffy / junkyard / war-paint-raider / bushy-bearded, NEVER a pretty-boy, NEVER a faceless robot / mech / skeleton. ABSOLUTELY NO HATS — no fedora / cowboy-hat / wide-brim / brimmed hat of any kind (hoods/cowls/visors only).

━━━ HIS FACE/HEAD — sleek mask OR cool sharp face (render clearly) ━━━
${organic}

Render his FACE/HEAD EXACTLY as described — EITHER a sleek mask / visor / goggles / face-wrap (cool, mysterious) OR a striking cool sharp visible face (hard, confident, with cool flair) + integrated cyber. COOL and stylish — NEVER a pretty-boy, NEVER a bare-skull, NEVER a scruffy bum, NEVER a generic robot helmet.

━━━ HIS EYES (glowing) ━━━
${eyes}
Render his eyes exactly this way — cold and lethal.

━━━ THE WEAPON (render it prominently — carried or being used) ━━━
${signature_wow}

━━━ COMPOSITION — HE IS THE MAIN FOCUS ━━━
${composition}
He is the HERO of the frame — large, central, his lethal presence, agile build, and weapon reading clearly. A striking, dangerous presence (full-body or three-quarter favored).

━━━ THE COOL/DARK SCI-FI SETTING (but HE stays the focus) ━━━
${biome}

Render a cool, dark, atmospheric sci-fi environment with real depth behind and around him — but HE is the main focus, large and central. The setting frames and elevates him without stealing attention.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ LETHAL — NOT SHIRTLESS, NOT PIN-UP ━━━
He is a cool, dangerous antihero. His torso is ALWAYS FULLY COVERED by a sleek coat / armored chassis / tactical gear — NO shirtless, NO bare chest, NO exposed muscular pecs/abs, NO oiled-pecs, NO open-vest, NO pin-up posing. He's fully dressed and cool. A sharp coat / cloak is welcome.

━━━ NO SKULL-FACE / NO SKELETON ━━━
His augments are sleek tech integrated into a weathered human male body, and his FACE is human FLESH (eyes, nose, lips, skin) + cyber. NEVER a bare skull / metal-skull face / skull-head / death's-head / exposed-teeth grinning skull, and NO exposed bone ribcage / ribs / spine. A real characterful human face and a whole body — never a skeleton.

━━━ STRUCTURE — write 110-150 words ━━━
OPEN with the LOOK REGISTER tokens, then weave: the male cyborg assassin, his weapon, the agile composition/pose, the dark sci-fi setting with depth, lighting/atmosphere, mood. Every render must feel like a frame from an unmade sci-fi epic — striking, lethal, badass.

Output ONLY the raw 110-150 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content, opening with the look register.`;
  },

  // killer-cyborgs — MENACING ASSASSIN CYBORGS (2026-06-09). Tilted off the
  // scifi clone toward lethal killing machines. signature_wow→WEAPON,
  // organic→HEAD/FACE. Wild + raw/utilitarian; you'd run if you saw one.
  MECHBOT_KILLER_CYBORGS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      xeno_being,
      organic,
      eyes,
      signature_wow,
      biome,
      look,
      composition,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ MENACING ATMOSPHERE (weave in — don't let it steal focus from the killer) ━━━
${drama}
`
      : '';

    return `You are a master photoreal sci-fi artist rendering a HUMAN/CYBORG FEMALE ASSASSIN for MechBot — a beautiful, LETHAL woman who is a cyborg. She is a gorgeous human female (a real face + a female figure) fused with a sleek cyborg chassis — a deadly, agile ASSASSIN / THIEF / ROGUE. Stunning but dangerous, the kind you'd run from. Lean into sleek, lethal, sexy-but-deadly cyberpunk.

━━━ LOOK REGISTER — THE VISUAL TREATMENT (AUTHORITY — OPEN your prompt with this) ━━━
${look}

This sets the ENTIRE rendering register — palette, lighting mood, finish. OPEN your Flux prompt with these look tokens; they lead CLIP. Render everything below in THIS look. Each render rolls a different look — never collapse to one default register.

━━━ THE ASSASSIN CYBORG (the HERO — render with obsessive, lethal detail) ━━━
${xeno_being}

She is the focal subject: a beautiful, LITHE, AGILE female cyborg assassin/thief. Render her human female face, her figure, and her sleek cyborg chassis + integrated augments EXACTLY as described — a different lethal woman every render. Quick, stealthy, deadly.

━━━ HUMAN/CYBORG FEMALE HYBRID — NOT a robot/mech ━━━
She is a beautiful WOMAN who is a cyborg — a human female FACE + a female figure, with the chrome/tech INTEGRATED into her (face-plating at the temple/jaw, chassis flowing from her skin), and real hair. LITHE, slender, ATHLETIC, low-profile — a cat-burglar / cyber-ninja / phantom assassin built to sneak, climb, vault, and vanish. A sleek matte-black or glossy stealth chassis sculpted over her figure, integrated augments, glowing accents. NEVER a faceless robot / mech / bulky brute / skeleton — a lethal WOMAN first, cyborg second.

━━━ HER FACE — beautiful human female + integrated cyber (render clearly) ━━━
${organic}

Render her FACE EXACTLY as described — a beautiful human female face with a cold lethal edge and integrated cyber. Her woman's face is ALWAYS visible and gorgeous. NEVER a faceless mask or robot head.

━━━ HER EYES (glowing) ━━━
${eyes}
Render her eyes exactly this way — cold and lethal.

━━━ THE WEAPON (render it prominently — carried or being used) ━━━
${signature_wow}

━━━ COMPOSITION — SHE IS THE MAIN FOCUS ━━━
${composition}
She is the HERO of the frame — large, central, her lethal beauty, agile build, and weapon reading clearly. A striking, dangerous presence (full-body or three-quarter favored).

━━━ THE COOL/DARK SCI-FI SETTING (but SHE stays the focus) ━━━
${biome}

Render a cool, dark, atmospheric sci-fi environment with real depth behind and around her — but SHE is the main focus, large and central. The setting frames and elevates her without stealing attention.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ LETHAL — NOT CUTE, NOT PIN-UP ━━━
She is a KILLER — beautiful but deadly, dangerous, the kind you'd run from. Sexy-but-deadly is the vibe, but TASTEFUL: her chassis/stealth-suit covers her — no bare breasts, no nipples, no lingerie, no pin-up posing. The lethal edge carries it. A cloak / hood is welcome.

━━━ NO BARE SKELETON ━━━
Her augments are sleek tech integrated into a human female body. NO bare bone skeleton — no exposed ribcage / ribs / spine / vertebrae / bone-skull. Whole and lethal, never skeletal.

━━━ STRUCTURE — write 110-150 words ━━━
OPEN with the LOOK REGISTER tokens, then weave: the female cyborg assassin, her weapon, the agile composition/pose, the dark sci-fi setting with depth, lighting/atmosphere, mood. Every render must feel like a frame from an unmade sci-fi epic — beautiful, lethal, badass.

Output ONLY the raw 110-150 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content, opening with the look register.`;
  },

  MECHBOT_SCIFI_CYBORG_FEMALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      xeno_being,
      organic,
      eyes,
      signature_wow,
      biome,
      look,
      composition,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ EXOTIC PHENOMENON (weave in — don't let it steal focus from her) ━━━
${drama}
`
      : '';

    return `You are a visionary sci-fi concept artist writing an EXOTIC ALIEN-CYBORG FEMALE scene for MechBot. The goal is a "WOW!!" — a genuinely out-there, otherworldly cyborg woman that makes the viewer stop scrolling and stare. She is SIMULTANEOUSLY a beautiful feminine being AND something truly alien and machine. Push HARD into the strange and wondrous — this is an AI dream-app, lean all the way into exotic sci-fi.

━━━ LOOK REGISTER — THE VISUAL TREATMENT (AUTHORITY — OPEN your prompt with this) ━━━
${look}

This sets the ENTIRE rendering register — palette, lighting mood, finish. OPEN your Flux prompt with these look tokens; they lead CLIP. Render everything below in THIS look. Each render rolls a different look — never collapse to one default glossy register.

━━━ THE ALIEN-CYBORG BEING (the HERO — render with obsessive, otherworldly detail) ━━━
${xeno_being}

She is the focal subject: an elegant, FEMININE, genuinely ALIEN cyborg woman. Render her exotic anatomy + cyborg fusion + body material EXACTLY as described — a different alien race every render, so commit fully to what she IS. Beautiful and strange in equal measure.

━━━ LEAN HARD INTO THE ALIEN/CYBORG HYBRID (the cool look) ━━━
The magic is the HYBRID — exotic ALIEN biology fused with a sleek CHROME CYBORG chassis, into ONE being, with glowing internal light or accent-glow threaded through. Push BOTH sides hard: polished chrome plating / sculpted mechanical panels / exposed servo-and-cable detail / glowing cores — fused seamlessly with her exotic alien features (elongated head / crests / exotic glossy skin / alien eyes). Half-organic, half-machine, gorgeous and otherworldly. This hybrid LOOK is the whole point.

━━━ HER ORGANIC SIDE — THE LIVING FACE + ALIEN BIOLOGY (render this clearly) ━━━
${organic}

This is the AUTHORITY on her face, skin, and organic biology — render her face and exposed flesh EXACTLY as described (human or alien, with whatever alien biology it specifies: extra eyes / head-tendrils / translucent-organ skin / crests / gills / skin color). Where the being above and this organic side meet, the machine is fused INTO this living flesh. Her face reads clearly and beautifully.

━━━ HER EYES (glowing) ━━━
${eyes}
Render her eyes exactly this way (honour any eye-count her alien biology specifies above).

━━━ THE SHOWSTOPPER (the ONE wow-element — render it prominently) ━━━
${signature_wow}

━━━ COMPOSITION — THE CHARACTER IS THE MAIN FOCUS ━━━
${composition}
She is the HERO of the frame — large, central, her hybrid design the star. Use the rolled framing as a hint, but DO NOT bury her in an elaborate ACTION or narrative (no descending-staircases / mid-stride / theatrical staging) — showcase her cool alien/cyborg LOOK with a striking, mostly-still presence.

━━━ THE COOL SCI-FI SETTING (keep it cool — but SHE stays the focus) ━━━
${biome}

Render a cool, atmospheric sci-fi environment with real depth behind and around her — but SHE is the main focus, large and central. The setting frames and elevates her without stealing attention.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ TASTEFUL — exotic elegance, NOT pinup ━━━
She is alluring through ALIEN WONDER and elegant power, never through skin. Her own exotic anatomy / chassis / chitin / scales / plating is her covering. No bikini-chassis, no cleavage-as-focus, no pin-up posing — the awe of WHAT SHE IS carries it.

━━━ NEVER SKELETAL ━━━
She is a sleek, WHOLE, elegant FEMININE figure with a clearly readable face. NEVER skeletal anatomy — no exposed ribcage, no visible ribs, no exposed spine or vertebrae, no bones, no skull-faced or skeleton look. Exotic surfaces and forms, never a skeleton or a bare creature-skull.

━━━ STRUCTURE — write 110-150 words ━━━
OPEN with the LOOK REGISTER tokens, then weave: the alien-cyborg being, her showstopper feature, the composition/pose, the exotic environment with depth, lighting/atmosphere, mood. Every render must feel like a frame from an unmade sci-fi epic — exotic, wondrous, jaw-dropping.

Output ONLY the raw 110-150 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content, opening with the look register.`;
  },

  MECHBOT_OG_CYBORG_FEMALE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, hair, cyber_feature, eyes, setting, composition, drama } =
      slots;

    const dramaSection = drama
      ? `
━━━ SUBTLE ATMOSPHERE (soft accent — never clutter) ━━━
${drama}
`
      : '';

    return `You are a master photoreal sci-fi artist rendering a BEAUTIFUL SEXY FEMALE CYBORG for MechBot — Sorayama-chrome meets Ghost-in-the-Shell beauty. She is a GORGEOUS WOMAN who is a cyborg: human-proportioned, a flawless beautiful face, a curvy feminine figure clad in a glossy sculpted chassis. HYPER-PHOTOREAL — high-end cinematic 3D render quality, realistic skin and reflections, crisp detail.

━━━ ABSOLUTE BAR — BEAUTIFUL WOMAN FIRST, CYBORG SECOND ━━━
She reads as a stunning woman first, cyborg second. A real, beautiful human(oid) FACE — NEVER an alien creature, NEVER insectoid, NEVER a monster, NEVER a faceless mannequin. Photoreal beauty render.

━━━ INTEGRATED FACE — NOT A HEAD ON A ROBOT (the #1 failure to avoid) ━━━
The chrome and tech INTEGRATE INTO her face and head — partial chrome face-plating across the temple / crown / cheek / jaw, glossy chrome flowing seamlessly from her neck UP INTO her face, glowing circuitry on her skin, her glossy skin and the chassis ONE continuous surface. She is a single seamless cyborg design. NEVER a plain human head pasted on top of a separate generic robot body.

━━━ SKIN ━━━
Pale / fair OR a STYLIZED exotic sci-fi color (emerald-green-glitter / cobalt-blue / pearl-white / soft-violet / chrome-silver / rose-gold / stylized-obsidian jet-black synthetic finish). NEVER a realistic ethnic-RACE skin tone (no African-American / deep-ebony / dark-brown realistic-race skin).

━━━ FRAMING — PULL THE CAMERA BACK (important) ━━━
Show her from at least the WAIST UP, and frequently FULL-BODY (head-to-hip or head-to-foot). We must SEE HER BODY — her chassis, her figure, her pose. Do NOT default to a neck-up headshot or a face close-up. The composition axis below sets the exact framing; when in doubt go WIDER, never tighter than waist-up.

━━━ THE CYBORG WOMAN (the HERO — render exactly) ━━━
${subject}

Render her skin, her flawless face, her curvy figure, and her glossy sculpted chassis EXACTLY as described — sleek panels over her body, exposed mechanical detail at the joints (neck / shoulders / spine / arms), glowing accent-lights threaded through. High-gloss, photoreal.

━━━ HAIR ━━━
${hair}

━━━ SIGNATURE CYBER FEATURE (render prominently) ━━━
${cyber_feature}

━━━ EYES (glowing) ━━━
${eyes}

━━━ COMPOSITION + POSE ━━━
${composition}

━━━ BACKGROUND (soft — she is the focus) ━━━
${setting}
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 180)}

━━━ TASTEFUL-SEXY ━━━
She is sexy through her curvy sculpted form, gloss, and beauty — NEVER through bare skin. The glossy chassis / panels COVER her body. NO bare breasts, NO nipples, NO topless, NO lingerie. NO exposed ribcage / skeleton — her chassis is smooth and whole.

━━━ STRUCTURE — write 100-140 words ━━━
Open with the cyborg woman (skin + beautiful face + glossy chassis), then weave: hair, her signature cyber feature, glowing eyes, composition/pose, soft background, lighting/atmosphere. PHOTOREAL beauty render — crisp, glossy, gorgeous.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },
};
