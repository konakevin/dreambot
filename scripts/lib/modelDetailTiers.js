/**
 * Model detail tiers — how many ENTITY-introducing axes each AI image model
 * can render coherently in one frame.
 *
 * The problem: high-faithfulness models (Flux 2 Pro/Max/Flex, Nano Banana,
 * GPT Image 2) render every named entity crisply instead of soft-merging.
 * A brief with 6 distinct entities ("hydrothermal vent + giant isopod +
 * glowing anglerfish + jellyfish foreground + diver + unexpected lantern")
 * becomes a chaotic frame with too many focal points. Older Flux 1.1 Pro
 * soft-merges that same brief into one coherent scene.
 *
 * The fix: at brief-composer time, after rolling all archetype slots, drop
 * "entity" slots down to a per-model cap. ATMOSPHERE / COMPOSITION slots
 * (lighting, water_clarity, camera_framing, etc.) are NEVER capped — they
 * tune how the existing scene looks without adding new objects. So renders
 * stay lush + atmospheric while keeping the entity count coherent.
 *
 * Each archetype tags its slots: anything in `entitySlots` is subject to
 * the cap (with the first `protectedEntityCount` always kept — the hero +
 * essential supporting). Everything else flows through untouched.
 *
 * Conservative caps shipped 2026-06-01 — tuned for OceanBot but applies
 * fleet-wide via brief-composer. Other bots opt in by tagging `entitySlots`
 * on their archetypes; archetypes without the tag are unaffected (no-op).
 */

// Lower-case prefix-matched so callers don't need to worry about exact
// provider/model id formatting. First match wins; DEFAULT_CAP applies
// when nothing matches.
const ENTITY_CAPS_BY_MODEL = {
  // Older Flux 1.x — soft-merger family. Renders 5–6 entities coherently.
  'black-forest-labs/flux-1.1-pro-ultra': 6,
  'black-forest-labs/flux-1.1-pro': 6,
  'black-forest-labs/flux-dev': 5,
  // Newer Flux 2 — much higher detail fidelity. Renders every entity
  // crisply, so cap at 4 to keep the frame coherent.
  'black-forest-labs/flux-2-pro': 4,
  'black-forest-labs/flux-2-max': 4,
  'black-forest-labs/flux-2-flex': 4,
  // Native non-Flux providers — extreme prompt faithfulness. Each named
  // entity gets its own crisp render slot; cap at 3 to leave room for
  // atmosphere / palette dominance.
  'google/gemini-2-image': 3,
  'openai/gpt-image-2': 3,
};

const DEFAULT_ENTITY_CAP = 5;

/**
 * Returns the entity cap for the given model id. Unknown models fall back
 * to DEFAULT_ENTITY_CAP (intentionally generous — better to over-include
 * than to silently clip a new model's renders).
 */
function entityCapForModel(model) {
  if (!model) return DEFAULT_ENTITY_CAP;
  // Exact match first (cheap path)
  if (model in ENTITY_CAPS_BY_MODEL) return ENTITY_CAPS_BY_MODEL[model];
  // Prefix match for safety against minor id drift (e.g. provider versioning)
  for (const [prefix, cap] of Object.entries(ENTITY_CAPS_BY_MODEL)) {
    if (model.startsWith(prefix)) return cap;
  }
  return DEFAULT_ENTITY_CAP;
}

/**
 * Trim a list of entity slot names down to the model's cap.
 *
 * The first `protectedCount` slots are ALWAYS kept (the path's hero + key
 * supporting characters — defined by the archetype's slot ordering, which
 * is conventionally hero-first). The remaining slots are randomly sampled
 * down to the cap.
 *
 * Returns { keep: Set<string>, drop: string[] } so the composer can NULL
 * the dropped slots' rolled values and the templates' `block()` helper
 * will emit nothing for them.
 *
 * Examples:
 *   selectEntitiesForModel(['a','b','c','d','e','f'], 4, 2)
 *     → keep [a,b] + 2 random from [c,d,e,f] = 4 entities total
 *   selectEntitiesForModel(['a','b','c'], 6, 2)
 *     → keep all 3 (cap > available)
 *   selectEntitiesForModel(['a','b','c','d','e','f'], 3, 3)
 *     → keep [a,b,c] only, drop [d,e,f]
 */
function selectEntitiesForModel(entitySlots, cap, protectedCount) {
  if (!Array.isArray(entitySlots) || entitySlots.length === 0) {
    return { keep: new Set(), drop: [] };
  }
  const safeProtected = Math.max(0, Math.min(protectedCount ?? 0, entitySlots.length));
  const protectedSlots = entitySlots.slice(0, safeProtected);
  const optionalSlots = entitySlots.slice(safeProtected);

  const remainingCap = Math.max(0, cap - protectedSlots.length);
  if (remainingCap >= optionalSlots.length) {
    // Cap is loose enough to keep everything
    return { keep: new Set(entitySlots), drop: [] };
  }

  // Fisher-Yates shuffle clone of optional slots, then take the first N
  const shuffled = optionalSlots.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const sampled = shuffled.slice(0, remainingCap);
  const dropped = shuffled.slice(remainingCap);

  return {
    keep: new Set([...protectedSlots, ...sampled]),
    drop: dropped,
  };
}

module.exports = {
  ENTITY_CAPS_BY_MODEL,
  DEFAULT_ENTITY_CAP,
  entityCapForModel,
  selectEntitiesForModel,
};
