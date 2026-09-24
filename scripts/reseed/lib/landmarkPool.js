/**
 * landmarkPool.js — config factory for EarthBot's "named place + light moment" subject pools
 * (andes-patagonia, australian-outback, iceland-raw, european-wilderness, …): string entries that LEAD
 * with a real toponym, name a hero feature, a light moment, then foreground / midground / distant tiers.
 *
 * The pool-specific half is a roster: PLACES [[name, heroFeature, group], …], GROUPS {group: weight}
 * (the recipe's coverage), LIGHT [...] + LIGHT_RULES [[key, regex], …], plus bans and voice notes.
 * Same idea = same place + same light moment.
 */
const { shuffle, byUsage } = require('./core');

function landmarkPool(opts) {
  const {
    name,
    poolFile,
    intro, // one sentence: what this pool is (used in the brief)
    GROUPS,
    PLACES,
    LIGHT,
    LIGHT_RULES,
    extraBans = [],
    voice = '', // extra rule lines for the brief (recipe-specific vocabulary / bans in positive form)
    aliases = {}, // text form → roster name, for originals that spell a place differently
    wordRange = [28, 60],
    lenBand = [180, 480],
    trailingPeriod = true, // the recipe pools end every entry with a period; Sonnet drops it ~half the time
  } = opts;
  const normalize = (t) => (trailingPeriod && !/\.$/.test(t) ? t.replace(/[\s,;]+$/, '') + '.' : t);

  const placeNames = PLACES.map((p) => p[0]).sort((a, b) => b.length - a.length);
  const aliasNames = Object.keys(aliases).sort((a, b) => b.length - a.length);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const PLACE_RE = new RegExp(`(${[...placeNames, ...aliasNames].map(esc).join('|')})`, 'i');
  const canonPlace = (raw) => {
    const a = aliasNames.find((n) => n.toLowerCase() === raw.toLowerCase());
    if (a) return aliases[a];
    return placeNames.find((n) => n.toLowerCase() === raw.toLowerCase()) || raw;
  };
  const FRAME = ['foreground', 'midground', 'distant'];

  function parse(text) {
    const head = text.split(',')[0];
    const m = head.match(PLACE_RE) || text.match(PLACE_RE);
    const place = m ? canonPlace(m[1]) : head.split(' at ')[0].trim().toLowerCase();
    const lm = text.match(/\bat ([a-z][a-z -]{2,40}?)(?:,| the | with )/i);
    let light = null;
    for (const [k, re] of LIGHT_RULES) {
      if (re.test(lm ? lm[1] : head)) {
        light = k;
        break;
      }
    }
    if (!light) {
      for (const [k, re] of LIGHT_RULES) {
        if (re.test(text)) {
          light = k;
          break;
        }
      }
    }
    return { keys: [`place:${place}`, `light:${light || 'none'}`], place, light: light || 'none' };
  }
  const sameGroup = (a, b) => a.place === b.place && a.light === b.light;
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];

  function assign(slot, ctx) {
    const { usage, groups } = ctx;
    const groupUse = {};
    for (const g of groups) {
      const p = g.assignment ? g.assignment.place : g.place;
      const row = PLACES.find((x) => x[0] === p);
      if (row) groupUse[row[2]] = (groupUse[row[2]] || 0) + 1;
    }
    for (let attempt = 0; attempt < 400; attempt++) {
      const group = among(
        shuffle(Object.keys(GROUPS)).sort(
          (x, y) => (groupUse[x] || 0) / GROUPS[x] - (groupUse[y] || 0) / GROUPS[y]
        ),
        3
      );
      const inGroup = PLACES.filter((p) => p[2] === group);
      const row = among(
        byUsage(inGroup, usage, (p) => 'place:' + p[0]),
        3
      );
      const light = among(
        byUsage(LIGHT, usage, (l) => 'light:' + l),
        4
      );
      const cand = { place: row[0], light };
      if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
      return {
        keys: [`place:${row[0]}`, `light:${light}`],
        place: row[0],
        feature: row[1],
        group,
        light,
        tags: [group, row[0], light],
      };
    }
    return null;
  }

  function brief(batch, examples) {
    return `You write entries for one pool of a landscape-photography bot: ${intro} Every entry is ONE composition of 38-50 words (hard limit ${Math.min(wordRange[1], 55)}: count them, the six parts below are short phrases, not sentences), one line, comma-separated phrases. Keep EXACTLY this shape:

<Place> <its hero feature> at <light moment>, <one vivid sentence of what that hero looks like in that light>, foreground <a close real detail of that place at the near edge>, midground <the hero or a second real feature>, distant <atmospheric depth of the real surroundings>, <sky in one or two words>

Examples already in the pool (match their voice, structure and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- LEAD with the place name given, then its hero feature, then "at <light moment>" exactly as given. Everything else must be true of that real place (its real rock, ice, water, plants, colours); name a real neighbouring feature for the distant tier when you can.
- Wild nature only: no people, no villages, huts, fences, roads, vehicles, boats or buildings; no ruins or heritage stonework; no photographer names; no comparisons to other continents. Describe only what is present; write no negative words.
${voice}
Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. place "${a.place}"; hero feature "${a.feature}"; light moment "${a.light}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
  }

  // The light moment may carry a proper noun ("Milky Way night"), so it is case-insensitive.
  const formatRe = /^[A-ZÁÉÍÓÚÑÖÞÆØÅ][^,]{4,90} at [A-Za-z][A-Za-z -]{2,40},.{100,}$/;
  const BANS = [
    ['photographer', /\b(Adamus|Max Rive|Kordan|Pie Aerts|Belegurschi|Peter Lik|Dros|Dyar)\b/i],
    [
      'heritage',
      /\b(ruins?|stonework|temple|citadel|fortress|castle|church|chapel|monastery|bridge)\b/i,
    ],
    [
      'person',
      /\b(person|people|hiker|hikers|climber|climbers|village|villages|town|hut|huts|cabin|fence|fences|road|roads|vehicle|truck|refugio|boat|boats|tent|camp|farm|farmland)\b/i,
    ],
    ['analogue', /\b(Alps-like|Alpine-style|Yosemite|Alaska-like|Himalaya-like|Norway-like)\b/i],
    ['unreal', /\b(portal|sci-fi|fantasy|alien|magical|bioluminescent)\b/i],
    ['negation', /\b(no|not|never|without|nothing)\b/i],
    ...extraBans,
  ];
  function mechanical(cand, slot) {
    const p = [];
    const a = slot.assignment;
    const parsed = parse(cand);
    if (parsed.place !== a.place) p.push(`place ${parsed.place}≠${a.place}`);
    if (parsed.light !== a.light) p.push(`light ${parsed.light}≠${a.light}`);
    if (!cand.startsWith(a.place)) p.push('place not leading');
    const words = cand.split(/\s+/).length;
    if (words < wordRange[0] || words > wordRange[1]) p.push(`${words} words`);
    for (const f of FRAME) {
      if (!new RegExp(f, 'i').test(cand) && !(f === 'midground' && /mid-distance/i.test(cand)))
        p.push(`no ${f}`);
    }
    for (const [bn, re] of BANS) {
      const m = cand.match(re);
      if (m) p.push(`${bn}:"${m[0]}"`);
    }
    return p;
  }
  function measure(pool, parsed) {
    const t = (f) => new Set(parsed.map((x) => x[f])).size;
    return { places: t('place'), lights: t('light') };
  }
  return {
    name,
    poolFile,
    basis: 'scene = the named place + its light moment; same when both match; greedy, pool order',
    parse,
    sameGroup,
    planSlots: ({ slots }) => slots.forEach((s) => (s.tags = ['place'])),
    assign,
    brief,
    normalize,
    formatRe,
    mechanical,
    measure,
    batchSize: 6,
    lenBand,
    PLACES,
    LIGHT,
  };
}

module.exports = { landmarkPool };
