/**
 * faeAnchorPool.js — config factory for FaeBot "foreground anchor" pools (forest-fairy-scene,
 * dryad-portrait, enchanted-vista, …): ONE tactile foreground element between the camera and the
 * subject, 20-40 words: its kind, its position in the frame, a tactile detail, and the path's framing
 * clause ("framing her without blocking" / "framing the scene"). No creature, no biome, no weather, no
 * lighting, no modern objects, and (playbook 2026-07-01) nothing glowing or bioluminescent.
 *
 * The varying element = the ANCHOR: its KIND (what real forest thing it is) + its POSITION in the
 * frame. Same idea = both match. Rewrites pre-assign kind + position (least-used first) and a tactile
 * detail as flavour; the LLM only words it. Per pool: the register prefix ("Painted …" on the portrait
 * pools), the framing clause, and the word band.
 */
const { shuffle, byUsage } = require('./core');

// Real forest foreground things a fae-storybook painter would put between the camera and the subject.
const KINDS = {
  'vine curtain': 'hanging vine-curtain with bloom-laden tendrils',
  ivy: 'hanging ivy-vines with lobed leaves',
  wisteria: 'wisteria racemes hanging in violet cascade',
  honeysuckle: 'honeysuckle tendrils with cream-and-coral trumpets',
  clematis: 'clematis vine with starry white blooms',
  bramble: 'arching bramble cane with ripening blackberries',
  'wild rose': 'wild-rose canes with pale pink blooms',
  willow: 'weeping-willow branches with silver-green leaves',
  'birch catkins': 'birch twigs hung with dangling catkins',
  'hazel catkins': 'hazel branch with yellow catkins',
  'oak bough': 'oak bough with lobed leaves and acorns',
  'maple bough': 'maple bough in red-orange autumn leaf',
  'beech bough': 'beech bough with copper-edged leaves',
  sakura: 'cherry-blossom branch in full pink bloom',
  magnolia: 'magnolia branch with cupped white blooms',
  dogwood: 'dogwood branch with four-petalled white bracts',
  elder: 'elderflower heads in flat cream umbels',
  rowan: 'rowan branch heavy with red berries',
  holly: 'holly sprig with glossy leaves and red berries',
  hawthorn: 'hawthorn branch in white blossom',
  bracken: 'bracken fronds arching in',
  'sword fern': 'sword-fern fronds fanning across',
  maidenhair: 'maidenhair fern with delicate fan-leaflets',
  fiddleheads: 'unfurling fern fiddleheads in tight spirals',
  'moss curtain': 'hanging-moss curtain in soft green strands',
  'lichen branch': 'lichen-crusted dead branch',
  'mossy boulder': 'moss-covered boulder',
  outcrop: 'mossy stone outcrop with small flowers in its cracks',
  root: 'gnarled ancient root crossing the earth',
  'fallen log': 'moss-covered fallen log with small mushrooms',
  'fly agaric': 'cluster of red-and-white spotted toadstools',
  'fairy ring': 'fairy-ring of small pale mushrooms',
  puffballs: 'cluster of round puffball mushrooms',
  'bracket fungi': 'shelf of bracket fungi on a stump',
  foxglove: 'foxglove spires with mottled pink bells',
  bluebells: 'drift of bluebells',
  primrose: 'clump of pale-yellow primroses',
  'wild garlic': 'wild-garlic with white star-flowers',
  meadowsweet: 'meadowsweet plumes in cream froth',
  thistle: 'thistle heads in purple bloom',
  'cow parsley': 'cow-parsley umbels in lacy white',
  'spider web': 'dew-strung spider web between stems',
  'dew leaf': 'dew-beaded leaves catching light',
  'dragonfly wing': 'dragonfly wing-edge with veined transparency',
  'butterfly wing': 'butterfly wing-edge with painted pattern',
  moth: 'pale moth resting on a leaf',
  feather: 'single owl feather caught on a twig',
  'snail shell': 'banded snail shell on a moss cushion',
  acorns: 'acorn cluster on an oak twig',
  pinecones: 'pinecone cluster on a fir bough',
  cattails: 'cattail heads and reed blades',
  'lily pads': 'lily pads with a white water-lily',
  'water iris': 'yellow water-iris at a pool edge',
  'stepping stone': 'wet stepping-stone edge with moss',
  'drifting petals': 'drifting cherry-blossom petals',
  'drifting leaves': 'drifting autumn leaves in red and gold',
  pollen: 'drifting golden pollen',
  'dandelion clocks': 'dandelion seed-heads shedding',
  'thistle down': 'thistle down floating',
  heather: 'heather sprigs in purple bloom',
  lupine: 'lupine spires in blue and pink',
  columbine: 'columbine blooms nodding',
  harebells: 'harebells on thread-thin stems',
  'forget-me-nots': 'forget-me-not cluster in sky-blue',
  'grass seedheads': 'grass seed-heads bowing',
};
const POSITIONS = [
  'in foreground-left',
  'in foreground-right',
  'draping into the upper-left frame from above',
  'draping into the upper-right frame from above',
  'at the lower-left of the frame',
  'at the lower-right of the frame',
  'arching across the bottom of the frame',
  'crossing the foreground',
];
const DETAILS = [
  'moss-covered',
  'dew-beaded',
  'leaf-veined',
  'bloom-laden',
  'lichen-flecked',
  'backlit-translucent',
  'wind-stirred',
  'velvet-textured',
  'petal-strewn',
  'sun-warmed',
];

const KIND_RULES = [
  ['dragonfly wing', /dragonfly/i],
  ['butterfly wing', /butterfly/i],
  ['moth', /\bmoth\b/i],
  ['feather', /feather/i],
  ['snail shell', /snail/i],
  ['spider web', /spider|web\b|cobweb/i],
  ['pollen', /pollen/i],
  ['dandelion clocks', /dandelion/i],
  ['thistle down', /thistle[- ]down|thistledown/i],
  ['drifting petals', /drifting (?:cherry-blossom )?petal|petal-cluster|petal cluster|pink-snow/i],
  ['drifting leaves', /leaf drift|drifting (?:autumn )?leaves|autumn-leaf/i],
  ['wisteria', /wisteria/i],
  ['honeysuckle', /honeysuckle/i],
  ['clematis', /clematis/i],
  ['bramble', /bramble|blackberr/i],
  ['wild rose', /wild-rose|wild rose|rose cane/i],
  ['willow', /willow/i],
  ['ivy', /\bivy/i],
  ['vine curtain', /vine/i],
  ['birch catkins', /birch|catkin/i],
  ['hazel catkins', /hazel/i],
  ['maple bough', /maple/i],
  ['beech bough', /beech/i],
  ['oak bough', /oak (?:bough|branch|leaf|leaves)|acorn-laden/i],
  ['sakura', /cherry-blossom branch|sakura|cherry branch|blossom branch/i],
  ['magnolia', /magnolia/i],
  ['dogwood', /dogwood/i],
  ['elder', /elder/i],
  ['rowan', /rowan/i],
  ['holly', /holly/i],
  ['hawthorn', /hawthorn/i],
  ['fiddleheads', /fiddlehead|unfurling/i],
  ['maidenhair', /maidenhair/i],
  ['bracken', /bracken/i],
  ['sword fern', /fern/i],
  ['moss curtain', /hanging[- ]moss|moss-curtain|moss curtain|moss-cascade|spanish-moss/i],
  ['lichen branch', /lichen/i],
  ['fly agaric', /spotted|fly agaric|red-cap|red-and-white/i],
  ['fairy ring', /fairy-ring|mushroom-ring|mushroom-circle|mushroom ring/i],
  ['puffballs', /puffball/i],
  ['bracket fungi', /bracket/i],
  ['foxglove', /foxglove/i],
  ['bluebells', /bluebell/i],
  ['primrose', /primrose/i],
  ['wild garlic', /wild-garlic|wild garlic|ramson/i],
  ['meadowsweet', /meadowsweet/i],
  ['thistle', /thistle/i],
  ['cow parsley', /cow-parsley|cow parsley|umbel/i],
  ['heather', /heather/i],
  ['lupine', /lupine/i],
  ['columbine', /columbine/i],
  ['harebells', /harebell/i],
  ['forget-me-nots', /forget-me-not/i],
  ['acorns', /acorn/i],
  ['pinecones', /pinecone|pine cone|fir bough/i],
  ['cattails', /cattail|reed/i],
  ['lily pads', /lily[- ]pad|water-lily|water lily/i],
  ['water iris', /iris/i],
  ['stepping stone', /stepping[- ]stone/i],
  ['grass seedheads', /seed-head|seedhead|fern-grass|grass cluster/i],
  // dew is a detail on any kind; only a leaf/petal whose point IS the droplets is this kind
  ['dew leaf', /dewdrop-cluster|dewdrop cluster|dew-covered leaves|dew-beaded leaves|pearl-droplet|dewdrops? on a/i],
  ['fallen log', /fallen log|log\b/i],
  ['root', /\broot/i],
  ['outcrop', /outcrop|stone with|ancient stone/i],
  ['mossy boulder', /boulder|stone/i],
  ['wildflowers', /wildflower|daisies|anemone/i],
  ['mushrooms', /mushroom|toadstool|fung/i],
  ['moss cushion', /moss-cushion|moss cushion|moss-bed|moss bed/i],
  ['branch', /branch|twig|bough/i],
];
const POSITION_RULES = [
  ['draping into the upper-left frame from above', /upper-left|upper left/i],
  ['draping into the upper-right frame from above', /upper-right|upper right/i],
  ['at the lower-left of the frame', /lower-left|lower left/i],
  ['at the lower-right of the frame', /lower-right|lower right/i],
  ['in foreground-left', /foreground-left|foreground left|frame-left/i],
  ['in foreground-right', /foreground-right|foreground right|frame-right/i],
  ['arching across the bottom of the frame', /across the bottom|bottom of the frame|lower frame|lower-frame|across the lower/i],
  ['crossing the foreground', /crossing|across the (?:painted )?foreground|filling the (?:painted )?foreground|immediate foreground|foreground earth|foreground floor|closest foreground/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};

function faeAnchorPool(opts) {
  const {
    name,
    poolFile,
    subject = 'her', // "her" (portrait pools) or "the scene" (vista)
    painted = 'none', // 'all' (every entry opens "Painted"), 'mixed' (about half), 'none'
    outOfFocus = false,
    framing, // the framing clause the pool uses
    wordRange = [16, 45],
    lenBand = [90, 320],
    extraBans = [],
  } = opts;

  function parse(text) {
    const kind = pick(KIND_RULES, text, 'anchor');
    const position = pick(POSITION_RULES, text, 'foreground');
    return { keys: [`kind:${kind}`, `position:${position}`], kind, position };
  }
  const sameGroup = (a, b) => a.kind === b.kind && a.position === b.position;
  const flavourUse = {};
  const spread = (list) => {
    const c = byUsage(list, flavourUse)[0];
    flavourUse[c] = (flavourUse[c] || 0) + 1;
    return c;
  };
  function planSlots({ slots }) {
    slots.forEach((s, i) => {
      s.painted = painted === 'all' || (painted === 'mixed' && i % 2 === 0);
      s.tags = ['anchor'];
    });
  }
  function assign(slot, ctx) {
    const { usage, groups } = ctx;
    const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
    for (let attempt = 0; attempt < 400; attempt++) {
      const kind = among(
        byUsage(Object.keys(KINDS), usage, (k) => 'kind:' + k),
        5
      );
      const position = among(
        byUsage(POSITIONS, usage, (k) => 'position:' + k),
        4
      );
      // drifting things and pollen fill the foreground; roots, logs and stepping stones stay low
      if (/drifting|pollen|dandelion|thistle down/.test(kind) && /upper|arching/.test(position)) continue;
      if (/root|log|stepping|boulder|outcrop|fairy ring|puffballs|bracket/.test(kind) && /upper|draping/.test(position))
        continue;
      const cand = { kind, position };
      if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
      return {
        keys: [`kind:${kind}`, `position:${position}`],
        kind,
        position,
        words: KINDS[kind],
        detail: spread(DETAILS),
        tags: [kind, position],
      };
    }
    return null;
  }
  function brief(batch, examples) {
    return `You write entries for one pool of a painted-storybook fae bot: FaeBot ${name.split('/')[1]}. Every entry is ONE tactile FOREGROUND ANCHOR, the closest thing to the camera, in 18-40 words, one line, comma-separated phrases: the element, its position in the frame, one tactile detail, and how it frames ${subject}${outOfFocus ? ', softly out-of-focus' : ''}. Keep EXACTLY the shape of the examples${painted === 'all' ? ' (every entry opens with "Painted")' : painted === 'mixed' ? ' (an entry marked painted opens with "Painted")' : ''}.

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the element, the position and the tactile detail given for the slot, in your own natural wording; the element's own noun must appear.
- The anchor frames ${subject} and never blocks ${subject === 'her' ? 'her face' : 'the scene'}. Real forest things only, storybook-painted.
- Name no creature, no biome or setting, no weather, no light source, nothing modern, nothing glowing. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. ${s.painted ? 'painted; ' : ''}element "${a.words}"; position "${a.position}"; tactile detail "${a.detail}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
  }
  const formatRe = /^[A-Z].{60,}$/; // the originals end with a period
  const BANS = [
    ['glow', /\b(glow|glowing|bioluminescent|phosphorescent|luminous|firefly|fireflies|sparkle|sparkling|shimmer|shimmering|light-catching)\b/i],
    ['other-axis', /\b(her (?:face|hair|eyes|gown|skin)|creature|fairy|dryad|queen|sunlight|god-rays|mist|fog|rain|snow|dusk|dawn|moonlight)\b/i],
    ['modern', /\b(plastic|wire|fence|lamp|glass|ribbon|string lights)\b/i],
    ['negation', /\b(no|not|never|without|nothing)\b/i],
    ...extraBans,
  ];
  function mechanical(cand, slot) {
    const p = [];
    const a = slot.assignment;
    const parsed = parse(cand);
    if (parsed.kind !== a.kind) p.push(`kind ${parsed.kind}≠${a.kind}`);
    if (parsed.position !== a.position) p.push(`position ${parsed.position}≠${a.position}`);
    if (slot.painted && !/^Painted\b/.test(cand)) p.push('not painted-prefixed');
    if (!slot.painted && painted !== 'none' && /^Painted\b/.test(cand)) p.push('painted-prefixed');
    const words = cand.split(/\s+/).length;
    if (words < wordRange[0] || words > wordRange[1]) p.push(`${words} words`);
    for (const [n, re] of BANS) {
      const m = cand.match(re);
      if (m) p.push(`${n}:"${m[0]}"`);
    }
    return p;
  }
  function measure(pool, parsed) {
    const t = (f) => {
      const o = {};
      parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1));
      return o;
    };
    return { kind: t('kind'), position: t('position') };
  }
  return {
    name,
    poolFile,
    basis: 'anchor = kind + position in frame; same when both match; greedy, pool order (tactile detail is flavour)',
    parse,
    sameGroup,
    planSlots,
    assign,
    brief,
    formatRe,
    mechanical,
    measure,
    batchSize: 8,
    lenBand,
    KINDS,
    POSITIONS,
  };
}

module.exports = { faeAnchorPool, KINDS, POSITIONS };
