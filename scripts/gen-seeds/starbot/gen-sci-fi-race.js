#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_race.json',
  total: 50,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HUMANOID ALIEN / SCI-FI LINEAGE entries for StarBot's female-explorer and male-explorer paths. Each entry is a SHORT phrase (15-25 words) describing the EXACT visual signature of a HUMAN-SHAPED sci-fi lineage — INSPIRED BY popular sci-fi worlds (Star Wars / Star Trek / Mass Effect / Warhammer 40K / Dune / Halo / Cyberpunk / Avatar / Blade Runner) WITHOUT directly naming any franchise's specific characters or races.

CRITICAL — NO FRANCHISE NAMES IN THE OUTPUT. NEVER write "Twi'lek", "Vulcan", "Klingon", "Mandalorian", "Spartan", "Na'vi", "Asari", "Replicant", "Aeldari", "Space Marine", "N7", "Mjolnir", "Beskar", "Sin'dorei", "Kaldorei", "Dunmer", "Witcher", "Time Lord", "Cylon", "Zabrak", "Togruta", "Mirialan", "Chiss", "Pantoran", "Trill", "Andorian", "Bajoran", "Romulan", "Goa'uld", "Quarian", "Turian", "Drell", "Fremen" or any other proper noun from these IPs.

Instead, describe the AESTHETIC GENERICALLY using physical features:
- Instead of "Twi'lek": "humanoid with two long curving head-tendrils replacing hair"
- Instead of "Vulcan": "sharply pointed-eared humanoid with green-tinted skin and severe arched eyebrows"
- Instead of "Mandalorian": "armored mercenary in full burnished-steel plate with T-shaped visor helmet"
- Instead of "Spartan": "augmented super-soldier in heavy power-armor with integrated AI-glow at the temples"
- Instead of "Na'vi": "tall lithe blue-skinned humanoid with feline cheekbones and long braided queue"

ALL ENTRIES MUST BE HUMAN-SHAPED. NO scaled reptilians, NO beast-headed creatures, NO fully non-humanoid. Distinguishing features sit ON the human-shaped frame.

CRITICAL — NO HORNS, NO ANTLERS, NO TUSKS, NO FANGS, NO DEMONIC IMAGERY. These read fantasy/demonic, not space sci-fi. Distinguishing cranium features should be cranial-ridges, bone-crests, antennae, head-tendrils, head-tentacles, montrals, ear shapes, scalp tattoos — NEVER horns or antlers.

━━━ COVERAGE TARGETS (enforce variety across ${n}) ━━━

POINTED-EAR HUMANOIDS / ELF-CODED (8):
- sharply pointed-eared humanoid with almond-shaped luminous eyes, alabaster skin, regal aristocratic features, otherworldly elegant
- bronze sun-warmed pointed-eared humanoid with leaf-green eyes, tribal forest-bearing, weathered ranger features
- obsidian-grey-skinned pointed-eared humanoid with white-silver hair, glowing red or violet eyes, sharp angular features, deep-shadow heritage
- ash-grey-skinned pointed-eared humanoid with blood-red eyes, sharp eastern-volcanic features, ash-warrior bearing
- pale-ivory-skinned pointed-eared humanoid with glowing emerald-fel-green eyes, magic-fed gaunt elegance
- purple-tinted moon-pale pointed-eared humanoid with glowing silver eyes, exceptionally long ears, druidic facial markings
- olive-tan forest pointed-eared humanoid with hazel eyes, tribal beadwork in hair
- fey-shifted seasonal pointed-eared humanoid with opalescent eyes, longer ears, courtier bearing

DISTINCTIVE-CRANIUM HUMANOIDS (6):
- forehead-ridged warrior humanoid with prominent skull crest, dark mane, fierce battle-bearing
- humanoid with V-shaped brow ridge, pointed ears, severe agency-trained features
- humanoid with prominent ridged nose-bridge, ornate ear-jewelry, devout-fighter bearing
- humanoid with bone-crest crown sweeping back from skull instead of hair, gentle ascetic features
- humanoid with male peacock-fan hair-style swept high (hairstyle = signature), refined courtly features
- humanoid with elongated cranial ridges curving back from the brow, tribal facial tattoos, wilderness-fighter bearing

COLORED-SKIN HUMANOIDS (8):
- humanoid with vivid yellow-green tinted skin, geometric black facial tattoos, ascetic bearing
- humanoid with deep blue skin, glowing red eyes, blue-black hair, sharp aristocratic features
- humanoid with light blue-purple skin, yellow tribal facial markings around the eyes
- humanoid with light blue skin, white antennae extending from the forehead, white hair
- humanoid with distinctive spotted/tattooed pattern running from temples down neck and shoulders
- humanoid with smooth blue skin, head-crests instead of hair, faintly luminous eyes, biotic-glow capable
- humanoid with crimson or violet skin, slit-pupil eyes, sleek bald crown with subtle scalp-tattoos, lithe predatory features
- humanoid with celestial-pale skin, faint glowing patches, divine markings on temples

HEAD-APPENDAGE HUMANOIDS (4):
- humanoid with two long curving head-tendrils replacing hair, bright skin tone (pink, blue, yellow, green), expressive features
- humanoid with striped white-and-skin-tone head montrals (head-tentacles), white facial markings, slim athletic features
- tall lithe blue-skinned humanoid with feline cheekbones, glowing yellow eyes, queue/braid down the back, tribal beadwork
- humanoid with full-face tribal-tattoo down one cheek, dark hair, otherwise indistinguishable from human

ARMORED ICONIC SILHOUETTES (5) — race-as-uniform:
- armored mercenary in full burnished-steel plate with T-shaped visor helmet, jetpack mounted on the back, race-as-uniform identity, never reveals face
- augmented super-soldier in heavy gunmetal power-armor with integrated AI-glow at the temples, helmeted-or-bare-faced
- power-armored religious-warrior in white-and-red plate with bolter-style weapon, religious iconography on the breastplate
- desert-dwelling warrior in tan stillsuit with hooded cloak, water-recycler tubes at the throat, hidden among sand-dunes
- hooded warrior-monk in austere robes with ritualistic scarification, ash-pale skin, ascetic bearing

CYBER / AUGMENTED HUMANS (5):
- heavy-cyber augmented human with full chrome prosthetic arm, exposed neural ports at temple, glowing implant-tattoos, edgerunner bearing
- gracile combat-cyber with retractable mantis-blades sheathed at forearms, chrome-traced cheekbones, mil-cyber bearing
- netrunner with multiple chrome data-jacks at temple and neck, fiber-optic hair-tie glowing soft blue, fingerless mesh gloves
- body-modder with subdermal LED-tracery glowing under skin, cosmetic gene-mods (idealized features), styled-augmented eyes
- mil-spec hardpoint augmented soldier with smartlink visible at the temple, scarred but augmented features

CULTURAL HUMAN VARIANTS (8):
- long-lived noble human with sharply chiseled features, grey-blue eyes, raven-dark hair, tall regal bearing
- sun-warmed Northern fair-skinned human with blue-or-green eyes, golden-blond braided hair, weathered horse-clan features
- Mediterranean-olive-skinned human with dark eyes, dark hair, hawkish noble features, austere southern bearing
- mutant human with pale-gold cat-slit eyes, scarred-pale skin, white-or-platinum hair, hardened alchemical-mutation features
- warm olive-skinned human with brown eyes, dark wavy hair, soldierly aristocratic bearing
- fair Northern human with blue eyes, blond braided beard or hair, weathered cold-clan features
- deep umber dark-skinned human with dark almond eyes, close-cropped or twist-braided hair, desert-warrior bearing
- ivory-fair-skinned human with magical undertone, hazel-or-green eyes, auburn hair, slight magical-glow at the temples

SPACER VARIANTS (4):
- long-limbed low-grav-evolved human with slim build, accent-coded face-tattoos, weathered space-bearing
- stocky high-grav-evolved human with broader denser frame, weathered features, gravity-veteran bearing
- ship-born human with pale long-lived skin from no-sun upbringing, intricate clan-tattoos, distant-traveler eyes
- frontier colonist with UV-tanned pioneer skin, sun-bleached blond hair, dust-weathered features

ARTIFICIAL / SYNTHETIC (2):
- humanoid AI-android indistinguishable from human, slightly too-still poise, alabaster-perfect skin, eerie unblinking gaze
- humanoid AI-android with subtle indicators of inhumanness, brand-name plate at the temple, faint cool inner glow

━━━ RULES ━━━
- EVERY entry must be HUMAN-SHAPED
- ABSOLUTELY NO franchise names — NO Twi'lek, Vulcan, Klingon, Mandalorian, Spartan, Na'vi, Asari, Replicant, Sin'dorei, Kaldorei, Dunmer, Beskar, Mjolnir, N7, etc. Use GENERIC descriptors.
- The aesthetic inspiration stays — describe generically (pointed-ear humanoid with green-tint = Vulcan-inspired without naming)
- Each entry is a SHORT VISUAL SIGNATURE — anatomy, feature, skin/eye color, vibe
- 15-25 words — dense and specific
- GENDER-NEUTRAL
- Each entry visually DISTINCT
- No personality — JUST visual lineage signature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. NO franchise names anywhere.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
