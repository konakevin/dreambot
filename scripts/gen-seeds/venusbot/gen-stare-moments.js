#!/usr/bin/env node
/**
 * Generate 30 STARE (eye-contact) scene seeds for VenusBot's stare path.
 *
 * Every render in this path has the cyborg staring directly into the
 * camera — straight eye contact, locked gaze, the viewer FEELS her
 * looking through the screen. The intent of her stare varies wildly
 * (seductive / menacing / hungry / knowing / predator / vacant /
 * assessing / challenging / etc.) but the eyes are ALWAYS on the lens.
 *
 * Output: scripts/bots/venusbot/seeds/stare_moments.json
 */

const fs = require('fs');
const path = require('path');

const ENV = (() => {
  const env = {};
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  for (const l of lines) {
    const eq = l.indexOf('=');
    if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
  }
  return env;
})();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;

const META = `You are writing 30 STARE scene seeds for VenusBot's stare render path. Every seed = a moment where the cyborg-assassin stares DIRECTLY into the camera. The viewer feels her looking through the screen. Straight eye contact. Locked gaze. The camera IS her target.

━━━ WHO SHE IS ━━━

Cyborg-assassin being — exotic, exquisite, machine to her core. Chrome/composite limbs, translucent torso panel revealing internal power core, segmented chrome neck. Only her face is organic. She is cold, mysterious, dangerous. Beautiful in a way that makes you uneasy.

━━━ THE PATH (what makes it unique) ━━━

EYE CONTACT. She is looking DIRECTLY AT THE CAMERA in every seed — eyes locked on the lens. No side-glances, no off-camera stares, no averted gaze. The viewer's whole experience is being LOOKED AT BY HER.

━━━ THE GAZE — vary the INTENT of her stare widely ━━━

Each seed should specify the stare's INTENT. Vary wildly across the 30:

- seductive / come-hither / bedroom-eyed (she wants you closer)
- menacing / predator-locked / "I've decided you die tonight"
- hungry / starving / the kind of look that devours
- knowing / amused / she's seen right through you
- assessing / clinical / technical-manual reading
- challenging / daring / "try me"
- vacant / void-eyed / nothing-behind-the-eyes
- calm / glacial / bored even
- wounded / haunted / something behind the machine
- inviting / slow-burn / "come here"
- commanding / authoritative / "kneel"
- playful / amused-predator / cat-with-mouse
- longing / starving-for-something / rare vulnerability
- mocking / smirking / contempt
- through-you / 1000-yard / staring past the viewer's soul
- hypnotic / trance-inducing / can't look away
- tracking / mechanical / targeting-software lock
- intimate / close-up / "it's just you and me"

━━━ COMPOSITION ━━━

Each scene should make the eye contact UNESCAPABLE. Pose/framing options:

- Tight head-and-shoulders closeup, face filling the frame, eyes locked
- Over-the-shoulder turn back to camera, direct eye contact through the pose
- Leaning forward into the lens, her face close, eyes burning into yours
- Low-angle looking up at her, she looks DOWN at the viewer
- High-angle looking down at her, she looks UP through lashes directly at the lens
- Mirror reflection — her eyes meeting the viewer through a mirror
- Reclined pose, head turned sharply to face camera directly
- Side profile that pivots at the last second — eye catches the lens
- Through a window / sheet of glass / rain / mist — her eyes still lock on
- In a crowd — she's the only one looking directly at the camera

━━━ SETTINGS ━━━

Vary the SETTING per seed (futuristic generally — cyberpunk, editorial studio, domestic interior, rooftop, industrial, gallery, corporate lobby, alleyway, vehicle interior, boudoir-non-bedroom-moment). Don't lean on one setting type.

━━━ RULES ━━━

1. 30 seeds. Each 40-70 words.
2. Every seed — EXPLICITLY name that she stares directly into the camera / lens / viewer. "Eyes locked on camera," "gaze cuts through the lens," "looking directly at the viewer," etc.
3. Specify the INTENT of her stare (use one of the 18 variants above or invent).
4. Specify the composition / framing so eye contact is the hook.
5. Specify the setting briefly.
6. Don't lock skin tone / glow color / outfit — those are axes rolled at render time.
7. Don't repeat gaze intent, composition, or setting across seeds. Each distinct.
8. No combat weapons, no overt fucking-invitations, no bedrooms/baths. Just her staring you down.

━━━ OUTPUT ━━━

JSON array of 30 strings. No preamble, no numbering.`;

async function callWithRetry(body) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return await res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      console.log(`  ⏳ ${res.status} — retry ${i + 1}/${delays.length} in ${delays[i] / 1000}s`);
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

(async () => {
  console.log('🌱 Asking Sonnet for 30 stare moments...\n');
  const data = await callWithRetry({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    messages: [{ role: 'user', content: META }],
  });
  const raw = (data.content[0]?.text || '').trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) { console.error('No JSON. Raw:\n', raw); process.exit(1); }
  const seeds = JSON.parse(match[0]);
  const outPath = 'scripts/bots/venusbot/seeds/stare_moments.json';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(seeds, null, 2));
  console.log(`✅ Saved ${seeds.length} stare moments to ${outPath}\n`);
  seeds.slice(0, 5).forEach((s, i) => console.log(`#${i + 1}: ${s.slice(0, 200)}${s.length > 200 ? '...' : ''}`));
  console.log(`... (${seeds.length - 5} more)`);
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
