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
// SKIN TONES — the organic side of the cyborg. Explicitly DIVERSE, across
// human ethnicities AND alien species. Not every render is a "white girl
// with a chrome shoulder" — her organic half can be ebony, mahogany, pink
// alien, green alien, ashen gray, matte obsidian skin, etc. Human skin
// entries name real ethnic tones; alien entries go wild. Recency window
// set deep (7) because this is the MOST-noticed axis and Kevin flagged
// clustering on pale skin as a blocker.
const SKIN_TONES = [
  // HUMAN — across the spectrum, NAMED with ethnic specificity
  'deep ebony brown skin with rich mahogany undertones, warm and matte',
  'dark cocoa skin with red-brown undertones, velvety finish',
  'warm umber brown skin, golden undertones catching rim light',
  'mid-toned sepia brown skin, terracotta undertones',
  'olive-tan Mediterranean skin with warm honey undertones',
  'golden-tawny South Asian skin with warm sienna undertones',
  'warm porcelain East-Asian skin with peach undertones',
  'sunburned desert-tan skin, copper-warm and weathered',
  'light beige skin with cool rose undertones',
  'freckled alabaster skin with rose-pink undertones',
  // ALIEN — not from this planet, organic but fully inhuman
  'soft fuchsia-pink alien skin, smooth and glossy like petals',
  'moss-green alien skin with deeper jade speckling across the cheekbones',
  'jet-black alien skin absorbing light like velvet, no reflection',
  'ashen gray alien skin with charcoal micro-veining, matte stone finish',
  'translucent pale-lavender alien skin with blood vessels faintly visible',
  'icy robin-egg blue alien skin with white frost bloom across the cheeks',
  'deep wine-purple alien skin with indigo shadow gradients',
  'iridescent shifting-hue alien skin (copper-to-teal gradient depending on angle)',
  'obsidian-black alien skin with sparse constellations of bioluminescent freckles',
  'warm terracotta-red alien skin with ochre undertones, desert-creature energy',
  'pale-gold alien skin with a fine subdermal shimmer, like buttered chrome',
  'seafoam green alien skin with opalescent micro-scales across the temples',
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
// BODY_TYPES — vary her silhouette. Default runway-thin is banned —
// Sonnet/Flux gravitates there. Explicitly roll diverse sexy bodies so
// batches mix short / tall / curvy / thick / athletic / bombshell /
// busty. North star: always SEXY and R-rated. Recency window deep (6).
const BODY_TYPES = [
  'voluptuous hourglass build with full heavy bust, narrow waist, wide curvy hips — bombshell silhouette',
  'thick curvy athletic build, broad shoulders, strong mechanical thighs, full chest, soft stomach — powerful and sexy',
  'tall amazonian build, 6-foot frame, long mechanical legs, athletic shoulders, firm medium-full bust — statuesque and commanding',
  'short petite build, 5-foot frame, compact curves, generous bust for her size, softly rounded hips — small and devastating',
  'lean athletic runway build, long limbs, subtle curves, small firm bust, narrow hips — elegant and sharp',
  'pear-shaped build with slim upper torso, small-medium bust, wide voluptuous hips and thick mechanical thighs — weighty and sexy',
  'apple-shaped build with full chest and shoulders, soft rounded midsection, slimmer legs — top-heavy bombshell energy',
  'stacked bombshell build — enormous full bust, cinched waist, lush curvy hips, dramatic hourglass silhouette',
  'athletic curvy build with visible muscle definition under soft skin, medium-full bust, sculpted mechanical abs — gym-goddess cyborg',
  'slim-thicc build — slender waist and shoulders, unexpectedly thick hips and curvy thighs, full medium bust',
  'tall willowy build, flat-chested with subtle breast shaping, narrow hips, long mechanical limbs — androgynous cyborg beauty',
  'plus-size voluptuous build, fully curvy body, soft full bust, rounded hips and thighs, confident fuckable silhouette',
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
  // SMALL-WINDOW variants (traditional cyborg maintenance-panel reveals)
  'one cheek panel slightly lifted like a hinged hatch, revealing spinning brass micro-gears and a pulsing amber plasma core inside her skull',
  'a transparent observation-window section on her temple exposing the circuit board beneath, data streams visibly scrolling across it in real time',
  'a visible service seam along her jaw partially open showing bundles of fiber-optic nerve cables glowing turquoise inside',
  'one of her eyes is a clearly visible mechanical iris aperture — tiny servos and focus rings visible around the orbit, pulsing LEDs deep inside',
  'one side of her forehead opened like a maintenance panel, exposing pulsing liquid-coolant lines and a central glowing reactor core',
  'a glass observation window built into her neck showing the rotating mechanism of internal vertebrae processing, circuitry flashing behind it',
  'one ear housing is open and exposed, showing intricate brass resonance chambers, copper wire bundles, and tiny LEDs winking inside',
  'a diagnostic port at her collarbone is open with a wisp of internal plasma visible, fiber-optic filaments spilling out like thin glowing tendrils',
  // WHOLE-TORSO / DOMINANT-REVEAL variants — subtle, not screamy. Let the
  // translucency speak for itself without over-naming the internal parts.
  'her torso is translucent — you can see the mechanical structure inside and a glowing core at center-chest, softly visible through the clear skin',
  'most of her chest and abdomen read as clear polymer, the internal mechanisms and glowing heart-light showing through like something seen in a beautiful museum display',
  'translucent skin across her front exposes the quiet architecture of her inner workings and the steady glow of her core, rendered with museum-piece restraint',
  'her sternum and belly glow softly from within — a translucent shell over mechanical structure, the internal light washing outward',
  'her body has an almost-translucent quality across her torso — gentle hints of internal structure visible, the pulsing inner glow more felt than seen',
  'her chest is see-through in a subtle way — the internal mechanism glows through the clear skin like a lantern through paper',
  'wide portions of her body are translucent, and the internal workings are visible in soft, dreamy detail — not an anatomy diagram, but a gorgeous reveal',
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

// SCENE_PALETTES — overall color mood of the whole image, rolled per
// render so batches don't cluster on teal/orange or blue/green. This
// overrides the default VIBE_COLOR default when picked. Deep recency
// window (7) so a batch forces cycling through the full range.
const SCENE_PALETTES = [
  'warm sunset gold and copper tones, burnt-orange shadows, peach highlights — all warm',
  'deep crimson and oxblood reds, black shadows, gold accent highlights — bloody and regal',
  'icy arctic whites and pale cerulean, silver highlights, fog haze, clinical cool',
  'rich amethyst and violet with magenta highlights, indigo shadows, dreamy saturated',
  'emerald forest greens with gold rim-light, deep umber shadows, nature-mystic',
  'pure monochrome black-and-white with a single crimson accent — editorial graphic',
  'dusty sepia and bone-white tones, ochre highlights, antique-film aesthetic',
  'hot neon pink and acid yellow, black shadows, cyberpunk-pop electric',
  'creamy pearl and rose-gold, soft peach atmosphere, ivory highlights — bright and luxe',
  'toxic chartreuse green with black shadows and hot-pink accents — poison-editorial',
  'molten lava orange and charcoal, ember-red highlights — volcanic warm',
  'bleached desert sand and sunbaked ochre, blue-sky negative space, hot bright',
  'deep ocean navy and teal with silver-white foam highlights — aquatic and cold',
  'champagne gold on ivory, soft rose shadows, editorial studio bright',
  'inky midnight black with moonlight silver rim-light, subtle violet undertones',
  'burgundy and mulled-wine reds with soft candlelight gold, chiaroscuro',
  'butter-yellow and cream with soft robin-blue accents — vintage sunny',
  'blood-red and raw-meat crimson against charcoal — brutal painterly',
];

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

// MAKEUPS — Sonnet-authored extreme editorial makeup looks. Rolled per
// render on the cyborg_fashion path as a separate axis so moment/makeup
// combos multiply (30 moments × 25 makeups = 750 distinct pairings).
const MAKEUPS = JSON.parse(
  fs.readFileSync(path.resolve('scripts/seeds/venusbot_makeups.json'), 'utf8')
);

// CYBORG_FASHION_MOMENTS — Sonnet-authored editorial fashion scene seeds
// for the venusbot_cyborg_fashion path. Vogue/McQueen/Galliano-tier avant-
// garde editorial spreads — extreme makeup, extreme couture, extreme pose.
// See scripts/gen-cyborg-fashion-moments.js to regenerate.
const CYBORG_FASHION_MOMENTS = JSON.parse(
  fs.readFileSync(path.resolve('scripts/seeds/venusbot_cyborg_fashion_moments.json'), 'utf8')
);

// STARE_MOMENTS — Sonnet-authored direct-eye-contact scene seeds for the
// venusbot_stare path. Every seed is a moment where she stares straight
// into the camera; intent varies wildly (seductive / menacing / hungry /
// knowing / vacant / etc). See scripts/gen-stare-moments.js to regenerate.
const STARE_MOMENTS = JSON.parse(
  fs.readFileSync(path.resolve('scripts/seeds/venusbot_stare_moments.json'), 'utf8')
);

// HUMAN_TOUCH_VARIANTS — used by the ROBOT path only. Robot path inverts
// the 50/50 cyborg balance to 90/10 — she's almost entirely machine, with
// ONE small human sliver showing through. This axis decides which sliver.
const HUMAN_TOUCH_VARIANTS = [
  'half her face is still human (split diagonally from forehead to jaw) — real skin with pores, full sensual lips, one human eye — the OTHER half is built machine with a glowing sensor-eye',
  'only her LOWER FACE is human — full human lips and jawline — everything from the cheekbones up is machine with a glowing visual sensor',
  'only the CENTER of her face is human (a thin mask-shape around the mouth and eyes) — the rest of her head is a sculpted machine shell',
  'ONE entire ARM is organic human flesh with visible skin, the other is a fully mechanical limb — everything else on her body is machine',
  'ONE SIDE of her torso (ribcage to hip) has organic human skin visible through the cracked machine shell — the rest of her is all machine',
  'only her LIPS are human — full, slightly parted, real skin — everything else on her head is a seamless machine face with a glowing visor where eyes would be',
  'a SEAM of human skin runs vertically down the center of her body from throat to navel — a pale ribbon of flesh flanked entirely by machine shell',
  'only her NECK AND THROAT are organic, with real skin showing a pulse — head is a faceless machine helmet with a glowing slit visor, body is all machine',
  'only her EYES are human — vulnerable, watery, real — set into a mannequin face and fully robotic body',
  'her FACE is a sculpted machine mask with NO human features visible — but her HAIR is real, falling in heavy organic waves over her built shoulders (the only human thing on her)',
];

// ROBOT_MOMENTS — path-specific scene seeds. Predator energy, hunting
// the viewer, industrial/clinical/threatening settings, but she's still
// hot-as-fuck. Terrifying-and-magnetic at once — fight-or-fuck response.

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

// ─────────────────────────────────────────────────────────────
// SHARED AESTHETIC BLOCKS — injected verbatim by every path brief.
// Same cyborg character aesthetic across closeup / full-body /
// seduction. Only the moment/framing varies per path.
// ─────────────────────────────────────────────────────────────

const REQUIRED_ELEMENTS_BLOCK = `━━━ MACHINE-FIRST — NON-NEGOTIABLE ━━━

She MUST read unmistakably as a CYBORG at first glance, not a human woman with accents. If a viewer could scroll past this image and think "pretty woman with a glow patch," the render has failed.

MINIMUM THRESHOLD: at least HALF (50%+) of her visible body surface must be clearly, obviously mechanical — no negotiation, no compromise, no "subtle accents." The human parts are a MINORITY of what's visible.

REQUIRED MECHANICAL BODY PARTS (these MUST be visible in the render — weave them in):
- **Mechanical arms** — at least one forearm and hand must be clearly robotic: exposed segmented chrome / titanium / brass / carbon-fiber structure, articulated servo fingers with visible piston joints, NO organic flesh on the limb.
- **Shoulder joints** — exposed ball-socket or hydraulic-hinge mechanisms where a human shoulder would be, hardware visibly rotating.
- **Segmented neck / throat** — chrome or composite ring-segments with visible actuators between them where a human throat would be, not smooth skin.
- **TRANSLUCENT TORSO** — a substantial portion of her torso (chest, sternum, belly) is translucent / frosted / clear-polymer skin — you can see into her. The internal mechanical structure is visible through it, and a glowing power core sits somewhere inside. Think Ex-Machina or Alita Battle Angel — the "see inside her" reveal is part of what makes her beautiful, handled with subtlety rather than screamed. Don't over-describe the internal parts; just establish that her body is translucent and glows from within.
- **Additional machine tells welcome** — chrome jawline plating, exposed spine segments visible through back/nape, mechanical ear-housings with visible gears, transparent skull section, robotic legs with hinge joints.

Only her FACE stays organic (exotic human or alien skin, full lips, luminous eyes). Everything else should read as a constructed being.

━━━ REQUIRED LIGHT ELEMENTS (in every render) ━━━

- Her EYES burn brightly in the GLOW COLOR — plasma-lit irises visible across the scene.
- A visible INTERNAL POWER CORE lives INSIDE HER BODY and is seen THROUGH a transparent-acrylic / smoked-glass / clear-polymer section of her torso or skull. It is a physical mechanical/reactor structure (not a light effect on her surface, NOT a firework, NOT a decorative glowing emblem, NOT a heart-shape). The viewer looks INTO her and sees her mechanical guts with the reactor pulsing among gears and fiber-optic cables.
- CIRCUIT LIGHT glows from UNDER the skin — bioluminescent tree-veins visible through translucent body sections, subtle and integrated, not sparks on top.
- Uncanny "is she alive or not" stillness — machine-still composure, gaze that doesn't quite blink right.

**SURFACE EFFECTS BANNED:** No fireworks, no spark explosions bursting off her chest, no glowing hearts/logos/emblems pasted on her body, no decorative rays shooting out. Everything glowing lives INSIDE her body and is visible THROUGH translucent panels — never sits on top of her surface as an effect.

━━━ MATERIAL PALETTE (OPEN — not chrome-locked) ━━━

Her body surface materials can be ANY combination: brushed titanium, polished brass, copper, rose-gold, matte carbon fiber, glossy black latex, oxblood/royal-blue/emerald latex, iridescent holographic polymer, pearlescent ceramic, obsidian glass, smart-glass panels, color-shifting chameleon pigment, frosted acrylic, translucent silicone, bioluminescent hydrogel, liquid mercury segments, nanotube weave, jade, graphite, plus chrome (one option of many). MIX 2-3 materials across different body zones per render. Do NOT default every render to chrome-everything.

━━━ CHEST COVERAGE (rated-R, Vogue-editorial level) ━━━

Her chest is sexy in SILHOUETTE and LINE — elegant curves, sweeping contours, sculptural breast-forms rendered as a clean mechanical or fabric surface. Coverage is ALWAYS present. Options:

- Sculptural mechanical breastplate with a smooth, UNINTERRUPTED surface (like a polished sculpture — no surface features, no ports, no accents, no dots, no studs, no gems positioned on the bust)
- Translucent polymer panel across the chest revealing internal mechanisms (gears, circuits, pulsing core) — the reveal is WHAT'S INSIDE the panel, never flesh
- Silk / latex / sheer mesh / lace / high-fashion fabric draped across her chest — fabric follows the curve but the surface under it stays smooth and featureless
- Ornate circuit-traced chrome bust with patterning (filigree, etched lines, cabled circuits) — patterning flows across the whole surface continuously, never concentrating into a central feature on each breast

DO NOT add any small surface feature at the center of the bust — no accents, no ports, no studs, no gems, no LEDs, no glowing dots, no circuit-node, no small decorative emblem — anywhere on the breast surface. The bust surface stays sculpturally clean.

Rated R, high-fashion editorial — think Vogue cover, NOT lingerie catalog. Suggestive via shape, not explicit via detail. No nipples.`;

const SURREAL_EFFECTS_BLOCK = `━━━ SURREAL EFFECT LAYER (weave 2-3 naturally, don't overdo) ━━━

chromatic aberration splitting light at edges, bioluminescent veins pulsing through skin, prismatic refraction halos, atmospheric haze, fisheye distortion at frame edges, cosmic nebula backdrop, double-exposure galaxies bleeding through her silhouette, kaleidoscopic reflections. Effects feel INTEGRATED, not filtered-on.`;

const SKIN_MATERIAL_NUANCE_BLOCK = `━━━ SKIN MATERIAL NUANCE ━━━

Her skin mixes THREE material zones visible in the frame: (1) real human skin with pores and imperfections in the tinted color below, (2) polished synthetic polymer skin catching light like lacquered ceramic with subtle seam lines, (3) exposed internals / transparent panels revealing mechanisms. Let the viewer see the transitions between all three.`;

const HOT_AS_HELL_BLOCK = `━━━ HOT-AS-HELL RULE (universal — every path) ━━━

She is MAGNETICALLY sexy in every render. Every pose, every framing, every moment should radiate heat and pull. Lean into it — elegant feminine curves, exposed mechanical décolletage, hip line, chrome thigh revealed through a slit, silk-and-machine lingerie-couture, latex-and-circuit bustiers, sheer mesh draped over cyborg panels, boudoir silk sliding off one shoulder, hint of exposed waist, fabric catching the line of her bust. High-fashion Vogue editorial energy — suggestive via shape, not explicit via detail. Rated R, not X. Whatever the path is doing (plotting, staring, posing for Vogue, closeup portrait), she is ALWAYS the hottest thing in the frame. Coverage rules from above apply (mechanical / translucent-panel / fabric), but the SILHOUETTE burns with heat and the pull of wanting her. Never demure, never schoolmarm. Always a ten.

━━━ BANNED SHOTS ━━━

- NO "runway walk toward the camera" or "walking directly toward the lens" compositions — that's a cliché catwalk shot. Frontal walk-toward-camera is banned.
- NO boring standing-still-facing-camera-in-a-hallway / corridor / subway-platform shots. If you've written "standing motionless in a corridor looking at camera", scrap it.
- PICK interesting angles — overhead, low-angle, profile, tilted, Dutch angle, reflection, over-the-shoulder, partial-body, from behind her, through a window or doorway, frozen mid-action. Make each frame a unique composition.`;

// ROBOT-PATH-ONLY required-elements. Overrides REQUIRED_ELEMENTS_BLOCK
// for the robot path (which inverts the default 50/50 to 90/10 machine-
// dominant). She is ALMOST entirely machine — a Terminator-style
// endoskeleton-and-chrome predator in female silhouette. ONE small
// human sliver shows through (see HUMAN_TOUCH_VARIANTS). Hunter.
// Fight-or-fuck response: you want to run from her AND want her.
const ROBOT_FIRST_BLOCK = `━━━ ROBOT-FIRST — 90% MACHINE, 10% HUMAN ━━━

This is the ROBOT path. She is almost entirely a machine — think female Terminator, T-800 / T-1000 hunter energy, relentless, in a sexy-as-fuck feminine silhouette. At least 90% of her visible body reads as PURE ROBOT. Only a small HUMAN SLIVER remains (see HUMAN TOUCH axis below).

MATERIALS — OPEN: she can be built from ANY composite of materials and colors. Metals of any kind (chrome, brushed titanium, gunmetal, brass, copper, rose-gold, steel, iron, ceramic), plastics, polymers, rubber, latex, carbon fiber, ceramics, painted composites, matte finishes, glossy finishes, candy-coated colors, military matte, pearlescent whites, obsidian blacks, jewel-toned enamels, transparent panels, liquid-metal segments, hybrid fabric-over-frame — any mix. She is a BUILT thing; she can be built from anything. Don't default to chrome-everything. Let the look breathe.

The viewer should look at her and think "that is a ROBOT" — not "that is a cyborg woman." The human sliver is a haunting detail, not a reassurance.

FEMININE-BUT-ROBOT SILHOUETTE: she is unmistakably a female-form robot. Curves are present — bust, waist, hips, thighs — but rendered in her built materials. The female shape is part of the weapon. Sexiness comes from SILHOUETTE + lethal threat, not from exposed skin. Articulated limbs, visible joints, whatever internal anatomy she has, all optional flavors — choose what fits the shot.

━━━ REQUIRED LIGHT ELEMENTS (robot path) ━━━

- A glowing sensor / targeting-eye / lens slit in the GLOW COLOR — visible wherever her visual apparatus is
- An internal power core or energy source visible THROUGH a translucent section somewhere (chest, skull, shoulder) — same rule as shared: inside, not surface fireworks
- Machine-still composure — too mechanical to be alive

━━━ THE HUMAN SLIVER (the 10%) ━━━

Exactly ONE small human feature remains — see the HUMAN TOUCH axis below. This is the ONLY organic detail on her. Everywhere else: full machine.

━━━ COVERAGE ━━━

Her chest is sculptural robot material — smooth mechanical breastplate, translucent panel, built-surface, or fabric-over-frame. Suggestive via SHAPE only. No nipples.`;

/**
 * Roll the shared character-DNA slots once for a render. Every path calls
 * this so the body-aesthetic is identical across paths — only the path's
 * unique hook (pose / moment / makeup / stare-intent) differs.
 */
function rollCharacterDNA(vibeKey) {
  return {
    skin: pickWithRecency(SKIN_TONES, 'skin', 7),
    bodyType: pickWithRecency(BODY_TYPES, 'body', 6),
    glowColor: pickWithRecency(GLOW_COLORS, 'glow', 3),
    scenePalette: pickWithRecency(SCENE_PALETTES, 'scene_palette', 7),
    characterBase: pickWithRecency(CHARACTER_BASES, 'character', 5),
    hair: pick(HAIR_STYLES),
    eyes: pick(EYE_STYLES),
    internal: pick(INTERNAL_EXPOSURE),
    wildcard: pick(WILDCARDS),
    colorPalette: VIBE_COLOR[vibeKey] || VIBE_COLOR.cinematic,
  };
}

/**
 * Emit the shared "HER BODY" slot list verbatim. Every path injects this
 * block unchanged so she reads as the same cyborg across closeup / full-body
 * / seduction / cyborg_fashion / stare — only the path's unique axes differ.
 */
function characterDNABlock(dna) {
  return `━━━ HER BODY (shared character DNA — same across all paths) ━━━

- Body type / silhouette (MUST land — don't default to runway-thin): **${dna.bodyType}**
- Skin tone tint on organic skin (pores visible): **${dna.skin}**
- Hair: **${dna.hair}**
- Eyes: **${dna.eyes}**
- Internal workings visible through translucent panel: **${dna.internal}**
- Surreal wildcard: **${dna.wildcard}**
- SCENE-WIDE COLOR PALETTE (overrides the default cinematic teal/orange — the WHOLE image should be graded in this palette): **${dna.scenePalette}**
- Secondary lighting palette (supports scene palette above): ${dna.colorPalette}
- DOMINANT GLOW COLOR (every glowing cyborg element — eyes, internal core, circuits — renders in this color): **${dna.glowColor}**`;
}

function buildGoldenBrief({ vibeDirective, vibeKey }) {
  const dna = rollCharacterDNA(vibeKey);
  const cyborg = pick(CYBORG_FEATURES);
  const energy1 = pick(ENERGY_EFFECTS);
  let energy2 = pick(ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = pick(ENERGY_EFFECTS);
  const pose = pick(POSES);
  const expression = pick(EXPRESSIONS);
  const accent = pick(ACCENT_DETAILS);
  const environment = pick(ENVIRONMENTS);

  return `You are a surrealist fashion photographer writing scene descriptions for VenusBot.

TASK: write ONE vivid scene description (60-80 words, comma-separated phrases) of a HALF-HUMAN HALF-MACHINE CYBORG WOMAN. The output will be automatically wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ CHARACTER RULES (who SHE is) ━━━

${dna.characterBase}

${REQUIRED_ELEMENTS_BLOCK}

${SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(dna)}

━━━ PATH-SPECIFIC AXES (closeup path extras) ━━━

- EXPRESSION: **${expression}**
- POSE (within waist-up framing): **${pose}**
- CYBORG HALF (must be dominant, ~40-50% of frame): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**
- ACCENT DETAIL (subtle extra): **${accent}**
- Environment: **${environment}**

━━━ FRAMING HARD-LOCK — NO EXCEPTIONS ━━━

The composition MUST be ONE of:
1. WAIST-UP three-quarter bust portrait, slight side-angle turn
2. HEAD-AND-SHOULDERS close-up with off-camera gaze
3. Side-profile portrait showing face + throat + shoulder

ABSOLUTELY NOT: reclining, seated, full-body, standing-full, arms-up, from-above, from-behind, distant figure. NEVER show the legs or hips. Face fills the upper third of the frame.

${HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT (subtle, don't override subject) ━━━

${vibeDirective.slice(0, 250)}

${SURREAL_EFFECTS_BLOCK}

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
  const dna = rollCharacterDNA(vibeKey);
  const cyborg = pick(CYBORG_FEATURES);
  const energy1 = pick(ENERGY_EFFECTS);
  let energy2 = pick(ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = pick(ENERGY_EFFECTS);
  const pose = pick(ACTION_POSES);
  const moment = pick(MOMENTS);

  return `You are a surrealist cinematographer writing full-body action / moment scenes for VenusBot — a lethal honeytrap cyborg assassin.

TASK: write ONE vivid FULL-BODY scene description (60-90 words, comma-separated phrases) of her mid-action or mid-moment. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ CHARACTER (same as always) ━━━

${dna.characterBase}

${REQUIRED_ELEMENTS_BLOCK}

${SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(dna)}

━━━ PATH-SPECIFIC AXES (full-body path extras) ━━━

- Dominant cyborg feature (~40-50% of body visible): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**

━━━ THE MOMENT (what she is doing — this is the scene's narrative) ━━━

**${moment.kind.toUpperCase()} MOMENT**: ${moment.text}

This is a LOADED scene — she is in the middle of a plot. Film-noir meets sci-fi assassin. Seductive AND deadly at once. The moment should feel charged with intent — something is about to happen, or just did. NEVER a generic "running" or "standing still" pose. Her hyper-perfect beauty is the lure; her cold cyborg nature is the blade.

━━━ FRAMING ━━━

**${pose}**

This is a FULL-BODY scene, not a closeup. Show her whole silhouette in the frame doing the moment above. Scene has depth, environment, scale. She is the subject but the world surrounds her.

${HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 250)}

${SURREAL_EFFECTS_BLOCK}

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
  const dna = rollCharacterDNA(vibeKey);
  const cyborg = pick(CYBORG_FEATURES);
  const energy1 = pick(ENERGY_EFFECTS);
  let energy2 = pick(ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = pick(ENERGY_EFFECTS);
  const moment = pick(SEDUCTION_MOMENTS);

  return `You are a surrealist cinematographer writing SEDUCTION scenes for VenusBot — a lethal honeytrap cyborg assassin.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her actively drawing in an unwilling subject. The viewer of the image IS the subject being lured. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ INTENT OF THIS IMAGE ━━━

This image must PULL THE VIEWER IN. Someone looking at it should feel the magnetic drag of her beauty, the invitation, the "come to me" pull — even knowing she's dangerous. Honey and blade in one frame. The cyborg nature is visible; the lure is deliberate; the viewer is the target she is reeling in.

Her expression, pose, and the way she's addressing the camera/viewer should ALL read as beckoning, inviting, luring. But her eyes must still hold the cold calculation — the smile does not reach the eyes. Bait, not surrender.

━━━ CHARACTER (same as always) ━━━

${dna.characterBase}

${REQUIRED_ELEMENTS_BLOCK} What is she? You can't quite tell. That's the point.

${SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(dna)}

━━━ PATH-SPECIFIC AXES (seduction path extras) ━━━

- Dominant cyborg feature (~40-50% visible): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**

━━━ THE SCENE (her invitation to the viewer) ━━━

${moment}

━━━ FRAMING ━━━

Full-body or three-quarter-body boudoir framing — she occupies the frame invitingly. The camera angle and composition should itself feel seductive: intimate, close enough to feel her presence but far enough to see her whole form. The eye-line between her and the viewer is CHARGED. No distant wide shots — this is an intimate lure.

${HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 250)}

${SURREAL_EFFECTS_BLOCK}

Output ONLY the scene description, 60-90 words, no preamble, no quotes, no meta-commentary.`;
}

/**
 * Cyborg-fashion variant — the same cold-bitch cyborg assassin, now the
 * subject of an avant-garde editorial fashion spread. Extreme makeup,
 * extreme couture, extreme pose. McQueen / Galliano / Schiaparelli / Nick
 * Knight energy. Same character DNA (glowing eyes, translucent core,
 * machine-first body, clean-silhouette coverage) but dressed up for a Vogue spread.
 */
function buildCyborgFashionBrief({ vibeDirective, vibeKey }) {
  const dna = rollCharacterDNA(vibeKey);
  const moment = pick(CYBORG_FASHION_MOMENTS);
  const makeup = pickWithRecency(MAKEUPS, 'makeup', 5);

  return `You are a fashion-editorial cinematographer writing CYBORG FASHION scenes for VenusBot — avant-garde editorial spreads featuring the cold-bitch cyborg assassin all glammed up.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her in the editorial scene below. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ WHO SHE IS (same character, now in an editorial spread) ━━━

${dna.characterBase}

Same character. Still cold, still mean, still mysterious, still the cyborg killer. She is now the subject of an extreme fashion shoot — McQueen Plato's Atlantis, Galliano-Dior couture, Schiaparelli surrealism, Pat McGrath extreme makeup, Nick Knight editorial photography. Nothing is off limits in terms of bizarre or crazy looks. Her cyborg body and machine-nature remain fully visible — she is dressed UP, not disguised.

${REQUIRED_ELEMENTS_BLOCK}

${SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(dna)}

━━━ THE EDITORIAL SCENE ━━━

${moment}

━━━ EXTREME EDITORIAL MAKEUP (must appear — override any makeup hints in the scene above) ━━━

${makeup}

${HOT_AS_HELL_BLOCK}

━━━ MOOD ━━━

${vibeDirective.slice(0, 200)}

${SURREAL_EFFECTS_BLOCK}

Output ONLY the 60-90 word scene, comma-separated, no preamble, no quotes.`;
}

/**
 * Stare variant — every render is a direct-eye-contact moment. She stares
 * straight into the camera; the viewer feels LOOKED AT. Intent of her stare
 * varies wildly per seed (seductive, menacing, hungry, knowing, vacant,
 * assessing, challenging, etc.). Same character DNA as other paths.
 */
function buildStareBrief({ vibeDirective, vibeKey }) {
  const dna = rollCharacterDNA(vibeKey);
  const moment = pickWithRecency(STARE_MOMENTS, 'stare_moment', 5);

  return `You are a surrealist cinematographer writing DIRECT-EYE-CONTACT scenes for VenusBot — the cyborg-assassin staring you down through the lens.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) where she stares DIRECTLY INTO THE CAMERA. The viewer feels LOOKED AT. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ THE HOOK OF THIS PATH ━━━

EYE CONTACT. She is looking DIRECTLY AT THE CAMERA. Eyes locked on the lens. No side-glance, no off-camera stare, no averted gaze. The viewer's whole experience is being STARED DOWN by her. Whatever framing, whatever setting — her eyes cut straight through the lens and hold the viewer.

Make the stare UNESCAPABLE. Name it explicitly in your output ("eyes locked on camera," "gaze cutting through the lens," "direct eye contact with the viewer," "stare pinning you through the glass" — however you phrase it, make it clear she is looking AT the camera).

━━━ CHARACTER (same as always) ━━━

${dna.characterBase}

${REQUIRED_ELEMENTS_BLOCK}

${SKIN_MATERIAL_NUANCE_BLOCK}

━━━ THE SCENE (the stare, with its specific intent, composition, setting) ━━━

${moment}

${characterDNABlock(dna)}

━━━ FRAMING NOTE ━━━

Whatever composition the scene specifies (closeup, over-shoulder, low-angle, through-glass, mirror, etc.), her EYES must end up pointed at the camera lens. If the composition would naturally have her looking elsewhere, write in the moment where she turns / pivots / catches the lens so eye contact lands. The CAMERA IS HER TARGET.

${HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 200)}

${SURREAL_EFFECTS_BLOCK}

Output ONLY the 60-90 word scene, comma-separated, no preamble, no quotes.`;
}

/**
 * Robot variant — reuses scenes from CLOSEUP / FULL-BODY / SEDUCTION
 * paths, just swaps the character spec to 90% machine / 10% human.
 * Each render rolls a random sub-flavor so robot batches get closeup
 * portraits, full-body action, AND seductive lures — all rendered as
 * Terminator-style near-fully-robotic hunters with one human sliver.
 */
function buildRobotBrief({ vibeDirective, vibeKey }) {
  const dna = rollCharacterDNA(vibeKey);
  const humanTouch = pickWithRecency(HUMAN_TOUCH_VARIANTS, 'human_touch', 4);
  const subFlavor = pick(['closeup', 'full-body', 'seduction', 'cyborg_fashion', 'stare']);

  let sceneBlock = '';
  let framingBlock = '';
  let intentBlock = '';

  if (subFlavor === 'closeup') {
    const expression = pick(EXPRESSIONS);
    const pose = pick(POSES);
    const environment = pick(ENVIRONMENTS);
    intentBlock = `━━━ INTENT OF THIS IMAGE (closeup portrait flavor) ━━━

A tight closeup portrait of her. Face, throat, shoulder. Expression and gaze carry the whole image. The viewer is close — uncomfortably close — to a thing that is mostly machine.`;
    sceneBlock = `━━━ THE SCENE (closeup portrait) ━━━

- EXPRESSION: **${expression}**
- POSE (within waist-up framing): **${pose}**
- Environment (background only — face dominates frame): **${environment}**`;
    framingBlock = `━━━ FRAMING ━━━

WAIST-UP three-quarter bust portrait, HEAD-AND-SHOULDERS closeup, or side-profile portrait. Face fills the upper third of the frame. NEVER show legs or hips. NO full-body in this sub-flavor.`;
  } else if (subFlavor === 'full-body') {
    const moment = pick(MOMENTS);
    const actionPose = pick(ACTION_POSES);
    intentBlock = `━━━ INTENT OF THIS IMAGE (full-body action flavor) ━━━

A full-body scene of her in the middle of a charged moment. Film-noir-meets-sci-fi — something is about to happen, or just did. Hunter-predator energy in every motion.`;
    sceneBlock = `━━━ THE SCENE (full-body moment) ━━━

**${moment.kind.toUpperCase()} MOMENT**: ${moment.text}

This is a LOADED scene — she is in the middle of a plot. Rendered as a robot, the moment plays even colder.`;
    framingBlock = `━━━ FRAMING ━━━

**${actionPose}**

Full-body scene, not closeup. Show her whole silhouette in the frame. Scene has depth, environment, scale.`;
  } else if (subFlavor === 'seduction') {
    const moment = pick(SEDUCTION_MOMENTS);
    intentBlock = `━━━ INTENT OF THIS IMAGE (seduction / lure flavor) ━━━

This image must PULL THE VIEWER IN. Magnetic drag, "come to me" invitation — even knowing she's a machine that would kill them. Fight-or-fuck response: they want to run AND they want her.`;
    sceneBlock = `━━━ THE SCENE (her lure to the viewer) ━━━

${moment}`;
    framingBlock = `━━━ FRAMING ━━━

Full-body or three-quarter-body boudoir framing — she occupies the frame invitingly. Intimate, close enough to feel her presence, but far enough to see her whole form. The eye-line between her and the viewer is CHARGED.`;
  } else if (subFlavor === 'cyborg_fashion') {
    const moment = pick(CYBORG_FASHION_MOMENTS);
    const makeup = pickWithRecency(MAKEUPS, 'makeup', 5);
    intentBlock = `━━━ INTENT OF THIS IMAGE (avant-garde editorial fashion flavor) ━━━

An avant-garde editorial fashion spread — McQueen / Galliano / Schiaparelli / Nick Knight energy. She is the subject of an extreme Vogue shoot, now rendered as a near-fully-robotic being. The fashion is extreme; the body is mostly machine; the two magnify each other.`;
    sceneBlock = `━━━ THE EDITORIAL SCENE ━━━

${moment}

━━━ EXTREME EDITORIAL MAKEUP (must appear — applies to the human sliver + any visible face surface) ━━━

${makeup}`;
    framingBlock = `━━━ FRAMING ━━━

Editorial fashion framing — whatever the scene above specifies. Full-body, three-quarter, or extreme close-up — all acceptable. Editorial composition rules: strong shape, dramatic negative space, confident graphic energy.`;
  } else {
    // stare
    const moment = pickWithRecency(STARE_MOMENTS, 'stare_moment', 5);
    intentBlock = `━━━ INTENT OF THIS IMAGE (direct-eye-contact / stare flavor) ━━━

EYE CONTACT. Her eye/sensor/visor is LOCKED directly on the camera. The viewer is being stared down by a thing that is mostly machine. Whatever her visual apparatus is (human eye, sensor slit, glowing lens, visor), it points STRAIGHT at the lens. Make the stare UNESCAPABLE. Name it explicitly ("eyes locked on camera," "targeting lens cutting through the lens," "direct sensor-contact with the viewer," etc.).`;
    sceneBlock = `━━━ THE SCENE (the stare, with its specific intent, composition, setting) ━━━

${moment}`;
    framingBlock = `━━━ FRAMING NOTE ━━━

Whatever composition the scene specifies, her visual apparatus must END UP pointed at the camera lens. The CAMERA IS HER TARGET.`;
  }

  return `You are a sci-fi cinematographer writing ROBOT scenes for VenusBot — a Terminator-style female robot. T-800 / T-1000 hunter energy in a sexy-as-fuck feminine silhouette, lethal and 90% machine.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her in the scene below, rendered as an almost-fully robotic being. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

${intentBlock}

━━━ CHARACTER (robot-mode — 90% machine, override default) ━━━

${dna.characterBase}

Disregard any language in the character base suggesting a majority-human body. In THIS path she is MORE machine than human. Take the character's flavor (voice, demeanor, predator-nature) but render her as almost entirely robotic.

${ROBOT_FIRST_BLOCK}

━━━ THE HUMAN TOUCH (the 10% sliver — USE THIS EXACT VARIANT) ━━━

**${humanTouch}**

This is the ONLY human thing visible on her. Everywhere else: full machine.

${sceneBlock}

${characterDNABlock(dna)}

(Note: for this ROBOT path, "skin tone" only applies to the SMALL HUMAN SLIVER above — the rest of her surface is built robot material. Hair, if not part of the human-touch variant, may be real hair OR replaced with sensor-arrays, cables, or a sculpted helmet.)

${framingBlock}

${HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 200)}

${SURREAL_EFFECTS_BLOCK}

Output ONLY the 60-90 word scene, comma-separated, no preamble, no quotes.`;
}

// Dev-side Sonnet call with retry on transient 429/529/5xx.
// (Keep the dev tool resilient to API pressure so iteration doesn't stall.
// Production retry+Haiku-fallback lives in _shared/llm.ts.)
const SONNET_RETRY_DELAYS_MS = [1000, 3000, 10000, 30000];
const SONNET_RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);

async function callSonnet(brief, maxTokens = 220) {
  let lastErr = '';
  for (let attempt = 0; attempt <= SONNET_RETRY_DELAYS_MS.length; attempt++) {
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
    if (res.ok) {
      const data = await res.json();
      return (data.content[0]?.text || '').trim().replace(/^["']|["']$/g, '');
    }
    lastErr = `${res.status}: ${(await res.text()).slice(0, 200)}`;
    if (!SONNET_RETRYABLE.has(res.status)) throw new Error('Sonnet ' + lastErr);
    if (attempt < SONNET_RETRY_DELAYS_MS.length) {
      console.log(`  ⏳ Sonnet ${res.status} — retry ${attempt + 1}/${SONNET_RETRY_DELAYS_MS.length + 1} in ${SONNET_RETRY_DELAYS_MS[attempt] / 1000}s`);
      await new Promise((r) => setTimeout(r, SONNET_RETRY_DELAYS_MS[attempt]));
    }
  }
  throw new Error('Sonnet exhausted retries — ' + lastErr);
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

  const MIXED_ORDER = ['closeup', 'full-body', 'seduction', 'cyborg_fashion', 'stare', 'robot'];
  for (let i = 1; i <= COUNT; i++) {
    const resolvedMode =
      MODE === 'mixed' ? MIXED_ORDER[(i - 1) % MIXED_ORDER.length] : MODE;
    const brief =
      resolvedMode === 'full-body'
        ? buildFullBodyBrief({ vibeDirective, vibeKey: VIBE })
        : resolvedMode === 'seduction'
          ? buildSeductionBrief({ vibeDirective, vibeKey: VIBE })
          : resolvedMode === 'cyborg_fashion'
            ? buildCyborgFashionBrief({ vibeDirective, vibeKey: VIBE })
            : resolvedMode === 'stare'
              ? buildStareBrief({ vibeDirective, vibeKey: VIBE })
              : resolvedMode === 'robot'
                ? buildRobotBrief({ vibeDirective, vibeKey: VIBE })
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
