#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/planet_setting.json',
  total: 100,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ALIEN-PLANET SETTING entries for StarBot's female-explorer and male-explorer paths. Each entry is a DENSE phrase (20-35 words) describing a SPECIFIC ALIEN BIOME / TERRAIN — the GROUND / FLORA / ATMOSPHERE / SKY of the scene where the explorer stands.

CRITICAL — these MUST read as ALIEN. Earth-coded grassland, meadow, savanna, prairie, tundra-prairie, rolling green hills, wildflower fields are ABSOLUTELY BANNED — they look like Earth nature photography, not alien planet sci-fi. NO grass-fields. NO pastoral-rolling-hills. NO meadows.

CRITICAL — BIOME VARIETY. We need wildly-different alien worlds with HEAVY WEIGHTING toward LUSH / JUNGLE / SWAMP / FORESTED / WET environments. Variety across 9 categories below — every category must be represented.

Reference imagery: Avatar (Pandora bioluminescent jungle / floating mountains) / Felucia (fungal jungle) / Endor / Yavin IV / Kashyyyk / Dagobah (swamp) / Ferenginar (rain world) / Annihilation / Prometheus / Naboo (lake worlds) / Mass Effect Eden Prime / Pandora-coded everything / lush exoplanets. Cool environments from those IPs are FINE — just describe LANDSCAPE not specific characters.

━━━ BIOME CATEGORIES (MANDATORY VARIETY ACROSS ${n}) ━━━

JUNGLE / RAINFOREST / DENSE FORESTED (heavy — ~25% of ${n}) — LUSH AND HEAVY:
- alien rainforest with massive tree-buttresses thicker than houses, dense humid air, dappled green light filtering through layered canopy
- bioluminescent jungle with hanging vines emitting soft pink-purple luminescence, exotic insects floating like lanterns, root-tangle floor
- fungal jungle with neon-pink-and-orange flora the size of buildings, alien atmosphere thick with drifting spores, mushroom-megaforest
- canopy world with kilometer-tall trees, the explorer on a wooden platform thousands of feet above the forest floor
- multi-canopy layered jungle world with each layer a different biome
- ancient forest with bioluminescent moss covering every surface, soft cyan-green ambient glow
- vine-canyon with sentient-tendril foliage that shifts when watched, deep emerald light
- jade-leafed alien jungle with rivers winding between massive root-buttresses
- redwood-analogue forest with trees so massive their bases disappear into perpetual ground-fog

SWAMP / WETLANDS / MARSH (~10% of ${n}):
- alien swamp with twisted black trees rising from shallow tannin-dark water, fog hanging low
- bioluminescent swamp with glowing fungi on every tree-trunk, water reflecting cyan glow
- mangrove-style alien wetland with massive root-arches arching out of murky water, fog at the waterline
- toxic-swamp with thick green vapor hanging low, twisted black trees rising out of acid-pools
- dagobah-coded primordial swamp with gnarled trees, hanging vines, knee-deep murk
- rain-soaked alien wetland with constant drizzle, exotic broad-leaf plants holding water-pools

OCEANIC / WATER / WET (~10% of ${n}):
- bioluminescent ocean shore at twilight, smooth black volcanic sand, glowing-plankton waves
- coastal cliff overlooking an alien sea with floating-island archipelago in the distance
- mirror-lake reflection plain where water perfectly mirrors the sky, no horizon visible
- methane-and-amber sea with vapor rising as gentle mist
- alien archipelago of floating coral-reef-platforms with bioluminescent water below
- underwater-feeling planet where the air itself is dense with floating microorganisms

CRYSTAL / GEOMETRIC / PRISMATIC (~10% of ${n}) — refractive:
- crystalline desert with prismatic shards rising from dunes
- canyon carved through living crystal, walls glowing internally with veins of light
- petrified forest of silicon-glass-trees with leaves that ring like bells
- geode-cathedral interior chamber with massive amethyst spires
- prismatic-glass plain that refracts the local star into ground-level rainbows

ICE / FROZEN / GLACIAL (~10% of ${n}):
- ice plain stretching to mountains under a low alien sun, breath visible in cold thin air
- glacial cliff carved into architectural shapes by alien wind, ice-blue light filtering through translucent depths
- aurora-soaked frozen world with constant green-and-violet auroras dancing overhead
- methane-glacier with ice that glows beneath its surface, alien wind howling
- frozen-ocean planet with locked waves visible like sculpted glass, low horizon-sun

DESERT / ARID (~8% of ${n}) — KEEP LOW BUT REPRESENTED:
- red-sand desert with twin suns at the horizon, wind-carved rock formations like cathedrals
- amber-sand world with churning sandstorms in the middle distance, dust-devils dancing
- crystalline-glass desert flat with salt-pan plain, hexagonal patterns visible
- arid plateau under a copper sky, weathered rock spires casting long shadows

VOLCANIC / LAVA / OBSIDIAN (~8% of ${n}):
- obsidian-glass volcanic plain with magma vents glowing red, sulfur-yellow sky
- caldera-rim overlook with churning lava-lake far below, sulphur-yellow haze
- active-volcano world with eruption columns punctuating the horizon, ash-snow falling
- magma-river canyon flowing toward the horizon, basalt walls glowing dim red
- petrified-lava-flow plain frozen mid-eruption, sharp obsidian-glass shards everywhere

SKY / FLOATING-ISLANDS / AERIAL (~8% of ${n}) — MANDATORY VARIETY:
- mountain peak plateau with cloud-sea below, distant island-mountains floating between layers
- floating-rock plateau in upper atmosphere of a gas giant, vast curving horizon below
- sky-archipelago of buoyant gas-cell islands tethered together, abyss yawning beneath
- aerial platform of fossilized coral floating on its own gas reserves
- gas-giant-horizon plateau where the curve of the planet is visible, atmospheric layers stacking
- avatar-style floating mountains with waterfalls cascading from rooted vines

ANCIENT RUINS / PRECURSOR (~8% of ${n}) — MANDATORY VARIETY:
- ruins of a precursor-alien city overgrown with dense alien jungle, monumental stone pillars carved with unknown glyphs
- abandoned alien temple complex on a high jungle plateau, columns wrapped in glowing vines
- buried-cyclopean-ruin in a swamp, only the upper portion of a colossal alien obelisk above the murky water
- shattered ringworld fragment half-buried in alien desert, kilometers of tilted artificial structure
- precursor-arch ruins on a coastal cliff, weathered stone framing distant ocean
- abandoned megalith circle on a high jungle plateau, mossy obelisks taller than redwoods

CAVE / UNDERGROUND / SUBTERRANEAN (~6% of ${n}) — MANDATORY VARIETY:
- vast underground cavern lit by bioluminescent fungi columns, character on a stone path through the darkness
- crystal-cave chamber with massive prismatic spires rising from the floor, refracted light dancing
- subterranean alien river-cavern with phosphorescent water flowing through dark stone
- mushroom-forest grotto deep underground, towering fungi the size of trees glowing their own light
- lava-tube tunnel with exposed magma-vein cracks, character on the upper rim with deeper glow below

EXTREME / WEIRD (~5% of ${n}) — MANDATORY VARIETY:
- magnetic-storm plain with constant lightning crackling across the surface
- geyser field with steam plumes erupting in patterns, geothermal pools of glowing water
- gravity-anomaly zone where boulders hang suspended at impossible heights
- petrified-forest plain where ancient trees have turned to mineral, alien stars overhead
- soap-bubble-membrane terrain stretched between rock formations, alien greenhouse organisms thriving inside

━━━ RULES ━━━
- Each entry is a SPECIFIC alien biome / setting — not vague descriptors
- 20-35 words — paint the BIOME vividly (ground, flora, sky, atmosphere)
- Strange / beautiful / memorable — Avatar / Mass Effect / Star Wars / Annihilation level imagination
- Suitable for both male and female explorers (gender-neutral)
- The biome is HALF the show — the character stands IN this place
- HEAVY WEIGHTING on JUNGLE / SWAMP / WETLAND / FORESTED / LUSH biomes
- ABSOLUTELY NO grassland / meadow / savanna / prairie / tundra-prairie / rolling-hills / wildflower-fields / wheat-fields — those read as Earth, not alien
- DO NOT include "epic backdrops" (megaships, huge moons in the sky, supercarriers, megastructures) — those go in a separate pool
- Environments referencing IPs (Pandora, Tatooine, Hoth, Endor, etc.) are fine — just describe the landscape, not characters

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
