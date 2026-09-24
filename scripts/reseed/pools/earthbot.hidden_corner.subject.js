/* global __dirname */
/**
 * earthbot / hidden-corner / subject — ONE off-the-beaten-path secret pocket of nature per entry.
 *
 * What the pool IS (kept): string entries, 45-90 words: "A <pocket type> <where it hides> — <four to
 * six lush, real, packed details: moss + ferns + water + stones + several named plants>". INTIMATE
 * mid-tight framing, real Earth only, no named places, nothing built, no people, no wide vistas, no
 * bioluminescence / aurora / "fire". Recipe: scripts/gen-seeds/earthbot/gen-hidden-corner-subject.js
 * (12 pocket types, LUSH mandate).
 *
 * What was wrong (2026-09-23): 200 entries = the 12 recipe types × the same few habitats × the same
 * plant list (sword fern, maidenhair, cushion moss, sea stars): "A hidden creek bend…" ×18, "A mossy log
 * nook…" ×16, "An ancient root pocket…" ×16, "A hidden pond edge…" ×16, and so on.
 *
 * The varying element = the POCKET: its TYPE + the HABITAT it hides in + the HOST feature that shelters
 * it. Same idea = all three match. Rewrites pre-assign the three (each pair real: a tide pool only on a
 * coast, a canyon alcove only in stone country), plus a signature-plant family and a water note as
 * flavour; the LLM only words it.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/earthbot/seeds/hidden_corner_subject.json');

// ── Rosters ─────────────────────────────────────────────────────────────────────────────────────
const TYPE = {
  'creek bend': 'hidden creek bend',
  'fern grotto': 'fern grotto',
  'waterfall pool': 'small unmapped waterfall pool',
  'tide pool': 'secret tide-pool pocket',
  glade: 'sun-shaft glade',
  'wildflower cove': 'wildflower cove',
  'log nook': 'mossy log nook',
  'root pocket': 'ancient root pocket',
  'canyon alcove': 'damp canyon alcove',
  'pond edge': 'hidden pond edge',
  'spring source': 'spring source',
  'boulder hollow': 'boulder-sheltered hollow',
};
// habitats: real plant / stone vocabulary per habitat so the LLM stays in one ecology
const HABITAT = {
  'temperate rainforest': {
    weight: 4,
    plants: 'sword fern, deer fern, maidenhair, cushion moss, vine maple, salmonberry, devil\'s club, licorice fern',
    stone: 'basalt cobbles, nurse logs, Sitka spruce and hemlock trunks',
  },
  'old-growth conifer': {
    weight: 3,
    plants: 'bracken, twinflower, oxalis, bunchberry, huckleberry, feather moss, lichen',
    stone: 'Douglas-fir and red-cedar trunks, granite boulders',
  },
  'deciduous hardwood': {
    weight: 3,
    plants: 'foam-flower, wild ginger, trillium, bloodroot, Christmas fern, spicebush, hepatica',
    stone: 'oak, hickory, tulip-poplar and beech trunks, sandstone slabs, shale',
  },
  'cloud forest': {
    weight: 2,
    plants: 'tree ferns, filmy ferns, epiphytic orchids, bromeliads, begonias, selaginella, liverworts',
    stone: 'buttressed trunks, wet volcanic rock',
  },
  'desert canyon': {
    weight: 3,
    plants: 'maidenhair fern, monkeyflower, columbine, cottonwood, willow, moss on seep walls',
    stone: 'sandstone alcove walls, slickrock, chert cobbles',
  },
  'rocky coast': {
    weight: 3,
    plants: 'kelp, coralline algae, sea lettuce, rockweed, sea thrift on the rim',
    stone: 'granite or basalt shelves, barnacle-crusted boulders, anemones, sea stars, urchins',
  },
  subalpine: {
    weight: 2,
    plants: 'heather, paintbrush, lupine, glacier lily, mountain hemlock, saxifrage',
    stone: 'granite boulders, snowmelt tarns, talus',
  },
  boreal: {
    weight: 2,
    plants: 'sphagnum, Labrador tea, cloudberry, reindeer lichen, black spruce, horsetail',
    stone: 'glacial erratics, peat',
  },
  wetland: {
    weight: 2,
    plants: 'lily pads, cattails, sundew, pitcher plants, sphagnum, bald cypress, sweetflag',
    stone: 'peat banks, cypress knees, tannin-dark water',
  },
  'mediterranean scrub': {
    weight: 1,
    plants: 'holm oak, myrtle, rockrose, wild thyme, ivy, maidenhair by the spring',
    stone: 'limestone, karst hollows, travertine',
  },
  'lava field': {
    weight: 1,
    plants: 'ohia, hapuu tree fern, moss on lava, kupukupu fern',
    stone: 'black pāhoehoe, collapsed lava-tube skylights, cinder',
  },
  'prairie edge': {
    weight: 1,
    plants: 'big bluestem, coneflower, blazing star, wild bergamot, cottonwood by the water',
    stone: 'limestone ledges, a spring-fed creek',
  },
};
const HOST = {
  'root plate': 'the lifted root plate of a toppled giant',
  'fallen log': 'a fallen old-growth trunk',
  boulder: 'a house-sized boulder',
  outcrop: 'a dripping rock outcrop',
  'canyon wall': 'an undercut canyon wall',
  ledge: 'a mossy ledge under an overhang',
  ridge: 'a fold behind a low ridge',
  'stream bank': 'a cut stream bank',
  'cliff notch': 'a notch in a sea cliff',
  thicket: 'a dense thicket that hides it from every side',
  'sinkhole rim': 'the rim of a shallow sinkhole',
  'tree cluster': 'the bases of three ancient trunks',
};
// which types make sense in which habitats
const TYPE_HABITATS = {
  'creek bend': ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'subalpine', 'boreal', 'prairie edge', 'desert canyon'],
  'fern grotto': ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'desert canyon', 'mediterranean scrub', 'lava field'],
  'waterfall pool': ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'desert canyon', 'subalpine', 'lava field'],
  'tide pool': ['rocky coast'],
  glade: ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'boreal', 'mediterranean scrub'],
  'wildflower cove': ['subalpine', 'deciduous hardwood', 'prairie edge', 'mediterranean scrub', 'old-growth conifer'],
  'log nook': ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'boreal'],
  'root pocket': ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'wetland'],
  'canyon alcove': ['desert canyon', 'lava field', 'mediterranean scrub'],
  'pond edge': ['wetland', 'boreal', 'deciduous hardwood', 'prairie edge', 'subalpine'],
  'spring source': ['temperate rainforest', 'deciduous hardwood', 'desert canyon', 'mediterranean scrub', 'boreal', 'prairie edge', 'subalpine', 'wetland'],
  'boulder hollow': ['subalpine', 'old-growth conifer', 'temperate rainforest', 'rocky coast', 'lava field'],
};
const TYPE_HOSTS = {
  'tide pool': ['cliff notch', 'boulder', 'ledge', 'outcrop'],
  'canyon alcove': ['canyon wall', 'ledge', 'outcrop'],
  'root pocket': ['root plate', 'tree cluster'],
  'log nook': ['fallen log'],
  'boulder hollow': ['boulder'],
};
const WATER = [
  'a slow jade pool',
  'a thin cold seep beading on every surface',
  'a braid of clear water over pebbles',
  'still tannin-dark water',
  'a mirror of shallow water at the base',
  'droplets falling from the lip into a basin',
  'a spring welling up through sand',
  'wet stone shining under a film of water',
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
// The opening clause names the type; specific phrases first, and "creek" last because a pond or a
// spring entry often mentions a creek in passing.
const TYPE_RULES = [
  ['tide pool', /tide[- ]pool/i],
  ['root pocket', /root pocket|root plate|root cluster|root hollow/i],
  ['log nook', /log nook|log clearing/i],
  ['fern grotto', /grotto|fern hollow/i],
  ['canyon alcove', /canyon alcove|damp alcove|sandstone alcove|alcove/i],
  ['waterfall pool', /waterfall|cascade|plunge pool/i],
  ['pond edge', /pond edge|pond\b|still-water edge/i],
  ['spring source', /spring source|seep(?:age)? (?:source|hollow|wall)|spring (?:welling|emerging|pushing|seeping|rising)/i],
  ['wildflower cove', /wildflower cove|wildflower pocket|\bcove\b/i],
  ['glade', /glade|clearing|sun-shaft/i],
  ['boulder hollow', /boulder-sheltered|boulder hollow/i],
  ['creek bend', /creek bend|stream bend|creek|brook/i],
  ['log nook', /fallen log|toppled/i],
];
const HABITAT_RULES = [
  ['rocky coast', /tide[- ]pool|sea star|anemone|kelp|urchin|barnacle|rocky cove|sea cliff|coralline/i],
  ['lava field', /lava|pāhoehoe|pahoehoe|ohia|ʻōhiʻa|cinder|volcanic tube/i],
  ['mediterranean scrub', /holm oak|myrtle|rockrose|thyme|maquis|karst|travertine|olive|mediterranean/i],
  ['desert canyon', /sandstone|slickrock|desert|slot|Navajo|chert|seep wall/i],
  ['cloud forest', /cloud forest|tree fern|epiphyt|bromeliad|tropical|jungle|(?<!temperate )rainforest/i],
  ['wetland', /cypress|swamp|sphagnum bog|pitcher plant|sundew|marsh|fen\b|bog\b|lily pad|cattail/i],
  ['subalpine', /subalpine|alpine|tarn|heather|glacier lily|paintbrush|talus|cirque/i],
  ['boreal', /boreal|taiga|black spruce|cloudberry|reindeer lichen|Labrador tea/i],
  ['prairie edge', /prairie|bluestem|coneflower|grassland/i],
  ['temperate rainforest', /temperate rainforest|sword fern|deer fern|vine maple|salmonberry|Sitka|hemlock|nurse log|devil's club|licorice fern|old-growth temperate/i],
  ['deciduous hardwood', /oak|hickory|maple|beech|tulip|poplar|magnolia|hardwood|deciduous|trillium|bloodroot|wild ginger|foam-flower|hepatica|spicebush/i],
  ['old-growth conifer', /old-growth|conifer|Douglas-fir|red-cedar|redcedar|pine|fir\b|spruce|bunchberry|twinflower|feather moss/i],
];
const HOST_RULES = [
  ['root plate', /root plate|root pocket|root cluster/i],
  ['fallen log', /fallen|toppled|log nook|nurse log|downed/i],
  ['canyon wall', /canyon wall|alcove wall|undercut|slot/i],
  ['cliff notch', /cliff notch|sea-carved|notch|sea cliff/i],
  ['sinkhole rim', /sinkhole|doline/i],
  ['tree cluster', /three ancient|between two ancient|trunk cluster|between .* trunks|bases of/i],
  ['thicket', /thicket|dense .* hides|screen of|screened by/i],
  ['boulder', /boulder/i],
  ['outcrop', /outcrop|gneiss|bedrock knob/i],
  ['ledge', /ledge|overhang|shelf/i],
  ['ridge', /ridge|knoll|fold/i],
  ['stream bank', /cut bank|stream bank|creek bank|banks?\b/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
// The opening clause (before the em dash) names the pocket type and where it hides; the details after
// it mention every kind of stone and plant, so type and host are read from the head only.
const headOf = (text) => text.split(/ — |—/)[0];
function parse(text) {
  const head = headOf(text);
  const type = pick(TYPE_RULES, head, 'pocket');
  const habitat = pick(HABITAT_RULES, text, 'forest');
  const host = pick(HOST_RULES, head, 'ground');
  return { keys: [`type:${type}`, `habitat:${habitat}`, `host:${host}`], type, habitat, host };
}
function sameGroup(a, b) {
  return a.type === b.type && a.habitat === b.habitat && a.host === b.host;
}

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['pocket']));
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
    const type = among(
      byUsage(Object.keys(TYPE), usage, (k) => 'type:' + k),
      4
    );
    const habitats = TYPE_HABITATS[type];
    const habitat = among(
      shuffle(habitats).sort(
        (x, y) =>
          (usage['habitat:' + x] || 0) / HABITAT[x].weight -
          (usage['habitat:' + y] || 0) / HABITAT[y].weight
      ),
      3
    );
    const hosts = TYPE_HOSTS[type] || Object.keys(HOST).filter((h) => !['cliff notch', 'canyon wall', 'root plate', 'fallen log'].includes(h) || (h === 'canyon wall' && habitat === 'desert canyon') || (h === 'cliff notch' && habitat === 'rocky coast'));
    const host = among(
      byUsage(hosts, usage, (k) => 'host:' + k),
      3
    );
    const cand = { type, habitat, host };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    return {
      keys: [`type:${type}`, `habitat:${habitat}`, `host:${host}`],
      type,
      habitat,
      host,
      water: spread(WATER),
      tags: [type, habitat, host],
    };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a landscape-photography bot: EarthBot hidden-corner, the off-the-beaten-path secret pocket of nature you stumble into miles from any trail. Every entry is ONE intimate, LUSH pocket in 50-80 words: "A <pocket type> <where it hides> — <four to six packed real details: moss, ferns, water, stone and several NAMED plants of that habitat>". Keep EXACTLY this shape and the em dash after the opening clause.

Examples already in the pool (match their voice, density and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the pocket type, habitat, host feature and water note given for the slot, in your own natural wording; name at least four plants or animals that are REAL in that habitat (use the habitat's own list) and the habitat's own stone. Every element must belong to that one ecology.
- Intimate mid-tight framing: the pocket fills the frame; no vistas, no ridgelines, no sky as subject.
- Real Earth, nothing named (no park, region or place names), nothing built (no cabin, bridge, fence, steps, path, sign), no people or footprints, no glow of any kind, no "fire". Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    const h = HABITAT[a.habitat];
    return `${i + 1}. pocket type "${TYPE[a.type]}"; habitat "${a.habitat}" (plants: ${h.plants}; stone: ${h.stone}); host feature "${HOST[a.host]}"; water "${a.water}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
const formatRe = /^(?:A|An) [^—]{15,140} — .{150,}$/;
const BANS = [
  ['glow', /\b(bioluminescent|phosphorescent|foxfire|glowing|glow|luminous|aurora|nacreous|iridescent|sun-dog|fire-rainbow)\b/i],
  ['unreal', /\b(portal|mystical|magical|enchanted|fantasy|sci-fi|otherworldly|ethereal)\b/i],
  ['built', /\b(cabin|bridge|fence|steps|path|trail|signage|sign|bench|wall of stone blocks|boardwalk|road)\b/i],
  ['person', /\b(person|people|footprints|hiker|figure|boots|clothing)\b/i],
  ['named', /\b(National Park|Olympic|Yosemite|Redwood|Appalachian|Smoky|Cascades|Rockies|Hawaii|Oregon|Washington|Tasmania|Amazon|Borneo|Costa Rica|Scotland|Wales|Ireland|Norway|Japan)\b/i],
  ['vista', /\b(panorama|vista|ridgeline|mountain range|skyline|horizon)\b/i],
  ['fire', /\bfire\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  // The ASSIGNED type must open the entry and the ASSIGNED habitat's own words must be present.
  const typeRe = TYPE_RULES.find(([k]) => k === a.type)[1];
  if (!typeRe.test(cand.split(/ — |—/)[0])) p.push(`type words missing (${a.type})`);
  if (!HABITAT_RULES.find(([k]) => k === a.habitat)[1].test(cand))
    p.push(`habitat words missing (${a.habitat})`);
  const words = cand.split(/\s+/).length;
  if (words < 40 || words > 95) p.push(`${words} words`);
  // the LUSH mandate's moss + fern check applies to the forest habitats (a desert seep says "maidenhair",
  // a bog says "sphagnum", a tide pool says "kelp")
  const FOREST = ['temperate rainforest', 'old-growth conifer', 'deciduous hardwood', 'cloud forest', 'boreal'];
  if (FOREST.includes(a.habitat) && !/moss|fern|lichen/i.test(cand)) p.push('no moss or fern');
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
  return { type: t('type'), habitat: t('habitat'), host: t('host') };
}

module.exports = {
  name: 'earthbot/hidden_corner/subject',
  poolFile,
  basis:
    'pocket = type + habitat + host feature; same when all three match; greedy, pool order (water note is flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [280, 700],
};
