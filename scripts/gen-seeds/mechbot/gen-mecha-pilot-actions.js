#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mecha_pilot_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACTION descriptions for MechBot's mecha-pilots path. Each describes what the PILOT is doing in their relationship to the mech, 12-18 words.

━━━ ABSOLUTE RULE — PILOT VISIBLE & MID-MOTION ━━━
The pilot must be visible in frame and engaged in a clear action. NEVER static-portrait pilot facing camera. The pilot's body language tells the story.

━━━ ACTION CATEGORIES (spread across all) ━━━
- Climbing the mech (ladder, shoulder grip, hatch handle)
- Inside cockpit hands-on-controls (mid-flight / firing / steering)
- Pre-launch sequence (harness check, panel ignition, helmet on)
- Post-mission disembark (hatch open, stepping out, exhausted slump)
- On the mech-shoulder mid-survey (kneeling on chassis, scanning horizon)
- Hailing / signaling the machine (gesture summoning the mech to dock)
- Mid-repair (welding torch on a panel, arms inside an open access port)
- Briefing pose at the mech's feet (helmet under arm, looking up at it)
- Bailing out / ejecting (canopy mid-blow, pilot mid-eject)
- Hot-loading equipment (handing ammo cassette to a tech beside the mech)

━━━ BANNED ━━━
- NO standing still posing for camera
- NO floating/levitating
- NO action that doesn't reference the mech (e.g., "drinking coffee" without the mech in relationship)

━━━ EXAMPLES (write fresh) ━━━
- "Sliding into the cockpit through the overhead hatch, harness straps swaying as boots find pedals"
- "Crouched on the mech's right shoulder mid-survey, helmet under arm, binoculars raised toward distant smoke"
- "Yanking emergency-eject lever, canopy already half-blown, hair whipped by escape jets"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary verb + pilot's physical relationship to the mech (inside / on / climbing / beside / mid-eject).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
