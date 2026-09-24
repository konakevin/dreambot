/* global __dirname */
/**
 * steambot / brass-glasshouse / house (Track B: GROW from 25 to 100+) — the HERO of the path: the
 * glasshouse STRUCTURE itself. Every entry = one house FORM, its enclosing glass named and placed
 * where the frame crops it (ribs off the top corners, a glazed flank filling one edge), the way up
 * (a stair, a catwalk, a gallery, a ladder, a lift), and the vantage baked in at the end ("seen from …
 * looking …"). 55-75 words, one sentence with a semicolon.
 *
 * Same idea = the house FORM (a barrel-vaulted nave, a wedding-cake tier house, a dome over an oak,
 * a house on cliff stilts …). The 25 originals are kept byte-identical; each new entry takes one
 * unused form from the roster below, with a way-up kind and a vantage as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/steambot/seeds/steambot_brass_glasshouse_house.json');

const F = (words, re, original) => ({ words, re, original: !!original });
const FORMS = {
  // ── the 25 originals: rules only, never assigned ──
  'palm nave': F('', /barrel-vaulted palm nave/i, true),
  'wedding-cake tiers': F('', /wedding cake/i, true),
  'dome over an oak': F('', /dome raised over an oak/i, true),
  'cliff stilts': F('', /cliff on iron stilts/i, true),
  'house within a house': F('', /complete INSIDE a far larger/i, true),
  'two houses through a wall': F('', /Two houses through one inner glass wall/i, true),
  'lean-to on a brick wall': F('', /lean-to glasshouse laid against/i, true),
  'octagonal pavilion': F('', /octagonal glazed pavilion/i, true),
  'fan apse': F('', /fan-shaped apse/i, true),
  'sunken pit-house': F('', /sunken pit-house/i, true),
  'glass tower with a well': F('', /three-storey glass tower/i, true),
  'canal bridge': F('', /bridging a canal/i, true),
  'ridge-and-furrow vinery': F('', /ridge-and-furrow/i, true),
  'quarry roof': F('', /abandoned stone quarry/i, true),
  'hot-spring house': F('', /steaming hot spring/i, true),
  'single dome with a hoist': F('', /vast single dome/i, true),
  'railway-shed arches': F('', /size of a railway shed/i, true),
  'upturned boat': F('', /upturned boat/i, true),
  'glazed crossing': F('', /glazed crossing where two great naves/i, true),
  'grafted onto a stone house': F('', /grafted straight onto/i, true),
  'low propagating house': F('', /low propagating house/i, true),
  'brass lift cage': F('', /working brass lift/i, true),
  'amphitheatre terraces': F('', /amphitheatre glasshouse/i, true),
  'lily house': F('', /^A lily house/i, true),
  'curved bay end': F('', /one great curved bay/i, true),
  // ── the roster for new entries: the FORM of the house, never a plant ──
  'twin naves with an arcade': F('twin glazed naves side by side, joined down the middle by an open iron arcade', /twin (?:glazed )?naves|two naves side by side/i),
  'viaduct arch house': F('a glasshouse built along the top of a railway viaduct, its glazed roof riding the arches', /viaduct/i),
  'rotunda with a cupola': F('a circular glass rotunda crowned by a glazed cupola on a ring of iron columns', /cupola/i),
  'pineapple stove': F('a low pineapple stove house with brick tan-bark pits under a close glazed slope', /pineapple stove|tan-bark/i),
  'orangery': F('a stone orangery with tall round-arched windows down one flank and a glazed roof added above', /orangery/i),
  'tufa fernery': F('a fernery grotto of tufa rock walls under a glass roof, dripping stone on every side', /fernery|tufa/i),
  'hexagonal clerestory': F('a hexagonal glasshouse with a raised clerestory of small panes around its crown', /hexagonal|clerestory/i),
  'railway cutting span': F('a glasshouse spanning a railway cutting, the glazed roof bridging from rim to rim above the rails', /railway cutting/i),
  'three spans and a corridor': F('three parallel span-roof houses joined at their ends by one long glazed corridor', /three parallel|span-roof houses/i),
  'lake pier house': F('a glasshouse standing out over a lake on an iron pier, water showing under the grating', /lake on an iron pier|pier over a lake|over a lake on/i),
  'mill rooftop house': F('a glasshouse built on the flat roof of a brick mill, its glazed walls rising from the parapet', /roof of a (?:brick )?mill|mill roof/i),
  'abbey nave house': F('a glasshouse roofed inside the roofless nave of a ruined abbey, glass spanning the old stone arches', /ruined abbey|abbey nave/i),
  'quarter-mile corridor': F('a corridor house a quarter of a mile long, one glazed vault running to a vanishing point', /quarter of a mile|quarter-mile/i),
  'cruciform lantern': F('a cruciform house with a glass lantern tower rising over the crossing', /cruciform/i),
  'hillside terraces': F('a glasshouse stepped down a hillside in four glazed terraces, each roof lower than the last', /stepped down a hillside|four glazed terraces/i),
  'cathedral palm house': F('a cathedral-height palm house with two tiers of iron galleries ringing the walls', /cathedral-height|two tiers of (?:iron )?galleries/i),
  'glass cloister': F('a glazed cloister running around all four sides of an open stone court', /cloister/i),
  'wave-form roofs': F('a curvilinear house whose roofs rise and fall in glazed waves along its length', /curvilinear|glazed waves|wave-form/i),
  'glass pyramid': F('a glazed pyramid on a square iron base, the ribs meeting at a single point high above', /pyramid/i),
  'ravine barrel': F('a glass barrel vault flung across a ravine, rock on both sides and the drop below the grating', /ravine/i),
  'flue-warmed hot wall': F('a hot-wall house against a flue-warmed brick wall, its glazed slope leaning on the warm brick', /hot-wall|hot wall|flue-warmed/i),
  'lighthouse-base house': F('a glasshouse wrapped around the base of a stone lighthouse tower', /lighthouse/i),
  'lawn-buried corridor': F('a sunken glass corridor under a lawn, only its ridge showing above the grass', /under a lawn|beneath a lawn|sunken glass corridor/i),
  'walled-garden range': F('a glass range running along three walls of a walled kitchen garden', /walled (?:kitchen )?garden|glass range/i),
  'moated dome': F('a great dome standing inside a ring of water, reached by an iron footbridge', /ring of water|moat/i),
  'barge house': F('a glasshouse built on the deck of a canal barge, its glazed roof low over the hold', /barge/i),
  'carriage house': F('a glasshouse built on a railway carriage standing on a siding, glazed from floor to roof', /railway carriage|on a siding/i),
  'hillside tunnel': F('a glass tunnel driven straight through a hillside, daylight at both ends', /glass tunnel|through a hillside/i),
  'mezzanine house': F('a double-height house with a full iron mezzanine floor slung across its middle', /mezzanine/i),
  'indoor waterfall': F('a glasshouse built around a waterfall that drops from a rock shelf inside it', /waterfall/i),
  'fountain rotunda': F('a glass rotunda around a tiered stone fountain playing at its centre', /fountain/i),
  'roofed courtyard': F('the inner courtyard of a mansion roofed over in glass, stone windows on every side', /courtyard/i),
  'windmill pump house': F('a long house with a wind-pump turning at its end, the sails seen through the gable glass', /wind-pump|windmill/i),
  'Gothic chapel folly': F('a folly glasshouse shaped like a Gothic chapel, pointed glazed arches and a glass steeple', /gothic|pointed (?:glazed )?arches|steeple/i),
  'Moorish arches': F('a glasshouse of horseshoe Moorish arches in cast iron, the glass set in latticed panes', /moorish|horseshoe arches/i),
  'pagoda tiers': F('a glasshouse stepped up in pagoda tiers with upturned glazed eaves', /pagoda/i),
  'shell spiral': F('a house on a spiral plan winding inward like a snail shell, the glass roof coiling with it', /spiral plan|snail shell|coiling/i),
  'glass ziggurat': F('a stepped glass ziggurat, each square storey set back from the one below', /ziggurat/i),
  'bell dome': F('a bell-shaped glass dome flaring out at its foot, the ribs curving like a bell mouth', /bell-shaped|bell dome|bell mouth/i),
  'retractable roof': F('a house whose glazed roof rolls back on rails, one half already open to the sky', /rolls back|retractable|half already open/i),
  'ship-mast bracing': F('a glasshouse braced with old ship masts and rigging inside, the glass hung from them', /ship masts?|rigging/i),
  'chimney through the glass': F('a glasshouse with a tall brick boiler chimney rising straight up through its roof', /chimney/i),
  'cliff-bracket house': F('a glasshouse hung off a cliff face on iron brackets, empty air below the grating', /hung off a cliff|iron brackets/i),
  'pond bubble': F('a spherical glass bubble house floating on a pond, reached by a plank walk', /spherical|glass bubble|bubble house/i),
  'clock-face gable': F('a house whose glazed end gable carries a great clock face, its hands seen from inside', /clock face|clock-face/i),
  'fort casemate': F('a glasshouse built inside a fort casemate, glass roofing the vaulted gun gallery', /casemate|fort/i),
  'castle curtain-wall lean-to': F('a lean-to glasshouse against a castle curtain wall, arrow slits in the stone behind the beds', /curtain wall|arrow slits/i),
  'station rooftop': F('a glasshouse on the roof of a railway station, the train shed vaults visible below through its floor glass', /railway station|station roof/i),
  'towpath arches': F('a corridor of glass arches along a canal towpath, barges passing beside the glass', /towpath/i),
  'giant-tree cage': F('a glass cage built around one giant tree, the crown pressing on the panes', /glass cage|around one giant tree/i),
  'rose window nave': F('a nave whose end wall is a rose window of coloured glass throwing colour down the beds', /rose window/i),
  'spiral ramp house': F('a glasshouse whose floor is a spiral ramp rising round a central pier to the roof', /spiral ramp/i),
  'stream house': F('a glasshouse a stream runs straight through, entering and leaving under the glass walls', /stream runs|a stream/i),
  'cistern floor': F('a house with a glass floor over a brick cistern, black water and reflections below the beds', /cistern/i),
  'lake island house': F('a glasshouse on an island in a lake, water on every side of the glass', /island in a lake|lake island/i),
  'horseshoe pool house': F('a horseshoe-plan house curving around an open pool, the glass on the inner face', /horseshoe-plan|horseshoe plan|around an open pool/i),
  'fish-scale panes': F('a house roofed in overlapping fish-scale panes, the ribs curving under them', /fish-scale/i),
  'triple domes': F('three domes in a row joined by short glazed links, each dome a different size', /three domes|triple dome/i),
  'observatory turret': F('a glasshouse with a glazed observatory turret on its ridge reached by an iron stair', /observatory/i),
  'saw-tooth roof': F('a north-light house under a saw-tooth roof, the glazed slopes all facing one way', /saw-tooth|north-light/i),
  'glass hangar': F('a glass hangar with sliding end doors standing open, the house tall enough for a balloon', /hangar|sliding end doors/i),
  'peach cases': F('a run of narrow peach cases along a brick wall, each a shallow glass box of its own', /peach case/i),
  'column forest': F('a vast flat glass roof carried on a forest of slender iron columns', /forest of (?:slender )?(?:iron )?columns|flat glass roof/i),
  'twin-turret lantern': F('a glass lantern tower with staircases in two flanking brick turrets', /flanking (?:brick )?turrets|two turrets|lantern tower/i),
  'palm-trunk ribs': F('a house whose iron ribs are cast as palm trunks, the fronds forming the roof brackets', /cast as palm trunks|palm-trunk ribs/i),
  'tram-track house': F('a long house with a narrow tram track running down its floor and a flat truck on it', /tram track|tram-track/i),
  'iron-tree bracing': F('a dome carried on one central iron tree whose cast branches spread to the ribs', /iron tree/i),
  'tower corridor': F('a glass corridor slung between two brick towers, its floor a long iron bridge', /between two (?:brick )?towers/i),
  'marsh stilts': F('a glasshouse on stilts over a marsh, reeds showing through the grating', /marsh/i),
  'turntable floor': F('a round house whose whole floor is a turntable slowly rotating the beds', /turntable/i),
  'well-head house': F('a glasshouse built round an old stone well head with its winding gear', /well head|well-head/i),
  'dry-dock house': F('a glasshouse in the bottom of a dry dock, its glass roof below the quay walls', /dry dock|dry-dock/i),
  'roundhouse': F('a glasshouse in an old railway roundhouse, the turntable pit at its centre', /roundhouse/i),
  'chain ring-bridge': F('a dome with a ring bridge suspended inside on chains from the boss', /ring bridge|suspended .{0,20}on chains/i),
  'stair house': F('a house built as a glass staircase up a slope, each landing a glazed room', /glass staircase|each landing/i),
  'crossing naves stacked': F('a glass nave with a second nave crossing beneath it, seen down through a floor of glass', /second nave crossing|crossing beneath/i),
  'half-sunk aquarium house': F('a house half sunk into a lake so its lower panes look out under water', /under water|below the waterline|half sunk/i),
  'glass bridge house': F('a glasshouse that is a bridge across a river gorge, its floor the span itself', /river gorge|bridge across a river/i),
  'crypt vault house': F('a glasshouse roofing a stone crypt, the vault columns standing in the beds', /crypt/i),
  'galleried atrium': F('a square glass atrium with three tiers of iron balconies ringing it', /atrium/i),
};
const WAYUPS = [
  'a brass spiral stair',
  'a bolted iron stair',
  'a slatted catwalk',
  'a plank gallery on brass brackets',
  'a ladder-stair',
  'a cast-iron stair winding up',
  'a railed inspection walk',
  'a chain-hoist and a ring catwalk',
  'a running board at waist height',
  'stone steps with a brass handrail',
];
const VANTAGES = [
  'from the floor beside the nearest pier, looking up along the ribs',
  'from a gallery at half height, looking down across the beds',
  'from the far end, looking along the house obliquely',
  'from the foot of the stair, looking up into the roof',
  'from beside the walkway, looking diagonally across',
  'from the sunken bed, looking up and along',
  'from under the nearest arch, obliquely',
  'from the catwalk, looking down through the leaves',
];

function parse(text) {
  let best = null;
  let at = Infinity;
  for (const [k, f] of Object.entries(FORMS)) {
    const m = text.match(f.re);
    if (m && m.index < at) {
      at = m.index;
      best = k;
    }
  }
  const form = best || 'house';
  return { keys: [`form:${form}`], form };
}
const sameGroup = (a, b) => a.form === b.form;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['house']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const taken = (k) => groups.some((g) => (g.assignment ? g.assignment.form : g.form) === k);
  const free = shuffle(Object.keys(FORMS).filter((k) => !FORMS[k].original && !taken(k)));
  const form = byUsage(free, usage, (k) => 'form:' + k)[0];
  if (!form) return null;
  return { keys: [`form:${form}`], form, words: FORMS[form].words, wayUp: spread(WAYUPS), vantage: spread(VANTAGES), tags: [form] };
}
function brief(batch, examples) {
  return `You write entries for one pool of a steampunk-photography bot: SteamBot's brass-glasshouse path, the HOUSE axis: the Victorian iron-and-glass STRUCTURE we stand inside, the hero of the picture. Every entry is ONE house form in 55-70 words (count them; over 75 is cut).

Examples already in the pool (match their voice, structure and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Open with "A"/"An"/"The" and the house form given for the slot, named with the slot's own key words in the first clause; then its enclosing glass named and placed where the FRAME CROPS IT (riveted ribs arcing up and off the top corners, a glazed flank filling one edge, panes crossing the top of the frame); then, after a semicolon, the way up given for the slot; and end with the vantage given for the slot, "seen from … looking …".
- Iron, brass, riveted ribs, slim glazing ribs, beaded wet panes, brick, grating, duckboards: the structure only. A plant may be named in passing as the originals do (a palm nave, vine rods), never as the subject; the specimen and the planting are other axes.
- Nobody in the frame. No readable lettering or signs. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. form: "${a.words}"; way up: ${a.wayUp}; vantage: seen ${a.vantage}`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An|The|Two|Three) .{280,}$/;
const BANS = [
  ['people', /\b(figure|figures|gardener|keeper|man|woman|visitor|visitors|people|child|children)\b/i],
  ['text', /\b(sign|signs|lettering|letters|logo|banner|painted words|writing|label|labels)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.form !== a.form) p.push(`form ${parsed.form}≠${a.form}`);
  const words = cand.split(/\s+/).length;
  if (words < 48 || words > 82) p.push(`${words} words`);
  if (!/off (?:the|both) top|off the (?:top[- ]?(?:left|right)|left|right)|out of the top|filling the|fills the|crossing the (?:whole |entire )?top|cropped|running off|runs? off|running out past|off the (?:upper|lower)/i.test(cand)) p.push('no frame-crop clause');
  if (!/stair|catwalk|gallery|ladder|walk\b|steps?\b|step-up|platform|lift|gantry|balcony|ramp|bridge|handrail|running board|walkway/i.test(cand)) p.push('no way up');
  if (!/\bseen (?:from|obliquely|at|three-quarters|half-height|low|high)/i.test(cand)) p.push('no vantage');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const o = {};
  parsed.forEach((p) => (o[p.form] = (o[p.form] || 0) + 1));
  return { form: o };
}

module.exports = {
  name: 'steambot/brass_glasshouse/house',
  poolFile,
  basis: 'house = the structural FORM; same when the form matches; greedy, pool order (the way up and the vantage are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [300, 560],
  FORMS,
};
