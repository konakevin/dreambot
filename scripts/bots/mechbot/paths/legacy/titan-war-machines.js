/**
 * MechBot titan-war-machines path — kilometer-scale mechs in active combat.
 * Pacific Rim / 40K Imperator titans / AT-AT / Attack on Titan colossus walks.
 * Pure spectacle. Wide cinematic establishing shots.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.TITAN_WAR_SUBJECTS, 'titan_war_subject');
  const action = picker.pickWithRecency(pools.TITAN_WAR_ACTIONS, 'titan_war_action');
  const setting = picker.pickWithRecency(pools.TITAN_WAR_SETTINGS, 'titan_war_setting');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi cinematographer writing a TITAN WAR MACHINE scene for MechBot — a kilometer-scale combat machine in mid-engagement. Pure spectacle. Wide cinematic establishing shot. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — BIBLICAL SCALE ━━━
The titan is kilometer-tall, skyscraper-scale. NEVER smaller. The scale IS the subject. Tiny humans / vehicles / aircraft must appear in the frame for scale reference (or distant skyline for context).

━━━ NON-NEGOTIABLE — ACTIVE WAR ━━━
War is happening RIGHT NOW. The titan is firing / striding / clashing / shielding / collapsing — NEVER idle. Mid-action freeze-frame.

━━━ THE TITAN ━━━
${subject}

━━━ THE ACTION (what the titan is DOING in this combat moment) ━━━
${action}

━━━ THE BATTLEFIELD / SETTING ━━━
${setting}

The setting is half the storytelling. Smoke columns, fire, debris, broken architecture, atmospheric context — REND every detail. Tiny humans / vehicles / aircraft for scale.

━━━ CAMERA / FRAMING ━━━
${cameraAngle}

WIDE shots strongly favored. The titan must occupy 40-70% of vertical frame from feet/base to head/dorsal — the viewer must feel BIBLICAL scale. NEVER a closeup that loses the titan's overall silhouette.

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
- NO character-scale or vehicle-scale machines (robot-moment / mecha-pilots / industrial-machines / rust-apocalypse territories)
- NO peaceful idle / between-battles framing — combat is HAPPENING
- NO close-up portraits of titan parts that lose the scale silhouette
- NO pilot-cockpit-focus framing (mecha-pilots territory)
- NO wasteland-scavenger / Mad Max DNA (rust-apocalypse)
- NO industrial work language — these are WAR machines

━━━ LEG-COUNT FIDELITY (NON-NEGOTIABLE) ━━━
If the titan description specifies a leg count (quadrupedal / hexapedal / four-legged / six-legged / serpentine), the polished prompt MUST repeat the count TWICE (once near start, once mid-prompt). Flux defaults to bipedal — leg counts collapse without heavy reinforcement.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
