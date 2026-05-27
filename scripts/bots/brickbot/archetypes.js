/**
 * BrickBot archetypes — path-bespoke axis-system definitions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js. Each archetype
 * declares which axis slots its path rolls + the conditional drama
 * layer. The matching brief-builder template lives in
 * ./archetype-templates.js.
 */

module.exports = {
  BRICKBOT_WESTERN: {
    description: `PATH-BESPOKE — BrickBot western path (2026-05-27 migration). WILD-WEST FRONTIER LEGO MOC diorama photography — sheriffs, outlaws, cowboys, prospectors, railroad crews; saloons, ghost towns, mining camps, forts, boom-towns; stagecoaches, steam locomotives, mine-carts; set in brick badlands, mesas, slot-canyons, and desert flats. Canon: classic LEGO Western (1996-97 — Cowboys / Fort Legoredo cavalry / Gold City Junction / Boulder Blasters / Bandit's Secret Hideout) + spaghetti-western + gold-rush-boomtown + railroad-frontier coding + Bricklink AFOL western-MOC community. RESPECTFUL frontier framing — cowboys/outlaws/sheriffs/prospectors/railroad/cavalry register only; NO dated "cowboys-vs-Indians" caricature.

A character + setting path: frontier characters in mid-action against brick frontier towns + desert terrain. Moderate photoreal risk on the desert terrain (shared with landscape) — handled by the build_technique brick-mandate for sandstone/mesa.

9 path-bespoke slots + 1 conditional:
  • scene_type          — frontier stage (saloon-showdown / main-street-standoff / train-robbery / stagecoach-chase / gold-mine-dig / ghost-town / cavalry-fort / cattle-drive / river-ford-crossing / boom-town-street / sheriff-office / bank-heist / canyon-ambush / trading-post / campfire-night / mesa-lookout / mine-headframe / railroad-construction)
  • minifig_action      — verb-led western beat (mid-quickdraw / mid-lasso-throw / mid-saloon-brawl / mid-train-car-leap / mid-gold-pan / mid-horse-gallop / mid-stagecoach-rein-haul / mid-bank-vault-crack / mid-campfire-tale / mid-wanted-poster-nail / mid-mine-cart-push)
  • build_technique     — western-MOC distinguisher (clapboard-facade timber buildings with false-fronts / SNOT sandstone-mesa strata / Technic-articulated stagecoach + locomotive wheels / spring-swinging saloon batwing-doors / trans-blue river-ford plates / brick-built saguaro cactus + tumbleweed / boardwalk-planking with tile / mine-headframe Technic-rig)
  • camera_framing      — western framing (main-street-high-noon-standoff / saloon-interior-over-the-bar / stagecoach-chase-tracking / canyon-rim-ambush-down / train-top-running / mesa-silhouette-wide / sheriff-porch-low / mine-shaft-down / boardwalk-receding)
  • subject_focus       — silhouette anchor (REPLACES vehicle_class) — STRUCTURE (saloon / cavalry-fort / sheriff-office / mine-headframe / train-depot / bank / water-tower / trading-post) OR MOUNT/VEHICLE (saddled horse / stagecoach-and-team / steam-locomotive / handcar / mine-cart / covered-wagon / buckboard) OR no-vehicle INTERIOR (saloon-interior / sheriff-office / bank-vault / mine-shaft / general-store) OR no-vehicle LANDSCAPE (mesa-badlands / slot-canyon / desert-flat / river-ford / butte-field)
  • register            — frontier heritage lock, ~80% iconic LEGO Western (classic-LEGO-Cowboys sheriff-vs-outlaw / Fort-Legoredo-cavalry-blue / Gold-City-prospector) + ~20% retro-frontier (spaghetti-western-coded / gold-rush-1849-boomtown-coded / transcontinental-railroad-coded / ghost-town-haunted-coded — strictly in brick)
  • scene_props pickN:2 — diorama fill (wanted-poster / hitching-post + water-trough / brick saguaro cactus / tumbleweed / whiskey-barrel / wagon-wheel / gold-pan + nuggets / sheriff-star-on-the-boardwalk / oil-lantern / rifle-rack / brick campfire + coffee-pot / longhorn-skull / dynamite-crate / telegraph-pole)
  • lighting            — axis-clean: high-noon harsh-shadow / golden-dusk silhouette / saloon oil-lamp warm / campfire-night amber / dust-haze amber-diffuse / moonlit ghost-town blue / mesa-sunrise rose
  • palette             — axis-clean LEGO-coded: rust + ochre + sun-bleached-tan / dusty-leather-brown + sagebrush-green / boomtown-timber + barn-red / gold-rush amber + brown / ghost-town weathered-grey + bone / sunset rust + magenta
  • western_phenomenon (50%-gated) — environmental beat IN BRICK (dust-storm cotton + tan round-plates / rolling tumbleweed / gunsmoke trans-white puffs on rods / train-steam plume of white round-plates / cattle-stampede dust-cloud / heat-shimmer trans-clear tiles / desert-sunset blaze backdrop / circling vulture micro-birds on rods)

Bending advantage: scene_type × subject_focus × register × western_phenomenon decoupled, so "train-robbery + steam-locomotive + railroad-frontier register + gunsmoke" and "saloon-showdown + classic-LEGO-Cowboys register + dust-storm" are rollable. Legacy 4-axis couldn't reach these.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'subject_focus',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'western_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_THEME_PARK: {
    description: `PATH-BESPOKE — BrickBot theme-park path (2026-05-27 migration). AMUSEMENT-PARK + CARNIVAL LEGO MOC diorama photography — roller coasters mid-loop, ferris wheels lit at dusk, carousels mid-spin, drop-towers, swing-rides, haunted houses, log-flumes, bumper cars, midway game-rows, parade floats, food carts, water slides, monorails, all teeming with crowd minifigs in motion. Canon: LEGO Creator Expert Fairground Collection (Ferris Wheel 10247 / Carousel 10257 / Roller Coaster 10261 / Loop Coaster 10303 / Pirate-ship Fairground Mixer / Haunted House 10273 / Grand Carousel) + LEGO City amusement + Friends amusement-park + Bricklink AFOL GBC + working-fairground MOC community + vintage-carnival coding. NEVER licensed-park IP (no Disney/Universal named lands or characters).

This path's identity is KINETIC SPECTACLE + CROWDS — big working brick rides as the hero structures, with masses of tiny crowd minifigs mid-motion and bright trans-element neon. Lower photoreal-drift risk than the nature paths, but the build_technique + register axes keep it reading as a Creator-fairground MOC, not a real-park photo.

9 path-bespoke slots + 1 conditional:
  • attraction          — THE HERO ride/structure (roller-coaster / ferris-wheel / carousel / drop-tower / swing-ride / haunted-house / fun-house / bumper-cars / log-flume / pirate-ship-swing / spinning-teacups / monorail-station / midway-game-row / parade-float / water-slide-tower / big-top-tent / arcade-hall / sky-wheel / fairground-mixer)
  • crowd_action        — verb-led kinetic beat (mid-loop-scream / mid-ferris-peak-photo / mid-carousel-spin / mid-ring-toss / mid-coaster-first-drop / mid-bumper-collision / mid-parade-wave / mid-cotton-candy-handoff / mid-flume-splashdown / mid-prize-win)
  • build_technique     — fairground-MOC distinguisher (Technic-articulated working coaster-track + rotating wheel / GBC-style motion mechanism / trans-element neon-tube signage + chase-lights / SNOT-curved coaster loop / printed-tile ride-signage / micro-crowd minifig massing / Power-Functions-implied motion)
  • camera_framing      — theme-park-specific (coaster-POV-down-the-first-drop / ferris-wheel-looking-up / midway-down-the-game-row / aerial-park-overview / under-the-coaster-structure / carousel-from-inside / parade-route-low / dusk-skyline-of-rides)
  • register            — fairground heritage lock, ~85% iconic LEGO (Creator-Expert-Fairground-Collection ornate-vintage / LEGO-City-modern-amusement / Friends-amusement-pastel / classic-LEGO-fair) + ~15% retro (Coney-Island-1920s-coded / county-fair-Americana-coded / European-Christmas-market-funfair-coded — strictly in brick)
  • scene_life pickN:2  — the park's life (cotton-candy cart / popcorn stand / hot-dog cart / balloon vendor / ticket booth / ring-toss stall / duck-pond game / shooting-gallery / prize-wall of plush-builds / mascot character / churro stand / souvenir kiosk / bench with resting minifigs / string-light arch)
  • lighting            — axis-clean: dusk neon-glow / summer-night with full ride-lights / golden-hour park / fireworks-lit sky / bright midday / haunted-house spooky trans-green / blue-hour with chase-lights
  • palette             — axis-clean LEGO-coded: neon trans-red+blue+yellow / carnival-stripe red+white+gold / candy pink+mint+cream / summer-night navy + neon / Creator-vintage cream+teal+red / Friends pastel-fairground
  • spectacle (50%-gated) — environmental beat IN BRICK (fireworks-burst of trans-element stars / synchronized light-show / fountain water-jet of trans-blue plates / confetti-cannon of 1×1 round-plates / passing parade / balloon-release of round-elements on rods / laser-show trans-bars)

Bending advantage: attraction × build_technique × register × spectacle decoupled, so "roller-coaster + Technic-working-track + Creator-vintage register + fireworks" and "carousel + GBC-motion + Friends-pastel register" are rollable. Legacy 4-axis couldn't reach these.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'attraction',
        'crowd_action',
        'build_technique',
        'camera_framing',
        'register',
        'scene_life',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_life: 2 },
    conditionalLayer: { slot: 'spectacle', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_LANDSCAPE: {
    description: `PATH-BESPOKE — BrickBot landscape path (2026-05-27 migration). EPIC NATURAL-VISTA LEGO MOC diorama photography — the entire NATURAL WORLD rendered in brick: mountain ranges, glacier valleys, redwood groves, desert canyons, coastal cliffs, alpine meadows, plateau mesas, river deltas, savannas, fjords, volcanic fields, badlands. Canon: AFOL "brick-built landscape" MOC tradition (the convention-tier all-brick nature dioramas) + LEGO Creator/Ideas natural builds + the EarthBot "Marc-Adamus / Peter-Lik gallery vista" aesthetic translated entirely into LEGO bricks.

THE DEFINING DIFFERENCE FROM EVERY OTHER BRICKBOT PATH — this path is SCENERY-LED, not character-led or structure-led. The LANDSCAPE ITSELF is the hero/subject; minifigs (if any) are TINY SCALE-PROVERS only (a lone hiker on a ridge, two climbers on a cliff, a photographer at an overlook), NEVER the focus. So it has NO minifig-action axis and NO LEGO-faction register (there is no "Castle/Space faction" for a mountain). Instead its bespoke axes make the all-brick NATURE read as a gallery-tier vista. AND because "epic natural vista" is Flux's single strongest photoreal prior, the terrain_build_technique axis + the template's per-element brick mandate are the load-bearing anti-photoreal guard.

8 path-bespoke slots + 1 conditional:
  • biome_vista          — THE HERO SUBJECT: which natural vista (alpine-peak-range / glacier-carved-valley / redwood-old-growth-grove / desert-slot-canyon / sea-cliff-coast / alpine-wildflower-meadow / plateau-mesa-badlands / braided-river-delta / savanna-at-dawn / fjord / volcanic-caldera / sequoia-grove / frozen-waterfall-cliff / canyon-river-bend / rolling-tundra)
  • terrain_build_technique — THE anti-photoreal star: how natural TERRAIN reads as brick (SNOT rock-strata slope-layers / BURP-LURP cliff faces / trans-blue layered-plate rivers + lakes + waterfalls / white-plate + slope snow-caps / tan-slope dune ripples / round-plate + cheese-slope scree / brick-built cloud-banks of white round-plates / stacked-plate canyon striations)
  • scale_prover pickN:2  — the TINY elements that prove the vista's monumental scale, placed at DIFFERENT depths (a lone hiker minifig on a ridge / two roped climbers on a cliff face / a photographer at an overlook / a single tent at the valley floor / a tiny canoe on the river / a brick eagle riding a thermal / a deer-herd of micro-builds / a lone cabin / a switchback trail of figures) — always DWARFED by the terrain
  • flora_detail          — the brick vegetation dressing the biome (brick-pine forest belt / plant-element wildflower carpet / redwood trunk-columns / desert cactus + brush builds / autumn-aspen grove / savanna acacia builds / tundra moss-plate + lichen / fern-element understory / palm cluster)
  • camera_framing        — vista framing (sweeping high-aerial / valley-floor-looking-up-at-peaks / ridge-line-panorama / through-a-slot-canyon / reflection-in-a-still-lake / summit-overlook-vista / aerial-river-bend / worm's-eye-up-a-redwood / cliff-edge-vertigo-down)
  • atmosphere           — brick-rendered weather/atmospheric layer (crisp-clear-deep-distance / low cloud-sea below peaks / morning valley-mist / gathering storm-cloud bank / golden atmospheric-haze / light snow-flurry / rolling ground-fog) — clouds/mist built from white round-plates + cotton-elements
  • lighting             — light direction + quality (low raking side-light / backlit rim-light on ridges / high-noon top-light / god-rays through a cloud-gap / warm low-sun gild / cool shadowed-valley / alpenglow on the peaks)
  • palette              — time-of-day + biome color, in LEGO brick colors (golden-hour amber + tan / blue-hour twilight + slate / high-noon saturated greens + azure / dawn-pink + lavender mist / sunset magenta + ember / overcast cool-grey + sage / desert rust + ochre + cream / alpine white + grey + pine)
  • natural_phenomenon (50%-gated) — a dramatic natural EVENT in brick (waterfall-mist cloud / trans-arc rainbow / lightning-strike trans-bolt / built avalanche-cloud down a face / river-rapids white-foam / geyser-plume / aurora over the range / volcanic trans-orange lava-glow / migrating brick-bird flock / rockslide)

Bending advantage: biome_vista × terrain_build_technique × atmosphere × lighting × palette × natural_phenomenon decoupled, so "glacier-valley + SNOT rock-strata + low-cloud-sea + alpenglow + rainbow" and "desert-slot-canyon + stacked-plate striations + golden-haze + god-rays" are rollable. The legacy 4-axis pool conflated everything into one WIDE-shot string and drifted photoreal; this splits terrain-construction out as its own load-bearing brick axis.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'biome_vista',
        'terrain_build_technique',
        'scale_prover',
        'flora_detail',
        'camera_framing',
        'atmosphere',
        'lighting',
        'palette',
      ],
    },
    pickN: { scale_prover: 2 },
    conditionalLayer: { slot: 'natural_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_WINTER: {
    description: `PATH-BESPOKE — BrickBot winter path (2026-05-27 migration). SNOW + ICE LEGO MOC diorama photography — cozy alpine villages, ski resorts, frozen lakes, ice castles, igloo camps, polar research stations, frozen waterfalls, blizzard rescues, hot-cocoa cabin interiors, husky-sled runs. Canon: LEGO Winter Village (Ideas — Toy Shop / Bakery / Market / Holiday Train / Fire Station / Gingerbread House / Elf Club House) / LEGO City Arctic Explorers (orange-white icebreakers, snowcats, ice-saws) / Friends winter (ski-resort, ice-rink) / Creator winter cabin + classic alpine. NOT sci-fi ice (Ice Planet is the space path's register).

THE PHOTOREAL-DRIFT RISK — snow + ice are among Flux's strongest photoreal priors (like forest's birch problem). The bespoke snow_ice_build_technique axis + the template's per-element brick mandate translate every snowdrift / icicle / frozen-lake / blizzard into NAMED BRICK PARTS so the render reads as a cozy brick winter MOC, never a real ski photo.

10 path-bespoke slots + 1 conditional:
  • scene_type           — winter stage (alpine-ski-village / frozen-lake / ice-castle / igloo-camp / polar-research-station / frozen-waterfall / blizzard-rescue / winter-village-square / ski-slope / ice-fishing-hut / hot-cocoa-cabin-interior / husky-sled-run / frozen-harbor / ice-rink / snowman-meadow / mountain-gondola)
  • minifig_action       — verb-led winter beat (mid-ski-carve / mid-snowball-throw / mid-cocoa-pour / mid-sled-mush / mid-ice-fish-haul / mid-snowman-roll / mid-rescue-dig / mid-skate-glide / mid-icicle-knock / mid-fire-stoke / mid-gondola-board)
  • snow_ice_build_technique — THE bespoke star axis: how SNOW + ICE read as brick (white slope-brick + plate drifts / smooth-tile ice-patches / SNOT trans-light-blue ice-castle curvature / trans-clear icicle bar-elements / smooth trans-blue tile frozen-lake sheet / cotton-element snow-flurry / white-stud snow-texture on every roof + branch / packed-snow rounded-slope mounds)
  • camera_framing       — winter-specific (ski-slope-downhill / frozen-lake-low-across-the-ice / village-square-overhead / cabin-window-warm-interior-out-to-cold / icicle-cave-through / sled-trail-tracking / summit-aerial / gondola-POV)
  • subject_focus        — silhouette anchor (REPLACES vehicle_class) — STRUCTURE (timber-chalet / ice-castle / igloo / gondola-tower / research-station / covered-bridge / winter-village-shop) OR CREATURE-MOUNT (husky-sled-team / reindeer / polar-bear / snowy-owl) OR no-vehicle INTERIOR (hot-cocoa-cabin / ski-lodge-fireside / research-hut / toy-shop) OR no-vehicle LANDSCAPE (powder-slope / frozen-lake / snow-pine-forest / glacier-field)
  • register             — winter heritage lock, ~85% iconic LEGO winter heritage (Winter-Village-cozy-red-green-white-gold / City-Arctic-Explorers-orange-white-black-tech / Friends-winter-resort-pastel / Creator-natural-log-cabin / classic-alpine) + ~15% retro (Currier-and-Ives-coded / vintage-alpine-travel-poster-coded — strictly in brick)
  • scene_props pickN:2  — diorama fill (snowman / wood-sled / cocoa-mug / ski-pair / hanging-lantern / pine-wreath / icicle-cluster / firewood-stack / ice-skate-pair / wrapped-gift-pile / snowball-stack / brazier / carrot-nosed-snow-pile / string-lights)
  • lighting             — axis-clean: warm-window-glow on cool-blue snow / golden alpine-sunset / overcast flat-snow light / aurora trans-cyan-green / hearth-fire amber / blue-hour twilight-snow / bright bluebird-day / lantern-festival warm
  • palette              — axis-clean LEGO-coded: Winter-Village red+green+white+gold / Arctic orange+white+black / ice-blue+silver+white / Friends pastel-blue+pink+white / cabin red+pine+amber / aurora teal+violet+green
  • winter_phenomenon (50%-gated) — environmental beat IN BRICK (white-round-plate snow-flurry on rods / aurora trans-cyan-green-violet built arc / blizzard-whiteout cotton+white-plate veil / cotton-element frozen-mist / trans-clear icicle-glint / fresh-snowfall dusting / trans-blue cracking-ice line / northern-lights curtain)

Bending advantage: scene_type × snow_ice_build_technique × register × winter_phenomenon decoupled, so "ice-castle + SNOT trans-blue curvature + Winter-Village register + aurora" and "husky-sled-run + City-Arctic register + blizzard-whiteout" are both rollable. Legacy 4-axis couldn't reach these AND lacked the per-element brick-mandate that stops photoreal-snow drift.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'snow_ice_build_technique',
        'camera_framing',
        'subject_focus',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'winter_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_AQUATIC: {
    description: `PATH-BESPOKE — BrickBot aquatic path (2026-05-27 migration). BEACH + UNDERWATER LEGO MOC diorama photography — tropical-paradise SURFACE world (beach bonfires, surf shacks, lighthouse cliffs, boardwalks, tide-pools, sandcastle contests) AND the SUBMERGED world (coral reefs, kelp forests, shipwrecks, deep-sea trenches, mermaid grottos, sunken treasure). Canon: LEGO Atlantis 2010 (gold-treasure deep-sea quest) / Aquazone 1995-98 (Aquanauts yellow-black + Aquasharks + Stingrays + Hydronauts) / LEGO City Deep Sea Explorers (white-azure-lime subs) / Friends Heartlake beach + dolphin-rescue / Creator beach-house + lighthouse / Ideas Ship-in-a-Bottle / Bricklink AFOL reef + beach-diorama community + retro Jules-Verne-Nautilus + Cousteau-Calypso coding. NOT pirates (own path).

THE DEFINING DUALITY — every render is either a SURFACE (beach/coast/boardwalk, air + sand + sun) or SUBMERGED (reef/kelp/trench, water-column + caustics + marine life) scene; the build techniques, lighting, palette, and creatures differ sharply between the two. The axes below are bespoke to make BOTH worlds read as gorgeous all-brick MOCs.

10 path-bespoke slots + 1 conditional:
  • scene_type          — surface OR submerged stage (coral-reef-plaza / kelp-forest-canyon / shipwreck-reef / deep-trench / mermaid-grotto / beach-bonfire / surf-shack / lighthouse-cliff / tide-pool / boardwalk / sandcastle-contest / dolphin-cove / submarine-dock / sunken-temple / lagoon-snorkel)
  • minifig_action      — verb-led aquatic beat (mid-dive-descent / mid-snorkel-point / mid-surf-carve / mid-net-haul / mid-bonfire-light / mid-treasure-pry / mid-creature-release / mid-sandcastle-pat / mid-tide-pool-crouch / mid-airlock-flood)
  • water_build_technique — THE bespoke star axis: how WATER reads as brick (trans-blue layered-plate water-column / SNOT trans-light-blue wave-curl with white-stud foam / trans-clear bubble-strings on bar-rods / brick-built coral from modified-plant + horn + 1×4 fence elements / kelp from stacked green plant-stems / caustic-shimmer via trans-clear tiles / tan slope-brick seafloor + dune)
  • camera_framing      — aquatic-specific (waterline-split-half-above-half-below / underwater-looking-up-at-surface / reef-wall-tracking / through-the-kelp / beach-low-tide-wide / lighthouse-cliff-aerial / tide-pool-macro / submarine-porthole-round / dive-descent-vertical)
  • subject_focus       — silhouette anchor (REPLACES vehicle_class) — STRUCTURE (lighthouse / surf-shack / brick submarine / Atlantis-gate / sunken-temple / reef-arch / pier) OR CREATURE-MOUNT (riding sea-turtle / manta-ray / dolphin / giant-seahorse / orca) OR no-vehicle INTERIOR (submarine-cabin / beach-hut / lighthouse-lamp-room / underwater-research-dome) OR no-vehicle LANDSCAPE (open-coral-reef / kelp-forest / tide-pool-shelf / beach-cove)
  • register            — aquatic heritage lock, ~85% iconic LEGO marine heritage (Atlantis-gold-treasure / Aquazone-Aquanauts-yellow-black / Aquasharks-grey-orange / Deep-Sea-Explorers-white-azure-lime / Friends-Heartlake-beach-pastel / Creator-natural-beach) + ~15% retro (Jules-Verne-Nautilus brass / Cousteau-Calypso vintage-dive / AFOL reef-MOC)
  • marine_life pickN:2 — bespoke creature-fill axis (brick-built sea creatures the reef/beach is alive with: sea-turtle / manta-ray / clownfish-school / reef-shark / octopus / seahorse-pair / moon-jellyfish drift / dolphin-pod / starfish-cluster / moray-eel / hermit-crab / pufferfish / gull-flock above the surf) — EVERY one brick-built, never photoreal
  • scene_props         — diorama fill (brick treasure-chest spilling gold round-plates / message-in-a-bottle / anchor / scuba-tank / surfboard rack / sandcastle / beach-umbrella / coral-frond cluster / shipwreck-rib / buoy / tide-pool starfish)
  • lighting            — axis-clean: underwater caustic-blue dapple / surface-shimmer shafts down through the water / golden beach-sunset / bonfire-amber / sweeping lighthouse-beam / bioluminescent trans-cyan deep-glow / bright tropical-noon
  • palette             — axis-clean LEGO-coded: Atlantis gold+teal+treasure / Aquazone yellow+black+trans-neon-green / Deep-Sea white+azure+lime / tropical-beach turquoise+coral+ivory-sand / sunset gold+magenta+violet / kelp-canyon green+amber+deep-teal
  • aquatic_phenomenon (50%-gated) — environmental beat IN BRICK (rising bubble-stream column / sun-shaft caustic-light pillars / breaking trans-blue wave-curl with white foam / bioluminescent-bloom trans-cyan cloud / passing whale-shadow overhead / swirling clownfish bait-ball / king-tide flooding the tide-pools / message-bottle bobbing in on the surf)

Bending advantage: scene_type (surface/submerged) × water_build_technique × register × marine_life × aquatic_phenomenon are all decoupled, so "kelp-forest-canyon + Aquazone-Aquanauts register + manta-ray-mount + sun-shaft-caustics" and "beach-bonfire + Friends-Heartlake register + gull-flock + king-tide" are both rollable. Legacy 4-axis (scene+camera+lighting+palette) couldn't reach these.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'water_build_technique',
        'camera_framing',
        'subject_focus',
        'register',
        'marine_life',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { marine_life: 2 },
    conditionalLayer: { slot: 'aquatic_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_FANTASY: {
    description: `PATH-BESPOKE — BrickBot fantasy path (2026-05-22 migration; third BrickBot axis-system path). LEGO Castle MOC diorama photography across the iconic LEGO Castle lineage (Crusaders / Forestmen / Black Knights / Royal Knights / Dragon Knights / Black Falcons / Wolfpack / Crown / Lion Kingdom / Dragon Kingdom / Skeleton King / Castle 2013 / LEGO Elves) + LotR/Hobbit heritage (Helm's Deep / Minas Tirith / Rivendell / Mordor / Shire) + LEGO D&D (2024+ adventurer party / Red Dragon's Tale) + Bricklink AFOL Castle MOC community.

9 path-bespoke slots + 1 conditional:
  • scene_type         — narrative stage (castle siege / dragon-lair / elven-treetop / dwarven-mine / wizard-tower / ranger-camp / tournament / witch-hut / dungeon / market / throne-room / coronation / jousting / mage-duel / refugee-column / hidden-shrine)
  • minifig_action     — verb-led story beat (mid-charge / mid-cast / mid-archery-loose / mid-dragon-strike / mid-lance-impact / mid-rescue / mid-banquet-toast / mid-skeleton-rise / mid-spell-blast)
  • build_technique    — MOC distinguisher (SNOT castle wall curvature / Technic-articulated drawbridge / trans-piece magic effect / illegal-stone-curve / Bricklink Forestmen tree-canopy / dragon-wing-articulation)
  • camera_framing     — fantasy-specific framing (battlement-down / throne-room-establishing / dragon-POV / forest-glade-through-trees / cliff-castle-aerial / under-archway-discovery / portcullis-low / chapel-altar-down-aisle)
  • subject_focus      — silhouette anchor (REPLACES vehicle_class) — mount (warhorse/dragon-mount/griffin/wolf-rider/unicorn) OR structure (castle/wizard-tower/dragon-lair/coastal-fortress) OR no-vehicle interior (throne-room/tavern/dungeon/wizard-library) OR no-vehicle landscape (forest-glade/mountain-pass/cursed-marsh/snowy-realm)
  • register           — era+faction lock weighted ~80% iconic LEGO Castle heritage + ~15% retro-fantasy (LotR/Hobbit/D&D) + ~5% specialty
  • scene_props pickN:2 — diorama fill (banner / chalice / scroll / wizard staff / treasure chest / cauldron / chained door / bone pile / barrel / falconry-perch / weapon-rack / candle-stand)
  • lighting           — axis-clean (torch / candle / arrowslit-shaft / lightning / dragon-fire / moonlight / dawn-pink / fireplace / cathedral-stained-glass)
  • palette            — axis-clean (Royal-purple+gold / Forestmen-green+brown / Skeleton-King-red+black / Lion-Kingdom-blue / Dragon-Kingdom-red / wizard-violet-gold / dwarven-bronze+steel / elven-silver+leaf / LotR-Mordor-black+red)
  • magical_phenomenon (50%-gated) — environmental drama (dragon-fire-rain / spell-vortex / magical-portal / blizzard-conjured / lightning-storm / shadow-curse / fey-mist / unholy-glow-rising / aurora-blessing / falling-stars)

Bending advantage: subject_focus + register + magical_phenomenon decoupled, so unique permutations like "castle siege + dragon-fire-rain + LotR Mordor register" or "tavern interior + bard-mid-performance + LEGO Elves register" are rollable. Legacy 4-axis (scene+camera+lighting+palette) couldn't reach these.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'subject_focus',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'magical_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_FOREST: {
    description: `PATH-BESPOKE — BrickBot forest path (2026-05-27 migration; fourth BrickBot axis-system path). PEACEFUL MAGICAL WOODLAND LEGO MOC diorama photography — whimsical, cozy, NOT LotR-epic-battle (that's the fantasy path). Canon: LEGO Elves Elvendale (teal/lavender/gold treetop cities) / classic Castle Forestmen (green-hood woodland rangers) / LEGO Fabuland (bright rounded anthropomorphic-animal village) / LEGO Friends Heartlake forest-cabin + treehouse / LEGO Ideas Treehouse 21318 + Bonsai / Hidden Side woodland / Bricklink AFOL fairy-forest + cottagecore-woodland MOC community. Subject = brick-built woodland: mushroom houses, treehouse villages, fairy hollows, grotto pools, woodland campsites, hobbit-style burrows, stream-bridges, wildflower glades, with fairy + woodland-creature minifigs (deer / owl / fox / hedgehog / rabbit).

ROOT-CAUSE NOTE (why this migration exists): the legacy compose() forest path rendered PHOTOREAL forests (real birch trunks, real leaf-litter — Kevin flagged 2026-05-27) because nature vocabulary in the SUBJECT_INTRO + scene pool + Sonnet elaboration overrode the brick framing. The fix is the FANTASY-style EXTRA-STRONG NATURE-HEAVY LEGO MANDATE (every organic element → named brick part) + register lock + banned botanical/organic-motion vocabulary in every pool.

9 path-bespoke slots + 1 conditional:
  • scene_type         — woodland narrative stage (fairy-village / treehouse-village / mushroom-hollow / grotto-pool / woodland-campsite / hobbit-burrow / stream-bridge / wildflower-glade / firefly-clearing / moss-ruins / forest-market / tree-hollow-home / waterfall-grotto / acorn-harvest / fairy-ring-circle / berry-gathering / lantern-festival)
  • minifig_action     — verb-led cozy story beat (mid-lantern-light / mid-mushroom-harvest / mid-stream-crossing / mid-campfire-story / mid-creature-feeding / mid-berry-pick / mid-bridge-repair / mid-acorn-toss / mid-fairy-flit / mid-treehouse-climb / mid-flower-plant)
  • build_technique    — forest-MOC distinguisher: HOW organic forms read as brick (SNOT-curved mushroom caps from inverted-dishes/domes, stacked round-brick + cylinder tree-trunks with bark-texture from cheese-slopes, plate-stacked + plant-element leaf-canopy, trans-blue layered-plate stream, BURP/LURP rock outcrops, trans-cyan round-plate fairy-glow, Technic-pin branch articulation, clip-and-bar hanging-lantern rigs)
  • camera_framing     — forest-specific framing (canopy-down / forest-floor-macro / through-the-trunks / treehouse-aerial / grotto-pool-reflection / burrow-doorway-low / fairy-eye-level / stream-bridge-side-on / firefly-clearing-wide)
  • subject_focus      — silhouette anchor (REPLACES vehicle_class) — STRUCTURE (mushroom-house / treehouse-village / hobbit-burrow / fairy-tower / stream-bridge / grotto / forest-cabin) OR woodland-CREATURE-mount (riding stag / giant owl / saddled fox / giant snail / giant frog / boar) OR no-vehicle INTERIOR (treehouse-room / burrow-home / fairy-workshop / mushroom-cottage-interior) OR no-vehicle LANDSCAPE (glade / fern-clearing / streambank / mossy-hollow)
  • register           — woodland heritage lock, weighted ~85% iconic LEGO woodland heritage (Elvendale-teal-lavender-gold / Forestmen-green-hood-brown / Fabuland-bright-primary-animal-village / Friends-Heartlake-pastel-cabin / Ideas-Treehouse-natural-wood-green / classic-Castle-forest) + ~15% AFOL cottagecore-woodland-MOC + retro-whimsy (Brambly-Hedge-coded / Wind-in-the-Willows-coded — rendered strictly in brick)
  • scene_props pickN:2 — brick-built diorama fill (brick-built toadstool / clip-rod hanging-lantern / trans-yellow round-plate firefly-cluster / acorn-element / mushroom-cap / lily-pad-plate / bird-on-branch / butterfly trans-piece / berry 1x1 round-plate / tiny treasure-chest / fairy-wing accessory / woven-basket)
  • lighting           — axis-clean (dappled green-gold canopy-shafts / trans-cyan fairy-glow / warm-lantern-amber / firefly-pulse / moonlit-blue / dawn-mist-pink / golden-hour-low)
  • palette            — axis-clean LEGO-coded (Elvendale teal+lavender+gold / Forestmen forest-green+brown / Fabuland bright-primary / mushroom red+cream+brown / autumn orange+tan+olive / fairy trans-cyan+white+pastel / Heartlake pastel+sand)
  • woodland_phenomenon (50%-gated) — environmental drama, BRICK-RENDERED (firefly-swarm of trans-yellow round-plates / pollen-glow trans-clear specks / drifting-leaf-element fall / cotton-element ground-mist / trans-arc rainbow over the glade / mushroom-spore trans-white glow / fairy-dust trans-clear sparkle-trail / will-o-wisp trans-cyan orbs)

Bending advantage: subject_focus + register + woodland_phenomenon decoupled, so unique permutations like "mushroom-hollow + mid-lantern-light + Elvendale register + firefly-swarm" or "treehouse-village + giant-owl-mount + Forestmen register" are rollable. Legacy 4-axis (scene+camera+lighting+palette) couldn't reach these — AND lacked the per-element brick-mandate that stops photoreal-forest drift.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'subject_focus',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'woodland_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_SPACE: {
    description: `PATH-BESPOKE — BrickBot space path (2026-05-22 migration; second BrickBot axis-system path). LEGO Space MOC diorama photography across the iconic LEGO Space lineage (Classic Space 1978-87 / Blacktron / M-Tron / Space Police / Ice Planet / Insectoids / Mars Mission / Galaxy Squad / LEGO Star Wars) + hard-SF canon (Expanse / Mass Effect / Interstellar / Foundation / 2001 ASO / Star Citizen / Tintin retro / cyberpunk space).

9 path-bespoke slots + 1 conditional:
  • scene_type         — narrative stage (combat / docking / EVA / mining / first-contact / mission-control / refit / launch / crash-survival / habitat / exploration / discovery)
  • minifig_action     — verb-led story beat (mid-spacewalk-tethered / mid-drilling / mid-blast-deflect / mid-airlock-cycle)
  • build_technique    — space-MOC distinguisher (SNOT-built rounded hulls / trans-piece engine flares / Technic landing-gear / illegal alien-hive curves)
  • camera_framing     — space-specific framing (hangar-bay vault / EVA-tether POV / cockpit-canopy-out / nebula-vista-from-bridge / planetside establishing)
  • vehicle_class      — silhouette: Classic-Space lunar-rover / Blacktron stealth-fighter / M-Tron magnet-cruiser / Galaxy Squad split-ship / Star Wars X-wing / Imperial / dropship / hauler / probe / EVA suit / no-vehicle (interior)
  • register           — era+faction lock weighted ~45% Classic-LEGO-Space-era + cousins / ~55% non-default (Blacktron / M-Tron / Insectoids / Galaxy Squad / Star Wars / Mass Effect / Expanse / Tintin retro / 2001 ASO / Foundation / cyberpunk / solarpunk)
  • scene_props pickN:2 — diorama fill (astronaut helmet / ration pack / datapad / alien artifact in trans-piece / repair drone / beacon / fuel cell)
  • lighting           — axis-clean: nebula-tint / binary-star / planet-glow / engine-flare / cockpit-amber / lunar-cool. Cool/violet weighted to counter Flux's warm-default bias.
  • palette            — axis-clean: Classic-Space yellow-grey-trans-blue / Blacktron black-neon-yellow / M-Tron magenta-lime / Galaxy-Squad orange-cyan / nebula magenta-cyan
  • cosmic_phenomenon (50%-gated) — environmental drama: nebula bloom / aurora-belt / meteor shower / black-hole-event / supernova / planet-shadow / event-horizon-pull / gravity-wave-distortion

Bending advantage: register + cosmic_phenomenon decoupled from scene_type, so "asteroid mining + Classic-LEGO-Space register + cosmic-dust-cloud" and "EVA + Mass-Effect register + event-horizon-pull" are rollable.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'vehicle_class',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'cosmic_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BRICKBOT_PIRATES: {
    description: `PATH-BESPOKE — BrickBot pirates path (2026-05-22 migration; first BrickBot axis-system path). LEGO MOC pirate diorama photography — AFOL convention quality, NOT official set photos. Canon: Pirates of the Caribbean LEGO sets (6271 Imperial Flagship / 6285 Black Seas Barracuda / 70413 Brick Bounty) + Bricklink AFOL pirate dioramas + Treasure Island / Master & Commander narrative beats + vintage Imperial vs Pirates lineage.

9 path-bespoke slots + 1 conditional:
  • scene_type         — narrative stage (combat / treasure / harbor / kraken / cursed / chase / hideout / mutiny / shipwreck / parley / storm-survival)
  • minifig_action     — verb-led story beat (STORY BEAT MANDATE)
  • build_technique    — MOC distinguisher (SNOT-built hull / trans-blue waves / sloped-brick rocks / Technic-articulated cannons / printed-tile signature pieces)
  • camera_framing     — pirate-specific framing (cannon-broadside / crow's-nest / kraken-POV / shipwreck-tilt / chest-level discovery / over-shoulder duel)
  • ship_class         — silhouette bender (galleon / sloop / brig / frigate / junk / dhow / longship / catamaran / submarine-pirate)
  • register           — era+faction bender, weighted ~60% golden-age Caribbean / 40% non-default (Norse raid / Greek myth / Asian junk / fantasy / space-pirate / Royal-Navy-encounter / cursed-ghost-crew / steampunk / Somali-modern)
  • scene_props pickN:2 — diorama fill detail (parrot / jolly roger / rum keg / monkey / lit fuse / map fragment / peg leg / doubloon stack)
  • lighting           — axis-clean light source/dir/color
  • palette            — axis-clean color combinations
  • weather_drama (50%-gated) — environmental drama (storm+lightning / dense fog / glass-calm sea / kraken tentacles / thunderhead break / shark fin / waterspout)

Bending advantage over legacy: scene + weather are decoupled, so unique permutations like "kraken-attack + glass-calm sea + golden-hour" or "Norse longship + Viking-raid + thick-fog" become rollable. Legacy 200-entry scene pool conflated framing+setting+action+cast — split here for combinatorial diversity.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'ship_class',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'weather_drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
