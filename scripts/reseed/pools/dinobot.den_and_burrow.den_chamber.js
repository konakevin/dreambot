/* global __dirname */
/**
 * dinobot / den-and-burrow / den_chamber (Track B: GROW from 25 to 100+) — THE HERO of the path: the
 * underground SPACE itself, its materials and its ONE light source. Every entry: "<A chamber TYPE>,
 * <walls and ceiling material and colour>, <the one light source and what it does>, <one small
 * charm detail on the floor or wall>" — 40-46 words, one sentence. Nobody home (den_life axis).
 *
 * Same idea = the chamber TYPE + the LIGHT SOURCE (the originals are 10 types × ~8 lights). The 25
 * originals are kept byte-identical; each new entry takes an unused (type, light) pair with a wall
 * material and a charm detail as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_den_chamber.json');

const T = (body, re) => ({ body, re });
const TYPES = {
  'nest hollow': T("a round nest hollow at the tunnel's end, floor deeply dished and packed smooth", /nest hollow/i),
  'cutaway chambers': T('a cross-section cutaway through <earth> revealing chambers at descending depths linked by sloping galleries', /cutaway|cross-section/i),
  'entrance from inside': T('the entrance tunnel seen from inside, packed walls pressing close on either side, its mouth blazing with daylight', /entrance tunnel (?:seen |)from inside/i),
  'riverbank chamber': T('a riverbank chamber with one wall open to sliding green water', /riverbank chamber|riverbank den/i),
  'under a root-plate': T("a wide low gallery beneath a fallen giant's root-plate, the ceiling the rough underside of the trunk", /root-plate/i),
  'seep chamber': T('a deep cool chamber with a seep weeping slowly down a rock face into a shallow floor pool', /seep/i),
  'living-tree hollow': T('a round hollow inside the base of a living tree, walls of smooth pale heartwood', /living (?:fig |)tree|living sequoia|living-tree hollow/i),
  'collapsed skylight': T('a collapsed-ceiling chamber, earth and roots having opened a ragged skylight above a dished floor', /collapsed-ceiling|collapse-skylight/i),
  'dune-bank chamber': T('a sandy dune-bank chamber with walls banded in clean horizontal stripes of <bands>', /dune-bank chamber|sandy bank chamber/i),
  'oversized old burrow': T('an oversized old burrow, its entrance arch taller than the current tenant needs, the walls still carrying the gouge marks of a much larger body', /oversized/i),
  // ── new chamber types ──
  'lava-tube den': T('a den in a cooled lava tube, the walls glassy black rope-rock in frozen ripples, the floor a bed of dry fern', /lava/i),
  'cliff-ledge cave': T('a shallow cave in a cliff face with a dished nest of dry grass at the back and the open drop beyond the lip', /cliff/i),
  'hollow log den': T('a den inside a hollow fallen log, the walls the ribbed inner bark, the floor soft rot and moss', /hollow[- ](?:fallen |old )?log|log den|inside a (?:fallen |hollow )?log/i),
  'sand-scoop pit': T('a shallow scoop-pit in open sand roofed only by a leaning slab of stone', /open sand|slab of stone|leaning slab|scoop-pit|scoop pit/i),
  'beach-cave den': T('a sea-cave den in pale sandstone with a floor of dry shell-sand above the tide line', /sea[- ]cave|shell-sand|tide line/i),
  'termite-mound chamber': T('a chamber dug into the base of a giant termite mound, the walls hard red clay honeycombed with old galleries', /termite/i),
  'ice-bank den': T('a den scooped into a bank of old snow, the walls blue-white and smoothed by a warm body', /snow|ice-bank|old ice|\bice\b/i),
  'stump-root den': T('a den under a vast rotten stump, the ceiling a dome of fibrous red wood and root', /stump/i),
  'boulder-gap den': T('a den in the gap beneath two leaning boulders, the floor a mat of shed feathers and dry leaves', /boulder/i),
  'reed-bed tunnel': T('a tunnel den in a reed bed, the walls woven from living reed stems bent and packed', /reed/i),
  'mud-crack chamber': T('a chamber under a plate of sun-cracked mud, the ceiling the underside of the crust', /cracked mud|mud crust|mud-crack|plate of mud/i),
  'ant-hill side chamber': T('a chamber cut into the side of a hillside of loose scree, walls of fitted stones packed with clay', /scree|loose stones|fitted stones/i),
  'waterfall-back cave': T('a cave behind a thin waterfall, the far wall a moving curtain of water', /waterfall|falling water/i),
  'clay bowl den': T('a single deep bowl-den scooped in blue-grey clay with a long curved entrance throat', /bowl-den|bowl den|blue-grey clay|bowl-shaped/i),
  'hot-spring den': T('a den beside a hot-spring vent, the walls crusted white and orange with mineral, warm steam curling along the ceiling', /hot-spring|hot spring|mineral crust|vent/i),
};
const L = (body, re) => ({ body, re });
const LIGHTS = {
  'amber shaft': L('late-afternoon light glowing amber down the entrance shaft', /amber down the entrance|glowing amber/i),
  'noon disc': L('a blazing white disc of tropical noon at the tunnel mouth backlighting every rootlet', /blazing white disc|blazing with equatorial light|oval mouth blazing/i),
  'water ripples': L('river-reflected light rippling in gold chevrons across the ceiling', /rippling in gold|reflected water-light|bouncing up off the surface/i),
  'warm rectangle': L('late light entering where the root-ball pulled free and pooling in a warm rectangle on the floor', /warm rectangle/i),
  'silver shimmer': L("the seep's shimmer reflected off the floor pool onto the low ceiling in trembling silver", /trembling silver|mirrors the ceiling/i),
  'root-gap shaft': L('a single root-gap admitting one shaft of afternoon sun', /root-gap|single root gap|needle of sunlight/i),
  'skylight beam': L('a beam through the ragged skylight striking the far wall and turning rising dust to copper', /beam striking|shaft of noon light striking/i),
  'gold cone': L('light arriving from the tunnel mouth as a warm gold cone', /gold cone|floods the full width|casting each wall band/i),
  'wide-mouth wash': L('afternoon light falling generously through the wide mouth', /falling generously|long soft ellipse/i),
  'horizontal blade': L('light filtering through the gap between trunk and ground in a long horizontal blade', /horizontal blade/i),
  'travelling bar': L('a single bar of gold light that travels slowly around the chamber as the day turns', /travels slowly|bar of light that enters/i),
  // ── new light sources ──
  'glow-worm ceiling': L('a scatter of glow-worms on the ceiling giving a cold blue-green starlight', /glow-worm/i),
  'fungus glow': L('shelves of pale fungus on the walls glowing faintly green in the dark', /fungus .{0,20}glow|glowing faintly green/i),
  'ember light': L('the red glow of a dying lava flow seen through a crack in the wall', /lava flow|red glow/i),
  'moonlight shaft': L('a single shaft of blue moonlight down the entrance', /moonlight/i),
  'dawn slit': L('the first pink dawn light in a thin slit along the top of the entrance', /dawn light|pink/i),
  'lightning flicker': L('storm light flickering white through the mouth with every distant lightning strike', /lightning|storm light/i),
  'sunset ember': L('the last orange sunset reaching only the far wall in a low burning stripe', /sunset|burning stripe|last orange|last light/i),
  'water-lens light': L('daylight coming through a pool of clear water at the entrance and wobbling across the ceiling', /through a pool|wobbling/i),
  'crack lattice': L('daylight in a lattice of cracks across the whole ceiling crust', /lattice|cracks? (?:in|across|through) the|through (?:the |every |each )?cracks?|light in every crack|daylight (?:threading|seeping|leaking) through/i),
  'ice glow': L('a diffuse blue glow through the snow walls with the sun somewhere above', /blue glow through the snow|diffuse blue/i),
  'firefly drift': L('fireflies drifting in through the mouth and lighting the chamber in slow pulses', /firefl/i),
  'waterfall shimmer': L('daylight broken through the falling water into a moving net of light on every wall', /net of light|through the falling water|through the water curtain|waterfall light|light broken|broken (?:by|through) the (?:falling |moving )?water|shimmer(?:ing)? (?:net|web)/i),
  'steam-lit glow': L('warm light through drifting steam turning the whole chamber amber and soft', /through drifting steam/i),
  'twin shafts': L('two shafts of light from two entrance holes crossing in the middle of the chamber', /two shafts|twin shafts|two beams|two (?:entrance|openings)|crossing in the middle/i),
  'reflected snow light': L('cold white light bounced in off a snowfield outside', /bounced in off/i),
};
const EARTHS = ['ochre earth', 'deep red laterite', 'ochre sandstone', 'grey clay', 'packed brown earth', 'iron-red rock', 'pale limestone earth'];
const BANDS = ['cream, rust and deep sienna', 'apricot, white and deep burgundy', 'chalky white and terracotta', 'pale gold, rust and slate', 'cream and ochre'];
const CHARMS = ['one fat root curved into a natural armrest above the dished floor', 'a single iridescent beetle shell in the corner catching the light', 'a fossil ammonite pressed into the stone wall', 'a scattering of fig seeds on the floor', 'a vein of white quartz running down the wall', 'a line of clay nodules projecting from the wall like a natural shelf', 'dry fern fronds lying in the lit patch like a mosaic', 'the shed copper scales of pine bark scattered on the floor', 'a fossil oyster shell jutting from the wall', 'a drift of shed feather-down caught in a root crack', 'a smooth river pebble worn to a shine in the floor bowl', 'a single fallen ginkgo leaf lying gold on the floor', 'a snail shell the size of a fist tucked into a wall niche', 'a pale root thread running the length of the wall like a painted stripe', 'a spider web across the mouth catching the light', 'a heap of cracked seed husks in one corner', 'a small pool of rainwater in the floor dish holding a reflection of the ceiling', 'an old shed claw sheath lying on the floor', 'three white pebbles set in a row where the floor meets the wall', 'a fern growing sideways out of the wall toward the light'];

function first(rules, text) {
  let best = null;
  let at = Infinity;
  for (const [k, v] of Object.entries(rules)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
}
function parse(text) {
  const type = first(TYPES, text) || 'chamber';
  const light = first(LIGHTS, text) || 'light';
  return { keys: [`type:${type}`, `light:${light}`], type, light };
}
const sameGroup = (a, b) => a.type === b.type && a.light === b.light;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['den']));
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
  const used = (t, l) => groups.some((g) => get(g).type === t && get(g).light === l);
  const lUsed = (l) => groups.filter((g) => get(g).light === l).length;
  const types = byUsage(shuffle(Object.keys(TYPES)), usage, (k) => 'type:' + k);
  for (const type of types) {
    const lights = shuffle(Object.keys(LIGHTS)).filter((l) => lUsed(l) < 4 && !used(type, l)).sort((a, b) => lUsed(a) - lUsed(b));
    if (!lights.length) continue;
    const light = lights[0];
    return {
      keys: [`type:${type}`, `light:${light}`],
      type,
      light,
      typeWords: TYPES[type].body.replace('<earth>', spread(EARTHS)).replace('<bands>', spread(BANDS)),
      lightWords: LIGHTS[light].body,
      charm: spread(CHARMS),
      tags: [type, light],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's den-and-burrow path, the DEN CHAMBER axis: the underground space itself, its materials and its ONE light source, the hero of the picture. Every entry is ONE chamber in 40-48 words, one sentence (COUNT THEM; over 55 is cut).

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the chamber in the slot's own words with its wall and ceiling material and colour; then the slot's light source and what it does to the space; then the slot's one small charm detail. Materials as a naturalist names them (packed terracotta-red earth, live willow roots, blue-grey clay, heartwood, laterite).
- Nobody home: no dinosaur, no egg, no bones of a meal (the den_life axis carries the tenant). Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. chamber: "${a.typeWords}"; light: "${a.lightWords}"; charm detail: "${a.charm}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An|The|Beneath) .{200,}$/;
const BANS = [
  ['tenant', /\b(dinosaur|dinosaurs|hatchling|hatchlings|egg|eggs|tenant curled|mother|chick|chicks|raptor|theropod)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.type !== a.type) p.push(`type ${parsed.type}≠${a.type}`);
  if (parsed.light !== a.light) p.push(`light ${parsed.light}≠${a.light}`);
  const words = cand.split(/\s+/).length;
  if (words < 30 || words > 66) p.push(`${words} words`);
  if (!/light|glow|sun|moon|firefl|lightning|shimmer|beam|shaft|reflect|silver/i.test(cand)) p.push('no light');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { type: t('type'), light: t('light') };
}

module.exports = {
  name: 'dinobot/den_and_burrow/den_chamber',
  poolFile,
  basis: 'den = the chamber TYPE + the one light source; same when both match; greedy, pool order (material colours and the charm detail are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [220, 400],
  TYPES,
  LIGHTS,
};
