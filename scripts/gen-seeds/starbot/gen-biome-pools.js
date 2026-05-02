#!/usr/bin/env node
/**
 * Generates 11 biome-specific planet-setting pools, 25 entries each.
 * Each pool is intra-deduped via Sonnet seeing prior batch entries.
 *
 * After generation, pools.js merges all 11 into PLANET_SETTING (flat array)
 * so the path's pickWithRecency rolls equally across every biome.
 *
 * Idempotent — re-running skips pools that already hit 25.
 */

const { generatePool } = require('../../lib/seedGenHelper');

const SHARED_RULES = `
━━━ UNIVERSAL RULES (all biomes) ━━━
- Each entry: 20-35 words, dense and paintable
- Strange / beautiful / memorable — Avatar / Mass Effect / Annihilation level imagination
- Suitable for both male and female explorers (gender-neutral)
- The biome is HALF the show — the character stands IN this place
- ABSOLUTELY NO grassland / meadow / savanna / prairie / tundra-prairie / rolling-hills / wildflower-fields / wheat-fields / pasture — those read as Earth, not alien
- DO NOT include "epic backdrops" (megaships, supercarriers, megastructures, huge moons in the sky) — those go in a separate pool
- NO characters in the description — landscape only (the character is rendered separately)
- Environments referencing IPs (Pandora, Felucia, Hoth, Dagobah, etc.) are FINE — describe the landscape, not characters
- Vary every entry strongly across atmosphere, scale cues, light quality, color palette, alien flora/fauna ambient details

━━━ OUTPUT ━━━
JSON array of N strings. No preamble, no numbering.`;

const BIOMES = {
  jungle: {
    title: 'ALIEN JUNGLE / RAINFOREST / DENSE FORESTED',
    refs: 'Pandora bioluminescent jungle, Felucia fungal jungle, Endor, Yavin IV, Kashyyyk canopy, Naboo green hills, Annihilation overgrowth, Eden Prime verdant',
    body: `Each entry describes a JUNGLE / RAINFOREST / DENSE FORESTED alien biome. Required elements (every entry must include at least 2):
- Towering alien trees / megaflora / kilometer-tall canopy
- Dense humid air / dappled green light / drifting spores / hanging vines
- Layered canopy depth (ground level, mid-canopy, upper-canopy)
- Bioluminescent flora / glowing moss / pulsing fungi / lantern-insects
- Alien wildlife implied (calls, silhouettes in foliage, distant creatures)

Variety dimensions to span across the 25:
- Day vs night vs twilight vs perpetual gloom
- Bioluminescent vs sun-dappled vs misty vs storm-soaked
- Massive megaflora vs medium canopy vs forest floor view
- Dry-jungle vs humid-rainforest vs misty-cloud-forest
- Color palettes: emerald, jade, neon-pink, violet, gold, cyan, rust-red`,
  },
  swamp: {
    title: 'ALIEN SWAMP / WETLAND / MARSH',
    refs: 'Dagobah, primordial Earth, Annihilation marshland, mangrove worlds',
    body: `Each entry describes a SWAMP / WETLAND / MARSH alien biome. Required elements (every entry must include at least 2):
- Standing or slow-moving WATER (murky / dark / iridescent / methane / acidic)
- Soft saturated GROUND or mud — boots would sink
- Vegetation rooted IN the water — alien mangrove analogues, knee-deep reeds, root-tangles, drowning vines, fungal stalks emerging from bog water
- Damp humid atmosphere — fog, vapor, mist, biting alien insects, slow-moving haze
- Twisted gnarled tree silhouettes / bog-cypress analogues

NO hot springs, NO geysers, NO boiling mud (those are volcanic, separate pool). NO dry land. NO ocean.

Variety: bioluminescent night swamp / methane bog / alien mangrove / acidic marsh / fungal wetland / primeval delta / leech-infested floodplain / coral-bog / drowning-tree forest / peat bog / half-submerged ruins.`,
  },
  ocean: {
    title: 'ALIEN OCEAN / COASTAL / WATER',
    refs: 'Naboo lake worlds, Kamino, Europa under-ice ocean, methane seas of Titan',
    body: `Each entry describes an OCEAN / COASTAL / WATER alien biome. Required elements (every entry must include at least 2):
- Open WATER surface (sea / lagoon / methane sea / crystalline lake / phosphorescent shore)
- Coastal feature (beach / cliff / volcanic-sand / shore / tidal flat / archipelago)
- Distinctive water property (bioluminescent plankton / methane vapor / mirror-still / wave-pulsing / pink crystalline / black glass-water)
- Sky over water / horizon / atmospheric haze layering toward the horizon

Variety: bioluminescent shore / methane sea / mirror-lake / floating-coral archipelago / underwater-air planet / tidal flat / coastal cliff / crystalline lagoon / phosphorescent ocean / black-volcanic-sand beach / alien delta / waterfall world / kelp-forest sea.`,
  },
  ice: {
    title: 'ALIEN ICE / FROZEN / GLACIAL',
    refs: 'Hoth, Europa surface, Pluto, Titan methane glaciers',
    body: `Each entry describes an ICE / FROZEN / GLACIAL alien biome. Required elements (every entry must include at least 2):
- Frozen surface (ice plain / glacier / methane-glacier / frozen ocean / snow-blasted plain)
- Cold sky / aurora / pale low sun / starlight on snow
- Ice/frost detail (translucent depths, sculpted wind-carved ice, frozen waves, crevasses)
- Atmospheric quality (breath visible, thin cold air, blowing crystal-snow, mist)

Variety: aurora-soaked tundra / methane-glacier with subsurface glow / frozen-ocean with locked waves / ice-canyon / glacial cliff carved into architectural shapes / snow-blasted polar plain / frozen-volcano / cryovolcano with ice-ash falling / ice-archipelago / frost-forest of crystallized trees.`,
  },
  desert: {
    title: 'ALIEN DESERT / ARID / SAND',
    refs: 'Tatooine twin suns, Arrakis Dune, Mars red sands, Mustafar arid plateau',
    body: `Each entry describes a DESERT / ARID / SAND alien biome. Required elements (every entry must include at least 2):
- Sand / dune / salt-flat / arid plateau / wind-carved rock formations
- Heat / dry atmosphere / atmospheric heat-haze / dust-devils / churning sandstorm
- Distinctive sky (twin suns / copper sky / amber sky / ringed planet at horizon)
- Color palette: red-sand, amber, ochre, bone-white salt, rust, vermillion

Variety: red-sand twin-suns desert / amber-sand sandstorm world / salt-pan plain with hexagonal cracks / wind-carved rock-cathedral plateau / glass-shard desert / petrified-dune world / ringed-planet desert / dual-shadow desert / iron-oxide rust dunes / bone-white salt flats.`,
  },
  crystal: {
    title: 'ALIEN CRYSTAL / PRISMATIC / GEOMETRIC',
    refs: 'Star Wars Crystal Cave Ilum, Avatar floating crystals, geode-cathedral interiors',
    body: `Each entry describes a CRYSTAL / PRISMATIC / GEOMETRIC alien biome. Required elements (every entry must include at least 2):
- Crystalline formations (shards / spires / geode-walls / silicon-glass / prismatic structures)
- Light refraction (rainbow patterns / shifting spectrums / internal-glow veins / starlight splitting)
- Geometric architectural quality (hexagonal patterns / faceted surfaces / impossible geometry)
- Surface or chamber form (canyon / forest / cavern / plain / cathedral)

Variety: prismatic-shard desert / crystalline-glass forest of trees that ring like bells / geode-cathedral interior / silicon-tree garden / canyon carved through living crystal / amethyst-spire chamber / refractive plain / crystal-cave with internal glow / glass-formation labyrinth.`,
  },
  volcanic: {
    title: 'ALIEN VOLCANIC / LAVA / OBSIDIAN',
    refs: 'Mustafar, Mordor, Io volcanic moon, primordial Earth',
    body: `Each entry describes a VOLCANIC / LAVA / OBSIDIAN alien biome. Required elements (every entry must include at least 2):
- Active or recent volcanism (magma vents / lava rivers / eruption columns / sulfur steam / caldera)
- Volcanic terrain (obsidian plains / basalt formations / petrified lava-flow / glassy black rock)
- Heat-related sky (sulfur-yellow haze / ash-fall / glowing red atmosphere / smoke columns)
- Color palette: red-magma, sulfur-yellow, obsidian-black, charcoal-grey, rust

Variety: active eruption with lava fountains / obsidian-plain frozen mid-eruption / caldera-rim with churning lake below / magma-river canyon / sulfur-vent field / petrified-lava flow / cooling fissure with glowing cracks / volcanic-ash plain / black-glass shore.`,
  },
  sky: {
    title: 'ALIEN SKY / FLOATING-ISLANDS / AERIAL',
    refs: 'Avatar floating mountains, gas-giant skylines, Bespin cloud city, sky-archipelago',
    body: `Each entry describes a SKY / FLOATING-ISLANDS / AERIAL alien biome. Required elements (every entry must include at least 2):
- Aerial position (above clouds / atop floating rock / on a sky-platform / above the abyss)
- Floating element (suspended islands / gas-cell platforms / buoyant coral / anti-gravity boulders / cloud-sea)
- Vertical scale cue (vast curving horizon / atmospheric layers stacking / abyss yawning below)
- Sky/atmosphere dominance (gas giant horizon / multiple cloud layers / atmospheric tinting at altitude)

Variety: floating-mountain peak / sky-archipelago of buoyant islands / gas-giant horizon plateau / aerial-coral platform / cloud-sea above the planet / anti-gravity boulder zone / sky-bridge between floating cliffs / upper-atmosphere observation plain / waterfalls falling from rooted floating-island vines.`,
  },
  ruins: {
    title: 'ANCIENT RUINS / PRECURSOR-ALIEN CIVILIZATION',
    refs: 'Mass Effect Prothean ruins, Halo Forerunner, Annihilation lighthouse, Ozymandian alien obelisks',
    body: `Each entry describes ANCIENT RUINS / PRECURSOR-ALIEN structures (the LANDSCAPE around the ruins is the focus, NOT a character exploring). Required elements (every entry must include at least 2):
- Stone or alloy structure (megaliths / obelisks / temple complexes / cyclopean blocks / arch fragments / spires)
- Vegetation reclaiming (vines / moss / overgrowth / roots cracking foundations / drowning by jungle)
- Mystery (unknown glyphs / weathered carvings / impossible geometry / fitted-megalith precision / non-corroding alloys)
- Setting context (jungle ruins / desert obelisks / coastal arches / swamp-buried megalith / mountain temple complex)

Variety: jungle-overgrown precursor city / desert obelisk circle under twin suns / swamp-buried colossal obelisk / mountain temple complex with vine-wrapped columns / coastal arch ruins framing ocean / shattered ringworld fragment / spiral-pattern carving spanning kilometers / step-pyramid in acid lake / metal-monolith resisting corrosion.`,
  },
  cave: {
    title: 'ALIEN CAVE / UNDERGROUND / SUBTERRANEAN',
    refs: 'Crystal Caves of Naica, Star Wars Ilum cave, Mordor caverns, alien lava-tubes',
    body: `Each entry describes a CAVE / UNDERGROUND / SUBTERRANEAN alien biome. Required elements (every entry must include at least 2):
- Enclosed underground space (cavern / chamber / tunnel / lava-tube / grotto / vault)
- Light source (bioluminescent fungi / glowing crystals / phosphorescent water / lava cracks / skylight shafts)
- Subterranean texture (dripping stalactites / wet rock / fungal coating / crystal walls / volcanic glass)
- Vertical scale cue (massive chamber / kilometer-high ceiling / depth implied by darkness)

Variety: bioluminescent-fungi cathedral cave / crystal-cave with prismatic spires / underground river-cavern with glowing water / lava-tube tunnel with magma-vein cracks / mushroom-forest grotto / fossil-encased chamber / abandoned-city carved into a mountain / vast crystal-vein network / waterfall-fed underground lake.`,
  },
  extreme: {
    title: 'EXTREME / WEIRD / EXOTIC PHENOMENA',
    refs: 'Annihilation shimmer, Jupiter storms, gravity-anomaly worlds, exotic physics zones',
    body: `Each entry describes an EXTREME / WEIRD / EXOTIC phenomena biome — strange physics or extreme weather. Required elements (every entry must include at least 2):
- Atmospheric or physical anomaly (constant lightning / perpetual storm / gravity-anomaly / time-distortion / magnetic-storm / acid rain)
- Strange ground or terrain (petrified forest / soap-bubble membranes / suspended boulders / shifting sands)
- Color or light strangeness (impossible color combinations / shimmer / fractal patterns / aurora-like discharge)
- Threat or wonder (the world feels dangerous OR profoundly alien)

Variety: perpetual lightning plain / geyser field with steam plumes / gravity-anomaly suspended boulders / petrified mineral forest / soap-bubble greenhouse terrain / acid-rain alien world / time-distortion shimmer zone / magnetic-storm metallic plateau / impossible-spectrum aurora plain.`,
  },
};

async function main() {
  for (const [biome, cfg] of Object.entries(BIOMES)) {
    const outPath = `scripts/bots/starbot/seeds/planet_${biome}.json`;
    console.log(`\n━━━ ${biome.toUpperCase()} → ${outPath} ━━━`);
    await generatePool({
      outPath,
      total: 25,
      batch: 12,
      append: true,
      metaPrompt: (n) => `You are writing ${n} ${cfg.title} entries for StarBot's female-explorer and male-explorer paths.

Reference imagery: ${cfg.refs}.

${cfg.body}
${SHARED_RULES.replaceAll('N strings', `${n} strings`)}`,
    });
  }
  console.log('\n✅ All 11 biome pools complete.');
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
