/* global __dirname */
/**
 * mangabot / game-center-arcade / room (Track B: GROW from 25 to 100+) — the hero of the path: the
 * game-centre FLOOR as its own place. Every entry = the shared composition LOCK (two or three machines
 * so close their glass fills the near half, everything else a band across the top) + a variable TAIL:
 * the machine dressing on every machine ("… so the near wall reads as glass, fur and chrome"), ONE
 * spatial feature that makes this floor its own place with a low-ceiling clause, and the dark polished
 * floor giving it back, ending on one small placed detail. 160-190 words in the originals.
 *
 * Same idea = the ROOM FEATURE (a mirrored pillar, a stair head, a change counter, a curtained booth,
 * a two-level step …). The 25 originals are kept byte-identical; Sonnet writes only the TAIL for a new
 * entry (the config prepends the LOCK in `normalize`), each with one unused feature from the roster.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/mangabot/seeds/game_center_arcade_room.json');

const LOCK =
  'Two or three tall machines stand SO CLOSE that their glass fills the whole near half of the picture, one continuous wall of glass and heaped fur that runs off BOTH side edges of the frame, and everything beyond them is squeezed into a BAND across the top of the picture — and on every one of them, ';
const LOCK_RE = /^Two or three tall machines stand SO CLOSE[^—]*—\s*(?:and )?on every one of them,?\s*/;
const tailOf = (text) => text.replace(LOCK_RE, '');

const F = (words, re, original) => ({ words, re, original: !!original });
const FEATURES = {
  // ── the 25 originals: rules only, never assigned ──
  'prize-shelf wall': F('', /wall of prize shelves/i, true),
  'mirrored pillar': F('', /mirrored pillar/i, true),
  'stair head': F('', /stair head|narrow upper floor/i, true),
  corner: F('', /corner leaves|turning-space|round the corner/i, true),
  'open street doors': F('', /open to the street|doors standing open/i, true),
  'stool row': F('', /row of small stools/i, true),
  partition: F('', /partition/i, true),
  'mirrored wall': F('', /mirrored wall/i, true),
  'change counter': F('', /change counter/i, true),
  'curtained booth': F('', /curtained booth/i, true),
  'lit prize shelf': F('', /lit prize shelf/i, true),
  mezzanine: F('', /mezzanine/i, true),
  'fur canopy': F('', /fur canopy|hung in rows from a grid/i, true),
  'wet entrance mat': F('', /entrance mat/i, true),
  'end bay': F('', /end bay/i, true),
  'quiet back row': F('', /quiet back row/i, true),
  'ventilation duct': F('', /fat ventilation duct/i, true),
  'window wall': F('', /wall of windows/i, true),
  'central cluster': F('', /cluster of machines/i, true),
  'upper landing': F('', /upper landing/i, true),
  streamers: F('', /swagged paper streamers hang just above/i, true),
  'central bench': F('', /low bench runs down the middle/i, true),
  'dark machine': F('', /dark and unplugged/i, true),
  'two-level step': F('', /wide low step/i, true),
  // ── the roster for new entries: what makes this floor its own place ──
  'basement stair': F('a stair going down to a basement floor, its steps lit from below and machines glowing at the bottom', /basement stair|stair going down|down to a basement/i),
  escalator: F('an escalator rising to the floor above, its steps lit along the edges, machines glowing at the top', /escalator/i),
  'photo-booth row': F('a row of photo booths along the back wall, curtains drawn, light leaking under each', /photo booth|photo-booth/i),
  'coin changer': F('a tall coin-changer machine set into a pillar, its slot lit, a tray of coins below', /coin[- ]changer|coin changer machine/i),
  'prize counter': F('a prize counter with a staff window at the far end, giant plush stacked behind it', /prize counter/i),
  'giant crane': F('a giant two-storey crane machine at the end of the run, one huge plush under its claw', /giant .{0,20}crane|two-storey crane/i),
  'medal pushers': F('a bank of medal-pusher machines with coins shelving toward the drop, medals heaped inside', /medal[- ]pusher|pusher machines/i),
  'rhythm stage': F('a raised stage of rhythm-game machines with drum pads and lit dance floors, steps up to it', /rhythm|drum-game|dance floors/i),
  'driving bay': F('a bay of driving-game seats with wheels and pedals, the seats facing away', /driving[- ]game|driving bay/i),
  'fighting cabinets': F('a double row of fighting-game cabinets set back to back, stools at each', /fighting[- ]game|cabinets set back to back/i),
  'punching machine': F('a punching machine with a hanging pad at the end of the row, its column of lamps lit', /punching machine/i),
  'hoop game': F('a basketball-hoop game with balls rolling back down its ramp, netted at the sides', /basketball|hoop game/i),
  'air hockey': F('an air-hockey table under its own lamp, pucks lying on the surface', /air[- ]hockey/i),
  'pinball row': F('a row of pinball tables against the wall, their backglasses glowing, flippers lit', /pinball/i),
  'turntable crane': F('a crane machine on a slowly rotating turntable at the centre of the floor', /turntable/i),
  'whack-a-mole': F('a whack-a-mole table with padded mallets on cords, its holes lit from inside', /whack-a-mole|mallets on cords/i),
  'gachapon wall': F('a wall of capsule-toy machines stacked four high, every dome full of capsules', /capsule-toy machines|stacked four high|gachapon/i),
  'speaker column': F('a column of speakers rising floor to ceiling, their cones lit at the rim', /column of speakers|speaker column/i),
  'mirror ceiling': F('a mirror ceiling doubling the whole bank of machines upside down overhead', /mirror ceiling|mirrored ceiling/i),
  'open truss': F('an open steel truss ceiling with lamps clipped to the beams, cables looped between', /truss/i),
  'sprinkler pipes': F('red sprinkler pipes running the length of the ceiling, dripping in one place', /sprinkler/i),
  'water-stained tile': F('a ceiling of tiles with one brown water stain spreading from a corner, a bucket below', /water stain|water-stained/i),
  'raised platform': F('a raised platform along one wall carrying a second rank of machines, a step up to it', /raised platform/i),
  'sunken pit': F('a sunken pit in the floor holding a ring of machines, two steps down to it', /sunken pit|two steps down/i),
  'balcony rail': F('a balcony rail above with machines glowing along the floor overhead', /balcony/i),
  'spiral stair': F('a spiral stair of chequered steel rising through the ceiling at one side', /spiral stair/i),
  'lift lobby': F('a lift lobby opening off the floor, its steel doors closed and lit', /lift lobby|lift doors|elevator/i),
  'fire door': F('a fire door propped open with a soft toy, a concrete stairwell beyond it', /fire door/i),
  'exit corridor': F('a long exit corridor leading away between the machines to a lit door at its end', /exit corridor/i),
  'service door': F('a plain grey service door standing ajar, a strip of white light from a back room', /service door/i),
  'office window': F('a back-office window in the wall with blinds half lowered, a desk lamp behind them', /office window/i),
  'stockroom door': F('a stockroom door open on stacked cardboard boxes of plush, one box split', /stockroom/i),
  'plush dolly': F('a loading dolly stacked with sealed boxes of plush parked between two machines', /dolly/i),
  ladder: F('a stepladder leaning against a machine with its top glass lifted for restocking', /stepladder|ladder/i),
  'open maintenance panel': F('a machine with its back panel open, wiring and a circuit board lit inside', /back panel open|maintenance panel|circuit board/i),
  'restocking cart': F('a restocking cart heaped with loose plush left mid-aisle', /restocking cart/i),
  'paper lanterns': F('a row of round paper lanterns hung along the ceiling, each lit from inside', /paper lanterns?/i),
  'capsule strings': F('strings of empty capsules hung from the ceiling in long swaying chains', /strings of empty capsules|capsule strings/i),
  'mirror ball': F('a mirror ball turning slowly at the ceiling, its spots crawling over the machines', /mirror ball|disco ball/i),
  'neon border': F('a border of neon tube running around the ceiling edge of the whole room', /neon tube|neon border/i),
  'inflatable mascot': F('a giant inflatable mascot balloon wedged under the ceiling at the far end', /inflatable/i),
  'plush cage': F('a chain-link cage in the corner heaped to the top with plush', /chain-link cage|plush cage/i),
  'oversized plush': F('a display of oversized plush taller than the machines, standing along the wall', /oversized plush/i),
  tinsel: F('tinsel garlands looped from machine to machine along the whole bank', /tinsel/i),
  balloons: F('bunches of balloons tied to the corner of every machine, bobbing at the ceiling', /balloons/i),
  'carpet strip': F('a strip of patterned carpet running down the aisle between the ranks', /carpet/i),
  'floor drain': F('a floor drain at the centre of the aisle with the room\'s colours pooling round it', /floor drain/i),
  'cable cover': F('a yellow rubber cable cover running across the floor between two machines', /cable cover/i),
  'yellow cone': F('a yellow floor cone standing in the aisle beside a wet patch', /yellow (?:floor )?cone/i),
  'half shutter': F('a steel shutter half lowered across the street entrance, the night showing under it', /shutter/i),
  'stairwell window': F('a stairwell window at the side showing the wet night street from above', /stairwell window/i),
  skylight: F('a skylight in the low ceiling, black night and rain drops on its glass', /skylight/i),
  'pachinko doorway': F('a doorway through to a pachinko hall, brighter and louder, machines glowing beyond', /pachinko/i),
  'restaurant corridor': F('a corridor to a food court at the far side, its counter lamps glowing', /food court|restaurant corridor/i),
  'vending alcove': F('an alcove of drinks vending machines glowing side by side, a bench in front', /vending machines|drinks vending/i),
  'projector beam': F('a projector beam crossing the room to a screen of moving colour on the far wall', /projector/i),
  'curved bank': F('the bank of machines curving round in an arc, every glass angled toward the centre', /curving round in an arc|curved bank/i),
  ramp: F('a shallow ramp between two floor levels with a handrail down its middle', /shallow ramp|ramp/i),
  'half wall': F('a waist-high half wall dividing the floor with a stone cap, machines either side', /half wall|half-wall/i),
  'cash desk': F('a cash desk at the entrance with a wall of plush behind it and a tray of tokens', /cash desk/i),
  'lost-and-found shelf': F('a lost-and-found shelf by the door with umbrellas and a single glove', /lost-and-found|lost and found/i),
  'umbrella stand': F('an umbrella stand by the door crowded with dripping umbrellas', /umbrella stand/i),
  lockers: F('a bank of coin lockers along one wall, two doors hanging open', /lockers/i),
  'cushioned bench': F('a cushioned bench along the wall with a few won plush lined up on it', /cushioned bench/i),
  'potted palm': F('a tall potted palm between two machines, its fronds lit from below', /potted palm/i),
  aquarium: F('an aquarium set into the wall, fish drifting through blue light', /aquarium/i),
  'ceiling fans': F('a cluster of ceiling fans turning slowly under the low ceiling', /ceiling fans/i),
  'glass-block wall': F('a wall of glass blocks glowing with the colours of the machines behind it', /glass block|glass-block/i),
  'tiled column': F('a column of small white tiles at the centre of the run, a fire hose reel bolted to it', /tiled column|column of small white tiles/i),
  'exposed brick': F('an exposed brick wall behind the bank, painted over in one flat colour', /exposed brick/i),
  'mural wall': F('a wall painted with a giant cartoon mural of plush creatures behind the machines', /mural/i),
  'low arch': F('a low arch between two rooms with more machines glowing through it', /low arch/i),
  'sliding partition': F('a sliding partition half drawn across the floor, machines on both sides', /sliding partition/i),
  'four-sided island': F('a four-sided crane-machine island at the centre with glass on every face', /four-sided|island at the centre/i),
  'grey door': F('a plain grey door in the back wall with a round window, light behind it', /plain grey door|round window/i),
  'shoe lockers': F('a bank of shoe lockers by the entrance with a raised wooden step', /shoe lockers/i),
  bicycle: F('a bicycle wheeled inside the door and leant against the first machine', /bicycle/i),
  'capsule boxes': F('a delivery of capsule boxes stacked waist high just inside the door', /capsule boxes|delivery of/i),
  'rain window': F('a single window at the side with rain running down it, the machines doubled in it', /rain (?:running|streaking|sliding|sheeting|streaming) down|rain-streaked|single window/i),
  'mirror corridor': F('a corridor of mirrors leading off the floor, the machines repeating into it', /corridor of mirrors/i),
  tunnel: F('a low tunnel through to the next hall, its ceiling lit with strip lights', /low tunnel|tunnel through/i),
  'hose reel': F('a red fire hose reel on the wall between two machines', /hose reel/i),
  'security dome': F('a security mirror dome at the ceiling corner holding the whole room in miniature', /security mirror|mirror dome/i),
  'water dispenser': F('a water dispenser with paper cups standing at the end of the bank', /water dispenser/i),
  'folding chairs': F('a stack of folding chairs leant against the wall at the end of the run', /folding chairs/i),
  'dj booth': F('a raised booth with a desk of lit dials overlooking the floor', /raised booth|desk of lit dials/i),
  'strip lights': F('long strip lights in a grid across the ceiling, half of them off', /strip lights/i),
};

const head3 = (text) => tailOf(text);
function parse(text) {
  const t = head3(text);
  let best = null;
  let at = Infinity;
  for (const [k, f] of Object.entries(FEATURES)) {
    const m = t.match(f.re);
    if (m && m.index < at) {
      at = m.index;
      best = k;
    }
  }
  const feature = best || 'floor';
  return { keys: [`feature:${feature}`], feature };
}
const sameGroup = (a, b) => a.feature === b.feature;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['room']));
}
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const taken = (k) => groups.some((g) => (g.assignment ? g.assignment.feature : g.feature) === k);
  const free = shuffle(Object.keys(FEATURES).filter((k) => !FEATURES[k].original && !taken(k)));
  const feature = byUsage(free, usage, (k) => 'feature:' + k)[0];
  if (!feature) return null;
  return { keys: [`feature:${feature}`], feature, words: FEATURES[feature].words, tags: [feature] };
}
function examples(kept, texts) {
  return kept.slice(0, 6).map((k) => tailOf(texts[k]));
}
const normalize = (text) => {
  const t = text.trim().replace(LOCK_RE, '');
  return LOCK + t.charAt(0).toLowerCase() + t.slice(1);
};
function brief(batch, ex) {
  return `You write entries for one pool of an anime-background bot: MangaBot's game-centre path, the ROOM axis: the arcade floor as its own place at night. Every entry has a fixed opening the tool adds itself; you write ONLY the continuation after "… and on every one of them, " — 100-130 words, in exactly the three-sentence shape of the examples:

Examples of the continuation already in the pool (match their voice and shape exactly):
${ex.map((e) => '- ' + e).join('\n')}

Rules:
- Sentence 1 (continues the opening, lower-case start): the dressing on every machine, two or three of: glass fronts heaped full of soft toys pressing against the panes / a chrome claw on a cable inside every glass / clear domes crowded with capsules side by side / a row of round bulbs above each glass / rows of round coloured buttons and ball-topped levers along every sloped ledge / soft toys hung by their loops from a bar above every glass / small soft toys crowded along the top of each machine — ending "so the near wall reads as <the materials>."
- Sentence 2: the ROOM FEATURE given for the slot, in your own words and placed in the frame (near side, far end, one side, overhead), plus a low-ceiling clause (tiles, cable trays, ducting, a run of bulbs, a fan) — this is the one thing that makes this floor its own place.
- Sentence 3: "The dark polished floor gives back …" the feature and the bank doubled, "and" one small placed detail belonging to this feature (a toy fallen, wedged, propped or balanced; a coat, a stool, a cable, a worn patch).
- Everything is lit from inside the room at night. No people (the moment axis adds them). No readable words, signs, posters, screens with text, logos or lettering anywhere. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. room feature: "${a.words}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only (each string is the continuation only).`;
}
const formatRe = /^Two or three tall machines stand SO CLOSE .{700,}$/;
const BANS = [
  ['text', /\b(sign|signs|signage|poster|posters|lettering|letters|logo|logos|banner|banners|kanji|words|writing|label|labels|menu)\b/i],
  ['people', /\b(girl|boy|man|woman|player|players|staff|attendant|customer|customers|crowd|friends|schoolgirl|salaryman|kid|kids|child|children)\b/i],
  ['daylight', /\b(daylight|sunlight|sunny|afternoon|morning)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.feature !== a.feature) p.push(`feature ${parsed.feature}≠${a.feature}`);
  const tail = tailOf(cand);
  const words = tail.split(/\s+/).length;
  if (words < 90 || words > 140) p.push(`${words} tail words`);
  if (!/reads as/i.test(tail)) p.push('no "reads as" clause');
  if (!/The dark polished floor/i.test(tail)) p.push('no floor sentence');
  if (!/ceiling/i.test(tail)) p.push('no ceiling clause');
  for (const [n, re] of BANS) {
    const m = tail.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const o = {};
  parsed.forEach((p) => (o[p.feature] = (o[p.feature] || 0) + 1));
  return { feature: o };
}

module.exports = {
  name: 'mangabot/game_center_arcade/room',
  poolFile,
  basis: 'room = the one spatial feature that makes this floor its own place; same when the feature matches; greedy, pool order (the machine dressing and the placed detail are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  examples,
  normalize,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 4,
  lenBand: [780, 1500],
  FEATURES,
  LOCK,
  tailOf,
};
