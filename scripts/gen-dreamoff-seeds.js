/**
 * One-off: regenerate Dream Off pools to the "fun/interesting/exotic spark,
 * genuinely render-worthy" bar. Generates candidates across many angles (one
 * Sonnet call per angle = equal share per sub-theme, diverse by construction),
 * dedupes, and writes them to a file for HUMAN/agent CURATION. Does NOT touch the
 * DB — curation + replace is a separate, deliberate, backed-up step.
 *
 *   node scripts/gen-dreamoff-seeds.js <config-id> <n-per-bucket>
 *
 * config-id is "<pack>__<scene|cast>", e.g. chaotic__scene, roast__cast.
 */

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const env = fs.readFileSync('.env.local', 'utf8');
const KEY = env.match(/ANTHROPIC_API_KEY=(.+)/)[1].trim();

const ID = process.argv[2];
const PER = parseInt(process.argv[3] || '9', 10);

// ── SCENE pools: a fun/spectacular/exotic PICTURE ────────────────────────────
const SCENE = {
  chaotic__scene: {
    vibe:
      'JOYFUL, COLORFUL, SPECTACULAR MAYHEM. Maximum nonsense as a visual feast: ' +
      'something gloriously, absurdly out of control, in a place already a delight to look at.',
    gold: [
      'a birthday piñata erupting into a full-blown confetti hurricane',
      'a candy factory mid-meltdown, rivers of chocolate overflowing the conveyors',
      'a carnival the instant every ride lights up and lurches to life at once',
      'an indoor playground drowning under a tidal wave of escaped ball-pit balls',
      'a nightclub the moment the disco ball shatters into a galaxy of spinning light',
      'a bouncy-castle kingdom slowly lifting off the lawn at golden hour',
    ],
    buckets: [
      'a carnival or theme park', 'a circus or magic show', 'a candy / dessert wonderland',
      'a water park or pool party', 'a toy store, arcade, or ball pit',
      'a parade or festival with floats and giant balloons', 'outer space or a sci-fi spectacle',
      'a fantasy realm of chaotic magic', 'an underwater world or mermaid kingdom',
      'a jungle or wild-nature spectacle', 'a concert or neon dance floor',
      'a snowy / ice winter wonderland gone wild', 'an exotic market, bazaar, or floating village',
      'a giant sports or games event',
    ],
  },
  glam__scene: {
    vibe:
      'OPULENT, DRAMATIC, JAW-DROPPING GLAMOUR. Pure spectacle and luxury turned up to ' +
      'eleven — dazzling, over-the-top, cinematic. Beautiful to look at, with a wink of excess. ' +
      'NOT a boring luxury object on a table.',
    gold: [
      'a champagne tower cascading down a marble grand staircase at midnight',
      'a red carpet flooded with paparazzi flashes like a lightning storm',
      'a ballroom chandelier the size of a small planet blazing over a masquerade',
      'a rooftop infinity pool spilling over a glittering neon skyline',
      'a swan-shaped gondola gliding through a canal of liquid gold',
      'a diamond-encrusted carousel spinning under a crystal dome',
    ],
    buckets: [
      'a red carpet / awards show / premiere', 'a grand ballroom or masquerade gala',
      'a couture fashion runway or backstage', 'a rooftop penthouse party over a skyline',
      'a palace, chateau, or gilded grand staircase', 'a jewel vault or auction house',
      'a superyacht or luxury cruise at golden hour', 'a Vegas / casino / neon high-roller night',
      'a grand opera house or velvet theater', 'an exotic luxury palace (desert oasis, ice, cloud)',
    ],
  },
  halloween_funny__scene: {
    vibe:
      'HALLOWEEN SLAPSTICK SPECTACLE. Spooky-season comedy as a vivid PICTURE — yard ' +
      'decorations, costumes, pumpkins, haunted houses gone gloriously, visibly wrong. ' +
      'Every one a clear image, never a pun.',
    gold: [
      'a front lawn overtaken by fifty inflatable ghosts all deflating at once',
      'a jack-o-lantern mid-explosion showering candy corn across a porch',
      'a haunted house where every animatronic has malfunctioned in unison',
      'a costume contest where three people came as the exact same giant hot dog',
      'a fog machine that has buried an entire cul-de-sac up to the mailboxes',
      'a pumpkin catapult misfiring gourds across a crowded harvest fair',
    ],
    buckets: [
      'over-the-top yard decorations gone wrong', 'a haunted-house attraction malfunctioning',
      'a pumpkin patch or carving disaster', 'a costume mishap or crowd of identical costumes',
      'a trick-or-treat street in cheerful chaos', 'a harvest fair or fall festival gone sideways',
      'a witch / potion / cauldron spectacle', 'a graveyard party that got out of hand',
    ],
  },
  halloween_scary__scene: {
    vibe:
      'GENUINELY EERIE, ATMOSPHERIC HORROR. Unsettling, cinematic, dread-soaked PICTURES ' +
      'that make your skin crawl — beautiful to look at and deeply creepy. A clear image ' +
      'with a wrongness in it. Never a candy-bowl gag, never a joke.',
    gold: [
      'a cornfield where every scarecrow has turned to face the same lit window',
      'a foggy graveyard with one fresh grave dug open from the inside',
      "a child's bedroom where the closet door hangs open exactly six inches",
      'an abandoned carnival at midnight with a single carousel still turning',
      'a long hallway of doors where only one is very slightly ajar',
      'a forest of bare trees strung with hundreds of watching paper lanterns',
    ],
    buckets: [
      'a haunted house interior', 'a graveyard or crypt at night', 'a cornfield or dark farm',
      'an eerie suburban street', 'a haunted forest or woods', 'an abandoned attraction (carnival, motel)',
      'an attic, cellar, or basement', 'a foggy lake, marsh, or shore at night',
    ],
  },
};

// ── CAST pools: a specific RENDERABLE CHARACTER caught in a moment ────────────
const CAST = {
  roast__cast: {
    vibe:
      'AFFECTIONATE ROAST. A gloriously mockable but VIVID comedic character — delusional, ' +
      'washed-up, tryhard, or absurdly over-confident — that is hilarious to be cast as. ' +
      'A clear figure with a costume, pose, and prop. Never an abstract metaphor.',
    gold: [
      'a washed-up child star clinging to one ancient catchphrase',
      'a self-proclaimed life coach who clearly has no idea',
      'a knockoff superhero whose costume did not survive the wash',
      'a garage-band frontman mid-solo that absolutely nobody asked for',
      'a medieval knight who brought a wooden spoon to the battle',
      'a beauty influencer filming a tutorial that is going very wrong',
    ],
    buckets: [
      'a delusional guru / expert / life coach', 'a faded celebrity clinging to fame',
      'a cheap knockoff hero or villain', 'a tryhard athlete or gym legend',
      'a pretentious artist / poet / chef', 'an over-confident amateur out of their depth',
      'a self-important minor official', 'a wannabe rockstar or pop diva',
    ],
  },
  christmas_funny__cast: {
    vibe:
      'CHRISTMAS COMEDY CHARACTER. A specific renderable PERSON caught in a holiday-disaster ' +
      'moment you can actually see — tangled, buried, overwhelmed, costumed. NOT an offscreen ' +
      '"the reason the X is now Y" blame-line; there must be a person in frame.',
    gold: [
      'a frazzled dad hopelessly tangled in a mile of christmas lights',
      'someone wearing all seven ugly sweaters at once, sweating',
      'a kid buried to the neck in a mountain of shredded wrapping paper',
      'a mall santa mid-shift who has completely given up',
      'a home cook emerging from a smoking oven holding a blackened turkey',
      'a carol singer who hit the wrong note and knows the whole street heard',
    ],
    buckets: [
      'the overwhelmed holiday host', 'an ugly-sweater or costume disaster',
      'a gift-wrapping casualty', 'a mall / party santa gone wrong',
      'the christmas-dinner kitchen catastrophe', 'a tangled-decorations mishap',
      'an over-caffeinated last-minute shopper', 'a caroler or pageant performer mid-fail',
    ],
  },
  new_years_funny__cast: {
    vibe:
      'NEW YEAR PARTY COMEDY CHARACTER. A specific renderable person caught mid-NYE-mishap ' +
      'you can see — costumed, covered, collapsed, mid-fail. NOT an offscreen "the reason the ' +
      'champagne tower fell" blame-line; put the person in the picture.',
    gold: [
      'a reveler wearing the entire balloon drop as a costume',
      'someone asleep in a mountain of confetti still in last night’s sequins',
      'a party-goer wrapped head to toe in escaped streamers',
      'a toast-giver mid-spray as the champagne erupts in their face',
      'a countdown host who started the countdown a full minute too early',
      'a partygoer wearing oversized NEW YEAR glasses and last night’s regret',
    ],
    buckets: [
      'the over-celebrator drenched in party debris', 'a countdown / midnight-timing fail',
      'a confetti or balloon-drop casualty', 'a champagne-spray disaster',
      'a costume or party-hat mishap', 'the reveler who peaked far too early',
      'a resolution-already-broken moment (shown visually)', 'a photo-booth catastrophe',
    ],
  },
  st_patricks_funny__cast: {
    vibe:
      "ST. PATRICK'S COMEDY CHARACTER. A specific renderable person or leprechaun caught in a " +
      'green, unlucky, over-the-top moment you can see. NOT an offscreen "the one who did X" ' +
      'blame-line; put the figure in the picture.',
    gold: [
      'a leprechaun hopelessly tangled in their own rainbow',
      'a pub-goer dyed head to toe emerald green',
      'someone crowned under an absurd toppling tower of shamrocks',
      'a parade marshal who has lost the entire parade behind them',
      'a reveler juggling a pot of gold that is clearly too heavy',
      'a step-dancer mid-leap who has completely lost the rhythm',
    ],
    buckets: [
      'an unlucky leprechaun in a mishap', 'a fully green-dyed reveler',
      'a parade or float mishap', 'a pot-of-gold / rainbow disaster',
      'a pub celebration gone sideways', 'a shamrock-costume catastrophe',
      'a step-dancer or fiddler mid-fail', 'an over-the-top lucky-charm believer',
    ],
  },
  july_4th_funny__cast: {
    vibe:
      'FOURTH OF JULY COMEDY CHARACTER. A specific renderable person caught in a backyard-BBQ ' +
      'or fireworks mishap you can see — smoke-wreathed, drenched, costumed, mid-disaster. NOT ' +
      'an offscreen "the culprit behind the fire" blame-line; put the person in frame.',
    gold: [
      'a backyard grill-master vanishing into a cloud of their own smoke',
      'someone in head-to-toe flag regalia mid-water-balloon-ambush',
      'a sparkler enthusiast in safety goggles and very little sense',
      'a cornhole champion celebrating a shot that clearly missed',
      'a hot-dog-eating contestant at their absolute breaking point',
      'a parade-float rider whose giant foam eagle is deflating fast',
    ],
    buckets: [
      'the backyard grill disaster', 'an over-the-top patriot in full regalia',
      'a fireworks / sparkler amateur', 'a pool or water-balloon casualty',
      'a picnic / potluck catastrophe', 'a backyard-games champion of nothing',
      'a parade-float mishap', 'a hot-dog / pie eating-contest meltdown',
    ],
  },
  new_years_cute__cast: {
    vibe:
      'ADORABLE NEW YEAR CREATURE. A chubby, sleepy, or delighted little animal or storybook ' +
      'creature in a cozy NYE moment — party hats, confetti, sparklers, midnight. Impossibly ' +
      'cute and clearly renderable. Never abstract ("the year that is leaving").',
    gold: [
      'a chubby hamster in a tiny top hat nodding off before midnight',
      'a round puppy tangled in gold streamers and utterly delighted',
      'a sleepy kitten in a HAPPY NEW YEAR sash three sizes too big',
      'a tiny hedgehog watching fireworks from a cozy mug of cocoa',
      'a pudgy penguin chick blowing a party horn far too enthusiastically',
      'a baby fox curled inside a giant disco ball like a nest',
    ],
    buckets: [
      'a sleepy animal fighting to stay up till midnight', 'a chubby creature buried in confetti',
      'a tiny animal in an oversized party hat or sash', 'a creature mesmerized by fireworks',
      'a little animal with a party horn or noisemaker', 'a storybook creature toasting with cocoa',
    ],
  },
  christmas_spicy__cast: {
    vibe:
      'FLIRTY, BOLD CHRISTMAS BOMBSHELL. A confident, smoldering, tastefully-glam holiday ' +
      'character with a clear, striking LOOK — red velvet, mistletoe, firelight. Sultry but ' +
      'classy and renderable. A real figure, not a behavioral quirk.',
    gold: [
      'a smoldering figure in an unbuttoned santa coat by the fire',
      'a bombshell draped in red velvet and a crown of mistletoe',
      'a confident elf in a daringly tailored workshop costume',
      'a fireside flirt in a plunging emerald gown and candlelight',
      'a mischievous mrs. claus who clearly runs the whole operation',
      'a leather-clad krampus with a devastatingly good jawline',
    ],
    buckets: [
      'a sultry santa or mrs. claus', 'a mistletoe tease', 'a red-velvet bombshell by the fire',
      'a daring-costume elf', 'a glamorous holiday-gala seducer', 'a bold winter-solstice enchanter',
    ],
  },
};

const SHARED_SCENE = (vibe, gold, bucket, n) =>
  `You are writing DREAM SEEDS for a party game, Dream Off. A dream seed is a BASE SCENE players ` +
  `riff on: everyone gets the same seed, each adds a creative spin, an AI renders it, funniest/most ` +
  `beautiful/most creative image wins. A great seed is an inspiring, wide-open STARTING POINT that ` +
  `is already a delight to picture.\n\nPACK VIBE: ${vibe}\n\nEVERY seed MUST: be a clear vivid ` +
  `RENDERABLE picture (a concrete scene, never a phrase or pun); be genuinely fun/funny/beautiful/` +
  `eerie to imagine; be set somewhere interesting, imaginative, or exotic, rich with visual ` +
  `spectacle; leave room for a twist; be 5-12 words, lowercase, no ending punctuation, starting ` +
  `with "a"/"an"/"the".\n\nNEVER: wordplay/hyperbole jokes; sentient-objects-with-feelings ("took ` +
  `it personally", "has seen too much"); single-animal-loose slapstick; boring mundane settings ` +
  `with boring events; vague abstractions.\n\nGOLD EXAMPLES (this exact bar):\n${gold
    .map((g) => '  ' + g)
    .join('\n')}\n\nWrite ${n} NEW dream seeds set in/around: ${bucket}. Wildly varied, each a ` +
  `distinct vivid image. Output ONLY the seeds, one per line, no numbers, no commentary.`;

const SHARED_CAST = (vibe, gold, bucket, n) =>
  `You are writing DREAM SEEDS for a party game, Dream Off. In this pack the player is CAST as the ` +
  `character — an AI face-swaps THEM into it. Each seed names a specific, vivid CHARACTER caught in ` +
  `a moment. Everyone gets the same seed, adds a spin, best render wins.\n\nPACK VIBE: ${vibe}\n\n` +
  `EVERY seed MUST: name a SPECIFIC, RENDERABLE character (person or creature) you could draw — a ` +
  `clear figure with a costume, pose, prop, or situation; put them in a vivid funny/striking/` +
  `gorgeous MOMENT; be fun to be cast as; leave room for a spin; be 4-11 words, lowercase, no ending ` +
  `punctuation, starting with "a"/"an"/"the".\n\nNEVER: an ABSTRACT blame-line with no visible ` +
  `person ("the reason the tree is on the floor", "the culprit behind the collapse", "the one who ` +
  `sent the email"); a "the most X person"/"the main character of Y" superlative with no image; ` +
  `wordplay/metaphor with no figure ("a legend in their own damage report"); sentient-objects-with-` +
  `feelings.\n\nGOLD EXAMPLES (this exact bar):\n${gold.map((g) => '  ' + g).join('\n')}\n\nWrite ` +
  `${n} NEW character seeds in the vein of: ${bucket}. Each a distinct, vivid, renderable character. ` +
  `Output ONLY the seeds, one per line, no numbers, no commentary.`;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

(async () => {
  const isCast = ID.endsWith('__cast');
  const cfg = (isCast ? CAST : SCENE)[ID];
  if (!cfg) throw new Error(`no brief for ${ID}`);
  const build = isCast ? SHARED_CAST : SHARED_SCENE;
  const anthropic = new Anthropic({ apiKey: KEY });
  const seen = new Set();
  const all = [];
  for (const bucket of cfg.buckets) {
    const msg = await anthropic.messages.create({
      model: SONNET,
      max_tokens: 900,
      messages: [{ role: 'user', content: build(cfg.vibe, cfg.gold, bucket, PER) }],
    });
    const text = msg.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
    const lines = text
      .split('\n')
      .map((l) => l.replace(/^[\s\-\d.)*]+/, '').trim())
      .filter((l) => l.length > 6 && l.split(' ').length >= 3 && !/^(here|sure|okay)/i.test(l));
    for (const l of lines) {
      const k = norm(l);
      if (k && !seen.has(k)) {
        seen.add(k);
        all.push(l);
      }
    }
    console.log(`  ${bucket.slice(0, 40).padEnd(42)} -> ${lines.length}`);
  }
  const outDir =
    '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/06480181-826c-4534-a0dc-c2d781ca93fa/scratchpad';
  const outFile = path.join(outDir, `cand_${ID}.txt`);
  fs.writeFileSync(outFile, all.join('\n') + '\n');
  console.log(`\n${all.length} unique candidates -> ${outFile}`);
})();
