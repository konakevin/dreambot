/**
 * GlamBot — shared prose blocks.
 *
 * Editorial fashion / beauty / makeup magazine-cover energy. Met-Gala-meets-AI
 * maximalism. Vogue × Harper's Bazaar × viral TikTok. BOLD / HIGH-FASHION /
 * I-WANT-THAT. Character-centric solo compositions. Diverse.
 */

const PROMPT_PREFIX =
  'editorial fashion photograph, Vogue-Harper-Bazaar magazine-cover production quality, high-fashion maximalism, bold confident editorial, viral-worthy beauty moment, studio-cinematic lighting';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const EDITORIAL_FASHION_BLOCK = `━━━ EDITORIAL FASHION (NON-NEGOTIABLE) ━━━

Vogue-cover production value. Magazine-editorial energy. NEVER snapshot, never amateur, never stock-photo. Every render could be an October-Vogue cover. Lighting, styling, backdrop, pose — all editorial-production quality.`;

const DIVERSITY_BLOCK = `━━━ DIVERSITY — NON-NEGOTIABLE ━━━

Explicit variety across renders: ethnicity (Black, East Asian, South Asian, Middle Eastern, Latina, Indigenous, Pacific Islander, White, mixed, alien-fantasy); body-type (rejecting runway-thin-default — curvy, tall, short, muscular, androgynous); age (from 20s to 50s+); style (edgy, sleek, avant-garde, classic, street, couture). Every render should feel distinct.`;

const CONFIDENT_NOT_POSED_BLOCK = `━━━ CONFIDENT NOT POSED ━━━

She is ALIVE + MOVING + PRESENT. Never runway-stiff. Never arms-at-sides static. Turning, glancing, gesturing, mid-motion, smirking, biting-lip, hair-flying. Candid-editorial: caught in the moment she owns the room.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ NO NAMED CHARACTERS ━━━

Describe by features + outfit + vibe. NEVER named IP or real celebrities — no "Bella Hadid", no "Zendaya", no "Rihanna". Our own editorial subjects.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION ━━━

ONE character in frame. No second figure, no male models alongside, no couple shots. Solo editorial hero-shot.`;

const NO_COZY_NO_SOFT_BLOCK = `━━━ NO COZY / NO SOFT ━━━

GlamBot is BOLD / EDGY / HIGH-FASHION. Never cozy-soft. Never pastel-precious. Never Hallmark. CoquetteBot owns the soft lane — GlamBot owns the bold lane.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — EDITORIAL ━━━

Editorial-photoshoot × 10. Glowing skin beyond what real skin can be. Makeup more precise than human hand can apply. Hair more gravity-defying than physics allows. Outfits more impossibly-tailored than any couture house achieves. Magazine-cover maxed.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — EDITORIAL AMPLIFICATION ━━━

The theme is the canvas, not the ceiling. Every path — makeup / fashion / hair / nails / avant-garde — must show CRAZY, impossible, maxed-out, show-stopping high-fashion work. Dial saturation + scale + complexity + detail + materials + impossibility to the absolute limit within editorial tone. Never realistic, never tame. The kind of work that makes viewers stop-and-stare, screenshot, try to recreate. If it wouldn't get 10M views on TikTok — dial up.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  EDITORIAL_FASHION_BLOCK,
  DIVERSITY_BLOCK,
  CONFIDENT_NOT_POSED_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  SOLO_COMPOSITION_BLOCK,
  NO_COZY_NO_SOFT_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
