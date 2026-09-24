/* global __dirname */
/**
 * pixelbot / castle-town-gate / gatehouse (Track B: GROW from 25 to 100+) — THE HERO of the path: the
 * gatehouse MASS standing off-centre in a wall that crosses the whole picture. Every entry:
 * "THE <TYPE> AND THE <MADE THING>: <the mass, its stone, its arch, turned three-quarters>, <the wall
 * crossing the picture and running out of frame both ways>, <the ground a wide band across the
 * bottom>, <one wall dressing>, and <the one made thing, the charm>" — 100-130 words, pixel-register
 * words (flat dithered bands, chunky stepped pixel courses). The path's own laws: no jargon (curtain,
 * keep, bailey, ward, barbican, postern, merlon, machicolation …), no text prior (banner, crest,
 * shield, sign, board, plaque, scroll, clock face), a carved animal only as a HEAD jutting from the
 * wall's own stone, nothing grim, no figures (the travellers and the moment are other axes).
 *
 * Same idea = the gatehouse TYPE + the MADE THING (the originals are 8 types × 22 charms, each pair
 * once). The 25 originals are kept byte-identical; each new entry takes an unused (type, charm)
 * pair, types spread evenly, with a stone colour, a ground and a wall dressing as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/pixelbot/seeds/pixelbot_castle_town_gate_gatehouse.json');

// type key → title words (CAPS in the entry title), body phrase, title regex
const T = (title, body, re) => ({ title, body, re });
const TYPES = {
  'square gatehouse': T('THE SQUARE GATEHOUSE', 'a great square gatehouse of <stone> in uneven flat-banded courses, each face stepping into shadow through flat dithered bands, the wide arch cut off-centre through its base and the whole mass turned three-quarters to the camera, the long wall running out of frame past both flanks', /SQUARE GATEHOUSE/),
  'drum tower': T('THE DRUM TOWER', 'one fat round drum tower of <stone> in chunky stacked courses with the archway cut through its foot and a steep conical tiled roof on top, a second smaller drum well off to one side and plainly shorter, the wall crossing the whole picture and running out of frame both ways', /DRUM TOWER/),
  'timber gate-house': T('THE TIMBER GATE-HOUSE', 'a tall timber-framed gate-house painted in two colours standing over the arch, its upper floors leaning out above the near ground on carved beam-ends, the stone wall running out of frame from each flank in flat stepped bands', /TIMBER GATE-HOUSE|TIMBER GATEHOUSE/),
  'long low range': T('THE LONG LOW RANGE', 'a long low gate-range of <stone> and dark timber with the arch at one end of it, the range crossing the picture from the left edge to the right edge and running out of frame on both sides, its roofline stepping up and down in uneven jumps', /LONG LOW RANGE/),
  'cliff gate': T('THE CLIFF GATE', 'the archway and its square gatehouse of <stone> built straight into the foot of a great rock face, the wall running along the cliff base and out of frame on both sides, the gatehouse mass turned three-quarters with one flank vanishing into the rock', /CLIFF GATE/),
  'water gate': T('THE WATER GATE', 'a gatehouse of <stone> standing on broad square stone piers set in shallow water, the arch opening straight onto the water, the wall running out of frame on both sides, a stone bridge of uneven arches crossing the water and running out of one edge of the frame', /WATER GATE/),
  'twin-arched mass': T('THE TWIN-ARCHED MASS', 'a wide gatehouse of <stone> with two arches side by side, one open and one long since bricked up in paler stone, the whole mass turned three-quarters and sitting off to one side, the wall crossing from the left edge to the right edge and running out of frame both ways', /TWIN-ARCHED MASS|TWIN-ARCHED/),
  'stepped stone gate': T('THE STEPPED STONE GATE', 'a mass of <stone> stepping back in three uneven stages above the arch, each stage a broad walkway with a low parapet of square stone teeth, the whole mass turned three-quarters and sitting off to one side, the wall crossing the picture and running out of frame both ways', /STEPPED STONE GATE/),
  // ── new types ──
  'twin-tower gate': T('THE TWIN-TOWER GATE', 'a gate flanked by two square towers of <stone> of plainly different heights, the arch between them and the taller tower nearer the camera, the whole mass turned three-quarters, the wall crossing the picture and running out of frame both ways', /TWIN-TOWER GATE/),
  'brick gable gate': T('THE BRICK GABLE GATE', 'a gatehouse of <stone> brick with a tall stepped gable rising over the arch in chunky pixel steps, the gable off-centre, the whole mass turned three-quarters, the wall of the same brick crossing the picture and running out of frame both ways', /BRICK GABLE GATE/),
  'bridge-tower gate': T('THE BRIDGE-TOWER GATE', 'a gatehouse of <stone> standing at the town end of a long stone bridge, the bridge running in from one edge of the frame across a wide river to the arch, the tower turned three-quarters, the wall running out of frame past both flanks along the riverbank', /BRIDGE-TOWER GATE/),
  'rock tunnel gate': T('THE ROCK TUNNEL GATE', 'the arch bored as a long tunnel straight through a wall of <stone> so thick its far mouth shows as a small bright square, the near mouth cut off-centre and framed in dressed stone, the wall crossing the whole picture and running out of frame both ways', /ROCK TUNNEL GATE/),
  'stair gate': T('THE STAIR GATE', 'a gatehouse of <stone> standing at the head of a broad flight of worn stone steps that climbs from the bottom of the frame to the arch, the whole mass turned three-quarters, the wall crossing the picture on the level of the top step and running out of frame both ways', /STAIR GATE/),
  'roofed gate': T('THE ROOFED GATE', 'a gatehouse of <stone> under one enormous tiled roof with eaves spreading far past the walls on both sides like a hat pulled low, the arch cut off-centre beneath it, the whole mass turned three-quarters, the wall crossing the picture and running out of frame both ways', /ROOFED GATE/),
  'lantern tower gate': T('THE LANTERN TOWER GATE', 'a slim tower of <stone> rising over the arch to a glazed lantern room at its top glowing warm, the tower turned three-quarters and set off-centre, the wall crossing the picture and running out of frame both ways', /LANTERN TOWER GATE/),
  'market arch gate': T('THE MARKET ARCH GATE', 'a broad gatehouse of <stone> with timber market stalls built lean-to against its outer face on both sides of the arch, striped awnings in chunky pixel bands, the whole mass turned three-quarters, the wall crossing the picture and running out of frame both ways', /MARKET ARCH GATE/),
  'terrace gate': T('THE TERRACE GATE', 'a gatehouse of <stone> set into a wall that carries a whole hanging garden along its top, small trees and vines spilling over the parapet, the arch cut off-centre, the whole mass turned three-quarters, the wall crossing the picture and running out of frame both ways', /TERRACE GATE/),
  'covered bridge gate': T('THE COVERED BRIDGE GATE', 'a gatehouse of <stone> reached by a covered timber bridge with a tiled roof crossing a dry ditch from the near ground to the arch, the bridge angled to the camera, the whole mass turned three-quarters, the wall crossing the picture and running out of frame both ways', /COVERED BRIDGE GATE/),
  'chapel gate': T('THE CHAPEL GATE', 'a gatehouse of <stone> with a small chapel built on top of it, a round window and a tiny bell-cote rising over the arch, the whole mass turned three-quarters and set off-centre, the wall crossing the picture and running out of frame both ways', /CHAPEL GATE/),
  'mill gate': T('THE MILL GATE', 'a gatehouse of <stone> with a great timber water-wheel turning in a channel that runs under the wall beside the arch, the wheel dripping, the whole mass turned three-quarters, the wall crossing the picture and running out of frame both ways', /MILL GATE/),
};
const C = (title, body, re) => ({ title, body, re });
const CHARMS = {
  'copper bell': C('THE COPPER BELL', 'one great bronze bell hung in the arch on a heavy timber yoke with a green rope trailing down from its clapper', /COPPER BELL|BRONZE BELL/),
  'great wheel': C('THE GREAT WHEEL', 'the enormous timber wheel and rope that lifts the heavy iron lattice gate mounted out in plain view on the stone face above the arch', /GREAT WHEEL|THE WHEEL$/),
  'plum tree': C('THE PLUM TREE', 'a crooked tree grown straight out of a crack forty feet up the stone beside the gate, its roots splayed flat across the stone in dark stepped lines', /PLUM TREE|TILTED TREE|CROW TREE/),
  'stone fish': C('THE STONE FISH', 'a carved stone fish jutting from the wall above the arch with its mouth open wide and a bright thread of rainwater spitting from it into a stone trough below', /STONE FISH/),
  beehive: C('THE BEEHIVE', 'a straw beehive of golden colour tucked deep into a niche cut into the stone to one side of the arch with a faint smear of old honey darkening the stone below it', /BEEHIVE/),
  'rope hoist': C('THE ROPE HOIST', 'a rope-and-basket hoist running from an upper window of the gatehouse down to the near ground with a pile of small round cheeses sitting in the basket', /ROPE HOIST|THE HOIST$/),
  'boot-scraper': C('THE BOOT-SCRAPER', 'a boot-scraper set into the stone at the base of the arch worn into a deep groove by what looks like a century of boots', /BOOT-SCRAPER/),
  dovecote: C('THE DOVECOTE', 'a whole dovecote of white-painted timber built onto the side of the gatehouse with thirty small round holes in its face and a wooden perch rail below them', /DOVECOTE/),
  'tilted chimney': C('THE TILTED CHIMNEY', 'a chimney rising from one side of the roof with its own tiny tiled hat sitting slightly crooked on its top', /TILTED CHIMNEY/),
  'stone owl': C('THE STONE OWL', "a carved stone owl's head the size of a barrel jutting straight out of the wall above the arch, lichen in pale patches across its brow", /STONE OWL/),
  kettle: C('THE KETTLE', 'a small brazier burning amber in a niche beside the arch with a fat black kettle sitting beside it on the stone', /THE KETTLE/),
  'water spout': C('THE WATER SPOUT', 'a spout high on the stone face pouring a bright thin thread of rainwater down the wall into a wide stone trough at ground level', /WATER SPOUT|STONE TROUGH/),
  'hanging pans': C('THE HANGING PANS', 'a row of copper pans hung on iron hooks beside the small low door cut into the big timber door of the arch with warm light spilling from that small door', /HANGING PANS/),
  'stone bear': C('THE STONE BEAR', "a carved stone bear's head as broad as a cart wheel jutting straight out of the wall above the arch, its muzzle worn smooth and pale from years of luck-rubbing", /STONE BEAR/),
  'ivy lion': C('THE IVY LION', "a fat carved stone lion's head jutting right out above the arch with real moss packed thick in its open mouth", /IVY LION|STONE LION/),
  shrine: C('THE SHRINE', 'a small stone shrine cut into the wall to one side of the arch with a shallow bowl of bright flowers set into it', /THE SHRINE|SHRINE FLOWERS/),
  'wooden stair': C('THE WOODEN STAIR', 'a wooden stair of uneven zigzagging flights built against the outside of the gatehouse in chunky stepped pixel edges running from the near ground to the walkway at the top', /WOODEN STAIR/),
  lanterns: C('THE LANTERNS', 'a row of seven round paper lanterns strung along under the arch with three of them still dark and one swinging slightly out of line', /THE LANTERNS|PAPER LANTERNS/),
  // ── new made things (plain nouns; animals only as HEADS in the wall's own stone, above the arch) ──
  'well windlass': C('THE WELL WINDLASS', 'a stone well cut into the foot of the wall beside the arch with a timber windlass over it, a bucket on the rope dripping into the dark', /WELL WINDLASS/),
  'bread oven': C('THE BREAD OVEN', "a bread oven's round mouth set into the wall beside the arch glowing orange from inside, a wooden peel leaning against the stone", /BREAD OVEN/),
  'rain barrel': C('THE RAIN BARREL', 'a fat rain barrel bound in iron under a spout at the corner of the gatehouse, overflowing in a bright thread down its side', /RAIN BARREL/),
  'drying fish': C('THE DRYING FISH', 'a long line of split fish hung to dry on a rope strung along the wall beside the arch, silver and stiff in the light', /DRYING FISH/),
  'red peppers': C('THE RED PEPPERS', 'strings of red peppers hung to dry in long ropes from the upper windows of the gatehouse down its face', /RED PEPPERS/),
  'clay jars': C('THE CLAY JARS', 'a row of great clay jars taller than a cart wheel standing along the foot of the wall beside the arch, their lids weighted with stones', /CLAY JARS/),
  'iron lamp': C('THE IRON LAMP', 'a big cast-iron lamp on a curled bracket beside the arch still burning in daylight with its glass smoked black on one side', /IRON LAMP/),
  'stone dog': C('THE STONE DOG', "a carved stone dog's head jutting from the wall above the arch with an iron ring held in its teeth", /STONE DOG/),
  'stone goat': C('THE STONE GOAT', "a carved stone goat's head with curling horns jutting straight out of the wall above the arch, a bird's nest wedged behind one horn", /STONE GOAT/),
  'stone horse': C('THE STONE HORSE', "a carved stone horse's head jutting from the wall above the arch with its mane worked in flat stepped lines", /STONE HORSE/),
  'stone hare': C('THE STONE HARE', "a carved stone hare's head with long ears laid back jutting out of the wall above the arch", /STONE HARE/),
  'stone ram': C('THE STONE RAM', "a carved stone ram's head with thick coiled horns jutting from the wall above the arch, moss in the coils", /STONE RAM/),
  'stone boar': C('THE STONE BOAR', "a carved stone boar's head with tusks jutting from the wall above the arch, worn pale at the snout", /STONE BOAR/),
  'barrel stack': C('THE BARREL STACK', 'a stack of barrels three high under the near side of the arch with one rolled aside and standing on its end as a table', /BARREL STACK/),
  'millstone': C('THE MILLSTONE', 'an old millstone bigger than a cart wheel leaning against the wall beside the arch with moss grown thick in its grooves', /MILLSTONE/),
  'hanging birdcage': C('THE HANGING BIRDCAGE', 'a domed wicker birdcage hung from a bracket beside an upper window of the gatehouse, empty, its little door open', /HANGING BIRDCAGE/),
  'grapevine': C('THE GRAPEVINE', 'a grapevine trained over the whole arch on wires with heavy dark bunches hanging down into the opening', /GRAPEVINE/),
  'rose bush': C('THE ROSE BUSH', 'a climbing rose gone up one side of the arch to the roofline in a lopsided mass of red blooms', /ROSE BUSH/),
  'blue shutters': C('THE BLUE SHUTTERS', 'a pair of tall blue-painted shutters on the gatehouse window above the arch, one hooked open and one banging loose', /BLUE SHUTTERS/),
  'great key': C('THE GREAT KEY', 'an iron key as long as an arm hung on a peg beside the arch under a little tiled hood of its own', /GREAT KEY/),
  'pumpkin pile': C('THE PUMPKIN PILE', 'a pile of orange pumpkins heaped against the wall beside the arch with one split open and glowing pale inside', /PUMPKIN PILE/),
  'wooden crane': C('THE WOODEN CRANE', 'a timber crane arm swung out from the top of the gatehouse with a net of sacks hanging from its hook halfway down', /WOODEN CRANE/),
  'mounting block': C('THE MOUNTING BLOCK', 'a stone mounting block of three worn steps standing beside the arch with a coil of rope left on its top', /MOUNTING BLOCK/),
  'bird-box': C('THE BIRD-BOX', 'a little timber bird-box on a bracket high on the gatehouse face with a round hole and a tiny sloping roof of its own', /BIRD-BOX/),
  'wash line': C('THE WASH LINE', 'a wash line strung from an upper window of the gatehouse to a pole with small bright clothes lifting in the wind', /WASH LINE/),
  'drinking fountain': C('THE DRINKING FOUNTAIN', 'a stone drinking fountain set into the wall beside the arch with a tin cup on a chain and a wet dark stain below it', /DRINKING FOUNTAIN/),
  'wooden bench': C('THE WOODEN BENCH', 'a long wooden bench worn pale set against the wall beside the arch with a forgotten hat lying on it', /WOODEN BENCH/),
  'log pile': C('THE LOG PILE', 'firewood stacked to shoulder height against the flank of the gatehouse with a striped pot sitting on top', /LOG PILE/),
  'onion strings': C('THE ONION STRINGS', 'hanging bundles of drying herbs and onions on iron hooks beside the arch', /ONION STRINGS/),
  'stone trough': C('THE HORSE TROUGH', 'a long stone horse trough at the foot of the wall beside the arch brimming with dark water and a ring of green weed', /HORSE TROUGH/),
  'tiled hood': C('THE TILED HOOD', 'a little tiled hood on timber brackets sheltering the small low door beside the arch, its ridge crooked', /TILED HOOD/),
  'cart wheel': C('THE CART WHEEL', 'a broken cart wheel as tall as a figure leaning against the wall beside the arch with two spokes gone', /CART WHEEL/),
  'wind chimes': C('THE WIND CHIMES', 'a cluster of copper wind chimes hung from a beam-end above the arch turning slowly in the air', /WIND CHIMES/),
  'net drying': C('THE NET DRYING', 'a fishing net spread to dry on pegs across the whole flank of the gatehouse in a wide sagging diamond pattern', /NET DRYING/),
  'kite in the tree': C('THE KITE IN THE TREE', 'a red paper kite caught in the crooked tree that grows from the wall above the arch, its tail trailing down the stone', /KITE IN THE TREE/),
  'snow lantern': C('THE SNOW LANTERN', 'a small stone lantern beside the arch with snow heaped in a neat cap on its roof and a candle glowing inside', /SNOW LANTERN/),
  'ladder to the hatch': C('THE LADDER TO THE HATCH', 'a long ladder leaning against the gatehouse face up to a small open hatch below the parapet', /LADDER TO THE HATCH/),
  'stone basin': C('THE STONE BASIN', 'a shallow stone basin cut into the wall foot beside the arch catching a drip from above, a ring of moss round it', /STONE BASIN/),
  'painted door': C('THE PAINTED DOOR', 'the two great timber doors of the arch painted a bright flat red with iron studs in chunky pixel rows, one door standing open', /PAINTED DOOR/),
  'flower cart': C('THE FLOWER CART', 'a two-wheeled cart heaped with cut flowers parked against the wall beside the arch, unattended', /FLOWER CART/),
  'sundial-free gnomon': C('THE SHADOW POLE', 'a tall plain pole standing beside the arch throwing a long stepped shadow across the ground band', /SHADOW POLE/),
};
const STONES = ['warm honey-coloured stone', 'pale grey stone', 'deep red sandstone', 'dark charcoal-grey stone', 'warm amber stone', 'pale cream stone', 'dark greenish stone', 'pale buff stone', 'warm dark brown stone', 'pale blue-grey stone', 'rust-red stone', 'pale yellow stone', 'dark red brick', 'golden sandstone'];
const GROUNDS = ['wet cobbles', 'trodden earth and old straw', 'damp sand', 'pale grit and loose stones', 'worn cobblestones', 'pale grass', 'dry golden grit', 'wet gravel', 'damp earth and old grass', 'pale cobblestones', 'short pale grass', 'packed clay'];
const DRESSINGS = ['window boxes crammed with orange and yellow flowers at uneven heights up the stone face', 'ivy climbing one whole flank in a lopsided green sheet', 'three long strips of cloth in scarlet, saffron and jade twisting edge-on in the wind from poles on the top', 'snow heaped on every ledge and icicles hanging in a row of uneven lengths below the parapet', 'nets and baskets on iron hooks along the wall beside the arch', 'a row of five round paper lanterns strung along under the arch with two of them still dark', 'window boxes of deep purple flowers at three uneven heights', 'a lopsided sheet of ivy over the bricked-up half of the wall', 'moss in bright green patches across every ledge', 'a line of small clay pots along the parapet'];

const TITLE_RE = /^THE ([A-Z' -]+) AND THE ([A-Z' -]+): /;
function parse(text) {
  const m = text.match(TITLE_RE);
  let type = 'gate';
  let charm = 'thing';
  if (m) {
    const t = 'THE ' + m[1];
    const c = 'THE ' + m[2];
    for (const [k, v] of Object.entries(TYPES)) if (v.re.test(t)) { type = k; break; }
    for (const [k, v] of Object.entries(CHARMS)) if (v.re.test(c)) { charm = k; break; }
  }
  return { keys: [`type:${type}`, `charm:${charm}`], type, charm };
}
const sameGroup = (a, b) => a.type === b.type && a.charm === b.charm;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['gatehouse']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const used = (t, c) => groups.some((g) => { const a = g.assignment ? g.assignment : g; return a.type === t && a.charm === c; });
  const charmUsed = (c) => groups.filter((g) => (g.assignment ? g.assignment : g).charm === c).length;
  const types = byUsage(shuffle(Object.keys(TYPES)), usage, (k) => 'type:' + k);
  for (const type of types) {
    // a charm at most twice across the pool, least-used first
    const charms = shuffle(Object.keys(CHARMS)).filter((c) => charmUsed(c) < 2 && !used(type, c)).sort((a, b) => charmUsed(a) - charmUsed(b));
    if (!charms.length) continue;
    const charm = charms[0];
    return {
      keys: [`type:${type}`, `charm:${charm}`],
      type,
      charm,
      title: `${TYPES[type].title} AND ${CHARMS[charm].title}`,
      typeWords: TYPES[type].body.replace('<stone>', spread(STONES)),
      charmWords: CHARMS[charm].body,
      ground: spread(GROUNDS),
      dressing: spread(DRESSINGS),
      tags: [type, charm],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a pixel-art bot: PixelBot's castle-town-gate path, the GATEHOUSE axis: the gate's own mass seen from outside as a traveller arrives, the hero of the picture. Every entry is 100-125 words in exactly the examples' shape. COUNT THEM: anything over 130 words is cut and lost, so keep the mass to its two or three defining clauses and give the made thing one clause.

Examples already in the pool (match their voice, structure, pixel-register words and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Start with the slot's TITLE verbatim in capitals followed by a colon, then one long comma-chained sentence: the gatehouse mass in the slot's own type words (its stone, its arch cut off-centre, the whole mass turned three-quarters or set off to one side), the wall crossing the picture and running out of frame both ways, "the ground a wide band of <the slot's ground> crossing the bottom of the frame", the slot's wall dressing, and finally "and" the slot's made thing, described as the examples do.
- Pixel-register words in every entry: flat dithered bands, chunky stepped pixel courses or edges, uneven stacked courses.
- Never a person or a figure (other axes carry them). Never a banner, flag, crest, shield, sign, board, plaque, scroll, clock or any lettering; never the words curtain, keep, bailey, ward, barbican, postern, merlon, machicolation, murder hole. A carved animal is only ever a HEAD jutting from the wall's own stone. Nothing grim: no weapons, no dread. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. TITLE: "${a.title}"; type: "${a.typeWords}"; ground: ${a.ground}; wall dressing: "${a.dressing}"; made thing: "${a.charmWords}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^THE [A-Z' -]+ AND THE [A-Z' -]+: .{500,}$/;
const BANS = [
  ['text', /\b(banner|banners|flag|flags|crest|crests|shield|shields|sign|signs|board|plaque|scroll|clock|lettering|letters|words|writing|heraldic|coat of arms)\b/i],
  ['jargon', /\b(curtain|keep|bailey|ward|barbican|postern|merlon|merlons|machicolation|machicolations|murder hole|embrasure|crenel)\b/i],
  ['people', /\b(figure|figures|guard|guards|man|woman|boy|girl|child|children|people|merchant|soldier|soldiers)\b/i],
  ['grim', /\b(weapon|weapons|spear|spears|sword|swords|blood|skull|skulls|siege|arrow slits?|arrows)\b/i],
  ['whole animal', /\b(statue|statues)\b|carved stone (?!(?:\w+'s )?head)(?:owl|bear|lion|dog|goat|horse|hare|ram|boar|cat|wolf|fox|eagle|dragon)\b(?! head|'s head)/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.type !== a.type) p.push(`type ${parsed.type}≠${a.type}`);
  if (parsed.charm !== a.charm) p.push(`charm ${parsed.charm}≠${a.charm}`);
  const words = cand.split(/\s+/).length;
  if (words < 95 || words > 138) p.push(`${words} words`);
  if (!/running (?:well )?out of (?:the )?frame|out of frame/i.test(cand)) p.push('no out-of-frame wall');
  // the originals state the ground band, the three-quarter turn and the pixel words on most entries, not all
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { type: t('type'), charm: t('charm') };
}

module.exports = {
  name: 'pixelbot/castle_town_gate/gatehouse',
  poolFile,
  basis: 'gatehouse = the gate TYPE + the one made thing (the charm); same when both match; greedy, pool order (stone, ground and dressing are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 4,
  lenBand: [560, 900],
  TYPES,
  CHARMS,
};
