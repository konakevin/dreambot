/* global __dirname */
/**
 * faebot / mushroom-apothecary / room (Track B: GROW from 25 to 100+) — THE HERO of the path: the
 * apothecary ROOM inside a mushroom. Every entry: the room's SHAPE, its shelving (crooked tiers of
 * uneven depth along the curved walls), the counter (turned three-quarters / grown from the floor),
 * ONE odd built feature, the way up to a loft (a rope-ladder, a plank stair, a bracket-fungus stair,
 * a ladder of living stems), the ONE opening (round or oval) and where it sits, and the vantage
 * ("seen from …"). 65-90 words, one sentence. Nobody in the room; no wares named (other axes).
 *
 * Same idea = the room SHAPE + the ODD FEATURE (the originals are 10 shapes × ~20 features). The 25
 * originals are kept byte-identical; each new entry takes an unused (shape, feature) pair, shapes
 * spread evenly, with a way up, an opening and a vantage as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/faebot/seeds/faebot_mushroom_apothecary_room.json');

const S = (body, re) => ({ body, re });
const SHAPES = {
  'cap-chamber': S('a broad low cap-chamber under a domed ceiling of pale pleated gill-flesh that glows faintly from within like a lit lampshade', /cap-chamber/i),
  'stalk-shaft': S('a tall narrow stalk-shaft with a spiral stair of bracket-fungus steps growing straight from the wall', /stalk-shaft/i),
  'bell chamber': S('a bell-shaped chamber pinched toward the top, shelves curving up and around the wall', /bell-shaped chamber/i),
  'split-level': S('a stepped split-level room under a leaning cap, the counter on the lower floor', /split-level/i),
  'bowed room': S('a long bowed room under a leaning cap, shelves wandering in crooked tiers along the concave inner wall', /long bowed room/i),
  'two-level loft': S('a two-level room with a loft gallery cantilevered on one flank, its floor of woven root through which lamplight passes', /two-level room/i),
  'wide bay': S('a wide bay hollowed into the side of the stalk, one wall curving deeply inward', /wide bay hollowed/i),
  'round chamber': S('a round chamber with a deep shelf-alcove cut into one wall', /round chamber/i),
  'low broad room': S('a low broad room with the ceiling dipping close over the counter', /low broad room/i),
  'corner nook': S('a snug corner nook tucked beneath a gill-vault, the vault\'s pleated underside sweeping low on one side', /corner nook/i),
  // ── new shapes ──
  'ring gallery': S('a ring-shaped room running all the way around the central stalk, the stalk\'s pale pillar filling the middle and the shelves following the outer curve out of sight both ways', /ring-shaped room/i),
  'double cap': S('a room under two caps grown into each other, the ceiling dipping to a pleated seam between them and rising again into a second domed chamber beyond', /two caps grown into each other/i),
  'stair-well room': S('a round stair-well room with a stair of bracket-fungus steps winding down its wall to a lower floor lost in warm shadow', /stair-well room/i),
  'gill-tunnel': S('a long gill-tunnel between two pleated walls of gill-flesh that lean together overhead, the tunnel curving away at its far end', /gill-tunnel/i),
  'hollow bulb': S('a hollow bulb-chamber in the swollen base of the stalk, the walls curving in above like the inside of an egg, roots showing through the floor', /bulb-chamber/i),
  'attic cap': S('an attic room right up under the crown of the cap, the ceiling sloping to the floor on both sides so only the middle stands full height', /attic room/i),
  'window bay room': S('a room whose far wall is one wide bowed opening of living flesh with shelves built across it in crooked mullions, light coming through every gap', /wide bowed opening/i),
  'cellar room': S('a cool cellar room dug down among the mushroom\'s roots, the roots making the beams of the low ceiling, steps coming down from above', /cellar room/i),
  'twin-stalk room': S('a room bridged between two stalks, a floor of woven root spanning the gap and a shelf-wall on each stalk\'s curved side', /bridged between two stalks/i),
  'lantern room': S('a tall lantern-shaped room whose whole upper wall is translucent gill-flesh glowing gold from the light outside, the shelves in silhouette against it', /lantern-shaped room/i),
  'crooked tower': S('a crooked tower room stacked in three uneven floors up the stalk, each floor smaller than the one below and reached by its own short stair', /crooked tower room/i),
  'nest room': S('a round nest-shaped room woven of living root and stem with shelves tucked into the weave at every height', /nest-shaped room/i),
  'shell spiral': S('a room coiled like a snail shell, the passage tightening inward past shelf after shelf to a small round heart-chamber', /coiled like a snail shell/i),
  'balcony room': S('a room open along one side to a balcony of bent willow hanging over the forest floor, the shelves crowding the three closed walls', /balcony of bent willow/i),
  'sunken pit': S('a sunken pit-room whose floor lies a full storey below its door, a stair spiralling down the shelf-lined wall to the counter at the bottom', /sunken pit-room/i),
  'dome and drum': S('a drum-shaped room with a domed gill ceiling, a ring of shelves at head height and a second ring above reached by a ladder', /drum-shaped room/i),
};
const F = (body, re) => ({ body, re });
const FEATURES = {
  'rope-ladder loft': F('a rope-ladder climbing to a low loft on one flank', /rope-ladder/i),
  'spiral stair': F('a spiral stair of bracket-fungus steps growing straight from the wall', /spiral stair/i),
  'continuous spiral shelf': F('shelves curving around the wall in one continuous impossible spiral into the loft', /continuous impossible spiral/i),
  'root through the wall': F('a root come through the wall with a shelf built around it', /root came through|root punching through|root entering from outside|built entirely around a thick root/i),
  'living-stem ladder': F('a ladder of living stems still in leaf climbing to the loft', /ladder of living stems/i),
  'woven-root loft floor': F('a loft floor of woven root through which lamplight passes', /woven root|woven rush/i),
  'knot-hole cubby': F('a knot-hole at the counter\'s near end serving as a cubby', /knot-hole/i),
  'gill alcove': F('an alcove hollowed into a single vast gill whose pleated surface holds tier on tier of small crocks', /single vast gill/i),
  'translucent ceiling': F('a section of the ceiling gone translucent so the stock on its inner ledge glows through the pale flesh', /gone translucent/i),
  'cap-shaped niche': F('a cap-shaped niche carved at the counter\'s corner just big enough for one jar', /cap-shaped niche/i),
  'ceiling mushrooms': F('a ceiling that has sprouted small mushrooms of its own along the timber beams', /sprouted small mushrooms/i),
  'cap-window well': F('a well of warmth dropping all the way down from a cap-window far above', /cap-window/i),
  'loft hatch': F('a little hatch cut into the loft floor above the counter', /hatch cut into the loft floor/i),
  'worn floor step': F('a worn step hollowed into the floor before the counter', /worn (?:dish-shaped )?step|worn hollow/i),
  'stoneware basin': F('a small stoneware basin at the counter\'s receding end', /stoneware basin/i),
  'rib ledges': F('the vault\'s ribs forming natural ledges that carry small crocks along their length', /ribs forming natural ledges/i),
  'bough handrail': F('a stair handrail that is a living bough bent to follow the curve', /living bough/i),
  'overhang gallery': F('a loft gallery whose underside forms a deep overhang over the lower shelves', /deep overhang/i),
  'bent-willow rail': F('a loft rail of bent willow running along one edge', /rail of bent willow/i),
  // ── new odd features ──
  'dumb-waiter basket': F('a small basket on a cord running up through a hole in the loft floor and down again beside the counter', /basket on a cord/i),
  'snail-shell steps': F('a stair of snail shells set into the wall, each shell a step', /stair of snail shells/i),
  'drip cistern': F('a hollow in the wall where a slow drip from the cap above fills a stone cistern, a wooden spout at its lip', /drip .{0,30}cistern|stone cistern/i),
  'seed drawers': F('a bank of tiny drawers made of split seed pods set into the counter\'s front', /tiny drawers/i),
  'hanging scale beam': F('a balance of two acorn cups on a beam hung from the ceiling over the counter', /balance of two acorn cups/i),
  'acorn-cup lamps': F('a row of acorn-cup lamps on a shelf edge each holding a glow-worm', /acorn-cup lamps/i),
  'glass-wing window': F('a small window glazed with a single dragonfly wing set into the wall beside the counter', /glazed with a single dragonfly wing/i),
  'thorn hooks': F('a row of thorn hooks along a beam over the counter', /thorn hooks/i),
  'root chair': F('a chair grown from a root behind the counter, its back curved up into the shelving', /chair grown from a root/i),
  'moss cushion bench': F('a bench of moss cushion running under the lowest shelf', /bench of moss/i),
  'bark ledger desk': F('a slanted desk of one flat bark sheet at the counter\'s end', /desk of one flat bark/i),
  'fern-frond awning': F('a fern frond growing through the wall and arching over the counter as an awning', /fern frond .{0,30}awning|arching over the counter/i),
  'mortar pit': F('a mortar as big as a bowl sunk into the counter top with a pestle standing in it', /mortar .{0,20}sunk into the counter/i),
  'pulley shelf': F('a shelf that hangs from the ceiling on four cords and a pulley so it can be lowered', /hangs from the ceiling on four cords/i),
  'bottle steps': F('a stair of corked stone bottles set on end climbing to the loft', /stair of corked stone bottles/i),
  'spider-silk net': F('a net of spider silk slung under the ceiling holding dried bundles', /net of spider silk/i),
  'stone sink': F('a stone sink beside the counter fed by a hollow stem pouring a thread of water', /stone sink/i),
  'gill curtain': F('a curtain of hanging gill-flesh drawn across a back room, light showing through its pleats', /curtain of hanging gill-flesh/i),
  'pebble floor': F('a floor paved with flat river pebbles worn to a shine in a path from door to counter', /paved with flat river pebbles/i),
  'firefly jar chandelier': F('a chandelier of three jars hung from the ceiling each holding a slow-blinking firefly', /chandelier of three jars/i),
  'bee door': F('a tiny second door at floor level with a bee coming and going', /tiny second door/i),
  'cobweb hammock': F('a cobweb hammock slung in the loft corner', /cobweb hammock/i),
  'root well': F('a round well in the floor where roots drink, a bucket the size of a thimble on its rim', /round well in the floor/i),
  'lichen carpet': F('a carpet of grey-green lichen across the floor with a worn path through it', /carpet of grey-green lichen/i),
  'cone stool': F('a stool made of a pine cone tucked under the counter', /stool made of a pine cone/i),
  'seed-pod shutters': F('shutters of split seed pods hinged over the opening', /shutters of split seed pods/i),
  'hollow-stem chimney': F('a hollow stem rising from a small brazier through the ceiling as a chimney', /hollow stem .{0,20}chimney|as a chimney/i),
  'leaf-press stack': F('a stack of flat stones pressing leaves on the counter\'s far end', /pressing leaves/i),
  'crooked bell': F('a small crooked bell of beaten copper hung beside the opening', /crooked bell/i),
  'sap lantern': F('a lantern of hardened amber sap hung over the counter glowing from a coal inside', /lantern of hardened amber/i),
};
const WAYUPS = ['a plank stair climbing to a loft gallery', 'a short bracket-fungus stair climbing to a loft nook', 'three broad plank steps up to a loft nook', 'a knotted-cord ladder to a shallow loft', 'a stair of stacked flat stones to a loft', 'a plank stair of uneven treads to the loft'];
const OPENINGS = ['one round opening cut deep beside it', 'one high oval opening far above', 'one round opening set low and wide on the right wall', 'one wide oval opening off to the left side', 'one oval opening cut into the outer wall', 'one round opening set into the outer wall below the loft', 'one oval opening in the outer wall at mid-height', 'one round opening beside the alcove mouth'];
const VANTAGES = ['seen from just inside the doorway', 'seen from the foot of the stair looking up past the loft rail', 'seen from a low corner with the shelf-wall rising overhead', 'seen from the counter\'s end looking down its length', 'seen from the far end of the counter looking down its length', 'seen from the counter\'s end with the opening off to one side', 'seen from the foot of the steps looking up'];

function firstMatch(rules, text) {
  let best = null;
  let at = Infinity;
  for (const [k, v] of Object.entries(rules)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
}
function parse(text) {
  const shape = firstMatch(SHAPES, text.split(',').slice(0, 2).join(',')) || firstMatch(SHAPES, text) || 'room';
  // the odd feature is the FIRST feature named that the shape does not own
  let feature = 'feature';
  let at = Infinity;
  for (const [k, v] of Object.entries(FEATURES)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; feature = k; }
  }
  return { keys: [`shape:${shape}`, `feature:${feature}`], shape, feature };
}
const sameGroup = (a, b) => a.shape === b.shape && a.feature === b.feature;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['room']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
const NEW_FEATURES = Object.keys(FEATURES).slice(19);
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const get = (g) => (g.assignment ? g.assignment : g);
  const used = (s, f) => groups.some((g) => get(g).shape === s && get(g).feature === f);
  const fUsed = (f) => groups.filter((g) => get(g).feature === f).length;
  const shapes = byUsage(shuffle(Object.keys(SHAPES)), usage, (k) => 'shape:' + k);
  for (const shape of shapes) {
    const feats = shuffle(NEW_FEATURES).filter((f) => fUsed(f) < 3 && !used(shape, f)).sort((a, b) => fUsed(a) - fUsed(b));
    if (!feats.length) continue;
    const feature = feats[0];
    return {
      keys: [`shape:${shape}`, `feature:${feature}`],
      shape,
      feature,
      shapeWords: SHAPES[shape].body,
      featureWords: FEATURES[feature].body,
      wayUp: spread(WAYUPS),
      opening: spread(OPENINGS),
      vantage: spread(VANTAGES),
      tags: [shape, feature],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted-fae bot: FaeBot's mushroom-apothecary path, the ROOM axis: the apothecary room inside a living mushroom, the hero of the picture. Every entry is ONE room in 65-88 words, one sentence. COUNT THEM: anything over 95 words is cut and lost.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the room's shape in the slot's own words; its shelving (crooked tiers of uneven depth or height along the curved walls, of birch-bark, willow weave or mushroom-timber); the counter (turned three-quarters, grown from the floor, or running the room's length); the slot's ODD FEATURE in your own words; the slot's way up; the slot's opening; and end with the slot's vantage.
- Materials only: gill-flesh, mushroom-timber, bracket-fungus, willow weave, birch-bark, living root and stem, stoneware. Nobody in the room and no wares named (jars, bottles, crocks may be mentioned as shapes, never their contents). Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. shape: "${a.shapeWords}"; odd feature: "${a.featureWords}"; way up: ${a.wayUp}; opening: ${a.opening}; vantage: ${a.vantage}`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An) .{330,}$/;
const BANS = [
  ['people', /\b(fae|fairy|figure|figures|apothecary keeper|shopkeeper|customer|she|he|her|his)\b/i],
  ['wares', /\b(potion|potions|remedy|remedies|tincture|elixir|salve)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.shape !== a.shape) p.push(`shape ${parsed.shape}≠${a.shape}`);
  if (parsed.feature !== a.feature) p.push(`feature ${parsed.feature}≠${a.feature}`);
  const words = cand.split(/\s+/).length;
  if (words < 58 || words > 104) p.push(`${words} words`);
  if (!/shel(?:f|ves)/i.test(cand)) p.push('no shelves');
  if (!/counter/i.test(cand)) p.push('no counter');
  if (!/opening/i.test(cand)) p.push('no opening');
  if (!/seen from/i.test(cand)) p.push('no vantage');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { shape: t('shape'), feature: t('feature') };
}

module.exports = {
  name: 'faebot/mushroom_apothecary/room',
  poolFile,
  basis: 'room = the room SHAPE + the one odd built feature; same when both match; greedy, pool order (way up, opening and vantage are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [350, 640],
  SHAPES,
  FEATURES,
};
