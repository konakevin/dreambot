/**
 * carpetPool.js — config factory for BloomBot "flower carpet" pools (desert-bloom bloom_explosion,
 * flower-fantasy floor_carpet): "CAPS TITLE — dense carpet / dramatic superbloom of <colour> <species> +
 * <colour> <species> + … <position / abundance clause>". The varying element = the set of species (the
 * pilot's method): same idea = 4+ shared species (3 when an entry has only 3). Each rewrite keeps its
 * original's colour family (from the title) and gets species pre-assigned from a roster of real flowers
 * in their real hues, ≤2 shared with any other entry, with a per-species cap.
 */
const { shuffle, byUsage, sharedKeys } = require('./core');

function carpetPool(opts) {
  const {
    name,
    poolFile,
    intro, // one sentence: what the pool is
    ROSTER, // { species: hue letters } r o p v b y w (+ 'l' lavender treated as v)
    ALIAS = {},
    FAMILIES, // family → hue letters that lead it, e.g. { red: 'ro', pink: 'p', ... , multi: 'ropvby' }
    FAMILY_RULES, // [[family, /TITLE regex/], …] tested on the CAPS title
    HUE_WORDS, // hue letter → colour words allowed
    register, // 'vivid' | 'pastel'
    positions, // clauses for where the carpet lies
    abundance, // clauses for abundance language
    wordRange = [24, 62],
    lenBand = [150, 480],
    speciesCap = 14,
    extraBans = [],
    familyWord = {}, // family → the CAPS word the title must carry when it is not the family name
  } = opts;
  const titleWord = (f) => familyWord[f] || f.toUpperCase();

  const names = [...Object.keys(ROSTER), ...Object.keys(ALIAS)].sort((a, b) => b.length - a.length);
  const forms = (n) => {
    const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ -]');
    return /y$/.test(n) ? `${esc.slice(0, -1)}(?:y|ies)` : `${esc}(?:es|s)?`;
  };
  const NAME_RE = new RegExp(`\\b(${names.map(forms).join('|')})\\b`, 'gi');
  const canon = (raw) => {
    const base = raw.toLowerCase().replace(/-/g, ' ');
    for (const s of [base, base.replace(/s$/, ''), base.replace(/es$/, ''), base.replace(/ies$/, 'y')])
      for (const t of [s, s.replace(/ /g, '-')]) {
        if (ALIAS[t]) return ALIAS[t];
        if (ROSTER[t]) return t;
      }
    return base.replace(/s$/, '');
  };
  const titleOf = (e) => e.split(' — ')[0];
  const bodyOf = (e) => e.split(' — ').slice(1).join(' — ');
  function speciesOf(entry) {
    const seen = [];
    for (const m of bodyOf(entry).matchAll(NAME_RE)) {
      const k = canon(m[1]);
      if (!seen.includes(k)) seen.push(k);
    }
    return seen;
  }
  function familyOf(entry) {
    const title = titleOf(entry).toUpperCase();
    for (const [f, re] of FAMILY_RULES) if (re.test(title)) return f;
    return 'multi';
  }
  function parse(entry) {
    return { keys: speciesOf(entry), family: familyOf(entry) };
  }
  function sameGroup(a, b) {
    const m = Math.min(a.keys.length, b.keys.length);
    return m > 0 && sharedKeys(a, b).length >= Math.min(4, m);
  }
  const familyNames = Object.keys(FAMILIES);
  function planSlots({ pool, parsed, kept, slots }) {
    // even the families over the whole pool, then hand the needs to slots round-robin
    const target = Math.floor(pool.length / familyNames.length);
    const have = Object.fromEntries(familyNames.map((f) => [f, 0]));
    kept.forEach((k) => {
      const f = parsed[k].family;
      if (f in have) have[f]++;
    });
    const need = [];
    familyNames.forEach((f) => {
      for (let n = have[f]; n < target; n++) need.push(f);
    });
    while (need.length < slots.length) need.push(familyNames[need.length % familyNames.length]);
    const counts = {};
    for (const f of need) counts[f] = (counts[f] || 0) + 1;
    const queue = [];
    while (queue.length < slots.length) {
      const before = queue.length;
      for (const f of familyNames)
        if ((counts[f] || 0) > 0 && queue.length < slots.length) {
          queue.push(f);
          counts[f]--;
        }
      if (queue.length === before) break;
    }
    slots.forEach((s, i) => {
      s.family = queue[i];
      s.tags = [s.family];
    });
  }
  const flavourUse = {};
  const spread = (list) => {
    const c = byUsage(list, flavourUse)[0];
    flavourUse[c] = (flavourUse[c] || 0) + 1;
    return c;
  };
  function assign(slot, ctx) {
    const { usage, groups } = ctx;
    const n = 4 + (Math.random() < 0.5 ? 1 : 0);
    const okWith = (keys) => groups.every((g) => g.keys.filter((k) => keys.includes(k)).length <= 2);
    const underCap = (nm) => (usage[nm] || 0) < speciesCap;
    const withHue = (h) => Object.keys(ROSTER).filter((m) => ROSTER[m].includes(h));
    for (let attempt = 0; attempt < 120; attempt++) {
      const picks = [];
      const keys = [];
      const tryAdd = (nm, hue) => {
        if (keys.includes(nm) || !underCap(nm) || !okWith([...keys, nm])) return false;
        picks.push({ name: nm, hue });
        keys.push(nm);
        return true;
      };
      const hues = shuffle(FAMILIES[slot.family].split(''));
      let hi = 0;
      while (picks.length < n && hi < 60) {
        const h = hues[hi++ % hues.length];
        for (const nm of shuffle(byUsage(withHue(h), usage)).slice(0, 4)) if (tryAdd(nm, h)) break;
      }
      if (picks.length === n)
        return {
          picks,
          keys,
          position: spread(positions),
          abundance: spread(abundance),
          tags: [slot.family],
        };
    }
    return null;
  }
  function brief(batch, examples) {
    return `You write entries for one pool of a flower-art bot: ${intro} Every entry is ONE carpet of 4-5 real flower species in ${register === 'vivid' ? 'vivid saturated jewel-tone colour' : 'soft pastel colour'}, ${wordRange[0]}-${Math.min(wordRange[1], 55)} words, one line. Keep EXACTLY this shape:

TITLE WORDS IN CAPS — <abundance words> of <colour words> <flower> + <colour words> <flower> + <colour words> <flower> + <colour words> <flower> <position clause>, <one clause of how the mass reads: dense, layered, spilling, swaying>

Examples already in the pool (match their shape, length and voice):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Each slot names its flowers and the hue for each. Use EXACTLY those flowers, all of them and nothing else, joined with " + ", each introduced by colour words for that hue, names exactly as given (spaces included).
- ${register === 'vivid' ? 'Colour is vivid, saturated, jewel-tone; never pastel, never soft or pale words.' : 'Colour is soft pastel: pale, powder, blush, cream, lavender, dusty; never neon or harsh.'} Keep each colour true to that flower.
- The CAPS title names the carpet the way the examples do and MUST contain the slot's title word exactly as given, in caps.
- Flowers only, outdoors, no animals, no people, nothing built, no sky or light words. Describe only what is present; write no negative words.

Slots:
${batch
  .map(
    (s, i) =>
      `${i + 1}. title word "${titleWord(s.family)}"; colour words: ${[...new Set(s.assignment.picks.map((p) => p.hue))].map((h) => HUE_WORDS[h]).join('; ')}; flowers: ${s.assignment.picks.map((p) => `${p.name} (${HUE_WORDS[p.hue].split(' / ')[0]})`).join(', ')}; position "${s.assignment.position}"; abundance "${s.assignment.abundance}"`
  )
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
  }
  const formatRe = /^[A-Z0-9][A-Z0-9 '&-]{6,} — .+ \+ .+ \+ .+/;
  const BANS = [
    ['animal', /\b(bee|bees|butterfl|moth|bird|birds|hummingbird|deer|rabbit|lizard|insect)\b/i],
    ['person', /\b(hand|hands|person|people|girl|woman|man|child|figure|gardener)\b/i],
    ['built', /\b(vase|fence|path|trail|bench|road|sign|wall of stone|planter|pot)\b/i],
    ['sky-light', /\b(sunset|sunrise|golden hour|god-rays|sunbeam|moonlight|sky|clouds?)\b/i],
    ['negation', /\b(no|not|never|without|nothing)\b/i],
    ...(register === 'vivid'
      ? [['pastel', /\b(pastel|pale|soft|dusty|powder|muted|washed)\b/i]]
      : [['harsh', /\b(neon|electric|blazing|fiery|scarlet|screaming)\b/i]]),
    ...extraBans,
  ];
  function mechanical(cand, slot, ctx) {
    const p = [];
    const parsed = parse(cand);
    // the ASSIGNED family's word must be in the CAPS title (first-match parse is for grouping originals)
    const famRule = FAMILY_RULES.find(([f]) => f === slot.family);
    if (famRule && !famRule[1].test(titleOf(cand).toUpperCase())) p.push(`family word missing (${slot.family})`);
    const words = cand.split(/\s+/).length;
    if (words < wordRange[0] || words > wordRange[1]) p.push(`${words} words`);
    for (const [nm, re] of BANS) {
      const m = cand.match(re);
      if (m) p.push(`${nm}:"${m[0]}"`);
    }
    for (const k of parsed.keys)
      if ((ctx.usage[k] || 0) + 1 > speciesCap && !slot.keys.includes(k)) p.push(`cap: ${k}`);
    for (const g of ctx.groups) {
      if (g === slot.groupEntry) continue;
      const shared = g.keys.filter((k) => parsed.keys.includes(k));
      if (shared.length > 2) {
        p.push(`shares ${shared.length} (${shared.join(', ')})`);
        break;
      }
    }
    return p;
  }
  function measure(pool, parsed) {
    const fam = {};
    parsed.forEach((p) => (fam[p.family] = (fam[p.family] || 0) + 1));
    const top = {};
    parsed.forEach((p) => p.keys.forEach((k) => (top[k] = (top[k] || 0) + 1)));
    return {
      families: fam,
      species: Object.keys(top).length,
      topSpecies: Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k}:${v}`),
    };
  }
  return {
    name,
    poolFile,
    basis: 'carpet = the set of flower species named; same when they share 4+ species (3 when an entry has only 3); greedy, pool order',
    parse,
    sameGroup,
    planSlots,
    assign,
    brief,
    formatRe,
    mechanical,
    measure,
    batchSize: 6,
    lenBand,
    speciesOf,
    familyOf,
  };
}

module.exports = { carpetPool };
