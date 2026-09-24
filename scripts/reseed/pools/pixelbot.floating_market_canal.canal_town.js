/* global __dirname */
/**
 * pixelbot / floating-market-canal / canal_town (Track B: GROW from 25 to 100+) — THE HERO of the
 * path: the town's defining BUILT MASS on the far bank. Every entry: "THE <MASS> AND THE <ONE
 * THING>: <the mass in a band across the top of the picture>, <THE CROSSWISE LAW: the canal
 * crossing the frame left to right, its open water filling the near half, both ends running out of
 * frame>, <the one thing>, the wall faces between the stalls <dressing>" — 85-110 words, pixel
 * register (flat jade bands, chunky stepped pixel spray). The path's own laws: no sign, board,
 * banner, poster, flag or painted symbol anywhere (a market is a text magnet); a boat's identity is
 * its CARGO; no figures (other axes carry them).
 *
 * Same idea = the built MASS + the ONE THING (the originals are 8 masses × 24 things). The 25
 * originals are kept byte-identical; each new entry takes an unused (mass, thing) pair, masses spread
 * evenly, with a shutter palette and a wall-face dressing as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/pixelbot/seeds/pixelbot_floating_market_canal_canal_town.json');

const M = (title, body, re) => ({ title, body, re });
const MASSES = {
  'stacked terrace': M('THE STACKED TERRACE', 'a wall of four-storey timber-and-plaster houses standing straight out of the green water shoulder to shoulder in a band across the top of the picture, balconies leaning out over the canal at uneven angles, shutters in <shutters>', /STACKED TERRACE/),
  'stilt-house arcade': M('THE STILT-HOUSE ARCADE', 'a long arcade of tall-stilted houses crossing the picture in a band along the top, the water running in flat jade bands beneath them and threading under each timber leg, a walkway zigzagging between the stilt posts at different heights', /STILT-HOUSE ARCADE/),
  'tiled tower': M('THE TILED TOWER', 'a tall tower of blocky glazed tiles rising out of the far bank with a great wooden waterwheel turning at its foot, its splash broken into chunky stepped pixel spray, the town banked in a crowded strip along the top of the picture on both sides of the tower', /TILED TOWER/),
  'stacked bridges': M('THE STACKED BRIDGES', 'two or three bridges at different heights crossing to one side of the picture, one low and broad and one high and narrow, the crowded far bank running in a band behind them across the top', /STACKED BRIDGES/),
  'stepped water-gate': M('THE STEPPED WATER-GATE', 'a broad flight of worn stone steps going down into the canal under a painted gateway, the town crowding above and away in a band on both sides', /STEPPED WATER-GATE/),
  'lantern terrace': M('THE LANTERN TERRACE', 'a long terrace of lit upper rooms running in a warm glowing band across the top of the picture, lanterns strung between balconies at uneven spacing, three balconies wider than the others and jutting at different angles', /LANTERN TERRACE/),
  'covered market arcade': M('THE COVERED MARKET ARCADE', 'a long open-sided timber hall built out over the canal on thick piles, its roof low and wide with a patched cloth stretched along the open side, the town stacked in a crowded band behind it across the top of the picture', /COVERED MARKET ARCADE/),
  'wide basin': M('THE WIDE BASIN', 'the canal opening into a wide basin with the town wrapped round the far side in a tight band of uneven rooflines stepping up and down across the top of the picture', /WIDE BASIN/),
  // ── new masses ──
  'warehouse row': M('THE WAREHOUSE ROW', 'a row of tall brick warehouses standing straight out of the water in a band across the top of the picture, each with a timber hoist beam jutting from its gable and big loading doors at three heights, shutters in <shutters>', /WAREHOUSE ROW/),
  'temple steps': M('THE TEMPLE STEPS', 'a wide temple with a tiered roof of curling eaves standing on the far bank in a band across the top of the picture, its stone steps running straight down into the water, the town crowding either side of it', /TEMPLE STEPS/),
  'clock-free bell tower': M('THE BELL TOWER', 'a square bell tower of pale stone rising from the far bank with an open belfry at its top, the town packed in a band along the top of the picture on both sides of it, its bell visible as a dark shape in the opening', /BELL TOWER/),
  'boathouse row': M('THE BOATHOUSE ROW', 'a row of timber boathouses standing over the water in a band across the top of the picture, each with an arched opening at water level and a boat nosed inside, their roofs stepping unevenly', /BOATHOUSE ROW/),
  'mill wheel house': M('THE MILL WHEEL HOUSE', 'a big timber mill house on the far bank in a band across the top of the picture with two waterwheels turning side by side under it, their splash in chunky stepped pixel spray, the town stacked either side', /MILL WHEEL HOUSE/),
  'balcony cliff': M('THE BALCONY CLIFF', 'a cliff of houses six storeys tall rising straight from the water in a band across the top of the picture, every floor a balcony wider than the one below so the whole face leans out over the canal, shutters in <shutters>', /BALCONY CLIFF/),
  'floating gardens': M('THE FLOATING GARDENS', 'a far bank of houses on the top band of the picture fronted by rafts of floating gardens moored along the water\'s edge, small trees and vegetable rows growing on the rafts', /FLOATING GARDENS/),
  'sea-wall town': M('THE SEA-WALL TOWN', 'a long stone sea-wall with the town built along its top in a band across the picture, arched openings through the wall at water level where boats pass in and out', /SEA-WALL TOWN/),
  'pagoda quay': M('THE PAGODA QUAY', 'a stone quay running along the far bank in a band across the top of the picture with a slim three-tiered pagoda rising off-centre behind it, the town stacked either side', /PAGODA QUAY/),
  'timber lock': M('THE TIMBER LOCK', 'a great timber lock gate standing in the canal off to one side with its balance beams out, the far bank a band of lock-keeper houses and stacked town across the top of the picture', /TIMBER LOCK/),
  'lantern bridge house': M('THE LANTERN BRIDGE HOUSE', 'a single broad bridge crossing to one side of the picture with a whole row of lit timber houses built along its top, the crowded far bank running in a band behind it across the top', /LANTERN BRIDGE HOUSE/),
  'crane quay': M('THE CRANE QUAY', 'a stone quay along the far bank in a band across the top of the picture with three timber treadwheel cranes of different heights leaning out over the water, the town stacked behind them', /CRANE QUAY/),
  'terrace of stairs': M('THE TERRACE OF STAIRS', 'a far bank climbing in a band across the top of the picture where every house is reached by its own outside stair going up from the water, the stairs zigzagging in chunky pixel edges', /TERRACE OF STAIRS/),
  'twin towers gate': M('THE TWIN TOWERS GATE', 'two round towers of pale stone standing in the water off to one side with a water gate between them, the town crowding in a band across the top of the picture behind', /TWIN TOWERS GATE/),
};
const G = (title, body, re) => ({ title, body, re });
const THINGS = {
  'pulley basket': G('THE PULLEY BASKET', 'one rope-and-pulley basket hanging from an upper window down to the water level below', /PULLEY BASKET|ROPE BASKET/),
  'hoisted boat': G('THE HOISTED BOAT', 'one small boat hoisted up under the broadest eaves still dripping in chunky pixel drops', /HOISTED BOAT/),
  'its wheel': G('ITS WHEEL', 'the wet paddles of the wheel catching pixel-stepped light', /ITS WHEEL/),
  'tea-house': G('THE TEA-HOUSE', 'a tiny lit tea-house built onto the middle of the highest bridge', /TEA-HOUSE/),
  'moon post': G('THE MOON POST', 'one mooring post carved into a round smiling moon standing at the bottom step half-submerged in flat green water', /MOON POST/),
  'long-pole light': G('THE LONG-POLE LIGHT', 'one lantern on a very long pole leaning out far over the water below', /LONG-POLE LIGHT/),
  'gutter trickle': G('THE GUTTER TRICKLE', "a gutter at the roof's edge pouring a bright trickle down into the water in a clean pixel line", /GUTTER TRICKLE/),
  'island of boats': G('THE ISLAND OF BOATS', 'a loose cluster of three moored boats of completely different silhouettes sitting off to one side in the middle water, the smallest turned sideways across the others', /ISLAND OF BOATS/),
  'tree window': G('THE TREE WINDOW', 'one upper window on the tallest house with a whole small tree growing straight out of it', /TREE WINDOW/),
  'bell arch': G('THE BELL ARCH', 'one low arch between two posts with a brass bell hung inside it on a looped cord', /BELL ARCH/),
  'hanging fish lantern': G('THE HANGING FISH LANTERN', 'one large fish-shaped paper lantern hung under the middle arch glowing amber', /HANGING FISH LANTERN/),
  'vanishing steps': G('THE VANISHING STEPS', 'the steps continuing below the waterline and fading into flat green-blue pixel bands until they disappear', /VANISHING STEPS/),
  'chimney hat': G('THE CHIMNEY HAT', 'one chimney among the seven on the roofline wearing a tiny tiled hat set slightly crooked', /CHIMNEY HAT/),
  'water-level door': G('THE WATER-LEVEL DOOR', 'one door at the base of the tallest house opening straight onto the hull of a moored boat', /WATER-LEVEL DOOR/),
  'dyed-rope boat': G('THE DYED-ROPE BOAT', 'one wide boat directly below carrying coils of dyed rope in seven colours heaped until the hull rides low', /DYED-ROPE BOAT/),
  'steamer baskets': G('THE STEAMER BASKETS', 'one wide boat stacked with bamboo steamer baskets in a wall taller than its mast', /STEAMER BASKETS/),
  'flower boat': G('THE FLOWER BOAT', 'one boat so loaded with flowers that the blooms double its outline and spill over the side', /FLOWER BOAT/),
  melons: G('THE MELONS', 'one wide low boat heaped with melons until the hull rides so low the gunwale nearly meets the water', /THE MELONS/),
  'birdcage mast': G('THE BIRDCAGE MAST', 'one narrow boat with a mast strung from top to bottom with hanging birdcages', /BIRDCAGE MAST/),
  'glazed-pot boat': G('THE GLAZED-POT BOAT', "one boat carrying glazed pots nested in straw stacked in a precarious tower twice the boat's own height", /GLAZED-POT BOAT/),
  'chilli roof': G('THE CHILLI ROOF', 'one house whose entire upper balcony is draped in a dense roof of drying red chillies', /CHILLI ROOF/),
  'lacquered bowls': G('THE LACQUERED BOWLS', 'one square-ended boat carrying lacquered bowls stacked in three towers of mismatched heights', /LACQUERED BOWLS/),
  'glass-float string': G('THE GLASS-FLOAT STRING', 'a string of glass floats looped from a beam down to a mooring post making a shallow arc over the water', /GLASS-FLOAT STRING/),
  // ── new things: made things and cargo, never a sign or a symbol ──
  'kite line': G('THE KITE LINE', 'one red kite flying from the highest balcony on a long line that dips over the water', /KITE LINE/),
  'duck raft': G('THE DUCK RAFT', 'a small timber raft moored under the houses crowded with white ducks, one standing on the mooring post', /DUCK RAFT/),
  'lantern boat': G('THE LANTERN BOAT', 'one narrow boat carrying nothing but paper lanterns hung from bamboo hoops in a glowing dome', /LANTERN BOAT/),
  'fish-drying rack': G('THE FISH-DRYING RACK', 'a bamboo rack of split fish drying on the nearest balcony, silver in the light', /FISH-DRYING RACK/),
  'umbrella boat': G('THE UMBRELLA BOAT', 'one boat roofed entirely in open paper umbrellas of six colours nested like scales', /UMBRELLA BOAT/),
  'gourd wall': G('THE GOURD WALL', 'one house face hung with hundreds of dried gourds on strings from eaves to waterline', /GOURD WALL/),
  'pumpkin barge': G('THE PUMPKIN BARGE', 'one flat barge heaped with orange pumpkins riding so low the water laps its deck', /PUMPKIN BARGE/),
  'drying nets': G('THE DRYING NETS', 'fishing nets spread to dry from the highest balcony down to the water in wide sagging diamonds', /DRYING NETS/),
  'water-wheel pump': G('THE WATER-WHEEL PUMP', 'a small water-wheel on a bracket lifting water in bamboo cups to a trough on the balcony above', /WATER-WHEEL PUMP/),
  'clay-jar boat': G('THE CLAY-JAR BOAT', 'one boat carrying great clay jars taller than the boat is wide, roped in a row down its middle', /CLAY-JAR BOAT/),
  'bread boat': G('THE BREAD BOAT', 'one boat with a stone oven built on its deck breathing smoke and a rack of round loaves on top', /BREAD BOAT/),
  'rope bridge': G('THE ROPE BRIDGE', 'a swaying rope bridge strung from one balcony across to another over the water', /ROPE BRIDGE/),
  'cat ladder': G('THE CAT LADDER', 'a little timber ladder running from the water up a house face to a window with a bowl on its sill', /CAT LADDER/),
  'wind vane fish': G('THE WIND VANE FISH', 'a copper fish turning on a pole above the tallest roof', /WIND VANE FISH/),
  'bamboo pipe': G('THE BAMBOO PIPE', 'a long bamboo pipe carrying a bright thread of water from an upper window across the canal to a boat below', /BAMBOO PIPE/),
  'candle steps': G('THE CANDLE STEPS', 'a flight of steps down to the water with a lit candle in a glass on every third step', /CANDLE STEPS/),
  'hanging garden': G('THE HANGING GARDEN', 'one balcony so overgrown with vines and pots that its rail has vanished under leaves and trailing beans', /HANGING GARDEN/),
  'goat on the roof': G('THE GOAT ON THE ROOF', 'one small goat standing on the lowest roof eating a vine that has climbed there', /GOAT ON THE ROOF/),
  'coconut boat': G('THE COCONUT BOAT', 'one boat heaped with green coconuts in a dome higher than its poling stern', /COCONUT BOAT/),
  'rice-sack barge': G('THE RICE-SACK BARGE', 'one barge stacked with rice sacks in a stepped pyramid, one sack split and spilling white', /RICE-SACK BARGE/),
  'lotus pool': G('THE LOTUS POOL', 'a corner of the water walled off by posts and packed with lotus leaves and pink blooms', /LOTUS POOL/),
  'copper kettles': G('THE COPPER KETTLES', 'one boat hung all over with copper kettles that catch the light in stepped pixel glints', /COPPER KETTLES/),
  'monkey on the beam': G('THE MONKEY ON THE BEAM', 'a small monkey sitting on the hoist beam of the tallest house with a stolen fruit', /MONKEY ON THE BEAM/),
  'laundry lines': G('THE LAUNDRY LINES', 'laundry strung between the upper windows in three sagging lines, small bright shapes lifting in the wind', /LAUNDRY LINES/),
  'bird perch pole': G('THE BIRD PERCH POLE', 'a tall bamboo pole standing in the water crowded with small white birds along its whole length', /BIRD PERCH POLE/),
  'floating stove': G('THE FLOATING STOVE', 'one boat with a clay stove amidships sending up a thin line of smoke and a wok gleaming beside it', /FLOATING STOVE/),
  'painted shutters': G('THE PAINTED SHUTTERS', 'one house whose every shutter is painted a different flat colour, a dozen colours up its face', /PAINTED SHUTTERS/),
  'stone turtle': G('THE STONE TURTLE', 'a carved stone turtle as big as a boat sitting half-submerged at the foot of the steps with moss on its shell', /STONE TURTLE/),
  'reed boat': G('THE REED BOAT', 'one boat built entirely of bundled reeds riding high and pale among the timber ones', /REED BOAT/),
  'fruit pyramid': G('THE FRUIT PYRAMID', 'one boat carrying oranges stacked in a perfect pyramid taller than the boatman\'s pole', /FRUIT PYRAMID/),
  'shell curtain': G('THE SHELL CURTAIN', 'a curtain of hanging shells across one doorway at water level, rattling in the wind', /SHELL CURTAIN/),
  'tortoise boat': G('THE TORTOISE BOAT', 'one boat built with a domed cover like a tortoise shell, its stern open', /TORTOISE BOAT/),
  'tea-drying mats': G('THE TEA-DRYING MATS', 'flat mats of tea leaves drying on every roof of the nearest houses in dark green rectangles', /TEA-DRYING MATS/),
  'heron post': G('THE HERON POST', 'a single heron standing on the tallest mooring post, tiny in the frame', /HERON POST/),
  'bucket chain': G('THE BUCKET CHAIN', 'a chain of buckets on a rope running from the water up to the top balcony, one bucket tipping', /BUCKET CHAIN/),
  'floating bridge': G('THE FLOATING BRIDGE', 'a bridge of lashed boats crossing to one side of the picture with planks laid across their decks', /FLOATING BRIDGE/),
  'spice boat': G('THE SPICE BOAT', 'one boat carrying open sacks of spice in mounds of red, ochre and gold heaped higher than the gunwale', /SPICE BOAT/),
  'silk boat': G('THE SILK BOAT', 'one boat with bolts of coloured silk standing on end like a small forest', /SILK BOAT/),
};
const SHUTTERS = ['coral and saffron and deep jade', 'burnt orange and pale blue and deep plum', 'deep violet and bright tangerine and pale green', 'warm amber and dusty rose and bright teal', 'sea-green and ochre and rust', 'indigo and cream and brick red', 'lime and mustard and deep teal', 'rose and slate and gold'];
const WALLFACES = ['carrying stacked crates and a coil of rope hung on a peg', 'thick with a climbing vine gone right up to the eaves', 'lined with potted plants on brackets at uneven heights', 'carrying a row of shuttered windows with their shutters thrown back', 'hung with drying bundles and one small brazier burning low', 'stacked with baskets to shoulder height and a leaning broom', 'bare warm stone with one wooden bench and a heap of nets beside it', 'hung with big glazed water jars on iron hooks', 'carrying a rough timber stair going up and a cat-sized hole cut low in one', 'draped with hanks of dyed yarn in five colours'];

const TITLE_RE = /^THE ([A-Z' -]+?)(?: AT DUSK)? AND (THE [A-Z' -]+|ITS WHEEL[A-Z' -]*): /;
function parse(text) {
  const m = text.match(TITLE_RE);
  let mass = 'town';
  let thing = 'thing';
  if (m) {
    const a = 'THE ' + m[1];
    const b = m[2];
    for (const [k, v] of Object.entries(MASSES)) if (v.re.test(a)) { mass = k; break; }
    for (const [k, v] of Object.entries(THINGS)) if (v.re.test(b)) { thing = k; break; }
  }
  return { keys: [`mass:${mass}`, `thing:${thing}`], mass, thing };
}
const sameGroup = (a, b) => a.mass === b.mass && a.thing === b.thing;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['canal_town']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const get = (g) => (g.assignment ? g.assignment : g);
  const used = (m, t) => groups.some((g) => get(g).mass === m && get(g).thing === t);
  const thingUsed = (t) => groups.filter((g) => get(g).thing === t).length;
  const masses = byUsage(shuffle(Object.keys(MASSES)), usage, (k) => 'mass:' + k);
  for (const mass of masses) {
    const things = shuffle(Object.keys(THINGS)).filter((t) => t !== 'its wheel' && t !== 'vanishing steps' && thingUsed(t) < 2 && !used(mass, t)).sort((a, b) => thingUsed(a) - thingUsed(b));
    if (!things.length) continue;
    const thing = things[0];
    return {
      keys: [`mass:${mass}`, `thing:${thing}`],
      mass,
      thing,
      title: `${MASSES[mass].title} AND ${THINGS[thing].title}`,
      massWords: MASSES[mass].body.replace('<shutters>', spread(SHUTTERS)),
      thingWords: THINGS[thing].body,
      wallFace: spread(WALLFACES),
      tags: [mass, thing],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a pixel-art bot: PixelBot's floating-market-canal path, the CANAL TOWN axis: the town's defining built mass on the far bank, the hero of the picture. Every entry is 85-105 words in exactly the examples' shape. COUNT THEM: anything over 112 words is cut and lost, so the mass gets two or three clauses, the crosswise law one, the thing one, the wall faces one.

Examples already in the pool (match their voice, structure, pixel-register words and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Start with the slot's TITLE verbatim in capitals followed by a colon, then one long comma-chained sentence: the built mass in the slot's own words as a BAND across the top of the picture; then THE CROSSWISE LAW in the examples' words (the canal crossing the whole frame left to right, its open water filling the near half or two thirds, running out of frame on both sides); then the slot's one thing; and end with "the wall faces between the stalls <the slot's dressing>".
- Pixel-register words in every entry: flat jade bands, chunky stepped pixel spray or edges, flat stepped bands.
- Never a person, a figure, a boatman, a crowd (other axes carry them; a bird, a duck, a goat, a monkey or a heron is fine, tiny). Never a sign, board, banner, poster, flag, painted symbol, lettering or a painted panel on a hull; a boat is known by its CARGO. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. TITLE: "${a.title}"; built mass: "${a.massWords}"; the one thing: "${a.thingWords}"; wall faces between the stalls: "${a.wallFace}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^THE [A-Z' -]+ AND (?:THE [A-Z' -]+|ITS WHEEL[A-Z' -]*): .{420,}$/;
const BANS = [
  ['text', /\b(sign|signs|signboard|board|boards|banner|banners|poster|posters|flag|flags|symbol|symbols|lettering|letters|words|writing|painted panel|emblem|crest)\b/i],
  ['people', /\b(figure|figures|boatman|boatmen|vendor|vendors|crowd|crowds|man|woman|boy|girl|child|children|people|sprite)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.mass !== a.mass) p.push(`mass ${parsed.mass}≠${a.mass}`);
  if (parsed.thing !== a.thing) p.push(`thing ${parsed.thing}≠${a.thing}`);
  const words = cand.split(/\s+/).length;
  if (words < 80 || words > 122) p.push(`${words} words`);
  // THE CROSSWISE LAW in any of the originals' wordings
  if (!/left to right|left and right|left edge to the right edge|across the (?:whole |full )?(?:frame|picture)|crossing the (?:whole |full |main |open |entire )?(?:frame|picture)|reaching both edges|both edges|out of frame/i.test(cand)) p.push('no crosswise canal');
  if (!/wall faces between the stalls/i.test(cand)) p.push('no wall-faces clause');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { mass: t('mass'), thing: t('thing') };
}

module.exports = {
  name: 'pixelbot/floating_market_canal/canal_town',
  poolFile,
  basis: 'canal town = the built MASS + the one thing; same when both match; greedy, pool order (shutters and the wall-face dressing are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 4,
  lenBand: [480, 800],
  MASSES,
  THINGS,
};
