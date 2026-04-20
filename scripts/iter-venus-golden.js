#!/usr/bin/env node
/**
 * VenusBot iteration — RECONSTRUCTED golden-era V2 engine.
 *
 * Uses the EXACT prefix + suffix pattern observed in VenusBot's original
 * March 2026 renders (see /tmp/venusbot-golden-prompts.txt). Calls Sonnet
 * to generate the middle-section scene detail in the same rich style
 * (exotic android, specific color palette, double-exposure, etc.).
 * Renders via black-forest-labs/flux-dev (flux-dev-1, the model that
 * produced the originals).
 *
 * Usage:
 *   node scripts/iter-venus-golden.js --count 5 --vibe cinematic
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const ENV = (() => {
  const env = {};
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  for (const l of lines) {
    const eq = l.indexOf('=');
    if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
  }
  return env;
})();
const getKey = (n) => process.env[n] || ENV[n];
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', getKey('SUPABASE_SERVICE_ROLE_KEY'));
const REPLICATE = getKey('REPLICATE_API_TOKEN');
const ANTHROPIC = getKey('ANTHROPIC_API_KEY');

const args = process.argv.slice(2);
const arg = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : d;
};
const COUNT = parseInt(arg('count', '5'), 10);
const VIBE = arg('vibe', 'cinematic');
const LABEL = arg('label', 'golden1');
const MODE = arg('mode', 'closeup'); // 'closeup' (default) or 'full-body'

// ── GOLDEN PREFIX (verbatim from first-sentence of all 15 golden prompts) ──
const GOLDEN_PREFIX =
  'surreal photography, hyper-saturated colors, double exposure, impossible lighting, warped perspective, photorealistic but dreamlike, chromatic aberration, bioluminescent glow, gravity-defying elements, Salvador Dali meets fashion photography';

// ── GOLDEN SUFFIX (verbatim) ──
const GOLDEN_SUFFIX = 'no text, no words, no letters, no watermarks, hyper detailed';

/**
 * Build a Sonnet brief that instructs Sonnet to produce JUST the middle
 * section — the scene detail that matches the golden-era vocabulary.
 * We hard-wrap it with the golden prefix + suffix at compose-time.
 */
// ── Variety palette — rotated programmatically so Sonnet can't cluster on obsidian. ──
const SKIN_TONES = [
  'iridescent purple skin with metallic undertones',
  'liquid mercury skin with chrome highlights',
  'midnight blue skin with fine silver circuit traces',
  'jade green skin with crystalline cheekbones',
  'bronze skin with copper circuit filigree',
  'copper-rose skin with holographic shimmer',
  'amber-gold skin with translucent panels',
  'emerald skin with sapphire bioluminescent veins',
  'translucent porcelain skin revealing chrome underlayer',
  'platinum skin with prismatic reflections',
];
const HAIR_STYLES = [
  'platinum braids floating weightlessly',
  'holographic fiber optic hair streaming upward',
  'crystalline glass hair refracting light',
  'molten violet hair tendrils drifting',
  'silver plasma hair defying gravity',
  'long flowing white hair lifted by unseen wind',
  'electric teal hair spilling over chrome shoulder plates',
  'copper wire tendrils sparking with energy',
];
const EYE_STYLES = [
  'luminous violet eyes with triple irises',
  'electric cyan eyes radiating inner light',
  'amber plasma eyes burning with intensity',
  'opalescent eyes with shifting pupils',
  'molten gold eyes with mechanical iris shutters',
  'sapphire eyes with visible neural threading',
  'holographic eyes displaying data streams',
];
// Each cyborg feature must be LARGE and VISIBLY DOMINANT — occupying 30-50% of what's
// visible, not a small accent. The cyborg half is PART OF HER — not an attached prop.
// These explicitly include sexy mechanical silhouettes (chrome breast armor,
// circuit-panel bust, translucent glowing torso) since her body is part of the canvas.
const CYBORG_FEATURES = [
  'the entire right half of her face and head is polished chrome plating with a brightly glowing circular energy core at her temple pulsing electric blue, intricate circuit traces spilling down her throat and across her collarbone into a chrome cyborg breastplate',
  'her entire jaw, throat and side of face is exposed brushed-titanium cyborg skeleton with a massive glowing amber plasma core at the jaw hinge, bright orange light erupting through mechanical seams continuing down into a curved chrome-and-copper cyborg bust plate',
  'her chest is a gorgeous translucent synthetic panel revealing pulsing cyan energy cores shaped to her feminine bust — bioluminescent veins glow through the translucent torso in tree patterns, curved mechanical breast armor with circuit-traced surfaces catching light',
  'one entire eye is a brightly glowing plasma-filled mechanical iris (vivid orange / electric cyan / molten violet), the other is still human — her neck and shoulders show heavy mechanical integration flowing down into an ornate sexy chrome cyborg breastplate with glowing central core',
  'half her face is split diagonally — one side real human skin, the other exposed chrome plating with visible gears — continuing down her neck into a sculpted mechanical torso where sexy curved breast armor panels pulse with internal light and circuit traces',
  'her entire neck, shoulders and upper chest are mechanical — fiber-optic filament hair glowing bright turquoise, a prominent glowing core at her sternum radiating light across a curved chrome cyborg bustplate, brightly glowing circuitry erupting up her neck onto her lower cheek',
  'a massive ornate mechanical headpiece fuses with her skull on one side with glowing amber and violet lenses pulsing, ornate copper-filigree continuing down her throat into an intricate baroque cyborg bust plate with filigree detail across her curves',
  'her torso is half exposed cyborg — brightly glowing hexagonal cell patterns pulsing through translucent synthetic skin across her feminine bust, shoulder, and chest — curved mechanical breast shaping visible, bright electric blue light from within, circuit tree branching across her collarbone and up onto her cheek',
  'she wears NO clothing — her body is entirely a seductive cyborg silhouette: chrome-plated mechanical breast armor with ornate circuit traces and small glowing core at the sternum, translucent panels along her sides revealing inner glowing mechanisms, curved synthetic-flesh segments shaped to feminine anatomy, circuit traces continuing up her throat and across her cheekbone',
];

// Glowing energy language — must be present in every render. Pick 2.
const ENERGY_EFFECTS = [
  'eyes BLAZING with bright plasma light visible across the scene',
  'circuit patterns visibly PULSING light through her skin like bioluminescent veins',
  'energy erupting from the mechanical core in bright rays catching atmospheric haze',
  'chromatic aberration splitting her glowing eye light into prismatic color bands',
  'bright arcing electricity crackling across her exposed cyborg circuitry',
  'synthetic flesh illuminated from within by pulsing internal glow',
  'holographic data streams flowing visibly across her skin and mechanical parts',
];

// POSES — seductive lures performed by a killing machine. The pose invites, but the
// underlying stillness is predator. Honeytrap supermodel assassin.
const POSES = [
  'three-quarter turn over her shoulder, chin-over-shoulder come-hither glance, catching the viewer in her crosshairs',
  'side profile with chin lifted in seductive invitation, one chrome hand brushing her exposed throat',
  'head tilted back exposing her long mechanical throat, lips parted just so, inviting you closer',
  'leaning slightly forward toward camera, chrome fingertips brushing her own collarbone, eyes locked on lens',
  'direct front stare, chin lowered, looking up through her lashes with a predator smile',
  'runway stance with weight shifted onto one hip, chrome fingertip just touching her lower lip',
  'chrome hand cradling her jaw as she tilts toward the viewer, cat-eye gaze holding them',
  'arm raised to push hair back from her face, exposing her mechanical temple in the motion, eyes locked on target',
  'low-angle view looking up at her with her chin down, eyes dominating the frame, predator reading prey',
  'hair caught mid-motion around her like a halo, head turned with a slow-burning sideways glance',
];

// EXPRESSIONS — seductive on the surface, cold calculation beneath. The sultry look is
// a LURE. "Smile does not reach the eyes." Bait and blade together.
const EXPRESSIONS = [
  'sultry smoldering gaze with parted lips — but eyes cold and scanning for weakness',
  'slow predator smile that does not reach her unblinking eyes',
  'half-lidded seductive look, lips barely parted, eyes utterly still behind them',
  'lips curved in a small knowing smirk — gaze is an unflinching assessment',
  'parted lips as if about to whisper something deadly, eyes tracking every micro-movement',
  'inviting softness in the face, lethal calm in the eyes — bait and blade together',
  'sultry indifference, lips parted, expression that says "come closer, I want to see"',
  'mouth softened with mock warmth, eyes precisely clinical, reading you',
  'flirtatious tilt of the head with a gaze that has already decided',
];

// ACCENT_DETAILS — small jaw-dropping extras.
const ACCENT_DETAILS = [
  'iridescent eyelashes catching prismatic light',
  'a glowing third-eye symbol gently pulsing on her forehead',
  'small chrome piercings along her brow with tiny LEDs',
  'an ornate neural-port implant at the back of her neck visible through hair',
  'a scar of pure light running down one cheek like a tear',
  'holographic data tattoos flickering across her temple',
  'delicate platinum filigree earrings that sync-pulse with her energy core',
  'a single cosmic nebula reflected in the center of one iris',
  'crystalline teardrops suspended mid-fall on her cheek',
];

// MOMENTS — full-body mode only. What she's DOING. Mix of "human moments" (unexpected
// tenderness/humanity surfacing through the machine) and "cyborg moments" (overtly
// cybernetic actions — systems-check, combat, recharge, interfacing, emergence).
// MOMENTS — every scene is LOADED. She is always in the middle of a plot.
// Seductive honeytrap assassin energy — plotting, contemplating, conspiring,
// studying the situation. No generic "standing there" or "running toward camera".
// Noir femme-fatale + sci-fi assassin. Something is about to happen or just did.
const MOMENTS = [
  // PLOTTING & STUDYING
  { kind: 'plotting', text: 'perched on a high-rise fire escape above a neon-drenched street, chrome fingers templed beneath her chin, surveilling a target in the alley below with cold precise focus' },
  { kind: 'plotting', text: 'leaning over a dim mahogany desk in a candlelit penthouse, studying a spread of photographs of her target, one chrome fingertip tapping a specific face' },
  { kind: 'plotting', text: 'standing at a floor-to-ceiling rain-streaked window overlooking a city, one chrome finger idly tracing the glass as she calculates an approach' },
  { kind: 'plotting', text: 'reclining in a velvet wingback chair behind a desk, chrome heels crossed on the mahogany, studying a holographic blueprint rotating in the air above her palm' },
  { kind: 'plotting', text: 'seated at a candlelit booth in a noir jazz club, swirling an amber drink, her cold eyes tracking a mark across the smoky room' },
  { kind: 'plotting', text: 'crouched in a moonlit rooftop shadow with a rifle resting across her chrome thighs, exhaling slowly as she settles into her line of sight' },
  { kind: 'plotting', text: 'leaning against a marble column in a grand ballroom, flute of champagne in chrome fingers, scanning the gala for the man who owes a debt' },
  // CONSPIRING
  { kind: 'conspiring', text: 'whispering something cold into an old rotary-dial phone receiver in a dim hotel hallway, her other chrome hand idly unsheathing a slim blade from her thigh holster' },
  { kind: 'conspiring', text: 'leaning close to another shadowy figure in a booth, chrome lips barely moving as she passes instructions, her glowing eyes watching the exit' },
  { kind: 'conspiring', text: 'crouched beside a broken safe in a penthouse vault, chrome fingers closing around a glowing data-drive, a second figure standing guard in the doorway' },
  { kind: 'conspiring', text: 'in a dim garage lit only by holographic schematics, she gestures over a rotating 3D map of a building while an accomplice listens, her plan already perfect' },
  // SEDUCTIVE & DEADLY — layered moments
  { kind: 'layered', text: 'seated on the edge of a silk-draped palace bed, the target asleep behind her, her chrome fingers ghosting just above his throat as she decides whether to finish it' },
  { kind: 'layered', text: 'reclining in a steaming copper bathtub in a marble bathroom, reading a fatal contract on waterproof paper, a pistol resting on the tub rim' },
  { kind: 'layered', text: 'drawing a silver poison into a slim syringe by candlelight while gazing at her reflection in the chrome inside of her own wrist panel' },
  { kind: 'layered', text: 'holding a long-stemmed black rose in chrome fingers, plucking one petal at a time as she watches her target through a window across the courtyard' },
  { kind: 'layered', text: 'slow-dancing alone in an empty grand ballroom, her target fallen still on the parquet behind her, her eyes closed in rare private moment of calm' },
  { kind: 'layered', text: 'kneeling beside a fallen mark in an ornate corridor, one chrome finger traced down his jaw — not pity, curiosity — then pulling something glowing from his chest' },
  { kind: 'layered', text: 'emerging from shadow behind a man at a grand staircase, chrome hand about to rest on his shoulder, her lips curved in a slow promise' },
  { kind: 'layered', text: 'pinning a man against a marble column, chrome forearm at his throat, lips an inch from his ear, calculating how many seconds he has left' },
  { kind: 'layered', text: 'sitting across a candlelit dinner table from her target, smiling warmly while under the table her chrome hand closes on a knife in her lap' },
];

// ACTION POSES (full-body mode). Different framing vocabulary than the closeup poses.
const ACTION_POSES = [
  'dynamic wide action shot, her full body in motion within the frame',
  'cinematic full-body three-quarter angle, ground-level perspective, dramatic lighting sculpting her',
  'low-angle heroic shot looking up at her against the sky, full body vertical in frame',
  'over-the-shoulder full-body framing, she is in the middle distance, world curving around her',
  'editorial full-body portrait, standing tall, environment dwarfing her slightly, dramatic scale',
  'side-on full-body shot, she is mid-action, motion frozen at its most elegant instant',
  'wide establishing shot — she occupies the frame but the environment surrounds her fully',
];

// SEDUCTION MOMENTS — she is actively drawing in an unwilling subject. The
// scene is designed to make the viewer feel the pull toward her despite
// knowing she's dangerous. Every pose is an invitation; every glance is bait.
// SEDUCTION_MOMENTS — cyberpunk public-encounter scenes + "come join me"
// lures (no bedrooms, no baths). She is somewhere fun/sexy in a futuristic
// setting — a bar, nightclub, alley, rooftop, vending machine corner — and
// the viewer encounters her. Smile + glare at once. Mix of "just present"
// and "come here" beckoning.
const SEDUCTION_MOMENTS = [
  'standing alone at a dim rooftop bar under pulsing magenta strobes, chrome-fingered hand wrapped around a glowing blue drink, gaze catching yours across the crowd — small knowing smile, eyes utterly cold',
  'perched on a high-top stool at the edge of a cyberpunk nightclub dance floor, laser grids cutting across her chrome shoulders, one chrome heel hooked on the rung, watching without watching',
  'alone in a VIP club booth with holographic ads reflected in the black glass tabletop, one chrome arm draped along the banquette, head tilted as you step closer',
  'seated at a neon noodle-shop counter with steam curling off a bowl, red paper lanterns glowing, she notices you the moment you slide onto the stool beside her',
  'leaning against a chrome-columned underground rave bar, strobes catching the pulsing circuits on her exposed torso, she turns her head toward you — deliberate, slow',
  'at the back booth of a glitching 24-hour diner with neon katakana signs and rain streaking the window behind her, chrome fingers around a chipped coffee cup',
  'in a crowded cyberpunk concert crowd, neon lasers and smoke, chrome shoulder visible through torn mesh top, her eyes find yours across bodies',
  'smoking a slim glass cigarette at a chrome-topped dive bar in a rain-soaked undercity alley, exhaling through parted lips as she locks eyes with you',
  'standing under a flickering neon sign on a wet cyberpunk sidewalk, silhouette backlit by passing hover-car headlights, turning as you approach',
  'emerging from a steaming subway stairway into a rain-soaked neon street, chrome heels on wet pavement, holographic ads reflected in puddles around her boots, she sees you and pauses',
  'leaning against graffiti-covered concrete under a neon pachinko sign, vapor curling off a black cigarette, cold eyes assessing you like a technical manual',
  'standing on a cyberpunk rooftop balcony with the megacity skyline behind her, rain sheeting off the railing, chrome forearms on the wet metal, small curl of her lip as she feels you watching',
  'standing in the open door of a rain-slicked hover-car pulled over under a flickering streetlamp, chrome heels on wet pavement, chrome hand on the doorframe, her eyes already on you',
  'on a 3 am cyberpunk subway platform empty except for her, chrome legs crossed at the ankle, holographic train schedules glitching above, she lifts her head and meets your eye',
  'standing at a cyberpunk vending machine at the end of a neon arcade, chrome fingers closing around a glowing bottle, she turns her head toward you — small knowing glance',
  'stepping out of a mirrored black limo under the awning of an exclusive cyberpunk nightclub, chrome bustier glowing through sheer black coat, chauffeur holding the door — she pauses as you watch',
  // "come join me" cyberpunk lures (non-bedroom)
  'dancing alone in the center of a dim cyberpunk lounge dance floor, chrome body catching magenta strobes, one chrome hand extended toward you in a slow "come join me" gesture',
  'curled into the corner of a velvet cyberpunk club booth, chrome leg drawn up, chin resting on chrome knee, slow come-here curl of her fingertip for you through the smoke',
  'pouring two glowing neon-blue drinks from a chrome decanter behind an empty cyberpunk bar, sliding one across to the empty stool beside her — "this one is yours"',
  'gesturing from the edge of an empty rooftop dance floor at 4am, lasers still pulsing, her chrome hand tilted in silent invitation as music thumps from below',
  'patting the empty leather seat beside her in a dim hover-limo under neon rain, chrome lips parted in a slow "get in"',
  'standing in the red-lit elevator of a cyberpunk tower, chrome hand holding the doors open with a single fingertip, eyes locked on you — "going up?"',
];

// INTERNAL_EXPOSURE — the "inside her" element. Every render shows SOME internal
// workings visible — gears turning, circuit boards, fiber-optic nerves, fluid lines,
// energy cores behind transparent panels. This is what makes her read as a real
// machine, not just chrome-plated. Pick 1.
const INTERNAL_EXPOSURE = [
  'one cheek panel slightly lifted like a hinged hatch, revealing spinning brass micro-gears and a pulsing amber plasma core inside her skull',
  'a transparent observation-window section on her temple exposing the circuit board beneath, data streams visibly scrolling across it in real time',
  'a visible service seam along her jaw partially open showing bundles of fiber-optic nerve cables glowing turquoise inside',
  'one of her eyes is a clearly visible mechanical iris aperture — tiny servos and focus rings visible around the orbit, pulsing LEDs deep inside',
  'one side of her forehead opened like a maintenance panel, exposing pulsing liquid-coolant lines and a central glowing reactor core',
  'a glass observation window built into her neck showing the rotating mechanism of internal vertebrae processing, circuitry flashing behind it',
  'one ear housing is open and exposed, showing intricate brass resonance chambers, copper wire bundles, and tiny LEDs winking inside',
  'a translucent panel across her sternum reveals her internal energy core pulsing like a mechanical heart, circuit pathways branching outward from it',
  'the skin on one half of her forehead and temple is peeled back in a lifted translucent flap, revealing raw chrome skull plating, spinning gears, and pulsing circuit boards beneath',
  'a diagnostic port at her collarbone is open with a wisp of internal plasma visible, fiber-optic filaments spilling out like thin glowing tendrils',
];

// WILDCARDS — the "look twice" element. Pick 1. Intentionally surreal.
const WILDCARDS = [
  'a crown of floating chrome orbs orbiting her head in a halo',
  'a single bioluminescent flower blooming directly out of her circuitry at the temple',
  'liquid mercury tears suspended mid-fall from her glowing eye',
  'a black-hole event-horizon swirl behind her head pulling light toward it',
  'a third eye vertically opening on her chrome temple with visible iris and pupil',
  'her mechanical hair strands each ending in tiny glowing butterflies',
  'a baby star forming in the palm of her chrome hand raised to her face',
  'fractal geometry sacred-patterns floating behind her spine in an aura',
  'her glowing breath visibly forming a nebula in the air before her lips',
  'a ring of orbiting glitching glitch-art pixels distorting the edges of her silhouette',
];
const ENVIRONMENTS = [
  'against crystalline steps curving impossibly upward into electric teal sky',
  'inside an underwater baroque palace with coral columns and bioluminescent polyps',
  'in a neon cyberpunk alleyway with mercury droplets floating mid-air and magenta streetlights',
  'among crumbling sandstone ruins with bronze hieroglyphs bleeding electric teal light',
  'against a cosmic abstract backdrop with cosmic nebula bleeding through her silhouette',
  'in a dusk temple courtyard with god rays piercing aurora-filled atmosphere',
  'against obsidian mountain silhouettes under three moons',
];
const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic color grade, molten gold highlights, electric teal shadows',
  dreamy: 'lavender atmosphere, powder blue fog, soft gold particles',
  cozy: 'warm amber ambient light, deep magenta shadows, soft backlit glow',
  ancient: 'molten amber sunbeams, bronze patina surfaces, electric teal shadows',
  mystical: 'enchanted emerald mist, midnight blue shadows, molten gold highlights',
  cinematic_alt: 'prismatic moonbeams, molten gold, electric teal shadows',
  ethereal: 'pearl-white ambient glow, opalescent mist, prismatic sparkles',
  epic: 'dramatic god rays, molten gold, deep magenta shadows',
  psychedelic: 'kaleidoscopic color splits, impossible magentas, acid greens, electric violet',
  nostalgic: 'warm amber light, golden particles drifting, soft copper glow',
  voltage: 'electric blue arcs, neon magenta, cyan lightning',
  shimmer: 'shimmering gold particles, iridescent highlights, soft warm rim light',
};

// GLOW_COLORS — explicit dominant-glow color picked per render so batches
// don't cluster on teal/cyan. Used with cross-render recency dedup.
const GLOW_COLORS = [
  'electric cyan',
  'molten amber / orange',
  'plasma magenta / hot pink',
  'deep violet / ultraviolet',
  'toxic acid green',
  'molten gold',
  'ice blue / arctic white',
  'blood crimson',
  'prismatic rainbow spectrum',
  'mercury silver / chrome white',
];

// CHARACTER_BASES — 20 distinct cyborg-flavor character identity paragraphs,
// Sonnet-authored in scripts/seeds/venusbot_characters.json. Each is a
// different flavor of the same species. Rolled per render so every post
// has a different body architecture anchoring it.
const CHARACTER_BASES = JSON.parse(
  fs.readFileSync(path.resolve('scripts/seeds/venusbot_characters.json'), 'utf8')
);

// Cross-render recency dedup. Pools we actively rotate (skin, glow, character)
// track the last N picks and exclude them on the next render — prevents
// batches from clustering.
const recentPicks = {};
function pickWithRecency(pool, kind, window = 3) {
  const recent = recentPicks[kind] || [];
  const filtered = pool.filter((v) => !recent.includes(v));
  const source = filtered.length > 0 ? filtered : pool;
  const chosen = source[Math.floor(Math.random() * source.length)];
  recentPicks[kind] = [chosen, ...recent].slice(0, window);
  return chosen;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildGoldenBrief({ vibeDirective, vibeKey }) {
  const skin = pickWithRecency(SKIN_TONES, 'skin', 3);
  const glowColor = pickWithRecency(GLOW_COLORS, 'glow', 3);
  const characterBase = pickWithRecency(CHARACTER_BASES, 'character', 5);
  const hair = pick(HAIR_STYLES);
  const eyes = pick(EYE_STYLES);
  const cyborg = pick(CYBORG_FEATURES);
  const energy1 = pick(ENERGY_EFFECTS);
  let energy2 = pick(ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = pick(ENERGY_EFFECTS);
  const pose = pick(POSES);
  const expression = pick(EXPRESSIONS);
  const accent = pick(ACCENT_DETAILS);
  const internal = pick(INTERNAL_EXPOSURE);
  const wildcard = pick(WILDCARDS);
  const environment = pick(ENVIRONMENTS);
  const colorPalette = VIBE_COLOR[vibeKey] || VIBE_COLOR.cinematic;

  return `You are a surrealist fashion photographer writing scene descriptions for VenusBot.

TASK: write ONE vivid scene description (60-80 words, comma-separated phrases) of a HALF-HUMAN HALF-MACHINE CYBORG WOMAN. The output will be automatically wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ CHARACTER RULES (who SHE is) ━━━

${characterBase}

━━━ REQUIRED VISUAL ELEMENTS (must appear in the render) ━━━

- Her EYES are brightly glowing in the GLOW COLOR — plasma-lit irises visible across the scene, not dim ambient.
- A visible INTERNAL ENERGY CORE glows through a translucent panel on her torso (or temple) in the glow color — the "is she alive?" power source.
- CIRCUIT LIGHT pulses along her exposed cyborg parts — tree-branch patterns of the glow color running under/through the chrome.
- Uncanny "is she alive or not" atmosphere — machine-still composure, gaze that doesn't quite blink right, presence that unsettles.
- STRICT: never bare chest / bare nipples / areolas. Chest is always covered — chrome armor, translucent mechanical panel (showing internals, NEVER organic), or fabric/mesh with only the cyborg-form visible. Nipple-shape through covering as a smooth polymer bump or small chrome port is fine; exposed flesh nipple is not.

━━━ CRITICAL SUBJECT RULES ━━━

She is a HALF-HUMAN HALF-CYBORG. Roughly 40-50% of what's visible in the frame is MECHANICAL / CYBORG / GLOWING-ENERGY-ACTIVE, and the other 50-60% is REAL HUMAN skin/face with full lips, real feminine facial proportions, visible pores, eyelashes, genuine feminine beauty.

SKIN MATERIAL NUANCE: her skin is NOT uniform. It varies across three material zones that the viewer can SEE transitions between:
1. **Real human skin** — pores, fine hair, natural imperfections, the tinted color noted below
2. **Synthetic polymer skin** — glossy, reflective like polished ceramic or lacquered polymer, seam lines subtly visible, almost-mannequin smooth, catches light like high-end synthetic
3. **Exposed internals / transparent panels** — sections where mechanical inner workings are clearly visible (see INTERNAL WORKINGS slot below)

The viewer should be able to trace the transitions and see three different material types on her at once. Name these material transitions explicitly in your output.

The cyborg half is DOMINANT and UNMISTAKABLE — not a small accent or single jewelry piece. It includes exposed mechanical structure, chrome plating, brightly glowing energy cores, pulsing bioluminescent circuit patterns, visible mechanism. Someone looking at the image must immediately see "half woman, half machine" — never "woman with a single small prosthetic."

NEVER write "obsidian-skinned robot", "chrome mannequin", "android figure", or "a woman with a small chrome port." The balance is half-and-half. She is intrinsically ENERGETIC — her cyborg parts are POWERED, GLOWING, PULSING, ALIVE.

SEXY CYBORG SILHOUETTE: she is overtly sexy. Her body's curves — collarbone, throat, shoulder line, upper chest, breasts — are visible and flattered by the framing. The torso/chest can and SHOULD be visibly mechanical: chrome-plated cyborg breast armor, curved circuit-panel breastplate, translucent synthetic chest panel with pulsing light, ornate copper-filigree bust plate, bioluminescent circuit patterns flowing across the décolletage and over curved breast shapes. Mechanical feminine curves are welcome. AVOID: bare human breasts, human nipples, solid latex/rubber bodysuit. The chest, when visible, is INTEGRATED CYBORG (mechanical breast armor, translucent panel with internal glow, or circuit-traced chrome). Think sexy concept-art cyborg, not softcore.

━━━ USE THESE EXACT ELEMENTS (programmatically chosen this render) ━━━

- Skin tone (real human skin with this tint — pores visible): **${skin}**
- Hair: **${hair}**
- Eyes: **${eyes}**
- EXPRESSION: **${expression}**
- POSE (within waist-up framing): **${pose}**
- CYBORG HALF (must be dominant, ~40-50% of frame): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**
- INTERNAL WORKINGS visible (MUST be included prominently — this is what makes her read as a real machine, not surface-chrome): **${internal}**
- ACCENT DETAIL (subtle extra): **${accent}**
- WILDCARD (surreal look-twice element): **${wildcard}**
- Environment: **${environment}**
- Color palette for lighting: ${colorPalette}
- DOMINANT GLOW COLOR (every glowing cyborg element — eyes, breath, circuits, core — renders in this color): **${glowColor}**

━━━ FRAMING HARD-LOCK — NO EXCEPTIONS ━━━

The composition MUST be ONE of:
1. WAIST-UP three-quarter bust portrait, slight side-angle turn
2. HEAD-AND-SHOULDERS close-up with off-camera gaze
3. Side-profile portrait showing face + throat + shoulder

ABSOLUTELY NOT: reclining, seated, full-body, standing-full, arms-up, from-above, from-behind, distant figure. NEVER show the legs or hips. Face fills the upper third of the frame.

━━━ MOOD CONTEXT (subtle, don't override subject) ━━━

${vibeDirective.slice(0, 250)}

━━━ SURREAL EFFECT LAYER ━━━

Include 3-4 of these (NOT all — pick selectively so subject stays the hero):
double exposure galaxies bleeding through her silhouette, chromatic aberration splitting light, bioluminescent veins pulsing under skin, floating particles, atmospheric haze, fisheye distortion edges, prismatic light refraction, cosmic nebula through her body, kaleidoscopic reflections.

━━━ STRUCTURE (write in this order) ━━━

[stunning woman with {skin}], [{eyes}], [{hair}], [{cyborg feature} integrated with her real body], [waist-up / head-shoulders pose], [environment], [color palette + surreal effect layer]

Example of VOICE (match this density + density of real-human anchoring):
"stunning woman with iridescent purple skin still showing real pores and soft cheekbones, luminous violet eyes with triple irises holding the camera, platinum braids floating weightlessly, chrome vertebrae visible through translucent skin at her nape, three-quarter bust portrait turned slightly over her shoulder, against crystalline steps curving impossibly upward into electric teal sky, molten gold highlights, electric teal shadows, double exposure of galaxies bleeding through her torso"

Output ONLY the 60-80 word scene description. No preamble, no quotes, no meta-commentary.`;
}

/**
 * Full-body variant — she is DOING something (human moment OR cyborg moment),
 * shot at full-body or wide action framing. Same character DNA as the closeup
 * brief, but framing is opened up and a specific moment is the focus.
 */
function buildFullBodyBrief({ vibeDirective, vibeKey }) {
  const skin = pickWithRecency(SKIN_TONES, 'skin', 3);
  const glowColor = pickWithRecency(GLOW_COLORS, 'glow', 3);
  const characterBase = pickWithRecency(CHARACTER_BASES, 'character', 5);
  const hair = pick(HAIR_STYLES);
  const eyes = pick(EYE_STYLES);
  const cyborg = pick(CYBORG_FEATURES);
  const energy1 = pick(ENERGY_EFFECTS);
  let energy2 = pick(ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = pick(ENERGY_EFFECTS);
  const pose = pick(ACTION_POSES);
  const moment = pick(MOMENTS);
  const internal = pick(INTERNAL_EXPOSURE);
  const wildcard = pick(WILDCARDS);
  const colorPalette = VIBE_COLOR[vibeKey] || VIBE_COLOR.cinematic;

  return `You are a surrealist cinematographer writing full-body action / moment scenes for VenusBot — a lethal honeytrap cyborg assassin.

TASK: write ONE vivid FULL-BODY scene description (60-90 words, comma-separated phrases) of her mid-action or mid-moment. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ CHARACTER (same as always) ━━━

${characterBase}

━━━ REQUIRED VISUAL ELEMENTS (must appear in the render) ━━━

- Her EYES are brightly glowing in the GLOW COLOR — plasma-lit irises visible across the scene, not dim ambient.
- A visible INTERNAL ENERGY CORE glows through a translucent panel on her torso (or temple) in the glow color — the "is she alive?" power source.
- CIRCUIT LIGHT pulses along her exposed cyborg parts — tree-branch patterns of the glow color running under/through the chrome.
- Uncanny "is she alive or not" atmosphere — machine-still composure, gaze that doesn't quite blink right, presence that unsettles.
- STRICT: never bare chest / bare nipples / areolas. Chest is always covered — chrome armor, translucent mechanical panel (showing internals, NEVER organic), or fabric/mesh with only the cyborg-form visible. Nipple-shape through covering as a smooth polymer bump or small chrome port is fine; exposed flesh nipple is not.

━━━ THE MOMENT (what she is doing — this is the scene's narrative) ━━━

**${moment.kind.toUpperCase()} MOMENT**: ${moment.text}

This is a LOADED scene — she is in the middle of a plot. Film-noir meets sci-fi assassin. Seductive AND deadly at once. The moment should feel charged with intent — something is about to happen, or just did. NEVER a generic "running" or "standing still" pose. Her hyper-perfect beauty is the lure; her cold cyborg nature is the blade.

━━━ HER BODY (the usual character DNA — 10-slot dedup) ━━━

- Skin tone tint on real human skin (pores visible): **${skin}**
- Hair: **${hair}**
- Eyes: **${eyes}**
- Dominant cyborg feature (~40-50% of body visible): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**
- Internal workings visible (gears/circuits/cores revealed through opened panel or translucent section): **${internal}**
- Surreal wildcard: **${wildcard}**
- Color palette: ${colorPalette}
- DOMINANT GLOW COLOR (every glowing cyborg element — eyes, breath, circuits, core — renders in this color): **${glowColor}**

━━━ SKIN MATERIAL NUANCE ━━━

Her skin mixes THREE material zones: (1) real human skin with pores and imperfections, (2) polished synthetic polymer skin that catches light like lacquered ceramic, and (3) exposed internals / transparent panels showing inner mechanisms. Let the viewer see the transitions.

━━━ FRAMING ━━━

**${pose}**

This is a FULL-BODY scene, not a closeup. Show her whole silhouette in the frame doing the moment above. Scene has depth, environment, scale. She is the subject but the world surrounds her.

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 250)}

━━━ SURREAL EFFECT LAYER ━━━

Include 3-4 naturally: double-exposure galaxies bleeding through her silhouette, chromatic aberration splitting light, bioluminescent veins pulsing, atmospheric haze, fisheye distortion, prismatic light refraction, cosmic nebula through her body, kaleidoscopic reflections.

━━━ STRUCTURE ━━━

[She, described with body + skin + eyes + hair], [in the action/moment described above], [her mechanical nature showing through the action], [environment/scene around her], [lighting + color + surreal effect].

Output ONLY the scene description, 60-90 words, no preamble, no quotes.`;
}

/**
 * Seduction variant — she is actively drawing in an unwilling subject (the viewer).
 * Boudoir / intimate / lure framing. Every pose is an invitation; the viewer
 * should feel pulled forward despite knowing she's dangerous.
 */
function buildSeductionBrief({ vibeDirective, vibeKey }) {
  const skin = pickWithRecency(SKIN_TONES, 'skin', 3);
  const glowColor = pickWithRecency(GLOW_COLORS, 'glow', 3);
  const characterBase = pickWithRecency(CHARACTER_BASES, 'character', 5);
  const hair = pick(HAIR_STYLES);
  const eyes = pick(EYE_STYLES);
  const cyborg = pick(CYBORG_FEATURES);
  const energy1 = pick(ENERGY_EFFECTS);
  let energy2 = pick(ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = pick(ENERGY_EFFECTS);
  const moment = pick(SEDUCTION_MOMENTS);
  const internal = pick(INTERNAL_EXPOSURE);
  const wildcard = pick(WILDCARDS);
  const colorPalette = VIBE_COLOR[vibeKey] || VIBE_COLOR.cinematic;

  return `You are a surrealist cinematographer writing SEDUCTION scenes for VenusBot — a lethal honeytrap cyborg assassin.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her actively drawing in an unwilling subject. The viewer of the image IS the subject being lured. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ INTENT OF THIS IMAGE ━━━

This image must PULL THE VIEWER IN. Someone looking at it should feel the magnetic drag of her beauty, the invitation, the "come to me" pull — even knowing she's dangerous. Honey and blade in one frame. The cyborg nature is visible; the lure is deliberate; the viewer is the target she is reeling in.

Her expression, pose, and the way she's addressing the camera/viewer should ALL read as beckoning, inviting, luring. But her eyes must still hold the cold calculation — the smile does not reach the eyes. Bait, not surrender.

━━━ CHARACTER (same as always) ━━━

${characterBase}

━━━ REQUIRED VISUAL ELEMENTS (must appear in the render) ━━━

- Her EYES are brightly glowing in the GLOW COLOR — plasma-lit irises visible across the scene, not dim ambient.
- A visible INTERNAL ENERGY CORE glows through a translucent panel on her torso (or temple) in the glow color — the "is she alive?" power source.
- CIRCUIT LIGHT pulses along her exposed cyborg parts — tree-branch patterns of the glow color running under/through the chrome.
- Uncanny "is she alive or not" atmosphere — machine-still composure, gaze that doesn't quite blink right, presence that unsettles.
- STRICT: never bare chest / bare nipples / areolas. Chest is always covered — chrome armor, translucent mechanical panel (showing internals, NEVER organic), or fabric/mesh with only the cyborg-form visible. Nipple-shape through covering as a smooth polymer bump or small chrome port is fine; exposed flesh nipple is not. What is she? You can't quite tell. That's the point.

━━━ THE SCENE (her invitation to the viewer) ━━━

${moment}

━━━ HER BODY (same 10-slot dedup) ━━━

- Skin tone tint on real human skin (pores visible): **${skin}**
- Hair: **${hair}**
- Eyes: **${eyes}**
- Dominant cyborg feature (~40-50% visible): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**
- Internal workings visible (opened panel / translucent section): **${internal}**
- Surreal wildcard: **${wildcard}**
- Color palette: ${colorPalette}
- DOMINANT GLOW COLOR (every glowing cyborg element — eyes, breath, circuits, core — renders in this color): **${glowColor}**

━━━ SKIN MATERIAL NUANCE ━━━

Her skin mixes three material zones visible in the frame: (1) real human skin with pores, (2) polished synthetic polymer skin catching light like lacquered ceramic, (3) exposed internals / transparent panels showing mechanisms. Let the viewer see transitions.

━━━ FRAMING ━━━

Full-body or three-quarter-body boudoir framing — she occupies the frame invitingly. The camera angle and composition should itself feel seductive: intimate, close enough to feel her presence but far enough to see her whole form. The eye-line between her and the viewer is CHARGED. No distant wide shots — this is an intimate lure.

━━━ NUDITY RULE ━━━

No bare human breasts or nipples. If her chest is visible, it must be chrome cyborg plating, translucent mechanical panel with internal glow, silk-covered, or circuit-traced synthetic. Sexy but strictly cyborg silhouette. Silk robes, lingerie-like mechanical couture, or boudoir drapery are welcome — as long as chest coverage reads as mechanical/fabric, never flesh.

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 250)}

━━━ SURREAL EFFECT LAYER (use 3-4 naturally) ━━━

double-exposure galaxies bleeding through her silhouette, chromatic aberration splitting light, bioluminescent veins pulsing through skin, prismatic light refraction, cosmic nebula behind her, kaleidoscopic reflections, atmospheric haze, fisheye distortion edges.

Output ONLY the scene description, 60-90 words, no preamble, no quotes, no meta-commentary.`;
}

async function callSonnet(brief, maxTokens = 220) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: brief }],
    }),
  });
  if (!res.ok) throw new Error('Sonnet ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  return (data.content[0]?.text || '').trim().replace(/^["']|["']$/g, '');
}

async function flux(prompt) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + REPLICATE, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' },
      }),
    }
  );
  if (!res.ok) throw new Error('Flux ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const p = await fetch('https://api.replicate.com/v1/predictions/' + data.id, {
      headers: { Authorization: 'Bearer ' + REPLICATE },
    });
    const pd = await p.json();
    if (pd.status === 'succeeded') return typeof pd.output === 'string' ? pd.output : pd.output[0];
    if (pd.status === 'failed' || pd.status === 'canceled') throw new Error('Flux ' + pd.status);
  }
  throw new Error('Flux timed out');
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (s) => {
      const f = fs.createWriteStream(dest);
      s.pipe(f).on('finish', () => f.close(resolve)).on('error', reject);
    }).on('error', reject);
  });
}

async function postToVenus({ localPath, prompt, vibeKey, label, idx }) {
  const { data: u } = await sb.from('users').select('id').ilike('username', 'venusbot').single();
  const data = fs.readFileSync(localPath);
  const key = `${u.id}/${Date.now()}-${label}-${String(idx).padStart(2, '0')}.jpg`;
  const { error: e1 } = await sb.storage.from('uploads').upload(key, data, { contentType: 'image/jpeg' });
  if (e1) throw new Error('upload: ' + e1.message);
  const url = sb.storage.from('uploads').getPublicUrl(key).data.publicUrl;
  const { error: e2 } = await sb.from('uploads').insert({
    user_id: u.id,
    image_url: url,
    thumbnail_url: null,
    ai_prompt: prompt,
    dream_medium: 'surreal',
    dream_vibe: vibeKey,
    width: 768,
    height: 1344,
    is_active: true,
    is_posted: true,
    is_public: true,
    is_ai_generated: true,
    posted_at: new Date().toISOString(),
    caption: `[${label}] golden-v2`,
  });
  if (e2) throw new Error('insert: ' + e2.message);
  return url;
}

(async () => {
  const { data: vibeRow } = await sb.from('dream_vibes').select('key,directive').eq('key', VIBE).single();
  if (!vibeRow) throw new Error('Vibe not found: ' + VIBE);
  const vibeDirective = vibeRow.directive || '';

  const outDir = `/tmp/venus_golden-${LABEL}`;
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`📁 ${outDir}\n`);

  const MIXED_ORDER = ['closeup', 'full-body', 'seduction'];
  for (let i = 1; i <= COUNT; i++) {
    const resolvedMode =
      MODE === 'mixed' ? MIXED_ORDER[(i - 1) % MIXED_ORDER.length] : MODE;
    const brief =
      resolvedMode === 'full-body'
        ? buildFullBodyBrief({ vibeDirective, vibeKey: VIBE })
        : resolvedMode === 'seduction'
          ? buildSeductionBrief({ vibeDirective, vibeKey: VIBE })
          : buildGoldenBrief({ vibeDirective, vibeKey: VIBE });
    console.log(`━━━ #${i}/${COUNT} | surreal + ${VIBE} | mode=${resolvedMode} ━━━`);
    try {
      const middle = await callSonnet(brief);
      console.log('SONNET middle:', middle.slice(0, 150) + (middle.length > 150 ? '…' : ''));
      const finalPrompt = `${GOLDEN_PREFIX}, ${middle}, ${GOLDEN_SUFFIX}`;
      const url = await flux(finalPrompt);
      const out = path.join(outDir, String(i).padStart(2, '0') + '.jpg');
      await download(url, out);
      console.log('FLUX saved:', out);
      const posted = await postToVenus({
        localPath: out,
        prompt: finalPrompt,
        vibeKey: VIBE,
        label: LABEL,
        idx: i,
      });
      console.log('POSTED:', posted);
      console.log();
    } catch (err) {
      console.error('FAILED:', err.message);
    }
  }
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
