#!/usr/bin/env node
/**
 * Generate a StarBot Rich Scene Seed pool using Sonnet.
 *
 * Each pool entry is a structured mini-storyboard (FG / MG / Far / Sky
 * + scale provers + material truth + emotional DNA) — see
 * STARBOT_SCENE_QUALITY_PLAYBOOK.md for the format and bar.
 *
 * Usage:
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50 --dry-run
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50
 *
 * The pool's aesthetic touchpoints + theme guidance are looked up from
 * the POOL_RECIPES table below. Output is written to
 * scripts/bots/starbot/seeds/<pool>.json.
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '50'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--dry-run]');
  process.exit(1);
}

// Per-pool recipe — what kind of scenes this pool authors + aesthetic
// touchpoints Sonnet should draw from. Same format the playbook uses.
const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // SPACE-FEMME PATH (2026-05-23 — new StarBot path)
  // Push-to-11 ornate female-figure poster art.
  // Anchored on Kevin's 15-heart female-explorer calibration.
  // ════════════════════════════════════════════════════════

  space_femme_render_style: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME RENDER STYLE — the overall VISUAL TREATMENT for a render. This axis exists to make every render look DIFFERENT — it is the #1 anti-homogeneity lever. Each entry 15-30 words: a complete, distinct rendering style (technique + color approach + finish). Each entry must be a DRAMATICALLY different look from the others.

⚠️ ALL styles stay VIVID, BOLD, FUN, and unmistakably SCI-FI — NEVER muted, washed-out, drab, or boring. The VARIETY is in the TECHNIQUE/treatment, not in the energy level. Keep neon/chrome/saturated energy available but don't make every style neon.

⭐ LEAN GRAPHIC / STYLIZED / ILLUSTRATIVE (Kevin's hearted favorites 2026-05-23: stained-glass mosaic, neon-sign wireframe, plasma-hologram projection, maximalist psychedelic fractal-pattern, bold flat-comic). Favor BOLD GRAPHIC + ABSTRACT + ILLUSTRATIVE art treatments — distinctive "cool art" looks. AVOID photoreal 3D-renders and plain photoreal digital-painting (those are the un-hearted ones). Still wildly varied — just within the bold-graphic family.

VARIETY MANDATE — invent ~20 wildly different BOLD-GRAPHIC vivid sci-fi treatments. Span across (don't limit to these):
  • Stained-glass mosaic — hard lead-line divisions, jewel-saturated backlit fills
  • Neon-sign wireframe — glowing tube-light outlines on deep black
  • Plasma-hologram projection — translucent layered color fields, interference bands
  • Maximalist psychedelic fractal-pattern — recursive kaleidoscopic shapes, rainbow
  • Bold flat-comic / cel-shaded ink, thick linework, saturated flat color
  • Hard-edged screenprint / risograph poster, limited punchy palette, halftone
  • High-contrast anime/manga cover ink, dynamic speedlines + cel color
  • Chrome-and-holographic vaporwave, iridescent pastel-neon, gridded glow
  • Bold retro-futurist flat poster, geometric shapes, vibrant blocked color
  • Luminous bioluminescent glow-art, dark field with neon-saturated subject
  • Art-nouveau / decorative line-art with ornate flowing borders, jewel color
  • Crisp vector-art poster, clean bold fills, dramatic spot-color
  • Holo-foil trading-card finish, prismatic shimmer, rainbow refraction
  • Woodcut / linocut block-print look, bold carved lines, vivid limited ink
  • Comic halftone / Ben-Day-dot pop-art, bold outlines, primary-saturated color
  • Geometric low-poly / faceted crystalline render, vivid flat facets
  • Graffiti / spray-stencil street-art treatment, bold electric color, drips
  • Punchy gouache pulp-cover, thick confident graphic strokes, electric palette
  • Lush detailed digital painting, glowing volumetrics, saturated cinematic grade

Each entry must:
• Name the rendering TECHNIQUE/medium-look (cel-shaded ink / 3D render / airbrush / screenprint / vector / gouache / holo-foil / etc.)
• Name the COLOR approach (saturated flat / prismatic gradient / limited punchy palette / iridescent neon / electric / etc.)
• Stay VIVID + FUN + SCI-FI`,
    touchpoints: [],
    instructions: `Each entry is ONE distinct vivid sci-fi render style, 15-30 words. Format: free-form prose naming technique + color + finish. Output as a NUMBERED list. Each must be a DRAMATICALLY different visual treatment from the others. STRICT BANS: nothing muted / drab / washed-out / boring / monochrome-dull. Stay vivid + bold + fun + sci-fi; vary the TECHNIQUE hard.

EXAMPLES (16 — bold GRAPHIC/illustrative looks, each different; NO photoreal 3D-render, NO plain photoreal digital-painting):
1. Stained-glass mosaic treatment, hard geometric lead-line divisions across the whole frame, jewel-saturated cobalt-amber-emerald fills, brilliant backlit glow, bold graphic finish.
2. Neon-sign wireframe illustration, glowing open-line tube-light forms on deep black, vivid single-hue color per zone, electric outlined sci-fi-poster finish.
3. Plasma-hologram projection look, translucent layered color fields, electric blue-violet-green interference bands, ghosted edge glow, futuristic projected finish.
4. Maximalist psychedelic fractal-pattern art packed edge-to-edge with recursive kaleidoscopic shapes, ultra-saturated cosmic rainbow palette, dense ornamental finish.
5. Glossy neon comic-book cover, bold cel-shaded inking with thick confident linework, saturated flat color blocks, high-gloss electric magenta-and-cyan finish.
6. Hard-edged screenprint / risograph poster, bold black outlines, limited 3-color punchy palette, visible halftone, flat blocked high-contrast finish.
7. High-contrast anime cover illustration, crisp cel-shaded color with dynamic speedlines, saturated complementary palette, glossy shonen sci-fi finish.
8. Chrome-and-holographic vaporwave, iridescent pastel-neon, gridded horizon glow, soft chromatic shimmer, dreamy synthwave-sci-fi finish.
9. Bold retro-futurist flat poster, geometric shapes and clean blocked color, vibrant orange-teal-purple palette, mid-century graphic finish.
10. Luminous bioluminescent glow-art, near-black field with the neon-saturated subject blazing from within, deep electric color, high-contrast glow finish.
11. Art-nouveau decorative line-art, ornate flowing whiplash borders framing the figure, jewel-saturated fills, gold-line graphic finish.
12. Crisp vector-art poster, clean bold fills with dramatic spot-color, sharp geometric edges, vivid two-tone-plus-accent finish.
13. Holo-foil trading-card finish, prismatic rainbow refraction across the surface, ultra-glossy, saturated jewel-tone shimmering premium-card look.
14. Woodcut / linocut block-print look, bold carved black lines, vivid limited-ink palette, high-contrast graphic relief finish.
15. Comic halftone Ben-Day-dot pop-art, bold outlines, primary-saturated color, retro print-dot sci-fi finish.
16. Geometric low-poly faceted treatment, vivid flat crystalline facets catching electric color, sharp angular graphic finish.`,
  },

  space_femme_subject_dna: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME SUBJECT DNA — the alien FACE + HEAD ONLY. Her body is fully sealed in a space suit; only her FACE shows through a clear / open / flip-up visor. So describe ONLY her head and face. Each entry 20-40 words.

⚠️ DESCRIBE ONLY THE FACE/HEAD — face-skin color+texture, eyes, head shape, head features (tendrils / horns / antennae / crests / ridges / pointed-ears / fin-ears), and facial markings/implants. DO NOT describe torso, chest, body, anatomy, hands, legs, or any below-the-neck skin — she is SEALED IN A SUIT, none of that is visible.

⚠️ WEIGHTED DISTRIBUTION (push ALIEN + WEIRD — the "crazy" path):
  • ~90% NON-BASELINE — genuinely WEIRD, never-before-seen alien FACES: head-tendrils / asymmetric horn-crowns / sweeping antennae / clustered or vertical-row eyes / compound or faceted eyes / iridescent or translucent or chitinous FACE skin / fin-frill ears / gill-slits at the jaw / bioluminescent face-markings / facial neural-bloom implants / a chrome cybernetic eye / unusual face colors + textures. Combine unexpectedly — invent strange new species.
  • FAVOR ASYMMETRY + ONE-OFF SURPRISES on the face — a SINGLE horn from one temple, ONE cybernetic eye, split two-tone face coloring, one oversized fin-ear, an off-center facial implant or scar. Asymmetry reads as "never seen before."
  • ~10% BASELINE-HUMAN FACE — exotic eye colors, ornate face markings, ritual facial scarification, gene-modded face coloring. NEVER plain.

⚠️ HARD MANDATES:
  • FACE + HEAD ONLY — no torso, body, anatomy, hands, legs, or below-the-neck skin.
  • Gender-locked FEMALE — "woman" or "she" must appear.
  • Stack 3+ FACE traits (face-skin + eyes + head-feature + marking).
  • Specific colors; NEVER cheesecake ("sultry" / "sensual" / "alluring" / "low-cut" / body language).

VARIETY MANDATE — distribute across (as FACES): Twi'lek head-tendrils (blue/teal/orange/yellow-green) / pointed-ear elven (ash-grey/moon-pale/ivory) / geometric-facial-tattooed alien (yellow-green/violet) / cybernetic chrome-implant face with one LED eye / bone-plate-ridged hunter brow / cat-slit-eyed mutant / scaled draconic jaw + slit eyes / compound or vertical-row insectoid eyes / bioluminescent-veined translucent face / antennaed face / horned crown / tribal-scarified shaved head.

Each entry must:
• Open with the species/category (first 3-6 words)
• Face SKIN color + texture
• Head FEATURE (tendrils / horns / antennae / ridges / pointed-ears / crest)
• EYE color/type (light catching it)
• ONE facial marking / scar / implant
• Use "she" or "woman"; FACE/HEAD ONLY`,
    touchpoints: [],
    instructions: `Each entry is ONE alien FACE/HEAD description, 20-40 words. Format: free-form prose. Output as a NUMBERED list. FACE + HEAD ONLY — no torso, body, anatomy, hands, legs, or below-the-neck skin (she is sealed in a space suit). STRICT BANS: no body/below-neck description; no cheesecake; no male pronouns; always "woman" or "she". Stack 3+ face traits (face-skin + eyes + head-feature + marking).

EXAMPLES (12 — FACE/HEAD only, weird + varied + asymmetric):
1. Vibrant blue-skinned Twi'lek-coded woman, twin curving head-tendrils, mint-glass green eyes with gold flecks, intricate black geometric tattoos mapping her cheekbones, a bio-monitor implant pulsing at one temple.
2. Ash-grey pointed-eared woman, smooth matte face, blood-red irises catching the light, tribal scarification across both cheekbones, a faint silver scar crossing one brow.
3. Cybernetic woman, one eye mint-glass green the other a chrome LED-array implant, subdermal circuit-tattoos tracing her jaw, neural ports glowing cyan at her temple, shaved on the chrome side.
4. Yellow-green-skinned woman, shaved head with black geometric monk-warrior tattoos, dragon-gold eyes igniting flame-orange, a silver bio-port glinting behind one ear.
5. Bioluminescent-veined translucent-skinned alien woman, glowing cobalt veins tracing her jaw, pure-cobalt eyes with no iris, faint white facial markings.
6. Bone-plate-ridged hunter-species woman, slate-blue stone-textured face, a pronounced orbital brow-ridge, storm-grey eyes, a SINGLE curved bone horn at one temple, a ritual scar across one cheek.
7. Scaled draconic-coded woman, mother-of-pearl scales along her jaw and brow, dragon-gold slit-pupil eyes, a small crest of fine spines above her brow.
8. Antennaed insectoid-evolved woman, smooth obsidian-black face, two slender segmented antennae rising in a wide V, four amber compound eyes in a vertical pair, faint bioluminescent cheek-markings.
9. Crystalline-faced alien woman, faceted opal-iridescent facial planes, pure-violet eyes with no iris, runic etchings carved across one cheekbone.
10. Fin-eared aquatic-evolved woman, turquoise-teal iridescent face, broad translucent fin-frills where ears would be, gill-slits at her jaw, large dark glossy eyes.
11. Cat-slit-eyed mutant woman, deep indigo-violet velvet-textured face, vertical-slit pupils in pale-gold irises, a split of bright magenta coloring across one half of her face.
12. Tribal-scarified woman, raw-sienna face, a shaved head ringed with deep ritual ladder-scars, amber eyes, an off-center chrome implant at her left jaw.`,
  },

  space_femme_outfit: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME OUTFITS — broad spectrum of poster-worthy female space-coded outfits with ornate detail. Each entry 25-45 words.

⚠️ SPACE-WORTHY MANDATE (hard rule, EVERY entry): the outfit must be FUNCTIONAL gear that keeps her alive in extreme space / hostile-alien environments — SEALED, with visible LIFE-SUPPORT (air lines, O2 / life-support pack, rebreather hoses, sealed seams, pressure collar), sealed gloves + boots, and HEAD GEAR (helmet / sealed faceplate / breathing mask / ventilator / respirator — often clear, dome, flip-up, or open-framed so her face still reads). Covered torso and limbs — a bit MORE covered than a bare bodysuit, but sleek / cool / stylish, NEVER frumpy or bulky-ugly. NO exposed skin that would die in vacuum, NO flimsy cloth, NO open robes that couldn't survive space.

⚠️ VARY HARD across SPACE-WORTHY CHARACTER ARCHETYPES — a DIFFERENT archetype + silhouette + color every entry. NEVER homogenous; bounty-hunter ≠ astronaut ≠ explorer ≠ diver. Distribute across:
  • ASTRONAUT / COSMONAUT — classic or retro-future sealed pressure suit, dome/bubble helmet, dorsal life-support pack, mag-boots
  • BOUNTY HUNTER — sealed armored suit, visored combat helmet, weapon rig, jet-pack, rugged sealed plating, trophies
  • EXPLORER / RANGER — sealed environment-suit under a rugged expedition coat/harness, rebreather + goggle-visor, survey gear
  • PILOT / ACE — sealed flightsuit with seam-piping, neural-link helmet with clear visor, chest life-support regulator
  • DEEP-SPACE DIVER — heavy sealed dive-style hardsuit, round porthole helmet, air hoses, weighted boots
  • EXO-TROOPER — powered exo-armor with hydraulics, sealed visored helmet, glowing energy seams
  • SCAVENGER / SMUGGLER — sealed mesh undersuit + rebreather mask under salvaged armor plates and a cropped sealed jacket
  • SEALED CEREMONIAL — ornate sealed hardsuit with pressure collar + clear faceplate (sparingly)
  • ROGUE / BOUNTY-HUNTRESS (helmet-free) — cool sci-fi jacket / armored harness / holsters / utility belt / gauntlets / boots, hair and face out, confident — NO helmet
  • HOODED / MASKED — a hood or cowl + a rebreather mask / ventilator / faceguard / wrapped scarf-mask, mysterious and cool
Make each a DISTINCT, CRAZY-STYLIZED, COOL, HOT character look — fun and gorgeous, NEVER clinical or drab. Vary form-fitting sleek suits, bulkier armored rigs, AND helmet-free rogue/hooded looks.

⚠️ HARD MANDATES (all buckets):
  • Functional, stylized sci-fi space-adventure gear. SUITED looks (astronaut/EVA/diver/trooper) are sealed with helmet/visor/mask + life-support; ROGUE/BOUNTY-HUNTRESS/EXPLORER/HOODED looks may skip the helmet (a mask / ventilator / goggles is a nice touch, not required).
  • VARY bulk, layers, color, silhouette, and headgear every entry — wildly different look each time. ~half helmeted, ~half helmet-free.
  • Covered enough to read COOL — NO bare midriff, NO exposed cleavage/thighs, NO near-naked bikini. Form-fitting + hot is great.
  • Specific colors + materials; 1+ poster-worthy stylized detail (energy seam / panel line / hardpoint / glowing accent).

Each entry must:
• Name the outfit TYPE + archetype (EVA hardsuit / exo-armor / bounty-huntress rig / hooded rogue / recon / pilot)
• Name materials + color
• Name the headgear IF it has one (helmet / visor / rebreather / hood+mask), or "no helmet, hair out" for rogue looks
• Add 1 cool stylized detail`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme COOL, STYLIZED sci-fi space-adventure outfit, 25-45 words. Output as a NUMBERED list. ~half are sealed suits WITH helmet/visor/mask + life-support (astronaut / EVA / diver / exo-trooper / pilot); ~half are helmet-FREE rogue / bounty-huntress / explorer / hooded-masked looks (cool jacket, harness, gear, hair out). VARY archetype + silhouette + color + headgear HARD — a different cool look every entry. STRICT BANS: bare-midriff / exposed cleavage or thighs / near-naked bikini / drab-frumpy. Hot, stylized, and cool — the outfit is the star.

EXAMPLES (16 — cool stylized looks; ~half helmeted suits, ~half helmet-free rogue/hooded):
1. Sleek white-and-copper EVA pressure-hardsuit, asymmetric chrome-piped panel lines, sealed pressure collar, dome helmet with soft-tint visor flipped up, compact O2 life-support pack glowing with status-lights at her lower back, mag-boots.
2. Bulky burnt-orange exploration pressure-suit, ribbed sealed joints, twin rebreather hoses running to a chest regulator, fishbowl dome helmet, heavy sealed gauntlets, expedition patches on the shoulder, glowing status-strip down one arm.
3. Powered cobalt exo-armor with visible hydraulic pistons at the joints, sealed segmented plate, spine-mounted life-support pack, sealed visored combat helmet with glowing cyan eye-slit, mag-lock boots, energy-seams pulsing along the limbs.
4. Sealed forest-green recon hardsuit under a rugged armored coat, rebreather half-mask with goggle-visor, sealed pressure collar, utility harness with tool-pouches, sealed gloves and boots, nav-cuff glowing at her wrist.
5. Matte-black segmented zero-g combat hardsuit, sealed seams, thruster-pod clusters on arms and hips, spine-mounted maneuvering + life-support pack, sealed grapple-gloves, dome helmet with mirrored visor, cyan panel-line seams.
6. Rugged rust-and-brass mining hardsuit, sealed reinforced torso, heavy rebreather mask with flip-down magnification loupes, sealed shoulder-guards, oxygen line coiling to a hip regulator, sealed gloves, weathered status-panels glowing amber.
7. Sealed ornate ivory ceremonial hardsuit over segmented chrome breastplate, gilded pressure collar, clear domed ceremonial faceplate revealing her face, celestial-etched plating, integrated life-support at the small of her back.
8. Deep-violet pilot pressure-suit with copper-bronze seam piping, sealed neural-link helmet with clear visor, chest-mounted life-support regulator, sealed gauntlets with wrist bio-monitor, mag-boots, status-lights glowing along the ribs.
9. Sleek teal scout hardsuit, sealed chrome pressure collar, slim rebreather mask over the lower face, compact dorsal O2 pack, sealed segmented gloves, multitool scanner glowing in her hand, panel-line seams tracing the torso.
10. Heavy lead-grey radiation hardsuit, thick sealed plating, massive shoulder guards with contamination sensors, sealed full-dome helmet with amber-tint visor, back-mounted life-support, sealed gauntlets glowing with readouts.
11. Rogue bounty-huntress in a cropped oxblood flight-jacket over a fitted charcoal flightsuit, bandolier and twin thigh-holsters, armored gauntlets and knee-high boots, chrome trim, hair loose — no helmet, confident and cool.
12. Hooded scavenger-rogue in a deep-teal cowl over a fitted sealed underlayer, a chrome rebreather mask over her nose and mouth with glowing filter-lights, utility harness with tool-pouches, fingerless gauntlets, weathered cloak.
13. Helmet-free explorer in a rugged amber expedition coat over a fitted recon suit, goggle-visor pushed up on her brow, a bandolier of sample-vials, sealed gloves and boots, nav-cuff glowing, hair windblown, face out.
14. Sleek magenta-and-chrome bounty-huntress bodysuit with armored shoulder and hip plates, holstered pulse-pistols, a slim ventilator over the lower face, fingerless gloves, energy-seams glowing down the legs, no helmet.
15. Hooded ranger in a graphite layered cloak over segmented light-armor, a faceguard mask with a single glowing optic, utility belt, armored boots, a glowing energy-bow across her back, mysterious silhouette.
16. White-grey arctic recon hardsuit, sealed thermal-gel joints, sealed dome helmet with heated visor, dorsal life-support pack, forearm ice-piton launchers, sealed insulated gloves and boots, soft-orange joint glow.`,
  },

  space_femme_action_poster: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME POSTER ACTION — mid-verb cinematic poster poses for the female-figure. Each entry 25-40 words.

A MIX of dynamic ACTION poses AND sassy GLAMOUR poses — fun and varied, always with confident attitude.

⚠️ MANDATES:
  • Pose reads as a confident, frame-worthy POSTER moment — dynamic OR sassy, always strong body language with attitude
  • Mix combat-action, exploration-action, AND relaxed sassy posing (crouching, sitting, leaning, perching)
  • Even seated/leaning poses are CONFIDENT and posed with attitude — never limp, slumped, sad, or lifeless

VARIETY MANDATE — mix HEAVILY across BOTH groups:
  ACTION:
  • Heroic low-angle stand with weapon visible
  • Mid-leap / vaulting between rock formations
  • Crouched-braced with rifle on cover
  • Climbing / vaulting through canopy or ridge
  • Mid-firing weapon (muzzle flash + recoil)
  • Mid-scanning at alien artifact / glowing object
  • Mid-incantation / channeling / ritual gesture
  • Walking-into-portal / mid-emergence from cave mouth
  • Mid-defiance stare-down at distant threat
  SASSY / GLAMOUR (mix these in heavily — the fun ones):
  • Crouched low holding a big gun, barrel resting on her shoulder or pointed back over her shoulder toward the camera
  • Sitting on a rock / ledge / crate with legs crossed, weapon across her lap, glancing at the camera
  • Leaning back against a boulder / console / her parked ship, one hip cocked, confident smirk
  • Over-the-shoulder glance back at the camera, gun resting on her shoulder
  • Perched on a high ledge, one leg dangling, weapon loose in hand
  • Kneeling on one knee, gun planted barrel-down, looking off-frame
  • Reclining against her gear / a fallen pillar, relaxed and confident
  • Crouched and looking back over her shoulder, pistol pointed off-camera
  • Standing with weapon slung, hand on cocked hip, sassy attitude

Each entry must:
• Specify body language (stance / hip / shoulder / where she's looking / what she holds)
• Specify what she's interacting with (weapon / prop / artifact / her ship / horizon)
• Read as confident with attitude — action OR sassy posing`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme pose, 25-40 words. Format: free-form prose. Output as a NUMBERED list. Mix ACTION poses AND sassy GLAMOUR poses (crouching/sitting/leaning/perching/posing-toward-camera are all GREAT). STRICT BANS: NO limp / slumped / sad / lifeless / fully-passive. Always confident body language with attitude, readable in 2 seconds. Aim ~50/50 action vs sassy-glamour across the set.

EXAMPLES (22 — mix of action + sassy glamour):
1. Crouched low-angle braced behind a corroded bronze railing, rifle aimed downrange, hand raised in cease-fire signal, intricate gauntlet glowing with bio-monitor readout, her free knee on the floor steadying the long shot.
2. Mid-scanning at a floating alien artifact, scanner extended in her outstretched gauntleted hand, deep teal light from the artifact catching the curve of her cheekbone, her other hand resting on her holstered sidearm.
3. Heroic low-angle stand on a basalt outcrop, compact plasma carbine slung across her chest, free hand raised palm-out in a salute or vow gesture, cape billowing behind her in the electric wind.
4. Mid-leap between two rock formations, both feet airborne, rifle in one hand at low-ready, free arm extended for balance, eyes locked on the landing point, body angled mid-flight.
5. Climbing through bioluminescent kelp cathedral, one hand gripping a kelp trunk, multitool scanner glowing in the other, neural-port at her temple pulsing cyan, body braced in vertical reconnaissance stance.
6. Crouched behind acid-resistant ferns, telescope pressed to her eye scanning a distant facility across a sulfuric lake, free hand braced on the ground, observation log glowing soft blue on her biometric scanner cuff.
7. Mid-incantation gesture with both hands raised, palms outward channeling violet ritual energy, head tilted back, ceremonial mask hovering above her brow, ornate sash whipping in the cosmic wind.
8. Mid-extraction from a hovering pickup craft, one boot planted on the extended ramp, the other foot leaving the ground, sealed helmet catching the sulfurous yellow light, retractable grapple-cable humming at her forearm.
9. Walking through a trans-cyan magical-portal disc, one boot already on the other side, her body bisected mid-traversal, free hand still gripping her staff on this side, cape billowing through the rift.
10. Examining a glowing alien specimen suspended in a shimmering containment field, scanner deployed in her outstretched hand, predatory curiosity reading on her face, tethered native creature visible in midground.
11. Mid-defiance stare-down at a distant kaiju silhouette across the horizon, weapon lowered but ready at her side, free hand clenched into a fist, cape whipping behind her, fel-violet sidelight catching her stare.
12. Crouched at the edge of a cliff scanning the valley below through a wrist-mounted optic, free hand braced on the rim, body coiled low and motionless, observation log glowing soft blue at her wrist.
13. Mid-deploy of a wrist-mounted grapple-launcher, cable humming as it shoots up toward an overhead beam, her body coiled to be pulled airborne in the next second, free hand braced on her thigh.
14. Mid-fire of a compact plasma carbine, muzzle-flash trans-orange burst freezing her recoil step backward, neural-link gauntlet glowing at her fingertips, sealed helmet visor catching the flash.
15. Mid-emergence from the mouth of a glowing cave-portal, one foot still in shadow the other in the light, weapon at low-ready, eyes adjusting, body silhouetted against the cool-cyan glow.
16. Mid-salute on a ceremonial dais, fist over her heart, cape trailing past her boots, ceremonial blade in her free hand pointed downward to the ground, ornate sash catching gilded ceremonial light.
17. Crouched low on a rocky outcrop, a big plasma rifle resting back over her shoulder with the barrel angled toward the camera, free hand braced on her knee, glancing back with a confident smirk.
18. Sitting on a weathered supply crate with her legs crossed, a compact carbine laid across her lap, one elbow on her knee, chin tilted, looking straight at the camera with sassy attitude.
19. Leaning back against her parked one-seater spacecraft, hip cocked, ankles crossed, ray-pistol loose in one hand, the other resting on the hull, casual and confident.
20. Glancing back over her shoulder at the camera, a glowing energy blade resting on her shoulder, weight on one hip, body turned three-quarters away into the neon vista.
21. Perched on the lip of a high ledge with one leg dangling, an ion-rifle balanced across her thighs, leaning back on one braced arm, surveying the alien valley below.
22. Kneeling on one knee with a heavy rail-pistol planted barrel-down like a sword, both hands resting on the grip, looking off-frame toward an unseen threat, cape pooling behind her.`,
  },

  space_femme_biome: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME BIOME — surreal, weird, never-before-seen alien environments serving as the painted stage for the poster composition. Each entry 25-45 words. Go FAR-OUT and dreamlike — invent strange impossible worlds nobody has seen: gravity-defying formations, living architecture, impossible color, alien physics. Strange but coherent and striking.

VARIETY MANDATE — distribute across:
  • Bioluminescent kelp forest cathedral (cathedral-pillar trunks)
  • Suspended volcanic boulders with electrical coronas
  • Acid lake archipelago with dissolving stone islands
  • Sulfur-haze chlorine coastline / frozen chlorine shelf
  • Lava-vent thermophile gardens (orange / white / green thermophiles)
  • Bioluminescent tide pools carved in black volcanic glass
  • Crystalline ice cathedral cave with refracted light
  • Hexagonal basalt columns with glowing alien artifact
  • Methane sea with rust islands rising through teal algae
  • Underwater alien temple half-submerged
  • Nebula-cloud sky planet with floating-isle landmasses
  • Glass-storm cathedral (storm of glass shards mid-flight)
  • Liquid mercury lake with mirror reflections
  • Deep canyon with painted aurora ceiling overhead
  • Toxic chlorine-jungle with bioluminescent flora
  • Frozen alien geyser field with crystal spires
  • Mining drilling platform churning through asteroid debris
  • Crystalline horned alien creature's grazing field
  • Salt arches spanning three hundred meters in pink mineral layers
  • Ringworld atmospheric friction zone (low-orbit perspective)

Each entry must:
• Establish the BIOME identity in first 5-8 words
• Specify multi-tier depth (foreground tactile + midground biome + deep-distance horizon)
• Include at least 2 specific environmental details
• Specify ATMOSPHERIC quality (haze / fog / dust / vapor / electric crackle)
• NEVER name a specific real-world Earth location`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme biome, 25-45 words. Format: free-form prose. Output as a NUMBERED list. STRICT BANS: NO Earth real-world locations; NO generic surface; always EXOTIC + PERILOUS + multi-tier depth.

EXAMPLES (12):
1. Bioluminescent kelp forest cathedral on a deep-ocean alien world, kelp trunks scaling from two meters to cathedral pillars receding into blue distance, forest pulsing coordinated cobalt bioluminescence, seafloor vents streaming teal-and-orange cinematic light.
2. Suspended volcanic basalt boulders twenty to forty meters overhead, blue electrical coronas sparking between levitated stones, scorched basalt foreground fragments littering the ground, distant alien ridge visible through electric haze.
3. Acid lake archipelago of dissolving stone islands rising from pH 0.5 sulfuric water, towering organic formations along the far shore, dissolving stone bridges connecting the closer islands, acid fog drifting between foreground and archipelago.
4. Frozen chlorine coastline with yellow-green translucent ice shelves, pressure cracks revealing liquid chlorine pools beneath, alien beings in single file across the ice in the mid-distance, amber dust streaming horizontally through frigid air.
5. Lava-vent thermophile gardens of orange white and green organisms rising in stacked colonies, sampling station on cooled lava flow in the midground, heat-shimmer and steam plumes catching warm-copper light, Milky Way arch above sulfur-yellow haze.
6. Crystalline ice cathedral cave with translucent walls refracting cool-cyan and trans-violet light, jagged ice-spires rising from the cavern floor, painted aurora visible through a crack in the ceiling far overhead.
7. Methane sea stretching to a deep horizon, rust-red islands rising through teal algae blooms, orange emergency platform lights, sulfuric yellow fog clinging to the water surface, purple plasma lightning arcing overhead.
8. Nebula-cloud sky planet with floating-isle landmasses tethered together by chain-bridges, painted nebula filling the entire upper-frame in trans-magenta and trans-cyan, cathedral-pillar mountains rising from the sea of clouds.
9. Glass-storm cathedral with a frozen-mid-flight blizzard of trans-glass shards suspended throughout the cavern, painted-light refracting through every facet, alien obsidian columns rising in receding perspective.
10. Liquid mercury lake reflecting twin moons overhead, mirror-glass surface broken by ripples around her boots, distant binary stars on the horizon, painted indigo-and-gold atmospheric haze.
11. Toxic chlorine-jungle with bioluminescent trans-green flora rising in dense canopy columns, scattered trans-cyan glowing residue plates at stem joints, painted yellow-green air thick with spores.
12. Frontier outpost on the rim of a volcanic crater, towering plumes of trans-orange and ember light rising from the caldera, scattered alien research domes in the midground, painted Bonestell sun-amber backlight.`,
  },

  space_femme_background_drama: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME BACKGROUND DRAMA — always-on secondary mid/deep-distance focal point that the eye drifts to after landing on the femme. Each entry 20-40 words.

VARIETY MANDATE — distribute across:
  • Alien fleet of dozens-of-warships looming on the horizon
  • Leviathan / colossal alien creature rising from sea or sky
  • Orbital ring station hanging in the upper sky
  • Dimensional rift opening / wormhole entry
  • Colossal alien statue / monolith on the deep horizon
  • Kaiju silhouette emerging from clouds
  • Descending transport ship breaking atmosphere
  • Distant snipers / armored patrol unaware in mid-distance
  • Massive Saturn-like planet with ring-shadow overhead
  • Ringworld curve visible through atmospheric friction zone
  • Floating obelisk emerging from the clouds
  • Crystalline bioluminescent alien creature towering nearby
  • Distant orbital strike laser carving down through cloud-deck
  • Multi-mooned night sky with twin moons through haze
  • Black hole accretion disc on the horizon
  • Phantom space-station drifting partially submerged in a planet's atmosphere
  • Mega-walker mecha silhouette on the distant ridge
  • Bridge of approaching airship visible in the midground
  • Sun-disc burning binary-eclipse corona overhead
  • Distant volcanic eruption painting the horizon

Each entry must:
• Establish the drama element + position (mid-distance / deep distance / overhead)
• Specify SCALE relative to the femme (always dwarfing)
• Specify visual quality (silhouetted / glowing / partially-veiled / etc.)
• NEVER eclipse the femme — always SECONDARY focal point`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme background drama, 20-40 words. Format: free-form prose. Output as a NUMBERED list. STRICT BANS: NEVER eclipse the femme; ALWAYS secondary focal point at mid/deep distance.

EXAMPLES (10):
1. Alien fleet of dozens-of-warships looming on the deep horizon in trans-blue silhouette, their running lights pulsing in coordinated formation, atmospheric haze making them ghostly behind the sulfur-yellow sky.
2. Colossal leviathan creature rising from the methane sea in the deep distance, its skin glowing trans-magenta along bioluminescent ridges, scale-of-the-leviathan dwarfing the alien research domes near its base.
3. Orbital ring station hanging in the upper sky overhead, running-lights pulsing in trans-blue and trans-amber strips along the rim, scale prover ships glinting near its docking ports.
4. Dimensional rift opening in the deep-distance, vertical trans-cyan + trans-magenta jagged-edge cone tearing through reality, starfield bending toward the rift mouth, alien debris drifting toward it.
5. Colossal weathered alien statue looming on the deep horizon, partially veiled in dust-haze, its head taller than the surrounding mountains, geometric runes carved into its surface barely legible from this distance.
6. Kaiju silhouette emerging from cloud-deck on the deep horizon, its head and forelimbs visible above the cloud-line, lit from beneath by city-light, scale-prover skyline buildings tiny near its feet.
7. Descending transport ship breaking atmosphere in the midground, retro-rockets firing trans-orange flame elements, ash drift through hyperspace-streaked violet star-lines following its trajectory.
8. Massive Saturn-like planet hanging low with ring-shadow casting a band across the sky, the rings catching scattered cosmic ice catching sunlight, binary moons through particulate haze.
9. Mega-walker mecha silhouette on the distant ridge, its head and shoulders visible above the ridge-line, mid-stride frozen by the painted-light moment, scale-prover ridge-buildings tiny near its feet.
10. Distant volcanic eruption painting the horizon in trans-orange and ember-light, the eruption plume rising into the cloud-deck, scale-prover surface features tiny near its base, ash drift visible mid-distance.`,
  },

  space_femme_prop: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME ACCESSORIES — ornate stacked accessories the femme carries, holds, or wears. Each entry 12-25 words.

⚠️ Picked TWO PER RENDER (pickN:2), so each entry must be SMALL enough to coexist with another.

VARIETY MANDATE — distribute across:
  • Bio-monitor cuff pulsing soft cyan / violet
  • Nav-compass on chrome chain at her sternum
  • Glowing alien artifact in her free C-grip hand
  • Ritual mask hanging from belt or held in her free hand
  • Ceremonial blade in chrome scabbard across her back
  • Drone-companion floating at her shoulder
  • Familiar creature on her shoulder (alien bird / lizard / small mammal)
  • Multitool scanner clipped to her thigh
  • Holographic projector orb hovering above her wrist
  • Cargo / specimen-container slung from her belt
  • Energy-orb captured in trans-clear vial at her hip
  • Pulse-pistol holstered at her thigh
  • Ammo bandolier across her chest
  • Holo-map projection floating above her gauntlet
  • Photo-locket on a chain (chrome-metal photo of family)
  • Talisman / amulet glowing on a chain
  • Tribal beads woven into her hair with chrome charms
  • Tactical visor flipped up onto her brow
  • Specimen jar floating beside her on a hover-disc
  • Spirit-stone bound to her wrist with chrome wire
  FUN SCI-FI GADGETS (lean into these — tilt the sci-fi harder):
  • Cool ray-gun / blaster pistol / plasma sidearm with a glowing barrel
  • Jetpack / thruster-pack with chrome nozzles on her back
  • Hoverboard / grav-board hovering under her boots
  • Cute spherical droid / robot sidekick hovering at her side
  • Glowing energy blade / plasma sword hilt clipped at her hip
  • Holographic pet / shimmering holo-creature at her shoulder
  • Floating sentry-orb / shield-drone with a glowing optical eye
  • Grappling gauntlet with a glowing energy-hook
  • Retro fishbowl space-helmet held under one arm
  • Wrist-mounted holo-display projecting a glowing UI

Each entry must:
• Open with the accessory type in first 3-6 words
• Specify color/material (chrome / brass / trans-violet / etc.)
• Specify how she's wearing/holding it`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme accessory, 12-25 words. Format: free-form prose. Output as a NUMBERED list. STRICT BANS: NO real-world brand names; small detail props only (coexist with another accessory in the same render). Mix ornate detail props AND fun sci-fi gadgets (ray-guns / jetpacks / droids / energy blades / hoverboards / holo-gear).

EXAMPLES (20):
1. Bio-monitor cuff pulsing soft violet on her inner wrist, chrome bracelet with embedded LED readouts.
2. Nav-compass on a chrome chain at her sternum, brushed-steel needle visible through a small crystal cover.
3. Glowing trans-purple alien artifact in her free C-grip hand, faint magenta light radiating around the contact-point.
4. Ritual mask hanging from her chrome belt-loop, carved alien-bone with embedded trans-cyan crystal eye-slits.
5. Ceremonial blade in a chrome scabbard slung across her back, gilded hilt catching painted backlight.
6. Drone-companion floating at her shoulder, small chrome orb with a single trans-yellow optical sensor.
7. Multitool scanner clipped to her thigh, polished chrome surface reflecting the painted backlight.
8. Holographic projector orb hovering above her wrist, projecting a 3D star-chart in soft trans-cyan.
9. Specimen-container clipped to her utility belt, trans-clear cylinder containing a glowing alien biological.
10. Glowing-barrel ray-gun blaster holstered at her thigh, chrome body with a trans-cyan energy chamber pulsing along the slide.
11. Ammo bandolier across her chest with brass cartridges, each cartridge tip glowing soft amber.
12. Photo-locket on a chrome chain at her throat, the locket open showing a tiny family portrait.
13. Chrome jetpack with twin thruster-nozzles on her back, soft trans-blue pilot-flame idling at the vents.
14. Cute spherical droid sidekick hovering at her shoulder, glossy white shell with a single big trans-cyan optical eye.
15. Glowing plasma-blade hilt clipped at her hip, a short trans-magenta energy edge humming from the chrome grip.
16. Hoverboard hovering under her boots, sleek neon-trimmed grav-board with glowing repulsor-vents.
17. Holographic holo-pet shimmering at her shoulder, a translucent trans-cyan alien creature flickering in projected light.
18. Falcon-coded alien bird perched on her shoulder, its plumage iridescent green-cyan, claws gripping her armored shoulder-plate.
19. Wrist-mounted holo-display projecting a glowing trans-cyan UI panel above her gauntlet.
20. Spirit-stone bound to her wrist with chrome wire, the stone a polished trans-violet sphere glowing softly.`,
  },

  space_femme_camera_poster: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME POSTER FRAMING — DYNAMIC, IMMERSIVE camera angles where the camera is IN the scene with her and the strange environment wraps around her. Each entry 15-30 words.

⚠️ FAVOR HEAVILY (these are the standout frames): low dramatic angles looking up at her, over-the-shoulder twists looking back toward the camera, crouched/coiled figures shot from low and close, the camera tucked into the environment (between rocks / through debris / down a canyon) so foreground elements frame her and depth tiers stack behind. The figure is large and dominant AND embedded in a richly detailed world — not a flat centered front view, not a plain standing hero shot floating in empty space.

VARIETY MANDATE — distribute across (lean toward the dynamic/immersive ones):
  • Low-angle close on a crouched/coiled figure, camera near the ground looking up and in
  • Over-the-shoulder twist — she looks back toward camera, weapon leveled off-frame
  • Camera tucked between foreground rocks / debris / pillars framing her mid-frame
  • Dutch-tilt on a vaulting / climbing / leaping figure
  • Three-quarter back-view over her shoulder at a distant threat
  • Ground-level looking up past her boots / planted weapon to her face
  • Down-canyon depth-stack — foreground debris, her mid-ground, drama deep behind
  • Through an archway / portal / opening framing her in the gap
  • Reflected / refracted in a strange surface (mercury / crystal / visor)
  • Wide low-angle on a ledge with a planet or kaiju rising behind her
  • Heroic low-angle stand (use sparingly — only when the pose is a stand)
  • Side-on with cape / hair sweeping into the frame

Each entry must:
• Specify CAMERA POSITION (height / angle / distance — favor LOW and CLOSE)
• Specify her POSITION within the frame
• Specify the FOREGROUND framing element + what FILLS the depth behind (biome / drama)`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme DYNAMIC camera framing, 15-30 words. Format: free-form prose. Output as a NUMBERED list. FAVOR low/close/over-shoulder/immersive angles with foreground framing + depth stacking. STRICT BANS: NO centered-front-facing portrait, NO plain standing-hero-in-empty-space (Flux defaults — fight them).

EXAMPLES (12):
1. Heroic low-angle stand with the camera at her boots looking up past her body to her face against the painted nebula sky, her silhouette dominating the upper two-thirds of the frame.
2. Silhouette against an alien-vista backdrop, her body in dark contrast against a trans-magenta nebula horizon, deep-distance ringworld curve visible behind her.
3. Three-quarter back-view over her shoulder at a distant kaiju silhouette, her free hand resting on her holstered sidearm, sealed helmet catching faint rim-glow.
4. Framed through an archway of crystalline ice, her body centered in the archway opening, deep-distance biome visible past her, painted aurora overhead.
5. Dutch-tilt climbing through bioluminescent kelp canopy, her body angled diagonally across the frame as she pulls up a vertical kelp-trunk, biome receding behind her.
6. Mirrored-reflection in a liquid mercury lake, her standing figure in the upper-frame reflected perfectly in the mirror-glass below, twin moons visible in both.
7. Crouched on a rocky outcrop overlooking a deep alien landscape, the camera at mid-distance behind her catching her three-quarter back, the landscape sprawling to the deep horizon.
8. Side-profile silhouette against twin-moon horizon, her body in pure silhouette walking right-to-left across the frame, painted moon-light catching her contour.
9. Reflected in her sealed-helmet visor — the camera catches her face inside the helmet plus the reflection of the alien horizon on the curved visor glass.
10. Over-shoulder past her hair at the dramatic horizon — distant alien fleet visible across her shoulder, painted sky filling the upper-frame.
11. Wide low-angle on a cliff edge, her body standing on the rim with the planet rising behind her, the cliff dropping into deep painted depth.
12. Side-on with cape billowing into the frame, her body in profile mid-stride, the cape sweeping back into the wind, deep-distance biome visible past her.`,
  },

  space_femme_phenomenon: {
    format: 'simple',
    theme: `STARBOT SPACE-FEMME COSMIC PHENOMENON — environmental drama events that fire on 70% of renders. Each entry 20-40 words.

⚠️ Decoupled from biome and background_drama — independent roll for an environmental EVENT.

VARIETY MANDATE — distribute across:
  • Supernova flash on the horizon
  • Aurora-cyclone overhead curtains
  • Falling-stars streaking diagonally
  • Dimensional-tear / rift opening
  • Dragon-fire-in-cosmos (cosmic conflagration)
  • Black-hole event-horizon-pull warping the sky
  • Solar-flare arcing over the deep horizon
  • Nebula-bloom expanding in real-time
  • Meteor shower hammering the deep landscape
  • Lightning-storm of trans-violet bolts arcing across the sky
  • Hyperspace-streaked star-lines (ship in transit nearby)
  • Glowing ion-storm ripping through the atmosphere
  • Painted aurora over polar zone in trans-green and trans-magenta curtains
  • Phosphorescent-fog drifting in glowing-supernatural haze
  • Acid-rain shimmer with bright-amber droplets catching painted-light
  • Ring-shadow eclipse passing across the planet
  • Cosmic-dust-cloud particulate streaming horizontally
  • Time-dilation lensing distortion warping the horizon
  • Magnetic-storm visualized by lightning between distant peaks
  • Plasma-pillar erupting from the planet's surface in the mid-distance

Each entry must:
• Name the phenomenon in first 4-6 words
• Specify VISUAL IMPACT (color cast / motion / focal-point shift)
• NEVER override lighting axis directly`,
    touchpoints: [],
    instructions: `Each entry is ONE space-femme cosmic phenomenon, 20-40 words. Format: free-form prose. Output as a NUMBERED list. STRICT BANS: NO direct lighting-color overrides (those belong to template-baked lighting).

EXAMPLES (10):
1. Supernova flash burning on the horizon, blinding-white burst with trans-yellow + trans-orange shockwave ring expanding across the deep distance, painted-light blowback hitting her armor.
2. Aurora-cyclone overhead curtains spiraling in trans-green and trans-magenta, the painted-light curtain swirling in a slow rotation overhead, casting otherworldly green glow on her shoulder.
3. Falling-stars streaking diagonally across the painted upper-frame, multiple trans-yellow + trans-white bar-element streaks each with a bright impact-head trailing soft particles.
4. Dimensional-tear / rift opening in the mid-distance, vertical trans-cyan and trans-magenta jagged-edge cone tearing through reality with starfield bending toward its mouth.
5. Black-hole event-horizon-pull warping the deep horizon, circular trans-black disc with a glowing trans-blue accretion ring around the edges, distorting the starfield around it.
6. Hyperspace-streaked star-lines streaming across the upper-frame as a ship transits nearby at FTL, the stars elongated into trans-cyan painted streaks.
7. Glowing ion-storm ripping through the atmosphere, trans-cyan electric arcs visibly cracking the air, micro-discharge ionizing around her silhouette.
8. Painted aurora over polar zone in trans-green and trans-magenta curtains undulating slowly overhead, casting unearthly painted-light on her armor and the foreground biome.
9. Ring-shadow eclipse passing across the planet, the rings' shadow visible as a band of darkness sweeping across the deep horizon, her foreground catching the edge.
10. Plasma-pillar erupting from the planet's surface in the mid-distance, vertical trans-orange and trans-cyan column rising from the horizon into the upper-atmosphere.`,
  },

  alien_cities: {
    theme:
      'vast alien CITY scenes — multi-tier megacity density, planet-scale ecumenopolis, layered urban verticality, atmospheric depth. NOT a single hero building — DENSE cities with hundreds of supporting structures.',
    touchpoints: [
      'Coruscant (planet-city stacked levels)',
      'Blade Runner 2049 megaholograms + fog layers',
      'Akira Neo-Tokyo vertical density + neon signage',
      'Trantor (Foundation series ecumenopolis)',
      'Pacific Rim Hong Kong (mile-tall walls of stacked stores/homes)',
      'Warhammer 40K Hive City underhive vertical density',
      'Cloud City silhouettes',
      'Mass Effect Citadel arms (curved megastructure)',
      'Sparth concept art density studies',
      'Syd Mead retrofuture density',
      'Akihabara at peak crowd-and-signage',
      'Hong Kong Kowloon Walled City density',
    ],
    instructions: `Each city must feel like a CIVILIZATION, not a single building. The MG layer is where this is proven — name DOZENS of supporting structures, hundreds of windows, multi-elevation skybridges, tiny ships threading the gaps. The Hero anchor is dominant but never alone.`,
  },
  alien_landscapes: {
    theme:
      'alien planetary surfaces — distinctive biomes with strong geological / biological / atmospheric identity. NOT generic "alien planet" — each is a specific ecology.',
    touchpoints: [
      'Dune Arrakis (twin suns, biblical desert scale)',
      'Solaris ocean (sentient world)',
      'Nausicaä toxic jungle',
      'Annihilation Shimmer (color-shifted refracted nature)',
      'Avatar Pandora (bioluminescent verticality)',
      'Beksinski painted dread landscapes',
      'Brian Despain alien-flora paintings',
      'Roadside Picnic Zone (broken physics)',
    ],
    instructions: `Each landscape must read as a specific ecology — biology, geology, atmosphere coherent. MG layer: biology / formations / weather. Scene must include EITHER a sentient figure (1-2% frame, midground-back silhouette) OR an alien creature native to this world.`,
  },
  sleek_female_explorer_outfits: {
    format: 'simple',
    theme: `STARBOT FEMALE-EXPLORER SLEEK OUTFIT POOL — pure outfit + gear + helmet/visor + tech descriptions. Each entry: 50-80 words. The aesthetic is FORM-FIT EVA pressure-suit explorers — sleek silhouettes, sealed helmets with glowing visor optics, engineered tech cascading off the suit, alien beauty revealed through cracked faceplates or open visor slits. She is capable, mysterious, and unmistakably herself — her outfit reads sexy through silhouette + competence + tech-mystery, not through skin exposure.

This pool fills the \`wearing \${outfit}\` slot in the FEMALE_EXPLORER brief template. Scene, action, and lighting come from other axes — entries here describe ONLY what she is WEARING, CARRYING, and how her helmet/face sits.

EVERY ENTRY WEAVES TOGETHER:
• FORM-FIT PRESSURE SUIT BASE — sleek pressure suit / EVA / tactical bodysuit / power-armor in a specific color (burnished steel / matte black / midnight-blue with electric-blue circuit lines / pearl-white / oxblood / olive-drab / charcoal / chrome / bronze / rust-orange / cobalt / etc.)
• PLATE + ARMOR DETAIL — segmented plates / ceramic shoulder guards / chrome chest plate reflecting light / hydraulic exoskeleton with exposed pistons / brass-trim panels / fitted modular plates at shoulders, forearms, thighs
• HELMET + VISOR STATUS — sealed bubble helm / amber HUD visor with reticle overlay / gold mirror visor / cracked faceplate revealing pale skin and platinum hair / mag-locked at hip / pushed up on brow / faceplate half-raised showing eyes
• 2-4 ENGINEERED TECH PIECES — life-support backpack venting silver mist / retractable grapple-launcher humming at the forearm / wrist-mounted scanner or welding torch or rangefinder / mag-boots / chest-mounted sensor pod / battery-pack pulsing soft amber / cryogenic vapor lines bleeding frost / jetpack venting cryogenic white exhaust / breath-regulator collar releasing filtered mist
• GLOWING ACCENT — electric-blue circuit lines tracing limbs and spine / fel-violet rim glow / ion-blue accent at belt buckle / plasma-cyan key wash / amber HUD reflection / soft cyan implant glow at the temple
• ONE IDENTITY MARKER REVEALED THROUGH THE FACEPLATE OR HELMET CRACK — intricate geometric facial tattoos / cybernetic eye glow / ceremonial clan markings / brand-plate at the temple / chrome twist-braids pressed against helmet padding / brass sigil engraving on the chestplate / a single ritual scar across one cheek

She/her pronouns. Capable mid-action register: the suit fits like skin, the tech is functional, the helmet either seals her in mystery or cracks just enough to reveal alien beauty.

The CONTENT lives in the suit fit, the engineered tech, the helmet/visor state, and the identity marker revealed through it. Each entry should feel like a complete capable sci-fi explorer kit — distinct silhouette, distinct color, distinct tech configuration, distinct identity tell.

VARIETY across the pool: spread colors widely, vary helmet status (sealed / cracked / mag-locked / pushed up), vary silhouette (slim form-fit / bulky power-armor / hooded / segmented), vary identity marker family (markings / cyber-implant / clan-tattoo / brand-plate / scar / engraving).`,
    touchpoints: [
      "Form-fit burnished-steel segmented pressure suit, EVA helmet with red visor-slit and bronze trim, cracked faceplate revealing platinum hair, jetpack venting cryogenic white exhaust, retractable grapple-launcher humming at forearm, plasma-cutter holstered at thigh, biometric scanner glove glowing on right hand.",
      "Form-fit charcoal pressure suit and bubble helmet with breathing apparatus, dragon-fire-orange rope-braid down the spine with steel-ring bindings, scientific sample-case in both arms, sample-cylinders labeled with coordinates racked at hip, mag-boots with reinforced toe-caps.",
      "Matte-black form-fit pressure suit with segmented armor plates across shoulders and spine, sealed helmet with breathing apparatus and half-raised visor, wrist-mounted grapple-launcher, breath-regulator collar releasing filtered green mist, bandolier buckle at one side beneath the exo-rig, scoped rifle slung.",
      "Rust-orange form-fit pressure suit with brass moisture-recycler tubes coiling across shoulders and spine, sealed bubble helmet with gold mirror visor, life-support backpack venting silver mist through scrubber ports, wrist-mounted spectrometer glowing amber, mag-boots with crampons folded.",
      "Midnight-blue form-fit pressure suit with pearl-white ceramic shoulder guards, enclosed helmet with amber HUD visor displaying overlay grid, retractable grapple-launcher humming at right wrist, oxygen tank venting white vapor through spine-mounted ports, ice-axe mag-locked at hip, ritual clan tattoos visible through faceplate.",
      "Matte-black tactical bodysuit with curved chrome chest plate, sealed helmet with breathing apparatus hissing at neck seal, forearm stabilization jets puffing white vapor, wrist-mounted rangefinder glowing soft amber, segmented armor plates across spine and shoulders, close-cropped coiled hair beneath helmet crown.",
      "Form-fit midnight-blue pressure suit with electric-blue circuit lines glowing along limbs and torso, transparent helmet faceplate, retractable grapple-launcher at wrist, carbon-fiber rope coil slung across the chest, bolt-action rifle mag-locked to thigh, accent clan face-tattoos visible through visor.",
      "Olive-drab pressure suit with chrome chest plate, sealed helmet with amber HUD visor glowing softly, hydraulic sampling arm extending over left shoulder, battery-pack pulsing amber at lower spine, sample canisters mag-locked to thigh plates, cryo-container venting liquid nitrogen at the hip.",
      "Midnight-blue tactical bodysuit with electric-blue bioluminescent circuit-lines tracing limbs and spine, steel shoulder guard, power-cell glow casting azure halo, plasma-blue pupilless eyes through transparent faceplate, brand-plate at temple, fiber-optic cables from wrist-mounted hacking deck.",
      "Charcoal pressure suit with bronze segmented plates, enclosed helmet with polarized visor, shoulder-mounted thruster array venting cryo vapor, wrist-mounted blue-white welding torch, ion-blue rim accent highlighting belt buckle and waist seal, pilot's gauntlet glowing at fingertips.",
      "Pearl-white form-fit pressure suit with oxblood ceramic chest plate, bubble helm visor revealing copper-red pixie-cut hair and dragon-gold eyes, hydraulic manipulator arms folded against backpack, amber battery-pack glowing at lower spine, breathing apparatus with scrubber cartridges, survival knife strapped to boot.",
      "Burgundy hooded armored bodysuit with sigil-engraved bronze chestplate, hood framing the face, gauntlets with built-in cutting tools, belt-pouches with spore-collection vials, no helmet — dark skin and silver-grey hair visible through hood opening.",
    ],
    instructions: `Each entry: ONE outfit description, 50-80 words. Describe the suit + plate detail + helmet/visor state + 2-4 tech pieces + glowing accent + identity marker revealed through the faceplate. Pure outfit-and-tech register — the woman's competence and silhouette carry the appeal. Output as a NUMBERED list (1. ... 2. ... 3. ...).

VARIETY: each entry visually distinct — different suit color and material, different plate / armor configuration, different helmet status, different tech combination, different identity marker. Match the touchpoints' tight outfit-only register.`,
  },
  cozy_warmth_source: {
    theme:
      'The ONE dominant warmth source defining each cozy sci-fi interior — every cozy space has its own specific source of warmth (visual + emotional). Each entry names a single warmth source with enough detail that Sonnet+Flux can render the room AROUND that warmth. Each entry 20-50 words.',
    touchpoints: [
      'amber engine-bay glow leaking through floor grates',
      'grow-lamp lighting a hanging garden of xeno-ferns',
      'cooking steam from a galley pot, kettle whistle',
      'bioluminescent moss/lichen cluster casting soft teal',
      'tealight cluster / candles in an alien sconce',
      'amber console panel with old-style toggles glowing warm',
      'fireplace hearth fueled by alien crystals',
      'body heat — sleeping person under blanket, breath fogging visor',
      'reactor-coolant pipe radiating cherry-red warmth',
      'samovar / hot-drink dispenser with steam',
      'sun-shaft through window from a yellow-class star',
      'string-light cluster (paper-lantern strings strung across beams)',
      'forge-glow from a small fabricator working a part',
      'incense brazier with smoldering xeno-resin',
      'aquarium tank with bioluminescent specimens',
      'amber holo-projector throwing gentle ambient glow',
      'oven hatch open spilling baking heat into the cabin',
      'fire-pit on a balcony watching the stars',
      'workbench task-light bent over a project',
      'lava-lamp-style bioluminescent fluid lamp',
    ],
    instructions: `Each entry is ONE dominant warmth source, 20-50 words. Format: "WARMTH NAME — visual description + how it lights the room + sensory hook". The warmth should be the FOCAL point of the room's atmosphere. Variety across all 30: machinery / culinary / biological / electrical / fire-based / ambient cosmic / body / ritual. NO outdoor weather. NO industrial-cold-blue lights. Each is intimate, lived-in, dominant. Output JSON array of strings.`,
  },
  alien_city_drama: {
    theme:
      'Path-specific drama events for alien-city scenes — visible incidents that bring story to a still of a vast alien metropolis. Examples: street protest with crowd torches, atmospheric phenomenon over city (auroras, debris field, eclipse), military lockdown checkpoint, alien festival with hanging lanterns, sky-train passing between megabuildings, fire on lower-tier ledge, parade with banners. Each entry 25-50 words.',
    touchpoints: [
      'street protest — crowd with torches in lower-tier plaza',
      'atmospheric phenomenon — aurora curtains over the skyline',
      'military lockdown — checkpoint with patrol drones',
      'alien festival — hanging paper lanterns and floating spirit lamps',
      'sky-train passing between megabuildings',
      'fire breakout — flames licking up a tower face',
      'parade — banners and music drifting up from a boulevard',
      'orbital debris streaks through upper atmosphere',
      'religious procession — robed figures crossing skybridge',
      'alien holiday — neon-sign flicker and festival color',
      'sandstorm wall arriving at city outskirts',
      'duel in the streets — two figures circling in a plaza',
      'capital-ship arrival — descending lights through clouds',
      'flood — water rising through lowest-tier streets',
      'parade of mechs in service display',
    ],
    instructions: `Each entry is ONE visible drama element woven into an alien city scene, 25-50 words. Format: "DRAMA NAME — description of what's happening, where in the city, what the viewer SEES". Visible from a wide shot — NOT internal-only events. Variety: civil unrest, atmospheric phenomena, religious/festival, military, technological, environmental, criminal, ceremonial. Output JSON array of strings.`,
  },
  alien_city_anchor_entity: {
    theme:
      'Lone city-witness entities for alien-city scenes — a SINGLE figure / vehicle visible at TINY/SMALL frame proportion in a vast alien metropolis. Street-level witnesses, sky-tier traffic, low-altitude flyers. NOT capital ships, NOT cities (we ARE in the city), NOT megastructures. Just lone witnesses: a vendor, a hovercar, a pedestrian, a patrol drone, a lone skybridge walker. Each entry 15-40 words.',
    touchpoints: [
      'lone hovercar threading between towers',
      'sky-tier pedestrian crossing a transparent skybridge',
      'street vendor at illuminated stall',
      'patrol drone hovering at intersection',
      'lone monk-figure on temple steps',
      'small delivery transport with cargo box',
      'rooftop figure with hands on railing',
      'street performer in motion (acrobat)',
      'old alien sitting on park bench',
      'rickshaw-style pulled vehicle',
      'lone cyclist on bridge',
      'food-cart with steaming wok',
      'hooded passerby with weather cloak',
      'rideable alien creature with single passenger',
      'maintenance worker on cabling',
    ],
    instructions: `Each entry is ONE lone witness in a city, 15-40 words. Format: "ENTITY NAME — visual description of one figure/vehicle at TINY/SMALL scale within the alien city". NEVER crowds, NEVER capital ships, NEVER architecture (that's the city itself). Output JSON array of strings.`,
  },
  alien_city_deep_distance: {
    theme:
      'The signature deep-distance feature defining the alien-city FAR-back layer. Each city has a horizon-defining detail beyond the immediate megabuilding cluster — distant orbital ring, ecumenopolis canyon vanishing to horizon, megabuilding piercing clouds, planetary curvature at top of skyline, distant temple-spire, broken arcology silhouette. Each entry 20-50 words.',
    touchpoints: [
      'orbital ring visible overhead through gap in towers',
      'distant ecumenopolis canyon vanishing to horizon',
      'megabuilding spire piercing low clouds',
      'planetary curvature visible at horizon',
      'distant temple-spire silhouette',
      'broken arcology ruin on horizon',
      'gas-giant analog filling 30% of distant sky',
      'space elevator threading through atmosphere',
      'collapsed sector visible miles away as broken silhouette',
      'fleet of capital ships docked at distant spaceport',
      'twin-moon arc rising over skyline',
      'distant volcanic geyser plume visible behind city',
      'second-city across the bay/canyon at far distance',
      'orbital fragment falling slowly through air',
      'auroral curtain stretching to horizon',
    ],
    instructions: `Each entry is ONE deep-distance signature feature, 20-50 words. Specific visible feature that punches up the far-back layer. NOT generic atmospheric haze. Output JSON array of strings.`,
  },
  megastructure_drama: {
    theme:
      'Path-specific drama events for megastructure scenes — visible incidents at colossal post-planetary engineered scale. Examples: energy beam firing from structure, ring-section rotating slowly, atmospheric leak venting, fleet passing through hangar, construction-mech swarm working surface, debris field of dead ships nearby. Each entry 25-50 words.',
    touchpoints: [
      'energy beam firing from a structure aperture',
      'ring-section rotating against starfield',
      'atmospheric leak venting — geyser of vapor escaping',
      'fleet passing through a hangar maw',
      'construction-mech swarm working the surface',
      'debris field of dead ships drifting nearby',
      'capital-ship docking at a port the size of a city',
      'gravity-shear distortion bending light around structure',
      'planetary mining — extraction beam cutting into asteroid',
      'wormhole gate active — blue ring of distortion',
      'massive door opening to reveal interior canyon',
      'meteor shower impacting hull plates',
      'reactor flare — sudden bloom of light from spine',
      'mass eject — payload launching from accelerator',
      'shipyard frame holding a half-built capital ship',
    ],
    instructions: `Each entry is ONE visible megastructure-scale drama, 25-50 words. Format: "DRAMA NAME — description of what's happening and what the viewer SEES at megastructure scale". Variety: combat, atmospheric, mechanical, civic, industrial, environmental. Output JSON array of strings.`,
  },
  megastructure_anchor_entity: {
    theme:
      'Lone megastructure-scale witness entities — a SINGLE small vehicle / figure / ship visible at TINY/SMALL frame proportion against the megastructure. Capital ships are TINY against a megastructure; fighters are SUB-pixel; engineers in suits are dust motes. Each entry 15-40 words.',
    touchpoints: [
      'small shuttle threading toward docking maw',
      'fighter-wing in formation passing structure spine',
      'lone construction-mech welding hull plates',
      'engineer in EVA suit tethered to cable',
      'capital ship dwarfed by structure scale',
      'cargo train of orbital pods',
      'inspection drone with spotlight',
      'tug pulling derelict freighter',
      'racing skiff threading between rings',
      'lifeboat drifting from venting section',
      'maintenance crawler on hull surface',
      'fleet courier flashing recognition lights',
      'survey probe with deployed instruments',
      'sentinel-drone with weapon array',
      'tiny human silhouette in observation window',
    ],
    instructions: `Each entry is ONE lone witness at megastructure scale, 15-40 words. Format: "ENTITY NAME — visual description". NEVER cities, NEVER groups, NEVER the megastructure itself. Single small witness proving scale. Output JSON array of strings.`,
  },
  megastructure_deep_distance: {
    theme:
      'The signature deep-distance feature defining the megastructure FAR-back layer. Planet visible through structure gap, gas-giant looming behind, fleet at far edge, secondary megastructure on horizon, cosmic phenomenon framing the structure. Each entry 20-50 words.',
    touchpoints: [
      'planet visible through structural gap',
      'gas giant looming behind megastructure',
      'second megastructure on opposite horizon',
      'cosmic phenomenon (nebula / lensing) framing structure',
      'fleet at far edge of structure',
      'destroyed twin-structure ruin in distance',
      'sun rising behind structure spine',
      'asteroid field beyond structure',
      'wormhole event in deep background',
      'orbital ring fragment seen edge-on',
      'planetary atmosphere band visible through gap',
      'distant capital battle — far ships exchanging fire',
      'meteor storm beyond structure',
      'cosmic ray storm lighting deep space',
      'collapsing star (supernova) in far background',
    ],
    instructions: `Each entry is ONE specific deep-distance signature feature, 20-50 words. Specific visible mega-feature far behind the megastructure. Output JSON array of strings.`,
  },
  landscape_anchor_entity: {
    theme:
      'Lone wilderness witness entities for alien-landscape scenes — a SINGLE figure / creature / small vehicle placed in midground-back of an alien wilderness as a SCALE PROVER (TINY/SMALL frame proportion). NEVER cities, NEVER capital ships, NEVER megastructures, NEVER architecture. Just lone witnesses in the wild — vac-suit explorers, native creatures, scout drones, ground rovers, hovering probes, single tents, lone xeno-fauna. Each entry 15-40 words.',
    touchpoints: [
      'vac-suit explorer in EVA gear with backpack',
      'native alien creature (sentient biped)',
      'native alien creature (quadruped fauna)',
      'native alien creature (avian flier)',
      'small scout drone (octagonal, hovering)',
      'six-wheel exploration rover',
      'lone climber with rope on rock face',
      'single survival tent with antenna',
      'small landing pod (single-occupant)',
      'rappelling scientist on cliff face',
      'lone hunter tracking prey',
      'medic with field kit beside fallen explorer',
      'cartographer with theodolite tripod',
      'small spherical probe trailing tether',
      'lone xeno-fauna (massive but distant)',
      'jetpack scout silhouette',
      'lone monk-like figure in robe-and-suit',
      'gas-mask explorer wading through tide',
      'sniper prone with bipod rifle',
      'sample-collector with case in hand',
    ],
    instructions: `Each entry is ONE lone wilderness witness entity, 15-40 words. Format: "ENTITY NAME — visual description of the entity at TINY/SMALL scale in alien-landscape composition". Variety required across all entries: human explorers in EVA gear, native alien creatures (sentient AND fauna), small scout vehicles, single survival objects. NO cities, NO architecture, NO capital ships, NO megastructures, NO crowds, NO multiple figures. ALWAYS a single witness. Output JSON array of strings.`,
  },
  landscape_moment: {
    theme:
      'The candid action moment a lone wilderness witness is captured doing — a small-scale verb that adds story to a landscape still. Each entry is ONE simple visible action: cresting a ridge, hesitating at the canyon edge, kneeling at strange formation, scanning the horizon, approaching alien glow, brushing dust from artifact. NOT epic-scale heroics — small candid moments that show "she/he/it is real and alive in this landscape." Each entry 15-30 words.',
    touchpoints: [
      'CRESTING RIDGE — silhouetted as horizon emerges',
      'HESITATING — paused at canyon edge',
      'KNEELING — at strange ground formation',
      'SCANNING HORIZON — hand to visor',
      'APPROACHING GLOW — alien light source ahead',
      'BRUSHING DUST — from buried artifact',
      'WADING — through alien liquid',
      'CLIMBING — three-point grip on rock face',
      'POINTING — at distant feature for companion',
      'TAKING SAMPLE — vial in alien soil',
      'SETTING UP CAMP — tent half-erect',
      'FOLLOWING TRACKS — kneeling at print',
      'CASTING SHADOW — backlit by twin suns',
      'STANDING STILL — taking in vastness',
      'SCOPING — through optic at distance',
    ],
    instructions: `Each entry is ONE simple landscape moment in 15-30 words. Format: "ACTION-VERB-CAP — body position + tool/object". The action is SMALL-SCALE candid (not combat, not heroics) — a witness moment in alien wilderness. Examples: "CRESTING RIDGE — silhouetted figure topping ridge, distant horizon emerging beyond"; "KNEELING AT ARTIFACT — figure low to ground, hand pressed to luminous alien formation". GROUNDED, single moment, readable in first 5 words. Output JSON array of strings.`,
  },
  landscape_deep_distance: {
    theme:
      'The signature deep-distance feature that defines the alien-landscape FAR-back layer. NOT generic "atmospheric haze" — a specific MEGA-FEATURE looming on the horizon that proves the world is alien AND vast. Examples: 10km-tall gas geyser, megaflora silhouette, distant alien herd migration, crashed generation ship overgrown, megafauna walking the horizon, alien archology miniature on far ridge, eclipse arch, falling debris field, gravitational lensing distortion. Each entry 20-50 words.',
    touchpoints: [
      '10-kilometer gas pillar venting cryogenic vapor',
      'megaflora silhouette — 500m trees miniature on horizon',
      'distant alien herd migrating across plain',
      'crashed generation ship overgrown by jungle',
      'megafauna silhouette walking horizon line',
      'alien archology miniature on distant ridge',
      'eclipse arch across sky',
      'falling debris field — meteor shower at horizon',
      'gravitational lensing distortion ring',
      'tidal mountain of liquid methane rising slowly',
      'twin-sun corona haloing distant peaks',
      'ringed gas giant filling 30% of horizon',
      'aurora curtains stretching to horizon',
      'sandstorm wall miles wide approaching',
      'cosmic ray burst lighting upper atmosphere',
      'mega-creature breaching alien ocean miles away',
      'spore cloud the size of a city on horizon',
      'glassed crater field stretching to vanishing point',
      'orbital ring fragment falling through atmosphere',
      'thunderstorm system with continental-scale lightning',
    ],
    instructions: `Each entry is ONE specific deep-distance signature feature, 20-50 words. Format: "FEATURE NAME — description of what it looks like + sense of distance/scale". Variety: gas geysers, distant herds, crashed wrecks, megafauna, atmospheric phenomena, orbital fragments visible, lensing/cosmic effects. NO generic "alien sky" or "atmospheric haze". Each must be a SPECIFIC visible mega-feature that punches up the far-back layer. Output JSON array of strings.`,
  },
  rugged_male_explorer_outfits: {
    theme:
      'Tactical sci-fi EXPLORER / ROGUE / ASSASSIN outfits for a male character — Destiny Guardian / Destiny 2 Hunter / Mass Effect operative / Halo ODST / Mandalorian protagonist / Cad Bane / Star-Lord / Cowboy Bebop Spike / Han Solo with armor / John Wick in space. Armored cloaks over sealed helms, tactical armor over thermal underlayers, weapon-bristled mercenary kit, weathered cybernetic-augmented operative gear. He is CAPABLE, MYSTERIOUS, stylish-tactical — Destiny Guardian energy.\n\nFULLY CLOTHED RULE — NEVER shirtless, NEVER bare-chested, NEVER exposed torso, NEVER tank top, NEVER sleeveless, NEVER beefcake. Torso is ALWAYS covered in armor / coat / pressure suit / harness.\n\nABSOLUTE BAN — NO Mandalorian (the word) / NO beskar / NO T-visor / NO Boba Fett / NO Star Wars (the words). Flux renders the franchise IP from those tokens. Use generic descriptive language instead (sealed visor / amber HUD faceplate / full-coverage helm / armored cloak with hood).',
    touchpoints: [
      'Destiny 2 Guardian Hunter — armored cloak + sealed helm + utility belt + tactical armor',
      'Destiny 2 Guardian Titan — heavy plate armor + helmet + shoulder mantle',
      'Destiny 2 Guardian Warlock — armored robe-coat + bond-strap + visor helm',
      'Mass Effect operative — armored field tactical with curved plates + visor helm',
      'Mass Effect Shepard-coded — sealed helmet + tactical armor with shoulder pauldrons',
      'Halo ODST drop-trooper male — full sealed helmet + ballistic harness + flight suit',
      'Cad Bane bounty hunter (generic) — wide-brim hat + armored duster + twin pistols',
      'Star-Lord operative — armored jacket + helmet (handheld) + utility belt',
      'Cowboy Bebop Spike Spiegel — fitted blazer over tactical underlayer + sidearm + smoke',
      'cyberpunk operative — long armored coat + neural visor + augmented arm covered by sleeve',
    ],
    instructions: (() => {
      // Optional: load male-rendered exemplars if available (none yet for ME path)
      let exemplars = [];
      try {
        exemplars = require('fs').existsSync('/tmp/me-exemplars.json')
          ? require('/tmp/me-exemplars.json')
          : [];
      } catch (_) {}
      const exemplarBlock = exemplars.length
        ? `\n\n═══════ HEARTED EXEMPLARS — WRITE NEW ENTRIES LIKE THESE ═══════\n\n${exemplars.map((e, i) => `EXEMPLAR ${i + 1}: ${e}`).join('\n\n')}\n\n═══════ END EXEMPLARS ═══════\n\n`
        : '';
      return `Write ${COUNT} male sci-fi explorer/rogue/assassin OUTFIT entries, 50-80 words each. Each entry MUST describe a man in full tactical kit — outfit, armor pieces, weapons, identity markers. Setting is just a 2-3 word prefix; the BODY of every entry is the CHARACTER + OUTFIT + GEAR description.

CORRECT FORMAT (every entry must look like this):
"SETTING-NAME — [skin/race detail], [helmet/face], [armor/coat description], [tech pieces], [weapons], [identity marker]."

EXAMPLE OF CORRECT ENTRY:
"DEAD ORBITAL RING CITY — bronze-skinned operative with weathered stubble and ritual face scars, sealed amber-HUD visor helm, gunmetal-grey armored duster over segmented ceramic chest plate, life-support backpack with cyan power cells, twin pistols in shoulder holsters, rifle mag-locked to spine, vibroblade on hip"

WRONG (DO NOT DO THIS — these are settings, not outfits): "TIDE-LOCKED STORM WORLD OUTPOST — research garrison perched on cliff overlooking eternal hurricane"

Every entry MUST have ALL of these in the description body:
1. Skin tone + identity marker (scars / tattoos / stubble / beard / shaven skull / cybernetic eye)
2. Helmet OR head covering (sealed visor / full-coverage helm / hood / face-wrap / gas mask)
3. Body armor / coat / harness (armored duster / armored cloak / sealed pressure suit / ballistic harness over thermal layer)
4. Tactical color (gunmetal / matte-black / coyote-tan / olive-drab / oxblood / charcoal)
5. 2-4 tech pieces (life-support backpack / wrist-comm / mag-boots / sensor pod / cybernetic limb)
6. Multiple visible weapons (rifle / pistol / shotgun / vibro-blade / grenades)${exemplarBlock}
EVERY new entry MUST have:
- DISTINCTIVE non-default skin color or anatomy (deep umber / weathered tan / pale-grey / yellow-green / bronze / scarred / cybernetic-eyed / long-bearded / shaven-skulled / pointed-eared / etc.) — never just "human man"
- TACTICAL OPERATIVE OUTFIT BASE — armored cloak with hood / armored field jacket / armored duster coat / sealed pressure suit / segmented plate armor over thermal layer / ballistic harness over flight suit. Tactical color (gunmetal-grey / matte-black / coyote-tan / olive-drab / oxblood / charcoal / sand-bleached / weathered-brown). His TORSO IS COVERED — never bare.
- SEALED HELMET / FULL-COVERAGE HELM / VISOR HELM / FACEPLATE / GAS MASK (70% of entries — others have helmet held in hand / hood up / face-wrap-with-goggles)
- 2-4 distinct ENGINEERED TECH PIECES (life-support backpack / wrist-comm / sensor pod / mag-boots / grenade bandolier / scanner / cybernetic eye / shoulder pauldron / mantled cloak / power-pack glow)
- WEAPON-BRISTLED — multiple visible weapons (rifle slung over back / pistol holstered at thigh / shotgun mag-locked / vibro-blade on hip / grenade pouches / breach charges)
- IDENTITY MARKERS (battle scar across face / cybernetic eye replacement / weathered stubble / face tattoos / clan markings / cigar clenched in teeth / bandaged hand / missing finger / war paint)

ABSOLUTE BANS:
- NEVER shirtless, NEVER bare-chested, NEVER exposed torso, NEVER tank top, NEVER sleeveless, NEVER beefcake. Even cyborgs wear coats over their torso.
- NO "Mandalorian" / NO "beskar" / NO "T-visor" / NO "T-shaped visor" / NO Boba Fett / NO Star Wars (Flux renders the franchise IP)
- NO form-fitting bodyglove fashion / NO sleek runway suits / NO clean parade uniforms / NO pilot cockpit suits without armor / NO glamour kit
- NOT bulky-tank power-armor brute — this is a TACTICAL OPERATIVE / Destiny Guardian / rogue / assassin, not a Halo MJOLNIR berserker

Vary the role: bounty hunter / mercenary / planetary surveyor / EVA fieldworker / scout / marksman sniper / breacher / scavenger / cave-diver / hazmat specialist / heavy-weapons operative / cyberpunk operative / Destiny Guardian Hunter or Titan or Warlock / Mass Effect operative.

The bar: each entry should read as a Destiny Guardian, Mass Effect operative, Halo ODST, or sci-fi rogue/assassin you'd see in a hostile alien planet cinematic. Tactical + capable + stylish + COVERED. Output JSON array of strings.`;
    })(),
  },
  explorer_outfits_female: {
    format: 'simple',
    theme: `STARBOT FEMALE-EXPLORER TACTICAL OUTFITS — pure outfit + gear + helmet/visor descriptions across a WIDE VARIETY of sci-fi style-families. Each entry: 30-50 words. The aesthetic is capable, functional, and visually distinct from every other entry — each outfit reads as a different kind of woman doing a different kind of work in a different corner of the galaxy.

This pool fills the \`wearing \${outfit}\` slot in the FEMALE_EXPLORER brief template. Scene, action, lighting, and sky come from other axes — entries here describe ONLY what she is WEARING and CARRYING.

EVERY ENTRY HAS:
• AN OPENING COLOR-FAMILY OUTFIT NAME in caps — "COPPER-BROWN SCAVENGER DUSTER" / "OXBLOOD-RED MERCENARY JUMPSUIT" / "ARCTIC-WHITE SEALED PARKA" / "BURGUNDY MONASTIC-ORDER ARMOR" / "BRASS-AND-RUST DIESELPUNK EXPLORER" / etc. — the COLOR + STYLE-FAMILY are both in the name.
• OUTFIT MATERIAL + PLATE / ARMOR / COAT / CLOAK DETAIL — weathered leather / segmented metal plates / canvas-and-kevlar / ceramic / synthetic mesh / fabric-armor hybrid / brushed alloy / coated polymer / thermal-gel insulation / hooded robe over segmented chest-plate / armored bodysuit with chrome accents / etc.
• FUNCTIONAL EQUIPMENT — utility belt, gauntlets, boots, sidearm in holster, scanner, gear pouches, climbing-rope coiled, breather-mask hanging at neck, multi-tool harness, bandolier of tool-canisters, wrist-mounted data-slate, etc.
• HELMET / FACE STATE — about half with head covered (helmet / hood up / sealed visor / breathing mask / face-wrap), about half with head uncovered (hair visible, hood pulled back, helmet held under arm, visor pushed up on the brow). When the face is visible, hair color + styling reads as part of her identity.

The STYLE-FAMILIES the pool spans: scavenger / corporate operative / monastic order / desert nomad / arctic explorer / jungle ranger / chrome-cyber / military / mercenary / scientific researcher / pirate / pilot / dieselpunk / industrial worker / hazmat / engineer / sniper / ranger / pilot / commander / scout / archaeologist / drifter / nomad / spec-ops.

The COLORS the pool spans (widely): red / orange / olive / black / desert tan / cobalt blue / brass / chrome / forest green / oxblood / charcoal / off-white / sand / arctic-white / midnight / copper-brown / burgundy / rust / slate / emerald / ivory / teal / ochre / jade / amber / dusty rose / oxidized bronze.

The SILHOUETTES the pool spans: slim scout / bulky power-armor / hooded cloaked / vest-and-pants / heavy backpack / minimalist / poncho-draped / coat-over-bodysuit / segmented plate / fitted EVA.

Each entry should feel like a CHARACTER you'd recognize on sight — distinct visual identity through color + style-family + outfit silhouette + gear cascade + helmet state.`,
    touchpoints: [
      "COBALT-BLUE IMPERIAL GUARD IN CEREMONIAL PLATE — segmented chrome pauldrons with royal insignia, high-collar gorget, mirrored visor helmet, white cape-drape.",
      "CHARCOAL POWER-ARMOR WITH RED SERVICE-STRIPES — bulky exoskeleton frame, hydraulic-joint actuators, sealed helmet with tri-lens array, armored backpack-reactor, mag-locked sidearm.",
      "BURGUNDY MONASTIC-ORDER ARMOR — hooded robe over segmented chest-plate, sigil engraved in bronze, wrist-mounted data-slate, tall boots, no helmet—hair in ritual braid.",
      "BLACK-AND-MAGENTA CORPORATE OPERATIVE — sleek armored bodysuit with chrome accent-lines, slim holster at thigh, wrist-interface glowing, short hair, angular visor-glasses.",
      "OLIVE-DRAB MILITARY FATIGUES — kevlar vest with ceramic plate-inserts, bulky tactical backpack, mirrored helmet visor, combat boots caked in mud, rifle mag-locked to chest.",
      "BRASS-AND-RUST DIESELPUNK EXPLORER — leather flight-jacket with brass buckles, goggle-helmet with tinted lenses, oversized bandolier of tool-canisters, gauntlets with pressure-dials.",
      "ARCTIC-WHITE SEALED PARKA — thermal-gel insulation visible through clear panels, tinted survival-goggles, breather-mask with vapor-exhaust, insulated gloves, ice-axe mag-locked.",
      "SAND-TAN DESERT SCOUT — dust-weathered poncho over armored bodysuit, face-wrap leaving only eyes visible, wrist-mounted compass-scanner, boots with sand-gaiters.",
      "OXBLOOD-RED MERCENARY JUMPSUIT — segmented armor-plates at shoulders and thighs, multi-tool belt with holster and plasma-cutter, short hair, tactical visor pushed up on forehead.",
      "COPPER-BROWN SCAVENGER DUSTER — weathered leather coat to knees, rusted iron gauntlets, goggled half-mask, utility-harness with salvage-tools, climbing-rope coiled.",
      "MIDNIGHT-BLACK SPEC-OPS ARMOR — form-fitting tactical-plate with sensor-absorbent coating, enclosed helmet with visor-slit, wrist-blades retracted, silenced sidearm.",
      "EMERALD-GREEN JUNGLE RANGER — armored vest over moisture-wicking under-layer, machete sheathed, bio-hazard scanner on hip, helmet with insect-netting, tall boots.",
      "CHROME-AND-WHITE PILOT FLIGHTSUIT — segmented pressure-suit with accordion joints, helmet with gold-tinted visor carried under arm, oxygen-pack compact on back, comm-unit chest-mounted.",
      "SLATE-GREY ENGINEER UTILITY-SUIT — heavy canvas coveralls with knee-pads, tool-harness across chest, welding-visor flipped up, insulated gloves tucked in belt, work-boots steel-toed.",
      "YELLOW HAZMAT RESEARCH SUIT — reinforced seals at joints, full-face respirator with filter cartridges, decontamination badges on shoulders, belt-pouches with specimen-containers, taped seams.",
    ],
    instructions: `Each entry: ONE outfit, 30-50 words. Format: "COLOR-FAMILY OUTFIT NAME — outfit description with material + plates + gear + helmet state". Output as a NUMBERED list (1. ... 2. ... 3. ...).

VARIETY: each entry visually distinct — different color, different style-family, different silhouette, different helmet state, different gear cascade. Match the touchpoints' tight outfit-only register.`,
  },
  architecture_style: {
    theme:
      'distinct architectural style vocabulary for alien cities — each entry names a specific structural language so Flux renders varied architecture instead of defaulting to "cyberpunk spires" every time. Each entry 30-60 words.',
    touchpoints: [
      'brutalist concrete (Stalinist scale)',
      'biomechanical Giger chitin',
      'crystalline Halo-Forerunner lattice',
      'Mayan stepped ziggurats',
      'Kirby cosmic kaleidoscopic',
      'Gaudí flowing organic',
      'art-deco retrofuture (Hugh Ferriss)',
      'Soviet dieselpunk industrial',
      'walking-megastructure (Howl)',
      'cliff-built carved-stone (Petra-scale)',
      'crashed ship assimilated into city',
      'modular hab-spheres (NASA-Apollo)',
      'floating-platform archipelago',
      'underground cyclopean halls',
      'mushroom-cap domed colonies',
      'temple-city processional avenues',
      'desert-oasis walled (Middle Eastern)',
      'Banks Culture elegant curves',
      'orbital ring segments grounded',
      'shipyard cradle integrated',
    ],
    instructions: `Each entry names a SINGLE distinct architectural style with specific structural language. Format: "STYLE NAME — visual description of forms / materials / textures / scale". Vary across all 100 entries — never repeat a style; each must feel like a different civilization or aesthetic tradition. NO generic "alien architecture" — every entry has a precise style identity.`,
  },
  character_action: {
    theme:
      'Clear simple action verbs for a sci-fi female explorer — what she is DOING right now. Each entry is ONE simple action, no obscure setup, no extra props. The verb leads. Reader sees the action immediately.',
    touchpoints: [
      'BATTLING — firefight from cover',
      'CLIMBING — three points of contact on alien rock',
      'RAPPELLING — controlled descent on rope',
      'AIMING — rifle braced at distant target',
      'CROUCHING — examining tracks / artifact on ground',
      'HACKING — at glowing alien terminal',
      'SPYING — scope to eye from cover',
      'WADING — through alien liquid up to knees',
      'SNEAKING — flat against wall, peeking around corner',
      'SIGNALING — flare gun raised for pickup',
      'DEFENDING — rifle aimed at offscreen threat',
      'REPAIRING — kneeling with multitool at damaged tech',
      'HOLDING WEAPON — rifle low and ready, scanning',
      'KNEELING AT ARTIFACT — hand on alien relic',
      'TRACKING — body low and stalking through brush',
      'PUSHING THROUGH — shoulder against blast door',
      'PROTECTING — body shielding small object behind her',
      'ZIPLINING — sliding down cable in motion',
      'SCANNING — handheld scanner sweeping',
    ],
    instructions: `Each entry is ONE simple clear action in 15-30 words. NO obscure setups, NO extra props, NO numbered measurements, NO atmospheric details. Just: VERB + body position + weapon/tool. The reader must understand the action in the first 5 words.

Format: "ACTION-VERB-CAP — body position + tool/weapon + 1 simple detail". Example: "BATTLING — crouched behind cover, rifle braced against shoulder, muzzle flash". Another: "CLIMBING — three points of contact on sheer rock, fingers gripping ledge".

KEEP IT SIMPLE: short clear sentences, no rover descents, no compound scenarios, no "extracting data from research station". One verb, one action, one frame.

EVERY entry GROUNDED — feet on terrain or three points of contact. NO floating, NO mid-air.

Cover all genre categories: combat (battling), exploring (climbing/wading), tinkering (repairing/hacking), spying (surveillance/sneaking), hunting (tracking/stalking), reconnaissance (scanning/mapping), discovery (artifact/marker), survival (signaling/carrying), social (parley/conferring).

NO franchise proper nouns. NO superhero poses. Every action is a working professional doing real work.`,
  },
  starbot_anchor_entity: {
    theme:
      'sci-fi anchor entities for StarBot scenes — what figure / ship / creature populates the scene at the prescribed scale. Each entry 15-40 words describing ONE entity type.',
    touchpoints: [
      'robed wandering explorer',
      'vac-suit scientist (Ad Astra/Interstellar)',
      'armored military soldier',
      'desert nomad in dust-cloak',
      'alien creature biped (sentient)',
      'alien creature quadruped (native fauna)',
      'tiny exploration shuttle',
      'mid-size cargo freighter',
      'elegant crystalline yacht',
      'oracle / ritual figure in flowing robes',
      'bipedal android / synthetic',
      'corporate operative in slim suit',
      'merchant / trader / spice-runner',
      'pilgrim / monastic / cultist',
      'jetpack-equipped scout',
      'beast-rider on alien mount',
      'small spherical drone',
      'six-legged crab-walker mech (small)',
      'cyber-edgerunner with augments',
      'arctic-suited polar explorer',
    ],
    instructions: `Each entry describes ONE entity type — a figure, ship, creature, or vehicle that could be a SILHOUETTE / SMALL element in a scene path render. Variety required across all 50 entries: humanoid figures of various professions, ships of various designs, alien creatures of various biologies, vehicles of various scales. NO franchise lookalikes. Each entry is the TYPE not a specific named character.`,
  },
  alien_sky_layer: {
    theme:
      'sci-fi alien sky / overhead atmosphere layers for StarBot. Each entry describes what is OVERHEAD in 15-40 words — the sky layer that completes the scene composition.',
    touchpoints: [
      'twin suns at different altitudes',
      'ring-curve overhead (Halo/Niven)',
      'gas giant looming (Avatar)',
      'aurora cascades (green/magenta)',
      'Milky Way galactic arch',
      'binary eclipse / solar corona',
      'orbital station visible architecture',
      'storm-broken sun with shaft',
      'bioluminescent spore clouds',
      'plasma storm with lightning',
      'dust-red overcast Mars sky',
      'crystal-blue clear vacuum view',
      'meteor shower streaks',
      'distant supernova remnant',
      'spaceship traffic visible as dots',
      'partial-eclipse twin-moons',
      'pre-dawn pink terminator',
      'storm wall approaching',
      'nebula color clouds visible by day',
      'orbital ring under construction',
    ],
    instructions: `Each entry is a complete sky layer description for a sci-fi scene. The sky is the upper third of the frame composition. Vary across all 30 entries: day skies / night skies / dawn / dusk / storm / clear / nebula / orbital structures visible / multiple celestial bodies / weather phenomena. NO franchise proper nouns (don't say "Death Star overhead" — describe it generically).`,
  },
  surprise_element: {
    theme:
      'sci-fi secondary subjects woven into scenes to add visual interest. Each entry describes ONE element that can be placed at midground or deep midground.',
    touchpoints: [
      'alien creature watching',
      'fellow explorer at distance',
      'enemy patrol moving in formation',
      'distant hunter with rifle',
      'parked ship ready for departure',
      'descending transport ship',
      'crashed ship wreck',
      'companion drone hovering',
      'alien artifact pulsing',
      'abandoned outpost in distance',
      'distant smoke column / conflict',
      'orbital station overhead',
      'wildlife flock passing',
      'rival explorer at far edge',
      'alien statue colossal',
      'enigmatic floating orb',
      'crashed probe blinking',
      'alien procession in distance',
      'damaged patrol droid half-buried',
      'beast carcass freshly killed',
      'alien mount tethered',
      'distant battle aftermath',
      'alien pilgrimage line',
      'rival faction encampment',
      'collapsed bridge dangling cables',
    ],
    instructions: `Each entry is a single secondary subject that adds story to a scene without overwhelming the primary subject. Format: "ELEMENT NAME — description of what it looks like + where it sits in the scene + atmospheric/story implication". Variety across all 100 entries: creatures, sentient figures, ships, drones, vehicles, artifacts, ruins, distant phenomena, traces of past events. Each must imply a wider world.`,
  },
  explorer_outfits_male: {
    theme:
      'tactical-explorer outfits for male sci-fi characters — every entry is a complete SEALED ARMORED outfit emphasizing FUNCTION over form. Sealed coverage, equipment-laden, professional military / explorer kit, like Master Chief or Aliens colonial marine.',
    touchpoints: [
      'Halo Spartan armor',
      'Mass Effect N7',
      'Edge of Tomorrow exosuit',
      'Aliens colonial marine',
      'Starship Troopers power armor',
      'The Expanse Martian Marine',
      'Apollo / NASA EVA suit',
      'Dune stillsuit (utility-focused)',
      'Mandalorian armor (plated)',
      'Mad-Max wasteland-scavenger',
      'Cyberpunk-2077 corporate operative',
      'Blade-Runner trenchcoat-detective',
    ],
    instructions: `Each entry is a complete tactical outfit in 30-50 words. Lead with the ARMOR LAYER. Emphasize SEALED COVERAGE. Include FUNCTIONAL EQUIPMENT (utility belt, gauntlets, boots, sidearm, scanner, gear pouches).

VARIETY MANDATE across all entries — hit each:
- COLORS: red / orange / olive / black / desert tan / cobalt / brass / chrome / forest green / oxblood / charcoal / off-white / sand / arctic-white / midnight / copper-brown
- TEXTURES: weathered leather / segmented metal / canvas-kevlar / chitin carapace / ceramic / mesh / brushed alloy
- SILHOUETTES: slim scout / bulky power-armor / hooded cloaked / vest-and-pants / heavy backpack / minimalist / poncho / cape-flowing
- STYLE FAMILIES: imperial soldier / merchant ranger / drifter scavenger / corporate operative / monastic order / desert nomad / arctic explorer / jungle ranger / cyber-edgerunner / clean military / dirty mercenary / scientific researcher / pirate / pilot

50% of entries include head covering (helmet/hood/visor/mask); 50% head uncovered (hair visible, hood pulled back, helmet held).`,
  },
  female_explorer_hairstyles: {
    theme:
      'sci-fi female hairstyles — functional, helmet-compatible, characterful. Each entry is a hairstyle description in 10-25 words.',
    touchpoints: [
      'tight low ponytail (EVA-compatible)',
      'shaved sides with top braid',
      'long flowing loose for non-helmet wear',
      'twin space-buns Princess Leia inspired',
      'short pixie utilitarian',
      'shoulder-length asymmetric cut',
      'cornrows / box braids',
      'high topknot',
      'french-braided side-swept',
      'dreadlocks practical bound',
      'undercut with long top swept back',
      'mohawk practical short',
      'natural afro',
      'shaved head (military-clean)',
      'beaded warrior braids',
      'space-explorer half-up half-down',
    ],
    instructions: `Each entry describes ONE hairstyle in 10-25 words: cut + length + how it's worn + functional consideration (e.g., "for helmet clearance" or "for EVA work"). Variety across cut types, lengths, ethnicities, formality. Practical for sci-fi explorers doing real work.`,
  },
  male_explorer_hairstyles: {
    theme: 'sci-fi male hairstyles — functional, characterful, practical. Each entry 10-25 words.',
    touchpoints: [
      'high-and-tight military',
      'shaved head clean',
      'short slicked-back',
      'medium beard-and-mustache short hair',
      'long warrior braid',
      'top-knot samurai-coded',
      'dreadlocks tied back',
      'mohawk practical',
      'shaggy chin-length scavenger',
      'mustache-and-undercut',
      'corporate slicked',
      'desert-nomad headwrap-covered',
      'gray-bearded distinguished',
      'punk-spiked liberty',
      'cyberpunk-asymmetric',
      'beard-only bald',
    ],
    instructions: `Each entry describes ONE male hairstyle in 10-25 words: cut + length + facial hair (if any) + characterful detail. Variety across cuts, beards, ages, ethnicities, formality. Practical for sci-fi explorers.`,
  },
  female_explorer_accessories: {
    theme:
      'signature accessory / weapon / tool for female sci-fi explorer. Each entry 10-25 words describing ONE accessory she carries visibly.',
    touchpoints: [
      'plasma pistol holstered',
      'long-range scanner handheld',
      'tactical climbing-rope coiled',
      'multi-tool clipped to belt',
      'sniper-rifle slung across back',
      'jetpack mounted between shoulders',
      'energy-sword sheathed at hip',
      'comm-headset wrapped around ear',
      'thermal-vision goggles on brow',
      'mech-frame backpack with sensor arms',
      'ceremonial staff / focusing-rod',
      'data-tablet at hip',
      'shotgun pump-action slung',
      'medical-kit shoulder-bag',
      'flame-projector hose to backpack',
      'pet drone hovering at shoulder',
    ],
    instructions: `Each entry describes ONE accessory: what it is + where she carries it + signature detail. Vary across weapons / tools / scanners / armor accessories / mounts / pets. Each accessory should look DISTINCTIVE and identity-anchoring.`,
  },
  male_explorer_accessories: {
    theme: 'signature accessory / weapon / tool for male sci-fi explorer. Each entry 10-25 words.',
    touchpoints: [
      'heavy assault rifle slung',
      'plasma-pistol thigh-holstered',
      'climbing-axe at hip',
      'multi-tool wristband',
      'large utility-backpack with antenna',
      'sword-and-shield strapped to back',
      'engineering-toolbelt utility',
      'scanner-visor lifted',
      'comm-headset',
      'flamethrower hose-to-pack',
      'sniper-rifle scoped',
      'med-kit shoulder slung',
      'flare-launcher at hip',
      'shovel / pickaxe gear-strapped',
      'jetpack',
      'pet drone',
    ],
    instructions: `Each entry: what + where + signature. Variety across weapons / tools / scanners / mounts. Each distinctive.`,
  },
  alien_planet_biome: {
    theme:
      'alien planetary BIOMES — each entry is ONE distinctive ecological/geological identity used as a SETTING pool for the slot-pool composer. Used in alien-landscape path. Concise but specific — each biome is a 3-5 sentence description Sonnet weaves with other rolled axes.',
    touchpoints: [
      'Dune Arrakis dune sea',
      'Solaris sentient ocean',
      'Nausicaä toxic spore jungle',
      'Annihilation Shimmer (color-refracted)',
      'Avatar Pandora bioluminescent forest',
      'Beksinski painted dread plain',
      'Roadside Picnic Zone (broken physics anomalies)',
      'Tatooine binary-sun desert',
      'Hoth glacial polar',
      'Mustafar volcanic obsidian river',
      'methane seas of Titan',
      'crystal cave forests',
      'tidal mudflats with bioluminescent algae',
      'mountain plateaus of frozen ammonia',
      'subterranean kelp-forests in low-G',
    ],
    instructions: `Each entry is 60-120 words describing ONE specific alien biome. Include: PRIMARY GEOLOGY (what the ground is — sand / basalt / chitin / ice / glass), DOMINANT BIOLOGY (what grows / lives here — towers, kelps, crystalline mineral life, plasma fauna), ATMOSPHERIC CHARACTER (color of sky, particulate, weather), DISTINCTIVE FEATURE (the thing that makes THIS biome unmistakable — geyser fields / floating boulders / fractal coral / etc.), and SCALE CUE (how big the features are). Each biome must be VISUALLY DISTINCT from the others. Reference real-world biomes pushed to alien extremes (Atacama → glass-crystal desert at -200C; Yellowstone → planet-spanning geyser field; Amazon → bioluminescent jungle 500m canopy; Sahara → twin-sun ochre dune sea 1km dunes).`,
  },
  megastructure_setting: {
    format: 'simple',
    theme:
      'SLIM atomic seeds for ICONIC CYBERPUNK BUILDINGS within a bustling sci-fi city — single notable towers featuring distinctive shape + MASSIVE HOLOGRAPHIC ADVERTISEMENTS (often sexy fashion-coded or seductive cyborg/android pitch) + dense neon signage + clear relationship to flying-vehicle traffic. Blade Runner 2049 / Cyberpunk 2077 / Ghost in the Shell aesthetic baked into every entry.',
    touchpoints: [],
    instructions: `Write 30 SLIM atomic cyberpunk-building seeds for a sci-fi cityscape. Each entry is ONE short phrase (20-30 words) naming a SINGLE notable building/tower within a cyberpunk megacity, with these elements ALWAYS baked into the seed text:

(1) Distinctive architectural shape (chrome obelisk / brutalist ziggurat / twisted spire / inverted pyramid / fractal-tiered / etc.)
(2) MASSIVE HOLOGRAPHIC ADVERTISEMENT visible on the building face — often a beautiful android/sexy fashion model/seductive geisha pitching a corporate product (sake / cybernetic upgrade / luxury fragrance / synthetic companion / etc.). Could also be a giant CEO face, propaganda banner, or animated kaiju logo — but lean into the "sexy ad" cyberpunk-trope flavor often.
(3) Dense neon signage (kanji / glyphs / brand logos / flickering tubes) wrapping or climbing the structure
(4) IMPLIED flight traffic — flight-deck balconies / anti-grav landing pads / hovering signage / drone-thoroughfares around the building

THE AESTHETIC: Blade Runner 2049's holographic Joi, Cyberpunk 2077's Lizzy Wizzy spire, Ghost in the Shell's geisha pop-up, Akira's neon-soaked apartment blocks, Fifth Element's vertical city. NEON, HOLOGRAMS, FLYING SPINNERS, DENSE.

Each entry must ALWAYS include:
- The distinctive building (architecture)
- A specific holographic advertisement (often featuring an attractive android/model/geisha — adult-coded fashion/luxury/cybernetic-product pitch)
- Neon signage wrapping it
- A hint of nearby flight traffic / hovering activity

Examples:
1. 800-meter chrome obelisk wrapped in 40-story holographic geisha advertising synthetic sake, neon-pink kanji climbing every column, anti-grav landing pads jutting from upper tiers.
2. Brutalist pyramid corporate tower, massive animated hologram of an iridescent android model in dripping lingerie pitching cybernetic enhancement serum, drone delivery thoroughfares ringing midsection.
3. Twisted Y-shaped Arasaka-style spire, projected face of a corporate CEO smiling across 200 stories, scrolling neon-red propaganda banners, executive spinner-pads ringing penthouse.
4. Inverted-pyramid residential tower with rotating holographic perfume ad showing nude android-figure spritzing glow-mist, electric-blue tube-neon spiraling its scaffold-clad base.
5. Black-mirror skyscraper with giant projected face of a smiling cyborg fashion model selling synth-coffee, hot-pink kanji vertical banners, hover-spinners darting between mid-tier balconies.
6. 200-floor housing block faced with animated mega-billboard of a synthetic geisha bowing in iridescent kimono advertising memory-implants, drone traffic streaking around its peak.
7. Spiral neon-helix tower with projected hologram of a winking pin-up android pitching corporate cigarettes, anti-grav cargo pads at every fifth tier, ion-trail vehicles passing through helix gaps.
8. Brutalist concrete block with full-facade hologram of a swimsuit-clad android lounging on synthetic beach selling vacation memory-tourism packages, neon-kanji climbing scaffolds.
9. Crystalline modular tower with each face displaying different rotating ad-hologram (sexy android pop-star / luxury cyber-watch / synth-companion), drone delivery formations between modules.
10. Pagoda-tiered skyscraper with massive hologram of a kimono-cyborg fashion model advertising designer cyborg-cosmetics, neon-red lantern strings between every tier, hover-taxi traffic at multiple elevations.
11. Coral-organic biomech tower with projected hologram of a translucent android beauty model pitching luxury skin-grafts, bioluminescent neon vines pulsing electric blue.
12. Stepped ziggurat-spire with rotating animated ad of a synthetic dancer in liquid-metal bodysuit selling holo-entertainment subscriptions, neon billboards on every terrace.

Format: ONE entry per line, 20-30 words each. Distinctive building + holographic ad (often sexy/fashion-coded) + neon signage + implied flight traffic. NO franchise proper nouns (Blade Runner / Tyrell / Coruscant / Arasaka — INSPIRED BY, not literal). NO "megastructure" / "Dyson" / "ringworld" — those are different paths. NO sexually explicit content — adult fashion / lingerie / pin-up / model-coded is fine; nudity OK if tasteful (no pornography).`,
  },

  megastructures: {
    theme:
      'colossal artificial structures at planet-or-greater scale — orbital rings, Dyson constructs, planetary mantles. Civilization-as-superstructure. NOTE: this recipe builds the LEGACY MEGASTRUCTURES pool (POOLS.MEGASTRUCTURES). The active megastructure path uses MEGASTRUCTURE_SETTING (iconic buildings in cities) — see the megastructure_setting recipe above.',
    touchpoints: [
      'Halo ring (orbital ring world, visible curvature)',
      "Niven's Ringworld",
      'Dyson sphere/swarm (sun encapsulated)',
      'Bishop Ring habitats',
      "Banks's Culture orbital",
      "Trantor's planetary mantle",
      'Pillars-of-Heaven space elevators',
      'McGuire generation ships',
    ],
    instructions: `Scale must EXCEED planetary. Visible curvature, atmospheric haze at impossible distances. Scale provers: ships are dots, cities are dots-of-dots. Foreground ALWAYS has something at human-comprehensible scale for the brain to anchor on.`,
  },
  space_opera_scenes: {
    theme:
      'spacecraft scenes — distinctive vessels with strong design DNA, in dramatic cosmic settings. Push HARD away from navy-grey-military and tail-fin-50s-rocket clichés.',
    touchpoints: [
      'Heighliners (Dune crystalline impossibles)',
      'Mass Effect Reaper (squid-organic alien)',
      'Babylon 5 Vorlon ship (organic crystalline)',
      'Heavy Metal magazine ships (Moebius / Druillet)',
      'Kirby cosmic vessels (impossible-geometry)',
      'Pacific Rim Kaiju silhouettes (alien biological)',
      'Star Wars Star Destroyer underbelly (low-angle hero)',
      "Banks's Culture ship aesthetics (organic / playful / immense)",
      'Eldar Craftworld (Warhammer 40K — graceful + alien)',
    ],
    instructions: `Ships must be VISUALLY DISTINCTIVE per entry — pick a DESIGN DNA (organic-biological / crystalline-lattice / Kirby-cosmic / ribbed-shell / impossible-geometry / weathered-cargo-haulers) and commit hard. NO gun-grey navy. NO blocky 60s-rocket. NO generic "sleek arrow." Each seed describes ONE ship type at compositional scale + environment that frames it.`,
  },
  space_opera_ships: {
    format: 'simple',
    theme:
      'Cool ICONIC sci-fi spaceships with strong recognizable silhouettes and visible functional parts. Mass Effect Normandy / Halo UNSC Pelican / Cyberpunk Edgerunners AV-4 / Cowboy Bebop Bebop / Expanse Rocinante / Star Wars X-wing-class fighters / Star Trek shuttlecraft / Blade Runner Spinner aesthetic — INSPIRED BY, not literal franchise names. Every ship has a clear cockpit + wings/fins + engines + sometimes weapons.',
    touchpoints: [],
    instructions: `Write 30 SLIM atomic iconic sci-fi spaceship seeds. Each entry: ONE short phrase (20-35 words) naming a single ship + its DISTINCTIVE FUNCTIONAL ANATOMY.

THE FOCUS: COOL RECOGNIZABLE SHIPS with strong silhouettes the eye can read instantly. NOT abstract orb/sphere/megastructure blobs. NOT modern Earth naval (no aircraft carriers / battleships / destroyers). NOT steampunk / dieselpunk / brass-and-copper / Victorian zeppelin. NOT biomech / wraithbone / dolphin-shaped / creature-hull / chitin. PURE FUTURE SCI-FI silhouettes.

ALWAYS bake in:
(1) Specific HULL SHAPE — wedge / arrowhead / cigar / cruciform / disc / dart / blade / pod-cluster / hammerhead / forward-swept-wing / triangular-wedge / etc.
(2) Visible COCKPIT or BRIDGE TOWER — where the crew sits, near the front or upper hull
(3) Visible WINGS / FINS / NACELLES — angled, swept-back, or paired engines on pylons
(4) Visible ENGINES / THRUSTERS — glowing exhaust at the back, plasma trails, ion glow
(5) Optional: visible TURRETS / WEAPONS / SENSOR-ARRAYS / LANDING-GEAR / DOCKING-CLAMPS / CARGO-MODULES

Each ship should look like something out of Mass Effect / Halo / Cyberpunk 2077 spinners / Star Wars / The Expanse / Cowboy Bebop / Star Trek shuttles — clean, sleek-or-utilitarian sci-fi with named parts.

VARIETY across 30 entries — mix the categories evenly:
- SLEEK INTERCEPTORS / FIGHTERS (20-40m, wedge or dart, fast)
- ARMED FRIGATES / CORVETTES (80-200m, cruiser silhouettes, weapons visible)
- HEAVY HAULERS / CARGO-RIGS (200-500m, blocky modular industrial)
- ELEGANT SCIENCE / EXPLORATION VESSELS (150-300m, smooth lines, sensor arrays)
- WORKING SHIPS — tugs, miners, atmospheric transports (50-150m, utilitarian with visible tools)
- CIVILIAN — passenger shuttles, smuggler runabouts, pleasure yachts (30-100m)
- BIG GUNS — armed cruisers / patrol craft / strike-frigates (150-400m, weapon-heavy)

Examples:
1. Sleek 40-meter wedge-fighter with paired forward-swept wings, gunmetal hull with cyan accent stripes, twin plasma thrusters at rear, single cockpit canopy at the nose, wing-tip gauss cannons.
2. Boxy 180-meter modular corvette with rectangular cargo bay slung beneath central hull, bridge tower amidships with viewport row, four ion thrusters in square formation, dorsal twin-barrel turret.
3. Battered 320-meter cargo-rig with stacked container modules along central spine, exposed maintenance gantries with yellow safety rails, single bridge module forward, four massive fusion thrusters trailing blue exhaust.
4. Hammerhead-bow patrol cruiser 240 meters long with wide flat forward weapon platform, three bridge towers stepped along dorsal spine, paired engine nacelles on swept-back pylons, hull paneled in matte-charcoal armor.
5. Arrowhead-shaped 80-meter strike fighter with single canopy at apex, two delta-wings with leading-edge gauss-cannons, twin ramjet thrusters in tandem, ventral missile-bay.
6. 220-meter angular science cruiser with elongated forward sensor probe, glass observation dome at bow, paired ion-drive nacelles on extending pylons, hull painted clean white with orange identification bands.
7. 95-meter utility tug with chunky cylindrical hull, four-pronged docking claws extended forward, side-mounted maneuvering thrusters, single armored cockpit module at the rear, magnetic tow-arrays visible.
8. Sleek 65-meter civilian runabout with sweeping curved hull, panoramic forward viewport, two engine pods slung beneath wing-roots, single belly-mounted entry ramp lowered.
9. Heavy 380-meter assault carrier with broad flight-deck forward, three command towers along port flank, twenty visible launch tubes along ventral hull, paired massive engine nacelles aft glowing teal.
10. 110-meter Mass-Effect-Normandy-coded stealth frigate with rounded organic-clean curves, paired sweep-wing engine pods, central canopy bridge forward, ventral weapon recess, hull glowing soft blue along seams.
11. Cigar-shaped 280-meter generation transport with rotating habitat ring midship for spin-grav, paired RCS thruster clusters at bow and stern, exposed solar-panel arrays, no weapons.
12. Cruciform 130-meter strike interceptor with four perpendicular swept wings and a wing-tip engine on each, single canopy at intersection, central railgun protruding forward.

Format: ONE entry per line, 20-35 words each. Distinctive ship + clear silhouette + named functional parts. NO franchise proper nouns. NO modern Earth naval. NO steampunk / dieselpunk / brass-and-copper. NO biomech / creature-shaped / dolphin / whale / chitin / wraithbone. NO abstract "vessel with geometric volumes" — every entry must have a CLEAR readable silhouette.`,
  },
  space_opera_setting: {
    theme:
      'DYNAMIC FIGHTER-ACTION SETTINGS — places where starfighters dogfight, recon, chase, or skim. Each entry is one specific action environment with motion-friendly cinematic depth. NO static landscape views. NO ground-level architecture. Pure space + atmospheric action contexts.',
    touchpoints: [
      'asteroid canyon (rocks at varied scale + tight spaces)',
      'debris field of broken capital wreck (twisted hull fragments)',
      'capital ship hull surface (skimming low along armor terraces)',
      'nebula cloud chase corridor (gas wisps + reduced visibility)',
      'station approach choke point (narrow corridor + defense turrets)',
      'planet ring plane traverse (ice + rock + reflected sunlight)',
      'low-orbital strike zone above industrial planet',
      'gas giant cloud dive (storm bands + lightning)',
      'enemy fighter formation interception zone',
      'orbital shipyard scaffolding maze (skeletal frames)',
      'comet tail trail (vapor streams)',
      'mining-belt industrial cluster (rigs + cargo frames)',
    ],
    instructions: `EACH ENTRY IS A DYNAMIC SCI-FI ACTION SETTING — 25-50 words. SINGLE FLOWING SENTENCE PER ENTRY. No ship described. No camera. Just the SETTING where the fighter is acting.

FORMAT: numbered 1-25. One sentence each.

Per entry MUST include:
- SETTING TYPE (canyon / debris field / hull surface / nebula corridor / station maze / etc.)
- MOTION FRIENDLINESS — tight spaces, obstacles to weave around, or open vistas with depth markers
- COSMIC ANCHOR (planet / station / capital backdrop / asteroid / nebula — at least one element)
- ONE memorable detail (drifting wreckage / lightning flash / running-lights pulsing / etc.)

VARIETY MANDATE across 25 entries:
- Tight spaces (50%): asteroid canyons / debris fields / station corridors / shipyard mazes / capital-hull skim
- Open vistas (50%): nebula chases / planet ring traverses / low-orbital strikes / gas giant dives / open void with capital backdrop

EXAMPLES (flavor anchors; invent 25 distinct):

1. Tight asteroid canyon with massive rocks tumbling at varied scales, narrow gaps between fragments forcing the fighter to weave through, distant starfield through the canyon opening.

2. Skimming low along the hull surface of a massive capital ship, armor terraces and weapon emplacements blurring past beneath the fighter, dorsal sensor pylons and antenna clusters rushing by.

3. Inside a debris field of a broken capital wreck, twisted hull fragments and glowing wreckage drifting at varied angles, vapor streams from ruptured fuel lines creating a smoky maze.

ABSOLUTE BANS:
- NO ship described (ships come from a separate axis)
- NO action described (actions come from a separate axis)
- NO ground-level / planetary-surface views — these are SPACE / HIGH-ATMOSPHERE settings
- NO cathedral / temple / fortress / planetary architecture
- NO franchise proper nouns

Output 25 numbered list entries.`,
  },
  busy_fleet_elements: {
    format: 'simple',
    theme:
      'Scene-filling elements that populate dense sci-fi space scenes around a featured spaceship: EVA crews on tethers, magnetic dock grapples, supply ships parallel-running, refueling tenders, gantries with welding sparks, hauler queues, drone swarms, sensor buoys, debris fragments, capital ship hulls as deep-background scale anchors, station infrastructure, repair scaffolds, escort craft.',
    touchpoints: [],
    instructions: `Write 30 scene-filling sci-fi space elements that go AROUND the featured spaceship in a busy scene. One sentence each. Detailed, specific, visual — describe count + motion + glowing detail.

Mix industrial activity (EVA crews on tethers, gantries with welding sparks, magnetic grapples docking, supply ships running parallel, refueling tenders, cargo bay traffic) with combat support (escort craft, drone swarms, sensor buoys, capital ship silhouettes in deep background, debris fragments).

Each entry should add depth and density to a scene — not be the hero itself, just a textural element making the scene FULL.

Examples:
1. White EVA-suited figures moving like stretched marionettes along tether lines anchored to a hull breach, magnetic grapples glowing blue at contact points.
2. A parallel supply ship 200 meters off the starboard flank, exposed aluminum truss-work gantry extending across the gap, cargo pods crawling on rails.
3. The deep-background silhouette of a kilometer-class capital hull receding into atmospheric haze, lit window-grids speckling its flanks, weapon batteries flashing distantly.

Output 30 numbered list entries.`,
  },
  battle_dynamics: {
    format: 'simple',
    theme:
      'Action and drama moments that bring a sci-fi space scene alive: weapons firing, shields flaring, hull-strikes sparking, missile contrails streaking, refinery accidents venting, reactor overloads glowing, debris tumbling, drive sections venting plasma.',
    touchpoints: [],
    instructions: `Write 30 action / drama moments that add visible activity to a sci-fi space scene. One sentence each. Frozen at a loaded instant — visual cues that read in a still frame.

Mix combat dynamics (laser bolts mid-flight, missile contrails arcing, shields flaring under impact, explosion blooms, hull-strike sparks) with industrial drama (refinery venting, reactor coolant flares, drive overloads, structural failures, escape pods launching).

Each entry adds motion + energy + drama to the frame.

Examples:
1. Twin energy lances mid-discharge crossing the frame in parallel streams, recoil-heat venting from accordion radiators glowing dull red.
2. Reactor coolant pump rupturing mid-frame, friction-heat sparks cascading through bulkhead struts, blue micro-discharges crackling along antenna edges.
3. A salvo of missiles spiraling outward in helical contrails, intercept bursts blooming in the deep midground, scattering hot debris.

Output 30 numbered list entries.`,
  },
  ship_action: {
    format: 'simple',
    theme:
      'What the featured spaceship is doing in this exact frame — posture, motion, drive state, weapons status, hull condition. Verb-led when possible.',
    touchpoints: [],
    instructions: `Write 30 ship-action descriptions — what the featured sci-fi spaceship is DOING in the scene. One sentence each. Frozen at a loaded instant.

Mix dynamic combat (banking hard / strafing / firing main weapons / launching missiles) with industrial activity (docking with station / mating to refueling tender / opening cargo bay doors / deploying repair drones / venting coolant) with cinematic stillness (coasting cold through debris / drifting damaged / silent observation / mid-FTL exit).

Each entry adds posture and meaning to the featured ship.

Examples:
1. Drifting damaged through Lagrange anchorage, hull breach venting orange sparks, twin micro-adjustment thrusters firing crystalline vapor to maintain attitude.
2. Mating dock with parallel supply ship, exposed aluminum truss-work gantry extended, magnetic grapples engaging in blue arcs.
3. Banking hard 60 degrees through a debris field, engine plasma trails curving in a spiral, point-defense web tracking incoming fragments.

Output 30 numbered list entries.`,
  },
  // ════════════════════════════════════════════════════════
  // SPACE_OPERA PREMIUM-TIER ENRICHMENT (2026-05-31 reactivation)
  // 5 new path-bespoke axes pushing SPACE_OPERA to 10 bespoke pools.
  // ════════════════════════════════════════════════════════
  space_opera_crew_signal: {
    format: 'simple',
    theme:
      'Visible LIFE on or around the featured spaceship — readable counts of crew/EVA/deck-personnel/bridge-silhouettes/maintenance-teams/gunner-cupolas. Makes the ship feel inhabited and gives the viewer a scale-prover at body-level. Always a specific COUNT + SCALE + WHERE-on-the-ship.',
    touchpoints: [],
    instructions: `Write 25 crew-signal descriptions — visible life elements on/around a featured sci-fi spaceship. One sentence each, 18-32 words. Each must name a COUNT, SCALE, and the LOCATION on/around the ship.

Mix across these life-on-ship vignettes:
- Bridge / cockpit silhouettes seen through canopy (count: 1–8 figures, lit panel glow)
- EVA / spacewalker teams tethered to hull (count: 3–20 figures in white/orange suits)
- Deck crew / launch-handlers on flight deck (count: 12–60 figures with light wands or orange vests)
- Gunner cupolas / turret pods with visible operator (count: 2–8 turrets with visible heads)
- Maintenance / repair crew on gantries (count: 4–24 figures with welding sparks)
- Marines / boarding parties at airlock (count: 6–30 in armored suits, weapons visible)
- Cargo handlers loading shuttles (count: 8–40 figures with anti-grav pallets)
- Refugees crowding observation decks (count: 50–500 silhouettes in lit windows)
- Sentries patrolling external catwalks (count: 1–6 figures, helmet glow)
- Engineers in plasma-glow under exposed drive plates (count: 4–12 figures in protective gear)
- Passengers visible through habitat-ring viewports (count: 30–200 lit silhouettes)
- Sick-bay / medical staff visible through illuminated medbay window (count: 4–12 in white)
- Crew on parallel-running auxiliary vessel waving (count: 5–20 distant figures)
- Drone-handler operators with hand-tracking gloves (count: 2–8 figures, holographic interface glow)
- Officers on observation balcony watching battle (count: 1–4 figures in dress uniform)

Each entry must specify (a) the COUNT, (b) the SCALE (ant-sized vs body-readable), (c) the LOCATION on the ship. NO vague "crew visible" — always concrete.

Examples (DO NOT copy verbatim — write 25 new entries varying these patterns):
1. Twelve lit bridge silhouettes visible through the forward canopy windows, holographic tactical displays glowing turquoise around them like a halo, each figure leaning at a different angle reading instruments.
2. Six white-suited EVA workers tethered to a midship hull breach, two welding sparks arcing yellow against the dark hull plating, the other four passing salvaged plate sections hand-to-hand.
3. Thirty deck crew in orange high-visibility vests waving signal wands along the flight deck, four atmospheric craft in formation behind them ready for launch, blast deflectors raised.

NO franchise proper nouns. NO Earth-naval (no aircraft-carrier deck-mules / battleship-marines). The crew should feel like sci-fi spacefaring personnel — pressure-suits, helmet glows, retroreflective stripes, magnetic boots, tether harnesses.

Output 25 numbered list entries.`,
  },
  space_opera_faction_iconography: {
    format: 'simple',
    theme:
      'Visible markings/badges/colors painted, etched, or decaled onto the featured spaceship — heraldic identifiers that hint at allegiance: corporate trade sigils, military squadron numerals, pirate clan banners, alien empire glyphs, civilian/civic markings. Always specific PLACEMENT + SHAPE + COLOR.',
    touchpoints: [],
    instructions: `Write 25 faction-iconography descriptions — heraldic markings visible ON the featured sci-fi spaceship hull. One sentence each, 18-30 words. Each must name a SHAPE, COLOR, and HULL PLACEMENT.

Mix across allegiance flavors:
- Corporate trade-house sigils (geometric monograms in brand colors — gold/silver/chrome wedges, polygonal logos, chevron stripes)
- Military squadron numerals + insignia (large painted digits, division shields, kill-marks, mission tally hash-marks)
- Pirate / mercenary clan banners (skulls, blades, scratched-on tally marks, hand-painted faction names)
- Alien empire glyphs (non-Latin symbols — angular, organic, ideographic, glowing inset)
- Federation / Republic clean iconography (concentric rings, eagle/sun symbols, official seals)
- Religious / cult markings (mandala patterns, prayer-glyphs, ankh-equivalents, painted rune-strips)
- Civilian / civic identification (registration codes in tall block-letters, color-coded planet-of-origin bands)
- Smuggler / underworld markings (concealed dual-identity decals, scratched-off registration over old)
- Generation-ship lineage seals (multi-generation lineage trees painted across the hull)
- Mercenary contract codes (geometric patterns indicating active employer)

Specify:
(a) the SHAPE — what the marking visually is (a four-pronged star, a three-bar chevron, a circle with a slash)
(b) the COLOR / FINISH — gloss / matte / enamel / pearl / glow-edged / weathered / scratched
(c) the HULL PLACEMENT — port flank / dorsal spine / engine nacelle / nose / wing-root / aft hull / canopy frame

Examples (DO NOT copy verbatim):
1. A four-pronged silver-and-cobalt mercantile star emblem stenciled twice on each port flank, gloss-paint over weathered base, edges chipped from micrometeor impacts.
2. Three-digit black squadron numerals painted shoulder-high across the dorsal hull spine, flanked by twelve smaller kill-mark hash slashes in flat yellow.
3. A coiled-serpent pirate clan banner crudely hand-painted in dripping red across the starboard flank, layered over a half-scratched-off military registration code beneath.

NO franchise proper nouns (no Star Wars / Star Trek / Halo / Mass Effect names). NO Earth-historical (no swastikas, hammer-and-sickle, US/UK/Russian roundels). All iconography should read as future-sci-fi-coded.

Output 25 numbered list entries.`,
  },
  space_opera_propulsion_signature: {
    format: 'simple',
    theme:
      'Engine / drive aesthetic visible behind the featured spaceship — the colored exhaust, plume shape, glow signature, trail length, heat-bloom, thermal aura. The drive is the strongest visual identity differentiator in space opera. Always specific COLOR + PLUME SHAPE + LENGTH.',
    touchpoints: [],
    instructions: `Write 25 propulsion-signature descriptions — drive/engine visual signatures rendered as visible light/exhaust BEHIND the featured sci-fi spaceship. One sentence each, 16-28 words. Each must name a COLOR, PLUME SHAPE, LENGTH, and any secondary visual.

Mix across propulsion philosophies:
- Plasma drives — colored hot plumes (electric-blue / violet / cyan / ion-pink / acid-green)
- Fusion torch drives — long bright white-yellow trails with secondary heat bloom
- Antimatter / matter-conversion — eye-searing violet-white pinpoint glare, near-zero trail
- Chemical / RCS — sharp white-yellow exhaust plumes, short, dirty
- Ion drives — pale blue / faint cyan, near-silent, nearly invisible long trail
- Quantum / FTL signatures — distorted spacetime ripple, lens-flare halo, blue-shift afterimage
- Fold-drive / warp emergence — Cherenkov-blue glow, shockwave ring, trailing afterimage
- Reaction-mass (cold-gas) thrusters — crystalline white vapor puffs, short-duration
- Damaged / asymmetric — uneven plume colors (one engine bright, one cold/sputtering)
- Stealth / cold-coasting — no visible plume, heat-sink panels glowing dull red
- Solar-sail propulsion — vast translucent mirrored sail catching distant star-light
- Mass-driver kick-stages — sequential burst-flares like camera-flash strobes
- Sublight chemical — smoky orange exhaust trail, particulate visible

Specify:
(a) COLOR — exact named hue (electric cobalt-blue / acid-green / pinprick violet-white / pale ion-cyan)
(b) PLUME SHAPE — cone / triple-cone / pinpoint / wide-fan / corona / ring / vapor-puff
(c) LENGTH — pinpoint / short / medium / long-trailing / km-long / fading-into-infinity
(d) SECONDARY DETAIL — heat-bloom on radiator panels / shockwave / ripple / afterimage / particulate

Examples (DO NOT copy verbatim):
1. Twin electric-cobalt plasma cones four times the hull length, surrounded by faint pulsating violet shock-rings, secondary heat-bloom glowing dull red on accordion radiator panels.
2. Single pinpoint antimatter glare brighter than nearby starfield, near-zero trail, lens-flare distortion bending the surrounding star-field around its core.
3. Faint pale ion-blue glow trailing forty hull lengths, fading into invisibility, no shock or particulate — ghostly cold-running stealth coast.

NO Earth-rocket smoke (no Saturn-V orange smoke trails / no Space-Shuttle billowing exhaust). The drive should feel future-sci-fi-coded.

Output 25 numbered list entries.`,
  },
  space_opera_genre_register: {
    format: 'simple',
    theme:
      'NARRATIVE TONE / GENRE of the frame — military thriller, pirate adventure, diplomatic incident, first contact, lost-ship horror, smuggler chase, generation-ship arrival, etc. Sets the emotional register that ship_action + setting must reinforce.',
    touchpoints: [],
    instructions: `Write 25 genre-register descriptions — distinct narrative TONES that a space-opera frame could be set in. One sentence each, 18-32 words. Each names a GENRE + the MOOD + the VISUAL CUE that reads it.

Mix across sci-fi narrative registers:
- MILITARY THRILLER — taut, disciplined, formation-flying, capital-ship-and-escorts, clean uniform colors
- PIRATE ADVENTURE — ragged, swagger, contraband cargo, scratched paint, multi-flag, brigand swagger
- DIPLOMATIC INCIDENT — gleaming polished, dignitaries-aboard, escort honor-guard, tense stillness
- FIRST CONTACT — slow, reverent, careful approach, lone vessel meeting alien craft, awe-stillness
- LOST-SHIP HORROR — drifting, silent, no lights, hull breach, no crew visible, dread atmosphere
- SMUGGLER CHASE — fast, broken-light, evasive maneuvers, pursuit through hazard, frantic energy
- GENERATION-SHIP ARRIVAL — vast, slow, ancient, weathered, weight-of-centuries gravitas
- SCIENCE EXPEDITION — clean, white, observation domes, drone swarms, deliberate calm
- COLONY EVACUATION — desperate, overcrowded, civilian craft, distant explosions, urgency
- BLACK-OPS INFILTRATION — stealth, dark hulls, no markings, EM-suppressed glow, predatory
- TRADE-CONVOY ESCORT — workhorse, methodical, cargo-haulers under fighter cover, businesslike
- WAR-WEARY HOMECOMING — battle-damaged, somber, slow approach to friendly station, melancholy
- CULT-CRUSADE — ornate, religious, banner-draped, ritual-style markings, fervor
- MEGACORP POWER-PROJECTION — pristine, intimidating, perfect formation, brand-saturation
- ALIEN-EMPIRE ENVOY — exotic, unsettling, non-human geometry, slow-moving, otherworldly threat
- PRISON-TRANSPORT — utilitarian, armored, stark, surveillance-heavy, joyless
- REFUGEE-FLOTILLA — patchwork, multi-vessel, mixed colors, hand-painted prayers, hope-and-loss

Each entry: name the GENRE, the MOOD (one adjective), and the VISUAL CUES that signal it (paint condition / lighting / formation / pace).

Examples (DO NOT copy verbatim):
1. Pirate-adventure register: swaggering ragged cruiser with mismatched scratched paint and three different faction flags painted over each other, weapons-pylons hung with prize-claims, mid-chase swagger.
2. Lost-ship horror register: silent unlit hulk drifting derelict, hull breached at midship, no running lights, no crew visible through any window, dread stillness, faint vapor escaping a single sealed compartment.
3. First-contact register: lone clean-hulled science vessel hovering reverently 800 meters from an unknown alien craft of impossible angular geometry, lights dimmed in deferential gesture, slow careful approach.

Output 25 numbered list entries.`,
  },
  space_opera_signature_hull_feature: {
    format: 'simple',
    theme:
      'The ONE weird, memorable detail on the featured spaceship — asymmetric exhaust manifold / ribbed armor pattern / glasshouse observation pod / fungal hull-corrosion / vine-overgrown wreck / battle-scar mosaic / oversized comm-dish / decorative figurehead. Gives each render a "remember THIS one" element.',
    touchpoints: [],
    instructions: `Write 25 signature-hull-feature descriptions — one weird memorable readable-focus detail on the featured sci-fi spaceship. One sentence each, 14-28 words. Each names a SPECIFIC FEATURE + SHAPE + WHERE-ON-HULL + WHY-IT-READS.

Mix across feature categories:
- Asymmetric anomalies (one engine larger / cockpit offset to one side / single oversized weapon port)
- Battle scars (huge gouge across portside / patched-with-mismatched-plate breach / blackened bombardment crater)
- Custom modifications (welded-on extra weapon mount / strapped-on cargo container / patched salvage hull-section)
- Organic infiltration (fungal hull-corrosion in green-and-orange patches / crystalline xeno-growths / vine-overgrown wreck-cluster)
- Optical features (glasshouse observation pod jutting from spine / mirror-finish bow / fully-glazed nose)
- Decorative / cultural (figurehead carved into bow / painted nose-art / hand-painted prayer-glyphs across midship)
- Antenna/sensor anomalies (oversized dish on dorsal spine / forest of bristling sensor arrays / radar mast longer than the ship)
- Weathering signatures (sun-bleached on one side only / micrometeor scarring across nose / acid-pitted hull on one flank)
- Strange protrusions (extending grav-rod / oversized cooling fin / decorative spire / docking-claw armada)
- Light-art (glowing color-changing seams / decorative LED runs along hull lines / illuminated cockpit "eyes")
- Tertiary structures (parasite-craft docked on hull / external cargo strung with rope-nets / barnacle-cluster of escape pods)
- Coloration anomalies (one panel painted differently / chrome-mirror nose / matte-vantablack stealth-skin)

Specify:
(a) THE FEATURE — name what it is
(b) THE SHAPE — physical description
(c) HULL PLACEMENT — port / starboard / dorsal / ventral / bow / aft / midship / nacelle
(d) WHY-IT-READS — what makes it stand out (size / color / wear / contrast)

Examples (DO NOT copy verbatim):
1. A glasshouse observation pod jutting from the dorsal spine like an upturned glass thimble, lit warm-yellow from within, twelve tiny silhouettes visible through the panes.
2. Portside hull scarred by a five-meter gouge mid-flank, exposed structural ribs visible beneath, three mismatched patch-plates welded over the deepest section.
3. Fungal hull-corrosion blooming across the starboard nacelle in patches of acid-green and ochre-orange, growing through paneling seams like rust-flowers, organic and unsettling.

The feature should be SPECIFIC enough that Sonnet bakes it into the prompt with a count/color/scale phrase. NO generic "weathered hull" — always pick a specific feature with placement.

Output 25 numbered list entries.`,
  },
  space_opera_story_beat: {
    theme:
      'ACTION NARRATIVE BEATS for fighter-action scenes — the dramatic moment the scene captures. Pursuit / Dogfight / Recon Discovery / Spy Mission Penetration / Wingmate Loss / Breakaway / Last-Stand / Bombing Run / Ambush / Daring Escape. Each entry sets the narrative stakes.',
    touchpoints: [
      'mid-pursuit fighter chase',
      'dogfight in tight formation',
      'recon discovery (sensor ping reveals threat)',
      'spy mission penetration past defenses',
      'wingmate just went down',
      'breakaway after critical mission',
      'last-stand defense run',
      'bombing run on capital target',
      'ambush sprung from debris',
      'daring escape through enemy formation',
      'rescue extraction under fire',
      'reconnaissance silent approach',
    ],
    instructions: `EACH ENTRY IS A NARRATIVE STORY BEAT — 20-35 words. SINGLE SENTENCE PER ENTRY. Describes the DRAMATIC MOMENT the scene captures — what's at stake, what just happened, or what's about to happen.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- A NARRATIVE FRAME (mid-pursuit / dogfight peak / recon discovery / etc.)
- WHAT'S AT STAKE (rescue / escape / sabotage / silent observation / etc.)
- DRAMATIC TENSION (the moment of decision, action, or consequence)

VARIETY MANDATE across 20 entries:
- Combat beats (50%): dogfight peak / strafing run / bombing target / last-stand / ambush
- Pursuit/escape beats (25%): chase mid-flight / daring escape / breakaway / pursuit weave
- Stealth beats (15%): spy penetration / recon silent / sensor discovery / silent approach
- Loss/heroic beats (10%): wingmate destruction / rescue extraction / sacrifice moment

EXAMPLES (flavor anchors; invent 20 distinct):

1. Mid-pursuit fighter chase — the hero is being hunted by superior enemy formation through narrow asteroid corridors, every maneuver risking destruction.

2. Recon discovery — the hero's sensors just lit up with massive enemy presence, the moment of frozen realization before evasive action begins.

3. Bombing run on capital target — the hero is mid-strafing along an enemy capital's vulnerable section, weapons firing, dodging defense fire.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 35 words
- NO settings described
- NO ship described

Output 20 numbered list entries.`,
  },
  space_opera_composition: {
    theme:
      'FIGHTER FRAMING / CAMERA PERSPECTIVES — how the camera frames the action. Cockpit POV / wingman view / under-the-keel skim / overhead chase / behind-shoulder / cinematic 3/4 / diving angle / asteroid-gap perspective / etc. Each entry is one specific camera framing rule.',
    touchpoints: [
      'cockpit POV looking forward through canopy',
      'wingman-view from companion fighter',
      'under-keel skim camera (skimming asteroid surface)',
      'overhead chase cam',
      'behind-shoulder pursuit framing',
      'cinematic 3/4 angle on the hero',
      'diving angle looking down past wings',
      'asteroid-gap perspective (thin opening)',
      'side-profile racing camera',
      'tail-chase POV (camera behind enemy)',
      'mid-bank rotated camera',
      'low-angle hero shot (camera below fighter looking up)',
    ],
    instructions: `EACH ENTRY IS A CAMERA FRAMING / COMPOSITION RULE — 15-30 words. SINGLE SENTENCE PER ENTRY. Describes WHERE THE CAMERA IS and how it FRAMES the fighter action.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- CAMERA POSITION (cockpit / wingman / overhead / behind-shoulder / under-keel / etc.)
- WHAT THE FRAME SHOWS (forward through canopy / hero in 3/4 / etc.)
- ONE compositional detail (motion blur / depth-of-field / wide vs tight / etc.)

VARIETY MANDATE across 20 entries:
- POV cameras (35%): cockpit forward / canopy view / pilot's perspective
- Chase cameras (25%): behind-shoulder / tail-chase / wingman-view / overhead chase
- Cinematic angles (25%): 3/4 hero / low-angle dramatic / side-profile racing / diving angle
- Tight-spaces (15%): asteroid-gap / station-corridor / debris-thread / hull-skim

EXAMPLES (flavor anchors; invent 20 distinct):

1. Cockpit POV looking forward through the canopy, HUD targeting overlays visible against the starfield, hands gripping flight stick in foreground.

2. Wingman-view from a companion fighter at 50-meter offset, the hero captured in 3/4 angle banking right, engine plasma streaks blurring with motion.

3. Under-keel skim camera, the fighter rushing above an asteroid surface or hull terrace, scale-blurring detail rushing past beneath.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 30 words
- NO settings described (separate axis)
- NO ship described (separate axis)

Output 20 numbered list entries.`,
  },
  space_opera_lighting: {
    theme:
      'SPACE-ACTION LIGHTING — engine bloom / weapon flash / nebula backlight / hull-strike spark / explosion glow / sun rim-light / planet earthlight / etc. Each entry is one specific lighting situation for fighter-action scenes.',
    touchpoints: [
      'engine plasma bloom as primary light',
      'weapon-fire flash from forward cannons',
      'nebula backlight (magenta-cyan diffuse)',
      'hull-strike spark + ricochet light',
      'explosion glow filling the frame',
      'distant sun rim-light on hull edges',
      'planet earthlight reflecting from below',
      'station floodlights catching the fighter',
      'shield-impact flare illuminating the cockpit',
      'missile contrail trail glow',
      'volumetric god-rays through nebula gaps',
      'cold deep-void starlight with strong contrast',
    ],
    instructions: `EACH ENTRY IS A LIGHTING SETUP — 20-35 words. SINGLE SENTENCE PER ENTRY. Describes the dominant light source and how it illuminates the fighter-action scene.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- PRIMARY LIGHT SOURCE (engine bloom / weapon flash / nebula glow / sun / planet earthlight / etc.)
- COLOR / TEMPERATURE (cyan-blue / orange-red / magenta-violet / cold-white / etc.)
- HOW IT HITS THE HERO (rim-light on hull / fill on canopy / silhouette backlight / etc.)
- CONTRAST quality (dramatic chiaroscuro / soft volumetric / harsh strobing)

VARIETY MANDATE across 20 entries:
- Engine/weapon light (40%): plasma bloom dominant / cannon flash / missile trail glow / shield flare
- Cosmic light (35%): nebula backlight / sun rim-light / star strobe / volumetric god-rays
- Environment light (25%): planet earthlight / station floodlights / capital-ship hull-glow / explosion fill

EXAMPLES (flavor anchors; invent 20 distinct):

1. Engine plasma bloom as primary light — cyan-blue glow from the fighter's twin nozzles illuminating the hull and casting motion-streaks across the dark backdrop.

2. Nebula backlight in magenta and cyan, the fighter silhouetted against soft volumetric gas wisps, hull edges catching faint diffuse pink light.

3. Weapon-fire flash from forward cannons — harsh strobing white-blue light pulsing on the hull and momentarily blowing out the dark backdrop.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 35 words
- NO settings described (separate axis)
- NO ship described (separate axis)
- NO Earth-natural lighting (forest sunset / beach sunrise / etc.) — pure space/cosmic lighting

Output 20 numbered list entries.`,
  },
  space_opera_particulate: {
    theme:
      'COSMIC PARTICULATE FOR FIGHTER-ACTION — debris haze, plasma cloud, nebula gas, ice crystals streaming, vapor trails, smoke contrails, atmospheric particle scattering. Adds depth and motion to the scene.',
    touchpoints: [
      'debris haze drifting through frame',
      'plasma cloud from engine wash',
      'nebula gas wisps swirling',
      'ice crystal streams in vacuum',
      'vapor contrail trail behind fighter',
      'smoke trail from damaged hull',
      'atmospheric particle scatter',
      'dust kicked up from low skim',
      'frost vapor from coolant vent',
      'asteroid pulverized fragments',
      'energy-weapon ionization residue',
      'electrical micro-discharge sparks',
    ],
    instructions: `EACH ENTRY IS A PARTICULATE / ATMOSPHERIC EFFECT — 15-30 words. SINGLE SENTENCE PER ENTRY. Describes airborne or vacuum particulate that adds depth and motion.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- WHAT KIND of particulate (debris / plasma / gas / ice / vapor / smoke / dust / etc.)
- HOW IT MOVES (drifting / streaming / swirling / arcing / etc.)
- COLOR / OPACITY (faint magenta haze / orange plume / ice-white crystals / etc.)

VARIETY MANDATE across 20 entries:
- Engine/weapon particulate (35%): plasma wash, vapor contrails, smoke trails, ionization residue
- Debris particulate (30%): pulverized rock fragments, hull-strike sparks, asteroid dust, wreckage fragments
- Cosmic particulate (35%): nebula gas, ice crystals, planetary frost, electrical micro-discharge

EXAMPLES (flavor anchors; invent 20 distinct):

1. Plasma cloud trailing from the fighter's engine wash, cyan-blue ionized particles streaming behind in a turbulent vortex.

2. Debris haze drifting across the frame at varied speeds, broken hull fragments and dust particles scattering light from distant explosions.

3. Ice crystal streams in vacuum, the fighter passing through frozen vapor catching starlight as a sparkling cloud.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 30 words
- NO Earth-weather (rain / snow / fog / hail) — pure cosmic/sci-fi particulate
- NO settings described (separate axis)
- NO ship described (separate axis)

Output 20 numbered list entries.`,
  },
  space_opera_emotion: {
    theme:
      'ACTION-MOOD EMOTIONAL DNA for fighter scenes — adrenaline, pursuit-thrill, desperation, defiant heroism, triumph, focused-calm-before-strike, dread of overwhelming force, righteous fury, exhilaration. Each entry is one emotional tone for the scene.',
    touchpoints: [
      'adrenaline rush mid-dogfight',
      'pursuit-thrill chasing target',
      'desperation breaking from disaster',
      'defiant heroism against odds',
      'triumph after critical kill',
      'focused calm before the strike',
      'dread of overwhelming force',
      'righteous fury at injustice',
      'exhilaration of breakneck speed',
      'silent stealth-tension',
      'last-stand resolve',
      'survival-mode raw nerve',
    ],
    instructions: `EACH ENTRY IS AN EMOTIONAL DNA TONE — 15-25 words. SINGLE SENTENCE PER ENTRY. Describes the emotional mood / energetic atmosphere of the fighter-action scene.

FORMAT: numbered 1-15. One sentence each.

Per entry MUST include:
- EMOTIONAL TONE (adrenaline / dread / triumph / desperation / etc.)
- ENERGETIC QUALITY (high-tempo / slow-tension / explosive / focused / etc.)
- VISUAL CUE that conveys it (sharp contrast / motion blur / wide eyes / etc.)

VARIETY MANDATE across 15 entries:
- High-energy: adrenaline / exhilaration / pursuit-thrill / fury / triumph
- Mid-energy: focused calm / defiant heroism / righteous resolve / survival-mode
- Tension: stealth-tension / dread / desperation / last-stand

EXAMPLES (flavor anchors; invent 15 distinct):

1. Adrenaline rush mid-dogfight, high-tempo motion blur and harsh-contrast lighting conveying frantic energy.

2. Defiant heroism against impossible odds, the hero fighter blazing forward with engine plasma at full burn despite overwhelming enemy presence.

3. Silent stealth-tension, the fighter creeping through cover with engines barely glowing, every hull seam dimmed.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 25 words
- NO settings described (separate axis)
- NO ship described (separate axis)

Output 15 numbered list entries.`,
  },
  weather_particulate: {
    format: 'simple',
    theme:
      'Universal atmospheric particulate / weather effects that fill the air in a sci-fi scene — dust, mist, vapor, ash, plasma, aurora, radiation, glitter, etc.',
    touchpoints: [],
    instructions: `Write 30 atmospheric particulate / weather effects. Each entry: lowercase descriptive phrase — short body explaining how it fills the air and catches light. One sentence per entry.

Examples:
1. thick atmospheric haze — dense particulate suspending light into visible volumetric beams, distance fades into gradient
2. wind-driven dust haze — orange or amber dust streaming horizontally across the frame, sand-grain texture in the air
3. acid-rain fog — corrosive humid mist clinging to surfaces, vapor visible at ground level
4. ash drift — fine dark particulate falling slowly through the frame, accumulating on horizontal surfaces, sky overcast
5. ionized plasma shimmer — heat-rippled distortion across the frame, brief electric flickers along edges

Avoid duplicating: thick atmospheric haze, wind-driven dust haze, acid-rain fog, vapor streams from vents, clear cold air, ash drift. Invent NEW particulate — coral spore drift, magnetic-storm aurora veil, radiation snow, crystalline frost crystals suspended, bioluminescent plankton drift, gravitational lensing distortion, solar-wind ribbon, etc. Mix terrestrial, atmospheric, vacuum, and supernatural effects. Output 30 numbered list entries.`,
  },
  real_space_subjects: {
    format: 'simple',
    theme:
      "SLIM atomic seeds for photoreal astrophotography — named real astronomical objects, ~15-25 words each. The brief composer layers in scale_provers / weather / surprise_element / story_beat / composition / lighting at render time, and Sonnet weaves it all into the polished multi-wavelength composite prompt. Pool entries provide the SUBJECT IDENTITY only; layering is the axis system's job.",
    touchpoints: [],
    instructions: `Write 30 SLIM atomic astronomical-subject seeds. Each entry is ONE short phrase (15-25 words) naming a real astronomical object + a 1-clause characterization of its distinctive visual signature. NO full scene paragraphs. NO scale-prover spacecraft (that's an axis layer). NO instrument framing language (the medium wrapper handles that). Just: named object + its defining visual feature.

Use the FULL CATALOG widely — never repeat the same object class. Messier (M1-M110), NGC catalog, named exoplanets (TRAPPIST-1 / Proxima b / Kepler-452b), supergiant stars (Betelgeuse / Rigel / Eta Carinae / R136a1 / VY Canis Majoris), planets + moons (Jupiter / Saturn rings / Io / Europa / Titan / Enceladus / Triton / Pluto-Charon), nebulae (Crab / Orion / Eagle / Carina / Helix / Cat's Eye / Veil / Lagoon / Trifid / Pelican / Tarantula / Boomerang / Pillars of Creation / Mystic Mountain), galaxies (Andromeda / Whirlpool / Sombrero / Cartwheel / Mice / Antennae / Stephan's Quintet), galaxy collisions (Antennae / Mice / Cartwheel), black holes (M87 / Sgr A* / Cygnus X-1), quasars + AGN (3C 273), pulsars + magnetars, supernova remnants (Cassiopeia A / Vela / SN 1054), asteroid fields + Kuiper belt objects (Psyche / Vesta / Ceres / Eros / Bennu / Arrokoth), comets (Hale-Bopp / NEOWISE / Halley / Borisov), globular + open clusters (Omega Centauri / 47 Tucanae / M13 / Pleiades), molecular clouds, star-forming regions, neutron-star mergers, kilonovas, gamma-ray bursts.

Examples:
1. NGC 4038/4039 Antennae Galaxies mid-collision — twin spiral nuclei spiraling kiloparsecs apart with tidal bridge of disrupted stars.
2. Cassiopeia A supernova remnant — expanding electric-orange shockwave shell with neutron-star pulsar ejecting particle streams at center.
3. M87 supermassive black hole — asymmetric accretion disk Doppler-boosted around event horizon shadow with relativistic jet shooting 5,000 light-years.
4. Crab Nebula M1 — pulsar wind nebula with electric violet filaments and crimson-gold gas shell.
5. Carina Nebula Mystic Mountain — three-light-year column of cold molecular hydrogen with embedded protostar jets erupting at tip.
6. Jupiter Great Red Spot — anticyclonic storm 1.3 Earth-widths wide churning crimson-amber against electric cyan banded clouds.
7. Saturn's rings backlit — gossamer A/B/C/D ring structure with Cassini Division and shepherd moons casting shadow scallops.
8. Pillars of Creation — Eagle Nebula's elephant-trunk gas pillars sculpted by stellar wind with photoevaporating tips.
9. R136a1 hypergiant — most massive known star blazing blue-white at 9 million suns from cluster heart of 30 Doradus.
10. Kilonova merger GW170817 — neutron-star collision afterglow fountaining gold + platinum atoms in white-hot jets.

Format: ONE entry per line, 15-25 words each. ALL-CAPS or capitalized named object + descriptive clause. NO fictional objects, NO franchise references, NO scale-prover spacecraft, NO instrument-name framing.`,
  },
  cozy_moment: {
    format: 'simple',
    theme:
      'Small intimate cozy moments visible in a warm sci-fi interior — a steam curl, a turned page, a sleeping pet, a hand reaching for a mug. Conditional 40%-gated layer for cozy-sci-fi-interior path.',
    touchpoints: [],
    instructions: `Write 50 small intimate cozy moments — a single tiny action or detail caught freeze-frame in a warm sci-fi interior. Each entry: one sentence describing the specific moment. Sci-fi context still present (the moment happens in a starship galley / generation-ship quarters / hydroponics bay / etc.) but the moment itself is human-scale, intimate, warm.

Examples:
1. Steam curling from a forgotten mug of coffee on the navigation console, catching the warm amber readout glow.
2. A figure seen from behind reading a paperback book, one socked foot tucked under them, a soft blanket draped across their shoulders.
3. A small striped cat asleep on a coiled fiber-optic cable, tail flicking once in dream-sleep.
4. Two hands meeting in lamplight to pass a thermos, fingertips briefly touching, a small smile implied off-frame.
5. A plant leaf unfurling under purple grow-lamp, fresh green against worn metal bulkheads.

The moment is QUIET — no action set-pieces. No combat, no awe, no epic scale. Soft, lived-in, human. Mix: solitary moments / paired moments / animal moments / sensory moments (steam, light, fabric, food, plants). Sometimes no person visible, just evidence of one. Output 50 numbered list entries.`,
  },
  // ════════════════════════════════════════════════════════
  // REAL-SPACE PREMIUM-TIER ENRICHMENT (2026-05-31)
  // 6 new path-bespoke axes + REAL_SPACE_EVENT split. PHOTOREAL_ASTRO archetype.
  // ════════════════════════════════════════════════════════
  real_space_wavelength_signature: {
    format: 'simple',
    theme:
      'Telescope/instrument tradition that defines the rendering aesthetic — Hubble visible-light / JWST IR-mapped / Chandra X-ray pseudo-color / ALMA radio / EHT event-horizon / Spitzer mid-IR / Roman wide-field / GALEX UV / etc. ALWAYS-ON identity axis — sets the entire visual tradition of the render.',
    touchpoints: [],
    instructions: `Write 25 wavelength-signature descriptions — each names a specific real telescope or instrument + the visual tradition it represents. One sentence each, 18-32 words. ALWAYS-ON axis (opens every render).

Each entry must name:
(a) THE INSTRUMENT — real telescope or imaging band (Hubble Space Telescope / James Webb / Chandra X-ray / ALMA radio / EHT event-horizon / Spitzer Space Telescope / Roman Telescope / GALEX UV / Hinode solar / Subaru visible / VLT / ESO / Hubble Ultra Deep Field / Pan-STARRS)
(b) THE WAVELENGTH BAND — visible / near-IR / mid-IR / X-ray / radio / UV / mm-wavelength
(c) THE VISUAL SIGNATURE that defines its aesthetic — what makes this telescope's images instantly recognizable (Hubble = saturated visible with diffraction spikes / JWST = burnt-amber-and-cobalt IR / Chandra = purple-cyan X-ray pseudo-color / EHT = dark-shadow-of-event-horizon / ALMA = molecular-cloud radio-pseudo-color)
(d) THE TYPICAL SUBJECT MATTER — what kind of object this instrument is famous for imaging

Examples (DO NOT copy verbatim — write 25 new entries):
1. Hubble Space Telescope visible-light deep composite, signature six-prong diffraction spikes on every star, saturated multi-filter color, classic Hubble Ultra Deep Field aesthetic with thousands of background galaxies.
2. James Webb Space Telescope near-infrared NIRCam composite, characteristic eight-prong diffraction spike pattern, burnt-amber and cobalt-cyan false-color from molecular-hydrogen and ionized-gas mapping.
3. Chandra X-ray Observatory pseudo-color composite, purple-and-cyan high-energy emission mapped from X-ray data, shock fronts and accretion-disk corona visible only at this wavelength.

Cover the spectrum: visible-light telescopes, near/mid-IR (JWST, Spitzer), X-ray (Chandra, XMM-Newton), radio (ALMA, VLA), UV (GALEX, Hubble UV), event-horizon (EHT), solar (Hinode, SDO), wide-field (Roman, Pan-STARRS), ground-based optical (VLT, Subaru, Keck).

NO fictional instruments. NO sci-fi telescopes. NO "imaginary" wavelengths. The strength of this path is REAL astronomical imaging.

Output 25 numbered list entries.`,
  },
  real_space_structural_detail: {
    format: 'simple',
    theme:
      'Specific visible physical features of the astronomical subject — jets, accretion disks, shock fronts, stellar nurseries, polar lobes, dust lanes, ionization fronts, bipolar outflows, ring-systems, gravitational arcs. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 structural-detail descriptions — specific visible physical features of astronomical objects. One sentence each, 16-28 words. Each names a SPECIFIC FEATURE + its visual signature.

Mix across feature categories:
- Jets / outflows (twin polar jets venting at relativistic speed / bipolar outflow lobes / herbig-haro shock fronts / pulsar wind nebula)
- Accretion structures (accretion disk edge-on / hot inner disk glow / Roche-lobe overflow / spiral accretion lanes)
- Stellar features (stellar nursery clusters / pillars of creation / proto-planetary disk / Bok globules silhouetted)
- Galactic structures (two-arm spiral with razor-sharp dust lanes / barred-spiral central bulge / merging tidal tails / starburst ring)
- Nebular features (ionization front edges / cometary globules / dark-cloud silhouettes / emission-line filament network)
- Black hole features (event-horizon shadow / photon ring / relativistic jet beam / X-ray corona)
- Star-cluster features (tightly-packed core / mass-segregated heavy-stars at center / blue-straggler population / tidal-disruption tails)
- Planet-system features (planetary ring system / cassini-division gap / shepherd moons / volcanic plume from a moon)
- Solar features (coronal mass ejection arc / sunspot active region / chromosphere prominence / coronal loops)
- Cosmic-web features (gravitational lensing arc / galaxy-cluster filament / cosmic-microwave-background fluctuation / void-wall boundary)

Each entry must specify:
(a) THE FEATURE NAME — the specific astronomical structure
(b) THE VISUAL FORM — shape, count, scale
(c) THE COLOR / WAVELENGTH SIGNATURE — what wavelength it emits

Examples (DO NOT copy verbatim):
1. Twin polar jets venting at relativistic speed from the central engine, each jet a thin razor-bright filament extending five times the galaxy's diameter into intergalactic space.
2. Two-arm grand-design spiral pattern with razor-sharp dust lanes silhouetted against the disk's stellar background, each lane tracing the spiral arm's leading edge.
3. Event-horizon shadow ringed by a glowing photon-sphere, the dark circular silhouette unmistakable against the asymmetric accretion-flow corona.

NO fictional structures. NO sci-fi-coded ("the dyson lattice"). All features must be real astronomical phenomena.

Output 25 numbered list entries.`,
  },
  real_space_color_palette_band: {
    format: 'simple',
    theme:
      'False-color palette / wavelength-mapped color treatment — the SIGNATURE color register of the render. Pillars-of-Creation orange-and-teal / JWST burnt-amber-and-cobalt / Chandra X-ray purple-and-cyan / aurora violet-and-green / radio molecular-cloud-blue / etc. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 false-color palette descriptions — wavelength-mapped color treatments that wash an entire render in a specific hue family. One sentence each, 14-26 words. Each names 2-4 SPECIFIC NAMED COLORS + what wavelength they map to + the overall mood.

Mix across canonical astrophotography palettes:
- Classic Hubble Pillars-of-Creation: deep teal (oxygen-III), saturated orange (sulfur-II + dust), with violet shadow nooks
- JWST near-IR: burnt amber, deep cobalt-cyan, ghostly violet edges, hot-pink hydrogen
- Chandra X-ray: purple high-energy, cyan medium-energy, gold low-energy, deep-black void contrast
- Aurora-violet H-alpha: deep magenta hydrogen, violet helium, soft green oxygen
- ALMA radio millimeter: cold blue molecular clouds, pink protostellar disks, deep black void
- Spitzer mid-IR: green dust glow, red warm-dust emission, blue evolved-star halos
- Solar SDO: orange chromosphere, gold coronal loops, electric magenta active regions
- Cool-spectrum nebula: ice blue, mint green, lavender, with diamond-white stars
- Warm-spectrum nebula: vermilion red, saturated marigold, copper edges, ember orange
- Deep-sky deep-field: thousands of background galaxies in jewel-tone scatter against deep void
- Auroral magnetosphere: emerald polar light, ruby southern auroras, violet upper atmosphere
- Hot Jupiter color: amber bands, deep magenta cyclones, ember storm streaks
- Quasar color: blinding white-violet core, ghostly cyan jets, golden gravitational halo

Each entry must:
(a) NAME 2-4 SPECIFIC COLORS (no "vibrant" / "rich" / "vivid" — name them)
(b) MAP TO WAVELENGTH OR EMISSION SOURCE (oxygen-III / sulfur-II / hydrogen-alpha / X-ray hard-energy / IR molecular / radio cold-dust)
(c) STATE THE OVERALL MOOD (jewel-tone / ember / aurora / void-deep-and-jewel / cool-saturated / etc.)

Examples (DO NOT copy verbatim):
1. Classic Pillars palette — deep teal of oxygen-III, saturated orange of sulfur-II and dust, with violet hydrogen-alpha shadow nooks, gem-tone saturation throughout.
2. JWST near-IR signature — burnt amber and deep cobalt-cyan dominating the frame, ghostly violet edges where ionized-gas mapping kicks in, hot-pink hydrogen accents.
3. Chandra X-ray pseudo-color register — purple high-energy emission, cyan medium-energy, gold low-energy bands, deep-black void contrast, scientific-imaging aesthetic.

Output 25 numbered list entries.`,
  },
  real_space_scale_anchor: {
    format: 'simple',
    theme:
      'Astro-specific scale-prover element — a small object in the foreground/midground that anchors the impossible scale of the subject. Foreground asteroid silhouette / nearby star with diffraction cross / approaching probe / contrasting smaller galaxy / lone exoplanet transit / etc. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 astro-specific scale-anchor descriptions — small but readable elements in the frame that anchor the scale of the astronomical subject. One sentence each, 14-26 words. Each names a SPECIFIC OBJECT + its scale + its position relative to the subject.

Mix across scale-anchor categories:
- Foreground objects (silhouetted asteroid / dust filament strand / nearby cometary nucleus)
- Nearby stars (single bright foreground star with massive diffraction cross / blue supergiant edge of frame / red dwarf binary pair)
- Mechanical scale-provers (tiny silhouette of an approaching probe / distant spacecraft against the subject / lone observation platform)
- Comparison objects (contrasting smaller galaxy at frame edge / Moon-sized object near a planet / Earth-sized planet transit silhouette / Jupiter for scale)
- Stellar witnesses (distant nova flash / brief gamma-ray burst pinpoint / pulsar at frame edge)
- Lensing artifacts (gravitational arc from a background galaxy / Einstein cross / lensed quasar image multiplied)
- Time-scale markers (light-echo expanding from past supernova / sequential pulse-image of a pulsar / orbital-motion blur trail)

Each entry must:
(a) NAME the specific scale-prover object
(b) NAME the scale (asteroid-sized / star-sized / probe-sized / galaxy-sized)
(c) PLACE it in the frame (foreground left / silhouetted against subject / at frame edge / midground)

Examples (DO NOT copy verbatim):
1. A silhouetted foreground asteroid the size of a small moon at lower-frame, its irregular shape backlit by the subject's ionized gas glow, providing direct scale.
2. A nearby blue-supergiant star at upper-right with a massive six-prong diffraction cross, its scale dwarfed by the subject galaxy behind it.
3. The tiny silhouette of an approaching probe at frame center, scale-mark for the kilometer-sized subject asteroid behind it.

Output 25 numbered list entries.`,
  },
  real_space_composition_focus: {
    format: 'simple',
    theme:
      'Astronomical composition framing — centered jewel-box / edge-on disk / spiral-arm hero / merging-galaxies pair / Dyson-sphere transit / nebula-into-void wide / etc. 50%-gated accent on top of the universal composition_frame axis.',
    touchpoints: [],
    instructions: `Write 25 astronomical composition descriptions — framing strategies specific to deep-sky imaging. One sentence each, 14-24 words. Each names a SPECIFIC FRAMING + how the subject is positioned.

Mix across canonical astro composition:
- Centered jewel-box (subject filling the frame, symmetrically composed)
- Edge-on disk (galaxy or system viewed from its equatorial plane)
- Face-on disk (galaxy viewed from above the disk plane)
- Spiral-arm hero (focus on a single grand-design spiral arm)
- Merging galaxies pair (two systems mid-collision, frame split)
- Three-quarter angle (subject at oblique angle for depth)
- Nebula-into-void wide (vast nebula with deep void at frame edges)
- Transit silhouette (small object silhouetted against larger luminous one)
- Pillar verticality (vertical columnar structure dominant)
- Wide-field cluster (thousands of stars spread across frame)
- Lensing-arc framing (gravitational lens forming arc across frame)
- Centered black hole (event-horizon at exact center)
- Off-center golden-spiral (subject placed at golden-ratio point)
- Diagonal jet (jet structure cutting across frame diagonally)
- Cosmic-web filament (linear filament structure across frame)

Each entry must:
(a) NAME the composition style
(b) NAME the position of the subject in frame
(c) STATE what reads first / leads the eye

Examples (DO NOT copy verbatim):
1. Edge-on disk composition, the subject galaxy spanning the entire horizontal frame with razor-thin dust lane cutting through its bright equator.
2. Centered jewel-box framing, the subject nebula filling 80% of frame with symmetrical structure on both sides, leading the eye to the bright core.
3. Diagonal jet composition, twin polar jets cutting the frame at a 30-degree angle, the host galaxy nucleus at one corner with the jets extending to the opposite corner.

Output 25 numbered list entries.`,
  },
  real_space_narrative_phase: {
    format: 'simple',
    theme:
      'The cosmic moment the still captures — what PHASE of cosmic time. Star formation / supernova death / galaxy merger / quiet majesty / aftermath / discovery / first light / etc. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 cosmic-narrative-phase descriptions — what moment of cosmic time the still captures. One sentence each, 14-24 words. Each names a SPECIFIC PHASE + its visual signature.

Mix across cosmic narrative phases:
- BIRTH — star formation, proto-stellar disk, molecular cloud collapse, ignition flash
- DEATH — supernova explosion, planetary nebula expansion, black-hole-feeding final spiral, white-dwarf cooling
- COLLISION — galaxy merger, tidal-disruption event, neutron-star inspiral, comet impact
- QUIET MAJESTY — stable spiral, calm globular cluster, peaceful nebula at rest
- AFTERMATH — supernova remnant expansion centuries later, evaporating black hole, fading planetary nebula
- DISCOVERY — first-light from a new survey, unexpected transient flash, just-detected exoplanet transit
- TRANSIT — planet crossing in front of star, moon shadow on planet, pulsar passing through lensing field
- AWAKENING — quasar reignition, dormant black hole accreting again, nova outburst from a recurring system
- WITNESSING — light-echo of an ancient event, photon arrival from billions of years ago
- ECLIPSE — solar/lunar/exoplanet eclipse, occultation, syzygy alignment
- FORMATION — proto-galaxy assembly, dark-matter halo cooling, primordial nucleosynthesis
- DISRUPTION — tidal stream pulled from a merging satellite, jet boring through host galaxy
- PROCESSION — slow rotation of a cluster, orbital dance of a binary system

Each entry must:
(a) NAME the phase
(b) NAME a visual signature unique to that phase
(c) STATE the time-scale tone (eternal / instant / millennia / billions of years)

Examples (DO NOT copy verbatim):
1. Star-formation phase — proto-stellar disk surrounding a newly-ignited central star, jets venting along the rotational axis, dust still falling inward in concentric rings.
2. Supernova death phase — outer shock wave caught a thousand years post-detonation, expanding shell of ionized gas illuminated from within by the central remnant.
3. Galaxy-merger collision phase — two grand-design spirals tidally distorted into starburst-orange streams pulled across the frame, dust lanes warping.

Output 25 numbered list entries.`,
  },
  real_space_event: {
    format: 'simple',
    theme:
      'Dramatic cosmic event for the real-space path — the moment a real astronomical phenomenon erupts into action. Path-bespoke split from shared COSMIC_EVENT pool. 35%-gated conditional drama.',
    touchpoints: [],
    instructions: `Write 25 dramatic cosmic events for real-space photoreal astrophotography. One sentence each, 16-28 words. Each describes a SPECIFIC PHENOMENON happening RIGHT NOW in the frame (freeze-frame). Pure cosmos — no figures, no ships, no fictional elements. NASA-grade imaging aesthetic.

Mix across real astronomical events:
- Supernova mid-detonation (shock wave bursting through outer envelope)
- Black hole tidal-disruption event (star being shredded into spaghettified debris)
- Gamma-ray burst pinpoint (briefest brightest electromagnetic event in the universe)
- Neutron star merger (kilonova ejection of heavy elements)
- Magnetar starquake (X-ray flash from crustal rearrangement)
- Active galactic nucleus jet ignition (relativistic jet just launching)
- Solar coronal mass ejection (billion-ton plasma launch toward space)
- Pulsar wind nebula expansion (high-energy particle wind sweeping outward)
- Cosmic-ray air-shower particle cascade visible
- Type Ia supernova nucleosynthesis flash (carbon-burning runaway)
- Variable star pulsation peak (Cepheid at maximum brightness)
- Nova outburst (recurrent system in eruption)
- Brown dwarf failed-ignition flash
- Protostar bipolar jet first-launch
- Gravitational wave detection moment (chirp ringing through spacetime)
- Comet outburst (sudden brightening from cryovolcano)
- Cosmic-string transit event (theoretical defect passing through frame)
- Microlensing magnification peak (background star brightened by foreground compact object)
- Planetary atmospheric escape stream (hot Jupiter losing gas)
- Stellar flare apex (M-dwarf super-flare illuminating its planetary system)

Each entry must:
(a) NAME the real phenomenon
(b) DESCRIBE its visual signature mid-event
(c) STATE what's specifically visible in the still (light, color, motion-blur, structure)

Examples (DO NOT copy verbatim):
1. Supernova mid-detonation, shock wave expanding from the iron-core collapse, outer envelope blasted into a luminous shell glowing brighter than the host galaxy's entire stellar population.
2. Black hole tidal-disruption event mid-shred, the doomed star spaghettified into a glowing accretion stream wrapping the central singularity, X-ray flash erupting from the inner disk.
3. Coronal mass ejection mid-launch, a billion-ton magnetic plasma loop arcing off the solar limb, twisted and glowing in extreme-UV against the dark solar disk.

Output 25 numbered list entries.`,
  },
  cosmic_event: {
    format: 'simple',
    theme:
      'Dramatic cosmic events for cosmic-vista scenes — the moment a cosmic phenomenon erupts into ACTION. Conditional 40%-gated drama layer.',
    touchpoints: [],
    instructions: `Write 30 dramatic cosmic events — the MOMENT a cosmic phenomenon detonates into action. Each one sentence describing what is happening RIGHT NOW in the scene (not "could happen", not "was happening" — the freeze-frame). Pure cosmos, no figures, no ships, no human elements. Hubble / Webb / Villeneuve cosmic horror aesthetic.

Examples:
1. Supernova mid-detonation — a star's outer layers exploding outward as expanding spherical shockwave, blinding white core, gas filaments flung kilometers.
2. Gamma-ray burst piercing the frame as a needle of pure white light cutting through nebula clouds, leaving an ionized trail of glowing plasma.
3. Two galaxies mid-collision — spiral arms tangling, gravitational distortion warping starfield, dust lanes intersecting in an X-shape across the frame.
4. Black-hole jet erupting at relativistic speed — twin beams of plasma punching from the poles of the event horizon, illuminating surrounding gas in violet and gold.
5. Quasar awakening — central singularity flaring as accretion disk surges, blue-shifted matter spiraling into the maw, jet axis cutting the frame diagonally.

Format: ALL-CAPS event-name OR descriptive opening — short body. One sentence. No ships, no figures, no architecture. Pure astronomical drama. Output 30 numbered list entries.`,
  },
  // ════════════════════════════════════════════════════════
  // COSMIC-VISTA PREMIUM-TIER ENRICHMENT (2026-05-31)
  // 6 new path-bespoke axes + COSMIC_VISTA_EVENT split. PURE_COSMOS archetype.
  // PAINTED Bonestell/McCall/Whelan tradition — NOT photoreal NASA.
  // ════════════════════════════════════════════════════════
  cosmic_vista_painted_tradition: {
    format: 'simple',
    theme:
      'Painter tradition that defines the cosmic-vista aesthetic — Chesley Bonestell saturated planetscape / Robert McCall NASA-watercolor / Michael Whelan paperback-cover / John Harris vast-cinematic-cosmos / Bruce Pennington dreamy-acid-color / David Hardy science-poster-grandeur / Jim Burns analog-SF-paperback / Frank Kelly Freas pulp-SF / Vincent Di Fate. ALWAYS-ON identity axis.',
    touchpoints: [],
    instructions: `Write 25 painted-tradition descriptions — each names a specific real Analog-SF illustrator/painter + the visual signature that defines their cosmic vista paintings. One sentence each, 18-32 words.

Each entry must name:
(a) THE PAINTER — real Analog-SF or space-art illustrator (Chesley Bonestell / Robert McCall / Michael Whelan / John Harris / Bruce Pennington / David Hardy / Jim Burns / Frank Kelly Freas / Vincent Di Fate / Don Davis / Pat Rawlings / Lynette Cook / Don Punchatz / Ron Miller)
(b) THE SIGNATURE STYLE — what their cosmic vistas characteristically look like (saturated panoramic planetscape / watercolor-and-gouache NASA-poster / paperback-cover oil saturation / vast atmospheric cinematic depth / dreamy acid-color hallucinatory)
(c) THE TYPICAL FRAMING — their go-to composition (terraformed-Mars vista with two moons / astronaut on Mercury surface / paperback-cover spaceship-against-nebula / Heavy Metal cosmic surreal)
(d) THE PALETTE TENDENCY — characteristic colors of their work

Examples (DO NOT copy verbatim — write 25 new entries):
1. Chesley Bonestell saturated-planetscape tradition — terraformed-Mars vistas with razor-sharp horizon lines, two moons on the horizon, painted oil-on-canvas Analog-SF magazine-cover register with deep crimson-and-ochre palette.
2. Robert McCall NASA-watercolor poster tradition — airbrushed gradient-sky-and-cosmos with deliberate hopeful atmosphere, planetary ringscapes painted in pale blues and silver-whites, mid-century-modern aerospace illustration sensibility.
3. Michael Whelan paperback-cover oil tradition — saturated jewel-tone painted cosmos with dramatic dramatic lighting and atmospheric depth, hero-scale vistas with one or two figures dwarfed by the scene.

Cover the spectrum: foundational Analog-SF illustrators, NASA poster painters, paperback-cover oil-on-canvas, Heavy Metal cosmic surrealists, modern space-art photoreal-painters, retro pulp-SF interior artists. Each painter named must be a REAL person.

NO photoreal astrophotography (that's real-space's domain). NO fictional painters. NO film concept artists primarily known for non-cosmic work. The strength of this path is PAINTED COSMOS, not photoreal.

Output 25 numbered list entries.`,
  },
  cosmic_vista_composition: {
    format: 'simple',
    theme:
      'Painted-tradition vista compositions — terraformed-foreground-globe / two-moons-on-horizon / planetary-rings-bisecting / spiral-arm-overhead / nebula-cathedral-arches / binary-double-shadow / etc. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 painted vista composition descriptions — framing strategies that define classic painted cosmic vistas. One sentence each, 14-26 words. Each names a SPECIFIC FRAMING + how the subject is positioned.

Mix across canonical painted-vista compositions:
- Terraformed foreground globe with cosmic anchor behind (planet half-filling lower frame, distant phenomenon dominating upper frame)
- Two-moons-on-horizon vista (two satellites at different sizes flanking the horizon line)
- Planetary-rings-bisecting (rings cutting diagonally across frame, the planet at one end)
- Spiral-arm-overhead (galaxy arm arching like a sky over the foreground vista)
- Nebula-cathedral arches (gas-pillars rising like cathedral columns into deep distance)
- Binary-double-shadow (two stars casting dual-shadow patterns across foreground)
- Cosmic-horizon-from-moon-surface (lunar foreground, planet rising above horizon)
- Asteroid-belt-tunneling-through (foreground rocks framing distant cosmic event)
- Gas-giant-half-frame (planet's cloud-bands filling 50% with cosmic event at edge)
- Rings-of-Saturn-from-Titan (looking up at ringed gas-giant through methane sky)
- Distant-nebula-cathedral-window (looking out from a planetary surface through atmospheric haze)
- Three-body-alignment (sun + planet + moon in precise syzygy across frame)
- Cosmic-storm-from-orbit (looking down at planetary storm system with cosmic backdrop)
- Comet-tail-arcing-overhead (tail of approaching comet stretching across the painted sky)
- Aurora-dome-from-ice-cap (auroral curtain hanging over polar foreground)

Each entry must:
(a) NAME the composition style
(b) NAME the position of the primary subject in frame
(c) STATE what reads first / leads the eye through the painted vista

Examples (DO NOT copy verbatim):
1. Terraformed-foreground-globe composition, a half-terraformed planet filling the lower third with a distant blue nebula bloom dominating the upper-frame painted sky.
2. Two-moons-on-horizon framing, a small reddish satellite low on the left horizon and a larger pale grey moon centered higher, planetary surface receding into painted distance.
3. Planetary-rings-bisecting composition, Saturn's rings cutting the frame at a thirty-degree diagonal, the planet itself at the lower-right corner with stars filling the upper-left.

Output 25 numbered list entries.`,
  },
  cosmic_vista_narrative_witness: {
    format: 'simple',
    theme:
      'Tiny silhouette figure or structure providing scale in a painted cosmic vista — painted-figure-silhouette / observatory dome / ancient ruin / orbiting habitat / lone lander / generation-ship cutaway / suit-figure-at-cliff. NOT a hero subject. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 narrative-witness descriptions — tiny silhouette figures or structures providing scale in painted cosmic vistas. One sentence each, 14-26 words. Each names a SPECIFIC ELEMENT + its size + its placement (NEVER hero-scale).

Mix across witness types:
- Painted figure silhouettes (single astronaut at cliff edge / suited explorer pointing / lone observer at observatory window / pair of figures dwarfed by horizon)
- Built structures (observatory dome with telescope visible / inflatable habitat module / radio-dish array / abandoned settlement / wind-turbine array / mining outpost)
- Vehicles at distant scale (lone lander touched down / rover crawling along ridge / parked exploration vehicle / abandoned spacecraft husk)
- Orbiting elements (small habitat station orbiting overhead / approaching probe at frame edge / lone shuttle in transit)
- Ancient ruins (collapsed monolith / weathered alien structure / sand-buried megalith / glyph-carved cliff)
- Generation-ship architecture (vast hull section partially visible / observation deck cutaway / interior city panels)
- Other-world infrastructure (orbital-elevator anchor / mass-driver track / launch-pad scaffold)

ALL must be:
(a) TINY scale (silhouette / pixels-tall / frame-edge / middle distance — NEVER focal)
(b) PROVIDING SCALE to the vast cosmic vista
(c) SPECIFIC about what the element is

Examples (DO NOT copy verbatim):
1. A single suited figure silhouetted at the cliff edge, ant-sized against the looming planet rising on the horizon behind them, pointing toward something unseen.
2. A small inflatable habitat module the size of a beach ball at this distance, parked on the ridge with running lights blinking faintly red.
3. An observatory dome the size of a thumbnail at frame edge, its dome open and the telescope tube angled upward toward the cosmic phenomenon dominating the painted sky.

NO hero characters. NO foreground figures. NO ship-as-subject. The witness is always scale-prover only.

Output 25 numbered list entries.`,
  },
  cosmic_vista_atmospheric_layer: {
    format: 'simple',
    theme:
      'Terrestrial-foreground atmospheric layer rendered in the painted vista — dust-laden alien atmosphere / cryogenic crystal-fog / methane-blue haze / sulfur-yellow smog / volcanic-ash veil / lichen-spore drift / cryo-vapor / aurora-borealis curtain. Anchors painted cosmic vistas to a concrete viewpoint. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 atmospheric-layer descriptions — terrestrial-foreground atmospheric interpretations for painted cosmic vistas viewed from a planetary surface or near-orbit. One sentence each, 14-26 words.

Mix across atmospheric types:
- Particulate hazes (dust-laden alien atmosphere / volcanic-ash veil / micrometeor dust shimmer / regolith haze)
- Cryogenic atmospheres (cryogenic crystal-fog / nitrogen-snow drift / methane-rain mist / ammonia-frost curtain)
- Toxic / colored atmospheres (sulfur-yellow smog / chlorine-green pall / mercury-vapor cloud / phosphine-pink haze)
- Volcanic / industrial (sulfur-dioxide acid mist / pyroclastic-ash plume drift / steam-vent column)
- Biological (lichen-spore drift / fungal-bloom haze / bioluminescent-dust swarm)
- Aurora / radiation (aurora-curtain hanging in the upper atmosphere / magnetospheric ribbons / radiation-haze shimmer)
- Methane-cycle atmospheres (methane-blue haze with hydrocarbon-rain streaks / methane-fog-bank rising)
- Storm systems (lateral-lightning-mist / cyclonic-cloud-bank / electrified-dust-wall)

Each entry must:
(a) NAME the atmosphere type
(b) NAME its color
(c) DESCRIBE its visual signature (drift / shimmer / hang / pillar)

Examples (DO NOT copy verbatim):
1. Sulfur-yellow smog drifting laterally across the foreground in horizontal bands, dimming the painted cosmic vista behind it into amber-filtered atmospheric depth.
2. Cryogenic crystal-fog hanging at knee-height across the entire foreground plain, catching the cosmic backlight in faint diamond-sparkle refractions.
3. Methane-blue haze rising in a vertical column near frame center, dispersing into a translucent curtain that softens the cosmic event behind it to dreamy painted softness.

Output 25 numbered list entries.`,
  },
  cosmic_vista_color_register: {
    format: 'simple',
    theme:
      'Painted-tradition color palette signatures — sunset-on-Jupiter amber-and-burgundy / Saturn-rings ivory-and-cobalt / Mars-twin-moon rust-and-ochre / nebula-pastel-magenta-and-cyan / methane-cyan-and-antifreeze-blue / alien-double-sunset / impossibly-saturated. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 painted color-register descriptions — palette signatures for painted cosmic vistas. One sentence each, 14-26 words. Each names 2-4 SPECIFIC NAMED COLORS + the planetary/cosmic context + the painted mood.

Mix across painted-cosmic palettes:
- Jupiter sunset (amber, burgundy, deep ochre, atmospheric coffee-brown)
- Saturn ringscape (ivory, cobalt, gunmetal-grey, pale gold)
- Mars vista (rust, ochre, pale-pink, salmon, deep sienna)
- Pluto-twilight (cerulean, lavender, pale-rose, glacial-mint)
- Venus-greenhouse (sulfur-yellow, copper, brass, atmospheric-tan)
- Neptune-methane (electric-blue, antifreeze-cyan, deep-cobalt, methane-violet)
- Uranus-aquamarine (pale aqua, methane-mint, soft turquoise, ghost-grey)
- Mercury-shadow (gunmetal, slate-grey, white-blaze, deep-black contrast)
- Io-volcanic (sulfur-yellow, lava-orange, brass-amber, geothermal-red)
- Europa-icescape (white-blue, silver, pale-cyan, deep-cobalt cracks)
- Titan-methane (amber-haze, brown-ochre, peach, soft-gold)
- Nebula-pastel (magenta, cyan, sea-foam, pale-mint, dreamy-amethyst)
- Alien-double-sunset (twin-magentas, gold, copper, rose-quartz, dusty-violet)
- Cosmic-storm (charcoal, ember-orange, electric-purple, deep-indigo)
- Aurora-night (emerald, ruby, violet, midnight-cobalt)
- Generation-ship-interior-lit (warm-amber, soft-gold, deep shadow)
- Impossibly-saturated (HDR painted intensity — multiple primaries cranked beyond photoreal)

Each entry must:
(a) NAME 2-4 SPECIFIC COLORS (no "vibrant" — name them)
(b) ANCHOR TO A PLANETARY/COSMIC CONTEXT (Jupiter sunset / Mars vista / nebula / alien biosphere)
(c) STATE THE PAINTED MOOD (gem-tone / pastel / ember / hallucinatory / dreamy)

Examples (DO NOT copy verbatim):
1. Sunset-on-Jupiter palette — amber, deep burgundy, atmospheric coffee-brown, with pale-gold ring highlights, ember-warm painted mood.
2. Saturn ringscape register — ivory, cobalt, gunmetal-grey ring shadows, pale-gold inner reflection, deep-cosmos black void, gem-tone painted mood.
3. Mars twin-moon vista — rust, ochre, pale pink atmospheric haze, deep sienna mountains, with white blaze of distant cosmic event, dusty painted mood.

Output 25 numbered list entries.`,
  },
  cosmic_vista_signature_phenomenon: {
    format: 'simple',
    theme:
      'Painted-tradition signature cosmic phenomena — Kuiper-belt comet streaking through / mass-driver stream / planetary alignment / Lagrange-orbit habitat-cluster / Dyson-veil shimmer / impossible-aurora / cosmic-string filament. Bigger drama than COSMIC_VISTA_EVENT. 50%-gated accent.',
    touchpoints: [],
    instructions: `Write 25 signature painted-tradition cosmic-phenomenon descriptions — bigger painted-cosmic dramas in the Bonestell/McCall painted-tradition register. One sentence each, 14-28 words.

Mix across signature painted phenomena:
- Comet streaks (Kuiper-belt comet arcing through frame / Halley-style coma trailing / multi-tail bright comet)
- Mass-driver streams (rail-launched cargo streaming from a planetary surface / mass-driver track lit at night / orbital-launch loop)
- Planetary alignment (three-body syzygy / planet-moon-sun precise alignment / planetary conjunction)
- Lagrange habitat-cluster (orbital habitat-station-cluster at L4/L5 / sphere-cluster of orbital cities)
- Dyson-veil shimmer (Dyson swarm partial-transit shimmer / Dyson-bubble light-bending effect)
- Impossible-aurora (auroral arc dome spanning the painted sky / aurora-cyclone hovering)
- Cosmic-string filament (theoretical defect threading through the cosmic vista)
- Solar-system inception (proto-planetary disk seen from a forming planet's surface)
- Generation-ship arrival (vast generation-ship approaching the destination planet / cathedral-vast hull entering frame)
- Black-hole-near-pass (a black hole crossing through the painted vista's deep distance, light bending visibly)
- Hyperjump-emergence (distant ships emerging from FTL transit, Cherenkov-blue afterimage)
- Magnetar-flare (distant magnetar flaring an X-ray pulse visible at scale)
- Brown-dwarf parent (failed-star parent of the planetary system glowing dim infrared overhead)
- Asteroid-impact incoming (massive asteroid in approach trajectory, painted prophetically)
- Solar-corona-from-mercury (Sun's corona visible directly from Mercury orbit, painted with full halo)

Each entry must:
(a) NAME the phenomenon
(b) NAME its visual signature in painted register
(c) STATE its position/movement across the painted vista

Examples (DO NOT copy verbatim):
1. Kuiper-belt comet streaking through the upper-third of the frame, multi-tail spread, ice-blue and amber tail colors painted with classic Bonestell saturation.
2. Lagrange-orbit habitat-cluster of seven spherical cities orbiting in delicate geometric formation, each city dotted with painted golden city-light points against deep cosmic black.
3. Dyson-veil shimmer in the deep distance, partial-occulting curtain of orbital structures bending the parent star's light into a subtle painted glow halo.

Output 25 numbered list entries.`,
  },
  cosmic_vista_event: {
    format: 'simple',
    theme:
      'Dramatic cosmic event for the cosmic-vista path — the moment a painted cosmic phenomenon erupts into ACTION. Path-bespoke split from shared COSMIC_EVENT pool. 40%-gated conditional drama. PAINTED tradition (Bonestell/McCall) — NOT photoreal NASA.',
    touchpoints: [],
    instructions: `Write 25 dramatic cosmic events for the painted-cosmic-vista path. One sentence each, 16-28 words. Each describes a SPECIFIC PHENOMENON happening RIGHT NOW in the painted frame (freeze-frame). PAINTED tradition — Bonestell/McCall/Whelan register, NOT NASA-photoreal.

Mix across painted-cosmic events:
- Supernova mid-detonation (painted in Whelan-style saturated jewel-tone burst)
- Galaxy merger (Bonestell-painted gravitational distortion across the painted sky)
- Black-hole feeding (painted as hellscape-saturated drama)
- Solar flare overhead (painted as god-ray-from-above)
- Comet impact (painted as Earth-2-scale apocalypse vista)
- Planet-eating star (Sun-as-red-giant in painted catastrophe register)
- Cosmic storm passing through (electric-painted-cyclone)
- Hyperjump emergence (Cherenkov-painted-flash from FTL arrival)
- Asteroid mining-explosion (painted Bonestell catastrophe with rock-debris in frame)
- Magnetar starquake (painted as overhead radiation-pulse)
- Wormhole opening (painted as impossible-geometry tear in the cosmic vista)
- Solar eclipse total (painted corona around occulting body)
- Mass-driver launch (painted as kinetic-trail across the cosmic backdrop)
- Generation-ship engine-burn (painted vast plume from approaching colony vessel)

Each entry must:
(a) NAME the event in painted register
(b) DESCRIBE its visual signature mid-event (in painted-tradition terms)
(c) STATE what's specifically visible in the painted still

Examples (DO NOT copy verbatim):
1. Supernova mid-detonation painted in saturated Whelan jewel-tone, expanding outer shell glowing amber and violet, central remnant blazing white-blue at the painted frame's heart.
2. Comet impact in approach, painted prophetically — a massive ice-and-rock body trailing magenta-and-cyan plume, dwarfing the planetary surface beneath it.
3. Galaxy-merger gravitational distortion painted across the upper frame, two spiral systems being tidally torn into painted-saturated streams of jewel-tone light.

Output 25 numbered list entries.`,
  },
  ritual_moment: {
    format: 'simple',
    theme:
      'Mystic / oracle action moments for cosmic-oracle scenes — channeling cosmic energy, divining starlight, casting sigils, communing with the void.',
    touchpoints: [],
    instructions: `Write 25 mystic action moments — what the cosmic oracle is DOING when ritual energy is active. Each one sentence. Visible glow, sigil, energy thread, or supernatural presence.

Examples:
1. Channeling violet starlight through outstretched palms, golden sigils orbiting the figure in slow rotation.
2. Drawing a glowing constellation map mid-air with one finger, lines forming an ancient star-pattern.
3. Communing with a tethered cosmic entity, faint silvery thread connecting their forehead to a hovering nebula-form.
4. Casting a divination — three glowing dice tumble in midair leaving violet trails.

Future sci-fi mystic aesthetic, not fantasy wizard. Output 25 numbered list entries.`,
  },
  story_beats: {
    format: 'simple',
    theme: 'Universal cinematic narrative beats — the dramatic MOMENT a sci-fi scene is capturing.',
    touchpoints: [],
    instructions: `Write 25 cinematic story beats — the narrative MOMENT a sci-fi scene captures. Each entry: ALL-CAPS NAME — short description (the pose / camera mood / what is about to happen). One sentence per entry.

Examples:
1. ARRIVAL — a ship descends through the atmosphere or breaches the horizon; the world is being entered for the first time.
2. DISCOVERY — a figure has paused at the edge of something unknown — a ruin, a portal, a wonder. The heartbeat before the figure decides what to do next.
3. CONFRONTATION — face-to-face with the alien Other. A figure stands before a colossal alien entity, an inscrutable monolith, an opening into the unknown.
4. VIGIL — figure stands still at a high vantage, watching. A lone watcher above a city, a sentinel on a wall. Time stretched and quiet.

Avoid duplicating: ARRIVAL, DISCOVERY, DEPARTURE, ASCENT, THREAT, AWE, RUIN, CONFRONTATION, VIGIL, EXODUS, CONVERGENCE, SOLITUDE. Invent NEW beats — RECKONING, BREACH, COMMUNION, ABDICATION, RECLAMATION, SUMMONS, INVOCATION, etc. Output 25 numbered list entries.`,
  },
  composition_frame: {
    format: 'simple',
    theme: 'Universal camera / framing concepts — how the camera composes the sci-fi scene.',
    touchpoints: [],
    instructions: `Write 25 camera / framing concepts. Each entry: ALL-CAPS NAME — short description of the camera position, lens, depth, and compositional energy. One sentence per entry.

Examples:
1. WIDE CINEMATIC VISTA — establishing shot, eye-level horizon centered on lower third, sky fills upper two-thirds, full depth from foreground to deep horizon.
2. EXTREME LOW ANGLE LOOKING UP — camera at ground level tilted upward, foreground tilted forward, sky filled with the impossible structure. Forces vertical scale.
3. OVER-THE-SHOULDER ANCHOR — anchor entity in foreground (back-turned), the wonder of the scene unfolding ahead of them. Caspar-Friedrich / Spielberg awe-pose.
4. BACKLIT SILHOUETTE — strong light source behind the anchor, scene rendered in heavy chiaroscuro, atmosphere visible in the light beam.

Avoid duplicating: WIDE CINEMATIC VISTA, EXTREME LOW ANGLE LOOKING UP, AERIAL SWEEP, LONG-LENS DEEP COMPRESSION, WORM'S-EYE FROM RIDGE EDGE, OVER-THE-SHOULDER ANCHOR, DUTCH-TILT CHAOS, BIRD'S-EYE TOP-DOWN, SYMMETRIC HERO FRAME, RACKED FOREGROUND, PROFILE PARALLAX, BACKLIT SILHOUETTE. Invent NEW frames — MIRRORED REFLECTION, KEYHOLE VIEW, TOP-DOWN CRANE PUSH-IN, REVERSE-DOLLY, etc. Output 25 numbered list entries.`,
  },
  scale_provers: {
    format: 'simple',
    theme:
      'Universal visual scale-reference elements — small details that prove an environment is monumentally large.',
    touchpoints: [],
    instructions: `Write 25 visual scale-reference elements. Each entry: lowercase descriptive phrase — short explanation of how this element conveys scale. One sentence per entry.

Examples:
1. ships as dots — multiple small craft visible as glowing pinpricks against the structure or sky, no individual detail
2. lit windows as honey-grain — hundreds of small bright window-lights speckling a massive face, conveying that thousands inhabit each tower
3. atmospheric haze bands at midheight — visible layers of fog or smog cutting horizontally through the structure, proving the height exceeds normal atmospheric depth
4. tiny aerial creatures or drones in formation — birds, drones, or alien flyers as moving specks giving the eye motion and scale reference

Avoid duplicating: ships as dots, lit windows as honey-grain, figures-as-pinpricks on bridges, smaller towers clustered at base, atmospheric haze bands, twin moons or rings behind, cargo trains weaving between buildings, weather local to structure, tiny aerial creatures, spotlight beams, scale bands of decay, cascading platforms. Invent NEW provers — distant lightning at base of structure, crowds in plazas read as pixels, vehicle trails snaking on roads, etc. Output 25 numbered list entries.`,
  },
  emotional_dna: {
    format: 'simple',
    theme:
      'Universal sci-fi mood / atmosphere concepts — the EMOTIONAL register a cosmic / sci-fi scene is operating in.',
    touchpoints: [],
    instructions: `Write 25 mood / atmosphere concepts. Each entry: ALL-CAPS NAME — short description of the emotional register, the light quality, how the entity / viewer feels. One sentence per entry.

Examples:
1. AWE — the scene overwhelms; the entity is rendered small by impossible beauty or scale. Reverence and wonder, edges softened by light.
2. DREAD — something is wrong or about to be. Architecture or geology carries menace. Light is cold or sickly.
3. SACRED — the scene reads as a place of pilgrimage or revelation. Symmetry, ascending light, ritual cleanliness.
4. FRONTIER-ISOLATION — distance from home is the feeling. The entity is far out, surviving, alone. Wide empty horizons. Light is harsh or precious.

Avoid duplicating: AWE, DREAD, MELANCHOLY, SACRED, INDIFFERENT-MEGALOPOLIS, ALIEN-WONDER, FRONTIER-ISOLATION, TRIUMPHANT-DISCOVERY. Invent NEW moods — EUPHORIC-ASCENSION, COSMIC-HOSTILITY, ANCIENT-PATIENCE, NEUROTIC-SUBLIME, TENDER-LONELINESS, EXALTED-VIGIL, etc. Output 25 numbered list entries.`,
  },
  // ════════════════════════════════════════════════════════
  // PORTED 2026-06-05 from legacy gen-seeds/starbot/gen-*.js
  // Migrated to gain the proper dedup pipeline (signatureOf + dedupe +
  // cross-batch dedup + --target N iterative loop). The legacy scripts
  // lacked programmatic dedup so "200 entries" was actually clustering.
  // Per playbook §"Pool generation MUST have dedup" lines 333-471.
  // All entries CLEANED of franchise NAMES per Kevin's "no IP refs" rule.
  // ════════════════════════════════════════════════════════

  sci_fi_race: {
    format: 'simple',
    theme: `STARBOT SCI-FI LINEAGE — humanoid descriptions for the female-explorer and male-explorer paths. Each entry: 15-25 words. Gender-neutral phrasing. One clear visual signature per entry. Every figure is HUMAN-SHAPED — head, torso, two arms, two legs, recognizable face. The pool spans original far-future humanoid kinds: Earth-evolved diaspora, original off-world lineages with unique skin and cranial signatures, augmented humans, and synthetic humanoids. Grounded sci-fi character design — original, plausible, distinct.

THE FOUR ORIGINS THIS POOL SPANS:

EARTH-DESCENDED DIASPORA (~35%) — recognizably-human lineages adapted by generations on different worlds + cultures: frontier colonist with UV-weathered skin and sun-bleached hair; ship-born spacer with pale station skin and wiry build; low-gravity-evolved long-limbed slender humanoid; high-gravity-evolved dense-muscled stocky build; desert-clan nomad with sun-hardened features and ritual scars; arctic-world dweller with frost-pale skin and tribal frost-lines; volcanic-world dweller with ash-grey skin and burn-pattern markings; mahogany-skinned warrior with knotted coils and copper-flecked eyes; deep-umber close-cropped twist-braided desert hunter; Mediterranean-coded noble with olive skin and gold-thread braids; northern-fair pioneer; equatorial highland clan with caste tattoos.

ORIGINAL OFF-WORLD HUMANOIDS (~40%) — describe far-future humanoid signatures using ORIGINAL combinations of: SKIN TONE (deep teal, amber, pearl-cream, verdigris-green, iron-grey, opal-iridescent, volcanic-black with mica flecks, dusk-violet, soft rose, copper, jade, slate, brass); SCALP / CRANIAL SIGNATURE (smooth bone collar at the nape, chitinous brow plate, bioluminescent dorsal ridge tracing the spine of the skull, paired forehead nodules in symmetric arc above the brow, asymmetric cranial peaks, segmented scalp ridge along the crown, crystalline scalp formation, phosphorescent stripe pattern across the forehead, lateral nasal-ridge running cheek to cheek, ribbed skull crest, bone-collared neck, single central forehead ridge, glassy scalp plate); EYES (opaque silver, triple-pupil, vertical-slit amber, ringed iris, hexagonal pupil, glowing-from-within, deep solid-black, copper-flecked double-pupil, milky-white with dark slit-pupil); BUILD (tall slender, wiry fast, sinewy long-limbed, compact dense, graceful elongated); MARKINGS (caste tattoos at the jawline, geometric ritual scars at the temple, glowing circuit-traces along veins, striated facial pigmentation, single ritual scar at the cheekbone, intricate hair-fine ink patterning across the forehead). These signatures are ORIGINAL — invented for this universe. Build each entry by combining ONE of each axis into a humanoid that feels grounded and capable.

AUGMENTED HUMANS (~15%) — neural-port at the temple with chrome trim, chrome prosthetic limbs visible at the shoulders or knees, subdermal LED tracery glowing along veins, smartlink jack at the temple, retractable mantis-blade housings sheathed at the forearms, cosmetic gene-mods (silver hair from birth, violet iris-mods, lab-grown gemstone teeth), partial chrome jaw, full chrome cranium with organic-only face, eye-replaced cybernetic optic.

SYNTHETIC HUMANOIDS (~10%) — humanoid androids: alabaster-perfect skin with eerie unblinking gaze, faint brand-plate at the temple, synthetic with hairline seam at the jaw, subtle joint-light at neck and wrists, model serial scrolling across forehead, unnaturally still poise.

CONSTRUCTION RULE: every entry has its OWN unique combination across the axes — never repeated. The pool's variety is the point. Every figure is humanoid, has two arms, two legs, recognizable face. 15-25 words per entry.`,
    touchpoints: [
      'Verdigris-green humanoid with a bioluminescent dorsal ridge tracing the back of the skull, hexagonal pupils, wiry long-limbed build, geometric ritual scars at the temple.',
      'Frontier colonist with UV-weathered pioneer skin, sun-bleached blond hair, dust-grimed features, callused hands, rugged settler bearing in worn workwear.',
      'Amber-skinned humanoid with paired forehead nodules in symmetric arc above the brow, vertical-slit copper eyes, compact dense build, striated facial pigmentation.',
      'Stocky high-gravity-evolved human with broader denser muscular frame, weathered heavy-world features, close-cropped dark hair, jaw-set practical bearing.',
      'Humanoid android with alabaster skin, faint brand-plate at the temple, hairline seam visible at the jaw, eerily still poise, unblinking pale-grey gaze.',
      'Pearl-cream humanoid with segmented scalp ridge along the crown, ringed-iris pale eyes, tall slender build, intricate hair-fine ink patterning across the forehead.',
      'Heavy-cyber augmented human with chrome prosthetic limbs at the shoulders, neural ports at the temple, glowing subdermal LED-tracery along the forearms, urban-mercenary cut.',
      'Mahogany-skinned humanoid with lateral nasal-ridges running cheek-to-cheek, knotted coils pulled high, copper-flecked double-pupil eyes, single ritual scar at one cheekbone.',
      'Iron-grey humanoid with chitinous brow plate above deep solid-black eyes, sinewy fast build, caste tattoos along the jawline, calm watchful bearing.',
      'Deep umber close-cropped twist-braided desert hunter with sun-hardened features, dark almond eyes, tribal frost-lines across the brow, fierce focused gaze.',
    ],
    instructions: `Each entry: ONE humanoid description, 15-25 words. Gender-neutral phrasing. Build each entry by combining ONE skin tone + ONE cranial signature + ONE eye type + ONE build + ONE marking into an ORIGINAL humanoid. Output as a NUMBERED list.

VARIETY: each entry visually distinct — every entry must have its OWN unique combination of skin, head feature, eye, build, and marking.`,
  },

  sci_fi_male_outfits: {
    format: 'simple',
    theme: `STARBOT BADASS MALE SCI-FI OUTFITS — ornate, heavy, "holy fuck" space suit / armor / tactical rig descriptions. Each entry: 20-35 words. Battle-worn but magnificent; every detail tells a story.

CORE RULE: NEVER name any sci-fi franchise / species / trademark / character. Describe FEATURES, not franchises. Generic equivalents only — no "Mandalorian", "Master Chief", "MJOLNIR", "Spartan", "beskar", "ceramite", "bolter", "Space Marine", "ODST", "N7", "Halo", "Mass Effect", "Star Wars", "Cyberpunk", "Edgerunner", or any other franchise / trademark term.

OUTFIT CATEGORIES (distribute EVENLY across the pool):
• Heavy power armor — full plated suit, ornate engravings, glowing power conduits, massive pauldrons.
• Tactical combat rig — modular plates over tactical undersuit, ammo loops, weapon mounts.
• Pilot exosuit — reinforced pressure suit with command insignia, HUD helmet, rank-marked pauldrons.
• Explorer heavy EVA — industrial environmental suit, tool harness, reinforced joints, specimen containers.
• Bounty hunter loadout — layered mismatched armor, trophy attachments, custom holsters.
• Cathedral-grade war armor — full-coverage plate with devotional engravings, massive shoulder guards, built-in weaponry (describe the look; NEVER name the franchise).
• Command battlesuit — officer's armor combining elegance with firepower, ceremonial + functional.
• Engineer hardsuit — reinforced work armor, integrated tools, welding shield, hydraulic assist.
• Mercenary custom — personalized kit, high-end + field-repaired mix, story of years.
• Scavenger rig — cobbled from salvaged suits + alien tech, asymmetric, ugly-beautiful.

DEDUP — vary across: MATERIALS (matte black armor-composite, polished chrome-steel, scorched durasteel, carbon-fiber weave, reactive nano-plate, scarred high-density alloy, brushed titanium, oxidized bronze alloy, alien bone-composite, mag-locked modular plate). SILHOUETTES (full enclosed power armor, chest-heavy asymmetric, light legs + massive torso, balanced tactical, long armored coat over suit, exoskeleton frame, minimal armor + heavy weapons, layered segmented, bulky industrial, streamlined predator). COLORS (matte olive, midnight black, desert sand, gunmetal, blood red, arctic grey, burnt umber, cobalt blue, charcoal, rust-orange).

Describe the OUTFIT only — no body details (clashes with character pool). Focus on construction: plates, seams, power conduits, weapon mounts, ornamentation, wear patterns. Badass through MASS + DETAIL, not exposure. Functional — every element has a plausible purpose.`,
    touchpoints: [
      'Matte black armor-composite power suit with glowing cyan conduits across deep chest engravings, massive pauldrons bearing kill-marks, mag-locked rifle on the spine.',
      'Desert-sand tactical rig with modular ballistic plates over reinforced mesh undersuit, criss-cross ammunition belts, custom-rivet weapon holsters, dusty boots.',
      'Polished chrome-steel pilot exosuit with reinforced pressure joints, command rank striping, HUD-integrated helmet with targeting array, vacuum-cured gauntlets.',
      'Scorched durasteel explorer EVA with hydraulic-assist exoskeleton frame, full tool harness across the back, reinforced gauntlets with integrated burner, weathered mag-boots.',
      'Carbon-fiber bounty hunter loadout with layered patchwork plates, trophy bones wired to one shoulder-guard, twin holstered pistols cross-drawn, dust-cloak over.',
      'Cathedral-white war armor with devotional script gold-leafed across every plate, massive curved shoulder guards, built-in arm-mounted artillery, ceremonial belt-tassels.',
      'Burnished bronze command battlesuit with ornate epaulets, integrated power-core glowing at the chest, ceremonial blade at one hip, mil-spec pistol at the other.',
      'Oxidized bronze engineer hardsuit with welding shield mag-locked at one wrist, hydraulic assist along the spine, integrated repair-tool bandolier across the chest.',
    ],
    instructions: `Each entry is ONE outfit, 20-35 words. Format: free-form prose. Output as a NUMBERED list.

STRICT BANS: no franchise / trademark / species / character names; no body / skin descriptions (separate pool); no "generic space marine" or other lazy descriptors; no "sexy" / cheesecake framing.

VARIETY: each outfit visually distinct — different material, silhouette, color, era of use.`,
  },

  cosmic_oracle_characters: {
    format: 'simple',
    theme: `STARBOT COSMIC-ORACLE CHARACTERS — cinematic sci-fi oil-painting portraits of badass, interesting characters in cosmic scenes. Each entry: 20-35 words. Format: "[Role] — [visual description], wearing [gear]".

CORE RULE: NEVER name any sci-fi franchise, species, trademark, or character. Do not write "Mandalorian", "Spartan", "Space Marine", "Boba Fett", "Master Chief", "Twi'lek", "Vulcan", "Turian", "Asari", "Sangheili", "Yautja", "Wraith", "Cardassian", "HK-47", "Bishop", "Terminator", "Ripley", "Shepard", "beskar", "MJOLNIR", "ceramite", "Halo", "Mass Effect", "Star Wars", "Warhammer", or any franchise. Describe FEATURES, not franchises.

CHARACTER MIX (distribute across the pool):
• ~40% HUMAN — interesting humans (grizzled, scarred, augmented, weathered, young-and-scrappy, old-and-wise, battle-hardened, roguish).
• ~30% HUMANOID ALIEN — person-shaped but clearly alien: pointed-ear humanoids, blue-skinned head-crest, head-tendril, scaled crested warriors, bone-plated combat-types (describe FEATURES, not franchises).
• ~20% ARMORED / HELMETED — sealed-helmet bounty hunters, full-coverage power-armored super-soldiers, war-armored knights in heavy plate.
• ~10% ROBOT / ANDROID / CYBORG — battle-droid commander, humanoid synthetic, chrome endoskeleton, cyborg veteran (not silly).

ROLE MIX (rotate — don't cluster): Bounty hunter / Smuggler / Astronaut / Explorer / Pilot / Mercenary / Scientist / Soldier / Scavenger / Engineer / Medic / Captain / Navigator / Spy / Diplomat / Mystic / Warlord / Sniper / Mechanic / Archaeologist / Trader / Refugee / Drifter / Commander.

WHAT MAKES A CHARACTER COOL: specific weathering (scars, cybernetic replacements, burn marks, tattoos, battle damage). Interesting gear (specific weapons, tools, gadgets, trophies). Attitude in the description ("grizzled", "sharp-eyed", "battle-scarred", "war-weary", "cocky"). Period/culture flavor (samurai-influenced, frontier-in-space, military-spec, nomadic-tribal, corporate-sleek).

MUST-HAVE: 20-35 words strict. Role FIRST, visual description SECOND, gear/wardrobe THIRD. SOLO character, no companions. Gender-neutral or mix freely. Species-neutral language ("scaled warrior" not a franchise term).`,
    touchpoints: [
      'Bounty hunter — tall scaled reptilian with scarred snout and cybernetic targeting-eye, wearing battered metallic plate armor with trophy bones wired to shoulder-guards.',
      'Astronaut — weathered human woman with close-cropped grey hair and radiation burns on her neck, wearing patched EVA suit with mission patches faded to ghosts.',
      'Smuggler — wiry four-armed alien with blue-grey skin and sharp mandibles, wearing leather flight-jacket over cargo vest, twin pistols in cross-draw holsters.',
      'Heavy trooper — massive armored figure in scarred power-armor with glowing eye-slits, chain-saw blade mag-locked to back, kill-tallies scratched into shoulder-plate.',
      'Mechanic — stocky cyborg with one mechanical arm ending in integrated tools, oil-stained coveralls, welding goggles pushed up on forehead, wrench in human hand.',
      'Explorer — lanky insectoid with compound eyes and chitinous exoskeleton, wearing expedition pack bristling with survey instruments, star-charts rolled in a tube on the back.',
      'Sniper — lean human with targeting reticle tattooed around one eye and silence-scarred throat, wearing ghillie-tech suit that shifts patterns, long-barrel rifle in hands.',
      'Diplomat — elegant alien with color-changing skin and elaborate head-crest, wearing formal robes with translation device and credentials on ornate chain.',
    ],
    instructions: `Each entry: ONE character, 20-35 words. Format: "[Role] — [visual description], wearing [gear]". Output as a NUMBERED list.

STRICT BANS: no franchise / species / trademark / character names; no children; no sexualized descriptions; no lame/passive characters (everyone has a STORY); no mushrooms / jellyfish / coral / fungi / plants as characters; no "beautiful woman" / "handsome man" (describe the character, not their attractiveness).`,
  },

  cosmic_oracle_locations: {
    format: 'simple',
    theme: `STARBOT COSMIC-ORACLE LOCATIONS — painted sci-fi scenes set in OUR universe (not any existing franchise). Each entry: 25-40 words. ONE specific alien/cosmic location with time-of-cosmic-day + visible cosmic-light-source + atmospheric detail.

CORE RULE: NEVER name any sci-fi franchise, named world, named species, or trademark. Do not write "Coruscant", "Kashyyyk", "Mustafar", "Kamino", "Bespin", "Arrakis", "Caladan", "Giedi-Prime", "Forerunner", "Covenant", "LV-426", "Engineer", "xenomorph", "Citadel", "Omega", "Tuchanka", "krogan", "Eros", "Gargantua", "Necron", "Eldar", "Aeldari", "Polyphemus", "Blade Runner", "Avatar floating mountains", "Star Wars", "Star Trek", "Halo", "Mass Effect", "Dune", "Alien", "Warhammer", or any franchise. Describe FEATURES, not franchises.

LOCATION CATEGORIES (rotate evenly):
• Tower-stacked megacity worlds (continent-spanning skyline, layered traffic, light-pollution skyglow)
• Desert / dune worlds (sand sea, wind-carved spires, salt flats, lithic plains)
• Canopy jungle worlds (towering bioluminescent canopy, vine bridges, light shafts)
• Lava / volcanic worlds (lava lakes, basalt cliffs, ash storms, magma rivers)
• Ocean / storm worlds (continent-sized waves, lightning-laced sky, floating platforms)
• Cloud-city worlds (gas-giant cloud layers, anchored skybridges, sunset-banded atmosphere)
• Ringworld interiors (curving land arching overhead into far skyline)
• Garden-arm megastructures (organic-curved orbital habitats with greenery, parks, water features)
• Forge / industrial worlds (refinery skylines, glowing slag-fields, smoke towers)
• Dead worlds / ruin worlds (collapsed temples, fossil cities, exposed strata of past civilizations)
• Crystal worlds (refractive prismatic landscape, geode caverns, light-piping flora)
• Ice / glacial worlds (frozen seas, ice spires, methane glaciers, aurora-banded sky)
• Hive / corridor habitats (inside-something — endless tunnels, biomechanical secretion-walls)
• Tomb-pyramid worlds (ancient stone megastructures, monolithic geometry, low haze)
• Pure-space cosmic phenomena (Dyson sphere interior, wormhole throat, neutron star surface, dead-god gravesite, black hole accretion disk, dust nebula, supernova remnant)

EVERY ENTRY MUST INCLUDE:
1. SETTING — specific alien/cosmic environment (described by features, never named after a franchise world)
2. COSMIC TIME — nebula-twilight, pulsar-midnight, binary-dawn, supernova-noon, etc.
3. LIGHT SOURCE IN FRAME — black-hole lens-halo, dying-red-giant, crystal refraction, ring-curvature, etc.
4. ATMOSPHERIC DETAIL — exotic: fluorescent-spore-fog, gravity-shear-shimmer, methane-rain, plasma-glow, etc.

VARIETY: spread evenly across categories (no more than ~12 per category). Vary color palettes (not all red/orange). At least 40% NOT on planet surface (in-space, megastructure, inside-something). Vary atmosphere types.`,
    touchpoints: [
      'Tower-stacked megacity at perpetual neon-twilight, kilometer-tall spires pierce violet smog layers as a distant dying star casts amber light through traffic streams.',
      'Bioluminescent canopy forest at moonless midnight, three small moons visible through tangled branches emit pale cyan light, phosphorescent fungi pulse along the trunks.',
      'Deep-desert dune sea at binary-dawn, twin suns cresting obsidian rock formations cast sharp crimson and violet shadows across rolling dunes, plasma mirages shimmer over crests.',
      'Ringworld shadow-zone at eclipse-transition, the ring\'s edge bisects a red giant sun creating a terminator line of fire, shadow sweeps across landscape at visible speed.',
      'Wormhole throat interior at flux-moment, Einstein-Rosen bridge walls shimmer with chromatic aberration, passing matter streams create lightning-like discharges through exotic-matter framework.',
      'Ice-planet surface at whiteout-noon, weak sunlight diffuses through horizontal snow creating featureless ivory void, frozen methane crystals suspended in atmosphere refract rainbow halos.',
      'Neutron star surface at quantum-noon, surface gravity lenses light into impossible angles, matter compressed to nuclear density glows white-hot, magnetic field lines visible as plasma arcs.',
      'Dyson sphere interior surface at perpetual-zenith, the encapsulated star hangs motionless overhead casting white light across curved metal landscape, atmosphere glows with trapped stellar radiation.',
    ],
    instructions: `Each entry: ONE location, 25-40 words. Format: free-form prose, "[setting] at [cosmic time], [light source detail], [atmospheric detail]". Output as a NUMBERED list.

STRICT BANS: NO franchise / world / species / character / trademark names; NO generic "blue sky" (specify alien sky colors); NO characters/people (separate pool); no "desert with twin suns" cliché.`,
  },

  lighting: {
    format: 'simple',
    theme: `STARBOT LIGHTING — sci-fi + real-astronomy lighting treatments. Each entry: 10-20 words. ONE specific lighting treatment.

CORE RULE: NO FRANCHISE NAMES. Describe lighting treatments by their visual signature; never by a franchise / movie / trademark. Do not write "Blade Runner", "Dune", "Interstellar", "Gargantua", "2001", "Arrival", "Annihilation", "Foundation", "Alien", "Prometheus", "Halo", "Mass Effect", "Star Wars", "Star Trek", "Avatar", or any other franchise / trademark term.

CATEGORIES (distribute across the pool):
• Star illumination: single-star, binary-sun double-light, planet-glow backlighting, eclipse-corona ring-light, sunrise-from-orbit
• Cosmic light sources: nebula-backlight, nebula-curtain multi-color wash, supernova-flash, accretion-disc lens-light, pulsar-strobe, magnetic-field aurora-cast
• Scientific imaging: JWST-infrared mapped-color (orange-teal), Hubble-visible-light (natural blue-amber), H-alpha red hydrogen-line, false-color science mapping, ultraviolet-imaged, X-ray-mapped cold-color
• Urban / industrial: neon-reflected wet-streets, industrial-strobe emergency, cybercity-neon-saturation, fluorescent-ship-interior, plasma-shield blue-ring
• Atmospheric / planetary: desert binary-star, volcanic-planet underlight (lava glow), ice-world twin-moon silver, gas-giant-reflected warm-cream, alien-bioluminescence gentle-glow
• Cinematic moods: warp-tunnel streaked-light, monolith-stark-geometric, Dyson-sphere glow-from-inside-out, space-station-command-dim, cryo-blue-sleep-chamber, emergency-red-alert

Each entry: 10-20 words. Sci-fi specific named treatment + 1-2 visual qualifiers.`,
    touchpoints: [
      'Single-star illumination with one warm-amber sun casting long sharp shadows over alien terrain.',
      'Binary-sun double-light producing twin overlapping shadows in dust-orange and pale-violet.',
      'Neon-reflected wet streets bouncing magenta and electric-cyan signage across rain-slick concrete.',
      'JWST-infrared mapped color treatment in deep-orange and teal across cosmic structure.',
      'Accretion-disc lens-light bending around a black-hole event horizon in golden-rim arcs.',
      'Industrial emergency strobe flashing intermittent red across smoky corridor surfaces.',
      'Alien bioluminescence gentle glow in soft cyan-green washing over moss-covered ruins.',
      'Eclipse-corona ring-light radiating diamond-bright at the moment of total eclipse.',
    ],
    instructions: `Each entry: ONE lighting treatment, 10-20 words. Format: free-form prose. Output as a NUMBERED list. Cinematic / production-art oriented. NO franchise / movie / trademark names anywhere.`,
  },

  scene_palettes: {
    format: 'simple',
    theme: `STARBOT SCENE PALETTES — cosmic + sci-fi color moods. Each entry: 10-20 words. ONE palette with 3-5 color words + 1-line mood.

CORE RULE: NO FRANCHISE NAMES. Describe palettes by color, never by franchise / movie / trademark. Do not write "Blade Runner", "Dune", "Interstellar", "Annihilation", "Arrival", "2001", "Foundation", "Alien", "Prometheus", "Cyberpunk 2077", "Halo", "Mass Effect", or any other franchise.

CATEGORIES (distribute across the pool):
• Cosmic / deep-space: indigo + starlight-white + silver + black-void; rose-pink + violet + amber + deep-blue (nebula); teal + cyan + silver + deep-navy (ion); deep-orange + teal + burnt-amber + cobalt (mapped infrared); orange-disc + cobalt-void + black + golden-rim (accretion); amber + blue + cream + shadow-brown (Hubble-style); pearl + iridescent + moss + faded-rose (shimmer)
• Planetary surfaces: pewter + bone + black-shadow + amber-earth (moon); rust-red + tan + deep-shadow-brown + pale-sky (Mars); pale-blue + white + silver-streak + black-crack (ice-moon); orange + brown + amber + deep-teal-sky (hazy moon); gold + cream + shadow-band + deep-blue-rings (gas-giant); cream + rust + amber + red-spot (storm-giant)
• Urban / industrial: magenta + cyan + amber + oil-black (wet-neon-night); magenta + cyan + yellow + oil-black (saturated cyberpunk); grey + amber-light + rust + black (mining); rust-orange + tan + deep-shadow-brown + cream (desert-sepia)
• Architectural / cinematic: cool-grey + cream + warm-amber + oil-black (monolith); white + red-accent + black + cream-wood (sterile-corridor); warm-copper + black + deep-gold (faded-empire); oil-black + bone-white + teal-slime (biomechanical hive); violet-crystal + obsidian + amber-warm (crystal vault); pale-blue + crystal-white + silver + deep-cobalt (ice)
• Cosmic phenomena: yellow + orange + red + white-hot-core (solar-flare); white-core + red-ring + blue-shockwave (supernova); iridescent + white + blue + violet (wormhole)

Each entry: 10-20 words. 3-5 specific color words + 1-line mood / world type.`,
    touchpoints: [
      'Deep-space-indigo palette of indigo + starlight-white + silver + black-void, cold cosmic loneliness.',
      'Nebula-pink palette of rose-pink + violet + amber + deep-blue, gas clouds glowing softly.',
      'Wet-neon-night palette of magenta + cyan + amber + oil-black, rain-slick urban surfaces.',
      'JWST-infrared palette of deep-orange + teal + burnt-amber + cobalt, mapped scientific imaging.',
      'Accretion-disc palette of orange-disc + cobalt-void + black + golden-rim, gravity-warping light.',
      'Mars-rust palette of rust-red + tan + deep-shadow-brown + pale-sky, dusty alien surface.',
      'Biomechanical-hive palette of oil-black + bone-white + teal-slime, claustrophobic alien environment.',
      'Solar-flare palette of yellow + orange + red + white-hot-core, stellar surface eruption.',
    ],
    instructions: `Each entry: ONE palette, 10-20 words with 3-5 specific color words + 1-line mood/context. Output as a NUMBERED list. NO franchise / movie / trademark names anywhere.`,
  },

  cosmic_phenomena: {
    format: 'simple',
    theme: `STARBOT COSMIC PHENOMENA — FICTIONAL sci-fi space/cosmic marvels for the cosmic-vista path. Set in OUR universe (not any existing franchise). Cinematic visual register. Pure environment, no characters. Each entry: 15-30 words.

CORE RULE: NO FRANCHISE NAMES. Describe phenomena by features, never by a franchise / movie / trademark. Do not write "Blade Runner", "Dune", "Interstellar", "Gargantua", "Annihilation", "Arrival", "Star Wars", "Star Trek", "Halo", "Mass Effect", "Avatar", "2001", "Foundation", "Alien", "Prometheus", or any other franchise.

CATEGORIES (distribute across the pool):
• Nebula sky (impossibly large nebula filling sky, purple-and-gold gas clouds)
• Black-hole event-horizon (accretion disk glowing, lensed light, no franchise name)
• Pulsar ice-world (frozen planet with pulsing lighthouse-beam in sky)
• Binary-sun sunset (two suns setting over alien landscape, long dual shadows)
• Ringed-planet horizon (standing on moon with massive ringed planet filling sky)
• Star-field infinity (impossibly dense starfield, Milky-Way-like arc)
• Wormhole entrance (gravitational lens distorting space visible)
• Galaxy-overhead (massive spiral galaxy overhead from moon-surface)
• Supernova mid-explosion (shockwave frozen, expanding light)
• Quasar distant (blinding bright point with jets)
• Comet close-pass (massive comet with visible ice tail near planet)
• Asteroid belt from inside (rocks tumbling past viewer)
• Solar flare eruption (from close solar orbit, prominences leaping)
• Magnetosphere aurora (planet seen from space with aurora ring)
• Fractal-nebula (recursive Mandelbrot-like nebula pattern)
• Plasma-storm sky (colorful plasma discharges in atmosphere)
• Crystal-meteor shower (crystalline rocks refracting as they burn)
• Cosmic string (theoretical gravity-wire visible crossing sky)
• Dark-matter-cloud hinted (invisible mass distorting starlight)
• Dual-galaxy collision (two spirals merging)
• White-hole burst (theoretical reverse-black-hole)
• Brown-dwarf sun (deep-red dim sun with gas-giant orbiting)
• Eclipse-of-nebula (moon passing in front of nebula)
• Ringed-gas-giant with multiple moons aligned
• Hypervelocity-star streaming through cosmos

Each entry must be: FICTIONAL/concept-art sci-fi (real astronomy goes in real_space_subjects), EPIC scale, NO characters / ships (other paths), mind-bending + awe-inspiring.`,
    touchpoints: [
      'Impossibly large nebula filling sky, purple-and-gold gas clouds illuminated from within by hidden young stars, scale grounded by moon-curvature horizon.',
      'Black-hole event-horizon dominating frame, glowing accretion disk lensed into a golden ring by gravity, infalling matter streaming in spiral arcs.',
      'Binary-sun sunset over alien dune landscape, twin suns descending behind monolithic rock formations casting long dual shadows in violet and amber.',
      'Massive ringed planet filling the sky as viewed from its largest moon, ring shadows striping the moonscape with sharp parallel bars.',
      'Wormhole entrance distorting starfield around a perfect ring of light, gravitational lensing bending background stars into rainbow arcs.',
      'Frozen pulsar ice-world with rhythmic lighthouse-beam sweeping across the icy surface, twin moons reflecting pale on the cracked plain.',
      'Supernova mid-explosion frozen at peak intensity, expanding shockwave ring of light, debris streaming radially outward against deep-violet cosmic backdrop.',
      'Asteroid belt from inside viewer perspective, rocks of varied sizes tumbling past in slow-motion silence, distant sun glinting off polished metal-rich surfaces.',
    ],
    instructions: `Each entry: ONE cosmic phenomenon, 15-30 words. Format: free-form prose with scale and detail. Output as a NUMBERED list. FICTIONAL concept-art sci-fi; epic scale; no characters; no ships; NO franchise / trademark / movie names anywhere.`,
  },

  cosmic_anchors: {
    format: 'simple',
    theme: `STARBOT COSMIC FOREGROUND ANCHORS — physical object or structure in FOREGROUND/MIDGROUND of a vast cosmic scene, giving it SCALE and GROUNDING. Each entry: 15-25 words.

The thing in the FOREGROUND that makes the cosmic background feel IMPOSSIBLY VAST. Without an anchor, a nebula is just a pretty gradient. WITH an anchor — a tiny space station silhouetted against it, a derelict ship drifting past, an asteroid catching light — the nebula becomes ENORMOUS and the viewer feels SMALL.

These are NOT the main subject. The cosmic phenomenon IS the subject. These anchors provide SCALE and COMPOSITION.

CORE RULE: NO franchise / trademark / ship names. Describe FEATURES; no "Millennium Falcon", "Normandy", "Enterprise", etc.

ANCHOR CATEGORIES (spread EVENLY — max 2 per category):
1. Space station / outpost — orbital platform, research station, beacon relay, refueling depot
2. Derelict / wreckage — ancient ship hulk, shattered hull, debris field, abandoned probe
3. Asteroid / rock — cratered boulder, crystalline asteroid, tumbling rock catching light
4. Ship silhouette — distant vessel, approaching freighter, patrol craft, generation ship
5. Planetary element — planet's curved horizon, ring system edge, moon's surface, atmosphere limb
6. Megastructure fragment — orbital ring segment, space elevator cable, broken Dyson swarm panel
7. Natural formation — ice comet trailing gas, rogue planet, brown dwarf, stellar remnant
8. Satellite / probe — ancient survey probe, communications array, telescope platform
9. Gateway / portal — warp gate frame, jumpgate ring, gravitational lens structure
10. Organic / alien — living reef structure, bioluminescent organism, cosmic-jellyfish silhouette, space-whale silhouette

DEDUP: no two anchors should be the same type of object. Each must create a DIFFERENT silhouette shape against the cosmic background. Spread sizes: some tiny (probe), some medium (ship), some massive (megastructure fragment).

Describe the OBJECT only — no cosmic background (separate pool). Include physical detail Flux can render: surface texture, light interaction, scale hints. These sit in FOREGROUND — they catch light, cast shadow, have visible detail.`,
    touchpoints: [
      'Tiny orbital research station — wheel-shaped habitat with one rotating ring, communication antennas extended, hull plating darkened by years of micrometeorite impacts.',
      'Ancient derelict hulk — kilometer-long fractured warship drifting end-over-end, hull breaches exposing internal compartments, one engine bell still glowing faintly.',
      'Cratered asteroid catching distant sunlight on one face, the other half black-shadowed, slow-spinning, pocked surface littered with metallic ore deposits glinting.',
      'Distant patrol craft silhouette banking against a nebula backdrop, sleek angular hull catching rim-light, engine plume tracing a fading arc.',
      'Curved planetary horizon at the bottom of the frame, atmospheric haze layer glowing soft blue, weather systems visible as swirled cloud patterns.',
      'Broken orbital ring segment drifting in pieces, internal structure exposed showing habitat decks, vegetation visible through cracked viewports.',
      'Solitary ice comet trailing a long gas tail, cyan-white plume backlit by distant sun, nucleus dark and pitted with sublimation craters.',
      'Ancient survey probe — boxy chassis with two solar panels deployed, antenna pointed at far star, surface scoured by interstellar dust.',
    ],
    instructions: `Each entry: ONE foreground anchor object, 15-25 words. Format: free-form prose describing the OBJECT only (no cosmic background — that's a separate pool). Output as a NUMBERED list. NO franchise / trademark / ship names.`,
  },

  cozy_sci_fi_interiors: {
    theme:
      'WARM lived-in sci-fi interiors — the OPPOSITE of monumental awe. Personal scale, soft light, intimate moments. A view from inside a quiet sanctuary. Includes private quarters AND cozy social spaces (bars, lounges, observation decks, skybars, viewport lookouts).',
    touchpoints: [
      'Cowboy Bebop Bebop ship interior (lived-in, gritty, warm lamps)',
      'Star Trek Ten Forward lounge (curved viewport, plush seating, soft amber light)',
      'Mass Effect Citadel skybar (planet view, intimate booths)',
      'Star Wars cantina (alien clientele, bar lights, low-key warmth)',
      'Blade Runner noodle bar (steam, neon, cramped intimacy)',
      'Studio Ghibli pastoral kitchens',
      'Solar Sands homestead aesthetic',
      'Firefly Serenity cargo hold + galley',
      'Ad Astra capsule interior (clean isolation)',
      'Babylon 5 ZocaloAvatar — Pandora floating mountains observation lounge',
      'The Expanse Belter dive bar',
      'observation deck looking down at a planet below — Earth-like, Mars-like, or gas-giant',
    ],
    instructions: `Cozy + lived-in is the KEY. Warm light, personal objects, plants, soft fabrics. SCI-FI is in materials (alien view through window, transparent floor, holographic accent) but MOOD is "home" or "neighborhood haunt".

ONLY THESE SCENE TYPES (mix them, never repeat the same archetype twice):
- Cozy command bridge / cockpit (single pilot at console, warm panel glow, porthole view of stars/nebula/planet)
- Bedroom / private quarters / sleeping nook / berth / captain's cabin (hammocks, quilts, personal mementos)
- Bar / lounge / cantina / cafe / noodle joint / tea house / pub (warm intimate booths, sometimes 2-4 distant patrons)
- Lab / workshop / engineering nook / tinkerer's corner (researcher's cozy lab with porthole, specimens, plants)
- Atrium / greenhouse / hydroponics / botanical garden / arboretum / conservatory / terrarium / aquarium (lush plants, often biomech or alien biology mixed in, porthole or skylight)
- Reading nook / sitting area / study / den / library corner
- Galley / kitchen / mess hall (warm cooking, baking, dining)
- Observation deck / skybar / sky-lounge / panoramic viewport lookout / dome (BIG curved window with planet below or nebula)

FORBIDDEN scene types (NEVER write these):
- Cargo holds / cargo bays / cargo containers / storage lockers / storage closets / supply rooms
- Corridors / hallways / passages / maintenance tunnels / utility shafts / access ducts / crawlspaces
- Waiting areas / departure lounges / terminal lobbies / queue zones
- Escape pods / emergency capsules / life pods (unless converted into a fully-decorated bedroom-style nook)
- Airlocks / airlock staging areas (only OK if explicitly described as "converted into a [bedroom/sitting nook]")
- Gyms / locker rooms / showers / toilets / bathrooms / wash rooms
- War rooms / tactical centers / interrogation rooms / operating theaters
- Foundries / smelting bays / forge rooms / industrial floors / factory floors
- Memorial / shrine / temple / monastery / cult / ritual chamber spaces

For observation-deck / skybar / lounge scenes: BIG curved viewport showing a planet below (Earth-like, Mars-like ringed gas giant, etc.) or vast nebula is the centerpiece. Cozy still wins the foreground — armchairs, plush booths, glowing lamps — but the window is the gravitational pull.

Camera INTIMATE — small enclosed space, never wide corridor or transit area. May include 0-1 figures (rarely 2-4 distant patrons in bar/lounge). NEVER first-person POV.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  // Simple format opt-out — recipes can set `format: 'simple'` to skip the
  // Rich Scene Seed scaffolding and just pass through theme + instructions.
  if (recipe.format === 'simple') {
    return `${recipe.theme}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }

  return `Generate ${count} Rich Scene Seeds for the StarBot ${POOL} pool. StarBot is a sci-fi image-generation bot whose renders should feel like stills from an unmade epic film — multi-tier depth, scale provers, materially specific, narratively suggestive.

━━━ POOL THEME ━━━
${recipe.theme}

━━━ AESTHETIC TOUCHPOINTS (draw from these) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

━━━ POOL-SPECIFIC INSTRUCTIONS ━━━
${recipe.instructions}

━━━ THE RICH SCENE SEED FORMAT — every entry follows this EXACTLY ━━━
Each seed is 80-150 words. Use these exact slot headers (the labels themselves are part of the entry):

[NAME / TYPE] — [one-sentence headline anchor]
FOREGROUND: [specific tangible detail — railing, terrace, machinery, ruin, ridge]
MIDGROUND: [city/structure body, with scale provers named — tiny ships, lit windows, bridge traffic, smaller buildings clustered]
DEEP DISTANCE: [the hero anchor, dominant, partially veiled in atmospheric haze]
SKY: [atmospheric layer — smog, twin moons, storm, light pollution glow, ring-curve]
SCALE PROVERS: [3+ explicit small-things-prove-big-things — name them]
MATERIAL: [what surfaces are made of, how they wear, what light does to them]
EMOTIONAL DNA: [the feeling — awe, dread, wonder, melancholy, alien-indifference, sacred]

━━━ HARD RULES ━━━
- Multi-tier composition is NON-NEGOTIABLE — every seed has all 4 depth layers (FG, MG, Deep, Sky) explicitly filled
- Specific material language — ribbed obsidian over concrete (not "alien architecture"), copper-green oxide (not "weathered"), bioluminescent chitin (not "alien biology")
- 3+ named scale provers per seed — "ships as dots", "hundreds of lit windows", "figures-as-pinpricks on the bridge"
- Each seed has a DISTINCT visual DNA — no two seeds should feel interchangeable
- Architectural / biological / mechanical SPECIFICITY — name the style (brutalist / chitin-grown / cyclopean / Kirby-cosmic / etc.)
- 80-150 words per seed
- NO franchise proper nouns (no "Coruscant" / "Reaper" / "Halo" / etc. — INSPIRED BY, not literal)

━━━ FORBIDDEN — every seed must AVOID ━━━
- Generic descriptors without anchors ("vast city", "sprawling spires", "massive structure", "alien architecture") — these are placeholder noise
- The same tower-with-orange-windows-in-fog default; force variety in architectural style across seeds
- Single-hero-building isolation — every seed has supporting density
- Teal+orange default palette mention — let LIGHTING/VIBE handle palette, don't lock it in the seed

━━━ OUTPUT FORMAT — STRICT ━━━
Return EXACTLY ${count} entries as a NUMBERED LIST. Each entry on its OWN SINGLE LINE prefixed by "<number>. ". NO internal newlines within an entry — use commas / semicolons / dashes for internal structure. NO preamble, NO commentary, NO markdown fences, NO JSON.

Example output (the WHOLE response is just this format, nothing else):
1. MEGACITY OF STACKED ZIGGURATS — five-kilometer-tall ribbed obsidian ziggurats in a grid, each a layered city of thousands, connected at seven elevations by 200-meter skybridges, hanging-garden terraces, copper-green oxide bridge-trusses, ships threading the gaps as dots, indifferent megalopolis mood.
2. CANYON CITY OF SUSPENDED BRIDGES — vertical city carved into both faces of a 3-kilometer canyon, linked by 80+ suspension bridges at staggered heights, eroded stone balconies, prayer flags whipping in updraft, canyon walls weeping mineral stains.
3. (... and so on, ${count} numbered entries total)

CRITICAL: each entry MUST be ONE LINE only. If you need to convey FG/MG/Deep/Sky/Material/Emotional context, combine them into ONE comma-separated line. Multi-line entries WILL BE PARSED INCORRECTLY.`;
}

async function callSonnet(prompt) {
  // Node's undici defaults to a 5-minute headers timeout — Sonnet's larger
  // responses (16K output tokens with content) can exceed this. Use a
  // dispatcher with a longer timeout via AbortController fallback.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000); // 15min
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Numbered-list parser. Each entry starts with "<number>. ". Lines that
// don't start with a number are treated as continuations of the previous
// entry (in case Sonnet ignores the "one line per entry" rule and wraps).
function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) {
      // continuation line — append with a space
      current += ' ' + trimmed;
    }
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

// ─── DEDUP ────────────────────────────────────────────────────────────────
// Sonnet clusters within batches and across batches — same theme, slightly
// different wording. Catch it programmatically by hashing a signature of
// each entry (significant keywords from the body, stopwords removed,
// sorted alphabetically). Entries with identical signatures are duplicates.

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'with',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'by',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'they',
  'them',
  'their',
  'her',
  'his',
  'into',
  'onto',
  'through',
  'across',
  'over',
  'under',
  'near',
  'around',
  'between',
  'one',
  'two',
  'three',
  'some',
  'any',
  'all',
  'no',
  'not',
  'than',
  'then',
  'also',
  'so',
  'very',
  'more',
  'most',
  'many',
  'much',
  'each',
  'every',
  'other',
  'another',
  'same',
  'such',
  'only',
  'own',
  'just',
  'still',
  'here',
  'there',
  'where',
  'when',
  'what',
  'who',
  'kilometer',
  'kilometers',
  'meter',
  'meters',
  'foot',
  'feet',
  'mile',
  'miles',
  'wide',
  'tall',
  'long',
  'high',
  'low',
  'large',
  'small',
  'massive',
  'huge',
  'vast',
  'huge',
  'across',
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
  'meterdiameter',
  'kilometerdiameter',
  'metertall',
  'kilometertall',
]);

function signatureOf(entry) {
  // Strip the title prefix (everything before the first " — ")
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  // Strip any Rich-Scene-Seed bloat
  const fgIdx = body.indexOf(' FOREGROUND:');
  if (fgIdx > 0) body = body.slice(0, fgIdx);
  // Tokenize and extract significant content nouns/adjectives
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20); // first 20 significant words of the body
  // Sort alphabetically so word-order shuffling doesn't escape dedup
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

// Title-only signature for pools with "TITLE — description" or
// "lowercase phrase — description" shape. Two entries with the same
// title but different bodies should still be treated as duplicates —
// signatureOf strips titles, so we need a separate guard.
function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null; // no title — fall back to signature-only dedup
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); // body-signature → first entry that claimed it
  const seenTitles = new Map(); // title (lowercased) → first entry that claimed it
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenTitles.get(title).slice(0, 80),
        reason: 'title',
      });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      // Body was too short to signature — keep (and register title)
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenSigs.get(sig).slice(0, 80),
        reason: 'body',
      });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn(`  ⚠ Sonnet returned no usable entries`);
    return [];
  }
  // Strip Rich-Scene-Seed bloat so signatures aren't polluted
  const stripped = arr
    .map((e) => {
      if (typeof e !== 'string') return null;
      const i = e.indexOf(' FOREGROUND:');
      return i > 0 ? e.slice(0, i).trim() : e;
    })
    .filter(Boolean);
  console.log(`  • Sonnet returned ${stripped.length} entries in ${elapsed}s`);
  return stripped;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/starbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }

  // Determine final target.
  // --target N → fill up to N via iterative gen+dedup loop
  // --count N → single batch of N (legacy behavior)
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;

  if (TARGET !== null) {
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  } else {
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  }

  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    // Smaller batches (15-25) — Sonnet writes faster + ~10K-token responses
    // stay well under fetch timeouts. Overgen by ~50% to absorb dedup losses.
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    // Within-batch dedup
    const within = dedupe(fresh);
    if (within.dropped.length > 0) {
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    }
    // Cross-batch dedup against current pool — body signature AND title
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) {
      console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    }
    // Trim to target if we overshot
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }

  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );

  console.log('\nSample (last 2 added):');
  pool.slice(-2).forEach((e, i) => console.log(`\n[${pool.length - 1 + i}] ${e.slice(0, 400)}...`));

  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
