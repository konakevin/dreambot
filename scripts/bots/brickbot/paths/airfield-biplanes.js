/**
 * BrickBot airfield-biplanes — the AVIATION path (2026-09-23).
 *
 * A grass-strip aerodrome built entirely in brick: a vintage BIPLANE as the
 * hero, a windsock on a bar mast, chocks, a corrugated arch hangar with
 * hinged doors, a mechanic minifig up a step-ladder with his head in the
 * cowling. Fills the roster's only genuine subject gap — the 17 live paths
 * cover space / pirates / city / trains / castle-fantasy / mech / western /
 * theme-park / aquatic / winter / forest / islands / macro-display / girly /
 * haunted / landscapes / lego-masters, and NOTHING flies.
 *
 * Canon: LEGO Adventurers pulp expedition bi-wings (Johnny Thunder) +
 * classic LEGO Town/City aerodrome + LEGO Creator vintage propeller planes +
 * LEGO City stunt planes + golden-age barnstorming and pylon air-racing +
 * the Bricklink AFOL aviation-diorama community. Licensed pop-culture
 * flavour is fine (Kevin reversed the BrickBot IP ban 2026-09-22);
 * hard-SF / modern-military photoreal registers stay OUT (photoreal drift).
 *
 * Axes (8 always-on + 1 conditional, per BRICKBOT_AIRFIELD_BIPLANES):
 *   • aircraft          — THE HERO (silhouette + stance + engine + livery;
 *                         also carries the era/role signature, so this path
 *                         has NO separate register axis — LEGO's aviation
 *                         heritage caps a register pool around 15 entries)
 *   • flight_moment     — THE SIGNATURE MONEY-SHOT AXIS (ground-running /
 *                         airborne-low-over-the-field / hangar-surgery)
 *   • airfield_setting  — the all-brick stage
 *   • ground_crew_beat  — verb-led minifig story beat ("Mid-…")
 *   • camera_framing    — MANDATORY DRIVING AXIS (hand-authored, not gen'd)
 *   • build_technique   — the load-bearing ANTI-PHOTOREAL lever
 *   • lighting          — axis-clean time/direction/colour/shadow
 *   • palette           — axis-clean colour story, no object nouns
 *   • field_event       — 50%-gated environmental beat in brick
 *
 * THE THREE TRAPS, all defeated in the POOLS (a template rule never reaches
 * Flux — Sonnet writes only what is present):
 *   1. No real aircraft make/model ever (photoreal stock-imagery pull).
 *   2. Every marking is a painted geometric shape, a small round pictorial
 *      emblem, or an explicitly PLAIN BLANK PANEL — airfields otherwise
 *      render gibberish registration lettering, a hard fail.
 *   3. Anti-photoreal brick signal in every pool + the dedicated
 *      build_technique axis.
 *
 * TILT-SHIFT RETAINED ON PURPOSE — deliberately NO promptPrefixByPath
 * deep-focus entry (playbook Lesson 1: tilt-shift is Flux's "everything in
 * frame is LEGO" signal, and photoreal drift is this path's named critical
 * trap). Adding the prefix is the reserved next lever if frames read too
 * tight — and it must then be the EXACT string lego-city / lego-trains use.
 *
 * Pools live in scripts/bots/brickbot/seeds/brickbot_airfield_*.json and are
 * resolved via bot.poolByName, so pools.js must register the 9 names below
 * in AXIS_POOLS, plus 'airfield-biplanes' in PATHS and in
 * SKIP_LEGACY_PER_PATH (this path has no legacy scenes/lighting/palette
 * triplet — without the skip entry, pools.js load() throws at require time).
 *
 * See:
 *   - scripts/bots/brickbot/archetypes.js          (slots + the failure-mode notes)
 *   - scripts/bots/brickbot/archetype-templates.js (brief template)
 *   - scripts/gen-brickbot-airfield-pools.js       (the 8 gen'd recipes)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md                (BrickBot migration recipe)
 */

module.exports = {
  archetype: 'BRICKBOT_AIRFIELD_BIPLANES',
  pools: {
    aircraft: 'BRICKBOT_AIRFIELD_AIRCRAFT',
    flight_moment: 'BRICKBOT_AIRFIELD_FLIGHT_MOMENT',
    airfield_setting: 'BRICKBOT_AIRFIELD_SETTING',
    ground_crew_beat: 'BRICKBOT_AIRFIELD_GROUND_CREW_BEAT',
    camera_framing: 'BRICKBOT_AIRFIELD_CAMERA_FRAMING',
    build_technique: 'BRICKBOT_AIRFIELD_BUILD_TECHNIQUE',
    lighting: 'BRICKBOT_AIRFIELD_LIGHTING',
    palette: 'BRICKBOT_AIRFIELD_PALETTE',
    field_event: 'BRICKBOT_AIRFIELD_FIELD_EVENT', // 50%-gated conditional
  },
};
