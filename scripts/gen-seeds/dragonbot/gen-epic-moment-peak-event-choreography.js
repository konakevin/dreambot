#!/usr/bin/env node
/**
 * EPIC_MOMENT_PEAK_EVENT_CHOREOGRAPHY — production scale-up 2026-06-05.
 *
 * Always-on cinematic-moment-within-the-moment axis for DragonBot's
 * epic-moment path. Specifies the EXACT freeze-frame instant of the
 * peak event — siege-ladders just kissing the parapet, catapult-stone
 * at apex, dragon mid-dive one wingspan above the spire, crown lowering
 * the final inch onto the kneeling head.
 *
 * This is what separates "a siege" from "the precise second a siege
 * becomes irreversible" — the cinematic instant that reads as inevitable.
 *
 * Append mode preserves the initial 25 hand-curated entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moment_peak_event_choreography.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PEAK-EVENT CHOREOGRAPHY descriptions for DragonBot's epic-moment path. Each entry is a single FREEZE-FRAME INSTANT of an event happening AT / IN / ABOVE / AROUND a fantasy castle — the precise cinematic second when the event reaches maximum visual intensity.

Each entry: 22-35 words. Format: "<event element> mid-<verb>, <spatial relationship to a specific castle architectural feature>, <fine-grained detail that makes the instant readable>."

━━━ THE BAR ━━━
Every entry must (a) name the EVENT (siege / coronation / dragon-arrival / portal-opening / wave-crashing / lightning-strike etc.), (b) freeze it at the EXACT instant of peak intensity — first-contact, apex, mid-fall, just-cresting, point-of-no-return, (c) anchor the freeze-frame TO a specific castle architectural feature (parapet edge, gatehouse arch, eastern spire, southwest tower, inner keep, machicolation lip, belfry arch, portcullis, drawbridge, threshold flagstone, etc.). The frame is INEVITABLE — one frame earlier the event hadn't happened, one frame later it's over.

━━━ VARIETY MANDATE — distribute across these event categories ━━━

WAR / SIEGE (~12 entries):
- Siege-ladder tips first kissing the parapet
- Battering ram first compressing the gatehouse oak
- Catapult stone at apex above the inner keep
- Trebuchet payload mid-release at the moment of slingshot snap
- First arrow loosed from the southern battlement
- Boiling oil first cascading over the machicolation lip
- Siege-tower upper drawbridge mid-fall toward the battlement
- First siege-stone mid-impact at the curtain wall's upper course
- Cavalry charge cresting the ridge-line above the valley castle
- Defenders' first volley mid-flight over the moat
- Sappers breaking through the outer wall in a cloud of dust
- Naval boarding-grapple just locking onto the seawall parapet

CORONATION / CEREMONY (~7 entries):
- Crown lowering the final inch above the kneeling figure's head
- Coronation banner first unfurling from the high spire's iron bracket
- Coronation canopy bearers clearing the inner-ward archway together
- Processional banners crossing the main gate threshold together
- Wedding bell-ringer at peak pull on the rope
- Heir's hand first touching the throne's armrest
- Anointing oil mid-pour above the new monarch's brow

DRAGON / MAGIC EVENT (~12 entries):
- Dragon mid-dive one full wingspan above the eastern spire
- Dragon mid-strafe banking hard above the great hall roof
- Dragon-fire just licking the corner of the pennant flag
- Dragon's wings folding at the instant of perch on the keep parapet
- Dragon's roar leaving its open jaws above the assembled army
- Portal iris dilating to full bloom above the great hall floor
- Spell-circle reaching maximum brilliance at the gatehouse threshold
- Leyline storm-front crossing the spire-line simultaneously
- Lightning-bolt mid-fork striking the iron weathervane
- Summoned-elemental first manifesting in the courtyard cobbles
- Necromantic shadow first oozing from the catacomb gate
- Levitating-stone-circle reaching peak height above the keep

ARRIVAL / ANNOUNCEMENT (~7 entries):
- First horn-blast leaving the parapet trumpeter's bell
- Royal procession cresting the final switchback above the valley
- Messenger reaching the portcullis at full lathered gallop
- Fleet rounding the headland into full line-of-sight
- Diplomat's chariot mid-stride across the drawbridge threshold
- Heralds raising trumpets in unison on the gate-tower platform
- Returning hero crossing the inner-ward threshold at the head of weary column

DESTRUCTION / DISASTER (~7 entries):
- Spire tilting at thirty degrees past vertical, masonry joints splitting
- Wave just cresting the seawall's top course at maximum height
- Earthquake-fissure mid-opening across the inner courtyard flagstones
- Curtain-wall first buckling outward at the breach point
- Volcanic ash-cloud first cresting the western horizon above the keep
- Tidal-surge first breaching the harbor sea-gate at maximum height
- Fire-storm leaping from one banner-pole to the next across the parapet line

━━━ FORMAT — every entry follows this shape ━━━

"<event element> mid-<peak-instant verb>, <spatial relationship to a NAMED castle feature>, <fine-grained detail that locks the moment in time>."

Examples:
- "Siege-ladder tips just kissing the parapet edge, first rung scraping stone at the northeast tower before any soldier has yet crested."
- "Dragon mid-dive one full wingspan above the eastern spire, talons splayed open and shadow consuming the entire upper battlement below."
- "Crown lowering through the final inch above the kneeling figure's head on the throne-room dais, fingertips not yet releasing the golden rim."
- "Catapult stone frozen at apex directly above the inner keep, suspended at maximum height before gravity reclaims it toward the courtyard."

━━━ STRICT RULES ━━━
- The instant is FROZEN — use language like "mid-", "just kissing", "first cresting", "at apex", "the final inch", "the last stride", "the first splintering instant", "before any soldier has yet crested". The reader feels the inevitability.
- NAME a specific castle feature — parapet edge / gatehouse arch / eastern spire / inner keep / machicolation lip / belfry arch / portcullis / drawbridge platform / threshold flagstone / hearthstone pillar / curtain wall's upper course / weathervane / iron bracket / spire-tip / merlon / barbican / outer ward / wall-walk / pinnacle. Vary which feature.
- NO portrait framing. NO close-up on a face. This is the cinematic-event freeze-frame anchored to ARCHITECTURE.
- NO sci-fi / modern / cyberpunk events. Western high-fantasy register only.
- NO two entries should freeze the same event at the same feature.
- Each entry is ONE sentence, no sub-clauses joined by ";".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
