/**
 * OceanBot mystical-mermaid — function-form character path.
 *
 * Mystical mer-folk across shore / underwater / kelp forests / coral
 * palaces / tide pools / moonlit grottos. Every render slanted toward
 * the magical / mythic "stuff of legend" register Kevin called out.
 * Painted Pre-Raphaelite + Dulac + Rackham illustration medium (per
 * the MERMAID_PAINT mediumStyles override). Cultural diversity baked
 * into the ARCHETYPE + FACE_AND_SKIN pools (Sirena / Mami Wata /
 * Selkie / Ningyo / Rusalka / Naiad / Iara / Sedna / Hai-Ren /
 * Andersen-Western mer-maids).
 *
 * KNOWN HARD ZONE: legacy OceanBot's mermaid-legend path was RETIRED
 * 2026-05-01 (commit f7f319cf) with the note "Flux couldn't render
 * mermaids reliably; pre-Raphaelite/Waterhouse experiments all
 * failed." This attempt engineers against that prior:
 *   • Painted-only medium (Flux handles painted mer-folk anatomy
 *     way better than photoreal — photoreal triggers the
 *     fish-suit-on-naked-woman failure mode)
 *   • Explicit TAIL axis with smooth-transition-from-hips mandate
 *     so Sonnet always describes the iliac-line transition
 *   • Newer models (Flux 1.1 Pro Ultra, GPT Image 2, Gemini) handle
 *     this register much better than what the legacy bot had access to
 *   • Modesty via natural coverings (hair / shell-cluster / kelp-wrap
 *     / scaled chest-plate / coral-rosette) — NEVER topless
 *
 * Function-form (not declarative archetype) — pattern mirrored from
 * GothBot vampire-assassin-female, same as the prior pirate-girl
 * attempt before this pivot.
 *
 * 11 axes per render (10 path + 1 conditional drama @ 40% gate) +
 * universal lighting/atmosphere. MVP-25 per path-bespoke pool;
 * scale to production-200 after R0 approval.
 */

const fs = require('fs');
const path = require('path');

function loadSeed(name) {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
    );
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// 40% chance of an extra mythic beat — distant ship / sea-creature
// companion / aurora escalation / bioluminescent bloom / ancient
// god-pillar emerging. Keeps most renders quiet solo-mer moments,
// with drama as occasional escalation.
const DRAMA_GATE = 0.4;

function pick(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWithPicker(picker, pool, axisLabel) {
  if (
    picker &&
    typeof picker.pickWithRecency === 'function' &&
    Array.isArray(pool) &&
    pool.length > 0
  ) {
    return picker.pickWithRecency(pool, axisLabel);
  }
  return pick(pool);
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Roll axes ──────────────────────────────────────────────────────
  const archetype = pickWithPicker(picker, loadSeed('mermaid_archetype'), 'archetype');
  const face_and_skin = pickWithPicker(picker, loadSeed('mermaid_face_and_skin'), 'face_and_skin');
  const eyes = pickWithPicker(picker, loadSeed('mermaid_eyes'), 'eyes');
  const hair = pickWithPicker(picker, loadSeed('mermaid_hair'), 'hair');
  const tail = pickWithPicker(picker, loadSeed('mermaid_tail'), 'tail');
  const adornment = pickWithPicker(picker, loadSeed('mermaid_adornment'), 'adornment');
  const setting = pickWithPicker(picker, loadSeed('mermaid_setting'), 'setting');
  const action = pickWithPicker(picker, loadSeed('mermaid_action'), 'action');
  const mystical_element = pickWithPicker(
    picker,
    loadSeed('mermaid_mystical_element'),
    'mystical_element'
  );
  const camera_framing = pickWithPicker(
    picker,
    loadSeed('mermaid_camera_framing'),
    'camera_framing'
  );

  // Conditional drama layer
  const drama =
    Math.random() < DRAMA_GATE
      ? pickWithPicker(picker, loadSeed('mermaid_drama'), 'drama')
      : null;

  // Universal lighting + atmosphere from OceanBot's shared pools.
  const lighting = pickWithPicker(picker, loadSeed('lighting'), 'lighting');
  const atmosphere = pickWithPicker(picker, loadSeed('atmospheres'), 'atmosphere');

  // sharedDNA from rollSharedDNA on bot (palette only on OceanBot)
  const scenePalette = sharedDNA?.scenePalette || '';
  const colorPalette = sharedDNA?.colorPalette || '';

  // Compact opening — extracts the ethnicity-noun-phrase from the
  // face_and_skin pool entry (it's already formatted to lead with
  // "[a/an/the] [CULTURAL-LINEAGE] mermaid with..."), gives Flux's
  // CLIP the species + lineage in the first 5-8 tokens.
  const opener = (face_and_skin || '').split(',')[0];

  return `You are a Pre-Raphaelite painted-illustration writer composing ONE Flux prompt for a MYSTICAL MERMAID SCENE for OceanBot. The render captures a MOMENT in the mer-folk world — shore, underwater, kelp forest, coral palace, sea-cave, tide pool, moonlit grotto. The MERMAID IS CAUGHT IN THE SCENE, not posed for camera. The setting and atmosphere do as much visual work as she does — this is a slice of her mythic world, not a hero-portrait of her.

━━━ THIS IS A SCENE, NOT A POSED PORTRAIT — ABSOLUTE FIRST RULE ━━━
The mermaid is CAUGHT mid-moment in her natural environment. The SETTING is the visual subject as much as she is. She fills 20-40% of the frame, never the full poster space. The camera observes her — she does NOT pose for it. NEVER three-quarter-hero-shot. NEVER head-tilted-back-mid-song. NEVER hand-on-hip. NEVER looking-directly-into-lens. NEVER center-of-frame-with-arms-extended. NEVER her body filling 50%+ of frame. The world breathes around her; we are glimpsing her, not staging her.

━━━ SPECIES LOCK — FIRST TOKENS ━━━
The opening of the Flux prompt MUST start with the cultural-lineage-mermaid noun-phrase from the FACE-AND-SKIN axis below (e.g. "a Filipino Sirena mermaid...", "a West African Mami Wata mermaid..."). The word "mermaid" MUST appear in the first 5-8 tokens — Flux locks species from there. Do NOT generalize to "a woman" or "a sea-creature". Use she/her throughout.

━━━ TAIL ANATOMY MANDATE — CRITICAL ━━━
Mer-folk anatomy is hard for Flux. EVERY render MUST describe the tail with EXPLICIT SMOOTH ANATOMY: the scaled tail begins at her hips at the iliac line and transitions smoothly from human torso to scaled tail — NEVER a fish stuck on the side of a body, NEVER a costume belt, NEVER a separation. The tail anatomy detail from the TAIL axis below is THE LAW.

━━━ NSFW-CLEAN VIA NATURAL COVERINGS — HARD LINE ━━━
The mer-folk is bare to the waist by tradition, BUT her chest is ALWAYS covered by natural elements rolled in the ADORNMENT and HAIR axes — long flowing hair draped across her chest / shell-cluster pectoral / scaled chest-plate that matches the tail / kelp-wrap diagonal / coral-rosette / pearl-bandeau / sea-mist veil. NEVER topless / NEVER nipples-visible / NEVER nudity-cue language. Many compositions will not show her chest directly anyway (back-turned / side-profile / underwater-from-below / partially-occluded-by-environment) — embrace that.

━━━ MYSTICAL SLANT MANDATE ━━━
This is "stuff of legend" — every render carries a MAGICAL element from the MYSTICAL ELEMENT axis below (bioluminescent glow / arcane runes / glowing pearl / fish-spirit attendants / glowing plankton / aurora / floating sparkles / coral-cathedral / impossible-bloom). The render reads as MYTH, not naturalistic ocean documentary. The magic is in the WORLD around her, not just on her.

━━━ HER ARCHETYPE ━━━
${archetype}

━━━ HER COMPACT OPENING (FRONT-LOAD INTO FIRST TOKENS) ━━━
${opener}, ${(eyes || '').split(',')[0]}, ${hair}

━━━ HER TAIL (THE LAW — smooth iliac-line transition) ━━━
${tail}

━━━ HER ADORNMENT (chest-covering + ornamentation) ━━━
${adornment}

━━━ HER ACTION (mid-motion / mythic-poetic) ━━━
${action}

━━━ THE SETTING ━━━
${setting}

━━━ THE MYSTICAL ELEMENT (her legend made visible) ━━━
${mystical_element}
${drama ? `\n━━━ DRAMATIC ESCALATION (woven in subtly) ━━━\n${drama}\n` : ''}
━━━ CAMERA FRAMING (LAW) ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SCENE PALETTE ━━━
${scenePalette}

━━━ COLOR PALETTE (vibe-rolled) ━━━
${colorPalette}

━━━ MOOD ━━━
${(vibeDirective || '').slice(0, 200)}

━━━ COMPOSITION MANDATE — SCENE-FIRST ━━━
This is a MERMAID-CAUGHT-IN-SCENE composition, NOT a hero portrait. She occupies 20-40% of frame — the SETTING + ATMOSPHERE carry the visual weight. Multi-tier depth: foreground (coral / kelp / shell / rock / wave) → her at midground as the inhabitant → background opening to deeper mythic space (cathedral kelp / coral palace receding / aurora-lit sea / abyssal blue). The mystical element layered through the environment. The viewer feels they've STUMBLED ON a mythic moment, not commissioned a portrait. NEVER centered hero-pose. NEVER full-front-to-camera. NEVER her body filling more than 40% of frame.

━━━ STRUCTURE (write the Flux prompt in this order) ━━━
1. OPENING: cultural-lineage-mermaid noun-phrase in first 5-8 tokens, immediately followed by [doing the rolled ACTION] in [the rolled SETTING]
2. TAIL ANATOMY with explicit smooth transition at the iliac line + scale pattern + fin shape
3. ADORNMENT covering her chest + ornament detail
4. HAIR carrying motion (underwater drift / wet-clinging / wind-whipped)
5. Eyes + skin + facial mystical detail
6. Mystical element layered on the scene
7. Setting + atmospheric mood
8. Drama escalation if rolled
9. Lighting + atmosphere
10. Palette + mood

━━━ ALLOWED VOCABULARY ━━━
ancient / mythic / luminescent / bioluminescent / opalescent / iridescent / pearl-sheen / scaled / fluked / floating / suspended / sun-shafted / kelp-shrouded / coral-encrusted / abyssal / glowing / sea-foam / moon-touched / song-borne / spirit-attended / dream-like / ethereal / otherworldly / impossible / arcane / runed / star-flecked / pre-Raphaelite-painted / fairy-tale-plate / mythic-poster / ornamental-linework

━━━ FORBIDDEN VOCABULARY (NSFW-filter triggers + register drift) ━━━
sexy / erotic / sensual / seductive / lingerie / cleavage / topless / nipple / bare-chested / "strategic cutouts" / sheer-panels / wet-lips / sultry / pin-up / boudoir / bodice-ripper / heaving / sweat-slicked / oiled / chiseled / Disney / Ariel / Ponyo

━━━ HARD BANS ━━━
NO multiple primary characters (companion sea-creatures in background = OK). NO modern objects. NO costume-style fish-suit. NO topless mermaid imagery. NO photoreal-skin-rendering language. NO famous mermaid character names. The mermaid is the SUBJECT, the setting is her world, the mystical element is her legend made visible.

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 120-150 words. Weave every axis into a single coherent painted-mythic mermaid moment. NO axis headers in output. NO meta language ("a scene of..."). NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Speak the scene directly, vivid and specific. NEVER name a real photographer, painter, director, studio, or famous mermaid character (Ariel etc.) in the output — describe the look, do not credit it.`;
};
