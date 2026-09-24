/* global __dirname */
/**
 * dinobot / amber-forest / amber_grove (Track B: GROW from 25 to 100+) — THE HERO of the path: the
 * resin forest as a PLACE and its optics. Every entry: "<A grove FORM> of <conifer kind>, <what the
 * resin is doing on the trunks: sheets, threads, nodules, pools, a bridge>, <the understory and
 * litter>, seen from <vantage>" — 42-61 words, one sentence, no full stop. Science-true Mesozoic
 * conifers (Araucaria monkey-puzzle, Agathis kauri, Cheirolepid, podocarp, ginkgo, cycad, tree fern,
 * horsetail), never a modern pine or oak; no animal (the resident axis).
 *
 * Same idea = the grove FORM + the RESIN FEATURE. The 25 originals are kept byte-identical; each new
 * entry takes an unused (form, resin feature) pair with a conifer kind, an understory and a vantage
 * as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_amber_grove.json');

const F = (body, re) => ({ body, re });
const FORMS = {
  colonnade: F('a colonnade of <conifer> receding in uneven ranks, wildly mismatched girths', /colonnade/i),
  'one colossal trunk': F('one colossal <conifer> filling most of the frame', /one colossal/i),
  'leaning slope grove': F('a leaning crooked grove of <conifer> on a steep slope, every trunk tilted the same way', /leaning (?:crooked )?grove|slope grove/i),
  'blowdown tangle': F('a blowdown tangle where a giant <conifer> has come over, its snapped stump standing', /blowdown/i),
  'narrow gap': F('a narrow gap between two close <conifer>', /narrow gap|a gap between two/i),
  'stepped terrace': F('a terrace of stepped ground descending in three levels, <conifer> standing at each step', /terrace/i),
  'nodule clearing': F('a clearing floor deep in hardened resin nodules, a ring of <conifer> around the edge', /clearing floor/i),
  'creek through roots': F('a shallow creek cutting through exposed <conifer> roots', /creek/i),
  'hollow burnt giant': F('a hollow burnt-out <conifer> giant still standing, the scorched flank black and open', /hollow (?:burnt-out |)(?:\w+ )?giant/i),
  'dense understory': F('a dense understory of tree ferns and cycads under tall <conifer> whose canopy nearly closes above', /dense understory/i),
  // ── new grove forms ──
  'ridge line': F('a ridge line of <conifer> standing against pale sky, the ground falling away on both sides', /ridge line/i),
  'swamp margin': F('a swamp margin where <conifer> stand in black still water on flared root-flanges', /swamp margin/i),
  'twin giants': F('two giant <conifer> grown so close their trunks have fused at the base into one buttressed wall', /twin giants|fused at the base/i),
  'lightning-split trunk': F('a <conifer> split top to bottom by lightning, both halves still alive and leaning apart', /lightning-split|split top to bottom/i),
  'root cathedral': F('a cathedral of exposed <conifer> roots arching over a hollow where the soil has washed away', /root cathedral|cathedral of exposed/i),
  'hillside stand': F('a hillside stand of <conifer> seen across a shallow valley, every crown level with the next', /hillside stand/i),
  'fallen bridge trunk': F('a fallen <conifer> trunk bridging a gully with young trees growing along its top', /bridging a gully|fallen bridge trunk/i),
  'mist hollow': F('a hollow between <conifer> where ground mist lies knee-deep and the trunks rise out of it', /mist hollow|ground mist/i),
  'boulder grove': F('a grove of <conifer> grown among house-sized boulders, roots gripping the rock', /boulder grove|house-sized boulders/i),
  'stream-bank giants': F('a row of <conifer> giants along a stream bank, their roots undercut and hanging over the water', /stream bank|stream-bank/i),
  'sapling nursery': F('a nursery of <conifer> saplings crowding the floor beneath one old parent trunk', /nursery of|sapling nursery/i),
  'burned clearing': F('a burned clearing of standing black <conifer> snags with green shoots at every base', /burned clearing|standing black/i),
  'cliff-edge stand': F('a stand of <conifer> at the lip of a cliff, the last roots knotted over the drop', /cliff-edge|lip of a cliff/i),
  'ash-dusted grove': F('a grove of <conifer> dusted grey with volcanic ash on every upper surface', /ash-dusted|volcanic ash/i),
  'lake-shore ring': F('a ring of <conifer> around a small forest lake, their reflections whole in the still water', /lake-shore ring|around a small forest lake/i),
  'wind-thrown row': F('a row of <conifer> half wind-thrown, leaning at a shared angle with root-plates lifting', /wind-thrown/i),
  'canopy gap': F('a canopy gap where one <conifer> has fallen and a column of light reaches the floor', /canopy gap|column of light/i),
  'cone-fall floor': F('a floor buried in fallen <conifer> cones under a close ring of trunks', /cone-fall|buried in fallen/i),
  'termite-mound grove': F('a grove of <conifer> among tall termite mounds of red earth', /termite/i),
  'stump field': F('a field of old <conifer> stumps, each one weeping and each one crowned with a young tree', /stump field|field of old/i),
};
const R = (body, re) => ({ body, re });
const RESINS = {
  'organ-pipe ribs': R('vertical resin flows hardened into organ-pipe ribs', /organ-pipe/i),
  'wet amber sheets': R('thick amber sheets still wet at the leading edge', /amber sheets|wet sheets|broad wet sheets/i),
  'runnels down the low side': R('resin pooling and running down the low side of each trunk in thick runnels', /runnels/i),
  'weeping stump': R('the snapped stump weeping resin', /weeping/i),
  'resin threads': R('thin resin threads strung across the gap catching lateral light', /resin threads|hanging strands|bead-chains/i),
  'joined flows': R('flows from the upper trunks joining the lower ones at each drop', /joining the lower|joined flows/i),
  'nodules like marbles': R('hardened resin nodules scattered like marbles', /nodules/i),
  'rolled lumps in the creek': R('smooth resin lumps rolled like river pebbles in the creek bed', /resin lumps|lumps rolled/i),
  'boiling from char': R('fresh resin boiling out of the char in bright orange runs', /boiling/i),
  'dripping beads': R('resin dripping from high branches and landing in bright beads', /dripping from high|bright beads/i),
  'continuous glaze': R('a whole flank worn smooth into a single continuous glaze', /continuous glaze/i),
  'beetle-bore blister': R('a beetle-bored hole with a fresh bead of resin swelling out like a blister', /beetle-bored|blister/i),
  'claw-scored scar': R('claw-scores raked across a wide resin scar still filling slowly', /claw-scores|claw-scored/i),
  'sapling in a cemented crack': R('a sapling growing straight out of a resin-cemented crack', /resin-cemented/i),
  'frozen curtain ledge': R('flows hardened over an edge into a frozen curtain and a resin ledge', /frozen curtain|resin ledge/i),
  'broad flow ledge': R('an old flow hardened into a broad ledge a metre off the ground', /broad ledge/i),
  'algae-green lump': R('one lump pale green where algae has taken the surface', /algae/i),
  'interior curtain': R('resin running down the interior wall in a bright curtain', /interior wall|bright curtain/i),
  'corrugated ribs': R('a row of old flows hardened into raised ribs like a corrugated flank', /corrugated/i),
  'mid-sized flow only': R('resin flowing only from the mid-sized trunks, leaving the extremes dry', /mid-sized trunks/i),
  'buried bark skin': R('resin accumulated so deep the bark is buried under a translucent skin', /translucent skin|buried under/i),
  'drip-ledge in the crook': R('resin collecting in the crook where trunk meets slope and building a drip-ledge', /drip-ledge/i),
  'pooling lake': R('resin from two stumps meeting on the ground and pooling in a broad slow lake', /slow lake|pooling in a broad/i),
  'resin bridge bar': R('resin from two trunks bridged across into a horizontal bar', /horizontal bar|bridged across/i),
  // ── new resin features ──
  'stalactite drips': R('resin hanging from a low branch in long stalactite drips almost reaching the litter', /stalactite/i),
  'insect trapped mid-flow': R('a dragonfly held mid-flow in a clear sheet on the nearest trunk', /dragonfly held|held mid-flow/i),
  'sun-through amber': R('a hardened sheet on the sunward side glowing like stained glass with the light behind it', /stained glass|light behind it/i),
  'resin icicles': R('a fringe of resin icicles along the underside of a horizontal limb', /resin icicles/i),
  'cracked nodule crystal': R('one cracked nodule showing a clouded crystal interior', /clouded (?:crystal )?interior/i),
  'flow over moss': R('a fresh flow spreading over a moss cushion and gilding every stem', /over a moss cushion|gilding/i),
  'resin-glued cone': R('a fallen cone glued fast to the bark by a flow that has closed round it', /glued fast|closed round/i),
  'stringy web': R('resin strung between three trunks in a stringy web catching every drifting seed', /stringy web/i),
  'resin puddle mirror': R('a puddle of fresh resin on the litter holding a mirror of the canopy', /puddle of fresh resin|mirror of the canopy/i),
  'layered rings': R('an old scar built up in layered rings of resin like a tree-stump cross-section', /layered rings/i),
  'resin-capped stump': R('a low stump capped entirely in a dome of hardened amber', /dome of hardened amber|resin-capped/i),
  'fern pressed in': R('a fern frond pressed into a sheet on the trunk and held there', /fern frond pressed/i),
  'resin and rain': R('rain beading on a fresh sheet in silver drops that refuse to mix', /rain beading|silver drops/i),
  'sheet peeling': R('an old sheet peeling from the bark in a curl like shed skin', /peeling from the bark|like shed skin/i),
  'resin waterfall': R('a flow pouring over a root buttress in a slow amber waterfall', /amber waterfall/i),
  'twin flows meeting': R('two flows down one trunk meeting at a knot and running on as one', /meeting at a knot/i),
  'resin on bones': R('a hardened flow over a small pale bone at the trunk foot', /over a small pale bone/i),
  'resin-filled hollow': R('a hollow in the trunk filled level with clear resin like a window', /filled level|like a window/i),
  'crystal-clear bead': R('one bead of resin the size of a fist hanging clear as glass from a snag', /size of a fist|clear as glass/i),
  'ant column in resin': R('a column of ants crossing a fresh flow and sticking one by one', /column of ants/i),
};
const CONIFERS = ['Araucaria monkey-puzzles', 'Agathis-like kauri giants', 'Cheirolepid conifers', 'scaly-barked podocarps', 'tall cycad-crowned conifers', 'Araucaria with whorled branch-tips', 'thick-buttressed kauri', 'young Cheirolepid conifers'];
const FLOORS = ['cone-littered litter underfoot', 'deep rust needle-litter below', 'emerald moss cushions along the roots', 'horsetails at the base of each trunk', 'bare grey mud in the open ground', 'cycads pushing up in the new light', 'tree ferns small behind', 'a ginkgo with lime-green fan-leaves at the edge', 'silver lichen across the north-facing bark', 'blue-grey depth between trunks beyond'];
const VANTAGES = ['seen along the colonnade from between two trunks', 'seen from low at the base looking up', 'seen from the litter looking up the slope', 'seen from the edge of the root crater looking across', 'seen from outside looking through the hanging strands', 'seen from the highest step looking down', 'seen low across the nodule floor', 'seen from the creek bed looking upstream', 'seen from inside the hollow looking out', 'seen from the fern floor looking up through layered fronds', 'seen from midway along at trunk height', 'seen from a step back at mid-trunk', 'seen from upslope looking down the leaning ranks', 'seen from ground level looking up between fronds'];

const first = (rules, text) => {
  let best = null;
  let at = Infinity;
  for (const [k, v] of Object.entries(rules)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
};
function parse(text) {
  const form = first(FORMS, text) || 'grove';
  const resin = first(RESINS, text) || 'resin';
  return { keys: [`form:${form}`, `resin:${resin}`], form, resin };
}
const sameGroup = (a, b) => a.form === b.form && a.resin === b.resin;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['grove']));
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
  const used = (f, r) => groups.some((g) => get(g).form === f && get(g).resin === r);
  const rUsed = (r) => groups.filter((g) => get(g).resin === r).length;
  const forms = byUsage(shuffle(Object.keys(FORMS)), usage, (k) => 'form:' + k);
  for (const form of forms) {
    const resins = shuffle(Object.keys(RESINS)).filter((r) => rUsed(r) < 3 && !used(form, r)).sort((a, b) => rUsed(a) - rUsed(b));
    if (!resins.length) continue;
    const resin = resins[0];
    return {
      keys: [`form:${form}`, `resin:${resin}`],
      form,
      resin,
      formWords: FORMS[form].body.replace('<conifer>', spread(CONIFERS)),
      resinWords: RESINS[resin].body,
      floor: spread(FLOORS),
      vantage: spread(VANTAGES),
      tags: [form, resin],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's amber-forest path, the GROVE axis: a living Mesozoic resin forest as a place, the hero of the picture. Every entry is ONE grove in 42-60 words, one sentence with commas and no full stop, ending with the vantage.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the grove form in the slot's own words with its conifer kind (bark colour, needle shade, girth); the slot's resin feature in your own words (what the resin is DOING, its colour and wetness); the slot's floor detail; the slot's vantage last.
- Science-true Mesozoic plants only: Araucaria, Agathis kauri, Cheirolepid, podocarp, ginkgo, cycad, tree fern, horsetail, moss, lichen. No animal at all, no bones of a meal, no sky weather. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. grove: "${a.formWords}"; resin: "${a.resinWords}"; floor: "${a.floor}"; vantage: "${a.vantage}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An|One|Two|The) [^.]{230,}[^.]$/;
const BANS = [
  ['animal', /\b(dinosaur|dinosaurs|raptor|theropod|sauropod|ceratopsian|hadrosaur|bird|birds|lizard|frog)\b/i],
  ['modern', /\b(oak|oaks|birch|maple|spruce|redwood|palm|palms)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.form !== a.form) p.push(`form ${parsed.form}≠${a.form}`);
  if (parsed.resin !== a.resin) p.push(`resin ${parsed.resin}≠${a.resin}`);
  const words = cand.split(/\s+/).length;
  if (words < 38 || words > 68) p.push(`${words} words`);
  if (!/resin|amber|flow|sheet|sap\b/i.test(cand)) p.push('no resin');
  if (!/seen /i.test(cand)) p.push('no vantage');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { form: t('form'), resin: t('resin') };
}

module.exports = {
  name: 'dinobot/amber_forest/amber_grove',
  poolFile,
  basis: 'grove = the grove FORM + the resin feature; same when both match; greedy, pool order (conifer kind, floor and vantage are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [240, 460],
  FORMS,
  RESINS,
};
