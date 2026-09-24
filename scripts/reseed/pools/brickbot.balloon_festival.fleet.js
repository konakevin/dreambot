/* global __dirname */
/**
 * brickbot / balloon-festival / fleet (Track B: GROW from 25 to 100+) — the SUBJECT of the path: a sky
 * full of brick hot-air balloons, two dozen or more stated as a number, at every height, the nearest
 * one huge and cropped by the frame, one special-shaped balloon whole and readable in the middle
 * distance, the rest a scatter of colours to tiny specks. LEGO register throughout (smooth unmarked
 * panels, curved slopes, plates, bar-and-clip basket corners, chrome burner cylinder, trans-orange
 * flame, trans-white mist plates, minifigures). Massing words that render as one object (tower /
 * column / stack / pyramid / arch) are banned for the fleet (path header). 55-75 words.
 *
 * Same idea = the launch SITUATION + the nearest balloon's PATTERN + the SHAPED balloon. The 25
 * originals are kept verbatim; new entries draw the three from rosters, least-used first, with a
 * colour pair and a distance scatter as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/brickbot/seeds/brickbot_balloon_fleet.json');

const SITUATIONS = {
  'mass ascension': 'a mass ascension with every balloon lifting at once',
  'staggered launch': 'a staggered launch, a dozen already high and small while the rest still swell on the grass',
  'slack on the grass': 'half the fleet lying flat on the grass as long slack coloured sleeves, the rest taut and standing',
  'dawn mist': 'a dawn launch shin-deep in trans-white mist plates',
  'dusk lantern-lit': 'a dusk fleet glowing lantern-lit from inside by trans-orange burner flames',
  'night glow': 'a night glow against a cobalt sky, every balloon lit from within',
  'wind-fanned': 'a wind fanning the fleet across the full width of the sky',
  'low over the treeline': 'the fleet drifting so low the nearest baskets skim the treeline',
  'inflation field': 'a crowded inflation field of part-swollen balloons leaning together like enormous fruit',
  'cold morning': 'a cold morning with most balloons pale and slack and six already taut and blazing',
  'competition launch': 'a competition launch sending balloons up from all round the field',
  'shaped and striped': 'a fleet where a third of the balloons are shaped and the rest striped and chequered',
  'alpine valley': 'a launch in a narrow alpine valley between brick pasture and white cloud-slope peaks',
  'sun-shaft': 'a shaft of afternoon sun blazing on a handful of balloons while the rest sit in cool shadow',
  'frozen lake': 'the fleet hanging over a frozen lake, every balloon doubled in the trans-blue plate ice',
  'cropped giant': 'the nearest balloon so tall it is cropped by the top, both sides and the lower edge at once',
  'ropes loosed': 'the moment the last ground ropes are loosed and the whole fleet lifts together',
  'wide valley': 'the fleet fanning out across a wide valley at wildly different heights',
  'river bend': 'the fleet crossing a river bend, the low ones mirrored in the trans-blue water plates',
  'coastal launch': 'a launch from a clifftop meadow with the fleet drifting out over the sea',
  'snowfield': 'a launch from a snowfield of white plates, every colour doubled against the snow',
  'vineyard rows': 'the fleet drifting over long rows of brick vineyard',
  'harvest stubble': 'a launch from golden stubble fields with tiny brick hay bales below',
  'canyon rim': 'the fleet rising out of a red-rock canyon past the rim',
  'lake shore': 'a lakeshore launch, the nearest baskets over the water and the fleet climbing inland',
  'orchard blossom': 'the fleet lifting over an orchard of pink blossom elements',
  'rolling downs': 'the fleet strung out over rolling green downs to the horizon',
  'night landing': 'a fleet descending at dusk toward a lit landing field, burners flaring one by one',
  'rain-washed': 'a launch just after rain, the fleet doubled in long trans-clear puddle plates',
  'chase crews': 'the fleet lifting while chase-crew minifigures run beneath with trailing ropes',
};
const PATTERNS = {
  'gore-striped': 'gore-striped in alternating vertical panels',
  chequerboard: 'chequerboard',
  spiral: 'spiral',
  chevron: 'chevron',
  gradient: 'crown-to-skirt gradient in stepped brick rows',
  harlequin: 'harlequin diamonds',
  'horizontal bands': 'broad horizontal bands',
  'polka-dot': 'polka-dotted with round tile dots',
  sunburst: 'sunburst rays from the crown',
  zigzag: 'zigzag panels',
  'quartered': 'quartered in four solid colours',
  'starred': 'star-studded with contrasting tile stars',
};
const COLOURS = [
  'magenta-and-lime',
  'tangerine-and-cobalt',
  'vermilion-and-white',
  'egg-yolk-and-cobalt',
  'hot-pink-and-white',
  'cyan-and-white',
  'lime-and-vermilion',
  'cobalt-and-hot-pink',
  'egg-yolk-and-magenta',
  'lime-and-white',
  'vermilion-and-cobalt',
  'tangerine-and-lime',
  'cyan-and-egg-yolk',
  'hot-pink-and-lime',
];
const SHAPES = {
  bee: 'a bee-shaped balloon, black and egg-yolk smooth unmarked panels with two trans-clear wing plates',
  cupcake: 'a cupcake-shaped balloon with a domed curved-slope frosting top',
  teapot: 'a teapot-shaped balloon with a curved-slope spout and handle',
  'dragon-head': 'a dragon-head balloon with a vermilion curved-slope snout',
  'hot-dog': 'a hot-dog-shaped balloon with a curved-slope bun',
  mushroom: 'a mushroom-shaped balloon with a rounded cap',
  rocket: 'a rocket-shaped balloon with a pointed slope nose cone',
  penguin: 'a penguin-shaped balloon with a white curved-slope belly',
  owl: 'an owl-shaped balloon with two big dish-element eyes',
  'castle turret': 'a castle-turret-shaped balloon with crenellated curved-slope battlements',
  toucan: 'a toucan-shaped balloon with a broad curved-slope beak',
  fish: 'a fish-shaped balloon with scaled curved-slope flanks and a tail fin',
  snail: 'a snail-shaped balloon with a coiled curved-slope shell',
  strawberry: 'a strawberry-shaped balloon with a green leaf-plate calyx',
  'ice-cream cone': 'an ice-cream-cone balloon, a scoop of curved slopes on a tan wedge',
  lighthouse: 'a lighthouse-shaped balloon banded red and white with a trans-clear lamp',
  elephant: 'an elephant-shaped balloon with a curled curved-slope trunk',
  frog: 'a frog-shaped balloon with two bulging dish-element eyes',
  sunflower: 'a sunflower-shaped balloon with a ring of egg-yolk petal plates',
  ladybird: 'a ladybird-shaped balloon, red panels with black round-tile spots',
  whale: 'a whale-shaped balloon with a broad curved-slope tail',
  pumpkin: 'a pumpkin-shaped balloon with ribbed orange curved slopes',
  moon: 'a crescent-moon balloon in pale egg-yolk with a curved-slope face',
  cat: 'a cat-shaped balloon with two pointed slope ears',
  lion: 'a lion-shaped balloon with a tangerine mane of curved slopes',
  pineapple: 'a pineapple-shaped balloon with crossed tile scales and a spiky leaf crown',
  'birthday cake': 'a birthday-cake balloon, three tiers of stacked curved slopes with trans-orange candle flames',
  submarine: 'a submarine-shaped balloon with a dish-element porthole',
  koala: 'a koala-shaped balloon with round grey dish-element ears',
  dinosaur: 'a dinosaur-shaped balloon with a row of plate spines down its back',
  shark: 'a shark-shaped balloon with a tall slope dorsal fin',
  parrot: 'a parrot-shaped balloon in lime, cobalt and vermilion with a curved-slope beak',
  pig: 'a pig-shaped balloon in pink with a round tile snout',
  turtle: 'a turtle-shaped balloon with a domed plate shell',
  'rubber duck': 'a rubber-duck balloon in egg-yolk with a tangerine curved-slope bill',
  'hot-air teacup': 'a giant teacup balloon with a curved-slope handle',
  lobster: 'a lobster-shaped balloon in vermilion with two bar-element claws',
  octopus: 'an octopus-shaped balloon with eight trailing tentacle sleeves',
  cactus: 'a cactus-shaped balloon in lime with plate spines',
  'chess knight': 'a chess-knight balloon in white with a curved-slope mane',
};
const SCATTER = [
  'a scatter of cobalt and egg-yolk chequerboards climbing to tiny specks near the top of the frame',
  'twenty more at every height behind, shrinking to bright dots against the sky',
  'a field of magenta, lime, hot-pink and vermilion beyond, the farthest as small as a single stud',
  'the rest strung out at every height from basket-rim close to pinprick far',
  'a dozen tiny ones high and small above the middle distance',
  'the far ones reduced to bright round specks over the treeline',
];

const SIT_RULES = [
  ['frozen lake', /frozen lake|plate ice/i],
  ['river bend', /river bend|river/i],
  ['rain-washed', /after rain|puddle/i],
  ['dawn mist', /dawn .{0,40}mist|mist plates/i],
  ['night landing', /landing field|descending/i],
  ['night glow', /night sky|against a cobalt night/i],
  ['dusk lantern-lit', /dusk/i],
  ['sun-shaft', /shaft of .{0,20}sun|blaze/i],
  ['cold morning', /cold morning/i],
  ['inflation field', /inflation field|part-swollen|partly swollen|lean together|lean against one another/i],
  ['slack on the grass', /lie flat|lying flat|slack .{0,30}sleeves|long slack/i],
  ['staggered launch', /staggered launch/i],
  ['ropes loosed', /ropes are loosed|ropes loosed/i],
  ['competition launch', /competition/i],
  ['shaped and striped', /a third of the .{0,20}balloons are shaped/i],
  ['alpine valley', /alpine valley|cloud-slope peaks/i],
  ['wide valley', /wide valley/i],
  ['canyon rim', /canyon/i],
  ['coastal launch', /clifftop|over the sea|coast/i],
  ['snowfield', /snowfield|snow/i],
  ['vineyard rows', /vineyard/i],
  ['harvest stubble', /stubble|hay bale/i],
  ['lake shore', /lakeshore|lake shore/i],
  ['orchard blossom', /orchard|blossom/i],
  ['rolling downs', /downs/i],
  ['chase crews', /chase-crew|chase crew/i],
  ['low over the treeline', /skim the treeline|drifts low|drifting so low/i],
  ['cropped giant', /cropped by the top, both sides/i],
  ['wind-fanned', /wind has fanned|wind fanning|fanned .{0,20}across the full width/i],
  ['mass ascension', /mass ascension|fill every height at once|every height simultaneously/i],
];
const PAT_RULES = [
  ['gore-striped', /gore-striped|gore stripe/i],
  ['chequerboard', /chequerboard|checkerboard/i],
  ['spiral', /spiral/i],
  ['chevron', /chevron/i],
  ['gradient', /gradient/i],
  ['harlequin', /harlequin|diamonds/i],
  ['horizontal bands', /horizontal bands|banded|broad bands|\bbands\b/i],
  ['polka-dot', /polka|dotted/i],
  ['sunburst', /sunburst/i],
  ['zigzag', /zigzag/i],
  ['quartered', /quartered/i],
  ['starred', /star-studded|tile stars/i],
];
// whole words only ("lion" must not match inside "vermilion")
const SHAPE_RULES = Object.keys(SHAPES).map((s) => {
  const w = s.replace(/[- ]/g, '[- ]');
  return [s, new RegExp(`\\b${w}(?:-shaped|[- ]balloon)\\b|\\b${w}\\b`, 'i')];
});
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
function parse(text) {
  const situation = pick(SIT_RULES, text, 'launch');
  const nearest = (text.match(/the (?:nearest|closest)[^,]{0,120}/i) || [text])[0];
  const pattern = pick(PAT_RULES, nearest, pick(PAT_RULES, text, 'plain'));
  const shape = pick(SHAPE_RULES, text, 'none');
  return { keys: [`situation:${situation}`, `pattern:${pattern}`, `shape:${shape}`], situation, pattern, shape };
}
const sameGroup = (a, b) => a.situation === b.situation && a.pattern === b.pattern && a.shape === b.shape;
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
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  const sits = Object.keys(SITUATIONS);
  const pats = Object.keys(PATTERNS);
  const shapes = Object.keys(SHAPES);
  for (let attempt = 0; attempt < 600; attempt++) {
    let situation;
    let pattern;
    let shape;
    if (attempt < 200) {
      situation = among(byUsage(sits, usage, (k) => 'situation:' + k), 5);
      pattern = among(byUsage(pats, usage, (k) => 'pattern:' + k), 4);
      shape = among(byUsage(shapes, usage, (k) => 'shape:' + k), 6);
    } else {
      const i = attempt - 200;
      situation = byUsage(sits, usage, (k) => 'situation:' + k)[i % sits.length];
      pattern = byUsage(pats, usage, (k) => 'pattern:' + k)[Math.floor(i / sits.length) % pats.length];
      shape = byUsage(shapes, usage, (k) => 'shape:' + k)[Math.floor(i / (sits.length * pats.length)) % shapes.length];
    }
    const cand = { situation, pattern, shape };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    return {
      keys: [`situation:${situation}`, `pattern:${pattern}`, `shape:${shape}`],
      situation,
      pattern,
      shape,
      words: SITUATIONS[situation],
      patternWords: PATTERNS[pattern],
      colours: spread(COLOURS),
      shapeWords: SHAPES[shape],
      scatter: spread(SCATTER),
      tags: [situation, pattern, shape],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a LEGO-photography bot: BrickBot balloon-festival, the FLEET axis: a sky full of brick hot-air balloons, the subject of the picture. Every entry is ONE fleet in 55-75 words, one line, comma-separated phrases: the launch situation and the count (two dozen or more, stated as a NUMBER: "thirty-odd", "forty or more", "twenty-four"), balloons at every height from the nearest to tiny specks, the nearest a vast <colours> <pattern> mass cropped by the frame with its basket rim or burner near the edge, one special-shaped balloon whole and readable in the middle distance, and a scatter of colours beyond. Keep EXACTLY the shape of the examples.

Examples already in the pool (match their voice, LEGO vocabulary and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the situation, the nearest balloon's colours and pattern, the shaped balloon and the scatter given for the slot, in your own natural wording.
- LEGO register: smooth unmarked brick panels, stacked curved slopes, plates, dish elements, bar-and-clip basket corners, chrome burner cylinder, trans-orange flame elements, trans-white mist plates, trans-blue water plates, minifigures. Nothing printed, no logos or lettering on any balloon.
- Spread the fleet: many heights, the far ones tiny. Name the fleet as many separate balloons, never as one massed object. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. situation "${a.words}"; nearest "${a.colours} ${a.patternWords}"; shaped "${a.shapeWords}"; scatter "${a.scatter}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z].{250,}$/;
const BANS = [
  ['massing', /\b(tower|towers|column|columns|stack|stacked balloons|pyramid|arch|archway|wall of balloons)\b/i],
  ['text', /\b(logo|logos|lettering|letters|printed|sponsor|banner|text)\b/i],
  ['not-lego', /\b(nylon|ripstop|fabric|canvas|wicker|real|photoreal)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
const NUMBERS = /\b(two dozen|twenty-four|twenty-five|twenty-six|twenty-eight|thirty|thirty-odd|thirty-two|thirty-four|thirty-six|forty|forty-odd|forty or more|fifty|dozens)\b/i;
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.situation !== a.situation) p.push(`situation ${parsed.situation}≠${a.situation}`);
  if (parsed.pattern !== a.pattern) p.push(`pattern ${parsed.pattern}≠${a.pattern}`);
  if (parsed.shape !== a.shape) p.push(`shape ${parsed.shape}≠${a.shape}`);
  const words = cand.split(/\s+/).length;
  if (words < 45 || words > 85) p.push(`${words} words`);
  if (!NUMBERS.test(cand)) p.push('no fleet number');
  if (!/every height|all heights|different heights|at every height|tiny|specks|dots|high and small|to the top of the frame|far ones|farthest|shrinking/i.test(cand)) p.push('no height spread');
  if (!/smooth unmarked|curved slope|curved-slope|plate|dish element|bar-and-clip|minifigure|trans-/i.test(cand)) p.push('no LEGO element');
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
  return { situation: t('situation'), pattern: t('pattern'), shape: t('shape') };
}

module.exports = {
  name: 'brickbot/balloon_festival/fleet',
  poolFile,
  basis: 'fleet = launch situation + nearest balloon pattern + shaped balloon; same when all three match; greedy, pool order (colours and scatter are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [300, 620],
};
