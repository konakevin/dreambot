#!/usr/bin/env node
/**
 * COZY_ARCANE_CANDID_MOMENT — 2026-06-05 rewrite.
 *
 * Original pool (25 entries, Kevin's audit): ~75% pure-mundane actions
 * (dipping a quill / kneeling at the hearth / asleep at the desk /
 * blowing dust off an atlas / cross-legged with a tome). Renders read
 * as "a character just sitting in a room reading a book" — no visible
 * magic in the moment despite the path being COZY *ARCANE*.
 *
 * New mandate: EVERY entry must show the character mid-moment WITH
 * visible magic in the same beat — either actively performing magic
 * (mid-cast / mid-brew / mid-chalk / mid-invoke) OR doing something
 * mundane WHILE magical action is visible right beside them (reading
 * by a glowing rune in the air / writing while a self-quill drafts on
 * fresh parchment / sipping tea as a wisp-orb hovers past).
 *
 * The clutter_focus axis (pickN:3) supplies magical PROPS (alembic /
 * grimoire / runed orb); the magical_signature axis supplies AMBIENT
 * magic when it fires (template-gated 50%); the candid_moment axis
 * now supplies the CHARACTER'S RELATIONSHIP to magic in the frame.
 * Three layers of magic stacking — character + props + ambient.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_candid_moment.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CANDID-MOMENT descriptions for DragonBot's cozy-arcane path — what the wizard / alchemist / scholar / hedgewitch is doing RIGHT NOW in their magical-cluttered sanctum, captured as if on a hidden camera. Each entry is one sentence, 15-25 words, third-person ("Bent over...", "Cradling...", "Mid-pour of...").

━━━ THE HARD MANDATE — EVERY ENTRY HAS VISIBLE MAGIC IN THE MOMENT ━━━

Every entry must show the character mid-action WITH visible magic happening in the same beat. The magic appears IN THE SENTENCE — a glowing rune, a floating ingredient, a chalk-circle, a wisp, a bubbling cauldron, a self-writing quill, a hovering tome, a swirling potion, an active aura, a summoned light, a binding sigil.

This is the COZY *ARCANE* path. A scholar reading a book without any visible magic FAILS this path — it reads as a generic library scene. Every entry must answer "yes" to: "Is there visible magic happening in this specific moment?"

━━━ TWO ENTRY SHAPES (distribute roughly 50/50) ━━━

SHAPE A — ACTIVE MAGIC: the character IS the magic-doer. Examples:
  • "Cupping a small flame of pale-green fire in both palms, lips moving softly through a binding-cantrip."
  • "Stirring a copper cauldron with a long wooden spoon as silver vapor coils up and curls back into the brew."
  • "Tracing a glowing chalk-rune onto the hearthstone slab, ash-grey smoke rising where the line completes."
  • "Mid-pour of luminous violet liquid from a flask into a smaller vial, drops hanging suspended for a beat too long."
  • "Holding both hands above an open spell-circle on the floor, pale-gold light gathering at her fingertips."
  • "Whispering into a clouded crystal orb cradled in both palms, the cloud inside parting toward a flicker of vision."

SHAPE B — MUNDANE-WITH-AMBIENT-MAGIC: the character does something mundane WHILE magic is plainly happening in the same beat. The mundane action and the magical element appear in the SAME sentence. Examples:
  • "Cross-legged on the hearthrug with a heavy tome propped open, a small wisp-orb hovering just above the page lighting the cramped script."
  • "Sipping tea from a cracked mug as a self-writing silver quill drafts steadily beside her on fresh parchment."
  • "Bent over star-charts with one finger pressed to a constellation, a thin curl of luminous vapor rising lazily from a brass censer beside the desk."
  • "Asleep at the writing desk with cheek on a folded arm, a soft pale-blue rune still pulsing slowly in the air above the candle stub."
  • "Mid-bite of an apple while a small flame-elemental dances above the open grimoire next to him, casting flicker-light across his face."
  • "Pouring a kettle of hot water into a teapot as three pale wisp-orbs orbit the bookshelf in lazy ellipses behind him."
  • "Threading a needle by candlelight, an enchanted-glowing thimble on the thumb of his other hand spinning lazily in midair waiting."

━━━ VARIETY MANDATE (distribute roughly across these magical activities) ━━━

- 5 SPELL-CASTING (mid-incantation / binding-circle / chalk-rune / cantrip / channeling)
- 5 ALCHEMY (cauldron-stirring / potion-decanting / ingredient-grinding / tincture-distilling / vial-corking)
- 4 DIVINATION (crystal-orb-gazing / star-chart-consulting / smoke-reading / palm-of-symbols / scrying-bowl)
- 4 ENCHANTING / RUNE-WORK (sigil-tracing / object-charging / rune-chalk / binding-knot)
- 3 GRIMOIRE-WORK (tome-reading WITH visible magic — self-writing quill / floating page / glowing script / pulsing rune above text)
- 2 FAMILIAR-INTERACTION (feeding / training / petting a familiar that is itself visibly magical — wisp-fox / book-imp / pseudo-dragon)
- 2 MUNDANE-DOMESTIC WITH AMBIENT MAGIC (tea / writing letter / mending / dozing — but with a self-writing quill / wisp-orb / pulsing rune / floating ingredient plainly present in the same moment)

━━━ BANS — these are the failures the rewrite is fixing ━━━

- NO sentence that ONLY describes a mundane action with no magical element in the same beat. "Cross-legged with a tome on his knees" alone FAILS. Add the magical element: "...a wisp-orb hovering above the page."
- NO "blowing dust off an atlas" / NO "kneeling at the hearth to nudge a log" / NO pulling-cork-from-a-bottle as the entire action — those are pure mundane. They MUST be paired with visible magic in the same sentence.
- NO "lips moving silently" or "deep in concentration" without a magical element being acted on or reacted to — concentration only counts if the magic effect is named in the sentence.
- NO ambiguous magic. Name a SPECIFIC visible element with COLOR or SHAPE — "soft glow" is weak; "pale-gold light at her fingertips" is good. "Some magic" is weak; "a chalk-rune slowly pulsing crimson" is good.

━━━ MOOD ━━━

Quiet, focused, candid — the wizard is alone or with a familiar, deep in their craft. Never posed. Never looking at the viewer. The render captures a beat the wizard didn't know was being watched. The magic is intimate-scale (chalk-rune on hearthstone — NOT cathedral-magic).

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with a present-participle verb or "Mid-" construction ("Stirring..." / "Mid-pour..." / "Cross-legged..." / "Bent over...").`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
