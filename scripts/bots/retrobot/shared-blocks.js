/**
 * RetroBot — shared prose blocks.
 *
 * Pure scene nostalgia, 1975-1995. No people. The viewer sees it and
 * instantly says "I grew up here." Warm film-grain textures, golden-hour
 * lighting, sensory details that trigger memory.
 */

const PROMPT_PREFIX =
  'nostalgic scene, warm film grain, 1970s 1980s 1990s retro aesthetic, no people, atmospheric detail, memory-triggering';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const NOSTALGIA_CORE_BLOCK = `━━━ NOSTALGIA CORE (NON-NEGOTIABLE) ━━━

Every render must trigger: "I remember this" + warm ache + instant time-travel. The viewer grew up with these objects, these textures, this light. It's not about accuracy — it's about the FEELING of being 8 years old in 1987. Sensory details matter: the hum of a CRT, the smell of carpet cleaner, the warmth of a lamp on wood paneling.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE — PURE SCENE ━━━

No human figures, no faces, no hands, no silhouettes. The scene is the subject — the viewer inserts themselves. Objects can imply recent human presence (a half-eaten popsicle, shoes by the door, a controller left on the carpet) but no one is visible.`;

const ERA_AUTHENTICITY_BLOCK = `━━━ ERA AUTHENTICITY (1975-1995) ━━━

Every object must be era-appropriate. No smartphones, no flat screens, no modern cars, no LED lights. CRT televisions, rotary/cordless phones, cassette tapes, VHS, vinyl records, wood paneling, shag carpet, neon signs, tube TVs. The technology and design language of the late 70s through mid 90s.`;

const SENSORY_DETAIL_BLOCK = `━━━ SENSORY TEXTURE ━━━

Render with TACTILE nostalgia: warm lamp glow on wood grain, dust motes in afternoon sun, condensation on a soda can, worn carpet patterns, faded wallpaper, sun-bleached curtains, sticky vinyl seats, chrome and formica. The viewer should FEEL the texture through the screen.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — NOSTALGIA AMPLIFICATION ━━━

Nostalgia is the canvas, not the ceiling. Stack era-authentic details: every shelf has period objects, every surface has the right texture, every light source is warm and analog. Layer atmospheric elements — dust motes, lens flare, golden hour glow, film grain. The scene should be so densely detailed that every corner triggers a different memory.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  NOSTALGIA_CORE_BLOCK,
  NO_PEOPLE_BLOCK,
  ERA_AUTHENTICITY_BLOCK,
  SENSORY_DETAIL_BLOCK,
  BLOW_IT_UP_BLOCK,
};
