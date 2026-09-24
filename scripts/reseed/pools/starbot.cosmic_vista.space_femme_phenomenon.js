/* global __dirname */
/**
 * starbot / cosmic-vista / space_femme_phenomenon — the cosmic EVENT firing on 70% of renders.
 * Recipe: scripts/gen-starbot-pool.js `space_femme_phenomenon` (ONE environmental drama event, 20-40
 * words, named in the first 4-6 words, with its visual impact: colour cast / motion / focal shift;
 * never a direct lighting override). Pool 2026-09-23: 200 entries = the recipe's 20 phenomena × ~8
 * rewordings each ("Supernova flash burning on the horizon" ×8 …). Same idea = phenomenon + where it
 * sits in the frame.
 */
const path = require('path');
const { byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/starbot/seeds/space_femme_phenomenon.json');

// cosmic events a painted space-femme vista can carry (the recipe's twenty plus their real siblings)
const PHENOMENA = {
  supernova: 'supernova flash detonating blinding-white with a shockwave ring',
  'aurora cyclone': 'aurora-cyclone curtains spiralling in trans-green and trans-magenta',
  'falling stars': 'falling stars streaking diagonally in white-hot lines',
  'dimensional rift': 'dimensional tear opening as a jagged seam of impossible light',
  'cosmic conflagration': 'cosmic conflagration rolling as painted fire across the void',
  'black hole': 'black-hole event horizon warping the sky into a lensed ring',
  'solar flare': 'solar flare arcing as a plasma loop off the star',
  'nebula bloom': 'nebula blooming outward in real time in trans-violet and rose',
  'meteor shower': 'meteor shower hammering down in glowing trails',
  'violet lightning': 'lightning storm of trans-violet bolts arcing between clouds',
  'hyperspace streaks': 'hyperspace-streaked star-lines as a ship jumps nearby',
  'ion storm': 'ion storm ripping through the atmosphere in glowing sheets',
  'polar aurora': 'polar aurora hanging in slow curtains of trans-green',
  'phosphorescent fog': 'phosphorescent fog drifting in glowing haze',
  'acid rain': 'acid-rain shimmer of bright amber droplets',
  'ring eclipse': 'ring-shadow eclipse sweeping a band of shadow across the planet',
  'dust cloud': 'cosmic dust cloud streaming horizontally in fine particulate',
  'time dilation': 'time-dilation lensing bending the horizon into a slow warp',
  'magnetic storm': 'magnetic storm drawn in lightning between distant peaks',
  'plasma pillar': 'plasma pillar erupting from the surface in a vertical column',
  'comet': 'comet crossing with a twin tail of ion-blue and dust-gold',
  'twin suns': 'twin suns rising as two discs of unequal colour',
  'gas giant': 'gas giant filling half the sky with banded storms',
  'moon conjunction': 'three moons aligning in a tight conjunction',
  'pulsar beam': 'pulsar beam sweeping across like a lighthouse of hard light',
  'coronal ejection': 'coronal mass ejection billowing off the star in a slow plume',
  'galaxy core': 'galaxy core rising as a bulge of dense star-light',
  'rogue planet': 'rogue planet transiting dark and vast across the star',
  'ice halo': 'ice-crystal halo ringing the sun in a rainbow arc',
  'sun pillar': 'sun pillar standing as a vertical shaft of light',
  'zodiacal light': 'zodiacal light glowing as a faint cone from the horizon',
  'cryovolcano': 'cryovolcano plume jetting ice crystals kilometres high',
  'lava sea': 'lava sea glowing molten beneath a crust of black plates',
  'volcanic lightning': 'volcanic lightning forking through an ash column',
  'ring plane': 'planetary rings seen edge-on as a razor line across the sky',
  'binary eclipse': 'binary eclipse as one star slides behind its partner',
  wormhole: 'wormhole mouth hanging as a sphere of folded starlight',
  'gravity ripple': 'gravitational-wave ripple shimmering through the star field',
  'stellar nursery': 'stellar-nursery pillars towering in dust and newborn stars',
  'quasar jet': 'quasar jet lancing out as a needle of blue light',
  'asteroid rain': 'asteroid rain tumbling in as glowing rock',
  'magnetar flash': 'magnetar flash pulsing in hard white bursts',
  'solar wind veil': 'solar-wind veil rippling as translucent sheets',
  'giant storm': 'great storm spot churning on the gas giant overhead',
  'transit silhouette': 'exoplanet transit crossing the star as a black disc',
  'dark nebula': 'dark nebula blotting the star field in a silhouette',
  'shooting arc': 'bolide fireball splitting the sky in one bright arc',
  'starquake': 'starquake flare rippling out from a distant star',
};
const PLACEMENTS = [
  'on the horizon',
  'overhead',
  'across the deep distance',
  'behind her silhouette',
  'in the mid-distance',
  'mirrored in the water below',
];
const IMPACTS = [
  'throwing a colour cast across the whole scene',
  'pulling the eye to a new focal point',
  'freezing a moment of motion',
  'catching the edges of everything in painted light',
  'lensing the far landscape',
  'staining the sky in a second colour',
];

const PHEN_RULES = [
  ['aurora cyclone', /aurora-cyclone|aurora cyclone/i],
  ['polar aurora', /polar aurora|aurora over|aurora curtain|aurora hanging/i],
  ['coronal ejection', /coronal/i],
  ['solar flare', /solar[- ]flare|plasma loop/i],
  ['solar wind veil', /solar[- ]wind/i],
  ['supernova', /supernova/i],
  ['starquake', /starquake/i],
  ['magnetar flash', /magnetar/i],
  ['pulsar beam', /pulsar/i],
  ['quasar jet', /quasar/i],
  ['stellar nursery', /stellar[- ]nursery|pillars of/i],
  ['galaxy core', /galaxy core|galactic core|galaxy rising/i],
  ['dark nebula', /dark nebula/i],
  ['nebula bloom', /nebula/i],
  ['black hole', /black[- ]hole|event horizon|event-horizon/i],
  ['wormhole', /wormhole/i],
  ['dimensional rift', /dimensional|rift|tear opening|seam of/i],
  ['time dilation', /time-dilation|time dilation|lensing distortion/i],
  ['gravity ripple', /gravitational|gravity ripple/i],
  ['hyperspace streaks', /hyperspace/i],
  ['cosmic conflagration', /conflagration|dragon-fire|cosmic fire/i],
  ['falling stars', /falling[- ]stars?|shooting stars/i],
  ['shooting arc', /bolide|fireball/i],
  ['meteor shower', /meteor/i],
  ['asteroid rain', /asteroid/i],
  ['comet', /comet/i],
  ['violet lightning', /trans-violet bolt|violet lightning|lightning-storm|lightning storm/i],
  ['volcanic lightning', /volcanic lightning|ash column/i],
  ['magnetic storm', /magnetic[- ]storm/i],
  ['ion storm', /ion[- ]storm/i],
  ['phosphorescent fog', /phosphorescent|glowing fog|glowing haze/i],
  ['acid rain', /acid[- ]rain/i],
  ['ring eclipse', /ring-shadow|ring shadow|shadow band/i],
  ['binary eclipse', /binary eclipse|slides behind its partner/i],
  ['transit silhouette', /transit|black disc/i],
  ['dust cloud', /dust[- ]cloud|particulate/i],
  ['plasma pillar', /plasma[- ]pillar|plasma column/i],
  ['sun pillar', /sun pillar|shaft of light/i],
  ['ice halo', /halo/i],
  ['zodiacal light', /zodiacal/i],
  ['twin suns', /twin suns|two suns|second sun/i],
  ['gas giant', /gas giant|banded storms/i],
  ['giant storm', /storm spot|great spot|churning storm/i],
  ['moon conjunction', /moons? align|conjunction|three moons/i],
  ['rogue planet', /rogue planet/i],
  ['ring plane', /rings? seen edge-on|planetary rings|ring plane/i],
  ['cryovolcano', /cryovolcano|ice geyser|geyser plume/i],
  ['lava sea', /lava sea|molten sea|lava field glowing/i],
];
const PLACE_RULES = [
  ['mirrored in the water below', /mirrored|reflected|reflection/i],
  ['behind her silhouette', /behind her|her silhouette|edges of her/i],
  ['on the horizon', /horizon/i],
  ['overhead', /overhead|above|zenith|across the sky/i],
  ['in the mid-distance', /mid-distance|middle distance|between distant peaks/i],
  ['across the deep distance', /deep distance|far distance|deep landscape|across the/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
function parse(text) {
  const head = text.split(',').slice(0, 2).join(',');
  const phenomenon = pick(PHEN_RULES, head, pick(PHEN_RULES, text, 'event'));
  const placement = pick(PLACE_RULES, head, pick(PLACE_RULES, text, 'across the deep distance'));
  return { keys: [`phenomenon:${phenomenon}`, `placement:${placement}`], phenomenon, placement };
}
const sameGroup = (a, b) => a.phenomenon === b.phenomenon && a.placement === b.placement;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['event']));
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
  for (let attempt = 0; attempt < 400; attempt++) {
    const phenomenon = among(
      byUsage(Object.keys(PHENOMENA), usage, (k) => 'phenomenon:' + k),
      5
    );
    const placement = among(
      byUsage(PLACEMENTS, usage, (k) => 'placement:' + k),
      4
    );
    // ground events stay low; sky-wide events are not "on the horizon"
    if (/lava sea|cryovolcano|plasma pillar|volcanic lightning|acid rain|phosphorescent fog/.test(phenomenon) && /overhead/.test(placement)) continue;
    if (/gas giant|ring plane|polar aurora|aurora cyclone|giant storm/.test(phenomenon) && /mirrored|horizon/.test(placement)) continue;
    const cand = { phenomenon, placement };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    return {
      keys: [`phenomenon:${phenomenon}`, `placement:${placement}`],
      phenomenon,
      placement,
      words: PHENOMENA[phenomenon],
      impact: spread(IMPACTS),
      tags: [phenomenon, placement],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted sci-fi bot: StarBot's cosmic-vista space-femme scenes, the COSMIC PHENOMENON axis: one environmental drama event that fires on most renders. Every entry is ONE event in 18-40 words, one line, comma-separated phrases: the phenomenon named in the first 4-6 words, where it sits in the frame, and its visual impact (a colour cast, a motion, a focal shift). Keep EXACTLY the shape of the examples.

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Name EXACTLY the phenomenon given in the first words, place it EXACTLY where the slot says, and give the impact given, in your own natural wording. Painted trans-colour vocabulary (trans-violet, trans-green, trans-magenta, painted-light) is this bot's register.
- Physics may be cosmic but never magical: no runes, spells, portals of light, or creatures. Name no lighting set-up (no golden hour, no rim light, no studio terms); the lighting axis owns those. "Her silhouette" may catch the light; describe nothing else about her.
- Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. phenomenon "${a.words}"; placement "${a.placement}"; impact "${a.impact}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z].{70,}$/;
const BANS = [
  ['lighting', /\b(golden hour|golden-hour|rim light|rim-light|key light|three-point|studio|softbox|backlit portrait)\b/i],
  ['magic', /\b(magic|magical|spell|rune|runes|portal|wizard|dragon(?!-fire)|fairy|angel)\b/i],
  ['her', /\b(her (?:hair|eyes|face|suit|armor|armour|skin|body)|she wears|her outfit)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.phenomenon !== a.phenomenon) p.push(`phenomenon ${parsed.phenomenon}≠${a.phenomenon}`);
  if (parsed.placement !== a.placement) p.push(`placement ${parsed.placement}≠${a.placement}`);
  const words = cand.split(/\s+/).length;
  if (words < 14 || words > 46) p.push(`${words} words`);
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
  return { phenomenon: t('phenomenon'), placement: t('placement') };
}

module.exports = {
  name: 'starbot/cosmic_vista/space_femme_phenomenon',
  poolFile,
  basis: 'event = phenomenon + placement in frame; same when both match; greedy, pool order (impact is flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 8,
  lenBand: [100, 320],
};
