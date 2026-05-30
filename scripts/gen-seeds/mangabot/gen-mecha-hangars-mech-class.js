#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_mech_class.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} MECH-CLASS entries for a MangaBot mecha-hangar keyframe. SCENE-LED — each entry names the LINEAGE + SILHOUETTE + 2 ICONIC COLORS + KEY HARDWARE so Flux locks the mech identity. The mech is the HERO of the frame (50-80% of canvas).

Each entry: 12-22 words. ONE specific anime-mech class. Genre-specific lineage. Include silhouette descriptor + 2 visual colors + iconic shape/hardware.

GENRE LINEAGE (this 25-entry pool spreads across these — NEVER western Real-Steel/Transformers/Pacific-Rim):
- Gundam mobile-suit lineage (RX-78 / Zaku / Char-Aznable-red / Wing-Zero)
- Eva / Khara biomech (Unit-01 magenta-purple / Unit-02 red plug-suit-shaped, restrained-titan feel)
- Patlabor Ingram police-mech (industrial yellow-grey / Tokyo-PD weathered)
- Macross VF-1 transformable Valkyrie (fighter / GERWALK / battroid)
- Code-Geass Knightmare (Lancelot white-gold / Guren red-radiant-wave)
- Big-O art-deco mecha (black with gold-trim, fedora-shouldered, Paradigm City)
- Ghost-in-the-Shell Tachikoma spider-tank (cyan multi-leg AI)
- Knights-of-Sidonia Garde (organic-spike single-pilot frame)
- Aldnoah Kataphrakt (heavy single-purpose battlefield mech)
- Iron-Giant retro all-metal one-piece body
- Cowboy-Bebop Hammerhead utility-mech
- Yamato Cosmo-Zero / Cosmo Falcon retro space-fighter mech

ANTI-T-POSE: this axis describes the CLASS — posture is owned by mech_posture. Don't lock the class to a static stance.

ANTI-MT-FUJI: don't describe landscape — describe the MECH itself. (Hangar is owned by hangar_setting.)

DO write:
- A Gundam RX-78 mobile-suit silhouette in chipped white-blue-red enamel, vulcan-cannons at the head, vernier thrusters on the back-skirt
- An Eva-style biomech in magenta-purple armor-plate over restrained-titan musculature, single horn at the forehead, vascular gloss
- A Patlabor Ingram police-mech in industrial yellow-grey paint, riot-shield-arm and baton-arm, blocky utilitarian frame
- A Macross VF-1 Valkyrie mid-GERWALK transformation, white-and-red, wing-arms partly-folded, fighter-cockpit-canopy fronting the chest
- A Code-Geass Lancelot knightmare in white-and-gold trim, landspinner-wheels at the heels, slim-cavalry silhouette
- A Big-O art-deco mecha in matte-black with gold-trim, fedora-shouldered crown, chrome-piston arms
- A Ghost-in-the-Shell Tachikoma spider-tank in cyan multi-leg articulated frame with single-eye-cyclops cluster

DO NOT write:
- A static T-pose stance (posture lives in mech_posture)
- Hangar / landscape content (lives in hangar_setting)
- Western Real-Steel / Transformers / Pacific-Rim / Hollywood-CGI mechs
- Generic "giant robot" — name the specific lineage
- Pilots / crew / characters (lives in scale_provers)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
