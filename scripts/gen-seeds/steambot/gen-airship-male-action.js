#!/usr/bin/env node
/**
 * SteamBot airship-MALE ACTION — scale to ~150 (2026-06-27, Kevin approved).
 *
 * Male sibling of gen-airship-female-action.js. Scales the de-costumed iconic
 * hero-shot pose pool from the approved MVP-25 to ~150 for feed freshness.
 *
 * HARD LESSON baked in (the "captain-coat" regression): the action axis must
 * describe ONLY pose + airship staging + props + sky/light — NEVER clothing.
 * Naming a garment makes Sonnet dress every render in it and override the
 * outfit slot. The old male action pool was also ~85-90% crisis-busywork
 * (cannon-recoil, engine-valve-crisis); this replaces it with composed,
 * poster-worthy hero-shots. He/his throughout.
 *
 * Equal-share per the 8 iconic molds (one Sonnet call per mold, append).
 * Scan clean of costume words after running.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const OUT = 'scripts/bots/steambot/seeds/airship_male_action.json';

const NO_CLOTHING = `
━━━ ABSOLUTE RULES (breaking these breaks the render) ━━━
- Describe ONLY: his POSE / body position, what his hands are doing, the airship element he is on (prow, helm-wheel, brass rail, gunwale, rigging, shroud, crow's-nest, mast, yard-arm, catwalk, deck), any single PROP he holds (brass spyglass / telescope / sextant / astrolabe / signal-lantern / signal-flare / star-chart / a sheathed cutlass at his hip), and the SKY / CLOUD / LIGHT staging around him.
- NEVER describe clothing or appearance: NO coat, jacket, uniform, dress, gown, corset, cloak, cape, pelisse, blouse, shirt, sleeve, lapel, collar, epaulet, gloves, fabric, leather, or any garment. His outfit and face are handled by SEPARATE systems — naming clothes overrides them.
- Do NOT give him a rank or job title (no "officer", "captain", "admiral", "pirate", "navigator" as a label). Separate system.
- Hair caught in the wind / slipstream IS allowed. Boots touching a rail/deck as a body position is fine; do not describe the boots as fashion.
- Handsome through poise and command — never seductive, never shirtless (these are pose descriptors, so that is automatic).
- Format: TITLE-CAPS lead phrase, then one vivid sentence, 28-42 words, cinematic movie-poster staging. He OWNS the frame with poise.`;

const MOLDS = [
  {
    title: 'PROW / BOW STAND',
    desc: 'commanding the very prow or bow of the airship, leaning into the wind, gazing ahead',
    ex: [
      'PROW-STAND INTO THE STORM — he plants both boots wide at the very tip of the prow, hands loose on the brass rail, leaning into the wind as the airship cleaves through a violet pre-dawn cloudbank, hair pushed back',
      'BOW-RAIL SALUTE INTO SUNRISE — standing tall at the bow with one hand raised in a steady salute, his free arm braced on the rail, as the airship crests a cloudbank and the rising sun ignites the horizon ahead',
    ],
  },
  {
    title: 'AT THE HELM',
    desc: 'poised at the great brass ship-wheel, banking the airship, eyes ahead',
    ex: [
      'AT THE GREAT HELM IN GOLDEN HOUR — one firm hand wrapped around a spoke of the towering brass wheel, body angled with the canting deck, his other arm extended toward a blazing amber horizon as he banks through lit cumulus towers',
      'WHEEL-HAND AT MIDDAY — standing easy at the helm with one casual hand resting on a single spoke, weight on one hip, his other hand shading his eyes as a wall of brilliant white cumulonimbus fills the horizon',
    ],
  },
  {
    title: 'SPYGLASS / HORIZON SURVEY',
    desc: 'sweeping the horizon or cloudtops with a brass spyglass or telescope, from a rail or crow’s nest',
    ex: [
      'SPYGLASS ON THE CROW’S-NEST RAIL — one boot planted on the rigging-platform rail, body canted out over a mile of open sky, brass spyglass pressed to his eye as he tracks a distant convoy threading between moonlit cloudpeaks far below',
      'SPYGLASS FROM THE SIGNAL-BRIDGE — hip leaned against the brass signal-bridge rail high above the gondola, telescope extended toward a far headland bristling with dock-lights, the wide gulf of cloud framing his silhouette cleanly',
    ],
  },
  {
    title: 'SIGNAL COMMAND',
    desc: 'raising a signal-lantern or signal-flare aloft toward a distant sister-ship, with dramatic light',
    ex: [
      'SIGNAL-FLARE INTO THE DARK — standing at the aft rail with a brilliant crimson flare thrust overhead, the burning light sculpting his face from below, while three answering sparks bloom across the black cloud-gulf ahead',
      'LANTERN-SIGNAL TO THE FLAGSHIP — holding a brass signal-lantern out at arm’s length over the port rail, the amber glow washing across his face as a vast flagship answers with a sweep of light through the cloud-layer',
    ],
  },
  {
    title: 'RAIL-LEAN / WATCHING THE FLEET',
    desc: 'leaning composed on the rail or gunwale, watching ships in formation or the cloud-world below',
    ex: [
      'RAIL-LEAN AT DAWN — forearms draped easy over the brass gunwale, chin lifted, watching four sister-ships bank into formation through a rose-gold undercast, hair stirred by the gentle slipstream',
      'GUNWALE-LEAN AT DUSK — sitting sideways on the broad gunwale with one leg dangling into open air and one hand on the rail behind him, utterly composed, as the sunset sets the cloudscape beneath him on fire',
    ],
  },
  {
    title: 'NAVIGATOR’S POISE',
    desc: 'holding a sextant, astrolabe, or star-chart with quiet command, reading the sky',
    ex: [
      'NAVIGATOR’S SEXTANT BREAK — standing at the chart table built into the open bridge rail, brass sextant raised to a clear gap in racing clouds, moonlight striking the instrument’s arc silver while his free hand anchors the star-chart against the wind',
      'ASTROLABE IN STARLIGHT — standing alone at the open fore-deck with a great brass astrolabe raised in both hands, face tipped upward to a galaxy-filled rift between clouds, perfectly still in a rare windless moment',
    ],
  },
  {
    title: 'WIND-SWEPT DECK HERO POSE',
    desc: 'standing mid-deck, hair streaming, a confident commanding stance, a hand resting on a rail or a sheathed cutlass at his hip',
    ex: [
      'MID-DECK HERO IN TEMPEST LIGHT — planted dead-centre of the main deck, hair ripped back by the gale, one hand resting on the hilt of a sheathed cutlass at his hip, chin level, the cloudscape erupting in copper lightning behind him',
      'MID-DECK PAUSE — one boot up on a deck-cleat, forearm resting on his raised knee, studying the far horizon, the warm updraft from the cloudbank below stirring his hair',
    ],
  },
  {
    title: 'AERIAL VANTAGE / RIGGING PERCH',
    desc: 'perched high on the mast, shroud, yard-arm, or rigging looking out over the cloud-world — scale and poise',
    ex: [
      'MAST-PERCH OVER THE WORLD — bracing on the highest yard-arm with one hand locked around the mast and one boot on the spar, he gazes across a boundless ocean of sunlit cloudtops, framed against the vast silk envelope above him',
      'RIGGING-PERCH STARBOARD SHROUD — locked one-handed around the starboard shroud high above the gondola, one arm extended for balance, body angled to face the camera, as the rising sun catches him from below and the cloud-world plunges away beneath his boots',
    ],
  },
];

(async () => {
  let runningTotal = 25; // approved MVP-25 already in the file
  const PER_MOLD = 16;
  for (const mold of MOLDS) {
    runningTotal += PER_MOLD;
    console.log(`\n━━━ MOLD: ${mold.title} → target ${runningTotal} ━━━`);
    await generatePool({
      outPath: OUT,
      total: runningTotal,
      batch: 24,
      maxTokens: 16000,
      append: true,
      metaPrompt: (n) =>
        `You are writing ${n} ICONIC, poster-worthy ACTION poses for SteamBot's airship-MALE path, ALL of the "${mold.title}" type: ${mold.desc}. A single handsome, commanding steampunk man caught in a composed cinematic hero-shot on or around a steampunk airship. He OWNS the frame with poise while the wind and the cloud-world dramatize him.
${NO_CLOTHING}

━━━ EXAMPLES (mirror register exactly — note NO clothing is named) ━━━
${mold.ex.map((e) => `"${e}"`).join('\n')}

Vary the time of day, the cloud / sky mood, the exact airship element, the prop he holds, and his precise posture so no two repeat. Return ONLY a JSON array of ${n} strings. No commentary.`,
    });
  }
  console.log('\n✅ All molds done.');
})();
