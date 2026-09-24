/* global __dirname */
/**
 * earthbot / national-parks / subject — ONE dramatic geological scene typical of the US National Park
 * system, described WITHOUT park, landmark or vantage names (recipe R1, playbook LESSON 7: names
 * trigger Flux's tourist-snapshot prototypes; the GEOLOGY carries the identity).
 *
 * What the pool IS (kept): object entries { tags (1-3 of 8 biome tags), description 25-45 words }: a
 * POV opener, drama vocabulary, the specific formation + material, a scale anchor, surface character.
 * No weather / light / sky / wildlife (other axes). At most one broad regional anchor per entry.
 *
 * What was wrong (2026-09-23): 189 entries, 51 of them glaciers, "Knee-level POV across a continent-scale
 * gypsum dune field…" and "Aerial drone perspective over a vermilion sandstone hoodoo amphitheater…"
 * repeated with the numbers changed.
 *
 * The varying element = the SCENE: geological PROVINCE + FORMATION + POV. Same idea = all three match.
 * Rewrites pre-assign the three from a roster of real US-park geology (each formation real in its
 * province, with its real rock), least-used first, provinces weighted to the recipe's biome spread.
 * Every formation carries an explicit key regex (its identifying noun) so the checks never depend on
 * the LLM keeping our adjectives.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/earthbot/seeds/national_parks_subject.json');

// ── Roster: province → formations [words, tags, key] ────────────────────────────────────────────
const P = {
  colorado: {
    weight: 5,
    anchor: 'Colorado Plateau',
    rocks: 'Navajo / Entrada / Wingate sandstone, Claron limestone, Vishnu schist',
    f: {
      arch: ['freestanding rust-orange Entrada sandstone arch', ['desert'], /\barch(?:es)?\b/],
      slot: ['banded Navajo sandstone slot canyon narrowing to shoulder width', ['desert'], /slot/],
      hoodoos: ['vermilion Claron limestone hoodoo amphitheater', ['desert'], /hoodoo/],
      mesa: ['sheer-walled Wingate sandstone mesa above a desert plain', ['desert'], /\bmesa/],
      strata: ['mile-deep layer-cake canyon strata down to black Vishnu schist', ['desert'], /strata|layer-cake|schist/],
      slickrock: ['petrified cross-bedded Navajo sandstone dome field', ['desert'], /slickrock|sandstone dome|dome field|cross-bedded/],
      fins: ['parallel Entrada sandstone fin maze', ['desert'], /\bfins?\b/],
      bridge: ['natural sandstone bridge spanning a dry wash', ['desert'], /natural (?:sandstone |stone )?bridge|dry wash/],
      petrified: ['agatized petrified-log badlands in banded bentonite', ['desert'], /petrified|agatized/],
      monocline: ['tilted monocline reef of Wingate cliffs', ['desert'], /monocline/],
      cliffwall: ['two-thousand-foot Navajo sandstone canyon wall', ['desert'], /canyon wall|sandstone wall/],
    },
  },
  sierra: {
    weight: 3,
    anchor: 'Sierra Nevada',
    rocks: 'glacier-polished granite',
    f: {
      face: ['glacier-polished three-thousand-foot granite face', ['alpine', 'temperate-forest'], /granite (?:face|wall|monolith)/],
      dome: ['exfoliating granite dome above a glacial valley', ['alpine'], /granite dome|exfoliat/],
      spires: ['granite spire crest above a glacial cirque', ['alpine'], /spire/],
      sequoia: ['cathedral-tall giant-sequoia grove', ['temperate-forest'], /sequoia/],
      tarn: ['mirror-clear granite-basin tarn', ['alpine'], /\btarn/],
      waterfall: ['free-leaping waterfall off a granite lip', ['alpine', 'temperate-forest'], /waterfall|\bfalls?\b/],
      valley: ['U-shaped glacier-carved granite valley', ['alpine', 'temperate-forest'], /U-shaped|glacier-carved (?:granite )?valley/],
      lake: ['cobalt subalpine lake in a granite bowl', ['alpine'], /subalpine lake|granite bowl|alpine lake/],
    },
  },
  cascades: {
    weight: 3,
    anchor: 'Cascade Range',
    rocks: 'andesite, pumice, basalt columns',
    f: {
      volcano: ['fourteen-thousand-foot glaciated stratovolcano cone', ['alpine', 'volcanic'], /stratovolcano|volcano cone|glaciated cone|volcanic cone/],
      caldera: ['impossibly-cobalt caldera lake inside a collapsed volcano', ['volcanic', 'alpine'], /caldera/],
      lava: ['fresh lava-blackened pumice plain', ['volcanic'], /pumice|lava-blackened|lava field/],
      oldgrowth: ['cathedral Douglas-fir and red-cedar old-growth', ['temperate-forest'], /old-growth|Douglas-fir|red-?cedar/],
      waterfall: ['basalt-column waterfall in a fern gorge', ['temperate-forest'], /waterfall|\bfalls?\b/],
      tarn: ['subalpine tarn under a glaciated cone', ['alpine', 'volcanic'], /\btarn/],
      blast: ['blast-zone pumice plain below a breached crater', ['volcanic'], /blast[- ]zone|breached crater/],
    },
  },
  rockies: {
    weight: 3,
    anchor: 'Northern Rockies',
    rocks: 'limestone, shale, argillite, granite',
    f: {
      headwall: ['seven-thousand-foot limestone and shale headwall', ['alpine'], /headwall/],
      morainelake: ['jade moraine lake under a limestone headwall', ['alpine', 'temperate-forest'], /moraine lake/],
      glacier: ['shrinking cirque glacier on a limestone shelf', ['alpine'], /cirque glacier|glacier on/],
      arete: ['knife-edge arête ridge', ['alpine'], /ar[eê]te|knife-edge ridge/],
      larch: ['golden larch basin under granite spires', ['alpine', 'temperate-forest'], /larch/],
      spires: ['sky-piercing granite spires over a sagebrush valley', ['alpine'], /granite spires|sagebrush/],
      argillite: ['red-and-green argillite canyon with turquoise pools', ['alpine'], /argillite/],
    },
  },
  yellowstone: {
    weight: 2,
    anchor: 'Yellowstone Plateau',
    rocks: 'rhyolite, sinter, travertine',
    f: {
      geyser: ['erupting cone geyser on a white sinter apron', ['volcanic'], /geyser/],
      pool: ['cobalt thermal pool with a rust-orange mineral apron', ['volcanic'], /thermal pool|cobalt pool|hot spring/],
      terraces: ['travertine terrace staircase of white and orange', ['volcanic'], /travertine|terrace/],
      mudpots: ['grey boiling mudpot field', ['volcanic'], /mudpot|mud pot/],
      canyon: ['yellow rhyolite canyon with a plunging waterfall', ['volcanic', 'alpine'], /rhyolite/],
    },
  },
  pnw: {
    weight: 3,
    anchor: 'Pacific Northwest',
    rocks: 'basalt, Sitka spruce, moss',
    f: {
      rainforest: ['moss-draped temperate rainforest of colossal spruce', ['temperate-forest'], /rainforest/],
      seastacks: ['basalt sea-stack coast', ['coastal-temperate'], /sea[- ]stack/],
      tidepools: ['wave-cut basalt shelf of tide pools', ['coastal-temperate'], /tide[- ]pool/],
      headland: ['sea-cliff headland plunging into cold surf', ['coastal-temperate'], /headland/],
      waterfall: ['mossy basalt-gorge waterfall', ['temperate-forest'], /waterfall|\bfalls?\b/],
      bigtrees: ['colossal Sitka spruce and hemlock grove', ['temperate-forest'], /Sitka|hemlock/],
      river: ['glacial river braiding through rainforest', ['temperate-forest'], /braid/],
    },
  },
  alaska: {
    weight: 3,
    anchor: 'Alaskan',
    rocks: 'glacier ice, granite, tundra',
    f: {
      tidewater: ['calving tidewater glacier face', ['arctic-polar', 'alpine'], /tidewater|calving/],
      icefield: ['continent-scale icefield spilling glaciers', ['arctic-polar', 'alpine'], /icefield|ice field|ice cap/],
      fjord: ['glacier-carved fjord walls', ['coastal-temperate', 'alpine'], /fjord/],
      boreal: ['boreal spruce taiga under a granite massif', ['temperate-forest', 'alpine'], /boreal|taiga/],
      tundra: ['autumn-red tundra under snow peaks', ['arctic-polar', 'alpine'], /tundra/],
      braided: ['braided glacial river plain', ['alpine'], /braid/],
      spires: ['granite spire wall above a glacier', ['alpine', 'arctic-polar'], /spire/],
      volcano: ['smoking volcano over a caldera lake', ['volcanic', 'alpine'], /volcano/],
    },
  },
  hawaii: {
    weight: 2,
    anchor: 'Hawaiian volcanic shield',
    rocks: 'pāhoehoe and ʻaʻā lava, cinder',
    f: {
      lava: ['lava-blackened shield flank of fresh pāhoehoe', ['volcanic'], /p[āa]hoehoe|shield flank|lava flow/],
      caldera: ['summit caldera floor of cooled lava', ['volcanic'], /caldera/],
      seacliff: ['lava sea cliffs above a black-sand pocket', ['volcanic', 'coastal-tropical'], /sea cliff|black[- ]sand/],
      crater: ['rainforest-rimmed pit crater', ['volcanic', 'tropical-jungle'], /pit crater/],
      cinder: ['cinder-cone desert of a summit crater basin', ['volcanic', 'desert'], /cinder/],
      lavatube: ['collapsed lava-tube skylight', ['volcanic'], /lava[- ]tube|skylight/],
      rainforest: ['ʻōhiʻa and tree-fern rainforest on old lava', ['tropical-jungle', 'volcanic'], /ʻōhiʻa|ohia|tree[- ]fern/],
    },
  },
  sonoran: {
    weight: 3,
    anchor: 'Mojave',
    rocks: 'monzogranite, alkali, badland clay',
    f: {
      saguaro: ['saguaro forest on a boulder bajada', ['desert'], /saguaro/],
      joshua: ['Joshua-tree forest among monzogranite boulder piles', ['desert'], /Joshua/],
      alkali: ['salt-crusted alkali flat below fault-block ranges', ['desert'], /alkali|salt flat/],
      dunes: ['star-dune field of golden sand', ['desert'], /dune/],
      badlands: ['mustard-and-rust badlands', ['desert'], /badlands/],
      playa: ['cracked playa with sliding-stone tracks', ['desert'], /playa/],
      canyon: ['marble-narrows canyon', ['desert'], /marble|narrows/],
      oasis: ['fan-palm oasis on a fault spring', ['desert'], /oasis/],
    },
  },
  greatbasin: {
    weight: 1,
    anchor: 'Great Basin',
    rocks: 'limestone, quartzite',
    f: {
      bristlecone: ['gnarled bristlecone pines on a limestone ridge', ['alpine', 'desert'], /bristlecone/],
      dunes: ['tallest dunes in a mountain basin', ['desert'], /dune/],
      cave: ['marble cave of shields and stalactites', ['desert'], /\bcave|stalactite/],
    },
  },
  plains: {
    weight: 1,
    anchor: 'Badlands',
    rocks: 'striped clay, columnar phonolite',
    f: {
      striped: ['striped clay badlands eroding into spires', ['desert'], /badlands|striped clay/],
      prairie: ['mixed-grass prairie breaks over badlands', ['desert'], /prairie/],
      tower: ['columnar igneous tower over a river plain', ['desert'], /columnar|igneous tower/],
    },
  },
  appalachian: {
    weight: 2,
    anchor: 'Appalachian',
    rocks: 'sandstone, rhododendron, cove hardwoods',
    f: {
      ridges: ['layered blue deciduous ridges receding', ['temperate-forest'], /ridges/],
      cascade: ['sandstone cascade in a rhododendron hollow', ['temperate-forest'], /cascade|rhododendron/],
      gorge: ['sandstone-rim gorge', ['temperate-forest'], /gorge/],
      cove: ['cove-hardwood forest of colossal tulip poplars', ['temperate-forest'], /cove|tulip/],
      bald: ['grassy bald on a high ridge', ['temperate-forest', 'alpine'], /\bbald\b/],
    },
  },
  atlantic: {
    weight: 1,
    anchor: 'cold Atlantic',
    rocks: 'pink granite',
    f: {
      granite: ['pink granite domes meeting cold Atlantic surf', ['coastal-temperate'], /granite dome|pink granite/],
      cobble: ['cobble beach under pink granite cliffs', ['coastal-temperate'], /cobble/],
      spruce: ['spruce-fir forest on pink granite ledges', ['coastal-temperate', 'temperate-forest'], /spruce/],
    },
  },
  florida: {
    weight: 1,
    anchor: 'subtropical',
    rocks: 'limestone, sawgrass, mangrove',
    f: {
      sawgrass: ['sawgrass river of grass with cypress domes', ['coastal-tropical'], /sawgrass/],
      cypress: ['flooded bald-cypress swamp', ['coastal-tropical'], /cypress swamp|bald-cypress|cypress/],
      mangrove: ['mangrove tunnel estuary', ['coastal-tropical'], /mangrove/],
      keys: ['coral-key shallows', ['coastal-tropical'], /coral[- ]key|coral shallows|reef shallows/],
    },
  },
  chihuahuan: {
    weight: 1,
    anchor: 'Chihuahuan Desert',
    rocks: 'gypsum, fossil-reef limestone',
    f: {
      gypsum: ['gypsum dune field of cream-white selenite', ['desert'], /gypsum|selenite/],
      reef: ['fossil-reef limestone escarpment', ['desert'], /fossil[- ]reef|reef escarpment|reef limestone/],
      rio: ['limestone canyon walls of a desert river', ['desert'], /desert river|river canyon|canyon walls/],
      cavern: ['limestone cavern of colossal stalagmites', ['desert'], /cavern|stalagmite/],
    },
  },
  greatlakes: {
    weight: 1,
    anchor: 'freshwater',
    rocks: 'sandstone',
    f: {
      seacaves: ['sandstone sea caves on a freshwater coast', ['coastal-temperate'], /sea cave/],
      dunes: ['perched dune bluffs over a freshwater sea', ['coastal-temperate', 'temperate-forest'], /dune/],
      cliffs: ['mineral-streaked sandstone cliffs', ['coastal-temperate'], /cliffs?\b/],
    },
  },
  arctic: {
    weight: 1,
    anchor: 'Arctic',
    rocks: 'permafrost, aufeis',
    f: {
      tundra: ['polygonal permafrost tundra plain', ['arctic-polar'], /tundra|permafrost/],
      braided: ['braided river through treeless arctic mountains', ['arctic-polar', 'alpine'], /braid/],
      aufeis: ['aufeis ice sheet filling a valley floor', ['arctic-polar'], /aufeis/],
    },
  },
};
const POV = [
  'Low POV looking up at',
  'Aerial drone perspective over',
  'Wide-angle wrapping the basin of',
  'Cliff-edge vantage looking down into',
  'Side-on across',
  'Looking straight down the throat of',
  'From the floor of',
  'Knee-level POV across',
];
const SCALE = [
  'thousand-foot sheer vertical',
  'mile-deep',
  'two-thousand-meter',
  'continent-scale',
  'six-thousand-foot',
  'house-sized',
  'cathedral-vertical',
  'razor-edge',
  'knife-edge',
  'monumental',
];
const SURFACE = [
  'wind-scoured north faces',
  'sun-baked south flank',
  'cold-air-bitten east aspect',
  'glacier-polished',
  'iron-stained',
  'lava-blackened',
  'spray-soaked',
  'frost-shattered',
  'water-polished',
  'lichen-crusted',
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
const PROV_RULES = [
  ['chihuahuan', /gypsum|selenite|Chihuahuan|fossil[- ]reef|Guadalupe|Rio Grande/i],
  ['yellowstone', /Yellowstone|geyser|sinter|travertine|thermal|mudpot|prismatic|rhyolite/i],
  ['hawaii', /Hawaiian|pāhoehoe|pahoehoe|ʻaʻā|lava tube|lava-tube|ohia|ʻōhiʻa|shield/i],
  ['alaska', /Alaska|Alaskan|tidewater|icefield|ice field|fjord|taiga|Aleutian/i],
  ['arctic', /arctic|permafrost|aufeis|tundra/i],
  ['florida', /sawgrass|cypress|mangrove|Everglades|coral key|subtropical/i],
  ['atlantic', /Atlantic|pink granite/i],
  ['greatlakes', /freshwater|Great Lakes|Superior/i],
  ['greatbasin', /Great Basin|bristlecone/i],
  ['appalachian', /Appalachian|rhododendron|tulip poplar|cove[- ]hardwood|\bbald\b/i],
  // the named provinces come before "plains": a Mojave or Plateau entry may also say "badlands"
  ['sonoran', /Mojave|Sonoran|saguaro|Joshua|alkali|playa|sliding-stone|fan-palm|bajada|monzogranite/i],
  ['colorado', /Colorado Plateau|Navajo|Entrada|Wingate|Claron|Vishnu|hoodoo|slickrock|petrified|monocline|slot canyon|sandstone (?:arch|fin|mesa|bridge)/i],
  ['plains', /Badlands|prairie|phonolite|igneous tower/i],
  ['pnw', /Pacific Northwest|Sitka|sea[- ]stack|tide pool|temperate rainforest|hemlock|moss-draped/i],
  ['cascades', /Cascade|stratovolcano|caldera|pumice|blast[- ]zone|Douglas-fir|red-cedar/i],
  ['rockies', /Rockies|Rocky Mountain|argillite|larch|moraine lake|headwall|arête|arete|sagebrush/i],
  ['sierra', /Sierra|sequoia|granite (?:face|dome|monolith|wall|lip|bowl|basin|spire)|glacier-polished/i],
];
const GENERIC_FEATURE = [
  ['glacier', /glacier|icefield|crevasse/i],
  ['waterfall', /waterfall|cascade|\bfalls\b/i],
  ['canyon', /canyon|gorge|narrows/i],
  ['dunes', /dune/i],
  ['badlands', /badlands|striped clay|bentonite/i],
  ['arch', /\barch\b/i],
  ['hoodoos', /hoodoo/i],
  ['spires', /spire|pinnacle|needle/i],
  ['face', /granite (?:face|wall|monolith)/i],
  ['dome', /\bdome/i],
  ['volcano', /volcano|stratovolcano|cinder cone/i],
  ['caldera', /caldera/i],
  ['lava', /lava/i],
  ['pool', /thermal pool|hot spring|cobalt pool/i],
  ['geyser', /geyser/i],
  ['tarn', /tarn|alpine lake|moraine lake|subalpine lake/i],
  ['forest', /sequoia|redwood|old-growth|grove|rainforest|forest/i],
  ['coast', /sea[- ]stack|tide pool|headland|sea cliff|surf/i],
  ['flat', /alkali|salt flat|playa|salt pan/i],
  ['swamp', /cypress|mangrove|sawgrass|swamp/i],
  ['tundra', /tundra|permafrost/i],
  ['cave', /cave|cavern/i],
  ['ridge', /ridge|arête|arete|headwall|peak|summit/i],
];
const POV_RULES = [
  ['Low POV looking up at', /^Low POV (?:looking up|at|from)/i],
  ['Aerial drone perspective over', /^Aerial/i],
  ['Wide-angle wrapping the basin of', /^Wide-angle/i],
  ['Cliff-edge vantage looking down into', /^Cliff-edge/i],
  ['Side-on across', /^Side-on/i],
  ['Looking straight down the throat of', /^Looking straight/i],
  ['From the floor of', /^From the/i],
  ['Knee-level POV across', /^(?:Knee-level|Eye-level|Ground-level|Low POV across)/i],
];
const entryText = (e) => (typeof e === 'string' ? e : e.description);
const provRe = (pk) => PROV_RULES.find(([k]) => k === pk)[1];
const featRe = (pk, fk) => new RegExp(P[pk].f[fk][2].source, 'i');
function parse(text) {
  let province = 'other';
  for (const [k, re] of PROV_RULES)
    if (re.test(text)) {
      province = k;
      break;
    }
  let feature = null;
  if (P[province]) {
    // the formation whose key matches EARLIEST in the text names the scene (the head noun leads)
    let best = Infinity;
    for (const fk of Object.keys(P[province].f)) {
      const m = text.match(featRe(province, fk));
      if (m && m.index < best) {
        best = m.index;
        feature = fk;
      }
    }
  }
  if (!feature) {
    for (const [k, re] of GENERIC_FEATURE)
      if (re.test(text)) {
        feature = k;
        break;
      }
  }
  feature = feature || 'scene';
  let pov = 'other';
  for (const [k, re] of POV_RULES)
    if (re.test(text)) {
      pov = k;
      break;
    }
  return { keys: [`province:${province}`, `feature:${feature}`, `pov:${pov}`], province, feature, pov };
}
function sameGroup(a, b) {
  return a.province === b.province && a.feature === b.feature && a.pov === b.pov;
}

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['scene']));
}
const flavourUse = {};
const spread = (list) => {
  const choice = byUsage(list, flavourUse)[0];
  flavourUse[choice] = (flavourUse[choice] || 0) + 1;
  return choice;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  for (let attempt = 0; attempt < 400; attempt++) {
    const province = among(
      shuffle(Object.keys(P)).sort(
        (x, y) =>
          (usage['province:' + x] || 0) / P[x].weight - (usage['province:' + y] || 0) / P[y].weight
      ),
      4
    );
    const feature = among(
      byUsage(Object.keys(P[province].f), usage, (k) => 'feature:' + k),
      3
    );
    const pov = among(
      byUsage(POV, usage, (k) => 'pov:' + k),
      4
    );
    const cand = { province, feature, pov };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    // an aerial or cliff-edge view of a cave / cavern / lava tube makes no sense
    if (/cave|cavern|lavatube/.test(feature) && /Aerial|Cliff-edge/.test(pov)) continue;
    return {
      keys: [`province:${province}`, `feature:${feature}`, `pov:${pov}`],
      province,
      feature,
      pov,
      anchor: P[province].anchor,
      rocks: P[province].rocks,
      words: P[province].f[feature][0],
      tags: [province, feature, pov],
      scale: spread(SCALE),
      surface: spread(SURFACE),
    };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a landscape-photography bot: EarthBot national-parks. Every entry is ONE dramatic geological scene typical of the American National Park system in 28-45 words, one sentence, comma-separated phrases, no title, and it NEVER names a park, a landmark or a viewpoint (the geology carries the identity). Keep EXACTLY this shape:

<POV opener> <the formation, its real rock, a concrete scale anchor>, <a second physical detail of the same place>, <surface character (wind-scoured / glacier-polished / iron-stained …)>, <a third real feature of the surroundings>

Examples already in the pool (match their voice, order and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Open with EXACTLY the POV opener given. Describe EXACTLY the formation given, naming it with the formation's own noun (arch, slot canyon, hoodoo, geyser, tidewater glacier, saguaro forest …) in its real rock and its real region; you may name the broad regional anchor once ("Colorado Plateau", "Cascade Range" …) and never a park, a landmark, a trail or a viewpoint.
- Drama vocabulary (vertigo-inducing, cathedral-vertical, razor-edge, mile-deep, continent-scale); a concrete scale anchor; surface character words.
- Geology only: no weather, no light or time of day, no sky, no clouds, no fog or mist, no wildlife, no people, nothing built. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. POV "${a.pov}"; formation "${a.words}"; region anchor "${a.anchor}" (rock: ${a.rocks}); scale word "${a.scale}"; surface word "${a.surface}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
function build(text, slot) {
  const a = slot.assignment;
  const tags = a ? [...P[a.province].f[a.feature][1]] : ['desert'];
  return { tags, description: text };
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
const formatRe =
  /^(?:Low POV|Aerial|Wide-angle|Cliff-edge|Side-on|Looking straight|From the|Knee-level|Eye-level|Ground-level)\b.{120,}$/;
const BANS = [
  [
    'name',
    /\b(Yosemite|Bryce|Zion|Grand Canyon|Yellowstone National|Glacier National|Arches National|Canyonlands|Capitol Reef|Crater Lake|Acadia|Olympic National|Denali|Rainier|St\.? Helens|Mammoth|Carlsbad|White Sands|Joshua Tree National|Half Dome|El Capitan|Delicate Arch|Mesa Arch|Landscape Arch|Old Faithful|Grand Prismatic|Bridalveil|Yosemite Falls|Grand Teton|Teton|Tunnel View|Mather Point|Inspiration Point|Glacier Point|Artist Point|Watchman|Wizard Island|Cadillac|Tipsoo|Schwabacher|Painted Wall|Sliding Sands|Antelope Canyon|The Wave|Horseshoe Bend|Monument Valley|Devils Tower|Zabriskie|Badwater|Racetrack Playa|Angels Landing|The Narrows|Thor's Hammer|Multnomah|Haleakal[aā]|K[iī]lauea|Sequoia National|Redwood National|Everglades|Big Bend|Death Valley|Great Smoky|Shenandoah|Kenai|Glacier Bay|Katmai|Wrangell|Gates of the Arctic|Lake Superior)\b/i,
  ],
  [
    'weather-light',
    /\b(sunset|sunrise|golden[- ]hour|dawn|dusk|twilight|alpenglow|storm|fog|rainbow|snowfall|clouds?|skies|sky(?!-piercing)|moonlit|starlit|milky way)\b/i,
  ],
  ['mist', /\bmist\b|misty/i],
  [
    'wildlife-people',
    /\b(elk|bison|bear|bears|eagle|wolf|wolves|moose|deer|bighorn|goat|goats|hiker|hikers|climber|person|people|figure)\b/i,
  ],
  [
    'built',
    /\b(trail|trails|boardwalk|bridge(?! spanning a dry wash)|road|lodge|cabin|viewpoint|overlook|railing|steps|parking)\b/i,
  ],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  if (!provRe(a.province).test(cand)) p.push(`province words missing (${a.province})`);
  if (!featRe(a.province, a.feature).test(cand)) p.push(`formation words missing (${a.feature})`);
  if (!cand.startsWith(a.pov.split(' ')[0])) p.push('pov changed');
  const words = cand.split(/\s+/).length;
  if (words < 24 || words > 60) p.push(`${words} words`); // originals run 40-56
  for (const [name, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${name}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => {
    const o = {};
    parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1));
    return o;
  };
  return { province: t('province'), feature: t('feature'), pov: t('pov') };
}

module.exports = {
  name: 'earthbot/national_parks/subject',
  poolFile,
  basis:
    'scene = geological province + formation + POV opener; same when all three match; greedy, pool order (scale and surface words are flavour)',
  entryText,
  build,
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [180, 500],
};
