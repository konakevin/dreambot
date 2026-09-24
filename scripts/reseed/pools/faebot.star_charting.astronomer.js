/* global __dirname */
/**
 * faebot / star-charting / astronomer (Track B: GROW from 25 to 100+) — THE HERO of the path: the
 * grown fae astronomer painted large and near. Every entry: "A <build> grown fae, <face>, <skin>,
 * <hair>, pointed ears, <wings>; wearing <outer garment> over <underlayer>, <hands or feet>, <one
 * carried instrument or one small companion detail>." 61-78 words, one sentence with a semicolon.
 * No pose (the sighting_pose axis), no sky, no place.
 *
 * Same idea = WING kind + OUTER GARMENT + BUILD word. The 25 originals are kept byte-identical; each
 * new entry takes an unused (wings, garment, build) triple with face, skin, hair, colours and the
 * carried detail as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/faebot/seeds/faebot_starchart_astronomer.json');

const BUILDS = ['rangy', 'willowy', 'compact', 'broad-shouldered', 'slight', 'tall', 'wiry', 'long-limbed', 'stocky', 'lean', 'sturdy', 'small and quick'];
const BUILD_RE = /\bA (rangy|willowy|compact|broad-shouldered|slight|tall|wiry|long-limbed|stocky|lean|sturdy|small and quick)\b/i;
const WINGS = {
  'dragonfly-clear': /dragonfly-clear|clear as still water|dragonfly wings/i,
  'moth-furred': /moth-furred|furred like a moth|soft wings furred/i,
  'leaf-veined': /leaf-veined/i,
  'scale-dusted': /scale-dusted/i,
  'narrow swift': /narrow swift wings/i,
  'broad soft': /broad soft wings/i,
  'beetle-shell': /beetle-shell wings|wings like beetle shell|hard beetle/i,
  'lacewing': /lacewing/i,
  'bee-gauze': /bee-gauze|gauze wings/i,
  'seed-wing': /seed-wing|sycamore-wing|wings like sycamore keys/i,
};
const WING_WORDS = {
  'dragonfly-clear': 'dragonfly-clear wings shot through with <colour> veins',
  'moth-furred': 'moth-furred wings in <colour> and <colour2>',
  'leaf-veined': 'leaf-veined wings in <colour> and <colour2>',
  'scale-dusted': 'scale-dusted wings in <colour> and <colour2>',
  'narrow swift': 'narrow swift wings in <colour> with clear edges',
  'broad soft': 'broad soft wings furred in <colour> and <colour2>',
  'beetle-shell': 'hard beetle-shell wing-cases in <colour> with gauze beneath',
  'lacewing': 'lacewing wings netted in fine <colour> lines',
  'bee-gauze': 'short bee-gauze wings folded flat and catching the light',
  'seed-wing': 'seed-wings like sycamore keys in papery <colour>',
};
const GARMENTS = {
  'quilted moss-velvet coat': /quilted moss-velvet coat|coat of quilted moss-velvet|quilted moss-velvet jerkin|quilted vest of moss-velvet|quilted coat of moss-velvet|double-breasted coat of quilted moss-velvet/i,
  'lichen-scale cape': /lichen scales|lichen-scale/i,
  'stitched-bark jerkin': /jerkin of stitched bark|bark jerkin|jerkin of soft bark/i,
  'oiled leaf-cloth coat': /oiled leaf-cloth/i,
  'milkweed-floss shawl': /milkweed floss/i,
  'quilted gilet': /quilted amber gilet|quilted moss-green gilet|gilet/i,
  // ── new outer garments ──
  'feather-down mantle': /feather-down mantle|mantle of (?:owl|goose|jay) down/i,
  'woven-grass tabard': /woven-grass tabard|tabard/i,
  'petal-silk tunic': /petal-silk tunic/i,
  'cobweb-lace overcoat': /cobweb-lace|overcoat of cobweb/i,
  'bramble-leather jacket': /bramble-leather|jacket of bramble/i,
  'fern-frond cloak': /fern-frond cloak|cloak of (?:overlapping )?fern/i,
  'seed-husk armour vest': /seed-husk vest|husk vest|armour vest|vest of fitted seed husks|seed husks/i,
  'thistledown jumper': /thistledown/i,
  'reed-pith waistcoat': /reed-pith waistcoat|waistcoat/i,
  'oak-leaf poncho': /oak-leaf poncho|poncho/i,
};
const GARMENT_WORDS = {
  'quilted moss-velvet coat': 'a long quilted moss-velvet coat in <colour>',
  'lichen-scale cape': 'a hooded cape of overlapping lichen scales',
  'stitched-bark jerkin': 'a sleeveless <colour> jerkin of stitched bark',
  'oiled leaf-cloth coat': 'a long oiled leaf-cloth coat in <colour>',
  'milkweed-floss shawl': 'a wrapped shawl-coat of spun milkweed floss',
  'quilted gilet': 'a quilted <colour> gilet fastened with beetle-shell buttons',
  'feather-down mantle': 'a short mantle of owl down in <colour>',
  'woven-grass tabard': 'a woven-grass tabard dyed <colour>',
  'petal-silk tunic': 'a long petal-silk tunic in <colour>',
  'cobweb-lace overcoat': 'an overcoat of cobweb lace over <colour>',
  'bramble-leather jacket': 'a short bramble-leather jacket in <colour>',
  'fern-frond cloak': 'a cloak of overlapping fern fronds',
  'seed-husk armour vest': 'a vest of fitted seed husks in <colour>',
  'thistledown jumper': 'a thick jumper of spun thistledown in <colour>',
  'reed-pith waistcoat': 'a reed-pith waistcoat dyed <colour>',
  'oak-leaf poncho': 'an oak-leaf poncho gone <colour> with the season',
};
const COLOURS = ['plum', 'ember-orange', 'teal', 'indigo', 'rust', 'moss-green', 'gold', 'cream', 'deep amber', 'copper', 'dusk-violet', 'bottle-green', 'ochre', 'slate-blue'];
const FACES = ['long-limbed with a sharp jaw and hooded amber eyes', 'long-necked with prominent cheekbones and a wide decisive mouth', 'with a broad nose and carved laugh-lines', 'with a strong brow and a short neat beard', 'with a long fine nose and steady dark eyes', 'with a long face and a pronounced chin', 'with a strong flat nose and a short upper lip', 'with wide-set eyes and a square jaw', 'with a narrow face and sharp cheekbones', 'with a round face and a small stubborn chin', 'with heavy brows and pale watchful eyes', 'with a freckled snub nose and a quick mouth', 'with a lined weathered face and bright eyes', 'with a soft round jaw and deep dimples', 'with high cheekbones and a crooked smile'];
const SKINS = ['deep bronze skin', 'birch-pale skin', 'warm umber skin', 'russet skin', 'ash-fair skin', 'olive-fair skin', 'deep amber skin', 'warm brown skin', 'pale freckled skin', 'dark walnut skin', 'olive skin', 'golden-brown skin'];
const HAIRS = ['black hair tied back with a plaited grass cord', 'silver hair pinned up with three carved bone thorns', 'close-cropped copper hair', 'dark brown hair wound in a cloth to keep it off the face', 'silver-white hair cropped bluntly at the jaw', 'auburn hair braided tight and wound twice around the head', 'white hair worn loose to the shoulder', 'mousy hair pinned up in a loose knot', 'chestnut hair gathered back with a length of cord', 'grey-brown hair wound up in a cloth', 'copper-streaked black hair in two pinned plaits', 'sandy hair cropped close and pushed forward', 'dark red hair tied back hard with a cord', 'white-blond hair in a loose knot held with a grass cord', 'black hair cropped on one side and long on the other'];
const DETAILS = ['a coil of knotted grass cord looped at the belt', 'a soft pouch of pins slung at the hip', 'a flat river pebble on a thong at the belt', 'a spare hoop of bent willow worn over one shoulder', 'a row of small pebbles pinned to the belt on a cord', 'a flat moss pad at the belt bristling with upright grass-cord loops', 'a single carved acorn cap hung on a looped cord', 'a pouch of river pebbles tied at the hip', 'a flat stone at the belt with a row of seeds pressed into a groove', 'a moth asleep on one shoulder with its wings still spread', 'a dormouse curled on the perch beside them', 'a snail crossing the moss pad at the belt', 'one bead of the belt cord gone milky with cold', 'a rolled strip of birch bark under one arm', 'a glow-worm in a nutshell lantern hung from the belt', 'a fistful of reed slivers pushed through the belt', 'a thorn-pin stuck through the collar', 'a tiny brass bell on a cord at the wrist', 'a cricket riding in the coat pocket with its antennae out', 'a string of dried rowan berries round the neck'];
const FEET = ['high boots of shaped bark', 'woven-grass footless leggings', 'bark-soled sandals laced up the ankle', 'fingerless mitts of felted grey down', 'fingerless mitts of woven grass', 'down-lined cuffs', 'bark-cloth fingerless gloves', 'a long rust scarf wound twice at the throat', 'a stiff collar of owl-down', 'a wide plaited-grass belt'];

const first = (rules, text) => {
  let best = null;
  let at = Infinity;
  for (const [k, re] of Object.entries(rules)) {
    const m = text.match(re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
};
function parse(text) {
  const b = text.match(BUILD_RE);
  const build = b ? b[1].toLowerCase() : 'fae';
  const wings = first(WINGS, text) || 'wings';
  const garment = first(GARMENTS, text.split(';').slice(1).join(';') || text) || first(GARMENTS, text) || 'clothes';
  return { keys: [`wings:${wings}`, `garment:${garment}`, `build:${build}`], wings, garment, build };
}
const sameGroup = (a, b) => a.wings === b.wings && a.garment === b.garment && a.build === b.build;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['astronomer']));
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
  const used = (w, g, b) => groups.some((x) => get(x).wings === w && get(x).garment === g && get(x).build === b);
  const wingsList = byUsage(shuffle(Object.keys(WINGS)), usage, (k) => 'wings:' + k);
  const garmentList = byUsage(shuffle(Object.keys(GARMENTS)), usage, (k) => 'garment:' + k);
  const buildList = byUsage(shuffle(BUILDS), usage, (k) => 'build:' + k);
  for (const wings of wingsList.slice(0, 4)) for (const garment of garmentList.slice(0, 5)) for (const build of buildList.slice(0, 4)) {
    if (used(wings, garment, build)) continue;
    const c1 = spread(COLOURS);
    const c2 = spread(COLOURS.filter((c) => c !== c1));
    return {
      keys: [`wings:${wings}`, `garment:${garment}`, `build:${build}`],
      wings,
      garment,
      build,
      wingWords: WING_WORDS[wings].replace('<colour>', c1).replace('<colour2>', c2),
      garmentWords: GARMENT_WORDS[garment].replace('<colour>', spread(COLOURS)),
      under: `a ${spread(COLOURS)} underlayer`,
      face: spread(FACES),
      skin: spread(SKINS),
      hair: spread(HAIRS),
      feet: spread(FEET),
      detail: spread(DETAILS),
      tags: [wings, garment, build],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted-fae bot: FaeBot's star-charting path, the ASTRONOMER axis: the grown fae who is out watching the night sky, painted large and near, the hero of the picture. Every entry is ONE fae in 61-78 words, one sentence with a semicolon.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: "A <build> grown fae, <face>, <skin>, <hair>, pointed ears, <wings>; wearing <outer garment> over <underlayer>, <hands or feet or collar>, <the one carried detail>." Use EXACTLY the build word, wings, garment and details given for the slot, in your own natural wording.
- A grown fae, never a child; hair, wings and clothes in painted colour names. No pose, no sky, no tree, no instrument in use (other axes carry those); a carried thing is worn or held still. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. build: "${a.build}"; face: "${a.face}"; skin: ${a.skin}; hair: ${a.hair}; wings: "${a.wingWords}"; outer garment: "${a.garmentWords}" over ${a.under}; hands/feet: ${a.feet}; carried detail: "${a.detail}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^A [a-z -]+ grown fae[, ].{300,}$/;
const BANS = [
  ['child', /\b(child|girl|boy|little fae|young fae|kid)\b/i],
  ['pose', /\b(lying|kneeling|crouched|sitting|standing|leaning|squinting|pointing)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.wings !== a.wings) p.push(`wings ${parsed.wings}≠${a.wings}`);
  if (parsed.garment !== a.garment) p.push(`garment ${parsed.garment}≠${a.garment}`);
  if (parsed.build !== a.build) p.push(`build ${parsed.build}≠${a.build}`);
  const words = cand.split(/\s+/).length;
  if (words < 50 || words > 84) p.push(`${words} words`);
  if (!/pointed ears/i.test(cand)) p.push('no pointed ears');
  if (!/;/.test(cand)) p.push('no semicolon');
  if (!/wearing|\bin a\b/i.test(cand)) p.push('no wearing clause');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { wings: t('wings'), garment: t('garment'), build: t('build') };
}

module.exports = {
  name: 'faebot/star_charting/astronomer',
  poolFile,
  basis: 'astronomer = wing kind + outer garment + build word; same when all three match; greedy, pool order (face, skin, hair, colours and the carried detail are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [330, 560],
  WINGS,
  GARMENTS,
  BUILDS,
};
