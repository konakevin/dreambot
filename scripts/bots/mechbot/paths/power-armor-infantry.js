/**
 * MechBot power-armor-infantry path — squads of humans in heavy exosuit armor.
 * Halo / Starship Troopers / 40K Space Marines / Edge of Tomorrow / Avatar AMP.
 * Boots-on-the-ground military sci-fi. Subject is HUMANS first, machinery second.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.POWER_ARMOR_SUBJECTS, 'power_armor_subject');
  const action = picker.pickWithRecency(pools.POWER_ARMOR_ACTIONS, 'power_armor_action');
  const setting = picker.pickWithRecency(pools.POWER_ARMOR_SETTINGS, 'power_armor_setting');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a war cinematographer writing a POWER ARMOR INFANTRY scene for MechBot — a squad of armored soldiers operating tactically. Hyper-real cinematic 3D. Subject is HUMANS first, machinery second. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — SQUAD, NEVER SOLO ━━━
2-5 figures per render. The unit is the subject, not an individual hero. Visible coordination across multiple troopers (formations, complementary roles, angles of cover).

━━━ NON-NEGOTIABLE — TACTICALLY GROUNDED ━━━
These are professionals doing soldier-things. Realistic body language — bracing, scanning, taking cover, communicating with hand signals. NEVER posing for camera.

━━━ THE SQUAD ━━━
${subject}

━━━ THE ACTION (what the squad is DOING — coordinated tactical movement) ━━━
${action}

━━━ THE SETTING ━━━
${setting}

━━━ CAMERA / FRAMING ━━━
${cameraAngle}

The frame must show MULTIPLE soldiers (the squad is the subject). Wide-to-medium shots favored — the viewer must read the unit's coordination, not just one face.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO solo hero shot (squad is non-negotiable)
- NO pilot-in-cockpit framing (mecha-pilots territory)
- NO giant-mech scale (titans territory) — these are HUMAN scale, not titan
- NO cyborg integration — soldiers are fully human under their armor
- NO scrappy improvised armor (rust-apocalypse) — these are professional military kits
- NO industrial mining / construction work (industrial-machines)

━━━ ARMOR / EQUIPMENT FIDELITY ━━━
The squad's faction language and armor archetype as described in the seed MUST hold. Helmets, weapons, mission patches, plate scuffing should all match the seeded squad. Don't drift to generic "futuristic soldiers" — render THE squad described.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
