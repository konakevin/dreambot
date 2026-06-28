/**
 * SteamBot airship-female — declarative composer form.
 *
 * Action-focused sister to sexy-steampunk-woman. Solo female air-officer /
 * sky-corsair / crew-member caught MID-ACTION on or around a steampunk
 * airship — combat, cannon-fire, repelling boarders, climbing the rigging
 * mid-storm, signaling another ship. Character + outfit + action are the
 * primary draw; airship deck and environment are the stage.
 *
 * Architecture mirrors STEAMBOT_STEAMPUNK_WOMAN's 12-axis character split
 * but swaps `makeup` for `heritage` + `role` (steampunk-globe diversity +
 * airship-officer rank), and trades the stationary `landscape` axis for
 * an `action` axis emphasizing motion + a `backdrop` axis for the distant
 * sky/city/terrain beyond the airship. Adds a 40%-gated `drama` slot for
 * environmental events (lightning, enemy broadside, swooping pursuit).
 *
 * Pool sharing: heritage / role / eyes / hair_color / accessory / backdrop
 * / drama pools are SHARED with the future airship-male sister path. Only
 * skin / hairstyle / outfit / action pools are female-bespoke (Flux
 * gender-coding requires the bans / vocabulary to differ).
 */

module.exports = {
  archetype: 'STEAMBOT_AIRSHIP_FEMALE',
  pools: {
    // Path-bespoke
    action: 'AIRSHIP_FEMALE_ACTION',
    backdrop: 'AIRSHIP_BACKDROP',
    // Character DNA — 8 atomic axes (R2 2026-06-27: nationality-label SKIN
    // pool + template "ethnicity OPENING LOCK" homogenized every render to one
    // grungy brunette. Replaced with PURE-VISUAL atomic axes: skin TONE / face
    // / eye color / hair color / hairstyle, each female-bespoke + clean of the
    // engine-grime/aging contamination. No nationality words anywhere.)
    role: 'AIRSHIP_ROLE',
    skin: 'AIRSHIP_FEMALE_SKIN',
    face: 'AIRSHIP_FEMALE_FACE',
    eyes: 'AIRSHIP_FEMALE_EYES',
    hair_color: 'AIRSHIP_FEMALE_HAIR_COLOR',
    hairstyle: 'AIRSHIP_FEMALE_HAIRSTYLE',
    outfit: 'AIRSHIP_FEMALE_OUTFIT',
    accessory: 'AIRSHIP_ACCESSORY',
    // Conditional (40% gate) — environmental drama
    drama: 'AIRSHIP_DRAMA',
  },
};
