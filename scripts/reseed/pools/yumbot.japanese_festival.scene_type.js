/* global __dirname */
/**
 * yumbot / japanese-festival / scene_type — where the five kawaii foods gather at the matsuri.
 *
 * What the pool IS (kept): string entries, 50-70 words: "Five kawaii foods <clustered|gathered|huddled|
 * nestled|arranged> <around / on / at> <ONE festival perch> — one …, one …, one …, one …, one … (five
 * slight pose variations: peeking, tilted, leaning, looking up, tallest at center)". The template uses it
 * as "[scene-type pose-varied cluster arrangement]"; the matsuri backdrop, signature elements, terrain,
 * sky, lighting, weather and the tiny companion are OTHER axes and are never named here. Traditional
 * matsuri only; no humans / animals as cast; no legible text (a sign or label is a text magnet).
 *
 * What was wrong (2026-09-23): 200 entries whose perch is a MAT 34 times and a spread CLOTH 20 times
 * (sedge mat, straw mat, tatami, sudare, tenugui, furoshiki, a folded kendo-gi …), 42 more on some part
 * of a shrine; the five poses are the template's own five and read the same in every entry.
 *
 * The varying element = the PERCH: the one festival object the foods gather on or around. Same idea =
 * same perch FAMILY (every mat is one idea, every spread cloth is one idea). Rewrites pre-assign a
 * distinct real matsuri perch from a roster (least-used family first), keep each original's opener verb
 * and its five-pose shape; the LLM only words it.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/yumbot/seeds/festival_scene_type.json');

// ── Roster: perch families → concrete perches (all traditional-matsuri, kawaii-safe, text-free) ──
const FAMILY = {
  'goldfish-scoop': ['the rim of a kingyo-sukui goldfish-scooping tub', 'a stack of paper poi scoops beside the goldfish tub', 'the edge of a shallow blue goldfish pool'],
  'yo-yo tub': ['the rim of a water tub of floating yo-yo balloons', 'a row of yo-yo balloons bobbing at the tub edge'],
  'ring-toss': ['the low counter of a ring-toss booth', 'a bamboo ring-toss peg board laid flat'],
  taiko: ['the broad head of a taiko drum', 'a small shime-daiko drum on its wooden stand', 'the wheel of a wheeled festival drum cart'],
  mikoshi: ['a carrying beam of a resting mikoshi shrine float', 'the gilded roof edge of a small mikoshi'],
  yagura: ['the edge of a bon-odori yagura tower stage', 'a low step of the yagura scaffold'],
  chochin: ['the base of a chochin lantern post', 'a rope of red chochin lanterns sagging low', 'a big paper chochin lying on its side'],
  torii: ['the foot of a vermilion torii pillar', 'the stone plinth of a small torii'],
  komainu: ['the plinth of a stone komainu lion-dog', 'the stone base of a fox statue'],
  'stone lantern': ['the base of a mossy stone lantern', 'the wide cap of a low stone lantern'],
  'shrine steps': ['a wide stone shrine step', 'the worn top step of a shrine stair'],
  'shrine fence': ['a bamboo fence rail', 'a vermilion wooden fence rail', 'the top of a low stone wall'],
  'ema rack': ['the lower rail of an ema wish-plaque rack', 'a pile of blank wooden ema plaques'],
  omikuji: ['a wooden omikuji fortune box', 'a bamboo omikuji drawer chest'],
  'temizuya basin': ['the stone rim of a temizuya water basin', 'the ladle rest of a water basin'],
  yatai: ['a yatai stall counter', 'the front shelf of a yatai stall', 'a wooden crate beside a yatai'],
  kakigori: ['the counter of a kakigori shaved-ice stall', 'a stack of striped kakigori cups'],
  'chocolate banana': ['the rack of a chocolate-banana stall'],
  'cotton candy': ['the cart of a wataame cotton-candy stall'],
  'mask stall': ['the shelf of a festival mask stall', 'a fox mask lying face-up'],
  'dango tray': ['a wooden tray of dango skewers', 'a stacked bamboo steamer basket'],
  ramune: ['a wooden crate of ramune bottles', 'a tub of ice with ramune bottles'],
  senbei: ['a wooden senbei cracker box', 'a round rice-cracker tin lid'],
  furin: ['the shelf of a furin wind-chime stand', 'a bamboo pole hung with furin chimes'],
  wagasa: ['an open red wagasa paper umbrella laid on the ground', 'the handle of a leaning wagasa'],
  uchiwa: ['a pile of round uchiwa fans', 'a big uchiwa fan laid flat'],
  geta: ['a pair of wooden geta sandals', 'a row of geta at a tea-house step'],
  koinobori: ['the base of a koinobori carp-streamer pole', 'a coiled koinobori carp streamer'],
  tanabata: ['the foot of a tanabata bamboo hung with paper wishes', 'a tanabata paper-strip bundle'],
  daruma: ['a shelf of daruma dolls', 'a giant red daruma'],
  'maneki-neko': ['a shelf beside a maneki-neko', 'the paw of a big maneki-neko'],
  kokeshi: ['a row of kokeshi dolls', 'a kokeshi doll shelf'],
  temari: ['a basket of temari thread balls', 'a temari ball pyramid'],
  kendama: ['a pile of kendama toys', 'a kendama cup'],
  'koi pond': ['a stepping stone in a koi pond', 'the mossy edge of a koi pond'],
  bridge: ['the rail of a vermilion wooden bridge', 'a plank of a small arched bridge'],
  bench: ['a wooden festival bench', 'a red-cloth tea-house bench'],
  'tea house': ['the tatami edge of a tea house', 'a zabuton cushion by a tea-house door'],
  mat: ['a flat woven sedge mat', 'a straw fireworks-viewing mat'],
  cloth: ['a spread furoshiki cloth', 'a folded indigo tenugui'],
  'sakura drift': ['a bench buried in sakura petal drift', 'a sakura-petal-covered stone'],
  'maple drift': ['a step covered in red maple leaves', 'a maple-leaf-covered stone basin rim'],
  'bon lantern': ['a bon lantern float at a pond edge', 'a row of paper lantern floats'],
  'candy apple': ['the tray of a candy-apple stall', 'a candy-apple stand'],
  'takoyaki': ['the counter of a takoyaki stall', 'a stack of takoyaki boats'],
  'yakisoba': ['the counter of a yakisoba stall'],
  'bunting': ['a rail hung with red-and-white kohaku bunting', 'a tied kohaku curtain'],
  'noren': ['the hem of a noren curtain', 'a noren rail'],
  'sudare': ['a rolled-out sudare blind'],
  'hinoki plank': ['a plank of pale hinoki cypress'],
  'stone garden': ['a raked-gravel stone garden edge', 'a stone garden lantern base'],
  'well': ['the wooden lid of a shrine well', 'the rim of a stone well'],
  'shishi-odoshi': ['the bamboo of a shishi-odoshi deer-scarer', 'a mossy shishi-odoshi basin'],
  'shrine bell': ['the thick rope of a shrine bell', 'the wooden step below a shrine bell'],
  'fireworks': ['a hillside spot facing the fireworks', 'a riverbank straw mat facing the fireworks'],
};
const VERBS = ['clustered', 'gathered', 'huddled', 'nestled', 'arranged', 'perched', 'seated'];
// How the cluster sits on its perch (every entry already states it: "around a tank", "on a mat",
// "at the foot of a torii"). Roughly 55 perch families cannot make 200 distinct entries on their own,
// so the idea is perch family + arrangement.
// prepositional phrases only (the opener verb is the slot's own: "huddled at the base of …")
// First render pass (2026-09-24): "half-hidden behind" and "up the levels of" hid the foods or lost
// the perch; the six that sit the foods ON or AT something render.
const ARR = {
  ring: 'in a ring around',
  top: 'on top of',
  edge: 'along the edge of',
  rim: 'at the rim of',
  base: 'at the base of',
  leaning: 'against the side of',
};
const ARR_RULES = [
  ['rim', /at the rim|over the rim|peeking over|over the edge of/i],
  ['levels', /up the (?:steps|levels|tiers)|stacked up|on the (?:steps|tiers)/i],
  ['edge', /along the edge|lined along|in a row along|along the rim|along the rail/i],
  ['behind', /behind/i],
  ['leaning', /against the side|leaning against|propped against/i],
  ['base', /at the base|at the foot|beneath|under|below/i],
  ['ring', /in a ring|circling|around|encircling/i],
  ['top', /\bon\b|atop|across/i],
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
// family rules, specific first
const FAMILY_RULES = [
  // the drifts first: "a bench buried in sakura petal drift" is a sakura perch, not a bench
  ['sakura drift', /sakura|cherry|petal/i],
  ['maple drift', /maple|momiji/i],
  ['goldfish-scoop', /kingyo|goldfish/i],
  ['yo-yo tub', /yo-yo|yoyo/i],
  ['ring-toss', /ring-toss|ring toss/i],
  ['taiko', /taiko|shime-daiko|\bdrum/i],
  ['mikoshi', /mikoshi/i],
  ['yagura', /yagura/i],
  ['chochin', /chochin|paper[- ]lantern/i],
  ['torii', /torii/i],
  ['komainu', /komainu|lion-dog|fox statue|kitsune statue/i],
  ['stone lantern', /stone lantern|ishidoro/i],
  ['shrine steps', /shrine step|stone step|stair/i],
  ['shrine fence', /fence|stone wall|\brail\b(?! of a .*bridge)/i],
  ['ema rack', /\bema\b/i],
  ['omikuji', /omikuji|fortune/i],
  ['temizuya basin', /temizuya|water basin|ladle/i],
  ['kakigori', /kakigori|shaved[- ]ice/i],
  ['chocolate banana', /chocolate[- ]banana/i],
  ['cotton candy', /wataame|cotton[- ]candy/i],
  ['mask stall', /\bmask/i],
  ['candy apple', /candy[- ]apple|ringo-ame/i],
  ['takoyaki', /takoyaki/i],
  ['yakisoba', /yakisoba/i],
  ['dango tray', /dango|steamer/i],
  ['ramune', /ramune/i],
  ['senbei', /senbei|cracker/i],
  ['furin', /furin|wind[- ]chime/i],
  ['wagasa', /wagasa|paper umbrella|umbrella/i],
  ['uchiwa', /uchiwa|\bfan\b/i],
  ['geta', /\bgeta\b|sandal/i],
  ['koinobori', /koinobori|carp/i],
  ['tanabata', /tanabata|paper wish|wish strip/i],
  ['daruma', /daruma/i],
  ['maneki-neko', /maneki/i],
  ['kokeshi', /kokeshi/i],
  ['temari', /temari/i],
  ['kendama', /kendama/i],
  ['koi pond', /koi|stepping stone|pond/i],
  ['bridge', /bridge/i],
  ['bon lantern', /bon lantern|lantern float|toro nagashi/i],
  ['bunting', /bunting|kohaku/i],
  ['noren', /noren/i],
  ['sudare', /sudare/i],
  ['hinoki plank', /hinoki|plank/i],
  ['tea house', /tea[- ]house|tatami|zabuton|cushion/i],
  ['bench', /bench/i],
  ['yatai', /yatai|stall|counter|crate/i],
  ['stone garden', /gravel|stone garden/i],
  ['well', /\bwell\b/i],
  ['shishi-odoshi', /shishi|deer-scarer/i],
  ['shrine bell', /bell/i],
  ['fireworks', /firework|hanabi/i],
  ['platform', /platform|railing|viewing deck|veranda|engawa/i],
  ['cloth', /cloth|tenugui|furoshiki|jacket|yukata|kendo-gi|obi|blanket|kimono|fabric|haori|happi/i],
  ['mat', /\bmat\b|tatami|straw|sedge|blind|rug/i],
];
const headOf = (text) => text.split(/ — |—/)[0];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
// A perch no rule knows stays its OWN idea (its last three words), never a shared "other" bucket.
function parse(text) {
  const head = headOf(text);
  let family = pick(FAMILY_RULES, head, null);
  if (!family) {
    const perch = head
      .replace(/^Five kawaii foods (?:\w+) (?:together )?(?:on|around|at|beside|near|beneath|under|along|atop|by|inside|against|in) /i, '')
      .toLowerCase()
      .replace(/[^a-z\s-]/g, '')
      .split(/\s+/)
      .filter((w) => !/^(a|an|the|of|small|large|low|wide|flat|smooth|old|worn|wooden)$/.test(w));
    family = 'other:' + perch.slice(-3).join(' ');
  }
  const arr = pick(ARR_RULES, head, 'top');
  return { keys: [`family:${family}`, `arr:${arr}`], family, arr };
}
function sameGroup(a, b) {
  return a.family === b.family && a.arr === b.arr;
}
const verbOf = (text) => VERBS.find((v) => new RegExp(`^Five kawaii foods ${v}`, 'i').test(text)) || 'gathered';

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => {
    s.verb = s.old ? verbOf(s.old) : VERBS[Math.floor(Math.random() * VERBS.length)];
    s.tags = ['perch'];
  });
}
const perchUse = {};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  for (let attempt = 0; attempt < 400; attempt++) {
    const family = among(
      byUsage(Object.keys(FAMILY), usage, (k) => 'family:' + k),
      5
    );
    const arr = among(
      byUsage(Object.keys(ARR), usage, (k) => 'arr:' + k),
      4
    );
    // a rim needs a tub, basin, well or box; levels need steps, a yagura or a shelf; you cannot sit
    // on top of a lantern rope, a curtain or a streamer
    // small or obscure perches (a kendama pile, a senbei tin, a kokeshi row, an omikuji box, temari,
    // daruma, maneki-neko, an ema rack, a bell rope, a deer-scarer) never rendered: skip them
    if (/kendama|senbei|kokeshi|omikuji|temari|daruma|maneki-neko|ema rack|shrine bell|shishi-odoshi/.test(family)) continue;
    if (arr === 'rim' && !/goldfish|yo-yo|temizuya|well|ramune|dango|koi pond/.test(family)) continue;
    if (arr === 'top' && /chochin|bunting|noren|koinobori|tanabata|fireworks|furin/.test(family)) continue;
    const cand = { family, arr };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    const perch = byUsage(FAMILY[family], perchUse)[0];
    perchUse[perch] = (perchUse[perch] || 0) + 1;
    return { keys: [`family:${family}`, `arr:${arr}`], family, arr, perch, tags: [family, arr] };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a kawaii-food illustration bot: YumBot japanese-festival. Every entry is ONE cluster arrangement of five kawaii festival foods gathered at ONE traditional matsuri perch, 50-70 words, one line. Keep EXACTLY this shape:

Five kawaii foods <verb> <arrangement> <the perch> — one <pose>, one <pose>, one <pose>, one <pose>, one <pose>

Examples already in the pool (match their voice, structure and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Open with "Five kawaii foods <verb given> <arrangement given> <the perch given>": keep the arrangement's key words and the perch's own noun, in your own natural wording. The perch is the only setting detail: no backdrop, no lanterns strung overhead, no sky, no weather, no lighting, no companions (other axes add those).
- Five slight pose variations, each placed (left / center / right / front / back edge): one peeking, one tilted, one leaning, one looking up, one sitting tallest; natural family-portrait cluster, never a lineup and never acrobatics.
- Traditional matsuri only; nothing modern; no people or animals; no writing, labels, signs or banners on anything. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. verb "${s.verb}"; arrangement "${ARR[a.arr]}"; perch "${a.perch}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
const formatRe = /^Five kawaii foods (?:clustered|gathered|huddled|nestled|arranged|perched|seated) .{20,160} — one .{60,}$/;
const BANS = [
  ['text', /\b(sign|signs|signboard|banner|banners|label|labels|lettering|kanji|calligraphy|menu|placard|poster)\b/i],
  ['modern', /\b(ferris|neon|plastic|mall|car|truck|phone|camera|selfie|balloon animal|led)\b/i],
  ['cast', /\b(person|people|child|children|man|woman|boy|girl|crowd|cat|dog|fox\b(?! mask| statue)|bird|goldfish swimming)\b/i],
  ['other-axis', /\b(lantern-glow|lanterns overhead|glowing lanterns|fireflies|firefly|moon|stars|sunset|dusk|night sky|rain|mist|fog|breeze)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.family !== a.family) p.push(`family ${parsed.family}≠${a.family}`);
  if (parsed.arr !== a.arr) p.push(`arrangement ${parsed.arr}≠${a.arr}`);
  if (!new RegExp(`^Five kawaii foods ${slot.verb}\\b`, 'i').test(cand)) p.push('verb changed');
  const words = cand.split(/\s+/).length;
  if (words < 40 || words > 80) p.push(`${words} words`);
  const ones = (cand.split(/ — |—/)[1] || '').match(/\bone\b/gi) || [];
  if (ones.length < 4) p.push(`${ones.length} poses`);
  for (const [name, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${name}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const o = {};
  const arr = {};
  parsed.forEach((p) => {
    o[p.family] = (o[p.family] || 0) + 1;
    arr[p.arr] = (arr[p.arr] || 0) + 1;
  });
  return { families: Object.keys(o).length, byFamily: o, arrangements: arr };
}

module.exports = {
  name: 'yumbot/japanese_festival/scene_type',
  poolFile,
  basis:
    'perch family (what the five foods gather on or around) + how the cluster sits on it; same when both match; greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [260, 520],
};
