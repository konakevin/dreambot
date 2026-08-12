// sceneFallbackPrompt.ts — when a face swap is UNUSABLE (dual cascade, solo swap
// failed, or identity far below the floor), we must never ship a render full of
// random strangers posing as the user (the "tiffany" incident). Instead we
// re-render the SAME place + medium as a beautiful EMPTY scene — the dream is
// the user's world, no wrong faces. Kevin 2026-08-11, DREAM_CAST_HARDENING_PLAN.md.
//
// Deliberately lightweight (no Sonnet round-trip): it composes the pieces the
// render already computed (medium fragment, location, atmospheric axes) into a
// people-free Flux prompt. Rendered with a plain scene model.

export function buildSceneFallbackPrompt(o: {
  mediumFragment: string;
  location: string;
  timeAxis?: string | null;
  weatherAxis?: string | null;
  phenomenaAxis?: string | null;
}): string {
  const axes = [o.timeAxis, o.weatherAxis, o.phenomenaAxis]
    .map((a) => (a ? a.split(' — ')[0].trim() : ''))
    .filter((a) => a.length > 0)
    .join(', ');
  return [
    o.mediumFragment,
    o.location && o.location.trim().length > 0 ? o.location.trim() : 'a vast dreamlike landscape',
    axes,
    'a sweeping empty landscape, no people, no person, no figures, no crowd, unpopulated',
    'serene and cinematic, foreground midground background stacked top to bottom, layered depth',
    'no text, no words, no letters, no watermarks, ultra detailed',
  ]
    .filter((s) => s && s.trim().length > 0)
    .join(', ');
}
