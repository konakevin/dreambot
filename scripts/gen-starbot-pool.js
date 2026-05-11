#!/usr/bin/env node
/**
 * Generate a StarBot Rich Scene Seed pool using Sonnet.
 *
 * Each pool entry is a structured mini-storyboard (FG / MG / Far / Sky
 * + scale provers + material truth + emotional DNA) — see
 * STARBOT_SCENE_QUALITY_PLAYBOOK.md for the format and bar.
 *
 * Usage:
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50 --dry-run
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50
 *
 * The pool's aesthetic touchpoints + theme guidance are looked up from
 * the POOL_RECIPES table below. Output is written to
 * scripts/bots/starbot/seeds/<pool>.json.
 */

const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '50'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--dry-run]');
  process.exit(1);
}

// Per-pool recipe — what kind of scenes this pool authors + aesthetic
// touchpoints Sonnet should draw from. Same format the playbook uses.
const POOL_RECIPES = {
  alien_cities: {
    theme: 'vast alien CITY scenes — multi-tier megacity density, planet-scale ecumenopolis, layered urban verticality, atmospheric depth. NOT a single hero building — DENSE cities with hundreds of supporting structures.',
    touchpoints: [
      'Coruscant (planet-city stacked levels)',
      'Blade Runner 2049 megaholograms + fog layers',
      'Akira Neo-Tokyo vertical density + neon signage',
      'Trantor (Foundation series ecumenopolis)',
      'Pacific Rim Hong Kong (mile-tall walls of stacked stores/homes)',
      'Warhammer 40K Hive City underhive vertical density',
      'Cloud City silhouettes',
      'Mass Effect Citadel arms (curved megastructure)',
      'Sparth concept art density studies',
      'Syd Mead retrofuture density',
      'Akihabara at peak crowd-and-signage',
      'Hong Kong Kowloon Walled City density',
    ],
    instructions: `Each city must feel like a CIVILIZATION, not a single building. The MG layer is where this is proven — name DOZENS of supporting structures, hundreds of windows, multi-elevation skybridges, tiny ships threading the gaps. The Hero anchor is dominant but never alone.`,
  },
  alien_landscapes: {
    theme: 'alien planetary surfaces — distinctive biomes with strong geological / biological / atmospheric identity. NOT generic "alien planet" — each is a specific ecology.',
    touchpoints: [
      'Dune Arrakis (twin suns, biblical desert scale)',
      'Solaris ocean (sentient world)',
      'Nausicaä toxic jungle',
      'Annihilation Shimmer (color-shifted refracted nature)',
      'Avatar Pandora (bioluminescent verticality)',
      'Beksinski painted dread landscapes',
      'Brian Despain alien-flora paintings',
      "Roadside Picnic Zone (broken physics)",
    ],
    instructions: `Each landscape must read as a specific ecology — biology, geology, atmosphere coherent. MG layer: biology / formations / weather. Scene must include EITHER a sentient figure (1-2% frame, midground-back silhouette) OR an alien creature native to this world.`,
  },
  explorer_outfits_female: {
    theme: 'tactical-explorer outfits for female sci-fi characters — every entry is a complete SEALED ARMORED outfit emphasizing FUNCTION over form. Treat the character with the same dignity as a male soldier — full coverage, professional military / explorer kit, no cheesecake.',
    touchpoints: [
      'Halo Spartan armor (full sealed plate)',
      'Mass Effect N7 (sealed tactical suit)',
      'Edge of Tomorrow exosuit (functional rig)',
      'Aliens colonial marine armor',
      'Starship Troopers power armor',
      'Halo ODST armor',
      'The Expanse Martian Marine armor',
      'Apollo / NASA EVA suit (sealed pressurized)',
      'Dune stillsuit (utility-focused desert tactical)',
      'Mandalorian armor (plated full coverage)',
    ],
    instructions: `Each entry is a complete tactical-explorer outfit, ~30-50 words. The pool MUST express WIDE VISUAL VARIETY across color, texture, silhouette, and style-family — Kevin specifically called out the previous pool was repetitive "white spacesuit". Each entry must look DISTINCT from the others when rendered.

VARIETY MANDATE — across all 25 entries, hit each of these axes multiple times:
- COLOR variety: red / orange / olive / black / desert tan / cobalt blue / brass / chrome / forest green / oxblood / charcoal / off-white / sand / arctic-white / midnight / copper-brown. NOT mostly white.
- TEXTURE variety: weathered leather / segmented metal plates / canvas-and-kevlar / chitin-coded carapace / ceramic / synthetic mesh / fabric-armor hybrid / brushed alloy / coated polymer
- SILHOUETTE variety: slim scout / bulky power-armor / hooded cloaked / vest-and-pants / heavy backpack / minimalist / poncho-draped / cape-flowing / tank-top-with-armored-plates
- STYLE-FAMILY variety: imperial soldier / merchant ranger / drifter scavenger / corporate operative / monastic order / desert nomad / arctic explorer / jungle ranger / cyber-edgerunner / clean military / dirty mercenary / scientific researcher / pirate / pilot

REQUIRED ELEMENTS per entry:
- A specific COLOR or material identity that distinguishes it
- A specific STYLE-FAMILY (don't just be "tactical generic")
- FUNCTIONAL EQUIPMENT (utility belt, gauntlets, boots, sidearm, scanner, gear pouches, climbing-rope, etc.)
- About 50% of entries should include head covering (helmet, hood, visor, mask, breathing apparatus); 50% should have head uncovered (hair visible, hood pulled back, helmet held in hand)

NEVER use words: crop, midriff, bare-arms, exposed-stomach, cleavage-emphasized, bikini, swimsuit, sexy, alluring. (Form-fitting is OK if balanced with armor plates.)

EXAMPLES of varied entries the pool should contain (use these as flavor anchors, then invent 25 distinct):
- Weathered ochre-leather scavenger duster with rusted iron-plate gauntlets and goggled half-mask — Mad-Max-meets-Outer-Worlds
- Sleek black-and-magenta corporate operative suit with chrome accents and slim sidearm holster — Cyberpunk-2077 vibe
- Olive-drab military tactical fatigues with kevlar vest, bulky backpack, mirrored helmet visor
- Burgundy hooded monastic-order robe with armored undersuit, sigil-engraved chestplate
- Brass-and-rust dieselpunk explorer jacket with goggle-helmet and oversized utility bandolier
- Forest-green ranger cloak over canvas tactical with sniper-rifle slung, beard if applicable
- Arctic-white sealed parka with thermal-gel insulation and tinted goggles — only ONE entry like this
- Desert-tan moisture-recycler with face-wrap, dust-weathered, sand-pitted
- Heavy charcoal power-armor with red service stripes, bulky helmet
- Slim mercenary jumpsuit in black-and-orange with multi-tool belt

Each entry should feel like a CHARACTER you'd recognize from sci-fi cinema — distinct visual identity.`,
  },
  alien_planet_biome: {
    theme: 'alien planetary BIOMES — each entry is ONE distinctive ecological/geological identity used as a SETTING pool for the slot-pool composer. Used in alien-landscape path. Concise but specific — each biome is a 3-5 sentence description Sonnet weaves with other rolled axes.',
    touchpoints: [
      'Dune Arrakis dune sea',
      'Solaris sentient ocean',
      'Nausicaä toxic spore jungle',
      'Annihilation Shimmer (color-refracted)',
      'Avatar Pandora bioluminescent forest',
      'Beksinski painted dread plain',
      "Roadside Picnic Zone (broken physics anomalies)",
      'Tatooine binary-sun desert',
      'Hoth glacial polar',
      'Mustafar volcanic obsidian river',
      'methane seas of Titan',
      'crystal cave forests',
      'tidal mudflats with bioluminescent algae',
      'mountain plateaus of frozen ammonia',
      'subterranean kelp-forests in low-G',
    ],
    instructions: `Each entry is 60-120 words describing ONE specific alien biome. Include: PRIMARY GEOLOGY (what the ground is — sand / basalt / chitin / ice / glass), DOMINANT BIOLOGY (what grows / lives here — towers, kelps, crystalline mineral life, plasma fauna), ATMOSPHERIC CHARACTER (color of sky, particulate, weather), DISTINCTIVE FEATURE (the thing that makes THIS biome unmistakable — geyser fields / floating boulders / fractal coral / etc.), and SCALE CUE (how big the features are). Each biome must be VISUALLY DISTINCT from the others. Reference real-world biomes pushed to alien extremes (Atacama → glass-crystal desert at -200C; Yellowstone → planet-spanning geyser field; Amazon → bioluminescent jungle 500m canopy; Sahara → twin-sun ochre dune sea 1km dunes).`,
  },
  megastructures: {
    theme: 'colossal artificial structures at planet-or-greater scale — orbital rings, Dyson constructs, planetary mantles. Civilization-as-superstructure.',
    touchpoints: [
      'Halo ring (orbital ring world, visible curvature)',
      "Niven's Ringworld",
      'Dyson sphere/swarm (sun encapsulated)',
      'Bishop Ring habitats',
      "Banks's Culture orbital",
      "Trantor's planetary mantle",
      'Pillars-of-Heaven space elevators',
      'McGuire generation ships',
    ],
    instructions: `Scale must EXCEED planetary. Visible curvature, atmospheric haze at impossible distances. Scale provers: ships are dots, cities are dots-of-dots. Foreground ALWAYS has something at human-comprehensible scale for the brain to anchor on.`,
  },
  space_opera_scenes: {
    theme: 'spacecraft scenes — distinctive vessels with strong design DNA, in dramatic cosmic settings. Push HARD away from navy-grey-military and tail-fin-50s-rocket clichés.',
    touchpoints: [
      'Heighliners (Dune crystalline impossibles)',
      'Mass Effect Reaper (squid-organic alien)',
      'Babylon 5 Vorlon ship (organic crystalline)',
      'Heavy Metal magazine ships (Moebius / Druillet)',
      'Kirby cosmic vessels (impossible-geometry)',
      'Pacific Rim Kaiju silhouettes (alien biological)',
      'Star Wars Star Destroyer underbelly (low-angle hero)',
      "Banks's Culture ship aesthetics (organic / playful / immense)",
      'Eldar Craftworld (Warhammer 40K — graceful + alien)',
    ],
    instructions: `Ships must be VISUALLY DISTINCTIVE per entry — pick a DESIGN DNA (organic-biological / crystalline-lattice / Kirby-cosmic / ribbed-shell / impossible-geometry / weathered-cargo-haulers) and commit hard. NO gun-grey navy. NO blocky 60s-rocket. NO generic "sleek arrow." Each seed describes ONE ship type at compositional scale + environment that frames it.`,
  },
  cozy_sci_fi_interiors: {
    theme: 'WARM lived-in sci-fi interiors — the OPPOSITE of monumental awe. Personal scale, soft light, intimate moments. A view from inside a quiet sanctuary.',
    touchpoints: [
      'Cowboy Bebop Bebop ship interior (lived-in, gritty, warm lamps)',
      "Howl's Moving Castle interior",
      'Studio Ghibli pastoral kitchens',
      'Star Trek captain quarters (personal items, plants, lit warmly)',
      'Solar Sands homestead aesthetic',
      'Firefly Serenity cargo hold + galley',
      'Old-future retrofuture homestead (Mead pastoral)',
      'Ad Astra capsule interior (clean isolation)',
    ],
    instructions: `Cozy + lived-in is the KEY. Warm light, personal objects, plants, soft fabrics. The SCI-FI is in the materials (alien view through window, transparent floor, holographic accent) but the MOOD is "home". Camera intimate. May include ONE figure visible from behind through a window-edge, but optional.`,
  },
  dune_landscapes: {
    theme: 'Dune-coded alien desert vistas — twin-sun horizons, ribbed sandstone formations, dust-haze atmospherics, Villeneuve cinematography. Inspired by but not literal franchise references.',
    touchpoints: [
      'Villeneuve 2021 / 2024 Dune cinematography',
      "Frazetta's desert paintings",
      'Sicilian basalt desert at golden hour',
      'Wadi Rum at extreme low sun',
      'Atacama Desert salt flat at twilight',
      'Painted Desert color striations',
    ],
    instructions: `Twin suns or impossibly-low-single-sun. Dust haze. Biblical scale. MUST include EITHER a robed figure (1-2% frame silhouette) OR a sci-fi flying craft (insectoid-bladed, hover, gunship) at scale — pick one for compositional weight. NO franchise proper nouns (Arrakis / Fremen / ornithopter / spice).`,
  },
  aliens_architecture: {
    theme: 'Giger / Xenomorph biomechanical architecture — ribbed organic hallways, fluid-skeletal forms, oily black surfaces with bone undertones, claustrophobic depth.',
    touchpoints: [
      "H.R. Giger's Necronomicon paintings",
      'Alien (1979) derelict ship interior',
      'Prometheus engineer hall',
      'Aliens hive corridor',
      'Beksinski biomechanical dread',
      "Giger's Alien Egg paintings",
    ],
    instructions: `Biomechanical melding — biology + machinery indistinguishable. Ribbed, jointed, fluid-secreting. Dark and wet. Lit from BELOW or with single shafts. Mood: dread + reverence for what came before. Pure architecture — no living figures, but BODIES IN THE WALLS okay (skeletal in chitin).`,
  },
  starwars_landscapes: {
    theme: 'Star Wars planet vistas — alien wilderness AND inhabited frontiers, with that signature Ralph McQuarrie painted-realism. Inspired by but not literal references.',
    touchpoints: [
      'Ralph McQuarrie concept art (Tatooine, Hoth, Bespin, Endor)',
      'Tatooine binary sunset',
      'Hoth ice plains with imperial walkers (suggested silhouette)',
      'Endor redwood canopy',
      'Naboo Italian-coded grasslands',
      'Mustafar volcanic obsidian rivers',
      'Crait salt flats with red dust',
    ],
    instructions: `McQuarrie painterly clarity, romantic frontier mood, Western cinematography. MAY include 1-2 small sci-fi craft, OR 1 small figure silhouette, OR none. NO franchise proper nouns. Each scene is "wilderness someone could be making for".`,
  },
  guardians_architecture: {
    theme: 'James Gunn cosmic-weird architecture — Kirby cosmic 70s-album-cover SF, saturated colors, kaleidoscopic geometry, temple cities. Playful-extravagant-weird, NOT macabre.',
    touchpoints: [
      'Jack Kirby cosmic geometry (Eternals, Inhumans)',
      'Heavy Metal magazine architecture',
      '70s sci-fi novel cover art (Boris, Bonestell)',
      'Moebius Incal architecture',
      "Druillet's Lone Sloane palaces",
      'James Gunn Guardians films cosmic locales',
      "Roger Dean's Yes album-cover landscapes",
    ],
    instructions: `SATURATED color clashing. Geometric impossibility. Spire-cathedrals, temple-arcades, kaleidoscopic mandala-cities. ABSOLUTELY NO SKULLS — no celestial skull, no skull-shaped buildings, no bone fragments. Architecture leans playful + weird + impossibly beautiful. NO franchise proper nouns.`,
  },
  mass_effect_architecture: {
    theme: 'Mass Effect / BioWare-coded sleek alien architecture — curved monumental megastructure, holographic UI ambient, futuristic Citadel-tier grandeur. NOT brutalist; SLEEK + GRACEFUL.',
    touchpoints: [
      'Mass Effect Citadel arms',
      'Mass Effect Reaper interior',
      'Asari Council Chamber',
      'Salarian architecture',
      'Star Trek TNG Federation interior aesthetic',
      'Andromeda Initiative habitats',
      "Le Corbusier curves in alien material",
    ],
    instructions: `Curved organic-engineered surfaces. Holographic ambient (subtle, not overwhelming). Vast interior atriums, plant integration, ambient cyan/teal mood with warm accent lights. NO franchise proper nouns. Architecture conveys "this civilization solved hard problems with elegance."`,
  },
  halo_landscapes: {
    theme: 'Halo ringworld landscapes — orbital ring curving against the horizon, ancient Forerunner ruins, sweeping skybox grandeur with the ring itself visible overhead.',
    touchpoints: [
      'Halo CE / Reach / Infinite cinematic vistas',
      'Bungie concept art',
      'Forerunner megastructure aesthetic',
      "Niven's Ringworld",
      'Banks Culture orbitals (visible curve)',
      'Yosemite cliffs scaled up 100×',
    ],
    instructions: `RING VISIBLE in sky (curving up overhead is the signature). Ancient megastructure integrated with natural terrain. MUST include ring-curve in the sky composition. NO franchise proper nouns. Mood: sacred + ancient + slightly haunted.`,
  },
  startrek_landscapes: {
    theme: 'Star Trek alien-planet vistas — TOS-vivid colors meets TNG/Discovery realism. Diverse biome variety, often with Federation-or-other ship visible.',
    touchpoints: [
      'Star Trek TOS planet sets (vivid skies, colored rocks)',
      'Star Trek TNG / VOY matte paintings',
      'Star Trek Discovery / Picard cinematography',
      "Andre Norton's Star Voyager covers",
    ],
    instructions: `Optimistic exploration mood. Color variety (don't just default to teal). MAY include small Starfleet-coded ship silhouette in sky (saucer-and-nacelle shape suggested, not literal). NO franchise proper nouns.`,
  },
  starcraft_landscapes: {
    theme: 'Starcraft alien-planet vistas — Zerg-organic-creep / Protoss-crystal / Terran-frontier-mining. Pick a faction lens per entry.',
    touchpoints: [
      'Blizzard Starcraft 2 concept art',
      'Char (volcanic Zerg world)',
      'Aiur (Protoss crystal cities)',
      'Korhal (Terran neo-noir city ruins)',
      'Shakuras (twilight crystal world)',
      'Tarsonis (collapsed Terran capital)',
    ],
    instructions: `Pick ONE faction lens per seed: Zerg (creep, organic, bone-and-shell), Protoss (crystal, gold, monolithic), Terran (oil-rig industrial, neo-noir). Strong DNA per entry. NO franchise proper nouns.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  return `Generate ${count} Rich Scene Seeds for the StarBot ${POOL} pool. StarBot is a sci-fi image-generation bot whose renders should feel like stills from an unmade epic film — multi-tier depth, scale provers, materially specific, narratively suggestive.

━━━ POOL THEME ━━━
${recipe.theme}

━━━ AESTHETIC TOUCHPOINTS (draw from these) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

━━━ POOL-SPECIFIC INSTRUCTIONS ━━━
${recipe.instructions}

━━━ THE RICH SCENE SEED FORMAT — every entry follows this EXACTLY ━━━
Each seed is 80-150 words. Use these exact slot headers (the labels themselves are part of the entry):

[NAME / TYPE] — [one-sentence headline anchor]
FOREGROUND: [specific tangible detail — railing, terrace, machinery, ruin, ridge]
MIDGROUND: [city/structure body, with scale provers named — tiny ships, lit windows, bridge traffic, smaller buildings clustered]
DEEP DISTANCE: [the hero anchor, dominant, partially veiled in atmospheric haze]
SKY: [atmospheric layer — smog, twin moons, storm, light pollution glow, ring-curve]
SCALE PROVERS: [3+ explicit small-things-prove-big-things — name them]
MATERIAL: [what surfaces are made of, how they wear, what light does to them]
EMOTIONAL DNA: [the feeling — awe, dread, wonder, melancholy, alien-indifference, sacred]

━━━ HARD RULES ━━━
- Multi-tier composition is NON-NEGOTIABLE — every seed has all 4 depth layers (FG, MG, Deep, Sky) explicitly filled
- Specific material language — ribbed obsidian over concrete (not "alien architecture"), copper-green oxide (not "weathered"), bioluminescent chitin (not "alien biology")
- 3+ named scale provers per seed — "ships as dots", "hundreds of lit windows", "figures-as-pinpricks on the bridge"
- Each seed has a DISTINCT visual DNA — no two seeds should feel interchangeable
- Architectural / biological / mechanical SPECIFICITY — name the style (brutalist / chitin-grown / cyclopean / Kirby-cosmic / etc.)
- 80-150 words per seed
- NO franchise proper nouns (no "Coruscant" / "Reaper" / "Halo" / etc. — INSPIRED BY, not literal)

━━━ FORBIDDEN — every seed must AVOID ━━━
- Generic descriptors without anchors ("vast city", "sprawling spires", "massive structure", "alien architecture") — these are placeholder noise
- The same tower-with-orange-windows-in-fog default; force variety in architectural style across seeds
- Single-hero-building isolation — every seed has supporting density
- Teal+orange default palette mention — let LIGHTING/VIBE handle palette, don't lock it in the seed

━━━ OUTPUT ━━━
Return EXACTLY ${count} entries. ONE per element of a JSON array of strings. No preamble, no markdown fences, no commentary — JUST the JSON array.

Example shape:
[
  "MEGACITY OF STACKED ZIGGURATS — five-kilometer-tall ribbed obsidian ziggurats arrayed in a grid, each tower a layered city of thousands, connected at seven elevations by 200-meter-wide skybridges thick with traffic. FOREGROUND: hanging-garden terrace edge, vines spilling over rusted railing, two species of birds startled into flight. MIDGROUND: ziggurats marching into smog, hundreds of golden window-lights per face, tiny ships threading the gaps. DEEP DISTANCE: the largest tower of all rising above siblings, glowing crown beacons cycling slowly. SKY: low cloud ceiling lit from below by city glow, twin moons partially visible through smog. SCALE PROVERS: ships are dots, figures on bridges are pinpricks, windows are honey-grain. MATERIAL: ribbed obsidian over engineered concrete, copper-green oxide on bridge-trusses. EMOTIONAL DNA: indifferent megalopolis, you are insignificant.",
  "..."
]`;
}

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

function parseArray(text) {
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('No JSON array found');
  return JSON.parse(m[0]);
}

(async () => {
  console.log(`Generating ${COUNT} Rich Scene Seeds for "${POOL}"${DRY ? ' (dry-run)' : ''}...`);
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(COUNT, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    process.exit(1);
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.error(`Got ${arr?.length || 0} entries — empty result`);
    process.exit(1);
  }
  if (arr.length < COUNT * 0.5) {
    console.warn(`⚠️  Got ${arr.length} of ${COUNT} requested — Sonnet shortfall`);
  }
  console.log(`✓ Sonnet returned ${arr.length} entries in ${elapsed}s`);
  console.log('\nSample (first 2):');
  arr.slice(0, 2).forEach((e, i) => console.log(`\n[${i + 1}] ${e.slice(0, 400)}...`));

  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const outPath = path.resolve(`scripts/bots/starbot/seeds/${POOL}.json`);
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(arr, null, 2));
  console.log(`✓ Wrote ${arr.length} entries → ${outPath}`);
})();
