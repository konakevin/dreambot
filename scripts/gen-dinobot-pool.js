#!/usr/bin/env node
/**
 * DinoBot pool generator (unified). Hosts all per-path pool recipes for
 * DinoBot's bespoke axis-system migration.
 *
 * Usage:
 *   node scripts/gen-dinobot-pool.js --pool <name> --count 30
 *   node scripts/gen-dinobot-pool.js --pool <name> --target 200 --count 30
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const POOL = args.pool;
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

if (!POOL) {
  console.error('Usage: --pool <name> --count N OR --target N');
  process.exit(1);
}

const OUT = path.resolve(__dirname, 'bots/dinobot/seeds', `${POOL}.json`);

const RECIPES = {
  dinobot_paleo_landscape_biome: `Generate ALIEN-MESOZOIC BIOME descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 30-50 words, describing the OVERALL biome/landscape — the ancient prehistoric Earth setting that anchors the scene.

⚠️ STRICT IDENTITY LOCK — every entry must read as UNMISTAKABLY ALIEN-MESOZOIC. NEVER read as modern Earth. NEVER read as Iceland / Pacific-Northwest / Atlantic-coastal-marsh / modern Alpine / English wetland. ALWAYS ancient-world primordial Mesozoic Earth — Pandora-Skull-Island-Land-of-the-Lost coded.

⚠️ Each biome commits to ONE of these signature paleo-environments + a SIGNATURE MEGA-FLORA element that ANCHORS its Mesozoic identity:
- ~15% MESOZOIC CYCAD-PALM VALLEY ON RUST-VOLCANIC PLAIN — red-earth volcanic plain with primordial palm-like cycads scattered across, distant peaks, atmospheric haze
- ~15% PRIMORDIAL JUNGLE WITH MEGA-FLORA — dense Mesozoic jungle saturated with tree-ferns + hanging vine-cathedrals + Araucaria cathedral pillars
- ~12% KARST-TOWER MESOZOIC VISTA — Zhangjiajie-style rock pillars with golden-bronze cliff-clinging mega-flora, misted depth
- ~12% MUSHROOM-TREE GROVE BIOME — fan-cap mega-fungi groves with fern-floor, atmospheric haze, golden god-rays
- ~10% ICONIC MEGA-TREE OUTLOOK — single ancient tree on a rocky outlook, distant Mesozoic mountains
- ~10% TANNIN-DARK MESOZOIC RIVER — primordial river through tree-fern-and-cycad-packed banks, atmospheric haze
- ~8% VOLCANIC PALEO-PLAIN — black-basalt plain with cycad-clusters, distant volcano with smoke plume
- ~8% MEGA-CONIFER CATHEDRAL FOREST — ancient Araucaria 200ft tall, fern-floor, god-rays
- ~5% PRIMORDIAL SHORELINE — Mesozoic inland-sea coast with cycad-palm fringe and primordial-coded geography
- ~5% MISTED PALEO-CANYON — deep canyon with mega-flora clinging to cliff walls, golden afternoon haze

⚠️ HARD BANS — these are signature failure modes:
- NO Iceland-style snowy-rocky-grey-monochrome canyons
- NO modern coastal marsh / Atlantic wetland / sandy-beach-with-cumulus-only
- NO temperate-deciduous English oak / maple / beech forest
- NO Pacific-Northwest rainforest / Olympic rainforest aesthetic
- NO modern alpine / Swiss-Alps / Rocky-Mountain aesthetic
- NO grasslands / lawn / savanna (Cretaceous predates grasslands)
- NO modern coniferous forest (pine / spruce / fir)
- NO human-trace / no roads / no fences / no buildings
- NO modern animals

EVERY entry includes:
- THE PALEO-BIOME TYPE specifically named (alien-Mesozoic-coded — palm-cycad valley / mushroom-tree grove / karst-tower vista / etc.)
- A SIGNATURE MEGA-FLORA element anchoring the Mesozoic identity
- WARM EARTH-TONE PALETTE cue (rust-red / golden-bronze / amber / autumn-ochre / emerald-undergrowth)
- ATMOSPHERIC depth (misted distance / golden haze / blue-violet receding)
- MULTI-TIER DEPTH (foreground tactile / midground biome body / deep distance / sky)

GOOD examples:
- A primordial rust-red volcanic plain scattered with primordial palm-cycads 30ft tall, basalt boulders strewn across the ochre earth, distant Mesozoic peaks rising through golden afternoon haze, small water-cuts threading through the red soil toward a distant lake
- A dense Mesozoic jungle saturated with 80ft tree-ferns and hanging vine-cathedrals draping from Araucaria mega-conifers above, fern-floor undergrowth in deep emerald, atmospheric haze receding into golden depth
- A Zhangjiajie-style karst-tower vista rising from a misted Mesozoic valley, golden-bronze foliage clinging to every vertical cliff-face, atmospheric depth compressing into deep blue-violet haze between columns

Output: ONE biome per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_megaflora: `Generate PRIMORDIAL MEGAFLORA descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 30-50 words, describing the IMPOSSIBLY HUGE prehistoric plant-life that defines a Mesozoic / Jurassic / Cretaceous landscape — mega-trees, giant ferns, cycads, primordial conifers, ancient horsetails, mushroom-tree groves, gnarled iconic mega-trees, karst-tower cliff-trees.

This is the FLORA that makes a paleo-landscape feel ALIEN and AWE-INSPIRING. Mushroom-tree groves with fan-cap mega-fungi. Iconic single mega-trees. Karst-tower mountains with golden cliff-foliage. Cycad-palm groves on rust-volcanic plains. Mega-conifer cathedrals with sun-shafts.

⚠️ PALETTE LOCK — every entry skews WARM EARTH-TONES — autumn-gold / bronze / rust-red / amber / ochre / emerald-undergrowth / blue-haze at distance. Rich saturated warm tones. NEVER cold-monochrome, NEVER washed-out.

⚠️ VARIETY MANDATE — equal weight across all 8 signature formations. NEVER let one dominate. The path's identity is the FULL VARIETY across these formations, not any single one:
- ~13% MUSHROOM-TREE GROVES — fan-cap mega-fungi 80ft tall in golden-bronze, fern-floor, atmospheric haze
- ~13% ICONIC SINGLE MEGA-TREE — a single impossibly-large gnarled ancient tree dominating a rocky outlook, distant mountains
- ~13% CYCAD-PALM GROVES ON RUST-VOLCANIC PLAINS — primordial palm-like cycads scattered across red-earth volcanic plain, distant peaks
- ~13% KARST-TOWER MOUNTAINS with CLIFF-CLINGING TREES — towering Zhangjiajie-style rock pillars with golden-bronze foliage on cliff-faces, misted depth
- ~13% MEGA-CONIFER CATHEDRAL — ancient Araucaria 200ft tall, scale-bark trunks, golden god-rays through canopy
- ~12% HANGING VINE-CATHEDRALS — impossible vine-curtains from invisible canopy, draping mega-corridors
- ~12% TREE-FERN GROVES — 80ft tree-ferns with bronze-frilled fronds, cathedral-pillar horsetails between
- ~11% GINKGO GROVES — golden-fan-leaved giant ginkgos in autumn-bronze, scattered like deciduous mega-trees

EVERY entry includes:
- THE SIGNATURE FORMATION TYPE (mushroom-tree / single mega-tree / karst-cliff / cycad-palm / Araucaria-cathedral / vine-cathedral / etc.)
- IMPOSSIBLE SCALE cue (80ft mushroom-cap / cathedral-pillar / 200ft tall / impossible heights / iconic single landmark)
- WARM EARTH-TONE COLOR (autumn-gold / bronze / rust-red / amber / ochre — specific named hue)
- ATMOSPHERIC TOUCH (golden god-rays / misted depth / fern-floor / atmospheric haze)
- COMPOSITIONAL CUE (multi-tier canopy stacking / receding into mist / dominating the skyline / scattered across the plain)

GOOD examples:
- A grove of fan-cap mushroom-trees 80ft tall stacking up like a multi-tier roof in golden-bronze, fern-floor undergrowth in deep emerald, golden god-rays shafting through the gaps, atmospheric haze in the distance
- A single impossibly-large gnarled ancient mega-tree dominating a rocky outlook with hanging golden-bronze foliage, twisted root-system splayed across the rocks, distant Mesozoic mountains in misted haze
- Towering Zhangjiajie-style karst-pillars rising from a misted valley, golden-bronze foliage clinging to every vertical cliff-face in scattered cliff-trees, atmospheric depth into deep blue haze
- A scattered cycad-palm grove on a rust-red volcanic plain, primordial palm-like crowns 30ft tall, distant peaks rising through golden afternoon haze, small water-cuts running through red earth
- An ancient Araucaria mega-conifer cathedral 200ft tall, scale-bark trunks rising into shadow, golden god-rays shafting through the upper canopy down to the fern-floor

ABSOLUTELY BANNED:
- NO Iceland-style snowy alpine canyons (cold-rocky-grey-monochrome)
- NO English-oak deciduous wetland marsh
- NO modern grass / lawn / savanna (Cretaceous predates grasslands)
- NO modern-coniferous-forest (pine / spruce / fir)
- NO bonsai-scale (always MEGA)
- NO animal life in the flora description (this is the plant slot only)
- NO cold-monochrome / washed-out palette

Output: ONE megaflora entry per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_phenomenon: `Generate ATMOSPHERIC / GEOLOGIC PHENOMENON descriptions for DinoBot's paleo-landscape path (80%-gated). Each is ONE comma-separated line, 20-35 words, describing a dramatic atmospheric or geologic event that elevates the prehistoric landscape — volcanic activity, weather drama, light phenomena, dust events, mist banks, etc.

Variety mandate:
- ~15% Distant volcanic activity (smoke plume / ash column / lava-glow at horizon / pyroclastic curl on distant slope)
- ~15% Storm-front drama (thunderhead wall / sheet-lightning / rain-curtain / squall-line at horizon)
- ~10% Golden god-rays through canopy / cloud (specific light shafts cutting through atmosphere)
- ~10% Mist banks / fog rolling (low ground-fog / river-mist / canopy-mist)
- ~10% Distant comet / fireball / atmospheric event (Cretaceous-doom-coded — use sparingly)
- ~10% Massive flock-event in sky (pterosaur flock streaming across distance / cloud of insects)
- ~10% Dust-event (herd-stirred dust on plain / wind-blown sediment / volcanic ash drift)
- ~10% Aurora / atmospheric-glow event (rare strange Cretaceous sky-glow)
- ~10% Sunset / sunrise epic-color (specific named gradient — molten-rose-and-amethyst / blood-orange-into-violet)

EVERY entry includes:
- THE PHENOMENON TYPE (volcanic / storm / god-ray / mist / etc.)
- A SPECIFIC visual detail (smoke column / lightning fork / shaft of light / fog-curl / etc.)
- POSITION in the frame (at distant horizon / above the canopy / rolling along the river / draping the valley / etc.)

GOOD examples:
- Distant volcanic activity at the deep horizon — single ash plume rising 30,000 feet, lava-glow at the volcano's base lighting the underside of the column
- Storm-front wall at deep midground — towering thunderhead stretching from horizon to zenith, sheet-lightning illuminating its underbelly, rain-curtain descending below
- Golden god-rays slanting through the tree-fern canopy in three parallel shafts, illuminating drifting pollen and insect-haze, the canopy above silhouetted dark
- Massive pterosaur flock streaming across the deep distance in a long ribbon, hundreds of small dark V-shapes against the violet-rose sunset sky
- Low river-mist rolling along the valley floor at hip-height, only the tops of the cycads visible above the cloud, golden morning-light catching the upper canopy

ABSOLUTELY BANNED:
- NO modern weather-event imagery (no rainbows / no contrails)
- NO humans / human-trace
- NO modern animals
- NO sci-fi / cosmic / nebulae (this is Earth, not space — comet/fireball is exception, atmospheric only)
- NO cheap horror imagery

Output: ONE phenomenon per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_surprise_element: `Generate CANDID DINOSAUR descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 25-40 words, describing a dinosaur (or pterosaur / aquatic-reptile) IN the prehistoric landscape doing CANDID natural behavior — grazing, drinking, walking, resting, mid-movement, surveying. NOT posing, NOT action-set-piece, NOT close-up portrait.

The dinosaur is a MEANINGFUL element of the scene at MEDIUM scale — 15-30% of the frame. Position: midground, integrated INTO the landscape, with mega-flora around it. Photoreal living animal in its natural prehistoric world. National-Geographic-cinematic candid moment.

Variety mandate (rotate widely across dinosaur types):
- ~20% Sauropod (long-necked giant — Brachiosaurus / Apatosaurus / Argentinosaurus / Diplodocus) feeding from canopy / walking through grove / drinking from river
- ~15% Hadrosaur (Parasaurolophus / Edmontosaurus / Maiasaura) grazing mega-flora / drinking / mid-stride
- ~10% Ceratopsian (Triceratops / Styracosaurus / Pachyrhinosaurus) at watering hole / mid-walk / surveying
- ~10% Theropod (Tyrannosaurus / Allosaurus / Giganotosaurus) walking / surveying / mid-stride — never combat-action
- ~10% Stegosaur / ankylosaur (Stegosaurus / Ankylosaurus / Euoplocephalus) grazing / walking / mid-tail-sway
- ~10% Pterosaur (Quetzalcoatlus / Pteranodon) perched on cliff-edge / mid-takeoff / gliding across midground
- ~10% Aquatic reptile (Mosasaurus / Plesiosaur / Liopleurodon) surfacing in distant lake / wading at shoreline
- ~5% Small theropod (Velociraptor / Compsognathus / Oviraptor) in midground undergrowth — looking up / pausing mid-step
- ~5% Juvenile dinosaur (smaller version of any species) — sense of family / pack life

EVERY entry includes:
- THE DINOSAUR SPECIES (scientifically named or genus-coded)
- THE CANDID ACTION (grazing / drinking / walking / mid-stride / surveying / resting / drinking from river / etc.)
- POSITION IN FRAME (midground left / midground right / partly framed by mega-flora / at the watering hole / etc.)
- ONE ATMOSPHERIC DETAIL (catching the golden light / silhouetted in haze / dust rising at its feet / etc.)
- INTEGRATION with the LANDSCAPE — the dino is IN the world, not standing in front of it

GOOD examples:
- A massive Brachiosaurus sauropod in the midground feeding from the upper canopy, long neck arched 40 feet into a tree-fern crown, golden afternoon light catching its hide, smaller cycads packed around its legs
- A pair of Parasaurolophus hadrosaurs at midground drinking from a tannin-dark river-bend, dust rising at their feet, atmospheric haze in the distance, mega-flora packed across the background
- A lone Triceratops at midground left mid-stride through a clearing in the cycad-palm grove, head down sniffing the ground, golden god-rays catching its frill, rust-volcanic plain stretching to distant peaks
- A Tyrannosaurus rex at midground walking past a fallen mega-log, head turned to scan the canopy, dust rising at its tail, deep-violet haze receding behind
- A Quetzalcoatlus pterosaur perched on a karst-tower cliff-edge at midground, 30-foot wings folded, looking out across the misted valley

ABSOLUTELY BANNED:
- NO humans / human-trace
- NO modern animals
- NO portrait close-up framing (dino is INTEGRATED into landscape, not a portrait)
- NO action-combat-set-piece (always candid natural behavior)
- NO weapons / tools / artifacts
- NO duplicate-style entries (every entry different species + different action)

Output: ONE candid dinosaur per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_sky: `Generate MESOZOIC SKY descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 15-30 words, describing the sky above the prehistoric landscape — saturated, theatrical, atmospheric.

The sky is THE atmospheric anchor — always SATURATED + DRAMATIC. Mesozoic skies were richly colored (higher CO2 atmosphere) — emerald-tinted dusks, blood-orange sunsets, violet-rose dawns, copper twilight.

Variety mandate:
- ~20% Golden / amber late-afternoon sky (warm directional light)
- ~15% Violet-rose sunset/sunrise (twilight bleeds)
- ~15% Storm-bruised purple sky (thunderhead drama)
- ~10% Eclipse / dim-sun / unusual-light event
- ~10% Pre-dawn aqua / silver morning
- ~10% Mesozoic-emerald-tinted high atmosphere
- ~10% Pale blue with monsoon cloud-architecture
- ~10% Copper-sunset with pyroclastic / ash drift

EVERY entry includes:
- THE SKY COLOR PALETTE (specific named hues — molten-rose-and-amethyst / blood-orange-into-violet / etc.)
- ONE CLOUD ARCHITECTURE detail (cumulus / mammatus / cirrus / thunderhead / streaks)
- ONE ATMOSPHERIC DETAIL (haze / clarity / pollen-mist / smoke-veil)

GOOD examples:
- Golden afternoon sky bleeding to copper-amber at horizon, towering cumulus cloud-castles catching the warm directional light, mid-altitude haze softening the deep distance
- Violet-rose dusk bleeding to deep-indigo zenith, single bright morning-star visible at horizon, scattered cirrus catching the fading light
- Storm-bruised violet sky with mammatus pouches at high altitude, sheet-lightning illuminating the underbelly, rain-curtain descending at deep distance
- Mesozoic-emerald-tinted high atmosphere bleeding to copper at horizon, cumulus thunderheads piled vertically, soft pollen-haze in the mid-atmosphere

ABSOLUTELY BANNED:
- NO modern-blue clear-sky / no contrails
- NO sci-fi / nebulas / orbital
- NO red-fog / blood-rain dominant
- NO cheerful-summer-blue

Output: ONE sky per line. No numbering. No quotes.`,
};

const RECIPE = RECIPES[POOL];
if (!RECIPE) {
  console.error('Unknown pool:', POOL);
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 4)
    .join('|');
}

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} entries now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`[${POOL}] appending: existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
    return;
  }
  const batch = await generateBatch(COUNT);
  const sigs = new Set();
  const deduped = batch.filter((b) => {
    const sig = signatureOf(b);
    if (sigs.has(sig)) return false;
    sigs.add(sig);
    return true;
  });
  fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
  console.log(`[${POOL}] wrote ${deduped.length} entries`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
