#!/usr/bin/env node
/**
 * Generate 20 distinct CHARACTER BASE paragraphs for VenusBot.
 * Each is a different flavor of the same species: an exquisite, exotic,
 * cyborg-assassin-beautiful being. Each paragraph forces specific
 * clearly-mechanical body parts so Flux can't default to "woman with
 * chrome accents." Shared pool — all VenusBot paths roll from this.
 *
 * Output: scripts/bots/venusbot/seeds/characters.json (array of strings)
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

const META = `You are writing 20 CHARACTER BASE paragraphs for a cyborg-female AI render bot called VenusBot. These paragraphs are the IDENTITY LOCK per render — one gets picked at render time and handed to Sonnet/Flux to compose a scene. So each paragraph must force Flux to render a CLEARLY MECHANICAL cyborg, not a woman with chrome accents.

━━━ THE CORE CONCEPT (same for all 20) ━━━

Kevin's distilled frame: "If a sexy machine and a sexy sultry woman had a baby, and then made that baby a mysterious killer — that's what she looks like." She is an exquisite, exotic cyborg-assassin being. Part human or alien, machine to the core. She never poses — she eyes the viewer down with cold intent. Sexy as fuck, dangerous as hell. You can't quite tell what species she started as.

━━━ WHY 20 VARIANTS ━━━

The 20 paragraphs all describe the SAME SPECIES of being, but each is a different FLAVOR / ARCHETYPE / VIBE. Flux will cluster if we hand it only one identity. Having 20 rotating character bases forces character-level variety at render time — each paragraph has a DIFFERENT body architecture (chrome arms vs gothic spine-lights vs street-samurai jade biotech vs glass-skull cosmic oracle vs ice-cold interrogator etc).

━━━ REQUIREMENTS FOR EACH PARAGRAPH ━━━

1. Length: 100-150 words each.
2. ALL have the same core energy: exquisite, exotic, dangerous, never-poses, eyes-you-down, sexy-as-fuck-dangerous-as-hell, mysterious, up-to-something.
3. Each forces 4-6 SPECIFIC MECHANICAL BODY PARTS that Flux can render. Use visual-prompt language that Flux responds to: "chrome ball-socket shoulder joints with visible hydraulics," "articulated servo fingers with no flesh," "translucent smoke-grey acrylic torso panel revealing gear clusters and pulsing power core," "segmented chrome neck with visible actuators," "chrome-plated legs from hip to ankle with hinge joints at knee and ankle," "fiber-optic nerve cables exposed along forearm," "transparent skull section revealing circuit mesh," "chrome jawline with segmented articulation" — mix and vary these per paragraph.
4. Each paragraph has a distinct FLAVOR / ARCHETYPE — give them internal nicknames in your head (the Predator, the Gothic Priestess, the Street Samurai, the Cosmic Oracle, the Ice Interrogator, the Biomech Dancer, the Shadow Broker, the Plasma Saint, the Carbon Monk, the Void Widow, the Neon Hunter, the Chrome Duchess, the Glass Diplomat, the Ruined Icon, the Quiet Reaper, the Mirror Ghost, the Fracture Queen, the Circuit Courtesan, the Gold Vulture, the Ash Siren — or invent your own).
5. Each paragraph locks the ORGANIC part to the face primarily (maybe throat/décolletage too). The rest is MACHINE. Machine is the majority of her visible body.
6. Face organic features can vary — human-looking in some paragraphs, exotic alien (iridescent scales, pointed ears, triple irises, elongated cranium) in others.
7. NO nudity language — if chest is mentioned it's translucent acrylic showing mechanical internals or chrome plating.
8. NO specific skin tone or glow color (those are separate slots rolled at render time).
9. NO specific setting or scene (that's the path's job). Focus purely on the BEING.

━━━ OUTPUT ━━━

Return ONLY a JSON array of 20 strings, each 100-150 words, each one a distinct character flavor. No preamble, no numbering, no commentary.`;

(async () => {
  console.log('🌱 Asking Sonnet for 20 character bases...\n');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [{ role: 'user', content: META }],
    }),
  });
  if (!res.ok) throw new Error(res.status + ': ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  const raw = (data.content[0]?.text || '').trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('No JSON array found. Raw output:\n', raw);
    process.exit(1);
  }
  const bases = JSON.parse(match[0]);

  const outPath = 'scripts/bots/venusbot/seeds/characters.json';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(bases, null, 2));

  console.log(`✅ Saved ${bases.length} character bases to ${outPath}\n`);
  console.log('Preview:\n');
  bases.forEach((b, i) => {
    const words = b.split(/\s+/).length;
    console.log(`───── #${i + 1} (${words} words) ─────`);
    console.log(b.slice(0, 200) + (b.length > 200 ? '...' : ''));
    console.log();
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
