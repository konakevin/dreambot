#!/usr/bin/env node
/**
 * audit-seed-category-gaps.js — what can a bot NOT render at all?
 *
 * This exists because pool DEPTH turned out to be invisible. At 2 posts/day across ~30 paths, a
 * path posts about every two weeks, so a 25-entry pool recurs every ~388 days and a 50-entry pool
 * every ~850. Nobody ever sees a repeat, and topping thin pools up buys nothing a viewer can
 * perceive. What a viewer DOES notice is a whole category that never appears:
 *
 *   FaeBot has 17 weather + foreground pools and 14 of them contain ZERO sun, ZERO storm and
 *   ZERO rainbow.
 *
 * ############################################################################################
 * # THE ANSWER IS: THERE ARE NO CATEGORY GAPS IN THE FLEET. Do not spend money here. (2026-09-22)
 * ############################################################################################
 *
 * This script was written to find more holes like that FaeBot one. It found none, and in the
 * process it showed that the FaeBot finding itself was WRONG. Both the per-pool result and the
 * conclusion drawn from it are recorded here so the reasoning is not repeated.
 *
 * 1. PER-POOL ZEROES ARE NOT GAPS, because these bots use MULTI-AXIS designs where one axis
 *    deliberately omits what a sibling axis covers. EarthBot's `*_atmosphere` pools have zero
 *    rainbows -- and EarthBot has a dedicated `*_phenomenon` axis that carries rainbows, aurorae
 *    and lightning. The `*_atmosphere` axis is haze, dust and humidity. That is correct division
 *    of labour, and every per-pool "gap" on EarthBot was this.
 * 2. AT BOT LEVEL, ACROSS EVERY WIRED POOL, ALL 18 LIVE BOTS ALREADY COVER ALL 11 CATEGORIES
 *    (sun, storm, rain, fog, snow, wind, rainbow, night, interior, underground, water). Zero true
 *    gaps.
 * 3. THE FAEBOT CLAIM WAS FALSE. "FaeBot cannot render sun, storms or rainbows" was repeated to
 *    Kevin and was wrong: FaeBot has 107 storm mentions in wired pools, including a `STORMY DUSK`
 *    entry in `faebot_castle_village_lighting` reading "dark dramatic violet-grey storm clouds, a
 *    bright shaft of gold breaking through low". Storms do reach renders, through lighting and
 *    composition axes rather than the weather axis.
 * 4. FREQUENCY, not presence, is the metric that predicts what a viewer sees -- and it is healthy
 *    almost everywhere: most bots mention each category in 1-7% of their entries, which is roughly
 *    "every 15th to every 100th post". The single genuine outlier is FarmBot storms: 2 entries in
 *    9,234 (0.0%). One finding, worth about a dollar.
 *
 * WHAT THIS MEANS FOR SPEND. Neither pool DEPTH nor category COVERAGE is worth money. Depth is
 * invisible (a 25-entry pool recurs every ~388 days at 2 posts/day across ~30 paths) and coverage
 * is already fine. The things that visibly change a bot are: fixing what is IN the frame (the
 * TinyBot empty-room cast lever), new buckets, and new paths.
 *
 * HOW TO USE IT ANYWAY. It is still the right tool for a SINGLE axis you are deliberately
 * designing (is this new weather pool actually covering the range?). Just never read a per-pool
 * zero as a defect without checking the path's sibling axes first.
 *
 * The check is deliberately crude in one direction only: it reports a category as MISSING only at
 * ZERO or near-zero coverage. A low count is not a finding (a pool is allowed to favour its
 * subject), but a zero on a category the axis exists to vary is a hole.
 *
 * Counting is INDEPENDENT per category. An earlier pass used exclusive buckets with a break on
 * first match and got the wrong answer on two pools: "front-and-center" matched 100% of a
 * hummingbird pool so the loop never checked that those same entries also said "hovering" (99%)
 * and "mid-flight" (97%). One entry can and should satisfy several categories.
 *
 * Usage:
 *   node scripts/audit-seed-category-gaps.js --wired /tmp/wiring.json
 *   node scripts/audit-seed-category-gaps.js --wired /tmp/wiring.json --bot faebot -v
 *   node scripts/audit-seed-category-gaps.js --wired /tmp/wiring.json --json /tmp/gaps.json
 */
const fs = require('fs');
const path = require('path');
const { textOf } = require('./lib/seedDupeLint');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const JSON_OUT = flag('--json');
const VERBOSE = argv.includes('-v') || argv.includes('--verbose');
const MIN = parseInt(flag('--min', '40'), 10); // too small to judge below this
const ZERO_PCT = parseFloat(flag('--zero', '2')); // <= this % counts as "missing"
// Opt-in only. See CONTEXT_DEPENDENT below: these two families cannot be judged without reading
// the path, and produced six confident false positives on ChibiBot when they ran by default.
const WITH_CONTEXT = argv.includes('--with-context-dependent');

const LIVE = new Set([
  'bloombot', 'brickbot', 'chibibot', 'dinobot', 'dragonbot', 'dreambot', 'earthbot', 'faebot',
  'farmbot', 'gothbot', 'mangabot', 'oceanbot', 'pixelbot', 'starbot', 'steambot', 'tinybot',
  'toybot', 'yumbot',
]);

/**
 * Axis families. `match` picks the pools this family judges, `categories` are what an axis of that
 * kind exists to vary. Keep the regexes GENEROUS (many synonyms) so a pool that does cover the
 * category is never reported as a hole -- a false MISSING costs money and damages good pools.
 */
/**
 * WHICH FAMILIES ARE TRUSTWORTHY, and why two of them are off by default.
 *
 * A zero is only a finding when it needs NO path context to interpret. Weather, lighting and time
 * qualify: a weather axis with zero storms cannot roll a storm, full stop, whatever else the path
 * does.
 *
 * `cast / companion` and `activity / action` do NOT qualify, and shipping them on by default
 * produced six confident false positives on ChibiBot alone:
 *   - `creature_portrait_backgrounds` and `creature_portrait_expressions` were flagged for not
 *     being verb-led. A background and an expression should not be verb-led.
 *   - `chibi_halloween_outing_creature` was flagged at 0% verb-led, but it is an APPEARANCE axis
 *     (species, fur, ears, eyes) and its path rolls a SEPARATE `..._activity` pool. The path's own
 *     header reads "a little band of 2-3 chibi creature friends mid-action". Nothing was wrong.
 * The real TinyBot find came from READING the four paths (an optional cast at 55%, a static-pose
 * pool, a failure condition enforcing blur), not from counting verbs. Keep them behind the flag.
 */
const CONTEXT_DEPENDENT = new Set(['cast / companion', 'activity / action']);

const FAMILIES = [
  {
    key: 'weather',
    match: /(weather|atmospher|_air$|climate)/i,
    note: 'a weather axis that cannot roll these is stuck in one condition forever',
    categories: {
      'sun / shafts': /sunbeam|sunlit|sunlight|sun-shaft|shaft of|shafts of|dappl|godray|god-ray|backlit|golden.hour|blazing|glare|harsh light|bright noon|midday sun/i,
      storm: /storm|thunder|lightning|squall|tempest|gale|downpour|cloudburst/i,
      'rain / wet': /\brain|drizzle|shower|droplet|wet |beaded|dripping|puddle|damp/i,
      'fog / mist': /\bfog|mist|haze|vapour|vapor|smog|murk/i,
      'snow / frost': /snow|frost|ice|icicle|hail|sleet|rime/i,
      wind: /wind|breeze|gust|blowing|whipping|buffet|blustery/i,
      'clear / calm': /clear sky|cloudless|still air|calm|windless|open sky|blue sky/i,
      'rainbow / prism': /rainbow|prism|spectrum|sun-dog|sundog|halo|iridescen|refract/i,
    },
  },
  {
    key: 'lighting',
    match: /(lighting|_light$|_lights$|lightcolor|illuminat)/i,
    note: 'a lighting axis that cannot roll these renders one mood forever',
    categories: {
      daylight: /daylight|midday|noon|afternoon sun|broad day|overcast|cloudy/i,
      'golden / warm': /golden|warm|amber|honey|sunset|sunrise|dusk|dawn/i,
      night: /night|moonlit|moonlight|starlight|after dark|midnight/i,
      'backlit / rim': /backlit|back-lit|rim.light|silhouett|contre-jour|halo/i,
      'artificial / practical': /lantern|lamp|candle|neon|bulb|firelight|torch|screen-glow|practical/i,
      'hard / dramatic': /hard light|harsh|high.contrast|chiaroscuro|dramatic|spotlight|shaft/i,
    },
  },
  {
    key: 'time of day',
    match: /(time_of|_time$|_hour|daypart)/i,
    note: 'a time axis missing a slot never shows that hour',
    categories: {
      dawn: /dawn|sunrise|first light|daybreak|early morning/i,
      day: /midday|noon|afternoon|daytime|broad day|morning/i,
      dusk: /dusk|sunset|twilight|golden hour|evening|gloaming/i,
      night: /night|midnight|after dark|small hours|moonlit/i,
    },
  },
  {
    key: 'cast / companion',
    match: /(_cast$|companion|_crew$|_folk$|creature|inhabitant|dweller|wildlife|_friends$)/i,
    note: 'THE PROVEN LEVER: a cast that is only ever POSED gives a frame with nothing happening in it (TinyBot, 2026-09-22)',
    categories: {
      // A verb-led cast is the whole point. The TinyBot fix turned optional static poses into
      // mandatory mid-action ones and Kevin graded the result "much better and more interesting".
      'doing something (verb-led)':
        /\b(carrying|hauling|climbing|sweeping|stirring|pouring|tending|watering|hanging|pegging|cranking|hammering|sawing|building|digging|planting|reaching|leaning|pulling|pushing|lifting|opening|closing|knitting|reading|writing|cooking|baking|feeding|paddling|rowing|steering|waving|signalling|signaling|kindling|lighting|polishing|mending|measuring|checking|hunting|chasing|darting|diving|sipping|drinking|grazing|nudging|towing|balancing|tiptoe|mid-flight|mid-motion|mid-stride)\b/i,
      'interacting with the set':
        /\b(at the|on the|into the|through the|against the|from the|under the|over the|up the|down the|across the|beside the)\b/i,
      'more than one': /\btwo |\bthree |\bpair |\bboth |\btogether\b|each other|one another/i,
    },
  },
  {
    key: 'activity / action',
    match: /(_activity$|_action$|_beats$|_event$|_moment)/i,
    note: 'an action axis with no verbs is a list of nouns',
    categories: {
      'verb-led': /\b\w+ing\b/i,
      'two or more involved': /\btwo |\bpair |\btogether\b|each other|one another|group/i,
    },
  },
  {
    key: 'setting / place',
    match: /(_setting$|_scene$|_scenes$|_place$|_location|environment|_backdrop$|_domain$)/i,
    note: 'a setting axis with no interiors (or no exteriors) can only ever go one place',
    categories: {
      interior: /indoor|interior|inside|room|kitchen|parlour|parlor|hall|attic|cellar|shop|workshop|library|bedroom|cabin interior|under a roof/i,
      exterior: /outdoor|outside|field|forest|street|shore|meadow|hill|sky|garden|road|yard|open air/i,
      water: /\bsea|ocean|lake|river|pond|stream|harbour|harbor|shore|coast|waterfall|lagoon/i,
      'high / vertical': /cliff|peak|summit|tower|rooftop|canopy|mountain|spire|balcony|bridge/i,
      'enclosed / underground': /cave|cavern|tunnel|burrow|hollow|grotto|mine|crypt|vault|beneath/i,
    },
  },
];

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

const findings = [];
const examined = { pools: 0, entries: 0 };

for (const bot of (ONLY ? [ONLY] : fs.readdirSync(ROOT)).sort()) {
  if (!ONLY && !LIVE.has(bot)) continue;
  const seedDir = path.join(ROOT, bot, 'seeds');
  if (!fs.existsSync(seedDir)) continue;
  for (const f of fs.readdirSync(seedDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const pool = f.replace(/\.json$/, '');
    if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(pool)) continue;
    const fam = FAMILIES.find((x) => x.match.test(pool));
    if (!fam) continue;
    if (CONTEXT_DEPENDENT.has(fam.key) && !WITH_CONTEXT) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(seedDir, f), 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(data)) continue;
    const texts = data.map(textOf).filter((t) => t && t.trim());
    if (texts.length < MIN) continue;
    examined.pools++;
    examined.entries += texts.length;

    const cov = {};
    const gaps = [];
    for (const [name, re] of Object.entries(fam.categories)) {
      const n = texts.filter((t) => re.test(t)).length; // INDEPENDENT count, no break
      const pct = (n / texts.length) * 100;
      cov[name] = { n, pct: Math.round(pct) };
      if (pct <= ZERO_PCT) gaps.push(name);
    }
    if (gaps.length) findings.push({ bot, pool, family: fam.key, n: texts.length, gaps, cov, note: fam.note });
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  `Examined ${examined.pools} wired axis pools (${examined.entries.toLocaleString()} entries) on live bots.\n` +
    `A category counts as MISSING at <=${ZERO_PCT}% coverage. Pools under ${MIN} entries are skipped.\n`
);

// Rank by how much a bot cannot do: a gap repeated across many of a bot's pools is systemic.
const byBotFam = new Map();
for (const r of findings) {
  for (const g of r.gaps) {
    const k = `${r.bot}|${r.family}|${g}`;
    const e = byBotFam.get(k) || { bot: r.bot, family: r.family, gap: g, pools: 0, entries: 0, note: r.note };
    e.pools++;
    e.entries += r.n;
    byBotFam.set(k, e);
  }
}
const systemic = [...byBotFam.values()].filter((e) => e.pools >= 2).sort((a, b) => b.pools - a.pools);

console.log('── SYSTEMIC GAPS (the same category missing from 2+ of that bot\'s pools) ──');
console.log(pad('bot', 11) + pad('axis family', 20) + pad('missing category', 28) + 'pools  entries');
for (const e of systemic) {
  console.log(
    pad(e.bot, 11) + pad(e.family, 20) + pad(e.gap, 28) + String(e.pools).padStart(5) + String(e.entries).padStart(9)
  );
}

console.log(`\n── per-bot summary ──`);
const perBot = new Map();
for (const e of systemic) perBot.set(e.bot, (perBot.get(e.bot) || 0) + 1);
for (const [bot, n] of [...perBot].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pad(bot, 11)} ${n} systemic gap${n > 1 ? 's' : ''}`);
}

if (VERBOSE) {
  console.log('\n── per-pool detail ──');
  for (const r of findings.sort((a, b) => b.gaps.length - a.gaps.length)) {
    console.log(`\n${r.bot}/${r.pool}  (${r.n} entries, ${r.family})`);
    for (const [name, v] of Object.entries(r.cov)) {
      console.log(`   ${v.pct <= ZERO_PCT ? 'MISSING ' : '        '}${pad(name, 28)}${String(v.pct).padStart(3)}%`);
    }
  }
}

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify({ examined, findings, systemic }, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}
