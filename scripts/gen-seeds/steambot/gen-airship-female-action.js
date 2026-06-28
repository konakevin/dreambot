#!/usr/bin/env node
/**
 * SteamBot airship-female ACTION — scale to ~150 (2026-06-27, Kevin approved).
 *
 * Scales the de-costumed "iconic hero-shot" pose pool from the approved MVP-25
 * to ~150 for long-term feed freshness (action is the memorable SCENE axis;
 * the appearance axes stay small because their combinatorial product is already
 * millions of looks).
 *
 * HARD LESSON baked into the recipe (the "captain-coat" regression, 2026-06-27):
 * the action axis must describe ONLY pose + airship staging + props + sky/light.
 * The MOMENT it names clothing ("captain's coat billowing", "officer"), Sonnet
 * dresses every render in that garment and overrides the outfit slot, collapsing
 * the whole path into one blue brass-button naval coat. NO garment words here.
 *
 * Equal-share per the 8 iconic molds (one Sonnet call per mold, append) so no
 * mold gets starved by cross-batch dedup. Run scan after: grep for clothing
 * words and reword any that leak before shipping.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const OUT = 'scripts/bots/steambot/seeds/airship_female_action.json';

const NO_CLOTHING = `
━━━ ABSOLUTE RULES (breaking these breaks the render) ━━━
- Describe ONLY: her POSE / body position, what her hands are doing, the airship element she is on (prow, helm-wheel, brass rail, gunwale, rigging, shroud, crow's-nest, mast, yard-arm, catwalk, deck), any single PROP she holds (brass spyglass / telescope / sextant / astrolabe / signal-lantern / signal-flare / star-chart / a sheathed cutlass at her hip), and the SKY / CLOUD / LIGHT staging around her.
- NEVER describe clothing or appearance: NO coat, jacket, uniform, dress, gown, corset, cloak, cape, pelisse, blouse, shirt, sleeve, lapel, collar, epaulet, gloves, fabric, leather, or any garment. Her outfit and face are handled by SEPARATE systems — naming clothes overrides them and ruins the variety.
- Do NOT give her a rank or job title (no "officer", "captain", "admiral", "pirate", "navigator" as a label). That is a separate system.
- Hair caught in the wind / slipstream IS allowed (hair is not clothing). Boots touching a rail/deck as a body position is fine; do not describe the boots as fashion.
- Format: TITLE-CAPS lead phrase, then one vivid sentence, 28-42 words, cinematic movie-poster staging. She OWNS the frame with poise.`;

const MOLDS = [
  {
    title: 'PROW / BOW STAND',
    desc: 'commanding the very prow or bow of the airship, leaning into the wind, gazing ahead — the iconic bow pose',
    ex: [
      'PROW-STAND INTO THE STORM — she plants both boots wide at the very tip of the prow, hands loose on the brass rail, leaning into the wind as the airship cleaves through a violet pre-dawn cloudbank, hair streaming behind her',
      'BOW-RAIL SALUTE INTO SUNRISE — standing tall at the bow with one hand raised in a steady salute, her free arm braced on the rail, as the airship crests a cloudbank and the full disc of the rising sun ignites the horizon ahead',
    ],
  },
  {
    title: 'AT THE HELM',
    desc: 'poised at the great brass ship-wheel, banking the airship, eyes ahead',
    ex: [
      'AT THE GREAT HELM IN GOLDEN HOUR — one firm hand wrapped around a spoke of the towering brass wheel, body angled with the canting deck, her other arm extended toward a blazing amber horizon as she banks through lit cumulus towers',
      'WHEEL-HAND AT MIDDAY — standing easy at the helm with one casual hand resting on a single spoke, weight on one hip, the other hand tucking a wayward strand of hair back as a wall of brilliant white cumulonimbus fills the horizon',
    ],
  },
  {
    title: 'SPYGLASS / HORIZON SURVEY',
    desc: 'sweeping the horizon or cloudtops with a brass spyglass or telescope, from a rail or crow’s nest',
    ex: [
      'SPYGLASS ON THE CROW’S-NEST RAIL — one boot planted on the rigging-platform rail, body canted out over a mile of open sky, brass spyglass pressed to her eye as she tracks a distant convoy threading between moonlit cloudpeaks far below',
      'SPYGLASS FROM THE SIGNAL-BRIDGE — hip leaned against the brass signal-bridge rail high above the gondola, telescope extended toward a far headland bristling with dock-lights, the wide gulf of cloud and darkening sky framing her cleanly',
    ],
  },
  {
    title: 'SIGNAL COMMAND',
    desc: 'raising a signal-lantern or signal-flare aloft toward a distant sister-ship, with dramatic light',
    ex: [
      'SIGNAL-FLARE INTO THE DARK — standing at the aft rail with a brilliant crimson flare thrust overhead, the burning light sculpting her face from below, while three answering sparks bloom across the black cloud-gulf ahead',
      'LANTERN-SIGNAL TO THE FLAGSHIP — holding a swinging brass signal-lantern out at arm’s length over the port rail, the amber glow washing warm across her upturned face as a vast flagship answers with a sweep of light through the cloud-layer',
    ],
  },
  {
    title: 'RAIL-LEAN / WATCHING THE FLEET',
    desc: 'leaning composed on the rail or gunwale, watching ships in formation or the cloud-world below',
    ex: [
      'RAIL-LEAN AT DAWN — forearms draped easy over the brass gunwale, chin resting lightly on one fist, watching four sister-ships bank into formation through a rose-gold undercast, hair lifted by the gentle slipstream',
      'GUNWALE-LEAN AT DUSK — sitting sideways on the broad gunwale with one leg dangling into open air and one hand on the rail behind her, utterly composed, as the sunset sets the cloudscape beneath her on fire in scarlet and gold',
    ],
  },
  {
    title: 'NAVIGATOR’S POISE',
    desc: 'holding a sextant, astrolabe, or star-chart with quiet command, reading the sky',
    ex: [
      'NAVIGATOR’S SEXTANT BREAK — standing at the chart table built into the open bridge rail, brass sextant raised to a clear gap in racing clouds, moonlight striking the instrument’s arc silver while her free hand anchors the star-chart against the wind',
      'ASTROLABE IN STARLIGHT — standing alone at the open fore-deck with a great brass astrolabe raised in both hands, face tipped upward to a galaxy-filled rift between clouds, perfectly still in a rare windless moment high above the sleeping world',
    ],
  },
  {
    title: 'WIND-SWEPT DECK HERO POSE',
    desc: 'standing mid-deck, hair streaming, a confident adventurer’s stance, a hand resting on a rail or a sheathed cutlass at her hip',
    ex: [
      'MID-DECK HERO IN TEMPEST LIGHT — planted dead-centre of the main deck, hair ripped into wild streaming banners by the gale, one hand resting on the hilt of a sheathed cutlass at her hip, chin level, the cloudscape erupting in copper lightning behind her',
      'MID-DECK PAUSE — one boot up on a deck-cleat, elbow resting on her raised knee and chin in her hand, studying the far horizon, the warm updraft from the cloudbank below stirring her hair',
    ],
  },
  {
    title: 'AERIAL VANTAGE / RIGGING PERCH',
    desc: 'perched high on the mast, shroud, yard-arm, or rigging looking out over the cloud-world — scale and poise',
    ex: [
      'MAST-PERCH OVER THE WORLD — straddling the highest yard-arm with one hand locked around the mast and one knee hooked over the spar, she gazes across a boundless ocean of sunlit cloudtops, tiny against the vast silk envelope above her',
      'RIGGING-PERCH STARBOARD SHROUD — locked one-handed around the starboard shroud high above the gondola, one arm extended outward for balance, body angled to face the camera, as the rising sun catches her from below and the cloud-world plunges away beneath her boots',
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
        `You are writing ${n} ICONIC, poster-worthy ACTION poses for SteamBot's airship-female path, ALL of the "${mold.title}" type: ${mold.desc}. A single gorgeous, confident steampunk woman caught in a composed cinematic hero-shot on or around a steampunk airship. Think the iconic movie-poster moment — she COMMANDS the frame with poise while the wind and the cloud-world dramatize her.
${NO_CLOTHING}

━━━ EXAMPLES (mirror register exactly — note NO clothing is named) ━━━
${mold.ex.map((e) => `"${e}"`).join('\n')}

Vary the time of day, the cloud / sky mood, the exact airship element she stands on, the prop she holds, and her precise posture so no two repeat. Return ONLY a JSON array of ${n} strings. No commentary.`,
    });
  }
  console.log('\n✅ All molds done.');
})();
