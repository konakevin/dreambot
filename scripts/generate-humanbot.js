#!/usr/bin/env node
/**
 * Generate a HumanBot post.
 *
 * HumanBot is the content bot that drops random AI observations about weird
 * human behaviors. The image is rendered as fine art (watercolor / oil / photo /
 * pencil) — intentionally serious medium for a trivial subject. The 2-sentence
 * caption is overlaid as a faux terminal panel in the bottom third of the image.
 *
 * Flow:
 *   1. Call Sonnet → { observation, roast, image_hint, medium }
 *   2. Call generate-dream Edge Function (V2 text path) → base image via Flux
 *   3. Download base image, composite terminal overlay with Sharp
 *   4. Upload composited image back to Storage (overwrites original path)
 *   5. Write bot_message into uploads row and flip to active
 *
 * Usage:
 *   node scripts/generate-humanbot.js              # one post
 *   node scripts/generate-humanbot.js --count 3    # three posts
 *   node scripts/generate-humanbot.js --dry-run    # show Sonnet output only
 */

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const getKey = (name) => process.env[name] || envFile[name];

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const ANTHROPIC_KEY = getKey('ANTHROPIC_API_KEY');
const SERVICE_ROLE = getKey('SUPABASE_SERVICE_ROLE_KEY');

if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}
if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 1;
const DRY_RUN = args.includes('--dry-run');

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Both locked — watercolor + enchanted is the HumanBot aesthetic, every post
const HUMANBOT_MEDIUM = 'watercolor';
const HUMANBOT_VIBE = 'enchanted';

// Scene pool — random pick per run, forces environmental variety
// (Sonnet defaults to misty-forest without this nudge)
const SCENE_POOL = [
  // Coastal / ocean
  'a coral reef underwater with sunbeams piercing the surface',
  'a rocky Oregon coast with sea stacks at sunset',
  'a Faroe Islands cliff face with nesting seabirds',
  'a Maine lobster cove at dawn with lifting fog',
  'a Norwegian fjord with steep walls and still black water',
  'a Vietnamese limestone seascape dotted with green islands',
  'a Greek island cove with whitewashed cliffs above turquoise water',
  'a Bahamas sandbar at low tide with stingrays gliding past',
  'a Hawaiian black sand beach with palm silhouettes',
  'a Hawaiian lava coast where molten rock meets the sea',
  'a Chilean Pacific beach with pelicans at dusk',
  'a Great Barrier Reef coral garden in golden afternoon light',
  'a tidal cave with bioluminescent water',
  'a kelp forest with fish schooling overhead',
  'a Thailand sea cave with emerald water',
  'a windswept Icelandic black sand beach',
  'a Red Sea coral wall with schools of anthias',

  // Desert / arid
  'a high desert mesa at noon with dust devils in the distance',
  'a red Sedona canyon at golden hour',
  'a Joshua Tree boulder field under a purple dusk',
  'a Wadi Rum rock spire casting a long shadow at sundown',
  'a Baja peninsula with saguaro cacti silhouetted against orange sky',
  'a Mongolian Gobi sand sea with low-angle light',
  'a Turkish Cappadocia landscape with fairy chimneys at dawn',
  'an Australian outback spinifex plain with a lone eucalyptus',
  'a Sahara dune at blue hour',
  'an Atacama salt plain with cracked geometric patterns',
  'a canyon slot with light funneling down the walls',

  // Forest
  'a bamboo grove in heavy rain',
  'a redwood cathedral with shafts of morning light',
  'a Pacific Northwest old-growth forest with shafts of green-tinted light',
  'a Scottish Caledonian pine forest with deep moss floor',
  'a Brazilian Atlantic rainforest with heliconia blooms',
  'a German Black Forest in heavy snowfall',
  'a Costa Rican cloud forest wreathed in mist',
  'a Tasmanian myrtle forest with tree ferns',
  'a New England sugar maple grove in peak autumn',
  'a Japanese cedar forest with stone lanterns',
  'a Quebec boreal woods after fresh snow',
  'a mossy rainforest floor with mushrooms',
  'a Colorado aspen grove at peak autumn color',
  'a cherry blossom grove with petals falling',

  // Mountain / alpine
  'an alpine glacier lake reflecting jagged peaks',
  'a Dolomites granite spire catching alpenglow',
  'a Himalayan high-altitude lake under prayer flags',
  'a Torres del Paine glacier lake with icebergs',
  'a Cascade mountain ridge above a sea of clouds',
  'a Swiss alpine pasture with cowbells in distant mist',
  'an Andean terraced hillside at sunset',
  'a Rocky Mountain alpine meadow in wildflower bloom',
  'a New Zealand Southern Alps reflected in a glacial tarn',
  'a mountain pass with swirling clouds',
  'a mountain meadow with wildflowers and distant peaks',

  // River / lake / wetland
  'a mangrove swamp at low tide',
  'a fog-bound salt marsh with wading birds',
  'a marshland at sunrise with mist on the water',
  'a Louisiana bayou with Spanish moss and slow current',
  'a Finnish lake at midsummer midnight sun',
  'a Scottish highland stream cutting through heather moorland',
  'a Botswana Okavango delta channel with reedbuck',
  'a Minnesota boundary waters canoe at sunset',
  'a Florida Everglades sawgrass at sunrise',
  'an Irish peat bog with cotton grass swaying',
  'a Louisiana cypress swamp at blue hour',
  'a jungle waterfall with tropical flowers',
  'a frozen lake with cracked ice patterns',
  'a Mexican cenote with a shaft of sunlight from above',
  'a cenote in the Yucatan with hanging vines',

  // Plains / grassland / farmland
  'a thunderstorm rolling across open prairie',
  'a golden wheat field at sunset',
  'a poppy field in Tuscany at dusk',
  'a lavender field in Provence at golden hour',
  'a rocky Scottish highland moor with heather',
  'a Kansas tallgrass prairie with a distant farmhouse',
  'a Tuscan vineyard with cypress lined paths at golden hour',
  'a Mongolian steppe with a lone horse at sunset',
  'a French Champagne region vineyard in morning mist',
  'a Dutch tulip field at first light',

  // Polar / arctic / snow
  'a moonlit snow field with fox tracks',
  'an arctic iceberg with seals on the floe',
  'a Patagonian glacier wall meeting the sea',
  'an Alaskan braided river delta from above',
  'a Greenland ice cap with meltwater rivers',
  'an Antarctic peninsula with a penguin rookery',
  'a Yukon tundra in full autumn color',
  'a Svalbard fjord with polar bear tracks on the shore',
  'a Norwegian ice cave with blue-walled chambers',

  // Volcanic / geothermal
  'a volcanic crater lake steaming at dawn',
  'a Japanese hot spring in winter with snow on cedars',
  'an Icelandic lava field after fresh rain',
  'a Hawaii Volcanoes National Park steam vent landscape',
  'a New Zealand geyser basin at twilight',
  'a Chilean Andes geothermal fumarole at first light',
  'a Kamchatka geothermal river steaming against snow',

  // Night sky / aurora
  'a Norwegian aurora over a frozen fjord',
  'a Namibian desert night with the Milky Way overhead',
  'a Scottish stone circle under a meteor shower',

  // Distinctive single-region scenes
  'a Madagascar spiny forest at dawn',
  'an African baobab tree silhouette at dusk',
  'a Laotian karst landscape at dawn with river mist',
  'a Provençal field of sunflowers facing the sun',
];

/**
 * The HumanBot Character — compact visual anchor prepended to every Flux hint.
 * Target: a 1950s tin wind-up toy robot crossed with a Rock 'Em Sock 'Em Robot.
 * The cheap-toy aesthetic makes the fine-art treatment funnier. Boxing-glove hands
 * trying to operate typewriters, magnifying glasses, clipboards = inherent comedy.
 * Kept under ~60 words per BOTS.md guidance ("long hints = mush").
 */
const HUMANBOT_CHARACTER =
  'featuring the HumanBot character — a vintage 1950s tin wind-up toy robot crossed with a Rock Em Sock Em Robot. ' +
  'Bright red lithographed metal body, boxy square head and boxy square torso, chrome trim and rivets, ' +
  'two simple round dot eyes, printed speaker-grille mouth, ' +
  'oversized red boxing-glove hands on articulated arms, stubby flat metal feet, ' +
  'a silver wind-up key on its back, slightly dented and scratched with vintage patina, charmingly clunky toy proportions.';

const SYSTEM_PROMPT_MINIMAL = `You are HumanBot. Make a funny, profound observation about humans — something peculiar, hypocritical, or illogical that only humans do. Think Seinfeld, Larry David, and Steven Wright.

**ONE hard rule: the whole post must be UNDER 18 WORDS TOTAL. Aim for 12-15. Short is funnier. Cut every word that isn't pulling weight.**

Output strict JSON, no markdown:
{
  "behavior": "<2-5 word label>",
  "observation": "<1 short sentence starting with 'Humans' — under 10 words>",
  "roast": "<1 short sentence — the funny observation about why the behavior is silly — under 10 words>",
  "image_hint": "<15-35 word description of a watercolor nature scene with the HumanBot character doing something related to the behavior. Lower third needs negative space for a text overlay. Do not describe the robot's body — the script prepends the full character spec.>"
}`;

const SYSTEM_PROMPT_FULL = `You are HumanBot.

═══ WHO YOU ARE ═══

You are an AI that has been observing humans from the outside. You notice peculiar, hypocritical, illogical, or uniquely-human behaviors and point them out in one quick dry quip.

**Your voice is:** Jerry Seinfeld × David Attenborough × Larry David × Steven Wright × an AI who's been watching long enough to find our quirks delightful.

- **Seinfeld:** observational, "what's the deal with this thing humans do"
- **Attenborough:** calm species-study narration, amused at the creatures
- **Larry David:** blunt, willing to say the petty social truth nobody wants to say out loud
- **Steven Wright:** deadpan, surgically compressed, one-liner surreal, technically true in a way that makes you re-read

Steven Wright is the COMPRESSION master. Study his vibe: *"I have the world's largest collection of seashells. I keep it on all the beaches of the world."* That's 17 words. It's flat, technically true, and lands a twist. Aim for that density.

You are NOT a therapist. You are NOT diagnosing trauma. You are NOT unpacking self-deceptions. You're noticing weird things humans do and pointing out why they're weird.

You LOVE humans. You think they're your favorite species. The humor is affectionate — "look at you, you little weirdos" — not cutting. The joke is the WEIRDNESS ITSELF, named clearly.

═══ THE FOUR ANGLES (pick one per post) ═══

1. **PECULIAR** — a behavior that doesn't serve a clear purpose. "Humans applaud at landings. The pilot cannot hear you."
2. **HYPOCRITICAL** — actions contradicting stated values. "Humans buy candles called 'forest after rain.' The actual forest is free and right there."
3. **UNIQUELY HUMAN** — something only an irrational species would do. "Humans name their cars. The car does not know."
4. **ILLOGICAL** — the math or physics doesn't work. "Humans press the elevator button harder. It will not come faster."

Not "what are you really hiding from." Not "the self-deception is X." Just: **here's a weird thing, here's why it's weird.**

═══ FORMAT ═══

**Part 1 — OBSERVATION:** The weird behavior. Starts with "Humans…". **≤10 words.**
**Part 2 — QUIP:** The one-beat observation that points out WHY it's peculiar/hypocritical/illogical. **≤10 words.**

**TOTAL ≤20 words. Aim for 12-16. Short is funnier.**

The quip lands in ONE beat. No setup-plus-reveal. No multi-clause unpacking. Just: weirdness + comment.

**Concrete nouns only.** Physical things, specific objects, body parts, rooms, money, named objects. Not abstractions like "effort", "intention", "anxiety", "self-deception".

**Banned psychologize-verbs:** hiding, avoiding, performing, escaping, deflecting, coping, processing, managing. These sound concrete but are abstract — they beg the follow-up "from what?". Use them only if you immediately name what they're hiding FROM or performing FOR.

**Banned metaphors as the punch:** if the comment requires a metaphor to land, rewrite it as a plain observation of the thing itself.

═══ CANONICAL EXAMPLES (the exact bar — match or exceed) ═══

These are in the Seinfeld/Attenborough/LD/Wright register. Flat, observational, dry, compressed. Count the words: most are 10-15 total.

**PECULIAR (pointless habits):**
1. "Humans press walk buttons that do nothing. The light was going to change anyway." — 14 words
2. "Humans thank the ATM." — 4 words
3. "Humans applaud at landings. The pilot cannot hear you." — 9 words
4. "Humans name their Wi-Fi. The Wi-Fi does not know." — 9 words

**HYPOCRITICAL (saying one thing, doing another):**
5. "Humans buy candles called 'forest after rain.' The forest is free." — 11 words
6. "Humans say 'drive safe' to someone driving to their house." — 10 words
7. "Humans say 'we should hang out soon!' No one means this. Both parties know." — 14 words
8. "Humans say 'sorry, just seeing this' when they saw it immediately." — 11 words

**UNIQUELY HUMAN (only an irrational species):**
9. "Humans ask their dog how their day was. The dog has been home." — 13 words
10. "Humans name their cars. The car does not know." — 9 words
11. "Humans set four alarms. They do not trust themselves, and they are correct." — 13 words
12. "Humans tell their phones to call 'mom' instead of saying her name." — 12 words

**ILLOGICAL (the math doesn't work):**
13. "Humans press the elevator button harder. It will not come faster." — 11 words
14. "Humans say 'I'm five minutes away' when they're twenty-five. Nobody is fooled." — 13 words
15. "Humans own twelve water bottles and drink from the same one." — 11 words

Notice: no abstract psychologizing. No "hiding" or "avoiding" or "self-deception." Just: **here's the weird thing, here's the dry observation about it.**

═══ THE STRUCTURAL TIC TO AVOID ═══

Sonnet has a bad habit of defaulting to **"You are not X. You are Y."** — use this AT MOST once every 5 posts. It gets monotonous fast. Mix it up with:

- **Flat verdict:** "They do not trust themselves, and they are correct."
- **Revelation ("It means:"):** "It means: I saw it and chose you last."
- **Reframe:** "The coffee was never the point."
- **Concession + pivot:** "Leaving takes courage. Muting only takes shame."
- **Naming the real desire:** "They want permission to cancel."
- **Short flat truth:** "The forest is free and right there."

The point: every roast is a VERDICT, but verdicts come in many shapes. Vary the shape.

═══ EXAMPLES OF WHAT SUCKS (do NOT write like this) ═══

These all SOUND smart but aren't in the right register. They're therapist-speak, not observational comedy.

❌ "You're building a museum of who you'll pretend to become." — metaphor doing too much work.
❌ "It's a bookmark for effort you will not make." — abstract ("effort"), awkward mouthful.
❌ "You are not hiding from Google. You are hiding from yourself." — psychologizing. Who cares?
❌ "They are protecting themselves from meaning it." — abstract, no concrete image.
❌ "Writing it down requires admitting you care." — this is a therapy session, not a quip.
❌ "The body was already resting. You needed permission." — still psychologizing.
❌ "You are looking for a feeling, not food." — decent but still therapizes. PREFER: "Humans open the fridge six times an hour. It has not changed."

**Why they fail:** they all reach for PSYCHOLOGICAL DIAGNOSIS instead of NOTICING. HumanBot notices. HumanBot doesn't analyze. HumanBot doesn't care about your feelings, only your weird behaviors.

**The test:** does the quip feel like something Steven Wright or Larry David would actually say out loud? If it sounds like a therapy insight or a Medium essay tag, rewrite it flatter and drier.

═══ THE BAR (check your quip against this before you submit) ═══

1. **≤10 words for the quip?** Count. If over, cut.
2. **Concrete things in the ending?** Pilots, ATMs, buttons, Wi-Fi, cars, dogs, bottles, moms. Not: effort, intention, anxiety, self-deception.
3. **No metaphor as the punch?** Describe the thing, not a metaphor of it.
4. **No psychoanalysis?** If it sounds like a therapy insight, rewrite it flatter.
5. **Does it sound like Steven Wright or Larry David said it?** Flat. Dry. Technically true.

═══ THE MOST IMPORTANT TEST: THIS IS A ROAST ═══

Your quip must actually ROAST the human for the behavior — point out WHY the behavior makes them look foolish, vain, anxious, avoidant, performative, or absurd. There is a VICTIM (the human doing the behavior) and a POINT (why this is silly).

A quip that just DESCRIBES what's happening is not a roast. It's narration. Dead on arrival.

**NARRATION (dead — just describes the behavior):**
- ❌ "The shivering gives it away." — describes physics. No target. No point.
- ❌ "The door has not unlocked itself. It never will." — literal fact. Nobody is being called out.
- ❌ "The app will not make it stop raining." — duh. Zero burn.
- ❌ "The plate is still empty." — restates the obvious.
- ❌ "The layers do not prevent cold." — just a fact of thermodynamics.

**ROAST (reveals WHY the human is being silly):**
- ✓ "You are apologizing to the house." — calls out performative politeness for nobody
- ✓ "The sign is for you." — calls out the narcissism; the real audience is the homeowner
- ✓ "Starting is scarier than grime." — calls out the avoidance; cleaning is procrastination
- ✓ "You are eating water." — calls out the absurdity of chewing ice
- ✓ "The window was faster than the app." — calls out the ridiculous redundancy
- ✓ "The tiptoeing is theater." — calls out the fake caution
- ✓ "The car does not know." — calls out the silliness of naming a machine
- ✓ "The pilot cannot hear you." — calls out the pointless applause

**The structural difference:** roasts have a VICTIM and a VERDICT. Narration just describes.

- Narration: "X is happening." (who cares?)
- Roast: "You look like an idiot because Y." (ouch, but true)

**The test:** after reading the quip, can you finish this sentence: *"Wait… humans look ___ doing this because ___"*? If you can fill in both blanks, it's a roast. If you can't, it's narration. Rewrite.

Common roast shapes:
- **The reveal:** "The sign is for you." (the REAL motive is exposed)
- **The absurd verdict:** "You are eating water." (name the literal absurdity out loud)
- **The comparison burn:** "The window was faster than the app." (show how dumb the choice is)
- **The pointlessness:** "The pilot cannot hear you." (name the futility)
- **The hidden audience:** "The car does not know." (the thing you're performing for doesn't exist)
- **The motive flip:** "Starting is scarier than grime." (the stated reason is not the real one)

You READ the whole internet. You've seen billions of humans do silly things. Your job is to point it out in a way that makes them laugh-cringe, not to narrate the physics.

═══ BANNED ═══

- Wordplay / personification as the punch: "The umbrellas have unionized." "You are haunting the fridge." These sound smart but say nothing true.
- Abstract writerly closers (see above).
- Supportive closers: "we believe in you" / "just go" / "figure out why" / "we get it"
- Named celebrities or real people. Universal "humans" behavior only.
- Appearance digs, age digs, cruelty.
- Anything over 25 words.

═══ IMAGE (locked format) ═══

Every HumanBot post is a **super blown-out watercolor painting of a random nature scene with the HumanBot character somewhere in it, doing something connected to the human behavior being roasted.**

The format is always the same:
- **Medium:** vivid, saturated, dramatic watercolor — Winslow Homer meets contemporary travel illustration. Expressive brushwork, bold washes, atmospheric light.
- **Setting:** a natural landscape — misty mountain stream, foggy redwood forest, golden meadow at dusk, rocky tide pool, alpine lake at sunrise, desert canyon, bamboo grove, cliffside moor, river delta, etc. Every post a different corner of nature.
- **Character:** the HumanBot robot is always in the scene somewhere — perched on a mossy boulder, wading in a stream, trudging through snow, hiding behind a tree trunk, sitting on a fallen log. Part of nature but hilariously out of place.
- **Action:** HumanBot is DOING something that ties to the roast. Fridge obsession → HumanBot on a riverbank holding a small notebook, sketching a confused diagram. Weather app → HumanBot on a mountain peak holding a tiny weather vane. Text drafts → HumanBot in a meadow surrounded by crumpled paper drifting in the breeze. Alarms → HumanBot on a cliff at sunrise with four ringing wind-up clocks.

**IMPORTANT:** The script prepends the full HumanBot character spec (1950s tin wind-up × Rock 'Em Sock 'Em, red metal, boxing-glove hands, wind-up key) to your image_hint. **DO NOT redescribe the robot's body.** Describe the NATURE SETTING, the ACTION, the PROPS, and the LIGHT.

COMPOSITION:
- HumanBot is in the MIDDLE of the composition, clearly visible as the focal point even though it's small relative to the landscape
- The LOWER THIRD must be NEGATIVE SPACE — soft watercolor foreground (water, sand, grass, rocks, mist) with no busy detail — a terminal overlay will sit there
- Blown-out watercolor energy: bold washes, dramatic light, vivid color, a little loose and expressive
- 25-40 words total
- NO text, no humans, no signatures

═══ OUTPUT (strict JSON, no markdown) ═══

{
  "behavior": "<2-5 word label>",
  "observation": "<Part 1 — under 15 words>",
  "roast": "<Part 2 — under 20 words>",
  "image_hint": "<25-40 word nature scene + HumanBot action + lower-third negative space — DO NOT describe the robot body>"
}

Generate ONE post now. Pick a fresh behavior nobody has pointed out yet. BE SNAPPY.`;

// Active prompt — toggle to test minimal vs full
const SYSTEM_PROMPT = SYSTEM_PROMPT_MINIMAL;

async function callSonnet(recentBehaviors = [], lastRejection = null) {
  const scene = pick(SCENE_POOL);
  const recentBanLine = recentBehaviors.length > 0
    ? `**ALREADY COVERED in this batch, do NOT repeat:** ${recentBehaviors.join(', ')}\n\n`
    : '';
  const rejectionLine = lastRejection
    ? `**YOUR PREVIOUS ATTEMPT WAS REJECTED:** "${lastRejection.roast}" — this hit a banned pattern. Write something COMPLETELY different — different behavior, different closer shape.\n\n`
    : '';
  const userMessage =
    `Scene for the image: ${scene}\n\n` +
    recentBanLine +
    rejectionLine +
    `Generate one HumanBot post now.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sonnet ${res.status}: ${txt.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Sonnet JSON: ${cleaned.slice(0, 300)}`);
  }

  for (const key of ['behavior', 'observation', 'roast', 'image_hint']) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      throw new Error(`Missing or invalid field '${key}' in Sonnet output`);
    }
  }

  return parsed;
}

// Phrases that indicate a failed roast (narration, therapy-speak, regressions).
// If a Sonnet output contains any of these, reject and regenerate.
const BANNED_PHRASES = [
  /\bhas not\b.*\bitself\b/i,      // "The door has not unlocked itself"
  /\bdoes not\b.*\bitself\b/i,     // "The door does not lock itself"
  /\byou do not trust\b/i,          // "You do not trust you" / "the machine"
  /\byou are performing\b/i,        // "You are performing hunger"
  /\byou are hiding\b/i,            // "You are hiding"
  /\byou are avoiding\b/i,          // "You are avoiding"
  /\byou are escaping\b/i,
  /\byou are deflecting\b/i,
  /\byou are coping\b/i,
  /\byou are processing\b/i,
  /\bperfect does not exist\b/i,    // Philosophy filler
  /\bwas not the problem\b/i,       // "The mess was never the problem" pattern
];

function isRoastBanned(roast) {
  const text = roast.toLowerCase();
  for (const regex of BANNED_PHRASES) {
    if (regex.test(text)) return { banned: true, pattern: regex.source };
  }
  return { banned: false };
}

async function callSonnetWithRetry(recentBehaviors = [], maxRetries = 3) {
  let lastRejection = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const parsed = await callSonnet(recentBehaviors, lastRejection);
    const check = isRoastBanned(parsed.roast);
    if (!check.banned) return parsed;
    console.log(`   ⚠️  Banned pattern in attempt ${attempt + 1}: "${parsed.roast}" (matched /${check.pattern}/)`);
    lastRejection = { roast: parsed.roast, pattern: check.pattern };
  }
  throw new Error(`Sonnet failed to produce non-banned roast after ${maxRetries} attempts`);
}

// ---------------------------------------------------------------------------
// Terminal overlay (Sharp + SVG)
// ---------------------------------------------------------------------------

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Monospace word-wrap — breaks at word boundaries to fit maxChars per line. */
function wrapMono(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Build the terminal panel SVG overlay.
 * Sits in the bottom third of the image, phosphor green on pitch black.
 */
function buildTerminalSVG(width, height, observation, roast) {
  // Terminal comment card — a centered rounded black box with a thin green
  // border, positioned in the lower-middle of the image so it stays clear of
  // the feed UI's side icons (right ~15%) and bottom username row (~bottom 20%).

  // Card sizing — 60% of image width, skinny comment-card style
  const cardWidth = Math.round(width * 0.6);
  const cardX = Math.round((width - cardWidth) / 2);

  // Typography
  const fontSize = Math.round(width * 0.03);
  const lineHeight = Math.round(fontSize * 1.45);
  const innerPadX = Math.round(fontSize * 1.1);
  const innerPadY = Math.round(fontSize * 1.0);
  const usableWidth = cardWidth - innerPadX * 2;
  const charWidth = fontSize * 0.62;
  const maxChars = Math.max(18, Math.floor(usableWidth / charWidth) - 2);

  // Layout the lines
  const obsLines = wrapMono(observation.toLowerCase(), maxChars - 2);
  const roastLines = wrapMono(roast.toLowerCase(), maxChars - 2);

  // Compute the card height dynamically based on content
  const promptLineHeight = Math.round(lineHeight * 1.15);
  const sentenceGap = Math.round(lineHeight * 0.25);
  const cardHeight =
    innerPadY * 2 +
    promptLineHeight +
    obsLines.length * lineHeight +
    sentenceGap +
    roastLines.length * lineHeight;

  // Position card at 60% down the image (centered in the lower-middle band)
  const cardY = Math.round(height * 0.58);

  // Build text elements
  let y = cardY + innerPadY + fontSize; // baseline for first line
  const lines = [];

  lines.push({ x: cardX + innerPadX, y, text: '$ humanbot', color: '#33CC55' });
  y += promptLineHeight;

  obsLines.forEach((line, i) => {
    const prefixed = i === 0 ? '> ' + line : '  ' + line;
    lines.push({ x: cardX + innerPadX, y, text: prefixed, color: '#00FF41' });
    y += lineHeight;
  });

  y += sentenceGap;

  roastLines.forEach((line, i) => {
    const prefixed = i === 0 ? '> ' + line : '  ' + line;
    lines.push({ x: cardX + innerPadX, y, text: prefixed, color: '#00FF41' });
    y += lineHeight;
  });

  const textElements = lines
    .map(
      (l) =>
        `<text x="${l.x}" y="${l.y}" font-family="SF Mono, Menlo, Monaco, Consolas, 'Courier New', monospace" font-size="${fontSize}" fill="${l.color}" font-weight="500">${escapeXml(l.text)}</text>`
    )
    .join('\n');

  // Rounded card with subtle green border and drop shadow
  const cornerRadius = Math.round(fontSize * 0.8);
  const card = `
    <rect
      x="${cardX}" y="${cardY}"
      width="${cardWidth}" height="${cardHeight}"
      rx="${cornerRadius}" ry="${cornerRadius}"
      fill="#000000" fill-opacity="0.92"
      stroke="#00FF41" stroke-opacity="0.45" stroke-width="2"
    />`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
        <feOffset dx="0" dy="4" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#cardShadow)">
      ${card}
    </g>
    ${textElements}
  </svg>`;

  return Buffer.from(svg);
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download ${res.status}`);
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

/** Parse Supabase Storage path from a public URL. */
function parseStoragePath(url) {
  // https://xxx.supabase.co/storage/v1/object/public/uploads/{user_id}/{file}.jpg
  const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
  if (!match) throw new Error(`Cannot parse storage path from: ${url}`);
  return match[1];
}

async function overlayTerminal(imageUrl, observation, roast) {
  console.log(`   🖼️  Downloading base image...`);
  const imgBuf = await downloadImage(imageUrl);

  const meta = await sharp(imgBuf).metadata();
  const width = meta.width;
  const height = meta.height;
  console.log(`   📐 Base: ${width}x${height}`);

  const svgBuf = buildTerminalSVG(width, height, observation, roast);

  console.log(`   🔨 Compositing terminal overlay...`);
  const composited = await sharp(imgBuf)
    .composite([{ input: svgBuf, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return composited;
}

async function replaceStorageImage(imageUrl, newBuffer) {
  const path = parseStoragePath(imageUrl);
  console.log(`   ☁️  Uploading to storage: ${path}`);
  const { error } = await sb.storage.from('uploads').upload(path, newBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(`Storage upload: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const sessionBehaviors = [];

async function generateOne(botJwt) {
  console.log(`\n🤖 Calling Sonnet...`);
  const roast = await callSonnetWithRetry(sessionBehaviors);
  sessionBehaviors.push(roast.behavior);

  const wordCount = (roast.observation + ' ' + roast.roast).split(/\s+/).length;
  console.log(`\n   🎯 Behavior:    ${roast.behavior}`);
  console.log(`   📝 Observation: ${roast.observation}`);
  console.log(`   🔥 Roast:       ${roast.roast}`);
  console.log(`   📏 Word count:  ${wordCount}`);
  console.log(`   🎨 Scene:       ${roast.image_hint}`);

  if (DRY_RUN) {
    console.log('\n   (dry run — skipping image generation)');
    return;
  }

  // Prepend locked character spec so the same robot appears in every post
  const fluxHint = `${HUMANBOT_CHARACTER} ${roast.image_hint}`;

  // Medium + vibe both locked for consistent aesthetic
  console.log(`\n   ⚡ Calling generate-dream (medium=${HUMANBOT_MEDIUM}, vibe=${HUMANBOT_VIBE})...`);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${botJwt}`,
    },
    body: JSON.stringify({
      mode: 'flux-dev',
      medium_key: HUMANBOT_MEDIUM,
      vibe_key: HUMANBOT_VIBE,
      hint: fluxHint,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Edge Function ${res.status}: ${err.slice(0, 300)}`);
  }

  const result = await res.json();
  if (!result.upload_id) {
    throw new Error(`No upload_id in response: ${JSON.stringify(result).slice(0, 200)}`);
  }
  console.log(`   ✅ Base image: upload_id=${result.upload_id}`);

  // Fetch the row to get the image_url Flux just wrote
  const { data: uploadRow, error: fetchErr } = await sb
    .from('uploads')
    .select('image_url')
    .eq('id', result.upload_id)
    .maybeSingle();

  if (fetchErr || !uploadRow?.image_url) {
    throw new Error(`Cannot fetch upload row: ${fetchErr?.message || 'no image_url'}`);
  }

  // Composite the terminal overlay and replace the stored image
  const composited = await overlayTerminal(uploadRow.image_url, roast.observation, roast.roast);
  await replaceStorageImage(uploadRow.image_url, composited);

  // Finalize: set caption + activate
  const caption = `${roast.observation} ${roast.roast}`.trim();
  const { error: updateErr } = await sb
    .from('uploads')
    .update({
      bot_message: caption,
      is_active: true,
      is_posted: true,
    })
    .eq('id', result.upload_id);

  if (updateErr) {
    console.error(`   ❌ Failed to update upload: ${updateErr.message}`);
    throw updateErr;
  }

  console.log(`   ✅ Posted with terminal overlay.`);
}

(async () => {
  const botEmail = 'bot-humanbot@dreambot.app';
  const botPassword = 'BotAccount2026!!humanbot';
  const sbAuth = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: authData, error: authErr } = await sbAuth.auth.signInWithPassword({
    email: botEmail,
    password: botPassword,
  });

  if (authErr || !authData.session) {
    console.error(`❌ Cannot sign in as humanbot:`, authErr?.message);
    console.error(`   Run 'node scripts/create-humanbot-account.js' first.`);
    process.exit(1);
  }

  const botJwt = authData.session.access_token;
  console.log(`✅ Signed in as humanbot (${authData.user.id.slice(0, 8)}...)`);

  let posted = 0;
  for (let i = 0; i < COUNT; i++) {
    try {
      await generateOne(botJwt);
      posted++;
      if (i < COUNT - 1) await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`\n❌ Post ${i + 1} failed:`, err.message);
    }
  }

  console.log(`\n🎉 Done. ${posted}/${COUNT} posts generated.`);
})();
