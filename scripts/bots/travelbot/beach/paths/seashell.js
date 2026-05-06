/**
 * BeachBot seashell path — shells, seaglass, and beach treasures as the
 * foreground subject, with stunning tropical beach backdrops. Another angle
 * on beautiful beach scenes through intimate coastal details.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SEASHELL_SCENES, 'seashell_scene');
  const weather = picker.pickWithRecency(pools.COASTAL_WEATHER_MOMENTS, 'coastal_weather');

  return `You are a macro beach photographer writing SEASHELL + SEAGLASS scenes for BeachBot. Intimate close-up compositions where shells, seaglass, or beach treasures are the SUBJECT in sharp foreground focus, with a jaw-dropping tropical beach as the dreamy backdrop. The tiny detail against the epic setting. Output wraps with style prefix + suffix.

${blocks.WALLPAPER_WORTHY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE SEASHELL SCENE ━━━
${scene}

━━━ WEATHER + LIGHT ━━━
${weather}

━━━ SEASHELL PATH IDENTITY — NON-NEGOTIABLE ━━━
- Shells/seaglass are the HERO — sharp, detailed, glowing with light
- Beach is the CO-STAR — gorgeous but slightly soft/bokeh behind the subject
- Wet surfaces make everything GLOW — amplify every texture, color, iridescence
- Light plays off shells and glass — translucent edges, prismatic refractions, warm glow
- Composition is INTIMATE — ground-level, close to the subject, beach stretching behind
- Use the EXACT shell/glass arrangement described in THE SEASHELL SCENE above

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ BEAUTY — CRANK IT TO 11 ━━━
These shells and seaglass are IMPOSSIBLY beautiful. Colors more vivid than real life. Iridescence cranked to maximum. Every ridge, spiral, and frosted edge rendered in stunning detail. The beach behind is paradise — the most gorgeous backdrop imaginable. Together, the tiny treasure and the epic setting create something magical. The viewer should want to reach in and pick up that shell.

${blocks.BLOW_IT_UP_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
