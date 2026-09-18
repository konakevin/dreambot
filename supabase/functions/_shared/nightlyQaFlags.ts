/**
 * nightlyQaFlags.ts — ONE typed parser for the nightly-dreams request flags (SCENE_FIRST_ACTION_PLAN.md §11.1).
 *
 * Behaviour-neutral extraction (2026-09-06) of the 40-odd ad-hoc `const force_x = body.force_x === true` lines
 * that lived inline in nightly-dreams/index.ts. Every coercion below is byte-for-byte the original one —
 * locked by __tests__/lib/nightlyQaFlags.test.ts. Nightly destructures the result under the same local names,
 * so downstream code is untouched.
 *
 * All `force_*` flags are QA-only (worker-token gated); `first_dream`, `strict_face_swap`, `persist`,
 * `queue_job_id` and `force_place` are also set by the production first-dream / queue paths.
 */
import type { MoodAxes } from './vibeProfile.ts';
import type { CharacterSlotPipelineInput, DualSlots, SingleSlots } from './characterSlotPrompt.ts';

export interface NightlyQaFlags {
  /** Preserves an explicit null (= "force scene-only, no cast"); undefined when absent. */
  force_cast_role: string | null | undefined;
  force_medium: string | undefined;
  /** QA ONLY: pin the CONTRACT's look on BOTH the minimal and the full looks path. Unlike `force_look` this does
   *  NOT alias to force_medium, so it does not skip the minimal contract build — which is what makes an
   *  A/B of LOOKS_MINIMAL a like-for-like comparison instead of a comparison against a disabled engine. */
  qa_pin_look: string | undefined;
  /** QA ONLY: blank the time/weather/phenomena axes on the minimal path, so the render's atmosphere comes from the
   *  vibe fragment alone. Isolates whether those axes' camera language ("low sun backlighting", "polished
   *  mirror-bright") is what overrides a painterly look — the full looks path blanks them by design. */
  qa_blank_axes: boolean;
  /** QA ONLY: which variant of the look's fragment to send.
   *   'default'  face_swap_flux_fragment — ships today; wedges "lifelike adult faces, realistic human facial
   *              proportions with true-to-life eyes" BETWEEN the style noun and the style's own description.
   *   'plain'    flux_fragment — the style, with no face clause at all.
   *   'geometry' flux_fragment + the geometric constraint the swap detector needs, with every word that asserts
   *              "photograph" removed. The candidate fix. */
  qa_fragment_mode: 'default' | 'plain' | 'geometry';
  /** QA ONLY — the CONTROL arm. Look-neutral framing is now ON for every nightly cast render, so this flag
   *  puts the LEGACY integration line back: "the clear subject of a candid cinematic photograph", "a relaxed
   *  warm editorial photograph", "photographic realism, filmic colour". Those follow the look in the prompt
   *  and outnumber it 3 to 1, which is why a pinned classical_oil rendered as an oil painting only 2 of 9
   *  times. Use this to re-measure that baseline, not to ship. */
  qa_legacy_framing: boolean;
  /** Pin a catalog LOOK by key (NIGHTLY_LOOKS_REFACTOR_PLAN.md Phase A2): resolves like force_medium AND
   *  exempts the flux-1.1-pro override library so the prompt carries THIS look's fragment; the render
   *  stamps `look:<key>` + `look_source:force`. */
  force_look: string | undefined;
  /** QA: run the LOOKS PATH (style contract) for this render regardless of engine_config.nightly_looks_mode. */
  force_looks_path: boolean;
  /** QA: turn the SET DRESSER + COSTUME DESIGNER brief OFF on the looks path (it is on by default) for an A/B. */
  force_plain_brief: boolean;
  /** Looks path swap geometry A/B (2026-09-12): 'natural' lets the couple touch / move (strict re-render on a
   *  failed split); 'strict' pins the legacy geometry. Null = the path's default. */
  force_swap_geometry: 'strict' | 'natural' | null;
  /** Looks path FRAMING axis (2026-09-12, pools/nightly_framings.ts): pin a recipe by key for a matrix. */
  force_framing: string | null;
  /** 1.2.0-parity photo-prior line on the looks path (see CharacterSlotPipelineInput.photoPriors). */
  force_photo_priors: boolean;
  force_moods: MoodAxes | undefined;
  /** A string forces that exact beat, `true` forces the roll on. */
  force_awe_beat: string | boolean | undefined;
  /** 1-12, floored; anything else → undefined. */
  force_season_month: number | undefined;
  force_vibe: string | undefined;
  force_nightly_path: string | undefined;
  force_model: string | undefined;
  force_female_hair_pct: number | undefined;
  isFirstDream: boolean;
  force_place: string | undefined;
  force_dual_pool: 'partner' | 'companion' | 'playful' | 'dynamic' | undefined;
  force_single_pool: 'portrait' | 'candid' | 'dynamic' | undefined;
  force_cluster_kind: 'activity' | 'spot' | undefined;
  force_face_swap_eligible_raw: boolean;
  force_playful: boolean;
  force_elegant: boolean;
  force_active: boolean;
  force_single_active: boolean;
  force_solo_comp: 'three_quarter' | 'enviro_wide' | null;
  force_active_pose: boolean;
  force_location_action: boolean;
  force_scene_action: boolean;
  force_dual_closer: boolean;
  force_action_registers: boolean;
  force_plain_location: boolean;
  force_action: string | null;
  force_single_playful: boolean;
  force_single_elegant: boolean;
  force_scene_category: string | null;
  /** Raw flag OR a forced scenario category (a bucket force implies a cast render). */
  force_face_swap_eligible: boolean;
  force_holiday_scene: string | null;
  force_pure_scene: boolean;
  dry_run: boolean;
  force_holiday_sub_theme: string | null;
  force_day_of: string | null;
  /** Day-of COSTUME LOCK (holidayCostumes.ts): pin costume keys in cast order (array or "a,b"); non-null
   *  also forces the roll on. `force_costume_pct` overrides engine_config.day_of_costume_pct (0 = off). */
  force_costume_keys: string[] | null;
  force_costume_pct: number | undefined;
  /** Day-of LOOK (mig 478, dayOfLook.ts): pin the look's dream_mediums key for this render. */
  force_day_of_look: string | null;
  /** QA only: render THIS exact text as the final prompt (skips nothing else — the swap / identity /
   *  quality pipeline runs as normal). Same prompt across models = a fair model comparison. */
  force_final_prompt: string | null;
  /** QA: couple prompt order override (mig 470): 'legacy' | 'subject_first'. */
  force_prompt_style: 'legacy' | 'subject_first' | null;
  /** ALBUM RECIPE probe (2026-09-18): false drops the <COLOUR>-EYED token from the position-1 lock. null = engine default (on). */
  force_eye_lock: boolean | null;
  /** ALBUM RECIPE probe: true applies the 1.2.0 flux override fragments even on the looks engine (normally exempt). */
  force_override_library: boolean;
  /** FLUX COUPLE LAB: pick the couple composer for this request; null = engine_config.nightly_couple_engine. */
  force_couple_engine: 'production' | 'experimental' | null;
  /** FLUX COUPLE LAB: the experimental composer's variant (narrative | narrative_asym | narrative_faces | json). */
  force_couple_variant: string | null;
  /** FLUX COUPLE LAB: per-request big-face tier ceiling / composition gate overrides (numbers 0.2-1). */
  qa_big_face_max_hfrac: number | null;
  qa_max_face_hfrac: number | null;
  /** QA (parity pairs, COUPLE_PROMPT_PARITY_PLAN.md §2): Sonnet's six dual slots, verbatim — the
   *  slot pipeline skips Sonnet and assembles from these. */
  force_dual_slots: DualSlots | null;
  /** The solo twin of force_dual_slots (Phase A2): forced Sonnet slots for a single-cast render. */
  force_single_slots: SingleSlots | null;
  /** QA (parity pairs): the whole character-slot pipeline INPUT of a previous render
   *  (`ai_generation_log.rolled_axes.observability.slotInput`) — replaces the rolled one so the prompt
   *  is a pure function of (input, slots, promptStyle). Dual face-swap renders only. */
  force_slot_input: CharacterSlotPipelineInput | null;
  strict_face_swap: boolean;
  /** Default true; only an explicit `false` disables persistence. */
  persist: boolean;
  queueJobId: string | null;
}

function parseDualSlots(v: unknown): DualSlots | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const str = (k: string): string | null => (typeof o[k] === 'string' ? (o[k] as string) : null);
  const scene = str('scene_description');
  const left = str('left_wardrobe');
  const right = str('right_wardrobe');
  const mood = str('mood');
  if (scene === null || left === null || right === null || mood === null) return null;
  return {
    scene_description: scene,
    left_wardrobe: left,
    right_wardrobe: right,
    mood,
    props: str('props') ?? '',
    action: str('action'),
  };
}

function parseSingleSlots(v: unknown): SingleSlots | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const str = (k: string): string | null => (typeof o[k] === 'string' ? (o[k] as string) : null);
  const scene = str('scene_description');
  const wardrobe = str('wardrobe');
  const mood = str('mood');
  if (scene === null || wardrobe === null || mood === null) return null;
  return {
    scene_description: scene,
    wardrobe,
    mood,
    props: str('props') ?? '',
    action: str('action'),
  };
}

function isSlotInput(v: unknown): v is CharacterSlotPipelineInput {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    Array.isArray(o.cast) &&
    o.cast.length >= 1 &&
    o.cast.length <= 2 &&
    typeof o.mediumFluxFragment === 'string' &&
    'iconicAnchor' in o &&
    'userPlace' in o
  );
}

function num01(x: unknown): number | null {
  const n = typeof x === 'number' ? x : typeof x === 'string' ? Number(x) : NaN;
  return Number.isFinite(n) && n >= 0.2 && n <= 1 ? n : null;
}

export function parseQaFlags(body: Record<string, unknown>): NightlyQaFlags {
  const force_face_swap_eligible_raw = body.force_face_swap_eligible === true;
  const force_scene_category =
    typeof body.force_scene_category === 'string' ? body.force_scene_category : null;
  return {
    force_cast_role:
      'force_cast_role' in body ? (body.force_cast_role as string | null) : undefined,
    force_medium: (body.force_medium as string) || undefined,
    force_look: (body.force_look as string) || undefined,
    qa_pin_look: (body.qa_pin_look as string) || undefined,
    qa_blank_axes: body.qa_blank_axes === true,
    qa_fragment_mode:
      body.qa_fragment_mode === 'plain' || body.qa_fragment_mode === 'geometry'
        ? body.qa_fragment_mode
        : 'default',
    qa_legacy_framing: body.qa_legacy_framing === true,
    force_looks_path: body.force_looks_path === true,
    force_plain_brief: body.force_plain_brief === true,
    force_swap_geometry:
      body.force_swap_geometry === 'natural' || body.force_swap_geometry === 'strict'
        ? body.force_swap_geometry
        : null,
    force_framing: typeof body.force_framing === 'string' ? body.force_framing : null,
    force_photo_priors: body.force_photo_priors === true,
    force_moods:
      body.force_moods && typeof body.force_moods === 'object'
        ? (body.force_moods as MoodAxes)
        : undefined,
    force_awe_beat:
      typeof body.force_awe_beat === 'string'
        ? (body.force_awe_beat as string)
        : body.force_awe_beat === true
          ? true
          : undefined,
    force_season_month:
      typeof body.force_season_month === 'number' &&
      body.force_season_month >= 1 &&
      body.force_season_month <= 12
        ? Math.floor(body.force_season_month)
        : undefined,
    force_vibe: (body.force_vibe as string) || undefined,
    force_nightly_path: (body.force_nightly_path as string) || undefined,
    force_model: (body.force_model as string) || undefined,
    force_female_hair_pct:
      typeof body.force_female_hair_pct === 'number' ? body.force_female_hair_pct : undefined,
    isFirstDream: body.first_dream === true,
    force_place: (body.force_place as string) || undefined,
    force_dual_pool:
      (body.force_dual_pool as 'partner' | 'companion' | 'playful' | 'dynamic' | undefined) ||
      undefined,
    force_single_pool:
      (body.force_single_pool as 'portrait' | 'candid' | 'dynamic' | undefined) || undefined,
    force_cluster_kind: (body.force_cluster_kind as 'activity' | 'spot' | null) || undefined,
    force_face_swap_eligible_raw,
    force_playful: body.force_playful === true,
    force_elegant: body.force_elegant === true,
    force_active: body.force_active === true,
    force_single_active: body.force_single_active === true,
    force_solo_comp:
      body.force_solo_comp === 'three_quarter' || body.force_solo_comp === 'enviro_wide'
        ? (body.force_solo_comp as 'three_quarter' | 'enviro_wide')
        : null,
    force_active_pose: body.force_active_pose === true,
    force_location_action: body.force_location_action === true,
    force_scene_action: body.force_scene_action === true,
    force_dual_closer: body.force_dual_closer === true,
    force_action_registers: body.force_action_registers === true,
    force_plain_location: body.force_plain_location === true,
    force_action: typeof body.force_action === 'string' ? body.force_action : null,
    force_single_playful: body.force_single_playful === true,
    force_single_elegant: body.force_single_elegant === true,
    force_scene_category,
    force_face_swap_eligible: force_face_swap_eligible_raw || force_scene_category !== null,
    force_holiday_scene:
      typeof body.force_holiday_scene === 'string' ? body.force_holiday_scene : null,
    force_pure_scene: body.force_pure_scene === true,
    dry_run: body.dry_run === true,
    force_holiday_sub_theme:
      typeof body.force_holiday_sub_theme === 'string' ? body.force_holiday_sub_theme : null,
    force_day_of: typeof body.force_day_of === 'string' ? body.force_day_of : null,
    force_costume_keys: Array.isArray(body.force_costume_keys)
      ? (body.force_costume_keys as unknown[]).filter((k): k is string => typeof k === 'string')
      : typeof body.force_costume_keys === 'string'
        ? body.force_costume_keys
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : null,
    force_costume_pct:
      typeof body.force_costume_pct === 'number' ? body.force_costume_pct : undefined,
    force_day_of_look: typeof body.force_day_of_look === 'string' ? body.force_day_of_look : null,
    force_eye_lock:
      body.force_eye_lock === false ? false : body.force_eye_lock === true ? true : null,
    force_override_library: body.force_override_library === true,
    force_couple_engine:
      body.force_couple_engine === 'experimental' || body.force_couple_engine === 'production'
        ? body.force_couple_engine
        : null,
    force_couple_variant:
      typeof body.force_couple_variant === 'string' ? body.force_couple_variant : null,
    qa_big_face_max_hfrac: num01(body.qa_big_face_max_hfrac),
    qa_max_face_hfrac: num01(body.qa_max_face_hfrac),
    force_prompt_style:
      body.force_prompt_style === 'legacy' || body.force_prompt_style === 'subject_first'
        ? body.force_prompt_style
        : null,
    force_final_prompt:
      typeof body.force_final_prompt === 'string' && body.force_final_prompt.trim().length > 0
        ? body.force_final_prompt
        : null,
    force_dual_slots: parseDualSlots(body.force_dual_slots),
    force_single_slots: parseSingleSlots(body.force_single_slots),
    force_slot_input: isSlotInput(body.force_slot_input) ? body.force_slot_input : null,
    strict_face_swap: body.strict_face_swap === true,
    persist: body.persist !== false,
    queueJobId: (body.queue_job_id as string) || null,
  };
}
