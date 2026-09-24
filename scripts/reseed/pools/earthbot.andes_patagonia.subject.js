/* global __dirname */
/**
 * earthbot / andes-patagonia / subject — South American raw nature, one named place per entry.
 *
 * What the pool IS (kept): string entries, 30-55 words, LEADING with a South American toponym
 * ("Fitz Roy peak at sunrise, …"), then the geological hero, a close foreground, a midground hero and
 * atmospheric distance, with a specific lighting moment named in the entry (this older recipe keeps
 * light inside the subject). Recipe: scripts/gen-earthbot-pool.js `andes_patagonia_subject` (coverage
 * across Patagonia spires / glaciers + lakes / steppe + Tierra del Fuego / Andes volcanoes / high
 * peaks / salt flats / altiplano lagunas / Atacama / Amazon / falls + caves). Bans: photographer names,
 * Machu Picchu / Inca / any heritage stonework, humans / villages / roads / refugios, sci-fi, negation,
 * "Alps-like" analogues.
 *
 * What was wrong (2026-09-23): 200 entries over 31 toponyms; 58 distinct (place + light); Salar de
 * Uyuni ×25, Fitz Roy ×19, Torres del Paine ×14; "Perito Moreno at midday" ×10.
 *
 * The varying element = the PLACE (a real toponym) and the LIGHT moment. Same idea = same place + same
 * light. Rewrites pre-assign a place from a roster of ~80 real South American landmarks (weighted to the
 * recipe's coverage) and a light moment, least-used first, so no two entries share the pair.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/earthbot/seeds/andes_patagonia_subject.json');

// ── Roster: real places, what the picture is of, grouped as the recipe groups them ──────────────
// group weight = the recipe's share; feature = the hero phrase the entry names after the toponym
const GROUPS = {
  spires: 5,
  glaciers: 3,
  steppe: 2,
  volcanoes: 3,
  peaks: 2,
  salt: 3,
  lagunas: 2,
  atacama: 2,
  amazon: 2,
  falls: 1,
};
const PLACES = [
  ['Torres del Paine', 'granite spires', 'spires'],
  ['Cuernos del Paine', 'horn-shaped peaks', 'spires'],
  ['Fitz Roy', 'peak', 'spires'],
  ['Cerro Torre', 'summit needle', 'spires'],
  ['Cerro Catedral', 'granite ridge', 'spires'],
  ['Cerro Castillo', 'basalt spires', 'spires'],
  ['Monte Tronador', 'glaciated massif', 'spires'],
  ['Paine Grande', 'ice-capped massif', 'spires'],
  ['Perito Moreno', 'glacier face', 'glaciers'],
  ['Upsala Glacier', 'iceberg-strewn front', 'glaciers'],
  ['Grey Glacier', 'blue iceberg field', 'glaciers'],
  ['Viedma Glacier', 'tongue meeting the lake', 'glaciers'],
  ['Lago Argentino', 'glacial lake', 'glaciers'],
  ['Lago Pehoé', 'turquoise water', 'glaciers'],
  ['Laguna de los Tres', 'glacial tarn', 'glaciers'],
  ['Laguna Torre', 'iceberg lagoon', 'glaciers'],
  ['Lago Nordenskjöld', 'wind-whipped lake', 'glaciers'],
  ['Lago Nahuel Huapi', 'fjord-like lake arms', 'glaciers'],
  ['Marble Caves of Lago General Carrera', 'swirling marble walls', 'falls'],
  ['Cordillera Darwin', 'icefield spilling to the sea', 'glaciers'],
  ['Laguna Esmeralda', 'glacial-milk tarn', 'glaciers'],
  ['Patagonian steppe', 'rolling grassland to the horizon', 'steppe'],
  ['Tierra del Fuego', 'coastal fjord shore', 'steppe'],
  ['Beagle Channel', 'glacier-flanked strait', 'steppe'],
  ['Cape Horn', 'storm-scoured headland', 'steppe'],
  ['Península Valdés', 'sea-cliff steppe edge', 'steppe'],
  ['Cotopaxi', 'volcano cone', 'volcanoes'],
  ['Chimborazo', 'glacier-capped summit', 'volcanoes'],
  ['Tungurahua', 'active volcano', 'volcanoes'],
  ['Villarrica', 'steam-plumed volcano', 'volcanoes'],
  ['Osorno', 'symmetrical snow cone', 'volcanoes'],
  ['Lanín', 'volcano cone over Araucaria forest', 'volcanoes'],
  ['Licancabur', 'volcano cone', 'volcanoes'],
  ['Parinacota', 'twin volcano cones over Lago Chungará', 'volcanoes'],
  ['Sajama', 'volcano cone', 'volcanoes'],
  ['Ojos del Salado', 'highest volcano on Earth', 'volcanoes'],
  ['Cayambe', 'glaciated volcano', 'volcanoes'],
  ['Aconcagua', 'peak', 'peaks'],
  ['Huayna Potosí', 'summit', 'peaks'],
  ['Illimani', 'triple-summit massif', 'peaks'],
  ['Huascarán', 'twin summits', 'peaks'],
  ['Alpamayo', 'fluted ice pyramid', 'peaks'],
  ['Artesonraju', 'ice pyramid', 'peaks'],
  ['Ausangate', 'glaciated massif', 'peaks'],
  ['Cordillera Blanca', 'snow-capped peak chain', 'peaks'],
  ['Cordillera Huayhuash', 'ice-fluted peaks', 'peaks'],
  ['Siula Grande', 'west face', 'peaks'],
  ['Nevado Pisco', 'summit', 'peaks'],
  ['Salar de Uyuni', 'mirror flat', 'salt'],
  ['Salar de Uyuni dry season', 'hexagonal salt-polygon crust', 'salt'],
  ['Incahuasi Island', 'cactus-studded rock island in the salt flat', 'salt'],
  ['Tunupa', 'volcano doubled in the salt-flat mirror', 'salt'],
  ['Salinas Grandes', 'blinding salt flat', 'salt'],
  ['Salar de Atacama', 'crusted salt basin', 'salt'],
  ['Salar de Surire', 'flamingo salt flat', 'salt'],
  ['Laguna Colorada', 'red waters', 'lagunas'],
  ['Laguna Verde', 'mineral lake', 'lagunas'],
  ['Laguna Hedionda', 'flamingo lagoon', 'lagunas'],
  ['Laguna Chaxa', 'flamingo lagoon in the salt crust', 'lagunas'],
  ['Laguna Miscanti', 'high-altitude blue lake', 'lagunas'],
  ['Lago Chungará', 'high lake under twin volcanoes', 'lagunas'],
  ['Laguna Parón', 'turquoise glacial lake', 'lagunas'],
  ['Laguna 69', 'turquoise tarn under ice walls', 'lagunas'],
  ['Quilotoa', 'crater lake', 'lagunas'],
  ['Valle de la Luna', 'eroded salt-and-gypsum ridges', 'atacama'],
  ['Valle de la Muerte', 'red dune valley', 'atacama'],
  ['El Tatio', 'geyser field', 'atacama'],
  ['Piedras Rojas', 'red rock shore', 'atacama'],
  ['Sol de Mañana', 'boiling mud and fumarole field', 'atacama'],
  ['Árbol de Piedra', 'wind-carved rock in the Siloli desert', 'atacama'],
  ['Quebrada de Humahuaca', 'hill of seven colours', 'atacama'],
  ['Campo de Piedra Pómez', 'white pumice field', 'atacama'],
  ['Cono de Arita', 'pyramid cone on the salt flat', 'atacama'],
  ['Vinicunca', 'rainbow-striped mountain', 'atacama'],
  ['Colca Canyon', 'canyon walls', 'atacama'],
  ['Ischigualasto', 'moonscape badlands', 'atacama'],
  ['Talampaya', 'red sandstone canyon', 'atacama'],
  ['Amazon canopy', 'emergent layer', 'amazon'],
  ['Amazon blackwater', 'tributary through flooded forest', 'amazon'],
  ['Meeting of the Waters', 'two-toned river confluence', 'amazon'],
  ['Pantanal', 'wetland at flood', 'amazon'],
  ['Caño Cristales', 'rainbow river', 'amazon'],
  ['Cocora Valley', 'wax palms', 'amazon'],
  ['Lençóis Maranhenses', 'dune field with rain lagoons', 'amazon'],
  ['Chapada Diamantina', 'sandstone mesas', 'amazon'],
  ['Iguazu Falls', 'cataract', 'falls'],
  ['Kaieteur Falls', 'single-drop cataract', 'falls'],
  ['Angel Falls', 'tepui plunge', 'falls'],
  ['Mount Roraima', 'tepui mesa', 'falls'],
  ['Gran Sabana', 'tepui tabletops over savanna', 'falls'],
  ['Petrohué Falls', 'basalt-channel rapids', 'falls'],
];
const LIGHT = [
  'alpenglow',
  'sunrise',
  'golden hour',
  'blue-hour',
  'midday',
  'sunset',
  'dawn',
  'storm light',
  'sea-of-clouds dawn',
  'late-afternoon rake light',
];
const LIGHT_RULES = [
  ['sea-of-clouds dawn', /sea[- ]of[- ]clouds/i],
  ['alpenglow', /alpenglow/i],
  ['blue-hour', /blue[- ]hour/i],
  ['golden hour', /golden[- ]hour/i],
  ['late-afternoon rake light', /rake[- ]light|afternoon light|side-rake|late afternoon/i],
  ['storm light', /storm/i],
  ['sunrise', /sunrise|first[- ]light/i],
  ['sunset', /sunset/i],
  ['dawn', /dawn|pre-dawn/i],
  ['midday', /midday|noon/i],
];
const FRAME = ['foreground', 'midground', 'distant'];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
const placeNames = PLACES.map((p) => p[0]).sort((a, b) => b.length - a.length);
const PLACE_RE = new RegExp(
  `(${placeNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'i'
);
const canonPlace = (raw) => placeNames.find((n) => n.toLowerCase() === raw.toLowerCase()) || raw;
function parse(text) {
  const head = text.split(',')[0];
  const m = head.match(PLACE_RE);
  const place = m ? canonPlace(m[1]) : head.split(' at ')[0].trim().toLowerCase();
  const lm = text.match(/\bat ([a-z][a-z -]{2,40}?)(?:,| the | with )/i);
  let light = null;
  for (const [k, re] of LIGHT_RULES)
    if (re.test(lm ? lm[1] : head)) {
      light = k;
      break;
    }
  if (!light)
    for (const [k, re] of LIGHT_RULES)
      if (re.test(text)) {
        light = k;
        break;
      }
  return { keys: [`place:${place}`, `light:${light || 'none'}`], place, light: light || 'none' };
}
function sameGroup(a, b) {
  return a.place === b.place && a.light === b.light;
}

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['place']));
}
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
    // the recipe's coverage decides the group; the least-used place inside it decides the place
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

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a landscape-photography bot: South American raw nature, one real place per entry, gallery-print tier. Every entry is ONE composition in 30-55 words, one line, comma-separated phrases. Keep EXACTLY this shape:

<Place> <its hero feature> at <light moment>, <one vivid sentence of what that hero looks like in that light>, foreground <a close real detail of that place at the near edge>, midground <the hero or a second real feature>, distant <atmospheric depth of the real surroundings>, <sky in one or two words>

Examples already in the pool (match their voice, structure and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- LEAD with the place name given, then its hero feature, then "at <light moment>" exactly as given. Everything else must be true of that real place (its real rock, ice, water, plants, colours); name a real neighbouring feature for the distant tier when you can.
- Wild nature only: no people, gauchos, villages, huts, fences, roads, vehicles, refugios; no ruins or heritage stonework of any kind; no photographer names; no comparisons to other continents. Describe only what is present; write no negative words.
- 30-55 words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. place "${a.place}"; hero feature "${a.feature}"; light moment "${a.light}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
const formatRe = /^[A-ZÁÉÍÓÚÑ][^,]{6,90} at [a-z][a-z -]{2,40},.{100,}$/;
const BANS = [
  ['photographer', /\b(Adamus|Max Rive|Kordan|Pie Aerts|Belegurschi|Peter Lik|Dros|Dyar)\b/i],
  [
    'heritage',
    /\b(Machu Picchu|Sacsayhuam|Inca|ruins?|terraces|stonework|temple|citadel|fortress)\b/i,
  ],
  [
    'person',
    /\b(person|people|gaucho|gauchos|hiker|hikers|climber|climbers|village|villages|hut|huts|fence|fences|road|roads|vehicle|truck|refugio|boat|boats|tent|camp)\b/i,
  ],
  ['analogue', /\b(Alps-like|Alpine-style|Yosemite|Alaska-like|Himalaya-like|Norway-like)\b/i],
  ['unreal', /\b(portal|sci-fi|fantasy|alien|magical|bioluminescent)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.place !== a.place) p.push(`place ${parsed.place}≠${a.place}`);
  if (parsed.light !== a.light) p.push(`light ${parsed.light}≠${a.light}`);
  if (!cand.startsWith(a.place)) p.push('place not leading');
  const words = cand.split(/\s+/).length;
  if (words < 28 || words > 60) p.push(`${words} words`);
  for (const f of FRAME)
    if (!new RegExp(f, 'i').test(cand) && !(f === 'midground' && /mid-distance/i.test(cand)))
      p.push(`no ${f}`);
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
    return Object.keys(o).length;
  };
  return { places: t('place'), lights: t('light') };
}

module.exports = {
  name: 'earthbot/andes_patagonia/subject',
  poolFile,
  basis: 'scene = the named place + its light moment; same when both match; greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [180, 480],
};
