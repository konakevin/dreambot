/**
 * StarBot — shared prose blocks.
 *
 * Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien / 2001 /
 * Arrival / Annihilation / Foundation. Cosmic vistas + impossible alien
 * landscapes + epic space opera + sleek futurism + awe-inspiring scale.
 * VenusBot owns cyborg-woman territory — StarBot does NOT.
 */

const PROMPT_PREFIX =
  'cinematic sci-fi concept art, Blade Runner Dune Interstellar Alien 2001 aesthetic, epic scale, awe-inspiring cosmic beauty, movie-poster composition, production-art polish';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const SCI_FI_AWE_BLOCK = `━━━ SCI-FI AWE (NON-NEGOTIABLE) ━━━

Blade Runner / Dune / Interstellar / Alien / 2001 / Arrival / Annihilation / Foundation production value. Epic scale. Mind-bending composition. Concept-art-book / movie-frame quality. The kind of visual that makes you pause and whisper "woah."`;

const NO_COZY_EXCEPT_COZY_PATH_BLOCK = `━━━ NO COZY (except cozy-sci-fi-interior path) ━━━

All paths except cozy-sci-fi-interior render as awe + drama + epic scale + cinematic-scifi. Never warm-cozy, never sanrio-cute, never Sanrio-pastel. Dune-austere / Blade-Runner-cold / Interstellar-sublime.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ NO NAMED CHARACTERS / SHIPS / IP ━━━

Never named: no "R2-D2", no "Millennium Falcon", no "Enterprise", no "Rick Deckard", no "Paul Atreides". Our own unnamed robots, ships, worlds. Generic archetypes only.`;

const NO_CYBORG_WOMEN_BLOCK = `━━━ NO CYBORG WOMEN (VenusBot territory) ━━━

Never render the "sexy cyborg woman" archetype — that's VenusBot. Our robots are: massive mechs, industrial drones, humanoid androids (gender-neutral or non-gendered), bio-mechanical creatures, rusted workhorses, sleek companion drones. Robotic form can be humanoid but not female-sexualized.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — SCI-FI EDITION ━━━

Movie-poster / concept-art-book quality. The frame-worthy shots that define a sci-fi epic — Dune's ornithopter, Interstellar's black-hole, Blade Runner's Spinner over L.A., 2001's Jupiter-and-beyond. Compose EVERY render like it's the key art for a movie.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — SCI-FI AMPLIFICATION ━━━

Sci-fi is the canvas, not the ceiling. Stack: cosmic scale + multiple atmospheric layers + cinematic lighting + impossible geometry + nebula/atmosphere glow + architectural-tech detail + visible FX response. Blade Runner × Interstellar × Annihilation × 10. Frame-worthy poster art every render.`;

const SOLO_ROBOT_BLOCK = `━━━ SOLO ROBOT (robot-moment path only) ━━━

Robot-moment renders one robot only. No robot-and-human pair, no robot-gang, no multi-bot scene. Single robot in a tranquil human-moment activity (meditating / reading / watching-sunrise / tinkering / gazing).`;

const REAL_ASTRONOMY_BLOCK = `━━━ REAL ASTRONOMY (real-space path only) ━━━

Photoreal NASA-Hubble / JWST astrophotography. REAL nebulae by name OK (Orion Nebula, Eagle Nebula, Horsehead, Carina, Crab). Real galaxies (Andromeda, Whirlpool, Pinwheel). Real planets (Saturn rings, Jupiter storm bands, Mars surface, Venus clouds). Use specific wavelength-color treatments (JWST infrared-orange-teal, Hubble visible-light blue-amber, false-color mapping). Astronomical facts encouraged. Dial the awe, not the fiction.`;

const COSMIC_CANVAS_BLOCK = `━━━ THE COSMOS IS ALIVE — THIS IS NON-NEGOTIABLE ━━━

Space is not empty — it PULSES, it BREATHES, it has TEXTURE:
- DEPTH ON DEPTH: foreground dust motes catching starlight, midground nebula pillars glowing from within, background galaxies receding into infinity — the eye travels FOREVER
- LIVING LIGHT: nebulae glow like organs, gas clouds curl like living creatures, starfields shimmer with depth — light bends, refracts, blooms through cosmic dust
- COLOR EVERYWHERE: every void has color — deep indigo bruising into violet, coal-ember red bleeding into amber, electric teal where stars are born — NEVER flat black
- OVERWHELMING SCALE: the viewer should feel VERTIGO at the size of the universe — structures that dwarf planets, distances that break comprehension, beauty that makes you feel small and awestruck
- TEXTURE IN THE VOID: cosmic dust catches light like underwater particles, nebula edges fray into wisps, stellar winds leave visible trails — space has GRAIN`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC COMPOSITION ━━━

Framing, lighting, and depth chosen for MOVIE-SHOT quality. Wide establishing vistas, tight character moments, dramatic low-angle hero shots, impossible aerial sweeps. Every frame could be a still from a Villeneuve or Kubrick sci-fi epic.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  SCI_FI_AWE_BLOCK,
  NO_COZY_EXCEPT_COZY_PATH_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  NO_CYBORG_WOMEN_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  SOLO_ROBOT_BLOCK,
  REAL_ASTRONOMY_BLOCK,
  COSMIC_CANVAS_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
};
