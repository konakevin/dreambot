/* global __dirname */
/**
 * brickbot / airfield-biplanes / aircraft (Track B: GROW from 25 to 100+) — THE HERO of the path: one
 * brick-built vintage biplane. Every entry = silhouette word + colour + ROLE + engine (a fat cowled
 * rotary ring / a horseshoe cowling over a moulded three-blade propeller / a broad radial ring / a flat
 * inline radiator nose) + cockpits + "smooth unmarked <colour> flanks with one painted <geometric
 * shape> and a round emblem of <pictorial>" + ONE signature gadget for the role in LEGO element words +
 * "stacked plate wings on a Technic-pin strut cage". 55-70 words, one sentence. No real make or
 * model, no lettering or numbers ever, no military hardware.
 *
 * Same idea = the ROLE (barnstormer, airmail, crop-duster, sky-pirate …). The 25 originals are kept
 * byte-identical; each new entry takes one unused role from the roster with its gadget, and draws
 * silhouette, colour, engine, marking and emblem as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/brickbot/seeds/brickbot_airfield_aircraft.json');

const R = (words, gadget, re, original) => ({ words, gadget, re, original: !!original });
const ROLES = {
  // ── the 25 originals: rules only, never assigned ──
  barnstormer: R('', '', /barnstormer/i, true),
  'flying circus': R('', '', /flying-circus|flying circus/i, true),
  'pylon racer': R('', '', /pylon air-racer|pylon racer/i, true),
  airmail: R('', '', /airmail/i, true),
  'jungle expedition': R('', '', /jungle-expedition|jungle expedition/i, true),
  'sky pirate': R('', '', /sky-pirate|sky pirate/i, true),
  'crop duster': R('', '', /crop-duster|crop duster/i, true),
  'naval floatplane': R('', '', /naval floatplane/i, true),
  'tandem trainer': R('', '', /tandem-trainer|tandem trainer/i, true),
  'mountain rescue': R('', '', /mountain-rescue|mountain rescue/i, true),
  'photo survey': R('', '', /photo-survey|photo survey/i, true),
  'banner tow': R('', '', /banner-tow|banner tow/i, true),
  'glider tug': R('', '', /glider-tug|glider tug/i, true),
  freight: R('', '', /freight biplane/i, true),
  'bush plane': R('', '', /bush-plane|bush plane/i, true),
  aerobatic: R('', '', /aerobatic single-seat/i, true),
  'coastal patrol': R('', '', /coastal-patrol|coastal patrol/i, true),
  'rotary scout': R('', '', /rotary-engined scout/i, true),
  'inline racer': R('', '', /inline racer/i, true),
  amphibian: R('', '', /amphibian with a stacked-wedge/i, true),
  'town aerodrome': R('', '', /LEGO-Town aerodrome/i, true),
  triplane: R('', '', /scarlet triplane/i, true),
  'single-wing racer': R('', '', /single-wing racer/i, true),
  'two-seat tourer': R('', '', /two-seat tourer/i, true),
  veteran: R('', '', /veteran biplane/i, true),
  // ── the roster for new entries: a civil role and its ONE signature gadget ──
  'air ambulance': R('air-ambulance biplane', 'a hinged stretcher tray of flat tile plates sliding into a hatch behind the rear cockpit', /air-ambulance|air ambulance/i),
  'fire spotter': R('forest fire-spotter biplane', 'a swivelling brass-coloured spotting scope of round bricks on a Technic turntable behind the cockpit', /fire-spotter|fire spotter/i),
  'weather research': R('weather-research biplane', 'a long instrument boom of Technic axles with a spinning cup-anemometer of dish elements at its tip', /weather-research|weather research|anemometer/i),
  'ice patrol': R('ice-patrol biplane', 'a pair of long ski elements under the wheels and a trans-blue ice-core tube clipped along the flank', /ice-patrol|ice patrol/i),
  'desert mail': R('desert-mail biplane', 'a sand-filter drum of round bricks bolted over the engine intake and twin water cans clipped under the lower wing', /desert-mail|desert mail/i),
  skywriter: R('skywriting biplane', 'a fat smoke canister of stacked round bricks under the belly with a trans-white plume element at its nozzle', /skywrit/i),
  'flying doctor': R('flying-doctor biplane', 'a red-cross-free medical chest of hinged plates strapped to the rear deck', /flying-doctor|flying doctor/i),
  'map maker': R('map-making survey biplane', 'a rolled chart drum of round bricks in a clip rack beside the cockpit', /map-making|map maker|chart drum/i),
  'newspaper drop': R('newspaper-delivery biplane', 'a bundle chute of slope bricks under the fuselage with a tied paper bundle element in its mouth', /newspaper/i),
  'bird tracker': R('bird-migration tracking biplane', 'a wire-frame aerial hoop of Technic bars on the upper wing and a brick-built bird cage lashed behind the cockpit', /bird-migration|migration tracking|bird tracker/i),
  'lighthouse supply': R('lighthouse-supply biplane', 'a lamp-oil drum of round bricks in a sling under the belly on bar-and-clip runs', /lighthouse-supply|lighthouse supply/i),
  'polar expedition': R('polar-expedition biplane on skis', 'a sledge of flat plates lashed under the lower wing and a fur-hooded minifigure in the rear seat', /polar-expedition|polar expedition/i),
  'fish spotter': R('fish-spotting biplane', 'a signal flag rack of tile strips on the tail strut and a brass-coloured telescope clipped to the cockpit rim', /fish-spotting|fish spotter/i),
  'seed bomber': R('reforestation seed-dropping biplane', 'a hopper of slope bricks under the belly spilling tiny green cone elements from a trapdoor', /seed-dropping|reforestation|seed bomber/i),
  'mosquito control': R('marsh mosquito-control biplane', 'a fine mist rig of trans-clear bar elements trailing from the lower wing edge', /mosquito/i),
  'circus clown': R('circus clown biplane', 'a bunch of trans-coloured balloon elements tied to the tail and an oversized flower element on the cowl', /circus clown|clown biplane/i),
  'wedding plane': R('wedding-day biplane', 'long trailing ribbon elements from both wingtips and a brick-built two-tier cake on the rear deck', /wedding/i),
  'pumpkin hauler': R('harvest pumpkin-hauling biplane', 'a rope net of bar elements bulging with orange pumpkin elements slung under the belly', /pumpkin/i),
  'ice-cream run': R('seaside ice-cream-run biplane', 'a white insulated cold box of smooth bricks bolted behind the cockpit with a cone element on its lid', /ice-cream|ice cream/i),
  beekeeper: R('travelling beekeeper biplane', 'two stacked hive crates of yellow bricks lashed under the lower wing with tiny bee elements at their mouths', /beekeeper|hive crates/i),
  'postcard photographer': R('postcard-photographer biplane', 'a bellows camera of stacked bricks on a swing arm clipped to the starboard cockpit rim', /postcard/i),
  'radio relay': R('radio-relay biplane', 'a tall aerial mast of Technic bars on the upper wing with a wire loop between mast and tail', /radio-relay|radio relay|aerial mast/i),
  'kite tow': R('kite-towing biplane', 'a big box-kite of thin plates and bars trailing on a line from the tail hook', /kite-tow|box-kite|box kite/i),
  'night flyer': R('night-flying biplane', 'a row of trans-yellow lamp elements along the leading edge and a brass-coloured landing lamp under the nose', /night-fly|night flyer/i),
  'mail pickup': R('mail-pickup biplane', 'a swing-down grapple hook of Technic bars under the belly for snatching a mailbag from a pole', /mail-pickup|mail pickup|grapple hook/i),
  'parachute trainer': R('parachute-training biplane', 'a jump platform of flat plates on the lower wing root with a folded parachute pack element', /parachute/i),
  'sea rescue': R('sea-rescue biplane', 'a rolled brick-built dinghy strapped under the belly on bar-and-clip runs', /sea-rescue|sea rescue|dinghy/i),
  'volcano observer': R('volcano-observation biplane', 'a heat-shield plate of dark grey tiles under the belly and a trans-orange sample flask in a clip rack', /volcano/i),
  'archaeology survey': R('desert archaeology survey biplane', 'a rolled tent element and a brick-built spade lashed to the port strut', /archaeolog/i),
  'balloon chaser': R('balloon-race chase biplane', 'a big pair of binoculars of round bricks on a Technic pivot at the rear cockpit', /balloon-race|balloon chase|balloon chaser/i),
  'lake floatplane': R('lake-taxi floatplane', 'twin pontoon elements with a step plate and a brass-coloured bell clipped to the forward strut', /lake-taxi|lake taxi/i),
  'island hopper': R('island-hopping mail floatplane', 'a coconut-crate of Technic liftarms strapped to the top of the port pontoon', /island-hopp|island hopper/i),
  'river boat plane': R('jungle river-boat amphibian', 'a paddle element clipped along the hull and a trans-green lantern on the bow', /river-boat|river boat/i),
  'crop sprayer': R('orchard crop-sprayer biplane', 'a tank of round bricks under the belly with a spray bar of trans-clear studs along the lower wing', /crop-sprayer|crop sprayer/i),
  'cattle herder': R('outback cattle-herding biplane', 'a big brass-coloured siren horn element on the cowl and a coiled lasso of bar elements on the strut', /cattle-herd|cattle herder/i),
  'stunt team': R('stunt-team formation biplane', 'a smoke pod under each lower wingtip and a mirror element on the cabane strut', /stunt-team|stunt team|formation biplane/i),
  'wing walker': R('wing-walking show biplane', 'a rail of Technic bars along the upper wing with a stand-up harness post at mid-span', /wing-walking show|wing walker/i),
  'glider carrier': R('piggyback glider-carrier biplane', 'a small brick-built glider perched on a cradle above the upper wing', /glider-carrier|piggyback/i),
  'racing pylon judge': R('pylon-race judge biplane', 'a chequered flag element on a bar mast behind the cockpit and a stopwatch element clipped to the rim', /judge biplane|race judge/i),
  'surveyor stakes': R('railway-survey biplane', 'a bundle of striped survey stakes of bar elements lashed to the port strut', /railway-survey|railway survey|survey stakes/i),
  'flying school': R('flying-school biplane', 'dual control sticks in both cockpits and an L-shaped learner pennant of tile strips on the tail', /flying-school|flying school|learner/i),
  'photo film': R('newsreel camera biplane', 'a hand-cranked film camera of stacked bricks on a Technic tripod mount at the rear cockpit', /newsreel/i),
  'lost pet finder': R('lost-pet-search biplane', 'a big brass-coloured loud-hailer element and a dog-biscuit tin of round bricks clipped to the rim', /lost-pet|lost pet/i),
  'fog lamp': R('fog-landing biplane', 'twin fog lamps of trans-yellow dish elements under the lower wing and a sounding bell on the strut', /fog-landing|fog landing/i),
  'sky ferry': R('sky-ferry passenger biplane', 'a second enclosed cabin of transparent panels behind the pilot with tiny suitcases on a roof rack', /sky-ferry|sky ferry|passenger biplane/i),
  'mountain mail': R('mountain-pass mail biplane', 'a mailbag hook of Technic bars and a coil of climbing rope element on the rear deck', /mountain-pass|mountain mail/i),
  'flower delivery': R('flower-delivery biplane', 'a wicker-look basket of tan bricks behind the cockpit overflowing with flower elements', /flower-delivery|flower delivery/i),
  'milk run': R('dairy milk-run biplane', 'a rack of silver milk churns of round bricks along the lower wing root', /milk-run|milk run|milk churns/i),
  'timber cruiser': R('forestry timber-cruiser biplane', 'a rolled map tube and a brass-coloured compass element on the cockpit rim', /timber-cruiser|timber cruiser|forestry/i),
  'oyster boat plane': R('oyster-bed patrol floatplane', 'a net sack of bar elements bulging with round grey stud shells under the pontoon strut', /oyster/i),
  'sheep counter': R('hill-farm sheep-counting biplane', 'a tally board of white round tiles on the cockpit side and a crook element clipped to the strut', /sheep/i),
  'meteor watcher': R('meteor-watch night biplane', 'a brass-coloured telescope of round bricks on a swivel behind the cockpit and a star-chart tube', /meteor/i),
  'tea plantation': R('tea-plantation estate biplane', 'a lacquered tea chest of dark tan bricks strapped to the rear deck', /tea-plantation|tea plantation|tea chest/i),
  'vineyard duster': R('vineyard-dusting biplane', 'a hopper of purple-tinted bricks under the belly with a puff of trans-white dust elements at its spout', /vineyard/i),
  'ski resort': R('ski-resort shuttle biplane', 'ski elements under the wheels and a rack of tiny brick-built skis on the upper wing', /ski-resort|ski resort/i),
  'circus tent hauler': R('circus tent-hauling biplane', 'a rolled striped tent of red and white plates lashed under the belly', /tent-hauling|tent hauler|circus tent/i),
  'flying photographer': R('aerial-portrait photographer biplane', 'a big flash pan of dish elements on a bar arm beside the rear cockpit', /aerial-portrait|flash pan/i),
  'egg courier': R('hatchery egg-courier biplane', 'a padded crate of tan bricks with a row of white egg elements visible through its slats', /egg-courier|egg courier|hatchery/i),
  'flying florist': R('mountain wildflower-collecting biplane', 'a plant press of stacked flat plates strapped to the port strut', /wildflower-collecting|plant press/i),
  'canal inspector': R('canal-inspection amphibian', 'a lock-key element and a coiled mooring rope of bar elements on the hull deck', /canal-inspection|canal inspector/i),
  'river ferry': R('river-crossing ferry floatplane', 'a bicycle element strapped across the top of the starboard pontoon', /river-crossing|ferry floatplane/i),
  'kite festival': R('kite-festival escort biplane', 'a string of tiny brick-built kites of flat plates trailing from the tail hook', /kite-festival|kite festival/i),
  'harbour pilot': R('harbour-pilot floatplane', 'a brass-coloured signal lamp on the cabane strut and a rope ladder of bar elements on the pontoon', /harbour-pilot|harbour pilot/i),
  'sheep dip': R('highland supply biplane', 'a rolled tartan blanket of plaid-coloured plates and a crate of round bricks on the rear deck', /highland supply|tartan/i),
  'sand yacht tow': R('beach sand-yacht towing biplane', 'a tow bridle of Technic bars under the tail and a spare sail of flat plates rolled on the strut', /sand-yacht|sand yacht/i),
  'lamp lighter': R('airfield lamp-lighter biplane', 'a rack of trans-orange lantern elements along the lower wing and a long taper element on the strut', /lamp-lighter|lamp lighter/i),
  'cloud seeder': R('cloud-seeding biplane', 'a flare rack of round bricks along the trailing edge with trans-white puff elements at the tips', /cloud-seed/i),
  'coral survey': R('reef coral-survey floatplane', 'a glass-bottomed viewing box of transparent plates set into the hull floor', /coral-survey|coral survey|glass-bottomed/i),
  'orchestra plane': R('flying-orchestra biplane', 'a brass-coloured tuba element and a drum of round bricks strapped to the rear deck', /flying-orchestra|orchestra|tuba/i),
  'lighthouse keeper': R('lighthouse-keeper relief biplane', 'a lantern lens of trans-clear dish elements packed in a crate on the lower wing', /lighthouse-keeper|keeper relief/i),
  'goat carrier': R('alpine goat-carrier biplane', 'a slatted pen of bar elements behind the cockpit with a brick-built goat looking out', /goat/i),
  'flying library': R('flying-library biplane', 'a shelf of tiny tile-plate books strapped along the fuselage flank under a transparent panel', /flying-library|library/i),
  'balloonist rescue': R('balloonist-rescue biplane', 'a long boat-hook of Technic bars on the upper wing and a coiled rope on the rear deck', /balloonist-rescue|boat-hook/i),
  'snow survey': R('snowfield-survey biplane on skis', 'a striped snow-depth pole of bar elements lashed to the port strut', /snowfield|snow-depth/i),
  'racing mascot': R('racing-team mascot biplane', 'an oversized brick-built rabbit head bolted to the cowl ring in place of a spinner', /mascot/i),
  'fruit picker': R('orchard fruit-picking biplane', 'a long-handled picking basket of bar elements and a crate of red round fruit elements on the deck', /fruit-picking|fruit picker/i),
  'water bomber': R('lake water-scooping fire biplane', 'a scoop of slope bricks under the hull and a trans-blue drop hatch beneath the belly', /water-scooping|water bomber|scoop/i),
  'grand tour': R('grand-tour touring biplane', 'a leather-look luggage trunk of dark tan bricks strapped to the rear deck with a rolled map', /grand-tour|grand tour|luggage trunk/i),
  'telegraph line': R('telegraph-line inspection biplane', 'a reel of wire of round bricks on a Technic axle behind the cockpit and a pole-climber hook on the strut', /telegraph/i),
  'harvest festival': R('harvest-festival parade biplane', 'a garland of tan wheat-sheaf elements looped along both wings and a pumpkin on the nose', /harvest-festival|harvest festival|wheat-sheaf/i),
  'ferry mail boat': R('coastal mail-boat floatplane', 'a mailbag of tan bricks in a net under the pontoon strut and a bell on the cabane', /mail-boat|mail boat/i),
};
const SILHOUETTES = ['A stubby broad-winged', 'A slender', 'A squat', 'A chunky', 'A long-nosed', 'A broad-winged', 'A compact', 'A tall-legged'];
const COLOURS = ['cobalt-blue', 'scarlet', 'canary-yellow', 'acid-lime', 'ivory-and-teal', 'burnt-orange', 'plum', 'sand', 'sky-blue', 'hot-pink', 'olive-green', 'cream-and-crimson', 'turquoise', 'chocolate-and-cream', 'primary-red', 'white-and-navy', 'jade', 'tangerine', 'lavender', 'buff-and-black'];
const ENGINES = ['a fat cowled rotary ring', 'a horseshoe cowling over a moulded three-blade propeller', 'a broad radial ring', 'a flat inline radiator nose'];
const COCKPITS = ['single open cockpit', 'twin open cockpits in tandem', 'single open cockpit set far aft', 'two open cockpits fore and aft'];
const SHAPES = ['chevron', 'diagonal band', 'lightning flash', 'sunburst', 'scalloped edge', 'band', 'zigzag stripe', 'ring', 'diamond', 'crescent stripe'];
const EMBLEMS = ['a leaping fish', 'a soaring bird', 'a winged horse', 'a palm and sun', 'a coiled serpent', 'a five-pointed star', 'a crescent moon', 'a running hare', 'a lighthouse', 'an acorn', 'a bee', 'a compass rose', 'a stag head', 'a sailing ship', 'a thistle', 'a rising sun', 'a fox', 'a snowflake', 'a whale', 'an owl'];

function parse(text) {
  let best = null;
  let at = Infinity;
  for (const [k, r] of Object.entries(ROLES)) {
    const m = text.match(r.re);
    if (m && m.index < at) {
      at = m.index;
      best = k;
    }
  }
  const role = best || 'biplane';
  return { keys: [`role:${role}`], role };
}
const sameGroup = (a, b) => a.role === b.role;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['aircraft']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const taken = (k) => groups.some((g) => (g.assignment ? g.assignment.role : g.role) === k);
  const free = shuffle(Object.keys(ROLES).filter((k) => !ROLES[k].original && !taken(k)));
  const role = byUsage(free, usage, (k) => 'role:' + k)[0];
  if (!role) return null;
  return {
    keys: [`role:${role}`],
    role,
    words: ROLES[role].words,
    gadget: ROLES[role].gadget,
    silhouette: spread(SILHOUETTES),
    colour: spread(COLOURS),
    engine: spread(ENGINES),
    cockpits: spread(COCKPITS),
    shape: spread(SHAPES),
    emblem: spread(EMBLEMS),
    tags: [role],
  };
}
function brief(batch, examples) {
  return `You write entries for one pool of a LEGO-photography bot: BrickBot airfield-biplanes, the AIRCRAFT axis: one brick-built vintage biplane, the hero of the picture. Every entry is ONE aircraft in 55-70 words, one sentence.

Examples already in the pool (match their voice, LEGO vocabulary, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, exactly as the examples: silhouette + colour + ROLE named with the slot's own words, then the engine, then the cockpits, then "smooth unmarked <colour> flanks with one painted <shape> and a round emblem of <emblem>", then the ONE gadget for the role in LEGO element words, then the wings ("stacked plate wings on a Technic-pin strut cage" or a close variant with bar-and-clip rigging).
- Use EXACTLY the role, gadget, silhouette, colour, engine, cockpits, painted shape and emblem given for the slot, in your own natural wording.
- LEGO register only: smooth unmarked panels, stacked plates, slope bricks, round bricks, dish elements, Technic pins, axles, liftarms, bar-and-clip, trans-coloured elements, minifigures. Every marking is a painted geometric shape or a round pictorial emblem; never lettering, numbers, registrations, flags with words, or a real make or model. No guns, bombs or military hardware. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. role: "${a.words}"; gadget: "${a.gadget}"; silhouette: "${a.silhouette}"; colour: ${a.colour}; engine: ${a.engine}; cockpits: ${a.cockpits}; painted shape: one ${a.shape}; emblem: ${a.emblem}`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An) .{280,}$/;
const BANS = [
  ['text', /\b(lettering|letters|numbers?|numeral|registration|logo|logos|badge with|words?|writing|text|decal|sticker)\b/i],
  ['military', /\b(gun|guns|machine-gun|bomb|bombs|torpedo|rocket|missile|fighter|bomber)\b/i],
  ['real-make', /\b(sopwith|fokker|tiger moth|stearman|curtiss|spad|nieuport|boeing|de havilland|waco|pitts|jenny)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.role !== a.role) p.push(`role ${parsed.role}≠${a.role}`);
  const words = cand.split(/\s+/).length;
  if (words < 45 || words > 78) p.push(`${words} words`);
  if (!/smooth unmarked/i.test(cand)) p.push('no smooth unmarked flanks');
  if (!/one painted/i.test(cand)) p.push('no painted shape');
  if (!/stacked[- ]plate|stacked plates|wing/i.test(cand)) p.push('no wings');
  if (!/technic|bar-and-clip/i.test(cand)) p.push('no Technic or bar-and-clip element');
  if (!/cockpit/i.test(cand)) p.push('no cockpit');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const o = {};
  parsed.forEach((p) => (o[p.role] = (o[p.role] || 0) + 1));
  return { role: o };
}

module.exports = {
  name: 'brickbot/airfield_biplanes/aircraft',
  poolFile,
  basis: 'aircraft = the civil ROLE and its signature gadget; same when the role matches; greedy, pool order (silhouette, colour, engine, marking and emblem are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [300, 560],
  ROLES,
};
