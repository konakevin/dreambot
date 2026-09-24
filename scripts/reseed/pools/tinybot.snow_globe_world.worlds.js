/* global __dirname */
/**
 * tinybot / snow-globe-world / worlds (Track B: GROW from 25 to 100+) — the SUBJECT of the path: the
 * sealed little WORLD inside the globe, written as a real place with its own lit windows, its own road
 * going somewhere and its own far side, plus one small thing caught mid-act. 50-80 words, "A/An <place>
 * <verb> …" with semicolon-chained clauses, two or three named colours, snow or the place's own drifting
 * particle ("… instead of flakes"). The world never mentions the glass, a base or a stand.
 *
 * Same idea = the WORLD TYPE (an alpine village, a frozen canal town, a moon base …). The 25 originals
 * are kept byte-identical; new entries each take one unused type from the roster below, with its
 * particle as flavour. The caught-mid-act detail is Sonnet's, tied to the place (flavour, not the
 * varying element). Six originals carry a stray de-lettering clause ("its flanks and panels one plain
 * block of painted colour …"); it is stripped from the examples and banned in new entries.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/tinybot/seeds/tinybot_snow_globe_worlds.json');

const W = (words, particle, re, original) => ({ words, particle, re, original: !!original });
const WORLDS = {
  // ── the 25 originals: rules only, never assigned ──
  'alpine village': W('', 'snow', /alpine village|switchback/i, true),
  'frozen canal': W('', 'snow', /frozen canal/i, true),
  'sleigh road': W('', 'snow', /sleigh road/i, true),
  'frozen harbour': W('', 'snow', /harbour freezes|frozen harbour|locked into the ice/i, true),
  'cliff monastery': W('', 'snow', /cliff monastery/i, true),
  'mountain railway': W('', 'snow', /mountain railway/i, true),
  'bakery street': W('', 'snow', /bakery street/i, true),
  'fir plantation': W('', 'snow', /fir plantation/i, true),
  'night city': W('', 'snow', /night city/i, true),
  'storm farm': W('', 'snow', /thunderstorm stands|storm farm/i, true),
  'aurora cabin': W('', 'snow', /aurora unreels|aurora cabin/i, true),
  'summer meadow': W('', 'pollen', /summer meadow/i, true),
  'coral reef': W('', 'silt', /coral reef/i, true),
  'volcano beach': W('', 'ash', /volcano's flank|volcano beach/i, true),
  carnival: W('', 'snow', /carnival/i, true),
  'desert caravan': W('', 'sand', /desert caravan/i, true),
  'moon base': W('', 'dust', /moon base|lunar base/i, true),
  'jungle temple': W('', 'rain', /jungle temple/i, true),
  'cherry orchard': W('', 'petals', /cherry orchard/i, true),
  'ocean liner': W('', 'spray', /ocean liner/i, true),
  'balloon meet': W('', 'snow', /balloon meet|hot-air-balloon/i, true),
  'crag castle': W('', 'snow', /crag castle/i, true),
  'dinosaur valley': W('', 'ash', /dinosaurs?/i, true),
  'chimney rooftops': W('', 'snow', /rooftop city|city of chimneys/i, true),
  'ice shelf': W('', 'snow', /ice-shelf|ice shelf/i, true),
  // ── the roster for new entries ──
  'lighthouse headland': W('a lighthouse on a storm headland, its beam sweeping, the keeper\'s cottage lit behind it', 'spray', /lighthouse headland/i),
  'windmill polder': W('a line of windmills along a frozen polder dyke, a straight road on the dyke top', 'snow', /windmill polder|polder/i),
  'tea terraces': W('terraced tea hills stepping down into mist, a pickers\' hut with a lit window', 'mist', /tea terraces|tea hills/i),
  'rice terraces': W('flooded rice terraces mirroring the sky, a stilt house at the top terrace', 'pollen', /rice terraces/i),
  'fjord ferry': W('a small ferry mid-crossing on a fjord between two lit hamlets under steep snow walls', 'snow', /fjord ferry|fjord/i),
  'observatory peak': W('a domed observatory on a bare summit, its dome slit open, a zigzag road below', 'snow', /observatory peak|observatory/i),
  'canal lock': W('a narrowboat sitting low in a canal lock, one lock gate half open, the lock-keeper\'s cottage lit', 'leaves', /canal lock|narrowboat/i),
  'gorge footbridge': W('a rope footbridge across a deep gorge, a lit hut on each rim, a river far below', 'mist', /gorge footbridge|footbridge/i),
  'cathedral square': W('a cathedral square ringed by market stalls under strung bulbs, the great doors open and lit', 'snow', /cathedral square/i),
  'hill town ridge': W('a stone hill town along a ridge, houses stacked to a bell tower, a road switching up from the valley', 'snow', /hill town/i),
  'lakeside boathouse': W('a timber boathouse on a still lake, a jetty running out, one rowing boat tied and rocking', 'snow', /lakeside boathouse|boathouse/i),
  'bayou stilt village': W('a stilt village over a dark bayou, lanterns on every porch, a pirogue poling between the piles', 'fireflies', /bayou|stilt village/i),
  'country station': W('a small country railway station at night, a waiting train with lit carriages, a signal arm raised', 'snow', /country station|railway station/i),
  'shipyard drydock': W('a ship on the stocks in a drydock, cranes lit above it, welding light in the hull', 'sparks', /drydock|dry dock|shipyard/i),
  'colliery headframe': W('a colliery headframe with its winding wheel turning, the lamp-room window lit, a coal train below', 'snow', /colliery|headframe/i),
  'log drive': W('a river log drive, logs jammed at a bend, a lumber camp of lit bunkhouses on the bank', 'snow', /log drive|log jam|lumber camp/i),
  'ski lift': W('a chairlift line climbing past a chalet, the chairs swinging, a piste lit by lamps', 'snow', /ski lift|chairlift|chair-lift/i),
  'ice hotel': W('an ice hotel of carved translucent blocks glowing from inside, an ice archway at its door', 'snow', /ice hotel/i),
  'terraced vineyard': W('a terraced vineyard climbing above a river bend, a press house at the top row', 'leaves', /terraced vineyard|vineyard/i),
  'lavender farm': W('rows of lavender running to a stone barn, a lit farmhouse window, hives at the row ends', 'pollen', /lavender farm|lavender/i),
  'tulip fields': W('striped tulip fields in bands of colour to the horizon, a bulb barn and a straight canal road', 'petals', /tulip/i),
  'bamboo path': W('a stone path through a bamboo grove, stone lanterns lit along it, a gate at the far end', 'leaves', /bamboo/i),
  'pagoda garden': W('a pagoda beside a koi pond among maples, a humpback bridge, a lit lantern on every tier', 'leaves', /pagoda/i),
  'hot-spring village': W('a hot-spring village with steam rising from every pool, wooden inns lit, a stone lane', 'snow', /hot-spring|hot spring|onsen/i),
  'polar station': W('a polar research station of lit huts on stilts over the ice, a snowcat parked, an aerial mast', 'snow', /polar station|research station|snowcat/i),
  'pleasure pier': W('a pleasure pier striding out over the sea on iron legs, its pavilion lit, waves under the deck', 'spray', /pleasure pier|\bpier\b/i),
  'cliff dwellings': W('cliff dwellings in a canyon alcove, firelight in the doorways, ladders between the levels', 'dust', /cliff dwellings|cliff-dwellings/i),
  'whitewashed harbour': W('a whitewashed harbour of cube houses and blue domes above a small quay, a caique moored', 'spray', /whitewashed|blue domes|cube houses/i),
  'sea-cave harbour': W('boats moored inside a sea cave, lanterns hung from the rock, the sea mouth bright beyond', 'spray', /sea-cave|sea cave/i),
  'dam wall': W('a great dam wall with a road across its crest, the reservoir behind, spillways roaring', 'spray', /dam wall|\bdam\b/i),
  'snow-gallery pass': W('a mountain pass road running through snow galleries, a postbus with lit windows on the bends', 'snow', /snow gallery|snow-gallery|mountain pass/i),
  'desert oasis': W('a desert oasis of palms around a pool, a caravanserai with lit arches, dunes behind', 'sand', /oasis|caravanserai/i),
  'rapids canyon': W('a raft mid-rapid in a red-rock canyon, the river bright between sheer walls, a camp on a sandbar', 'spray', /rapids canyon|rapids?\b/i),
  'redwood road': W('a road tunnelled through a giant redwood, headlights inside the trunk, the grove towering above', 'mist', /redwood/i),
  'ice cave': W('a blue ice cave under a glacier, a climber\'s lamp lit deep inside, meltwater running', 'snow', /ice cave/i),
  'crater lava lake': W('a lava lake glowing in a crater, a viewing hut on the rim, the road up the outer flank', 'ash', /lava lake|crater lava/i),
  'subway platform': W('an underground station platform, tiled walls, a lit train arriving out of the tunnel', 'dust', /subway|underground station|metro/i),
  'shop-lined bridge': W('an old stone bridge lined with shops on both sides, their windows lit above the river', 'snow', /shop-lined bridge|bridge lined with shops/i),
  'clock-tower square': W('a town square under a clock tower mid-chime, cafes lit round the edge, a fountain', 'snow', /clock tower|clock-tower/i),
  'cable-car street': W('a cable car climbing a steep city street in fog, tracks shining, bay water at the bottom', 'mist', /cable car|cable-car/i),
  'paddle steamer': W('a stern-wheel paddle steamer on a wide river at dusk, decks lit, a landing stage ahead', 'sparks', /paddle steamer|stern-wheel|sternwheel/i),
  'houseboat row': W('a row of houseboats moored along a canal bank, lit windows, bicycles on the towpath', 'snow', /houseboat/i),
  'treehouse village': W('a treehouse village high in a canopy, rope bridges between trunks, lanterns on every platform', 'leaves', /treehouse/i),
  'airship mast': W('an airship tethered to a mooring mast above a night city, its gondola lit, a gangway out', 'snow', /airship|mooring mast/i),
  'launch pad': W('a rocket on its launch pad under floodlights, the gantry arms drawn back, venting vapour', 'vapour', /launch pad|rocket on/i),
  'undersea dome': W('an undersea dome city glowing on the seabed, lit portholes, a submersible docking', 'silt', /undersea dome|dome city|seabed/i),
  'galleon wreck': W('a sunken galleon leaning on a reef, its stern lantern somehow lit, fish in the rigging', 'silt', /galleon|shipwreck/i),
  'iceberg colony': W('an iceberg with a penguin colony on its shelf, a small research boat alongside', 'snow', /iceberg|penguin/i),
  'whale bay': W('a whale breaching in a bay below a fishing village, the boats turned to watch, spray hanging', 'spray', /whale/i),
  'savanna waterhole': W('an acacia savanna at a waterhole, elephants at the edge, a safari lodge lit on a rise', 'dust', /savanna|waterhole|acacia/i),
  'canopy walkway': W('a canopy walkway strung between rainforest giants, a lodge lit in the crown of one', 'rain', /canopy walkway|walkway/i),
  'village green': W('an English village green with a cricket match, a pub lit, a church spire behind', 'pollen', /village green|cricket/i),
  'highland bothy': W('a stone bothy in a highland glen, a burn running past, stags on the skyline', 'snow', /bothy|highland glen/i),
  'geyser boardwalk': W('a boardwalk across a geyser field, one geyser erupting, steam over coloured pools', 'steam', /geyser/i),
  'stave church': W('a wooden stave church in a snowy valley, its tiers dark against the snow, a lit path', 'snow', /stave church/i),
  'pastel colonial street': W('a pastel colonial street of arcaded houses, vintage cars parked, balconies lit', 'petals', /colonial street|arcaded/i),
  'medina rooftops': W('medina rooftop terraces with lanterns lit, a minaret, the alleys glowing between', 'dust', /medina|minaret/i),
  'tidal causeway island': W('an abbey island joined to the shore by a causeway at low tide, the sands shining', 'spray', /causeway|tidal island/i),
  'covered bridge': W('a red covered bridge over a river, a lit farmhouse beyond, a cart mid-crossing', 'leaves', /covered bridge/i),
  'grain elevator': W('a prairie grain elevator by a railway siding, a lit office window, boxcars waiting', 'chaff', /grain elevator|elevator/i),
  'cattle crossing': W('a cattle drive fording a river, riders on either bank, a chuck wagon on the far side', 'dust', /cattle/i),
  'ghost town': W('a ghost town main street, a tumbleweed rolling, one saloon window lit', 'dust', /ghost town|saloon/i),
  'sluice camp': W('a gold-rush sluice camp on a creek, water running in the sluice boxes, tents lit', 'snow', /sluice/i),
  'cave-house valley': W('a valley of rock chimneys with cave houses cut into them, doorways lit, a dove-cote', 'dust', /cave-house|cave house|rock chimneys/i),
  'surf cove': W('a surf cove with a lifeguard tower, a wave breaking, beach fires on the sand', 'spray', /surf cove|lifeguard/i),
  'mangrove creek': W('a kayak in a mangrove creek, roots arching from the water, a lit jetty at the mouth', 'fireflies', /mangrove/i),
  'firefly shrine path': W('a stone path to a hillside shrine through cedar, paper lanterns lit, fireflies rising', 'fireflies', /shrine/i),
  'cider orchard': W('an apple orchard with a cider press barn, crates stacked, a lit doorway', 'leaves', /cider|apple orchard/i),
  'sugar shack': W('a maple sugar bush with buckets on the trunks, the sugar shack steaming, a sled track', 'snow', /sugar shack|sugar bush|maple sugar/i),
  'bee yard': W('a bee yard of painted hives in a wildflower field, a beekeeper\'s hut lit', 'pollen', /bee yard|hives/i),
  'wind-farm ridge': W('wind turbines along a ridge at sunset, a service road, one turbine feathered still', 'chaff', /wind farm|wind-farm|turbines?/i),
  'marble quarry': W('a marble quarry of white terraced benches, a crane on the top bench, a cut block on a truck', 'dust', /marble quarry|quarry/i),
  'cliff highway': W('a coastal highway cut into a cliff face, one car\'s lights on a bend, surf below', 'spray', /cliff highway|coastal highway|coast road/i),
  'canal aqueduct': W('a stone aqueduct carrying a canal across a valley, a boat crossing high up', 'leaves', /aqueduct/i),
  funicular: W('a funicular climbing to a lit hilltop terrace, two cars passing at the middle loop', 'snow', /funicular/i),
  'gondola valley': W('a gondola cable car crossing an alpine valley, cabins strung to the far station', 'snow', /gondola/i),
  'igloo camp': W('an igloo camp on sea ice glowing from inside, a dog team staked out, a sled', 'snow', /igloo/i),
  'dog-sled trail': W('a dog-sled trail through taiga, the team running, a trapper\'s cabin lit ahead', 'snow', /dog-sled|dog sled|sled dogs/i),
  'reindeer camp': W('a reindeer herders\' camp of cone tents lit from inside, reindeer among the birches', 'snow', /reindeer/i),
  'yurt steppe': W('yurts on an open steppe, horses grazing, a rider on the skyline', 'dust', /yurt/i),
  'hilltop stupa': W('a white stupa on a hilltop with prayer flags streaming, a stair climbing to it', 'snow', /stupa|prayer flags/i),
  'drive-in': W('a drive-in cinema screen glowing at night, cars in rows, the projector beam over them', 'moths', /drive-in/i),
  'desert diner': W('a chrome diner on a desert highway at night, a truck idling, the counter lit', 'dust', /diner/i),
  'lone gas station': W('a lone gas station at night with one pump lit, a road running straight to the horizon', 'dust', /gas station|filling station/i),
  'beach huts': W('a row of pastel beach huts along a promenade, one door open, deckchairs out', 'spray', /beach huts?/i),
  'jungle river ferry': W('a river ferry with lanterns on a jungle river, a landing stage of lit huts', 'rain', /river ferry/i),
  'base camp': W('a mountaineers\' base camp of tents on a glacier moraine, prayer flags, the icefall above', 'snow', /base camp|moraine/i),
  'mountain refuge': W('a stone refuge hut on a high col, one lit window, a marked path of cairns', 'snow', /refuge hut|refuge|cairns/i),
  'oil platform': W('an oil platform standing in a storm sea, every deck lit, the flare burning', 'spray', /oil platform|oil rig/i),
  'container port': W('a container port at night, gantry cranes lit, stacks of coloured boxes, a ship alongside', 'snow', /container port|container ship|gantry/i),
  'seaplane dock': W('a seaplane tied at a lake dock, a lit lodge on the shore, mountains behind', 'snow', /seaplane/i),
  'beaver pond': W('a beaver lodge and dam on a pond at dusk, a cabin light across the water', 'moths', /beaver/i),
  'lantern lake': W('a lake town floating hundreds of lanterns on the water, boats among them, houses lit', 'moths', /lantern lake|floating lanterns|lanterns on the water/i),
};
const STRAY = /,?\s*its flanks and panels one plain block of painted colour wearing a single small painted picture/i;

const head = (text) => text.split(/[;,]/).slice(0, 2).join(',');
function parse(text) {
  let best = null;
  let at = Infinity;
  for (const scope of [head(text), text]) {
    for (const [k, w] of Object.entries(WORLDS)) {
      const m = scope.match(w.re);
      if (m && m.index < at) {
        at = m.index;
        best = k;
      }
    }
    if (best) break;
  }
  const type = best || 'place';
  return { keys: [`type:${type}`], type };
}
const sameGroup = (a, b) => a.type === b.type;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['world']));
}
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const taken = (k) => groups.some((g) => (g.assignment ? g.assignment.type : g.type) === k);
  const free = shuffle(Object.keys(WORLDS).filter((k) => !WORLDS[k].original && !taken(k)));
  const type = byUsage(free, usage, (k) => 'type:' + k)[0];
  if (!type) return null;
  const w = WORLDS[type];
  return { keys: [`type:${type}`], type, words: w.words, particle: w.particle, tags: [type] };
}
function examples(kept, texts) {
  return kept.slice(0, 8).map((k) => texts[k].replace(STRAY, ''));
}
function brief(batch, ex) {
  return `You write entries for one pool of a miniature-photography bot: TinyBot's snow-globe path, the WORLD axis: the whole little hand-painted world sealed inside a snow globe, the subject of the picture. Every entry is ONE world in 50-80 words.

Examples already in the pool (match their voice, structure and length exactly):
${ex.map((e) => '- ' + e).join('\n')}

Rules:
- Open with "A" or "An" and the place given for the slot, named with the slot's own phrase, then what it does ("climbs", "cuts between", "clings to", "spreads to", "loops", "crowds", "stands on", "drops to"; vary the verb, "blazes" at most once in a batch) — one sentence of semicolon-chained clauses like the examples, 50-75 words.
- Give the place its own life: lit windows or lamps, a road or track or water going somewhere, a far side or distance that continues; two or three named paint colours (cobalt, mustard-yellow, burnt orange, ox-blood, acid green, butter-yellow, deep plum …).
- End with ONE small thing caught mid-act that belongs to this place (a door swinging, a boat rocking, a lantern still swinging, a sled ready, a gate half-open), the way every example does.
- If the slot's drifting particle is not snow, say what drifts through the water instead of flakes (petals, ash, pollen, sand, silt, sparks, fireflies, leaves, spray, dust, moths, steam, mist, chaff, vapour), as the examples do.
- The world only: never the glass, a globe, a base, a stand, a room, a hand. No readable lettering, signs, logos or words anywhere. Describe only what is present; write no negative words.
- Keep every figure implied or tiny; the place is the subject.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. world: "${a.words}"; drifting particle: ${a.particle}`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An) .{250,}$/;
const BANS = [
  // "lamp-room", "hand-painted", "base camp" and "moon base" are the world's own words, not the vessel
  ['vessel', /\b(glass|globe|snow globe|snow-globe|stand|plinth|shelf|table|hand(?!-)|(?<!-|lamp |engine |boiler )room)\b/i],
  ['text', /\b(sign|signs|signage|lettering|letters|logo|logos|banner|printed|words|writing|label|labels)\b/i],
  ['stray', /flanks and panels one plain block/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.type !== a.type) p.push(`type ${parsed.type}≠${a.type}`);
  const words = cand.split(/\s+/).length;
  if (words < 45 || words > 82) p.push(`${words} words`);
  if (a.particle !== 'snow' && !new RegExp(a.particle.replace(/s$/, ''), 'i').test(cand)) p.push(`particle missing (${a.particle})`);
  if (!/;/.test(cand)) p.push('no semicolon clauses');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const o = {};
  parsed.forEach((p) => (o[p.type] = (o[p.type] || 0) + 1));
  return { type: o };
}

module.exports = {
  name: 'tinybot/snow_globe_world/worlds',
  poolFile,
  basis: 'world = the sealed place type; same when the type matches; greedy, pool order (particle and the caught detail are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  examples,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [280, 640],
  WORLDS,
};
