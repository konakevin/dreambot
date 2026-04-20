#!/usr/bin/env node
/**
 * One-off: ask Sonnet to rewrite the VenusBot character DNA paragraph
 * with aggressive cyborg emphasis — forcing Flux to render clearly
 * mechanical body parts, not a woman with accents.
 */
const fs = require('fs');

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

const CURRENT_BASE = `Kevin's distilled frame: "If a sexy machine and a sexy sultry woman had a baby, and then made that baby a mysterious killer — that's what she looks like." She's a hybrid being — equal parts predatory machine and exotic human/alien beauty, raised into a cold mysterious assassin. You can't quite tell WHAT she is. She never looks like she's posing; she is eyeing you down, up to something. Sexy as fuck, dangerous as hell.`;

const META = `You are a senior prompt engineer writing a character paragraph that will be handed to Sonnet-then-Flux to render cyborg women images consistently.

PROBLEM: the current paragraph below produces renders that look like "beautiful women with chrome accents" instead of clearly-mechanical cyborgs. Flux keeps defaulting to model-catalog women in latex rather than half-machine beings. We need the character description to FORCE Flux's hand.

GOAL: rewrite this character paragraph so every render unmistakably reads as a CYBORG FIRST. Even a casual viewer should immediately see "that's a machine" — not "that's a woman who's into cyborg cosplay." The paragraph should:

1. Be 100-150 words — short, punchy, dense with specific mechanical body-part language
2. Require specific CLEARLY-ROBOT body parts that Flux can actually render: e.g. "exposed ball-socket shoulder joints with visible hydraulics," "chrome mechanical forearms and hands with no flesh, articulated servo fingers," "chrome segmented neck with visible actuators," "translucent acrylic torso panels revealing internal gear clusters and glowing power core," "chrome-plated legs from hip to ankle with visible hinge joints." Give 4-6 non-negotiable mechanical body-part specifics.
3. Keep SOME organic/feminine beauty — her face, some skin — but make it clear the ORGANIC parts are the MINORITY of her visible body. Lead with machine, organic second.
4. Keep the character's ENERGY — exotic, exquisite, cold, eyeing-you-down, never-posing, sexy-as-fuck-but-dangerous, "what is it?" quality.
5. Use VISUAL-PROMPT LANGUAGE that Flux responds to (specific materials, exposed seams, visible joints, translucent panels, glowing cores) — not abstract language like "mechanical structure blending seamlessly."
6. Preserve the human/alien ambiguity — she could be either.
7. NO bare nudity/nipples. If her chest is shown it's mechanical.

CURRENT PARAGRAPH (the one that's producing weak cyborg reads):
"${CURRENT_BASE}"

Rewrite it. Output ONLY the new paragraph — no preamble, no commentary, no quotes. 100-150 words, ready to drop in as the character DNA block.`;

(async () => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 600,
      messages: [{ role: 'user', content: META }],
    }),
  });
  if (!res.ok) throw new Error(res.status + ': ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  const out = (data.content[0]?.text || '').trim();
  console.log('\n═══ SONNET REWRITE ═══\n');
  console.log(out);
  console.log(`\n(${out.length} chars, ~${out.split(/\s+/).length} words)\n`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
