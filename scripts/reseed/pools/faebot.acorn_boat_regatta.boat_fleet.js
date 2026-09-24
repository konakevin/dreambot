/* global __dirname */
/**
 * faebot / acorn-boat-regatta / boat_fleet (Track B: GROW from 25 to 100+) — THE HERO of the path:
 * the FLEET, five or six little boats abreast, each hull a found thing (an acorn cap, a walnut shell,
 * a birch-bark curl, a pea-pod skiff, a seed-pod, a rose-petal coracle, a bracket-fungus raft, a
 * twin-reed outrigger …) with its colour, its sail or its rowing, sometimes its fae; then a dash and
 * ONE odd thing (a dragonfly tow gone wrong, a snail on the bank keeping pace, a fern frond roofing
 * the field, a water-vole following the raft …). 72-94 words. Fae-scale: a pebble is a cliff.
 *
 * Same idea = the ODD THING (the charm event) + the LEAD hull kind (the first hull named). The 25
 * originals are kept byte-identical; each new entry takes an unused charm, a lead hull, and four or
 * five more hulls drawn from the roster with colours and rigs as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/faebot/seeds/faebot_regatta_boat_fleet.json');

const HULLS = {
  'acorn cap': /acorn[- ]cap/i,
  'walnut shell': /walnut[- ]shell/i,
  'hazelnut shell': /hazelnut[- ]shell/i,
  'birch-bark curl': /birch[- ]bark/i,
  'pea-pod skiff': /pea[- ]pod/i,
  'seed-pod': /seed[- ]pod/i,
  'rose-petal coracle': /(?:rose|petal)[- ]coracle|petal coracle/i,
  'bracket-fungus raft': /bracket[- ]fungus/i,
  'twin-reed outrigger': /twin[- ]reed/i,
  'hollow-reed hull': /hollow[- ]reed|reed hull/i,
  'folded-leaf punt': /(?:folded[- ])?(?:oak|hornbeam|magnolia)[- ]leaf punt/i,
  'snail-shell boat': /snail[- ]shell/i,
  'chestnut-spiny pod': /chestnut[- ]spiny/i,
  // ── new hull kinds (found things at fae scale) ──
  'poppy-head boat': /poppy[- ]head/i,
  'beech-mast canoe': /beech[- ]mast/i,
  'conker boat': /conker/i,
  'thimble tub': /thimble/i,
  'lily-pad raft': /lily[- ]pad/i,
  'pine-cone galleon': /pine[- ]cone/i,
  'cherry-stone dinghy': /cherry[- ]stone/i,
  'sycamore-key glider': /sycamore[- ]key/i,
  'egg-shell cup': /egg[- ]shell/i,
  'bottle-cork tug': /cork/i,
  'teasel-head barge': /teasel/i,
  'half-plum-stone boat': /plum[- ]stone/i,
  'bark-chip raft': /bark[- ]chip/i,
  'cupped-tulip boat': /tulip/i,
};
const HULL_WORDS = {
  'acorn cap': 'a fat <colour> acorn cap tub',
  'walnut shell': 'a tubby <colour> walnut shell',
  'hazelnut shell': 'a cream hazelnut shell',
  'birch-bark curl': 'a lean <colour> birch-bark curl',
  'pea-pod skiff': 'a long <colour> pea-pod skiff',
  'seed-pod': 'a pale seed-pod with a pointed bow',
  'rose-petal coracle': 'a scarlet rose-petal coracle',
  'bracket-fungus raft': 'a flat bracket-fungus raft',
  'twin-reed outrigger': 'a twin-reed outrigger in <colour>',
  'hollow-reed hull': 'a long <colour> hollow-reed hull',
  'folded-leaf punt': 'a folded-oak-leaf punt in <colour>',
  'snail-shell boat': 'a plum-dark snail-shell boat',
  'chestnut-spiny pod': 'a chestnut-spiny seed-pod',
  'poppy-head boat': 'a dried poppy-head boat with its crown for a bow',
  'beech-mast canoe': 'a beech-mast canoe, three-cornered and sharp',
  'conker boat': 'a glossy half-conker boat',
  'thimble tub': 'a battered brass thimble tub',
  'lily-pad raft': 'a lily-pad raft with its stem for a tiller',
  'pine-cone galleon': 'a pine-cone galleon with scales for gunwales',
  'cherry-stone dinghy': 'a hollowed cherry-stone dinghy',
  'sycamore-key glider': 'a sycamore-key glider skimming on its wing',
  'egg-shell cup': 'a speckled egg-shell cup',
  'bottle-cork tug': 'a bottle-cork tug with a pin mast',
  'teasel-head barge': 'a teasel-head barge, bristling',
  'half-plum-stone boat': 'a half-plum-stone boat, ridged and copper',
  'bark-chip raft': 'a bark-chip raft lashed with grass',
  'cupped-tulip boat': 'a cupped tulip-petal boat in <colour>',
};
const COLOURS = ['copper-red', 'moss-green', 'plum', 'marigold', 'scarlet', 'cream', 'amber', 'cobalt-painted', 'turquoise', 'berry-red', 'ivory', 'honey-gold', 'rust', 'deep violet', 'lime'];
const RIGS = ['under a veined ivy-leaf sail', 'rowed hard with split-reed oars', 'poled off a grey river-pebble', 'towed on a grass line by a harnessed dragonfly', 'under a moth-wing sail showing one dark eyespot', 'paddled flat out by a fae lying along the hull', 'under a broad marigold petal sail', 'rowed with two flat seeds for oars', 'poled by two palm-sized fae', 'under a whole white clover-flower for a sail', 'skimming under a dandelion-down sail', 'under a scarlet poppy petal'];

const C = (words, re) => ({ words, re });
const CHARMS = {
  // ── the originals' odd things: rules only ──
  'coracle spinning laughing': C('', /spinning helplessly between them all/i),
  'oak leaf as wide as the fleet': C('', /fallen oak leaf drifting past/i),
  'snail keeping pace': C('', /snail on the bank/i),
  'watercress bridge': C('', /watercress strand/i),
  'spare dandelion sail': C('', /spare dandelion-down sail/i),
  'mayfly hovering': C('', /mayfly/i),
  'bailing with an acorn cap': C('', /bailing with a single acorn cap/i),
  'bulrush taller than masts': C('', /bulrush rising/i),
  'ballast rolled': C('', /pebble-ballast has rolled/i),
  'fern frond roof': C('', /fern frond (?:overhanging|above)|under a fern frond that roofs/i),
  'beetle ballast': C('', /beetle gripping/i),
  'pebble like a hill': C('', /like a submerged grey hill/i),
  'dragonfly changing its mind': C('', /changing its mind twice a second/i),
  'garland comet tail': C('', /streams behind it like a comet tail/i),
  'reed hull under the cress': C('', /going under it without slowing/i),
  'water-vole island': C('', /water-vole/i),
  'mouse asleep in the tender': C('', /mouse asleep/i),
  'dragonfly flying upward': C('', /decided to fly upward/i),
  'cord round the wrist': C('', /looped twice round the helmfae/i),
  'snail-shell gaining': C('', /gaining on the corkcrew/i),
  'pebble shadow swallowing two hulls': C('', /shadow that swallows two hulls/i),
  'dandelion seed passenger': C('', /uninvited passenger/i),
  'twig mast snapped': C('', /twig mast has snapped/i),
  'mast held by hand': C('', /held upright by the fae/i),
  // ── new odd things ──
  'frog on the stone': C('a fat frog sitting on the pebble the punt is poling off, entirely unmoved', /frog sitting on the pebble/i),
  'ladybird passenger': C('a ladybird riding the acorn cap\'s rim like a figurehead', /ladybird riding/i),
  'minnow under the raft': C('a minnow as long as the raft passing slowly beneath it, its shadow sliding over the gravel', /minnow/i),
  'sail turned inside out': C('one petal sail blown inside out and its fae hauling it back with both fists', /blown inside out/i),
  'seed floating up': C('a dandelion seed lifting straight up off the water in front of the lead boat like a thrown flag', /lifting straight up off the water/i),
  'rope of spider silk': C('a tow-line of spider silk between two hulls catching the light in one bright hair', /spider silk/i),
  'water-boatman escort': C('a water-boatman rowing alongside the fleet on its own back and keeping up', /water-boatman/i),
  'wasp on the sail': C('a wasp landed on the moth-wing sail and everyone aboard sitting very still', /wasp landed/i),
  'pollen cloud': C('a puff of yellow pollen from a shaken flower drifting over the whole fleet and dusting every sail', /pollen/i),
  'bubble raft': C('a raft of foam bubbles carrying a fallen fae hat downstream ahead of everyone', /raft of foam bubbles/i),
  'petal falling on the helm': C('a cherry petal landing square on the helmfae\'s head like a hat', /petal landing square/i),
  'tadpole traffic': C('a slow crowd of tadpoles crossing the course below the hulls like a herd', /tadpoles/i),
  'stickleback shadow': C('a stickleback hanging motionless under the raft with its back fin up like a sail of its own', /stickleback/i),
  'raindrop ring': C('one fat raindrop landing beside the coracle and its ring lifting every hull in turn', /raindrop landing/i),
  'moss island': C('a moss cushion on a pebble mid-stream with three fae spectators packed onto it', /moss cushion on a pebble/i),
  'fishing-line hazard': C('a strand of old fishing line crossing the course at mast height that every boat ducks', /fishing line/i),
  'feather boat crash': C('a drifting pigeon feather as long as the course sliding sideways into the pack', /pigeon feather/i),
  'newt referee': C('a newt on the bank with its head raised, watching the finish like a referee', /newt/i),
  'dragonfly landed on the mast': C('a dragonfly landed on the twig mast and bending it double with its weight', /landed on the twig mast/i),
  'acorn hail': C('two acorns dropping from the oak above into the water on either side of the raft', /two acorns dropping/i),
  'leaf boat capsized': C('a rival leaf boat already capsized and its fae sitting on the upturned hull, sulking', /capsized/i),
  'shared oar': C('two hulls lashed together at the last moment sharing one long oar between them', /sharing one long oar/i),
  'moth lantern': C('a moth flying escort ahead of the fleet with a glow-worm clinging to its back like a lamp', /moth flying escort/i),
  'wake of petals': C('a scatter of hawthorn petals in the lead boat\'s wake marking its line', /hawthorn petals/i),
  'spider abseiling': C('a spider abseiling from an overhanging twig onto the tallest sail on a single thread', /spider abseiling/i),
  'grass-cord bridge': C('a grass cord strung bank to bank at head height with three fae hanging from it cheering', /grass cord strung bank to bank/i),
  'floating cap': C('a lost acorn-cap hat drifting in the middle of the channel that every boat steers round', /lost acorn-cap hat/i),
  'bee refuelling': C('a bumblebee landed on the clover sail drinking from it mid-race', /bumblebee landed/i),
  'shell full of water': C('the snail-shell boat filling with water and its fae rowing faster in answer', /filling with water/i),
  'reflection race': C('every hull racing its own reflection on a patch of glassy water', /racing its own reflection/i),
  'caddis-fly case': C('a caddis-fly larva in its case of grit crawling across the finish line first', /caddis/i),
  'reed bowing': C('a reed bowing low under a fae spectator and dunking her feet in the stream', /reed bowing low/i),
  'petal parachute': C('a petal parachute drifting down onto the fleet with a beetle passenger', /petal parachute/i),
  'sunk pebble marker': C('a pebble marker for the turn that has sunk so every boat guesses where it was', /pebble marker/i),
  'dew drop deck': C('a dewdrop on the raft\'s deck as big as its fae\'s head rolling side to side', /dewdrop on the raft/i),
  'tail of thistledown': C('a strand of thistledown caught on the outrigger streaming behind it', /thistledown/i),
  'stag beetle tug': C('a stag beetle on the bank hauling a stuck hull free by its grass line', /stag beetle/i),
  'pond skater pacer': C('a pond skater striding beside the coracle and easily faster', /pond skater/i),
  'wren watching': C('a wren on a root above the course with its head cocked at the whole business', /wren/i),
  'sail stolen by wind': C('a gust lifting one petal sail clean off its mast and away downstream ahead of the race', /lifting one petal sail clean off/i),
  'oars crossed': C('two boats with their oars locked together and both fae shouting', /oars locked together/i),
  'feather sail': C('one hull rigged with a blue jay feather for a sail towering over every other', /blue jay feather/i),
  'harnessed bee': C('a hazelnut shell towed by a harnessed bee that keeps stopping at flowers on the bank', /harnessed bee/i),
  'leaf umbrella': C('a fae holding a clover leaf over her head against the spray like an umbrella', /clover leaf over her head/i),
  'glass-bead keel': C('a glass bead lashed under the coracle for a keel glinting through the water', /glass bead/i),
  'seed-head fireworks': C('a dandelion clock on the bank bursting in the wind and showering the fleet with seeds', /dandelion clock/i),
  'hedgehog spectator': C('a hedgehog nose just showing between two roots on the bank, watching', /hedgehog/i),
  'apple-blossom finish': C('the finish marked by a fallen apple blossom floating pink at the end of the straight', /apple blossom/i),
  'slug on the raft': C('a slug that has boarded the raft unnoticed and is riding along in the stern', /slug/i),
  'kingfisher shadow': C('the shadow of a kingfisher crossing the whole fleet in one blue flick', /kingfisher/i),
  'mushroom-cap umbrella': C('a fae spectator on the bank under a toadstool cap held up like a parasol', /toadstool cap/i),
  'water drop on the oar': C('a drop of water hanging from the oar tip as big as the rower\'s fist', /hanging from the oar tip/i),
  'bark boat sinking slowly': C('a bark-chip raft going down by the stern one inch a second with its fae still poling', /going down by the stern/i),
  'crane-fly tangle': C('a crane-fly tangled in the twin-reed rigging and taking the whole outrigger for a walk', /crane-fly/i),
  'fern-frond springboard': C('a fern frond that a fae has just leapt from into her boat still bouncing above the water', /still bouncing/i),
  'sun spot': C('one spot of sunlight on the water that every hull races to reach first', /spot of sunlight/i),
  'ant bridge': C('a line of ants crossing a twig bridge above the course in single file, ignoring the race', /line of ants/i),
  'feather duster': C('a downy feather stuck to the wet raft and waving like a flag', /downy feather/i),
  'leaf sail patch': C('one sail patched with a scrap of different-coloured petal sewn on with grass', /patched with a scrap/i),
  'nutshell bailer race': C('two fae in the same walnut shell bailing in opposite directions', /bailing in opposite directions/i),
  'trailing root': C('a hair-fine root trailing from the bank that the lead boat has to duck under', /hair-fine root/i),
  'dew lens': C('a dewdrop on a grass blade over the course magnifying the whole fleet as it passes beneath', /magnifying the whole fleet/i),
  'toad on the bank': C('a toad sitting on the bank with a fae asleep on its back', /toad sitting on the bank/i),
  'beetle rowing': C('a beetle rowing its own leaf alongside and keeping level', /beetle rowing/i),
  'blossom raft': C('a whole hawthorn blossom floating ahead of the fleet like a pace boat', /hawthorn blossom floating/i),
  'lost oar': C('a lost split-reed oar drifting sideways across the course that two boats swerve round', /lost split-reed oar/i),
  'fae swimming': C('a fae overboard and swimming for the raft in a fierce crawl, hat still on', /swimming for the raft/i),
  'petal umbrella boat': C('the smallest hull roofed with a bluebell for shade', /roofed with a bluebell/i),
  'seed helm': C('a sycamore key spinning down out of the air and landing as a hat on the helmfae', /sycamore key spinning down/i),
  'water snail keel': C('a water snail clamped to the coracle\'s underside and slowing it to a crawl', /water snail clamped/i),
  'earwig figurehead': C('an earwig standing on the bow of the pea-pod like a figurehead with pincers raised', /earwig/i),
  'grass-blade bridge': C('a bent grass blade bridging bank to bank at deck height that every fae ducks in turn', /bent grass blade bridging/i),
  'pebble turn buoy': C('a pebble turn-buoy with a fae marshal standing on it waving both arms', /turn-buoy/i),
  'moth sail': C('a live moth resting on the tallest mast with its wings out like a second sail', /live moth resting/i),
  'foam mountain': C('a mound of stream foam ahead of the pack as high as a mast that the lead hull ploughs straight into', /mound of stream foam/i),
  'dandelion life-ring': C('a dandelion seed head floating as a life-ring beside the coracle', /life-ring/i),
  'fish nudging the raft': C('a small fish nudging the raft from below and pushing it half a length', /fish nudging/i),
  'shadow of a heron': C('the long shadow of a heron\'s leg standing in the shallows that the whole fleet steers between', /heron\'s leg/i),
  'seed-pod cannon': C('a touch-me-not seed pod on the bank bursting and peppering the fleet with seeds', /touch-me-not/i),
  'raindrop splash crown': C('a raindrop striking beside the outrigger and throwing up a crown of water taller than its mast', /crown of water/i),
  'leaf gate': C('a gate made of two leaves pegged into the bed that the fleet must pass through single file', /gate made of two leaves/i),
  'tadpole tow': C('a hazelnut shell towed by a tadpole on a thread and wandering off course', /towed by a tadpole/i),
  'bee-loud bank': C('a bank of clover roaring with bees so loud the fae cover their ears as they pass', /roaring with bees/i),
  'fern shade line': C('the shade line of a fern frond lying across the course like a finish tape', /shade line/i),
  'spilled berries': C('a spilled cargo of red berries bobbing between the hulls', /spilled cargo of red berries/i),
  'kingcup finish': C('a kingcup flower on the bank blazing gold over the finish', /kingcup/i),
};
const ORIGINAL_CHARMS = Object.keys(CHARMS).slice(0, 24);

function parse(text) {
  let charm = 'thing';
  let at = Infinity;
  for (const [k, v] of Object.entries(CHARMS)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; charm = k; }
  }
  let lead = 'hull';
  let first = Infinity;
  for (const [k, re] of Object.entries(HULLS)) {
    const m = text.match(re);
    if (m && m.index < first) { first = m.index; lead = k; }
  }
  return { keys: [`charm:${charm}`, `lead:${lead}`], charm, lead };
}
const sameGroup = (a, b) => a.charm === b.charm && a.lead === b.lead;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['fleet']));
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
  const charmUsed = (c) => groups.some((g) => get(g).charm === c);
  const free = shuffle(Object.keys(CHARMS).filter((c) => !ORIGINAL_CHARMS.includes(c) && !charmUsed(c)));
  if (!free.length) return null;
  const charm = free[0];
  const hulls = byUsage(shuffle(Object.keys(HULLS)), usage, (k) => 'lead:' + k);
  const lead = hulls[0];
  const others = shuffle(Object.keys(HULLS).filter((h) => h !== lead)).slice(0, 4 + (Math.random() < 0.4 ? 1 : 0));
  const rig = () => spread(RIGS);
  const col = () => spread(COLOURS);
  const hullLine = (h) => HULL_WORDS[h].replace('<colour>', col()) + ' ' + rig();
  return {
    keys: [`charm:${charm}`, `lead:${lead}`],
    charm,
    lead,
    hullLines: [hullLine(lead), ...others.map(hullLine)],
    charmWords: CHARMS[charm].words,
    tags: [charm, lead],
  };
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted-fae bot: FaeBot's acorn-boat-regatta path, the FLEET axis: five or six little boats racing abreast on a woodland stream, each hull a found thing at fae scale, the hero of the picture. Every entry is ONE fleet in 72-94 words.

Examples already in the pool (match their voice, structure and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Name the boats in the slot's order, the FIRST hull first, each with its colour and its sail or rowing or poling as given (reword freely, keep every hull's kind), a fae aboard one or two of them in a word or two (hair, a leaning stance); then a dash and the slot's odd thing, told as the examples tell theirs ("— the charm: …" or a plain dashed clause).
- Fae scale throughout: a pebble is a cliff, a leaf is a roof, a dragonfly is a tug. Colours as paint names (copper-red, moss-green, plum, marigold, scarlet, cream, amber, cobalt). Never a painted symbol, letter or number on a hull. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. hulls: ${a.hullLines.map((h, j) => `(${j + 1}) ${h}`).join('; ')}; odd thing: "${a.charmWords}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An|Five|Six|Four) .{380,}$/;
const BANS = [
  ['text', /\b(letter|letters|number|numbers|lettering|painted symbol|logo|flag with|writing)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.charm !== a.charm) p.push(`charm ${parsed.charm}≠${a.charm}`);
  if (parsed.lead !== a.lead) p.push(`lead ${parsed.lead}≠${a.lead}`);
  const words = cand.split(/\s+/).length;
  if (words < 65 || words > 100) p.push(`${words} words`);
  const hullsFound = Object.values(HULLS).filter((re) => re.test(cand)).length;
  if (hullsFound < 4) p.push(`only ${hullsFound} hull kinds`);
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { charm: t('charm'), lead: t('lead') };
}

module.exports = {
  name: 'faebot/acorn_boat_regatta/boat_fleet',
  poolFile,
  basis: 'fleet = the one odd thing (the charm event) + the lead hull kind; same when both match; greedy, pool order (the other hulls, colours and rigs are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [400, 700],
  HULLS,
  CHARMS,
};
