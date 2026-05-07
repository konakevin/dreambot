/**
 * Per-path config for BrickBot pool generators.
 *
 * Each entry feeds three meta-prompts (scenes / lighting / palette).
 * Subject is the path identity; lighting + palette are subject-tinted
 * mood pools.
 */

module.exports = [
  {
    key: 'macro_display',
    label: 'macro-display',
    subject: `Pulled-back wide-camera view of a complete LEGO diorama on a tabletop — convention-display / LEGO Masters showcase scale. The whole built world fits in frame; you can see edge baseplates, multiple build elements, the diorama as a finished masterpiece. Subjects vary widely (ski village, mars colony, ocean port, medieval siege, theme park, mountain pass) — what unifies the path is the WIDE-CAMERA SCALE that shows the entire build.`,
    lightingMood: `theatrical display lighting — overhead spotlights, atmospheric haze, studio-style key + fill, dramatic showcase reveal lighting. Think LEGO convention floor or LEGO Masters finale stage`,
    paletteMood: `vivid showcase palettes designed to make the diorama POP — bold primaries with neon transparent accents, multi-color jewel tones for visual impact at convention-display distance`,
    cameraSkew: 'wide',
  },
  {
    key: 'girly',
    label: 'girly / pastel-takeover',
    subject: `LEGO Movie ending vibe + LEGO Friends + DUPLO Princess takeover. Pink hearts, unicorns, princesses, ballerinas, mermaids, fashion-boutique builds, cupcake bakeries, sparkle towers, candy castles, pet stores, ice-cream parlors, fairy ballet stages. Friends mini-doll style minifigs alongside regular minifigs. Joyful, ultra-cute, deliberately girly.`,
    lightingMood: `soft pastel-luminous, pink-tinted golden hour, sparkle-glow, fairy-light strings, candy-shop neon, butter-cream hearth-warm, princess-spotlight magical glow`,
    paletteMood: `pastel pinks, lavenders, mint greens, butter yellows, princess golds, rose-quartz, baby-blue, peach, candy-stripe pink+white. Pink is welcomed and dominant here, NOT to be avoided`,
  },
  {
    key: 'lego_masters',
    label: 'lego-masters finale build',
    subject: `Single hero showcase build of the kind featured on LEGO Masters TV show finale episodes. Themed narrative builds: "the moment a mountain village erupts in chaos as the dragon lands," "a cross-section dollhouse showing tragedy on each floor," "a steampunk submarine breaching the deep with a kraken," "the carnival fairground at the moment the lights go out." Single dramatic centerpiece, finale-reveal lighting (theatrical spotlight + atmospheric haze + base-glow), turntable composition, narrative density.`,
    lightingMood: `dramatic finale-reveal lighting — theatrical spotlight from overhead, atmospheric haze, edge rim-light around the build, deep black surrounding void, sometimes fog billows, sometimes laser beams or projection mapping`,
    paletteMood: `dramatic narrative palettes that match the build's story — could be any color but always saturated, always with a clear mood (tragic = oxblood + ash + gold leaf; triumphant = emerald + sunrise gold + white; mysterious = deep purple + electric cyan + black)`,
    cameraSkew: 'wide',
  },
  {
    key: 'western',
    label: 'western / frontier',
    subject: `American West frontier era. Cowboys, sheriffs, outlaws, prospectors, native scouts, stagecoaches, steam locomotives, saloons with swinging doors, ghost towns, mining camps, badlands canyons, mesa formations, dusty cattle drives, gunfights at high noon, train robberies, gold rush boom-towns, sun-bleached wood plank sidewalks, hitching posts, water troughs, cactus + tumbleweeds.`,
    lightingMood: `harsh midday sun with sharp shadows, dusty golden-hour with sun-shafts through plank gaps, dim oil-lamp saloon interiors, campfire under stars, dawn pink over mesa, dust-storm filtered light`,
    paletteMood: `earth tones — rust, ochre, sun-bleached wood, dusty leather, sagebrush green, cactus jade, mesa-red, sandstone tan, cattle-hide brown, bandana red, sheriff-star gold`,
  },
  {
    key: 'fantasy',
    label: 'fantasy / epic adventure',
    subject: `LOTR / Witcher / Elder Scrolls scale. Castle keeps, wizard towers, ancient ruins, cursed dungeons, ranger encampments, elven cities in trees, dwarven mines, dragon lairs, troll bridges, market squares with fantasy-race vendors, knights questing through dark forests, wizards casting spells, dragons besieging fortresses. Medieval-fantasy with magic, scale, and danger.`,
    lightingMood: `epic chiaroscuro — single dramatic light source (window-shaft, dragon-fire, magic spell), deep shadow elsewhere. Candlelit interiors, torchlit corridors, moonlit ruins, dragonfire orange illumination, magical transparent-blue glows, sunrise over castle ramparts`,
    paletteMood: `medieval-fantasy palettes — muted earth, deep forest green, candlelit gold, dragon-fire orange, magical transparent-blue and amethyst-violet glows, oxblood + black-iron, royal purple + gold leaf`,
  },
  {
    key: 'space',
    label: 'space / sci-fi',
    subject: `Alien worlds, starships in dock, mars colonies, asteroid mining stations, command bridges, hangar bays, alien encounters, EVA spacewalks, lunar bases, cosmic phenomena (nebula skies, ringed-planet horizons). Mix of retro-futurism and hard-sci-fi. Classic LEGO Space themes welcome (Blacktron, M-Tron, Ice Planet, Galaxy Squad).`,
    lightingMood: `cosmic / futuristic — neon transparent-yellow + red panel glows, plasma-magenta engine flares, cool-blue cockpit interiors, alien-sun double-shadows, nebula backlight, anti-grav teal undersides, transparent-cyan power core glows`,
    paletteMood: `cosmic blues + chrome silver + neon transparent-yellow/red panels + plasma-magenta accents + alien-world unnatural greens/oranges + Blacktron classic black/yellow + Ice Planet white/transparent-blue`,
  },
  {
    key: 'aquatic',
    label: 'beach / aquatic',
    subject: `Tropical paradise vibes (NOT pirates — that's its own path). Snorkelers exploring coral reefs, scuba divers among kelp forests, beach bonfires, surf shacks, lighthouse cliffs, sea turtles + manta rays + mermaids in the deep, beach volleyball, palm-tree boardwalks, sunset proposals on beach, dolphins jumping in surf, beach bonfire under stars. Peaceful, scenic, summery.`,
    lightingMood: `tropical sunlight — golden-hour beach side-light, midday brilliant turquoise reflections, sunset gold across wet sand, underwater caustic-light god-rays through kelp, bioluminescent night-tide glow, lighthouse beam sweeping at dusk`,
    paletteMood: `turquoise + coral + ivory sand + jade palm + sunset gold + tropical magenta hibiscus accents + deep-blue ocean + foam white + bioluminescent transparent-cyan`,
  },
  {
    key: 'winter',
    label: 'snow / winter',
    subject: `Ski lodges, alpine villages, frozen lakes, blizzard rescues, ice castles, snowman-building scenes, ice-fishing huts, skiers on powder slopes, hot-cocoa-by-the-fire interiors, husky-pulled sleds, frozen waterfalls, polar research stations, igloo encampments, transparent-blue ice pieces, white snow drifts on every surface, hearth interiors against snowy windows.`,
    lightingMood: `cool blue snow-light reflecting off white drifts, golden hearth-warm interiors against frosted windows, blizzard whiteout flat-overcast, aurora borealis greens and violets across night sky, lantern-yellow against blue dusk, ice-cave prismatic refractions`,
    paletteMood: `ice blue + silver + snow white + pine green + cabin red + warm hearth-amber + polar-violet aurora + transparent-cyan ice + cocoa brown + nordic-yellow window-glow`,
  },
  {
    key: 'pirates',
    label: 'pirates',
    subject: `Pirates and the high seas. Galleons under full sail, pirate captains crossing swords on deck mid-storm, kraken tentacles wrapping around masts, treasure caves with jeweled chests, mutiny scenes, walk-the-plank moments, harbor docks at sunrise, parrot-shoulder portraits, treasure maps with X-marks, ghost ships in fog, harbor ports with smugglers' coves. Adventure / action energy.`,
    lightingMood: `golden tropical sunset on sails, stormy lightning-flash freeze-frames, candlelit captain-quarters dim, foggy ghost-ship blue-gray, treasure cave torch-lit gold, moonlit beach pale silver, dawn fog over harbor`,
    paletteMood: `weathered wood brown + sail white + gold doubloon + pirate red + tropical turquoise + storm-dark navy + ghost-ship pale-cyan + treasure-cave amber + parrot-feather emerald and scarlet`,
  },
  {
    key: 'mech',
    label: 'mech / giant robots',
    subject: `Giant mech suits, transformers, exo-armor pilots. Mecha hangars with maintenance crews, battle-damaged mechs in junkyards, classic Bionicle/Hero Factory builds, Pacific-Rim-scale war machines, anime-mecha cockpit reveals, robot uprisings, mech-vs-mech duels, technic-beam framework details visible. Industrial sci-fi.`,
    lightingMood: `industrial floodlights, hangar work-lights with shadow chiaroscuro, transparent-cyan power-core internal glow, neon warning-yellow strobing, exhaust-flame backlight, sparks from welding, lightning-strobe battle freeze-frames`,
    paletteMood: `industrial gunmetal + warning-yellow + transparent-cyan power cores + rust accents + neon-orange exhausts + military camo greens + chrome-silver + battle-damage scarlet + cobalt cockpit blue`,
  },
  {
    key: 'theme_park',
    label: 'theme park / carnival',
    subject: `Roller coasters mid-loop, ferris wheels lit at dusk, carousels with horse minifigs frozen mid-spin, candy-color food carts, midway games, haunted-house attractions, summer-night neon, fireworks bursts above attractions, cotton-candy stands, mini-golf courses, parade floats, water-park slides, theme park hotels with monorail trains. Crowds of cheering minifigs in motion.`,
    lightingMood: `summer-night neon — transparent-pink/cyan/yellow ride lights, fireworks burst-light, ferris-wheel chaser-bulb arrays, sunset-pink with rides silhouetted, daytime brilliant-blue-sky with candy-bright rides, haunted-house green eerie glow, midway-arcade red-yellow-blue chaser flicker`,
    paletteMood: `neon transparent reds/blues/yellows + candy pink + popcorn cream + carnival-stripe red+white + summer-night navy sky + fireworks-burst gold + haunted-house electric green + cotton-candy pastel pink+blue`,
  },
  {
    key: 'forest',
    label: 'forest / fairy',
    subject: `Whimsical magical woodland (peaceful, NOT LOTR-epic — that's fantasy path). Mushroom houses, fairy-light tree hollows, woodland fairies fluttering, moss-covered ruins, deer + owl + fox minifigs, hidden grotto pools, firefly clouds, forest campsites with tents and lanterns, treehouse villages, hobbit-style burrows, bridges over rushing streams, wildflower meadows at edge of forest.`,
    lightingMood: `golden dappled-light through canopy, fairy-light strings glowing in tree hollows, transparent-cyan magical glow, lantern-warm tent interiors, sunbeams through morning mist, firefly cloud at dusk, mushroom-bioluminescence pale glow, full-moon silver through branches`,
    paletteMood: `deep forest green + golden dappled light + fairy-glow transparent-cyan + warm tent-canvas amber + bark brown + mushroom red and ivory + wildflower violet + moss emerald + fawn-fur tan + firefly-warm gold`,
  },
  {
    key: 'landscape',
    label: 'landscape / epic scenery',
    subject: `EarthBot-style natural vistas rendered entirely in brick. Mountain ranges with snowcaps and clouds, glacier-carved valleys, redwood old-growth forests, desert canyons at golden hour, coastal cliffs above crashing surf, alpine meadows with wildflower carpets, stormy ocean from a beach, sequoia groves, plateau mesas, river deltas, savanna at sunrise, frozen waterfalls. The world is the subject; minifigs (if present) are scale references — tiny hikers, photographers, climbers — never the focus.`,
    lightingMood: `epic natural lighting — golden-hour mountain rim-light, storm-broken sunbeams across valley, alpenglow on snowcaps, dawn fog over forest, midday harsh desert sun, polar-night aurora, sunset over coast with sea-foam catching last light, moonlit canyon`,
    paletteMood: `natural earth — granite gray + snow white + pine green + sandstone red + alpine sky-blue + meadow gold + desert ochre + ocean cobalt + forest deep-green + autumn-leaf scarlet + glacier turquoise + storm-cloud slate`,
    cameraSkew: 'wide',
  },
];
